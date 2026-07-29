import { campaignMeta } from './metaStore';
import { activeCampaignStore } from './campaignRuntime';
import { CHARACTER_VOICES, voiceSummary } from './characterVoices';
import './uxPolish.css';

interface UxPreferences {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  compactHud: boolean;
}

const UX_KEY = 'tales-blaue-adria-ux-v2';
const DEFAULT_PREFERENCES: UxPreferences = {
  highContrast: false,
  largeText: false,
  reducedMotion: false,
  compactHud: false,
};

let preferences = loadPreferences();
let lastFocused: HTMLElement | null = null;
let patchScheduled = false;
let patching = false;

bootWhenReady();

function bootWhenReady(): void {
  const boot = (): boolean => {
    if (!document.getElementById('campaign-game')) return false;
    install();
    return true;
  };
  if (boot()) return;
  const observer = new MutationObserver(() => {
    if (!boot()) return;
    observer.disconnect();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
}

function install(): void {
  if (document.documentElement.classList.contains('ux-polish-v2')) return;
  document.documentElement.classList.add('ux-polish-v2');
  applyPreferences();
  installTopbarTools();
  installPanelDisclosure();
  installMobileTabs();
  installModalExperience();
  installCriticalStatusBanner();
  installKeyboardNavigation();
  installSaveFeedback();
  schedulePatch();
}

function installTopbarTools(): void {
  const topbar = document.querySelector<HTMLElement>('.topbar');
  if (!topbar) return;
  const buildLabel = topbar.querySelector<HTMLElement>('.brand span');
  if (buildLabel) buildLabel.textContent = 'LPC CAMPAIGN · UX / DIALOGUE UPDATE';

  const tools = document.createElement('div');
  tools.className = 'ux-topbar-tools';
  tools.innerHTML = `
    <span class="save-indicator" aria-live="polite"><i></i><b>Gespeichert</b></span>
    <button type="button" data-ux-help aria-label="Bedienungshilfe öffnen">?</button>
    <button type="button" data-ux-settings aria-label="Darstellung einstellen">⚙</button>`;
  topbar.querySelector('nav')?.before(tools);
  tools.querySelector<HTMLButtonElement>('[data-ux-settings]')?.addEventListener('click', openSettings);
  tools.querySelector<HTMLButtonElement>('[data-ux-help]')?.addEventListener('click', openHelp);
}

function installPanelDisclosure(): void {
  document.querySelectorAll<HTMLElement>('.panel > section').forEach((section, index) => {
    if (section.dataset.disclosureReady) return;
    const heading = section.querySelector<HTMLHeadingElement>('h2');
    if (!heading) return;
    section.dataset.disclosureReady = '1';
    const title = heading.textContent?.trim() || `Bereich ${index + 1}`;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'panel-disclosure';
    button.innerHTML = `<span>${escapeHtml(title)}</span><i>⌄</i>`;
    heading.replaceWith(button);
    [...section.children].filter((child) => child !== button).forEach((child) => child.classList.add('panel-disclosure-content'));

    const key = `panel:${title.toLowerCase()}`;
    const collapsed = localStorage.getItem(key) === 'closed';
    section.classList.toggle('collapsed', collapsed);
    button.setAttribute('aria-expanded', String(!collapsed));
    button.addEventListener('click', () => {
      const close = !section.classList.contains('collapsed');
      section.classList.toggle('collapsed', close);
      button.setAttribute('aria-expanded', String(!close));
      localStorage.setItem(key, close ? 'closed' : 'open');
    });
  });
}

function installMobileTabs(): void {
  const setup = (): boolean => {
    const sheet = document.querySelector<HTMLElement>('.mobile-panel-sheet');
    const content = sheet?.querySelector<HTMLElement>('.mobile-sheet-content');
    if (!sheet || !content || sheet.dataset.tabsReady) return Boolean(sheet?.dataset.tabsReady);
    sheet.dataset.tabsReady = '1';
    const tabs = document.createElement('nav');
    tabs.className = 'mobile-hud-tabs';
    tabs.setAttribute('aria-label', 'HUD-Bereiche');
    tabs.innerHTML = `
      <button type="button" data-hud-tab="status" class="active">Status</button>
      <button type="button" data-hud-tab="social">Sozial</button>
      <button type="button" data-hud-tab="progress">Fortschritt</button>`;
    sheet.querySelector('header')?.after(tabs);

    const activate = (id: string): void => {
      tabs.querySelectorAll<HTMLButtonElement>('button').forEach((button) => button.classList.toggle('active', button.dataset.hudTab === id));
      content.querySelectorAll<HTMLElement>('.panel > section, .panel > .quick-actions').forEach((section) => {
        const title = section.querySelector('.panel-disclosure span')?.textContent?.toLowerCase() ?? '';
        section.hidden = groupForPanel(title, section.classList.contains('quick-actions')) !== id;
      });
      content.scrollTo({ top: 0, behavior: preferences.reducedMotion ? 'auto' : 'smooth' });
    };
    tabs.addEventListener('click', (event) => {
      const button = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-hud-tab]');
      if (button?.dataset.hudTab) activate(button.dataset.hudTab);
    });
    const contentObserver = new MutationObserver(() => activate(tabs.querySelector<HTMLButtonElement>('.active')?.dataset.hudTab ?? 'status'));
    contentObserver.observe(content, { childList: true, subtree: false });
    activate('status');
    return true;
  };
  if (setup()) return;
  const observer = new MutationObserver(() => {
    if (!setup()) return;
    observer.disconnect();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
}

function installModalExperience(): void {
  const modals = ['generic-modal', 'battle-modal', 'minigame-modal']
    .map((id) => document.getElementById(id))
    .filter((modal): modal is HTMLElement => Boolean(modal));
  if (!modals.length) return;

  const sync = (): void => {
    if (patching) return;
    for (const modal of modals) {
      const visible = !modal.hidden;
      modal.setAttribute('aria-hidden', String(!visible));
      if (visible && !modal.dataset.focused) {
        modal.dataset.focused = '1';
        lastFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        window.setTimeout(() => focusFirst(modal));
      } else if (!visible && modal.dataset.focused) {
        delete modal.dataset.focused;
        lastFocused?.focus({ preventScroll: true });
      }
    }
    schedulePatch();
  };

  const observer = new MutationObserver(sync);
  modals.forEach((modal) => observer.observe(modal, { attributes: true, attributeFilter: ['hidden'], childList: true, subtree: true, characterData: true }));
  document.addEventListener('keydown', (event) => {
    const open = modals.find((modal) => !modal.hidden);
    const utility = [...document.querySelectorAll<HTMLElement>('.ux-utility-modal')].find((modal) => !modal.hidden);
    const active = utility ?? open;
    if (!active) return;
    if (event.key === 'Escape') {
      const close = active.querySelector<HTMLButtonElement>('.modal-x, [data-mini-close], #battle-close:not([hidden]), [data-ux-close]');
      close?.click();
    }
    if (event.key === 'Tab') trapFocus(event, active);
    if (/^[1-9]$/.test(event.key) && open?.id === 'generic-modal') {
      const buttons = [...open.querySelectorAll<HTMLButtonElement>('#modal-options > button:not(:disabled)')];
      buttons[Number(event.key) - 1]?.click();
    }
  });
  sync();
}

function patchDialogueModal(): void {
  const modal = document.getElementById('generic-modal');
  const title = document.getElementById('modal-title');
  const copy = document.getElementById('modal-copy');
  if (!modal || modal.hidden || !title || !copy) return;

  const voice = Object.values(CHARACTER_VOICES).find((entry) => entry.name === title.textContent?.trim());
  const existing = modal.querySelector<HTMLElement>('.dialogue-persona');
  if (!voice) {
    existing?.remove();
    modal.classList.remove('character-dialogue');
    return;
  }

  modal.classList.add('character-dialogue');
  const summary = voiceSummary(voice.id);
  if (!summary) return;
  const baseRelation = activeCampaignStore()?.snapshot().relationships[voice.id] ?? 0;
  const metaRelation = campaignMeta.snapshot().relationshipBonus[voice.id] ?? 0;
  const total = Math.max(-100, Math.min(100, baseRelation + metaRelation));
  const mood = total >= 30 ? 'vertraut' : total >= 10 ? 'offen' : total >= 0 ? 'neutral' : total >= -20 ? 'skeptisch' : 'angespannt';
  const profile = existing ?? document.createElement('aside');
  profile.className = 'dialogue-persona';
  profile.innerHTML = `
    <div class="dialogue-portrait" style="--portrait:${portraitColor(voice.id)}"><b>${escapeHtml(summary.portrait)}</b></div>
    <div class="dialogue-persona-copy">
      <small>${escapeHtml(summary.role)}</small><strong>${escapeHtml(summary.name)}</strong>
      <p>${escapeHtml(summary.cadence)}</p>
      <div class="dialogue-tags">${summary.values.slice(0, 3).map((value) => `<span>${escapeHtml(value)}</span>`).join('')}</div>
    </div>
    <div class="dialogue-relation">
      <span>Beziehung</span><div><i style="width:${Math.max(0, Math.min(100, total + 50))}%"></i></div>
      <b>${total >= 0 ? '+' : ''}${total}</b><em>${mood}</em>
    </div>`;
  if (!existing) copy.before(profile);
}

function patchChoiceButtons(): void {
  const options = document.getElementById('modal-options');
  if (!options) return;
  options.querySelectorAll<HTMLButtonElement>(':scope > button').forEach((button, index) => {
    if (!button.querySelector('.choice-index')) {
      const badge = document.createElement('i');
      badge.className = 'choice-index';
      badge.textContent = String(index + 1);
      button.prepend(badge);
    }
    const hint = button.querySelector('small')?.textContent ?? '';
    button.dataset.risk = hint.includes('RISKANT') ? 'risky' : hint.includes('ABWÄGUNG') ? 'balanced' : hint.includes('SICHER') ? 'safe' : '';
    button.dataset.choiceTone = [...button.classList].find((name) => name.startsWith('tone-'))?.replace('tone-', '') ?? 'normal';
  });
}

function installCriticalStatusBanner(): void {
  const frame = document.querySelector<HTMLElement>('.world-frame');
  if (!frame) return;
  const banner = document.createElement('button');
  banner.type = 'button';
  banner.className = 'critical-status-banner';
  banner.hidden = true;
  frame.append(banner);

  const update = (): void => {
    const snapshot = activeCampaignStore()?.snapshot();
    if (!snapshot) return;
    const critical: Array<{ label: string; value: number; action: string }> = [];
    if (snapshot.needs.thirst >= 76) critical.push({ label: 'Durst', value: snapshot.needs.thirst, action: 'Wasser im Inventar verwenden' });
    if (snapshot.needs.energy <= 24) critical.push({ label: 'Energie', value: snapshot.needs.energy, action: 'Im Zelt oder über HUD ruhen' });
    if (snapshot.needs.bladder >= 82) critical.push({ label: 'Blase', value: snapshot.needs.bladder, action: 'Sanitär oder Hecke aufsuchen' });
    if (snapshot.needs.hangover >= 62) critical.push({ label: 'Kater', value: snapshot.needs.hangover, action: 'Kaffee, Wasser, Ruhe oder Tablette' });
    const entry = critical[0];
    banner.hidden = !entry;
    if (entry) banner.innerHTML = `<i>!</i><div><strong>${escapeHtml(entry.label)} kritisch · ${Math.round(entry.value)}</strong><small>${escapeHtml(entry.action)}</small></div>`;
  };
  banner.addEventListener('click', () => document.querySelector<HTMLButtonElement>('.mobile-hud-toggle')?.click());
  window.setInterval(update, 900);
  update();
}

function installKeyboardNavigation(): void {
  document.addEventListener('keydown', (event) => {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement || event.target instanceof HTMLTextAreaElement) return;
    if (event.key.toLowerCase() === 'h' && !document.body.classList.contains('campaign-modal-open')) document.querySelector<HTMLButtonElement>('.mobile-hud-toggle')?.click();
    if (event.key.toLowerCase() === 'i' && !document.body.classList.contains('campaign-modal-open')) openHelp();
  });
}

function installSaveFeedback(): void {
  let timer = 0;
  campaignMeta.subscribe(() => {
    const indicator = document.querySelector<HTMLElement>('.save-indicator');
    const label = indicator?.querySelector('b');
    if (!indicator || !label) return;
    indicator.classList.add('saving');
    label.textContent = 'Speichert …';
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      indicator.classList.remove('saving');
      indicator.classList.add('saved');
      label.textContent = 'Gespeichert';
      window.setTimeout(() => indicator.classList.remove('saved'), 900);
    }, 240);
  });
}

function openSettings(): void {
  const panel = ensureUtilityModal('ux-settings-modal', 'Darstellung', `
    <div class="ux-setting-list">
      ${settingToggle('highContrast', 'Hoher Kontrast', 'Stärkere Kanten und klarere Zustandsfarben')}
      ${settingToggle('largeText', 'Größere Schrift', 'Dialoge, Hinweise und Menüs werden vergrößert')}
      ${settingToggle('reducedMotion', 'Reduzierte Bewegung', 'Weniger Kameraführung und UI-Animationen')}
      ${settingToggle('compactHud', 'Kompaktes Desktop-HUD', 'Seitenteile schmaler, Weltbereich größer')}
    </div>`);
  panel.querySelectorAll<HTMLInputElement>('[data-ux-pref]').forEach((input) => input.addEventListener('change', () => {
    const key = input.dataset.uxPref as keyof UxPreferences;
    preferences = { ...preferences, [key]: input.checked };
    localStorage.setItem(UX_KEY, JSON.stringify(preferences));
    applyPreferences();
  }));
}

function openHelp(): void {
  ensureUtilityModal('ux-help-modal', 'Bedienung und Orientierung', `
    <div class="ux-help-grid">
      <section><b>WELT</b><p><kbd>WASD</kbd> oder unsichtbarer Joystick links. <kbd>E</kbd> oder Aktionsknopf rechts.</p></section>
      <section><b>HUD</b><p><kbd>H</kbd> öffnet das mobile HUD. Bereiche sind in Status, Sozial und Fortschritt gegliedert.</p></section>
      <section><b>DIALOGE</b><p><kbd>1–9</kbd> wählt sichtbare Optionen. Risiko, Ton und mögliche Wirkung stehen an der Auswahl.</p></section>
      <section><b>MINISPIELE</b><p>Jedes Spiel startet mit eigener Steuerungserklärung. Hilfe, Pause und Wiederholung bleiben erreichbar.</p></section>
      <section><b>FORTSCHRITT</b><p>Gespräche, Minispiele und Kämpfe verändern Beziehungen, Ruf, Hilfen, Meisterschaft und Finale.</p></section>
      <section><b>SPEICHERN</b><p>Relevante Entscheidungen werden automatisch lokal gespeichert.</p></section>
    </div>`);
}

function ensureUtilityModal(id: string, title: string, body: string): HTMLElement {
  let modal = document.getElementById(id);
  if (!modal) {
    modal = document.createElement('section');
    modal.id = id;
    modal.className = 'ux-utility-modal';
    modal.hidden = true;
    modal.innerHTML = `<article><button type="button" class="modal-x" data-ux-close>×</button><span>UX / ACCESSIBILITY</span><h2></h2><div class="ux-utility-body"></div></article>`;
    document.body.append(modal);
    modal.querySelector<HTMLButtonElement>('[data-ux-close]')?.addEventListener('click', () => closeUtilityModal(modal!));
    modal.addEventListener('click', (event) => { if (event.target === modal) closeUtilityModal(modal!); });
  }
  modal.querySelector('h2')!.textContent = title;
  modal.querySelector<HTMLElement>('.ux-utility-body')!.innerHTML = body;
  modal.hidden = false;
  document.body.classList.add('campaign-modal-open');
  window.setTimeout(() => focusFirst(modal!));
  return modal;
}

function closeUtilityModal(modal: HTMLElement): void {
  modal.hidden = true;
  const otherOpen = [...document.querySelectorAll<HTMLElement>('.modal, .ux-utility-modal')].some((entry) => !entry.hidden);
  document.body.classList.toggle('campaign-modal-open', otherOpen);
}

function settingToggle(key: keyof UxPreferences, label: string, copy: string): string {
  return `<label><input type="checkbox" data-ux-pref="${key}" ${preferences[key] ? 'checked' : ''}><span><strong>${escapeHtml(label)}</strong><small>${escapeHtml(copy)}</small></span><i></i></label>`;
}

function applyPreferences(): void {
  const root = document.documentElement;
  root.classList.toggle('ux-high-contrast', preferences.highContrast);
  root.classList.toggle('ux-large-text', preferences.largeText);
  root.classList.toggle('ux-reduced-motion', preferences.reducedMotion);
  root.classList.toggle('ux-compact-hud', preferences.compactHud);
}

function loadPreferences(): UxPreferences {
  try { return { ...DEFAULT_PREFERENCES, ...JSON.parse(localStorage.getItem(UX_KEY) ?? '{}') }; }
  catch { return { ...DEFAULT_PREFERENCES }; }
}

function schedulePatch(): void {
  if (patchScheduled) return;
  patchScheduled = true;
  requestAnimationFrame(() => {
    patchScheduled = false;
    patching = true;
    try {
      patchDialogueModal();
      patchChoiceButtons();
      installPanelDisclosure();
    } finally {
      patching = false;
    }
  });
}

function groupForPanel(title: string, quick: boolean): string {
  if (quick || /zustände|bedürfnisse|inventar/.test(title)) return 'status';
  if (/beziehungen|flirts|team/.test(title)) return 'social';
  return 'progress';
}

function focusFirst(root: HTMLElement): void {
  root.querySelector<HTMLElement>('button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), [tabindex]:not([tabindex="-1"])')?.focus({ preventScroll: true });
}

function trapFocus(event: KeyboardEvent, root: HTMLElement): void {
  const focusable = [...root.querySelectorAll<HTMLElement>('button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), [tabindex]:not([tabindex="-1"])')]
    .filter((node) => !node.hidden && node.offsetParent !== null);
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
}

function portraitColor(id: string): string {
  return ({ andre: '#e5ad43', rene: '#4fb7a6', lars: '#5b9be0', danny: '#dd6e73', gregor: '#d8793d', masl: '#68b86f', schubert: '#6fa56d', felix: '#bd65cf', schima: '#596ab8', gundula: '#e57c9d', uli: '#61a6d0', ronny: '#e45f4d', manni: '#63b879', susi: '#c45f79', jule: '#3d8c82', kira: '#4e4b82' } as Record<string, string>)[id] ?? '#edc45d';
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character] ?? character);
}

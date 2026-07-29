import { InvisibleJoystick, installContextAction } from './mobileControls';
import { BattlePresentation } from './battlePresentation';
import './enhancements.css';

interface CleanupGroup {
  add(cleanup: () => void): void;
  run(): void;
}

const cleanup = createCleanupGroup();
bootWhenReady();

function bootWhenReady(): void {
  if (document.getElementById('campaign-game')) {
    boot();
    return;
  }
  const observer = new MutationObserver(() => {
    if (!document.getElementById('campaign-game')) return;
    observer.disconnect();
    boot();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
}

function boot(): void {
  document.documentElement.classList.add('campaign-enhanced');
  installDeviceClasses();
  installMobileWorldControls();
  installMobilePanelDrawer();
  installIntroCinematics();
  installBattleCinematics();
  installWorldAtmosphere();
  installInteractionFeedback();
  installStatusPresentation();
  installPerformanceGuard();
  installOrientationHandling();
  window.addEventListener('beforeunload', () => cleanup.run(), { once: true });
}

function installMobileWorldControls(): void {
  const frame = requireElement<HTMLElement>('.world-frame');
  const oldControls = frame.querySelector<HTMLElement>('.mobile-controls');
  oldControls?.setAttribute('aria-hidden', 'true');

  const controls = document.createElement('div');
  controls.className = 'mobile-world-controls';
  controls.innerHTML = `
    <div class="mobile-move-zone" aria-label="Unsichtbarer Bewegungs-Joystick"></div>
    <button class="mobile-context-action idle" type="button" aria-label="Kontextaktion">
      <b>AKTION</b><small>In der Nähe eines Ziels</small>
    </button>
    <div class="mobile-control-hint">Links ziehen · rechts handeln</div>`;
  frame.append(controls);

  const joystick = new InvisibleJoystick(requireElement(controls, '.mobile-move-zone'), {
    deadZone: 0.12,
    maxRadius: 72,
    haptics: true,
  });
  const actionCleanup = installContextAction(
    requireElement<HTMLButtonElement>(controls, '.mobile-context-action'),
    requireElement('#interaction-prompt'),
    requireElement('#interaction-text'),
  );

  const dismissHint = (): void => controls.classList.add('controls-used');
  controls.addEventListener('pointerdown', dismissHint, { once: true });
  cleanup.add(() => {
    joystick.destroy();
    actionCleanup();
    controls.remove();
  });
}

function installMobilePanelDrawer(): void {
  const game = requireElement<HTMLElement>('#campaign-game');
  const layout = requireElement<HTMLElement>('.game-layout');
  const left = requireElement<HTMLElement>('.left-panel');
  const right = requireElement<HTMLElement>('.right-panel');
  const topbar = requireElement<HTMLElement>('.topbar');
  const button = document.createElement('button');
  button.className = 'mobile-hud-toggle';
  button.type = 'button';
  button.innerHTML = '<b>HUD</b><small>Status · Inventar · Beziehungen</small>';
  button.setAttribute('aria-expanded', 'false');
  topbar.append(button);

  const sheet = document.createElement('div');
  sheet.className = 'mobile-panel-sheet';
  sheet.innerHTML = '<div class="mobile-sheet-handle"></div><header><strong>Wochenend-HUD</strong><button type="button">Schließen</button></header><div class="mobile-sheet-content"></div>';
  game.append(sheet);
  const content = requireElement(sheet, '.mobile-sheet-content');
  const close = requireElement<HTMLButtonElement>(sheet, 'header button');

  const placeholders = [document.createComment('left-panel-home'), document.createComment('right-panel-home')];
  left.before(placeholders[0]);
  right.before(placeholders[1]);

  const open = (): void => {
    content.append(left, right);
    game.classList.add('mobile-panels-open');
    document.body.classList.add('campaign-modal-open');
    button.setAttribute('aria-expanded', 'true');
  };
  const shut = (): void => {
    placeholders[0].after(left);
    placeholders[1].after(right);
    game.classList.remove('mobile-panels-open');
    document.body.classList.remove('campaign-modal-open');
    button.setAttribute('aria-expanded', 'false');
  };
  button.addEventListener('click', open);
  close.addEventListener('click', shut);
  sheet.addEventListener('click', (event) => { if (event.target === sheet) shut(); });
  window.addEventListener('keydown', (event) => { if (event.key === 'Escape' && game.classList.contains('mobile-panels-open')) shut(); });
  layout.classList.add('mobile-world-first');
  cleanup.add(() => { shut(); button.remove(); sheet.remove(); });
}

function installIntroCinematics(): void {
  const visual = requireElement<HTMLElement>('#intro-visual');
  const copy = requireElement<HTMLElement>('.intro-copy');
  visual.insertAdjacentHTML('beforeend', `
    <div class="intro-cinematic-layer intro-clouds"></div>
    <div class="intro-cinematic-layer intro-trees"></div>
    <div class="intro-cinematic-layer intro-crowd">
      <i class="intro-person p1"></i><i class="intro-person p2"></i><i class="intro-person p3"></i><i class="intro-person p4"></i>
    </div>
    <div class="intro-authority-duo"><i class="gundula"></i><i class="uli"></i></div>
    <div class="intro-shop-cart"><i></i><b>25 €</b></div>
    <div class="intro-film-grain"></div>
    <div class="intro-letterbox top"></div><div class="intro-letterbox bottom"></div>
    <strong class="intro-scene-stamp">SZENE 01 / 08</strong>`);
  copy.insertAdjacentHTML('afterbegin', '<div class="intro-runtime-caption" aria-live="polite"></div>');
  const stamp = requireElement<HTMLElement>(visual, '.intro-scene-stamp');
  const caption = requireElement<HTMLElement>(copy, '.intro-runtime-caption');
  const progress = requireElement<HTMLElement>('#intro-progress');

  const update = (): void => {
    const scene = visual.dataset.visual ?? 'road';
    const activeIndex = [...progress.querySelectorAll('button')].findIndex((button) => button.classList.contains('active'));
    stamp.textContent = `SZENE ${String(Math.max(0, activeIndex) + 1).padStart(2, '0')} / 08`;
    caption.textContent = cinematicCaption(scene);
    visual.classList.remove('scene-enter');
    void visual.offsetWidth;
    visual.classList.add('scene-enter');
    document.body.dataset.introScene = scene;
  };
  const observer = new MutationObserver(update);
  observer.observe(visual, { attributes: true, attributeFilter: ['data-visual'] });
  observer.observe(progress, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
  update();

  const parallax = (event: PointerEvent): void => {
    if (event.pointerType === 'touch') return;
    const rect = visual.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    visual.style.setProperty('--intro-parallax-x', `${x * 16}px`);
    visual.style.setProperty('--intro-parallax-y', `${y * 10}px`);
  };
  visual.addEventListener('pointermove', parallax);
  cleanup.add(() => { observer.disconnect(); visual.removeEventListener('pointermove', parallax); });
}

function installBattleCinematics(): void {
  const modal = requireElement<HTMLElement>('#battle-modal');
  const presentation = new BattlePresentation({
    modal,
    title: requireElement('#battle-title'),
    round: requireElement('#battle-round'),
    playerBar: requireElement('#battle-player-bar'),
    enemyBar: requireElement('#battle-enemy-bar'),
    moves: requireElement('#battle-moves'),
    log: requireElement('#battle-log'),
  });
  cleanup.add(() => presentation.destroy());
}

function installWorldAtmosphere(): void {
  const frame = requireElement<HTMLElement>('.world-frame');
  frame.insertAdjacentHTML('beforeend', `
    <div class="world-atmosphere" aria-hidden="true">
      <div class="world-vignette"></div>
      <div class="world-sunwash"></div>
      <div class="world-particles"></div>
      <div class="world-status-distortion"></div>
    </div>
    <div class="world-location-card"><span>REGION</span><strong>Campingplatz</strong><small>Die Orientierung ist noch theoretisch.</small></div>
    <div class="mobile-objective-chip"><i>◆</i><div><strong></strong><small></small></div></div>`);
  const card = requireElement<HTMLElement>(frame, '.world-location-card');
  const cardTitle = requireElement<HTMLElement>(card, 'strong');
  const cardCopy = requireElement<HTMLElement>(card, 'small');
  const chip = requireElement<HTMLElement>(frame, '.mobile-objective-chip');
  const chipTitle = requireElement<HTMLElement>(chip, 'strong');
  const chipDistance = requireElement<HTMLElement>(chip, 'small');
  const objectiveTitle = requireElement<HTMLElement>('#objective-title');
  const objectiveDistance = requireElement<HTMLElement>('#objective-distance');
  const time = requireElement<HTMLElement>('#time-label');

  let cardTimer = 0;
  const regionHandler = (event: Event): void => {
    const id = (event as CustomEvent<string>).detail;
    const info = regionInfo(id);
    cardTitle.textContent = info.title;
    cardCopy.textContent = info.copy;
    card.classList.remove('visible');
    void card.offsetWidth;
    card.classList.add('visible');
    window.clearTimeout(cardTimer);
    cardTimer = window.setTimeout(() => card.classList.remove('visible'), 3200);
  };
  window.addEventListener('lpc-campaign-region', regionHandler);

  const syncObjective = (): void => {
    chipTitle.textContent = objectiveTitle.textContent ?? 'Aktuelles Ziel';
    chipDistance.textContent = objectiveDistance.textContent ? `${objectiveDistance.textContent} entfernt` : 'Ziel wird bestimmt';
    chip.classList.toggle('near', Number.parseInt(objectiveDistance.textContent ?? '9999', 10) < 140);
  };
  const objectiveObserver = new MutationObserver(syncObjective);
  objectiveObserver.observe(objectiveTitle, { childList: true, characterData: true, subtree: true });
  objectiveObserver.observe(objectiveDistance, { childList: true, characterData: true, subtree: true });
  syncObjective();

  const syncTime = (): void => {
    const phase = phaseFromTime(time.textContent ?? '');
    frame.dataset.dayPhase = phase;
    document.body.dataset.dayPhase = phase;
  };
  const timeObserver = new MutationObserver(syncTime);
  timeObserver.observe(time, { childList: true, characterData: true, subtree: true });
  syncTime();
  cleanup.add(() => {
    window.removeEventListener('lpc-campaign-region', regionHandler);
    objectiveObserver.disconnect();
    timeObserver.disconnect();
    window.clearTimeout(cardTimer);
  });
}

function installInteractionFeedback(): void {
  const prompt = requireElement<HTMLElement>('#interaction-prompt');
  const frame = requireElement<HTMLElement>('.world-frame');
  const pulse = document.createElement('div');
  pulse.className = 'interaction-radar';
  pulse.innerHTML = '<i></i><i></i><b>!</b>';
  frame.append(pulse);
  let wasAvailable = false;
  const sync = (): void => {
    const available = !prompt.hidden;
    frame.classList.toggle('interaction-available', available);
    pulse.classList.toggle('visible', available);
    if (available && !wasAvailable && typeof navigator.vibrate === 'function') navigator.vibrate(7);
    wasAvailable = available;
  };
  const observer = new MutationObserver(sync);
  observer.observe(prompt, { attributes: true, childList: true, subtree: true });
  sync();
  cleanup.add(() => { observer.disconnect(); pulse.remove(); });
}

function installStatusPresentation(): void {
  const statusList = requireElement<HTMLElement>('#status-list');
  const frame = requireElement<HTMLElement>('.world-frame');
  const sync = (): void => {
    const status = statusList.textContent?.toLowerCase() ?? '';
    const flags = {
      drunk: /betrunken|angetrunken|pegel|alkohol/.test(status),
      tired: /müde|erschöpft|übermüdet/.test(status),
      high: /breit|high|vernebelt/.test(status),
      hungover: /kater|verkatert/.test(status),
      critical: /kritisch|dehydriert|ausgehungert/.test(status),
    };
    for (const [key, active] of Object.entries(flags)) frame.classList.toggle(`status-${key}`, active);
  };
  const observer = new MutationObserver(sync);
  observer.observe(statusList, { childList: true, subtree: true, characterData: true });
  sync();
  cleanup.add(() => observer.disconnect());
}

function installPerformanceGuard(): void {
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  const cores = navigator.hardwareConcurrency ?? 8;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lowPower = memory <= 4 || cores <= 4;
  document.documentElement.classList.toggle('campaign-low-power', lowPower);
  document.documentElement.classList.toggle('campaign-reduced-motion', reduced);

  const visibility = (): void => document.documentElement.classList.toggle('campaign-backgrounded', document.hidden);
  document.addEventListener('visibilitychange', visibility);
  visibility();
  cleanup.add(() => document.removeEventListener('visibilitychange', visibility));
}

function installDeviceClasses(): void {
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const touch = navigator.maxTouchPoints > 0;
  document.documentElement.classList.toggle('campaign-touch', coarse || touch);
  document.documentElement.classList.toggle('campaign-desktop', !coarse && !touch);
}

function installOrientationHandling(): void {
  const hint = document.createElement('div');
  hint.className = 'landscape-recommendation';
  hint.innerHTML = '<b>Querformat empfohlen</b><span>Mehr Karte, weniger Daumen im See.</span>';
  document.body.append(hint);
  const sync = (): void => {
    const portrait = window.innerHeight > window.innerWidth;
    const small = Math.min(window.innerWidth, window.innerHeight) < 700;
    hint.classList.toggle('visible', portrait && small && !document.body.classList.contains('campaign-modal-open'));
  };
  window.addEventListener('resize', sync);
  window.addEventListener('orientationchange', sync);
  sync();
  cleanup.add(() => { window.removeEventListener('resize', sync); window.removeEventListener('orientationchange', sync); hint.remove(); });
}

export function phaseFromTime(value: string): 'morning' | 'day' | 'evening' | 'night' {
  const lower = value.toLowerCase();
  if (/nacht|nachts/.test(lower)) return 'night';
  if (/abend|dämmer/.test(lower)) return 'evening';
  if (/morgen|früh/.test(lower)) return 'morning';
  return 'day';
}

function cinematicCaption(scene: string): string {
  const captions: Record<string, string> = {
    road: 'Noch ist der Platz ruhig. Das ist keine dauerhafte Eigenschaft.',
    car: 'Neun Freunde, ein Fahrzeug und mehrere widersprüchliche Packlisten.',
    shop: 'Versorgung ist die Kunst, 25 Euro in spätere Konsequenzen umzuwandeln.',
    gate: 'Die Schranke trennt Urlaub von Verwaltung.',
    clipboard: 'Ein Klemmbrett kann eine Waffe sein, ohne im Waffenrecht aufzutauchen.',
    camp: 'Hinter dem Tor beginnt das Wochenende. Die Beweisführung endet.',
    night: 'Mit jeder Stunde werden Zustände stärker und Erinnerungen unzuverlässiger.',
    sunday: 'Sonntag entscheidet sich, ob es eine Geschichte oder ein Aktenvorgang war.',
  };
  return captions[scene] ?? captions.road;
}

function regionInfo(id: string): { title: string; copy: string } {
  const info: Record<string, { title: string; copy: string }> = {
    arrival: { title: 'Ankunft & Rezeption', copy: 'Gundulas Hoheitsgebiet. Freundlichkeit nur nach Formularlage.' },
    north: { title: 'Nordplätze', copy: 'Adria-Klause, Dauercamper und ungefragte Erfahrungswerte.' },
    central: { title: 'Taucherplatz', copy: 'Zeltkreis, Sanitär und die operative Mitte des Kontrollverlusts.' },
    festival: { title: 'Festwiese', copy: 'Becher, Bälle und sportlich umgedeuteter Alkoholkonsum.' },
    woodland: { title: 'Servicehof', copy: 'Werkstatt, Waldsaum und auffällig geeignete Hecken.' },
    beach: { title: 'Strand', copy: 'Wasser, Hauptsteg und öffentlich sichtbare Fehlentscheidungen.' },
    cove: { title: 'Ruhige Bucht', copy: 'Der seltene Ort, an dem ein Gespräch leiser werden darf.' },
    campground: { title: 'Blaue Adria', copy: 'Der gesamte Platz ist ein zusammenhängender sozialer Belastungstest.' },
  };
  return info[id] ?? info.campground;
}

function createCleanupGroup(): CleanupGroup {
  const entries: Array<() => void> = [];
  return {
    add(entry) { entries.push(entry); },
    run() { while (entries.length) entries.pop()?.(); },
  };
}

function requireElement<T extends HTMLElement = HTMLElement>(selectorOrRoot: string | ParentNode, selector?: string): T {
  const node = typeof selectorOrRoot === 'string'
    ? document.querySelector<T>(selectorOrRoot)
    : selectorOrRoot.querySelector<T>(selector ?? '');
  if (!node) throw new Error(`Missing campaign enhancement element: ${typeof selectorOrRoot === 'string' ? selectorOrRoot : selector}`);
  return node;
}

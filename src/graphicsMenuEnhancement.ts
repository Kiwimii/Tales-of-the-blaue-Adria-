import {
  currentGraphicsMode,
  graphicsModeDescription,
  graphicsModeLabel,
  setGraphicsMode,
  type GraphicsMode,
} from './game/visuals';

const ROOT_CLASS = 'graphics-options-panel';
const MODES: GraphicsMode[] = ['auto', 'mobile', 'pc'];

export function installGraphicsMenuEnhancement(): () => void {
  if (typeof window === 'undefined' || typeof MutationObserver === 'undefined') return () => undefined;

  let scheduled = 0;
  const update = (): void => {
    window.cancelAnimationFrame(scheduled);
    scheduled = window.requestAnimationFrame(mountGraphicsOptions);
  };

  const observer = new MutationObserver(update);
  observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'aria-pressed'] });
  update();

  return () => {
    observer.disconnect();
    window.cancelAnimationFrame(scheduled);
  };
}

function mountGraphicsOptions(): void {
  const menu = document.querySelector<HTMLElement>('.game-menu-panel');
  if (!menu) return;

  const activeTab = menu.querySelector<HTMLElement>('.game-menu-tab-active');
  const systemActive = activeTab?.textContent?.includes('Spiel') || activeTab?.textContent?.includes('Optionen');
  if (!systemActive) return;

  const content = menu.querySelector<HTMLElement>('.game-menu-content .menu-stack');
  if (!content || content.querySelector(`.${ROOT_CLASS}`)) return;

  const panel = document.createElement('section');
  panel.className = ROOT_CLASS;
  panel.setAttribute('aria-labelledby', 'graphics-options-title');

  const title = document.createElement('h3');
  title.id = 'graphics-options-title';
  title.textContent = 'Grafik';
  panel.append(title);

  const intro = document.createElement('p');
  intro.className = 'graphics-options-intro';
  intro.textContent = 'Wähle das Leistungsprofil. Die Seite lädt danach neu; dein Spielstand bleibt erhalten.';
  panel.append(intro);

  const choices = document.createElement('div');
  choices.className = 'graphics-options-grid';
  const selected = currentGraphicsMode();

  for (const mode of MODES) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = mode === selected ? 'graphics-option graphics-option-active' : 'graphics-option';
    button.setAttribute('aria-pressed', String(mode === selected));
    button.dataset.mode = mode;

    const icon = document.createElement('span');
    icon.className = 'graphics-option-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = mode === 'mobile' ? '▱' : mode === 'pc' ? '▣' : '◈';

    const copy = document.createElement('div');
    const strong = document.createElement('strong');
    strong.textContent = graphicsModeLabel(mode);
    const small = document.createElement('small');
    small.textContent = graphicsModeDescription(mode);
    copy.append(strong, small);

    const badge = document.createElement('b');
    badge.textContent = mode === selected ? 'AKTIV' : mode === 'mobile' ? 'MEHR FPS' : mode === 'pc' ? 'MEHR DETAILS' : 'EMPFOHLEN';

    button.append(icon, copy, badge);
    button.addEventListener('click', () => applyMode(mode, panel));
    choices.append(button);
  }

  panel.append(choices);
  content.prepend(panel);
}

function applyMode(mode: GraphicsMode, panel: HTMLElement): void {
  if (mode === currentGraphicsMode()) return;
  setGraphicsMode(mode);
  panel.querySelectorAll<HTMLButtonElement>('.graphics-option').forEach((button) => {
    const active = button.dataset.mode === mode;
    button.classList.toggle('graphics-option-active', active);
    button.setAttribute('aria-pressed', String(active));
    const badge = button.querySelector('b');
    if (badge) badge.textContent = active ? 'WIRD GELADEN' : button.dataset.mode === 'mobile' ? 'MEHR FPS' : button.dataset.mode === 'pc' ? 'MEHR DETAILS' : 'EMPFOHLEN';
    button.disabled = true;
  });

  const status = document.createElement('p');
  status.className = 'graphics-options-status';
  status.setAttribute('role', 'status');
  status.textContent = `${graphicsModeLabel(mode)} wird angewendet …`;
  panel.append(status);
  window.setTimeout(() => window.location.reload(), 180);
}

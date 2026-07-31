const STORAGE_KEY = 'tales-blaue-adria-intro-duration-v6';

const observer = new MutationObserver(mountIntroSpeedControls);
observer.observe(document.documentElement, { childList: true, subtree: true });
window.addEventListener('load', mountIntroSpeedControls);
mountIntroSpeedControls();

function mountIntroSpeedControls(): void {
  const space = document.querySelector('.opening-v5-space');
  if (!(space instanceof HTMLElement) || space.querySelector('[data-intro-duration]')) return;
  const controls = space.querySelector('.opening-v5-intro-controls');
  if (!controls) return;
  const stored = Number(localStorage.getItem(STORAGE_KEY));
  const duration = [48000, 68000, 78000].includes(stored) ? stored : Number(space.dataset.introDuration || 68000);
  const pacing = document.createElement('div');
  pacing.className = 'progression-v6-intro-speed';
  pacing.innerHTML = '<span>LESEGESCHWINDIGKEIT</span><button data-intro-duration="78000">Sehr ruhig</button><button data-intro-duration="68000">Ruhig</button><button data-intro-duration="48000">Schnell</button>';
  controls.prepend(pacing);
  pacing.querySelectorAll<HTMLButtonElement>('[data-intro-duration]').forEach((button) => button.addEventListener('click', () => {
    const next = Number(button.dataset.introDuration);
    applyDuration(space, next, true);
  }));
  applyDuration(space, duration, false);
}

function applyDuration(space: HTMLElement, duration: number, restart: boolean): void {
  space.style.setProperty('--crawl-duration', `${duration}ms`);
  space.dataset.introDuration = String(duration);
  localStorage.setItem(STORAGE_KEY, String(duration));
  space.querySelectorAll<HTMLButtonElement>('[data-intro-duration]').forEach((button) => button.classList.toggle('selected', Number(button.dataset.introDuration) === duration));
  if (!restart) return;
  space.querySelectorAll<HTMLElement>('.opening-v5-prelude,.opening-v5-logo,.opening-v5-crawl').forEach((node) => {
    node.style.animation = 'none';
    void node.offsetWidth;
    node.style.animation = '';
  });
}

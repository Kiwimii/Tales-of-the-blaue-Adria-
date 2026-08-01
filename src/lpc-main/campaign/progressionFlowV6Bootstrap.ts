export {};
import './progressionFlowV6.css';
import './progressionFlowV6IntroControlsFix';

const query = new URLSearchParams(location.search);
const genericSmoke = query.get('smoke') === '1' && query.get('progression') !== '1';
if (!genericSmoke) await import('./progressionFlowV6Runtime');
await import('./app');

const STORAGE_KEY = 'tales-blaue-adria-intro-duration-v6';
let attempts = 0;
const timer = window.setInterval(() => {
  attempts += 1;
  const space = document.querySelector('.opening-v5-space');
  if (!(space instanceof HTMLElement)) {
    if (attempts > 2400) window.clearInterval(timer);
    return;
  }
  const controls = space.querySelector('.opening-v5-intro-controls');
  if (!controls) return;
  if (!space.querySelector('[data-intro-duration]')) {
    const pacing = document.createElement('div');
    pacing.className = 'progression-v6-intro-speed';
    pacing.innerHTML = '<span>LESEGESCHWINDIGKEIT</span><button data-intro-duration="78000">Sehr ruhig</button><button data-intro-duration="68000">Ruhig</button><button data-intro-duration="48000">Schnell</button>';
    controls.prepend(pacing);
    pacing.querySelectorAll<HTMLButtonElement>('[data-intro-duration]').forEach((button) => button.addEventListener('click', () => applyDuration(space, Number(button.dataset.introDuration), true)));
  }
  const stored = Number(localStorage.getItem(STORAGE_KEY));
  const duration = [48000, 68000, 78000].includes(stored) ? stored : 68000;
  applyDuration(space, duration, false);
  window.clearInterval(timer);
}, 25);

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

import { ThirdPersonActivity3D, type ThirdPersonActivityId } from './activity3d';

const LABEL_TO_ID: Array<[RegExp, ThirdPersonActivityId]> = [
  [/flip\s*cup/i, 'flipCup'],
  [/beer\s*pong/i, 'beerPong'],
  [/flunkyball/i, 'flunkyball'],
  [/romm[eé]/i, 'romme'],
  [/hecke/i, 'hedge'],
  [/komm ans loch|masl/i, 'maslHole'],
  [/frustduell|frustkampf|ronny/i, 'ronnyBattle'],
];

let genericOverlay: HTMLElement | null = null;
let observer: MutationObserver | null = null;
let intercepting = false;

const director = new ThirdPersonActivity3D((report, score) => {
  const overlay = genericOverlay ?? document.getElementById('activity-overlay');
  if (!(overlay instanceof HTMLElement)) return;
  intercepting = true;
  if (report) {
    const button = overlay.querySelector<HTMLButtonElement>('#activity-action');
    if (button) {
      button.dataset.mode = 'close';
      button.dataset.score = String(score);
      button.click();
    }
  } else {
    overlay.querySelector<HTMLButtonElement>('#activity-close')?.click();
  }
  genericOverlay = null;
  queueMicrotask(() => { intercepting = false; });
});

function idForLabel(label: string): ThirdPersonActivityId | null {
  return LABEL_TO_ID.find(([pattern]) => pattern.test(label))?.[1] ?? null;
}

function parseBest(text: string): number {
  const match = text.match(/bestwert\s*:\s*(\d+(?:[.,]\d+)?)/i);
  return match ? Number(match[1]!.replace(',', '.')) || 0 : 0;
}

function interceptActivity(): void {
  if (intercepting) return;
  const overlay = document.getElementById('activity-overlay');
  if (!(overlay instanceof HTMLElement) || overlay.hidden) return;
  const titleElement = overlay.querySelector<HTMLElement>('#activity-title');
  const resultElement = overlay.querySelector<HTMLElement>('#activity-result');
  const label = titleElement?.textContent?.trim() ?? '';
  const id = idForLabel(label);
  if (!id) return;
  const best = parseBest(resultElement?.textContent ?? '');
  genericOverlay = overlay;
  overlay.hidden = true;
  director.open(id, label, best);
}

function install(): void {
  const overlay = document.getElementById('activity-overlay');
  if (!(overlay instanceof HTMLElement)) {
    requestAnimationFrame(install);
    return;
  }
  observer?.disconnect();
  observer = new MutationObserver(() => interceptActivity());
  observer.observe(overlay, { attributes: true, attributeFilter: ['hidden'] });
  interceptActivity();

  if (new URLSearchParams(window.location.search).get('smoke') === '1') {
    (window as Window & { __talesActivity3D?: unknown }).__talesActivity3D = {
      snapshot: () => director.debugSnapshot(),
      start: () => director.debugStart(),
      autowin: () => director.debugAutowin(),
      report: () => director.close(true),
      cancel: () => director.close(false),
      preview: (id: ThirdPersonActivityId) => director.open(id, id, 0),
    };
  }
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install, { once: true });
else install();

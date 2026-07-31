import { campaignMeta } from './metaStore';
import {
  ARRIVAL_CAMERA_FOCUS,
  ARRIVAL_PLAYER_EXIT_POSITION,
  OPENING_CRAWL,
  OPENING_FLOW_STEPS,
  OPENING_SEQUENCE_VERSION,
  arrivalPhaseAt,
  openingLayoutSnapshot,
  shouldPlayArrivalSequence,
  validateOpeningLayout,
} from './openingSequenceV5Model';
import './openingSequenceV5.css';

const SAVE_KEY = 'tales-blaue-adria-lpc-main-v1';
const observerOptions: MutationObserverInit = { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['hidden'] };
let queued = false;
let arrivalActive = false;
let arrivalStartedAt = 0;
let arrivalTimer = 0;
let arrivalPhaseTimer = 0;
let observer: MutationObserver | undefined;

installOpeningSequence();

function installOpeningSequence(): void {
  observer = new MutationObserver(queuePatch);
  observer.observe(document.documentElement, observerOptions);
  campaignMeta.subscribe(() => queuePatch());
  window.addEventListener('load', queuePatch);
  window.addEventListener('lpc-campaign-world-input-restored', queuePatch);
  exposeDiagnostics();
  queuePatch();
}

function queuePatch(): void {
  if (queued) return;
  queued = true;
  window.setTimeout(() => {
    queued = false;
    observer?.disconnect();
    try {
      patchIntro();
      patchDriverFile();
      patchMarket();
      maybeStartArrival();
    } finally {
      observer?.observe(document.documentElement, observerOptions);
    }
  }, 16);
}

function patchIntro(): void {
  const intro = document.getElementById('campaign-intro');
  if (!intro) return;
  intro.classList.add('opening-v5-intro');
  intro.dataset.openingVersion = OPENING_SEQUENCE_VERSION;
  const skip = intro.querySelector<HTMLButtonElement>('#intro-skip');
  if (skip && skip.textContent !== 'Vorspann überspringen') skip.textContent = 'Vorspann überspringen';
  if (intro.querySelector('.opening-v5-space')) return;

  const space = document.createElement('section');
  space.className = 'opening-v5-space';
  space.setAttribute('aria-label', 'Humorvoller Weltraum-Vorspann zur Geschichte des Campingwochenendes');
  space.style.setProperty('--crawl-duration', `${OPENING_CRAWL.durationMs}ms`);
  const stars = Array.from({ length: 76 }, (_, index) => {
    const x = (index * 47 + 13) % 100;
    const y = (index * 71 + 19) % 100;
    const size = 1 + (index % 4) * .55;
    const alpha = .38 + (index % 6) * .1;
    const speed = 1.4 + (index % 7) * .43;
    return `<i class="opening-v5-star" style="--x:${x}%;--y:${y}%;--size:${size}px;--alpha:${alpha};--speed:${speed}s"></i>`;
  }).join('');
  space.innerHTML = `${stars}
    <p class="opening-v5-prelude">${escapeHtml(OPENING_CRAWL.prelude)}</p>
    <div class="opening-v5-logo">
      <small>${escapeHtml(OPENING_CRAWL.eyebrow)}</small>
      <strong>TALES OF<br>THE BLAUE ADRIA</strong>
      <em>${escapeHtml(OPENING_CRAWL.episode)}</em>
    </div>
    <div class="opening-v5-crawl-viewport">
      <article class="opening-v5-crawl">
        <h2>${escapeHtml(OPENING_CRAWL.episode)}</h2>
        ${OPENING_CRAWL.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('')}
      </article>
    </div>
    <footer class="opening-v5-intro-controls">
      <button type="button" data-opening-replay>Vorspann neu starten</button>
      <button type="button" data-opening-continue>Fahrer festlegen und zum Supermarkt</button>
    </footer>`;
  intro.append(space);
  space.querySelector<HTMLButtonElement>('[data-opening-replay]')?.addEventListener('click', restartIntro);
  space.querySelector<HTMLButtonElement>('[data-opening-continue]')?.addEventListener('click', () => {
    intro.querySelector<HTMLButtonElement>('#intro-skip')?.click();
  });
}

function restartIntro(): void {
  const space = document.querySelector<HTMLElement>('.opening-v5-space');
  if (!space) return;
  space.classList.remove('restarting');
  space.querySelectorAll<HTMLElement>('.opening-v5-prelude,.opening-v5-logo,.opening-v5-crawl').forEach((node) => {
    node.style.animation = 'none';
    void node.offsetWidth;
    node.style.animation = '';
  });
  space.classList.add('restarting');
}

function patchDriverFile(): void {
  const creator = document.getElementById('campaign-creator');
  if (!creator) return;
  creator.classList.add('opening-v5-driver');
  ensureFlowRail(creator, 'driver');
  const eyebrow = creator.querySelector<HTMLElement>('.creator-copy > span');
  const title = creator.querySelector<HTMLElement>('.creator-copy h1');
  const copy = creator.querySelector<HTMLElement>('.creator-copy p');
  const finish = creator.querySelector<HTMLButtonElement>('#creator-finish');
  if (eyebrow) eyebrow.textContent = 'ZWISCHENSTATION 2/4 · FAHRERAKTE';
  if (title) title.textContent = 'Wer steigt später aus dem Auto?';
  if (copy) copy.textContent = 'Die Geschichte ist geklärt. Jetzt braucht die Reise noch eine Person, die auf dem Parkplatz glaubwürdig so tut, als hätte sie alles unter Kontrolle.';
  if (finish && finish.textContent !== 'Fahrer speichern und Einkaufswagen holen') finish.textContent = 'Fahrer speichern und Einkaufswagen holen';
}

function patchMarket(): void {
  const market = document.getElementById('campaign-shop');
  const shell = market?.querySelector<HTMLElement>('.shop-shell');
  if (!market || !shell) return;
  market.classList.add('opening-v5-market');
  ensureFlowRail(market, 'market');

  let scene = shell.querySelector<HTMLElement>(':scope > .opening-v5-market-scene');
  if (!scene) {
    scene = document.createElement('section');
    scene.className = 'opening-v5-market-scene';
    scene.setAttribute('aria-label', 'Supermarkt mit Regalen, Einkaufswagen und Kasse');
    scene.innerHTML = `
      <div class="opening-v5-shelf one"></div>
      <div class="opening-v5-shelf two"></div>
      <div class="opening-v5-shelf three"></div>
      <div class="opening-v5-checkout"></div>
      <div class="opening-v5-cart"><span class="opening-v5-cart-count">0 Teile</span></div>`;
    shell.prepend(scene);
  }

  const header = shell.querySelector<HTMLElement>(':scope > header');
  const eyebrow = header?.querySelector<HTMLElement>('span');
  const title = header?.querySelector<HTMLElement>('h1');
  const copy = header?.querySelector<HTMLElement>('p');
  if (eyebrow) eyebrow.textContent = 'ZWISCHENSTATION 3/4 · SUPERMARKT';
  if (title) title.textContent = '25 Euro gegen das Wochenende';
  if (copy) copy.textContent = 'Kaufe jetzt tatsächlich ein. Nahrung, Getränke, Hygiene und schlechte Prioritäten teilen sich dasselbe Budget. Danach fährt das Auto direkt zum Parkplatz der Blauen Adria.';

  const recommended = market.querySelector<HTMLButtonElement>('#shop-recommended');
  if (recommended && recommended.textContent !== 'Vernünftigen Einkaufswagen beladen') recommended.textContent = 'Vernünftigen Einkaufswagen beladen';
  const finish = market.querySelector<HTMLButtonElement>('#shop-finish');
  if (finish && !finish.textContent?.includes('Parkplatz')) finish.textContent = `${finish.textContent ?? 'Bezahlen'} · zum Parkplatz fahren`;

  const count = [...market.querySelectorAll<HTMLElement>('.shop-item footer b')]
    .reduce((sum, node) => sum + (Number(node.textContent) || 0), 0);
  const countNode = scene.querySelector<HTMLElement>('.opening-v5-cart-count');
  const countText = `${count} ${count === 1 ? 'Teil' : 'Teile'}`;
  if (countNode && countNode.textContent !== countText) countNode.textContent = countText;
}

function ensureFlowRail(container: HTMLElement, active: 'driver' | 'market'): void {
  let rail = container.querySelector<HTMLElement>(':scope > .opening-v5-flow-rail');
  if (!rail) {
    rail = document.createElement('section');
    rail.className = 'opening-v5-flow-rail';
    rail.innerHTML = OPENING_FLOW_STEPS.map((step, index) => `<article data-flow="${step.id}" data-step="${index + 1}"><strong>${escapeHtml(step.label)}</strong><small>${escapeHtml(step.detail)}</small></article>`).join('');
    container.prepend(rail);
  }
  rail.querySelectorAll<HTMLElement>('[data-flow]').forEach((entry) => entry.classList.toggle('active', entry.dataset.flow === active));
}

function maybeStartArrival(): void {
  const game = document.getElementById('campaign-game');
  const canvasReady = Boolean(document.querySelector('#campaign-world canvas'));
  const meta = campaignMeta.snapshot();
  const shouldPlay = shouldPlayArrivalSequence({
    gameVisible: Boolean(game && !game.hidden),
    questStage: meta.questStage,
    shoppingComplete: readShoppingComplete(),
    alreadySeen: Boolean(meta.flags.openingArrivalSeen),
    active: arrivalActive,
  });
  if (!shouldPlay) return;
  if (!canvasReady) {
    window.setTimeout(queuePatch, 140);
    return;
  }
  startArrival();
}

function startArrival(force = false): void {
  if (arrivalActive && !force) return;
  if (force) removeArrivalOverlay(false);
  arrivalActive = true;
  arrivalStartedAt = performance.now();
  document.body.classList.add('campaign-modal-open', 'opening-v5-arrival-active');
  window.dispatchEvent(new CustomEvent('lpc-campaign-teleport', { detail: { x: ARRIVAL_CAMERA_FOCUS.x, y: ARRIVAL_CAMERA_FOCUS.y } }));

  const overlay = document.createElement('section');
  overlay.id = 'opening-v5-arrival';
  overlay.className = 'opening-v5-arrival';
  overlay.dataset.phase = 'road';
  overlay.dataset.version = OPENING_SEQUENCE_VERSION;
  overlay.innerHTML = `
    <div class="opening-v5-arrival-map">
      <div class="opening-v5-parking"></div>
      <div class="opening-v5-reception"></div>
      <div class="opening-v5-gate"></div>
      <div class="opening-v5-board"></div>
      <div class="opening-v5-arrival-car"></div>
      <div class="opening-v5-car-door"></div>
      <div class="opening-v5-exiting-player"></div>
    </div>
    <article class="opening-v5-arrival-copy">
      <span>ZWISCHENSTATION 4/4 · ANKUNFT</span>
      <h2>Der Parkplatz nähert sich</h2>
      <p>Das Auto rollt auf die Blaue Adria zu. Im Wagen herrscht jene konzentrierte Stille, die nur entsteht, wenn niemand weiß, wo die Reservierung liegt.</p>
      <button type="button" data-arrival-skip>Sequenz überspringen</button>
    </article>`;
  document.body.append(overlay);
  overlay.querySelector<HTMLButtonElement>('[data-arrival-skip]')?.addEventListener('click', () => finishArrival(true));
  setArrivalPhase('road');
  arrivalPhaseTimer = window.setInterval(updateArrivalPhase, 110);
  arrivalTimer = window.setTimeout(() => finishArrival(false), 7_900);
}

function updateArrivalPhase(): void {
  if (!arrivalActive) return;
  setArrivalPhase(arrivalPhaseAt(performance.now() - arrivalStartedAt));
}

function setArrivalPhase(phase: ReturnType<typeof arrivalPhaseAt>): void {
  const overlay = document.getElementById('opening-v5-arrival');
  if (!overlay || overlay.dataset.phase === phase) return;
  overlay.dataset.phase = phase;
  const title = overlay.querySelector<HTMLElement>('h2');
  const copy = overlay.querySelector<HTMLElement>('p');
  const button = overlay.querySelector<HTMLButtonElement>('[data-arrival-skip]');
  const content = {
    road: ['Der Parkplatz nähert sich', 'Das Auto rollt auf die Blaue Adria zu. Im Wagen herrscht jene konzentrierte Stille, die nur entsteht, wenn niemand weiß, wo die Reservierung liegt.'],
    lot: ['Parkplatz erkannt', 'Links freie Stellflächen. Geradeaus die Schranke. Rechts die Rezeption. Die Geografie ist eindeutig; die spätere Diskussion wird es nicht sein.'],
    parked: ['Erstaunlich ordentlich geparkt', 'Das Auto steht westlich der Zufahrt. Der Weg zur Schranke bleibt frei. Das ist vermutlich die letzte vollständig korrekte Handlung des Wochenendes.'],
    doors: ['Tür auf', 'Die Tür öffnet sich. Gundula und Uli warten am Schrankenhof bereits in einer Haltung, die nach Formular und Gegenfrage aussieht.'],
    exit: ['Du steigst aus', 'Der Spieler landet neben dem Auto und nicht mehr mitten im Kofferraum. Rezeption, Schwarzes Brett, Schranke und erste Quest liegen jetzt logisch entlang des Weges.'],
    ready: ['Erstes Ziel: Kofferraum', 'Öffne den Kofferraum am geparkten Auto. Danach führt die Route zum Schwarzen Brett, zur Rezeption und schließlich zur Schranke.'],
  } as const;
  if (title) title.textContent = content[phase][0];
  if (copy) copy.textContent = content[phase][1];
  if (button) button.textContent = phase === 'ready' ? 'Aussteigen und übernehmen' : 'Sequenz überspringen';
}

function finishArrival(skipped = false): void {
  if (!arrivalActive) return;
  window.clearTimeout(arrivalTimer);
  window.clearInterval(arrivalPhaseTimer);
  arrivalTimer = 0;
  arrivalPhaseTimer = 0;
  setArrivalPhase('ready');
  window.dispatchEvent(new CustomEvent('lpc-campaign-teleport', { detail: { ...ARRIVAL_PLAYER_EXIT_POSITION } }));
  window.dispatchEvent(new CustomEvent('lpc-campaign-animation', { detail: { animation: skipped ? 'wave' : 'run' } }));
  campaignMeta.setFlag('openingArrivalSeen', true, skipped
    ? 'Die Ankunftssequenz wurde übersprungen. Das Auto steht trotzdem korrekt auf dem Parkplatz.'
    : 'Das Auto steht auf dem Parkplatz. Du bist ausgestiegen; der Kofferraum ist das erste Ziel.');
  removeArrivalOverlay(true);
  window.setTimeout(() => window.dispatchEvent(new CustomEvent('lpc-campaign-focus', { detail: 'trunk' })), 180);
}

function removeArrivalOverlay(restoreInput: boolean): void {
  document.getElementById('opening-v5-arrival')?.remove();
  arrivalActive = false;
  document.body.classList.remove('opening-v5-arrival-active');
  if (restoreInput) {
    const modalOpen = ['generic-modal', 'battle-modal', 'minigame-modal', 'weekend-arc-modal']
      .map((id) => document.getElementById(id))
      .some((modal) => Boolean(modal && !modal.hidden));
    document.body.classList.toggle('campaign-modal-open', modalOpen);
    window.dispatchEvent(new CustomEvent('lpc-campaign-world-input-restored'));
  }
}

function readShoppingComplete(): boolean {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw) as { prologue?: { shoppingComplete?: boolean } };
    return Boolean(parsed.prologue?.shoppingComplete);
  } catch {
    return false;
  }
}

function exposeDiagnostics(): void {
  const global = window as unknown as Record<string, unknown>;
  global.__lpcOpeningV5 = {
    version: OPENING_SEQUENCE_VERSION,
    restartIntro,
    startArrival: (): void => startArrival(true),
    setArrivalPhase: (phase: ReturnType<typeof arrivalPhaseAt>): void => setArrivalPhase(phase),
    finishArrival: (skipped = false): void => finishArrival(skipped),
    snapshot: (): Record<string, unknown> => ({
      version: OPENING_SEQUENCE_VERSION,
      intro: Boolean(document.querySelector('.opening-v5-space')),
      crawlParagraphs: document.querySelectorAll('.opening-v5-crawl p').length,
      market: Boolean(document.querySelector('.opening-v5-market-scene')),
      arrivalActive,
      arrivalPhase: document.getElementById('opening-v5-arrival')?.dataset.phase ?? '',
      arrivalSeen: Boolean(campaignMeta.snapshot().flags.openingArrivalSeen),
      exit: { ...ARRIVAL_PLAYER_EXIT_POSITION },
      layout: openingLayoutSnapshot(),
      layoutErrors: validateOpeningLayout(),
    }),
  };
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character] ?? character);
}

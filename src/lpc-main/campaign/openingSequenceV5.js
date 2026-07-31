import {
  AERIAL_NODES,
  ARRIVAL_STORY_PLACEMENTS,
  OBJECT_PLACEMENTS,
} from '../../game/aerialCampgroundPlan';
import { ALL_INTERACTIONS, CAMPAIGN_PLAYER_VISUAL } from './content';
import { CampaignWorldScene } from './worldScene';
import {
  OPENING_CRAWL_LINES,
  OPENING_LAYOUT,
  OPENING_SEQUENCE_VERSION,
  arrivalPhaseAt,
  openingLayoutReport,
} from './openingSequenceV5Model.js';
import './openingSequenceV5.css';

const GAME_SAVE_KEY = 'tales-blaue-adria-lpc-main-v1';
const OPENING_STATE_KEY = 'tales-blaue-adria-opening-v5';
const PLAYER_IDS = ['andre', 'player', 'du'];
let observer;
let arrivalTimer = 0;
let arrivalStart = 0;
let arrivalRequested = false;

applyCanonicalOpeningLayout();
patchWorldArrivalDrawing();

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  window.setTimeout(installOpeningSequence, 0);
}

function applyCanonicalOpeningLayout() {
  CAMPAIGN_PLAYER_VISUAL.x = OPENING_LAYOUT.playerExit.x;
  CAMPAIGN_PLAYER_VISUAL.y = OPENING_LAYOUT.playerExit.y;
  ARRIVAL_STORY_PLACEMENTS.trunk.x = OPENING_LAYOUT.trunk.x;
  ARRIVAL_STORY_PLACEMENTS.trunk.y = OPENING_LAYOUT.trunk.y;

  const trunk = ALL_INTERACTIONS.find((entry) => entry.id === 'trunk');
  if (trunk) {
    trunk.x = OPENING_LAYOUT.trunk.x;
    trunk.y = OPENING_LAYOUT.trunk.y;
    trunk.radius = 112;
    trunk.label = 'Kofferraum des Ankunftsautos öffnen';
  }

  if (OBJECT_PLACEMENTS['arrival-sign']) {
    Object.assign(OBJECT_PLACEMENTS['arrival-sign'], { x: 535, y: 1688, width: 135, height: 72 });
  }
  if (OBJECT_PLACEMENTS['arrival-lantern-1']) {
    Object.assign(OBJECT_PLACEMENTS['arrival-lantern-1'], { x: 540, y: 1515 });
  }
  if (OBJECT_PLACEMENTS['parking-fence-right']) {
    Object.assign(OBJECT_PLACEMENTS['parking-fence-right'], { x: 980, y: 1490, height: 240 });
  }

  // Keep the entrance and gate on one unobstructed north-south axis.
  AERIAL_NODES.entrance.x = OPENING_LAYOUT.entrance.x;
  AERIAL_NODES.entrance.y = OPENING_LAYOUT.entrance.y;
  AERIAL_NODES.gate.x = OPENING_LAYOUT.gate.x;
  AERIAL_NODES.gate.y = OPENING_LAYOUT.gate.y;
}

function patchWorldArrivalDrawing() {
  const prototype = CampaignWorldScene?.prototype;
  if (!prototype || prototype.__openingV5Patched) return;
  prototype.__openingV5Patched = true;

  const originalDrawObjects = prototype.drawObjects;
  prototype.drawObjects = function drawObjectsWithArrivalParking() {
    originalDrawObjects.call(this);

    // Cover the old car that occupied the gate lane and redraw the parking bay coherently.
    const asphalt = this.add.graphics().setDepth(1656);
    asphalt.fillStyle(0x626865, 1).fillRoundedRect(818, 1548, 168, 112, 12);
    asphalt.lineStyle(3, 0xd7d1ad, .7);
    asphalt.strokeRoundedRect(686, 1545, 172, 118, 10);
    asphalt.lineBetween(686, 1667, 858, 1667);
    asphalt.lineStyle(2, 0xffffff, .28).lineBetween(885, 1490, 885, 1680);

    const car = this.add.graphics().setDepth(1658);
    const { x, y } = OPENING_LAYOUT.car;
    car.fillStyle(0x111817, .3).fillEllipse(x, y + 37, 158, 36);
    car.fillStyle(0xb84d3e).fillRoundedRect(x - 72, y - 20, 144, 55, 14);
    car.fillStyle(0x73352f).fillRoundedRect(x - 73, y + 10, 18, 24, 4);
    car.fillStyle(0x91bac0).fillRoundedRect(x - 38, y - 34, 76, 28, 7);
    car.fillStyle(0x22282a).fillCircle(x - 48, y + 34, 17).fillCircle(x + 48, y + 34, 17);
    car.fillStyle(0xbfd8d8).fillRect(x - 29, y - 29, 25, 20).fillRect(x + 5, y - 29, 25, 20);
    car.fillStyle(0xf2d67c).fillRect(x + 62, y - 6, 8, 12);

    const sign = this.add.graphics().setDepth(1710);
    sign.fillStyle(0x6d5037).fillRect(548, 1680, 9, 76).fillRect(648, 1680, 9, 76);
    sign.fillStyle(0xe3cf88).fillRoundedRect(530, 1642, 145, 52, 7);
    this.add.text(602, 1668, 'ANKUNFT\nPARKPLATZ', {
      fontFamily: 'Arial Black, system-ui', fontSize: '12px', align: 'center', color: '#24352e',
    }).setOrigin(.5).setDepth(1711);
  };

  const originalMarkers = prototype.drawInteractionMarkers;
  prototype.drawInteractionMarkers = function drawMarkersWithVisibleTrunk() {
    originalMarkers.call(this);
    const { x, y } = OPENING_LAYOUT.trunk;
    const marker = this.add.circle(x, y, 22, 0xe0b74f, .2)
      .setStrokeStyle(4, 0xe0b74f, .95)
      .setDepth(1720);
    this.tweens.add({ targets: marker, scale: { from: .9, to: 1.25 }, alpha: { from: .8, to: .16 }, duration: 950, yoyo: true, repeat: -1 });
    this.add.text(x, y + 34, 'KOFFERRAUM', {
      fontFamily: 'Arial Black, system-ui', fontSize: '10px', color: '#fff5d0',
      backgroundColor: '#10261fee', padding: { x: 6, y: 4 },
    }).setOrigin(.5).setDepth(1721);
  };
}

function installOpeningSequence() {
  observer = new MutationObserver(() => queueDomPatch());
  observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'] });
  queueDomPatch();

  window.addEventListener('lpc-campaign-world-input-restored', queueDomPatch);
  exposeDiagnostics();
}

function queueDomPatch() {
  window.requestAnimationFrame(() => {
    patchIntro();
    patchCreatorAsMarketEntrance();
    patchSupermarket();
    bindCheckoutArrival();
    if (arrivalRequested || shouldAutoShowArrival()) requestArrivalWhenReady();
  });
}

function patchIntro() {
  const page = document.getElementById('campaign-intro');
  const visual = document.getElementById('intro-visual');
  const copy = page?.querySelector('.intro-copy');
  const kicker = document.getElementById('intro-kicker');
  const title = document.getElementById('intro-title');
  const lines = document.getElementById('intro-lines');
  if (!page || !visual || !copy || !kicker || !title || !lines) return;

  page.classList.add('opening-v5-intro');
  page.dataset.openingVersion = OPENING_SEQUENCE_VERSION;
  visual.dataset.visual = 'space';

  if (!visual.querySelector('.opening-v5-space')) {
    visual.innerHTML = `
      <div class="opening-v5-space" aria-hidden="true">
        <i class="opening-v5-stars stars-a"></i><i class="opening-v5-stars stars-b"></i><i class="opening-v5-stars stars-c"></i>
        <div class="opening-v5-planet"></div>
        <div class="opening-v5-car-ship"><span>TA</span><i></i><b></b></div>
        <p class="opening-v5-prelude">Eine überschaubare Zeit vor dem ersten Bier,<br>in einem Naherholungsgebiet erstaunlich nah …</p>
      </div>`;
  }

  let crawl = copy.querySelector('.opening-v5-crawl');
  if (!crawl) {
    crawl = document.createElement('div');
    crawl.className = 'opening-v5-crawl';
    const track = document.createElement('div');
    track.className = 'opening-v5-crawl-track';
    track.append(kicker, title, lines);
    crawl.append(track);
    copy.prepend(crawl);
  }

  const progress = document.getElementById('intro-progress');
  if (progress) progress.hidden = true;
  const next = document.getElementById('intro-next');
  if (next) next.textContent = 'Weiter zum Supermarkt';
  const skip = document.getElementById('intro-skip');
  if (skip) skip.textContent = 'Vorspann überspringen';
}

function patchCreatorAsMarketEntrance() {
  const page = document.getElementById('campaign-creator');
  if (!page || page.dataset.openingV5 === '1') return;
  page.dataset.openingV5 = '1';
  page.classList.add('opening-v5-market-entrance');
  const kicker = page.querySelector('.creator-copy > span');
  const title = page.querySelector('.creator-copy h1');
  const copy = page.querySelector('.creator-copy p');
  if (kicker) kicker.textContent = 'SUPERMARKT · KUNDENKARTE OHNE NUTZEN';
  if (title) title.textContent = 'Wer trägt den Einkauf und später die Verantwortung?';
  if (copy) copy.textContent = 'Lege die Person fest, die an der Kasse souverän wirkt und zwei Stunden später behauptet, Klopapier sei Gemeinschaftsaufgabe.';
  const button = page.querySelector('#creator-finish');
  if (button) button.textContent = 'Einkaufswagen übernehmen';
  const decoration = document.createElement('div');
  decoration.className = 'opening-v5-market-door';
  decoration.innerHTML = '<span>MARKT</span><i></i><b></b>';
  page.prepend(decoration);
}

function patchSupermarket() {
  const page = document.getElementById('campaign-shop');
  const shell = page?.querySelector('.shop-shell');
  if (!page || !shell || page.dataset.openingV5 === '1') return;
  page.dataset.openingV5 = '1';
  page.classList.add('opening-v5-supermarket');
  const kicker = shell.querySelector('header span');
  const title = shell.querySelector('header h1');
  const copy = shell.querySelector('header p');
  if (kicker) kicker.textContent = 'GANG 1 BIS 4 · VORBEREITUNGSSIMULATION';
  if (title) title.textContent = '25 Euro gegen ein ganzes Wochenende';
  if (copy) copy.textContent = 'Kaufe ein, was die Gruppe tatsächlich braucht. Oder das, was später als Grund genannt wird, warum niemand mehr fahren konnte.';

  const scene = document.createElement('div');
  scene.className = 'opening-v5-market-scene';
  scene.setAttribute('aria-hidden', 'true');
  scene.innerHTML = `
    <div class="market-sign">LEBENSMITTEL · GETRÄNKE · SPÄTERE FEHLER</div>
    <div class="market-shelf shelf-a"><i></i><i></i><i></i><i></i><i></i></div>
    <div class="market-shelf shelf-b"><i></i><i></i><i></i><i></i><i></i></div>
    <div class="market-cart"><b></b><span></span><i></i><i></i></div>
    <div class="market-checkout"><strong>KASSE 1</strong><small>Urteile werden nicht ausgedruckt.</small></div>`;
  shell.prepend(scene);
}

function bindCheckoutArrival() {
  const finish = document.getElementById('shop-finish');
  if (!finish || finish.dataset.arrivalV5 === '1') return;
  finish.dataset.arrivalV5 = '1';
  finish.addEventListener('click', () => {
    if (finish.disabled) return;
    arrivalRequested = true;
    window.setTimeout(requestArrivalWhenReady, 80);
  });
}

function shouldAutoShowArrival() {
  if (arrivalSeen()) return false;
  const save = readJson(GAME_SAVE_KEY);
  return Boolean(save?.prologue?.shoppingComplete);
}

function requestArrivalWhenReady() {
  if (arrivalSeen() || document.querySelector('.opening-v5-arrival')) return;
  const game = document.getElementById('campaign-game');
  const canvas = document.querySelector('#campaign-world canvas');
  if (!game || game.hidden || !canvas) {
    window.setTimeout(requestArrivalWhenReady, 160);
    return;
  }
  showArrivalCinematic();
}

function showArrivalCinematic() {
  if (document.querySelector('.opening-v5-arrival')) return;
  arrivalRequested = false;
  document.body.classList.add('campaign-modal-open', 'opening-v5-arriving');
  dispatchTeleport(OPENING_LAYOUT.playerExit);

  const overlay = document.createElement('section');
  overlay.className = 'opening-v5-arrival';
  overlay.dataset.phase = 'approach';
  overlay.dataset.version = OPENING_SEQUENCE_VERSION;
  overlay.innerHTML = `
    <div class="arrival-sky"><i></i><i></i><i></i></div>
    <div class="arrival-map">
      <div class="arrival-road"><i></i><i></i></div>
      <div class="arrival-reception"><strong>REZEPTION</strong><span>§</span></div>
      <div class="arrival-gate"><i></i><b></b></div>
      <div class="arrival-parking-lines"><i></i><i></i><i></i></div>
      <div class="arrival-car"><span>TA</span><i class="door"></i><b class="driver"></b></div>
      <div class="arrival-sign"><strong>BLAUE ADRIA</strong><small>Erholung unter Vorbehalt</small></div>
    </div>
    <article class="arrival-caption">
      <span>FREITAG · ANKUNFT</span>
      <h2 id="opening-arrival-title">Die Reisegruppe erreicht den Parkplatz</h2>
      <p id="opening-arrival-copy">Das Auto folgt der einzigen freien Spur. Überraschend hilfreich: Sie führt tatsächlich zum Campingplatz.</p>
    </article>
    <button type="button" class="arrival-skip">Ankunft überspringen</button>`;
  document.body.append(overlay);
  overlay.querySelector('.arrival-skip')?.addEventListener('click', finishArrivalCinematic);

  arrivalStart = performance.now();
  arrivalTimer = window.setInterval(() => {
    const elapsed = performance.now() - arrivalStart;
    const phase = arrivalPhaseAt(elapsed);
    if (overlay.dataset.phase !== phase) {
      overlay.dataset.phase = phase;
      updateArrivalCaption(phase);
    }
    if (phase === 'complete') finishArrivalCinematic();
  }, 80);
}

function updateArrivalCaption(phase) {
  const title = document.getElementById('opening-arrival-title');
  const copy = document.getElementById('opening-arrival-copy');
  const text = {
    approach: ['Die Reisegruppe erreicht den Parkplatz', 'Das Auto folgt der einzigen freien Spur. Überraschend hilfreich: Sie führt tatsächlich zum Campingplatz.'],
    turn: ['Einparken unter Beobachtung', 'Die freie Bucht liegt links von der Schrankenauffahrt. Uli würde den Winkel kommentieren, ist aber noch nicht nah genug.'],
    parked: ['Motor aus. Verantwortung an.', 'Das Fahrzeug steht in der Parkbucht und blockiert weder Schranke noch Rezeption. Ein logistischer Höhepunkt, der später nicht wiederholt wird.'],
    door: ['Die Fahrertür öffnet sich', 'Draußen warten Kofferraum, Reservierungsliste und zwei Menschen mit beruflichem Interesse an Abständen.'],
    exit: ['Du steigst aus', 'Der Kofferraum liegt hinter dem Auto. Rezeption, Brett und Schranke stehen sichtbar entlang des Fußwegs. Das Wochenende kann beginnen.'],
    complete: ['Ankunft abgeschlossen', 'Ab jetzt werden Fehlentscheidungen wieder selbst gesteuert.'],
  }[phase];
  if (title) title.textContent = text?.[0] ?? '';
  if (copy) copy.textContent = text?.[1] ?? '';
}

function finishArrivalCinematic() {
  if (arrivalTimer) window.clearInterval(arrivalTimer);
  arrivalTimer = 0;
  markArrivalSeen();
  dispatchTeleport(OPENING_LAYOUT.playerExit);
  window.dispatchEvent(new CustomEvent('lpc-campaign-animation', { detail: { animation: 'wave' } }));
  document.querySelector('.opening-v5-arrival')?.remove();
  document.body.classList.remove('opening-v5-arriving');
  const modalOpen = ['generic-modal', 'battle-modal', 'minigame-modal', 'weekend-arc-modal']
    .map((id) => document.getElementById(id))
    .some((modal) => Boolean(modal && !modal.hidden));
  document.body.classList.toggle('campaign-modal-open', modalOpen);
  window.dispatchEvent(new CustomEvent('lpc-campaign-world-input-restored'));
}

function dispatchTeleport(point) {
  window.dispatchEvent(new CustomEvent('lpc-campaign-teleport', { detail: { x: point.x, y: point.y } }));
}

function arrivalSeen() {
  return Boolean(readJson(OPENING_STATE_KEY)?.arrivalSeen);
}

function markArrivalSeen() {
  const state = readJson(OPENING_STATE_KEY) ?? {};
  localStorage.setItem(OPENING_STATE_KEY, JSON.stringify({ ...state, version: OPENING_SEQUENCE_VERSION, arrivalSeen: true }));
}

function readJson(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : undefined;
  } catch {
    return undefined;
  }
}

function exposeDiagnostics() {
  if (new URLSearchParams(location.search).get('smoke') !== '1') return;
  window.__lpcOpeningV5 = {
    version: OPENING_SEQUENCE_VERSION,
    layout: () => ({ ...OPENING_LAYOUT, report: openingLayoutReport() }),
    crawl: () => [...OPENING_CRAWL_LINES],
    showArrival: () => { localStorage.removeItem(OPENING_STATE_KEY); arrivalRequested = true; requestArrivalWhenReady(); },
    skipArrival: finishArrivalCinematic,
    snapshot: () => ({
      intro: Boolean(document.querySelector('.opening-v5-intro .opening-v5-crawl')),
      supermarket: Boolean(document.querySelector('.opening-v5-supermarket .opening-v5-market-scene')),
      arrival: document.querySelector('.opening-v5-arrival')?.dataset.phase ?? '',
      arrivalSeen: arrivalSeen(),
      playerExit: { ...OPENING_LAYOUT.playerExit },
      trunk: { ...OPENING_LAYOUT.trunk },
      playerAliases: [...PLAYER_IDS],
    }),
  };
}

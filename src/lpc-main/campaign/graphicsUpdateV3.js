import { CAMPAIGN_CHARACTER_BY_ID, CAMPAIGN_PLAYER_VISUAL } from './content';
import {
  GRAPHICS_UPDATE_VERSION,
  brawlSupportTeam,
  crowdSize,
  minigameCast,
  patrolActors,
  reactionForCombatLog,
  sceneLabel,
} from './graphicsUpdateV3Model.js';
import './graphicsUpdateV3.css';

const META_KEY = 'tales-blaue-adria-lpc-campaign-meta-v2';
const PLAYER_IDS = new Set(['andre', 'player', 'du']);
let queued = false;
let celebrationTimer = 0;

function readMeta() {
  try {
    const raw = localStorage.getItem(META_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeMeta(meta) {
  localStorage.setItem(META_KEY, JSON.stringify(meta));
}

function visualFor(id) {
  return PLAYER_IDS.has(id) ? CAMPAIGN_PLAYER_VISUAL : CAMPAIGN_CHARACTER_BY_ID[id];
}

function labelFor(id) {
  if (PLAYER_IDS.has(id)) return 'André';
  return visualFor(id)?.name ?? String(id).replace(/^./, (letter) => letter.toLocaleUpperCase('de'));
}

function roleFor(id) {
  if (PLAYER_IDS.has(id)) return 'SPIELLEITER';
  return visualFor(id)?.role ?? 'TEAM';
}

function color(value, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return `#${Math.max(0, Math.min(0xffffff, number)).toString(16).padStart(6, '0')}`;
}

function createCharacter(id, variant = 'support', reaction = 'idle') {
  const visual = visualFor(id) ?? {};
  const figure = document.createElement('div');
  figure.className = `graphics-v3-character graphics-v3-${variant} graphics-v3-reaction-${reaction}`;
  figure.dataset.character = id;
  figure.dataset.reaction = reaction;
  figure.dataset.variant = variant;
  figure.setAttribute('role', 'img');
  figure.setAttribute('aria-label', `${labelFor(id)} – ${roleFor(id)}`);
  figure.style.setProperty('--v3-shirt', color(visual.shirt, PLAYER_IDS.has(id) ? '#2f6f5a' : '#476c5b'));
  figure.style.setProperty('--v3-shirt-shade', color(visual.shirtShade, '#24483c'));
  figure.style.setProperty('--v3-trousers', color(visual.trousers, '#273642'));
  figure.style.setProperty('--v3-accent', color(visual.accent, '#e9bd52'));
  figure.style.setProperty('--v3-hair', color(visual.hair, '#3a2a22'));
  figure.innerHTML = `
    <span class="graphics-v3-shadow"></span>
    <span class="graphics-v3-legs"><i></i><i></i></span>
    <span class="graphics-v3-body"><i class="graphics-v3-arm left"></i><i class="graphics-v3-arm right"></i><b></b></span>
    <span class="graphics-v3-head"><i class="graphics-v3-hair"></i><b class="graphics-v3-eye left"></b><b class="graphics-v3-eye right"></b><em></em></span>
    <span class="graphics-v3-accessory"></span>`;
  return figure;
}

function enhanceBrawl() {
  const arena = document.querySelector('.brawl-arena');
  if (!(arena instanceof HTMLElement)) return;
  arena.classList.add('graphics-v3-brawl');
  arena.dataset.graphicsRelease = GRAPHICS_UPDATE_VERSION;

  const logText = document.querySelector('.arc-log p')?.textContent ?? '';
  const reaction = reactionForCombatLog(logText);
  const fighterMap = [
    ['.brawl-fighter.player', 'andre'],
    ['.brawl-fighter.masl', 'masl'],
    ['.brawl-fighter.gundula', 'gundula'],
    ['.brawl-fighter.uli', 'uli'],
  ];
  for (const [selector, id] of fighterMap) {
    const fighter = arena.querySelector(selector);
    const slot = fighter?.querySelector('figure');
    if (!(slot instanceof HTMLElement)) continue;
    const nextReaction = fighter?.classList.contains('down') ? 'down' : reaction;
    const current = slot.querySelector(':scope > .graphics-v3-character');
    if (!(current instanceof HTMLElement) || current.dataset.character !== id || current.dataset.reaction !== nextReaction) {
      slot.textContent = '';
      slot.append(createCharacter(id, 'fighter', nextReaction));
    }
    fighter.dataset.character = id;
  }

  const meta = readMeta();
  const activeTeam = Array.isArray(meta.activeTeam) ? meta.activeTeam : [];
  const supportIds = brawlSupportTeam(activeTeam);
  const crowd = crowdSize(meta.weekendArc?.saturday?.debateCrowd, activeTeam.length);
  const signature = `${supportIds.join('|')}::${crowd}`;

  let atmosphere = arena.querySelector(':scope > .graphics-v3-brawl-atmosphere');
  if (!(atmosphere instanceof HTMLElement)) {
    atmosphere = document.createElement('div');
    atmosphere.className = 'graphics-v3-brawl-atmosphere';
    arena.prepend(atmosphere);
  }
  if (atmosphere.dataset.signature !== signature) {
    atmosphere.dataset.signature = signature;
    atmosphere.innerHTML = `<div class="graphics-v3-gate"><i></i><i></i><b>SCHRANKE</b></div><div class="graphics-v3-crowd">${Array.from({ length: crowd }, (_, index) => `<span style="--crowd-index:${index}"></span>`).join('')}</div><div class="graphics-v3-ground-dust"></div>`;
  }

  let support = arena.nextElementSibling;
  if (!(support instanceof HTMLElement) || !support.classList.contains('graphics-v3-support-row')) {
    support = document.createElement('section');
    support.className = 'graphics-v3-support-row';
    arena.after(support);
  }
  const supportSignature = `${supportIds.join('|')}::${reaction}`;
  if (support.dataset.signature !== supportSignature) {
    support.dataset.signature = supportSignature;
    support.hidden = supportIds.length === 0;
    support.innerHTML = supportIds.length
      ? `<header><span>AKTIVES TEAM AM RING</span><strong>${supportIds.length} zusätzliche Unterstützer</strong></header><div>${supportIds.map((id, index) => {
          const relation = Number(meta.relationshipBonus?.[id] ?? 0);
          const member = document.createElement('div');
          member.className = 'graphics-v3-support-member';
          member.style.setProperty('--support-index', String(index));
          member.append(createCharacter(id, 'support', reaction));
          const text = document.createElement('p');
          text.innerHTML = `<strong>${escapeHtml(labelFor(id))}</strong><small>${escapeHtml(roleFor(id))} · Beziehung ${relation >= 0 ? '+' : ''}${relation}</small>`;
          member.append(text);
          return member.outerHTML;
        }).join('')}</div>`
      : '';
  }
}

function enhanceMinigame() {
  const root = document.querySelector('#minigame-modal');
  const stage = root?.querySelector('.minigame-stage');
  if (!(root instanceof HTMLElement) || !(stage instanceof HTMLElement) || root.hidden) return;
  const game = root.dataset.miniGame || 'flipCup';
  stage.dataset.graphicsGame = game;
  stage.dataset.graphicsRelease = GRAPHICS_UPDATE_VERSION;
  stage.classList.add('graphics-v3-minigame-stage');

  const meta = readMeta();
  const activeTeam = Array.isArray(meta.activeTeam) ? meta.activeTeam : [];
  const phase = root.querySelector('[data-mini-phase]')?.textContent?.trim() ?? '';
  const cast = minigameCast(game, activeTeam, 8);
  const signature = `${game}::${cast.join('|')}::${phase}`;
  let layer = stage.querySelector(':scope > .graphics-v3-minigame-layer');
  if (!(layer instanceof HTMLElement)) {
    layer = document.createElement('div');
    layer.className = 'graphics-v3-minigame-layer';
    stage.append(layer);
  }
  if (layer.dataset.signature === signature) return;
  layer.dataset.signature = signature;
  layer.innerHTML = '';
  layer.append(buildScene(game, cast, phase));
}

function buildScene(game, cast, phase) {
  const scene = document.createElement('section');
  scene.className = `graphics-v3-scene graphics-v3-scene-${game}`;
  scene.dataset.phase = phase;
  const badge = document.createElement('div');
  badge.className = 'graphics-v3-scene-badge';
  badge.innerHTML = `<span>GRAFIK-UPDATE V3</span><strong>${escapeHtml(sceneLabel(game))}</strong>`;
  scene.append(badge);

  if (game === 'hedgePee') {
    scene.append(buildHedgePatrol(cast));
    return scene;
  }

  const left = cast.slice(0, Math.ceil(cast.length / 2));
  const right = cast.slice(Math.ceil(cast.length / 2));
  const field = document.createElement('div');
  field.className = 'graphics-v3-field';
  field.innerHTML = propMarkup(game);

  const leftGroup = buildCharacterGroup(left, 'left', game === 'maslHole' ? 'panic' : 'cheer');
  const rightGroup = buildCharacterGroup(right, 'right', game === 'flunkyball' ? 'run' : 'idle');
  scene.append(leftGroup, field, rightGroup);
  return scene;
}

function buildCharacterGroup(ids, side, reaction) {
  const group = document.createElement('div');
  group.className = `graphics-v3-minigame-cast ${side}`;
  ids.forEach((id, index) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'graphics-v3-cast-member';
    wrapper.style.setProperty('--cast-index', String(index));
    wrapper.append(createCharacter(id, 'mini', reaction));
    const name = document.createElement('span');
    name.textContent = labelFor(id);
    wrapper.append(name);
    group.append(wrapper);
  });
  return group;
}

function buildHedgePatrol(cast) {
  const zone = document.createElement('div');
  zone.className = 'graphics-v3-patrol-zone';
  zone.innerHTML = '<div class="graphics-v3-hedge-wall"><i></i><i></i><i></i><i></i></div><div class="graphics-v3-hide-team"></div>';
  const hideTeam = zone.querySelector('.graphics-v3-hide-team');
  cast.filter((id) => id !== 'gundula' && id !== 'uli').slice(0, 4).forEach((id, index) => {
    const member = document.createElement('div');
    member.className = 'graphics-v3-hider';
    member.style.setProperty('--hide-index', String(index));
    member.append(createCharacter(id, 'mini', 'panic'));
    hideTeam?.append(member);
  });

  for (const actor of patrolActors()) {
    const guard = document.createElement('div');
    guard.className = `graphics-v3-patrol graphics-v3-patrol-${actor.id} lane-${actor.lane}`;
    guard.style.setProperty('--patrol-duration', `${actor.duration}s`);
    guard.style.setProperty('--patrol-delay', `${actor.delay}s`);
    guard.style.setProperty('--patrol-direction', String(actor.direction));
    guard.style.setProperty('--cone-length', `${actor.cone}px`);
    guard.append(createCharacter(actor.id, 'guard', 'inspect'));
    const label = document.createElement('b');
    label.textContent = actor.id === 'gundula' ? 'GUNDULA · KLEMMBRETT-PATROUILLE' : 'ULI · SCHLÜSSELBUND-PATROUILLE';
    const cone = document.createElement('span');
    cone.className = 'graphics-v3-vision-cone';
    guard.append(label, cone);
    zone.append(guard);
  }
  return zone;
}

function propMarkup(game) {
  if (game === 'flipCup') return '<div class="graphics-v3-table flip"><i></i><i></i><i></i><i></i><b></b></div>';
  if (game === 'beerPong') return '<div class="graphics-v3-table pong"><div class="rack left">● ● ●<br> ● ●<br> ●</div><i class="ball"></i><div class="rack right">● ● ●<br> ● ●<br> ●</div></div>';
  if (game === 'flunkyball') return '<div class="graphics-v3-flunky-lane"><i class="line"></i><b class="bottle"></b><span class="throw-trail"></span></div>';
  return '<div class="graphics-v3-hole"><i></i><b>MASLS<br>LOCH</b><span></span></div>';
}

function celebrate(event) {
  const detail = event?.detail ?? {};
  document.documentElement.dataset.graphicsV3Outcome = detail.success ? 'success' : 'fail';
  window.clearTimeout(celebrationTimer);
  celebrationTimer = window.setTimeout(() => delete document.documentElement.dataset.graphicsV3Outcome, 1600);
  schedule();
}

function enhance() {
  enhanceBrawl();
  enhanceMinigame();
}

function schedule() {
  if (queued) return;
  queued = true;
  requestAnimationFrame(() => {
    queued = false;
    enhance();
  });
}

function setActiveTeam(ids) {
  const meta = readMeta();
  meta.activeTeam = Array.isArray(ids) ? ids : [];
  writeMeta(meta);
  schedule();
}

function snapshot() {
  const meta = readMeta();
  return {
    version: GRAPHICS_UPDATE_VERSION,
    activeTeam: meta.activeTeam ?? [],
    supportTeam: brawlSupportTeam(meta.activeTeam ?? []),
    brawlEnhanced: Boolean(document.querySelector('.graphics-v3-brawl')),
    minigame: document.querySelector('#minigame-modal')?.dataset.miniGame ?? '',
    patrols: document.querySelectorAll('.graphics-v3-patrol-zone > .graphics-v3-patrol').length,
  };
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character] ?? character);
}

function install() {
  document.documentElement.classList.add('graphics-update-v3-active');
  const observer = new MutationObserver(schedule);
  observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden', 'class', 'data-mini-game'] });
  window.addEventListener('lpc-campaign-minigame-outcome', celebrate);
  window.setInterval(schedule, 1000);
  schedule();
  window.__talesGraphicsUpdateV3 = {
    version: GRAPHICS_UPDATE_VERSION,
    force: schedule,
    snapshot,
    setActiveTeam,
    showBrawl(ids = ['masl', 'felix', 'danny', 'rene', 'susi']) {
      window.__lpcWeekendArcDebug?.showBrawl?.();
      setActiveTeam(ids);
      schedule();
    },
    startMinigame(game = 'hedgePee', ids = ['danny', 'felix', 'rene', 'lars']) {
      setActiveTeam(ids);
      window.__lpcMinigameDebug?.start?.(game);
      window.__lpcMinigameDebug?.begin?.();
      window.__lpcMinigameDebug?.skipCountdown?.();
      schedule();
    },
  };
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') install();
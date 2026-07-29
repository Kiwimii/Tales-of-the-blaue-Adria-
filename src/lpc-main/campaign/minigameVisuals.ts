import type { MiniGameId } from './minigamesV2';
import './minigameVisuals.css';

export const KENNEY_CC0_VFX_MARKER = 'Kenney CC0 Particle Pack via Calinou/kenney-particle-pack';

const ASSET_BASE = 'https://raw.githubusercontent.com/Calinou/kenney-particle-pack/master/addons/kenney_particle_pack';
const ASSET_URLS = {
  circle: `${ASSET_BASE}/circle_03.png`,
  dirt: `${ASSET_BASE}/dirt_02.png`,
  smoke: `${ASSET_BASE}/smoke_04.png`,
  spark: `${ASSET_BASE}/spark_03.png`,
  star: `${ASSET_BASE}/star_06.png`,
  trace: `${ASSET_BASE}/trace_02.png`,
} as const;

type AssetKey = keyof typeof ASSET_URLS;
type FeedbackTone = 'good' | 'bad' | 'warning' | 'neutral';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  gravity: number;
  rotation: number;
  spin: number;
  size: number;
  life: number;
  maxLife: number;
  alpha: number;
  kind: AssetKey;
  color: string;
}

interface Ring {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  life: number;
  maxLife: number;
  color: string;
  width: number;
}

interface VisualState {
  root: HTMLElement;
  stage: HTMLElement;
  overlay: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  assets: Partial<Record<AssetKey, HTMLImageElement>>;
  particles: Particle[];
  rings: Ring[];
  raf: number;
  last: number;
  ambientClock: number;
  phaseText: string;
  liveText: string;
  game: MiniGameId;
  observer: MutationObserver;
  resizeObserver?: ResizeObserver;
  destroyed: boolean;
}

const controllers = new WeakMap<HTMLElement, VisualState>();

export function installMinigameVisuals(root: HTMLElement): () => void {
  const existing = controllers.get(root);
  if (existing) return () => destroy(existing);

  const gameCanvas = root.querySelector<HTMLCanvasElement>('canvas');
  if (!gameCanvas) throw new Error('Minigame visual layer requires the game canvas.');

  const stage = document.createElement('div');
  stage.className = 'minigame-stage';
  const overlay = document.createElement('canvas');
  overlay.className = 'minigame-vfx-canvas';
  overlay.width = 900;
  overlay.height = 430;
  overlay.setAttribute('aria-hidden', 'true');

  gameCanvas.before(stage);
  stage.append(gameCanvas, overlay);
  const badge = document.createElement('span');
  badge.className = 'minigame-vfx-badge';
  badge.textContent = 'CC0 VFX';
  badge.title = KENNEY_CC0_VFX_MARKER;
  stage.append(badge);

  const context = overlay.getContext('2d');
  if (!context) throw new Error('Minigame VFX canvas context unavailable.');

  const state: VisualState = {
    root,
    stage,
    overlay,
    context,
    assets: {},
    particles: [],
    rings: [],
    raf: 0,
    last: performance.now(),
    ambientClock: 0,
    phaseText: '',
    liveText: '',
    game: normalizeGame(root.dataset.miniGame),
    observer: new MutationObserver(() => syncVisualState(state)),
    destroyed: false,
  };
  controllers.set(root, state);

  state.observer.observe(root, {
    attributes: true,
    attributeFilter: ['hidden', 'data-mini-game'],
    childList: true,
    subtree: true,
    characterData: true,
  });
  if (typeof ResizeObserver !== 'undefined') {
    state.resizeObserver = new ResizeObserver(() => resizeOverlay(state));
    state.resizeObserver.observe(stage);
  }

  root.dataset.vfxAssets = 'loading';
  void loadAssets(state);
  syncVisualState(state);
  ensureLoop(state);

  return () => destroy(state);
}

export function visualEffectForFeedback(game: MiniGameId, kicker: string): { kind: AssetKey; tone: FeedbackTone; count: number } {
  const upper = kicker.toUpperCase();
  if (/PERFEKT|TREFFER|SAUBER|GELANDET|ABDICHTUNG OK|FLASCHE FÄLLT/.test(upper)) {
    return { kind: game === 'maslHole' ? 'smoke' : upper.includes('TREFFER') ? 'spark' : 'star', tone: 'good', count: upper.includes('PERFEKT') ? 28 : 16 };
  }
  if (/STOPP|BLICKKEGEL|REDEMPTION|LEER|AUSSERHALB/.test(upper)) {
    return { kind: upper.includes('BLICK') ? 'trace' : 'circle', tone: 'warning', count: 10 };
  }
  if (/FOUL|FEHL|DANEBEN|ABGEWEHRT|HUSTEN|LECK|VERSCHÜTTET|HINDERNIS/.test(upper)) {
    return { kind: game === 'hedgePee' || upper.includes('VERSCHÜTTET') ? 'dirt' : 'smoke', tone: 'bad', count: 18 };
  }
  return { kind: 'circle', tone: 'neutral', count: 7 };
}

function syncVisualState(state: VisualState): void {
  if (state.destroyed) return;
  state.game = normalizeGame(state.root.dataset.miniGame);
  const phase = state.root.querySelector<HTMLElement>('[data-mini-phase]')?.textContent?.trim() ?? '';
  const live = state.root.querySelector<HTMLElement>('[data-mini-live]')?.textContent?.trim() ?? '';
  if (phase && phase !== state.phaseText) {
    state.phaseText = phase;
    spawnFeedback(state, phase);
  }
  state.liveText = live;
  if (state.root.hidden) {
    stopLoop(state);
    clearCanvas(state);
  } else {
    resizeOverlay(state);
    ensureLoop(state);
  }
}

async function loadAssets(state: VisualState): Promise<void> {
  const entries = await Promise.all(
    (Object.entries(ASSET_URLS) as Array<[AssetKey, string]>).map(async ([key, url]) => {
      const image = await loadImage(url, 2600);
      return [key, image] as const;
    }),
  );
  if (state.destroyed) return;
  for (const [key, image] of entries) if (image) state.assets[key] = image;
  const loaded = Object.keys(state.assets).length;
  state.root.dataset.vfxAssets = loaded >= 3 ? 'loaded' : 'fallback';
}

function loadImage(url: string, timeoutMs: number): Promise<HTMLImageElement | undefined> {
  return new Promise((resolve) => {
    const image = new Image();
    let settled = false;
    const finish = (value?: HTMLImageElement): void => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      resolve(value);
    };
    const timer = window.setTimeout(() => finish(), timeoutMs);
    image.crossOrigin = 'anonymous';
    image.decoding = 'async';
    image.onload = () => finish(image);
    image.onerror = () => finish();
    image.src = url;
  });
}

function ensureLoop(state: VisualState): void {
  if (state.raf || state.destroyed || state.root.hidden) return;
  state.last = performance.now();
  state.raf = requestAnimationFrame((time) => frame(state, time));
}

function stopLoop(state: VisualState): void {
  if (state.raf) cancelAnimationFrame(state.raf);
  state.raf = 0;
}

function frame(state: VisualState, time: number): void {
  state.raf = 0;
  if (state.destroyed || state.root.hidden) return;
  const delta = Math.min(50, Math.max(0, time - state.last));
  state.last = time;
  const reduced = reducedMotion();

  state.ambientClock += delta;
  if (!reduced && state.ambientClock >= ambientInterval(state.game)) {
    state.ambientClock = 0;
    spawnAmbient(state);
  }

  updateParticles(state, delta, reduced);
  draw(state, time, reduced);
  state.raf = requestAnimationFrame((next) => frame(state, next));
}

function updateParticles(state: VisualState, delta: number, reduced: boolean): void {
  const motion = reduced ? .22 : 1;
  for (const particle of state.particles) {
    particle.life -= delta;
    particle.vy += particle.gravity * delta * motion;
    particle.x += particle.vx * delta * motion;
    particle.y += particle.vy * delta * motion;
    particle.rotation += particle.spin * delta * motion;
  }
  state.particles = state.particles.filter((particle) => particle.life > 0).slice(-180);
  for (const ring of state.rings) ring.life -= delta;
  state.rings = state.rings.filter((ring) => ring.life > 0).slice(-12);
}

function draw(state: VisualState, time: number, reduced: boolean): void {
  const ctx = state.context;
  const width = state.overlay.width;
  const height = state.overlay.height;
  ctx.clearRect(0, 0, width, height);

  drawScenePolish(ctx, state.game, width, height, time, reduced);
  for (const ring of state.rings) drawRing(ctx, ring);
  for (const particle of state.particles) drawParticle(ctx, state, particle);
  drawEdgeLight(ctx, state.game, width, height, time);
}

function drawScenePolish(
  ctx: CanvasRenderingContext2D,
  game: MiniGameId,
  width: number,
  height: number,
  time: number,
  reduced: boolean,
): void {
  ctx.save();
  ctx.globalAlpha = .62;
  if (game === 'flipCup') {
    const bob = reduced ? 0 : Math.sin(time / 230) * 4;
    for (let index = 0; index < 9; index += 1) {
      const x = 55 + index * 101;
      ctx.fillStyle = index % 2 ? 'rgba(25,13,20,.44)' : 'rgba(9,21,18,.52)';
      ctx.beginPath();
      ctx.arc(x, 54 + bob * (index % 3 === 0 ? 1 : -.45), 17, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(x - 12, 70 + bob, 24, 36);
    }
    ctx.fillStyle = 'rgba(244,209,100,.14)';
    ctx.fillRect(0, 110, width, 3);
  } else if (game === 'beerPong') {
    for (let index = 0; index < 12; index += 1) {
      const x = 38 + index * 75;
      const glow = .25 + Math.sin(time / 420 + index) * .12;
      ctx.fillStyle = `rgba(${index % 2 ? '237,196,93' : '117,191,209'},${glow})`;
      ctx.beginPath(); ctx.arc(x, 25 + Math.sin(index) * 5, 5, 0, Math.PI * 2); ctx.fill();
    }
    ctx.strokeStyle = 'rgba(117,191,209,.13)';
    ctx.lineWidth = 2;
    ctx.strokeRect(102, 42, width - 204, height - 84);
  } else if (game === 'flunkyball') {
    const drift = reduced ? 0 : (time / 12) % width;
    ctx.fillStyle = 'rgba(255,241,196,.1)';
    for (let index = 0; index < 5; index += 1) ctx.fillRect((drift + index * 210) % width, height - 92 - index * 4, 80, 3);
    ctx.fillStyle = 'rgba(32,69,50,.28)';
    for (let index = 0; index < 6; index += 1) {
      ctx.beginPath(); ctx.arc(60 + index * 160, 82, 21, 0, Math.PI * 2); ctx.fill();
      ctx.fillRect(45 + index * 160, 99, 30, 48);
    }
  } else if (game === 'hedgePee') {
    for (let index = 0; index < 14; index += 1) {
      const x = 30 + (index * 71) % width;
      const y = 30 + ((index * 47) % 120);
      const glow = .22 + Math.sin(time / 500 + index) * .18;
      ctx.fillStyle = `rgba(243,204,100,${glow})`;
      ctx.beginPath(); ctx.arc(x, y, 2.5, 0, Math.PI * 2); ctx.fill();
    }
    const sweep = reduced ? .5 : (Math.sin(time / 1500) + 1) / 2;
    const gradient = ctx.createLinearGradient(width * sweep, 0, width * sweep + 210, 210);
    gradient.addColorStop(0, 'rgba(255,239,164,.12)');
    gradient.addColorStop(1, 'rgba(255,239,164,0)');
    ctx.fillStyle = gradient;
    ctx.beginPath(); ctx.moveTo(width * sweep, 0); ctx.lineTo(width * sweep - 105, 205); ctx.lineTo(width * sweep + 190, 205); ctx.fill();
  } else {
    const centerX = width / 2;
    for (let index = 0; index < 7; index += 1) {
      const phase = time / (850 + index * 90) + index;
      const x = centerX + Math.sin(phase) * (60 + index * 18);
      const y = height - 58 - ((time / (11 + index)) % 230);
      ctx.strokeStyle = `rgba(215,232,220,${.05 + index * .012})`;
      ctx.lineWidth = 5 + index * .7;
      ctx.beginPath(); ctx.moveTo(x, y + 42); ctx.bezierCurveTo(x - 24, y + 10, x + 25, y - 12, x, y - 42); ctx.stroke();
    }
  }
  ctx.restore();
}

function drawEdgeLight(ctx: CanvasRenderingContext2D, game: MiniGameId, width: number, height: number, time: number): void {
  const colors: Record<MiniGameId, string> = {
    flipCup: '237,196,93',
    beerPong: '117,191,209',
    flunkyball: '117,198,140',
    hedgePee: '143,203,120',
    maslHole: '179,146,211',
  };
  const pulse = .05 + (Math.sin(time / 650) + 1) * .025;
  const gradient = ctx.createRadialGradient(width / 2, height / 2, height * .25, width / 2, height / 2, width * .72);
  gradient.addColorStop(0, 'rgba(0,0,0,0)');
  gradient.addColorStop(1, `rgba(${colors[game]},${pulse})`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

function spawnFeedback(state: VisualState, kicker: string): void {
  if (!kicker || /VORBEREITUNG|START|RUNDE|STAFFEL|ZUG \d/.test(kicker.toUpperCase())) return;
  const effect = visualEffectForFeedback(state.game, kicker);
  const origin = effectOrigin(state.game, kicker);
  const color = toneColor(effect.tone);
  const count = reducedMotion() ? Math.min(5, effect.count) : effect.count;

  for (let index = 0; index < count; index += 1) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.035 + Math.random() * 0.14;
    state.particles.push({
      x: origin.x + (Math.random() - .5) * 28,
      y: origin.y + (Math.random() - .5) * 18,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - (effect.kind === 'smoke' ? .035 : .08),
      gravity: effect.kind === 'dirt' ? .00034 : effect.kind === 'smoke' ? -.000018 : .00016,
      rotation: Math.random() * Math.PI * 2,
      spin: (Math.random() - .5) * .007,
      size: effect.kind === 'smoke' ? 28 + Math.random() * 42 : 10 + Math.random() * 22,
      life: 500 + Math.random() * 850,
      maxLife: 1350,
      alpha: .55 + Math.random() * .4,
      kind: effect.kind,
      color,
    });
  }
  state.rings.push({
    x: origin.x,
    y: origin.y,
    radius: 18,
    maxRadius: effect.tone === 'warning' ? 145 : 95,
    life: 520,
    maxLife: 520,
    color,
    width: effect.tone === 'bad' ? 8 : 5,
  });
}

function spawnAmbient(state: VisualState): void {
  const width = state.overlay.width;
  const height = state.overlay.height;
  const configuration: Record<MiniGameId, { kind: AssetKey; color: string; x: number; y: number; vx: number; vy: number; gravity: number; size: number }> = {
    flipCup: { kind: 'star', color: '#edc45d', x: Math.random() * width, y: 80, vx: (Math.random() - .5) * .03, vy: .035, gravity: .00003, size: 8 },
    beerPong: { kind: 'circle', color: '#75bfd1', x: 100 + Math.random() * (width - 200), y: 35, vx: (Math.random() - .5) * .018, vy: .022, gravity: 0, size: 7 },
    flunkyball: { kind: 'dirt', color: '#d4bd82', x: Math.random() * width, y: height - 56, vx: .02 + Math.random() * .035, vy: -.015, gravity: .00002, size: 13 },
    hedgePee: { kind: 'dirt', color: '#75c68c', x: 60 + Math.random() * (width - 120), y: 170, vx: (Math.random() - .5) * .035, vy: .018, gravity: .000015, size: 11 },
    maslHole: { kind: 'smoke', color: '#d9e5de', x: width / 2 + (Math.random() - .5) * 160, y: height - 70, vx: (Math.random() - .5) * .025, vy: -.05, gravity: -.000012, size: 34 },
  };
  const entry = configuration[state.game];
  state.particles.push({
    ...entry,
    rotation: Math.random() * Math.PI * 2,
    spin: (Math.random() - .5) * .0015,
    life: 1500 + Math.random() * 1100,
    maxLife: 2600,
    alpha: .22 + Math.random() * .2,
  });
}

function drawParticle(ctx: CanvasRenderingContext2D, state: VisualState, particle: Particle): void {
  const progress = Math.max(0, particle.life / particle.maxLife);
  const alpha = particle.alpha * Math.min(1, progress * 2.3);
  ctx.save();
  ctx.translate(particle.x, particle.y);
  ctx.rotate(particle.rotation);
  ctx.globalAlpha = alpha;
  const image = state.assets[particle.kind];
  if (image) {
    ctx.drawImage(image, -particle.size / 2, -particle.size / 2, particle.size, particle.size);
  } else {
    drawFallbackParticle(ctx, particle);
  }
  ctx.restore();
}

function drawFallbackParticle(ctx: CanvasRenderingContext2D, particle: Particle): void {
  ctx.fillStyle = particle.color;
  ctx.strokeStyle = particle.color;
  if (particle.kind === 'smoke') {
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, particle.size / 2);
    gradient.addColorStop(0, 'rgba(225,235,229,.75)');
    gradient.addColorStop(1, 'rgba(225,235,229,0)');
    ctx.fillStyle = gradient;
    ctx.beginPath(); ctx.arc(0, 0, particle.size / 2, 0, Math.PI * 2); ctx.fill();
  } else if (particle.kind === 'star' || particle.kind === 'spark') {
    const points = particle.kind === 'star' ? 5 : 4;
    ctx.beginPath();
    for (let index = 0; index < points * 2; index += 1) {
      const radius = index % 2 ? particle.size * .18 : particle.size * .5;
      const angle = -Math.PI / 2 + index * Math.PI / points;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (index === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath(); ctx.fill();
  } else if (particle.kind === 'trace') {
    ctx.lineWidth = Math.max(2, particle.size * .14);
    ctx.beginPath(); ctx.moveTo(-particle.size / 2, 0); ctx.lineTo(particle.size / 2, 0); ctx.stroke();
  } else if (particle.kind === 'dirt') {
    ctx.beginPath(); ctx.ellipse(0, 0, particle.size * .42, particle.size * .22, .4, 0, Math.PI * 2); ctx.fill();
  } else {
    ctx.beginPath(); ctx.arc(0, 0, particle.size * .34, 0, Math.PI * 2); ctx.fill();
  }
}

function drawRing(ctx: CanvasRenderingContext2D, ring: Ring): void {
  const progress = 1 - ring.life / ring.maxLife;
  ctx.save();
  ctx.globalAlpha = Math.max(0, 1 - progress) * .8;
  ctx.strokeStyle = ring.color;
  ctx.lineWidth = ring.width * (1 - progress * .55);
  ctx.beginPath();
  ctx.arc(ring.x, ring.y, ring.radius + (ring.maxRadius - ring.radius) * progress, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function effectOrigin(game: MiniGameId, kicker: string): { x: number; y: number } {
  if (game === 'flipCup') return { x: 450, y: /LEER/.test(kicker) ? 270 : 235 };
  if (game === 'beerPong') return { x: 450, y: /DANEBEN/.test(kicker) ? 330 : 145 };
  if (game === 'flunkyball') return { x: 450, y: /STOPP/.test(kicker) ? 205 : 245 };
  if (game === 'hedgePee') return { x: 450, y: 220 };
  return { x: 450, y: 225 };
}

function toneColor(tone: FeedbackTone): string {
  if (tone === 'good') return '#7bd29b';
  if (tone === 'bad') return '#e37463';
  if (tone === 'warning') return '#efbd5e';
  return '#75bfd1';
}

function ambientInterval(game: MiniGameId): number {
  return game === 'maslHole' ? 150 : game === 'hedgePee' ? 230 : 330;
}

function resizeOverlay(state: VisualState): void {
  if (state.overlay.width !== 900) state.overlay.width = 900;
  if (state.overlay.height !== 430) state.overlay.height = 430;
}

function clearCanvas(state: VisualState): void {
  state.context.clearRect(0, 0, state.overlay.width, state.overlay.height);
}

function normalizeGame(value?: string): MiniGameId {
  return ['flipCup', 'beerPong', 'flunkyball', 'hedgePee', 'maslHole'].includes(value ?? '') ? value as MiniGameId : 'flipCup';
}

function reducedMotion(): boolean {
  return document.documentElement.classList.contains('ux-reduced-motion') || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
}

function destroy(state: VisualState): void {
  if (state.destroyed) return;
  state.destroyed = true;
  stopLoop(state);
  state.observer.disconnect();
  state.resizeObserver?.disconnect();
  state.overlay.remove();
  state.stage.querySelector('.minigame-vfx-badge')?.remove();
  const gameCanvas = state.stage.querySelector<HTMLCanvasElement>('canvas:not(.minigame-vfx-canvas)');
  if (gameCanvas) state.stage.before(gameCanvas);
  state.stage.remove();
  controllers.delete(state.root);
}

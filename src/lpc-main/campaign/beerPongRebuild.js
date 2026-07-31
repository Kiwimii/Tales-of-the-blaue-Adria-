import './beerPongRebuild.css';

const BALL_ORIGIN = { x: .5, y: .885 };
const VERSION = 'beer-pong-perspective-v4';

export function createBeerPongCups() {
  const rows = [
    { depth: .965, xs: [.5] },
    { depth: .91, xs: [.445, .555] },
    { depth: .855, xs: [.39, .5, .61] },
    { depth: .80, xs: [.335, .445, .555, .665] },
  ];
  let id = 0;
  return rows.flatMap((row) => row.xs.map((x) => ({ id: id++, x, depth: row.depth, active: true })));
}

export function createBeerPongShotPlan(pullPoint, mode) {
  const pullX = clamp(BALL_ORIGIN.x - pullPoint.x, -.30, .30);
  const pullY = clamp(pullPoint.y - BALL_ORIGIN.y, 0, .30);
  if (Math.hypot(pullX, pullY) < .035) return undefined;
  const power = clamp(pullY * 7 + Math.abs(pullX) * .45, .42, 1.05);
  return {
    mode,
    targetX: clamp(.5 + pullX * 1.55, .25, .75),
    range: clamp(.72 + power * .31, .84, 1.045),
    power,
    duration: Math.round(1120 - power * 210 + (mode === 'bounce' ? 120 : 0)),
  };
}

export function sampleBeerPongShot(plan, progress) {
  const t = clamp(progress, 0, 1);
  let depth;
  let height;
  let bounced = false;
  if (plan.mode === 'bounce') {
    if (t < .5) {
      const local = t / .5;
      depth = plan.range * .5 * local;
      height = Math.sin(Math.PI * local) * (.075 + plan.power * .045);
    } else {
      const local = (t - .5) / .5;
      depth = plan.range * (.5 + .5 * local);
      height = Math.sin(Math.PI * local) * (.12 + plan.power * .065);
      bounced = true;
    }
  } else {
    depth = plan.range * t;
    height = Math.sin(Math.PI * t) * (.18 + plan.power * .10);
  }
  const eased = 1 - Math.pow(1 - t, 1.18);
  return { x: .5 + (plan.targetX - .5) * eased, depth, height, progress: t, bounced };
}

export function findBeerPongHit(cups, sample) {
  if (sample.progress < (sample.bounced ? .79 : .67) || sample.height > .115) return undefined;
  return cups
    .filter((cup) => cup.active)
    .map((cup) => ({ cup, distance: Math.hypot((sample.x - cup.x) / .061, (sample.depth - cup.depth) / .052) }))
    .filter((entry) => entry.distance <= 1)
    .sort((a, b) => a.distance - b.distance)[0]?.cup;
}

export function projectBeerPongPoint(point, width, height) {
  const depth = clamp(point.depth, 0, 1.08);
  const perspective = lerp(.96, .43, clamp(depth, 0, 1));
  const tableY = lerp(.89, .19, clamp(depth, 0, 1));
  return {
    x: width * (.5 + (point.x - .5) * perspective),
    y: height * (tableY - point.height * .70),
    scale: lerp(1, .42, clamp(depth, 0, 1)),
  };
}

export class BeerPongRebuild {
  constructor(root, onOutcome, getContext) {
    this.root = root;
    this.onOutcome = onOutcome;
    this.getContext = getContext;
    this.canvas = requireElement(root, 'canvas');
    this.ctx = this.canvas.getContext('2d');
    if (!this.ctx) throw new Error('Beer Pong canvas context unavailable.');
    this.title = requireElement(root, '[data-mini-title]');
    this.copy = requireElement(root, '[data-mini-copy]');
    this.hint = requireElement(root, '[data-mini-hint]');
    this.action = requireElement(root, '[data-mini-action]');
    this.result = requireElement(root, '[data-mini-result]');
    this.briefing = requireElement(root, '[data-mini-briefing]');
    this.phaseLabel = requireElement(root, '[data-mini-phase]');
    this.liveLabel = requireElement(root, '[data-mini-live]');
    this.pauseButton = requireElement(root, '[data-mini-pause]');
    this.helpButton = requireElement(root, '[data-mini-help]');
    this.retryButton = requireElement(root, '[data-mini-retry]');
    this.startButton = requireElement(root, '.mini-start');
    this.raf = 0;
    this.last = 0;
    this.activePointer = undefined;

    this.startButton.addEventListener('click', () => { if (this.isActive()) this.begin(); });
    this.action.addEventListener('click', () => { if (this.isActive()) this.toggleMode(); });
    this.pauseButton.addEventListener('click', () => { if (this.isActive()) this.togglePause(); });
    this.helpButton.addEventListener('click', () => { if (this.isActive()) this.toggleHelp(); });
    this.retryButton.addEventListener('click', () => { if (this.isActive()) this.start(); });
    this.canvas.addEventListener('pointerdown', (event) => this.pointerDown(event));
    this.canvas.addEventListener('pointermove', (event) => this.pointerMove(event));
    this.canvas.addEventListener('pointerup', (event) => this.pointerUp(event));
    this.canvas.addEventListener('pointercancel', (event) => this.pointerUp(event));
  }

  start() {
    this.stop(false);
    this.context = this.getContext();
    this.state = {
      running: false, paused: true, countdown: 0, phase: 'briefing', mode: 'direct',
      cups: createBeerPongCups(), playerCups: 10, hits: 0, opponentHits: 0, misses: 0,
      bounceHits: 0, streak: 0, bestStreak: 0, opponentStreak: 0, preview: [],
      flightElapsed: 0, blockChecked: false, opponentElapsed: 0, opponentWillHit: false,
      resultText: 'Ball greifen und nach hinten ziehen.', resultTone: 'neutral', resultTimer: 0,
    };
    this.root.hidden = false;
    this.root.dataset.miniGame = 'beerPong';
    this.root.dataset.beerPongVersion = VERSION;
    this.root.classList.add('beer-pong-rebuild-active');
    this.canvas.width = 900;
    this.canvas.height = 430;
    this.title.textContent = 'Beer Pong · Perspektivisches Tischduell';
    this.copy.textContent = 'Du stehst am nahen Tischende und wirfst auf die gegnerische Formation. Treffer geben einen weiteren Wurf; ein Fehlschuss übergibt an den Gegner.';
    this.hint.textContent = 'Ball berühren, nach hinten ziehen und loslassen. Die angezeigte Flugbahn entspricht dem tatsächlichen Wurf.';
    this.action.textContent = 'WURFART: DIREKT';
    this.action.disabled = true;
    this.pauseButton.disabled = true;
    this.pauseButton.textContent = 'Pause';
    this.retryButton.hidden = true;
    this.result.hidden = true;
    this.result.textContent = '';
    this.renderBriefing();
    this.last = performance.now();
    this.raf = requestAnimationFrame((time) => this.tick(time));
  }

  stop(hide = true) {
    cancelAnimationFrame(this.raf);
    this.raf = 0;
    this.activePointer = undefined;
    this.state = undefined;
    this.context = undefined;
    this.root.classList.remove('beer-pong-rebuild-active');
    delete this.root.dataset.beerPongVersion;
    document.body.classList.remove('minigame-paused');
    if (hide) this.root.hidden = true;
  }

  isActive() {
    return Boolean(this.state && this.root.dataset.miniGame === 'beerPong' && this.root.classList.contains('beer-pong-rebuild-active'));
  }

  debugSkipCountdown() { if (this.state) this.state.countdown = 0; }
  debugSetState(values) { if (this.state) Object.assign(this.state, values); }
  debugSnapshot() {
    if (!this.state) return {};
    return {
      ...structuredClone(this.state),
      pointerCount: this.activePointer === undefined ? 0 : 1,
      holding: false,
      pausedClass: document.body.classList.contains('minigame-paused'),
      opponentCups: this.state.cups.filter((cup) => cup.active).length,
      version: VERSION,
    };
  }

  renderBriefing() {
    const flags = this.context?.flags ?? {};
    const assist = flags['assist-precision']
      ? 'Gregors Präzisionshilfe verbreitert die Bechertoleranz.'
      : flags['partner-susi-pong']
        ? 'Susi reduziert die Chance, dass ein Aufdotzer abgewehrt wird.'
        : 'Keine aktive Wurfhilfe.';
    this.briefing.hidden = false;
    this.briefing.innerHTML = `<article>
      <span>PERSPEKTIVISCHES TISCHDUELL</span><h3>Räume die zehn Becher am gegenüberliegenden Tischende ab.</h3>
      <div class="mini-briefing-grid">
        <section><b>STEUERUNG</b><p><i>1</i>Ball unten am Tisch berühren.</p><p><i>2</i>Nach hinten ziehen; die Flugbahn wird immer angezeigt.</p><p><i>3</i>Loslassen und den tatsächlichen Ballflug beobachten.</p></section>
        <section><b>ZUGREGEL</b><p>Treffer: Du bleibst dran. Fehlschuss: Gegner ist dran.</p><b>AUFDOTZER</b><p>Entfernt zwei Becher, kann aber von der Gegenseite abgewehrt werden.</p></section>
      </div><div class="mini-assist active"><small>AKTIVE HILFE</small><strong>${escapeHtml(assist)}</strong></div>
    </article>`;
    this.briefing.querySelector('article')?.append(this.startButton);
    this.startButton.textContent = 'SPIEL STARTEN';
  }

  begin() {
    if (!this.state || this.state.running) return;
    this.briefing.hidden = true;
    Object.assign(this.state, { running: true, paused: false, countdown: 1800, phase: 'ready' });
    this.action.disabled = false;
    this.pauseButton.disabled = false;
    this.setFeedback('START', 'Am nahen Tischende bereitmachen.', 'neutral');
  }

  toggleMode() {
    const state = this.state;
    if (!state?.running || state.paused || state.countdown > 0 || !['ready', 'aiming'].includes(state.phase)) return;
    state.mode = state.mode === 'direct' ? 'bounce' : 'direct';
    this.action.textContent = `WURFART: ${state.mode === 'bounce' ? 'AUFDOTZER' : 'DIREKT'}`;
    state.preview = state.dragNow ? previewPlan(createBeerPongShotPlan(state.dragNow, state.mode)) : [];
    this.setFeedback('WURFART', state.mode === 'bounce' ? 'Zwei Becher möglich · Abwehr möglich' : 'Ein Becher · nicht abwehrbar', 'neutral');
  }

  togglePause() {
    const state = this.state;
    if (!state?.running || state.phase === 'finished') return;
    state.paused = !state.paused;
    this.pauseButton.textContent = state.paused ? 'Fortsetzen' : 'Pause';
    document.body.classList.toggle('minigame-paused', state.paused);
  }

  toggleHelp() {
    const state = this.state;
    if (!state) return;
    const show = this.briefing.hidden;
    this.briefing.hidden = !show;
    if (show && state.running) {
      state.paused = true;
      this.pauseButton.textContent = 'Fortsetzen';
      document.body.classList.add('minigame-paused');
    }
  }

  pointerDown(event) {
    const state = this.state;
    if (!this.inputAllowed() || !state || state.phase !== 'ready') return;
    const point = this.point(event);
    if (Math.hypot(point.x - BALL_ORIGIN.x, point.y - BALL_ORIGIN.y) > .16) return;
    event.preventDefault();
    this.activePointer = event.pointerId;
    this.canvas.setPointerCapture(event.pointerId);
    state.phase = 'aiming';
    state.dragNow = point;
    state.preview = previewPlan(createBeerPongShotPlan(point, state.mode));
  }

  pointerMove(event) {
    const state = this.state;
    if (!this.inputAllowed() || !state || this.activePointer !== event.pointerId || state.phase !== 'aiming') return;
    state.dragNow = this.point(event);
    state.preview = previewPlan(createBeerPongShotPlan(state.dragNow, state.mode));
  }

  pointerUp(event) {
    const state = this.state;
    if (!state || this.activePointer !== event.pointerId) return;
    const point = this.point(event);
    this.activePointer = undefined;
    if (!this.inputAllowed() || state.phase !== 'aiming') return;
    const plan = createBeerPongShotPlan(point, state.mode);
    state.dragNow = undefined;
    state.preview = [];
    if (!plan) {
      state.phase = 'ready';
      this.setFeedback('ZU KURZ', 'Ball weiter nach hinten ziehen.', 'warning');
      return;
    }
    state.plan = plan;
    state.ball = sampleBeerPongShot(plan, 0);
    state.flightElapsed = 0;
    state.blockChecked = false;
    state.phase = 'flight';
    this.action.disabled = true;
  }

  tick(time) {
    if (!this.state) return;
    const delta = Math.min(48, Math.max(0, time - this.last || 16));
    this.last = time;
    const state = this.state;
    if (state.running && !state.paused) {
      if (state.countdown > 0) state.countdown = Math.max(0, state.countdown - delta);
      else if (state.phase === 'flight') this.tickFlight(delta);
      else if (state.phase === 'opponent') this.tickOpponent(delta);
      if (state.resultTimer > 0) state.resultTimer = Math.max(0, state.resultTimer - delta);
    }
    this.syncLabels();
    this.draw();
    this.raf = requestAnimationFrame((next) => this.tick(next));
  }

  tickFlight(delta) {
    const state = this.state;
    const plan = state?.plan;
    if (!state || !plan) return this.nextPlayerTurn();
    state.flightElapsed += delta;
    const progress = clamp(state.flightElapsed / plan.duration, 0, 1);
    state.ball = sampleBeerPongShot(plan, progress);

    if (plan.mode === 'bounce' && !state.blockChecked && progress >= .5) {
      state.blockChecked = true;
      const base = this.context?.flags?.['partner-susi-pong'] ? .12 : .27;
      if (Math.random() < clamp(base * difficultyValue(this.context), .08, .38)) {
        state.ball = undefined;
        state.misses += 1;
        state.streak = 0;
        this.setFeedback('ABGEWEHRT', 'Die Gegenseite schlägt den Aufdotzer weg.', 'bad');
        this.beginOpponentTurn();
        return;
      }
    }

    const hit = findBeerPongHit(state.cups, state.ball);
    if (hit) {
      hit.active = false;
      let removed = 1;
      if (plan.mode === 'bounce') {
        const second = nearestActiveCup(state.cups, hit);
        if (second) { second.active = false; removed = 2; }
        state.bounceHits += 1;
      }
      state.hits += removed;
      state.streak += 1;
      state.bestStreak = Math.max(state.bestStreak, state.streak);
      state.ball = undefined;
      this.autoRerack();
      this.setFeedback(plan.mode === 'bounce' ? 'AUFDOTZER TRIFFT' : 'TREFFER', `${removed} Becher weg · du bist erneut dran`, 'good');
      if (state.cups.every((cup) => !cup.active)) return this.finish(true);
      this.nextPlayerTurn();
      return;
    }

    if (progress >= 1) {
      state.ball = undefined;
      state.misses += 1;
      state.streak = 0;
      this.setFeedback('DANEBEN', 'Der Gegner ist am Zug.', 'bad');
      this.beginOpponentTurn();
    }
  }

  beginOpponentTurn() {
    const state = this.state;
    if (!state) return;
    state.phase = 'opponent';
    state.opponentElapsed = 0;
    state.opponentWillHit = Math.random() < opponentHitChance(this.context);
    this.action.disabled = true;
  }

  tickOpponent(delta) {
    const state = this.state;
    if (!state) return;
    state.opponentElapsed += delta;
    if (state.opponentElapsed < 1180) return;
    if (!state.opponentWillHit) {
      state.opponentStreak = 0;
      this.setFeedback('GEGNER DANEBEN', 'Du bist wieder dran.', 'good');
      this.nextPlayerTurn();
      return;
    }
    state.playerCups = Math.max(0, state.playerCups - 1);
    state.opponentHits += 1;
    state.opponentStreak += 1;
    this.setFeedback('GEGNER TRIFFT', `${state.playerCups} eigene Becher übrig`, 'bad');
    if (state.playerCups <= 0) return this.finish(false);
    const another = state.opponentStreak < 3 && Math.random() < opponentHitChance(this.context) * .72;
    if (another) {
      state.opponentElapsed = 0;
      state.opponentWillHit = true;
    } else {
      state.opponentWillHit = false;
      state.opponentElapsed = 700;
    }
  }

  nextPlayerTurn() {
    const state = this.state;
    if (!state || state.phase === 'finished') return;
    Object.assign(state, {
      phase: 'ready', plan: undefined, ball: undefined, preview: [], dragNow: undefined,
      opponentElapsed: 0, opponentWillHit: false, opponentStreak: 0,
    });
    this.action.disabled = false;
    this.hint.textContent = 'Ball unten greifen, nach hinten ziehen und auf die gegenüberliegenden Becher zielen.';
  }

  autoRerack() {
    const remaining = this.state?.cups.filter((cup) => cup.active) ?? [];
    if (![6, 3, 1].includes(remaining.length)) return;
    const layouts = remaining.length === 6
      ? createBeerPongCups().slice(0, 6)
      : remaining.length === 3
        ? [{ x: .5, depth: .94 }, { x: .445, depth: .86 }, { x: .555, depth: .86 }]
        : [{ x: .5, depth: .91 }];
    remaining.forEach((cup, index) => Object.assign(cup, { x: layouts[index].x, depth: layouts[index].depth }));
  }

  finish(success) {
    const state = this.state;
    if (!state || state.phase === 'finished') return;
    state.phase = 'finished';
    state.running = false;
    state.paused = true;
    this.action.disabled = true;
    this.pauseButton.disabled = true;
    this.retryButton.hidden = false;
    const score = Math.max(0, Math.round(state.hits * 13 - state.misses * 3 + state.bounceHits * 12 + state.bestStreak * 5 - state.opponentHits * 2));
    const quality = success && state.misses <= 2 && state.bounceHits >= 1 ? 'perfect' : success && state.misses <= 6 ? 'solid' : success ? 'messy' : 'failed';
    const outcome = {
      id: 'beerPong', success, score, quality,
      text: success
        ? quality === 'perfect'
          ? 'Die gegnerische Formation ist leer. Direkte Würfe, ein kontrollierter Aufdotzer und eine lange Trefferfolge lassen keine Ausrede übrig.'
          : 'Der letzte gegnerische Becher ist weg. Jeder Treffer brachte einen weiteren Wurf und die Tischperspektive wurde tatsächlich genutzt.'
        : 'Die Gegenseite räumt eure Formation zuerst ab. Trefferketten und Aufdotzer bleiben für den nächsten Versuch erhalten.',
      needs: { alcohol: success ? 12 : 8, bladder: success ? 8 : 5, courage: success ? 6 : -2 },
      metrics: { reputation: success ? (quality === 'perfect' ? 6 : 3) : -1, momentum: success ? 4 : -2 },
      relationships: relationshipEffects(this.context, success),
      flags: quality === 'perfect' ? { 'pong-perspective-mastered': true } : undefined,
    };
    this.result.hidden = false;
    this.result.innerHTML = `<strong>${success ? quality === 'perfect' ? 'LEGENDÄR' : 'GEWONNEN' : 'VERLOREN'}</strong><p>${escapeHtml(outcome.text)}</p><div class="mini-result-stats"><span>Wert <b>${score}</b></span><span>Treffer <b>${state.hits}</b></span><span>Aufdotzer <b>${state.bounceHits}</b></span></div>`;
    this.setFeedback(success ? 'GEWONNEN' : 'VERLOREN', `Wert ${score}`, success ? 'good' : 'bad');
    this.onOutcome(outcome);
  }

  syncLabels() {
    const state = this.state;
    if (!state) return;
    const remaining = state.cups.filter((cup) => cup.active).length;
    if (state.countdown > 0) {
      this.phaseLabel.textContent = 'START';
      this.liveLabel.textContent = String(Math.ceil(state.countdown / 1000));
    } else {
      this.phaseLabel.textContent = state.phase === 'opponent' ? 'GEGNER AM ZUG' : `${remaining} GEGNERBECHER`;
      this.liveLabel.textContent = state.resultTimer > 0 ? state.resultText : phaseText(state);
    }
    const bar = this.root.querySelector('.mini-live-progress i');
    if (bar) bar.style.width = `${(10 - remaining) * 10}%`;
  }

  setFeedback(kicker, text, tone) {
    const state = this.state;
    if (!state) return;
    Object.assign(state, { resultText: text, resultTone: tone, resultTimer: 900 });
    this.phaseLabel.textContent = kicker;
    this.liveLabel.textContent = text;
    this.root.dataset.beerPongFeedback = tone;
    window.setTimeout(() => { if (this.root.dataset.beerPongFeedback === tone) delete this.root.dataset.beerPongFeedback; }, 680);
    if (typeof navigator.vibrate === 'function') navigator.vibrate(tone === 'good' ? [12, 25, 12] : tone === 'bad' ? [36] : [10]);
  }

  draw() {
    const state = this.state;
    if (!state) return;
    const { ctx, canvas } = this;
    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);
    drawBackground(ctx, width, height);
    drawPerspectiveTable(ctx, width, height);
    drawOpponent(ctx, width, height, state);
    drawOpponentCups(ctx, width, height, state.cups);
    drawPlayerRack(ctx, width, height, state.playerCups);
    drawAim(ctx, width, height, state);
    drawBall(ctx, width, height, state);
    drawHud(ctx, width, state);
    if (state.paused && state.running) drawOverlay(ctx, width, height, 'PAUSIERT', 'Fortsetzen über die Schaltfläche oberhalb des Spielfelds');
    else if (state.countdown > 0) drawOverlay(ctx, width, height, String(Math.ceil(state.countdown / 1000)), 'Am Tisch bereitmachen');
  }

  point(event) {
    const rect = this.canvas.getBoundingClientRect();
    return { x: clamp((event.clientX - rect.left) / rect.width, 0, 1), y: clamp((event.clientY - rect.top) / rect.height, 0, 1) };
  }

  inputAllowed() {
    return Boolean(this.state?.running && !this.state.paused && this.state.countdown <= 0 && this.state.phase !== 'finished');
  }
}

function previewPlan(plan) {
  return plan ? Array.from({ length: 34 }, (_, index) => sampleBeerPongShot(plan, index / 33)) : [];
}
function nearestActiveCup(cups, hit) {
  return cups.filter((cup) => cup.active && cup !== hit).sort((a, b) => Math.hypot(a.x - hit.x, a.depth - hit.depth) - Math.hypot(b.x - hit.x, b.depth - hit.depth))[0];
}
function opponentHitChance(context) {
  const partnerFactor = context?.flags?.['partner-susi-pong'] ? -.07 : 0;
  return clamp(.44 + (difficultyValue(context) - 1) * .28 + partnerFactor, .32, .62);
}
function difficultyValue(context) {
  if (!context) return 1;
  let value = context.attempts === 0 ? .84 : context.wins >= 2 ? 1.06 : 1;
  if (context.bestQuality === 'perfect') value += .05;
  return clamp(value, .82, 1.14);
}
function relationshipEffects(context, success) {
  if (!context) return {};
  const ids = ['susi', 'felix'].filter((id) => context.activeTeam.includes(id) || context.flags?.[`partner-${id}-pong`]);
  return Object.fromEntries(ids.map((id) => [id, success ? 2 : 0]));
}
function phaseText(state) {
  if (state.phase === 'aiming') return state.mode === 'bounce' ? 'Aufdotzer ausrichten und loslassen' : 'Flugbahn ausrichten und loslassen';
  if (state.phase === 'flight') return state.mode === 'bounce' ? 'Aufdotzer unterwegs' : 'Direkter Ballflug';
  if (state.phase === 'opponent') return 'Gegner zielt auf eure Becher';
  if (state.phase === 'finished') return 'Match beendet';
  return state.mode === 'bounce' ? 'Ball greifen · Aufdotzer gewählt' : 'Ball greifen · Direktwurf gewählt';
}

function drawBackground(ctx, width, height) {
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, '#101b28'); gradient.addColorStop(.48, '#274d50'); gradient.addColorStop(1, '#10261f');
  ctx.fillStyle = gradient; ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = 'rgba(244,205,110,.12)';
  for (let index = 0; index < 11; index += 1) { ctx.beginPath(); ctx.arc(55 + index * 82, 46 + Math.sin(index * 1.7) * 10, 4, 0, Math.PI * 2); ctx.fill(); }
}
function drawPerspectiveTable(ctx, width, height) {
  ctx.fillStyle = '#5d2c2a'; ctx.beginPath();
  ctx.moveTo(width * .19, height * .96); ctx.lineTo(width * .81, height * .96); ctx.lineTo(width * .635, height * .14); ctx.lineTo(width * .365, height * .14); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#e4b45d'; ctx.lineWidth = 5; ctx.stroke();
  ctx.strokeStyle = 'rgba(255,244,211,.38)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(width * .5, height * .95); ctx.lineTo(width * .5, height * .15); ctx.stroke();
  ctx.fillStyle = '#40211f'; ctx.fillRect(width * .18, height * .95, width * .64, 12);
}
function drawOpponent(ctx, width, height, state) {
  ctx.save(); ctx.translate(width * .5, height * .105); ctx.fillStyle = '#17191e';
  ctx.beginPath(); ctx.arc(0, 0, 22, 0, Math.PI * 2); ctx.fill(); ctx.fillRect(-21, 19, 42, 52);
  if (state.phase === 'opponent') { ctx.strokeStyle = '#f0d17a'; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(-12, 28); ctx.lineTo(-62 + Math.sin(state.opponentElapsed / 160) * 12, 58); ctx.stroke(); }
  ctx.restore();
}
function drawOpponentCups(ctx, width, height, cups) {
  for (const cup of cups) {
    if (!cup.active) continue;
    const point = projectBeerPongPoint({ x: cup.x, depth: cup.depth, height: 0 }, width, height);
    const rx = 19 * point.scale, ry = 11 * point.scale;
    ctx.fillStyle = '#d84e58'; ctx.beginPath(); ctx.ellipse(point.x, point.y, rx, ry, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#fff0d4'; ctx.lineWidth = Math.max(1.5, 3 * point.scale); ctx.stroke();
    ctx.fillStyle = 'rgba(245,205,83,.72)'; ctx.beginPath(); ctx.ellipse(point.x, point.y - ry * .1, rx * .72, ry * .55, 0, 0, Math.PI * 2); ctx.fill();
  }
}
function drawPlayerRack(ctx, width, height, remaining) {
  ctx.fillStyle = 'rgba(7,15,18,.78)'; roundRect(ctx, 18, height - 94, 176, 69, 14); ctx.fill();
  ctx.fillStyle = '#f6e7bd'; ctx.font = '800 11px system-ui'; ctx.fillText(`EURE BECHER · ${remaining}/10`, 31, height - 69);
  for (let index = 0; index < 10; index += 1) { ctx.fillStyle = index < remaining ? '#d84e58' : '#433536'; ctx.beginPath(); ctx.arc(34 + index * 14, height - 46, 5, 0, Math.PI * 2); ctx.fill(); }
}
function drawAim(ctx, width, height, state) {
  if (!state.preview.length) return;
  ctx.save(); ctx.setLineDash([5, 9]); ctx.strokeStyle = state.mode === 'bounce' ? '#efc052' : '#75dac3'; ctx.lineWidth = 4; ctx.beginPath();
  state.preview.forEach((sample, index) => { const point = projectBeerPongPoint(sample, width, height); if (index === 0) ctx.moveTo(point.x, point.y); else ctx.lineTo(point.x, point.y); });
  ctx.stroke(); ctx.setLineDash([]);
  if (state.mode === 'bounce') {
    const sample = state.preview[Math.floor(state.preview.length / 2)];
    const point = projectBeerPongPoint(sample, width, height);
    ctx.fillStyle = '#efc052'; ctx.beginPath(); ctx.arc(point.x, point.y, 7, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff0bd'; ctx.font = '800 10px system-ui'; ctx.fillText('AUFDOTZER', point.x + 10, point.y - 8);
  }
  ctx.restore();
  if (state.dragNow) { ctx.strokeStyle = 'rgba(255,255,255,.76)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(BALL_ORIGIN.x * width, BALL_ORIGIN.y * height); ctx.lineTo(state.dragNow.x * width, state.dragNow.y * height); ctx.stroke(); }
}
function drawBall(ctx, width, height, state) {
  let x = BALL_ORIGIN.x * width, y = BALL_ORIGIN.y * height, scale = 1;
  if (state.ball) { const point = projectBeerPongPoint(state.ball, width, height); x = point.x; y = point.y; scale = point.scale; }
  else if (state.phase === 'opponent') { const t = clamp(state.opponentElapsed / 1180, 0, 1); x = width * (.5 + Math.sin(t * Math.PI) * .08); y = height * lerp(.15, .82, t) - Math.sin(Math.PI * t) * 90; scale = lerp(.45, 1, t); }
  ctx.fillStyle = '#f7f3df'; ctx.beginPath(); ctx.arc(x, y, Math.max(5, 11 * scale), 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = '#c9c0a6'; ctx.lineWidth = 2; ctx.stroke();
}
function drawHud(ctx, width, state) {
  const remaining = state.cups.filter((cup) => cup.active).length;
  ctx.fillStyle = 'rgba(5,13,18,.76)'; roundRect(ctx, width - 276, 16, 258, 68, 14); ctx.fill();
  ctx.fillStyle = '#fff1c4'; ctx.font = '800 13px system-ui'; ctx.fillText(`GEGNER ${remaining}/10 · IHR ${state.playerCups}/10`, width - 258, 42);
  ctx.fillStyle = state.mode === 'bounce' ? '#efc052' : '#75dac3'; ctx.font = '900 11px system-ui'; ctx.fillText(`${state.mode === 'bounce' ? 'AUFDOTZER' : 'DIREKT'} · SERIE ${state.streak}`, width - 258, 64);
}
function drawOverlay(ctx, width, height, title, copy) {
  ctx.fillStyle = 'rgba(5,15,12,.76)'; ctx.fillRect(0, 0, width, height); ctx.textAlign = 'center'; ctx.fillStyle = '#fff1c4'; ctx.font = '900 68px system-ui'; ctx.fillText(title, width / 2, height / 2 - 12); ctx.font = '700 17px system-ui'; ctx.fillStyle = '#c8d9d0'; ctx.fillText(copy, width / 2, height / 2 + 28); ctx.textAlign = 'left';
}
function roundRect(ctx, x, y, width, height, radius) { ctx.beginPath(); ctx.roundRect(x, y, width, height, radius); }
function requireElement(root, selector) { const node = root.querySelector(selector); if (!node) throw new Error(`Missing Beer Pong element: ${selector}`); return node; }
function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
function lerp(start, end, value) { return start + (end - start) * value; }
function escapeHtml(value) { return String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character] ?? character); }

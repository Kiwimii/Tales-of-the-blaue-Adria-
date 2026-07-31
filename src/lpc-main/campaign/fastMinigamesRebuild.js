import './fastMinigamesRebuild.css';

const VERSION = 'fast-hedge-masl-v1';
const SUPPORTED = new Set(['hedgePee', 'maslHole']);
const SPOTS = [
  { x: .27, label: 'NAHER BUSCH', rate: .0132, cover: .86 },
  { x: .50, label: 'TIEFE HECKE', rate: .0108, cover: .68 },
  { x: .74, label: 'TAUCHERZELT', rate: .0117, cover: .77 },
];

export function advancePatrol(position, direction, speed, delta) {
  let next = position + direction * speed * delta;
  let nextDirection = direction;
  if (next >= .97) { next = .97 - (next - .97); nextDirection = -1; }
  if (next <= .03) { next = .03 + (.03 - next); nextDirection = 1; }
  return { position: clamp(next, .03, .97), direction: nextDirection };
}

export function hedgeSight(observer, direction, target, range, cover = 1) {
  const forward = (target - observer) * direction;
  return forward >= -.018 && forward <= range * cover;
}

export function hedgeCompletionSeconds(spotIndex, difficulty = 1) {
  const spot = SPOTS[spotIndex] ?? SPOTS[1];
  return 100 / (spot.rate * 1000 / difficulty);
}

export function maslSealScore(left, right, targetX = .5) {
  const gap = right.x - left.x;
  const level = Math.abs(left.y - right.y);
  const center = (left.x + right.x) / 2;
  const vertical = Math.abs((left.y + right.y) / 2 - .56);
  return clamp(1 - Math.abs(gap - .225) * 5.2 - level * 3.4 - Math.abs(center - targetX) * 3.8 - vertical * 1.7, 0, 1);
}

export function maslPullResult(pull, seal, rhythmRatio, cough) {
  const inReleaseZone = pull >= 58 && pull <= 86;
  const good = inReleaseZone && seal >= .64 && rhythmRatio >= .52 && cough < 92;
  const releaseAccuracy = Math.max(0, 1 - Math.abs(72 - pull) / 28);
  const score = Math.max(5, Math.round(24 + seal * 42 + rhythmRatio * 28 + releaseAccuracy * 22 - cough * .22));
  return { good, score };
}

export class FastMinigamesRebuild {
  constructor(root, onOutcome, getContext) {
    this.root = root;
    this.onOutcome = onOutcome;
    this.getContext = getContext;
    this.canvas = requireElement(root, 'canvas');
    this.ctx = this.canvas.getContext('2d');
    if (!this.ctx) throw new Error('Fast minigame canvas context unavailable.');
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
    this.startButton = document.createElement('button');
    this.startButton.type = 'button';
    this.startButton.className = 'primary mini-start fast-minigame-start';
    this.startButton.textContent = 'SPIEL STARTEN';
    this.raf = 0;
    this.last = 0;
    this.state = undefined;
    this.context = undefined;
    this.activePointer = undefined;

    this.startButton.addEventListener('click', () => this.begin());
    this.action.addEventListener('pointerdown', (event) => this.actionDown(event));
    this.action.addEventListener('pointerup', () => this.actionUp());
    this.action.addEventListener('pointerleave', () => this.actionUp());
    this.action.addEventListener('pointercancel', () => this.actionUp());
    window.addEventListener('pointerup', () => this.actionUp());
    window.addEventListener('keydown', (event) => {
      if (event.code === 'Space' && !event.repeat && this.isActive()) { event.preventDefault(); this.actionDown(event); }
    });
    window.addEventListener('keyup', (event) => { if (event.code === 'Space' && this.isActive()) this.actionUp(); });
    this.pauseButton.addEventListener('click', () => { if (this.isActive()) this.togglePause(); });
    this.helpButton.addEventListener('click', () => { if (this.isActive()) this.toggleHelp(); });
    this.retryButton.addEventListener('click', () => { if (this.state?.id) this.start(this.state.id); });
    this.canvas.addEventListener('pointerdown', (event) => this.pointerDown(event));
    this.canvas.addEventListener('pointermove', (event) => this.pointerMove(event));
    this.canvas.addEventListener('pointerup', (event) => this.pointerUp(event));
    this.canvas.addEventListener('pointercancel', (event) => this.pointerUp(event));
  }

  start(id) {
    if (!SUPPORTED.has(id)) return;
    this.stop(false);
    this.context = this.getContext(id);
    const difficulty = quickDifficulty(this.context);
    this.state = id === 'hedgePee' ? createHedgeState(difficulty) : createMaslState(difficulty);
    this.root.hidden = false;
    this.root.dataset.miniGame = id;
    this.root.dataset.fastMinigameVersion = VERSION;
    this.root.classList.toggle('hedge-fast-rebuild-active', id === 'hedgePee');
    this.root.classList.toggle('masl-fast-rebuild-active', id === 'maslHole');
    this.canvas.width = 900;
    this.canvas.height = 430;
    this.result.hidden = true;
    this.result.textContent = '';
    this.retryButton.hidden = true;
    this.pauseButton.disabled = true;
    this.pauseButton.textContent = 'Pause';
    this.action.disabled = true;
    this.setupCopy(id);
    this.renderBriefing(id);
    this.syncPatrolCss();
    this.last = performance.now();
    this.raf = requestAnimationFrame((time) => this.tick(time));
  }

  stop(hide = true) {
    cancelAnimationFrame(this.raf);
    this.raf = 0;
    this.activePointer = undefined;
    this.state = undefined;
    this.context = undefined;
    this.startButton.remove();
    this.root.classList.remove('hedge-fast-rebuild-active', 'masl-fast-rebuild-active');
    delete this.root.dataset.fastMinigameVersion;
    for (const property of ['--hedge-gundula-x', '--hedge-gundula-dir', '--hedge-uli-x', '--hedge-uli-dir']) this.root.style.removeProperty(property);
    document.body.classList.remove('minigame-paused');
    if (hide) this.root.hidden = true;
  }

  isActive() {
    return Boolean(this.state && SUPPORTED.has(this.root.dataset.miniGame) && this.root.dataset.fastMinigameVersion === VERSION);
  }

  debugSkipCountdown() { if (this.state) this.state.countdown = 0; }
  debugSetState(values) { if (this.state) Object.assign(this.state, values); }
  debugAction() {
    if (!this.state) return;
    if (this.state.id === 'hedgePee') {
      this.state.holding = !this.state.holding;
      return;
    }
    if (this.state.phase === 'timing') this.actionDown(); else if (this.state.phase === 'pull') this.actionUp();
  }
  debugSnapshot() {
    if (!this.state) return {};
    return {
      ...structuredClone(this.state),
      version: VERSION,
      active: this.isActive(),
      noSpotlights: this.state.id === 'hedgePee',
      sightConesVisible: this.state.id === 'hedgePee' && document.querySelectorAll('.graphics-v3-vision-cone').length >= 2,
    };
  }

  setupCopy(id) {
    if (id === 'hedgePee') {
      this.title.textContent = 'In die Hecke · Blickkegel lesen und fertig';
      this.copy.textContent = 'Gundula und Uli sind die einzigen Patrouillen. Keine abstrakten Scheinwerfer mehr: Ihre sichtbaren Blickkegel entsprechen der tatsächlichen Gefahr.';
      this.hint.textContent = 'Deckung antippen. Halten, solange kein Blickkegel deine Stelle erfasst; bei Gefahr sofort loslassen.';
      this.action.textContent = 'HALTEN: BRUNSEN';
    } else {
      this.title.textContent = 'Komm ans Loch · Abdichten, Timing, loslassen';
      this.copy.textContent = 'Zwei kurze Runden: Hände an die Markierungen führen, das Loch kurz stabilisieren und den Zug im grünen Atemfenster kontrollieren.';
      this.hint.textContent = 'Hände ausrichten. Sobald die Abdichtung einrastet, im grünen Fenster halten und im goldenen Wirkungsbereich loslassen.';
      this.action.textContent = 'HÄNDE AUSRICHTEN';
    }
  }

  renderBriefing(id) {
    this.briefing.hidden = false;
    const hedge = id === 'hedgePee';
    this.briefing.innerHTML = hedge
      ? `<article><span>SCHNELLE STEALTH-RUNDE</span><h3>Erleichterung schaffen, ohne in Gundulas oder Ulis Blickkegel zu geraten.</h3><div class="mini-briefing-grid"><section><b>STEUERUNG</b><p><i>1</i>Eine der drei Deckungen antippen.</p><p><i>2</i>AKTION halten, um Fortschritt aufzubauen.</p><p><i>3</i>Loslassen, sobald ein sichtbarer Blickkegel die Stelle erreicht.</p></section><section><b>TEMPO</b><p>Eine saubere Runde dauert ungefähr 9 bis 14 Sekunden.</p><b>WICHTIG</b><p>Nur die Figuren und ihre Blickkegel zählen. Es gibt keine zusätzlichen Scheinwerfer.</p></section></div></article>`
      : `<article><span>ZWEI KURZE ZÜGE</span><h3>Erst abdichten, dann im richtigen Moment Wirkung erzeugen.</h3><div class="mini-briefing-grid"><section><b>STEUERUNG</b><p><i>1</i>Linke und rechte Hand in die Zielmarkierungen ziehen.</p><p><i>2</i>Nach dem Einrasten im grünen Atemfenster AKTION halten.</p><p><i>3</i>Im goldenen Wirkungsbereich loslassen, bevor der Husten steigt.</p></section><section><b>TEMPO</b><p>Nur zwei Runden, meist deutlich unter 20 Sekunden.</p><b>WERTUNG</b><p>Abdichtung, Startzeitpunkt und rechtzeitiges Loslassen zählen gemeinsam.</p></section></div></article>`;
    this.briefing.querySelector('article')?.append(this.startButton);
  }

  begin() {
    if (!this.state || this.state.running) return;
    this.briefing.hidden = true;
    this.state.running = true;
    this.state.paused = false;
    this.state.countdown = 1200;
    this.pauseButton.disabled = false;
    this.action.disabled = this.state.id === 'maslHole';
    this.setFeedback('START', this.state.id === 'hedgePee' ? 'Deckung wählen' : 'Hände ausrichten', 'neutral');
  }

  togglePause() {
    if (!this.state?.running || this.state.phase === 'finished') return;
    this.state.paused = !this.state.paused;
    this.pauseButton.textContent = this.state.paused ? 'Fortsetzen' : 'Pause';
    document.body.classList.toggle('minigame-paused', this.state.paused);
  }

  toggleHelp() {
    if (!this.state) return;
    const show = this.briefing.hidden;
    this.briefing.hidden = !show;
    if (show && this.state.running) {
      this.state.paused = true;
      this.pauseButton.textContent = 'Fortsetzen';
      document.body.classList.add('minigame-paused');
    }
  }

  actionDown(event) {
    if (!this.inputAllowed()) return;
    event?.preventDefault?.();
    const state = this.state;
    if (state.id === 'hedgePee') {
      if (state.phase === 'active') state.holding = true;
      return;
    }
    if (state.phase !== 'timing') return;
    if (state.breath >= .44 && state.breath <= .79) {
      state.phase = 'pull';
      state.holding = true;
      state.pull = 0;
      state.rhythmTime = 0;
      state.pullTime = 0;
      this.action.textContent = 'HALTEN · IM GOLDENEN BEREICH LOSLASSEN';
      this.setFeedback('ZUG STARTET', 'Wirkung aufbauen und rechtzeitig loslassen', 'good');
    } else {
      state.mistakes += 1;
      state.cough = Math.min(100, state.cough + 10);
      this.setFeedback('FALSCHER MOMENT', 'Auf das grüne Atemfenster warten', 'bad');
    }
  }

  actionUp() {
    const state = this.state;
    if (!state) return;
    if (state.id === 'hedgePee') { state.holding = false; return; }
    if (state.phase === 'pull' && state.holding) {
      state.holding = false;
      this.completeMaslRound();
    }
  }

  pointerDown(event) {
    if (!this.inputAllowed()) return;
    const point = this.point(event);
    const state = this.state;
    event.preventDefault();
    if (state.id === 'hedgePee') {
      if (state.phase === 'choose') this.chooseSpot(point.x);
      return;
    }
    if (state.phase !== 'seal') return;
    const leftDistance = distance(point, state.left);
    const rightDistance = distance(point, state.right);
    this.activePointer = event.pointerId;
    state.activeHand = leftDistance <= rightDistance ? 'left' : 'right';
    this.canvas.setPointerCapture?.(event.pointerId);
    this.moveHand(point);
  }

  pointerMove(event) {
    if (!this.inputAllowed() || event.pointerId !== this.activePointer || this.state?.id !== 'maslHole' || this.state.phase !== 'seal') return;
    this.moveHand(this.point(event));
  }

  pointerUp(event) {
    if (event.pointerId === this.activePointer) this.activePointer = undefined;
  }

  chooseSpot(x) {
    const state = this.state;
    const index = x < .36 ? 0 : x > .65 ? 2 : 1;
    state.spot = index;
    state.phase = 'active';
    this.action.disabled = false;
    this.action.textContent = 'HALTEN: BRUNSEN';
    this.hint.textContent = `${SPOTS[index].label}: halten, Blickkegel beobachten, bei Gefahr loslassen.`;
    this.setFeedback('DECKUNG GEWÄHLT', SPOTS[index].label, 'neutral');
  }

  moveHand(point) {
    const state = this.state;
    const hand = state.activeHand;
    state[hand] = {
      x: clamp(point.x, hand === 'left' ? .18 : .51, hand === 'left' ? .49 : .82),
      y: clamp(point.y, .39, .71),
    };
  }

  tick(time) {
    if (!this.state) return;
    const delta = Math.min(45, time - this.last || 16);
    this.last = time;
    if (this.state.running && !this.state.paused) {
      if (this.state.countdown > 0) {
        this.state.countdown = Math.max(0, this.state.countdown - delta);
        this.updateLive('START', this.state.countdown > 0 ? String(Math.ceil(this.state.countdown / 1000)) : 'LOS', 1 - this.state.countdown / 1200);
      } else if (this.state.id === 'hedgePee') this.tickHedge(delta);
      else this.tickMasl(delta, time);
    }
    this.draw();
    this.raf = requestAnimationFrame((next) => this.tick(next));
  }

  tickHedge(delta) {
    const state = this.state;
    const gundula = advancePatrol(state.gundula, state.gundulaDir, .000145 * state.difficulty, delta);
    const uli = advancePatrol(state.uli, state.uliDir, .000112 * state.difficulty, delta);
    state.gundula = gundula.position; state.gundulaDir = gundula.direction;
    state.uli = uli.position; state.uliDir = uli.direction;
    this.syncPatrolCss();
    if (state.phase !== 'active') {
      this.updateLive('DECKUNG', 'Stelle antippen', 0);
      return;
    }
    const spot = SPOTS[state.spot];
    const gundulaSees = hedgeSight(state.gundula, state.gundulaDir, spot.x, .255, spot.cover);
    const uliSees = hedgeSight(state.uli, state.uliDir, spot.x, .215, Math.min(1, spot.cover + .08));
    state.watched = gundulaSees || uliSees;
    state.watchedBy = [gundulaSees ? 'Gundula' : '', uliSees ? 'Uli' : ''].filter(Boolean).join(' + ');
    if (state.holding) {
      state.progress = Math.min(100, state.progress + delta * spot.rate / state.difficulty);
      if (state.watched) {
        state.suspicion = Math.min(100, state.suspicion + delta * .0205 * (1.25 - spot.cover) * state.difficulty);
        state.dangerFlash = 180;
        if (state.warningCooldown <= 0) {
          state.nearMisses += 1;
          state.warningCooldown = 600;
          this.setFeedback('BLICKKEGEL!', `${state.watchedBy} sieht in deine Richtung · loslassen`, 'warning');
        }
      } else {
        state.suspicion = Math.max(0, state.suspicion - delta * .004);
      }
    } else {
      state.suspicion = Math.max(0, state.suspicion - delta * .013);
    }
    state.warningCooldown = Math.max(0, state.warningCooldown - delta);
    state.dangerFlash = Math.max(0, state.dangerFlash - delta);
    this.updateLive(state.watched ? `SICHT: ${state.watchedBy.toUpperCase()}` : 'UNGESTÖRT', state.holding ? 'Erleichterung läuft' : 'Warten / Verdacht sinkt', state.progress / 100);
    if (state.suspicion >= 100) {
      this.finish({
        id: 'hedgePee', success: false, score: Math.max(0, Math.round(state.progress - state.nearMisses * 5)), quality: 'failed',
        text: 'Gundula und Uli brauchen keine Scheinwerfer: Der direkte Blickkontakt reicht für ein vollständiges Heckenprotokoll.',
        suspicion: 32, relief: state.progress >= 70 ? 1 : 0, needs: { bladder: -Math.round(state.progress), courage: -8 },
        metrics: { dignity: -7, chaos: 5 }, relationships: { gundula: -5, uli: -4 }, flags: { hedgeCaught: true },
      });
      return;
    }
    if (state.progress >= 100) {
      const perfect = state.suspicion < 10 && state.nearMisses <= 1;
      const quality = perfect ? 'perfect' : state.suspicion < 45 ? 'solid' : 'messy';
      this.finish({
        id: 'hedgePee', success: true, score: Math.round(120 - state.suspicion - state.nearMisses * 4), quality,
        text: perfect ? 'Kurz, sauber und außerhalb beider Blickkegel. Die Hecke bleibt glaubwürdig ahnungslos.' : 'Erledigt. Gundula und Uli waren nah, aber nicht nah genug für eine belastbare Sichtung.',
        suspicion: Math.round(state.suspicion * .2), relief: 1, needs: { bladder: -100, courage: 5 },
        metrics: { dignity: perfect ? 2 : 0, chaos: perfect ? 0 : 1 }, flags: perfect ? { hedgePerfect: true } : undefined,
      });
    }
  }

  tickMasl(delta, time) {
    const state = this.state;
    state.breath = (Math.sin(time / 330) + 1) / 2;
    if (state.phase === 'seal') {
      state.seal = maslSealScore(state.left, state.right, state.targetX);
      if (state.seal >= state.sealThreshold) state.stableTime += delta;
      else state.stableTime = Math.max(0, state.stableTime - delta * 1.8);
      this.updateLive(`ABDICHTUNG ${Math.round(state.seal * 100)}%`, state.stableTime >= 260 ? 'Eingerastet' : 'Hände in die Zielringe führen', state.seal);
      if (state.stableTime >= 260) {
        state.phase = 'timing';
        state.lockedSeal = state.seal;
        this.action.disabled = false;
        this.action.textContent = 'IM GRÜNEN FENSTER HALTEN';
        this.hint.textContent = 'Der Atemmarker bewegt sich schnell. Im grünen Bereich halten, im goldenen Wirkungsbereich loslassen.';
        this.setFeedback('ABDICHTUNG SITZT', 'Jetzt Atemfenster treffen', 'good');
      }
      return;
    }
    if (state.phase === 'timing') {
      this.updateLive(`ZUG ${state.round}/2`, state.breath >= .44 && state.breath <= .79 ? 'GRÜNES FENSTER · jetzt halten' : 'Auf grün warten', 0);
      return;
    }
    if (state.phase === 'pull' && state.holding) {
      state.pullTime += delta;
      state.pull = Math.min(100, state.pull + delta * .0195 * state.lockedSeal / state.difficulty);
      const inRhythm = state.breath >= .34 && state.breath <= .88;
      if (inRhythm) state.rhythmTime += delta;
      else state.cough = Math.min(100, state.cough + delta * .007);
      if (state.pull > 87) state.cough = Math.min(100, state.cough + delta * .022);
      this.updateLive(`ZUG ${state.round}/2`, state.pull >= 58 && state.pull <= 86 ? 'GOLDENER BEREICH · loslassen' : state.pull < 58 ? 'Wirkung aufbauen' : 'Zu lang · loslassen!', state.pull / 100);
      if (state.pull >= 100 || state.cough >= 100) {
        state.holding = false;
        this.completeMaslRound();
      }
    }
  }

  completeMaslRound() {
    const state = this.state;
    const rhythmRatio = state.pullTime > 0 ? state.rhythmTime / state.pullTime : 0;
    const result = maslPullResult(state.pull, state.lockedSeal, rhythmRatio, state.cough);
    state.score += result.score;
    if (!result.good) { state.mistakes += 1; state.cough = Math.min(100, state.cough + 14); }
    this.setFeedback(result.good ? 'SAUBERER ZUG' : 'HUSTEN / ZU FRÜH', `${result.score} Punkte`, result.good ? 'good' : 'bad');
    if (state.round >= 2) {
      const success = state.score >= 128;
      const quality = success && state.score >= 185 && state.mistakes <= 1 ? 'perfect' : success ? 'solid' : state.score >= 90 ? 'messy' : 'failed';
      this.finish({
        id: 'maslHole', success, score: state.score, quality,
        text: quality === 'perfect' ? 'Zweimal schnell abgedichtet, im Atemfenster gestartet und exakt im Wirkungsbereich gelöst. Masl nickt anerkennend.' : success ? 'Die Technik funktioniert jetzt ohne endlose Wiederholungen: zwei brauchbare Züge, klare Wirkung, fertig.' : 'Die Idee war richtig, aber Abdichtung oder Timing waren in beiden kurzen Versuchen nicht stabil genug.',
        needs: { highness: success ? 38 : 18, energy: -5, courage: success ? 6 : 1 },
        metrics: { reputation: quality === 'perfect' ? 5 : success ? 2 : -1, momentum: success ? 4 : 0 },
        relationships: { masl: quality === 'perfect' ? 5 : success ? 3 : 0 }, flags: quality === 'perfect' ? { maslTechniqueMastered: true } : undefined,
      });
      return;
    }
    state.round += 1;
    Object.assign(state, {
      phase: 'seal', left: { x: .30, y: .62 }, right: { x: .70, y: .48 }, targetX: .5 + (state.round === 2 ? .025 : 0),
      seal: 0, lockedSeal: 0, stableTime: 0, pull: 0, pullTime: 0, rhythmTime: 0, holding: false,
      cough: Math.max(0, state.cough - 12),
    });
    this.action.disabled = true;
    this.action.textContent = 'HÄNDE AUSRICHTEN';
    this.hint.textContent = 'Letzte Runde: Hände erneut in die Markierungen ziehen. Danach nur noch ein kurzer Timing-Zug.';
  }

  syncPatrolCss() {
    const state = this.state;
    if (!state || state.id !== 'hedgePee') return;
    this.root.style.setProperty('--hedge-gundula-x', `${state.gundula * 82}%`);
    this.root.style.setProperty('--hedge-gundula-dir', String(state.gundulaDir));
    this.root.style.setProperty('--hedge-uli-x', `${state.uli * 82}%`);
    this.root.style.setProperty('--hedge-uli-dir', String(state.uliDir));
  }

  draw() {
    if (!this.state) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (this.state.id === 'hedgePee') drawFastHedge(this.ctx, this.canvas.width, this.canvas.height, this.state);
    else drawFastMasl(this.ctx, this.canvas.width, this.canvas.height, this.state);
    if (this.state.paused && this.state.running) drawOverlay(this.ctx, this.canvas.width, this.canvas.height, 'PAUSIERT', 'Fortsetzen über die Schaltfläche');
    else if (this.state.countdown > 0) drawOverlay(this.ctx, this.canvas.width, this.canvas.height, String(Math.ceil(this.state.countdown / 1000)), 'Bereitmachen');
  }

  finish(outcome) {
    if (!this.state?.running) return;
    this.state.running = false;
    this.state.paused = true;
    this.state.phase = 'finished';
    this.action.disabled = true;
    this.pauseButton.disabled = true;
    this.retryButton.hidden = false;
    const label = outcome.success ? outcome.quality === 'perfect' ? 'LEGENDÄR' : outcome.quality === 'messy' ? 'CHAOTISCH GESCHAFFT' : 'GESCHAFFT' : 'GESCHEITERT';
    this.result.hidden = false;
    this.result.innerHTML = `<strong>${label}</strong><p>${escapeHtml(outcome.text)}</p><div class="mini-result-stats"><span>Wert <b>${Math.round(outcome.score)}</b></span><span>Qualität <b>${outcome.quality}</b></span></div>`;
    this.setFeedback(label, `Wert ${Math.round(outcome.score)}`, outcome.success ? 'good' : 'bad');
    this.onOutcome(outcome);
  }

  updateLive(phase, text, progress) {
    this.phaseLabel.textContent = phase;
    this.liveLabel.textContent = text;
    const bar = this.root.querySelector('.mini-live-progress i');
    if (bar) bar.style.width = `${clamp(progress, 0, 1) * 100}%`;
  }

  setFeedback(phase, text, tone) {
    this.phaseLabel.textContent = phase;
    this.liveLabel.textContent = text;
    const experience = this.root.querySelector('.mini-experience');
    if (experience) {
      experience.dataset.feedback = tone;
      window.setTimeout(() => { if (experience.dataset.feedback === tone) delete experience.dataset.feedback; }, 650);
    }
    if (typeof navigator.vibrate === 'function') navigator.vibrate(tone === 'good' ? [12, 20, 12] : tone === 'bad' ? [35] : tone === 'warning' ? [16, 14, 16] : [8]);
  }

  inputAllowed() { return Boolean(this.state?.running && !this.state.paused && this.state.countdown <= 0 && this.state.phase !== 'finished'); }
  point(event) {
    const rect = this.canvas.getBoundingClientRect();
    return { x: clamp((event.clientX - rect.left) / rect.width, 0, 1), y: clamp((event.clientY - rect.top) / rect.height, 0, 1) };
  }
}

function createHedgeState(difficulty) {
  return { id: 'hedgePee', running: false, paused: true, countdown: 0, phase: 'choose', difficulty, spot: -1, holding: false, progress: 0, suspicion: 0, gundula: .06, gundulaDir: 1, uli: .94, uliDir: -1, watched: false, watchedBy: '', nearMisses: 0, warningCooldown: 0, dangerFlash: 0 };
}

function createMaslState(difficulty) {
  return { id: 'maslHole', running: false, paused: true, countdown: 0, phase: 'seal', difficulty, round: 1, left: { x: .31, y: .62 }, right: { x: .69, y: .49 }, activeHand: 'left', targetX: .5, seal: 0, lockedSeal: 0, sealThreshold: .73, stableTime: 0, breath: .5, pull: 0, pullTime: 0, rhythmTime: 0, cough: 0, holding: false, score: 0, mistakes: 0 };
}

function quickDifficulty(context) {
  let value = context?.attempts === 0 ? .9 : 1;
  if (context?.bestQuality === 'perfect') value += .05;
  if (context?.needs?.energy < 30) value += .04;
  return clamp(value, .88, 1.1);
}

function drawFastHedge(ctx, width, height, state) {
  ctx.fillStyle = '#0c211a'; ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = '#163d2a'; ctx.fillRect(0, 75, width, 255);
  ctx.fillStyle = '#2f7044'; ctx.fillRect(55, 160, width - 110, 175);
  for (let x = 65; x < width - 50; x += 42) {
    ctx.fillStyle = x % 84 ? '#397e4b' : '#28613b';
    ctx.beginPath(); ctx.arc(x, 165, 52, 0, Math.PI * 2); ctx.fill();
  }
  ctx.fillStyle = '#b9c9bd'; ctx.font = '700 14px system-ui';
  ctx.fillText('GUNDULA + ULI PATROUILLIEREN · NUR IHRE SICHTKEGEL ZÄHLEN', 24, 34);
  for (let index = 0; index < SPOTS.length; index += 1) {
    const spot = SPOTS[index];
    const selected = state.spot === index;
    const danger = selected && state.watched;
    ctx.fillStyle = selected ? danger ? 'rgba(224,91,75,.28)' : 'rgba(237,196,93,.22)' : 'rgba(255,255,255,.055)';
    roundRect(ctx, spot.x * width - 58, 215, 116, 90, 12); ctx.fill();
    ctx.strokeStyle = selected ? danger ? '#ef725e' : '#edc45d' : 'rgba(255,255,255,.28)'; ctx.lineWidth = selected ? 5 : 3; ctx.stroke();
    ctx.fillStyle = '#fff0c2'; ctx.font = '800 11px system-ui'; ctx.textAlign = 'center'; ctx.fillText(spot.label, spot.x * width, 326); ctx.textAlign = 'left';
  }
  if (state.phase === 'choose') {
    ctx.fillStyle = '#fff0c2'; ctx.font = '900 28px system-ui'; ctx.textAlign = 'center'; ctx.fillText('DECKUNG ANTIPPEN', width / 2, 120); ctx.textAlign = 'left';
  } else if (state.watched) {
    ctx.fillStyle = state.dangerFlash > 0 ? '#ef725e' : '#e8b555'; ctx.font = '900 26px system-ui'; ctx.textAlign = 'center'; ctx.fillText(`${state.watchedBy.toUpperCase()} SIEHT HER`, width / 2, 120); ctx.textAlign = 'left';
  }
  drawBar(ctx, 35, 377, width * .42, 18, state.progress / 100, 'ERLEICHTERUNG');
  drawBar(ctx, width * .54, 377, width * .42, 18, state.suspicion / 100, 'VERDACHT');
}

function drawFastMasl(ctx, width, height, state) {
  ctx.fillStyle = '#132728'; ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = '#0a1715'; roundRect(ctx, 175, 80, width - 350, 225, 34); ctx.fill();
  const targetLeft = { x: state.targetX - .1125, y: .56 };
  const targetRight = { x: state.targetX + .1125, y: .56 };
  for (const target of [targetLeft, targetRight]) {
    ctx.strokeStyle = state.phase === 'seal' ? 'rgba(126,211,159,.7)' : 'rgba(237,196,93,.35)'; ctx.lineWidth = 6; ctx.setLineDash([10, 7]);
    ctx.beginPath(); ctx.arc(target.x * width, target.y * height, 46, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
  }
  drawHand(ctx, state.left.x * width, state.left.y * height, true, state.phase !== 'seal');
  drawHand(ctx, state.right.x * width, state.right.y * height, false, state.phase !== 'seal');
  const centerX = ((state.left.x + state.right.x) / 2) * width;
  const centerY = ((state.left.y + state.right.y) / 2) * height;
  ctx.fillStyle = '#020504'; ctx.beginPath(); ctx.arc(centerX, centerY, 18 + (1 - state.seal) * 24, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = state.seal >= state.sealThreshold ? '#7ed39f' : '#e06f5c'; ctx.lineWidth = 5; ctx.stroke();

  ctx.fillStyle = 'rgba(255,255,255,.08)'; roundRect(ctx, 70, 22, width - 140, 24, 12); ctx.fill();
  ctx.fillStyle = 'rgba(126,211,159,.32)'; ctx.fillRect(70 + (width - 140) * .44, 22, (width - 140) * .35, 24);
  const markerX = 70 + (width - 140) * state.breath;
  ctx.fillStyle = state.breath >= .44 && state.breath <= .79 ? '#7ed39f' : '#e8b555'; ctx.beginPath(); ctx.arc(markerX, 34, 10, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#fff0c2'; ctx.font = '800 11px system-ui'; ctx.fillText('ATEMFENSTER', 70, 17);

  ctx.fillStyle = 'rgba(237,196,93,.2)'; ctx.fillRect(70 + (width - 140) * .58, 337, (width - 140) * .28, 20);
  drawBar(ctx, 70, 337, width - 140, 20, state.pull / 100, 'WIRKUNG · GOLD 58–86%');
  drawBar(ctx, 70, 387, width * .35, 15, state.seal, 'ABDICHTUNG');
  drawBar(ctx, width * .57, 387, width * .35, 15, state.cough / 100, 'HUSTEN');
  ctx.fillStyle = '#fff0c2'; ctx.font = '900 18px system-ui'; ctx.fillText(`ZUG ${state.round}/2 · WERT ${state.score}`, 24, 72);
}

function drawHand(ctx, x, y, left, locked) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(left ? -.12 : .12);
  ctx.fillStyle = locked ? '#cf9674' : '#dfa982'; roundRect(ctx, -58, -36, 116, 72, 30); ctx.fill();
  ctx.fillStyle = '#a56f56'; roundRect(ctx, left ? 28 : -48, -28, 20, 56, 9); ctx.fill();
  ctx.restore();
}

function drawOverlay(ctx, width, height, title, copy) {
  ctx.fillStyle = 'rgba(5,15,12,.72)'; ctx.fillRect(0, 0, width, height);
  ctx.textAlign = 'center'; ctx.fillStyle = '#fff1c4'; ctx.font = '900 72px system-ui'; ctx.fillText(title, width / 2, height / 2 - 15);
  ctx.font = '700 18px system-ui'; ctx.fillStyle = '#c8d9d0'; ctx.fillText(copy, width / 2, height / 2 + 28); ctx.textAlign = 'left';
}

function drawBar(ctx, x, y, width, height, value, label) {
  ctx.fillStyle = '#071611'; roundRect(ctx, x, y, width, height, 8); ctx.fill();
  ctx.fillStyle = value > .78 ? '#df6e58' : '#79c992'; roundRect(ctx, x + 2, y + 2, Math.max(0, (width - 4) * clamp(value, 0, 1)), height - 4, 6); ctx.fill();
  ctx.fillStyle = '#fff1c4'; ctx.font = '700 10px system-ui'; ctx.fillText(label, x, y - 6);
}

function roundRect(ctx, x, y, width, height, radius) { ctx.beginPath(); ctx.roundRect(x, y, width, height, radius); }
function distance(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }
function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
function escapeHtml(value) { return String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character] ?? character); }
function requireElement(root, selector) { const node = root.querySelector(selector); if (!node) throw new Error(`Missing fast minigame element: ${selector}`); return node; }

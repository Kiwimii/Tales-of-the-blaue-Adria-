import type { Needs, WeekendMetrics } from '../../game/types';

export type MiniGameId = 'flipCup' | 'beerPong' | 'flunkyball' | 'hedgePee' | 'maslHole';
export type MiniGameQuality = 'perfect' | 'solid' | 'messy' | 'failed';

export interface MiniGameOutcome {
  id: MiniGameId;
  success: boolean;
  score: number;
  quality: MiniGameQuality;
  text: string;
  needs?: Partial<Pick<Needs, 'energy' | 'thirst' | 'bladder' | 'alcohol' | 'highness' | 'courage' | 'hangover'>>;
  metrics?: Partial<WeekendMetrics>;
  relationships?: Record<string, number>;
  flags?: Record<string, boolean>;
  suspicion?: number;
  relief?: number;
  chronicle?: string;
}

export interface MiniGameContext {
  attempts: number;
  wins: number;
  best: number;
  bestQuality: MiniGameQuality;
  activeTeam: string[];
  flags: Record<string, boolean>;
  needs: Needs;
}

interface Point { x: number; y: number; }
interface Runtime {
  id: MiniGameId;
  running: boolean;
  paused: boolean;
  start: number;
  last: number;
  raf: number;
  countdown: number;
  context: MiniGameContext;
  difficulty: number;
  state: Record<string, any>;
  pointers: Map<number, Point>;
  cleanup: Array<() => void>;
}

interface GameBriefing {
  title: string;
  objective: string;
  controls: string[];
  mastery: string;
  danger: string;
}

const TITLES: Record<MiniGameId, string> = {
  flipCup: 'Flip Cup · Vier Becher, ein gemeinsames Nervensystem',
  beerPong: 'Beer Pong · Flugbahn, Risiko und Redemption',
  flunkyball: 'Flunkyball · Werfen, trinken, retten, STOPP',
  hedgePee: 'In die Hecke · Deckung, Wind und Beweislage',
  maslHole: 'Komm ans Loch · Abdichtung, Rhythmus und Wirkung',
};

const BRIEFINGS: Record<MiniGameId, GameBriefing> = {
  flipCup: {
    title: 'TEAMSTAFFEL',
    objective: 'Leere vier Becher, platziere jeden an der Kante und flippe ihn kopfüber, bevor die Gegenseite fertig ist.',
    controls: ['AKTION halten: trinken', 'Becher an der Tischkante ziehen', 'Vom Rand nach oben wischen'],
    mastery: 'Perfekte Landungen und schnelles Loslassen nach dem Leeren bauen einen Staffelserienbonus auf.',
    danger: 'Zu langes Halten verschüttet Zeit und Würde. Fehlflips müssen sofort wiederholt werden.',
  },
  beerPong: {
    title: 'FREIER WURF',
    objective: 'Räume zehn Becher ab. Direkte Würfe sind sicherer, Bounce-Würfe riskanter und doppelt wirksam.',
    controls: ['Ball berühren und zurückziehen', 'Loslassen: Flugbahn starten', 'AKTION: Direkt/Bounce wechseln'],
    mastery: 'Re-Racks bei sechs, drei und einem Becher verändern die Zielgeometrie. Ein später Rückstand kann über Redemption gedreht werden.',
    danger: 'Bounce-Würfe dürfen abgewehrt werden. Die Gegenseite spielt sichtbar weiter.',
  },
  flunkyball: {
    title: 'ECHTES MANNSCHAFTSDUELL',
    objective: 'Triff die Mittelflasche, trink bis zum Stoppruf und rette in der Verteidigung Flasche und Ball.',
    controls: ['Ball zurückziehen und werfen', 'AKTION halten: trinken', 'Feld antippen: laufen · AKTION: aufstellen, aufnehmen, STOPP'],
    mastery: 'Präzise Würfe, kurze Laufwege und ein sauberer Stoppruf erzeugen den höchsten Wert.',
    danger: 'Nach dem Stoppruf weitertrinken ist ein Foul. In der Verteidigung trinkt die Gegenseite ohne Rücksicht weiter.',
  },
  hedgePee: {
    title: 'STEALTH MIT STRAHLKONTROLLE',
    objective: 'Wähle Deckung, halte zur Erleichterung und steuere die Richtung trotz Wind innerhalb der Hecke.',
    controls: ['Stelle antippen', 'AKTION halten: brunzen', 'Auf dem Feld Richtung korrigieren'],
    mastery: 'Wenige Unterbrechungen, keine Beweise und niedriger Verdacht ergeben eine lautlose Legende.',
    danger: 'Gundula und Uli besitzen getrennte Blickkegel. Weg, Zelt und Blätter reagieren unterschiedlich auf Fehler.',
  },
  maslHole: {
    title: 'BEIDHÄNDIGE KOORDINATION',
    objective: 'Führe beide Hände zu einer dichten Kammer, halte das Loch am Joint und beende den Zug vor dem Hustenmaximum.',
    controls: ['Zwei Finger: Hände gleichzeitig führen', 'Maus: Hände nacheinander ziehen', 'AKTION halten: Wirkungszug'],
    mastery: 'Abdichtung, Atemrhythmus und rechtzeitiges Loslassen zählen gemeinsam. Drei Durchgänge werden zunehmend instabil.',
    danger: 'Zu lockere Hände erzeugen Lecks; zu langer Zug erhöht Husten und senkt die Wertung.',
  },
};

const TEAM_NAMES: Record<string, string> = {
  andre: 'André', rene: 'René', lars: 'Lars', danny: 'Danny', gregor: 'Gregor', masl: 'Masl', schubert: 'Schubert', felix: 'Felix', schima: 'Schima',
};

export class MinigameDirector {
  private runtime?: Runtime;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private title: HTMLElement;
  private copy: HTMLElement;
  private hint: HTMLElement;
  private action: HTMLButtonElement;
  private close: HTMLButtonElement;
  private result: HTMLElement;
  private article: HTMLElement;
  private experience: HTMLElement;
  private briefing: HTMLElement;
  private phaseLabel: HTMLElement;
  private liveLabel: HTMLElement;
  private pauseButton: HTMLButtonElement;
  private helpButton: HTMLButtonElement;
  private retryButton: HTMLButtonElement;
  private startButton: HTMLButtonElement;
  private audio?: AudioContext;

  constructor(
    private readonly root: HTMLElement,
    private readonly onOutcome: (outcome: MiniGameOutcome) => void,
    private readonly getContext: (id: MiniGameId) => MiniGameContext = () => defaultContext(),
  ) {
    this.canvas = requireElement<HTMLCanvasElement>(root, 'canvas');
    const context = this.canvas.getContext('2d');
    if (!context) throw new Error('Minigame canvas context unavailable');
    this.ctx = context;
    this.title = requireElement(root, '[data-mini-title]');
    this.copy = requireElement(root, '[data-mini-copy]');
    this.hint = requireElement(root, '[data-mini-hint]');
    this.action = requireElement<HTMLButtonElement>(root, '[data-mini-action]');
    this.close = requireElement<HTMLButtonElement>(root, '[data-mini-close]');
    this.result = requireElement(root, '[data-mini-result]');
    this.article = requireElement(root, 'article');
    this.experience = document.createElement('section');
    this.experience.className = 'mini-experience';
    this.experience.innerHTML = `
      <div class="mini-livebar"><span data-mini-phase>VORBEREITUNG</span><strong data-mini-live>Warte auf Start</strong><div class="mini-live-progress"><i></i></div></div>
      <div class="mini-briefing" data-mini-briefing></div>
      <div class="mini-toolbar">
        <button type="button" data-mini-help>Hilfe</button>
        <button type="button" data-mini-pause>Pause</button>
        <button type="button" data-mini-retry hidden>Erneut versuchen</button>
      </div>`;
    this.canvas.before(this.experience);
    this.briefing = requireElement(this.experience, '[data-mini-briefing]');
    this.phaseLabel = requireElement(this.experience, '[data-mini-phase]');
    this.liveLabel = requireElement(this.experience, '[data-mini-live]');
    this.pauseButton = requireElement<HTMLButtonElement>(this.experience, '[data-mini-pause]');
    this.helpButton = requireElement<HTMLButtonElement>(this.experience, '[data-mini-help]');
    this.retryButton = requireElement<HTMLButtonElement>(this.experience, '[data-mini-retry]');
    this.startButton = document.createElement('button');
    this.startButton.type = 'button';
    this.startButton.className = 'primary mini-start';
    this.startButton.textContent = 'SPIEL STARTEN';

    this.action.addEventListener('click', () => this.primaryAction());
    this.close.addEventListener('click', () => this.stop());
    this.pauseButton.addEventListener('click', () => this.togglePause());
    this.helpButton.addEventListener('click', () => this.toggleBriefing());
    this.retryButton.addEventListener('click', () => { if (this.runtime) this.start(this.runtime.id); });
    this.startButton.addEventListener('click', () => this.begin());
  }

  start(id: MiniGameId): void {
    this.stop(false);
    this.root.hidden = false;
    this.root.dataset.miniGame = id;
    this.title.textContent = TITLES[id];
    this.result.hidden = true;
    this.result.textContent = '';
    this.action.disabled = true;
    this.retryButton.hidden = true;
    this.pauseButton.disabled = true;
    this.pauseButton.textContent = 'Pause';
    this.canvas.width = 900;
    this.canvas.height = 430;
    const context = this.getContext(id);
    const difficulty = adaptiveDifficulty(context);
    this.runtime = {
      id,
      running: false,
      paused: true,
      start: performance.now(),
      last: performance.now(),
      raf: 0,
      countdown: 0,
      context,
      difficulty,
      state: {},
      pointers: new Map(),
      cleanup: [],
    };
    this.setup(id);
    this.renderBriefing(id);
    this.updateLive('VORBEREITUNG', difficultyLabel(difficulty), 0);
    this.draw(this.runtime);
    this.runtime.raf = requestAnimationFrame((time) => this.tick(time));
  }

  stop(hide = true): void {
    if (this.runtime) {
      cancelAnimationFrame(this.runtime.raf);
      this.runtime.cleanup.forEach((cleanup) => cleanup());
    }
    this.runtime = undefined;
    this.briefing.hidden = true;
    if (hide) this.root.hidden = true;
  }

  private setup(id: MiniGameId): void {
    if (id === 'flipCup') this.setupFlipCup();
    if (id === 'beerPong') this.setupBeerPong();
    if (id === 'flunkyball') this.setupFlunkyball();
    if (id === 'hedgePee') this.setupHedgePee();
    if (id === 'maslHole') this.setupMaslHole();
  }

  private renderBriefing(id: MiniGameId): void {
    const runtime = this.runtime!;
    const briefing = BRIEFINGS[id];
    const context = runtime.context;
    const assist = activeAssist(id, context);
    const team = context.activeTeam.map((member) => TEAM_NAMES[member] ?? member).join(' · ') || 'keine aktiven Begleiter';
    this.briefing.hidden = false;
    this.briefing.innerHTML = `
      <article>
        <span>${briefing.title}</span>
        <h3>${escapeHtml(briefing.objective)}</h3>
        <div class="mini-briefing-grid">
          <section><b>STEUERUNG</b>${briefing.controls.map((line, index) => `<p><i>${index + 1}</i>${escapeHtml(line)}</p>`).join('')}</section>
          <section><b>MEISTERSCHAFT</b><p>${escapeHtml(briefing.mastery)}</p><b>RISIKO</b><p>${escapeHtml(briefing.danger)}</p></section>
        </div>
        <div class="mini-preflight">
          <em><small>Schwierigkeit</small><strong>${difficultyLabel(runtime.difficulty)}</strong></em>
          <em><small>Bester Wert</small><strong>${context.best || '–'}</strong></em>
          <em><small>Team</small><strong>${escapeHtml(team)}</strong></em>
        </div>
        <div class="mini-assist ${assist ? 'active' : ''}"><small>AKTIVE HILFE</small><strong>${escapeHtml(assist || 'Keine charakterbasierte Hilfe freigeschaltet')}</strong></div>
      </article>`;
    this.briefing.querySelector('article')?.append(this.startButton);
  }

  private begin(): void {
    const runtime = this.runtime;
    if (!runtime) return;
    this.briefing.hidden = true;
    runtime.running = true;
    runtime.paused = false;
    runtime.countdown = 3000;
    runtime.last = performance.now();
    this.action.disabled = false;
    this.pauseButton.disabled = false;
    this.feedback('START', 'Bereitmachen', 'neutral');
  }

  private togglePause(): void {
    const runtime = this.runtime;
    if (!runtime?.running) return;
    runtime.paused = !runtime.paused;
    this.pauseButton.textContent = runtime.paused ? 'Fortsetzen' : 'Pause';
    this.liveLabel.textContent = runtime.paused ? 'Spiel pausiert' : this.phaseDescription(runtime);
    document.body.classList.toggle('minigame-paused', runtime.paused);
  }

  private toggleBriefing(): void {
    const runtime = this.runtime;
    if (!runtime) return;
    const showing = !this.briefing.hidden;
    this.briefing.hidden = showing;
    if (!showing && runtime.running) {
      runtime.paused = true;
      this.pauseButton.textContent = 'Fortsetzen';
    }
  }

  private setupFlipCup(): void {
    const runtime = this.runtime!;
    const lineup = ['andre', ...runtime.context.activeTeam.filter((id) => id !== 'andre')].slice(0, 4);
    while (lineup.length < 4) lineup.push(['rene', 'lars', 'danny'][lineup.length - 1] ?? 'danny');
    Object.assign(runtime.state, {
      phase: 'drink', runner: 0, lineup, liquid: 1, holding: false, emptySince: 0, overhold: 0,
      overhang: .5, cupX: .5, cupY: .69, cupVx: 0, cupVy: 0, rotation: 0, angular: 0,
      opponent: 0, mistakes: 0, perfects: 0, streak: 0, bestStreak: 0, reactionPerfects: 0,
      gestureStart: null, placementScore: 0,
    });
    this.copy.textContent = 'Jede Figur besitzt ein eigenes Trink- und Flipprofil. Nach dem Leeren zählt die Reaktion, danach Platzierung und echter Wischimpuls.';
    this.hint.textContent = 'Nach dem Countdown AKTION halten. Sobald der Becher leer ist: sofort loslassen.';
    this.action.textContent = 'HALTEN: TRINKEN';
    this.bindCanvasGestures();
    this.bindHoldAction('holding');
  }

  private setupBeerPong(): void {
    Object.assign(this.runtime!.state, {
      phase: 'ready', mode: 'direct', cups: pongCups(), hits: 0, misses: 0, opponentHits: 0,
      opponentClock: 0, dragStart: null, dragNow: null, ball: null, bounced: false, reracks: 0,
      bounceHits: 0, streak: 0, bestStreak: 0, redemption: false, redemptionHits: 0,
      lastShotBounce: false, trajectory: [],
    });
    this.copy.textContent = 'Zehn Becher, freie Flugphysik und ein kompletter Gegnerlauf. Re-Racks, Bounce-Abwehr und eine mögliche Redemption verändern das Match.';
    this.hint.textContent = 'Ball berühren, zurückziehen und loslassen. AKTION wechselt zwischen DIREKT und BOUNCE.';
    this.action.textContent = 'WURFART: DIREKT';
    this.bindCanvasGestures();
  }

  private setupFlunkyball(): void {
    Object.assign(this.runtime!.state, {
      phase: 'attack-throw', round: 1, teamDrink: 0, enemyDrink: 0, dragStart: null, dragNow: null,
      holding: false, defender: 0, stopSignal: false, stopTimer: 0, foul: false, runnerX: .1, runnerY: .77,
      targetX: .5, targetY: .55, bottleUp: false, ballHeld: false, defenseBallX: .75, defenseBallY: .58,
      stopQuality: 0, attackHits: 0, defensePerfects: 0, obstacles: flunkyObstacles(),
    });
    this.copy.textContent = 'Angriff und Verteidigung wechseln vollständig. Der Stoppruf ist ein echtes Reaktionsfenster, die Laufroute enthält Hindernisse.';
    this.hint.textContent = 'Angriff: Ball ziehen und werfen. Verteidigung: Zielpunkt antippen und an Flasche, Ball und Linie AKTION drücken.';
    this.action.textContent = 'BALL WERFEN';
    this.bindCanvasGestures();
    this.bindHoldAction('holding');
  }

  private setupHedgePee(): void {
    Object.assign(this.runtime!.state, {
      phase: 'choose', spot: -1, progress: 0, suspicion: 0, holding: false, aim: .5,
      observerA: .05, observerB: .95, wind: 0, evidence: 0, interruptions: 0, noise: 0,
      nearMisses: 0, caughtFlash: 0,
    });
    this.copy.textContent = 'Drei Orte besitzen unterschiedliche Geschwindigkeit, Deckung, Geräusch und soziale Folgen. Sichtkegel und Wind reagieren kontinuierlich.';
    this.hint.textContent = 'Erst Stelle antippen. Danach AKTION halten und auf dem Feld die Richtung korrigieren.';
    this.action.textContent = 'STELLE WÄHLEN';
    this.bindCanvasGestures();
    this.bindHoldAction('holding');
  }

  private setupMaslHole(): void {
    Object.assign(this.runtime!.state, {
      phase: 'seal', round: 1, left: { x: .34, y: .55 }, right: { x: .66, y: .55 },
      jointX: .5, jointY: .35, seal: 0, pull: 0, cough: 0, holding: false, score: 0,
      leaks: 0, activeHand: 'left', breath: .5, rhythmQuality: 0, stableTime: 0,
    });
    this.copy.textContent = 'Die Hände müssen nicht nur dicht, sondern im Atemrhythmus stabil bleiben. Drei Durchgänge erhöhen Drift und Hustenempfindlichkeit.';
    this.hint.textContent = 'Hände führen. Bei grüner Abdichtung AKTION drücken, dann im hellen Atemfenster halten und rechtzeitig loslassen.';
    this.action.textContent = 'HÄNDE ABDICHTEN';
    this.bindCanvasGestures();
    this.bindHoldAction('holding');
  }

  private bindCanvasGestures(): void {
    const down = (event: PointerEvent): void => {
      if (!this.inputAllowed()) return;
      event.preventDefault();
      const point = this.point(event);
      this.runtime?.pointers.set(event.pointerId, point);
      this.canvas.setPointerCapture(event.pointerId);
      this.pointerDown(point, event.pointerId);
    };
    const move = (event: PointerEvent): void => {
      if (!this.runtime?.pointers.has(event.pointerId) || !this.inputAllowed()) return;
      const point = this.point(event);
      this.runtime.pointers.set(event.pointerId, point);
      this.pointerMove(point, event.pointerId);
    };
    const up = (event: PointerEvent): void => {
      if (!this.runtime) return;
      const point = this.point(event);
      this.pointerUp(point, event.pointerId);
      this.runtime.pointers.delete(event.pointerId);
    };
    this.canvas.addEventListener('pointerdown', down);
    this.canvas.addEventListener('pointermove', move);
    this.canvas.addEventListener('pointerup', up);
    this.canvas.addEventListener('pointercancel', up);
    this.runtime!.cleanup.push(
      () => this.canvas.removeEventListener('pointerdown', down),
      () => this.canvas.removeEventListener('pointermove', move),
      () => this.canvas.removeEventListener('pointerup', up),
      () => this.canvas.removeEventListener('pointercancel', up),
    );
  }

  private bindHoldAction(key: string): void {
    const down = (event?: Event): void => {
      if (!this.inputAllowed()) return;
      event?.preventDefault();
      if (this.runtime) this.runtime.state[key] = true;
    };
    const up = (): void => { if (this.runtime) this.runtime.state[key] = false; };
    this.action.addEventListener('pointerdown', down);
    this.action.addEventListener('pointerup', up);
    this.action.addEventListener('pointerleave', up);
    this.action.addEventListener('pointercancel', up);
    const keyDown = (event: KeyboardEvent): void => { if (event.code === 'Space' && !event.repeat) down(event); };
    const keyUp = (event: KeyboardEvent): void => { if (event.code === 'Space') up(); };
    window.addEventListener('keydown', keyDown);
    window.addEventListener('keyup', keyUp);
    this.runtime!.cleanup.push(
      () => this.action.removeEventListener('pointerdown', down),
      () => this.action.removeEventListener('pointerup', up),
      () => this.action.removeEventListener('pointerleave', up),
      () => this.action.removeEventListener('pointercancel', up),
      () => window.removeEventListener('keydown', keyDown),
      () => window.removeEventListener('keyup', keyUp),
    );
  }

  private pointerDown(point: Point, pointerId: number): void {
    const runtime = this.runtime;
    if (!runtime?.running) return;
    const state = runtime.state;
    if (runtime.id === 'flipCup') {
      if (state.phase === 'place') state.overhang = clamp(point.x, .32, .7);
      if (state.phase === 'flip') state.gestureStart = point;
    }
    if (runtime.id === 'beerPong' && state.phase === 'ready' && distance(point.x, point.y, .5, .88) < .14) {
      state.dragStart = point;
      state.dragNow = point;
    }
    if (runtime.id === 'flunkyball') {
      if (state.phase === 'attack-throw') { state.dragStart = point; state.dragNow = point; }
      else if (String(state.phase).startsWith('defense')) { state.targetX = point.x; state.targetY = point.y; }
    }
    if (runtime.id === 'hedgePee') {
      if (state.phase === 'choose') this.chooseHedgeSpot(point.x);
      else state.aim = clamp(point.x, .1, .9);
    }
    if (runtime.id === 'maslHole') this.assignMaslHand(pointerId, point);
  }

  private pointerMove(point: Point, pointerId: number): void {
    const runtime = this.runtime;
    if (!runtime?.running) return;
    const state = runtime.state;
    if (runtime.id === 'flipCup' && state.phase === 'place') state.overhang = clamp(point.x, .32, .7);
    if (runtime.id === 'beerPong' && state.dragStart) {
      state.dragNow = point;
      state.trajectory = predictedTrajectory(state.dragStart, point, state.mode === 'bounce');
    }
    if (runtime.id === 'flunkyball') {
      if (state.phase === 'attack-throw' && state.dragStart) state.dragNow = point;
      else if (String(state.phase).startsWith('defense')) { state.targetX = point.x; state.targetY = point.y; }
    }
    if (runtime.id === 'hedgePee' && state.phase === 'active') state.aim = clamp(point.x, .1, .9);
    if (runtime.id === 'maslHole') this.moveMaslHand(pointerId, point);
  }

  private pointerUp(point: Point, pointerId: number): void {
    const runtime = this.runtime;
    if (!runtime?.running) return;
    const state = runtime.state;
    if (runtime.id === 'flipCup') {
      if (state.phase === 'place') this.startFlipGesture();
      else if (state.phase === 'flip' && state.gestureStart) this.launchFlip(point);
    }
    if (runtime.id === 'beerPong' && state.dragStart) this.launchPong(point);
    if (runtime.id === 'flunkyball' && state.phase === 'attack-throw' && state.dragStart) this.launchFlunky(point);
    if (runtime.id === 'maslHole') runtime.pointers.delete(pointerId);
  }

  private primaryAction(): void {
    const runtime = this.runtime;
    if (!this.inputAllowed() || !runtime) return;
    const state = runtime.state;
    if (runtime.id === 'flipCup' && state.phase === 'place') this.startFlipGesture();
    if (runtime.id === 'beerPong') {
      state.mode = state.mode === 'direct' ? 'bounce' : 'direct';
      this.action.textContent = `WURFART: ${String(state.mode).toUpperCase()}`;
      this.feedback('WURFART', state.mode === 'bounce' ? 'Zwei Becher möglich · Abwehr möglich' : 'Sicherer direkter Wurf', 'neutral');
    }
    if (runtime.id === 'flunkyball') this.flunkyAction();
    if (runtime.id === 'hedgePee' && state.phase === 'choose') this.chooseHedgeSpot(.5);
    if (runtime.id === 'maslHole' && state.phase === 'seal' && state.seal >= sealThreshold(runtime)) {
      state.phase = 'pull';
      this.action.textContent = 'HALTEN: ZIEHEN';
      this.feedback('ABDICHTUNG', 'Loch stabil · Atemfenster beobachten', 'good');
    }
  }

  private tick(time: number): void {
    const runtime = this.runtime;
    if (!runtime) return;
    const delta = Math.min(40, time - runtime.last || 16);
    runtime.last = time;
    if (!runtime.paused && runtime.running) {
      if (runtime.countdown > 0) {
        runtime.countdown = Math.max(0, runtime.countdown - delta);
        this.updateLive('START', runtime.countdown > 0 ? String(Math.ceil(runtime.countdown / 1000)) : 'LOS', 1 - runtime.countdown / 3000);
        if (runtime.countdown === 0) this.feedback('LOS', this.phaseDescription(runtime), 'good');
      } else {
        if (runtime.id === 'flipCup') this.tickFlip(delta);
        if (runtime.id === 'beerPong') this.tickPong(delta);
        if (runtime.id === 'flunkyball') this.tickFlunky(delta);
        if (runtime.id === 'hedgePee') this.tickHedge(delta);
        if (runtime.id === 'maslHole') this.tickMasl(delta, time);
        this.syncLive(runtime);
      }
    }
    this.draw(runtime);
    runtime.raf = requestAnimationFrame((next) => this.tick(next));
  }

  private tickFlip(delta: number): void {
    const runtime = this.runtime!;
    const state = runtime.state;
    const teamAssist = runtime.context.flags['assist-team-shout'] ? .88 : 1;
    state.opponent += delta * (.000029 + state.runner * .0000027) * runtime.difficulty * teamAssist;
    if (state.opponent >= 4) {
      this.finish({
        id: 'flipCup', success: false, score: Math.max(0, Math.round(state.runner * 24 - state.mistakes * 5)), quality: 'failed',
        text: 'Die Gegenseite beendet ihre Staffel. Euer letzter Becher führt noch einen offenen Rechtsstreit mit Schwerkraft und Reaktionszeit.',
        needs: { alcohol: 8, bladder: 6 }, metrics: { dignity: -2 }, relationships: teamRelationships(state.lineup, -1),
      });
      return;
    }
    if (state.phase === 'drink') {
      const runnerId = state.lineup[state.runner];
      const rate = flipDrinkRate(runnerId) / runtime.difficulty;
      if (state.holding && state.liquid > 0) state.liquid = Math.max(0, state.liquid - delta * rate);
      if (state.liquid <= 0) {
        if (!state.emptySince) { state.emptySince = performance.now(); this.feedback('LEER', 'Jetzt loslassen', 'warning'); }
        if (state.holding) {
          state.overhold += delta;
          if (state.overhold > 700 && !state.spillCounted) {
            state.spillCounted = true;
            state.mistakes += 1;
            state.streak = 0;
            this.feedback('VERSCHÜTTET', 'Zu lange gehalten · Zeitverlust', 'bad');
          }
        } else {
          const reaction = performance.now() - state.emptySince;
          if (reaction <= 360) { state.reactionPerfects += 1; state.streak += 1; this.feedback('SAUBER', `${Math.round(reaction)} ms Reaktion`, 'good'); }
          else state.streak = 0;
          this.startFlipPlacement();
        }
      }
    }
    if (state.phase === 'flight') {
      state.cupVy += delta * .0009;
      state.cupX += state.cupVx * delta * .001;
      state.cupY += state.cupVy * delta * .001;
      state.rotation += state.angular * delta * .001;
      if (state.cupY >= .69) {
        const normalized = rotationError(state.rotation);
        const landed = normalized < flipLandingTolerance(runtime, state) && state.cupX > .14 && state.cupX < .86;
        if (landed) this.completeFlip(normalized < .15 && state.placementScore > .82);
        else {
          state.mistakes += 1;
          state.streak = 0;
          Object.assign(state, { phase: 'place', cupY: .69, rotation: 0, cupVx: 0, cupVy: 0 });
          this.hint.textContent = 'Nicht gelandet. Sofort erneut an die Kante setzen – der Gegner wartet nicht.';
          this.feedback('FEHLFLIP', normalized > .9 ? 'Zu viel Rotation' : 'Winkel oder Position nicht stabil', 'bad');
        }
      }
    }
    state.bestStreak = Math.max(state.bestStreak, state.streak);
  }

  private startFlipPlacement(): void {
    const state = this.runtime!.state;
    Object.assign(state, { phase: 'place', holding: false, emptySince: 0, overhold: 0, spillCounted: false });
    this.action.textContent = 'BECHER PLATZIEREN';
    this.hint.textContent = 'Becher an die Tischkante ziehen. Der markierte Bereich zeigt den guten Überstand.';
  }

  private startFlipGesture(): void {
    const state = this.runtime!.state;
    const sweet = flipSweetSpot(state.lineup[state.runner]);
    const width = this.runtime!.context.flags['assist-flip-edge'] ? .14 : .085;
    state.placementScore = clamp(1 - Math.abs(state.overhang - sweet) / width, 0, 1);
    state.phase = 'flip';
    state.cupX = state.overhang;
    this.action.textContent = 'WISCHEN';
    this.hint.textContent = 'Vom unteren Becherrand zügig nach oben wischen. Kleine seitliche Abweichung ist kontrollierbar.';
  }

  private launchFlip(point: Point): void {
    const state = this.runtime!.state;
    const start = state.gestureStart as Point;
    const dx = point.x - start.x;
    const dy = point.y - start.y;
    const runnerId = state.lineup[state.runner];
    const control = flipControl(runnerId) + state.placementScore * .2;
    state.cupVx = dx * 1.55 / control;
    state.cupVy = Math.min(-.44, dy * 2.05);
    state.angular = clamp(-dy * (17 / control) + dx * 4.2, 3.8, 13.5);
    state.phase = 'flight';
    state.gestureStart = null;
  }

  private completeFlip(perfect: boolean): void {
    const runtime = this.runtime!;
    const state = runtime.state;
    state.runner += 1;
    if (perfect) { state.perfects += 1; state.streak += 1; this.feedback('PERFEKTER FLIP', `Serie ${state.streak}`, 'good'); }
    else { state.streak = Math.max(0, state.streak - 1); this.feedback('GELANDET', 'Staffel weiter', 'neutral'); }
    if (state.runner >= 4) {
      const score = Math.round(100 - state.opponent * 11 - state.mistakes * 7 + state.perfects * 9 + state.reactionPerfects * 4 + state.bestStreak * 3);
      const quality: MiniGameQuality = state.perfects >= 3 && state.mistakes === 0 && state.reactionPerfects >= 3 ? 'perfect' : state.mistakes <= 2 ? 'solid' : 'messy';
      this.finish({
        id: 'flipCup', success: true, score, quality,
        text: quality === 'perfect'
          ? 'Vier Leute, vier saubere Reaktionen und fast ein gemeinsames Nervensystem. Die Staffel wird zur sofort übertriebenen Lagerlegende.'
          : 'Die Staffel gewinnt. Nicht makellos, aber vor der Gegenseite – der einzige Wert, den später jemand zugibt.',
        needs: { alcohol: 14, bladder: 10, courage: 7 }, metrics: { reputation: quality === 'perfect' ? 6 : 3, momentum: 5 },
        relationships: teamRelationships(state.lineup, quality === 'perfect' ? 4 : 2),
        flags: quality === 'perfect' ? { 'flip-perfect-lineup': true } : undefined,
      });
      return;
    }
    Object.assign(state, {
      phase: 'drink', liquid: 1, cupX: .5, cupY: .69, rotation: 0, angular: 0, cupVx: 0, cupVy: 0,
      emptySince: 0, overhold: 0, spillCounted: false,
    });
    this.action.textContent = 'HALTEN: TRINKEN';
    this.hint.textContent = `${TEAM_NAMES[state.lineup[state.runner]] ?? state.lineup[state.runner]} ist dran. Halten, leeren, sofort loslassen.`;
  }

  private launchPong(end: Point): void {
    const state = this.runtime!.state;
    const start = state.dragStart as Point;
    const dx = start.x - end.x;
    const dy = start.y - end.y;
    if (Math.hypot(dx, dy) < .04) { state.dragStart = null; state.trajectory = []; return; }
    const precision = this.runtime!.context.flags['assist-precision'] ? .96 : 1;
    state.ball = { x: .5, y: .88, vx: dx * 1.32 * precision, vy: dy * 1.48 - .34, life: 0 };
    state.bounced = false;
    state.lastShotBounce = state.mode === 'bounce';
    state.phase = 'flight';
    state.dragStart = null;
    state.dragNow = null;
    state.trajectory = [];
  }

  private tickPong(delta: number): void {
    const runtime = this.runtime!;
    const state = runtime.state;
    const partnerSlow = runtime.context.flags['partner-susi-pong'] ? .82 : 1;
    state.opponentClock += delta * runtime.difficulty * partnerSlow;
    if (state.opponentClock > 4300 && state.phase !== 'flight') {
      state.opponentClock = 0;
      if (Math.random() < .62 + (runtime.difficulty - 1) * .25) state.opponentHits += 1;
      if (state.opponentHits >= 10 && !state.redemption) {
        const redemptionAvailable = state.hits >= 7 || runtime.context.flags['assist-pong-redemption'];
        if (redemptionAvailable) {
          state.redemption = true;
          state.phase = 'ready';
          this.feedback('REDEMPTION', 'Jeder Treffer verlängert die letzte Chance', 'warning');
          this.hint.textContent = 'Letzte Chance: Jeder Treffer hält die Redemption am Leben. Ein Fehlschuss beendet das Match.';
        } else {
          this.finishPong(false);
          return;
        }
      }
    }
    const ball = state.ball;
    if (!ball) return;
    const dt = delta / 1000;
    ball.life += dt;
    ball.vy += 1.35 * dt;
    ball.x += ball.vx * dt;
    ball.y += ball.vy * dt;
    if (state.mode === 'bounce' && !state.bounced && ball.y >= .58 && ball.vy > 0) {
      state.bounced = true;
      ball.y = .58;
      ball.vy *= -.58;
      ball.vx *= .9;
      const blockChance = runtime.context.flags['partner-susi-pong'] ? .12 : .24 * runtime.difficulty;
      if (Math.random() < blockChance) {
        state.ball = null;
        state.phase = 'ready';
        state.misses += 1;
        state.streak = 0;
        this.feedback('ABGEWEHRT', 'Bounce erkannt', 'bad');
        if (state.redemption) this.finishPong(false);
        return;
      }
    }
    const cups = state.cups.filter((cup: any) => cup.active);
    const radius = runtime.context.attempts === 0 ? .064 : .057;
    const hit = cups.find((cup: any) => distance(ball.x, ball.y, cup.x, cup.y) < radius && ball.vy > 0);
    if (hit) {
      hit.active = false;
      state.hits += 1;
      state.streak += 1;
      if (state.lastShotBounce) {
        const second = cups.find((cup: any) => cup.active && cup !== hit);
        if (second) { second.active = false; state.hits += 1; state.bounceHits += 1; }
      }
      state.ball = null;
      state.phase = 'ready';
      state.bestStreak = Math.max(state.bestStreak, state.streak);
      if (state.redemption) state.redemptionHits += 1;
      this.feedback(state.lastShotBounce ? 'BOUNCE-TREFFER' : 'TREFFER', `Serie ${state.streak}`, 'good');
      this.autoRerack();
      if (state.hits >= 10) { this.finishPong(true); return; }
      return;
    }
    if (ball.y > 1.05 || ball.x < -.1 || ball.x > 1.1 || ball.life > 3) {
      state.ball = null;
      state.phase = 'ready';
      state.misses += 1;
      state.streak = 0;
      this.feedback('DANEBEN', state.redemption ? 'Redemption beendet' : 'Kraft oder Richtung korrigieren', 'bad');
      if (state.redemption) this.finishPong(false);
    }
  }

  private autoRerack(): void {
    const state = this.runtime!.state;
    const remaining = state.cups.filter((cup: any) => cup.active);
    if (![6, 3, 1].includes(remaining.length)) return;
    state.reracks += 1;
    const layouts = remaining.length === 6
      ? pongCups().slice(0, 6)
      : remaining.length === 3
        ? [{ x: .5, y: .27 }, { x: .455, y: .35 }, { x: .545, y: .35 }]
        : [{ x: .5, y: .31 }];
    remaining.forEach((cup: any, index: number) => { cup.x = layouts[index].x; cup.y = layouts[index].y; });
    this.feedback('RE-RACK', `${remaining.length} Becher neu gestellt`, 'neutral');
  }

  private finishPong(success: boolean): void {
    const state = this.runtime!.state;
    const score = Math.round(state.hits * 13 - state.misses * 3 + state.bounceHits * 10 + state.bestStreak * 4 + state.redemptionHits * 6);
    const quality: MiniGameQuality = success && state.misses <= 1 && state.bounceHits >= 1 ? 'perfect' : success && state.misses <= 4 ? 'solid' : success ? 'messy' : 'failed';
    this.finish({
      id: 'beerPong', success, score, quality,
      text: success
        ? quality === 'perfect'
          ? 'Zehn Becher, kontrollierte Flugbahnen und mindestens ein erfolgreicher Umweg über den Tisch. Susi nennt es sauber. Felix nennt es Schicksal.'
          : 'Die Formation ist leergeräumt. Nicht jeder Wurf war schön, aber jeder verbleibende Becher gehört der Gegenseite.'
        : state.redemption
          ? 'Die Redemption endet am ersten Fehlschuss. Für eine gute Geschichte reicht es trotzdem, für einen Sieg nicht.'
          : 'Die Gegenseite räumt ihre zehn Becher zuerst ab. Der Tisch war nicht schief genug, um das vollständig zu erklären.',
      needs: { alcohol: success ? 12 : 8, bladder: success ? 8 : 5, courage: success ? 6 : -2 },
      metrics: { reputation: success ? (quality === 'perfect' ? 6 : 3) : -1, momentum: success ? 4 : -2 },
      relationships: runtimeRelationships(this.runtime!.context, ['susi', 'felix'], success ? 2 : 0),
      flags: quality === 'perfect' ? { 'pong-perfect-redemption': state.redemptionHits > 0 } : undefined,
    });
  }

  private launchFlunky(end: Point): void {
    const runtime = this.runtime!;
    const state = runtime.state;
    const start = state.dragStart as Point;
    const dx = start.x - end.x;
    const dy = start.y - end.y;
    state.dragStart = null;
    state.dragNow = null;
    const targetDx = .02;
    const targetDy = .38;
    const assist = runtime.context.flags['assist-precision'] ? .045 : 0;
    const tolerance = (.18 + assist + (runtime.context.attempts === 0 ? .035 : 0)) / runtime.difficulty;
    const accuracy = Math.hypot((dx - targetDx) * .8, dy - targetDy);
    const hit = accuracy < tolerance;
    if (hit) {
      state.attackHits += 1;
      state.phase = 'attack-drink';
      state.defender = 0;
      state.stopSignal = false;
      state.stopTimer = 0;
      state.foul = false;
      this.action.textContent = 'HALTEN: TRINKEN';
      this.feedback('FLASCHE FÄLLT', 'Trinken bis zum Stoppruf', 'good');
    } else {
      this.feedback('VERFEHLT', 'Sofort in die Verteidigung', 'bad');
      this.startDefense();
    }
  }

  private tickFlunky(delta: number): void {
    const runtime = this.runtime!;
    const state = runtime.state;
    if (state.phase === 'attack-drink') {
      const defenderSpeed = .00019 * runtime.difficulty;
      state.defender = Math.min(1, state.defender + delta * defenderSpeed);
      if (state.holding && !state.stopSignal) state.teamDrink = Math.min(100, state.teamDrink + delta * .00255);
      if (state.defender >= 1 && !state.stopSignal) {
        state.stopSignal = true;
        state.stopTimer = 0;
        this.feedback('STOPP!', 'Sofort loslassen', 'warning');
      }
      if (state.stopSignal) {
        state.stopTimer += delta;
        if (!state.holding) {
          const perfectWindow = runtime.context.flags['partner-jule-flunky'] ? 430 : 310;
          if (state.stopTimer <= perfectWindow) {
            state.stopQuality += Math.round((perfectWindow - state.stopTimer) / 12 + 18);
            this.feedback('SAUBERER STOPP', `${Math.round(state.stopTimer)} ms`, 'good');
          } else {
            state.teamDrink = Math.max(0, state.teamDrink - 5);
            this.feedback('SPÄT', 'Kleine Rückrechnung', 'bad');
          }
          this.endFlunkyRound();
        } else if (state.stopTimer > 650) {
          state.foul = true;
          state.holding = false;
          state.teamDrink = Math.max(0, state.teamDrink - 14);
          this.feedback('FOUL', 'Nach STOPP weitergetrunken', 'bad');
          this.endFlunkyRound();
        }
      }
    } else if (String(state.phase).startsWith('defense')) {
      const speedBoost = runtime.context.flags['assist-flunky-sprint'] ? 1.22 : 1;
      const dx = state.targetX - state.runnerX;
      const dy = state.targetY - state.runnerY;
      const length = Math.hypot(dx, dy);
      if (length > .01) {
        const nextX = state.runnerX + dx / length * delta * .00023 * speedBoost;
        const nextY = state.runnerY + dy / length * delta * .00023 * speedBoost;
        if (!hitsObstacle(nextX, nextY, state.obstacles)) { state.runnerX = nextX; state.runnerY = nextY; }
        else this.feedback('HINDERNIS', 'Route korrigieren', 'bad', false);
      }
      state.enemyDrink = Math.min(100, state.enemyDrink + delta * .00142 * runtime.difficulty);
      if (state.enemyDrink >= 100) {
        this.finish({
          id: 'flunkyball', success: false, score: Math.round(state.teamDrink), quality: 'failed',
          text: 'Die Gegenseite leert ihre Flaschen, während euer Ball noch eine eigene Reisebeschreibung verdient.',
          needs: { energy: -15, thirst: 10, alcohol: 8 }, metrics: { reputation: -1 },
        });
      }
    }
  }

  private flunkyAction(): void {
    const state = this.runtime!.state;
    if (state.phase === 'defense-run' && distance(state.runnerX, state.runnerY, .5, .55) < .1) {
      state.bottleUp = true;
      state.phase = 'defense-ball';
      this.feedback('FLASCHE STEHT', 'Jetzt zum Ball', 'good');
    } else if (state.phase === 'defense-ball' && distance(state.runnerX, state.runnerY, state.defenseBallX, state.defenseBallY) < .1) {
      state.ballHeld = true;
      state.phase = 'defense-return';
      state.targetX = .1;
      state.targetY = .77;
      this.feedback('BALL AUFGENOMMEN', 'Zur Linie zurück', 'good');
    } else if (state.phase === 'defense-return' && state.runnerX < .17) {
      const remaining = 100 - state.enemyDrink;
      state.stopQuality += Math.round(remaining * .55);
      if (remaining > 55) state.defensePerfects += 1;
      this.feedback('STOPP!', `${Math.round(remaining)} % gegnerisches Getränk gerettet`, 'good');
      this.endFlunkyRound();
    } else {
      this.feedback('ZU WEIT WEG', 'Erst näher an das Ziel laufen', 'bad', false);
    }
  }

  private startDefense(): void {
    const state = this.runtime!.state;
    Object.assign(state, {
      phase: 'defense-run', runnerX: .1, runnerY: .77, targetX: .5, targetY: .55,
      bottleUp: false, ballHeld: false, defenseBallX: .64 + Math.random() * .24, defenseBallY: .44 + Math.random() * .2,
    });
    this.action.textContent = 'AUFSTELLEN / AUFHEBEN / STOPP';
    this.hint.textContent = 'Antippen setzt das Laufziel. An Flasche, Ball und eigener Linie jeweils AKTION drücken.';
  }

  private endFlunkyRound(): void {
    const runtime = this.runtime!;
    const state = runtime.state;
    state.round += 1;
    state.holding = false;
    if (state.teamDrink >= 100) {
      const quality: MiniGameQuality = state.attackHits >= 3 && !state.foul && state.stopQuality >= 40 && state.defensePerfects >= 1 ? 'perfect' : state.attackHits >= 2 ? 'solid' : 'messy';
      this.finish({
        id: 'flunkyball', success: true,
        score: Math.round(100 + state.attackHits * 12 + state.stopQuality + state.defensePerfects * 12 - (state.foul ? 18 : 0)),
        quality,
        text: quality === 'perfect'
          ? 'Flasche getroffen, defensiv sauber gerettet und STOPP exakt an der Linie. Kurz sieht es wie organisierter Sport aus.'
          : 'Eure Flaschen sind leer. Der Weg dorthin war körperlich, taktisch und juristisch nicht vollständig sauber.',
        needs: { energy: -22, thirst: 14, alcohol: 14, bladder: 8, courage: 8 },
        metrics: { reputation: quality === 'perfect' ? 7 : 4, momentum: 7 },
        relationships: runtimeRelationships(runtime.context, ['danny', 'jule'], quality === 'perfect' ? 4 : 2),
      });
      return;
    }
    if (state.round > 8) {
      const success = state.teamDrink > state.enemyDrink;
      this.finish({
        id: 'flunkyball', success, score: Math.round(state.teamDrink - state.enemyDrink + 70), quality: success ? 'messy' : 'failed',
        text: success ? 'Zeitentscheidung. Ihr gewinnt knapp, hauptsächlich weil beide Seiten inzwischen Regeln erfinden.' : 'Zeitentscheidung verloren. Die Gegenseite war minimal organisierter.',
        needs: { energy: -20, thirst: 12, alcohol: 10 }, metrics: { reputation: success ? 2 : -1 },
      });
      return;
    }
    Object.assign(state, { phase: 'attack-throw', dragStart: null, dragNow: null, stopSignal: false, stopTimer: 0 });
    this.action.textContent = 'BALL WERFEN';
    this.hint.textContent = `Runde ${state.round}: Ball zurückziehen und auf die Mittelflasche werfen.`;
  }

  private chooseHedgeSpot(x: number): void {
    const state = this.runtime!.state;
    const index = x < .33 ? 0 : x > .67 ? 2 : 1;
    state.spot = index;
    state.phase = 'active';
    state.aim = [.27, .5, .74][index];
    this.action.textContent = 'HALTEN: BRUNSEN';
    this.hint.textContent = [
      'Naher Busch: schnell, aber kaum Deckung und hohe Geräuschwirkung.',
      'Tiefe Hecke: langsamer, gute Deckung, stärkere Windbewegung.',
      'Taucherzelt: Sichtschutz, aber sichtbare Beweise werden sozial teurer.',
    ][index];
    this.feedback('STELLE GEWÄHLT', ['Naher Busch', 'Tiefe Hecke', 'Taucherzelt'][index], 'neutral');
  }

  private tickHedge(delta: number): void {
    const runtime = this.runtime!;
    const state = runtime.state;
    if (state.phase !== 'active') return;
    const patrolReduction = runtime.context.flags['uli-route-knowledge'] ? .76 : 1;
    const goodwill = runtime.context.flags['authority-goodwill'] ? .75 : 1;
    state.observerA = (state.observerA + delta * .000085 * runtime.difficulty * patrolReduction) % 1;
    state.observerB = (state.observerB - delta * .000063 * runtime.difficulty * patrolReduction + 1) % 1;
    state.wind = Math.sin(performance.now() / 850) * ([.055, .085, .065][state.spot] ?? .06);
    const spotX = [.27, .5, .74][state.spot];
    const viewA = Math.abs(state.observerA - spotX) < .13;
    const viewB = Math.abs(state.observerB - spotX) < .105;
    const stream = state.aim + state.wind * (.45 + state.progress / 90);
    const tolerance = ([.105, .16, .125][state.spot] ?? .12) + (runtime.context.attempts === 0 ? .018 : 0);
    const inHedge = Math.abs(stream - spotX) < tolerance;
    const watched = viewA || viewB;
    if (state.holding) {
      state.progress = Math.min(100, state.progress + delta * ([.00325, .00245, .00272][state.spot] ?? .0027));
      const danger = (viewA ? 1 : 0) + (viewB ? 1 : 0) + (!inHedge ? 1 : 0);
      state.suspicion = Math.min(100, state.suspicion + delta * .0115 * danger * goodwill);
      if (!inHedge) state.evidence += delta * .0032;
      if (watched && state.suspicion < 100) state.caughtFlash = 180;
      if ((watched || !inHedge) && state.nearMissCooldown <= 0) {
        state.nearMisses += 1;
        state.nearMissCooldown = 700;
        this.feedback(watched ? 'BLICKKEGEL' : 'AUSSERHALB', watched ? 'Loslassen oder Deckung halten' : 'Richtung korrigieren', 'warning', false);
      }
    } else {
      state.suspicion = Math.max(0, state.suspicion - delta * .0017 * goodwill);
      if (state.progress > 0) state.interruptions += delta * .000018;
      state.noise = Math.min(100, state.noise + delta * .0008 * state.interruptions);
    }
    state.nearMissCooldown = Math.max(0, (state.nearMissCooldown ?? 0) - delta);
    state.caughtFlash = Math.max(0, state.caughtFlash - delta);
    if (state.suspicion >= 100) {
      this.finish({
        id: 'hedgePee', success: false, score: Math.round(state.progress - state.evidence - state.noise), quality: 'failed',
        text: 'Taschenlampe, Blickkontakt und eine ungünstige Strahlrichtung ergeben gemeinsam ein belastbares Heckenprotokoll.',
        suspicion: 32, relief: state.progress >= 70 ? 1 : 0, needs: { bladder: -Math.round(state.progress), courage: -8 },
        metrics: { dignity: -7, chaos: 6 }, relationships: { gundula: -5, uli: -4 }, flags: { hedgeCaught: true },
      });
      return;
    }
    if (state.progress >= 100) {
      const perfect = state.suspicion < 14 && state.evidence < 7 && state.interruptions < 1.4;
      const quality: MiniGameQuality = perfect ? 'perfect' : state.suspicion < 42 ? 'solid' : 'messy';
      this.finish({
        id: 'hedgePee', success: true, score: Math.round(116 - state.suspicion - state.evidence - state.noise), quality,
        text: perfect
          ? 'Erleichtert, unentdeckt und ohne sichtbaren Beweis. Die Hecke schweigt aus freien Stücken.'
          : 'Die Sache ist erledigt. Einige Blätter kennen die Wahrheit, besitzen aber keine Aussagegenehmigung.',
        suspicion: Math.round(state.suspicion * .22), relief: 1, needs: { bladder: -100, courage: 5 },
        metrics: { dignity: perfect ? 2 : -1, chaos: perfect ? 0 : 2 },
        flags: perfect ? { hedgePerfect: true } : undefined,
      });
    }
  }

  private assignMaslHand(pointerId: number, point: Point): void {
    const state = this.runtime!.state;
    const hand = this.runtime!.pointers.size >= 2
      ? point.x < .5 ? 'left' : 'right'
      : distance(point.x, point.y, state.left.x, state.left.y) < distance(point.x, point.y, state.right.x, state.right.y) ? 'left' : 'right';
    state[`pointer-${pointerId}`] = hand;
    state.activeHand = hand;
    this.moveMaslHand(pointerId, point);
  }

  private moveMaslHand(pointerId: number, point: Point): void {
    const state = this.runtime!.state;
    const hand = state[`pointer-${pointerId}`] ?? state.activeHand;
    state[hand] = {
      x: clamp(point.x, hand === 'left' ? .18 : .51, hand === 'left' ? .49 : .82),
      y: clamp(point.y, .38, .72),
    };
  }

  private tickMasl(delta: number, time: number): void {
    const runtime = this.runtime!;
    const state = runtime.state;
    const gap = state.right.x - state.left.x;
    const level = Math.abs(state.left.y - state.right.y);
    const center = (state.left.x + state.right.x) / 2;
    const alignment = Math.abs(center - state.jointX);
    const assist = runtime.context.flags['assist-masl-seal'] ? .12 : 0;
    const roundDrift = (state.round - 1) * .045;
    state.jointX = .5 + Math.sin(time / (920 - state.round * 90)) * roundDrift;
    state.breath = (Math.sin(time / 520) + 1) / 2;
    state.seal = clamp(1 - Math.abs(gap - .22) * (4 - assist * 8) - level * 3 - alignment * 3 + assist, 0, 1);
    if (state.phase === 'seal') {
      if (state.seal >= sealThreshold(runtime)) {
        state.stableTime += delta;
        this.action.textContent = state.stableTime > 450 ? 'ABDICHTUNG OK · STARTEN' : 'STABIL HALTEN';
        this.hint.textContent = state.stableTime > 450 ? 'Loch stabil. AKTION drücken und anschließend im hellen Atemfenster halten.' : 'Noch kurz stabil halten.';
      } else state.stableTime = Math.max(0, state.stableTime - delta * 1.5);
    }
    if (state.phase === 'pull' && state.holding) {
      const rhythm = 1 - Math.abs(state.breath - .72) * 1.8;
      const rhythmFactor = clamp(rhythm, .25, 1);
      state.rhythmQuality += delta * rhythmFactor;
      state.pull = Math.min(100, state.pull + delta * .00305 * state.seal * rhythmFactor);
      state.cough = Math.min(100, state.cough + delta * .00135 * (1.38 - state.seal) + (state.pull > 78 ? delta * .0023 : 0) + (rhythmFactor < .48 ? delta * .0012 : 0));
      if (state.seal < .43) state.leaks += delta * .0038;
      if (state.cough >= 100) this.completeMaslPull(false);
    } else if (state.phase === 'pull' && !state.holding && state.pull > 12) {
      this.completeMaslPull(state.pull >= 48 && state.pull <= 84 && state.seal >= .54 && state.rhythmQuality > 450);
    }
  }

  private completeMaslPull(good: boolean): void {
    const state = this.runtime!.state;
    const points = good
      ? Math.round(72 + state.seal * 24 - Math.abs(66 - state.pull) * .48 - state.leaks + Math.min(10, state.rhythmQuality / 180))
      : Math.max(5, Math.round(state.pull * .25 - state.leaks));
    state.score += points;
    if (!good) state.cough = Math.min(100, state.cough + 18);
    this.feedback(good ? 'SAUBERER ZUG' : 'HUSTEN / LECK', `${points} Punkte`, good ? 'good' : 'bad');
    if (state.round >= 3) {
      const success = state.score >= 175;
      const quality: MiniGameQuality = success && state.score >= 255 && state.cough < 55 ? 'perfect' : success ? 'solid' : state.score >= 120 ? 'messy' : 'failed';
      this.finish({
        id: 'maslHole', success, score: state.score, quality,
        text: quality === 'perfect'
          ? 'Drei dichte Züge, stabiler Rhythmus und Masl nickt exakt einmal. Mehr Anerkennung ist organisatorisch nicht vorgesehen.'
          : success
            ? 'Die Technik wirkt. Masl erkennt mehrere Momente echter Abdichtung und brauchbaren Rhythmus an.'
            : 'Wirkung vorhanden, aber ein erheblicher Teil des Rauchs führte ein eigenständiges Außenleben.',
        needs: { highness: success ? 42 : 20, energy: -8, courage: success ? 6 : 1 },
        metrics: { reputation: quality === 'perfect' ? 5 : success ? 2 : -1, momentum: success ? 5 : 0 },
        relationships: { masl: quality === 'perfect' ? 5 : success ? 3 : 0 },
        flags: quality === 'perfect' ? { maslTechniqueMastered: true } : undefined,
      });
      return;
    }
    state.round += 1;
    Object.assign(state, {
      phase: 'seal', pull: 0, cough: Math.max(0, state.cough - 8), leaks: 0, rhythmQuality: 0, stableTime: 0,
      left: { x: .31 + Math.random() * .05, y: .52 + Math.random() * .06 },
      right: { x: .64 + Math.random() * .05, y: .52 + Math.random() * .06 },
    });
    this.action.textContent = 'HÄNDE ABDICHTEN';
    this.hint.textContent = `Zug ${state.round}/3: Drift nimmt zu. Beide Hände erneut stabil um das Loch führen.`;
  }

  private syncLive(runtime: Runtime): void {
    const state = runtime.state;
    if (runtime.id === 'flipCup') this.updateLive(`STAFFEL ${state.runner + 1}/4`, this.phaseDescription(runtime), clamp((state.runner + (1 - state.liquid) * .35) / 4, 0, 1));
    if (runtime.id === 'beerPong') this.updateLive(state.redemption ? 'REDEMPTION' : `${state.hits}/10 BECHER`, this.phaseDescription(runtime), clamp(state.hits / 10, 0, 1));
    if (runtime.id === 'flunkyball') this.updateLive(`RUNDE ${state.round}`, this.phaseDescription(runtime), clamp(state.teamDrink / 100, 0, 1));
    if (runtime.id === 'hedgePee') this.updateLive(`VERDACHT ${Math.round(state.suspicion)}`, this.phaseDescription(runtime), clamp(state.progress / 100, 0, 1));
    if (runtime.id === 'maslHole') this.updateLive(`ZUG ${state.round}/3`, this.phaseDescription(runtime), clamp((state.round - 1 + state.pull / 100) / 3, 0, 1));
  }

  private phaseDescription(runtime: Runtime): string {
    const state = runtime.state;
    const labels: Record<MiniGameId, Record<string, string>> = {
      flipCup: { drink: 'Becher leeren · rechtzeitig loslassen', place: 'Überstand wählen', flip: 'Wischimpuls setzen', flight: 'Becher in der Luft' },
      beerPong: { ready: state.redemption ? 'Letzte Chance vorbereiten' : `${String(state.mode).toUpperCase()}-Wurf vorbereiten`, flight: 'Ballflug beobachten' },
      flunkyball: { 'attack-throw': 'Mittelflasche treffen', 'attack-drink': state.stopSignal ? 'STOPP – loslassen' : 'Trinken, Gegner beobachten', 'defense-run': 'Zur Flasche laufen', 'defense-ball': 'Ball aufnehmen', 'defense-return': 'Zur Linie und STOPP' },
      hedgePee: { choose: 'Deckung wählen', active: state.holding ? 'Richtung und Blickkegel halten' : 'Warten / Verdacht abbauen' },
      maslHole: { seal: 'Hände abdichten', pull: state.holding ? 'Wirkungszug kontrollieren' : 'Zug starten oder beenden' },
    };
    return labels[runtime.id][state.phase] ?? String(state.phase);
  }

  private feedback(kicker: string, text: string, tone: 'good' | 'bad' | 'warning' | 'neutral', haptic = true): void {
    this.phaseLabel.textContent = kicker;
    this.liveLabel.textContent = text;
    this.experience.dataset.feedback = tone;
    window.clearTimeout(Number(this.experience.dataset.feedbackTimer || 0));
    const timer = window.setTimeout(() => { delete this.experience.dataset.feedback; }, 650);
    this.experience.dataset.feedbackTimer = String(timer);
    if (haptic && typeof navigator.vibrate === 'function') navigator.vibrate(tone === 'good' ? [12, 25, 12] : tone === 'bad' ? [38] : tone === 'warning' ? [18, 18, 18] : [8]);
    this.beep(tone);
  }

  private beep(tone: 'good' | 'bad' | 'warning' | 'neutral'): void {
    try {
      this.audio ??= new AudioContext();
      const oscillator = this.audio.createOscillator();
      const gain = this.audio.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.value = tone === 'good' ? 660 : tone === 'bad' ? 190 : tone === 'warning' ? 330 : 440;
      gain.gain.setValueAtTime(.025, this.audio.currentTime);
      gain.gain.exponentialRampToValueAtTime(.0001, this.audio.currentTime + .08);
      oscillator.connect(gain).connect(this.audio.destination);
      oscillator.start();
      oscillator.stop(this.audio.currentTime + .08);
    } catch { /* Audio feedback is optional. */ }
  }

  private updateLive(phase: string, text: string, progress: number): void {
    this.phaseLabel.textContent = phase;
    this.liveLabel.textContent = text;
    const bar = this.experience.querySelector<HTMLElement>('.mini-live-progress i');
    if (bar) bar.style.width = `${clamp(progress, 0, 1) * 100}%`;
  }

  private inputAllowed(): boolean {
    return Boolean(this.runtime?.running && !this.runtime.paused && this.runtime.countdown <= 0);
  }

  private draw(runtime: Runtime): void {
    const ctx = this.ctx;
    const width = this.canvas.width;
    const height = this.canvas.height;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#17382f';
    ctx.fillRect(0, 0, width, height);
    if (runtime.id === 'flipCup') drawFlip(ctx, width, height, runtime.state, runtime.context);
    if (runtime.id === 'beerPong') drawPong(ctx, width, height, runtime.state, runtime.context);
    if (runtime.id === 'flunkyball') drawFlunky(ctx, width, height, runtime.state);
    if (runtime.id === 'hedgePee') drawHedge(ctx, width, height, runtime.state);
    if (runtime.id === 'maslHole') drawMasl(ctx, width, height, runtime.state, sealThreshold(runtime));
    if (runtime.paused && runtime.running) drawOverlay(ctx, width, height, 'PAUSIERT', 'Fortsetzen über die Schaltfläche oberhalb des Spielfelds');
    else if (runtime.countdown > 0) drawOverlay(ctx, width, height, String(Math.ceil(runtime.countdown / 1000)), 'Bereitmachen');
  }

  private finish(outcome: MiniGameOutcome): void {
    const runtime = this.runtime;
    if (!runtime?.running) return;
    runtime.running = false;
    runtime.paused = true;
    this.action.disabled = true;
    this.pauseButton.disabled = true;
    this.retryButton.hidden = false;
    const label = outcome.success
      ? outcome.quality === 'perfect' ? 'LEGENDÄR' : outcome.quality === 'messy' ? 'CHAOTISCH GESCHAFFT' : 'GESCHAFFT'
      : 'GESCHEITERT';
    this.result.hidden = false;
    this.result.innerHTML = `
      <strong>${label}</strong>
      <p>${escapeHtml(outcome.text)}</p>
      <div class="mini-result-stats"><span>Wert <b>${Math.round(outcome.score)}</b></span><span>Qualität <b>${outcome.quality}</b></span><span>Versuch <b>${runtime.context.attempts + 1}</b></span></div>
      <small>${outcome.success ? 'Das Ergebnis verändert Beziehungen, Ruf, Zustände und mögliche Kampfprogression.' : 'Ein Fehlschlag bleibt Teil der Chronik. Erneut versuchen ist möglich.'}</small>`;
    this.feedback(label, `Wert ${Math.round(outcome.score)}`, outcome.success ? 'good' : 'bad');
    this.onOutcome(outcome);
  }

  private point(event: PointerEvent): Point {
    const rect = this.canvas.getBoundingClientRect();
    return { x: clamp((event.clientX - rect.left) / rect.width, 0, 1), y: clamp((event.clientY - rect.top) / rect.height, 0, 1) };
  }
}

function adaptiveDifficulty(context: MiniGameContext): number {
  let value = context.attempts === 0 ? .84 : context.attempts === 1 && context.wins === 0 ? .9 : 1;
  if (context.wins >= 2) value += .05;
  if (context.bestQuality === 'perfect') value += .08;
  if (context.needs.energy < 30) value += .03;
  return clamp(value, .82, 1.18);
}

export function difficultyLabel(value: number): string {
  if (value < .9) return 'Einstiegshilfe';
  if (value < 1.04) return 'Normal';
  if (value < 1.12) return 'Fortgeschritten';
  return 'Legendenmodus';
}

export function activeAssist(id: MiniGameId, context: MiniGameContext): string {
  const assists: Array<[boolean, string]> = id === 'flipCup'
    ? [[Boolean(context.flags['assist-flip-edge']), 'Lars markiert den optimalen Becherüberstand.'], [Boolean(context.flags['assist-team-shout']), 'Renés Gruppenruf verlangsamt den gegnerischen Rhythmus.']]
    : id === 'beerPong'
      ? [[Boolean(context.flags['partner-susi-pong']), 'Susi liest Formationen und schwächt gegnerische Serien.'], [Boolean(context.flags['assist-pong-redemption']), 'Felix sichert eine zusätzliche Redemption.'], [Boolean(context.flags['assist-precision']), 'Gregor blendet eine Flugbahnprognose ein.']]
      : id === 'flunkyball'
        ? [[Boolean(context.flags['assist-flunky-sprint']), 'Danny zeigt die kürzere Verteidigungslinie.'], [Boolean(context.flags['partner-jule-flunky']), 'Jule erweitert das saubere Stoppruf-Fenster.']]
        : id === 'hedgePee'
          ? [[Boolean(context.flags['uli-route-knowledge']), 'Ulis Route macht Kontrollgänge langsamer vorhersehbar.'], [Boolean(context.flags['authority-goodwill']), 'Gundulas Wohlwollen bremst Verdachtsaufbau.']]
          : [[Boolean(context.flags['assist-masl-seal']), 'Masl verbreitert den stabilen Abdichtungsbereich.']];
  return assists.find(([active]) => active)?.[1] ?? '';
}

function defaultContext(): MiniGameContext {
  return {
    attempts: 0, wins: 0, best: 0, bestQuality: 'failed', activeTeam: [], flags: {},
    needs: { energy: 100, hunger: 0, thirst: 0, bladder: 0, alcohol: 0, highness: 0, hangover: 0, courage: 30 },
  };
}

function flipDrinkRate(id: string): number {
  return ({ andre: .00074, rene: .00082, lars: .00068, danny: .00078, gregor: .0007, masl: .0008, felix: .00076 } as Record<string, number>)[id] ?? .00072;
}
function flipControl(id: string): number { return ({ andre: 1.02, rene: .91, lars: 1.14, danny: 1.08, gregor: 1.1, masl: .9, felix: 1.03 } as Record<string, number>)[id] ?? 1; }
function flipSweetSpot(id: string): number { return ({ andre: .51, rene: .55, lars: .49, danny: .53, gregor: .5, masl: .57, felix: .52 } as Record<string, number>)[id] ?? .52; }
function flipLandingTolerance(runtime: Runtime, state: Record<string, any>): number { return (.43 + state.placementScore * .12 + (runtime.context.attempts === 0 ? .05 : 0)) / runtime.difficulty; }
function rotationError(rotation: number): number { return Math.abs(((rotation % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2) - Math.PI); }
function sealThreshold(runtime: Runtime): number { return runtime.context.flags['assist-masl-seal'] ? .55 : runtime.context.attempts === 0 ? .59 : .64; }

function predictedTrajectory(start: Point, end: Point, bounce: boolean): Point[] {
  const dx = start.x - end.x;
  const dy = start.y - end.y;
  let x = .5;
  let y = .88;
  let vx = dx * 1.32;
  let vy = dy * 1.48 - .34;
  let bounced = false;
  const result: Point[] = [];
  for (let step = 0; step < 26; step += 1) {
    vy += 1.35 * .055;
    x += vx * .055;
    y += vy * .055;
    if (bounce && !bounced && y >= .58 && vy > 0) { bounced = true; y = .58; vy *= -.58; vx *= .9; }
    result.push({ x, y });
  }
  return result;
}

function pongCups(): any[] {
  return [
    { x: .5, y: .22 }, { x: .455, y: .29 }, { x: .545, y: .29 }, { x: .41, y: .36 }, { x: .5, y: .36 }, { x: .59, y: .36 },
    { x: .365, y: .43 }, { x: .455, y: .43 }, { x: .545, y: .43 }, { x: .635, y: .43 },
  ].map((point) => ({ ...point, active: true }));
}

function flunkyObstacles(): Array<{ x: number; y: number; w: number; h: number }> {
  return [{ x: .28, y: .64, w: .1, h: .08 }, { x: .63, y: .68, w: .12, h: .07 }];
}
function hitsObstacle(x: number, y: number, obstacles: Array<{ x: number; y: number; w: number; h: number }>): boolean {
  return obstacles.some((obstacle) => x > obstacle.x && x < obstacle.x + obstacle.w && y > obstacle.y && y < obstacle.y + obstacle.h);
}

function teamRelationships(lineup: string[], delta: number): Record<string, number> {
  return Object.fromEntries([...new Set(lineup)].filter(Boolean).map((id) => [id, delta]));
}
function runtimeRelationships(context: MiniGameContext, preferred: string[], delta: number): Record<string, number> {
  const ids = preferred.filter((id) => context.activeTeam.includes(id) || context.flags[`partner-${id}-pong`] || context.flags[`partner-${id}-flunky`]);
  return Object.fromEntries(ids.map((id) => [id, delta]));
}

function drawFlip(ctx: CanvasRenderingContext2D, width: number, height: number, state: any, context: MiniGameContext): void {
  ctx.fillStyle = '#162f38'; ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = '#70452e'; ctx.fillRect(70, height * .69, width - 140, 80);
  ctx.fillStyle = '#fff1c4'; ctx.font = '700 19px system-ui';
  ctx.fillText(`Euer Team ${state.runner}/4 · Gegner ${Math.min(4, state.opponent).toFixed(1)}/4 · Fehler ${state.mistakes} · Serie ${state.streak}`, 28, 30);
  for (let index = 0; index < 4; index += 1) {
    ctx.fillStyle = index < state.runner ? '#79c992' : index === state.runner ? '#e6b94e' : '#8f5148';
    ctx.beginPath(); ctx.arc(205 + index * 165, 125, 30, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font = '700 13px system-ui';
    ctx.fillText(TEAM_NAMES[state.lineup[index]] ?? state.lineup[index], 180 + index * 165, 175);
  }
  if (state.phase === 'place' || state.phase === 'flip') {
    const sweet = flipSweetSpot(state.lineup[state.runner]);
    const zone = context.flags['assist-flip-edge'] ? .14 : .085;
    ctx.fillStyle = 'rgba(117,198,140,.22)';
    ctx.fillRect((sweet - zone) * width, height * .645, zone * 2 * width, 18);
  }
  const x = state.cupX * width;
  const y = state.cupY * height;
  ctx.save(); ctx.translate(x, y); ctx.rotate(state.rotation);
  ctx.fillStyle = '#d6534c';
  ctx.beginPath(); ctx.moveTo(-28, -58); ctx.lineTo(28, -58); ctx.lineTo(22, 0); ctx.lineTo(-22, 0); ctx.closePath(); ctx.fill();
  if (state.phase === 'drink') { ctx.fillStyle = '#e6c052'; ctx.fillRect(-20, -48, 40, Math.max(0, 42 * state.liquid)); }
  ctx.restore();
  ctx.fillStyle = '#d8c16f'; ctx.fillRect(width * .32, height * .66, width * .39, 5);
}

function drawPong(ctx: CanvasRenderingContext2D, width: number, height: number, state: any, context: MiniGameContext): void {
  ctx.fillStyle = '#172937'; ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = '#7c3b31'; roundRect(ctx, 110, 50, width - 220, height - 100, 28); ctx.fill();
  ctx.strokeStyle = '#e9b660'; ctx.lineWidth = 5; ctx.stroke();
  for (const cup of state.cups) {
    if (!cup.active) continue;
    ctx.fillStyle = '#d34d59'; ctx.beginPath(); ctx.arc(cup.x * width, cup.y * height, 21, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#fff2d8'; ctx.lineWidth = 3; ctx.stroke();
  }
  if (context.flags['assist-precision'] && state.trajectory?.length) {
    ctx.fillStyle = 'rgba(118,216,192,.55)';
    for (const point of state.trajectory.filter((_: Point, index: number) => index % 2 === 0)) { ctx.beginPath(); ctx.arc(point.x * width, point.y * height, 4, 0, Math.PI * 2); ctx.fill(); }
  }
  const ball = state.ball ?? { x: .5, y: .88 };
  ctx.fillStyle = '#f5f0d9'; ctx.beginPath(); ctx.arc(ball.x * width, ball.y * height, 10, 0, Math.PI * 2); ctx.fill();
  if (state.dragStart && state.dragNow) { ctx.strokeStyle = '#76d8c0'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(state.dragStart.x * width, state.dragStart.y * height); ctx.lineTo(state.dragNow.x * width, state.dragNow.y * height); ctx.stroke(); }
  ctx.fillStyle = '#fff1c4'; ctx.font = '700 18px system-ui';
  ctx.fillText(`${state.redemption ? 'REDEMPTION · ' : ''}Treffer ${state.hits}/10 · Gegner ${state.opponentHits}/10 · Fehlwürfe ${state.misses} · ${String(state.mode).toUpperCase()}`, 24, 30);
}

function drawFlunky(ctx: CanvasRenderingContext2D, width: number, height: number, state: any): void {
  ctx.fillStyle = '#79a7ad'; ctx.fillRect(0, 0, width, height * .48);
  ctx.fillStyle = '#d4bd82'; ctx.fillRect(0, height * .48, width, height * .52);
  ctx.fillStyle = '#e6d890'; ctx.fillRect(width * .485, height * .44, 30, 90);
  ctx.fillStyle = '#e6524a'; ctx.fillRect(width * .485, height * .55, 30, 10);
  for (const obstacle of state.obstacles) { ctx.fillStyle = '#5f4b39'; roundRect(ctx, obstacle.x * width, obstacle.y * height, obstacle.w * width, obstacle.h * height, 8); ctx.fill(); }
  ctx.fillStyle = '#fff1c4'; ctx.font = '700 18px system-ui';
  ctx.fillText(`Runde ${state.round} · Ihr ${Math.round(state.teamDrink)}% · Gegner ${Math.round(state.enemyDrink)}% · ${String(state.phase).toUpperCase()}`, 24, 30);
  ctx.fillStyle = '#e5a84e'; ctx.beginPath(); ctx.arc(state.runnerX * width, state.runnerY * height, 18, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#f2eee0'; ctx.beginPath(); ctx.arc(state.defenseBallX * width, state.defenseBallY * height, 9, 0, Math.PI * 2); ctx.fill();
  if (state.dragStart && state.dragNow) { ctx.strokeStyle = '#2d665b'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(state.dragStart.x * width, state.dragStart.y * height); ctx.lineTo(state.dragNow.x * width, state.dragNow.y * height); ctx.stroke(); }
  drawBar(ctx, 25, height - 55, width * .38, 18, state.teamDrink / 100, 'EUER GETRÄNK');
  drawBar(ctx, width * .57, height - 55, width * .38, 18, state.enemyDrink / 100, 'GEGNER');
  if (state.stopSignal) { ctx.fillStyle = 'rgba(217,103,88,.92)'; ctx.font = '900 72px system-ui'; ctx.textAlign = 'center'; ctx.fillText('STOPP!', width / 2, height / 2); ctx.textAlign = 'left'; }
}

function drawHedge(ctx: CanvasRenderingContext2D, width: number, height: number, state: any): void {
  ctx.fillStyle = '#0f241d'; ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = '#2f6a40'; ctx.fillRect(70, 170, width - 140, 170);
  for (let x = 80; x < width - 70; x += 38) { ctx.fillStyle = x % 76 ? '#397b49' : '#2b613b'; ctx.beginPath(); ctx.arc(x, 175, 48, 0, Math.PI * 2); ctx.fill(); }
  const spots = [.27, .5, .74];
  for (let index = 0; index < 3; index += 1) {
    ctx.strokeStyle = index === state.spot ? '#f0c75b' : 'rgba(255,255,255,.35)'; ctx.lineWidth = 4; ctx.strokeRect(spots[index] * width - 55, 210, 110, 95);
    ctx.fillStyle = '#fff1c4'; ctx.font = '700 12px system-ui'; ctx.fillText(['NAH', 'TIEF', 'ZELT'][index], spots[index] * width - 18, 325);
  }
  const ax = state.observerA * width;
  const bx = state.observerB * width;
  ctx.fillStyle = 'rgba(239,197,93,.18)'; ctx.beginPath(); ctx.moveTo(ax, 85); ctx.lineTo(ax - 110, 230); ctx.lineTo(ax + 110, 230); ctx.fill();
  ctx.fillStyle = 'rgba(117,185,210,.15)'; ctx.beginPath(); ctx.moveTo(bx, 110); ctx.lineTo(bx - 90, 245); ctx.lineTo(bx + 90, 245); ctx.fill();
  ctx.fillStyle = '#d4b455'; ctx.fillRect(ax - 12, 55, 24, 42);
  ctx.fillStyle = '#76a9c0'; ctx.fillRect(bx - 12, 80, 24, 42);
  if (state.phase === 'active') {
    const spot = spots[state.spot];
    ctx.strokeStyle = state.caughtFlash > 0 ? '#ef725e' : '#e4cf5c'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(spot * width, 350); ctx.quadraticCurveTo(state.aim * width, 300, (state.aim + state.wind) * width, 235); ctx.stroke();
  }
  drawBar(ctx, 35, 380, width * .42, 18, state.progress / 100, 'ERLEICHTERUNG');
  drawBar(ctx, width * .54, 380, width * .42, 18, state.suspicion / 100, 'VERDACHT');
}

function drawMasl(ctx: CanvasRenderingContext2D, width: number, height: number, state: any, threshold: number): void {
  ctx.fillStyle = '#17282a'; ctx.fillRect(0, 0, width, height);
  const hand = (point: any, left: boolean): void => {
    ctx.fillStyle = '#d8a17d'; roundRect(ctx, point.x * width - 105, point.y * height - 70, 210, 140, 62); ctx.fill();
    ctx.fillStyle = '#9f7058'; roundRect(ctx, point.x * width + (left ? 45 : -75), point.y * height - 55, 30, 105, 14); ctx.fill();
  };
  hand(state.left, true); hand(state.right, false);
  ctx.fillStyle = '#f1e4c4'; roundRect(ctx, state.jointX * width - 62, state.jointY * height - 6, 124, 12, 5); ctx.fill();
  ctx.fillStyle = '#7f4a2e'; ctx.fillRect(state.jointX * width + 48, state.jointY * height - 6, 14, 12);
  const center = (state.left.x + state.right.x) / 2;
  ctx.fillStyle = '#07120f'; ctx.beginPath(); ctx.arc(center * width, (state.left.y + state.right.y) / 2 * height, 18 + 22 * (1 - state.seal), 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = state.seal > threshold ? '#80d5a2' : '#df7b63'; ctx.lineWidth = 5; ctx.stroke();
  const breathX = 35 + (width - 70) * state.breath;
  ctx.fillStyle = 'rgba(255,241,196,.12)'; ctx.fillRect(35, 330, width - 70, 8);
  ctx.fillStyle = state.breath > .55 && state.breath < .88 ? '#80d5a2' : '#e5b85d'; ctx.beginPath(); ctx.arc(breathX, 334, 8, 0, Math.PI * 2); ctx.fill();
  drawBar(ctx, 35, 360, width * .28, 16, state.seal, 'ABDICHTUNG');
  drawBar(ctx, width * .36, 360, width * .28, 16, state.pull / 100, 'WIRKUNG');
  drawBar(ctx, width * .67, 360, width * .28, 16, state.cough / 100, 'HUSTEN');
  ctx.fillStyle = '#fff1c4'; ctx.font = '700 18px system-ui'; ctx.fillText(`Zug ${state.round}/3 · Wert ${state.score}`, 35, 32);
}

function drawOverlay(ctx: CanvasRenderingContext2D, width: number, height: number, title: string, copy: string): void {
  ctx.fillStyle = 'rgba(5,15,12,.72)'; ctx.fillRect(0, 0, width, height);
  ctx.textAlign = 'center'; ctx.fillStyle = '#fff1c4'; ctx.font = '900 72px system-ui'; ctx.fillText(title, width / 2, height / 2 - 15);
  ctx.font = '700 18px system-ui'; ctx.fillStyle = '#c8d9d0'; ctx.fillText(copy, width / 2, height / 2 + 28); ctx.textAlign = 'left';
}

function drawBar(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, value: number, label: string): void {
  ctx.fillStyle = '#071611'; roundRect(ctx, x, y, width, height, 8); ctx.fill();
  ctx.fillStyle = value > .78 ? '#df6e58' : '#79c992'; roundRect(ctx, x + 2, y + 2, Math.max(0, (width - 4) * clamp(value, 0, 1)), height - 4, 6); ctx.fill();
  ctx.fillStyle = '#fff1c4'; ctx.font = '700 10px system-ui'; ctx.fillText(label, x, y - 6);
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number): void { ctx.beginPath(); ctx.roundRect(x, y, width, height, radius); }
function distance(ax: number, ay: number, bx: number, by: number): number { return Math.hypot(ax - bx, ay - by); }
function clamp(value: number, min: number, max: number): number { return Math.max(min, Math.min(max, value)); }
function escapeHtml(value: string): string { return value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character] ?? character); }
function requireElement<T extends Element = HTMLElement>(root: ParentNode, selector: string): T { const node = root.querySelector(selector); if (!node) throw new Error(`Missing minigame element: ${selector}`); return node as T; }

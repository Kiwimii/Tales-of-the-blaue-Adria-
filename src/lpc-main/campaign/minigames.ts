export type MiniGameId = 'flipCup' | 'beerPong' | 'flunkyball' | 'hedgePee' | 'maslHole';

export interface MiniGameOutcome {
  id: MiniGameId;
  success: boolean;
  score: number;
  quality: 'perfect' | 'solid' | 'messy' | 'failed';
  text: string;
  needs?: Partial<Record<'energy' | 'thirst' | 'bladder' | 'alcohol' | 'courage', number>>;
  suspicion?: number;
  relief?: number;
}

interface Runtime {
  id: MiniGameId;
  running: boolean;
  start: number;
  last: number;
  raf: number;
  state: Record<string, number | boolean | string>;
  cleanup: Array<() => void>;
}

const TITLES: Record<MiniGameId, string> = {
  flipCup: 'Flip Cup · Becher gegen Menschenwürde',
  beerPong: 'Beer Pong · Physik mit Ausreden',
  flunkyball: 'Flunkyball · Laufen, werfen, trinken, bereuen',
  hedgePee: 'In die Hecke · diskrete Infrastruktur',
  maslHole: 'Komm ans Loch · Masls Präzisionsprüfung',
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

  constructor(private readonly root: HTMLElement, private readonly onOutcome: (outcome: MiniGameOutcome) => void) {
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
    this.action.addEventListener('click', () => this.primaryAction());
    this.close.addEventListener('click', () => this.stop());
  }

  start(id: MiniGameId): void {
    this.stop(false);
    this.root.hidden = false;
    this.title.textContent = TITLES[id];
    this.result.hidden = true;
    this.result.textContent = '';
    this.action.disabled = false;
    this.canvas.width = 900;
    this.canvas.height = 430;
    this.runtime = { id, running: true, start: performance.now(), last: performance.now(), raf: 0, state: {}, cleanup: [] };
    if (id === 'flipCup') this.setupFlipCup();
    if (id === 'beerPong') this.setupBeerPong();
    if (id === 'flunkyball') this.setupFlunkyball();
    if (id === 'hedgePee') this.setupHedgePee();
    if (id === 'maslHole') this.setupMaslHole();
    this.runtime.raf = requestAnimationFrame((time) => this.tick(time));
  }

  stop(hide = true): void {
    if (this.runtime) {
      cancelAnimationFrame(this.runtime.raf);
      this.runtime.cleanup.forEach((cleanup) => cleanup());
    }
    this.runtime = undefined;
    if (hide) this.root.hidden = true;
  }

  private setupFlipCup(): void {
    const state = this.runtime!.state;
    Object.assign(state, { phase: 'drink', meter: 0, direction: 1, drinks: 0, flipAngle: 0, target: 0.79 });
    this.copy.textContent = 'Drei Phasen: trinken, Becher an die Kante setzen, Flip im richtigen Moment. Der Pegel verschiebt das Timing später ohnehin.';
    this.hint.textContent = 'Drücke AKTION im goldenen Bereich. Drei saubere Durchgänge gewinnen.';
    this.action.textContent = 'TRINKEN / FLIP';
  }

  private setupBeerPong(): void {
    const state = this.runtime!.state;
    Object.assign(state, { aimX: 0.5, aimY: 0.5, driftX: 0.37, driftY: -0.29, cups: 6, shots: 0, hits: 0, phase: 'aim' });
    this.copy.textContent = 'Der Zielpunkt driftet. Beim ersten Druck wird die Richtung, beim zweiten die Kraft festgelegt. Drei Treffer reichen – theoretisch.';
    this.hint.textContent = 'AKTION: Ziel fixieren → Kraft stoppen → werfen.';
    this.action.textContent = 'ZIEL FIXIEREN';
  }

  private setupFlunkyball(): void {
    const state = this.runtime!.state;
    Object.assign(state, { phase: 'run', progress: 0, stamina: 100, throwMeter: 0, drinkMeter: 0, rounds: 0, successes: 0, direction: 1 });
    this.copy.textContent = 'Laufen baut Position auf, der Wurf braucht Präzision und beim Trinken muss der rote Bereich vermieden werden. Drei Staffeln entscheiden.';
    this.hint.textContent = 'Halte Leertaste oder AKTION beim Laufen. Stoppe Wurf und Trinkphase gezielt.';
    this.action.textContent = 'LAUFEN';
    this.bindHoldAction('holding');
  }

  private setupHedgePee(): void {
    const state = this.runtime!.state;
    Object.assign(state, { stream: 0, bladder: 100, observer: 0, observerDir: 1, cover: 0.5, suspicion: 0, holding: false });
    this.copy.textContent = 'Die Hecke bietet Deckung, aber Uli führt Kontrollgänge durch. Erleichterung steigt beim Halten – Verdacht ebenfalls, sobald sein Blickkegel dich trifft.';
    this.hint.textContent = 'Halte AKTION nur, wenn der Blickkegel nicht auf deiner Position liegt. Bei 100 % Erleichterung ist die Sache abgeschlossen.';
    this.action.textContent = 'HALTEN: BRUNSEN';
    this.bindHoldAction('holding');
  }

  private setupMaslHole(): void {
    const state = this.runtime!.state;
    Object.assign(state, { x: 0.08, y: 0.5, vx: 0, vy: 0, holeX: 0.82, holeY: 0.5, holeR: 0.075, time: 28, collisions: 0 });
    this.copy.textContent = 'Führe die Spielfigur durch Masls improvisierten Parcours zum Loch. Die Wände bewegen sich, weil Regeln ohne unnötige Härte nur Hinweise wären.';
    this.hint.textContent = 'Pfeiltasten, WASD oder Ziehen auf dem Feld. Erreiche das Loch vor Ablauf der Zeit.';
    this.action.textContent = 'IMPULS';
    this.bindDirectionalInput();
    const pointer = (event: PointerEvent): void => {
      const rect = this.canvas.getBoundingClientRect();
      state.x = clamp((event.clientX - rect.left) / rect.width, 0.03, 0.97);
      state.y = clamp((event.clientY - rect.top) / rect.height, 0.04, 0.96);
    };
    this.canvas.addEventListener('pointermove', pointer);
    this.runtime!.cleanup.push(() => this.canvas.removeEventListener('pointermove', pointer));
  }

  private bindHoldAction(key: string): void {
    const down = (): void => { if (this.runtime) this.runtime.state[key] = true; };
    const up = (): void => { if (this.runtime) this.runtime.state[key] = false; };
    this.action.addEventListener('pointerdown', down);
    this.action.addEventListener('pointerup', up);
    this.action.addEventListener('pointerleave', up);
    const keyboardDown = (event: KeyboardEvent): void => { if (event.code === 'Space') { event.preventDefault(); down(); } };
    const keyboardUp = (event: KeyboardEvent): void => { if (event.code === 'Space') up(); };
    window.addEventListener('keydown', keyboardDown);
    window.addEventListener('keyup', keyboardUp);
    this.runtime!.cleanup.push(
      () => this.action.removeEventListener('pointerdown', down),
      () => this.action.removeEventListener('pointerup', up),
      () => this.action.removeEventListener('pointerleave', up),
      () => window.removeEventListener('keydown', keyboardDown),
      () => window.removeEventListener('keyup', keyboardUp),
    );
  }

  private bindDirectionalInput(): void {
    const held = new Set<string>();
    const down = (event: KeyboardEvent): void => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(event.code)) {
        event.preventDefault(); held.add(event.code);
      }
    };
    const up = (event: KeyboardEvent): void => held.delete(event.code);
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    this.runtime!.state.keys = 'bound';
    (this.runtime as Runtime & { held?: Set<string> }).held = held;
    this.runtime!.cleanup.push(() => window.removeEventListener('keydown', down), () => window.removeEventListener('keyup', up));
  }

  private primaryAction(): void {
    const runtime = this.runtime;
    if (!runtime?.running) return;
    if (runtime.id === 'flipCup') this.flipAction();
    if (runtime.id === 'beerPong') this.pongAction();
    if (runtime.id === 'flunkyball' && runtime.state.phase !== 'run') this.flunkyAction();
    if (runtime.id === 'maslHole') {
      runtime.state.vx = Number(runtime.state.vx) + 0.12;
      runtime.state.vy = Number(runtime.state.vy) - 0.04;
    }
  }

  private flipAction(): void {
    const state = this.runtime!.state;
    const meter = Number(state.meter);
    const phase = String(state.phase);
    const target = phase === 'drink' ? 0.72 : 0.79;
    const error = Math.abs(meter - target);
    if (error > (phase === 'drink' ? 0.22 : 0.13)) {
      this.finish({ id: 'flipCup', success: false, score: Math.round((1 - error) * 65), quality: 'failed', text: phase === 'drink' ? 'Zu früh abgesetzt. Der Becher ist enttäuscht und ungewöhnlich trocken.' : 'Der Becher beschreibt eine schöne Flugkurve und landet juristisch außerhalb des Spiels.', needs: { alcohol: 4, bladder: 5 } });
      return;
    }
    if (phase === 'drink') {
      state.phase = 'flip'; state.meter = 0; state.direction = 1;
      this.hint.textContent = 'Jetzt den Flip im schmaleren goldenen Bereich stoppen.';
      this.action.textContent = 'FLIP';
      return;
    }
    state.drinks = Number(state.drinks) + 1;
    if (Number(state.drinks) >= 3) {
      const quality = error < 0.035 ? 'perfect' : 'solid';
      this.finish({ id: 'flipCup', success: true, score: quality === 'perfect' ? 100 : 82, quality, text: quality === 'perfect' ? 'Drei Becher landen sauber. Die Gruppe jubelt, als wäre Präzision vorher vereinbart gewesen.' : 'Der letzte Becher bleibt stehen. Würde und Ruf steigen gleichzeitig – ein seltener Systemfehler.', needs: { alcohol: 12, bladder: 9, courage: 5 } });
    } else {
      state.phase = 'drink'; state.meter = 0; state.direction = 1;
      this.hint.textContent = `Durchgang ${Number(state.drinks) + 1}/3: erst trinken, dann flippen.`;
      this.action.textContent = 'TRINKEN';
    }
  }

  private pongAction(): void {
    const state = this.runtime!.state;
    const phase = String(state.phase);
    if (phase === 'aim') {
      state.lockX = state.aimX; state.phase = 'power'; state.power = 0; state.direction = 1;
      this.action.textContent = 'KRAFT STOPPEN';
      this.hint.textContent = 'Kraft in der goldenen Zone stoppen.';
      return;
    }
    if (phase === 'power') {
      const x = Number(state.lockX);
      const power = Number(state.power);
      const cups = cupPositions(Number(state.cups));
      const landingX = x + (power - 0.64) * 0.42;
      const landingY = Number(state.aimY) + (power - 0.64) * -0.2;
      const hitIndex = cups.findIndex((cup) => distance(landingX, landingY, cup.x, cup.y) < 0.075);
      state.shots = Number(state.shots) + 1;
      if (hitIndex >= 0) { state.hits = Number(state.hits) + 1; state.cups = Math.max(0, Number(state.cups) - 1); }
      if (Number(state.hits) >= 3 || Number(state.shots) >= 6) {
        const success = Number(state.hits) >= 3;
        const score = Math.round(Number(state.hits) / Math.max(1, Number(state.shots)) * 100);
        this.finish({ id: 'beerPong', success, score, quality: success && Number(state.shots) <= 4 ? 'perfect' : success ? 'solid' : 'failed', text: success ? `${state.hits} Treffer aus ${state.shots} Würfen. Felix erklärt die Flugkurve sofort zur Persönlichkeit.` : `${state.hits} Treffer. Der Tisch war schief, die Becher voreingenommen und die Physik offensichtlich gekauft.`, needs: { alcohol: success ? 7 : 10, bladder: 5 } });
        return;
      }
      state.phase = 'aim'; state.power = 0;
      this.action.textContent = 'ZIEL FIXIEREN';
      this.hint.textContent = hitIndex >= 0 ? `Treffer. Noch ${3 - Number(state.hits)} bis zum Sieg.` : 'Daneben. Ziel driftet weiter.';
    }
  }

  private flunkyAction(): void {
    const state = this.runtime!.state;
    const phase = String(state.phase);
    if (phase === 'throw') {
      const error = Math.abs(Number(state.throwMeter) - 0.68);
      state.throwOk = error < 0.14;
      state.phase = 'drink'; state.drinkMeter = 0; state.direction = 1;
      this.action.textContent = 'TRINKEN STOPPEN';
      this.hint.textContent = state.throwOk ? 'Flasche getroffen. Jetzt trinken, ohne den roten Bereich zu erreichen.' : 'Wurf daneben. Ein sauberer Trinkstopp kann die Runde noch retten.';
    } else if (phase === 'drink') {
      const value = Number(state.drinkMeter);
      const ok = value >= 0.48 && value <= 0.78;
      const roundSuccess = Boolean(state.throwOk) && ok;
      state.successes = Number(state.successes) + (roundSuccess ? 1 : 0);
      state.rounds = Number(state.rounds) + 1;
      if (Number(state.rounds) >= 3) {
        const success = Number(state.successes) >= 2;
        const score = Math.round((Number(state.successes) / 3) * 85 + Number(state.stamina) * 0.15);
        this.finish({ id: 'flunkyball', success, score, quality: Number(state.successes) === 3 ? 'perfect' : success ? 'solid' : 'failed', text: success ? `${state.successes}/3 Staffeln gelingen. Rennen, Werfen und Trinken wirken kurz wie eine Sportart.` : `Nur ${state.successes}/3 Staffeln. Der Körper beantragt eine Trennung der Disziplinen.`, needs: { energy: -18, thirst: 12, alcohol: 12, bladder: 7, courage: success ? 8 : -3 } });
      } else {
        state.phase = 'run'; state.progress = 0; state.holding = false; state.throwMeter = 0; state.direction = 1;
        this.action.textContent = 'LAUFEN';
        this.hint.textContent = `Staffel ${Number(state.rounds) + 1}/3. Halten zum Laufen.`;
      }
    }
  }

  private tick(time: number): void {
    const runtime = this.runtime;
    if (!runtime?.running) return;
    const delta = Math.min(42, time - runtime.last);
    runtime.last = time;
    if (runtime.id === 'flipCup') this.tickFlip(delta);
    if (runtime.id === 'beerPong') this.tickPong(delta);
    if (runtime.id === 'flunkyball') this.tickFlunky(delta);
    if (runtime.id === 'hedgePee') this.tickHedge(delta);
    if (runtime.id === 'maslHole') this.tickHole(delta);
    this.draw(runtime);
    runtime.raf = requestAnimationFrame((next) => this.tick(next));
  }

  private tickFlip(delta: number): void {
    const state = this.runtime!.state;
    let meter = Number(state.meter) + Number(state.direction) * delta * (String(state.phase) === 'flip' ? 0.00165 : 0.00125);
    if (meter >= 1) { meter = 1; state.direction = -1; }
    if (meter <= 0) { meter = 0; state.direction = 1; }
    state.meter = meter;
  }

  private tickPong(delta: number): void {
    const state = this.runtime!.state;
    if (state.phase === 'aim') {
      let x = Number(state.aimX) + Number(state.driftX) * delta * 0.0007;
      let y = Number(state.aimY) + Number(state.driftY) * delta * 0.00055;
      if (x > 0.88 || x < 0.12) { state.driftX = -Number(state.driftX); x = clamp(x, 0.12, 0.88); }
      if (y > 0.82 || y < 0.18) { state.driftY = -Number(state.driftY); y = clamp(y, 0.18, 0.82); }
      state.aimX = x; state.aimY = y;
    } else {
      let power = Number(state.power) + Number(state.direction) * delta * 0.00135;
      if (power > 1 || power < 0) { state.direction = -Number(state.direction); power = clamp(power, 0, 1); }
      state.power = power;
    }
  }

  private tickFlunky(delta: number): void {
    const state = this.runtime!.state;
    const phase = String(state.phase);
    if (phase === 'run') {
      if (state.holding) {
        state.progress = Number(state.progress) + delta * 0.00042 * (0.55 + Number(state.stamina) / 100);
        state.stamina = Math.max(0, Number(state.stamina) - delta * 0.009);
      } else state.stamina = Math.min(100, Number(state.stamina) + delta * 0.004);
      if (Number(state.progress) >= 1) {
        state.phase = 'throw'; state.throwMeter = 0; state.direction = 1; state.holding = false;
        this.action.textContent = 'WURF STOPPEN';
        this.hint.textContent = 'Stoppe die Wurfkraft im goldenen Fenster.';
      }
    } else if (phase === 'throw') state.throwMeter = bouncing(Number(state.throwMeter), state, delta * 0.0015);
    else state.drinkMeter = bouncing(Number(state.drinkMeter), state, delta * 0.00118);
  }

  private tickHedge(delta: number): void {
    const state = this.runtime!.state;
    let observer = Number(state.observer) + Number(state.observerDir) * delta * 0.00038;
    if (observer > 1 || observer < 0) { state.observerDir = -Number(state.observerDir); observer = clamp(observer, 0, 1); }
    state.observer = observer;
    const seen = Math.abs(observer - Number(state.cover)) < 0.14;
    if (state.holding) {
      state.stream = Math.min(100, Number(state.stream) + delta * (seen ? 0.012 : 0.027));
      state.bladder = Math.max(0, 100 - Number(state.stream));
      state.suspicion = Math.min(100, Number(state.suspicion) + delta * (seen ? 0.04 : -0.003));
    } else state.suspicion = Math.max(0, Number(state.suspicion) - delta * 0.006);
    if (Number(state.suspicion) >= 100) {
      this.finish({ id: 'hedgePee', success: false, score: Math.round(Number(state.stream)), quality: 'failed', text: 'Uli erwischt dich im Blickkegel. Gundula notiert „Heckenereignis“ mit erschreckender Routine.', suspicion: 28, relief: 0, needs: { courage: -8 } });
    } else if (Number(state.stream) >= 100) {
      const suspicion = Math.round(Number(state.suspicion));
      this.finish({ id: 'hedgePee', success: true, score: 100 - suspicion, quality: suspicion < 18 ? 'perfect' : 'solid', text: suspicion < 18 ? 'Vollständig erleichtert, vollständig unentdeckt. Die Hecke erhält keine Gelegenheit zur Stellungnahme.' : 'Erleichterung erreicht. Irgendjemand hat etwas bemerkt, aber niemand möchte genug wissen, um nachzufragen.', suspicion: Math.round(suspicion * 0.25), relief: 1, needs: { bladder: -100, courage: 5 } });
    }
  }

  private tickHole(delta: number): void {
    const runtime = this.runtime! as Runtime & { held?: Set<string> };
    const state = runtime.state;
    const keys = runtime.held ?? new Set<string>();
    const accel = delta * 0.000018;
    if (keys.has('ArrowLeft') || keys.has('KeyA')) state.vx = Number(state.vx) - accel;
    if (keys.has('ArrowRight') || keys.has('KeyD')) state.vx = Number(state.vx) + accel;
    if (keys.has('ArrowUp') || keys.has('KeyW')) state.vy = Number(state.vy) - accel;
    if (keys.has('ArrowDown') || keys.has('KeyS')) state.vy = Number(state.vy) + accel;
    state.vx = Number(state.vx) * 0.965; state.vy = Number(state.vy) * 0.965;
    let x = Number(state.x) + Number(state.vx) * delta;
    let y = Number(state.y) + Number(state.vy) * delta;
    const elapsed = (performance.now() - runtime.start) / 1000;
    const walls = movingWalls(elapsed);
    for (const wall of walls) {
      if (x > wall.x && x < wall.x + wall.w && y > wall.y && y < wall.y + wall.h) {
        state.collisions = Number(state.collisions) + 1;
        state.vx = -Number(state.vx) * 0.55; state.vy = -Number(state.vy) * 0.55;
        x = Number(state.x); y = Number(state.y);
      }
    }
    state.x = clamp(x, 0.025, 0.975); state.y = clamp(y, 0.04, 0.96);
    state.time = Math.max(0, 28 - elapsed);
    if (distance(Number(state.x), Number(state.y), Number(state.holeX), Number(state.holeY)) < Number(state.holeR)) {
      const score = Math.round(Number(state.time) * 3 + Math.max(0, 20 - Number(state.collisions) * 2));
      this.finish({ id: 'maslHole', success: true, score, quality: Number(state.time) > 16 && Number(state.collisions) <= 2 ? 'perfect' : 'solid', text: `Du kommst ans Loch. Masl erkennt ${state.collisions} Wandkontakte offiziell als „taktische Korrekturen“ an.`, needs: { courage: 6 } });
    } else if (Number(state.time) <= 0) {
      this.finish({ id: 'maslHole', success: false, score: Math.max(0, 20 - Number(state.collisions)), quality: 'failed', text: 'Die Zeit endet. Masl erklärt ausführlich, dass das Loch die ganze Zeit sichtbar war. Das hilft rückwirkend enorm.' });
    }
  }

  private draw(runtime: Runtime): void {
    const ctx = this.ctx;
    const w = this.canvas.width; const h = this.canvas.height;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#17382f'; ctx.fillRect(0, 0, w, h);
    if (runtime.id === 'flipCup') drawFlip(ctx, w, h, runtime.state);
    if (runtime.id === 'beerPong') drawPong(ctx, w, h, runtime.state);
    if (runtime.id === 'flunkyball') drawFlunky(ctx, w, h, runtime.state);
    if (runtime.id === 'hedgePee') drawHedge(ctx, w, h, runtime.state);
    if (runtime.id === 'maslHole') drawHole(ctx, w, h, runtime.state, (performance.now() - runtime.start) / 1000);
  }

  private finish(outcome: MiniGameOutcome): void {
    const runtime = this.runtime;
    if (!runtime?.running) return;
    runtime.running = false;
    cancelAnimationFrame(runtime.raf);
    this.action.disabled = true;
    this.result.hidden = false;
    this.result.innerHTML = `<strong>${outcome.success ? outcome.quality === 'perfect' ? 'PERFEKT' : 'GESCHAFFT' : 'GESCHEITERT'}</strong><p>${escapeHtml(outcome.text)}</p><small>Wert ${Math.round(outcome.score)}</small>`;
    this.onOutcome(outcome);
  }
}

function drawMeter(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, value: number, targetStart: number, targetEnd: number): void {
  ctx.fillStyle = '#091b17'; roundRect(ctx, x, y, w, h, 12); ctx.fill();
  ctx.fillStyle = '#ddb94f'; roundRect(ctx, x + w * targetStart, y + 4, w * (targetEnd - targetStart), h - 8, 8); ctx.fill();
  ctx.fillStyle = '#fff3c4'; ctx.fillRect(x + w * value - 4, y - 8, 8, h + 16);
}

function drawFlip(ctx: CanvasRenderingContext2D, w: number, h: number, state: Record<string, number | boolean | string>): void {
  ctx.fillStyle = '#234e41'; ctx.fillRect(90, 250, w - 180, 60);
  ctx.fillStyle = '#d9ccb1'; ctx.fillRect(120, 310, 25, 80); ctx.fillRect(w - 145, 310, 25, 80);
  const count = Number(state.drinks);
  for (let i = 0; i < 3; i += 1) {
    ctx.fillStyle = i < count ? '#79c992' : '#d5584d';
    ctx.beginPath(); ctx.moveTo(300 + i * 145, 220); ctx.lineTo(350 + i * 145, 220); ctx.lineTo(342 + i * 145, 275); ctx.lineTo(308 + i * 145, 275); ctx.closePath(); ctx.fill();
  }
  ctx.fillStyle = '#fff1c4'; ctx.font = '700 28px system-ui'; ctx.fillText(String(state.phase) === 'drink' ? 'TRINKEN' : 'FLIPPEN', 90, 90);
  drawMeter(ctx, 90, 130, w - 180, 48, Number(state.meter), String(state.phase) === 'drink' ? 0.58 : 0.72, String(state.phase) === 'drink' ? 0.86 : 0.86);
}

function drawPong(ctx: CanvasRenderingContext2D, w: number, h: number, state: Record<string, number | boolean | string>): void {
  ctx.fillStyle = '#315a50'; roundRect(ctx, 130, 45, w - 260, h - 90, 24); ctx.fill();
  const cups = cupPositions(Number(state.cups));
  cups.forEach((cup) => {
    ctx.fillStyle = '#d75248'; ctx.beginPath(); ctx.arc(130 + cup.x * (w - 260), 45 + cup.y * (h - 90), 24, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#fff1c4'; ctx.lineWidth = 4; ctx.stroke();
  });
  const x = 130 + Number(state.aimX) * (w - 260); const y = 45 + Number(state.aimY) * (h - 90);
  ctx.strokeStyle = '#f3cf61'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x, y, 20, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x - 30, y); ctx.lineTo(x + 30, y); ctx.moveTo(x, y - 30); ctx.lineTo(x, y + 30); ctx.stroke();
  if (state.phase === 'power') drawMeter(ctx, 220, h - 55, w - 440, 30, Number(state.power), 0.55, 0.73);
  ctx.fillStyle = '#fff1c4'; ctx.font = '700 22px system-ui'; ctx.fillText(`Treffer ${state.hits ?? 0}/3 · Würfe ${state.shots ?? 0}/6`, 30, 32);
}

function drawFlunky(ctx: CanvasRenderingContext2D, w: number, h: number, state: Record<string, number | boolean | string>): void {
  ctx.fillStyle = '#c7b16e'; ctx.fillRect(70, 270, w - 140, 70);
  ctx.fillStyle = '#427b55'; ctx.fillRect(70, 340, w - 140, 60);
  const x = 100 + Number(state.progress) * (w - 220);
  ctx.fillStyle = '#e8b65b'; ctx.beginPath(); ctx.arc(x, 255, 25, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#fff1c4'; ctx.font = '700 24px system-ui'; ctx.fillText(`Staffel ${Number(state.rounds) + 1}/3 · Erfolge ${state.successes}`, 70, 55);
  ctx.fillText(`Ausdauer ${Math.round(Number(state.stamina))}`, 70, 90);
  const phase = String(state.phase);
  if (phase === 'run') drawMeter(ctx, 70, 125, w - 140, 34, Number(state.progress), 0.95, 1);
  if (phase === 'throw') drawMeter(ctx, 70, 125, w - 140, 44, Number(state.throwMeter), 0.56, 0.8);
  if (phase === 'drink') drawMeter(ctx, 70, 125, w - 140, 44, Number(state.drinkMeter), 0.48, 0.78);
}

function drawHedge(ctx: CanvasRenderingContext2D, w: number, h: number, state: Record<string, number | boolean | string>): void {
  ctx.fillStyle = '#285a36'; ctx.fillRect(0, 250, w, 180);
  for (let x = 0; x < w; x += 45) { ctx.fillStyle = x % 90 ? '#397449' : '#2f683f'; ctx.beginPath(); ctx.arc(x, 250, 65, 0, Math.PI * 2); ctx.fill(); }
  const playerX = w * Number(state.cover);
  ctx.fillStyle = '#e4ad3c'; ctx.beginPath(); ctx.arc(playerX, 220, 22, 0, Math.PI * 2); ctx.fill();
  const observerX = 70 + Number(state.observer) * (w - 140);
  ctx.fillStyle = '#24282b'; ctx.fillRect(observerX - 16, 65, 32, 58);
  ctx.fillStyle = 'rgba(239,197,93,.18)'; ctx.beginPath(); ctx.moveTo(observerX, 115); ctx.lineTo(observerX - 150, 250); ctx.lineTo(observerX + 150, 250); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#fff1c4'; ctx.font = '700 21px system-ui'; ctx.fillText(`Erleichterung ${Math.round(Number(state.stream))}%`, 40, 35); ctx.fillText(`Verdacht ${Math.round(Number(state.suspicion))}%`, 650, 35);
  drawMeter(ctx, 40, 150, 360, 30, Number(state.stream) / 100, 0.9, 1);
  drawMeter(ctx, 500, 150, 360, 30, Number(state.suspicion) / 100, 0.8, 1);
}

function drawHole(ctx: CanvasRenderingContext2D, w: number, h: number, state: Record<string, number | boolean | string>, time: number): void {
  ctx.fillStyle = '#385f48'; ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#8e7952';
  for (const wall of movingWalls(time)) ctx.fillRect(wall.x * w, wall.y * h, wall.w * w, wall.h * h);
  ctx.fillStyle = '#0d1815'; ctx.beginPath(); ctx.arc(Number(state.holeX) * w, Number(state.holeY) * h, Number(state.holeR) * Math.min(w, h), 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#f3cf61'; ctx.lineWidth = 5; ctx.stroke();
  ctx.fillStyle = '#e5ad43'; ctx.beginPath(); ctx.arc(Number(state.x) * w, Number(state.y) * h, 16, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#fff1c4'; ctx.font = '700 22px system-ui'; ctx.fillText(`Zeit ${Number(state.time).toFixed(1)} · Kontakte ${state.collisions}`, 25, 32);
}

function cupPositions(count: number): Array<{ x: number; y: number }> {
  const all = [{ x: .72, y: .5 }, { x: .62, y: .4 }, { x: .62, y: .6 }, { x: .52, y: .3 }, { x: .52, y: .5 }, { x: .52, y: .7 }];
  return all.slice(0, Math.max(0, count));
}

function movingWalls(time: number): Array<{ x: number; y: number; w: number; h: number }> {
  return [
    { x: .18, y: 0, w: .045, h: .62 + Math.sin(time) * .08 },
    { x: .38, y: .34, w: .045, h: .66 },
    { x: .58, y: 0, w: .045, h: .58 + Math.cos(time * .8) * .1 },
    { x: .73, y: .42, w: .045, h: .58 },
    { x: .22, y: .72, w: .35, h: .045 },
  ];
}

function bouncing(value: number, state: Record<string, number | boolean | string>, speed: number): number {
  let next = value + Number(state.direction) * speed;
  if (next > 1 || next < 0) { state.direction = -Number(state.direction); next = clamp(next, 0, 1); }
  return next;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): void {
  ctx.beginPath(); ctx.roundRect(x, y, w, h, r);
}

function distance(ax: number, ay: number, bx: number, by: number): number { return Math.hypot(ax - bx, ay - by); }
function clamp(value: number, min: number, max: number): number { return Math.max(min, Math.min(max, value)); }
function escapeHtml(value: string): string { return value.replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char] ?? char); }
function requireElement<T extends Element = HTMLElement>(root: ParentNode, selector: string): T { const node = selector === 'canvas' ? root.querySelector('canvas') : root.querySelector(selector); if (!node) throw new Error(`Missing minigame element: ${selector}`); return node as T; }

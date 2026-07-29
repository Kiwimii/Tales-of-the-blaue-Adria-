import { MinigameDirector as BaseMinigameDirector, type MiniGameId } from './minigamesV2';

type InternalRuntime = {
  id: MiniGameId;
  running: boolean;
  paused: boolean;
  raf: number;
  last: number;
  countdown: number;
  state: Record<string, any>;
  pointers: Map<number, { x: number; y: number }>;
  cleanup: Array<() => void>;
  context: { activeTeam: string[] };
};

type InternalDirector = {
  runtime?: InternalRuntime;
  action: HTMLButtonElement;
  canvas: HTMLCanvasElement;
  feedback: (kicker: string, text: string, tone: 'good' | 'bad' | 'warning' | 'neutral', haptic?: boolean) => void;
  tick: (time: number) => void;
  togglePause: () => void;
};

type DirectorPrototype = Record<string, (...args: any[]) => any>;

let installed = false;

export function installMinigameHardening(): void {
  if (installed) return;
  installed = true;

  const prototype = BaseMinigameDirector.prototype as unknown as DirectorPrototype;

  patchFlipCupLineup(prototype);
  patchHoldInput(prototype);
  patchPrimaryActionRouting(prototype);
  patchPointerCleanup(prototype);
  patchAnimationLifecycle(prototype);
  patchStopCleanup(prototype);
}

export function buildUniqueFlipLineup(activeTeam: string[]): string[] {
  const fallback = ['rene', 'lars', 'danny', 'gregor', 'masl', 'felix', 'schima'];
  const unique = ['andre', ...activeTeam, ...fallback].filter((id, index, source) => Boolean(id) && source.indexOf(id) === index);
  return unique.slice(0, 4);
}

export function canChangeBeerPongMode(phase: string): boolean {
  return phase === 'ready';
}

export function shouldIgnorePrimaryAction(id: MiniGameId, phase: string): boolean {
  if (id === 'beerPong') return !canChangeBeerPongMode(phase);
  return id === 'flunkyball' && phase === 'attack-drink';
}

export function minigameHardeningSnapshot(director: unknown): Record<string, unknown> {
  const internal = director as InternalDirector;
  const runtime = internal.runtime;
  return {
    id: runtime?.id ?? null,
    running: runtime?.running ?? false,
    paused: runtime?.paused ?? false,
    phase: runtime?.state.phase ?? null,
    holding: runtime?.state.holding ?? false,
    mode: runtime?.state.mode ?? null,
    pointerCount: runtime?.pointers.size ?? 0,
    raf: runtime?.raf ?? 0,
    pausedClass: document.body.classList.contains('minigame-paused'),
  };
}

function patchFlipCupLineup(prototype: DirectorPrototype): void {
  const original = prototype.setupFlipCup;
  prototype.setupFlipCup = function setupFlipCupHardened(this: InternalDirector): void {
    original.call(this);
    const runtime = this.runtime;
    if (!runtime) return;
    runtime.state.lineup = buildUniqueFlipLineup(runtime.context.activeTeam);
  };
}

function patchHoldInput(prototype: DirectorPrototype): void {
  prototype.bindHoldAction = function bindHoldActionHardened(this: InternalDirector, key: string): void {
    const runtime = this.runtime;
    if (!runtime) return;

    let activePointer: number | undefined;
    const release = (): void => {
      if (this.runtime) this.runtime.state[key] = false;
      activePointer = undefined;
    };
    const pointerDown = (event: PointerEvent): void => {
      if (!inputAllowed(this)) return;
      activePointer = event.pointerId;
      if (this.runtime) this.runtime.state[key] = true;
    };
    const pointerUp = (event: PointerEvent): void => {
      if (activePointer === undefined || event.pointerId === activePointer) release();
    };
    const keyDown = (event: KeyboardEvent): void => {
      if (event.code !== 'Space' || event.repeat || !inputAllowed(this)) return;
      event.preventDefault();
      if (this.runtime) this.runtime.state[key] = true;
    };
    const keyUp = (event: KeyboardEvent): void => {
      if (event.code !== 'Space') return;
      event.preventDefault();
      release();
    };
    const visibility = (): void => {
      if (document.hidden) release();
    };

    this.action.addEventListener('pointerdown', pointerDown);
    window.addEventListener('pointerup', pointerUp);
    window.addEventListener('pointercancel', pointerUp);
    window.addEventListener('blur', release);
    window.addEventListener('keydown', keyDown);
    window.addEventListener('keyup', keyUp);
    document.addEventListener('visibilitychange', visibility);

    runtime.cleanup.push(
      () => this.action.removeEventListener('pointerdown', pointerDown),
      () => window.removeEventListener('pointerup', pointerUp),
      () => window.removeEventListener('pointercancel', pointerUp),
      () => window.removeEventListener('blur', release),
      () => window.removeEventListener('keydown', keyDown),
      () => window.removeEventListener('keyup', keyUp),
      () => document.removeEventListener('visibilitychange', visibility),
    );
  };
}

function patchPrimaryActionRouting(prototype: DirectorPrototype): void {
  const original = prototype.primaryAction;
  prototype.primaryAction = function primaryActionHardened(this: InternalDirector): void {
    const runtime = this.runtime;
    if (!runtime) return original.call(this);
    const phase = String(runtime.state.phase);
    if (shouldIgnorePrimaryAction(runtime.id, phase)) {
      if (runtime.id === 'beerPong') this.feedback('BALL IN DER LUFT', 'Wurfart gilt bis zur Landung', 'neutral', false);
      return;
    }
    original.call(this);
  };
}

function patchPointerCleanup(prototype: DirectorPrototype): void {
  const original = prototype.pointerUp;
  prototype.pointerUp = function pointerUpHardened(this: InternalDirector, point: { x: number; y: number }, pointerId: number): void {
    original.call(this, point, pointerId);
    if (!this.runtime) return;
    delete this.runtime.state[`pointer-${pointerId}`];
    this.runtime.pointers.delete(pointerId);
    try {
      if (this.canvas.hasPointerCapture(pointerId)) this.canvas.releasePointerCapture(pointerId);
    } catch {
      // Pointer capture may already have been released by the browser.
    }
  };
}

function patchAnimationLifecycle(prototype: DirectorPrototype): void {
  const originalStart = prototype.start;
  prototype.start = function startHardened(this: InternalDirector, id: MiniGameId): void {
    originalStart.call(this, id);
    const runtime = this.runtime;
    if (!runtime) return;
    const visibility = (): void => {
      if (document.hidden && runtime.running && !runtime.paused) this.togglePause();
    };
    document.addEventListener('visibilitychange', visibility);
    runtime.cleanup.push(() => document.removeEventListener('visibilitychange', visibility));
  };

  const originalBegin = prototype.begin;
  prototype.begin = function beginHardened(this: InternalDirector): void {
    originalBegin.call(this);
    const runtime = this.runtime;
    if (!runtime?.running || runtime.raf) return;
    runtime.last = performance.now();
    runtime.raf = requestAnimationFrame((time) => this.tick(time));
  };

  const originalTick = prototype.tick;
  prototype.tick = function tickHardened(this: InternalDirector, time: number): void {
    originalTick.call(this, time);
    const runtime = this.runtime;
    if (!runtime || runtime.running) return;
    if (runtime.raf) cancelAnimationFrame(runtime.raf);
    runtime.raf = 0;
  };

  const originalFinish = prototype.finish;
  prototype.finish = function finishHardened(this: InternalDirector, outcome: unknown): void {
    originalFinish.call(this, outcome);
    document.body.classList.remove('minigame-paused');
  };
}

function patchStopCleanup(prototype: DirectorPrototype): void {
  const original = prototype.stop;
  prototype.stop = function stopHardened(this: InternalDirector, hide = true): void {
    const runtime = this.runtime;
    if (runtime) {
      runtime.state.holding = false;
      for (const pointerId of runtime.pointers.keys()) {
        delete runtime.state[`pointer-${pointerId}`];
        try {
          if (this.canvas.hasPointerCapture(pointerId)) this.canvas.releasePointerCapture(pointerId);
        } catch {
          // Pointer capture may already be gone.
        }
      }
      runtime.pointers.clear();
    }
    original.call(this, hide);
    document.body.classList.remove('minigame-paused');
  };
}

function inputAllowed(director: InternalDirector): boolean {
  const runtime = director.runtime;
  return Boolean(runtime?.running && !runtime.paused && runtime.countdown <= 0);
}

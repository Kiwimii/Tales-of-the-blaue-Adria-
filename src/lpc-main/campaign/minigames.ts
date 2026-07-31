import {
  MinigameDirector as EnhancedMinigameDirector,
  activeAssist,
  difficultyLabel,
  type MiniGameContext,
  type MiniGameId,
  type MiniGameOutcome,
  type MiniGameQuality,
} from './minigamesV2';
import { BeerPongRebuild } from './beerPongRebuild';
import { FastMinigamesRebuild } from './fastMinigamesRebuild';
import {
  applyMinigameRuntimeEffects,
  currentMinigameContext,
  stageMinigameOutcome,
} from './campaignRuntime';
import {
  installMinigameHardening,
  minigameHardeningSnapshot,
} from './minigameHardening';
import { installMinigameVisuals } from './minigameVisuals';

installMinigameHardening();
installMinigameCloseBridge();
installExternalStartBridge();

export { activeAssist, difficultyLabel };
export type { MiniGameContext, MiniGameId, MiniGameOutcome, MiniGameQuality };

let activeDirector: MinigameDirector | undefined;

export class MinigameDirector extends EnhancedMinigameDirector {
  private readonly beerPong: BeerPongRebuild;
  private readonly fastGames: FastMinigamesRebuild;

  constructor(root: HTMLElement, onOutcome: (outcome: MiniGameOutcome) => void) {
    const deliverOutcome = (outcome: MiniGameOutcome): void => {
      stageMinigameOutcome(outcome);
      applyMinigameRuntimeEffects(outcome);
      onOutcome(outcome);
      window.dispatchEvent(new CustomEvent<MiniGameOutcome>('lpc-campaign-minigame-outcome', { detail: structuredClone(outcome) }));
    };

    super(root, deliverOutcome, currentMinigameContext);

    // The enhanced base director owns its own detached start button and only mounts it when a game opens.
    // Beer Pong needs a separate button reference during construction, so mount a temporary button,
    // let the rebuilt controller capture it, and detach it again until Beer Pong renders its briefing.
    const beerPongStart = document.createElement('button');
    beerPongStart.type = 'button';
    beerPongStart.className = 'primary mini-start beer-pong-start';
    beerPongStart.textContent = 'SPIEL STARTEN';
    root.querySelector('[data-mini-briefing]')?.append(beerPongStart);
    this.beerPong = new BeerPongRebuild(root, deliverOutcome, () => currentMinigameContext('beerPong'));
    beerPongStart.remove();

    this.fastGames = new FastMinigamesRebuild(root, deliverOutcome, currentMinigameContext);

    activeDirector = this;
    installMinigameVisuals(root);
    root.querySelector<HTMLButtonElement>('[data-mini-close]')?.addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('lpc-campaign-minigame-closed'));
    });
    exposeSmokeDiagnostics(this, root);
  }

  override start(id: MiniGameId): void {
    if (id === 'beerPong') {
      this.fastGames.stop(false);
      super.stop(false);
      this.beerPong.start();
      return;
    }
    if (id === 'hedgePee' || id === 'maslHole') {
      this.beerPong.stop(false);
      super.stop(false);
      this.fastGames.start(id);
      return;
    }
    this.fastGames.stop(false);
    this.beerPong.stop(false);
    super.start(id);
  }

  override stop(hide = true): void {
    this.fastGames?.stop(false);
    this.beerPong?.stop(false);
    super.stop(hide);
  }

  beerPongActive(): boolean { return this.beerPong.isActive(); }
  beerPongSkipCountdown(): void { this.beerPong.debugSkipCountdown(); }
  beerPongSetState(values: Record<string, unknown>): void { this.beerPong.debugSetState(values); }
  beerPongSnapshot(): Record<string, unknown> { return this.beerPong.debugSnapshot(); }

  fastGameActive(): boolean { return this.fastGames.isActive(); }
  fastGameSkipCountdown(): void { this.fastGames.debugSkipCountdown(); }
  fastGameSetState(values: Record<string, unknown>): void { this.fastGames.debugSetState(values); }
  fastGameAction(): void {
    const snapshot = this.fastGames.debugSnapshot();
    if (snapshot.phase === 'seal' && Number(snapshot.stableTime) >= 260) {
      this.fastGames.debugSetState({ phase: 'timing', breath: .6, lockedSeal: Number(snapshot.seal) || 1 });
    }
    this.fastGames.debugAction();
  }
  fastGameSnapshot(): Record<string, unknown> { return this.fastGames.debugSnapshot(); }
}

let externalStartBridgeInstalled = false;
function installExternalStartBridge(): void {
  if (externalStartBridgeInstalled) return;
  externalStartBridgeInstalled = true;
  window.addEventListener('lpc-campaign-start-minigame', ((event: CustomEvent<MiniGameId>) => {
    if (!activeDirector || !event.detail) return;
    activeDirector.start(event.detail);
    document.body.classList.add('campaign-modal-open');
  }) as EventListener);
}

let closeBridgeInstalled = false;
function installMinigameCloseBridge(): void {
  if (closeBridgeInstalled) return;
  closeBridgeInstalled = true;
  window.addEventListener('lpc-campaign-minigame-closed', () => {
    const modalOpen = ['generic-modal', 'battle-modal', 'minigame-modal', 'weekend-arc-modal']
      .map((id) => document.getElementById(id))
      .some((modal) => Boolean(modal && !modal.hidden));
    document.body.classList.toggle('campaign-modal-open', modalOpen);
    const prompt = document.getElementById('interaction-prompt');
    const promptText = document.getElementById('interaction-text')?.textContent?.trim();
    if (prompt && !modalOpen) prompt.hidden = !promptText;
    window.dispatchEvent(new CustomEvent('lpc-campaign-world-input-restored'));
  });
}

function exposeSmokeDiagnostics(director: MinigameDirector, root: HTMLElement): void {
  if (new URLSearchParams(location.search).get('smoke') !== '1') return;
  const internal = director as unknown as {
    runtime?: { countdown: number; state: Record<string, any> };
    primaryAction: () => void;
  };
  const global = window as unknown as Record<string, unknown>;
  global.__lpcMinigameDirector = director;
  global.__lpcMinigameDebug = {
    start(id: MiniGameId): void { director.start(id); },
    begin(): void { root.querySelector<HTMLButtonElement>('.mini-start')?.click(); },
    close(): void { root.querySelector<HTMLButtonElement>('[data-mini-close]')?.click(); },
    skipCountdown(): void {
      if (director.beerPongActive()) director.beerPongSkipCountdown();
      else if (director.fastGameActive()) director.fastGameSkipCountdown();
      else if (internal.runtime) internal.runtime.countdown = 0;
    },
    setState(values: Record<string, unknown>): void {
      if (director.beerPongActive()) director.beerPongSetState(values);
      else if (director.fastGameActive()) director.fastGameSetState(values);
      else if (internal.runtime) Object.assign(internal.runtime.state, values);
    },
    action(): void {
      if (director.beerPongActive()) root.querySelector<HTMLButtonElement>('[data-mini-action]')?.click();
      else if (director.fastGameActive()) director.fastGameAction();
      else internal.primaryAction();
    },
    holdAndRelease(pointerId = 91): void {
      const button = root.querySelector<HTMLButtonElement>('[data-mini-action]');
      if (!button) return;
      button.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerId }));
      window.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerId }));
    },
    snapshot(): Record<string, unknown> {
      if (director.beerPongActive()) return director.beerPongSnapshot();
      if (director.fastGameActive()) return director.fastGameSnapshot();
      return minigameHardeningSnapshot(director);
    },
  };
}

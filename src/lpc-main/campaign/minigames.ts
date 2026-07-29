import {
  MinigameDirector as EnhancedMinigameDirector,
  activeAssist,
  difficultyLabel,
  type MiniGameContext,
  type MiniGameId,
  type MiniGameOutcome,
  type MiniGameQuality,
} from './minigamesV2';
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

export { activeAssist, difficultyLabel };
export type { MiniGameContext, MiniGameId, MiniGameOutcome, MiniGameQuality };

export class MinigameDirector extends EnhancedMinigameDirector {
  constructor(root: HTMLElement, onOutcome: (outcome: MiniGameOutcome) => void) {
    super(
      root,
      (outcome) => {
        stageMinigameOutcome(outcome);
        applyMinigameRuntimeEffects(outcome);
        onOutcome(outcome);
      },
      currentMinigameContext,
    );

    installMinigameVisuals(root);
    exposeSmokeDiagnostics(this, root);
  }
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
    begin(): void { root.querySelector<HTMLButtonElement>('[data-mini-start]')?.click(); },
    close(): void { root.querySelector<HTMLButtonElement>('[data-mini-close]')?.click(); },
    skipCountdown(): void { if (internal.runtime) internal.runtime.countdown = 0; },
    setState(values: Record<string, unknown>): void { if (internal.runtime) Object.assign(internal.runtime.state, values); },
    action(): void { internal.primaryAction(); },
    holdAndRelease(pointerId = 91): void {
      const button = root.querySelector<HTMLButtonElement>('[data-mini-action]');
      if (!button) return;
      button.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerId }));
      window.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerId }));
    },
    snapshot(): Record<string, unknown> { return minigameHardeningSnapshot(director); },
  };
}

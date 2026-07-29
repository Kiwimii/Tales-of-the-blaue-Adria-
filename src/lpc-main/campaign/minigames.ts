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
  }
}

import type { GameSnapshot } from '../../game/types';
import { campaignMeta } from './metaStore';
import { applyDialogueRuntimeEffects } from './campaignRuntime';
import {
  dialogueCharacterSummary,
  dialogueChoices,
  dialogueOpening,
  resolveDialogueAction as resolveDialogueActionV2,
  type DialogueAction,
  type DialogueChoice,
  type DialogueResolution,
} from './dialogueV2';

export { dialogueCharacterSummary, dialogueChoices, dialogueOpening };
export type { DialogueAction, DialogueChoice, DialogueResolution };

export function resolveDialogueAction(
  characterId: string,
  action: DialogueAction,
  snapshot: GameSnapshot,
  random: () => number = Math.random,
): DialogueResolution {
  const resolution = resolveDialogueActionV2(characterId, action, snapshot, campaignMeta.snapshot(), random);
  applyDialogueRuntimeEffects(characterId, resolution);
  if (resolution.followUp) resolution.text = `${resolution.text}<hr><small>${resolution.followUp}</small>`;
  return resolution;
}

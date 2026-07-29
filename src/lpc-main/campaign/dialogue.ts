import type { GameSnapshot } from '../../game/types';
import { campaignMeta } from './metaStore';
import { applyDialogueRuntimeEffects } from './campaignRuntime';
import {
  applyAuthorityDialogueResolution,
  authorityDialogueStateLine,
  installAuthorityOverhaul,
} from './authorityOverhaul';
import {
  dialogueCharacterSummary,
  dialogueChoices,
  dialogueOpening as dialogueOpeningV2,
  resolveDialogueAction as resolveDialogueActionV2,
  type DialogueAction,
  type DialogueChoice,
  type DialogueResolution,
} from './dialogueV2';

installAuthorityOverhaul();

export { dialogueCharacterSummary, dialogueChoices };
export type { DialogueAction, DialogueChoice, DialogueResolution };

export function dialogueOpening(characterId: string, snapshot: GameSnapshot, meta = campaignMeta.snapshot()): string {
  const opening = dialogueOpeningV2(characterId, snapshot, meta);
  const authorityState = authorityDialogueStateLine(characterId, snapshot, meta);
  return authorityState ? `${opening} ${authorityState}` : opening;
}

export function resolveDialogueAction(
  characterId: string,
  action: DialogueAction,
  snapshot: GameSnapshot,
  random: () => number = Math.random,
): DialogueResolution {
  const meta = campaignMeta.snapshot();
  const baseResolution = resolveDialogueActionV2(characterId, action, snapshot, meta, random);
  const resolution = applyAuthorityDialogueResolution(characterId, action, baseResolution) as DialogueResolution;
  applyDialogueRuntimeEffects(characterId, resolution);
  if (resolution.followUp) resolution.text = `${resolution.text}<hr><small>${resolution.followUp}</small>`;
  return resolution;
}

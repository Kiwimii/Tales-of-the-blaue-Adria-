import { ARRIVAL_POSITIONS, arrivalStage, arrivalTarget } from './arrivalQuest';
import type { GameSnapshot } from './types';

export type QuestNavigationState = Pick<GameSnapshot, 'flags' | 'inventory' | 'quests'>;
export type ReservationBoardState = 'needs-documents' | 'available' | 'solved' | 'archive';

export const QUEST_MARKER_VERTICAL_OFFSET = 38;
export const QUEST_MARKER_BOB_DISTANCE = 8;
export const RESERVATION_BOARD_INTERACTION_RADIUS = 112;
export const RESERVATION_BOARD_TAP_RADIUS = 145;

export function questMarkerAnchor(state: QuestNavigationState): { x: number; y: number } {
  const target = arrivalTarget(state);
  return { x: target.x, y: target.y - QUEST_MARKER_VERTICAL_OFFSET };
}

export function reservationBoardState(state: QuestNavigationState): ReservationBoardState {
  if (state.quests.entry?.status === 'completed' || state.flags.firstBeerOpened) return 'archive';
  if (!state.flags.arrivalDocumentsFound) return 'needs-documents';
  if (state.flags.reservationSolved) return 'solved';
  return 'available';
}

export function activeArrivalInteractionId(state: QuestNavigationState): string | null {
  switch (arrivalStage(state)) {
    case 0: return 'arrival-trunk';
    case 1: return 'arrival-board';
    case 2: return 'npc-gundula-story';
    case 3: return 'npc-uli-story';
    case 4: return 'arrival-debate';
    case 5: return 'arrival-park-car';
    case 6: return 'arrival-power';
    case 7:
      if (!state.flags.arrivalDrinksUnloaded) return 'arrival-unload-drinks';
      if (!state.flags.arrivalTentsUnloaded) return 'arrival-unload-tents';
      return 'arrival-unload-cable';
    case 8: return 'arrival-first-beer';
    default: return null;
  }
}

export function reservationBoardPosition(): { x: number; y: number } {
  return { ...ARRIVAL_POSITIONS.reservationBoard };
}

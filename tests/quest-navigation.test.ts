import { describe, expect, it } from 'vitest';
import { ARRIVAL_POSITIONS } from '../src/game/arrivalQuest';
import {
  QUEST_MARKER_VERTICAL_OFFSET,
  RESERVATION_BOARD_INTERACTION_RADIUS,
  RESERVATION_BOARD_TAP_RADIUS,
  activeArrivalInteractionId,
  questMarkerAnchor,
  reservationBoardPosition,
  reservationBoardState,
} from '../src/game/questNavigation';
import type { GameSnapshot } from '../src/game/types';

function state(flags: Record<string, boolean> = {}, status: 'active' | 'completed' = 'active'): GameSnapshot {
  return {
    version: 3,
    mode: 'world',
    profile: null,
    prologue: { introSeen: true, shoppingComplete: true, spent: 0 },
    day: 1,
    minutes: 420,
    money: 0,
    needs: { energy: 100, hunger: 0, thirst: 0, bladder: 0, alcohol: 0, highness: 0, hangover: 0, courage: 20 },
    metrics: { dignity: 60, chaos: 0, reputation: 0, momentum: 0 },
    inventory: {},
    team: [],
    relationships: {},
    quests: { entry: { status, stage: status === 'completed' ? 99 : 0 } },
    activeQuest: status === 'active' ? 'entry' : null,
    flags,
    encounter: null,
    chronicle: [],
    worldPosition: { x: 650, y: 1590 },
    currentInterior: null,
    activityResults: {},
    clockLabel: '07:00',
    phaseLabel: 'Morgen',
    conditionLabel: 'Stabil',
    currentObjective: '',
  };
}

describe('arrival quest navigation reliability', () => {
  it('anchors the marker at the current world target without including animation drift', () => {
    const documents = state({ arrivalDocumentsFound: true });
    const board = reservationBoardPosition();
    expect(questMarkerAnchor(documents)).toEqual({ x: board.x, y: board.y - QUEST_MARKER_VERTICAL_OFFSET });

    const gundula = state({ arrivalDocumentsFound: true, reservationSolved: true });
    expect(questMarkerAnchor(gundula)).toEqual({ x: ARRIVAL_POSITIONS.gundula.x, y: ARRIVAL_POSITIONS.gundula.y - QUEST_MARKER_VERTICAL_OFFSET });
  });

  it('uses a generous blackboard interaction and direct-tap range', () => {
    const documents = state({ arrivalDocumentsFound: true });
    expect(activeArrivalInteractionId(documents)).toBe('arrival-board');
    expect(RESERVATION_BOARD_INTERACTION_RADIUS).toBeGreaterThanOrEqual(140);
    expect(RESERVATION_BOARD_TAP_RADIUS).toBeGreaterThan(RESERVATION_BOARD_INTERACTION_RADIUS);
  });

  it('provides a visible board presentation for every quest state', () => {
    expect(reservationBoardState(state())).toBe('needs-documents');
    expect(reservationBoardState(state({ arrivalDocumentsFound: true }))).toBe('available');
    expect(reservationBoardState(state({ arrivalDocumentsFound: true, reservationSolved: true }))).toBe('solved');
    expect(reservationBoardState(state({}, 'completed'))).toBe('archive');
  });

  it('tracks the ordered unloading target instead of a completed cargo point', () => {
    const unloading = state({
      powerAccessOrganized: true,
      arrivalDrinksUnloaded: true,
    });
    expect(activeArrivalInteractionId(unloading)).toBe('arrival-unload-tents');
    expect(questMarkerAnchor(unloading)).toEqual({
      x: ARRIVAL_POSITIONS.tents.x,
      y: ARRIVAL_POSITIONS.tents.y - QUEST_MARKER_VERTICAL_OFFSET,
    });
  });
});

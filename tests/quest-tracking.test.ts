import { describe, expect, it } from 'vitest';
import { FRIEND_IDS, INITIAL_QUESTS } from '../src/game/content';
import {
  activeQuestIds,
  currentTrackedQuestId,
  questDistanceMetres,
  questTrackingTarget,
  type QuestTrackingState,
} from '../src/game/questTracking';
import { WORLD_ACTIVITY_CATALOG } from '../src/game/worldActivityCatalog';

function state(overrides: Partial<QuestTrackingState> = {}): QuestTrackingState {
  return {
    quests: structuredClone(INITIAL_QUESTS),
    activeQuest: 'entry',
    flags: {},
    needs: {
      energy: 70, hunger: 20, thirst: 20, bladder: 10, alcohol: 0, highness: 0, hangover: 0, courage: 40,
    },
    inventory: {},
    ...overrides,
  };
}

describe('quest tracking', () => {
  it('uses the active running quest when no explicit preference exists', () => {
    const snapshot = state();
    expect(activeQuestIds(snapshot)).toEqual(['entry']);
    expect(currentTrackedQuestId(snapshot)).toBe('entry');
  });

  it('moves the entry target through the actual arrival stages', () => {
    const start = questTrackingTarget(state())!;
    expect(start.targetLabel).toBe('Kofferraum');

    const gundula = questTrackingTarget(state({
      flags: { arrivalDocumentsFound: true, reservationSolved: true },
    }))!;
    expect(gundula.targetLabel).toBe('Gundula');

    const power = questTrackingTarget(state({
      flags: {
        arrivalDocumentsFound: true,
        reservationSolved: true,
        gundulaConvinced: true,
        uliInspectionPassed: true,
        entryDebateWon: true,
        carParkedAtTaucherplatz: true,
      },
    }))!;
    expect(power.targetLabel).toBe('Stromkasten');
  });

  it('points reunion at the next friend not yet found', () => {
    const quests = structuredClone(INITIAL_QUESTS);
    quests.entry.status = 'completed';
    quests.reunion.status = 'active';
    const flags = Object.fromEntries(FRIEND_IDS.slice(0, 2).map((id) => [`met-${id}`, true]));
    const target = questTrackingTarget(state({ quests, activeQuest: 'reunion', flags }))!;
    expect(target.questId).toBe('reunion');
    expect(target.targetLabel).toContain(FRIEND_IDS[2].charAt(0).toUpperCase());
    expect(target.objective).toContain(`2/${FRIEND_IDS.length}`);
  });

  it('binds battle and minigame quests to their real world activity markers', () => {
    for (const [questId, activityId] of [
      ['rival', 'battle'], ['flip', 'flip-cup'], ['pong', 'beer-pong'], ['flunky', 'flunkyball'],
    ] as const) {
      const quests = structuredClone(INITIAL_QUESTS);
      quests.entry.status = 'completed';
      quests[questId].status = 'active';
      const target = questTrackingTarget(state({ quests, activeQuest: questId }))!;
      const activity = WORLD_ACTIVITY_CATALOG.find((entry) => entry.id === activityId)!;
      expect(target.x).toBe(activity.x);
      expect(target.y).toBe(activity.y);
      expect(target.targetLabel).toBe(activity.label);
    }
  });

  it('reports readable approximate metres instead of raw world pixels', () => {
    expect(questDistanceMetres({ x: 0, y: 0 }, { x: 300, y: 400 })).toBe(100);
  });
});

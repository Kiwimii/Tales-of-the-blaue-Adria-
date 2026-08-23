import { describe, expect, it } from 'vitest';
import {
  ARRIVAL_QUEST,
  REUNION_IDS,
  completeCampfire,
  completeQuestInteraction,
  createDefaultProgress,
  currentObjective,
  isGateOpen,
  loadProgress,
  meetFriend,
  normalizeProgress,
  recordActivity,
} from '../src/third-person/progression';

describe('third-person progression', () => {
  it('keeps the arrival quest strictly sequential and opens the gate only after authority', () => {
    const progress = createDefaultProgress(1);
    expect(currentObjective(progress).id).toBe('trunk');
    expect(completeQuestInteraction(progress, 'gundula')).toBe(false);
    expect(isGateOpen(progress)).toBe(false);

    expect(completeQuestInteraction(progress, 'trunk')).toBe(true);
    expect(completeQuestInteraction(progress, 'reservationBoard')).toBe(true);
    expect(isGateOpen(progress)).toBe(false);
    expect(completeQuestInteraction(progress, 'gundula')).toBe(true);
    expect(isGateOpen(progress)).toBe(true);
    expect(currentObjective(progress).id).toBe('taucherplatz');
  });

  it('moves from arrival through five reunions to the campfire and free roaming', () => {
    const progress = createDefaultProgress();
    for (const objective of ARRIVAL_QUEST) expect(completeQuestInteraction(progress, objective.id)).toBe(true);
    expect(currentObjective(progress).targetId).toBe(REUNION_IDS[0]);

    for (const id of REUNION_IDS) {
      expect(meetFriend(progress, id)).toBe(true);
      expect(meetFriend(progress, id)).toBe(false);
    }
    expect(currentObjective(progress).id).toBe('campfire');
    expect(completeCampfire(progress)).toBe(true);
    expect(completeCampfire(progress)).toBe(false);
    expect(currentObjective(progress).id).toBe('free-roam');
  });

  it('sanitizes corrupt saves instead of trusting browser storage', () => {
    const progress = normalizeProgress({
      version: 99,
      questIndex: 999,
      completedInteractions: ['trunk', 'trunk', 7],
      metFriends: ['andre', 'andre', 'not-a-friend'],
      player: { x: Number.NaN, z: 2, yaw: 1 },
      activityResults: { beerPong: { attempts: -4, best: 800, completed: 'yes' } },
    }, 17);
    expect(progress.version).toBe(1);
    expect(progress.questIndex).toBe(ARRIVAL_QUEST.length);
    expect(progress.completedInteractions).toEqual(['trunk']);
    expect(progress.metFriends).toEqual(['andre']);
    expect(progress.player).toBeNull();
    expect(progress.activityResults.beerPong).toEqual({ attempts: 0, best: 100, completed: true });
  });

  it('recovers from invalid JSON and tracks repeatable activity best scores', () => {
    const storage = { getItem: () => '{broken' } as Pick<Storage, 'getItem'>;
    const progress = loadProgress(storage, 42);
    expect(progress.updatedAt).toBe(42);
    expect(recordActivity(progress, 'beerPong', 52)).toEqual({ attempts: 1, best: 52, completed: false });
    expect(recordActivity(progress, 'beerPong', 83)).toEqual({ attempts: 2, best: 83, completed: true });
    expect(recordActivity(progress, 'beerPong', 60)).toEqual({ attempts: 3, best: 83, completed: true });
  });
});

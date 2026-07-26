import { describe, expect, it } from 'vitest';
import {
  EXPANDED_WORLD_HEIGHT,
  EXPANDED_WORLD_WIDTH,
  WORLD_REGIONS,
  completedGameCount,
  countFoundFriends,
  fallbackSpawn,
  isRegionUnlocked,
  regionAt,
  unlockedRegionIds,
  validateExpandedWorld,
  type WorldProgressState,
} from '../src/game/worldV2';

function progress(flags: Record<string, boolean> = {}, paperStatus = 'locked'): WorldProgressState {
  return {
    flags,
    quests: { paper: { status: paperStatus, stage: 0 } },
  };
}

describe('expanded world layout', () => {
  it('keeps all configured content inside a valid unique region', () => {
    expect(EXPANDED_WORLD_WIDTH).toBeGreaterThan(2000);
    expect(EXPANDED_WORLD_HEIGHT).toBeGreaterThan(1500);
    expect(new Set(WORLD_REGIONS.map((region) => region.id)).size).toBe(WORLD_REGIONS.length);
    expect(validateExpandedWorld()).toEqual([]);
  });

  it('assigns representative positions to the intended areas', () => {
    expect(regionAt(830, 1580).id).toBe('arrival');
    expect(regionAt(700, 1000).id).toBe('central');
    expect(regionAt(700, 300).id).toBe('north');
    expect(regionAt(1700, 500).id).toBe('festival');
    expect(regionAt(2250, 650).id).toBe('beach');
    expect(regionAt(1700, 1400).id).toBe('woodland');
    expect(regionAt(2300, 1450).id).toBe('cove');
  });
});

describe('progressive area unlocks', () => {
  it('starts safely at reception and opens the central camp through the entry quest', () => {
    const locked = progress();
    expect(unlockedRegionIds(locked)).toEqual(['arrival']);
    expect(fallbackSpawn(locked)).toEqual({ x: 830, y: 1580 });

    const admitted = progress({ gateOpen: true });
    expect(isRegionUnlocked('central', admitted)).toBe(true);
    expect(fallbackSpawn(admitted)).toEqual({ x: 830, y: 1215 });
  });

  it('opens new regions in reachable steps as friends are found', () => {
    const flags: Record<string, boolean> = { gateOpen: true };
    for (const id of ['andre', 'rene', 'lars']) flags[`met-${id}`] = true;
    expect(countFoundFriends(progress(flags))).toBe(3);
    expect(isRegionUnlocked('north', progress(flags))).toBe(true);

    for (const id of ['danny', 'gregor']) flags[`met-${id}`] = true;
    expect(isRegionUnlocked('festival', progress(flags))).toBe(true);

    flags['met-masl'] = true;
    expect(isRegionUnlocked('beach', progress(flags))).toBe(true);

    flags['met-felix'] = true;
    expect(isRegionUnlocked('woodland', progress(flags))).toBe(true);

    flags['met-schubert'] = true;
    expect(isRegionUnlocked('cove', progress(flags))).toBe(true);
  });

  it('also supports activity-based alternative unlock routes', () => {
    const duel = progress({ gateOpen: true, firstBattleWon: true });
    expect(isRegionUnlocked('north', duel)).toBe(true);
    expect(isRegionUnlocked('beach', duel)).toBe(true);

    const paper = progress({ gateOpen: true }, 'completed');
    expect(isRegionUnlocked('festival', paper)).toBe(true);

    const games = progress({ gateOpen: true, flipCupWon: true, beerPongWon: true });
    expect(completedGameCount(games)).toBe(2);
    expect(isRegionUnlocked('woodland', games)).toBe(true);
    expect(isRegionUnlocked('cove', { ...games, flags: { ...games.flags, flunkyballWon: true } })).toBe(true);
  });
});

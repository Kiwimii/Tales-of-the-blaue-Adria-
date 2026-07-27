import { describe, expect, it } from 'vitest';
import { WORLD_ACTIVITY_CATALOG } from '../src/game/worldActivityCatalog';
import { regionAt } from '../src/game/worldV2';

const expectedActivities = [
  ['battle', 'battle'],
  ['flip-cup', 'flip-cup'],
  ['beer-pong', 'beer-pong'],
  ['flunkyball', 'flunkyball'],
  ['masl-hole', 'masl-hole'],
  ['tent-hedge-relief', 'hedge-pee'],
] as const;

describe('world activity catalog', () => {
  it('exposes every registered game and special interaction from the world', () => {
    for (const [id, sceneKey] of expectedActivities) {
      expect(WORLD_ACTIVITY_CATALOG).toContainEqual(expect.objectContaining({ id, sceneKey }));
    }
    expect(new Set(WORLD_ACTIVITY_CATALOG.map((activity) => activity.id)).size).toBe(WORLD_ACTIVITY_CATALOG.length);
  });

  it('places each activity inside its declared unlocked region', () => {
    for (const activity of WORLD_ACTIVITY_CATALOG) {
      expect(regionAt(activity.x, activity.y).id, activity.id).toBe(activity.regionId);
      expect(activity.radius, activity.id).toBeGreaterThanOrEqual(90);
    }
  });

  it('keeps the hedge interaction beside the tent row and the beach game at the lake', () => {
    const hedge = WORLD_ACTIVITY_CATALOG.find((activity) => activity.id === 'tent-hedge-relief')!;
    const flunkyball = WORLD_ACTIVITY_CATALOG.find((activity) => activity.id === 'flunkyball')!;
    expect(hedge.x).toBeGreaterThan(560);
    expect(hedge.y).toBeGreaterThanOrEqual(930);
    expect(flunkyball.x).toBeGreaterThanOrEqual(1950);
  });
});

import { describe, expect, it } from 'vitest';
import { TENT_HEDGE_SEGMENTS } from '../src/game/advancedContent';
import { ARRIVAL_POSITIONS } from '../src/game/arrivalQuest';
import {
  CAMPFIRE_POSITION,
  WALKABLE_CORRIDORS,
  applyRealisticWorldLayout,
  findNavigationBlockers,
} from '../src/game/worldRealism';
import { EXPANDED_NPCS, EXPANDED_WORLD_OBJECTS } from '../src/game/worldV2';

describe('logical world access', () => {
  it('keeps the driveway, central route and service path free of static blockers', () => {
    applyRealisticWorldLayout();
    expect(findNavigationBlockers()).toEqual([]);
    expect(findNavigationBlockers([...EXPANDED_WORLD_OBJECTS, ...TENT_HEDGE_SEGMENTS], EXPANDED_NPCS)).toEqual([]);
  });

  it('leaves a clearly wider opening around the barrier than the barrier itself', () => {
    applyRealisticWorldLayout();
    const driveway = WALKABLE_CORRIDORS.find((corridor) => corridor.id === 'arrival-driveway')!.bounds;
    const left = EXPANDED_WORLD_OBJECTS.find((object) => object.id === 'parking-fence-left')!;
    const right = EXPANDED_WORLD_OBJECTS.find((object) => object.id === 'parking-fence-right')!;
    expect(left.x + left.width).toBeLessThanOrEqual(driveway.x);
    expect(right.x).toBeGreaterThanOrEqual(driveway.x + driveway.width);
    expect(right.x - (left.x + left.width)).toBeGreaterThan(200);
  });

  it('places Gundula and Uli beside the driveway instead of inside it', () => {
    const driveway = WALKABLE_CORRIDORS.find((corridor) => corridor.id === 'arrival-driveway')!.bounds;
    for (const position of [ARRIVAL_POSITIONS.gundula, ARRIVAL_POSITIONS.uli]) {
      const inside = position.x >= driveway.x
        && position.x <= driveway.x + driveway.width
        && position.y >= driveway.y
        && position.y <= driveway.y + driveway.height;
      expect(inside).toBe(false);
    }
  });

  it('moves the campfire away from the main north-south walking line', () => {
    const central = WALKABLE_CORRIDORS.find((corridor) => corridor.id === 'central-main-path')!.bounds;
    expect(CAMPFIRE_POSITION.x).toBeGreaterThan(central.x + central.width);
  });
});

import { beforeAll, describe, expect, it } from 'vitest';
import { installAdvancedContent } from '../src/game/advancedContent';
import { ARRIVAL_POSITIONS } from '../src/game/arrivalQuest';
import { applyCampgroundBlueprint } from '../src/game/campgroundBlueprint';
import {
  CAMPFIRE_POSITION,
  WALKABLE_CORRIDORS,
  applyRealisticWorldLayout,
  findNavigationBlockers,
} from '../src/game/worldRealism';
import { EXPANDED_WORLD_OBJECTS } from '../src/game/worldV2';

beforeAll(() => {
  installAdvancedContent();
  applyRealisticWorldLayout();
  applyCampgroundBlueprint();
});

describe('logical world access', () => {
  it('keeps the driveway, main rows and service paths free of static blockers', () => {
    expect(findNavigationBlockers()).toEqual([]);
    expect(EXPANDED_WORLD_OBJECTS.filter((object) => object.id === 'tent-hedge-west' || object.id === 'tent-hedge-east')).toHaveLength(2);
  });

  it('frames the arrival drive with fences instead of closing it', () => {
    const driveway = WALKABLE_CORRIDORS.find((corridor) => corridor.id === 'arrival-driveway')!.bounds;
    const left = EXPANDED_WORLD_OBJECTS.find((object) => object.id === 'parking-fence-left')!;
    const right = EXPANDED_WORLD_OBJECTS.find((object) => object.id === 'parking-fence-right')!;
    expect(left.x + left.width).toBeLessThanOrEqual(driveway.x);
    expect(right.x).toBeGreaterThanOrEqual(driveway.x + driveway.width);
    expect(right.x - (left.x + left.width)).toBeGreaterThan(350);
  });

  it('places Gundula and Uli in the reception court beside the drive', () => {
    const driveway = WALKABLE_CORRIDORS.find((corridor) => corridor.id === 'arrival-driveway')!.bounds;
    for (const position of [ARRIVAL_POSITIONS.gundula, ARRIVAL_POSITIONS.uli]) {
      const inside = position.x >= driveway.x
        && position.x <= driveway.x + driveway.width
        && position.y >= driveway.y
        && position.y <= driveway.y + driveway.height;
      expect(inside).toBe(false);
      expect(position.x).toBeGreaterThan(driveway.x + driveway.width);
    }
  });

  it('places the campfire beside the tent row and east of the main walking line', () => {
    const central = WALKABLE_CORRIDORS.find((corridor) => corridor.id === 'central-main-path')!.bounds;
    expect(CAMPFIRE_POSITION.x).toBeGreaterThan(central.x + central.width);
    expect(CAMPFIRE_POSITION.y).toBeGreaterThan(980);
    expect(CAMPFIRE_POSITION.y).toBeLessThan(1280);
  });
});

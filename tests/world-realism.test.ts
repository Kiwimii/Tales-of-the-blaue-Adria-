import { describe, expect, it } from 'vitest';
import {
  CAMPFIRE_POSITION,
  WATER_COLLIDERS,
  applyRealisticWorldLayout,
  collisionFootprint,
  isPointInWater,
  isPointOnDock,
  validateRealisticLayout,
  worldDepth,
} from '../src/game/worldRealism';
import { EXPANDED_NPCS, EXPANDED_WORLD_OBJECTS, LANDMARKS } from '../src/game/worldV2';

describe('realistic world layout', () => {
  it('keeps buildings, characters and landmarks out of unintended water', () => {
    applyRealisticWorldLayout();
    expect(validateRealisticLayout()).toEqual([]);

    const lifeguard = EXPANDED_WORLD_OBJECTS.find((object) => object.id === 'lifeguard');
    const schima = EXPANDED_NPCS.find((npc) => npc.id === 'schima');
    const lakeLookout = LANDMARKS.find((landmark) => landmark.id === 'lake-lookout');
    expect(lifeguard && lifeguard.x + lifeguard.width).toBeLessThanOrEqual(2250);
    expect(schima && isPointInWater(schima.x, schima.y)).toBe(false);
    expect(lakeLookout && isPointOnDock(lakeLookout.x, lakeLookout.y)).toBe(true);
  });

  it('places the fire in a clear shared area instead of inside a tent', () => {
    applyRealisticWorldLayout();
    const tents = EXPANDED_WORLD_OBJECTS.filter((object) => object.kind === 'tent');
    for (const tent of tents) {
      const footprint = collisionFootprint(tent);
      const nearestX = Math.max(footprint.x, Math.min(CAMPFIRE_POSITION.x, footprint.x + footprint.width));
      const nearestY = Math.max(footprint.y, Math.min(CAMPFIRE_POSITION.y, footprint.y + footprint.height));
      expect(Math.hypot(CAMPFIRE_POSITION.x - nearestX, CAMPFIRE_POSITION.y - nearestY))
        .toBeGreaterThanOrEqual(CAMPFIRE_POSITION.safeRadius);
    }
  });

  it('blocks open water while preserving only the two dock corridors', () => {
    expect(WATER_COLLIDERS).toHaveLength(6);
    expect(isBlocked(2570, 535)).toBe(true);
    expect(isBlocked(2460, 535)).toBe(false);
    expect(isPointOnDock(2460, 535)).toBe(true);
    expect(isBlocked(2500, 1425)).toBe(true);
    expect(isBlocked(2340, 1425)).toBe(false);
    expect(isPointOnDock(2340, 1425)).toBe(true);
  });

  it('uses narrow physical footprints and monotonic depth sorting', () => {
    applyRealisticWorldLayout();
    const tree = EXPANDED_WORLD_OBJECTS.find((object) => object.id === 'central-tree-1');
    const building = EXPANDED_WORLD_OBJECTS.find((object) => object.id === 'reception');
    expect(tree).toBeDefined();
    expect(building).toBeDefined();
    expect(collisionFootprint(tree!).width).toBeLessThan(tree!.width / 3);
    expect(collisionFootprint(building!).height).toBeLessThan(building!.height * 0.6);
    expect(worldDepth(1500)).toBeGreaterThan(worldDepth(500));
  });
});

function isBlocked(x: number, y: number): boolean {
  return WATER_COLLIDERS.some((bounds) => (
    x >= bounds.x
    && x <= bounds.x + bounds.width
    && y >= bounds.y
    && y <= bounds.y + bounds.height
  ));
}

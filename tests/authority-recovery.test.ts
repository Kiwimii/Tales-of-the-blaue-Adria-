import { beforeAll, describe, expect, it } from 'vitest';
import { applyCampgroundBlueprint } from '../src/game/campgroundBlueprint';
import { NPC_PLACEMENTS } from '../src/game/aerialCampgroundPlan';
import { recoveryPointOutsideNpcCluster } from '../src/game/scenes/RealisticWorldScene';

beforeAll(() => applyCampgroundBlueprint());

describe('authority conversation recovery', () => {
  it('moves a player away from Gundula and Uli before resetting the physics body', () => {
    const start = {
      x: (NPC_PLACEMENTS.gundula.x + NPC_PLACEMENTS.uli.x) / 2,
      y: (NPC_PLACEMENTS.gundula.y + NPC_PLACEMENTS.uli.y) / 2,
    };
    const recovered = recoveryPointOutsideNpcCluster(start.x, start.y);
    const distanceToGundula = Math.hypot(recovered.x - NPC_PLACEMENTS.gundula.x, recovered.y - NPC_PLACEMENTS.gundula.y);
    const distanceToUli = Math.hypot(recovered.x - NPC_PLACEMENTS.uli.x, recovered.y - NPC_PLACEMENTS.uli.y);

    expect(distanceToGundula).toBeGreaterThan(80);
    expect(distanceToUli).toBeGreaterThan(80);
    expect(recovered.x).not.toBe(start.x);
  });

  it('does not move the player when no NPC collision cluster is nearby', () => {
    expect(recoveryPointOutsideNpcCluster(2100, 400)).toEqual({ x: 2100, y: 400 });
  });
});

import { describe, expect, it } from 'vitest';
import { ENTRANCE_PLACEMENTS, LANDMARK_PLACEMENTS, NPC_PLACEMENTS } from '../src/game/aerialCampgroundPlan';
import { expectedInteractionAnchor, findWorldPlacementIssues, nearestRoadDistance } from '../src/game/worldPlacementAudit';
import { WORLD_ACTIVITY_CATALOG } from '../src/game/worldActivityCatalog';

describe('world placement and trigger audit', () => {
  it('keeps every canonical object host, NPC, entrance and activity logically reachable', () => {
    expect(findWorldPlacementIssues()).toEqual([]);
  });

  it('resolves activity, NPC, entrance, landmark and story anchors from one plan', () => {
    expect(expectedInteractionAnchor('flip-cup')).toEqual(expect.objectContaining({ kind: 'activity', x: 1510, y: 560 }));
    expect(expectedInteractionAnchor('npc-gundula')).toEqual(expect.objectContaining({ kind: 'npc', ...NPC_PLACEMENTS.gundula }));
    expect(expectedInteractionAnchor('home-door')).toEqual(expect.objectContaining({ kind: 'entrance', ...ENTRANCE_PLACEMENTS['home-door'] }));
    expect(expectedInteractionAnchor('landmark-campfire')).toEqual(expect.objectContaining({ kind: 'landmark', ...LANDMARK_PLACEMENTS.campfire }));
    expect(expectedInteractionAnchor('arrival-first-beer')).toEqual(expect.objectContaining({ kind: 'story' }));
  });

  it('keeps all activities close to the road network and to their visible host', () => {
    for (const activity of WORLD_ACTIVITY_CATALOG) {
      expect(nearestRoadDistance(activity), activity.id).toBeLessThanOrEqual(105);
      expect(activity.host.maxDistance, activity.id).toBeGreaterThanOrEqual(50);
    }
  });
});

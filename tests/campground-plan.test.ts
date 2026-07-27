import { beforeAll, describe, expect, it } from 'vitest';
import { installAdvancedContent } from '../src/game/advancedContent';
import { applyCampgroundAccessPlan } from '../src/game/campgroundAccessPlan';
import {
  CAMP_ROADS,
  CAMP_ROAD_NODES,
  applyCampgroundPlanLayout,
  planPlacement,
  roadBounds,
  validateCampgroundPlan,
} from '../src/game/campgroundPlan';
import { EXPANDED_ENTRANCES, EXPANDED_NPCS, EXPANDED_WORLD_OBJECTS } from '../src/game/worldV2';

beforeAll(() => {
  installAdvancedContent();
  applyCampgroundPlanLayout();
  applyCampgroundAccessPlan();
});

describe('central campground plan', () => {
  it('builds one connected, orthogonal road graph', () => {
    expect(CAMP_ROADS.length).toBeGreaterThanOrEqual(24);
    for (const road of CAMP_ROADS) {
      const from = CAMP_ROAD_NODES[road.from];
      const to = CAMP_ROAD_NODES[road.to];
      expect(from.x === to.x || from.y === to.y, `${road.id} must be orthogonal`).toBe(true);
      expect(roadBounds(road).width).toBeGreaterThanOrEqual(road.width);
      expect(roadBounds(road).height).toBeGreaterThanOrEqual(road.width);
    }
    expect(validateCampgroundPlan()).toEqual([]);
  });

  it('keeps the gate, main spine and central camp in a readable hierarchy', () => {
    expect(CAMP_ROAD_NODES.entrance.x).toBe(CAMP_ROAD_NODES.gate.x);
    expect(CAMP_ROAD_NODES.gate.x).toBe(CAMP_ROAD_NODES.southHub.x);
    expect(CAMP_ROAD_NODES.southHub.x).toBe(CAMP_ROAD_NODES.northHub.x);
    expect(planPlacement('reception')?.x).toBeGreaterThan(CAMP_ROAD_NODES.gate.x + 150);
    expect(planPlacement('sanitary')?.x).toBeLessThan(CAMP_ROAD_NODES.southHub.x - 300);
  });

  it('uses the plan as the shared source for objects, people and entrances', () => {
    const reception = EXPANDED_WORLD_OBJECTS.find((object) => object.id === 'reception');
    const gundula = EXPANDED_NPCS.find((npc) => npc.id === 'gundula');
    const receptionDoor = EXPANDED_ENTRANCES.find((entrance) => entrance.id === 'reception-door');
    expect(reception && planPlacement('reception')).toMatchObject({ x: reception?.x, y: reception?.y });
    expect(gundula && planPlacement('gundula')).toMatchObject({ x: gundula?.x, y: gundula?.y });
    expect(receptionDoor && planPlacement('reception-door')).toMatchObject({ x: receptionDoor?.x, y: receptionDoor?.y });
  });
});

import { beforeAll, describe, expect, it } from 'vitest';
import { installAdvancedContent } from '../src/game/advancedContent';
import {
  AERIAL_FUNCTIONAL_AREAS,
  ARRIVAL_STORY_PLACEMENTS,
  NPC_AREA_ASSIGNMENTS,
  NPC_PLACEMENTS,
  OBJECT_AREA_ASSIGNMENTS,
  OBJECT_PLACEMENTS,
} from '../src/game/aerialCampgroundPlan';
import {
  BLUEPRINT_BEACH_GATE,
  BLUEPRINT_FENCES,
  BLUEPRINT_NODES,
  BLUEPRINT_ROADS,
  BLUEPRINT_SITE_POLYGONS,
  BLUEPRINT_WATER_POLYGONS,
  BLUEPRINT_ZONES,
  applyCampgroundBlueprint,
  blueprintPlacement,
  blueprintRoadBounds,
  validateCampgroundBlueprint,
} from '../src/game/campgroundBlueprint';
import { prepareCampgroundBlueprint } from '../src/game/campgroundBlueprintBootstrap';
import { applyRealisticWorldLayout } from '../src/game/worldRealism';
import { EXPANDED_ENTRANCES, EXPANDED_NPCS, EXPANDED_WORLD_OBJECTS } from '../src/game/worldV2';

beforeAll(() => {
  installAdvancedContent();
  applyRealisticWorldLayout();
  applyCampgroundBlueprint();
  prepareCampgroundBlueprint();
});

describe('logical campground blueprint', () => {
  it('uses one connected orthogonal road network and axis-aligned land parcels', () => {
    expect(BLUEPRINT_ZONES).toHaveLength(7);
    expect(BLUEPRINT_ROADS.length).toBeGreaterThanOrEqual(30);

    for (const road of BLUEPRINT_ROADS) {
      const from = BLUEPRINT_NODES[road.from];
      const to = BLUEPRINT_NODES[road.to];
      expect(from.x === to.x || from.y === to.y).toBe(true);
      expect(blueprintRoadBounds(road).width).toBeGreaterThanOrEqual(road.width);
      expect(blueprintRoadBounds(road).height).toBeGreaterThanOrEqual(road.width);
    }

    for (const polygon of [...BLUEPRINT_SITE_POLYGONS, ...BLUEPRINT_WATER_POLYGONS]) {
      polygon.points.forEach((point, index) => {
        const next = polygon.points[(index + 1) % polygon.points.length];
        expect(point.x === next.x || point.y === next.y).toBe(true);
      });
    }
    expect(validateCampgroundBlueprint()).toEqual([]);
  });

  it('enters from the south through parking and gate with reception beside the court', () => {
    const { entrance, parkingSouth, gate } = BLUEPRINT_NODES;
    const reception = blueprintPlacement('reception-door')!;
    expect(entrance.y).toBeGreaterThan(parkingSouth.y);
    expect(parkingSouth.y).toBeGreaterThan(gate.y);
    expect(reception.x).toBeGreaterThan(gate.x);
    expect(Math.abs(reception.y - gate.y)).toBeLessThan(80);
  });

  it('keeps the Taucherplatz inland and the beach facilities on the lake side of the fence', () => {
    const taucher = ARRIVAL_STORY_PLACEMENTS.taucherplatz;
    const kiosk = OBJECT_PLACEMENTS['beach-kiosk'];
    expect(taucher.x).toBeLessThan(BLUEPRINT_BEACH_GATE.x);
    expect(kiosk.x).toBeGreaterThan(BLUEPRINT_BEACH_GATE.x);
    expect(taucher.x).toBeLessThan(kiosk.x);
  });

  it('keeps a physical campground-beach fence with one clear gate gap', () => {
    expect(BLUEPRINT_FENCES).toHaveLength(2);
    const north = BLUEPRINT_FENCES[0];
    const south = BLUEPRINT_FENCES[1];
    expect(north.y + north.height).toBe(BLUEPRINT_BEACH_GATE.y);
    expect(south.y).toBe(BLUEPRINT_BEACH_GATE.y + BLUEPRINT_BEACH_GATE.height);
    expect(north.x).toBe(south.x);
  });

  it('assigns every planned object and person to a functional area', () => {
    for (const id of Object.keys(OBJECT_PLACEMENTS)) {
      expect(OBJECT_AREA_ASSIGNMENTS[id]).toBeDefined();
      expect(AERIAL_FUNCTIONAL_AREAS[OBJECT_AREA_ASSIGNMENTS[id]]).toBeDefined();
    }
    for (const id of Object.keys(NPC_PLACEMENTS)) {
      expect(NPC_AREA_ASSIGNMENTS[id]).toBeDefined();
      expect(AERIAL_FUNCTIONAL_AREAS[NPC_AREA_ASSIGNMENTS[id]]).toBeDefined();
    }
  });

  it('is the final runtime source for reception staff, objects and entrances', () => {
    const reception = EXPANDED_WORLD_OBJECTS.find((object) => object.id === 'reception');
    const gundula = EXPANDED_NPCS.find((npc) => npc.id === 'gundula');
    const uli = EXPANDED_NPCS.find((npc) => npc.id === 'uli');
    const receptionDoor = EXPANDED_ENTRANCES.find((entrance) => entrance.id === 'reception-door');
    expect(reception).toMatchObject({ x: 1000, y: 1430, width: 260, height: 155 });
    expect(gundula).toMatchObject(blueprintPlacement('gundula')!);
    expect(uli).toMatchObject(blueprintPlacement('uli')!);
    expect(receptionDoor).toMatchObject(blueprintPlacement('reception-door')!);
  });
});

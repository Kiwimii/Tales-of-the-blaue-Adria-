import { beforeAll, describe, expect, it } from 'vitest';
import { installAdvancedContent } from '../src/game/advancedContent';
import { ARRIVAL_STORY_PLACEMENTS, OBJECT_PLACEMENTS } from '../src/game/aerialCampgroundPlan';
import {
  BLUEPRINT_BEACH_GATE,
  BLUEPRINT_FENCES,
  BLUEPRINT_NODES,
  BLUEPRINT_ROADS,
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

describe('aerial campground blueprint', () => {
  it('uses one connected road network that follows the irregular site instead of a rectangle grid', () => {
    expect(BLUEPRINT_ZONES).toHaveLength(7);
    expect(BLUEPRINT_ROADS.length).toBeGreaterThanOrEqual(24);
    expect(BLUEPRINT_ROADS.some((road) => {
      const from = BLUEPRINT_NODES[road.from];
      const to = BLUEPRINT_NODES[road.to];
      return from.x !== to.x && from.y !== to.y;
    })).toBe(true);

    for (const road of BLUEPRINT_ROADS) {
      expect(blueprintRoadBounds(road).width).toBeGreaterThanOrEqual(road.width);
      expect(blueprintRoadBounds(road).height).toBeGreaterThanOrEqual(road.width);
    }
    expect(validateCampgroundBlueprint()).toEqual([]);
  });

  it('enters from the north-east through parking and gate to the reception', () => {
    const { entrance, parking, gate } = BLUEPRINT_NODES;
    const reception = blueprintPlacement('reception-door')!;
    expect(entrance.x).toBeGreaterThan(parking.x);
    expect(entrance.y).toBeLessThan(parking.y);
    expect(parking.x).toBeGreaterThan(gate.x);
    expect(parking.y).toBeLessThan(gate.y);
    expect(reception.x).toBeLessThan(gate.x);
    expect(Math.abs(reception.y - gate.y)).toBeLessThan(120);
  });

  it('places the Taucherplatz right and above the beach kiosk on opposite sides of the fence', () => {
    const taucher = ARRIVAL_STORY_PLACEMENTS.taucherplatz;
    const kiosk = OBJECT_PLACEMENTS['beach-kiosk'];
    expect(taucher.x).toBeGreaterThan(kiosk.x);
    expect(taucher.y).toBeLessThan(kiosk.y);
    expect(taucher.x).toBeGreaterThan(BLUEPRINT_BEACH_GATE.x);
    expect(kiosk.x).toBeLessThan(BLUEPRINT_BEACH_GATE.x);
  });

  it('keeps a physical fence between campground and beach with a middle gate gap', () => {
    expect(BLUEPRINT_FENCES).toHaveLength(2);
    const north = BLUEPRINT_FENCES[0];
    const south = BLUEPRINT_FENCES[1];
    expect(north.y + north.height).toBe(BLUEPRINT_BEACH_GATE.y);
    expect(south.y).toBe(BLUEPRINT_BEACH_GATE.y + BLUEPRINT_BEACH_GATE.height);
    expect(north.x).toBe(south.x);
  });

  it('is the final runtime source for reception staff, objects and entrances', () => {
    const reception = EXPANDED_WORLD_OBJECTS.find((object) => object.id === 'reception');
    const gundula = EXPANDED_NPCS.find((npc) => npc.id === 'gundula');
    const uli = EXPANDED_NPCS.find((npc) => npc.id === 'uli');
    const receptionDoor = EXPANDED_ENTRANCES.find((entrance) => entrance.id === 'reception-door');
    expect(reception).toMatchObject({ x: 1655, y: 545 });
    expect(gundula).toMatchObject(blueprintPlacement('gundula')!);
    expect(uli).toMatchObject(blueprintPlacement('uli')!);
    expect(receptionDoor).toMatchObject(blueprintPlacement('reception-door')!);
  });
});

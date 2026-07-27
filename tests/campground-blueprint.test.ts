import { beforeAll, describe, expect, it } from 'vitest';
import { installAdvancedContent } from '../src/game/advancedContent';
import {
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
  prepareCampgroundBlueprint();
  applyCampgroundBlueprint();
});

describe('canonical campground blueprint', () => {
  it('uses one connected orthogonal road hierarchy', () => {
    expect(BLUEPRINT_ZONES).toHaveLength(7);
    expect(BLUEPRINT_ROADS.length).toBeGreaterThanOrEqual(27);
    for (const road of BLUEPRINT_ROADS) {
      const from = BLUEPRINT_NODES[road.from];
      const to = BLUEPRINT_NODES[road.to];
      expect(from.x === to.x || from.y === to.y, `${road.id} must be orthogonal`).toBe(true);
      expect(blueprintRoadBounds(road).width).toBeGreaterThanOrEqual(road.width);
      expect(blueprintRoadBounds(road).height).toBeGreaterThanOrEqual(road.width);
    }
    expect(validateCampgroundBlueprint()).toEqual([]);
  });

  it('keeps a readable main spine from entrance to north camp', () => {
    expect(BLUEPRINT_NODES.entrance.x).toBe(BLUEPRINT_NODES.parking.x);
    expect(BLUEPRINT_NODES.parking.x).toBe(BLUEPRINT_NODES.gate.x);
    expect(BLUEPRINT_NODES.gate.x).toBe(BLUEPRINT_NODES.southHub.x);
    expect(BLUEPRINT_NODES.southHub.x).toBe(BLUEPRINT_NODES.northHub.x);
    expect(BLUEPRINT_NODES.northHub.x).toBe(BLUEPRINT_NODES.northEnd.x);
  });

  it('is the final runtime source for objects, people and entrances', () => {
    const reception = EXPANDED_WORLD_OBJECTS.find((object) => object.id === 'reception');
    const gundula = EXPANDED_NPCS.find((npc) => npc.id === 'gundula');
    const receptionDoor = EXPANDED_ENTRANCES.find((entrance) => entrance.id === 'reception-door');
    expect(reception).toMatchObject(blueprintPlacement('reception')!);
    expect(gundula).toMatchObject(blueprintPlacement('gundula')!);
    expect(receptionDoor).toMatchObject(blueprintPlacement('reception-door')!);
  });
});

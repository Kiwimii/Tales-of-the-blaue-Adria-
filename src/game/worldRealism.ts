import {
  EXPANDED_NPCS,
  EXPANDED_WORLD_OBJECTS,
  LANDMARKS,
  WORLD_REGIONS,
  type Bounds,
  type ExpandedNpc,
  type ExpandedWorldObject,
} from './worldV2';

export const CAMPFIRE_POSITION = { x: 1120, y: 1080, safeRadius: 62 } as const;

export interface NavigationCorridor {
  id: string;
  bounds: Bounds;
  allowKinds?: ExpandedWorldObject['kind'][];
}

export interface ApproachZone {
  id: string;
  bounds: Bounds;
  ownerIds: string[];
}

export const WALKABLE_CORRIDORS: NavigationCorridor[] = [
  { id: 'arrival-driveway', bounds: { x: 845, y: 1300, width: 110, height: 500 } },
  { id: 'central-main-path', bounds: { x: 865, y: 300, width: 70, height: 1000 } },
  { id: 'north-row', bounds: { x: 200, y: 269, width: 1150, height: 62 } },
  { id: 'upper-row', bounds: { x: 200, y: 618, width: 1150, height: 64 } },
  { id: 'middle-row', bounds: { x: 200, y: 917, width: 1150, height: 66 } },
  { id: 'festival-entry', bounds: { x: 1350, y: 620, width: 400, height: 64 } },
  { id: 'festival-side', bounds: { x: 1720, y: 650, width: 60, height: 300 } },
  { id: 'beach-gate', bounds: { x: 1900, y: 624, width: 100, height: 52 } },
  { id: 'beach-north-path', bounds: { x: 1974, y: 375, width: 152, height: 50 } },
  { id: 'service-entry', bounds: { x: 900, y: 1268, width: 850, height: 64 } },
  { id: 'service-side', bounds: { x: 1720, y: 1300, width: 60, height: 150 } },
  { id: 'cove-link', bounds: { x: 1750, y: 1423, width: 450, height: 54 } },
  { id: 'main-dock-approach', bounds: { x: 2100, y: 476, width: 400, height: 48 }, allowKinds: ['dock'] },
  { id: 'cove-dock-approach', bounds: { x: 1950, y: 1425, width: 550, height: 50 }, allowKinds: ['dock'] },
];

export const APPROACH_ZONES: ApproachZone[] = [
  { id: 'reception-door', bounds: { x: 1080, y: 1380, width: 100, height: 70 }, ownerIds: ['reception'] },
  { id: 'sanitary-door', bounds: { x: 155, y: 865, width: 110, height: 90 }, ownerIds: ['sanitary'] },
  { id: 'home-tent-door', bounds: { x: 105, y: 1135, width: 95, height: 85 }, ownerIds: ['home-tent', 'arrival-home-tent'] },
  { id: 'party-tent-door', bounds: { x: 1685, y: 585, width: 130, height: 100 }, ownerIds: ['party'] },
  { id: 'notice-board', bounds: { x: 1225, y: 1315, width: 115, height: 100 }, ownerIds: [] },
];

export const WATER_AREAS: Bounds[] = [
  { x: 2250, y: 0, width: 350, height: 1100 },
  { x: 2220, y: 1100, width: 380, height: 700 },
];

export const WATER_COLLIDERS: Bounds[] = [
  { x: 2250, y: 0, width: 350, height: 460 },
  { x: 2500, y: 460, width: 100, height: 72 },
  { x: 2250, y: 532, width: 350, height: 568 },
  { x: 2220, y: 1100, width: 380, height: 320 },
  { x: 2500, y: 1420, width: 100, height: 65 },
  { x: 2220, y: 1485, width: 380, height: 315 },
];

let applied = false;

/**
 * Compatibility hook retained for older callers. Sprint 83 removes every
 * coordinate override from this layer. The campground blueprint owns all
 * runtime positions; this module only supplies collision and realism rules.
 */
export function applyRealisticWorldLayout(): void {
  if (applied) return;
  applied = true;
}

export function worldDepth(y: number): number {
  return 20 + Math.max(0, Math.min(1800, y)) / 40;
}

export function collisionFootprint(object: ExpandedWorldObject): Bounds {
  const { x, y, width, height, kind } = object;
  switch (kind) {
    case 'tree':
      return { x: x + width * 0.39, y: y + height * 0.68, width: width * 0.22, height: height * 0.28 };
    case 'tent':
      return { x: x + width * 0.15, y: y + height * 0.58, width: width * 0.7, height: height * 0.38 };
    case 'party-tent':
      return { x: x + width * 0.08, y: y + height * 0.6, width: width * 0.84, height: height * 0.32 };
    case 'building':
    case 'kiosk':
    case 'camper':
      return { x: x + width * 0.08, y: y + height * 0.4, width: width * 0.84, height: height * 0.56 };
    case 'stage':
      return { x: x + width * 0.04, y: y + height * 0.46, width: width * 0.92, height: height * 0.5 };
    case 'rock':
      return { x: x + width * 0.12, y: y + height * 0.42, width: width * 0.76, height: height * 0.54 };
    case 'table':
    case 'bench':
      return { x: x + width * 0.06, y: y + height * 0.18, width: width * 0.88, height: height * 0.8 };
    default:
      return { x, y, width, height };
  }
}

export function isPointInWater(x: number, y: number): boolean {
  return WATER_AREAS.some((area) => contains(area, x, y));
}

export function isPointOnDock(x: number, y: number): boolean {
  return EXPANDED_WORLD_OBJECTS
    .filter((object) => object.kind === 'dock')
    .some((dock) => contains(dock, x, y));
}

export function findNavigationBlockers(
  objects: ExpandedWorldObject[] = EXPANDED_WORLD_OBJECTS,
  npcs: ExpandedNpc[] = EXPANDED_NPCS,
): string[] {
  const blockers: string[] = [];
  for (const corridor of WALKABLE_CORRIDORS) {
    for (const object of objects) {
      if (object.solid === false || ['sign', 'lantern', 'flowerbed'].includes(object.kind)) continue;
      if (corridor.allowKinds?.includes(object.kind)) continue;
      if (overlaps(corridor.bounds, collisionFootprint(object))) blockers.push(`${corridor.id}: object ${object.id}`);
    }
    for (const npc of npcs) {
      if (contains(corridor.bounds, npc.x, npc.y)) blockers.push(`${corridor.id}: npc ${npc.id}`);
    }
  }
  return blockers;
}

export function findObjectPlacementIssues(objects: ExpandedWorldObject[] = EXPANDED_WORLD_OBJECTS): string[] {
  const issues: string[] = [];
  const auditedKinds: ExpandedWorldObject['kind'][] = ['building', 'camper', 'party-tent', 'tent', 'stage', 'kiosk', 'table', 'bench'];
  const solids = objects.filter((object) => object.solid !== false && auditedKinds.includes(object.kind) && object.id !== 'home-tent');

  for (const object of objects) {
    const region = WORLD_REGIONS.find((entry) => entry.id === object.regionId);
    if (!region || object.kind === 'dock' || object.kind === 'rock' || object.id === 'home-tent') continue;
    const footprint = collisionFootprint(object);
    if (!containsBounds(region.bounds, footprint)) issues.push(`Object leaves region: ${object.id}`);
  }

  for (let index = 0; index < solids.length; index += 1) {
    const first = solids[index];
    for (const second of solids.slice(index + 1)) {
      if (first.regionId !== second.regionId) continue;
      if (overlaps(expand(collisionFootprint(first), 2), expand(collisionFootprint(second), 2))) {
        issues.push(`Objects overlap: ${first.id} / ${second.id}`);
      }
    }
  }

  for (const zone of APPROACH_ZONES) {
    for (const object of solids) {
      if (zone.ownerIds.includes(object.id)) continue;
      if (overlaps(zone.bounds, collisionFootprint(object))) issues.push(`${zone.id}: approach blocked by ${object.id}`);
    }
  }

  return issues;
}

export function validateRealisticLayout(): string[] {
  applyRealisticWorldLayout();
  const errors: string[] = [];

  for (const object of EXPANDED_WORLD_OBJECTS) {
    if (object.kind === 'dock' || object.kind === 'rock' || object.id === 'home-tent') continue;
    if (WATER_AREAS.some((water) => overlaps(water, collisionFootprint(object)))) errors.push(`Object intersects water: ${object.id}`);
  }

  for (const npc of EXPANDED_NPCS) {
    if (isPointInWater(npc.x, npc.y) && !isPointOnDock(npc.x, npc.y)) errors.push(`NPC stands in water: ${npc.id}`);
  }

  for (const landmark of LANDMARKS) {
    if (isPointInWater(landmark.x, landmark.y) && !isPointOnDock(landmark.x, landmark.y)) errors.push(`Landmark stands in water: ${landmark.id}`);
  }

  const fireBounds: Bounds = {
    x: CAMPFIRE_POSITION.x - CAMPFIRE_POSITION.safeRadius,
    y: CAMPFIRE_POSITION.y - CAMPFIRE_POSITION.safeRadius,
    width: CAMPFIRE_POSITION.safeRadius * 2,
    height: CAMPFIRE_POSITION.safeRadius * 2,
  };
  for (const object of EXPANDED_WORLD_OBJECTS) {
    if (object.solid === false || !['building', 'camper', 'party-tent', 'tent', 'stage', 'kiosk'].includes(object.kind)) continue;
    if (object.id === 'home-tent') continue;
    if (overlaps(fireBounds, collisionFootprint(object))) errors.push(`Campfire clearance blocked by: ${object.id}`);
  }

  errors.push(...findNavigationBlockers());
  errors.push(...findObjectPlacementIssues());
  return errors;
}

function contains(bounds: Bounds, x: number, y: number): boolean {
  return x >= bounds.x && x <= bounds.x + bounds.width && y >= bounds.y && y <= bounds.y + bounds.height;
}

function containsBounds(outer: Bounds, inner: Bounds): boolean {
  return inner.x >= outer.x
    && inner.y >= outer.y
    && inner.x + inner.width <= outer.x + outer.width
    && inner.y + inner.height <= outer.y + outer.height;
}

function expand(bounds: Bounds, amount: number): Bounds {
  return { x: bounds.x - amount, y: bounds.y - amount, width: bounds.width + amount * 2, height: bounds.height + amount * 2 };
}

function overlaps(a: Bounds, b: Bounds): boolean {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

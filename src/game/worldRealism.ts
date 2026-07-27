import {
  EXPANDED_NPCS,
  EXPANDED_WORLD_OBJECTS,
  LANDMARKS,
  WORLD_REGIONS,
  type Bounds,
  type ExpandedNpc,
  type ExpandedWorldObject,
} from './worldV2';

export const CAMPFIRE_POSITION = { x: 900, y: 1010, safeRadius: 66 } as const;

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
  { id: 'arrival-driveway', bounds: { x: 740, y: 1280, width: 200, height: 520 } },
  { id: 'gate-passage', bounds: { x: 735, y: 1200, width: 115, height: 110 } },
  { id: 'central-spine', bounds: { x: 745, y: 760, width: 105, height: 440 } },
  { id: 'north-transition', bounds: { x: 625, y: 700, width: 180, height: 110 } },
  { id: 'north-spine', bounds: { x: 610, y: 250, width: 100, height: 450 } },
  { id: 'festival-link', bounds: { x: 1340, y: 690, width: 120, height: 120 } },
  { id: 'festival-spine', bounds: { x: 1880, y: 300, width: 70, height: 650 } },
  { id: 'woodland-service', bounds: { x: 1640, y: 980, width: 95, height: 820 } },
  { id: 'cove-link', bounds: { x: 1900, y: 1500, width: 140, height: 100 } },
  { id: 'main-dock-approach', bounds: { x: 2100, y: 500, width: 150, height: 72 }, allowKinds: ['dock'] },
  { id: 'cove-dock-approach', bounds: { x: 2020, y: 1390, width: 180, height: 65 }, allowKinds: ['dock'] },
];

export const APPROACH_ZONES: ApproachZone[] = [
  { id: 'reception-door', bounds: { x: 1055, y: 1490, width: 115, height: 105 }, ownerIds: ['reception'] },
  { id: 'sanitary-door', bounds: { x: 430, y: 955, width: 120, height: 95 }, ownerIds: ['sanitary'] },
  { id: 'home-tent-door', bounds: { x: 315, y: 1185, width: 100, height: 90 }, ownerIds: ['home-tent'] },
  { id: 'party-tent-door', bounds: { x: 1615, y: 490, width: 120, height: 105 }, ownerIds: ['party'] },
  { id: 'notice-board', bounds: { x: 600, y: 1400, width: 105, height: 125 }, ownerIds: [] },
];

export const WATER_AREAS: Bounds[] = [
  { x: 2250, y: 20, width: 350, height: 1080 },
  { x: 2220, y: 1100, width: 380, height: 700 },
];

export const WATER_COLLIDERS: Bounds[] = [
  { x: 2250, y: 20, width: 350, height: 480 },
  { x: 2510, y: 500, width: 90, height: 72 },
  { x: 2250, y: 572, width: 350, height: 528 },
  { x: 2220, y: 1100, width: 380, height: 290 },
  { x: 2365, y: 1390, width: 235, height: 65 },
  { x: 2220, y: 1455, width: 380, height: 345 },
];

const OBJECT_OVERRIDES: Record<string, Partial<ExpandedWorldObject>> = {
  reception: { x: 980, y: 1360 },
  'parking-fence-left': { x: 470, width: 235 },
  'parking-fence-right': { x: 965, width: 425 },
  'arrival-sign': { x: 500, y: 1375 },
  'arrival-flowerbed': { x: 1215, y: 1570, width: 140, height: 58 },

  sanitary: { x: 315, y: 815 },
  'home-tent': { x: 280, y: 1120 },
  'tent-andre': { x: 470, y: 1115 },
  'tent-rene': { x: 620, y: 1130 },
  'tent-lars': { x: 860, y: 1115 },
  'tent-danny': { x: 1050, y: 1130 },
  'central-camper': { x: 1090, y: 800, width: 210 },
  'central-table': { x: 970, y: 930 },
  'central-bench': { x: 1010, y: 1020 },
  'central-tree-2': { x: 1270, y: 1040 },
  'central-tree-3': { x: 185, y: 805 },
  'central-flowerbed': { x: 80, y: 1190, width: 180, height: 45 },

  'north-camper-1': { x: 500, y: 130 },
  'north-camper-2': { x: 800, y: 145 },
  'north-camper-3': { x: 1090, y: 120 },
  'north-table-1': { x: 460, y: 430 },
  'north-table-2': { x: 930, y: 480 },
  'north-bench-1': { x: 720, y: 600 },
  'north-tree-2': { x: 680, y: 25 },
  'north-fence': { x: 0, y: 738, width: 520 },

  'festival-kiosk': { x: 1490, y: 650 },
  'festival-table-1': { x: 1735, y: 650 },
  'festival-table-2': { x: 1735, y: 820 },
  'festival-sign': { x: 1840, y: 830 },

  'beach-kiosk': { x: 1985, y: 170 },
  lifeguard: { x: 2050, y: 330, width: 155, height: 125 },
  'beach-bench-1': { x: 2000, y: 650 },
  'beach-bench-2': { x: 2000, y: 780 },
  'beach-table': { x: 1985, y: 900 },
  'beach-sign': { x: 1990, y: 1010 },
  'beach-rock-1': { x: 2470, y: 860 },
  'beach-rock-2': { x: 2380, y: 940 },

  workshop: { x: 1410, y: 1120, width: 220, height: 170 },
  'wood-shed': { x: 1760, y: 1320 },
  'woodland-bench': { x: 1480, y: 1690 },
  'woodland-tree-1': { x: 1390, y: 990 },
  'woodland-tree-2': { x: 1810, y: 1000 },
  'woodland-tree-3': { x: 1410, y: 1480 },
  'woodland-tree-4': { x: 1810, y: 1650 },
  'woodland-tree-5': { x: 1815, y: 1490 },

  'cove-shelter': { x: 1980, y: 1180 },
  'cove-sign': { x: 1980, y: 1320 },
  'cove-rock-1': { x: 2070, y: 1510 },
  'cove-rock-2': { x: 2420, y: 1510 },
  'cove-tree-1': { x: 1950, y: 1640 },
  'cove-tree-2': { x: 2470, y: 1640 },
  'cove-bench': { x: 2050, y: 1680 },
};

const NPC_OVERRIDES: Record<string, { x: number; y: number }> = {
  gundula: { x: 690, y: 1380 },
  uli: { x: 980, y: 1380 },
  manni: { x: 540, y: 1045 },
  ronny: { x: 255, y: 950 },
  andre: { x: 540, y: 1090 },
  rene: { x: 680, y: 1095 },
  lars: { x: 930, y: 1085 },
  danny: { x: 1115, y: 1095 },
  gregor: { x: 780, y: 530 },
  masl: { x: 1780, y: 760 },
  felix: { x: 2090, y: 680 },
  schubert: { x: 1510, y: 1510 },
  schima: { x: 2150, y: 1580 },
  susi: { x: 1770, y: 720 },
  jule: { x: 2050, y: 620 },
  kira: { x: 1040, y: 510 },
};

const LANDMARK_OVERRIDES: Record<string, { x: number; y: number }> = {
  'notice-board': { x: 650, y: 1460 },
  campfire: { x: CAMPFIRE_POSITION.x, y: CAMPFIRE_POSITION.y },
  'lake-lookout': { x: 2460, y: 535 },
  'service-map': { x: 1870, y: 1300 },
  'cove-echo': { x: 2340, y: 1425 },
};

let applied = false;

export function applyRealisticWorldLayout(): void {
  if (applied) return;
  for (const object of EXPANDED_WORLD_OBJECTS) {
    const override = OBJECT_OVERRIDES[object.id];
    if (override) Object.assign(object, override);
  }
  for (const npc of EXPANDED_NPCS) {
    const override = NPC_OVERRIDES[npc.id];
    if (override) Object.assign(npc, override);
  }
  for (const landmark of LANDMARKS) {
    const override = LANDMARK_OVERRIDES[landmark.id];
    if (override) Object.assign(landmark, override);
  }
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
  const solids = objects.filter((object) => object.solid !== false && !['sign', 'lantern', 'flowerbed', 'dock'].includes(object.kind));

  for (const object of objects) {
    const region = WORLD_REGIONS.find((entry) => entry.id === object.regionId);
    if (!region || object.kind === 'dock' || object.kind === 'rock') continue;
    const footprint = collisionFootprint(object);
    if (!containsBounds(region.bounds, footprint)) issues.push(`Object leaves region: ${object.id}`);
  }

  for (let index = 0; index < solids.length; index += 1) {
    const first = solids[index];
    for (const second of solids.slice(index + 1)) {
      if (first.regionId !== second.regionId) continue;
      if (overlaps(expand(collisionFootprint(first), 3), expand(collisionFootprint(second), 3))) {
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
    if (object.kind === 'dock' || object.kind === 'rock') continue;
    if (WATER_AREAS.some((water) => overlaps(water, object))) errors.push(`Object intersects water: ${object.id}`);
  }

  for (const npc of EXPANDED_NPCS) {
    if (isPointInWater(npc.x, npc.y) && !isPointOnDock(npc.x, npc.y)) errors.push(`NPC stands in water: ${npc.id}`);
  }

  for (const landmark of LANDMARKS) {
    if (isPointInWater(landmark.x, landmark.y) && !isPointOnDock(landmark.x, landmark.y)) {
      errors.push(`Landmark stands in water: ${landmark.id}`);
    }
  }

  const fireBounds: Bounds = {
    x: CAMPFIRE_POSITION.x - CAMPFIRE_POSITION.safeRadius,
    y: CAMPFIRE_POSITION.y - CAMPFIRE_POSITION.safeRadius,
    width: CAMPFIRE_POSITION.safeRadius * 2,
    height: CAMPFIRE_POSITION.safeRadius * 2,
  };
  for (const object of EXPANDED_WORLD_OBJECTS) {
    if (object.solid === false || ['sign', 'lantern', 'flowerbed', 'dock'].includes(object.kind)) continue;
    if (overlaps(fireBounds, collisionFootprint(object))) errors.push(`Campfire clearance blocked by: ${object.id}`);
  }

  errors.push(...findNavigationBlockers());
  errors.push(...findObjectPlacementIssues());
  return errors;
}

function contains(bounds: Bounds, x: number, y: number): boolean {
  return x >= bounds.x
    && x <= bounds.x + bounds.width
    && y >= bounds.y
    && y <= bounds.y + bounds.height;
}

function containsBounds(outer: Bounds, inner: Bounds): boolean {
  return inner.x >= outer.x
    && inner.y >= outer.y
    && inner.x + inner.width <= outer.x + outer.width
    && inner.y + inner.height <= outer.y + outer.height;
}

function expand(bounds: Bounds, amount: number): Bounds {
  return {
    x: bounds.x - amount,
    y: bounds.y - amount,
    width: bounds.width + amount * 2,
    height: bounds.height + amount * 2,
  };
}

function overlaps(a: Bounds, b: Bounds): boolean {
  return a.x < b.x + b.width
    && a.x + a.width > b.x
    && a.y < b.y + b.height
    && a.y + a.height > b.y;
}

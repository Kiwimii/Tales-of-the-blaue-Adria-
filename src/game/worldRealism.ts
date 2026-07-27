import {
  EXPANDED_NPCS,
  EXPANDED_WORLD_OBJECTS,
  LANDMARKS,
  type Bounds,
  type ExpandedNpc,
  type ExpandedWorldObject,
} from './worldV2';

export const CAMPFIRE_POSITION = { x: 900, y: 1010, safeRadius: 58 } as const;

export interface NavigationCorridor {
  id: string;
  bounds: Bounds;
}

export const WALKABLE_CORRIDORS: NavigationCorridor[] = [
  { id: 'arrival-driveway', bounds: { x: 745, y: 1280, width: 180, height: 500 } },
  { id: 'central-main-path', bounds: { x: 675, y: 760, width: 135, height: 520 } },
  { id: 'woodland-service-path', bounds: { x: 1640, y: 980, width: 95, height: 820 } },
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
  'parking-fence-left': { x: 500, width: 220 },
  'parking-fence-right': { x: 950, width: 440 },
  'arrival-sign': { x: 520, y: 1375 },
  'home-tent': { y: 1125 },
  'tent-andre': { x: 500, y: 1135 },
  'tent-rene': { x: 820, y: 1140 },
  'tent-lars': { x: 835, y: 1125 },
  'tent-danny': { x: 1020, y: 1135 },
  'central-camper': { x: 1080, y: 800 },
  'central-table': { x: 470, y: 930 },
  'central-bench': { x: 520, y: 1030 },
  'central-tree-2': { x: 1260, y: 1035 },
  'central-tree-3': { x: 190, y: 800 },
  'central-flowerbed': { x: 80, y: 1195, width: 180, height: 45 },
  'north-camper-1': { x: 550 },
  'north-tree-2': { x: 690, y: 25 },
  lifeguard: { x: 2055, y: 330, width: 155, height: 125 },
  'beach-bench-1': { x: 2010, y: 480 },
  'beach-table': { x: 1985, y: 900 },
  'beach-sign': { x: 1990, y: 1000 },
  workshop: { x: 1420, y: 1130, width: 220, height: 170 },
  'woodland-tree-1': { x: 1405, y: 985 },
  'woodland-tree-5': { x: 1830, y: 1570 },
  'woodland-bench': { x: 1510, y: 1710 },
  'cove-sign': { x: 1980, y: 1320 },
  'cove-tree-2': { x: 1955, y: 1430 },
  'cove-rock-1': { x: 2090, y: 1520 },
  'cove-tree-1': { x: 1955, y: 1640 },
  'cove-bench': { x: 2085, y: 1655 },
};

const NPC_OVERRIDES: Record<string, { x: number; y: number }> = {
  gundula: { x: 690, y: 1380 },
  uli: { x: 980, y: 1380 },
  andre: { x: 540, y: 1090 },
  rene: { x: 860, y: 1095 },
  lars: { x: 930, y: 1085 },
  danny: { x: 1080, y: 1095 },
  schima: { x: 2150, y: 1580 },
};

const LANDMARK_OVERRIDES: Record<string, { x: number; y: number }> = {
  'notice-board': { x: 650, y: 1460 },
  campfire: { x: CAMPFIRE_POSITION.x, y: CAMPFIRE_POSITION.y },
  'lake-lookout': { x: 2460, y: 535 },
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
      if (object.solid === false || ['sign', 'lantern', 'flowerbed', 'dock'].includes(object.kind)) continue;
      if (overlaps(corridor.bounds, collisionFootprint(object))) blockers.push(`${corridor.id}: object ${object.id}`);
    }
    for (const npc of npcs) {
      if (contains(corridor.bounds, npc.x, npc.y)) blockers.push(`${corridor.id}: npc ${npc.id}`);
    }
  }
  return blockers;
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
  return errors;
}

function contains(bounds: Bounds, x: number, y: number): boolean {
  return x >= bounds.x
    && x <= bounds.x + bounds.width
    && y >= bounds.y
    && y <= bounds.y + bounds.height;
}

function overlaps(a: Bounds, b: Bounds): boolean {
  return a.x < b.x + b.width
    && a.x + a.width > b.x
    && a.y < b.y + b.height
    && a.y + a.height > b.y;
}

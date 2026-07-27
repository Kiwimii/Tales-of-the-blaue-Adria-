import { ARRIVAL_POSITIONS } from './arrivalQuest';
import {
  EXPANDED_ENTRANCES,
  EXPANDED_NPCS,
  EXPANDED_WORLD_OBJECTS,
  LANDMARKS,
  WORLD_REGIONS,
  type Bounds,
  type ExpandedWorldObject,
  type RegionId,
} from './worldV2';
import { CAMPFIRE_POSITION, collisionFootprint } from './worldRealism';

export interface BlueprintPoint {
  x: number;
  y: number;
}

export interface BlueprintZone {
  id: string;
  regionId: RegionId;
  label: string;
  bounds: Bounds;
  ground: number;
  border: number;
}

export interface BlueprintRoad {
  id: string;
  from: BlueprintNodeId;
  to: BlueprintNodeId;
  width: number;
  surface: 'asphalt' | 'gravel' | 'sand';
}

interface Placement extends BlueprintPoint {
  width?: number;
  height?: number;
}

export const BLUEPRINT_GRID = 50;

export const BLUEPRINT_NODES = {
  entrance: { x: 825, y: 1750 },
  parking: { x: 825, y: 1525 },
  gate: { x: 825, y: 1300 },
  southHub: { x: 825, y: 1000 },
  northHub: { x: 825, y: 650 },
  northEnd: { x: 825, y: 100 },

  receptionTurn: { x: 825, y: 1475 },
  receptionDoor: { x: 1175, y: 1475 },

  westCamp: { x: 400, y: 1000 },
  sanitaryTurn: { x: 400, y: 900 },
  sanitaryDoor: { x: 225, y: 900 },
  homeTurn: { x: 400, y: 1175 },
  homeDoor: { x: 250, y: 1175 },
  eastCamp: { x: 1225, y: 1000 },

  northWest: { x: 400, y: 650 },
  northWestUpper: { x: 400, y: 350 },
  northEast: { x: 1225, y: 650 },
  northEastUpper: { x: 1225, y: 350 },

  festivalEntry: { x: 1400, y: 1000 },
  festivalTurn: { x: 1400, y: 650 },
  festivalHub: { x: 1700, y: 650 },
  partyDoor: { x: 1650, y: 550 },
  beachHub: { x: 2100, y: 650 },
  beachDock: { x: 2100, y: 535 },

  woodlandHub: { x: 1700, y: 1000 },
  woodlandSouth: { x: 1700, y: 1500 },
  coveHub: { x: 2100, y: 1500 },
  coveDock: { x: 2100, y: 1425 },
} as const satisfies Record<string, BlueprintPoint>;

export type BlueprintNodeId = keyof typeof BLUEPRINT_NODES;

export const BLUEPRINT_ROADS: BlueprintRoad[] = [
  { id: 'arrival-driveway', from: 'entrance', to: 'parking', width: 130, surface: 'asphalt' },
  { id: 'gate-approach', from: 'parking', to: 'gate', width: 116, surface: 'asphalt' },
  { id: 'south-spine', from: 'gate', to: 'southHub', width: 104, surface: 'gravel' },
  { id: 'north-spine-lower', from: 'southHub', to: 'northHub', width: 88, surface: 'gravel' },
  { id: 'north-spine-upper', from: 'northHub', to: 'northEnd', width: 80, surface: 'gravel' },

  { id: 'reception-turn', from: 'parking', to: 'receptionTurn', width: 56, surface: 'asphalt' },
  { id: 'reception-walk', from: 'receptionTurn', to: 'receptionDoor', width: 56, surface: 'asphalt' },

  { id: 'south-west-lane', from: 'southHub', to: 'westCamp', width: 70, surface: 'gravel' },
  { id: 'sanitary-lane', from: 'westCamp', to: 'sanitaryTurn', width: 48, surface: 'gravel' },
  { id: 'sanitary-spur', from: 'sanitaryTurn', to: 'sanitaryDoor', width: 46, surface: 'gravel' },
  { id: 'home-lane', from: 'westCamp', to: 'homeTurn', width: 48, surface: 'gravel' },
  { id: 'home-spur', from: 'homeTurn', to: 'homeDoor', width: 42, surface: 'gravel' },
  { id: 'south-east-lane', from: 'southHub', to: 'eastCamp', width: 70, surface: 'gravel' },

  { id: 'north-west-lane', from: 'northHub', to: 'northWest', width: 62, surface: 'gravel' },
  { id: 'north-west-upper', from: 'northWest', to: 'northWestUpper', width: 54, surface: 'gravel' },
  { id: 'north-east-lane', from: 'northHub', to: 'northEast', width: 62, surface: 'gravel' },
  { id: 'north-east-upper', from: 'northEast', to: 'northEastUpper', width: 54, surface: 'gravel' },

  { id: 'east-artery', from: 'eastCamp', to: 'festivalEntry', width: 76, surface: 'gravel' },
  { id: 'festival-entry', from: 'festivalEntry', to: 'festivalTurn', width: 72, surface: 'gravel' },
  { id: 'festival-crossroad', from: 'festivalTurn', to: 'festivalHub', width: 72, surface: 'gravel' },
  { id: 'party-spur-horizontal', from: 'festivalHub', to: 'partyDoor', width: 44, surface: 'gravel' },
  { id: 'party-spur-vertical', from: 'partyDoor', to: 'festivalHub', width: 44, surface: 'gravel' },
  { id: 'beach-promenade', from: 'festivalHub', to: 'beachHub', width: 72, surface: 'sand' },
  { id: 'main-dock-approach', from: 'beachHub', to: 'beachDock', width: 60, surface: 'sand' },

  { id: 'woodland-entry', from: 'festivalEntry', to: 'woodlandHub', width: 68, surface: 'gravel' },
  { id: 'woodland-service-road', from: 'woodlandHub', to: 'woodlandSouth', width: 64, surface: 'gravel' },
  { id: 'cove-connector', from: 'woodlandSouth', to: 'coveHub', width: 62, surface: 'gravel' },
  { id: 'cove-dock-approach', from: 'coveHub', to: 'coveDock', width: 56, surface: 'sand' },
];

export const BLUEPRINT_ZONES: BlueprintZone[] = [
  { id: 'north-camp', regionId: 'north', label: 'NORDLAGER', bounds: { x: 50, y: 50, width: 1300, height: 650 }, ground: 0x668b58, border: 0x9ebd7f },
  { id: 'south-camp', regionId: 'central', label: 'TAUCHERPLATZ', bounds: { x: 50, y: 750, width: 1300, height: 500 }, ground: 0x6f965f, border: 0xa8c27a },
  { id: 'arrival', regionId: 'arrival', label: 'ANKUNFT UND REZEPTION', bounds: { x: 450, y: 1300, width: 900, height: 450 }, ground: 0x777d78, border: 0xb8b59f },
  { id: 'festival', regionId: 'festival', label: 'FESTWIESE', bounds: { x: 1400, y: 50, width: 500, height: 850 }, ground: 0x7d9457, border: 0xd0b36a },
  { id: 'woodland', regionId: 'woodland', label: 'WERKSTATT UND WALDPFAD', bounds: { x: 1400, y: 950, width: 500, height: 800 }, ground: 0x4f7652, border: 0x86a979 },
  { id: 'beach', regionId: 'beach', label: 'STRAND', bounds: { x: 1950, y: 50, width: 280, height: 1000 }, ground: 0xd8c789, border: 0xf2dfaa },
  { id: 'cove', regionId: 'cove', label: 'VERSTECKTE BUCHT', bounds: { x: 1950, y: 1100, width: 280, height: 650 }, ground: 0x557d61, border: 0x9ab58f },
];

const OBJECTS: Record<string, Placement> = {
  reception: { x: 1040, y: 1315 },
  'arrival-sign': { x: 525, y: 1355 },
  'parking-fence-left': { x: 450, y: 1278, width: 300 },
  'parking-fence-right': { x: 900, y: 1278, width: 450 },
  'arrival-flowerbed': { x: 1180, y: 1615 },
  'arrival-lantern-1': { x: 545, y: 1500 },
  'arrival-lantern-2': { x: 1300, y: 1500 },

  sanitary: { x: 90, y: 770 },
  'home-tent': { x: 150, y: 1070 },
  'tent-andre': { x: 360, y: 1070 },
  'tent-rene': { x: 560, y: 1070 },
  'tent-lars': { x: 950, y: 1070 },
  'tent-danny': { x: 1140, y: 1070 },
  'central-camper': { x: 1050, y: 770 },
  'central-table': { x: 470, y: 815 },
  'central-bench': { x: 625, y: 835 },
  'central-sign': { x: 70, y: 1020 },
  'central-tree-1': { x: 55, y: 800 },
  'central-tree-2': { x: 1250, y: 930 },
  'central-tree-3': { x: 60, y: 1130 },
  'central-flowerbed': { x: 690, y: 1185, width: 170 },
  'tent-hedge-west': { x: 120, y: 1248, width: 640 },
  'tent-hedge-east': { x: 930, y: 1248, width: 410 },

  clubhouse: { x: 90, y: 90 },
  'north-camper-1': { x: 470, y: 120 },
  'north-camper-2': { x: 940, y: 120 },
  'north-camper-3': { x: 1080, y: 380 },
  'north-table-1': { x: 470, y: 430 },
  'north-table-2': { x: 1040, y: 520 },
  'north-bench-1': { x: 590, y: 570 },
  'north-sign': { x: 90, y: 610 },
  'north-tree-1': { x: 410, y: 45 },
  'north-tree-2': { x: 1210, y: 45 },
  'north-tree-3': { x: 1280, y: 530 },
  'north-tree-4': { x: 230, y: 480 },
  'north-fence': { x: 0, y: 718, width: 600 },

  party: { x: 1470, y: 300 },
  'festival-stage': { x: 1470, y: 85 },
  'festival-kiosk': { x: 1470, y: 735 },
  'festival-table-1': { x: 1740, y: 530 },
  'festival-table-2': { x: 1735, y: 790 },
  'festival-lantern-1': { x: 1450, y: 535 },
  'festival-lantern-2': { x: 1870, y: 535 },
  'festival-sign': { x: 1790, y: 825 },

  'beach-kiosk': { x: 1975, y: 150 },
  lifeguard: { x: 1975, y: 340, width: 155 },
  'main-dock': { x: 2210, y: 500 },
  'beach-bench-1': { x: 1980, y: 500 },
  'beach-bench-2': { x: 1980, y: 810 },
  'beach-table': { x: 2020, y: 900 },
  'beach-sign': { x: 1980, y: 985 },
  'beach-rock-1': { x: 2475, y: 860 },
  'beach-rock-2': { x: 2410, y: 930 },

  workshop: { x: 1415, y: 1080, width: 220 },
  'wood-shed': { x: 1775, y: 1340 },
  'woodland-bench': { x: 1445, y: 1580 },
  'woodland-sign': { x: 1790, y: 1050 },
  'woodland-tree-1': { x: 1405, y: 985 },
  'woodland-tree-2': { x: 1810, y: 990 },
  'woodland-tree-3': { x: 1405, y: 1450 },
  'woodland-tree-4': { x: 1810, y: 1590 },
  'woodland-tree-5': { x: 1550, y: 1640 },

  'cove-dock': { x: 2100, y: 1390 },
  'cove-shelter': { x: 1975, y: 1150 },
  'cove-bench': { x: 1980, y: 1650 },
  'cove-sign': { x: 2440, y: 1160 },
  'cove-rock-1': { x: 1980, y: 1340 },
  'cove-rock-2': { x: 2410, y: 1570 },
  'cove-tree-1': { x: 1980, y: 1635 },
  'cove-tree-2': { x: 2170, y: 1140 },
  'lunch-sign': { x: 1230, y: 1510 },
};

const NPCS: Record<string, BlueprintPoint> = {
  gundula: { x: 1080, y: 1420 },
  uli: { x: 980, y: 1365 },
  manni: { x: 460, y: 880 },
  ronny: { x: 260, y: 990 },
  andre: { x: 430, y: 1040 },
  rene: { x: 630, y: 1040 },
  lars: { x: 1015, y: 1040 },
  danny: { x: 1200, y: 1040 },
  gregor: { x: 520, y: 520 },
  masl: { x: 1780, y: 690 },
  felix: { x: 2050, y: 830 },
  schubert: { x: 1500, y: 1530 },
  schima: { x: 2040, y: 1600 },
  susi: { x: 1760, y: 600 },
  jule: { x: 2050, y: 780 },
  kira: { x: 1090, y: 560 },
};

const ENTRANCES: Record<string, BlueprintPoint> = {
  'reception-door': { x: 1175, y: 1490 },
  'sanitary-door': { x: 225, y: 960 },
  'home-door': { x: 250, y: 1190 },
  'party-door': { x: 1650, y: 535 },
};

const LANDMARKS_PLACEMENTS: Record<string, BlueprintPoint> = {
  'notice-board': { x: 965, y: 1450 },
  campfire: { x: 620, y: 930 },
  'clubhouse-wall': { x: 410, y: 290 },
  'festival-lights': { x: 1740, y: 520 },
  'lake-lookout': { x: 2380, y: 535 },
  'service-map': { x: 1810, y: 1240 },
  'cove-echo': { x: 2320, y: 1425 },
};

let applied = false;

export function applyCampgroundBlueprint(): void {
  if (applied) return;

  for (const object of EXPANDED_WORLD_OBJECTS) {
    const placement = OBJECTS[object.id];
    if (placement) Object.assign(object, placement);
  }
  for (const npc of EXPANDED_NPCS) {
    const placement = NPCS[npc.id];
    if (placement) Object.assign(npc, placement);
  }
  for (const entrance of EXPANDED_ENTRANCES) {
    const placement = ENTRANCES[entrance.id];
    if (placement) Object.assign(entrance, placement);
  }
  for (const landmark of LANDMARKS) {
    const placement = LANDMARKS_PLACEMENTS[landmark.id];
    if (placement) Object.assign(landmark, placement);
  }

  Object.assign(CAMPFIRE_POSITION as unknown as { x: number; y: number; safeRadius: number }, {
    ...LANDMARKS_PLACEMENTS.campfire,
    safeRadius: 68,
  });

  const arrival = ARRIVAL_POSITIONS as unknown as Record<string, BlueprintPoint>;
  Object.assign(arrival.trunk, { x: 650, y: 1590 });
  Object.assign(arrival.reservationBoard, LANDMARKS_PLACEMENTS['notice-board']);
  Object.assign(arrival.gundula, NPCS.gundula);
  Object.assign(arrival.uli, NPCS.uli);
  Object.assign(arrival.gateDebate, { x: 825, y: 1305 });
  Object.assign(arrival.taucherplatz, { x: 1110, y: 1015 });
  Object.assign(arrival.powerBox, { x: 1270, y: 975 });
  Object.assign(arrival.drinks, { x: 1080, y: 1130 });
  Object.assign(arrival.tents, { x: 980, y: 1150 });
  Object.assign(arrival.cable, { x: 1225, y: 1130 });
  Object.assign(arrival.firstBeer, { x: 1110, y: 1190 });
  Object.assign(arrival.homeDoor, ENTRANCES['home-door']);

  applied = true;
}

export function blueprintRoadBounds(road: BlueprintRoad): Bounds {
  const from = BLUEPRINT_NODES[road.from];
  const to = BLUEPRINT_NODES[road.to];
  const half = road.width / 2;
  return {
    x: Math.min(from.x, to.x) - half,
    y: Math.min(from.y, to.y) - half,
    width: Math.abs(to.x - from.x) + road.width,
    height: Math.abs(to.y - from.y) + road.width,
  };
}

export function blueprintPlacement(id: string): BlueprintPoint | null {
  const placement = OBJECTS[id] ?? NPCS[id] ?? ENTRANCES[id] ?? LANDMARKS_PLACEMENTS[id];
  return placement ? { x: placement.x, y: placement.y } : null;
}

export function validateCampgroundBlueprint(): string[] {
  applyCampgroundBlueprint();
  const errors: string[] = [];

  const connected = new Set<BlueprintNodeId>(['entrance']);
  let changed = true;
  while (changed) {
    changed = false;
    for (const road of BLUEPRINT_ROADS) {
      if (connected.has(road.from) && !connected.has(road.to)) {
        connected.add(road.to);
        changed = true;
      }
      if (connected.has(road.to) && !connected.has(road.from)) {
        connected.add(road.from);
        changed = true;
      }
    }
  }

  for (const [id, node] of Object.entries(BLUEPRINT_NODES) as Array<[BlueprintNodeId, BlueprintPoint]>) {
    if (!connected.has(id)) errors.push(`Disconnected blueprint node: ${id}`);
    if (!onGrid(node.x) || !onGrid(node.y)) errors.push(`Node is off planning grid: ${id}`);
  }

  for (const road of BLUEPRINT_ROADS) {
    const from = BLUEPRINT_NODES[road.from];
    const to = BLUEPRINT_NODES[road.to];
    if (from.x !== to.x && from.y !== to.y) errors.push(`Road is not orthogonal: ${road.id}`);
  }

  for (const zone of BLUEPRINT_ZONES) {
    if (![zone.bounds.x, zone.bounds.y, zone.bounds.width, zone.bounds.height].every(onGrid)) {
      errors.push(`Zone is off planning grid: ${zone.id}`);
    }
  }

  const roadBounds = BLUEPRINT_ROADS.map((road) => ({ id: road.id, bounds: blueprintRoadBounds(road) }));
  for (const object of EXPANDED_WORLD_OBJECTS) {
    const region = WORLD_REGIONS.find((entry) => entry.id === object.regionId);
    if (!region || !contains(region.bounds, object.x + object.width / 2, object.y + object.height / 2)) {
      errors.push(`Object outside region: ${object.id}`);
    }
    if (object.solid === false || ['sign', 'lantern', 'flowerbed', 'dock', 'fence'].includes(object.kind)) continue;
    const footprint = collisionFootprint(object);
    for (const road of roadBounds) {
      if (overlaps(footprint, road.bounds)) errors.push(`${road.id} blocked by object ${object.id}`);
    }
  }

  for (const npc of EXPANDED_NPCS) {
    for (const road of roadBounds) {
      if (contains(road.bounds, npc.x, npc.y)) errors.push(`${road.id} blocked by npc ${npc.id}`);
    }
  }

  for (const entrance of EXPANDED_ENTRANCES) {
    const nearestRoad = roadBounds.reduce(
      (best, road) => Math.min(best, distanceToBounds(entrance, road.bounds)),
      Number.POSITIVE_INFINITY,
    );
    if (nearestRoad > 95) errors.push(`Entrance lacks blueprint access: ${entrance.id}`);
  }

  return [...new Set(errors)];
}

function onGrid(value: number): boolean {
  return value % BLUEPRINT_GRID === 0 || value % BLUEPRINT_GRID === 25;
}

function contains(bounds: Bounds, x: number, y: number): boolean {
  return x >= bounds.x && x <= bounds.x + bounds.width && y >= bounds.y && y <= bounds.y + bounds.height;
}

function overlaps(a: Bounds, b: Bounds): boolean {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

function distanceToBounds(point: BlueprintPoint, bounds: Bounds): number {
  const x = Math.max(bounds.x, Math.min(point.x, bounds.x + bounds.width));
  const y = Math.max(bounds.y, Math.min(point.y, bounds.y + bounds.height));
  return Math.hypot(point.x - x, point.y - y);
}

export function blueprintCollisionFootprint(id: string): Bounds | null {
  const object = EXPANDED_WORLD_OBJECTS.find((entry) => entry.id === id) as ExpandedWorldObject | undefined;
  return object ? collisionFootprint(object) : null;
}

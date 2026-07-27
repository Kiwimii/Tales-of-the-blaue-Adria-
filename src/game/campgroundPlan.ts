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

export interface PlanPoint {
  x: number;
  y: number;
}

export interface PlanRoad {
  id: string;
  from: keyof typeof CAMP_ROAD_NODES;
  to: keyof typeof CAMP_ROAD_NODES;
  width: number;
  surface: 'asphalt' | 'gravel' | 'sand';
}

export interface PlanDistrict {
  id: string;
  regionId: RegionId;
  label: string;
  bounds: Bounds;
  ground: number;
  border: number;
}

interface Placement {
  x: number;
  y: number;
  width?: number;
  height?: number;
}

export const CAMP_ROAD_NODES = {
  entrance: { x: 835, y: 1740 },
  parking: { x: 835, y: 1510 },
  gate: { x: 835, y: 1320 },
  southHub: { x: 835, y: 930 },
  northHub: { x: 835, y: 540 },
  northEnd: { x: 835, y: 150 },
  westCamp: { x: 420, y: 930 },
  eastCamp: { x: 1290, y: 930 },
  festivalEntry: { x: 1400, y: 930 },
  festivalHub: { x: 1700, y: 720 },
  beachHub: { x: 2150, y: 720 },
  beachDock: { x: 2150, y: 535 },
  woodlandHub: { x: 1700, y: 1120 },
  woodlandSouth: { x: 1700, y: 1530 },
  coveHub: { x: 2140, y: 1530 },
  coveDock: { x: 2140, y: 1425 },
} as const satisfies Record<string, PlanPoint>;

export const CAMP_ROADS: PlanRoad[] = [
  { id: 'arrival-driveway', from: 'entrance', to: 'parking', width: 132, surface: 'asphalt' },
  { id: 'gate-approach', from: 'parking', to: 'gate', width: 118, surface: 'asphalt' },
  { id: 'south-spine', from: 'gate', to: 'southHub', width: 104, surface: 'gravel' },
  { id: 'north-spine-lower', from: 'southHub', to: 'northHub', width: 88, surface: 'gravel' },
  { id: 'north-spine-upper', from: 'northHub', to: 'northEnd', width: 80, surface: 'gravel' },
  { id: 'south-west-loop', from: 'southHub', to: 'westCamp', width: 72, surface: 'gravel' },
  { id: 'south-east-loop', from: 'southHub', to: 'eastCamp', width: 72, surface: 'gravel' },
  { id: 'east-artery', from: 'eastCamp', to: 'festivalEntry', width: 78, surface: 'gravel' },
  { id: 'festival-connector', from: 'festivalEntry', to: 'festivalHub', width: 76, surface: 'gravel' },
  { id: 'beach-promenade', from: 'festivalHub', to: 'beachHub', width: 76, surface: 'sand' },
  { id: 'main-dock-approach', from: 'beachHub', to: 'beachDock', width: 66, surface: 'sand' },
  { id: 'woodland-entry', from: 'festivalHub', to: 'woodlandHub', width: 70, surface: 'gravel' },
  { id: 'woodland-service-road', from: 'woodlandHub', to: 'woodlandSouth', width: 68, surface: 'gravel' },
  { id: 'cove-connector', from: 'woodlandSouth', to: 'coveHub', width: 66, surface: 'gravel' },
  { id: 'cove-dock-approach', from: 'coveHub', to: 'coveDock', width: 60, surface: 'sand' },
];

export const CAMP_DISTRICTS: PlanDistrict[] = [
  { id: 'arrival-parking', regionId: 'arrival', label: 'ANKUNFTSPARKPLATZ', bounds: { x: 500, y: 1430, width: 820, height: 330 }, ground: 0x777d78, border: 0xb8b59f },
  { id: 'reception-yard', regionId: 'arrival', label: 'REZEPTIONSHOF', bounds: { x: 940, y: 1305, width: 390, height: 270 }, ground: 0x91a172, border: 0xd6c681 },
  { id: 'south-west-pitches', regionId: 'central', label: 'TAUCHERPLATZ WEST', bounds: { x: 130, y: 785, width: 610, height: 470 }, ground: 0x6f965f, border: 0xa8c27a },
  { id: 'south-east-pitches', regionId: 'central', label: 'TAUCHERPLATZ OST', bounds: { x: 930, y: 785, width: 390, height: 470 }, ground: 0x71945d, border: 0xa8c27a },
  { id: 'north-west-camp', regionId: 'north', label: 'NORDLAGER WEST', bounds: { x: 70, y: 65, width: 670, height: 650 }, ground: 0x668b58, border: 0x9ebd7f },
  { id: 'north-east-camp', regionId: 'north', label: 'NORDLAGER OST', bounds: { x: 930, y: 65, width: 400, height: 650 }, ground: 0x628556, border: 0x9ebd7f },
  { id: 'festival-ground', regionId: 'festival', label: 'FESTWIESE', bounds: { x: 1450, y: 55, width: 440, height: 860 }, ground: 0x7d9457, border: 0xd0b36a },
  { id: 'beach-shore', regionId: 'beach', label: 'STRANDPROMENADE', bounds: { x: 1970, y: 70, width: 250, height: 970 }, ground: 0xd8c789, border: 0xf2dfaa },
  { id: 'woodland-west', regionId: 'woodland', label: 'WERKSTATTHOF', bounds: { x: 1415, y: 1005, width: 230, height: 720 }, ground: 0x4f7652, border: 0x86a979 },
  { id: 'woodland-east', regionId: 'woodland', label: 'SERVICEWALD', bounds: { x: 1760, y: 1005, width: 170, height: 720 }, ground: 0x496f4d, border: 0x86a979 },
  { id: 'cove-bank', regionId: 'cove', label: 'VERSTECKTE BUCHT', bounds: { x: 1970, y: 1135, width: 245, height: 610 }, ground: 0x557d61, border: 0x9ab58f },
];

const OBJECT_PLACEMENTS: Record<string, Placement> = {
  reception: { x: 1040, y: 1325 },
  'arrival-sign': { x: 535, y: 1360 },
  'parking-fence-left': { x: 500, y: 1282, width: 260 },
  'parking-fence-right': { x: 920, y: 1282, width: 460 },
  'arrival-flowerbed': { x: 1180, y: 1615 },
  'arrival-lantern-1': { x: 555, y: 1500 },
  'arrival-lantern-2': { x: 1305, y: 1500 },
  sanitary: { x: 165, y: 800 },
  'home-tent': { x: 180, y: 1090 },
  'tent-andre': { x: 390, y: 1095 },
  'tent-rene': { x: 580, y: 1090 },
  'tent-lars': { x: 950, y: 1085 },
  'tent-danny': { x: 1130, y: 1090 },
  'central-camper': { x: 1040, y: 770 },
  'central-table': { x: 500, y: 965 },
  'central-bench': { x: 655, y: 980 },
  'central-sign': { x: 95, y: 1030 },
  'central-tree-1': { x: 60, y: 805 },
  'central-tree-2': { x: 1240, y: 990 },
  'central-tree-3': { x: 85, y: 1145 },
  'central-flowerbed': { x: 710, y: 1185, width: 170 },
  clubhouse: { x: 100, y: 105 },
  'north-camper-1': { x: 470, y: 145 },
  'north-camper-2': { x: 945, y: 145 },
  'north-camper-3': { x: 1085, y: 325 },
  'north-table-1': { x: 430, y: 390 },
  'north-table-2': { x: 1030, y: 430 },
  'north-bench-1': { x: 610, y: 590 },
  'north-sign': { x: 110, y: 615 },
  'north-tree-1': { x: 420, y: 35 },
  'north-tree-2': { x: 1180, y: 35 },
  'north-tree-3': { x: 1280, y: 535 },
  'north-tree-4': { x: 230, y: 485 },
  'north-fence': { x: 0, y: 738, width: 600 },
  party: { x: 1480, y: 315 },
  'festival-stage': { x: 1475, y: 90 },
  'festival-kiosk': { x: 1475, y: 650 },
  'festival-table-1': { x: 1750, y: 555 },
  'festival-table-2': { x: 1480, y: 790 },
  'festival-lantern-1': { x: 1455, y: 540 },
  'festival-lantern-2': { x: 1880, y: 540 },
  'festival-sign': { x: 1790, y: 825 },
  'beach-kiosk': { x: 1980, y: 160 },
  lifeguard: { x: 1980, y: 340, width: 155 },
  'main-dock': { x: 2210, y: 500 },
  'beach-bench-1': { x: 1985, y: 500 },
  'beach-bench-2': { x: 1985, y: 810 },
  'beach-table': { x: 2025, y: 900 },
  'beach-sign': { x: 1985, y: 985 },
  'beach-rock-1': { x: 2475, y: 860 },
  'beach-rock-2': { x: 2410, y: 930 },
  workshop: { x: 1420, y: 1080, width: 220 },
  'wood-shed': { x: 1770, y: 1350 },
  'woodland-bench': { x: 1450, y: 1585 },
  'woodland-sign': { x: 1790, y: 1050 },
  'woodland-tree-1': { x: 1410, y: 990 },
  'woodland-tree-2': { x: 1810, y: 1010 },
  'woodland-tree-3': { x: 1410, y: 1450 },
  'woodland-tree-4': { x: 1810, y: 1600 },
  'woodland-tree-5': { x: 1570, y: 1640 },
  'cove-dock': { x: 2100, y: 1390 },
  'cove-shelter': { x: 1980, y: 1160 },
  'cove-bench': { x: 1985, y: 1650 },
  'cove-sign': { x: 2440, y: 1160 },
  'cove-rock-1': { x: 1980, y: 1450 },
  'cove-rock-2': { x: 2410, y: 1570 },
  'cove-tree-1': { x: 1980, y: 1640 },
  'cove-tree-2': { x: 2180, y: 1160 },
  'tent-hedge-west': { x: 150, y: 1230, width: 610 },
  'tent-hedge-east': { x: 930, y: 1230, width: 410 },
  'lunch-sign': { x: 1230, y: 1510 },
};

const NPC_PLACEMENTS: Record<string, PlanPoint> = {
  gundula: { x: 1080, y: 1410 },
  uli: { x: 955, y: 1365 },
  manni: { x: 465, y: 930 },
  ronny: { x: 260, y: 930 },
  andre: { x: 455, y: 1060 },
  rene: { x: 640, y: 1060 },
  lars: { x: 1015, y: 1055 },
  danny: { x: 1190, y: 1060 },
  gregor: { x: 520, y: 540 },
  masl: { x: 1790, y: 675 },
  felix: { x: 2050, y: 835 },
  schubert: { x: 1510, y: 1530 },
  schima: { x: 2040, y: 1600 },
  susi: { x: 1760, y: 610 },
  jule: { x: 2050, y: 790 },
  kira: { x: 1090, y: 555 },
};

const ENTRANCE_PLACEMENTS: Record<string, PlanPoint> = {
  'reception-door': { x: 1170, y: 1490 },
  'sanitary-door': { x: 292, y: 980 },
  'home-door': { x: 258, y: 1210 },
  'party-door': { x: 1645, y: 535 },
};

const LANDMARK_PLACEMENTS: Record<string, PlanPoint> = {
  'notice-board': { x: 980, y: 1450 },
  campfire: { x: 600, y: 1010 },
  'clubhouse-wall': { x: 410, y: 290 },
  'festival-lights': { x: 1740, y: 545 },
  'lake-lookout': { x: 2380, y: 535 },
  'service-map': { x: 1810, y: 1250 },
  'cove-echo': { x: 2320, y: 1425 },
};

let applied = false;

export function applyCampgroundPlanLayout(): void {
  if (applied) return;

  for (const object of EXPANDED_WORLD_OBJECTS) {
    const placement = OBJECT_PLACEMENTS[object.id];
    if (placement) Object.assign(object, placement);
  }
  for (const npc of EXPANDED_NPCS) {
    const placement = NPC_PLACEMENTS[npc.id];
    if (placement) Object.assign(npc, placement);
  }
  for (const entrance of EXPANDED_ENTRANCES) {
    const placement = ENTRANCE_PLACEMENTS[entrance.id];
    if (placement) Object.assign(entrance, placement);
  }
  for (const landmark of LANDMARKS) {
    const placement = LANDMARK_PLACEMENTS[landmark.id];
    if (placement) Object.assign(landmark, placement);
  }

  Object.assign(CAMPFIRE_POSITION as unknown as { x: number; y: number; safeRadius: number }, {
    x: LANDMARK_PLACEMENTS.campfire.x,
    y: LANDMARK_PLACEMENTS.campfire.y,
    safeRadius: 70,
  });

  const arrival = ARRIVAL_POSITIONS as unknown as Record<string, PlanPoint>;
  Object.assign(arrival.trunk, { x: 650, y: 1590 });
  Object.assign(arrival.reservationBoard, LANDMARK_PLACEMENTS['notice-board']);
  Object.assign(arrival.gundula, NPC_PLACEMENTS.gundula);
  Object.assign(arrival.uli, NPC_PLACEMENTS.uli);
  Object.assign(arrival.gateDebate, { x: 835, y: 1325 });
  Object.assign(arrival.taucherplatz, { x: 1110, y: 1015 });
  Object.assign(arrival.powerBox, { x: 1270, y: 975 });
  Object.assign(arrival.drinks, { x: 1080, y: 1110 });
  Object.assign(arrival.tents, { x: 970, y: 1140 });
  Object.assign(arrival.cable, { x: 1225, y: 1110 });
  Object.assign(arrival.firstBeer, { x: 1110, y: 1170 });
  Object.assign(arrival.homeDoor, ENTRANCE_PLACEMENTS['home-door']);

  applied = true;
}

export function roadBounds(road: PlanRoad): Bounds {
  const from = CAMP_ROAD_NODES[road.from];
  const to = CAMP_ROAD_NODES[road.to];
  const half = road.width / 2;
  return {
    x: Math.min(from.x, to.x) - half,
    y: Math.min(from.y, to.y) - half,
    width: Math.abs(to.x - from.x) + road.width,
    height: Math.abs(to.y - from.y) + road.width,
  };
}

export function validateCampgroundPlan(): string[] {
  applyCampgroundPlanLayout();
  const errors: string[] = [];
  const connected = new Set<string>(['entrance']);
  let changed = true;
  while (changed) {
    changed = false;
    for (const road of CAMP_ROADS) {
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
  for (const node of Object.keys(CAMP_ROAD_NODES)) {
    if (!connected.has(node)) errors.push(`Disconnected road node: ${node}`);
  }

  for (const object of EXPANDED_WORLD_OBJECTS) {
    const region = WORLD_REGIONS.find((entry) => entry.id === object.regionId);
    if (!region || !contains(region.bounds, object.x + object.width / 2, object.y + object.height / 2)) {
      errors.push(`Object outside district: ${object.id}`);
    }
  }

  const roads = CAMP_ROADS.map((road) => ({ id: road.id, bounds: roadBounds(road) }));
  for (const object of EXPANDED_WORLD_OBJECTS) {
    if (object.solid === false || ['sign', 'lantern', 'flowerbed', 'dock', 'fence'].includes(object.kind)) continue;
    const footprint = collisionFootprint(object);
    for (const road of roads) {
      if (overlaps(footprint, road.bounds)) errors.push(`${road.id} blocked by object ${object.id}`);
    }
  }
  for (const npc of EXPANDED_NPCS) {
    for (const road of roads) {
      if (contains(road.bounds, npc.x, npc.y)) errors.push(`${road.id} blocked by npc ${npc.id}`);
    }
  }

  for (const entrance of EXPANDED_ENTRANCES) {
    const nearestRoad = roads.reduce((best, road) => Math.min(best, distanceToBounds(entrance, road.bounds)), Number.POSITIVE_INFINITY);
    if (nearestRoad > 110) errors.push(`Entrance lacks a path connection: ${entrance.id}`);
  }

  return [...new Set(errors)];
}

export function planPlacement(id: string): PlanPoint | null {
  const placement = OBJECT_PLACEMENTS[id] ?? NPC_PLACEMENTS[id] ?? ENTRANCE_PLACEMENTS[id] ?? LANDMARK_PLACEMENTS[id];
  return placement ? { x: placement.x, y: placement.y } : null;
}

export function majorObjectIds(): string[] {
  return Object.keys(OBJECT_PLACEMENTS);
}

function contains(bounds: Bounds, x: number, y: number): boolean {
  return x >= bounds.x && x <= bounds.x + bounds.width && y >= bounds.y && y <= bounds.y + bounds.height;
}

function overlaps(a: Bounds, b: Bounds): boolean {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

function distanceToBounds(point: PlanPoint, bounds: Bounds): number {
  const x = Math.max(bounds.x, Math.min(point.x, bounds.x + bounds.width));
  const y = Math.max(bounds.y, Math.min(point.y, bounds.y + bounds.height));
  return Math.hypot(point.x - x, point.y - y);
}

export function plannedCollisionFootprint(id: string): Bounds | null {
  const object = EXPANDED_WORLD_OBJECTS.find((entry) => entry.id === id) as ExpandedWorldObject | undefined;
  return object ? collisionFootprint(object) : null;
}

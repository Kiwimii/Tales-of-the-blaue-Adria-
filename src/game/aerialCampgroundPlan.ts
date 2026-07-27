import type { Bounds, RegionId } from './worldV2';

export interface PlanPoint { x: number; y: number; }
export interface PlanRoad { id: string; from: AerialNodeId; to: AerialNodeId; width: number; surface: 'asphalt' | 'gravel' | 'sand'; }
export interface PlanPolygon { id: string; points: PlanPoint[]; fill: number; border: number; }
export interface PlanPitch extends Bounds { id: string; label?: string; }
export interface PlanFence extends Bounds { id: string; }
export interface Placement extends PlanPoint { width?: number; height?: number; }
export interface PlanArea extends Bounds { id: string; label: string; regionId: RegionId; fill: number; border: number; }

export const AERIAL_REGION_LAYOUT: Record<RegionId, Bounds> = {
  arrival: { x: 450, y: 1300, width: 950, height: 500 }, north: { x: 0, y: 0, width: 1400, height: 700 }, central: { x: 0, y: 700, width: 1400, height: 680 },
  festival: { x: 1400, y: 0, width: 550, height: 1000 }, woodland: { x: 1400, y: 1000, width: 550, height: 800 }, beach: { x: 1950, y: 0, width: 650, height: 1100 }, cove: { x: 1950, y: 1100, width: 650, height: 700 },
};
export const AERIAL_SITE_POLYGONS: PlanPolygon[] = [
  { id: 'campground-main', fill: 0x678b59, border: 0x355f42, points: [{ x: 0, y: 0 }, { x: 1950, y: 0 }, { x: 1950, y: 1300 }, { x: 1400, y: 1300 }, { x: 1400, y: 1800 }, { x: 450, y: 1800 }, { x: 450, y: 1300 }, { x: 0, y: 1300 }] },
  { id: 'arrival-apron', fill: 0x748175, border: 0x465f4c, points: [{ x: 450, y: 1300 }, { x: 1400, y: 1300 }, { x: 1400, y: 1800 }, { x: 450, y: 1800 }] },
  { id: 'beach-strip', fill: 0xd8c487, border: 0xb1945c, points: [{ x: 1950, y: 0 }, { x: 2250, y: 0 }, { x: 2250, y: 1100 }, { x: 1950, y: 1100 }] },
  { id: 'cove-strip', fill: 0x5b8061, border: 0x31563f, points: [{ x: 1950, y: 1100 }, { x: 2220, y: 1100 }, { x: 2220, y: 1800 }, { x: 1950, y: 1800 }] },
];
export const AERIAL_WATER_POLYGONS: PlanPolygon[] = [
  { id: 'main-lake', fill: 0x285e78, border: 0x4a91a6, points: [{ x: 2250, y: 0 }, { x: 2600, y: 0 }, { x: 2600, y: 1100 }, { x: 2250, y: 1100 }] },
  { id: 'cove-water', fill: 0x2b6e83, border: 0x57a2ae, points: [{ x: 2220, y: 1100 }, { x: 2600, y: 1100 }, { x: 2600, y: 1800 }, { x: 2220, y: 1800 }] },
];

export const AERIAL_NODES = {
  entrance: { x: 900, y: 1760 }, parkingSouth: { x: 900, y: 1650 }, parkingWest: { x: 550, y: 1650 }, parkingEast: { x: 1200, y: 1650 },
  gate: { x: 900, y: 1400 }, receptionJunction: { x: 1130, y: 1400 }, receptionDoor: { x: 1130, y: 1420 }, mainSouth: { x: 900, y: 1300 },
  middleHub: { x: 900, y: 950 }, upperHub: { x: 900, y: 650 }, northHub: { x: 900, y: 300 },
  middleWest: { x: 200, y: 950 }, middleEast: { x: 1350, y: 950 }, upperWest: { x: 200, y: 650 }, upperEast: { x: 1350, y: 650 }, northWest: { x: 200, y: 300 }, northEast: { x: 1350, y: 300 },
  tentAccessTurn: { x: 40, y: 950 }, homeApproach: { x: 40, y: 1160 }, homeDoorNode: { x: 150, y: 1160 },
  festivalWest: { x: 1450, y: 650 }, festivalCenter: { x: 1750, y: 650 }, festivalSouth: { x: 1750, y: 950 },
  beachGateInside: { x: 1900, y: 650 }, beachGateOutside: { x: 2000, y: 650 }, beachPromenadeNorth: { x: 2000, y: 400 }, beachNorth: { x: 2100, y: 400 }, beachPromenadeSouth: { x: 2000, y: 900 }, beachSouth: { x: 2100, y: 900 }, dockTurn: { x: 2100, y: 500 }, mainDock: { x: 2200, y: 500 },
  serviceWest: { x: 1450, y: 1300 }, serviceEast: { x: 1750, y: 1300 }, serviceSouth: { x: 1750, y: 1450 }, coveGate: { x: 1950, y: 1450 }, coveDock: { x: 2200, y: 1450 },
} as const satisfies Record<string, PlanPoint>;
export type AerialNodeId = keyof typeof AERIAL_NODES;

export const AERIAL_ROADS: PlanRoad[] = [
  ['arrival-drive', 'entrance', 'parkingSouth', 110, 'asphalt'], ['parking-row-west', 'parkingWest', 'parkingSouth', 100, 'asphalt'], ['parking-row-east', 'parkingSouth', 'parkingEast', 100, 'asphalt'],
  ['gate-approach', 'parkingSouth', 'gate', 90, 'asphalt'], ['reception-court', 'gate', 'receptionJunction', 70, 'gravel'], ['reception-walk', 'receptionJunction', 'receptionDoor', 48, 'gravel'],
  ['main-entry', 'gate', 'mainSouth', 76, 'gravel'], ['south-spine', 'mainSouth', 'middleHub', 72, 'gravel'], ['central-spine', 'middleHub', 'upperHub', 70, 'gravel'], ['north-spine', 'upperHub', 'northHub', 66, 'gravel'],
  ['middle-row-west', 'middleWest', 'middleHub', 66, 'gravel'], ['middle-row-east', 'middleHub', 'middleEast', 66, 'gravel'], ['tent-row-link', 'middleWest', 'tentAccessTurn', 48, 'gravel'], ['tent-side-path', 'tentAccessTurn', 'homeApproach', 48, 'gravel'], ['home-door-walk', 'homeApproach', 'homeDoorNode', 42, 'gravel'],
  ['upper-row-west', 'upperWest', 'upperHub', 64, 'gravel'], ['upper-row-east', 'upperHub', 'upperEast', 64, 'gravel'], ['north-row-west', 'northWest', 'northHub', 62, 'gravel'], ['north-row-east', 'northHub', 'northEast', 62, 'gravel'],
  ['festival-entry', 'upperEast', 'festivalWest', 60, 'gravel'], ['festival-cross', 'festivalWest', 'festivalCenter', 64, 'gravel'], ['festival-side', 'festivalCenter', 'festivalSouth', 60, 'gravel'], ['festival-return', 'festivalSouth', 'middleEast', 64, 'gravel'],
  ['beach-approach', 'festivalCenter', 'beachGateInside', 58, 'gravel'], ['beach-crossing', 'beachGateInside', 'beachGateOutside', 52, 'sand'], ['beach-north-spur', 'beachGateOutside', 'beachPromenadeNorth', 52, 'sand'], ['beach-north-front', 'beachPromenadeNorth', 'beachNorth', 50, 'sand'],
  ['dock-vertical', 'beachNorth', 'dockTurn', 48, 'sand'], ['dock-approach', 'dockTurn', 'mainDock', 48, 'sand'], ['beach-south-spur', 'beachGateOutside', 'beachPromenadeSouth', 52, 'sand'], ['beach-south-front', 'beachPromenadeSouth', 'beachSouth', 50, 'sand'],
  ['service-entry', 'mainSouth', 'serviceWest', 64, 'gravel'], ['service-cross', 'serviceWest', 'serviceEast', 64, 'gravel'], ['service-side', 'serviceEast', 'serviceSouth', 60, 'gravel'], ['cove-approach', 'serviceSouth', 'coveGate', 54, 'gravel'], ['cove-dock-path', 'coveGate', 'coveDock', 50, 'sand'],
].map(([id, from, to, width, surface]) => ({ id, from, to, width, surface } as PlanRoad));

export const AERIAL_FENCE_SEGMENTS: PlanFence[] = [{ id: 'camp-beach-fence-north', x: 1938, y: 0, width: 22, height: 600 }, { id: 'camp-beach-fence-south', x: 1938, y: 720, width: 22, height: 380 }];
export const BEACH_GATE = { x: 1938, y: 600, width: 22, height: 120 } as const;
export const AERIAL_PITCHES: PlanPitch[] = [
  { id: 'clubhouse', x: 40, y: 40, width: 350, height: 240, label: 'ADRIA-KLAUSE' }, { id: 'north-west', x: 420, y: 40, width: 260, height: 240 }, { id: 'north-east', x: 960, y: 40, width: 300, height: 240 },
  { id: 'north-social', x: 40, y: 340, width: 1320, height: 260 }, { id: 'services', x: 40, y: 690, width: 1320, height: 230 }, { id: 'taucher', x: 40, y: 980, width: 1320, height: 300, label: 'TAUCHERPLATZ' },
  { id: 'festival', x: 1420, y: 40, width: 500, height: 910, label: 'FESTWIESE' }, { id: 'service', x: 1420, y: 1030, width: 500, height: 720 },
];
export const TAUCHER_PITCH_BOUNDS: Bounds = { x: 40, y: 980, width: 1320, height: 300 };
export const ARRIVAL_CAR_POSITION: PlanPoint = { x: 900, y: 1600 };
export const TAUCHER_CAR_POSITION: PlanPoint = { x: 1280, y: 1190 };

export const AERIAL_FUNCTIONAL_AREAS = {
  parking: { id: 'parking', label: 'PARKPLATZ UND ANKUNFT', regionId: 'arrival', x: 450, y: 1480, width: 540, height: 300, fill: 0x7d8179, border: 0xc9c0a0 },
  reception: { id: 'reception', label: 'REZEPTION UND SCHRANKENHOF', regionId: 'arrival', x: 980, y: 1320, width: 400, height: 290, fill: 0x788a72, border: 0xd5c689 },
  'north-pitches': { id: 'north-pitches', label: 'OBERE STELLPLATZREIHE', regionId: 'north', x: 40, y: 40, width: 1320, height: 260, fill: 0x6f965f, border: 0xa8c782 },
  'north-social': { id: 'north-social', label: 'ADRIA-KLAUSE UND SITZBEREICH', regionId: 'north', x: 40, y: 340, width: 1320, height: 370, fill: 0x739861, border: 0xb3ca8d },
  'central-services': { id: 'central-services', label: 'SANITÄR UND DAUERCAMPER', regionId: 'central', x: 40, y: 690, width: 1320, height: 230, fill: 0x759b63, border: 0xb6ce8f },
  'taucher-tent-row': { id: 'taucher-tent-row', label: 'TAUCHERPLATZ UND ZELTGRUPPE', regionId: 'central', x: 40, y: 980, width: 1320, height: 300, fill: 0x82a96a, border: 0xf0d77e },
  'festival-stage': { id: 'festival-stage', label: 'BÜHNE UND VERANSTALTUNGSFLÄCHE', regionId: 'festival', x: 1420, y: 40, width: 500, height: 280, fill: 0x84945c, border: 0xd8ba6d },
  'festival-social': { id: 'festival-social', label: 'PARTYZELT UND FESTWIESE', regionId: 'festival', x: 1420, y: 350, width: 500, height: 600, fill: 0x8d995f, border: 0xe2c779 },
  'beach-north': { id: 'beach-north', label: 'WACHE UND HAUPTSTEG', regionId: 'beach', x: 1960, y: 40, width: 600, height: 500, fill: 0xdac88f, border: 0xf2dfa7 },
  'beach-south': { id: 'beach-south', label: 'STRANDTOR UND KIOSK', regionId: 'beach', x: 1960, y: 560, width: 600, height: 520, fill: 0xdfcd94, border: 0xf5e6b8 },
  'woodland-service': { id: 'woodland-service', label: 'SERVICEHOF UND WALDSAUM', regionId: 'woodland', x: 1420, y: 1030, width: 500, height: 720, fill: 0x547858, border: 0x89aa7d },
  'cove-retreat': { id: 'cove-retreat', label: 'RUHIGE BUCHT', regionId: 'cove', x: 1960, y: 1120, width: 600, height: 680, fill: 0x5d8066, border: 0x9bb798 },
} as const satisfies Record<string, PlanArea>;
export type FunctionalAreaId = keyof typeof AERIAL_FUNCTIONAL_AREAS;

export const OBJECT_PLACEMENTS: Record<string, Placement> = {
  reception: { x: 1000, y: 1430, width: 260, height: 155 }, 'arrival-sign': { x: 650, y: 1690, width: 115, height: 70 }, 'parking-fence-left': { x: 500, y: 1500, width: 22, height: 230 }, 'parking-fence-right': { x: 970, y: 1500, width: 22, height: 230 },
  'arrival-flowerbed': { x: 1280, y: 1460, width: 90, height: 70 }, 'arrival-lantern-1': { x: 850, y: 1530, width: 24, height: 70 }, 'arrival-lantern-2': { x: 1300, y: 1390, width: 24, height: 70 }, 'lunch-sign': { x: 1240, y: 1340, width: 105, height: 65 },
  sanitary: { x: 80, y: 720, width: 255, height: 170 }, 'central-camper': { x: 400, y: 720, width: 220, height: 108 },
  'home-tent': { x: 80, y: 1030, width: 145, height: 120 }, 'tent-andre': { x: 235, y: 1030, width: 135, height: 105 }, 'tent-rene': { x: 380, y: 1030, width: 135, height: 105 }, 'tent-lars': { x: 525, y: 1030, width: 135, height: 110 }, 'tent-danny': { x: 670, y: 1030, width: 135, height: 105 },
  'central-table': { x: 980, y: 1030, width: 145, height: 72 }, 'central-bench': { x: 1150, y: 1120, width: 105, height: 38 }, 'central-sign': { x: 50, y: 950, width: 92, height: 62 },
  'central-tree-1': { x: 20, y: 700, width: 95, height: 105 }, 'central-tree-2': { x: 1280, y: 1020, width: 100, height: 112 }, 'central-tree-3': { x: 20, y: 1220, width: 82, height: 92 }, 'central-flowerbed': { x: 1050, y: 1220, width: 210, height: 52 },
  'tent-hedge-west': { x: 80, y: 990, width: 370, height: 24 }, 'tent-hedge-east': { x: 560, y: 990, width: 280, height: 24 },
  clubhouse: { x: 50, y: 50, width: 320, height: 190 }, 'north-camper-1': { x: 430, y: 90, width: 220, height: 110 }, 'north-camper-2': { x: 980, y: 90, width: 220, height: 110 }, 'north-camper-3': { x: 1050, y: 420, width: 220, height: 108 },
  'north-table-1': { x: 100, y: 400, width: 140, height: 68 }, 'north-table-2': { x: 350, y: 420, width: 140, height: 68 }, 'north-bench-1': { x: 600, y: 500, width: 115, height: 40 }, 'north-sign': { x: 50, y: 560, width: 96, height: 64 },
  'north-tree-1': { x: 10, y: 20, width: 102, height: 116 }, 'north-tree-2': { x: 1260, y: 20, width: 112, height: 125 }, 'north-tree-3': { x: 1280, y: 480, width: 92, height: 108 }, 'north-tree-4': { x: 10, y: 520, width: 100, height: 115 }, 'north-fence': { x: 0, y: 600, width: 600, height: 16 },
  'festival-stage': { x: 1450, y: 60, width: 390, height: 150 }, party: { x: 1600, y: 400, width: 300, height: 210 }, 'festival-kiosk': { x: 1450, y: 760, width: 180, height: 115 },
  'festival-table-1': { x: 1450, y: 700, width: 145, height: 70 }, 'festival-table-2': { x: 1450, y: 890, width: 145, height: 70 }, 'festival-lantern-1': { x: 1450, y: 620, width: 24, height: 78 }, 'festival-lantern-2': { x: 1900, y: 620, width: 24, height: 78 }, 'festival-sign': { x: 1830, y: 900, width: 100, height: 66 },
  lifeguard: { x: 2050, y: 180, width: 160, height: 125 }, 'main-dock': { x: 2200, y: 460, width: 300, height: 72 }, 'beach-bench-1': { x: 2050, y: 520, width: 115, height: 40 },
  'beach-kiosk': { x: 2050, y: 720, width: 185, height: 120 }, 'beach-bench-2': { x: 2050, y: 850, width: 115, height: 40 }, 'beach-table': { x: 2050, y: 950, width: 150, height: 72 }, 'beach-sign': { x: 1960, y: 650, width: 92, height: 62 }, 'beach-rock-1': { x: 1980, y: 1000, width: 80, height: 58 }, 'beach-rock-2': { x: 2140, y: 1020, width: 62, height: 48 },
  workshop: { x: 1450, y: 1520, width: 280, height: 170 }, 'wood-shed': { x: 1750, y: 1550, width: 160, height: 105 }, 'woodland-bench': { x: 1500, y: 1400, width: 120, height: 42 }, 'woodland-sign': { x: 1800, y: 1150, width: 104, height: 68 },
  'woodland-tree-1': { x: 1400, y: 1020, width: 118, height: 132 }, 'woodland-tree-2': { x: 1840, y: 1020, width: 120, height: 138 }, 'woodland-tree-3': { x: 1400, y: 1660, width: 125, height: 140 }, 'woodland-tree-4': { x: 1830, y: 1660, width: 120, height: 136 }, 'woodland-tree-5': { x: 1600, y: 1660, width: 108, height: 125 },
  'cove-shelter': { x: 1980, y: 1180, width: 190, height: 120 }, 'cove-dock': { x: 2200, y: 1420, width: 300, height: 65 }, 'cove-bench': { x: 2000, y: 1650, width: 125, height: 42 }, 'cove-sign': { x: 1960, y: 1380, width: 108, height: 70 },
  'cove-rock-1': { x: 1980, y: 1500, width: 95, height: 68 }, 'cove-rock-2': { x: 2120, y: 1600, width: 115, height: 80 }, 'cove-tree-1': { x: 1960, y: 1700, width: 118, height: 100 }, 'cove-tree-2': { x: 2120, y: 1700, width: 120, height: 100 },
};

export const NPC_PLACEMENTS: Record<string, PlanPoint> = {
  gundula: { x: 1040, y: 1350 }, uli: { x: 1200, y: 1360 }, manni: { x: 1080, y: 1180 }, ronny: { x: 1040, y: 880 },
  andre: { x: 302, y: 1190 }, rene: { x: 447, y: 1190 }, lars: { x: 592, y: 1190 }, danny: { x: 737, y: 1190 },
  gregor: { x: 600, y: 520 }, masl: { x: 1830, y: 720 }, felix: { x: 2170, y: 940 }, schubert: { x: 1600, y: 1220 }, schima: { x: 2080, y: 1550 }, susi: { x: 1650, y: 850 }, jule: { x: 2170, y: 360 }, kira: { x: 300, y: 500 },
};
export const ENTRANCE_PLACEMENTS: Record<string, PlanPoint> = { 'reception-door': { x: 1130, y: 1420 }, 'sanitary-door': { x: 208, y: 905 }, 'home-door': { x: 150, y: 1160 }, 'party-door': { x: 1750, y: 625 } };
export const LANDMARK_PLACEMENTS: Record<string, PlanPoint> = { 'notice-board': { x: 1280, y: 1360 }, campfire: { x: 1120, y: 1080 }, 'clubhouse-wall': { x: 210, y: 280 }, 'festival-lights': { x: 1680, y: 650 }, 'lake-lookout': { x: 2160, y: 500 }, 'service-map': { x: 1800, y: 1260 }, 'cove-echo': { x: 2200, y: 1450 } };

export const OBJECT_AREA_ASSIGNMENTS: Record<string, FunctionalAreaId> = {};
assignObjects('parking', 'arrival-sign', 'parking-fence-left', 'parking-fence-right', 'arrival-lantern-1'); assignObjects('reception', 'reception', 'arrival-flowerbed', 'arrival-lantern-2', 'lunch-sign');
assignObjects('north-pitches', 'clubhouse', 'north-camper-1', 'north-camper-2', 'north-tree-1', 'north-tree-2'); assignObjects('north-social', 'north-camper-3', 'north-table-1', 'north-table-2', 'north-bench-1', 'north-sign', 'north-tree-3', 'north-tree-4', 'north-fence');
assignObjects('central-services', 'sanitary', 'central-camper', 'central-tree-1'); assignObjects('taucher-tent-row', 'home-tent', 'tent-andre', 'tent-rene', 'tent-lars', 'tent-danny', 'central-table', 'central-bench', 'central-sign', 'central-tree-2', 'central-tree-3', 'central-flowerbed', 'tent-hedge-west', 'tent-hedge-east');
assignObjects('festival-stage', 'festival-stage'); assignObjects('festival-social', 'party', 'festival-kiosk', 'festival-table-1', 'festival-table-2', 'festival-lantern-1', 'festival-lantern-2', 'festival-sign');
assignObjects('beach-north', 'lifeguard', 'main-dock', 'beach-bench-1'); assignObjects('beach-south', 'beach-kiosk', 'beach-bench-2', 'beach-table', 'beach-sign', 'beach-rock-1', 'beach-rock-2');
assignObjects('woodland-service', 'workshop', 'wood-shed', 'woodland-bench', 'woodland-sign', 'woodland-tree-1', 'woodland-tree-2', 'woodland-tree-3', 'woodland-tree-4', 'woodland-tree-5'); assignObjects('cove-retreat', 'cove-shelter', 'cove-dock', 'cove-bench', 'cove-sign', 'cove-rock-1', 'cove-rock-2', 'cove-tree-1', 'cove-tree-2');
function assignObjects(area: FunctionalAreaId, ...ids: string[]): void { ids.forEach((id) => { OBJECT_AREA_ASSIGNMENTS[id] = area; }); }
export const NPC_AREA_ASSIGNMENTS: Record<string, FunctionalAreaId> = {
  gundula: 'reception', uli: 'reception', manni: 'taucher-tent-row', ronny: 'central-services', andre: 'taucher-tent-row', rene: 'taucher-tent-row', lars: 'taucher-tent-row', danny: 'taucher-tent-row',
  gregor: 'north-social', masl: 'festival-social', felix: 'beach-south', schubert: 'woodland-service', schima: 'cove-retreat', susi: 'festival-social', jule: 'beach-north', kira: 'north-social',
};
export const ARRIVAL_STORY_PLACEMENTS = {
  trunk: { x: 900, y: 1600 }, reservationBoard: { x: 1280, y: 1360 }, gundula: { x: 1040, y: 1350 }, uli: { x: 1200, y: 1360 }, gateDebate: { x: 900, y: 1400 }, taucherplatz: { x: 1120, y: 1180 },
  powerBox: { x: 1300, y: 1160 }, drinks: { x: 150, y: 1180 }, tents: { x: 470, y: 1120 }, cable: { x: 780, y: 1180 }, firstBeer: { x: 1120, y: 1080 }, homeDoor: { x: 150, y: 1160 },
} as const;

export function pointInPolygon(point: PlanPoint, polygon: PlanPoint[]): boolean {
  let inside = false;
  for (let index = 0, previous = polygon.length - 1; index < polygon.length; previous = index, index += 1) {
    const a = polygon[index]; const b = polygon[previous];
    const crosses = ((a.y > point.y) !== (b.y > point.y)) && point.x < ((b.x - a.x) * (point.y - a.y)) / ((b.y - a.y) || 1) + a.x;
    if (crosses) inside = !inside;
  }
  return inside;
}

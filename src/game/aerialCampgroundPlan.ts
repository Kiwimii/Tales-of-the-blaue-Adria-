import type { Bounds, RegionId } from './worldV2';

export interface PlanPoint { x: number; y: number; }
export interface PlanRoad { id: string; from: AerialNodeId; to: AerialNodeId; width: number; surface: 'asphalt' | 'gravel' | 'sand'; }
export interface PlanPolygon { id: string; points: PlanPoint[]; fill: number; border: number; }
export interface PlanPitch extends Bounds { id: string; label?: string; }
export interface PlanFence extends Bounds { id: string; }
export interface Placement extends PlanPoint { width?: number; height?: number; }
export interface PlanArea extends Bounds { id: FunctionalAreaId; label: string; regionId: RegionId; fill: number; border: number; }

export const AERIAL_REGION_LAYOUT: Record<RegionId, Bounds> = {
  arrival: { x: 1700, y: 0, width: 900, height: 800 },
  north: { x: 850, y: 180, width: 850, height: 540 },
  central: { x: 850, y: 700, width: 850, height: 710 },
  festival: { x: 1700, y: 700, width: 550, height: 600 },
  woodland: { x: 850, y: 1300, width: 1400, height: 500 },
  beach: { x: 150, y: 250, width: 700, height: 1150 },
  cove: { x: 0, y: 1400, width: 850, height: 400 },
};

export const AERIAL_SITE_POLYGONS: PlanPolygon[] = [
  { id: 'campground-main', fill: 0x678b59, border: 0x355f42, points: [{ x: 850, y: 180 }, { x: 2250, y: 180 }, { x: 2250, y: 1360 }, { x: 2100, y: 1580 }, { x: 900, y: 1580 }, { x: 850, y: 1450 }] },
  { id: 'arrival-apron', fill: 0x748175, border: 0x465f4c, points: [{ x: 1700, y: 80 }, { x: 2500, y: 80 }, { x: 2500, y: 600 }, { x: 2250, y: 700 }, { x: 1700, y: 700 }] },
  { id: 'main-beach', fill: 0xd8c487, border: 0xb1945c, points: [{ x: 420, y: 260 }, { x: 850, y: 250 }, { x: 850, y: 1400 }, { x: 650, y: 1450 }, { x: 350, y: 1400 }, { x: 190, y: 1180 }, { x: 150, y: 750 }, { x: 220, y: 420 }] },
  { id: 'south-cove-land', fill: 0x5b8061, border: 0x31563f, points: [{ x: 0, y: 1400 }, { x: 650, y: 1400 }, { x: 850, y: 1450 }, { x: 800, y: 1780 }, { x: 0, y: 1780 }] },
];

export const AERIAL_WATER_POLYGONS: PlanPolygon[] = [
  { id: 'west-water', fill: 0x285e78, border: 0x4a91a6, points: [{ x: 0, y: 0 }, { x: 700, y: 0 }, { x: 420, y: 260 }, { x: 220, y: 420 }, { x: 150, y: 750 }, { x: 190, y: 1180 }, { x: 350, y: 1400 }, { x: 0, y: 1400 }] },
  { id: 'south-water', fill: 0x2b6e83, border: 0x57a2ae, points: [{ x: 0, y: 1780 }, { x: 800, y: 1780 }, { x: 900, y: 1580 }, { x: 2100, y: 1580 }, { x: 2250, y: 1360 }, { x: 2600, y: 1360 }, { x: 2600, y: 1800 }, { x: 0, y: 1800 }] },
];

export const AERIAL_NODES = {
  entrance: { x: 2440, y: 90 },
  arrivalSouth: { x: 2440, y: 300 },
  parkingNorth: { x: 2250, y: 300 },
  parking: { x: 2250, y: 500 },
  gateApproach: { x: 2050, y: 500 },
  gate: { x: 2050, y: 650 },
  receptionJunction: { x: 1850, y: 650 },
  receptionDoor: { x: 1850, y: 615 },
  mainNorth: { x: 1700, y: 650 },
  upperEast: { x: 1700, y: 500 },
  upperWest: { x: 1050, y: 500 },
  middleEast: { x: 1700, y: 900 },
  middleWest: { x: 1050, y: 900 },
  beachGateApproach: { x: 900, y: 900 },
  beachGateInside: { x: 900, y: 1000 },
  beachGateOutside: { x: 800, y: 1000 },
  kioskJunction: { x: 650, y: 1000 },
  kiosk: { x: 650, y: 1050 },
  lowerEast: { x: 1700, y: 1300 },
  taucherEntry: { x: 1650, y: 1300 },
  lowerWest: { x: 1050, y: 1300 },
  taucherCenter: { x: 1650, y: 1200 },
  festivalNorth: { x: 1950, y: 900 },
  festivalSouth: { x: 1950, y: 1300 },
  serviceEast: { x: 2100, y: 1500 },
  serviceHub: { x: 1700, y: 1500 },
  serviceWest: { x: 1050, y: 1500 },
  coveGate: { x: 850, y: 1500 },
  coveTurn: { x: 420, y: 1500 },
  coveDock: { x: 420, y: 1580 },
} as const satisfies Record<string, PlanPoint>;

export type AerialNodeId = keyof typeof AERIAL_NODES;

export const AERIAL_ROADS: PlanRoad[] = [
  { id: 'adria-access-road', from: 'entrance', to: 'arrivalSouth', width: 120, surface: 'asphalt' },
  { id: 'arrival-cross', from: 'arrivalSouth', to: 'parkingNorth', width: 110, surface: 'asphalt' },
  { id: 'parking-lane', from: 'parkingNorth', to: 'parking', width: 110, surface: 'asphalt' },
  { id: 'gate-cross', from: 'parking', to: 'gateApproach', width: 100, surface: 'asphalt' },
  { id: 'gate-approach', from: 'gateApproach', to: 'gate', width: 90, surface: 'asphalt' },
  { id: 'reception-court', from: 'gate', to: 'receptionJunction', width: 76, surface: 'gravel' },
  { id: 'reception-walk', from: 'receptionJunction', to: 'receptionDoor', width: 48, surface: 'gravel' },
  { id: 'main-entry', from: 'gate', to: 'mainNorth', width: 78, surface: 'gravel' },
  { id: 'upper-spine', from: 'mainNorth', to: 'upperEast', width: 64, surface: 'gravel' },
  { id: 'upper-row', from: 'upperEast', to: 'upperWest', width: 66, surface: 'gravel' },
  { id: 'west-row-link', from: 'upperWest', to: 'middleWest', width: 58, surface: 'gravel' },
  { id: 'central-spine', from: 'mainNorth', to: 'middleEast', width: 72, surface: 'gravel' },
  { id: 'middle-row', from: 'middleEast', to: 'middleWest', width: 68, surface: 'gravel' },
  { id: 'beach-approach', from: 'middleWest', to: 'beachGateApproach', width: 58, surface: 'gravel' },
  { id: 'beach-gate-inside', from: 'beachGateApproach', to: 'beachGateInside', width: 54, surface: 'gravel' },
  { id: 'beach-crossing', from: 'beachGateInside', to: 'beachGateOutside', width: 52, surface: 'sand' },
  { id: 'kiosk-cross', from: 'beachGateOutside', to: 'kioskJunction', width: 56, surface: 'sand' },
  { id: 'kiosk-path', from: 'kioskJunction', to: 'kiosk', width: 50, surface: 'sand' },
  { id: 'lower-spine', from: 'middleEast', to: 'lowerEast', width: 70, surface: 'gravel' },
  { id: 'lower-row-east', from: 'lowerEast', to: 'taucherEntry', width: 66, surface: 'gravel' },
  { id: 'lower-row-west', from: 'taucherEntry', to: 'lowerWest', width: 66, surface: 'gravel' },
  { id: 'taucher-access', from: 'taucherEntry', to: 'taucherCenter', width: 50, surface: 'gravel' },
  { id: 'festival-top', from: 'middleEast', to: 'festivalNorth', width: 64, surface: 'gravel' },
  { id: 'festival-side', from: 'festivalNorth', to: 'festivalSouth', width: 60, surface: 'gravel' },
  { id: 'festival-bottom', from: 'festivalSouth', to: 'lowerEast', width: 64, surface: 'gravel' },
  { id: 'service-spine', from: 'lowerEast', to: 'serviceHub', width: 64, surface: 'gravel' },
  { id: 'service-east', from: 'serviceHub', to: 'serviceEast', width: 64, surface: 'gravel' },
  { id: 'service-west', from: 'serviceHub', to: 'serviceWest', width: 64, surface: 'gravel' },
  { id: 'cove-connector', from: 'serviceWest', to: 'coveGate', width: 54, surface: 'gravel' },
  { id: 'cove-path', from: 'coveGate', to: 'coveTurn', width: 52, surface: 'sand' },
  { id: 'cove-dock-path', from: 'coveTurn', to: 'coveDock', width: 50, surface: 'sand' },
];

export const AERIAL_FENCE_SEGMENTS: PlanFence[] = [
  { id: 'camp-beach-fence-north', x: 840, y: 260, width: 20, height: 670 },
  { id: 'camp-beach-fence-south', x: 840, y: 1070, width: 20, height: 330 },
];
export const BEACH_GATE = { x: 840, y: 930, width: 20, height: 140 } as const;

export const AERIAL_PITCHES: PlanPitch[] = [
  { id: 'clubhouse', x: 900, y: 210, width: 300, height: 260, label: 'ADRIA-KLAUSE' },
  { id: 'north-1', x: 1230, y: 210, width: 210, height: 250 },
  { id: 'north-2', x: 1450, y: 210, width: 210, height: 250 },
  { id: 'north-social', x: 900, y: 530, width: 760, height: 170 },
  { id: 'services', x: 880, y: 690, width: 790, height: 210 },
  { id: 'taucher', x: 880, y: 930, width: 790, height: 440, label: 'TAUCHERPLATZ' },
  { id: 'festival', x: 1720, y: 690, width: 500, height: 590, label: 'FESTWIESE' },
  { id: 'service', x: 880, y: 1360, width: 1340, height: 390 },
];

export const TAUCHER_PITCH_BOUNDS: Bounds = { x: 880, y: 930, width: 790, height: 440 };
export const ARRIVAL_CAR_POSITION: PlanPoint = { x: 2250, y: 470 };
export const TAUCHER_CAR_POSITION: PlanPoint = { x: 1580, y: 1240 };

export const AERIAL_FUNCTIONAL_AREAS = {
  parking: { id: 'parking', label: 'ANFAHRT UND PARKEN', regionId: 'arrival', x: 2140, y: 140, width: 360, height: 420, fill: 0x7d8179, border: 0xc9c0a0 },
  reception: { id: 'reception', label: 'ANMELDUNG UND SCHRANKE', regionId: 'arrival', x: 1680, y: 420, width: 360, height: 360, fill: 0x788a72, border: 0xd5c689 },
  'north-pitches': { id: 'north-pitches', label: 'OBERE STELLPLATZREIHE', regionId: 'north', x: 880, y: 190, width: 790, height: 310, fill: 0x6f965f, border: 0xa8c782 },
  'north-social': { id: 'north-social', label: 'ADRIA-KLAUSE UND SITZBEREICH', regionId: 'north', x: 880, y: 530, width: 790, height: 190, fill: 0x739861, border: 0xb3ca8d },
  'central-services': { id: 'central-services', label: 'SANITÄR UND DAUERCAMPER', regionId: 'central', x: 880, y: 690, width: 790, height: 210, fill: 0x759b63, border: 0xb6ce8f },
  'central-common': { id: 'central-common', label: 'GEMEINSCHAFTSFLÄCHE', regionId: 'central', x: 880, y: 930, width: 790, height: 170, fill: 0x7da467, border: 0xd6c37d },
  'taucher-tent-row': { id: 'taucher-tent-row', label: 'TAUCHERPLATZ UND ZELTGRUPPE', regionId: 'central', x: 880, y: 1080, width: 790, height: 330, fill: 0x82a96a, border: 0xf0d77e },
  'festival-stage': { id: 'festival-stage', label: 'BÜHNE', regionId: 'festival', x: 1720, y: 690, width: 500, height: 200, fill: 0x84945c, border: 0xd8ba6d },
  'festival-social': { id: 'festival-social', label: 'FESTWIESE UND PARTYZELT', regionId: 'festival', x: 1720, y: 930, width: 500, height: 350, fill: 0x8d995f, border: 0xe2c779 },
  'beach-north': { id: 'beach-north', label: 'STEG UND WACHE', regionId: 'beach', x: 200, y: 400, width: 600, height: 330, fill: 0xdac88f, border: 0xf2dfa7 },
  'beach-social': { id: 'beach-social', label: 'STRANDBEREICH', regionId: 'beach', x: 400, y: 730, width: 450, height: 300, fill: 0xdfcd94, border: 0xf5e6b8 },
  'beach-gate': { id: 'beach-gate', label: 'STRANDTOR UND KIOSK', regionId: 'beach', x: 200, y: 1030, width: 630, height: 370, fill: 0xd7c184, border: 0xf0d89a },
  'woodland-service': { id: 'woodland-service', label: 'SERVICEHOF UND WALDSAUM', regionId: 'woodland', x: 880, y: 1360, width: 1340, height: 390, fill: 0x547858, border: 0x89aa7d },
  'cove-retreat': { id: 'cove-retreat', label: 'RUHIGE BUCHT', regionId: 'cove', x: 40, y: 1450, width: 780, height: 320, fill: 0x5d8066, border: 0x9bb798 },
} as const satisfies Record<string, PlanArea>;
export type FunctionalAreaId = keyof typeof AERIAL_FUNCTIONAL_AREAS;

export const OBJECT_PLACEMENTS: Record<string, Placement> = {
  'reception': { x: 1740, y: 420, width: 250, height: 150 },
  'arrival-sign': { x: 2300, y: 120, width: 115, height: 70 },
  'parking-fence-left': { x: 2140, y: 250, width: 22, height: 270 },
  'parking-fence-right': { x: 2420, y: 250, width: 22, height: 270 },
  'arrival-flowerbed': { x: 1710, y: 620, width: 150, height: 70 },
  'arrival-lantern-1': { x: 2020, y: 590, width: 24, height: 70 },
  'arrival-lantern-2': { x: 2130, y: 520, width: 24, height: 70 },
  'lunch-sign': { x: 1910, y: 720, width: 105, height: 65 },
  'sanitary': { x: 1090, y: 700, width: 230, height: 150 },
  'central-camper': { x: 1380, y: 720, width: 240, height: 110 },
  'central-table': { x: 1120, y: 950, width: 145, height: 72 },
  'central-bench': { x: 1290, y: 980, width: 105, height: 38 },
  'central-sign': { x: 880, y: 930, width: 92, height: 62 },
  'central-tree-1': { x: 870, y: 710, width: 95, height: 105 },
  'central-tree-2': { x: 1580, y: 950, width: 100, height: 112 },
  'central-tree-3': { x: 870, y: 1300, width: 82, height: 92 },
  'central-flowerbed': { x: 1240, y: 1360, width: 210, height: 52 },
  'home-tent': { x: 900, y: 1120, width: 145, height: 120 },
  'tent-andre': { x: 1055, y: 1120, width: 135, height: 105 },
  'tent-rene': { x: 1200, y: 1120, width: 135, height: 105 },
  'tent-lars': { x: 1345, y: 1120, width: 135, height: 110 },
  'tent-danny': { x: 1490, y: 1120, width: 135, height: 105 },
  'tent-hedge-west': { x: 900, y: 1080, width: 330, height: 24 },
  'tent-hedge-east': { x: 1370, y: 1080, width: 280, height: 24 },
  'clubhouse': { x: 900, y: 220, width: 300, height: 200 },
  'north-camper-1': { x: 1240, y: 250, width: 200, height: 110 },
  'north-camper-2': { x: 1450, y: 250, width: 200, height: 110 },
  'north-camper-3': { x: 1420, y: 550, width: 220, height: 108 },
  'north-table-1': { x: 950, y: 540, width: 140, height: 68 },
  'north-table-2': { x: 1130, y: 550, width: 140, height: 68 },
  'north-bench-1': { x: 1270, y: 620, width: 115, height: 40 },
  'north-sign': { x: 880, y: 620, width: 96, height: 64 },
  'north-tree-1': { x: 860, y: 200, width: 102, height: 116 },
  'north-tree-2': { x: 1590, y: 200, width: 112, height: 125 },
  'north-tree-3': { x: 1580, y: 560, width: 92, height: 108 },
  'north-tree-4': { x: 890, y: 560, width: 100, height: 115 },
  'north-fence': { x: 850, y: 690, width: 400, height: 22 },
  'festival-stage': { x: 1760, y: 710, width: 420, height: 140 },
  'party': { x: 1990, y: 950, width: 230, height: 210 },
  'festival-kiosk': { x: 1740, y: 1110, width: 170, height: 110 },
  'festival-table-1': { x: 1760, y: 950, width: 145, height: 70 },
  'festival-table-2': { x: 1770, y: 1035, width: 145, height: 70 },
  'festival-lantern-1': { x: 1730, y: 920, width: 24, height: 78 },
  'festival-lantern-2': { x: 2180, y: 920, width: 24, height: 78 },
  'festival-sign': { x: 1740, y: 1230, width: 100, height: 66 },
  'beach-kiosk': { x: 650, y: 1080, width: 180, height: 115 },
  'lifeguard': { x: 560, y: 500, width: 160, height: 125 },
  'main-dock': { x: 220, y: 460, width: 300, height: 72 },
  'beach-bench-1': { x: 560, y: 680, width: 115, height: 40 },
  'beach-bench-2': { x: 600, y: 850, width: 115, height: 40 },
  'beach-table': { x: 600, y: 950, width: 150, height: 72 },
  'beach-sign': { x: 760, y: 950, width: 92, height: 62 },
  'beach-rock-1': { x: 250, y: 1200, width: 80, height: 58 },
  'beach-rock-2': { x: 360, y: 1330, width: 62, height: 48 },
  'workshop': { x: 1740, y: 1540, width: 280, height: 170 },
  'wood-shed': { x: 2050, y: 1560, width: 160, height: 105 },
  'woodland-bench': { x: 1320, y: 1600, width: 120, height: 42 },
  'woodland-sign': { x: 2110, y: 1400, width: 104, height: 68 },
  'woodland-tree-1': { x: 880, y: 1370, width: 118, height: 132 },
  'woodland-tree-2': { x: 2130, y: 1360, width: 120, height: 138 },
  'woodland-tree-3': { x: 1050, y: 1660, width: 125, height: 140 },
  'woodland-tree-4': { x: 2110, y: 1660, width: 120, height: 136 },
  'woodland-tree-5': { x: 1450, y: 1660, width: 108, height: 125 },
  'cove-dock': { x: 220, y: 1540, width: 265, height: 65 },
  'cove-shelter': { x: 610, y: 1540, width: 190, height: 120 },
  'cove-bench': { x: 570, y: 1690, width: 125, height: 42 },
  'cove-sign': { x: 760, y: 1510, width: 108, height: 70 },
  'cove-rock-1': { x: 80, y: 1500, width: 95, height: 68 },
  'cove-rock-2': { x: 700, y: 1700, width: 115, height: 80 },
  'cove-tree-1': { x: 80, y: 1640, width: 118, height: 132 },
  'cove-tree-2': { x: 740, y: 1650, width: 120, height: 136 },
};

export const NPC_PLACEMENTS: Record<string, PlanPoint> = {
  gundula: { x: 1770, y: 720 },
  uli: { x: 1860, y: 720 },
  manni: { x: 1220, y: 1040 },
  ronny: { x: 1610, y: 960 },
  andre: { x: 970, y: 1250 },
  rene: { x: 1120, y: 1250 },
  lars: { x: 1265, y: 1250 },
  danny: { x: 1410, y: 1250 },
  gregor: { x: 1160, y: 630 },
  masl: { x: 2140, y: 1040 },
  felix: { x: 620, y: 900 },
  schubert: { x: 1640, y: 1440 },
  schima: { x: 650, y: 1660 },
  susi: { x: 1840, y: 1200 },
  jule: { x: 500, y: 700 },
  kira: { x: 995, y: 610 },
};

export const ENTRANCE_PLACEMENTS: Record<string, PlanPoint> = {
  'reception-door': { x: 1850, y: 615 },
  'sanitary-door': { x: 1205, y: 885 },
  'home-door': { x: 972, y: 1250 },
  'party-door': { x: 1985, y: 1060 },
};

export const LANDMARK_PLACEMENTS: Record<string, PlanPoint> = {
  'notice-board': { x: 1710, y: 710 },
  campfire: { x: 1450, y: 1000 },
  'clubhouse-wall': { x: 1050, y: 450 },
  'festival-lights': { x: 1830, y: 920 },
  'lake-lookout': { x: 350, y: 500 },
  'service-map': { x: 1850, y: 1440 },
  'cove-echo': { x: 420, y: 1580 },
};

export const OBJECT_AREA_ASSIGNMENTS: Record<string, FunctionalAreaId> = {
  reception: 'reception',
  'arrival-flowerbed': 'reception',
  'arrival-lantern-1': 'reception',
  'lunch-sign': 'reception',
  'arrival-sign': 'parking',
  'parking-fence-left': 'parking',
  'parking-fence-right': 'parking',
  'arrival-lantern-2': 'parking',
  clubhouse: 'north-pitches',
  'north-camper-1': 'north-pitches',
  'north-camper-2': 'north-pitches',
  'north-tree-1': 'north-pitches',
  'north-tree-2': 'north-pitches',
  'north-camper-3': 'north-social',
  'north-table-1': 'north-social',
  'north-table-2': 'north-social',
  'north-bench-1': 'north-social',
  'north-sign': 'north-social',
  'north-tree-3': 'north-social',
  'north-tree-4': 'north-social',
  'north-fence': 'north-social',
  sanitary: 'central-services',
  'central-camper': 'central-services',
  'central-tree-1': 'central-services',
  'central-table': 'central-common',
  'central-bench': 'central-common',
  'central-sign': 'central-common',
  'central-tree-2': 'central-common',
  'home-tent': 'taucher-tent-row',
  'tent-andre': 'taucher-tent-row',
  'tent-rene': 'taucher-tent-row',
  'tent-lars': 'taucher-tent-row',
  'tent-danny': 'taucher-tent-row',
  'central-tree-3': 'taucher-tent-row',
  'central-flowerbed': 'taucher-tent-row',
  'tent-hedge-west': 'taucher-tent-row',
  'tent-hedge-east': 'taucher-tent-row',
  'festival-stage': 'festival-stage',
  party: 'festival-social',
  'festival-kiosk': 'festival-social',
  'festival-table-1': 'festival-social',
  'festival-table-2': 'festival-social',
  'festival-lantern-1': 'festival-social',
  'festival-lantern-2': 'festival-social',
  'festival-sign': 'festival-social',
  lifeguard: 'beach-north',
  'main-dock': 'beach-north',
  'beach-bench-1': 'beach-north',
  'beach-bench-2': 'beach-social',
  'beach-table': 'beach-social',
  'beach-sign': 'beach-social',
  'beach-kiosk': 'beach-gate',
  'beach-rock-1': 'beach-gate',
  'beach-rock-2': 'beach-gate',
  workshop: 'woodland-service',
  'wood-shed': 'woodland-service',
  'woodland-bench': 'woodland-service',
  'woodland-sign': 'woodland-service',
  'woodland-tree-1': 'woodland-service',
  'woodland-tree-2': 'woodland-service',
  'woodland-tree-3': 'woodland-service',
  'woodland-tree-4': 'woodland-service',
  'woodland-tree-5': 'woodland-service',
  'cove-dock': 'cove-retreat',
  'cove-shelter': 'cove-retreat',
  'cove-bench': 'cove-retreat',
  'cove-sign': 'cove-retreat',
  'cove-rock-1': 'cove-retreat',
  'cove-rock-2': 'cove-retreat',
  'cove-tree-1': 'cove-retreat',
  'cove-tree-2': 'cove-retreat',
};

export const NPC_AREA_ASSIGNMENTS: Record<string, FunctionalAreaId> = {
  gundula: 'reception',
  uli: 'reception',
  manni: 'central-common',
  ronny: 'central-common',
  andre: 'taucher-tent-row',
  rene: 'taucher-tent-row',
  lars: 'taucher-tent-row',
  danny: 'taucher-tent-row',
  gregor: 'north-social',
  masl: 'festival-social',
  felix: 'beach-social',
  schubert: 'woodland-service',
  schima: 'cove-retreat',
  susi: 'festival-social',
  jule: 'beach-north',
  kira: 'north-social',
};

export const ARRIVAL_STORY_PLACEMENTS = {
  trunk: { x: 2250, y: 470 },
  reservationBoard: { x: 1710, y: 710 },
  gundula: { x: 1770, y: 720 },
  uli: { x: 1860, y: 720 },
  gateDebate: { x: 2050, y: 650 },
  taucherplatz: { x: 1650, y: 1200 },
  powerBox: { x: 1630, y: 1220 },
  drinks: { x: 1010, y: 1240 },
  tents: { x: 1260, y: 1210 },
  cable: { x: 1510, y: 1230 },
  firstBeer: { x: 1450, y: 1000 },
  homeDoor: { x: 972, y: 1250 },
} as const;

export function pointInPolygon(point: PlanPoint, polygon: PlanPoint[]): boolean {
  let inside = false;
  for (let index = 0, previous = polygon.length - 1; index < polygon.length; previous = index, index += 1) {
    const a = polygon[index];
    const b = polygon[previous];
    const crosses = ((a.y > point.y) !== (b.y > point.y))
      && point.x < ((b.x - a.x) * (point.y - a.y)) / ((b.y - a.y) || 1) + a.x;
    if (crosses) inside = !inside;
  }
  return inside;
}

import type { Bounds, RegionId } from './worldV2';

export interface PlanPoint {
  x: number;
  y: number;
}

export interface PlanRoad {
  id: string;
  from: AerialNodeId;
  to: AerialNodeId;
  width: number;
  surface: 'asphalt' | 'gravel' | 'sand';
}

export interface PlanPolygon {
  id: string;
  points: PlanPoint[];
  fill: number;
  border: number;
}

export interface PlanPitch extends Bounds {
  id: string;
  label?: string;
}

export interface PlanFence extends Bounds {
  id: string;
}

export interface Placement extends PlanPoint {
  width?: number;
  height?: number;
}

export const AERIAL_REGION_LAYOUT: Record<RegionId, Bounds> = {
  arrival: { x: 1650, y: 0, width: 950, height: 800 },
  north: { x: 850, y: 200, width: 800, height: 550 },
  central: { x: 850, y: 750, width: 800, height: 750 },
  festival: { x: 1650, y: 800, width: 500, height: 500 },
  woodland: { x: 850, y: 1500, width: 1300, height: 300 },
  beach: { x: 200, y: 250, width: 650, height: 1050 },
  cove: { x: 0, y: 1300, width: 850, height: 500 },
};

export const AERIAL_SITE_POLYGONS: PlanPolygon[] = [
  {
    id: 'campground-land',
    fill: 0x678b59,
    border: 0x355f42,
    points: [
      { x: 865, y: 245 },
      { x: 1930, y: 190 },
      { x: 2225, y: 365 },
      { x: 2225, y: 920 },
      { x: 2050, y: 1370 },
      { x: 1900, y: 1610 },
      { x: 920, y: 1580 },
      { x: 820, y: 1360 },
      { x: 820, y: 1040 },
      { x: 850, y: 700 },
    ],
  },
  {
    id: 'main-beach',
    fill: 0xd8c487,
    border: 0xb1945c,
    points: [
      { x: 210, y: 275 },
      { x: 825, y: 275 },
      { x: 825, y: 1015 },
      { x: 755, y: 1285 },
      { x: 510, y: 1310 },
      { x: 225, y: 1190 },
      { x: 125, y: 760 },
    ],
  },
  {
    id: 'south-cove-land',
    fill: 0x5b8061,
    border: 0x31563f,
    points: [
      { x: 0, y: 1280 },
      { x: 760, y: 1280 },
      { x: 825, y: 1440 },
      { x: 760, y: 1780 },
      { x: 0, y: 1780 },
    ],
  },
];

export const AERIAL_WATER_POLYGONS: PlanPolygon[] = [
  {
    id: 'west-water',
    fill: 0x285e78,
    border: 0x4a91a6,
    points: [
      { x: 0, y: 0 },
      { x: 700, y: 0 },
      { x: 540, y: 230 },
      { x: 210, y: 275 },
      { x: 125, y: 760 },
      { x: 225, y: 1190 },
      { x: 0, y: 1250 },
    ],
  },
  {
    id: 'south-water',
    fill: 0x2b6e83,
    border: 0x57a2ae,
    points: [
      { x: 0, y: 1780 },
      { x: 760, y: 1780 },
      { x: 920, y: 1580 },
      { x: 1900, y: 1610 },
      { x: 2050, y: 1370 },
      { x: 2600, y: 1370 },
      { x: 2600, y: 1800 },
      { x: 0, y: 1800 },
    ],
  },
];

export const AERIAL_NODES = {
  entrance: { x: 2390, y: 90 },
  parkingNorth: { x: 2260, y: 300 },
  parking: { x: 2200, y: 500 },
  gate: { x: 2010, y: 650 },
  receptionJunction: { x: 1840, y: 690 },
  receptionDoor: { x: 1760, y: 690 },
  upperHub: { x: 1640, y: 650 },
  upperMid: { x: 1400, y: 520 },
  upperWest: { x: 1080, y: 540 },
  middleEast: { x: 1720, y: 850 },
  middleHub: { x: 1450, y: 870 },
  middleWest: { x: 1110, y: 900 },
  beachGateInside: { x: 900, y: 1080 },
  beachGateOutside: { x: 780, y: 1080 },
  kiosk: { x: 620, y: 1170 },
  lowerEast: { x: 1770, y: 1120 },
  lowerHub: { x: 1470, y: 1190 },
  taucherEntry: { x: 1210, y: 1210 },
  taucherCenter: { x: 1060, y: 1360 },
  lowerSouth: { x: 1490, y: 1450 },
  serviceEast: { x: 1920, y: 1510 },
  coveGate: { x: 790, y: 1450 },
  coveDock: { x: 420, y: 1540 },
} as const satisfies Record<string, PlanPoint>;

export type AerialNodeId = keyof typeof AERIAL_NODES;

export const AERIAL_ROADS: PlanRoad[] = [
  { id: 'adria-access-road', from: 'entrance', to: 'parkingNorth', width: 124, surface: 'asphalt' },
  { id: 'parking-approach', from: 'parkingNorth', to: 'parking', width: 118, surface: 'asphalt' },
  { id: 'gate-approach', from: 'parking', to: 'gate', width: 106, surface: 'asphalt' },
  { id: 'reception-court', from: 'gate', to: 'receptionJunction', width: 82, surface: 'gravel' },
  { id: 'reception-walk', from: 'receptionJunction', to: 'receptionDoor', width: 54, surface: 'gravel' },
  { id: 'upper-entry', from: 'gate', to: 'upperHub', width: 78, surface: 'gravel' },
  { id: 'upper-row-east', from: 'upperHub', to: 'upperMid', width: 70, surface: 'gravel' },
  { id: 'upper-row-west', from: 'upperMid', to: 'upperWest', width: 66, surface: 'gravel' },
  { id: 'middle-entry', from: 'gate', to: 'middleEast', width: 82, surface: 'gravel' },
  { id: 'middle-row-east', from: 'middleEast', to: 'middleHub', width: 72, surface: 'gravel' },
  { id: 'middle-row-west', from: 'middleHub', to: 'middleWest', width: 68, surface: 'gravel' },
  { id: 'upper-middle-link', from: 'upperHub', to: 'middleHub', width: 62, surface: 'gravel' },
  { id: 'west-row-link', from: 'upperWest', to: 'middleWest', width: 58, surface: 'gravel' },
  { id: 'beach-gate-inside', from: 'middleWest', to: 'beachGateInside', width: 62, surface: 'gravel' },
  { id: 'beach-gate-crossing', from: 'beachGateInside', to: 'beachGateOutside', width: 56, surface: 'sand' },
  { id: 'kiosk-path', from: 'beachGateOutside', to: 'kiosk', width: 60, surface: 'sand' },
  { id: 'lower-entry', from: 'middleEast', to: 'lowerEast', width: 72, surface: 'gravel' },
  { id: 'lower-row-east', from: 'lowerEast', to: 'lowerHub', width: 68, surface: 'gravel' },
  { id: 'middle-lower-link', from: 'middleHub', to: 'lowerHub', width: 62, surface: 'gravel' },
  { id: 'taucher-spur', from: 'lowerHub', to: 'taucherEntry', width: 60, surface: 'gravel' },
  { id: 'taucher-pitch-access', from: 'taucherEntry', to: 'taucherCenter', width: 54, surface: 'gravel' },
  { id: 'service-lane-west', from: 'lowerHub', to: 'lowerSouth', width: 62, surface: 'gravel' },
  { id: 'service-lane-east', from: 'lowerSouth', to: 'serviceEast', width: 64, surface: 'gravel' },
  { id: 'cove-connector', from: 'taucherCenter', to: 'coveGate', width: 54, surface: 'gravel' },
  { id: 'cove-path', from: 'coveGate', to: 'coveDock', width: 52, surface: 'sand' },
];

export const AERIAL_FENCE_SEGMENTS: PlanFence[] = [
  { id: 'camp-beach-fence-north', x: 820, y: 270, width: 22, height: 760 },
  { id: 'camp-beach-fence-south', x: 820, y: 1140, width: 22, height: 330 },
];

export const BEACH_GATE = { x: 820, y: 1030, width: 22, height: 110 } as const;

export const AERIAL_PITCHES: PlanPitch[] = [
  { id: 'north-1', x: 930, y: 300, width: 220, height: 170 },
  { id: 'north-2', x: 1180, y: 285, width: 220, height: 175 },
  { id: 'north-3', x: 1430, y: 270, width: 200, height: 185 },
  { id: 'middle-1', x: 930, y: 690, width: 230, height: 170 },
  { id: 'middle-2', x: 1200, y: 670, width: 220, height: 175 },
  { id: 'middle-3', x: 1480, y: 700, width: 190, height: 150 },
  { id: 'south-1', x: 930, y: 1000, width: 240, height: 170 },
  { id: 'south-2', x: 1200, y: 980, width: 230, height: 170 },
  { id: 'taucher', x: 900, y: 1230, width: 430, height: 300, label: 'TAUCHERPLATZ' },
  { id: 'festival', x: 1680, y: 890, width: 420, height: 360, label: 'FESTWIESE' },
];

export const TAUCHER_PITCH_BOUNDS: Bounds = { x: 900, y: 1230, width: 430, height: 300 };
export const ARRIVAL_CAR_POSITION: PlanPoint = { x: 2220, y: 450 };
export const TAUCHER_CAR_POSITION: PlanPoint = { x: 1120, y: 1320 };

export const OBJECT_PLACEMENTS: Record<string, Placement> = {
  reception: { x: 1655, y: 545 },
  'arrival-sign': { x: 2290, y: 225 },
  'parking-fence-left': { x: 2075, y: 560, width: 115, height: 22 },
  'parking-fence-right': { x: 2225, y: 560, width: 250, height: 22 },
  'arrival-flowerbed': { x: 1900, y: 595 },
  'arrival-lantern-1': { x: 1990, y: 565 },
  'arrival-lantern-2': { x: 2140, y: 470 },

  sanitary: { x: 1390, y: 800 },
  'home-tent': { x: 960, y: 1280 },
  'tent-andre': { x: 995, y: 1380 },
  'tent-rene': { x: 1140, y: 1380 },
  'tent-lars': { x: 1285, y: 1380 },
  'tent-danny': { x: 1430, y: 1365 },
  'central-camper': { x: 1180, y: 770 },
  'central-table': { x: 1230, y: 1010 },
  'central-bench': { x: 1385, y: 1025 },
  'central-sign': { x: 920, y: 1190 },
  'central-tree-1': { x: 880, y: 780 },
  'central-tree-2': { x: 1540, y: 1110 },
  'central-tree-3': { x: 875, y: 1450 },
  'central-flowerbed': { x: 1320, y: 1195 },
  'tent-hedge-west': { x: 880, y: 1510, width: 380 },
  'tent-hedge-east': { x: 1360, y: 1510, width: 260 },

  clubhouse: { x: 910, y: 250 },
  'north-camper-1': { x: 1200, y: 300 },
  'north-camper-2': { x: 1420, y: 270 },
  'north-camper-3': { x: 1180, y: 560 },
  'north-table-1': { x: 980, y: 560 },
  'north-table-2': { x: 1450, y: 570 },
  'north-bench-1': { x: 1320, y: 650 },
  'north-sign': { x: 870, y: 650 },
  'north-tree-1': { x: 880, y: 220 },
  'north-tree-2': { x: 1570, y: 220 },
  'north-tree-3': { x: 1570, y: 610 },
  'north-tree-4': { x: 930, y: 610 },
  'north-fence': { x: 850, y: 735, width: 320 },

  party: { x: 1690, y: 880 },
  'festival-stage': { x: 1900, y: 830 },
  'festival-kiosk': { x: 1680, y: 1160 },
  'festival-table-1': { x: 1870, y: 1110 },
  'festival-table-2': { x: 1970, y: 1190 },
  'festival-lantern-1': { x: 1670, y: 1040 },
  'festival-lantern-2': { x: 2080, y: 1040 },
  'festival-sign': { x: 1980, y: 1260 },

  'beach-kiosk': { x: 535, y: 1090 },
  lifeguard: { x: 430, y: 610 },
  'main-dock': { x: 210, y: 470 },
  'beach-bench-1': { x: 570, y: 650 },
  'beach-bench-2': { x: 590, y: 900 },
  'beach-table': { x: 650, y: 1000 },
  'beach-sign': { x: 720, y: 1060 },
  'beach-rock-1': { x: 260, y: 1050 },
  'beach-rock-2': { x: 340, y: 1140 },

  workshop: { x: 1650, y: 1510 },
  'wood-shed': { x: 1940, y: 1600 },
  'woodland-bench': { x: 1450, y: 1690 },
  'woodland-sign': { x: 2040, y: 1480 },
  'woodland-tree-1': { x: 900, y: 1580 },
  'woodland-tree-2': { x: 2100, y: 1500 },
  'woodland-tree-3': { x: 1080, y: 1660 },
  'woodland-tree-4': { x: 2050, y: 1680 },
  'woodland-tree-5': { x: 1320, y: 1650 },

  'cove-dock': { x: 230, y: 1510 },
  'cove-shelter': { x: 520, y: 1410 },
  'cove-bench': { x: 570, y: 1650 },
  'cove-sign': { x: 720, y: 1340 },
  'cove-rock-1': { x: 80, y: 1450 },
  'cove-rock-2': { x: 700, y: 1690 },
  'cove-tree-1': { x: 80, y: 1640 },
  'cove-tree-2': { x: 700, y: 1450 },
  'lunch-sign': { x: 1870, y: 740 },
};

export const NPC_PLACEMENTS: Record<string, PlanPoint> = {
  gundula: { x: 1765, y: 720 },
  uli: { x: 1840, y: 720 },
  manni: { x: 1510, y: 970 },
  ronny: { x: 1580, y: 820 },
  andre: { x: 1040, y: 1340 },
  rene: { x: 1185, y: 1340 },
  lars: { x: 1330, y: 1340 },
  danny: { x: 1480, y: 1330 },
  gregor: { x: 1270, y: 620 },
  masl: { x: 1800, y: 1140 },
  felix: { x: 540, y: 910 },
  schubert: { x: 1790, y: 1570 },
  schima: { x: 550, y: 1570 },
  susi: { x: 1940, y: 1040 },
  jule: { x: 480, y: 820 },
  kira: { x: 1450, y: 600 },
};

export const ENTRANCE_PLACEMENTS: Record<string, PlanPoint> = {
  'reception-door': { x: 1760, y: 705 },
  'sanitary-door': { x: 1515, y: 970 },
  'home-door': { x: 1035, y: 1400 },
  'party-door': { x: 1840, y: 1095 },
};

export const LANDMARK_PLACEMENTS: Record<string, PlanPoint> = {
  'notice-board': { x: 1695, y: 720 },
  campfire: { x: 1300, y: 1080 },
  'clubhouse-wall': { x: 1080, y: 480 },
  'festival-lights': { x: 1880, y: 1040 },
  'lake-lookout': { x: 350, y: 500 },
  'service-map': { x: 1900, y: 1490 },
  'cove-echo': { x: 420, y: 1540 },
};

export const ARRIVAL_STORY_PLACEMENTS = {
  trunk: ARRIVAL_CAR_POSITION,
  reservationBoard: LANDMARK_PLACEMENTS['notice-board'],
  gundula: NPC_PLACEMENTS.gundula,
  uli: NPC_PLACEMENTS.uli,
  gateDebate: AERIAL_NODES.gate,
  taucherplatz: AERIAL_NODES.taucherCenter,
  powerBox: { x: 1200, y: 1285 },
  drinks: { x: 1040, y: 1450 },
  tents: { x: 1180, y: 1450 },
  cable: { x: 1320, y: 1450 },
  firstBeer: { x: 1480, y: 1450 },
  homeDoor: ENTRANCE_PLACEMENTS['home-door'],
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

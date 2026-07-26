export const WORLD_WIDTH = 1600;
export const WORLD_HEIGHT = 1100;

export type WorldObjectKind =
  | 'building'
  | 'tent'
  | 'party-tent'
  | 'camper'
  | 'tree'
  | 'bench'
  | 'table'
  | 'fence'
  | 'sign';

export interface WorldObject {
  id: string;
  kind: WorldObjectKind;
  x: number;
  y: number;
  width: number;
  height: number;
  label?: string;
  color?: number;
  solid?: boolean;
}

export interface WorldEntrance {
  id: string;
  interiorId: 'reception' | 'sanitary' | 'home-tent' | 'party-tent';
  x: number;
  y: number;
  label: string;
  requiresGate?: boolean;
}

export interface WorldNpc {
  id: string;
  x: number;
  y: number;
}

export const WORLD_OBJECTS: WorldObject[] = [
  { id: 'reception', kind: 'building', x: 955, y: 825, width: 250, height: 155, label: 'REZEPTION', color: 0xb86f49 },
  { id: 'sanitary', kind: 'building', x: 430, y: 190, width: 250, height: 170, label: 'SANITÄR', color: 0xd9d6c8 },
  { id: 'clubhouse', kind: 'building', x: 75, y: 105, width: 300, height: 190, label: 'ADRIA-KLAUSE', color: 0x9c6847 },
  { id: 'party', kind: 'party-tent', x: 770, y: 130, width: 300, height: 190, label: 'PARTYZELT', color: 0xd89c43 },
  { id: 'home-tent', kind: 'tent', x: 315, y: 610, width: 150, height: 115, label: 'DEIN ZELT', color: 0x6c8fc9 },
  { id: 'tent-andre', kind: 'tent', x: 515, y: 525, width: 130, height: 100, color: 0xe3a749 },
  { id: 'tent-rene', kind: 'tent', x: 680, y: 535, width: 130, height: 100, color: 0x4fb7a6 },
  { id: 'tent-lars', kind: 'tent', x: 835, y: 500, width: 140, height: 105, color: 0x5b9be0 },
  { id: 'tent-danny', kind: 'tent', x: 1000, y: 515, width: 130, height: 100, color: 0xdd6e73 },
  { id: 'camper-1', kind: 'camper', x: 90, y: 405, width: 210, height: 105, color: 0xf0e5c7 },
  { id: 'camper-2', kind: 'camper', x: 1140, y: 355, width: 220, height: 105, color: 0xdfe7df },
  { id: 'table-north', kind: 'table', x: 520, y: 410, width: 105, height: 62 },
  { id: 'table-south', kind: 'table', x: 790, y: 680, width: 130, height: 68 },
  { id: 'bench-lake-1', kind: 'bench', x: 1230, y: 590, width: 90, height: 34 },
  { id: 'bench-lake-2', kind: 'bench', x: 1370, y: 640, width: 90, height: 34 },
  { id: 'gate-sign', kind: 'sign', x: 697, y: 842, width: 78, height: 54, label: 'TOR' },
  { id: 'fence-left', kind: 'fence', x: 0, y: 790, width: 760, height: 22, solid: true },
  { id: 'fence-right', kind: 'fence', x: 900, y: 790, width: 700, height: 22, solid: true },
  { id: 'tree-1', kind: 'tree', x: 40, y: 35, width: 64, height: 64 },
  { id: 'tree-2', kind: 'tree', x: 395, y: 55, width: 72, height: 72 },
  { id: 'tree-3', kind: 'tree', x: 1115, y: 80, width: 70, height: 70 },
  { id: 'tree-4', kind: 'tree', x: 1160, y: 190, width: 62, height: 62 },
  { id: 'tree-5', kind: 'tree', x: 1380, y: 825, width: 70, height: 70 },
  { id: 'tree-6', kind: 'tree', x: 1470, y: 900, width: 74, height: 74 },
  { id: 'tree-7', kind: 'tree', x: 125, y: 660, width: 68, height: 68 },
  { id: 'tree-8', kind: 'tree', x: 205, y: 750, width: 72, height: 72 },
  { id: 'tree-9', kind: 'tree', x: 1080, y: 700, width: 64, height: 64 },
  { id: 'tree-10', kind: 'tree', x: 60, y: 900, width: 70, height: 70 },
];

export const WORLD_ENTRANCES: WorldEntrance[] = [
  { id: 'reception-door', interiorId: 'reception', x: 1040, y: 990, label: 'Rezeption betreten' },
  { id: 'sanitary-door', interiorId: 'sanitary', x: 555, y: 375, label: 'Sanitärgebäude betreten', requiresGate: true },
  { id: 'home-door', interiorId: 'home-tent', x: 390, y: 742, label: 'Eigenes Zelt betreten', requiresGate: true },
  { id: 'party-door', interiorId: 'party-tent', x: 920, y: 338, label: 'Partyzelt betreten', requiresGate: true },
];

export const WORLD_NPCS: WorldNpc[] = [
  { id: 'gundula', x: 790, y: 850 },
  { id: 'uli', x: 875, y: 850 },
  { id: 'manni', x: 590, y: 405 },
  { id: 'ronny', x: 250, y: 355 },
  { id: 'andre', x: 525, y: 655 },
  { id: 'rene', x: 690, y: 655 },
  { id: 'lars', x: 855, y: 625 },
  { id: 'danny', x: 1015, y: 650 },
  { id: 'gregor', x: 700, y: 430 },
  { id: 'felix', x: 1180, y: 560 },
  { id: 'masl', x: 930, y: 365 },
  { id: 'schubert', x: 1120, y: 735 },
  { id: 'schima', x: 220, y: 590 },
];

export interface InteriorDefinition {
  id: WorldEntrance['interiorId'];
  title: string;
  subtitle: string;
  floor: number;
  wall: number;
}

export const INTERIORS: Record<WorldEntrance['interiorId'], InteriorDefinition> = {
  reception: {
    id: 'reception',
    title: 'Rezeption',
    subtitle: 'Klemmbretter, Schlüsselhaken und die Aura unangekündigter Kontrollen',
    floor: 0xb38c62,
    wall: 0x70462f,
  },
  sanitary: {
    id: 'sanitary',
    title: 'Sanitärkathedrale',
    subtitle: 'Überraschend sauber. Das Wochenende ist noch jung.',
    floor: 0xb9c7c5,
    wall: 0x517077,
  },
  'home-tent': {
    id: 'home-tent',
    title: 'Dein Zelt',
    subtitle: 'Zwei Quadratmeter Stoff und temporäre Selbstbestimmung',
    floor: 0xb28c55,
    wall: 0x46638e,
  },
  'party-tent': {
    id: 'party-tent',
    title: 'Partyzelt',
    subtitle: 'Plastikbecher, Biertische und Entscheidungen mit kurzer Halbwertszeit',
    floor: 0x9b7548,
    wall: 0xb97931,
  },
};

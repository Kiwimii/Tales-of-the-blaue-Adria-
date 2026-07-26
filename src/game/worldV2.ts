import { FRIEND_IDS } from './content';

export const EXPANDED_WORLD_WIDTH = 2600;
export const EXPANDED_WORLD_HEIGHT = 1800;

export type RegionId = 'arrival' | 'central' | 'north' | 'festival' | 'beach' | 'woodland' | 'cove';

export interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface WorldProgressState {
  flags: Record<string, boolean>;
  quests: Record<string, { status: string; stage?: number }>;
}

export interface WorldRegion {
  id: RegionId;
  title: string;
  subtitle: string;
  bounds: Bounds;
  accent: number;
  ground: number;
  order: number;
  unlockHint: string;
  zoom: number;
}

export type ExpandedObjectKind =
  | 'building'
  | 'tent'
  | 'party-tent'
  | 'camper'
  | 'tree'
  | 'bench'
  | 'table'
  | 'fence'
  | 'sign'
  | 'kiosk'
  | 'stage'
  | 'dock'
  | 'rock'
  | 'lantern'
  | 'flowerbed';

export interface ExpandedWorldObject {
  id: string;
  kind: ExpandedObjectKind;
  regionId: RegionId;
  x: number;
  y: number;
  width: number;
  height: number;
  label?: string;
  color?: number;
  solid?: boolean;
  detailSeed?: number;
}

export interface ExpandedEntrance {
  id: string;
  regionId: RegionId;
  interiorId: 'reception' | 'sanitary' | 'home-tent' | 'party-tent';
  x: number;
  y: number;
  label: string;
}

export interface ExpandedNpc {
  id: string;
  regionId: RegionId;
  x: number;
  y: number;
}

export interface Landmark {
  id: string;
  regionId: RegionId;
  x: number;
  y: number;
  title: string;
  prompt: string;
  text: string;
}

export const WORLD_REGIONS: WorldRegion[] = [
  {
    id: 'arrival',
    title: 'Ankunft & Rezeption',
    subtitle: 'Parkplatz, Schranke und die erste bürokratische Prüfung',
    bounds: { x: 0, y: 1280, width: 1400, height: 520 },
    accent: 0xf4c75d,
    ground: 0x7b8d6a,
    order: 0,
    unlockHint: 'Immer geöffnet',
    zoom: 1.08,
  },
  {
    id: 'central',
    title: 'Südlager',
    subtitle: 'Zelte, Feuerstelle und der operative Kern des Wochenendes',
    bounds: { x: 0, y: 760, width: 1400, height: 520 },
    accent: 0x79d39a,
    ground: 0x6f965f,
    order: 1,
    unlockHint: 'Überzeuge Gundula und Uli am Tor',
    zoom: 1.02,
  },
  {
    id: 'north',
    title: 'Nordlager & Adria-Klause',
    subtitle: 'Dauercamper, Vereinsheim und die ältesten Geschichten des Platzes',
    bounds: { x: 0, y: 0, width: 1400, height: 760 },
    accent: 0x8fb7e8,
    ground: 0x678c59,
    order: 2,
    unlockHint: 'Finde drei Freunde oder gewinne das Camping-Duell',
    zoom: 0.98,
  },
  {
    id: 'festival',
    title: 'Festwiese',
    subtitle: 'Partyzelt, Bühne, Lichterketten und Entscheidungen mit kurzer Halbwertszeit',
    bounds: { x: 1400, y: 0, width: 550, height: 980 },
    accent: 0xef9d55,
    ground: 0x7d9457,
    order: 3,
    unlockHint: 'Finde fünf Freunde oder löse Mannis Papierproblem',
    zoom: 1,
  },
  {
    id: 'beach',
    title: 'Strand & Große Adria',
    subtitle: 'Steg, Flunkyballfeld und ein See, der jede Ausrede reflektiert',
    bounds: { x: 1950, y: 0, width: 650, height: 1100 },
    accent: 0x70d4e7,
    ground: 0xdcc98d,
    order: 4,
    unlockHint: 'Finde sechs Freunde oder besiege Ronny',
    zoom: 0.96,
  },
  {
    id: 'woodland',
    title: 'Waldsaum & Servicepfad',
    subtitle: 'Werkstatt, Holzlager und ruhige Wege abseits des Hauptlagers',
    bounds: { x: 1400, y: 980, width: 550, height: 820 },
    accent: 0x72b48a,
    ground: 0x4f7652,
    order: 5,
    unlockHint: 'Finde sieben Freunde oder gewinne zwei Spiele',
    zoom: 0.94,
  },
  {
    id: 'cove',
    title: 'Versteckte Bucht',
    subtitle: 'Felsen, kleiner Steg und der letzte Winkel des Wochenendes',
    bounds: { x: 1950, y: 1100, width: 650, height: 700 },
    accent: 0xb99ce8,
    ground: 0x557d61,
    order: 6,
    unlockHint: 'Finde acht Freunde oder gewinne alle drei Trinkspiele',
    zoom: 0.92,
  },
];

export const EXPANDED_WORLD_OBJECTS: ExpandedWorldObject[] = [
  { id: 'reception', kind: 'building', regionId: 'arrival', x: 980, y: 1360, width: 260, height: 155, label: 'REZEPTION', color: 0xb86f49 },
  { id: 'arrival-sign', kind: 'sign', regionId: 'arrival', x: 570, y: 1370, width: 115, height: 70, label: 'BLAUE ADRIA' },
  { id: 'parking-fence-left', kind: 'fence', regionId: 'arrival', x: 510, y: 1282, width: 250, height: 22 },
  { id: 'parking-fence-right', kind: 'fence', regionId: 'arrival', x: 900, y: 1282, width: 490, height: 22 },
  { id: 'arrival-flowerbed', kind: 'flowerbed', regionId: 'arrival', x: 1210, y: 1560, width: 150, height: 70, solid: false },
  { id: 'arrival-lantern-1', kind: 'lantern', regionId: 'arrival', x: 590, y: 1510, width: 24, height: 70, solid: false },
  { id: 'arrival-lantern-2', kind: 'lantern', regionId: 'arrival', x: 1330, y: 1510, width: 24, height: 70, solid: false },

  { id: 'sanitary', kind: 'building', regionId: 'central', x: 360, y: 820, width: 255, height: 170, label: 'SANITÄR', color: 0xd9d6c8 },
  { id: 'home-tent', kind: 'tent', regionId: 'central', x: 315, y: 1080, width: 155, height: 120, label: 'DEIN ZELT', color: 0x6c8fc9 },
  { id: 'tent-andre', kind: 'tent', regionId: 'central', x: 520, y: 1030, width: 135, height: 105, color: 0xe3a749 },
  { id: 'tent-rene', kind: 'tent', regionId: 'central', x: 700, y: 1040, width: 135, height: 105, color: 0x4fb7a6 },
  { id: 'tent-lars', kind: 'tent', regionId: 'central', x: 875, y: 1010, width: 145, height: 110, color: 0x5b9be0 },
  { id: 'tent-danny', kind: 'tent', regionId: 'central', x: 1060, y: 1035, width: 135, height: 105, color: 0xdd6e73 },
  { id: 'central-camper', kind: 'camper', regionId: 'central', x: 1060, y: 820, width: 220, height: 108, color: 0xf0e5c7 },
  { id: 'central-table', kind: 'table', regionId: 'central', x: 700, y: 900, width: 145, height: 72 },
  { id: 'central-bench', kind: 'bench', regionId: 'central', x: 850, y: 900, width: 105, height: 38 },
  { id: 'central-sign', kind: 'sign', regionId: 'central', x: 90, y: 1040, width: 92, height: 62, label: 'SÜDLAGER' },
  { id: 'central-tree-1', kind: 'tree', regionId: 'central', x: 80, y: 810, width: 95, height: 105 },
  { id: 'central-tree-2', kind: 'tree', regionId: 'central', x: 1240, y: 1080, width: 100, height: 112 },
  { id: 'central-tree-3', kind: 'tree', regionId: 'central', x: 125, y: 1130, width: 82, height: 92 },
  { id: 'central-flowerbed', kind: 'flowerbed', regionId: 'central', x: 635, y: 1180, width: 210, height: 52, solid: false },

  { id: 'clubhouse', kind: 'building', regionId: 'north', x: 80, y: 120, width: 320, height: 200, label: 'ADRIA-KLAUSE', color: 0x9c6847 },
  { id: 'north-camper-1', kind: 'camper', regionId: 'north', x: 520, y: 130, width: 230, height: 110, color: 0xe6e1cf },
  { id: 'north-camper-2', kind: 'camper', regionId: 'north', x: 820, y: 150, width: 230, height: 110, color: 0xdde9df },
  { id: 'north-camper-3', kind: 'camper', regionId: 'north', x: 1090, y: 120, width: 230, height: 110, color: 0xf2dfc8 },
  { id: 'north-table-1', kind: 'table', regionId: 'north', x: 530, y: 430, width: 140, height: 68 },
  { id: 'north-table-2', kind: 'table', regionId: 'north', x: 880, y: 500, width: 140, height: 68 },
  { id: 'north-bench-1', kind: 'bench', regionId: 'north', x: 720, y: 585, width: 115, height: 40 },
  { id: 'north-sign', kind: 'sign', regionId: 'north', x: 110, y: 610, width: 96, height: 64, label: 'NORDLAGER' },
  { id: 'north-tree-1', kind: 'tree', regionId: 'north', x: 430, y: 55, width: 102, height: 116 },
  { id: 'north-tree-2', kind: 'tree', regionId: 'north', x: 760, y: 30, width: 112, height: 125 },
  { id: 'north-tree-3', kind: 'tree', regionId: 'north', x: 1300, y: 420, width: 92, height: 108 },
  { id: 'north-tree-4', kind: 'tree', regionId: 'north', x: 250, y: 470, width: 100, height: 115 },
  { id: 'north-fence', kind: 'fence', regionId: 'north', x: 0, y: 738, width: 600, height: 22 },

  { id: 'party', kind: 'party-tent', regionId: 'festival', x: 1510, y: 300, width: 330, height: 210, label: 'PARTYZELT', color: 0xd89c43 },
  { id: 'festival-stage', kind: 'stage', regionId: 'festival', x: 1480, y: 90, width: 390, height: 150, label: 'BÜHNE', color: 0x6f446f },
  { id: 'festival-kiosk', kind: 'kiosk', regionId: 'festival', x: 1510, y: 650, width: 180, height: 115, label: 'KIOSK', color: 0x4b8b7b },
  { id: 'festival-table-1', kind: 'table', regionId: 'festival', x: 1720, y: 620, width: 145, height: 70 },
  { id: 'festival-table-2', kind: 'table', regionId: 'festival', x: 1500, y: 820, width: 145, height: 70 },
  { id: 'festival-lantern-1', kind: 'lantern', regionId: 'festival', x: 1460, y: 540, width: 24, height: 78, solid: false },
  { id: 'festival-lantern-2', kind: 'lantern', regionId: 'festival', x: 1890, y: 540, width: 24, height: 78, solid: false },
  { id: 'festival-sign', kind: 'sign', regionId: 'festival', x: 1810, y: 830, width: 100, height: 66, label: 'FESTWIESE' },

  { id: 'beach-kiosk', kind: 'kiosk', regionId: 'beach', x: 2000, y: 180, width: 185, height: 120, label: 'STRANDBAR', color: 0xe58455 },
  { id: 'lifeguard', kind: 'building', regionId: 'beach', x: 2220, y: 165, width: 160, height: 125, label: 'WACHE', color: 0xf0d56f },
  { id: 'main-dock', kind: 'dock', regionId: 'beach', x: 2210, y: 500, width: 300, height: 72, label: 'STEG' },
  { id: 'beach-bench-1', kind: 'bench', regionId: 'beach', x: 2020, y: 430, width: 115, height: 40 },
  { id: 'beach-bench-2', kind: 'bench', regionId: 'beach', x: 2030, y: 760, width: 115, height: 40 },
  { id: 'beach-table', kind: 'table', regionId: 'beach', x: 2110, y: 850, width: 150, height: 72 },
  { id: 'beach-sign', kind: 'sign', regionId: 'beach', x: 1990, y: 970, width: 92, height: 62, label: 'STRAND' },
  { id: 'beach-rock-1', kind: 'rock', regionId: 'beach', x: 2480, y: 870, width: 80, height: 58 },
  { id: 'beach-rock-2', kind: 'rock', regionId: 'beach', x: 2420, y: 930, width: 62, height: 48 },

  { id: 'workshop', kind: 'building', regionId: 'woodland', x: 1490, y: 1130, width: 280, height: 170, label: 'WERKSTATT', color: 0x6d795d },
  { id: 'wood-shed', kind: 'kiosk', regionId: 'woodland', x: 1740, y: 1420, width: 160, height: 105, label: 'HOLZLAGER', color: 0x7a5638 },
  { id: 'woodland-bench', kind: 'bench', regionId: 'woodland', x: 1510, y: 1590, width: 120, height: 42 },
  { id: 'woodland-sign', kind: 'sign', regionId: 'woodland', x: 1810, y: 1050, width: 104, height: 68, label: 'WALDPFAD' },
  { id: 'woodland-tree-1', kind: 'tree', regionId: 'woodland', x: 1425, y: 1005, width: 118, height: 132 },
  { id: 'woodland-tree-2', kind: 'tree', regionId: 'woodland', x: 1790, y: 1020, width: 120, height: 138 },
  { id: 'woodland-tree-3', kind: 'tree', regionId: 'woodland', x: 1420, y: 1490, width: 125, height: 140 },
  { id: 'woodland-tree-4', kind: 'tree', regionId: 'woodland', x: 1810, y: 1650, width: 120, height: 136 },
  { id: 'woodland-tree-5', kind: 'tree', regionId: 'woodland', x: 1660, y: 1580, width: 108, height: 125 },

  { id: 'cove-dock', kind: 'dock', regionId: 'cove', x: 2100, y: 1390, width: 265, height: 65, label: 'KLEINER STEG' },
  { id: 'cove-shelter', kind: 'kiosk', regionId: 'cove', x: 2020, y: 1190, width: 190, height: 120, label: 'UNTERSTAND', color: 0x6e568a },
  { id: 'cove-bench', kind: 'bench', regionId: 'cove', x: 2210, y: 1640, width: 125, height: 42 },
  { id: 'cove-sign', kind: 'sign', regionId: 'cove', x: 2440, y: 1160, width: 108, height: 70, label: 'BUCHT' },
  { id: 'cove-rock-1', kind: 'rock', regionId: 'cove', x: 1975, y: 1510, width: 95, height: 68 },
  { id: 'cove-rock-2', kind: 'rock', regionId: 'cove', x: 2400, y: 1510, width: 115, height: 80 },
  { id: 'cove-tree-1', kind: 'tree', regionId: 'cove', x: 2010, y: 1660, width: 118, height: 132 },
  { id: 'cove-tree-2', kind: 'tree', regionId: 'cove', x: 2460, y: 1660, width: 120, height: 136 },
];

export const EXPANDED_ENTRANCES: ExpandedEntrance[] = [
  { id: 'reception-door', regionId: 'arrival', interiorId: 'reception', x: 1110, y: 1530, label: 'Rezeption betreten' },
  { id: 'sanitary-door', regionId: 'central', interiorId: 'sanitary', x: 488, y: 1004, label: 'Sanitärgebäude betreten' },
  { id: 'home-door', regionId: 'central', interiorId: 'home-tent', x: 392, y: 1214, label: 'Eigenes Zelt betreten' },
  { id: 'party-door', regionId: 'festival', interiorId: 'party-tent', x: 1675, y: 526, label: 'Partyzelt betreten' },
];

export const EXPANDED_NPCS: ExpandedNpc[] = [
  { id: 'gundula', regionId: 'arrival', x: 790, y: 1390 },
  { id: 'uli', regionId: 'arrival', x: 885, y: 1390 },
  { id: 'manni', regionId: 'central', x: 620, y: 895 },
  { id: 'ronny', regionId: 'central', x: 255, y: 930 },
  { id: 'andre', regionId: 'central', x: 540, y: 1175 },
  { id: 'rene', regionId: 'central', x: 715, y: 1175 },
  { id: 'lars', regionId: 'central', x: 895, y: 1150 },
  { id: 'danny', regionId: 'central', x: 1080, y: 1175 },
  { id: 'gregor', regionId: 'north', x: 670, y: 530 },
  { id: 'masl', regionId: 'festival', x: 1780, y: 760 },
  { id: 'felix', regionId: 'beach', x: 2090, y: 680 },
  { id: 'schubert', regionId: 'woodland', x: 1610, y: 1510 },
  { id: 'schima', regionId: 'cove', x: 2300, y: 1580 },
];

export const LANDMARKS: Landmark[] = [
  {
    id: 'notice-board',
    regionId: 'arrival',
    x: 700,
    y: 1460,
    title: 'Schwarzes Brett',
    prompt: 'Aushänge lesen',
    text: 'Zwischen Platzordnung und Bingoabend hängt ein handschriftlicher Hinweis: „Wer Uli widerspricht, misst zweimal.“',
  },
  {
    id: 'campfire',
    regionId: 'central',
    x: 760,
    y: 1080,
    title: 'Feuerstelle',
    prompt: 'Am Feuer innehalten',
    text: 'Das Feuer knistert. Für einen Moment wirkt der Plan plausibel, obwohl niemand ihn erklären kann.',
  },
  {
    id: 'clubhouse-wall',
    regionId: 'north',
    x: 430,
    y: 300,
    title: 'Vereinschronik',
    prompt: 'Die alten Fotos ansehen',
    text: 'Vier Jahrzehnte Campinggeschichte. Die Frisuren ändern sich, die Plastikstühle nicht.',
  },
  {
    id: 'festival-lights',
    regionId: 'festival',
    x: 1750,
    y: 555,
    title: 'Lichterbogen',
    prompt: 'Unter den Lichtern stehen',
    text: 'Die Lichterkette flackert im Takt einer Musik, die noch gar nicht läuft.',
  },
  {
    id: 'lake-lookout',
    regionId: 'beach',
    x: 2350,
    y: 420,
    title: 'Seeblick',
    prompt: 'Über die Adria schauen',
    text: 'Die Wasseroberfläche ist friedlich. Das ist vermutlich nur mangelnde Information.',
  },
  {
    id: 'service-map',
    regionId: 'woodland',
    x: 1850,
    y: 1320,
    title: 'Alter Lageplan',
    prompt: 'Den verblichenen Plan prüfen',
    text: 'Der Lageplan zeigt drei Wege, von denen zwei in der Realität von Brennnesseln verwaltet werden.',
  },
  {
    id: 'cove-echo',
    regionId: 'cove',
    x: 2380,
    y: 1450,
    title: 'Felsenecho',
    prompt: 'In die Bucht rufen',
    text: 'Das Echo antwortet mit leichter Verzögerung und deutlich mehr Selbstvertrauen.',
  },
];

export function countFoundFriends(state: WorldProgressState): number {
  return FRIEND_IDS.filter((id) => state.flags[`met-${id}`]).length;
}

export function completedGameCount(state: WorldProgressState): number {
  return ['flipCupWon', 'beerPongWon', 'flunkyballWon'].filter((flag) => state.flags[flag]).length;
}

export function isRegionUnlocked(regionId: RegionId, state: WorldProgressState): boolean {
  const friends = countFoundFriends(state);
  const games = completedGameCount(state);
  switch (regionId) {
    case 'arrival':
      return true;
    case 'central':
      return Boolean(state.flags.gateOpen);
    case 'north':
      return friends >= 3 || Boolean(state.flags.firstBattleWon);
    case 'festival':
      return friends >= 5 || state.quests.paper?.status === 'completed';
    case 'beach':
      return friends >= 6 || Boolean(state.flags.firstBattleWon);
    case 'woodland':
      return friends >= 7 || games >= 2;
    case 'cove':
      return friends >= 8 || games >= 3;
  }
}

export function unlockedRegionIds(state: WorldProgressState): RegionId[] {
  return WORLD_REGIONS.filter((region) => isRegionUnlocked(region.id, state)).map((region) => region.id);
}

export function regionAt(x: number, y: number): WorldRegion {
  return WORLD_REGIONS.find((region) => contains(region.bounds, x, y)) ?? WORLD_REGIONS[0];
}

export function contains(bounds: Bounds, x: number, y: number): boolean {
  return x >= bounds.x
    && x <= bounds.x + bounds.width
    && y >= bounds.y
    && y <= bounds.y + bounds.height;
}

export function fallbackSpawn(state: WorldProgressState): { x: number; y: number } {
  if (isRegionUnlocked('central', state)) return { x: 830, y: 1215 };
  return { x: 830, y: 1580 };
}

export function validateExpandedWorld(): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  for (const object of EXPANDED_WORLD_OBJECTS) {
    if (ids.has(object.id)) errors.push(`Duplicate object id: ${object.id}`);
    ids.add(object.id);
    if (object.x < 0 || object.y < 0 || object.x + object.width > EXPANDED_WORLD_WIDTH || object.y + object.height > EXPANDED_WORLD_HEIGHT) {
      errors.push(`Object outside world: ${object.id}`);
    }
    const region = WORLD_REGIONS.find((entry) => entry.id === object.regionId);
    if (!region || !contains(region.bounds, object.x + object.width / 2, object.y + object.height / 2)) {
      errors.push(`Object outside assigned region: ${object.id}`);
    }
  }
  for (const entrance of EXPANDED_ENTRANCES) {
    if (!WORLD_REGIONS.some((region) => region.id === entrance.regionId && contains(region.bounds, entrance.x, entrance.y))) {
      errors.push(`Entrance outside assigned region: ${entrance.id}`);
    }
  }
  for (const npc of EXPANDED_NPCS) {
    if (!WORLD_REGIONS.some((region) => region.id === npc.regionId && contains(region.bounds, npc.x, npc.y))) {
      errors.push(`NPC outside assigned region: ${npc.id}`);
    }
  }
  return errors;
}

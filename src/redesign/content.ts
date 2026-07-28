export const REDESIGN_BUILD_ID = 'adria-redesign-v1';
export const REDESIGN_SAVE_KEY = 'tales-adria-redesign-v1';
export const NINJA_ADVENTURE_ASSET_REVISION = '6ac78232d5aedcc85ce5f27d060ea92366f7c24a';

const assetRoot = `https://raw.githubusercontent.com/pixel-boy/NinjaAdventure/${NINJA_ADVENTURE_ASSET_REVISION}`;

export const REDESIGN_ASSETS = {
  village: `${assetRoot}/content/map/tileset_village_abandoned.png`,
  player: `${assetRoot}/content/character/ninja_blue/sprite.png`,
} as const;

export const WORLD_SIZE = { width: 1536, height: 1024 } as const;
export const TILE_SIZE = 32;

export type DesignedFrameId = keyof typeof DESIGNED_FRAMES;

export const DESIGNED_FRAMES = {
  ancientOak: { x: 0, y: 96, width: 64, height: 48 },
  roundTree: { x: 64, y: 96, width: 32, height: 48 },
  stump: { x: 96, y: 96, width: 16, height: 48 },
  wildBush: { x: 64, y: 64, width: 48, height: 32 },
  receptionLodge: { x: 192, y: 128, width: 64, height: 64 },
  serviceLodge: { x: 256, y: 96, width: 64, height: 80 },
  ruinedArch: { x: 112, y: 0, width: 112, height: 64 },
  cliffShrine: { x: 224, y: 0, width: 64, height: 64 },
  woodPile: { x: 80, y: 176, width: 16, height: 16 },
  campStool: { x: 144, y: 176, width: 16, height: 16 },
  campCrate: { x: 176, y: 176, width: 16, height: 16 },
  campBucket: { x: 224, y: 176, width: 16, height: 16 },
  campPack: { x: 256, y: 176, width: 16, height: 16 },
  serviceShelf: { x: 288, y: 176, width: 16, height: 16 },
  serviceTools: { x: 304, y: 176, width: 16, height: 16 },
} as const;

export interface WorldDecoration {
  id: string;
  frame: DesignedFrameId;
  x: number;
  y: number;
  scale: number;
  flipX?: boolean;
  alpha?: number;
  obstacle?: { width: number; height: number; offsetY?: number };
}

export const WORLD_DECORATIONS: readonly WorldDecoration[] = [
  { id: 'reception', frame: 'receptionLodge', x: 280, y: 836, scale: 2.55, obstacle: { width: 126, height: 72, offsetY: -30 } },
  { id: 'service', frame: 'serviceLodge', x: 1120, y: 770, scale: 2.35, obstacle: { width: 126, height: 94, offsetY: -42 } },
  { id: 'clubhouse', frame: 'cliffShrine', x: 1220, y: 300, scale: 2.5, obstacle: { width: 130, height: 86, offsetY: -32 } },
  { id: 'festival-arch', frame: 'ruinedArch', x: 1030, y: 330, scale: 1.65, alpha: 0.9, obstacle: { width: 120, height: 42, offsetY: -18 } },
  { id: 'oak-nw', frame: 'ancientOak', x: 100, y: 250, scale: 2.2, obstacle: { width: 44, height: 34 } },
  { id: 'oak-west', frame: 'ancientOak', x: 130, y: 660, scale: 2.05, flipX: true, obstacle: { width: 44, height: 34 } },
  { id: 'oak-north', frame: 'ancientOak', x: 620, y: 132, scale: 2.1, obstacle: { width: 44, height: 34 } },
  { id: 'oak-service', frame: 'ancientOak', x: 1320, y: 700, scale: 2.15, flipX: true, obstacle: { width: 44, height: 34 } },
  { id: 'tree-a', frame: 'roundTree', x: 350, y: 165, scale: 2.4, obstacle: { width: 38, height: 34 } },
  { id: 'tree-b', frame: 'roundTree', x: 850, y: 150, scale: 2.3, flipX: true, obstacle: { width: 38, height: 34 } },
  { id: 'tree-c', frame: 'roundTree', x: 1400, y: 415, scale: 2.35, obstacle: { width: 38, height: 34 } },
  { id: 'tree-d', frame: 'roundTree', x: 720, y: 910, scale: 2.25, flipX: true, obstacle: { width: 38, height: 34 } },
  { id: 'bush-a', frame: 'wildBush', x: 430, y: 260, scale: 1.55 },
  { id: 'bush-b', frame: 'wildBush', x: 920, y: 710, scale: 1.45, flipX: true },
  { id: 'bush-c', frame: 'wildBush', x: 330, y: 930, scale: 1.5 },
  { id: 'stump-a', frame: 'stump', x: 870, y: 840, scale: 1.8 },
  { id: 'crate-a', frame: 'campCrate', x: 1045, y: 800, scale: 2.1 },
  { id: 'bucket-a', frame: 'campBucket', x: 1080, y: 802, scale: 2.1 },
  { id: 'shelf-a', frame: 'serviceShelf', x: 1170, y: 816, scale: 2.15 },
  { id: 'tools-a', frame: 'serviceTools', x: 1205, y: 816, scale: 2.15 },
  { id: 'wood-a', frame: 'woodPile', x: 748, y: 518, scale: 2.2 },
  { id: 'stool-a', frame: 'campStool', x: 662, y: 530, scale: 2.15 },
] as const;

export interface DesignedTent {
  id: string;
  label: string;
  x: number;
  y: number;
  color: number;
  accent: number;
  rotation?: number;
}

export const DESIGNED_TENTS: readonly DesignedTent[] = [
  { id: 'home', label: 'Unser Zelt', x: 560, y: 610, color: 0xc85c42, accent: 0xf3c969, rotation: -0.05 },
  { id: 'andre', label: 'André', x: 690, y: 620, color: 0x2f7486, accent: 0xf1c263, rotation: 0.04 },
  { id: 'rene', label: 'René', x: 790, y: 540, color: 0x785d91, accent: 0xe7d7a6, rotation: -0.03 },
  { id: 'lars', label: 'Lars', x: 720, y: 420, color: 0x4e7b53, accent: 0xf0d28a, rotation: 0.05 },
  { id: 'danny', label: 'Danny', x: 575, y: 430, color: 0x9a6046, accent: 0xf0c57b, rotation: -0.04 },
] as const;

export interface NpcDefinition {
  id: string;
  name: string;
  role: string;
  x: number;
  y: number;
  tint: number;
  dialogue: string;
}

export const NPCS: readonly NpcDefinition[] = [
  { id: 'gundula', name: 'Gundula', role: 'Platzleitung', x: 328, y: 848, tint: 0xe4d4bd, dialogue: 'Wer hier reinwill, meldet sich ordentlich an. Danach könnt ihr euren Kram zum Taucherplatz bringen.' },
  { id: 'uli', name: 'Uli', role: 'Schlüsselgewalt', x: 240, y: 856, tint: 0xa7b2ba, dialogue: 'Schranke ist offen. Macht keinen Unsinn und blockiert nicht den Weg.' },
  { id: 'andre', name: 'André', role: 'Improvisationschef', x: 690, y: 650, tint: 0xf1c263, dialogue: 'Sieht schon deutlich mehr nach Urlaub aus. Uns fehlen aber noch Kabel, Getränke und die Zeltsäcke.' },
  { id: 'rene', name: 'René', role: 'Materialwart', x: 815, y: 570, tint: 0xb59bd2, dialogue: 'Ich habe den Platz freigehalten. Bring die Versorgung zusammen, dann machen wir Feuer.' },
  { id: 'lars', name: 'Lars', role: 'Seebeauftragter', x: 725, y: 455, tint: 0x8bbd7e, dialogue: 'Nach dem Aufbau geht es an den See. Vorher wird hier nichts halb fertig liegen gelassen.' },
  { id: 'danny', name: 'Danny', role: 'Getränkelogistik', x: 560, y: 462, tint: 0xd79b73, dialogue: 'Die Kühlbox steht im Servicehof. Ich habe sie wirklich nicht vergessen. Wahrscheinlich.' },
] as const;

export const SUPPLIES = [
  { id: 'cable', label: 'Kabeltrommel', x: 1025, y: 846, frame: 'serviceTools' as DesignedFrameId },
  { id: 'drinks', label: 'Getränke', x: 1090, y: 846, frame: 'campCrate' as DesignedFrameId },
  { id: 'tentbags', label: 'Zeltsäcke', x: 1160, y: 846, frame: 'campPack' as DesignedFrameId },
] as const;

export const QUEST_STEPS = [
  { id: 'registration', title: 'Ankommen', objective: 'Melde dich bei Gundula an der Rezeption an.', target: { x: 328, y: 848 } },
  { id: 'supplies', title: 'Versorgung', objective: 'Hole Kabeltrommel, Getränke und Zeltsäcke aus dem Servicehof.', target: { x: 1100, y: 820 } },
  { id: 'friends', title: 'Zeltkreis', objective: 'Sprich mit André, René, Lars und Danny.', target: { x: 680, y: 535 } },
  { id: 'campfire', title: 'Feuer frei', objective: 'Entzünde die gemeinsame Feuerstelle im Zeltkreis.', target: { x: 680, y: 525 } },
  { id: 'lake', title: 'Blaue Adria', objective: 'Gehe zum Strand und prüfe das Wasser.', target: { x: 1395, y: 535 } },
  { id: 'complete', title: 'Testbuild abgeschlossen', objective: 'Erkunde den Redesign-Build oder setze den Testfortschritt zurück.', target: { x: 680, y: 525 } },
] as const;

export interface RedesignProgress {
  questIndex: number;
  supplies: string[];
  friends: string[];
  fireLit: boolean;
  lakeReached: boolean;
  player: { x: number; y: number };
}

export const INITIAL_PROGRESS: RedesignProgress = {
  questIndex: 0,
  supplies: [],
  friends: [],
  fireLit: false,
  lakeReached: false,
  player: { x: 410, y: 880 },
};

export function validateRedesignContent(): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  for (const item of WORLD_DECORATIONS) {
    if (ids.has(item.id)) errors.push(`duplicate decoration: ${item.id}`);
    ids.add(item.id);
    if (!(item.frame in DESIGNED_FRAMES)) errors.push(`unknown frame: ${item.frame}`);
    if (item.x < 0 || item.x > WORLD_SIZE.width || item.y < 0 || item.y > WORLD_SIZE.height) errors.push(`out of bounds: ${item.id}`);
  }
  if (DESIGNED_TENTS.length !== 5) errors.push('the redesigned tent circle must contain five tents');
  if (NPCS.length < 6) errors.push('the redesigned slice must contain the core cast');
  if (SUPPLIES.length !== 3) errors.push('the arrival supply loop must contain three items');
  if (QUEST_STEPS.length < 6) errors.push('the redesigned slice must contain a complete quest arc');
  if (!REDESIGN_ASSETS.village.includes(NINJA_ADVENTURE_ASSET_REVISION)) errors.push('village asset is not revision pinned');
  if (!REDESIGN_ASSETS.player.includes(NINJA_ADVENTURE_ASSET_REVISION)) errors.push('player asset is not revision pinned');
  return errors;
}

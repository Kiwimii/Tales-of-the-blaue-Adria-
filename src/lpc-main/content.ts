import { RELATIONSHIP_CHARACTERS } from '../game/content';

export const LPC_REVISION = '0f898bb675a1abe16ce430e82e3bf9daed278690';
export const LPC_RAW_ROOT = `https://raw.githubusercontent.com/LiberatedPixelCup/Universal-LPC-Spritesheet-Character-Generator/${LPC_REVISION}/spritesheets`;

export const LPC_LAYERS = {
  body: `${LPC_RAW_ROOT}/body/bodies/male/walk.png`,
  head: `${LPC_RAW_ROOT}/head/heads/human/male/walk.png`,
  face: `${LPC_RAW_ROOT}/head/faces/male/neutral/walk.png`,
} as const;

export type AnimationState =
  | 'idle'
  | 'walk'
  | 'talk'
  | 'wave'
  | 'drink'
  | 'cheer'
  | 'stagger'
  | 'hit'
  | 'sit'
  | 'carry'
  | 'phone';

export type HairStyle =
  | 'short'
  | 'curly'
  | 'sidepart'
  | 'cap'
  | 'spiky-white'
  | 'bald'
  | 'buzz'
  | 'messy'
  | 'wave'
  | 'beanie'
  | 'long';

export type OutfitStyle =
  | 'tee'
  | 'camp-shirt'
  | 'hoodie'
  | 'pattern-shirt'
  | 'strict-jacket'
  | 'tank-top'
  | 'plaid'
  | 'polo'
  | 'jersey'
  | 'utility-vest'
  | 'night-shirt';

export type Accessory =
  | 'glasses'
  | 'earring'
  | 'beard'
  | 'sunglasses'
  | 'clipboard'
  | 'keys'
  | 'bag'
  | 'phone'
  | 'spatula'
  | 'whistle'
  | 'headphones'
  | 'plant'
  | 'none';

export interface CharacterVisual {
  id: string;
  name: string;
  role: string;
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  shirt: number;
  shirtShade: number;
  trousers: number;
  accent: number;
  hair: number;
  hairStyle: HairStyle;
  outfit: OutfitStyle;
  accessories: Accessory[];
  idleAnimation: AnimationState;
  greetingAnimation: AnimationState;
  dialogue: string;
}

export interface WorldTarget {
  id: string;
  label: string;
  kind: 'activity' | 'service' | 'zone';
  x: number;
  y: number;
  radius: number;
  action: 'battle' | 'flipCup' | 'beerPong' | 'flunkyball' | 'rest' | 'toilet' | 'lake' | 'grill';
}

export const PLAYER_VISUAL: CharacterVisual = {
  id: 'player', name: 'Du', role: 'WOCHENEND-CAMPER', x: 260, y: 720,
  scaleX: 1, scaleY: 1, shirt: 0xe5ad43, shirtShade: 0x9b6628, trousers: 0x294954,
  accent: 0xf4e5ba, hair: 0x4a3224, hairStyle: 'short', outfit: 'tee', accessories: ['bag'],
  idleAnimation: 'idle', greetingAnimation: 'wave', dialogue: '',
};

const visuals: CharacterVisual[] = [
  {
    id: 'gundula', name: 'Gundula', role: 'PLATZLEITUNG', x: 250, y: 250,
    scaleX: 0.9, scaleY: 0.94, shirt: 0x32465c, shirtShade: 0x202f42, trousers: 0x25272c,
    accent: 0xd9c9a0, hair: 0xe8e3d8, hairStyle: 'spiky-white', outfit: 'strict-jacket', accessories: ['glasses', 'clipboard'],
    idleAnimation: 'phone', greetingAnimation: 'talk', dialogue: 'Name, Gruppe, Platznummer. Und diesmal bitte in einer Reihenfolge.',
  },
  {
    id: 'uli', name: 'Uli', role: 'TECHNIK UND SCHLÜSSEL', x: 430, y: 300,
    scaleX: 1.2, scaleY: 0.98, shirt: 0x24282b, shirtShade: 0x151719, trousers: 0x5f654f,
    accent: 0xc6a955, hair: 0x2d211b, hairStyle: 'bald', outfit: 'tank-top', accessories: ['keys'],
    idleAnimation: 'carry', greetingAnimation: 'talk', dialogue: 'Parkplatz vier. Die Zahl zwischen drei und fünf.',
  },
  {
    id: 'manni', name: 'Manni Mische', role: 'VERSORGER', x: 970, y: 330,
    scaleX: 1.06, scaleY: 1.01, shirt: 0x5d794a, shirtShade: 0x3d5232, trousers: 0x3b4039,
    accent: 0xf0d071, hair: 0x57402e, hairStyle: 'beanie', outfit: 'utility-vest', accessories: ['beard'],
    idleAnimation: 'stagger', greetingAnimation: 'wave', dialogue: 'Mischungsverhältnis ist auch nur angewandte Mathematik.',
  },
  {
    id: 'ronny', name: 'Rivalen-Ronny', role: 'PARKPLATZ-PHILOSOPH', x: 1120, y: 470,
    scaleX: 1.08, scaleY: 1.05, shirt: 0x9b4037, shirtShade: 0x662b28, trousers: 0x32343b,
    accent: 0xe6c85d, hair: 0x32251e, hairStyle: 'buzz', outfit: 'polo', accessories: ['whistle'],
    idleAnimation: 'talk', greetingAnimation: 'talk', dialogue: 'Ich erkläre dir das kurz. Zuerst müssen wir aber ganz vorne anfangen.',
  },
  {
    id: 'andre', name: 'André', role: 'ORGANISATOR', x: 500, y: 535,
    scaleX: 1.02, scaleY: 1.08, shirt: 0xe4ad3c, shirtShade: 0xa96e24, trousers: 0x263e49,
    accent: 0xf5e5b5, hair: 0x513627, hairStyle: 'short', outfit: 'tee', accessories: ['glasses', 'bag'],
    idleAnimation: 'phone', greetingAnimation: 'wave', dialogue: 'Ich hatte einen Ablaufplan. Dann seid ihr angekommen.',
  },
  {
    id: 'rene', name: 'René', role: 'DIPLOMAT', x: 630, y: 475,
    scaleX: 0.91, scaleY: 1.03, shirt: 0x2f8b87, shirtShade: 0x1d5f62, trousers: 0x7b3f47,
    accent: 0xf0d39a, hair: 0x242323, hairStyle: 'curly', outfit: 'camp-shirt', accessories: ['earring'],
    idleAnimation: 'idle', greetingAnimation: 'talk', dialogue: 'Lass mich reden. Du kannst so aussehen, als würdest du etwas bereuen.',
  },
  {
    id: 'lars', name: 'Lars', role: 'PEGELMANAGER', x: 760, y: 545,
    scaleX: 1.09, scaleY: 1.02, shirt: 0x5f7042, shirtShade: 0x3f4d31, trousers: 0x35363a,
    accent: 0xb94a3d, hair: 0x4d3224, hairStyle: 'cap', outfit: 'hoodie', accessories: ['beard'],
    idleAnimation: 'drink', greetingAnimation: 'cheer', dialogue: 'Wasser? Klar. Ist doch im Bier drin.',
  },
  {
    id: 'danny', name: 'Danny', role: 'FRÜHABREISER', x: 890, y: 520,
    scaleX: 0.94, scaleY: 1.05, shirt: 0x396e9d, shirtShade: 0x234b75, trousers: 0xd1b66c,
    accent: 0xe9eef2, hair: 0x5b3927, hairStyle: 'sidepart', outfit: 'pattern-shirt', accessories: ['sunglasses'],
    idleAnimation: 'phone', greetingAnimation: 'wave', dialogue: 'Sonntag früh habe ich einen wichtigen Termin: nicht aufräumen.',
  },
  {
    id: 'gregor', name: 'Gregor', role: 'GRILLPHILOSOPH', x: 690, y: 680,
    scaleX: 1.12, scaleY: 1.02, shirt: 0xb76532, shirtShade: 0x7b4127, trousers: 0x403a35,
    accent: 0xf3cf69, hair: 0x3d2a20, hairStyle: 'messy', outfit: 'plaid', accessories: ['spatula', 'beard'],
    idleAnimation: 'carry', greetingAnimation: 'talk', dialogue: 'Die Wurst ist nicht verbrannt. Sie hat Charakter entwickelt.',
  },
  {
    id: 'felix', name: 'Felix', role: 'FLIRTBEAUFTRAGTER', x: 830, y: 690,
    scaleX: 0.95, scaleY: 1.06, shirt: 0x9a4eb2, shirtShade: 0x653477, trousers: 0x2f3a4b,
    accent: 0xf3d5e9, hair: 0x6a442c, hairStyle: 'wave', outfit: 'polo', accessories: ['sunglasses'],
    idleAnimation: 'wave', greetingAnimation: 'wave', dialogue: 'Blickkontakt. Gut, sie suchte die Toilette, aber Blickkontakt.',
  },
  {
    id: 'masl', name: 'Masl', role: 'SPIELLEITER', x: 1010, y: 680,
    scaleX: 1.01, scaleY: 1.03, shirt: 0x4d8b55, shirtShade: 0x315c39, trousers: 0x37403f,
    accent: 0xf2df7c, hair: 0x4c3225, hairStyle: 'short', outfit: 'jersey', accessories: ['whistle'],
    idleAnimation: 'talk', greetingAnimation: 'cheer', dialogue: 'Regeln sind nur dann gut, wenn jemand sie laut genug missversteht.',
  },
  {
    id: 'schubert', name: 'Schubert', role: 'BOTANIKER', x: 1180, y: 710,
    scaleX: 0.97, scaleY: 1.07, shirt: 0x567c55, shirtShade: 0x39543a, trousers: 0x3d3a46,
    accent: 0x9bc67e, hair: 0x4c3528, hairStyle: 'long', outfit: 'camp-shirt', accessories: ['plant'],
    idleAnimation: 'stagger', greetingAnimation: 'talk', dialogue: 'Das sind keine roten Augen. Das ist botanische Begeisterung.',
  },
  {
    id: 'schima', name: 'Schima', role: 'NACHTMENSCH', x: 1240, y: 820,
    scaleX: 1.04, scaleY: 1.04, shirt: 0x3d4d8c, shirtShade: 0x293462, trousers: 0x24283a,
    accent: 0x8ea4e9, hair: 0x24242c, hairStyle: 'messy', outfit: 'night-shirt', accessories: ['headphones'],
    idleAnimation: 'sit', greetingAnimation: 'wave', dialogue: 'Tagsüber Energiesparmodus. Ab Mitternacht gesellschaftliche Abrissbirne.',
  },
];

export const CHARACTER_VISUALS: readonly CharacterVisual[] = visuals;

export const WORLD_TARGETS: readonly WorldTarget[] = [
  { id: 'rest', label: 'Im Zelt ausruhen', kind: 'service', x: 575, y: 830, radius: 95, action: 'rest' },
  { id: 'toilet', label: 'Sanitärgebäude', kind: 'service', x: 970, y: 235, radius: 90, action: 'toilet' },
  { id: 'battle', label: 'Camping-Duell gegen Ronny', kind: 'activity', x: 1120, y: 470, radius: 110, action: 'battle' },
  { id: 'flip', label: 'Flip Cup', kind: 'activity', x: 445, y: 850, radius: 90, action: 'flipCup' },
  { id: 'pong', label: 'Beer Pong', kind: 'activity', x: 780, y: 850, radius: 90, action: 'beerPong' },
  { id: 'flunky', label: 'Flunkyball am Strand', kind: 'activity', x: 1370, y: 650, radius: 110, action: 'flunkyball' },
  { id: 'lake', label: 'An der Blauen Adria', kind: 'zone', x: 1450, y: 330, radius: 120, action: 'lake' },
  { id: 'grill', label: 'Grillrunde', kind: 'zone', x: 690, y: 680, radius: 100, action: 'grill' },
];

export const CHARACTER_BY_ID = Object.fromEntries(CHARACTER_VISUALS.map((entry) => [entry.id, entry])) as Record<string, CharacterVisual>;

export function validateLpcMainContent(): string[] {
  const errors: string[] = [];
  const relationshipIds = new Set(RELATIONSHIP_CHARACTERS.map((entry) => entry.id));
  const visualIds = new Set(CHARACTER_VISUALS.map((entry) => entry.id));
  for (const id of relationshipIds) if (!visualIds.has(id)) errors.push(`missing visual for relationship character: ${id}`);
  if (visualIds.size !== CHARACTER_VISUALS.length) errors.push('duplicate visual character ids');
  if (new Set(CHARACTER_VISUALS.map((entry) => entry.outfit)).size < 9) errors.push('not enough outfit variation');
  if (new Set(CHARACTER_VISUALS.map((entry) => entry.hairStyle)).size < 9) errors.push('not enough hair variation');
  const animationStates = new Set<AnimationState>();
  for (const entry of CHARACTER_VISUALS) {
    animationStates.add(entry.idleAnimation);
    animationStates.add(entry.greetingAnimation);
    if (entry.accessories.length === 0) errors.push(`${entry.id}: missing accessory decision`);
  }
  for (const state of ['talk', 'wave', 'drink', 'cheer', 'stagger', 'sit', 'carry', 'phone'] as AnimationState[]) {
    if (!animationStates.has(state)) errors.push(`animation state not represented: ${state}`);
  }
  for (const [key, url] of Object.entries(LPC_LAYERS)) {
    if (!url.includes(LPC_REVISION)) errors.push(`${key}: source is not revision pinned`);
  }
  if (WORLD_TARGETS.length < 8) errors.push('world target coverage is incomplete');
  return errors;
}

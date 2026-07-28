export const LPC_REVISION = '0f898bb675a1abe16ce430e82e3bf9daed278690';
export const LPC_RAW_ROOT = `https://raw.githubusercontent.com/LiberatedPixelCup/Universal-LPC-Spritesheet-Character-Generator/${LPC_REVISION}/spritesheets`;

export const LPC_LAYERS = {
  body: `${LPC_RAW_ROOT}/body/bodies/male/walk.png`,
  head: `${LPC_RAW_ROOT}/head/heads/human/male/walk.png`,
  face: `${LPC_RAW_ROOT}/head/faces/male/neutral/walk.png`,
} as const;

export type HairStyle = 'short' | 'curly' | 'sidepart' | 'cap' | 'spiky-white' | 'bald';
export type OutfitStyle = 'tee' | 'camp-shirt' | 'hoodie' | 'pattern-shirt' | 'strict-jacket' | 'tank-top';
export type Accessory = 'glasses' | 'earring' | 'beard' | 'sunglasses' | 'clipboard' | 'keys' | 'bag' | 'none';

export interface CharacterDesign {
  id: string;
  name: string;
  role: string;
  description: string;
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
  portraitInitials: string;
  dialogue: string[];
}

export const PLAYER_DESIGN: CharacterDesign = {
  id: 'player',
  name: 'Du',
  role: 'WOCHENEND-CAMPER',
  description: 'Neutrale LPC-Testfigur mit moderner Campingkleidung.',
  x: 620,
  y: 610,
  scaleX: 1,
  scaleY: 1,
  shirt: 0xe9b84b,
  shirtShade: 0xb9792e,
  trousers: 0x254d55,
  accent: 0xf5e8bd,
  hair: 0x4a3124,
  hairStyle: 'short',
  outfit: 'tee',
  accessories: ['bag'],
  portraitInitials: 'DU',
  dialogue: [],
};

export const CHARACTER_DESIGNS: readonly CharacterDesign[] = [
  {
    id: 'andre', name: 'André', role: 'ORGANISATOR',
    description: 'Groß, aufrechte Haltung, gelbes Shirt, dunkle Shorts, Brille und Umhängetasche.',
    x: 490, y: 360, scaleX: 1.02, scaleY: 1.08,
    shirt: 0xe4ad3c, shirtShade: 0xa96e24, trousers: 0x263e49, accent: 0xf5e5b5,
    hair: 0x513627, hairStyle: 'short', outfit: 'tee', accessories: ['glasses', 'bag'], portraitInitials: 'AJ',
    dialogue: ['Das ist deutlich näher dran. Die Figur braucht einen eigenen Umriss, nicht nur eine andere Hemdfarbe.', 'Vergleiche besonders Körperhöhe, Brille und Tasche mit den anderen.'],
  },
  {
    id: 'rene', name: 'René', role: 'TAUCHER',
    description: 'Schmale Figur, offenes petrolfarbenes Camp-Shirt, dunkle Locken und einzelner Ohrring.',
    x: 610, y: 320, scaleX: 0.91, scaleY: 1.03,
    shirt: 0x2f8b87, shirtShade: 0x1d5f62, trousers: 0x7b3f47, accent: 0xf0d39a,
    hair: 0x242323, hairStyle: 'curly', outfit: 'camp-shirt', accessories: ['earring'], portraitInitials: 'RE',
    dialogue: ['Meine Silhouette ist schmaler, das Hemd ist offen und die Haare haben ein eigenes Volumen.', 'So sollten die Freunde schon aus der Entfernung unterscheidbar sein.'],
  },
  {
    id: 'lars', name: 'Lars', role: 'AUSRÜSTUNG',
    description: 'Kräftiger Oberkörper, olivfarbener Hoodie, rotes Cap und markanter Bart.',
    x: 735, y: 360, scaleX: 1.09, scaleY: 1.02,
    shirt: 0x5f7042, shirtShade: 0x3f4d31, trousers: 0x35363a, accent: 0xb94a3d,
    hair: 0x4d3224, hairStyle: 'cap', outfit: 'hoodie', accessories: ['beard'], portraitInitials: 'LA',
    dialogue: ['Cap, Bart und Hoodie machen mehr aus als zehn zufällige Fantasy-Accessoires.', 'Die Figur ist bewusst breiter als René und André.'],
  },
  {
    id: 'danny', name: 'Danny', role: 'PARTY UND MUSIK',
    description: 'Schlanke Figur, blau gemustertes Hemd, Seitenscheitel und dunkle Sonnenbrille.',
    x: 850, y: 455, scaleX: 0.94, scaleY: 1.05,
    shirt: 0x396e9d, shirtShade: 0x234b75, trousers: 0xd1b66c, accent: 0xe9eef2,
    hair: 0x5b3927, hairStyle: 'sidepart', outfit: 'pattern-shirt', accessories: ['sunglasses'], portraitInitials: 'DA',
    dialogue: ['Das Muster sitzt nur auf dem Oberkörper, damit die LPC-Laufbewegung sauber bleibt.', 'Die Sonnenbrille und der Seitenscheitel sind klare Wiedererkennungsmerkmale.'],
  },
  {
    id: 'gundula', name: 'Gundula', role: 'PLATZLEITUNG',
    description: 'Kleinere strenge Figur mit weißem Stachelhaar, Brille, Jacke und Klemmbrett.',
    x: 360, y: 455, scaleX: 0.9, scaleY: 0.94,
    shirt: 0x32465c, shirtShade: 0x202f42, trousers: 0x25272c, accent: 0xd9c9a0,
    hair: 0xe8e3d8, hairStyle: 'spiky-white', outfit: 'strict-jacket', accessories: ['glasses', 'clipboard'], portraitInitials: 'GU',
    dialogue: ['Die Platzordnung gilt auch für Pixel. Jede Figur braucht eine klare Funktion und einen klaren Umriss.', 'Mein Klemmbrett ist kein beliebiges Icon, sondern Teil der Rolle.'],
  },
  {
    id: 'uli', name: 'Uli', role: 'TECHNIK UND SCHLÜSSEL',
    description: 'Breite gedrungene Figur, Glatze, dunkles Tanktop, Cargo-Shorts und Schlüsselbund.',
    x: 470, y: 545, scaleX: 1.2, scaleY: 0.98,
    shirt: 0x24282b, shirtShade: 0x151719, trousers: 0x5f654f, accent: 0xc6a955,
    hair: 0x2d211b, hairStyle: 'bald', outfit: 'tank-top', accessories: ['keys'], portraitInitials: 'UL',
    dialogue: ['Breite Schultern, Glatze und Schlüsselbund. Damit ist sofort klar, wer hier vor einem steht.', 'Die Proportion ist bewusst anders als bei allen anderen Figuren.'],
  },
] as const;

export const TENT_POSITIONS = [
  { x: 430, y: 250, color: 0xc85b48, roof: 0x8e3d35 },
  { x: 610, y: 205, color: 0x3f8c82, roof: 0x28625d },
  { x: 790, y: 250, color: 0xd39b45, roof: 0x96662e },
  { x: 880, y: 400, color: 0x547aa4, roof: 0x385777 },
  { x: 340, y: 400, color: 0x8062a0, roof: 0x584371 },
] as const;

export function validateLpcTestContent(): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  for (const character of CHARACTER_DESIGNS) {
    if (ids.has(character.id)) errors.push(`duplicate character id: ${character.id}`);
    ids.add(character.id);
    if (character.dialogue.length < 2) errors.push(`${character.id}: missing dialogue depth`);
    if (character.scaleX < 0.8 || character.scaleX > 1.3) errors.push(`${character.id}: scaleX outside test range`);
    if (character.scaleY < 0.8 || character.scaleY > 1.3) errors.push(`${character.id}: scaleY outside test range`);
    if (character.accessories.length === 0) errors.push(`${character.id}: character needs explicit accessory decision`);
  }
  if (CHARACTER_DESIGNS.length !== 6) errors.push('LPC test must contain exactly six comparison characters');
  if (new Set(CHARACTER_DESIGNS.map((character) => character.hairStyle)).size < 6) errors.push('hair silhouettes are not varied enough');
  if (new Set(CHARACTER_DESIGNS.map((character) => character.outfit)).size < 6) errors.push('outfit silhouettes are not varied enough');
  for (const [key, url] of Object.entries(LPC_LAYERS)) {
    if (!url.startsWith('https://raw.githubusercontent.com/')) errors.push(`${key}: LPC source must use HTTPS raw GitHub`);
    if (!url.includes(LPC_REVISION)) errors.push(`${key}: LPC source is not revision pinned`);
  }
  return errors;
}

export const NINJA_ADVENTURE_ASSET = {
  textureKey: 'cc0-ninja-adventure-village',
  sourceRevision: '6ac78232d5aedcc85ce5f27d060ea92366f7c24a',
  sourceUrl: 'https://raw.githubusercontent.com/pixel-boy/NinjaAdventure/6ac78232d5aedcc85ce5f27d060ea92366f7c24a/content/map/tileset_village_abandoned.png',
  sourceWidth: 320,
  sourceHeight: 192,
  tileSize: 16,
  license: 'CC0-1.0',
  creator: 'Pixel-Boy & AAA',
} as const;

export interface PixelArtCrop {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const PIXEL_ART_CROPS = {
  'old-oak': { x: 0, y: 96, width: 64, height: 48 },
  'round-tree': { x: 64, y: 96, width: 32, height: 48 },
  stump: { x: 96, y: 96, width: 16, height: 48 },
  'wild-bush': { x: 64, y: 64, width: 48, height: 32 },
  'service-hut': { x: 256, y: 96, width: 64, height: 80 },
  'camp-stool': { x: 144, y: 176, width: 16, height: 16 },
  'camp-crate': { x: 176, y: 176, width: 16, height: 16 },
  'camp-bucket': { x: 224, y: 176, width: 16, height: 16 },
  'service-shelf': { x: 288, y: 176, width: 16, height: 16 },
  'service-tools': { x: 304, y: 176, width: 16, height: 16 },
} as const satisfies Record<string, PixelArtCrop>;

export type PixelArtCropId = keyof typeof PIXEL_ART_CROPS;

export interface PixelArtPlacement {
  id: string;
  crop: PixelArtCropId;
  x: number;
  y: number;
  scale: number;
  alpha?: number;
  flipX?: boolean;
}

/**
 * Curated decoration only. Existing bespoke tents, characters, quest objects,
 * collisions and interactions remain authoritative.
 */
export const PIXEL_ART_PLACEMENTS: readonly PixelArtPlacement[] = [
  { id: 'north-oak-west', crop: 'old-oak', x: 92, y: 322, scale: 2.05, alpha: 0.92 },
  { id: 'north-tree-midwest', crop: 'round-tree', x: 430, y: 316, scale: 2.05, flipX: true },
  { id: 'north-tree-mideast', crop: 'round-tree', x: 1082, y: 316, scale: 1.95 },
  { id: 'north-oak-east', crop: 'old-oak', x: 1320, y: 326, scale: 1.88, flipX: true, alpha: 0.94 },
  { id: 'service-oak-north', crop: 'old-oak', x: 1465, y: 1055, scale: 1.95, alpha: 0.9 },
  { id: 'service-tree-east', crop: 'round-tree', x: 1882, y: 1050, scale: 2.05, flipX: true },
  { id: 'service-tree-south', crop: 'round-tree', x: 1500, y: 1665, scale: 1.9 },
  { id: 'cove-oak-south', crop: 'old-oak', x: 1875, y: 1680, scale: 2, flipX: true, alpha: 0.9 },
  { id: 'service-bush', crop: 'wild-bush', x: 1518, y: 1190, scale: 1.55, alpha: 0.86 },
  { id: 'service-stump', crop: 'stump', x: 1860, y: 1240, scale: 1.7, flipX: true },
  { id: 'service-crate', crop: 'camp-crate', x: 1570, y: 1530, scale: 2 },
  { id: 'service-bucket', crop: 'camp-bucket', x: 1605, y: 1532, scale: 2 },
  { id: 'service-shelf', crop: 'service-shelf', x: 1640, y: 1532, scale: 2 },
  { id: 'service-tools', crop: 'service-tools', x: 1675, y: 1532, scale: 2 },
] as const;

export function validatePixelArtLayer(): string[] {
  const errors: string[] = [];

  for (const [id, crop] of Object.entries(PIXEL_ART_CROPS)) {
    if (![crop.x, crop.y, crop.width, crop.height].every(Number.isInteger)) {
      errors.push(`${id}: crop values must be integers`);
    }
    if (crop.width <= 0 || crop.height <= 0) errors.push(`${id}: crop must have a positive size`);
    if (crop.x < 0 || crop.y < 0) errors.push(`${id}: crop must start inside the source image`);
    if (crop.x + crop.width > NINJA_ADVENTURE_ASSET.sourceWidth) errors.push(`${id}: crop exceeds source width`);
    if (crop.y + crop.height > NINJA_ADVENTURE_ASSET.sourceHeight) errors.push(`${id}: crop exceeds source height`);
  }

  const ids = new Set<string>();
  for (const placement of PIXEL_ART_PLACEMENTS) {
    if (ids.has(placement.id)) errors.push(`${placement.id}: duplicate placement id`);
    ids.add(placement.id);
    if (!(placement.crop in PIXEL_ART_CROPS)) errors.push(`${placement.id}: unknown crop ${placement.crop}`);
    if (placement.x < 0 || placement.x > 2600 || placement.y < 0 || placement.y > 1800) {
      errors.push(`${placement.id}: placement is outside the world`);
    }
    if (!Number.isFinite(placement.scale) || placement.scale <= 0) errors.push(`${placement.id}: invalid scale`);
  }

  return errors;
}

import { describe, expect, it } from 'vitest';
import {
  NINJA_ADVENTURE_ASSET,
  PIXEL_ART_CROPS,
  PIXEL_ART_PLACEMENTS,
  validatePixelArtLayer,
} from './pixelArtLayer';

describe('pixel art environment layer', () => {
  it('uses a revision-pinned HTTPS source and records the open license', () => {
    expect(NINJA_ADVENTURE_ASSET.sourceUrl).toMatch(/^https:\/\/raw\.githubusercontent\.com\//);
    expect(NINJA_ADVENTURE_ASSET.sourceRevision).toMatch(/^[0-9a-f]{40}$/);
    expect(NINJA_ADVENTURE_ASSET.sourceUrl).toContain(NINJA_ADVENTURE_ASSET.sourceRevision);
    expect(NINJA_ADVENTURE_ASSET.license).toBe('CC0-1.0');
  });

  it('keeps every crop and placement inside the known source and world bounds', () => {
    expect(validatePixelArtLayer()).toEqual([]);
  });

  it('adds a meaningful but restrained first asset pass', () => {
    expect(Object.keys(PIXEL_ART_CROPS).length).toBeGreaterThanOrEqual(8);
    expect(PIXEL_ART_PLACEMENTS.length).toBeGreaterThanOrEqual(12);
    expect(new Set(PIXEL_ART_PLACEMENTS.map((placement) => placement.id)).size).toBe(PIXEL_ART_PLACEMENTS.length);
  });
});

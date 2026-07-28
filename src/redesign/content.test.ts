import { describe, expect, it } from 'vitest';
import {
  DESIGNED_FRAMES,
  DESIGNED_TENTS,
  NINJA_ADVENTURE_ASSET_REVISION,
  NPCS,
  QUEST_STEPS,
  REDESIGN_ASSETS,
  SUPPLIES,
  WORLD_DECORATIONS,
  validateRedesignContent,
} from './content';

describe('standalone redesign content', () => {
  it('pins every external asset to one immutable CC0 source revision', () => {
    expect(NINJA_ADVENTURE_ASSET_REVISION).toMatch(/^[0-9a-f]{40}$/);
    expect(Object.values(REDESIGN_ASSETS).every((url) => url.includes(NINJA_ADVENTURE_ASSET_REVISION))).toBe(true);
  });

  it('contains a complete visual and quest slice', () => {
    expect(Object.keys(DESIGNED_FRAMES).length).toBeGreaterThanOrEqual(12);
    expect(WORLD_DECORATIONS.length).toBeGreaterThanOrEqual(20);
    expect(DESIGNED_TENTS).toHaveLength(5);
    expect(NPCS.length).toBeGreaterThanOrEqual(6);
    expect(SUPPLIES).toHaveLength(3);
    expect(QUEST_STEPS.length).toBeGreaterThanOrEqual(6);
  });

  it('keeps ids, positions and asset references valid', () => {
    expect(validateRedesignContent()).toEqual([]);
  });
});

import { describe, expect, it } from 'vitest';
import { CHARACTER_VISUALS, LPC_LAYERS, LPC_REVISION, WORLD_TARGETS, validateLpcMainContent } from './content';

describe('LPC main concept content', () => {
  it('covers every gameplay character with broad visual variation', () => {
    expect(validateLpcMainContent()).toEqual([]);
    expect(CHARACTER_VISUALS).toHaveLength(13);
    expect(new Set(CHARACTER_VISUALS.map((entry) => entry.outfit)).size).toBeGreaterThanOrEqual(9);
    expect(new Set(CHARACTER_VISUALS.map((entry) => entry.hairStyle)).size).toBeGreaterThanOrEqual(9);
  });

  it('pins LPC runtime sources and exposes the main activity loop', () => {
    expect(Object.values(LPC_LAYERS).every((url) => url.includes(LPC_REVISION))).toBe(true);
    expect(new Set(WORLD_TARGETS.map((entry) => entry.action))).toEqual(new Set([
      'rest', 'toilet', 'battle', 'flipCup', 'beerPong', 'flunkyball', 'lake', 'grill',
    ]));
  });
});

import { describe, expect, it } from 'vitest';
import { colorShade, seededFraction, selectVisualProfile, VISUAL_PROFILES } from '../src/game/visuals';

describe('adaptive visual profile', () => {
  it('keeps the full cinematic profile on capable touch devices', () => {
    const profile = selectVisualProfile({
      coarsePointer: true,
      deviceMemory: 8,
      hardwareConcurrency: 8,
      reducedMotion: false,
    });
    expect(profile.tier).toBe('cinematic');
    expect(profile.ambientSprites).toBe(VISUAL_PROFILES.cinematic.ambientSprites);
  });

  it('reduces animated effects only on constrained touch devices', () => {
    const profile = selectVisualProfile({
      coarsePointer: true,
      deviceMemory: 4,
      hardwareConcurrency: 4,
      reducedMotion: false,
    });
    expect(profile.tier).toBe('balanced');
    expect(profile.ambientSprites).toBeLessThan(VISUAL_PROFILES.cinematic.ambientSprites);
    expect(profile.postFx).toBe(false);
  });

  it('respects reduced motion independent of pointer type', () => {
    expect(selectVisualProfile({
      coarsePointer: false,
      deviceMemory: 16,
      hardwareConcurrency: 16,
      reducedMotion: true,
    }).tier).toBe('balanced');
  });

  it('keeps procedural details deterministic and colors bounded', () => {
    expect(seededFraction('grass-x', 42)).toBe(seededFraction('grass-x', 42));
    expect(seededFraction('grass-x', 42)).toBeGreaterThanOrEqual(0);
    expect(seededFraction('grass-x', 42)).toBeLessThan(1);
    expect(colorShade(0xf0c080, 1.2)).toBeLessThanOrEqual(0xffffff);
    expect(colorShade(0x102030, 0.4)).toBeGreaterThanOrEqual(0);
  });
});

import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  GRAPHICS_MODE_STORAGE_KEY,
  currentGraphicsMode,
  currentVisualProfile,
  graphicsModeDescription,
  selectVisualProfile,
  setGraphicsMode,
} from '../src/game/visuals';

class MemoryStorage {
  private values = new Map<string, string>();
  getItem(key: string): string | null { return this.values.get(key) ?? null; }
  setItem(key: string, value: string): void { this.values.set(key, value); }
  removeItem(key: string): void { this.values.delete(key); }
  clear(): void { this.values.clear(); }
  key(index: number): string | null { return [...this.values.keys()][index] ?? null; }
  get length(): number { return this.values.size; }
}

afterEach(() => vi.unstubAllGlobals());

describe('graphics options', () => {
  it('selects a reduced profile for constrained coarse-pointer devices', () => {
    const profile = selectVisualProfile({ coarsePointer: true, deviceMemory: 4, hardwareConcurrency: 4, reducedMotion: false });
    expect(profile.tier).toBe('balanced');
    expect(profile.detailDensity).toBeLessThan(0.6);
    expect(profile.animatedDetails).toBe(false);
  });

  it('persists explicit mobile and PC profiles', () => {
    const storage = new MemoryStorage();
    vi.stubGlobal('window', {
      localStorage: storage,
      matchMedia: () => ({ matches: false }),
    });
    vi.stubGlobal('navigator', { hardwareConcurrency: 8 });

    setGraphicsMode('mobile');
    expect(storage.getItem(GRAPHICS_MODE_STORAGE_KEY)).toBe('mobile');
    expect(currentGraphicsMode()).toBe('mobile');
    expect(currentVisualProfile().tier).toBe('balanced');

    setGraphicsMode('pc');
    expect(currentVisualProfile().tier).toBe('cinematic');
    expect(currentVisualProfile().detailDensity).toBe(1);
  });

  it('explains the performance difference in the menu copy', () => {
    expect(graphicsModeDescription('mobile')).toContain('Akkuverbrauch');
    expect(graphicsModeDescription('pc')).toContain('Detailtiefe');
    expect(graphicsModeDescription('auto')).toContain('automatisch');
  });
});

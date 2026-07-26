import { describe, expect, it, vi } from 'vitest';
import { GameStore, STORAGE_KEY, type StorageAdapter } from '../src/game/state/GameStore';
import type { PlayerProfile } from '../src/game/types';

const profile: PlayerProfile = {
  name: 'André',
  skinTone: '#efc09b',
  hair: '#49301f',
  shirt: '#e3b74f',
  trait: 'charmant',
};

describe('GameStore', () => {
  it('starts on Friday morning with an isolated initial state', () => {
    const store = new GameStore(memoryStorage());
    const first = store.snapshot();

    expect(first.day).toBe(1);
    expect(first.clockLabel).toBe('07:00');
    expect(first.mode).toBe('creator');

    first.inventory.bier = 999;
    expect(store.snapshot().inventory.bier).toBe(2);
  });

  it('persists a profile and notifies subscribers', () => {
    const storage = memoryStorage();
    const store = new GameStore(storage);
    const listener = vi.fn();
    const unsubscribe = store.subscribe(listener);

    store.setProfile(profile);
    unsubscribe();
    store.setMode('battle');

    expect(listener).toHaveBeenCalledTimes(2);
    expect(JSON.parse(storage.getItem(STORAGE_KEY) ?? '{}')).toMatchObject({
      profile,
      mode: 'battle',
    });
  });

  it('advances from Friday to Sunday without corrupting clock or needs', () => {
    const store = new GameStore(memoryStorage());

    store.advanceMinutes(2 * 24 * 60 + 125);
    const state = store.snapshot();

    expect(state.day).toBe(3);
    expect(state.clockLabel).toBe('09:05');
    expect(Object.values(state.needs).every((value) => value >= 0 && value <= 100)).toBe(true);
  });

  it('applies item effects and refuses unavailable items', () => {
    const store = new GameStore(memoryStorage());
    store.advanceMinutes(60);
    const before = store.snapshot();

    expect(store.useItem('wasser')).toBe(true);
    const after = store.snapshot();
    expect(after.inventory.wasser).toBe(before.inventory.wasser - 1);
    expect(after.needs.thirst).toBeLessThan(before.needs.thirst);

    expect(store.useItem('unbekannt')).toBe(false);
  });

  it('does not recruit the same team member twice', () => {
    const store = new GameStore(memoryStorage());
    const ronny = {
      id: 'rivalen-ronny',
      name: 'Ronny',
      role: 'Hartnäckiger Diskutierer',
      level: 2,
      resolve: 70,
      maxResolve: 70,
    };

    store.recruit(ronny);
    store.recruit(ronny);

    expect(store.snapshot().team).toEqual([ronny]);
  });

  it('repairs malformed or incompatible save data', () => {
    const storage = memoryStorage({
      [STORAGE_KEY]: JSON.stringify({
        version: 1,
        day: -4,
        minutes: 'kaputt',
        needs: { thirst: 77 },
        inventory: null,
      }),
    });

    const repaired = new GameStore(storage).snapshot();
    expect(repaired.day).toBe(1);
    expect(repaired.minutes).toBe(420);
    expect(repaired.needs.thirst).toBe(77);
    expect(repaired.needs.energy).toBe(100);
    expect(repaired.inventory.bier).toBe(2);
  });
});

function memoryStorage(initial: Record<string, string> = {}): StorageAdapter {
  const values = new Map(Object.entries(initial));
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
}

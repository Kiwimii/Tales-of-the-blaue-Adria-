import { describe, expect, it, vi } from 'vitest';
import { FRIEND_IDS } from '../src/game/content';
import { GameStore, STORAGE_KEY, type StorageAdapter } from '../src/game/state/GameStore';
import type { PlayerProfile } from '../src/game/types';

const profile: PlayerProfile = {
  name: 'André',
  skinTone: '#efc09b',
  hair: '#49301f',
  shirt: '#e3b74f',
  shorts: '#263b47',
  hairStyle: 'kurz',
  bodyType: 'normal',
  accessory: 'keins',
  trait: 'charmant',
};

describe('GameStore', () => {
  it('starts on Friday morning with an isolated initial state', () => {
    const store = new GameStore(memoryStorage());
    const first = store.snapshot();

    expect(first.day).toBe(1);
    expect(first.clockLabel).toBe('07:00');
    expect(first.mode).toBe('intro');
    expect(first.prologue.introSeen).toBe(false);

    first.inventory.bier = 999;
    expect(store.snapshot().inventory.bier).toBe(0);
  });

  it('moves from the cinematic intro into character creation without auto-skipping it', () => {
    const store = new GameStore(memoryStorage());
    store.completeIntro();
    expect(store.snapshot()).toMatchObject({
      mode: 'creator',
      prologue: { introSeen: true, shoppingComplete: false },
    });
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
      version: 3,
    });
  });

  it('enforces the 25 euro supermarket budget and carries the selection into the world', () => {
    const store = new GameStore(memoryStorage());
    store.setProfile(profile);

    expect(store.snapshot().mode).toBe('shop');
    expect(store.completeShopping({ batida: 3 })).toMatchObject({ ok: false, total: 30 });

    const result = store.completeShopping({
      wasser: 2,
      wuerste: 1,
      bier: 1,
      klopapier: 1,
      chips: 1,
    });

    expect(result).toEqual({ ok: true, total: 21 });
    expect(store.snapshot()).toMatchObject({
      mode: 'world',
      money: 4,
      prologue: { introSeen: true, shoppingComplete: true, spent: 21 },
      inventory: { wasser: 2, wuerste: 1, bier: 1, klopapier: 1, chips: 1 },
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
    store.setProfile(profile);
    store.completeShopping({ wasser: 2, bier: 1 });
    store.advanceMinutes(60);
    const before = store.snapshot();

    expect(store.useItem('wasser')).toBe(true);
    const after = store.snapshot();
    expect(after.inventory.wasser).toBe(before.inventory.wasser - 1);
    expect(after.needs.thirst).toBeLessThan(before.needs.thirst);

    expect(store.useItem('unbekannt')).toBe(false);
    expect(store.useItem('klopapier')).toBe(false);
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
      loyalty: 50,
      bonuses: { battle: 4, social: 1, games: 1, recovery: 0 },
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
    expect(repaired.inventory.bier).toBe(0);
    expect(repaired.version).toBe(3);
  });

  it('resolves entry decisions deterministically and unlocks the campsite quest chain', () => {
    const store = readyStore({ batida: 1, wasser: 1 });

    expect(store.openEncounter('uli-entry')).toBe(false);
    expect(store.openEncounter('gundula-entry')).toBe(true);
    expect(store.resolveEncounter('batida', 1)).toBe(true);
    expect(store.snapshot().encounter?.result?.outcome).toBe('great');
    store.closeEncounter();

    store.openEncounter('uli-entry');
    store.resolveEncounter('observe', 1);
    const state = store.snapshot();

    expect(state.flags).toMatchObject({
      gundulaConvinced: true,
      uliConvinced: true,
      gateOpen: true,
    });
    expect(state.quests.entry.status).toBe('completed');
    expect(state.quests.paper.status).toBe('active');
    expect(state.quests.reunion.status).toBe('active');
    expect(state.inventory.batida).toBe(0);
    expect(state.relationships.gundula).toBeGreaterThan(0);
  });

  it('turns a quest item into a persistent group role', () => {
    const store = readyStore({ klopapier: 1, wasser: 1 });
    store.setFlag('gundulaConvinced');
    store.setFlag('uliConvinced');

    store.openEncounter('manni-paper');
    store.resolveEncounter('help', 1);

    const state = store.snapshot();
    expect(state.quests.paper.status).toBe('completed');
    expect(state.inventory.klopapier).toBe(0);
    expect(state.team).toEqual([
      expect.objectContaining({
        id: 'manni',
        role: 'Versorger',
        bonuses: expect.objectContaining({ recovery: 5 }),
      }),
    ]);
  });

  it('prevents completed activities from being farmed repeatedly', () => {
    const store = readyStore({ wasser: 1 });
    store.recordActivity('flipCup', true, 'perfect');
    const first = store.snapshot();

    store.recordActivity('flipCup', true, 'perfect');
    const second = store.snapshot();

    expect(second.metrics).toEqual(first.metrics);
    expect(second.minutes).toBe(first.minutes);
  });

  it('tracks interiors and the new minigame results in the same persistent state', () => {
    const store = readyStore({ wasser: 1 });
    store.enterInterior('party-tent');
    expect(store.snapshot()).toMatchObject({ mode: 'interior', currentInterior: 'party-tent' });

    store.recordActivity('beerPong', true, 'perfect', 420);
    store.recordActivity('flunkyball', false, 'solid', 80);
    const state = store.snapshot();

    expect(state.activityResults).toMatchObject({
      beerPong: { attempts: 1, completed: true, best: 420 },
      flunkyball: { attempts: 1, completed: false, best: 80 },
    });
    expect(state.quests.pong.status).toBe('completed');
    store.leaveInterior();
    expect(store.snapshot()).toMatchObject({ mode: 'world', currentInterior: null });
  });

  it('completes the reunion quest only after all nine friends were found', () => {
    const store = readyStore({ wasser: 1 });
    store.setFlag('gundulaConvinced');
    store.setFlag('uliConvinced');

    for (const id of FRIEND_IDS.slice(0, -1)) store.socialize(id);
    expect(store.snapshot().quests.reunion).toMatchObject({ status: 'active', stage: 8 });

    store.socialize(FRIEND_IDS.at(-1) ?? '');
    expect(store.snapshot().quests.reunion).toMatchObject({ status: 'completed', stage: 99 });
  });

  it('migrates the former v1 save without throwing away the playable position', () => {
    const storage = memoryStorage({
      [STORAGE_KEY]: JSON.stringify({
        version: 1,
        profile,
        mode: 'world',
        money: 7,
        inventory: { wasser: 3, bier: 1 },
        worldPosition: { x: 444, y: 222 },
      }),
    });

    const state = new GameStore(storage).snapshot();
    expect(state.version).toBe(3);
    expect(state.mode).toBe('world');
    expect(state.prologue.shoppingComplete).toBe(true);
    expect(state.inventory.wasser).toBe(3);
    expect(state.worldPosition).toEqual({ x: 830, y: 1030 });
    expect(state.profile).toMatchObject({
      shorts: '#263b47',
      hairStyle: 'kurz',
      bodyType: 'normal',
      accessory: 'keins',
    });
  });

  it('migrates the v2 mechanics save and preserves gate progress', () => {
    const storage = memoryStorage({
      [STORAGE_KEY]: JSON.stringify({
        version: 2,
        profile,
        mode: 'world',
        prologue: { shoppingComplete: true, spent: 21 },
        flags: { gundulaConvinced: true, uliConvinced: true, gateOpen: true },
        worldPosition: { x: 910, y: 480 },
        relationships: { gundula: 24 },
      }),
    });
    const state = new GameStore(storage).snapshot();
    expect(state.version).toBe(3);
    expect(state.prologue.introSeen).toBe(true);
    expect(state.flags.gateOpen).toBe(true);
    expect(state.worldPosition).toEqual({ x: 910, y: 480 });
    expect(state.relationships.gundula).toBe(24);
  });
});

function readyStore(cart: Record<string, number>): GameStore {
  const store = new GameStore(memoryStorage());
  store.setProfile(profile);
  expect(store.completeShopping(cart).ok).toBe(true);
  return store;
}

function memoryStorage(initial: Record<string, string> = {}): StorageAdapter {
  const values = new Map(Object.entries(initial));
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
}

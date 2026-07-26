import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { describe, expect, it, vi } from 'vitest';

const activitiesCode = readFileSync(new URL('../docs/activities-v13.js', import.meta.url), 'utf8');

describe('published weekend ending', () => {
  it('does not end before Sunday at noon', () => {
    const { engine, state } = harness(baseState({ day: 3, minutes: 719 }));

    engine.activities.startEndgame();

    expect(state.ending).toBeNull();
    expect(engine.toast).toHaveBeenCalledWith(
      'Noch nicht abreisen',
      expect.stringContaining('Sonntag 12 Uhr'),
      'warn',
    );
  });

  it('reaches the abandoned ending when friends or cleanup are missing', () => {
    const { engine, state } = harness(baseState({
      foundFriends: ['andre', 'rene'],
      reputation: 100,
    }));

    engine.activities.startEndgame();

    expect(state.scene).toBe('ending');
    expect(state.ending?.key).toBe('abandoned');
    expect(state.flags.ending).toBe(true);
  });

  it('reaches the disaster, decent and legendary endings with the actual scoring rules', () => {
    const cases = [
      { chaos: 40, expected: 'disaster' },
      { chaos: 14, expected: 'decent' },
      { chaos: 0, expected: 'legendary' },
    ];

    for (const testCase of cases) {
      const { engine, state } = harness(baseState({
        foundFriends: allFriends,
        chaos: testCase.chaos,
        flags: { ending: false, cleanupDone: true },
        world: { tentPacked: true, hedgeWet: false },
        quests: { quiet22: 99 },
      }));

      engine.activities.startEndgame();

      expect(state.ending?.key).toBe(testCase.expected);
      expect(state.ending?.found).toBe(9);
      expect(state.ending?.clean).toBe(true);
    }
  });

  it('is idempotent after an ending was recorded', () => {
    const { engine, state } = harness(baseState({
      foundFriends: allFriends,
      flags: { ending: false, cleanupDone: true },
      world: { tentPacked: true, hedgeWet: false },
      quests: { quiet22: 99 },
    }));

    engine.activities.startEndgame();
    const ending = structuredClone(state.ending);
    engine.activities.startEndgame();

    expect(state.ending).toEqual(ending);
    expect(engine.save).toHaveBeenCalledTimes(1);
  });
});

const allFriends = ['andre', 'rene', 'lars', 'danny', 'gregor', 'felix', 'masl', 'schubert', 'schima'];

interface EndingState {
  day: number;
  minutes: number;
  foundFriends: string[];
  reputation: number;
  romance: number;
  smokeRespect: number;
  tokens: number;
  chaos: number;
  flags: { ending: boolean; cleanupDone: boolean };
  world: { tentPacked: boolean; hedgeWet: boolean };
  quests: { quiet22: number };
  stats: { accidents: number; blackouts: number };
  ending: null | {
    key: string;
    score: number;
    found: number;
    clean: boolean;
    hedge: boolean;
    quiet: boolean;
  };
  scene: string;
}

function baseState(overrides: Partial<EndingState> = {}): EndingState {
  const state: EndingState = {
    day: 3,
    minutes: 720,
    foundFriends: [],
    reputation: 0,
    romance: 0,
    smokeRespect: 0,
    tokens: 0,
    chaos: 0,
    flags: { ending: false, cleanupDone: false },
    world: { tentPacked: false, hedgeWet: false },
    quests: { quiet22: -1 },
    stats: { accidents: 0, blackouts: 0 },
    ending: null,
    scene: 'world',
  };

  return {
    ...state,
    ...overrides,
    flags: { ...state.flags, ...overrides.flags },
    world: { ...state.world, ...overrides.world },
    quests: { ...state.quests, ...overrides.quests },
    stats: { ...state.stats, ...overrides.stats },
  };
}

function harness(state: EndingState) {
  const buttons: Array<Record<string, unknown>> = [];
  const sceneActions = {
    innerHTML: '',
    classList: { remove: vi.fn() },
    append: (button: Record<string, unknown>) => buttons.push(button),
  };
  const engine = {
    activities: {},
    ctx: {},
    el: { sceneActions, canvas: { width: 1280, height: 720 } },
    R: {},
    getState: () => state,
    minuteOfDay: () => state.minutes % 1440,
    setScene: vi.fn((scene: string) => {
      state.scene = scene;
    }),
    toast: vi.fn(),
    save: vi.fn(),
    vibrate: vi.fn(),
    openDrawer: vi.fn(),
    clamp: (value: number) => Math.max(0, Math.min(100, value)),
  };
  const document = {
    createElement: () => ({
      className: '',
      innerHTML: '',
      onclick: null,
    }),
  };

  vm.runInNewContext(activitiesCode, {
    window: { TBA13: engine, TBA13_CONTENT: {} },
    document,
    performance: { now: () => 0 },
    localStorage: { removeItem: vi.fn() },
    location: { reload: vi.fn() },
    setTimeout: (callback: () => void) => {
      callback();
      return 0;
    },
    Math,
  });

  return { engine: engine as typeof engine & { activities: { startEndgame: () => void } }, state, buttons };
}

import { describe, expect, it } from 'vitest';
import { createCombatState, resolveCombatRound } from '../src/game/combat';
import type { GameSnapshot, TeamMember } from '../src/game/types';

describe('camping duel balance', () => {
  it('derives player resolve from dignity and companion battle roles', () => {
    const solo = createCombatState(snapshot());
    const supported = createCombatState(snapshot({ team: [ronny] }));

    expect(supported.playerMaxResolve).toBeGreaterThan(solo.playerMaxResolve);
  });

  it('makes guarding trade damage for reliable mitigation', () => {
    const game = snapshot();
    const initial = createCombatState(game);
    const counter = resolveCombatRound(initial, 'counter', game, fixedRandom(0.2));
    const guard = resolveCombatRound(initial, 'guard', game, fixedRandom(0.2));

    expect(guard.enemyDamage).toBeLessThan(counter.enemyDamage);
    expect(guard.playerDamage).toBeLessThan(counter.playerDamage);
  });

  it('lets recovery-oriented team support restore resolve without skipping retaliation', () => {
    const game = snapshot({ team: [manni] });
    const initial = { ...createCombatState(game), playerResolve: 40 };
    const round = resolveCombatRound(initial, 'rally', game, fixedRandom(0.1));

    expect(round.healed).toBeGreaterThan(10);
    expect(round.enemyDamage).toBeGreaterThan(0);
    expect(round.state.playerResolve).toBeGreaterThan(40 - round.enemyDamage);
  });
});

const manni: TeamMember = {
  id: 'manni',
  name: 'Manni',
  role: 'Versorger',
  level: 1,
  resolve: 66,
  maxResolve: 66,
  loyalty: 80,
  bonuses: { battle: 1, social: 2, games: 2, recovery: 6 },
};

const ronny: TeamMember = {
  id: 'ronny',
  name: 'Ronny',
  role: 'Diskutierer',
  level: 2,
  resolve: 74,
  maxResolve: 74,
  loyalty: 70,
  bonuses: { battle: 7, social: 2, games: 1, recovery: 0 },
};

function snapshot(overrides: Partial<GameSnapshot> = {}): GameSnapshot {
  const base: GameSnapshot = {
    version: 3,
    mode: 'battle',
    profile: {
      name: 'André',
      skinTone: '#efc09b',
      hair: '#49301f',
      shirt: '#e3b74f',
      shorts: '#263b47',
      hairStyle: 'kurz',
      bodyType: 'normal',
      accessory: 'keins',
      trait: 'direkt',
    },
    prologue: { introSeen: true, shoppingComplete: true, spent: 20 },
    day: 1,
    minutes: 700,
    money: 5,
    needs: {
      energy: 80,
      hunger: 20,
      thirst: 20,
      bladder: 15,
      alcohol: 18,
      highness: 0,
      hangover: 0,
      courage: 32,
    },
    metrics: { dignity: 65, chaos: 4, reputation: 5, momentum: 8 },
    inventory: {},
    team: [],
    relationships: { ronny: 0 },
    quests: {},
    activeQuest: null,
    flags: {},
    encounter: null,
    chronicle: [],
    worldPosition: { x: 0, y: 0 },
    clockLabel: '11:40',
    phaseLabel: 'Morgen',
    conditionLabel: 'Stabil',
    currentObjective: '',
    currentInterior: null,
    activityResults: {},
  };

  return {
    ...base,
    ...overrides,
    needs: { ...base.needs, ...overrides.needs },
    metrics: { ...base.metrics, ...overrides.metrics },
  };
}

function fixedRandom(value: number): () => number {
  return () => value;
}

import { describe, expect, it } from 'vitest';
import { minigameAttempts, minigameWindow, resolveChallenge } from '../src/game/mechanics';
import type { GameSnapshot, SessionState, TeamMember } from '../src/game/types';

describe('linked weekend mechanics', () => {
  it('makes trait, condition and momentum materially affect the same challenge', () => {
    const stable = state();
    const degraded = state({
      needs: {
        ...state().needs,
        energy: 12,
        hunger: 90,
        thirst: 92,
        bladder: 94,
        hangover: 70,
      },
      metrics: { ...state().metrics, momentum: -30 },
    });
    const challenge = { skill: 'charm' as const, baseChance: 55, relation: 'gundula' };

    const stableResolution = resolveChallenge(stable, challenge, 50);
    const degradedResolution = resolveChallenge(degraded, challenge, 50);

    expect(stableResolution.chance).toBeGreaterThan(degradedResolution.chance + 30);
    expect(stableResolution.outcome).toMatch(/success|great/);
    expect(degradedResolution.outcome).toMatch(/failure|disaster/);
  });

  it('uses loyalty-weighted companion roles instead of a generic team count', () => {
    const challenge = { skill: 'teamwork' as const, baseChance: 45 };
    const withoutTeam = resolveChallenge(state(), challenge, 50);
    const withManni = resolveChallenge(state({ team: [manni] }), challenge, 50);

    expect(withManni.chance).toBeGreaterThan(withoutTeam.chance);
  });

  it('adjusts timing tolerance and attempts from condition and game specialists', () => {
    const base = snapshot();
    const supported = snapshot({ team: [manni] });
    const exhausted = snapshot({
      needs: { ...base.needs, energy: 5, thirst: 95, hangover: 80 },
    });

    expect(minigameWindow(supported, 'flip')).toBeGreaterThan(minigameWindow(base, 'flip'));
    expect(minigameWindow(exhausted, 'flip')).toBeLessThan(minigameWindow(base, 'flip'));
    expect(minigameAttempts(supported)).toBeGreaterThanOrEqual(minigameAttempts(base));
  });
});

const manni: TeamMember = {
  id: 'manni',
  name: 'Manni',
  role: 'Versorger',
  level: 1,
  resolve: 66,
  maxResolve: 66,
  loyalty: 100,
  bonuses: { battle: 1, social: 6, games: 5, recovery: 5 },
};

function state(overrides: Partial<SessionState> = {}): SessionState {
  const base: SessionState = {
    version: 2,
    mode: 'world',
    profile: {
      name: 'André',
      skinTone: '#efc09b',
      hair: '#49301f',
      shirt: '#e3b74f',
      trait: 'charmant',
    },
    prologue: { shoppingComplete: true, spent: 20 },
    day: 1,
    minutes: 600,
    money: 5,
    needs: {
      energy: 90,
      hunger: 15,
      thirst: 15,
      bladder: 10,
      alcohol: 18,
      highness: 0,
      hangover: 0,
      courage: 28,
    },
    metrics: { dignity: 65, chaos: 5, reputation: 4, momentum: 15 },
    inventory: {},
    team: [],
    relationships: { gundula: 10 },
    quests: {},
    activeQuest: null,
    flags: {},
    encounter: null,
    chronicle: [],
    worldPosition: { x: 0, y: 0 },
  };

  return {
    ...base,
    ...overrides,
    needs: { ...base.needs, ...overrides.needs },
    metrics: { ...base.metrics, ...overrides.metrics },
  };
}

function snapshot(overrides: Partial<SessionState> = {}): GameSnapshot {
  return {
    ...state(overrides),
    clockLabel: '10:00',
    phaseLabel: 'Morgen',
    conditionLabel: 'Stabil',
    currentObjective: '',
  };
}

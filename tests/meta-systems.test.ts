import { describe, expect, it } from 'vitest';
import { createAdvancedCombatState, resolveAdvancedCombatRound } from '../src/game/advancedCombat';
import { activeTeamSynergies, FRIEND_TEAM_MEMBERS } from '../src/game/friendRoster';
import { flirtChance, giftReaction } from '../src/game/socialSystem';
import { activeStatuses, statusModifiers } from '../src/game/statusSystem';
import type { GameSnapshot, Needs } from '../src/game/types';

const baseNeeds: Needs = {
  energy: 80, hunger: 10, thirst: 10, bladder: 10, alcohol: 0, highness: 0, hangover: 0, courage: 20,
};

function snapshot(needs: Partial<Needs> = {}, relationship = 20): GameSnapshot {
  return {
    version: 3,
    mode: 'world',
    profile: {
      name: 'Test', skinTone: '#ffffff', hair: '#111111', shirt: '#222222', shorts: '#333333',
      hairStyle: 'kurz', bodyType: 'normal', accessory: 'keins', trait: 'charmant',
    },
    prologue: { introSeen: true, shoppingComplete: true, spent: 0 },
    day: 1,
    minutes: 18 * 60,
    money: 0,
    needs: { ...baseNeeds, ...needs },
    metrics: { dignity: 60, chaos: 10, reputation: 20, momentum: 5 },
    inventory: {},
    team: [],
    relationships: { susi: relationship, jule: relationship, kira: relationship, ronny: 0 },
    quests: {},
    activeQuest: null,
    flags: {},
    encounter: null,
    chronicle: [],
    worldPosition: { x: 0, y: 0 },
    currentInterior: null,
    activityResults: {},
    clockLabel: '18:00',
    phaseLabel: 'Abend',
    conditionLabel: 'Stabil',
    currentObjective: '',
  };
}

describe('systemic body conditions', () => {
  it('makes drunken combat stronger but less accurate', () => {
    const sober = statusModifiers(baseNeeds);
    const drunk = statusModifiers({ ...baseNeeds, alcohol: 55 });
    expect(drunk.power).toBeGreaterThan(sober.power);
    expect(drunk.accuracy).toBeLessThan(sober.accuracy);
    expect(drunk.sway).toBeGreaterThan(0);
  });

  it('adds reaction delay for highness and energy drain for hangover', () => {
    const affected = statusModifiers({ ...baseNeeds, highness: 75, hangover: 60 });
    expect(affected.reactionDelayMs).toBeGreaterThanOrEqual(400);
    expect(affected.energyDrain).toBeGreaterThan(1.5);
    expect(activeStatuses({ ...baseNeeds, highness: 75, hangover: 60 }).map((status) => status.id))
      .toEqual(expect.arrayContaining(['sehr-breit', 'kater']));
  });
});

describe('demanding romance system', () => {
  it('never raises the displayed flirt chance above twenty percent', () => {
    expect(flirtChance('susi', snapshot({ alcohol: 18 }, 100))).toBeLessThanOrEqual(20);
  });

  it('punishes incompatible states and evaluates gifts individually', () => {
    const soberChance = flirtChance('jule', snapshot({}, 20));
    const drunkChance = flirtChance('jule', snapshot({ alcohol: 75 }, 20));
    expect(drunkChance).toBeLessThan(soberChance);
    expect(giftReaction('jule', 'wasser').delta).toBeGreaterThan(0);
    expect(giftReaction('jule', 'batida').delta).toBeLessThan(0);
  });
});

describe('three-person friend meta game', () => {
  it('defines every friend as a future team option', () => {
    expect(Object.keys(FRIEND_TEAM_MEMBERS)).toHaveLength(9);
  });

  it('recognizes twin and technology synergies', () => {
    const labels = activeTeamSynergies(['lars', 'danny', 'gregor']).map((synergy) => synergy.id);
    expect(labels).toContain('twins');
    expect(labels).toContain('tech');
  });
});

describe('status aware combat', () => {
  it('applies drunken power to successful hits while preserving finite state', () => {
    const state = createAdvancedCombatState(snapshot({ alcohol: 55 }));
    const result = resolveAdvancedCombatRound(state, 'counter', snapshot({ alcohol: 55 }), () => 0);
    expect(result.hit).toBe(true);
    expect(result.playerDamage).toBeGreaterThan(18);
    expect(Number.isFinite(result.state.enemyResolve)).toBe(true);
  });
});

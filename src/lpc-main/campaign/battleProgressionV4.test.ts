import { describe, expect, it } from 'vitest';
import {
  attackAnimationKey,
  battleDeltaSummary,
  leaguePhase,
  leagueRank,
  leagueVictoryIds,
  opponentUnlockState,
} from './battleProgressionV4';

function meta(overrides: Record<string, unknown> = {}): any {
  return {
    authorityBattleWon: true,
    learnedAttacks: ['classic-high-five'],
    attackMastery: { 'classic-high-five': { uses: 0, successes: 0, level: 1 } },
    miniResults: {},
    relationshipBonus: {},
    weekendScore: 25,
    ...overrides,
  };
}

describe('Frustkampf progression V4', () => {
  it('starts with Gregor and unlocks the ladder through actual victories', () => {
    const start = meta();
    expect(opponentUnlockState(start, 'gregor').unlocked).toBe(true);
    expect(opponentUnlockState(start, 'schubert').unlocked).toBe(false);
    expect(opponentUnlockState(start, 'masl').unlocked).toBe(false);
    expect(opponentUnlockState(start, 'ronny').unlocked).toBe(false);

    const progressed = meta({
      learnedAttacks: ['classic-high-five', 'beer-offer', 'dry-counter'],
      miniResults: {
        'battle-gregor': { attempts: 1, wins: 1, best: 118 },
        'battle-schubert': { attempts: 1, wins: 1, best: 126 },
        flipCup: { attempts: 1, wins: 1, best: 105 },
      },
    });
    expect(opponentUnlockState(progressed, 'schubert').unlocked).toBe(true);
    expect(opponentUnlockState(progressed, 'masl').unlocked).toBe(true);
    expect(opponentUnlockState(progressed, 'ronny').unlocked).toBe(true);
    expect(leagueVictoryIds(progressed)).toEqual(['gregor', 'schubert']);
    expect(leagueRank(progressed).label).toBe('Zeltkreis-Konterer');
  });

  it('reports persistent value, relationship, record and mastery changes', () => {
    const before = meta();
    const after = meta({
      weekendScore: 43,
      relationshipBonus: { gregor: 6 },
      miniResults: { 'battle-gregor': { attempts: 1, wins: 1, best: 121 } },
      learnedAttacks: ['classic-high-five', 'beer-offer'],
      attackMastery: {
        'classic-high-five': { uses: 4, successes: 3, level: 2 },
        'beer-offer': { uses: 0, successes: 0, level: 1 },
      },
    });
    const delta = battleDeltaSummary(before, after, 'gregor');
    expect(delta.weekendScore).toBe(18);
    expect(delta.relationship).toBe(6);
    expect(delta.attempts).toBe(1);
    expect(delta.wins).toBe(1);
    expect(delta.mastery[0]).toMatchObject({ id: 'classic-high-five', uses: 4, successes: 3, levelBefore: 1, levelAfter: 2 });
    expect(delta.rankAfter.label).toBe('Frust-Novize');
    expect(delta.unlocked).toContain('schubert');
  });

  it('gives each opponent distinct phases and every attack a readable animation family', () => {
    expect(leaguePhase('gregor', .1)).toBe('Anheizen');
    expect(leaguePhase('schubert', .5)).toBe('Botanischer Exkurs');
    expect(leaguePhase('masl', .9)).toBe('Regelbruch-Finale');
    expect(leaguePhase('ronny', .9)).toBe('Widerspruchskollaps');
    expect(new Set([
      attackAnimationKey('classic-high-five'),
      attackAnimationKey('logical-argument'),
      attackAnimationKey('camping-chair-block'),
      attackAnimationKey('cup-eye-contact'),
      attackAnimationKey('total-exaggeration'),
    ]).size).toBe(5);
  });
});

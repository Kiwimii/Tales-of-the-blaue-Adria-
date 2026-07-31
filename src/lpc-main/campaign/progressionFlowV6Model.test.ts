import { describe, expect, it } from 'vitest';
import type { GameSnapshot } from '../../game/types';
import type { CampaignMetaState } from './metaStore';
import {
  allCoreMinigamesUnlocked,
  conversationGiftChance,
  minigameUnlockState,
  nextProgressionObjective,
  pickWeightedReward,
} from './progressionFlowV6Model';

function meta(overrides: Partial<CampaignMetaState> = {}): CampaignMetaState {
  return {
    version: 3,
    introSeen: true,
    introReplays: 0,
    questStage: 'free-weekend',
    reservationSolved: true,
    authorityBattleWon: true,
    finalBattleWon: false,
    powerConnected: true,
    unloading: { drinks: true, tents: true, cable: true },
    firstBeerOpened: true,
    relationshipBonus: {},
    romance: {
      susi: { interest: 0, attempts: 0, successes: 0, boundaryStrikes: 0, lastLine: '' },
      jule: { interest: 0, attempts: 0, successes: 0, boundaryStrikes: 0, lastLine: '' },
      kira: { interest: 0, attempts: 0, successes: 0, boundaryStrikes: 0, lastLine: '' },
    },
    conversationCounts: {},
    learnedAttacks: ['classic-high-five'],
    equippedAttacks: ['classic-high-five'],
    attackMastery: { 'classic-high-five': { uses: 0, successes: 0, level: 1 } },
    unlockedAnecdotes: [],
    equippedAnecdotes: [],
    activeTeam: ['andre'],
    miniResults: {},
    flags: {},
    suspicion: 0,
    reliefCount: 0,
    weekendArc: {
      olympiad: {
        started: false, completed: false, current: '', points: 0, afterparty: '',
        disciplines: {
          flipCup: { attempted: false, success: false, score: 0, quality: 'failed', points: 0 },
          beerPong: { attempted: false, success: false, score: 0, quality: 'failed', points: 0 },
          flunkyball: { attempted: false, success: false, score: 0, quality: 'failed', points: 0 },
        },
      },
      nightNoise: 0,
      saturday: {
        triggered: false, step: '', dannyTestimony: false, felixTimeline: false, farewellSongPlayed: false,
        maslAwake: false, maslConvinced: false, debatePressure: 0, debateCrowd: 0, brawlWon: false, earlyEnding: false,
      },
      secretMillionaire: { unlocked: false, started: false, round: 0, score: 0, eliminated: [], history: [], completed: false, winner: '' },
    },
    weekendScore: 0,
    weekendRank: 'newcomer',
    lastEvent: '',
    ...overrides,
  } as CampaignMetaState;
}

const fallback = { title: 'Fallback', text: 'Fallback objective', targetId: 'campfire', source: 'story' as const };
const base = { flags: {}, worldPosition: { x: 0, y: 0 } } as GameSnapshot;

describe('progression flow v6', () => {
  it('unlocks the three core minigames strictly in sequence', () => {
    const start = meta();
    expect(minigameUnlockState(start, 'flipCup').unlocked).toBe(true);
    expect(minigameUnlockState(start, 'beerPong').unlocked).toBe(false);
    expect(minigameUnlockState(start, 'flunkyball').unlocked).toBe(false);
    expect(nextProgressionObjective(start, base, fallback).targetId).toBe('flipCup');

    const afterFlip = meta({ miniResults: { flipCup: { attempts: 1, wins: 0, best: 20, last: 20, bestQuality: 'failed' } } });
    expect(minigameUnlockState(afterFlip, 'beerPong').unlocked).toBe(true);
    expect(minigameUnlockState(afterFlip, 'flunkyball').unlocked).toBe(false);
    expect(nextProgressionObjective(afterFlip, base, fallback).targetId).toBe('beerPong');

    const afterPong = meta({ miniResults: {
      flipCup: { attempts: 1, wins: 0, best: 20, last: 20, bestQuality: 'failed' },
      beerPong: { attempts: 1, wins: 0, best: 25, last: 25, bestQuality: 'failed' },
    } });
    expect(minigameUnlockState(afterPong, 'flunkyball').unlocked).toBe(true);
    expect(nextProgressionObjective(afterPong, base, fallback).targetId).toBe('flunkyball');
  });

  it('keeps every core game active after all have been introduced', () => {
    const complete = meta({ miniResults: {
      flipCup: { attempts: 1, wins: 0, best: 20, last: 20, bestQuality: 'failed' },
      beerPong: { attempts: 1, wins: 1, best: 80, last: 80, bestQuality: 'solid' },
      flunkyball: { attempts: 1, wins: 0, best: 30, last: 30, bestQuality: 'failed' },
    } });
    expect(allCoreMinigamesUnlocked(complete)).toBe(true);
    expect(minigameUnlockState(complete, 'flipCup').unlocked).toBe(true);
    expect(minigameUnlockState(complete, 'beerPong').unlocked).toBe(true);
    expect(minigameUnlockState(complete, 'flunkyball').unlocked).toBe(true);
    expect(minigameUnlockState(complete, 'ronnyBattle').unlocked).toBe(true);
    expect(nextProgressionObjective(complete, base, fallback).targetId).toBe('ronny');
  });

  it('marks only the next missing friend during the reunion', () => {
    const reunion = meta({ questStage: 'reunion', activeTeam: [] });
    const first = nextProgressionObjective(reunion, { ...base, flags: { 'met-andre': true } }, fallback);
    expect(first.targetId).not.toBe('andre');
    expect(first.source).toBe('reunion');
  });

  it('uses deterministic weighted selection while preserving random outcomes', () => {
    const pool = [{ id: 'wasser', weight: 7 }, { id: 'batida', weight: 1 }];
    expect(pickWeightedReward(pool, 0.1)?.id).toBe('wasser');
    expect(pickWeightedReward(pool, 0.99)?.id).toBe('batida');
  });

  it('raises conversation gift chance but caps repeated farming probability', () => {
    expect(conversationGiftChance(1)).toBeCloseTo(.16);
    expect(conversationGiftChance(3)).toBeCloseTo(.25);
    expect(conversationGiftChance(20)).toBeCloseTo(.34);
  });
});

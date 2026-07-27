import { describe, expect, it } from 'vitest';
import {
  COMBAT_MOVES,
  equippedAttackFlag,
  equippedAttackIds,
  learnedAttackFlag,
  learnedAttackIds,
  attackLearnedFromConversation,
} from '../src/game/combatMoves';
import {
  createFrustrationCombatState,
  moveEffectiveness,
  resolveFrustrationRound,
} from '../src/game/frustrationCombat';
import type { GameSnapshot, Needs } from '../src/game/types';

const needs: Needs = {
  energy: 80,
  hunger: 10,
  thirst: 10,
  bladder: 10,
  alcohol: 0,
  highness: 0,
  hangover: 0,
  courage: 20,
};

function snapshot(flags: Record<string, boolean> = {}, relationships: Record<string, number> = {}): GameSnapshot {
  return {
    version: 3,
    mode: 'world',
    profile: {
      name: 'Test', skinTone: '#ffffff', hair: '#111111', shirt: '#222222', shorts: '#333333',
      hairStyle: 'kurz', bodyType: 'normal', accessory: 'keins', trait: 'charmant',
    },
    prologue: { introSeen: true, shoppingComplete: true, spent: 0 },
    day: 1,
    minutes: 12 * 60,
    money: 0,
    needs,
    metrics: { dignity: 60, chaos: 10, reputation: 20, momentum: 5 },
    inventory: {},
    team: [],
    relationships: { gundula: 10, ronny: 10, andre: 10, rene: 10, lars: 10, ...relationships },
    quests: {},
    activeQuest: null,
    flags,
    encounter: null,
    chronicle: [],
    worldPosition: { x: 0, y: 0 },
    currentInterior: null,
    activityResults: {},
    clockLabel: '12:00',
    phaseLabel: 'Tag',
    conditionLabel: 'Stabil',
    currentObjective: '',
  };
}

describe('frustration effectiveness', () => {
  it('makes agreement and high five better than logic and Aldi fashion against Gundula and Uli', () => {
    const agree = moveEffectiveness('agree-anyway', 'entry-authority');
    const highFive = moveEffectiveness('classic-high-five', 'entry-authority');
    const logic = moveEffectiveness('logical-argument', 'entry-authority');
    const aldi = moveEffectiveness('aldi-shirt-show', 'entry-authority');

    expect(agree).toBeGreaterThan(logic);
    expect(highFive).toBeGreaterThan(aldi);
    expect(agree).toBeGreaterThanOrEqual(1.5);
    expect(logic).toBeLessThanOrEqual(0.6);
  });

  it('wins by filling the opponent frustration bar instead of removing health', () => {
    const state = createFrustrationCombatState(snapshot(), 'entry-authority');
    state.enemyFrustration = state.enemyMaxFrustration - 1;
    const result = resolveFrustrationRound(state, 'classic-high-five', snapshot(), () => 0);

    expect(result.hit).toBe(true);
    expect(result.state.enemyFrustration).toBe(result.state.enemyMaxFrustration);
    expect(result.finished).toBe('victory');
    expect(result.log).toContain('vollständig frustriert');
  });

  it('applies statuses and reduces counter frustration for a strong social interruption', () => {
    const state = createFrustrationCombatState(snapshot(), 'entry-authority');
    const highFive = resolveFrustrationRound(state, 'classic-high-five', snapshot(), () => 0);
    const aldi = resolveFrustrationRound(state, 'aldi-shirt-show', snapshot(), () => 0);

    expect(highFive.state.enemyStatuses.map((status) => status.id)).toContain('ueberrumpelt');
    expect(aldi.state.enemyStatuses.map((status) => status.id)).toContain('fremdschaemen');
    expect(highFive.receivedFrustration).toBeLessThan(aldi.receivedFrustration);
  });
});

describe('attack progression and loadout', () => {
  it('starts with only the classic high five', () => {
    expect(learnedAttackIds(snapshot())).toEqual(['classic-high-five']);
    expect(COMBAT_MOVES['classic-high-five'].unlockTitle).toBe('Startattacke');
  });

  it('reads learned and equipped attacks from compatible save flags', () => {
    const flags = {
      [learnedAttackFlag('aldi-shirt-show')]: true,
      [learnedAttackFlag('dry-counter')]: true,
      [equippedAttackFlag('classic-high-five')]: true,
      [equippedAttackFlag('aldi-shirt-show')]: true,
      [equippedAttackFlag('dry-counter')]: true,
    };
    const state = snapshot(flags);
    expect(learnedAttackIds(state)).toEqual(['classic-high-five', 'aldi-shirt-show', 'dry-counter']);
    expect(equippedAttackIds(state)).toEqual(['classic-high-five', 'aldi-shirt-show', 'dry-counter']);
  });

  it('maps friend conversations to their intended attacks', () => {
    const state = snapshot({ entryDebateWon: true, firstBeerOpened: true });
    expect(attackLearnedFromConversation('gundula', 'personal', state)).toBe('agree-anyway');
    expect(attackLearnedFromConversation('ronny', 'personal', state)).toBe('logical-argument');
    expect(attackLearnedFromConversation('andre', 'personal', state)).toBe('dry-counter');
    expect(attackLearnedFromConversation('rene', 'plan', state)).toBe('camping-chair-block');
    expect(attackLearnedFromConversation('lars', 'weekend', state)).toBe('beer-offer');
  });

  it('defines ten attacks and gives each a flirt option and learning source', () => {
    const moves = Object.values(COMBAT_MOVES);
    expect(moves).toHaveLength(10);
    for (const move of moves) {
      expect(move.flirtOption.length).toBeGreaterThan(10);
      expect(move.unlockDetail.length).toBeGreaterThan(10);
    }
  });
});

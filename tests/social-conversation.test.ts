import { describe, expect, it } from 'vitest';
import {
  CONVERSATION_TOPICS,
  ROMANCE_PROFILES,
  conversationTopicOutcome,
  flirtChance,
} from '../src/game/socialSystem';
import type { GameSnapshot } from '../src/game/types';

function state(overrides: Partial<GameSnapshot> = {}): GameSnapshot {
  return {
    version: 3,
    mode: 'world',
    profile: {
      name: 'André', skinTone: '#efc09b', hair: '#49301f', shirt: '#e3b74f', shorts: '#263b47',
      hairStyle: 'kurz', bodyType: 'normal', accessory: 'keins', trait: 'hilfsbereit',
    },
    prologue: { introSeen: true, shoppingComplete: true, spent: 0 },
    day: 1,
    minutes: 900,
    money: 0,
    needs: { energy: 80, hunger: 20, thirst: 20, bladder: 15, alcohol: 0, highness: 0, hangover: 0, courage: 30 },
    metrics: { dignity: 60, chaos: 10, reputation: 10, momentum: 0 },
    inventory: {},
    team: [],
    relationships: {},
    quests: { entry: { status: 'completed', stage: 99 } },
    activeQuest: null,
    flags: {},
    encounter: null,
    chronicle: [],
    worldPosition: { x: 800, y: 1000 },
    currentInterior: null,
    activityResults: {},
    clockLabel: '15:00',
    phaseLabel: 'Nachmittag',
    conditionLabel: 'Stabil',
    currentObjective: '',
    ...overrides,
  };
}

describe('full social conversations', () => {
  it('offers several distinct conversation topics instead of one generic action', () => {
    expect(CONVERSATION_TOPICS.map((topic) => topic.id)).toEqual(['weekend', 'personal', 'plan']);
    expect(new Set(CONVERSATION_TOPICS.map((topic) => topic.label)).size).toBe(3);
  });

  it('rewards personal conversation more after a relationship has been built', () => {
    const early = conversationTopicOutcome('susi', 'personal', state());
    const trusted = conversationTopicOutcome('susi', 'personal', state({ relationships: { susi: 30 } }));
    expect(trusted.relationship).toBeGreaterThan(early.relationship);
    expect(trusted.text).not.toBe(early.text);
  });

  it('keeps all three romance characters and bounded state-dependent flirt chances', () => {
    expect(Object.keys(ROMANCE_PROFILES).sort()).toEqual(['jule', 'kira', 'susi']);
    for (const id of Object.keys(ROMANCE_PROFILES)) {
      const chance = flirtChance(id, state({ relationships: { [id]: 25 } }));
      expect(chance).toBeGreaterThanOrEqual(2);
      expect(chance).toBeLessThanOrEqual(20);
    }
  });

  it('makes practical planning fit a helpful player', () => {
    const helpful = conversationTopicOutcome('gregor', 'plan', state());
    const neutral = conversationTopicOutcome('gregor', 'plan', state({ profile: { ...state().profile!, trait: 'charmant' } }));
    expect(helpful.relationship).toBeGreaterThan(neutral.relationship);
  });
});

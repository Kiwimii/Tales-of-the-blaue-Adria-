import { describe, expect, it } from 'vitest';
import {
  cycleInteractionId,
  interactionIdentity,
  rankInteractionCandidates,
} from '../src/game/interactionSelection';

describe('interaction selection', () => {
  it('groups story and normal interactions for the same person', () => {
    expect(interactionIdentity('npc-gundula-story')).toBe('npc:gundula');
    expect(interactionIdentity('npc-gundula')).toBe('npc:gundula');

    const ranked = rankInteractionCandidates([
      { id: 'npc-gundula', prompt: 'Mit Gundula sprechen', distance: 34 },
      { id: 'npc-gundula-story', prompt: 'Bei Gundula anmelden', distance: 42 },
      { id: 'arrival-board', prompt: 'Reservierungsbrett prüfen', distance: 47 },
    ]);

    expect(ranked.map((candidate) => candidate.id)).toEqual([
      'npc-gundula-story',
      'arrival-board',
    ]);
  });

  it('keeps every distinct nearby activity selectable', () => {
    const ranked = rankInteractionCandidates([
      { id: 'npc-masl', prompt: 'Mit Masl sprechen', distance: 28 },
      { id: 'masl-hole', prompt: 'Masls Spezialtechnik ausprobieren', distance: 34 },
      { id: 'beer-pong', prompt: 'Beer Pong spielen', distance: 39 },
      { id: 'flip-cup', prompt: 'Flip Cup spielen', distance: 41 },
    ]);

    expect(ranked).toHaveLength(4);
    expect(ranked.map((candidate) => candidate.id)).toEqual(expect.arrayContaining([
      'npc-masl',
      'masl-hole',
      'beer-pong',
      'flip-cup',
    ]));
  });

  it('cycles forward and backward without losing an option', () => {
    const ids = ['npc-lars', 'tent-hedge-relief', 'home-door-story'];
    expect(cycleInteractionId(ids, undefined, 1)).toBe('npc-lars');
    expect(cycleInteractionId(ids, 'npc-lars', 1)).toBe('tent-hedge-relief');
    expect(cycleInteractionId(ids, 'home-door-story', 1)).toBe('npc-lars');
    expect(cycleInteractionId(ids, 'npc-lars', -1)).toBe('home-door-story');
  });
});

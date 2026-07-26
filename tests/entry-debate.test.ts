import { describe, expect, it } from 'vitest';
import { createEntryDebateState, entryDebateHint, resolveEntryDebateRound } from '../src/game/entryDebate';

describe('entry debate tutorial', () => {
  it('teaches all three actions and rewards variety', () => {
    let state = createEntryDebateState();
    expect(entryDebateHint(state)).toContain('Konter');

    const counter = resolveEntryDebateRound(state, 'counter', false);
    state = counter.state;
    expect(counter.playerDamage).toBe(35);
    expect(entryDebateHint(state)).toContain('Blocken');

    const guard = resolveEntryDebateRound(state, 'guard', false);
    state = guard.state;
    expect(guard.authorityDamage).toBe(6);
    expect(entryDebateHint(state)).toContain('Team-Zuruf');

    const rally = resolveEntryDebateRound(state, 'rally', true);
    expect(rally.finished).toBe('victory');
    expect(rally.healed).toBe(16);
  });

  it('makes repeated arguments weaker without creating a hard lock', () => {
    const initial = createEntryDebateState();
    const first = resolveEntryDebateRound(initial, 'counter', false);
    const repeated = resolveEntryDebateRound(first.state, 'counter', false);
    expect(repeated.playerDamage).toBeLessThan(first.playerDamage);
    expect(repeated.finished).toBeNull();
  });

  it('lets Batida strengthen the social rally without being mandatory', () => {
    const noBatida = resolveEntryDebateRound(createEntryDebateState(), 'rally', false);
    const withBatida = resolveEntryDebateRound(createEntryDebateState(), 'rally', true);
    expect(withBatida.playerDamage).toBeGreaterThan(noBatida.playerDamage);
    expect(withBatida.healed).toBeGreaterThan(noBatida.healed);
  });
});

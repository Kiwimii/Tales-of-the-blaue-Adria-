import { describe, expect, it } from 'vitest';
import {
  challengeLabel,
  challengeTone,
  compactObjective,
  interactionActionLabel,
} from '../src/game/uxPresentation';

describe('UX presentation rules', () => {
  it('groups challenge chances into understandable risk levels', () => {
    expect(challengeTone(85)).toBe('safe');
    expect(challengeTone(58)).toBe('uncertain');
    expect(challengeTone(20)).toBe('risky');
    expect(challengeLabel(85)).toBe('Gute Chance');
    expect(challengeLabel(58)).toBe('Offener Ausgang');
    expect(challengeLabel(20)).toBe('Hohes Risiko');
  });

  it('turns interaction prompts into compact action labels', () => {
    expect(interactionActionLabel()).toBe('Interagieren');
    expect(interactionActionLabel('  Mit Gundula   sprechen ')).toBe('Mit Gundula sprechen');
    expect(interactionActionLabel('Einen ausgesprochen langen und unnötig komplizierten Gegenstand untersuchen').length)
      .toBeLessThanOrEqual(34);
  });

  it('keeps objectives readable in the compact HUD', () => {
    expect(compactObjective('Schranke öffnen')).toBe('Schranke öffnen');
    expect(compactObjective('x'.repeat(120))).toHaveLength(92);
    expect(compactObjective('x'.repeat(120))).toMatch(/…$/);
  });
});

import { describe, expect, it } from 'vitest';
import type { MiniGameContext } from './minigamesV2';
import { activeAssist, difficultyLabel } from './minigamesV2';

const context = (flags: Record<string, boolean> = {}): MiniGameContext => ({
  attempts: 0,
  wins: 0,
  best: 0,
  bestQuality: 'failed',
  activeTeam: ['lars', 'danny'],
  flags,
  needs: { energy: 85, hunger: 10, thirst: 12, bladder: 8, alcohol: 0, highness: 0, hangover: 0, courage: 30 },
});

describe('enhanced LPC minigame experience', () => {
  it('communicates adaptive difficulty in player-facing language', () => {
    expect(difficultyLabel(.84)).toBe('Einstiegshilfe');
    expect(difficultyLabel(1)).toBe('Normal');
    expect(difficultyLabel(1.08)).toBe('Fortgeschritten');
    expect(difficultyLabel(1.17)).toBe('Legendenmodus');
  });

  it('maps Lars to the Flip Cup edge assist', () => {
    expect(activeAssist('flipCup', context({ 'assist-flip-edge': true }))).toMatch(/Lars|Überstand/);
  });

  it('maps Susi and Felix to Beer Pong rather than unrelated games', () => {
    expect(activeAssist('beerPong', context({ 'partner-susi-pong': true }))).toMatch(/Susi|Formation/);
    expect(activeAssist('flipCup', context({ 'partner-susi-pong': true }))).toBe('');
    expect(activeAssist('beerPong', context({ 'assist-pong-redemption': true }))).toMatch(/Felix|Redemption/);
  });

  it('maps Danny and Jule to different Flunkyball advantages', () => {
    expect(activeAssist('flunkyball', context({ 'assist-flunky-sprint': true }))).toMatch(/Danny|Verteidigung/);
    expect(activeAssist('flunkyball', context({ 'partner-jule-flunky': true }))).toMatch(/Jule|Stoppruf/);
  });

  it('keeps authority and Masl assists tied to their actions', () => {
    expect(activeAssist('hedgePee', context({ 'authority-goodwill': true }))).toMatch(/Gundula|Verdacht/);
    expect(activeAssist('maslHole', context({ 'assist-masl-seal': true }))).toMatch(/Masl|Abdichtung/);
  });
});

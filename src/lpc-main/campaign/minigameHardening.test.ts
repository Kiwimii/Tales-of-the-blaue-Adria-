import { describe, expect, it } from 'vitest';
import {
  buildUniqueFlipLineup,
  canChangeBeerPongMode,
} from './minigameHardening';
import { visualEffectForFeedback } from './minigameVisuals';

describe('minigame hardening', () => {
  it('builds a four-person Flip Cup lineup without duplicate active teammates', () => {
    expect(buildUniqueFlipLineup(['lars'])).toEqual(['andre', 'lars', 'rene', 'danny']);
    expect(new Set(buildUniqueFlipLineup(['rene', 'lars', 'danny'])).size).toBe(4);
  });

  it('keeps André once even when a stored team contains him again', () => {
    const lineup = buildUniqueFlipLineup(['andre', 'rene', 'andre', 'masl']);
    expect(lineup).toEqual(['andre', 'rene', 'masl', 'lars']);
  });

  it('locks the Beer Pong mode for the complete ball flight', () => {
    expect(canChangeBeerPongMode('ready')).toBe(true);
    expect(canChangeBeerPongMode('flight')).toBe(false);
    expect(canChangeBeerPongMode('result')).toBe(false);
  });

  it('maps important feedback to distinct visual effects', () => {
    expect(visualEffectForFeedback('flipCup', 'PERFEKTER FLIP')).toMatchObject({ kind: 'star', tone: 'good' });
    expect(visualEffectForFeedback('beerPong', 'BOUNCE-TREFFER')).toMatchObject({ kind: 'spark', tone: 'good' });
    expect(visualEffectForFeedback('flunkyball', 'STOPP!')).toMatchObject({ kind: 'circle', tone: 'warning' });
    expect(visualEffectForFeedback('maslHole', 'HUSTEN / LECK')).toMatchObject({ kind: 'smoke', tone: 'bad' });
  });
});

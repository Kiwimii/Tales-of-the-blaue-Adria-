import { describe, expect, it } from 'vitest';
import {
  advancePatrol,
  hedgeCompletionSeconds,
  hedgeSight,
  maslPullResult,
  maslSealScore,
} from './fastMinigamesRebuild';

describe('fast hedge patrol game', () => {
  it('keeps patrols inside the lane and reverses at the edge', () => {
    const rightEdge = advancePatrol(.965, 1, .00015, 100);
    expect(rightEdge.position).toBeLessThanOrEqual(.97);
    expect(rightEdge.direction).toBe(-1);

    const leftEdge = advancePatrol(.035, -1, .00015, 100);
    expect(leftEdge.position).toBeGreaterThanOrEqual(.03);
    expect(leftEdge.direction).toBe(1);
  });

  it('uses directional sight cones instead of omnidirectional spotlights', () => {
    expect(hedgeSight(.3, 1, .45, .25)).toBe(true);
    expect(hedgeSight(.3, 1, .15, .25)).toBe(false);
    expect(hedgeSight(.7, -1, .55, .25)).toBe(true);
    expect(hedgeSight(.7, -1, .9, .25)).toBe(false);
  });

  it('finishes every cover option quickly', () => {
    expect(hedgeCompletionSeconds(0)).toBeLessThan(9);
    expect(hedgeCompletionSeconds(1)).toBeLessThan(10);
    expect(hedgeCompletionSeconds(2)).toBeLessThan(9);
    expect(hedgeCompletionSeconds(1, 1.1)).toBeLessThan(11);
  });
});

describe('fast Komm ans Loch game', () => {
  it('recognizes a centered and level seal', () => {
    const score = maslSealScore({ x: .3875, y: .56 }, { x: .6125, y: .56 });
    expect(score).toBeGreaterThan(.98);
  });

  it('penalizes wide, uneven hand placement', () => {
    const score = maslSealScore({ x: .25, y: .48 }, { x: .75, y: .68 });
    expect(score).toBeLessThan(.2);
  });

  it('rewards releasing in the effect zone with stable rhythm', () => {
    const result = maslPullResult(72, .9, .82, 12);
    expect(result.good).toBe(true);
    expect(result.score).toBeGreaterThan(80);
  });

  it('rejects an overlong pull even with a good seal', () => {
    const result = maslPullResult(96, .92, .8, 35);
    expect(result.good).toBe(false);
  });
});

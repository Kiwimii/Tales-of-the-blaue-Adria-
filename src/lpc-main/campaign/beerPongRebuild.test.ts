import { describe, expect, it } from 'vitest';
import {
  createBeerPongCups,
  createBeerPongShotPlan,
  findBeerPongHit,
  projectBeerPongPoint,
  sampleBeerPongShot,
} from './beerPongRebuild';

describe('Beer Pong perspective rebuild', () => {
  it('creates the complete ten-cup opponent rack', () => {
    const cups = createBeerPongCups();
    expect(cups).toHaveLength(10);
    expect(new Set(cups.map((cup) => cup.id)).size).toBe(10);
    expect(cups.every((cup) => cup.active)).toBe(true);
  });

  it('requires a real backwards pull and maps horizontal pull to the opposite throw direction', () => {
    expect(createBeerPongShotPlan({ x: .5, y: .89 }, 'direct')).toBeUndefined();
    const right = createBeerPongShotPlan({ x: .35, y: 1 }, 'direct');
    const left = createBeerPongShotPlan({ x: .65, y: 1 }, 'direct');
    expect(right?.targetX).toBeGreaterThan(.5);
    expect(left?.targetX).toBeLessThan(.5);
    expect(right?.range).toBeGreaterThan(.82);
  });

  it('uses a continuous direct arc from the player to the opponent end', () => {
    const plan = createBeerPongShotPlan({ x: .5, y: 1 }, 'direct')!;
    const start = sampleBeerPongShot(plan, 0);
    const middle = sampleBeerPongShot(plan, .5);
    const end = sampleBeerPongShot(plan, 1);
    expect(start.depth).toBe(0);
    expect(middle.height).toBeGreaterThan(.15);
    expect(end.depth).toBeGreaterThan(.85);
    expect(end.height).toBeCloseTo(0, 5);
  });

  it('creates a real table bounce before the second arc', () => {
    const plan = createBeerPongShotPlan({ x: .5, y: 1 }, 'bounce')!;
    const before = sampleBeerPongShot(plan, .45);
    const bounce = sampleBeerPongShot(plan, .5);
    const after = sampleBeerPongShot(plan, .7);
    expect(before.height).toBeGreaterThan(0);
    expect(bounce.height).toBeCloseTo(0, 5);
    expect(after.bounced).toBe(true);
    expect(after.height).toBeGreaterThan(0);
  });

  it('hits a matching cup only in the descending cup-entry window', () => {
    const cups = createBeerPongCups();
    const cup = cups[0];
    expect(findBeerPongHit(cups, { x: cup.x, depth: cup.depth, height: .08, progress: .9, bounced: false })?.id).toBe(cup.id);
    expect(findBeerPongHit(cups, { x: cup.x, depth: cup.depth, height: .2, progress: .5, bounced: false })).toBeUndefined();
  });

  it('narrows the table and ball with distance', () => {
    const near = projectBeerPongPoint({ x: .65, depth: .1, height: 0 }, 900, 430);
    const far = projectBeerPongPoint({ x: .65, depth: .95, height: 0 }, 900, 430);
    expect(far.y).toBeLessThan(near.y);
    expect(far.scale).toBeLessThan(near.scale);
    expect(Math.abs(far.x - 450)).toBeLessThan(Math.abs(near.x - 450));
  });
});

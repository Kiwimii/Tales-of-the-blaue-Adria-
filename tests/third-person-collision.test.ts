import { describe, expect, it } from 'vitest';
import { circleIntersectsAabb, colliderFromCenter, moveCircle } from '../src/third-person/collision';

describe('third-person collision', () => {
  const bounds = { minX: -10, maxX: 10, minZ: -10, maxZ: 10 };
  const wall = colliderFromCenter('wall', 1, 0, 1, 4);

  it('detects circle and box contact without treating tangency as penetration', () => {
    expect(circleIntersectsAabb({ x: 0, z: 0 }, 0.25, wall)).toBe(false);
    expect(circleIntersectsAabb({ x: 0.3, z: 0 }, 0.25, wall)).toBe(true);
  });

  it('slides along an obstacle instead of cancelling the full movement', () => {
    const result = moveCircle({ x: 0, z: -1 }, { x: 0.5, z: 0.7 }, 0.25, [wall], bounds);
    expect(result.x).toBeCloseTo(0);
    expect(result.z).toBeCloseTo(-0.3);
  });

  it('keeps the complete player circle inside world bounds', () => {
    const result = moveCircle({ x: 9, z: 9 }, { x: 10, z: 10 }, 0.4, [], bounds);
    expect(result).toEqual({ x: 9.6, z: 9.6 });
  });
});

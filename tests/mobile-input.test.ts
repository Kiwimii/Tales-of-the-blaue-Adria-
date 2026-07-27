import { describe, expect, it } from 'vitest';
import {
  MOBILE_SWIPE_RADIUS,
  clampSwipeVector,
  directionsForSwipe,
} from '../src/game/mobileInput';

describe('mobile swipe controls', () => {
  it('does not move when the finger is only placed on the screen', () => {
    expect(directionsForSwipe(0, 0)).toEqual([]);
    expect(directionsForSwipe(6, -5)).toEqual([]);
  });

  it('maps swipes to the intended walking direction', () => {
    expect(directionsForSwipe(0, -48)).toEqual(['up']);
    expect(directionsForSwipe(0, 48)).toEqual(['down']);
    expect(directionsForSwipe(-48, 0)).toEqual(['left']);
    expect(directionsForSwipe(48, 0)).toEqual(['right']);
  });

  it('supports diagonal movement without turning a mostly vertical swipe sideways', () => {
    expect(directionsForSwipe(40, -40)).toEqual(['right', 'up']);
    expect(directionsForSwipe(10, -55)).toEqual(['up']);
  });

  it('caps only the visual joystick displacement, not the requested direction', () => {
    const vector = clampSwipeVector(200, 0);
    expect(vector.x).toBeCloseTo(MOBILE_SWIPE_RADIUS);
    expect(vector.y).toBe(0);
    expect(Math.hypot(vector.x, vector.y)).toBeCloseTo(MOBILE_SWIPE_RADIUS);
  });
});

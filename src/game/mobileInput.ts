import type { Direction } from './types';

export interface SwipeVector {
  x: number;
  y: number;
}

export const MOBILE_SWIPE_DEADZONE = 12;
export const MOBILE_SWIPE_RADIUS = 58;

export function directionsForSwipe(
  x: number,
  y: number,
  deadzone = MOBILE_SWIPE_DEADZONE,
): Direction[] {
  const horizontal = Math.abs(x);
  const vertical = Math.abs(y);
  if (Math.hypot(x, y) < deadzone) return [];

  const result: Direction[] = [];
  if (horizontal >= deadzone && horizontal >= vertical * 0.55) result.push(x < 0 ? 'left' : 'right');
  if (vertical >= deadzone && vertical >= horizontal * 0.55) result.push(y < 0 ? 'up' : 'down');
  return result;
}

export function clampSwipeVector(x: number, y: number, radius = MOBILE_SWIPE_RADIUS): SwipeVector {
  const length = Math.hypot(x, y);
  if (length <= radius || length === 0) return { x, y };
  const scale = radius / length;
  return { x: x * scale, y: y * scale };
}

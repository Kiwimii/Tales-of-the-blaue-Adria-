import { describe, expect, it } from 'vitest';
import {
  ACTION_TAP_MAX_DISTANCE,
  DIALOG_TOUCH_GUARD_MS,
  isActionTap,
  isDialogInputReady,
} from '../src/game/touchInteraction';

describe('touch interaction guards', () => {
  it('accepts a completed short tap but rejects a swipe as an action', () => {
    expect(isActionTap(0, 0)).toBe(true);
    expect(isActionTap(12, -8)).toBe(true);
    expect(isActionTap(ACTION_TAP_MAX_DISTANCE + 1, 0)).toBe(false);
    expect(isActionTap(20, 20)).toBe(false);
  });

  it('keeps newly opened dialog options blocked through the triggering touch', () => {
    const openedAt = 1_000;
    expect(isDialogInputReady(openedAt, openedAt + DIALOG_TOUCH_GUARD_MS - 1)).toBe(false);
    expect(isDialogInputReady(openedAt, openedAt + DIALOG_TOUCH_GUARD_MS)).toBe(true);
  });
});

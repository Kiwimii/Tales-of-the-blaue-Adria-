import { describe, expect, it } from 'vitest';
import {
  ACTION_TAP_DEBOUNCE_MS,
  ACTION_TAP_MAX_DISTANCE,
  DIALOG_TOUCH_GUARD_MS,
  canTriggerAction,
  isActionTap,
  isDialogInputReady,
  shouldTriggerContextAction,
} from '../src/game/touchInteraction';

describe('touch interaction guards', () => {
  it('accepts a completed finger tap with normal drift but rejects a swipe as an action', () => {
    expect(isActionTap(0, 0)).toBe(true);
    expect(isActionTap(20, 20)).toBe(true);
    expect(isActionTap(ACTION_TAP_MAX_DISTANCE + 1, 0)).toBe(false);
    expect(isActionTap(50, 30)).toBe(false);
  });

  it('debounces accidental duplicate action taps', () => {
    const triggeredAt = 1_000;
    expect(canTriggerAction(triggeredAt, triggeredAt + ACTION_TAP_DEBOUNCE_MS - 1)).toBe(false);
    expect(canTriggerAction(triggeredAt, triggeredAt + ACTION_TAP_DEBOUNCE_MS)).toBe(true);
  });

  it('allows a short movement-zone tap only for a highlighted nearby interaction', () => {
    expect(shouldTriggerContextAction(true, 4, -3, false)).toBe(true);
    expect(shouldTriggerContextAction(false, 4, -3, false)).toBe(false);
    expect(shouldTriggerContextAction(true, 4, -3, true)).toBe(false);
    expect(shouldTriggerContextAction(true, ACTION_TAP_MAX_DISTANCE + 1, 0, false)).toBe(false);
  });

  it('keeps newly opened dialog options blocked through the triggering touch', () => {
    const openedAt = 1_000;
    expect(isDialogInputReady(openedAt, openedAt + DIALOG_TOUCH_GUARD_MS - 1)).toBe(false);
    expect(isDialogInputReady(openedAt, openedAt + DIALOG_TOUCH_GUARD_MS)).toBe(true);
  });
});

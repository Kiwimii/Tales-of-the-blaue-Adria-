export const ACTION_TAP_MAX_DISTANCE = 38;
export const ACTION_TAP_DEBOUNCE_MS = 180;
export const DIALOG_TOUCH_GUARD_MS = 420;

export function isActionTap(deltaX: number, deltaY: number): boolean {
  return Math.hypot(deltaX, deltaY) <= ACTION_TAP_MAX_DISTANCE;
}

export function isDialogInputReady(openedAt: number, now: number): boolean {
  return now - openedAt >= DIALOG_TOUCH_GUARD_MS;
}

export function canTriggerAction(lastTriggeredAt: number, now: number): boolean {
  return now - lastTriggeredAt >= ACTION_TAP_DEBOUNCE_MS;
}

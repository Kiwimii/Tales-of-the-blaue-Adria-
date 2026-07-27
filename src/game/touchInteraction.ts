export const ACTION_TAP_MAX_DISTANCE = 22;
export const DIALOG_TOUCH_GUARD_MS = 420;

export function isActionTap(deltaX: number, deltaY: number): boolean {
  return Math.hypot(deltaX, deltaY) <= ACTION_TAP_MAX_DISTANCE;
}

export function isDialogInputReady(openedAt: number, now: number): boolean {
  return now - openedAt >= DIALOG_TOUCH_GUARD_MS;
}

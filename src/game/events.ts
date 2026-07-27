import type { Direction } from './types';

export const INPUT_EVENT = 'tales:input';
export const ACTION_EVENT = 'tales:action';
export const RETURN_TO_WORLD_EVENT = 'tales:return-to-world';
export const TOGGLE_MAP_EVENT = 'tales:toggle-map';

export interface InputEventDetail {
  direction: Direction;
  active: boolean;
}

export function sendDirection(direction: Direction, active: boolean): void {
  window.dispatchEvent(new CustomEvent<InputEventDetail>(INPUT_EVENT, { detail: { direction, active } }));
}

export function sendAction(): void {
  window.dispatchEvent(new CustomEvent(ACTION_EVENT));
}

export function sendReturnToWorld(): void {
  window.dispatchEvent(new CustomEvent(RETURN_TO_WORLD_EVENT));
}

export function sendToggleMap(): void {
  window.dispatchEvent(new CustomEvent(TOGGLE_MAP_EVENT));
}

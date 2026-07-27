import type { Direction } from './types';

export const INPUT_EVENT = 'tales:input';
export const ACTION_EVENT = 'tales:action';
export const RETURN_TO_WORLD_EVENT = 'tales:return-to-world';
export const RECOVER_WORLD_CONTROL_EVENT = 'tales:recover-world-control';
export const TOGGLE_MAP_EVENT = 'tales:toggle-map';
export const INTERACTION_STATE_EVENT = 'tales:interaction-state';
export const REQUEST_INTERACTION_STATE_EVENT = 'tales:request-interaction-state';

export interface InputEventDetail {
  direction: Direction;
  active: boolean;
}

export interface InteractionStateDetail {
  id: string | null;
  prompt: string | null;
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

export function sendRecoverWorldControl(): void {
  window.dispatchEvent(new CustomEvent(RECOVER_WORLD_CONTROL_EVENT));
}

export function sendToggleMap(): void {
  window.dispatchEvent(new CustomEvent(TOGGLE_MAP_EVENT));
}

export function sendInteractionState(id: string | null, prompt: string | null): void {
  window.dispatchEvent(new CustomEvent<InteractionStateDetail>(INTERACTION_STATE_EVENT, {
    detail: { id, prompt },
  }));
}

export function requestInteractionState(): void {
  window.dispatchEvent(new CustomEvent(REQUEST_INTERACTION_STATE_EVENT));
}

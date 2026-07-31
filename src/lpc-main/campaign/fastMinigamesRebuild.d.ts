import type { MiniGameContext, MiniGameId, MiniGameOutcome } from './minigamesV2';

export interface PatrolStep {
  position: number;
  direction: number;
}

export interface MaslPullResult {
  good: boolean;
  score: number;
}

export function advancePatrol(position: number, direction: number, speed: number, delta: number): PatrolStep;
export function hedgeSight(observer: number, direction: number, target: number, range: number, cover?: number): boolean;
export function hedgeCompletionSeconds(spotIndex: number, difficulty?: number): number;
export function maslSealScore(left: { x: number; y: number }, right: { x: number; y: number }, targetX?: number): number;
export function maslPullResult(pull: number, seal: number, rhythmRatio: number, cough: number): MaslPullResult;

export class FastMinigamesRebuild {
  constructor(
    root: HTMLElement,
    onOutcome: (outcome: MiniGameOutcome) => void,
    getContext: (id: MiniGameId) => MiniGameContext,
  );
  start(id: MiniGameId): void;
  stop(hide?: boolean): void;
  isActive(): boolean;
  debugSkipCountdown(): void;
  debugSetState(values: Record<string, unknown>): void;
  debugAction(): void;
  debugSnapshot(): Record<string, unknown>;
}

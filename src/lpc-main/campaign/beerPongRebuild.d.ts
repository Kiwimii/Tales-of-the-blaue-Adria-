import type { MiniGameContext, MiniGameOutcome } from './minigamesV2';

export type BeerPongShotMode = 'direct' | 'bounce';
export interface BeerPongPoint { x: number; y: number; }
export interface BeerPongCup { id: number; x: number; depth: number; active: boolean; }
export interface BeerPongShotPlan {
  mode: BeerPongShotMode;
  targetX: number;
  range: number;
  power: number;
  duration: number;
}
export interface BeerPongShotSample {
  x: number;
  depth: number;
  height: number;
  progress: number;
  bounced: boolean;
}

export function createBeerPongCups(): BeerPongCup[];
export function createBeerPongShotPlan(pullPoint: BeerPongPoint, mode: BeerPongShotMode): BeerPongShotPlan | undefined;
export function sampleBeerPongShot(plan: BeerPongShotPlan, progress: number): BeerPongShotSample;
export function findBeerPongHit(cups: BeerPongCup[], sample: BeerPongShotSample): BeerPongCup | undefined;
export function projectBeerPongPoint(point: Pick<BeerPongShotSample, 'x' | 'depth' | 'height'>, width: number, height: number): { x: number; y: number; scale: number };

export class BeerPongRebuild {
  constructor(root: HTMLElement, onOutcome: (outcome: MiniGameOutcome) => void, getContext: () => MiniGameContext);
  start(): void;
  stop(hide?: boolean): void;
  isActive(): boolean;
  debugSkipCountdown(): void;
  debugSetState(values: Record<string, unknown>): void;
  debugSnapshot(): Record<string, unknown>;
}

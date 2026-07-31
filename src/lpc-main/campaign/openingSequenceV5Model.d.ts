export interface OpeningPoint { x: number; y: number; }
export interface OpeningRect extends OpeningPoint { width: number; height: number; }
export interface OpeningLayout {
  parking: OpeningRect;
  gateLane: OpeningRect;
  car: OpeningRect;
  trunk: OpeningPoint;
  playerExit: OpeningPoint;
  entrance: OpeningPoint;
  gate: OpeningPoint;
  receptionDoor: OpeningPoint;
  reservationBoard: OpeningPoint;
}
export const OPENING_SEQUENCE_VERSION: string;
export const OPENING_LAYOUT: Readonly<OpeningLayout>;
export const OPENING_CRAWL_LINES: readonly string[];
export function pointInside(rect: OpeningRect, point: OpeningPoint, margin?: number): boolean;
export function rectanglesOverlap(a: OpeningRect, b: OpeningRect, padding?: number): boolean;
export function distance(a: OpeningPoint, b: OpeningPoint): number;
export function openingLayoutReport(layout?: OpeningLayout): {
  version: string;
  checks: Record<string, boolean>;
  valid: boolean;
  carRect: OpeningRect;
};
export function arrivalPhaseAt(elapsedMs: number): 'approach' | 'turn' | 'parked' | 'door' | 'exit' | 'complete';

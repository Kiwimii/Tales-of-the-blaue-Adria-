import { describe, expect, it } from 'vitest';
import {
  OPENING_CRAWL_LINES,
  OPENING_LAYOUT,
  arrivalPhaseAt,
  distance,
  openingLayoutReport,
  rectanglesOverlap,
} from './openingSequenceV5Model.js';

describe('opening sequence v5', () => {
  it('keeps the arrival car inside the parking area and out of the gate lane', () => {
    const report = openingLayoutReport();
    expect(report.valid).toBe(true);
    expect(report.checks.carInsideParking).toBe(true);
    expect(report.checks.gateLaneClear).toBe(true);
    expect(rectanglesOverlap(report.carRect, OPENING_LAYOUT.gateLane, 4)).toBe(false);
  });

  it('places the player beside the driver door and the trunk at the rear', () => {
    expect(distance(OPENING_LAYOUT.playerExit, OPENING_LAYOUT.car)).toBeGreaterThanOrEqual(58);
    expect(distance(OPENING_LAYOUT.playerExit, OPENING_LAYOUT.car)).toBeLessThanOrEqual(110);
    expect(distance(OPENING_LAYOUT.trunk, OPENING_LAYOUT.car)).toBeGreaterThanOrEqual(70);
    expect(distance(OPENING_LAYOUT.trunk, OPENING_LAYOUT.car)).toBeLessThanOrEqual(105);
  });

  it('keeps gate, reception and reservation board in a readable route', () => {
    expect(distance(OPENING_LAYOUT.gate, OPENING_LAYOUT.receptionDoor)).toBeLessThan(270);
    expect(distance(OPENING_LAYOUT.receptionDoor, OPENING_LAYOUT.reservationBoard)).toBeLessThan(210);
  });

  it('contains a substantial, sarcastic story crawl', () => {
    expect(OPENING_CRAWL_LINES.length).toBeGreaterThanOrEqual(6);
    expect(OPENING_CRAWL_LINES.join(' ')).toContain('25 Euro');
    expect(OPENING_CRAWL_LINES.join(' ')).toContain('Gundula');
    expect(OPENING_CRAWL_LINES.join(' ')).toContain('Kaution');
  });

  it('advances through approach, parking, exit and completion phases', () => {
    expect(arrivalPhaseAt(0)).toBe('approach');
    expect(arrivalPhaseAt(1800)).toBe('turn');
    expect(arrivalPhaseAt(3500)).toBe('parked');
    expect(arrivalPhaseAt(4700)).toBe('door');
    expect(arrivalPhaseAt(6000)).toBe('exit');
    expect(arrivalPhaseAt(7200)).toBe('complete');
  });
});

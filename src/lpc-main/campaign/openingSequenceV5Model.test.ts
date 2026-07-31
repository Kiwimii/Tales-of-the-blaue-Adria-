import { describe, expect, it } from 'vitest';
import {
  ARRIVAL_PLAYER_EXIT_POSITION,
  OPENING_CRAWL,
  OPENING_FLOW_STEPS,
  arrivalPhaseAt,
  openingLayoutSnapshot,
  shouldPlayArrivalSequence,
  validateOpeningLayout,
} from './openingSequenceV5Model';

describe('opening sequence V5', () => {
  it('tells a complete sarcastic space-crawl story before shopping', () => {
    expect(OPENING_CRAWL.paragraphs.length).toBeGreaterThanOrEqual(7);
    expect(OPENING_CRAWL.paragraphs.join(' ')).toContain('Supermarkt');
    expect(OPENING_CRAWL.paragraphs.join(' ')).toContain('Gundula');
    expect(OPENING_CRAWL.paragraphs.join(' ')).toContain('Parkplatz');
    expect(OPENING_FLOW_STEPS.map((step) => step.id)).toEqual(['story', 'driver', 'market', 'arrival']);
  });

  it('keeps car, exit, gate, reception and story objects in a coherent arrival layout', () => {
    expect(validateOpeningLayout()).toEqual([]);
    const layout = openingLayoutSnapshot();
    expect(layout.car).toEqual(layout.trunk);
    expect(layout.playerExit).toEqual(ARRIVAL_PLAYER_EXIT_POSITION);
    expect(layout.playerExit.y).toBeGreaterThan(layout.gate.y);
    expect(layout.reception.x).toBeGreaterThan(layout.gate.x);
    expect(layout.board.x).toBeGreaterThan(layout.reception.x);
  });

  it('only plays the arrival after the supermarket and before the first quest was seen', () => {
    expect(shouldPlayArrivalSequence({ gameVisible: true, questStage: 'arrival', shoppingComplete: true, alreadySeen: false, active: false })).toBe(true);
    expect(shouldPlayArrivalSequence({ gameVisible: true, questStage: 'arrival', shoppingComplete: false, alreadySeen: false, active: false })).toBe(false);
    expect(shouldPlayArrivalSequence({ gameVisible: true, questStage: 'reservation', shoppingComplete: true, alreadySeen: false, active: false })).toBe(false);
    expect(shouldPlayArrivalSequence({ gameVisible: true, questStage: 'arrival', shoppingComplete: true, alreadySeen: true, active: false })).toBe(false);
    expect(shouldPlayArrivalSequence({ gameVisible: true, questStage: 'arrival', shoppingComplete: true, alreadySeen: false, active: true })).toBe(false);
  });

  it('moves through a short readable arrival sequence', () => {
    expect(arrivalPhaseAt(0)).toBe('road');
    expect(arrivalPhaseAt(1_900)).toBe('lot');
    expect(arrivalPhaseAt(3_500)).toBe('parked');
    expect(arrivalPhaseAt(4_600)).toBe('doors');
    expect(arrivalPhaseAt(5_500)).toBe('exit');
    expect(arrivalPhaseAt(6_500)).toBe('ready');
  });
});

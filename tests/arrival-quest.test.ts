import { describe, expect, it } from 'vitest';
import {
  ARRIVAL_POSITIONS,
  arrivalObjective,
  arrivalStage,
  arrivalTarget,
  arrivalUnloadCount,
} from '../src/game/arrivalQuest';
import { validateArrivalLayout } from '../src/game/arrivalLayout';
import type { GameSnapshot } from '../src/game/types';

function state(flags: Record<string, boolean> = {}, status: 'active' | 'completed' = 'active'): GameSnapshot {
  return {
    version: 3,
    mode: 'world',
    profile: null,
    prologue: { introSeen: true, shoppingComplete: true, spent: 0 },
    day: 1,
    minutes: 420,
    money: 0,
    needs: { energy: 100, hunger: 0, thirst: 0, bladder: 0, alcohol: 0, highness: 0, hangover: 0, courage: 20 },
    metrics: { dignity: 60, chaos: 0, reputation: 0, momentum: 0 },
    inventory: {},
    team: [],
    relationships: {},
    quests: { entry: { status, stage: status === 'completed' ? 99 : 0 } },
    activeQuest: status === 'active' ? 'entry' : null,
    flags,
    encounter: null,
    chronicle: [],
    worldPosition: { ...ARRIVAL_POSITIONS.trunk },
    currentInterior: null,
    activityResults: {},
    clockLabel: '07:00',
    phaseLabel: 'Morgen',
    conditionLabel: 'stabil',
    currentObjective: '',
  };
}

describe('arrival quest line', () => {
  it('progresses in spatial order from trunk to first beer', () => {
    expect(arrivalStage(state())).toBe(0);
    expect(arrivalTarget(state())).toEqual(ARRIVAL_POSITIONS.trunk);

    const documents = state({ arrivalDocumentsFound: true });
    expect(arrivalStage(documents)).toBe(1);
    expect(arrivalObjective(documents)).toContain('Reservierungsbrett');

    const debate = state({
      arrivalDocumentsFound: true,
      reservationSolved: true,
      gundulaConvinced: true,
      uliInspectionPassed: true,
    });
    expect(arrivalStage(debate)).toBe(4);
    expect(arrivalObjective(debate)).toContain('Einlassdiskussion');

    const power = state({ entryDebateWon: true, carParkedAtTaucherplatz: true });
    expect(arrivalStage(power)).toBe(6);
    expect(arrivalObjective(power)).toContain('Stromkasten');
    expect(arrivalTarget(power)).toEqual(ARRIVAL_POSITIONS.powerBox);
  });

  it('separates an assigned socket from a physically connected cable', () => {
    const access = state({ powerAccessOrganized: true });
    expect(arrivalStage(access)).toBe(7);
    expect(access.flags.powerConnected).toBeUndefined();
    expect(arrivalObjective(access)).toContain('Kabeltrommel');
  });

  it('counts three physical unloading tasks before the beer milestone', () => {
    const unloading = state({
      powerAccessOrganized: true,
      arrivalDrinksUnloaded: true,
      arrivalTentsUnloaded: true,
    });
    expect(arrivalUnloadCount(unloading)).toBe(2);
    expect(arrivalStage(unloading)).toBe(7);
    expect(arrivalObjective(unloading)).toContain('(2/3)');
    expect(arrivalTarget(unloading)).toEqual(ARRIVAL_POSITIONS.cable);

    const ready = state({
      powerAccessOrganized: true,
      powerConnected: true,
      arrivalDrinksUnloaded: true,
      arrivalTentsUnloaded: true,
      arrivalCableUnloaded: true,
    });
    expect(arrivalStage(ready)).toBe(8);
    expect(arrivalObjective(ready)).toContain('erste Bier');
    expect(arrivalTarget(ready)).toEqual(ARRIVAL_POSITIONS.firstBeer);
  });

  it('ends only after the first beer or a completed legacy entry quest', () => {
    expect(arrivalStage(state({ firstBeerOpened: true }))).toBe(9);
    expect(arrivalStage(state({}, 'completed'))).toBe(9);
  });

  it('keeps the Taucherplatz layout coherent', () => {
    expect(validateArrivalLayout()).toEqual([]);
  });
});

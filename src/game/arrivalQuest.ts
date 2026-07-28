import { applySprint89CampPlan } from './sprint89CampPlan';
import type { GameSnapshot } from './types';

applySprint89CampPlan();

export const ARRIVAL_POSITIONS = {
  trunk: { x: 900, y: 1600 },
  reservationBoard: { x: 1280, y: 1360 },
  gundula: { x: 1180, y: 1360 },
  uli: { x: 1020, y: 1350 },
  gateDebate: { x: 900, y: 1400 },
  taucherplatz: { x: 1240, y: 1170 },
  powerBox: { x: 1290, y: 1080 },
  drinks: { x: 1130, y: 1210 },
  tents: { x: 1110, y: 1020 },
  cable: { x: 1210, y: 1090 },
  firstBeer: { x: 1100, y: 1170 },
  homeDoor: { x: 225, y: 1120 },
} as const;

export const ARRIVAL_UNLOAD_FLAGS = [
  'arrivalDrinksUnloaded',
  'arrivalTentsUnloaded',
  'arrivalCableUnloaded',
] as const;

export type ArrivalStage = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

type ArrivalState = Pick<GameSnapshot, 'flags' | 'inventory' | 'quests'>;

export function arrivalUnloadCount(state: Pick<GameSnapshot, 'flags'>): number {
  return ARRIVAL_UNLOAD_FLAGS.filter((flag) => state.flags[flag]).length;
}

export function arrivalStage(state: ArrivalState): ArrivalStage {
  if (state.quests.entry?.status === 'completed' || state.flags.firstBeerOpened) return 9;
  if (arrivalUnloadCount(state) === ARRIVAL_UNLOAD_FLAGS.length) return 8;
  if (state.flags.powerAccessOrganized) return 7;
  if (state.flags.carParkedAtTaucherplatz) return 6;
  if (state.flags.entryDebateWon) return 5;
  if (state.flags.uliInspectionPassed) return 4;
  if (state.flags.gundulaConvinced) return 3;
  if (state.flags.reservationSolved) return 2;
  if (state.flags.arrivalDocumentsFound) return 1;
  return 0;
}

export function arrivalObjective(state: ArrivalState): string {
  switch (arrivalStage(state)) {
    case 0: return 'Öffne auf dem Ankunftsparkplatz den Kofferraum und suche die Reservierungsunterlagen.';
    case 1: return 'Vergleiche die Hinweise aus dem Auto mit dem Reservierungsbrett vor der Rezeption.';
    case 2: return 'Melde die Gruppe bei Gundula an – unter dem richtigen falschen Namen.';
    case 3: return 'Bestehe Ulis Kontrolle von Taucherplatz, Fahrzeug und fragwürdiger Discounter-Kleidung.';
    case 4: return 'Stelle dich an der Schranke der Einlassdiskussion gegen Gundula und Uli.';
    case 5: return 'Gehe durch die Schranke und bringe den Wagen an den östlichen Versorgungsrand des Taucherplatzes.';
    case 6: return 'Organisiere am Stromkasten einen Anschluss. Die Kabeltrommel liegt direkt zwischen Wagen und Verteiler.';
    case 7: return `Lade Getränke am Kühlplatz, Zeltsäcke am Kreiszugang und Kabeltrommel am Stromkasten aus (${arrivalUnloadCount(state)}/${ARRIVAL_UNLOAD_FLAGS.length}).`;
    case 8: return 'Alles steht und der Strom läuft. Öffne das erste Bier direkt bei Getränkekisten und Kühlplatz.';
    default: return 'Intro abgeschlossen. Der Zeltkreis steht, der Mittelbereich bleibt begehbar und der Versorgungsrand ist eingerichtet.';
  }
}

export function arrivalTarget(state: ArrivalState): { x: number; y: number } {
  switch (arrivalStage(state)) {
    case 0: return ARRIVAL_POSITIONS.trunk;
    case 1: return ARRIVAL_POSITIONS.reservationBoard;
    case 2: return ARRIVAL_POSITIONS.gundula;
    case 3: return ARRIVAL_POSITIONS.uli;
    case 4: return ARRIVAL_POSITIONS.gateDebate;
    case 5: return ARRIVAL_POSITIONS.taucherplatz;
    case 6: return ARRIVAL_POSITIONS.powerBox;
    case 7:
      if (!state.flags.arrivalDrinksUnloaded) return ARRIVAL_POSITIONS.drinks;
      if (!state.flags.arrivalTentsUnloaded) return ARRIVAL_POSITIONS.tents;
      return ARRIVAL_POSITIONS.cable;
    case 8: return ARRIVAL_POSITIONS.firstBeer;
    default: return ARRIVAL_POSITIONS.taucherplatz;
  }
}

export function isArrivalIntroActive(state: ArrivalState): boolean {
  return state.quests.entry?.status === 'active' && !state.flags.firstBeerOpened;
}

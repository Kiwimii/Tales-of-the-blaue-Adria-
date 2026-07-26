import type { GameSnapshot } from './types';

export const ARRIVAL_POSITIONS = {
  trunk: { x: 650, y: 1590 },
  reservationBoard: { x: 700, y: 1460 },
  gundula: { x: 790, y: 1390 },
  uli: { x: 885, y: 1390 },
  gateDebate: { x: 835, y: 1325 },
  taucherplatz: { x: 1125, y: 1015 },
  powerBox: { x: 1280, y: 970 },
  drinks: { x: 1020, y: 1065 },
  tents: { x: 1120, y: 1095 },
  cable: { x: 1220, y: 1065 },
  firstBeer: { x: 1010, y: 1140 },
  homeDoor: { x: 1127, y: 1232 },
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
    case 0:
      return 'Öffne auf dem Ankunftsparkplatz den Kofferraum und suche die Reservierungsunterlagen.';
    case 1:
      return 'Vergleiche die Hinweise aus dem Auto mit dem Reservierungsbrett vor der Rezeption.';
    case 2:
      return 'Melde die Gruppe bei Gundula an – unter dem richtigen falschen Namen.';
    case 3:
      return 'Bestehe Ulis Kontrolle von Taucherplatz, Fahrzeug und fragwürdiger Discounter-Kleidung.';
    case 4:
      return 'Stelle dich an der Schranke der Einlassdiskussion gegen Gundula und Uli.';
    case 5:
      return 'Gehe durch die Schranke und bringe den Wagen auf den großzügigen Taucherplatz.';
    case 6:
      return 'Organisiere am Stromkasten einen Anschluss. Strom wurde natürlich nicht angemeldet.';
    case 7:
      return `Lade Getränke, Zeltsäcke und Kabeltrommel aus (${arrivalUnloadCount(state)}/${ARRIVAL_UNLOAD_FLAGS.length}).`;
    case 8:
      return 'Alles steht und der Strom läuft. Öffne am Taucherplatz das erste Bier.';
    default:
      return 'Intro abgeschlossen. Der Taucherplatz ist bezogen und die erste Rechnung für Sonntag vorbereitet.';
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

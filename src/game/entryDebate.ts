import type { CombatAction } from './combat';

export interface EntryDebateState {
  playerResolve: number;
  playerMaxResolve: number;
  authorityResolve: number;
  authorityMaxResolve: number;
  round: number;
  usedActions: CombatAction[];
}

export interface EntryDebateRound {
  state: EntryDebateState;
  log: string;
  playerDamage: number;
  authorityDamage: number;
  healed: number;
  finished: 'victory' | 'defeat' | null;
}

const ARGUMENTS = [
  'Gundula behauptet, die Reservierung existiere nur als Gerücht.',
  'Uli zählt sichtbar mehr Personen und Zelte als auf dem Formular.',
  'Beide entdecken den fehlenden Stromhaken und das Discounter-Outfit.',
  'Die Verwaltung wiederholt alle Einwände gleichzeitig, jetzt aber lauter.',
];

export function createEntryDebateState(): EntryDebateState {
  return {
    playerResolve: 96,
    playerMaxResolve: 96,
    authorityResolve: 88,
    authorityMaxResolve: 88,
    round: 1,
    usedActions: [],
  };
}

export function resolveEntryDebateRound(
  current: EntryDebateState,
  action: CombatAction,
  hasBatida: boolean,
): EntryDebateRound {
  const firstUse = !current.usedActions.includes(action);
  const usedActions = firstUse ? [...current.usedActions, action] : [...current.usedActions];
  const noveltyBonus = firstUse ? 10 : -5;
  const baseDamage = action === 'counter' ? 25 : action === 'guard' ? 15 : 19;
  const batidaBonus = action === 'rally' && hasBatida ? 10 : 0;
  const playerDamage = Math.max(6, baseDamage + noveltyBonus + batidaBonus);
  const healed = action === 'rally' ? (hasBatida ? 16 : 10) : 0;
  const authorityDamage = action === 'guard' ? 6 : action === 'rally' ? 10 : 15;

  const next: EntryDebateState = {
    ...current,
    round: current.round + 1,
    usedActions,
    authorityResolve: Math.max(0, current.authorityResolve - playerDamage),
    playerResolve: Math.min(current.playerMaxResolve, current.playerResolve + healed),
  };

  if (next.authorityResolve <= 0) {
    return {
      state: next,
      log: `${actionLabel(action, hasBatida)} beendet die Diskussion. Gundula stempelt, Uli öffnet die Schranke.`,
      playerDamage,
      authorityDamage: 0,
      healed,
      finished: 'victory',
    };
  }

  next.playerResolve = Math.max(0, next.playerResolve - authorityDamage);
  const argument = ARGUMENTS[Math.min(current.round - 1, ARGUMENTS.length - 1)];
  const variety = firstUse
    ? 'Der neue Ansatz trifft die Verwaltungsroutine unvorbereitet.'
    : 'Die Wiederholung wirkt deutlich schwächer.';
  const recovery = healed ? ` Du gewinnst ${healed} Fassung zurück.` : '';
  const log = `${actionLabel(action, hasBatida)} kostet die Gegenseite ${playerDamage} Widerstand. ${variety}${recovery} ${argument} Du verlierst ${authorityDamage} Fassung.`;

  return {
    state: next,
    log,
    playerDamage,
    authorityDamage,
    healed,
    finished: next.playerResolve <= 0 ? 'defeat' : null,
  };
}

export function entryDebateHint(state: EntryDebateState): string {
  if (!state.usedActions.includes('counter')) return 'Konter: Nutze den gefundenen Reservierungsbeleg als direkten Angriff.';
  if (!state.usedActions.includes('guard')) return 'Blocken: Drehe Platzordnung und Taucherplatz-Markierung gegen die Kontrolle.';
  if (!state.usedActions.includes('rally')) return 'Team-Zuruf: Stabilisiert deine Fassung; Batida verstärkt den Effekt.';
  return 'Alle Grundlagen gelernt. Unterschiedliche Aktionen bleiben effizienter als Wiederholungen.';
}

function actionLabel(action: CombatAction, hasBatida: boolean): string {
  if (action === 'counter') return 'Der Reservierungsbeleg';
  if (action === 'guard') return 'Die Regelwerk-Blockade';
  return hasBatida ? 'Der Batida-Zuruf' : 'Der Gruppen-Zuruf';
}

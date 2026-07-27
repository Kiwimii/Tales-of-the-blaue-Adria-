import { COMBAT_MOVES, COMBAT_OPPONENTS, type CombatOpponentId } from './combatMoves';
import { activeTeamSynergies } from './friendRoster';
import { statusModifiers } from './statusSystem';
import type { CombatMoveId, FrustrationStatusId, GameSnapshot } from './types';

export interface FrustrationStatus {
  id: FrustrationStatusId;
  turns: number;
}

export interface FrustrationCombatState {
  opponentId: CombatOpponentId;
  playerFrustration: number;
  playerMaxFrustration: number;
  enemyFrustration: number;
  enemyMaxFrustration: number;
  round: number;
  usedMoves: CombatMoveId[];
  playerStatuses: FrustrationStatus[];
  enemyStatuses: FrustrationStatus[];
}

export interface FrustrationCombatRound {
  state: FrustrationCombatState;
  moveId: CombatMoveId;
  inflictedFrustration: number;
  receivedFrustration: number;
  relievedFrustration: number;
  chance: number;
  hit: boolean;
  effectiveness: number;
  effectivenessLabel: string;
  log: string;
  finished: 'victory' | 'defeat' | null;
}

export function createFrustrationCombatState(
  snapshot: GameSnapshot,
  opponentId: CombatOpponentId,
): FrustrationCombatState {
  const opponent = COMBAT_OPPONENTS[opponentId];
  const teamDefense = snapshot.team.reduce((sum, member) => sum + member.bonuses.recovery, 0);
  const synergyDefense = activeTeamSynergies(snapshot.team.map((member) => member.id))
    .reduce((sum, item) => sum + item.recovery, 0);
  const max = Math.round(92 + snapshot.metrics.dignity * 0.08 + teamDefense * 0.7 + synergyDefense);
  return {
    opponentId,
    playerFrustration: 0,
    playerMaxFrustration: Math.max(80, max),
    enemyFrustration: 0,
    enemyMaxFrustration: opponent.maxFrustration,
    round: 1,
    usedMoves: [],
    playerStatuses: [],
    enemyStatuses: [],
  };
}

export function resolveFrustrationRound(
  current: FrustrationCombatState,
  moveId: CombatMoveId,
  snapshot: GameSnapshot,
  random: () => number = Math.random,
): FrustrationCombatRound {
  const move = COMBAT_MOVES[moveId];
  const opponent = COMBAT_OPPONENTS[current.opponentId];
  const next = tickStatuses(current);
  next.round += 1;
  const firstUse = !current.usedMoves.includes(moveId);
  if (firstUse) next.usedMoves.push(moveId);

  const body = statusModifiers(snapshot.needs);
  let chance = move.accuracy + body.accuracy;
  if (hasStatus(current.playerStatuses, 'fokussiert')) chance += 8;
  if (hasStatus(current.enemyStatuses, 'fixiert')) chance += 5;
  if (!firstUse) chance -= 3;
  chance = clamp(Math.round(chance), 5, 98);

  const hit = Math.floor(random() * 100) + 1 <= chance;
  const effectiveness = moveEffectiveness(moveId, current.opponentId);
  const teamPower = snapshot.team.reduce((sum, member) => sum + member.bonuses.battle, 0);
  const synergyPower = activeTeamSynergies(snapshot.team.map((member) => member.id))
    .reduce((sum, item) => sum + item.battle, 0);
  const teamScaling = move.tag === 'team' ? snapshot.team.length * 4 + teamPower * 0.55 + synergyPower : teamPower * 0.18;
  const novelty = firstUse ? 2 : -2;
  let inflictedFrustration = 0;
  let relievedFrustration = 0;

  if (hit) {
    const raw = (move.baseFrustration + random() * 5 + teamScaling + novelty) * body.power;
    inflictedFrustration = Math.max(1, Math.round(raw * effectiveness));
    next.enemyFrustration = Math.min(next.enemyMaxFrustration, next.enemyFrustration + inflictedFrustration);
    if (move.selfRelief) {
      relievedFrustration = Math.min(next.playerFrustration, Math.round(move.selfRelief + teamPower * 0.15));
      next.playerFrustration = Math.max(0, next.playerFrustration - relievedFrustration);
    }
    if (move.status) {
      addStatus(move.status.target === 'enemy' ? next.enemyStatuses : next.playerStatuses, move.status.id, move.status.turns);
    }
  }

  const effectivenessLabel = describeEffectiveness(effectiveness);
  if (next.enemyFrustration >= next.enemyMaxFrustration) {
    return {
      state: next,
      moveId,
      inflictedFrustration,
      receivedFrustration: 0,
      relievedFrustration,
      chance,
      hit,
      effectiveness,
      effectivenessLabel,
      log: `${move.label} verursacht ${inflictedFrustration} Frustpunkte. ${effectivenessLabel} ${opponent.name} ist vollständig frustriert.`,
      finished: 'victory',
    };
  }

  let counter = opponent.baseCounterFrustration + random() * 6 + Math.min(6, current.round * 0.7);
  if (move.guardMultiplier) counter *= move.guardMultiplier;
  if (hasStatus(next.playerStatuses, 'abgesichert')) counter *= 0.72;
  if (hasStatus(next.enemyStatuses, 'ueberrumpelt')) counter *= 0.72;
  if (hasStatus(next.enemyStatuses, 'unterbrochen')) counter *= 0.68;
  if (hasStatus(next.enemyStatuses, 'leerlauf')) counter *= 0.58;
  if (hasStatus(next.enemyStatuses, 'verwirrt')) counter *= 0.8;
  if (hasStatus(next.enemyStatuses, 'fremdschaemen')) counter *= 0.88;
  const receivedFrustration = Math.max(1, Math.round(counter / body.defense));
  next.playerFrustration = Math.min(next.playerMaxFrustration, next.playerFrustration + receivedFrustration);

  const moveText = hit
    ? `${move.label} verursacht ${inflictedFrustration} Frustpunkte. ${effectivenessLabel}`
    : `${move.label} verfehlt bei ${chance}% Erfolgschance.`;
  const reliefText = relievedFrustration ? ` Du baust ${relievedFrustration} eigene Frustpunkte ab.` : '';
  const counterLine = opponent.counterLines[(current.round - 1) % opponent.counterLines.length];
  const log = `${moveText}${reliefText} ${counterLine} Du erhältst ${receivedFrustration} Frustpunkte.`;

  return {
    state: next,
    moveId,
    inflictedFrustration,
    receivedFrustration,
    relievedFrustration,
    chance,
    hit,
    effectiveness,
    effectivenessLabel,
    log,
    finished: next.playerFrustration >= next.playerMaxFrustration ? 'defeat' : null,
  };
}

export function moveEffectiveness(moveId: CombatMoveId, opponentId: CombatOpponentId): number {
  const move = COMBAT_MOVES[moveId];
  const opponent = COMBAT_OPPONENTS[opponentId];
  return opponent.moveMultipliers[moveId] ?? opponent.tagMultipliers[move.tag] ?? 1;
}

export function describeEffectiveness(multiplier: number): string {
  if (multiplier >= 1.35) return 'EXTREM EFFEKTIV.';
  if (multiplier >= 1.15) return 'SEHR EFFEKTIV.';
  if (multiplier <= 0.6) return 'FAST WIRKUNGSLOS.';
  if (multiplier <= 0.82) return 'WENIG EFFEKTIV.';
  return 'NORMAL EFFEKTIV.';
}

export function frustrationStatusLabels(statuses: FrustrationStatus[]): string[] {
  return statuses.map((status) => `${statusLabel(status.id)} ${status.turns}`);
}

function tickStatuses(current: FrustrationCombatState): FrustrationCombatState {
  return {
    ...current,
    usedMoves: [...current.usedMoves],
    playerStatuses: current.playerStatuses
      .map((status) => ({ ...status, turns: status.turns - 1 }))
      .filter((status) => status.turns > 0),
    enemyStatuses: current.enemyStatuses
      .map((status) => ({ ...status, turns: status.turns - 1 }))
      .filter((status) => status.turns > 0),
  };
}

function addStatus(statuses: FrustrationStatus[], id: FrustrationStatusId, turns: number): void {
  const existing = statuses.find((status) => status.id === id);
  if (existing) existing.turns = Math.max(existing.turns, turns);
  else statuses.push({ id, turns });
}

function hasStatus(statuses: FrustrationStatus[], id: FrustrationStatusId): boolean {
  return statuses.some((status) => status.id === id && status.turns > 0);
}

function statusLabel(id: FrustrationStatusId): string {
  const labels: Record<FrustrationStatusId, string> = {
    ueberrumpelt: 'ÜBERRUMPELT',
    fremdschaemen: 'FREMDSCHAM',
    leerlauf: 'LEERLAUF',
    unterbrochen: 'UNTERBROCHEN',
    abgesichert: 'ABGESICHERT',
    verwirrt: 'VERWIRRT',
    fokussiert: 'FOKUSSIERT',
    fixiert: 'FIXIERT',
  };
  return labels[id];
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

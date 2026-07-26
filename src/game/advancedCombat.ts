import { activeTeamSynergies } from './friendRoster';
import { calculateChallengeChance } from './mechanics';
import { activeStatuses, statusModifiers } from './statusSystem';
import type { GameSnapshot } from './types';

export type AdvancedCombatAction = 'counter' | 'guard' | 'rally';
export type TemporaryEffectId = 'fokussiert' | 'unterbrochen' | 'frustriert' | 'verzoegert';

export interface TemporaryEffect {
  id: TemporaryEffectId;
  turns: number;
}

export interface AdvancedCombatState {
  playerResolve: number;
  playerMaxResolve: number;
  enemyResolve: number;
  enemyMaxResolve: number;
  round: number;
  usedActions: AdvancedCombatAction[];
  playerEffects: TemporaryEffect[];
  enemyEffects: TemporaryEffect[];
}

export interface AdvancedCombatRound {
  state: AdvancedCombatState;
  playerDamage: number;
  enemyDamage: number;
  healed: number;
  chance: number;
  hit: boolean;
  log: string;
  finished: 'victory' | 'defeat' | null;
}

export function createAdvancedCombatState(snapshot: GameSnapshot): AdvancedCombatState {
  const teamPower = snapshot.team.reduce((sum, member) => sum + member.bonuses.battle, 0);
  const synergy = activeTeamSynergies(snapshot.team.map((member) => member.id));
  const max = Math.round(78 + snapshot.metrics.dignity * 0.14 + teamPower * 1.3 + synergy.reduce((sum, item) => sum + item.battle, 0));
  return {
    playerResolve: max,
    playerMaxResolve: max,
    enemyResolve: 92,
    enemyMaxResolve: 92,
    round: 1,
    usedActions: [],
    playerEffects: [],
    enemyEffects: [],
  };
}

export function resolveAdvancedCombatRound(
  current: AdvancedCombatState,
  action: AdvancedCombatAction,
  snapshot: GameSnapshot,
  random: () => number = Math.random,
): AdvancedCombatRound {
  const modifiers = statusModifiers(snapshot.needs);
  const next = tickEffects(current);
  next.round += 1;
  const firstUse = !current.usedActions.includes(action);
  if (firstUse) next.usedActions.push(action);

  const relation = 'ronny';
  const base = action === 'guard' ? 84 : action === 'rally' ? 76 : 70;
  let chance = calculateChallengeChance(snapshot, { skill: action === 'rally' ? 'teamwork' : 'nerve', baseChance: base, relation });
  chance += modifiers.accuracy;
  if (hasEffect(current.playerEffects, 'fokussiert')) chance += 9;
  if (hasEffect(current.playerEffects, 'verzoegert')) chance -= 8;
  chance += firstUse ? 5 : -4;
  chance = clamp(Math.round(chance), 5, 95);

  const hit = Math.floor(random() * 100) + 1 <= chance;
  const teamBattle = snapshot.team.reduce((sum, member) => sum + member.bonuses.battle, 0);
  let playerDamage = 0;
  let healed = 0;

  if (hit) {
    const baseDamage = action === 'counter' ? 18 : action === 'guard' ? 9 : 6;
    playerDamage = Math.round((baseDamage + random() * 7 + teamBattle * 0.45) * modifiers.power);
    if (action === 'guard') addEffect(next.enemyEffects, 'frustriert', 2);
    if (action === 'counter') addEffect(next.enemyEffects, 'unterbrochen', 1);
    if (action === 'rally') {
      healed = Math.round(11 + snapshot.team.reduce((sum, member) => sum + member.bonuses.recovery, 0) * 0.55);
      next.playerResolve = Math.min(next.playerMaxResolve, next.playerResolve + healed);
      addEffect(next.playerEffects, 'fokussiert', 2);
    }
    next.enemyResolve = Math.max(0, next.enemyResolve - playerDamage);
  }

  if (next.enemyResolve <= 0) {
    return {
      state: next, playerDamage, enemyDamage: 0, healed, chance, hit,
      log: `${actionLabel(action)} beendet die Diskussion. ${statusClause(snapshot)}`,
      finished: 'victory',
    };
  }

  let retaliation = 12 + random() * 8 + snapshot.metrics.chaos * 0.025;
  if (action === 'guard') retaliation *= 0.46;
  if (hasEffect(next.enemyEffects, 'unterbrochen')) retaliation *= 0.7;
  if (hasEffect(next.enemyEffects, 'frustriert')) retaliation *= 0.84;
  const enemyDamage = Math.max(2, Math.round(retaliation / modifiers.defense));
  next.playerResolve = Math.max(0, next.playerResolve - enemyDamage);
  if (snapshot.needs.highness >= 70 && random() < 0.25) addEffect(next.playerEffects, 'verzoegert', 1);

  const actionText = hit
    ? `${actionLabel(action)} trifft für ${playerDamage}${healed ? ` und stabilisiert ${healed}` : ''}.`
    : `${actionLabel(action)} verfehlt bei ${chance}% Trefferchance.`;
  return {
    state: next, playerDamage, enemyDamage, healed, chance, hit,
    log: `${actionText} Der Gegenzug kostet ${enemyDamage} Fassung. ${statusClause(snapshot)}`,
    finished: next.playerResolve <= 0 ? 'defeat' : null,
  };
}

export function combatStatusLabels(snapshot: GameSnapshot, state: AdvancedCombatState): string[] {
  const body = activeStatuses(snapshot.needs).map((status) => status.shortLabel);
  const temporary = state.playerEffects.map((effect) => effect.id.toUpperCase());
  return [...body, ...temporary].slice(0, 4);
}

function tickEffects(current: AdvancedCombatState): AdvancedCombatState {
  return {
    ...current,
    usedActions: [...current.usedActions],
    playerEffects: current.playerEffects.map((effect) => ({ ...effect, turns: effect.turns - 1 })).filter((effect) => effect.turns > 0),
    enemyEffects: current.enemyEffects.map((effect) => ({ ...effect, turns: effect.turns - 1 })).filter((effect) => effect.turns > 0),
  };
}

function addEffect(list: TemporaryEffect[], id: TemporaryEffectId, turns: number): void {
  const existing = list.find((effect) => effect.id === id);
  if (existing) existing.turns = Math.max(existing.turns, turns);
  else list.push({ id, turns });
}

function hasEffect(list: TemporaryEffect[], id: TemporaryEffectId): boolean {
  return list.some((effect) => effect.id === id && effect.turns > 0);
}

function actionLabel(action: AdvancedCombatAction): string {
  if (action === 'counter') return 'Der trockene Konter';
  if (action === 'guard') return 'Die Campingstuhl-Blockade';
  return 'Der Team-Zuruf';
}

function statusClause(snapshot: GameSnapshot): string {
  if (snapshot.needs.alcohol >= 68) return 'Der Pegel liefert Kraft, aber keine Feinmotorik.';
  if (snapshot.needs.alcohol >= 38) return 'Betrunken: kräftiger, unpräziser.';
  if (snapshot.needs.highness >= 60) return 'Breit: Die Reaktion kommt mit Verzögerung.';
  if (snapshot.needs.hangover >= 35) return 'Kater: Jede Runde kostet sichtbar Substanz.';
  return 'Zustand stabil.';
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

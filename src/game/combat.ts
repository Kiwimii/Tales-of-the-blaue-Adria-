import { calculateChallengeChance, totalTeamBonus } from './mechanics';
import type { GameSnapshot } from './types';

export type CombatAction = 'counter' | 'guard' | 'rally';

export interface CombatState {
  playerResolve: number;
  playerMaxResolve: number;
  enemyResolve: number;
  enemyMaxResolve: number;
  round: number;
}

export interface CombatRound {
  state: CombatState;
  playerDamage: number;
  enemyDamage: number;
  healed: number;
  playerHit: boolean;
  log: string;
  finished: 'victory' | 'defeat' | null;
}

export function createCombatState(snapshot: GameSnapshot): CombatState {
  const team = totalTeamBonus(snapshot.team, 'battle');
  const max = Math.round(76 + snapshot.metrics.dignity * 0.16 + team * 2);
  return {
    playerResolve: max,
    playerMaxResolve: max,
    enemyResolve: 78,
    enemyMaxResolve: 78,
    round: 1,
  };
}

export function resolveCombatRound(
  current: CombatState,
  action: CombatAction,
  snapshot: GameSnapshot,
  random: () => number = Math.random,
): CombatRound {
  const next = { ...current, round: current.round + 1 };
  const battleBonus = totalTeamBonus(snapshot.team, 'battle');
  const recoveryBonus = totalTeamBonus(snapshot.team, 'recovery');
  const chance = calculateChallengeChance(snapshot, {
    skill: action === 'rally' ? 'teamwork' : 'nerve',
    baseChance: action === 'guard' ? 86 : action === 'rally' ? 80 : 73,
    relation: 'ronny',
  });
  const playerHit = Math.floor(random() * 100) + 1 <= chance;

  let playerDamage = 0;
  let healed = 0;
  if (playerHit) {
    if (action === 'counter') playerDamage = Math.round(15 + random() * 8 + battleBonus * 0.8);
    if (action === 'guard') playerDamage = Math.round(7 + random() * 5 + battleBonus * 0.35);
    if (action === 'rally') {
      playerDamage = Math.round(4 + battleBonus * 0.3);
      healed = Math.round(10 + recoveryBonus * 1.2);
      next.playerResolve = Math.min(next.playerMaxResolve, next.playerResolve + healed);
    }
    next.enemyResolve = Math.max(0, next.enemyResolve - playerDamage);
  }

  if (next.enemyResolve <= 0) {
    return {
      state: next,
      playerDamage,
      enemyDamage: 0,
      healed,
      playerHit,
      log: playerHit
        ? `Der ${actionLabel(action)} sitzt. Ronny verliert ${playerDamage} Fassung.`
        : 'Der Versuch verpufft.',
      finished: 'victory',
    };
  }

  const baseRetaliation = 10 + random() * 8 + snapshot.metrics.chaos * 0.04;
  const enemyDamage = Math.round(baseRetaliation * (action === 'guard' ? 0.45 : 1));
  next.playerResolve = Math.max(0, next.playerResolve - enemyDamage);

  const actionText = playerHit
    ? `${actionLabel(action)}: ${playerDamage} Schaden${healed ? `, ${healed} Fassung zurück` : ''}.`
    : `${actionLabel(action)} geht daneben.`;
  const log = `${actionText} Ronnys Vortrag kostet dich ${enemyDamage} Fassung.`;

  return {
    state: next,
    playerDamage,
    enemyDamage,
    healed,
    playerHit,
    log,
    finished: next.playerResolve <= 0 ? 'defeat' : null,
  };
}

function actionLabel(action: CombatAction): string {
  if (action === 'counter') return 'trockene Konter';
  if (action === 'guard') return 'Campingstuhl-Blockade';
  return 'Team-Zuruf';
}

import type {
  ChallengeDefinition,
  ChallengeOutcome,
  GameSnapshot,
  Needs,
  SessionState,
  Skill,
  TeamBonuses,
  Trait,
} from './types';

const traitSkill: Record<Trait, Skill> = {
  charmant: 'charm',
  direkt: 'nerve',
  chaotisch: 'chaos',
  hilfsbereit: 'teamwork',
  beobachtend: 'focus',
};

const skillTeamBonus: Record<Skill, keyof TeamBonuses> = {
  charm: 'social',
  nerve: 'battle',
  focus: 'recovery',
  chaos: 'games',
  teamwork: 'social',
};

export interface ChallengeResolution {
  chance: number;
  roll: number;
  outcome: ChallengeOutcome;
  margin: number;
}

export interface Point {
  x: number;
  y: number;
}

/**
 * Builds the Beer Pong aiming path around the active cup.
 *
 * The horizontal sweep always crosses the target's x coordinate and the
 * vertical wave is zero at that exact point. Every cup is therefore reachable
 * even when alcohol increases the amount of sway.
 */
export function beerPongReticlePosition(progress: number, target: Point, alcohol: number): Point {
  const boundedProgress = clamp(progress, 0, 1);
  const minX = 255;
  const maxX = 705;
  const x = minX + boundedProgress * (maxX - minX);
  const sway = clamp(22 + alcohol * 0.16, 22, 38);
  const relativeX = (x - target.x) / (maxX - minX);
  const y = target.y + Math.sin(relativeX * Math.PI * 4) * sway;
  return { x, y };
}

export function calculateChallengeChance(
  state: Pick<SessionState, 'profile' | 'needs' | 'metrics' | 'relationships' | 'team'>,
  challenge: ChallengeDefinition,
): number {
  let chance = challenge.baseChance;

  if (state.profile && traitSkill[state.profile.trait] === challenge.skill) chance += 13;

  chance += conditionModifier(state.needs, challenge.skill);
  chance += Math.round(state.metrics.momentum * 0.18);
  chance += Math.round((state.metrics.dignity - 50) * 0.06);

  if (challenge.relation) {
    chance += Math.round((state.relationships[challenge.relation] ?? 0) * 0.12);
  }

  const teamBonus = state.team.reduce(
    (sum, member) => sum + member.bonuses[skillTeamBonus[challenge.skill]] * loyaltyFactor(member.loyalty),
    0,
  );
  chance += Math.round(Math.min(12, teamBonus));

  return clamp(Math.round(chance), 5, 95);
}

export function resolveChallenge(
  state: Pick<SessionState, 'profile' | 'needs' | 'metrics' | 'relationships' | 'team'>,
  challenge: ChallengeDefinition,
  roll = Math.floor(Math.random() * 100) + 1,
): ChallengeResolution {
  const chance = calculateChallengeChance(state, challenge);
  const boundedRoll = clamp(Math.round(roll), 1, 100);
  const margin = chance - boundedRoll;

  let outcome: ChallengeOutcome;
  if (margin >= 22) outcome = 'great';
  else if (margin >= 0) outcome = 'success';
  else if (margin <= -25) outcome = 'disaster';
  else outcome = 'failure';

  return { chance, roll: boundedRoll, outcome, margin };
}

export function conditionModifier(needs: Needs, skill: Skill): number {
  let modifier = 0;
  if (needs.energy < 55) modifier -= (55 - needs.energy) * 0.22;
  if (needs.hunger > 55) modifier -= (needs.hunger - 55) * 0.16;
  if (needs.thirst > 50) modifier -= (needs.thirst - 50) * 0.2;
  if (needs.bladder > 68) modifier -= (needs.bladder - 68) * 0.2;
  modifier -= needs.hangover * 0.13;

  if (needs.alcohol >= 12 && needs.alcohol <= 34 && (skill === 'nerve' || skill === 'charm')) modifier += 5;
  if (needs.alcohol > 45) modifier -= (needs.alcohol - 45) * (skill === 'chaos' ? 0.05 : 0.2);
  if (needs.highness > 35) modifier += skill === 'chaos' ? 4 : -(needs.highness - 35) * 0.1;
  modifier += (needs.courage - 20) * (skill === 'nerve' ? 0.14 : 0.05);

  return Math.round(modifier);
}

export function performanceCondition(needs: Needs): string {
  const pressure =
    Math.max(0, 45 - needs.energy)
    + Math.max(0, needs.hunger - 65)
    + Math.max(0, needs.thirst - 60)
    + Math.max(0, needs.bladder - 72)
    + needs.hangover * 0.7;

  if (pressure >= 95) return 'Kurz vorm Kontrollverlust';
  if (pressure >= 55) return 'Deutlich angeschlagen';
  if (pressure >= 25) return 'Leicht unter Druck';
  if (needs.alcohol >= 12 && needs.alcohol <= 34) return 'Mutiges Zeitfenster';
  return 'Stabil';
}

export function minigameWindow(state: GameSnapshot, phase: 'drink' | 'flip'): number {
  const base = phase === 'drink' ? 18 : 12;
  const team = state.team.reduce((sum, member) => sum + member.bonuses.games * loyaltyFactor(member.loyalty), 0);
  const focus = Math.max(-7, Math.min(5, conditionModifier(state.needs, 'focus') * 0.28));
  const trait = state.profile?.trait === 'beobachtend' ? 3 : state.profile?.trait === 'chaotisch' ? 1 : 0;
  return clamp(Math.round(base + Math.min(6, team) + focus + trait), 6, 28);
}

export function minigameAttempts(state: GameSnapshot): number {
  const support = state.team.reduce((sum, member) => sum + member.bonuses.games, 0);
  return clamp(3 + Math.floor(support / 5), 3, 5);
}

export function totalTeamBonus(team: SessionState['team'], key: keyof TeamBonuses): number {
  return team.reduce((sum, member) => sum + member.bonuses[key] * loyaltyFactor(member.loyalty), 0);
}

function loyaltyFactor(loyalty: number): number {
  return clamp(loyalty, 20, 100) / 100;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

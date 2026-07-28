import type { CombatMoveId, GameSnapshot, FrustrationStatusId } from '../../game/types';
import { COMBAT_MOVES, COMBAT_OPPONENTS, type CombatOpponentId } from '../../game/combatMoves';
import { statusModifiers } from '../../game/statusSystem';

export interface TimedBattleStatus {
  id: FrustrationStatusId;
  turns: number;
}

export interface BattleFighterState {
  frustration: number;
  maxFrustration: number;
  statuses: TimedBattleStatus[];
  guard: number;
}

export interface BattleState {
  opponentId: CombatOpponentId;
  round: number;
  player: BattleFighterState;
  enemy: BattleFighterState;
  log: string[];
  finished: boolean;
  won: boolean;
  lastMove?: CombatMoveId;
  combo: number;
}

export interface BattleTurnResult {
  state: BattleState;
  hit: boolean;
  playerDamage: number;
  counterDamage: number;
  playerLine: string;
  enemyLine: string;
  critical: boolean;
  animation: 'talk' | 'wave' | 'drink' | 'sit' | 'cheer' | 'stagger' | 'hit' | 'carry';
}

export function createBattle(opponentId: CombatOpponentId): BattleState {
  const opponent = COMBAT_OPPONENTS[opponentId];
  return {
    opponentId,
    round: 1,
    player: { frustration: 0, maxFrustration: 100, statuses: [], guard: 1 },
    enemy: { frustration: 0, maxFrustration: opponent.maxFrustration, statuses: [], guard: 1 },
    log: [`${opponent.name} eröffnet den Frustkampf. Körperliche Gewalt wäre einfacher, ist aber deutlich schlechter für die Platzordnung.`],
    finished: false,
    won: false,
    combo: 0,
  };
}

export function resolveBattleTurn(
  current: BattleState,
  moveId: CombatMoveId,
  snapshot: GameSnapshot,
  teamSize: number,
  random: () => number = Math.random,
): BattleTurnResult {
  if (current.finished) return emptyResult(current);
  const state = structuredClone(current);
  const move = COMBAT_MOVES[moveId];
  const opponent = COMBAT_OPPONENTS[state.opponentId];
  const modifiers = statusModifiers(snapshot.needs);
  const focusBonus = statusValue(state.player.statuses, 'fokussiert') ? 8 : 0;
  const staggerPenalty = statusValue(state.player.statuses, 'unterbrochen') ? 9 : 0;
  const enemyOpen = statusValue(state.enemy.statuses, 'ueberrumpelt') || statusValue(state.enemy.statuses, 'verwirrt') || statusValue(state.enemy.statuses, 'fixiert');
  const accuracy = clamp(move.accuracy + modifiers.accuracy + focusBonus - staggerPenalty + (enemyOpen ? 6 : 0), 10, 100);
  const roll = random() * 100;
  const hit = roll <= accuracy;
  const critical = hit && roll <= Math.max(4, accuracy * 0.12);

  let playerDamage = 0;
  let counterDamage = 0;
  let playerLine = missLine(moveId, snapshot);
  let enemyLine = '';
  const tagMultiplier = opponent.tagMultipliers[move.tag] ?? 1;
  const moveMultiplier = opponent.moveMultipliers[moveId] ?? 1;
  const teamMultiplier = move.tag === 'team' ? 1 + Math.max(0, teamSize - 1) * 0.24 : 1 + Math.max(0, teamSize - 1) * 0.04;
  const repeatPenalty = state.lastMove === moveId ? Math.max(0.58, 1 - state.combo * 0.12) : 1;

  if (hit) {
    playerDamage = Math.max(1, Math.round(
      move.baseFrustration
      * modifiers.power
      * tagMultiplier
      * moveMultiplier
      * teamMultiplier
      * repeatPenalty
      * (critical ? 1.45 : 1),
    ));
    if (statusValue(state.enemy.statuses, 'fremdschaemen') && move.tag === 'style') playerDamage += 8;
    if (statusValue(state.enemy.statuses, 'leerlauf') && move.tag === 'submission') playerDamage += 6;
    state.enemy.frustration = clamp(state.enemy.frustration + playerDamage, 0, state.enemy.maxFrustration);
    if (move.selfRelief) state.player.frustration = clamp(state.player.frustration - move.selfRelief, 0, state.player.maxFrustration);
    if (move.guardMultiplier) state.player.guard = move.guardMultiplier;
    if (move.status) addStatus(move.status.target === 'enemy' ? state.enemy : state.player, move.status.id, move.status.turns);
    state.combo = state.lastMove === moveId ? state.combo + 1 : 0;
    playerLine = attackLine(moveId, critical, teamSize);
  } else {
    state.combo = 0;
  }

  const enemyDisabled = statusValue(state.enemy.statuses, 'unterbrochen') || statusValue(state.enemy.statuses, 'leerlauf');
  if (!enemyDisabled && state.enemy.frustration < state.enemy.maxFrustration) {
    const conditionPressure = snapshot.needs.hangover * 0.055 + snapshot.needs.thirst * 0.035 + Math.max(0, 30 - snapshot.needs.energy) * 0.12;
    const statusDefense = statusValue(state.player.statuses, 'abgesichert') ? 0.62 : 1;
    counterDamage = Math.max(1, Math.round(
      (opponent.baseCounterFrustration + conditionPressure + state.round * 0.6)
      * modifiers.defense ** -1
      * state.player.guard
      * statusDefense,
    ));
    state.player.frustration = clamp(state.player.frustration + counterDamage, 0, state.player.maxFrustration);
    enemyLine = opponent.counterLines[(state.round + Math.floor(random() * opponent.counterLines.length)) % opponent.counterLines.length];
  } else {
    enemyLine = enemyDisabled
      ? `${opponent.name} setzt zum Gegenzug an, findet aber den eigenen Satzanfang nicht mehr.`
      : `${opponent.name} ist zu frustriert für einen geordneten Gegenzug.`;
  }

  state.player.guard = 1;
  tickStatuses(state.player);
  tickStatuses(state.enemy);
  state.lastMove = moveId;
  state.round += 1;

  if (state.enemy.frustration >= state.enemy.maxFrustration) {
    state.finished = true;
    state.won = true;
    enemyLine = state.opponentId === 'entry-authority'
      ? 'Gundula schließt das Klemmbrett. Uli öffnet die Schranke, als wäre sie versehentlich deiner Argumentation erlegen.'
      : 'Ronny sagt zum ersten Mal nichts. Auf dem Campingplatz wird dieser Moment später mehrfach falsch zitiert.';
  } else if (state.player.frustration >= state.player.maxFrustration) {
    state.finished = true;
    state.won = false;
    playerLine = 'Deine Frustration erreicht 100. Du ziehst dich zurück, bevor du anfängst, die Platzordnung auswendig zu widerlegen.';
  }

  state.log.push(`${playerLine} ${hit ? `+${playerDamage} Frust.` : 'Kein Treffer.'}`);
  if (enemyLine) state.log.push(`${enemyLine}${counterDamage ? ` +${counterDamage} Frust.` : ''}`);
  state.log = state.log.slice(-8);

  return {
    state,
    hit,
    playerDamage,
    counterDamage,
    playerLine,
    enemyLine,
    critical,
    animation: animationForMove(moveId, hit),
  };
}

export function battlePrediction(moveId: CombatMoveId, state: BattleState, snapshot: GameSnapshot, teamSize: number): string {
  const move = COMBAT_MOVES[moveId];
  const opponent = COMBAT_OPPONENTS[state.opponentId];
  const modifiers = statusModifiers(snapshot.needs);
  const accuracy = clamp(move.accuracy + modifiers.accuracy, 10, 100);
  const multiplier = (opponent.moveMultipliers[moveId] ?? 1) * (opponent.tagMultipliers[move.tag] ?? 1);
  const team = move.tag === 'team' ? ` · ${Math.max(1, teamSize)} Teammitglieder wirken mit` : '';
  return `${accuracy}% Treffer · Wirkung ${multiplier >= 1.2 ? 'sehr gut' : multiplier <= 0.7 ? 'schwach' : 'normal'}${team}`;
}

function attackLine(id: CombatMoveId, critical: boolean, teamSize: number): string {
  const prefix = critical ? 'Volltreffer: ' : '';
  const lines: Record<CombatMoveId, string> = {
    'classic-high-five': 'Du hältst die Hand hoch und stimmst unangemessen begeistert zu. Die Gegenseite hatte auf Widerstand trainiert.',
    'aldi-shirt-show': 'Du präsentierst das Aldi-Shirt mit der Würde eines Mannes, der keine Markenrechte zu verlieren hat.',
    'agree-anyway': 'Du gibst vollständig recht. Die Verwaltung verliert den emotionalen Treibstoff für ihre Widerlegung.',
    'logical-argument': 'Du baust ein Argument mit Anfang, Mitte und überprüfbarer Schlussfolgerung. Auf dem Platz gilt das als exotisch.',
    'dry-counter': 'Ein kurzer Satz beendet rückwirkend die letzten drei Minuten gegnerischer Redezeit.',
    'camping-chair-block': 'Du setzt dich. Der Campingstuhl übernimmt Verteidigung und moralische Bewertung.',
    'beer-offer': 'Du bietest ein Bier an. Die konkrete Frage unterbricht den Konflikt wirksamer als Vernunft.',
    'synchronised-cheer': `${teamSize} Stimmen setzen gleichzeitig ein. Es klingt organisiert, obwohl niemand geprobt hat.`,
    'cup-eye-contact': 'Du hältst Blickkontakt, während ein imaginärer Becher fällt. Charme und Irritation treffen gleichzeitig.',
    'total-exaggeration': 'Du erklärst den Vorgang zum historischen Wendepunkt. Niemand kann schnell genug beweisen, dass er keiner ist.',
  };
  return `${prefix}${lines[id]}`;
}

function missLine(id: CombatMoveId, snapshot: GameSnapshot): string {
  if (snapshot.needs.alcohol >= 68) return 'Die Attacke beginnt stark, wechselt unterwegs das Thema und endet bei einer Geschichte aus 2019.';
  if (snapshot.needs.highness >= 70) return 'Die Attacke ist gedanklich hervorragend. Körperlich startet sie erst einige Sekunden später.';
  if (snapshot.needs.hangover >= 45) return 'Du setzt an. Dein Schädel legt formellen Widerspruch ein.';
  return `„${COMBAT_MOVES[id].shortLabel}“ verfehlt. Die Idee war besser als ihre Zustellung.`;
}

function animationForMove(id: CombatMoveId, hit: boolean): BattleTurnResult['animation'] {
  if (!hit) return 'stagger';
  const animations: Partial<Record<CombatMoveId, BattleTurnResult['animation']>> = {
    'classic-high-five': 'wave',
    'aldi-shirt-show': 'cheer',
    'agree-anyway': 'talk',
    'logical-argument': 'talk',
    'dry-counter': 'talk',
    'camping-chair-block': 'sit',
    'beer-offer': 'drink',
    'synchronised-cheer': 'cheer',
    'cup-eye-contact': 'carry',
    'total-exaggeration': 'cheer',
  };
  return animations[id] ?? 'talk';
}

function addStatus(fighter: BattleFighterState, id: FrustrationStatusId, turns: number): void {
  const existing = fighter.statuses.find((status) => status.id === id);
  if (existing) existing.turns = Math.max(existing.turns, turns);
  else fighter.statuses.push({ id, turns });
}

function tickStatuses(fighter: BattleFighterState): void {
  fighter.statuses = fighter.statuses
    .map((status) => ({ ...status, turns: status.turns - 1 }))
    .filter((status) => status.turns > 0);
}

function statusValue(statuses: TimedBattleStatus[], id: FrustrationStatusId): boolean {
  return statuses.some((status) => status.id === id && status.turns > 0);
}

function emptyResult(state: BattleState): BattleTurnResult {
  return { state, hit: false, playerDamage: 0, counterDamage: 0, playerLine: '', enemyLine: '', critical: false, animation: 'idle' as never };
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

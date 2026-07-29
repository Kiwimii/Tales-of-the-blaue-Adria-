import type { CombatMoveId, GameSnapshot, FrustrationStatusId } from '../../game/types';
import { COMBAT_MOVES, COMBAT_OPPONENTS, type CombatMoveTag, type CombatOpponentProfile } from '../../game/combatMoves';
import { statusModifiers } from '../../game/statusSystem';
import { ANECDOTES, COMPANION_ACTIONS, comboBonus, masteryAccuracy, masteryPower, opponentPhase, phaseMultiplier, type AnecdoteId, type CombatProgressionContext } from './progression';
import {
  absurdAttackLine,
  authorityBattleIntro,
  authorityCounterMultiplier,
  authorityEnemyAttackLine,
  authorityOpeningFrustration,
  authorityPlayerPowerMultiplier,
  authorityVictoryLine,
  installAuthorityOverhaul,
} from './authorityOverhaul';

installAuthorityOverhaul();

export type CampaignOpponentId = keyof typeof COMBAT_OPPONENTS | 'sunday-inspection';
export const CAMPAIGN_OPPONENTS: Record<CampaignOpponentId, CombatOpponentProfile> = {
  ...COMBAT_OPPONENTS,
  'sunday-inspection': {
    id: 'entry-authority', name: 'Gundula, Uli & die letzte Runde', title: 'Sonntagsabnahme mit Restalkohol und Kautionsmacht', maxFrustration: 165,
    traits: ['verkatert', 'nachtragend', 'leicht zu schmeicheln', 'kautionsnah'], baseCounterFrustration: 19,
    moveMultipliers: { 'classic-high-five': 1.12, 'aldi-shirt-show': 1.08, 'agree-anyway': 1.16, 'logical-argument': .88, 'dry-counter': 1.2, 'camping-chair-block': 1.05, 'beer-offer': 1.28, 'synchronised-cheer': 1.32, 'cup-eye-contact': 1.24, 'total-exaggeration': 1.34 },
    tagMultipliers: { team: 1.2, logic: .9, wit: 1.16, drink: 1.2, rapport: 1.16, submission: 1.18, chaos: 1.2 },
    counterLines: ['GUNDULAS KAUTIONS-BLICK: Sie schaut auf einen Fleck und dann auf dich, obwohl beides keinen Zusammenhang hat.', 'ULIS SONNTAGS-NACKENKLATSCHER: Er nennt dich Sportsfreund und zählt Schäden auf, die vermutlich aus den Neunzigern stammen.', 'RESTALKOHOL-PROTOKOLL: Beide erinnern sich gleichzeitig unterschiedlich und schreiben trotzdem dieselbe Nachforderung auf.'],
  },
};
export interface TimedBattleStatus { id: FrustrationStatusId; turns: number; }
export interface BattleFighterState { frustration: number; maxFrustration: number; statuses: TimedBattleStatus[]; guard: number; }
export interface BattleState {
  opponentId: CampaignOpponentId; round: number; player: BattleFighterState; enemy: BattleFighterState; log: string[]; finished: boolean; won: boolean;
  lastMove?: CombatMoveId; lastTag?: CombatMoveTag; adaptation: Partial<Record<CombatMoveId, number>>; momentum: number; phaseId: string; phaseLabel: string;
  usedAnecdotes: AnecdoteId[]; usedCompanions: string[]; nextAccuracyBonus: number; nextPowerMultiplier: number; nextCounterMultiplier: number; retryReady: boolean;
}
export interface BattleTurnResult { state: BattleState; hit: boolean; playerDamage: number; counterDamage: number; playerLine: string; enemyLine: string; critical: boolean; comboLabel: string; momentumGained: number; animation: 'talk' | 'wave' | 'drink' | 'sit' | 'cheer' | 'stagger' | 'hit' | 'carry'; }
export interface CompanionResult { state: BattleState; text: string; animation: BattleTurnResult['animation']; }

const EMPTY_CONTEXT: CombatProgressionContext = { momentumStart: 0, attackMastery: {}, anecdotes: [], activeTeam: [], weekendRank: 'newcomer', flags: {} };
let runtimeContext: CombatProgressionContext = EMPTY_CONTEXT;
let activeState: BattleState | undefined;
let armedSignature: CombatMoveId | undefined;
export function setBattleProgressionContext(context: CombatProgressionContext): void { runtimeContext = structuredClone(context); }
export function currentCampaignBattle(): BattleState | undefined { return activeState; }
export function armSignatureAttack(id: CombatMoveId): void { armedSignature = id; }
export function applyActiveCompanion(id: string): CompanionResult | undefined {
  if (!activeState) return undefined;
  const result = useCompanionAction(activeState, id, runtimeContext);
  Object.assign(activeState, result.state);
  publishBattle(activeState);
  return result;
}

export function createBattle(opponentId: CampaignOpponentId, progression?: CombatProgressionContext): BattleState {
  const context = progression ?? runtimeContext; const opponent = CAMPAIGN_OPPONENTS[opponentId]; const gateBonus = context.anecdotes.includes('gate-opened') ? 10 : 0;
  const rankBonus = context.weekendRank === 'myth' ? 18 : context.weekendRank === 'legend' ? 12 : context.weekendRank === 'known' ? 7 : 0; const phase = opponentPhase(opponentId, 0);
  const momentumStart = clamp(context.momentumStart + (context.anecdotes.includes('all-at-once') && context.activeTeam.length ? 1 : 0), 0, 3);
  const authorityStart = authorityOpeningFrustration(opponentId, context.flags);
  const intro = authorityBattleIntro(opponentId, context.flags) || `${opponent.name} eröffnet den Frustkampf. Körperliche Gewalt wäre einfacher, aber deutlich schlechter für die Platzordnung.`;
  const manipulationLine = authorityStart > 0 ? `VORBEREITETE MANIPULATION: Ego, Wegbier und Kumpelrituale verursachen bereits ${authorityStart} Startfrust.` : '';
  activeState = { opponentId, round: 1, player: { frustration: 0, maxFrustration: 100 + gateBonus + rankBonus, statuses: [], guard: 1 }, enemy: { frustration: authorityStart, maxFrustration: opponent.maxFrustration, statuses: [], guard: 1 }, log: [intro, manipulationLine, ...context.anecdotes.slice(0, 2).map((id) => ANECDOTES[id].combatText)].filter(Boolean), finished: false, won: false, adaptation: {}, momentum: momentumStart, phaseId: phase.id, phaseLabel: phase.label, usedAnecdotes: [], usedCompanions: [], nextAccuracyBonus: 0, nextPowerMultiplier: 1, nextCounterMultiplier: 1, retryReady: false };
  publishBattle(activeState); return activeState;
}

export function resolveBattleTurn(current: BattleState, moveId: CombatMoveId, snapshot: GameSnapshot, teamSize: number, progression?: CombatProgressionContext, signature = false, random: () => number = Math.random): BattleTurnResult {
  if (current.finished) return emptyResult(current);
  const context = progression ?? runtimeContext; signature = signature || armedSignature === moveId; armedSignature = undefined;
  const state = structuredClone(current); const move = COMBAT_MOVES[moveId]; const opponent = CAMPAIGN_OPPONENTS[state.opponentId]; const modifiers = statusModifiers(snapshot.needs); const mastery = context.attackMastery[moveId]; const repetition = state.adaptation[moveId] ?? 0;
  const phase = opponentPhase(state.opponentId, state.enemy.frustration / state.enemy.maxFrustration); const phaseChanged = phase.id !== state.phaseId; state.phaseId = phase.id; state.phaseLabel = phase.label;
  const combo = comboBonus(state.lastTag, move.tag); const focusBonus = statusValue(state.player.statuses, 'fokussiert') ? 8 : 0; const staggerPenalty = statusValue(state.player.statuses, 'unterbrochen') ? 9 : 0; const enemyOpen = statusValue(state.enemy.statuses, 'ueberrumpelt') || statusValue(state.enemy.statuses, 'verwirrt') || statusValue(state.enemy.statuses, 'fixiert'); const adaptationPenalty = repetition === 0 ? 0 : repetition === 1 ? 8 : repetition === 2 ? 18 : 35;
  let anecdoteAccuracy = 0; if (context.anecdotes.includes('masl-tunnel') && !state.usedAnecdotes.includes('masl-tunnel') && move.accuracy < 82) { anecdoteAccuracy = 15; state.usedAnecdotes.push('masl-tunnel'); }
  let accuracy = clamp(move.accuracy + modifiers.accuracy + masteryAccuracy(mastery) + focusBonus + state.nextAccuracyBonus + anecdoteAccuracy - staggerPenalty - adaptationPenalty + (enemyOpen ? 6 : 0), 8, 99);
  if (signature && mastery?.level === 3 && state.momentum >= 2) { accuracy = clamp(accuracy + 6, 8, 99); state.momentum -= 2; } else signature = false;
  let roll = random() * 100; let hit = roll <= accuracy; if (!hit && state.retryReady) { state.retryReady = false; roll = random() * 100; hit = roll <= accuracy; } const critical = hit && roll <= Math.max(4, accuracy * (signature ? .2 : .12));
  let playerDamage = 0, counterDamage = 0, playerLine = missLine(moveId, snapshot), enemyLine = '';
  const tagMultiplier = opponent.tagMultipliers[move.tag] ?? 1; let moveMultiplier = opponent.moveMultipliers[moveId] ?? 1;
  if (moveMultiplier < .84 && context.anecdotes.includes('bank-shot') && !state.usedAnecdotes.includes('bank-shot')) { moveMultiplier = 1; state.usedAnecdotes.push('bank-shot'); }
  const phasePower = phaseMultiplier(state.opponentId, phase.id, move.tag); const teamMultiplier = move.tag === 'team' ? 1 + Math.max(0, teamSize - 1) * .24 : 1 + Math.max(0, teamSize - 1) * .04; const repeatMultiplier = repetition === 0 ? 1 : repetition === 1 ? .85 : repetition === 2 ? .65 : .35;
  const anecdotePower = context.anecdotes.includes('lost-thread') && (move.tag === 'logic' || move.tag === 'wit') ? 1.1 : context.anecdotes.includes('gundula-noted') && move.tag === 'chaos' ? 1.22 : 1; const signaturePower = signature ? 1.38 : 1;
  const authorityPower = authorityPlayerPowerMultiplier(state.opponentId, moveId, move.tag, snapshot, context.flags);
  if (hit) {
    playerDamage = Math.max(1, Math.round(move.baseFrustration * modifiers.power * masteryPower(mastery) * tagMultiplier * moveMultiplier * phasePower * combo.multiplier * teamMultiplier * repeatMultiplier * anecdotePower * signaturePower * authorityPower * state.nextPowerMultiplier * (critical ? 1.45 : 1)));
    if (statusValue(state.enemy.statuses, 'fremdschaemen') && move.tag === 'style') playerDamage += 8; if (statusValue(state.enemy.statuses, 'leerlauf') && (move.tag === 'wit' || move.tag === 'submission')) playerDamage += 7;
    state.enemy.frustration = clamp(state.enemy.frustration + playerDamage, 0, state.enemy.maxFrustration); if (move.selfRelief) state.player.frustration = clamp(state.player.frustration - move.selfRelief, 0, state.player.maxFrustration); if (move.guardMultiplier) state.player.guard = move.guardMultiplier; if (move.status) addStatus(move.status.target === 'enemy' ? state.enemy : state.player, move.status.id, move.status.turns + (mastery?.branch === 'control' ? 1 : 0)); playerLine = attackLine(moveId, critical, teamSize, signature);
  }
  let momentumGained = 0; if (hit && repetition === 0) momentumGained += 1; if (hit && combo.multiplier > 1) momentumGained += 1; if (hit && phasePower >= 1.18) momentumGained += 1; if (hit && authorityPower >= 1.3) momentumGained += 1; if (critical) momentumGained += 1; const oldMomentum = state.momentum; state.momentum = clamp(state.momentum + momentumGained, 0, 3); momentumGained = state.momentum - oldMomentum;
  const enemyDisabled = statusValue(state.enemy.statuses, 'unterbrochen') || statusValue(state.enemy.statuses, 'leerlauf');
  if (!enemyDisabled && state.enemy.frustration < state.enemy.maxFrustration) {
    const conditionPressure = snapshot.needs.hangover * .055 + snapshot.needs.thirst * .035 + Math.max(0, 30 - snapshot.needs.energy) * .12; const statusDefense = statusValue(state.player.statuses, 'abgesichert') ? .62 : 1; const chaosRisk = context.anecdotes.includes('gundula-noted') ? 1.12 : 1; const authorityCounter = authorityCounterMultiplier(state.opponentId, snapshot, context.flags);
    counterDamage = Math.max(1, Math.round((opponent.baseCounterFrustration + conditionPressure + state.round * .6) * modifiers.defense ** -1 * state.player.guard * statusDefense * state.nextCounterMultiplier * chaosRisk * authorityCounter));
    if (context.anecdotes.includes('stop-means-stop') && !state.usedAnecdotes.includes('stop-means-stop') && counterDamage >= 10) { counterDamage = 0; state.usedAnecdotes.push('stop-means-stop'); enemyLine = ANECDOTES['stop-means-stop'].combatText; }
    else { state.player.frustration = clamp(state.player.frustration + counterDamage, 0, state.player.maxFrustration); enemyLine = authorityEnemyAttackLine(state.opponentId, state.round, phase.id, context.flags, random) || opponent.counterLines[(state.round + Math.floor(random() * opponent.counterLines.length)) % opponent.counterLines.length]; }
  } else enemyLine = enemyDisabled ? `${opponent.name} findet den eigenen Satzanfang nicht mehr.` : `${opponent.name} ist zu frustriert für einen geordneten Gegenzug.`;
  state.player.guard = 1; state.nextAccuracyBonus = 0; state.nextPowerMultiplier = 1; state.nextCounterMultiplier = 1; tickStatuses(state.player); tickStatuses(state.enemy); state.lastMove = moveId; state.lastTag = move.tag; state.adaptation[moveId] = repetition + 1; for (const id of Object.keys(state.adaptation) as CombatMoveId[]) if (id !== moveId) state.adaptation[id] = Math.max(0, (state.adaptation[id] ?? 0) - 1); state.round += 1;
  if (phaseChanged) state.log.push(`PHASENWECHSEL: ${phase.label}. ${phase.description}`);
  if (state.enemy.frustration >= state.enemy.maxFrustration) { state.finished = true; state.won = true; enemyLine = authorityVictoryLine(state.opponentId, context.flags) || (state.opponentId === 'ronny' ? 'Ronny sagt zum ersten Mal nichts.' : 'Die Gegenseite ist vollständig frustriert.'); }
  else if (state.player.frustration >= state.player.maxFrustration) { state.finished = true; state.won = false; playerLine = 'Deine Frustration erreicht das zulässige Maximum. Du ziehst dich zurück.'; }
  state.log.push(`${playerLine} ${hit ? `+${playerDamage} Frust.` : 'Kein Treffer.'}${authorityPower >= 1.3 ? ' SCHWACHSTELLE: EGO/KUMPELRITUAL.' : ''}${combo.label ? ` KOMBO: ${combo.label}.` : ''}${momentumGained ? ` +${momentumGained} Momentum.` : ''}`); if (enemyLine) state.log.push(`${enemyLine}${counterDamage ? ` +${counterDamage} Frust.` : ''}`); state.log = state.log.slice(-10);
  activeState = state; publishBattle(state);
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('lpc-campaign-attack-use', { detail: { id: moveId, success: hit } }));
  return { state, hit, playerDamage, counterDamage, playerLine, enemyLine, critical, comboLabel: combo.label, momentumGained, animation: animationForMove(moveId, hit) };
}

export function useCompanionAction(current: BattleState, companionId: string, progression: CombatProgressionContext): CompanionResult {
  const state = structuredClone(current), action = COMPANION_ACTIONS[companionId]; if (!action || state.finished || !progression.activeTeam.includes(companionId) || state.usedCompanions.includes(companionId) || state.momentum < action.momentum) return { state, text: 'Diese Begleiteraktion ist gerade nicht verfügbar.', animation: 'talk' };
  state.momentum -= action.momentum; state.usedCompanions.push(companionId); const text = `${action.label}: ${action.detail}`; let animation: CompanionResult['animation'] = 'talk';
  if (companionId === 'andre' || companionId === 'kira') state.nextAccuracyBonus += 15; else if (companionId === 'rene') { state.nextCounterMultiplier *= .45; animation = 'sit'; } else if (companionId === 'lars') { state.player.frustration = Math.max(0, state.player.frustration - 18); animation = 'drink'; } else if (companionId === 'danny') { state.nextAccuracyBonus += 9; state.nextPowerMultiplier *= 1.2; animation = 'wave'; } else if (companionId === 'masl') { state.nextPowerMultiplier *= 1.28; state.nextCounterMultiplier *= 1.2; animation = 'cheer'; } else if (companionId === 'felix') state.retryReady = true; else if (companionId === 'manni' || companionId === 'jule') { state.player.statuses = []; state.nextCounterMultiplier *= .55; animation = 'cheer'; } else if (companionId === 'susi') { addStatus(state.enemy, 'fixiert', 2); state.nextPowerMultiplier *= 1.12; animation = 'wave'; }
  state.log.push(text); state.log = state.log.slice(-10); return { state, text, animation };
}
export function battlePrediction(moveId: CombatMoveId, state: BattleState, snapshot: GameSnapshot, teamSize: number, progression?: CombatProgressionContext): string {
  const context = progression ?? runtimeContext, move = COMBAT_MOVES[moveId], opponent = CAMPAIGN_OPPONENTS[state.opponentId], modifiers = statusModifiers(snapshot.needs), repetition = state.adaptation[moveId] ?? 0;
  const accuracy = clamp(move.accuracy + modifiers.accuracy + masteryAccuracy(context.attackMastery[moveId]) - (repetition === 0 ? 0 : repetition === 1 ? 8 : repetition === 2 ? 18 : 35), 8, 99); const phase = opponentPhase(state.opponentId, state.enemy.frustration / state.enemy.maxFrustration); const authorityPower = authorityPlayerPowerMultiplier(state.opponentId, moveId, move.tag, snapshot, context.flags); const multiplier = (opponent.moveMultipliers[moveId] ?? 1) * (opponent.tagMultipliers[move.tag] ?? 1) * phaseMultiplier(state.opponentId, phase.id, move.tag) * comboBonus(state.lastTag, move.tag).multiplier * authorityPower; const team = move.tag === 'team' ? ` · ${Math.max(1, teamSize)} Personen` : ''; const mastery = context.attackMastery[moveId]; return `${accuracy}% · ${multiplier >= 1.55 ? 'Schwachstelle getroffen' : multiplier >= 1.25 ? 'sehr stark' : multiplier <= .72 ? 'schwach' : 'normal'} · M${mastery?.level ?? 1}${team}${repetition ? ` · Gewöhnung ${repetition}` : ''}`;
}
function publishBattle(state: BattleState): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('lpc-campaign-battle-state', { detail: structuredClone(state) }));
}
function attackLine(id: CombatMoveId, critical: boolean, teamSize: number, signature: boolean): string { const prefix = signature ? 'SIGNATUR: ' : critical ? 'VOLLTREFFER: ' : ''; return `${prefix}${absurdAttackLine(id, teamSize)}`; }
function missLine(id: CombatMoveId, snapshot: GameSnapshot): string { if (snapshot.needs.alcohol >= 68) return 'Die Attacke beginnt stark, trifft dann aber eine völlig andere Geschichte aus 2019.'; if (snapshot.needs.highness >= 70) return 'Die absurde Idee startet mehrere Sekunden vor der Körperbewegung.'; if (snapshot.needs.hangover >= 45) return 'Dein Schädel verweigert Nackenklatscher, Beer Pong und Beweisführung gleichzeitig.'; return `„${COMBAT_MOVES[id].shortLabel}“ verfehlt und wirkt kurz wie ein ernst gemeinter Vorschlag.`; }
function animationForMove(id: CombatMoveId, hit: boolean): BattleTurnResult['animation'] { if (!hit) return 'stagger'; return ({'classic-high-five':'hit','aldi-shirt-show':'cheer','agree-anyway':'talk','logical-argument':'carry','dry-counter':'talk','camping-chair-block':'sit','beer-offer':'drink','synchronised-cheer':'cheer','cup-eye-contact':'carry','total-exaggeration':'cheer'} as Partial<Record<CombatMoveId,BattleTurnResult['animation']>>)[id] ?? 'talk'; }
function addStatus(fighter: BattleFighterState,id:FrustrationStatusId,turns:number):void{const existing=fighter.statuses.find((status)=>status.id===id);if(existing)existing.turns=Math.max(existing.turns,turns);else fighter.statuses.push({id,turns})}
function tickStatuses(fighter:BattleFighterState):void{fighter.statuses=fighter.statuses.map((status)=>({...status,turns:status.turns-1})).filter((status)=>status.turns>0)}
function statusValue(statuses:TimedBattleStatus[],id:FrustrationStatusId):boolean{return statuses.some((status)=>status.id===id&&status.turns>0)}
function emptyResult(state:BattleState):BattleTurnResult{return{state,hit:false,playerDamage:0,counterDamage:0,playerLine:'',enemyLine:'',critical:false,comboLabel:'',momentumGained:0,animation:'talk'}}
function clamp(value:number,min:number,max:number):number{return Math.max(min,Math.min(max,value))}

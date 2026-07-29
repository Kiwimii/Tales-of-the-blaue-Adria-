import type { CombatMoveId, GameSnapshot, FrustrationStatusId } from '../../game/types';
import { COMBAT_MOVES, COMBAT_OPPONENTS, type CombatMoveTag, type CombatOpponentProfile } from '../../game/combatMoves';
import { statusModifiers } from '../../game/statusSystem';
import { ANECDOTES, COMPANION_ACTIONS, comboBonus, masteryAccuracy, masteryPower, opponentPhase, phaseMultiplier, type AnecdoteId, type CombatProgressionContext } from './progression';

export type CampaignOpponentId = keyof typeof COMBAT_OPPONENTS | 'sunday-inspection';
export const CAMPAIGN_OPPONENTS: Record<CampaignOpponentId, CombatOpponentProfile> = {
  ...COMBAT_OPPONENTS,
  'sunday-inspection': {
    id: 'entry-authority', name: 'Gundula, Uli & das Abschlussprotokoll', title: 'Sonntagsabnahme in drei Akten', maxFrustration: 165,
    traits: ['aktenfest', 'zeugenorientiert', 'kautionsnah'], baseCounterFrustration: 18,
    moveMultipliers: { 'classic-high-five': .78, 'aldi-shirt-show': 1.08, 'agree-anyway': .82, 'logical-argument': 1.18, 'dry-counter': 1.2, 'camping-chair-block': 1.05, 'beer-offer': .62, 'synchronised-cheer': 1.25, 'cup-eye-contact': 1.06, 'total-exaggeration': 1.16 },
    tagMultipliers: { team: 1.16, logic: 1.12, wit: 1.12, drink: .66 },
    counterLines: ['Gundula legt Fotos, Uhrzeiten und eine erstaunlich detaillierte Skizze der Hecke vor.', 'Uli nennt drei Schäden, von denen mindestens einer schon vorher da war. Das macht ihn nicht weniger sicher.', 'Das Abschlussprotokoll erhält eine weitere Seite. Papier ist der eigentliche Endgegner.'],
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
  const intro = opponentId === 'sunday-inspection' ? 'Sonntagmorgen. Gundula öffnet das Abschlussprotokoll, Uli prüft die Schranke und sämtliche Wochenendentscheidungen bilden eine gemeinsame Anklage.' : `${opponent.name} eröffnet den Frustkampf. Körperliche Gewalt wäre einfacher, aber deutlich schlechter für die Platzordnung.`;
  activeState = { opponentId, round: 1, player: { frustration: 0, maxFrustration: 100 + gateBonus + rankBonus, statuses: [], guard: 1 }, enemy: { frustration: 0, maxFrustration: opponent.maxFrustration, statuses: [], guard: 1 }, log: [intro, ...context.anecdotes.slice(0, 2).map((id) => ANECDOTES[id].combatText)], finished: false, won: false, adaptation: {}, momentum: momentumStart, phaseId: phase.id, phaseLabel: phase.label, usedAnecdotes: [], usedCompanions: [], nextAccuracyBonus: 0, nextPowerMultiplier: 1, nextCounterMultiplier: 1, retryReady: false };
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
  if (hit) {
    playerDamage = Math.max(1, Math.round(move.baseFrustration * modifiers.power * masteryPower(mastery) * tagMultiplier * moveMultiplier * phasePower * combo.multiplier * teamMultiplier * repeatMultiplier * anecdotePower * signaturePower * state.nextPowerMultiplier * (critical ? 1.45 : 1)));
    if (statusValue(state.enemy.statuses, 'fremdschaemen') && move.tag === 'style') playerDamage += 8; if (statusValue(state.enemy.statuses, 'leerlauf') && (move.tag === 'wit' || move.tag === 'submission')) playerDamage += 7;
    state.enemy.frustration = clamp(state.enemy.frustration + playerDamage, 0, state.enemy.maxFrustration); if (move.selfRelief) state.player.frustration = clamp(state.player.frustration - move.selfRelief, 0, state.player.maxFrustration); if (move.guardMultiplier) state.player.guard = move.guardMultiplier; if (move.status) addStatus(move.status.target === 'enemy' ? state.enemy : state.player, move.status.id, move.status.turns + (mastery?.branch === 'control' ? 1 : 0)); playerLine = attackLine(moveId, critical, teamSize, signature);
  }
  let momentumGained = 0; if (hit && repetition === 0) momentumGained += 1; if (hit && combo.multiplier > 1) momentumGained += 1; if (hit && phasePower >= 1.18) momentumGained += 1; if (critical) momentumGained += 1; const oldMomentum = state.momentum; state.momentum = clamp(state.momentum + momentumGained, 0, 3); momentumGained = state.momentum - oldMomentum;
  const enemyDisabled = statusValue(state.enemy.statuses, 'unterbrochen') || statusValue(state.enemy.statuses, 'leerlauf');
  if (!enemyDisabled && state.enemy.frustration < state.enemy.maxFrustration) {
    const conditionPressure = snapshot.needs.hangover * .055 + snapshot.needs.thirst * .035 + Math.max(0, 30 - snapshot.needs.energy) * .12; const statusDefense = statusValue(state.player.statuses, 'abgesichert') ? .62 : 1; const chaosRisk = context.anecdotes.includes('gundula-noted') ? 1.12 : 1;
    counterDamage = Math.max(1, Math.round((opponent.baseCounterFrustration + conditionPressure + state.round * .6) * modifiers.defense ** -1 * state.player.guard * statusDefense * state.nextCounterMultiplier * chaosRisk));
    if (context.anecdotes.includes('stop-means-stop') && !state.usedAnecdotes.includes('stop-means-stop') && counterDamage >= 10) { counterDamage = 0; state.usedAnecdotes.push('stop-means-stop'); enemyLine = ANECDOTES['stop-means-stop'].combatText; }
    else { state.player.frustration = clamp(state.player.frustration + counterDamage, 0, state.player.maxFrustration); enemyLine = opponent.counterLines[(state.round + Math.floor(random() * opponent.counterLines.length)) % opponent.counterLines.length]; }
  } else enemyLine = enemyDisabled ? `${opponent.name} findet den eigenen Satzanfang nicht mehr.` : `${opponent.name} ist zu frustriert für einen geordneten Gegenzug.`;
  state.player.guard = 1; state.nextAccuracyBonus = 0; state.nextPowerMultiplier = 1; state.nextCounterMultiplier = 1; tickStatuses(state.player); tickStatuses(state.enemy); state.lastMove = moveId; state.lastTag = move.tag; state.adaptation[moveId] = repetition + 1; for (const id of Object.keys(state.adaptation) as CombatMoveId[]) if (id !== moveId) state.adaptation[id] = Math.max(0, (state.adaptation[id] ?? 0) - 1); state.round += 1;
  if (phaseChanged) state.log.push(`PHASENWECHSEL: ${phase.label}. ${phase.description}`);
  if (state.enemy.frustration >= state.enemy.maxFrustration) { state.finished = true; state.won = true; enemyLine = state.opponentId === 'entry-authority' ? 'Gundula schließt das Klemmbrett. Uli öffnet die Schranke.' : state.opponentId === 'sunday-inspection' ? 'Das Abschlussprotokoll endet ohne Nachforderung. Die Kaution lebt.' : 'Ronny sagt zum ersten Mal nichts.'; }
  else if (state.player.frustration >= state.player.maxFrustration) { state.finished = true; state.won = false; playerLine = 'Deine Frustration erreicht das zulässige Maximum. Du ziehst dich zurück.'; }
  state.log.push(`${playerLine} ${hit ? `+${playerDamage} Frust.` : 'Kein Treffer.'}${combo.label ? ` KOMBO: ${combo.label}.` : ''}${momentumGained ? ` +${momentumGained} Momentum.` : ''}`); if (enemyLine) state.log.push(`${enemyLine}${counterDamage ? ` +${counterDamage} Frust.` : ''}`); state.log = state.log.slice(-10);
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
  const accuracy = clamp(move.accuracy + modifiers.accuracy + masteryAccuracy(context.attackMastery[moveId]) - (repetition === 0 ? 0 : repetition === 1 ? 8 : repetition === 2 ? 18 : 35), 8, 99); const phase = opponentPhase(state.opponentId, state.enemy.frustration / state.enemy.maxFrustration); const multiplier = (opponent.moveMultipliers[moveId] ?? 1) * (opponent.tagMultipliers[move.tag] ?? 1) * phaseMultiplier(state.opponentId, phase.id, move.tag) * comboBonus(state.lastTag, move.tag).multiplier; const team = move.tag === 'team' ? ` · ${Math.max(1, teamSize)} Personen` : ''; const mastery = context.attackMastery[moveId]; return `${accuracy}% · ${multiplier >= 1.25 ? 'sehr stark' : multiplier <= .72 ? 'schwach' : 'normal'} · M${mastery?.level ?? 1}${team}${repetition ? ` · Gewöhnung ${repetition}` : ''}`;
}
function publishBattle(state: BattleState): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('lpc-campaign-battle-state', { detail: structuredClone(state) }));
}
function attackLine(id: CombatMoveId, critical: boolean, teamSize: number, signature: boolean): string { const prefix = signature ? 'SIGNATUR: ' : critical ? 'Volltreffer: ' : ''; const lines: Record<CombatMoveId,string> = { 'classic-high-five':'Du hältst die Hand hoch und stimmst unangemessen begeistert zu.', 'aldi-shirt-show':'Du präsentierst das Aldi-Shirt mit maximalem Selbstbewusstsein.', 'agree-anyway':'Du gibst vollständig recht und entziehst dem Gegner den Widerstand.', 'logical-argument':'Du baust ein überprüfbares Argument. Auf dem Platz gilt das als exotisch.', 'dry-counter':'Ein kurzer Satz beendet rückwirkend drei Minuten Redezeit.', 'camping-chair-block':'Du setzt dich. Der Campingstuhl übernimmt die Verteidigung.', 'beer-offer':'Du bietest ein Bier an und unterbrichst den Konflikt mit einer konkreten Frage.', 'synchronised-cheer':`${teamSize} Stimmen setzen gleichzeitig ein.`, 'cup-eye-contact':'Du hältst Blickkontakt, während ein imaginärer Becher fällt.', 'total-exaggeration':'Du erklärst den Vorgang zum historischen Wendepunkt.' }; return `${prefix}${lines[id]}`; }
function missLine(id: CombatMoveId, snapshot: GameSnapshot): string { if (snapshot.needs.alcohol >= 68) return 'Die Attacke beginnt stark und endet bei einer Geschichte aus 2019.'; if (snapshot.needs.highness >= 70) return 'Die Idee startet vor der Körperbewegung.'; if (snapshot.needs.hangover >= 45) return 'Dein Schädel legt formellen Widerspruch ein.'; return `„${COMBAT_MOVES[id].shortLabel}“ verfehlt.`; }
function animationForMove(id: CombatMoveId, hit: boolean): BattleTurnResult['animation'] { if (!hit) return 'stagger'; return ({'classic-high-five':'wave','aldi-shirt-show':'cheer','agree-anyway':'talk','logical-argument':'talk','dry-counter':'talk','camping-chair-block':'sit','beer-offer':'drink','synchronised-cheer':'cheer','cup-eye-contact':'carry','total-exaggeration':'cheer'} as Partial<Record<CombatMoveId,BattleTurnResult['animation']>>)[id] ?? 'talk'; }
function addStatus(fighter: BattleFighterState,id:FrustrationStatusId,turns:number):void{const existing=fighter.statuses.find((status)=>status.id===id);if(existing)existing.turns=Math.max(existing.turns,turns);else fighter.statuses.push({id,turns})}
function tickStatuses(fighter:BattleFighterState):void{fighter.statuses=fighter.statuses.map((status)=>({...status,turns:status.turns-1})).filter((status)=>status.turns>0)}
function statusValue(statuses:TimedBattleStatus[],id:FrustrationStatusId):boolean{return statuses.some((status)=>status.id===id&&status.turns>0)}
function emptyResult(state:BattleState):BattleTurnResult{return{state,hit:false,playerDamage:0,counterDamage:0,playerLine:'',enemyLine:'',critical:false,comboLabel:'',momentumGained:0,animation:'talk'}}
function clamp(value:number,min:number,max:number):number{return Math.max(min,Math.min(max,value))}

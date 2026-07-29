import type { CombatMoveId } from '../../game/types';
import type { CombatMoveTag, CombatOpponentId } from '../../game/combatMoves';

export type ProgressionOpponentId = CombatOpponentId | 'sunday-inspection';
export type AttackBranch = 'impact' | 'control';
export type WeekendRankId = 'newcomer' | 'tolerated' | 'noticed' | 'known' | 'legend' | 'myth';
export type AnecdoteId = 'all-at-once' | 'bank-shot' | 'stop-means-stop' | 'masl-tunnel' | 'hedge-silent' | 'gundula-noted' | 'gate-opened' | 'lost-thread';
export interface AttackMasteryState { uses: number; successes: number; level: 1 | 2 | 3; branch?: AttackBranch; }
export interface AnecdoteDefinition { id: AnecdoteId; label: string; detail: string; combatText: string; }
export interface WeekendRankDefinition { id: WeekendRankId; label: string; minScore: number; attackSlots: number; companionSlots: number; }
export interface CombatProgressionContext { momentumStart: number; attackMastery: Partial<Record<CombatMoveId, AttackMasteryState>>; anecdotes: AnecdoteId[]; activeTeam: string[]; weekendRank: WeekendRankId; flags: Record<string, boolean>; }

export const WEEKEND_RANKS: WeekendRankDefinition[] = [
  { id: 'newcomer', label: 'Neuankömmling', minScore: -999, attackSlots: 2, companionSlots: 1 },
  { id: 'tolerated', label: 'Geduldet', minScore: 25, attackSlots: 3, companionSlots: 1 },
  { id: 'noticed', label: 'Auffällig', minScore: 65, attackSlots: 3, companionSlots: 2 },
  { id: 'known', label: 'Platzbekannt', minScore: 115, attackSlots: 4, companionSlots: 2 },
  { id: 'legend', label: 'Wochenendlegende', minScore: 175, attackSlots: 4, companionSlots: 3 },
  { id: 'myth', label: 'Mythos der Blauen Adria', minScore: 250, attackSlots: 4, companionSlots: 3 },
];
export const ANECDOTES: Record<AnecdoteId, AnecdoteDefinition> = {
  'all-at-once': { id: 'all-at-once', label: 'Alle gleichzeitig', detail: 'Eine perfekte Flip-Cup-Staffel. Kämpfe beginnen mit zusätzlichem Momentum, wenn ein Team aktiv ist.', combatText: 'Die Gruppe findet sofort denselben Rhythmus.' },
  'bank-shot': { id: 'bank-shot', label: 'Über Bande', detail: 'Ein riskanter Bounce-Wurf gewann die Partie. Einmal pro Kampf wird eine schwache Attacke normal wirksam.', combatText: 'Die Argumentation nimmt einen Umweg über den Tisch und trifft trotzdem.' },
  'stop-means-stop': { id: 'stop-means-stop', label: 'STOPP heißt Stopp', detail: 'Ein perfekter Flunkyball-Stoppruf. Einmal pro Kampf wird ein gegnerischer Konter vollständig abgebrochen.', combatText: 'Der Gegenzug endet exakt an der Linie.' },
  'masl-tunnel': { id: 'masl-tunnel', label: 'Masls Tunnel', detail: 'Das Loch wurde stabil gehalten. Einmal pro Kampf steigt die Präzision massiv.', combatText: 'Für einen Moment existieren nur Ziel, Loch und eine erstaunlich lange Sekunde.' },
  'hedge-silent': { id: 'hedge-silent', label: 'Die Hecke schweigt', detail: 'Vollständig erleichtert und unentdeckt. Einmal pro Kampf wird ein eigener negativer Zustand entfernt.', combatText: 'Die Situation wird diskret aus dem Protokoll entfernt.' },
  'gundula-noted': { id: 'gundula-noted', label: 'Gundula hat es notiert', detail: 'Erwischt und dokumentiert. Chaosattacken werden stärker, gegnerische Konter ebenfalls.', combatText: 'Die Akte ist ohnehin offen. Zurückhaltung wäre jetzt Verschwendung.' },
  'gate-opened': { id: 'gate-opened', label: 'Die Schranke ging auf', detail: 'Der erste Verwaltungsfrustkampf wurde gewonnen. Erhöht dauerhaft die eigene Frusttoleranz.', combatText: 'Du hast bereits eine Schranke argumentativ bewegt.' },
  'lost-thread': { id: 'lost-thread', label: 'Ronny verlor den roten Faden', detail: 'Ronny wurde bis zum Satzabbruch gebracht. Logik und trockener Witz wirken stärker.', combatText: 'Du erkennst den Moment, in dem ein Satz seine Richtung verliert.' },
};
export const COMPANION_ACTIONS: Record<string, { label: string; detail: string; momentum: number }> = {
  andre: { label: 'Trockene Analyse', detail: 'Erhöht die Präzision der nächsten Attacke.', momentum: 1 },
  rene: { label: 'Kurz planen', detail: 'Reduziert den nächsten gegnerischen Konter.', momentum: 1 },
  lars: { label: 'Stabilisieren', detail: 'Baut eigenen Frust ab.', momentum: 1 },
  danny: { label: 'Ablenkung', detail: 'Verstärkt eine riskante Attacke.', momentum: 1 },
  masl: { label: 'Sonderregel', detail: 'Verändert die aktuelle Runde radikal.', momentum: 2 },
  felix: { label: 'Flugbahn erklären', detail: 'Erlaubt bei einem Fehlschlag einen zweiten Versuch.', momentum: 1 },
  manni: { label: 'Sanitäre Perspektive', detail: 'Entfernt einen negativen Status.', momentum: 1 },
  susi: { label: 'Blickkontakt halten', detail: 'Fixiert den Gegner und verstärkt die nächste Teamattacke.', momentum: 1 },
  jule: { label: 'Klare Grenze', detail: 'Bricht einen gegnerischen Konter ab.', momentum: 1 },
  kira: { label: 'Beweisfoto', detail: 'Macht eine gegnerische Schwäche sichtbar.', momentum: 1 },
};
export function weekendRank(score: number): WeekendRankDefinition { return [...WEEKEND_RANKS].reverse().find((rank) => score >= rank.minScore) ?? WEEKEND_RANKS[0]; }
export function masteryLevel(uses: number, successes: number): 1 | 2 | 3 { if (successes >= 7 && uses >= 9) return 3; if (successes >= 3 && uses >= 4) return 2; return 1; }
export function masteryPower(state?: AttackMasteryState): number { if (!state) return 1; const level = state.level === 3 ? 1.22 : state.level === 2 ? 1.11 : 1; return state.branch === 'impact' ? level * 1.09 : level; }
export function masteryAccuracy(state?: AttackMasteryState): number { if (!state) return 0; const level = state.level === 3 ? 7 : state.level === 2 ? 4 : 0; return state.branch === 'control' ? level + 7 : level; }
export function branchLabel(branch?: AttackBranch): string { return branch === 'impact' ? 'Wirkung' : branch === 'control' ? 'Kontrolle' : 'Spezialisierung offen'; }
export function opponentPhase(opponentId: ProgressionOpponentId, enemyRatio: number): { id: string; label: string; description: string } {
  const phase = enemyRatio < .34 ? 1 : enemyRatio < .7 ? 2 : 3;
  if (opponentId === 'entry-authority') {
    if (phase === 1) return { id: 'schranken-gockel', label: 'Schranken-Gockelmodus', description: 'Gundula und Uli bauen sich grimmig auf. Ego, Zustimmung, Bier und kumpelhafte Nähe bringen sie schnell aus dem Konzept.' };
    if (phase === 2) return { id: 'angeschickerte-stichelei', label: 'Angeschickerte Stichelei', description: 'Der Ton wird persönlicher und pöbelnder. Witz, Teamdruck, Beer Pong und gemeinsame Feindbilder treffen besonders gut.' };
    return { id: 'gekraenkte-platzherrschaft', label: 'Gekränkte Platzherrschaft', description: 'Ihre Autorität kippt in lautes Aufspielen. Chaos, Gruppenspott und absurde Legenden zerstören den Rest der Fassade.' };
  }
  if (opponentId === 'ronny') { if (phase === 1) return { id: 'monologue', label: 'Monolog', description: 'Unterbrechung und trockener Witz treffen gut.' }; if (phase === 2) return { id: 'defense', label: 'Begriffsverteidigung', description: 'Logik und Fremdscham öffnen Lücken.' }; return { id: 'contradiction-collapse', label: 'Widerspruchskollaps', description: 'Logik-/Witzkombos können den Kampf beenden.' }; }
  if (phase === 1) return { id: 'inspection', label: 'Platzabnahme', description: 'Müll, Aufbau und offene Quests werden gegen dich verwendet.' };
  if (phase === 2) return { id: 'witnesses', label: 'Zeugenaussagen', description: 'Beziehungen, Ruf und Anekdoten entscheiden.' };
  return { id: 'deposit', label: 'Kaution und Abreise', description: 'Alle Folgen laufen im Abschlussprotokoll zusammen.' };
}
export function phaseMultiplier(opponentId: ProgressionOpponentId, phaseId: string, tag: CombatMoveTag): number {
  if (opponentId === 'entry-authority') {
    if (phaseId === 'schranken-gockel') return tag === 'rapport' || tag === 'submission' || tag === 'drink' ? 1.3 : tag === 'logic' ? .62 : 1;
    if (phaseId === 'angeschickerte-stichelei') return tag === 'team' || tag === 'charm' || tag === 'wit' || tag === 'drink' ? 1.24 : tag === 'logic' ? .75 : 1;
    return tag === 'chaos' || tag === 'team' || tag === 'charm' ? 1.36 : tag === 'guard' ? .82 : tag === 'logic' ? .7 : 1;
  }
  if (opponentId === 'ronny') { if (phaseId === 'monologue') return tag === 'wit' ? 1.25 : tag === 'submission' ? .72 : 1; if (phaseId === 'defense') return tag === 'logic' || tag === 'style' ? 1.2 : 1; return tag === 'logic' || tag === 'wit' ? 1.28 : tag === 'rapport' ? .75 : 1; }
  if (phaseId === 'inspection') return tag === 'logic' || tag === 'guard' ? 1.18 : tag === 'chaos' ? .72 : 1;
  if (phaseId === 'witnesses') return tag === 'team' || tag === 'rapport' || tag === 'charm' ? 1.24 : 1;
  return tag === 'wit' || tag === 'chaos' ? 1.22 : tag === 'submission' ? .8 : 1;
}
export function comboBonus(previousTag: CombatMoveTag | undefined, nextTag: CombatMoveTag): { multiplier: number; label: string } {
  if (previousTag === 'rapport' && nextTag === 'logic') return { multiplier: 1.16, label: 'NACKENKLATSCHER → BIERDECKEL' };
  if (previousTag === 'submission' && nextTag === 'wit') return { multiplier: 1.22, label: 'CHEF-RECHT → PÖBELKONTER' };
  if (previousTag === 'logic' && nextTag === 'wit') return { multiplier: 1.28, label: 'BIERDECKEL → EIN-WORT-KONTER' };
  if (previousTag === 'charm' && nextTag === 'team') return { multiplier: 1.3, label: 'PONG-DUELL → JAWOLL-CHEF-CHOR' };
  if (previousTag === 'guard' && nextTag === 'drink') return { multiplier: 1.17, label: 'BIERBANK → FRIEDENSBIER' };
  if (previousTag === 'team' && nextTag === 'chaos') return { multiplier: 1.26, label: 'PUBLIKUM → PLATZLEGENDE' };
  return { multiplier: 1, label: '' };
}

import type { CombatMoveId, GameSnapshot } from '../../game/types';
import { COMBAT_MOVES, STARTER_ATTACK } from '../../game/combatMoves';
import {
  ANECDOTES,
  masteryLevel,
  weekendRank,
  type AnecdoteId,
  type AttackBranch,
  type AttackMasteryState,
  type CombatProgressionContext,
  type WeekendRankId,
} from './progression';
import {
  defaultWeekendArcState,
  olympiadPoints,
  type OlympiadDisciplineId,
  type WeekendArcState,
} from './weekendArcModel';

export type RomanceId = 'susi' | 'jule' | 'kira';
export type CampaignQuestStage =
  | 'arrival'
  | 'reservation'
  | 'authority'
  | 'gate-open'
  | 'power'
  | 'unload'
  | 'first-beer'
  | 'reunion'
  | 'free-weekend'
  | 'friday-olympiad'
  | 'saturday-complaint'
  | 'wake-masl'
  | 'saturday-debate'
  | 'saturday-brawl'
  | 'secret-millionaire'
  | 'early-eviction'
  | 'sunday-final'
  | 'complete';
export interface RomanceState { interest: number; attempts: number; successes: number; boundaryStrikes: number; lastLine: string; }
export interface CampaignMiniResult { attempts: number; wins: number; best: number; last: number; bestQuality: 'failed' | 'messy' | 'solid' | 'perfect'; }

export interface CampaignMetaState {
  version: 3;
  introSeen: boolean;
  introReplays: number;
  questStage: CampaignQuestStage;
  reservationSolved: boolean;
  authorityBattleWon: boolean;
  finalBattleWon: boolean;
  powerConnected: boolean;
  unloading: Record<'drinks' | 'tents' | 'cable', boolean>;
  firstBeerOpened: boolean;
  relationshipBonus: Record<string, number>;
  romance: Record<RomanceId, RomanceState>;
  conversationCounts: Record<string, number>;
  learnedAttacks: CombatMoveId[];
  equippedAttacks: CombatMoveId[];
  attackMastery: Partial<Record<CombatMoveId, AttackMasteryState>>;
  unlockedAnecdotes: AnecdoteId[];
  equippedAnecdotes: AnecdoteId[];
  activeTeam: string[];
  miniResults: Record<string, CampaignMiniResult>;
  flags: Record<string, boolean>;
  suspicion: number;
  reliefCount: number;
  weekendArc: WeekendArcState;
  weekendScore: number;
  weekendRank: WeekendRankId;
  lastEvent: string;
}

const META_KEY = 'tales-blaue-adria-lpc-campaign-meta-v2';
const qualityValue = { failed: 0, messy: 1, solid: 2, perfect: 3 } as const;
const defaultRomance = (): RomanceState => ({ interest: 0, attempts: 0, successes: 0, boundaryStrikes: 0, lastLine: '' });
const defaultMini = (): CampaignMiniResult => ({ attempts: 0, wins: 0, best: 0, last: 0, bestQuality: 'failed' });
const defaultMastery = (): AttackMasteryState => ({ uses: 0, successes: 0, level: 1 });

const DEFAULT_STATE: CampaignMetaState = {
  version: 3,
  introSeen: false,
  introReplays: 0,
  questStage: 'arrival',
  reservationSolved: false,
  authorityBattleWon: false,
  finalBattleWon: false,
  powerConnected: false,
  unloading: { drinks: false, tents: false, cable: false },
  firstBeerOpened: false,
  relationshipBonus: {},
  romance: { susi: defaultRomance(), jule: defaultRomance(), kira: defaultRomance() },
  conversationCounts: {},
  learnedAttacks: [STARTER_ATTACK],
  equippedAttacks: [STARTER_ATTACK],
  attackMastery: { [STARTER_ATTACK]: defaultMastery() },
  unlockedAnecdotes: [],
  equippedAnecdotes: [],
  activeTeam: [],
  miniResults: {},
  flags: {},
  suspicion: 0,
  reliefCount: 0,
  weekendArc: defaultWeekendArcState(),
  weekendScore: 0,
  weekendRank: 'newcomer',
  lastEvent: 'Ein Wochenende wartet darauf, schlechte Entscheidungen als Erinnerungen zu tarnen.',
};

type Listener = (state: CampaignMetaState) => void;
type FridayOlympiadStateAfterparty = WeekendArcState['olympiad']['afterparty'];

export class CampaignMetaStore {
  private state: CampaignMetaState = this.load();
  private listeners = new Set<Listener>();

  snapshot(): CampaignMetaState { return structuredClone(this.state); }
  subscribe(listener: Listener): () => void { this.listeners.add(listener); listener(this.snapshot()); return () => { this.listeners.delete(listener); }; }
  reset(): void { localStorage.removeItem(META_KEY); this.state = structuredClone(DEFAULT_STATE); this.emit(); }
  markIntroSeen(): void { this.state.introSeen = true; this.state.lastEvent = 'Die Einleitung ist vorbei. Die juristische Verantwortung leider nicht.'; this.emit(); }
  replayIntro(): void { this.state.introSeen = false; this.state.introReplays += 1; this.emit(); }

  setStage(stage: CampaignQuestStage, event?: string): void { this.state.questStage = stage; if (event) this.state.lastEvent = event; this.recalculateScore(); this.emit(); }
  solveReservation(): void { this.state.reservationSolved = true; this.setStage('authority', 'Die Reservierung wurde gefunden. Sie war unter dem Namen, den niemand zuerst gelesen hat.'); }
  winAuthorityBattle(): void {
    this.state.authorityBattleWon = true;
    this.learnAttack('aldi-shirt-show', 'Gundula und Uli überstanden das Aldi-Shirt nicht ohne bleibende Verwaltungsschäden.');
    this.unlockAnecdote('gate-opened', 'Anekdote freigeschaltet: Die Schranke ging auf.');
    this.setStage('gate-open', 'Die Schranke öffnet sich widerwillig. Uli nennt es eine technische Fehlentscheidung.');
  }
  winFinalBattle(): void { this.state.finalBattleWon = true; this.state.flags.weekendComplete = true; this.setStage('complete', 'Die Sonntagsabnahme ist überstanden. Die Kaution lebt und niemand muss den Platz unter falschem Namen verlassen.'); }
  connectPower(): void { this.state.powerConnected = true; this.setStage('unload', 'Strom liegt an. Das Kabel liegt ebenfalls an – hauptsächlich im Weg.'); }
  markUnloaded(kind: 'drinks' | 'tents' | 'cable'): void {
    this.state.unloading[kind] = true;
    const done = Object.values(this.state.unloading).every(Boolean);
    this.state.lastEvent = done ? 'Alles ausgeladen. Der Wagen ist leer, die Verantwortung jetzt auf dem Platz verteilt.' : `${kind === 'drinks' ? 'Getränke' : kind === 'tents' ? 'Zelte' : 'Kabeltrommel'} ausgeladen.`;
    if (done) this.state.questStage = 'first-beer';
    this.recalculateScore(); this.emit();
  }
  openFirstBeer(): void { this.state.firstBeerOpened = true; this.state.flags.firstBeerOpened = true; this.learnAttack('beer-offer'); this.setStage('reunion', 'Das erste Bier ist offen. Damit gilt das Lager nach deutschem Campingrecht als gegründet.'); }

  addRelationship(characterId: string, delta: number, event?: string): number {
    const next = clamp((this.state.relationshipBonus[characterId] ?? 0) + delta, -100, 100);
    this.state.relationshipBonus[characterId] = next; if (event) this.state.lastEvent = event; this.recalculateScore(); this.emit(); return next;
  }
  conversation(characterId: string): number { const next = (this.state.conversationCounts[characterId] ?? 0) + 1; this.state.conversationCounts[characterId] = next; this.emit(); return next; }
  recordFlirt(id: RomanceId, success: boolean, delta: number, line: string): void {
    const romance = this.state.romance[id]; romance.attempts += 1; romance.successes += success ? 1 : 0; romance.interest = clamp(romance.interest + delta, -30, 100); if (!success && delta <= -4) romance.boundaryStrikes += 1; romance.lastLine = line; this.state.lastEvent = line; this.recalculateScore(); this.emit();
  }

  learnAttack(id: CombatMoveId, event?: string): boolean {
    if (!COMBAT_MOVES[id] || this.state.learnedAttacks.includes(id)) return false;
    this.state.learnedAttacks.push(id); this.state.attackMastery[id] = defaultMastery();
    if (this.state.equippedAttacks.length < this.attackSlotLimit()) this.state.equippedAttacks.push(id);
    if (event) this.state.lastEvent = event; this.emit(); return true;
  }
  recordAttackUse(id: CombatMoveId, success: boolean): void {
    const mastery = this.state.attackMastery[id] ?? defaultMastery(); const previousLevel = mastery.level;
    mastery.uses += 1; mastery.successes += success ? 1 : 0; mastery.level = masteryLevel(mastery.uses, mastery.successes); this.state.attackMastery[id] = mastery;
    if (mastery.level > previousLevel) this.state.lastEvent = `${COMBAT_MOVES[id].label} erreicht Meisterschaft ${mastery.level}${mastery.level === 2 ? '. Am Lagerfeuer kann eine Spezialisierung gewählt werden.' : '. Die Signaturtechnik ist verfügbar.'}`;
    this.recalculateScore(); this.emit();
  }
  chooseAttackBranch(id: CombatMoveId, branch: AttackBranch): void { const mastery = this.state.attackMastery[id]; if (!mastery || mastery.level < 2) return; mastery.branch = branch; this.state.lastEvent = `${COMBAT_MOVES[id].shortLabel} spezialisiert sich auf ${branch === 'impact' ? 'Wirkung' : 'Kontrolle'}.`; this.emit(); }
  attackSlotLimit(): number { return weekendRank(this.state.weekendScore).attackSlots; }
  toggleAttack(id: CombatMoveId): void {
    if (!this.state.learnedAttacks.includes(id)) return; const equipped = this.state.equippedAttacks;
    if (equipped.includes(id)) { if (equipped.length === 1) return; this.state.equippedAttacks = equipped.filter((entry) => entry !== id); }
    else if (equipped.length < this.attackSlotLimit()) this.state.equippedAttacks.push(id);
    this.emit();
  }

  unlockAnecdote(id: AnecdoteId, event?: string): boolean {
    if (this.state.unlockedAnecdotes.includes(id)) return false;
    this.state.unlockedAnecdotes.push(id); if (this.state.equippedAnecdotes.length < 2) this.state.equippedAnecdotes.push(id);
    this.state.lastEvent = event ?? `Anekdote freigeschaltet: ${ANECDOTES[id].label}.`; this.recalculateScore(); this.emit(); return true;
  }
  toggleAnecdote(id: AnecdoteId): void {
    if (!this.state.unlockedAnecdotes.includes(id)) return;
    if (this.state.equippedAnecdotes.includes(id)) this.state.equippedAnecdotes = this.state.equippedAnecdotes.filter((entry) => entry !== id);
    else if (this.state.equippedAnecdotes.length < 2) this.state.equippedAnecdotes.push(id);
    this.emit();
  }

  setActiveTeam(ids: string[]): void { const limit = weekendRank(this.state.weekendScore).companionSlots; this.state.activeTeam = [...new Set(ids)].slice(0, limit); this.emit(); }

  recordMiniGame(id: string, success: boolean, score: number, event: string, quality: CampaignMiniResult['bestQuality'] = success ? 'solid' : 'failed'): void {
    const result = this.state.miniResults[id] ?? defaultMini(); result.attempts += 1; result.wins += success ? 1 : 0; result.last = score; result.best = Math.max(result.best, score); if (qualityValue[quality] > qualityValue[result.bestQuality]) result.bestQuality = quality; this.state.miniResults[id] = result; this.state.lastEvent = event;
    if (success && id === 'flipCup') this.learnAttack('synchronised-cheer');
    if (success && id === 'beerPong') this.learnAttack('cup-eye-contact');
    if (success && id === 'flunkyball') this.learnAttack('total-exaggeration');
    if (quality === 'perfect' && id === 'flipCup') this.unlockAnecdote('all-at-once');
    if (quality === 'perfect' && id === 'beerPong') this.unlockAnecdote('bank-shot');
    if (quality === 'perfect' && id === 'flunkyball') this.unlockAnecdote('stop-means-stop');
    if (quality === 'perfect' && id === 'maslHole') this.unlockAnecdote('masl-tunnel');
    this.recalculateScore(); this.checkFinale(); this.emit();
  }
  recordHedge(success: boolean, suspicionDelta: number, relief: number, event: string, perfect = false): void {
    this.state.suspicion = clamp(this.state.suspicion + suspicionDelta, 0, 100); this.state.reliefCount += relief; this.state.flags.hedgeRelieved = success || this.state.flags.hedgeRelieved; this.state.lastEvent = event;
    if (success && perfect) this.unlockAnecdote('hedge-silent'); else if (!success) this.unlockAnecdote('gundula-noted');
    this.recalculateScore(); this.checkFinale(); this.emit();
  }
  recordBattleVictory(id: string): void { if (id === 'ronny') this.unlockAnecdote('lost-thread'); this.recalculateScore(); this.checkFinale(); this.emit(); }
  setFlag(flag: string, value = true, event?: string): void { this.state.flags[flag] = value; if (event) this.state.lastEvent = event; this.checkFinale(); this.emit(); }

  startFridayOlympiad(event = 'Die Freitag-Olympiade beginnt am Zeltkreis. Drei Disziplinen, kein medizinisch überzeugender Grund.'): void {
    if (this.state.weekendArc.olympiad.started) return;
    this.state.weekendArc.olympiad.started = true;
    this.state.questStage = 'friday-olympiad';
    this.state.lastEvent = event;
    this.emit();
  }
  setOlympiadCurrent(id: OlympiadDisciplineId | ''): void { this.state.weekendArc.olympiad.current = id; this.emit(); }
  recordOlympiadRound(id: OlympiadDisciplineId, success: boolean, score: number, quality: CampaignMiniResult['bestQuality']): void {
    const result = this.state.weekendArc.olympiad.disciplines[id];
    if (result.attempted) return;
    result.attempted = true; result.success = success; result.score = score; result.quality = quality; result.points = olympiadPoints(success, quality);
    this.state.weekendArc.olympiad.points = Object.values(this.state.weekendArc.olympiad.disciplines).reduce((sum, entry) => sum + entry.points, 0);
    this.state.weekendArc.olympiad.current = '';
    this.state.lastEvent = `${id} ist als Olympiadendisziplin gewertet: ${result.points} Punkte.`;
    this.recalculateScore(); this.emit();
  }
  completeOlympiad(afterparty: FridayOlympiadStateAfterparty, nightNoise: number, event: string): void {
    this.state.weekendArc.olympiad.completed = true; this.state.weekendArc.olympiad.afterparty = afterparty;
    this.state.weekendArc.nightNoise = clamp(nightNoise, 0, 100); this.state.flags.fridayOlympiadComplete = true; this.state.lastEvent = event;
    this.recalculateScore(); this.emit();
  }
  startSaturdayComplaint(): void {
    if (this.state.weekendArc.saturday.triggered || this.state.weekendArc.saturday.earlyEnding) return;
    this.state.weekendArc.saturday.triggered = true; this.state.weekendArc.saturday.step = 'complaint'; this.state.questStage = 'saturday-complaint';
    this.state.lastEvent = `Samstag, 08:00 Uhr: Gundula steht mit Klemmbrett am Zeltkreis. Nachtlärm ${this.state.weekendArc.nightNoise}/100.`;
    this.emit();
  }
  updateWeekendArc(mutator: (state: WeekendArcState) => void, event?: string): void { mutator(this.state.weekendArc); if (event) this.state.lastEvent = event; this.recalculateScore(); this.checkFinale(); this.emit(); }
  winSaturdayBrawl(): void {
    this.state.weekendArc.saturday.brawlWon = true; this.state.weekendArc.saturday.earlyEnding = false; this.state.weekendArc.saturday.step = 'won';
    this.state.weekendArc.secretMillionaire.unlocked = true; this.state.flags.saturdayStayWon = true; this.state.questStage = 'secret-millionaire';
    this.state.lastEvent = 'Der Acht-Uhr-Faustkampf ist gewonnen. Gundula und Uli erlauben das Bleiben und behaupten, es selbst entschieden zu haben.';
    this.recalculateScore(); this.emit();
  }
  loseSaturdayBrawl(): void {
    this.state.weekendArc.saturday.brawlWon = false; this.state.weekendArc.saturday.earlyEnding = true; this.state.weekendArc.saturday.step = 'evicted';
    this.state.flags.earlyEvictionEnding = true; this.state.questStage = 'early-eviction';
    this.state.lastEvent = 'Vom Platz geflogen. Die Schranke schließt, bevor das Wochenende seine zweite Hälfte erreicht.';
    this.recalculateScore(); this.emit();
  }
  completeSecretMillionaire(winner: 'player' | 'rival'): void {
    this.state.weekendArc.secretMillionaire.completed = true; this.state.weekendArc.secretMillionaire.winner = winner;
    this.state.flags.secretMillionaireComplete = true; this.state.questStage = 'free-weekend';
    this.state.lastEvent = winner === 'player' ? 'Secret Millionär gewonnen. Ein Hauptgewinn, keine Trostpreise und mehrere dauerhaft beleidigte Verdächtige.' : 'Secret Millionär beendet. Der Hauptgewinn geht an jemand anderen; Trostpreise wurden bereits aus Prinzip abgeschafft.';
    this.recalculateScore(); this.checkFinale(); this.emit();
  }

  combinedRelationship(base: GameSnapshot, id: string): number { return clamp((base.relationships[id] ?? 0) + (this.state.relationshipBonus[id] ?? 0), -100, 100); }
  augmentSnapshot(base: GameSnapshot): GameSnapshot {
    const relationships = { ...base.relationships }; for (const [id, bonus] of Object.entries(this.state.relationshipBonus)) relationships[id] = clamp((relationships[id] ?? 0) + bonus, -100, 100);
    return { ...base, relationships, flags: { ...base.flags, ...this.state.flags, firstBeerOpened: this.state.firstBeerOpened } };
  }
  progressionContext(): CombatProgressionContext { return { momentumStart: this.state.weekendRank === 'myth' ? 1 : 0, attackMastery: structuredClone(this.state.attackMastery), anecdotes: [...this.state.equippedAnecdotes], activeTeam: [...this.state.activeTeam], weekendRank: this.state.weekendRank, flags: { ...this.state.flags } }; }

  objective(): { title: string; text: string; targetId: string } {
    switch (this.state.questStage) {
      case 'arrival': return { title: 'Ankunft ohne Plan B', text: 'Öffne den Kofferraum und finde heraus, welcher Gegenstand zuerst im Weg steht.', targetId: 'trunk' };
      case 'reservation': return { title: 'Wer lesen kann, parkt später', text: 'Finde die Reservierung am Schwarzen Brett vor der Rezeption.', targetId: 'reservationBoard' };
      case 'authority': return { title: 'Verwaltung im Doppelpack', text: 'Sprich mit Gundula. Uli wird sich ungefragt beteiligen.', targetId: 'gundula' };
      case 'gate-open': return { title: 'Zum Taucherplatz', text: 'Gehe durch die Schranke zum Wagen am Taucherplatz.', targetId: 'taucherplatz' };
      case 'power': return { title: 'Strom oder Zivilisationsabbruch', text: 'Verbinde Kabeltrommel und Stromkasten.', targetId: 'powerBox' };
      case 'unload': return { title: 'Ausladen ohne Bandscheibenvorfall', text: 'Bringe Getränke, Zelte und Kabel an ihren Ort.', targetId: this.state.unloading.drinks ? (this.state.unloading.tents ? 'cable' : 'tents') : 'drinks' };
      case 'first-beer': return { title: 'Rituelle Inbetriebnahme', text: 'Öffne das erste Bier am Wagen.', targetId: 'firstBeer' };
      case 'reunion': return { title: 'Finde die Problemträger', text: 'Suche die Freundesgruppe und stelle ein aktives Team zusammen.', targetId: 'andre' };
      case 'friday-olympiad': return { title: 'Freitag-Olympiade', text: 'Absolviere Flip Cup, Beer Pong und Flunkyball. Jeder Punkt erhöht Ruhm, Pegel und später Gundulas Beweislage.', targetId: 'campfire' };
      case 'saturday-complaint': return { title: 'Die Acht-Uhr-Räumung', text: 'Höre Danny und Felix an. André hat bereits ein völlig überzogenes Abschiedslied geschrieben.', targetId: 'campfire' };
      case 'wake-masl': return { title: 'Masl, unsere letzte Chance', text: 'Wecke Masl und überzeuge ihn, Gundula und Uli argumentativ zu zermürben.', targetId: 'masl' };
      case 'saturday-debate': return { title: 'Letzte Diskussion', text: 'Gehe mit Masl zur Schranke und zerlege die Räumungsbegründung.', targetId: 'gundula' };
      case 'saturday-brawl': return { title: 'Faustrecht an der Schranke', text: 'Gewinne den absurden 2-gegen-2-Faustkampf. Eine Niederlage beendet das Wochenende.', targetId: 'gundula' };
      case 'secret-millionaire': return { title: 'Secret Millionär', text: 'Vier geheime Abstimmungen. Beschuldigte fliegen aus dem Gewinnpool – auch Unschuldige. Nur ein Hauptgewinn.', targetId: 'campfire' };
      case 'early-eviction': return { title: 'Vom Platz geflogen', text: 'Das Wochenende endete vorzeitig. Andrés Lied läuft jetzt vollständig berechtigt.', targetId: 'campfire' };
      case 'sunday-final': return { title: 'Sonntagsabnahme', text: 'Das Abschlussprotokoll wartet am Schwarzen Brett. Bereite Team, Attacken und zwei Anekdoten vor.', targetId: 'noticeBoard' };
      case 'complete': return { title: 'Abreise mit Restwürde', text: 'Die Kaution lebt. Nutze die verbleibende Zeit oder verlasse den Platz als Legende.', targetId: 'campfire' };
      default: return { title: 'Das Wochenende schreibt Beweise', text: 'Spiele, kämpfe, pflege Beziehungen und forme deinen Kampfstil. Die Freitagnacht und der Samstagmorgen reagieren auf dein tatsächliches Verhalten.', targetId: 'campfire' };
    }
  }

  private checkFinale(): void {
    if (this.state.questStage !== 'free-weekend' || this.state.finalBattleWon || this.state.weekendArc.saturday.earlyEnding) return;
    if (!this.state.weekendArc.saturday.brawlWon || !this.state.weekendArc.secretMillionaire.completed) return;
    const completed = ['flipCup', 'beerPong', 'flunkyball', 'maslHole', 'hedgePee'].filter((id) => (this.state.miniResults[id]?.attempts ?? 0) > 0 || (id === 'hedgePee' && this.state.flags.hedgeRelieved)).length;
    if (completed >= 3 && this.state.flags.ronnyDefeated) { this.state.questStage = 'sunday-final'; this.state.lastEvent = 'Das Abschlussprotokoll wurde ans Schwarze Brett gehängt. Olympiade, Räumungsversuch und Secret Millionär sind jetzt ebenfalls Beweismittel.'; }
  }
  private recalculateScore(): void {
    const wins = Object.values(this.state.miniResults).reduce((sum, entry) => sum + entry.wins, 0); const perfects = Object.values(this.state.miniResults).filter((entry) => entry.bestQuality === 'perfect').length;
    const romance = Object.values(this.state.romance).reduce((sum, entry) => sum + Math.max(0, entry.interest), 0); const relations = Object.values(this.state.relationshipBonus).reduce((sum, value) => sum + value, 0); const mastery = Object.values(this.state.attackMastery).reduce((sum, entry) => sum + ((entry?.level ?? 1) - 1) * 5, 0);
    const olympiad = this.state.weekendArc.olympiad.completed ? 8 + this.state.weekendArc.olympiad.points : 0;
    const saturday = this.state.weekendArc.saturday.brawlWon ? 35 : 0;
    const millionaire = this.state.weekendArc.secretMillionaire.completed ? (this.state.weekendArc.secretMillionaire.winner === 'player' ? 18 : 8) : 0;
    this.state.weekendScore = Math.round((this.state.authorityBattleWon ? 25 : 0) + (this.state.powerConnected ? 10 : 0) + (this.state.firstBeerOpened ? 10 : 0) + (this.state.finalBattleWon ? 40 : 0) + olympiad + saturday + millionaire + wins * 12 + perfects * 8 + this.state.unlockedAnecdotes.length * 5 + mastery + romance * .18 + relations * .12 + this.state.reliefCount * 3 - this.state.suspicion * .15);
    this.state.weekendRank = weekendRank(this.state.weekendScore).id;
    const limit = weekendRank(this.state.weekendScore).attackSlots; this.state.equippedAttacks = this.state.equippedAttacks.slice(0, limit);
    const teamLimit = weekendRank(this.state.weekendScore).companionSlots; this.state.activeTeam = this.state.activeTeam.slice(0, teamLimit);
  }
  private load(): CampaignMetaState {
    try {
      const raw = localStorage.getItem(META_KEY); if (!raw) return structuredClone(DEFAULT_STATE); const parsed = JSON.parse(raw) as Partial<CampaignMetaState>;
      const attackMastery: CampaignMetaState['attackMastery'] = {}; for (const id of [STARTER_ATTACK, ...(parsed.learnedAttacks ?? [])]) if (id in COMBAT_MOVES) attackMastery[id as CombatMoveId] = { ...defaultMastery(), ...(parsed.attackMastery?.[id as CombatMoveId] ?? {}) };
      const miniResults: Record<string, CampaignMiniResult> = {}; for (const [id, result] of Object.entries(parsed.miniResults ?? {})) miniResults[id] = { ...defaultMini(), ...result };
      const arcDefault = defaultWeekendArcState(); const parsedArc = parsed.weekendArc;
      const weekendArc: WeekendArcState = {
        ...arcDefault, ...(parsedArc ?? {}),
        olympiad: {
          ...arcDefault.olympiad, ...(parsedArc?.olympiad ?? {}),
          disciplines: {
            flipCup: { ...arcDefault.olympiad.disciplines.flipCup, ...(parsedArc?.olympiad?.disciplines?.flipCup ?? {}) },
            beerPong: { ...arcDefault.olympiad.disciplines.beerPong, ...(parsedArc?.olympiad?.disciplines?.beerPong ?? {}) },
            flunkyball: { ...arcDefault.olympiad.disciplines.flunkyball, ...(parsedArc?.olympiad?.disciplines?.flunkyball ?? {}) },
          },
        },
        saturday: { ...arcDefault.saturday, ...(parsedArc?.saturday ?? {}) },
        secretMillionaire: { ...arcDefault.secretMillionaire, ...(parsedArc?.secretMillionaire ?? {}) },
      };
      const state: CampaignMetaState = {
        ...structuredClone(DEFAULT_STATE), ...parsed, version: 3,
        unloading: { ...DEFAULT_STATE.unloading, ...(parsed.unloading ?? {}) },
        romance: { susi: { ...defaultRomance(), ...(parsed.romance?.susi ?? {}) }, jule: { ...defaultRomance(), ...(parsed.romance?.jule ?? {}) }, kira: { ...defaultRomance(), ...(parsed.romance?.kira ?? {}) } },
        learnedAttacks: [...new Set([STARTER_ATTACK, ...(parsed.learnedAttacks ?? [])])].filter((id): id is CombatMoveId => id in COMBAT_MOVES),
        equippedAttacks: [...new Set(parsed.equippedAttacks ?? [STARTER_ATTACK])].filter((id): id is CombatMoveId => id in COMBAT_MOVES),
        attackMastery, miniResults, weekendArc,
        unlockedAnecdotes: (parsed.unlockedAnecdotes ?? []).filter((id): id is AnecdoteId => id in ANECDOTES),
        equippedAnecdotes: (parsed.equippedAnecdotes ?? []).filter((id): id is AnecdoteId => id in ANECDOTES).slice(0, 2),
      };
      this.state = state; this.recalculateScore(); return state;
    } catch { return structuredClone(DEFAULT_STATE); }
  }
  private emit(): void { this.recalculateScore(); localStorage.setItem(META_KEY, JSON.stringify(this.state)); const snapshot = this.snapshot(); this.listeners.forEach((listener) => listener(snapshot)); window.dispatchEvent(new CustomEvent('lpc-campaign-meta', { detail: snapshot })); }
}

function clamp(value: number, min: number, max: number): number { return Math.max(min, Math.min(max, value)); }
export const campaignMeta = new CampaignMetaStore();

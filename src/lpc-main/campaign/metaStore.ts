import type { CombatMoveId, GameSnapshot } from '../../game/types';
import { COMBAT_MOVES, MAX_EQUIPPED_ATTACKS, STARTER_ATTACK } from '../../game/combatMoves';

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
  | 'free-weekend';

export interface RomanceState {
  interest: number;
  attempts: number;
  successes: number;
  boundaryStrikes: number;
  lastLine: string;
}

export interface CampaignMiniResult {
  attempts: number;
  wins: number;
  best: number;
  last: number;
}

export interface CampaignMetaState {
  version: 2;
  introSeen: boolean;
  introReplays: number;
  questStage: CampaignQuestStage;
  reservationSolved: boolean;
  authorityBattleWon: boolean;
  powerConnected: boolean;
  unloading: Record<'drinks' | 'tents' | 'cable', boolean>;
  firstBeerOpened: boolean;
  relationshipBonus: Record<string, number>;
  romance: Record<RomanceId, RomanceState>;
  conversationCounts: Record<string, number>;
  learnedAttacks: CombatMoveId[];
  equippedAttacks: CombatMoveId[];
  activeTeam: string[];
  miniResults: Record<string, CampaignMiniResult>;
  flags: Record<string, boolean>;
  suspicion: number;
  reliefCount: number;
  weekendScore: number;
  lastEvent: string;
}

const META_KEY = 'tales-blaue-adria-lpc-campaign-meta-v2';

const defaultRomance = (): RomanceState => ({ interest: 0, attempts: 0, successes: 0, boundaryStrikes: 0, lastLine: '' });
const defaultMini = (): CampaignMiniResult => ({ attempts: 0, wins: 0, best: 0, last: 0 });

const DEFAULT_STATE: CampaignMetaState = {
  version: 2,
  introSeen: false,
  introReplays: 0,
  questStage: 'arrival',
  reservationSolved: false,
  authorityBattleWon: false,
  powerConnected: false,
  unloading: { drinks: false, tents: false, cable: false },
  firstBeerOpened: false,
  relationshipBonus: {},
  romance: { susi: defaultRomance(), jule: defaultRomance(), kira: defaultRomance() },
  conversationCounts: {},
  learnedAttacks: [STARTER_ATTACK],
  equippedAttacks: [STARTER_ATTACK],
  activeTeam: [],
  miniResults: {},
  flags: {},
  suspicion: 0,
  reliefCount: 0,
  weekendScore: 0,
  lastEvent: 'Ein Wochenende wartet darauf, schlechte Entscheidungen als Erinnerungen zu tarnen.',
};

type Listener = (state: CampaignMetaState) => void;

export class CampaignMetaStore {
  private state: CampaignMetaState = this.load();
  private listeners = new Set<Listener>();

  snapshot(): CampaignMetaState { return structuredClone(this.state); }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener(this.snapshot());
    return () => this.listeners.delete(listener);
  }

  reset(): void {
    localStorage.removeItem(META_KEY);
    this.state = structuredClone(DEFAULT_STATE);
    this.emit();
  }

  markIntroSeen(): void {
    this.state.introSeen = true;
    this.state.lastEvent = 'Die Einleitung ist vorbei. Die juristische Verantwortung leider nicht.';
    this.emit();
  }

  replayIntro(): void {
    this.state.introSeen = false;
    this.state.introReplays += 1;
    this.emit();
  }

  setStage(stage: CampaignQuestStage, event?: string): void {
    this.state.questStage = stage;
    if (event) this.state.lastEvent = event;
    this.recalculateScore();
    this.emit();
  }

  solveReservation(): void {
    this.state.reservationSolved = true;
    this.setStage('authority', 'Die Reservierung wurde gefunden. Sie war unter dem Namen, den niemand zuerst gelesen hat.');
  }

  winAuthorityBattle(): void {
    this.state.authorityBattleWon = true;
    this.learnAttack('aldi-shirt-show', 'Gundula und Uli überstanden das Aldi-Shirt nicht ohne bleibende Verwaltungsschäden.');
    this.setStage('gate-open', 'Die Schranke öffnet sich widerwillig. Uli nennt es eine technische Fehlentscheidung.');
  }

  connectPower(): void {
    this.state.powerConnected = true;
    this.setStage('unload', 'Strom liegt an. Das Kabel liegt ebenfalls an – hauptsächlich im Weg.');
  }

  markUnloaded(kind: 'drinks' | 'tents' | 'cable'): void {
    this.state.unloading[kind] = true;
    const done = Object.values(this.state.unloading).every(Boolean);
    this.state.lastEvent = done
      ? 'Alles ausgeladen. Der Wagen ist leer, die Verantwortung jetzt auf dem Platz verteilt.'
      : `${kind === 'drinks' ? 'Getränke' : kind === 'tents' ? 'Zelte' : 'Kabeltrommel'} ausgeladen.`;
    if (done) this.state.questStage = 'first-beer';
    this.recalculateScore();
    this.emit();
  }

  openFirstBeer(): void {
    this.state.firstBeerOpened = true;
    this.state.flags.firstBeerOpened = true;
    this.learnAttack('beer-offer', 'Das erste Bier macht aus Getränken plötzlich Konfliktlösungswerkzeuge.');
    this.setStage('reunion', 'Das erste Bier ist offen. Damit gilt das Lager nach deutschem Campingrecht als gegründet.');
  }

  addRelationship(characterId: string, delta: number, event?: string): number {
    const current = this.state.relationshipBonus[characterId] ?? 0;
    const next = Math.max(-100, Math.min(100, current + delta));
    this.state.relationshipBonus[characterId] = next;
    if (event) this.state.lastEvent = event;
    this.recalculateScore();
    this.emit();
    return next;
  }

  conversation(characterId: string): number {
    const next = (this.state.conversationCounts[characterId] ?? 0) + 1;
    this.state.conversationCounts[characterId] = next;
    this.emit();
    return next;
  }

  recordFlirt(id: RomanceId, success: boolean, delta: number, line: string): void {
    const romance = this.state.romance[id];
    romance.attempts += 1;
    romance.successes += success ? 1 : 0;
    romance.interest = Math.max(-30, Math.min(100, romance.interest + delta));
    if (!success && delta <= -4) romance.boundaryStrikes += 1;
    romance.lastLine = line;
    this.state.lastEvent = line;
    this.recalculateScore();
    this.emit();
  }

  learnAttack(id: CombatMoveId, event?: string): boolean {
    if (!COMBAT_MOVES[id] || this.state.learnedAttacks.includes(id)) return false;
    this.state.learnedAttacks.push(id);
    if (this.state.equippedAttacks.length < MAX_EQUIPPED_ATTACKS) this.state.equippedAttacks.push(id);
    if (event) this.state.lastEvent = event;
    this.emit();
    return true;
  }

  toggleAttack(id: CombatMoveId): void {
    if (!this.state.learnedAttacks.includes(id)) return;
    const equipped = this.state.equippedAttacks;
    if (equipped.includes(id)) {
      if (equipped.length === 1) return;
      this.state.equippedAttacks = equipped.filter((entry) => entry !== id);
    } else if (equipped.length < MAX_EQUIPPED_ATTACKS) {
      this.state.equippedAttacks.push(id);
    }
    this.emit();
  }

  setActiveTeam(ids: string[]): void {
    this.state.activeTeam = [...new Set(ids)].slice(0, 3);
    this.emit();
  }

  recordMiniGame(id: string, success: boolean, score: number, event: string): void {
    const result = this.state.miniResults[id] ?? defaultMini();
    result.attempts += 1;
    result.wins += success ? 1 : 0;
    result.last = score;
    result.best = Math.max(result.best, score);
    this.state.miniResults[id] = result;
    this.state.lastEvent = event;
    if (success && id === 'flipCup') this.learnAttack('synchronised-cheer');
    if (success && id === 'beerPong') this.learnAttack('cup-eye-contact');
    if (success && id === 'flunkyball') this.learnAttack('total-exaggeration');
    this.recalculateScore();
    this.emit();
  }

  recordHedge(success: boolean, suspicionDelta: number, relief: number, event: string): void {
    this.state.suspicion = Math.max(0, Math.min(100, this.state.suspicion + suspicionDelta));
    this.state.reliefCount += relief;
    this.state.flags.hedgeRelieved = success || this.state.flags.hedgeRelieved;
    this.state.lastEvent = event;
    this.recalculateScore();
    this.emit();
  }

  setFlag(flag: string, value = true, event?: string): void {
    this.state.flags[flag] = value;
    if (event) this.state.lastEvent = event;
    this.emit();
  }

  combinedRelationship(base: GameSnapshot, id: string): number {
    return Math.max(-100, Math.min(100, (base.relationships[id] ?? 0) + (this.state.relationshipBonus[id] ?? 0)));
  }

  augmentSnapshot(base: GameSnapshot): GameSnapshot {
    const relationships = { ...base.relationships };
    for (const [id, bonus] of Object.entries(this.state.relationshipBonus)) {
      relationships[id] = Math.max(-100, Math.min(100, (relationships[id] ?? 0) + bonus));
    }
    return { ...base, relationships, flags: { ...base.flags, ...this.state.flags, firstBeerOpened: this.state.firstBeerOpened } };
  }

  objective(): { title: string; text: string; targetId: string } {
    switch (this.state.questStage) {
      case 'arrival': return { title: 'Ankunft ohne Plan B', text: 'Öffne den Kofferraum und finde heraus, welcher Gegenstand zuerst im Weg steht.', targetId: 'trunk' };
      case 'reservation': return { title: 'Wer lesen kann, parkt später', text: 'Finde die Reservierung am Schwarzen Brett vor der Rezeption.', targetId: 'reservationBoard' };
      case 'authority': return { title: 'Verwaltung im Doppelpack', text: 'Sprich mit Gundula. Uli wird sich ungefragt beteiligen.', targetId: 'gundula' };
      case 'gate-open': return { title: 'Zum Taucherplatz', text: 'Fahre beziehungsweise laufe durch die Schranke zum Wagen am Taucherplatz.', targetId: 'taucherplatz' };
      case 'power': return { title: 'Strom oder Zivilisationsabbruch', text: 'Verbinde Kabeltrommel und Stromkasten, bevor jemand den Kühlschrank auf Vertrauen betreibt.', targetId: 'powerBox' };
      case 'unload': return { title: 'Ausladen ohne Bandscheibenvorfall', text: 'Bringe Getränke, Zelte und Kabel an ihren vorgesehenen Ort.', targetId: this.state.unloading.drinks ? (this.state.unloading.tents ? 'cable' : 'tents') : 'drinks' };
      case 'first-beer': return { title: 'Rituelle Inbetriebnahme', text: 'Öffne das erste Bier am Wagen. Das ist technisch kein Bauabschnitt, fühlt sich aber so an.', targetId: 'firstBeer' };
      case 'reunion': return { title: 'Finde die neun Problemträger', text: 'Suche die Freundesgruppe auf dem Platz und bringe mindestens drei Leute in dein aktives Team.', targetId: 'andre' };
      default: return { title: 'Freies Wochenende', text: 'Kämpfe, flirte, spiele, erleichtere dich diskret und erreiche Masls Loch, ohne den sozialen Totalschaden zu vollenden.', targetId: 'campfire' };
    }
  }

  private recalculateScore(): void {
    const wins = Object.values(this.state.miniResults).reduce((sum, entry) => sum + entry.wins, 0);
    const romance = Object.values(this.state.romance).reduce((sum, entry) => sum + Math.max(0, entry.interest), 0);
    const relations = Object.values(this.state.relationshipBonus).reduce((sum, value) => sum + value, 0);
    this.state.weekendScore = Math.round(
      (this.state.authorityBattleWon ? 25 : 0)
      + (this.state.powerConnected ? 10 : 0)
      + (this.state.firstBeerOpened ? 10 : 0)
      + wins * 12
      + romance * 0.18
      + relations * 0.12
      + this.state.reliefCount * 3
      - this.state.suspicion * 0.15,
    );
  }

  private load(): CampaignMetaState {
    try {
      const raw = localStorage.getItem(META_KEY);
      if (!raw) return structuredClone(DEFAULT_STATE);
      const parsed = JSON.parse(raw) as Partial<CampaignMetaState>;
      return {
        ...structuredClone(DEFAULT_STATE),
        ...parsed,
        version: 2,
        unloading: { ...DEFAULT_STATE.unloading, ...(parsed.unloading ?? {}) },
        romance: {
          susi: { ...defaultRomance(), ...(parsed.romance?.susi ?? {}) },
          jule: { ...defaultRomance(), ...(parsed.romance?.jule ?? {}) },
          kira: { ...defaultRomance(), ...(parsed.romance?.kira ?? {}) },
        },
        learnedAttacks: [...new Set([STARTER_ATTACK, ...(parsed.learnedAttacks ?? [])])].filter((id): id is CombatMoveId => id in COMBAT_MOVES),
        equippedAttacks: [...new Set(parsed.equippedAttacks ?? [STARTER_ATTACK])].filter((id): id is CombatMoveId => id in COMBAT_MOVES).slice(0, MAX_EQUIPPED_ATTACKS),
      };
    } catch {
      return structuredClone(DEFAULT_STATE);
    }
  }

  private emit(): void {
    localStorage.setItem(META_KEY, JSON.stringify(this.state));
    const snapshot = this.snapshot();
    this.listeners.forEach((listener) => listener(snapshot));
    window.dispatchEvent(new CustomEvent('lpc-campaign-meta', { detail: snapshot }));
  }
}

export const campaignMeta = new CampaignMetaStore();

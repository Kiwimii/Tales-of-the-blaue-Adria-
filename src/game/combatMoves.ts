import type { CombatMoveId, ConversationTopicId, GameSnapshot, FrustrationStatusId } from './types';

export type CombatMoveTag =
  | 'rapport'
  | 'style'
  | 'submission'
  | 'logic'
  | 'wit'
  | 'guard'
  | 'drink'
  | 'team'
  | 'charm'
  | 'chaos';

export interface CombatMoveDefinition {
  id: CombatMoveId;
  label: string;
  shortLabel: string;
  description: string;
  tag: CombatMoveTag;
  baseFrustration: number;
  accuracy: number;
  guardMultiplier?: number;
  selfRelief?: number;
  status?: { target: 'enemy' | 'player'; id: FrustrationStatusId; turns: number };
  unlockTitle: string;
  unlockDetail: string;
  flirtOption: string;
  flirtModifier: number;
}

export type CombatOpponentId = 'entry-authority' | 'ronny';

export interface CombatOpponentProfile {
  id: CombatOpponentId;
  name: string;
  title: string;
  maxFrustration: number;
  traits: string[];
  baseCounterFrustration: number;
  moveMultipliers: Partial<Record<CombatMoveId, number>>;
  tagMultipliers: Partial<Record<CombatMoveTag, number>>;
  counterLines: string[];
}

export const STARTER_ATTACK: CombatMoveId = 'classic-high-five';
export const MAX_EQUIPPED_ATTACKS = 4;

export const COMBAT_MOVES: Record<CombatMoveId, CombatMoveDefinition> = {
  'classic-high-five': {
    id: 'classic-high-five',
    label: 'Klassisches High Five',
    shortLabel: 'High Five',
    description: 'Bricht die erwartete Konfrontation mit unangemessen ehrlicher Zustimmung. Sehr zuverlässig.',
    tag: 'rapport',
    baseFrustration: 18,
    accuracy: 96,
    status: { target: 'enemy', id: 'ueberrumpelt', turns: 1 },
    unlockTitle: 'Startattacke',
    unlockDetail: 'Von Beginn an gelernt. Manchmal ist eine erhobene Hand die stärkste verfügbare Argumentation.',
    flirtOption: 'Ein überraschend ernst gemeintes High Five anbieten',
    flirtModifier: 2,
  },
  'aldi-shirt-show': {
    id: 'aldi-shirt-show',
    label: 'Aldi-T-Shirt präsentieren',
    shortLabel: 'Aldi-Shirt',
    description: 'Zeigt Discounter-Mode mit maximalem Selbstbewusstsein. Verursacht Fremdscham bei stilbewussten Gegnern.',
    tag: 'style',
    baseFrustration: 27,
    accuracy: 80,
    status: { target: 'enemy', id: 'fremdschaemen', turns: 2 },
    unlockTitle: 'Einlasskampf gewinnen',
    unlockDetail: 'Nach dem ersten erfolgreichen Kampf gegen Gundula und Uli. Die Verwaltung überlebt das Shirt, aber vergisst es nicht.',
    flirtOption: 'Das Aldi-Shirt wie ein seltenes Designerstück erklären',
    flirtModifier: -1,
  },
  'agree-anyway': {
    id: 'agree-anyway',
    label: 'Recht geben, obwohl du es besser weißt',
    shortLabel: 'Recht geben',
    description: 'Entzieht rechthaberischen Gegnern den Widerstand, den sie für ihre Routine benötigen.',
    tag: 'submission',
    baseFrustration: 21,
    accuracy: 94,
    status: { target: 'enemy', id: 'leerlauf', turns: 2 },
    unlockTitle: 'Gundula verstehen lernen',
    unlockDetail: 'Nach einem persönlichen Gespräch mit Gundula, sobald der Einlasskampf gewonnen wurde.',
    flirtOption: 'Zustimmen und dabei sehr deutlich zeigen, dass du es besser weißt',
    flirtModifier: 1,
  },
  'logical-argument': {
    id: 'logical-argument',
    label: 'Logisch argumentieren',
    shortLabel: 'Logik',
    description: 'Ein sauber aufgebautes Argument mit Anfang, Mitte und einem Punkt, an dem der Gegner eigentlich zuhören müsste.',
    tag: 'logic',
    baseFrustration: 24,
    accuracy: 84,
    status: { target: 'enemy', id: 'unterbrochen', turns: 1 },
    unlockTitle: 'Ronny ernst nehmen',
    unlockDetail: 'Nach einem persönlichen Gespräch mit Ronny bei mindestens 8 Beziehungspunkten.',
    flirtOption: 'Die Kompatibilität nüchtern und erschreckend logisch herleiten',
    flirtModifier: 0,
  },
  'dry-counter': {
    id: 'dry-counter',
    label: 'Trockener Konter',
    shortLabel: 'Konter',
    description: 'Ein kurzer Satz, der die gesamte vorherige Rede rückwirkend unnötig wirken lässt.',
    tag: 'wit',
    baseFrustration: 23,
    accuracy: 87,
    status: { target: 'enemy', id: 'unterbrochen', turns: 2 },
    unlockTitle: 'Andrés Timing übernehmen',
    unlockDetail: 'Nach einem persönlichen Gespräch mit André bei mindestens 8 Beziehungspunkten.',
    flirtOption: 'Einen trockenen Seitenhieb setzen und nicht erklären',
    flirtModifier: 3,
  },
  'camping-chair-block': {
    id: 'camping-chair-block',
    label: 'Campingstuhl-Blockade',
    shortLabel: 'Stuhl-Block',
    description: 'Setzt sich demonstrativ hin. Verursacht wenig Frust, reduziert aber den gegnerischen Gegenzug stark.',
    tag: 'guard',
    baseFrustration: 9,
    accuracy: 100,
    guardMultiplier: 0.44,
    status: { target: 'player', id: 'abgesichert', turns: 2 },
    unlockTitle: 'Mit René planen',
    unlockDetail: 'Nach einem gemeinsamen Plan mit René bei mindestens 8 Beziehungspunkten.',
    flirtOption: 'Den einzigen stabilen Campingstuhl wortlos freihalten',
    flirtModifier: 4,
  },
  'beer-offer': {
    id: 'beer-offer',
    label: 'Bier anbieten',
    shortLabel: 'Bier anbieten',
    description: 'Unterbricht den Konflikt mit einer konkreten Frage. Entlastet dich und verwirrt die Gegenseite.',
    tag: 'drink',
    baseFrustration: 14,
    accuracy: 91,
    selfRelief: 10,
    status: { target: 'enemy', id: 'verwirrt', turns: 1 },
    unlockTitle: 'Mit Lars anstoßen',
    unlockDetail: 'Nach dem ersten Bier und einem Gespräch über das Wochenende mit Lars.',
    flirtOption: 'Ein Getränk anbieten und die Auswahl überraschend respektvoll lassen',
    flirtModifier: 3,
  },
  'synchronised-cheer': {
    id: 'synchronised-cheer',
    label: 'Synchroner Gruppen-Zuruf',
    shortLabel: 'Gruppen-Zuruf',
    description: 'Die aktive Gruppe reagiert gleichzeitig. Wird mit jedem aktiven Begleiter stärker.',
    tag: 'team',
    baseFrustration: 16,
    accuracy: 88,
    status: { target: 'player', id: 'fokussiert', turns: 2 },
    unlockTitle: 'Flip Cup gewinnen',
    unlockDetail: 'Nach dem ersten Sieg bei Flip Cup. Synchronität wird erstmals als soziale Waffe erkannt.',
    flirtOption: 'Die Gruppe auffällig unauffällig als Wingmen einsetzen',
    flirtModifier: 2,
  },
  'cup-eye-contact': {
    id: 'cup-eye-contact',
    label: 'Becher-Blickkontakt',
    shortLabel: 'Becherblick',
    description: 'Hält Blickkontakt, während nebenbei ein Becher versenkt wird. Präzise, charmant und irritierend.',
    tag: 'charm',
    baseFrustration: 20,
    accuracy: 86,
    status: { target: 'enemy', id: 'fixiert', turns: 2 },
    unlockTitle: 'Beer Pong gewinnen',
    unlockDetail: 'Nach dem ersten Sieg bei Beer Pong. Die Technik wird als Flirt- und Kampfoption verfügbar.',
    flirtOption: 'Blickkontakt halten und nebenbei den Becher treffen',
    flirtModifier: 6,
  },
  'total-exaggeration': {
    id: 'total-exaggeration',
    label: 'Komplett übertreiben',
    shortLabel: 'Übertreiben',
    description: 'Macht aus einer Kleinigkeit einen historischen Wendepunkt. Sehr stark, aber unzuverlässig.',
    tag: 'chaos',
    baseFrustration: 31,
    accuracy: 67,
    status: { target: 'enemy', id: 'verwirrt', turns: 2 },
    unlockTitle: 'Flunkyball gewinnen',
    unlockDetail: 'Nach dem ersten Flunkyball-Sieg. Ab diesem Moment gilt Übertreibung als anerkannte Technik.',
    flirtOption: 'Die Begegnung zur offensichtlich größten Geschichte des Wochenendes erklären',
    flirtModifier: 4,
  },
};

export const COMBAT_OPPONENTS: Record<CombatOpponentId, CombatOpponentProfile> = {
  'entry-authority': {
    id: 'entry-authority',
    name: 'Gundula & Uli',
    title: 'Verwaltung im Doppelpack',
    maxFrustration: 100,
    traits: ['bürokratisch', 'rechthaberisch', 'ritualabhängig'],
    baseCounterFrustration: 13,
    moveMultipliers: {
      'classic-high-five': 1.45,
      'agree-anyway': 1.55,
      'logical-argument': 0.55,
      'aldi-shirt-show': 0.45,
      'dry-counter': 0.78,
      'camping-chair-block': 0.9,
    },
    tagMultipliers: { rapport: 1.2, submission: 1.3, logic: 0.65, style: 0.6 },
    counterLines: [
      'Gundula verweist auf eine handschriftliche Nebenbemerkung.',
      'Uli misst denselben Abstand ein zweites Mal und wird dadurch nicht unsicherer.',
      'Beide wiederholen die Platzordnung mit leicht unterschiedlicher Betonung.',
    ],
  },
  ronny: {
    id: 'ronny',
    name: 'Rivalen-Ronny',
    title: 'Parkplatz-Philosoph',
    maxFrustration: 110,
    traits: ['diskussionshungrig', 'eitel', 'unterbrechungsanfällig'],
    baseCounterFrustration: 14,
    moveMultipliers: {
      'classic-high-five': 0.72,
      'agree-anyway': 0.58,
      'logical-argument': 1.25,
      'dry-counter': 1.38,
      'aldi-shirt-show': 1.12,
      'total-exaggeration': 1.18,
    },
    tagMultipliers: { wit: 1.2, logic: 1.15, submission: 0.65, rapport: 0.8 },
    counterLines: [
      'Ronny beginnt eine Erklärung mit „Ganz objektiv betrachtet“.',
      'Ronny definiert das Problem neu, damit seine alte Antwort wieder passt.',
      'Ronny spricht weiter, obwohl der Satz bereits zweimal hätte enden können.',
    ],
  },
};

export function combatMoveList(): CombatMoveDefinition[] {
  return Object.values(COMBAT_MOVES);
}

export function isCombatMoveId(value: unknown): value is CombatMoveId {
  return typeof value === 'string' && value in COMBAT_MOVES;
}

export function normalizeLearnedAttacks(value: unknown): CombatMoveId[] {
  const learned = Array.isArray(value) ? value.filter(isCombatMoveId) : [];
  return [...new Set<CombatMoveId>([STARTER_ATTACK, ...learned])];
}

export function normalizeEquippedAttacks(value: unknown, learnedValue: unknown): CombatMoveId[] {
  const learned = normalizeLearnedAttacks(learnedValue);
  const requested = Array.isArray(value) ? value.filter(isCombatMoveId) : [];
  const equipped = [...new Set(requested)].filter((id) => learned.includes(id)).slice(0, MAX_EQUIPPED_ATTACKS);
  return equipped.length ? equipped : [STARTER_ATTACK];
}

export function equippedCombatMoves(snapshot: Pick<GameSnapshot, 'learnedAttacks' | 'equippedAttacks'>): CombatMoveDefinition[] {
  return normalizeEquippedAttacks(snapshot.equippedAttacks, snapshot.learnedAttacks).map((id) => COMBAT_MOVES[id]);
}

export function attackLearnedFromConversation(
  characterId: string,
  topicId: ConversationTopicId,
  snapshot: GameSnapshot,
): CombatMoveId | null {
  const relation = snapshot.relationships[characterId] ?? 0;
  if (characterId === 'gundula' && topicId === 'personal' && snapshot.flags.entryDebateWon) return 'agree-anyway';
  if (characterId === 'ronny' && topicId === 'personal' && relation >= 8) return 'logical-argument';
  if (characterId === 'andre' && topicId === 'personal' && relation >= 8) return 'dry-counter';
  if (characterId === 'rene' && topicId === 'plan' && relation >= 8) return 'camping-chair-block';
  if (characterId === 'lars' && topicId === 'weekend' && snapshot.flags.firstBeerOpened) return 'beer-offer';
  return null;
}

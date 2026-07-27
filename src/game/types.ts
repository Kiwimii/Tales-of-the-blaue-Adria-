export type GameMode =
  | 'intro'
  | 'creator'
  | 'shop'
  | 'world'
  | 'interior'
  | 'battle'
  | 'flip-cup'
  | 'beer-pong'
  | 'flunkyball';

export type Direction = 'up' | 'down' | 'left' | 'right';

export type Trait = 'charmant' | 'direkt' | 'chaotisch' | 'hilfsbereit' | 'beobachtend';

export type HairStyle = 'kurz' | 'welle' | 'buzz' | 'cap';

export type BodyType = 'schmal' | 'normal' | 'breit';

export type Accessory = 'keins' | 'brille' | 'bart' | 'ohrring';

export type Skill = 'charm' | 'nerve' | 'focus' | 'chaos' | 'teamwork';

export type ChallengeOutcome = 'great' | 'success' | 'failure' | 'disaster';

export type QuestStatus = 'locked' | 'active' | 'completed' | 'failed';

export type ChronicleTone = 'neutral' | 'good' | 'warn' | 'bad';

export type CombatMoveId =
  | 'classic-high-five'
  | 'aldi-shirt-show'
  | 'agree-anyway'
  | 'logical-argument'
  | 'dry-counter'
  | 'camping-chair-block'
  | 'beer-offer'
  | 'synchronised-cheer'
  | 'cup-eye-contact'
  | 'total-exaggeration';

export type FrustrationStatusId =
  | 'ueberrumpelt'
  | 'fremdschaemen'
  | 'leerlauf'
  | 'unterbrochen'
  | 'abgesichert'
  | 'verwirrt'
  | 'fokussiert'
  | 'fixiert';

export interface PlayerProfile {
  name: string;
  skinTone: string;
  hair: string;
  shirt: string;
  shorts: string;
  hairStyle: HairStyle;
  bodyType: BodyType;
  accessory: Accessory;
  trait: Trait;
}

export interface Needs {
  energy: number;
  hunger: number;
  thirst: number;
  bladder: number;
  alcohol: number;
  highness: number;
  hangover: number;
  courage: number;
}

export interface WeekendMetrics {
  dignity: number;
  chaos: number;
  reputation: number;
  momentum: number;
}

export interface TeamBonuses {
  battle: number;
  social: number;
  games: number;
  recovery: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  level: number;
  resolve: number;
  maxResolve: number;
  loyalty: number;
  bonuses: TeamBonuses;
}

export interface QuestProgress {
  status: QuestStatus;
  stage: number;
}

export interface ChronicleEntry {
  id: number;
  day: number;
  minutes: number;
  text: string;
  tone: ChronicleTone;
}

export interface ChallengeDefinition {
  skill: Skill;
  baseChance: number;
  relation?: string;
}

export interface EffectSet {
  needs?: Partial<Needs>;
  metrics?: Partial<WeekendMetrics>;
  relationships?: Record<string, number>;
  flags?: Record<string, boolean>;
  quests?: Record<string, QuestStatus>;
  items?: Record<string, number>;
  minutes?: number;
  recruit?: string;
}

export interface EncounterOption {
  id: string;
  label: string;
  hint: string;
  challenge: ChallengeDefinition;
  requiredItem?: string;
  consumeItemOnSuccess?: string;
  successText: string;
  failureText: string;
  greatText?: string;
  disasterText?: string;
  success: EffectSet;
  failure: EffectSet;
}

export interface EncounterDefinition {
  id: string;
  speaker: string;
  portrait: string;
  intro: string;
  options: EncounterOption[];
}

export interface EncounterResult {
  optionId: string;
  outcome: ChallengeOutcome;
  chance: number;
  roll: number;
  text: string;
}

export interface EncounterState {
  id: string;
  result: EncounterResult | null;
}

export interface PrologueState {
  introSeen: boolean;
  shoppingComplete: boolean;
  spent: number;
}

export interface SessionState {
  version: 3;
  mode: GameMode;
  profile: PlayerProfile | null;
  prologue: PrologueState;
  day: number;
  minutes: number;
  money: number;
  needs: Needs;
  metrics: WeekendMetrics;
  inventory: Record<string, number>;
  team: TeamMember[];
  relationships: Record<string, number>;
  learnedAttacks: CombatMoveId[];
  equippedAttacks: CombatMoveId[];
  quests: Record<string, QuestProgress>;
  activeQuest: string | null;
  flags: Record<string, boolean>;
  encounter: EncounterState | null;
  chronicle: ChronicleEntry[];
  worldPosition: { x: number; y: number };
  currentInterior: string | null;
  activityResults: Record<string, { attempts: number; completed: boolean; best: number }>;
}

export interface GameSnapshot extends SessionState {
  clockLabel: string;
  phaseLabel: string;
  conditionLabel: string;
  currentObjective: string;
}

import type { MiniGameQuality } from './minigames';

export type OlympiadDisciplineId = 'flipCup' | 'beerPong' | 'flunkyball';
export type SaturdayArcStep = 'dormant' | 'complaint' | 'testimonies' | 'song' | 'wake' | 'convince' | 'debate' | 'brawl' | 'won' | 'evicted';
export type SecretMillionaireRound = 0 | 1 | 2 | 3 | 4;

export interface OlympiadDisciplineResult {
  attempted: boolean;
  success: boolean;
  score: number;
  quality: MiniGameQuality;
  points: number;
}

export interface FridayOlympiadState {
  started: boolean;
  completed: boolean;
  current: OlympiadDisciplineId | '';
  points: number;
  afterparty: 'quiet' | 'one-more' | 'full-send' | '';
  disciplines: Record<OlympiadDisciplineId, OlympiadDisciplineResult>;
}

export interface SaturdayEvictionState {
  step: SaturdayArcStep;
  triggered: boolean;
  dannyTestimony: boolean;
  felixTimeline: boolean;
  farewellSongPlayed: boolean;
  victorySongPlayed: boolean;
  wakeProgress: number;
  wakeMood: number;
  maslAwake: boolean;
  maslConvinced: boolean;
  convinceRoute: 'friendship' | 'ego' | 'challenge' | 'emergency' | '';
  debatePressure: number;
  debateCrowd: number;
  debateTurns: number;
  debateUsed: string[];
  brawlWon: boolean;
  brawlAttempts: number;
  earlyEnding: boolean;
}

export interface SecretMillionaireState {
  unlocked: boolean;
  started: boolean;
  completed: boolean;
  round: SecretMillionaireRound;
  millionaireId: string;
  playerScore: number;
  rivalScore: number;
  accusations: Array<{ round: number; suspectId: string; correct: boolean; points: number }>;
  eliminated: string[];
  questioned: string[];
  winner: 'player' | 'rival' | '';
}

export interface WeekendArcState {
  version: 1;
  nightNoise: number;
  olympiad: FridayOlympiadState;
  saturday: SaturdayEvictionState;
  secretMillionaire: SecretMillionaireState;
}

export const OLYMPIAD_ORDER: OlympiadDisciplineId[] = ['flipCup', 'beerPong', 'flunkyball'];

export const SECRET_MILLIONAIRE_CANDIDATES = [
  'rene', 'lars', 'danny', 'gregor', 'masl', 'schubert',
  'felix', 'schima', 'ronny', 'manni', 'susi', 'jule',
] as const;

export const FAREWELL_SONG = `[Instrumental Intro]

Ohhhhhh
Ohhh ohhhh
Aaahhhh
Ahh
Ahhhhh
(Ohhhhhh)

[Chorus]
Es ist vorbei
Unser Herz gebrochen
(Es ist so traurig)
Wir müssen gehen
Unser liebe zur adria
Sie wird auf die Probe gestellt
(So gestellt)
Wir ziehen weiter
Zur nächsten adria
Goodbye 
(Adria, adria, adria)

[Verse]
Die Nachtruhe nicht eingehalten
(Sagen Sie!)
Stimmt das?
(Nein!)
Wir brauchen einen neuen Platz
Sie haben uns verloren
(Unsere Herzen sind zerbrochen)
Waren wir nicht um elf im Bett?
Gestern war doch so nett
Und jetzt müssen wir weg

[Chorus]
Es ist vorbei
Unser Herz gebrochen
(Es ist so traurig)
Wir müssen gehen
Unser liebe zur adria
Sie wird auf die Probe gestellt
(So gestellt)
Wir ziehen weiter
Zur nächsten adria
Goodbye 
(Adria, adria, adria)

[Verse]
Nun müssen wir warten
Dass der Alkohol vergeht
Der Kopf wird wieder frei
Wir essen unseren brei
Wir schreiben Google Bewertungen
(Die werden nicht positiv!)
Das gibt nur einen Stern!
Der Himmel grau
Heute werden wir hier nicht mehr blau
(Adria, adria, adria)

[Chorus]
Es ist vorbei
Unser Herz gebrochen
(Es ist so traurig)
Wir müssen gehen
Unser liebe zur adria
Sie wird auf die Probe gestellt
(So gestellt)
Wir ziehen weiter
Zur nächsten adria
Goodbye 
(Adria, adria, adria)

[Verse]
It is time
To say Goodbye 
(Goodbye)
Sie sagen wir haben geschrien 
Dabei haben wir nur getrunken
Wie kann man mit Bier im Mund schreien?
Alle am kotzen 
Sie sind alle fotzen
Wir ziehen weiter 
(Adria, adria, adria)

[Chorus]
Es ist vorbei
Unser Herz gebrochen
(Es ist so traurig)
Wir müssen gehen
Unser liebe zur adria
Sie wird auf die Probe gestellt
(So gestellt)
Wir ziehen weiter
Zur nächsten adria
Goodbye 
(Adria, adria, adria)

[Chorus]
Es ist vorbei
Unser Herz gebrochen
(Es ist so traurig)
Wir müssen gehen
Unser liebe zur adria
Sie wird auf die Probe gestellt
(So gestellt)
Wir ziehen weiter
Zur nächsten adria
Goodbye 
(Adria, adria, adria)

[Outro]
Masl unsere letzte Chance
Attacke
Geh diskutieren
Sonst ist es endgültig vorbei
Wir packen ein
Bis zwölf ist Zeit
Dann sind wir nicht mehr breit
Der Weg zum nächsten Platz ist nicht weit
Wir hören uns wieder
(Halt dein schnauze und geh heim du fotze)`;

export const VICTORY_SONG = `[Instrumental Intro]

Ohhhhhh
Ohhh ohhhh
Aaahhhh
Ahh
Ahhhhh
(Ohhhhhh)
Goodbye Adria - nicht!

[Chorus]
Es ist doch nicht vorbei
Unser Herz geheilt
(Es ist so schön)
Wir werden bleiben
Unser liebe zur adria
Ungebrochen, ungestellt
(Einfach grenzenlos)
Wir ziehen nicht weiter
(Wir ziehen einen durch!)
Oh ja!
Unsere einzig wahre!
Oh du liebe! 
(Adria, adria, adria)

[Verse]
Die Nachtruhe eingehalten
(Es waren haltlose Anschuldigungen!)
Stimmt das?
(Ja!)
Wir brauchen keinen neuen Platz
Sie haben uns wieder gewonnen
(Unsere Herzen vereint)
Waren wir nicht um elf im Bett?
(Nein waren wir nicht, aber egal)
Gestern war doch so nett
Und heute geht's pünktlich ins Bett.

[Chorus]
Es ist doch nicht vorbei
Unser Herz geheilt
(Es ist so schön)
Wir werden bleiben
Unser liebe zur adria
Ungebrochen, ungestellt
(Einfach grenzenlos)
Wir ziehen nicht weiter
(Wir ziehen einen durch!)
Oh ja!
Unsere einzig wahre!
Oh du liebe! 
(Adria, adria, adria)

[Verse]
Wir haben gewartet
Dass der Alkohol vergeht
Wir haben festgestellt 
Das Warten war unnötig
Dir Hände zittrig
(It's been too long)
Reich schnell ein Bier
Wir laden das Gewehr 
Reich schnell zwei Pils Patronen
Und dann wird gefeuert 
(Das gibt fünf Sterne auf Google!)
Oh du liebe!
(Adria, adria, adria)

[Chorus]
Es ist doch nicht vorbei
Unser Herz geheilt
(Es ist so schön)
Wir werden bleiben
Unser liebe zur adria
Ungebrochen, ungestellt
(Einfach grenzenlos)
Wir ziehen nicht weiter
(Wir ziehen einen durch!)
Oh ja!
Unsere einzig wahre!
Oh du liebe! 
(Adria, adria, adria)

[Verse]
It is time
To say Goodbye
nicht mehr!
(Ohhh hello, bonjour, fromage)
Sie sagen wir haben geschrien 
Dabei haben wir nur getrunken
Wie kann man mit Bier im Mund schreien?
Es hat sich herausgestellt:
(Geht nicht!)
Nein, geht nicht.
Aber trotzdem:
Alle am kotzen 
Sie sind alle fotzen
Wir bleiben hier
Bei unserer liebe!
(Adria, adria, adria)

[Chorus]
Es ist doch nicht vorbei
Unser Herz geheilt
(Es ist so schön)
Wir werden bleiben
Unser liebe zur adria
Ungebrochen, ungestellt
(Einfach grenzenlos)
Wir ziehen nicht weiter
(Wir ziehen einen durch!)
Oh ja!
Unsere einzig wahre!
Oh du liebe! 
(Adria, adria, adria)

[Chorus]
Es ist doch nicht vorbei
Unser Herz geheilt
(Es ist so schön)
Wir werden bleiben
Unser liebe zur adria
Ungebrochen, ungestellt
(Einfach grenzenlos)
Wir ziehen nicht weiter
(Wir ziehen einen durch!)
Oh ja!
Unsere einzig wahre!
Oh du liebe! 
(Adria, adria, adria)

[Outro]
Masl unsere Rettung 
Von der Leine los
Diskutiert in den Boden
Kam gestern erst spät an
Kann gar nicht mehr länger wach bleiben als bis zwölf Uhr
(Hat er selbst gesagt)
Muss nun doch auf seiner kaputten Matratze pennen
Und jetzt heisst es nicht mehr:

(Halt dein schnauze und geh heim du fotze)`;

export function defaultWeekendArcState(): WeekendArcState {
  const empty = (): OlympiadDisciplineResult => ({ attempted: false, success: false, score: 0, quality: 'failed', points: 0 });
  return {
    version: 1,
    nightNoise: 0,
    olympiad: {
      started: false,
      completed: false,
      current: '',
      points: 0,
      afterparty: '',
      disciplines: { flipCup: empty(), beerPong: empty(), flunkyball: empty() },
    },
    saturday: {
      step: 'dormant', triggered: false, dannyTestimony: false, felixTimeline: false,
      farewellSongPlayed: false, victorySongPlayed: false, wakeProgress: 0, wakeMood: 50,
      maslAwake: false, maslConvinced: false, convinceRoute: '', debatePressure: 0,
      debateCrowd: 0, debateTurns: 0, debateUsed: [], brawlWon: false, brawlAttempts: 0,
      earlyEnding: false,
    },
    secretMillionaire: {
      unlocked: false, started: false, completed: false, round: 0, millionaireId: '',
      playerScore: 0, rivalScore: 0, accusations: [], eliminated: [], questioned: [], winner: '',
    },
  };
}

export function olympiadPoints(success: boolean, quality: MiniGameQuality): number {
  if (!success) return 0;
  if (quality === 'perfect') return 5;
  if (quality === 'solid') return 3;
  return 2;
}

export function calculateNightNoise(input: {
  olympiadPoints: number;
  afterparty: FridayOlympiadState['afterparty'];
  alcohol: number;
  chaos: number;
  lateActivities: number;
  quietRest?: boolean;
}): number {
  const party = input.afterparty === 'full-send' ? 34 : input.afterparty === 'one-more' ? 19 : -12;
  const value = 8 + input.olympiadPoints * 2.2 + party + input.alcohol * .34 + input.chaos * .28 + input.lateActivities * 9 - (input.quietRest ? 8 : 0);
  return clamp(Math.round(value), 0, 100);
}

export function debateOpeningPressure(nightNoise: number, flags: Record<string, boolean>): number {
  let pressure = 42 + nightNoise * .43;
  if (flags['authority-goodwill']) pressure -= 7;
  if (flags['authority-drinking-bond']) pressure -= 5;
  if (flags['authority-ego-hook']) pressure -= 4;
  return clamp(Math.round(pressure), 32, 88);
}

export function brawlSetup(input: {
  pressure: number;
  crowd: number;
  wakeMood: number;
  relationshipMasl: number;
  nightNoise: number;
}): { playerHp: number; maslHp: number; gundulaHp: number; uliHp: number; enemyPower: number; maslPower: number } {
  const debateAdvantage = clamp((100 - input.pressure) * .28 + input.crowd * .18, 0, 28);
  return {
    playerHp: 100,
    maslHp: clamp(Math.round(58 + input.wakeMood * .28 + Math.max(0, input.relationshipMasl) * .18), 52, 92),
    gundulaHp: clamp(Math.round(100 - debateAdvantage), 70, 100),
    uliHp: clamp(Math.round(108 - debateAdvantage * .8), 78, 108),
    enemyPower: clamp(1 + input.nightNoise / 260 + input.pressure / 420, 1, 1.58),
    maslPower: clamp(.8 + input.wakeMood / 180 + Math.max(0, input.relationshipMasl) / 250, .82, 1.45),
  };
}

export function secretMillionaireId(seed: number): string {
  const normalized = Math.abs(Math.floor(seed));
  return SECRET_MILLIONAIRE_CANDIDATES[normalized % SECRET_MILLIONAIRE_CANDIDATES.length];
}

export function secretRoundPoints(round: number): number {
  return clamp(Math.floor(round), 1, 4);
}

export function secretRivalScore(seed: number): number {
  return 3 + Math.abs(Math.floor(seed * 17)) % 5;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

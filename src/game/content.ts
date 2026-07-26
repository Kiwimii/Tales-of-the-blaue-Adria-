import type {
  EncounterDefinition,
  Needs,
  QuestProgress,
  TeamMember,
} from './types';

export interface ItemDefinition {
  id: string;
  label: string;
  icon: string;
  price: number;
  max: number;
  description: string;
  effects?: Partial<Needs>;
}

export interface QuestDefinition {
  id: string;
  title: string;
  objective: string;
  reward: string;
}

export interface RelationshipCharacter {
  id: string;
  name: string;
  nickname: string;
  color: string;
  portrait: string;
  line: string;
  group: 'platzteam' | 'freunde' | 'campingplatz';
}

export const ITEMS: Record<string, ItemDefinition> = {
  wasser: {
    id: 'wasser',
    label: 'Wasser',
    icon: '💧',
    price: 3,
    max: 6,
    description: 'Senkt Durst, füllt aber die Blase.',
    effects: { thirst: -30, bladder: 12, courage: -1 },
  },
  wuerste: {
    id: 'wuerste',
    label: 'Würste',
    icon: '🌭',
    price: 6,
    max: 4,
    description: 'Solide Grundlage für schlechte Entscheidungen.',
    effects: { hunger: -36, thirst: 5 },
  },
  bier: {
    id: 'bier',
    label: 'Bier',
    icon: '🍺',
    price: 4,
    max: 8,
    description: 'Mut hoch, Präzision später fragwürdig.',
    effects: { thirst: -7, bladder: 19, alcohol: 18, courage: 7 },
  },
  batida: {
    id: 'batida',
    label: 'Batida de Coco',
    icon: '🥥',
    price: 10,
    max: 3,
    description: 'Starker sozialer Türöffner mit Folgekosten.',
    effects: { bladder: 10, alcohol: 24, courage: 9 },
  },
  chips: {
    id: 'chips',
    label: 'Chips',
    icon: '🥨',
    price: 3,
    max: 4,
    description: 'Günstig, salzig, nur bedingt vernünftig.',
    effects: { hunger: -18, thirst: 8 },
  },
  kaffee: {
    id: 'kaffee',
    label: 'Kaffee',
    icon: '☕',
    price: 4,
    max: 4,
    description: 'Kurzfristige Energie gegen mehr Durst.',
    effects: { energy: 20, thirst: 5, bladder: 10, hangover: -5 },
  },
  klopapier: {
    id: 'klopapier',
    label: 'Klopapier',
    icon: '🧻',
    price: 2,
    max: 2,
    description: 'Unspektakulär, bis es plötzlich alles entscheidet.',
  },
  tablette: {
    id: 'tablette',
    label: 'Kopfschmerztablette',
    icon: '💊',
    price: 4,
    max: 3,
    description: 'Dämpft den Kater. Kein Freifahrtschein.',
    effects: { hangover: -38 },
  },
};

export const QUESTS: Record<string, QuestDefinition> = {
  entry: {
    id: 'entry',
    title: 'Rein in den Wahnsinn',
    objective: 'Überzeuge Gundula und Uli am Eingang.',
    reward: 'Freier Zugang zum Campingplatz',
  },
  paper: {
    id: 'paper',
    title: 'Die braune Krise',
    objective: 'Bring Manni am Sanitärgebäude Klopapier.',
    reward: 'Manni als Unterstützer',
  },
  rival: {
    id: 'rival',
    title: 'Ronnys ungefragter Vortrag',
    objective: 'Besiege Rivalen-Ronny im Camping-Duell.',
    reward: 'Ronny und Zugang zum Strand',
  },
  flip: {
    id: 'flip',
    title: 'Becher, Würde, Boden',
    objective: 'Gewinne Flip Cup im Südlager.',
    reward: 'Ruf und Gruppenrespekt',
  },
  pong: {
    id: 'pong',
    title: 'Kunstflug im Plastikbecher',
    objective: 'Versenke drei Würfe beim Beer Pong im Partyzelt.',
    reward: 'Susi-Respekt und Ruf',
  },
  flunky: {
    id: 'flunky',
    title: 'Flasche um, Resthirn aus',
    objective: 'Gewinne die Flunkyball-Staffel am Strand.',
    reward: 'Strandruhm und Momentum',
  },
  reunion: {
    id: 'reunion',
    title: 'Neun Freunde, null Aufsicht',
    objective: 'Finde die komplette Freundesgruppe auf dem Platz.',
    reward: 'Gruppenbonus und ein erstaunlich vollständiges Wochenende',
  },
  recovery: {
    id: 'recovery',
    title: 'Noch ein Mensch werden',
    objective: 'Stabilisiere Energie, Durst und Kater durch kluge Pausen.',
    reward: 'Momentum für die nächste Probe',
  },
};

export const INITIAL_QUESTS: Record<string, QuestProgress> = Object.fromEntries(
  Object.keys(QUESTS).map((id) => [id, { status: id === 'entry' ? 'active' : 'locked', stage: 0 }]),
);

export const RELATIONSHIP_CHARACTERS: RelationshipCharacter[] = [
  {
    id: 'gundula',
    name: 'Gundula',
    nickname: 'Die Platzordnung',
    color: '#e57c9d',
    portrait: 'G',
    line: '„Ich sehe dich. Auch wenn ich gerade nicht hinsehe. Das ist Verwaltung.“',
    group: 'platzteam',
  },
  {
    id: 'uli',
    name: 'Uli',
    nickname: 'Der Parkplatz',
    color: '#61a6d0',
    portrait: 'U',
    line: '„Parkplatz vier. Die Zahl zwischen drei und fünf.“',
    group: 'platzteam',
  },
  {
    id: 'manni',
    name: 'Manni Mische',
    nickname: 'Der Versorger',
    color: '#63b879',
    portrait: 'M',
    line: '„Mischungsverhältnis ist auch nur angewandte Mathematik.“',
    group: 'campingplatz',
  },
  {
    id: 'ronny',
    name: 'Rivalen-Ronny',
    nickname: 'Parkplatz-Philosoph',
    color: '#e45f4d',
    portrait: 'R',
    line: '„Ich erkläre dir das kurz.“ Er erklärt nichts jemals kurz.',
    group: 'campingplatz',
  },
  {
    id: 'andre',
    name: 'André',
    nickname: 'Der Organisator',
    color: '#f0b64f',
    portrait: 'A',
    line: '„Ich hatte einen Ablaufplan. Dann seid ihr angekommen.“',
    group: 'freunde',
  },
  {
    id: 'rene',
    name: 'René',
    nickname: 'Der Diplomat',
    color: '#4fb7a6',
    portrait: 'R',
    line: '„Lass mich reden. Du kannst so aussehen, als würdest du etwas bereuen.“',
    group: 'freunde',
  },
  {
    id: 'lars',
    name: 'Lars',
    nickname: 'Der Pegelmanager',
    color: '#5b9be0',
    portrait: 'L',
    line: '„Wasser? Klar. Ist doch im Bier drin.“',
    group: 'freunde',
  },
  {
    id: 'danny',
    name: 'Danny',
    nickname: 'Der Frühabreiser',
    color: '#dd6e73',
    portrait: 'D',
    line: '„Sonntag früh habe ich einen wichtigen Termin: nicht aufräumen.“',
    group: 'freunde',
  },
  {
    id: 'gregor',
    name: 'Gregor',
    nickname: 'Der Grillphilosoph',
    color: '#d8793d',
    portrait: 'G',
    line: '„Die Wurst ist nicht verbrannt. Sie hat Charakter entwickelt.“',
    group: 'freunde',
  },
  {
    id: 'felix',
    name: 'Felix',
    nickname: 'Der Flirtbeauftragte',
    color: '#bd65cf',
    portrait: 'F',
    line: '„Blickkontakt. Gut, sie suchte die Toilette, aber Blickkontakt.“',
    group: 'freunde',
  },
  {
    id: 'masl',
    name: 'Masl',
    nickname: 'Der Spielleiter',
    color: '#68b86f',
    portrait: 'M',
    line: '„Wenn ich verliere, war die Regel offensichtlich unklar.“',
    group: 'freunde',
  },
  {
    id: 'schubert',
    name: 'Schubert',
    nickname: 'Der Botaniker',
    color: '#6fa56d',
    portrait: 'S',
    line: '„Das sind keine roten Augen. Das ist botanische Begeisterung.“',
    group: 'freunde',
  },
  {
    id: 'schima',
    name: 'Schima',
    nickname: 'Der Nachtmensch',
    color: '#596ab8',
    portrait: 'S',
    line: '„Tagsüber Energiesparmodus. Ab Mitternacht gesellschaftliche Abrissbirne.“',
    group: 'freunde',
  },
];

export const FRIEND_IDS = RELATIONSHIP_CHARACTERS
  .filter((character) => character.group === 'freunde')
  .map((character) => character.id);

export const TEAM_MEMBERS: Record<string, TeamMember> = {
  manni: {
    id: 'manni',
    name: 'Manni Mische',
    role: 'Versorger',
    level: 1,
    resolve: 66,
    maxResolve: 66,
    loyalty: 58,
    bonuses: { battle: 1, social: 2, games: 2, recovery: 5 },
  },
  ronny: {
    id: 'ronny',
    name: 'Rivalen-Ronny',
    role: 'Hartnäckiger Diskutierer',
    level: 2,
    resolve: 74,
    maxResolve: 74,
    loyalty: 48,
    bonuses: { battle: 6, social: 2, games: 1, recovery: 0 },
  },
};

export const ENCOUNTERS: Record<string, EncounterDefinition> = {
  'gundula-entry': {
    id: 'gundula-entry',
    speaker: 'Gundula',
    portrait: 'G',
    intro: '„Name, Gruppe, Platznummer. Und lüg bitte so, dass es wenigstens unterhaltsam ist.“',
    options: [
      {
        id: 'charm',
        label: 'Die freundliche Verwaltungsoffensive',
        hint: 'Charme · fair, mit gutem Zustand verlässlich',
        challenge: { skill: 'charm', baseChance: 60, relation: 'gundula' },
        successText: 'Gundula akzeptiert deine erstaunlich vollständige Geschichte.',
        failureText: 'Die Geschichte klingt höflich, aber auch nach einem Haftpflichtschaden mit Beinen.',
        greatText: 'Gundula lächelt kurz. Niemand ist sicher, ob das schon einmal passiert ist.',
        disasterText: 'Du nennst sie versehentlich „Camping-Mama“. Die Luft gefriert.',
        success: {
          flags: { gundulaConvinced: true },
          relationships: { gundula: 12 },
          metrics: { dignity: 3, reputation: 2, momentum: 5 },
          minutes: 5,
        },
        failure: {
          relationships: { gundula: -6 },
          metrics: { dignity: -4, chaos: 2, momentum: -4 },
          minutes: 5,
        },
      },
      {
        id: 'direct',
        label: 'Platznummer, Regeln, klare Ansage',
        hint: 'Nerven · sachlich und ohne Schleimspur',
        challenge: { skill: 'nerve', baseChance: 55, relation: 'gundula' },
        successText: 'Kurz, korrekt, belastbar. Gundula findet nichts zum Zerlegen.',
        failureText: 'Die Ansage war klar. Leider auch klar falsch.',
        success: {
          flags: { gundulaConvinced: true },
          relationships: { gundula: 8 },
          metrics: { dignity: 5, momentum: 4 },
          minutes: 4,
        },
        failure: {
          relationships: { gundula: -4 },
          metrics: { dignity: -2, momentum: -3 },
          minutes: 4,
        },
      },
      {
        id: 'batida',
        label: 'Batida de Coco erwähnen',
        hint: 'Teamwork · nur mit Batida im Inventar',
        requiredItem: 'batida',
        consumeItemOnSuccess: 'batida',
        challenge: { skill: 'teamwork', baseChance: 78, relation: 'gundula' },
        successText: 'Die Kokosdiplomatie funktioniert. Gundula erklärt das Gespräch für beendet.',
        failureText: 'Gundula lehnt Bestechung ab und notiert sich trotzdem die Flaschenmarke.',
        success: {
          flags: { gundulaConvinced: true },
          relationships: { gundula: 15 },
          metrics: { reputation: 1, chaos: 1, momentum: 3 },
          minutes: 3,
        },
        failure: {
          relationships: { gundula: -8 },
          metrics: { dignity: -5, chaos: 3, momentum: -5 },
          minutes: 3,
        },
      },
    ],
  },
  'uli-entry': {
    id: 'uli-entry',
    speaker: 'Uli',
    portrait: 'U',
    intro: '„Parkplatz vier. Nicht drei, nicht fünf. Zeig mir, dass du eine Zahl und ein Lenkrad gleichzeitig verstehst.“',
    options: [
      {
        id: 'observe',
        label: 'Erst Markierung und Schilder prüfen',
        hint: 'Fokus · langsam, aber mit wenig Risiko',
        challenge: { skill: 'focus', baseChance: 65, relation: 'uli' },
        successText: 'Das Auto steht exakt. Uli verliert für einen Moment seinen Lebensinhalt.',
        failureText: 'Du analysierst hervorragend und parkst trotzdem auf Platz fünf.',
        greatText: 'Uli misst nach. Zweimal. Keine Beanstandung.',
        success: {
          flags: { uliConvinced: true },
          relationships: { uli: 13 },
          metrics: { dignity: 4, momentum: 5 },
          minutes: 10,
        },
        failure: {
          relationships: { uli: -4 },
          metrics: { dignity: -3, momentum: -3 },
          minutes: 10,
        },
      },
      {
        id: 'direct',
        label: 'In einem Zug neu einparken',
        hint: 'Nerven · schneller, aber unbarmherzig',
        challenge: { skill: 'nerve', baseChance: 52, relation: 'uli' },
        successText: 'Ein Zug, sauberer Winkel, keine Diskussion. Uli nickt.',
        failureText: 'Der Winkel ist geometrisch interessant und praktisch unbrauchbar.',
        disasterText: 'Du fährst über den Begrenzungskegel. Uli wirkt persönlich verletzt.',
        success: {
          flags: { uliConvinced: true },
          relationships: { uli: 10 },
          metrics: { dignity: 6, reputation: 2, momentum: 6 },
          minutes: 6,
        },
        failure: {
          relationships: { uli: -7 },
          metrics: { dignity: -5, chaos: 3, momentum: -5 },
          minutes: 6,
        },
      },
      {
        id: 'chaos',
        label: 'Behaupten, Platz fünf sei das neue vier',
        hint: 'Chaos · hohe Ausschläge in beide Richtungen',
        challenge: { skill: 'chaos', baseChance: 43, relation: 'uli' },
        successText: 'Die Absurdität überlastet Ulis Argumentationsroutine. Er winkt dich durch.',
        failureText: 'Uli holt einen laminierten Lageplan. Du hast verloren.',
        success: {
          flags: { uliConvinced: true },
          relationships: { uli: 4 },
          metrics: { chaos: 5, reputation: 4, momentum: 7 },
          minutes: 4,
        },
        failure: {
          relationships: { uli: -10 },
          metrics: { dignity: -6, chaos: 7, momentum: -7 },
          minutes: 7,
        },
      },
    ],
  },
  'manni-paper': {
    id: 'manni-paper',
    speaker: 'Manni Mische',
    portrait: 'M',
    intro: '„Kabine drei ist gefallen. Wenn du Klopapier hast, schulde ich dir mein Leben. Oder zumindest den Nachmittag.“',
    options: [
      {
        id: 'help',
        label: 'Klopapier überreichen',
        hint: 'Teamwork · benötigt eine Rolle Klopapier',
        requiredItem: 'klopapier',
        consumeItemOnSuccess: 'klopapier',
        challenge: { skill: 'teamwork', baseChance: 95, relation: 'manni' },
        successText: 'Manni verschwindet in Kabine drei und kehrt als loyaler Versorger zurück.',
        failureText: 'Die Rolle fällt in eine Pfütze. Niemand spricht darüber.',
        success: {
          recruit: 'manni',
          relationships: { manni: 24 },
          metrics: { dignity: 5, reputation: 6, momentum: 8 },
          quests: { paper: 'completed' },
          minutes: 8,
        },
        failure: {
          relationships: { manni: 2 },
          metrics: { chaos: 2, momentum: -2 },
          minutes: 8,
        },
      },
      {
        id: 'advice',
        label: 'Nur moralische Unterstützung anbieten',
        hint: 'Charme · gratis, aber nicht besonders hilfreich',
        challenge: { skill: 'charm', baseChance: 28, relation: 'manni' },
        successText: 'Manni lacht trotz allem. Die Lage bleibt kritisch, eure Beziehung nicht.',
        failureText: 'Manni: „Danke für nichts. Sehr poetisch formuliert, aber nichts.“',
        success: {
          relationships: { manni: 5 },
          metrics: { reputation: 1, momentum: 2 },
          minutes: 3,
        },
        failure: {
          relationships: { manni: -3 },
          metrics: { dignity: -2, momentum: -2 },
          minutes: 3,
        },
      },
    ],
  },
};

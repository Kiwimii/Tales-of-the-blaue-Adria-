import type { GameSnapshot } from '../../game/types';
import {
  CONVERSATION_TOPICS,
  ROMANCE_PROFILES,
  conversationTopicOutcome,
  dynamicOpening,
  flirtChance,
  flirtReaction,
  giftReaction,
  type ConversationTopicId,
  type RomanceId,
} from '../../game/socialSystem';
import { COMBAT_MOVES, attackLearnedFromConversation } from '../../game/combatMoves';
import { FRIEND_PROFILES, type FriendId } from '../../game/friendRoster';
import { ITEMS, RELATIONSHIP_CHARACTERS } from '../../game/content';
import type { CampaignMetaState } from './metaStore';
import { seededLine } from './narrative';

export type DialogueAction =
  | { type: 'topic'; topic: ConversationTopicId }
  | { type: 'flirt' }
  | { type: 'gift'; itemId: string }
  | { type: 'recruit' }
  | { type: 'leave' };

export interface DialogueChoice {
  id: string;
  label: string;
  hint: string;
  action: DialogueAction;
  disabled?: boolean;
  tone?: 'normal' | 'flirt' | 'gift' | 'team' | 'danger';
}

export interface DialogueResolution {
  text: string;
  relationship: number;
  minutes: number;
  success?: boolean;
  learnedAttack?: keyof typeof COMBAT_MOVES;
  romanceDelta?: number;
  consumeItem?: string;
  recruit?: boolean;
}

const WEEKEND_LABELS = [
  'Über die bisherigen Schäden reden',
  'Den Wochenendstand schonungslos bilanzieren',
  'So tun, als wäre alles nach Plan gelaufen',
  'Über Gruppe, Platz und schlechte Prioritäten reden',
];
const PERSONAL_LABELS = [
  'Etwas Persönliches riskieren',
  'Für acht Minuten tatsächlich zuhören',
  'Die Ironie kurz abstellen',
  'Nachfragen, ohne sofort von sich zu erzählen',
];
const PLAN_LABELS = [
  'Gemeinsam den nächsten Unsinn strukturieren',
  'Einen Plan entwickeln, der bis zum ersten Bier hält',
  'Aufgaben verteilen, bevor alle verschwinden',
  'Praktisch werden und Verantwortliche benennen',
];

const FLIRT_LABELS: Record<RomanceId, string[]> = {
  susi: [
    'Susi zu einem Duell ohne Becher herausfordern',
    'Selbstironie statt Anmachspruch versuchen',
    'Blickkontakt halten, ohne eine Statistik daraus zu machen',
  ],
  jule: [
    'Erst Wasser anbieten, dann Charakter zeigen',
    'Beim Aufräumen helfen und es nicht erwähnen',
    'Direkt sein, aber ausnahmsweise nicht laut',
  ],
  kira: [
    'Eine echte Geschichte erzählen – oder eine sehr gute Lüge',
    'Das Licht loben, ohne sofort ein Foto von sich zu verlangen',
    'Eine ruhige Minute anbieten, die nicht peinlich gefüllt wird',
  ],
};

const GENERIC_OPENINGS: Record<string, string[]> = {
  gundula: [
    'Gundula hebt das Klemmbrett. Damit gilt das Gespräch offiziell als begonnen und emotional als beendet.',
    '„Sprechen Sie.“ Gundula hat bereits beschlossen, welche Teile falsch sind.',
    'Gundula betrachtet dich wie einen Stellplatz, der zwei Zentimeter über die Markierung ragt.',
  ],
  uli: [
    'Uli lässt den Schlüsselbund kreisen. Irgendwo wird vorsorglich eine Tür nervös.',
    '„Kurz machen.“ Uli sagt das mit der Ruhe eines Mannes, der selbst gleich zwölf Minuten reden wird.',
    'Uli prüft deine Haltung, den Abstand zum Weg und vermutlich deine Betriebserlaubnis.',
  ],
  ronny: [
    'Ronny beginnt mit „Ganz objektiv“. Mehr Warnung gibt es nicht.',
    'Ronny hat bereits eine Meinung zu deiner Meinung und wartet nur noch auf das Beweismaterial.',
    '„Ich erkläre dir das kurz.“ Die Sonne sinkt merklich tiefer.',
  ],
};

export function dialogueOpening(characterId: string, snapshot: GameSnapshot, meta: CampaignMetaState): string {
  const counter = meta.conversationCounts[characterId] ?? 0;
  const custom = GENERIC_OPENINGS[characterId];
  if (custom) return seededLine(custom, counter + snapshot.day * 11 + Math.floor(snapshot.minutes / 20));
  return dynamicOpening(characterId, snapshot);
}

export function dialogueChoices(characterId: string, snapshot: GameSnapshot, meta: CampaignMetaState): DialogueChoice[] {
  const counter = meta.conversationCounts[characterId] ?? 0;
  const relation = snapshot.relationships[characterId] ?? 0;
  const choices: DialogueChoice[] = CONVERSATION_TOPICS.map((topic) => {
    const labels = topic.id === 'weekend' ? WEEKEND_LABELS : topic.id === 'personal' ? PERSONAL_LABELS : PLAN_LABELS;
    return {
      id: `topic:${topic.id}`,
      label: seededLine(labels, counter + characterId.length + topic.id.length),
      hint: topic.id === 'personal'
        ? relation >= 12 ? 'Genug Vertrauen für echte Nähe' : 'Noch vorsichtig – Beziehung hilft'
        : topic.hint,
      action: { type: 'topic', topic: topic.id },
    };
  });

  const romance = ROMANCE_PROFILES[characterId as RomanceId];
  if (romance) {
    const chance = flirtChance(characterId, snapshot);
    const blocked = meta.romance[romance.id].boundaryStrikes >= 3;
    choices.push({
      id: 'flirt',
      label: blocked ? 'Die Grenze respektieren und normal reden' : seededLine(FLIRT_LABELS[romance.id], counter + snapshot.minutes),
      hint: blocked ? 'Weitere Versuche sind für dieses Wochenende beendet' : `Flirtprobe · aktuelle Chance ${chance}/20`,
      action: blocked ? { type: 'topic', topic: 'weekend' } : { type: 'flirt' },
      disabled: blocked,
      tone: blocked ? 'danger' : 'flirt',
    });
  }

  const giftable = Object.keys(snapshot.inventory)
    .filter((id) => (snapshot.inventory[id] ?? 0) > 0 && Boolean(ITEMS[id]))
    .slice(0, 4);
  for (const itemId of giftable) {
    choices.push({
      id: `gift:${itemId}`,
      label: `${ITEMS[itemId].icon} ${ITEMS[itemId].label} anbieten`,
      hint: romance ? 'Geschenke wirken nach Persönlichkeit, nicht nach Preis' : 'Gruppenversorgung oder Bestechung – je nach Perspektive',
      action: { type: 'gift', itemId },
      tone: 'gift',
    });
  }

  const friend = FRIEND_PROFILES[characterId as FriendId];
  if (friend) {
    choices.push({
      id: 'recruit',
      label: 'Ins aktive Dreierteam holen',
      hint: relation >= friend.recruitmentThreshold
        ? `Beziehung reicht · Schwelle ${friend.recruitmentThreshold}`
        : `Noch ${friend.recruitmentThreshold - relation} Beziehungspunkte nötig`,
      action: { type: 'recruit' },
      disabled: relation < friend.recruitmentThreshold || meta.activeTeam.includes(characterId),
      tone: 'team',
    });
  }

  choices.push({ id: 'leave', label: 'Gespräch beenden, bevor es ehrlich wird', hint: 'Keine Zeitkosten', action: { type: 'leave' } });
  return rotateChoices(choices, counter);
}

export function resolveDialogueAction(
  characterId: string,
  action: DialogueAction,
  snapshot: GameSnapshot,
  random: () => number = Math.random,
): DialogueResolution {
  if (action.type === 'leave') return { text: 'Ihr beendet das Gespräch in einem Moment, der später von beiden Seiten als Absicht dargestellt wird.', relationship: 0, minutes: 0 };

  if (action.type === 'topic') {
    const outcome = conversationTopicOutcome(characterId, action.topic, snapshot);
    const learned = attackLearnedFromConversation(characterId, action.topic, snapshot);
    const extra = learned ? ` Du lernst dabei „${COMBAT_MOVES[learned].label}“ – eine Technik, die außerhalb dieses Platzes schwer vermittelbar wäre.` : '';
    return {
      text: `${variantTopicText(characterId, action.topic, snapshot, outcome.text)}${extra}`,
      relationship: outcome.relationship,
      minutes: outcome.minutes,
      success: outcome.relationship > 0,
      learnedAttack: learned ?? undefined,
    };
  }

  if (action.type === 'flirt') {
    const threshold = flirtChance(characterId, snapshot);
    const roll = 1 + Math.floor(random() * 20);
    const success = roll <= threshold;
    const relationship = success ? (roll <= Math.max(2, Math.floor(threshold / 3)) ? 9 : 6) : snapshot.needs.alcohol >= 38 ? -6 : -2;
    const romanceDelta = success ? (relationship >= 9 ? 12 : 8) : relationship;
    return {
      text: `${flirtReaction(characterId, success, snapshot)} ${success ? `Wurf ${roll}/${threshold}: Der Moment bleibt stehen, ohne sofort umzufallen.` : `Wurf ${roll}/${threshold}: Die Pointe erreicht nur den Sicherheitsdienst.`}`,
      relationship,
      romanceDelta,
      minutes: 7,
      success,
    };
  }

  if (action.type === 'gift') {
    const reaction = giftReaction(characterId, action.itemId);
    return {
      text: reaction.text,
      relationship: reaction.delta,
      minutes: 2,
      success: reaction.delta > 0,
      romanceDelta: ROMANCE_PROFILES[characterId as RomanceId] ? reaction.delta : undefined,
      consumeItem: action.itemId,
    };
  }

  const profile = FRIEND_PROFILES[characterId as FriendId];
  const person = RELATIONSHIP_CHARACTERS.find((entry) => entry.id === characterId);
  return {
    text: profile
      ? `${person?.name ?? characterId} sagt zu. Das aktive Team gewinnt ${profile.strengths[0]}, verliert aber jede Ausrede, warum niemand zuständig war.`
      : 'Diese Person ist nicht für dein aktives Team vorgesehen. Manche Beziehungen profitieren von klaren Grenzen.',
    relationship: profile ? 2 : 0,
    minutes: 2,
    success: Boolean(profile),
    recruit: Boolean(profile),
  };
}

function variantTopicText(characterId: string, topic: ConversationTopicId, snapshot: GameSnapshot, fallback: string): string {
  const relation = snapshot.relationships[characterId] ?? 0;
  const pools: Record<ConversationTopicId, string[]> = {
    weekend: [
      `${fallback} Danach einigt ihr euch darauf, die bisherigen Ereignisse erst Sonntag juristisch einzuordnen.`,
      `${fallback} Die Bilanz wird besser, sobald ihr mehrere Details gemeinsam falsch erinnert.`,
      `${fallback} Ihr nennt es Gruppendynamik, weil „fortlaufende Fehlentscheidung“ zu negativ klingt.`,
    ],
    personal: [
      relation >= 12 ? `${fallback} Für einen Moment ist das Gespräch weder laut noch ironisch. Beide bemerken es, keiner meldet es.` : `${fallback} Mehr Nähe wäre möglich, aber Vertrauen lässt sich nicht wie Bier im Sechserpack nachkaufen.`,
      `${fallback} Die Wahrheit steht kurz im Raum und wird dann vorsichtig neben den Campingstuhl gestellt.`,
      `${fallback} Niemand macht einen Witz. Das ist auf diesem Platz bereits Intimität.`,
    ],
    plan: [
      `${fallback} Der Plan enthält Verantwortliche, Uhrzeiten und damit drei Dinge, die später bestritten werden können.`,
      `${fallback} Nach sieben Minuten existiert eine Aufgabenliste. Nach acht Minuten sucht jemand den Stift.`,
      `${fallback} Ihr verteilt Arbeit so gerecht, dass jeder überzeugt ist, weniger als die anderen zu tun.`,
    ],
  };
  return seededLine(pools[topic], snapshot.day * 17 + snapshot.minutes + characterId.length);
}

function rotateChoices(choices: DialogueChoice[], seed: number): DialogueChoice[] {
  const fixed = choices.filter((choice) => choice.action.type === 'leave');
  const rotating = choices.filter((choice) => choice.action.type !== 'leave');
  if (!rotating.length) return choices;
  const offset = Math.abs(seed) % rotating.length;
  return [...rotating.slice(offset), ...rotating.slice(0, offset), ...fixed];
}

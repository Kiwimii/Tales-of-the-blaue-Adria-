import type { GameSnapshot, Needs, WeekendMetrics } from '../../game/types';
import { COMBAT_MOVES, attackLearnedFromConversation } from '../../game/combatMoves';
import { FRIEND_PROFILES, type FriendId } from '../../game/friendRoster';
import { ITEMS, RELATIONSHIP_CHARACTERS } from '../../game/content';
import {
  ROMANCE_PROFILES,
  flirtChance,
  flirtReaction,
  giftReaction,
  type RomanceId,
} from '../../game/socialSystem';
import type { CampaignMetaState } from './metaStore';
import {
  CHARACTER_VOICES,
  characterChoices,
  characterOpening,
  resolveCharacterChoice,
  type DialogueApproach,
  type DialogueTopic,
} from './characterVoices';

export type DialogueAction =
  | { type: 'character'; choiceId: string; topic: DialogueTopic; approach: DialogueApproach }
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
  risk?: 'safe' | 'balanced' | 'risky';
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
  needs?: Partial<Needs>;
  metrics?: Partial<WeekendMetrics>;
  flags?: Record<string, boolean>;
  ripples?: Array<{ id: string; delta: number }>;
  followUp?: string;
  consequenceLabel?: string;
}

export function dialogueOpening(characterId: string, snapshot: GameSnapshot, meta: CampaignMetaState): string {
  return characterOpening(characterId, snapshot, meta);
}

export function dialogueChoices(characterId: string, snapshot: GameSnapshot, meta: CampaignMetaState): DialogueChoice[] {
  const relation = snapshot.relationships[characterId] ?? 0;
  const voiceChoices = characterChoices(characterId, snapshot, meta).map<DialogueChoice>((entry) => ({
    id: `character:${entry.id}`,
    label: entry.label,
    hint: entry.hint,
    risk: entry.risk,
    tone: entry.risk === 'risky' ? 'danger' : 'normal',
    action: { type: 'character', choiceId: entry.id, topic: entry.topic, approach: entry.approach },
  }));

  const romance = ROMANCE_PROFILES[characterId as RomanceId];
  if (romance) {
    const chance = flirtChance(characterId, snapshot);
    const state = meta.romance[romance.id];
    const blocked = state.boundaryStrikes >= 3;
    voiceChoices.push({
      id: 'flirt',
      label: blocked ? 'Die gesetzte Grenze respektieren' : flirtLabel(romance.id, meta.conversationCounts[characterId] ?? 0),
      hint: blocked
        ? 'Weitere Flirtversuche sind für dieses Wochenende beendet. Normale Gespräche bleiben möglich.'
        : `ROMANTISCHES RISIKO · Beziehung ${relation >= 0 ? '+' : ''}${relation} · aktuelle Probe ${chance}/20`,
      action: blocked ? { type: 'leave' } : { type: 'flirt' },
      disabled: blocked,
      tone: blocked ? 'danger' : 'flirt',
      risk: 'risky',
    });
  }

  for (const itemId of giftableItems(snapshot, characterId)) {
    const reaction = giftReaction(characterId, itemId);
    const likely = reaction.delta >= 5 ? 'passt sehr gut' : reaction.delta < 0 ? 'wahrscheinlich unpassend' : 'neutrale Aufmerksamkeit';
    voiceChoices.push({
      id: `gift:${itemId}`,
      label: `${ITEMS[itemId].icon} ${ITEMS[itemId].label} anbieten`,
      hint: `GESCHENK · ${likely} · wird verbraucht`,
      action: { type: 'gift', itemId },
      tone: reaction.delta < 0 ? 'danger' : 'gift',
      risk: reaction.delta < 0 ? 'risky' : 'safe',
    });
  }

  const friend = FRIEND_PROFILES[characterId as FriendId];
  if (friend) {
    const active = meta.activeTeam.includes(characterId);
    voiceChoices.push({
      id: 'recruit',
      label: active ? 'Bereits im aktiven Team' : `${RELATIONSHIP_CHARACTERS.find((entry) => entry.id === characterId)?.name ?? characterId} ins Team holen`,
      hint: relation >= friend.recruitmentThreshold
        ? `TEAM · Loyalität reicht · bringt ${friend.strengths[0]}`
        : `TEAM · noch ${Math.max(0, friend.recruitmentThreshold - relation)} Beziehungspunkte bis zur Zusage`,
      action: { type: 'recruit' },
      disabled: active || relation < friend.recruitmentThreshold,
      tone: 'team',
      risk: 'safe',
    });
  }

  voiceChoices.push({
    id: 'leave',
    label: 'Gespräch beenden',
    hint: 'Keine weitere Zeit · die Figur erinnert sich an die bisherigen Entscheidungen',
    action: { type: 'leave' },
    risk: 'safe',
  });
  return voiceChoices;
}

export function resolveDialogueAction(
  characterId: string,
  action: DialogueAction,
  snapshot: GameSnapshot,
  meta: CampaignMetaState,
  random: () => number = Math.random,
): DialogueResolution {
  if (action.type === 'leave') {
    return {
      text: 'Das Gespräch endet ohne zusätzlichen Schaden. Auf diesem Platz ist ein sauberer Abgang bereits soziale Kompetenz.',
      relationship: 0,
      minutes: 0,
      success: true,
      followUp: 'Spätere Gespräche berücksichtigen den bisherigen Ton und offene Themen.',
    };
  }

  if (action.type === 'character') {
    const consequence = resolveCharacterChoice(characterId, action.choiceId, snapshot, meta, random);
    const learned = attackLearnedFromConversation(characterId, action.topic, snapshot);
    const learnedText = learned
      ? ` Du erkennst darin die Kampftechnique „${COMBAT_MOVES[learned].label}“.`
      : '';
    return {
      text: `${consequence.text}${learnedText}`,
      relationship: consequence.relationship,
      minutes: action.topic === 'personal' ? 9 : action.topic === 'plan' ? 8 : 6,
      success: consequence.success,
      learnedAttack: learned ?? undefined,
      needs: consequence.needs,
      metrics: consequence.metrics,
      flags: consequence.flags,
      ripples: consequence.ripples,
      followUp: consequence.followUp,
      consequenceLabel: consequence.success
        ? action.approach === 'help' ? 'GEMEINSAMER PLAN' : action.approach === 'listen' ? 'VERTRAUEN' : action.approach === 'joke' ? 'GETEILTER HUMOR' : 'RESPEKT'
        : 'SOZIALER FEHLTRITT',
    };
  }

  if (action.type === 'flirt') {
    const threshold = flirtChance(characterId, snapshot);
    const roll = 1 + Math.floor(random() * 20);
    const success = roll <= threshold;
    const critical = success && roll <= Math.max(2, Math.floor(threshold / 3));
    const relationship = success ? (critical ? 9 : 6) : snapshot.needs.alcohol >= 38 ? -6 : -2;
    const romanceDelta = success ? (critical ? 12 : 8) : relationship;
    const profile = ROMANCE_PROFILES[characterId as RomanceId];
    const boundary = !success && relationship <= -4;
    return {
      text: `${flirtReaction(characterId, success, snapshot)} ${success
        ? critical
          ? 'Der Moment wirkt nicht wie ein gewonnener Wurf, sondern wie echtes gegenseitiges Interesse.'
          : 'Das Gespräch bleibt offen und beide tragen etwas dazu bei.'
        : boundary
          ? 'Die Grenze ist eindeutig. Respektieren ist jetzt die einzige gute Fortsetzung.'
          : 'Der Versuch landet nicht, ohne daraus sofort ein Drama zu machen.'}`,
      relationship,
      romanceDelta,
      minutes: 7,
      success,
      flags: success ? { [`romance-moment-${characterId}`]: true } : boundary ? { [`romance-boundary-${characterId}`]: true } : undefined,
      metrics: success ? { reputation: 1, dignity: critical ? 2 : 1 } : { dignity: boundary ? -4 : -1, chaos: boundary ? 2 : 0 },
      consequenceLabel: success ? 'GEGENSEITIGES INTERESSE' : boundary ? 'GRENZE GESETZT' : 'KEIN MOMENT',
      followUp: profile
        ? success
          ? `${profile.name} reagiert in späteren Gesprächen persönlicher, aber nicht automatisch romantisch.`
          : `Weitere Versuche funktionieren nur, wenn Zustand, Beziehung und Verhalten sich verändern.`
        : undefined,
    };
  }

  if (action.type === 'gift') {
    const reaction = giftReaction(characterId, action.itemId);
    const preferred = reaction.delta >= 5;
    const rejected = reaction.delta < 0;
    return {
      text: `${reaction.text}${preferred ? ' Die Auswahl zeigt, dass du beim vorherigen Gespräch tatsächlich zugehört hast.' : rejected ? ' Das Geschenk wird nicht verbraucht, weil die Person es klar ablehnt.' : ''}`,
      relationship: reaction.delta,
      minutes: 2,
      success: reaction.delta > 0,
      romanceDelta: ROMANCE_PROFILES[characterId as RomanceId] ? reaction.delta : undefined,
      consumeItem: rejected ? undefined : action.itemId,
      metrics: preferred ? { reputation: 1, dignity: 1 } : rejected ? { dignity: -2 } : undefined,
      flags: preferred ? { [`gift-understood-${characterId}`]: true } : rejected ? { [`gift-missed-${characterId}`]: true } : undefined,
      consequenceLabel: preferred ? 'AUFMERKSAMKEIT' : rejected ? 'FALSCHE AUSWAHL' : 'VERSORGUNG',
      followUp: preferred ? 'Die Figur erinnert sich später daran, dass das Geschenk zu ihr passte.' : 'Geschenke ersetzen keine charaktergerechten Gespräche.',
    };
  }

  const profile = FRIEND_PROFILES[characterId as FriendId];
  const person = RELATIONSHIP_CHARACTERS.find((entry) => entry.id === characterId);
  return {
    text: profile
      ? `${person?.name ?? characterId} sagt zu. Im Team bringt ${profile.strengths[0]}, aber auch ${profile.weaknesses[0]} konkrete Auswirkungen auf Kämpfe und Minispiele.`
      : 'Diese Person ist nicht als Begleiter vorgesehen. Ein Nein wird diesmal nicht als versteckte Quest behandelt.',
    relationship: profile ? 2 : 0,
    minutes: 2,
    success: Boolean(profile),
    recruit: Boolean(profile),
    flags: profile ? { [`recruited-${characterId}`]: true } : undefined,
    consequenceLabel: profile ? 'TEAM VERSTÄRKT' : 'KLARE GRENZE',
    followUp: profile ? `${person?.name ?? characterId} ist am Lagerfeuer und in Kämpfen als Begleiter verfügbar.` : undefined,
  };
}

export function dialogueCharacterSummary(characterId: string): { name: string; role: string; values: string[]; irritants: string[]; portrait: string } | undefined {
  const voice = CHARACTER_VOICES[characterId];
  if (!voice) return undefined;
  return { name: voice.name, role: voice.role, values: voice.values, irritants: voice.irritants, portrait: voice.portrait };
}

function giftableItems(snapshot: GameSnapshot, characterId: string): string[] {
  const profile = ROMANCE_PROFILES[characterId as RomanceId];
  return Object.keys(snapshot.inventory)
    .filter((id) => (snapshot.inventory[id] ?? 0) > 0 && Boolean(ITEMS[id]))
    .sort((a, b) => {
      const preferenceA = profile?.preferredGifts.includes(a) ? -2 : profile?.dislikedGifts.includes(a) ? 2 : 0;
      const preferenceB = profile?.preferredGifts.includes(b) ? -2 : profile?.dislikedGifts.includes(b) ? 2 : 0;
      return preferenceA - preferenceB || a.localeCompare(b);
    })
    .slice(0, 4);
}

function flirtLabel(id: RomanceId, count: number): string {
  const labels: Record<RomanceId, string[]> = {
    susi: ['Selbstironie statt Anmachspruch versuchen', 'Ein spielerisches Duell mit echtem Interesse verbinden', 'Blickkontakt halten, ohne Statistik daraus zu machen'],
    jule: ['Direkt sein, ohne laut oder großspurig zu werden', 'Eine gemeinsame ruhige Runde vorschlagen', 'Interesse zeigen, nachdem du tatsächlich geholfen hast'],
    kira: ['Eine echte Geschichte statt einer Pose anbieten', 'Eine ruhige Minute gemeinsam stehen lassen', 'Das Licht erwähnen, ohne dich selbst ins Bild zu drängen'],
  };
  return labels[id][Math.abs(count) % labels[id].length];
}

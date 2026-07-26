import { FRIEND_PROFILES, type FriendId } from './friendRoster';
import { activeStatuses, statusModifiers } from './statusSystem';
import type { GameSnapshot } from './types';

export type RomanceId = 'susi' | 'jule' | 'kira';

export interface RomanceProfile {
  id: RomanceId;
  name: string;
  nickname: string;
  description: string;
  preferredGifts: string[];
  dislikedGifts: string[];
  prefers: Array<'sober' | 'buzzed' | 'high' | 'sporty' | 'creative' | 'helpful'>;
  rejects: Array<'drunk' | 'veryHigh' | 'hangover' | 'chaos'>;
  opening: string[];
}

export const ROMANCE_PROFILES: Record<RomanceId, RomanceProfile> = {
  susi: {
    id: 'susi', name: 'Susi', nickname: 'Die Becherstrategin',
    description: 'Spielt gerne, reagiert auf Selbstironie und merkt sofort, wenn jemand nur mit Pegel Selbstvertrauen entwickelt.',
    preferredGifts: ['chips', 'wasser'], dislikedGifts: ['batida'], prefers: ['buzzed', 'creative'], rejects: ['drunk', 'veryHigh', 'hangover'],
    opening: ['„Du bist also der mit dem Ablaufplan?“', '„Ein guter Wurf ist noch keine Persönlichkeit.“', '„Bitte sag nicht, dass das dein Flirtshirt ist.“'],
  },
  jule: {
    id: 'jule', name: 'Jule', nickname: 'Die Strandläuferin',
    description: 'Sportlich, direkt und wenig beeindruckt von Selbstüberschätzung. Hilfsbereitschaft zählt mehr als markige Sprüche.',
    preferredGifts: ['wasser', 'kaffee'], dislikedGifts: ['bier', 'batida'], prefers: ['sober', 'sporty', 'helpful'], rejects: ['drunk', 'veryHigh', 'chaos'],
    opening: ['„Du schwankst. Ist das Training oder Zustand?“', '„Erst Wasser, dann Heldengeschichte.“', '„Wer beim Aufräumen hilft, darf später reden.“'],
  },
  kira: {
    id: 'kira', name: 'Kira', nickname: 'Die Nachtfotografin',
    description: 'Kreativ, beobachtend und offen für ungewöhnliche Geschichten. Plumpe Anmache und völliger Kontrollverlust beenden das Gespräch sofort.',
    preferredGifts: ['kaffee', 'chips'], dislikedGifts: ['wuerste'], prefers: ['creative', 'high'], rejects: ['drunk', 'hangover'],
    opening: ['„Das Licht hier ist besser als die Gespräche.“', '„Du wirkst, als würdest du nebenbei drei Projekte anfangen.“', '„Erzähl etwas Echtes. Oder wenigstens gut Erfundenes.“'],
  },
};

export function dynamicOpening(characterId: string, state: GameSnapshot): string {
  const statuses = activeStatuses(state.needs);
  const romance = ROMANCE_PROFILES[characterId as RomanceId];
  if (romance) {
    if (state.needs.alcohol >= 68) return `${romance.name}: „Bevor du noch näher kommst: Geradeaus stehen wäre ein guter Anfang.“`;
    if (state.needs.highness >= 70) return `${romance.name}: „Deine Antwort kommt vermutlich noch. Ich warte kurz.“`;
    if (state.needs.hangover >= 45) return `${romance.name}: „Du siehst aus, als wäre Tageslicht eine persönliche Beleidigung.“`;
    const index = Math.abs(state.day * 7 + Math.floor(state.minutes / 30) + characterId.length) % romance.opening.length;
    return `${romance.name}: ${romance.opening[index]}`;
  }
  const friend = FRIEND_PROFILES[characterId as FriendId];
  if (!friend) return statuses.length ? `Dein Zustand ${statuses[0].label} bestimmt den Ton des Gesprächs.` : 'Ein normales Gespräch beginnt.';
  if (state.needs.highness >= 55 && friend.likesCannabis) return `${friend.fieldLine} „Du bist jedenfalls schon auf meiner Gesprächsgeschwindigkeit.“`;
  if (state.needs.alcohol >= 55 && friend.alcoholTolerance === 'niedrig') return `${friend.fieldLine} „Langsam. Einer von uns muss morgen noch wissen, wo das Zelt steht.“`;
  return friend.fieldLine;
}

export function conversationDelta(characterId: string, state: GameSnapshot): { relationship: number; text: string } {
  const friend = FRIEND_PROFILES[characterId as FriendId];
  const modifiers = statusModifiers(state.needs);
  let relationship = friend ? 4 : 2;
  if (state.needs.hangover >= 45) relationship -= 2;
  if (state.needs.alcohol >= 68) relationship -= friend?.alcoholTolerance === 'hoch' ? 0 : 3;
  if (state.needs.highness >= 55 && friend) relationship += friend.likesCannabis ? 2 : -2;
  relationship = Math.max(-4, Math.min(7, relationship));
  return {
    relationship,
    text: relationship > 3
      ? 'Das Gespräch trifft ein gemeinsames Thema und wirkt ungewöhnlich ehrlich.'
      : relationship >= 0
        ? 'Das Gespräch bleibt stabil, ohne bereits Freundschaftsgeschichte zu schreiben.'
        : `Dein Zustand kostet soziale Präzision (${modifiers.charm} Charme-Modifikator).`,
  };
}

export function flirtChance(characterId: string, state: GameSnapshot): number {
  const profile = ROMANCE_PROFILES[characterId as RomanceId];
  if (!profile) return 0;
  const modifiers = statusModifiers(state.needs);
  let chance = 7;
  chance += Math.round((state.relationships[characterId] ?? 0) * 0.08);
  chance += Math.round(state.metrics.reputation * 0.035);
  chance += Math.round(modifiers.flirt * 0.45);
  if (profile.prefers.includes('buzzed') && state.needs.alcohol >= 14 && state.needs.alcohol < 38) chance += 3;
  if (profile.prefers.includes('sober') && state.needs.alcohol < 10 && state.needs.highness < 15) chance += 3;
  if (profile.prefers.includes('high') && state.needs.highness >= 25 && state.needs.highness < 60) chance += 2;
  if (profile.prefers.includes('creative') && state.profile?.trait === 'chaotisch') chance += 2;
  if (profile.prefers.includes('helpful') && state.profile?.trait === 'hilfsbereit') chance += 3;
  if (profile.prefers.includes('sporty') && state.needs.energy >= 65) chance += 2;
  if (profile.rejects.includes('drunk') && state.needs.alcohol >= 38) chance -= 10;
  if (profile.rejects.includes('veryHigh') && state.needs.highness >= 70) chance -= 10;
  if (profile.rejects.includes('hangover') && state.needs.hangover >= 35) chance -= 8;
  if (profile.rejects.includes('chaos') && state.metrics.chaos >= 55) chance -= 5;
  return Math.max(2, Math.min(20, Math.round(chance)));
}

export function flirtReaction(characterId: string, success: boolean, state: GameSnapshot): string {
  const profile = ROMANCE_PROFILES[characterId as RomanceId];
  if (!profile) return 'Das war kein Flirtgespräch.';
  if (success) {
    if (state.needs.alcohol >= 14) return `${profile.name} lacht über den Spruch, aber vor allem darüber, dass du ihn selbst nicht ganz ernst nimmst.`;
    return `${profile.name} bleibt im Gespräch, stellt eine echte Rückfrage und gibt dir damit mehr als nur Höflichkeit.`;
  }
  if (state.needs.alcohol >= 38) return `${profile.name}: „Der Pegel spricht gerade lauter als du. Versuch es morgen nüchtern.“`;
  if (state.needs.highness >= 60) return `${profile.name}: „Die Pointe ist vermutlich noch unterwegs.“`;
  if (state.needs.hangover >= 35) return `${profile.name}: „Du solltest zuerst mit Wasser eine Beziehung aufbauen.“`;
  return `${profile.name} reagiert freundlich, aber eindeutig. Ein einzelner Versuch erzeugt noch keine Romanze.`;
}

export function giftReaction(characterId: string, itemId: string): { delta: number; text: string } {
  const profile = ROMANCE_PROFILES[characterId as RomanceId];
  if (!profile) return { delta: itemId === 'wasser' ? 2 : 1, text: 'Das Geschenk wird als brauchbare Gruppenversorgung verbucht.' };
  if (profile.preferredGifts.includes(itemId)) return { delta: 7, text: `${profile.name} merkt, dass das Geschenk tatsächlich zu ihr passt.` };
  if (profile.dislikedGifts.includes(itemId)) return { delta: -5, text: `${profile.name} nimmt das Geschenk nicht an. Die Auswahl war eher Selbstauskunft als Aufmerksamkeit.` };
  return { delta: 2, text: `${profile.name} nimmt es an, ohne daraus bereits romantische Bedeutung abzuleiten.` };
}

export function patrolOpening(state: GameSnapshot): string {
  if (state.needs.alcohol >= 68) return 'Uli sieht zuerst das Schwanken, Gundula danach den fehlenden Stromhaken. „Kontrollgespräch. Sofort.“';
  if (state.needs.highness >= 60) return 'Gundula wartet auf deine verspätete Reaktion. Uli prüft in der Zwischenzeit bereits beide Augen getrennt.';
  if (state.needs.hangover >= 40) return 'Uli: „Du siehst kontrollbedürftig aus.“ Gundula hält das Klemmbrett vorsorglich etwas leiser.';
  if (state.flags.hedgeRelieved) return 'Gundula: „Wir sprechen jetzt über die Hecke.“ Uli hat erstaunlicherweise bereits einen Lageplan dabei.';
  return 'Der Kontrollgang um 18 Uhr erreicht dich. Gundula prüft Zustand und Anmeldung, Uli den Abstand zum nächsten Regelverstoß.';
}

export function canRecruit(characterId: string, state: GameSnapshot): boolean {
  const profile = FRIEND_PROFILES[characterId as FriendId];
  return Boolean(profile && (state.relationships[characterId] ?? 0) >= profile.recruitmentThreshold && state.flags[`met-${characterId}`]);
}

import type { TeamMember } from './types';

export type FriendId = 'andre' | 'rene' | 'lars' | 'danny' | 'gregor' | 'masl' | 'schubert' | 'felix' | 'schima';

export interface FriendProfile {
  id: FriendId;
  role: string;
  archetype: string;
  biography: string;
  strengths: string[];
  weaknesses: string[];
  topics: string[];
  likesCannabis: boolean;
  alcoholTolerance: 'niedrig' | 'mittel' | 'hoch';
  recruitmentThreshold: number;
  fieldLine: string;
}

export const FRIEND_PROFILES: Record<FriendId, FriendProfile> = {
  andre: {
    id: 'andre', role: 'Kreativtechniker', archetype: 'Der KI-Bastler',
    biography: 'Schreibt das Spiel, baut KI-Lieder über die Blaue Adria und Mallorca und verbindet Technik mit kreativen Ideen. Sportlich, trinkfest und nicht grundsätzlich gegen eine Rauchpause.',
    strengths: ['kreative Lösungen', 'Technik', 'Improvisation'], weaknesses: ['verzettelt sich', 'zu viele Ideen gleichzeitig'],
    topics: ['KI', 'Technik', 'Musik', 'Sport'], likesCannabis: true, alcoholTolerance: 'hoch', recruitmentThreshold: 18,
    fieldLine: '„Ich habe dafür schon einen Prototyp. Er ist nur noch nicht ganz ungefährlich.“',
  },
  rene: {
    id: 'rene', role: 'Lautstarker Familienvater', archetype: 'Der große Bruder',
    biography: 'Andrés großer Bruder und Familienvater. Macht Sport, trinkt und kifft gerne und kann eine ruhige Situation mit „WIE HEISST DER HUND?“ oder „NACHHOLEN!“ zuverlässig beenden.',
    strengths: ['Standfestigkeit', 'Gruppendruck', 'Beschützerinstinkt'], weaknesses: ['Lautstärke', 'eskaliert harmlose Situationen'],
    topics: ['Familie', 'Sport', 'Bier', 'alte Geschichten'], likesCannabis: true, alcoholTolerance: 'hoch', recruitmentThreshold: 18,
    fieldLine: '„Wie heißt der Hund? Das ist eine normale Frage!“',
  },
  lars: {
    id: 'lars', role: 'Technik-Schnäppchenjäger', archetype: 'Der gute Zwilling',
    biography: 'Technikbegeistert, ehemaliger Doktorand und kompromissloser Schnäppchenjäger. Kauft auf Malle Brillen für drei Euro, bezeichnet sich als Sportler und kifft trotzdem gelegentlich. Mag außer Schildkröten keine Tiere.',
    strengths: ['Technik', 'Preis-Leistung', 'Minispielanalyse'], weaknesses: ['billige Ausrüstung', 'überschätzt seine Sportlichkeit'],
    topics: ['Schildkröten', 'Technik', 'Schnäppchen', 'Sport'], likesCannabis: true, alcoholTolerance: 'mittel', recruitmentThreshold: 16,
    fieldLine: '„Die Brille hat drei Euro gekostet. Für den Preis muss sie gut sein.“',
  },
  danny: {
    id: 'danny', role: 'Sprinter', archetype: 'Der böse Zwilling',
    biography: 'Dünner als Lars, sportlicher und deutlich schneller. Kifft nicht, trinkt selektiv, uriniert aber genauso zuverlässig in die Hecke. Hat ein ausgeprägtes Talent, genau vor dem Aufräumen früher abzuhauen. Mag ausschließlich Schildkröten.',
    strengths: ['Tempo', 'Reaktion', 'Flunkyball'], weaknesses: ['frühe Abreise', 'verweigert Nachholen'],
    topics: ['Schildkröten', 'Sport', 'Fluchtpläne'], likesCannabis: false, alcoholTolerance: 'mittel', recruitmentThreshold: 17,
    fieldLine: '„Ich muss Sonntag wirklich früh los. Wirklich.“',
  },
  gregor: {
    id: 'gregor', role: 'Programmierer', archetype: 'Der belastbare Helfer',
    biography: 'Programmiert gerne, verträgt viel Alkohol, kifft nicht und hilft, bevor andere überhaupt bemerken, dass etwas kaputt ist.',
    strengths: ['Logik', 'Hilfsbereitschaft', 'Alkoholtoleranz'], weaknesses: ['debuggt Gespräche zu lange'],
    topics: ['Programmieren', 'Problemlösung', 'Bier'], likesCannabis: false, alcoholTolerance: 'hoch', recruitmentThreshold: 15,
    fieldLine: '„Das ist kein Problem. Das ist nur ein schlecht dokumentierter Zustand.“',
  },
  masl: {
    id: 'masl', role: 'Platzverteidiger', archetype: 'Der Debattierer',
    biography: 'Groß, sehr hilfsbereit und besonders stark darin, Gundula aus einer endgültigen Entscheidung wieder eine vorläufige zu machen. Trinkt und kifft gerne; organisiert Hotboxen im Zelt, unter einem Regenschirm auf dem See oder unter einem umgekippten Boot.',
    strengths: ['Diskussion', 'Loyalität', 'soziale Verteidigung'], weaknesses: ['sehr breit', 'Regelauslegung'],
    topics: ['Diskussionen', 'Hotbox', 'Gruppenschutz'], likesCannabis: true, alcoholTolerance: 'hoch', recruitmentThreshold: 14,
    fieldLine: '„Das steht da so. Es bedeutet nur nicht das, was Gundula denkt.“',
  },
  schubert: {
    id: 'schubert', role: 'Physio', archetype: 'Der müde Fitmacher',
    biography: 'Physiotherapeut, Vater und zuständig dafür, dass alle halbwegs beweglich bleiben. Schläft und zockt viel, hat Bluthochdruck, verträgt weniger Alkohol und kifft ebenfalls.',
    strengths: ['Regeneration', 'Verletzungsprävention', 'Ruhe'], weaknesses: ['geringe Alkoholtoleranz', 'verschläft Starts'],
    topics: ['Physio', 'Gaming', 'Familie', 'Schlaf'], likesCannabis: true, alcoholTolerance: 'niedrig', recruitmentThreshold: 16,
    fieldLine: '„Deine Haltung ist schlecht. Meine Wachheit aber auch.“',
  },
  felix: {
    id: 'felix', role: 'Geschichtenerzähler', archetype: 'Der werdende Papa',
    biography: 'Wird bald Vater, kifft nicht, trinkt gerne lecker Bierchen, spielt fast alles mit und erzählt Geschichten, bei denen der Wahrheitsanteil mit jeder Runde sinkt.',
    strengths: ['Motivation', 'Spiele', 'soziale Energie'], weaknesses: ['wilde Ausschmückungen'],
    topics: ['Familie', 'Spiele', 'Bier', 'Geschichten'], likesCannabis: false, alcoholTolerance: 'mittel', recruitmentThreshold: 15,
    fieldLine: '„Das ist wirklich passiert. Nur Ort, Zeit und Beteiligte waren anders.“',
  },
  schima: {
    id: 'schima', role: 'Versorgungsbus', archetype: 'Der Ausgerüstete',
    biography: 'Kommt mit großem Bus und ist für Situationen ausgestattet, die noch niemand geplant hat. Kifft gerne und viel, verträgt aber etwas weniger Alkohol als sein Materialbestand vermuten lässt.',
    strengths: ['Ausrüstung', 'Vorräte', 'Improvisation'], weaknesses: ['mittlere Alkoholtoleranz', 'zu viel Gepäck'],
    topics: ['Bus', 'Ausrüstung', 'Vorräte', 'Rauchpausen'], likesCannabis: true, alcoholTolerance: 'mittel', recruitmentThreshold: 17,
    fieldLine: '„Hab ich im Bus. Ich weiß nur nicht in welcher Kiste.“',
  },
};

export const FRIEND_TEAM_MEMBERS: Record<FriendId, TeamMember> = {
  andre: member('andre', 'André', 'Kreativtechniker', 3, { battle: 3, social: 5, games: 4, recovery: 1 }),
  rene: member('rene', 'René', 'Großer Bruder', 3, { battle: 6, social: 3, games: 3, recovery: 2 }),
  lars: member('lars', 'Lars', 'Technik-Schnäppchenjäger', 2, { battle: 2, social: 2, games: 6, recovery: 2 }),
  danny: member('danny', 'Danny', 'Sprinter', 3, { battle: 4, social: 1, games: 7, recovery: 2 }),
  gregor: member('gregor', 'Gregor', 'Programmierer', 3, { battle: 3, social: 4, games: 4, recovery: 4 }),
  masl: member('masl', 'Masl', 'Platzverteidiger', 4, { battle: 7, social: 7, games: 2, recovery: 1 }),
  schubert: member('schubert', 'Schubert', 'Physio', 3, { battle: 2, social: 2, games: 2, recovery: 8 }),
  felix: member('felix', 'Felix', 'Geschichtenerzähler', 2, { battle: 2, social: 5, games: 6, recovery: 2 }),
  schima: member('schima', 'Schima', 'Versorgungsbus', 3, { battle: 4, social: 3, games: 3, recovery: 6 }),
};

export interface TeamSynergy {
  id: string;
  label: string;
  description: string;
  battle: number;
  social: number;
  games: number;
  recovery: number;
}

export function activeTeamSynergies(ids: string[]): TeamSynergy[] {
  const set = new Set(ids);
  const result: TeamSynergy[] = [];
  if (set.has('lars') && set.has('danny')) result.push({ id: 'twins', label: 'Schildkröten-Zwillinge', description: 'Gegensätze mit identischem Tiergeschmack.', battle: 1, social: -1, games: 4, recovery: 0 });
  if (['andre', 'gregor', 'lars'].filter((id) => set.has(id)).length >= 2) result.push({ id: 'tech', label: 'Technikrat', description: 'Probleme werden erst analysiert und dann kreativ umgangen.', battle: 1, social: 2, games: 3, recovery: 0 });
  if (['rene', 'masl', 'schima'].filter((id) => set.has(id)).length >= 2) result.push({ id: 'smoke', label: 'Hotbox-Komitee', description: 'Hohe Gelassenheit, langsamere Reaktion.', battle: 3, social: 2, games: -1, recovery: 1 });
  if (['rene', 'schubert', 'felix'].filter((id) => set.has(id)).length >= 2) result.push({ id: 'dads', label: 'Papa-Schicht', description: 'Pragmatische Erholung und überraschend frühe Vernunft.', battle: 0, social: 2, games: 0, recovery: 5 });
  return result;
}

function member(id: FriendId, name: string, role: string, level: number, bonuses: TeamMember['bonuses']): TeamMember {
  return { id, name, role, level, resolve: 62 + level * 6, maxResolve: 62 + level * 6, loyalty: 56 + level * 5, bonuses };
}

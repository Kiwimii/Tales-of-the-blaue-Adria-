import { OPENING_CRAWL_LINES } from './openingSequenceV5Model.js';

export interface IntroBeat {
  id: string;
  kicker: string;
  title: string;
  lines: string[];
  visual: 'space' | 'road' | 'car' | 'shop' | 'gate' | 'clipboard' | 'camp' | 'night' | 'sunday';
  duration: number;
}

export const INTRO_BEATS: IntroBeat[] = [
  {
    id: 'star-crawl',
    kicker: 'EPISODE 0 · DIE VORBEREITUNG SCHLÄGT ZURÜCK',
    title: 'Tales of the Blaue Adria',
    visual: 'space',
    duration: 42000,
    lines: [...OPENING_CRAWL_LINES],
  },
];

export const CASHIER_LINES = [
  'Die Kassiererin scannt dein Sortiment und entscheidet sich gegen eine Rückfrage.',
  'Hinter dir seufzt jemand. Vor dir liegen 25 Euro und die Illusion von Vorbereitung.',
  'Der Warentrenner schützt die Einkäufe. Vor den Folgen schützt er nicht.',
  'Der Pfandautomat beobachtet still. Er weiß, dass ihr euch Sonntag wiederseht.',
  'Eine Durchsage warnt vor unbeaufsichtigten Kindern. Niemand fühlt sich zuständig.',
];

export const SHOP_REACTIONS: Record<string, string[]> = {
  wasser: ['Jule würde das vernünftig nennen. Das ist nicht zwingend ein Kompliment.', 'Reduziert Durst und spätere philosophische Gespräche mit dem Asphalt.'],
  wuerste: ['Gregor erkennt darin kein Lebensmittel, sondern Verantwortung.', 'Kann gegrillt werden. „Verbrannt“ ist laut Gregor nur eine negative Erzählweise.'],
  bier: ['Erhöht Mut, Blase und die Zahl vermeintlich guter Ideen.', 'Lars nennt das Grundversorgung. Medizinisch ist er nicht beteiligt.'],
  batida: ['Zehn Euro für eine Flüssigkeit, die jede Entscheidung nach sich selbst aussehen lässt.', 'Hoher Chaoswert. Niedriger Beitrag zur Sonntagswürde.'],
  chips: ['Sozial akzeptierte Bestechung in knisternder Verpackung.', 'Hilft gegen Hunger und Gesprächspausen.'],
  kaffee: ['Ein später Versuch, biologische Grenzen vertraglich neu zu verhandeln.', 'Kira und Jule reagieren darauf deutlich besser als auf warmes Bier.'],
  klopapier: ['Das unscheinbare Item, das später über Mannis Loyalität entscheidet.', 'Wer es nicht kauft, erhält eine sehr konkrete Nebenquest.'],
  tablette: ['Kein Freifahrtschein, aber ein kleiner juristischer Beistand gegen den Kater.', 'Wirkt besser mit Wasser. Diese Information wird erfahrungsgemäß ignoriert.'],
};

export function seededLine(lines: string[], seed: number): string {
  if (!lines.length) return '';
  const normalized = Math.abs(Math.floor(seed));
  return lines[normalized % lines.length];
}

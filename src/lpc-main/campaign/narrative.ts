export interface IntroBeat {
  id: string;
  kicker: string;
  title: string;
  lines: string[];
  visual: 'road' | 'car' | 'shop' | 'gate' | 'clipboard' | 'camp' | 'night' | 'sunday';
  duration: number;
}

export const INTRO_BEATS: IntroBeat[] = [
  {
    id: 'peace',
    kicker: 'FREITAG · 07:03 UHR',
    title: 'Noch ist alles friedlich',
    visual: 'road',
    duration: 6500,
    lines: [
      'Die Blaue Adria liegt still da. Ein See, ein Campingplatz und mehrere Menschen, die glauben, sie hätten hier Hausrecht.',
      'Die Vögel zwitschern. Die Schranke ist geschlossen. Beides wird im Laufe des Tages aggressiver.',
    ],
  },
  {
    id: 'crew',
    kicker: 'NEUN FREUNDE · EIN AUTO · KEIN ERWACHSENER',
    title: 'Eine Reisegruppe nähert sich',
    visual: 'car',
    duration: 7000,
    lines: [
      'Neun Freunde fahren los. Jeder hat zugesagt, etwas Wichtiges mitzubringen.',
      'Das Ergebnis sind vier Ladekabel, sieben halbvolle Deos und genau eine Person, die an Klopapier gedacht hat.',
      'Niemand hat einen Hammer. Zwei haben denselben Bluetooth-Lautsprecher dabei.',
    ],
  },
  {
    id: 'budget',
    kicker: '25 EURO STARTKAPITAL',
    title: 'Ökonomische Verantwortung',
    visual: 'shop',
    duration: 7000,
    lines: [
      'Vor der Abfahrt bleibt ein Supermarktbesuch. Das Budget: 25 Euro.',
      'Damit müssen Nahrung, Flüssigkeit, Hygiene und spätere Ausreden finanziert werden.',
      'Die Entscheidung zwischen Wasser und Batida ist technisch eine Charaktererstellung mit Kassenbon.',
    ],
  },
  {
    id: 'authority',
    kicker: 'AM HAUPTTOR',
    title: 'Zwei Endgegner im Frühdienst',
    visual: 'gate',
    duration: 7600,
    lines: [
      'Gundula bewacht die Anmeldung. Ihr Klemmbrett enthält Regeln, die teilweise älter sind als die Bäume.',
      'Neben ihr steht Uli. Glatze, Schlüsselbund, Tanktop. Ein Mann, der Abstände nicht schätzt, sondern persönlich nimmt.',
      'Gemeinsam bilden sie eine Verwaltungseinheit, gegen die selbst Formulare nervös werden.',
    ],
  },
  {
    id: 'reservation',
    kicker: 'DIE RESERVIERUNG EXISTIERT',
    title: 'Vermutlich',
    visual: 'clipboard',
    duration: 7000,
    lines: [
      'Die Gruppe hat reserviert. Der Name steht irgendwo auf einer Liste.',
      'Leider wurde die Liste von Menschen sortiert, die alphabetische Reihenfolge als unverbindliche Empfehlung betrachten.',
      'Wer hineinwill, muss lesen, reden oder die Gegenseite zuerst vollständig frustrieren.',
    ],
  },
  {
    id: 'camp',
    kicker: 'HINTER DER SCHRANKE',
    title: 'Das Wochenende beginnt',
    visual: 'camp',
    duration: 7600,
    lines: [
      'Am Taucherplatz warten Zelte, Kabel, Getränke und ein Stromkasten, der sichtbar schon bessere Jahre abgelehnt hat.',
      'Auf dem restlichen Platz verteilen sich Freunde, Rivalen, Flirtchancen und mehrere Orte, an denen man offiziell nicht urinieren darf.',
      'Die Regeln sind klar. Die Gruppe ist es nicht.',
    ],
  },
  {
    id: 'night',
    kicker: 'SPÄTER AM ABEND',
    title: 'Zustände werden zu Persönlichkeiten',
    visual: 'night',
    duration: 7600,
    lines: [
      'Alkohol macht mutiger und ungenauer. Müdigkeit macht ehrlicher und sozial unbrauchbar.',
      'Beziehungen entstehen durch Gespräche, Geschenke und gemeinsam überstandene Fehlentscheidungen.',
      'Manche Attacken lernt man im Kampf. Andere, indem man René lange genug zuhört, ohne aufs Handy zu sehen.',
    ],
  },
  {
    id: 'sunday',
    kicker: 'ZIEL: SONNTAG',
    title: 'Mit Restwürde abreisen',
    visual: 'sunday',
    duration: 8200,
    lines: [
      'Bis Sonntag soll die Gruppe vollständig sein, der Platz noch stehen und wenigstens eine Erinnerung rechtlich nicht verwertbar bleiben.',
      'Vielleicht entsteht Freundschaft. Vielleicht Romantik. Vielleicht nur ein sehr präziser Lageplan der Hecke.',
      'Tales of the Blaue Adria beginnt dort, wo vernünftige Wochenendplanung ihre Zuständigkeit beendet.',
    ],
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

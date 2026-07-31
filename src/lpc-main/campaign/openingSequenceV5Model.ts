import {
  AERIAL_FUNCTIONAL_AREAS,
  ARRIVAL_CAR_POSITION,
  ARRIVAL_STORY_PLACEMENTS,
  NPC_PLACEMENTS,
  OBJECT_PLACEMENTS,
  type PlanPoint,
} from '../../game/aerialCampgroundPlan';

export const OPENING_SEQUENCE_VERSION = 'opening-space-crawl-v5';

export const OPENING_CRAWL = {
  prelude: 'Vor nicht allzu langer Zeit auf einer Bundesstraße, die leider sehr nah ist …',
  eyebrow: 'EINE VÖLLIG UNNÖTIG GROSSE WOCHENEND-SAGA',
  title: 'TALES OF THE BLAUE ADRIA',
  episode: 'EPISODE I · DIE RÜCKKEHR DER KABELTROMMEL',
  paragraphs: [
    'Es herrscht Unruhe im Rhein-Nahe-Sektor. Neun Freunde haben beschlossen, ein Campingwochenende zu organisieren, obwohl niemand nachweislich für Organisation qualifiziert ist.',
    'Eine kleine Reisegruppe bereitet sich auf die gefährliche Mission vor. Das Ziel: die Blaue Adria. Die Ausrüstung: mehrere Bluetooth-Lautsprecher, vier Ladekabel und ein bemerkenswertes Vertrauen in fremde Kühlboxen.',
    'Doch bevor das Auto starten kann, muss im örtlichen Supermarkt über das Schicksal der Expedition entschieden werden. Nur 25 Euro trennen die Gruppe von Hunger, Durst und einer später erstaunlich politischen Diskussion über Klopapier.',
    'Am Ziel wartet die gefürchtete Schrankenallianz. Gundula führt das Klemmbrett. Uli trägt den Schlüsselbund. Gemeinsam kontrollieren sie Parkordnung, Platzfrieden und offenbar auch die Bewegung sämtlicher Himmelskörper.',
    'Hinter der Schranke liegen Zelte, Spiele, Rivalen, Romanzen und mindestens eine Hecke, die im weiteren Verlauf juristisch relevant werden könnte.',
    'Die Aufgabe klingt einfach: einkaufen, ankommen, aussteigen und bis Sonntag mit einem Restbestand an Würde wieder abreisen.',
    'Niemand rechnet damit, dass bereits der Parkplatz zum ersten Dungeon wird.',
  ],
  durationMs: 34_000,
} as const;

export const OPENING_FLOW_STEPS = [
  { id: 'story', label: 'Geschichte', detail: 'Die Lage wird unnötig groß erklärt.' },
  { id: 'driver', label: 'Fahrerakte', detail: 'Jemand muss später glaubwürdig aussteigen.' },
  { id: 'market', label: 'Supermarkt', detail: '25 Euro werden zu Charakterwerten.' },
  { id: 'arrival', label: 'Parkplatz', detail: 'Auto parken, aussteigen, Kofferraum öffnen.' },
] as const;

export const ARRIVAL_PLAYER_EXIT_POSITION: PlanPoint = { x: 820, y: 1538 };
export const ARRIVAL_CAMERA_FOCUS: PlanPoint = { x: 930, y: 1510 };

export interface OpeningLayoutSnapshot {
  parking: { x: number; y: number; width: number; height: number };
  car: PlanPoint;
  trunk: PlanPoint;
  playerExit: PlanPoint;
  gate: PlanPoint;
  reception: { x: number; y: number; width: number; height: number };
  board: PlanPoint;
  gundula: PlanPoint;
  uli: PlanPoint;
}

export function openingLayoutSnapshot(): OpeningLayoutSnapshot {
  const parking = AERIAL_FUNCTIONAL_AREAS.parking;
  const reception = OBJECT_PLACEMENTS.reception;
  return {
    parking: { x: parking.x, y: parking.y, width: parking.width, height: parking.height },
    car: { ...ARRIVAL_CAR_POSITION },
    trunk: { ...ARRIVAL_STORY_PLACEMENTS.trunk },
    playerExit: { ...ARRIVAL_PLAYER_EXIT_POSITION },
    gate: { ...ARRIVAL_STORY_PLACEMENTS.gateDebate },
    reception: {
      x: reception.x,
      y: reception.y,
      width: reception.width ?? 0,
      height: reception.height ?? 0,
    },
    board: { ...ARRIVAL_STORY_PLACEMENTS.reservationBoard },
    gundula: { ...NPC_PLACEMENTS.gundula },
    uli: { ...NPC_PLACEMENTS.uli },
  };
}

export function validateOpeningLayout(): string[] {
  const layout = openingLayoutSnapshot();
  const errors: string[] = [];
  const insideParking = (point: PlanPoint): boolean => point.x >= layout.parking.x
    && point.x <= layout.parking.x + layout.parking.width
    && point.y >= layout.parking.y
    && point.y <= layout.parking.y + layout.parking.height;

  if (!insideParking(layout.car)) errors.push('arrival car must be inside the parking area');
  if (!insideParking(layout.playerExit)) errors.push('player exit must be inside the parking area');
  if (distance(layout.car, layout.trunk) > 25) errors.push('trunk interaction must stay attached to the arrival car');
  if (distance(layout.car, layout.playerExit) < 55 || distance(layout.car, layout.playerExit) > 150) errors.push('player exit must be beside, but not inside, the arrival car');
  if (!(layout.gate.y < layout.car.y)) errors.push('gate must be north of the parked car');
  if (distance(layout.board, { x: layout.reception.x + layout.reception.width / 2, y: layout.reception.y }) > 260) errors.push('reservation board must remain next to reception');
  if (distance(layout.gundula, layout.gate) > 320 || distance(layout.uli, layout.gate) > 320) errors.push('Gundula and Uli must remain at the gate court');
  if (pointInsideRect(layout.playerExit, layout.reception)) errors.push('player exit may not be inside reception');
  return errors;
}

export function shouldPlayArrivalSequence(input: {
  gameVisible: boolean;
  questStage: string;
  shoppingComplete: boolean;
  alreadySeen: boolean;
  active: boolean;
}): boolean {
  return input.gameVisible
    && input.questStage === 'arrival'
    && input.shoppingComplete
    && !input.alreadySeen
    && !input.active;
}

export function arrivalPhaseAt(elapsedMs: number): 'road' | 'lot' | 'parked' | 'doors' | 'exit' | 'ready' {
  if (elapsedMs < 1_800) return 'road';
  if (elapsedMs < 3_300) return 'lot';
  if (elapsedMs < 4_400) return 'parked';
  if (elapsedMs < 5_300) return 'doors';
  if (elapsedMs < 6_400) return 'exit';
  return 'ready';
}

function distance(a: PlanPoint, b: PlanPoint): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function pointInsideRect(point: PlanPoint, rect: { x: number; y: number; width: number; height: number }): boolean {
  return point.x >= rect.x && point.x <= rect.x + rect.width && point.y >= rect.y && point.y <= rect.y + rect.height;
}

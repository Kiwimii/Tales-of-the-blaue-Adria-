export const OPENING_SEQUENCE_VERSION = 'star-crawl-arrival-v5';

export const OPENING_LAYOUT = Object.freeze({
  parking: Object.freeze({ x: 450, y: 1480, width: 540, height: 300 }),
  gateLane: Object.freeze({ x: 855, y: 1400, width: 90, height: 260 }),
  car: Object.freeze({ x: 770, y: 1600, width: 144, height: 70 }),
  trunk: Object.freeze({ x: 856, y: 1604 }),
  playerExit: Object.freeze({ x: 770, y: 1518 }),
  entrance: Object.freeze({ x: 900, y: 1760 }),
  gate: Object.freeze({ x: 900, y: 1400 }),
  receptionDoor: Object.freeze({ x: 1130, y: 1420 }),
  reservationBoard: Object.freeze({ x: 1280, y: 1360 }),
});

export const OPENING_CRAWL_LINES = Object.freeze([
  'Im Naherholungssektor Nahe herrscht angespannte Ruhe. Die Blaue Adria liegt friedlich da und ahnt noch nicht, dass neun Erwachsene mit Bluetooth-Lautsprechern unterwegs sind.',
  'Nach Wochen intensiver Planung steht fest: Niemand kennt die genaue Adresse, aber drei Personen haben denselben Ladestecker eingepackt.',
  'Die Gruppe verfügt über 25 Euro Startkapital. Damit sollen Nahrung, Wasser, Hygiene und sämtliche später notwendigen Ausreden finanziert werden.',
  'Auf dem Campingplatz regieren Gundula und Uli. Sie bewachen Schranke, Platzordnung und Abstände, die bisher niemand für politisch relevant hielt.',
  'Zwischen Reservierungslisten, Zeltaufbau, fragwürdigen Wettkämpfen und gesellschaftlich riskanten Hecken beginnt ein Wochenende, das offiziell der Erholung dienen soll.',
  'Das Ziel klingt überschaubar: bis Sonntag bleiben, die Kaution retten und wenigstens eine Erinnerung erzeugen, die vor Gericht nur eingeschränkt verwertbar ist.',
]);

export function pointInside(rect, point, margin = 0) {
  return point.x >= rect.x + margin
    && point.x <= rect.x + rect.width - margin
    && point.y >= rect.y + margin
    && point.y <= rect.y + rect.height - margin;
}

export function rectanglesOverlap(a, b, padding = 0) {
  return a.x - padding < b.x + b.width
    && a.x + a.width + padding > b.x
    && a.y - padding < b.y + b.height
    && a.y + a.height + padding > b.y;
}

export function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function openingLayoutReport(layout = OPENING_LAYOUT) {
  const carRect = {
    x: layout.car.x - layout.car.width / 2,
    y: layout.car.y - layout.car.height / 2,
    width: layout.car.width,
    height: layout.car.height,
  };
  const checks = {
    carInsideParking: pointInside(layout.parking, { x: carRect.x, y: carRect.y })
      && pointInside(layout.parking, { x: carRect.x + carRect.width, y: carRect.y + carRect.height }),
    gateLaneClear: !rectanglesOverlap(carRect, layout.gateLane, 4),
    exitBesideCar: distance(layout.playerExit, layout.car) >= 58 && distance(layout.playerExit, layout.car) <= 110,
    trunkAtRear: distance(layout.trunk, layout.car) >= 70 && distance(layout.trunk, layout.car) <= 105,
    entranceConnected: distance(layout.entrance, layout.gate) < 380,
    receptionNearGate: distance(layout.gate, layout.receptionDoor) < 270,
    boardNearReception: distance(layout.receptionDoor, layout.reservationBoard) < 210,
  };
  return {
    version: OPENING_SEQUENCE_VERSION,
    checks,
    valid: Object.values(checks).every(Boolean),
    carRect,
  };
}

export function arrivalPhaseAt(elapsedMs) {
  if (elapsedMs < 1500) return 'approach';
  if (elapsedMs < 3100) return 'turn';
  if (elapsedMs < 4400) return 'parked';
  if (elapsedMs < 5600) return 'door';
  if (elapsedMs < 6900) return 'exit';
  return 'complete';
}

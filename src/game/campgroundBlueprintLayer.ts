import Phaser from 'phaser';
import {
  BLUEPRINT_BEACH_GATE,
  BLUEPRINT_FENCES,
  BLUEPRINT_FUNCTIONAL_AREAS,
  BLUEPRINT_NODES,
  BLUEPRINT_ROADS,
  BLUEPRINT_SITE_POLYGONS,
  BLUEPRINT_WATER_POLYGONS,
  blueprintRoadBounds,
} from './campgroundBlueprint';
import { AERIAL_PITCHES, pointInPolygon, type PlanArea, type PlanPoint, type PlanPolygon, type PlanRoad } from './aerialCampgroundPlan';
import { seededFraction, type VisualProfile } from './visuals';

const ROAD_COLORS: Record<PlanRoad['surface'], { edge: number; fill: number; mark: number }> = {
  asphalt: { edge: 0x454b49, fill: 0x767c79, mark: 0xeee5c7 },
  gravel: { edge: 0x786746, fill: 0xb5a275, mark: 0xead8a8 },
  sand: { edge: 0xb49a63, fill: 0xd8c487, mark: 0xf3e2b2 },
};

export function drawCampgroundBlueprintLayer(scene: Phaser.Scene, profile: VisualProfile): void {
  drawWater(scene);
  drawLand(scene);
  drawFunctionalAreas(scene);
  drawPitchRows(scene);
  drawRoadNetwork(scene);
  drawCampgroundFence(scene);
  drawGroundDetail(scene, profile);
  drawAreaLabels(scene);
}

export function addAerialBoundaryObstacles(scene: Phaser.Scene, obstacles: Phaser.GameObjects.Zone[]): void {
  for (const segment of BLUEPRINT_FENCES) {
    const zone = scene.add.zone(segment.x + segment.width / 2, segment.y + segment.height / 2, segment.width, segment.height);
    scene.physics.add.existing(zone, true);
    obstacles.push(zone);
  }
}

function drawWater(scene: Phaser.Scene): void {
  const water = scene.add.graphics().setDepth(2.8);
  water.fillStyle(0x244f69, 1).fillRect(0, 0, 2600, 1800);
  for (const polygon of BLUEPRINT_WATER_POLYGONS) drawPolygon(water, polygon, 1);

  water.lineStyle(3, 0x8ac4cd, 0.2);
  for (let index = 0; index < 30; index += 1) {
    const y = 70 + index * 57;
    const startX = y < 1100 ? 2280 : 2250;
    water.beginPath();
    water.moveTo(startX, y);
    water.lineTo(startX + 85, y + 7);
    water.lineTo(startX + 185, y - 5);
    water.lineTo(2570, y + 3);
    water.strokePath();
  }
}

function drawLand(scene: Phaser.Scene): void {
  const land = scene.add.graphics().setDepth(4);
  for (const polygon of BLUEPRINT_SITE_POLYGONS) drawPolygon(land, polygon, 0.99);

  const boundary = scene.add.graphics().setDepth(4.1);
  boundary.lineStyle(18, 0x315b3e, 0.72);
  boundary.lineBetween(0, 12, 1940, 12);
  boundary.lineBetween(12, 12, 12, 1370);
  boundary.lineBetween(12, 1370, 440, 1370);
  boundary.lineBetween(1410, 1788, 1940, 1788);
}

function drawFunctionalAreas(scene: Phaser.Scene): void {
  const areas = scene.add.graphics().setDepth(4.2);
  for (const area of Object.values(BLUEPRINT_FUNCTIONAL_AREAS) as PlanArea[]) {
    areas.fillStyle(area.fill, 0.2)
      .fillRoundedRect(area.x, area.y, area.width, area.height, 18)
      .lineStyle(2, area.border, 0.32)
      .strokeRoundedRect(area.x, area.y, area.width, area.height, 18);
  }
}

function drawPolygon(graphics: Phaser.GameObjects.Graphics, polygon: PlanPolygon, alpha: number): void {
  const points = polygon.points.map(({ x, y }) => new Phaser.Math.Vector2(x, y));
  graphics.fillStyle(polygon.fill, alpha).fillPoints(points, true)
    .lineStyle(4, polygon.border, 0.48).strokePoints(points, true);
}

function drawRoadNetwork(scene: Phaser.Scene): void {
  const roads = scene.add.graphics().setDepth(4.5);
  for (const road of BLUEPRINT_ROADS) {
    const from = BLUEPRINT_NODES[road.from];
    const to = BLUEPRINT_NODES[road.to];
    const colors = ROAD_COLORS[road.surface];
    roads.lineStyle(road.width + 12, colors.edge, 0.92).lineBetween(from.x, from.y, to.x, to.y)
      .lineStyle(road.width, colors.fill, 1).lineBetween(from.x, from.y, to.x, to.y);
  }

  for (const [id, node] of Object.entries(BLUEPRINT_NODES)) {
    const connected = BLUEPRINT_ROADS.filter((road) => road.from === id || road.to === id);
    if (connected.length < 2) continue;
    const width = Math.max(...connected.map((road) => road.width));
    const surface = connected.some((road) => road.surface === 'asphalt') ? 'asphalt'
      : connected.some((road) => road.surface === 'gravel') ? 'gravel' : 'sand';
    const colors = ROAD_COLORS[surface];
    roads.fillStyle(colors.edge, 0.92).fillCircle(node.x, node.y, width * 0.56)
      .fillStyle(colors.fill, 1).fillCircle(node.x, node.y, width * 0.48);
  }

  const markings = scene.add.graphics().setDepth(4.54);
  for (const road of BLUEPRINT_ROADS) drawRoadMarks(markings, road);
  drawParkingBays(scene);
}

function drawParkingBays(scene: Phaser.Scene): void {
  const parking = scene.add.graphics().setDepth(4.56);
  parking.lineStyle(3, 0xece4c7, 0.58);
  for (let x = 540; x <= 780; x += 80) {
    parking.lineBetween(x, 1510, x, 1610);
  }
  for (let x = 1020; x <= 1180; x += 80) {
    parking.lineBetween(x, 1510, x, 1610);
  }
  parking.lineStyle(3, 0xf4d47b, 0.58)
    .strokeRoundedRect(805, 1510, 90, 100, 6)
    .lineBetween(850, 1510, 850, 1610);
}

function drawRoadMarks(graphics: Phaser.GameObjects.Graphics, road: PlanRoad): void {
  const from = BLUEPRINT_NODES[road.from];
  const to = BLUEPRINT_NODES[road.to];
  const distance = Phaser.Math.Distance.Between(from.x, from.y, to.x, to.y);
  const colors = ROAD_COLORS[road.surface];
  if (distance < 80) return;

  for (let step = 38; step < distance - 20; step += road.surface === 'asphalt' ? 68 : 58) {
    const progress = step / distance;
    const x = Phaser.Math.Linear(from.x, to.x, progress);
    const y = Phaser.Math.Linear(from.y, to.y, progress);
    if (road.surface === 'asphalt') {
      const angle = Phaser.Math.Angle.Between(from.x, from.y, to.x, to.y);
      const dx = Math.cos(angle) * 22;
      const dy = Math.sin(angle) * 22;
      graphics.lineStyle(3, colors.mark, 0.55).lineBetween(x - dx / 2, y - dy / 2, x + dx / 2, y + dy / 2);
    } else {
      graphics.fillStyle(colors.mark, 0.18).fillEllipse(x, y, 9, 5);
    }
  }
}

function drawPitchRows(scene: Phaser.Scene): void {
  const pitch = scene.add.graphics().setDepth(4.3);
  for (const entry of AERIAL_PITCHES) {
    const highlighted = entry.id === 'taucher' || entry.id === 'festival';
    pitch.fillStyle(entry.id === 'taucher' ? 0x8fb56d : entry.id === 'festival' ? 0x8d9b5b : 0x73935f, highlighted ? 0.2 : 0.12)
      .fillRoundedRect(entry.x, entry.y, entry.width, entry.height, 16)
      .lineStyle(highlighted ? 3 : 2, highlighted ? 0xf4d47b : 0xe7d8a5, highlighted ? 0.48 : 0.22)
      .strokeRoundedRect(entry.x, entry.y, entry.width, entry.height, 16);
  }
}

function drawCampgroundFence(scene: Phaser.Scene): void {
  const fence = scene.add.graphics().setDepth(4.72);
  for (const segment of BLUEPRINT_FENCES) {
    fence.fillStyle(0x324f37, 0.96).fillRect(segment.x, segment.y, segment.width, segment.height)
      .lineStyle(2, 0xb3c08e, 0.5).strokeRect(segment.x, segment.y, segment.width, segment.height);
    for (let y = segment.y + 10; y < segment.y + segment.height; y += 34) {
      fence.fillStyle(0xc3b27b, 0.82).fillRect(segment.x - 4, y, segment.width + 8, 5);
    }
  }

  const gate = BLUEPRINT_BEACH_GATE;
  fence.fillStyle(0xd7c17c, 0.95).fillRect(gate.x - 9, gate.y, 12, gate.height)
    .fillRect(gate.x + gate.width - 3, gate.y, 12, gate.height)
    .lineStyle(5, 0xe7d095, 0.9).lineBetween(gate.x + 3, gate.y + 14, gate.x + gate.width - 3, gate.y + 14);

  scene.add.text(gate.x - 8, gate.y + gate.height / 2, 'TOR ZUM STRAND', {
    fontFamily: 'Arial Black, system-ui', fontSize: '10px', color: '#fff3c8', backgroundColor: '#173027dd', padding: { x: 6, y: 3 },
  }).setOrigin(1, 0.5).setDepth(4.78);
}

function drawGroundDetail(scene: Phaser.Scene, profile: VisualProfile): void {
  const detail = scene.add.graphics().setDepth(4.18);
  const landPolygons = BLUEPRINT_SITE_POLYGONS.map((polygon) => polygon.points);
  const grassCount = profile.tier === 'cinematic' ? 620 : 380;
  for (let index = 0; index < grassCount; index += 1) {
    const point = { x: seededFraction('logical-grass-x', index) * 2250, y: seededFraction('logical-grass-y', index) * 1780 };
    if (!landPolygons.some((polygon) => pointInPolygon(point, polygon)) || isOnRoad(point)) continue;
    const color = index % 3 === 0 ? 0x315c3c : index % 2 ? 0x89a961 : 0x436f43;
    detail.lineStyle(1.2, color, 0.27).lineBetween(point.x, point.y + 5, point.x + (index % 2 ? 3 : -2), point.y);
  }

  const beach = BLUEPRINT_SITE_POLYGONS.find((polygon) => polygon.id === 'beach-strip')?.points ?? [];
  for (let index = 0; index < 110; index += 1) {
    const point = { x: 1960 + seededFraction('logical-sand-x', index) * 280, y: 20 + seededFraction('logical-sand-y', index) * 1060 };
    if (!pointInPolygon(point, beach) || isOnRoad(point)) continue;
    detail.fillStyle(index % 2 ? 0xb89d67 : 0xe7d39b, 0.32).fillEllipse(point.x, point.y, 5 + index % 4, 3);
  }
}

function drawAreaLabels(scene: Phaser.Scene): void {
  const labels: Array<[number, number, string]> = [
    [500, 1740, 'ANKUNFT UND PARKPLATZ'],
    [995, 1325, 'REZEPTION UND SCHRANKE'],
    [45, 25, 'OBERE STELLPLÄTZE'],
    [45, 350, 'ADRIA-KLAUSE UND SITZBEREICH'],
    [45, 705, 'SANITÄR UND DAUERCAMPER'],
    [45, 985, 'TAUCHERPLATZ'],
    [1425, 45, 'FESTWIESE'],
    [1425, 1040, 'SERVICEHOF'],
    [1965, 25, 'STRAND'],
    [1965, 1130, 'VERSTECKTE BUCHT'],
  ];
  for (const [x, y, label] of labels) {
    scene.add.text(x, y, label, {
      fontFamily: 'Arial Black, system-ui', fontSize: '11px', color: '#fff0bf', stroke: '#294433', strokeThickness: 4, letterSpacing: 1,
    }).setDepth(4.82).setAlpha(0.76);
  }
}

function isOnRoad(point: PlanPoint): boolean {
  return BLUEPRINT_ROADS.some((road) => {
    const bounds = blueprintRoadBounds(road);
    if (point.x < bounds.x || point.x > bounds.x + bounds.width || point.y < bounds.y || point.y > bounds.y + bounds.height) return false;
    const from = BLUEPRINT_NODES[road.from];
    const to = BLUEPRINT_NODES[road.to];
    return distanceToSegment(point, from, to) <= road.width / 2 + 8;
  });
}

function distanceToSegment(point: PlanPoint, from: PlanPoint, to: PlanPoint): number {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const lengthSquared = dx * dx + dy * dy;
  if (!lengthSquared) return Phaser.Math.Distance.Between(point.x, point.y, from.x, from.y);
  const t = Math.max(0, Math.min(1, ((point.x - from.x) * dx + (point.y - from.y) * dy) / lengthSquared));
  return Phaser.Math.Distance.Between(point.x, point.y, from.x + t * dx, from.y + t * dy);
}

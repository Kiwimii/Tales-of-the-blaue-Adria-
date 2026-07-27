import Phaser from 'phaser';
import {
  BLUEPRINT_BEACH_GATE,
  BLUEPRINT_FENCES,
  BLUEPRINT_NODES,
  BLUEPRINT_ROADS,
  BLUEPRINT_SITE_POLYGONS,
  BLUEPRINT_WATER_POLYGONS,
  blueprintRoadBounds,
} from './campgroundBlueprint';
import { AERIAL_PITCHES, pointInPolygon, type PlanPoint, type PlanRoad, type PlanPolygon } from './aerialCampgroundPlan';
import { seededFraction, type VisualProfile } from './visuals';

const ROAD_COLORS: Record<PlanRoad['surface'], { edge: number; fill: number; mark: number }> = {
  asphalt: { edge: 0x454b49, fill: 0x767c79, mark: 0xeee5c7 },
  gravel: { edge: 0x786746, fill: 0xb5a275, mark: 0xead8a8 },
  sand: { edge: 0xb49a63, fill: 0xd8c487, mark: 0xf3e2b2 },
};

export function drawCampgroundBlueprintLayer(scene: Phaser.Scene, profile: VisualProfile): void {
  drawWater(scene);
  drawLand(scene);
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

  water.lineStyle(3, 0x8ac4cd, 0.18);
  for (let index = 0; index < 32; index += 1) {
    const y = 80 + index * 48;
    water.beginPath();
    water.moveTo(20, y);
    water.lineTo(120 + (index % 4) * 24, y + 9);
    water.lineTo(240 + (index % 3) * 31, y - 5);
    water.strokePath();
  }
}

function drawLand(scene: Phaser.Scene): void {
  const land = scene.add.graphics().setDepth(4);
  for (const polygon of BLUEPRINT_SITE_POLYGONS) drawPolygon(land, polygon, 0.98);

  const treeLine = scene.add.graphics().setDepth(4.12);
  treeLine.lineStyle(24, 0x315b3e, 0.82);
  treeLine.beginPath();
  treeLine.moveTo(850, 260);
  treeLine.lineTo(855, 690);
  treeLine.lineTo(825, 1020);
  treeLine.moveTo(850, 1470);
  treeLine.lineTo(920, 1580);
  treeLine.lineTo(1900, 1610);
  treeLine.strokePath();
}

function drawPolygon(graphics: Phaser.GameObjects.Graphics, polygon: PlanPolygon, alpha: number): void {
  graphics.fillStyle(polygon.fill, alpha).fillPoints(polygon.points, true)
    .lineStyle(4, polygon.border, 0.5).strokePoints(polygon.points, true);
}

function drawRoadNetwork(scene: Phaser.Scene): void {
  const roads = scene.add.graphics().setDepth(4.5);
  for (const road of BLUEPRINT_ROADS) {
    const from = BLUEPRINT_NODES[road.from];
    const to = BLUEPRINT_NODES[road.to];
    const colors = ROAD_COLORS[road.surface];
    roads.lineStyle(road.width + 14, colors.edge, 1).lineBetween(from.x, from.y, to.x, to.y)
      .lineStyle(road.width, colors.fill, 1).lineBetween(from.x, from.y, to.x, to.y);
  }

  for (const [id, node] of Object.entries(BLUEPRINT_NODES)) {
    const connected = BLUEPRINT_ROADS.filter((road) => road.from === id || road.to === id);
    if (connected.length < 2) continue;
    const width = Math.max(...connected.map((road) => road.width));
    const surface = connected.some((road) => road.surface === 'asphalt') ? 'asphalt'
      : connected.some((road) => road.surface === 'gravel') ? 'gravel' : 'sand';
    const colors = ROAD_COLORS[surface];
    roads.fillStyle(colors.edge, 1).fillCircle(node.x, node.y, width * 0.58)
      .fillStyle(colors.fill, 1).fillCircle(node.x, node.y, width * 0.5);
  }

  const markings = scene.add.graphics().setDepth(4.54);
  for (const road of BLUEPRINT_ROADS) drawRoadMarks(markings, road);

  const parking = scene.add.graphics().setDepth(4.56);
  parking.lineStyle(4, 0xece4c7, 0.56);
  for (let index = 0; index < 7; index += 1) {
    const y = 335 + index * 55;
    parking.lineBetween(2175, y, 2295, y + 26);
  }
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
      graphics.lineStyle(3, colors.mark, 0.58).lineBetween(x - dx / 2, y - dy / 2, x + dx / 2, y + dy / 2);
    } else {
      graphics.fillStyle(colors.mark, 0.2).fillEllipse(x, y, 9, 5);
    }
  }
}

function drawPitchRows(scene: Phaser.Scene): void {
  const pitch = scene.add.graphics().setDepth(4.3);
  for (const entry of AERIAL_PITCHES) {
    pitch.fillStyle(entry.id === 'taucher' ? 0x8fb56d : entry.id === 'festival' ? 0x8d9b5b : 0x73935f, entry.id === 'taucher' ? 0.3 : 0.18)
      .fillRoundedRect(entry.x, entry.y, entry.width, entry.height, 18)
      .lineStyle(entry.id === 'taucher' ? 4 : 2, entry.id === 'taucher' ? 0xf4d47b : 0xe7d8a5, entry.id === 'taucher' ? 0.55 : 0.28)
      .strokeRoundedRect(entry.x, entry.y, entry.width, entry.height, 18);

    if (entry.label) {
      scene.add.text(entry.x + 14, entry.y + 12, entry.label, {
        fontFamily: 'Arial Black, system-ui', fontSize: '11px', color: '#fff0ba', stroke: '#294433', strokeThickness: 4,
      }).setDepth(4.66).setAlpha(0.78);
    }
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

  scene.add.text(gate.x - 5, gate.y + gate.height / 2, 'TOR ZUM STRAND', {
    fontFamily: 'Arial Black, system-ui', fontSize: '10px', color: '#fff3c8', backgroundColor: '#173027dd', padding: { x: 6, y: 3 },
  }).setOrigin(1, 0.5).setDepth(4.78);
}

function drawGroundDetail(scene: Phaser.Scene, profile: VisualProfile): void {
  const detail = scene.add.graphics().setDepth(4.18);
  const landPolygons = BLUEPRINT_SITE_POLYGONS.map((polygon) => polygon.points);
  const grassCount = profile.tier === 'cinematic' ? 620 : 380;
  for (let index = 0; index < grassCount; index += 1) {
    const point = {
      x: seededFraction('aerial-grass-x', index) * 2300,
      y: seededFraction('aerial-grass-y', index) * 1760,
    };
    if (!landPolygons.some((polygon) => pointInPolygon(point, polygon)) || isOnRoad(point)) continue;
    const color = index % 3 === 0 ? 0x315c3c : index % 2 ? 0x89a961 : 0x436f43;
    detail.lineStyle(1.2, color, 0.28).lineBetween(point.x, point.y + 5, point.x + (index % 2 ? 3 : -2), point.y);
  }

  const beach = BLUEPRINT_SITE_POLYGONS.find((polygon) => polygon.id === 'main-beach')?.points ?? [];
  for (let index = 0; index < 120; index += 1) {
    const point = {
      x: 180 + seededFraction('aerial-sand-x', index) * 650,
      y: 270 + seededFraction('aerial-sand-y', index) * 1030,
    };
    if (!pointInPolygon(point, beach)) continue;
    detail.fillStyle(index % 2 ? 0xb89d67 : 0xe7d39b, 0.34).fillEllipse(point.x, point.y, 5 + index % 4, 3);
  }
}

function drawAreaLabels(scene: Phaser.Scene): void {
  const labels: Array<[number, number, string]> = [
    [2160, 160, 'ZUFahrt VON DER ADRIASTRASSE'],
    [1680, 500, 'ANMELDUNG'],
    [950, 230, 'CAMPINGPLATZ'],
    [935, 1518, 'TAUCHERPLATZ'],
    [560, 1260, 'KIOSK AM STRANDTOR'],
    [260, 320, 'STRAND'],
    [1700, 1760, 'SERVICEWEG'],
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

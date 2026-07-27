import Phaser from 'phaser';
import {
  BLUEPRINT_NODES,
  BLUEPRINT_ROADS,
  BLUEPRINT_ZONES,
  blueprintRoadBounds,
  type BlueprintRoad,
  type BlueprintZone,
} from './campgroundBlueprint';
import { seededFraction, type VisualProfile } from './visuals';

const ROAD_COLORS: Record<BlueprintRoad['surface'], { edge: number; fill: number; mark: number }> = {
  asphalt: { edge: 0x4f5552, fill: 0x777d79, mark: 0xe5dec2 },
  gravel: { edge: 0x786746, fill: 0xb7a477, mark: 0xe9d7a5 },
  sand: { edge: 0xb49a63, fill: 0xd8c487, mark: 0xf3e2b2 },
};

export function drawCampgroundBlueprintLayer(scene: Phaser.Scene, profile: VisualProfile): void {
  drawUnifiedLand(scene);
  drawZones(scene);
  drawRoads(scene);
  drawPitchGrid(scene);
  drawGroundDetail(scene, profile);
  drawAreaLabels(scene);
}

function drawUnifiedLand(scene: Phaser.Scene): void {
  const base = scene.add.graphics().setDepth(4);
  base.fillStyle(0x648858, 1).fillRect(0, 0, 1400, 1800)
    .fillStyle(0x537650, 1).fillRect(1400, 0, 550, 1800)
    .fillStyle(0xd4c184, 1).fillRect(1950, 0, 300, 1100)
    .fillStyle(0x557b60, 1).fillRect(1950, 1100, 300, 700);

  base.fillStyle(0x2d543c, 0.92).fillRect(0, 0, 34, 1800)
    .fillRect(1368, 0, 32, 1800)
    .fillRect(1918, 0, 32, 1800);

  base.fillStyle(0x315c3f, 0.78).fillRect(2220, 0, 30, 1800);
  for (let y = 20; y < 1780; y += 28) {
    base.fillStyle(y % 56 ? 0x426f45 : 0x2f5c3c, 0.82)
      .fillTriangle(2220, y + 24, 2244, y, 2248, y + 27);
  }
}

function drawZones(scene: Phaser.Scene): void {
  const graphics = scene.add.graphics().setDepth(4.08);
  for (const zone of BLUEPRINT_ZONES) drawZone(graphics, zone);
}

function drawZone(graphics: Phaser.GameObjects.Graphics, zone: BlueprintZone): void {
  const { x, y, width, height } = zone.bounds;
  graphics.fillStyle(zone.ground, 0.96).fillRect(x, y, width, height)
    .lineStyle(3, zone.border, 0.28).strokeRect(x + 2, y + 2, width - 4, height - 4);
}

function drawRoads(scene: Phaser.Scene): void {
  const roads = scene.add.graphics().setDepth(4.45);
  for (const road of BLUEPRINT_ROADS) {
    const bounds = blueprintRoadBounds(road);
    const colors = ROAD_COLORS[road.surface];
    roads.fillStyle(colors.edge, 1).fillRect(bounds.x - 7, bounds.y - 7, bounds.width + 14, bounds.height + 14)
      .fillStyle(colors.fill, 1).fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
  }

  const hubs = scene.add.graphics().setDepth(4.47);
  for (const [id, node] of Object.entries(BLUEPRINT_NODES)) {
    const connected = BLUEPRINT_ROADS.filter((road) => road.from === id || road.to === id);
    if (connected.length < 2) continue;
    const width = Math.max(...connected.map((road) => road.width));
    const surface = connected.some((road) => road.surface === 'asphalt') ? 'asphalt'
      : connected.some((road) => road.surface === 'gravel') ? 'gravel' : 'sand';
    const colors = ROAD_COLORS[surface];
    hubs.fillStyle(colors.edge, 1).fillRect(node.x - width * 0.58, node.y - width * 0.58, width * 1.16, width * 1.16)
      .fillStyle(colors.fill, 1).fillRect(node.x - width * 0.5, node.y - width * 0.5, width, width);
  }

  const markings = scene.add.graphics().setDepth(4.5);
  markings.lineStyle(3, ROAD_COLORS.asphalt.mark, 0.6);
  for (let y = 1540; y < 1730; y += 52) markings.lineBetween(825, y, 825, y + 25);

  for (const road of BLUEPRINT_ROADS.filter((entry) => entry.surface !== 'asphalt')) {
    const from = BLUEPRINT_NODES[road.from];
    const to = BLUEPRINT_NODES[road.to];
    const horizontal = from.y === to.y;
    const distance = horizontal ? Math.abs(to.x - from.x) : Math.abs(to.y - from.y);
    for (let step = 35; step < distance; step += 62) {
      const progress = step / distance;
      const x = Phaser.Math.Linear(from.x, to.x, progress);
      const y = Phaser.Math.Linear(from.y, to.y, progress);
      markings.fillStyle(ROAD_COLORS[road.surface].mark, 0.18).fillEllipse(x, y, 8, 4);
    }
  }
}

function drawPitchGrid(scene: Phaser.Scene): void {
  const pitch = scene.add.graphics().setDepth(4.28);
  pitch.lineStyle(2, 0xe7d8a5, 0.26);

  for (const x of [100, 300, 500, 700, 950, 1150, 1300]) pitch.lineBetween(x, 760, x, 1240);
  pitch.lineBetween(50, 1025, 750, 1025).lineBetween(900, 1025, 1350, 1025);

  for (const x of [100, 350, 600, 950, 1150, 1300]) pitch.lineBetween(x, 60, x, 690);
  pitch.lineBetween(50, 375, 750, 375).lineBetween(900, 375, 1350, 375);

  pitch.lineStyle(3, 0xdad3b6, 0.5);
  for (const x of [550, 650, 750, 900, 1000, 1100, 1200, 1300]) pitch.lineBetween(x, 1540, x, 1710);

  pitch.lineStyle(3, 0x3f633f, 0.34)
    .strokeRect(1415, 70, 470, 810)
    .strokeRect(1415, 970, 470, 760)
    .strokeRect(1970, 70, 240, 960)
    .strokeRect(1970, 1120, 240, 610);
}

function drawGroundDetail(scene: Phaser.Scene, profile: VisualProfile): void {
  const detail = scene.add.graphics().setDepth(4.2);
  const grassCount = profile.tier === 'cinematic' ? 540 : 330;
  for (let index = 0; index < grassCount; index += 1) {
    const x = seededFraction('blueprint-grass-x', index) * 1940;
    const y = seededFraction('blueprint-grass-y', index) * 1800;
    if (isOnRoad(x, y)) continue;
    const color = index % 3 === 0 ? 0x315c3c : index % 2 ? 0x83a85d : 0x436f43;
    detail.lineStyle(1.2, color, 0.28).lineBetween(x, y + 5, x + (index % 2 ? 3 : -2), y);
  }

  for (let index = 0; index < 80; index += 1) {
    const x = 1970 + seededFraction('blueprint-sand-x', index) * 240;
    const y = 70 + seededFraction('blueprint-sand-y', index) * 960;
    detail.fillStyle(index % 2 ? 0xb89d67 : 0xe7d39b, 0.32).fillEllipse(x, y, 5 + index % 4, 3);
  }

  detail.fillStyle(0x9c865a, 0.28);
  for (let index = 0; index < 18; index += 1) {
    const x = 1990 + seededFraction('blueprint-foot-x', index) * 180;
    const y = 690 + seededFraction('blueprint-foot-y', index) * 300;
    detail.fillEllipse(x, y, 7, 3).fillEllipse(x + 7, y + 10, 7, 3);
  }
}

function drawAreaLabels(scene: Phaser.Scene): void {
  const labels: Array<[number, number, string]> = [
    [90, 735, 'NORDLAGER'],
    [90, 1265, 'TAUCHERPLATZ'],
    [470, 1770, 'ANKUNFT'],
    [1425, 920, 'FESTWIESE'],
    [1425, 1770, 'WALDPFAD'],
    [1975, 1070, 'STRAND'],
    [1975, 1770, 'BUCHT'],
  ];
  for (const [x, y, label] of labels) {
    scene.add.text(x, y, label, {
      fontFamily: 'Arial Black, system-ui',
      fontSize: '11px',
      color: '#fff0bf',
      stroke: '#294433',
      strokeThickness: 4,
      letterSpacing: 1,
    }).setDepth(4.65).setAlpha(0.74);
  }
}

function isOnRoad(x: number, y: number): boolean {
  return BLUEPRINT_ROADS.some((road) => {
    const bounds = blueprintRoadBounds(road);
    return x >= bounds.x && x <= bounds.x + bounds.width && y >= bounds.y && y <= bounds.y + bounds.height;
  });
}

import Phaser from 'phaser';
import {
  CAMP_DISTRICTS,
  CAMP_ROADS,
  CAMP_ROAD_NODES,
  planPlacement,
  type PlanDistrict,
  type PlanRoad,
} from './campgroundPlan';
import { seededFraction, type VisualProfile } from './visuals';
import { worldDepth } from './worldRealism';

const ROAD_COLORS: Record<PlanRoad['surface'], { edge: number; fill: number; line: number }> = {
  asphalt: { edge: 0x4e5351, fill: 0x777d79, line: 0xd9d4ba },
  gravel: { edge: 0x746343, fill: 0xb8a578, line: 0xead8a5 },
  sand: { edge: 0xb59b63, fill: 0xd8c487, line: 0xf4e4b4 },
};

export function drawCampgroundPlanLayer(scene: Phaser.Scene, profile: VisualProfile): void {
  drawPlanBase(scene);
  drawDistricts(scene);
  drawRoadNetwork(scene);
  drawPitchStructure(scene);
  drawPlanDetails(scene, profile);
}

function drawPlanBase(scene: Phaser.Scene): void {
  const base = scene.add.graphics().setDepth(2.04);
  base.fillStyle(0x678b5a, 0.99).fillRect(0, 0, 1400, 1800);
  base.fillStyle(0x567a52, 0.99).fillRect(1400, 0, 550, 1800);
  base.fillStyle(0x708d5f, 0.99).fillRect(1950, 0, 300, 1100);
  base.fillStyle(0x587b60, 0.99).fillRect(1950, 1100, 270, 700);
  base.lineStyle(5, 0x294b36, 0.16)
    .lineBetween(1400, 0, 1400, 1800)
    .lineBetween(1950, 0, 1950, 1800)
    .lineBetween(0, 760, 1400, 760)
    .lineBetween(0, 1280, 1400, 1280)
    .lineBetween(1400, 980, 1950, 980)
    .lineBetween(1950, 1100, 2220, 1100);
}

function drawDistricts(scene: Phaser.Scene): void {
  const districts = scene.add.graphics().setDepth(2.08);
  for (const district of CAMP_DISTRICTS) drawDistrict(districts, district);

  for (const district of CAMP_DISTRICTS) {
    scene.add.text(district.bounds.x + 18, district.bounds.y + 15, district.label, {
      fontFamily: 'Arial Black, system-ui',
      fontSize: '11px',
      color: '#fff2c7',
      stroke: '#294433',
      strokeThickness: 4,
      letterSpacing: 1,
    }).setDepth(2.7).setAlpha(0.78);
  }
}

function drawDistrict(graphics: Phaser.GameObjects.Graphics, district: PlanDistrict): void {
  const { x, y, width, height } = district.bounds;
  graphics.fillStyle(0x1e3428, 0.18).fillRoundedRect(x + 8, y + 10, width, height, 28)
    .fillStyle(district.ground, 0.98).fillRoundedRect(x, y, width, height, 28)
    .lineStyle(3, district.border, 0.42).strokeRoundedRect(x + 4, y + 4, width - 8, height - 8, 24);
}

function drawRoadNetwork(scene: Phaser.Scene): void {
  const roads = scene.add.graphics().setDepth(2.42);
  for (const road of CAMP_ROADS) drawRoad(roads, road);

  const hubs = scene.add.graphics().setDepth(2.44);
  for (const [id, node] of Object.entries(CAMP_ROAD_NODES)) {
    const connected = CAMP_ROADS.filter((road) => road.from === id || road.to === id);
    if (connected.length < 2) continue;
    const width = Math.max(...connected.map((road) => road.width));
    const surface = connected.some((road) => road.surface === 'asphalt') ? 'asphalt'
      : connected.some((road) => road.surface === 'gravel') ? 'gravel' : 'sand';
    hubs.fillStyle(ROAD_COLORS[surface].edge, 0.98).fillCircle(node.x + 5, node.y + 7, width * 0.57)
      .fillStyle(ROAD_COLORS[surface].fill, 1).fillCircle(node.x, node.y, width * 0.52);
  }

  const markings = scene.add.graphics().setDepth(2.48);
  markings.lineStyle(3, 0xe9e0c3, 0.5);
  for (let y = 1495; y <= 1715; y += 55) markings.lineBetween(835, y, 835, y + 27);
  markings.lineStyle(2, 0x715e3d, 0.23);
  for (const road of CAMP_ROADS.filter((entry) => entry.surface !== 'asphalt')) {
    const from = CAMP_ROAD_NODES[road.from];
    const to = CAMP_ROAD_NODES[road.to];
    const horizontal = from.y === to.y;
    const distance = horizontal ? Math.abs(to.x - from.x) : Math.abs(to.y - from.y);
    for (let step = 45; step < distance; step += 70) {
      const progress = step / distance;
      const x = Phaser.Math.Linear(from.x, to.x, progress);
      const y = Phaser.Math.Linear(from.y, to.y, progress);
      markings.fillStyle(0x786441, 0.2).fillEllipse(x + (step % 3) * 3, y + (step % 2) * 4, 8, 4);
    }
  }
}

function drawRoad(graphics: Phaser.GameObjects.Graphics, road: PlanRoad): void {
  const from = CAMP_ROAD_NODES[road.from];
  const to = CAMP_ROAD_NODES[road.to];
  const colors = ROAD_COLORS[road.surface];
  graphics.lineStyle(road.width + 18, colors.edge, 0.98)
    .lineBetween(from.x + 6, from.y + 8, to.x + 6, to.y + 8)
    .lineStyle(road.width, colors.fill, 1)
    .lineBetween(from.x, from.y, to.x, to.y)
    .lineStyle(2, colors.line, road.surface === 'asphalt' ? 0.35 : 0.22)
    .lineBetween(from.x, from.y, to.x, to.y);
}

function drawPitchStructure(scene: Phaser.Scene): void {
  const pitch = scene.add.graphics().setDepth(2.3);
  pitch.lineStyle(2, 0xe8d8a1, 0.28);

  for (const x of [150, 360, 550, 740, 930, 1110, 1320]) pitch.lineBetween(x, 790, x, 1250);
  pitch.lineBetween(130, 1070, 740, 1070).lineBetween(930, 1070, 1320, 1070);

  for (const x of [80, 410, 740, 930, 1130, 1330]) pitch.lineBetween(x, 70, x, 715);
  pitch.lineBetween(70, 365, 740, 365).lineBetween(930, 365, 1330, 365);

  pitch.lineStyle(3, 0xd9d3b8, 0.55);
  for (const x of [555, 665, 775, 895, 1015, 1135, 1255]) pitch.lineBetween(x, 1510, x, 1705);

  pitch.lineStyle(3, 0x426342, 0.38);
  pitch.strokeRoundedRect(1465, 70, 410, 825, 22)
    .strokeRoundedRect(1985, 85, 220, 930, 22)
    .strokeRoundedRect(1430, 1020, 485, 685, 22)
    .strokeRoundedRect(1985, 1150, 215, 575, 22);
}

function drawPlanDetails(scene: Phaser.Scene, profile: VisualProfile): void {
  drawArrival(scene);
  drawSouthCamp(scene);
  drawNorthCamp(scene);
  drawFestival(scene);
  drawBeach(scene, profile);
  drawWoodland(scene);
  drawCove(scene);
}

function drawArrival(scene: Phaser.Scene): void {
  const g = scene.add.graphics().setDepth(3.25);
  g.lineStyle(6, 0x4d514f, 0.45);
  for (const x of [610, 720, 950, 1060, 1170, 1280]) g.lineBetween(x, 1530, x, 1690);
  g.lineStyle(3, 0xe8e0c2, 0.58).lineBetween(775, 1320, 895, 1320);
  g.fillStyle(0x3b4541).fillRoundedRect(1240, 1530, 42, 58, 5)
    .fillStyle(0x17221f).fillRoundedRect(1246, 1537, 30, 15, 3);
  for (const x of [760, 910]) {
    g.fillStyle(0x505854).fillRoundedRect(x - 7, 1270, 14, 62, 4)
      .fillStyle(0xf4c75d).fillRect(x - 4, 1282, 8, 10);
  }
}

function drawSouthCamp(scene: Phaser.Scene): void {
  const g = scene.add.graphics().setDepth(3.18);
  g.fillStyle(0x8a764d, 0.18).fillEllipse(600, 1010, 190, 105);
  for (const [x, y, color] of [[345, 1040, 0x5e85b5], [520, 1050, 0xd8a34f], [710, 1040, 0x5cae9e], [1080, 1040, 0xd86f75]] as const) {
    drawChair(g, x, y, color);
  }
  for (const [x, y] of [[430, 1185], [620, 1180], [1000, 1180], [1190, 1185]] as const) {
    g.lineStyle(2, 0xd8d0b0, 0.55).lineBetween(x, y, x - 28, y + 18).lineBetween(x, y, x + 28, y + 18)
      .fillStyle(0x685237).fillCircle(x - 28, y + 18, 3).fillCircle(x + 28, y + 18, 3);
  }
  g.fillStyle(0x4c6f88).fillRoundedRect(1060, 1160, 68, 42, 6)
    .fillStyle(0xd8b44d).fillRoundedRect(1140, 1168, 58, 34, 5)
    .fillStyle(0x6e4a31).fillRoundedRect(1205, 1170, 46, 30, 4);
}

function drawNorthCamp(scene: Phaser.Scene): void {
  const g = scene.add.graphics().setDepth(3.12);
  g.lineStyle(3, 0x6f5439, 0.72).lineBetween(430, 340, 720, 350);
  for (let index = 0; index < 9; index += 1) {
    const x = 445 + index * 33;
    g.fillStyle(index % 2 ? 0xf0d27a : 0xe8eee0, 0.9).fillTriangle(x, 344, x + 18, 345, x + 9, 365);
  }
  for (const x of [150, 1050, 1210]) {
    g.fillStyle(0x725039).fillRoundedRect(x, 330, 92, 22, 5)
      .fillStyle(0x9aba6e).fillRect(x + 7, 322, 78, 15);
  }
  g.lineStyle(2, 0xe7ddbf, 0.33);
  for (let x = 120; x < 1320; x += 70) g.lineBetween(x, 690, x + 35, 690);
}

function drawFestival(scene: Phaser.Scene): void {
  const g = scene.add.graphics().setDepth(3.2);
  for (const x of [1490, 1840]) {
    g.fillStyle(0x25282c).fillRoundedRect(x, 555, 44, 70, 6)
      .fillStyle(0x15171a).fillCircle(x + 22, 575, 12).fillCircle(x + 22, 607, 9);
  }
  g.lineStyle(5, 0x2b2e31, 0.55).lineBetween(1530, 615, 1800, 615);
  for (let index = 0; index < 28; index += 1) {
    const x = 1470 + seededFraction('plan-festival-x', index) * 400;
    const y = 600 + seededFraction('plan-festival-y', index) * 285;
    g.fillStyle(index % 3 ? 0xd8d0ba : 0xef765e, 0.42).fillCircle(x, y, 2 + (index % 2));
  }
}

function drawBeach(scene: Phaser.Scene, profile: VisualProfile): void {
  const g = scene.add.graphics().setDepth(3.35);
  g.fillStyle(0xc5aa70, 0.34).fillRoundedRect(1985, 650, 215, 85, 24);
  for (let index = 0; index < 22; index += 1) {
    const x = 1988 + seededFraction('plan-foot-x', index) * 205;
    const y = 690 + seededFraction('plan-foot-y', index) * 310;
    g.fillStyle(0x9c865a, 0.34).fillEllipse(x, y, 7, 3).fillEllipse(x + 7, y + 10, 7, 3);
  }
  for (let y = 90; y < 1040; y += 30) {
    g.lineStyle(2, 0x456d45, 0.68).lineBetween(2198, y + 18, 2204, y)
      .fillStyle(0x6d5b36, 0.66).fillEllipse(2204, y, 4, 12);
  }
  g.lineStyle(5, 0xf1e5c5, 0.85).strokeCircle(2070, 405, 22)
    .lineStyle(5, 0xef685c, 0.9).beginPath().arc(2070, 405, 22, 0, Math.PI / 2).strokePath();
  const shimmerCount = profile.tier === 'cinematic' ? 14 : 8;
  for (let index = 0; index < shimmerCount; index += 1) {
    const line = scene.add.graphics().setDepth(3.55);
    line.lineStyle(2, 0xd9fbf3, 0.28).lineBetween(2270 + (index % 3) * 92, 170 + Math.floor(index / 3) * 170, 2330 + (index % 3) * 92, 165 + Math.floor(index / 3) * 170);
    scene.tweens.add({ targets: line, x: { from: -5, to: 7 }, alpha: { from: 0.28, to: 0.62 }, duration: 2100 + index * 90, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
  }
}

function drawWoodland(scene: Phaser.Scene): void {
  const g = scene.add.graphics().setDepth(3.1);
  for (let index = 0; index < 70; index += 1) {
    const x = 1420 + seededFraction('plan-leaf-x', index) * 500;
    const y = 1030 + seededFraction('plan-leaf-y', index) * 660;
    g.fillStyle(index % 3 ? 0x755238 : 0x9b7548, 0.3).fillEllipse(x, y, 7, 3);
  }
  for (let row = 0; row < 4; row += 1) {
    for (let column = 0; column < 5; column += 1) {
      const x = 1785 + column * 22 + (row % 2) * 7;
      const y = 1440 + row * 17;
      g.fillStyle(row % 2 ? 0x8f613f : 0xa7774d).fillCircle(x, y, 10)
        .fillStyle(0x3f2d22).fillCircle(x, y, 3);
    }
  }
  g.fillStyle(0x4c5652).fillRoundedRect(1450, 1320, 62, 25, 4)
    .fillStyle(0xb77a45).fillRect(1457, 1327, 48, 5);
}

function drawCove(scene: Phaser.Scene): void {
  const g = scene.add.graphics().setDepth(3.3);
  for (let index = 0; index < 42; index += 1) {
    const x = 1980 + seededFraction('plan-cove-x', index) * 215;
    const y = 1160 + seededFraction('plan-cove-y', index) * 560;
    g.fillStyle(index % 2 ? 0x788179 : 0xa69d85, 0.38).fillEllipse(x, y, 7, 4);
  }
  g.lineStyle(9, 0x6b4a31, 0.82).lineBetween(1995, 1585, 2075, 1610)
    .lineStyle(4, 0x8f6742, 0.75).lineBetween(2020, 1593, 2005, 1575).lineBetween(2055, 1602, 2070, 1583);
  g.fillStyle(0x2f5a43, 0.45).fillEllipse(2040, 1710, 160, 35);
}

function drawChair(graphics: Phaser.GameObjects.Graphics, x: number, y: number, color: number): void {
  graphics.lineStyle(4, 0x443a30, 0.9)
    .lineBetween(x - 14, y + 4, x - 8, y + 28)
    .lineBetween(x + 14, y + 4, x + 8, y + 28)
    .fillStyle(color, 0.9).fillRoundedRect(x - 15, y - 20, 30, 26, 4)
    .fillStyle(color, 0.76).fillRoundedRect(x - 18, y + 2, 36, 10, 3);
}

export function planLabelDepth(y: number): number {
  return worldDepth(y) - 0.4;
}

export function plannedObjectPoint(id: string): { x: number; y: number } | null {
  return planPlacement(id);
}

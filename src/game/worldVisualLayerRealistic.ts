import Phaser from 'phaser';
import { colorShade, seededFraction, type VisualProfile } from './visuals';
import {
  CAMPFIRE_POSITION,
  WATER_COLLIDERS,
  applyRealisticWorldLayout,
  collisionFootprint,
  worldDepth,
} from './worldRealism';
import {
  EXPANDED_WORLD_HEIGHT,
  EXPANDED_WORLD_OBJECTS,
  EXPANDED_WORLD_WIDTH,
  WORLD_REGIONS,
  type ExpandedWorldObject,
} from './worldV2';

export interface WorldVisualBuild {
  obstacles: Phaser.GameObjects.Zone[];
  lanternGlows: Phaser.GameObjects.Arc[];
  fireflies: Phaser.GameObjects.Arc[];
}

type Graphics = Phaser.GameObjects.Graphics;

export function buildExpandedWorldVisuals(scene: Phaser.Scene, profile: VisualProfile): WorldVisualBuild {
  applyRealisticWorldLayout();
  drawTerrain(scene, profile);
  drawRoads(scene);
  drawLake(scene, profile);
  const obstacles = WATER_COLLIDERS.map((bounds) => obstacle(scene, bounds.x, bounds.y, bounds.width, bounds.height));
  const { lanternGlows, fireflies } = drawAtmosphere(scene, profile);

  EXPANDED_WORLD_OBJECTS.forEach((object, index) => {
    const glow = drawObject(scene, object, index, profile);
    if (glow) lanternGlows.push(glow);
    if (object.solid === false || ['sign', 'lantern', 'flowerbed', 'dock'].includes(object.kind)) return;
    const footprint = collisionFootprint(object);
    obstacles.push(obstacle(scene, footprint.x, footprint.y, footprint.width, footprint.height));
  });

  return { obstacles, lanternGlows, fireflies };
}

function drawTerrain(scene: Phaser.Scene, profile: VisualProfile): void {
  const g = scene.add.graphics().setDepth(0);
  g.fillGradientStyle(0x6f965f, 0x789e63, 0x4d7450, 0x5f8355, 1)
    .fillRect(0, 0, EXPANDED_WORLD_WIDTH, EXPANDED_WORLD_HEIGHT);

  for (const region of WORLD_REGIONS) {
    const { x, y, width, height } = region.bounds;
    g.fillStyle(region.ground, region.id === 'arrival' ? 0.72 : 0.54).fillRect(x, y, width, height);
    g.lineStyle(2, colorShade(region.accent, 0.72), 0.12).strokeRect(x + 2, y + 2, width - 4, height - 4);
    scene.add.text(x + 24, y + 22, region.title.toUpperCase(), {
      fontFamily: 'Arial Black, system-ui',
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#fff8dc',
      stroke: '#173027',
      strokeThickness: 5,
    }).setDepth(worldDepth(y + 30));
  }

  const tones = [0x315c3c, 0x436f43, 0x83a85d, 0xb8c979];
  const count = profile.tier === 'cinematic' ? 920 : 560;
  for (let i = 0; i < count; i += 1) {
    const x = seededFraction('grass-x2', i) * EXPANDED_WORLD_WIDTH;
    const y = seededFraction('grass-y2', i) * EXPANDED_WORLD_HEIGHT;
    if (x > 1940 && y < 1100) continue;
    g.lineStyle(1.2, tones[i % tones.length], 0.3).lineBetween(x, y + 5, x + (i % 2 ? 3 : -2), y);
    if (i % 29 === 0) g.fillStyle(i % 58 ? 0xe8eee0 : 0xf0d27a, 0.72).fillCircle(x + 3, y - 1, 1.8);
  }
}

function drawRoads(scene: Phaser.Scene): void {
  const g = scene.add.graphics().setDepth(2);
  g.fillGradientStyle(0x8c9290, 0x7e8583, 0x5d6262, 0x676d6b, 1).fillRoundedRect(535, 1460, 820, 280, 30);
  g.lineStyle(4, 0xd8d4bd, 0.78);
  for (let x = 585; x < 1320; x += 112) g.lineBetween(x, 1510, x, 1685);

  const paths: Array<[Array<[number, number]>, number, number]> = [
    [[[830, 1460], [830, 1260], [760, 1130], [720, 940], [730, 760]], 112, 0xbda97b],
    [[[720, 940], [430, 930], [260, 850]], 82, 0xc9b78b],
    [[[760, 930], [1110, 900], [1370, 760], [1520, 650], [1740, 600]], 88, 0xcdb98a],
    [[[720, 760], [690, 560], [650, 360], [670, 170]], 82, 0xc4ae7d],
    [[[1740, 600], [1970, 590], [2100, 620]], 78, 0xd8c487],
    [[[1680, 850], [1680, 1110], [1660, 1410], [1720, 1650]], 72, 0xa9946c],
    [[[1720, 1650], [1980, 1570], [2200, 1510]], 68, 0x9c8a69],
  ];
  paths.forEach(([points, width, color]) => drawPath(g, points, width, color));
}

function drawPath(g: Graphics, points: Array<[number, number]>, width: number, color: number): void {
  for (const [offset, tone, alpha] of [[8, colorShade(color, 0.72), 0.2], [0, color, 1]] as Array<[number, number, number]>) {
    g.lineStyle(width, tone, alpha).beginPath().moveTo(points[0][0] + offset, points[0][1] + offset);
    points.slice(1).forEach(([x, y]) => g.lineTo(x + offset, y + offset));
    g.strokePath();
  }
  g.lineStyle(2, 0xf0dfaa, 0.22).beginPath().moveTo(points[0][0], points[0][1]);
  points.slice(1).forEach(([x, y]) => g.lineTo(x, y));
  g.strokePath();
}

function drawLake(scene: Phaser.Scene, profile: VisualProfile): void {
  const g = scene.add.graphics().setDepth(3);
  g.fillStyle(0xe4ce8d).fillRoundedRect(1955, 30, 305, 1040, 50).fillRoundedRect(1955, 1120, 285, 650, 48);
  g.fillGradientStyle(0x62b3cb, 0x4b9fbd, 0x2f7096, 0x357e9d, 1)
    .fillRoundedRect(2250, 20, 350, 1080, 72)
    .fillRoundedRect(2220, 1100, 380, 700, 78);

  g.lineStyle(3, 0xb7ecf2, 0.34);
  for (let y = 80; y < 1760; y += 42) {
    const x = y < 1100 ? 2280 : 2250;
    g.beginPath().moveTo(x, y).lineTo(x + 82, y - 7).lineTo(x + 175, y + 5).lineTo(2560, y - 4).strokePath();
  }
  g.fillStyle(0x315c3f, 0.8);
  for (let y = 80; y < 1760; y += 31) {
    const x = y < 1100 ? 2240 : 2210;
    g.fillTriangle(x, y + 12, x + 17, y - 10, x + 15, y + 17);
  }

  for (let i = 0; i < profile.animatedWaterLines; i += 1) {
    const shimmer = scene.add.graphics().setDepth(7);
    const x = 2300 + (i % 3) * 95;
    const y = 120 + Math.floor(i / 3) * 220;
    shimmer.lineStyle(3, i % 2 ? 0x8ddae2 : 0xd9fbf3, 0.34)
      .beginPath().moveTo(x - 34, y).lineTo(x, y - 5).lineTo(x + 45, y + 2).strokePath();
    scene.tweens.add({
      targets: shimmer,
      x: { from: -7, to: 9 },
      alpha: { from: 0.3, to: 0.72 },
      duration: 2300 + i * 160,
      delay: i * 110,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.InOut',
    });
  }
}

function drawAtmosphere(scene: Phaser.Scene, profile: VisualProfile): { lanternGlows: Phaser.GameObjects.Arc[]; fireflies: Phaser.GameObjects.Arc[] } {
  const g = scene.add.graphics().setDepth(worldDepth(300));
  g.lineStyle(3, 0x44311f, 0.72).lineBetween(1460, 270, 1905, 285);
  const flags = [0xef685c, 0xf4c75d, 0x66dac6, 0x6e9fd2, 0xb99ce8];
  for (let i = 0; i < 15; i += 1) {
    g.fillStyle(flags[i % flags.length], 0.96)
      .fillTriangle(1470 + i * 29, 270 + i, 1492 + i * 29, 272 + i, 1481 + i * 29, 295 + i);
  }

  drawCampfire(scene, CAMPFIRE_POSITION.x, CAMPFIRE_POSITION.y);
  const fireflies: Phaser.GameObjects.Arc[] = [];
  for (let i = 0; i < profile.ambientSprites; i += 1) {
    const region = i % 2 ? WORLD_REGIONS[5] : WORLD_REGIONS[2];
    const fly = scene.add.circle(
      region.bounds.x + 50 + seededFraction('fly-x', i) * (region.bounds.width - 100),
      region.bounds.y + 80 + seededFraction('fly-y', i) * (region.bounds.height - 140),
      1.3 + (i % 3) * 0.55,
      i % 4 ? 0xffe58c : 0xb8f0ad,
      0,
    ).setDepth(72);
    fireflies.push(fly);
    scene.tweens.add({
      targets: fly,
      x: `+=${Math.round((seededFraction('fly-dx', i) - 0.5) * 48)}`,
      y: `+=${Math.round((seededFraction('fly-dy', i) - 0.5) * 36)}`,
      duration: 2800 + i * 125,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.InOut',
    });
  }

  if (profile.foliageMotion) {
    for (let i = 0; i < 5; i += 1) {
      const leaf = scene.add.ellipse(
        300 + seededFraction('leaf-x', i) * 1450,
        160 + seededFraction('leaf-y', i) * 1350,
        7,
        3,
        i % 2 ? 0x8db65f : 0xd4b45c,
        0.58,
      ).setDepth(71).setAngle(i * 29);
      scene.tweens.add({
        targets: leaf,
        x: '+=85',
        y: '+=34',
        angle: '+=190',
        alpha: 0,
        duration: 5200 + i * 520,
        delay: i * 800,
        repeat: -1,
        ease: 'Sine.InOut',
      });
    }
  }

  return { lanternGlows: [], fireflies };
}

function drawCampfire(scene: Phaser.Scene, x: number, y: number): void {
  const depth = worldDepth(y + 28);
  scene.add.ellipse(x, y + 18, 124, 44, 0x132119, 0.3).setDepth(depth - 0.3);
  const ring = scene.add.graphics().setDepth(depth);
  ring.lineStyle(8, 0x75614a).strokeCircle(x, y, 39)
    .lineStyle(4, 0x3f2b22, 0.9).lineBetween(x - 27, y + 15, x + 27, y - 11).lineBetween(x - 25, y - 12, x + 28, y + 16);
  const glow = scene.add.circle(x, y - 1, 50, 0xffa142, 0.13).setDepth(depth + 0.1);
  const flame = scene.add.graphics().setPosition(x, y).setDepth(depth + 0.2);
  flame.fillStyle(0xff5f3b, 0.96).fillTriangle(-20, 10, 0, -40, 20, 10)
    .fillStyle(0xffd15d, 0.98).fillTriangle(-10, 8, 2, -26, 12, 8);
  scene.tweens.add({
    targets: glow,
    alpha: { from: 0.09, to: 0.17 },
    scale: { from: 0.97, to: 1.03 },
    duration: 720,
    yoyo: true,
    repeat: -1,
    ease: 'Sine.InOut',
  });
  scene.tweens.add({
    targets: flame,
    scaleX: { from: 0.98, to: 1.02 },
    scaleY: { from: 0.94, to: 1.05 },
    angle: { from: -0.35, to: 0.35 },
    duration: 470,
    yoyo: true,
    repeat: -1,
    ease: 'Sine.InOut',
  });
}

function drawObject(scene: Phaser.Scene, object: ExpandedWorldObject, index: number, profile: VisualProfile): Phaser.GameObjects.Arc | undefined {
  const depth = worldDepth(object.y + object.height);
  const g = scene.add.graphics().setDepth(depth);
  let glow: Phaser.GameObjects.Arc | undefined;

  switch (object.kind) {
    case 'building': drawBuilding(g, object); break;
    case 'kiosk': drawSmallStructure(g, object); break;
    case 'tent': drawTent(g, object); break;
    case 'party-tent': drawPartyTent(g, object); break;
    case 'camper': drawCamper(g, object); break;
    case 'tree': drawTree(scene, g, object, index, profile); break;
    case 'stage': drawStage(g, object); break;
    case 'dock': drawDock(g, object); break;
    case 'rock': drawRock(g, object); break;
    case 'flowerbed': drawFlowers(g, object); break;
    case 'lantern': glow = drawLantern(scene, g, object); break;
    case 'fence': drawFence(g, object); break;
    case 'table': drawFurniture(g, object, true); break;
    case 'bench': drawFurniture(g, object, false); break;
    default: drawSign(g, object);
  }

  if (object.label) {
    scene.add.text(object.x + object.width / 2, object.y + object.height / 2, object.label, {
      fontFamily: 'Arial Black, system-ui',
      fontSize: object.kind === 'sign' ? '10px' : '12px',
      fontStyle: 'bold',
      color: ['building', 'stage', 'kiosk'].includes(object.kind) ? '#fff4d2' : '#213027',
      stroke: ['building', 'stage', 'kiosk'].includes(object.kind) ? '#13241f' : '#f3d98d',
      strokeThickness: 3,
      align: 'center',
    }).setOrigin(0.5).setDepth(depth + 0.25);
  }
  return glow;
}

function drawBuilding(g: Graphics, object: ExpandedWorldObject): void {
  if (object.id === 'sanitary') return drawSanitary(g, object);
  if (object.id === 'lifeguard') return drawLifeguard(g, object);
  if (object.id === 'workshop') return drawWorkshop(g, object);
  drawHouse(g, object, object.id === 'clubhouse');
}

function drawHouse(g: Graphics, { x, y, width: w, height: h, color = 0x8e6548 }: ExpandedWorldObject, clubhouse: boolean): void {
  g.fillStyle(0x102018, 0.27).fillEllipse(x + w / 2 + 12, y + h + 12, w * 1.03, 40)
    .fillStyle(colorShade(color, 0.72)).fillRoundedRect(x + 8, y + 12, w, h, 15)
    .fillStyle(color).fillRoundedRect(x, y, w, h, 16);
  g.fillStyle(0x573526).fillTriangle(x - 12, y + 20, x + w / 2, y - 50, x + w + 12, y + 20)
    .fillStyle(0x8d5637).fillTriangle(x + 8, y + 17, x + w / 2, y - 39, x + w - 8, y + 17);
  g.lineStyle(3, 0xc78552, 0.65);
  for (let row = 0; row < 4; row += 1) g.lineBetween(x + 28 + row * 12, y + 8 - row * 9, x + w - 28 - row * 12, y + 8 - row * 9);
  drawWindowsAndDoor(g, x, y, w, h);
  if (clubhouse) {
    g.fillStyle(0xf4c75d).fillRoundedRect(x + w * 0.28, y + 25, w * 0.44, 26, 5)
      .lineStyle(2, 0xffefbf, 0.6).strokeRoundedRect(x + w * 0.28, y + 25, w * 0.44, 26, 5);
  }
}

function drawSanitary(g: Graphics, { x, y, width: w, height: h, color = 0xd9d6c8 }: ExpandedWorldObject): void {
  g.fillStyle(0x102018, 0.24).fillEllipse(x + w / 2 + 10, y + h + 10, w, 38)
    .fillStyle(colorShade(color, 0.78)).fillRoundedRect(x + 7, y + 12, w, h, 10)
    .fillStyle(color).fillRoundedRect(x, y, w, h, 10)
    .fillStyle(0x68797a).fillRoundedRect(x - 5, y - 13, w + 10, 26, 6);
  g.lineStyle(2, 0x8b9795, 0.42);
  for (let row = y + 28; row < y + h - 10; row += 22) g.lineBetween(x + 5, row, x + w - 5, row);
  for (let column = x + 28; column < x + w; column += 46) g.lineBetween(column, y + 16, column, y + h - 6);
  for (let i = 0; i < 3; i += 1) {
    g.fillGradientStyle(0xa8d6df, 0x6aa4b3, 0x4c7c89, 0x73a9b6, 1)
      .fillRoundedRect(x + 24 + i * 73, y + 35, 45, 30, 4);
  }
  g.fillStyle(0x486263).fillRoundedRect(x + w / 2 - 27, y + h - 70, 54, 70, 5)
    .fillStyle(0xe8f0e8).fillCircle(x + w / 2 + 17, y + h - 35, 3)
    .fillStyle(0x4b5a58).fillRoundedRect(x + w - 55, y - 25, 32, 18, 4);
}

function drawLifeguard(g: Graphics, { x, y, width: w, height: h, color = 0xf0d56f }: ExpandedWorldObject): void {
  g.fillStyle(0x293531, 0.24).fillEllipse(x + w / 2 + 8, y + h + 18, w * 0.95, 30)
    .fillStyle(0x6d5539).fillRect(x + 18, y + h - 15, 12, 38).fillRect(x + w - 30, y + h - 15, 12, 38)
    .fillStyle(colorShade(color, 0.78)).fillRoundedRect(x + 7, y + 8, w, h - 18, 9)
    .fillStyle(color).fillRoundedRect(x, y, w, h - 18, 9)
    .fillStyle(0xef7a56).fillRoundedRect(x - 7, y - 12, w + 14, 24, 7);
  g.fillGradientStyle(0xb8e5ef, 0x6ca9bd, 0x4c7b8e, 0x72aabb, 1)
    .fillRoundedRect(x + 22, y + 25, w - 44, 44, 5);
  g.lineStyle(4, 0xf5ead2, 0.9).lineBetween(x + 12, y + h - 30, x + w - 12, y + h - 30)
    .lineBetween(x + 12, y + h - 30, x + 12, y + h + 3)
    .lineBetween(x + w - 12, y + h - 30, x + w - 12, y + h + 3);
  g.lineStyle(4, 0x71583d).lineBetween(x + w - 18, y + h + 8, x + w + 14, y + h + 35)
    .lineBetween(x + w - 8, y + h + 8, x + w + 24, y + h + 35);
}

function drawWorkshop(g: Graphics, { x, y, width: w, height: h, color = 0x6d795d }: ExpandedWorldObject): void {
  g.fillStyle(0x102018, 0.27).fillEllipse(x + w / 2 + 10, y + h + 10, w, 38)
    .fillStyle(colorShade(color, 0.76)).fillRoundedRect(x + 8, y + 10, w, h, 10)
    .fillStyle(color).fillRoundedRect(x, y, w, h, 10)
    .fillStyle(0x4a4b42).fillTriangle(x - 8, y + 18, x + w + 8, y - 16, x + w + 8, y + 20);
  g.fillStyle(0x4b3a2c).fillRoundedRect(x + 24, y + 55, w * 0.58, h - 55, 5)
    .lineStyle(3, 0x987454, 0.6);
  for (let line = x + 38; line < x + w * 0.58; line += 26) g.lineBetween(line, y + 58, line, y + h - 4);
  g.fillGradientStyle(0xa8d6df, 0x6aa4b3, 0x4c7c89, 0x73a9b6, 1)
    .fillRoundedRect(x + w - 74, y + 48, 48, 38, 4);
  g.fillStyle(0xb77a45).fillRoundedRect(x + w - 86, y + h - 48, 62, 18, 3)
    .fillRoundedRect(x + w - 76, y + h - 28, 52, 18, 3);
}

function drawWindowsAndDoor(g: Graphics, x: number, y: number, w: number, h: number): void {
  g.fillGradientStyle(0x9cdae2, 0x5f9eb6, 0x3e718f, 0x629fb0, 1)
    .fillRoundedRect(x + 20, y + 45, 48, 42, 5)
    .fillRoundedRect(x + w - 68, y + 45, 48, 42, 5)
    .fillStyle(0x52382d).fillRoundedRect(x + w / 2 - 25, y + h - 66, 50, 66, 7)
    .fillStyle(0xf4c75d).fillCircle(x + w / 2 + 15, y + h - 33, 3);
}

function drawSmallStructure(g: Graphics, object: ExpandedWorldObject): void {
  const { x, y, width: w, height: h, color = 0x6f7f66 } = object;
  g.fillStyle(0x102018, 0.24).fillEllipse(x + w / 2 + 8, y + h + 8, w, 30);
  if (object.id === 'wood-shed') {
    g.fillStyle(0x5d432e).fillRoundedRect(x, y + 16, w, h - 16, 8)
      .fillStyle(0x3c2a20).fillRect(x + 16, y + 35, w - 32, h - 48)
      .fillStyle(0x765036).fillTriangle(x - 8, y + 20, x + w / 2, y - 22, x + w + 8, y + 20);
    for (let row = 0; row < 3; row += 1) {
      for (let column = 0; column < 6; column += 1) {
        g.fillStyle(row % 2 ? 0x9b714a : 0x805a3b).fillCircle(x + 30 + column * 21, y + 58 + row * 18, 9)
          .fillStyle(0x3b2a21).fillCircle(x + 30 + column * 21, y + 58 + row * 18, 3);
      }
    }
    return;
  }
  if (object.id === 'cove-shelter') {
    g.fillStyle(0x6b4d37).fillRect(x + 14, y + 22, 10, h - 14).fillRect(x + w - 24, y + 22, 10, h - 14)
      .fillStyle(color).fillTriangle(x - 10, y + 28, x + w / 2, y - 18, x + w + 10, y + 28)
      .fillStyle(0x29302c, 0.62).fillRoundedRect(x + 26, y + 48, w - 52, h - 52, 8);
    return;
  }
  g.fillStyle(colorShade(color, 0.75)).fillRoundedRect(x + 7, y + 8, w, h, 10)
    .fillStyle(color).fillRoundedRect(x, y, w, h, 10)
    .fillStyle(0x304b43).fillRoundedRect(x + 18, y + 35, w - 36, h - 49, 5);
  const awningColors = object.id === 'beach-kiosk' ? [0xf4efe0, 0xef765e] : [0xf2e2b6, 0x4f8d79];
  for (let stripe = 0; stripe < 8; stripe += 1) {
    g.fillStyle(awningColors[stripe % 2]).fillRect(x + 8 + stripe * ((w - 16) / 8), y + 10, (w - 16) / 8 + 1, 23);
  }
  g.fillStyle(0xd8b879).fillRoundedRect(x + 20, y + h - 23, w - 40, 13, 3);
}

function drawTent(g: Graphics, { x, y, width: w, height: h, color = 0x6c8fc9 }: ExpandedWorldObject): void {
  g.fillStyle(0x112419, 0.24).fillEllipse(x + w / 2 + 7, y + h + 9, w * 1.04, 31)
    .fillStyle(colorShade(color, 0.62)).fillTriangle(x + 8, y + h + 2, x + w / 2 + 5, y + 6, x + w + 6, y + h + 2)
    .fillStyle(color).fillTriangle(x, y + h, x + w / 2, y, x + w, y + h)
    .fillStyle(colorShade(color, 1.14), 0.48).fillTriangle(x + 8, y + h - 2, x + w / 2, y + 8, x + w / 2, y + h - 2)
    .lineStyle(3, 0xf7e8bd, 0.58).lineBetween(x + w / 2, y + 7, x + w / 2, y + h)
    .lineStyle(2, 0xffefc8, 0.34).lineBetween(x - 10, y + h + 7, x + w / 2, y).lineBetween(x + w + 10, y + h + 7, x + w / 2, y);
  g.fillStyle(0x172525, 0.55).fillTriangle(x + w * 0.32, y + h, x + w / 2, y + h * 0.44, x + w * 0.68, y + h);
}

function drawPartyTent(g: Graphics, { x, y, width: w, height: h, color = 0xd89c43 }: ExpandedWorldObject): void {
  g.fillStyle(0x102018, 0.27).fillEllipse(x + w / 2 + 10, y + h + 12, w * 1.02, 38)
    .fillStyle(0x42403a, 0.72).fillRoundedRect(x + 14, y + 58, w - 28, h - 48, 8)
    .fillStyle(colorShade(color, 0.72)).fillTriangle(x - 8, y + 62, x + w / 2, y - 18, x + w + 8, y + 62)
    .fillStyle(color).fillTriangle(x + 4, y + 58, x + w / 2, y - 8, x + w - 4, y + 58);
  g.lineStyle(7, 0xe9ddc2, 0.95);
  for (const postX of [x + 14, x + w / 2, x + w - 14]) g.lineBetween(postX, y + 55, postX, y + h + 8);
  g.fillStyle(0xf5ead2, 0.96).fillRoundedRect(x + 10, y + 53, w - 20, 18, 4);
  for (let lamp = 0; lamp < 11; lamp += 1) {
    g.fillStyle([0xf4c75d, 0xef685c, 0x66dac6][lamp % 3]).fillCircle(x + 25 + lamp * ((w - 50) / 10), y + 72, 4);
  }
  g.fillStyle(0x765033).fillRoundedRect(x + 55, y + h - 42, w - 110, 18, 4)
    .fillStyle(0xd8d0ba).fillCircle(x + 92, y + h - 50, 6).fillCircle(x + w - 92, y + h - 50, 6);
}

function drawCamper(g: Graphics, { x, y, width: w, height: h, color = 0xe6e1cf }: ExpandedWorldObject): void {
  g.fillStyle(0x102018, 0.25).fillEllipse(x + w / 2 + 10, y + h + 9, w * 1.03, 36)
    .fillStyle(colorShade(color, 0.75)).fillRoundedRect(x + 8, y + 8, w, h, 17)
    .fillStyle(color).fillRoundedRect(x, y, w, h, 17)
    .fillStyle(0xef685c, 0.78).fillRect(x + 9, y + h * 0.64, w - 18, 11)
    .fillGradientStyle(0xa8d6df, 0x5f94aa, 0x3e6e86, 0x6096a8, 1)
    .fillRoundedRect(x + 24, y + 20, 62, 38, 6)
    .fillRoundedRect(x + w - 83, y + 20, 58, 38, 6)
    .fillStyle(0xb8a987).fillRoundedRect(x + w / 2 - 24, y + 20, 48, h - 28, 5)
    .fillStyle(0x272d2c).fillCircle(x + 48, y + h, 17).fillCircle(x + w - 48, y + h, 17)
    .fillStyle(0xc4c8bd).fillCircle(x + 48, y + h, 7).fillCircle(x + w - 48, y + h, 7);
}

function drawTree(scene: Phaser.Scene, trunk: Graphics, { x, y, width: w, height: h }: ExpandedWorldObject, index: number, profile: VisualProfile): void {
  const baseDepth = worldDepth(y + h);
  trunk.fillStyle(0x17351f, 0.22).fillEllipse(x + w * 0.56, y + h * 0.94, w * 1.06, h * 0.32)
    .fillStyle(0x3d2a1b).fillRoundedRect(x + w * 0.4, y + h * 0.47, w * 0.2, h * 0.5, 5)
    .fillStyle(0x68472b, 0.9).fillRoundedRect(x + w * 0.45, y + h * 0.5, w * 0.06, h * 0.45, 3)
    .lineStyle(4, 0x49301e, 0.86).lineBetween(x + w * 0.49, y + h * 0.62, x + w * 0.28, y + h * 0.4)
    .lineBetween(x + w * 0.52, y + h * 0.59, x + w * 0.75, y + h * 0.35);

  const centerX = x + w * 0.5;
  const centerY = y + h * 0.27;
  const canopy = scene.add.graphics().setPosition(centerX, centerY).setDepth(baseDepth + 0.08);
  const clusters = [
    [0, 0.07, 0.48, 0x245233], [-0.22, 0.12, 0.3, 0x376b3e], [0.22, 0.12, 0.31, 0x2f6237],
    [-0.11, -0.09, 0.29, 0x56834a], [0.15, -0.08, 0.28, 0x477844], [0, -0.2, 0.2, 0x6e9a54],
  ] as Array<[number, number, number, number]>;
  for (const [cx, cy, size, tone] of clusters) canopy.fillStyle(tone).fillCircle(w * cx, h * cy, w * size);
  canopy.fillStyle(0xc4d88a, 0.35).fillCircle(-w * 0.16, -h * 0.13, w * 0.09);

  if (profile.foliageMotion && index % 3 === 0) {
    const amplitude = 0.8 + (index % 2) * 0.35;
    scene.tweens.add({
      targets: canopy,
      x: { from: centerX - amplitude, to: centerX + amplitude },
      angle: { from: -0.18, to: 0.18 },
      duration: 3800 + index * 45,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.InOut',
    });
  }
}

function drawStage(g: Graphics, { x, y, width: w, height: h, color = 0x6f446f }: ExpandedWorldObject): void {
  g.fillStyle(0x3e2d3d).fillRoundedRect(x, y + 35, w, h - 35, 12)
    .fillStyle(color).fillRoundedRect(x + 16, y + 48, w - 32, h - 70, 9)
    .fillStyle(0x1c1c27).fillRect(x + 30, y + 58, w - 60, h - 90)
    .lineStyle(7, 0x313a3e).lineBetween(x + 10, y + 40, x + 45, y)
    .lineBetween(x + w - 10, y + 40, x + w - 45, y).lineBetween(x + 45, y, x + w - 45, y);
  for (let i = 0; i < 7; i += 1) g.fillStyle([0xef685c, 0xf4c75d, 0x66dac6, 0x6e9fd2, 0xb99ce8][i % 5]).fillCircle(x + 70 + i * ((w - 140) / 6), y + 18, 9);
}

function drawDock(g: Graphics, { x, y, width: w, height: h }: ExpandedWorldObject): void {
  g.fillStyle(0x4b3526, 0.22).fillRoundedRect(x + 8, y + 8, w, h, 5)
    .fillStyle(0x68462d).fillRoundedRect(x, y, w, h, 5).lineStyle(3, 0xd4a86b, 0.65);
  for (let plank = x + 8; plank < x + w; plank += 18) g.lineBetween(plank, y + 4, plank, y + h - 4);
  g.lineStyle(5, 0x4b3526).lineBetween(x + 8, y + h, x + 8, y + h + 22).lineBetween(x + w - 8, y + h, x + w - 8, y + h + 22);
}

function drawRock(g: Graphics, { x, y, width: w, height: h }: ExpandedWorldObject): void {
  g.fillStyle(0x696d68).fillTriangle(x, y + h, x + w * 0.32, y + 5, x + w, y + h)
    .fillStyle(0x8b918a, 0.85).fillTriangle(x + 14, y + h - 7, x + w * 0.35, y + 12, x + w * 0.63, y + h - 5);
}

function drawFlowers(g: Graphics, { x, y, width: w, height: h }: ExpandedWorldObject): void {
  g.fillStyle(0x3e2c22).fillRoundedRect(x, y + h * 0.35, w, h * 0.65, 12)
    .fillStyle(0x274b31).fillRoundedRect(x + 6, y + h * 0.28, w - 12, h * 0.48, 10);
  for (let i = 0; i < w / 18; i += 1) g.fillStyle([0xef685c, 0xf4c75d, 0x8fb7e8, 0xf3d8e8][i % 4]).fillCircle(x + 12 + i * 17, y + h * 0.3 + (i % 3) * 8, 4);
}

function drawLantern(scene: Phaser.Scene, g: Graphics, { x, y, width: w, height: h }: ExpandedWorldObject): Phaser.GameObjects.Arc {
  g.fillStyle(0x4d3828).fillRect(x + w / 2 - 4, y + 20, 8, h - 20)
    .fillStyle(0xffdc7a).fillCircle(x + w / 2, y + 15, 8)
    .lineStyle(2, 0xfff3bd, 0.85).strokeCircle(x + w / 2, y + 15, 12);
  return scene.add.circle(x + w / 2, y + 15, 32, 0xffdc7a, 0.08).setDepth(g.depth - 0.1);
}

function drawFence(g: Graphics, { x, y, width: w, height: h }: ExpandedWorldObject): void {
  g.fillStyle(0x60482f).fillRect(x, y + 3, w, 7).fillRect(x, y + h - 8, w, 7).fillStyle(0xd5bf8f);
  for (let post = x; post <= x + w; post += 48) g.fillRoundedRect(post, y - 13, 10, h + 26, 3);
}

function drawFurniture(g: Graphics, { x, y, width: w, height: h }: ExpandedWorldObject, table: boolean): void {
  g.fillStyle(0x17301f, 0.22).fillEllipse(x + w / 2 + 4, y + h + 8, w, 18)
    .fillStyle(0x48321f).fillRect(x + 12, y + h - 2, 8, 24).fillRect(x + w - 20, y + h - 2, 8, 24)
    .fillStyle(0x6f472b).fillRoundedRect(x, y, w, h, 8).lineStyle(4, 0xc48a4f, 0.75).lineBetween(x + 10, y + h / 2, x + w - 10, y + h / 2);
  if (table) g.fillStyle(0xd64f52).fillRoundedRect(x + w * 0.2, y - 10, 12, 20, 3).fillStyle(0x66dac6).fillCircle(x + w * 0.72, y + 3, 8);
}

function drawSign(g: Graphics, { x, y, width: w, height: h }: ExpandedWorldObject): void {
  g.fillStyle(0x6b5136).fillRoundedRect(x + w / 2 - 6, y + h * 0.5, 12, h * 0.58, 3)
    .fillStyle(0xe0c06e).fillRoundedRect(x, y, w, h * 0.65, 7)
    .lineStyle(2, 0x5f472f, 0.62).strokeRoundedRect(x, y, w, h * 0.65, 7);
}

function obstacle(scene: Phaser.Scene, x: number, y: number, width: number, height: number): Phaser.GameObjects.Zone {
  const zone = scene.add.zone(x + width / 2, y + height / 2, width, height);
  scene.physics.add.existing(zone, true);
  return zone;
}

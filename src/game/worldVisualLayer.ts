import Phaser from 'phaser';
import { colorShade, seededFraction, type VisualProfile } from './visuals';
import { EXPANDED_WORLD_HEIGHT, EXPANDED_WORLD_OBJECTS, EXPANDED_WORLD_WIDTH, WORLD_REGIONS, type ExpandedWorldObject } from './worldV2';

export interface WorldVisualBuild {
  obstacles: Phaser.GameObjects.Zone[];
  lanternGlows: Phaser.GameObjects.Arc[];
  fireflies: Phaser.GameObjects.Arc[];
}

type Graphics = Phaser.GameObjects.Graphics;

export function buildExpandedWorldVisuals(scene: Phaser.Scene, profile: VisualProfile): WorldVisualBuild {
  terrain(scene, profile);
  roads(scene);
  const obstacles = lake(scene, profile);
  const { lanternGlows, fireflies } = atmosphere(scene, profile);
  EXPANDED_WORLD_OBJECTS.forEach((object, index) => {
    const glow = objectArt(scene, object, index, profile);
    if (glow) lanternGlows.push(glow);
    if (object.solid === false || ['sign', 'lantern', 'flowerbed', 'dock'].includes(object.kind)) return;
    const tree = object.kind === 'tree';
    const inset = tree ? 0.24 : 0.08;
    obstacles.push(obstacle(
      scene,
      object.x + object.width * inset,
      object.y + object.height * (tree ? 0.55 : inset),
      object.width * (1 - inset * 2),
      object.height * (tree ? 0.4 : 1 - inset * 2),
    ));
  });
  return { obstacles, lanternGlows, fireflies };
}

function terrain(scene: Phaser.Scene, profile: VisualProfile): void {
  const g = scene.add.graphics().setDepth(0);
  g.fillGradientStyle(0x6f965f, 0x789e63, 0x4d7450, 0x5f8355, 1).fillRect(0, 0, EXPANDED_WORLD_WIDTH, EXPANDED_WORLD_HEIGHT);
  WORLD_REGIONS.forEach((region) => {
    const { x, y, width, height } = region.bounds;
    g.fillStyle(region.ground, region.id === 'arrival' ? 0.72 : 0.54).fillRect(x, y, width, height);
    g.lineStyle(3, colorShade(region.accent, 0.72), 0.18).strokeRect(x + 2, y + 2, width - 4, height - 4);
    scene.add.text(x + 24, y + 22, region.title.toUpperCase(), {
      fontFamily: 'Arial Black, system-ui', fontSize: '18px', fontStyle: 'bold', color: '#fff8dc', stroke: '#173027', strokeThickness: 5,
    }).setDepth(3);
  });
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

function roads(scene: Phaser.Scene): void {
  const g = scene.add.graphics().setDepth(1);
  g.fillGradientStyle(0x8c9290, 0x7e8583, 0x5d6262, 0x676d6b, 1).fillRoundedRect(535, 1460, 820, 280, 30);
  g.lineStyle(4, 0xd8d4bd, 0.78);
  for (let x = 585; x < 1320; x += 112) g.lineBetween(x, 1510, x, 1685);
  const paths: Array<[Array<[number, number]>, number, number]> = [
    [[[830, 1460], [830, 1260], [760, 1130], [720, 940], [730, 760]], 118, 0xbda97b],
    [[[720, 940], [430, 930], [260, 850]], 88, 0xc9b78b],
    [[[760, 930], [1110, 900], [1370, 760], [1520, 650], [1740, 600]], 92, 0xcdb98a],
    [[[720, 760], [690, 560], [650, 360], [670, 170]], 86, 0xc4ae7d],
    [[[1740, 600], [1970, 590], [2100, 620]], 82, 0xd8c487],
    [[[1680, 850], [1680, 1110], [1660, 1410], [1720, 1650]], 78, 0xa9946c],
    [[[1720, 1650], [1980, 1570], [2200, 1510]], 74, 0x9c8a69],
  ];
  paths.forEach(([points, width, color]) => path(g, points, width, color));
}

function path(g: Graphics, points: Array<[number, number]>, width: number, color: number): void {
  for (const [offset, tone, alpha] of [[9, colorShade(color, 0.72), 0.22], [0, color, 1]] as Array<[number, number, number]>) {
    g.lineStyle(width, tone, alpha).beginPath().moveTo(points[0][0] + offset, points[0][1] + offset);
    points.slice(1).forEach(([x, y]) => g.lineTo(x + offset, y + offset));
    g.strokePath();
  }
  g.lineStyle(3, 0xf0dfaa, 0.28).beginPath().moveTo(points[0][0], points[0][1]);
  points.slice(1).forEach(([x, y]) => g.lineTo(x, y));
  g.strokePath();
}

function lake(scene: Phaser.Scene, profile: VisualProfile): Phaser.GameObjects.Zone[] {
  const g = scene.add.graphics().setDepth(2);
  g.fillStyle(0xe4ce8d).fillRoundedRect(1955, 30, 305, 1040, 50).fillRoundedRect(1955, 1120, 285, 650, 48);
  g.fillGradientStyle(0x62b3cb, 0x4b9fbd, 0x2f7096, 0x357e9d, 1).fillRoundedRect(2250, 20, 350, 1080, 72).fillRoundedRect(2220, 1100, 380, 700, 78);
  g.lineStyle(3, 0xb7ecf2, 0.36);
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
    const shimmer = scene.add.graphics().setDepth(4);
    const x = 2300 + (i % 3) * 95;
    const y = 120 + Math.floor(i / 3) * 220;
    shimmer.lineStyle(3, i % 2 ? 0x8ddae2 : 0xd9fbf3, 0.34).beginPath().moveTo(x - 34, y).lineTo(x, y - 5).lineTo(x + 45, y + 2).strokePath();
    scene.tweens.add({ targets: shimmer, x: { from: -10, to: 15 }, alpha: { from: 0.28, to: 0.82 }, duration: 1700 + i * 145, delay: i * 90, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
  }
  return [obstacle(scene, 2285, 0, 315, 470), obstacle(scene, 2285, 590, 315, 760), obstacle(scene, 2285, 1470, 315, 330)];
}

function atmosphere(scene: Phaser.Scene, profile: VisualProfile): { lanternGlows: Phaser.GameObjects.Arc[]; fireflies: Phaser.GameObjects.Arc[] } {
  const g = scene.add.graphics().setDepth(5);
  g.lineStyle(3, 0x44311f, 0.72).lineBetween(1460, 270, 1905, 285);
  const flags = [0xef685c, 0xf4c75d, 0x66dac6, 0x6e9fd2, 0xb99ce8];
  for (let i = 0; i < 15; i += 1) g.fillStyle(flags[i % flags.length], 0.96).fillTriangle(1470 + i * 29, 270 + i, 1492 + i * 29, 272 + i, 1481 + i * 29, 295 + i);
  campfire(scene, 760, 1065);
  const fireflies: Phaser.GameObjects.Arc[] = [];
  for (let i = 0; i < profile.ambientSprites; i += 1) {
    const region = i % 2 ? WORLD_REGIONS[5] : WORLD_REGIONS[2];
    const fly = scene.add.circle(region.bounds.x + 50 + seededFraction('fly-x', i) * (region.bounds.width - 100), region.bounds.y + 80 + seededFraction('fly-y', i) * (region.bounds.height - 140), 1.5 + (i % 3) * 0.7, i % 4 ? 0xffe58c : 0xb8f0ad, 0).setDepth(7);
    fireflies.push(fly);
    scene.tweens.add({ targets: fly, x: `+=${Math.round((seededFraction('fly-dx', i) - 0.5) * 70)}`, y: `+=${Math.round((seededFraction('fly-dy', i) - 0.5) * 55)}`, duration: 2100 + i * 105, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
  }
  if (profile.foliageMotion) for (let i = 0; i < 7; i += 1) {
    const leaf = scene.add.ellipse(250 + seededFraction('leaf-x', i) * 1550, 140 + seededFraction('leaf-y', i) * 1450, 7, 3, i % 2 ? 0x8db65f : 0xd4b45c, 0.68).setDepth(8).setAngle(i * 29);
    scene.tweens.add({ targets: leaf, x: '+=180', y: '+=65', angle: '+=260', alpha: 0, duration: 4200 + i * 430, delay: i * 600, repeat: -1 });
  }
  return { lanternGlows: [], fireflies };
}

function campfire(scene: Phaser.Scene, x: number, y: number): void {
  scene.add.ellipse(x, y + 18, 132, 48, 0x132119, 0.3).setDepth(7);
  const ring = scene.add.graphics().setDepth(8);
  ring.lineStyle(9, 0x75614a).strokeCircle(x, y, 42).lineStyle(4, 0x3f2b22, 0.9).lineBetween(x - 28, y + 17, x + 28, y - 12).lineBetween(x - 26, y - 13, x + 29, y + 18);
  const glow = scene.add.circle(x, y - 2, 55, 0xffa142, 0.14).setDepth(8);
  const flame = scene.add.graphics().setDepth(9);
  flame.fillStyle(0xff5f3b, 0.96).fillTriangle(x - 22, y + 10, x, y - 42, x + 22, y + 10).fillStyle(0xffd15d, 0.98).fillTriangle(x - 11, y + 8, x + 2, y - 27, x + 13, y + 8);
  scene.tweens.add({ targets: [glow, flame], alpha: { from: 0.7, to: 1 }, scale: { from: 0.95, to: 1.05 }, duration: 520, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
}

function objectArt(scene: Phaser.Scene, object: ExpandedWorldObject, index: number, profile: VisualProfile): Phaser.GameObjects.Arc | undefined {
  const g = scene.add.graphics().setDepth(10 + (object.y + object.height) / 100);
  const { x, y, width: w, height: h } = object;
  const color = object.color ?? 0x7d5c3f;
  let glow: Phaser.GameObjects.Arc | undefined;
  if (object.kind === 'building' || object.kind === 'kiosk') building(g, x, y, w, h, color);
  else if (object.kind === 'tent' || object.kind === 'party-tent') tent(g, x, y, w, h, color, object.kind === 'party-tent');
  else if (object.kind === 'camper') camper(g, x, y, w, h, color);
  else if (object.kind === 'tree') tree(scene, g, x, y, w, h, index, profile);
  else if (object.kind === 'stage') stage(g, x, y, w, h, color);
  else if (object.kind === 'dock') dock(g, x, y, w, h);
  else if (object.kind === 'rock') rock(g, x, y, w, h);
  else if (object.kind === 'flowerbed') flowers(g, x, y, w, h);
  else if (object.kind === 'lantern') {
    g.fillStyle(0x4d3828).fillRect(x + w / 2 - 4, y + 20, 8, h - 20).fillStyle(0xffdc7a).fillCircle(x + w / 2, y + 15, 8).lineStyle(2, 0xfff3bd, 0.85).strokeCircle(x + w / 2, y + 15, 12);
    glow = scene.add.circle(x + w / 2, y + 15, 34, 0xffdc7a, 0.1).setDepth(g.depth - 0.1);
  } else if (object.kind === 'fence') fence(g, x, y, w, h);
  else if (object.kind === 'table' || object.kind === 'bench') furniture(g, x, y, w, h, object.kind === 'table');
  else sign(g, x, y, w, h);
  if (object.label) scene.add.text(x + w / 2, y + h / 2, object.label, {
    fontFamily: 'Arial Black, system-ui', fontSize: object.kind === 'sign' ? '10px' : '12px', fontStyle: 'bold', color: ['building', 'stage', 'kiosk'].includes(object.kind) ? '#fff4d2' : '#213027', stroke: ['building', 'stage', 'kiosk'].includes(object.kind) ? '#13241f' : '#f3d98d', strokeThickness: 3, align: 'center',
  }).setOrigin(0.5).setDepth(g.depth + 0.2);
  return glow;
}

function building(g: Graphics, x: number, y: number, w: number, h: number, c: number): void {
  g.fillStyle(0x102018, 0.28).fillEllipse(x + w / 2 + 12, y + h + 12, w * 1.04, 40).fillStyle(colorShade(c, 0.7)).fillRoundedRect(x + 10, y + 12, w, h, 15).fillStyle(c).fillRoundedRect(x, y, w, h, 16);
  g.fillStyle(0x573526).fillTriangle(x - 12, y + 20, x + w / 2, y - 50, x + w + 12, y + 20).fillStyle(0x8d5637).fillTriangle(x + 8, y + 17, x + w / 2, y - 39, x + w - 8, y + 17);
  g.fillGradientStyle(0x9cdae2, 0x5f9eb6, 0x3e718f, 0x629fb0, 1).fillRoundedRect(x + 20, y + 45, 48, 42, 5).fillRoundedRect(x + w - 68, y + 45, 48, 42, 5).fillStyle(0x52382d).fillRoundedRect(x + w / 2 - 25, y + h - 66, 50, 66, 7).fillStyle(0xf4c75d).fillCircle(x + w / 2 + 15, y + h - 33, 3);
}

function tent(g: Graphics, x: number, y: number, w: number, h: number, c: number, party: boolean): void {
  g.fillStyle(0x112419, 0.25).fillEllipse(x + w / 2 + 8, y + h + 10, w * 1.07, 34).fillStyle(colorShade(c, 0.62)).fillTriangle(x + 8, y + h + 3, x + w / 2 + 5, y + 6, x + w + 7, y + h + 3).fillStyle(c).fillTriangle(x, y + h, x + w / 2, y, x + w, y + h).lineStyle(party ? 6 : 4, 0xf7e8bd, 0.58).lineBetween(x + w / 2, y + 7, x + w / 2, y + h);
  if (party) {
    g.fillStyle(0xf7e7ba).fillRoundedRect(x + 10, y + h + 4, w - 20, 12, 3);
    for (let i = 0; i < 10; i += 1) g.fillStyle([0xf4c75d, 0xef685c, 0x66dac6][i % 3]).fillCircle(x + 25 + i * ((w - 50) / 9), y + h + 16, 4);
  }
}

function camper(g: Graphics, x: number, y: number, w: number, h: number, c: number): void {
  g.fillStyle(0x102018, 0.25).fillEllipse(x + w / 2 + 10, y + h + 9, w * 1.04, 38).fillStyle(c).fillRoundedRect(x, y, w, h, 18).fillStyle(0xef685c, 0.8).fillRect(x + 9, y + 67, w - 18, 12).fillGradientStyle(0xa8d6df, 0x5f94aa, 0x3e6e86, 0x6096a8, 1).fillRoundedRect(x + 24, y + 20, 62, 38, 6).fillRoundedRect(x + w - 83, y + 20, 58, 38, 6).fillStyle(0xb8a987).fillRoundedRect(x + w / 2 - 24, y + 20, 48, 74, 5).fillStyle(0x272d2c).fillCircle(x + 48, y + h, 17).fillCircle(x + w - 48, y + h, 17);
}

function tree(scene: Phaser.Scene, g: Graphics, x: number, y: number, w: number, h: number, i: number, profile: VisualProfile): void {
  g.fillStyle(0x17351f, 0.22).fillEllipse(x + w * 0.56, y + h * 0.94, w * 1.08, h * 0.34).fillStyle(0x3d2a1b).fillRoundedRect(x + w * 0.39, y + h * 0.48, w * 0.22, h * 0.5, 5);
  ([[0.5, 0.34, 0.48, 0x245233], [0.28, 0.39, 0.3, 0x376b3e], [0.72, 0.39, 0.31, 0x2f6237], [0.39, 0.18, 0.29, 0x56834a], [0.65, 0.2, 0.28, 0x477844], [0.5, 0.08, 0.2, 0x6e9a54]] as Array<[number, number, number, number]>).forEach(([cx, cy, size, tone]) => g.fillStyle(tone).fillCircle(x + w * cx, y + h * cy, w * size));
  if (profile.foliageMotion && i % 3 === 0) scene.tweens.add({ targets: g, angle: { from: -0.7, to: 0.7 }, duration: 2300 + i * 30, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
}

function stage(g: Graphics, x: number, y: number, w: number, h: number, c: number): void {
  g.fillStyle(0x3e2d3d).fillRoundedRect(x, y + 35, w, h - 35, 12).fillStyle(c).fillRoundedRect(x + 16, y + 48, w - 32, h - 70, 9).fillStyle(0x1c1c27).fillRect(x + 30, y + 58, w - 60, h - 90).lineStyle(7, 0x313a3e).lineBetween(x + 10, y + 40, x + 45, y).lineBetween(x + w - 10, y + 40, x + w - 45, y).lineBetween(x + 45, y, x + w - 45, y);
  for (let i = 0; i < 7; i += 1) g.fillStyle([0xef685c, 0xf4c75d, 0x66dac6, 0x6e9fd2, 0xb99ce8][i % 5]).fillCircle(x + 70 + i * ((w - 140) / 6), y + 18, 9);
}

function dock(g: Graphics, x: number, y: number, w: number, h: number): void {
  g.fillStyle(0x68462d).fillRoundedRect(x, y, w, h, 5).lineStyle(3, 0xd4a86b, 0.65);
  for (let plank = x + 8; plank < x + w; plank += 18) g.lineBetween(plank, y + 4, plank, y + h - 4);
}
function rock(g: Graphics, x: number, y: number, w: number, h: number): void { g.fillStyle(0x696d68).fillTriangle(x, y + h, x + w * 0.32, y + 5, x + w, y + h).fillStyle(0x8b918a, 0.85).fillTriangle(x + 14, y + h - 7, x + w * 0.35, y + 12, x + w * 0.63, y + h - 5); }
function flowers(g: Graphics, x: number, y: number, w: number, h: number): void { g.fillStyle(0x3e2c22).fillRoundedRect(x, y + h * 0.35, w, h * 0.65, 12).fillStyle(0x274b31).fillRoundedRect(x + 6, y + h * 0.28, w - 12, h * 0.48, 10); for (let i = 0; i < w / 18; i += 1) g.fillStyle([0xef685c, 0xf4c75d, 0x8fb7e8, 0xf3d8e8][i % 4]).fillCircle(x + 12 + i * 17, y + h * 0.3 + (i % 3) * 8, 4); }
function fence(g: Graphics, x: number, y: number, w: number, h: number): void { g.fillStyle(0x60482f).fillRect(x, y + 3, w, 7).fillRect(x, y + h - 8, w, 7).fillStyle(0xd5bf8f); for (let post = x; post <= x + w; post += 48) g.fillRoundedRect(post, y - 13, 10, h + 26, 3); }
function furniture(g: Graphics, x: number, y: number, w: number, h: number, table: boolean): void { g.fillStyle(0x48321f).fillRect(x + 12, y + h - 2, 8, 24).fillRect(x + w - 20, y + h - 2, 8, 24).fillStyle(0x6f472b).fillRoundedRect(x, y, w, h, 8).lineStyle(4, 0xc48a4f, 0.75).lineBetween(x + 10, y + h / 2, x + w - 10, y + h / 2); if (table) g.fillStyle(0xd64f52).fillRoundedRect(x + w * 0.2, y - 10, 12, 20, 3).fillStyle(0x66dac6).fillCircle(x + w * 0.72, y + 3, 8); }
function sign(g: Graphics, x: number, y: number, w: number, h: number): void { g.fillStyle(0x6b5136).fillRoundedRect(x + w / 2 - 6, y + h * 0.5, 12, h * 0.58, 3).fillStyle(0xe0c06e).fillRoundedRect(x, y, w, h * 0.65, 7).lineStyle(2, 0x5f472f, 0.62).strokeRoundedRect(x, y, w, h * 0.65, 7); }
function obstacle(scene: Phaser.Scene, x: number, y: number, w: number, h: number): Phaser.GameObjects.Zone { const zone = scene.add.zone(x + w / 2, y + h / 2, w, h); scene.physics.add.existing(zone, true); return zone; }

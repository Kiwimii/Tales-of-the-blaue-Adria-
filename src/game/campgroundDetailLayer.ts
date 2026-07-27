import Phaser from 'phaser';
import { OBJECT_PLACEMENTS, type Placement } from './aerialCampgroundPlan';
import { seededFraction, type VisualProfile } from './visuals';
import { WORLD_ACTIVITY_CATALOG } from './worldActivityCatalog';
import { worldDepth } from './worldRealism';

const TENT_IDS = ['home-tent', 'tent-andre', 'tent-rene', 'tent-lars', 'tent-danny'] as const;
const CAMPER_IDS = ['central-camper', 'north-camper-1', 'north-camper-2', 'north-camper-3'] as const;

export function drawCanonicalCampgroundDetails(scene: Phaser.Scene, profile: VisualProfile): void {
  drawGroundWear(scene, profile);
  drawObjectGrounding(scene);
  drawArrivalDetails(scene, profile);
  drawTentPitchDetails(scene, profile);
  drawCamperDetails(scene, profile);
  drawFestivalDetails(scene, profile);
  drawBeachDetails(scene, profile);
  drawServiceDetails(scene, profile);
  drawCoveDetails(scene, profile);
  drawActivityCues(scene, profile);
}

function drawGroundWear(scene: Phaser.Scene, profile: VisualProfile): void {
  const g = scene.add.graphics().setDepth(4.64);
  const density = Math.round(260 * profile.detailDensity);
  const zones = [
    { id: 'north', x: 40, y: 40, width: 1320, height: 880, colors: [0x315c3c, 0x749458, 0xb29b67] },
    { id: 'taucher', x: 40, y: 980, width: 1320, height: 300, colors: [0x547645, 0x85734d, 0xb3a06d] },
    { id: 'festival', x: 1420, y: 40, width: 500, height: 910, colors: [0x6e7143, 0x8d7747, 0xb2955b] },
    { id: 'service', x: 1420, y: 1030, width: 500, height: 720, colors: [0x294d35, 0x5c6741, 0x7a5836] },
  ] as const;

  for (const zone of zones) {
    for (let index = 0; index < density; index += 1) {
      const x = zone.x + seededFraction(`${zone.id}-detail-x`, index) * zone.width;
      const y = zone.y + seededFraction(`${zone.id}-detail-y`, index) * zone.height;
      const color = zone.colors[index % zone.colors.length];
      if (index % 4 === 0) {
        g.fillStyle(color, 0.16).fillEllipse(x, y, 7 + index % 5, 3 + index % 3);
      } else {
        g.lineStyle(1.2, color, 0.24).lineBetween(x, y + 5, x + (index % 2 ? 3 : -3), y);
      }
    }
  }

  const worn = [
    [170, 1175, 150, 42], [320, 1175, 120, 34], [465, 1175, 120, 34], [610, 1175, 120, 34], [755, 1175, 120, 34],
    [1080, 1175, 260, 58], [1710, 655, 310, 65], [2110, 915, 210, 60], [1580, 1345, 250, 58],
  ] as const;
  for (const [x, y, width, height] of worn) g.fillStyle(0x7f6845, 0.13).fillEllipse(x, y, width, height);
}

function drawObjectGrounding(scene: Phaser.Scene): void {
  const largeIds = [
    'reception', 'sanitary', 'clubhouse', 'festival-stage', 'party', 'festival-kiosk', 'beach-kiosk', 'lifeguard',
    'workshop', 'wood-shed', 'cove-shelter', ...TENT_IDS, ...CAMPER_IDS,
  ];
  for (const id of largeIds) {
    const placement = OBJECT_PLACEMENTS[id];
    if (!placement?.width || !placement.height) continue;
    const shadow = scene.add.ellipse(
      placement.x + placement.width / 2 + 5,
      placement.y + placement.height - 3,
      placement.width * 0.82,
      Math.max(14, placement.height * 0.2),
      0x0b1712,
      id.includes('tent') ? 0.2 : 0.25,
    );
    shadow.setDepth(worldDepth(placement.y + placement.height) - 0.45);
  }
}

function drawArrivalDetails(scene: Phaser.Scene, profile: VisualProfile): void {
  const g = scene.add.graphics().setDepth(4.68);
  g.lineStyle(7, 0x464b49, 0.2)
    .lineBetween(805, 1740, 805, 1460)
    .lineBetween(895, 1740, 895, 1460);
  for (let y = 1510; y < 1740; y += 42) {
    g.fillStyle(0x2e3332, 0.23).fillEllipse(805, y, 8, 16).fillEllipse(895, y + 15, 7, 14);
  }

  for (const x of [540, 620, 700, 780, 1020, 1100, 1180]) {
    g.fillStyle(0x353a38, 0.72).fillRoundedRect(x - 24, 1600, 48, 7, 3);
  }

  const reception = required('reception');
  const props = scene.add.graphics().setDepth(worldDepth(reception.y + (reception.height ?? 0) + 35));
  props.fillStyle(0x39433f).fillRoundedRect(1268, 1532, 48, 62, 6)
    .fillStyle(0x202826).fillRoundedRect(1274, 1540, 36, 15, 3)
    .fillStyle(0x718377).fillRoundedRect(1265, 1524, 54, 10, 4);
  props.fillStyle(0x8f6b3d).fillRoundedRect(1310, 1415, 42, 42, 8)
    .fillStyle(0x436a43).fillCircle(1331, 1408, 24);

  if (profile.tier === 'cinematic') {
    for (let index = 0; index < 8; index += 1) {
      const lamp = scene.add.circle(1010 + index * 42, 1328, 2.4, 0xffdf8a, 0.45).setDepth(worldDepth(1340));
      scene.tweens.add({ targets: lamp, alpha: { from: 0.28, to: 0.88 }, duration: 900 + index * 80, yoyo: true, repeat: -1 });
    }
  }
}

function drawTentPitchDetails(scene: Phaser.Scene, profile: VisualProfile): void {
  for (const id of TENT_IDS) {
    const tent = required(id);
    const width = tent.width ?? 120;
    const height = tent.height ?? 100;
    const lines = scene.add.graphics().setDepth(worldDepth(tent.y + height) - 0.12);
    const apex = { x: tent.x + width / 2, y: tent.y + 10 };
    for (const pegX of [tent.x - 10, tent.x + width + 10]) {
      lines.lineStyle(2, 0xeee1bb, 0.42).lineBetween(apex.x, apex.y, pegX, tent.y + height + 8)
        .fillStyle(0x544331, 0.9).fillRect(pegX - 2, tent.y + height + 5, 4, 11);
    }
    lines.fillStyle(0x856a47, 0.55).fillRoundedRect(tent.x + width / 2 - 22, tent.y + height + 3, 44, 13, 4);
  }

  const props = scene.add.graphics().setDepth(worldDepth(1190));
  props.fillStyle(0x315f78).fillRoundedRect(840, 1125, 72, 43, 8)
    .fillStyle(0xbad7df).fillRoundedRect(851, 1118, 50, 13, 5)
    .lineStyle(2, 0x18342d, 0.72).strokeRoundedRect(840, 1125, 72, 43, 8);
  props.fillStyle(0x9f392f).fillRoundedRect(920, 1135, 42, 31, 5)
    .fillStyle(0xe7d5a3).fillRect(926, 1141, 30, 7);
  props.fillStyle(0x755033).fillRoundedRect(980, 1130, 58, 34, 5)
    .fillStyle(0xd4bd81).fillRect(987, 1138, 44, 5);

  drawChair(scene, 1020, 1185, 0xef765e);
  drawChair(scene, 1160, 1165, 0x5f9dc1);
  if (profile.tier === 'cinematic') drawStringLights(scene, 90, 1000, 810, 1000, 12);
}

function drawCamperDetails(scene: Phaser.Scene, profile: VisualProfile): void {
  for (const id of CAMPER_IDS) {
    const camper = required(id);
    const width = camper.width ?? 200;
    const height = camper.height ?? 100;
    const g = scene.add.graphics().setDepth(worldDepth(camper.y + height + 20));
    g.lineStyle(3, 0x4d4437, 0.82)
      .lineBetween(camper.x + 14, camper.y + height + 6, camper.x + 14, camper.y + height + 54)
      .lineBetween(camper.x + width - 14, camper.y + height + 6, camper.x + width - 14, camper.y + height + 54)
      .lineStyle(6, 0xd8c48a, 0.72)
      .lineBetween(camper.x + 14, camper.y + height + 8, camper.x + width - 14, camper.y + height + 8);
    g.lineStyle(3, 0x3b5c77, 0.65)
      .lineBetween(camper.x + width - 12, camper.y + height - 4, camper.x + width + 28, camper.y + height + 28);
    g.fillStyle(0x5e6c64).fillRoundedRect(camper.x + width + 23, camper.y + height + 21, 15, 21, 3);
  }

  const utilityCount = profile.tier === 'cinematic' ? 10 : 5;
  const g = scene.add.graphics().setDepth(worldDepth(690));
  for (let index = 0; index < utilityCount; index += 1) {
    const x = 120 + index * 118;
    g.fillStyle(0x6f7c72, 0.78).fillRoundedRect(x, 675, 15, 29, 3)
      .fillStyle(0x2d3935).fillCircle(x + 7, 687, 3);
  }
}

function drawFestivalDetails(scene: Phaser.Scene, profile: VisualProfile): void {
  const ground = scene.add.graphics().setDepth(4.69);
  ground.lineStyle(3, 0x292a2c, 0.32)
    .beginPath().moveTo(1510, 650).lineTo(1615, 610).lineTo(1740, 635).lineTo(1870, 600).strokePath();
  for (let index = 0; index < Math.round(32 * profile.detailDensity); index += 1) {
    const x = 1450 + seededFraction('festival-litter-x', index) * 420;
    const y = 640 + seededFraction('festival-litter-y', index) * 300;
    ground.fillStyle(index % 3 === 0 ? 0xef765e : 0xe5dbc0, 0.55).fillCircle(x, y, 2 + index % 2);
  }

  const props = scene.add.graphics().setDepth(worldDepth(930));
  for (const x of [1490, 1860]) {
    props.fillStyle(0x20242a).fillRoundedRect(x, 575, 48, 80, 5)
      .fillStyle(0x101216).fillCircle(x + 24, 598, 12).fillCircle(x + 24, 630, 16)
      .lineStyle(2, 0x7d8289, 0.55).strokeRoundedRect(x, 575, 48, 80, 5);
  }
  if (profile.tier === 'cinematic') drawStringLights(scene, 1455, 350, 1900, 350, 16);
}

function drawBeachDetails(scene: Phaser.Scene, profile: VisualProfile): void {
  const ground = scene.add.graphics().setDepth(4.66);
  const count = Math.round(90 * profile.detailDensity);
  for (let index = 0; index < count; index += 1) {
    const x = 1970 + seededFraction('beach-pebble-x', index) * 260;
    const y = 55 + seededFraction('beach-pebble-y', index) * 1010;
    ground.fillStyle(index % 2 ? 0xe0ca91 : 0xa98c58, 0.35).fillEllipse(x, y, 5 + index % 4, 3);
  }
  for (let index = 0; index < 20; index += 1) {
    const y = 370 + index * 28;
    const x = 2020 + (index % 4) * 25;
    ground.lineStyle(2, 0x735f43, 0.24).strokeEllipse(x, y, 8, 15).strokeEllipse(x + 13, y + 10, 7, 13);
  }

  const props = scene.add.graphics().setDepth(worldDepth(1020));
  props.fillStyle(0xef765e).fillCircle(2110, 650, 32)
    .fillStyle(0xf4ecd6).fillTriangle(2110, 618, 2110, 650, 2138, 633)
    .fillTriangle(2110, 650, 2082, 633, 2110, 618)
    .lineStyle(5, 0x76563a).lineBetween(2110, 650, 2110, 714);
  props.fillStyle(0x5e99c8, 0.85).fillRoundedRect(2040, 1005, 92, 38, 6)
    .lineStyle(3, 0xf4d47b, 0.7).lineBetween(2050, 1013, 2120, 1036);

  const reedCount = profile.tier === 'cinematic' ? 48 : 22;
  for (let index = 0; index < reedCount; index += 1) {
    const y = 35 + index * (1060 / reedCount);
    const x = 2228 + index % 4 * 5;
    props.lineStyle(2, index % 3 ? 0x426841 : 0x738449, 0.72)
      .lineBetween(x, y + 20, x + (index % 2 ? 4 : -3), y)
      .fillStyle(0x795f35, 0.75).fillEllipse(x + 2, y, 4, 12);
  }

  if (profile.animatedDetails) {
    for (let index = 0; index < 9; index += 1) {
      const sparkle = scene.add.circle(2310 + index % 3 * 85, 130 + Math.floor(index / 3) * 330, 2.1, 0xe8fff9, 0.2).setDepth(8);
      scene.tweens.add({ targets: sparkle, alpha: { from: 0.12, to: 0.7 }, scale: { from: 0.6, to: 1.7 }, duration: 1200 + index * 90, yoyo: true, repeat: -1 });
    }
  }
}

function drawServiceDetails(scene: Phaser.Scene, profile: VisualProfile): void {
  const ground = scene.add.graphics().setDepth(4.65);
  const count = Math.round(100 * profile.detailDensity);
  for (let index = 0; index < count; index += 1) {
    const x = 1425 + seededFraction('service-leaf-x', index) * 490;
    const y = 1040 + seededFraction('service-leaf-y', index) * 700;
    const color = index % 3 === 0 ? 0x95683c : index % 2 ? 0x5f6939 : 0x784a32;
    ground.fillStyle(color, 0.3).fillEllipse(x, y, 7 + index % 3, 3 + index % 2);
  }

  const props = scene.add.graphics().setDepth(worldDepth(1665));
  for (let row = 0; row < 4; row += 1) {
    for (let column = 0; column < 5; column += 1) {
      const x = 1765 + column * 23 + row % 2 * 8;
      const y = 1695 + row * 16;
      props.fillStyle(row % 2 ? 0x8f613f : 0xa7774d).fillCircle(x, y, 10)
        .fillStyle(0x3f2d22).fillCircle(x, y, 3);
    }
  }
  props.fillStyle(0x4c5652).fillRoundedRect(1490, 1420, 58, 24, 4)
    .fillStyle(0xb77a45).fillRect(1497, 1427, 44, 5)
    .lineStyle(4, 0x4a3b2d).lineBetween(1558, 1402, 1558, 1450)
    .lineBetween(1558, 1405, 1582, 1428);
}

function drawCoveDetails(scene: Phaser.Scene, profile: VisualProfile): void {
  const g = scene.add.graphics().setDepth(4.66);
  const count = Math.round(70 * profile.detailDensity);
  for (let index = 0; index < count; index += 1) {
    const x = 1965 + seededFraction('cove-stone-x', index) * 250;
    const y = 1125 + seededFraction('cove-stone-y', index) * 650;
    const tone = index % 3 === 0 ? 0x8a8f87 : index % 2 ? 0x666d68 : 0xa59d86;
    g.fillStyle(tone, 0.38).fillEllipse(x, y, 5 + index % 4, 3 + index % 3);
  }
  const props = scene.add.graphics().setDepth(worldDepth(1640));
  props.lineStyle(9, 0x6b4a31, 0.88).lineBetween(2010, 1620, 2095, 1650)
    .lineStyle(4, 0x8f6742, 0.8).lineBetween(2040, 1630, 2022, 1607)
    .lineBetween(2070, 1642, 2090, 1620);
}

function drawActivityCues(scene: Phaser.Scene, profile: VisualProfile): void {
  const cue = scene.add.graphics().setDepth(4.8);
  for (const activity of WORLD_ACTIVITY_CATALOG) {
    const radius = profile.tier === 'cinematic' ? 25 : 21;
    cue.fillStyle(0xf4d47b, 0.07).fillCircle(activity.x, activity.y, radius)
      .lineStyle(2, 0xf4d47b, 0.28).strokeCircle(activity.x, activity.y, radius);
    for (let index = 0; index < 4; index += 1) {
      const angle = index * Math.PI / 2;
      cue.fillStyle(0xffefb6, 0.62).fillCircle(activity.x + Math.cos(angle) * radius, activity.y + Math.sin(angle) * radius, 2.2);
    }
  }
}

function drawChair(scene: Phaser.Scene, x: number, y: number, color: number): void {
  const chair = scene.add.graphics().setDepth(worldDepth(y + 28));
  chair.lineStyle(5, 0x443a30, 0.9)
    .lineBetween(x - 18, y + 4, x - 9, y + 34)
    .lineBetween(x + 18, y + 4, x + 9, y + 34)
    .lineBetween(x - 18, y + 4, x - 21, y - 24)
    .lineBetween(x + 18, y + 4, x + 21, y - 24)
    .fillStyle(color, 0.9).fillRoundedRect(x - 18, y - 26, 36, 31, 5)
    .fillStyle(color, 0.76).fillRoundedRect(x - 21, y + 1, 42, 12, 4);
}

function drawStringLights(scene: Phaser.Scene, x1: number, y1: number, x2: number, y2: number, bulbs: number): void {
  const cable = scene.add.graphics().setDepth(worldDepth(Math.max(y1, y2) + 20));
  cable.lineStyle(2, 0x42392e, 0.76).lineBetween(x1, y1, x2, y2);
  for (let index = 0; index <= bulbs; index += 1) {
    const progress = index / bulbs;
    const x = Phaser.Math.Linear(x1, x2, progress);
    const y = Phaser.Math.Linear(y1, y2, progress) + Math.sin(progress * Math.PI) * 15;
    const bulb = scene.add.circle(x, y, 3.4, index % 3 === 0 ? 0xef765e : index % 2 ? 0x77dac5 : 0xf4d47b, 0.72)
      .setDepth(worldDepth(y + 22));
    scene.tweens.add({ targets: bulb, alpha: { from: 0.45, to: 1 }, duration: 800 + index * 45, yoyo: true, repeat: -1 });
  }
}

function required(id: string): Placement {
  const placement = OBJECT_PLACEMENTS[id];
  if (!placement) throw new Error(`Missing canonical placement for ${id}`);
  return placement;
}

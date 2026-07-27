import Phaser from 'phaser';
import { seededFraction, type VisualProfile } from './visuals';
import { CAMPFIRE_POSITION, worldDepth } from './worldRealism';

export function drawWorldDetailLayer(scene: Phaser.Scene, profile: VisualProfile): void {
  drawGroundVariation(scene, profile);
  drawArrivalDetails(scene);
  drawCentralCampDetails(scene);
  drawNorthCampDetails(scene);
  drawFestivalDetails(scene);
  drawBeachDetails(scene, profile);
  drawWoodlandDetails(scene);
  drawCoveDetails(scene);
}

function drawGroundVariation(scene: Phaser.Scene, profile: VisualProfile): void {
  const ground = scene.add.graphics().setDepth(1.2);
  const patches = [
    [180, 260, 250, 90, 0x385c3d, 0.08], [470, 540, 330, 95, 0x9ab66b, 0.07],
    [1030, 450, 280, 110, 0x365e40, 0.08], [250, 1030, 330, 120, 0xb5aa70, 0.08],
    [1030, 1020, 300, 120, 0x426f49, 0.09], [1520, 1040, 280, 140, 0x294c35, 0.12],
    [1680, 1480, 300, 135, 0x344d36, 0.13], [2080, 1250, 210, 100, 0x456a50, 0.1],
  ] as const;
  for (const [x, y, width, height, color, alpha] of patches) {
    ground.fillStyle(color, alpha).fillEllipse(x, y, width, height);
  }

  const speckCount = profile.tier === 'cinematic' ? 330 : 190;
  for (let index = 0; index < speckCount; index += 1) {
    const x = seededFraction('detail-ground-x', index) * 1940;
    const y = seededFraction('detail-ground-y', index) * 1800;
    const radius = 0.9 + seededFraction('detail-ground-r', index) * 1.8;
    const tone = index % 4 === 0 ? 0xd7c98c : index % 3 === 0 ? 0x294d35 : 0x6f9255;
    ground.fillStyle(tone, 0.18 + (index % 3) * 0.04).fillCircle(x, y, radius);
  }

  ground.lineStyle(2, 0x785f41, 0.16);
  for (let index = 0; index < 16; index += 1) {
    const x = 1440 + (index % 4) * 120;
    const y = 1050 + Math.floor(index / 4) * 175;
    ground.lineBetween(x, y, x + 14, y + 5);
    ground.lineBetween(x + 5, y - 4, x + 18, y + 1);
  }
}

function drawArrivalDetails(scene: Phaser.Scene): void {
  const ground = scene.add.graphics().setDepth(3.2);
  ground.lineStyle(4, 0x4f5554, 0.48);
  for (const x of [625, 735, 845, 955, 1065, 1175, 1285]) ground.lineBetween(x, 1515, x, 1680);
  ground.lineStyle(3, 0xd9d3b9, 0.58).lineBetween(740, 1330, 940, 1330);
  ground.lineStyle(8, 0x5e574a, 0.18).lineBetween(790, 1720, 790, 1305).lineBetween(885, 1720, 885, 1305);
  for (let y = 1360; y < 1710; y += 58) {
    ground.fillStyle(0x3d3f3e, 0.18).fillCircle(790, y, 4).fillCircle(885, y + 13, 3);
  }

  const props = scene.add.graphics().setDepth(worldDepth(1580));
  props.fillStyle(0x303735).fillRoundedRect(1235, 1518, 44, 58, 5)
    .fillStyle(0x17201f).fillRoundedRect(1240, 1525, 34, 14, 3)
    .fillStyle(0x6f7e74).fillRoundedRect(1232, 1511, 50, 10, 4);
  props.fillStyle(0x4c4437).fillRect(1010, 1584, 65, 8)
    .fillStyle(0xc5b27f).fillRoundedRect(1018, 1558, 50, 28, 4)
    .lineStyle(2, 0x59482f, 0.72).strokeRoundedRect(1018, 1558, 50, 28, 4);
  for (const x of [735, 940]) {
    props.fillStyle(0x585c58).fillRoundedRect(x - 6, 1275, 12, 56, 4)
      .fillStyle(0xf4c75d).fillRect(x - 4, 1286, 8, 9);
  }
  props.lineStyle(7, 0xddd6bc, 0.95).lineBetween(742, 1300, 928, 1300)
    .lineStyle(3, 0xef685c, 0.92);
  for (let x = 755; x < 925; x += 38) props.lineBetween(x, 1293, x + 18, 1307);

  const notice = scene.add.graphics().setDepth(worldDepth(1470));
  notice.fillStyle(0x593f2d).fillRoundedRect(608, 1393, 86, 74, 5)
    .fillStyle(0xc9a768).fillRoundedRect(614, 1399, 74, 60, 3);
  const paperColors = [0xf1e7ca, 0xc7e2d3, 0xf0c2af, 0xd5c7e8];
  for (let index = 0; index < 6; index += 1) {
    const x = 619 + (index % 3) * 22;
    const y = 1405 + Math.floor(index / 3) * 25;
    notice.fillStyle(paperColors[index % paperColors.length], 0.94).fillRect(x, y, 17, 20)
      .fillStyle(0x7a5a42).fillCircle(x + 8, y + 3, 1.5);
  }
}

function drawCentralCampDetails(scene: Phaser.Scene): void {
  const ground = scene.add.graphics().setDepth(2.4);
  ground.fillStyle(0x806a45, 0.16).fillEllipse(CAMPFIRE_POSITION.x, CAMPFIRE_POSITION.y + 10, 210, 145);
  ground.lineStyle(2, 0x6d5a3e, 0.22);
  for (let index = 0; index < 24; index += 1) {
    const angle = (Math.PI * 2 * index) / 24;
    const radius = 76 + (index % 4) * 12;
    const x = CAMPFIRE_POSITION.x + Math.cos(angle) * radius;
    const y = CAMPFIRE_POSITION.y + Math.sin(angle) * radius * 0.55;
    ground.lineBetween(x - 5, y, x + 7, y + 2);
  }

  drawTentLines(280, 1120, 155, 120);
  drawTentLines(470, 1115, 135, 105);
  drawTentLines(620, 1130, 135, 105);
  drawTentLines(860, 1115, 145, 110);
  drawTentLines(1050, 1130, 135, 105);

  const props = scene.add.graphics().setDepth(worldDepth(1110));
  props.fillStyle(0x294f69).fillRoundedRect(770, 1080, 76, 44, 8)
    .fillStyle(0xb9d7e1).fillRoundedRect(780, 1073, 56, 13, 5)
    .lineStyle(2, 0x173027, 0.68).strokeRoundedRect(770, 1080, 76, 44, 8);
  props.fillStyle(0x9e312d).fillRoundedRect(850, 1088, 44, 31, 5)
    .fillStyle(0xe7d5a3).fillRect(856, 1094, 32, 7);
  props.fillStyle(0x6f472b).fillRoundedRect(948, 1058, 38, 14, 3)
    .fillRoundedRect(958, 1073, 38, 14, 3)
    .fillRoundedRect(941, 1088, 38, 14, 3);
  for (let index = 0; index < 7; index += 1) {
    props.fillStyle(index % 2 ? 0xb8aa82 : 0x8e7f5d).fillCircle(946 + index * 8, 1066 + (index % 3) * 7, 5);
  }

  const hedge = scene.add.graphics().setDepth(worldDepth(1295));
  for (const [start, end] of [[245, 630], [1010, 1290]] as const) {
    for (let x = start; x <= end; x += 20) {
      hedge.fillStyle(x % 40 ? 0x315c3f : 0x426f46, 0.96).fillCircle(x, 1270 + (x % 3) * 3, 18)
        .fillStyle(0x6f9957, 0.48).fillCircle(x - 5, 1261, 8);
    }
  }

  drawCampingChair(scene, 815, 1035, 0xef685c);
  drawCampingChair(scene, 1015, 1100, 0x66a7c7);
  drawCampingChair(scene, 760, 950, 0xd4a44e);

  function drawTentLines(x: number, y: number, width: number, height: number): void {
    const lines = scene.add.graphics().setDepth(worldDepth(y + height) - 0.15);
    lines.lineStyle(2, 0xf0e4bd, 0.36)
      .lineBetween(x - 13, y + height + 8, x + width / 2, y + 8)
      .lineBetween(x + width + 13, y + height + 8, x + width / 2, y + 8);
    for (const pegX of [x - 13, x + width + 13]) lines.fillStyle(0x5b4935).fillRect(pegX - 2, y + height + 5, 4, 10);
  }
}

function drawNorthCampDetails(scene: Phaser.Scene): void {
  const ground = scene.add.graphics().setDepth(2.1);
  for (const [x, y, width] of [[485, 118, 260], [785, 132, 260], [1075, 108, 260]] as const) {
    ground.fillStyle(0xb7a47c, 0.17).fillRoundedRect(x, y, width, 155, 24);
    for (let index = 0; index < 26; index += 1) {
      const px = x + 12 + seededFraction(`north-gravel-x-${x}`, index) * (width - 24);
      const py = y + 18 + seededFraction(`north-gravel-y-${x}`, index) * 118;
      ground.fillStyle(index % 3 ? 0xd7caa7 : 0x766b56, 0.35).fillCircle(px, py, 1.5 + (index % 2));
    }
  }

  const props = scene.add.graphics().setDepth(worldDepth(420));
  props.lineStyle(3, 0x50422f, 0.82).lineBetween(440, 350, 760, 365);
  const clothColors = [0xef685c, 0x66dac6, 0xf4c75d, 0x8fb7e8];
  for (let index = 0; index < 7; index += 1) {
    const x = 465 + index * 41;
    props.fillStyle(clothColors[index % clothColors.length], 0.8).fillRect(x, 354 + index * 2, 25, 18);
  }
  props.fillStyle(0x5d3f2d).fillRoundedRect(350, 500, 78, 35, 5)
    .fillStyle(0x315c3f).fillRoundedRect(357, 488, 64, 17, 6);
  for (let index = 0; index < 5; index += 1) props.fillStyle(index % 2 ? 0xe8cf75 : 0xe98b8b).fillCircle(367 + index * 11, 489, 4);
  drawCampingChair(scene, 650, 470, 0x537f9e);
  drawCampingChair(scene, 1050, 535, 0x9d5a4e);
}

function drawFestivalDetails(scene: Phaser.Scene): void {
  const ground = scene.add.graphics().setDepth(2.5);
  ground.fillStyle(0x7f6543, 0.14).fillEllipse(1680, 520, 455, 270)
    .fillStyle(0x4e493b, 0.13).fillEllipse(1680, 890, 360, 130);
  ground.lineStyle(3, 0x25272b, 0.34)
    .beginPath().moveTo(1510, 630).lineTo(1610, 590).lineTo(1740, 610).lineTo(1855, 575).strokePath()
    .beginPath().moveTo(1490, 770).lineTo(1625, 735).lineTo(1810, 760).strokePath();

  const props = scene.add.graphics().setDepth(worldDepth(610));
  for (const x of [1460, 1870]) {
    props.fillStyle(0x20242a).fillRoundedRect(x, 520, 52, 84, 5)
      .fillStyle(0x101216).fillCircle(x + 26, 545, 13).fillCircle(x + 26, 577, 17)
      .lineStyle(2, 0x7a7f88, 0.55).strokeRoundedRect(x, 520, 52, 84, 5);
  }
  props.fillStyle(0x6f472b).fillRoundedRect(1650, 780, 110, 18, 4)
    .fillStyle(0xb9a273).fillRoundedRect(1660, 765, 90, 18, 3);
  for (let index = 0; index < 12; index += 1) {
    props.fillStyle(index % 3 === 0 ? 0xef685c : 0xe7dfc5, 0.7)
      .fillCircle(1490 + (index % 6) * 65, 900 + Math.floor(index / 6) * 20, 3 + (index % 2));
  }
}

function drawBeachDetails(scene: Phaser.Scene, profile: VisualProfile): void {
  const ground = scene.add.graphics().setDepth(3.4);
  ground.fillGradientStyle(0xb79c65, 0xb79c65, 0x9b7d4d, 0x9b7d4d, 0.24)
    .fillRoundedRect(2140, 35, 110, 1030, 34)
    .fillRoundedRect(2115, 1125, 105, 640, 34);
  ground.lineStyle(2, 0x6e6046, 0.22);
  for (let index = 0; index < 18; index += 1) {
    const y = 410 + index * 31;
    const x = 2050 + (index % 4) * 24;
    ground.strokeEllipse(x, y, 8, 15).strokeEllipse(x + 13, y + 10, 7, 13);
  }

  const reeds = scene.add.graphics().setDepth(worldDepth(770));
  for (let index = 0; index < 46; index += 1) {
    const y = 70 + index * 35;
    const x = y < 1100 ? 2205 + (index % 4) * 8 : 2175 + (index % 4) * 8;
    reeds.lineStyle(2, index % 3 ? 0x426841 : 0x6e8448, 0.75)
      .lineBetween(x, y + 20, x + (index % 2 ? 4 : -3), y)
      .fillStyle(index % 4 ? 0x6f5b36 : 0x896f3e, 0.78).fillEllipse(x + 2, y, 4, 12);
  }

  const props = scene.add.graphics().setDepth(worldDepth(720));
  props.fillStyle(0xef765e).fillCircle(2160, 650, 34)
    .fillStyle(0xf5ead2).fillTriangle(2160, 616, 2160, 650, 2190, 633)
    .fillTriangle(2160, 650, 2130, 633, 2160, 616)
    .lineStyle(5, 0x76563a).lineBetween(2160, 650, 2160, 715);
  props.fillStyle(0xef685c).fillCircle(2105, 370, 24)
    .fillStyle(0xf4efe0).fillCircle(2105, 370, 14)
    .fillStyle(0xef685c).fillCircle(2105, 370, 7)
    .lineStyle(4, 0x72543b).lineBetween(2105, 394, 2105, 430);
  props.fillStyle(0x6e9fd2, 0.85).fillRoundedRect(2025, 700, 92, 42, 6)
    .lineStyle(3, 0xf4c75d, 0.7).lineBetween(2035, 710, 2105, 733);

  if (profile.tier === 'cinematic') {
    for (let index = 0; index < 10; index += 1) {
      const sparkle = scene.add.circle(2310 + (index % 4) * 64, 180 + Math.floor(index / 4) * 260, 2.2, 0xe5fff8, 0.2).setDepth(8);
      scene.tweens.add({
        targets: sparkle,
        alpha: { from: 0.12, to: 0.65 },
        scaleX: { from: 0.5, to: 1.8 },
        duration: 1300 + index * 90,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.InOut',
      });
    }
  }
}

function drawWoodlandDetails(scene: Phaser.Scene): void {
  const ground = scene.add.graphics().setDepth(2.2);
  for (let index = 0; index < 90; index += 1) {
    const x = 1400 + seededFraction('wood-leaf-x', index) * 540;
    const y = 1000 + seededFraction('wood-leaf-y', index) * 770;
    const color = index % 3 === 0 ? 0x9a703f : index % 2 ? 0x5f6939 : 0x784a32;
    ground.fillStyle(color, 0.3).fillEllipse(x, y, 7 + (index % 3), 3 + (index % 2));
  }
  ground.lineStyle(2, 0x6c563c, 0.24);
  for (let index = 0; index < 20; index += 1) {
    const x = 1440 + (index % 5) * 95;
    const y = 1120 + Math.floor(index / 5) * 190;
    ground.lineBetween(x, y, x + 17, y + 8);
  }

  const props = scene.add.graphics().setDepth(worldDepth(1450));
  for (let row = 0; row < 4; row += 1) {
    for (let column = 0; column < 5; column += 1) {
      const x = 1775 + column * 23 + (row % 2) * 8;
      const y = 1440 + row * 17;
      props.fillStyle(row % 2 ? 0x8f613f : 0xa7774d).fillCircle(x, y, 10)
        .fillStyle(0x3f2d22).fillCircle(x, y, 3);
    }
  }
  props.fillStyle(0x4c5652).fillRoundedRect(1450, 1310, 58, 24, 4)
    .fillStyle(0xb77a45).fillRect(1457, 1317, 44, 5)
    .lineStyle(4, 0x4a3b2d).lineBetween(1518, 1292, 1518, 1340)
    .lineBetween(1518, 1295, 1542, 1318)
    .lineBetween(1518, 1310, 1498, 1330);
  props.fillStyle(0x587747, 0.72).fillEllipse(1460, 1650, 120, 30)
    .fillEllipse(1850, 1200, 110, 26);
}

function drawCoveDetails(scene: Phaser.Scene): void {
  const ground = scene.add.graphics().setDepth(3.1);
  for (let index = 0; index < 55; index += 1) {
    const x = 1960 + seededFraction('cove-stone-x', index) * 280;
    const y = 1120 + seededFraction('cove-stone-y', index) * 650;
    const tone = index % 3 === 0 ? 0x8a8f87 : index % 2 ? 0x666d68 : 0xa59d86;
    ground.fillStyle(tone, 0.38).fillEllipse(x, y, 5 + (index % 4), 3 + (index % 3));
  }
  ground.fillStyle(0x294b38, 0.18).fillEllipse(2070, 1280, 230, 110)
    .fillEllipse(2110, 1660, 300, 100);

  const props = scene.add.graphics().setDepth(worldDepth(1620));
  props.lineStyle(9, 0x6b4a31, 0.88).lineBetween(1990, 1595, 2075, 1625)
    .lineStyle(4, 0x8f6742, 0.8).lineBetween(2020, 1605, 2002, 1582)
    .lineBetween(2050, 1617, 2070, 1595);
  for (let index = 0; index < 12; index += 1) {
    const x = 2180 + (index % 4) * 17;
    const y = 1700 + Math.floor(index / 4) * 15;
    props.fillStyle(index % 2 ? 0x67786b : 0x869086, 0.8).fillEllipse(x, y, 13, 8);
  }
  for (let index = 0; index < 14; index += 1) {
    const x = 2190 + (index % 3) * 8;
    const y = 1190 + index * 22;
    props.lineStyle(2, 0x41663f, 0.72).lineBetween(x, y + 18, x + 4, y)
      .fillStyle(0x715b36, 0.75).fillEllipse(x + 4, y, 4, 11);
  }
}

function drawCampingChair(scene: Phaser.Scene, x: number, y: number, color: number): void {
  const chair = scene.add.graphics().setDepth(worldDepth(y + 28));
  chair.lineStyle(5, 0x443a30, 0.9)
    .lineBetween(x - 18, y + 4, x - 9, y + 34)
    .lineBetween(x + 18, y + 4, x + 9, y + 34)
    .lineBetween(x - 18, y + 4, x - 21, y - 24)
    .lineBetween(x + 18, y + 4, x + 21, y - 24)
    .fillStyle(color, 0.9).fillRoundedRect(x - 18, y - 26, 36, 31, 5)
    .fillStyle(color, 0.76).fillRoundedRect(x - 21, y + 1, 42, 12, 4);
}

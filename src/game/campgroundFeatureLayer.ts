import Phaser from 'phaser';
import { OBJECT_PLACEMENTS } from './aerialCampgroundPlan';
import { CAMPFIRE_POSITION, worldDepth } from './worldRealism';
import type { VisualProfile } from './visuals';

export function drawVisibleCampgroundFeatures(scene: Phaser.Scene, profile: VisualProfile): void {
  drawArrivalIdentity(scene, profile);
  drawNorthCampingLife(scene, profile);
  drawTaucherBasecamp(scene, profile);
  drawFestivalIdentity(scene, profile);
  drawBeachLife(scene, profile);
  drawServiceYard(scene, profile);
  drawCoveRetreat(scene, profile);
}

function drawArrivalIdentity(scene: Phaser.Scene, profile: VisualProfile): void {
  const ground = scene.add.graphics().setDepth(4.77);
  ground.lineStyle(5, 0xf2d777, 0.78)
    .lineBetween(860, 1715, 900, 1675)
    .lineBetween(900, 1675, 940, 1715);
  ground.fillStyle(0xf2d777, 0.72).fillTriangle(900, 1645, 882, 1680, 918, 1680);
  ground.fillStyle(0x233532, 0.42).fillRoundedRect(1015, 1570, 300, 30, 8);

  const roadLabel = scene.add.text(900, 1718, 'BLAUE ADRIA', {
    fontFamily: 'Arial Black, system-ui', fontSize: '18px', color: '#f5e5a8', stroke: '#33413d', strokeThickness: 5, letterSpacing: 2,
  }).setOrigin(0.5).setDepth(4.8);
  roadLabel.setAngle(-2);

  const reception = OBJECT_PLACEMENTS.reception;
  if (reception?.width && reception.height) {
    const awning = scene.add.graphics().setDepth(worldDepth(reception.y + reception.height) + 0.2);
    const y = reception.y + reception.height - 12;
    for (let index = 0; index < 7; index += 1) {
      awning.fillStyle(index % 2 ? 0xf2e2ba : 0xd45f55, 0.95)
        .fillRect(reception.x + 18 + index * 31, y, 31, 25);
    }
    awning.lineStyle(4, 0x4d3a2e, 0.9).lineBetween(reception.x + 18, y, reception.x + 235, y);
  }

  drawFlag(scene, 1000, 1395, 0xd65f55, 'CHECK-IN');
  drawFlag(scene, 1350, 1400, 0x4e9e8a, 'ADRIA');
  drawBikeRack(scene, 555, 1540);
  drawPlanter(scene, 1305, 1470, 0xef765e);
  drawPlanter(scene, 1345, 1470, 0xf4c75d);

  if (profile.tier === 'cinematic') {
    drawLampChain(scene, 1000, 1370, 1360, 1370, 11);
  }
}

function drawNorthCampingLife(scene: Phaser.Scene, profile: VisualProfile): void {
  const laundry = scene.add.graphics().setDepth(worldDepth(525));
  laundry.lineStyle(3, 0x554534, 0.9).lineBetween(420, 470, 830, 500);
  const clothColors = [0xe7655d, 0x5ea8c7, 0xf4c75d, 0x68b18d, 0xb985c9, 0xf0e3c3];
  for (let index = 0; index < 10; index += 1) {
    const x = 445 + index * 38;
    const y = 472 + index * 2.8;
    laundry.fillStyle(clothColors[index % clothColors.length], 0.94).fillRoundedRect(x, y, 25, 24, 3);
  }

  drawAwning(scene, 430, 195, 210, 65, 0x5f9dc1);
  drawAwning(scene, 980, 195, 210, 65, 0xe57c64);
  drawFlowerBox(scene, 365, 515, 0xe88a9b);
  drawFlowerBox(scene, 1040, 540, 0xf0c85e);
  drawChair(scene, 720, 535, 0x4e8d73);
  drawChair(scene, 805, 540, 0xd96d5c);

  if (profile.tier === 'cinematic') {
    for (let index = 0; index < 8; index += 1) {
      const pinwheel = scene.add.star(930 + index * 38, 585, 5, 4, 10, index % 2 ? 0xf4c75d : 0x69c6ba, 0.8)
        .setDepth(worldDepth(600));
      scene.tweens.add({ targets: pinwheel, angle: 360, duration: 2800 + index * 100, repeat: -1 });
    }
  }
}

function drawTaucherBasecamp(scene: Phaser.Scene, profile: VisualProfile): void {
  const tents = ['home-tent', 'tent-andre', 'tent-rene', 'tent-lars', 'tent-danny'] as const;
  const names = ['DEIN ZELT', 'ANDRÉ', 'RENÉ', 'LARS', 'DANNY'];
  const matColors = [0x4f91b7, 0xd06055, 0x4ba88f, 0xe3aa4c, 0x9367b2];
  tents.forEach((id, index) => {
    const tent = OBJECT_PLACEMENTS[id];
    if (!tent?.width || !tent.height) return;
    const centerX = tent.x + tent.width / 2;
    const frontY = tent.y + tent.height + 10;
    const mat = scene.add.graphics().setDepth(worldDepth(frontY) - 0.2);
    mat.fillStyle(matColors[index], 0.92).fillRoundedRect(centerX - 31, frontY - 5, 62, 22, 5)
      .lineStyle(2, 0xf3e4b9, 0.6).strokeRoundedRect(centerX - 31, frontY - 5, 62, 22, 5);
    scene.add.text(centerX, tent.y + tent.height - 8, names[index], {
      fontFamily: 'Arial Black, system-ui', fontSize: '9px', color: '#fff0bf', backgroundColor: '#173027cc', padding: { x: 5, y: 2 },
    }).setOrigin(0.5).setDepth(worldDepth(frontY) + 0.1);
  });

  const fire = scene.add.graphics().setDepth(worldDepth(CAMPFIRE_POSITION.y + 35));
  for (let index = 0; index < 12; index += 1) {
    const angle = index / 12 * Math.PI * 2;
    fire.fillStyle(index % 2 ? 0x8b8175 : 0xb0a38e, 0.98)
      .fillCircle(CAMPFIRE_POSITION.x + Math.cos(angle) * 34, CAMPFIRE_POSITION.y + Math.sin(angle) * 19, 9);
  }
  fire.fillStyle(0x6b321f, 0.95).fillEllipse(CAMPFIRE_POSITION.x, CAMPFIRE_POSITION.y, 48, 25)
    .fillStyle(0xf6a53b, 0.95).fillTriangle(CAMPFIRE_POSITION.x, CAMPFIRE_POSITION.y - 25, CAMPFIRE_POSITION.x - 17, CAMPFIRE_POSITION.y + 9, CAMPFIRE_POSITION.x + 18, CAMPFIRE_POSITION.y + 9)
    .fillStyle(0xffdf73, 0.92).fillTriangle(CAMPFIRE_POSITION.x + 2, CAMPFIRE_POSITION.y - 15, CAMPFIRE_POSITION.x - 8, CAMPFIRE_POSITION.y + 8, CAMPFIRE_POSITION.x + 12, CAMPFIRE_POSITION.y + 8);

  drawCooler(scene, 850, 1115, 0x4e8cad);
  drawCrateStack(scene, 925, 1130, 3);
  drawCampingTable(scene, 1010, 1130);
  drawChair(scene, 1060, 1200, 0xd7655a);
  drawChair(scene, 1165, 1185, 0x5c9ac1);
  drawFlag(scene, 80, 975, 0x4aa389, 'TAUCHER');

  drawBunting(scene, 90, 1000, 820, 1000, 16);
  if (profile.tier === 'cinematic') {
    drawLampChain(scene, 90, 1018, 820, 1018, 18);
    const glow = scene.add.circle(CAMPFIRE_POSITION.x, CAMPFIRE_POSITION.y, 75, 0xffad45, 0.12)
      .setDepth(worldDepth(CAMPFIRE_POSITION.y) - 0.5);
    scene.tweens.add({ targets: glow, alpha: { from: 0.07, to: 0.2 }, scale: { from: 0.92, to: 1.08 }, duration: 1300, yoyo: true, repeat: -1 });
  }
}

function drawFestivalIdentity(scene: Phaser.Scene, profile: VisualProfile): void {
  const floor = scene.add.graphics().setDepth(4.78);
  floor.fillStyle(0x423b34, 0.58).fillRoundedRect(1530, 650, 330, 170, 18);
  for (let row = 0; row < 5; row += 1) {
    for (let column = 0; column < 9; column += 1) {
      floor.fillStyle((row + column) % 3 === 0 ? 0xd85f58 : (row + column) % 2 ? 0x5da59b : 0xe4b34f, 0.25)
        .fillRect(1545 + column * 34, 665 + row * 27, 27, 20);
    }
  }
  drawBunting(scene, 1450, 350, 1905, 350, 18);
  drawSpeaker(scene, 1475, 570);
  drawSpeaker(scene, 1840, 570);
  drawCrateStack(scene, 1500, 850, 5);
  drawPalletLounge(scene, 1750, 870);
  drawFlag(scene, 1880, 885, 0xd26057, 'FESTWIESE');

  if (profile.tier === 'cinematic') {
    drawLampChain(scene, 1450, 375, 1905, 375, 20);
    for (let index = 0; index < 10; index += 1) {
      const light = scene.add.circle(1560 + index * 30, 735 + (index % 2 ? 28 : -20), 8, index % 3 === 0 ? 0xef6a62 : index % 2 ? 0x62c3b4 : 0xf2c85d, 0.2)
        .setDepth(4.79);
      scene.tweens.add({ targets: light, alpha: { from: 0.08, to: 0.42 }, duration: 700 + index * 70, yoyo: true, repeat: -1 });
    }
  }
}

function drawBeachLife(scene: Phaser.Scene, profile: VisualProfile): void {
  drawUmbrella(scene, 2055, 330, 0xe2655d);
  drawUmbrella(scene, 2130, 750, 0x5797bd);
  drawTowel(scene, 2040, 430, 0xf0bf52);
  drawTowel(scene, 2110, 450, 0x56ad98);
  drawTowel(scene, 2025, 835, 0xd66f87);
  drawLifebuoy(scene, 2175, 610);
  drawBeachBag(scene, 2070, 890);

  const footprints = scene.add.graphics().setDepth(4.79);
  for (let index = 0; index < 16; index += 1) {
    const x = 1985 + index * 9;
    const y = 560 + index * 22;
    footprints.fillStyle(0x7f6847, 0.38).fillEllipse(x, y, 6, 12).fillEllipse(x + 11, y + 9, 5, 10);
  }

  if (profile.tier === 'cinematic') {
    for (let index = 0; index < 12; index += 1) {
      const shimmer = scene.add.rectangle(2290 + index * 22, 260 + (index % 4) * 155, 30, 3, 0xd8fff4, 0.2)
        .setDepth(5.1);
      scene.tweens.add({ targets: shimmer, x: shimmer.x + 35, alpha: { from: 0.08, to: 0.55 }, duration: 1200 + index * 80, yoyo: true, repeat: -1 });
    }
  }
}

function drawServiceYard(scene: Phaser.Scene, profile: VisualProfile): void {
  drawWheelbarrow(scene, 1540, 1415);
  drawTireStack(scene, 1480, 1580);
  drawToolRack(scene, 1665, 1485);
  drawCrateStack(scene, 1790, 1670, 4);
  drawWoodPile(scene, 1830, 1690);
  drawFlag(scene, 1790, 1160, 0x63815b, 'SERVICE');

  const oil = scene.add.graphics().setDepth(4.76);
  oil.fillStyle(0x252922, 0.24).fillEllipse(1575, 1610, 95, 32)
    .fillStyle(0x7d633f, 0.28).fillEllipse(1720, 1390, 130, 35);

  if (profile.tier === 'cinematic') {
    for (let index = 0; index < 8; index += 1) {
      const leaf = scene.add.ellipse(1440 + index * 62, 1110 + index * 67, 10, 5, index % 2 ? 0xa36c3e : 0x75834a, 0.65)
        .setDepth(5.2);
      scene.tweens.add({ targets: leaf, x: leaf.x + 16, y: leaf.y + 8, angle: 120, duration: 2200 + index * 150, yoyo: true, repeat: -1 });
    }
  }
}

function drawCoveRetreat(scene: Phaser.Scene, profile: VisualProfile): void {
  drawLantern(scene, 1995, 1375);
  drawLantern(scene, 2070, 1455);
  drawLantern(scene, 2140, 1455);
  drawStoneCircle(scene, 2070, 1660);
  drawDriftwood(scene, 2005, 1585);
  drawDriftwood(scene, 2115, 1720);
  drawTowel(scene, 2020, 1270, 0x588a72);

  if (profile.tier === 'cinematic') {
    for (const [x, y] of [[1995, 1375], [2070, 1455], [2140, 1455]] as const) {
      const glow = scene.add.circle(x, y - 18, 28, 0xffd77c, 0.08).setDepth(worldDepth(y) - 0.2);
      scene.tweens.add({ targets: glow, alpha: { from: 0.05, to: 0.22 }, duration: 1100 + x % 300, yoyo: true, repeat: -1 });
    }
  }
}

function drawFlag(scene: Phaser.Scene, x: number, y: number, color: number, label: string): void {
  const g = scene.add.graphics().setDepth(worldDepth(y + 65));
  g.lineStyle(5, 0x5b4631, 0.95).lineBetween(x, y, x, y + 68)
    .fillStyle(color, 0.96).fillTriangle(x + 2, y + 4, x + 72, y + 18, x + 2, y + 34);
  scene.add.text(x + 28, y + 16, label, { fontFamily: 'Arial Black, system-ui', fontSize: '8px', color: '#fff5d1' })
    .setOrigin(0.5).setDepth(worldDepth(y + 66) + 0.1);
}

function drawBikeRack(scene: Phaser.Scene, x: number, y: number): void {
  const g = scene.add.graphics().setDepth(worldDepth(y + 55));
  for (let index = 0; index < 4; index += 1) {
    const bx = x + index * 32;
    g.lineStyle(4, 0x6e7472, 0.9).strokeCircle(bx, y + 25, 15).strokeCircle(bx + 24, y + 25, 15)
      .lineBetween(bx, y + 25, bx + 12, y + 5).lineBetween(bx + 12, y + 5, bx + 24, y + 25)
      .lineBetween(bx + 12, y + 5, bx + 31, y + 4);
  }
}

function drawPlanter(scene: Phaser.Scene, x: number, y: number, flower: number): void {
  const g = scene.add.graphics().setDepth(worldDepth(y + 35));
  g.fillStyle(0x8b5f3c).fillRoundedRect(x - 22, y + 5, 44, 20, 5)
    .fillStyle(0x365d3d).fillEllipse(x, y + 3, 55, 20);
  for (let index = 0; index < 5; index += 1) g.fillStyle(index % 2 ? flower : 0xf4d47b).fillCircle(x - 16 + index * 8, y - 2 + index % 2 * 5, 4);
}

function drawAwning(scene: Phaser.Scene, x: number, y: number, width: number, height: number, color: number): void {
  const g = scene.add.graphics().setDepth(worldDepth(y + height));
  g.fillStyle(color, 0.72).fillRoundedRect(x, y, width, height, 12)
    .lineStyle(4, 0x4e4436, 0.9).lineBetween(x, y + height, x, y + height + 45).lineBetween(x + width, y + height, x + width, y + height + 45);
  for (let index = 0; index < 7; index += 1) g.lineStyle(3, 0xf4ead2, 0.4).lineBetween(x + index * width / 7, y + 5, x + index * width / 7, y + height - 5);
}

function drawFlowerBox(scene: Phaser.Scene, x: number, y: number, color: number): void {
  const g = scene.add.graphics().setDepth(worldDepth(y + 25));
  g.fillStyle(0x865c38).fillRoundedRect(x - 38, y, 76, 18, 4);
  for (let index = 0; index < 8; index += 1) g.fillStyle(index % 2 ? color : 0xf3cf62).fillCircle(x - 30 + index * 9, y - 2 - index % 3 * 4, 4);
}

function drawCooler(scene: Phaser.Scene, x: number, y: number, color: number): void {
  const g = scene.add.graphics().setDepth(worldDepth(y + 45));
  g.fillStyle(color).fillRoundedRect(x, y, 70, 42, 8)
    .fillStyle(0xdce8e8).fillRoundedRect(x + 8, y - 8, 54, 15, 5)
    .lineStyle(3, 0x21372f, 0.72).strokeRoundedRect(x, y, 70, 42, 8);
}

function drawCrateStack(scene: Phaser.Scene, x: number, y: number, count: number): void {
  const g = scene.add.graphics().setDepth(worldDepth(y + 55));
  for (let index = 0; index < count; index += 1) {
    const cx = x + index % 2 * 34;
    const cy = y - Math.floor(index / 2) * 26;
    g.fillStyle(index % 2 ? 0x9d342f : 0x3c7458).fillRoundedRect(cx, cy, 31, 24, 4)
      .lineStyle(2, 0xf0d49c, 0.45).strokeRoundedRect(cx, cy, 31, 24, 4);
    for (let bottle = 0; bottle < 3; bottle += 1) g.fillStyle(0xd7ba68, 0.82).fillCircle(cx + 7 + bottle * 8, cy + 6, 2.5);
  }
}

function drawCampingTable(scene: Phaser.Scene, x: number, y: number): void {
  const g = scene.add.graphics().setDepth(worldDepth(y + 45));
  g.fillStyle(0xb69263).fillRoundedRect(x, y, 95, 20, 5)
    .lineStyle(5, 0x4c4134, 0.9).lineBetween(x + 12, y + 18, x + 5, y + 55).lineBetween(x + 82, y + 18, x + 90, y + 55)
    .fillStyle(0xefe2c1).fillCircle(x + 25, y - 2, 8)
    .fillStyle(0xe2b54c).fillRoundedRect(x + 55, y - 12, 15, 18, 3);
}

function drawBunting(scene: Phaser.Scene, x1: number, y1: number, x2: number, y2: number, count: number): void {
  const g = scene.add.graphics().setDepth(worldDepth(Math.max(y1, y2) + 30));
  g.lineStyle(2, 0x4a3e31, 0.88).lineBetween(x1, y1, x2, y2);
  const colors = [0xef6b61, 0xf2c758, 0x5db5a5, 0x659dcb, 0xb77ac5];
  for (let index = 0; index < count; index += 1) {
    const progress = (index + 0.5) / count;
    const x = Phaser.Math.Linear(x1, x2, progress);
    const y = Phaser.Math.Linear(y1, y2, progress) + Math.sin(progress * Math.PI) * 14;
    g.fillStyle(colors[index % colors.length], 0.95).fillTriangle(x - 8, y, x + 8, y, x, y + 18);
  }
}

function drawLampChain(scene: Phaser.Scene, x1: number, y1: number, x2: number, y2: number, count: number): void {
  const cable = scene.add.graphics().setDepth(worldDepth(Math.max(y1, y2) + 35));
  cable.lineStyle(2, 0x3f372e, 0.8).lineBetween(x1, y1, x2, y2);
  for (let index = 0; index <= count; index += 1) {
    const progress = index / count;
    const x = Phaser.Math.Linear(x1, x2, progress);
    const y = Phaser.Math.Linear(y1, y2, progress) + Math.sin(progress * Math.PI) * 13;
    const bulb = scene.add.circle(x, y + 5, 4.2, index % 3 === 0 ? 0xef765e : index % 2 ? 0x69c9b6 : 0xf4cc61, 0.88)
      .setDepth(worldDepth(y + 40));
    scene.tweens.add({ targets: bulb, alpha: { from: 0.5, to: 1 }, duration: 800 + index * 40, yoyo: true, repeat: -1 });
  }
}

function drawSpeaker(scene: Phaser.Scene, x: number, y: number): void {
  const g = scene.add.graphics().setDepth(worldDepth(y + 90));
  g.fillStyle(0x202429).fillRoundedRect(x, y, 55, 88, 6)
    .fillStyle(0x0d1013).fillCircle(x + 27, y + 27, 14).fillCircle(x + 27, y + 62, 19)
    .lineStyle(2, 0x777d83, 0.58).strokeRoundedRect(x, y, 55, 88, 6);
}

function drawPalletLounge(scene: Phaser.Scene, x: number, y: number): void {
  const g = scene.add.graphics().setDepth(worldDepth(y + 65));
  for (let index = 0; index < 5; index += 1) g.fillStyle(index % 2 ? 0x9e754c : 0xb98a58).fillRect(x, y + index * 8, 115, 6);
  g.fillStyle(0x638db0).fillRoundedRect(x + 8, y - 18, 45, 28, 6)
    .fillStyle(0xd76b5f).fillRoundedRect(x + 60, y - 18, 45, 28, 6);
}

function drawUmbrella(scene: Phaser.Scene, x: number, y: number, color: number): void {
  const g = scene.add.graphics().setDepth(worldDepth(y + 85));
  g.fillStyle(color).fillCircle(x, y, 38)
    .fillStyle(0xf3e9cd, 0.86).fillTriangle(x, y - 38, x, y, x + 35, y - 13)
    .fillTriangle(x, y - 38, x - 35, y - 13, x, y)
    .lineStyle(5, 0x715138).lineBetween(x, y, x, y + 82);
}

function drawTowel(scene: Phaser.Scene, x: number, y: number, color: number): void {
  const g = scene.add.graphics().setDepth(4.8);
  g.fillStyle(color, 0.9).fillRoundedRect(x, y, 64, 26, 5);
  for (let index = 0; index < 5; index += 1) g.lineStyle(2, 0xf5ead0, 0.48).lineBetween(x + 8 + index * 11, y + 3, x + 8 + index * 11, y + 23);
}

function drawLifebuoy(scene: Phaser.Scene, x: number, y: number): void {
  const g = scene.add.graphics().setDepth(worldDepth(y + 55));
  g.fillStyle(0xe9675f).fillCircle(x, y, 24).fillStyle(0xf5eddc).fillCircle(x, y, 14).fillStyle(0xe9675f).fillCircle(x, y, 7)
    .lineStyle(4, 0x72513a).lineBetween(x, y + 24, x, y + 58);
}

function drawBeachBag(scene: Phaser.Scene, x: number, y: number): void {
  const g = scene.add.graphics().setDepth(worldDepth(y + 35));
  g.fillStyle(0xc58a52).fillRoundedRect(x, y, 40, 31, 7)
    .lineStyle(4, 0x5d4734).strokeEllipse(x + 20, y + 3, 24, 17);
}

function drawWheelbarrow(scene: Phaser.Scene, x: number, y: number): void {
  const g = scene.add.graphics().setDepth(worldDepth(y + 55));
  g.fillStyle(0x58755f).fillTriangle(x, y, x + 70, y + 5, x + 54, y + 38)
    .lineStyle(5, 0x4b3d31).lineBetween(x + 8, y + 12, x - 20, y - 8).lineBetween(x + 58, y + 30, x + 85, y + 52)
    .fillStyle(0x282c2a).fillCircle(x + 18, y + 42, 14);
}

function drawTireStack(scene: Phaser.Scene, x: number, y: number): void {
  const g = scene.add.graphics().setDepth(worldDepth(y + 60));
  for (let index = 0; index < 3; index += 1) {
    g.fillStyle(0x252827).fillEllipse(x, y - index * 15, 65, 25)
      .fillStyle(0x606663).fillEllipse(x, y - index * 15, 28, 10);
  }
}

function drawToolRack(scene: Phaser.Scene, x: number, y: number): void {
  const g = scene.add.graphics().setDepth(worldDepth(y + 80));
  g.fillStyle(0x6d4d34).fillRoundedRect(x, y, 100, 70, 5);
  for (let index = 0; index < 5; index += 1) {
    const tx = x + 14 + index * 18;
    g.lineStyle(4, index % 2 ? 0xb8b3a7 : 0x414b47).lineBetween(tx, y + 10, tx + (index % 2 ? 6 : -5), y + 54)
      .fillStyle(0x80512f).fillCircle(tx, y + 59, 5);
  }
}

function drawWoodPile(scene: Phaser.Scene, x: number, y: number): void {
  const g = scene.add.graphics().setDepth(worldDepth(y + 55));
  for (let row = 0; row < 4; row += 1) {
    for (let column = 0; column < 5; column += 1) {
      const px = x + column * 22 + row % 2 * 8;
      const py = y + row * 15;
      g.fillStyle(row % 2 ? 0x9b6942 : 0xb37a4d).fillCircle(px, py, 10).fillStyle(0x4d3425).fillCircle(px, py, 3);
    }
  }
}

function drawLantern(scene: Phaser.Scene, x: number, y: number): void {
  const g = scene.add.graphics().setDepth(worldDepth(y + 40));
  g.lineStyle(4, 0x4a3d30).lineBetween(x, y, x, y + 48)
    .fillStyle(0xf4ce70, 0.95).fillRoundedRect(x - 10, y - 16, 20, 25, 4)
    .lineStyle(2, 0x6b5536).strokeRoundedRect(x - 10, y - 16, 20, 25, 4);
}

function drawStoneCircle(scene: Phaser.Scene, x: number, y: number): void {
  const g = scene.add.graphics().setDepth(worldDepth(y + 28));
  for (let index = 0; index < 10; index += 1) {
    const angle = index / 10 * Math.PI * 2;
    g.fillStyle(index % 2 ? 0x8c8f88 : 0xa79e86).fillEllipse(x + Math.cos(angle) * 35, y + Math.sin(angle) * 18, 14, 9);
  }
  g.fillStyle(0x3c3028, 0.78).fillEllipse(x, y, 45, 21);
}

function drawDriftwood(scene: Phaser.Scene, x: number, y: number): void {
  const g = scene.add.graphics().setDepth(worldDepth(y + 25));
  g.lineStyle(9, 0x765238, 0.9).lineBetween(x, y, x + 82, y + 28)
    .lineStyle(4, 0x9a6b44, 0.88).lineBetween(x + 24, y + 8, x + 8, y - 18).lineBetween(x + 52, y + 18, x + 72, y - 4);
}

function drawChair(scene: Phaser.Scene, x: number, y: number, color: number): void {
  const chair = scene.add.graphics().setDepth(worldDepth(y + 28));
  chair.lineStyle(5, 0x443a30, 0.9)
    .lineBetween(x - 18, y + 4, x - 9, y + 34)
    .lineBetween(x + 18, y + 4, x + 9, y + 34)
    .lineBetween(x - 18, y + 4, x - 21, y - 24)
    .lineBetween(x + 18, y + 4, x + 21, y - 24)
    .fillStyle(color, 0.92).fillRoundedRect(x - 18, y - 26, 36, 31, 5)
    .fillStyle(color, 0.78).fillRoundedRect(x - 21, y + 1, 42, 12, 4);
}

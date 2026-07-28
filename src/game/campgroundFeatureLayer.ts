import Phaser from 'phaser';
import {
  ARRIVAL_STORY_PLACEMENTS,
  FRIEND_CAMP_CENTER,
  FRIEND_TENT_ENTRY_POINTS,
  FRIEND_TENT_IDS,
  OBJECT_PLACEMENTS,
} from './aerialCampgroundPlan';
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
  ground.lineStyle(5, 0xf2d777, 0.78).lineBetween(860, 1715, 900, 1675).lineBetween(900, 1675, 940, 1715)
    .fillStyle(0xf2d777, 0.72).fillTriangle(900, 1645, 882, 1680, 918, 1680)
    .fillStyle(0x233532, 0.42).fillRoundedRect(1015, 1570, 300, 30, 8);
  scene.add.text(900, 1718, 'BLAUE ADRIA', {
    fontFamily: 'Arial Black, system-ui', fontSize: '18px', color: '#f5e5a8', stroke: '#33413d', strokeThickness: 5, letterSpacing: 2,
  }).setOrigin(0.5).setAngle(-2).setDepth(4.8);

  const reception = OBJECT_PLACEMENTS.reception;
  if (reception.width && reception.height) {
    const awning = scene.add.graphics().setDepth(worldDepth(reception.y + reception.height) + 0.2);
    const y = reception.y + reception.height - 12;
    for (let index = 0; index < 7; index += 1) awning.fillStyle(index % 2 ? 0xf2e2ba : 0xd45f55).fillRect(reception.x + 18 + index * 31, y, 31, 25);
    awning.lineStyle(4, 0x4d3a2e, 0.9).lineBetween(reception.x + 18, y, reception.x + 235, y);
  }
  drawFlag(scene, 1000, 1395, 0xd65f55, 'CHECK-IN');
  drawFlag(scene, 1350, 1400, 0x4e9e8a, 'ADRIA');
  drawBikeRack(scene, 555, 1540);
  drawPlanter(scene, 1305, 1470, 0xef765e);
  drawPlanter(scene, 1345, 1470, 0xf4c75d);
  if (profile.tier === 'cinematic') drawLampChain(scene, 1000, 1370, 1360, 1370, 11);
}

function drawNorthCampingLife(scene: Phaser.Scene, profile: VisualProfile): void {
  const laundry = scene.add.graphics().setDepth(worldDepth(525));
  laundry.lineStyle(3, 0x554534, 0.9).lineBetween(420, 470, 830, 500);
  const colors = [0xe7655d, 0x5ea8c7, 0xf4c75d, 0x68b18d, 0xb985c9, 0xf0e3c3];
  for (let index = 0; index < 10; index += 1) laundry.fillStyle(colors[index % colors.length]).fillRoundedRect(445 + index * 38, 472 + index * 2.8, 25, 24, 3);
  drawAwning(scene, 430, 195, 210, 65, 0x5f9dc1);
  drawAwning(scene, 980, 195, 210, 65, 0xe57c64);
  drawFlowerBox(scene, 365, 515, 0xe88a9b);
  drawFlowerBox(scene, 1040, 540, 0xf0c85e);
  drawChair(scene, 720, 535, 0x4e8d73);
  drawChair(scene, 805, 540, 0xd96d5c);
  if (profile.tier === 'cinematic') {
    for (let index = 0; index < 8; index += 1) {
      const pinwheel = scene.add.star(930 + index * 38, 585, 5, 4, 10, index % 2 ? 0xf4c75d : 0x69c6ba, 0.8).setDepth(worldDepth(600));
      scene.tweens.add({ targets: pinwheel, angle: 360, duration: 2800 + index * 100, repeat: -1 });
    }
  }
}

function drawTaucherBasecamp(scene: Phaser.Scene, profile: VisualProfile): void {
  const names: Record<(typeof FRIEND_TENT_IDS)[number], string> = {
    'home-tent': 'DEIN ZELT', 'tent-andre': 'ANDRÉ', 'tent-rene': 'RENÉ', 'tent-lars': 'LARS', 'tent-danny': 'DANNY',
  };
  const matColors = [0x4f91b7, 0xd06055, 0x4ba88f, 0xe3aa4c, 0x9367b2];
  FRIEND_TENT_IDS.forEach((id, index) => {
    const tent = OBJECT_PLACEMENTS[id];
    const entry = FRIEND_TENT_ENTRY_POINTS[id];
    if (!tent.width || !tent.height) return;
    const angle = Phaser.Math.Angle.Between(tent.x + tent.width / 2, tent.y + tent.height / 2, entry.x, entry.y);
    const mat = scene.add.rectangle(entry.x, entry.y, 62, 22, matColors[index], 0.92)
      .setAngle(Phaser.Math.RadToDeg(angle)).setStrokeStyle(2, 0xf3e4b9, 0.6).setDepth(worldDepth(entry.y) - 0.2);
    mat.setOrigin(0.5);
    scene.add.text(tent.x + tent.width / 2, tent.y + tent.height / 2, names[id], {
      fontFamily: 'Arial Black, system-ui', fontSize: '9px', color: '#fff0bf', backgroundColor: '#173027cc', padding: { x: 5, y: 2 },
    }).setOrigin(0.5).setDepth(worldDepth(tent.y + tent.height) + 0.1);
  });

  drawCampfire(scene, CAMPFIRE_POSITION.x, CAMPFIRE_POSITION.y);
  drawCampingTable(scene, 535, 1195);
  drawChair(scene, 510, 1240, 0xd7655a);
  drawChair(scene, 655, 1245, 0x5c9ac1);
  drawChair(scene, 745, 1205, 0x4e8d73);
  drawFlag(scene, 75, 920, 0x4aa389, 'TAUCHER');
  drawBunting(scene, 95, 925, 1280, 925, 24);

  const service = scene.add.graphics().setDepth(4.79);
  service.fillStyle(0x5f6f5f, 0.18).fillRoundedRect(1060, 970, 270, 290, 18)
    .lineStyle(2, 0xf0d77e, 0.32).strokeRoundedRect(1060, 970, 270, 290, 18);
  scene.add.text(1195, 982, 'AUSLADEN · STROM · VORRÄTE', {
    fontFamily: 'Arial Black, system-ui', fontSize: '9px', color: '#fff0ba', stroke: '#173027', strokeThickness: 3,
  }).setOrigin(0.5).setDepth(4.8);
  drawCableRoute(scene, ARRIVAL_STORY_PLACEMENTS.cable, ARRIVAL_STORY_PLACEMENTS.powerBox);
  drawSupplySign(scene, ARRIVAL_STORY_PLACEMENTS.drinks.x, ARRIVAL_STORY_PLACEMENTS.drinks.y + 45, 'GETRÄNKE');
  drawSupplySign(scene, ARRIVAL_STORY_PLACEMENTS.tents.x, ARRIVAL_STORY_PLACEMENTS.tents.y + 45, 'ZELTSÄCKE');
  drawSupplySign(scene, ARRIVAL_STORY_PLACEMENTS.cable.x, ARRIVAL_STORY_PLACEMENTS.cable.y + 45, 'KABELTROMMEL');

  if (profile.tier === 'cinematic') {
    drawLampChain(scene, 100, 945, 1280, 945, 24);
    const glow = scene.add.circle(FRIEND_CAMP_CENTER.x, FRIEND_CAMP_CENTER.y, 70, 0xffad45, 0.1).setDepth(worldDepth(FRIEND_CAMP_CENTER.y) - 0.5);
    scene.tweens.add({ targets: glow, alpha: { from: 0.06, to: 0.18 }, scale: { from: 0.94, to: 1.06 }, duration: 1300, yoyo: true, repeat: -1 });
  }
}

function drawFestivalIdentity(scene: Phaser.Scene, profile: VisualProfile): void {
  const floor = scene.add.graphics().setDepth(4.78);
  floor.fillStyle(0x423b34, 0.58).fillRoundedRect(1530, 650, 330, 170, 18);
  for (let row = 0; row < 5; row += 1) for (let column = 0; column < 9; column += 1) floor.fillStyle((row + column) % 3 === 0 ? 0xd85f58 : (row + column) % 2 ? 0x5da59b : 0xe4b34f, 0.25).fillRect(1545 + column * 34, 665 + row * 27, 27, 20);
  drawBunting(scene, 1450, 350, 1905, 350, 18);
  drawSpeaker(scene, 1475, 570);
  drawSpeaker(scene, 1840, 570);
  drawCrateStack(scene, 1500, 850, 5);
  drawPalletLounge(scene, 1750, 870);
  drawFlag(scene, 1880, 885, 0xd26057, 'FESTWIESE');
  if (profile.tier === 'cinematic') drawLampChain(scene, 1450, 375, 1905, 375, 20);
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
  for (let index = 0; index < 16; index += 1) footprints.fillStyle(0x7f6847, 0.38).fillEllipse(1985 + index * 9, 560 + index * 22, 6, 12).fillEllipse(1996 + index * 9, 569 + index * 22, 5, 10);
  if (profile.tier === 'cinematic') for (let index = 0; index < 12; index += 1) {
    const shimmer = scene.add.rectangle(2290 + index * 22, 260 + (index % 4) * 155, 30, 3, 0xd8fff4, 0.2).setDepth(5.1);
    scene.tweens.add({ targets: shimmer, x: shimmer.x + 35, alpha: { from: 0.08, to: 0.55 }, duration: 1200 + index * 80, yoyo: true, repeat: -1 });
  }
}

function drawServiceYard(scene: Phaser.Scene, profile: VisualProfile): void {
  drawWheelbarrow(scene, 1540, 1415);
  drawTireStack(scene, 1480, 1580);
  drawToolRack(scene, 1665, 1485);
  drawCrateStack(scene, 1790, 1670, 4);
  drawWoodPile(scene, 1830, 1690);
  drawFlag(scene, 1790, 1160, 0x63815b, 'SERVICE');
  scene.add.ellipse(1575, 1610, 95, 32, 0x252922, 0.24).setDepth(4.76);
  if (profile.tier === 'cinematic') for (let index = 0; index < 8; index += 1) {
    const leaf = scene.add.ellipse(1440 + index * 62, 1110 + index * 67, 10, 5, index % 2 ? 0xa36c3e : 0x75834a, 0.65).setDepth(5.2);
    scene.tweens.add({ targets: leaf, x: leaf.x + 16, y: leaf.y + 8, angle: 120, duration: 2200 + index * 120, yoyo: true, repeat: -1 });
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
  if (profile.tier === 'cinematic') for (const [x, y] of [[1995, 1375], [2070, 1455], [2140, 1455]] as const) {
    const glow = scene.add.circle(x, y - 18, 28, 0xffd77c, 0.08).setDepth(worldDepth(y) - 0.2);
    scene.tweens.add({ targets: glow, alpha: { from: 0.05, to: 0.22 }, duration: 1100 + x % 300, yoyo: true, repeat: -1 });
  }
}

function drawCampfire(scene: Phaser.Scene, x: number, y: number): void {
  const g = scene.add.graphics().setDepth(worldDepth(y + 35));
  for (let index = 0; index < 12; index += 1) {
    const angle = index / 12 * Math.PI * 2;
    g.fillStyle(index % 2 ? 0x8b8175 : 0xb0a38e).fillCircle(x + Math.cos(angle) * 32, y + Math.sin(angle) * 18, 8);
  }
  g.fillStyle(0x6b321f).fillEllipse(x, y, 46, 23).fillStyle(0xf6a53b).fillTriangle(x, y - 25, x - 17, y + 9, x + 18, y + 9)
    .fillStyle(0xffdf73).fillTriangle(x + 2, y - 15, x - 8, y + 8, x + 12, y + 8);
}

function drawCableRoute(scene: Phaser.Scene, from: { x: number; y: number }, to: { x: number; y: number }): void {
  const g = scene.add.graphics().setDepth(4.81);
  g.lineStyle(6, 0x2a2926, 0.72).beginPath().moveTo(from.x, from.y).lineTo(from.x + 28, from.y - 12).lineTo(to.x - 20, to.y + 15).lineTo(to.x, to.y).strokePath();
  g.fillStyle(0xd15e4e).fillCircle(from.x, from.y, 21).fillStyle(0x292d2a).fillCircle(from.x, from.y, 9).lineStyle(3, 0xe7d59c, 0.7).strokeCircle(from.x, from.y, 21);
}

function drawSupplySign(scene: Phaser.Scene, x: number, y: number, label: string): void {
  scene.add.text(x, y, label, { fontFamily: 'Arial Black, system-ui', fontSize: '8px', color: '#fff0ba', backgroundColor: '#173027cc', padding: { x: 5, y: 2 } }).setOrigin(0.5).setDepth(worldDepth(y));
}

function drawFlag(scene: Phaser.Scene, x: number, y: number, color: number, label: string): void {
  const g = scene.add.graphics().setDepth(worldDepth(y + 65));
  g.lineStyle(5, 0x5b4631).lineBetween(x, y, x, y + 68).fillStyle(color).fillTriangle(x + 2, y + 4, x + 72, y + 18, x + 2, y + 34);
  scene.add.text(x + 28, y + 16, label, { fontFamily: 'Arial Black, system-ui', fontSize: '8px', color: '#fff5d1' }).setOrigin(0.5).setDepth(worldDepth(y + 66) + 0.1);
}

function drawBikeRack(scene: Phaser.Scene, x: number, y: number): void { const g = scene.add.graphics().setDepth(worldDepth(y + 55)); for (let i = 0; i < 4; i += 1) { const bx = x + i * 32; g.lineStyle(4, 0x6e7472).strokeCircle(bx, y + 25, 15).strokeCircle(bx + 24, y + 25, 15).lineBetween(bx, y + 25, bx + 12, y + 5).lineBetween(bx + 12, y + 5, bx + 24, y + 25); } }
function drawPlanter(scene: Phaser.Scene, x: number, y: number, flower: number): void { const g = scene.add.graphics().setDepth(worldDepth(y + 35)); g.fillStyle(0x8b5f3c).fillRoundedRect(x - 22, y + 5, 44, 20, 5).fillStyle(0x365d3d).fillEllipse(x, y + 3, 55, 20); for (let i = 0; i < 5; i += 1) g.fillStyle(i % 2 ? flower : 0xf4d47b).fillCircle(x - 16 + i * 8, y - 2 + i % 2 * 5, 4); }
function drawAwning(scene: Phaser.Scene, x: number, y: number, width: number, height: number, color: number): void { const g = scene.add.graphics().setDepth(worldDepth(y + height)); g.fillStyle(color, 0.72).fillRoundedRect(x, y, width, height, 12).lineStyle(4, 0x4e4436).lineBetween(x, y + height, x, y + height + 45).lineBetween(x + width, y + height, x + width, y + height + 45); }
function drawFlowerBox(scene: Phaser.Scene, x: number, y: number, color: number): void { const g = scene.add.graphics().setDepth(worldDepth(y + 25)); g.fillStyle(0x865c38).fillRoundedRect(x - 38, y, 76, 18, 4); for (let i = 0; i < 8; i += 1) g.fillStyle(i % 2 ? color : 0xf3cf62).fillCircle(x - 30 + i * 9, y - 2 - i % 3 * 4, 4); }
function drawChair(scene: Phaser.Scene, x: number, y: number, color: number): void { const g = scene.add.graphics().setDepth(worldDepth(y + 45)); g.lineStyle(5, 0x443a30).lineBetween(x - 18, y + 4, x - 9, y + 34).lineBetween(x + 18, y + 4, x + 9, y + 34).fillStyle(color).fillRoundedRect(x - 18, y - 26, 36, 31, 5).fillRoundedRect(x - 21, y + 1, 42, 12, 4); }
function drawCrateStack(scene: Phaser.Scene, x: number, y: number, count: number): void { const g = scene.add.graphics().setDepth(worldDepth(y + 55)); for (let i = 0; i < count; i += 1) { const cx = x + i % 2 * 34; const cy = y - Math.floor(i / 2) * 26; g.fillStyle(i % 2 ? 0x9d342f : 0x3c7458).fillRoundedRect(cx, cy, 31, 24, 4).lineStyle(2, 0xf0d49c, 0.45).strokeRoundedRect(cx, cy, 31, 24, 4); } }
function drawCampingTable(scene: Phaser.Scene, x: number, y: number): void { const g = scene.add.graphics().setDepth(worldDepth(y + 45)); g.fillStyle(0xb69263).fillRoundedRect(x, y, 95, 20, 5).lineStyle(5, 0x4c4134).lineBetween(x + 12, y + 18, x + 5, y + 55).lineBetween(x + 82, y + 18, x + 90, y + 55); }
function drawBunting(scene: Phaser.Scene, x1: number, y1: number, x2: number, y2: number, count: number): void { const g = scene.add.graphics().setDepth(worldDepth(Math.max(y1, y2) + 30)); g.lineStyle(2, 0x4a3e31).lineBetween(x1, y1, x2, y2); const colors = [0xef6b61, 0xf2c758, 0x5db5a5, 0x659dcb, 0xb77ac5]; for (let i = 0; i < count; i += 1) { const p = (i + 0.5) / count; const x = Phaser.Math.Linear(x1, x2, p); const y = Phaser.Math.Linear(y1, y2, p) + Math.sin(p * Math.PI) * 14; g.fillStyle(colors[i % colors.length]).fillTriangle(x - 8, y, x + 8, y, x, y + 18); } }
function drawLampChain(scene: Phaser.Scene, x1: number, y1: number, x2: number, y2: number, count: number): void { const cable = scene.add.graphics().setDepth(worldDepth(Math.max(y1, y2) + 35)); cable.lineStyle(2, 0x3f372e).lineBetween(x1, y1, x2, y2); for (let i = 0; i <= count; i += 1) { const p = i / count; const x = Phaser.Math.Linear(x1, x2, p); const y = Phaser.Math.Linear(y1, y2, p) + Math.sin(p * Math.PI) * 13; const bulb = scene.add.circle(x, y + 5, 4.2, i % 3 === 0 ? 0xef765e : i % 2 ? 0x69c9b6 : 0xf4cc61, 0.88).setDepth(worldDepth(y + 40)); scene.tweens.add({ targets: bulb, alpha: { from: 0.5, to: 1 }, duration: 800 + i * 40, yoyo: true, repeat: -1 }); } }
function drawSpeaker(scene: Phaser.Scene, x: number, y: number): void { const g = scene.add.graphics().setDepth(worldDepth(y + 90)); g.fillStyle(0x202429).fillRoundedRect(x, y, 55, 88, 6).fillStyle(0x0d1013).fillCircle(x + 27, y + 27, 14).fillCircle(x + 27, y + 62, 19); }
function drawPalletLounge(scene: Phaser.Scene, x: number, y: number): void { const g = scene.add.graphics().setDepth(worldDepth(y + 65)); for (let i = 0; i < 5; i += 1) g.fillStyle(i % 2 ? 0x9e754c : 0xb98a58).fillRect(x, y + i * 8, 115, 6); g.fillStyle(0x638db0).fillRoundedRect(x + 8, y - 18, 45, 28, 6).fillStyle(0xd76b5f).fillRoundedRect(x + 60, y - 18, 45, 28, 6); }
function drawUmbrella(scene: Phaser.Scene, x: number, y: number, color: number): void { const g = scene.add.graphics().setDepth(worldDepth(y + 85)); g.fillStyle(color).fillCircle(x, y, 38).fillStyle(0xf3e9cd, 0.86).fillTriangle(x, y - 38, x, y, x + 35, y - 13).fillTriangle(x, y - 38, x - 35, y - 13, x, y).lineStyle(5, 0x715138).lineBetween(x, y, x, y + 82); }
function drawTowel(scene: Phaser.Scene, x: number, y: number, color: number): void { scene.add.rectangle(x + 32, y + 13, 64, 26, color, 0.9).setDepth(4.8); }
function drawLifebuoy(scene: Phaser.Scene, x: number, y: number): void { const g = scene.add.graphics().setDepth(worldDepth(y + 55)); g.fillStyle(0xe9675f).fillCircle(x, y, 24).fillStyle(0xf5eddc).fillCircle(x, y, 14).fillStyle(0xe9675f).fillCircle(x, y, 7).lineStyle(4, 0x72513a).lineBetween(x, y + 24, x, y + 58); }
function drawBeachBag(scene: Phaser.Scene, x: number, y: number): void { const g = scene.add.graphics().setDepth(worldDepth(y + 35)); g.fillStyle(0xc58a52).fillRoundedRect(x, y, 40, 31, 7).lineStyle(4, 0x5d4734).strokeEllipse(x + 20, y + 3, 24, 17); }
function drawWheelbarrow(scene: Phaser.Scene, x: number, y: number): void { const g = scene.add.graphics().setDepth(worldDepth(y + 55)); g.fillStyle(0x58755f).fillTriangle(x, y, x + 70, y + 5, x + 54, y + 38).lineStyle(5, 0x4b3d31).lineBetween(x + 8, y + 12, x - 20, y - 8).lineBetween(x + 58, y + 30, x + 85, y + 52).fillStyle(0x282c2a).fillCircle(x + 18, y + 42, 14); }
function drawTireStack(scene: Phaser.Scene, x: number, y: number): void { const g = scene.add.graphics().setDepth(worldDepth(y + 60)); for (let i = 0; i < 3; i += 1) g.fillStyle(0x252827).fillEllipse(x, y - i * 15, 65, 25).fillStyle(0x606663).fillEllipse(x, y - i * 15, 28, 10); }
function drawToolRack(scene: Phaser.Scene, x: number, y: number): void { const g = scene.add.graphics().setDepth(worldDepth(y + 80)); g.fillStyle(0x6d4d34).fillRoundedRect(x, y, 100, 70, 5); for (let i = 0; i < 5; i += 1) g.lineStyle(4, i % 2 ? 0xb8b3a7 : 0x414b47).lineBetween(x + 14 + i * 18, y + 14, x + 14 + i * 18, y + 55); }
function drawWoodPile(scene: Phaser.Scene, x: number, y: number): void { const g = scene.add.graphics().setDepth(worldDepth(y + 60)); for (let r = 0; r < 4; r += 1) for (let c = 0; c < 5; c += 1) g.fillStyle(r % 2 ? 0x8f613f : 0xa7774d).fillCircle(x + c * 23 + r % 2 * 8, y + r * 16, 10).fillStyle(0x3f2d22).fillCircle(x + c * 23 + r % 2 * 8, y + r * 16, 3); }
function drawLantern(scene: Phaser.Scene, x: number, y: number): void { const g = scene.add.graphics().setDepth(worldDepth(y + 45)); g.fillStyle(0x503a29).fillRect(x - 3, y, 6, 45).fillStyle(0xffd77c).fillCircle(x, y - 5, 8); }
function drawStoneCircle(scene: Phaser.Scene, x: number, y: number): void { const g = scene.add.graphics().setDepth(worldDepth(y + 30)); for (let i = 0; i < 12; i += 1) { const a = i / 12 * Math.PI * 2; g.fillStyle(i % 2 ? 0x777d75 : 0x9a9587).fillEllipse(x + Math.cos(a) * 55, y + Math.sin(a) * 28, 18, 11); } }
function drawDriftwood(scene: Phaser.Scene, x: number, y: number): void { const g = scene.add.graphics().setDepth(worldDepth(y + 30)); g.lineStyle(10, 0x6b4a31).lineBetween(x, y, x + 85, y + 30).lineStyle(4, 0x8f6742).lineBetween(x + 28, y + 10, x + 10, y - 15).lineBetween(x + 60, y + 21, x + 80, y - 2); }

import Phaser from 'phaser';
import { colorShade, seededFraction, type VisualProfile } from './visuals';
import { EXPANDED_WORLD_OBJECTS, type ExpandedWorldObject } from './worldV2';
import { worldDepth } from './worldRealism';

export function drawDetailedWorldObjects(scene: Phaser.Scene, profile: VisualProfile): void {
  EXPANDED_WORLD_OBJECTS.forEach((object, index) => drawObjectDetails(scene, object, index, profile));
}

function drawObjectDetails(
  scene: Phaser.Scene,
  object: ExpandedWorldObject,
  index: number,
  profile: VisualProfile,
): void {
  const g = scene.add.graphics().setDepth(worldDepth(object.y + object.height) + 0.34);
  switch (object.kind) {
    case 'tree': drawTreeDetails(scene, g, object, index, profile); break;
    case 'building': drawBuildingDetails(g, object); break;
    case 'kiosk': drawKioskDetails(g, object); break;
    case 'tent': drawTentDetails(g, object); break;
    case 'party-tent': drawPartyTentDetails(g, object); break;
    case 'camper': drawCamperDetails(g, object); break;
    case 'stage': drawStageDetails(g, object); break;
    case 'dock': drawDockDetails(g, object); break;
    case 'fence': drawFenceDetails(g, object); break;
    case 'table':
    case 'bench': drawFurnitureDetails(g, object); break;
    case 'sign': drawSignDetails(g, object); break;
    case 'rock': drawRockDetails(g, object); break;
    case 'lantern': drawLanternDetails(g, object); break;
    case 'flowerbed': drawFlowerbedDetails(g, object, profile); break;
  }
}

function drawTreeDetails(
  scene: Phaser.Scene,
  g: Phaser.GameObjects.Graphics,
  object: ExpandedWorldObject,
  index: number,
  profile: VisualProfile,
): void {
  const { x, y, width: w, height: h } = object;
  const trunkX = x + w * 0.5;
  const branchY = y + h * 0.53;
  const branchCount = profile.tier === 'cinematic' ? 9 : 6;

  g.lineStyle(Math.max(2, w * 0.035), 0x4b301e, 0.9);
  for (let branch = 0; branch < branchCount; branch += 1) {
    const side = branch % 2 ? 1 : -1;
    const startY = branchY - branch * h * 0.035;
    const endX = trunkX + side * w * (0.18 + seededFraction(`${object.id}-branch-x`, branch) * 0.27);
    const endY = y + h * (0.2 + seededFraction(`${object.id}-branch-y`, branch) * 0.28);
    g.lineBetween(trunkX + side * w * 0.015, startY, endX, endY);
    g.lineStyle(Math.max(1.2, w * 0.018), 0x70482a, 0.76)
      .lineBetween(endX, endY, endX + side * w * 0.12, endY - h * 0.08);
    g.lineStyle(Math.max(2, w * 0.035), 0x4b301e, 0.9);
  }

  g.lineStyle(2, 0x271a12, 0.55);
  for (let bark = 0; bark < 7; bark += 1) {
    const bx = trunkX - w * 0.055 + (bark % 3) * w * 0.04;
    const by = y + h * 0.55 + bark * h * 0.055;
    g.lineBetween(bx, by, bx + (bark % 2 ? 5 : -4), by + h * 0.035);
  }

  const leafCount = profile.tier === 'cinematic' ? 72 : 38;
  const leafTones = [0x1f4b2c, 0x2f6439, 0x477a43, 0x668f50, 0x86a95d, 0xb2c878];
  for (let leaf = 0; leaf < leafCount; leaf += 1) {
    const angle = seededFraction(`${object.id}-leaf-angle`, leaf) * Math.PI * 2;
    const radiusX = w * (0.12 + seededFraction(`${object.id}-leaf-rx`, leaf) * 0.42);
    const radiusY = h * (0.05 + seededFraction(`${object.id}-leaf-ry`, leaf) * 0.23);
    const lx = trunkX + Math.cos(angle) * radiusX;
    const ly = y + h * 0.25 + Math.sin(angle) * radiusY;
    const leafShape = scene.add.ellipse(
      lx,
      ly,
      5 + (leaf % 4) * 1.4,
      9 + (leaf % 3) * 1.8,
      leafTones[(leaf + index) % leafTones.length],
      0.82,
    ).setAngle((angle * 180 / Math.PI) + leaf % 30).setDepth(g.depth + 0.02);
    if (profile.foliageMotion && leaf % 12 === 0) {
      scene.tweens.add({ targets: leafShape, angle: leafShape.angle + 10, x: lx + 2, duration: 2300 + leaf * 18, yoyo: true, repeat: -1 });
    }
  }

  for (let knot = 0; knot < 3; knot += 1) {
    g.fillStyle(0x2f2118, 0.75).fillEllipse(trunkX + (knot - 1) * w * 0.035, y + h * (0.64 + knot * 0.09), 6, 9);
  }
}

function drawBuildingDetails(g: Phaser.GameObjects.Graphics, object: ExpandedWorldObject): void {
  const { x, y, width: w, height: h } = object;
  const roofY = y + 12;
  g.lineStyle(2, 0xf0d8ad, 0.32);
  for (let row = 0; row < 5; row += 1) {
    const inset = 16 + row * 14;
    g.lineBetween(x + inset, roofY - row * 9, x + w - inset, roofY - row * 9);
  }
  g.lineStyle(2, 0x4b3c31, 0.42);
  for (let siding = y + 32; siding < y + h - 15; siding += 18) g.lineBetween(x + 8, siding, x + w - 8, siding);

  g.lineStyle(4, 0x555f5b, 0.85).lineBetween(x + 5, y + 18, x + w - 5, y + 18)
    .lineBetween(x + w - 9, y + 18, x + w - 9, y + h - 12);
  g.fillStyle(0x393e3c, 0.9).fillRoundedRect(x + w - 14, y + h - 22, 10, 19, 3);

  for (const windowX of [x + 44, x + w - 44]) {
    g.lineStyle(2, 0xd9edf1, 0.68).lineBetween(windowX - 20, y + 66, windowX + 20, y + 66)
      .lineBetween(windowX, y + 47, windowX, y + 84);
  }
  g.fillStyle(0xf3c75d, 0.9).fillCircle(x + w / 2 + 16, y + h - 34, 3.2);
}

function drawKioskDetails(g: Phaser.GameObjects.Graphics, object: ExpandedWorldObject): void {
  const { x, y, width: w, height: h } = object;
  g.lineStyle(2, 0x60462f, 0.55);
  for (let board = x + 10; board < x + w - 5; board += 17) g.lineBetween(board, y + 37, board, y + h - 14);
  g.fillStyle(0xf0e5c6, 0.9).fillRoundedRect(x + 22, y + h - 42, w - 44, 10, 3);
  for (let bottle = 0; bottle < Math.max(3, Math.floor(w / 35)); bottle += 1) {
    const bx = x + 32 + bottle * 27;
    g.fillStyle(bottle % 2 ? 0x3f7658 : 0x9a3f35).fillRoundedRect(bx, y + h - 61, 8, 21, 3)
      .fillStyle(0xd9c47b).fillRect(bx + 2, y + h - 65, 4, 5);
  }
  g.lineStyle(3, 0x3f3227, 0.72).strokeRoundedRect(x + 8, y + 8, w - 16, h - 15, 7);
}

function drawTentDetails(g: Phaser.GameObjects.Graphics, object: ExpandedWorldObject): void {
  const { x, y, width: w, height: h, color = 0x6c8fc9 } = object;
  g.lineStyle(2.5, colorShade(color, 1.32), 0.65)
    .lineBetween(x + w / 2, y + 7, x + w * 0.22, y + h - 4)
    .lineBetween(x + w / 2, y + 7, x + w * 0.78, y + h - 4);
  g.lineStyle(2, 0x1d2c29, 0.72).lineBetween(x + w / 2, y + h * 0.43, x + w / 2, y + h - 2);
  g.fillStyle(0x20312e, 0.88).fillRoundedRect(x + w * 0.39, y + h * 0.55, w * 0.22, h * 0.36, 5);
  g.lineStyle(1.5, 0xf2e4bf, 0.55).strokeRoundedRect(x + w * 0.42, y + h * 0.19, w * 0.16, h * 0.12, 6);
  for (const pegX of [x - 8, x + w + 8]) {
    g.lineStyle(1.5, 0xf0e1bb, 0.7).lineBetween(x + w / 2, y + 3, pegX, y + h + 8)
      .fillStyle(0x4c392a, 0.95).fillRect(pegX - 2, y + h + 4, 4, 12);
  }
  g.fillStyle(0xf0d36b, 0.85).fillCircle(x + w * 0.58, y + h * 0.67, 2.4);
}

function drawPartyTentDetails(g: Phaser.GameObjects.Graphics, object: ExpandedWorldObject): void {
  const { x, y, width: w, height: h } = object;
  g.lineStyle(2.5, 0xf7e9c6, 0.55);
  for (let seam = 1; seam < 8; seam += 1) {
    const sx = x + seam * w / 8;
    g.lineBetween(x + w / 2, y - 7, sx, y + 58);
  }
  for (const ropeX of [x - 18, x + w + 18]) {
    g.lineStyle(2, 0xeee0bb, 0.65).lineBetween(x + w / 2, y - 8, ropeX, y + h + 14)
      .fillStyle(0x4b3829).fillRect(ropeX - 3, y + h + 7, 6, 16);
  }
  g.lineStyle(2, 0x5d4a36, 0.75).lineBetween(x + 40, y + h - 24, x + w - 40, y + h - 24);
}

function drawCamperDetails(g: Phaser.GameObjects.Graphics, object: ExpandedWorldObject): void {
  const { x, y, width: w, height: h } = object;
  g.lineStyle(2, 0x9b9c91, 0.52).strokeRoundedRect(x + 8, y + 8, w - 16, h - 12, 13);
  for (let panel = x + 22; panel < x + w - 10; panel += 42) g.lineBetween(panel, y + 10, panel, y + h - 18);
  g.lineStyle(2, 0xd8f1f2, 0.72);
  for (const wx of [x + 55, x + w - 55]) {
    g.strokeRoundedRect(wx - 25, y + 21, 50, 36, 5).lineBetween(wx, y + 23, wx, y + 55);
  }
  g.fillStyle(0xd8d3c1).fillRoundedRect(x + w / 2 + 13, y + 42, 7, 18, 3)
    .fillStyle(0xf3c75d).fillCircle(x + 16, y + h * 0.67, 5)
    .fillStyle(0xe5544c).fillCircle(x + w - 16, y + h * 0.67, 5)
    .fillStyle(0xe8e2ca).fillRoundedRect(x + w / 2 - 25, y + h - 19, 50, 12, 3);
  g.lineStyle(2, 0x3e4643, 0.75).lineBetween(x + 18, y - 5, x + w - 18, y - 5);
}

function drawStageDetails(g: Phaser.GameObjects.Graphics, object: ExpandedWorldObject): void {
  const { x, y, width: w, height: h } = object;
  g.lineStyle(3, 0x697176, 0.85);
  for (let column = x + 18; column < x + w - 5; column += 46) {
    g.lineBetween(column, y + 5, column + 34, y + 38).lineBetween(column + 34, y + 5, column, y + 38);
  }
  g.lineStyle(2, 0x4b352d, 0.78);
  for (let plank = y + h - 55; plank < y + h - 8; plank += 12) g.lineBetween(x + 25, plank, x + w - 25, plank);
  for (const side of [x + 34, x + w - 78]) {
    g.fillStyle(0x11151a, 0.95).fillRoundedRect(side, y + 65, 44, 74, 5)
      .fillStyle(0x040506).fillCircle(side + 22, y + 87, 12).fillCircle(side + 22, y + 121, 16);
  }
  g.lineStyle(3, 0x22262b, 0.85).lineBetween(x + w / 2, y + 46, x + w / 2, y + h - 18);
}

function drawDockDetails(g: Phaser.GameObjects.Graphics, object: ExpandedWorldObject): void {
  const { x, y, width: w, height: h } = object;
  g.lineStyle(1.5, 0xd6ad73, 0.52);
  for (let plank = x + 7; plank < x + w; plank += 18) {
    g.lineBetween(plank, y + 3, plank, y + h - 3);
    g.fillStyle(0x2d251e, 0.82).fillCircle(plank + 3, y + 7, 2).fillCircle(plank + 3, y + h - 7, 2);
  }
  g.lineStyle(2, 0x4a3324, 0.4);
  for (let grain = 0; grain < Math.max(2, Math.floor(w / 60)); grain += 1) {
    const gx = x + 16 + grain * 52;
    g.lineBetween(gx, y + h * 0.35, gx + 25, y + h * 0.44);
  }
}

function drawFenceDetails(g: Phaser.GameObjects.Graphics, object: ExpandedWorldObject): void {
  const { x, y, width: w, height: h } = object;
  g.lineStyle(1.5, 0x3d2c20, 0.5);
  for (let post = x; post <= x + w; post += 48) {
    g.lineBetween(post + 3, y - 9, post + 7, y + h + 8);
    g.fillStyle(0x31251c, 0.72).fillCircle(post + 5, y + 7, 2).fillCircle(post + 5, y + h - 6, 2);
  }
  if (h > 30) {
    g.lineStyle(1.2, 0xaeb2a6, 0.35);
    for (let wire = y + 12; wire < y + h; wire += 14) g.lineBetween(x, wire, x + w, wire);
  }
}

function drawFurnitureDetails(g: Phaser.GameObjects.Graphics, object: ExpandedWorldObject): void {
  const { x, y, width: w, height: h } = object;
  g.lineStyle(2, 0xc08a55, 0.62);
  for (let plank = y + 5; plank < y + h; plank += Math.max(7, h / 3)) g.lineBetween(x + 5, plank, x + w - 5, plank);
  for (const screwX of [x + 12, x + w - 12]) {
    g.fillStyle(0x343633, 0.86).fillCircle(screwX, y + h * 0.3, 2).fillCircle(screwX, y + h * 0.7, 2);
  }
}

function drawSignDetails(g: Phaser.GameObjects.Graphics, object: ExpandedWorldObject): void {
  const { x, y, width: w, height: h } = object;
  g.lineStyle(1.5, 0x725638, 0.6);
  for (let grain = 0; grain < 4; grain += 1) {
    const gy = y + 10 + grain * Math.max(5, h * 0.11);
    g.lineBetween(x + 7, gy, x + w - 7, gy + (grain % 2 ? 2 : -2));
  }
  g.fillStyle(0x5c442e, 0.9).fillCircle(x + 10, y + 10, 2.4).fillCircle(x + w - 10, y + 10, 2.4);
}

function drawRockDetails(g: Phaser.GameObjects.Graphics, object: ExpandedWorldObject): void {
  const { x, y, width: w, height: h } = object;
  g.lineStyle(2, 0x464a46, 0.65)
    .lineBetween(x + w * 0.32, y + h * 0.22, x + w * 0.46, y + h * 0.5)
    .lineBetween(x + w * 0.46, y + h * 0.5, x + w * 0.34, y + h * 0.78)
    .lineBetween(x + w * 0.46, y + h * 0.5, x + w * 0.7, y + h * 0.67);
  g.fillStyle(0xa8b29c, 0.34).fillEllipse(x + w * 0.4, y + h * 0.26, w * 0.22, h * 0.12);
}

function drawLanternDetails(g: Phaser.GameObjects.Graphics, object: ExpandedWorldObject): void {
  const { x, y, width: w } = object;
  const cx = x + w / 2;
  g.lineStyle(2, 0x4a3b2c, 0.85).strokeRoundedRect(cx - 10, y + 2, 20, 25, 4)
    .lineBetween(cx - 10, y + 14, cx + 10, y + 14)
    .lineBetween(cx, y - 5, cx, y + 2);
}

function drawFlowerbedDetails(g: Phaser.GameObjects.Graphics, object: ExpandedWorldObject, profile: VisualProfile): void {
  const { x, y, width: w, height: h } = object;
  const leaves = profile.tier === 'cinematic' ? Math.max(8, Math.floor(w / 8)) : Math.max(5, Math.floor(w / 13));
  for (let index = 0; index < leaves; index += 1) {
    const lx = x + 8 + seededFraction(`${object.id}-flower-leaf-x`, index) * (w - 16);
    const ly = y + h * 0.25 + seededFraction(`${object.id}-flower-leaf-y`, index) * h * 0.45;
    g.fillStyle(index % 2 ? 0x386643 : 0x557b48, 0.85).fillEllipse(lx, ly, 8, 15);
    g.lineStyle(1.2, 0x234a30, 0.55).lineBetween(lx, ly + 6, lx, ly - 6);
  }
}

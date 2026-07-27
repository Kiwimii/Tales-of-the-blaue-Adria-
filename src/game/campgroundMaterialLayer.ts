import Phaser from 'phaser';
import { BLUEPRINT_NODES, BLUEPRINT_ROADS } from './campgroundBlueprint';
import { seededFraction, type VisualProfile } from './visuals';

export function drawCampgroundMaterialTextures(scene: Phaser.Scene, profile: VisualProfile): void {
  const g = scene.add.graphics().setDepth(4.575);
  for (const road of BLUEPRINT_ROADS) {
    const from = BLUEPRINT_NODES[road.from];
    const to = BLUEPRINT_NODES[road.to];
    const horizontal = from.y === to.y;
    const length = Phaser.Math.Distance.Between(from.x, from.y, to.x, to.y);
    const samples = Math.max(5, Math.round(length / (profile.tier === 'cinematic' ? 28 : 42)));

    for (let index = 0; index < samples; index += 1) {
      const t = (index + 0.35 + seededFraction(`${road.id}-material-t`, index) * 0.3) / samples;
      const centerX = Phaser.Math.Linear(from.x, to.x, t);
      const centerY = Phaser.Math.Linear(from.y, to.y, t);
      const lateral = (seededFraction(`${road.id}-material-l`, index) - 0.5) * Math.max(8, road.width - 18);
      const x = centerX + (horizontal ? 0 : lateral);
      const y = centerY + (horizontal ? lateral : 0);

      if (road.surface === 'asphalt') drawAsphaltMark(g, x, y, horizontal, index);
      else if (road.surface === 'gravel') drawGravelMark(g, x, y, horizontal, index);
      else drawSandMark(g, x, y, horizontal, index);
    }

    drawRoadEdges(g, road.surface, from.x, from.y, to.x, to.y, road.width);
  }
}

function drawAsphaltMark(
  g: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  horizontal: boolean,
  index: number,
): void {
  if (index % 5 === 0) {
    const w = horizontal ? 34 + index % 4 * 7 : 13 + index % 3 * 4;
    const h = horizontal ? 13 + index % 3 * 4 : 34 + index % 4 * 7;
    g.fillStyle(0x4f5553, 0.34).fillRoundedRect(x - w / 2, y - h / 2, w, h, 5)
      .lineStyle(2, 0x9a9f9c, 0.22).strokeRoundedRect(x - w / 2, y - h / 2, w, h, 5);
    return;
  }

  const main = 10 + index % 4 * 3;
  g.lineStyle(1.8, 0x303635, 0.5);
  if (horizontal) {
    g.lineBetween(x - main, y, x, y + (index % 2 ? 5 : -5))
      .lineBetween(x, y + (index % 2 ? 5 : -5), x + main, y + (index % 3 - 1) * 4);
  } else {
    g.lineBetween(x, y - main, x + (index % 2 ? 5 : -5), y)
      .lineBetween(x + (index % 2 ? 5 : -5), y, x + (index % 3 - 1) * 4, y + main);
  }
}

function drawGravelMark(
  g: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  horizontal: boolean,
  index: number,
): void {
  const tones = [0x6c5a3f, 0x8c7652, 0xc4ae7a, 0xddd0a4];
  for (let pebble = 0; pebble < 3; pebble += 1) {
    const shift = (pebble - 1) * 7;
    const px = x + (horizontal ? shift : (index + pebble) % 3 * 3 - 3);
    const py = y + (horizontal ? (index + pebble) % 3 * 3 - 3 : shift);
    g.fillStyle(tones[(index + pebble) % tones.length], 0.56)
      .fillEllipse(px, py, 5 + (index + pebble) % 4, 3 + pebble % 2);
  }
  if (index % 6 === 0) {
    g.lineStyle(2, 0x6d5d43, 0.23);
    if (horizontal) g.lineBetween(x - 18, y + 9, x + 20, y + 9);
    else g.lineBetween(x + 9, y - 18, x + 9, y + 20);
  }
}

function drawSandMark(
  g: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  horizontal: boolean,
  index: number,
): void {
  if (index % 3 === 0) {
    g.lineStyle(2.2, 0xb89e67, 0.44);
    if (horizontal) {
      g.strokeEllipse(x - 7, y - 2, 7, 13).strokeEllipse(x + 7, y + 6, 7, 13);
    } else {
      g.strokeEllipse(x - 3, y - 7, 13, 7).strokeEllipse(x + 6, y + 7, 13, 7);
    }
  } else {
    g.lineStyle(1.4, 0xf0ddb0, 0.38);
    if (horizontal) g.lineBetween(x - 12, y, x + 12, y + (index % 2 ? 2 : -2));
    else g.lineBetween(x, y - 12, x + (index % 2 ? 2 : -2), y + 12);
  }
}

function drawRoadEdges(
  g: Phaser.GameObjects.Graphics,
  surface: 'asphalt' | 'gravel' | 'sand',
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  width: number,
): void {
  const horizontal = y1 === y2;
  const offset = width / 2 - 5;
  const color = surface === 'asphalt' ? 0xc3c7bd : surface === 'gravel' ? 0x745f40 : 0xbca26c;
  const alpha = surface === 'asphalt' ? 0.28 : 0.23;
  g.lineStyle(surface === 'asphalt' ? 2.5 : 1.8, color, alpha);
  if (horizontal) {
    g.lineBetween(x1, y1 - offset, x2, y2 - offset).lineBetween(x1, y1 + offset, x2, y2 + offset);
  } else {
    g.lineBetween(x1 - offset, y1, x2 - offset, y2).lineBetween(x1 + offset, y1, x2 + offset, y2);
  }
}

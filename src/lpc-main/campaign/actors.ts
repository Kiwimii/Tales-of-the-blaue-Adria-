import Phaser from 'phaser';
import { LPC_LAYERS, type CharacterVisual } from '../content';

export type Facing = 'up' | 'left' | 'down' | 'right';
export type CampaignAnimation =
  | 'idle' | 'talk' | 'wave' | 'drink' | 'cheer' | 'stagger' | 'hit' | 'sit' | 'carry' | 'phone'
  | 'argue' | 'highfive' | 'flirt' | 'throw' | 'run' | 'pee' | 'collapse' | 'point' | 'shrug';

export const LPC_ASSET_KEYS = { body: 'campaign-lpc-body', head: 'campaign-lpc-head', face: 'campaign-lpc-face' } as const;
const WALK_FRAMES = 9;
const ROW: Record<Facing, number> = { up: 0, left: 1, down: 2, right: 3 };

export function preloadLpc(scene: Phaser.Scene): void {
  scene.load.setCORS('anonymous');
  scene.load.spritesheet(LPC_ASSET_KEYS.body, LPC_LAYERS.body, { frameWidth: 64, frameHeight: 64 });
  scene.load.spritesheet(LPC_ASSET_KEYS.head, LPC_LAYERS.head, { frameWidth: 64, frameHeight: 64 });
  scene.load.spritesheet(LPC_ASSET_KEYS.face, LPC_LAYERS.face, { frameWidth: 64, frameHeight: 64 });
}

export class ActorRig {
  readonly root: Phaser.GameObjects.Container;
  readonly label: Phaser.GameObjects.Text;
  readonly marker: Phaser.GameObjects.Arc;
  private body: Phaser.GameObjects.Sprite;
  private head: Phaser.GameObjects.Sprite;
  private face: Phaser.GameObjects.Sprite;
  private outfit: Phaser.GameObjects.Graphics;
  private hair: Phaser.GameObjects.Graphics;
  private accessory: Phaser.GameObjects.Graphics;
  private pose: Phaser.GameObjects.Graphics;
  private prop: Phaser.GameObjects.Graphics;
  private shadow: Phaser.GameObjects.Ellipse;
  private facing: Facing = 'down';
  private walkFrame = 1;
  private walkClock = 0;
  private animationToken = 0;
  private baseScaleX: number;
  private baseScaleY: number;
  private design: CharacterVisual;

  constructor(private readonly scene: Phaser.Scene, visual: CharacterVisual, withLabel = true) {
    this.design = { ...visual, accessories: [...visual.accessories] };
    this.body = scene.add.sprite(0, 0, LPC_ASSET_KEYS.body, 19).setOrigin(.5);
    this.head = scene.add.sprite(0, 0, LPC_ASSET_KEYS.head, 19).setOrigin(.5);
    this.face = scene.add.sprite(0, 0, LPC_ASSET_KEYS.face, 19).setOrigin(.5);
    this.outfit = scene.add.graphics();
    this.hair = scene.add.graphics();
    this.accessory = scene.add.graphics();
    this.pose = scene.add.graphics();
    this.prop = scene.add.graphics();
    this.shadow = scene.add.ellipse(visual.x, visual.y + 14, 39, 14, 0x07100d, .28);
    this.root = scene.add.container(visual.x, visual.y - 21, [this.body, this.head, this.face, this.outfit, this.hair, this.accessory, this.pose, this.prop]);
    this.baseScaleX = 1.48 * visual.scaleX;
    this.baseScaleY = 1.48 * visual.scaleY;
    this.root.setScale(this.baseScaleX, this.baseScaleY);
    this.label = scene.add.text(visual.x, visual.y + 44, withLabel ? visual.name : 'DU', {
      fontFamily: 'Arial Black, system-ui', fontSize: withLabel ? '12px' : '11px', color: '#fff4ce',
      backgroundColor: '#10261fe8', padding: { x: 7, y: 4 }, stroke: '#091712', strokeThickness: 2,
    }).setOrigin(.5);
    this.marker = scene.add.circle(visual.x, visual.y - 80, 17, 0xf2c35f, .12).setStrokeStyle(3, 0xffe49a, .95).setVisible(false);
    scene.tweens.add({ targets: this.marker, scale: { from: .86, to: 1.28 }, alpha: { from: .9, to: .1 }, duration: 780, repeat: -1 });
    this.redraw();
    this.setDepth(visual.y);
  }

  get id(): string { return this.design.id; }
  get x(): number { return this.root.x; }
  get y(): number { return this.root.y + 21; }
  get visual(): CharacterVisual { return this.design; }

  setPosition(x: number, y: number): void {
    this.root.setPosition(x, y - 21);
    this.shadow.setPosition(x, y + 14);
    this.label.setPosition(x, y + 44);
    this.marker.setPosition(x, y - 80);
    this.setDepth(y);
  }

  setDepth(y: number): void {
    this.shadow.setDepth(y - 2);
    this.root.setDepth(y);
    this.label.setDepth(y + 80);
    this.marker.setDepth(y + 81);
  }

  setMarker(active: boolean): void { this.marker.setVisible(active); }

  updateWalk(dx: number, dy: number, delta: number): void {
    if (Math.abs(dx) > Math.abs(dy)) this.setFacing(dx < 0 ? 'left' : 'right');
    else if (Math.abs(dy) > 0) this.setFacing(dy < 0 ? 'up' : 'down');
    if (dx || dy) {
      this.walkClock += delta;
      if (this.walkClock >= 82) { this.walkClock = 0; this.walkFrame = (this.walkFrame + 1) % WALK_FRAMES; }
      this.setFrame(ROW[this.facing] * WALK_FRAMES + this.walkFrame);
      this.shadow.setScale(1 + Math.sin(this.walkFrame / WALK_FRAMES * Math.PI * 2) * .035, 1);
    } else {
      this.walkFrame = 1; this.walkClock = 0;
      this.setFrame(ROW[this.facing] * WALK_FRAMES + 1);
      this.shadow.setScale(1);
    }
  }

  setFacing(facing: Facing): void {
    if (this.facing === facing) return;
    this.facing = facing;
    this.redraw();
  }

  applyProfile(profile: { bodyType: string; hairStyle: string; accessory: string; shirt: string; shorts: string; hair: string }): void {
    this.design.scaleX = profile.bodyType === 'breit' ? 1.16 : profile.bodyType === 'schmal' ? .9 : 1;
    this.design.hairStyle = profile.hairStyle === 'welle' ? 'wave' : profile.hairStyle === 'buzz' ? 'buzz' : profile.hairStyle === 'cap' ? 'cap' : 'short';
    this.design.shirt = parseHex(profile.shirt, this.design.shirt);
    this.design.shirtShade = shade(this.design.shirt, -34);
    this.design.trousers = parseHex(profile.shorts, this.design.trousers);
    this.design.hair = parseHex(profile.hair, this.design.hair);
    this.design.accessories = profile.accessory === 'brille' ? ['glasses'] : profile.accessory === 'bart' ? ['beard'] : profile.accessory === 'ohrring' ? ['earring'] : ['none'];
    this.baseScaleX = 1.48 * this.design.scaleX;
    this.baseScaleY = 1.48 * this.design.scaleY;
    this.root.setScale(this.baseScaleX, this.baseScaleY);
    this.redraw();
  }

  play(animation: CampaignAnimation, duration = defaultDuration(animation)): void {
    this.animationToken += 1;
    const token = this.animationToken;
    this.scene.tweens.killTweensOf(this.root);
    this.scene.tweens.killTweensOf(this.pose);
    this.scene.tweens.killTweensOf(this.prop);
    this.pose.clear(); this.prop.clear();
    this.root.setAngle(0).setScale(this.baseScaleX, this.baseScaleY);
    this.root.setPosition(this.root.x, this.y - 21);
    this.pose.setAlpha(1).setAngle(0).setPosition(0, 0);
    this.prop.setAlpha(1).setAngle(0).setPosition(0, 0);
    drawPose(this.pose, animation, this.design, this.facing);
    drawProp(this.prop, animation, this.design, this.facing);

    const bounce = (height: number, repeats = 1, speed = 170): void => {
      this.scene.tweens.add({ targets: this.root, y: this.root.y - height, duration: speed, yoyo: true, repeat: repeats, ease: 'Quad.easeOut' });
      this.scene.tweens.add({ targets: this.shadow, scaleX: .78, alpha: .16, duration: speed, yoyo: true, repeat: repeats });
    };
    if (animation === 'idle') {
      this.scene.tweens.add({ targets: this.root, scaleY: this.baseScaleY * 1.018, duration: 430, yoyo: true, repeat: 2 });
      this.scene.tweens.add({ targets: this.face, alpha: .12, duration: 85, yoyo: true, delay: 250, repeat: 1, repeatDelay: 470 });
    } else if (animation === 'talk') {
      this.scene.tweens.add({ targets: this.pose, angle: { from: -5, to: 7 }, duration: 170, yoyo: true, repeat: 4 });
      this.scene.tweens.add({ targets: this.root, y: this.root.y - 2, duration: 190, yoyo: true, repeat: 3 });
    } else if (animation === 'argue') {
      this.scene.tweens.add({ targets: this.pose, x: { from: -2, to: 5 }, angle: { from: -9, to: 11 }, duration: 135, yoyo: true, repeat: 6 });
      this.scene.cameras.main.shake(110, .0012);
    } else if (animation === 'wave') {
      this.scene.tweens.add({ targets: this.pose, angle: { from: -19, to: 27 }, duration: 145, yoyo: true, repeat: 5 });
    } else if (animation === 'highfive') {
      bounce(8, 0, 170); this.scene.tweens.add({ targets: this.pose, y: -8, angle: -12, duration: 190, yoyo: true, hold: 180 });
    } else if (animation === 'drink') {
      this.scene.tweens.add({ targets: this.prop, x: facingSign(this.facing) * -4, y: -17, angle: facingSign(this.facing) * -25, duration: 290, yoyo: true, hold: 360 });
      this.scene.tweens.add({ targets: this.root, angle: facingSign(this.facing) * -2.5, duration: 290, yoyo: true, hold: 300 });
    } else if (animation === 'cheer') bounce(15, 2, 175);
    else if (animation === 'stagger') {
      this.scene.tweens.add({ targets: this.root, angle: { from: -8, to: 9 }, x: this.root.x + 7, duration: 205, yoyo: true, repeat: 3 });
      this.scene.tweens.add({ targets: this.shadow, x: this.shadow.x + 4, scaleX: 1.15, duration: 205, yoyo: true, repeat: 3 });
    } else if (animation === 'hit') {
      this.body.setTint(0xff7564); this.head.setTint(0xff7564); this.face.setTint(0xff7564);
      this.scene.tweens.add({ targets: this.root, x: this.root.x - facingSign(this.facing) * 17, angle: -facingSign(this.facing) * 8, duration: 115, yoyo: true, repeat: 1 });
      this.scene.cameras.main.shake(120, .0026);
    } else if (animation === 'sit') {
      this.scene.tweens.add({ targets: this.root, scaleY: this.baseScaleY * .74, y: this.root.y + 11, duration: 220 });
      this.scene.tweens.add({ targets: this.shadow, scaleX: 1.25, alpha: .36, duration: 220 });
    } else if (animation === 'carry') this.scene.tweens.add({ targets: this.prop, y: { from: 1, to: -3 }, duration: 270, yoyo: true, repeat: 4 });
    else if (animation === 'phone') {
      this.scene.tweens.add({ targets: this.root, angle: -facingSign(this.facing) * 2.5, duration: 300, yoyo: true, repeat: 2 });
      this.scene.tweens.add({ targets: this.face, alpha: .2, duration: 80, yoyo: true, delay: 380, repeat: 1 });
    } else if (animation === 'flirt') {
      this.scene.tweens.add({ targets: this.root, scaleX: this.baseScaleX * 1.035, scaleY: this.baseScaleY * 1.035, duration: 230, yoyo: true, repeat: 2 });
      this.scene.tweens.add({ targets: this.prop, alpha: { from: .35, to: 1 }, y: { from: 4, to: -7 }, duration: 300, yoyo: true, repeat: 2 });
    } else if (animation === 'throw') {
      this.scene.tweens.add({ targets: this.pose, angle: { from: 28, to: -42 }, x: facingSign(this.facing) * 5, duration: 260, ease: 'Back.easeOut' });
      this.scene.tweens.add({ targets: this.prop, x: facingSign(this.facing) * 40, y: -18, alpha: 0, duration: 360, delay: 170 });
    } else if (animation === 'run') {
      bounce(5, 4, 90); this.scene.tweens.add({ targets: this.root, angle: facingSign(this.facing) * 5, duration: 90, yoyo: true, repeat: 7 });
    } else if (animation === 'pee') {
      this.scene.tweens.add({ targets: this.root, angle: facingSign(this.facing) * 3, duration: 350, yoyo: true, repeat: 2 });
      this.scene.tweens.add({ targets: this.prop, alpha: { from: .35, to: .9 }, duration: 180, yoyo: true, repeat: 5 });
    } else if (animation === 'collapse') {
      this.scene.tweens.add({ targets: this.root, angle: 86 * facingSign(this.facing), y: this.root.y + 18, duration: 420, ease: 'Bounce.easeOut' });
      this.scene.tweens.add({ targets: this.shadow, scaleX: 1.55, alpha: .38, duration: 420 });
    } else if (animation === 'point') {
      this.scene.tweens.add({ targets: this.pose, x: facingSign(this.facing) * 9, duration: 190, yoyo: true, repeat: 3 });
    } else if (animation === 'shrug') {
      this.scene.tweens.add({ targets: this.pose, y: -5, duration: 180, yoyo: true, repeat: 2 });
      this.scene.tweens.add({ targets: this.root, angle: { from: -2, to: 2 }, duration: 180, yoyo: true, repeat: 2 });
    }

    this.scene.time.delayedCall(duration, () => {
      if (token !== this.animationToken) return;
      this.pose.clear(); this.prop.clear();
      this.root.setAngle(0).setScale(this.baseScaleX, this.baseScaleY);
      this.body.clearTint(); this.head.clearTint(); this.face.clearTint();
      this.shadow.setScale(1).setAlpha(.28).setPosition(this.x, this.y + 14);
      this.setPosition(this.x, this.y);
      this.setFrame(ROW[this.facing] * WALK_FRAMES + 1);
    });
  }

  destroy(): void {
    this.root.destroy(true); this.label.destroy(); this.marker.destroy(); this.shadow.destroy();
  }

  private setFrame(frame: number): void { this.body.setFrame(frame); this.head.setFrame(frame); this.face.setFrame(frame); }

  private redraw(): void {
    this.outfit.clear(); this.hair.clear(); this.accessory.clear();
    drawOutfit(this.outfit, this.design, this.facing);
    drawHair(this.hair, this.design, this.facing);
    drawAccessory(this.accessory, this.design, this.facing);
  }
}

function drawOutfit(g: Phaser.GameObjects.Graphics, d: CharacterVisual, facing: Facing): void {
  const side = facing === 'left' || facing === 'right';
  const back = facing === 'up';
  const width = side ? 16 : 22;
  g.fillStyle(d.trousers).fillRoundedRect(-8, 7, 7, 15, 2).fillRoundedRect(1, 7, 7, 15, 2);
  g.fillStyle(0x151c1c, .82).fillRect(-8, 19, 7, 3).fillRect(1, 19, 7, 3);
  if (d.outfit === 'tank-top') {
    g.fillStyle(d.shirt).fillRoundedRect(-width / 2 + 2, -8, width - 4, 18, 4);
    g.lineStyle(1.5, d.shirtShade).lineBetween(-4, -6, -4, 8).lineBetween(4, -6, 4, 8);
  } else if (d.outfit === 'strict-jacket') {
    g.fillStyle(d.shirt).fillRoundedRect(-width / 2, -9, width, 21, 4);
    if (!back) g.fillStyle(d.shirtShade).fillTriangle(-8, -7, 0, 4, 0, -7).fillTriangle(8, -7, 0, 4, 0, -7);
    g.fillStyle(d.shirt).fillRoundedRect(-width / 2 - 4, -5, 5, 14, 2).fillRoundedRect(width / 2 - 1, -5, 5, 14, 2);
  } else if (d.outfit === 'hoodie') {
    g.fillStyle(d.shirtShade).fillCircle(0, -10, side ? 9 : 12);
    g.fillStyle(d.shirt).fillRoundedRect(-width / 2, -8, width, 21, 6);
    if (!back) g.lineStyle(1.4, d.accent, .7).lineBetween(-3, -6, -3, 2).lineBetween(3, -6, 3, 2);
  } else {
    g.fillStyle(d.shirt).fillRoundedRect(-width / 2, -8, width, 20, 4);
    g.fillStyle(d.shirtShade).fillRoundedRect(-width / 2 - 4, -5, 5, 12, 2).fillRoundedRect(width / 2 - 1, -5, 5, 12, 2);
    if (d.outfit === 'pattern-shirt' && !back) g.fillStyle(d.accent, .76).fillTriangle(-7, -3, -2, 1, -7, 5).fillTriangle(2, -6, 7, -2, 3, 2);
    if (d.outfit === 'plaid') { g.lineStyle(1, d.accent, .5); g.lineBetween(-width / 2, -1, width / 2, -1).lineBetween(-width / 2, 6, width / 2, 6).lineBetween(-4, -8, -4, 11).lineBetween(4, -8, 4, 11); }
    if (d.outfit === 'utility-vest') { g.fillStyle(d.shirtShade, .9).fillRect(-width / 2, -7, 5, 18).fillRect(width / 2 - 5, -7, 5, 18); }
    if (d.outfit === 'jersey' && !back) g.fillStyle(d.accent, .75).fillRect(-7, 1, 14, 4);
  }
}

function drawHair(g: Phaser.GameObjects.Graphics, d: CharacterVisual, facing: Facing): void {
  const side = facing === 'left' || facing === 'right'; const xShift = side ? facingSign(facing) * -1 : 0; const y = -20;
  g.fillStyle(d.hair);
  if (d.hairStyle === 'bald') { g.lineStyle(1.2, 0xf3d7bd, .7).beginPath().arc(xShift, y + 1, 8, Math.PI * 1.1, Math.PI * 1.9).strokePath(); return; }
  if (d.hairStyle === 'curly') { for (const [x, dy, r] of [[-8,0,5],[-4,-5,5],[1,-6,6],[7,-4,5],[9,1,4]] as const) g.fillCircle(x + xShift, y + dy, side ? r * .82 : r); return; }
  if (d.hairStyle === 'cap' || d.hairStyle === 'beanie') {
    g.fillStyle(d.accent).fillRoundedRect(-11 + xShift, y - 7, side ? 17 : 22, 9, 4);
    if (d.hairStyle === 'cap') g.fillRect((facing === 'left' ? -18 : 6) + xShift, y, 12, 3);
    return;
  }
  if (d.hairStyle === 'spiky-white') {
    g.fillRoundedRect(-10 + xShift, y - 4, side ? 16 : 21, 6, 2);
    for (let x = -9; x <= 7; x += 4) g.fillTriangle(x + xShift, y - 3, x + 3 + xShift, y - 11 - Math.abs(x % 3), x + 6 + xShift, y - 2);
    return;
  }
  if (d.hairStyle === 'long') { g.fillRoundedRect(-10 + xShift, y - 6, side ? 16 : 21, 10, 5).fillRoundedRect(-9 + xShift, y, side ? 14 : 18, 12, 4); return; }
  if (d.hairStyle === 'wave' || d.hairStyle === 'messy') {
    g.fillRoundedRect(-10 + xShift, y - 6, side ? 16 : 21, 8, 4);
    for (let x = -8; x <= 7; x += 5) g.fillTriangle(x + xShift, y - 4, x + 3 + xShift, y - 10 - Math.abs(x % 4), x + 6 + xShift, y - 3);
    return;
  }
  g.fillRoundedRect(-10 + xShift, y - 6, side ? 16 : 20, 8, 4);
}

function drawAccessory(g: Phaser.GameObjects.Graphics, d: CharacterVisual, facing: Facing): void {
  const side = facing === 'left' || facing === 'right'; const sign = facingSign(facing);
  for (const a of d.accessories) {
    if (a === 'glasses' && facing !== 'up') {
      if (side) g.lineStyle(1.5, 0x171b1d).strokeRect(sign > 0 ? 2 : -8, -19, 7, 5).lineBetween(sign > 0 ? 9 : -8, -17, sign > 0 ? 12 : -11, -16);
      else g.lineStyle(1.5, 0x171b1d).strokeRect(-9, -19, 7, 5).strokeRect(2, -19, 7, 5).lineBetween(-2, -17, 2, -17);
    }
    if (a === 'sunglasses' && facing !== 'up') g.fillStyle(0x11181d, .96).fillRoundedRect(side ? (sign > 0 ? 1 : -9) : -9, -19, side ? 8 : 18, 5, 1);
    if (a === 'earring' && facing !== 'up') g.fillStyle(0xe4c66c).fillCircle(side ? sign * 9 : 10, -14, 1.6);
    if (a === 'beard' && facing !== 'up') g.fillStyle(d.hair, .94).fillRoundedRect(side ? -5 : -7, -12, side ? 10 : 14, 7, 4);
    if (a === 'clipboard') g.fillStyle(0x8a633a).fillRoundedRect(sign * 12 - (sign < 0 ? 9 : 0), -1, 9, 15, 2);
    if (a === 'keys') g.lineStyle(1.5, d.accent).strokeCircle(sign * 14, 9, 3).lineBetween(sign * 16, 11, sign * 21, 16);
    if (a === 'bag') { g.lineStyle(1.5, 0x5a402e, .9).lineBetween(-8, -8, 10, 13); g.fillStyle(0x76543b).fillRoundedRect(8, 8, 10, 11, 2); }
  }
}

function drawPose(g: Phaser.GameObjects.Graphics, state: CampaignAnimation, d: CharacterVisual, facing: Facing): void {
  const sign = facingSign(facing); g.lineStyle(3, skinColor(d), 1);
  if (['talk','argue','wave','highfive','point','shrug','flirt'].includes(state)) {
    g.beginPath().moveTo(sign * 7, -4).lineTo(sign * 15, state === 'highfive' ? -24 : state === 'point' ? -10 : -15).strokePath();
  }
  if (state === 'wave' || state === 'highfive') g.fillStyle(skinColor(d)).fillCircle(sign * 16, state === 'highfive' ? -25 : -16, 3);
  if (state === 'shrug') g.beginPath().moveTo(-7, -3).lineTo(-15, -12).moveTo(7, -3).lineTo(15, -12).strokePath();
  if (state === 'argue') g.fillStyle(d.accent).fillTriangle(sign * 13, -18, sign * 20, -15, sign * 14, -11);
}

function drawProp(g: Phaser.GameObjects.Graphics, state: CampaignAnimation, d: CharacterVisual, facing: Facing): void {
  const sign = facingSign(facing);
  if (state === 'drink') { g.fillStyle(0xe4c05d).fillRoundedRect(sign * 11 - (sign < 0 ? 5 : 0), -2, 5, 14, 2); g.fillStyle(0xf4e8bd).fillRect(sign * 11 - (sign < 0 ? 5 : 0), -4, 5, 3); }
  if (state === 'phone') { g.fillStyle(0x151b23).fillRoundedRect(sign * 11 - (sign < 0 ? 7 : 0), -11, 7, 12, 2); g.fillStyle(0x79a9bc).fillRect(sign * 12 - (sign < 0 ? 5 : 0), -9, 5, 7); }
  if (state === 'carry') { g.fillStyle(0x8b603e).fillRoundedRect(-11, 5, 22, 13, 3); g.lineStyle(2, 0xd3ac65).lineBetween(-7, 5, -4, 0).lineBetween(7, 5, 4, 0); }
  if (state === 'flirt') { g.fillStyle(0xe98a9e).fillCircle(sign * 13, -18, 4).fillCircle(sign * 18, -18, 4).fillTriangle(sign * 9, -17, sign * 22, -17, sign * 15, -8); }
  if (state === 'throw') g.fillStyle(0xe9d9b2).fillCircle(sign * 14, -10, 4);
  if (state === 'pee') { g.lineStyle(2, 0xe7d15c, .75).beginPath().moveTo(sign * 7, 7).quadraticBezierTo(sign * 18, 10, sign * 25, 17).strokePath(); }
  if (state === 'sit') { g.fillStyle(0x76543b).fillRect(-14, 14, 28, 4).fillRect(-11, 18, 3, 10).fillRect(8, 18, 3, 10); }
}

function defaultDuration(state: CampaignAnimation): number { return state === 'sit' ? 2300 : state === 'collapse' ? 2600 : state === 'argue' ? 1600 : 1250; }
function facingSign(facing: Facing): number { return facing === 'left' ? -1 : 1; }
function skinColor(_d: CharacterVisual): number { return 0xe5b28a; }
function parseHex(value: string, fallback: number): number { const parsed = Number.parseInt(value.replace('#', ''), 16); return Number.isFinite(parsed) ? parsed : fallback; }
function shade(color: number, amount: number): number { const r = Math.max(0, Math.min(255, ((color >> 16) & 255) + amount)); const g = Math.max(0, Math.min(255, ((color >> 8) & 255) + amount)); const b = Math.max(0, Math.min(255, (color & 255) + amount)); return (r << 16) | (g << 8) | b; }

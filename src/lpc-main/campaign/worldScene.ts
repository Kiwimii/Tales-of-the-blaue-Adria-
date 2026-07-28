import Phaser from 'phaser';
import type { GameSnapshot } from '../../game/types';
import {
  AERIAL_FUNCTIONAL_AREAS,
  AERIAL_NODES,
  AERIAL_REGION_LAYOUT,
  AERIAL_ROADS,
  AERIAL_SITE_POLYGONS,
  AERIAL_WATER_POLYGONS,
  AERIAL_FENCE_SEGMENTS,
  BEACH_GATE,
  OBJECT_PLACEMENTS,
  NPC_PLACEMENTS,
  type Placement,
  type PlanPolygon,
} from '../../game/aerialCampgroundPlan';
import { statusModifiers, statusVisuals } from '../../game/statusSystem';
import { ALL_INTERACTIONS, CAMPAIGN_CHARACTERS, CAMPAIGN_PLAYER_VISUAL, IMPORTANT_OBJECT_IDS, type CampaignInteraction } from './content';
import { campaignMeta } from './metaStore';
import { ActorRig, preloadLpc, type CampaignAnimation } from './actors';

export interface NearbyCampaignTarget {
  kind: 'character' | 'interaction';
  id: string;
  label: string;
  distance: number;
}

export interface CampaignWorldHooks {
  getSnapshot: () => GameSnapshot;
  onInteract: (target: NearbyCampaignTarget) => void;
  onNearby: (target?: NearbyCampaignTarget) => void;
  onPosition: (x: number, y: number, region: string) => void;
}

const WORLD_WIDTH = 2600;
const WORLD_HEIGHT = 1800;

export class CampaignWorldScene extends Phaser.Scene {
  private control!: Phaser.GameObjects.Rectangle;
  private controlBody!: Phaser.Physics.Arcade.Body;
  private player!: ActorRig;
  private actors = new Map<string, ActorRig>();
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private keys?: Record<string, Phaser.Input.Keyboard.Key>;
  private mobileDirections = new Set<string>();
  private nearest?: NearbyCampaignTarget;
  private npcClock = 0;
  private positionClock = 0;
  private lastRegion = '';
  private gateBarrier?: Phaser.GameObjects.Rectangle;
  private gateCollider?: Phaser.Physics.Arcade.Collider;

  constructor(private readonly hooks: CampaignWorldHooks) { super('lpc-campaign-world'); }

  preload(): void { preloadLpc(this); }

  create(): void {
    this.physics.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    this.cameras.main.setBackgroundColor('#1d4a39');
    this.drawWorld();

    const snapshot = this.hooks.getSnapshot();
    const saved = snapshot.worldPosition;
    const start = saved && saved.x >= 0 && saved.x <= WORLD_WIDTH && saved.y >= 0 && saved.y <= WORLD_HEIGHT
      ? saved
      : CAMPAIGN_PLAYER_VISUAL;
    this.control = this.add.rectangle(start.x, start.y, 26, 18, 0xffffff, 0);
    this.physics.add.existing(this.control);
    this.controlBody = this.control.body as Phaser.Physics.Arcade.Body;
    this.controlBody.setSize(26, 18).setCollideWorldBounds(true);
    this.player = new ActorRig(this, { ...CAMPAIGN_PLAYER_VISUAL, x: start.x, y: start.y }, false);
    if (snapshot.profile) this.player.applyProfile(snapshot.profile);

    for (const visual of CAMPAIGN_CHARACTERS) {
      const actor = new ActorRig(this, visual, true);
      this.actors.set(visual.id, actor);
    }

    this.createCollisions();
    this.cursors = this.input.keyboard?.createCursorKeys();
    this.keys = this.input.keyboard?.addKeys('W,A,S,D,E,SPACE,Q,M') as Record<string, Phaser.Input.Keyboard.Key>;
    this.keys?.E.on('down', () => this.interact());
    this.keys?.SPACE.on('down', () => this.interact());
    this.keys?.Q.on('down', () => this.player.play('wave'));
    this.cameras.main.startFollow(this.control, true, .11, .11);
    this.cameras.main.setZoom(1.03);
    this.cameras.main.fadeIn(500, 8, 18, 15);

    window.addEventListener('lpc-campaign-action', this.externalAction);
    window.addEventListener('lpc-campaign-direction', this.externalDirection as EventListener);
    window.addEventListener('lpc-campaign-animation', this.externalAnimation as EventListener);
    window.addEventListener('lpc-campaign-focus', this.externalFocus as EventListener);
    window.addEventListener('lpc-campaign-profile', this.externalProfile as EventListener);
    window.addEventListener('lpc-campaign-teleport', this.externalTeleport as EventListener);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      window.removeEventListener('lpc-campaign-action', this.externalAction);
      window.removeEventListener('lpc-campaign-direction', this.externalDirection as EventListener);
      window.removeEventListener('lpc-campaign-animation', this.externalAnimation as EventListener);
      window.removeEventListener('lpc-campaign-focus', this.externalFocus as EventListener);
      window.removeEventListener('lpc-campaign-profile', this.externalProfile as EventListener);
      window.removeEventListener('lpc-campaign-teleport', this.externalTeleport as EventListener);
    });
  }

  update(_time: number, delta: number): void {
    const snapshot = this.hooks.getSnapshot();
    const modifiers = statusModifiers(snapshot.needs);
    let dx = 0; let dy = 0;
    if (!document.body.classList.contains('campaign-modal-open')) {
      if (this.cursors?.left.isDown || this.keys?.A.isDown || this.mobileDirections.has('left')) dx -= 1;
      if (this.cursors?.right.isDown || this.keys?.D.isDown || this.mobileDirections.has('right')) dx += 1;
      if (this.cursors?.up.isDown || this.keys?.W.isDown || this.mobileDirections.has('up')) dy -= 1;
      if (this.cursors?.down.isDown || this.keys?.S.isDown || this.mobileDirections.has('down')) dy += 1;
    }
    const vector = new Phaser.Math.Vector2(dx, dy);
    if (vector.lengthSq() > 0) vector.normalize().scale(195 * modifiers.movement);
    this.controlBody.setVelocity(vector.x, vector.y);
    this.player.setPosition(this.control.x, this.control.y);
    this.player.updateWalk(vector.x, vector.y, delta);

    const visuals = statusVisuals(snapshot.needs);
    if (visuals.sway > 0 && vector.lengthSq() > 0) this.cameras.main.rotation = Math.sin(performance.now() / 340) * visuals.sway * .004;
    else this.cameras.main.rotation *= .86;
    this.cameras.main.setAlpha(1 - visuals.vignette * .1);

    this.updateGate();
    this.updateNearest();
    this.npcClock += delta;
    if (this.npcClock > 3300) { this.npcClock = 0; this.animateNearbyNpc(); }
    this.positionClock += delta;
    if (this.positionClock > 420) {
      this.positionClock = 0;
      const region = regionAt(this.control.x, this.control.y);
      this.hooks.onPosition(Math.round(this.control.x), Math.round(this.control.y), region);
      if (region !== this.lastRegion) {
        this.lastRegion = region;
        window.dispatchEvent(new CustomEvent('lpc-campaign-region', { detail: region }));
      }
    }
  }

  playPlayer(animation: CampaignAnimation): void { this.player.play(animation); }
  playCharacter(id: string, animation: CampaignAnimation): void { this.actors.get(id)?.play(animation); }

  private readonly externalAction = (): void => this.interact();
  private readonly externalDirection = (event: CustomEvent<{ direction: string; active: boolean }>): void => {
    if (event.detail.active) this.mobileDirections.add(event.detail.direction); else this.mobileDirections.delete(event.detail.direction);
  };
  private readonly externalAnimation = (event: CustomEvent<{ id?: string; animation: CampaignAnimation }>): void => {
    if (event.detail.id) this.playCharacter(event.detail.id, event.detail.animation); else this.playPlayer(event.detail.animation);
  };
  private readonly externalFocus = (event: CustomEvent<string>): void => {
    const actor = this.actors.get(event.detail);
    const interaction = ALL_INTERACTIONS.find((entry) => entry.id === event.detail);
    const x = actor?.x ?? interaction?.x; const y = actor?.y ?? interaction?.y;
    if (x === undefined || y === undefined) return;
    this.cameras.main.stopFollow();
    this.cameras.main.pan(x, y, 500, 'Sine.easeInOut', false, (_camera, progress) => {
      if (progress === 1) this.time.delayedCall(950, () => this.cameras.main.startFollow(this.control, true, .11, .11));
    });
    actor?.setMarker(true);
    this.time.delayedCall(1500, () => actor?.setMarker(false));
  };
  private readonly externalProfile = (event: CustomEvent<GameSnapshot['profile']>): void => { if (event.detail) this.player.applyProfile(event.detail); };
  private readonly externalTeleport = (event: CustomEvent<{ x: number; y: number }>): void => {
    this.control.setPosition(event.detail.x, event.detail.y); this.controlBody.reset(event.detail.x, event.detail.y); this.player.setPosition(event.detail.x, event.detail.y);
  };

  private interact(): void { if (this.nearest) this.hooks.onInteract(this.nearest); }

  private updateNearest(): void {
    const candidates: NearbyCampaignTarget[] = [];
    const gateOpen = campaignMeta.snapshot().authorityBattleWon;
    for (const actor of this.actors.values()) {
      const distance = Phaser.Math.Distance.Between(this.control.x, this.control.y, actor.x, actor.y);
      if (distance <= 104) candidates.push({ kind: 'character', id: actor.id, label: actor.visual.name, distance });
      actor.setMarker(false);
    }
    for (const interaction of ALL_INTERACTIONS) {
      if (interaction.requiresGate && !gateOpen) continue;
      const distance = Phaser.Math.Distance.Between(this.control.x, this.control.y, interaction.x, interaction.y);
      if (distance <= interaction.radius) candidates.push({ kind: 'interaction', id: interaction.id, label: interaction.label, distance });
    }
    candidates.sort((a, b) => a.distance - b.distance || (a.kind === 'character' ? -1 : 1));
    this.nearest = candidates[0];
    if (this.nearest?.kind === 'character') this.actors.get(this.nearest.id)?.setMarker(true);
    this.hooks.onNearby(this.nearest);
  }

  private animateNearbyNpc(): void {
    const nearby = [...this.actors.values()].filter((actor) => Phaser.Math.Distance.Between(this.control.x, this.control.y, actor.x, actor.y) < 650);
    if (!nearby.length) return;
    const actor = nearby[Math.floor(Math.random() * nearby.length)];
    const animation = actor.visual.id === 'gundula' ? 'point' : actor.visual.id === 'uli' ? 'carry' : actor.visual.id === 'ronny' ? 'argue' : actor.visual.greetingAnimation;
    actor.play(animation as CampaignAnimation, 1100);
  }

  private updateGate(): void {
    if (!this.gateBarrier || !this.gateCollider) return;
    const open = campaignMeta.snapshot().authorityBattleWon;
    this.gateBarrier.setVisible(!open);
    this.gateCollider.active = !open;
    const body = this.gateBarrier.body as Phaser.Physics.Arcade.StaticBody;
    body.enable = !open;
  }

  private drawWorld(): void {
    for (const polygon of AERIAL_SITE_POLYGONS) drawPolygon(this, polygon);
    for (const polygon of AERIAL_WATER_POLYGONS) drawPolygon(this, polygon);
    const graphics = this.add.graphics();
    for (const road of AERIAL_ROADS) {
      const from = AERIAL_NODES[road.from]; const to = AERIAL_NODES[road.to];
      const color = road.surface === 'asphalt' ? 0x626865 : road.surface === 'sand' ? 0xcdbb7e : 0xa99a72;
      graphics.lineStyle(road.width + 8, 0x31483c, .35).lineBetween(from.x, from.y, to.x, to.y);
      graphics.lineStyle(road.width, color, 1).lineBetween(from.x, from.y, to.x, to.y);
      graphics.lineStyle(2, road.surface === 'asphalt' ? 0x959d99 : 0xe0cea0, .32).lineBetween(from.x, from.y, to.x, to.y);
    }
    for (const area of Object.values(AERIAL_FUNCTIONAL_AREAS)) {
      graphics.lineStyle(3, area.border, .42).strokeRoundedRect(area.x, area.y, area.width, area.height, 18);
      this.add.text(area.x + 14, area.y + 12, area.label, { fontFamily: 'Arial Black, system-ui', fontSize: '14px', color: '#f3e7b8', backgroundColor: '#173329cc', padding: { x: 8, y: 5 } }).setDepth(20);
    }
    this.drawObjects();
    this.drawFences();
    this.drawInteractionMarkers();
    this.drawVegetation();
    this.add.text(1290, 30, 'TALES OF THE BLAUE ADRIA · KANONISCHER PLATZPLAN', { fontFamily: 'Arial Black, system-ui', fontSize: '23px', color: '#fff1be', backgroundColor: '#10261fe8', padding: { x: 15, y: 8 }, stroke: '#07130f', strokeThickness: 3 }).setOrigin(.5).setDepth(10000);
  }

  private drawObjects(): void {
    for (const id of IMPORTANT_OBJECT_IDS) {
      const placement = OBJECT_PLACEMENTS[id];
      if (!placement) continue;
      drawObject(this, id, placement);
    }
    drawCar(this, 900, 1600, 0xb84d3e);
    drawCar(this, 1240, 1170, 0x426f8d);
    drawPowerChain(this);
  }

  private drawFences(): void {
    const g = this.add.graphics();
    for (const fence of AERIAL_FENCE_SEGMENTS) drawFence(g, fence.x, fence.y, fence.width, fence.height);
    drawFence(g, BEACH_GATE.x, BEACH_GATE.y, BEACH_GATE.width, BEACH_GATE.height, true);
    drawFence(g, 770, 1375, 120, 16, true);
  }

  private drawInteractionMarkers(): void {
    for (const interaction of ALL_INTERACTIONS) {
      const color = interaction.kind === 'story' ? 0xe0b74f : interaction.kind === 'minigame' ? 0xc85e52 : interaction.kind === 'service' ? 0x4b91a4 : 0x6db87b;
      const marker = this.add.circle(interaction.x, interaction.y, 20, color, .16).setStrokeStyle(3, color, .78).setDepth(interaction.y - 40);
      this.tweens.add({ targets: marker, scale: { from: .9, to: 1.22 }, alpha: { from: .65, to: .12 }, duration: 1050 + (interaction.x % 250), yoyo: true, repeat: -1 });
      this.add.text(interaction.x, interaction.y + 31, interaction.label, { fontFamily: 'Arial Black, system-ui', fontSize: '10px', color: '#fff5d0', backgroundColor: '#10261fd9', padding: { x: 5, y: 3 } }).setOrigin(.5).setDepth(interaction.y + 50);
    }
  }

  private drawVegetation(): void {
    const g = this.add.graphics();
    let seed = 12345;
    const random = (): number => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    for (let i = 0; i < 115; i += 1) {
      const x = 20 + random() * 2550; const y = 20 + random() * 1740;
      if (x > 2180 || nearRoad(x, y)) continue;
      const r = 13 + random() * 18;
      g.fillStyle(i % 3 === 0 ? 0x285b3c : 0x326b45, .82).fillCircle(x, y, r);
      g.fillStyle(0x4b8554, .55).fillCircle(x - r * .25, y - r * .25, r * .72);
      g.fillStyle(0x6b4a31, .75).fillRect(x - 3, y + r * .5, 6, r * .75);
    }
  }

  private createCollisions(): void {
    const staticGroup = this.physics.add.staticGroup();
    for (const id of ['reception','sanitary','clubhouse','festival-stage','party','festival-kiosk','lifeguard','beach-kiosk','workshop','wood-shed','cove-shelter']) {
      const p = OBJECT_PLACEMENTS[id]; if (!p?.width || !p.height) continue;
      const rect = this.add.rectangle(p.x + p.width / 2, p.y + p.height / 2, p.width, p.height, 0, 0);
      this.physics.add.existing(rect, true); staticGroup.add(rect);
    }
    this.physics.add.collider(this.control, staticGroup);
    this.gateBarrier = this.add.rectangle(900, 1383, 126, 20, 0xcbb25d, .85);
    this.physics.add.existing(this.gateBarrier, true);
    this.gateCollider = this.physics.add.collider(this.control, this.gateBarrier);
  }
}

export function createCampaignGame(parent: HTMLElement, hooks: CampaignWorldHooks): Phaser.Game {
  return new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    width: 1280,
    height: 720,
    backgroundColor: '#17392f',
    pixelArt: true,
    antialias: false,
    roundPixels: true,
    physics: { default: 'arcade', arcade: { gravity: { x: 0, y: 0 }, debug: false } },
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH, width: 1280, height: 720 },
    scene: [new CampaignWorldScene(hooks)],
  });
}

function drawPolygon(scene: Phaser.Scene, polygon: PlanPolygon): void {
  const g = scene.add.graphics(); const points = polygon.points.map((p) => new Phaser.Geom.Point(p.x, p.y));
  g.fillStyle(polygon.fill, 1).fillPoints(points, true); g.lineStyle(4, polygon.border, .9).strokePoints(points, true);
}

function drawObject(scene: Phaser.Scene, id: string, p: Placement): void {
  const w = p.width ?? 80; const h = p.height ?? 60; const g = scene.add.graphics().setDepth(p.y + h);
  if (id.includes('tent') && !id.includes('hedge')) {
    const color = id === 'home-tent' ? 0xd1a846 : id.includes('andre') ? 0xd79e3e : id.includes('rene') ? 0x3c9186 : id.includes('lars') ? 0x657746 : 0x4776a1;
    g.fillStyle(0x1b332b, .32).fillEllipse(p.x + w / 2, p.y + h, w * .95, h * .24);
    g.fillStyle(color).fillTriangle(p.x, p.y + h, p.x + w / 2, p.y, p.x + w, p.y + h);
    g.lineStyle(4, 0x382d27, .85).strokeTriangle(p.x, p.y + h, p.x + w / 2, p.y, p.x + w, p.y + h);
    g.fillStyle(0x253a32).fillTriangle(p.x + w * .42, p.y + h, p.x + w / 2, p.y + h * .45, p.x + w * .58, p.y + h);
    return;
  }
  if (id.includes('hedge')) { for (let x = p.x; x < p.x + w; x += 24) g.fillStyle((x / 24) % 2 ? 0x2f6b42 : 0x3a7c4a).fillCircle(x + 12, p.y + h / 2, 19); return; }
  if (id.includes('tree')) { g.fillStyle(0x66452e).fillRect(p.x + w * .44, p.y + h * .55, w * .12, h * .45); g.fillStyle(0x2f6b43).fillCircle(p.x + w / 2, p.y + h * .36, Math.min(w, h) * .42); return; }
  if (id.includes('bench')) { g.fillStyle(0x76523a).fillRoundedRect(p.x, p.y, w, h * .45, 5).fillRect(p.x + 8, p.y + h * .42, 7, h * .58).fillRect(p.x + w - 15, p.y + h * .42, 7, h * .58); return; }
  if (id.includes('table')) { g.fillStyle(0x8a5b38).fillRoundedRect(p.x, p.y, w, h * .52, 6).fillRect(p.x + w * .2, p.y + h * .45, 8, h * .55).fillRect(p.x + w * .75, p.y + h * .45, 8, h * .55); return; }
  if (id.includes('dock')) { g.fillStyle(0x8b6842).fillRect(p.x, p.y, w, h); for (let x = p.x; x < p.x + w; x += 28) g.lineStyle(2, 0x5e452f, .7).lineBetween(x, p.y, x, p.y + h); return; }
  const roof = id === 'reception' ? 0x8a4935 : id === 'sanitary' ? 0x426b78 : id.includes('kiosk') ? 0xb06b3f : id.includes('stage') ? 0x51405c : 0x5d664d;
  g.fillStyle(0x253f35, .35).fillEllipse(p.x + w / 2, p.y + h, w, h * .25);
  g.fillStyle(0xd4c591).fillRoundedRect(p.x, p.y + h * .22, w, h * .78, 7);
  g.fillStyle(roof).fillTriangle(p.x - 10, p.y + h * .28, p.x + w / 2, p.y - 12, p.x + w + 10, p.y + h * .28);
  g.fillStyle(0x6f4b31).fillRect(p.x + w * .43, p.y + h * .55, w * .16, h * .45);
  g.fillStyle(0x73aab0).fillRect(p.x + w * .12, p.y + h * .45, w * .22, h * .22).fillRect(p.x + w * .67, p.y + h * .45, w * .22, h * .22);
  scene.add.text(p.x + w / 2, p.y + h * .32, objectLabel(id), { fontFamily: 'Arial Black', fontSize: '13px', color: '#25332c' }).setOrigin(.5).setDepth(p.y + h + 1);
}

function drawCar(scene: Phaser.Scene, x: number, y: number, color: number): void {
  const g = scene.add.graphics().setDepth(y + 55); g.fillStyle(0x111817, .28).fillEllipse(x, y + 36, 150, 34); g.fillStyle(color).fillRoundedRect(x - 72, y - 20, 144, 55, 14); g.fillStyle(0x91bac0).fillRoundedRect(x - 38, y - 34, 76, 28, 7); g.fillStyle(0x22282a).fillCircle(x - 48, y + 34, 17).fillCircle(x + 48, y + 34, 17); g.fillStyle(0xbfd8d8).fillRect(x - 29, y - 29, 25, 20).fillRect(x + 5, y - 29, 25, 20);
}

function drawPowerChain(scene: Phaser.Scene): void {
  const g = scene.add.graphics(); g.lineStyle(5, 0x31312d, .9).beginPath().moveTo(1210, 1090).lineTo(1240, 1120).lineTo(1290, 1080).strokePath(); g.fillStyle(0xd68c39).fillCircle(1210, 1090, 18); g.fillStyle(0x54645c).fillRoundedRect(1270, 1040, 42, 80, 5); g.fillStyle(0xe9c85f).fillCircle(1291, 1074, 6);
}

function drawFence(g: Phaser.GameObjects.Graphics, x: number, y: number, w: number, h: number, gate = false): void {
  g.lineStyle(gate ? 5 : 4, gate ? 0xd2b55b : 0x655841, .9).strokeRect(x, y, w, h); const step = Math.max(18, Math.min(w, h) / 4); if (w > h) for (let px = x; px <= x + w; px += step) g.lineBetween(px, y, px, y + h); else for (let py = y; py <= y + h; py += step) g.lineBetween(x, py, x + w, py);
}

function nearRoad(x: number, y: number): boolean {
  return AERIAL_ROADS.some((road) => { const a = AERIAL_NODES[road.from]; const b = AERIAL_NODES[road.to]; return distanceToSegment(x, y, a.x, a.y, b.x, b.y) < road.width * .8; });
}
function distanceToSegment(px: number, py: number, ax: number, ay: number, bx: number, by: number): number { const dx = bx - ax; const dy = by - ay; const length = dx * dx + dy * dy; if (!length) return Math.hypot(px - ax, py - ay); const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / length)); return Math.hypot(px - (ax + t * dx), py - (ay + t * dy)); }
function objectLabel(id: string): string { return ({ reception: 'REZEPTION', sanitary: 'SANITÄR', clubhouse: 'ADRIA-KLAUSE', party: 'PARTYZELT', lifeguard: 'WACHE', workshop: 'WERKSTATT', 'festival-stage': 'BÜHNE', 'festival-kiosk': 'KIOSK', 'beach-kiosk': 'STRANDKIOSK', 'cove-shelter': 'BUCHT' } as Record<string,string>)[id] ?? id.replaceAll('-', ' ').toUpperCase(); }
function regionAt(x: number, y: number): string { for (const [id, b] of Object.entries(AERIAL_REGION_LAYOUT)) if (x >= b.x && x <= b.x + b.width && y >= b.y && y <= b.y + b.height) return id; return 'campground'; }

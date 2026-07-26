import Phaser from 'phaser';
import { RELATIONSHIP_CHARACTERS } from '../content';
import { ACTION_EVENT, INPUT_EVENT, type InputEventDetail } from '../events';
import { gameStore } from '../state/GameStore';
import type { Direction, GameSnapshot } from '../types';
import { currentVisualProfile } from '../visuals';
import { buildExpandedWorldVisuals } from '../worldVisualLayer';
import {
  EXPANDED_ENTRANCES,
  EXPANDED_NPCS,
  EXPANDED_WORLD_HEIGHT,
  EXPANDED_WORLD_WIDTH,
  LANDMARKS,
  WORLD_REGIONS,
  countFoundFriends,
  fallbackSpawn,
  isRegionUnlocked,
  regionAt,
  type RegionId,
  type WorldRegion,
} from '../worldV2';

interface InteractionPoint {
  id: string;
  regionId: RegionId;
  x: number;
  y: number;
  radius: number;
  prompt: string;
  action: () => void;
}

interface RegionLockVisual {
  zone: Phaser.GameObjects.Zone;
  collider: Phaser.Physics.Arcade.Collider;
  overlay: Phaser.GameObjects.Rectangle;
  border: Phaser.GameObjects.Rectangle;
  label: Phaser.GameObjects.Text;
}

export class ExpandedWorldScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private shadow!: Phaser.GameObjects.Ellipse;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private keys?: Record<string, Phaser.Input.Keyboard.Key>;
  private directions = new Set<Direction>();
  private interactions: InteractionPoint[] = [];
  private obstacles: Phaser.GameObjects.Zone[] = [];
  private locks = new Map<RegionId, RegionLockVisual>();
  private minimapLocks = new Map<RegionId, Phaser.GameObjects.Text>();
  private message!: Phaser.GameObjects.Text;
  private prompt!: Phaser.GameObjects.Text;
  private banner!: Phaser.GameObjects.Text;
  private night!: Phaser.GameObjects.Rectangle;
  private warmth!: Phaser.GameObjects.Rectangle;
  private minimap?: Phaser.GameObjects.Container;
  private minimapPlayer?: Phaser.GameObjects.Arc;
  private gate?: Phaser.GameObjects.Container;
  private gateZone?: Phaser.GameObjects.Zone;
  private gateCollider?: Phaser.Physics.Arcade.Collider;
  private lanterns: Phaser.GameObjects.Arc[] = [];
  private fireflies: Phaser.GameObjects.Arc[] = [];
  private state!: GameSnapshot;
  private activeRegion: RegionId = 'arrival';
  private lastNeedTick = 0;
  private lastPersist = 0;
  private gateOpen = false;
  private unsubscribe?: () => void;
  private readonly profile = currentVisualProfile();

  private readonly onMobileInput = (event: Event): void => {
    const detail = (event as CustomEvent<InputEventDetail>).detail;
    if (detail.active) this.directions.add(detail.direction);
    else this.directions.delete(detail.direction);
  };

  private readonly onAction = (): void => this.interact();

  constructor() {
    super('world');
  }

  create(): void {
    gameStore.setMode('world');
    this.state = gameStore.snapshot();
    this.gateOpen = Boolean(this.state.flags.gateOpen);
    this.physics.world.setBounds(0, 0, EXPANDED_WORLD_WIDTH, EXPANDED_WORLD_HEIGHT);
    this.cameras.main.setBounds(0, 0, EXPANDED_WORLD_WIDTH, EXPANDED_WORLD_HEIGHT);

    const visual = buildExpandedWorldVisuals(this, this.profile);
    this.obstacles = visual.obstacles;
    this.lanterns = visual.lanternGlows;
    this.fireflies = visual.fireflies;
    this.drawGate(this.gateOpen);
    this.drawPeople();
    this.addEntrances();
    this.addActivities();
    this.addLandmarks();

    const saved = this.state.worldPosition;
    const start = isRegionUnlocked(regionAt(saved.x, saved.y).id, this.state) ? saved : fallbackSpawn(this.state);
    this.shadow = this.add.ellipse(start.x + 2, start.y + 25, 37, 12, 0x07120f, 0.3).setDepth(49);
    this.player = this.physics.add.sprite(start.x, start.y, 'player').setCollideWorldBounds(true).setDepth(52);
    this.player.body?.setSize(21, 18).setOffset(12, 40);
    this.obstacles.forEach((zone) => this.physics.add.collider(this.player, zone));
    if (this.gateZone) this.gateCollider = this.physics.add.collider(this.player, this.gateZone);
    this.syncRegionLocks(this.state, true);

    const region = regionAt(start.x, start.y);
    this.activeRegion = region.id;
    this.cameras.main.startFollow(this.player, true, 0.11, 0.11);
    this.cameras.main.setZoom(region.zoom);
    this.cursors = this.input.keyboard?.createCursorKeys();
    this.keys = this.input.keyboard?.addKeys('W,A,S,D,E,SPACE,M') as Record<string, Phaser.Input.Keyboard.Key>;
    this.keys?.E.on('down', this.onAction);
    this.keys?.SPACE.on('down', this.onAction);
    this.keys?.M.on('down', () => this.minimap?.setVisible(!this.minimap.visible));
    window.addEventListener(INPUT_EVENT, this.onMobileInput);
    window.addEventListener(ACTION_EVENT, this.onAction);

    this.createHud();
    this.createMinimap();
    this.updateLighting();
    this.showRegion(region);
    this.unsubscribe = gameStore.subscribe((next) => this.onStoreUpdate(next));
    this.time.addEvent({ delay: 1000, loop: true, callback: () => this.updateLighting() });
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.shutdown());
  }

  update(time: number): void {
    if (!this.player || !this.state) return;
    if (this.state.encounter) {
      this.player.setVelocity(0, 0);
      this.prompt.setVisible(false);
      return;
    }
    let x = 0;
    let y = 0;
    if (this.cursors?.left.isDown || this.keys?.A.isDown || this.directions.has('left')) x -= 1;
    if (this.cursors?.right.isDown || this.keys?.D.isDown || this.directions.has('right')) x += 1;
    if (this.cursors?.up.isDown || this.keys?.W.isDown || this.directions.has('up')) y -= 1;
    if (this.cursors?.down.isDown || this.keys?.S.isDown || this.directions.has('down')) y += 1;
    const energyFactor = Math.max(0.76, Math.min(1.08, this.state.needs.energy / 110 + 0.18));
    const velocity = new Phaser.Math.Vector2(x, y).normalize().scale(164 * energyFactor);
    this.player.setVelocity(velocity.x, velocity.y);
    this.shadow.setPosition(this.player.x + 2, this.player.y + 25);
    if (x || y) {
      if (x) this.player.setFlipX(x < 0);
      const stride = Math.sin(time * 0.024);
      this.player.setScale(1 + Math.abs(stride) * 0.014, 1 - Math.abs(stride) * 0.02).setAngle(stride * 1.7);
      if (time - this.lastPersist >= 650) {
        this.lastPersist = time;
        gameStore.setWorldPosition(this.player.x, this.player.y);
      }
    } else this.player.setScale(1).setAngle(0);

    const nearby = this.nearestInteraction();
    this.prompt.setVisible(Boolean(nearby));
    if (nearby) this.prompt.setText(`AKTION · ${nearby.prompt}`);
    const region = regionAt(this.player.x, this.player.y);
    if (region.id !== this.activeRegion) {
      this.activeRegion = region.id;
      this.showRegion(region);
      this.tweens.add({ targets: this.cameras.main, zoom: region.zoom, duration: 850, ease: 'Sine.InOut' });
    }
    this.updateMinimap();
    if (time - this.lastNeedTick > 12000) {
      this.lastNeedTick = time;
      gameStore.advanceMinutes(5);
    }
  }

  private shutdown(): void {
    window.removeEventListener(INPUT_EVENT, this.onMobileInput);
    window.removeEventListener(ACTION_EVENT, this.onAction);
    this.directions.clear();
    if (this.player) gameStore.setWorldPosition(this.player.x, this.player.y);
    this.unsubscribe?.();
  }

  private drawGate(open: boolean): void {
    const parts: Phaser.GameObjects.GameObject[] = [
      this.add.rectangle(778, 1278, 40, 48, 0xd4ba76).setStrokeStyle(3, 0x59472f, 0.8),
      this.add.rectangle(892, 1278, 40, 48, 0xd4ba76).setStrokeStyle(3, 0x59472f, 0.8),
      this.add.circle(778, 1250, 8, 0xffdf82).setStrokeStyle(3, 0xfff3bd, 0.65),
      this.add.circle(892, 1250, 8, 0xffdf82).setStrokeStyle(3, 0xfff3bd, 0.65),
    ];
    const barrier = this.add.rectangle(835, 1275, 114, 16, 0xd9584e).setStrokeStyle(2, 0x6f2827, 0.72);
    const stripeA = this.add.rectangle(810, 1275, 20, 16, 0xffffff, 0.92).setAngle(-18);
    const stripeB = this.add.rectangle(860, 1275, 20, 16, 0xffffff, 0.92).setAngle(-18);
    const hinge = this.add.circle(782, 1275, 9, 0x27312e).setStrokeStyle(2, 0xe6cf90, 0.7);
    parts.push(barrier, stripeA, stripeB, hinge);
    this.gate = this.add.container(0, 0, parts).setDepth(58);
    if (open) {
      barrier.setAngle(-78).setPosition(790, 1232);
      stripeA.setVisible(false);
      stripeB.setVisible(false);
    } else this.gateZone = this.makeObstacle(755, 1260, 160, 36);
  }

  private drawPeople(): void {
    EXPANDED_NPCS.forEach((placement) => {
      const person = RELATIONSHIP_CHARACTERS.find((entry) => entry.id === placement.id);
      if (!person) return;
      this.add.ellipse(placement.x + 2, placement.y + 25, 34, 11, 0x07120f, 0.28).setDepth(40 + placement.y / 100);
      this.physics.add.staticSprite(placement.x, placement.y, `npc-${placement.id}`).setDepth(42 + placement.y / 100);
      this.add.text(placement.x, placement.y - 45, person.name, this.npcStyle()).setOrigin(0.5).setDepth(44 + placement.y / 100);
      this.obstacles.push(this.makeObstacle(placement.x - 13, placement.y + 5, 26, 26));
      this.interactions.push({ id: `npc-${placement.id}`, regionId: placement.regionId, x: placement.x, y: placement.y, radius: 74, prompt: `Mit ${person.name} sprechen`, action: () => this.talkTo(placement.id) });
    });
  }

  private addEntrances(): void {
    EXPANDED_ENTRANCES.forEach((entrance) => {
      this.add.image(entrance.x, entrance.y, 'door-marker').setDepth(36 + entrance.y / 100);
      this.interactions.push({
        id: entrance.id, regionId: entrance.regionId, x: entrance.x, y: entrance.y, radius: 68, prompt: entrance.label,
        action: () => {
          if (!isRegionUnlocked(entrance.regionId, this.state)) return this.showLockedHint(entrance.regionId);
          gameStore.setWorldPosition(this.player.x, this.player.y);
          gameStore.enterInterior(entrance.interiorId);
          this.scene.start('interior');
        },
      });
    });
  }

  private addActivities(): void {
    this.activity('battle', 'central', 250, 850, 'CAMPING-DUELL', 'Ronny herausfordern', () => {
      if (!this.state.flags.gateOpen) return this.showMessage('Ronny wartet hinter dem Tor. Leider ist er trotzdem hörbar.');
      if (this.state.flags.firstBattleWon) return this.showMessage('Ronny wurde bereits überzeugt. Sein Vortrag läuft außer Konkurrenz weiter.');
      gameStore.setWorldPosition(this.player.x, this.player.y);
      this.scene.start('battle');
    });
    this.activity('flunkyball', 'beach', 2100, 820, 'FLUNKYBALL', 'Flunkyball starten', () => {
      if (!isRegionUnlocked('beach', this.state)) return this.showLockedHint('beach');
      if (this.state.flags.flunkyballWon) return this.showMessage('Die Strandstaffel ist bereits gewonnen. Der Rufbonus bleibt einmalig.');
      gameStore.setWorldPosition(this.player.x, this.player.y);
      this.scene.start('flunkyball');
    });
  }

  private activity(id: string, regionId: RegionId, x: number, y: number, label: string, prompt: string, action: () => void): void {
    this.add.image(x, y, 'activity-marker').setDepth(35 + y / 100);
    this.add.text(x, y + 29, label, this.npcStyle()).setOrigin(0.5).setDepth(36 + y / 100);
    this.interactions.push({ id, regionId, x, y, radius: 72, prompt, action });
  }

  private addLandmarks(): void {
    LANDMARKS.forEach((landmark) => {
      this.add.circle(landmark.x, landmark.y, 11, 0xb99ce8, 0.9).setStrokeStyle(3, 0xfff1c2, 0.78).setDepth(33 + landmark.y / 100);
      this.add.text(landmark.x, landmark.y + 24, landmark.title.toUpperCase(), { ...this.npcStyle(), fontSize: '10px', backgroundColor: '#241c34d4' }).setOrigin(0.5).setDepth(34 + landmark.y / 100);
      this.interactions.push({
        id: `landmark-${landmark.id}`, regionId: landmark.regionId, x: landmark.x, y: landmark.y, radius: 64, prompt: landmark.prompt,
        action: () => {
          const flag = `landmark-${landmark.id}`;
          if (!this.state.flags[flag]) gameStore.setFlag(flag);
          this.showMessage(`${landmark.title}: ${landmark.text}`);
        },
      });
    });
  }

  private createHud(): void {
    this.message = this.add.text(480, 596, this.state.currentObjective, { fontFamily: 'system-ui', fontSize: '17px', color: '#f5f1df', backgroundColor: '#14241fee', padding: { x: 16, y: 10 }, align: 'center', wordWrap: { width: 680 } }).setOrigin(0.5).setScrollFactor(0).setDepth(120);
    this.prompt = this.add.text(480, 542, '', { fontFamily: 'system-ui', fontSize: '14px', fontStyle: 'bold', color: '#173027', backgroundColor: '#f4d47bee', padding: { x: 12, y: 7 } }).setOrigin(0.5).setScrollFactor(0).setDepth(121).setVisible(false);
    this.banner = this.add.text(480, 74, '', { fontFamily: 'Arial Black, system-ui', fontSize: '21px', fontStyle: 'bold', color: '#fff8dc', backgroundColor: '#10251fe8', stroke: '#2e473a', strokeThickness: 3, padding: { x: 18, y: 10 }, align: 'center' }).setOrigin(0.5).setScrollFactor(0).setDepth(122).setAlpha(0);
    this.night = this.add.rectangle(480, 320, 960, 640, 0x10254a, 0).setScrollFactor(0).setDepth(90).setBlendMode(Phaser.BlendModes.MULTIPLY);
    this.warmth = this.add.rectangle(480, 320, 960, 640, 0xffca72, 0).setScrollFactor(0).setDepth(91).setBlendMode(Phaser.BlendModes.SOFT_LIGHT);
  }

  private createMinimap(): void {
    const scale = 0.065;
    const children: Phaser.GameObjects.GameObject[] = [
      this.add.rectangle(0, 0, 194, 142, 0x0b1b16, 0.9).setOrigin(0).setStrokeStyle(2, 0xf4d47b, 0.52),
      this.add.text(10, 7, 'PLATZPLAN · M', { fontFamily: 'system-ui', fontSize: '10px', fontStyle: 'bold', color: '#f4d47b' }),
    ];
    WORLD_REGIONS.forEach((region) => {
      children.push(this.add.rectangle(10 + region.bounds.x * scale, 24 + region.bounds.y * scale, Math.max(5, region.bounds.width * scale), Math.max(5, region.bounds.height * scale), region.accent, 0.32).setOrigin(0).setStrokeStyle(1, region.accent, 0.76));
      if (region.id === 'arrival') return;
      const lock = this.add.text(10 + (region.bounds.x + region.bounds.width / 2) * scale, 24 + (region.bounds.y + region.bounds.height / 2) * scale, '×', { fontFamily: 'Arial Black', fontSize: '12px', color: '#ffe09a' }).setOrigin(0.5);
      this.minimapLocks.set(region.id, lock);
      children.push(lock);
    });
    this.minimapPlayer = this.add.circle(10, 24, 3.8, 0xffffff).setStrokeStyle(2, 0x173027);
    children.push(this.minimapPlayer);
    this.minimap = this.add.container(750, 18, children).setScrollFactor(0).setDepth(123);
    this.refreshMinimapLocks();
    this.updateMinimap();
  }

  private updateMinimap(): void {
    if (this.minimapPlayer && this.player) this.minimapPlayer.setPosition(10 + this.player.x * 0.065, 24 + this.player.y * 0.065);
  }

  private refreshMinimapLocks(): void {
    this.minimapLocks.forEach((label, id) => label.setVisible(!isRegionUnlocked(id, this.state)));
  }

  private syncRegionLocks(state: GameSnapshot, initial = false): void {
    WORLD_REGIONS.forEach((region) => {
      if (region.id === 'arrival') return;
      const unlocked = isRegionUnlocked(region.id, state);
      const lock = this.locks.get(region.id);
      if (!unlocked && !lock && this.player) this.createRegionLock(region);
      if (unlocked && lock) this.removeRegionLock(region, lock, initial);
    });
    this.refreshMinimapLocks();
  }

  private createRegionLock(region: WorldRegion): void {
    const { x, y, width, height } = region.bounds;
    const zone = this.add.zone(x + width / 2, y + height / 2, width, height);
    this.physics.add.existing(zone, true);
    const collider = this.physics.add.collider(this.player, zone);
    const overlay = this.add.rectangle(x + width / 2, y + height / 2, width, height, 0x07120f, 0.2).setDepth(64);
    const border = this.add.rectangle(x + width / 2, y + height / 2, width - 12, height - 12).setStrokeStyle(5, region.accent, 0.45).setDepth(65);
    const label = this.add.text(x + width / 2, y + height / 2, `GESPERRT · ${region.title.toUpperCase()}\n${region.unlockHint}`, { fontFamily: 'system-ui', fontSize: '20px', fontStyle: 'bold', color: '#ffe6a6', backgroundColor: '#10251fe8', padding: { x: 18, y: 12 }, align: 'center', wordWrap: { width: Math.min(470, width - 60) } }).setOrigin(0.5).setDepth(66);
    this.locks.set(region.id, { zone, collider, overlay, border, label });
  }

  private removeRegionLock(region: WorldRegion, lock: RegionLockVisual, initial: boolean): void {
    lock.collider.destroy();
    lock.zone.destroy();
    this.locks.delete(region.id);
    if (initial) return [lock.overlay, lock.border, lock.label].forEach((item) => item.destroy());
    this.tweens.add({ targets: [lock.overlay, lock.border, lock.label], alpha: 0, duration: 900, ease: 'Sine.Out', onComplete: () => [lock.overlay, lock.border, lock.label].forEach((item) => item.destroy()) });
    this.cameras.main.flash(400, 244, 212, 123, false);
    this.showMessage(`NEUER BEREICH · ${region.title} ist jetzt zugänglich.`);
  }

  private talkTo(id: string): void {
    if (id === 'gundula') {
      if (!this.state.flags.gundulaConvinced) gameStore.openEncounter('gundula-entry');
      else { gameStore.socialize(id); this.showMessage('Gundula: „Der erste Eindruck war ausreichend. Ruinier ihn nicht rückwirkend.“'); }
      return;
    }
    if (id === 'uli') {
      if (!this.state.flags.gundulaConvinced) this.showMessage('Uli: „Erst Anmeldung bei Gundula. Ich bin hier für Geometrie, nicht für Gefühle.“');
      else if (!this.state.flags.uliConvinced) gameStore.openEncounter('uli-entry');
      else { gameStore.socialize(id); this.showMessage('Uli: „Parkplatz vier bleibt Parkplatz vier. Wir verstehen uns.“'); }
      return;
    }
    const placement = EXPANDED_NPCS.find((entry) => entry.id === id);
    if (placement && !isRegionUnlocked(placement.regionId, this.state)) return this.showLockedHint(placement.regionId);
    if (id === 'manni' && this.state.quests.paper.status !== 'completed') { gameStore.openEncounter('manni-paper'); return; }
    if (id === 'ronny' && !this.state.flags.firstBattleWon) { this.showMessage('Ronny: „Reden können wir nach dem Camping-Duell. Vorher rede nur ich.“'); return; }
    const person = RELATIONSHIP_CHARACTERS.find((entry) => entry.id === id);
    if (!person) return;
    const first = gameStore.socialize(id);
    this.showMessage(first ? `${person.name} gefunden · Beziehung +${person.group === 'freunde' ? 8 : 3}` : person.line);
  }

  private interact(): void {
    const nearest = this.nearestInteraction();
    if (nearest) nearest.action();
    else this.showMessage('Hier ist nichts in Reichweite. Personen, Türen und leuchtende Marker reagieren auf Aktion.');
  }

  private nearestInteraction(): InteractionPoint | undefined {
    let nearest: InteractionPoint | undefined;
    let best = Number.POSITIVE_INFINITY;
    for (const point of this.interactions) {
      if (!isRegionUnlocked(point.regionId, this.state)) continue;
      const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, point.x, point.y);
      if (distance <= point.radius && distance < best) { nearest = point; best = distance; }
    }
    return nearest;
  }

  private onStoreUpdate(next: GameSnapshot): void {
    const previous = this.state;
    this.state = next;
    if (!next.encounter && this.message) this.message.setText(next.currentObjective);
    const open = Boolean(next.flags.gateOpen);
    if (open && !this.gateOpen) this.openGate();
    this.gateOpen = open;
    if (this.player) this.syncRegionLocks(next);
    if (previous && countFoundFriends(previous) !== countFoundFriends(next)) this.refreshMinimapLocks();
  }

  private openGate(): void {
    this.gateCollider?.destroy();
    this.gateZone?.destroy();
    this.gateZone = undefined;
    if (this.gate) this.tweens.add({ targets: this.gate.list.slice(4, 8), angle: -78, y: '-=43', x: '-=44', alpha: 0.88, duration: 800, ease: 'Back.Out' });
    this.showMessage('TOR GEÖFFNET · Das Südlager ist frei. Weitere Bereiche öffnen sich durch Fortschritt.');
  }

  private showRegion(region: WorldRegion): void {
    this.tweens.killTweensOf(this.banner);
    this.banner.setText(`${region.title.toUpperCase()}\n${region.subtitle}`).setAlpha(0).setY(55).setScale(0.96);
    this.tweens.add({ targets: this.banner, alpha: { from: 0, to: 1 }, y: 74, scale: 1, duration: 420, ease: 'Back.Out', hold: 1700, yoyo: true });
  }

  private showLockedHint(id: RegionId): void {
    this.showMessage(WORLD_REGIONS.find((region) => region.id === id)?.unlockHint ?? 'Dieser Bereich ist noch gesperrt.');
  }

  private showMessage(text: string): void {
    if (!this.message) return;
    this.tweens.killTweensOf(this.message);
    this.message.setText(text).setAlpha(1).setY(596);
    this.tweens.add({ targets: this.message, alpha: 0.84, duration: 2300, yoyo: true });
  }

  private updateLighting(): void {
    if (!this.night || !this.warmth) return;
    const hour = this.state.minutes / 60;
    let alpha = hour < 6 ? 0.64 : 0;
    if (hour >= 19) alpha = Math.min(0.64, (hour - 19) * 0.12);
    if (hour >= 6 && hour < 8) alpha = Math.max(0, 0.46 - (hour - 6) * 0.23);
    this.night.setAlpha(alpha);
    this.warmth.setAlpha((hour >= 17 && hour < 19) || (hour >= 6 && hour < 8) ? 0.12 : 0);
    this.lanterns.forEach((lamp) => lamp.setAlpha(Math.min(0.32, alpha * 0.55)));
    const flyAlpha = hour >= 18.5 || hour < 6 ? Math.min(0.9, 0.25 + alpha) : 0;
    this.fireflies.forEach((fly, index) => fly.setAlpha(flyAlpha * (0.6 + (index % 4) * 0.1)));
  }

  private makeObstacle(x: number, y: number, width: number, height: number): Phaser.GameObjects.Zone {
    const zone = this.add.zone(x + width / 2, y + height / 2, width, height);
    this.physics.add.existing(zone, true);
    return zone;
  }

  private npcStyle(): Phaser.Types.GameObjects.Text.TextStyle {
    return { fontFamily: 'system-ui', fontSize: '13px', fontStyle: 'bold', color: '#fff8dc', backgroundColor: '#173027d9', padding: { x: 6, y: 3 } };
  }
}

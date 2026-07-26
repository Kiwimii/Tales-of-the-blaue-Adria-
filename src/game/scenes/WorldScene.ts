import Phaser from 'phaser';
import { RELATIONSHIP_CHARACTERS } from '../content';
import { ACTION_EVENT, INPUT_EVENT, type InputEventDetail } from '../events';
import { gameStore } from '../state/GameStore';
import type { Direction, GameSnapshot } from '../types';
import {
  WORLD_ENTRANCES,
  WORLD_HEIGHT,
  WORLD_NPCS,
  WORLD_OBJECTS,
  WORLD_WIDTH,
  type WorldObject,
} from '../world';

interface InteractionPoint {
  id: string;
  x: number;
  y: number;
  radius: number;
  prompt: string;
  action: () => void;
}

export class WorldScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private keys?: Record<string, Phaser.Input.Keyboard.Key>;
  private activeDirections = new Set<Direction>();
  private interactionPoints: InteractionPoint[] = [];
  private message!: Phaser.GameObjects.Text;
  private prompt!: Phaser.GameObjects.Text;
  private nightOverlay!: Phaser.GameObjects.Rectangle;
  private lockedOverlay?: Phaser.GameObjects.Rectangle;
  private lockedLabel?: Phaser.GameObjects.Text;
  private gateVisual?: Phaser.GameObjects.Container;
  private gateCollider?: Phaser.GameObjects.Zone;
  private npcObstacles: Phaser.GameObjects.Zone[] = [];
  private lastNeedTick = 0;
  private unsubscribeStore?: () => void;
  private gateWasOpen = false;

  private readonly onMobileInput = (event: Event): void => {
    const detail = (event as CustomEvent<InputEventDetail>).detail;
    if (detail.active) this.activeDirections.add(detail.direction);
    else this.activeDirections.delete(detail.direction);
  };

  private readonly onAction = (): void => this.interact();

  constructor() {
    super('world');
  }

  create(): void {
    gameStore.setMode('world');
    const initial = gameStore.snapshot();
    this.gateWasOpen = Boolean(initial.flags.gateOpen);
    this.physics.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    this.drawGround();

    const obstacles = this.drawWorldObjects();
    this.drawGate(this.gateWasOpen);
    this.drawPeople();
    this.addEntrances();
    this.addActivities();

    const start = initial.worldPosition;
    this.player = this.physics.add.sprite(start.x, start.y, 'player');
    this.player.setCollideWorldBounds(true).setDepth(50);
    this.player.body?.setSize(20, 20).setOffset(6, 20);
    obstacles.forEach((obstacle) => this.physics.add.collider(this.player, obstacle));
    this.npcObstacles.forEach((obstacle) => this.physics.add.collider(this.player, obstacle));
    if (this.gateCollider) this.physics.add.collider(this.player, this.gateCollider);

    this.cameras.main.startFollow(this.player, true, 0.13, 0.13);
    this.cameras.main.setZoom(1.05);

    this.cursors = this.input.keyboard?.createCursorKeys();
    this.keys = this.input.keyboard?.addKeys('W,A,S,D,E,SPACE') as Record<string, Phaser.Input.Keyboard.Key>;
    this.keys?.E.on('down', () => this.interact());
    this.keys?.SPACE.on('down', () => this.interact());

    window.addEventListener(INPUT_EVENT, this.onMobileInput);
    window.addEventListener(ACTION_EVENT, this.onAction);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      window.removeEventListener(INPUT_EVENT, this.onMobileInput);
      window.removeEventListener(ACTION_EVENT, this.onAction);
      this.unsubscribeStore?.();
    });

    this.message = this.add.text(480, 596, initial.currentObjective, {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '17px',
      color: '#f5f1df',
      backgroundColor: '#14241fe9',
      padding: { x: 16, y: 10 },
      align: 'center',
      wordWrap: { width: 720 },
    }).setOrigin(0.5).setScrollFactor(0).setDepth(100);

    this.prompt = this.add.text(480, 545, '', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '14px',
      fontStyle: 'bold',
      color: '#173027',
      backgroundColor: '#f4d47be8',
      padding: { x: 12, y: 7 },
    }).setOrigin(0.5).setScrollFactor(0).setDepth(100).setVisible(false);

    this.unsubscribeStore = gameStore.subscribe((state) => this.onStoreUpdate(state));

    this.nightOverlay = this.add.rectangle(480, 320, 960, 640, 0x10254a, 0)
      .setScrollFactor(0)
      .setDepth(80)
      .setBlendMode(Phaser.BlendModes.MULTIPLY);
    this.time.addEvent({ delay: 1000, loop: true, callback: () => this.updateLighting() });
    this.updateLighting();
  }

  update(time: number): void {
    if (gameStore.snapshot().encounter) {
      this.player.setVelocity(0, 0);
      this.prompt.setVisible(false);
      return;
    }

    let horizontal = 0;
    let vertical = 0;
    if (this.cursors?.left.isDown || this.keys?.A.isDown || this.activeDirections.has('left')) horizontal -= 1;
    if (this.cursors?.right.isDown || this.keys?.D.isDown || this.activeDirections.has('right')) horizontal += 1;
    if (this.cursors?.up.isDown || this.keys?.W.isDown || this.activeDirections.has('up')) vertical -= 1;
    if (this.cursors?.down.isDown || this.keys?.S.isDown || this.activeDirections.has('down')) vertical += 1;

    const vector = new Phaser.Math.Vector2(horizontal, vertical).normalize().scale(158);
    this.player.setVelocity(vector.x, vector.y);
    if (horizontal || vertical) {
      if (horizontal) this.player.setFlipX(horizontal < 0);
      gameStore.setWorldPosition(this.player.x, this.player.y);
    }

    const nearby = this.nearestInteraction();
    this.prompt.setVisible(Boolean(nearby));
    if (nearby) this.prompt.setText(`AKTION · ${nearby.prompt}`);

    if (time - this.lastNeedTick > 12000) {
      this.lastNeedTick = time;
      gameStore.advanceMinutes(5);
    }
  }

  private drawGround(): void {
    const graphics = this.add.graphics();
    graphics.fillStyle(0x73965c, 1);
    graphics.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    graphics.fillStyle(0x4d91ae, 1);
    graphics.fillRoundedRect(1240, 30, 360, 760, 70);
    graphics.fillStyle(0x8ec7d4, 0.55);
    for (let y = 85; y < 760; y += 42) graphics.fillRoundedRect(1280, y, 270, 6, 3);
    graphics.fillStyle(0xe4cf91, 1);
    graphics.fillRoundedRect(1125, 535, 155, 270, 36);
    this.add.text(1290, 66, 'BLAUE ADRIA', this.zoneLabel('#eaf9ff')).setDepth(2);

    graphics.fillStyle(0xb9aa83, 1);
    graphics.fillRoundedRect(690, 785, 280, 315, 26);
    graphics.fillStyle(0xd0bd8d, 1);
    graphics.fillRoundedRect(770, 40, 170, 765, 28);
    graphics.fillRoundedRect(250, 380, 1030, 92, 30);
    graphics.fillRoundedRect(260, 650, 920, 78, 30);

    graphics.fillStyle(0x777d7b, 1);
    graphics.fillRoundedRect(510, 850, 690, 220, 24);
    graphics.lineStyle(4, 0xd8d4bd, 0.85);
    for (let x = 550; x < 1160; x += 102) {
      graphics.lineBetween(x, 885, x, 1018);
    }
    this.add.text(530, 866, 'ANKUNFT & PARKPLATZ', this.zoneLabel('#f7f4df')).setDepth(2);

    graphics.fillStyle(0x7e5c3c, 1);
    graphics.fillRect(1250, 545, 110, 16);
    graphics.fillRect(1350, 545, 16, 130);
    this.add.text(1152, 764, 'STRAND', this.zoneLabel('#433521')).setDepth(2);
    this.add.text(430, 690, 'SÜDLAGER', this.zoneLabel('#26301d')).setDepth(2);
    this.add.text(455, 395, 'NORDLAGER', this.zoneLabel('#26301d')).setDepth(2);
  }

  private drawWorldObjects(): Phaser.GameObjects.Zone[] {
    const obstacles: Phaser.GameObjects.Zone[] = [];
    for (const object of WORLD_OBJECTS) {
      this.drawObject(object);
      if (object.solid === false || object.kind === 'sign') continue;
      obstacles.push(this.makeObstacle(object.x, object.y, object.width, object.height));
    }
    obstacles.push(this.makeObstacle(1260, 38, 340, 735));
    return obstacles;
  }

  private drawObject(object: WorldObject): void {
    const graphics = this.add.graphics();
    const color = object.color ?? 0x7d5c3f;
    const { x, y, width, height } = object;

    if (object.kind === 'building') {
      graphics.fillStyle(0x000000, 0.2);
      graphics.fillRoundedRect(x + 10, y + 12, width, height, 16);
      graphics.fillStyle(color, 1);
      graphics.fillRoundedRect(x, y, width, height, 16);
      graphics.fillStyle(0x573526, 1);
      graphics.fillTriangle(x - 8, y + 18, x + width / 2, y - 42, x + width + 8, y + 18);
      graphics.lineStyle(4, 0xffffff, 0.18);
      graphics.strokeRoundedRect(x, y, width, height, 16);
    } else if (object.kind === 'tent' || object.kind === 'party-tent') {
      graphics.fillStyle(0x000000, 0.18);
      graphics.fillTriangle(x + 8, y + height + 8, x + width / 2 + 8, y + 8, x + width + 8, y + height + 8);
      graphics.fillStyle(color, 1);
      graphics.fillTriangle(x, y + height, x + width / 2, y, x + width, y + height);
      graphics.lineStyle(4, 0xf7e8bd, 0.45);
      graphics.lineBetween(x + width / 2, y + 7, x + width / 2, y + height);
    } else if (object.kind === 'camper') {
      graphics.fillStyle(0x000000, 0.18);
      graphics.fillRoundedRect(x + 8, y + 9, width, height, 18);
      graphics.fillStyle(color, 1);
      graphics.fillRoundedRect(x, y, width, height, 18);
      graphics.fillStyle(0x78a9bd, 1);
      graphics.fillRoundedRect(x + 24, y + 20, 62, 38, 6);
      graphics.fillRoundedRect(x + width - 83, y + 20, 58, 38, 6);
      graphics.fillStyle(0x272d2c, 1);
      graphics.fillCircle(x + 48, y + height, 17);
      graphics.fillCircle(x + width - 48, y + height, 17);
    } else if (object.kind === 'tree') {
      graphics.fillStyle(0x493621, 1);
      graphics.fillRect(x + width * 0.4, y + height * 0.53, width * 0.2, height * 0.46);
      graphics.fillStyle(0x315f37, 1);
      graphics.fillCircle(x + width * 0.5, y + height * 0.38, width * 0.46);
      graphics.fillStyle(0x56824b, 1);
      graphics.fillCircle(x + width * 0.35, y + height * 0.32, width * 0.25);
    } else if (object.kind === 'fence') {
      graphics.fillStyle(0x5f4a35, 1);
      graphics.fillRect(x, y, width, height);
      graphics.fillStyle(0xd5bf8f, 1);
      for (let post = x; post < x + width; post += 48) graphics.fillRect(post, y - 9, 9, height + 18);
    } else if (object.kind === 'table' || object.kind === 'bench') {
      graphics.fillStyle(0x6f472b, 1);
      graphics.fillRoundedRect(x, y, width, height, 8);
      graphics.lineStyle(4, 0xc48a4f, 0.75);
      graphics.lineBetween(x + 10, y + height / 2, x + width - 10, y + height / 2);
    } else {
      graphics.fillStyle(0x6b5136, 1);
      graphics.fillRect(x + width / 2 - 5, y + height * 0.55, 10, height * 0.55);
      graphics.fillStyle(0xe0c06e, 1);
      graphics.fillRoundedRect(x, y, width, height * 0.65, 6);
    }

    if (object.label) {
      this.add.text(x + width / 2, y + height / 2, object.label, {
        fontFamily: 'system-ui, sans-serif',
        fontSize: object.kind === 'sign' ? '11px' : '13px',
        fontStyle: 'bold',
        color: object.kind === 'building' ? '#fff4d2' : '#25301f',
        align: 'center',
      }).setOrigin(0.5).setDepth(6);
    }
  }

  private drawGate(open: boolean): void {
    const left = this.add.rectangle(778, 801, 36, 34, 0xd4ba76, 1);
    const right = this.add.rectangle(882, 801, 36, 34, 0xd4ba76, 1);
    const barrier = this.add.rectangle(830, 801, 92, 14, 0xd9584e, 1);
    const stripe1 = this.add.rectangle(810, 801, 18, 14, 0xffffff, 0.9).setAngle(-18);
    const stripe2 = this.add.rectangle(850, 801, 18, 14, 0xffffff, 0.9).setAngle(-18);
    this.gateVisual = this.add.container(0, 0, [left, right, barrier, stripe1, stripe2]).setDepth(25);
    if (open) {
      barrier.setAngle(-78).setPosition(786, 758);
      stripe1.setVisible(false);
      stripe2.setVisible(false);
    } else {
      this.gateCollider = this.makeObstacle(760, 786, 140, 34);
      this.lockedOverlay = this.add.rectangle(800, 390, 1600, 780, 0x12261f, 0.2).setDepth(24);
      this.lockedLabel = this.add.text(830, 750, 'CAMPINGPLATZ GESPERRT', {
        fontFamily: 'system-ui, sans-serif',
        fontSize: '22px',
        fontStyle: 'bold',
        color: '#ffe09a',
        backgroundColor: '#13251fe6',
        padding: { x: 16, y: 9 },
      }).setOrigin(0.5).setDepth(26);
    }
  }

  private drawPeople(): void {
    for (const placement of WORLD_NPCS) {
      const character = RELATIONSHIP_CHARACTERS.find((entry) => entry.id === placement.id);
      if (!character) continue;
      const sprite = this.physics.add.staticSprite(placement.x, placement.y, `npc-${placement.id}`).setDepth(42);
      this.add.text(placement.x, placement.y - 38, character.name, this.npcStyle())
        .setOrigin(0.5)
        .setDepth(43);
      const solid = this.add.zone(sprite.x, sprite.y + 8, 28, 26);
      this.physics.add.existing(solid, true);
      this.npcObstacles.push(solid);
      this.interactionPoints.push({
        id: `npc-${placement.id}`,
        x: placement.x,
        y: placement.y,
        radius: 72,
        prompt: `Mit ${character.name} sprechen`,
        action: () => this.talkToCharacter(character.id),
      });
    }
  }

  private addEntrances(): void {
    for (const entrance of WORLD_ENTRANCES) {
      this.add.image(entrance.x, entrance.y, 'door-marker').setDepth(34);
      this.interactionPoints.push({
        id: entrance.id,
        x: entrance.x,
        y: entrance.y,
        radius: 64,
        prompt: entrance.label,
        action: () => {
          const state = gameStore.snapshot();
          if (entrance.requiresGate && !state.flags.gateOpen) {
            this.showMessage('Das liegt hinter dem geschlossenen Tor. Erst Gundula, dann Uli.');
            return;
          }
          gameStore.setWorldPosition(this.player.x, this.player.y);
          gameStore.enterInterior(entrance.interiorId);
          this.scene.start('interior');
        },
      });
    }
  }

  private addActivities(): void {
    this.addActivity(260, 340, 'CAMPING-DUELL', 'Ronny herausfordern', () => {
      const state = gameStore.snapshot();
      if (!state.flags.gateOpen) return this.showMessage('Ronny wartet hinter dem Tor. Leider redet er trotzdem hörbar.');
      if (state.flags.firstBattleWon) return this.showMessage('Ronny wurde bereits überzeugt. Sein Vortrag läuft außer Konkurrenz weiter.');
      gameStore.setWorldPosition(this.player.x, this.player.y);
      this.scene.start('battle');
    });

    this.addActivity(1165, 715, 'FLUNKYBALL', 'Flunkyball starten', () => {
      const state = gameStore.snapshot();
      if (!state.flags.gateOpen) return this.showMessage('Der Strand bleibt bis zum Einlass unerreichbar.');
      if (state.flags.flunkyballWon) return this.showMessage('Die Strandstaffel ist bereits gewonnen. Der Rufbonus bleibt einmalig.');
      gameStore.setWorldPosition(this.player.x, this.player.y);
      this.scene.start('flunkyball');
    });
  }

  private addActivity(x: number, y: number, label: string, prompt: string, action: () => void): void {
    this.add.image(x, y, 'activity-marker').setDepth(32);
    this.add.text(x, y + 27, label, this.npcStyle()).setOrigin(0.5).setDepth(33);
    this.interactionPoints.push({ id: label, x, y, radius: 68, prompt, action });
  }

  private talkToCharacter(id: string): void {
    const state = gameStore.snapshot();
    if (id === 'gundula') {
      if (state.flags.gundulaConvinced) {
        gameStore.socialize(id);
        this.showMessage('Gundula: „Der erste Eindruck war ausreichend. Ruinier ihn nicht rückwirkend.“');
      } else {
        gameStore.openEncounter('gundula-entry');
      }
      return;
    }

    if (id === 'uli') {
      if (!state.flags.gundulaConvinced) {
        this.showMessage('Uli: „Erst Anmeldung bei Gundula. Ich bin hier für Geometrie, nicht für Gefühle.“');
      } else if (state.flags.uliConvinced) {
        gameStore.socialize(id);
        this.showMessage('Uli: „Parkplatz vier bleibt Parkplatz vier. Wir verstehen uns.“');
      } else {
        gameStore.openEncounter('uli-entry');
      }
      return;
    }

    if (!state.flags.gateOpen) {
      this.showMessage('Die Person steht hinter dem gesperrten Tor. Verwaltungsphysik ist unerbittlich.');
      return;
    }

    if (id === 'manni' && state.quests.paper.status !== 'completed') {
      gameStore.openEncounter('manni-paper');
      return;
    }
    if (id === 'ronny' && !state.flags.firstBattleWon) {
      this.showMessage('Ronny: „Reden können wir nach dem Camping-Duell. Vorher rede nur ich.“');
      return;
    }

    const character = RELATIONSHIP_CHARACTERS.find((entry) => entry.id === id);
    if (!character) return;
    const first = gameStore.socialize(id);
    this.showMessage(first ? `${character.name} gefunden · Beziehung +${character.group === 'freunde' ? 8 : 3}` : character.line);
  }

  private interact(): void {
    const nearest = this.nearestInteraction();
    if (!nearest) {
      this.showMessage('Hier ist nichts in Reichweite. Personen, Türen und goldene Marker reagieren auf Aktion.');
      return;
    }
    nearest.action();
  }

  private nearestInteraction(): InteractionPoint | undefined {
    if (!this.player) return undefined;
    return this.interactionPoints
      .map((point) => ({
        point,
        distance: Phaser.Math.Distance.Between(this.player.x, this.player.y, point.x, point.y),
      }))
      .filter(({ point, distance }) => distance <= point.radius)
      .sort((a, b) => a.distance - b.distance)[0]?.point;
  }

  private onStoreUpdate(state: GameSnapshot): void {
    if (!state.encounter && this.message) this.message.setText(state.currentObjective);
    const isOpen = Boolean(state.flags.gateOpen);
    if (isOpen && !this.gateWasOpen) this.openGate();
    this.gateWasOpen = isOpen;
  }

  private openGate(): void {
    this.gateCollider?.destroy();
    this.gateCollider = undefined;
    if (this.gateVisual) {
      const movable = this.gateVisual.list.slice(2);
      this.tweens.add({
        targets: movable,
        angle: -78,
        y: '-=43',
        x: '-=44',
        alpha: 0.88,
        duration: 800,
        ease: 'Back.Out',
      });
    }
    if (this.lockedOverlay) this.tweens.add({ targets: this.lockedOverlay, alpha: 0, duration: 900 });
    if (this.lockedLabel) this.tweens.add({ targets: this.lockedLabel, alpha: 0, y: '-=35', duration: 650 });
    this.cameras.main.flash(450, 244, 212, 123, false);
    this.showMessage('TOR GEÖFFNET · Der gesamte Campingplatz ist jetzt freigeschaltet.');
  }

  private makeObstacle(x: number, y: number, width: number, height: number): Phaser.GameObjects.Zone {
    const zone = this.add.zone(x + width / 2, y + height / 2, width, height);
    this.physics.add.existing(zone, true);
    return zone;
  }

  private showMessage(text: string): void {
    if (!this.message) return;
    this.message.setText(text).setAlpha(1);
    this.tweens.killTweensOf(this.message);
    this.tweens.add({ targets: this.message, alpha: 0.84, duration: 2400, yoyo: true });
  }

  private updateLighting(): void {
    const { minutes } = gameStore.snapshot();
    const hour = minutes / 60;
    let alpha = 0;
    if (hour >= 19) alpha = Math.min(0.62, (hour - 19) * 0.12);
    if (hour < 6) alpha = 0.62;
    if (hour >= 6 && hour < 8) alpha = Math.max(0, 0.45 - (hour - 6) * 0.22);
    this.nightOverlay.setAlpha(alpha);
  }

  private zoneLabel(color: string): Phaser.Types.GameObjects.Text.TextStyle {
    return { fontFamily: 'system-ui, sans-serif', fontSize: '16px', fontStyle: 'bold', color };
  }

  private npcStyle(): Phaser.Types.GameObjects.Text.TextStyle {
    return {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '13px',
      fontStyle: 'bold',
      color: '#fff8dc',
      backgroundColor: '#173027d9',
      padding: { x: 6, y: 3 },
    };
  }
}

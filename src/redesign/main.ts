import Phaser from 'phaser';
import './styles.css';
import {
  DESIGNED_FRAMES,
  DESIGNED_TENTS,
  INITIAL_PROGRESS,
  NPCS,
  QUEST_STEPS,
  REDESIGN_ASSETS,
  REDESIGN_BUILD_ID,
  REDESIGN_SAVE_KEY,
  SUPPLIES,
  TILE_SIZE,
  WORLD_DECORATIONS,
  WORLD_SIZE,
  type DesignedFrameId,
  type RedesignProgress,
} from './content';

type Direction = 'up' | 'down' | 'left' | 'right';

interface Interaction {
  id: string;
  label: string;
  x: number;
  y: number;
  radius: number;
  active: () => boolean;
  run: () => void;
}

const dom = {
  mount: requiredElement<HTMLDivElement>('redesign-game'),
  intro: requiredElement<HTMLElement>('intro'),
  start: requiredElement<HTMLButtonElement>('start-redesign'),
  reset: requiredElement<HTMLButtonElement>('reset-progress'),
  questKicker: requiredElement<HTMLElement>('quest-kicker'),
  questTitle: requiredElement<HTMLElement>('quest-title'),
  questObjective: requiredElement<HTMLElement>('quest-objective'),
  questProgress: requiredElement<HTMLElement>('quest-progress'),
  worldTime: requiredElement<HTMLElement>('world-time'),
  inventory: requiredElement<HTMLElement>('inventory-card'),
  prompt: requiredElement<HTMLElement>('interaction-prompt'),
  promptLabel: requiredElement<HTMLElement>('interaction-label'),
  dialog: requiredElement<HTMLElement>('dialog'),
  dialogPortrait: requiredElement<HTMLElement>('dialog-portrait'),
  dialogRole: requiredElement<HTMLElement>('dialog-role'),
  dialogTitle: requiredElement<HTMLElement>('dialog-title'),
  dialogBody: requiredElement<HTMLElement>('dialog-body'),
  dialogClose: requiredElement<HTMLButtonElement>('dialog-close'),
  mobileAction: requiredElement<HTMLButtonElement>('mobile-action'),
};

let progress = loadProgress();
let dialogOpen = false;

function requiredElement<T extends HTMLElement>(id: string): T {
  const element = document.getElementById(id);
  if (!element) throw new Error(`Missing redesign element: ${id}`);
  return element as T;
}

function loadProgress(): RedesignProgress {
  try {
    const stored = localStorage.getItem(REDESIGN_SAVE_KEY);
    if (!stored) return structuredClone(INITIAL_PROGRESS);
    const parsed = JSON.parse(stored) as Partial<RedesignProgress>;
    return {
      questIndex: clampInteger(parsed.questIndex, 0, QUEST_STEPS.length - 1, 0),
      supplies: Array.isArray(parsed.supplies) ? parsed.supplies.filter((id): id is string => typeof id === 'string') : [],
      friends: Array.isArray(parsed.friends) ? parsed.friends.filter((id): id is string => typeof id === 'string') : [],
      fireLit: Boolean(parsed.fireLit),
      lakeReached: Boolean(parsed.lakeReached),
      player: {
        x: typeof parsed.player?.x === 'number' ? parsed.player.x : INITIAL_PROGRESS.player.x,
        y: typeof parsed.player?.y === 'number' ? parsed.player.y : INITIAL_PROGRESS.player.y,
      },
    };
  } catch {
    return structuredClone(INITIAL_PROGRESS);
  }
}

function clampInteger(value: unknown, min: number, max: number, fallback: number): number {
  if (typeof value !== 'number' || !Number.isInteger(value)) return fallback;
  return Math.max(min, Math.min(max, value));
}

function saveProgress(): void {
  localStorage.setItem(REDESIGN_SAVE_KEY, JSON.stringify(progress));
  updateHud();
}

function updateHud(): void {
  const quest = QUEST_STEPS[progress.questIndex] ?? QUEST_STEPS[0];
  dom.questKicker.textContent = quest.id.toUpperCase();
  dom.questTitle.textContent = quest.title;
  dom.questObjective.textContent = quest.objective;
  dom.questProgress.textContent = `${Math.min(progress.questIndex, 5)} / 5`;

  const inventory = [
    ...progress.supplies.map((id) => SUPPLIES.find((item) => item.id === id)?.label ?? id),
    ...(progress.fireLit ? ['Lagerfeuer entzündet'] : []),
    ...(progress.lakeReached ? ['Strand erreicht'] : []),
  ];
  dom.inventory.replaceChildren();
  if (!inventory.length) {
    const empty = document.createElement('span');
    empty.className = 'inventory-empty';
    empty.textContent = 'Noch keine Questgegenstände';
    dom.inventory.append(empty);
  } else {
    for (const label of inventory) {
      const chip = document.createElement('span');
      chip.className = 'inventory-chip';
      chip.textContent = label;
      dom.inventory.append(chip);
    }
  }
}

function showPrompt(label?: string): void {
  dom.prompt.hidden = !label;
  if (label) dom.promptLabel.textContent = label;
  dom.mobileAction.textContent = label ? 'AKTION' : '…';
  dom.mobileAction.classList.toggle('is-ready', Boolean(label));
}

function showDialog(title: string, role: string, body: string): void {
  dialogOpen = true;
  dom.dialogPortrait.textContent = title.slice(0, 1).toUpperCase();
  dom.dialogRole.textContent = role.toUpperCase();
  dom.dialogTitle.textContent = title;
  dom.dialogBody.textContent = body;
  dom.dialog.hidden = false;
}

function closeDialog(): void {
  dialogOpen = false;
  dom.dialog.hidden = true;
}

class RedesignBootScene extends Phaser.Scene {
  constructor() {
    super('RedesignBoot');
  }

  preload(): void {
    this.load.setCORS('anonymous');
    this.load.image('redesign-village', REDESIGN_ASSETS.village);
    this.load.spritesheet('redesign-player-sheet', REDESIGN_ASSETS.player, { frameWidth: 16, frameHeight: 16 });
  }

  create(): void {
    this.createCoreTextures();
    this.registerVillageFrames();
    this.createTentTextures();
    this.createPlayerFallback();
    this.scene.start('RedesignWorld');
  }

  private createCoreTextures(): void {
    makeTile(this, 'grass-tile', 0x648b58, 0x719a61, 0x547b4c, [[5, 7], [20, 4], [27, 18], [11, 25]]);
    makeTile(this, 'dark-grass-tile', 0x4d7250, 0x5c825a, 0x3f6345, [[7, 5], [18, 11], [26, 25], [4, 27]]);
    makeTile(this, 'path-tile', 0xb99561, 0xc9aa73, 0x927148, [[4, 8], [15, 4], [24, 13], [10, 24], [28, 27]]);
    makeTile(this, 'sand-tile', 0xd9c07d, 0xe6d08f, 0xbfa463, [[6, 5], [22, 8], [13, 18], [28, 24], [4, 27]]);

    const water = this.make.graphics({ x: 0, y: 0 });
    water.fillStyle(0x286b82).fillRect(0, 0, 32, 32);
    water.fillStyle(0x347f94, 0.72).fillRect(0, 5, 13, 2).fillRect(19, 18, 11, 2);
    water.fillStyle(0x6aa8b3, 0.6).fillRect(8, 12, 14, 2).fillRect(2, 27, 10, 1);
    water.generateTexture('water-tile', 32, 32);
    water.destroy();

    const marker = this.make.graphics({ x: 0, y: 0 });
    marker.fillStyle(0x10251f, 0.7).fillCircle(20, 20, 17);
    marker.lineStyle(3, 0xf0d18a, 1).strokeCircle(20, 20, 14);
    marker.fillStyle(0xf0d18a).fillCircle(20, 20, 5);
    marker.generateTexture('quest-marker', 40, 40);
    marker.destroy();

    const fallback = this.make.graphics({ x: 0, y: 0 });
    fallback.fillStyle(0x17352c).fillRoundedRect(2, 2, 60, 58, 5);
    fallback.lineStyle(3, 0xd7b66c).strokeRoundedRect(2, 2, 60, 58, 5);
    fallback.fillStyle(0x8a5a3c).fillRect(14, 29, 36, 31);
    fallback.fillStyle(0xc46c48).fillTriangle(8, 30, 32, 7, 56, 30);
    fallback.generateTexture('fallback-building', 64, 64);
    fallback.destroy();
  }

  private registerVillageFrames(): void {
    if (!this.textures.exists('redesign-village')) return;
    const texture = this.textures.get('redesign-village');
    texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
    for (const [id, frame] of Object.entries(DESIGNED_FRAMES) as [DesignedFrameId, (typeof DESIGNED_FRAMES)[DesignedFrameId]][]) {
      if (!texture.has(id)) texture.add(id, 0, frame.x, frame.y, frame.width, frame.height);
    }
  }

  private createTentTextures(): void {
    for (const tent of DESIGNED_TENTS) {
      const graphics = this.make.graphics({ x: 0, y: 0 });
      graphics.fillStyle(0x07120f, 0.25).fillEllipse(40, 53, 70, 13);
      graphics.fillStyle(0x1b2a24).fillTriangle(5, 49, 40, 5, 75, 49);
      graphics.fillStyle(tent.color).fillTriangle(8, 47, 40, 8, 72, 47);
      graphics.fillStyle(Phaser.Display.Color.IntegerToColor(tent.color).darken(20).color).fillTriangle(40, 8, 72, 47, 40, 47);
      graphics.lineStyle(2, tent.accent, 0.95).lineBetween(40, 8, 40, 48).lineBetween(8, 47, 72, 47);
      graphics.fillStyle(0x24352c).fillTriangle(31, 47, 40, 28, 49, 47);
      graphics.fillStyle(tent.accent, 0.55).fillTriangle(35, 47, 40, 34, 40, 47);
      graphics.generateTexture(`tent-${tent.id}`, 80, 60);
      graphics.destroy();
    }
  }

  private createPlayerFallback(): void {
    const graphics = this.make.graphics({ x: 0, y: 0 });
    graphics.fillStyle(0x07120f, 0.28).fillEllipse(16, 29, 23, 6);
    graphics.fillStyle(0x2a4037).fillRect(8, 15, 16, 12);
    graphics.fillStyle(0xc65d42).fillRect(9, 14, 14, 10);
    graphics.fillStyle(0xf0c7a2).fillCircle(16, 9, 7);
    graphics.fillStyle(0x4c3024).fillRect(10, 3, 12, 5);
    graphics.fillStyle(0xe8dfc6).fillRect(8, 26, 6, 4).fillRect(18, 26, 6, 4);
    graphics.generateTexture('player-fallback', 32, 32);
    graphics.destroy();
  }
}

class RedesignWorldScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private playerShadow!: Phaser.GameObjects.Ellipse;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private keys?: Record<string, Phaser.Input.Keyboard.Key>;
  private activeDirections = new Set<Direction>();
  private interactions: Interaction[] = [];
  private currentInteraction?: Interaction;
  private obstacles: Phaser.GameObjects.Zone[] = [];
  private supplyVisuals = new Map<string, Phaser.GameObjects.GameObject>();
  private npcSprites = new Map<string, Phaser.Physics.Arcade.Sprite>();
  private questMarker?: Phaser.GameObjects.Image;
  private water?: Phaser.GameObjects.TileSprite;
  private campfire?: Phaser.GameObjects.Container;
  private fireFlame?: Phaser.GameObjects.Triangle;
  private inputEnabled = false;
  private elapsedWorldTime = 0;
  private lastSavedAt = 0;

  constructor() {
    super('RedesignWorld');
  }

  create(): void {
    this.physics.world.setBounds(0, 0, WORLD_SIZE.width, WORLD_SIZE.height);
    this.cameras.main.setBounds(0, 0, WORLD_SIZE.width, WORLD_SIZE.height);
    this.cameras.main.setBackgroundColor('#315848');

    this.drawWorldBase();
    this.drawZoneIdentity();
    this.createDecorations();
    this.createTentCircle();
    this.createCampfire();
    this.createSupplies();
    this.createNpcs();
    this.createPlayer();
    this.createInteractions();
    this.createQuestMarker();
    this.installInput();

    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);
    this.cameras.main.setZoom(1.28);
    this.cameras.main.fadeIn(500, 8, 20, 16);

    window.addEventListener('adria:redesign-start', this.onStart);
    window.addEventListener('adria:redesign-input', this.onMobileInput as EventListener);
    window.addEventListener('adria:redesign-action', this.onAction);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      window.removeEventListener('adria:redesign-start', this.onStart);
      window.removeEventListener('adria:redesign-input', this.onMobileInput as EventListener);
      window.removeEventListener('adria:redesign-action', this.onAction);
    });

    updateHud();
    this.updateQuestMarker();
  }

  update(_time: number, delta: number): void {
    this.elapsedWorldTime += delta;
    this.animateEnvironment();
    this.updateMovement();
    this.updateInteractionPrompt();
    this.updateWorldClock();

    if (this.inputEnabled && !dialogOpen && this.elapsedWorldTime - this.lastSavedAt > 1500) {
      progress.player = { x: Math.round(this.player.x), y: Math.round(this.player.y) };
      saveProgress();
      this.lastSavedAt = this.elapsedWorldTime;
    }
  }

  private drawWorldBase(): void {
    this.add.tileSprite(WORLD_SIZE.width / 2, WORLD_SIZE.height / 2, WORLD_SIZE.width, WORLD_SIZE.height, 'grass-tile').setDepth(0);
    this.add.tileSprite(1140, 510, 510, 1020, 'dark-grass-tile').setDepth(1);
    this.add.tileSprite(1395, 510, 282, 1020, 'water-tile').setDepth(2);
    this.water = this.children.list.at(-1) as Phaser.GameObjects.TileSprite;
    this.add.tileSprite(1230, 510, 90, 1020, 'sand-tile').setDepth(3);

    this.add.tileSprite(430, 865, 780, 90, 'path-tile').setDepth(4);
    this.add.tileSprite(680, 690, 82, 430, 'path-tile').setDepth(4);
    this.add.tileSprite(990, 770, 610, 78, 'path-tile').setDepth(4);
    this.add.tileSprite(1000, 480, 80, 520, 'path-tile').setDepth(4);
    this.add.tileSprite(1125, 385, 330, 70, 'path-tile').setDepth(4);
    this.add.tileSprite(1215, 535, 120, 60, 'sand-tile').setDepth(5);

    const clearing = this.add.ellipse(680, 525, 480, 360, 0x84a969, 0.62).setDepth(3);
    clearing.setStrokeStyle(5, 0xaec786, 0.45);
    this.add.ellipse(1050, 360, 350, 260, 0x748a58, 0.5).setDepth(3).setStrokeStyle(4, 0xd5b867, 0.32);

    const shoreline = this.add.graphics().setDepth(6);
    shoreline.lineStyle(5, 0xf1d998, 0.75);
    shoreline.lineBetween(1273, 0, 1273, WORLD_SIZE.height);
    shoreline.lineStyle(2, 0x8cc0bf, 0.7);
    for (let y = 16; y < WORLD_SIZE.height; y += 34) shoreline.lineBetween(1280, y, 1304, y + 5);

    this.addObstacle(1388, 510, 250, 1020);
  }

  private drawZoneIdentity(): void {
    this.createAreaLabel(280, 730, 'REZEPTION', 'Anmeldung & Schranke');
    this.createAreaLabel(680, 325, 'TAUCHERPLATZ', 'Zeltkreis & Feuerstelle');
    this.createAreaLabel(1115, 660, 'SERVICEHOF', 'Versorgung & Material');
    this.createAreaLabel(1050, 235, 'FESTWIESE', 'Bühne & Gemeinschaft');
    this.createAreaLabel(1215, 455, 'STRAND', 'Blaue Adria');
  }

  private createAreaLabel(x: number, y: number, title: string, subtitle: string): void {
    const text = this.add.text(x, y, `${title}\n${subtitle}`, {
      fontFamily: 'Courier New, monospace',
      fontSize: '12px',
      color: '#fff1c1',
      align: 'center',
      backgroundColor: '#10251fdd',
      padding: { x: 8, y: 5 },
      stroke: '#07120f',
      strokeThickness: 2,
    }).setOrigin(0.5).setDepth(14);
    text.setAlpha(0.9);
  }

  private createDecorations(): void {
    const hasSheet = this.textures.exists('redesign-village');
    for (const decoration of WORLD_DECORATIONS) {
      const image = hasSheet
        ? this.add.image(decoration.x, decoration.y, 'redesign-village', decoration.frame)
        : this.add.image(decoration.x, decoration.y, 'fallback-building');
      image.setOrigin(0.5, 1).setScale(decoration.scale).setFlipX(decoration.flipX ?? false).setAlpha(decoration.alpha ?? 1);
      image.setDepth(depthFor(decoration.y));
      if (decoration.obstacle) {
        this.addObstacle(
          decoration.x,
          decoration.y + (decoration.obstacle.offsetY ?? 0),
          decoration.obstacle.width,
          decoration.obstacle.height,
        );
      }
    }
  }

  private createTentCircle(): void {
    for (const tent of DESIGNED_TENTS) {
      const sprite = this.add.image(tent.x, tent.y, `tent-${tent.id}`)
        .setOrigin(0.5, 1)
        .setScale(1.55)
        .setRotation(tent.rotation ?? 0)
        .setDepth(depthFor(tent.y));
      this.addObstacle(tent.x, tent.y - 20, 76, 38);
      this.add.text(tent.x, tent.y + 10, tent.label, {
        fontFamily: 'Courier New, monospace', fontSize: '10px', color: '#f7e8ba',
        backgroundColor: '#10251fcc', padding: { x: 5, y: 2 },
      }).setOrigin(0.5).setDepth(sprite.depth + 1);
    }
  }

  private createCampfire(): void {
    const shadow = this.add.ellipse(0, 14, 74, 26, 0x07120f, 0.3);
    const stoneRing = this.add.ellipse(0, 4, 64, 30, 0x82715b).setStrokeStyle(4, 0xb9a176, 1);
    const logA = this.add.rectangle(0, 2, 48, 8, 0x6f422b).setRotation(0.55);
    const logB = this.add.rectangle(0, 2, 48, 8, 0x865037).setRotation(-0.55);
    this.fireFlame = this.add.triangle(0, -8, 0, 22, -12, 0, 12, 0, 0xf4b34f, 0.95).setVisible(progress.fireLit);
    const core = this.add.triangle(0, -4, 0, 12, -6, 1, 6, 1, 0xffe08a, 0.96).setVisible(progress.fireLit);
    this.campfire = this.add.container(680, 525, [shadow, stoneRing, logA, logB, this.fireFlame, core]).setDepth(depthFor(530));
  }

  private createSupplies(): void {
    for (const supply of SUPPLIES) {
      if (progress.supplies.includes(supply.id)) continue;
      const visual = this.textures.exists('redesign-village')
        ? this.add.image(supply.x, supply.y, 'redesign-village', supply.frame).setScale(2.4)
        : this.add.image(supply.x, supply.y, 'fallback-building').setScale(0.55);
      visual.setDepth(depthFor(supply.y));
      const marker = this.add.circle(supply.x, supply.y + 23, 8, 0xf0d18a, 0.85).setStrokeStyle(2, 0x10251f, 1).setDepth(depthFor(supply.y + 25));
      const container = this.add.container(0, 0, [visual, marker]);
      this.supplyVisuals.set(supply.id, container);
      this.tweens.add({ targets: marker, alpha: { from: 0.35, to: 1 }, scale: { from: 0.8, to: 1.2 }, duration: 850, yoyo: true, repeat: -1 });
    }
  }

  private createNpcs(): void {
    for (const [index, npc] of NPCS.entries()) {
      const sprite = this.physics.add.sprite(
        npc.x,
        npc.y,
        this.textures.exists('redesign-player-sheet') ? 'redesign-player-sheet' : 'player-fallback',
        this.textures.exists('redesign-player-sheet') ? 16 + (index % 8) : undefined,
      );
      sprite.setScale(this.textures.exists('redesign-player-sheet') ? 2.3 : 1.25).setTint(npc.tint).setDepth(depthFor(npc.y));
      sprite.body?.setSize(10, 8).setOffset(3, 8);
      sprite.setImmovable(true);
      this.npcSprites.set(npc.id, sprite);
      this.add.text(npc.x, npc.y + 26, npc.name, {
        fontFamily: 'Courier New, monospace', fontSize: '10px', color: '#fff0bd',
        backgroundColor: '#10251fdc', padding: { x: 5, y: 2 },
      }).setOrigin(0.5).setDepth(depthFor(npc.y + 27));
    }
  }

  private createPlayer(): void {
    const key = this.textures.exists('redesign-player-sheet') ? 'redesign-player-sheet' : 'player-fallback';
    this.playerShadow = this.add.ellipse(progress.player.x, progress.player.y + 17, 32, 10, 0x07120f, 0.32).setDepth(60);
    this.player = this.physics.add.sprite(progress.player.x, progress.player.y, key, key === 'redesign-player-sheet' ? 0 : undefined);
    this.player.setScale(key === 'redesign-player-sheet' ? 2.45 : 1.2).setDepth(70).setCollideWorldBounds(true);
    this.player.body?.setSize(key === 'redesign-player-sheet' ? 9 : 18, key === 'redesign-player-sheet' ? 7 : 12)
      .setOffset(key === 'redesign-player-sheet' ? 4 : 7, key === 'redesign-player-sheet' ? 9 : 17);

    for (const obstacle of this.obstacles) this.physics.add.collider(this.player, obstacle);
    for (const npc of this.npcSprites.values()) this.physics.add.collider(this.player, npc);

    if (key === 'redesign-player-sheet') this.createPlayerAnimations();
  }

  private createPlayerAnimations(): void {
    const animationRows: Record<Direction, number[]> = {
      down: [0, 1, 2, 3], right: [4, 5, 6, 7], up: [8, 9, 10, 11], left: [12, 13, 14, 15],
    };
    for (const [direction, frames] of Object.entries(animationRows) as [Direction, number[]][]) {
      const key = `redesign-walk-${direction}`;
      if (this.anims.exists(key)) continue;
      this.anims.create({ key, frames: frames.map((frame) => ({ key: 'redesign-player-sheet', frame })), frameRate: 8, repeat: -1 });
    }
  }

  private createInteractions(): void {
    for (const npc of NPCS) {
      this.interactions.push({
        id: `npc-${npc.id}`,
        label: `Mit ${npc.name} sprechen`,
        x: npc.x,
        y: npc.y,
        radius: 70,
        active: () => true,
        run: () => this.talkToNpc(npc.id),
      });
    }

    for (const supply of SUPPLIES) {
      this.interactions.push({
        id: `supply-${supply.id}`,
        label: `${supply.label} aufnehmen`,
        x: supply.x,
        y: supply.y,
        radius: 62,
        active: () => progress.questIndex >= 1 && !progress.supplies.includes(supply.id),
        run: () => this.collectSupply(supply.id),
      });
    }

    this.interactions.push({
      id: 'campfire', label: 'Lagerfeuer entzünden', x: 680, y: 525, radius: 74,
      active: () => progress.questIndex >= 3 && !progress.fireLit,
      run: () => this.lightCampfire(),
    });
    this.interactions.push({
      id: 'lake', label: 'Wasser prüfen', x: 1232, y: 535, radius: 72,
      active: () => progress.questIndex >= 4 && !progress.lakeReached,
      run: () => this.reachLake(),
    });
  }

  private createQuestMarker(): void {
    this.questMarker = this.add.image(0, 0, 'quest-marker').setDepth(500);
    this.tweens.add({ targets: this.questMarker, y: '+=8', duration: 780, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
    this.updateQuestMarker();
  }

  private installInput(): void {
    this.cursors = this.input.keyboard?.createCursorKeys();
    this.keys = this.input.keyboard?.addKeys('W,A,S,D,E,SPACE') as Record<string, Phaser.Input.Keyboard.Key>;
    this.keys?.E.on('down', this.performAction, this);
    this.keys?.SPACE.on('down', this.performAction, this);
  }

  private updateMovement(): void {
    if (!this.inputEnabled || dialogOpen) {
      this.player.setVelocity(0);
      this.player.anims.stop();
      return;
    }

    const left = Boolean(this.cursors?.left.isDown || this.keys?.A.isDown || this.activeDirections.has('left'));
    const right = Boolean(this.cursors?.right.isDown || this.keys?.D.isDown || this.activeDirections.has('right'));
    const up = Boolean(this.cursors?.up.isDown || this.keys?.W.isDown || this.activeDirections.has('up'));
    const down = Boolean(this.cursors?.down.isDown || this.keys?.S.isDown || this.activeDirections.has('down'));
    const x = Number(right) - Number(left);
    const y = Number(down) - Number(up);
    const vector = new Phaser.Math.Vector2(x, y);
    if (vector.lengthSq() > 0) vector.normalize().scale(150);
    this.player.setVelocity(vector.x, vector.y);
    this.player.setDepth(depthFor(this.player.y));
    this.playerShadow.setPosition(this.player.x, this.player.y + 17).setDepth(this.player.depth - 1);

    if (!this.textures.exists('redesign-player-sheet')) return;
    let direction: Direction | undefined;
    if (Math.abs(vector.x) > Math.abs(vector.y)) direction = vector.x > 0 ? 'right' : 'left';
    else if (vector.y !== 0) direction = vector.y > 0 ? 'down' : 'up';
    if (direction) this.player.anims.play(`redesign-walk-${direction}`, true);
    else this.player.anims.stop();
  }

  private updateInteractionPrompt(): void {
    const candidates = this.interactions
      .filter((interaction) => interaction.active())
      .map((interaction) => ({ interaction, distance: Phaser.Math.Distance.Between(this.player.x, this.player.y, interaction.x, interaction.y) }))
      .filter(({ interaction, distance }) => distance <= interaction.radius)
      .sort((a, b) => a.distance - b.distance);
    this.currentInteraction = candidates[0]?.interaction;
    showPrompt(this.inputEnabled && !dialogOpen ? this.currentInteraction?.label : undefined);
  }

  private performAction(): void {
    if (!this.inputEnabled) return;
    if (dialogOpen) {
      closeDialog();
      return;
    }
    this.currentInteraction?.run();
  }

  private talkToNpc(id: string): void {
    const npc = NPCS.find((entry) => entry.id === id);
    if (!npc) return;

    if (id === 'gundula' && progress.questIndex === 0) {
      progress.questIndex = 1;
      saveProgress();
      this.updateQuestMarker();
      showDialog(npc.name, npc.role, `${npc.dialogue} Die Anmeldung ist erledigt. Jetzt holt ihr die drei Versorgungspakete.`);
      return;
    }

    if (['andre', 'rene', 'lars', 'danny'].includes(id) && progress.questIndex >= 2 && !progress.friends.includes(id)) {
      progress.friends.push(id);
      if (progress.friends.length >= 4 && progress.questIndex === 2) progress.questIndex = 3;
      saveProgress();
      this.updateQuestMarker();
      showDialog(npc.name, npc.role, `${npc.dialogue} (${progress.friends.length}/4 Freunde getroffen)`);
      return;
    }

    showDialog(npc.name, npc.role, npc.dialogue);
  }

  private collectSupply(id: string): void {
    const supply = SUPPLIES.find((entry) => entry.id === id);
    if (!supply || progress.supplies.includes(id)) return;
    progress.supplies.push(id);
    const visual = this.supplyVisuals.get(id);
    if (visual) {
      this.tweens.add({ targets: visual, alpha: 0, scale: 1.5, duration: 220, onComplete: () => visual.destroy() });
      this.supplyVisuals.delete(id);
    }
    if (progress.supplies.length >= SUPPLIES.length && progress.questIndex === 1) progress.questIndex = 2;
    saveProgress();
    this.updateQuestMarker();
    showDialog(supply.label, 'Versorgung', progress.supplies.length >= 3
      ? 'Alles da. Der Weg zum Zeltkreis ist frei – sprich jetzt mit der ganzen Gruppe.'
      : `${supply.label} ist verstaut. Noch ${3 - progress.supplies.length} Versorgungspaket(e).`);
  }

  private lightCampfire(): void {
    if (progress.questIndex < 3 || progress.fireLit) return;
    progress.fireLit = true;
    progress.questIndex = 4;
    this.fireFlame?.setVisible(true);
    this.cameras.main.flash(220, 244, 179, 79, false);
    saveProgress();
    this.updateQuestMarker();
    showDialog('Lagerfeuer', 'Zeltkreis', 'Der Platz steht, alle sind da und das Feuer brennt. Jetzt fehlt nur noch der erste Weg an die Blaue Adria.');
  }

  private reachLake(): void {
    if (progress.questIndex < 4 || progress.lakeReached) return;
    progress.lakeReached = true;
    progress.questIndex = 5;
    saveProgress();
    this.updateQuestMarker();
    showDialog('Blaue Adria', 'Strand', 'Der Redesign-Testlauf ist abgeschlossen. Die neue Welt, Steuerung, Questführung und Atmosphäre sind vollständig einmal durchspielbar.');
  }

  private updateQuestMarker(): void {
    const quest = QUEST_STEPS[progress.questIndex] ?? QUEST_STEPS[0];
    this.questMarker?.setPosition(quest.target.x, quest.target.y - 54).setVisible(progress.questIndex < QUEST_STEPS.length - 1);
  }

  private animateEnvironment(): void {
    if (this.water) this.water.tilePositionY -= 0.12;
    if (this.fireFlame?.visible) {
      this.fireFlame.setScale(1 + Math.sin(this.elapsedWorldTime * 0.012) * 0.12, 1 + Math.cos(this.elapsedWorldTime * 0.016) * 0.08);
      this.fireFlame.setAlpha(0.84 + Math.sin(this.elapsedWorldTime * 0.02) * 0.12);
    }
  }

  private updateWorldClock(): void {
    const totalMinutes = 16 * 60 + 40 + Math.floor(this.elapsedWorldTime / 6000);
    const hours = Math.floor(totalMinutes / 60) % 24;
    const minutes = totalMinutes % 60;
    dom.worldTime.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  private addObstacle(x: number, y: number, width: number, height: number): void {
    const zone = this.add.zone(x, y, width, height);
    this.physics.add.existing(zone, true);
    this.obstacles.push(zone);
  }

  private readonly onStart = (): void => {
    this.inputEnabled = true;
    this.game.canvas.focus();
  };

  private readonly onMobileInput = (event: CustomEvent<{ direction: Direction; active: boolean }>): void => {
    const { direction, active } = event.detail;
    if (active) this.activeDirections.add(direction);
    else this.activeDirections.delete(direction);
  };

  private readonly onAction = (): void => this.performAction();
}

function makeTile(
  scene: Phaser.Scene,
  key: string,
  base: number,
  light: number,
  dark: number,
  dots: readonly [number, number][],
): void {
  const graphics = scene.make.graphics({ x: 0, y: 0 });
  graphics.fillStyle(base).fillRect(0, 0, TILE_SIZE, TILE_SIZE);
  graphics.fillStyle(light, 0.55).fillRect(0, 0, TILE_SIZE, 2).fillRect(3, 15, 9, 2).fillRect(21, 25, 7, 2);
  graphics.fillStyle(dark, 0.6).fillRect(0, TILE_SIZE - 2, TILE_SIZE, 2);
  for (const [x, y] of dots) graphics.fillRect(x, y, 2, 2);
  graphics.generateTexture(key, TILE_SIZE, TILE_SIZE);
  graphics.destroy();
}

function depthFor(y: number): number {
  return 20 + y / 8;
}

updateHud();

dom.start.addEventListener('click', () => {
  dom.intro.classList.add('is-hidden');
  window.dispatchEvent(new Event('adria:redesign-start'));
});

dom.reset.addEventListener('click', () => {
  localStorage.removeItem(REDESIGN_SAVE_KEY);
  location.reload();
});

dom.dialogClose.addEventListener('click', closeDialog);
dom.mobileAction.addEventListener('pointerdown', () => window.dispatchEvent(new Event('adria:redesign-action')));

document.querySelectorAll<HTMLButtonElement>('[data-direction]').forEach((button) => {
  const direction = button.dataset.direction as Direction;
  const send = (active: boolean): void => {
    window.dispatchEvent(new CustomEvent('adria:redesign-input', { detail: { direction, active } }));
  };
  button.addEventListener('pointerdown', (event) => { event.preventDefault(); button.setPointerCapture(event.pointerId); send(true); });
  button.addEventListener('pointerup', () => send(false));
  button.addEventListener('pointercancel', () => send(false));
  button.addEventListener('lostpointercapture', () => send(false));
});

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: dom.mount,
  width: 960,
  height: 640,
  backgroundColor: '#315848',
  pixelArt: true,
  antialias: false,
  roundPixels: true,
  physics: {
    default: 'arcade',
    arcade: { gravity: { x: 0, y: 0 }, debug: false },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 960,
    height: 640,
  },
  scene: [RedesignBootScene, RedesignWorldScene],
});

window.addEventListener('beforeunload', () => game.destroy(true));
document.documentElement.dataset.redesignBuild = REDESIGN_BUILD_ID;

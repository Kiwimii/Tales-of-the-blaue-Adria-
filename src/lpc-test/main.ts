import Phaser from 'phaser';
import {
  CHARACTER_DESIGNS,
  LPC_LAYERS,
  PLAYER_DESIGN,
  TENT_POSITIONS,
  type Accessory,
  type CharacterDesign,
} from './content';
import './styles.css';

const GAME_WIDTH = 1280;
const GAME_HEIGHT = 720;
const WORLD_WIDTH = 1500;
const WORLD_HEIGHT = 920;
const STORAGE_KEY = 'tales-adria-lpc-test-v1';
const WALK_FRAMES = 9;

interface SavedState {
  visited: string[];
}

interface CharacterActor {
  design: CharacterDesign;
  container: Phaser.GameObjects.Container;
  body: Phaser.GameObjects.Sprite;
  head: Phaser.GameObjects.Sprite;
  face: Phaser.GameObjects.Sprite;
  outfit: Phaser.GameObjects.Graphics;
  hair: Phaser.GameObjects.Graphics;
  accessory: Phaser.GameObjects.Graphics;
  label: Phaser.GameObjects.Text;
  marker: Phaser.GameObjects.Arc;
}

const state: SavedState = loadState();
const roster = new Map<string, HTMLButtonElement>();

const objective = element<HTMLParagraphElement>('objective-text');
const progress = element<HTMLElement>('progress-text');
const prompt = element<HTMLElement>('interaction-prompt');
const promptName = element<HTMLElement>('interaction-name');
const profileName = element<HTMLElement>('profile-name');
const profileRole = element<HTMLElement>('profile-role');
const profileDescription = element<HTMLElement>('profile-description');
const profileTraits = element<HTMLElement>('profile-traits');
const dialog = element<HTMLElement>('dialog');
const dialogName = element<HTMLElement>('dialog-name');
const dialogRole = element<HTMLElement>('dialog-role');
const dialogBody = element<HTMLElement>('dialog-body');
const dialogPortrait = element<HTMLElement>('dialog-portrait');
const intro = element<HTMLElement>('intro');

renderRoster();
updateHud();

class LpcCharacterScene extends Phaser.Scene {
  private control!: Phaser.Physics.Arcade.Sprite;
  private player!: CharacterActor;
  private actors = new Map<string, CharacterActor>();
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private keys?: Record<string, Phaser.Input.Keyboard.Key>;
  private activeDirections = new Set<string>();
  private nearest?: CharacterActor;
  private movementFrame = 1;
  private movementClock = 0;
  private facingRow = 2;
  private dialogOpen = false;
  private focusedCharacterId?: string;

  constructor() {
    super('lpc-character-lab');
  }

  preload(): void {
    this.load.setCORS('anonymous');
    this.load.spritesheet('lpc-body', LPC_LAYERS.body, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('lpc-head', LPC_LAYERS.head, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('lpc-face', LPC_LAYERS.face, { frameWidth: 64, frameHeight: 64 });
  }

  create(): void {
    this.physics.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    this.cameras.main.setBackgroundColor('#193a32');
    this.drawWorld();

    const invisible = this.add.rectangle(PLAYER_DESIGN.x, PLAYER_DESIGN.y, 24, 20, 0xffffff, 0);
    this.physics.add.existing(invisible);
    this.control = invisible as unknown as Phaser.Physics.Arcade.Sprite;
    const body = this.control.body as Phaser.Physics.Arcade.Body;
    body.setCollideWorldBounds(true);
    body.setSize(24, 18);

    this.player = this.createCharacter(PLAYER_DESIGN, false);
    this.actors.set(PLAYER_DESIGN.id, this.player);

    for (const design of CHARACTER_DESIGNS) {
      const actor = this.createCharacter(design, true);
      this.actors.set(design.id, actor);
    }

    this.cursors = this.input.keyboard?.createCursorKeys();
    this.keys = this.input.keyboard?.addKeys('W,A,S,D,E,SPACE,TAB') as Record<string, Phaser.Input.Keyboard.Key>;
    this.keys?.E.on('down', () => this.interact());
    this.keys?.SPACE.on('down', () => this.interact());
    this.keys?.TAB.on('down', (event: KeyboardEvent) => {
      event.preventDefault();
      this.cycleFocus();
    });

    this.cameras.main.startFollow(this.control, true, 0.12, 0.12);
    this.cameras.main.setZoom(1.08);
    this.cameras.main.fadeIn(450, 8, 18, 16);

    window.addEventListener('lpc-test-action', this.onExternalAction);
    window.addEventListener('lpc-test-focus', this.onExternalFocus as EventListener);
    window.addEventListener('lpc-test-direction', this.onExternalDirection as EventListener);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      window.removeEventListener('lpc-test-action', this.onExternalAction);
      window.removeEventListener('lpc-test-focus', this.onExternalFocus as EventListener);
      window.removeEventListener('lpc-test-direction', this.onExternalDirection as EventListener);
    });

    selectProfile(CHARACTER_DESIGNS[0]);
  }

  update(_time: number, delta: number): void {
    const speed = 175;
    let dx = 0;
    let dy = 0;
    if (this.cursors?.left.isDown || this.keys?.A.isDown || this.activeDirections.has('left')) dx -= 1;
    if (this.cursors?.right.isDown || this.keys?.D.isDown || this.activeDirections.has('right')) dx += 1;
    if (this.cursors?.up.isDown || this.keys?.W.isDown || this.activeDirections.has('up')) dy -= 1;
    if (this.cursors?.down.isDown || this.keys?.S.isDown || this.activeDirections.has('down')) dy += 1;

    if (this.dialogOpen) {
      dx = 0;
      dy = 0;
    }

    const vector = new Phaser.Math.Vector2(dx, dy);
    if (vector.lengthSq() > 0) vector.normalize().scale(speed);
    this.control.setVelocity(vector.x, vector.y);

    if (Math.abs(vector.x) > Math.abs(vector.y)) this.facingRow = vector.x < 0 ? 1 : 3;
    else if (vector.y !== 0) this.facingRow = vector.y < 0 ? 0 : 2;

    this.player.container.setPosition(this.control.x, this.control.y - 21);
    this.player.label.setPosition(this.control.x, this.control.y + 43);

    if (vector.lengthSq() > 0) {
      this.movementClock += delta;
      if (this.movementClock >= 90) {
        this.movementClock = 0;
        this.movementFrame = (this.movementFrame + 1) % WALK_FRAMES;
      }
    } else {
      this.movementFrame = 1;
      this.movementClock = 0;
    }
    this.setActorFrame(this.player, this.facingRow * WALK_FRAMES + this.movementFrame);

    const candidates = CHARACTER_DESIGNS
      .map((design) => this.actors.get(design.id)!)
      .map((actor) => ({ actor, distance: Phaser.Math.Distance.Between(this.control.x, this.control.y, actor.design.x, actor.design.y) }))
      .sort((a, b) => a.distance - b.distance);
    const next = candidates[0]?.distance <= 105 ? candidates[0].actor : undefined;
    if (next !== this.nearest) {
      this.nearest?.marker.setVisible(false);
      this.nearest = next;
      this.nearest?.marker.setVisible(true);
      prompt.hidden = !next;
      if (next) promptName.textContent = `${next.design.name} ansehen`;
    }

    for (const actor of this.actors.values()) {
      if (actor.design.id === 'player') continue;
      actor.container.setDepth(actor.design.y);
      actor.label.setDepth(actor.design.y + 80);
      actor.marker.setDepth(actor.design.y - 60);
    }
    this.player.container.setDepth(this.control.y);
    this.player.label.setDepth(this.control.y + 80);
  }

  private readonly onExternalAction = (): void => this.interact();

  private readonly onExternalFocus = (event: CustomEvent<string>): void => {
    const actor = this.actors.get(event.detail);
    if (!actor) return;
    this.focusedCharacterId = actor.design.id;
    this.cameras.main.stopFollow();
    this.cameras.main.pan(actor.design.x, actor.design.y, 380, 'Sine.easeInOut', false, (_camera, progressValue) => {
      if (progressValue === 1) this.time.delayedCall(900, () => this.cameras.main.startFollow(this.control, true, 0.12, 0.12));
    });
    actor.marker.setVisible(true);
    this.time.delayedCall(1100, () => {
      if (actor !== this.nearest) actor.marker.setVisible(false);
    });
    selectProfile(actor.design);
  };

  private readonly onExternalDirection = (event: CustomEvent<{ direction: string; active: boolean }>): void => {
    if (event.detail.active) this.activeDirections.add(event.detail.direction);
    else this.activeDirections.delete(event.detail.direction);
  };

  private interact(): void {
    if (this.dialogOpen || !this.nearest) return;
    this.openDialogue(this.nearest);
  }

  private cycleFocus(): void {
    const index = Math.max(-1, CHARACTER_DESIGNS.findIndex((design) => design.id === this.focusedCharacterId));
    const next = CHARACTER_DESIGNS[(index + 1) % CHARACTER_DESIGNS.length];
    window.dispatchEvent(new CustomEvent('lpc-test-focus', { detail: next.id }));
  }

  private openDialogue(actor: CharacterActor): void {
    this.dialogOpen = true;
    this.control.setVelocity(0, 0);
    const design = actor.design;
    state.visited = [...new Set([...state.visited, design.id])];
    saveState();
    updateHud();
    updateRosterState();
    selectProfile(design);
    dialogName.textContent = design.name;
    dialogRole.textContent = design.role;
    dialogPortrait.textContent = design.portraitInitials;
    dialogBody.innerHTML = `${design.dialogue.map((line) => `<span>${escapeHtml(line)}</span>`).join('')}<small>${escapeHtml(design.description)}</small>`;
    dialog.hidden = false;
    actor.marker.setVisible(false);
  }

  public closeDialogue(): void {
    dialog.hidden = true;
    this.dialogOpen = false;
  }

  private createCharacter(design: CharacterDesign, withLabel: boolean): CharacterActor {
    const body = this.add.sprite(0, 0, 'lpc-body', 19).setOrigin(0.5);
    const head = this.add.sprite(0, 0, 'lpc-head', 19).setOrigin(0.5);
    const face = this.add.sprite(0, 0, 'lpc-face', 19).setOrigin(0.5);
    const outfit = this.add.graphics();
    const hair = this.add.graphics();
    const accessory = this.add.graphics();
    drawOutfit(outfit, design);
    drawHair(hair, design);
    drawAccessories(accessory, design);

    const container = this.add.container(design.x, design.y - 21, [body, head, face, outfit, hair, accessory]);
    const baseScale = 1.52;
    container.setScale(baseScale * design.scaleX, baseScale * design.scaleY);

    const marker = this.add.circle(design.x, design.y - 76, 17, 0xf2c35f, 0.14)
      .setStrokeStyle(3, 0xffe49a, 0.95)
      .setVisible(false);
    this.tweens.add({ targets: marker, scale: { from: 0.86, to: 1.28 }, alpha: { from: 0.9, to: 0.1 }, duration: 780, repeat: -1 });

    const label = this.add.text(design.x, design.y + 43, withLabel ? design.name : 'DU', {
      fontFamily: 'Arial Black, system-ui', fontSize: withLabel ? '13px' : '11px', color: '#fff4ce',
      backgroundColor: '#10261fe8', padding: { x: 7, y: 4 }, stroke: '#091712', strokeThickness: 2,
    }).setOrigin(0.5);

    return { design, container, body, head, face, outfit, hair, accessory, label, marker };
  }

  private setActorFrame(actor: CharacterActor, frame: number): void {
    actor.body.setFrame(frame);
    actor.head.setFrame(frame);
    actor.face.setFrame(frame);
  }

  private drawWorld(): void {
    const ground = this.add.graphics();
    ground.fillStyle(0x426b50).fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    for (let y = 14; y < WORLD_HEIGHT; y += 28) {
      for (let x = 14 + ((y / 28) % 2) * 9; x < WORLD_WIDTH; x += 30) {
        const shade = ((x * 17 + y * 13) % 3 === 0) ? 0x527b59 : 0x365d45;
        ground.fillStyle(shade, 0.42).fillRect(x, y, 3, 2);
      }
    }

    ground.fillStyle(0xb6a274).fillRoundedRect(115, 540, 1190, 105, 28);
    ground.fillStyle(0xc9b784).fillRoundedRect(535, 130, 150, 620, 44);
    ground.lineStyle(3, 0x8c7b55, 0.75).strokeRoundedRect(115, 540, 1190, 105, 28);
    ground.strokeRoundedRect(535, 130, 150, 620, 44);

    ground.fillStyle(0x294f68).fillRoundedRect(1120, 80, 340, 780, 55);
    ground.lineStyle(5, 0x67a2ae, 0.75).strokeRoundedRect(1120, 80, 340, 780, 55);
    for (let y = 105; y < 840; y += 32) {
      ground.lineStyle(2, 0x78b5bd, 0.26).lineBetween(1140, y, 1440, y + 8);
    }
    this.add.text(1288, 135, 'BLAUE ADRIA', { fontFamily: 'Arial Black', fontSize: '19px', color: '#d8f3ee' }).setOrigin(0.5).setRotation(Math.PI / 2);

    drawReception(this);
    drawTentCircle(this);
    drawServiceArea(this);
    drawVegetation(this);
    this.add.text(610, 82, 'LPC CHARACTER CAMP', {
      fontFamily: 'Arial Black, system-ui', fontSize: '22px', color: '#fff1be',
      backgroundColor: '#173229e8', padding: { x: 14, y: 8 }, stroke: '#0a1713', strokeThickness: 3,
    }).setOrigin(0.5);
  }
}

function drawOutfit(graphics: Phaser.GameObjects.Graphics, design: CharacterDesign): void {
  const dark = 0x151c1c;
  graphics.fillStyle(design.trousers).fillRoundedRect(-9, 7, 8, 14, 2).fillRoundedRect(1, 7, 8, 14, 2);
  graphics.fillStyle(dark, 0.8).fillRect(-9, 19, 8, 3).fillRect(1, 19, 8, 3);

  if (design.outfit === 'tank-top') {
    graphics.fillStyle(design.shirt).fillRoundedRect(-7, -7, 14, 17, 4);
    graphics.lineStyle(2, design.shirtShade).lineBetween(-5, -5, -5, 8).lineBetween(5, -5, 5, 8);
  } else if (design.outfit === 'strict-jacket') {
    graphics.fillStyle(design.shirt).fillRoundedRect(-11, -8, 22, 20, 4);
    graphics.fillStyle(design.shirtShade).fillTriangle(-9, -7, -1, 4, -1, -7).fillTriangle(9, -7, 1, 4, 1, -7);
    graphics.fillStyle(design.accent).fillCircle(0, 3, 1.2).fillCircle(0, 8, 1.2);
    graphics.fillStyle(design.shirt).fillRoundedRect(-14, -5, 5, 14, 2).fillRoundedRect(9, -5, 5, 14, 2);
  } else if (design.outfit === 'hoodie') {
    graphics.fillStyle(design.shirtShade).fillCircle(0, -11, 12);
    graphics.fillStyle(design.shirt).fillRoundedRect(-12, -8, 24, 21, 6);
    graphics.lineStyle(1.5, design.accent, 0.75).lineBetween(-3, -6, -3, 2).lineBetween(3, -6, 3, 2);
    graphics.fillStyle(design.shirtShade).fillRoundedRect(-8, 6, 16, 5, 2);
  } else if (design.outfit === 'camp-shirt') {
    graphics.fillStyle(design.shirt).fillRoundedRect(-11, -8, 22, 20, 4);
    graphics.fillStyle(design.shirtShade).fillTriangle(-7, -7, 0, 2, 0, -7).fillTriangle(7, -7, 0, 2, 0, -7);
    graphics.lineStyle(1, design.accent, 0.85).lineBetween(0, 1, 0, 11);
    graphics.fillStyle(design.accent, 0.85).fillRoundedRect(4, -1, 5, 4, 1);
    graphics.fillStyle(design.shirt).fillRoundedRect(-14, -5, 5, 11, 2).fillRoundedRect(9, -5, 5, 11, 2);
  } else if (design.outfit === 'pattern-shirt') {
    graphics.fillStyle(design.shirt).fillRoundedRect(-11, -8, 22, 20, 4);
    graphics.fillStyle(design.shirt).fillRoundedRect(-14, -5, 5, 11, 2).fillRoundedRect(9, -5, 5, 11, 2);
    graphics.fillStyle(design.accent, 0.78).fillTriangle(-8, -3, -3, 1, -8, 5).fillTriangle(2, -6, 8, -2, 3, 2).fillCircle(5, 7, 2);
  } else {
    graphics.fillStyle(design.shirt).fillRoundedRect(-11, -8, 22, 20, 5);
    graphics.fillStyle(design.shirtShade).fillRoundedRect(-14, -5, 5, 11, 2).fillRoundedRect(9, -5, 5, 11, 2);
    graphics.fillStyle(design.accent, 0.75).fillRect(-7, 0, 14, 3);
  }
}

function drawHair(graphics: Phaser.GameObjects.Graphics, design: CharacterDesign): void {
  const y = -20;
  graphics.fillStyle(design.hair);
  switch (design.hairStyle) {
    case 'short':
      graphics.fillRoundedRect(-10, y - 6, 20, 8, 4).fillTriangle(-10, y - 1, -7, y + 5, -3, y);
      break;
    case 'curly':
      for (const [x, dy, r] of [[-9, 0, 5], [-5, -5, 5], [1, -6, 6], [7, -4, 5], [10, 1, 4]] as const) graphics.fillCircle(x, y + dy, r);
      break;
    case 'sidepart':
      graphics.fillRoundedRect(-11, y - 6, 22, 8, 4).fillTriangle(-1, y - 6, 11, y - 3, 11, y + 5);
      graphics.lineStyle(1.5, design.accent, 0.55).lineBetween(-1, y - 6, 1, y + 1);
      break;
    case 'cap':
      graphics.fillStyle(design.accent).fillRoundedRect(-12, y - 7, 23, 8, 4).fillRect(6, y, 12, 3);
      graphics.fillStyle(design.hair).fillRect(-9, y, 17, 4);
      break;
    case 'spiky-white':
      graphics.fillRoundedRect(-11, y - 4, 22, 6, 2);
      for (let x = -10; x <= 8; x += 4) graphics.fillTriangle(x, y - 3, x + 3, y - 12 - Math.abs(x % 3), x + 6, y - 2);
      break;
    case 'bald':
      graphics.lineStyle(1.3, 0xf3d7bd, 0.7).beginPath().arc(0, y + 1, 8, Math.PI * 1.1, Math.PI * 1.9).strokePath();
      graphics.fillStyle(0xffffff, 0.18).fillEllipse(-3, y - 3, 7, 3);
      break;
  }
}

function drawAccessories(graphics: Phaser.GameObjects.Graphics, design: CharacterDesign): void {
  for (const accessory of design.accessories) drawAccessory(graphics, design, accessory);
}

function drawAccessory(graphics: Phaser.GameObjects.Graphics, design: CharacterDesign, accessory: Accessory): void {
  switch (accessory) {
    case 'glasses':
      graphics.lineStyle(1.5, 0x171b1d, 1).strokeRect(-9, -19, 7, 5).strokeRect(2, -19, 7, 5).lineBetween(-2, -17, 2, -17);
      break;
    case 'sunglasses':
      graphics.fillStyle(0x11181d, 0.96).fillRoundedRect(-9, -19, 8, 5, 1).fillRoundedRect(1, -19, 8, 5, 1);
      graphics.lineStyle(1, 0xbcd7df, 0.4).lineBetween(-8, -18, -3, -16).lineBetween(2, -18, 7, -16);
      break;
    case 'earring':
      graphics.fillStyle(0xe4c66c).fillCircle(10, -14, 1.6);
      break;
    case 'beard':
      graphics.fillStyle(design.hair, 0.94).fillRoundedRect(-7, -12, 14, 7, 4).fillTriangle(-6, -7, 0, -2, 6, -7);
      break;
    case 'clipboard':
      graphics.fillStyle(0x8a633a).fillRoundedRect(12, -1, 9, 15, 2);
      graphics.fillStyle(0xe9dfc7).fillRect(14, 1, 5, 10);
      graphics.fillStyle(0x343b3e).fillRect(15, -2, 4, 3);
      break;
    case 'keys':
      graphics.lineStyle(1.5, design.accent).strokeCircle(14, 9, 3).lineBetween(16, 11, 21, 16).lineBetween(19, 14, 21, 12);
      break;
    case 'bag':
      graphics.lineStyle(1.6, 0x5a402e, 0.9).lineBetween(-8, -8, 10, 13);
      graphics.fillStyle(0x76543b).fillRoundedRect(8, 8, 10, 11, 2);
      break;
    case 'none':
      break;
  }
}

function drawReception(scene: Phaser.Scene): void {
  const g = scene.add.graphics();
  g.fillStyle(0x28483e).fillRoundedRect(70, 90, 320, 190, 10);
  g.fillStyle(0x6d4232).fillTriangle(50, 105, 230, 25, 410, 105);
  g.fillStyle(0xb56b45).fillTriangle(70, 102, 230, 38, 390, 102);
  g.fillStyle(0xd8c58f).fillRoundedRect(195, 180, 70, 100, 4);
  g.fillStyle(0x91c2c0).fillRoundedRect(95, 125, 74, 52, 5).fillRoundedRect(290, 125, 74, 52, 5);
  g.lineStyle(4, 0x173229).strokeRoundedRect(95, 125, 74, 52, 5).strokeRoundedRect(290, 125, 74, 52, 5);
  scene.add.text(230, 112, 'ANMELDUNG', { fontFamily: 'Arial Black', fontSize: '17px', color: '#fff1c0' }).setOrigin(0.5);
}

function drawTentCircle(scene: Phaser.Scene): void {
  const g = scene.add.graphics();
  g.fillStyle(0xa9976d, 0.68).fillCircle(610, 390, 230);
  g.lineStyle(6, 0xd0bd88, 0.65).strokeCircle(610, 390, 218);
  for (const tent of TENT_POSITIONS) {
    g.fillStyle(0x1a221f, 0.28).fillEllipse(tent.x, tent.y + 45, 115, 28);
    g.fillStyle(tent.roof).fillTriangle(tent.x - 65, tent.y + 35, tent.x, tent.y - 55, tent.x + 65, tent.y + 35);
    g.fillStyle(tent.color).fillTriangle(tent.x - 55, tent.y + 32, tent.x, tent.y - 42, tent.x + 55, tent.y + 32);
    g.fillStyle(0x202622).fillTriangle(tent.x - 16, tent.y + 31, tent.x, tent.y - 4, tent.x + 16, tent.y + 31);
    g.lineStyle(3, 0xe2d3a3, 0.75).lineBetween(tent.x, tent.y - 42, tent.x, tent.y + 31);
  }
  g.fillStyle(0x25231f).fillCircle(610, 410, 43);
  g.fillStyle(0x6e3c25).fillRoundedRect(578, 403, 65, 11, 4).fillRoundedRect(604, 377, 11, 65, 4);
  g.fillStyle(0xf39a35).fillTriangle(592, 409, 610, 365, 628, 409);
  g.fillStyle(0xffd65e).fillTriangle(600, 408, 610, 379, 619, 408);
}

function drawServiceArea(scene: Phaser.Scene): void {
  const g = scene.add.graphics();
  g.fillStyle(0x2d5144).fillRoundedRect(90, 675, 350, 170, 14);
  g.fillStyle(0xc29b55).fillRoundedRect(125, 720, 76, 58, 6).fillRoundedRect(225, 710, 76, 68, 6).fillRoundedRect(325, 725, 76, 53, 6);
  g.lineStyle(4, 0x6c4c2e).strokeRoundedRect(125, 720, 76, 58, 6).strokeRoundedRect(225, 710, 76, 68, 6).strokeRoundedRect(325, 725, 76, 53, 6);
  scene.add.text(265, 695, 'VERSORGUNG', { fontFamily: 'Arial Black', fontSize: '15px', color: '#fff0bc' }).setOrigin(0.5);
}

function drawVegetation(scene: Phaser.Scene): void {
  const g = scene.add.graphics();
  const trees = [[70, 370, 1], [80, 500, 0.85], [1030, 180, 1], [1020, 700, 1.1], [470, 830, 0.95], [900, 820, 1]] as const;
  for (const [x, y, scale] of trees) {
    g.fillStyle(0x4b3324).fillRoundedRect(x - 8 * scale, y, 16 * scale, 45 * scale, 4);
    g.fillStyle(0x244d37).fillCircle(x, y - 5 * scale, 38 * scale);
    g.fillStyle(0x326348).fillCircle(x - 22 * scale, y + 5 * scale, 27 * scale).fillCircle(x + 24 * scale, y + 3 * scale, 29 * scale);
    g.fillStyle(0x4d7a50, 0.75).fillCircle(x - 8 * scale, y - 23 * scale, 20 * scale);
  }
}

function renderRoster(): void {
  const mount = element<HTMLElement>('character-roster');
  mount.innerHTML = '';
  for (const design of CHARACTER_DESIGNS) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'character-card';
    button.dataset.characterId = design.id;
    button.innerHTML = `<span class="portrait">${escapeHtml(design.portraitInitials)}</span><span><strong>${escapeHtml(design.name)}</strong><small>${escapeHtml(design.role)}</small></span><i aria-hidden="true">✓</i>`;
    button.addEventListener('click', () => window.dispatchEvent(new CustomEvent('lpc-test-focus', { detail: design.id })));
    mount.append(button);
    roster.set(design.id, button);
  }
  updateRosterState();
}

function updateRosterState(): void {
  for (const [id, card] of roster) card.classList.toggle('visited', state.visited.includes(id));
}

function selectProfile(design: CharacterDesign): void {
  profileName.textContent = design.name;
  profileRole.textContent = design.role;
  profileDescription.textContent = design.description;
  profileTraits.innerHTML = [design.hairStyle, design.outfit, ...design.accessories]
    .map((trait) => `<span>${escapeHtml(trait.replaceAll('-', ' '))}</span>`).join('');
  for (const [id, card] of roster) card.classList.toggle('selected', id === design.id);
}

function updateHud(): void {
  const count = state.visited.filter((id) => CHARACTER_DESIGNS.some((character) => character.id === id)).length;
  progress.textContent = `${count} / ${CHARACTER_DESIGNS.length}`;
  objective.textContent = count === CHARACTER_DESIGNS.length
    ? 'Alle sechs Figuren geprüft. Vergleiche jetzt bewusst Silhouette, Körperform und Wiedererkennung.'
    : `Sprich mit allen sechs Figuren und prüfe, ob jede schon aus der Entfernung eindeutig erkennbar ist.`;
}

function saveState(): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState(): SavedState {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') as Partial<SavedState>;
    return { visited: Array.isArray(parsed.visited) ? parsed.visited.filter((value): value is string => typeof value === 'string') : [] };
  } catch {
    return { visited: [] };
  }
}

function element<T extends HTMLElement>(id: string): T {
  const found = document.getElementById(id);
  if (!found) throw new Error(`Missing element #${id}`);
  return found as T;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]!);
}

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'lpc-game',
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: '#193a32',
  pixelArt: true,
  antialias: false,
  roundPixels: true,
  physics: { default: 'arcade', arcade: { gravity: { x: 0, y: 0 }, debug: false } },
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH, width: GAME_WIDTH, height: GAME_HEIGHT },
  scene: [LpcCharacterScene],
});

const scene = (): LpcCharacterScene | undefined => game.scene.getScene('lpc-character-lab') as LpcCharacterScene | undefined;

element<HTMLButtonElement>('start-test').addEventListener('click', () => {
  intro.hidden = true;
  game.canvas.focus();
});
element<HTMLButtonElement>('dialog-close').addEventListener('click', () => scene()?.closeDialogue());
element<HTMLButtonElement>('mobile-action').addEventListener('click', () => window.dispatchEvent(new Event('lpc-test-action')));
element<HTMLButtonElement>('reset-test').addEventListener('click', () => {
  localStorage.removeItem(STORAGE_KEY);
  location.reload();
});

dialog.addEventListener('click', (event) => {
  if (event.target === dialog) scene()?.closeDialogue();
});
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !dialog.hidden) scene()?.closeDialogue();
});

for (const button of document.querySelectorAll<HTMLButtonElement>('[data-direction]')) {
  const direction = button.dataset.direction!;
  const send = (active: boolean) => window.dispatchEvent(new CustomEvent('lpc-test-direction', { detail: { direction, active } }));
  button.addEventListener('pointerdown', (event) => { event.preventDefault(); button.setPointerCapture(event.pointerId); send(true); });
  button.addEventListener('pointerup', () => send(false));
  button.addEventListener('pointercancel', () => send(false));
  button.addEventListener('lostpointercapture', () => send(false));
}

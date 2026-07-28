import Phaser from 'phaser';
import { ENCOUNTERS, ITEMS, QUESTS, RELATIONSHIP_CHARACTERS } from '../game/content';
import { GameStore, type StorageAdapter } from '../game/state/GameStore';
import type { GameSnapshot, PlayerProfile } from '../game/types';
import {
  CHARACTER_BY_ID,
  CHARACTER_VISUALS,
  LPC_LAYERS,
  PLAYER_VISUAL,
  WORLD_TARGETS,
  type Accessory,
  type AnimationState,
  type CharacterVisual,
  type WorldTarget,
} from './content';
import './styles.css';

const GAME_WIDTH = 1280;
const GAME_HEIGHT = 720;
const WORLD_WIDTH = 1680;
const WORLD_HEIGHT = 1020;
const WALK_FRAMES = 9;
const SAVE_KEY = 'tales-blaue-adria-lpc-main-v1';

interface CharacterActor {
  design: CharacterVisual;
  container: Phaser.GameObjects.Container;
  body: Phaser.GameObjects.Sprite;
  head: Phaser.GameObjects.Sprite;
  face: Phaser.GameObjects.Sprite;
  outfit: Phaser.GameObjects.Graphics;
  hair: Phaser.GameObjects.Graphics;
  accessory: Phaser.GameObjects.Graphics;
  pose: Phaser.GameObjects.Graphics;
  prop: Phaser.GameObjects.Graphics;
  label: Phaser.GameObjects.Text;
  marker: Phaser.GameObjects.Arc;
  baseScaleX: number;
  baseScaleY: number;
  animationToken: number;
}

type NearbyTarget =
  | { kind: 'character'; id: string; label: string; distance: number }
  | { kind: 'world'; id: string; label: string; distance: number };

type ActivityId = 'battle' | 'flipCup' | 'beerPong' | 'flunkyball';

interface ActivityRuntime {
  id: ActivityId;
  value: number;
  direction: number;
  running: boolean;
  lastTime: number;
  raf: number;
}

class NamespacedStorage implements StorageAdapter {
  constructor(private readonly key: string) {}
  getItem(): string | null { return window.localStorage.getItem(this.key); }
  setItem(_key: string, value: string): void { window.localStorage.setItem(this.key, value); }
  removeItem(): void { window.localStorage.removeItem(this.key); }
}

const store = new GameStore(new NamespacedStorage(SAVE_KEY));
let snapshot = store.snapshot();
let gameScene: LpcMainScene | undefined;
let activityRuntime: ActivityRuntime | undefined;
let overlayCount = 0;

const ui = {
  setup: element<HTMLElement>('setup-overlay'),
  setupError: element<HTMLElement>('setup-error'),
  setupTotal: element<HTMLElement>('setup-total'),
  continueButton: element<HTMLButtonElement>('continue-save'),
  objective: element<HTMLElement>('objective-text'),
  questTitle: element<HTMLElement>('quest-title'),
  time: element<HTMLElement>('time-label'),
  condition: element<HTMLElement>('condition-label'),
  money: element<HTMLElement>('money-label'),
  needs: element<HTMLElement>('needs-list'),
  metrics: element<HTMLElement>('metrics-list'),
  inventory: element<HTMLElement>('inventory-list'),
  roster: element<HTMLElement>('relationship-list'),
  team: element<HTMLElement>('team-list'),
  chronicle: element<HTMLElement>('chronicle-list'),
  prompt: element<HTMLElement>('interaction-prompt'),
  promptText: element<HTMLElement>('interaction-text'),
  dialog: element<HTMLElement>('dialog-overlay'),
  dialogName: element<HTMLElement>('dialog-name'),
  dialogRole: element<HTMLElement>('dialog-role'),
  dialogText: element<HTMLElement>('dialog-text'),
  dialogPortrait: element<HTMLElement>('dialog-portrait'),
  encounter: element<HTMLElement>('encounter-overlay'),
  encounterName: element<HTMLElement>('encounter-name'),
  encounterIntro: element<HTMLElement>('encounter-intro'),
  encounterOptions: element<HTMLElement>('encounter-options'),
  encounterResult: element<HTMLElement>('encounter-result'),
  activity: element<HTMLElement>('activity-overlay'),
  activityTitle: element<HTMLElement>('activity-title'),
  activityCopy: element<HTMLElement>('activity-copy'),
  activityPointer: element<HTMLElement>('activity-pointer'),
  activityTarget: element<HTMLElement>('activity-target'),
  activityButton: element<HTMLButtonElement>('activity-action'),
  activityResult: element<HTMLElement>('activity-result'),
  toast: element<HTMLElement>('toast'),
  completion: element<HTMLElement>('completion-card'),
};

class LpcMainScene extends Phaser.Scene {
  private control!: Phaser.Physics.Arcade.Sprite;
  private player!: CharacterActor;
  private actors = new Map<string, CharacterActor>();
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private keys?: Record<string, Phaser.Input.Keyboard.Key>;
  private activeDirections = new Set<string>();
  private nearest?: NearbyTarget;
  private movementFrame = 1;
  private movementClock = 0;
  private facingRow = 2;
  private npcClock = 0;

  constructor() { super('lpc-main-world'); }

  preload(): void {
    this.load.setCORS('anonymous');
    this.load.spritesheet('lpc-main-body', LPC_LAYERS.body, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('lpc-main-head', LPC_LAYERS.head, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('lpc-main-face', LPC_LAYERS.face, { frameWidth: 64, frameHeight: 64 });
  }

  create(): void {
    gameScene = this;
    this.physics.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    this.cameras.main.setBackgroundColor('#17392f');
    this.drawWorld();

    const position = snapshot.worldPosition ?? { x: PLAYER_VISUAL.x, y: PLAYER_VISUAL.y };
    const controlObject = this.add.rectangle(position.x, position.y, 24, 18, 0xffffff, 0);
    this.physics.add.existing(controlObject);
    this.control = controlObject as unknown as Phaser.Physics.Arcade.Sprite;
    const body = this.control.body as Phaser.Physics.Arcade.Body;
    body.setSize(24, 18);
    body.setCollideWorldBounds(true);

    this.player = this.createCharacter({ ...PLAYER_VISUAL, x: position.x, y: position.y }, false);
    this.applyPlayerProfile(snapshot.profile);
    for (const design of CHARACTER_VISUALS) this.actors.set(design.id, this.createCharacter({ ...design }, true));

    this.cursors = this.input.keyboard?.createCursorKeys();
    this.keys = this.input.keyboard?.addKeys('W,A,S,D,E,SPACE,Q') as Record<string, Phaser.Input.Keyboard.Key>;
    this.keys?.E.on('down', () => this.interact());
    this.keys?.SPACE.on('down', () => this.interact());
    this.keys?.Q.on('down', () => this.playExtra(this.player, 'wave'));

    this.cameras.main.startFollow(this.control, true, 0.12, 0.12);
    this.cameras.main.setZoom(1.05);
    this.cameras.main.fadeIn(450, 8, 18, 15);

    window.addEventListener('lpc-main-action', this.onExternalAction);
    window.addEventListener('lpc-main-direction', this.onExternalDirection as EventListener);
    window.addEventListener('lpc-main-animation', this.onExternalAnimation as EventListener);
    window.addEventListener('lpc-main-profile', this.onProfile as EventListener);
    window.addEventListener('lpc-main-focus', this.onFocus as EventListener);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      window.removeEventListener('lpc-main-action', this.onExternalAction);
      window.removeEventListener('lpc-main-direction', this.onExternalDirection as EventListener);
      window.removeEventListener('lpc-main-animation', this.onExternalAnimation as EventListener);
      window.removeEventListener('lpc-main-profile', this.onProfile as EventListener);
      window.removeEventListener('lpc-main-focus', this.onFocus as EventListener);
    });
  }

  update(_time: number, delta: number): void {
    let dx = 0;
    let dy = 0;
    if (!isOverlayOpen()) {
      if (this.cursors?.left.isDown || this.keys?.A.isDown || this.activeDirections.has('left')) dx -= 1;
      if (this.cursors?.right.isDown || this.keys?.D.isDown || this.activeDirections.has('right')) dx += 1;
      if (this.cursors?.up.isDown || this.keys?.W.isDown || this.activeDirections.has('up')) dy -= 1;
      if (this.cursors?.down.isDown || this.keys?.S.isDown || this.activeDirections.has('down')) dy += 1;
    }

    const vector = new Phaser.Math.Vector2(dx, dy);
    if (vector.lengthSq() > 0) vector.normalize().scale(185);
    this.control.setVelocity(vector.x, vector.y);
    if (Math.abs(vector.x) > Math.abs(vector.y)) this.facingRow = vector.x < 0 ? 1 : 3;
    else if (vector.y !== 0) this.facingRow = vector.y < 0 ? 0 : 2;

    this.player.container.setPosition(this.control.x, this.control.y - 21);
    this.player.label.setPosition(this.control.x, this.control.y + 43);
    this.player.container.setDepth(this.control.y);
    this.player.label.setDepth(this.control.y + 80);

    if (vector.lengthSq() > 0) {
      this.movementClock += delta;
      if (this.movementClock >= 88) {
        this.movementClock = 0;
        this.movementFrame = (this.movementFrame + 1) % WALK_FRAMES;
      }
      this.setActorFrame(this.player, this.facingRow * WALK_FRAMES + this.movementFrame);
    } else {
      this.movementFrame = 1;
      this.movementClock = 0;
      this.setActorFrame(this.player, this.facingRow * WALK_FRAMES + 1);
    }

    this.npcClock += delta;
    if (this.npcClock > 4300) {
      this.npcClock = 0;
      const candidates = [...this.actors.values()];
      const actor = candidates[Math.floor(Math.random() * candidates.length)];
      if (actor && Phaser.Math.Distance.Between(this.control.x, this.control.y, actor.design.x, actor.design.y) < 640) {
        this.playExtra(actor, actor.design.idleAnimation, 1150);
      }
    }

    this.updateNearest();
    if (vector.lengthSq() > 0 && Math.round(this.control.x + this.control.y) % 37 === 0) {
      store.setWorldPosition(Math.round(this.control.x), Math.round(this.control.y));
    }
  }

  public playPlayerAnimation(state: AnimationState): void { this.playExtra(this.player, state, state === 'sit' ? 2200 : 1250); }

  public playCharacterAnimation(id: string, state: AnimationState): void {
    const actor = id === 'player' ? this.player : this.actors.get(id);
    if (actor) this.playExtra(actor, state, 1250);
  }

  public applyPlayerProfile(profile: PlayerProfile | null): void {
    if (!this.player || !profile) return;
    const design = this.player.design;
    design.scaleX = profile.bodyType === 'breit' ? 1.15 : profile.bodyType === 'schmal' ? 0.9 : 1;
    design.hairStyle = profile.hairStyle === 'welle' ? 'wave' : profile.hairStyle === 'buzz' ? 'buzz' : profile.hairStyle === 'cap' ? 'cap' : 'short';
    design.shirt = parseHex(profile.shirt, design.shirt);
    design.shirtShade = shadeColor(design.shirt, -35);
    design.trousers = parseHex(profile.shorts, design.trousers);
    design.hair = parseHex(profile.hair, design.hair);
    design.accessories = profile.accessory === 'brille' ? ['glasses'] : profile.accessory === 'bart' ? ['beard'] : profile.accessory === 'ohrring' ? ['earring'] : ['none'];
    this.player.outfit.clear();
    this.player.hair.clear();
    this.player.accessory.clear();
    drawOutfit(this.player.outfit, design);
    drawHair(this.player.hair, design);
    drawAccessories(this.player.accessory, design);
    this.player.baseScaleX = 1.5 * design.scaleX;
    this.player.baseScaleY = 1.5 * design.scaleY;
    this.player.container.setScale(this.player.baseScaleX, this.player.baseScaleY);
  }

  private readonly onExternalAction = (): void => this.interact();
  private readonly onExternalDirection = (event: CustomEvent<{ direction: string; active: boolean }>): void => {
    if (event.detail.active) this.activeDirections.add(event.detail.direction);
    else this.activeDirections.delete(event.detail.direction);
  };
  private readonly onExternalAnimation = (event: CustomEvent<AnimationState>): void => this.playPlayerAnimation(event.detail);
  private readonly onProfile = (event: CustomEvent<PlayerProfile>): void => this.applyPlayerProfile(event.detail);
  private readonly onFocus = (event: CustomEvent<string>): void => {
    const actor = this.actors.get(event.detail);
    if (!actor) return;
    this.cameras.main.stopFollow();
    this.cameras.main.pan(actor.design.x, actor.design.y, 420, 'Sine.easeInOut', false, (_camera, progressValue) => {
      if (progressValue === 1) this.time.delayedCall(900, () => this.cameras.main.startFollow(this.control, true, 0.12, 0.12));
    });
    actor.marker.setVisible(true);
    this.time.delayedCall(1200, () => actor.marker.setVisible(false));
  };

  private interact(): void {
    if (!this.nearest || isOverlayOpen()) return;
    if (this.nearest.kind === 'character') this.interactCharacter(this.nearest.id);
    else this.interactWorld(this.nearest.id);
  }

  private interactCharacter(id: string): void {
    const visual = CHARACTER_BY_ID[id];
    if (!visual) return;
    this.playCharacterAnimation(id, visual.greetingAnimation);
    if (id === 'gundula') return openEncounter('gundula-entry');
    if (id === 'uli') return snapshot.flags.gundulaConvinced ? openEncounter('uli-entry') : showDialogue(visual, 'Gundula entscheidet zuerst, ob du überhaupt bis zu meinem Parkplatzproblem kommst.');
    if (id === 'manni') return snapshot.flags.gateOpen ? openEncounter('manni-paper') : showDialogue(visual, visual.dialogue);
    if (id === 'ronny') return snapshot.flags.gateOpen ? startActivity('battle') : showDialogue(visual, 'Ohne offiziellen Einlass diskutiere ich nicht. Regeln sind mir sehr wichtig, solange sie mir helfen.');
    const firstMeeting = store.socialize(id);
    const relationship = RELATIONSHIP_CHARACTERS.find((entry) => entry.id === id);
    showDialogue(visual, firstMeeting ? `${visual.dialogue} Ihr findet euch wieder – Beziehung und Gruppenmomentum steigen.` : relationship?.line ?? visual.dialogue);
  }

  private interactWorld(id: string): void {
    const target = WORLD_TARGETS.find((entry) => entry.id === id);
    if (!target) return;
    if (target.kind === 'activity' && !snapshot.flags.gateOpen) return toast('Erst den Einlass bei Gundula und Uli klären.');
    if (target.action === 'rest') {
      store.rest(60);
      this.playPlayerAnimation('sit');
      toast('Eine Stunde im Zelt: Energie steigt, das Wochenende läuft weiter.');
      return;
    }
    if (target.action === 'toilet') {
      store.relieve();
      this.playPlayerAnimation('cheer');
      toast('Sanitärgebäude rechtzeitig erreicht. Würde vorerst stabil.');
      return;
    }
    if (target.action === 'lake') {
      store.advanceMinutes(25);
      this.playPlayerAnimation('sit');
      toast('25 Minuten an der Blauen Adria. Die Ruhe hält überraschend kurz.');
      return;
    }
    if (target.action === 'grill') {
      const used = store.useItem('wuerste');
      if (!used) store.advanceMinutes(15);
      this.playPlayerAnimation('carry');
      toast(used ? 'Würste gegrillt. Hunger sinkt, Durst steigt leicht.' : 'Gregor erklärt den Grill. Ohne Würste bleibt es theoretisch.');
      return;
    }
    if (target.action === 'battle' || target.action === 'flipCup' || target.action === 'beerPong' || target.action === 'flunkyball') {
      startActivity(target.action);
    }
  }

  private updateNearest(): void {
    const candidates: NearbyTarget[] = [];
    for (const actor of this.actors.values()) {
      const distance = Phaser.Math.Distance.Between(this.control.x, this.control.y, actor.design.x, actor.design.y);
      if (distance <= 105) candidates.push({ kind: 'character', id: actor.design.id, label: actor.design.name, distance });
      actor.container.setDepth(actor.design.y);
      actor.label.setDepth(actor.design.y + 80);
      actor.marker.setDepth(actor.design.y - 80);
    }
    for (const target of WORLD_TARGETS) {
      if (target.id === 'battle') continue;
      const distance = Phaser.Math.Distance.Between(this.control.x, this.control.y, target.x, target.y);
      if (distance <= target.radius) candidates.push({ kind: 'world', id: target.id, label: target.label, distance });
    }
    candidates.sort((a, b) => a.distance - b.distance || (a.kind === 'character' ? -1 : 1));
    const next = candidates[0];
    if (this.nearest?.kind === 'character' && (this.nearest.kind !== next?.kind || this.nearest.id !== next?.id)) this.actors.get(this.nearest.id)?.marker.setVisible(false);
    this.nearest = next;
    if (next?.kind === 'character') this.actors.get(next.id)?.marker.setVisible(true);
    ui.prompt.hidden = !next || isOverlayOpen();
    if (next) ui.promptText.textContent = next.kind === 'character' ? `${next.label} ansprechen` : next.label;
  }

  private createCharacter(design: CharacterVisual, withLabel: boolean): CharacterActor {
    const body = this.add.sprite(0, 0, 'lpc-main-body', 19).setOrigin(0.5);
    const head = this.add.sprite(0, 0, 'lpc-main-head', 19).setOrigin(0.5);
    const face = this.add.sprite(0, 0, 'lpc-main-face', 19).setOrigin(0.5);
    const outfit = this.add.graphics();
    const hair = this.add.graphics();
    const accessory = this.add.graphics();
    const pose = this.add.graphics();
    const prop = this.add.graphics();
    drawOutfit(outfit, design);
    drawHair(hair, design);
    drawAccessories(accessory, design);
    const container = this.add.container(design.x, design.y - 21, [body, head, face, outfit, hair, accessory, pose, prop]);
    const baseScaleX = 1.5 * design.scaleX;
    const baseScaleY = 1.5 * design.scaleY;
    container.setScale(baseScaleX, baseScaleY);
    const marker = this.add.circle(design.x, design.y - 78, 17, 0xf2c35f, 0.12).setStrokeStyle(3, 0xffe49a, 0.95).setVisible(false);
    this.tweens.add({ targets: marker, scale: { from: 0.86, to: 1.28 }, alpha: { from: 0.9, to: 0.1 }, duration: 780, repeat: -1 });
    const label = this.add.text(design.x, design.y + 43, withLabel ? design.name : 'DU', {
      fontFamily: 'Arial Black, system-ui', fontSize: withLabel ? '12px' : '11px', color: '#fff4ce',
      backgroundColor: '#10261fe8', padding: { x: 7, y: 4 }, stroke: '#091712', strokeThickness: 2,
    }).setOrigin(0.5);
    return { design, container, body, head, face, outfit, hair, accessory, pose, prop, label, marker, baseScaleX, baseScaleY, animationToken: 0 };
  }

  private setActorFrame(actor: CharacterActor, frame: number): void {
    actor.body.setFrame(frame);
    actor.head.setFrame(frame);
    actor.face.setFrame(frame);
  }

  private playExtra(actor: CharacterActor, state: AnimationState, duration = 1150): void {
    actor.animationToken += 1;
    const token = actor.animationToken;
    this.tweens.killTweensOf(actor.container);
    this.tweens.killTweensOf(actor.pose);
    this.tweens.killTweensOf(actor.prop);
    actor.pose.clear();
    actor.prop.clear();
    actor.container.setAngle(0).setScale(actor.baseScaleX, actor.baseScaleY);
    actor.pose.setAngle(0).setAlpha(1);
    actor.prop.setAngle(0).setAlpha(1).setPosition(0, 0);
    drawPose(actor.pose, state, actor.design);
    drawProp(actor.prop, state, actor.design);

    if (state === 'idle') {
      this.tweens.add({ targets: actor.container, scaleY: actor.baseScaleY * 1.018, duration: 420, yoyo: true, repeat: 1 });
      this.tweens.add({ targets: actor.face, alpha: 0.15, duration: 90, yoyo: true, delay: 280 });
    } else if (state === 'talk') {
      this.tweens.add({ targets: actor.pose, angle: { from: -5, to: 7 }, duration: 180, yoyo: true, repeat: 3 });
      this.tweens.add({ targets: actor.container, y: actor.container.y - 2, duration: 190, yoyo: true, repeat: 2 });
    } else if (state === 'wave') {
      this.tweens.add({ targets: actor.pose, angle: { from: -15, to: 24 }, duration: 170, yoyo: true, repeat: 4 });
    } else if (state === 'drink') {
      this.tweens.add({ targets: actor.prop, x: -5, y: -16, angle: -24, duration: 300, yoyo: true, hold: 280 });
      this.tweens.add({ targets: actor.container, angle: -2, duration: 300, yoyo: true, hold: 220 });
    } else if (state === 'cheer') {
      this.tweens.add({ targets: actor.container, y: actor.container.y - 15, duration: 180, yoyo: true, repeat: 2, ease: 'Quad.easeOut' });
    } else if (state === 'stagger') {
      this.tweens.add({ targets: actor.container, angle: { from: -7, to: 8 }, x: actor.container.x + 5, duration: 210, yoyo: true, repeat: 3 });
    } else if (state === 'hit') {
      actor.body.setTint(0xff7b66); actor.head.setTint(0xff7b66); actor.face.setTint(0xff7b66);
      this.tweens.add({ targets: actor.container, x: actor.container.x + 14, angle: 6, duration: 130, yoyo: true, repeat: 1 });
    } else if (state === 'sit') {
      this.tweens.add({ targets: actor.container, scaleY: actor.baseScaleY * 0.76, y: actor.container.y + 10, duration: 220 });
    } else if (state === 'carry') {
      this.tweens.add({ targets: actor.prop, y: { from: 1, to: -2 }, duration: 280, yoyo: true, repeat: 3 });
    } else if (state === 'phone') {
      this.tweens.add({ targets: actor.container, angle: -2.5, duration: 280, yoyo: true, repeat: 2 });
      this.tweens.add({ targets: actor.face, alpha: 0.25, duration: 80, yoyo: true, delay: 390 });
    }

    this.time.delayedCall(duration, () => {
      if (actor.animationToken !== token) return;
      actor.pose.clear(); actor.prop.clear();
      actor.container.setAngle(0).setScale(actor.baseScaleX, actor.baseScaleY);
      actor.body.clearTint(); actor.head.clearTint(); actor.face.clearTint();
      if (actor === this.player) actor.container.setPosition(this.control.x, this.control.y - 21);
      else actor.container.setPosition(actor.design.x, actor.design.y - 21);
    });
  }

  private drawWorld(): void {
    const g = this.add.graphics();
    g.fillStyle(0x416d50).fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    for (let y = 12; y < WORLD_HEIGHT; y += 25) for (let x = 12 + ((y / 25) % 2) * 8; x < WORLD_WIDTH; x += 28) {
      g.fillStyle((x + y) % 3 === 0 ? 0x527b59 : 0x365d45, 0.38).fillRect(x, y, 3, 2);
    }

    g.fillStyle(0xb9a77a).fillRoundedRect(80, 690, 1450, 115, 34);
    g.fillStyle(0xcbb989).fillRoundedRect(310, 105, 150, 700, 42);
    g.fillStyle(0xcbb989).fillRoundedRect(930, 120, 130, 660, 38);
    g.lineStyle(3, 0x8b7952, 0.75).strokeRoundedRect(80, 690, 1450, 115, 34);

    g.fillStyle(0x2a536c).fillRoundedRect(1320, 50, 340, 850, 52);
    g.lineStyle(5, 0x6ba8b2, 0.8).strokeRoundedRect(1320, 50, 340, 850, 52);
    for (let y = 80; y < 880; y += 32) g.lineStyle(2, 0x83c0c5, 0.25).lineBetween(1340, y, 1635, y + 9);

    drawBuilding(this, 100, 105, 310, 190, 'ANMELDUNG', 0x6d4232);
    drawBuilding(this, 900, 100, 260, 190, 'SANITÄR', 0x37566d);
    drawParking(this);
    drawTentCamp(this);
    drawPartyArea(this);
    drawBeach(this);
    drawVegetation(this);

    for (const target of WORLD_TARGETS) drawTargetMarker(this, target);
    this.add.text(820, 45, 'TALES OF THE BLAUE ADRIA · LPC CONCEPT BUILD', {
      fontFamily: 'Arial Black, system-ui', fontSize: '22px', color: '#fff1be', backgroundColor: '#173229e8',
      padding: { x: 14, y: 8 }, stroke: '#0a1713', strokeThickness: 3,
    }).setOrigin(0.5).setDepth(5000);
    this.add.text(1510, 185, 'BLAUE ADRIA', { fontFamily: 'Arial Black', fontSize: '20px', color: '#d8f3ee' }).setOrigin(0.5).setRotation(Math.PI / 2);
  }
}

function drawOutfit(graphics: Phaser.GameObjects.Graphics, design: CharacterVisual): void {
  graphics.fillStyle(design.trousers).fillRoundedRect(-9, 7, 8, 14, 2).fillRoundedRect(1, 7, 8, 14, 2);
  graphics.fillStyle(0x151c1c, 0.82).fillRect(-9, 19, 8, 3).fillRect(1, 19, 8, 3);
  const sleeves = (): void => { graphics.fillStyle(design.shirtShade).fillRoundedRect(-14, -5, 5, 12, 2).fillRoundedRect(9, -5, 5, 12, 2); };
  if (design.outfit === 'tank-top') {
    graphics.fillStyle(design.shirt).fillRoundedRect(-7, -7, 14, 17, 4);
    graphics.lineStyle(2, design.shirtShade).lineBetween(-5, -5, -5, 8).lineBetween(5, -5, 5, 8);
  } else if (design.outfit === 'strict-jacket') {
    graphics.fillStyle(design.shirt).fillRoundedRect(-11, -8, 22, 20, 4); sleeves();
    graphics.fillStyle(design.shirtShade).fillTriangle(-9, -7, -1, 4, -1, -7).fillTriangle(9, -7, 1, 4, 1, -7);
    graphics.fillStyle(design.accent).fillCircle(0, 3, 1.2).fillCircle(0, 8, 1.2);
  } else if (design.outfit === 'hoodie') {
    graphics.fillStyle(design.shirtShade).fillCircle(0, -11, 12);
    graphics.fillStyle(design.shirt).fillRoundedRect(-12, -8, 24, 21, 6); sleeves();
    graphics.lineStyle(1.5, design.accent, 0.75).lineBetween(-3, -6, -3, 2).lineBetween(3, -6, 3, 2);
  } else if (design.outfit === 'camp-shirt' || design.outfit === 'pattern-shirt' || design.outfit === 'plaid') {
    graphics.fillStyle(design.shirt).fillRoundedRect(-11, -8, 22, 20, 4); sleeves();
    graphics.fillStyle(design.shirtShade).fillTriangle(-7, -7, 0, 2, 0, -7).fillTriangle(7, -7, 0, 2, 0, -7);
    if (design.outfit === 'pattern-shirt') graphics.fillStyle(design.accent, 0.78).fillTriangle(-8, -3, -3, 1, -8, 5).fillTriangle(2, -6, 8, -2, 3, 2).fillCircle(5, 7, 2);
    if (design.outfit === 'plaid') {
      graphics.lineStyle(1, design.accent, 0.75).lineBetween(-7, -7, -7, 11).lineBetween(0, -7, 0, 11).lineBetween(7, -7, 7, 11).lineBetween(-10, -1, 10, -1).lineBetween(-10, 6, 10, 6);
    }
  } else if (design.outfit === 'polo') {
    graphics.fillStyle(design.shirt).fillRoundedRect(-11, -8, 22, 20, 4); sleeves();
    graphics.fillStyle(design.accent).fillTriangle(-5, -7, 0, 1, 5, -7).fillCircle(0, 5, 1.3);
  } else if (design.outfit === 'jersey') {
    graphics.fillStyle(design.shirt).fillRoundedRect(-12, -8, 24, 21, 3); sleeves();
    graphics.lineStyle(2, design.accent, 0.85).strokeRoundedRect(-10, -6, 20, 16, 2).lineBetween(-10, 0, 10, 0);
  } else if (design.outfit === 'utility-vest') {
    graphics.fillStyle(design.shirtShade).fillRoundedRect(-12, -8, 24, 21, 3); sleeves();
    graphics.fillStyle(design.shirt).fillRoundedRect(-10, -7, 8, 18, 2).fillRoundedRect(2, -7, 8, 18, 2);
    graphics.fillStyle(design.accent).fillRoundedRect(-8, 2, 5, 5, 1).fillRoundedRect(3, 2, 5, 5, 1);
  } else if (design.outfit === 'night-shirt') {
    graphics.fillStyle(design.shirt).fillRoundedRect(-13, -9, 26, 26, 5); sleeves();
    graphics.fillStyle(design.accent, 0.55).fillCircle(-6, -2, 2).fillCircle(5, 5, 2).fillCircle(0, 11, 1.5);
  } else {
    graphics.fillStyle(design.shirt).fillRoundedRect(-11, -8, 22, 20, 5); sleeves();
    graphics.fillStyle(design.accent, 0.75).fillRect(-7, 0, 14, 3);
  }
}

function drawHair(graphics: Phaser.GameObjects.Graphics, design: CharacterVisual): void {
  const y = -20;
  graphics.fillStyle(design.hair);
  if (design.hairStyle === 'short') graphics.fillRoundedRect(-10, y - 6, 20, 8, 4).fillTriangle(-10, y - 1, -7, y + 5, -3, y);
  else if (design.hairStyle === 'curly') for (const [x, dy, r] of [[-9, 0, 5], [-5, -5, 5], [1, -6, 6], [7, -4, 5], [10, 1, 4]] as const) graphics.fillCircle(x, y + dy, r);
  else if (design.hairStyle === 'sidepart') graphics.fillRoundedRect(-11, y - 6, 22, 8, 4).fillTriangle(-1, y - 6, 11, y - 3, 11, y + 5);
  else if (design.hairStyle === 'cap') { graphics.fillStyle(design.accent).fillRoundedRect(-12, y - 7, 23, 8, 4).fillRect(6, y, 12, 3); graphics.fillStyle(design.hair).fillRect(-9, y, 17, 4); }
  else if (design.hairStyle === 'spiky-white') { graphics.fillRoundedRect(-11, y - 4, 22, 6, 2); for (let x = -10; x <= 8; x += 4) graphics.fillTriangle(x, y - 3, x + 3, y - 12 - Math.abs(x % 3), x + 6, y - 2); }
  else if (design.hairStyle === 'bald') { graphics.lineStyle(1.3, 0xf3d7bd, 0.7).beginPath().arc(0, y + 1, 8, Math.PI * 1.1, Math.PI * 1.9).strokePath(); graphics.fillStyle(0xffffff, 0.18).fillEllipse(-3, y - 3, 7, 3); }
  else if (design.hairStyle === 'buzz') graphics.fillStyle(design.hair, 0.82).fillEllipse(0, y - 1, 20, 10);
  else if (design.hairStyle === 'messy') for (let x = -11; x <= 8; x += 4) graphics.fillTriangle(x, y + 2, x + 3, y - 9 - Math.abs(x % 5), x + 7, y + 1);
  else if (design.hairStyle === 'wave') graphics.fillRoundedRect(-11, y - 5, 22, 8, 4).fillCircle(-8, y + 1, 5).fillCircle(8, y, 5);
  else if (design.hairStyle === 'beanie') { graphics.fillStyle(design.accent).fillRoundedRect(-12, y - 8, 24, 11, 6).fillRect(-12, y, 24, 4); }
  else if (design.hairStyle === 'long') graphics.fillRoundedRect(-12, y - 6, 24, 11, 5).fillRoundedRect(-13, y, 6, 19, 3).fillRoundedRect(7, y, 6, 19, 3);
}

function drawAccessories(graphics: Phaser.GameObjects.Graphics, design: CharacterVisual): void {
  for (const accessory of design.accessories) drawAccessory(graphics, design, accessory);
}

function drawAccessory(graphics: Phaser.GameObjects.Graphics, design: CharacterVisual, accessory: Accessory): void {
  if (accessory === 'glasses') graphics.lineStyle(1.5, 0x171b1d).strokeRect(-9, -19, 7, 5).strokeRect(2, -19, 7, 5).lineBetween(-2, -17, 2, -17);
  else if (accessory === 'sunglasses') graphics.fillStyle(0x11181d, 0.96).fillRoundedRect(-9, -19, 8, 5, 1).fillRoundedRect(1, -19, 8, 5, 1);
  else if (accessory === 'earring') graphics.fillStyle(0xe4c66c).fillCircle(10, -14, 1.6);
  else if (accessory === 'beard') graphics.fillStyle(design.hair, 0.94).fillRoundedRect(-7, -12, 14, 7, 4).fillTriangle(-6, -7, 0, -2, 6, -7);
  else if (accessory === 'clipboard') { graphics.fillStyle(0x8a633a).fillRoundedRect(12, -1, 9, 15, 2); graphics.fillStyle(0xe9dfc7).fillRect(14, 1, 5, 10); }
  else if (accessory === 'keys') graphics.lineStyle(1.5, design.accent).strokeCircle(14, 9, 3).lineBetween(16, 11, 21, 16).lineBetween(19, 14, 21, 12);
  else if (accessory === 'bag') { graphics.lineStyle(1.6, 0x5a402e, 0.9).lineBetween(-8, -8, 10, 13); graphics.fillStyle(0x76543b).fillRoundedRect(8, 8, 10, 11, 2); }
  else if (accessory === 'phone') graphics.fillStyle(0x1a2029).fillRoundedRect(12, -8, 5, 9, 1);
  else if (accessory === 'spatula') graphics.lineStyle(2, 0x6c4a2d).lineBetween(13, -3, 20, 14).fillStyle(0xb8c0c2).fillRect(18, 12, 7, 5);
  else if (accessory === 'whistle') graphics.lineStyle(1.2, design.accent).lineBetween(-3, -6, 7, 5).fillStyle(design.accent).fillCircle(8, 6, 2);
  else if (accessory === 'headphones') graphics.lineStyle(2.3, 0x181c27).beginPath().arc(0, -17, 11, Math.PI, Math.PI * 2).strokePath().fillStyle(0x181c27).fillRoundedRect(-13, -18, 4, 9, 2).fillRoundedRect(9, -18, 4, 9, 2);
  else if (accessory === 'plant') { graphics.fillStyle(0x7b5537).fillRoundedRect(12, 7, 9, 8, 2); graphics.fillStyle(0x4f8f50).fillEllipse(14, 4, 5, 10).fillEllipse(20, 2, 5, 11); }
}

function drawPose(graphics: Phaser.GameObjects.Graphics, state: AnimationState, design: CharacterVisual): void {
  graphics.lineStyle(3.2, design.shirtShade, 1);
  if (state === 'talk') graphics.lineBetween(-10, -2, -19, -12).lineBetween(10, -2, 19, -8);
  else if (state === 'wave') graphics.lineBetween(8, -3, 17, -18).lineBetween(17, -18, 15, -27);
  else if (state === 'drink') graphics.lineBetween(-8, -1, -16, -12);
  else if (state === 'cheer') graphics.lineBetween(-8, -3, -17, -22).lineBetween(8, -3, 17, -22);
  else if (state === 'hit') graphics.lineBetween(-8, -2, -17, 8).lineBetween(8, -2, 17, 8);
  else if (state === 'sit') graphics.lineBetween(-7, 9, -16, 17).lineBetween(7, 9, 16, 17);
  else if (state === 'carry') graphics.lineBetween(-9, -1, -15, 10).lineBetween(9, -1, 15, 10);
  else if (state === 'phone') graphics.lineBetween(8, -2, 14, -13);
}

function drawProp(graphics: Phaser.GameObjects.Graphics, state: AnimationState, design: CharacterVisual): void {
  if (state === 'drink') { graphics.fillStyle(0xe7c35a).fillRoundedRect(-20, -10, 7, 12, 2); graphics.fillStyle(0xf5e7b5, 0.75).fillRect(-19, -9, 5, 3); }
  else if (state === 'carry') { graphics.fillStyle(0x8b5a34).fillRoundedRect(-15, 8, 30, 16, 2); graphics.lineStyle(1.2, 0xc39357).lineBetween(-12, 12, 12, 12).lineBetween(0, 9, 0, 23); }
  else if (state === 'phone') { graphics.fillStyle(0x101722).fillRoundedRect(12, -18, 7, 12, 2); graphics.fillStyle(design.accent, 0.7).fillRect(14, -16, 3, 6); }
  else if (state === 'sit') { graphics.fillStyle(0x634a36).fillRect(-17, 18, 34, 4).fillRect(-15, 20, 4, 15).fillRect(11, 20, 4, 15); }
}

function drawBuilding(scene: Phaser.Scene, x: number, y: number, w: number, h: number, label: string, roof: number): void {
  const g = scene.add.graphics();
  g.fillStyle(0x29483e).fillRoundedRect(x, y, w, h, 10);
  g.fillStyle(roof).fillTriangle(x - 15, y + 20, x + w / 2, y - 65, x + w + 15, y + 20);
  g.fillStyle(0xb96f47).fillTriangle(x, y + 16, x + w / 2, y - 50, x + w, y + 16);
  g.fillStyle(0xd8c58f).fillRoundedRect(x + w / 2 - 32, y + h - 92, 64, 92, 4);
  g.fillStyle(0x91c2c0).fillRoundedRect(x + 28, y + 48, 68, 48, 5).fillRoundedRect(x + w - 96, y + 48, 68, 48, 5);
  scene.add.text(x + w / 2, y + 25, label, { fontFamily: 'Arial Black', fontSize: '16px', color: '#fff1c0' }).setOrigin(0.5);
}

function drawParking(scene: Phaser.Scene): void {
  const g = scene.add.graphics();
  g.fillStyle(0x4a5052).fillRoundedRect(70, 330, 400, 270, 14);
  g.lineStyle(3, 0xd9d1a6, 0.75);
  for (let x = 105; x < 440; x += 85) g.lineBetween(x, 365, x, 565);
  scene.add.text(270, 345, 'PARKPLATZ 4', { fontFamily: 'Arial Black', fontSize: '15px', color: '#f3eac2' }).setOrigin(0.5);
  for (const [x, color] of [[125, 0x9e5548], [215, 0x4a7897], [305, 0x987447], [395, 0x5e8260]] as const) {
    g.fillStyle(color).fillRoundedRect(x, 430, 62, 32, 7).fillRoundedRect(x + 10, 418, 42, 18, 6);
    g.fillStyle(0x171b1c).fillCircle(x + 13, 464, 8).fillCircle(x + 49, 464, 8);
  }
}

function drawTentCamp(scene: Phaser.Scene): void {
  const g = scene.add.graphics();
  const tents = [[500, 360, 0xc85b48], [650, 335, 0x3f8c82], [800, 370, 0xd39b45], [875, 470, 0x547aa4], [525, 485, 0x8062a0], [660, 505, 0x4c8f62]] as const;
  for (const [x, y, color] of tents) {
    g.fillStyle(color).fillTriangle(x - 50, y + 45, x, y - 28, x + 50, y + 45);
    g.fillStyle(shadeColor(color, -38)).fillTriangle(x, y - 28, x + 50, y + 45, x + 12, y + 45);
    g.fillStyle(0x241f1b, 0.85).fillTriangle(x - 9, y + 45, x, y + 15, x + 9, y + 45);
  }
  g.fillStyle(0x36291f).fillCircle(690, 590, 30);
  g.fillStyle(0xe87936).fillTriangle(670, 598, 690, 552, 710, 598).fillStyle(0xf3c84d).fillTriangle(681, 598, 692, 568, 701, 598);
  scene.add.text(690, 300, 'ZELTKREIS', { fontFamily: 'Arial Black', fontSize: '15px', color: '#fff0bd', backgroundColor: '#173229d9', padding: { x: 9, y: 5 } }).setOrigin(0.5);
}

function drawPartyArea(scene: Phaser.Scene): void {
  const g = scene.add.graphics();
  g.fillStyle(0x2f4d42, 0.9).fillRoundedRect(300, 800, 800, 170, 18);
  g.fillStyle(0xd66b4e).fillTriangle(330, 900, 445, 760, 560, 900);
  g.fillStyle(0x416d9c).fillTriangle(655, 900, 780, 755, 905, 900);
  g.fillStyle(0x7a5d99).fillTriangle(925, 900, 1010, 790, 1095, 900);
  g.fillStyle(0xd7bc72).fillRoundedRect(390, 885, 120, 12, 3).fillRoundedRect(720, 875, 120, 12, 3);
  scene.add.text(700, 930, 'PARTY- UND SPIELWIESE', { fontFamily: 'Arial Black', fontSize: '15px', color: '#fff0bd' }).setOrigin(0.5);
}

function drawBeach(scene: Phaser.Scene): void {
  const g = scene.add.graphics();
  g.fillStyle(0xd7c18b).fillRoundedRect(1280, 545, 145, 310, 35);
  g.fillStyle(0xe8d39c, 0.65).fillRoundedRect(1305, 580, 95, 240, 25);
  g.fillStyle(0xd95d4f).fillCircle(1370, 650, 13).fillStyle(0xf0e4c1).fillCircle(1370, 650, 5);
  scene.add.text(1360, 835, 'STRAND', { fontFamily: 'Arial Black', fontSize: '16px', color: '#4c4027' }).setOrigin(0.5);
}

function drawVegetation(scene: Phaser.Scene): void {
  const g = scene.add.graphics();
  for (let i = 0; i < 62; i += 1) {
    const x = 30 + ((i * 197) % 1580);
    const y = 50 + ((i * 113) % 900);
    if ((x > 60 && x < 1180 && y > 80 && y < 900) && i % 3 !== 0) continue;
    g.fillStyle(0x6b452d).fillRect(x - 4, y, 8, 23);
    g.fillStyle(i % 2 ? 0x315f3b : 0x3d7146).fillCircle(x, y - 8, 22).fillCircle(x - 13, y, 16).fillCircle(x + 13, y, 17);
  }
}

function drawTargetMarker(scene: Phaser.Scene, target: WorldTarget): void {
  const colors = target.kind === 'activity' ? [0xc34f45, 0xffd36d] : target.kind === 'service' ? [0x3d758b, 0x9bdae3] : [0x447b62, 0xb8e6b9];
  const marker = scene.add.circle(target.x, target.y, 24, colors[0], 0.26).setStrokeStyle(3, colors[1], 0.78).setDepth(target.y - 100);
  scene.tweens.add({ targets: marker, scale: { from: 0.92, to: 1.2 }, alpha: { from: 0.7, to: 0.2 }, duration: 950, yoyo: true, repeat: -1 });
  scene.add.text(target.x, target.y + 34, target.label, { fontFamily: 'Arial Black', fontSize: '11px', color: '#fff5d0', backgroundColor: '#10261fd9', padding: { x: 6, y: 3 } }).setOrigin(0.5).setDepth(target.y + 50);
}

function beginSetup(): void {
  const profile = buildProfile();
  const cart = readCart();
  if (!profile.name.trim()) { ui.setupError.textContent = 'Bitte einen Namen eintragen.'; return; }
  if (snapshot.mode === 'intro') store.completeIntro();
  store.setProfile(profile);
  const result = store.completeShopping(cart);
  if (!result.ok) { ui.setupError.textContent = result.error ?? 'Einkauf konnte nicht abgeschlossen werden.'; return; }
  ui.setupError.textContent = '';
  closeOverlay(ui.setup);
  window.dispatchEvent(new CustomEvent('lpc-main-profile', { detail: profile }));
  toast('Einkauf abgeschlossen. Melde dich bei Gundula an der Rezeption.');
}

function buildProfile(): PlayerProfile {
  return {
    name: inputValue('player-name') || 'André',
    skinTone: inputValue('skin-tone') || '#d9a67e',
    hair: inputValue('hair-color') || '#4a3224',
    shirt: inputValue('shirt-color') || '#e5ad43',
    shorts: inputValue('shorts-color') || '#294954',
    hairStyle: selectValue<PlayerProfile['hairStyle']>('hair-style', 'kurz'),
    bodyType: selectValue<PlayerProfile['bodyType']>('body-type', 'normal'),
    accessory: selectValue<PlayerProfile['accessory']>('accessory', 'keins'),
    trait: selectValue<PlayerProfile['trait']>('trait', 'hilfsbereit'),
  };
}

function readCart(): Record<string, number> {
  return Object.fromEntries(Object.keys(ITEMS).map((id) => [id, Math.max(0, Number(inputValue(`cart-${id}`)) || 0)]));
}

function updateSetupTotal(): void {
  const total = Object.entries(readCart()).reduce((sum, [id, amount]) => sum + ITEMS[id].price * amount, 0);
  ui.setupTotal.textContent = `${total} € / 25 €`;
  ui.setupTotal.classList.toggle('over', total > 25);
}

function renderHud(next: GameSnapshot): void {
  snapshot = next;
  const quest = next.activeQuest ? QUESTS[next.activeQuest] : undefined;
  ui.questTitle.textContent = quest?.title ?? 'Freies Wochenende';
  ui.objective.textContent = next.currentObjective;
  ui.time.textContent = `Tag ${next.day} · ${next.clockLabel} · ${next.phaseLabel}`;
  ui.condition.textContent = next.conditionLabel;
  ui.money.textContent = `${next.money} €`;
  ui.needs.innerHTML = [
    ['Energie', next.needs.energy, false], ['Hunger', next.needs.hunger, true], ['Durst', next.needs.thirst, true],
    ['Blase', next.needs.bladder, true], ['Alkohol', next.needs.alcohol, true], ['Kater', next.needs.hangover, true], ['Mut', next.needs.courage, false],
  ].map(([label, value, inverse]) => meterHtml(String(label), Number(value), Boolean(inverse))).join('');
  ui.metrics.innerHTML = [
    ['Würde', next.metrics.dignity], ['Chaos', next.metrics.chaos], ['Ruf', next.metrics.reputation], ['Momentum', next.metrics.momentum + 50],
  ].map(([label, value]) => meterHtml(String(label), Number(value), label === 'Chaos')).join('');
  ui.inventory.innerHTML = Object.values(ITEMS).map((item) => {
    const amount = next.inventory[item.id] ?? 0;
    return `<button type="button" data-item="${item.id}" ${amount <= 0 ? 'disabled' : ''}><span>${item.icon}</span><strong>${escapeHtml(item.label)}</strong><small>${amount}×</small></button>`;
  }).join('');
  ui.inventory.querySelectorAll<HTMLButtonElement>('[data-item]').forEach((button) => button.addEventListener('click', () => useItem(button.dataset.item ?? '')));

  ui.roster.innerHTML = RELATIONSHIP_CHARACTERS.map((character) => {
    const met = Boolean(next.flags[`met-${character.id}`]);
    const relation = next.relationships[character.id] ?? 0;
    return `<button type="button" data-focus="${character.id}" class="${met ? 'met' : ''}"><span style="--portrait:${character.color}">${character.portrait}</span><div><strong>${escapeHtml(character.name)}</strong><small>${met ? `${relation >= 0 ? '+' : ''}${relation} Beziehung` : 'noch nicht gefunden'}</small></div></button>`;
  }).join('');
  ui.roster.querySelectorAll<HTMLButtonElement>('[data-focus]').forEach((button) => button.addEventListener('click', () => window.dispatchEvent(new CustomEvent('lpc-main-focus', { detail: button.dataset.focus }))));
  ui.team.innerHTML = next.team.length ? next.team.map((member) => `<div><strong>${escapeHtml(member.name)}</strong><small>${escapeHtml(member.role)} · Loyalität ${member.loyalty}</small></div>`).join('') : '<p>Noch niemand rekrutiert.</p>';
  ui.chronicle.innerHTML = next.chronicle.slice(-5).reverse().map((entry) => `<p class="${entry.tone}">${escapeHtml(entry.text)}</p>`).join('') || '<p>Das Wochenende hat noch keine belastbaren Spuren hinterlassen.</p>';

  const completedCore = ['entry', 'reunion', 'paper', 'rival', 'flip', 'pong', 'flunky'].filter((id) => next.quests[id]?.status === 'completed').length;
  ui.completion.hidden = completedCore < 5;
  if (completedCore >= 5) ui.completion.innerHTML = `<strong>${completedCore}/7 Kernstationen abgeschlossen</strong><span>Die LPC-Richtung trägt bereits Welt, Figuren, Quests, Statussysteme, Duell und Partyspiele.</span>`;
}

function useItem(id: string): void {
  if (!store.useItem(id)) return toast('Dieser Gegenstand ist gerade nicht verfügbar.');
  const animation: AnimationState = ['bier', 'batida', 'wasser', 'kaffee'].includes(id) ? 'drink' : 'carry';
  gameScene?.playPlayerAnimation(animation);
  toast(`${ITEMS[id]?.label ?? id} benutzt.`);
}

function openEncounter(id: string): void {
  if (!store.openEncounter(id)) return toast('Diese Begegnung ist noch nicht verfügbar.');
  renderEncounter();
  openOverlay(ui.encounter);
}

function renderEncounter(): void {
  const active = snapshot.encounter;
  if (!active) return closeOverlay(ui.encounter);
  const encounter = ENCOUNTERS[active.id];
  if (!encounter) return;
  ui.encounterName.textContent = encounter.speaker;
  ui.encounterIntro.textContent = encounter.intro;
  ui.encounterResult.hidden = !active.result;
  if (active.result) {
    ui.encounterResult.innerHTML = `<strong>${active.result.outcome.toUpperCase()}</strong><p>${escapeHtml(active.result.text)}</p><small>Chance ${active.result.chance}% · Wurf ${active.result.roll}</small>`;
    ui.encounterOptions.innerHTML = '<button type="button" data-close-encounter>Zurück in die Welt</button>';
    ui.encounterOptions.querySelector<HTMLButtonElement>('[data-close-encounter]')?.addEventListener('click', closeEncounter);
    const speakerId = encounter.speaker.toLowerCase().includes('gundula') ? 'gundula' : encounter.speaker.toLowerCase().includes('uli') ? 'uli' : 'manni';
    gameScene?.playCharacterAnimation(speakerId, active.result.outcome === 'great' || active.result.outcome === 'success' ? 'talk' : 'hit');
    gameScene?.playPlayerAnimation(active.result.outcome === 'great' || active.result.outcome === 'success' ? 'cheer' : 'stagger');
    return;
  }
  ui.encounterOptions.innerHTML = encounter.options.map((option) => {
    const disabled = option.requiredItem && !snapshot.inventory[option.requiredItem];
    return `<button type="button" data-option="${option.id}" ${disabled ? 'disabled' : ''}><strong>${escapeHtml(option.label)}</strong><small>${escapeHtml(option.hint)}</small></button>`;
  }).join('');
  ui.encounterOptions.querySelectorAll<HTMLButtonElement>('[data-option]').forEach((button) => button.addEventListener('click', () => {
    store.resolveEncounter(button.dataset.option ?? '');
    renderEncounter();
  }));
}

function closeEncounter(): void {
  store.closeEncounter();
  closeOverlay(ui.encounter);
}

function showDialogue(visual: CharacterVisual, text: string): void {
  ui.dialogName.textContent = visual.name;
  ui.dialogRole.textContent = visual.role;
  ui.dialogPortrait.textContent = visual.name.slice(0, 2).toUpperCase();
  ui.dialogPortrait.style.setProperty('--portrait-color', colorToCss(visual.shirt));
  ui.dialogText.textContent = text;
  openOverlay(ui.dialog);
}

function startActivity(id: ActivityId): void {
  if (activityRuntime?.running) return;
  const definitions: Record<ActivityId, { title: string; copy: string; targetWidth: number; targetLeft: number }> = {
    battle: { title: 'Camping-Duell gegen Ronny', copy: 'Stoppe den Marker im Argumentationsfenster. Ein sauberer Treffer bringt Ronny ins Team.', targetWidth: 28, targetLeft: 36 },
    flipCup: { title: 'Flip Cup', copy: 'Timing statt rohe Gewalt: Stoppe im goldenen Bereich, damit der Becher sauber landet.', targetWidth: 20, targetLeft: 42 },
    beerPong: { title: 'Beer Pong', copy: 'Stoppe die Flugkurve möglichst mittig. Je näher, desto mehr versenkte Becher.', targetWidth: 18, targetLeft: 55 },
    flunkyball: { title: 'Flunkyball', copy: 'Tempo, Trinken, Konzentration. Triff das schmale Staffelfenster.', targetWidth: 16, targetLeft: 25 },
  };
  const definition = definitions[id];
  ui.activityTitle.textContent = definition.title;
  ui.activityCopy.textContent = definition.copy;
  ui.activityTarget.style.left = `${definition.targetLeft}%`;
  ui.activityTarget.style.width = `${definition.targetWidth}%`;
  ui.activityResult.hidden = true;
  ui.activityResult.textContent = '';
  ui.activityButton.disabled = false;
  ui.activityButton.textContent = id === 'battle' ? 'KONTERN' : 'STOPP';
  activityRuntime = { id, value: 0.05, direction: 1, running: true, lastTime: performance.now(), raf: 0 };
  openOverlay(ui.activity);
  activityRuntime.raf = requestAnimationFrame(tickActivity);
  gameScene?.playPlayerAnimation(id === 'battle' ? 'talk' : id === 'flunkyball' ? 'stagger' : 'carry');
}

function tickActivity(time: number): void {
  const runtime = activityRuntime;
  if (!runtime?.running) return;
  const delta = Math.min(40, time - runtime.lastTime);
  runtime.lastTime = time;
  const speed = runtime.id === 'flunkyball' ? 0.0015 : runtime.id === 'battle' ? 0.00105 : 0.00125;
  runtime.value += runtime.direction * delta * speed;
  if (runtime.value >= 0.98) { runtime.value = 0.98; runtime.direction = -1; }
  if (runtime.value <= 0.02) { runtime.value = 0.02; runtime.direction = 1; }
  ui.activityPointer.style.left = `${runtime.value * 100}%`;
  runtime.raf = requestAnimationFrame(tickActivity);
}

function resolveActivity(): void {
  const runtime = activityRuntime;
  if (!runtime?.running) return;
  runtime.running = false;
  cancelAnimationFrame(runtime.raf);
  const targets: Record<ActivityId, { center: number; tolerance: number }> = {
    battle: { center: 0.5, tolerance: 0.14 }, flipCup: { center: 0.52, tolerance: 0.1 }, beerPong: { center: 0.64, tolerance: 0.09 }, flunkyball: { center: 0.33, tolerance: 0.08 },
  };
  const target = targets[runtime.id];
  const distance = Math.abs(runtime.value - target.center);
  const success = distance <= target.tolerance;
  const quality = distance <= target.tolerance * 0.35 ? 'perfect' : 'solid';
  const score = Math.max(0, Math.round((1 - distance) * 100));
  store.recordActivity(runtime.id, success, quality, runtime.id === 'beerPong' ? Math.max(0, Math.round((1 - distance * 3) * 3)) : score);
  ui.activityButton.disabled = true;
  ui.activityResult.hidden = false;
  ui.activityResult.innerHTML = success
    ? `<strong>${quality === 'perfect' ? 'PERFEKT' : 'GESCHAFFT'}</strong><p>${activitySuccessText(runtime.id, quality)}</p><small>Wert ${score}</small>`
    : `<strong>DANEBEN</strong><p>${activityFailureText(runtime.id)}</p><small>Wert ${score}</small>`;
  if (runtime.id === 'battle') {
    gameScene?.playCharacterAnimation('ronny', success ? 'hit' : 'cheer');
    gameScene?.playPlayerAnimation(success ? 'cheer' : 'hit');
  } else gameScene?.playPlayerAnimation(success ? 'cheer' : 'stagger');
}

function closeActivity(): void {
  if (activityRuntime?.running) cancelAnimationFrame(activityRuntime.raf);
  activityRuntime = undefined;
  closeOverlay(ui.activity);
}

function activitySuccessText(id: ActivityId, quality: string): string {
  if (id === 'battle') return quality === 'perfect' ? 'Ronny hat für einen Moment keine Antwort. Historischer Zustand.' : 'Dein Konter sitzt. Ronny akzeptiert dich widerwillig.';
  if (id === 'flipCup') return 'Der Becher landet. Würde und Ruf steigen gleichzeitig – seltene Kombination.';
  if (id === 'beerPong') return 'Die Flugkurve passt. Felix erklärt es sofort zu Absicht.';
  return 'Flasche um, Staffel sauber. Der Strand erkennt einen neuen Maßstab an.';
}

function activityFailureText(id: ActivityId): string {
  if (id === 'battle') return 'Ronny nutzt die Pause für einen weiteren Vortrag.';
  if (id === 'flipCup') return 'Der Becher hat die Diskussion gewonnen.';
  if (id === 'beerPong') return 'Der Tisch war eindeutig nicht eben.';
  return 'Rennen, trinken und denken waren zusammen zu viel.';
}

function openOverlay(node: HTMLElement): void {
  if (!node.hidden) return;
  node.hidden = false;
  overlayCount += 1;
  ui.prompt.hidden = true;
}

function closeOverlay(node: HTMLElement): void {
  if (node.hidden) return;
  node.hidden = true;
  overlayCount = Math.max(0, overlayCount - 1);
}

function isOverlayOpen(): boolean { return overlayCount > 0 || !ui.setup.hidden; }

function toast(message: string): void {
  ui.toast.textContent = message;
  ui.toast.classList.add('visible');
  window.setTimeout(() => ui.toast.classList.remove('visible'), 2800);
}

function meterHtml(label: string, value: number, danger: boolean): string {
  const normalized = Math.max(0, Math.min(100, value));
  return `<div class="meter-row ${danger && normalized >= 70 ? 'danger' : ''}"><span>${escapeHtml(label)}</span><div><i style="width:${normalized}%"></i></div><strong>${Math.round(value)}</strong></div>`;
}

function parseHex(value: string, fallback: number): number {
  const normalized = value.replace('#', '');
  const parsed = Number.parseInt(normalized, 16);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function shadeColor(color: number, amount: number): number {
  const r = Math.max(0, Math.min(255, ((color >> 16) & 255) + amount));
  const g = Math.max(0, Math.min(255, ((color >> 8) & 255) + amount));
  const b = Math.max(0, Math.min(255, (color & 255) + amount));
  return (r << 16) | (g << 8) | b;
}

function colorToCss(color: number): string { return `#${color.toString(16).padStart(6, '0')}`; }
function inputValue(id: string): string { return (document.getElementById(id) as HTMLInputElement | HTMLSelectElement | null)?.value ?? ''; }
function selectValue<T extends string>(id: string, fallback: T): T { return (inputValue(id) || fallback) as T; }
function escapeHtml(value: string): string { return value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character] ?? character); }
function element<T extends HTMLElement>(id: string): T { const node = document.getElementById(id); if (!node) throw new Error(`Missing LPC main element: ${id}`); return node as T; }

store.subscribe(renderHud);

document.getElementById('start-weekend')?.addEventListener('click', beginSetup);
ui.continueButton.addEventListener('click', () => closeOverlay(ui.setup));
document.getElementById('reset-save')?.addEventListener('click', () => { store.reset(); window.localStorage.removeItem(SAVE_KEY); window.location.reload(); });
document.querySelectorAll<HTMLInputElement>('[data-cart]').forEach((input) => input.addEventListener('input', updateSetupTotal));
document.getElementById('dialog-close')?.addEventListener('click', () => closeOverlay(ui.dialog));
document.getElementById('encounter-close')?.addEventListener('click', closeEncounter);
ui.activityButton.addEventListener('click', resolveActivity);
document.getElementById('activity-close')?.addEventListener('click', closeActivity);
document.querySelectorAll<HTMLButtonElement>('[data-animation]').forEach((button) => button.addEventListener('click', () => window.dispatchEvent(new CustomEvent('lpc-main-animation', { detail: button.dataset.animation }))));
document.getElementById('quick-rest')?.addEventListener('click', () => { store.rest(60); gameScene?.playPlayerAnimation('sit'); toast('Eine Stunde Pause eingelegt.'); });
document.getElementById('quick-toilet')?.addEventListener('click', () => { store.relieve(); gameScene?.playPlayerAnimation('cheer'); toast('Toilettenstopp erledigt.'); });
document.getElementById('mobile-action')?.addEventListener('click', () => window.dispatchEvent(new Event('lpc-main-action')));
document.querySelectorAll<HTMLButtonElement>('[data-direction]').forEach((button) => {
  const send = (active: boolean): void => window.dispatchEvent(new CustomEvent('lpc-main-direction', { detail: { direction: button.dataset.direction, active } }));
  button.addEventListener('pointerdown', (event) => { event.preventDefault(); button.setPointerCapture(event.pointerId); send(true); });
  button.addEventListener('pointerup', () => send(false));
  button.addEventListener('pointercancel', () => send(false));
  button.addEventListener('pointerleave', () => send(false));
});

if (snapshot.profile && snapshot.prologue.shoppingComplete) {
  ui.continueButton.hidden = false;
  ui.continueButton.textContent = `Spielstand fortsetzen · Tag ${snapshot.day}`;
} else ui.continueButton.hidden = true;
updateSetupTotal();

new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'lpc-main-game',
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: '#17392f',
  pixelArt: true,
  antialias: false,
  roundPixels: true,
  physics: { default: 'arcade', arcade: { gravity: { x: 0, y: 0 }, debug: false } },
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH, width: GAME_WIDTH, height: GAME_HEIGHT },
  scene: [LpcMainScene],
});

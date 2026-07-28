import Phaser from 'phaser';
import {
  ARRIVAL_CAR_POSITION,
  NPC_PLACEMENTS,
  OBJECT_PLACEMENTS,
  TAUCHER_CAR_POSITION,
  TAUCHER_PITCH_BOUNDS,
} from '../aerialCampgroundPlan';
import { ARRIVAL_POSITIONS } from '../arrivalQuest';
import { TAUCHER_TENT } from '../arrivalLayout';
import { BLUEPRINT_NODES } from '../campgroundBlueprint';
import { RELATIONSHIP_CHARACTERS } from '../content';
import { gameStore } from '../state/GameStore';
import type { GameSnapshot } from '../types';
import { WORLD_ACTIVITY_CATALOG } from '../worldActivityCatalog';
import type { RegionId } from '../worldV2';
import { worldDepth } from '../worldRealism';
import { QuestReliabilityWorldScene } from './QuestReliabilityWorldScene';

interface WorldInteraction {
  id: string;
  regionId: RegionId;
  x: number;
  y: number;
  radius: number;
  prompt: string;
  action: () => void;
}

interface ToggleObstacle {
  zone: Phaser.GameObjects.Zone;
  body: Phaser.Physics.Arcade.StaticBody;
}

interface WorldInternals {
  player?: Phaser.Physics.Arcade.Sprite;
  interactions?: WorldInteraction[];
  showMessage?: (text: string) => void;
  gate?: Phaser.GameObjects.Container;
  gateZone?: Phaser.GameObjects.Zone;
  gateCollider?: Phaser.Physics.Arcade.Collider;
  patrolGundula?: Phaser.Physics.Arcade.Sprite;
  patrolUli?: Phaser.Physics.Arcade.Sprite;
  patrolLabel?: Phaser.GameObjects.Text;
  lunchLabel?: Phaser.GameObjects.Text;
  initialCar?: Phaser.GameObjects.Container;
  pitchCar?: Phaser.GameObjects.Container;
  taucherTent?: Phaser.GameObjects.Container;
  initialCarObstacle?: ToggleObstacle;
  pitchCarObstacle?: ToggleObstacle;
  tentObstacle?: ToggleObstacle;
}

type AuthorityVisual = Phaser.GameObjects.Sprite | Phaser.GameObjects.Text | Phaser.GameObjects.Ellipse;

export class SocialInteractionWorldScene extends QuestReliabilityWorldScene {
  private socialState!: GameSnapshot;
  private socialUnsubscribe?: () => void;
  private originalNpcActions = new Map<string, () => void>();
  private staticAuthorityVisuals: AuthorityVisual[] = [];

  create(): void {
    super.create();
    this.socialState = gameStore.snapshot();
    this.captureStaticAuthorityVisuals();
    this.installAerialRuntimeAnchors();
    this.syncAllNpcInteractions();
    this.socialUnsubscribe = gameStore.subscribe((snapshot) => {
      this.socialState = snapshot;
      this.syncAllNpcInteractions();
      this.pinAuthorityAtReception();
    });
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.socialUnsubscribe?.());
  }

  update(time: number): void {
    super.update(time);
    this.pinAuthorityAtReception();
    this.syncNpcInteraction('gundula');
    this.syncNpcInteraction('uli');
  }

  private installAerialRuntimeAnchors(): void {
    this.alignArrivalVisuals();
    this.rebuildEntranceGate();
    for (const activity of WORLD_ACTIVITY_CATALOG) {
      this.moveActivity(activity.id, activity.x, activity.y, activity.regionId, activity.label);
    }
    this.pinAuthorityAtReception();
  }

  private alignArrivalVisuals(): void {
    const internals = this as unknown as WorldInternals;
    internals.initialCar?.setPosition(ARRIVAL_CAR_POSITION.x, ARRIVAL_CAR_POSITION.y);
    internals.pitchCar?.setPosition(TAUCHER_CAR_POSITION.x, TAUCHER_CAR_POSITION.y);

    const homeTent = OBJECT_PLACEMENTS['home-tent'];
    Object.assign(TAUCHER_TENT, {
      x: homeTent.x,
      y: homeTent.y,
      width: homeTent.width ?? 145,
      height: homeTent.height ?? 120,
    });
    internals.taucherTent?.setPosition(TAUCHER_TENT.x, TAUCHER_TENT.y);

    moveStaticObstacle(internals.initialCarObstacle, ARRIVAL_CAR_POSITION.x, ARRIVAL_CAR_POSITION.y);
    moveStaticObstacle(internals.pitchCarObstacle, TAUCHER_CAR_POSITION.x, TAUCHER_CAR_POSITION.y);
    moveStaticObstacle(internals.tentObstacle, TAUCHER_TENT.x + (TAUCHER_TENT.width ?? 145) / 2, TAUCHER_TENT.y + (TAUCHER_TENT.height ?? 120) * 0.78);

    const oldPitchLabel = this.children.list.find((child): child is Phaser.GameObjects.Text => (
      child instanceof Phaser.GameObjects.Text && child.text === 'TAUCHERPLATZ · T-7'
    ));
    if (oldPitchLabel) {
      const labelIndex = this.children.list.indexOf(oldPitchLabel);
      const oldBoundary = this.children.list[labelIndex - 1];
      if (oldBoundary instanceof Phaser.GameObjects.Graphics) oldBoundary.destroy();
      oldPitchLabel.destroy();
    }

    const boundary = this.add.graphics().setDepth(worldDepth(TAUCHER_PITCH_BOUNDS.y + TAUCHER_PITCH_BOUNDS.height) - 1);
    boundary.fillStyle(0x8fb56d, 0.08)
      .fillRoundedRect(TAUCHER_PITCH_BOUNDS.x, TAUCHER_PITCH_BOUNDS.y, TAUCHER_PITCH_BOUNDS.width, TAUCHER_PITCH_BOUNDS.height, 24)
      .lineStyle(4, 0xf4d47b, 0.38)
      .strokeRoundedRect(TAUCHER_PITCH_BOUNDS.x, TAUCHER_PITCH_BOUNDS.y, TAUCHER_PITCH_BOUNDS.width, TAUCHER_PITCH_BOUNDS.height, 24);
    this.add.text(TAUCHER_PITCH_BOUNDS.x + 18, TAUCHER_PITCH_BOUNDS.y + 14, 'TAUCHERPLATZ · ZELTKREIS', {
      fontFamily: 'Arial Black, system-ui', fontSize: '12px', color: '#fff0ba', stroke: '#173027', strokeThickness: 4,
    }).setDepth(worldDepth(TAUCHER_PITCH_BOUNDS.y + 24));
  }

  private rebuildEntranceGate(): void {
    const internals = this as unknown as WorldInternals;
    internals.gateCollider?.destroy();
    internals.gateZone?.destroy();
    internals.gate?.destroy(true);

    const gate = BLUEPRINT_NODES.gate;
    const left = gate.x - 55;
    const right = gate.x + 55;
    const parts: Phaser.GameObjects.GameObject[] = [
      this.add.rectangle(left, gate.y, 34, 58, 0xd4ba76).setStrokeStyle(3, 0x59472f, 0.8),
      this.add.rectangle(right, gate.y, 34, 58, 0xd4ba76).setStrokeStyle(3, 0x59472f, 0.8),
      this.add.circle(left, gate.y - 36, 8, 0xffdf82).setStrokeStyle(3, 0xfff3bd, 0.65),
      this.add.circle(right, gate.y - 36, 8, 0xffdf82).setStrokeStyle(3, 0xfff3bd, 0.65),
    ];
    const barrier = this.add.rectangle(gate.x, gate.y, 112, 16, 0xd9584e).setStrokeStyle(2, 0x6f2827, 0.72);
    const stripeA = this.add.rectangle(gate.x - 25, gate.y, 20, 16, 0xffffff, 0.92).setAngle(-18);
    const stripeB = this.add.rectangle(gate.x + 25, gate.y, 20, 16, 0xffffff, 0.92).setAngle(-18);
    const hinge = this.add.circle(left + 4, gate.y, 9, 0x27312e).setStrokeStyle(2, 0xe6cf90, 0.7);
    parts.push(barrier, stripeA, stripeB, hinge);
    internals.gate = this.add.container(0, 0, parts).setDepth(worldDepth(gate.y + 30));

    if (this.socialState.flags.gateOpen) {
      barrier.setAngle(-78).setPosition(left + 10, gate.y - 42);
      stripeA.setVisible(false);
      stripeB.setVisible(false);
      return;
    }

    const player = internals.player;
    if (!player) return;
    const zone = this.add.zone(gate.x, gate.y, 150, 42);
    this.physics.add.existing(zone, true);
    internals.gateZone = zone;
    internals.gateCollider = this.physics.add.collider(player, zone);
  }

  private moveActivity(id: string, x: number, y: number, regionId: RegionId, label: string): void {
    const internals = this as unknown as WorldInternals;
    const point = internals.interactions?.find((entry) => entry.id === id);
    if (point) Object.assign(point, { x, y, regionId });

    const text = this.children.list.find((child): child is Phaser.GameObjects.Text => child instanceof Phaser.GameObjects.Text && child.text === label);
    if (!text) return;
    const old = { x: text.x, y: text.y };
    text.setPosition(x, y + 29).setDepth(worldDepth(y + 35));
    const marker = this.children.list.find((child): child is Phaser.GameObjects.Image => (
      child instanceof Phaser.GameObjects.Image
      && child.texture.key === 'activity-marker'
      && Phaser.Math.Distance.Between(child.x, child.y, old.x, old.y - 29) < 45
    ));
    marker?.setPosition(x, y).setDepth(worldDepth(y + 24));
  }

  private captureStaticAuthorityVisuals(): void {
    this.staticAuthorityVisuals = this.children.list.filter((child): child is AuthorityVisual => {
      if (child instanceof Phaser.GameObjects.Sprite) {
        if (!['npc-gundula', 'npc-uli'].includes(child.texture.key)) return false;
        return distanceToAuthorityPoint(child.x, child.y) < 70;
      }
      if (child instanceof Phaser.GameObjects.Text) return ['Gundula', 'Uli'].includes(child.text);
      if (child instanceof Phaser.GameObjects.Ellipse) return distanceToAuthorityPoint(child.x, child.y) < 70;
      return false;
    });
  }

  private pinAuthorityAtReception(): void {
    const internals = this as unknown as WorldInternals;
    internals.patrolGundula?.setVisible(false).setActive(false);
    internals.patrolUli?.setVisible(false).setActive(false);
    internals.patrolLabel?.setVisible(false);
    internals.lunchLabel?.setVisible(false);
    for (const visual of this.staticAuthorityVisuals) visual.setVisible(true);

    const interactions = internals.interactions;
    if (!interactions) return;
    for (const id of ['gundula', 'uli']) {
      const position = NPC_PLACEMENTS[id];
      for (const point of interactions) {
        if (characterIdFromInteraction(point.id) !== id) continue;
        point.x = position.x;
        point.y = position.y;
        point.regionId = 'arrival';
      }
    }
  }

  private syncAllNpcInteractions(): void {
    const interactions = (this as unknown as WorldInternals).interactions;
    if (!interactions) return;
    for (const point of interactions) {
      const characterId = characterIdFromInteraction(point.id);
      if (!characterId) continue;
      this.syncPoint(point, characterId);
    }
  }

  private syncNpcInteraction(characterId: string): void {
    const interactions = (this as unknown as WorldInternals).interactions;
    if (!interactions) return;
    for (const point of interactions) {
      if (characterIdFromInteraction(point.id) === characterId) this.syncPoint(point, characterId);
    }
  }

  private syncPoint(point: WorldInteraction, characterId: string): void {
    if (!this.originalNpcActions.has(point.id)) this.originalNpcActions.set(point.id, point.action);
    if (!this.canOpenFullConversation(characterId)) {
      const original = this.originalNpcActions.get(point.id);
      if (original) point.action = original;
      return;
    }

    const character = RELATIONSHIP_CHARACTERS.find((entry) => entry.id === characterId);
    if (!character) return;
    point.prompt = `Mit ${character.name} sprechen · Themen${isRomanceCharacter(characterId) ? ' / Flirt' : ''}`;
    point.action = () => this.openConversation(characterId);
  }

  private canOpenFullConversation(characterId: string): boolean {
    if (!RELATIONSHIP_CHARACTERS.some((entry) => entry.id === characterId)) return false;
    if (characterId === 'gundula' || characterId === 'uli') return this.authorityStoryComplete(characterId);
    if (characterId === 'manni') return this.socialState.quests.paper?.status === 'completed';
    if (characterId === 'ronny') return Boolean(this.socialState.flags.firstBattleWon);
    return true;
  }

  private authorityStoryComplete(characterId: string): boolean {
    if (characterId === 'gundula') return Boolean(this.socialState.flags.gundulaConvinced);
    return Boolean(this.socialState.flags.uliInspectionPassed || this.socialState.flags.uliConvinced);
  }

  private openConversation(characterId: string): void {
    const player = (this as unknown as WorldInternals).player;
    const npc = NPC_PLACEMENTS[characterId];
    if (player) {
      const dx = player.x - (npc?.x ?? player.x - 1);
      const dy = player.y - (npc?.y ?? player.y);
      const length = Math.hypot(dx, dy) || 1;
      gameStore.setWorldPosition(player.x + dx / length * 48, player.y + dy / length * 48);
    }
    gameStore.socialize(characterId);
    this.scene.start('social', { characterId });
  }
}

function moveStaticObstacle(obstacle: ToggleObstacle | undefined, x: number, y: number): void {
  if (!obstacle) return;
  obstacle.zone.setPosition(x, y);
  obstacle.body.updateFromGameObject();
}

function characterIdFromInteraction(interactionId: string): string | null {
  if (!interactionId.startsWith('npc-')) return null;
  const raw = interactionId.slice(4);
  return raw.endsWith('-story') ? raw.slice(0, -6) : raw;
}

function isRomanceCharacter(characterId: string): boolean {
  return characterId === 'susi' || characterId === 'jule' || characterId === 'kira';
}

function distanceToAuthorityPoint(x: number, y: number): number {
  return Math.min(
    Phaser.Math.Distance.Between(x, y, ARRIVAL_POSITIONS.gundula.x, ARRIVAL_POSITIONS.gundula.y),
    Phaser.Math.Distance.Between(x, y, ARRIVAL_POSITIONS.uli.x, ARRIVAL_POSITIONS.uli.y),
  );
}

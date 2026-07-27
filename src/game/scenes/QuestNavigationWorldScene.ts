import Phaser from 'phaser';
import {
  TRACKED_QUEST_CHANGED_EVENT,
  questDistanceMetres,
  questTrackingTarget,
  type QuestTrackingTarget,
} from '../questTracking';
import { gameStore } from '../state/GameStore';
import type { GameSnapshot } from '../types';
import { worldDepth } from '../worldRealism';
import { InteractionAuditWorldScene } from './InteractionAuditWorldScene';

interface WorldRuntimeInternals {
  player?: Phaser.Physics.Arcade.Sprite;
}

export class QuestNavigationWorldScene extends InteractionAuditWorldScene {
  private navigationState!: GameSnapshot;
  private navigationTarget: QuestTrackingTarget | null = null;
  private navigationBeacon?: Phaser.GameObjects.Container;
  private navigationBeaconLabel?: Phaser.GameObjects.Text;
  private edgeCompass?: Phaser.GameObjects.Container;
  private edgeArrow?: Phaser.GameObjects.Triangle;
  private edgeTitle?: Phaser.GameObjects.Text;
  private edgeDistance?: Phaser.GameObjects.Text;
  private navigationUnsubscribe?: () => void;

  private readonly onTrackedQuestChanged = (): void => this.syncNavigationTarget(true);

  create(): void {
    super.create();
    this.navigationState = gameStore.snapshot();
    this.createNavigationVisuals();
    this.syncNavigationTarget(true);
    this.navigationUnsubscribe = gameStore.subscribe((snapshot) => {
      this.navigationState = snapshot;
      this.syncNavigationTarget();
    });
    window.addEventListener(TRACKED_QUEST_CHANGED_EVENT, this.onTrackedQuestChanged);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.shutdownQuestNavigation());
  }

  update(time: number): void {
    super.update(time);
    this.updateQuestNavigation(time);
  }

  private createNavigationVisuals(): void {
    const ring = this.add.circle(0, 0, 30, 0xf4c75d, 0.12).setStrokeStyle(4, 0xffe691, 0.95);
    const inner = this.add.circle(0, 0, 13, 0xf4c75d, 0.8).setStrokeStyle(3, 0xfff4c4, 0.95);
    const pin = this.add.triangle(0, 31, 0, -15, -10, 8, 10, 8, 0xf4c75d, 0.95);
    const icon = this.add.text(0, -1, '!', {
      fontFamily: 'Arial Black, system-ui', fontSize: '15px', color: '#173027',
    }).setOrigin(0.5);
    this.navigationBeaconLabel = this.add.text(0, 50, '', {
      fontFamily: 'Arial Black, system-ui', fontSize: '11px', color: '#fff3c1',
      backgroundColor: '#173027e8', padding: { x: 8, y: 5 }, stroke: '#173027', strokeThickness: 2,
    }).setOrigin(0.5, 0);
    this.navigationBeacon = this.add.container(0, 0, [ring, pin, inner, icon, this.navigationBeaconLabel]).setVisible(false);
    this.tweens.add({ targets: ring, scale: { from: 0.85, to: 1.35 }, alpha: { from: 0.36, to: 0.03 }, duration: 1150, repeat: -1 });
    this.tweens.add({ targets: inner, y: { from: -3, to: 3 }, duration: 850, yoyo: true, repeat: -1, ease: 'Sine.InOut' });

    const panel = this.add.rectangle(0, 0, 226, 58, 0x10251f, 0.92).setStrokeStyle(3, 0xf4d47b, 0.9);
    this.edgeArrow = this.add.triangle(-91, 0, 0, -14, 12, 12, -12, 12, 0xf4d47b, 1);
    this.edgeTitle = this.add.text(-67, -15, '', {
      fontFamily: 'Arial Black, system-ui', fontSize: '11px', color: '#fff2bf',
    }).setOrigin(0, 0);
    this.edgeDistance = this.add.text(-67, 6, '', {
      fontFamily: 'system-ui', fontSize: '11px', color: '#bce4d4',
    }).setOrigin(0, 0);
    this.edgeCompass = this.add.container(480, 320, [panel, this.edgeArrow, this.edgeTitle, this.edgeDistance])
      .setDepth(880).setScrollFactor(0).setVisible(false);
  }

  private syncNavigationTarget(force = false): void {
    const next = questTrackingTarget(this.navigationState);
    const signature = next ? `${next.questId}:${next.x}:${next.y}:${next.objective}` : '';
    const current = this.navigationTarget ? `${this.navigationTarget.questId}:${this.navigationTarget.x}:${this.navigationTarget.y}:${this.navigationTarget.objective}` : '';
    if (!force && signature === current) return;
    this.navigationTarget = next;

    if (!next) {
      this.navigationBeacon?.setVisible(false);
      this.edgeCompass?.setVisible(false);
      return;
    }

    this.navigationBeacon?.setPosition(next.x, next.y - 42).setDepth(worldDepth(next.y + 75) + 2).setVisible(true);
    this.navigationBeaconLabel?.setText(`${next.title.toUpperCase()}\n${next.targetLabel}`);
    this.edgeTitle?.setText(next.targetLabel.toUpperCase());
  }

  private updateQuestNavigation(time: number): void {
    const target = this.navigationTarget;
    const player = (this as unknown as WorldRuntimeInternals).player;
    if (!target || !player || !this.navigationBeacon || !this.edgeCompass || !this.edgeArrow || !this.edgeDistance) return;

    const distance = questDistanceMetres(player, target);
    const camera = this.cameras.main;
    const visible = camera.worldView.contains(target.x, target.y);
    this.edgeCompass.setVisible(!visible && distance > 8);
    this.navigationBeacon.setVisible(distance > 4);
    this.navigationBeacon.setScale(1 + Math.sin(time * 0.004) * 0.03);
    if (visible || distance <= 8) return;

    const center = camera.getWorldPoint(480, 320);
    const dx = target.x - center.x;
    const dy = target.y - center.y;
    const angle = Math.atan2(dy, dx);
    const halfWidth = 365;
    const halfHeight = 205;
    const scale = Math.min(
      halfWidth / Math.max(1, Math.abs(Math.cos(angle))),
      halfHeight / Math.max(1, Math.abs(Math.sin(angle))),
    );
    const screenX = 480 + Math.cos(angle) * scale;
    const screenY = 320 + Math.sin(angle) * scale;
    this.edgeCompass.setPosition(screenX, screenY);
    this.edgeArrow.setRotation(angle + Math.PI / 2);
    this.edgeDistance.setText(`${distance} m · ${target.title}`);
  }

  private shutdownQuestNavigation(): void {
    window.removeEventListener(TRACKED_QUEST_CHANGED_EVENT, this.onTrackedQuestChanged);
    this.navigationUnsubscribe?.();
  }
}

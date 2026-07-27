import Phaser from 'phaser';
import { applyCampgroundPlanLayout } from '../campgroundPlan';
import { drawCampgroundPlanLayer } from '../campgroundPlanLayer';
import { currentVisualProfile } from '../visuals';
import { applyRealisticWorldLayout, worldDepth } from '../worldRealism';
import { WORLD_REGIONS } from '../worldV2';
import { ExpandedWorldScene } from './ExpandedWorldScene';

interface RegionLockInternals {
  overlay: Phaser.GameObjects.Rectangle;
  border: Phaser.GameObjects.Rectangle;
  label: Phaser.GameObjects.Text;
}

interface SceneInternals {
  player?: Phaser.Physics.Arcade.Sprite;
  shadow?: Phaser.GameObjects.Ellipse;
  gate?: Phaser.GameObjects.Container;
  locks?: Map<string, RegionLockInternals>;
  directions?: Set<string>;
}

export class RealisticWorldScene extends ExpandedWorldScene {
  create(): void {
    applyRealisticWorldLayout();
    applyCampgroundPlanLayout();
    super.create();
    drawCampgroundPlanLayer(this, currentVisualProfile());
    this.hideLegacyRegionLabels();
    this.normalizeStaticDepths();
    this.refreshPlayerDepth();
  }

  update(time: number): void {
    super.update(time);
    this.refreshPlayerDepth();
  }

  public recoverWorldControl(): void {
    const internals = this as unknown as SceneInternals;
    internals.directions?.clear();
    this.input.enabled = true;
    this.input.keyboard?.resetKeys();
    this.physics.world.resume();
    this.scene.resume();
    this.game.loop.wake();

    const player = internals.player;
    if (!player) return;
    player.setVelocity(0, 0).setAcceleration(0, 0);
    const body = player.body as Phaser.Physics.Arcade.Body | null;
    if (body) {
      body.enable = true;
      body.reset(player.x, player.y);
    }
  }

  private refreshPlayerDepth(): void {
    const internals = this as unknown as SceneInternals;
    const player = internals.player;
    if (!player) return;
    const depth = worldDepth(player.y + 30);
    player.setDepth(depth);
    internals.shadow?.setDepth(depth - 0.25);
  }

  private hideLegacyRegionLabels(): void {
    const legacyTitles = new Set(WORLD_REGIONS.map((region) => region.title.toUpperCase()));
    for (const child of this.children.list) {
      if (child instanceof Phaser.GameObjects.Text && legacyTitles.has(child.text)) child.setVisible(false);
    }
  }

  private normalizeStaticDepths(): void {
    const internals = this as unknown as SceneInternals;
    internals.gate?.setDepth(worldDepth(1300));
    internals.locks?.forEach((lock) => {
      lock.overlay.setDepth(76);
      lock.border.setDepth(77);
      lock.label.setDepth(78);
    });

    for (const child of this.children.list) {
      if (child instanceof Phaser.GameObjects.Sprite) {
        const textureKey = child.texture.key;
        if (textureKey.startsWith('npc-')) child.setDepth(worldDepth(child.y + 28));
        continue;
      }

      if (child instanceof Phaser.GameObjects.Image) {
        const textureKey = child.texture.key;
        if (textureKey === 'door-marker' || textureKey === 'activity-marker') {
          child.setDepth(worldDepth(child.y + 24));
        }
        continue;
      }

      if (child instanceof Phaser.GameObjects.Ellipse) {
        if (child.fillColor === 0x07120f && child !== internals.shadow) {
          child.setDepth(worldDepth(child.y) - 0.3);
        }
        continue;
      }

      if (child instanceof Phaser.GameObjects.Text) {
        if (child.scrollFactorX === 0 || child.text.startsWith('GESPERRT')) continue;
        if (child.depth < 70) child.setDepth(worldDepth(child.y + 48) + 0.2);
      }
    }
  }
}

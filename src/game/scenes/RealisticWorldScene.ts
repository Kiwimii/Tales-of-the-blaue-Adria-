import Phaser from 'phaser';
import { worldDepth } from '../worldRealism';
import { EXPANDED_NPCS, EXPANDED_WORLD_HEIGHT, EXPANDED_WORLD_WIDTH, WORLD_REGIONS } from '../worldV2';
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
    super.create();
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

    this.scene.setVisible(true);
    if (this.scene.isPaused()) this.scene.resume();
    this.input.enabled = true;
    this.input.keyboard?.resetKeys();
    this.physics.world.resume();
    this.game.input.enabled = true;
    this.game.loop.wake();

    const player = internals.player;
    if (!player) return;

    const safePoint = recoveryPointOutsideNpcCluster(player.x, player.y);
    player.setActive(true).setVisible(true).setVelocity(0, 0).setAcceleration(0, 0).setPosition(safePoint.x, safePoint.y);
    const body = player.body as Phaser.Physics.Arcade.Body | null;
    if (body) {
      body.enable = true;
      body.moves = true;
      body.stop();
      body.reset(safePoint.x, safePoint.y);
    }
    internals.shadow?.setPosition(safePoint.x + 2, safePoint.y + 25);
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
    internals.gate?.setDepth(worldDepth(650));
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

export function recoveryPointOutsideNpcCluster(x: number, y: number): { x: number; y: number } {
  const nearby = EXPANDED_NPCS.filter((npc) => Phaser.Math.Distance.Between(x, y, npc.x, npc.y) < 96);
  if (!nearby.length) return { x, y };

  const center = nearby.reduce((sum, npc) => ({ x: sum.x + npc.x, y: sum.y + npc.y }), { x: 0, y: 0 });
  center.x /= nearby.length;
  center.y /= nearby.length;
  let dx = x - center.x;
  let dy = y - center.y;
  const length = Math.hypot(dx, dy);
  if (length < 4) {
    dx = -1;
    dy = 0.45;
  } else {
    dx /= length;
    dy /= length;
  }

  return {
    x: Phaser.Math.Clamp(center.x + dx * 118, 45, EXPANDED_WORLD_WIDTH - 45),
    y: Phaser.Math.Clamp(center.y + dy * 118, 45, EXPANDED_WORLD_HEIGHT - 45),
  };
}

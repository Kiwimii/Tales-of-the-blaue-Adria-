import Phaser from 'phaser';
import {
  NINJA_ADVENTURE_ASSET,
  PIXEL_ART_CROPS,
  PIXEL_ART_PLACEMENTS,
  type PixelArtCropId,
} from '../pixelArtLayer';
import { worldDepth } from '../worldRealism';
import { QuestNavigationWorldScene } from './QuestNavigationWorldScene';

const FRAME_PREFIX = 'adria-cc0-';

/**
 * Adds a restrained CC0 pixel-art environment layer to the existing world.
 * The procedural world remains the source of truth for layout, collisions,
 * bespoke characters, tents, quests and interaction anchors.
 */
export class PixelArtWorldScene extends QuestNavigationWorldScene {
  preload(): void {
    if (this.textures.exists(NINJA_ADVENTURE_ASSET.textureKey)) return;
    this.load.setCORS('anonymous');
    this.load.image(NINJA_ADVENTURE_ASSET.textureKey, NINJA_ADVENTURE_ASSET.sourceUrl);
  }

  create(): void {
    super.create();
    if (!this.textures.exists(NINJA_ADVENTURE_ASSET.textureKey)) return;

    const texture = this.textures.get(NINJA_ADVENTURE_ASSET.textureKey);
    texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
    this.registerFrames(texture);
    this.installEnvironmentLayer();
  }

  private registerFrames(texture: Phaser.Textures.Texture): void {
    for (const [cropId, crop] of Object.entries(PIXEL_ART_CROPS) as [PixelArtCropId, (typeof PIXEL_ART_CROPS)[PixelArtCropId]][]) {
      const frameName = `${FRAME_PREFIX}${cropId}`;
      if (!texture.has(frameName)) texture.add(frameName, 0, crop.x, crop.y, crop.width, crop.height);
    }
  }

  private installEnvironmentLayer(): void {
    for (const placement of PIXEL_ART_PLACEMENTS) {
      this.add.image(
        placement.x,
        placement.y,
        NINJA_ADVENTURE_ASSET.textureKey,
        `${FRAME_PREFIX}${placement.crop}`,
      )
        .setName(`cc0-${placement.id}`)
        .setOrigin(0.5, 1)
        .setScale(placement.scale)
        .setAlpha(placement.alpha ?? 1)
        .setFlipX(placement.flipX ?? false)
        .setDepth(worldDepth(placement.y) - 0.35)
        .setDataEnabled()
        .setData({
          assetPack: 'Ninja Adventure',
          license: NINJA_ADVENTURE_ASSET.license,
          decorativeOnly: true,
        });
    }
  }
}

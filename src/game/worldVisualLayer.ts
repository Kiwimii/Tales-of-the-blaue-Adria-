import type Phaser from 'phaser';
import { applyCampgroundBlueprint } from './campgroundBlueprint';
import { addAerialBoundaryObstacles, drawCampgroundBlueprintLayer } from './campgroundBlueprintLayer';
import type { VisualProfile } from './visuals';
import { applyRealisticWorldLayout } from './worldRealism';
import {
  buildExpandedWorldVisuals as buildLegacyWorldObjects,
  type WorldVisualBuild,
} from './worldVisualLayerRealistic';

export type { WorldVisualBuild };

export function buildExpandedWorldVisuals(scene: Phaser.Scene, profile: VisualProfile): WorldVisualBuild {
  applyRealisticWorldLayout();
  applyCampgroundBlueprint();
  const visual = buildLegacyWorldObjects(scene, profile);
  addAerialBoundaryObstacles(scene, visual.obstacles);
  drawCampgroundBlueprintLayer(scene, profile);
  return visual;
}

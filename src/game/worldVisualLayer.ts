import type Phaser from 'phaser';
import { applyCampgroundBlueprint } from './campgroundBlueprint';
import { addAerialBoundaryObstacles, drawCampgroundBlueprintLayer } from './campgroundBlueprintLayer';
import { drawCanonicalCampgroundDetails } from './campgroundDetailLayer';
import { drawVisibleCampgroundFeatures } from './campgroundFeatureLayer';
import { drawInteractionAccessPaths } from './interactionAccessPlan';
import type { VisualProfile } from './visuals';
import { applyRealisticWorldLayout } from './worldRealism';
import { WORLD_REGIONS } from './worldV2';
import {
  buildExpandedWorldVisuals as buildLegacyWorldObjects,
  type WorldVisualBuild,
} from './worldVisualLayerRealistic';

export type { WorldVisualBuild };

export function buildExpandedWorldVisuals(scene: Phaser.Scene, profile: VisualProfile): WorldVisualBuild {
  applyRealisticWorldLayout();
  applyCampgroundBlueprint();
  const visual = buildLegacyWorldObjects(scene, profile);
  removeLegacyRegionHeadings(scene);
  addAerialBoundaryObstacles(scene, visual.obstacles);
  drawCampgroundBlueprintLayer(scene, profile);
  drawInteractionAccessPaths(scene);
  drawCanonicalCampgroundDetails(scene, profile);
  drawVisibleCampgroundFeatures(scene, profile);
  return visual;
}

function removeLegacyRegionHeadings(scene: Phaser.Scene): void {
  const duplicateTitles = new Set(WORLD_REGIONS.map((region) => region.title.toUpperCase()));
  for (const child of [...scene.children.list]) {
    const candidate = child as Phaser.GameObjects.Text;
    if (candidate.type === 'Text' && duplicateTitles.has(candidate.text)) candidate.destroy();
  }
}

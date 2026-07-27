import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { CAMPGROUND_FEATURE_CLUSTERS, expectedVisibleFeatureCount } from '../src/game/campgroundFeaturePlan';
import { EXPANDED_WORLD_OBJECTS } from '../src/game/worldV2';

const root = resolve(process.cwd());
const objectLayer = readFileSync(resolve(root, 'src/game/objectDetailLayer.ts'), 'utf8');
const materialLayer = readFileSync(resolve(root, 'src/game/campgroundMaterialLayer.ts'), 'utf8');
const characterLayer = readFileSync(resolve(root, 'src/game/scenes/BootScene.ts'), 'utf8');
const featureLayer = readFileSync(resolve(root, 'src/game/campgroundFeatureLayer.ts'), 'utf8');

describe('structural graphics depth', () => {
  it('gives every major world object kind a dedicated detail renderer', () => {
    const kinds = [...new Set(EXPANDED_WORLD_OBJECTS.map((object) => object.kind))];
    for (const kind of kinds) expect(objectLayer, kind).toContain(`case '${kind}'`);
  });

  it('uses visibly different texture logic for asphalt, gravel and sand', () => {
    expect(materialLayer).toContain("road.surface === 'asphalt'");
    expect(materialLayer).toContain("road.surface === 'gravel'");
    expect(materialLayer).toContain('drawSandMark');
    expect(materialLayer).toContain('drawAsphaltMark');
    expect(materialLayer).toContain('drawGravelMark');
  });

  it('keeps a substantial core detail set even in the mobile profile', () => {
    expect(CAMPGROUND_FEATURE_CLUSTERS.length).toBeGreaterThanOrEqual(7);
    expect(expectedVisibleFeatureCount('balanced')).toBeGreaterThanOrEqual(100);
    expect(expectedVisibleFeatureCount('cinematic')).toBeGreaterThan(expectedVisibleFeatureCount('balanced'));
  });

  it('adds real anatomy, individual props, tree branches and leaf shapes', () => {
    for (const token of ['skinShade', 'bodyWidth', 'drawIdentityProp', "identity === 'gundula'", "identity === 'lars'"]) {
      expect(characterLayer).toContain(token);
    }
    expect(objectLayer).toContain('branchCount');
    expect(objectLayer).toContain('leafCount');
    expect(objectLayer).toContain('scene.add.ellipse');
  });

  it('contains large recognisable feature groups instead of ambient speckles only', () => {
    for (const renderer of [
      'drawArrivalIdentity', 'drawNorthCampingLife', 'drawTaucherBasecamp', 'drawFestivalIdentity',
      'drawBeachLife', 'drawServiceYard', 'drawCoveRetreat',
    ]) expect(featureLayer).toContain(renderer);
  });
});

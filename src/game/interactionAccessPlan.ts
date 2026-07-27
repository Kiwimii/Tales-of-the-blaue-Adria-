import Phaser from 'phaser';
import type { PlanPoint } from './aerialCampgroundPlan';

export interface InteractionAccessPath {
  id: string;
  from: PlanPoint;
  to: PlanPoint;
  width: number;
  surface: 'gravel' | 'sand';
}

export const INTERACTION_ACCESS_PATHS: readonly InteractionAccessPath[] = [
  {
    id: 'tent-front-walk',
    from: { x: 150, y: 1160 },
    to: { x: 820, y: 1160 },
    width: 42,
    surface: 'gravel',
  },
] as const;

export function drawInteractionAccessPaths(scene: Phaser.Scene): void {
  const paths = scene.add.graphics().setDepth(4.49);
  const markings = scene.add.graphics().setDepth(4.55);
  for (const path of INTERACTION_ACCESS_PATHS) {
    const edge = path.surface === 'sand' ? 0xb49a63 : 0x786746;
    const fill = path.surface === 'sand' ? 0xd8c487 : 0xb5a275;
    const mark = path.surface === 'sand' ? 0xf3e2b2 : 0xead8a8;
    paths.lineStyle(path.width + 10, edge, 0.88).lineBetween(path.from.x, path.from.y, path.to.x, path.to.y)
      .lineStyle(path.width, fill, 0.96).lineBetween(path.from.x, path.from.y, path.to.x, path.to.y);

    const distance = Phaser.Math.Distance.Between(path.from.x, path.from.y, path.to.x, path.to.y);
    for (let step = 34; step < distance - 18; step += 52) {
      const progress = step / distance;
      markings.fillStyle(mark, 0.18).fillEllipse(
        Phaser.Math.Linear(path.from.x, path.to.x, progress),
        Phaser.Math.Linear(path.from.y, path.to.y, progress),
        9,
        5,
      );
    }
  }
}

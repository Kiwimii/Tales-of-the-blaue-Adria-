import { applyCampgroundBlueprint } from './campgroundBlueprint';

let prepared = false;

/**
 * Compatibility entry point for older callers.
 * Sprint 83 removed all post-blueprint coordinate mutations. The aerial plan is
 * now applied once and remains the only runtime source for map geometry.
 */
export function prepareCampgroundBlueprint(): void {
  if (prepared) return;
  applyCampgroundBlueprint();
  prepared = true;
}

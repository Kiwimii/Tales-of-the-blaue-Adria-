import type { RegionId } from './worldV2';

export type CampgroundFeatureId =
  | 'arrival-checkin'
  | 'north-camping-life'
  | 'taucher-basecamp'
  | 'festival-atmosphere'
  | 'beach-life'
  | 'service-yard'
  | 'cove-retreat';

export interface CampgroundFeatureCluster {
  id: CampgroundFeatureId;
  label: string;
  regionId: RegionId;
  x: number;
  y: number;
  coreElements: number;
  pcExtraElements: number;
}

/**
 * Visible, hand-authored feature clusters. These are intentionally much larger
 * and higher-contrast than ambient grass speckles. Every major area must have
 * one immediately recognisable visual identity on mobile and desktop.
 */
export const CAMPGROUND_FEATURE_CLUSTERS: readonly CampgroundFeatureCluster[] = [
  { id: 'arrival-checkin', label: 'Check-in-Hof', regionId: 'arrival', x: 1110, y: 1510, coreElements: 12, pcExtraElements: 10 },
  { id: 'north-camping-life', label: 'Dauercamper-Alltag', regionId: 'north', x: 690, y: 470, coreElements: 16, pcExtraElements: 12 },
  { id: 'taucher-basecamp', label: 'Taucher-Basislager', regionId: 'central', x: 650, y: 1160, coreElements: 24, pcExtraElements: 18 },
  { id: 'festival-atmosphere', label: 'Festwiesen-Technik', regionId: 'festival', x: 1690, y: 690, coreElements: 20, pcExtraElements: 18 },
  { id: 'beach-life', label: 'Strandleben', regionId: 'beach', x: 2110, y: 730, coreElements: 18, pcExtraElements: 14 },
  { id: 'service-yard', label: 'Servicehof-Werkzeug', regionId: 'woodland', x: 1640, y: 1470, coreElements: 18, pcExtraElements: 10 },
  { id: 'cove-retreat', label: 'Buchten-Lager', regionId: 'cove', x: 2080, y: 1530, coreElements: 14, pcExtraElements: 10 },
] as const;

export function expectedVisibleFeatureCount(tier: 'balanced' | 'cinematic'): number {
  return CAMPGROUND_FEATURE_CLUSTERS.reduce(
    (sum, cluster) => sum + cluster.coreElements + (tier === 'cinematic' ? cluster.pcExtraElements : 0),
    0,
  );
}

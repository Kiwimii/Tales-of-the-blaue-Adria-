import type Phaser from 'phaser';

export type VisualTier = 'cinematic' | 'balanced';
export type GraphicsMode = 'auto' | 'mobile' | 'pc';

export interface VisualCapabilities {
  coarsePointer: boolean;
  deviceMemory?: number;
  hardwareConcurrency?: number;
  reducedMotion: boolean;
}

export interface VisualProfile {
  tier: VisualTier;
  pixelRatio: number;
  ambientSprites: number;
  animatedWaterLines: number;
  foliageMotion: boolean;
  postFx: boolean;
  detailDensity: number;
  animatedDetails: boolean;
}

export const GRAPHICS_MODE_STORAGE_KEY = 'tales-adria-graphics-mode';

export const VISUAL_PROFILES: Record<VisualTier, Omit<VisualProfile, 'tier'>> = {
  cinematic: {
    pixelRatio: 2,
    ambientSprites: 28,
    animatedWaterLines: 14,
    foliageMotion: true,
    postFx: true,
    detailDensity: 1,
    animatedDetails: true,
  },
  balanced: {
    pixelRatio: 1.25,
    ambientSprites: 8,
    animatedWaterLines: 4,
    foliageMotion: false,
    postFx: false,
    detailDensity: 0.48,
    animatedDetails: false,
  },
};

export function selectVisualProfile(capabilities: VisualCapabilities): VisualProfile {
  const constrainedMemory = capabilities.deviceMemory !== undefined && capabilities.deviceMemory <= 4;
  const constrainedCpu = capabilities.hardwareConcurrency !== undefined && capabilities.hardwareConcurrency <= 4;
  const tier: VisualTier = capabilities.reducedMotion
    || (capabilities.coarsePointer && (constrainedMemory || constrainedCpu))
    ? 'balanced'
    : 'cinematic';
  return profileForTier(tier);
}

export function currentGraphicsMode(): GraphicsMode {
  if (typeof window === 'undefined') return 'auto';
  const stored = window.localStorage.getItem(GRAPHICS_MODE_STORAGE_KEY);
  return isGraphicsMode(stored) ? stored : 'auto';
}

export function setGraphicsMode(mode: GraphicsMode): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(GRAPHICS_MODE_STORAGE_KEY, mode);
}

export function graphicsModeLabel(mode: GraphicsMode): string {
  if (mode === 'mobile') return 'Mobil optimiert';
  if (mode === 'pc') return 'PC optimiert';
  return 'Automatisch';
}

export function graphicsModeDescription(mode: GraphicsMode): string {
  if (mode === 'mobile') return 'Reduzierte Partikel, Animationen und Detaildichte für stabile Touch-Steuerung und weniger Akkuverbrauch.';
  if (mode === 'pc') return 'Volle Detailtiefe, dichtere Umgebung, höhere Auflösung und zusätzliche atmosphärische Animationen.';
  return 'Wählt anhand von Eingabegerät, Arbeitsspeicher, CPU-Kernen und Bewegungseinstellung automatisch ein passendes Profil.';
}

export function currentVisualProfile(): VisualProfile {
  const preference = currentGraphicsMode();
  if (preference === 'mobile') return profileForTier('balanced');
  if (preference === 'pc') return profileForTier('cinematic');
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return profileForTier('cinematic');

  const extendedNavigator = navigator as Navigator & { deviceMemory?: number };
  return selectVisualProfile({
    coarsePointer: window.matchMedia?.('(pointer: coarse)').matches ?? false,
    deviceMemory: extendedNavigator.deviceMemory,
    hardwareConcurrency: navigator.hardwareConcurrency,
    reducedMotion: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false,
  });
}

export function colorShade(color: number, factor: number): number {
  const red = Math.max(0, Math.min(255, Math.round(((color >> 16) & 0xff) * factor)));
  const green = Math.max(0, Math.min(255, Math.round(((color >> 8) & 0xff) * factor)));
  const blue = Math.max(0, Math.min(255, Math.round((color & 0xff) * factor)));
  return (red << 16) | (green << 8) | blue;
}

export function seededFraction(seed: string, index = 0): number {
  let hash = 2166136261 ^ index;
  for (let position = 0; position < seed.length; position += 1) {
    hash ^= seed.charCodeAt(position);
    hash = Math.imul(hash, 16777619);
  }
  return ((hash >>> 0) % 10_000) / 10_000;
}

export function addCinematicFrame(scene: Phaser.Scene, accent = 0xf4c75d): void {
  const frame = scene.add.graphics().setDepth(900).setScrollFactor(0);
  frame.lineStyle(2, accent, 0.34);
  frame.strokeRoundedRect(9, 9, 942, 622, 18);
  frame.lineStyle(1, 0xfff2c4, 0.12);
  frame.strokeRoundedRect(15, 15, 930, 610, 15);
  frame.fillStyle(0x02080b, 0.22);
  frame.fillRect(0, 0, 960, 10);
  frame.fillRect(0, 630, 960, 10);
  frame.fillRect(0, 0, 10, 640);
  frame.fillRect(950, 0, 10, 640);

  for (const [x, y, sx, sy] of [
    [24, 24, 1, 1],
    [936, 24, -1, 1],
    [24, 616, 1, -1],
    [936, 616, -1, -1],
  ] as Array<[number, number, number, number]>) {
    frame.lineStyle(4, accent, 0.66);
    frame.lineBetween(x, y, x + 27 * sx, y);
    frame.lineBetween(x, y, x, y + 27 * sy);
    frame.fillStyle(0xfff0bd, 0.74);
    frame.fillCircle(x, y, 3);
  }
}

function profileForTier(tier: VisualTier): VisualProfile {
  return { tier, ...VISUAL_PROFILES[tier] };
}

function isGraphicsMode(value: string | null): value is GraphicsMode {
  return value === 'auto' || value === 'mobile' || value === 'pc';
}

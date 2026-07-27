export const WORLD_RECOVERY_DELAYS_MS = [60, 180] as const;

export function encounterJustClosed(previousEncounterId: string | null, currentEncounterId: string | null): boolean {
  return Boolean(previousEncounterId && !currentEncounterId);
}

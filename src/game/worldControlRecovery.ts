export function encounterJustClosed(previousEncounterId: string | null, currentEncounterId: string | null): boolean {
  return Boolean(previousEncounterId && !currentEncounterId);
}

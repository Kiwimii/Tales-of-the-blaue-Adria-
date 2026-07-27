export interface RankedInteractionCandidate {
  id: string;
  prompt: string;
  distance: number;
}

export function interactionIdentity(id: string): string {
  const npc = id.match(/^npc-(.+?)(?:-story)?$/);
  if (npc) return `npc:${npc[1]}`;
  if (id === 'home-door' || id === 'home-door-story') return 'door:home';
  if (id === 'arrival-board' || id === 'landmark-notice-board') return 'object:notice-board';
  return id;
}

export function interactionPriority(id: string): number {
  if (id.startsWith('arrival-') || id.endsWith('-story')) return 0;
  if (id.startsWith('npc-')) return 1;
  if (['battle', 'flip-cup', 'beer-pong', 'flunkyball', 'masl-hole', 'tent-hedge-relief'].includes(id)) return 2;
  if (id.includes('door') || id.includes('entrance')) return 3;
  if (id.startsWith('landmark-')) return 5;
  return 4;
}

export function rankInteractionCandidates<T extends RankedInteractionCandidate>(candidates: T[]): T[] {
  const ordered = [...candidates].sort((left, right) => {
    const leftScore = left.distance + interactionPriority(left.id) * 10;
    const rightScore = right.distance + interactionPriority(right.id) * 10;
    return leftScore - rightScore || left.prompt.localeCompare(right.prompt, 'de');
  });
  const unique = new Map<string, T>();
  for (const candidate of ordered) {
    const identity = interactionIdentity(candidate.id);
    if (!unique.has(identity)) unique.set(identity, candidate);
  }
  return [...unique.values()];
}

export function cycleInteractionId(ids: string[], currentId: string | undefined, direction = 1): string | undefined {
  if (!ids.length) return undefined;
  const index = currentId ? ids.indexOf(currentId) : -1;
  const normalizedDirection = direction < 0 ? -1 : 1;
  const next = index < 0 ? 0 : (index + normalizedDirection + ids.length) % ids.length;
  return ids[next];
}

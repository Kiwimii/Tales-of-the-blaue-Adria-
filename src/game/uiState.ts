import type { GameMode, GameSnapshot, Needs } from './types';

export type NeedKey = keyof Needs;

export interface NeedMeta {
  key: NeedKey;
  label: string;
  icon: string;
  direction: 'low' | 'high';
  warningAt: number;
  criticalAt: number;
}

export interface NeedAlert {
  key: NeedKey;
  label: string;
  icon: string;
  value: number;
  severity: number;
  critical: boolean;
}

export const NEED_META: readonly NeedMeta[] = [
  { key: 'energy', label: 'Energie', icon: '⚡', direction: 'low', warningAt: 32, criticalAt: 16 },
  { key: 'hunger', label: 'Hunger', icon: '◆', direction: 'high', warningAt: 70, criticalAt: 88 },
  { key: 'thirst', label: 'Durst', icon: '●', direction: 'high', warningAt: 70, criticalAt: 88 },
  { key: 'bladder', label: 'Blase', icon: '◒', direction: 'high', warningAt: 72, criticalAt: 90 },
  { key: 'alcohol', label: 'Alkohol', icon: '♨', direction: 'high', warningAt: 58, criticalAt: 82 },
  { key: 'highness', label: 'Breitheit', icon: '✦', direction: 'high', warningAt: 58, criticalAt: 82 },
  { key: 'hangover', label: 'Kater', icon: '☁', direction: 'high', warningAt: 48, criticalAt: 74 },
  { key: 'courage', label: 'Mut', icon: '▲', direction: 'low', warningAt: 24, criticalAt: 10 },
] as const;

export function needSeverity(meta: NeedMeta, value: number): number {
  const normalized = Math.max(0, Math.min(100, value));
  if (meta.direction === 'high') {
    if (normalized < meta.warningAt) return 0;
    return (normalized - meta.warningAt) / Math.max(1, 100 - meta.warningAt);
  }
  if (normalized > meta.warningAt) return 0;
  return (meta.warningAt - normalized) / Math.max(1, meta.warningAt);
}

export function importantNeedAlerts(needs: Needs, limit = 2): NeedAlert[] {
  return NEED_META
    .map((meta) => {
      const value = needs[meta.key];
      const severity = needSeverity(meta, value);
      const critical = meta.direction === 'high' ? value >= meta.criticalAt : value <= meta.criticalAt;
      return { key: meta.key, label: meta.label, icon: meta.icon, value, severity, critical };
    })
    .filter((entry) => entry.severity > 0)
    .sort((left, right) => Number(right.critical) - Number(left.critical) || right.severity - left.severity)
    .slice(0, Math.max(0, limit));
}

export function conditionTone(condition: string): 'good' | 'warn' | 'bad' {
  if (condition.includes('Kontrollverlust') || condition.includes('angeschlagen')) return 'bad';
  if (condition.includes('Druck') || condition.includes('Kater') || condition.includes('betrunken')) return 'warn';
  return 'good';
}

export function modeName(mode: GameMode): string {
  const labels: Record<GameMode, string> = {
    intro: 'Intro',
    creator: 'Erstellung',
    shop: 'Supermarkt',
    world: 'Campingplatz',
    interior: 'Innenraum',
    battle: 'Camping-Duell',
    'flip-cup': 'Flip Cup',
    'beer-pong': 'Beer Pong',
    flunkyball: 'Flunkyball',
  };
  return labels[mode];
}

export function knownRelationshipCount(snapshot: GameSnapshot): number {
  return Object.entries(snapshot.relationships).filter(([id, value]) => (
    Boolean(snapshot.flags[`met-${id}`]) || value !== 0
  )).length;
}

export function carriedItemIds(snapshot: GameSnapshot): string[] {
  return Object.entries(snapshot.inventory)
    .filter(([, count]) => count > 0)
    .map(([id]) => id)
    .sort((left, right) => left.localeCompare(right, 'de'));
}

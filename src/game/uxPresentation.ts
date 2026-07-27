export type ChallengeTone = 'safe' | 'uncertain' | 'risky';

export function challengeTone(chance: number): ChallengeTone {
  if (chance >= 72) return 'safe';
  if (chance >= 45) return 'uncertain';
  return 'risky';
}

export function challengeLabel(chance: number): string {
  const tone = challengeTone(chance);
  if (tone === 'safe') return 'Gute Chance';
  if (tone === 'uncertain') return 'Offener Ausgang';
  return 'Hohes Risiko';
}

export function interactionActionLabel(prompt?: string | null): string {
  const clean = prompt?.replace(/\s+/g, ' ').trim();
  if (!clean) return 'Interagieren';
  return clean.length <= 34 ? clean : `${clean.slice(0, 31).trimEnd()}…`;
}

export function compactObjective(objective: string, maxLength = 92): string {
  const clean = objective.replace(/\s+/g, ' ').trim();
  return clean.length <= maxLength ? clean : `${clean.slice(0, maxLength - 1).trimEnd()}…`;
}

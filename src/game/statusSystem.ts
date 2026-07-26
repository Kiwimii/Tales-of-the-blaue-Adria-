import type { Needs, Skill } from './types';

export type StatusId =
  | 'angetrunken'
  | 'betrunken'
  | 'voll'
  | 'breit'
  | 'sehr-breit'
  | 'kater'
  | 'erschoepft'
  | 'dehydriert';

export interface ActiveStatus {
  id: StatusId;
  label: string;
  shortLabel: string;
  intensity: number;
  description: string;
  color: number;
}

export interface StatusModifiers {
  power: number;
  accuracy: number;
  defense: number;
  reactionDelayMs: number;
  charm: number;
  flirt: number;
  energyDrain: number;
  movement: number;
  sway: number;
}

const ZERO_MODIFIERS: StatusModifiers = {
  power: 1,
  accuracy: 0,
  defense: 1,
  reactionDelayMs: 0,
  charm: 0,
  flirt: 0,
  energyDrain: 1,
  movement: 1,
  sway: 0,
};

export function activeStatuses(needs: Needs): ActiveStatus[] {
  const statuses: ActiveStatus[] = [];

  if (needs.alcohol >= 68) {
    statuses.push({
      id: 'voll', label: 'Voll wie ein Campingfass', shortLabel: 'VOLL', intensity: scale(needs.alcohol, 68, 100),
      description: 'Sehr hoher Schaden, deutlich schlechtere Trefferquote und starke Schwankbewegung.', color: 0xef765f,
    });
  } else if (needs.alcohol >= 38) {
    statuses.push({
      id: 'betrunken', label: 'Betrunken', shortLabel: 'BESOFFEN', intensity: scale(needs.alcohol, 38, 68),
      description: 'Mehr Durchsetzungskraft, aber merklich weniger Präzision.', color: 0xf2a45f,
    });
  } else if (needs.alcohol >= 14) {
    statuses.push({
      id: 'angetrunken', label: 'Angetrunken', shortLabel: 'PEGEL', intensity: scale(needs.alcohol, 14, 38),
      description: 'Etwas mutiger und kräftiger, mit ersten Präzisionsverlusten.', color: 0xf4d47b,
    });
  }

  if (needs.highness >= 70) {
    statuses.push({
      id: 'sehr-breit', label: 'Sehr breit', shortLabel: 'SEHR BREIT', intensity: scale(needs.highness, 70, 100),
      description: 'Reaktionen setzen stark verzögert ein; chaotische Ideen wirken dafür überzeugender.', color: 0xb99ce8,
    });
  } else if (needs.highness >= 30) {
    statuses.push({
      id: 'breit', label: 'Breit', shortLabel: 'BREIT', intensity: scale(needs.highness, 30, 70),
      description: 'Eingaben und Reaktionen sind verzögert, dafür steigt die kreative Gelassenheit.', color: 0x84d6a2,
    });
  }

  if (needs.hangover >= 28) {
    statuses.push({
      id: 'kater', label: 'Kater', shortLabel: 'KATER', intensity: scale(needs.hangover, 28, 100),
      description: 'Energie sinkt schneller; Charme, Flirt und Konzentration leiden.', color: 0x9aa5ad,
    });
  }
  if (needs.energy <= 30) {
    statuses.push({
      id: 'erschoepft', label: 'Erschöpft', shortLabel: 'PLATT', intensity: scale(30 - needs.energy, 0, 30),
      description: 'Bewegung, Verteidigung und soziale Geduld sind reduziert.', color: 0x78909c,
    });
  }
  if (needs.thirst >= 72) {
    statuses.push({
      id: 'dehydriert', label: 'Dehydriert', shortLabel: 'DURST', intensity: scale(needs.thirst, 72, 100),
      description: 'Konzentration und Ausdauer brechen sichtbar ein.', color: 0xd89a5b,
    });
  }
  return statuses;
}

export function statusModifiers(needs: Needs): StatusModifiers {
  const result = { ...ZERO_MODIFIERS };

  if (needs.alcohol >= 68) {
    result.power *= 1.34;
    result.accuracy -= 29;
    result.defense *= 0.82;
    result.movement *= 0.88;
    result.sway += 1;
    result.charm -= 15;
    result.flirt -= 13;
  } else if (needs.alcohol >= 38) {
    result.power *= 1.2;
    result.accuracy -= 16;
    result.defense *= 0.92;
    result.sway += 0.68;
    result.charm -= 5;
    result.flirt -= 4;
  } else if (needs.alcohol >= 14) {
    result.power *= 1.1;
    result.accuracy -= 6;
    result.charm += 3;
    result.flirt += 2;
    result.sway += 0.28;
  }

  if (needs.highness >= 70) {
    result.reactionDelayMs += 430;
    result.accuracy -= 12;
    result.movement *= 0.82;
    result.charm -= 8;
    result.flirt -= 7;
  } else if (needs.highness >= 30) {
    result.reactionDelayMs += 210;
    result.accuracy -= 5;
    result.movement *= 0.92;
    result.charm += 1;
  }

  if (needs.hangover >= 28) {
    const factor = Math.min(1, (needs.hangover - 28) / 72);
    result.energyDrain *= 1.35 + factor * 0.65;
    result.accuracy -= Math.round(6 + factor * 12);
    result.charm -= Math.round(9 + factor * 13);
    result.flirt -= Math.round(8 + factor * 12);
    result.defense *= 0.9;
  }
  if (needs.energy <= 30) {
    const factor = (30 - needs.energy) / 30;
    result.movement *= 1 - factor * 0.25;
    result.defense *= 1 - factor * 0.18;
    result.accuracy -= Math.round(factor * 10);
    result.charm -= Math.round(factor * 7);
  }
  if (needs.thirst >= 72) {
    const factor = (needs.thirst - 72) / 28;
    result.accuracy -= Math.round(5 + factor * 8);
    result.energyDrain *= 1.08 + factor * 0.18;
  }
  return result;
}

export function statusSkillModifier(needs: Needs, skill: Skill): number {
  const modifiers = statusModifiers(needs);
  let value = skill === 'charm' ? modifiers.charm : 0;
  if (skill === 'focus') value += Math.round(modifiers.accuracy * 0.7);
  if (skill === 'nerve') value += Math.round((modifiers.power - 1) * 35 + modifiers.accuracy * 0.2);
  if (skill === 'chaos') {
    value += needs.highness >= 30 ? 5 : 0;
    value += needs.alcohol >= 38 ? 4 : 0;
  }
  if (skill === 'teamwork' && needs.hangover >= 45) value -= 7;
  return Math.round(value);
}

export function conditionSummary(needs: Needs): string {
  const statuses = activeStatuses(needs);
  if (!statuses.length) return 'Stabil';
  return statuses.slice(0, 2).map((status) => status.shortLabel).join(' · ');
}

export function statusVisuals(needs: Needs): { sway: number; delayMs: number; vignette: number; desaturation: number } {
  const modifiers = statusModifiers(needs);
  return {
    sway: modifiers.sway,
    delayMs: modifiers.reactionDelayMs,
    vignette: Math.min(0.55, Math.max(0, needs.hangover - 20) / 145),
    desaturation: Math.min(0.45, Math.max(0, needs.hangover - 25) / 150),
  };
}

function scale(value: number, min: number, max: number): number {
  if (max <= min) return 1;
  return Math.max(0, Math.min(1, (value - min) / (max - min)));
}

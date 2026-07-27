import { describe, expect, it } from 'vitest';
import { ARRIVAL_ENCOUNTERS } from '../src/game/arrivalEncounters';
import { importantNeedAlerts, needSeverity } from '../src/game/uiState';
import type { Needs } from '../src/game/types';

const stableNeeds: Needs = {
  energy: 80,
  hunger: 20,
  thirst: 18,
  bladder: 12,
  alcohol: 0,
  highness: 0,
  hangover: 0,
  courage: 70,
};

describe('focused play UI selectors', () => {
  it('keeps the permanent HUD empty when no value needs attention', () => {
    expect(importantNeedAlerts(stableNeeds)).toEqual([]);
  });

  it('shows only the most urgent warnings and prioritizes critical values', () => {
    const alerts = importantNeedAlerts({
      ...stableNeeds,
      energy: 10,
      thirst: 93,
      bladder: 80,
    }, 2);
    expect(alerts).toHaveLength(2);
    expect(alerts.every((alert) => alert.critical)).toBe(true);
    expect(alerts.map((alert) => alert.key)).toContain('energy');
    expect(alerts.map((alert) => alert.key)).toContain('thirst');
  });

  it('calculates low and high directional severity correctly', () => {
    expect(needSeverity({ key: 'energy', label: 'Energie', icon: 'E', direction: 'low', warningAt: 32, criticalAt: 16 }, 80)).toBe(0);
    expect(needSeverity({ key: 'energy', label: 'Energie', icon: 'E', direction: 'low', warningAt: 32, criticalAt: 16 }, 0)).toBe(1);
    expect(needSeverity({ key: 'thirst', label: 'Durst', icon: 'D', direction: 'high', warningAt: 70, criticalAt: 88 }, 40)).toBe(0);
    expect(needSeverity({ key: 'thirst', label: 'Durst', icon: 'D', direction: 'high', warningAt: 70, criticalAt: 88 }, 100)).toBe(1);
  });
});

describe('Lidl and Aldimania lore', () => {
  it('treats both names as polarizing discounter fashion rather than racing teams', () => {
    const encounter = ARRIVAL_ENCOUNTERS['uli-entry'];
    const copy = JSON.stringify(encounter);
    expect(copy).not.toMatch(/Racing|Motorsport|Boxengasse/i);
    expect(copy).toMatch(/Discounter|Mode|Klamotten/i);
    expect(copy).toMatch(/Hype/i);
  });
});

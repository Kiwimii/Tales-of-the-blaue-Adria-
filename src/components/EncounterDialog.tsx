import { useEffect, useState } from 'react';
import type { ReactElement } from 'react';
import { ENCOUNTERS } from '../game/content';
import { calculateChallengeChance } from '../game/mechanics';
import { gameStore } from '../game/state/GameStore';
import { DIALOG_TOUCH_GUARD_MS } from '../game/touchInteraction';
import type { ChallengeOutcome, GameSnapshot } from '../game/types';
import '../dialogGuard.css';

export function EncounterDialog({ snapshot }: { snapshot: GameSnapshot }): ReactElement | null {
  const active = snapshot.encounter;
  const encounter = active ? ENCOUNTERS[active.id] : null;
  const [locked, setLocked] = useState(true);

  useEffect(() => {
    setLocked(true);
    const timer = window.setTimeout(() => setLocked(false), DIALOG_TOUCH_GUARD_MS);
    return () => window.clearTimeout(timer);
  }, [active?.id]);

  if (!active || !encounter) return null;
  const close = (): void => gameStore.closeEncounter();

  return (
    <div className="encounter-overlay" role="dialog" aria-modal="true" aria-labelledby="encounter-title">
      <section className="encounter-card">
        <button className="dialog-x-button" type="button" aria-label="Gespräch schließen" onClick={close}>×</button>
        <div className="encounter-portrait">{encounter.portrait}</div>
        <div className="encounter-content">
          <p className="eyebrow">Entscheidung · Zustand und Beziehungen wirken mit</p>
          <h2 id="encounter-title">{encounter.speaker}</h2>
          {active.result ? (
            <div className={`encounter-result result-${active.result.outcome}`}>
              <strong>{outcomeLabel(active.result.outcome)}</strong>
              <p>{active.result.text}</p>
              <small>Wurf {active.result.roll} · Chance {active.result.chance} %</small>
              <button className="encounter-world-return" type="button" onClick={close}>
                Gespräch schließen und weiterlaufen
              </button>
            </div>
          ) : (
            <>
              <p className="encounter-intro">{encounter.intro}</p>
              <div className="encounter-options" aria-busy={locked}>
                {encounter.options.map((option) => {
                  const chance = calculateChallengeChance(snapshot, option.challenge);
                  const missingItem = Boolean(option.requiredItem && !snapshot.inventory[option.requiredItem]);
                  return (
                    <button
                      type="button"
                      key={option.id}
                      disabled={locked || missingItem}
                      onClick={() => gameStore.resolveEncounter(option.id)}
                    >
                      <span><strong>{option.label}</strong><small>{option.hint}</small></span>
                      <b>{missingItem ? 'FEHLT' : `${chance}%`}</b>
                    </button>
                  );
                })}
              </div>
              <div className="encounter-footer-row">
                <small>{locked ? 'Antworten werden kurz freigegeben …' : 'Wähle deine Antwort bewusst aus.'}</small>
                <button className="quiet-button encounter-close" type="button" onClick={close}>Gespräch verlassen</button>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

function outcomeLabel(outcome: ChallengeOutcome): string {
  if (outcome === 'great') return 'Glänzender Erfolg';
  if (outcome === 'success') return 'Erfolg';
  if (outcome === 'disaster') return 'Totales Desaster';
  return 'Fehlschlag';
}

import { useEffect, useState } from 'react';
import type { ReactElement } from 'react';
import { ENCOUNTERS } from '../game/content';
import { sendRecoverWorldControl } from '../game/events';
import { calculateChallengeChance } from '../game/mechanics';
import { gameStore } from '../game/state/GameStore';
import { DIALOG_TOUCH_GUARD_MS } from '../game/touchInteraction';
import type { ChallengeOutcome, GameSnapshot } from '../game/types';
import { challengeLabel, challengeTone } from '../game/uxPresentation';
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

  useEffect(() => {
    if (!active || !encounter) return;
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        event.preventDefault();
        gameStore.closeEncounter();
        sendRecoverWorldControl();
        return;
      }
      if (locked || active.result || !/^[1-9]$/.test(event.key)) return;
      const option = encounter.options[Number(event.key) - 1];
      if (!option || (option.requiredItem && !snapshot.inventory[option.requiredItem])) return;
      event.preventDefault();
      gameStore.resolveEncounter(option.id);
    };
    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, [active, encounter, locked, snapshot.inventory]);

  if (!active || !encounter) return null;
  const close = (): void => {
    gameStore.closeEncounter();
    sendRecoverWorldControl();
  };

  return (
    <div className="encounter-overlay" role="dialog" aria-modal="true" aria-labelledby="encounter-title">
      <section className="encounter-card">
        <button className="dialog-x-button" type="button" aria-label="Gespräch schließen" onClick={close}>×</button>
        <div className="encounter-portrait" aria-hidden="true">{encounter.portrait}</div>
        <div className="encounter-content">
          <div className="encounter-heading">
            <div>
              <p className="eyebrow">Gespräch · Werte und Beziehungen wirken mit</p>
              <h2 id="encounter-title">{encounter.speaker}</h2>
            </div>
            {!active.result && <span className="encounter-key-hint">Tasten 1–{encounter.options.length}</span>}
          </div>
          {active.result ? (
            <div className={`encounter-result result-${active.result.outcome}`} aria-live="polite">
              <span className="encounter-result-kicker">Ergebnis</span>
              <strong>{outcomeLabel(active.result.outcome)}</strong>
              <p>{active.result.text}</p>
              <div className="encounter-result-meta">
                <span>Wurf <b>{active.result.roll}</b></span>
                <span>Chance <b>{active.result.chance} %</b></span>
              </div>
              <button className="encounter-world-return" type="button" onClick={close}>
                Weiterlaufen
              </button>
            </div>
          ) : (
            <>
              <p className="encounter-intro">{encounter.intro}</p>
              <div className="encounter-options" aria-busy={locked}>
                {encounter.options.map((option, index) => {
                  const chance = calculateChallengeChance(snapshot, option.challenge);
                  const missingItem = Boolean(option.requiredItem && !snapshot.inventory[option.requiredItem]);
                  const tone = challengeTone(chance);
                  return (
                    <button
                      type="button"
                      key={option.id}
                      className={`encounter-option encounter-option-${tone}`}
                      disabled={locked || missingItem}
                      onClick={() => gameStore.resolveEncounter(option.id)}
                    >
                      <span className="encounter-option-number" aria-hidden="true">{index + 1}</span>
                      <span className="encounter-option-copy">
                        <strong>{option.label}</strong>
                        <small>{option.hint}</small>
                      </span>
                      <span className="encounter-option-chance">
                        <small>{missingItem ? 'Voraussetzung fehlt' : challengeLabel(chance)}</small>
                        <b>{missingItem ? 'GESPERRT' : `${chance} %`}</b>
                        <i><em style={{ width: missingItem ? '0%' : `${chance}%` }} /></i>
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="encounter-footer-row">
                <small>{locked ? 'Eingabeschutz wird aufgehoben …' : 'Esc schließt das Gespräch ohne Auswahl.'}</small>
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

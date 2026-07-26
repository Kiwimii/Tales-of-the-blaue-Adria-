import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, ReactElement } from 'react';
import type Phaser from 'phaser';
import { ENCOUNTERS, ITEMS, QUESTS } from './game/content';
import { sendAction, sendDirection } from './game/events';
import { calculateChallengeChance } from './game/mechanics';
import { gameStore } from './game/state/GameStore';
import type { ChallengeOutcome, Direction, GameSnapshot, PlayerProfile } from './game/types';

const defaultProfile: PlayerProfile = {
  name: 'André',
  skinTone: '#efc09b',
  hair: '#49301f',
  shirt: '#e3b74f',
  trait: 'charmant',
};

const needLabels: Array<[keyof GameSnapshot['needs'], string]> = [
  ['energy', 'Energie'],
  ['hunger', 'Hunger'],
  ['thirst', 'Durst'],
  ['bladder', 'Blase'],
  ['alcohol', 'Alkohol'],
  ['highness', 'Breitheit'],
  ['hangover', 'Kater'],
  ['courage', 'Mut'],
];

export default function App(): ReactElement {
  const [snapshot, setSnapshot] = useState<GameSnapshot>(() => gameStore.snapshot());
  const gameHostRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const shouldLoadGame = Boolean(snapshot.profile && snapshot.prologue.shoppingComplete);

  useEffect(() => gameStore.subscribe(setSnapshot), []);

  useEffect(() => {
    if (!shouldLoadGame || !gameHostRef.current || gameRef.current) return;
    const host = gameHostRef.current;
    let cancelled = false;

    void import('./game/createGame').then(({ createGame }) => {
      if (cancelled || gameRef.current) return;
      gameRef.current = createGame(host);
    });

    return () => {
      cancelled = true;
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, [shouldLoadGame]);

  if (!snapshot.profile) return <CharacterCreator />;
  if (!snapshot.prologue.shoppingComplete || snapshot.mode === 'shop') return <Supermarket snapshot={snapshot} />;

  const lastEntry = snapshot.chronicle.at(-1);

  return (
    <main className="game-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Tag {snapshot.day} · {snapshot.phaseLabel}</p>
          <strong>{snapshot.clockLabel}</strong>
        </div>
        <div className="metric-strip" aria-label="Wochenendwerte">
          <Metric label="Würde" value={snapshot.metrics.dignity} />
          <Metric label="Chaos" value={snapshot.metrics.chaos} />
          <Metric label="Ruf" value={snapshot.metrics.reputation} />
          <Metric label="Lauf" value={snapshot.metrics.momentum} signed />
        </div>
        <div className="mode-chip">{modeName(snapshot.mode)}</div>
        <button className="quiet-button" type="button" onClick={() => gameStore.reset()}>
          Neustart
        </button>
      </header>

      <section className="objective-bar">
        <div>
          <p className="eyebrow">{snapshot.activeQuest ? QUESTS[snapshot.activeQuest]?.title : 'Freies Spiel'}</p>
          <strong>{snapshot.currentObjective}</strong>
        </div>
        <span className={`condition-chip condition-${conditionTone(snapshot.conditionLabel)}`}>{snapshot.conditionLabel}</span>
      </section>

      <section className="needs-panel" aria-label="Statuswerte">
        {needLabels.map(([key, label]) => (
          <div className={`need ${needWarning(key, snapshot.needs[key]) ? 'need-warning' : ''}`} key={key}>
            <div className="need-label"><span>{label}</span><span>{Math.round(snapshot.needs[key])}</span></div>
            <div className="need-track"><div className={`need-fill need-${key}`} style={{ width: `${snapshot.needs[key]}%` }} /></div>
          </div>
        ))}
      </section>

      <section className="game-frame">
        <div className="game-host" ref={gameHostRef} />

        {snapshot.mode === 'world' && !snapshot.encounter && (
          <div className="mobile-controls" aria-label="Mobile Spielsteuerung">
            <DPad />
            <button className="action-button" type="button" onPointerDown={sendAction}>AKTION</button>
          </div>
        )}
      </section>

      <footer className="bottom-panel">
        <div className="inventory-block">
          <p className="eyebrow">Inventar · {snapshot.money} € Reserve</p>
          <div className="inventory-row">
            {Object.entries(snapshot.inventory)
              .filter(([, count]) => count > 0)
              .map(([item, count]) => (
                <button
                  key={item}
                  type="button"
                  className="inventory-chip"
                  disabled={!ITEMS[item]?.effects}
                  title={ITEMS[item]?.effects ? ITEMS[item].description : 'Questgegenstand'}
                  onClick={() => gameStore.useItem(item)}
                >
                  {ITEMS[item]?.icon} {ITEMS[item]?.label ?? item} × {count}
                </button>
              ))}
          </div>
        </div>
        <div className="team-summary">
          <p className="eyebrow">Gruppe</p>
          <strong>{snapshot.profile.name}</strong>
          <span>{snapshot.team.length ? snapshot.team.map((member) => `${member.name} · ${member.role}`).join(' | ') : 'Noch keine Begleiter'}</span>
          {lastEntry && <small className={`chronicle-${lastEntry.tone}`}>{lastEntry.text}</small>}
        </div>
      </footer>

      {snapshot.encounter && <EncounterPanel snapshot={snapshot} />}
    </main>
  );
}

function Metric({ label, value, signed = false }: { label: string; value: number; signed?: boolean }): ReactElement {
  return (
    <span className="metric">
      <small>{label}</small>
      <strong>{signed && value > 0 ? '+' : ''}{Math.round(value)}</strong>
    </span>
  );
}

function Supermarket({ snapshot }: { snapshot: GameSnapshot }): ReactElement {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [error, setError] = useState('');
  const total = Object.entries(cart).reduce((sum, [id, count]) => sum + ITEMS[id].price * count, 0);
  const remaining = 25 - total;

  const adjust = (id: string, delta: number): void => {
    setError('');
    setCart((current) => ({
      ...current,
      [id]: Math.max(0, Math.min(ITEMS[id].max, (current[id] ?? 0) + delta)),
    }));
  };

  const useRecommendedPack = (): void => {
    setCart({ wasser: 2, wuerste: 1, bier: 1, klopapier: 1, chips: 1 });
    setError('');
  };

  const finish = (): void => {
    const result = gameStore.completeShopping(cart);
    if (!result.ok) setError(result.error ?? 'Einkauf konnte nicht abgeschlossen werden.');
  };

  return (
    <main className="shop-page">
      <section className="shop-card">
        <header className="shop-header">
          <div>
            <p className="eyebrow">Freitag · vor der Abfahrt</p>
            <h1>25 Euro. Keine zweite Chance.</h1>
            <p>{snapshot.profile?.name}, dein Einkauf verändert Proben, Beziehungen und Erholung während des gesamten Wochenendes.</p>
          </div>
          <div className={`budget ${remaining < 0 ? 'budget-over' : ''}`}>
            <small>Verbleibend</small>
            <strong>{remaining} €</strong>
          </div>
        </header>

        <div className="shop-grid">
          {Object.values(ITEMS).map((item) => (
            <article className="shop-item" key={item.id}>
              <span className="shop-icon">{item.icon}</span>
              <div>
                <strong>{item.label}</strong>
                <small>{item.price} €</small>
              </div>
              <p>{item.description}</p>
              <footer>
                <button type="button" onClick={() => adjust(item.id, -1)} disabled={!cart[item.id]}>−</button>
                <strong>{cart[item.id] ?? 0}</strong>
                <button type="button" onClick={() => adjust(item.id, 1)} disabled={(cart[item.id] ?? 0) >= item.max}>+</button>
              </footer>
            </article>
          ))}
        </div>

        <div className="shop-actions">
          <button className="secondary-button" type="button" onClick={useRecommendedPack}>Solides Startpaket</button>
          <div>
            {error && <span className="shop-error">{error}</span>}
            <button className="primary-button compact-button" type="button" disabled={remaining < 0} onClick={finish}>
              Für {total} € einkaufen
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

function EncounterPanel({ snapshot }: { snapshot: GameSnapshot }): ReactElement {
  const active = snapshot.encounter;
  const encounter = active ? ENCOUNTERS[active.id] : null;
  if (!active || !encounter) return <></>;

  return (
    <div className="encounter-overlay" role="dialog" aria-modal="true" aria-labelledby="encounter-title">
      <section className="encounter-card">
        <div className="encounter-portrait">{encounter.portrait}</div>
        <div className="encounter-content">
          <p className="eyebrow">Entscheidung · Zustand und Gruppe wirken mit</p>
          <h2 id="encounter-title">{encounter.speaker}</h2>

          {active.result ? (
            <div className={`encounter-result result-${active.result.outcome}`}>
              <strong>{outcomeLabel(active.result.outcome)}</strong>
              <p>{active.result.text}</p>
              <small>Wurf {active.result.roll} · Chance {active.result.chance} %</small>
              <button className="primary-button compact-button" type="button" onClick={() => gameStore.closeEncounter()}>
                Weiter
              </button>
            </div>
          ) : (
            <>
              <p className="encounter-intro">{encounter.intro}</p>
              <div className="encounter-options">
                {encounter.options.map((option) => {
                  const chance = calculateChallengeChance(snapshot, option.challenge);
                  const missingItem = option.requiredItem && !snapshot.inventory[option.requiredItem];
                  return (
                    <button
                      type="button"
                      key={option.id}
                      disabled={Boolean(missingItem)}
                      onClick={() => gameStore.resolveEncounter(option.id)}
                    >
                      <span>
                        <strong>{option.label}</strong>
                        <small>{option.hint}</small>
                      </span>
                      <b>{missingItem ? 'FEHLT' : `${chance}%`}</b>
                    </button>
                  );
                })}
              </div>
              <button className="quiet-button encounter-close" type="button" onClick={() => gameStore.closeEncounter()}>
                Gespräch verlassen
              </button>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

function CharacterCreator(): ReactElement {
  const [profile, setProfile] = useState<PlayerProfile>(defaultProfile);
  const previewStyle = useMemo(() => ({
    '--skin': profile.skinTone,
    '--hair': profile.hair,
    '--shirt': profile.shirt,
  }) as CSSProperties, [profile]);

  const update = <K extends keyof PlayerProfile>(key: K, value: PlayerProfile[K]): void => {
    setProfile((current) => ({ ...current, [key]: value }));
  };

  return (
    <main className="creator-page">
      <section className="creator-card">
        <div className="creator-copy">
          <p className="eyebrow">Freitag · 07:00 Uhr</p>
          <h1>Tales of the Blaue Adria</h1>
          <p>Dein Merkmal ist keine Dekoration: Es verändert Dialog-, Kampf- und Gruppenproben. Danach stellst du im Supermarkt deinen Vorrat mit 25 Euro zusammen.</p>

          <label>
            Name
            <input value={profile.name} maxLength={18} onChange={(event) => update('name', event.target.value)} />
          </label>

          <div className="color-grid">
            <label>Haut<input type="color" value={profile.skinTone} onChange={(event) => update('skinTone', event.target.value)} /></label>
            <label>Haare<input type="color" value={profile.hair} onChange={(event) => update('hair', event.target.value)} /></label>
            <label>Oberteil<input type="color" value={profile.shirt} onChange={(event) => update('shirt', event.target.value)} /></label>
          </div>

          <label>
            Startmerkmal
            <select value={profile.trait} onChange={(event) => update('trait', event.target.value as PlayerProfile['trait'])}>
              <option value="charmant">Charmant</option>
              <option value="direkt">Direkt</option>
              <option value="chaotisch">Chaotisch</option>
              <option value="hilfsbereit">Hilfsbereit</option>
              <option value="beobachtend">Beobachtend</option>
            </select>
          </label>

          <button className="primary-button" type="button" disabled={!profile.name.trim()} onClick={() => gameStore.setProfile({ ...profile, name: profile.name.trim() })}>
            Zum Supermarkt
          </button>
        </div>

        <div className="preview-panel">
          <div className="character-preview" style={previewStyle} aria-label="Vorschau der Spielfigur">
            <div className="preview-hair" />
            <div className="preview-head" />
            <div className="preview-shirt" />
            <div className="preview-legs"><span /><span /></div>
          </div>
          <p>{profile.name || 'Deine Figur'}</p>
          <span>{traitDescription(profile.trait)}</span>
        </div>
      </section>
    </main>
  );
}

function DPad(): ReactElement {
  const button = (direction: Direction, label: string, className: string): ReactElement => (
    <button
      type="button"
      className={`dpad-button ${className}`}
      aria-label={label}
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        sendDirection(direction, true);
      }}
      onPointerUp={() => sendDirection(direction, false)}
      onPointerCancel={() => sendDirection(direction, false)}
      onPointerLeave={() => sendDirection(direction, false)}
    >
      {label}
    </button>
  );

  return (
    <div className="dpad">
      {button('up', '▲', 'dpad-up')}
      {button('left', '◀', 'dpad-left')}
      {button('right', '▶', 'dpad-right')}
      {button('down', '▼', 'dpad-down')}
    </div>
  );
}

function modeName(mode: GameSnapshot['mode']): string {
  if (mode === 'world') return 'Top-down';
  if (mode === 'battle') return 'Rundenkampf';
  if (mode === 'flip-cup') return 'Minispiel';
  if (mode === 'shop') return 'Supermarkt';
  return 'Erstellung';
}

function outcomeLabel(outcome: ChallengeOutcome): string {
  if (outcome === 'great') return 'Glänzender Erfolg';
  if (outcome === 'success') return 'Erfolg';
  if (outcome === 'disaster') return 'Totales Desaster';
  return 'Fehlschlag';
}

function needWarning(key: keyof GameSnapshot['needs'], value: number): boolean {
  if (key === 'energy' || key === 'courage') return value < 22;
  return value > 78;
}

function conditionTone(condition: string): string {
  if (condition.includes('Kontrollverlust') || condition.includes('angeschlagen')) return 'bad';
  if (condition.includes('Druck')) return 'warn';
  return 'good';
}

function traitDescription(trait: PlayerProfile['trait']): string {
  const descriptions: Record<PlayerProfile['trait'], string> = {
    charmant: 'Bessere Chancen in freundlichen Dialogen.',
    direkt: 'Mehr Nerven in klaren Ansagen und Duellen.',
    chaotisch: 'Stärkere riskante Lösungen und Minispiele.',
    hilfsbereit: 'Mehr Wirkung aus Gruppe und Nebenquests.',
    beobachtend: 'Mehr Fokus bei Hinweisen und Timing.',
  };
  return descriptions[trait];
}

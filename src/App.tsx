import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, ReactElement } from 'react';
import type Phaser from 'phaser';
import { ENCOUNTERS, ITEMS, QUESTS, RELATIONSHIP_CHARACTERS } from './game/content';
import { sendAction, sendDirection } from './game/events';
import { calculateChallengeChance } from './game/mechanics';
import { gameStore } from './game/state/GameStore';
import type {
  Accessory,
  BodyType,
  ChallengeOutcome,
  Direction,
  GameSnapshot,
  HairStyle,
  PlayerProfile,
  Trait,
} from './game/types';

const defaultProfile: PlayerProfile = {
  name: 'André',
  skinTone: '#efc09b',
  hair: '#49301f',
  shirt: '#e3b74f',
  shorts: '#263b47',
  hairStyle: 'kurz',
  bodyType: 'normal',
  accessory: 'keins',
  trait: 'charmant',
};

const needLabels: Array<[keyof GameSnapshot['needs'], string, string]> = [
  ['energy', 'Energie', '⚡'],
  ['hunger', 'Hunger', '◆'],
  ['thirst', 'Durst', '●'],
  ['bladder', 'Blase', '◒'],
  ['alcohol', 'Alkohol', '♨'],
  ['highness', 'Breitheit', '✦'],
  ['hangover', 'Kater', '☁'],
  ['courage', 'Mut', '▲'],
];

export default function App(): ReactElement {
  const [snapshot, setSnapshot] = useState<GameSnapshot>(() => gameStore.snapshot());
  const [relationshipsOpen, setRelationshipsOpen] = useState(false);
  const gameHostRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const shouldLoadGame = Boolean(
    snapshot.prologue.introSeen
    && snapshot.profile
    && snapshot.prologue.shoppingComplete,
  );

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

  if (!snapshot.prologue.introSeen) return <OpeningCrawl />;
  if (!snapshot.profile) return <CharacterCreator />;
  if (!snapshot.prologue.shoppingComplete || snapshot.mode === 'shop') return <Supermarket snapshot={snapshot} />;

  const lastEntry = snapshot.chronicle.at(-1);
  const mobileMovement = snapshot.mode === 'world' || snapshot.mode === 'interior';

  return (
    <main className="game-shell">
      <header className="topbar">
        <div className="brand-lockup">
          <span className="brand-mark" aria-hidden="true">TA</span>
          <div>
            <p className="eyebrow">Tag {snapshot.day} · {snapshot.phaseLabel}</p>
            <strong>{snapshot.clockLabel}</strong>
          </div>
        </div>
        <div className="metric-strip" aria-label="Wochenendwerte">
          <Metric label="Würde" value={snapshot.metrics.dignity} />
          <Metric label="Chaos" value={snapshot.metrics.chaos} />
          <Metric label="Ruf" value={snapshot.metrics.reputation} />
          <Metric label="Lauf" value={snapshot.metrics.momentum} signed />
        </div>
        <button className="relation-button" type="button" onClick={() => setRelationshipsOpen(true)}>
          Beziehungen
          <span>{knownRelationships(snapshot)}/{RELATIONSHIP_CHARACTERS.length}</span>
        </button>
        <div className="mode-chip">{modeName(snapshot.mode)}</div>
        <div className="topbar-actions">
          <button className="quiet-button" type="button" onClick={() => gameStore.replayIntro()}>▶ Intro</button>
          <button className="quiet-button" type="button" onClick={() => gameStore.reset()}>↺ Neustart</button>
        </div>
      </header>

      <section className="objective-bar">
        <span className="quest-seal" aria-hidden="true">!</span>
        <div>
          <p className="eyebrow">{snapshot.activeQuest ? QUESTS[snapshot.activeQuest]?.title : 'Freies Spiel'}</p>
          <strong>{snapshot.currentObjective}</strong>
        </div>
        <span className={`condition-chip condition-${conditionTone(snapshot.conditionLabel)}`}>
          {snapshot.conditionLabel}
        </span>
      </section>

      <section className="needs-panel" aria-label="Statuswerte">
        {needLabels.map(([key, label, icon]) => (
          <div className={`need ${needWarning(key, snapshot.needs[key]) ? 'need-warning' : ''}`} key={key}>
            <div className="need-label">
              <span><i aria-hidden="true">{icon}</i>{label}</span>
              <span>{Math.round(snapshot.needs[key])}</span>
            </div>
            <div className="need-track">
              <div className={`need-fill need-${key}`} style={{ width: `${snapshot.needs[key]}%` }} />
            </div>
          </div>
        ))}
      </section>

      <section className="game-frame">
        <div className="game-host" ref={gameHostRef} />
        {mobileMovement && !snapshot.encounter && (
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
          <span>
            {snapshot.team.length
              ? snapshot.team.map((member) => `${member.name} · ${member.role}`).join(' | ')
              : 'Noch keine Begleiter'}
          </span>
          {lastEntry && <small className={`chronicle-${lastEntry.tone}`}>{lastEntry.text}</small>}
        </div>
      </footer>

      {snapshot.encounter && <EncounterPanel snapshot={snapshot} />}
      {relationshipsOpen && (
        <RelationshipsPanel snapshot={snapshot} onClose={() => setRelationshipsOpen(false)} />
      )}
    </main>
  );
}

function OpeningCrawl(): ReactElement {
  const [paused, setPaused] = useState(false);
  return (
    <main className={`crawl-page ${paused ? 'crawl-paused' : ''}`}>
      <div className="stars stars-near" />
      <div className="stars stars-far" />
      <button className="crawl-skip" type="button" onClick={() => gameStore.completeIntro()}>
        Überspringen
      </button>
      <section className="crawl-stage" aria-label="Einleitung">
        <div className="crawl-copy">
          <p className="crawl-episode">WOCHENENDE I</p>
          <h1>TALES OF THE<br />BLAUE ADRIA</h1>
          <p>Es ist eine Zeit relativer Ruhe. Ein friedlicher Campingplatz liegt an einem blauen See und ahnt noch nichts.</p>
          <p>Neun Freunde nähern sich mit Zelten, 25 Euro Einkaufsbudget und einem Selbstvertrauen, das durch keinerlei Erfahrung gestützt wird.</p>
          <p>Am Haupttor wachen GUNDULA, Hüterin des Klemmbretts, und ULI, Vermesser schiefer Reifen. Noch ist die Schranke geschlossen.</p>
          <p>Nur wer sich anmeldet, ordentlich einparkt und seine erste schlechte Entscheidung glaubwürdig verkauft, erreicht das Lager.</p>
          <p>Dort warten Freunde, Rivalen, Plastikbecher und die leise Hoffnung, am Sonntag mit Restwürde wieder abzureisen&nbsp;…</p>
        </div>
      </section>
      <div className="crawl-actions">
        <button className="quiet-button crawl-pause" type="button" onClick={() => setPaused((value) => !value)}>
          {paused ? 'Weiterlaufen' : 'Text anhalten'}
        </button>
        <button className="primary-button crawl-start" type="button" onClick={() => gameStore.completeIntro()}>
          Wochenende beginnen
        </button>
      </div>
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
            <p>{snapshot.profile?.name}, dein Einkauf verändert Gespräche, Erholung und die Chancen am geschlossenen Tor.</p>
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
              <div><strong>{item.label}</strong><small>{item.price} €</small></div>
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
              Für {total} € einkaufen und losfahren
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
          <p className="eyebrow">Entscheidung · Zustand und Beziehungen wirken mit</p>
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
                      <span><strong>{option.label}</strong><small>{option.hint}</small></span>
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
    '--shorts': profile.shorts,
  }) as CSSProperties, [profile]);
  const update = <K extends keyof PlayerProfile>(key: K, value: PlayerProfile[K]): void => {
    setProfile((current) => ({ ...current, [key]: value }));
  };

  return (
    <main className="creator-page">
      <section className="creator-card creator-card-expanded">
        <div className="creator-copy">
          <p className="eyebrow">Freitag · 07:00 Uhr</p>
          <h1>Wer fährt da eigentlich hin?</h1>
          <p>Baue deine Figur und wähle ein Merkmal. Aussehen ist Geschmackssache; dein Merkmal verändert Gespräche, Duelle und Minispiele.</p>
          <label className="name-field">
            Name
            <input value={profile.name} maxLength={18} onChange={(event) => update('name', event.target.value)} />
          </label>

          <CreatorSection title="Körperbau">
            <ChoiceButtons
              value={profile.bodyType}
              options={[
                ['schmal', 'Schmal'],
                ['normal', 'Normal'],
                ['breit', 'Breit'],
              ]}
              onChange={(value) => update('bodyType', value as BodyType)}
            />
          </CreatorSection>
          <CreatorSection title="Haare">
            <ChoiceButtons
              value={profile.hairStyle}
              options={[
                ['kurz', 'Kurz'],
                ['welle', 'Welle'],
                ['buzz', 'Buzz'],
                ['cap', 'Cap'],
              ]}
              onChange={(value) => update('hairStyle', value as HairStyle)}
            />
          </CreatorSection>
          <CreatorSection title="Accessoire">
            <ChoiceButtons
              value={profile.accessory}
              options={[
                ['keins', 'Keins'],
                ['brille', 'Brille'],
                ['bart', 'Bart'],
                ['ohrring', 'Ohrring'],
              ]}
              onChange={(value) => update('accessory', value as Accessory)}
            />
          </CreatorSection>
          <div className="palette-grid">
            <ColorField label="Haut" value={profile.skinTone} palette={['#f8d4ba', '#efc09b', '#c98d68', '#8f5d42', '#5e3c2d']} onChange={(value) => update('skinTone', value)} />
            <ColorField label="Haare" value={profile.hair} palette={['#251b16', '#49301f', '#8a5835', '#d2a75e', '#6e2630']} onChange={(value) => update('hair', value)} />
            <ColorField label="Oberteil" value={profile.shirt} palette={['#e3b74f', '#4fa68a', '#4f84bf', '#b76169', '#9a66b6']} onChange={(value) => update('shirt', value)} />
            <ColorField label="Hose" value={profile.shorts} palette={['#263b47', '#2f4938', '#594333', '#493757', '#733833']} onChange={(value) => update('shorts', value)} />
          </div>
        </div>

        <div className="creator-side">
          <div className="preview-panel preview-panel-large">
            <CharacterPreview profile={profile} style={previewStyle} />
            <p>{profile.name || 'Deine Figur'}</p>
            <span>{traitDescription(profile.trait)}</span>
          </div>
          <div className="trait-picker">
            <p className="eyebrow">Startmerkmal</p>
            {(Object.keys(traitInfo) as Trait[]).map((trait) => (
              <button
                type="button"
                key={trait}
                className={profile.trait === trait ? 'trait-card trait-card-active' : 'trait-card'}
                onClick={() => update('trait', trait)}
              >
                <strong>{traitInfo[trait].label}</strong>
                <small>{traitInfo[trait].short}</small>
              </button>
            ))}
          </div>
          <button
            className="primary-button"
            type="button"
            disabled={!profile.name.trim()}
            onClick={() => gameStore.setProfile({ ...profile, name: profile.name.trim() })}
          >
            Figur übernehmen
          </button>
        </div>
      </section>
    </main>
  );
}

function CreatorSection({ title, children }: { title: string; children: ReactElement }): ReactElement {
  return <section className="creator-section"><span>{title}</span>{children}</section>;
}

function ChoiceButtons({
  value,
  options,
  onChange,
}: {
  value: string;
  options: Array<[string, string]>;
  onChange: (value: string) => void;
}): ReactElement {
  return (
    <div className="choice-row">
      {options.map(([id, label]) => (
        <button type="button" className={value === id ? 'choice-active' : ''} key={id} onClick={() => onChange(id)}>
          {label}
        </button>
      ))}
    </div>
  );
}

function ColorField({
  label,
  value,
  palette,
  onChange,
}: {
  label: string;
  value: string;
  palette: string[];
  onChange: (value: string) => void;
}): ReactElement {
  return (
    <div className="color-field">
      <span>{label}</span>
      <div>
        {palette.map((color) => (
          <button
            type="button"
            key={color}
            className={value === color ? 'swatch swatch-active' : 'swatch'}
            style={{ backgroundColor: color }}
            aria-label={`${label} ${color}`}
            onClick={() => onChange(color)}
          />
        ))}
        <input type="color" value={value} aria-label={`${label} frei wählen`} onChange={(event) => onChange(event.target.value)} />
      </div>
    </div>
  );
}

function CharacterPreview({ profile, style }: { profile: PlayerProfile; style: CSSProperties }): ReactElement {
  return (
    <div
      className={`character-preview body-${profile.bodyType} hair-${profile.hairStyle} accessory-${profile.accessory}`}
      style={style}
      aria-label="Vorschau der Spielfigur"
    >
      <div className="preview-ear preview-ear-left" />
      <div className="preview-ear preview-ear-right" />
      <div className="preview-head"><i className="preview-eye left-eye" /><i className="preview-eye right-eye" /></div>
      <div className="preview-hair" />
      <div className="preview-accessory" />
      <div className="preview-shirt" />
      <div className="preview-arms"><span /><span /></div>
      <div className="preview-legs"><span /><span /></div>
    </div>
  );
}

function RelationshipsPanel({ snapshot, onClose }: { snapshot: GameSnapshot; onClose: () => void }): ReactElement {
  return (
    <div className="relationship-overlay" role="dialog" aria-modal="true" aria-labelledby="relationships-title">
      <section className="relationship-panel">
        <header>
          <div>
            <p className="eyebrow">Soziales Schadensbild</p>
            <h2 id="relationships-title">Beziehungen</h2>
          </div>
          <button className="quiet-button" type="button" onClick={onClose}>Schließen</button>
        </header>
        <p className="relationship-explainer">Werte reichen von −100 bis +100. Gespräche, Hilfe, Siege und Desaster verändern sie dauerhaft.</p>
        <div className="relationship-grid">
          {RELATIONSHIP_CHARACTERS.map((character) => {
            const value = snapshot.relationships[character.id] ?? 0;
            const known = Boolean(snapshot.flags[`met-${character.id}`] || value !== 0);
            return (
              <article className={known ? 'relationship-card' : 'relationship-card relationship-unknown'} key={character.id}>
                <div className="relationship-avatar" style={{ backgroundColor: character.color }}>{known ? character.portrait : '?'}</div>
                <div className="relationship-copy">
                  <strong>{known ? character.name : 'Noch unbekannt'}</strong>
                  <small>{known ? character.nickname : character.group === 'freunde' ? 'Teil der Freundesgruppe' : 'Person auf dem Platz'}</small>
                  <div className="relationship-track">
                    <div style={{ width: `${(value + 100) / 2}%`, backgroundColor: character.color }} />
                    <i />
                  </div>
                </div>
                <div className="relationship-value">
                  <strong>{known ? `${value > 0 ? '+' : ''}${Math.round(value)}` : '—'}</strong>
                  <small>{known ? relationshipLabel(value) : 'Nicht getroffen'}</small>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
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

const traitInfo: Record<Trait, { label: string; short: string; description: string }> = {
  charmant: { label: 'Charmant', short: 'Menschen überzeugen', description: 'Bessere Chancen in freundlichen Dialogen.' },
  direkt: { label: 'Direkt', short: 'Klare Ansagen', description: 'Mehr Nerven in klaren Ansagen und Duellen.' },
  chaotisch: { label: 'Chaotisch', short: 'Risiko eskalieren', description: 'Stärkere riskante Lösungen und Minispiele.' },
  hilfsbereit: { label: 'Hilfsbereit', short: 'Gruppe stärken', description: 'Mehr Wirkung aus Gruppe und Nebenquests.' },
  beobachtend: { label: 'Beobachtend', short: 'Timing lesen', description: 'Mehr Fokus bei Hinweisen und Timing.' },
};

function modeName(mode: GameSnapshot['mode']): string {
  const labels: Record<GameSnapshot['mode'], string> = {
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
  return traitInfo[trait].description;
}

function knownRelationships(snapshot: GameSnapshot): number {
  return RELATIONSHIP_CHARACTERS.filter((character) => (
    snapshot.flags[`met-${character.id}`] || (snapshot.relationships[character.id] ?? 0) !== 0
  )).length;
}

function relationshipLabel(value: number): string {
  if (value <= -50) return 'Feindselig';
  if (value <= -15) return 'Angespannt';
  if (value < 15) return 'Neutral';
  if (value < 40) return 'Sympathisch';
  if (value < 70) return 'Vertraut';
  return 'Unzertrennlich';
}

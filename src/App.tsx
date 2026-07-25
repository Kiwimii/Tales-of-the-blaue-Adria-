import { useEffect, useMemo, useRef, useState } from 'react';
import type Phaser from 'phaser';
import { createGame } from './game/createGame';
import { sendAction, sendDirection } from './game/events';
import { gameStore } from './game/state/GameStore';
import type { Direction, GameSnapshot, PlayerProfile } from './game/types';

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
  ['bladder', 'Pinkeln'],
  ['alcohol', 'Alkohol'],
  ['highness', 'Breitheit'],
];

export default function App(): JSX.Element {
  const [snapshot, setSnapshot] = useState<GameSnapshot>(() => gameStore.snapshot());
  const gameHostRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const hasProfile = Boolean(snapshot.profile);

  useEffect(() => gameStore.subscribe(setSnapshot), []);

  useEffect(() => {
    if (!hasProfile || !gameHostRef.current || gameRef.current) return;
    gameRef.current = createGame(gameHostRef.current);

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, [hasProfile]);

  if (!snapshot.profile) {
    return <CharacterCreator />;
  }

  return (
    <main className="game-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Tag {snapshot.day} · {snapshot.phaseLabel}</p>
          <strong>{snapshot.clockLabel}</strong>
        </div>
        <div className="mode-chip">{modeName(snapshot.mode)}</div>
        <button className="quiet-button" type="button" onClick={() => gameStore.reset()}>
          Neustart
        </button>
      </header>

      <section className="needs-panel" aria-label="Statuswerte">
        {needLabels.map(([key, label]) => (
          <div className="need" key={key}>
            <div className="need-label"><span>{label}</span><span>{Math.round(snapshot.needs[key])}</span></div>
            <div className="need-track"><div className={`need-fill need-${key}`} style={{ width: `${snapshot.needs[key]}%` }} /></div>
          </div>
        ))}
      </section>

      <section className="game-frame">
        <div className="game-host" ref={gameHostRef} />

        {snapshot.mode === 'world' && (
          <div className="mobile-controls" aria-label="Mobile Spielsteuerung">
            <DPad />
            <button className="action-button" type="button" onPointerDown={sendAction}>AKTION</button>
          </div>
        )}
      </section>

      <footer className="bottom-panel">
        <div>
          <p className="eyebrow">Inventar</p>
          <div className="inventory-row">
            {Object.entries(snapshot.inventory).map(([item, count]) => (
              <button key={item} type="button" className="inventory-chip" disabled={count <= 0} onClick={() => gameStore.useItem(item)}>
                {itemName(item)} × {count}
              </button>
            ))}
          </div>
        </div>
        <div className="team-summary">
          <p className="eyebrow">Team</p>
          <strong>{snapshot.profile.name}</strong>
          <span>{snapshot.team.length ? ` + ${snapshot.team.map((member) => member.name).join(', ')}` : ' · noch keine Begleiter'}</span>
        </div>
      </footer>
    </main>
  );
}

function CharacterCreator(): JSX.Element {
  const [profile, setProfile] = useState<PlayerProfile>(defaultProfile);
  const previewStyle = useMemo(() => ({
    '--skin': profile.skinTone,
    '--hair': profile.hair,
    '--shirt': profile.shirt,
  }) as React.CSSProperties, [profile]);

  const update = <K extends keyof PlayerProfile>(key: K, value: PlayerProfile[K]): void => {
    setProfile((current) => ({ ...current, [key]: value }));
  };

  return (
    <main className="creator-page">
      <section className="creator-card">
        <div className="creator-copy">
          <p className="eyebrow">Freitag · 07:00 Uhr</p>
          <h1>Tales of the Blaue Adria</h1>
          <p>Du wachst voller Energie auf. Bevor es zum Campingplatz geht, musst du deine Figur erstellen, packen und mit begrenztem Budget einkaufen.</p>

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
            Wochenende starten
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

function DPad(): JSX.Element {
  const button = (direction: Direction, label: string, className: string): JSX.Element => (
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
  return 'Erstellung';
}

function itemName(item: string): string {
  const names: Record<string, string> = {
    wasser: 'Wasser',
    wuerste: 'Würste',
    bier: 'Bier',
    batida: 'Batida de Coco',
  };
  return names[item] ?? item;
}

function traitDescription(trait: PlayerProfile['trait']): string {
  const descriptions: Record<PlayerProfile['trait'], string> = {
    charmant: 'Bessere Chancen in freundlichen Dialogen.',
    direkt: 'Klare Antworten wirken überzeugender.',
    chaotisch: 'Zusätzliche absurde Lösungswege.',
    hilfsbereit: 'Mehr Vorteile aus Nebenquests.',
    beobachtend: 'Findet leichter versteckte Hinweise.',
  };
  return descriptions[trait];
}

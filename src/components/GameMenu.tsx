import { useEffect, useState } from 'react';
import type { ReactElement } from 'react';
import {
  MAX_EQUIPPED_ATTACKS,
  combatMoveList,
  equippedAttackIds,
  learnedAttackIds,
} from '../game/combatMoves';
import { toggleEquippedAttack } from '../game/combatProgress';
import { ITEMS, RELATIONSHIP_CHARACTERS } from '../game/content';
import { sendToggleMap } from '../game/events';
import { gameStore } from '../game/state/GameStore';
import type { GameSnapshot } from '../game/types';
import {
  NEED_META,
  carriedItemIds,
  conditionTone,
  knownRelationshipCount,
  modeName,
} from '../game/uiState';

type MenuTab = 'overview' | 'inventory' | 'team' | 'attacks' | 'people' | 'system';

interface GameMenuProps {
  snapshot: GameSnapshot;
  onClose: () => void;
}

const moneyFormatter = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
});

const tabs: Array<{ id: MenuTab; label: string; short: string }> = [
  { id: 'overview', label: 'Übersicht', short: 'Status' },
  { id: 'inventory', label: 'Inventar', short: 'Rucksack' },
  { id: 'team', label: 'Charakter', short: 'Team' },
  { id: 'attacks', label: 'Attacken', short: 'Kampf' },
  { id: 'people', label: 'Beziehungen', short: 'Leute' },
  { id: 'system', label: 'Spiel', short: 'Mehr' },
];

export function GameMenu({ snapshot, onClose }: GameMenuProps): ReactElement {
  const [tab, setTab] = useState<MenuTab>('overview');

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      event.stopImmediatePropagation();
      onClose();
    };
    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, [onClose]);

  return (
    <div className="game-menu-overlay" role="dialog" aria-modal="true" aria-labelledby="game-menu-title">
      <section className="game-menu-panel">
        <header className="game-menu-header">
          <div>
            <p className="eyebrow">Tag {snapshot.day} · {snapshot.phaseLabel} · {modeName(snapshot.mode)}</p>
            <h2 id="game-menu-title">{snapshot.clockLabel} Uhr</h2>
          </div>
          <button className="dialog-x-button" type="button" aria-label="Spielmenü schließen" onClick={onClose}>×</button>
        </header>

        <nav className="game-menu-tabs" aria-label="Spielmenü Bereiche">
          {tabs.map((entry) => (
            <button
              type="button"
              key={entry.id}
              className={tab === entry.id ? 'game-menu-tab game-menu-tab-active' : 'game-menu-tab'}
              aria-pressed={tab === entry.id}
              onClick={() => setTab(entry.id)}
            >
              <span>{entry.label}</span>
              <small>{entry.short}</small>
            </button>
          ))}
        </nav>

        <div className="game-menu-content">
          {tab === 'overview' && <OverviewTab snapshot={snapshot} />}
          {tab === 'inventory' && <InventoryTab snapshot={snapshot} />}
          {tab === 'team' && <TeamTab snapshot={snapshot} />}
          {tab === 'attacks' && <AttacksTab snapshot={snapshot} />}
          {tab === 'people' && <PeopleTab snapshot={snapshot} />}
          {tab === 'system' && <SystemTab onClose={onClose} />}
        </div>
      </section>
    </div>
  );
}

function OverviewTab({ snapshot }: { snapshot: GameSnapshot }): ReactElement {
  return (
    <div className="menu-stack">
      <section className="menu-highlight-card">
        <p className="eyebrow">Aktuelles Ziel</p>
        <strong>{snapshot.currentObjective}</strong>
        <span className={`condition-chip condition-${conditionTone(snapshot.conditionLabel)}`}>{snapshot.conditionLabel}</span>
      </section>

      <section>
        <h3>Wochenendwerte</h3>
        <div className="menu-metric-grid">
          <MenuMetric label="Würde" value={snapshot.metrics.dignity} />
          <MenuMetric label="Chaos" value={snapshot.metrics.chaos} />
          <MenuMetric label="Ruf" value={snapshot.metrics.reputation} />
          <MenuMetric label="Lauf" value={snapshot.metrics.momentum} signed />
        </div>
      </section>

      <section>
        <h3>Körperzustand</h3>
        <div className="menu-needs-grid">
          {NEED_META.map((meta) => {
            const value = Math.round(snapshot.needs[meta.key]);
            const danger = meta.direction === 'high' ? value >= meta.warningAt : value <= meta.warningAt;
            return (
              <article className={danger ? 'menu-need menu-need-warning' : 'menu-need'} key={meta.key}>
                <div><span>{meta.icon} {meta.label}</span><strong>{value}</strong></div>
                <div className="menu-need-track"><i className={`need-${meta.key}`} style={{ width: `${value}%` }} /></div>
              </article>
            );
          })}
        </div>
      </section>

      <section>
        <h3>Letzte Ereignisse</h3>
        <div className="menu-chronicle">
          {snapshot.chronicle.length ? snapshot.chronicle.slice(-6).reverse().map((entry, index) => (
            <p className={`chronicle-${entry.tone}`} key={`${entry.text}-${index}`}>{entry.text}</p>
          )) : <p>Noch keine Einträge.</p>}
        </div>
      </section>
    </div>
  );
}

function InventoryTab({ snapshot }: { snapshot: GameSnapshot }): ReactElement {
  const itemIds = carriedItemIds(snapshot);
  return (
    <div className="menu-stack">
      <section className="menu-highlight-card menu-inline-summary">
        <div><p className="eyebrow">Reserve</p><strong>{moneyFormatter.format(snapshot.money)}</strong></div>
        <div><p className="eyebrow">Gegenstände</p><strong>{itemIds.length}</strong></div>
      </section>
      <section>
        <h3>Rucksack</h3>
        <div className="menu-inventory-grid">
          {itemIds.length ? itemIds.map((id) => {
            const item = ITEMS[id];
            const count = snapshot.inventory[id] ?? 0;
            const usable = Boolean(item?.effects);
            return (
              <article className="menu-inventory-item" key={id}>
                <span className="menu-item-icon">{item?.icon ?? '□'}</span>
                <div><strong>{item?.label ?? id}</strong><small>{item?.description ?? 'Questgegenstand'}</small></div>
                <b>× {count}</b>
                <button type="button" disabled={!usable} onClick={() => gameStore.useItem(id)}>
                  {usable ? 'Benutzen' : 'Questgegenstand'}
                </button>
              </article>
            );
          }) : <p>Der Rucksack ist leer. Das ist auf einem Campingplatz selten ein gutes Zeichen.</p>}
        </div>
      </section>
    </div>
  );
}

function TeamTab({ snapshot }: { snapshot: GameSnapshot }): ReactElement {
  return (
    <div className="menu-stack">
      <section className="menu-highlight-card">
        <p className="eyebrow">Spielfigur</p>
        <strong>{snapshot.profile?.name ?? 'Unbekannt'}</strong>
        <span>{snapshot.profile?.trait ?? 'ohne Merkmal'} · aktives Team {snapshot.team.length}/3</span>
      </section>
      <section>
        <h3>Aktive Begleiter</h3>
        <div className="menu-team-list">
          {snapshot.team.length ? snapshot.team.map((member) => (
            <article key={member.id}>
              <div><strong>{member.name}</strong><small>{member.role}</small></div>
              <span>Level {member.level} · Moral {Math.round(member.resolve)}/{Math.round(member.maxResolve)} · Loyalität {Math.round(member.loyalty)}</span>
              <small>Kampf +{member.bonuses.battle} · Sozial +{member.bonuses.social} · Spiele +{member.bonuses.games} · Erholung +{member.bonuses.recovery}</small>
            </article>
          )) : <p>Noch keine Begleiter aktiv. Freunde lassen sich über Gespräche in die Gruppe holen.</p>}
        </div>
      </section>
    </div>
  );
}

function AttacksTab({ snapshot }: { snapshot: GameSnapshot }): ReactElement {
  const [feedback, setFeedback] = useState('');
  const learned = learnedAttackIds(snapshot);
  const equipped = equippedAttackIds(snapshot);
  const moves = combatMoveList();

  const toggle = (id: typeof moves[number]['id']): void => {
    const result = toggleEquippedAttack(gameStore, id);
    setFeedback(result.ok
      ? result.equipped ? 'Attacke ausgerüstet.' : 'Attacke abgelegt.'
      : result.reason ?? 'Änderung nicht möglich.');
  };

  return (
    <div className="menu-stack">
      <section className="menu-highlight-card">
        <p className="eyebrow">Kampfset</p>
        <strong>{equipped.length}/{MAX_EQUIPPED_ATTACKS} Attacken ausgerüstet</strong>
        <span>Im Kampf steigen Frustpunkte. Wer sein Maximum erreicht, verliert.</span>
        <div className="menu-attack-slots">
          {Array.from({ length: MAX_EQUIPPED_ATTACKS }, (_, index) => (
            <span key={index}>{equipped[index] ? `${index + 1}. ${moves.find((move) => move.id === equipped[index])?.shortLabel}` : `${index + 1}. FREI`}</span>
          ))}
        </div>
        {feedback && <small className="menu-attack-feedback">{feedback}</small>}
      </section>

      <section>
        <h3>Gelernte Attacken</h3>
        <div className="menu-attack-grid">
          {moves.filter((move) => learned.includes(move.id)).map((move) => {
            const active = equipped.includes(move.id);
            return (
              <article className={active ? 'menu-attack-card menu-attack-card-active' : 'menu-attack-card'} key={move.id}>
                <div><strong>{move.label}</strong><small>{move.tag.toUpperCase()} · Genauigkeit {move.accuracy}% · Basisfrust {move.baseFrustration}</small></div>
                <p>{move.description}</p>
                <small>Flirtoption: {move.flirtOption}</small>
                <button type="button" onClick={() => toggle(move.id)}>{active ? 'Ablegen' : 'Ausrüsten'}</button>
              </article>
            );
          })}
        </div>
      </section>

      <section>
        <h3>Noch zu lernen</h3>
        <div className="menu-attack-grid">
          {moves.filter((move) => !learned.includes(move.id)).map((move) => (
            <article className="menu-attack-card menu-attack-card-locked" key={move.id}>
              <div><strong>{move.label}</strong><small>{move.unlockTitle}</small></div>
              <p>{move.unlockDetail}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function PeopleTab({ snapshot }: { snapshot: GameSnapshot }): ReactElement {
  return (
    <div className="menu-stack">
      <section className="menu-highlight-card menu-inline-summary">
        <div><p className="eyebrow">Bekannt</p><strong>{knownRelationshipCount(snapshot)}/{RELATIONSHIP_CHARACTERS.length}</strong></div>
        <div><p className="eyebrow">Aktivteam</p><strong>{snapshot.team.length}/3</strong></div>
      </section>
      <section>
        <h3>Beziehungen</h3>
        <div className="menu-relationship-grid">
          {RELATIONSHIP_CHARACTERS.map((character) => {
            const value = snapshot.relationships[character.id] ?? 0;
            const known = Boolean(snapshot.flags[`met-${character.id}`] || value !== 0);
            return (
              <article className={known ? 'menu-person' : 'menu-person menu-person-unknown'} key={character.id}>
                <span className="menu-person-avatar" style={{ backgroundColor: character.color }}>{known ? character.portrait : '?'}</span>
                <div>
                  <strong>{known ? character.name : 'Noch unbekannt'}</strong>
                  <small>{known ? character.nickname : character.group === 'freunde' ? 'Teil der Freundesgruppe' : 'Person auf dem Platz'}</small>
                  <div className="menu-relation-track"><i style={{ width: `${(value + 100) / 2}%`, backgroundColor: character.color }} /></div>
                </div>
                <b>{known ? `${value > 0 ? '+' : ''}${Math.round(value)}` : '—'}</b>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function SystemTab({ onClose }: { onClose: () => void }): ReactElement {
  const restart = (): void => {
    if (!window.confirm('Den gesamten lokalen Spielstand wirklich löschen und neu starten?')) return;
    onClose();
    gameStore.reset();
  };
  const replayIntro = (): void => {
    onClose();
    gameStore.replayIntro();
  };
  const toggleMap = (): void => {
    sendToggleMap();
    onClose();
  };
  return (
    <div className="menu-stack">
      <section>
        <h3>Ansicht</h3>
        <div className="menu-action-list">
          <button type="button" onClick={toggleMap}><strong>Platzplan umschalten</strong><small>Öffnet oder schließt die Minikarte in der Weltansicht.</small></button>
        </div>
      </section>
      <section>
        <h3>Spiel</h3>
        <div className="menu-action-list">
          <button type="button" onClick={replayIntro}><strong>Intro erneut ansehen</strong><small>Der Spielstand bleibt erhalten.</small></button>
          <button className="menu-danger-action" type="button" onClick={restart}><strong>Neustart</strong><small>Löscht den lokalen Spielstand nach einer Sicherheitsabfrage.</small></button>
        </div>
      </section>
    </div>
  );
}

function MenuMetric({ label, value, signed = false }: { label: string; value: number; signed?: boolean }): ReactElement {
  return <article><small>{label}</small><strong>{signed && value > 0 ? '+' : ''}{Math.round(value)}</strong></article>;
}

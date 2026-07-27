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

const tabs: Array<{ id: MenuTab; label: string; short: string; icon: string }> = [
  { id: 'overview', label: 'Übersicht', short: 'Status', icon: '◎' },
  { id: 'inventory', label: 'Inventar', short: 'Rucksack', icon: '▣' },
  { id: 'team', label: 'Charakter', short: 'Gruppe', icon: '♟' },
  { id: 'attacks', label: 'Attacken', short: 'Kampfset', icon: '⚡' },
  { id: 'people', label: 'Beziehungen', short: 'Kontakte', icon: '●' },
  { id: 'system', label: 'Spiel', short: 'Optionen', icon: '⚙' },
];

export function GameMenu({ snapshot, onClose }: GameMenuProps): ReactElement {
  const [tab, setTab] = useState<MenuTab>('overview');

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopImmediatePropagation();
        onClose();
        return;
      }
      const target = event.target;
      if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement) return;
      if (/^[1-6]$/.test(event.key)) {
        event.preventDefault();
        setTab(tabs[Number(event.key) - 1].id);
        return;
      }
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      setTab((current) => {
        const index = tabs.findIndex((entry) => entry.id === current);
        const direction = event.key === 'ArrowRight' ? 1 : -1;
        return tabs[(index + direction + tabs.length) % tabs.length].id;
      });
    };
    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, [onClose]);

  return (
    <div className="game-menu-overlay" role="dialog" aria-modal="true" aria-labelledby="game-menu-title">
      <section className="game-menu-panel">
        <header className="game-menu-header">
          <div className="game-menu-title-block">
            <p className="eyebrow">Tag {snapshot.day} · {snapshot.phaseLabel} · {modeName(snapshot.mode)}</p>
            <h2 id="game-menu-title">{snapshot.clockLabel} Uhr</h2>
            <span className={`game-menu-condition condition-${conditionTone(snapshot.conditionLabel)}`}>{snapshot.conditionLabel}</span>
          </div>
          <button className="dialog-x-button" type="button" aria-label="Spielmenü schließen" onClick={onClose}>×</button>
        </header>

        <nav className="game-menu-tabs" aria-label="Spielmenü Bereiche">
          {tabs.map((entry, index) => {
            const badge = menuBadge(entry.id, snapshot);
            return (
              <button
                type="button"
                key={entry.id}
                className={tab === entry.id ? 'game-menu-tab game-menu-tab-active' : 'game-menu-tab'}
                aria-pressed={tab === entry.id}
                aria-keyshortcuts={`${index + 1}`}
                onClick={() => setTab(entry.id)}
              >
                <i aria-hidden="true">{entry.icon}</i>
                <span>{entry.label}</span>
                <small>{entry.short}</small>
                {badge && <b>{badge}</b>}
              </button>
            );
          })}
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
      <section className="menu-highlight-card menu-objective-card">
        <div>
          <p className="eyebrow">Aktuelles Ziel</p>
          <strong>{snapshot.currentObjective}</strong>
        </div>
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
          }) : <p className="menu-empty-state">Der Rucksack ist leer. Das ist auf einem Campingplatz selten ein gutes Zeichen.</p>}
        </div>
      </section>
    </div>
  );
}

function TeamTab({ snapshot }: { snapshot: GameSnapshot }): ReactElement {
  return (
    <div className="menu-stack">
      <section className="menu-highlight-card menu-inline-summary">
        <div><p className="eyebrow">Spielfigur</p><strong>{snapshot.profile?.name ?? 'Unbekannt'}</strong><small>{snapshot.profile?.trait ?? 'ohne Merkmal'}</small></div>
        <div><p className="eyebrow">Aktives Team</p><strong>{snapshot.team.length}/3</strong><small>Begleiter</small></div>
      </section>
      <section>
        <h3>Aktive Begleiter</h3>
        <div className="menu-team-list">
          {snapshot.team.length ? snapshot.team.map((member) => (
            <article key={member.id}>
              <div className="menu-team-heading"><div><strong>{member.name}</strong><small>{member.role}</small></div><b>Level {member.level}</b></div>
              <div className="menu-team-stat"><span>Moral</span><strong>{Math.round(member.resolve)}/{Math.round(member.maxResolve)}</strong><i><em style={{ width: `${Math.min(100, member.resolve / member.maxResolve * 100)}%` }} /></i></div>
              <div className="menu-team-bonuses"><span>Kampf +{member.bonuses.battle}</span><span>Sozial +{member.bonuses.social}</span><span>Spiele +{member.bonuses.games}</span><span>Erholung +{member.bonuses.recovery}</span></div>
            </article>
          )) : <p className="menu-empty-state">Noch keine Begleiter aktiv. Freunde lassen sich über Gespräche in die Gruppe holen.</p>}
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
            <span className={equipped[index] ? 'menu-attack-slot-filled' : ''} key={index}>{equipped[index] ? `${index + 1}. ${moves.find((move) => move.id === equipped[index])?.shortLabel}` : `${index + 1}. FREI`}</span>
          ))}
        </div>
        {feedback && <small className="menu-attack-feedback" role="status">{feedback}</small>}
      </section>

      <section>
        <h3>Gelernte Attacken</h3>
        <div className="menu-attack-grid">
          {moves.filter((move) => learned.includes(move.id)).map((move) => {
            const active = equipped.includes(move.id);
            return (
              <article className={active ? 'menu-attack-card menu-attack-card-active' : 'menu-attack-card'} key={move.id}>
                <div><strong>{move.label}</strong><small>{move.tag.toUpperCase()}</small></div>
                <div className="menu-attack-stats"><span>Treffer {move.accuracy}%</span><span>Frust {move.baseFrustration}</span></div>
                <p>{move.description}</p>
                <small>Flirtoption: {move.flirtOption}</small>
                <button type="button" aria-pressed={active} onClick={() => toggle(move.id)}>{active ? 'Ablegen' : 'Ausrüsten'}</button>
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
          <button type="button" onClick={toggleMap}><span aria-hidden="true">⌖</span><div><strong>Platzplan umschalten</strong><small>Öffnet oder schließt die Minikarte in der Weltansicht.</small></div></button>
        </div>
      </section>
      <section>
        <h3>Spiel</h3>
        <div className="menu-action-list">
          <button type="button" onClick={replayIntro}><span aria-hidden="true">▶</span><div><strong>Intro erneut ansehen</strong><small>Der Spielstand bleibt erhalten.</small></div></button>
          <button className="menu-danger-action" type="button" onClick={restart}><span aria-hidden="true">↺</span><div><strong>Neustart</strong><small>Löscht den lokalen Spielstand nach einer Sicherheitsabfrage.</small></div></button>
        </div>
      </section>
    </div>
  );
}

function menuBadge(tab: MenuTab, snapshot: GameSnapshot): string | null {
  if (tab === 'inventory') return String(carriedItemIds(snapshot).length);
  if (tab === 'team') return `${snapshot.team.length}/3`;
  if (tab === 'attacks') return `${equippedAttackIds(snapshot).length}/${MAX_EQUIPPED_ATTACKS}`;
  if (tab === 'people') return String(knownRelationshipCount(snapshot));
  return null;
}

function MenuMetric({ label, value, signed = false }: { label: string; value: number; signed?: boolean }): ReactElement {
  return <article><small>{label}</small><strong>{signed && value > 0 ? '+' : ''}{Math.round(value)}</strong></article>;
}

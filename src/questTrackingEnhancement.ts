import { QUESTS } from './game/content';
import {
  TRACKED_QUEST_CHANGED_EVENT,
  activeQuestIds,
  currentTrackedQuestId,
  questTrackingTarget,
  setTrackedQuestId,
} from './game/questTracking';
import { gameStore } from './game/state/GameStore';
import type { GameSnapshot } from './game/types';

const ROOT_CLASS = 'quest-tracking-panel';

export function installQuestTrackingEnhancement(): () => void {
  if (typeof window === 'undefined' || typeof MutationObserver === 'undefined') return () => undefined;

  let snapshot = gameStore.snapshot();
  let scheduled = 0;
  const render = (): void => {
    window.cancelAnimationFrame(scheduled);
    scheduled = window.requestAnimationFrame(() => {
      updateQuestHud(snapshot);
      mountQuestPicker(snapshot);
    });
  };

  const observer = new MutationObserver(render);
  observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
  const unsubscribe = gameStore.subscribe((next) => {
    snapshot = next;
    render();
  });
  const onTrackedChanged = (): void => render();
  window.addEventListener(TRACKED_QUEST_CHANGED_EVENT, onTrackedChanged);
  render();

  return () => {
    observer.disconnect();
    unsubscribe();
    window.cancelAnimationFrame(scheduled);
    window.removeEventListener(TRACKED_QUEST_CHANGED_EVENT, onTrackedChanged);
  };
}

function updateQuestHud(snapshot: GameSnapshot): void {
  const target = questTrackingTarget(snapshot);
  if (!target) return;
  const card = document.querySelector<HTMLElement>('.play-objective-card');
  if (!card) return;
  const title = card.querySelector<HTMLElement>('small');
  const objective = card.querySelector<HTMLElement>('strong');
  if (title) title.textContent = target.title;
  if (objective) objective.textContent = target.objective;

  let destination = card.querySelector<HTMLElement>('.quest-hud-destination');
  if (!destination) {
    destination = document.createElement('em');
    destination.className = 'quest-hud-destination';
    card.querySelector('span')?.append(destination);
  }
  destination.textContent = `ZIEL · ${target.targetLabel}`;
}

function mountQuestPicker(snapshot: GameSnapshot): void {
  const menu = document.querySelector<HTMLElement>('.game-menu-panel');
  if (!menu) return;
  const activeTab = menu.querySelector<HTMLElement>('.game-menu-tab-active');
  const overviewActive = activeTab?.textContent?.includes('Übersicht') || activeTab?.textContent?.includes('Status');
  if (!overviewActive) return;

  const content = menu.querySelector<HTMLElement>('.game-menu-content .menu-stack');
  if (!content) return;
  content.querySelector(`.${ROOT_CLASS}`)?.remove();

  const ids = activeQuestIds(snapshot);
  const tracked = currentTrackedQuestId(snapshot);
  const panel = document.createElement('section');
  panel.className = ROOT_CLASS;
  panel.setAttribute('aria-labelledby', 'quest-tracking-title');

  const heading = document.createElement('div');
  heading.className = 'quest-tracking-heading';
  heading.innerHTML = '<div><p class="eyebrow">Zielfindung</p><h3 id="quest-tracking-title">Laufende Quests</h3></div><span>Auf der Karte verfolgen</span>';
  panel.append(heading);

  if (!ids.length) {
    const empty = document.createElement('p');
    empty.className = 'quest-tracking-empty';
    empty.textContent = 'Zurzeit ist keine Quest aktiv. Erkunde den Platz und sprich mit den Personen.';
    panel.append(empty);
    content.prepend(panel);
    return;
  }

  const list = document.createElement('div');
  list.className = 'quest-tracking-list';
  for (const id of ids) {
    const definition = QUESTS[id];
    const target = questTrackingTarget(snapshot, id);
    if (!definition || !target) continue;
    const button = document.createElement('button');
    const selected = id === tracked;
    button.type = 'button';
    button.className = selected ? 'quest-tracking-choice quest-tracking-choice-active' : 'quest-tracking-choice';
    button.setAttribute('aria-pressed', String(selected));
    button.innerHTML = `
      <span class="quest-tracking-icon" aria-hidden="true">${selected ? '⌖' : '○'}</span>
      <div>
        <strong>${escapeHtml(definition.title)}</strong>
        <small>${escapeHtml(target.objective)}</small>
        <em>${escapeHtml(target.targetLabel)}</em>
      </div>
      <b>${selected ? 'VERFOLGT' : 'AUSWÄHLEN'}</b>
    `;
    button.addEventListener('click', () => {
      setTrackedQuestId(id, snapshot);
      mountQuestPicker(gameStore.snapshot());
      updateQuestHud(gameStore.snapshot());
    });
    list.append(button);
  }
  panel.append(list);
  content.prepend(panel);
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
  })[character] ?? character);
}

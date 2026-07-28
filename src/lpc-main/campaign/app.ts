import Phaser from 'phaser';
import { GameStore, type StorageAdapter } from '../../game/state/GameStore';
import { FRIEND_IDS, ITEMS, RELATIONSHIP_CHARACTERS } from '../../game/content';
import { activeStatuses } from '../../game/statusSystem';
import { COMBAT_MOVES, COMBAT_OPPONENTS, type CombatOpponentId } from '../../game/combatMoves';
import type { CombatMoveId, GameSnapshot, PlayerProfile } from '../../game/types';
import { campaignMeta, type CampaignMetaState, type RomanceId } from './metaStore';
import { INTRO_BEATS, CASHIER_LINES, SHOP_REACTIONS, seededLine } from './narrative';
import { dialogueChoices, dialogueOpening, resolveDialogueAction, type DialogueAction } from './dialogue';
import { battlePrediction, createBattle, resolveBattleTurn, type BattleState } from './battleEngine';
import { MinigameDirector, type MiniGameId, type MiniGameOutcome } from './minigames';
import { createCampaignGame, type CampaignWorldHooks, type NearbyCampaignTarget } from './worldScene';
import { CAMPAIGN_CHARACTER_BY_ID } from './content';
import {
  addCampaignChronicle,
  adjustCampaignMetrics,
  adjustCampaignNeeds,
  consumeCampaignItem,
  setCampaignFlag,
} from './storeBridge';
import type { CampaignAnimation } from './actors';
import './styles.css';

const SAVE_KEY = 'tales-blaue-adria-lpc-main-v1';

class NamespacedStorage implements StorageAdapter {
  constructor(private readonly key: string) {}
  getItem(): string | null { return localStorage.getItem(this.key); }
  setItem(_key: string, value: string): void { localStorage.setItem(this.key, value); }
  removeItem(): void { localStorage.removeItem(this.key); }
}

const store = new GameStore(new NamespacedStorage(SAVE_KEY));
let baseSnapshot = store.snapshot();
let metaSnapshot = campaignMeta.snapshot();
let game: Phaser.Game | undefined;
let minigames: MinigameDirector | undefined;
let activeBattle: BattleState | undefined;
let activeBattleTarget: CombatOpponentId | undefined;
let activeDialogueId = '';
let currentPosition = { x: baseSnapshot.worldPosition.x, y: baseSnapshot.worldPosition.y, region: 'arrival' };
let nearestTarget: NearbyCampaignTarget | undefined;
let introTimer = 0;
let introIndex = 0;
let cart: Record<string, number> = {};

const root = document.getElementById('app');
if (!root) throw new Error('Missing LPC campaign app root');

root.innerHTML = shellHtml();

const ui = {
  intro: element<HTMLElement>('campaign-intro'),
  introVisual: element<HTMLElement>('intro-visual'),
  introKicker: element<HTMLElement>('intro-kicker'),
  introTitle: element<HTMLElement>('intro-title'),
  introLines: element<HTMLElement>('intro-lines'),
  introProgress: element<HTMLElement>('intro-progress'),
  introBack: element<HTMLButtonElement>('intro-back'),
  introNext: element<HTMLButtonElement>('intro-next'),
  introSkip: element<HTMLButtonElement>('intro-skip'),
  creator: element<HTMLElement>('campaign-creator'),
  shop: element<HTMLElement>('campaign-shop'),
  gameShell: element<HTMLElement>('campaign-game'),
  gameMount: element<HTMLElement>('campaign-world'),
  objectiveTitle: element<HTMLElement>('objective-title'),
  objectiveText: element<HTMLElement>('objective-text'),
  objectiveDistance: element<HTMLElement>('objective-distance'),
  time: element<HTMLElement>('time-label'),
  region: element<HTMLElement>('region-label'),
  money: element<HTMLElement>('money-label'),
  statuses: element<HTMLElement>('status-list'),
  needs: element<HTMLElement>('needs-list'),
  metrics: element<HTMLElement>('metrics-list'),
  inventory: element<HTMLElement>('inventory-list'),
  relationships: element<HTMLElement>('relationship-list'),
  romance: element<HTMLElement>('romance-list'),
  team: element<HTMLElement>('team-list'),
  attacks: element<HTMLElement>('attack-list'),
  chronicle: element<HTMLElement>('chronicle-list'),
  prompt: element<HTMLElement>('interaction-prompt'),
  promptText: element<HTMLElement>('interaction-text'),
  score: element<HTMLElement>('weekend-score'),
  minimap: element<HTMLCanvasElement>('minimap'),
  toast: element<HTMLElement>('toast'),
  modal: element<HTMLElement>('generic-modal'),
  modalTitle: element<HTMLElement>('modal-title'),
  modalKicker: element<HTMLElement>('modal-kicker'),
  modalCopy: element<HTMLElement>('modal-copy'),
  modalOptions: element<HTMLElement>('modal-options'),
  modalClose: element<HTMLButtonElement>('modal-close'),
  battle: element<HTMLElement>('battle-modal'),
  battleTitle: element<HTMLElement>('battle-title'),
  battleRound: element<HTMLElement>('battle-round'),
  battlePlayerBar: element<HTMLElement>('battle-player-bar'),
  battleEnemyBar: element<HTMLElement>('battle-enemy-bar'),
  battlePlayerValue: element<HTMLElement>('battle-player-value'),
  battleEnemyValue: element<HTMLElement>('battle-enemy-value'),
  battlePlayerStatuses: element<HTMLElement>('battle-player-statuses'),
  battleEnemyStatuses: element<HTMLElement>('battle-enemy-statuses'),
  battleMoves: element<HTMLElement>('battle-moves'),
  battleLog: element<HTMLElement>('battle-log'),
  battleClose: element<HTMLButtonElement>('battle-close'),
  mini: element<HTMLElement>('minigame-modal'),
};

store.subscribe((snapshot) => {
  baseSnapshot = snapshot;
  renderFlow();
  if (!ui.gameShell.hidden) renderHud();
});
campaignMeta.subscribe((snapshot) => {
  metaSnapshot = snapshot;
  renderFlow();
  if (!ui.gameShell.hidden) renderHud();
});

bindStaticEvents();
renderFlow();

function renderFlow(): void {
  clearIntroTimer();
  if (!metaSnapshot.introSeen) {
    showOnly(ui.intro);
    renderIntroBeat();
    scheduleIntro();
    return;
  }
  if (!baseSnapshot.profile) {
    showOnly(ui.creator);
    renderCreatorPreview();
    return;
  }
  if (!baseSnapshot.prologue.shoppingComplete) {
    showOnly(ui.shop);
    renderShop();
    return;
  }
  showOnly(ui.gameShell);
  startGame();
}

function showOnly(active: HTMLElement): void {
  for (const node of [ui.intro, ui.creator, ui.shop, ui.gameShell]) node.hidden = node !== active;
}

function renderIntroBeat(): void {
  const beat = INTRO_BEATS[introIndex];
  ui.introVisual.dataset.visual = beat.visual;
  ui.introKicker.textContent = beat.kicker;
  ui.introTitle.textContent = beat.title;
  ui.introLines.innerHTML = beat.lines.map((line, index) => `<p style="--line:${index}">${escapeHtml(line)}</p>`).join('');
  ui.introProgress.innerHTML = INTRO_BEATS.map((entry, index) => `<button type="button" data-intro-index="${index}" class="${index === introIndex ? 'active' : ''}" aria-label="${escapeHtml(entry.title)}"></button>`).join('');
  ui.introProgress.querySelectorAll<HTMLButtonElement>('[data-intro-index]').forEach((button) => button.addEventListener('click', () => {
    introIndex = Number(button.dataset.introIndex) || 0;
    clearIntroTimer(); renderIntroBeat(); scheduleIntro();
  }));
  ui.introBack.disabled = introIndex === 0;
  ui.introNext.textContent = introIndex === INTRO_BEATS.length - 1 ? 'Wochenende beginnen' : 'Weiter';
}

function scheduleIntro(): void {
  introTimer = window.setTimeout(() => {
    if (introIndex < INTRO_BEATS.length - 1) { introIndex += 1; renderIntroBeat(); scheduleIntro(); }
  }, INTRO_BEATS[introIndex].duration);
}

function clearIntroTimer(): void { if (introTimer) window.clearTimeout(introTimer); introTimer = 0; }

function completeIntro(): void {
  clearIntroTimer();
  campaignMeta.markIntroSeen();
  if (!baseSnapshot.prologue.introSeen) store.completeIntro();
}

function renderCreatorPreview(): void {
  const preview = element<HTMLElement>('creator-preview');
  const name = inputValue('player-name') || 'André';
  const body = inputValue('body-type') || 'normal';
  const hair = inputValue('hair-style') || 'kurz';
  const accessory = inputValue('accessory') || 'keins';
  preview.innerHTML = `<div class="preview-person body-${body} hair-${hair} accessory-${accessory}"><i></i><b></b><span></span></div><strong>${escapeHtml(name)}</strong><small>${escapeHtml(inputValue('trait') || 'charmant')} · zukünftiger Mitverursacher</small>`;
}

function saveProfile(): void {
  const profile: PlayerProfile = {
    name: inputValue('player-name').trim() || 'André',
    skinTone: inputValue('skin-tone') || '#d9a67e',
    hair: inputValue('hair-color') || '#4a3224',
    shirt: inputValue('shirt-color') || '#e5ad43',
    shorts: inputValue('shorts-color') || '#294954',
    hairStyle: selectValue<PlayerProfile['hairStyle']>('hair-style', 'kurz'),
    bodyType: selectValue<PlayerProfile['bodyType']>('body-type', 'normal'),
    accessory: selectValue<PlayerProfile['accessory']>('accessory', 'keins'),
    trait: selectValue<PlayerProfile['trait']>('trait', 'charmant'),
  };
  store.setProfile(profile);
  window.dispatchEvent(new CustomEvent('lpc-campaign-profile', { detail: profile }));
}

function renderShop(): void {
  const itemGrid = element<HTMLElement>('shop-items');
  const total = shopTotal();
  const remaining = 25 - total;
  element<HTMLElement>('shop-budget').textContent = `${remaining} €`;
  element<HTMLElement>('shop-budget').classList.toggle('negative', remaining < 0);
  element<HTMLElement>('cashier-line').textContent = seededLine(CASHIER_LINES, total + Object.values(cart).reduce((sum, count) => sum + count, 0));
  itemGrid.innerHTML = Object.values(ITEMS).map((item) => {
    const amount = cart[item.id] ?? 0;
    const reaction = seededLine(SHOP_REACTIONS[item.id] ?? [item.description], amount + total + item.id.length);
    return `<article class="shop-item ${amount ? 'selected' : ''}">
      <div class="shop-item-head"><span>${item.icon}</span><div><strong>${escapeHtml(item.label)}</strong><small>${item.price} €</small></div></div>
      <p>${escapeHtml(reaction)}</p>
      <footer><button type="button" data-shop="${item.id}" data-delta="-1" ${amount <= 0 ? 'disabled' : ''}>−</button><b>${amount}</b><button type="button" data-shop="${item.id}" data-delta="1" ${amount >= item.max ? 'disabled' : ''}>+</button></footer>
    </article>`;
  }).join('');
  itemGrid.querySelectorAll<HTMLButtonElement>('[data-shop]').forEach((button) => button.addEventListener('click', () => {
    const id = button.dataset.shop ?? '';
    const delta = Number(button.dataset.delta) || 0;
    cart[id] = Math.max(0, Math.min(ITEMS[id]?.max ?? 0, (cart[id] ?? 0) + delta));
    renderShop();
  }));
  const finish = element<HTMLButtonElement>('shop-finish');
  finish.disabled = remaining < 0 || total <= 0;
  finish.textContent = total > 0 ? `Für ${total} € bezahlen und losfahren` : 'Mindestens eine Fehlentscheidung kaufen';
}

function finishShop(): void {
  const result = store.completeShopping(cart);
  const error = element<HTMLElement>('shop-error');
  if (!result.ok) { error.textContent = result.error ?? 'Der Einkauf wurde selbst von der Kasse abgelehnt.'; return; }
  error.textContent = '';
  campaignMeta.setStage('arrival', `Für ${result.total} € eingekauft. ${25 - result.total} € bleiben für Situationen, die offiziell nicht vorgesehen sind.`);
  window.dispatchEvent(new CustomEvent('lpc-campaign-teleport', { detail: { x: 900, y: 1600 } }));
}

function startGame(): void {
  if (game) return;
  const hooks: CampaignWorldHooks = {
    getSnapshot: augmentedSnapshot,
    onInteract: handleWorldInteraction,
    onNearby: (target) => {
      nearestTarget = target;
      ui.prompt.hidden = !target || isModalOpen();
      if (target) ui.promptText.textContent = target.kind === 'character' ? `${target.label} ansprechen` : target.label;
    },
    onPosition: (x, y, region) => {
      currentPosition = { x, y, region };
      store.setWorldPosition(x, y);
      drawMinimap();
    },
  };
  game = createCampaignGame(ui.gameMount, hooks);
  minigames = new MinigameDirector(ui.mini, handleMinigameOutcome);
  if (metaSnapshot.questStage === 'arrival') window.setTimeout(() => window.dispatchEvent(new CustomEvent('lpc-campaign-teleport', { detail: { x: 900, y: 1600 } })), 650);
  renderHud();
}

function augmentedSnapshot(): GameSnapshot { return campaignMeta.augmentSnapshot(baseSnapshot); }

function renderHud(): void {
  const snapshot = augmentedSnapshot();
  const objective = campaignMeta.objective();
  ui.objectiveTitle.textContent = objective.title;
  ui.objectiveText.textContent = objective.text;
  const target = targetPosition(objective.targetId);
  ui.objectiveDistance.textContent = target ? `${Math.round(Math.hypot(target.x - currentPosition.x, target.y - currentPosition.y))} m` : '';
  ui.time.textContent = `Tag ${snapshot.day} · ${snapshot.clockLabel} · ${snapshot.phaseLabel}`;
  ui.region.textContent = regionLabel(currentPosition.region);
  ui.money.textContent = `${snapshot.money} €`;
  ui.score.textContent = String(metaSnapshot.weekendScore);
  ui.statuses.innerHTML = activeStatuses(snapshot.needs).map((status) => `<span style="--status:#${status.color.toString(16).padStart(6, '0')}" title="${escapeHtml(status.description)}">${escapeHtml(status.shortLabel)}</span>`).join('') || '<span class="stable">STABIL</span>';
  ui.needs.innerHTML = [
    ['Energie', snapshot.needs.energy, false], ['Hunger', snapshot.needs.hunger, true], ['Durst', snapshot.needs.thirst, true],
    ['Blase', snapshot.needs.bladder, true], ['Alkohol', snapshot.needs.alcohol, true], ['Breit', snapshot.needs.highness, true],
    ['Kater', snapshot.needs.hangover, true], ['Mut', snapshot.needs.courage, false],
  ].map(([label, value, inverse]) => meterHtml(String(label), Number(value), Boolean(inverse))).join('');
  ui.metrics.innerHTML = [
    ['Würde', snapshot.metrics.dignity], ['Chaos', snapshot.metrics.chaos], ['Ruf', snapshot.metrics.reputation], ['Momentum', snapshot.metrics.momentum + 50],
  ].map(([label, value]) => meterHtml(String(label), Number(value), label === 'Chaos')).join('');
  ui.inventory.innerHTML = Object.values(ITEMS).map((item) => {
    const count = snapshot.inventory[item.id] ?? 0;
    return `<button type="button" data-item="${item.id}" ${count <= 0 || !item.effects ? 'disabled' : ''}><span>${item.icon}</span><strong>${escapeHtml(item.label)}</strong><small>${count}×</small></button>`;
  }).join('');
  ui.inventory.querySelectorAll<HTMLButtonElement>('[data-item]').forEach((button) => button.addEventListener('click', () => useItem(button.dataset.item ?? '')));
  ui.relationships.innerHTML = RELATIONSHIP_CHARACTERS.map((person) => {
    const met = Boolean(snapshot.flags[`met-${person.id}`]);
    const relation = snapshot.relationships[person.id] ?? 0;
    return `<button type="button" data-focus="${person.id}" class="${met ? 'met' : ''}"><span style="--portrait:${person.color}">${person.portrait}</span><div><strong>${escapeHtml(person.name)}</strong><small>${met ? `${signed(relation)} Beziehung` : 'noch nicht gefunden'}</small></div></button>`;
  }).join('');
  ui.relationships.querySelectorAll<HTMLButtonElement>('[data-focus]').forEach((button) => button.addEventListener('click', () => window.dispatchEvent(new CustomEvent('lpc-campaign-focus', { detail: button.dataset.focus }))));
  ui.romance.innerHTML = (['susi', 'jule', 'kira'] as RomanceId[]).map((id) => {
    const state = metaSnapshot.romance[id];
    const name = CAMPAIGN_CHARACTER_BY_ID[id]?.name ?? id;
    return `<div><strong>${escapeHtml(name)}</strong><span>${Math.round(state.interest)} Interesse</span><i style="width:${Math.max(0, state.interest)}%"></i><small>${state.lastLine ? escapeHtml(state.lastLine) : 'Noch kein romantisch verwertbarer Vorgang.'}</small></div>`;
  }).join('');
  ui.team.innerHTML = metaSnapshot.activeTeam.length
    ? metaSnapshot.activeTeam.map((id) => `<button type="button" data-team-remove="${id}"><strong>${escapeHtml(CAMPAIGN_CHARACTER_BY_ID[id]?.name ?? id)}</strong><small>aktiv · entfernen</small></button>`).join('')
    : '<p>Noch kein aktives Team. Drei Plätze, neun mögliche Ausreden.</p>';
  ui.team.querySelectorAll<HTMLButtonElement>('[data-team-remove]').forEach((button) => button.addEventListener('click', () => campaignMeta.setActiveTeam(metaSnapshot.activeTeam.filter((id) => id !== button.dataset.teamRemove))));
  ui.attacks.innerHTML = metaSnapshot.learnedAttacks.map((id) => {
    const move = COMBAT_MOVES[id];
    const equipped = metaSnapshot.equippedAttacks.includes(id);
    return `<button type="button" data-attack-toggle="${id}" class="${equipped ? 'equipped' : ''}"><strong>${escapeHtml(move.shortLabel)}</strong><small>${equipped ? 'ausgerüstet' : 'gelernt'}</small></button>`;
  }).join('');
  ui.attacks.querySelectorAll<HTMLButtonElement>('[data-attack-toggle]').forEach((button) => button.addEventListener('click', () => campaignMeta.toggleAttack(button.dataset.attackToggle as CombatMoveId)));
  ui.chronicle.innerHTML = [metaSnapshot.lastEvent, ...snapshot.chronicle.slice(-4).reverse().map((entry) => entry.text)].filter(Boolean).map((text, index) => `<p class="${index === 0 ? 'latest' : ''}">${escapeHtml(text)}</p>`).join('');
  drawMinimap();
}

function handleWorldInteraction(target: NearbyCampaignTarget): void {
  if (isModalOpen()) return;
  if (target.kind === 'character') { handleCharacter(target.id); return; }
  const id = target.id;
  if (id === 'trunk') {
    if (metaSnapshot.questStage !== 'arrival') return toast('Der Kofferraum ist bereits offen. Sein Inhalt bleibt trotzdem vorwurfsvoll.');
    campaignMeta.setStage('reservation', 'Der Kofferraum öffnet sich. Zelte, Getränke und Kabel warten auf eine Hierarchie, die niemand vorbereitet hat.');
    store.advanceMinutes(4); animate(undefined, 'carry'); toast('Nächster Schritt: Reservierung am Schwarzen Brett suchen.'); return;
  }
  if (id === 'reservationBoard') { openReservationPuzzle(); return; }
  if (id === 'gundula') { startAuthoritySequence(); return; }
  if (id === 'taucherplatz') {
    if (!metaSnapshot.authorityBattleWon) return toast('Die Schranke bleibt geschlossen. Uli nennt das „physikalische Verwaltung“. ');
    campaignMeta.setStage('power', 'Der Wagen erreicht den Taucherplatz. Der Stromkasten wirkt, als hätte er das kommen sehen.');
    store.advanceMinutes(8); toast('Verbinde jetzt Stromkasten und Kabeltrommel.'); return;
  }
  if (id === 'powerBox') {
    if (!metaSnapshot.authorityBattleWon) return toast('Ohne Einlass kein Strom. Ohne Strom immerhin auch keine schlechte Musik.');
    if (metaSnapshot.powerConnected) return toast('Der Strom läuft. Das Kabel bleibt als Stolperfalle im Metagame.');
    campaignMeta.connectPower(); setCampaignFlag(store, 'powerConnected'); store.advanceMinutes(9); animate(undefined, 'carry'); toast('Strom verbunden. Getränke, Zelte und Kabel ausladen.'); return;
  }
  if (id === 'drinks' || id === 'tents' || id === 'cable') {
    if (!metaSnapshot.powerConnected) return toast('Erst Strom herstellen. Die Reihenfolge ist unlogisch, aber questtechnisch verbindlich.');
    const key = id as 'drinks' | 'tents' | 'cable';
    if (metaSnapshot.unloading[key]) return toast('Bereits ausgeladen. Niemand trägt es freiwillig ein zweites Mal.');
    campaignMeta.markUnloaded(key); store.advanceMinutes(key === 'tents' ? 10 : 6); adjustCampaignNeeds(store, { energy: key === 'tents' ? -5 : -2 }); animate(undefined, 'carry'); return;
  }
  if (id === 'firstBeer') { openFirstBeer(); return; }
  if (id === 'homeTent') { store.rest(60); animate(undefined, 'sit'); toast('Eine Stunde im Zelt. Energie steigt, Zeit und soziale Kontrolle sinken.'); return; }
  if (id === 'sanitary') { store.relieve(); animate(undefined, 'cheer'); toast('Sanitär erreicht. Die Würde erhält eine kurze Vertragsverlängerung.'); return; }
  if (id === 'hedge') { startMinigame('hedgePee'); return; }
  if (id === 'campfire') { openTeamAndAttackPanel(); return; }
  if (id === 'noticeBoard') { openQuestBoard(); return; }
  if (id === 'flipCup') { startMinigame('flipCup'); return; }
  if (id === 'beerPong') { startMinigame('beerPong'); return; }
  if (id === 'flunkyball') { startMinigame('flunkyball'); return; }
  if (id === 'maslHole') { startMinigame('maslHole'); return; }
  if (id === 'ronnyBattle') { startBattle('ronny'); }
}

function handleCharacter(id: string): void {
  if (id === 'gundula' || id === 'uli') {
    if (metaSnapshot.questStage === 'authority' && !metaSnapshot.authorityBattleWon) { startAuthoritySequence(); return; }
  }
  if (id === 'ronny' && !metaSnapshot.flags.ronnyDefeated) {
    openGeneric('RIVALENKONTAKT', 'Rivalen-Ronny', dialogueOpening(id, augmentedSnapshot(), metaSnapshot), [
      optionButton('Das Frustduell beginnen', 'Ronny lässt sich nur durch vollständige argumentative Erschöpfung überzeugen.', () => startBattle('ronny'), 'danger'),
      optionButton('Erst normal mit ihm reden', 'Kann Beziehungen und später die Logik-Attacke freischalten.', () => openDialogue(id)),
    ]); return;
  }
  if (id === 'manni' && !metaSnapshot.flags.paperGiven) {
    const hasPaper = (baseSnapshot.inventory.klopapier ?? 0) > 0;
    openGeneric('SANITÄRE NOTLAGE', 'Manni Mische', 'Manni steht vor dem Sanitärgebäude mit der Miene eines Mannes, dessen Zukunft von zweilagigem Papier abhängt.', [
      optionButton('Klopapier überreichen', hasPaper ? 'Verbraucht 1× Klopapier · sehr hohe Loyalitätswirkung' : 'Nicht im Inventar', () => giveManniPaper(), 'team', !hasPaper),
      optionButton('Das Gespräch auf später verschieben', 'Manni wird diese Entscheidung nicht sachlich erinnern.', () => openDialogue(id)),
    ]); return;
  }
  openDialogue(id);
}

function openDialogue(id: string): void {
  const visual = CAMPAIGN_CHARACTER_BY_ID[id];
  if (!visual) return;
  activeDialogueId = id;
  store.socialize(id);
  const snapshot = augmentedSnapshot();
  const count = campaignMeta.conversation(id);
  const opening = dialogueOpening(id, snapshot, { ...metaSnapshot, conversationCounts: { ...metaSnapshot.conversationCounts, [id]: count } });
  const choices = dialogueChoices(id, snapshot, campaignMeta.snapshot());
  animate(id, visual.greetingAnimation === 'talk' ? 'talk' : 'wave');
  openGeneric(visual.role, visual.name, opening, choices.map((choice) => optionButton(choice.label, choice.hint, () => resolveDialogue(id, choice.action), choice.tone, choice.disabled)));
}

function resolveDialogue(id: string, action: DialogueAction): void {
  if (action.type === 'leave') { closeGeneric(); return; }
  const snapshot = augmentedSnapshot();
  const resolution = resolveDialogueAction(id, action, snapshot);
  if (resolution.minutes) store.advanceMinutes(resolution.minutes);
  if (resolution.relationship) campaignMeta.addRelationship(id, resolution.relationship, resolution.text);
  if (resolution.consumeItem) consumeCampaignItem(store, resolution.consumeItem);
  if (resolution.learnedAttack) campaignMeta.learnAttack(resolution.learnedAttack, `Neue Attacke: ${COMBAT_MOVES[resolution.learnedAttack].label}.`);
  if (action.type === 'flirt') campaignMeta.recordFlirt(id as RomanceId, Boolean(resolution.success), resolution.romanceDelta ?? 0, resolution.text);
  if (action.type === 'gift' && resolution.romanceDelta !== undefined) campaignMeta.recordFlirt(id as RomanceId, resolution.relationship > 0, resolution.romanceDelta, resolution.text);
  if (resolution.recruit) {
    const next = [...metaSnapshot.activeTeam.filter((member) => member !== id), id].slice(-3);
    campaignMeta.setActiveTeam(next);
  }
  animate(id, action.type === 'flirt' ? (resolution.success ? 'flirt' : 'shrug') : resolution.success ? 'talk' : 'stagger');
  animate(undefined, action.type === 'flirt' ? (resolution.success ? 'flirt' : 'stagger') : resolution.success ? 'talk' : 'shrug');
  openGeneric(resolution.success === false ? 'DAS WAR NICHT IDEAL' : 'GESPRÄCHSFOLGE', CAMPAIGN_CHARACTER_BY_ID[id]?.name ?? id, resolution.text, [optionButton('Weiterreden', 'Neue Optionen und Reihenfolge', () => openDialogue(id)), optionButton('Gespräch beenden', 'Zurück auf den Platz', closeGeneric)]);
}

function giveManniPaper(): void {
  if (!consumeCampaignItem(store, 'klopapier')) return;
  campaignMeta.setFlag('paperGiven', true, 'Manni erhält Klopapier. Seine Loyalität steigt schneller als jede andere Beziehung des Tages.');
  campaignMeta.addRelationship('manni', 18);
  campaignMeta.setActiveTeam([...metaSnapshot.activeTeam, 'manni'].slice(-3));
  setCampaignFlag(store, 'met-manni');
  adjustCampaignMetrics(store, { reputation: 4, dignity: 3, momentum: 5 }, 'Die braune Krise wurde durch vorausschauenden Einkauf beendet.');
  animate('manni', 'cheer'); animate(undefined, 'highfive');
  openGeneric('QUEST ABGESCHLOSSEN', 'Die braune Krise', 'Manni nimmt das Klopapier entgegen, als würdest du ihm die Schlüssel zu einer besseren Zukunft geben. Er tritt deinem aktiven Team bei.', [optionButton('Zurück zum Wochenende', 'Manni ist jetzt als Begleiter aktiv.', closeGeneric, 'team')]);
}

function openReservationPuzzle(): void {
  if (metaSnapshot.reservationSolved) { toast('Reservierung bereits gefunden. Der Zettel hat seine Schuldigkeit getan.'); return; }
  if (metaSnapshot.questStage === 'arrival') return toast('Erst den Kofferraum öffnen. Der Plot besteht auf einer Reihenfolge.');
  const entries = [
    { name: 'Jäckels / Taucherplatz', detail: '9 Personen · Wagen am Versorgungsrand', correct: true },
    { name: 'Jäckel / Dauerplatz Nord', detail: '2 Personen · Wohnwagen mit Satellitenschüssel', correct: false },
    { name: 'Jakobs / Bucht', detail: 'Familie · Ruhebereich · ausdrücklich ohne Musik', correct: false },
    { name: 'Jägers / Festwiese', detail: 'Verein · Pavillon · unklare Haftung', correct: false },
  ].sort(() => Math.random() - .5);
  openGeneric('RESERVIERUNGSRÄTSEL', 'Die Liste der ähnlichen Namen', 'Gundula hat nach Nachnamen sortiert. Teilweise. Finde die Reservierung für die Gruppe am Taucherplatz.', entries.map((entry) => optionButton(entry.name, entry.detail, () => {
    if (entry.correct) {
      campaignMeta.solveReservation(); store.advanceMinutes(5); animate(undefined, 'point');
      openGeneric('GEFUNDEN', 'Jäckels / Taucherplatz', 'Die Reservierung existiert tatsächlich. Das ist der bislang unrealistischste Erfolg des Tages. Jetzt zu Gundula und Uli.', [optionButton('Zur Rezeption', 'Der Frustkampf wartet.', closeGeneric)]);
    } else {
      adjustCampaignMetrics(store, { momentum: -1, chaos: 1 }); store.advanceMinutes(2);
      toast('Falscher Eintrag. Immerhin weißt du jetzt, wer ausdrücklich keine Musik hören möchte.');
    }
  })));
}

function startAuthoritySequence(): void {
  if (!metaSnapshot.reservationSolved) { toast('Ohne gefundene Reservierung zerlegt Gundula dich bereits vor Kampfbeginn.'); return; }
  if (metaSnapshot.authorityBattleWon) { openDialogue('gundula'); return; }
  const snapshot = augmentedSnapshot();
  const lines = [
    snapshot.needs.alcohol >= 38 ? 'Gundula riecht den Pegel. Uli misst vorsorglich den Abstand zwischen dir und jeder glaubwürdigen Aussage.' : 'Gundula hält die Reservierung gegen das Licht. Uli hält währenddessen deine Parkabsicht für unbewiesen.',
    metaSnapshot.suspicion > 30 ? 'Uli erkennt dich aus einem früheren Heckenprotokoll. Das Gespräch startet mit einem unnötigen Aktenvorsprung.' : 'Die Reservierung stimmt. Jetzt fehlen nur Anmeldung, Parkordnung und eine vollständige charakterliche Prüfung.',
  ];
  openGeneric('INTRO-KAMPF', 'Gundula & Uli', seededLine(lines, snapshot.minutes + metaSnapshot.suspicion), [
    optionButton('Den Frustkampf beginnen', 'Gemeinsamer Gegner · Zustände, Team und Attacken wirken mit.', () => startBattle('entry-authority'), 'danger'),
    optionButton('Noch schnell etwas trinken', 'Kann Mut erhöhen, Präzision aber ruinieren.', () => { closeGeneric(); toast('Nutze ein Getränk aus dem Inventar und sprich sie erneut an.'); }),
  ]);
  animate('gundula', 'point'); animate('uli', 'carry');
}

function startBattle(opponentId: CombatOpponentId): void {
  closeGeneric();
  activeBattleTarget = opponentId;
  activeBattle = createBattle(opponentId);
  ui.battle.hidden = false;
  markModalState();
  animate(opponentId === 'entry-authority' ? 'gundula' : 'ronny', 'argue');
  if (opponentId === 'entry-authority') animate('uli', 'point');
  renderBattle();
}

function renderBattle(): void {
  if (!activeBattle || !activeBattleTarget) return;
  const opponent = COMBAT_OPPONENTS[activeBattleTarget];
  ui.battleTitle.textContent = `${opponent.name} · ${opponent.title}`;
  ui.battleRound.textContent = `Runde ${activeBattle.round}`;
  const playerPercent = activeBattle.player.frustration / activeBattle.player.maxFrustration * 100;
  const enemyPercent = activeBattle.enemy.frustration / activeBattle.enemy.maxFrustration * 100;
  ui.battlePlayerBar.style.width = `${playerPercent}%`;
  ui.battleEnemyBar.style.width = `${enemyPercent}%`;
  ui.battlePlayerValue.textContent = `${Math.round(activeBattle.player.frustration)} / ${activeBattle.player.maxFrustration}`;
  ui.battleEnemyValue.textContent = `${Math.round(activeBattle.enemy.frustration)} / ${activeBattle.enemy.maxFrustration}`;
  ui.battlePlayerStatuses.textContent = activeBattle.player.statuses.map((status) => `${status.id} ${status.turns}`).join(' · ') || 'keine Kampfzustände';
  ui.battleEnemyStatuses.textContent = activeBattle.enemy.statuses.map((status) => `${status.id} ${status.turns}`).join(' · ') || 'keine Kampfzustände';
  ui.battleLog.innerHTML = activeBattle.log.slice().reverse().map((line, index) => `<p class="${index === 0 ? 'latest' : ''}">${escapeHtml(line)}</p>`).join('');
  if (activeBattle.finished) {
    ui.battleMoves.innerHTML = `<div class="battle-finish ${activeBattle.won ? 'won' : 'lost'}"><strong>${activeBattle.won ? 'GEWONNEN' : 'RÜCKZUG'}</strong><p>${activeBattle.won ? 'Die Gegenseite ist vollständig frustriert.' : 'Deine Frustration hat den zulässigen Campingwert überschritten.'}</p></div>`;
    ui.battleClose.hidden = false;
    return;
  }
  ui.battleClose.hidden = true;
  const snapshot = augmentedSnapshot();
  ui.battleMoves.innerHTML = metaSnapshot.equippedAttacks.map((id) => {
    const move = COMBAT_MOVES[id];
    return `<button type="button" data-battle-move="${id}"><strong>${escapeHtml(move.label)}</strong><span>${escapeHtml(move.description)}</span><small>${escapeHtml(battlePrediction(id, activeBattle!, snapshot, metaSnapshot.activeTeam.length + 1))}</small></button>`;
  }).join('');
  ui.battleMoves.querySelectorAll<HTMLButtonElement>('[data-battle-move]').forEach((button) => button.addEventListener('click', () => battleMove(button.dataset.battleMove as CombatMoveId)));
}

function battleMove(moveId: CombatMoveId): void {
  if (!activeBattle || !activeBattleTarget) return;
  const result = resolveBattleTurn(activeBattle, moveId, augmentedSnapshot(), metaSnapshot.activeTeam.length + 1);
  activeBattle = result.state;
  const playerAnimation: CampaignAnimation = moveId === 'classic-high-five' ? 'highfive' : result.animation;
  animate(undefined, playerAnimation);
  const enemyId = activeBattleTarget === 'entry-authority' ? (activeBattle.round % 2 ? 'gundula' : 'uli') : 'ronny';
  animate(enemyId, result.hit ? 'hit' : 'argue');
  adjustCampaignNeeds(store, { energy: -2, thirst: 1 }, 2);
  if (activeBattle.finished) finishBattle(activeBattleTarget, activeBattle.won);
  renderBattle();
}

function finishBattle(opponentId: CombatOpponentId, won: boolean): void {
  if (opponentId === 'entry-authority') {
    if (won) {
      campaignMeta.winAuthorityBattle();
      setCampaignFlag(store, 'gundulaConvinced'); setCampaignFlag(store, 'uliConvinced'); setCampaignFlag(store, 'entryDebateWon');
      campaignMeta.addRelationship('gundula', 10); campaignMeta.addRelationship('uli', 8);
      adjustCampaignMetrics(store, { dignity: 5, reputation: 5, momentum: 8 }, 'Gundula und Uli wurden im Frustkampf überzeugt.');
      animate('gundula', 'stagger'); animate('uli', 'shrug'); animate(undefined, 'cheer');
    } else adjustCampaignMetrics(store, { dignity: -5, chaos: 3, momentum: -6 }, 'Die Verwaltung gewinnt die erste Runde. Die Schranke bleibt geschlossen.');
  } else {
    store.recordActivity('battle', won, won ? 'perfect' : 'failed', won ? 100 : 25);
    campaignMeta.recordMiniGame('ronnyBattle', won, won ? 100 : 25, won ? 'Ronny ist frustriert genug, um dem Team widerwillig Respekt zu zollen.' : 'Ronny besitzt noch Gesprächsenergie. Das ist die eigentliche Niederlage.');
    campaignMeta.setFlag('ronnyDefeated', won);
    if (won) { campaignMeta.addRelationship('ronny', 18); animate('ronny', 'collapse'); }
  }
}

function closeBattle(): void {
  ui.battle.hidden = true;
  activeBattle = undefined; activeBattleTarget = undefined;
  markModalState(); renderHud();
}

function startMinigame(id: MiniGameId): void {
  if (!metaSnapshot.authorityBattleWon && id !== 'hedgePee') return toast('Erst durch die Schranke. Die Minispiele akzeptieren keine Zaungäste.');
  minigames?.start(id);
  markModalState();
  animate(undefined, id === 'flunkyball' ? 'run' : id === 'beerPong' ? 'throw' : id === 'hedgePee' ? 'pee' : id === 'maslHole' ? 'run' : 'carry');
}

function handleMinigameOutcome(outcome: MiniGameOutcome): void {
  if (outcome.needs) adjustCampaignNeeds(store, outcome.needs, outcome.id === 'flunkyball' ? 22 : outcome.id === 'hedgePee' ? 6 : 15);
  if (outcome.id === 'flipCup' || outcome.id === 'beerPong' || outcome.id === 'flunkyball') {
    store.recordActivity(outcome.id, outcome.success, outcome.quality, outcome.score);
    campaignMeta.recordMiniGame(outcome.id, outcome.success, outcome.score, outcome.text);
  } else if (outcome.id === 'hedgePee') {
    campaignMeta.recordHedge(outcome.success, outcome.suspicion ?? 0, outcome.relief ?? 0, outcome.text);
    if (outcome.success) setCampaignFlag(store, 'hedgeRelieved');
  } else {
    campaignMeta.recordMiniGame(outcome.id, outcome.success, outcome.score, outcome.text);
    if (outcome.success) { campaignMeta.setFlag('maslHoleWon'); campaignMeta.addRelationship('masl', 10); adjustCampaignMetrics(store, { reputation: 5, momentum: 7 }); }
  }
  animate(undefined, outcome.success ? 'cheer' : outcome.id === 'hedgePee' ? 'stagger' : 'collapse');
  renderHud();
}

function openFirstBeer(): void {
  if (metaSnapshot.questStage !== 'first-beer' && !metaSnapshot.firstBeerOpened) return toast('Erst vollständig ausladen. Das Bier überwacht die Reihenfolge.');
  if (metaSnapshot.firstBeerOpened) return toast('Das erste Bier ist bereits Geschichte. Weitere Biere sind nur noch Statistik.');
  const hasBeer = (baseSnapshot.inventory.bier ?? 0) > 0;
  if (hasBeer) consumeCampaignItem(store, 'bier');
  else adjustCampaignMetrics(store, { chaos: 3, dignity: -2 });
  adjustCampaignNeeds(store, { alcohol: hasBeer ? 16 : 9, bladder: 12, courage: 6 }, 4);
  campaignMeta.openFirstBeer(); setCampaignFlag(store, 'firstBeerOpened');
  animate(undefined, 'drink'); animate('lars', 'cheer');
  openGeneric('ANKUNFTSQUEST ABGESCHLOSSEN', 'Das erste Bier', hasBeer ? 'Der Kronkorken fällt. Der Zeltkreis gilt ab jetzt als gesellschaftlich in Betrieb.' : 'Es war kein eigenes Bier mehr da. Lars stellt kommentarlos eines hin. Deine Versorgungslücke wird später gegen dich verwendet.', [optionButton('Die Gruppe suchen', 'Finde alle Freunde und stelle ein Dreierteam zusammen.', closeGeneric, 'team')]);
}

function openTeamAndAttackPanel(): void {
  const snapshot = augmentedSnapshot();
  const friendChoices = FRIEND_IDS.map((id) => {
    const met = Boolean(snapshot.flags[`met-${id}`]);
    const active = metaSnapshot.activeTeam.includes(id);
    return optionButton(`${active ? '✓ ' : ''}${CAMPAIGN_CHARACTER_BY_ID[id]?.name ?? id}`, met ? (active ? 'Im aktiven Team · entfernen' : 'In das aktive Dreierteam aufnehmen') : 'Noch nicht gefunden', () => {
      if (!met) return;
      const next = active ? metaSnapshot.activeTeam.filter((entry) => entry !== id) : [...metaSnapshot.activeTeam, id].slice(-3);
      campaignMeta.setActiveTeam(next); openTeamAndAttackPanel();
    }, 'team', !met);
  });
  const attackChoices = metaSnapshot.learnedAttacks.map((id) => optionButton(`${metaSnapshot.equippedAttacks.includes(id) ? '✓ ' : ''}${COMBAT_MOVES[id].label}`, COMBAT_MOVES[id].description, () => { campaignMeta.toggleAttack(id); openTeamAndAttackPanel(); }));
  openGeneric('LAGERFEUER-MENÜ', 'Team und Attacken', 'Maximal drei aktive Begleiter und vier ausgerüstete Attacken. Beziehungen, Gespräche, Kämpfe und Minispiele erweitern beide Listen.', [...friendChoices, ...attackChoices]);
}

function openQuestBoard(): void {
  const objective = campaignMeta.objective();
  const mini = Object.entries(metaSnapshot.miniResults).map(([id, result]) => `${id}: ${result.wins}/${result.attempts} Siege · Bestwert ${result.best}`).join('<br>') || 'Noch keine Minispielstatistik.';
  openGeneric('SCHWARZES BRETT', objective.title, `${objective.text}<hr><strong>Wochenend-Meta</strong><br>${mini}<br><br>Heckenverdacht: ${metaSnapshot.suspicion} · Erleichterungen: ${metaSnapshot.reliefCount} · Wochenendwert: ${metaSnapshot.weekendScore}`, [optionButton('Ziel auf Karte markieren', 'Kamera zeigt kurz den relevanten Ort.', () => { window.dispatchEvent(new CustomEvent('lpc-campaign-focus', { detail: objective.targetId })); closeGeneric(); }), optionButton('Schließen', 'Zurück auf den Platz', closeGeneric)]);
}

function openGeneric(kicker: string, title: string, copy: string, options: string[]): void {
  ui.modalKicker.textContent = kicker;
  ui.modalTitle.textContent = title;
  ui.modalCopy.innerHTML = copy;
  ui.modalOptions.innerHTML = options.join('');
  ui.modal.hidden = false;
  ui.modalOptions.querySelectorAll<HTMLButtonElement>('[data-modal-action]').forEach((button) => button.addEventListener('click', () => {
    const index = Number(button.dataset.modalAction);
    modalActions[index]?.();
  }));
  markModalState();
}

let modalActions: Array<() => void> = [];
function optionButton(label: string, hint: string, action: () => void, tone: string = 'normal', disabled = false): string {
  const index = modalActions.push(action) - 1;
  return `<button type="button" data-modal-action="${index}" class="tone-${tone}" ${disabled ? 'disabled' : ''}><strong>${escapeHtml(label)}</strong><small>${escapeHtml(hint)}</small></button>`;
}

function closeGeneric(): void { ui.modal.hidden = true; modalActions = []; activeDialogueId = ''; markModalState(); }
function isModalOpen(): boolean { return !ui.modal.hidden || !ui.battle.hidden || !ui.mini.hidden; }
function markModalState(): void { document.body.classList.toggle('campaign-modal-open', isModalOpen()); ui.prompt.hidden = isModalOpen() || !nearestTarget; }

function useItem(id: string): void {
  if (!store.useItem(id)) return toast('Nicht verfügbar oder nur als Questgegenstand verwendbar.');
  animate(undefined, ['bier', 'batida', 'wasser', 'kaffee'].includes(id) ? 'drink' : 'carry');
  toast(`${ITEMS[id]?.label ?? id} benutzt. Der Körper führt die Buchhaltung.`);
}

function animate(id: string | undefined, animation: CampaignAnimation): void {
  window.dispatchEvent(new CustomEvent('lpc-campaign-animation', { detail: { id, animation } }));
}

function drawMinimap(): void {
  const canvas = ui.minimap; const ctx = canvas.getContext('2d'); if (!ctx) return;
  canvas.width = 330; canvas.height = 230;
  const sx = canvas.width / 2600; const sy = canvas.height / 1800;
  ctx.fillStyle = '#173b31'; ctx.fillRect(0, 0, canvas.width, canvas.height);
  const regions = [
    ['#718b5c', 0, 0, 1950, 1300], ['#707a70', 450, 1300, 950, 500], ['#ccb97f', 1950, 0, 300, 1100], ['#285e78', 2250, 0, 350, 1100], ['#52765b', 1950, 1100, 270, 700], ['#2b6e83', 2220, 1100, 380, 700],
  ] as const;
  for (const [color, x, y, w, h] of regions) { ctx.fillStyle = color; ctx.fillRect(x * sx, y * sy, w * sx, h * sy); }
  ctx.strokeStyle = 'rgba(255,255,255,.18)'; ctx.lineWidth = 1; for (let x = 0; x < canvas.width; x += 45) ctx.beginPath(), ctx.moveTo(x, 0), ctx.lineTo(x, canvas.height), ctx.stroke();
  const objective = targetPosition(campaignMeta.objective().targetId);
  if (objective) { ctx.fillStyle = '#f0c75b'; ctx.beginPath(); ctx.arc(objective.x * sx, objective.y * sy, 6, 0, Math.PI * 2); ctx.fill(); }
  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(currentPosition.x * sx, currentPosition.y * sy, 5, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = '#10261f'; ctx.lineWidth = 2; ctx.stroke();
}

function targetPosition(id: string): { x: number; y: number } | undefined {
  const character = CAMPAIGN_CHARACTER_BY_ID[id]; if (character) return character;
  const targets: Record<string, { x: number; y: number }> = {
    trunk: { x: 900, y: 1600 }, reservationBoard: { x: 1280, y: 1360 }, gundula: { x: 1180, y: 1360 }, taucherplatz: { x: 1240, y: 1170 }, powerBox: { x: 1290, y: 1080 }, drinks: { x: 1130, y: 1210 }, tents: { x: 1110, y: 1020 }, cable: { x: 1210, y: 1090 }, firstBeer: { x: 1100, y: 1170 }, campfire: { x: 470, y: 1110 },
  };
  return targets[id];
}

function bindStaticEvents(): void {
  ui.introBack.addEventListener('click', () => { introIndex = Math.max(0, introIndex - 1); clearIntroTimer(); renderIntroBeat(); scheduleIntro(); });
  ui.introNext.addEventListener('click', () => { if (introIndex >= INTRO_BEATS.length - 1) completeIntro(); else { introIndex += 1; clearIntroTimer(); renderIntroBeat(); scheduleIntro(); } });
  ui.introSkip.addEventListener('click', completeIntro);
  document.querySelectorAll<HTMLInputElement | HTMLSelectElement>('#campaign-creator input, #campaign-creator select').forEach((control) => control.addEventListener('input', renderCreatorPreview));
  element<HTMLButtonElement>('creator-finish').addEventListener('click', saveProfile);
  element<HTMLButtonElement>('shop-recommended').addEventListener('click', () => { cart = { wasser: 2, wuerste: 1, bier: 1, klopapier: 1, chips: 1 }; renderShop(); });
  element<HTMLButtonElement>('shop-finish').addEventListener('click', finishShop);
  ui.modalClose.addEventListener('click', closeGeneric);
  ui.battleClose.addEventListener('click', closeBattle);
  ui.mini.querySelector<HTMLButtonElement>('[data-mini-close]')?.addEventListener('click', () => { window.setTimeout(markModalState); renderHud(); });
  element<HTMLButtonElement>('reset-save').addEventListener('click', () => { store.reset(); campaignMeta.reset(); localStorage.removeItem(SAVE_KEY); location.reload(); });
  element<HTMLButtonElement>('replay-intro').addEventListener('click', () => { campaignMeta.replayIntro(); introIndex = 0; });
  element<HTMLButtonElement>('quick-rest').addEventListener('click', () => { store.rest(60); animate(undefined, 'sit'); });
  element<HTMLButtonElement>('quick-toilet').addEventListener('click', () => { store.relieve(); animate(undefined, 'cheer'); });
  element<HTMLButtonElement>('mobile-action').addEventListener('click', () => window.dispatchEvent(new Event('lpc-campaign-action')));
  document.querySelectorAll<HTMLButtonElement>('[data-direction]').forEach((button) => {
    const send = (active: boolean): void => { window.dispatchEvent(new CustomEvent('lpc-campaign-direction', { detail: { direction: button.dataset.direction, active } })); };
    button.addEventListener('pointerdown', (event) => { event.preventDefault(); button.setPointerCapture(event.pointerId); send(true); });
    button.addEventListener('pointerup', () => send(false)); button.addEventListener('pointercancel', () => send(false)); button.addEventListener('pointerleave', () => send(false));
  });
}

function shopTotal(): number { return Object.entries(cart).reduce((sum, [id, count]) => sum + (ITEMS[id]?.price ?? 0) * count, 0); }
function meterHtml(label: string, value: number, inverse: boolean): string { const normalized = Math.max(0, Math.min(100, value)); const danger = inverse ? normalized >= 70 : normalized <= 30; return `<div class="meter-row ${danger ? 'danger' : ''}"><span>${escapeHtml(label)}</span><div><i style="width:${normalized}%"></i></div><strong>${Math.round(value)}</strong></div>`; }
function signed(value: number): string { return `${value >= 0 ? '+' : ''}${Math.round(value)}`; }
function regionLabel(id: string): string { return ({ arrival: 'Ankunft und Rezeption', north: 'Adria-Klause und Nordplätze', central: 'Taucherplatz und Sanitär', festival: 'Festwiese', woodland: 'Servicehof und Waldsaum', beach: 'Strand und Hauptsteg', cove: 'Ruhige Bucht', campground: 'Campingplatz' } as Record<string, string>)[id] ?? id; }
function toast(message: string): void { ui.toast.textContent = message; ui.toast.classList.add('visible'); window.setTimeout(() => ui.toast.classList.remove('visible'), 3100); }
function inputValue(id: string): string { return (document.getElementById(id) as HTMLInputElement | HTMLSelectElement | null)?.value ?? ''; }
function selectValue<T extends string>(id: string, fallback: T): T { return (inputValue(id) || fallback) as T; }
function element<T extends HTMLElement>(id: string): T { const node = document.getElementById(id); if (!node) throw new Error(`Missing campaign element: ${id}`); return node as T; }
function escapeHtml(value: string): string { return value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character] ?? character); }

function shellHtml(): string {
  return `<section id="campaign-intro" class="intro-page">
    <button id="intro-skip" class="intro-skip" type="button">Intro überspringen</button>
    <div id="intro-visual" class="intro-visual" data-visual="road"><div class="scene-sky"></div><div class="scene-lake"></div><div class="scene-road"></div><div class="scene-car">TA</div><div class="scene-gate"></div><div class="scene-clipboard">§</div><div class="scene-tents"></div></div>
    <article class="intro-copy"><span id="intro-kicker"></span><h1 id="intro-title"></h1><div id="intro-lines"></div><div id="intro-progress" class="intro-progress"></div><footer><button id="intro-back" type="button">Zurück</button><button id="intro-next" type="button">Weiter</button></footer></article>
  </section>
  <section id="campaign-creator" class="creator-page" hidden><article class="creator-card"><div class="creator-copy"><span>LPC CHARAKTERERSTELLUNG</span><h1>Wer trägt die Verantwortung?</h1><p>Niemand. Aber eine Figur braucht das Spiel trotzdem.</p><div id="creator-preview" class="creator-preview"></div></div><div class="creator-form">
    <label>Name<input id="player-name" value="André" maxlength="18"></label><label>Körper<select id="body-type"><option value="normal">Normal</option><option value="schmal">Schmal</option><option value="breit">Breit</option></select></label><label>Frisur<select id="hair-style"><option value="kurz">Kurz</option><option value="welle">Welle</option><option value="buzz">Buzz Cut</option><option value="cap">Cap</option></select></label><label>Accessoire<select id="accessory"><option value="keins">Keins</option><option value="brille">Brille</option><option value="bart">Bart</option><option value="ohrring">Ohrring</option></select></label><label>Eigenschaft<select id="trait"><option value="charmant">Charmant</option><option value="direkt">Direkt</option><option value="chaotisch">Chaotisch</option><option value="hilfsbereit">Hilfsbereit</option><option value="beobachtend">Beobachtend</option></select></label><div class="color-inputs"><label>Haut<input id="skin-tone" type="color" value="#d9a67e"></label><label>Haare<input id="hair-color" type="color" value="#4a3224"></label><label>Shirt<input id="shirt-color" type="color" value="#e5ad43"></label><label>Shorts<input id="shorts-color" type="color" value="#294954"></label></div><button id="creator-finish" class="primary" type="button">Zum Supermarkt</button>
  </div></article></section>
  <section id="campaign-shop" class="shop-page" hidden><article class="shop-shell"><header><div><span>FREITAG · VOR DER ABFAHRT</span><h1>25 Euro. Kein späterer Autosave für Vernunft.</h1><p id="cashier-line"></p></div><div class="shop-budget"><small>Verbleibend</small><strong id="shop-budget">25 €</strong></div></header><div id="shop-items" class="shop-items"></div><footer><button id="shop-recommended" type="button">Paket „überlebensfähig“</button><span id="shop-error"></span><button id="shop-finish" class="primary" type="button">Einkaufen und losfahren</button></footer></article></section>
  <main id="campaign-game" class="game-shell" hidden>
    <header class="topbar"><div class="brand"><span>LPC CAMPAIGN · SPRINTS 1–6</span><strong>Tales of the Blaue Adria</strong></div><div class="top-stats"><span id="time-label"></span><b id="region-label"></b><strong id="money-label"></strong><em>Wert <i id="weekend-score">0</i></em></div><nav><a href="../next/">Alter Next-Build</a><a href="../lpc-test/">Figurentest</a><button id="replay-intro" type="button">Intro</button><button id="reset-save" type="button">Neustart</button></nav></header>
    <section class="objective"><div><span>AKTIVE KAMPAGNENQUEST</span><strong id="objective-title"></strong><p id="objective-text"></p></div><b id="objective-distance"></b></section>
    <section class="game-layout"><aside class="panel left-panel"><section><h2>Zustände</h2><div id="status-list" class="status-list"></div></section><section><h2>Bedürfnisse</h2><div id="needs-list" class="meter-list"></div></section><section><h2>Wochenendwerte</h2><div id="metrics-list" class="meter-list"></div></section><section><h2>Inventar</h2><div id="inventory-list" class="inventory-list"></div></section><div class="quick-actions"><button id="quick-rest" type="button">60 Min. ruhen</button><button id="quick-toilet" type="button">Toilette</button></div></aside>
      <section class="world-column"><div class="world-frame"><div id="campaign-world"></div><div id="interaction-prompt" class="interaction-prompt" hidden><kbd>E</kbd><span id="interaction-text"></span></div><div class="mobile-controls"><div class="dpad"><button data-direction="up" type="button">▲</button><button data-direction="left" type="button">◀</button><button data-direction="down" type="button">▼</button><button data-direction="right" type="button">▶</button></div><button id="mobile-action" type="button">AKTION</button></div></div><section class="map-strip"><canvas id="minimap"></canvas><div><span>KANONISCHER PLATZPLAN</span><strong>Sieben Regionen · echte Wege · feste Questorte</strong><p>Gelb: aktuelles Ziel · Weiß: deine Position</p></div></section></section>
      <aside class="panel right-panel"><section><h2>Beziehungen</h2><div id="relationship-list" class="relationship-list"></div></section><section><h2>Flirts</h2><div id="romance-list" class="romance-list"></div></section><section><h2>Aktives Team</h2><div id="team-list" class="team-list"></div></section><section><h2>Attacken</h2><div id="attack-list" class="attack-list"></div></section><section><h2>Chronik</h2><div id="chronicle-list" class="chronicle-list"></div></section></aside>
    </section>
  </main>
  <section id="generic-modal" class="modal" hidden><article><button id="modal-close" class="modal-x" type="button">×</button><span id="modal-kicker"></span><h2 id="modal-title"></h2><div id="modal-copy" class="modal-copy"></div><div id="modal-options" class="modal-options"></div></article></section>
  <section id="battle-modal" class="modal battle-modal" hidden><article><header><div><span>RUNDENBASIERTER FRUSTKAMPF</span><h2 id="battle-title"></h2></div><b id="battle-round"></b></header><div class="battle-arena"><div class="fighter player"><strong>DU UND DEIN TEAM</strong><div class="frustration"><i id="battle-player-bar"></i></div><b id="battle-player-value"></b><small id="battle-player-statuses"></small></div><div class="versus">FRUST</div><div class="fighter enemy"><strong>GEGENSEITE</strong><div class="frustration"><i id="battle-enemy-bar"></i></div><b id="battle-enemy-value"></b><small id="battle-enemy-statuses"></small></div></div><div id="battle-moves" class="battle-moves"></div><div id="battle-log" class="battle-log"></div><button id="battle-close" class="primary" type="button" hidden>Zurück in die Welt</button></article></section>
  <section id="minigame-modal" class="modal minigame-modal" hidden><article><header><div><span>VOLLSTÄNDIGES MINISPIEL</span><h2 data-mini-title></h2><p data-mini-copy></p></div><button data-mini-close class="modal-x" type="button">×</button></header><canvas></canvas><p data-mini-hint class="mini-hint"></p><button data-mini-action class="primary" type="button">AKTION</button><div data-mini-result class="mini-result" hidden></div></article></section>
  <div id="toast" class="toast" role="status"></div>`;
}

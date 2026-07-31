import Phaser from 'phaser';
import { ITEMS } from '../../game/content';
import { GameStore } from '../../game/state/GameStore';
import type { GameSnapshot } from '../../game/types';
import { ALL_INTERACTIONS, CAMPAIGN_CHARACTER_BY_ID, type CampaignInteraction } from './content';
import { BeerPongRebuild } from './beerPongRebuild';
import { campaignMeta, CampaignMetaStore, type CampaignMetaState } from './metaStore';
import { MinigameDirector, type MiniGameId } from './minigames';
import { CampaignWorldScene } from './worldScene';
import {
  PROGRESSION_FLOW_VERSION,
  allCoreMinigamesUnlocked,
  conversationGiftChance,
  minigameUnlockState,
  nextProgressionObjective,
  pickWeightedReward,
  unlockedMinigames,
  type ProgressionObjective,
  type UnlockableGameId,
  type WeightedReward,
} from './progressionFlowV6Model';
import './progressionFlowV6.css';

type AnyRecord = Record<string, any>;
type GameStoreInternals = GameStore & { state: AnyRecord; emit: () => void; addChronicle: (text: string, tone: string) => void };
type MetaInternals = CampaignMetaStore & { state: CampaignMetaState; emit: () => void };
type BeerPongController = BeerPongRebuild & AnyRecord;
type SceneInternals = CampaignWorldScene & { add: Phaser.GameObjects.GameObjectFactory; tweens: Phaser.Tweens.TweenManager; events: Phaser.Events.EventEmitter };

const originalRadii = new Map<string, number>(ALL_INTERACTIONS.map((interaction) => [interaction.id, interaction.radius]));
const markerRefreshers = new Set<() => void>();
const debugRandomQueue: number[] = [];
let capturedStore: GameStoreInternals | undefined;
let latestBase: GameSnapshot | undefined;
let patchQueued = false;
let pendingStoryCard: { kicker: string; title: string; text: string } | undefined;
let blockedStarts = 0;
let minimapTimer = 0;

installStoreCapture();
installObjectiveOverride();
installInteractionProgression();
installWorldObjectiveMarker();
installMinigameGate();
installBeerPongDifficulty();
installRewards();
installIntroPacing();
installDomPatches();
exposeDiagnostics();

campaignMeta.subscribe(() => {
  refreshInteractionRadii();
  markerRefreshers.forEach((refresh) => refresh());
  queuePatch();
});
window.addEventListener('lpc-campaign-world-input-restored', queuePatch);
window.addEventListener('lpc-campaign-minigame-closed', () => {
  if (pendingStoryCard) {
    const card = pendingStoryCard;
    pendingStoryCard = undefined;
    window.setTimeout(() => showStoryCard(card.kicker, card.title, card.text), 120);
  }
});

function installStoreCapture(): void {
  const prototype = GameStore.prototype as unknown as AnyRecord;
  if (prototype.__progressionV6StoreCapture) return;
  prototype.__progressionV6StoreCapture = true;
  const originalSubscribe = prototype.subscribe;
  prototype.subscribe = function progressionSubscribe(listener: (snapshot: GameSnapshot) => void): () => void {
    if (!capturedStore) capturedStore = this as GameStoreInternals;
    const wrapped = (snapshot: GameSnapshot): void => {
      if (capturedStore === this) {
        latestBase = snapshot;
        refreshInteractionRadii();
        markerRefreshers.forEach((refresh) => refresh());
        queuePatch();
      }
      listener(snapshot);
    };
    return originalSubscribe.call(this, wrapped);
  };
}

function installObjectiveOverride(): void {
  const prototype = CampaignMetaStore.prototype as unknown as AnyRecord;
  if (prototype.__progressionV6Objective) return;
  prototype.__progressionV6Objective = true;
  const originalObjective = prototype.objective;
  prototype.objective = function progressionObjective(): ProgressionObjective {
    const fallback = originalObjective.call(this) as ProgressionObjective;
    const meta = (this as CampaignMetaStore).snapshot();
    const base = currentBase();
    return nextProgressionObjective(meta, base, { ...fallback, source: 'story' });
  };
}

function installInteractionProgression(): void {
  refreshInteractionRadii();
}

function refreshInteractionRadii(): void {
  const meta = campaignMeta.snapshot();
  const objective = campaignMeta.objective();
  for (const interaction of ALL_INTERACTIONS) {
    const original = originalRadii.get(interaction.id) ?? interaction.radius;
    if (interaction.kind === 'story') {
      interaction.radius = interaction.id === objective.targetId ? original : 0;
      continue;
    }
    if (interaction.kind === 'minigame') {
      const gameId = interactionToGameId(interaction.id);
      interaction.radius = gameId && minigameUnlockState(meta, gameId).unlocked ? original : 0;
      continue;
    }
    interaction.radius = original;
  }
}

function installWorldObjectiveMarker(): void {
  const prototype = CampaignWorldScene.prototype as unknown as AnyRecord;
  if (prototype.__progressionV6Marker) return;
  prototype.__progressionV6Marker = true;
  prototype.drawInteractionMarkers = function drawSingleObjectiveMarker(): void {
    const scene = this as SceneInternals;
    const marker = scene.add.circle(0, 0, 24, 0xe0b74f, .18).setStrokeStyle(4, 0xffe69a, .96).setDepth(12000);
    const inner = scene.add.circle(0, 0, 8, 0xffd768, .9).setDepth(12001);
    const label = scene.add.text(0, 0, '', {
      fontFamily: 'Arial Black, system-ui', fontSize: '11px', color: '#fff8d8', backgroundColor: '#10261ff0',
      padding: { x: 8, y: 5 }, stroke: '#07130f', strokeThickness: 2,
    }).setOrigin(.5).setDepth(12002);
    scene.tweens.add({ targets: marker, scale: { from: .86, to: 1.34 }, alpha: { from: .92, to: .12 }, duration: 920, repeat: -1 });
    const refresh = (): void => {
      const objective = campaignMeta.objective();
      const position = targetPoint(objective.targetId);
      const visible = Boolean(position);
      marker.setVisible(visible); inner.setVisible(visible); label.setVisible(visible);
      if (!position) return;
      marker.setPosition(position.x, position.y - 38);
      inner.setPosition(position.x, position.y - 38);
      label.setPosition(position.x, position.y + 38).setText(`NÄCHSTES ZIEL · ${objective.title}`);
    };
    markerRefreshers.add(refresh);
    scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => markerRefreshers.delete(refresh));
    refresh();
  };
}

function installMinigameGate(): void {
  const prototype = MinigameDirector.prototype as unknown as AnyRecord;
  if (prototype.__progressionV6Gate) return;
  prototype.__progressionV6Gate = true;
  const originalStart = prototype.start;
  prototype.start = function gatedMinigameStart(id: MiniGameId): void {
    const gameId = interactionToGameId(id);
    if (gameId) {
      const gate = minigameUnlockState(campaignMeta.snapshot(), gameId);
      if (!gate.unlocked) {
        blockedStarts += 1;
        showToast(`NOCH GESPERRT · ${gate.reason}`);
        queuePatch();
        return;
      }
    }
    originalStart.call(this, id);
  };

  document.addEventListener('click', (event) => {
    const button = event.target instanceof Element ? event.target.closest<HTMLButtonElement>('button') : null;
    if (!button || !button.textContent?.includes('Frustduell beginnen')) return;
    const gate = minigameUnlockState(campaignMeta.snapshot(), 'ronnyBattle');
    if (gate.unlocked) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    blockedStarts += 1;
    showToast(`RONNY LEHNT AB · ${gate.reason}`);
  }, true);
}

function installBeerPongDifficulty(): void {
  const prototype = BeerPongRebuild.prototype as unknown as AnyRecord;
  if (prototype.__progressionV6Difficulty) return;
  prototype.__progressionV6Difficulty = true;
  const originalStart = prototype.start;
  const originalOpponent = prototype.beginOpponentTurn;
  const originalPointerDown = prototype.pointerDown;
  const originalPointerMove = prototype.pointerMove;
  const originalSyncLabels = prototype.syncLabels;

  prototype.start = function harderBeerPongStart(): void {
    originalStart.call(this);
    const controller = this as BeerPongController;
    const wins = Number(controller.context?.wins ?? 0);
    const perfect = controller.context?.bestQuality === 'perfect';
    if (controller.state) {
      controller.state.playerCups = perfect || wins >= 2 ? 6 : wins >= 1 ? 7 : 8;
      controller.state.difficultyTier = perfect || wins >= 2 ? 'expert' : wins >= 1 ? 'advanced' : 'standard-plus';
      controller.state.previewCoverage = perfect || wins >= 2 ? .58 : wins >= 1 ? .66 : .72;
    }
    controller.copy.textContent = `Du startest nur mit ${controller.state?.playerCups ?? 8} eigenen Bechern. Die Zielhilfe zeigt nicht mehr die gesamte Flugbahn; Trefferketten des Gegners sind deutlich wahrscheinlicher.`;
    controller.hint.textContent = 'Wurfart oben ausdrücklich wählen. Ball greifen, zurückziehen und mit verkürzter Zielhilfe loslassen.';
    mountBeerPongModePicker(controller);
    refreshBeerPongPicker(controller);
  };

  prototype.beginOpponentTurn = function harderOpponentTurn(): void {
    originalOpponent.call(this);
    const controller = this as BeerPongController;
    if (!controller.state || controller.state.phase !== 'opponent') return;
    const wins = Number(controller.context?.wins ?? 0);
    const attempts = Number(controller.context?.attempts ?? 0);
    const perfect = controller.context?.bestQuality === 'perfect';
    const assist = controller.context?.flags?.['partner-susi-pong'] ? .08 : 0;
    const chance = clamp(.54 + Math.min(.08, attempts * .015) + Math.min(.12, wins * .05) + (perfect ? .05 : 0) - assist, .5, .76);
    controller.state.opponentHitChance = chance;
    controller.state.opponentWillHit = random01() < chance;
  };

  prototype.pointerDown = function shorterPreviewOnDown(event: PointerEvent): void {
    originalPointerDown.call(this, event);
    trimBeerPongPreview(this as BeerPongController);
  };
  prototype.pointerMove = function shorterPreviewOnMove(event: PointerEvent): void {
    originalPointerMove.call(this, event);
    trimBeerPongPreview(this as BeerPongController);
  };
  prototype.syncLabels = function syncHardBeerPongLabels(): void {
    originalSyncLabels.call(this);
    refreshBeerPongPicker(this as BeerPongController);
  };
}

function mountBeerPongModePicker(controller: BeerPongController): void {
  let picker = controller.root.querySelector<HTMLElement>('.progression-v6-pong-modes');
  if (picker) return;
  picker = document.createElement('section');
  picker.className = 'progression-v6-pong-modes';
  picker.innerHTML = `
    <span>WURFART AUSWÄHLEN</span>
    <div>
      <button type="button" data-pong-mode="direct"><strong>NORMALER WURF</strong><small>1 Becher · nicht abwehrbar</small></button>
      <button type="button" data-pong-mode="bounce"><strong>AUFSETZER</strong><small>2 Becher möglich · kann geblockt werden</small></button>
    </div>`;
  controller.canvas.before(picker);
  picker.querySelectorAll<HTMLButtonElement>('[data-pong-mode]').forEach((button) => button.addEventListener('click', () => {
    const state = controller.state;
    if (!state || (state.running && state.phase !== 'ready')) return;
    state.mode = button.dataset.pongMode === 'bounce' ? 'bounce' : 'direct';
    controller.action.textContent = `WURFART: ${state.mode === 'bounce' ? 'AUFSETZER' : 'DIREKT'}`;
    controller.setFeedback?.('WURFART', state.mode === 'bounce' ? 'Aufsetzer: riskant, aber zwei Becher möglich.' : 'Normaler Wurf: präziser und nicht blockbar.', 'neutral');
    refreshBeerPongPicker(controller);
  }));
}

function refreshBeerPongPicker(controller: BeerPongController): void {
  const picker = controller.root.querySelector<HTMLElement>('.progression-v6-pong-modes');
  const state = controller.state;
  if (!picker || !state) return;
  picker.dataset.mode = state.mode;
  picker.querySelectorAll<HTMLButtonElement>('[data-pong-mode]').forEach((button) => {
    const selected = button.dataset.pongMode === state.mode;
    button.classList.toggle('selected', selected);
    button.setAttribute('aria-pressed', String(selected));
    button.disabled = Boolean(state.running && state.phase !== 'ready');
  });
}

function trimBeerPongPreview(controller: BeerPongController): void {
  const state = controller.state;
  if (!state?.preview?.length) return;
  const baseCoverage = Number(state.previewCoverage ?? .72);
  const coverage = state.mode === 'bounce' ? Math.max(.48, baseCoverage - .08) : baseCoverage;
  state.preview = state.preview.slice(0, Math.max(8, Math.round(state.preview.length * coverage)));
}

function installRewards(): void {
  const prototype = CampaignMetaStore.prototype as unknown as AnyRecord;
  if (prototype.__progressionV6Rewards) return;
  prototype.__progressionV6Rewards = true;

  const originalSetStage = prototype.setStage;
  prototype.setStage = function progressionSetStage(stage: CampaignMetaState['questStage'], event?: string): void {
    originalSetStage.call(this, stage, event);
    if (stage === 'free-weekend') introduceFlipCup(this as MetaInternals);
  };

  const originalAuthority = prototype.winAuthorityBattle;
  prototype.winAuthorityBattle = function rewardedAuthorityVictory(): void {
    originalAuthority.call(this);
    grantBattleReward('authority', 'Gundula gibt widerwillig einen Gegenstand aus der Fundsachenkiste frei.', true);
  };

  const originalMini = prototype.recordMiniGame;
  prototype.recordMiniGame = function rewardedMiniGame(id: string, success: boolean, score: number, event: string, quality?: string): void {
    const before = (this as CampaignMetaStore).snapshot();
    originalMini.call(this, id, success, score, event, quality);
    const meta = this as MetaInternals;
    introduceNextGame(meta, id, before);
    if (success && id === 'ronnyBattle') {
      const attempt = meta.state.miniResults[id]?.attempts ?? 1;
      grantBattleReward(`ronny-${attempt}`, 'Ronny verliert das Frustduell und behauptet, der Preis sei ohnehin strategisch gewesen.', true);
    }
  };

  const originalConversation = prototype.conversation;
  prototype.conversation = function rewardedConversation(characterId: string): number {
    const count = originalConversation.call(this, characterId) as number;
    rollConversationGift(this as MetaInternals, characterId, count);
    return count;
  };

  const originalSaturday = prototype.winSaturdayBrawl;
  prototype.winSaturdayBrawl = function rewardedSaturdayBrawl(): void {
    originalSaturday.call(this);
    grantBattleReward('saturday-brawl', 'Nach dem Faustkampf liegt überraschend brauchbare Beute zwischen Klemmbrett und Würderesten.', true);
  };

  const originalFinal = prototype.winFinalBattle;
  prototype.winFinalBattle = function rewardedFinalBattle(): void {
    originalFinal.call(this);
    grantBattleReward('sunday-final', 'Die bestandene Abnahme endet mit einem letzten Gegenstand aus der offiziellen Inoffiziell-Kiste.', true);
  };
}

function introduceFlipCup(meta: MetaInternals): void {
  if (meta.state.flags['minigame-introduced-flipCup']) return;
  meta.state.flags['minigame-introduced-flipCup'] = true;
  meta.state.lastEvent = 'André stellt am Zeltkreis Becher auf: Flip Cup ist die erste Disziplin. Weitere Spiele werden nacheinander eingeführt.';
  meta.emit();
  showStoryCard('NEUE DISZIPLIN', 'André eröffnet Flip Cup', 'Am Zeltkreis werden die Becher aufgestellt. Spiele Flip Cup mindestens einmal. Danach führt Susi Beer Pong ein.');
}

function introduceNextGame(meta: MetaInternals, id: string, before: CampaignMetaState): void {
  if (id === 'flipCup' && !meta.state.flags['minigame-introduced-beerPong']) {
    meta.state.flags['minigame-introduced-beerPong'] = true;
    meta.state.lastEvent = 'Susi erklärt, dass umgedrehte Becher nur die Aufwärmphase waren. Beer Pong ist jetzt auf der Festwiese freigeschaltet.';
    meta.emit();
    queueStoryCard('NEUE DISZIPLIN', 'Susi führt Beer Pong ein', 'Auf der Festwiese wartet das Tischduell. Vor jedem Wurf wird jetzt ausdrücklich zwischen normalem Wurf und Aufsetzer gewählt.');
  }
  if (id === 'beerPong' && !meta.state.flags['minigame-introduced-flunkyball']) {
    meta.state.flags['minigame-introduced-flunkyball'] = true;
    meta.state.lastEvent = 'Lars und Felix erklären den Tisch für zu stationär. Flunkyball ist jetzt am Strand freigeschaltet.';
    meta.emit();
    queueStoryCard('NEUE DISZIPLIN', 'Flunkyball zieht an den Strand', 'Lars bringt die Flasche, Felix die Zeitmessung. Absolviere Flunkyball; danach bleiben alle drei großen Spiele dauerhaft aktiv.');
  }
  if (id === 'flunkyball' && !before.flags['all-core-minigames-unlocked']) {
    meta.state.flags['all-core-minigames-unlocked'] = true;
    meta.state.flags['minigame-introduced-ronnyBattle'] = true;
    meta.state.lastEvent = 'Die drei großen Minispiele sind freigeschaltet und bleiben aktiv. Ronny akzeptiert nun ein Frustduell.';
    meta.emit();
    queueStoryCard('SPIELEABEND VOLLSTÄNDIG', 'Alles bleibt spielbar', 'Flip Cup, Beer Pong und Flunkyball bleiben dauerhaft aktiv. Zusätzlich ist Ronnys Frustduell jetzt freigeschaltet.');
  }
}

function rollConversationGift(meta: MetaInternals, characterId: string, count: number): void {
  if (!capturedStore || meta.state.flags[`conversation-gift-${characterId}-${meta.state.questStage}`]) return;
  const rollKey = `conversation-gift-roll-${characterId}-${meta.state.questStage}-${Math.min(count, 3)}`;
  if (meta.state.flags[rollKey]) return;
  meta.state.flags[rollKey] = true;
  const chance = conversationGiftChance(count);
  const roll = random01();
  if (roll <= chance) {
    meta.state.flags[`conversation-gift-${characterId}-${meta.state.questStage}`] = true;
    const reward = pickWeightedReward(conversationRewardPool(characterId), random01());
    if (reward) grantItem(reward.id, reward.amount, `${characterLabel(characterId)} schenkt dir ${reward.amount}× ${ITEMS[reward.id]?.label ?? reward.id}.`, 'gift');
  }
  meta.emit();
}

function grantBattleReward(key: string, story: string, guaranteed: boolean): void {
  const meta = campaignMeta as unknown as MetaInternals;
  const flag = `battle-reward-${key}`;
  if (meta.state.flags[flag]) return;
  meta.state.flags[flag] = true;
  const reward = pickWeightedReward(BATTLE_REWARDS, random01());
  if (guaranteed && reward) grantItem(reward.id, reward.amount, `${story} Du erhältst ${reward.amount}× ${ITEMS[reward.id]?.label ?? reward.id}.`, 'battle');
  meta.emit();
}

function grantItem(id: string, amount: number, text: string, source: 'battle' | 'gift'): boolean {
  if (!capturedStore || !ITEMS[id] || amount <= 0) return false;
  const state = capturedStore.state;
  state.inventory[id] = Math.min(99, Number(state.inventory[id] ?? 0) + amount);
  capturedStore.addChronicle(text, 'good');
  capturedStore.emit();
  showRewardToast(id, amount, source, text);
  return true;
}

const BATTLE_REWARDS: WeightedReward[] = [
  { id: 'wasser', weight: 22, min: 1, max: 2 }, { id: 'chips', weight: 18 }, { id: 'kaffee', weight: 14 },
  { id: 'bier', weight: 17 }, { id: 'tablette', weight: 11 }, { id: 'wuerste', weight: 9 },
  { id: 'klopapier', weight: 6 }, { id: 'batida', weight: 3 },
];

function conversationRewardPool(characterId: string): WeightedReward[] {
  const pools: Record<string, WeightedReward[]> = {
    andre: [{ id: 'wasser', weight: 4 }, { id: 'kaffee', weight: 3 }, { id: 'chips', weight: 2 }],
    rene: [{ id: 'wasser', weight: 4 }, { id: 'tablette', weight: 3 }, { id: 'klopapier', weight: 1 }],
    lars: [{ id: 'bier', weight: 5 }, { id: 'chips', weight: 3 }, { id: 'wasser', weight: 2 }],
    danny: [{ id: 'chips', weight: 4 }, { id: 'bier', weight: 3 }, { id: 'batida', weight: 1 }],
    gregor: [{ id: 'wasser', weight: 5 }, { id: 'kaffee', weight: 3 }],
    masl: [{ id: 'bier', weight: 4 }, { id: 'wuerste', weight: 3 }, { id: 'chips', weight: 2 }],
    schubert: [{ id: 'kaffee', weight: 4 }, { id: 'tablette', weight: 3 }, { id: 'wasser', weight: 2 }],
    felix: [{ id: 'wasser', weight: 4 }, { id: 'chips', weight: 3 }, { id: 'kaffee', weight: 2 }],
    schima: [{ id: 'bier', weight: 4 }, { id: 'batida', weight: 2 }, { id: 'wasser', weight: 2 }],
    manni: [{ id: 'wuerste', weight: 4 }, { id: 'bier', weight: 3 }, { id: 'klopapier', weight: 2 }],
    susi: [{ id: 'wasser', weight: 4 }, { id: 'chips', weight: 3 }, { id: 'bier', weight: 2 }],
    jule: [{ id: 'wasser', weight: 6 }, { id: 'kaffee', weight: 2 }],
    kira: [{ id: 'kaffee', weight: 5 }, { id: 'chips', weight: 3 }],
    ronny: [{ id: 'chips', weight: 4 }, { id: 'wasser', weight: 3 }, { id: 'bier', weight: 1 }],
    gundula: [{ id: 'kaffee', weight: 4 }, { id: 'wasser', weight: 3 }, { id: 'klopapier', weight: 1 }],
    uli: [{ id: 'wasser', weight: 4 }, { id: 'kaffee', weight: 2 }],
  };
  return pools[characterId] ?? BATTLE_REWARDS.filter((entry) => entry.id !== 'batida');
}

function installIntroPacing(): void {
  const observer = new MutationObserver(() => patchIntroPacing());
  observer.observe(document.documentElement, { childList: true, subtree: true });
  window.addEventListener('load', patchIntroPacing);
  patchIntroPacing();
}

function patchIntroPacing(): void {
  const space = document.querySelector<HTMLElement>('.opening-v5-space');
  if (!space || space.dataset.pacingV6) return;
  space.dataset.pacingV6 = '1';
  const stored = Number(localStorage.getItem('tales-blaue-adria-intro-duration-v6'));
  const duration = [48000, 68000, 78000].includes(stored) ? stored : 68000;
  applyIntroDuration(space, duration, false);
  const controls = space.querySelector('.opening-v5-intro-controls');
  if (!controls) return;
  const pacing = document.createElement('div');
  pacing.className = 'progression-v6-intro-speed';
  pacing.innerHTML = `<span>LESEGESCHWINDIGKEIT</span><button data-intro-duration="78000">Sehr ruhig</button><button data-intro-duration="68000">Ruhig</button><button data-intro-duration="48000">Schnell</button>`;
  controls.prepend(pacing);
  pacing.querySelectorAll<HTMLButtonElement>('[data-intro-duration]').forEach((button) => button.addEventListener('click', () => {
    applyIntroDuration(space, Number(button.dataset.introDuration), true);
  }));
  refreshIntroButtons(space, duration);
}

function applyIntroDuration(space: HTMLElement, duration: number, restart: boolean): void {
  space.style.setProperty('--crawl-duration', `${duration}ms`);
  space.dataset.introDuration = String(duration);
  localStorage.setItem('tales-blaue-adria-intro-duration-v6', String(duration));
  refreshIntroButtons(space, duration);
  if (!restart) return;
  space.querySelectorAll<HTMLElement>('.opening-v5-prelude,.opening-v5-logo,.opening-v5-crawl').forEach((node) => {
    node.style.animation = 'none';
    void node.offsetWidth;
    node.style.animation = '';
  });
}

function refreshIntroButtons(space: HTMLElement, duration: number): void {
  space.querySelectorAll<HTMLButtonElement>('[data-intro-duration]').forEach((button) => button.classList.toggle('selected', Number(button.dataset.introDuration) === duration));
}

function installDomPatches(): void {
  const observer = new MutationObserver(queuePatch);
  observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['hidden'] });
  window.addEventListener('load', queuePatch);
  minimapTimer = window.setInterval(() => {
    patchObjectiveUi();
    patchMinimapObjective();
  }, 360);
  queuePatch();
}

function queuePatch(): void {
  if (patchQueued) return;
  patchQueued = true;
  window.setTimeout(() => {
    patchQueued = false;
    patchObjectiveUi();
    patchRonnyGate();
    patchIntroPacing();
    document.documentElement.dataset.progressionRelease = PROGRESSION_FLOW_VERSION;
  }, 24);
}

function patchObjectiveUi(): void {
  const objective = campaignMeta.objective();
  const title = document.getElementById('objective-title');
  const text = document.getElementById('objective-text');
  if (title && title.textContent !== objective.title) title.textContent = objective.title;
  if (text && text.textContent !== objective.text) text.textContent = objective.text;
  const target = targetPoint(objective.targetId);
  const player = currentBase().worldPosition;
  const distance = document.getElementById('objective-distance');
  if (distance && target) distance.textContent = `${Math.round(Math.hypot(target.x - player.x, target.y - player.y))} m`;
}

function patchMinimapObjective(): void {
  const canvas = document.getElementById('minimap');
  if (!(canvas instanceof HTMLCanvasElement)) return;
  const target = targetPoint(campaignMeta.objective().targetId);
  if (!target) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const x = target.x * canvas.width / 2600;
  const y = target.y * canvas.height / 1800;
  ctx.save();
  ctx.fillStyle = '#f5cb56';
  ctx.strokeStyle = '#5a4511';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(x, y, 7, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.restore();
}

function patchRonnyGate(): void {
  const modal = document.getElementById('generic-modal');
  const title = document.getElementById('modal-title');
  if (!modal || modal.hidden || title?.textContent !== 'Rivalen-Ronny') return;
  const gate = minigameUnlockState(campaignMeta.snapshot(), 'ronnyBattle');
  if (gate.unlocked) return;
  const button = [...modal.querySelectorAll<HTMLButtonElement>('button')].find((entry) => entry.textContent?.includes('Frustduell beginnen'));
  if (!button) return;
  button.disabled = true;
  const hint = button.querySelector('small');
  if (hint) hint.textContent = gate.reason;
}

function targetPoint(id: string): { x: number; y: number } | undefined {
  const character = CAMPAIGN_CHARACTER_BY_ID[id];
  if (character) return { x: character.x, y: character.y };
  const interaction = ALL_INTERACTIONS.find((entry) => entry.id === id);
  return interaction ? { x: interaction.x, y: interaction.y } : undefined;
}

function currentBase(): GameSnapshot {
  if (capturedStore) return capturedStore.snapshot();
  if (latestBase) return latestBase;
  return { flags: {}, worldPosition: { x: 900, y: 1600 } } as GameSnapshot;
}

function interactionToGameId(id: string): UnlockableGameId | undefined {
  const normalized = id === 'hedge' ? 'hedgePee' : id;
  return (['flipCup', 'beerPong', 'flunkyball', 'hedgePee', 'maslHole', 'ronnyBattle'] as string[]).includes(normalized)
    ? normalized as UnlockableGameId
    : undefined;
}

function queueStoryCard(kicker: string, title: string, text: string): void {
  pendingStoryCard = { kicker, title, text };
}

function showStoryCard(kicker: string, title: string, text: string): void {
  document.getElementById('progression-v6-story')?.remove();
  const card = document.createElement('section');
  card.id = 'progression-v6-story';
  card.className = 'progression-v6-story';
  card.innerHTML = `<article><span>${escapeHtml(kicker)}</span><h2>${escapeHtml(title)}</h2><p>${escapeHtml(text)}</p><button type="button">Verstanden</button></article>`;
  document.body.append(card);
  document.body.classList.add('campaign-modal-open');
  card.querySelector('button')?.addEventListener('click', () => {
    card.remove();
    const anotherModal = [...document.querySelectorAll<HTMLElement>('.modal')].some((modal) => !modal.hidden);
    document.body.classList.toggle('campaign-modal-open', anotherModal);
  });
}

function showRewardToast(id: string, amount: number, source: 'battle' | 'gift', text: string): void {
  const item = ITEMS[id];
  const node = document.createElement('aside');
  node.className = 'progression-v6-reward';
  node.innerHTML = `<span>${item?.icon ?? '🎁'}</span><div><small>${source === 'battle' ? 'FRUSTKAMPF-BELOHNUNG' : 'GESCHENK ERHALTEN'}</small><strong>${amount}× ${escapeHtml(item?.label ?? id)}</strong><p>${escapeHtml(text)}</p></div>`;
  document.body.append(node);
  window.setTimeout(() => node.classList.add('visible'), 20);
  window.setTimeout(() => { node.classList.remove('visible'); window.setTimeout(() => node.remove(), 320); }, 4200);
}

function showToast(text: string): void {
  const existing = document.getElementById('progression-v6-toast');
  existing?.remove();
  const node = document.createElement('div');
  node.id = 'progression-v6-toast';
  node.className = 'progression-v6-toast';
  node.textContent = text;
  document.body.append(node);
  window.setTimeout(() => node.classList.add('visible'), 10);
  window.setTimeout(() => { node.classList.remove('visible'); window.setTimeout(() => node.remove(), 250); }, 3000);
}

function random01(): number {
  if (debugRandomQueue.length) return clamp(Number(debugRandomQueue.shift()), 0, .999999);
  if (globalThis.crypto?.getRandomValues) {
    const data = new Uint32Array(1);
    globalThis.crypto.getRandomValues(data);
    return data[0] / 0x100000000;
  }
  return Math.random();
}

function characterLabel(id: string): string {
  return CAMPAIGN_CHARACTER_BY_ID[id]?.name ?? id;
}

function escapeHtml(value: string): string {
  return String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character] ?? character);
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function exposeDiagnostics(): void {
  if (!new URLSearchParams(location.search).has('smoke') && !new URLSearchParams(location.search).has('progression')) return;
  (window as unknown as AnyRecord).__lpcProgressionV6 = {
    version: PROGRESSION_FLOW_VERSION,
    snapshot(): AnyRecord {
      const meta = campaignMeta.snapshot();
      const objective = campaignMeta.objective();
      return {
        objective,
        unlocked: unlockedMinigames(meta),
        allCore: allCoreMinigamesUnlocked(meta),
        enabledStory: ALL_INTERACTIONS.filter((entry) => entry.kind === 'story' && entry.radius > 0).map((entry) => entry.id),
        enabledMinigames: ALL_INTERACTIONS.filter((entry) => entry.kind === 'minigame' && entry.radius > 0).map((entry) => entry.id),
        questMarkers: document.querySelectorAll('.progression-v6-objective-marker').length || document.querySelectorAll('canvas').length && 1,
        blockedStarts,
        introDuration: Number(document.querySelector<HTMLElement>('.opening-v5-space')?.dataset.introDuration ?? 68000),
        inventory: capturedStore ? { ...capturedStore.state.inventory } : {},
        storyCard: document.getElementById('progression-v6-story')?.querySelector('h2')?.textContent ?? '',
      };
    },
    forceMeta(values: Partial<CampaignMetaState>): void {
      const internal = campaignMeta as unknown as MetaInternals;
      Object.assign(internal.state, values);
      if (values.flags) internal.state.flags = { ...internal.state.flags, ...values.flags };
      if (values.miniResults) internal.state.miniResults = { ...internal.state.miniResults, ...values.miniResults };
      internal.emit();
    },
    recordMini(id: string, success = true): void {
      campaignMeta.recordMiniGame(id, success, success ? 120 : 20, `Debug progression result for ${id}.`, success ? 'solid' : 'failed');
    },
    setRandom(...values: number[]): void { debugRandomQueue.push(...values); },
    grantBattle(key = 'debug'): void { grantBattleReward(key, 'Debug-Frustkampf abgeschlossen.', true); },
    conversation(id: string): number { return campaignMeta.conversation(id); },
    closeStory(): void { document.querySelector<HTMLButtonElement>('#progression-v6-story button')?.click(); },
    refresh(): void { refreshInteractionRadii(); markerRefreshers.forEach((refresh) => refresh()); queuePatch(); },
  };
}

void minimapTimer;

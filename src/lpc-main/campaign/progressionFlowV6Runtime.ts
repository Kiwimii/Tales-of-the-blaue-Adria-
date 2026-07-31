import Phaser from 'phaser';
import { ITEMS } from '../../game/content';
import { GameStore } from '../../game/state/GameStore';
import type { GameSnapshot } from '../../game/types';
import { ALL_INTERACTIONS, CAMPAIGN_CHARACTER_BY_ID } from './content';
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
type StoreInternals = {
  state: AnyRecord;
  snapshot: () => GameSnapshot;
  emit: () => void;
  addChronicle: (text: string, tone: string) => void;
};
type MetaInternals = {
  state: CampaignMetaState;
  snapshot: () => CampaignMetaState;
  emit: () => void;
};

const originalRadii = new Map(ALL_INTERACTIONS.map((interaction) => [interaction.id, interaction.radius]));
const markerRefreshers = new Set<() => void>();
const debugRandomQueue: number[] = [];
let capturedStore: StoreInternals | undefined;
let latestBase: GameSnapshot | undefined;
let patchQueued = false;
let pendingStoryCard: { kicker: string; title: string; text: string } | undefined;
let blockedStarts = 0;
let objectiveMarkerCount = 0;

installStoreCapture();
installObjectiveOverride();
installWorldObjectiveMarker();
installMinigameGate();
installBeerPongDifficulty();
installRewards();
installIntroPacing();
installDomPatches();
exposeDiagnostics();
refreshInteractionRadii();

campaignMeta.subscribe(() => {
  refreshInteractionRadii();
  markerRefreshers.forEach((refresh) => refresh());
  queuePatch();
});
window.addEventListener('lpc-campaign-world-input-restored', queuePatch);
window.addEventListener('lpc-campaign-minigame-closed', () => {
  if (!pendingStoryCard) return;
  const card = pendingStoryCard;
  pendingStoryCard = undefined;
  window.setTimeout(() => showStoryCard(card.kicker, card.title, card.text), 120);
});

function installStoreCapture(): void {
  const prototype = GameStore.prototype as unknown as AnyRecord;
  if (prototype.__progressionV6StoreCapture) return;
  prototype.__progressionV6StoreCapture = true;
  const originalSubscribe = prototype.subscribe as (listener: (snapshot: GameSnapshot) => void) => () => void;
  prototype.subscribe = function progressionSubscribe(listener: (snapshot: GameSnapshot) => void): () => void {
    const owner = this as unknown as StoreInternals;
    if (!capturedStore) capturedStore = owner;
    return originalSubscribe.call(this, (snapshot: GameSnapshot) => {
      if (capturedStore === owner) {
        latestBase = snapshot;
        refreshInteractionRadii();
        markerRefreshers.forEach((refresh) => refresh());
        queuePatch();
      }
      listener(snapshot);
    });
  };
}

function installObjectiveOverride(): void {
  const prototype = CampaignMetaStore.prototype as unknown as AnyRecord;
  if (prototype.__progressionV6Objective) return;
  prototype.__progressionV6Objective = true;
  const originalObjective = prototype.objective as () => ProgressionObjective;
  prototype.objective = function progressionObjective(): ProgressionObjective {
    const fallback = originalObjective.call(this);
    const meta = (this as CampaignMetaStore).snapshot();
    return nextProgressionObjective(meta, currentBase(), { ...fallback, source: 'story' });
  };
}

function refreshInteractionRadii(): void {
  const meta = campaignMeta.snapshot();
  const objective = campaignMeta.objective();
  for (const interaction of ALL_INTERACTIONS) {
    const original = originalRadii.get(interaction.id) ?? interaction.radius;
    if (interaction.kind === 'story') {
      interaction.radius = interaction.id === objective.targetId ? original : 0;
    } else if (interaction.kind === 'minigame') {
      const gameId = interactionToGameId(interaction.id);
      interaction.radius = gameId && minigameUnlockState(meta, gameId).unlocked ? original : 0;
    } else interaction.radius = original;
  }
}

function installWorldObjectiveMarker(): void {
  const prototype = CampaignWorldScene.prototype as unknown as AnyRecord;
  if (prototype.__progressionV6Marker) return;
  prototype.__progressionV6Marker = true;
  prototype.drawInteractionMarkers = function drawSingleObjectiveMarker(): void {
    const scene = this as AnyRecord;
    const marker = scene.add.circle(0, 0, 24, 0xe0b74f, .18).setStrokeStyle(4, 0xffe69a, .96).setDepth(12000);
    const inner = scene.add.circle(0, 0, 8, 0xffd768, .9).setDepth(12001);
    const label = scene.add.text(0, 0, '', {
      fontFamily: 'Arial Black, system-ui', fontSize: '11px', color: '#fff8d8', backgroundColor: '#10261ff0',
      padding: { x: 8, y: 5 }, stroke: '#07130f', strokeThickness: 2,
    }).setOrigin(.5).setDepth(12002);
    scene.tweens.add({ targets: marker, scale: { from: .86, to: 1.34 }, alpha: { from: .92, to: .12 }, duration: 920, repeat: -1 });
    objectiveMarkerCount += 1;
    const refresh = (): void => {
      const objective = campaignMeta.objective();
      const point = targetPoint(objective.targetId);
      const visible = Boolean(point);
      marker.setVisible(visible); inner.setVisible(visible); label.setVisible(visible);
      if (!point) return;
      marker.setPosition(point.x, point.y - 38);
      inner.setPosition(point.x, point.y - 38);
      label.setPosition(point.x, point.y + 38).setText(`NÄCHSTES ZIEL · ${objective.title}`);
    };
    markerRefreshers.add(refresh);
    scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      markerRefreshers.delete(refresh);
      objectiveMarkerCount = Math.max(0, objectiveMarkerCount - 1);
    });
    refresh();
  };
}

function installMinigameGate(): void {
  const prototype = MinigameDirector.prototype as unknown as AnyRecord;
  if (prototype.__progressionV6Gate) return;
  prototype.__progressionV6Gate = true;
  const originalStart = prototype.start as (id: MiniGameId) => void;
  prototype.start = function gatedMinigameStart(id: MiniGameId): void {
    const gameId = interactionToGameId(id);
    if (gameId) {
      const gate = minigameUnlockState(campaignMeta.snapshot(), gameId);
      if (!gate.unlocked) {
        blockedStarts += 1;
        showToast(`NOCH GESPERRT · ${gate.reason}`);
        return;
      }
    }
    originalStart.call(this, id);
  };
  document.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target.closest('button') : null;
    if (!(target instanceof HTMLButtonElement) || !target.textContent?.includes('Frustduell beginnen')) return;
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
  const originalStart = prototype.start as () => void;
  const originalOpponent = prototype.beginOpponentTurn as () => void;
  const originalPointerDown = prototype.pointerDown as (event: PointerEvent) => void;
  const originalPointerMove = prototype.pointerMove as (event: PointerEvent) => void;
  const originalSyncLabels = prototype.syncLabels as () => void;

  prototype.start = function harderBeerPongStart(): void {
    originalStart.call(this);
    const controller = this as AnyRecord;
    const wins = Number(controller.context?.wins ?? 0);
    const perfect = controller.context?.bestQuality === 'perfect';
    if (controller.state) {
      controller.state.playerCups = perfect || wins >= 2 ? 6 : wins >= 1 ? 7 : 8;
      controller.state.difficultyTier = perfect || wins >= 2 ? 'expert' : wins >= 1 ? 'advanced' : 'standard-plus';
      controller.state.previewCoverage = perfect || wins >= 2 ? .58 : wins >= 1 ? .66 : .72;
    }
    controller.copy.textContent = `Du startest nur mit ${controller.state?.playerCups ?? 8} eigenen Bechern. Die Zielhilfe zeigt nicht mehr die gesamte Flugbahn; der Gegner trifft deutlich häufiger.`;
    controller.hint.textContent = 'Wurfart oben wählen. Ball greifen, zurückziehen und mit verkürzter Zielhilfe loslassen.';
    mountBeerPongModePicker(controller);
    refreshBeerPongPicker(controller);
  };
  prototype.beginOpponentTurn = function harderOpponentTurn(): void {
    originalOpponent.call(this);
    const controller = this as AnyRecord;
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
    trimBeerPongPreview(this as AnyRecord);
  };
  prototype.pointerMove = function shorterPreviewOnMove(event: PointerEvent): void {
    originalPointerMove.call(this, event);
    trimBeerPongPreview(this as AnyRecord);
  };
  prototype.syncLabels = function syncHardBeerPongLabels(): void {
    originalSyncLabels.call(this);
    refreshBeerPongPicker(this as AnyRecord);
  };
}

function mountBeerPongModePicker(controller: AnyRecord): void {
  const root = controller.root as HTMLElement;
  if (root.querySelector('.progression-v6-pong-modes')) return;
  const picker = document.createElement('section');
  picker.className = 'progression-v6-pong-modes';
  picker.innerHTML = `<span>WURFART AUSWÄHLEN</span><div>
    <button type="button" data-pong-mode="direct"><strong>NORMALER WURF</strong><small>1 Becher · nicht abwehrbar</small></button>
    <button type="button" data-pong-mode="bounce"><strong>AUFSETZER</strong><small>2 Becher möglich · kann geblockt werden</small></button>
  </div>`;
  (controller.canvas as HTMLElement).before(picker);
  picker.querySelectorAll<HTMLButtonElement>('[data-pong-mode]').forEach((button) => button.addEventListener('click', () => {
    const state = controller.state;
    if (!state || (state.running && state.phase !== 'ready')) return;
    state.mode = button.dataset.pongMode === 'bounce' ? 'bounce' : 'direct';
    controller.action.textContent = `WURFART: ${state.mode === 'bounce' ? 'AUFSETZER' : 'DIREKT'}`;
    controller.setFeedback?.('WURFART', state.mode === 'bounce' ? 'Aufsetzer: riskant, aber zwei Becher möglich.' : 'Normaler Wurf: präziser und nicht blockbar.', 'neutral');
    refreshBeerPongPicker(controller);
  }));
}

function refreshBeerPongPicker(controller: AnyRecord): void {
  const root = controller.root as HTMLElement;
  const picker = root.querySelector('.progression-v6-pong-modes');
  const state = controller.state;
  if (!(picker instanceof HTMLElement) || !state) return;
  picker.dataset.mode = state.mode;
  picker.querySelectorAll<HTMLButtonElement>('[data-pong-mode]').forEach((button) => {
    const selected = button.dataset.pongMode === state.mode;
    button.classList.toggle('selected', selected);
    button.setAttribute('aria-pressed', String(selected));
    button.disabled = Boolean(state.running && state.phase !== 'ready');
  });
}

function trimBeerPongPreview(controller: AnyRecord): void {
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
  const originalSetStage = prototype.setStage as (stage: CampaignMetaState['questStage'], event?: string) => void;
  prototype.setStage = function progressionSetStage(stage: CampaignMetaState['questStage'], event?: string): void {
    originalSetStage.call(this, stage, event);
    if (stage === 'free-weekend') introduceFlipCup(this as unknown as MetaInternals);
  };
  const originalAuthority = prototype.winAuthorityBattle as () => void;
  prototype.winAuthorityBattle = function rewardedAuthorityVictory(): void {
    originalAuthority.call(this);
    grantBattleReward('authority', 'Gundula gibt widerwillig einen Gegenstand aus der Fundsachenkiste frei.');
  };
  const originalMini = prototype.recordMiniGame as (id: string, success: boolean, score: number, event: string, quality?: string) => void;
  prototype.recordMiniGame = function rewardedMiniGame(id: string, success: boolean, score: number, event: string, quality?: string): void {
    const before = (this as CampaignMetaStore).snapshot();
    originalMini.call(this, id, success, score, event, quality);
    const meta = this as unknown as MetaInternals;
    introduceNextGame(meta, id, before);
    if (success && id === 'ronnyBattle') {
      const attempt = meta.state.miniResults[id]?.attempts ?? 1;
      grantBattleReward(`ronny-${attempt}`, 'Ronny verliert das Frustduell und erklärt den Preis rückwirkend zur Strategie.');
    }
  };
  const originalConversation = prototype.conversation as (id: string) => number;
  prototype.conversation = function rewardedConversation(characterId: string): number {
    const count = originalConversation.call(this, characterId);
    rollConversationGift(this as unknown as MetaInternals, characterId, count);
    return count;
  };
  const originalSaturday = prototype.winSaturdayBrawl as () => void;
  prototype.winSaturdayBrawl = function rewardedSaturdayBrawl(): void {
    originalSaturday.call(this);
    grantBattleReward('saturday-brawl', 'Zwischen Klemmbrett und Würderesten liegt überraschend brauchbare Beute.');
  };
  const originalFinal = prototype.winFinalBattle as () => void;
  prototype.winFinalBattle = function rewardedFinalBattle(): void {
    originalFinal.call(this);
    grantBattleReward('sunday-final', 'Die bestandene Abnahme endet mit einem Gegenstand aus der offiziellen Inoffiziell-Kiste.');
  };
}

function introduceFlipCup(meta: MetaInternals): void {
  if (meta.state.flags['minigame-introduced-flipCup']) return;
  meta.state.flags['minigame-introduced-flipCup'] = true;
  meta.state.lastEvent = 'André stellt am Zeltkreis Becher auf: Flip Cup ist die erste Disziplin.';
  meta.emit();
  showStoryCard('NEUE DISZIPLIN', 'André eröffnet Flip Cup', 'Spiele Flip Cup mindestens einmal. Danach führt Susi Beer Pong ein.');
}

function introduceNextGame(meta: MetaInternals, id: string, before: CampaignMetaState): void {
  if (id === 'flipCup' && !meta.state.flags['minigame-introduced-beerPong']) {
    meta.state.flags['minigame-introduced-beerPong'] = true;
    meta.state.lastEvent = 'Susi erklärt: Beer Pong ist jetzt auf der Festwiese freigeschaltet.';
    meta.emit();
    queueStoryCard('NEUE DISZIPLIN', 'Susi führt Beer Pong ein', 'Vor jedem Wurf wird ausdrücklich zwischen normalem Wurf und Aufsetzer gewählt.');
  }
  if (id === 'beerPong' && !meta.state.flags['minigame-introduced-flunkyball']) {
    meta.state.flags['minigame-introduced-flunkyball'] = true;
    meta.state.lastEvent = 'Lars und Felix verlegen die nächste Eskalationsstufe an den Strand: Flunkyball ist freigeschaltet.';
    meta.emit();
    queueStoryCard('NEUE DISZIPLIN', 'Flunkyball zieht an den Strand', 'Absolviere die dritte Disziplin; danach bleiben alle großen Spiele dauerhaft aktiv.');
  }
  if (id === 'flunkyball' && !before.flags['all-core-minigames-unlocked']) {
    meta.state.flags['all-core-minigames-unlocked'] = true;
    meta.state.flags['minigame-introduced-ronnyBattle'] = true;
    meta.state.lastEvent = 'Alle großen Minispiele bleiben aktiv. Ronny akzeptiert nun ein Frustduell.';
    meta.emit();
    queueStoryCard('SPIELEABEND VOLLSTÄNDIG', 'Alles bleibt spielbar', 'Flip Cup, Beer Pong und Flunkyball bleiben dauerhaft aktiv. Ronnys Frustduell ist freigeschaltet.');
  }
}

function rollConversationGift(meta: MetaInternals, characterId: string, count: number): void {
  if (!capturedStore || meta.state.flags[`conversation-gift-${characterId}-${meta.state.questStage}`]) return;
  const rollKey = `conversation-gift-roll-${characterId}-${meta.state.questStage}-${Math.min(count, 3)}`;
  if (meta.state.flags[rollKey]) return;
  meta.state.flags[rollKey] = true;
  if (random01() <= conversationGiftChance(count)) {
    meta.state.flags[`conversation-gift-${characterId}-${meta.state.questStage}`] = true;
    const reward = pickWeightedReward(conversationRewardPool(characterId), random01());
    if (reward) grantItem(reward.id, reward.amount, `${characterLabel(characterId)} schenkt dir ${reward.amount}× ${ITEMS[reward.id]?.label ?? reward.id}.`, 'gift');
  }
  meta.emit();
}

function grantBattleReward(key: string, story: string): void {
  const meta = campaignMeta as unknown as MetaInternals;
  const flag = `battle-reward-${key}`;
  if (meta.state.flags[flag]) return;
  meta.state.flags[flag] = true;
  const reward = pickWeightedReward(BATTLE_REWARDS, random01());
  if (reward) grantItem(reward.id, reward.amount, `${story} Du erhältst ${reward.amount}× ${ITEMS[reward.id]?.label ?? reward.id}.`, 'battle');
  meta.emit();
}

function grantItem(id: string, amount: number, text: string, source: 'battle' | 'gift'): boolean {
  if (!capturedStore || !ITEMS[id] || amount <= 0) return false;
  capturedStore.state.inventory[id] = Math.min(99, Number(capturedStore.state.inventory[id] ?? 0) + amount);
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

function conversationRewardPool(id: string): WeightedReward[] {
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
  return pools[id] ?? BATTLE_REWARDS.filter((entry) => entry.id !== 'batida');
}

function installIntroPacing(): void {
  const observer = new MutationObserver(patchIntroPacing);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  window.addEventListener('load', patchIntroPacing);
  patchIntroPacing();
}

function patchIntroPacing(): void {
  const space = document.querySelector('.opening-v5-space');
  if (!(space instanceof HTMLElement) || space.dataset.pacingV6) return;
  space.dataset.pacingV6 = '1';
  const stored = Number(localStorage.getItem('tales-blaue-adria-intro-duration-v6'));
  const duration = [48000, 68000, 78000].includes(stored) ? stored : 68000;
  applyIntroDuration(space, duration, false);
  const controls = space.querySelector('.opening-v5-intro-controls');
  if (!controls) return;
  const pacing = document.createElement('div');
  pacing.className = 'progression-v6-intro-speed';
  pacing.innerHTML = '<span>LESEGESCHWINDIGKEIT</span><button data-intro-duration="78000">Sehr ruhig</button><button data-intro-duration="68000">Ruhig</button><button data-intro-duration="48000">Schnell</button>';
  controls.prepend(pacing);
  pacing.querySelectorAll<HTMLButtonElement>('[data-intro-duration]').forEach((button) => button.addEventListener('click', () => applyIntroDuration(space, Number(button.dataset.introDuration), true)));
  refreshIntroButtons(space, duration);
}

function applyIntroDuration(space: HTMLElement, duration: number, restart: boolean): void {
  space.style.setProperty('--crawl-duration', `${duration}ms`);
  space.dataset.introDuration = String(duration);
  localStorage.setItem('tales-blaue-adria-intro-duration-v6', String(duration));
  refreshIntroButtons(space, duration);
  if (!restart) return;
  space.querySelectorAll<HTMLElement>('.opening-v5-prelude,.opening-v5-logo,.opening-v5-crawl').forEach((node) => {
    node.style.animation = 'none'; void node.offsetWidth; node.style.animation = '';
  });
}

function refreshIntroButtons(space: HTMLElement, duration: number): void {
  space.querySelectorAll<HTMLButtonElement>('[data-intro-duration]').forEach((button) => button.classList.toggle('selected', Number(button.dataset.introDuration) === duration));
}

function installDomPatches(): void {
  const observer = new MutationObserver(queuePatch);
  observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['hidden'] });
  window.addEventListener('load', queuePatch);
  window.setInterval(() => { patchObjectiveUi(); patchMinimapObjective(); }, 360);
  queuePatch();
}

function queuePatch(): void {
  if (patchQueued) return;
  patchQueued = true;
  window.setTimeout(() => {
    patchQueued = false;
    patchObjectiveUi(); patchRonnyGate(); patchIntroPacing();
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
  const ctx = canvas.getContext('2d');
  if (!target || !ctx) return;
  const x = target.x * canvas.width / 2600;
  const y = target.y * canvas.height / 1800;
  ctx.save(); ctx.fillStyle = '#f5cb56'; ctx.strokeStyle = '#5a4511'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(x, y, 7, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.restore();
}

function patchRonnyGate(): void {
  const modal = document.getElementById('generic-modal');
  if (!modal || modal.hidden || document.getElementById('modal-title')?.textContent !== 'Rivalen-Ronny') return;
  const gate = minigameUnlockState(campaignMeta.snapshot(), 'ronnyBattle');
  if (gate.unlocked) return;
  const button = [...modal.querySelectorAll('button')].find((entry) => entry.textContent?.includes('Frustduell beginnen'));
  if (!(button instanceof HTMLButtonElement)) return;
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
  return ['flipCup', 'beerPong', 'flunkyball', 'hedgePee', 'maslHole', 'ronnyBattle'].includes(normalized) ? normalized as UnlockableGameId : undefined;
}

function queueStoryCard(kicker: string, title: string, text: string): void { pendingStoryCard = { kicker, title, text }; }

function showStoryCard(kicker: string, title: string, text: string): void {
  document.getElementById('progression-v6-story')?.remove();
  const card = document.createElement('section');
  card.id = 'progression-v6-story'; card.className = 'progression-v6-story';
  card.innerHTML = `<article><span>${escapeHtml(kicker)}</span><h2>${escapeHtml(title)}</h2><p>${escapeHtml(text)}</p><button type="button">Verstanden</button></article>`;
  document.body.append(card); document.body.classList.add('campaign-modal-open');
  card.querySelector('button')?.addEventListener('click', () => {
    card.remove();
    const another = [...document.querySelectorAll<HTMLElement>('.modal')].some((modal) => !modal.hidden);
    document.body.classList.toggle('campaign-modal-open', another);
  });
}

function showRewardToast(id: string, amount: number, source: 'battle' | 'gift', text: string): void {
  const item = ITEMS[id];
  const node = document.createElement('aside'); node.className = 'progression-v6-reward';
  node.innerHTML = `<span>${item?.icon ?? '🎁'}</span><div><small>${source === 'battle' ? 'FRUSTKAMPF-BELOHNUNG' : 'GESCHENK ERHALTEN'}</small><strong>${amount}× ${escapeHtml(item?.label ?? id)}</strong><p>${escapeHtml(text)}</p></div>`;
  document.body.append(node); window.setTimeout(() => node.classList.add('visible'), 20);
  window.setTimeout(() => { node.classList.remove('visible'); window.setTimeout(() => node.remove(), 320); }, 4200);
}

function showToast(text: string): void {
  document.getElementById('progression-v6-toast')?.remove();
  const node = document.createElement('div'); node.id = 'progression-v6-toast'; node.className = 'progression-v6-toast'; node.textContent = text;
  document.body.append(node); window.setTimeout(() => node.classList.add('visible'), 10);
  window.setTimeout(() => { node.classList.remove('visible'); window.setTimeout(() => node.remove(), 250); }, 3000);
}

function random01(): number {
  if (debugRandomQueue.length) return clamp(Number(debugRandomQueue.shift()), 0, .999999);
  if (globalThis.crypto?.getRandomValues) { const data = new Uint32Array(1); globalThis.crypto.getRandomValues(data); return data[0] / 0x100000000; }
  return Math.random();
}

function characterLabel(id: string): string { return CAMPAIGN_CHARACTER_BY_ID[id]?.name ?? id; }
function escapeHtml(value: string): string { return String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character] ?? character); }
function clamp(value: number, min: number, max: number): number { return Math.max(min, Math.min(max, value)); }

function exposeDiagnostics(): void {
  const query = new URLSearchParams(location.search);
  if (!query.has('smoke') && !query.has('progression')) return;
  (window as unknown as AnyRecord).__lpcProgressionV6 = {
    version: PROGRESSION_FLOW_VERSION,
    snapshot(): AnyRecord {
      const meta = campaignMeta.snapshot();
      return {
        objective: campaignMeta.objective(), unlocked: unlockedMinigames(meta), allCore: allCoreMinigamesUnlocked(meta),
        enabledStory: ALL_INTERACTIONS.filter((entry) => entry.kind === 'story' && entry.radius > 0).map((entry) => entry.id),
        enabledMinigames: ALL_INTERACTIONS.filter((entry) => entry.kind === 'minigame' && entry.radius > 0).map((entry) => entry.id),
        questMarkers: objectiveMarkerCount, blockedStarts,
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
    recordMini(id: string, success = true): void { campaignMeta.recordMiniGame(id, success, success ? 120 : 20, `Debug progression result for ${id}.`, success ? 'solid' : 'failed'); },
    setRandom(...values: number[]): void { debugRandomQueue.push(...values); },
    grantBattle(key = 'debug'): void { grantBattleReward(key, 'Debug-Frustkampf abgeschlossen.'); },
    conversation(id: string): number { return campaignMeta.conversation(id); },
    closeStory(): void { document.querySelector<HTMLButtonElement>('#progression-v6-story button')?.click(); },
    refresh(): void { refreshInteractionRadii(); markerRefreshers.forEach((refresh) => refresh()); queuePatch(); },
  };
}

import {
  COMBAT_MOVES,
  MAX_EQUIPPED_ATTACKS,
  STARTER_ATTACK,
  equippedAttackFlag,
  equippedAttackIds,
  learnedAttackFlag,
  learnedAttackIds,
} from './combatMoves';
import { mutateStore } from './storeAdapter';
import type { GameStore } from './state/GameStore';
import type { CombatMoveId, GameSnapshot } from './types';

export interface AttackToggleResult {
  ok: boolean;
  equipped: boolean;
  reason?: string;
}

export function learnAttack(store: GameStore, id: CombatMoveId, source?: string): boolean {
  let learned = false;
  mutateStore(store, (state) => {
    const key = learnedAttackFlag(id);
    if (id === STARTER_ATTACK || state.flags[key]) return;
    state.flags[key] = true;
    learned = true;

    const active = equippedAttackIds({ flags: state.flags });
    if (active.length < MAX_EQUIPPED_ATTACKS) state.flags[equippedAttackFlag(id)] = true;

    const previousId = state.chronicle.at(-1)?.id ?? 0;
    state.chronicle.push({
      id: previousId + 1,
      day: state.day,
      minutes: state.minutes,
      text: `Neue Attacke gelernt: ${source ?? COMBAT_MOVES[id].label}.`,
      tone: 'good',
    });
  });
  return learned;
}

export function toggleEquippedAttack(store: GameStore, id: CombatMoveId): AttackToggleResult {
  let result: AttackToggleResult = { ok: false, equipped: false, reason: 'Attacke ist noch nicht gelernt.' };
  mutateStore(store, (state) => {
    const learned = learnedAttackIds({ flags: state.flags });
    if (!learned.includes(id)) return;

    const key = equippedAttackFlag(id);
    const active = equippedAttackIds({ flags: state.flags });
    const isActive = active.includes(id);
    if (isActive) {
      if (active.length <= 1) {
        result = { ok: false, equipped: true, reason: 'Mindestens eine Attacke muss ausgerüstet bleiben.' };
        return;
      }
      state.flags[key] = false;
      result = { ok: true, equipped: false };
      return;
    }

    if (active.length >= MAX_EQUIPPED_ATTACKS) {
      result = { ok: false, equipped: false, reason: 'Maximal vier Attacken können gleichzeitig ausgerüstet sein.' };
      return;
    }
    state.flags[key] = true;
    result = { ok: true, equipped: true };
  });
  return result;
}

export function installCombatProgressRuntime(store: GameStore): () => void {
  let syncing = false;
  return store.subscribe((snapshot) => {
    if (syncing) return;
    let current = snapshot;

    if (!current.flags['attack-loadout-initialized']) {
      syncing = true;
      mutateStore(store, (state) => {
        state.flags['attack-loadout-initialized'] = true;
        state.flags[equippedAttackFlag(STARTER_ATTACK)] = true;
      });
      syncing = false;
      current = store.snapshot();
    }

    const automatic: Array<[boolean, CombatMoveId, string]> = [
      [Boolean(current.flags.entryDebateWon), 'aldi-shirt-show', 'Aldi-T-Shirt präsentieren'],
      [Boolean(current.flags.flipCupWon), 'synchronised-cheer', 'Synchroner Gruppen-Zuruf'],
      [Boolean(current.flags.beerPongWon), 'cup-eye-contact', 'Becher-Blickkontakt'],
      [Boolean(current.flags.flunkyballWon), 'total-exaggeration', 'Komplett übertreiben'],
    ];
    const missing = automatic.filter(([condition, id]) => condition && !attackIsLearned(current, id));
    if (!missing.length) return;
    syncing = true;
    for (const [, id, label] of missing) learnAttack(store, id, label);
    syncing = false;
  });
}

export function attackIsLearned(snapshot: Pick<GameSnapshot, 'flags'>, id: CombatMoveId): boolean {
  return id === STARTER_ATTACK || Boolean(snapshot.flags[learnedAttackFlag(id)]);
}

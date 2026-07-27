import {
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

    const snapshot = store.snapshot();
    if (equippedAttackIds(snapshot).length < MAX_EQUIPPED_ATTACKS) {
      state.flags[equippedAttackFlag(id)] = true;
    }

    const previousId = state.chronicle.at(-1)?.id ?? 0;
    state.chronicle.push({
      id: previousId + 1,
      day: state.day,
      minutes: state.minutes,
      text: `Neue Attacke gelernt: ${source ?? id}.`,
      tone: 'good',
    });
  });
  return learned;
}

export function toggleEquippedAttack(store: GameStore, id: CombatMoveId): AttackToggleResult {
  let result: AttackToggleResult = { ok: false, equipped: false, reason: 'Attacke ist noch nicht gelernt.' };
  mutateStore(store, (state) => {
    const snapshot = store.snapshot();
    const learned = learnedAttackIds(snapshot);
    if (!learned.includes(id)) return;

    const key = equippedAttackFlag(id);
    const active = equippedAttackIds(snapshot);
    if (state.flags[key] || (id === STARTER_ATTACK && active.includes(id) && !state.flags[key])) {
      if (active.length <= 1) {
        result = { ok: false, equipped: true, reason: 'Mindestens eine Attacke muss ausgerüstet bleiben.' };
        return;
      }
      state.flags[key] = false;
      if (id === STARTER_ATTACK) state.flags['attack-starter-explicitly-unequipped'] = true;
      result = { ok: true, equipped: false };
      return;
    }

    if (active.length >= MAX_EQUIPPED_ATTACKS) {
      result = { ok: false, equipped: false, reason: 'Maximal vier Attacken können gleichzeitig ausgerüstet sein.' };
      return;
    }
    state.flags[key] = true;
    if (id === STARTER_ATTACK) state.flags['attack-starter-explicitly-unequipped'] = false;
    result = { ok: true, equipped: true };
  });
  return result;
}

export function installCombatProgressRuntime(store: GameStore): () => void {
  let syncing = false;
  return store.subscribe((snapshot) => {
    if (syncing) return;
    const automatic: Array<[boolean, CombatMoveId, string]> = [
      [Boolean(snapshot.flags.entryDebateWon), 'aldi-shirt-show', 'Aldi-T-Shirt präsentieren'],
      [Boolean(snapshot.flags.flipCupWon), 'synchronised-cheer', 'Synchroner Gruppen-Zuruf'],
      [Boolean(snapshot.flags.beerPongWon), 'cup-eye-contact', 'Becher-Blickkontakt'],
      [Boolean(snapshot.flags.flunkyballWon), 'total-exaggeration', 'Komplett übertreiben'],
    ];
    const missing = automatic.filter(([condition, id]) => condition && !attackIsLearned(snapshot, id));
    if (!missing.length) return;
    syncing = true;
    for (const [, id, label] of missing) learnAttack(store, id, label);
    syncing = false;
  });
}

export function attackIsLearned(snapshot: Pick<GameSnapshot, 'flags'>, id: CombatMoveId): boolean {
  return id === STARTER_ATTACK || Boolean(snapshot.flags[learnedAttackFlag(id)]);
}

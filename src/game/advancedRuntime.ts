import { FRIEND_ID_SET, installAdvancedContent } from './advancedContent';
import { conditionSummary, statusModifiers } from './statusSystem';
import { applySystemEffects, sanitizeTeam } from './storeAdapter';
import type { GameStore } from './state/GameStore';
import type { GameSnapshot, TeamMember } from './types';

const installedStores = new WeakSet<object>();

export function installAdvancedSystemsRuntime(store: GameStore): void {
  installAdvancedContent();
  if (installedStores.has(store)) return;
  installedStores.add(store);
  sanitizeTeam(store, FRIEND_ID_SET, 3);

  const originalSnapshot = store.snapshot.bind(store);
  (store as unknown as { snapshot: () => GameSnapshot }).snapshot = (): GameSnapshot => {
    const snapshot = originalSnapshot();
    return { ...snapshot, conditionLabel: conditionSummary(snapshot.needs) };
  };

  const originalAdvance = store.advanceMinutes.bind(store);
  store.advanceMinutes = (minutes: number): void => {
    const before = store.snapshot();
    originalAdvance(minutes);
    const drain = statusModifiers(before.needs).energyDrain;
    const extra = Math.max(0, (minutes / 60) * 5 * (drain - 1));
    if (extra >= 0.15) {
      applySystemEffects(store, { needs: { energy: -extra } });
    }
  };

  const originalRecord = store.recordActivity.bind(store);
  store.recordActivity = (activity, success, quality = 'solid', score = 0): void => {
    originalRecord(activity, success, quality, score);
    const alcohol = activity === 'flipCup' ? 12 : activity === 'beerPong' ? 14 : activity === 'flunkyball' ? 18 : 0;
    if (alcohol) {
      applySystemEffects(store, {
        needs: { alcohol, bladder: Math.round(alcohol * 0.65), courage: Math.round(alcohol * 0.25) },
        metrics: { chaos: success ? 2 : 3 },
      }, `${activity} verändert den Pegel auch außerhalb des Minispiels.`, 'neutral');
    }
    sanitizeTeam(store, FRIEND_ID_SET, 3);
  };

  const originalRecruit = store.recruit.bind(store);
  store.recruit = (member: TeamMember): void => {
    if (!FRIEND_ID_SET.has(member.id as never)) return;
    if (store.snapshot().team.length >= 3) return;
    originalRecruit(member);
  };

  const originalClose = store.closeEncounter.bind(store);
  store.closeEncounter = (): void => {
    originalClose();
    sanitizeTeam(store, FRIEND_ID_SET, 3);
  };
}

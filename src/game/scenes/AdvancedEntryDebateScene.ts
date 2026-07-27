import { gameStore } from '../state/GameStore';
import { FrustrationBattleSceneBase } from './FrustrationBattleSceneBase';

export class AdvancedEntryDebateScene extends FrustrationBattleSceneBase {
  constructor() {
    super(
      'entry-debate',
      'entry-authority',
      'HAUPTSCHRANKE · VERWALTUNG GEGEN RESTVERNUNFT',
      'EINLASS-FRUSTRATIONSKAMPF',
    );
  }

  protected onVictory(): void {
    gameStore.setFlag('entryDebateWon');
    gameStore.setFlag('taucherplatzAssigned');
    gameStore.setFlag('gateOpen');
    gameStore.advanceMinutes(14);
    this.cameras.main.flash(380, 244, 212, 123, false);
    this.showFinalMessage('Gundula und Uli erreichen maximalen Frust. Gundula verschiebt die Mehrkosten auf Sonntag, Uli öffnet die Schranke. Neue Attacke gelernt: Aldi-T-Shirt präsentieren.', 1900);
  }

  protected onDefeat(): void {
    gameStore.setFlag('entryDebateFailed');
    gameStore.advanceMinutes(8);
    this.showFinalMessage('Du bist vollständig frustriert. Die Verwaltung gewinnt diese Runde; ein neuer Versuch bleibt möglich.', 1600);
  }

  protected onWithdraw(): void {
    gameStore.setFlag('entryDebateWithdrew');
    gameStore.advanceMinutes(5);
    this.showFinalMessage('Taktischer Rückzug. Die Schranke bleibt geschlossen und der eigene Frust sinkt erst außerhalb des Kampfes.', 1200);
  }
}

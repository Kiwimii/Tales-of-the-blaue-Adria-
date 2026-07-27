import { gameStore } from '../state/GameStore';
import { FrustrationBattleSceneBase } from './FrustrationBattleSceneBase';

export class AdvancedBattleScene extends FrustrationBattleSceneBase {
  constructor() {
    super(
      'battle',
      'ronny',
      'HAUPTWEG · DISKUSSION GEGEN GEDULD',
      'CAMPING-FRUSTRATIONSKAMPF',
    );
  }

  protected onVictory(): void {
    gameStore.recordActivity('battle', true);
    this.showFinalMessage('Ronny ist vollständig frustriert und verliert den roten Faden. Er respektiert die Technik und schließt sich der Gruppe an.', 1800);
  }

  protected onDefeat(): void {
    gameStore.recordActivity('battle', false);
    this.showFinalMessage('Du erreichst maximalen Frust. Ronny redet weiter, die Quest bleibt offen und die Gruppe zieht sich zurück.', 1700);
  }

  protected onWithdraw(): void {
    gameStore.recordActivity('battle', false);
    this.showFinalMessage('Taktischer Rückzug. Ronny wertet das als Bestätigung seiner letzten sechs Punkte.', 1200);
  }
}

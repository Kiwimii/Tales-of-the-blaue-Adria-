# Sprint 75 · Berührungssichere Gespräche

## Fehlerbild

Beim Öffnen von Gundulas Gespräch über die rechte mobile Aktionsfläche wurde bereits während `pointerdown` die Begegnung erzeugt. Der Finger lag zu diesem Zeitpunkt noch auf dem Display. Das folgende `pointerup` beziehungsweise der synthetische Klick konnte dadurch eine inzwischen unter dem Finger eingeblendete Antwort auswählen. Der Spieler sah direkt das Ergebnis und blieb im noch geöffneten Encounter gebunden.

## Umsetzung

- Die mobile Aktion wird erst nach einer vollständig abgeschlossenen kurzen Tap-Geste ausgelöst.
- Das Öffnen der Interaktion erfolgt in einem neuen Event-Takt nach Ende der Berührung.
- Größere Fingerbewegungen auf der rechten Seite werden nicht als Aktion gewertet.
- Neu geöffnete Dialoge besitzen eine kurze Eingabesperre von 420 Millisekunden.
- Die Eingabesperre schützt alle Antwortflächen gegen das auslösende Touch-Ereignis.
- Beim Öffnen, Auflösen und Schließen eines Encounters werden alle mobilen Richtungen freigegeben.
- Die Ergebnisansicht erhält eine eindeutige Schaltfläche „Gespräch schließen und weiterlaufen“.
- Das bestehende X bleibt als zusätzlicher Rückweg verfügbar.

## Qualität

Die Tests prüfen die Abgrenzung zwischen kurzem Tap und Wischbewegung sowie die zeitliche Dialogsperre. TypeScript, vollständige Tests, Produktionsbuild, Next-Build und Release-Validator müssen vor dem Merge erfolgreich sein.

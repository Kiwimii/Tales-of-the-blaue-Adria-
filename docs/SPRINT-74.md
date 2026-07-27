# Sprint 74 · Mobile Steuerung und universelle Fensternavigation

## Ziel

Die mobile Bedienung wird von sichtbaren Richtungstasten auf eine direkte, relative Wischsteuerung umgestellt. Gleichzeitig erhält jede geöffnete Spielszene einen verlässlichen Rückweg in die Weltansicht.

## Umsetzung

- Das alte Steuerkreuz und der rote Aktionsknopf werden vollständig ausgeblendet.
- Die linke untere Bildschirmhälfte dient als relativer Bewegungsbereich.
- Der Startpunkt der Berührung wird zum temporären Mittelpunkt eines virtuellen Joysticks.
- Die Figur bewegt sich nur durch eine tatsächliche Wischbewegung; bloßes Antippen löst keine Bewegung aus.
- Horizontale, vertikale und diagonale Bewegung werden unterstützt.
- Die rechte Bildschirmhälfte ist eine großflächige Aktionszone.
- Jede Berührung rechts löst die aktuell nächstgelegene Interaktion aus.
- Ein globales X wird auf allen Phaser-Unteransichten eingeblendet: Reservierungsbrett, Kämpfe, soziale Ansichten, Innenräume und Minispiele.
- Escape verwendet dieselbe zentrale Rückkehrlogik.
- Begegnungs- und Beziehungsfenster erhalten ebenfalls ein X.
- Die Rückkehrlogik stoppt die aktive Unteransicht, bereinigt den Innenraumzustand und startet zuverlässig die Weltansicht.

## Architektur

Die mobile Eingabe bleibt über die bestehenden Richtungs- und Aktionsereignisse mit der Welt gekoppelt. Die Interpretation einer Wischbewegung liegt in einem reinen, getesteten Modul. Globale UI-Elemente werden über React-Portale in den vorhandenen Spielrahmen und in bestehende Dialogfenster eingebunden. Dadurch müssen einzelne Phaser-Szenen keine eigenen Schließen-Schaltflächen mehr implementieren.

## Qualität

Die Tests prüfen Deadzone, vier Hauptrichtungen, diagonale Bewegung und die Begrenzung der visuellen Joystickbewegung. TypeScript, vollständige Tests, Produktionsbuild, Next-Build und Release-Validator müssen vor dem Merge erfolgreich sein.

# Sprint 85 – Aufgabenorientierte UX und konsistente Spieloberfläche

## Ausgangslage

Die technische UI-Architektur war bereits getrennt, die konkrete Bedienung aber weiterhin uneinheitlich:

- Das HUD zeigte Zeit, Ziel, Status und Warnungen mit ähnlicher visueller Gewichtung.
- Die mobile Aktion belegte eine große unsichtbare Bildschirmhälfte und gab nur eine generische Rückmeldung.
- Dialogantworten zeigten Prozentwerte, aber keine verständliche Risikostufe oder visuelle Relation.
- Das Spielmenü nutzte dieselbe horizontale Tabstruktur auf Desktop und Smartphone.
- Inventar, Team, Attacken und Systemfunktionen verwendeten unterschiedliche Karten- und Buttonmuster.

## Gemeinsames UX-Modell

`src/game/uxPresentation.ts` ist die zentrale Präsentationslogik für:

- sichere, offene und riskante Erfolgswahrscheinlichkeiten,
- verständliche Risikobezeichnungen,
- kurze Aktionsbeschriftungen,
- kompakte Zieltexte im HUD.

Dialoge, mobile Aktionen und zukünftige Kampfoberflächen sollen diese Regeln verwenden, statt eigene Grenzwerte oder Begriffe einzuführen.

## Fokussiertes HUD

Die Spielfläche bleibt das dominante Element. Das HUD besteht aus drei klaren Bereichen:

1. Tag, Phase und Uhrzeit,
2. anklickbares aktuelles Ziel,
3. echte Warnungen beziehungsweise Zustand und Menüzugang.

Die Zielkarte öffnet direkt die Übersicht. Auf Desktop erscheint eine dezente Tastaturhilfe für Bewegung, Aktion und Karte. Auf kleinen Displays werden Statuschips ausgeblendet, bevor das eigentliche Ziel gekürzt wird.

## Mobile Steuerung

Die rechte Bildschirmhälfte ist keine unsichtbare Aktionstaste mehr.

Die neue Steuerung besitzt:

- eine breite Wischfläche links unten,
- einen visuellen Joystick nur während der Bewegung,
- eine klar sichtbare Aktionstaste rechts unten,
- die konkrete Beschriftung der erreichbaren Interaktion,
- ein zusätzliches Kontextsignal oberhalb der Taste,
- Safe-Area-Abstände und mindestens 44 Pixel große Touchziele.

Eine Aktion wird weiterhin gegen unbeabsichtigtes Ziehen und mehrfaches Auslösen geschützt.

## Dialogentscheidungen

Jede Antwort zeigt:

- eine Tastaturnummer,
- Titel und inhaltlichen Hinweis,
- Prozentchance,
- die Bezeichnung „Gute Chance“, „Offener Ausgang“ oder „Hohes Risiko“,
- einen proportionalen Chancenbalken,
- einen klaren Sperrstatus bei fehlenden Voraussetzungen.

Antworten können über die Tasten 1 bis 9 gewählt werden. Escape verlässt das Gespräch. Ergebnisse trennen Text, Würfelwert, berechnete Chance und Rückkehraktion deutlich voneinander.

## Spielmenü

Auf Desktop nutzt das Menü eine dauerhafte Seitennavigation. Auf Mobilgeräten wird daraus eine horizontal scrollbare Tab-Leiste.

Die Tabs zeigen zusätzlich:

- Anzahl der Inventargegenstände,
- aktive Teamgröße,
- belegte Kampfslots,
- bekannte Beziehungen.

Die Bereiche wurden vereinheitlicht:

- Status und Ziele verwenden Highlightkarten.
- Teammitglieder besitzen Moralbalken und kompakte Bonuschips.
- Attacken zeigen Trefferchance und Frustwert getrennt.
- Systemaktionen verwenden Icon, Titel und Erklärung im selben Muster.

Tasten 1 bis 6 wechseln direkt zwischen den Menüpunkten. Links- und Rechtspfeil wechseln zum vorherigen beziehungsweise nächsten Bereich.

## Barrierefreiheit und Responsive Design

Sprint 85 ergänzt:

- deutlichere Fokusrahmen,
- reduzierte Animationen bei `prefers-reduced-motion`,
- ausreichend große Touchziele,
- klare Kontraststufen,
- bottom-sheet-artige Dialoge und Menüs auf kleinen Smartphones,
- zweistufige Informationsreduktion statt gleichmäßiger Verkleinerung aller Elemente.

## Verbindliche Regeln

1. Neue HUD-Informationen dürfen das Ziel nicht verdrängen.
2. Mobile Hauptaktionen benötigen eine sichtbare Schaltfläche und eine konkrete Beschriftung.
3. Erfolgswahrscheinlichkeiten verwenden die gemeinsame Risikologik.
4. Neue Menüpunkte müssen Desktop- und Mobile-Navigation unterstützen.
5. Touchziele dürfen in der Hauptbedienung nicht kleiner als 44 Pixel sein.
6. Neue Animationen benötigen eine Reduced-Motion-Alternative.
7. Ein neuer Dialog darf keine eigene, abweichende Button- und Ergebnislogik einführen.

## Automatische Prüfung

Die Tests prüfen die gemeinsamen Risikostufen, gekürzte Aktionsbeschriftungen und kompakte Zieltexte. Der Next-Validator bestätigt zusätzlich, dass die Produktions-CSS die mobile Aktionsrückmeldung, die neue Menühierarchie und die Dialog-Chancenanzeige enthält.

Eine manuelle Prüfung auf realen iPhone- und Android-Geräten bleibt Teil der Release-Abnahme.

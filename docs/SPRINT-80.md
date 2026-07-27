# Sprint 80 – Gemeinsamer Platzplan und zuverlässige Steuerungsrückkehr

## Problem

Die Außenwelt war aus mehreren historisch gewachsenen Koordinatensystemen zusammengesetzt:

- rechteckige Regionen in `worldV2.ts`
- eigene Straßenkoordinaten in der Grafikschicht
- nachträgliche Objekt-Overrides
- getrennte NPC-, Eingangs- und Landmarkenpositionen
- nochmals eigene Ankunfts- und Questanker
- zusätzliche Dekoration mit fest eingetragenen Positionen

Lokale Korrekturen konnten einzelne Blockaden entfernen, erzeugten aber keinen logisch zusammenhängenden Campingplatz.

Zusätzlich blieb nach dem Schließen des Gundula-Begegnungsfensters auf einigen Geräten die Welt sichtbar, während Phaser-Eingabe oder Spieler-Body nicht mehr zuverlässig auf Bewegungsbefehle reagierten.

## Neue Platzarchitektur

`src/game/campgroundPlan.ts` ist die zentrale Planungsebene.

Der Plan enthält:

- benannte Straßenknoten
- ausschließlich rechtwinklige Straßenverbindungen
- klar definierte Oberflächenbreiten
- geordnete Parzellen und Funktionsflächen
- semantische Positionen für Objekte
- gemeinsame NPC-Positionen
- gemeinsame Eingangspositionen
- gemeinsame Landmarken- und Questanker

Der Hauptweg führt von der Einfahrt über Parkplatz und Schranke durch Süd- und Nordlager. Von dieser Hierarchie zweigen klare Verbindungen zu Taucherplatz, Festwiese, Strand, Werkstatt und Bucht ab.

`src/game/campgroundAccessPlan.ts` ergänzt die feineren Fußwege zu Rezeption, Sanitärgebäude, eigenem Zelt und Partyzelt. Diese Zugangswege gehören zum selben Straßengraphen und werden mitgeprüft.

## Darstellung

`src/game/campgroundPlanLayer.ts` rendert den Platz aus diesem Plan:

- zusammenhängende Bodenflächen statt zufälliger Freiforminseln
- klar erkennbare Haupt- und Nebenwege
- geordnete Stellplatzfelder
- getrennte Funktionsbereiche
- konsistente Oberflächen für Asphalt, Kies und Sand
- Details innerhalb der geplanten Bereiche statt unabhängig davon

Die bisherige Welt bleibt technisch erhalten, wird aber von der neuen Planebene überdeckt. Dadurch bleiben bestehende Spielstände, Quests und Inhalte kompatibel.

## Automatische Planprüfung

Die Tests prüfen:

- alle Straßenknoten sind miteinander verbunden
- jede Verbindung ist horizontal oder vertikal
- feste Objekte blockieren keine Straße
- NPCs stehen nicht mitten auf einem Weg
- Objekte bleiben in ihrer zugewiesenen Region
- jeder relevante Eingang besitzt einen erreichbaren Weganschluss
- Objekt-, NPC- und Eingangspositionen stammen aus der gemeinsamen Planung

## Steuerungs-Recovery nach Begegnungen

Beim Übergang von einem geöffneten Begegnungsfenster zurück zur Welt wird jetzt ausdrücklich:

- jeder gehaltene Richtungszustand gelöscht
- die Welt-Szene reaktiviert
- die Phaser-Eingabe aktiviert
- der Tastaturzustand zurückgesetzt
- die Physikwelt fortgesetzt
- der Spieler-Body aktiviert und neu synchronisiert
- Geschwindigkeit und Beschleunigung auf null gesetzt
- der Game-Loop geweckt
- der Fokus auf das Spiel-Canvas zurückgegeben

Der Recovery-Pfad gilt für Gundula und alle anderen React-basierten Begegnungsfenster.

## Kompatibilität

- keine Änderung des Speicherformats
- keine Entfernung bestehender Quests
- keine Änderung bestehender Questflags
- bestehende soziale Systeme, Kämpfe und Minispiele bleiben erhalten

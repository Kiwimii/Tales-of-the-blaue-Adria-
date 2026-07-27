# Sprint 81 – Kanonischer Campingplatz-Blueprint und robuste Steuerungsrückkehr

## Ausgangslage

Sprint 80 hatte zwar einen gemeinsamen Platzplan eingeführt, der aktive Weltaufbau bestand aber weiterhin aus mehreren hintereinander ausgeführten Ebenen:

1. historische Objekt-Overrides,
2. Platzplan-Positionen,
3. zusätzliche Zugangsweg-Overrides,
4. alte Straßen- und Geländezeichnung,
5. darübergelegte neue Planflächen.

Dadurch konnten Koordinaten technisch korrekt sein, während Geländeformen, Wege und Parzellen optisch trotzdem nicht als ein zusammenhängender Campingplatz wirkten. Eine lokale Verschiebung konnte außerdem an anderer Stelle durch eine spätere Ebene wieder überschrieben werden.

Nach dem Gundula-Begegnungsfenster konnte auf einzelnen Touchgeräten zusätzlich ein Zustand bestehen bleiben, in dem die Welt sichtbar war, aber Eingabe, Physik oder Spieler-Body nicht vollständig synchronisiert waren.

## Kanonischer Blueprint

`src/game/campgroundBlueprint.ts` ist jetzt die verbindliche Planungsquelle der aktiven Außenwelt.

Der Blueprint enthält gemeinsam:

- ein festes 50-Pixel-Planraster,
- sieben geradlinige Funktionszonen,
- benannte Straßenknoten,
- 27 zusammenhängende, rechtwinklige Straßen- und Fußwegsegmente,
- Oberflächen und Wegbreiten,
- Objektpositionen,
- NPC-Positionen,
- Eingänge,
- Landmarken,
- Ankunfts- und Questanker.

Die Hauptachse verläuft ohne Richtungsbruch von der Einfahrt über Parkplatz und Schranke durch Süd- und Nordlager. Rechtwinklige Nebenwege erschließen Rezeption, Sanitärgebäude, eigenes Zelt, Festwiese, Partyzelt, Strand, Werkstatt, Bucht und beide Stege.

## Einheitliche Darstellung

`src/game/campgroundBlueprintLayer.ts` zeichnet den Platz aus demselben Blueprint:

- zusammenhängende rechteckige Grundstücksbereiche,
- klare Grenzen zwischen Camping-, Festival-, Wald- und Uferbereichen,
- gerade Straßenkörper statt unabhängiger Freiformlinien,
- einheitliche Asphalt-, Kies- und Sandoberflächen,
- geordnete Stellplatzfelder,
- Details, die sich an Straßen und Zonen orientieren.

Der historische Renderer wird nur noch für die bereits vorhandenen Gebäude-, Zelt-, Baum- und Objektgrafiken verwendet. Seine alten Gelände- und Straßenflächen werden durch die Blueprint-Ebene vollständig ersetzt.

Die alten Module `campgroundPlan.ts`, `campgroundAccessPlan.ts` und `campgroundPlanLayer.ts` bleiben vorläufig als Migrationsreferenz erhalten, werden im aktiven Weltaufbau aber nicht mehr aufgerufen.

## Automatische Blueprint-Prüfung

Die Tests prüfen jetzt:

- alle Knoten gehören zu einem verbundenen Graphen,
- sämtliche Straßen verlaufen horizontal oder vertikal,
- Knoten und Zonen liegen auf dem Planraster,
- feste Objekte blockieren keine Straße,
- NPCs stehen nicht auf Verkehrsachsen,
- Objekte bleiben in ihrer Weltregion,
- jeder Eingang besitzt einen erreichbaren Weganschluss,
- Objekt-, Personen- und Eingangspositionen entsprechen dem aktiven Blueprint.

Der erste strenge Lauf meldete elf reale Konflikte. Gebäude, Zelte, Bäume, Wohnwagen und Strandmöbel wurden daraufhin aus den jeweiligen Straßenflächen versetzt. Die Prüfregeln wurden nicht abgeschwächt.

## Steuerungs-Recovery nach Gundula

Jede Schließaktion eines React-Begegnungsfensters sendet nun ausdrücklich `tales:recover-world-control`.

Die Wiederherstellung erfolgt:

- sofort,
- im nächsten Animationsframe,
- nach 60 Millisekunden,
- nach 180 Millisekunden.

Dabei werden zurückgesetzt oder reaktiviert:

- mobile Richtungszustände,
- Welt-Szene und Sichtbarkeit,
- Phaser-Szeneneingabe,
- globaler Phaser-Input,
- Tastaturzustand,
- Physikwelt,
- Game-Loop,
- Spieler-Sprite,
- Spieler-Body,
- Geschwindigkeit und Beschleunigung,
- Canvas-Fokus.

Dieser Pfad gilt nicht nur für Gundula, sondern für alle React-basierten Begegnungsfenster.

## Kompatibilität

- keine Änderung des Speicherformats,
- keine Entfernung von Quests oder Regionen,
- keine Änderung bestehender Questflags,
- Gespräche, Beziehungen, Kämpfe und Minispiele bleiben erhalten,
- bestehende Spielstände verwenden beim nächsten Weltaufbau automatisch den neuen Blueprint.

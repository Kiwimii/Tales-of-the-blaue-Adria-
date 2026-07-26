# Gameplay-Sprints 34–43

Stand: 26. Juli 2026

Diese zehn Sprints führen die Zielarchitektur als separat spielbare Next-Alpha weiter. Die vollständige Legacy-Alpha bleibt parallel am bisherigen Hauptlink erhalten.

## Sprint 34 – Der galaktisch unnötige Auftakt

- humorvoller, perspektivischer Weltraum-Schriftcrawl
- erzählerische Einführung in Campingplatz, Gruppe, Gundula und Uli
- Anhalten, Überspringen und Unterstützung für reduzierte Bewegung
- persistenter Intro-Status und jederzeit mögliche Wiederholung

## Sprint 35 – Eine Figur mit erkennbarer Fehlentscheidung

- neue Charaktererstellung mit Körperbau, Frisur und Accessoire
- kuratierte Farbpaletten plus freie Farbauswahl
- deutlich ausgebautes Live-Porträt
- fünf direkt erklärte, mechanisch wirksame Startmerkmale

## Sprint 36 – Gundula, Uli und das geschlossene Tor

- richtiger Start außerhalb des Campingplatzes
- sequenzielle Einlasskette: zuerst Gundula, danach Uli
- physische Schranke und gesperrter Kartenbereich
- animierte Toröffnung und dauerhafte Freischaltung nach Erfolg

## Sprint 37 – Der neu geordnete Campingplatz

- 1.600 × 1.100 Pixel große, kamerageführte Welt
- Ankunft, Parkplatz, Rezeption, Nord- und Südlager, Partyzelt, Strand und See
- Gebäude, Zelte, Wohnwagen, Wege, Tische, Bänke, Bäume, Steg und Beschilderung
- alle neun Freunde plus Gundula, Uli, Manni und Ronny auf der Weltkarte

## Sprint 38 – Sichtbare und belastbare Kollisionen

- datengetriebene Weltobjekte mit übereinstimmender Grafik und Physikfläche
- Kollision für Gebäude, Zelte, Wohnwagen, Bäume, Mobiliar, Zaun, Wasser und Tor
- kleinere Spieler-Kollisionsfläche für nachvollziehbare Engstellen
- kontextbezogene Aktionsanzeige statt blindem Interaktionsraten

## Sprint 39 – Betretbare Gebäude und Zelte

- Rezeption, Sanitärgebäude, eigenes Zelt und Partyzelt als echte Innenräume
- separate Raumkollisionen, Möbel, Ein- und Ausgänge
- Pause im eigenen Zelt und Toilettenaktion im Sanitärgebäude
- Flip Cup und Beer Pong direkt an den Tischen im Partyzelt

## Sprint 40 – Beziehungen, die man lesen kann

- eigenes Beziehungs-Dashboard für 13 Personen
- Wertebereich von −100 bis +100 mit verständlichen Beziehungsstufen
- unbekannte Personen bleiben verdeckt, bis sie getroffen wurden
- alle neun Freunde bilden gemeinsam eine persistente Wiedersehensquest

## Sprint 41 – Flip Cup als Rennen

- Best-of-three statt einer einzelnen Timingprobe
- Gegnerfortschritt in Echtzeit
- getrennte Trink- und Flip-Fenster
- Perfektserie, Fehlversuche, Zustand und Gruppenboni beeinflussen die Wertung

## Sprint 42 – Zwei eigenständige neue Minispiele

- Beer Pong mit beweglichem Fadenkreuz, wechselnden Zielbechern und begrenzten Würfen
- Flunkyball mit drei unterschiedlichen Phasen: Wurf, Sprint und Trink-Timing
- Zustand, Merkmal und Gruppenrollen wirken auf Toleranz, Zeit und Schwierigkeit
- persistente Bestwerte, Versuche und einmalige Questbelohnungen

## Sprint 43 – Tragfähiger Next-Release

- Save-Format v3 mit Migration aus v1 und v2
- typgeprüfte Testdateien und 29 automatisierte Tests
- datengetrennte Welt-, Innenraum-, Personen- und Questdefinitionen
- lazy geladene Phaser-Engine für einen kleinen Erststart
- eigene installierbare PWA unter `docs/next/`
- separater GitHub-Pages-Link ohne Verdrängung der vollständigen Legacy-Alpha

## Abdeckung

- Intro-, Profil-, Einkaufs- und Save-Fortschritt
- sequenzielle Einlasskette und Torfreischaltung
- vier Innenräume und persistente Rückkehr
- vollständige Platzierung der neun Freunde
- Wiedersehensquest und Beziehungspersistenz
- Aktivitätsergebnisse und Schutz gegen Belohnungs-Farming
- World-Objekt-, Eingangs- und Inhaltskonsistenz
- bestehende Mechanik-, Kampf- und Legacy-Endgame-Szenarien

## Bewusst noch offen

Die Next-Alpha ersetzt die Legacy-Alpha noch nicht. Für vollständige Parität fehlen insbesondere NPC-Tagespläne, Kontrollen und Schlaf, Kiosk, Trinkduell, Sonntags-Aufräumen, vollständige Teamverwaltung, alle Enden und der Import des umfangreichen v13-Legacy-Spielstands.

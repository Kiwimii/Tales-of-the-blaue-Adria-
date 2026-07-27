# Sprint 83 – Luftbildgerechter Campingplatz und Runtime-Stabilität

## Ausgangslage

Der bisherige kanonische Blueprint beseitigte konkurrierende Koordinaten-Overrides, bildete den Campingplatz aber weiterhin als abstraktes System aneinanderliegender Rechtecke ab. Das entsprach weder der realen Orientierung der Blauen Adria noch den sichtbaren Beziehungen zwischen Zufahrt, Parkplatz, Anmeldung, Campingreihen, Taucherplatz, Strandtor und Kiosk.

Zusätzlich bestanden zwei Runtime-Fehler:

- Nach Gesprächen mit Gundula konnte der Spieler-Body beim Zurücksetzen innerhalb der NPC-Kollision liegen bleiben.
- Auf Smartphones konnten ein veralteter PWA-Cache, ein fehlgeschlagener lazy Chunk oder fehlender `ResizeObserver` zu einer leeren beziehungsweise unvollständigen Spielfläche führen.

## Neue Geländeplanung

`src/game/aerialCampgroundPlan.ts` ersetzt das abstrakte Raster als geografische Quelle.

Die Karte folgt nun dieser verbindlichen Orientierung:

1. Die Zufahrtsstraße kommt von Nordosten.
2. Der Parkplatz liegt vor der Schranke.
3. Die Anmeldung befindet sich direkt hinter der Schranke.
4. Gundula und Uli bleiben an der Anmeldung.
5. Die Campingreihen erstrecken sich westlich und südwestlich der Anmeldung.
6. Der Taucherplatz liegt innerhalb des Campinggeländes rechts oberhalb des Strandkiosks.
7. Campingplatz und Strand werden durch einen physischen Zaun getrennt.
8. Der Strand wird ungefähr mittig durch ein Tor im Zaun erreicht.
9. Der Kiosk liegt unmittelbar auf der Strandseite dieses Tores.
10. Strand und Wasser liegen westlich beziehungsweise südlich des Campinggeländes.

Die Spielfläche besteht nicht mehr aus sieben optisch zusammengeklebten Rechtecken. Campinggelände, Strand, südliche Bucht und Wasser werden als unregelmäßige Polygone gerendert. Die 25 Straßen- und Wegsegmente dürfen der realen Geländeform entsprechend diagonal verlaufen.

## Physische Trennung von Platz und Strand

Der Zaun ist nicht nur Dekoration. Zwei statische Kollisionssegmente trennen den Campingplatz vom Strand. Zwischen den Segmenten bleibt ausschließlich das mittige Strandtor offen. Der Sandweg führt durch dieses Tor direkt zum Kiosk.

## Ankunft und Questobjekte

Die Ankunftsobjekte wurden an die neue Karte gebunden:

- Ankunftswagen am Parkplatz,
- Schranke am Ende der Parkplatzanfahrt,
- Anmeldung und Schwarzes Brett direkt dahinter,
- Gundula und Uli an der Anmeldung,
- Taucherplatzwagen am östlichen Rand des Taucherplatzes,
- eigenes aufbaubares Zelt und Freundeszeltreihe innerhalb der Taucherplatzfläche,
- Stromkasten, Gepäckpunkte und erstes Bier innerhalb derselben Fläche.

Unsichtbare Hindernisse der Wagen und des Zeltes werden gemeinsam mit den sichtbaren Objekten verschoben. Das alte statische Home-Tent wird ausgeblendet, damit das Questzelt nicht doppelt erscheint.

## Reparatur des Gundula-Freeze

Die frühere Recovery setzte Geschwindigkeit, Eingabe und Physik zurück, behielt jedoch die aktuelle Spielerposition bei. Stand die Figur beim Schließen des Gesprächs in Gundulas oder Ulis Kollisionsbereich, konnte der Arcade-Body dort eingeschlossen bleiben.

Die neue Recovery:

1. bestimmt alle NPCs innerhalb eines 96-Pixel-Clusters,
2. berechnet dessen Mittelpunkt,
3. versetzt die Figur 118 Pixel aus dem Cluster heraus,
4. setzt erst danach Position, Geschwindigkeit und Physik-Body zurück,
5. reaktiviert Szene, Eingabe, Physikwelt und Canvas-Fokus.

Die Berechnung liegt in einem Phaser-unabhängigen Modul und wird automatisiert getestet.

## Migration bestehender Spielstände

Alte Spielstände speichern Koordinaten der früheren Kartenorientierung. Befindet sich diese Position nach dem Laden in einer gesperrten Region, wird sie automatisch repariert:

- vor geöffnetem Tor auf den neuen Parkplatz,
- nach geöffnetem Tor in einen sicheren Bereich des zentralen Campingplatzes.

Inventar, Fortschritt, Beziehungen und sonstige Spielstandsdaten bleiben unverändert.

## Mobile Lade- und Cache-Reparatur

Die React-Hülle fängt Fehler beim lazy Laden des Phaser-Chunks ab.

Bei typischen Fehlern durch veraltete Moduldateien wird einmal automatisch:

- der Next-Runtime-Cache geleert,
- die Service-Worker-Registrierung aktualisiert,
- die Seite neu geladen.

Schlägt dies weiterhin fehl, erscheint ein sichtbarer Reparaturbildschirm mit den Optionen „Erneut versuchen“ und „Cache reparieren“. Der lokale Spielstand wird dabei nicht gelöscht.

JavaScript-, CSS- und Asset-Bundles verwenden jetzt network-first. Die Service-Worker-Registrierung setzt `updateViaCache: 'none'`. `ResizeObserver` wird nur verwendet, wenn der Browser ihn unterstützt; Geräte- und Viewportänderungen werden zusätzlich über mehrere verzögerte Phaser-Refreshes stabilisiert.

## Automatische Prüfung

Die Sprint-83-Tests prüfen unter anderem:

- zusammenhängenden Luftbild-Straßengraphen,
- nordöstliche Zufahrt und Reihenfolge Parkplatz–Schranke–Anmeldung,
- Taucherplatz rechts oberhalb des Kiosks,
- unterschiedliche Zaunseiten für Taucherplatz und Strandkiosk,
- lückenloses Zaunsystem mit mittigem Tor,
- freie Straßen und erreichbare Eingänge,
- feste Anmeldepositionen für Gundula und Uli,
- kollisionssichere Rückkehrposition nach Gesprächen,
- Next-Cache `s83` und network-first Bundles.

Eine manuelle Prüfung auf einem physischen Android- oder iPhone-Gerät ist weiterhin separat erforderlich.

# Tales of the Blaue Adria

Ein schwarzhumoriges, storygetriebenes Camping-RPG für Smartphone und Desktop. Das Spiel verbindet eine frei begehbare Top-down-Welt mit Dialogproben, Bedürfnissen, festen Tagesabläufen, Quests, einer rekrutierbaren Freundesgruppe, rundenbasierten Frustkämpfen und eingebetteten Minispielen.

## Jetzt spielen

**Vollständige Legacy-Alpha:** [Build v29 starten](https://kiwimii.github.io/Tales-of-the-blaue-Adria-/?v=29)

**Neue Next-Alpha:** [Sprint 85 starten](https://kiwimii.github.io/Tales-of-the-blaue-Adria-/next/?v=85)

Inhaltlicher Stand: **Sprint 28 · v1.8.0 · Build v29**

Die Alpha ist von Freitagmorgen bis zum Sonntagsfinale spielbar. Spielstände, Export/Import, mobile Steuerung und Offline-Nutzung werden unterstützt.

Die Zielarchitektur enthält die **Gameplay-Sprints 29–85** und wird parallel unter `/next/` veröffentlicht. Die Sprints 46–55 erweiterten die Außenwelt zu einer großen Karte mit sieben Regionen. Sprint 56 korrigierte Maßstab, Kollision und Tiefensortierung. Sprint 57 baute die zusammenhängende Ankunftsquest zum Taucherplatz. Die Sprints 58–72 vernetzen Körperzustände, visuelle Effekte, Kämpfe, Freundesbeziehungen, aktives Dreierteam, Flirts, Geschenke, Tagesroutinen, Kontrollgänge und Masls Minispiel zu einem gemeinsamen Metagame. Sprint 73 stabilisiert das Schwarze Brett und die positionsgenaue Questnavigation. Sprint 74 ersetzt die mobile Tastensteuerung durch relative Wischbewegung, eine großflächige Aktionszone und ein universelles X. Sprint 75 verhindert durchgereichte Touch-Eingaben. Sprint 76 räumt die UI-Architektur auf. Sprint 77 synchronisiert erreichbare Interaktionen. Sprint 78 öffnet blockierte Wege und stellt vollständige Gespräche sowie Flirts wieder her. Sprint 79 prüft sämtliche Objektpositionen und ergänzt Umgebungsdetails. Sprint 80 führt einen gemeinsamen Platzplan ein. Sprint 81 ersetzt konkurrierende Laufzeit-Overrides durch einen kanonischen Campingplatz-Blueprint. Sprint 82 vereinheitlicht den Einlass- und Ronny-Kampf zu einem Frustkampfsystem mit Gegnermerkmalen, zehn lernbaren Attacken, einem Vierer-Loadout, attackenbasierten Flirtoptionen und einer rotationsfesten Smartphone-Darstellung. Sprint 83 führte einen luftbildgerechten Geländeplan, stabile mobile Aktualisierung und eine kollisionssichere Rückkehr nach Gesprächen ein. Sprint 84 ersetzt die weiterhin unruhige Freiformplanung durch einen logisch gegliederten Campingplatz mit südlicher Einfahrt, rechtwinkligem Wegenetz, zwölf Funktionsflächen und verbindlichen Nachbarschaftsregeln für sämtliche Objekte und Personen. Sprint 85 überarbeitet HUD, mobile Steuerung, Dialoge und Spielmenü zu einer gemeinsamen aufgabenorientierten UX mit sichtbaren Aktionen, verständlichen Risikostufen, responsiver Navigation und verbesserten Fokuszuständen.

## Entwicklungsstatus

| Bereich | Status | Verbindliche Rolle |
| --- | --- | --- |
| `docs/` | umfangreiche, veröffentlichte Alpha | Referenz für Funktionsumfang und GitHub-Pages-Release |
| `src/` | spielbare React-/Phaser-/TypeScript-Next-Alpha | einzige Zielarchitektur für die weitere Entwicklung |
| `docs/next/` | gebauter Next-Preview | separater GitHub-Pages-Release der Zielarchitektur |

`docs/` ist feature-frozen. Neue Spielinhalte entstehen ausschließlich in der TypeScript-Zielarchitektur unter `src/`.

Die Architekturentscheidung steht in [ARCHITECTURE.md](docs/ARCHITECTURE.md). Den Migrationsstand zeigt [MIGRATION-CHECKLIST.md](docs/MIGRATION-CHECKLIST.md).

## Aktueller Spielumfang

- Charaktererstellung und Supermarkt-Prolog mit 25-Euro-Budget
- Ankunftsquest mit Reservierungsrätsel, Gundula-/Uli-Kontrolle, Frustkampf, Stromproblem, Ausladen und Bier-Meilenstein
- sichtbares Schwarzes Brett in jedem Questzustand
- stabiler Questzielzeiger und synchronisierte mobile Interaktionsbereitschaft
- universelles X für Rätsel, Kämpfe, soziale Ansichten, Innenräume und Minispiele
- mobile Wischsteuerung links unten mit sichtbarer, kontextbeschrifteter Aktionstaste
- konkretes Interaktionssignal statt einer unsichtbaren rechten Bildschirmhälfte
- fokussiertes HUD mit Zeit, aktuellem Ziel, echten Warnungen und direktem Menüzugang
- Desktop-Tastaturhilfe für Bewegung, Aktion und Karte
- Spielmenü mit Seiten-Navigation auf Desktop und horizontalen Tabs auf Mobilgeräten
- Tab-Zähler für Inventar, aktives Team, Kampfset und bekannte Beziehungen
- Dialogentscheidungen mit Risikostufe, Chancenbalken, Tastaturwahl und klarer Ergebnisdarstellung
- konsistente UX-Regeln für Aktionslabels, kompakte Ziele und Erfolgswahrscheinlichkeiten
- Reduced-Motion-Unterstützung, verbesserte Fokuszustände und mindestens 44 Pixel große Touchziele
- explizite Wiederherstellung von Szene, Eingabe, Physik, Spieler-Body und Canvas-Fokus nach Begegnungen
- kollisionssichere Rückkehrposition außerhalb des Gundula-/Uli-Clusters
- automatische Migration alter Weltkoordinaten in sichere Bereiche der aktuellen Karte
- rotationsfester 3:2-Spielrahmen mit Phaser-Refresh nach Geräte- und Viewportänderungen
- sichtbarer mobiler Lade- und Reparaturzustand statt leerer Spielfläche
- network-first Aktualisierung der Spielbundles gegen veraltete PWA-Caches
- pausierendes Spielmenü für Status, Inventar, Charakter, Attacken, Beziehungen, Karte und Systemfunktionen
- frei begehbarer Campingplatz mit sieben stufenweise freigeschalteten Regionen
- südliche Einfahrt mit Parkreihe, anschließender Schranke und eigenem Rezeptionshof
- durchgehende Nord-Süd-Hauptachse sowie drei klare Querwege durch die Campingreihen
- 36 zusammenhängende, ausschließlich horizontale oder vertikale Asphalt-, Kies- und Sandwege
- zwölf funktionale Parzellen für Parkplatz, Rezeption, Stellplätze, Adria-Klause, Sanitär, Taucherplatz, Festwiese, Strand, Servicehof und Bucht
- ausgerichtete Freundeszeltreihe mit eigenem Fußweg; jeder Freund steht vor seinem eigenen Zelt
- Bühne im Norden der Festwiese, Partyzelt in der Mitte und Kiosk am südlichen Rand
- Werkstatt und Holzlager gemeinsam am Wirtschaftsweg
- See, Strand, Hauptsteg und Bucht dauerhaft auf der rechten Kartenseite
- Campingplatz und Strand durch einen physischen Zaun mit eindeutigem Tor getrennt
- Objekt- und NPC-Zuordnung zu erwarteten Funktionsflächen statt freier Koordinatenverteilung
- automatische Prüfung von Straßengraph, Raster, Polygonen, Funktionsflächen, Objektabständen, Eingängen, Zeltgruppe, Veranstaltungsbereich und Wasseranschlüssen
- nur noch eine verbindliche Koordinatenquelle; alte Laufzeit-Overrides und doppelte Regionsbeschriftungen sind entfernt
- mehrere auswählbare Gesprächsthemen für erreichbare Charaktere
- Geschenke, Beziehungspflege und aktive Teamrekrutierung innerhalb der Gesprächsansicht
- sichtbare, zustandsabhängige Flirtoptionen für Susi, Jule und Kira
- attackenabhängige Flirtansätze aus dem aktuell ausgerüsteten Kampfset
- gemeinsames Frustkampfsystem für Gundula/Uli und Ronny
- Frustpunkte von 0 bis zum persönlichen Maximum statt klassischer Lebenspunkte
- Gegnermerkmale und unterschiedliche Effektivitäten für einzelne Attacken und Attackentypen
- maximal vier ausrüstbare Attacken aus einem wachsenden Repertoire
- zehn Attacken mit Lernwegen über Kämpfe, Freundesgespräche, Flip Cup, Beer Pong und Flunkyball
- Zustände wie Überrumpelt, Fremdscham, Leerlauf, Unterbrochen, Abgesichert, Verwirrt, Fokussiert und Fixiert
- systemische Körperzustände: Alkohol, Breitheit, Kater, Erschöpfung und Dehydrierung
- neun ausgearbeitete Freunde mit Stärken, Schwächen und eigenem Gruppenkanon
- aktives Team aus maximal drei Freunden und mehrere Teamsynergien
- Masls Timing-Minispiel „Komm ans Loch“
- Flip Cup, Beer Pong und Flunkyball mit Auswirkungen auf Pegel, Beziehungen und Attackenfortschritt
- Zeit, Bedürfnisse, Würde, Chaos, Beziehungen, Inventar und Tagesabläufe
- lokale Spielstände, mobile Steuerung, optionale Minikarte und installierbare PWA

## Lokale Entwicklung

Voraussetzung: Node.js 24 oder neuer.

```bash
npm ci
npm run dev
```

## Qualitätsprüfung

```bash
npm run check
```

Der Befehl prüft:

- Syntax, Vollständigkeit und Ladefolge der Runtime
- Build-Version, PWA-Manifest und Offline-Cache
- TypeScript-Typen
- Store-, Persistenz-, Welt-, Funktionsflächen-, Straßengraph-, Navigation-, UX-Präsentations-, Mobileingabe-, Recovery-, Gesprächs-, Flirt-, Loadout-, Frustkampf-, Team- und Minispieltests
- Produktionsbuild und Next-Preview

Die Sprint-Historie liegt in [SPRINTS.md](docs/SPRINTS.md), [SPRINTS-21-28.md](docs/SPRINTS-21-28.md), [SPRINTS-29-33.md](docs/SPRINTS-29-33.md), [SPRINTS-34-43.md](docs/SPRINTS-34-43.md), [SPRINTS-44.md](docs/SPRINTS-44.md), [SPRINTS-45.md](docs/SPRINTS-45.md), [SPRINTS-46-55.md](docs/SPRINTS-46-55.md), [SPRINT-56.md](docs/SPRINT-56.md), [SPRINT-57.md](docs/SPRINT-57.md), [SPRINTS-58-72.md](docs/SPRINTS-58-72.md), [SPRINT-73.md](docs/SPRINT-73.md), [SPRINT-74.md](docs/SPRINT-74.md), [SPRINT-75.md](docs/SPRINT-75.md), [SPRINT-76.md](docs/SPRINT-76.md), [SPRINT-77.md](docs/SPRINT-77.md), [SPRINT-78.md](docs/SPRINT-78.md), [SPRINT-79.md](docs/SPRINT-79.md), [SPRINT-80.md](docs/SPRINT-80.md), [SPRINT-81.md](docs/SPRINT-81.md), [SPRINT-82.md](docs/SPRINT-82.md), [SPRINT-83.md](docs/SPRINT-83.md), [SPRINT-84.md](docs/SPRINT-84.md) und [SPRINT-85.md](docs/SPRINT-85.md).

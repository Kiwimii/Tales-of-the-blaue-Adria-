# Tales of the Blaue Adria

Ein schwarzhumoriges, storygetriebenes Camping-RPG für Smartphone und Desktop. Das Spiel verbindet eine frei begehbare Top-down-Welt mit Dialogproben, Bedürfnissen, festen Tagesabläufen, Quests, einer rekrutierbaren Freundesgruppe, rundenbasierten Teamkämpfen und eingebetteten Minispielen.

## Jetzt spielen

**Vollständige Legacy-Alpha:** [Build v29 starten](https://kiwimii.github.io/Tales-of-the-blaue-Adria-/?v=29)

**Neue Next-Alpha:** [Sprint 76 starten](https://kiwimii.github.io/Tales-of-the-blaue-Adria-/next/?v=76)

Inhaltlicher Stand: **Sprint 28 · v1.8.0 · Build v29**

Die Alpha ist von Freitagmorgen bis zum Sonntagsfinale spielbar. Spielstände, Export/Import, mobile Steuerung und Offline-Nutzung werden unterstützt.

Die Zielarchitektur enthält die **Gameplay-Sprints 29–76** und wird parallel unter `/next/` veröffentlicht. Die Sprints 46–55 erweiterten die Außenwelt zu einer großen Karte mit sieben Regionen. Sprint 56 korrigierte Maßstab, Kollision und Tiefensortierung. Sprint 57 baute die zusammenhängende Ankunftsquest zum Taucherplatz. Die Sprints 58–72 vernetzen Körperzustände, visuelle Effekte, Kämpfe, Freundesbeziehungen, aktives Dreierteam, Flirts, Geschenke, Tagesroutinen, Kontrollgänge und Masls Minispiel zu einem gemeinsamen Metagame. Sprint 73 stabilisiert das Schwarze Brett und die positionsgenaue Questnavigation. Sprint 74 ersetzt die mobile Tastensteuerung durch relative Wischbewegung, eine großflächige Aktionszone und ein universelles X für alle geöffneten Spielansichten. Sprint 75 verhindert durchgereichte Touch-Eingaben in Gesprächen und stellt nach dem Schließen zuverlässig die Weltbewegung wieder her. Sprint 76 räumt die UI-Architektur auf, konzentriert die mobile Ansicht auf das Spiel, verschiebt Detailinformationen in ein pausierendes Menü und macht erreichbare Interaktionen sichtbar.

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
- Ankunftsquest mit Reservierungsrätsel, Gundula-/Uli-Kontrolle, Tutorialkampf, Stromproblem, Ausladen und Bier-Meilenstein
- sichtbares, antippbares Schwarzes Brett und stabiler Questzielzeiger
- universelles X für Rätsel, Kämpfe, soziale Ansichten, Innenräume und Minispiele
- mobile Wischsteuerung links unten und großflächige Aktion über die rechte Bildschirmhälfte
- berührungssichere Dialogauswahl ohne automatisch ausgelöste Antworten
- pulsierende Hervorhebung für erreichbare Personen, Gegenstände und Aktionen
- fokussierte mobile Spielansicht mit Uhrzeit, Ziel, kritischen Warnungen und Menü
- pausierendes Spielmenü für Status, Werte, Inventar, Team, Beziehungen, Chronik, Karte und Systemfunktionen
- frei begehbarer Campingplatz mit sieben stufenweise freigeschalteten Regionen
- realistische Objektabstände, Kollisionsflächen und Y-basierte Tiefensortierung
- systemische Zustände: Alkohol, Breitheit, Kater, Erschöpfung und Dehydrierung
- visuelles Schwanken, Reaktionsverzögerung und Katerdarstellung
- animierte Kampfintros mit wechselnden Kontrahentensprüchen
- statusabhängige Kämpfe mit temporären Effekten
- neun ausgearbeitete Freunde mit Stärken, Schwächen und eigenem Gruppenkanon
- aktives Team aus maximal drei Freunden und mehrere Teamsynergien
- dynamische Gespräche, anspruchsvolle Flirts mit maximal 20 Prozent Chance und individuelle Geschenke
- Gundula und Uli mit Mittagspause und Kontrollgang um 18 Uhr
- Lidl und Aldimania als polarisierende Discounter-Mode mit Hype- und Billigmode-Reaktionen
- kompakte Zeltgruppe, Heckeninteraktion und Fahrzeug nur zum Be- und Entladen auf dem Platz
- Masls Timing-Minispiel „Komm ans Loch“
- Flip Cup, Beer Pong und Flunkyball mit Auswirkungen auf den anschließenden Pegel
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
- Store-, Persistenz-, Welt-, Realismus-, Ankunftsquest-, Questnavigation-, Mobileingabe-, Touchdialog-, UI-Selektor-, Zustands-, Flirt-, Team- und Kampftests
- Produktionsbuild und Next-Preview

Die Sprint-Historie liegt in [SPRINTS.md](docs/SPRINTS.md), [SPRINTS-21-28.md](docs/SPRINTS-21-28.md), [SPRINTS-29-33.md](docs/SPRINTS-29-33.md), [SPRINTS-34-43.md](docs/SPRINTS-34-43.md), [SPRINTS-44.md](docs/SPRINTS-44.md), [SPRINTS-45.md](docs/SPRINTS-45.md), [SPRINTS-46-55.md](docs/SPRINTS-46-55.md), [SPRINT-56.md](docs/SPRINT-56.md), [SPRINT-57.md](docs/SPRINT-57.md), [SPRINTS-58-72.md](docs/SPRINTS-58-72.md), [SPRINT-73.md](docs/SPRINT-73.md), [SPRINT-74.md](docs/SPRINT-74.md), [SPRINT-75.md](docs/SPRINT-75.md) und [SPRINT-76.md](docs/SPRINT-76.md).

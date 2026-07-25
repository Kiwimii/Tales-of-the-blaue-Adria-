# Tales of the Blaue Adria

Ein schwarzhumoriges, storygetriebenes Camping-RPG für Smartphone und Desktop. Strukturell verbindet das Projekt eine frei begehbare Top-down-Welt mit Dialogproben, Quests, rekrutierbaren Figuren, rundenbasierten Teamkämpfen und direkt eingebetteten Minispielen.

## Spielbare Fassung

https://kiwimii.github.io/Tales-of-the-blaue-Adria-/?v=8

Aktueller Build: **Sprint 5 · v0.8.0**

Enthalten sind unter anderem:

- Charaktererstellung und Supermarkt-Prolog mit 25-Euro-Budget
- große Campingplatz-Oberwelt mit Tag-Nacht-Wechsel
- Energie, Hunger, Durst, Blase, Alkohol, Breitheit, Mut und Kater
- Inventar, Imbiss, Quests, Beziehungen, Ruf und Ereignisprotokoll
- mehrstufige Dialoge mit unterschiedlichen Erfolgschancen
- rekrutierbare Teammitglieder und Reserve
- rundenbasierte Kämpfe mit Fähigkeiten, Status, Schutz und Wechseln
- Flip Cup, Beer Pong und Flunkyball
- lokaler Speicherstand mit Export und Import
- mobile Steuerung, Haptik, Safe Areas und Querformat-Unterstützung
- wählbare derbe oder abgeschwächte Dialogfassung

## Technische Struktur

Die unmittelbar über GitHub Pages getestete Fassung liegt in `docs/` und läuft ohne externes CDN als eigenständige Canvas-Web-App. Dadurch ist der Testlink stabil und mobil schnell verfügbar.

Parallel liegt die langfristige Zielarchitektur in `src/`:

- Phaser 4 für Oberwelt, Kämpfe und Minispiele
- React für komplexe Menüs und Verwaltungsoberflächen
- TypeScript und Vite
- gemeinsamer persistenter Spielzustand zwischen allen Szenentypen
- datengetriebene Inhalte für NPCs, Quests, Gegenstände und Dialoge

Die Canvas-Fassung ist der spielbare Vertical Slice. Die modularisierte Phaser-/React-Struktur bleibt die Grundlage für den späteren Ausbau zu einem größeren Spiel.

## Lokale Entwicklung

```bash
npm install
npm run dev
```

## Produktionsbuild

```bash
npm run build
```

Die Dokumentation der fünf umgesetzten Sprints liegt unter `docs/SPRINTS.md`.

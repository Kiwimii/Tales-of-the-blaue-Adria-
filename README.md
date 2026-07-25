# Tales of the Blaue Adria

Ein schwarzhumoriges, storygetriebenes Camping-RPG für Smartphone und Desktop. Das Spiel verbindet eine frei begehbare Top-down-Welt mit Dialogproben, Bedürfnissen, festen Tagesabläufen, Quests, einer rekrutierbaren Freundesgruppe, rundenbasierten Teamkämpfen und direkt eingebetteten Minispielen.

## Spielbare Fassung

https://kiwimii.github.io/Tales-of-the-blaue-Adria-/?v=13

Aktueller Build: **Sprint 10 · v1.3.0**

## Aktueller Spielumfang

- Charaktererstellung und Supermarkt-Prolog mit 25-Euro-Budget
- große, an der Luftaufnahme orientierte Campingplatzkarte
- Zufahrt und Parkplatz im Nordwesten, Servicekern am Eingang, bewaldete Parzellen, Zeltlager, Festwiese, Kiosk, Hauptstrand und See im Osten
- Gundula und Uli östlich des Sanitärgebäudes
- kein Einlass während der Mittagspause von 13 bis 15 Uhr
- gemeinsamer Kontrollrundgang von Gundula und Uli um 18 Uhr
- Nachtruhekontrolle ab 22 Uhr
- Gundulas besondere Abneigung gegen das Brunsen in ihre Hecke inklusive Folgen und Reinigungsquest
- vollständige Freundesgruppe: André, René, Lars, Danny, Gregor, Felix, Masl, Schubert und Schima
- individuelle Positionen, Tagesabläufe, Rollen, Dialoge, Werte und Fähigkeiten
- Trinken, Spielen, Flirten, Kiffen, Grillen, Schlafen, Aufräumen und Schwimmen
- Energie, Hunger, Durst, Blase, Alkohol, Breitheit, Mut, Kater, Flirtwert und Würde
- Inventar, Kiosk, Quests, Beziehungen, Ruf, Chaos, Romantik und Ereignisprotokoll
- rundenbasierte Teamkämpfe mit bis zu drei aktiven Figuren
- Flip Cup, Beer Pong, Flunkyball, Trinkduell und Sonntags-Aufräumspiel
- lokaler Speicherstand mit Export und Import
- mobile Analogsteuerung, große Touch-Flächen, Safe Areas und Querformat-Unterstützung
- Endgame am Sonntag um 12 Uhr mit mehreren möglichen Wochenendwertungen

## Technische Struktur

Die direkt über GitHub Pages getestete Fassung liegt modular in `docs/` und läuft ohne externes CDN als eigenständige Canvas-Web-App.

Aktive Module:

- `content-v13.js` – Figuren, Gegenstände, Dialoge, Quests und Enden
- `map-v13.js` – Geometrie der an der Luftaufnahme orientierten Welt
- `engine-v13.js` – Speicherstand, Zeit, Bedürfnisse, Menüs und mobile Eingabe
- `world-v13.js` – Oberwelt, Kamera, NPC-Pläne, Kontrollen und Interaktionen
- `activities-v13.js` – Kämpfe, Minispiele, Flirten, Aufräumen und Endgame
- `hotfix-v13.js` – Torablauf, Schlafen, Ronny-Begegnung und Integrationsschutz

Die automatische GitHub-Validierung prüft jedes Spielmodul mit `node --check`, notwendige HTML-Elemente, die Modulreihenfolge und veraltete Runtime-Verweise.

Parallel liegt die langfristige Zielarchitektur in `src/`:

- Phaser 4 für Oberwelt, Kämpfe und Minispiele
- React für komplexe Menüs und Verwaltungsoberflächen
- TypeScript und Vite
- gemeinsamer persistenter Spielzustand zwischen allen Szenentypen
- datengetriebene Inhalte für NPCs, Quests, Gegenstände und Dialoge

## Lokale Entwicklung

```bash
npm install
npm run dev
```

## Produktionsbuild

```bash
npm run build
```

Die Sprint-Dokumentation liegt unter `docs/SPRINTS.md`.
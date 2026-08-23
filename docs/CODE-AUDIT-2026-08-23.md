# Code-Audit und Projektstand — 23. August 2026

## Kurzfazit

Der veröffentlichte 2D-Hauptbuild ist spielbar und die automatisierten Prüfungen sind grün. Der Stand auf `main` war zu Beginn des Audits Commit `461289d` (Merge von PR #56: sequenzieller Fortschritt, Belohnungen und schwereres Beer Pong). Die Live-Fassung unter `/lpc-main/` antwortete mit HTTP 200 und wurde zuletzt am 1. August 2026 veröffentlicht.

Der Bestand ist jedoch technisch stark geschichtet: Mehrere nachträglich eingebaute Runtime-Module verändern Klassen-Prototypen, beobachten das DOM und pollen Zustände. Das funktioniert aktuell, erhöht aber die Gefahr von Reihenfolgefehlern, doppelten Listenern und schwer reproduzierbaren Regressionen. Der neue 3D-Build wurde deshalb als isolierte zweite Anwendung erstellt und übernimmt Datenmodelle, nicht die 2D-Runtime-Patches.

## Verifizierter Stand

| Bereich | Ergebnis |
| --- | --- |
| Unit-/Integrationstests | 51 Testdateien, 221 Tests bestanden |
| TypeScript | `tsc --noEmit` bestanden |
| Bestehende Varianten | Legacy-, Next-, Redesign-, LPC-Test- und LPC-Main-Validatoren bestanden |
| 3D-Build | Build und eigener Strukturvalidator bestanden |
| Abhängigkeiten | `npm audit` nach Aktualisierung: 0 bekannte Schwachstellen |
| Browser-Smokes lokal | Wegen gesperrtem Chromium-Download nicht lokal ausführbar |
| Browser-Smokes CI | WebGL- und bestehende LPC-Smokes in den verpflichtenden GitHub-CI-Lauf aufgenommen |

Das Repository umfasst rund 38.000 Quelltextzeilen; davon entfallen rund 14.700 Zeilen auf die LPC-Kampagnen-Runtime. Der aktuelle LPC-Hauptchunk ist knapp 2 MB minifiziert (rund 562 kB gzip). Der neue 3D-Hauptchunk liegt bei rund 676 kB minifiziert (rund 179 kB gzip).

## Befunde

### 1. Behoben: verwundbare transitive `nanoid`-Version — hoch

`npm audit` meldete `nanoid < 3.3.18` über die Vite/PostCSS-Kette. Der Lockfile wurde auf `nanoid 3.3.18` aktualisiert. Der anschließende Audit meldet keine bekannte Schwachstelle mehr.

### 2. Dynamische Quelltextausführung in `codexRuntime2.js` — hoch für Wartung und CSP

`src/lpc-main/campaign/codexRuntime2.js` importiert `codexRuntime.js` als Rohtext, verändert ihn mit regulären Ausdrücken und führt das Ergebnis über `new Function(...)` aus. Der ausgeführte Text stammt beim Build aus dem Repository; es wurde deshalb kein direkter Remote-Code-Injection-Pfad festgestellt. Die Konstruktion bleibt dennoch fragil:

- eine strikte Content-Security-Policy ohne `unsafe-eval` blockiert sie,
- harmlose Formatänderungen im Ursprungstext können die Regex-Patches brechen,
- Typprüfung und statische Analyse sehen den tatsächlich ausgeführten Code nicht vollständig.

Empfehlung: Die Änderungen aus Runtime 2 direkt als typisierte Funktionen/Module integrieren und `?raw` plus `new Function` entfernen.

### 3. Umfangreiche Prototyp-Patches und private Kopplung — hoch für Regressionen

Unter anderem `progressionFlowV6Runtime.ts`, `minigameHardening.ts`, `worldSceneEnhancements.ts` und weitere Runtime-Schichten überschreiben Methoden bestehender Klassen zur Laufzeit. `progressionFlowV6Runtime.ts` greift zusätzlich über breit typisierte Records auf interne Store-Zustände und Emit-Funktionen zu. Im Kampagnenbereich wurden insgesamt 104 Vorkommen der geprüften Risikomuster (`new Function`, Timer, DOM-Observer, Prototyp-Zuweisungen und globale Listener) gefunden.

Empfehlung: Fortschritt, Belohnungen und Minispielregeln hinter explizite Schnittstellen verlagern; Patches schrittweise in die Ursprungsklassen zurückführen; Patch-Reihenfolge durch Konstruktor-Injektion oder registrierte Hooks ersetzen.

### 4. Nicht abräumbare globale Listener in `fastMinigamesRebuild.js` — mittel

Der Konstruktor registriert anonyme `pointerup`-, `keydown`- und `keyup`-Callbacks auf `window`. Weil die Funktionsreferenzen nicht gespeichert werden, kann `stop()` sie nicht entfernen. Bei erneuter Initialisierung können doppelte Aktionen und Speicherlecks entstehen.

Empfehlung: gebundene Handler als Instanzfelder halten, einmalig registrieren und in einer `destroy()`-Methode entfernen. Ein Test sollte wiederholtes Mounten/Unmounten abdecken.

### 5. Dauerhafte Polling- und DOM-Beobachter — mittel

`progressionFlowV6Runtime.ts` startet unter anderem einen 360-ms-Poll und MutationObserver; `weekendArcBootstrap.ts` aktualisiert alle 650 ms. Mehrere globale Listener leben für die gesamte Seitensitzung. Das erhöht CPU-/Akkulast auf Mobilgeräten und macht Lebenszyklen schwer kontrollierbar.

Empfehlung: UI-Updates an Store-Events koppeln, Observer nach erfolgreichem Patch trennen und alle Timer/Listener zentral verwalten.

### 6. Release- und Dokumentationsdrift — niedrig

Die README beschreibt weiterhin Sprint 89 als neueste Next-Alpha, obwohl spätere LPC-Fortschrittsarbeiten bis PR #56 vorliegen. `lpc-main/index.html` trägt noch die Kennung `lpc-gameplay-depth-v2`. Das ist kein Laufzeitfehler, erschwert aber Support und Cache-Diagnose.

Empfehlung: eine einzige Build-Version aus Git-Commit und Build-Zeit generieren und in UI, HTML-Metadaten und Release Notes verwenden.

### 7. Große Browser-Bundles — niedrig bis mittel

Der LPC-Hauptbuild lädt einen knapp 2 MB großen JavaScript-Chunk. Der Build ist gzip-komprimiert deutlich kleiner, dennoch können Parsen und Initialisierung auf schwächeren Mobilgeräten spürbar sein.

Empfehlung: Kampagnenbögen und seltene Minispiele per dynamischem Import laden; anschließend Größenbudgets in CI setzen.

### 8. Veralteter offener PR #54 — Prozessrisiko, niedrig

PR #54 ist noch offen, obwohl eine spätere Eröffnungssequenz über PR #55 bereits gemergt wurde. Ein versehentlicher später Merge könnte Änderungen zurückbringen oder Konflikte erzeugen. Er wurde in diesem Auftrag nicht automatisch geschlossen.

## Maßnahmen in diesem Build

- verwundbare transitive Abhängigkeit aktualisiert,
- eigenständigen `/third-person/`-Build ohne Veränderung der bestehenden 2D-URLs angelegt,
- eigene versionierte Speicher-IDs für 3D verwendet,
- prozedurale Three.js-Welt ohne externe Laufzeit-Assets erstellt,
- Kollision, Kamera, Steuerung, Questfortschritt und Speicherung durch Unit- und Browser-Smokes abgesichert,
- Absturz der 3D-Kamerakollision an beschrifteten Sprites durch gesetzte Raycaster-Kamera und Sprite-Filter behoben,
- zufallsabhängigen Jule-Dialogtest durch explizite Zufallsquelle deterministisch gemacht,
- 3D-Artifact und WebGL-Smoke in die verpflichtende CI aufgenommen.

## 3D-V1-Grenze

Die 3D-Fassung bildet Bewegung, Ankunftsquest, Freundessuche, Lagerfeuer-Treffen, Gespräche, Bedürfnisse, Inventar und wiederholbare Aktivitäten als spielbaren vertikalen Slice ab. Die spezialisierten Kämpfe, sämtliche individuellen 2D-Minispielregeln, der vollständige Wochenendbogen und alle Enden sind noch nicht in 3D portiert. Diese Grenze wird im Spiel und in `THIRD-PERSON-V1.md` ausdrücklich benannt.

# Sprints 46–55 – Welt, Logik und visuelles Upgrade

Stand: 26. Juli 2026

## Ausgangslage und Audit

Die bestehende Next-Alpha war spielbar und funktional, aber die komplette Außenwelt lag in einer einzelnen, sehr großen Szene. Bewegungen lösten zu häufig persistente Schreibvorgänge aus, die Interaktionssuche sortierte bei jedem Frame sämtliche Ziele und die Karte hatte nur eine echte Freischaltstufe. Die Überarbeitung behält sämtliche Features, Szenen, Questketten und das Save-Format v3 bei, ersetzt aber die aktive Außenwelt durch eine datengetriebene, größere und leichter prüfbare Welt.

## Sprint 46 – Architektur-Audit

- Bestehende Szenen, Store, Quests, Minispiele, Persistenz und Deployment getrennt geprüft.
- Die alte `WorldScene` bleibt als Referenz im Repository; die neue Szene übernimmt denselben Phaser-Schlüssel `world`.
- Keine vorhandene Quest, Figur, Innenraum- oder Minispiel-Szene wurde entfernt.

## Sprint 47 – Datengetriebene Regionen

- Neue zentrale Weltdefinition mit sieben klar benannten Regionen.
- Objekt-, Eingang-, NPC- und Landmark-Daten sind von der Renderlogik getrennt.
- Reine Validierungs- und Freischaltfunktionen ermöglichen belastbare Tests ohne Phaser-Laufzeit.

## Sprint 48 – Performance und Stabilität

- Store-Snapshots werden in der Welt-Szene gecacht statt in jedem Frame tief kopiert.
- Spielerpositionen werden kontrolliert gedrosselt gespeichert und beim Szenenwechsel sofort gesichert.
- Die nächste Interaktion wird in einem linearen Durchlauf statt durch wiederholtes Mapping, Filtern und Sortieren bestimmt.
- Dekoration und Animationen respektieren weiterhin das adaptive Geräteprofil.

## Sprint 49 – Größere Karte

- Die Welt wächst von 1.600 × 1.100 auf 2.600 × 1.800 Welteinheiten.
- Neue Bereiche: Ankunft, Südlager, Nordlager, Festwiese, großer Strand, Waldsaum und versteckte Bucht.
- Straßen, Wege, Ufer und Übergänge verbinden die Bereiche nachvollziehbar.

## Sprint 50 – Stufenweise Freischaltungen

- Ankunft ist immer erreichbar; das Südlager öffnet sich über Gundula und Uli.
- Weitere Regionen öffnen sich über gefundene Freunde, Questfortschritt oder gewonnene Aktivitäten.
- Die Reihenfolge bleibt ohne Sackgasse spielbar: Jede neue Stufe enthält die Figur, die für die nächste Stufe benötigt wird.
- Bereits freigeschaltete Bereiche werden im laufenden Spiel sichtbar geöffnet, ohne die Szene neu zu laden.

## Sprint 51 – Atmosphäre

- Regional unterschiedliche Bodenfarben, Wege, Strand- und Wasserzonen.
- Tageszeitabhängige Farb- und Nachtüberlagerungen.
- Lagerfeuer, Glut, Wasserreflexe, Blätter und Glühwürmchen schaffen Bewegung, ohne die Spiellogik zu überdecken.

## Sprint 52 – Welt-Details

- Neue Bühne, Kiosk, Strandbar, Rettungswache, Werkstatt, Holzlager, Stege, Unterstand und Landmarken.
- Gebäude, Zelte, Camper, Bäume, Möbel, Zäune und Schilder erhalten wiedererkennbare Material- und Kleindetails.
- Sieben optionale Landmark-Interaktionen liefern zusätzliche Texte und Orientierung.

## Sprint 53 – Animation und Lesbarkeit

- Spielerbewegung erhält Schrittbewegung, Schatten und zustandsabhängige Geschwindigkeit.
- Regionstore, Freischaltungen, Lagerfeuer, Wasser und Umgebung besitzen kontrollierte Tween-Animationen.
- Auf eingeschränkten Geräten werden nur teure Bewegungsdetails reduziert; Karteninhalt und statische Details bleiben vollständig.

## Sprint 54 – Navigation und Karte

- Neue Minikarte mit sieben farblich getrennten Regionen, Sperrstatus und Live-Spielerposition.
- Bereichsbanner benennen beim Betreten den aktuellen Ort und dessen Funktion.
- Kamera-Zoom passt sich dezent an große und dichte Bereiche an.
- Die Minikarte kann per `M` ein- und ausgeblendet werden.

## Sprint 55 – Prüfung und Veröffentlichung

- Neue Tests validieren Weltgrenzen, Objektzuordnung, eindeutige Regionen, alternative Freischaltpfade und sichere Spawnpunkte.
- Der vollständige bestehende Check bleibt verpflichtend: Legacy-Validierung, TypeScript, Vitest, Produktionsbuild, Next-Build und Next-Validierung.
- Nach erfolgreichem Main-Build aktualisiert GitHub Actions den spielbaren `/next/`-Build automatisch.
- PWA-Cache auf `s55` erhöht, damit alte Assets zuverlässig ersetzt werden.

## Kompatibilität

- Save-Format bleibt v3.
- Bestehende Speicherstände werden weiter geladen.
- Gundula-/Uli-Einlass, Manni-Papierquest, Ronny-Duell, neun Freunde, Beziehungen, Innenräume, Flip Cup, Beer Pong und Flunkyball bleiben erhalten.
- Die Legacy-Alpha am Root-Link wird nicht verändert.

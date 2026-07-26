# Migrationscheckliste

Stand: 26. Juli 2026

| Bereich | Referenz in `docs/` | Zielarchitektur `src/` | Status |
| --- | --- | --- | --- |
| Produktionsbuild | direkt veröffentlichte Canvas-App | Vite-/TypeScript-Build | abgeschlossen |
| Charaktererstellung | vollständig | Name, Farben, Merkmal | teilweise |
| Supermarkt-Prolog | 25-Euro-Einkauf und Gegenstände | fehlt | offen |
| Campingplatzwelt | vollständige große Karte | vereinfachte Testkarte | teilweise |
| Mobile Bewegung | Analogstick und Aktionsknopf | D-Pad und Aktionsknopf | teilweise |
| Gundula und Uli | Dialoge, Einlass, Kontrollen | einfache Interaktionen | teilweise |
| neun Freunde | Positionen, Pläne, Dialoge, Fähigkeiten | fehlen | offen |
| Bedürfnisse | zehn Werte und Konsequenzen | sechs Grundwerte | teilweise |
| Inventar und Kiosk | vollständig | vier Startgegenstände | teilweise |
| Quest- und Beziehungssystem | vollständig | Flags als Grundlage | offen |
| Teamverwaltung | aktives Team und Reserve | Datenmodell vorhanden | teilweise |
| Kämpfe | Teamkampf, Wechsel, Status und Gegner-KI | ein vereinfachtes Duell | teilweise |
| Flip Cup | vollständig | spielbarer Prototyp | teilweise |
| Beer Pong | vollständig | fehlt | offen |
| Flunkyball | vollständig | fehlt | offen |
| Trinkduell | vollständig | fehlt | offen |
| Sonntags-Aufräumen | vollständig | fehlt | offen |
| Freitag-bis-Sonntag-Ablauf | vollständig | Zeitbasis vorhanden | teilweise |
| Enden und Wertung | vier Ergebnisgruppen | fehlt | offen |
| Speichern und Laden | v13, Export, Import, Backup | lokaler v1-Store | teilweise |
| Import vorhandener v13-Spielstände | nicht erforderlich | fehlt | offen |
| PWA und Offline | Build v29 | fehlt | offen |
| Automatische Kernregeltests | Runtime- und Endgame-Szenarien | Store- und Persistenztests | Grundlage abgeschlossen |
| Manueller Komplettdurchlauf | erforderlich | nach Parität erforderlich | offen |

## Nächster Entwicklungsschnitt

Charaktererstellung, Supermarkt und Einlass werden als erster vollständiger vertikaler Abschnitt migriert. Er umfasst Daten, UI, mobile Bedienung, Save-Zustand und automatisierte Tests. Erst danach beginnt die Übertragung der großen Weltkarte.

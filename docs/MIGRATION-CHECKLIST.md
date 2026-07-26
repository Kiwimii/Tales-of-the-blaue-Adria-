# Migrationscheckliste

Stand: 26. Juli 2026 · nach Gameplay-Sprint 33

| Bereich | Referenz in `docs/` | Zielarchitektur `src/` | Status |
| --- | --- | --- | --- |
| Produktionsbuild | direkt veröffentlichte Canvas-App | Vite-/TypeScript-Build | abgeschlossen |
| Charaktererstellung | vollständig | Name, Farben und mechanisch wirksames Merkmal | abgeschlossen |
| Supermarkt-Prolog | 25-Euro-Einkauf und Gegenstände | vollständiges Budget, acht Gegenstände und persistente Auswahl | abgeschlossen |
| Campingplatzwelt | vollständige große Karte | vereinfachte Testkarte | teilweise |
| Mobile Bewegung | Analogstick und Aktionsknopf | D-Pad und Aktionsknopf | teilweise |
| Gundula und Uli | Dialoge, Einlass, Kontrollen | mehrstufige Einlassproben und Beziehungen; Kontrollen fehlen | teilweise |
| neun Freunde | Positionen, Pläne, Dialoge, Fähigkeiten | fehlen | offen |
| Bedürfnisse | zehn Werte und Konsequenzen | acht verzahnte Werte, Zeitfolgen, Pause und Toilette | teilweise |
| Inventar und Kiosk | vollständig | acht Einkaufsgegenstände mit Folgen; Kiosk fehlt | teilweise |
| Quest- und Beziehungssystem | vollständig | persistente Questzustände, Zielpriorität, vier Beziehungen und Konsequenzketten | teilweise |
| Teamverwaltung | aktives Team und Reserve | Manni/Ronny mit Loyalität und Rollenboni; Wechsel/Reserve fehlen | teilweise |
| Kämpfe | Teamkampf, Wechsel, Status und Gegner-KI | taktisches Duell mit Zustand und Rollen; Wechsel/Status/KI-Tiefe fehlen | teilweise |
| Flip Cup | vollständig | dynamisches Timing, Zustands- und Rollenmodifikatoren | teilweise |
| Beer Pong | vollständig | fehlt | offen |
| Flunkyball | vollständig | fehlt | offen |
| Trinkduell | vollständig | fehlt | offen |
| Sonntags-Aufräumen | vollständig | fehlt | offen |
| Freitag-bis-Sonntag-Ablauf | vollständig | Zeitbasis vorhanden | teilweise |
| Enden und Wertung | vier Ergebnisgruppen | fehlt | offen |
| Speichern und Laden | v13, Export, Import, Backup | lokaler v2-Store mit automatischer v1-Migration | teilweise |
| Import vorhandener v13-Spielstände | nicht erforderlich | fehlt | offen |
| PWA und Offline | Build v29 | fehlt | offen |
| Automatische Kernregeltests | Runtime- und Endgame-Szenarien | Store- und Persistenztests | Grundlage abgeschlossen |
| Manueller Komplettdurchlauf | erforderlich | nach Parität erforderlich | offen |

## Nächster Entwicklungsschnitt

Die große Weltkarte, Kollisionen und NPC-Tagespläne bilden den nächsten vertikalen Abschnitt. Danach werden die verbleibenden Freunde und ihre Dialog-/Questketten auf das neue Beziehungs- und Rollensystem übertragen.

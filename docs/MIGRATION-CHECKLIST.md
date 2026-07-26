# Migrationscheckliste

Stand: 26. Juli 2026 · nach Gameplay-Sprint 43

| Bereich | Referenz in `docs/` | Zielarchitektur `src/` | Status |
| --- | --- | --- | --- |
| Produktionsbuild | direkt veröffentlichte Canvas-App | Vite-/TypeScript-Build | abgeschlossen |
| Charaktererstellung | vollständig | Name, Körperbau, Frisur, Accessoire, Farbpaletten und mechanisch wirksames Merkmal | abgeschlossen |
| Supermarkt-Prolog | 25-Euro-Einkauf und Gegenstände | vollständiges Budget, acht Gegenstände und persistente Auswahl | abgeschlossen |
| Campingplatzwelt | vollständige große Karte | große strukturierte Welt mit Ankunft, Lagern, Rezeption, Partyzelt, Strand und See | weitgehend |
| Mobile Bewegung | Analogstick und Aktionsknopf | D-Pad und Aktionsknopf | teilweise |
| Gundula und Uli | Dialoge, Einlass, Kontrollen | sequenzielle Einlassquest, physisches Tor und Beziehungen; Kontrollen fehlen | teilweise |
| neun Freunde | Positionen, Pläne, Dialoge, Fähigkeiten | alle platziert, Kurzdialoge und Wiedersehensquest; Pläne/Fähigkeiten fehlen | teilweise |
| Bedürfnisse | zehn Werte und Konsequenzen | acht verzahnte Werte, Zeitfolgen, Pause und Toilette | teilweise |
| Inventar und Kiosk | vollständig | acht Einkaufsgegenstände mit Folgen; Kiosk fehlt | teilweise |
| Quest- und Beziehungssystem | vollständig | persistente Questzustände, Zielpriorität, 13 sichtbare Beziehungen und Konsequenzketten | teilweise |
| Teamverwaltung | aktives Team und Reserve | Manni/Ronny mit Loyalität und Rollenboni; Wechsel/Reserve fehlen | teilweise |
| Kämpfe | Teamkampf, Wechsel, Status und Gegner-KI | taktisches Duell mit Zustand und Rollen; Wechsel/Status/KI-Tiefe fehlen | teilweise |
| Flip Cup | vollständig | Best-of-three mit Gegnerfortschritt, zwei Phasen und dynamischem Timing | abgeschlossen |
| Beer Pong | vollständig | Präzisionsspiel mit Zielbechern, Würfen und Zustandsmodifikatoren | abgeschlossen |
| Flunkyball | vollständig | Wurf-, Sprint- und Trinkphase mit Zustandsmodifikatoren | abgeschlossen |
| Trinkduell | vollständig | fehlt | offen |
| Sonntags-Aufräumen | vollständig | fehlt | offen |
| Freitag-bis-Sonntag-Ablauf | vollständig | Zeitbasis vorhanden | teilweise |
| Enden und Wertung | vier Ergebnisgruppen | fehlt | offen |
| Speichern und Laden | v13, Export, Import, Backup | lokaler v3-Store mit automatischer v1-/v2-Migration | teilweise |
| Import vorhandener v13-Spielstände | nicht erforderlich | fehlt | offen |
| PWA und Offline | Build v29 | eigene Next-PWA mit Runtime-Cache | weitgehend |
| Automatische Kernregeltests | Runtime- und Endgame-Szenarien | Store- und Persistenztests | Grundlage abgeschlossen |
| Manueller Komplettdurchlauf | erforderlich | nach Parität erforderlich | offen |

## Nächster Entwicklungsschnitt

NPC-Tagespläne, Kontrollen, Schlaf und Kiosk bilden den nächsten vertikalen Abschnitt. Danach folgen Trinkduell, Sonntags-Aufräumen, Enden sowie der v13-Import. Die Next-Alpha bleibt bis zu diesem Paritätsnachweis ein separater GitHub-Pages-Build.

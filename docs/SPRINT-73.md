# Sprint 73 · Zuverlässige Questnavigation

## Anlass

Bei der Ankunftsquest konnten zwei Fehler den Spielfluss blockieren oder verwirren:

1. Das Schwarze Brett war nur über einen relativ kleinen generischen Landmarkenbereich erreichbar und auf Mobilgeräten nicht direkt antippbar.
2. Der gelbe Zielzeiger animierte seine Weltposition statt nur seine lokale Darstellung. Da der Tween bei `0/0` erzeugt wurde, konnte er nach einer Zustandsaktualisierung wieder in Richtung Kartenursprung springen.

## Umsetzung

- feste Quest-Zielkoordinate und optische Schwebeanimation getrennt
- Zielanker wird laufend aus dem aktuellen Questzustand synchronisiert
- eigenes sichtbares Schwarzes Brett an der tatsächlichen Interaktionsposition
- Öffnen per Aktionstaste sowie direktem Antippen
- größere Interaktionsfläche mit Entfernungsprüfung
- korrekte Reaktionen in den Zuständen:
  - Unterlagen fehlen
  - Rätsel verfügbar
  - Reservierung bereits gelöst
  - Ankunftsquest abgeschlossen
- aktiver Questschritt erhält einen zuverlässig nutzbaren Aktionsradius
- Zielreihenfolge beim Ausladen nutzt ausschließlich die zentralen Positionskonstanten

## Architektur

Die neue Datei `questNavigation.ts` enthält die reine Zustands- und Positionslogik. Die Phaser-Szene übernimmt nur Darstellung, Eingabe und Szenenwechsel. Dadurch können Zielanzeige, Questlogik und Tests unabhängig voneinander weiterentwickelt werden.

## Qualität

Neue Tests prüfen:

- stabile absolute Zielanker ohne Animationsdrift
- das Schwarze Brett als aktives Ziel nach dem Kofferraum
- alle Zustände des Reservierungsbretts
- die korrekte Zielreihenfolge beim Ausladen

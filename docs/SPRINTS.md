# Entwicklungsstand – fünf Sprints

## Sprint 1: Mobile Spielbühne und visuelles System

- Neue responsive Benutzeroberfläche für Smartphone, Tablet und Desktop
- Hoch- und Querformat, Safe-Area-Unterstützung und große Touch-Ziele
- Virtueller Analogstick, Aktionsknopf, Schnellzugriff und Status-HUD
- Neuer Charaktereditor, animierter Startbildschirm und Supermarkt-Prolog
- Einheitliche Dialog-, Drawer-, Toast- und Bestätigungsoberflächen
- Fehler werden sichtbar angezeigt statt als schwarzer Bildschirm

## Sprint 2: Welt, Zeit, Bedürfnisse und Story

- Große Top-down-Welt mit Parkplatz, Tor, Toiletten, Wachhütte, Lagern, Strand, See, Imbiss und Feuerstelle
- Freitagmorgen beginnt mit einem Einkauf für maximal 25 Euro
- Tag-Nacht-Wechsel und zeitabhängige NPCs sowie Aktivitäten
- Energie, Hunger, Durst, Blase, Alkohol, Breitheit, Mut und Kater
- Konsequenzen wie Erschöpfung, Blasenunfall und Filmriss
- Inventar, Gegenstandsnutzung, Restgeld, Imbiss und Autospeicherung
- Questlog, Beziehungen, Ruf, Ereignisprotokoll und Speicherstandsmigration
- Mehrstufige Dialogproben bei Gundula und Uli mit Gegenständen und Charaktermerkmalen

## Sprint 3: Team und rundenbasierte Kämpfe

- Aktives Team und Reserve mit maximal drei aktiven Figuren
- Rekrutierbare Figuren: Manni, Susi und Ronny
- Individuelle Werte, Fähigkeiten, Heilung, Schutz, Genauigkeit und Geschwindigkeit
- Statuseffekte, Wechselmechanik, Gegner-KI und mehrere Gegner
- Teammitglieder werden durch Quests, Minispiele oder Kämpfe freigeschaltet
- Kampfbelohnungen wirken auf Ruf, Geld, Story und Rekrutierung

## Sprint 4: Integrierte Minispiele

- Flip Cup mit Reaktions- und Flip-Phase
- Beer Pong mit Zielbewegung, Wurfzeitpunkt und Gegnerfortschritt
- Flunkyball mit Wurf, Trefferprüfung und Trinkphase
- Minispiele starten direkt aus der Oberwelt und kehren an dieselbe Position zurück
- Ergebnisse verändern Quests, Beziehungen, Teamoptionen, Bedürfnisse und Ruf

## Sprint 5: Ausbau, Optimierung und Bugfixing

- Vollständiger lokaler Spielstand mit Export, Import und Neustart
- Einstellbare derbe oder abgeschwächte Dialogfassung
- Haptik und reduzierte Bewegung als Optionen
- Mobile Web-App-Manifest für Installation auf dem Startbildschirm
- Komprimierter Runtime-Loader ohne externe Bibliothek oder CDN
- Sechs Runtime-Segmente anhand ihrer Git-Blob-SHAs kontrolliert
- Rekonstruktion des Runtime-Codes lokal bytegenau geprüft
- JavaScript-Syntaxprüfung für Runtime und Inhaltsdaten bestanden
- Veraltete und beschädigte Zwischenfragmente entfernt

## Aktueller Schwerpunkt

Diese Fassung ist ein umfangreicher spielbarer Vertical Slice. Die technische und spielmechanische Basis ist auf längere Storykapitel, weitere Karten, NPCs, Kämpfe, Minispiele und Wochenenden ausgelegt. Individuelle Grafiken, Animationen, Sounds und die vollständige reale Campingplatzkarte werden in späteren Content-Sprints ergänzt.

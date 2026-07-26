# Sprint 45 – detailreiche adaptive Grafik

Stand: 26. Juli 2026

## Ziel

Die Next-Alpha soll nicht länger wie eine Sammlung einfacher Grundformen wirken. Desktop und leistungsfähige Geräte erhalten die volle grafische Ausbaustufe; Smartphones bleiben vollständig spielbar, ohne die visuelle Richtung des Spiels zu begrenzen.

## Umsetzung

- Neue adaptive Grafikprofile unterscheiden zwischen `cinematic` und `balanced`.
- Die statische Detailtiefe bleibt auf allen Geräten erhalten. Reduziert werden auf eingeschränkten Smartphones nur Partikel, Wasseranimationen, bewegtes Laub und Post-Effekte.
- Figuren besitzen größere Texturen, individuelle Körperformen, Gesichtszüge, Frisuren, Accessoires, Kleidung, Arme und Schuhe.
- Gelände, Wege, Parkplatz, Strand und See erhielten Materialstruktur, Kleindetails, weichere Übergänge und animierte Wasserreflexe.
- Gebäude besitzen Fassadenmaterial, Dachziegel, Fensterrahmen, Türen, Schilder, Regenrinne, Blumenkästen und individuelle Merkmale.
- Zelte, Partyzelt, Wohnwagen, Bäume, Möbel, Zäune und Schilder wurden als deutlich detailliertere Objektvarianten neu gezeichnet.
- Fahrräder, Grill, Kühlbox, Wäscheleine, Sonnenschirm, Schilf, Bojen, Lagerausrüstung und Feuerfunken machen den Platz sichtbar bewohnt.
- Rezeption, Sanitärgebäude, eigenes Zelt und Partyzelt besitzen eigene Böden, Licht, Möbel, Kleinteile und atmosphärische Bewegung.
- Charaktererstellung, Supermarkt, HUD, Beziehungen und Dialoge erhielten eine zweite visuelle Tiefenstufe.
- Auf Geräten mit Maus/Tastatur werden die Touch-Controls ausgeblendet; auf Touch-Geräten bleiben sie vollständig verfügbar.
- Duell und alle drei Minispiele verwenden einen gemeinsamen illustrativen Szenenrahmen.
- Der PWA-Cache wurde auf `s45` angehoben.

## Nicht verändert

- Save-Format bleibt v3.
- Kollisionen, Questlogik, Balancing und Belohnungen bleiben funktional unverändert.
- Die vollständige Legacy-Alpha am Root-Link bleibt unangetastet.

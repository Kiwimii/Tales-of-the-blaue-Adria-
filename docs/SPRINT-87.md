# Sprint 87 – Grafikdetail, Platzierungsprüfung und Leistungsprofile

## Ziel

Die Welt soll sichtbar dichter und glaubwürdiger werden, ohne erneut eine zweite freie Koordinatenebene einzuführen. Gleichzeitig müssen alle Personen, Aktivitäten, Eingänge und Landmarken logisch positioniert, erreichbar und zuverlässig auslösbar bleiben.

## Kanonischer Grafik-Layer

`src/game/campgroundDetailLayer.ts` zeichnet zusätzliche Details ausschließlich aus der bestehenden Platzplanung und den Objektpositionen:

- Bodennutzung, Laufspuren und abgenutzte Flächen
- korrekte Objektschatten
- Zeltleinen, Heringe und Eingangsmatten
- Kühlboxen, Kisten, Campingstühle und weitere Stellplatzdetails
- Markisen, Stromkästen und Anschlüsse der Wohnwagen
- Lautsprecher, Kabel, Lichterketten und Veranstaltungsreste
- Strandspuren, Schilf, Sonnenschirm, Handtuch und Wasserreflexe
- Laub, Holzstapel, Werkzeuge, Kiesel und Treibholz
- dezente Bodenmarkierungen an tatsächlichen Aktivitätsankern

Die Detaildarstellung besitzt keine Kollisionen und verändert keine Weltpositionen.

## Zeltfrontweg

Der Audit zeigte, dass René und Lars zwar vor ihren Zelten standen, aber mehr als 200 Pixel vom vorhandenen Wegenetz entfernt waren. `src/game/interactionAccessPlan.ts` ergänzt deshalb einen sichtbaren, durchgehenden Kiesweg vor der Freundeszeltreihe. Grafik und Erreichbarkeitsprüfung verwenden dieselbe Wegdefinition.

## Grafikprofile

Das Systemmenü bietet drei gespeicherte Optionen:

### Automatisch

Berücksichtigt Pointertyp, Arbeitsspeicher, CPU-Kerne und die Systemeinstellung für reduzierte Bewegung.

### Mobil optimiert

- Pixeldichte 1,25
- reduzierte Umgebungspartikel
- rund halbierte Detaildichte
- weniger Wasserlinien
- keine animierten Detailobjekte
- keine bewegte Vegetation oder Post-FX

### PC optimiert

- Pixeldichte 2
- volle Detaildichte
- zusätzliche Umgebungspartikel
- animierte Wasserreflexe und Lichterketten
- bewegte Vegetation und Post-FX

Die Auswahl wird unter `tales-adria-graphics-mode` gespeichert. Beim Wechsel wird nur die Seite neu geladen; der Spielstand bleibt erhalten.

## Platzierungs- und Triggeraudit

`src/game/worldPlacementAudit.ts` prüft:

- korrekte Region jeder Aktivität
- Entfernung zum begehbaren Wegenetz
- plausiblen Auslöseradius
- Abstand zum sichtbaren Hostobjekt oder Host-NPC
- fehlende Hosts
- Trigger innerhalb fremder fester Objekte
- praktisch identische Triggerpunkte
- Erreichbarkeit von NPCs, Eingängen und Landmarken
- Auflösung von Story-, NPC-, Eingangs-, Landmarken- und Aktivitätsankern aus der gemeinsamen Planung

Jedes Minispiel besitzt nun zusätzlich einen expliziten Host:

- Ronny-Duell → Ronny
- Flip Cup und Beer Pong → Partyzelt
- Masls Technik → Masl
- Flunkyball → Strandtisch
- Hecken-Minispiel → östliche Zelthecke

## Qualität

Neue Tests decken Grafikprofile, Speicherung, Aktivitätsanker, Hostnähe, Wegenähe und Triggerpositionen ab. Der Release wird nur bei erfolgreichem TypeScript-Lauf, sämtlichen Tests, Produktionsbuild, Preview-Build und Sprint-87-Bundleprüfung veröffentlicht.

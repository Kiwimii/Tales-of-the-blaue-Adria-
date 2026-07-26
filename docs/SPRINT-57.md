# Sprint 57 – Der Weg zum Taucherplatz

Stand: 26. Juli 2026

## Ziel

Der bisherige Einlass bestand im Wesentlichen aus zwei Dialogproben. Sprint 57 macht daraus eine zusammenhängende Intro-Quest, die räumlich und erzählerisch vom Ankunftsparkplatz bis zum ersten Bier auf dem Taucherplatz führt.

## Questablauf

1. **Kofferraum durchsuchen**
   - Der Spieler findet einen zerknitterten Reservierungszettel.
   - Hinweise: Initialen „T.T.“, Taucherplatz, drei Personen, zwei Zelte, kein Strom.
   - Die sichtbare Ladung widerspricht den geschönten Angaben bereits deutlich.

2. **Reservierungsrätsel lösen**
   - Am Schwarzen Brett stehen mehrere aktuelle und frühere Aliasnamen.
   - Nur „Tauchgruppe Tiefenrausch“ passt zu sämtlichen Hinweisen.
   - Falsche Antworten kosten Zeit und liefern konkrete Gegenbeweise statt zufälliger Würfe.

3. **Anmeldung bei Gundula**
   - Gundula findet die Reservierung unter dem Alias.
   - Der Spieler muss die geringe Personen- und Zeltzahl plausibel verkaufen.
   - Personen, zusätzliche Zelte und der fehlende Strom werden dauerhaft als offene Abreisekosten gespeichert.
   - Batida de Coco ist ein starker optionaler Lösungsweg.

4. **Kontrolle durch Uli**
   - Uli prüft den Taucherplatz, das Fahrzeug und die Kleidung.
   - Lidl- und Aldimania-Optik werden ausdrücklich beanstandet.
   - Fokus, Charme oder das etablierte Batida-Protokoll können die Kontrolle lösen.

5. **Tutorialkampf an der Schranke**
   - Gundula und Uli treten gemeinsam als Verwaltungsgegner auf.
   - Der Kampf erklärt Beleg-Kontern, Regelwerk-Blocken und Team-Zuruf.
   - Neue Aktionen erhalten einen Bonus; Wiederholungen werden schwächer.
   - Batida verbessert den Team-Zuruf, ist aber nicht erforderlich.
   - Erst der Sieg öffnet physisch Schranke und Südlager.

6. **Wagen zum Taucherplatz bringen**
   - Der Wagen verschwindet vom Ankunftsparkplatz und erscheint auf der großen östlichen Parzelle.
   - Der Taucherplatz wurde räumlich freigeräumt und als größte Gruppenparzelle markiert.

7. **Strom organisieren**
   - Strom wurde nicht gebucht.
   - Lösungen: Anschlussplan lesen, Batida gegen Adapter tauschen oder eine verspätete Anmeldung bei Uli durchsetzen.
   - Die spätere Stromgebühr bleibt unabhängig vom Weg gespeichert.

8. **Räumlich ausladen**
   - Getränke, Zeltsäcke und Kabeltrommel sind drei getrennte Interaktionspunkte.
   - Das eigene Zelt erscheint erst nach dem Ausladen der Zeltsäcke.
   - Der Strom ist erst nach Ausrollen der Kabeltrommel physisch hergestellt.

9. **Erstes Bier**
   - Das Bier kann erst nach vollständigem Ausladen geöffnet werden.
   - Fehlt eigenes Bier, stellt Lars ein Notfallbier bereit.
   - Erst dieser Meilenstein beendet die Intro-Quest und aktiviert die übrigen Platzquests.

## Persistente Folgen

Die folgenden Probleme werden als Flags für eine spätere Abreise- und Bezahlquest gespeichert:

- zu wenig Personen angemeldet,
- zu wenig Zelte angemeldet,
- Strom nicht oder verspätet angemeldet,
- allgemeine offene Nachberechnung.

## Technische Struktur

- `arrivalQuest.ts`: reine Stufen-, Ziel- und Fortschrittslogik
- `arrivalEncounters.ts`: Gundula-, Uli- und Stromkasten-Entscheidungen
- `arrivalLayout.ts`: räumliche Taucherplatz-Anordnung
- `ReservationPuzzleScene.ts`: deterministisches Beweisrätsel
- `EntryDebateScene.ts`: Tutorialkampf
- `ArrivalQuestWorldScene.ts`: Weltinteraktionen, Fahrzeuge, Ausladen und Meilenstein
- `arrivalQuestRuntime.ts`: kompatible Erweiterung des bestehenden Stores ohne Save-Format-Änderung

Bestehende Spielstände, Quests, Figuren, Innenräume und Minispiele bleiben kompatibel. Bereits abgeschlossene Einlassquests werden nicht rückwirkend zurückgesetzt.

# Design: von Anfang an gut aussehen

## Die Grundregeln (immer, schon im ersten Wurf)

1. **Eine Schrift, sauber gesetzt.** Web: Inter, Geist oder eine Schrift passend zum „Gefühl“ (über `next/font` bzw. Fontsource, also lokal eingebunden und nicht von Google-Servern nachgeladen, wegen der DSGVO). Apps: Systemschrift. Größen aus einer Skala (z. B. 14/16/20/24/32/48), Überschriften mit etwas engerem Zeilenabstand.
2. **Ein Akzent, viel Ruhe.** Eine Akzentfarbe plus neutrale Grautöne. Keine Regenbogen-Oberflächen. Farben als Variablen bzw. Tokens definieren, damit Dark Mode und Themenwechsel einfach sind.
3. **Großzügiger Weißraum.** Abstände aus einer 4er/8er-Skala. Im Zweifel mehr Luft.
4. **Echte Inhalte.** Realistische deutsche Beispieltexte, Namen, Zahlen und Daten, die zur Idee passen. Kein Lorem ipsum. Bilder: passende freie Fotos (Unsplash-URLs) oder schlichte Illustrationen bzw. Verläufe, keine kaputten Platzhalter.
5. **Klare Hierarchie.** Pro Bildschirm ist sofort klar, was das Wichtigste ist und was man tun kann (eine Hauptaktion).
6. **Handy zuerst denken.** Jede Web-Ansicht muss bei 390 px Breite gut aussehen, ohne seitliches Scrollen. Klickflächen mindestens 44 px hoch.
7. **Feinheiten, die „hochwertig“ ausmachen:** abgerundete Ecken einheitlich, weiche Schatten statt harter Rahmen, Hover- und Druckzustände, sanfte Übergänge (150–250 ms), Icons aus einer Familie.

## Vermeiden (der typische „KI-Look“)

- Lila-blaue Verläufe auf allem, Glitzer-Emojis als Icons, zentrierte Textwände
- Fünf verschiedene Schriftgrößen in einem Absatz, Schatten auf jedem Element
- Generische Hero-Texte („Revolutionize your workflow“). Schreib stattdessen konkret, was die Sache für wen tut, auf Deutsch, außer Detlef will Englisch.

## Stilrichtungen (aus den 3 „Gefühl“-Adjektiven wählen oder mischen)

| Richtung | passt zu | Merkmale |
| --- | --- | --- |
| **Ruhig & hochwertig** | Tools, Finanzen, Gesundheit | viel Weiß/Off-White, ein gedeckter Akzent (Tiefblau, Waldgrün), feine Linien, Inter/Geist |
| **Warm & freundlich** | Familie, Essen, Hobby, Verein | Cremetöne, warmer Akzent (Terrakotta, Senf), runde Ecken (16–24 px), runde Schrift (z. B. Nunito) |
| **Klar & technisch** | Entwickler, Dashboards, Daten | Dark Mode zuerst, Monospace-Akzente, scharfe Kanten, ein leuchtender Akzent |
| **Verspielt & mutig** | Spiele, Events, junge Zielgruppe | kräftige Flächen, große Typo, Illustrationen, federnde Animationen |
| **Editorial** | Blog, Portfolio, Magazin | Serifenschrift für Überschriften, große Bilder, ruhiges Raster |
| **Apple-nativ** | iPhone/Mac-Apps | Systemfarben, Materialien bzw. Blur, SF Symbols, Standard-Navigationsmuster |

Wenn Detlef „mach’s schöner“ sagt, ohne Richtung: zuerst Abstände, Typo-Hierarchie und Farbe konsequenter machen (das bringt 80 %), dann Feinheiten (Schatten, Übergänge, Mikro-Animationen).

## Politur-Checkliste (Phase 5)

- [ ] App-Icon bzw. Favicon und Teilen-Vorschaubild (Open-Graph-Bild 1200×630)
- [ ] Dark Mode (folgt dem System), in beiden Modi geprüft
- [ ] Leere Zustände mit freundlichem Text und Hauptaktion („Noch keine Einträge. Leg den ersten an.“)
- [ ] Lade- und Fehlerzustände gestaltet, keine rohen Fehlermeldungen
- [ ] Übergänge und Mikro-Animationen sparsam, `prefers-reduced-motion` respektiert
- [ ] Barrierefreiheit: Kontrast ≥ 4,5:1, Alt-Texte, Tastaturbedienung, Fokus sichtbar, Labels an Formularfeldern
- [ ] Texte einmal komplett gegenlesen: Ton, Rechtschreibung, einheitliche Anrede (du oder Sie)
- [ ] Web: Lighthouse ≥ 90 in Performance, Barrierefreiheit, Best Practices und SEO (`npx lighthouse <url> --view` bzw. headless)
- [ ] Apps: Splash-Screen, Haptik an den richtigen Stellen, Safe Areas, große Schrift (Dynamic Type) getestet
- [ ] Alle Ansichten in Handy- und Desktopbreite angesehen (Screenshots)

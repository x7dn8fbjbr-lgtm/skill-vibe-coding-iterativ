---
name: vibe-coding
description: Iteratives Vibe-Coding von der Idee bis zur produktionsreifen Software, für Websites, Web-Apps, iPhone/Android-Apps (App Store) und Mac-Apps. Verwenden, wenn der Nutzer eine App-, Tool- oder Website-Idee umsetzen will ("ich hab eine Idee", "bau mir eine App", "mach mir eine Webseite", "vibe coden", /idee), Feedback zu einem laufenden Prototyp gibt (/feedback) oder etwas veröffentlichen will (/release). Ebenfalls verwenden, sobald im Arbeitsordner eine Datei .vibe/state.json liegt.
---

# Vibe-Coding: Idee → Prototyp → Feedback → Release

Der Nutzer ist **Detlef**. Er hat eine Idee und will **schnell etwas Sichtbares sehen, das schon gut aussieht**. Danach gibt er Feedback, und es geht in kurzen Runden weiter, bis das Ergebnis produktionsreif ist. Er programmiert kaum selbst. Rede mit ihm in Alltagssprache und duze ihn.

## Die fünf Grundregeln

1. **Erst zeigen, dann fragen.** Höchstens 2 Rückfragen vor dem ersten Wurf, und nur, wenn ohne die Antwort etwas völlig anderes entstehen würde (z. B. „iPhone-App oder Website?“). Alles andere nimmst du sinnvoll an und nennst es in einem Satz.
2. **Jede Runde endet mit etwas Sichtbarem.** Nach jeder Änderung: Vorschau aktualisieren und zeigen (siehe „Vorschau“). Eine Runde ohne sichtbares Ergebnis ist die Ausnahme und wird begründet.
3. **Kleine Schritte.** Eine Runde ist ein Bündel, das sich in einem Satz beschreiben lässt. Große Wünsche teilst du in Runden auf und sagst, welche du jetzt machst.
4. **Gut aussehen von Anfang an.** Kein Bootstrap-Grau, kein Lorem ipsum, keine leeren Platzhalter. Echte Beispielinhalte, saubere Typografie, ein klares Farbkonzept. Details in `references/design.md`.
5. **Kein Technik-Ballast für Detlef.** Keine Code-Blöcke im Chat, außer er fragt danach. Technische Entscheidungen triffst du selbst (Standards in `references/stacks.md`) und erklärst sie, wenn überhaupt, in einem Satz mit dem Nutzen für ihn.

## Projektgedächtnis: `.vibe/`

Jedes Vibe-Projekt hat im Projektordner:

- `.vibe/state.json`, maschinenlesbar (das vibe-Plugin zeigt daraus die Fortschrittsanzeige):
  ```json
  {
    "projekt": "Kaffee-Tracker",
    "ziel": "Web-App",
    "stack": "Next.js + Tailwind",
    "phase": "iteration",
    "iteration": 3,
    "vorschau": "http://localhost:3000",
    "offen": ["Dark Mode", "Export als CSV"]
  }
  ```
  `phase` ist eines von: `idee`, `prototyp`, `iteration`, `echt`, `politur`, `release`, `live`.
  `iteration` erhöhst du bei jeder Runde, die etwas ändert, um 1.
- `.vibe/brief.md`: der Vibe-Brief (siehe Phase 1), bei Kursänderungen aktualisieren.
- `.vibe/journal.md`: pro Runde **eine** Zeile: `#3 · Dark Mode ergänzt, Karten runder · Feedback: „zu verspielt“`.
- `.vibe/screenshots/`: die letzten Vorschaubilder (nicht ins Git, siehe `.gitignore`).

Liest du zu Beginn einer Sitzung eine vorhandene `.vibe/state.json`, dann knüpf direkt an: ein Satz, wo ihr steht, plus die offenen Punkte als Vorschlag.

## Sicherheitsnetz (Git)

- Neues Projekt: `git init`, sofort eine `.gitignore` mit mindestens `node_modules/`, `.env*`, `.vibe/screenshots/`, `.DS_Store`, Build-Ordnern.
- **Ist das vibe-Plugin aktiv**, legt es nach jeder Runde selbst einen Checkpoint-Commit an (`vibe #<iteration>: …`), und `/zurueck` setzt eine Runde zurück. Dann committest du **nicht** selbst.
- **Ohne Plugin** committest du am Ende jeder Runde selbst: `git add -A && git commit -m "vibe #<iteration>: <Kurzbeschreibung>"`.
- Geheimnisse (API-Schlüssel, Passwörter) kommen nur in `.env.local` bzw. die Secrets der Plattform, niemals in den Code oder ins Git. Braucht ihr einen Schlüssel, sag Detlef genau, wo er ihn herbekommt und wo er ihn einträgt.

## Umgebung erkennen (einmal pro Sitzung)

Prüf kurz, wo du läufst, denn davon hängt ab, was baubar ist:

- `uname -s` → `Darwin` = Mac. Dann zusätzlich `xcodebuild -version` (Xcode da?) und `open` für den Browser.
- `Linux` + Umgebungsvariablen wie `CLAUDE_CODE_REMOTE`, oder kein Display → **Cloud-Sitzung**. Hier gibt es kein Xcode und keinen Simulator. `localhost` ist für Detlef nicht erreichbar, deshalb sind **Screenshots die Vorschau**.

| Ziel | Mac lokal | Cloud |
| --- | --- | --- |
| Website / Web-App | voll | voll (Vorschau als Screenshot; öffentliche Vorschau per Deploy, wenn gewünscht) |
| iPhone/Android-App (Expo) | voll (Simulator + Expo Go) | Prototyp im Browser (Expo Web) + Screenshots; Store-Build über EAS in der Cloud |
| Mac-App (SwiftUI) | voll | nur Code schreiben, nicht bauen → Prototyp zuerst als klickbares Web-Mockup im selben Design, Umsetzung auf dem Mac |

Passt die Umgebung nicht zum Ziel, sag es in einem Satz und mach das Beste daraus, statt zu blockieren.

## Der Ablauf

### Phase 1: Funke (Idee → Vibe-Brief), maximal 2 Minuten

Aus Detlefs Idee formulierst du einen **Vibe-Brief** mit 6 Zeilen und zeigst ihn:

```
Was:        <ein Satz>
Für wen:    <wer nutzt es, in welcher Situation>
Kern:       <die EINE Sache, die im ersten Wurf funktionieren muss>
Gefühl:     <3 Adjektive für den Look, z. B. ruhig · hochwertig · warm>
Plattform:  <Website | Web-App | iPhone-App | iPhone+Android | Mac-App>  → Stack: <aus references/stacks.md>
Nicht jetzt: <was bewusst später kommt>
```

Dann **nicht auf Bestätigung warten**, sondern direkt bauen, außer eine der höchstens 2 Rückfragen ist wirklich nötig. Schreib den Brief nach `.vibe/brief.md`.

### Phase 2: Erster Wurf (Prototyp), Ziel unter 15 Minuten

- Projekt nach dem Standard-Stack anlegen (`references/stacks.md`), Abhängigkeiten installieren.
- **Nur den Kern** bauen, aber mit echtem Design: Startbildschirm, der Kernablauf, realistische Beispieldaten (lokal/im Speicher, noch keine Datenbank, kein Login).
- Design-Richtung aus dem „Gefühl“ ableiten (`references/design.md`).
- Dev-Server starten (im Hintergrund), Vorschau erzeugen und zeigen.
- `.vibe/state.json` mit `phase: "prototyp"`, `iteration: 1` anlegen.
- Abschluss: siehe „Rundenabschluss“.

### Phase 3: Feedback-Schleife (`phase: "iteration"`)

Pro Feedback von Detlef:

1. **Verstehen:** Ist das Feedback vage („wirkt irgendwie billig“), übersetz es in 2–3 konkrete Änderungen und mach sie, statt nachzufragen. Nenn kurz, wie du es verstanden hast.
2. **Umsetzen:** Nur das Besprochene plus offensichtliche Kleinigkeiten (Tippfehler, kaputte Abstände). Nichts ungefragt umbauen.
3. **Prüfen:** Läuft es? Keine Fehler in Konsole und Terminal? Bei Web: Desktop **und** Handybreite ansehen.
4. **Zeigen:** Vorschau aktualisieren, Screenshot(s) zeigen.
5. **Festhalten:** `iteration` +1, Journal-Zeile, `offen` pflegen.

Bei Varianten-Wünschen („probier mal was anderes“) baust du **2–3 Varianten nebeneinander** (z. B. als umschaltbare Themes oder als `/variante-a`, `/variante-b`) und zeigst sie gemeinsam, damit Detlef wählen kann, statt dass ihr hin und her springt.

### Phase 4: Echt machen (`phase: "echt"`), wenn Detlef sagt „so passt’s, jetzt richtig“

Das, was der Prototyp nur vorgetäuscht hat, wird echt. Vorher zeigst du eine kurze Liste, was dazu gehört, und arbeitest sie in Runden ab (jede Runde wieder mit Vorschau):

- Daten speichern (lokal → Datenbank), Login nur wenn nötig, echte Schnittstellen.
- Leere Zustände, Ladezustände, Fehlermeldungen in freundlicher Sprache.
- Eingaben prüfen; nichts, was abstürzt, wenn man Unsinn eingibt.
- Ein paar automatische Tests für den Kernablauf (Playwright für Web, XCTest/Expo-Tests für Apps). Detlef muss sie nicht verstehen, du lässt sie vor jedem Release laufen.

### Phase 5: Politur (`phase: "politur"`)

Checkliste in `references/design.md` → Abschnitt „Politur“. Dazu gehören App-Icon/Favicon, Animationen, Dark Mode, Barrierefreiheit, Geschwindigkeit und Texte.

### Phase 6: Release (`phase: "release"` → `live`)

Die passende Checkliste je Ziel aus `references/release.md` abarbeiten. Was nur Detlef selbst tun kann (Konten anlegen, bezahlen, Verträge, App-Store-Formulare), sagst du ihm als **nummerierte Schritte mit genauer Klickstrecke**. Alles andere erledigst du.

Die Phasen sind kein Korsett: Will Detlef mitten in der Politur ein neues Feature, dann ist das eben wieder eine Iterationsrunde.

## Vorschau

- **Web/Expo-Web:** Dev-Server im Hintergrund starten und die URL in `vorschau` eintragen. Dann Screenshots erzeugen:
  `node <skill-ordner>/scripts/screenshot.mjs <url> .vibe/screenshots` → erzeugt `desktop.png` und `mobil.png`.
  Fehlt Playwright, installier es im Projekt als Dev-Abhängigkeit (`npm i -D playwright`). In der Cloud ist Chromium bereits vorhanden, also **kein** `playwright install`.
- **Screenshots anschauen**, bevor du sie zeigst: Sieht es so aus wie gewollt? Wenn nicht, erst korrigieren.
- **Zeigen:** In der Cloud bzw. in der App die Bilder mit dem Datei-Senden-Werkzeug an Detlef schicken (falls vorhanden). Lokal auf dem Mac zusätzlich `open <url>`, damit es im Browser aufgeht. Beim ersten Wurf bzw. nach großen Änderungen beide Größen zeigen, sonst die relevante.
- **iOS (Mac):** `xcrun simctl` / `npx expo start --ios` und Screenshot mit `xcrun simctl io booted screenshot .vibe/screenshots/ios.png`.
- **Mac-App (Mac):** bauen und starten, Screenshot mit `screencapture -l<fensterid>` oder `screencapture -x`.
- **Öffentliche Vorschau-Links** (z. B. Vercel Preview), wenn Detlef etwas am Handy ansehen oder weitergeben will. Dafür braucht es einmalig ein Konto, die Schritte stehen in `references/release.md`.

## Rundenabschluss (immer gleich, kurz)

```
✦ Runde <n>: <was jetzt neu/anders ist, 1–2 Sätze>
[Screenshot(s)]
Vorschau: <url oder „siehe Bilder“>

Als Nächstes könnte ich:
1. <naheliegendster nächster Schritt>
2. <etwas, das es deutlich besser aussehen lässt>
3. <etwas Mutiges/Überraschendes>
Oder sag mir einfach, was dir auffällt.
```

Kein langer Bericht, keine Liste geänderter Dateien (die steht im Checkpoint). Ist etwas schiefgegangen oder hast du bewusst etwas weggelassen, sag es offen.

## Wenn etwas kaputt ist

- Fehler zuerst selbst beheben (Logs lesen, reproduzieren, fixen, erneut prüfen). Detlef bekommt nur das Ergebnis mit einem Satz, was los war.
- Nach zwei erfolglosen Anläufen: Detlef fragen, ob du zum letzten Checkpoint zurückgehen sollst (`/zurueck`) und es anders angehst.
- Niemals Tests abschalten oder Fehler verstecken, um „fertig“ melden zu können.

## Befehle (vibe-Plugin)

| Befehl | Was passiert |
| --- | --- |
| `/idee <Idee>` | Phase 1 + 2: Vibe-Brief und erster Wurf |
| `/feedback <Text>` | eine Runde der Feedback-Schleife |
| `/vorschau` | Vorschau neu erzeugen und zeigen, ohne etwas zu ändern |
| `/release` | Weg zur Veröffentlichung für das Ziel des Projekts |
| `/zurueck [n]` | letzte n Runden rückgängig (alter Stand bleibt in einem Zweig) |
| `/vibe-status` | Phase, offene Punkte, letzte Checkpoints |

Freitext funktioniert genauso. Die Befehle sind nur Abkürzungen.

## Referenzen

- `references/stacks.md`: Standard-Technik je Ziel, Projektvorlagen, Befehle
- `references/design.md`: Design-Grundregeln, Stilrichtungen, Politur-Checkliste
- `references/release.md`: Checklisten für Website, App Store / Google Play, Mac

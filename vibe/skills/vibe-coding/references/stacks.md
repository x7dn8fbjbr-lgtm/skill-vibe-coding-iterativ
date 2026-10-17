# Standard-Stacks

Ziel: Detlef entscheidet nichts Technisches. Du nimmst den Standard für das Ziel und weichst nur ab, wenn es einen klaren Grund gibt (dann ein Satz, warum). Immer TypeScript, wo es geht. Immer die aktuelle stabile Version (`@latest` beim Anlegen), danach festgeschrieben im Lockfile.

## Entscheidungsbaum

1. **Reine Website** (Infos, Portfolio, Landingpage, Blog, Verein) → **Astro + Tailwind CSS**
2. **Web-App** (Login, Daten, Interaktion, Dashboard, Tool im Browser) → **Next.js (App Router) + Tailwind CSS + shadcn/ui**
3. **Handy-App** (iPhone, gern auch Android) → **Expo (React Native) + Expo Router + NativeWind**
4. **Mac-App**, die lokal läuft → **SwiftUI** (nur auf dem Mac baubar). In der Cloud zuerst ein klickbares Web-Mockup (Vite + React + Tailwind) im Mac-Look, dann SwiftUI auf dem Mac.
5. **Nur fürs iPhone, und es soll sich maximal „Apple“ anfühlen**, oder es braucht tiefe Systemfunktionen (Widgets, HealthKit, Live Activities) → **SwiftUI** statt Expo. Geht nur auf dem Mac.

Unklar zwischen 1 und 2? → Next.js, es kann beides.

## 1. Website: Astro

```bash
npm create astro@latest <name> -- --template minimal --install --git --typescript strict --yes
cd <name> && npx astro add tailwind --yes
npm run dev -- --host            # Vorschau: http://localhost:4321
```
- Inhalte als Markdown/MDX in `src/content/`, damit Detlef Texte später selbst ändern kann.
- Bilder über `astro:assets` (automatisch optimiert).
- Deploy: Vercel oder Netlify (statisch, kostenlos für kleine Seiten).

## 2. Web-App: Next.js

```bash
npx create-next-app@latest <name> --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --yes
cd <name> && npx shadcn@latest init -d
npx shadcn@latest add button card input dialog sonner   # nach Bedarf
npm run dev                      # Vorschau: http://localhost:3000
```
- Icons: `lucide-react`. Animation: `motion` (früher framer-motion), sparsam.
- **Prototyp:** Daten im Speicher oder `localStorage`, kein Backend.
- **Echt machen:** Supabase (Postgres + Auth + Storage, EU-Region Frankfurt wählen) über `@supabase/ssr`. Alternativ für sehr einfache Fälle: SQLite mit Drizzle.
- Formulare: `react-hook-form` + `zod`.
- Tests: Playwright (`npm init playwright@latest`), 2–5 Tests für den Kernablauf.
- Deploy: Vercel.

## 3. Handy-App: Expo

```bash
npx create-expo-app@latest <name> --template default
cd <name> && npx expo install nativewind react-native-reanimated react-native-safe-area-context
npx expo start --web             # Vorschau im Browser (auch in der Cloud)
npx expo start                   # Mac: i = iOS-Simulator; Handy: Expo Go + QR-Code
```
- NativeWind nach aktueller Anleitung einrichten (tailwind.config, babel/metro-Konfiguration). Prüfe die offizielle Doku, falls die Einrichtung sich geändert hat.
- Icons: `@expo/vector-icons` oder `lucide-react-native`.
- Speicherung lokal: `expo-sqlite` oder `@react-native-async-storage/async-storage`; mit Konto/Sync: Supabase.
- Vorschau-Screenshots in der Cloud: Expo Web mit Handy-Viewport (390×844).
- **Achtung Web-Vorschau:** Nicht alles, was nativ geht (Kamera, Haptik, Benachrichtigungen), läuft im Browser. Dann eine Attrappe für die Vorschau einbauen und Detlef sagen, dass das auf dem echten Handy getestet wird.
- Build und Store: EAS (`npx eas-cli build`, `eas submit`), läuft in Expos Cloud und braucht keinen Mac.

## 4./5. SwiftUI (Mac/iPhone nativ, nur auf dem Mac)

- Projekt ohne Xcode-Klickerei anlegen: mit **XcodeGen** (`brew install xcodegen`), `project.yml` schreiben und dann `xcodegen generate`. Alternativ ein Swift Package mit App-Target.
- Bauen und starten (Mac-App):
  ```bash
  xcodebuild -scheme <Name> -configuration Debug -derivedDataPath build build
  open build/Build/Products/Debug/<Name>.app
  ```
- iPhone: `xcodebuild -scheme <Name> -destination 'platform=iOS Simulator,name=iPhone 16' build` und dann mit `xcrun simctl install/launch` starten.
- Daten: SwiftData. Einstellungen: `@AppStorage`.
- Design: System-Materialien, SF Symbols, `.navigationSplitView` für Mac-Fenster mit Seitenleiste.

## Allgemein

- Paketmanager: npm (am wenigsten Überraschungen). Node in aktueller LTS-Version.
- Dev-Server immer im Hintergrund starten und den Port merken (`vorschau` in `.vibe/state.json`).
- Ordnerstruktur nicht verkomplizieren: so flach wie möglich, sprechende Dateinamen.
- Neue Abhängigkeiten nur mit Grund. Kein „noch eine Bibliothek“ für etwas, das 20 Zeilen Code sind.

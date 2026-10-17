# Release-Checklisten

Vorgehen: Checkliste fürs Ziel zeigen (kurz) und abarbeiten. Was nur Detlef selbst tun kann, ist mit 👤 markiert. Dafür gibst du ihm nummerierte Schritte mit genauer Klickstrecke und wartest auf sein „erledigt“. Alles andere machst du. Vor jedem Release: Tests laufen lassen, Produktions-Build lokal bauen, keine Geheimnisse im Repository (`git grep` nach `sk_`, `key`, `secret`, `password` und `.env` prüfen).

## A) Website / Web-App (Vercel)

1. 👤 Konto bei Vercel (mit GitHub-Login) und GitHub-Repository für das Projekt. Biete an, das Repository anzulegen und hochzuladen.
2. Produktions-Build lokal grün (`npm run build`), Tests grün.
3. Umgebungsvariablen auflisten. 👤 Detlef trägt sie in Vercel unter Project → Settings → Environment Variables ein (du sagst genau welche, nie die Werte im Chat wiederholen).
4. Deploy: Vercel-Projekt mit dem GitHub-Repository verbinden (jeder Push = neue Version, jeder Branch = Vorschau-Link) oder `npx vercel --prod`.
5. 👤 Eigene Domain: kaufen (z. B. bei INWX, Strato, Cloudflare) und in Vercel unter Domains eintragen. DNS-Einträge sagst du ihm.
6. **Rechtliches in Deutschland**, sobald die Seite öffentlich und nicht rein privat ist:
   - Impressum (§ 5 DDG), von jeder Seite mit einem Klick erreichbar
   - Datenschutzerklärung (DSGVO), passend zu dem, was die Seite wirklich tut (Hosting, Formulare, Analyse, eingebundene Dienste)
   - Cookie-Banner **nur**, wenn nicht notwendige Cookies oder Tracker im Spiel sind. Besser: keine Tracker, Schriften lokal, Analyse cookielos (z. B. Plausible, Vercel Analytics)
   - 👤 Inhalte prüfen lassen oder einen Generator nutzen (z. B. e-recht24). Du lieferst Entwürfe, aber keine Rechtsberatung, sag das dazu.
7. SEO-Grundlagen: Titel und Beschreibung pro Seite, `sitemap.xml`, `robots.txt`, Open-Graph-Bild, sprechende URLs, `lang="de"`.
8. Fehler-Überwachung (optional): Sentry (kostenloser Plan) oder mindestens Vercel-Logs.
9. Nach dem Go-Live: Live-URL einmal komplett durchklicken (Screenshots Desktop und Handy) und `phase: "live"` setzen.

## B) iPhone-App (App Store) mit Expo/EAS

1. 👤 **Apple Developer Program** beitreten (99 USD/Jahr, developer.apple.com → Account). Als Privatperson oder mit Firma (Firma braucht eine D-U-N-S-Nummer). Freischaltung kann 1–2 Tage dauern.
2. 👤 Expo-Konto (expo.dev), dann `npx eas-cli login`.
3. `app.json`/`app.config.ts`: Name, `ios.bundleIdentifier` (z. B. `de.hoefer.kaffeetracker`), Version, Build-Nummer, Icon (1024×1024, ohne Transparenz), Splash-Screen, Berechtigungstexte (Kamera, Fotos …) auf Deutsch.
4. `npx eas-cli build:configure`, dann `eas build -p ios --profile production`. EAS legt die Zertifikate an, Detlef bestätigt nur mit seinem Apple-Login.
5. **TestFlight:** `eas submit -p ios`. 👤 Detlef installiert TestFlight auf dem iPhone und testet. Feedback daraus = neue Iterationsrunden.
6. 👤 App Store Connect → App anlegen: Name, Untertitel, Beschreibung, Schlüsselwörter, Kategorie, Altersfreigabe. Texte entwirfst du.
7. Screenshots: 6,9"-iPhone (1320×2868 o. ä., aktuelle Pflichtgrößen in App Store Connect prüfen) aus dem Simulator oder per Expo Web im passenden Viewport. Du erzeugst sie.
8. **Datenschutz:** Datenschutzerklärung-URL (z. B. eine einfache Seite auf Vercel) und die „App Privacy“-Angaben (welche Daten werden erhoben). Bei Konten: In-App-Kontolöschung ist Pflicht.
9. Review-Fallen vorher prüfen: keine Platzhalter, kein „Beta“ im Namen, Login-Testzugang für die Prüfer, keine kaputten Links, App muss mehr sein als eine verpackte Website (Guideline 4.2).
10. 👤 Zur Prüfung einreichen. Bei Ablehnung: Begründung an dich weitergeben, du behebst es.
11. Updates später: Kleine JS-Änderungen über `eas update` (ohne Review), größere über neuen Build.

**Google Play (optional, gleiche Codebasis):** 👤 Google Play Console (einmalig 25 USD), `eas build -p android`, `eas submit -p android`. Neue private Konten brauchen einen geschlossenen Test mit Testern über 14 Tage. Prüfe die aktuellen Regeln.

## C) iPhone-App nativ (SwiftUI)

Wie B), aber Build und Upload über Xcode: Signing-Team setzen, Product → Archive → Distribute App → App Store Connect. Oder per Kommandozeile mit `xcodebuild archive` + `xcodebuild -exportArchive` + `xcrun altool`/`notarytool`. Nur auf dem Mac.

## D) Mac-App, die nur lokal läuft

**Nur für Detlef selbst (kein Vertrieb):**
1. Release-Build: `xcodebuild -scheme <Name> -configuration Release -derivedDataPath build build`
2. Nach `/Applications` kopieren: `cp -R build/Build/Products/Release/<Name>.app /Applications/`
3. Optional: in Anmeldeobjekte aufnehmen (Systemeinstellungen → Allgemein → Anmeldeobjekte) oder per `SMAppService` selbst starten lassen.
4. Ohne Developer-Konto läuft eine selbst gebaute App auf dem eigenen Mac problemlos (Signing „Sign to Run Locally“).

**Weitergeben an andere (außerhalb des App Stores):**
1. 👤 Apple Developer Program (siehe B1)
2. Mit „Developer ID Application“ signieren, Hardened Runtime an
3. Notarisieren: `xcrun notarytool submit <Name>.zip --keychain-profile <profil> --wait`, dann `xcrun stapler staple <Name>.app`
4. Als DMG verpacken (`hdiutil create` oder `create-dmg`), optional automatische Updates mit Sparkle

**Mac App Store:** wie C), zusätzlich App Sandbox aktivieren und Berechtigungen (Entitlements) begründen.

## Nach jedem Release

- Versionsnummer erhöhen, Git-Tag setzen (`v1.0.0`), Eintrag in `.vibe/journal.md`
- `phase: "live"` setzen. Neue Wünsche danach sind wieder normale Iterationsrunden, und das nächste Release geht dieselbe Checkliste kürzer durch.

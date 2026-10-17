# vibe: Vibe-Coding von der Idee bis zum Release

Ein Claude-Code-Plugin für den Weg **Idee → hübscher Prototyp in Minuten → Feedback-Runden → produktionsreife Software**. Es eignet sich für Websites, Web-Apps, iPhone/Android-Apps (App Store) und Mac-Apps, lokal auf dem Mac oder in der Cloud.

## Was drin ist

| Teil | Was es tut |
| --- | --- |
| **Skill `vibe-coding`** | Die Arbeitsweise: Vibe-Brief statt Lastenheft, erster Wurf mit gutem Design, kurze Feedback-Runden mit Vorschau-Screenshots, dann echt machen, Politur und Release. Mit Standard-Technik je Ziel, Design-Regeln und Release-Checklisten (inkl. Impressum/DSGVO und App-Store-Ablauf). |
| **Befehle** | `/idee`, `/feedback`, `/vorschau`, `/release` (lösen den Skill aus) sowie `/zurueck [n]` und `/vibe-status` (laufen sofort, ohne Modell) |
| **Automatische Vorschau** | `scripts/screenshot.mjs` macht nach jeder Runde Bilder in Desktop- und Handygröße und meldet Konsolenfehler und seitliches Scrollen |
| **Fortschrittsanzeige** | Leiste über dem Eingabefeld und Statuszeile: Projekt, Phase, Iteration, Vorschau-Link, letzter Checkpoint, Knöpfe *Zurück* und *Status* |
| **Sicherheitsnetz** | Nach jeder Runde ein Git-Checkpoint (`vibe #4: …`), vor jeder Runde werden eigene Änderungen gesichert. `/zurueck` geht zurück, der verworfene Stand bleibt im Zweig `vibe/verworfen-…` erhalten |

Die Mods (Anzeige, Checkpoints, `/zurueck`) werden nur in Ordnern aktiv, in denen ein Vibe-Projekt liegt (`.vibe/state.json`). Überall sonst merkst du nichts davon.

## Installation

In einer Claude-Code-Sitzung im Terminal:

```
/plugin install vibe --marketplace x7dn8fbjbr-lgtm/skill-vibe-coding-iterativ
```

Dann `y` zum Hinzufügen des Marketplace und als Bereich **user** wählen, damit es in allen Projekten verfügbar ist.

Aus der Shell geht es auch so:

```
claude plugin install vibe --marketplace x7dn8fbjbr-lgtm/skill-vibe-coding-iterativ
```

In der Desktop-App: **+** neben dem Eingabefeld → Plugins → Add marketplace mit `x7dn8fbjbr-lgtm/skill-vibe-coding-iterativ` → Add plugin.

Ist das Repository privat, braucht der Rechner einen Git-Zugang zu GitHub (z. B. `gh auth login` und danach `gh auth setup-git`).

**In Cloud-Sitzungen (claude.ai/code):** In das jeweilige Projekt-Repository eine `.claude/settings.json` legen:

```json
{
  "extraKnownMarketplaces": {
    "vibe-coding": { "source": { "source": "github", "repo": "x7dn8fbjbr-lgtm/skill-vibe-coding-iterativ" } }
  },
  "enabledPlugins": { "vibe@vibe-coding": true }
}
```

## Benutzung

```
/idee Eine App, mit der ich meinen Kaffeekonsum tracke, mit schöner Wochenübersicht
```

…schauen, dann z. B.:

```
/feedback Die Karten wirken zu verspielt, eher ruhig und hochwertig. Und ich will die Woche als Balken sehen.
/zurueck            # letzte Runde war doch nichts
/vibe-status
/release App Store
```

Freitext funktioniert genauso. Die Befehle sind nur Abkürzungen.

## Aufbau

```
.claude-plugin/marketplace.json     Marketplace-Eintrag
vibe/
  .claude-plugin/plugin.json
  commands/                         /idee /feedback /vorschau /release
  hooks/register.tsx                Mods: Anzeige, Checkpoints, /zurueck, /vibe-status
  hooks/vibe.test.ts                Tests (claude plugin test vibe)
  types/index.d.ts                  Typen für .vibe/state.json
  skills/vibe-coding/
    SKILL.md                        die Arbeitsweise
    references/stacks.md            Standard-Technik je Ziel
    references/design.md            Design-Regeln, Stilrichtungen, Politur
    references/release.md           Release-Checklisten Web / App Store / Mac
    scripts/screenshot.mjs          Vorschau-Screenshots
```

Entwickeln: `claude plugin validate vibe` und `claude plugin test vibe`.

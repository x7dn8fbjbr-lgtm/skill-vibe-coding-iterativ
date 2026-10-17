import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'

import type { VibePhase, VibeState } from '../types'

const STATE_FILE = '.vibe/state.json'
const CHECKPOINT_PREFIX = 'vibe #'

const state = atom({ plugin: 'vibe', key: 'state' } as const, null)
const checkpoint = atom({ plugin: 'vibe', key: 'checkpoint' } as const, null)

const PHASES: Record<VibePhase, string> = {
  idee: 'Idee',
  prototyp: 'Erster Wurf',
  iteration: 'Feedback-Schleife',
  echt: 'Echt machen',
  politur: 'Politur',
  release: 'Release',
  live: 'Live',
}

const MODE_SECTION = [
  'Vibe-Modus ist aktiv: In diesem Ordner liegt ein Vibe-Projekt (.vibe/state.json).',
  'Arbeite nach dem Skill "vibe-coding" (lade ihn, falls noch nicht geschehen):',
  'kleine, sichtbare Schritte; nach jeder Änderung die Vorschau aktualisieren und zeigen;',
  '.vibe/state.json und .vibe/journal.md aktuell halten; erklären in Alltagssprache, ohne Code-Dumps.',
  'Git-Checkpoints legt das vibe-Plugin nach jedem Durchgang selbst an: committe nicht selbst,',
  'außer der Nutzer bittet ausdrücklich darum.',
].join(' ')

type $ = EngineInterface

async function git($: $, args: string[]) {
  try {
    return await $.process.run(['git', ...args], { timeoutMs: 20_000 })
  } catch {
    return { exitCode: 127, stdout: '', stderr: 'git nicht verfügbar' }
  }
}

async function loadState($: $): Promise<VibeState | null> {
  try {
    if (!(await $.fs.exists(STATE_FILE))) return null
    const parsed = JSON.parse(await $.fs.read(STATE_FILE)) as Partial<VibeState>

    return {
      projekt: parsed.projekt ?? 'Vibe-Projekt',
      ziel: parsed.ziel,
      stack: parsed.stack,
      phase: parsed.phase && parsed.phase in PHASES ? parsed.phase : 'idee',
      iteration: typeof parsed.iteration === 'number' ? parsed.iteration : 0,
      vorschau: parsed.vorschau,
      offen: Array.isArray(parsed.offen) ? parsed.offen : [],
    }
  } catch {
    return null
  }
}

async function refresh($: $) {
  const next = await loadState($)
  await update($, state, () => next)
  $.ui.status(next ? `vibe · ${PHASES[next.phase]} · #${next.iteration}` : undefined)

  return next
}

async function isRepo($: $) {
  return (await git($, ['rev-parse', '--is-inside-work-tree'])).exitCode === 0
}

async function isDirty($: $) {
  const { exitCode, stdout } = await git($, ['status', '--porcelain'])

  return exitCode === 0 && stdout.trim() !== ''
}

async function commitAll($: $, message: string) {
  await git($, ['add', '-A'])
  const hasIdentity = (await git($, ['config', 'user.email'])).stdout.trim() !== ''
  const identity = hasIdentity ? [] : ['-c', 'user.name=Vibe Checkpoint', '-c', 'user.email=vibe@localhost']
  const { exitCode } = await git($, [...identity, 'commit', '-q', '-m', message])

  return exitCode === 0
}

function summarize(text: string) {
  const line = text.trim().split('\n')[0] ?? ''

  return line.length > 60 ? `${line.slice(0, 57)}...` : line || 'Änderung'
}

function stamp() {
  return new Date().toISOString().replace(/[-:]/g, '').replace('T', '-').slice(0, 15)
}

async function goBack($: $, steps: number): Promise<{ text: string; context?: string[] }> {
  if (!(await isRepo($))) return { text: 'Hier gibt es noch keine Checkpoints (kein Git-Repository).' }

  if (await isDirty($)) await commitAll($, 'vibe: ungesicherte Änderungen vor /zurueck')

  if ((await git($, ['rev-parse', '--verify', '-q', `HEAD~${steps}`])).exitCode !== 0) {
    return { text: `So weit zurück gibt es keinen Checkpoint (${steps} Schritt(e)).` }
  }

  const backup = `vibe/verworfen-${stamp()}`
  await git($, ['branch', backup, 'HEAD'])
  const reset = await git($, ['reset', '-q', '--hard', `HEAD~${steps}`])
  if (reset.exitCode !== 0) return { text: `Zurücksetzen hat nicht geklappt: ${reset.stderr.trim()}` }

  const { stdout } = await git($, ['log', '-1', '--format=%s'])
  await update($, checkpoint, () => stdout.trim())
  await refresh($)

  return {
    text:
      `Zurück auf: „${stdout.trim()}“.\n` +
      `Der verworfene Stand ist sicher im Zweig ${backup} aufgehoben, falls du ihn doch wieder brauchst.`,
    context: [
      `Der Nutzer hat mit /zurueck ${steps} Schritt(e) zurückgesetzt (git reset auf „${stdout.trim()}“). ` +
        `Dateien und .vibe/state.json haben sich geändert: lies sie neu, bevor du weiterarbeitest, ` +
        `und aktualisiere die Vorschau. Der alte Stand liegt im Zweig ${backup}.`,
    ],
  }
}

async function overview($: $) {
  const current = await refresh($)
  if (!current) {
    return 'Hier ist (noch) kein Vibe-Projekt. Starte eins mit /idee <deine Idee>.'
  }

  const log = await git($, ['log', '-5', '--format=%h  %s'])
  const lines = [
    `**${current.projekt}**${current.ziel ? ` · ${current.ziel}` : ''}${current.stack ? ` · ${current.stack}` : ''}`,
    `Phase: ${PHASES[current.phase]} · Iteration ${current.iteration}`,
    current.vorschau ? `Vorschau: ${current.vorschau}` : undefined,
    current.offen && current.offen.length > 0
      ? `Offen:\n${current.offen.map(item => `- ${item}`).join('\n')}`
      : undefined,
    log.exitCode === 0 && log.stdout.trim() !== ''
      ? `Letzte Checkpoints:\n${log.stdout.trim().split('\n').map(item => `- ${item}`).join('\n')}`
      : undefined,
  ]

  return lines.filter(Boolean).join('\n')
}

export const register: Register = on => {
  let lastPrompt = ''

  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'zurueck',
      description: 'Vibe: letzte Iteration rückgängig machen (alter Stand bleibt in einem Zweig erhalten)',
      argumentHint: '[anzahl]',
    })
    await $.command.register({
      name: 'vibe-status',
      description: 'Vibe: Projekt, Phase, offene Punkte und letzte Checkpoints anzeigen',
    })
    await refresh($)

    return next(e)
  })

  on('command.run', { command: 'zurueck' }, async ($, e) => {
    const steps = Math.max(1, Number.parseInt(e.args.trim() || '1', 10) || 1)

    return goBack($, steps)
  })

  on('command.run', { command: 'vibe-status' }, async $ => ({ text: await overview($) }))

  // Sicherheitsnetz, Teil 1: was der Nutzer zwischendurch selbst geändert hat, wird vor dem
  // nächsten Durchgang gesichert, damit /zurueck nie eigene Handarbeit verschluckt.
  on('prompt.submit', async ($, e, next) => {
    lastPrompt = e.text
    if ((await loadState($)) && (await isRepo($)) && (await isDirty($))) {
      await commitAll($, 'vibe: Änderungen zwischen den Iterationen')
    }

    return next(e)
  })

  // Sicherheitsnetz, Teil 2: nach jedem Durchgang ein Checkpoint, wenn sich etwas geändert hat.
  on('turn.complete', async ($, e, next) => {
    const done = await next(e)
    if (e.agentId !== undefined) return done

    const current = await refresh($)
    if (!current || !(await isRepo($)) || !(await isDirty($))) return done

    const message = `${CHECKPOINT_PREFIX}${current.iteration}: ${summarize(lastPrompt)}`
    if (await commitAll($, message)) {
      await update($, checkpoint, () => message)
      $.ui.toast(`Checkpoint gesichert: ${message}. /zurueck macht ihn rückgängig.`)
    }

    return done
  })

  on('prompt.compose', async ($, e, next) => {
    const composed = await next(e)
    if (!(await $.fs.exists(STATE_FILE))) return composed

    return {
      sections: [...composed.sections, { id: 'vibe:modus', text: MODE_SECTION, scope: 'session' as const }],
    }
  })

  // Fortschrittsanzeige über dem Eingabefeld.
  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    const current = await read($, state)
    if (e.props.hasSurvey || current === null) return next(e)

    const last = await read($, checkpoint)
    const { Box, Button, Text } = $.ui.resolve(e)

    return (
      <Box flexDirection="column">
        <Box>
          <Text bold color="magenta">
            ✦ {current.projekt}
          </Text>
          <Text>
            {'  '}
            {PHASES[current.phase]} · Iteration {current.iteration}
          </Text>
          {current.vorschau && <Text dimColor>{`  Vorschau: ${current.vorschau}`}</Text>}
        </Box>
        <Box>
          <Text dimColor>
            {last ? `Letzter Checkpoint: ${last}  ` : 'Noch kein Checkpoint  '}
          </Text>
          {!e.props.isWorking && (
            <Button key="zurueck" label="Zurück" onPress={() => goBack($, 1).then(r => $.ui.toast(r.text))} />
          )}
          <Text> </Text>
          <Button key="status" label="Status" onPress={() => overview($).then(text => $.ui.toast(text))} />
        </Box>
      </Box>
    )
  })
}

import { expect, test } from 'claude-code/testing'
import type { On } from 'claude-code'

const STATE = JSON.stringify({
  projekt: 'Kaffee-Tracker',
  ziel: 'Web-App',
  phase: 'iteration',
  iteration: 3,
  vorschau: 'http://localhost:3000',
  offen: ['Dark Mode'],
})

const COMPOSE = {
  model: 'test-model',
  promptModel: 'test-model',
  surfaces: [],
  tools: [],
  outputStyle: null,
  traits: [],
}

const run = (command: string, args = '') => ({
  command,
  args,
  origin: { kind: 'plugin' as const, name: 'test' },
  presentation: { isFullscreen: false, columns: 80 },
})

// Ein Vibe-Projekt mit Git-Repository, in dem `dirty` sagt, ob ungesicherte Änderungen da sind.
function project(on: On, options: { dirty: boolean; hasState?: boolean }) {
  const calls: string[][] = []
  on('fs.exists', async ($, e) => ({ value: e.path.endsWith('/.vibe/state.json') && options.hasState !== false }))
  on('fs.read', async () => ({ value: STATE }))
  on('ui.status', async () => ({ value: undefined }))
  on('process.run', async ($, e) => {
    const args = e.argv.slice(1)
    calls.push([...args])
    const out = (stdout: string, exitCode = 0) => ({
      value: { exitCode, stdout, stderr: '', isStdoutTruncated: false, isStderrTruncated: false },
    })
    if (args[0] === 'status') return out(options.dirty ? ' M app/page.tsx\n' : '')
    if (args[0] === 'config') return out('detlef@example.com\n')
    if (args[0] === 'log') return out('abc1234  vibe #2: Startseite')
    return out('')
  })

  return calls
}

test('/vibe-status zeigt Projekt, Phase und offene Punkte', async ($, on) => {
  project(on, { dirty: false })
  const { text } = await $.command.run(run('vibe-status'))

  expect(text).toContain('Kaffee-Tracker')
  expect(text).toContain('Feedback-Schleife · Iteration 3')
  expect(text).toContain('- Dark Mode')
})

test('/zurueck sichert den alten Stand in einem Zweig und setzt zurück', async ($, on) => {
  const calls = project(on, { dirty: false })
  const { text, context } = await $.command.run(run('zurueck', '2'))

  expect(calls.some(args => args[0] === 'branch' && String(args[1]).startsWith('vibe/verworfen-'))).toBe(true)
  expect(calls).toContainEqual(['reset', '-q', '--hard', 'HEAD~2'])
  expect(text).toContain('vibe #2: Startseite')
  expect(context?.length).toBe(1)
})

test('/zurueck sichert vorher ungesicherte Änderungen', async ($, on) => {
  const calls = project(on, { dirty: true })
  await $.command.run(run('zurueck'))

  const commit = calls.findIndex(args => args.includes('commit'))
  const reset = calls.findIndex(args => args[0] === 'reset')
  expect(commit).toBeGreaterThan(-1)
  expect(commit).toBeLessThan(reset)
})

test('ohne Vibe-Projekt bleibt der Systemprompt unverändert', async ($, on) => {
  project(on, { dirty: false, hasState: false })
  on('prompt.compose', async () => ({ sections: [{ id: 'intro', text: 'x', scope: 'shared' as const }] }))
  const { sections } = await $.prompt.compose(COMPOSE)

  expect(sections.map(section => section.id)).toEqual(['intro'])
})

test('im Vibe-Projekt kommt der Vibe-Modus in den Systemprompt', async ($, on) => {
  project(on, { dirty: false })
  on('prompt.compose', async () => ({ sections: [{ id: 'intro', text: 'x', scope: 'shared' as const }] }))
  const { sections } = await $.prompt.compose(COMPOSE)

  expect(sections.map(section => section.id)).toEqual(['intro', 'vibe:modus'])
})

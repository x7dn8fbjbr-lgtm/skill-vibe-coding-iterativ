#!/usr/bin/env node
// Vorschau-Screenshots einer laufenden Web-App in Desktop- und Handygröße.
//
//   node screenshot.mjs <url> [zielordner] [--nur=desktop|mobil] [--pfad=/unterseite]
//
// Playwright wird aus dem Projekt geladen (npm i -D playwright), in dem der Befehl läuft.
import { existsSync, mkdirSync } from 'node:fs'
import { createRequire } from 'node:module'
import { join, resolve } from 'node:path'

const args = process.argv.slice(2)
const flags = Object.fromEntries(
  args.filter(arg => arg.startsWith('--')).map(arg => arg.slice(2).split('=')),
)
const [url, outDir = '.vibe/screenshots'] = args.filter(arg => !arg.startsWith('--'))

if (!url) {
  console.error('Aufruf: node screenshot.mjs <url> [zielordner] [--nur=desktop|mobil] [--pfad=/seite]')
  process.exit(2)
}

const VIEWPORTS = {
  desktop: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 },
  mobil: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
}

function loadPlaywright() {
  const require = createRequire(join(process.cwd(), 'package.json'))
  for (const name of ['playwright', '@playwright/test', 'playwright-core']) {
    try {
      return require(name)
    } catch {}
  }
  console.error('Playwright fehlt im Projekt. Installieren mit: npm i -D playwright')
  process.exit(3)
}

async function launch(chromium) {
  try {
    return await chromium.launch()
  } catch (error) {
    // Vorinstallierter Browser (z. B. in Cloud-Sitzungen), falls die Paketversion nicht passt.
    for (const executablePath of ['/opt/pw-browsers/chromium']) {
      if (existsSync(executablePath)) return chromium.launch({ executablePath })
    }
    throw error
  }
}

const { chromium } = loadPlaywright()
const browser = await launch(chromium)
const target = new URL(flags.pfad ?? '', url).toString()
const names = flags.nur ? [flags.nur] : Object.keys(VIEWPORTS)
mkdirSync(resolve(outDir), { recursive: true })

const problems = []
for (const name of names) {
  const context = await browser.newContext(VIEWPORTS[name])
  const page = await context.newPage()
  page.on('pageerror', error => problems.push(`${name}: ${error.message}`))
  page.on('console', message => {
    if (message.type() === 'error') problems.push(`${name}: Konsole: ${message.text()}`)
  })

  const response = await page.goto(target, { waitUntil: 'networkidle', timeout: 30_000 }).catch(error => {
    problems.push(`${name}: Seite nicht erreichbar: ${error.message}`)
    return null
  })
  if (response && response.status() >= 400) problems.push(`${name}: HTTP ${response.status()}`)

  await page.waitForTimeout(400)
  const file = resolve(outDir, `${name}.png`)
  await page.screenshot({ path: file, fullPage: true })
  const hasSideScroll = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth + 1,
  )
  if (hasSideScroll) problems.push(`${name}: Seite scrollt seitlich (zu breit)`)
  console.log(file)
  await context.close()
}

await browser.close()
if (problems.length > 0) {
  console.log('\nAuffälligkeiten:')
  for (const problem of problems) console.log(`- ${problem}`)
}

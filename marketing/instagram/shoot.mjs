// Screenshots every .art block in social.html to <id>.png (node shoot.mjs from this folder or the marketing folder).
import puppeteer from 'puppeteer-core'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const dir = path.dirname(fileURLToPath(import.meta.url))
const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  args: ['--allow-file-access-from-files'],
})
const page = await browser.newPage()
await page.setViewport({ width: 1200, height: 2000, deviceScaleFactor: 1 })
await page.goto('file://' + path.join(dir, 'social.html'), { waitUntil: 'networkidle0' })
await page.evaluate(() => document.fonts.ready)
for (const el of await page.$$('.art')) {
  const id = await el.evaluate(e => e.id)
  await el.screenshot({ path: path.join(dir, `${id}.png`) })
  console.log(id)
}
await browser.close()

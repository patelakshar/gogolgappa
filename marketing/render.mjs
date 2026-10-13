// Renders <folder>/reel.html frame by frame with Chrome, then muxes voice + music with ffmpeg.
// The page sets window.DUR, FPS, OUT, BELLS and optionally VOICE ([[file in audio/, seconds], ...]).
//   node render.mjs reel                  -> reel/<OUT>
//   node render.mjs reel2 --stills 2,6,12 -> PNG stills for a quick check
import puppeteer from 'puppeteer-core'
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), process.argv[2] ?? 'reel')
const a = d => path.join(dir, 'audio', d)
// ponytail: brew's ffmpeg links an x265 that was upgraded away; point at the old copy until `brew upgrade ffmpeg`
const env = { ...process.env, DYLD_LIBRARY_PATH: '/opt/homebrew/Cellar/x265/4.2/lib' }
const run = (args, input) => new Promise((ok, fail) => {
  const p = spawn('ffmpeg', ['-loglevel', 'error', '-y', ...args], { env, stdio: [input ? 'pipe' : 'ignore', 'inherit', 'inherit'] })
  p.on('close', c => (c ? fail(new Error('ffmpeg exit ' + c)) : ok()))
  if (input) input(p.stdin)
})

const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  args: ['--allow-file-access-from-files'],
})
const page = await browser.newPage()
await page.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 1 })
await page.goto('file://' + path.join(dir, 'reel.html') + '?capture', { waitUntil: 'networkidle0' })
await page.evaluate(() => document.fonts.ready)
const { DUR, FPS, OUT, BELLS, VOICE } = await page.evaluate(() => ({ DUR, FPS, OUT, BELLS, VOICE: window.VOICE ?? [] }))

const stills = process.argv.indexOf('--stills')
if (stills > 0) {
  for (const t of process.argv[stills + 1].split(',').map(Number)) {
    await page.evaluate(t => window.render(t), t)
    await page.screenshot({ path: path.join(dir, `still-${t}.png`) })
  }
  await browser.close()
  process.exit(0)
}

const silent = path.join(dir, 'video.mp4')
await run(['-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-preset', 'medium', silent], async stdin => {
  for (let f = 0; f < DUR * FPS; f++) {
    await page.evaluate(t => window.render(t), f / FPS)
    const jpg = await page.screenshot({ type: 'jpeg', quality: 92 })
    if (!stdin.write(jpg)) await new Promise(r => stdin.once('drain', r))
    if (f % 60 === 0) process.stdout.write(`frame ${f}/${DUR * FPS}\n`)
  }
  stdin.end()
})
await browser.close()

const voice = VOICE
// Music bed: dhol-style thump + shaker on a 120bpm grid over a soft tanpura drone, plus a bell on each count.
const beat = 'mod(t,0.5)'
const music = `aevalsrc='0.55*sin(2*PI*70*t)*exp(-14*${beat})+0.10*(random(0)-0.5)*exp(-45*mod(t+0.25,0.5))+0.04*(sin(2*PI*130.81*t)+sin(2*PI*196*t)+0.5*sin(2*PI*261.6*t))*(0.8+0.2*sin(2*PI*0.5*t))':s=44100:d=${DUR}`
const bells = BELLS.map(t => `0.35*sin(2*PI*1318*(t-${t}))*exp(-6*(t-${t}))*gte(t,${t})`).join('+')
const inputs = voice.flatMap(([f]) => ['-i', a(f + '.wav')])
const delays = voice.map(([, t], i) => `[${i + 1}:a]adelay=${Math.round(t * 1000)}:all=1[v${i}];`).join('')
const mix = voice.map((_, i) => `[v${i}]`).join('')
const n = voice.length
await run([
  '-i', silent, ...inputs,
  '-f', 'lavfi', '-i', music,
  '-f', 'lavfi', '-i', `aevalsrc='${bells}':s=44100:d=${DUR}`,
  '-filter_complex',
  `[${n + 1}:a]volume=0.5,afade=t=out:st=${DUR - 1.5}:d=1.5[mu];[${n + 2}:a]volume=0.6[be];` + (n
    ? `${delays}${mix}amix=inputs=${n}:normalize=0,asplit=2[vo][vo2];` +
      `[mu][vo]sidechaincompress=threshold=0.05:ratio=6:release=300[duck];` +
      `[duck][vo2][be]amix=inputs=3:normalize=0,alimiter=limit=0.95[aout]`
    : `[mu][be]amix=inputs=2:normalize=0,alimiter=limit=0.95[aout]`),
  '-map', '0:v', '-map', '[aout]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart',
  path.join(dir, OUT),
])
console.log('done -> ' + OUT)

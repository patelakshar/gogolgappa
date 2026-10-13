// Puts the server-rendered page into dist/index.html so crawlers see the full menu without running JS.
// The browser still mounts the app fresh with createRoot (no hydration), so random/time-based bits can't mismatch.
import { readFileSync, writeFileSync, rmSync } from 'node:fs'
import { render } from '../dist-ssr/entry-server.js'

const file = 'dist/index.html'
const html = readFileSync(file, 'utf8')
if (!html.includes('<div id="root"></div>')) throw new Error('root div not found in dist/index.html')
writeFileSync(file, html.replace('<div id="root"></div>', `<div id="root">${render()}</div>`))
rmSync('dist-ssr', { recursive: true, force: true })
console.log('prerendered dist/index.html')

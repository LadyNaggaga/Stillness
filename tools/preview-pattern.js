#!/usr/bin/env node

// Renders Stillness patterns as 800×800 PNG screenshots using Puppeteer.
// Falls back to standalone HTML if Puppeteer is unavailable.
//
// Usage:
//   node tools/preview-pattern.js mandala
//   node tools/preview-pattern.js --all

import { spawn } from 'child_process';
import { mkdirSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname, extname, join } from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { readFile } from 'fs/promises';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const PREVIEW_DIR = resolve(__dirname, 'previews');
mkdirSync(PREVIEW_DIR, { recursive: true });

const PAT_NAMES = [
  'mandala', 'floral', 'geometric', 'zentangle', 'ocean',
  'elephant', 'butterfly', 'celestial', 'garden', 'mosaic',
  'kente', 'sashiko', 'paisley'
];

const MIME = {
  '.html': 'text/html', '.js': 'application/javascript',
  '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml',
  '.json': 'application/json', '.woff': 'font/woff', '.woff2': 'font/woff2',
  '.ico': 'image/x-icon', '.webp': 'image/webp',
};

// ── Parse arguments ──

const arg = process.argv[2];
if (!arg) usage();
const renderAll = arg === '--all';
if (!renderAll && !PAT_NAMES.includes(arg.toLowerCase())) {
  console.error(`Unknown pattern: ${arg}`);
  usage();
}

function usage() {
  console.error('Usage: node tools/preview-pattern.js <pattern-name|--all>');
  console.error('Patterns:', PAT_NAMES.join(', '));
  process.exit(1);
}

const indices = renderAll
  ? PAT_NAMES.map((_, i) => i)
  : [PAT_NAMES.indexOf(arg.toLowerCase())];

// ── Try Puppeteer, fall back to HTML ──

let puppeteer;
try {
  puppeteer = (await import('puppeteer')).default;
} catch {
  console.log('Puppeteer not available — generating standalone HTML previews.');
  console.log('Install with: npm install --save-dev puppeteer');
  console.log('Or use the SVG renderer: npm run render:svg -- <pattern>\n');
  for (const idx of indices) {
    const name = PAT_NAMES[idx];
    const html = buildFallbackHTML(name, idx);
    const outPath = resolve(PREVIEW_DIR, `${name}.html`);
    writeFileSync(outPath, html);
    console.log(outPath);
  }
  process.exit(0);
}

// ── Build if dist/ is missing ──

if (!existsSync(join(ROOT, 'dist', 'index.html'))) {
  console.log('Building app with Vite…');
  await exec('npx', ['vite', 'build'], ROOT);
}

// ── Serve dist/ at the base path configured in vite.config.js ──

const server = await serveStatic(join(ROOT, 'dist'), '/Stillness/');
const port = server.address().port;
const baseUrl = `http://localhost:${port}/Stillness/`;
console.log(`Serving dist at ${baseUrl}`);

// ── Render each pattern ──

const browser = await puppeteer.launch({ headless: 'new' });

try {
  for (const idx of indices) {
    const name = PAT_NAMES[idx];
    const page = await browser.newPage();
    await page.setViewport({ width: 860, height: 860 });

    // Suppress onboarding overlay before page scripts run
    await page.evaluateOnNewDocument(() => {
      localStorage.setItem('stillness-onboarded', '1');
    });
    await page.goto(baseUrl, { waitUntil: 'networkidle0', timeout: 30000 });

    // Wait for the UI to initialise and select the pattern
    await page.evaluate(i => {
      document.querySelectorAll('.pbtn')[i].click();
    }, idx);
    await delay(600);

    // Prepare a clean canvas view — hide all UI, white background
    await page.evaluate(() => {
      document.getElementById('toolbar').style.display = 'none';
      const sb = document.getElementById('sidebar');
      if (sb) sb.style.display = 'none';
      const ov = document.getElementById('sidebar-overlay');
      if (ov) ov.style.display = 'none';
      const toast = document.getElementById('toast');
      if (toast) toast.style.display = 'none';
      const wrap = document.getElementById('canvas-wrap');
      wrap.style.position = 'absolute';
      wrap.style.inset = '0';
      wrap.style.background = 'white';
      window.dispatchEvent(new Event('resize'));
    });
    await delay(200);

    // Zoom to fit after layout change
    await page.evaluate(() => {
      document.getElementById('zoom-fit').click();
    });
    await delay(300);

    // Screenshot the canvas element
    const canvas = await page.$('#canvas');
    const outPath = resolve(PREVIEW_DIR, `${name}.png`);
    await canvas.screenshot({ path: outPath });
    console.log(outPath);
    await page.close();
  }
} finally {
  await browser.close();
  server.close();
}

// ── Helpers ──

function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function exec(cmd, args, cwd) {
  return new Promise((ok, fail) => {
    const proc = spawn(cmd, args, { cwd, stdio: 'inherit' });
    proc.on('close', code =>
      code === 0 ? ok() : fail(new Error(`${cmd} exited with code ${code}`))
    );
  });
}

function serveStatic(dir, basePath) {
  basePath = basePath || '/';
  return new Promise(ok => {
    const srv = createServer(async (req, res) => {
      let urlPath = decodeURIComponent(req.url.split('?')[0]);
      // Strip the base path prefix so file lookup is relative to dir
      if (basePath !== '/' && urlPath.startsWith(basePath)) {
        urlPath = urlPath.slice(basePath.length) || '/';
      }
      let fp = join(dir, urlPath);
      if (fp.endsWith('/')) fp = join(fp, 'index.html');
      try {
        const data = await readFile(fp);
        const ct = MIME[extname(fp)] || 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': ct });
        res.end(data);
      } catch {
        res.writeHead(404);
        res.end();
      }
    });
    srv.listen(0, () => ok(srv));
  });
}

function buildFallbackHTML(name, idx) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Preview: ${name}</title>
  <style>
    body { font-family: system-ui, sans-serif; display: flex;
           flex-direction: column; align-items: center;
           justify-content: center; height: 100vh; margin: 0;
           background: #f5f5f5; color: #333; }
    code { background: #e0e0e0; padding: 2px 6px; border-radius: 3px; }
  </style>
</head>
<body>
  <h2>Pattern Preview: ${name}</h2>
  <p>Puppeteer is not installed, so a live screenshot could not be taken.</p>
  <p>To preview this pattern:</p>
  <ol>
    <li>Run <code>npm run dev</code> and open the app in a browser</li>
    <li>Select pattern <strong>#${idx + 1} — ${name}</strong></li>
  </ol>
  <p>Or generate an SVG: <code>npm run render:svg -- ${name}</code></p>
</body>
</html>`;
}

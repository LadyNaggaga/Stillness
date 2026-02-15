#!/usr/bin/env node

// Renders a Stillness pattern as SVG using Paper.js in Node.js.
// Usage: node tools/render-svg.js <pattern-name>

import { mkdirSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PREVIEW_DIR = resolve(__dirname, 'previews');
mkdirSync(PREVIEW_DIR, { recursive: true });

// Provide a minimal canvas 2D context stub so Paper.js can initialise
// its BlendMode detection without a real canvas implementation.
import { JSDOM } from 'jsdom';
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
const origCreateElement = dom.window.document.createElement.bind(dom.window.document);
dom.window.document.createElement = function (tag) {
  const el = origCreateElement(tag);
  if (tag.toLowerCase() === 'canvas') {
    el.getContext = function () {
      return {
        save() {}, restore() {}, clearRect() {},
        fillRect() {}, getImageData() { return { data: [0, 0, 0, 0] }; },
        fillStyle: '', globalCompositeOperation: '',
        setTransform() {}, drawImage() {}, createPattern() { return {}; },
        createLinearGradient() { return { addColorStop() {} }; },
        createRadialGradient() { return { addColorStop() {} }; },
        beginPath() {}, closePath() {}, moveTo() {}, lineTo() {},
        bezierCurveTo() {}, quadraticCurveTo() {}, arc() {},
        fill() {}, stroke() {}, clip() {}, rect() {},
        measureText() { return { width: 0 }; },
        translate() {}, rotate() {}, scale() {},
        transform() {},
        canvas: el,
      };
    };
  }
  return el;
};

// Inject globals so paper-full.js thinks it is in a browser
Object.defineProperty(global, 'window', { value: dom.window, configurable: true });
Object.defineProperty(global, 'document', { value: dom.window.document, configurable: true });
Object.defineProperty(global, 'navigator', { value: dom.window.navigator, configurable: true });
Object.defineProperty(global, 'self', { value: dom.window, configurable: true });
Object.defineProperty(global, 'HTMLCanvasElement', { value: dom.window.HTMLCanvasElement, configurable: true });

// Now import paper — the shared instance used by generators
const { default: paper } = await import('paper');
new paper.Project();

const { generators, PAT_NAMES } = await import('../src/patterns/index.js');

const nameMap = new Map(PAT_NAMES.map((n, i) => [n.toLowerCase(), i]));

const arg = process.argv[2];
if (!arg) {
  console.error('Usage: node tools/render-svg.js <pattern-name>');
  console.error('Patterns:', PAT_NAMES.map(n => n.toLowerCase()).join(', '));
  process.exit(1);
}

const idx = nameMap.get(arg.toLowerCase());
if (idx === undefined) {
  console.error(`Unknown pattern: ${arg}`);
  console.error('Patterns:', PAT_NAMES.map(n => n.toLowerCase()).join(', '));
  process.exit(1);
}

// Generate the pattern into the active project
generators[idx]();

// Add white background behind everything
const bg = new paper.Path.Rectangle(new paper.Rectangle(0, 0, 800, 800));
bg.fillColor = 'white';
bg.sendToBack();

// Export SVG with explicit 800×800 bounds
const svg = paper.project.exportSVG({
  asString: true,
  bounds: new paper.Rectangle(0, 0, 800, 800),
});
const outPath = resolve(PREVIEW_DIR, `${arg.toLowerCase()}.svg`);
writeFileSync(outPath, svg);
console.log(outPath);

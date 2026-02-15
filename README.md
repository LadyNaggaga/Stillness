# Stillness 🌿 <sub>v2</sub>

**Breathe. Click. Color. Let the world dissolve.**

Stillness is a browser-based coloring book designed for the moments when your mind needs a quiet place to land. No accounts. No ads. No noise — just you, a canvas of intricate patterns, and colors that feel like a deep exhale.

Choose from ten hand-crafted patterns — mandalas, flowing florals, ocean dreamscapes, celestial skies, and more. Fill regions with a single click, paint freehand with a soft brush, or layer gentle gradients — all accompanied by ambient chimes, birdsong, or the hush of distant waves. Save your finished artworks to a personal gallery, share them with a link, or simply let the colors carry you somewhere quieter.

Built for stillness. Open it when the day feels loud.

> **[✦ Enter Stillness →](https://LadyNaggaga.github.io/Stillness/)**

<img width="1145" height="667" alt="image" src="https://github.com/user-attachments/assets/4eb2074a-fea4-46c8-9665-94f887206ab2" />

![HTML5](https://img.shields.io/badge/HTML5-Canvas-orange)
![JavaScript](https://img.shields.io/badge/JavaScript-ES%20Modules-yellow)
![Paper.js](https://img.shields.io/badge/Paper.js-Vector%20Engine-blue)
![Vite](https://img.shields.io/badge/Vite-Build%20Tool-purple)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Features

### 🖌️ Tools
| Tool | Shortcut | Description |
|------|----------|-------------|
| **Fill** | `F` | Click any region to flood-fill with the selected color |
| **Brush** | `B` | Freehand drawing with adjustable size and opacity |
| **Gradient** | `G` | Click-drag to apply linear or radial gradient fills |
| **Eraser** | `E` | Reset filled regions or remove brush strokes |
| **Eyedropper** | `I` | Sample any color from the canvas |

### 🧩 10 Coloring Patterns
- **Mandala** — 12-fold symmetry with 200+ fillable regions across 6 concentric rings
- **Floral** — Central flower, corner bouquets, butterflies, and decorative leaves
- **Geometric** — Hexagonal tessellation with nested stars and circles
- **Zentangle** — 4×4 grid with 8 unique tile patterns (spirals, scales, waves, diamonds)
- **Ocean** — Layered waves, tropical fish, shells, starfish, and coral
- **Elephant** — Zentangle-style portrait with mandala forehead and decorative tusks
- **Butterfly** — Detailed wing patterns with intricate vein work and symmetry
- **Celestial** — Stars, moons, constellations, and swirling cosmic motifs
- **Garden** — Winding paths, flower beds, trellises, and garden creatures
- **Mosaic** — Interlocking tile fragments inspired by stained glass and Roman mosaics

### 🌸 Seasonal Color Themes
Switch the palette to match the mood of the season:
- **Default** — The original 25-color curated palette (muted, calming tones)
- **Spring Bloom** — Soft pinks, fresh greens, and lavender
- **Autumn Warmth** — Rich ambers, burnt orange, and deep reds
- **Winter Frost** — Cool blues, silver, and icy whites

### ✨ Fill Animations
Subtle particle effects bloom outward when you fill a region — tiny motes of color that drift and fade, making each click feel alive.

### 🔍 Zoom & Pan
- **Mouse wheel** — Zoom toward cursor
- **Space + drag** — Pan across the canvas
- **Pinch to zoom** — Touch-friendly on mobile and tablet
- **Keyboard**: `+` zoom in, `-` zoom out, `0` fit to screen

### 🎨 Color System
- 25-color curated palette (muted, calming tones)
- HSL sliders for fine-tuning custom shades
- Dual gradient color selector

### 🔊 Ambient Fill Sounds
- **Chimes** — Pentatonic wind-chime arpeggio
- **Wind** — Filtered white noise swell
- **Birds** — Synthesized chirp sequence
- **Ocean** — Low-pass wave wash

### 🖼️ My Gallery
Save your colored artworks to a personal gallery stored in your browser. Browse, revisit, and continue coloring any saved piece — your quiet collection grows over time.

### 🔗 Share
- **Image sharing** — Export and share via the Web Share API on supported devices
- **Shareable URL** — Generate a compact link (powered by LZ-String compression) that encodes your artwork so anyone can open and view it

### 📱 Mobile & Touch Support
- Responsive sidebar that collapses for small screens
- Tap to fill, pinch to zoom, swipe to pan
- Touch-optimized controls throughout

### ♿ Accessibility
- ARIA labels on all interactive elements
- Full keyboard navigation
- `prefers-reduced-motion` support — animations gracefully step aside

### 🎓 Onboarding
A gentle guided tutorial welcomes first-time visitors, introducing tools, patterns, and the art of doing nothing in particular.

### 💾 Save & Export
- **PNG** — Rasterized export at 800×800
- **SVG** — Lossless vector export (editable in Illustrator/Inkscape)
- **Save/Load Progress** — Persist your work to localStorage and resume later

---

## 🚀 Getting Started

```bash
git clone https://github.com/LadyNaggaga/Stillness.git
cd Stillness
npm install
```

### Option 1: Development server
```bash
npm run dev
```
Opens a hot-reloading dev server — perfect for exploring or making changes.

### Option 2: Production build
```bash
npm run build && npm run preview
```
Builds optimized static files into `dist/` and serves them locally.

### Option 3: GitHub Pages
The site auto-deploys via **GitHub Actions** on every push to `main`. Just merge and it's live.

---

## 🏗️ Architecture

Modular ES-module app built with **Vite** — each concern lives in its own file.

```
src/
├── main.js           # Entry point & app initialization
├── canvas.js         # Paper.js canvas setup, zoom/pan
├── tools.js          # Fill, brush, gradient, eraser, eyedropper
├── ui.js             # Sidebar, toolbar, theme & palette controls
├── audio.js          # Web Audio API ambient sounds
├── state.js          # App state, gallery, sharing (LZ-String)
├── export.js         # PNG / SVG export
├── undo.js           # Command-pattern undo/redo
├── onboarding.js     # First-visit guided tutorial
├── patterns/
│   ├── index.js      # Pattern registry
│   ├── helpers.js    # Shared geometry utilities
│   ├── mandala.js
│   ├── floral.js
│   ├── geometric.js
│   ├── zentangle.js
│   ├── ocean.js
│   ├── elephant.js
│   ├── butterfly.js
│   ├── celestial.js
│   ├── garden.js
│   └── mosaic.js
└── styles/
    ├── main.css      # Core layout & dark-mode theme
    ├── sidebar.css   # Sidebar & palette styles
    ├── toolbar.css   # Toolbar controls
    ├── mobile.css    # Responsive / touch overrides
    └── onboarding.css
```

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Build | [Vite](https://vitejs.dev/) | Fast dev server, ES-module bundling, production builds |
| Rendering | [Paper.js](http://paperjs.org/) | Vector canvas, hit-testing, zoom/pan, SVG export |
| Audio | Web Audio API | Synthesized ambient sounds (no audio files needed) |
| Sharing | [LZ-String](https://github.com/pieroxy/lz-string) | URL-safe compression for shareable artwork links |
| UI | Vanilla CSS + JS | Dark-mode interface, responsive layout |
| Fonts | [Inter](https://fonts.google.com/specimen/Inter) (Google Fonts) | Clean, modern typography |

### How Patterns Work
Each pattern is a generator function that creates **Paper.js closed paths** — every enclosed region is an individually clickable and fillable item. The fill tool uses Paper.js `hitTest()` for precise vector hit-testing (no pixel scanning), which means fills are instant and crisp at any zoom level.

### Undo System
Uses a **command pattern** — each fill/brush operation is recorded as a reversible command object, enabling efficient undo/redo without storing full canvas snapshots.

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `F` | Fill tool |
| `B` | Brush tool |
| `G` | Gradient tool |
| `E` | Eraser tool |
| `I` | Eyedropper |
| `Space` + drag | Pan |
| `+` / `-` | Zoom in / out |
| `0` | Fit to screen |
| `Ctrl+Z` | Undo |
| `Ctrl+Shift+Z` | Redo |

---

## 📄 License

MIT — free for personal and commercial use.

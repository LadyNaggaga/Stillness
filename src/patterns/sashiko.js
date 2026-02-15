import paper from 'paper';
import { SZ } from '../state.js';
import { sty } from './helpers.js';

// Inspired by Japanese Sashiko embroidery — decorative running-stitch patterns
// traditionally sewn with white thread on indigo cloth. Features geometric motifs
// like asanoha (hemp leaf), seigaiha (waves), and shippo (seven treasures).

export function genSashiko() {
  sty(new paper.Path.Rectangle([0, 0], [SZ, SZ]));

  const margin = 15;
  const grid = 3;
  const cellW = (SZ - margin * 2) / grid;
  const cellH = cellW;
  const gap = 4;

  // Panel border
  for (let r = 0; r < grid; r++) {
    for (let c = 0; c < grid; c++) {
      const x = margin + c * cellW, y = margin + r * cellH;
      sty(new paper.Path.Rectangle([x, y], [cellW, cellH]));
    }
  }

  // === Asanoha (hemp leaf) — top-left ===
  function asanoha(ox, oy, w, h) {
    const sz = w / 4;
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const cx = ox + c * sz + sz / 2, cy = oy + r * sz + sz / 2;
        const hr = sz * 0.42;
        // 6-pointed star from 6 triangles
        for (let i = 0; i < 6; i++) {
          const a1 = (i * 60) * Math.PI / 180;
          const a2 = ((i + 1) * 60) * Math.PI / 180;
          sty(new paper.Path({
            segments: [
              [cx, cy],
              [cx + hr * Math.cos(a1), cy + hr * Math.sin(a1)],
              [cx + hr * Math.cos(a2), cy + hr * Math.sin(a2)]
            ],
            closed: true
          }));
        }
      }
    }
  }

  // === Seigaiha (ocean waves) — top-center ===
  function seigaiha(ox, oy, w, h) {
    const cols = 8, rows = 11;
    const r = w / (cols * 2);
    const rowSpacing = h / (rows - 1);
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col <= cols; col++) {
        const cx = ox + col * r * 2 - r + (row % 2 ? r : 0);
        const cy = oy + row * rowSpacing;
        if (cx < ox - r * 0.5 || cx > ox + w + r * 0.5) continue;
        for (let ring = 2; ring >= 0; ring--) {
          const rr = r * (0.25 + ring * 0.2);
          const arc = new paper.Path.Arc(
            new paper.Point(cx - rr, cy),
            new paper.Point(cx, cy - rr),
            new paper.Point(cx + rr, cy)
          );
          arc.lineTo(new paper.Point(cx - rr, cy));
          arc.closed = true;
          sty(arc);
        }
      }
    }
  }

  // === Shippo (seven treasures / interlocking circles) — top-right ===
  function shippo(ox, oy, w, h) {
    const n = 5, sp = w / n;
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        const cx = ox + c * sp + sp / 2, cy = oy + r * sp + sp / 2;
        // Create petal shapes at intersections
        const pr = sp * 0.45;
        if (c < n - 1 && r < n - 1) {
          const ix = cx + sp / 2, iy = cy + sp / 2;
          // Vesica piscis shapes
          const e = new paper.Path.Ellipse({
            center: [ix, iy],
            size: [sp * 0.5, sp * 0.8]
          });
          sty(e);
          const e2 = new paper.Path.Ellipse({
            center: [ix, iy],
            size: [sp * 0.8, sp * 0.5]
          });
          sty(e2);
        }
        sty(new paper.Path.Circle([cx, cy], sp * 0.15));
      }
    }
  }

  // === Yabane (arrow feathers) — middle-left ===
  function yabane(ox, oy, w, h) {
    const rows = 6, rh = h / rows;
    for (let r = 0; r < rows; r++) {
      const y = oy + r * rh;
      const cols = 4, cw = w / cols;
      for (let c = 0; c < cols; c++) {
        const x = ox + c * cw;
        const flip = (r + c) % 2 === 0;
        if (flip) {
          // Right-pointing arrow
          sty(new paper.Path({
            segments: [[x, y], [x + cw, y + rh / 2], [x, y + rh]],
            closed: true
          }));
          sty(new paper.Path({
            segments: [[x + cw, y], [x + cw, y + rh], [x, y + rh / 2]],
            closed: true
          }));
        } else {
          // Left-pointing arrow
          sty(new paper.Path({
            segments: [[x + cw, y], [x, y + rh / 2], [x + cw, y + rh]],
            closed: true
          }));
          sty(new paper.Path({
            segments: [[x, y], [x, y + rh], [x + cw, y + rh / 2]],
            closed: true
          }));
        }
      }
    }
  }

  // === Large center asanoha star — center ===
  function centerStar(ox, oy, w, h) {
    const cx = ox + w / 2, cy = oy + h / 2;
    // Center circle
    sty(new paper.Path.Circle([cx, cy], w * 0.06));
    // 5 concentric rings of 12 wedges each, expanding outward
    for (let ring = 0; ring < 5; ring++) {
      const r1 = w * 0.06 + ring * w * 0.075;
      const r2 = r1 + w * 0.07;
      for (let i = 0; i < 12; i++) {
        const a1 = (i * 30) * Math.PI / 180;
        const a2 = ((i + 1) * 30) * Math.PI / 180;
        const am = ((i + 0.5) * 30) * Math.PI / 180;
        sty(new paper.Path({
          segments: [
            [cx + r1 * Math.cos(a1), cy + r1 * Math.sin(a1)],
            [cx + r2 * Math.cos(am), cy + r2 * Math.sin(am)],
            [cx + r1 * Math.cos(a2), cy + r1 * Math.sin(a2)]
          ],
          closed: true
        }));
      }
    }
    // Corner 6-petal flowers
    const m = w * 0.13;
    const corners = [
      [ox + m, oy + m], [ox + w - m, oy + m],
      [ox + m, oy + h - m], [ox + w - m, oy + h - m]
    ];
    corners.forEach(function (co) {
      for (let i = 0; i < 6; i++) {
        const a1 = (i * 60) * Math.PI / 180;
        const a2 = ((i + 1) * 60) * Math.PI / 180;
        const sr = w * 0.07;
        sty(new paper.Path({
          segments: [
            [co[0], co[1]],
            [co[0] + sr * Math.cos(a1), co[1] + sr * Math.sin(a1)],
            [co[0] + sr * Math.cos(a2), co[1] + sr * Math.sin(a2)]
          ],
          closed: true
        }));
      }
      sty(new paper.Path.Circle(co, w * 0.025));
    });
    // Edge midpoint diamonds
    const edgePts = [
      [cx, oy + m], [cx, oy + h - m],
      [ox + m, cy], [ox + w - m, cy]
    ];
    edgePts.forEach(function (ep) {
      const ds = w * 0.055;
      sty(new paper.Path({
        segments: [[ep[0], ep[1] - ds], [ep[0] + ds, ep[1]], [ep[0], ep[1] + ds], [ep[0] - ds, ep[1]]],
        closed: true
      }));
    });
  }

  // === Nowaki (swaying grass/reeds) — middle-right ===
  function nowaki(ox, oy, w, h) {
    const stems = 8;
    const sw = w / stems;
    for (let s = 0; s < stems; s++) {
      const baseX = ox + s * sw + sw / 2;
      const baseY = oy + h;
      const lean = (s % 2 === 0 ? 1 : -1);
      // Stem as a thin tall ellipse
      const stemPath = new paper.Path.Ellipse({
        center: [baseX + lean * 4, oy + h * 0.5],
        size: [4, h * 0.85]
      });
      stemPath.rotate(lean * 6, [baseX, baseY]);
      sty(stemPath);
      // 3-4 leaves per stem, alternating sides
      const leafCount = 3 + (s % 2);
      for (let l = 0; l < leafCount; l++) {
        const ly = oy + h * 0.15 + l * (h * 0.65 / leafCount);
        const lx = baseX + lean * (4 + l * 2);
        const side = (l % 2 === 0) ? 1 : -1;
        const leafPath = new paper.Path.Ellipse({
          center: [lx + side * sw * 0.22, ly],
          size: [sw * 0.38, 10]
        });
        leafPath.rotate(side * lean * 25 + lean * 8, [lx, ly]);
        sty(leafPath);
      }
      // Seed head at top
      sty(new paper.Path.Ellipse({
        center: [baseX + lean * 6, oy + h * 0.06],
        size: [8, 14]
      }));
    }
  }

  // === Igeta (well frame / hash grid) — bottom-left ===
  function igeta(ox, oy, w, h) {
    const n = 4, sp = w / n;
    // Grid of # shapes
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        const cx = ox + c * sp + sp / 2, cy = oy + r * sp + sp / 2;
        const s = sp * 0.35;
        // Center square
        sty(new paper.Path.Rectangle([cx - s / 3, cy - s / 3], [s * 0.66, s * 0.66]));
        // 4 arms
        sty(new paper.Path.Rectangle([cx - s, cy - s / 6], [s * 0.6, s / 3]));
        sty(new paper.Path.Rectangle([cx + s * 0.4, cy - s / 6], [s * 0.6, s / 3]));
        sty(new paper.Path.Rectangle([cx - s / 6, cy - s], [s / 3, s * 0.6]));
        sty(new paper.Path.Rectangle([cx - s / 6, cy + s * 0.4], [s / 3, s * 0.6]));
      }
    }
  }

  // === Uroko (scales / triangles) — bottom-center ===
  function uroko(ox, oy, w, h) {
    const cols = 6, rows = 6;
    const tw = w / cols, th = h / rows;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = ox + c * tw, y = oy + r * th;
        // Two triangles per cell
        sty(new paper.Path({
          segments: [[x, y], [x + tw, y], [x + tw / 2, y + th]],
          closed: true
        }));
        sty(new paper.Path({
          segments: [[x, y + th], [x + tw, y + th], [x + tw / 2, y]],
          closed: true
        }));
      }
    }
  }

  // === Bishamon kikko (tortoiseshell hexagons) — bottom-right ===
  function bishamon(ox, oy, w, h) {
    const cols = 5, rows = 5;
    const sz = w / (cols * 1.5 + 0.5);
    const hh = sz * Math.sqrt(3) / 2;
    for (let r = -1; r <= rows; r++) {
      for (let c = -1; c <= cols; c++) {
        const cx = ox + c * sz * 1.5 + sz * 0.75;
        const cy = oy + r * hh * 2 + (c % 2 === 0 ? 0 : hh) + hh;
        if (cx >= ox + sz * 0.5 && cx <= ox + w - sz * 0.5 &&
            cy >= oy + sz * 0.5 && cy <= oy + h - sz * 0.5) {
          sty(new paper.Path.RegularPolygon([cx, cy], 6, sz * 0.52));
          sty(new paper.Path.RegularPolygon([cx, cy], 6, sz * 0.3));
          sty(new paper.Path.Circle([cx, cy], sz * 0.12));
        }
      }
    }
  }

  // Assign patterns to grid panels
  const panels = [
    asanoha, seigaiha, shippo,
    yabane, centerStar, nowaki,
    igeta, uroko, bishamon
  ];

  const pad = gap + 2;
  for (let r = 0; r < grid; r++) {
    for (let c = 0; c < grid; c++) {
      const x = margin + c * cellW + pad;
      const y = margin + r * cellH + pad;
      const w = cellW - pad * 2;
      const h = cellH - pad * 2;
      panels[r * grid + c](x, y, w, h);
    }
  }
}

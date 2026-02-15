import paper from 'paper';
import { SZ } from '../state.js';
import { sty } from './helpers.js';

// Inspired by West African Kente cloth — bold geometric strips with
// interlocking rectangular blocks, zigzags, chevrons, and diamond motifs
// arranged in horizontal bands. Originates from Ashanti/Ewe traditions in Ghana.

export function genKente() {
  sty(new paper.Path.Rectangle([0, 0], [SZ, SZ]));

  const margin = 20;
  const inner = SZ - margin * 2;
  // 7 major bands with thin separators
  const bands = 7;
  const sepH = 6;
  const bandH = (inner - (bands - 1) * sepH) / bands;

  // Fill functions for blocks within bands
  function checkerboard(x, y, w, h, cols, rows) {
    const cw = w / cols, ch = h / rows;
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++)
        sty(new paper.Path.Rectangle([x + c * cw, y + r * ch], [cw, ch]));
  }

  function zigzag(x, y, w, h) {
    const steps = 4, sw = w / steps, sh = h;
    for (let i = 0; i < steps; i++) {
      const lx = x + i * sw;
      // Upper triangle
      sty(new paper.Path({
        segments: [[lx, y + sh], [lx + sw / 2, y], [lx + sw, y + sh]],
        closed: true
      }));
      // Lower triangle (inverted, fills gap)
      if (i < steps - 1) {
        sty(new paper.Path({
          segments: [[lx + sw / 2, y], [lx + sw, y + sh], [lx + sw * 1.5, y]],
          closed: true
        }));
      }
    }
  }

  function diamonds(x, y, w, h, cols, rows) {
    const dw = w / cols, dh = h / rows;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cx = x + c * dw + dw / 2, cy = y + r * dh + dh / 2;
        const hw = dw * 0.45, hh = dh * 0.45;
        sty(new paper.Path({
          segments: [[cx, cy - hh], [cx + hw, cy], [cx, cy + hh], [cx - hw, cy]],
          closed: true
        }));
      }
    }
  }

  function stripes(x, y, w, h, count) {
    const sw = w / count;
    for (let i = 0; i < count; i++)
      sty(new paper.Path.Rectangle([x + i * sw, y], [sw, h]));
  }

  function nestedRects(x, y, w, h) {
    const cx = x + w / 2, cy = y + h / 2;
    for (let i = 0; i < 3; i++) {
      const inset = i * Math.min(w, h) * 0.12;
      const rw = w - inset * 2, rh = h - inset * 2;
      if (rw > 4 && rh > 4)
        sty(new paper.Path.Rectangle([cx - rw / 2, cy - rh / 2], [rw, rh]));
    }
  }

  function chevrons(x, y, w, h) {
    const rows = 3, rh = h / rows;
    for (let r = 0; r < rows; r++) {
      const ry = y + r * rh;
      // Left half
      sty(new paper.Path({
        segments: [[x, ry + rh], [x, ry], [x + w / 2, ry + rh * 0.5]],
        closed: true
      }));
      // Right half
      sty(new paper.Path({
        segments: [[x + w, ry + rh], [x + w, ry], [x + w / 2, ry + rh * 0.5]],
        closed: true
      }));
    }
  }

  function crosshatch(x, y, w, h, n) {
    const cw = w / n, ch = h / n;
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        const bx = x + c * cw, by = y + r * ch;
        if ((r + c) % 2 === 0) {
          sty(new paper.Path.Rectangle([bx, by], [cw, ch]));
        } else {
          // Diamond inside cell
          sty(new paper.Path({
            segments: [
              [bx + cw / 2, by], [bx + cw, by + ch / 2],
              [bx + cw / 2, by + ch], [bx, by + ch / 2]
            ],
            closed: true
          }));
        }
      }
    }
  }

  // Band fill patterns — each band has 4-6 blocks with different fills
  const bandFills = [
    [checkerboard, 5, 3],
    [zigzag],
    [diamonds, 4, 2],
    [stripes, 8],
    [chevrons],
    [crosshatch, 4],
    [nestedRects],
  ];

  for (let b = 0; b < bands; b++) {
    const by = margin + b * (bandH + sepH);

    // Thin separator strip (except before first band)
    if (b > 0) {
      const sy = by - sepH;
      for (let i = 0; i < 16; i++)
        sty(new paper.Path.Rectangle([margin + i * (inner / 16), sy], [inner / 16, sepH]));
    }

    // Divide band into 4-6 blocks
    const nBlocks = 4 + (b % 3);
    const bw = inner / nBlocks;

    for (let bl = 0; bl < nBlocks; bl++) {
      const bx = margin + bl * bw;
      // Background for block
      sty(new paper.Path.Rectangle([bx, by], [bw, bandH]));

      // Cycle through fill patterns
      const fillIdx = (b * 3 + bl) % bandFills.length;
      const [fn, ...args] = bandFills[fillIdx];
      const pad = 3;

      if (fn === checkerboard) {
        checkerboard(bx + pad, by + pad, bw - pad * 2, bandH - pad * 2, args[0] || 4, args[1] || 3);
      } else if (fn === zigzag) {
        zigzag(bx + pad, by + pad, bw - pad * 2, bandH - pad * 2);
      } else if (fn === diamonds) {
        diamonds(bx + pad, by + pad, bw - pad * 2, bandH - pad * 2, args[0] || 3, args[1] || 2);
      } else if (fn === stripes) {
        stripes(bx + pad, by + pad, bw - pad * 2, bandH - pad * 2, args[0] || 6);
      } else if (fn === chevrons) {
        chevrons(bx + pad, by + pad, bw - pad * 2, bandH - pad * 2);
      } else if (fn === crosshatch) {
        crosshatch(bx + pad, by + pad, bw - pad * 2, bandH - pad * 2, args[0] || 4);
      } else if (fn === nestedRects) {
        nestedRects(bx + pad, by + pad, bw - pad * 2, bandH - pad * 2);
      }
    }
  }

  // Outer border frame
  for (let i = 0; i < 4; i++) {
    const inset = i * 5;
    const r = new paper.Path.Rectangle([margin - 15 + inset, margin - 15 + inset],
      [inner + 30 - inset * 2, inner + 30 - inset * 2]);
    r.strokeColor = SK;
    r.strokeWidth = SW;
    if (i === 0) { r.fillColor = 'white'; r.data.fillable = true; }
  }
}

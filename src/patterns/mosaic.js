import paper from 'paper';
import { SZ } from '../state.js';
import { sty } from './helpers.js';

export function genMosaic() {
  const T = 120, cols = 7, rows = 7;
  const ox = (SZ - (cols - 1) * T) / 2;
  const oy = (SZ - (rows - 1) * T) / 2;
  const oR = 46, iR = 20, cR = 8, crossR = 14, dh = 16, bdr = 10;
  const gap = T / 2 - oR;

  sty(new paper.Path.Rectangle([0, 0], [SZ, SZ]));

  // 8-pointed stars with center circles
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cx = ox + c * T, cy = oy + r * T;
      sty(new paper.Path.Star([cx, cy], 8, iR, oR));
      sty(new paper.Path.Circle([cx, cy], cR));
    }
  }

  // Horizontal diamond connectors
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols - 1; c++) {
      const mx = ox + c * T + T / 2, my = oy + r * T;
      sty(new paper.Path({
        segments: [[mx - gap, my], [mx, my - dh], [mx + gap, my], [mx, my + dh]],
        closed: true
      }));
    }
  }

  // Vertical diamond connectors
  for (let r = 0; r < rows - 1; r++) {
    for (let c = 0; c < cols; c++) {
      const mx = ox + c * T, my = oy + r * T + T / 2;
      sty(new paper.Path({
        segments: [[mx, my - gap], [mx - dh, my], [mx, my + gap], [mx + dh, my]],
        closed: true
      }));
    }
  }

  // Diamond motifs at centers of 4-star groups
  for (let r = 0; r < rows - 1; r++) {
    for (let c = 0; c < cols - 1; c++) {
      const mx = ox + c * T + T / 2, my = oy + r * T + T / 2;
      sty(new paper.Path.RegularPolygon([mx, my], 4, crossR));
      sty(new paper.Path.Circle([mx, my], 5));
    }
  }

  // Border diamonds
  const step = T / 2;
  for (let x = ox; x <= ox + (cols - 1) * T; x += step) {
    sty(new paper.Path.RegularPolygon([x, oy / 2], 4, bdr));
    sty(new paper.Path.RegularPolygon([x, SZ - oy / 2], 4, bdr));
  }
  for (let y = oy; y <= oy + (rows - 1) * T; y += step) {
    sty(new paper.Path.RegularPolygon([ox / 2, y], 4, bdr));
    sty(new paper.Path.RegularPolygon([SZ - ox / 2, y], 4, bdr));
  }
  for (const pos of [[ox/2,oy/2],[SZ-ox/2,oy/2],[ox/2,SZ-oy/2],[SZ-ox/2,SZ-oy/2]]) {
    sty(new paper.Path.RegularPolygon(pos, 4, bdr));
  }
}

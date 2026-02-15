import paper from 'paper';
import { SZ } from '../state.js';
import { sty, ringSegment, makePetal, makeDiamond, makeTeardrop } from './helpers.js';

export function genMandala() {
  const cx = SZ / 2, cy = SZ / 2, N = 12, da = 360 / N;
  sty(new paper.Path.Circle([cx, cy], 380));
  // Border ring
  for (let i = 0; i < N * 2; i++) ringSegment(cx, cy, 345, 378, i * da / 2, (i + 1) * da / 2);
  // Ring 5: teardrops + dots
  for (let i = 0; i < N; i++) ringSegment(cx, cy, 275, 345, i * da, (i + 1) * da);
  for (let i = 0; i < N; i++) makeTeardrop(cx, cy, 280, i * da + da / 2, 24, 52);
  for (let i = 0; i < N; i++) { const a = i * da * Math.PI / 180; sty(new paper.Path.Circle([cx + 310 * Math.cos(a), cy + 310 * Math.sin(a)], 9)); }
  // Ring 4: large diamonds
  for (let i = 0; i < N; i++) ringSegment(cx, cy, 195, 275, i * da, (i + 1) * da);
  for (let i = 0; i < N; i++) makeDiamond(cx, cy, 200, i * da, 20, 68);
  for (let i = 0; i < N; i++) makeDiamond(cx, cy, 215, i * da + da / 2, 12, 38);
  // Ring 3: large petals
  for (let i = 0; i < N; i++) ringSegment(cx, cy, 125, 195, i * da, (i + 1) * da);
  for (let i = 0; i < N; i++) makePetal(cx, cy, 130, i * da + da / 2, 17, 58);
  // Ring 2: small petals + dots
  for (let i = 0; i < N; i++) ringSegment(cx, cy, 58, 125, i * da, (i + 1) * da);
  for (let i = 0; i < N; i++) makePetal(cx, cy, 62, i * da, 11, 52);
  for (let i = 0; i < N; i++) { const a = (i * da + da / 2) * Math.PI / 180; sty(new paper.Path.Circle([cx + 88 * Math.cos(a), cy + 88 * Math.sin(a)], 6)); }
  // Center
  for (let i = 0; i < N; i++) ringSegment(cx, cy, 28, 58, i * da, (i + 1) * da);
  sty(new paper.Path.Circle([cx, cy], 28));
  sty(new paper.Path.Circle([cx, cy], 12));
}

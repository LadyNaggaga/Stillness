import paper from 'paper';
import { SK, SW } from '../state.js';

export function sty(p) {
  p.fillColor = 'white';
  p.strokeColor = SK;
  p.strokeWidth = SW;
  p.data.fillable = true;
  return p;
}

export function ringSegment(cx, cy, r1, r2, a1, a2) {
  const R = Math.PI / 180;
  const p = new paper.Path();
  const n = Math.max(8, Math.ceil(Math.abs(a2 - a1) / 3));
  for (let i = 0; i <= n; i++) {
    const a = (a1 + (a2 - a1) * i / n) * R;
    p.add([cx + r2 * Math.cos(a), cy + r2 * Math.sin(a)]);
  }
  for (let i = n; i >= 0; i--) {
    const a = (a1 + (a2 - a1) * i / n) * R;
    p.add([cx + r1 * Math.cos(a), cy + r1 * Math.sin(a)]);
  }
  p.closed = true;
  return sty(p);
}

export function makePetal(cx, cy, r, ang, hw, len) {
  const R = Math.PI / 180, a = ang * R, c = Math.cos(a), s = Math.sin(a), nx = -s, ny = c;
  const p = new paper.Path({
    segments: [
      [cx + r * c, cy + r * s],
      [cx + (r + len * .45) * c + nx * hw, cy + (r + len * .45) * s + ny * hw],
      [cx + (r + len) * c, cy + (r + len) * s],
      [cx + (r + len * .45) * c - nx * hw, cy + (r + len * .45) * s - ny * hw]
    ], closed: true
  });
  p.smooth({ type: 'catmull-rom', factor: 0.5 });
  return sty(p);
}

export function makeDiamond(cx, cy, r, ang, hw, len) {
  const R = Math.PI / 180, a = ang * R, c = Math.cos(a), s = Math.sin(a), nx = -s, ny = c, m = r + len / 2;
  const p = new paper.Path({
    segments: [
      [cx + r * c, cy + r * s],
      [cx + m * c + nx * hw, cy + m * s + ny * hw],
      [cx + (r + len) * c, cy + (r + len) * s],
      [cx + m * c - nx * hw, cy + m * s - ny * hw]
    ], closed: true
  });
  return sty(p);
}

export function makeTeardrop(cx, cy, r, ang, w, len) {
  const R = Math.PI / 180, a = ang * R, c = Math.cos(a), s = Math.sin(a), nx = -s, ny = c;
  const p = new paper.Path({
    segments: [
      [cx + r * c, cy + r * s],
      [cx + (r + len * .3) * c + nx * w * .5, cy + (r + len * .3) * s + ny * w * .5],
      [cx + (r + len * .65) * c + nx * w * .3, cy + (r + len * .65) * s + ny * w * .3],
      [cx + (r + len) * c, cy + (r + len) * s],
      [cx + (r + len * .65) * c - nx * w * .3, cy + (r + len * .65) * s - ny * w * .3],
      [cx + (r + len * .3) * c - nx * w * .5, cy + (r + len * .3) * s - ny * w * .5]
    ], closed: true
  });
  p.smooth({ type: 'catmull-rom', factor: 0.5 });
  return sty(p);
}

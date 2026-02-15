import paper from 'paper';
import { SZ } from '../state.js';
import { sty } from './helpers.js';

export function genGeometric() {
  var s = 78, h = s * Math.sqrt(3) / 2;
  sty(new paper.Path.Rectangle([0, 0], [SZ, SZ]));
  for (var row = -1; row < SZ / h + 1; row++) {
    for (var col = -1; col < SZ / s + 1; col++) {
      var cx = col * s + (row % 2 ? s / 2 : 0), cy = row * h;
      if (cx < -s || cx > SZ + s || cy < -h || cy > SZ + h) continue;
      var hex = new paper.Path.RegularPolygon([cx, cy], 6, s * .46);
      sty(hex);
      var star = new paper.Path.Star([cx, cy], 6, s * .14, s * .33);
      sty(star);
      sty(new paper.Path.Circle([cx, cy], s * .1));
    }
  }
}

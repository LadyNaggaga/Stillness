import paper from 'paper';
import { SZ, SK, SW } from '../state.js';
import { sty, makePetal } from './helpers.js';

export function genFloral() {
  const cx = SZ / 2, cy = SZ / 2;
  sty(new paper.Path.Rectangle([8, 8], [SZ - 16, SZ - 16]));
  // Large center flower
  for (let i = 0; i < 10; i++) makePetal(cx, cy, 30, i * 36, 30, 130);
  for (let i = 0; i < 10; i++) makePetal(cx, cy, 25, i * 36 + 18, 20, 85);
  sty(new paper.Path.Circle([cx, cy], 30));
  sty(new paper.Path.Circle([cx, cy], 14));
  // Corner flowers
  [[150, 150], [650, 150], [150, 650], [650, 650]].forEach(function (c) {
    for (let i = 0; i < 7; i++) makePetal(c[0], c[1], 12, i * 360 / 7, 16, 50);
    sty(new paper.Path.Circle(c, 12));
  });
  // Side flowers
  [[400, 95], [400, 705], [95, 400], [705, 400]].forEach(function (c) {
    for (let i = 0; i < 5; i++) makePetal(c[0], c[1], 8, i * 72, 12, 38);
    sty(new paper.Path.Circle(c, 8));
  });
  // Leaves
  var lp = [[260, 260, 45], [540, 260, 135], [260, 540, -45], [540, 540, -135],
    [310, 170, 20], [490, 170, -20], [310, 630, -20], [490, 630, 20],
    [170, 310, 70], [170, 490, -70], [630, 310, -70], [630, 490, 70]];
  lp.forEach(function (l) {
    var lf = new paper.Path.Ellipse({ center: [l[0], l[1]], size: [55, 18] });
    lf.rotate(l[2]); sty(lf);
  });
  // Butterflies
  function bfly(bx, by, a, sz) {
    var lw = new paper.Path.Ellipse({ center: [bx - sz * .5, by], size: [sz, sz * .65] });
    lw.rotate(a + 15, [bx, by]); sty(lw);
    var rw = new paper.Path.Ellipse({ center: [bx + sz * .5, by], size: [sz, sz * .65] });
    rw.rotate(a - 15, [bx, by]); sty(rw);
    var bd = new paper.Path.Ellipse({ center: [bx, by], size: [5, sz * .7] });
    bd.rotate(a, [bx, by]); sty(bd);
  }
  bfly(200, 340, 10, 32); bfly(600, 310, -15, 28); bfly(340, 590, 5, 24);
  // Vine curves
  [[200, 200, 280, 160, 320, 200], [600, 200, 520, 160, 480, 200],
    [200, 600, 280, 640, 320, 600], [600, 600, 520, 640, 480, 600]].forEach(function (v) {
    var vine = new paper.Path({ segments: [[v[0], v[1]], [v[2], v[3]], [v[4], v[5]]] });
    vine.smooth(); vine.strokeColor = SK; vine.strokeWidth = SW;
  });
}

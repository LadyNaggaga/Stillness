import paper from 'paper';
import { SZ } from '../state.js';
import { sty, makePetal } from './helpers.js';

export function genButterfly() {
  var cx = SZ / 2;

  /* ── background ── */
  sty(new paper.Path.Rectangle([0, 0], [SZ, SZ]));

  /* ── helpers ── */
  function cell(pts) {
    var p = new paper.Path({ segments: pts, closed: true });
    p.smooth({ type: 'catmull-rom', factor: 0.5 });
    return sty(p);
  }
  function sym(pts) {
    cell(pts);
    cell(pts.map(function (pt) { return [2 * cx - pt[0], pt[1]]; }));
  }
  function symC(x, y, r) {
    sty(new paper.Path.Circle([x, y], r));
    sty(new paper.Path.Circle([2 * cx - x, y], r));
  }

  /* ── upper wings (right-side grid, mirrored) ── */
  var U = [
    [[420, 295], [490, 220], [570, 160], [660, 118], [730, 100]],
    [[420, 332], [498, 268], [578, 215], [662, 170], [730, 148]],
    [[420, 370], [510, 325], [588, 278], [665, 232], [730, 200]]
  ];
  for (var r = 0; r < 2; r++)
    for (var c = 0; c < 4; c++)
      sym([U[r][c], U[r][c + 1], U[r + 1][c + 1], U[r + 1][c]]);

  /* ── lower wings (right-side grid, mirrored) ── */
  var L = [
    [[420, 388], [495, 415], [575, 465], [640, 535]],
    [[418, 425], [488, 460], [558, 525], [615, 590]],
    [[416, 465], [475, 515], [535, 582], [580, 640]]
  ];
  for (var r = 0; r < 2; r++)
    for (var c = 0; c < 3; c++)
      sym([L[r][c], L[r][c + 1], L[r + 1][c + 1], L[r + 1][c]]);

  /* ── wing eye-spots ── */
  symC(615, 170, 20); symC(615, 170, 11); symC(615, 170, 4);
  symC(545, 520, 16); symC(545, 520, 7);

  /* ── wing edge decorations ── */
  // upper leading edge
  [[455, 258, 4], [520, 192, 4], [580, 155, 4], [640, 128, 4],
   [695, 110, 3.5], [730, 100, 3], [505, 162, 3.5], [660, 112, 3]]
    .forEach(function (d) { symC(d[0], d[1], d[2]); });
  // upper trailing edge
  [[465, 348, 4], [548, 302, 4], [625, 260, 4],
   [695, 220, 3.5], [730, 198, 3], [585, 280, 3]]
    .forEach(function (d) { symC(d[0], d[1], d[2]); });
  // lower wing edges
  [[460, 405, 4], [530, 435, 4], [600, 490, 4], [645, 545, 3.5],
   [450, 495, 4], [515, 548, 4], [565, 610, 3.5], [590, 645, 3]]
    .forEach(function (d) { symC(d[0], d[1], d[2]); });

  /* ── thorax ── */
  sty(new paper.Path.Ellipse({ center: [cx, 330], size: [30, 55] }));
  sty(new paper.Path.Circle([cx, 316], 4));
  sty(new paper.Path.Circle([cx, 342], 4));

  /* ── abdomen (5 segments) ── */
  for (var i = 0; i < 5; i++)
    sty(new paper.Path.Ellipse({
      center: [cx, 368 + i * 22],
      size: [24 - i * 2.5, 18]
    }));

  /* ── head ── */
  sty(new paper.Path.Circle([cx, 282], 18));
  sty(new paper.Path.Circle([cx - 9, 277], 5));
  sty(new paper.Path.Circle([cx + 9, 277], 5));

  /* ── antennae ── */
  var antR = new paper.Path({
    segments: [
      [cx + 4, 266], [cx + 35, 215], [cx + 72, 165], [cx + 95, 132], [cx + 100, 115],
      [cx + 106, 119], [cx + 101, 138], [cx + 78, 170], [cx + 40, 220], [cx + 8, 270]
    ], closed: true
  });
  antR.smooth({ type: 'catmull-rom', factor: 0.5 });
  sty(antR);
  var antL = new paper.Path({
    segments: [
      [cx - 4, 266], [cx - 35, 215], [cx - 72, 165], [cx - 95, 132], [cx - 100, 115],
      [cx - 106, 119], [cx - 101, 138], [cx - 78, 170], [cx - 40, 220], [cx - 8, 270]
    ], closed: true
  });
  antL.smooth({ type: 'catmull-rom', factor: 0.5 });
  sty(antL);
  // spiral tips
  sty(new paper.Path.Circle([cx + 103, 117], 9));
  sty(new paper.Path.Circle([cx + 103, 117], 4));
  sty(new paper.Path.Circle([cx - 103, 117], 9));
  sty(new paper.Path.Circle([cx - 103, 117], 4));

  /* ── corner flowers ── */
  [[75, 75], [SZ - 75, 75], [75, SZ - 75], [SZ - 75, SZ - 75]].forEach(function (c) {
    sty(new paper.Path.Circle(c, 8));
    for (var i = 0; i < 4; i++) makePetal(c[0], c[1], 10, i * 90, 12, 28);
  });

  /* ── scattered dots ── */
  [[120, 190, 5], [680, 190, 5], [160, 500, 4], [640, 500, 4],
   [200, 100, 4], [600, 100, 4], [110, 650, 4], [690, 650, 4],
   [250, 710, 3.5], [550, 710, 3.5], [300, 75, 3], [500, 75, 3],
   [760, 400, 4], [40, 400, 4], [760, 300, 3], [40, 300, 3],
   [760, 500, 3], [40, 500, 3], [200, 400, 3], [600, 400, 3],
   [180, 620, 3], [620, 620, 3], [300, 620, 3], [500, 620, 3],
   [350, 150, 3], [450, 150, 3], [220, 280, 3], [580, 280, 3],
   [280, 520, 3], [520, 520, 3]]
    .forEach(function (d) { sty(new paper.Path.Circle([d[0], d[1]], d[2])); });
}

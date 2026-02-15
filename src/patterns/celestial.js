import paper from 'paper';
import { SZ } from '../state.js';
import { sty, ringSegment, makePetal, makeTeardrop } from './helpers.js';

export function genCelestial() {
  const R = Math.PI / 180;

  /* ── background sections ── */
  sty(new paper.Path.Rectangle([0, 0], [SZ, SZ]));
  // diagonal dividers create 4 background zones
  var d1 = new paper.Path({ segments: [[0, 0], [SZ, SZ]], closed: false });
  var d2 = new paper.Path({ segments: [[SZ, 0], [0, SZ]], closed: false });
  sty(new paper.Path({ segments: [[0, 0], [SZ / 2, SZ / 2], [SZ, 0]], closed: true }));
  sty(new paper.Path({ segments: [[SZ, 0], [SZ / 2, SZ / 2], [SZ, SZ]], closed: true }));
  sty(new paper.Path({ segments: [[SZ, SZ], [SZ / 2, SZ / 2], [0, SZ]], closed: true }));
  sty(new paper.Path({ segments: [[0, SZ], [SZ / 2, SZ / 2], [0, 0]], closed: true }));

  /* ── sun (centre-left) ── */
  var sx = 260, sy = 340, sr = 60;
  // inner core
  sty(new paper.Path.Circle([sx, sy], sr * 0.35));
  // middle ring
  sty(new paper.Path.Circle([sx, sy], sr * 0.6));
  // outer ring
  sty(new paper.Path.Circle([sx, sy], sr));
  // corona ring segments (12)
  for (var i = 0; i < 12; i++) {
    ringSegment(sx, sy, sr, sr + 14, i * 30 + 2, i * 30 + 28);
  }
  // alternating long/short flame rays (24)
  for (var i = 0; i < 24; i++) {
    var ang = i * 15;
    var len = i % 2 === 0 ? 55 : 32;
    var hw = i % 2 === 0 ? 7 : 5;
    makeTeardrop(sx, sy, sr + 14, ang, hw * 2, len);
  }

  /* ── crescent moon (upper-right) ── */
  var mx = 620, my = 140, mr = 55;
  // full moon disc
  sty(new paper.Path.Circle([mx, my], mr));
  // shadow disc (creates crescent shape visually)
  sty(new paper.Path.Circle([mx + 22, my - 10], mr * 0.85));
  // decorative concentric arcs inside crescent
  for (var i = 1; i <= 3; i++) {
    var arcR = mr * (0.35 + i * 0.15);
    var arc = new paper.Path.Arc(
      [mx - arcR * Math.cos(40 * R), my - arcR * Math.sin(40 * R)],
      [mx - arcR, my],
      [mx - arcR * Math.cos(40 * R), my + arcR * Math.sin(40 * R)]
    );
    var seg = new paper.Path({
      segments: arc.segments.map(function (s) { return s.point; }),
      closed: true
    });
    arc.remove();
    sty(seg);
  }
  // small circles on moon face
  var moonDots = [[-18, -12, 5], [-28, 6, 4], [-12, 16, 3.5], [-30, -16, 3], [-8, -2, 4]];
  moonDots.forEach(function (d) { sty(new paper.Path.Circle([mx + d[0], my + d[1]], d[2])); });

  /* ── planet helper ── */
  function planet(px, py, pr, numBands, hasRing) {
    // planet body
    sty(new paper.Path.Circle([px, py], pr));
    // surface band stripes
    for (var i = 1; i <= numBands; i++) {
      var by = py - pr + (2 * pr / (numBands + 1)) * i;
      var halfW = Math.sqrt(Math.max(0, pr * pr - (by - py) * (by - py)));
      var band = new paper.Path({
        segments: [
          [px - halfW, by - 3],
          [px + halfW, by - 3],
          [px + halfW, by + 3],
          [px - halfW, by + 3]
        ], closed: true
      });
      sty(band);
    }
    // ring system
    if (hasRing) {
      ringSegment(px, py, pr + 6, pr + 14, 160, 380);
      ringSegment(px, py, pr + 15, pr + 21, 165, 375);
    }
  }

  // 6 planets at various positions and sizes
  planet(130, 160, 35, 3, true);   // top-left, ringed
  planet(680, 400, 42, 4, true);   // right, ringed
  planet(480, 600, 30, 2, false);  // bottom-middle
  planet(100, 550, 25, 2, true);   // left-lower, ringed
  planet(550, 170, 22, 2, false);  // upper-right small
  planet(350, 720, 28, 3, false);  // bottom

  /* ── constellation star fields ── */
  function star5(x, y, r) {
    sty(new paper.Path.Star([x, y], 5, r * 0.4, r));
  }

  // constellation 1 (upper-left triangle)
  var c1 = [[70, 60], [140, 30], [160, 90], [110, 110], [50, 100]];
  c1.forEach(function (p) { star5(p[0], p[1], 6); });
  for (var i = 0; i < c1.length - 1; i++) {
    sty(new paper.Path({
      segments: [
        [c1[i][0], c1[i][1] - 1], [c1[i + 1][0], c1[i + 1][1] - 1],
        [c1[i + 1][0], c1[i + 1][1] + 1], [c1[i][0], c1[i][1] + 1]
      ], closed: true
    }));
  }

  // constellation 2 (lower-right zigzag)
  var c2 = [[600, 650], [650, 620], [690, 660], [740, 630], [770, 670]];
  c2.forEach(function (p) { star5(p[0], p[1], 5); });
  for (var i = 0; i < c2.length - 1; i++) {
    sty(new paper.Path({
      segments: [
        [c2[i][0], c2[i][1] - 1], [c2[i + 1][0], c2[i + 1][1] - 1],
        [c2[i + 1][0], c2[i + 1][1] + 1], [c2[i][0], c2[i][1] + 1]
      ], closed: true
    }));
  }

  // constellation 3 (middle-left W shape)
  var c3 = [[40, 300], [80, 340], [60, 380], [100, 420], [80, 460]];
  c3.forEach(function (p) { star5(p[0], p[1], 5.5); });
  for (var i = 0; i < c3.length - 1; i++) {
    sty(new paper.Path({
      segments: [
        [c3[i][0], c3[i][1] - 1], [c3[i + 1][0], c3[i + 1][1] - 1],
        [c3[i + 1][0], c3[i + 1][1] + 1], [c3[i][0], c3[i][1] + 1]
      ], closed: true
    }));
  }

  // constellation 4 (upper-middle arc)
  var c4 = [[300, 50], [350, 35], [400, 30], [450, 40], [490, 60]];
  c4.forEach(function (p) { star5(p[0], p[1], 5); });
  for (var i = 0; i < c4.length - 1; i++) {
    sty(new paper.Path({
      segments: [
        [c4[i][0], c4[i][1] - 1], [c4[i + 1][0], c4[i + 1][1] - 1],
        [c4[i + 1][0], c4[i + 1][1] + 1], [c4[i][0], c4[i][1] + 1]
      ], closed: true
    }));
  }

  /* ── scattered individual stars ── */
  var stars = [
    [200, 90, 8], [420, 120, 6], [710, 80, 7], [760, 250, 5],
    [720, 530, 6], [340, 560, 5], [180, 450, 7], [560, 460, 5],
    [250, 250, 4], [470, 270, 5], [640, 280, 4], [320, 400, 5],
    [150, 700, 6], [500, 750, 5], [700, 750, 7], [770, 150, 4],
    [30, 200, 5], [40, 650, 4], [230, 600, 5], [440, 490, 4],
    [580, 90, 4], [760, 470, 5], [610, 540, 4], [280, 150, 5]
  ];
  stars.forEach(function (s) { star5(s[0], s[1], s[2]); });

  /* ── comet (upper-left corner) ── */
  var cmx = 720, cmy = 720, cmr = 12;
  sty(new paper.Path.Circle([cmx, cmy], cmr));
  sty(new paper.Path.Circle([cmx, cmy], cmr * 0.45));
  // main tail
  sty(new paper.Path({
    segments: [
      [cmx - cmr * 0.7, cmy - cmr * 0.7],
      [cmx - 120, cmy - 110],
      [cmx - 130, cmy - 95],
      [cmx - cmr * 0.5, cmy + cmr * 0.1]
    ], closed: true
  }));
  // secondary tail
  sty(new paper.Path({
    segments: [
      [cmx - cmr * 0.3, cmy - cmr * 0.8],
      [cmx - 70, cmy - 120],
      [cmx - 80, cmy - 110],
      [cmx + cmr * 0.1, cmy - cmr * 0.5]
    ], closed: true
  }));

  /* ── nebula swirl (decorative arcs near bottom-left) ── */
  for (var i = 0; i < 5; i++) {
    var nr = 30 + i * 14;
    var na1 = 200 + i * 8, na2 = 330 - i * 8;
    ringSegment(160, 680, nr, nr + 10, na1, na2);
  }

  /* ── extra small orbital dots around planets for more regions ── */
  var orbitDots = [
    [130, 100, 3], [170, 160, 3], [90, 190, 3],
    [720, 360, 3], [640, 430, 3], [710, 440, 3],
    [510, 570, 3], [450, 620, 3],
    [120, 510, 3], [70, 570, 3],
    [570, 140, 3], [530, 200, 3],
    [380, 690, 3], [320, 750, 3]
  ];
  orbitDots.forEach(function (d) { sty(new paper.Path.Circle([d[0], d[1]], d[2])); });
}

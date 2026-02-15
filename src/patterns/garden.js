import paper from 'paper';
import { SZ, SK, SW } from '../state.js';
import { sty, makePetal } from './helpers.js';

export function genGarden() {
  // Background
  sty(new paper.Path.Rectangle([8, 8], [SZ - 16, SZ - 16]));
  // Ground area
  sty(new paper.Path.Rectangle([8, 520], [SZ - 16, 272]));

  // ── Picket fence ──
  sty(new paper.Path.Rectangle([40, 230], [720, 14]));
  sty(new paper.Path.Rectangle([40, 170], [720, 14]));
  for (let i = 0; i < 13; i++) {
    const px = 60 + i * 56;
    sty(new paper.Path({
      segments: [[px - 10, 250], [px - 10, 155], [px, 140], [px + 10, 155], [px + 10, 250]],
      closed: true
    }));
  }

  // ── Stepping-stone path ──
  [[380, 480, 50, 30, 5], [410, 420, 45, 28, -8], [385, 365, 42, 26, 12],
   [415, 310, 48, 30, -5], [390, 260, 40, 25, 8], [420, 205, 38, 24, -10],
   [395, 155, 35, 22, 3]].forEach(function (s) {
    var st = new paper.Path.Ellipse({ center: [s[0], s[1]], size: [s[2], s[3]] });
    st.rotate(s[4]); sty(st);
  });

  // ── Flower pots ──
  function pot(px, py, pw, ph) {
    sty(new paper.Path({
      segments: [[px - pw / 2 - 8, py], [px + pw / 2 + 8, py],
        [px + pw / 2 - 5, py + ph], [px - pw / 2 + 5, py + ph]],
      closed: true
    }));
    sty(new paper.Path.Rectangle([px - pw / 2 - 12, py - 10], [pw + 24, 12]));
    var sa = new paper.Path.Ellipse({ center: [px, py + ph + 6], size: [pw + 10, 12] });
    sty(sa);
  }
  pot(160, 610, 60, 70);
  pot(400, 620, 55, 65);
  pot(640, 600, 65, 75);

  // ── Daisy (pot 1) ──
  var s1 = new paper.Path({ segments: [[160, 610], [155, 540], [150, 470]] });
  s1.smooth(); s1.strokeColor = SK; s1.strokeWidth = SW;
  for (let i = 0; i < 8; i++) makePetal(150, 470, 12, i * 45, 10, 35);
  sty(new paper.Path.Circle([150, 470], 12));
  var dl = new paper.Path.Ellipse({ center: [138, 545], size: [30, 12] });
  dl.rotate(-30); sty(dl);
  dl = new paper.Path.Ellipse({ center: [172, 560], size: [28, 11] });
  dl.rotate(25); sty(dl);

  // ── Tulip (pot 2) ──
  var s2 = new paper.Path({ segments: [[400, 620], [398, 560], [395, 500]] });
  s2.smooth(); s2.strokeColor = SK; s2.strokeWidth = SW;
  for (let i = 0; i < 5; i++) makePetal(395, 500, 8, -90 + (i - 2) * 25, 14, 45);
  sty(new paper.Path.Circle([395, 500], 8));
  var tl = new paper.Path.Ellipse({ center: [378, 570], size: [35, 10] });
  tl.rotate(-40); sty(tl);
  tl = new paper.Path.Ellipse({ center: [416, 575], size: [32, 10] });
  tl.rotate(35); sty(tl);

  // ── Sunflower (pot 3) ──
  var s3 = new paper.Path({ segments: [[640, 600], [638, 520], [635, 430]] });
  s3.smooth(); s3.strokeColor = SK; s3.strokeWidth = SW;
  for (let i = 0; i < 12; i++) makePetal(635, 430, 18, i * 30, 12, 45);
  for (let i = 0; i < 12; i++) makePetal(635, 430, 14, i * 30 + 15, 8, 30);
  sty(new paper.Path.Circle([635, 430], 18));
  sty(new paper.Path.Circle([635, 430], 9));
  var sl = new paper.Path.Ellipse({ center: [613, 520], size: [40, 14] });
  sl.rotate(-35); sty(sl);
  sl = new paper.Path.Ellipse({ center: [662, 540], size: [38, 13] });
  sl.rotate(30); sty(sl);

  // ── Large flower 1 (left) ──
  var ls1 = new paper.Path({ segments: [[100, 530], [95, 440], [100, 340]] });
  ls1.smooth(); ls1.strokeColor = SK; ls1.strokeWidth = SW;
  for (let i = 0; i < 8; i++) makePetal(100, 340, 20, i * 45, 18, 55);
  for (let i = 0; i < 8; i++) makePetal(100, 340, 14, i * 45 + 22, 12, 35);
  sty(new paper.Path.Circle([100, 340], 20));
  sty(new paper.Path.Circle([100, 340], 10));

  // ── Large flower 2 (right) ──
  var ls2 = new paper.Path({ segments: [[700, 530], [705, 420], [700, 320]] });
  ls2.smooth(); ls2.strokeColor = SK; ls2.strokeWidth = SW;
  for (let i = 0; i < 7; i++) makePetal(700, 320, 16, i * 360 / 7, 16, 50);
  sty(new paper.Path.Circle([700, 320], 16));

  // ── Large flower 3 (center-left) ──
  var ls3 = new paper.Path({ segments: [[300, 530], [295, 400], [300, 280]] });
  ls3.smooth(); ls3.strokeColor = SK; ls3.strokeWidth = SW;
  for (let i = 0; i < 6; i++) makePetal(300, 280, 14, i * 60, 14, 45);
  for (let i = 0; i < 6; i++) makePetal(300, 280, 10, i * 60 + 30, 10, 28);
  sty(new paper.Path.Circle([300, 280], 14));

  // ── Climbing vine (left edge) ──
  var vine = new paper.Path({
    segments: [[30, 700], [35, 600], [28, 500], [40, 400], [32, 300], [45, 200], [38, 100]]
  });
  vine.smooth(); vine.strokeColor = SK; vine.strokeWidth = SW;
  [[45, 650, 30], [25, 580, -25], [50, 510, 35], [22, 440, -30], [48, 370, 25],
   [26, 300, -35], [52, 240, 30], [28, 170, -25], [55, 120, 35], [30, 80, -20]
  ].forEach(function (v) {
    var lf = new paper.Path.Ellipse({ center: [v[0], v[1]], size: [26, 12] });
    lf.rotate(v[2]); sty(lf);
  });

  // ── Bees ──
  function bee(bx, by, ang, sz) {
    var a = ang * Math.PI / 180, c = Math.cos(a), s = Math.sin(a), nx = -s, ny = c;
    var body = new paper.Path.Ellipse({ center: [bx, by], size: [sz, sz * 0.55] });
    body.rotate(ang); sty(body);
    sty(new paper.Path.Circle([bx + c * sz * 0.55, by + s * sz * 0.55], sz * 0.2));
    var st1 = new paper.Path.Ellipse({ center: [bx - c * sz * 0.1, by - s * sz * 0.1], size: [sz * 0.15, sz * 0.45] });
    st1.rotate(ang); sty(st1);
    var st2 = new paper.Path.Ellipse({ center: [bx - c * sz * 0.3, by - s * sz * 0.3], size: [sz * 0.15, sz * 0.45] });
    st2.rotate(ang); sty(st2);
    var w1 = new paper.Path.Ellipse({
      center: [bx + nx * sz * 0.35 + c * sz * 0.15, by + ny * sz * 0.35 + s * sz * 0.15],
      size: [sz * 0.45, sz * 0.25]
    });
    w1.rotate(ang + 20); sty(w1);
    var w2 = new paper.Path.Ellipse({
      center: [bx - nx * sz * 0.35 + c * sz * 0.15, by - ny * sz * 0.35 + s * sz * 0.15],
      size: [sz * 0.45, sz * 0.25]
    });
    w2.rotate(ang - 20); sty(w2);
  }
  bee(250, 150, 15, 30);
  bee(550, 380, -20, 26);

  // ── Watering can ──
  var wcx = 520, wcy = 560;
  var wb = new paper.Path({
    segments: [[wcx - 25, wcy - 30], [wcx + 25, wcy - 30],
      [wcx + 30, wcy + 25], [wcx - 30, wcy + 25]],
    closed: true
  });
  wb.smooth({ type: 'catmull-rom', factor: 0.3 }); sty(wb);
  sty(new paper.Path({
    segments: [[wcx + 25, wcy - 25], [wcx + 55, wcy - 55],
      [wcx + 62, wcy - 50], [wcx + 30, wcy - 20]],
    closed: true
  }));
  sty(new paper.Path.Ellipse({ center: [wcx + 62, wcy - 55], size: [18, 10] }));
  sty(new paper.Path({
    segments: [[wcx - 15, wcy - 30], [wcx - 25, wcy - 55],
      [wcx + 5, wcy - 60], [wcx + 15, wcy - 30]],
    closed: true
  }));

  // ── Butterflies ──
  function bfly(bx, by, a, sz) {
    var lw = new paper.Path.Ellipse({ center: [bx - sz * 0.5, by], size: [sz, sz * 0.65] });
    lw.rotate(a + 15, [bx, by]); sty(lw);
    var rw = new paper.Path.Ellipse({ center: [bx + sz * 0.5, by], size: [sz, sz * 0.65] });
    rw.rotate(a - 15, [bx, by]); sty(rw);
    var li = new paper.Path.Ellipse({ center: [bx - sz * 0.45, by], size: [sz * 0.45, sz * 0.3] });
    li.rotate(a + 15, [bx, by]); sty(li);
    var ri = new paper.Path.Ellipse({ center: [bx + sz * 0.45, by], size: [sz * 0.45, sz * 0.3] });
    ri.rotate(a - 15, [bx, by]); sty(ri);
    sty(new paper.Path.Ellipse({ center: [bx, by], size: [4, sz * 0.6] }));
  }
  bfly(480, 120, 10, 24);
  bfly(180, 260, -12, 20);
  bfly(620, 180, 8, 22);

  // ── Grass tufts ──
  function grass(gx, gy) {
    [[-8, -20, -15], [0, -25, 0], [8, -18, 12]].forEach(function (b) {
      var bl = new paper.Path({
        segments: [[gx + b[0] - 2, gy], [gx + b[0] + b[2] * 0.3, gy + b[1] * 0.5],
          [gx + b[0] + b[2] * 0.5, gy + b[1]], [gx + b[0] + 3, gy]],
        closed: true
      });
      bl.smooth({ type: 'catmull-rom', factor: 0.4 }); sty(bl);
    });
  }
  grass(80, 540); grass(200, 550); grass(310, 545); grass(460, 550);
  grass(570, 540); grass(680, 548); grass(130, 560); grass(350, 555);
  grass(510, 558); grass(620, 555); grass(740, 545); grass(270, 560);

  // ── Bird on fence ──
  var bx = 450, by = 155;
  var bb = new paper.Path.Ellipse({ center: [bx, by], size: [28, 18] });
  bb.rotate(-10); sty(bb);
  sty(new paper.Path.Circle([bx + 16, by - 8], 8));
  sty(new paper.Path({ segments: [[bx + 24, by - 9], [bx + 34, by - 8], [bx + 24, by - 5]], closed: true }));
  var bw = new paper.Path.Ellipse({ center: [bx - 3, by - 2], size: [18, 10] });
  bw.rotate(-15); sty(bw);
  sty(new paper.Path({
    segments: [[bx - 14, by], [bx - 28, by - 12], [bx - 25, by - 2], [bx - 14, by + 4]],
    closed: true
  }));
  sty(new paper.Path.Circle([bx + 18, by - 10], 2));
}

import paper from 'paper';
import { SZ, SK, SW } from '../state.js';
import { sty, makePetal } from './helpers.js';

export function genOcean() {
  sty(new paper.Path.Rectangle([0, 0], [SZ, SZ]));

  // === Sky area at top ===
  sty(new paper.Path.Rectangle([0, 0], [SZ, 80]));
  // Sun
  sty(new paper.Path.Circle([680, 45], 30));
  sty(new paper.Path.Circle([680, 45], 18));
  for (var i = 0; i < 10; i++) {
    var sa = i * 36 * Math.PI / 180;
    var sx = 680 + 42 * Math.cos(sa), sy = 45 + 42 * Math.sin(sa);
    sty(new paper.Path.Ellipse({ center: [sx, sy], size: [8, 3] }).rotate(i * 36));
  }
  // Clouds
  function cloud(x, y) {
    sty(new paper.Path.Ellipse({ center: [x, y], size: [50, 22] }));
    sty(new paper.Path.Ellipse({ center: [x - 18, y + 2], size: [30, 18] }));
    sty(new paper.Path.Ellipse({ center: [x + 20, y + 2], size: [35, 16] }));
  }
  cloud(150, 35); cloud(420, 50);

  // === Waves — varied heights, fewer but thicker ===
  var waveYs = [85, 145, 215, 290, 370, 445, 520, 590];
  waveYs.forEach(function (wy, idx) {
    var amp = 12 + (idx % 3) * 5;
    var thick = 35 + (idx % 2) * 15;
    var freq = 32 + (idx % 3) * 8;
    var wv = new paper.Path();
    for (var x = 0; x <= SZ; x += 14) wv.add([x, wy + amp * Math.sin(x / freq + idx * 0.7)]);
    for (var x = SZ; x >= 0; x -= 14) wv.add([x, wy + thick + amp * 0.6 * Math.sin(x / freq + idx * 0.7 + 1.2)]);
    wv.closed = true; sty(wv);
  });

  // === Fish — larger, more detailed ===
  function fish(fx, fy, sz, dir) {
    // Body
    var bd = new paper.Path.Ellipse({ center: [fx, fy], size: [sz, sz * 0.5] });
    sty(bd);
    // Tail (larger)
    sty(new paper.Path({
      segments: [
        [fx + dir * sz * 0.4, fy],
        [fx + dir * sz * 0.72, fy - sz * 0.28],
        [fx + dir * sz * 0.55, fy],
        [fx + dir * sz * 0.72, fy + sz * 0.28]
      ], closed: true
    }));
    // Dorsal fin
    sty(new paper.Path({
      segments: [
        [fx - dir * sz * 0.05, fy - sz * 0.22],
        [fx + dir * sz * 0.12, fy - sz * 0.42],
        [fx + dir * sz * 0.25, fy - sz * 0.22]
      ], closed: true
    }));
    // Eye
    sty(new paper.Path.Circle([fx - dir * sz * 0.2, fy - sz * 0.05], sz * 0.08));
    sty(new paper.Path.Circle([fx - dir * sz * 0.2, fy - sz * 0.05], sz * 0.03));
    // Body stripes
    for (var i = 0; i < 3; i++) {
      var sx = fx - dir * sz * 0.05 + dir * i * sz * 0.14;
      sty(new paper.Path.Ellipse({ center: [sx, fy], size: [4, sz * 0.28] }));
    }
    // Pectoral fin
    var pf = new paper.Path.Ellipse({ center: [fx + dir * sz * 0.05, fy + sz * 0.15], size: [sz * 0.22, sz * 0.12] });
    pf.rotate(dir * 20); sty(pf);
  }
  fish(190, 170, 90, -1);
  fish(580, 310, 80, 1);
  fish(320, 440, 70, -1);
  fish(650, 500, 65, 1);
  fish(140, 560, 60, 1);

  // Small fish (simpler)
  function smallFish(fx, fy, sz, dir) {
    sty(new paper.Path.Ellipse({ center: [fx, fy], size: [sz, sz * 0.45] }));
    sty(new paper.Path({
      segments: [[fx + dir * sz * 0.38, fy], [fx + dir * sz * 0.62, fy - sz * 0.2], [fx + dir * sz * 0.62, fy + sz * 0.2]],
      closed: true
    }));
    sty(new paper.Path.Circle([fx - dir * sz * 0.15, fy - 1], sz * 0.06));
  }
  smallFish(450, 130, 40, 1); smallFish(720, 240, 35, -1);
  smallFish(100, 350, 38, 1); smallFish(500, 250, 32, -1);

  // === Seaweed ===
  function seaweed(sx, sy, h, leaves) {
    // Stem
    sty(new paper.Path.Ellipse({ center: [sx, sy - h / 2], size: [5, h] }));
    // Leaves alternating sides
    for (var i = 0; i < leaves; i++) {
      var ly = sy - i * (h / leaves) - h * 0.1;
      var dir = (i % 2 === 0) ? 1 : -1;
      var lf = new paper.Path.Ellipse({
        center: [sx + dir * 14, ly],
        size: [22, 8]
      });
      lf.rotate(dir * 25, [sx, ly]);
      sty(lf);
    }
  }
  seaweed(60, 720, 120, 5);
  seaweed(250, 740, 100, 4);
  seaweed(740, 720, 110, 5);

  // === Coral ===
  function coral(cx, cy, branches) {
    sty(new paper.Path.Ellipse({ center: [cx, cy + 5], size: [12, 20] })); // base
    for (var i = 0; i < branches; i++) {
      var a = -30 + (i / (branches - 1)) * 60;
      var ar = a * Math.PI / 180;
      var blen = 25 + (i % 2) * 12;
      var bx = cx + blen * Math.sin(ar);
      var by = cy - blen * Math.cos(ar);
      sty(new paper.Path.Ellipse({ center: [(cx + bx) / 2, (cy + by) / 2], size: [6, blen] }).rotate(a));
      // Tip bulb
      sty(new paper.Path.Circle([bx, by], 6));
    }
  }
  coral(440, 710, 4);
  coral(580, 725, 3);
  coral(160, 730, 3);

  // === Shells — larger with internal detail ===
  function shell(sx, sy, sz) {
    // Fan shape
    for (var i = 0; i < 7; i++) {
      var a1 = -80 + i * (160 / 7);
      var a2 = a1 + 160 / 7;
      var r1 = sz * 0.15, r2 = sz * 0.5;
      var R = Math.PI / 180;
      var p = new paper.Path({
        segments: [
          [sx + r1 * Math.cos(a1 * R), sy + r1 * Math.sin(a1 * R)],
          [sx + r2 * Math.cos(a1 * R), sy + r2 * Math.sin(a1 * R)],
          [sx + r2 * Math.cos(a2 * R), sy + r2 * Math.sin(a2 * R)],
          [sx + r1 * Math.cos(a2 * R), sy + r1 * Math.sin(a2 * R)]
        ], closed: true
      });
      sty(p);
    }
    sty(new paper.Path.Circle([sx, sy], sz * 0.12));
  }
  shell(100, 750, 42);
  shell(350, 755, 36);
  shell(680, 745, 40);

  // === Starfish — larger ===
  function starF(sx, sy, sz) {
    sty(new paper.Path.Star([sx, sy], 5, sz * 0.38, sz));
    sty(new paper.Path.Circle([sx, sy], sz * 0.18));
    // Dots on arms
    for (var i = 0; i < 5; i++) {
      var a = (i * 72 - 90) * Math.PI / 180;
      sty(new paper.Path.Circle([sx + sz * 0.6 * Math.cos(a), sy + sz * 0.6 * Math.sin(a)], 3));
    }
  }
  starF(480, 720, 35);
  starF(220, 710, 28);

  // === Bubbles — varied sizes ===
  var bubbles = [
    [80, 120, 8], [220, 100, 6], [460, 115, 10], [650, 180, 7],
    [120, 280, 5], [700, 380, 9], [350, 200, 7], [550, 460, 8],
    [80, 480, 6], [680, 560, 7], [400, 360, 5], [520, 160, 6],
    [300, 330, 4], [760, 450, 5], [420, 540, 6], [180, 430, 4],
  ];
  bubbles.forEach(function (b) {
    sty(new paper.Path.Circle([b[0], b[1]], b[2]));
    // Highlight dot
    sty(new paper.Path.Circle([b[0] - b[2] * 0.3, b[1] - b[2] * 0.3], b[2] * 0.25));
  });

  // === Jellyfish ===
  var jx = 700, jy = 130;
  // Bell
  var bell = new paper.Path.Arc(
    new paper.Point(jx - 28, jy + 5),
    new paper.Point(jx, jy - 25),
    new paper.Point(jx + 28, jy + 5)
  );
  bell.lineTo(new paper.Point(jx - 28, jy + 5));
  bell.closed = true; sty(bell);
  sty(new paper.Path.Ellipse({ center: [jx, jy + 8], size: [56, 10] }));
  // Tentacles
  for (var t = -2; t <= 2; t++) {
    sty(new paper.Path.Ellipse({
      center: [jx + t * 10, jy + 32],
      size: [4, 30]
    }));
  }
}

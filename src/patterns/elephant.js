import paper from 'paper';
import { SZ } from '../state.js';
import { sty, makePetal, makeTeardrop, ringSegment } from './helpers.js';

export function genElephant() {
  var cx = SZ / 2, cy = SZ / 2 + 10;
  sty(new paper.Path.Rectangle([0, 0], [SZ, SZ]));

  // === Decorative border frame ===
  for (var side = 0; side < 4; side++) {
    for (var i = 0; i < 12; i++) {
      var bx, by, bw = SZ / 12, bh = 18;
      if (side === 0) { bx = i * bw; by = 5; }
      else if (side === 1) { bx = i * bw; by = SZ - 23; }
      else if (side === 2) { bx = 5; by = i * bw; bw = 18; bh = SZ / 12; }
      else { bx = SZ - 23; by = i * bw; bw = 18; bh = SZ / 12; }
      sty(new paper.Path.Rectangle([bx, by], [bw, bh]));
    }
  }

  // === Head ===
  sty(new paper.Path.Circle([cx, cy - 40], 160));
  // Cheek pattern — concentric arcs on each side
  for (var i = 1; i <= 3; i++) {
    var cr = 40 + i * 22;
    ringSegment(cx, cy - 40, cr - 10, cr, 200, 250);
    ringSegment(cx, cy - 40, cr - 10, cr, 290, 340);
  }

  // === Ears — large with rich internal decoration ===
  var earX = 200, earY = cy - 10;
  // Left ear outer + inner
  var le = new paper.Path.Ellipse({ center: [cx - earX, earY], size: [160, 210] });
  le.rotate(-8); sty(le);
  var lei = new paper.Path.Ellipse({ center: [cx - earX, earY], size: [120, 165] });
  lei.rotate(-8); sty(lei);
  // Left ear zentangle: concentric rings + radial petals
  for (var i = 1; i <= 4; i++) {
    sty(new paper.Path.Circle([cx - earX, earY], 12 + i * 14));
  }
  for (var i = 0; i < 8; i++) makePetal(cx - earX, earY, 16, i * 45, 6, 25);
  sty(new paper.Path.Circle([cx - earX, earY], 12));
  // Dots in ear
  for (var i = 0; i < 6; i++) {
    var ea = i * 60 * Math.PI / 180;
    sty(new paper.Path.Circle([cx - earX + 58 * Math.cos(ea), earY + 68 * Math.sin(ea)], 6));
  }

  // Right ear (mirror)
  var re = new paper.Path.Ellipse({ center: [cx + earX, earY], size: [160, 210] });
  re.rotate(8); sty(re);
  var rei = new paper.Path.Ellipse({ center: [cx + earX, earY], size: [120, 165] });
  rei.rotate(8); sty(rei);
  for (var i = 1; i <= 4; i++) {
    sty(new paper.Path.Circle([cx + earX, earY], 12 + i * 14));
  }
  for (var i = 0; i < 8; i++) makePetal(cx + earX, earY, 16, i * 45, 6, 25);
  sty(new paper.Path.Circle([cx + earX, earY], 12));
  for (var i = 0; i < 6; i++) {
    var ea = i * 60 * Math.PI / 180;
    sty(new paper.Path.Circle([cx + earX + 58 * Math.cos(ea), earY + 68 * Math.sin(ea)], 6));
  }

  // === Eyes — larger with decorative lids ===
  var eyeOff = 62, eyeY = cy - 72;
  [-1, 1].forEach(function (dir) {
    var ex = cx + dir * eyeOff;
    sty(new paper.Path.Circle([ex, eyeY], 22));
    sty(new paper.Path.Circle([ex, eyeY], 10));
    sty(new paper.Path.Circle([ex, eyeY], 4));
    // Eyelid arcs
    var lid = new paper.Path.Arc(
      new paper.Point(ex - 22, eyeY),
      new paper.Point(ex, eyeY - 28),
      new paper.Point(ex + 22, eyeY)
    );
    lid.lineTo(new paper.Point(ex - 22, eyeY));
    lid.closed = true;
    sty(lid);
  });

  // === Forehead mandala — larger and more detailed ===
  var fhY = cy - 42;
  sty(new paper.Path.Circle([cx, fhY], 8));
  sty(new paper.Path.Circle([cx, fhY], 18));
  for (var i = 0; i < 10; i++) makePetal(cx, fhY, 20, i * 36, 10, 42);
  for (var i = 0; i < 10; i++) makePetal(cx, fhY, 52, i * 36 + 18, 6, 24);
  // Dots around mandala
  for (var i = 0; i < 10; i++) {
    var ma = (i * 36 + 18) * Math.PI / 180;
    sty(new paper.Path.Circle([cx + 80 * Math.cos(ma), fhY + 80 * Math.sin(ma)], 4));
  }

  // === Crown — teardrops above the head ===
  for (var i = 0; i < 7; i++) makeTeardrop(cx, cy - 40, 130, -155 + i * 22, 12, 35);

  // === Trunk — wider with decorative bands ===
  var tr = new paper.Path({
    segments: [
      [cx - 34, cy + 95], [cx - 40, cy + 180], [cx - 52, cy + 275],
      [cx - 44, cy + 350], [cx - 14, cy + 385], [cx + 14, cy + 385],
      [cx + 44, cy + 350], [cx + 52, cy + 275], [cx + 40, cy + 180],
      [cx + 34, cy + 95]
    ],
    closed: true
  });
  tr.smooth(); sty(tr);
  // Trunk bands — wider, more decorative
  for (var i = 0; i < 8; i++) {
    var ty = cy + 115 + i * 32, tw = 28 - i * 1.8;
    if (tw > 6) {
      sty(new paper.Path.Rectangle({ center: [cx, ty], size: [tw * 2, 14], radius: 4 }));
      // Small dot on each side of band
      sty(new paper.Path.Circle([cx - tw - 4, ty], 3));
      sty(new paper.Path.Circle([cx + tw + 4, ty], 3));
    }
  }
  // Trunk tip curl
  sty(new paper.Path.Circle([cx, cy + 382], 8));

  // === Tusks — thicker, more visible ===
  [-1, 1].forEach(function (dir) {
    var tx = cx + dir * 48;
    var tp = new paper.Path({
      segments: [
        [tx, cy + 75],
        [tx + dir * 35, cy + 145],
        [tx + dir * 52, cy + 210],
        [tx + dir * 45, cy + 195],
        [tx + dir * 22, cy + 135],
        [tx + dir * 5, cy + 80]
      ],
      closed: true
    });
    tp.smooth(); sty(tp);
    // Tusk bands
    sty(new paper.Path.Ellipse({ center: [tx + dir * 30, cy + 140], size: [18, 8] }));
    sty(new paper.Path.Ellipse({ center: [tx + dir * 42, cy + 180], size: [14, 6] }));
  });

  // === Side decorations — fill the empty space ===
  // Paisley/teardrop shapes flanking the head
  [-1, 1].forEach(function (dir) {
    for (var row = 0; row < 3; row++) {
      var dx = cx + dir * 145 + dir * row * 35;
      var dy = cy + 120 + row * 55;
      makeTeardrop(dx, dy, 0, dir > 0 ? -90 : 90, 10, 28);
    }
  });

  // Decorative dots along the head perimeter
  for (var i = 0; i < 16; i++) {
    var ha = (i * 22.5 + 180) * Math.PI / 180; // lower half of head
    if (ha > Math.PI * 0.8 && ha < Math.PI * 2.2) {
      sty(new paper.Path.Circle([cx + 145 * Math.cos(ha), (cy - 40) + 145 * Math.sin(ha)], 4));
    }
  }

  // === Corner mandalas — richer ===
  [[65, 65], [SZ - 65, 65], [65, SZ - 65], [SZ - 65, SZ - 65]].forEach(function (c) {
    for (var i = 0; i < 6; i++) makePetal(c[0], c[1], 6, i * 60, 7, 25);
    sty(new paper.Path.Circle(c, 10));
    sty(new paper.Path.Circle(c, 5));
    // Small dots around corner flower
    for (var i = 0; i < 6; i++) {
      var ca = i * 60 * Math.PI / 180;
      sty(new paper.Path.Circle([c[0] + 35 * Math.cos(ca), c[1] + 35 * Math.sin(ca)], 3));
    }
  });

  // === Edge midpoint flowers ===
  [[SZ / 2, 35], [SZ / 2, SZ - 35], [35, SZ / 2], [SZ - 35, SZ / 2]].forEach(function (c) {
    for (var i = 0; i < 4; i++) makePetal(c[0], c[1], 4, i * 90 + 45, 5, 16);
    sty(new paper.Path.Circle(c, 4));
  });
}

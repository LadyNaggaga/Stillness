import paper from 'paper';
import { SZ } from '../state.js';
import { sty, makePetal } from './helpers.js';

// Inspired by the Paisley/Boteh motif — originating in Persia, iconic in
// Kashmiri shawls, and later adopted by Scottish Paisley weavers. The
// distinctive teardrop/comma shape (boteh) is filled with floral and
// geometric details in flowing, organic arrangements.

export function genPaisley() {
  sty(new paper.Path.Rectangle([0, 0], [SZ, SZ]));

  // Helper: create a paisley teardrop outline
  function paisleyShape(cx, cy, w, h, angle) {
    const p = new paper.Path({
      segments: [
        [cx, cy - h / 2],
        [cx + w / 2, cy - h * 0.1],
        [cx + w * 0.35, cy + h * 0.25],
        [cx + w * 0.1, cy + h * 0.42],
        [cx, cy + h / 2],
        [cx - w * 0.1, cy + h * 0.42],
        [cx - w * 0.35, cy + h * 0.25],
        [cx - w / 2, cy - h * 0.1],
      ],
      closed: true
    });
    p.smooth({ type: 'catmull-rom', factor: 0.5 });
    p.rotate(angle, [cx, cy]);
    return sty(p);
  }

  // Helper: inner paisley ring
  function innerPaisley(cx, cy, w, h, angle, scale) {
    return paisleyShape(cx, cy, w * scale, h * scale, angle);
  }

  // Helper: dot border along a curve
  function dotBorder(cx, cy, radius, count, dotR) {
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      sty(new paper.Path.Circle([cx + radius * Math.cos(a), cy + radius * Math.sin(a)], dotR));
    }
  }

  // Helper: small flower
  function smallFlower(x, y, petalR, n) {
    for (let i = 0; i < n; i++) {
      makePetal(x, y, 3, i * (360 / n), petalR * 0.4, petalR);
    }
    sty(new paper.Path.Circle([x, y], 3));
  }

  // Helper: small leaf
  function leaf(x, y, w, h, angle) {
    const l = new paper.Path.Ellipse({ center: [x, y], size: [w, h] });
    l.rotate(angle, [x, y]);
    sty(l);
  }

  // === Large paisleys ===
  const paisleys = [
    { cx: 250, cy: 200, w: 180, h: 280, angle: -20 },
    { cx: 560, cy: 260, w: 150, h: 240, angle: 25 },
    { cx: 400, cy: 480, w: 200, h: 310, angle: 10 },
    { cx: 160, cy: 530, w: 130, h: 210, angle: -35 },
    { cx: 620, cy: 560, w: 140, h: 220, angle: 40 },
    { cx: 350, cy: 150, w: 100, h: 170, angle: -45 },
    { cx: 680, cy: 130, w: 90, h: 150, angle: 15 },
  ];

  paisleys.forEach(function (p) {
    // Outer shape
    paisleyShape(p.cx, p.cy, p.w, p.h, p.angle);
    // Nested inner rings
    innerPaisley(p.cx, p.cy, p.w, p.h, p.angle, 0.75);
    innerPaisley(p.cx, p.cy, p.w, p.h, p.angle, 0.5);

    // Central flower inside
    const flowerR = Math.min(p.w, p.h) * 0.1;
    for (let i = 0; i < 5; i++) {
      makePetal(p.cx, p.cy, flowerR * 0.4, i * 72 + p.angle, flowerR * 0.35, flowerR);
    }
    sty(new paper.Path.Circle([p.cx, p.cy], flowerR * 0.35));

    // Dot border ring
    const dotCount = Math.floor(Math.min(p.w, p.h) * 0.08);
    dotBorder(p.cx, p.cy, Math.min(p.w, p.h) * 0.28, dotCount, 3);

    // Small diamonds in the upper curve area
    const offset = p.h * 0.3;
    const rad = p.angle * Math.PI / 180;
    for (let i = 0; i < 3; i++) {
      const dx = (i - 1) * p.w * 0.15;
      const px = p.cx + dx * Math.cos(rad) - (-offset) * Math.sin(rad);
      const py = p.cy + dx * Math.sin(rad) + (-offset) * Math.cos(rad);
      const ds = Math.min(p.w, p.h) * 0.06;
      sty(new paper.Path({
        segments: [[px, py - ds], [px + ds, py], [px, py + ds], [px - ds, py]],
        closed: true
      }));
    }
  });

  // === Small filler flowers between paisleys ===
  const flowers = [
    [130, 120], [450, 50], [730, 220], [80, 380],
    [330, 330], [700, 400], [500, 680], [180, 700],
    [600, 720], [730, 650], [80, 680], [450, 770],
  ];
  flowers.forEach(function (f) {
    smallFlower(f[0], f[1], 15, 5);
  });

  // === Small leaves ===
  const leaves = [
    [200, 70, 25], [500, 120, -30], [650, 50, 40],
    [100, 280, 60], [750, 350, -20], [300, 620, 35],
    [550, 580, -45], [150, 430, 55], [680, 480, -35],
    [400, 740, 20], [720, 760, -25], [50, 550, 45],
  ];
  leaves.forEach(function (l) {
    leaf(l[0], l[1], 30, 12, l[2]);
  });

  // === Scattered dots ===
  const dots = [
    [300, 80], [550, 50], [100, 180], [720, 100],
    [50, 450], [770, 500], [250, 770], [650, 770],
    [380, 400], [500, 350], [150, 330], [680, 300],
  ];
  dots.forEach(function (d) {
    sty(new paper.Path.Circle(d, 4));
  });

  // === Corner ornaments ===
  [[45, 45], [SZ - 45, 45], [45, SZ - 45], [SZ - 45, SZ - 45]].forEach(function (c) {
    for (let i = 0; i < 4; i++) {
      makePetal(c[0], c[1], 5, i * 90, 7, 22);
    }
    sty(new paper.Path.Circle(c, 5));
  });
}

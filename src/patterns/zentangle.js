import paper from 'paper';
import { SZ, SK, SW } from '../state.js';
import { sty, ringSegment, makePetal } from './helpers.js';

export function genZentangle() {
  var cols = 4, rows = 4, cw = (SZ - 40) / cols, ch = (SZ - 40) / rows, ox = 20, oy = 20;
  sty(new paper.Path.Rectangle([8, 8], [SZ - 16, SZ - 16]));
  var tiles = [
    function (x, y, w, h) { // concentric circles
      for (var r = Math.min(w, h) / 2 - 8; r > 8; r -= 14) sty(new paper.Path.Circle([x + w / 2, y + h / 2], r));
    },
    function (x, y, w, h) { // flower
      var fx = x + w / 2, fy = y + h / 2;
      for (var i = 0; i < 6; i++) makePetal(fx, fy, 6, i * 60, 10, w / 2 - 18);
      sty(new paper.Path.Circle([fx, fy], 8));
    },
    function (x, y, w, h) { // scales
      for (var r = 0; r < 4; r++) for (var c = 0; c < 3; c++) {
        var sx = x + 8 + c * (w - 16) / 3 + (r % 2 ? (w - 16) / 6 : 0), sy = y + 12 + r * (h - 16) / 4;
        sty(new paper.Path.Ellipse({ center: [sx + (w - 16) / 6, sy], size: [(w - 16) / 3 - 3, (h - 16) / 4 - 3] }));
      }
    },
    function (x, y, w, h) { // grid with dots
      var g = 5, gw = (w - 8) / g, gh = (h - 8) / g;
      for (var r = 0; r < g; r++) for (var c = 0; c < g; c++) {
        sty(new paper.Path.Rectangle([x + 4 + c * gw, y + 4 + r * gh], [gw - 1, gh - 1]));
        if ((r + c) % 2 === 0) sty(new paper.Path.Circle([x + 4 + c * gw + gw / 2, y + 4 + r * gh + gh / 2], Math.min(gw, gh) / 3));
      }
    },
    function (x, y, w, h) { // nested diamonds
      var cx2 = x + w / 2, cy2 = y + h / 2;
      for (var d = Math.min(w, h) / 2 - 8; d > 12; d -= 18) {
        sty(new paper.Path({ segments: [[cx2, cy2 - d], [cx2 + d, cy2], [cx2, cy2 + d], [cx2 - d, cy2]], closed: true }));
      }
    },
    function (x, y, w, h) { // spiral rings
      var cx2 = x + w / 2, cy2 = y + h / 2;
      for (var ring = 1; ring <= 4; ring++) {
        var r = ring * Math.min(w, h) / 10;
        for (var i = 0; i < 6; i++) ringSegment(cx2, cy2, Math.max(2, r - 6), r + 6, i * 60, (i + 1) * 60);
      }
    },
    function (x, y, w, h) { // triangles
      var cx2 = x + w / 2, cy2 = y + h / 2, s = Math.min(w, h) / 2 - 10;
      sty(new paper.Path.RegularPolygon([cx2, cy2], 3, s));
      sty(new paper.Path.RegularPolygon([cx2, cy2], 3, s * .6));
      sty(new paper.Path.RegularPolygon([cx2, cy2], 3, s * .3));
      sty(new paper.Path.Circle([cx2, cy2], 8));
    },
    function (x, y, w, h) { // waves
      for (var r = 0; r < 5; r++) {
        var yy = y + 10 + r * (h - 16) / 5;
        for (var c = 0; c < 3; c++) {
          var xx = x + 8 + c * (w - 16) / 3, ww = (w - 16) / 3, hh = (h - 16) / 5;
          var wv = new paper.Path({ segments: [[xx, yy + hh / 2], [xx + ww * .25, yy], [xx + ww * .5, yy + hh / 2], [xx + ww * .75, yy + hh], [xx + ww, yy + hh / 2]], closed: true });
          wv.smooth(); sty(wv);
        }
      }
    }
  ];
  for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++) {
    var x = ox + c * cw, y = oy + r * ch;
    var cell = new paper.Path.Rectangle([x, y], [cw, ch]);
    cell.strokeColor = SK; cell.strokeWidth = SW * 1.5; cell.fillColor = 'white'; cell.data.fillable = true;
    tiles[(r * cols + c) % tiles.length](x, y, cw, ch);
  }
}

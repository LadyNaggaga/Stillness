import paper from 'paper';
import { S } from './state.js';
import { layers, updZoomUI, zoomToFit } from './canvas.js';
import { pushUndo, doUndo, doRedo, FillCmd, BrushCmd } from './undo.js';
import { playSound } from './audio.js';
import { toast, updateColorUI, setTool } from './ui.js';

/* ── Fill animation helpers ── */

var _reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function animateFillPulse(item) {
  var savedOp = item.opacity;
  item.opacity = 0.3;
  var start = null;
  var dur = 300;
  function step(ts) {
    if (!start) start = ts;
    var t = Math.min((ts - start) / dur, 1);
    // ease-out quad
    item.opacity = 0.3 + 0.7 * (1 - (1 - t) * (1 - t));
    if (t < 1) requestAnimationFrame(step);
    else item.opacity = savedOp;
  }
  requestAnimationFrame(step);
}

function spawnParticles(point, color) {
  var count = 6 + Math.floor(Math.random() * 3); // 6-8
  var particles = [];
  for (var i = 0; i < count; i++) {
    var angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
    var hueShift = (Math.random() - 0.5) * 20;
    var pc = color.clone();
    pc.hue += hueShift;
    var circle = new paper.Path.Circle({
      center: point,
      radius: 3,
      fillColor: pc,
      opacity: 1,
      insert: false
    });
    layers.brushLayer.addChild(circle);
    particles.push({ item: circle, angle: angle });
  }

  var start = null;
  var dur = 400;
  var speed = 25;
  function step(ts) {
    if (!start) start = ts;
    var t = Math.min((ts - start) / dur, 1);
    for (var j = 0; j < particles.length; j++) {
      var p = particles[j];
      var dist = speed * t;
      p.item.position = point.add(new paper.Point(
        Math.cos(p.angle) * dist,
        Math.sin(p.angle) * dist
      ));
      p.item.opacity = 1 - t;
      p.item.scaling = 1 - t * 0.6;
    }
    if (t < 1) {
      requestAnimationFrame(step);
    } else {
      for (var k = 0; k < particles.length; k++) particles[k].item.remove();
    }
  }
  requestAnimationFrame(step);
}

export function setupTools(cvs) {
  var paperTool = new paper.Tool();
  paperTool.minDistance = 2;

  paperTool.onMouseDown = function (ev) {
    if (S.panning) { S.panPt = ev.point; return; }

    if (S.tool === 'fill') {
      var hit = layers.patLayer.hitTest(ev.point, { fill: true, tolerance: 0 });
      if (hit && hit.item && hit.item.data.fillable) {
        var oldC = hit.item.fillColor ? hit.item.fillColor.clone() : new paper.Color('white');
        hit.item.fillColor = S.color.clone();
        pushUndo(new FillCmd(hit.item, oldC, S.color.clone()));
        playSound();
        if (!_reducedMotion.matches) {
          animateFillPulse(hit.item);
          spawnParticles(ev.point, S.color.clone());
        }
      }
    }
    else if (S.tool === 'brush') {
      layers.brushLayer.activate();
      S.brushPath = new paper.Path({
        strokeColor: S.color.clone(),
        strokeWidth: S.brushSz,
        strokeCap: 'round', strokeJoin: 'round',
        opacity: S.brushOp
      });
      S.brushPath.add(ev.point);
      layers.patLayer.activate();
    }
    else if (S.tool === 'gradient') {
      var hit = layers.patLayer.hitTest(ev.point, { fill: true, tolerance: 0 });
      if (hit && hit.item && hit.item.data.fillable) {
        S.gradItem = hit.item; S.gradPt = ev.point;
      }
    }
    else if (S.tool === 'eraser') {
      var bh = layers.brushLayer.hitTest(ev.point, { stroke: true, tolerance: 5 });
      if (bh && bh.item) {
        pushUndo(new BrushCmd(bh.item, layers.brushLayer));
        bh.item.remove(); playSound(); return;
      }
      var hit = layers.patLayer.hitTest(ev.point, { fill: true, tolerance: 0 });
      if (hit && hit.item && hit.item.data.fillable) {
        var oldC = hit.item.fillColor ? hit.item.fillColor.clone() : new paper.Color('white');
        hit.item.fillColor = new paper.Color('white');
        pushUndo(new FillCmd(hit.item, oldC, new paper.Color('white')));
        playSound();
      }
    }
    else if (S.tool === 'eyedropper') {
      var hit = paper.project.hitTest(ev.point, { fill: true, stroke: true, tolerance: 2 });
      if (hit && hit.item) {
        var c = hit.item.fillColor || hit.item.strokeColor;
        if (c && c.toCSS) {
          S.color = c.clone();
          updateColorUI();
          toast('Color picked!');
        }
      }
    }
  };

  paperTool.onMouseDrag = function (ev) {
    if (S.panning && S.panPt) {
      paper.view.center = paper.view.center.add(S.panPt.subtract(ev.point));
      S.panPt = ev.point;
      updZoomUI(); return;
    }
    if (S.tool === 'brush' && S.brushPath) {
      S.brushPath.add(ev.point);
    }
  };

  paperTool.onMouseUp = function (ev) {
    if (S.panning) { S.panPt = null; return; }

    if (S.tool === 'brush' && S.brushPath) {
      S.brushPath.simplify(2.5);
      pushUndo(new BrushCmd(S.brushPath, layers.brushLayer));
      S.brushPath = null;
      playSound();
    }
    else if (S.tool === 'gradient' && S.gradItem) {
      var item = S.gradItem, from = S.gradPt, to = ev.point;
      var oldC = item.fillColor ? item.fillColor.clone() : new paper.Color('white');
      var isRadial = S.gradType === 'radial';
      if (from.getDistance(to) < 5) {
        to = isRadial ? new paper.Point(item.bounds.bottomCenter) : new paper.Point(item.bounds.bottomCenter);
        from = isRadial ? new paper.Point(item.bounds.center) : new paper.Point(item.bounds.topCenter);
      }
      var newC = {
        gradient: { stops: [S.gc1.clone(), S.gc2.clone()], radial: isRadial },
        origin: from, destination: to
      };
      item.fillColor = newC;
      pushUndo(new FillCmd(item, oldC, item.fillColor.clone()));
      playSound();
      S.gradItem = null; S.gradPt = null;
    }
  };

  // Keyboard shortcuts
  document.addEventListener('keydown', function (e) {
    if (e.code === 'Space' && !e.repeat) { S.panning = true; cvs.style.cursor = 'grab'; e.preventDefault(); }
    if (e.key === 'f' || e.key === 'F') setTool('fill');
    if (e.key === 'b' || e.key === 'B') setTool('brush');
    if (e.key === 'g' || e.key === 'G') setTool('gradient');
    if (e.key === 'e' || e.key === 'E') setTool('eraser');
    if (e.key === 'i' || e.key === 'I') setTool('eyedropper');
    if (e.key === '0') zoomToFit();
    if (e.key === '=' || e.key === '+') { paper.view.zoom = Math.min(12, paper.view.zoom * 1.2); updZoomUI(); }
    if (e.key === '-') { paper.view.zoom = Math.max(0.2, paper.view.zoom / 1.2); updZoomUI(); }
    if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'z') { e.preventDefault(); doRedo(); }
    else if ((e.metaKey || e.ctrlKey) && e.key === 'z') { e.preventDefault(); doUndo(); }
  });
  document.addEventListener('keyup', function (e) {
    if (e.code === 'Space') { S.panning = false; cvs.style.cursor = 'crosshair'; }
  });
}

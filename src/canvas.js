import paper from 'paper';
import { SZ } from './state.js';

// Shared mutable layer references
export const layers = {
  patLayer: null,
  brushLayer: null,
};

export function setupCanvas() {
  const cvs = document.getElementById('canvas');
  paper.setup(cvs);
  layers.patLayer = paper.project.activeLayer;
  layers.brushLayer = new paper.Layer();
  layers.patLayer.activate();
  return cvs;
}

export function resizeCanvas() {
  const w = document.getElementById('canvas-wrap');
  const vw = w.clientWidth, vh = w.clientHeight;
  paper.view.viewSize = new paper.Size(vw, vh);
}

export function zoomToFit() {
  paper.view.center = new paper.Point(SZ / 2, SZ / 2);
  const fit = Math.min(
    (paper.view.viewSize.width - 40) / SZ,
    (paper.view.viewSize.height - 40) / SZ
  );
  paper.view.zoom = Math.max(0.2, fit);
  updZoomUI();
}

export function updZoomUI() {
  document.getElementById('zoom-pct').textContent = Math.round(paper.view.zoom * 100) + '%';
}

export function setupZoomPan(cvs, S) {
  var wrap = document.getElementById('canvas-wrap');

  // ── Mouse wheel zoom ──
  wrap.addEventListener('wheel', function (e) {
    e.preventDefault();
    var vp = new paper.Point(e.offsetX, e.offsetY);
    var projBefore = paper.view.viewToProject(vp);
    var factor = e.deltaY < 0 ? 1.12 : 1 / 1.12;
    paper.view.zoom = Math.max(0.2, Math.min(12, paper.view.zoom * factor));
    var projAfter = paper.view.viewToProject(vp);
    paper.view.center = paper.view.center.add(projBefore.subtract(projAfter));
    updZoomUI();
  }, { passive: false });

  // ── Touch: pinch-zoom, two-finger pan, single-tap tool ──
  var touchState = { active: false, startDist: 0, startZoom: 1, startCenter: null, lastMid: null };

  function getTouchDist(t1, t2) {
    var dx = t1.clientX - t2.clientX, dy = t1.clientY - t2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }
  function getTouchMid(t1, t2) {
    return new paper.Point((t1.clientX + t2.clientX) / 2, (t1.clientY + t2.clientY) / 2);
  }
  function viewPointFromClient(clientX, clientY) {
    var rect = cvs.getBoundingClientRect();
    return new paper.Point(clientX - rect.left, clientY - rect.top);
  }

  wrap.addEventListener('touchstart', function (e) {
    if (e.touches.length === 2) {
      e.preventDefault();
      touchState.active = true;
      touchState.startDist = getTouchDist(e.touches[0], e.touches[1]);
      touchState.startZoom = paper.view.zoom;
      touchState.startCenter = paper.view.center.clone();
      touchState.lastMid = getTouchMid(e.touches[0], e.touches[1]);
    }
  }, { passive: false });

  wrap.addEventListener('touchmove', function (e) {
    e.preventDefault();
    if (touchState.active && e.touches.length === 2) {
      // Pinch zoom
      var dist = getTouchDist(e.touches[0], e.touches[1]);
      var scale = dist / touchState.startDist;
      paper.view.zoom = Math.max(0.2, Math.min(12, touchState.startZoom * scale));

      // Two-finger pan
      var mid = getTouchMid(e.touches[0], e.touches[1]);
      var delta = viewPointFromClient(touchState.lastMid.x, touchState.lastMid.y);
      var curr = viewPointFromClient(mid.x, mid.y);
      var projDelta = paper.view.viewToProject(delta).subtract(paper.view.viewToProject(curr));
      paper.view.center = paper.view.center.add(projDelta);
      touchState.lastMid = mid;
      updZoomUI();
    }
  }, { passive: false });

  wrap.addEventListener('touchend', function (e) {
    if (e.touches.length < 2) {
      touchState.active = false;
    }
  });

  document.getElementById('zoom-in').onclick = function () {
    paper.view.zoom = Math.min(12, paper.view.zoom * 1.3);
    updZoomUI();
  };
  document.getElementById('zoom-out').onclick = function () {
    paper.view.zoom = Math.max(0.2, paper.view.zoom / 1.3);
    updZoomUI();
  };
  document.getElementById('zoom-fit').onclick = zoomToFit;
}

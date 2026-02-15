import paper from 'paper';
import LZString from 'lz-string';
import { S, SZ } from './state.js';
import { layers, zoomToFit } from './canvas.js';
import { toast, renderGallery } from './ui.js';

var GALLERY_KEY = 'stillness-gallery';
var MAX_GALLERY = 12;

export function getGalleryItems() {
  try { return JSON.parse(localStorage.getItem(GALLERY_KEY)) || []; }
  catch (e) { return []; }
}

function setGalleryItems(items) {
  localStorage.setItem(GALLERY_KEY, JSON.stringify(items));
}

export function saveToGallery(cvs) {
  var tmp = document.createElement('canvas');
  tmp.width = 150; tmp.height = 150;
  var ctx = tmp.getContext('2d');
  var oldZoom = paper.view.zoom, oldCenter = paper.view.center.clone();
  var oldSize = paper.view.viewSize.clone();
  paper.view.viewSize = new paper.Size(SZ, SZ);
  paper.view.zoom = 1;
  paper.view.center = new paper.Point(SZ / 2, SZ / 2);
  paper.view.update();
  ctx.fillStyle = 'white'; ctx.fillRect(0, 0, 150, 150);
  ctx.drawImage(cvs, 0, 0, 150, 150);
  paper.view.viewSize = oldSize;
  paper.view.zoom = oldZoom;
  paper.view.center = oldCenter;
  paper.view.update();
  var items = getGalleryItems();
  var entry = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    thumbnail: tmp.toDataURL('image/png'),
    projectJSON: paper.project.exportJSON(),
    patternIndex: S.pat,
    date: new Date().toISOString()
  };
  items.push(entry);
  if (items.length > MAX_GALLERY) items = items.slice(items.length - MAX_GALLERY);
  setGalleryItems(items);
  toast('Saved to gallery!');
}

export function loadFromGallery(id) {
  var items = getGalleryItems();
  var item = items.find(function (x) { return x.id === id; });
  if (!item) { toast('Gallery item not found'); return; }
  try {
    paper.project.clear();
    paper.project.importJSON(item.projectJSON);
    layers.patLayer = paper.project.layers[0] || paper.project.activeLayer;
    layers.brushLayer = paper.project.layers[1] || new paper.Layer();
    layers.patLayer.activate();
    S.pat = item.patternIndex || 0;
    document.querySelectorAll('.pbtn').forEach(function (b, i) { b.classList.toggle('active', i === S.pat); });
    zoomToFit();
    toast('Loaded from gallery!');
  } catch (e) { toast('Load failed'); }
}

export function deleteFromGallery(id) {
  var items = getGalleryItems().filter(function (x) { return x.id !== id; });
  setGalleryItems(items);
}

export function setupExport(cvs) {
  document.getElementById('x-png').onclick = function () {
    var exp = document.createElement('canvas');
    exp.width = SZ; exp.height = SZ;
    var expCtx = exp.getContext('2d');
    expCtx.fillStyle = 'white'; expCtx.fillRect(0, 0, SZ, SZ);
    var oldZoom = paper.view.zoom, oldCenter = paper.view.center.clone();
    var oldSize = paper.view.viewSize.clone();
    paper.view.viewSize = new paper.Size(SZ, SZ);
    paper.view.zoom = 1;
    paper.view.center = new paper.Point(SZ / 2, SZ / 2);
    paper.view.update();
    expCtx.drawImage(cvs, 0, 0, SZ, SZ);
    paper.view.viewSize = oldSize;
    paper.view.zoom = oldZoom;
    paper.view.center = oldCenter;
    paper.view.update();
    var a = document.createElement('a');
    a.download = 'stillness-coloring.png';
    a.href = exp.toDataURL('image/png');
    a.click();
    toast('PNG saved!');
  };

  document.getElementById('x-svg').onclick = function () {
    var svg = paper.project.exportSVG({ asString: true });
    var blob = new Blob([svg], { type: 'image/svg+xml' });
    var a = document.createElement('a');
    a.download = 'stillness-coloring.svg';
    a.href = URL.createObjectURL(blob);
    a.click();
    toast('SVG saved!');
  };

  document.getElementById('x-save').onclick = function () {
    try {
      var json = paper.project.exportJSON();
      localStorage.setItem('stillness-save', json);
      localStorage.setItem('stillness-pat', S.pat);
      toast('Progress saved!');
    } catch (e) { toast('Save failed'); }
  };

  document.getElementById('x-load').onclick = function () {
    try {
      var json = localStorage.getItem('stillness-save');
      if (!json) { toast('No saved progress'); return; }
      paper.project.clear();
      paper.project.importJSON(json);
      layers.patLayer = paper.project.layers[0] || paper.project.activeLayer;
      layers.brushLayer = paper.project.layers[1] || new paper.Layer();
      layers.patLayer.activate();
      S.pat = +(localStorage.getItem('stillness-pat') || 0);
      document.querySelectorAll('.pbtn').forEach(function (b, i) { b.classList.toggle('active', i === S.pat); });
      zoomToFit();
      toast('Progress loaded!');
    } catch (e) { toast('Load failed'); }
  };

  document.getElementById('save-gallery').onclick = function () {
    saveToGallery(cvs);
    renderGallery();
  };
}

function renderToBlob(cvs) {
  return new Promise(function (resolve) {
    var exp = document.createElement('canvas');
    exp.width = SZ; exp.height = SZ;
    var expCtx = exp.getContext('2d');
    expCtx.fillStyle = 'white'; expCtx.fillRect(0, 0, SZ, SZ);
    var oldZoom = paper.view.zoom, oldCenter = paper.view.center.clone();
    var oldSize = paper.view.viewSize.clone();
    paper.view.viewSize = new paper.Size(SZ, SZ);
    paper.view.zoom = 1;
    paper.view.center = new paper.Point(SZ / 2, SZ / 2);
    paper.view.update();
    expCtx.drawImage(cvs, 0, 0, SZ, SZ);
    paper.view.viewSize = oldSize;
    paper.view.zoom = oldZoom;
    paper.view.center = oldCenter;
    paper.view.update();
    exp.toBlob(function (blob) { resolve(blob); }, 'image/png');
  });
}

export function shareAsImage(cvs) {
  renderToBlob(cvs).then(function (blob) {
    var file = new File([blob], 'stillness-coloring.png', { type: 'image/png' });
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      navigator.share({ files: [file], title: 'My Stillness Coloring' }).then(function () {
        toast('Shared!');
      }).catch(function () {
        toast('Share cancelled');
      });
    } else if (navigator.clipboard && typeof ClipboardItem !== 'undefined') {
      navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]).then(function () {
        toast('Image copied to clipboard!');
      }).catch(function () {
        downloadBlob(blob);
      });
    } else {
      downloadBlob(blob);
    }
  });
}

function downloadBlob(blob) {
  var a = document.createElement('a');
  a.download = 'stillness-coloring.png';
  a.href = URL.createObjectURL(blob);
  a.click();
  toast('PNG saved!');
}

export function shareAsUrl() {
  try {
    var json = paper.project.exportJSON();
    var compressed = LZString.compressToEncodedURIComponent(json);
    var url = window.location.origin + window.location.pathname + '#art=' + compressed;
    if (url.length > 8000) {
      toast('Artwork too complex for URL sharing, try image instead');
      return;
    }
    navigator.clipboard.writeText(url).then(function () {
      toast('Link copied to clipboard!');
    }).catch(function () {
      toast('Could not copy link');
    });
  } catch (e) { toast('Share failed'); }
}

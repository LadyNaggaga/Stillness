import paper from 'paper';
import { S, PALETTE, THEMES, setPalette, PAT_NAMES, SND_NAMES } from './state.js';
import { layers, zoomToFit } from './canvas.js';
import { undo, redo, updUndoUI } from './undo.js';
import { generators } from './patterns/index.js';
import { playSound } from './audio.js';
import { getGalleryItems, loadFromGallery, deleteFromGallery } from './export.js';

var toastTimer = null;

export function toast(msg) {
  var t = document.getElementById('toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.classList.remove('show'); }, 1500);
}

export function updateColorUI() {
  var css = S.color.toCSS ? S.color.toCSS(true) : '#e07a5f';
  document.querySelectorAll('.cs').forEach(function (el) {
    el.classList.toggle('active', el.dataset.c === css);
  });
  document.getElementById('gc1').style.background = S.gc1.toCSS(true);
  document.getElementById('gc2').style.background = S.gc2.toCSS(true);
}

export function setTool(t) {
  S.tool = t;
  document.querySelectorAll('[data-tool]').forEach(function (b) { b.classList.toggle('active', b.dataset.tool === t); });
  document.getElementById('brush-cfg').style.display = t === 'brush' ? 'block' : 'none';
  document.getElementById('grad-cfg').style.display = t === 'gradient' ? 'block' : 'none';
  var cvs = document.getElementById('canvas');
  cvs.style.cursor = t === 'eyedropper' ? 'crosshair' : 'crosshair';
}

function setColorFromHSL() {
  var h = +document.getElementById('hsl-h').value;
  var s = +document.getElementById('hsl-s').value;
  var l = +document.getElementById('hsl-l').value;
  document.getElementById('hh-v').textContent = h;
  document.getElementById('hs-v').textContent = s;
  document.getElementById('hl-v').textContent = l;
  var css = 'hsl(' + h + ',' + s + '%,' + l + '%)';
  document.getElementById('hsl-preview').style.background = css;
  S.color = new paper.Color(css);
  if (S.gcSel === 1) S.gc1 = S.color.clone(); else S.gc2 = S.color.clone();
  updateColorUI();
}

export function loadPattern(idx) {
  paper.project.clear();
  layers.patLayer = paper.project.activeLayer;
  layers.brushLayer = new paper.Layer();
  layers.patLayer.activate();
  generators[idx]();
  S.pat = idx;
  undo.length = 0; redo.length = 0; updUndoUI();
  zoomToFit();
  document.querySelectorAll('.pbtn').forEach(function (b, i) { b.classList.toggle('active', i === idx); });
}

function buildColorGrid() {
  var cgrid = document.getElementById('col-grid');
  cgrid.innerHTML = '';
  PALETTE.forEach(function (c) {
    var d = document.createElement('div'); d.className = 'cs'; d.dataset.c = c;
    d.style.background = c;
    d.setAttribute('tabindex', '0');
    d.setAttribute('role', 'button');
    d.setAttribute('aria-label', 'Color ' + c);
    var selectColor = function () {
      S.color = new paper.Color(c);
      if (S.gcSel === 1) S.gc1 = S.color.clone(); else S.gc2 = S.color.clone();
      updateColorUI();
    };
    d.onclick = selectColor;
    d.onkeydown = function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectColor(); }
    };
    cgrid.appendChild(d);
  });
}

export function setupUI() {
  // Hamburger sidebar toggle
  var hamburger = document.getElementById('hamburger-btn');
  var sidebar = document.getElementById('sidebar');
  var overlay = document.getElementById('sidebar-overlay');
  function toggleSidebar() {
    var open = sidebar.classList.toggle('open');
    overlay.classList.toggle('show', open);
  }
  hamburger.addEventListener('click', toggleSidebar);
  overlay.addEventListener('click', toggleSidebar);

  // Build theme selector
  var tgrid = document.getElementById('theme-grid');
  Object.keys(THEMES).forEach(function (name) {
    var b = document.createElement('button');
    b.className = 'sbtn' + (name === S.theme ? ' active' : '');
    b.textContent = name;
    b.onclick = function () {
      S.theme = name;
      setPalette(THEMES[name]);
      S.color = new paper.Color(PALETTE[0]);
      S.gc1 = S.color.clone();
      S.gc2 = new paper.Color(PALETTE[1] || PALETTE[0]);
      buildColorGrid();
      updateColorUI();
      tgrid.querySelectorAll('.sbtn').forEach(function (x) { x.classList.toggle('active', x.textContent === name); });
      toast('Theme: ' + name);
    };
    tgrid.appendChild(b);
  });

  // Build color grid
  buildColorGrid();

  // HSL sliders
  ['hsl-h', 'hsl-s', 'hsl-l'].forEach(function (id) {
    document.getElementById(id).addEventListener('input', setColorFromHSL);
  });
  document.getElementById('hsl-preview').onclick = function () {
    setColorFromHSL();
    toast('Custom color applied');
  };

  // Tool selection buttons
  document.querySelectorAll('[data-tool]').forEach(function (b) {
    b.onclick = function () { setTool(b.dataset.tool); };
  });

  // Brush settings
  document.getElementById('b-size').oninput = function () { S.brushSz = +this.value; document.getElementById('bs-v').textContent = this.value; };
  document.getElementById('b-opa').oninput = function () { S.brushOp = this.value / 100; document.getElementById('bo-v').textContent = this.value; };

  // Gradient settings
  document.querySelectorAll('[data-gt]').forEach(function (b) {
    b.onclick = function () {
      S.gradType = b.dataset.gt;
      document.querySelectorAll('[data-gt]').forEach(function (x) { x.classList.toggle('active', x.dataset.gt === S.gradType); });
    };
  });
  document.getElementById('gc1').onclick = function () { S.gcSel = 1; document.getElementById('gc1').classList.add('active'); document.getElementById('gc2').classList.remove('active'); };
  document.getElementById('gc2').onclick = function () { S.gcSel = 2; document.getElementById('gc2').classList.add('active'); document.getElementById('gc1').classList.remove('active'); };

  // Pattern buttons
  var pgrid = document.getElementById('pat-grid');
  PAT_NAMES.forEach(function (name, i) {
    var b = document.createElement('button'); b.className = 'pbtn' + (i === 0 ? ' active' : ''); b.textContent = name;
    b.onclick = function () { loadPattern(i); };
    pgrid.appendChild(b);
  });

  // Sound buttons
  var sgrid = document.getElementById('snd-grid');
  SND_NAMES.forEach(function (name, i) {
    var b = document.createElement('button'); b.className = 'sbtn' + (i === 0 ? ' active' : ''); b.textContent = name;
    b.onclick = function () {
      S.snd = i;
      document.querySelectorAll('.sbtn').forEach(function (x, j) {
        if (x.parentElement === sgrid) x.classList.toggle('active', j === i);
      });
      playSound();
    };
    sgrid.appendChild(b);
  });
  document.getElementById('vol').oninput = function () { S.vol = this.value / 100; document.getElementById('vol-v').textContent = this.value; };

  // Initialize HSL preview
  setColorFromHSL();
  updateColorUI();
  renderGallery();
}

export function renderGallery() {
  var grid = document.getElementById('gallery-grid');
  grid.innerHTML = '';
  getGalleryItems().forEach(function (item) {
    var wrap = document.createElement('div'); wrap.className = 'gallery-item';
    var img = document.createElement('img'); img.className = 'gallery-thumb';
    img.src = item.thumbnail; img.title = new Date(item.date).toLocaleDateString();
    img.onclick = function () { loadFromGallery(item.id); };
    var del = document.createElement('button'); del.className = 'gallery-del';
    del.textContent = '\u00d7';
    del.onclick = function (e) { e.stopPropagation(); deleteFromGallery(item.id); renderGallery(); };
    wrap.appendChild(img); wrap.appendChild(del);
    grid.appendChild(wrap);
  });
}

import paper from 'paper';
import './styles/main.css';
import './styles/toolbar.css';
import './styles/sidebar.css';
import './styles/onboarding.css';
import './styles/mobile.css';
import { S, PALETTE } from './state.js';
import { setupCanvas, resizeCanvas, zoomToFit, setupZoomPan, layers } from './canvas.js';
import { updUndoUI, doUndo, doRedo } from './undo.js';
import { setupUI, loadPattern } from './ui.js';
import { setupTools } from './tools.js';
import { setupExport, shareAsImage, shareAsUrl } from './export.js';
import { setupOnboarding } from './onboarding.js';
import LZString from 'lz-string';

// Paper.js setup
const cvs = setupCanvas();
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Initialize default colors
S.color = new paper.Color(PALETTE[0]);
S.gc1 = new paper.Color(PALETTE[0]);
S.gc2 = new paper.Color(PALETTE[4]);

// Wire up UI
setupUI();
setupTools(cvs);
setupZoomPan(cvs, S);
setupExport(cvs);

// Undo/redo toolbar buttons
document.getElementById('undo-btn').onclick = doUndo;
document.getElementById('redo-btn').onclick = doRedo;

// Share buttons
document.getElementById('x-share-img').onclick = function () { shareAsImage(cvs); };
document.getElementById('x-share-url').onclick = shareAsUrl;

// Init
cvs.style.cursor = 'crosshair';
updUndoUI();

// Load shared artwork from URL hash, or default pattern
(function () {
  var hash = window.location.hash;
  if (hash && hash.indexOf('#art=') === 0) {
    try {
      var compressed = hash.slice(5);
      var json = LZString.decompressFromEncodedURIComponent(compressed);
      if (json) {
        paper.project.clear();
        paper.project.importJSON(json);
        layers.patLayer = paper.project.layers[0] || paper.project.activeLayer;
        layers.brushLayer = paper.project.layers[1] || new paper.Layer();
        layers.patLayer.activate();
        zoomToFit();
        history.replaceState(null, '', window.location.pathname);
      } else {
        loadPattern(0);
      }
    } catch (e) {
      loadPattern(0);
    }
  } else {
    loadPattern(0);
  }
})();

setupOnboarding();

export const undo = [];
export const redo = [];
const MAX_UNDO = 50;

export function pushUndo(cmd) {
  undo.push(cmd);
  if (undo.length > MAX_UNDO) undo.shift();
  redo.length = 0;
  updUndoUI();
}

export function doUndo() {
  if (!undo.length) return;
  const c = undo.pop();
  c.undo();
  redo.push(c);
  updUndoUI();
}

export function doRedo() {
  if (!redo.length) return;
  const c = redo.pop();
  c.redo();
  undo.push(c);
  updUndoUI();
}

export function updUndoUI() {
  document.getElementById('undo-btn').style.opacity = undo.length ? 1 : 0.4;
  document.getElementById('redo-btn').style.opacity = redo.length ? 1 : 0.4;
}

export class FillCmd {
  constructor(item, oldC, newC) { this.item = item; this.old = oldC; this.new_ = newC; }
  undo() { this.item.fillColor = this.old; }
  redo() { this.item.fillColor = this.new_; }
}

export class BrushCmd {
  constructor(path, layer) { this.p = path; this.layer = layer; this.removed = false; }
  undo() { this.p.remove(); this.removed = true; }
  redo() { this.layer.addChild(this.p); this.removed = false; }
}

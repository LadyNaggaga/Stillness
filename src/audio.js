import { S, SND_NAMES } from './state.js';

var sfxCtx = null;

export function getAudioCtx() {
  if (!sfxCtx) sfxCtx = new (window.AudioContext || window.webkitAudioContext)();
  return sfxCtx;
}

export const SFX = {
  Chimes: function () {
    var ctx = getAudioCtx(), now = ctx.currentTime, gain = ctx.createGain();
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(S.vol * .15, now);
    gain.gain.exponentialRampToValueAtTime(.001, now + .7);
    [523.25, 659.25, 783.99].forEach(function (f, i) {
      var o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = f;
      o.connect(gain); o.start(now + i * .08); o.stop(now + .7);
    });
  },
  Wind: function () {
    var ctx = getAudioCtx(), now = ctx.currentTime;
    var buf = ctx.createBuffer(1, ctx.sampleRate * .4, ctx.sampleRate), d = buf.getChannelData(0);
    for (var i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1);
    var src = ctx.createBufferSource(); src.buffer = buf;
    var filt = ctx.createBiquadFilter(); filt.type = 'bandpass'; filt.frequency.value = 600; filt.Q.value = .8;
    var g = ctx.createGain(); g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(S.vol * .12, now + .08);
    g.gain.exponentialRampToValueAtTime(.001, now + .4);
    src.connect(filt); filt.connect(g); g.connect(ctx.destination);
    src.start(now); src.stop(now + .4);
  },
  Birds: function () {
    var ctx = getAudioCtx(), now = ctx.currentTime;
    [0, .1, .22].forEach(function (t) {
      var o = ctx.createOscillator(); o.type = 'sine';
      o.frequency.setValueAtTime(2200 + Math.random() * 800, now + t);
      o.frequency.exponentialRampToValueAtTime(1400 + Math.random() * 400, now + t + .08);
      var g = ctx.createGain();
      g.gain.setValueAtTime(S.vol * .1, now + t);
      g.gain.exponentialRampToValueAtTime(.001, now + t + .12);
      o.connect(g); g.connect(ctx.destination); o.start(now + t); o.stop(now + t + .12);
    });
  },
  Ocean: function () {
    var ctx = getAudioCtx(), now = ctx.currentTime;
    var buf = ctx.createBuffer(1, ctx.sampleRate * .6, ctx.sampleRate), d = buf.getChannelData(0);
    for (var i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1);
    var src = ctx.createBufferSource(); src.buffer = buf;
    var lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 400;
    var g = ctx.createGain(); g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(S.vol * .15, now + .15);
    g.gain.exponentialRampToValueAtTime(.001, now + .6);
    src.connect(lp); lp.connect(g); g.connect(ctx.destination);
    src.start(now); src.stop(now + .6);
  }
};

export function playSound() {
  try { SFX[SND_NAMES[S.snd]](); } catch (e) { }
}

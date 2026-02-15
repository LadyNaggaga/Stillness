import { S, SND_NAMES } from './state.js';

var sfxCtx = null;

export function getAudioCtx() {
  if (!sfxCtx) sfxCtx = new (window.AudioContext || window.webkitAudioContext)();
  return sfxCtx;
}

// Shared delay-based reverb tail for warmth
function addReverb(ctx, source, now, duration, wet) {
  var dry = ctx.createGain();
  dry.gain.value = 1;
  source.connect(dry);
  dry.connect(ctx.destination);

  var delays = [0.03, 0.06, 0.11];
  delays.forEach(function (t) {
    var del = ctx.createDelay(0.2);
    del.delayTime.value = t;
    var fb = ctx.createGain();
    fb.gain.value = 0.2;
    var g = ctx.createGain();
    g.gain.setValueAtTime(wet, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + duration);
    source.connect(del);
    del.connect(fb);
    fb.connect(del);
    del.connect(g);
    g.connect(ctx.destination);
  });
}

export const SFX = {
  Chimes: function () {
    var ctx = getAudioCtx(), now = ctx.currentTime;
    var master = ctx.createGain();
    master.gain.setValueAtTime(S.vol * 0.14, now);
    master.gain.exponentialRampToValueAtTime(0.001, now + 0.75);
    var lp = ctx.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.value = 4000; lp.Q.value = 0.5;
    lp.connect(master);
    addReverb(ctx, master, now, 0.75, 0.08);

    [523.25, 659.25, 783.99, 1046.5].forEach(function (f, i) {
      var detune = (Math.random() - 0.5) * 10;
      var delay = i * 0.07 + Math.random() * 0.01;
      // Layered pair with slight detuning for chorus warmth
      [0, 3, -3].forEach(function (d) {
        var o = ctx.createOscillator();
        o.type = i < 2 ? 'sine' : 'triangle';
        o.frequency.value = f;
        o.detune.value = detune + d;
        o.connect(lp);
        o.start(now + delay);
        o.stop(now + 0.75);
      });
    });
  },

  Wind: function () {
    var ctx = getAudioCtx(), now = ctx.currentTime;
    var dur = 0.5;
    // Two noise layers at different bands for depth
    [{ freq: 500, Q: 0.6, vol: 0.10 }, { freq: 900, Q: 1.0, vol: 0.05 }].forEach(function (cfg) {
      var buf = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate);
      var d = buf.getChannelData(0);
      // Shaped noise: slight low-freq modulation for organic feel
      for (var i = 0; i < d.length; i++) {
        var mod = 0.7 + 0.3 * Math.sin(i / (ctx.sampleRate * 0.05));
        d[i] = (Math.random() * 2 - 1) * mod;
      }
      var src = ctx.createBufferSource(); src.buffer = buf;
      var bp = ctx.createBiquadFilter();
      bp.type = 'bandpass'; bp.frequency.value = cfg.freq; bp.Q.value = cfg.Q;
      var lp = ctx.createBiquadFilter();
      lp.type = 'lowpass'; lp.frequency.value = 2000;
      var g = ctx.createGain();
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(S.vol * cfg.vol, now + 0.06);
      g.gain.setValueAtTime(S.vol * cfg.vol, now + 0.15);
      g.gain.exponentialRampToValueAtTime(0.001, now + dur);
      src.connect(bp); bp.connect(lp); lp.connect(g);
      addReverb(ctx, g, now, dur, 0.05);
      src.start(now); src.stop(now + dur);
    });
  },

  Birds: function () {
    var ctx = getAudioCtx(), now = ctx.currentTime;
    var master = ctx.createGain();
    addReverb(ctx, master, now, 0.5, 0.06);

    [0, 0.09, 0.2].forEach(function (t) {
      var baseFreq = 2000 + Math.random() * 1000;
      var endFreq = 1200 + Math.random() * 600;
      var onset = t + Math.random() * 0.015;
      var noteDur = 0.1 + Math.random() * 0.04;
      // Two oscillators per chirp for richer timbre
      ['sine', 'triangle'].forEach(function (type, li) {
        var o = ctx.createOscillator();
        o.type = type;
        o.frequency.setValueAtTime(baseFreq * (li === 1 ? 2.01 : 1), now + onset);
        o.frequency.exponentialRampToValueAtTime(endFreq * (li === 1 ? 2.01 : 1), now + onset + noteDur);
        var g = ctx.createGain();
        var vol = li === 0 ? S.vol * 0.09 : S.vol * 0.03;
        g.gain.setValueAtTime(0, now + onset);
        g.gain.linearRampToValueAtTime(vol, now + onset + 0.008);
        g.gain.exponentialRampToValueAtTime(0.001, now + onset + noteDur);
        o.connect(g); g.connect(master);
        o.start(now + onset); o.stop(now + onset + noteDur);
      });
    });
  },

  Ocean: function () {
    var ctx = getAudioCtx(), now = ctx.currentTime;
    var dur = 0.7;
    // Two noise bands: low rumble + mid wash
    [{ freq: 300, Q: 0.4, vol: 0.12 }, { freq: 800, Q: 0.6, vol: 0.04 }].forEach(function (cfg) {
      var buf = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate);
      var d = buf.getChannelData(0);
      for (var i = 0; i < d.length; i++) {
        var env = Math.sin((i / d.length) * Math.PI);
        d[i] = (Math.random() * 2 - 1) * env;
      }
      var src = ctx.createBufferSource(); src.buffer = buf;
      var lp = ctx.createBiquadFilter();
      lp.type = 'lowpass'; lp.frequency.value = cfg.freq; lp.Q.value = cfg.Q;
      var hp = ctx.createBiquadFilter();
      hp.type = 'highpass'; hp.frequency.value = 60;
      var g = ctx.createGain();
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(S.vol * cfg.vol, now + 0.12);
      g.gain.setValueAtTime(S.vol * cfg.vol, now + 0.25);
      g.gain.exponentialRampToValueAtTime(0.001, now + dur);
      src.connect(lp); lp.connect(hp); hp.connect(g);
      addReverb(ctx, g, now, dur, 0.06);
      src.start(now); src.stop(now + dur);
    });
  },

  Rain: function () {
    var ctx = getAudioCtx(), now = ctx.currentTime;
    var master = ctx.createGain();
    addReverb(ctx, master, now, 0.6, 0.1);
    // 4-5 tiny raindrop plucks with randomized timing and pitch
    var count = 4 + Math.floor(Math.random() * 2);
    for (var i = 0; i < count; i++) {
      var t = Math.random() * 0.15;
      var freq = 3000 + Math.random() * 3000;
      var dur = 0.04 + Math.random() * 0.04;

      var buf = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * dur), ctx.sampleRate);
      var d = buf.getChannelData(0);
      for (var j = 0; j < d.length; j++) {
        d[j] = (Math.random() * 2 - 1) * Math.exp(-j / (d.length * 0.15));
      }
      var src = ctx.createBufferSource(); src.buffer = buf;
      var bp = ctx.createBiquadFilter();
      bp.type = 'bandpass'; bp.frequency.value = freq; bp.Q.value = 8;
      var g = ctx.createGain();
      g.gain.setValueAtTime(S.vol * (0.08 + Math.random() * 0.06), now + t);
      g.gain.exponentialRampToValueAtTime(0.001, now + t + dur + 0.1);
      src.connect(bp); bp.connect(g); g.connect(master);
      src.start(now + t); src.stop(now + t + dur + 0.12);
    }
  },

  Crystal: function () {
    var ctx = getAudioCtx(), now = ctx.currentTime;
    var dur = 0.75;
    var master = ctx.createGain();
    master.gain.setValueAtTime(S.vol * 0.12, now);
    master.gain.exponentialRampToValueAtTime(0.001, now + dur);
    addReverb(ctx, master, now, dur, 0.12);

    var base = 1200 + Math.random() * 200;
    // Fundamental + harmonics with detuning for shimmer
    [1, 2.0, 3.0, 5.04].forEach(function (ratio, i) {
      var vol = [1, 0.5, 0.3, 0.15][i];
      [-4, 0, 4].forEach(function (det) {
        var o = ctx.createOscillator();
        o.type = 'sine';
        o.frequency.value = base * ratio;
        o.detune.value = det + (Math.random() - 0.5) * 3;
        var g = ctx.createGain();
        g.gain.setValueAtTime(vol * 0.35, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + dur * (1 - i * 0.15));
        o.connect(g); g.connect(master);
        o.start(now); o.stop(now + dur);
      });
    });
  },

  Harp: function () {
    var ctx = getAudioCtx(), now = ctx.currentTime;
    var dur = 0.5;
    var master = ctx.createGain();
    var lp = ctx.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.value = 5000; lp.Q.value = 0.3;
    lp.connect(master);
    addReverb(ctx, master, now, dur, 0.08);

    var base = 392 + Math.random() * 20;
    // Plucked string: sharp attack, quick exponential decay, harmonics
    [1, 2.0, 3.0, 4.0].forEach(function (ratio, i) {
      var amp = [1, 0.45, 0.2, 0.08][i];
      var detune = (Math.random() - 0.5) * 4;
      var o = ctx.createOscillator();
      o.type = i === 0 ? 'triangle' : 'sine';
      o.frequency.value = base * ratio;
      o.detune.value = detune;
      var g = ctx.createGain();
      // Sharp pluck attack
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(S.vol * 0.14 * amp, now + 0.004);
      g.gain.exponentialRampToValueAtTime(0.001, now + dur * (1 - i * 0.12));
      o.connect(g); g.connect(lp);
      o.start(now); o.stop(now + dur);
    });
  },

  'Zen Bowl': function () {
    var ctx = getAudioCtx(), now = ctx.currentTime;
    var dur = 0.8;
    var master = ctx.createGain();
    master.gain.setValueAtTime(S.vol * 0.13, now);
    master.gain.setValueAtTime(S.vol * 0.13, now + 0.2);
    master.gain.exponentialRampToValueAtTime(0.001, now + dur);
    addReverb(ctx, master, now, dur, 0.1);

    var base = 220 + Math.random() * 15;
    // Singing bowl: fundamental + inharmonic partials with beating
    [1, 2.71, 4.58, 6.3].forEach(function (ratio, i) {
      var amp = [1, 0.4, 0.25, 0.1][i];
      [-2, 0, 2].forEach(function (det) {
        var o = ctx.createOscillator();
        o.type = 'sine';
        o.frequency.value = base * ratio;
        o.detune.value = det + (Math.random() - 0.5) * 2;
        var g = ctx.createGain();
        // Soft attack like striking a bowl
        g.gain.setValueAtTime(0, now);
        g.gain.linearRampToValueAtTime(amp * 0.35, now + 0.012);
        g.gain.exponentialRampToValueAtTime(0.001, now + dur * (1 - i * 0.1));
        o.connect(g); g.connect(master);
        o.start(now); o.stop(now + dur);
      });
    });
  }
};

export function playSound() {
  try { SFX[SND_NAMES[S.snd]](); } catch (e) { }
}

const STORAGE_KEY = 'stillness-onboarded';

const STEPS = [
  {
    html: `
      <span class="onb-hero-emoji">🌿</span>
      <h2>Welcome to Stillness</h2>
      <p class="onb-tagline">A quiet place for your mind</p>
      <p>Unwind with beautiful patterns and colors. Fill, paint, and create — at your own pace, with no pressure.</p>
    `,
  },
  {
    html: `
      <h2>How to Color</h2>
      <p>Pick a pattern, choose a color, and click to fill</p>
      <div class="onb-icons">
        <div class="onb-icon-item"><span class="onb-emoji">🎨</span><span>Pick a pattern</span></div>
        <div class="onb-icon-item"><span class="onb-emoji">🖌️</span><span>Choose a color</span></div>
        <div class="onb-icon-item"><span class="onb-emoji">✨</span><span>Click to fill</span></div>
      </div>
    `,
  },
  {
    html: `
      <h2>Explore &amp; Create</h2>
      <p>Try different tools, ambient sounds, and export your artwork when you're ready.</p>
      <div class="onb-icons">
        <div class="onb-icon-item"><span class="onb-emoji">🖊️</span><span>Brush &amp; gradient</span></div>
        <div class="onb-icon-item"><span class="onb-emoji">🔊</span><span>Ambient sounds</span></div>
        <div class="onb-icon-item"><span class="onb-emoji">💾</span><span>Export your art</span></div>
      </div>
    `,
    last: true,
  },
];

function buildOverlay() {
  var overlay = document.createElement('div');
  overlay.className = 'onboarding-overlay';

  var stepsHTML = STEPS.map(function (s, i) {
    return '<div class="onboarding-step' + (i === 0 ? ' active' : '') + '" data-step="' + i + '">' + s.html + '</div>';
  }).join('');

  var dotsHTML = STEPS.map(function (_, i) {
    return '<span class="onb-dot' + (i === 0 ? ' active' : '') + '" data-dot="' + i + '"></span>';
  }).join('');

  overlay.innerHTML =
    '<div class="onboarding-card">' +
      stepsHTML +
      '<div class="onb-nav">' +
        '<button class="onb-skip">Skip</button>' +
        '<div class="onb-dots">' + dotsHTML + '</div>' +
        '<button class="onb-next">Next</button>' +
      '</div>' +
    '</div>';

  return overlay;
}

export function setupOnboarding() {
  if (localStorage.getItem(STORAGE_KEY)) return;

  var current = 0;
  var overlay = buildOverlay();
  document.body.appendChild(overlay);

  var steps = overlay.querySelectorAll('.onboarding-step');
  var dots = overlay.querySelectorAll('.onb-dot');
  var nextBtn = overlay.querySelector('.onb-next');
  var skipBtn = overlay.querySelector('.onb-skip');

  function goTo(idx) {
    steps.forEach(function (s) { s.classList.remove('active'); });
    dots.forEach(function (d) { d.classList.remove('active'); });
    steps[idx].classList.add('active');
    dots[idx].classList.add('active');
    current = idx;
    nextBtn.textContent = STEPS[idx].last ? 'Start Coloring' : 'Next';
  }

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, '1');
    overlay.classList.add('fade-out');
    overlay.addEventListener('animationend', function () {
      overlay.remove();
    });
    // Fallback for prefers-reduced-motion (no animation fires)
    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) overlay.remove();
  }

  nextBtn.addEventListener('click', function () {
    if (current < STEPS.length - 1) {
      goTo(current + 1);
    } else {
      dismiss();
    }
  });

  skipBtn.addEventListener('click', dismiss);

  // Close on overlay background click
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) dismiss();
  });
}

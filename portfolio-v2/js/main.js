/* ===========================
   Custom Cursor — warm gold
   =========================== */
const cursor = document.createElement('div');
cursor.id = 'cursor';
document.body.appendChild(cursor);

let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animateCursor() {
  const lerp = 0.12;
  cursorX += (mouseX - cursorX) * lerp;
  cursorY += (mouseY - cursorY) * lerp;
  cursor.style.left = cursorX + 'px';
  cursor.style.top = cursorY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

/* ===========================
   Scroll Reveal — Intersection Observer
   =========================== */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.addEventListener('DOMContentLoaded', () => {
  // Observe all reveal elements
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
});

/* ===========================
   Language Switch
   =========================== */
let currentLang = localStorage.getItem('lang') || 'en';

function applyLang(lang) {
  document.querySelectorAll('[data-en]').forEach(el => {
    if (el.classList.contains('char-hover-ready')) return;
    el.textContent = lang === 'zh' ? el.dataset.zh : el.dataset.en;
  });

  const toggle = document.querySelector('.lang-toggle');
  if (toggle) {
    const enSpan = toggle.querySelector('.l-en');
    const zhSpan = toggle.querySelector('.l-zh');
    if (enSpan && zhSpan) {
      enSpan.style.opacity = lang === 'en' ? '1' : '0.35';
      zhSpan.style.opacity = lang === 'zh' ? '1' : '0.35';
    }
  }

  document.documentElement.lang = lang === 'zh' ? 'zh' : 'en';
}

document.addEventListener('DOMContentLoaded', () => {

  applyLang(currentLang);

  /* ===========================
     Char Hover Effect (reusable)
     =========================== */
  const SYMBOLS = ['■', '●', '▲', '◆', '★', '✦', '×', '▶', '◇', '○'];
  const COLORS = [
    '#ff3300', '#ff3300', '#ff3300', '#cc2900',
    '#000000', '#333333', '#666666', '#999999',
    '#ff5533', '#ff4422', '#dd2200', '#ee3311',
  ];

  function setupCharHover(el, text) {
    el.innerHTML = text.split('').map(ch => {
      if (ch === ' ') return '<span class="logo-char is-space"> </span>';
      return `<span class="logo-char" data-original="${ch}">${ch}</span>`;
    }).join('');
    el.classList.add('char-hover-ready');

    const timers = new Map();

    el.querySelectorAll('.logo-char:not(.is-space)').forEach(span => {
      span.addEventListener('mouseenter', () => {
        if (timers.has(span)) { clearTimeout(timers.get(span)); timers.delete(span); }

        const sym = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
        const col = COLORS[Math.floor(Math.random() * COLORS.length)];
        const rot = (Math.random() - 0.5) * 24;

        span.style.setProperty('--rot', rot + 'deg');
        span.textContent = sym;
        span.style.color = col;
        span.classList.remove('is-returning');
        span.classList.add('is-symbol');

        const delay = 700 + Math.random() * 200;
        const t = setTimeout(() => {
          span.textContent = span.dataset.original;
          span.style.color = '';
          span.classList.remove('is-symbol');
          span.classList.add('is-returning');
          span.addEventListener('animationend', () => {
            span.classList.remove('is-returning');
          }, { once: true });
          timers.delete(span);
        }, delay);
        timers.set(span, t);
      });
    });
  }

  function setupLogoHovers() {
    document.querySelectorAll('[data-logo-hover]').forEach(el => {
      const text = el.dataset[currentLang] || el.dataset.en || el.textContent.trim() || 'Andrea Cheng';
      setupCharHover(el, text);
    });
  }
  setupLogoHovers();

  function setupHeadingHovers() {
    document.querySelectorAll('.text-section h3').forEach(el => {
      const text = el.dataset[currentLang] || el.dataset.en || el.textContent;
      setupCharHover(el, text);
    });
  }
  setupHeadingHovers();

  // Entry blink hint
  function blinkHint() {
    document.querySelectorAll('.char-hover-ready').forEach(el => {
      const chars = Array.from(el.querySelectorAll('.logo-char:not(.is-space)'));
      if (!chars.length) return;
      const count = 1 + Math.floor(Math.random() * 2);
      const picked = [];
      while (picked.length < count && picked.length < chars.length) {
        const idx = Math.floor(Math.random() * chars.length);
        if (!picked.includes(idx)) picked.push(idx);
      }
      picked.forEach((idx, i) => {
        const span = chars[idx];
        const startDelay = 800 + Math.random() * 1200 + i * 300;
        setTimeout(() => {
          const sym = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
          const col = COLORS[Math.floor(Math.random() * COLORS.length)];
          const rot = (Math.random() - 0.5) * 24;
          span.style.setProperty('--rot', rot + 'deg');
          span.textContent = sym;
          span.style.color = col;
          span.classList.remove('is-returning');
          span.classList.add('is-symbol');
          setTimeout(() => {
            span.textContent = span.dataset.original;
            span.style.color = '';
            span.classList.remove('is-symbol');
            span.classList.add('is-returning');
            span.addEventListener('animationend', () => {
              span.classList.remove('is-returning');
            }, { once: true });
          }, 500 + Math.random() * 300);
        }, startDelay);
      });
    });
  }
  blinkHint();

  // Language toggle
  const toggle = document.querySelector('.lang-toggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      currentLang = currentLang === 'en' ? 'zh' : 'en';
      localStorage.setItem('lang', currentLang);
      applyLang(currentLang);
      setupLogoHovers();
      setupHeadingHovers();
    });
  }

  /* ===========================
     Lightbox
     =========================== */
  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.innerHTML =
    '<button class="lightbox-close" aria-label="Close">&#215;</button>' +
    '<button class="lightbox-prev" aria-label="Previous">&#8592;</button>' +
    '<img class="lightbox-img" src="" alt="" />' +
    '<button class="lightbox-next" aria-label="Next">&#8594;</button>';
  document.body.appendChild(lb);

  const lbImg   = lb.querySelector('.lightbox-img');
  const lbClose = lb.querySelector('.lightbox-close');
  const lbPrev  = lb.querySelector('.lightbox-prev');
  const lbNext  = lb.querySelector('.lightbox-next');

  const lbImages = Array.from(document.querySelectorAll('.g-item img, .hero-contain img, .ws-poster-item img, .ws-mockup-item img, .ws-install-item img, .ws-contained-img:not(.ws-no-lightbox) img, .series-img img'));
  let lbIndex = 0;

  function lbShow(idx) {
    lbIndex = idx;
    const img = lbImages[idx];
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbPrev.disabled = idx === 0;
    lbNext.disabled = idx === lbImages.length - 1;
  }

  function openLightbox(img) {
    lbShow(lbImages.indexOf(img));
    lb.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lb.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  lbImages.forEach(img => img.addEventListener('click', () => openLightbox(img)));

  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', () => lbShow(lbIndex - 1));
  lbNext.addEventListener('click', () => lbShow(lbIndex + 1));
  lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('is-open')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft'  && lbIndex > 0)                 lbShow(lbIndex - 1);
    if (e.key === 'ArrowRight' && lbIndex < lbImages.length - 1) lbShow(lbIndex + 1);
  });

  /* ===========================
     Windowscape — Fragment Interaction System (hero-image-3)
     =========================== */
  const fragWrap = document.getElementById('wsFragments');
  if (fragWrap) {
    const fragCanvas = document.getElementById('wsFragCanvas');
    const fragSource = document.getElementById('wsFragSource');
    const ctx = fragCanvas.getContext('2d');

    let fragments = [];
    let imgW = 0, imgH = 0;
    let animating = false;

    function initFragments() {
      const img = fragSource;
      imgW = img.naturalWidth;
      imgH = img.naturalHeight;
      fragCanvas.width = imgW;
      fragCanvas.height = imgH;

      const offscreen = document.createElement('canvas');
      offscreen.width = imgW;
      offscreen.height = imgH;
      const offCtx = offscreen.getContext('2d');
      offCtx.drawImage(img, 0, 0);
      const imageData = offCtx.getImageData(0, 0, imgW, imgH);
      const data = imageData.data;

      const THRESHOLD = 180;
      const mask = new Uint8Array(imgW * imgH);
      for (let i = 0; i < imgW * imgH; i++) {
        const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2], a = data[i * 4 + 3];
        mask[i] = (a > 128 && (r + g + b) / 3 < THRESHOLD) ? 1 : 0;
      }

      const labels = new Int32Array(imgW * imgH);
      let nextLabel = 1;
      const parent = [0];
      function find(x) { while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; } return x; }
      function union(a, b) { a = find(a); b = find(b); if (a !== b) parent[Math.max(a, b)] = Math.min(a, b); }

      for (let y = 0; y < imgH; y++) {
        for (let x = 0; x < imgW; x++) {
          const idx = y * imgW + x;
          if (!mask[idx]) continue;
          const above = y > 0 ? labels[(y - 1) * imgW + x] : 0;
          const left  = x > 0 ? labels[y * imgW + (x - 1)] : 0;
          if (above && left) { labels[idx] = Math.min(above, left); union(above, left); }
          else if (above) labels[idx] = above;
          else if (left) labels[idx] = left;
          else { labels[idx] = nextLabel; parent.push(nextLabel); nextLabel++; }
        }
      }

      for (let i = 0; i < labels.length; i++) { if (labels[i]) labels[i] = find(labels[i]); }

      const bboxes = new Map();
      for (let y = 0; y < imgH; y++) {
        for (let x = 0; x < imgW; x++) {
          const l = labels[y * imgW + x];
          if (!l) continue;
          if (!bboxes.has(l)) bboxes.set(l, { minX: x, minY: y, maxX: x, maxY: y });
          else {
            const b = bboxes.get(l);
            if (x < b.minX) b.minX = x; if (y < b.minY) b.minY = y;
            if (x > b.maxX) b.maxX = x; if (y > b.maxY) b.maxY = y;
          }
        }
      }

      const MIN_AREA = 20;
      fragments = [];

      bboxes.forEach((b, label) => {
        const w = b.maxX - b.minX + 1, h = b.maxY - b.minY + 1;
        let pixelCount = 0;
        for (let py = b.minY; py <= b.maxY; py++)
          for (let px = b.minX; px <= b.maxX; px++)
            if (labels[py * imgW + px] === label) pixelCount++;
        if (pixelCount < MIN_AREA) return;

        const subCanvas = document.createElement('canvas');
        subCanvas.width = w; subCanvas.height = h;
        const subCtx = subCanvas.getContext('2d');
        const subData = subCtx.createImageData(w, h);
        for (let py = 0; py < h; py++) {
          for (let px = 0; px < w; px++) {
            const srcIdx = ((b.minY + py) * imgW + (b.minX + px)) * 4;
            const dstIdx = (py * w + px) * 4;
            if (labels[(b.minY + py) * imgW + (b.minX + px)] === label) {
              subData.data[dstIdx] = data[srcIdx]; subData.data[dstIdx+1] = data[srcIdx+1];
              subData.data[dstIdx+2] = data[srcIdx+2]; subData.data[dstIdx+3] = data[srcIdx+3];
            }
          }
        }
        subCtx.putImageData(subData, 0, 0);

        fragments.push({
          x: b.minX, y: b.minY, w, h, img: subCanvas,
          offsetX: 0, offsetY: 0, rotation: 0, scale: 1,
          targetOX: 0, targetOY: 0, targetR: 0, targetS: 1
        });
      });

      renderFragments();
    }

    function renderFragments() {
      ctx.clearRect(0, 0, imgW, imgH);
      for (const f of fragments) {
        ctx.save();
        const cx = f.x + f.w / 2 + f.offsetX, cy = f.y + f.h / 2 + f.offsetY;
        ctx.translate(cx, cy); ctx.rotate(f.rotation); ctx.scale(f.scale, f.scale);
        ctx.drawImage(f.img, -f.w / 2, -f.h / 2);
        ctx.restore();
      }
    }

    function shuffleFragments() {
      if (animating) return;
      const count = Math.max(1, Math.floor(fragments.length * (0.1 + Math.random() * 0.1)));
      const indices = [];
      const pool = fragments.map((_, i) => i);
      for (let i = 0; i < count && pool.length > 0; i++) {
        const pick = Math.floor(Math.random() * pool.length);
        indices.push(pool[pick]); pool.splice(pick, 1);
      }
      for (const i of indices) {
        const f = fragments[i];
        f.targetOX = (Math.random() - 0.5) * 6;
        f.targetOY = (Math.random() - 0.5) * 6;
        f.targetR  = (Math.random() - 0.5) * 0.035;
        f.targetS  = 0.97 + Math.random() * 0.06;
      }
      for (let i = 0; i < fragments.length; i++) {
        if (!indices.includes(i)) {
          const f = fragments[i];
          f.targetOX = f.offsetX * 0.3; f.targetOY = f.offsetY * 0.3;
          f.targetR = f.rotation * 0.3; f.targetS = 1 + (f.scale - 1) * 0.3;
        }
      }
      animating = true;
      animateFragments();
    }

    function animateFragments() {
      let stillMoving = false;
      const EASE = 0.06;
      for (const f of fragments) {
        const dx = f.targetOX - f.offsetX, dy = f.targetOY - f.offsetY;
        const dr = f.targetR - f.rotation, ds = f.targetS - f.scale;
        f.offsetX += dx * EASE; f.offsetY += dy * EASE;
        f.rotation += dr * EASE; f.scale += ds * EASE;
        if (Math.abs(dx) > 0.01 || Math.abs(dy) > 0.01 || Math.abs(dr) > 0.0001 || Math.abs(ds) > 0.001)
          stillMoving = true;
      }
      renderFragments();
      if (stillMoving) requestAnimationFrame(animateFragments);
      else animating = false;
    }

    fragWrap.addEventListener('click', shuffleFragments);
    if (fragSource.complete && fragSource.naturalWidth > 0) initFragments();
    else fragSource.addEventListener('load', initFragments);
  }

  /* ===========================
     Windowscape — Poster Carousel Arrows
     =========================== */
  const posterTrack = document.getElementById('wsPosterTrack');
  if (posterTrack) {
    const prevBtn = document.querySelector('.ws-poster-prev');
    const nextBtn = document.querySelector('.ws-poster-next');
    const scrollAmount = () => posterTrack.clientWidth * 0.6;

    function updateArrows() {
      const maxScroll = posterTrack.scrollWidth - posterTrack.clientWidth;
      prevBtn.disabled = posterTrack.scrollLeft <= 2;
      nextBtn.disabled = posterTrack.scrollLeft >= maxScroll - 2;
    }

    prevBtn.addEventListener('click', () => posterTrack.scrollBy({ left: -scrollAmount(), behavior: 'smooth' }));
    nextBtn.addEventListener('click', () => posterTrack.scrollBy({ left: scrollAmount(), behavior: 'smooth' }));
    posterTrack.addEventListener('scroll', updateArrows, { passive: true });
    updateArrows();
  }

  /* ===========================
     Active Nav Link
     =========================== */
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-right a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

});

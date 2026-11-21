/* ============================================================
   ANN MARIYA — PORTFOLIO JAVASCRIPT
   Navigation · Scroll Reveal · Lazy Load · Interactions
   ============================================================ */

'use strict';

/* ============================================================
   1. DOM READY
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initScrollReveal();
  initLazyLoad();
  initScrollProgress();
  initBackToTop();
  initParallaxHero();
  initMobileNav();
  initBeforeAfterSlider();
});

/* ============================================================
   2. NAVIGATION
   ============================================================ */
function initNav() {
  const nav = document.getElementById('nav');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Compact nav on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      nav.classList.add('compact');
    } else {
      nav.classList.remove('compact');
    }

    // Update active nav link
    updateActiveNav(sections, navLinks);
  }, { passive: true });

  // Smooth scroll for nav links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height'));
        const offset = target.getBoundingClientRect().top + window.scrollY - navH - 8;
        window.scrollTo({ top: offset, behavior: 'smooth' });

        // Close mobile menu if open
        closeMobileMenu();
      }
    });
  });
}

function updateActiveNav(sections, navLinks) {
  let current = '';
  const scrollY = window.scrollY;

  sections.forEach(section => {
    const top = section.offsetTop - 100;
    const height = section.offsetHeight;
    if (scrollY >= top && scrollY < top + height) {
      current = section.id;
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
}

/* ============================================================
   3. MOBILE NAVIGATION
   ============================================================ */
function initMobileNav() {
  const hamburger = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('nav-mobile');

  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    if (isOpen) {
      mobileMenu.style.display = 'flex';
      requestAnimationFrame(() => {
        mobileMenu.classList.add('open');
      });
    } else {
      closeMobileMenu();
    }
  });
}

function closeMobileMenu() {
  const hamburger = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('nav-mobile');

  if (!hamburger || !mobileMenu) return;

  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
  setTimeout(() => {
    if (!mobileMenu.classList.contains('open')) {
      mobileMenu.style.display = 'none';
    }
  }, 320);
}

/* ============================================================
   4. SCROLL REVEAL (INTERSECTION OBSERVER)
   ============================================================ */
function initScrollReveal() {
  const revealEls = document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right, .reveal-scale'
  );

  if (!revealEls.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  revealEls.forEach(el => observer.observe(el));
}

/* ============================================================
   5. LAZY LOAD IMAGES
   ============================================================ */
function initLazyLoad() {
  const lazyImages = document.querySelectorAll('img[data-src]');

  if (lazyImages.length) {
    const imageObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.addEventListener('load', () => {
              img.classList.add('loaded');
            });
            img.addEventListener('error', () => {
              img.classList.add('loaded'); // prevent broken state
            });
            imageObserver.unobserve(img);
          }
        });
      },
      { rootMargin: '200px 0px' }
    );

    lazyImages.forEach(img => imageObserver.observe(img));
  }

  // Ensure all standard images have loaded class
  document.querySelectorAll('img').forEach(img => {
    img.classList.add('loaded');
  });
}

/* ============================================================
   6. SCROLL PROGRESS BAR
   ============================================================ */
function initScrollProgress() {
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = progress + '%';
  }, { passive: true });
}

/* ============================================================
   7. BACK TO TOP
   ============================================================ */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ============================================================
   8. HERO PARALLAX (Desktop only)
   ============================================================ */
function initParallaxHero() {
  const heroVisual = document.querySelector('.hero-visual');
  const heroMicroCards = document.querySelectorAll('.hero-micro-card');

  if (!heroVisual) return;

  // Only on non-touch devices
  if (window.matchMedia('(hover: none)').matches) return;

  let rafId = null;
  let mouseX = 0;
  let mouseY = 0;
  let currentX = 0;
  let currentY = 0;

  document.addEventListener('mousemove', (e) => {
    const rect = document.getElementById('hero').getBoundingClientRect();
    mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
  });

  function animate() {
    currentX += (mouseX - currentX) * 0.06;
    currentY += (mouseY - currentY) * 0.06;

    heroVisual.style.transform = `translate(${currentX * 6}px, ${currentY * 4}px)`;

    heroMicroCards.forEach((card, i) => {
      const factor = (i + 1) * 2;
      card.style.transform = `translate(${currentX * factor}px, ${currentY * factor}px) translateY(${card.dataset.float || 0}px)`;
    });

    rafId = requestAnimationFrame(animate);
  }

  animate();
}

/* ============================================================
   9. UTILITY: INTERSECTION OBSERVER HELPER
   ============================================================ */
function onVisible(selector, callback, options = {}) {
  const els = typeof selector === 'string'
    ? document.querySelectorAll(selector)
    : [selector];

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          callback(entry.target);
          if (options.once !== false) {
            observer.unobserve(entry.target);
          }
        }
      });
    },
    { threshold: options.threshold || 0.15, ...options }
  );

  els.forEach(el => observer.observe(el));
  return observer;
}


/* ============================================================
   10. INTERACTIVE BEFORE & AFTER SLIDER & REDESIGN TABS
   ============================================================ */
const REDESIGN_DATA = {
  dashboards: {
    title: 'Apex Company Dashboards',
    category: 'Enterprise Operations · Mobile ERP Redesign',
    beforeImg: 'assets/images/sample-before-dashboard.png',
    afterImg: 'assets/images/sample-after-dashboard.png',
    challenge: 'The legacy enterprise operations portal was visually cluttered, lacked typographic hierarchy, and had generic outline buttons that caused user fatigue in fast-paced field operations.',
    solution: 'Re-architected the entire interface using Flutter Material 3 tokens. Introduced a dynamic top greeting with search filtering, elevated module cards with micro-shadows, contextual icon categorisation, and a modern floating bottom dock.',
    metrics: [
      { val: '-45%', label: 'Task Access Time' },
      { val: '60 FPS', label: 'Flutter Smoothness' },
      { val: '+88%', label: 'User Satisfaction' }
    ],
    tags: ['Flutter 3', 'Material 3', 'Figma Redesign', 'GetX', 'Mobile ERP', 'Design System']
  },
  receipt: {
    title: 'SmartReceipt Financial Flow',
    category: 'Fintech & Accounting · Form UX Redesign',
    beforeImg: 'assets/images/sample-before-form.png',
    afterImg: 'assets/images/sample-after-form.png',
    challenge: 'A cramped, intimidating data entry form with raw radio buttons, unstyled inputs, and a heavy bottom bar that led to high input errors on mobile screens.',
    solution: 'Transformed into a spacious, segmented Flutter form. Replaced radio lists with tactile pill selectors, added intuitive input icons, dynamic field validation, and an accessible floating action button.',
    metrics: [
      { val: '-62%', label: 'Form Abandonment' },
      { val: '2.4x', label: 'Faster Input Rate' },
      { val: 'Zero', label: 'Validation Errors' }
    ],
    tags: ['Flutter Forms', 'Segmented UI', 'Tactile UX', 'Figma Tokens', 'Reactive GetX']
  },
  fintech: {
    title: 'NovaVault Mobile Wealth',
    category: 'Neo-Banking & Crypto · Dark Mode Redesign',
    beforeImg: 'assets/images/dummy-fintech-before.png',
    afterImg: 'assets/images/dummy-fintech-after.png',
    challenge: 'An outdated 2015 banking portal filled with harsh monochrome tables, crowded statement lines, and confusing fund transfer flows.',
    solution: 'Crafted an immersive high-contrast dark mode with glassmorphic portfolio cards, real-time glowing yield sparklines, one-tap biometric floating action pills, and streamlined activity tracking.',
    metrics: [
      { val: '+120%', label: 'Daily Engagement' },
      { val: '1-Tap', label: 'Biometric Send' },
      { val: '4.9 ★', label: 'User Rating' }
    ],
    tags: ['Flutter Dark Theme', 'CustomPainter', 'Fintech UI', 'Micro-interactions', 'Lottie']
  },
  ecommerce: {
    title: 'Atelier Luxury E-Commerce',
    category: 'Retail & Fashion · Modern Catalog Redesign',
    beforeImg: 'assets/images/dummy-ecommerce-before.png',
    afterImg: 'assets/images/dummy-ecommerce-after.png',
    challenge: 'A clunky webview-style product listing with low-resolution boxes, misplaced pricing tags, and poor visual storytelling.',
    solution: 'Designed a high-fashion mobile editorial experience with horizontal category pills, fluid hero product cards, subtle depth effects, and smooth Flutter hero transitions.',
    metrics: [
      { val: '+38%', label: 'Checkout Conversion' },
      { val: '<100ms', label: 'Screen Transition' },
      { val: '60 FPS', label: 'Scroll Velocity' }
    ],
    tags: ['Flutter Hero Animations', 'Sliver Layouts', 'E-Commerce', 'Figma to Flutter']
  },
  logistics: {
    title: 'SwiftFleet Logistics Telemetry',
    category: 'Supply Chain & Fleet · Live Telemetry Redesign',
    beforeImg: 'assets/images/dummy-delivery-before.png',
    afterImg: 'assets/images/dummy-delivery-after.png',
    challenge: 'Static text tables with stale tabular delivery lists and no real-time geographic feedback for drivers and dispatchers.',
    solution: 'Engineered an interactive Flutter telemetry console with live route tracking, glowing status chips, dynamic ETA calculations, and clean driver handover cards.',
    metrics: [
      { val: 'Real-time', label: 'GPS Telemetry' },
      { val: '-30%', label: 'Dispatch Delays' },
      { val: 'Offline', label: 'Sync Ready' }
    ],
    tags: ['Flutter Maps', 'Live Telemetry', 'Logistics UX', 'Clean Architecture']
  }
};

function initBeforeAfterSlider() {
  const container = document.getElementById('ba-compare-container');
  if (!container) return;

  const beforeImg = document.getElementById('ba-img-before');
  const afterImg = document.getElementById('ba-img-after');
  const tabBtns = document.querySelectorAll('.redesign-tab-btn');
  const presetBtns = document.querySelectorAll('.ba-preset-btn');

  const titleEl = document.getElementById('ba-detail-title');
  const categoryEl = document.getElementById('ba-detail-category');
  const tagsEl = document.getElementById('ba-detail-tags');
  const challengeEl = document.getElementById('ba-detail-challenge');
  const solutionEl = document.getElementById('ba-detail-solution');
  const metricsEl = document.getElementById('ba-detail-metrics');

  let isDragging = false;
  let currentPos = 50;

  function updateSliderPosition(pos) {
    currentPos = Math.max(0, Math.min(100, pos));
    container.style.setProperty('--ba-pos', `${currentPos}%`);

    presetBtns.forEach(btn => {
      const val = parseFloat(btn.dataset.pos);
      if (Math.abs(val - currentPos) < 5) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  function handlePointerMove(e) {
    if (!isDragging) return;
    const rect = container.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : rect.left + rect.width / 2);
    const offsetX = clientX - rect.left;
    const percent = (offsetX / rect.width) * 100;
    updateSliderPosition(percent);
  }

  container.addEventListener('pointerdown', (e) => {
    isDragging = true;
    container.setPointerCapture(e.pointerId);
    handlePointerMove(e);
  });

  container.addEventListener('pointermove', handlePointerMove);

  const stopDrag = (e) => {
    if (isDragging) {
      isDragging = false;
      try {
        container.releasePointerCapture(e.pointerId);
      } catch (err) {}
    }
  };

  container.addEventListener('pointerup', stopDrag);
  container.addEventListener('pointercancel', stopDrag);

  presetBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetPos = parseFloat(btn.dataset.pos);
      animateSliderTo(targetPos);
    });
  });

  function animateSliderTo(targetPos) {
    const startPos = currentPos;
    const startTime = performance.now();
    const duration = 280;

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const newPos = startPos + (targetPos - startPos) * ease;
      updateSliderPosition(newPos);
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }
    requestAnimationFrame(step);
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.project;
      const data = REDESIGN_DATA[key];
      if (!data) return;

      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      container.style.opacity = '0.5';
      setTimeout(() => {
        beforeImg.src = data.beforeImg;
        afterImg.src = data.afterImg;
        container.style.opacity = '1';
      }, 150);

      if (titleEl) titleEl.textContent = data.title;
      if (categoryEl) categoryEl.textContent = data.category;
      if (challengeEl) challengeEl.textContent = data.challenge;
      if (solutionEl) solutionEl.textContent = data.solution;

      if (tagsEl) {
        tagsEl.innerHTML = data.tags.map(t => `<span class="ba-tag">${t}</span>`).join('');
      }

      if (metricsEl) {
        metricsEl.innerHTML = data.metrics.map(m => `
          <div class="ba-metric-item">
            <span class="ba-metric-val">${m.val}</span>
            <span class="ba-metric-label">${m.label}</span>
          </div>
        `).join('');
      }

      animateSliderTo(50);
    });
  });

  updateSliderPosition(50);
}

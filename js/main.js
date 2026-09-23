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
  const images = document.querySelectorAll('img[data-src]');

  if (!images.length) return;

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

  images.forEach(img => imageObserver.observe(img));

  // Eager load images (no data-src)
  document.querySelectorAll('img:not([data-src])').forEach(img => {
    if (img.complete) {
      img.classList.add('loaded');
    } else {
      img.addEventListener('load', () => img.classList.add('loaded'));
      img.addEventListener('error', () => img.classList.add('loaded'));
    }
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

/* ====================================
   MASQUE RESTAURANT — Main JavaScript
   ==================================== */

(function () {
  'use strict';

  // ── Sticky Navbar ──────────────────────
  const navbar = document.getElementById('navbar');
  const scrollThreshold = 60;

  function updateNav() {
    if (window.scrollY > scrollThreshold) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  // ── Mobile Menu ────────────────────────
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
    document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
  });

  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ── Scroll Reveal ──────────────────────
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => revealObserver.observe(el));

  // ── Hero background load ────────────────
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    const img = new Image();
    img.src = heroBg.style.backgroundImage.slice(5, -2).replace(/['"]/g, '');
    img.onload = () => heroBg.classList.add('loaded');
    // fallback
    setTimeout(() => heroBg.classList.add('loaded'), 1500);
  }

  // ── Tasting Menu Carousel ──────────────
  const carousel = document.querySelector('#menu .carousel-track');
  const prevBtn  = document.getElementById('menu-prev');
  const nextBtn  = document.getElementById('menu-next');
  const dotsEl   = document.getElementById('menu-dots');
  const cards    = carousel ? Array.from(carousel.querySelectorAll('.course-card')) : [];

  let currentIndex = 0;
  const VISIBLE = () => window.innerWidth < 480 ? 1 : window.innerWidth < 768 ? 1.5 : 3;

  function getCardWidth() {
    if (!cards.length) return 0;
    return cards[0].getBoundingClientRect().width + 24; // 24px gap
  }

  function buildDots() {
    if (!dotsEl) return;
    dotsEl.innerHTML = '';
    const count = Math.ceil(cards.length - Math.floor(VISIBLE()) + 1);
    for (let i = 0; i < count; i++) {
      const dot = document.createElement('span');
      dot.className = 'carousel-dot' + (i === currentIndex ? ' active' : '');
      dot.addEventListener('click', () => goTo(i));
      dotsEl.appendChild(dot);
    }
  }

  function updateDots() {
    if (!dotsEl) return;
    dotsEl.querySelectorAll('.carousel-dot').forEach((d, i) => {
      d.classList.toggle('active', i === currentIndex);
    });
  }

  function goTo(idx) {
    const maxIndex = Math.max(0, cards.length - Math.floor(VISIBLE()));
    currentIndex = Math.max(0, Math.min(idx, maxIndex));
    carousel.style.transform = `translateX(-${currentIndex * getCardWidth()}px)`;
    updateDots();
  }

  if (prevBtn) prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(currentIndex + 1));

  // Touch/Swipe
  if (carousel) {
    let startX = 0;
    carousel.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    carousel.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 50) goTo(currentIndex + (dx < 0 ? 1 : -1));
    });
  }

  buildDots();
  window.addEventListener('resize', () => { goTo(currentIndex); buildDots(); });

  // ── Smooth scroll for anchor links ─────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = navbar ? navbar.offsetHeight : 0;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    });
  });

  // ── Form Submission ────────────────────
  const resForm = document.getElementById('res-form');
  if (resForm) {
    resForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const btn = this.querySelector('button[type="submit"]');
      const originalText = btn.querySelector('span').textContent;
      btn.querySelector('span').textContent = 'Sending…';
      btn.disabled = true;
      setTimeout(() => {
        btn.querySelector('span').textContent = '✓ Reservation Request Sent';
        btn.style.background = '#4CAF50';
        btn.style.borderColor = '#4CAF50';
        setTimeout(() => {
          btn.querySelector('span').textContent = originalText;
          btn.disabled = false;
          btn.style.background = '';
          btn.style.borderColor = '';
          resForm.reset();
        }, 3000);
      }, 1200);
    });
  }

  // ── Ticker pause on hover ──────────────
  const ticker = document.querySelector('.ticker-track');
  if (ticker) {
    ticker.addEventListener('mouseenter', () => ticker.style.animationPlayState = 'paused');
    ticker.addEventListener('mouseleave', () => ticker.style.animationPlayState = 'running');
  }

})();

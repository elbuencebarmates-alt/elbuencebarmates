/* ============================================
   EL BUEN CEBAR — Scroll Animations
   Intersection Observer based reveals
   ============================================ */

const Animations = {
  // Initialize scroll reveal animations
  init() {
    this.initScrollReveal();
    this.initParallax();
    this.initCounters();
  },

  // Scroll reveal with Intersection Observer
  initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-stagger');

    if (reveals.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          // Unobserve after reveal (one-time animation)
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(el => observer.observe(el));
  },

  // Simple parallax effect for hero backgrounds
  initParallax() {
    const parallaxElements = document.querySelectorAll('.parallax-bg');
    if (parallaxElements.length === 0) return;

    let ticking = false;

    const updateParallax = () => {
      const scrolled = window.pageYOffset;

      parallaxElements.forEach(el => {
        const speed = el.dataset.speed || 0.3;
        const yPos = -(scrolled * speed);
        el.style.transform = `translate3d(0, ${yPos}px, 0)`;
      });

      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
  },

  // Animated counters
  initCounters() {
    const counters = document.querySelectorAll('[data-counter]');
    if (counters.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => observer.observe(el));
  },

  animateCounter(el) {
    const target = parseInt(el.dataset.counter, 10);
    const duration = 2000;
    const start = 0;
    const startTime = performance.now();
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';

    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (target - start) * eased);

      el.textContent = prefix + current.toLocaleString('es-AR') + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  },

  // Smooth scroll to element
  scrollTo(selector) {
    const el = document.querySelector(selector);
    if (el) {
      const offset = 100; // Account for fixed nav
      const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }
};

// Make available globally
if (typeof window !== 'undefined') {
  window.Animations = Animations;
}


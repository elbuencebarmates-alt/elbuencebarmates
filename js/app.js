/* ============================================
   EL BUEN CEBAR — App Initialization
   Main entry point
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all modules
  UI.init();
  Cart.init();
  Animations.init();

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      Animations.scrollTo(href);
    });
  });

  // Page transition class
  document.body.classList.add('page-enter');

  // Lazy load images with native loading
  if ('loading' in HTMLImageElement.prototype) {
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
      }
    });
  }

  // WhatsApp floating button
  const whatsappBtn = document.querySelector('.whatsapp-float');
  if (whatsappBtn) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        whatsappBtn.classList.add('visible');
      } else {
        whatsappBtn.classList.remove('visible');
      }
    }, { passive: true });
  }

  console.log('%c🧉 EL BUEN CEBAR', 'font-size: 24px; font-weight: bold; color: #9C6634;');
  console.log('%cTienda de Mates Premium', 'font-size: 12px; color: #5E646A;');
});


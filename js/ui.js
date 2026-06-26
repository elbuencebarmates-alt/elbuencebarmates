/* ============================================
   EL BUEN CEBAR — UI Interactions
   Menu, filters, gallery, tabs, modals
   ============================================ */

const UI = {
  init() {
    this.initNavigation();
    this.initMobileMenu();
    this.initTabs();
    this.initAccordion();
    this.initImageGallery();
    this.initCatalogFilters();
    this.initSearchModal();
  },

  // ── Navigation scroll effect ──
  initNavigation() {
    const nav = document.querySelector('.nav');
    if (!nav) return;

    let lastScroll = 0;

    const handleScroll = () => {
      const currentScroll = window.pageYOffset;

      if (currentScroll > 50) {
        nav.classList.add('nav--scrolled');
        nav.classList.remove('nav--transparent');
      } else {
        if (nav.dataset.transparent === 'true') {
          nav.classList.add('nav--transparent');
        }
        nav.classList.remove('nav--scrolled');
      }

      lastScroll = currentScroll;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
  },

  // ── Mobile Menu ──
  initMobileMenu() {
    const hamburger = document.querySelector('.nav__hamburger');
    const mobileMenu = document.querySelector('.nav__mobile-menu');
    if (!hamburger || !mobileMenu) return;

    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close on link click
    mobileMenu.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  },

  // ── Tabs ──
  initTabs() {
    const tabContainers = document.querySelectorAll('[data-tabs]');

    tabContainers.forEach(container => {
      const tabs = container.querySelectorAll('.tab');
      const contents = container.querySelectorAll('.tab-content');

      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          const target = tab.dataset.tab;

          // Deactivate all
          tabs.forEach(t => t.classList.remove('active'));
          contents.forEach(c => c.classList.remove('active'));

          // Activate clicked
          tab.classList.add('active');
          const targetContent = container.querySelector(`[data-tab-content="${target}"]`);
          if (targetContent) targetContent.classList.add('active');
        });
      });
    });
  },

  // ── Accordion ──
  initAccordion() {
    const items = document.querySelectorAll('.accordion__item');

    items.forEach(item => {
      const header = item.querySelector('.accordion__header');
      if (!header) return;

      header.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close all in same accordion
        const parent = item.closest('.accordion');
        if (parent) {
          parent.querySelectorAll('.accordion__item').forEach(i => i.classList.remove('active'));
        }

        // Toggle current
        if (!isActive) {
          item.classList.add('active');
        }
      });
    });
  },

  // ── Product Image Gallery ──
  initImageGallery() {
    const mainImage = document.querySelector('.product-gallery__main img');
    const thumbnails = document.querySelectorAll('.product-gallery__thumb');

    if (!mainImage || thumbnails.length === 0) return;

    thumbnails.forEach(thumb => {
      thumb.addEventListener('click', () => {
        // Update main image
        mainImage.src = thumb.dataset.src || thumb.querySelector('img')?.src;
        mainImage.alt = thumb.dataset.alt || '';

        // Update active state
        thumbnails.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
      });
    });

    // Zoom on hover
    const gallery = document.querySelector('.product-gallery__main');
    if (gallery) {
      gallery.addEventListener('mousemove', (e) => {
        const rect = gallery.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        mainImage.style.transformOrigin = `${x}% ${y}%`;
        mainImage.style.transform = 'scale(1.5)';
      });

      gallery.addEventListener('mouseleave', () => {
        mainImage.style.transform = 'scale(1)';
      });
    }
  },

  // ── Catalog Filters ──
  initCatalogFilters() {
    const filterBtns = document.querySelectorAll('[data-filter]');
    const sortSelect = document.querySelector('[data-sort]');
    const productGrid = document.querySelector('.catalog__grid');

    if (!productGrid) return;

    let currentCategory = 'all';
    let currentSort = 'featured';

    const renderProducts = () => {
      let products = currentCategory === 'all'
        ? [...PRODUCTS]
        : getProductsByCategory(currentCategory);

      products = sortProducts(products, currentSort);

      productGrid.innerHTML = products.map(product => createProductCard(product)).join('');

      // Update count
      const countEl = document.querySelector('.catalog__count');
      if (countEl) {
        countEl.textContent = `${products.length} producto${products.length !== 1 ? 's' : ''}`;
      }

      // Re-init animations for new elements
      Animations.initScrollReveal();
    };

    // Filter buttons
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        currentCategory = btn.dataset.filter;
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderProducts();
      });
    });

    // Sort select
    if (sortSelect) {
      sortSelect.addEventListener('change', () => {
        currentSort = sortSelect.value;
        renderProducts();
      });
    }
  },

  // ── Search Modal ──
  initSearchModal() {
    const searchBtn = document.querySelector('[data-search-toggle]');
    const searchModal = document.querySelector('.search-modal');
    const searchInput = document.querySelector('.search-modal__input');
    const searchResults = document.querySelector('.search-modal__results');

    if (!searchBtn || !searchModal) return;

    searchBtn.addEventListener('click', (e) => {
      e.preventDefault();
      searchModal.classList.add('active');
      searchInput?.focus();
      document.body.style.overflow = 'hidden';
    });

    // Close search
    searchModal.querySelector('.search-modal__close')?.addEventListener('click', () => {
      searchModal.classList.remove('active');
      document.body.style.overflow = '';
    });

    // Search as you type
    if (searchInput && searchResults) {
      let debounceTimer;

      searchInput.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          const query = searchInput.value.trim();
          if (query.length < 2) {
            searchResults.innerHTML = '';
            return;
          }

          const results = searchProducts(query);
          searchResults.innerHTML = results.length > 0
            ? results.map(p => `
              <a href="producto.html?id=${p.id}" class="search-result">
                <div class="search-result__image">
                  <img src="${p.image}" alt="${p.name}" onerror="this.src='assets/images/placeholder.jpg'">
                </div>
                <div class="search-result__info">
                  <p class="search-result__name">${p.name}</p>
                  <p class="search-result__subtitle">${p.subtitle}</p>
                  <p class="search-result__price">${formatPrice(p.price)}</p>
                </div>
              </a>
            `).join('')
            : '<p class="search-modal__empty">No se encontraron productos</p>';
        }, 300);
      });
    }

    // Close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && searchModal.classList.contains('active')) {
        searchModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
};

// ── Product Card HTML Generator ──
function createProductCard(product) {
  const discount = getDiscountPercentage(product.originalPrice, product.price);
  const badgeHTML = product.badge
    ? `<span class="product-card__badge product-card__badge--${product.badge}">
        ${product.badge === 'sale' ? `-${discount}%` : product.badge === 'new' ? 'Nuevo' : 'Más Vendido'}
       </span>`
    : '';

  const ratingHTML = Array(5).fill(0).map((_, i) =>
    `<span class="rating__star${i < Math.floor(product.rating) ? '' : '--empty'}">★</span>`
  ).join('');

  return `
    <div class="product-card reveal">
      <div class="product-card__image img-zoom">
        <a href="producto.html?id=${product.id}">
          <img src="${product.image}" alt="${product.name} ${product.subtitle}" loading="lazy"
               onerror="this.style.display='none'; this.parentElement.style.background='linear-gradient(135deg, var(--color-surface) 0%, var(--color-surface-dark) 100%)'">
        </a>
        ${badgeHTML}
        <div class="product-card__quick-actions">
          <button class="btn btn--primary btn--sm btn--shine" onclick="Cart.addItem('${product.id}'); window.location.href='checkout.html';">
            Comprar Ahora
          </button>
        </div>
      </div>
      <div class="product-card__info">
        <span class="product-card__category">${product.category}</span>
        <h3 class="product-card__name">
          <a href="producto.html?id=${product.id}">${product.name}</a>
        </h3>
        <p class="product-card__category" style="margin-bottom: var(--space-xs); color: var(--color-text-secondary); text-transform: none; letter-spacing: normal; font-size: var(--text-sm);">${product.subtitle}</p>
        <div class="product-card__price">
          <span class="product-card__price-current">${formatPrice(product.price)}</span>
          ${product.originalPrice ? `<span class="product-card__price-original">${formatPrice(product.originalPrice)}</span>` : ''}
          ${discount > 0 ? `<span class="product-card__price-discount">-${discount}%</span>` : ''}
        </div>
        <div class="rating" style="margin-top: var(--space-xs);">
          ${ratingHTML}
          <span class="rating__count">(${product.reviews})</span>
        </div>
      </div>
    </div>
  `;
}

// Make available globally
if (typeof window !== 'undefined') {
  window.UI = UI;
  window.createProductCard = createProductCard;
}


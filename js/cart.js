/* ============================================
   EL BUEN CEBAR — Cart System
   LocalStorage-based shopping cart
   ============================================ */

const Cart = {
  STORAGE_KEY: 'elbuencebar_cart',

  // Get cart from localStorage
  getItems() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  // Save cart to localStorage
  save(items) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    this.updateUI();
    this.dispatchEvent();
  },

  // Add item to cart
  addItem(productId, quantity = 1) {
    const items = this.getItems();
    const existing = items.find(item => item.id === productId);

    if (existing) {
      existing.quantity += quantity;
    } else {
      items.push({ id: productId, quantity });
    }

    this.save(items);
    this.showToast('Producto agregado al carrito');
    return items;
  },

  // Remove item from cart
  removeItem(productId) {
    let items = this.getItems();
    items = items.filter(item => item.id !== productId);
    this.save(items);
    return items;
  },

  // Update quantity
  updateQuantity(productId, quantity) {
    const items = this.getItems();
    const item = items.find(i => i.id === productId);

    if (item) {
      if (quantity <= 0) {
        return this.removeItem(productId);
      }
      item.quantity = quantity;
      this.save(items);
    }
    return items;
  },

  // Get total items count
  getCount() {
    return this.getItems().reduce((total, item) => total + item.quantity, 0);
  },

  // Get subtotal
  getSubtotal() {
    const items = this.getItems();
    let total = 0;
    items.forEach(item => {
      const product = getProductById(item.id);
      if (product) {
        total += product.price * item.quantity;
      }
    });
    return total;
  },

  // Get total savings
  getSavings() {
    const items = this.getItems();
    let savings = 0;
    items.forEach(item => {
      const product = getProductById(item.id);
      if (product && product.originalPrice) {
        savings += (product.originalPrice - product.price) * item.quantity;
      }
    });
    return savings;
  },

  // Clear cart
  clear() {
    localStorage.removeItem(this.STORAGE_KEY);
    this.updateUI();
    this.dispatchEvent();
  },

  // Check if product is in cart
  hasItem(productId) {
    return this.getItems().some(item => item.id === productId);
  },

  // Update UI elements
  updateUI() {
    // Update cart count badges
    const countElements = document.querySelectorAll('.nav__cart-count, .cart-count');
    const count = this.getCount();
    countElements.forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? 'flex' : 'none';
    });

    // Update cart sidebar if open
    this.renderCartSidebar();

    // Update cart page if on it
    if (document.querySelector('.cart-page')) {
      this.renderCartPage();
    }
  },

  // Render cart sidebar items
  renderCartSidebar() {
    const container = document.querySelector('.cart-sidebar__items');
    if (!container) return;

    const items = this.getItems();

    if (items.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state__icon">🧉</div>
          <p class="empty-state__title">Tu carrito está vacío</p>
          <p class="empty-state__text">Explorá nuestra colección de mates premium</p>
          <a href="catalogo.html" class="btn btn--primary">Ver Catálogo</a>
        </div>
      `;
      const totalEl = document.querySelector('.cart-sidebar__total-price');
      if (totalEl) totalEl.textContent = '$ 0';
      return;
    }

    container.innerHTML = items.map(item => {
      const product = getProductById(item.id);
      if (!product) return '';
      return `
        <div class="cart-item" data-id="${item.id}">
          <div class="cart-item__image">
            <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.src='assets/images/placeholder.jpg'">
          </div>
          <div class="cart-item__info">
            <p class="cart-item__name">${product.name}</p>
            <p class="cart-item__variant">${product.subtitle}</p>
            <div class="qty-selector">
              <button class="qty-selector__btn" onclick="Cart.updateQuantity('${item.id}', ${item.quantity - 1})">−</button>
              <span class="qty-selector__value">${item.quantity}</span>
              <button class="qty-selector__btn" onclick="Cart.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
            </div>
          </div>
          <div>
            <p class="cart-item__price">${formatPrice(product.price * item.quantity)}</p>
            <button class="cart-item__remove" onclick="Cart.removeItem('${item.id}')">Eliminar</button>
          </div>
        </div>
      `;
    }).join('');

    // Update total
    const totalEl = document.querySelector('.cart-sidebar__total-price');
    if (totalEl) totalEl.textContent = formatPrice(this.getSubtotal());
  },

  // Render cart page
  renderCartPage() {
    const container = document.querySelector('.cart-page__items');
    if (!container) return;

    const items = this.getItems();

    if (items.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state__icon">🧉</div>
          <h2 class="empty-state__title">Tu carrito está vacío</h2>
          <p class="empty-state__text">¡Descubrí nuestros mates premium y encontrá el tuyo!</p>
          <a href="catalogo.html" class="btn btn--primary btn--lg">Explorar Catálogo</a>
        </div>
      `;
      const summaryEl = document.querySelector('.cart-page__summary');
      if (summaryEl) summaryEl.style.display = 'none';
      return;
    }

    const summaryEl = document.querySelector('.cart-page__summary');
    if (summaryEl) summaryEl.style.display = 'block';

    container.innerHTML = `
      <div class="cart-page__header-row">
        <span>Producto</span>
        <span>Precio</span>
        <span>Cantidad</span>
        <span>Total</span>
        <span></span>
      </div>
      ${items.map(item => {
        const product = getProductById(item.id);
        if (!product) return '';
        return `
          <div class="cart-page__item" data-id="${item.id}">
            <div class="cart-page__product">
              <div class="cart-page__product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.src='assets/images/placeholder.jpg'">
              </div>
              <div>
                <p class="cart-page__product-name">${product.name}</p>
                <p class="cart-page__product-variant">${product.subtitle}</p>
              </div>
            </div>
            <div class="cart-page__price">
              ${product.originalPrice ? `<span class="price__original">${formatPrice(product.originalPrice)}</span>` : ''}
              <span>${formatPrice(product.price)}</span>
            </div>
            <div class="cart-page__qty">
              <div class="qty-selector">
                <button class="qty-selector__btn" onclick="Cart.updateQuantity('${item.id}', ${item.quantity - 1})">−</button>
                <span class="qty-selector__value">${item.quantity}</span>
                <button class="qty-selector__btn" onclick="Cart.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
              </div>
            </div>
            <div class="cart-page__total">
              <strong>${formatPrice(product.price * item.quantity)}</strong>
            </div>
            <div class="cart-page__remove">
              <button onclick="Cart.removeItem('${item.id}')" class="btn btn--ghost" title="Eliminar">✕</button>
            </div>
          </div>
        `;
      }).join('')}
    `;

    // Update summary
    const subtotalEl = document.querySelector('.cart-summary__subtotal');
    const savingsEl = document.querySelector('.cart-summary__savings');
    const totalEl = document.querySelector('.cart-summary__total');

    if (subtotalEl) subtotalEl.textContent = formatPrice(this.getSubtotal());
    if (totalEl) totalEl.textContent = formatPrice(this.getSubtotal());

    const savings = this.getSavings();
    if (savingsEl) {
      savingsEl.textContent = savings > 0 ? `- ${formatPrice(savings)}` : '$ 0';
    }
  },

  // Toggle cart sidebar
  toggleSidebar() {
    const sidebar = document.querySelector('.cart-sidebar');
    const overlay = document.querySelector('.cart-overlay');
    if (!sidebar) return;

    const isOpen = sidebar.classList.contains('active');

    if (isOpen) {
      sidebar.classList.remove('active');
      overlay?.classList.remove('active');
      document.body.style.overflow = '';
    } else {
      this.renderCartSidebar();
      sidebar.classList.add('active');
      overlay?.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  },

  // Show toast notification
  showToast(message) {
    // Remove existing toast
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <span class="toast__icon">✓</span>
      <span>${message}</span>
      <button class="toast__close" onclick="this.parentElement.remove()">✕</button>
    `;
    document.body.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
      toast.classList.add('active');
    });

    // Remove after 3 seconds
    setTimeout(() => {
      toast.classList.remove('active');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  },

  // Dispatch custom event for other components to listen
  dispatchEvent() {
    window.dispatchEvent(new CustomEvent('cartUpdated', {
      detail: {
        items: this.getItems(),
        count: this.getCount(),
        subtotal: this.getSubtotal()
      }
    }));
  },

  // Initialize
  init() {
    this.updateUI();

    // Cart sidebar toggle
    document.querySelectorAll('[data-cart-toggle]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleSidebar();
      });
    });

    // Close sidebar on overlay click
    document.querySelector('.cart-overlay')?.addEventListener('click', () => {
      this.toggleSidebar();
    });

    // Close sidebar on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const sidebar = document.querySelector('.cart-sidebar');
        if (sidebar?.classList.contains('active')) {
          this.toggleSidebar();
        }
      }
    });
  }
};

// Make available globally
if (typeof window !== 'undefined') {
  window.Cart = Cart;
}


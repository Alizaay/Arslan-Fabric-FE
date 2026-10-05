window.ArsalanApp = {
  injectFragment(html, selector) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const node = doc.querySelector(selector);
    return node ? node.innerHTML : html;
  },

  ensureStoreStyles() {
    if (!document.querySelector('link[data-store-chrome]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'css/shared-overlays.css';
      link.setAttribute('data-store-chrome', 'true');
      document.head.appendChild(link);
    }
  },

  mountOverlays() {
    if (document.querySelector('[data-overlays-root]')) return;
    const root = document.createElement('div');
    root.setAttribute('data-overlays-root', 'true');
    root.innerHTML = `
<div class="af-overlay" data-menu-drawer>
  <div class="af-drawer af-drawer-left af-drawer-nav-main">
    <div class="af-nav-drawer-head">
      <p class="af-drawer-brand">Arsalan Fabrics</p>
      <button type="button" class="af-nav-close" data-close-menu aria-label="Close menu">&times;</button>
    </div>
    <div class="af-nav-tabs">
      <button type="button" class="active" data-nav-tab="women">WOMEN</button>
      <button type="button" data-nav-tab="men">MEN</button>
    </div>
    <nav class="af-nav-menu" data-nav-panel="women">
      <div class="af-nav-item"><a class="af-nav-link" href="arrival-page.html">New Arrivals</a></div>
      <div class="af-nav-item"><a class="af-nav-link" href="best-seller.html">Best Sellers</a></div>
      <div class="af-nav-item open" data-nav-expand data-nav-default-open>
        <button type="button">Formal <span class="af-nav-toggle-icon">−</span></button>
        <div class="af-nav-sub">
          <a href="formal-dresses-page.html">All Formal Wears</a>
          <a href="formal-stitched-page.html">Formal Stitched Ready-to-Wear</a>
          <a href="formal-unstitched-page.html">Formal Unstitched 3 Piece</a>
          <a href="formal-unstitched-page.html">Organza</a>
          <a href="formal-unstitched-page.html">Chiffon</a>
          <a href="formal-unstitched-page.html">Raw Silk</a>
          <a href="formal-dresses-page.html">Velvet</a>
        </div>
      </div>
      <div class="af-nav-item"><a class="af-nav-link" href="semi-formal.html">Semi-Formal</a></div>
      <div class="af-nav-item" data-nav-expand>
        <button type="button">Ready to Wear <span class="af-nav-toggle-icon">+</span></button>
        <div class="af-nav-sub">
          <a href="ready-to-wear.html">All Ready to Wear</a>
          <a href="2-pieces-collection-page.html">2 Piece</a>
          <a href="3-pieces-collection.html">3 Piece</a>
        </div>
      </div>
      <div class="af-nav-item" data-nav-expand>
        <button type="button">Fabrics <span class="af-nav-toggle-icon">+</span></button>
        <div class="af-nav-sub">
          <a href="fabric.html">All Fabrics</a>
          <a href="fabric.html">Lawn</a>
          <a href="fabric.html">Cotton</a>
        </div>
      </div>
      <div class="af-nav-item sale"><a class="af-nav-link" href="sale-page.html">Sale</a></div>
    </nav>
    <nav class="af-nav-menu" data-nav-panel="men" hidden>
      <div class="af-nav-item"><a class="af-nav-link" href="ready-to-wear.html">Men Ready to Wear</a></div>
      <div class="af-nav-item"><a class="af-nav-link" href="fabric.html">Men Fabrics</a></div>
    </nav>
    <div class="af-nav-footer">
      <a class="af-nav-track" href="track-your-order.html">
        <span class="af-nav-track-left"><img src="Assets/icons/truck.svg" alt=""> Track Your Order</span>
        <span>&rsaquo;</span>
      </a>
      <div class="af-nav-footer-meta">
        <span>Pakistan (PKR)</span>
        <a href="atelier-support.html">Customer Care</a>
      </div>
      <div class="af-nav-social">
        <a href="#" aria-label="Instagram"><img src="Assets/icons/instagram-icon.svg" alt=""></a>
        <a href="#" aria-label="Facebook"><img src="Assets/icons/facebook-icon.svg" alt=""></a>
        <a href="#" aria-label="X"><img src="Assets/icons/twitter-icon.svg" alt=""></a>
      </div>
    </div>
  </div>
</div>
<div class="af-overlay" data-cart-drawer>
  <div class="af-drawer af-drawer-right af-cart-drawer">
    <div class="af-cart-head">
      <h3>Shopping Bag (<span data-cart-count>0</span>)</h3>
      <button type="button" class="af-cart-close" data-close-cart aria-label="Close bag">&times;</button>
    </div>
    <div class="af-cart-body">
      <div class="af-cart-empty" data-cart-empty>
        <p class="af-cart-empty-title">Your bag is empty</p>
        <p class="af-cart-empty-hint">Discover our latest arrivals and add pieces you love.</p>
        <a href="arrival-page.html" class="af-btn af-btn-block">Shop New Arrivals</a>
      </div>
      <div class="af-cart-filled" data-cart-filled hidden>
        <div class="af-cart-items" data-cart-items></div>
        <div class="af-cart-foot">
          <div class="af-cart-subtotal-row">
            <span>Subtotal</span>
            <strong data-cart-subtotal>Rs. 0</strong>
          </div>
          <a href="checkout-information.html" class="af-btn af-btn-block">Proceed to Checkout</a>
        </div>
      </div>
    </div>
  </div>
</div>
<div class="af-overlay" data-auth-modal>
  <div class="af-modal af-auth-modal">
    <button type="button" class="af-close" data-close-auth>&times;</button>
    <div data-auth-view="signin" class="active">
      <h2>Arsalan Fabrics</h2>
      <p style="margin-bottom:16px;color:#8c8177;font-size:14px;">Sign in to your account</p>
      <form data-signin-form>
        <label>Email<input type="email" name="email" required></label>
        <label>Password<input type="password" name="password" required></label>
        <p class="af-error" data-auth-error hidden style="color:#6b1d1d;font-size:13px;"></p>
        <button type="submit" class="af-btn" style="width:100%;margin-top:8px;">Sign In</button>
      </form>
      <button type="button" data-open-register style="margin-top:16px;background:none;border:none;text-decoration:underline;cursor:pointer;">Create Account</button>
    </div>
    <div data-auth-view="register">
      <h2>Create Account</h2>
      <form data-register-form>
        <label>First Name<input name="firstName" required></label>
        <label>Last Name<input name="lastName" required></label>
        <label>Phone<input name="phone" required></label>
        <label>Email<input type="email" name="email" required></label>
        <label>Password<input type="password" name="password" required></label>
        <label>Confirm Password<input type="password" name="confirm" required></label>
        <button type="submit" class="af-btn" style="width:100%;">Create Account</button>
      </form>
    </div>
  </div>
</div>
<div class="af-overlay" data-logout-modal>
  <div class="af-modal af-modal-sm af-logout-modal" role="dialog" aria-labelledby="af-logout-title">
    <h3 id="af-logout-title">Log out of your account?</h3>
    <p class="af-logout-copy">You can sign in again anytime to view orders and saved items.</p>
    <div class="af-modal-actions af-logout-actions">
      <button type="button" class="af-btn af-btn-ghost" data-cancel-logout>Cancel</button>
      <button type="button" class="af-btn" data-confirm-logout>Log out</button>
    </div>
  </div>
</div>
<div class="af-overlay" data-wishlist-drawer>
  <div class="af-drawer af-drawer-right af-wishlist-drawer">
    <div class="af-cart-head">
      <h3>Wishlist</h3>
      <button type="button" class="af-cart-close" data-close-wishlist aria-label="Close wishlist">&times;</button>
    </div>
    <div class="af-cart-body">
      <div class="af-cart-empty" data-wishlist-empty>
        <p class="af-cart-empty-title">Your wishlist is empty</p>
        <p class="af-cart-empty-hint">Save pieces you love with the heart icon on any product.</p>
        <button type="button" class="af-btn af-btn-block" data-wishlist-signin hidden>Sign in to save items</button>
        <a href="arrival-page.html" class="af-btn af-btn-block">Shop New Arrivals</a>
      </div>
      <div class="af-cart-filled" data-wishlist-filled hidden>
        <div class="af-wishlist-items" data-wishlist-items></div>
        <div class="af-cart-foot">
          <a href="my-wishlist.html" class="af-btn af-btn-block af-btn-outline-dark">View full wishlist</a>
        </div>
      </div>
    </div>
  </div>
</div>`;
    document.body.appendChild(root);

    root.querySelectorAll('[data-nav-expand]').forEach((item) => {
      const btn = item.querySelector('button');
      btn?.addEventListener('click', () => {
        const open = item.classList.toggle('open');
        const icon = item.querySelector('.af-nav-toggle-icon');
        if (icon) icon.textContent = open ? '−' : '+';
      });
    });

    root.querySelectorAll('[data-nav-tab]').forEach((tab) => {
      tab.addEventListener('click', () => {
        root.querySelectorAll('[data-nav-tab]').forEach((t) => t.classList.toggle('active', t === tab));
        root.querySelectorAll('[data-nav-panel]').forEach((panel) => {
          panel.hidden = panel.dataset.navPanel !== tab.dataset.navTab;
        });
      });
    });
  },

  closeAllOverlays() {
    document.querySelectorAll('.af-overlay').forEach((o) => o.classList.remove('open'));
    document.body.classList.remove('overlay-open');
    ArsalanAuth.closeModal();
    this.closeHeaderSearch();
  },

  updateHeaderOffset() {
    const header = document.querySelector('header');
    if (!header) return;
    const h = Math.ceil(header.getBoundingClientRect().height);
    document.documentElement.style.setProperty('--af-header-offset', `${h}px`);
  },

  headerSearchRoot() {
    return document.getElementById('header-container') || document.querySelector('header');
  },

  closeHeaderSearch() {
    const root = this.headerSearchRoot();
    const bar = root?.querySelector('[data-header-search]');
    const toggle = root?.querySelector('[data-header-search-toggle]');
    if (!bar) return;
    bar.classList.remove('open');
    bar.setAttribute('aria-hidden', 'true');
    bar.inert = true;
    toggle?.setAttribute('aria-expanded', 'false');
    toggle?.setAttribute('aria-label', 'Open search');
    document.body.classList.remove('header-search-open');
    const input = bar.querySelector('[data-header-search-input]');
    input?.setAttribute('tabindex', '-1');
    input?.blur();
    if (document.activeElement?.closest('[data-header-search]')) {
      document.activeElement.blur();
    }
    window.setTimeout(() => this.updateHeaderOffset(), 320);
  },

  openHeaderSearch() {
    const root = this.headerSearchRoot();
    const bar = root?.querySelector('[data-header-search]');
    const toggle = root?.querySelector('[data-header-search-toggle]');
    if (!bar) return;
    bar.classList.remove('inert');
    bar.inert = false;
    bar.classList.add('open');
    bar.setAttribute('aria-hidden', 'false');
    toggle?.setAttribute('aria-expanded', 'true');
    toggle?.setAttribute('aria-label', 'Close search');
    document.body.classList.add('header-search-open');
    const input = bar.querySelector('[data-header-search-input]');
    input?.setAttribute('tabindex', '0');
    requestAnimationFrame(() => {
      this.updateHeaderOffset();
      input?.focus();
    });
  },

  wireHeaderSearch() {
    const root = this.headerSearchRoot();
    if (!root || root.dataset.searchWired === 'true') return;
    root.dataset.searchWired = 'true';

    const bar = root.querySelector('[data-header-search]');
    if (bar) {
      bar.inert = true;
      bar.querySelector('[data-header-search-input]')?.setAttribute('tabindex', '-1');
    }

    root.addEventListener('click', (e) => {
      if (e.target.closest('[data-close-header-search]')) {
        e.preventDefault();
        e.stopPropagation();
        this.closeHeaderSearch();
        return;
      }
      if (e.target.closest('[data-header-search-toggle]')) {
        e.preventDefault();
        e.stopPropagation();
        const searchBar = root.querySelector('[data-header-search]');
        if (searchBar?.classList.contains('open')) this.closeHeaderSearch();
        else this.openHeaderSearch();
      }
    });

    root.querySelector('[data-header-search-form]')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = root.querySelector('[data-header-search-input]');
      const term = String(input?.value || '').trim();
      if (!term) {
        input?.focus();
        return;
      }
      window.location.href = `best-seller.html?search=${encodeURIComponent(term)}`;
    });

    const preset = new URLSearchParams(window.location.search).get('search');
    const input = root.querySelector('[data-header-search-input]');
    if (preset && input) input.value = preset;
  },

  async renderWishlistDrawer() {
    const emptyEl = document.querySelector('[data-wishlist-empty]');
    const filledEl = document.querySelector('[data-wishlist-filled]');
    const listEl = document.querySelector('[data-wishlist-items]');
    const signInBtn = document.querySelector('[data-wishlist-signin]');
    if (!emptyEl || !filledEl || !listEl) return;

    const user = ArsalanAuth.user();
    const hasToken = Boolean(localStorage.getItem('af_token'));
    if (signInBtn) signInBtn.hidden = Boolean(user && hasToken);

    if (!user || !hasToken) {
      filledEl.hidden = true;
      emptyEl.hidden = false;
      emptyEl.querySelector('.af-cart-empty-title').textContent = 'Sign in to view your wishlist';
      emptyEl.querySelector('.af-cart-empty-hint').textContent =
        'Save your favorite suits and fabrics, then add them to your bag anytime.';
      if (signInBtn) {
        signInBtn.hidden = false;
        signInBtn.onclick = () => {
          this.closeAllOverlays();
          ArsalanAuth.openModal('signin');
        };
      }
      return;
    }

    try {
      const products = await ArsalanAPI.getWishlist();
      if (!products.length) {
        filledEl.hidden = true;
        emptyEl.hidden = false;
        emptyEl.querySelector('.af-cart-empty-title').textContent = 'Your wishlist is empty';
        emptyEl.querySelector('.af-cart-empty-hint').textContent =
          'Save pieces you love with the heart icon on any product.';
        if (signInBtn) signInBtn.hidden = true;
        return;
      }

      emptyEl.hidden = true;
      filledEl.hidden = false;
      listEl.innerHTML = products
        .map(
          (p) => `
        <div class="af-wishlist-line" data-wish-id="${p._id}">
          <a href="product-detail-page.html?id=${p._id}" class="af-wishlist-thumb">
            <img src="${ArsalanAPI.assetUrl(p.images?.[0])}" alt="">
          </a>
          <div class="af-wishlist-meta">
            <a href="product-detail-page.html?id=${p._id}" class="af-wishlist-name">${p.name}</a>
            <p class="af-wishlist-price">Rs. ${(p.salePrice || p.price).toLocaleString()}</p>
            <button type="button" class="af-wishlist-add-btn" data-add-wish-cart="${p._id}">Add to bag</button>
          </div>
          <button type="button" class="af-wishlist-remove" data-remove-wish="${p._id}" aria-label="Remove">&times;</button>
        </div>`
        )
        .join('');

      listEl.querySelectorAll('[data-add-wish-cart]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const p = products.find((x) => x._id === btn.dataset.addWishCart);
          if (!p) return;
          ArsalanCart.add({
            productId: p._id,
            name: p.name,
            price: p.salePrice || p.price,
            image: ArsalanAPI.assetUrl(p.images?.[0]),
            size: p.sizeInventory?.[0]?.size || 'M',
            color: p.color || '',
            quantity: 1,
          });
          ArsalanCart.updateBadge();
          ArsalanCart.renderDrawer();
          document.querySelector('[data-wishlist-drawer]')?.classList.remove('open');
          document.querySelector('[data-cart-drawer]')?.classList.add('open');
        });
      });

      listEl.querySelectorAll('[data-remove-wish]').forEach((btn) => {
        btn.addEventListener('click', async () => {
          await ArsalanAPI.removeWishlist(btn.dataset.removeWish);
          this.renderWishlistDrawer();
        });
      });
    } catch {
      filledEl.hidden = true;
      emptyEl.hidden = false;
    }
  },

  bindUI() {
    document.querySelectorAll('[data-open-signin]').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        ArsalanAuth.openModal('signin');
      });
    });
    document.querySelectorAll('[data-open-register]').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        ArsalanAuth.openModal('register');
      });
    });

    document.querySelector('.menuicon')?.addEventListener('click', () => {
      document.querySelector('[data-menu-drawer]')?.classList.add('open');
      document.body.classList.add('overlay-open');
    });
    document.querySelector('.cart')?.addEventListener('click', () => {
      ArsalanCart.renderDrawer();
      document.querySelector('[data-cart-drawer]')?.classList.add('open');
      document.body.classList.add('overlay-open');
    });
    document.querySelector('.header-wishlist')?.addEventListener('click', async () => {
      await this.renderWishlistDrawer();
      document.querySelector('[data-wishlist-drawer]')?.classList.add('open');
      document.body.classList.add('overlay-open');
    });
    this.wireHeaderSearch();
    if (!this._searchEscapeBound) {
      this._searchEscapeBound = true;
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') this.closeHeaderSearch();
      });
      document.addEventListener('click', (e) => {
        const root = this.headerSearchRoot();
        const bar = root?.querySelector('[data-header-search]');
        if (!bar?.classList.contains('open')) return;
        if (e.target.closest('[data-header-search]') || e.target.closest('[data-header-search-toggle]')) return;
        this.closeHeaderSearch();
      });
    }
    document.querySelector('.logo p')?.addEventListener('click', () => {
      window.location.href = 'index.html';
    });

    document.querySelectorAll('[data-close-menu],[data-close-cart],[data-close-auth],[data-close-wishlist]').forEach((el) => {
      el.addEventListener('click', () => this.closeAllOverlays());
    });

    document.querySelectorAll('.af-overlay').forEach((overlay) => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) this.closeAllOverlays();
      });
    });

    document.querySelector('[data-open-register]')?.addEventListener('click', () => {
      ArsalanAuth.openModal('register');
    });

    document.querySelector('[data-signin-form]')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      try {
        const data = await ArsalanAPI.login(fd.get('email'), fd.get('password'));
        ArsalanAuth.saveSession(data.token, data.user);
        this.closeAllOverlays();
        if (data.user.role === 'admin') window.location.href = 'admin/login.html';
        else window.location.href = 'customer-profile-dashboard.html';
      } catch (err) {
        const el = document.querySelector('[data-auth-error]');
        if (el) {
          el.textContent = err.message;
          el.hidden = false;
        }
      }
    });

    document.querySelector('[data-register-form]')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      if (fd.get('password') !== fd.get('confirm')) return alert('Passwords do not match');
      const data = await ArsalanAPI.register({
        name: `${fd.get('firstName')} ${fd.get('lastName')}`.trim(),
        phone: fd.get('phone'),
        email: fd.get('email'),
        password: fd.get('password'),
      });
      ArsalanAuth.saveSession(data.token, data.user);
      window.location.href = 'customer-profile-dashboard.html';
    });

    document.querySelector('[data-confirm-logout]')?.addEventListener('click', () => ArsalanAuth.logout());
    document.querySelector('[data-cancel-logout]')?.addEventListener('click', () => this.closeAllOverlays());
  },

  async loadHeaderFooter() {
    const [headerRes, footerRes] = await Promise.all([fetch('header.html'), fetch('footer.html')]);
    const headerHtml = await headerRes.text();
    const footerHtml = await footerRes.text();
    const headerEl = document.getElementById('header-container');
    const footerEl = document.getElementById('footer-container');
    if (headerEl) headerEl.innerHTML = this.injectFragment(headerHtml, 'header');
    if (footerEl) footerEl.innerHTML = this.injectFragment(footerHtml, 'footer');

    const settings = await ArsalanAPI.getPublicSettings().catch(() => null);
    const ticker =
      settings?.announcementText ||
      'FREE NATIONWIDE DELIVERY ON ORDERS OVER PKR 25,000 · READY-TO-WEAR AND UNSTITCHED SUITS AVAILABLE';
    document.querySelectorAll('header .announcement-group span').forEach((span) => {
      span.textContent = ticker;
    });

    this.wireCategoryTicker();
    this.wireHeaderSearch();
    this.closeHeaderSearch();
    this.updateHeaderOffset();
    window.addEventListener('resize', () => this.updateHeaderOffset());
  },

  wireCategoryTicker() {
    const map = {
      'Formal Stitched': 'formal-stitched-page.html',
      'Formal Unstitched': 'formal-unstitched-page.html',
      'Semi-Formal Stitched': 'semi-formal.html',
      'Semi-Formal Unstitched': 'semi-formal.html',
      'Eid & Festive Occasions': 'arrival-page.html',
      'Free Nationwide Delivery': 'track-your-order.html',
      'Wedding Guest': 'formal-dresses-page.html',
    };
    document.querySelectorAll('.announcement-main-bottom li').forEach((li) => {
      const label = li.textContent.trim();
      const href = map[label];
      if (!href) return;
      li.style.cursor = 'pointer';
      li.addEventListener('click', () => {
        window.location.href = href;
      });
    });
  },

  loadPageScripts() {
    const page = location.pathname.split('/').pop() || '';
    const scripts = [];
    const hasPlpGrid =
      document.querySelector('.products-grid') ||
      (document.querySelector('section.products .products-container')?.querySelector('.product-card'));
    if (hasPlpGrid && page !== 'my-wishlist.html') scripts.push('js/plp.js');
    if (page === 'product-detail-page.html') scripts.push('js/pdp.js');
    const storePages = [
      'checkout-information.html',
      'track-your-order.html',
      'customer-profile-dashboard.html',
      'profile-setting.html',
      'delivery-addresses.html',
      'order-history.html',
      'my-wishlist.html',
      'atelier-support.html',
    ];
    if (storePages.includes(page)) scripts.push('js/store-pages.js');
    if (page === 'index.html' || page === '') scripts.push('js/home.js');
    scripts.forEach((src) => {
      const s = document.createElement('script');
      s.src = src;
      s.defer = true;
      document.body.appendChild(s);
    });
  },

  loadSiteNav() {
    if (document.querySelector('script[data-site-nav]')) return;
    const s = document.createElement('script');
    s.src = 'js/site-nav.js';
    s.defer = true;
    s.dataset.siteNav = 'true';
    document.body.appendChild(s);
  },

  async init() {
    this.ensureStoreStyles();
    this.mountOverlays();
    await this.loadHeaderFooter();
    this.bindUI();
    ArsalanCart.updateBadge();
    this.loadSiteNav();
    this.loadPageScripts();
  },
};

document.addEventListener('DOMContentLoaded', () => {
  if (window.ArsalanApp) window.ArsalanApp.init();
});

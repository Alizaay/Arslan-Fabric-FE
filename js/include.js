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
  <div class="af-modal af-modal-sm">
    <h3>Log out of your account?</h3>
    <p>You can sign in again anytime to view orders and saved items.</p>
    <div class="af-modal-actions">
      <button type="button" data-cancel-logout>Cancel</button>
      <button type="button" class="af-btn" data-confirm-logout>Log Out</button>
    </div>
  </div>
</div>
<div class="af-overlay" data-search-modal>
  <div class="af-modal af-search-modal">
    <button type="button" class="af-close" data-close-search aria-label="Close search">&times;</button>
    <h2>Search the collection</h2>
    <p class="af-search-hint">Find suits, fabrics, or enter an article code.</p>
    <form data-search-form class="af-search-form">
      <input type="search" name="q" placeholder="Search…" autocomplete="off" required>
      <button type="submit" class="af-btn">Search</button>
    </form>
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
  },

  bindUI() {
    document.querySelector('.menuicon')?.addEventListener('click', () => {
      document.querySelector('[data-menu-drawer]')?.classList.add('open');
      document.body.classList.add('overlay-open');
    });
    document.querySelector('.cart')?.addEventListener('click', () => {
      ArsalanCart.renderDrawer();
      document.querySelector('[data-cart-drawer]')?.classList.add('open');
      document.body.classList.add('overlay-open');
    });
    document.querySelector('.header-wishlist')?.addEventListener('click', () => {
      const user = ArsalanAuth.user();
      if (user) window.location.href = 'my-wishlist.html';
      else ArsalanAuth.openModal('signin');
    });
    document.querySelector('.search')?.addEventListener('click', () => {
      document.querySelector('[data-search-modal]')?.classList.add('open');
      document.body.classList.add('overlay-open');
      setTimeout(() => document.querySelector('[data-search-form] input')?.focus(), 50);
    });
    document.querySelector('[data-close-search]')?.addEventListener('click', () => this.closeAllOverlays());
    document.querySelector('[data-search-form]')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const q = new FormData(e.target).get('q');
      if (q) window.location.href = `best-seller.html?search=${encodeURIComponent(String(q).trim())}`;
    });
    document.querySelector('.logo p')?.addEventListener('click', () => {
      window.location.href = 'index.html';
    });

    document.querySelectorAll('[data-close-menu],[data-close-cart],[data-close-auth]').forEach((el) => {
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
    if (document.querySelector('.products-grid') && page !== 'my-wishlist.html') scripts.push('js/plp.js');
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

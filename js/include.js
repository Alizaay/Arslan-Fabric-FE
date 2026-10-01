window.ArsalanApp = {
  injectFragment(html, selector) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const node = doc.querySelector(selector);
    return node ? node.innerHTML : html;
  },

  mountOverlays() {
    if (document.querySelector('[data-overlays-root]')) return;
    const root = document.createElement('div');
    root.setAttribute('data-overlays-root', 'true');
    root.innerHTML = `
<div class="af-overlay" data-menu-drawer>
  <div class="af-drawer af-drawer-left">
    <button type="button" class="af-close" data-close-menu>&times;</button>
    <p class="af-drawer-brand">Arsalan Fabrics</p>
    <nav class="af-drawer-nav">
      <a href="index.html">Home</a>
      <a href="arrival-page.html">New Arrivals</a>
      <a href="best-seller.html">Best Sellers</a>
      <a href="formal-dresses-page.html">Formal Dresses</a>
      <a href="formal-stitched-page.html">Formal Stitched</a>
      <a href="formal-unstitched-page.html">Formal Unstitched</a>
      <a href="semi-formal.html">Semi-Formal</a>
      <a href="ready-to-wear.html">Ready to Wear</a>
      <a href="2-pieces-collection-page.html">2 Piece</a>
      <a href="3-pieces-collection.html">3 Piece</a>
      <a href="fabric.html">Fabrics</a>
      <a href="sale-page.html">Sale</a>
      <a href="track-your-order.html">Track Your Order</a>
      <a href="customer-profile-dashboard.html">My Account</a>
      <a href="admin/login.html">Admin Portal</a>
    </nav>
  </div>
</div>
<div class="af-overlay" data-cart-drawer>
  <div class="af-drawer af-drawer-right">
    <button type="button" class="af-close" data-close-cart>&times;</button>
    <h3>Shopping Bag (<span data-cart-count>0</span> items)</h3>
    <div data-cart-empty>
      <p>Your bag is empty</p>
      <a href="arrival-page.html" class="af-btn">Shop New Arrivals</a>
    </div>
    <div data-cart-filled hidden>
      <div data-cart-items></div>
      <p>Subtotal: <strong data-cart-subtotal>Rs. 0</strong></p>
      <a href="checkout-information.html" class="af-btn">Proceed to Checkout</a>
    </div>
  </div>
</div>
<div class="af-overlay" data-auth-modal>
  <div class="af-modal">
    <button type="button" class="af-close" data-close-auth>&times;</button>
    <div data-auth-view="signin" class="active">
      <h2>Arsalan Fabrics</h2>
      <form data-signin-form>
        <label>Email<input type="email" name="email" required></label>
        <label>Password<input type="password" name="password" required></label>
        <p class="af-error" data-auth-error hidden></p>
        <button type="submit" class="af-btn">Sign in</button>
      </form>
      <button type="button" data-open-register>Create Account</button>
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
        <button type="submit" class="af-btn">Create Account</button>
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
</div>`;
    document.body.appendChild(root);
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
    document.querySelector('.notification')?.addEventListener('click', () => {
      const user = ArsalanAuth.user();
      if (user) window.location.href = 'customer-profile-dashboard.html';
      else ArsalanAuth.openModal('signin');
    });
    document.querySelector('.logo p')?.addEventListener('click', () => {
      window.location.href = 'index.html';
    });

    document.querySelectorAll('[data-close-menu],[data-close-cart],[data-close-auth]').forEach((el) => {
      el.addEventListener('click', () => {
        document.querySelectorAll('.af-overlay').forEach((o) => o.classList.remove('open'));
        document.body.classList.remove('overlay-open');
        ArsalanAuth.closeModal();
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
        ArsalanAuth.closeModal();
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
    document.querySelector('[data-cancel-logout]')?.addEventListener('click', () => {
      document.querySelector('[data-logout-modal]')?.classList.remove('open');
      document.body.classList.remove('overlay-open');
    });
  },

  async loadHeaderFooter() {
    const [headerRes, footerRes] = await Promise.all([
      fetch('header.html'),
      fetch('footer.html'),
    ]);
    const headerHtml = await headerRes.text();
    const footerHtml = await footerRes.text();
    const headerEl = document.getElementById('header-container');
    const footerEl = document.getElementById('footer-container');
    if (headerEl) headerEl.innerHTML = this.injectFragment(headerHtml, 'header');
    if (footerEl) footerEl.innerHTML = this.injectFragment(footerHtml, 'footer');

    const settings = await ArsalanAPI.getPublicSettings().catch(() => null);
    if (settings?.announcementText) {
      document.querySelectorAll('.announcement-group span').forEach((span) => {
        span.textContent = settings.announcementText;
      });
    }
  },

  async init() {
    this.mountOverlays();
    await this.loadHeaderFooter();
    this.bindUI();
    ArsalanCart.updateBadge();
  },
};

document.addEventListener('DOMContentLoaded', () => {
  if (window.ArsalanApp) window.ArsalanApp.init();
});

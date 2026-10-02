(function () {
  const footerMap = {
    'New Arrivals': 'arrival-page.html',
    'Formal Stitched': 'formal-stitched-page.html',
    'Formal Unstitched': 'formal-unstitched-page.html',
    'Semi-Formal Stitched': 'semi-formal.html',
    'Semi-Formal Unstitched': 'semi-formal.html',
    'Lawn & Chiffon': 'fabric.html',
    'Order Status': 'track-your-order.html',
    'Shipping & Delivery': 'track-your-order.html',
    'Returns & Exchanges': 'atelier-support.html',
    'Size Guide': 'product-detail-page.html',
    'Atelier Care': 'atelier-support.html',
    'Contact Us': 'atelier-support.html',
  };

  document.querySelectorAll('.footer-column li').forEach((li) => {
    const href = footerMap[li.textContent.trim()];
    if (!href) return;
    li.style.cursor = 'pointer';
    li.addEventListener('click', () => {
      window.location.href = href;
    });
  });

  const accountMap = {
    Dashboard: 'customer-profile-dashboard.html',
    'Profile Settings': 'profile-setting.html',
    'Delivery Addresses': 'delivery-addresses.html',
    'Order History': 'order-history.html',
    Wishlist: 'my-wishlist.html',
    'Atelier Support': 'atelier-support.html',
  };

  const page = location.pathname.split('/').pop() || 'index.html';

  function linkClassForNav(nav) {
    if (nav.classList.contains('wishlist-nav')) return 'wishlist-nav-link';
    if (nav.classList.contains('order-history-nav')) return 'order-history-nav-link';
    if (nav.classList.contains('delivery-nav')) return 'delivery-nav-item';
    if (nav.classList.contains('account-nav')) return 'account-nav-item';
    return 'dashboard-nav-link';
  }

  function wireSideNav(selector) {
    document.querySelectorAll(selector).forEach((nav) => {
      const linkClass = linkClassForNav(nav);
      nav.querySelectorAll('a').forEach((a) => {
        const key = Object.keys(accountMap).find((label) => a.textContent.trim().includes(label));
        if (key) {
          a.href = accountMap[key];
          a.classList.toggle('active', accountMap[key] === page);
        }
      });
      if (!nav.querySelector('[data-logout-link]')) {
        const logout = document.createElement('a');
        logout.href = '#';
        logout.className = linkClass;
        logout.dataset.logoutLink = 'true';
        logout.textContent = 'Log Out';
        nav.appendChild(logout);
      }
    });
  }

  wireSideNav('.dashboard-nav');
  wireSideNav('.wishlist-nav');
  wireSideNav('.order-history-nav');
  wireSideNav('.delivery-nav');
  wireSideNav('.account-nav');

  document.querySelectorAll('.account-sidebar').forEach((sidebar) => {
    if (sidebar.querySelector('nav')) return;
    sidebar.querySelectorAll(':scope > a').forEach((a) => {
      const key = Object.keys(accountMap).find((label) => a.textContent.trim().includes(label));
      if (key) {
        a.href = accountMap[key];
        a.classList.toggle('active', accountMap[key] === page);
      }
    });
    if (!sidebar.querySelector('[data-logout-link]')) {
      const logout = document.createElement('a');
      logout.href = '#';
      logout.dataset.logoutLink = 'true';
      logout.textContent = 'Log Out';
      sidebar.appendChild(logout);
    }
  });

  document.querySelectorAll('[data-logout-link]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelector('[data-logout-modal]')?.classList.add('open');
      document.body.classList.add('overlay-open');
    });
  });

  document.querySelectorAll('.dashboard-btn.light-btn, .dashboard-btn.dark-btn').forEach((btn) => {
    const t = btn.textContent.toUpperCase();
    if (t.includes('EDIT PROFILE')) btn.addEventListener('click', () => (window.location.href = 'profile-setting.html'));
    if (t.includes('MANAGE ADDRESS')) btn.addEventListener('click', () => (window.location.href = 'delivery-addresses.html'));
    if (t.includes('VIEW ALL ORDERS')) btn.addEventListener('click', () => (window.location.href = 'order-history.html'));
    if (t.includes('ADD NEW')) btn.addEventListener('click', () => (window.location.href = 'delivery-addresses.html'));
  });
})();

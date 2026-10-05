window.AdminSidebar = {

  items: [

    { href: 'index.html', label: 'Dashboard' },

    { href: 'products.html', label: 'Products' },

    { href: 'categories.html', label: 'Categories' },

    { href: 'orders.html', label: 'Orders', badge: true },

    { href: 'customers.html', label: 'Customers' },

    { href: 'delivery-charges.html', label: 'Delivery' },

    { href: 'website.html', label: 'Website' },

  ],



  normalizeShell() {

    document.querySelectorAll('.admin-sidebar').forEach((sidebar) => {

      const brandEl = sidebar.querySelector('.admin-brand');

      if (brandEl && !sidebar.querySelector('.admin-sidebar-brand')) {

        const wrap = document.createElement('div');

        wrap.className = 'admin-sidebar-brand';

        const parent = brandEl.parentElement;

        wrap.appendChild(brandEl);

        const small = parent?.querySelector('small');

        if (small) wrap.appendChild(small);

        sidebar.insertBefore(wrap, sidebar.firstChild);

        if (parent && parent !== sidebar && !parent.textContent.trim()) parent.remove();

      }



      if (!sidebar.querySelector('.admin-sidebar-foot')) {

        const foot = document.createElement('div');

        foot.className = 'admin-sidebar-foot';

        const store = document.createElement('a');

        store.className = 'admin-store-link';

        store.href = '../index.html';

        store.target = '_blank';

        store.rel = 'noopener';

        store.textContent = 'View storefront';

        foot.appendChild(store);



        let logout = sidebar.querySelector('[data-admin-logout]');

        if (!logout) {

          logout = document.createElement('button');

          logout.type = 'button';

          logout.dataset.adminLogout = 'true';

          logout.textContent = 'Log out';

          sidebar.appendChild(logout);

        }

        logout.classList.add('dashboard-btn', 'light-btn', 'btn-logout');

        if (/logout/i.test(logout.textContent)) logout.textContent = 'Log out';

        foot.appendChild(logout);

        sidebar.appendChild(foot);

      }

    });



    document.body.classList.add('admin-app');

  },



  render(active) {

    this.normalizeShell();

    document.querySelectorAll('.admin-sidebar').forEach((el) => el.setAttribute('data-admin-sidebar', ''));



    const nav = document.querySelector('[data-admin-nav]');

    if (!nav) return;

    nav.innerHTML = this.items

      .map(

        (item) =>

          `<a href="${item.href}" class="${active === item.href ? 'active' : ''}">${item.label}${

            item.badge ? ' <span class="nav-badge" data-new-orders-badge></span>' : ''

          }</a>`

      )

      .join('');



    document.querySelectorAll('[data-admin-logout]').forEach((btn) => {

      btn.replaceWith(btn.cloneNode(true));

    });

    document.querySelector('[data-admin-logout]')?.addEventListener('click', () => AdminAuth.logout());



    AdminAPI.request('/stats')

      .then((s) => {

        const badge = document.querySelector('[data-new-orders-badge]');

        if (badge && s.newOrders > 0) badge.textContent = String(s.newOrders);

        else if (badge) badge.textContent = '';

      })

      .catch(() => {});

  },

};


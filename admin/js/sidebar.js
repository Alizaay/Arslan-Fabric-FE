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
  render(active) {
    const nav = document.querySelector('[data-admin-nav]');
    if (!nav) return;
    nav.innerHTML = this.items
      .map(
        (item) =>
          `<a href="${item.href}" class="${active === item.href ? 'active' : ''}">${item.label}${
            item.badge ? ' <span data-new-orders-badge></span>' : ''
          }</a>`
      )
      .join('');
    document.querySelector('[data-admin-logout]')?.addEventListener('click', () => AdminAuth.logout());
    document.querySelectorAll('[data-admin-menu-toggle]').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelector('[data-admin-sidebar]')?.classList.toggle('open');
      });
    });
    AdminAPI.request('/stats')
      .then((s) => {
        const badge = document.querySelector('[data-new-orders-badge]');
        if (badge && s.newOrders) badge.textContent = `${s.newOrders} New`;
      })
      .catch(() => {});
  },
};

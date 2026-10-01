window.ArsalanCart = {
  key: 'af_cart',
  get() {
    try {
      return JSON.parse(localStorage.getItem(this.key) || '[]');
    } catch {
      return [];
    }
  },
  set(items) {
    localStorage.setItem(this.key, JSON.stringify(items));
    this.updateBadge();
    this.renderDrawer();
  },
  add(item) {
    const cart = this.get();
    const idx = cart.findIndex(
      (x) => x.productId === item.productId && x.size === item.size && x.color === item.color
    );
    if (idx >= 0) cart[idx].quantity += item.quantity || 1;
    else cart.push({ ...item, quantity: item.quantity || 1 });
    this.set(cart);
  },
  remove(index) {
    const cart = this.get();
    cart.splice(index, 1);
    this.set(cart);
  },
  count() {
    return this.get().reduce((n, i) => n + (i.quantity || 1), 0);
  },
  subtotal() {
    return this.get().reduce((n, i) => n + (i.price || 0) * (i.quantity || 1), 0);
  },
  updateBadge() {
    document.querySelectorAll('[data-cart-count]').forEach((el) => {
      el.textContent = String(this.count());
    });
  },
  renderDrawer() {
    const list = document.querySelector('[data-cart-items]');
    const empty = document.querySelector('[data-cart-empty]');
    const filled = document.querySelector('[data-cart-filled]');
    if (!list) return;
    const cart = this.get();
    if (!cart.length) {
      if (empty) empty.hidden = false;
      if (filled) filled.hidden = true;
      list.innerHTML = '';
      return;
    }
    if (empty) empty.hidden = true;
    if (filled) filled.hidden = false;
    list.innerHTML = cart
      .map(
        (item, i) => `
      <div class="cart-line">
        <img src="${item.image || 'Assets/images/arrivals-images-1.png'}" alt="">
        <div>
          <strong>${item.name}</strong>
          <p>${item.color || ''} / ${item.size || ''}</p>
          <p>Rs. ${(item.price || 0).toLocaleString()}</p>
        </div>
        <button type="button" data-remove-cart="${i}">×</button>
      </div>`
      )
      .join('');
    const subtotalEl = document.querySelector('[data-cart-subtotal]');
    if (subtotalEl) subtotalEl.textContent = `Rs. ${this.subtotal().toLocaleString()}`;
    list.querySelectorAll('[data-remove-cart]').forEach((btn) => {
      btn.addEventListener('click', () => this.remove(Number(btn.dataset.removeCart)));
    });
  },
};

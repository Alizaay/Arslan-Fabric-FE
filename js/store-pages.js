(function () {
  const page = location.pathname.split('/').pop() || '';

  function fmt(n) {
    return `Rs. ${Number(n || 0).toLocaleString()}`;
  }

  function fmtDate(d) {
    return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  function requireAuth() {
    if (!ArsalanAuth.user()) {
      ArsalanAuth.openModal('signin');
      return false;
    }
    return true;
  }

  function wireCheckoutRadioGroups() {
    function selectRow(row, rows) {
      rows.forEach((r) => {
        r.querySelector('.radio')?.classList.remove('selected');
        r.classList.remove('checkout-choice-selected');
        r.setAttribute('aria-checked', 'false');
      });
      row.querySelector('.radio')?.classList.add('selected');
      row.classList.add('checkout-choice-selected');
      row.setAttribute('aria-checked', 'true');
    }

    function bindGroup(rows) {
      rows.forEach((row) => {
        row.classList.add('checkout-choice');
        row.setAttribute('role', 'radio');
        row.setAttribute('tabindex', row.querySelector('.radio.selected') ? '0' : '-1');
        if (row.querySelector('.radio.selected')) row.classList.add('checkout-choice-selected');
        const activate = () => selectRow(row, rows);
        row.addEventListener('click', activate);
        row.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            activate();
          }
        });
      });
    }

    document.querySelectorAll('.shipping-option').forEach((el) => bindGroup([el]));

    const paymentRows = [
      ...document.querySelectorAll('.payment-box .payment-main'),
      ...document.querySelectorAll('.payment-box .payment-row'),
    ];
    if (paymentRows.length) bindGroup(paymentRows);

    const billingRows = [...document.querySelectorAll('.billing-box .billing-option')];
    if (billingRows.length) bindGroup(billingRows);

    const syncPaymentDescription = () => {
      const desc = document.querySelector('.payment-description');
      const cardSelected = document.querySelector('.payment-box .payment-main .radio.selected');
      if (desc) desc.hidden = !cardSelected;
    };
    paymentRows.forEach((row) => row.addEventListener('click', syncPaymentDescription));
    syncPaymentDescription();
  }

  function validatePostalCode(showError) {
    const input = document.getElementById('postal');
    const err = document.getElementById('postal-error');
    if (!input) return true;
    const raw = String(input.value || '').trim();
    if (!raw) {
      if (showError) {
        input.classList.add('error-input');
        if (err) err.hidden = false;
      } else {
        input.classList.remove('error-input');
        if (err) err.hidden = true;
      }
      return false;
    }
    const valid = /^\d{5}$/.test(raw);
    input.classList.toggle('error-input', showError && !valid);
    if (err) err.hidden = !showError || valid;
    return valid;
  }

  function updateBillingAddressPreview() {
    const el = document.querySelector('.billing-address');
    if (!el) return;
    const name = [document.getElementById('first-name')?.value, document.getElementById('last-name')?.value]
      .filter(Boolean)
      .join(' ')
      .trim();
    const city = document.getElementById('city')?.value?.trim() || 'Lahore';
    const province = document.getElementById('province')?.value?.trim() || 'Punjab';
    el.textContent = `${name || 'Guest'} · ${city}, ${province}, Pakistan`;
  }

  function selectedPaymentMethod() {
    const rows = [
      ...document.querySelectorAll('.payment-box .payment-main'),
      ...document.querySelectorAll('.payment-box .payment-row'),
    ];
    const selected = rows.find((r) => r.querySelector('.radio.selected'));
    if (!selected) return 'cod';
    if (selected.classList.contains('payment-main')) return 'card';
    const label = selected.textContent.toLowerCase();
    if (label.includes('jazz')) return 'jazzcash';
    if (label.includes('easy')) return 'easypaisa';
    return 'cod';
  }

  async function initCheckout() {
    wireCheckoutRadioGroups();

    const postalInput = document.getElementById('postal');
    postalInput?.addEventListener('input', () => {
      postalInput.value = postalInput.value.replace(/\D/g, '').slice(0, 5);
      validatePostalCode(false);
    });
    postalInput?.addEventListener('blur', () => validatePostalCode(true));

    ['first-name', 'last-name', 'city', 'province'].forEach((id) => {
      document.getElementById(id)?.addEventListener('input', updateBillingAddressPreview);
      document.getElementById(id)?.addEventListener('change', updateBillingAddressPreview);
    });
    updateBillingAddressPreview();

    const cart = ArsalanCart.get();
    const list = document.querySelector('.order-summary .product-list, .summary-products, aside .product-item');
    const parent = document.querySelector('.order-summary, aside');
    if (cart.length && parent) {
      const container = parent.querySelector('.products-stack') || parent;
      const html = cart
        .map(
          (item) => `
        <div class="product-item">
          <img class="product-image" src="${item.image || 'Assets/images/Checkout-information-image.png'}" alt="">
          <div>
            <strong>${item.name}</strong>
            <p>${item.color || ''} / ${item.size || ''} × ${item.quantity || 1}</p>
            <p>${fmt((item.price || 0) * (item.quantity || 1))}</p>
          </div>
        </div>`
        )
        .join('');
      const target = parent.querySelector('[data-checkout-lines]') || parent.querySelector('.product-item')?.parentElement;
      if (target) target.innerHTML = html;
    }

    const subtotal = ArsalanCart.subtotal();
    const productBlock = document.querySelector('.checkout-right .product');
    if (productBlock && cart.length) {
      const item = cart[0];
      productBlock.querySelector('.product-image')?.setAttribute('src', item.image || '');
      productBlock.querySelector('.product-name') && (productBlock.querySelector('.product-name').textContent = item.name);
      productBlock.querySelector('.product-variant') &&
        (productBlock.querySelector('.product-variant').textContent = `Color: ${item.color || '—'} / Size: ${item.size || '—'}`);
      productBlock.querySelector('.product-price') && (productBlock.querySelector('.product-price').textContent = fmt(item.price));
      productBlock.querySelector('.quantity') && (productBlock.querySelector('.quantity').textContent = String(item.quantity || 1));
    }

    const cityInput = document.getElementById('city');
    const updateShipping = async () => {
      const city = cityInput?.value || 'Lahore';
      document.querySelectorAll('.summary-row').forEach((row) => {
        const label = row.querySelector('span')?.textContent?.toLowerCase() || '';
        const strong = row.querySelector('strong');
        if (!strong) return;
        if (label.includes('subtotal')) strong.textContent = fmt(subtotal);
      });
      try {
        const quote = await ArsalanAPI.getShippingQuote(city, subtotal);
        document.querySelectorAll('.summary-row').forEach((row) => {
          const label = row.querySelector('span')?.textContent?.toLowerCase() || '';
          const strong = row.querySelector('strong');
          if (!strong) return;
          if (label.includes('shipping')) strong.textContent = fmt(quote.shipping);
        });
        const totalEl = document.querySelector('.total-price');
        if (totalEl) totalEl.innerHTML = `<span class="currency">PKR</span> ${fmt(quote.total)}`;
        const shipPrice = document.querySelector('.shipping-option .option-price');
        if (shipPrice) shipPrice.textContent = `PKR ${Number(quote.shipping).toLocaleString()}`;
      } catch {
        /* keep static fallback */
      }
    };
    cityInput?.addEventListener('change', updateShipping);
    cityInput?.addEventListener('blur', updateShipping);
    updateShipping();

    const user = ArsalanAuth.user();
    if (user) {
      const email = document.getElementById('email');
      if (email && !email.value) email.value = user.email;
      try {
        const me = await ArsalanAPI.getMe();
        const addr = me.addresses?.find((a) => a.isDefault) || me.addresses?.[0];
        if (addr) {
          document.getElementById('first-name') && (document.getElementById('first-name').value = addr.firstName || '');
          document.getElementById('last-name') && (document.getElementById('last-name').value = addr.lastName || '');
          document.getElementById('address') && (document.getElementById('address').value = addr.addressLine || '');
          document.getElementById('city') && (document.getElementById('city').value = addr.city || '');
          document.getElementById('postal') && (document.getElementById('postal').value = addr.postalCode || '');
          document.getElementById('phone') && (document.getElementById('phone').value = addr.phone || me.phone || '');
        }
      } catch {
        /* guest checkout */
      }
    }

    document.querySelector('.complete-btn, .checkout-btn, .place-order-btn, [data-place-order]')?.addEventListener('click', async (e) => {
      e.preventDefault();
      if (!cart.length) return alert('Your bag is empty.');
      if (!validatePostalCode(true)) {
        document.getElementById('postal')?.focus();
        return;
      }
      let userId = ArsalanAuth.user()?.id;
      if (!userId && localStorage.getItem('af_token')) {
        try {
          userId = (await ArsalanAPI.getMe())._id;
        } catch {
          userId = undefined;
        }
      }
      const payload = {
        email: document.getElementById('email')?.value,
        userId,
        paymentMethod: selectedPaymentMethod(),
        items: cart.map((c) => ({
          productId: c.productId,
          quantity: c.quantity || 1,
          size: c.size,
          color: c.color,
        })),
        shippingAddress: {
          firstName: document.getElementById('first-name')?.value,
          lastName: document.getElementById('last-name')?.value,
          addressLine: document.getElementById('address')?.value,
          suite: document.getElementById('suite')?.value,
          city: document.getElementById('city')?.value,
          postalCode: document.getElementById('postal')?.value,
          phone: document.getElementById('phone')?.value,
          country: 'Pakistan',
        },
      };
      try {
        const order = await ArsalanAPI.createOrder(payload);
        ArsalanCart.set([]);
        sessionStorage.setItem('af_last_order', order.orderNumber);
        window.location.href = `track-your-order.html?order=${encodeURIComponent(order.orderNumber)}`;
      } catch (err) {
        alert(err.message);
      }
    });
  }

  async function initTrack() {
    const params = new URLSearchParams(location.search);
    const preset = params.get('order') || sessionStorage.getItem('af_last_order');
    if (preset) document.getElementById('order-number').value = preset;

    document.querySelector('.track-order-btn')?.addEventListener('click', async (e) => {
      e.preventDefault();
      const orderNumber = document.getElementById('order-number')?.value?.trim();
      const contact = document.getElementById('order-contact')?.value?.trim();
      const isEmail = contact?.includes('@');
      try {
        const order = await ArsalanAPI.trackOrder(orderNumber, isEmail ? contact : '', isEmail ? '' : contact);
        renderTrackResult(order);
      } catch (err) {
        alert(err.message);
      }
    });

    if (preset) document.querySelector('.track-order-btn')?.click();
  }

  function renderTrackResult(order) {
    document.querySelector('.track-card .track-description')?.insertAdjacentHTML(
      'afterend',
      `<p data-track-result><strong>${order.orderNumber}</strong> · ${order.status.toUpperCase()}</p>`
    );
    document.querySelectorAll('[data-track-result]').forEach((el, i) => {
      if (i > 0) el.remove();
    });

    const statusEl = document.querySelector('.tracking-state, .order-status-label');
    if (statusEl) statusEl.textContent = order.status.toUpperCase();

    document.querySelectorAll('.summary-line').forEach((line) => {
      const label = line.querySelector('span')?.textContent?.toLowerCase() || '';
      const strong = line.querySelector('strong');
      if (!strong) return;
      if (label.includes('subtotal')) strong.textContent = fmt(order.subtotal);
      if (label.includes('shipping')) strong.textContent = fmt(order.shipping);
    });
    const totalStrong = document.querySelector('.summary-total strong');
    if (totalStrong) totalStrong.textContent = fmt(order.total);

    const timeline = document.querySelector('.timeline, .order-timeline, .tracking-steps');
    if (timeline && order.timeline?.length) {
      timeline.innerHTML = order.timeline
        .map(
          (t) => `
        <div class="timeline-step">
          <strong>${t.title || t.status}</strong>
          <p>${t.detail || ''}</p>
        </div>`
        )
        .join('');
    }

    const itemsWrap = document.querySelector('.order-items, .shipment-items');
    if (itemsWrap && order.items?.length) {
      itemsWrap.innerHTML = order.items
        .map(
          (item) => `
        <div class="order-line-item">
          <img src="${ArsalanAPI.assetUrl(item.image)}" alt="">
          <div>
            <strong>${item.name}</strong>
            <p>${item.size || ''} · Qty ${item.quantity}</p>
            <p>${fmt(item.price * item.quantity)}</p>
          </div>
        </div>`
        )
        .join('');
    }
  }

  async function initDashboard() {
    if (!requireAuth()) return;
    const me = await ArsalanAPI.getMe();
    document.querySelector('.dashboard-welcome h1') && (document.querySelector('.dashboard-welcome h1').textContent = me.name);
    document.querySelector('.store-credit strong') && (document.querySelector('.store-credit strong').textContent = fmt(me.storeCredit || 0));

    document.querySelectorAll('.profile-card .profile-item').forEach((item) => {
      const label = item.querySelector('span')?.textContent || '';
      const p = item.querySelector('p');
      if (!p) return;
      if (label.includes('FULL NAME')) p.textContent = me.name;
      if (label.includes('EMAIL')) p.textContent = me.email;
      if (label.includes('PHONE')) p.textContent = me.phone || '—';
    });

    const addr = me.addresses?.find((a) => a.isDefault) || me.addresses?.[0];
    const addrBox = document.querySelector('.address-information');
    if (addr && addrBox) {
      addrBox.innerHTML = `
        <strong>${addr.firstName || ''} ${addr.lastName || ''}</strong>
        <p>${addr.addressLine || ''}, ${addr.city || ''}, ${addr.postalCode || ''}, ${addr.country || 'Pakistan'}</p>
        <span>Phone: ${addr.phone || me.phone || ''}</span>`;
    }

    const orders = await ArsalanAPI.getMyOrders();
    const ordersCard = document.querySelector('.orders-card');
    if (ordersCard && orders.length) {
      const rows = orders.slice(0, 3).map(
        (o) => `
      <div class="order-row">
        <div class="order-details">
          <strong>${o.orderNumber}</strong>
          <span>Placed on ${fmtDate(o.createdAt)}</span>
        </div>
        <div class="order-price">${fmt(o.total)}</div>
        <span class="order-status ${o.status}">${o.status.toUpperCase()}</span>
      </div>`
      );
      const btn = ordersCard.querySelector('.orders-button');
      ordersCard.querySelectorAll('.order-row').forEach((r) => r.remove());
      btn?.insertAdjacentHTML('beforebegin', rows.join(''));
    }

    wireAccountNav();
  }

  async function initProfileSettings() {
    if (!requireAuth()) return;
    const me = await ArsalanAPI.getMe();
    const form = document.querySelector('.profile-form, form');
    if (!form) return;
    const full = document.getElementById('full-name');
    if (full) full.value = me.name || '';
    const email = document.getElementById('email');
    if (email) email.value = me.email || '';
    const phone = document.getElementById('phone');
    if (phone) phone.value = me.phone || '';
    const birthday = document.getElementById('birthday');
    if (birthday && me.dateOfBirth) birthday.value = me.dateOfBirth;
    const gender = document.getElementById('gender');
    if (gender && me.gender) gender.value = me.gender;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      await ArsalanAPI.updateMe({
        name: document.getElementById('full-name')?.value || me.name,
        phone: document.getElementById('phone')?.value,
        dateOfBirth: document.getElementById('birthday')?.value,
        gender: document.getElementById('gender')?.value,
        preferences: {
          emailNewsletter: form.querySelector('.preference-item:nth-child(1) input')?.checked,
          smsTracking: form.querySelector('.preference-item:nth-child(2) input')?.checked,
        },
      });
      alert('Profile updated.');
    });
    wireAccountNav();
  }

  async function initAddresses() {
    if (!requireAuth()) return;
    const me = await ArsalanAPI.getMe();
    const grid = document.querySelector('.address-grid');
    if (grid && me.addresses?.length) {
      grid.innerHTML = me.addresses
        .map(
          (a) => `
        <div class="address-card${a.isDefault ? ' default-address' : ''}" data-id="${a._id}">
          <div class="address-top">
            ${a.isDefault ? '<span class="default-label">DEFAULT ADDRESS</span>' : `<button type="button" class="set-default" data-set-default="${a._id}">Set as Default</button>`}
            <span class="address-type">${a.label || 'Home'}</span>
          </div>
          <h3>${a.firstName || ''} ${a.lastName || ''}</h3>
          <p>${a.addressLine}, ${a.city}, ${a.postalCode || ''}, ${a.country || 'Pakistan'}</p>
          <span class="phone">Phone: ${a.phone || me.phone || ''}</span>
          <div class="address-actions">
            <button type="button" data-delete-address="${a._id}">Delete</button>
          </div>
        </div>`
        )
        .join('');
      grid.querySelectorAll('[data-set-default]').forEach((btn) => {
        btn.addEventListener('click', async () => {
          await ArsalanAPI.updateAddress(btn.dataset.setDefault, { isDefault: true });
          initAddresses();
        });
      });
      grid.querySelectorAll('[data-delete-address]').forEach((btn) => {
        btn.addEventListener('click', async () => {
          if (confirm('Remove this address?')) {
            await ArsalanAPI.deleteAddress(btn.dataset.deleteAddress);
            initAddresses();
          }
        });
      });
    }

    document.querySelector('.add-address form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      await ArsalanAPI.addAddress({
        label: 'Home',
        firstName: document.getElementById('first-name')?.value,
        lastName: document.getElementById('last-name')?.value,
        addressLine: document.getElementById('street')?.value,
        city: document.getElementById('city')?.value,
        province: document.getElementById('province')?.value,
        postalCode: document.getElementById('postal')?.value,
        phone: me.phone,
        country: 'Pakistan',
        isDefault: !me.addresses?.length,
      });
      location.reload();
    });
    wireAccountNav();
  }

  async function initOrderHistory() {
    if (!requireAuth()) return;
    const orders = await ArsalanAPI.getMyOrders();
    const card = document.querySelector('.order-history-card');
    if (card) {
      card.querySelectorAll('.order-history-order').forEach((el) => el.remove());
      const html = orders
        .map(
          (o) => `
        <div class="order-history-order">
          <div class="order-history-order-header">
            <div class="order-history-order-info">
              <strong>${o.orderNumber}</strong>
              <span>Placed on ${fmtDate(o.createdAt)}</span>
            </div>
            <div class="order-history-order-right">
              <strong>${fmt(o.total)}</strong>
              <span class="order-history-status ${o.status}">${o.status.toUpperCase()}</span>
            </div>
          </div>
          <div class="order-history-products">
            ${(o.items || [])
              .map(
                (item) => `
              <div class="order-history-product">
                <div class="order-history-product-image">
                  <img src="${ArsalanAPI.assetUrl(item.image)}" alt="">
                </div>
                <div class="order-history-product-details">
                  <h3>${item.name}</h3>
                  <p>Qty: ${item.quantity} · Size: ${item.size || '—'}</p>
                </div>
              </div>`
              )
              .join('')}
          </div>
          <div class="order-history-order-footer">
            <div class="order-history-order-links">
              <a href="track-your-order.html?order=${encodeURIComponent(o.orderNumber)}" class="track-link">Track Shipment</a>
            </div>
          </div>
        </div>`
        )
        .join('');
      card.insertAdjacentHTML('beforeend', html || '<p>No orders yet.</p>');
    }
    wireAccountNav();
  }

  async function initWishlist() {
    if (!requireAuth()) return;
    const products = await ArsalanAPI.getWishlist();
    const grid = document.querySelector('.wishlist-grid');
    if (grid) {
      grid.innerHTML = products.length
        ? products
            .map(
              (p) => `
          <article class="wishlist-product">
            <div class="wishlist-product-image">
              <a href="product-detail-page.html?id=${p._id}"><img src="${ArsalanAPI.assetUrl(p.images?.[0])}" alt=""></a>
              <button type="button" class="wishlist-heart" data-remove-wish="${p._id}" aria-label="Remove">♥</button>
            </div>
            <div class="wishlist-product-info">
              <div class="wishlist-product-title">
                <h3>${p.name}</h3>
                <strong>${fmt(p.salePrice || p.price)}</strong>
              </div>
              <p>${p.category?.name || ''}</p>
              <p>${p.fabric || ''} — ${p.pieceType || ''}</p>
              <button type="button" class="wishlist-add" data-add-wish-cart="${p._id}">ADD TO BAG</button>
            </div>
          </article>`
            )
            .join('')
        : '<p>Your wishlist is empty.</p>';
      grid.querySelectorAll('[data-remove-wish]').forEach((btn) => {
        btn.addEventListener('click', async () => {
          await ArsalanAPI.removeWishlist(btn.dataset.removeWish);
          initWishlist();
        });
      });
      grid.querySelectorAll('[data-add-wish-cart]').forEach((btn) => {
        btn.addEventListener('click', async () => {
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
          ArsalanCart.renderDrawer();
        });
      });
    }
    wireAccountNav();
  }

  async function initSupport() {
    if (!requireAuth()) return;
    try {
      const me = await ArsalanAPI.getMe();
      const greeting = document.querySelector('[data-support-greeting]');
      if (greeting && me.name) greeting.textContent = `Hello, ${me.name.split(' ')[0]}`;
    } catch {
      /* keep default heading */
    }
    const form = document.getElementById('support-form') || document.querySelector('[data-support-form]');
    const loadTickets = async () => {
      const tickets = await ArsalanAPI.getSupportTickets();
      const list = document.getElementById('ticket-list');
      if (list) {
        list.innerHTML = tickets.length
          ? tickets
              .map(
                (t) =>
                  `<div class="ticket-item"><strong>${t.subject}</strong>${t.ticketNumber} · <span>${t.status}</span></div>`
              )
              .join('')
          : '<p class="ticket-empty">No support tickets yet.</p>';
      }
    };
    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      await ArsalanAPI.createSupportTicket({
        subject: fd.get('subject'),
        message: fd.get('message'),
        topic: fd.get('topic'),
        orderNumber: fd.get('orderNumber'),
      });
      alert('Your message was sent to Atelier Support.');
      form.reset();
      loadTickets();
    });
    loadTickets().catch(() => {});
    wireAccountNav();
  }

  function wireAccountNav() {
    const map = {
      'customer-profile-dashboard.html': ['Dashboard'],
      'profile-setting.html': ['Profile Settings', 'Profile'],
      'delivery-addresses.html': ['Delivery Addresses', 'Addresses'],
      'order-history.html': ['Order History', 'Orders'],
      'my-wishlist.html': ['Wishlist'],
      'atelier-support.html': ['Atelier Support', 'Support'],
    };
    document.querySelectorAll('.dashboard-nav-link, .account-sidebar a').forEach((a) => {
      const key = Object.keys(map).find((href) => map[href].some((label) => a.textContent.includes(label)));
      if (key) a.href = key;
      a.classList.toggle('active', key === page);
    });
  }

  const initByPage = {
    'checkout-information.html': initCheckout,
    'track-your-order.html': initTrack,
    'customer-profile-dashboard.html': initDashboard,
    'profile-setting.html': initProfileSettings,
    'delivery-addresses.html': initAddresses,
    'order-history.html': initOrderHistory,
    'my-wishlist.html': initWishlist,
    'atelier-support.html': initSupport,
  };

  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      initByPage[page]?.();
    }, 100);
  });
})();

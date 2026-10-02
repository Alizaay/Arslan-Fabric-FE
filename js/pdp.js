(function () {
  const params = new URLSearchParams(location.search);
  let id = params.get('id');

  const $ = (sel) => document.querySelector(sel);

  function setText(sel, text) {
    const el = $(sel);
    if (el && text !== undefined && text !== null) el.textContent = text;
  }

  let quantity = 1;

  function selectedSize() {
    const active = document.querySelector('.size-option.active');
    return active?.textContent?.trim() || 'M';
  }

  function bindSizes(p) {
    const wrap = $('.detail-sizes');
    if (!wrap) return;
    const sizes = p.sizeInventory?.length ? p.sizeInventory : [{ size: 'S' }, { size: 'M' }, { size: 'L' }];
    wrap.innerHTML = sizes
      .map(
        (row, i) =>
          `<button type="button" class="size-option${i === 1 ? ' active' : ''}" ${row.quantity === 0 ? 'disabled' : ''}>${row.size}</button>`
      )
      .join('');
    wrap.querySelectorAll('.size-option').forEach((btn) => {
      btn.addEventListener('click', () => {
        wrap.querySelectorAll('.size-option').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  }

  function addToCart(p, imgs) {
    ArsalanCart.add({
      productId: p._id,
      name: p.name,
      price: p.salePrice || p.price,
      image: ArsalanAPI.assetUrl(imgs[0]),
      size: selectedSize(),
      color: p.color || '',
      quantity,
    });
    document.querySelector('[data-cart-drawer]')?.classList.add('open');
    document.body.classList.add('overlay-open');
    ArsalanCart.renderDrawer();
  }

  async function init() {
    if (!id) {
      const list = await ArsalanAPI.getProducts({ featured: 'true' });
      if (list[0]) {
        id = list[0]._id;
        history.replaceState(null, '', `product-detail-page.html?id=${id}`);
      } else return;
    }

    const p = await ArsalanAPI.getProduct(id);
    setText('.detail-product-title', p.name);
    setText('.detail-category', (p.category?.name || 'COLLECTION').toUpperCase());
    setText('.product-sku', `SKU: ${p.articleCode}`);
    setText('.detail-description', p.description || '');
    setText('.rating-count', `(${p.reviewCount || 0} Reviews)`);
    setText('.detail-option-heading span', (p.color || 'DEFAULT').toUpperCase());

    const priceEl = $('.detail-price .current-price') || $('.current-price');
    if (priceEl) priceEl.textContent = `Rs. ${(p.salePrice || p.price).toLocaleString()}`;

    const imgs = p.images?.length ? p.images : ['Assets/images/products-detail-main-image (4).png'];
    const main = $('.product-main-image img');
    if (main) {
      main.src = ArsalanAPI.assetUrl(imgs[0]);
      main.alt = p.name;
    }

    const thumbs = $('.product-thumbnails');
    if (thumbs) {
      thumbs.innerHTML = imgs
        .map(
          (src, i) => `
        <button type="button" class="thumbnail${i === 0 ? ' active' : ''}" aria-label="Image ${i + 1}">
          <img src="${ArsalanAPI.assetUrl(src)}" alt="">
        </button>`
        )
        .join('');
      thumbs.querySelectorAll('.thumbnail').forEach((btn) => {
        btn.addEventListener('click', () => {
          thumbs.querySelectorAll('.thumbnail').forEach((t) => t.classList.remove('active'));
          btn.classList.add('active');
          if (main) main.src = btn.querySelector('img').src;
        });
      });
    }

    bindSizes(p);

    const qtyWrap = $('.quantity-selector');
    if (qtyWrap) {
      const span = qtyWrap.querySelector('span');
      qtyWrap.querySelector('[aria-label="Decrease quantity"]')?.addEventListener('click', () => {
        quantity = Math.max(1, quantity - 1);
        if (span) span.textContent = String(quantity);
      });
      qtyWrap.querySelector('[aria-label="Increase quantity"]')?.addEventListener('click', () => {
        quantity += 1;
        if (span) span.textContent = String(quantity);
      });
    }

    document.querySelectorAll('.add-to-bag, .detail-add-btn, [data-add-to-bag]').forEach((btn) => {
      btn.addEventListener('click', () => addToCart(p, imgs));
    });

    document.querySelector('.buy-now')?.addEventListener('click', () => {
      addToCart(p, imgs);
      window.location.href = 'checkout-information.html';
    });

    document.querySelector('.detail-wishlist')?.addEventListener('click', async () => {
      if (!ArsalanAuth.user()) return ArsalanAuth.openModal('signin');
      await ArsalanAPI.addWishlist(p._id);
      document.querySelector('.detail-wishlist').innerHTML = '&#9829;';
    });

    ArsalanAPI.getPublicSettings()
      .then((s) => {
        const min = s.freeShippingThreshold || s.delivery?.freeShippingMin || 10000;
        const note = document.querySelector('.delivery-title');
        if (note) note.textContent = `Complimentary shipping on orders over Rs. ${Number(min).toLocaleString()}`;
      })
      .catch(() => {});
  }

  init().catch((e) => console.error(e));
})();

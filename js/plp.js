(function () {
  const PLP_BY_PAGE = {
    'formal-stitched-page.html': { categorySlug: 'formal-stitched' },
    'formal-unstitched-page.html': { categorySlug: 'formal-unstitched' },
    'formal-dresses-page.html': { categorySlug: 'formal-dresses' },
    'semi-formal.html': { categorySlug: 'semi-formal' },
    'ready-to-wear.html': { productType: 'Ready to Wear' },
    '2-pieces-collection-page.html': { pieceType: '2 Piece' },
    '3-pieces-collection.html': { pieceType: '3 Piece' },
    'fabric.html': { productType: 'Fabric' },
    'sale-page.html': { sale: 'true' },
    'best-seller.html': { tag: 'bestseller' },
    'arrival-page.html': { newArrival: 'true' },
  };

  function stars(rating) {
    const n = Math.min(5, Math.max(1, Math.round(rating || 5)));
    return '★'.repeat(n);
  }

  function formatPrice(p) {
    const price = p.salePrice || p.price;
    if (p.salePrice && p.salePrice < p.price) {
      return `<del>Rs. ${p.price.toLocaleString()}</del><span>Rs. ${p.salePrice.toLocaleString()}</span>`;
    }
    return `<span>Rs. ${price.toLocaleString()}</span>`;
  }

  function cardHtml(p) {
    const img = ArsalanAPI.assetUrl(p.images?.[0]);
    const catName = (p.category?.name || 'COLLECTION').toUpperCase();
    const piece = (p.pieceType || p.productType || '').toUpperCase();
    const typeLine = [catName, piece].filter(Boolean).join(' · ');
    const detail = p.fabric || p.description?.slice(0, 60) || '';
    const extra = p.season ? `Season: ${p.season}` : 'Crafted with premium materials';
    const swatch = p.color ? `<span style="--swatch: #8c8177" title="${p.color}"></span>` : '';
    return `
      <article class="product-card" data-product-id="${p._id}">
        <a href="product-detail-page.html?id=${p._id}" class="product-image">
          <img src="${img}" alt="${p.name}">
        </a>
        <div class="product-info">
          <div class="product-top">
            <h3><a href="product-detail-page.html?id=${p._id}">${p.name}</a></h3>
            <div class="product-price">${formatPrice(p)}</div>
          </div>
          <p class="product-type">${typeLine}</p>
          <p class="product-detail">${detail}</p>
          <p class="product-extra">${extra}</p>
          <div class="product-bottom">
            <div class="product-colors">${swatch}</div>
            <div class="product-rating">${stars(p.ratingAvg)}</div>
          </div>
          <button type="button" class="quick-add" data-quick-add="${p._id}">QUICK ADD +</button>
        </div>
      </article>`;
  }

  function readFilters() {
    const page = location.pathname.split('/').pop() || 'index.html';
    const base = { ...(PLP_BY_PAGE[page] || {}) };
    const q = new URLSearchParams(location.search).get('search');
    if (q) base.search = q;
    const fabric = document.querySelector('#fabric, select[name="fabric"]')?.value;
    const price = document.querySelector('#price, select[name="price"]')?.value;
    if (fabric) base.fabric = fabric;
    if (price === 'low-high') base.sort = 'price-asc';
    if (price === 'high-low') base.sort = 'price-desc';
    if (price === 'under-5000') base.maxPrice = '5000';
    if (price === '5000-10000') {
      base.minPrice = '5000';
      base.maxPrice = '10000';
    }
    return base;
  }

  function wirePlpChrome() {
    const subNavMap = {
      'All Best Sellers': 'best-seller.html',
      'Formal Stitched': 'formal-stitched-page.html',
      'Formal Unstitched': 'formal-unstitched-page.html',
      'Semi-Formal Stitched': 'semi-formal.html',
      'Semi-Formal Unstitched': 'semi-formal.html',
    };
    document.querySelectorAll('.listsection-nav a').forEach((a) => {
      const href = subNavMap[a.textContent.trim()];
      if (href) a.href = href;
    });
    document.querySelector('.hero-back')?.setAttribute('href', 'index.html');
    const q = new URLSearchParams(location.search).get('search');
    if (q) {
      const h1 = document.querySelector('.hero h1, .collection-hero h1, h1');
      if (h1) h1.textContent = `Results for “${q}”`;
      document.title = `Search: ${q} | Arsalan Fabrics`;
    }
  }

  async function loadGrid() {
    const grid = document.querySelector('.products-grid');
    if (!grid) return;
    wirePlpChrome();
    grid.setAttribute('aria-busy', 'true');
    try {
      const products = await ArsalanAPI.getProducts(readFilters());
      if (!products.length) {
        grid.innerHTML = `<p class="plp-empty" style="grid-column:1/-1;padding:48px;text-align:center;">No designs match this collection yet. Check back soon.</p>`;
      } else {
        grid.innerHTML = products.map(cardHtml).join('');
      }
      grid.querySelectorAll('[data-quick-add]').forEach((btn) => {
        btn.addEventListener('click', async () => {
          const id = btn.dataset.quickAdd;
          const p = products.find((x) => x._id === id) || (await ArsalanAPI.getProduct(id));
          ArsalanCart.add({
            productId: p._id,
            name: p.name,
            price: p.salePrice || p.price,
            image: ArsalanAPI.assetUrl(p.images?.[0]),
            size: p.sizeInventory?.[0]?.size || 'M',
            color: p.color || '',
            quantity: 1,
          });
          document.querySelector('[data-cart-drawer]')?.classList.add('open');
          document.body.classList.add('overlay-open');
          ArsalanCart.renderDrawer();
        });
      });
    } catch (err) {
      grid.innerHTML = `<p class="plp-error" style="grid-column:1/-1;color:#6b1d1d;">${err.message}</p>`;
    } finally {
      grid.removeAttribute('aria-busy');
    }
  }

  document.querySelectorAll('#fabric, #price, select[name="fabric"], select[name="price"]').forEach((el) => {
    el.addEventListener('change', loadGrid);
  });

  loadGrid();
})();

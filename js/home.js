(function () {
  if (!document.querySelector('.arrival-section') && !document.querySelector('.category-grid')) return;

  const categoryHrefs = [
    'formal-stitched-page.html',
    'formal-unstitched-page.html',
    'semi-formal.html',
    'formal-unstitched-page.html',
  ];

  document.querySelectorAll('.category-grid .category-card').forEach((el, i) => {
    el.href = categoryHrefs[i] || 'index.html';
  });

  const viewAll = document.querySelector('.arrival-view-all');
  if (viewAll) viewAll.href = 'arrival-page.html';
  const piecesBtn = document.querySelector('.pieces-btn');
  if (piecesBtn) piecesBtn.href = 'best-seller.html';

  function bindProductActions(root) {
    root.querySelectorAll('[data-quick-add]').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const id = btn.dataset.quickAdd;
        const p = await ArsalanAPI.getProduct(id);
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
    root.querySelectorAll('[data-wishlist-id]').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!ArsalanAuth.user()) return ArsalanAuth.openModal('signin');
        await ArsalanAPI.addWishlist(btn.dataset.wishlistId);
        btn.textContent = '♥';
      });
    });
  }

  function arrivalCard(p) {
    const img = ArsalanAPI.assetUrl(p.images?.[0]);
    const price = p.salePrice || p.price;
    return `
      <article class="arrival-product">
        <div class="arrival-image">
          <a href="product-detail-page.html?id=${p._id}"><img src="${img}" alt="${p.name}"></a>
          ${p.newArrival ? '<span class="product-badge">NEW</span>' : ''}
          <button type="button" class="product-wishlist" data-wishlist-id="${p._id}" aria-label="Wishlist">♡</button>
        </div>
        <div class="product-meta">
          <div class="product-category-rating">
            <span class="product-category">${(p.category?.name || 'COLLECTION').toUpperCase()}</span>
            <span class="product-rating"><span>★★★★★</span></span>
          </div>
          <h3><a href="product-detail-page.html?id=${p._id}">${p.name}</a></h3>
          <div class="product-price">PKR ${price.toLocaleString()}</div>
          <button type="button" class="quick-add" data-quick-add="${p._id}">QUICK ADD +</button>
        </div>
      </article>`;
  }

  function pieceCard(p, badge) {
    const img = ArsalanAPI.assetUrl(p.images?.[0]);
    const price = p.salePrice || p.price;
    return `
      <article class="piece-card" data-href="product-detail-page.html?id=${p._id}">
        <div class="piece-image">
          <span class="piece-badge">${badge}</span>
          <button type="button" class="piece-wishlist" data-wishlist-id="${p._id}" aria-label="Wishlist">♡</button>
          <img src="${img}" alt="${p.name}">
        </div>
        <div class="piece-info">
          <span class="piece-category">${(p.category?.name || 'COLLECTION').toUpperCase()}</span>
          <h3>${p.name}</h3>
          <p class="piece-price">PKR ${price.toLocaleString()}</p>
          <div class="piece-rating"><span class="stars">★★★★★</span><span>${p.ratingAvg || 5}</span></div>
        </div>
      </article>`;
  }

  Promise.all([
    ArsalanAPI.getProducts({ newArrival: 'true' }),
    ArsalanAPI.getProducts({ tag: 'bestseller' }),
  ])
    .then(([arrivals, bestsellers]) => {
      const arrivalEl = document.querySelector('.arrival-products');
      if (arrivalEl && arrivals.length) {
        arrivalEl.innerHTML = arrivals.slice(0, 4).map(arrivalCard).join('');
        bindProductActions(arrivalEl);
      }

      const piecesGrid = document.querySelector('.pieces-grid');
      if (piecesGrid && bestsellers.length) {
        const badges = ['#1 BEST SELLER', '#2 BEST SELLER', '#3 BEST SELLER', 'TRENDING NOW'];
        piecesGrid.innerHTML = bestsellers.slice(0, 4).map((p, i) => pieceCard(p, badges[i])).join('');
        piecesGrid.querySelectorAll('.piece-card[data-href]').forEach((card) => {
          card.style.cursor = 'pointer';
          card.addEventListener('click', (e) => {
            if (e.target.closest('button')) return;
            window.location.href = card.dataset.href;
          });
        });
        bindProductActions(piecesGrid);
        piecesGrid.querySelectorAll('.piece-wishlist').forEach((btn) => {
          btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            if (!ArsalanAuth.user()) return ArsalanAuth.openModal('signin');
            await ArsalanAPI.addWishlist(btn.dataset.wishlistId);
            btn.textContent = '♥';
          });
        });
      }
    })
    .catch(() => {});
})();

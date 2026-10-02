window.ArsalanAPI = {
  get base() {
    return window.API_BASE || '';
  },
  assetUrl(path) {
    if (!path) return 'Assets/images/arrivals-images-1.png';
    if (path.startsWith('http') || path.startsWith('Assets/')) return path;
    if (path.startsWith('/')) return `${this.base}${path}`;
    return path;
  },
  async request(path, options = {}) {
    const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
    const token = localStorage.getItem('af_token');
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetch(`${this.base}/api${path}`, { ...options, headers });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || 'Request failed');
    return data;
  },
  getPublicSettings() {
    return this.request('/settings/public');
  },
  getProducts(params = {}) {
    const q = new URLSearchParams(params).toString();
    return this.request(`/products${q ? `?${q}` : ''}`);
  },
  getProduct(id) {
    return this.request(`/products/${id}`);
  },
  getCategories() {
    return this.request('/categories');
  },
  login(email, password) {
    return this.request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
  },
  register(payload) {
    return this.request('/auth/register', { method: 'POST', body: JSON.stringify(payload) });
  },
  getMe() {
    return this.request('/auth/me');
  },
  updateMe(payload) {
    return this.request('/auth/me', { method: 'PATCH', body: JSON.stringify(payload) });
  },
  addAddress(payload) {
    return this.request('/auth/me/addresses', { method: 'POST', body: JSON.stringify(payload) });
  },
  updateAddress(id, payload) {
    return this.request(`/auth/me/addresses/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
  },
  deleteAddress(id) {
    return this.request(`/auth/me/addresses/${id}`, { method: 'DELETE' });
  },
  getMyOrders() {
    return this.request('/orders/mine');
  },
  createOrder(payload) {
    return this.request('/orders', { method: 'POST', body: JSON.stringify(payload) });
  },
  trackOrder(orderNumber, email, phone) {
    const q = new URLSearchParams({ orderNumber, email: email || '', phone: phone || '' });
    return this.request(`/orders/track?${q}`);
  },
  getShippingQuote(city, subtotal) {
    const q = new URLSearchParams({ city, subtotal: String(subtotal) });
    return this.request(`/orders/shipping-quote?${q}`);
  },
  getWishlist() {
    return this.request('/wishlist');
  },
  addWishlist(productId) {
    return this.request('/wishlist', { method: 'POST', body: JSON.stringify({ productId }) });
  },
  removeWishlist(productId) {
    return this.request(`/wishlist/${productId}`, { method: 'DELETE' });
  },
  createSupportTicket(payload) {
    return this.request('/support/tickets', { method: 'POST', body: JSON.stringify(payload) });
  },
  getSupportTickets() {
    return this.request('/support/tickets');
  },
};

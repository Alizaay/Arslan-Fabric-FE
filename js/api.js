window.ArsalanAPI = {
  get base() {
    return window.API_BASE || '';
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
  login(email, password) {
    return this.request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
  },
  register(payload) {
    return this.request('/auth/register', { method: 'POST', body: JSON.stringify(payload) });
  },
  createOrder(payload) {
    return this.request('/orders', { method: 'POST', body: JSON.stringify(payload) });
  },
  trackOrder(orderNumber, email, phone) {
    const q = new URLSearchParams({ orderNumber, email: email || '', phone: phone || '' });
    return this.request(`/orders/track?${q}`);
  },
};

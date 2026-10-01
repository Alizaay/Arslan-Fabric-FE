window.AdminAPI = {
  get base() {
    return window.API_BASE || '';
  },
  async request(path, options = {}) {
    const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
    const token = localStorage.getItem('af_admin_token');
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetch(`${this.base}/api/admin${path}`, { ...options, headers });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || 'Request failed');
    return data;
  },
  authLogin(email, password) {
    return fetch(`${this.base}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }).then(async (res) => {
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Email or password is incorrect.');
      return data;
    });
  },
};

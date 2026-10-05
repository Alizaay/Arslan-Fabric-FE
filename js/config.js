(function initApiBase() {
  if (window.API_BASE) return;
  const stored = localStorage.getItem('af_api_base');
  if (stored) {
    window.API_BASE = stored;
    return;
  }
  if (typeof window.__ARSALAN_API_BASE__ === 'string' && window.__ARSALAN_API_BASE__) {
    window.API_BASE = window.__ARSALAN_API_BASE__;
    return;
  }
  const devPorts = ['3000', '5173', '5500', '8080', '4173'];
  const isLocal =
    window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  if (isLocal && devPorts.includes(window.location.port)) {
    window.API_BASE = 'http://localhost:5000';
    return;
  }
  /* Production on Vercel: same-origin /api/* when vercel.json rewrites to your backend */
  window.API_BASE = '';
})();

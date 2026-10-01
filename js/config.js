(function initApiBase() {
  if (window.API_BASE) return;
  const stored = localStorage.getItem('af_api_base');
  if (stored) {
    window.API_BASE = stored;
    return;
  }
  const devPorts = ['3000', '5173', '5500', '8080', '4173'];
  window.API_BASE = devPorts.includes(window.location.port) ? 'http://localhost:5000' : '';
})();

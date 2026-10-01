window.AdminAuth = {
  save(token, user) {
    localStorage.setItem('af_admin_token', token);
    localStorage.setItem('af_admin_user', JSON.stringify(user));
  },
  user() {
    try {
      return JSON.parse(localStorage.getItem('af_admin_user') || 'null');
    } catch {
      return null;
    }
  },
  require() {
    if (!localStorage.getItem('af_admin_token')) {
      window.location.href = 'login.html';
    }
  },
  logout() {
    localStorage.removeItem('af_admin_token');
    localStorage.removeItem('af_admin_user');
    window.location.href = 'login.html';
  },
};

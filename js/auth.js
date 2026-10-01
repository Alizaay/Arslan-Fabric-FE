window.ArsalanAuth = {
  saveSession(token, user) {
    localStorage.setItem('af_token', token);
    localStorage.setItem('af_user', JSON.stringify(user));
  },
  user() {
    try {
      return JSON.parse(localStorage.getItem('af_user') || 'null');
    } catch {
      return null;
    }
  },
  logout() {
    localStorage.removeItem('af_token');
    localStorage.removeItem('af_user');
    window.location.href = 'signed-out.html';
  },
  openModal(type = 'signin') {
    document.querySelector('[data-auth-modal]')?.classList.add('open');
    document.querySelector('[data-auth-view="signin"]')?.classList.toggle('active', type === 'signin');
    document.querySelector('[data-auth-view="register"]')?.classList.toggle('active', type === 'register');
    document.body.classList.add('overlay-open');
  },
  closeModal() {
    document.querySelector('[data-auth-modal]')?.classList.remove('open');
    document.body.classList.remove('overlay-open');
  },
};

// frontend/auth.js
(() => {
  const API = 'http://localhost:5000/api';
  const $ = (s, r = document) => r.querySelector(s);

  async function handleAuth(url, payload) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        alert(`შესვლის/რეგისტრის შეცდომა: ${data.message || res.status}`);
        return;
      }

      // მიიღე ნებისმიერი სახელით წამოსული ტოკენი
      const token = data.token || data.accessToken || data.jwt;
      if (!token) {
        console.log('Auth response (no token):', data);
        alert('შესვლის შეცდომა: No token');
        return;
      }

      localStorage.setItem('token', token);
      localStorage.setItem('userFullName', data.user?.fullName || data.fullName || '');
      localStorage.setItem('userEmail',    data.user?.email    || data.email    || '');

      // UI refresh
      location.href = 'profile.html';
    } catch (e) {
      console.error('auth error', e);
      alert('ქსელის შეცდომა, სცადეთ ისევ.');
    }
  }

  // Login
  const loginForm = $('#login-form');
  loginForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = $('#email')?.value?.trim();
    const password = $('#password')?.value;
    handleAuth(`${API}/login`, { email, password });
  });

  // Register
  const regForm = $('#register-form');
  regForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const fullName = $('#fullName')?.value?.trim();
    const email = $('#email')?.value?.trim();
    const password = $('#password')?.value;
    const pass2 = $('#confirm-password')?.value;
    if (password !== pass2) { alert('პაროლები არ ემთხვევა'); return; }
    handleAuth(`${API}/register`, { fullName, email, password });
  });
})();

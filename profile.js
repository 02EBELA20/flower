// profile.js — User info + Order history (final)
(() => {
  const API = 'http://localhost:5000/api';
  const $   = (s, r = document) => r.querySelector(s);
  const money = (n) => `$${(Number(n) || 0).toFixed(2)}`;

  // ---- Elements
  const els = {
    name:   $('#profileName'),
    email:  $('#profileEmail'),
    list:   $('#orderHistory'),
    edit:   $('#editProfileBtn'),
    logout: $('#profileLogoutBtn'),
  };

  // ---- Current user from localStorage
  const user = {
    fullName: localStorage.getItem('userFullName') || localStorage.getItem('username') || '—',
    email:    localStorage.getItem('userEmail')    || localStorage.getItem('email')    || '—',
    token:    localStorage.getItem('token') || null,
  };
  if (els.name)  els.name.textContent  = user.fullName;
  if (els.email) els.email.textContent = user.email;

  // ---- Render orders directly into #orderHistory
  function renderOrders(orders = []) {
    if (!els.list) return;

    if (!Array.isArray(orders) || orders.length === 0) {
      els.list.innerHTML = '<p>No orders yet.</p>';
      return;
    }

    const rows = orders.map(o => {
      const id     = o._id || o.id || o.orderId;
      const date   = new Date(o.createdAt || Date.now()).toLocaleString();
      const total  = money(o?.totals?.total ?? o.total ?? 0);
      const status = String(o.status || 'new').toLowerCase();

      return `
        <div class="order-item" data-id="${id}">
          <div class="order-info">
            <span class="order-id">Order #${id}</span>
            <span class="order-date">${date}</span>
          </div>
          <span class="order-total">${total}</span>
          <span class="order-status ${status}">${status.toUpperCase()}</span>
          <a href="order-success.html?order=${encodeURIComponent(id)}" class="view-details">View Details</a>
        </div>
      `;
    }).join('');

    els.list.innerHTML = rows; // <- აღარ ვკრავთ wrapper-ს
  }

  // ---- Load from API (no-store რომ ქეში არ დარჩეს)
  async function loadOrders() {
    if (!user.token || !els.list) {
      renderOrders([]);
      return;
    }

    try {
      const res = await fetch(`${API}/orders/me`, {
        headers: { Authorization: `Bearer ${user.token}` },
        cache: 'no-store',
      });

      if (!res.ok) {
        renderOrders([]);
        return;
      }

      const data = await res.json();
      // console.log('orders:', data); // სურვილისამებრ diagnostic
      renderOrders(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('orders/me error', e);
      renderOrders([]);
    }
  }

  // ---- Edit / Logout
  els.edit?.addEventListener('click', (e) => {
    e.preventDefault();
    alert('Editing profile will be enabled after backend is connected.');
  });

  els.logout?.addEventListener('click', (e) => {
    e.preventDefault();
    ['token','userFullName','userEmail','username','email'].forEach(k => localStorage.removeItem(k));
    location.href = 'index.html';
  });

  // მოვიხსენიოთ როგორც DOM load-ზე, ისე პირდაპირაც (საიმედოდ)
  document.addEventListener('DOMContentLoaded', loadOrders);
  loadOrders();
  // სურვილისამებრ: როცა დაბრუნდები გვერდზე, ხელახლა გადაატვირთოს სია
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) loadOrders();
  });
})();

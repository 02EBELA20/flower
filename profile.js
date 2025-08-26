// Profile page logic (localStorage first; API-ready fallback)
document.addEventListener('DOMContentLoaded', () => {
    const els = {
      name:   document.getElementById('profileName'),
      email:  document.getElementById('profileEmail'),
      list:   document.getElementById('orderHistory'),
      logout: document.getElementById('profileLogoutBtn'),
      edit:   document.getElementById('editProfileBtn')
    };
  
    // === 1) Current user (auth.js უნდა ინახავდეს ამ გასაღებებს) ===
    const user = {
      fullName: localStorage.getItem('userFullName') || localStorage.getItem('username') || 'Guest',
      email:    localStorage.getItem('userEmail') || localStorage.getItem('email') || '—',
      token:    localStorage.getItem('token') || null
    };
    if (els.name)  els.name.textContent  = user.fullName;
    if (els.email) els.email.textContent = user.email;
  
    // === 2) Orders loader ===
    const money = (n) => `$${(Number(n) || 0).toFixed(2)}`;
    const statusClass = (s='new') => {
      s = String(s).toLowerCase();
      return ['delivered','shipped','processing','cancelled','new'].includes(s) ? s : 'new';
    };
  
    const renderOrders = (orders=[]) => {
      if (!els.list) return;
      if (!orders.length) { els.list.innerHTML = '<p>No orders yet.</p>'; return; }
  
      els.list.innerHTML = orders.map(o => `
        <div class="order-item" data-id="${o.id || o.orderId}">
          <div class="order-info">
            <span class="order-id">Order #${o.id || o.orderId}</span>
            <span class="order-date">${new Date(o.createdAt || o.created_at || Date.now()).toLocaleString()}</span>
          </div>
          <span class="order-total">${money(o?.totals?.total ?? o.total)}</span>
          <span class="order-status ${statusClass(o.status)}">${(o.status || 'new').toUpperCase()}</span>
          <a href="#" class="view-details">View Details</a>
        </div>
      `).join('');
    };
  
    // LocalStorage orders (checkout-ის დროებითი შენახვა)
    const loadOrdersFromLocal = () => {
      const all = JSON.parse(localStorage.getItem('orders') || '[]');
      const mine = all.filter(o => (o.user?.name || 'Guest') === user.fullName);
      return mine.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
    };
  
    // API first (თუ უკვე გექნება /api/orders/me), სხვაგვარად — local fallback
    const loadOrders = async () => {
      if (user.token) {
        try {
          const res = await fetch('http://localhost:5000/api/orders/me', {
            headers: { Authorization: `Bearer ${user.token}` }
          });
          if (res.ok) {
            const list = await res.json();
            renderOrders(list);
            return;
          }
        } catch { /* ignore, fallback */ }
      }
      renderOrders(loadOrdersFromLocal());
    };
  
    loadOrders();
  
    // View details (simple alert; შეგიძლია მოგვიანებით მოდალად გადააქციო)
    els.list?.addEventListener('click', (e) => {
      const a = e.target.closest('.view-details');
      if (!a) return;
      e.preventDefault();
  
      const wrap = a.closest('.order-item');
      const id = wrap?.dataset.id;
      const pool = loadOrdersFromLocal();
      const o = pool.find(x => (x.id || x.orderId) === id);
      if (!o) { alert('Order details unavailable'); return; }
  
      const lines = (o.items || []).map(i => `• ${i.title} × ${i.qty} = ${money((i.price||0)*i.qty)}`).join('\n');
  
      alert(
  `Order: ${o.id || o.orderId}
  Date: ${new Date(o.createdAt).toLocaleString()}
  Name: ${o.user?.name || user.fullName}
  Address: ${o.shipping?.address || '-'}, ${o.shipping?.city || ''} ${o.shipping?.zip || ''}
  Phone: ${o.shipping?.phone || ''}
  
  Items:
  ${lines}
  
  Subtotal: ${money(o?.totals?.subtotal)}
  Shipping: ${money(o?.totals?.shipping)}
  Total: ${money(o?.totals?.total)}
  Status: ${(o.status || 'new').toUpperCase()}`
      );
    });
  
    // Edit (დროებით შეტყობინება)
    els.edit?.addEventListener('click', (e) => {
      e.preventDefault();
      alert('Editing profile will be enabled after backend is connected.');
    });
  
    // Logout
    els.logout?.addEventListener('click', (e) => {
      e.preventDefault();
      ['token','userFullName','userEmail','username','email'].forEach(k => localStorage.removeItem(k));
      window.location.href = 'index.html';
    });
  });
  
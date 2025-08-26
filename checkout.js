// checkout.js
(() => {
  const API = 'http://localhost:5000/api';
  const $   = (s, r = document) => r.querySelector(s);

  // ---- Cart helpers ----
  const getCart = () => {
    try { return JSON.parse(localStorage.getItem('cart')) || []; }
    catch { return []; }
  };
  const money = (n) => `$${(Number(n) || 0).toFixed(2)}`;
  const calcTotals = (cart) => {
    const subtotal = cart.reduce((s, it) => s + Number(it.price || 0) * Number(it.qty || 1), 0);
    const shipping = cart.length ? 15 : 0;
    return { subtotal, shipping, total: subtotal + shipping };
  };

  // ---- Order summary UI (მარცხენა მხარეს კალათის შეჯამება) ----
  function renderSummary() {
    const list   = $('.order-summary .summary-items');
    const totals = $('.order-summary .summary-total');
    if (!list || !totals) return;

    const cart = getCart();
    if (!cart.length) {
      list.innerHTML = '<p>Your cart is empty.</p>';
      totals.querySelectorAll('span').forEach(s => (s.textContent = money(0)));
      return;
    }

    list.innerHTML = cart.map(it => `
      <div class="summary-item">
        <span>${it.title} × ${it.qty}</span>
        <span>${money(Number(it.price) * Number(it.qty))}</span>
      </div>
    `).join('');

    const t = calcTotals(cart);
    const spans = totals.querySelectorAll('span');
    if (spans[0]) spans[0].textContent = money(t.subtotal);
    if (spans[1]) spans[1].textContent = money(t.shipping);
    if (spans[2]) spans[2].textContent = money(t.total);
  }

  // ---- მთავარი: შეკვეთის გაგზავნა ----
  async function placeOrder() {
    const token = localStorage.getItem('token');
    if (!token) { alert('Please log in.'); location.href = 'login.html'; return; }

    const cart = getCart();
    if (!cart.length) { alert('Your cart is empty.'); return; }

    // Shipping ველები (უნდა არსებობდეს checkout.html-ში ზუსტად ამ ID-ებით)
    const shipping = {
      fullName: $('#fullName')?.value?.trim(),
      phone:    $('#phone')?.value?.trim(),
      address:  $('#address')?.value?.trim(),
      city:     $('#city')?.value?.trim(),
      zip:      $('#zip')?.value?.trim(),
    };

    if (Object.values(shipping).some(v => !v)) {
      alert('Fill all shipping fields.');
      return;
    }

    const items = cart.map(c => ({
      title: c.title,
      price: Number(c.price),
      qty:   Number(c.qty),
      image: c.image || ''
    }));

    try {
      const res = await fetch(`${API}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ items, shipping }),
      });

      // ვკითხულობთ პასუხს ყოველთვის—რომ შეცდომაც დავინახოთ ტექსტით
      const body = await res.json().catch(() => ({}));

      if (!res.ok) {
        alert(`Order failed: ${body.message || res.status}`);
        return;
      }

      // წარმატება: ვასუფთავებთ კალათას, ვანულებთ count-ს და გადამიყვანე success-ზე
      localStorage.removeItem('cart');
      const cnt = $('#cart-count'); if (cnt) cnt.textContent = '0';
      location.href = `order-success.html?order=${encodeURIComponent(body.orderId)}`;

    } catch (err) {
      console.error('Place order error:', err);
      alert('Network error while placing order.');
    }
  }

  // ---- Init ----
  document.addEventListener('DOMContentLoaded', () => {
    renderSummary();

    const btn = document.querySelector('.place-order-btn');
    if (btn) btn.addEventListener('click', (e) => {
      e.preventDefault();
      placeOrder();
    });
  });
})();

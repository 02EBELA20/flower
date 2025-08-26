/* ===============================
   Cart Logic — Flowers for Flowers
   =============================== */

   (function () {
    // Preferred storage key for the cart
    const PREFERRED_KEY = 'cart';
    const ALT_KEYS = ['cartItems', 'flowerCart'];
  
    // ---------- Helpers ----------
    const qs  = (sel, root = document) => root.querySelector(sel);
    const qsa = (sel, root = document) => [...root.querySelectorAll(sel)];
  
    const parsePrice = (val) => {
      if (typeof val === 'number') return val;
      if (!val) return 0;
      const num = String(val).replace(/[^\d.]/g, '');
      return Number.parseFloat(num || '0') || 0;
    };
  
    const fmt = (n) => `$${Number(n || 0).toFixed(2)}`;
  
    const getCart = () => {
      // 1) main key
      try {
        const primary = JSON.parse(localStorage.getItem(PREFERRED_KEY) || '[]');
        if (Array.isArray(primary) && primary.length) return primary;
      } catch {}
      // 2) fallbacks
      for (const k of ALT_KEYS) {
        try {
          const val = JSON.parse(localStorage.getItem(k) || '[]');
          if (Array.isArray(val) && val.length) return val;
        } catch {}
      }
      return [];
    };
  
    const setCart = (cart) => {
      localStorage.setItem(PREFERRED_KEY, JSON.stringify(cart));
      // clear old/alt keys to avoid confusion
      ALT_KEYS.forEach((k) => localStorage.removeItem(k));
      updateCartCount();
    };
  
    const findItemIndex = (cart, id) => cart.findIndex((x) => x.id === id);
  
    const addToCart = (item) => {
      const cart = getCart();
      const id   = item.id || (crypto?.randomUUID ? crypto.randomUUID() : String(Date.now()));
      const idx  = findItemIndex(cart, id);
  
      if (idx >= 0) {
        cart[idx].qty += item.qty || 1;
      } else {
        cart.push({
          id,
          title: (item.title || 'Untitled').trim(),
          price: parsePrice(item.price),
          image: item.image || '',
          qty:   item.qty || 1,
        });
      }
  
      setCart(cart);
      renderCart();
      renderCheckoutSummary();
    };
  
    const removeFromCart = (id) => {
      const cart = getCart().filter((x) => x.id !== id);
      setCart(cart);
      renderCart();
      renderCheckoutSummary();
    };
  
    const updateQty = (id, qty) => {
      const q   = Math.max(1, Number(qty) || 1);
      const cart = getCart();
      const idx  = findItemIndex(cart, id);
      if (idx >= 0) {
        cart[idx].qty = q;
        setCart(cart);
        renderCart();
        renderCheckoutSummary();
      }
    };
  
    const calcTotals = (cart) => {
      const subtotal = cart.reduce((s, x) => s + x.price * x.qty, 0);
      const shipping = cart.length ? 15 : 0; // change if you need
      const total    = subtotal + shipping;
      return { subtotal, shipping, total };
    };
  
    // ---------- UI ----------
    const updateCartCount = () => {
      const el = qs('#cart-count');
      if (!el) return;
      const count = getCart().reduce((s, x) => s + x.qty, 0);
      el.textContent = String(count);
    };
  
    // ---------- Add-to-cart capture ----------
    const productFromData = (btn) => ({
      id:    btn.dataset.id,
      title: btn.dataset.name,
      price: parsePrice(btn.dataset.price),
      image: btn.dataset.image,
      qty:   parseInt(btn.dataset.qty || '1', 10),
    });
  
    const productFromCard = (btn) => {
      // fallback when data-* is missing
      const card   = btn.closest('.offer-item, .special-bouquet-item, .carousel-item');
      if (!card) return null;
      const title  = card.querySelector('h3')?.textContent?.trim();
      const priceE = card.querySelector('.price, .new-price');
      const price  = parsePrice(priceE ? priceE.textContent : '0');
      const img    = card.querySelector('img')?.getAttribute('src') || '';
      return { title, price, image: img, qty: 1 };
    };
  
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-add-to-cart]');
      if (!btn) return;
  
      // prefer data-*, else parse from card
      let item = productFromData(btn);
      if (!item.title) item = productFromCard(btn) || item;
      if (!item || !item.title) {
        alert('Unable to add this product. Please try again.');
        return;
      }
      addToCart(item);
    });
  
    // ---------- Render: cart.html ----------
    const renderCart = () => {
      const container = qs('.cart-items');
      if (!container) return;
  
      const cart = getCart();
      if (!cart.length) {
        container.innerHTML = `<p>Your cart is empty.</p>`;
        const summary = qs('.cart-summary');
        if (summary) updateCartSummary(summary, cart);
        return;
      }
  
      container.innerHTML = cart.map((it) => `
        <div class="cart-item" data-id="${it.id}">
          <img class="cart-item-image" src="${it.image || ''}" alt="${it.title}">
          <div class="cart-item-details">
            <div class="cart-item-title">${it.title}</div>
            <div class="cart-item-price">${fmt(it.price)}</div>
          </div>
          <div class="cart-item-quantity">
            <input type="number" min="1" value="${it.qty}">
          </div>
          <div class="cart-item-total">${fmt(it.price * it.qty)}</div>
          <button class="cart-item-remove" title="Remove">&times;</button>
        </div>
      `).join('');
  
      // qty change
      qsa('.cart-item input[type="number"]', container).forEach((inp) => {
        inp.addEventListener('change', (ev) => {
          const wrap = ev.target.closest('.cart-item');
          const id   = wrap?.dataset.id;
          updateQty(id, ev.target.value);
        });
      });
  
      // remove item
      qsa('.cart-item-remove', container).forEach((btn) => {
        btn.addEventListener('click', (ev) => {
          const wrap = ev.target.closest('.cart-item');
          const id   = wrap?.dataset.id;
          removeFromCart(id);
        });
      });
  
      // update summary (if present on cart page)
      const summary = qs('.cart-summary');
      if (summary) updateCartSummary(summary, cart);
    };
  
    const updateCartSummary = (summaryRoot, cart) => {
      const { subtotal, shipping, total } = calcTotals(cart);
      const details = qs('.summary-details', summaryRoot);
      if (details) {
        const rows = details.querySelectorAll('p span'); // [Subtotal, Shipping]
        if (rows[0]) rows[0].textContent = fmt(subtotal);
        if (rows[1]) rows[1].textContent = fmt(shipping);
      }
      const totalEl = qs('.summary-total', summaryRoot);
      if (totalEl) {
        const span = totalEl.querySelector('span');
        if (span) span.textContent = fmt(total);
      }
    };
  
    // ---------- Render: checkout.html ----------
    const renderCheckoutSummary = () => {
      const listRoot   = qs('.order-summary .summary-items');
      const totalsRoot = qs('.order-summary .summary-total');
      if (!listRoot || !totalsRoot) return; // not on checkout
  
      const cart = getCart();
      if (!cart.length) {
        listRoot.innerHTML = `<p>Your cart is empty.</p>`;
        totalsRoot.querySelectorAll('span').forEach((s) => (s.textContent = fmt(0)));
        return;
      }
  
      listRoot.innerHTML = cart.map((it) => `
        <div class="summary-item">
          <span>${it.title} × ${it.qty}</span>
          <span>${fmt(it.price * it.qty)}</span>
        </div>
      `).join('');
  
      const { subtotal, shipping, total } = calcTotals(cart);
      const spans = totalsRoot.querySelectorAll('span'); // [Subtotal, Shipping, Total]
      if (spans[0]) spans[0].textContent = fmt(subtotal);
      if (spans[1]) spans[1].textContent = fmt(shipping);
      if (spans[2]) spans[2].textContent = fmt(total);
    };
  
    // ---------- Place Order (checkout) ----------
const bindPlaceOrder = () => {
  const btn = document.querySelector('.place-order-btn');
  if (!btn) return;

  // 1) უსაფრთხოდ მოვაშოროთ inline ატრიბუტები და დავაყენოთ type="button"
  btn.removeAttribute('onclick');
  btn.setAttribute('type', 'button');

  // 2) closest <form> სამუდამოდ არ დაასბმითოს
  const form = btn.closest('form');
  if (form) {
    form.removeAttribute('onsubmit');
    // capture ფაზაში ვბლოკავთ submit-ს (თუნდაც სხვა კოდმა აყენოს)
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return false;
    }, true);
  }

  // 3) მოაშორე ყველა ძველი click listener ღილაკიდან
  const cleanBtn = btn.cloneNode(true);
  btn.replaceWith(cleanBtn);

  let locked = false; // ორმაგი გაშვებისგან დაცვა

  const fetchCartForCheckout = () => {
    // window.cart
    if (Array.isArray(window.cart) && window.cart.length) return window.cart;

    // localStorage: რამდენიმე გასაღები
    const keys = ['cart', 'cartItems', 'flowerCart'];
    for (const k of keys) {
      try {
        const v = JSON.parse(localStorage.getItem(k) || '[]');
        if (Array.isArray(v) && v.length) return v;
      } catch {}
    }

    // DOM fallback — Order Summary-დან ამოვიკითხოთ
    const rows = [...document.querySelectorAll('.order-summary .summary-items .summary-item')];
    if (rows.length) {
      const parsed = rows.map((row) => {
        const spans = row.querySelectorAll('span');
        const text  = spans[0]?.textContent?.trim() || ''; // "Name × QTY"
        const m     = text.match(/(.+)\s+×\s*(\d+)/i);
        const title = (m ? m[1] : text).trim();
        const qty   = m ? parseInt(m[2], 10) : 1;
        const priceText = spans[1]?.textContent || '$0';
        const total     = parseFloat(String(priceText).replace(/[^\d.]/g, '')) || 0;
        const unit      = total / Math.max(qty, 1);
        return { id: title, title, price: unit, image: '', qty };
      });
      if (parsed.length) return parsed;
    }
    return [];
  };

  const handleClick = (e) => {
    // 4) გავაჩეროთ propagation ყველანაირად
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    if (locked) return;
    locked = true;

    const items = fetchCartForCheckout();
    if (!items.length) {
      alert('Your cart is empty.'); // თუ ეს გამოვიდა, სხვა ჰენდლერი აღარ იმუშავებს
      locked = false;
      return;
    }

    const orderId = 'ORD-' + Date.now();

    // გავასუფთავოთ ყველგან კალათა
    ['cart','cartItems','flowerCart'].forEach(k => localStorage.removeItem(k));
    const countEl = document.querySelector('#cart-count');
    if (countEl) countEl.textContent = '0';

    window.location.href = `order-success.html?order=${encodeURIComponent(orderId)}`;
  };

  // 5) დავაბინდინოთ capture ფაზაში, რომ ჩვენ ვაკონტროლოთ პირველი
  cleanBtn.addEventListener('click', handleClick, { capture: true });
};



document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  renderCart();            // cart.html
  renderCheckoutSummary(); // checkout.html

  // checkout-ზე დამატებით დავიცვათ submit მთელ დოკუმენტზე (მხოლოდ ამ გვერდზე)
  if (document.querySelector('.order-summary')) {
    document.addEventListener('submit', (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return false;
    }, true);
  }

  bindPlaceOrder();
});
})();

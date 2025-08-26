document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('checkout-form');
    const placeBtn = document.querySelector('.place-order-btn');
  
    if (!form || !placeBtn) return;
  
    // მსუბუქი ვალიდაცია + შეკვეთის გაგზავნა
    placeBtn.addEventListener('click', async (e) => {
      e.preventDefault();
  
      // 1) შეაგროვე ველები
      const payload = {
        shipping: {
          fullName: document.getElementById('fullName')?.value?.trim(),
          phone:    document.getElementById('phone')?.value?.trim(),
          address:  document.getElementById('address')?.value?.trim(),
          city:     document.getElementById('city')?.value?.trim(),
          zip:      document.getElementById('zip')?.value?.trim(),
        },
        // გადახდის დემო — ნაღდი/ბარათის გარეშე ან მხოლოდ “method”
        payment: {
          method: 'cod' // 'cod' | 'card' (Stripe-ზე გადავალთ შემდეგ)
        },
        items: JSON.parse(localStorage.getItem('cart') || '[]')
      };
  
      // მინიმალური ვალიდაცია
      if (!payload.shipping.fullName || !payload.shipping.phone || !payload.shipping.address) {
        alert('Please fill Full Name, Phone, and Address.');
        return;
      }
      if (!payload.items.length) {
        alert('Your cart is empty.');
        return;
      }
  
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify(payload)
        });
  
        const data = await res.json();
  
        if (!res.ok) {
          alert(data.message || 'Order failed.');
          return;
        }
  
        // წარმატება -> იგივე რედირექტი, რაც cart.js-ში გვაქვს
        const orderId = data.orderId || ('ORD-' + Date.now());
        localStorage.removeItem('cart');
        window.location.href = `order-success.html?order=${encodeURIComponent(orderId)}`;
      } catch (err) {
        console.error(err);
        alert('Network error. Please try again.');
      }
    });
  });
  
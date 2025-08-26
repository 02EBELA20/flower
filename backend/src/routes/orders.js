const express = require('express');
const router  = express.Router();

const auth  = require('../middleware/auth');     // <- არ გააკეთო { auth }
const Order = require('../models/Order');

function calcTotals(items = []) {
  const subtotal = items.reduce((s, it) => s + Number(it.price || 0) * Number(it.qty || 1), 0);
  const shipping = items.length ? 15 : 0;
  return { subtotal, shipping, total: subtotal + shipping };
}

// POST /api/orders  -> ახალი შეკვეთა
router.post('/', auth, async (req, res) => {
  try {
    const { items, shipping } = req.body || {};

    if (!Array.isArray(items) || !items.length) {
      return res.status(400).json({ message: 'Items are required' });
    }
    if (!shipping?.fullName || !shipping?.phone || !shipping?.address || !shipping?.city || !shipping?.zip) {
      return res.status(400).json({ message: 'Shipping fields are required' });
    }

    const cleanItems = items.map(i => ({
      title: String(i.title || '').trim(),
      price: Number(i.price || 0),
      qty:   Number(i.qty || 1),
      image: i.image || ''
    }));

    const totals = calcTotals(cleanItems);

    const doc = await Order.create({
      user: req.user.id,
      items: cleanItems,
      shipping,
      totals,
      status: 'new'
    });

    // ოდნავი ლოგირება დებაგისთვის
    console.log('ORDER_CREATE', doc._id.toString(), 'user:', req.user.id);

    return res.status(201).json({ orderId: doc._id, totals });
  } catch (err) {
    console.error('[POST /api/orders] error:', err);
    return res.status(500).json({ message: 'Server error creating order' });
  }
});

// GET /api/orders/me -> ჩემი შეკვეთები (ერთი როუტი! არ გააორმაგო)
router.get('/me', auth, async (req, res) => {
  try {
    const list = await Order.find({ user: req.user.id }).sort({ createdAt: -1 }).lean();
    res.set('Cache-Control', 'no-store');
    return res.json(list);
  } catch (err) {
    console.error('[GET /api/orders/me] error:', err);
    return res.status(500).json({ message: 'Server error loading orders' });
  }
});

module.exports = router;

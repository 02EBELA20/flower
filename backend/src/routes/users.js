// backend/src/routes/users.js
const express = require('express');
const router  = express.Router();

const requireAuth = require('../middleware/auth');
// შენს პროექტში თუ ფაილის სახელი სხვაა ( напр. models/user.js ), შეცვალე ბილიკი:
const User = require('../models/User');

router.get('/me', requireAuth, async (req, res) => {
  const me = await User.findById(req.user.id).select('_id fullName email');
  if (!me) return res.status(404).json({ message: 'User not found' });
  res.json(me);
});

router.patch('/me', requireAuth, async (req, res) => {
  const { fullName, email } = req.body || {};
  const update = {};
  if (typeof fullName === 'string' && fullName.trim()) update.fullName = fullName.trim();
  if (typeof email === 'string' && email.trim()) update.email = email.trim().toLowerCase();
  if (!Object.keys(update).length) return res.status(400).json({ message: 'Nothing to update' });

  if (update.email) {
    const exists = await User.findOne({ email: update.email, _id: { $ne: req.user.id } });
    if (exists) return res.status(409).json({ message: 'Email already in use' });
  }

  const saved = await User.findByIdAndUpdate(req.user.id, update, { new: true, select: '_id fullName email' });
  res.json(saved);
});

module.exports = router;

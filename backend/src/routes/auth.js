// backend/src/routes/auth.js
const express = require('express');
const router  = express.Router();
const bcrypt  = require('bcrypt');
const jwt     = require('jsonwebtoken');

const User    = require('../models/User');
const auth    = require('../middleware/auth'); // თუ გაქვს, /me-სთვის

// Helper: JWT
function signToken(user) {
  return jwt.sign(
    {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      isAdmin: !!user.isAdmin,
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

/* ========= REGISTER ========= */
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, password } = req.body || {};
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'Full name, email and password required' });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email already registered' });

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email,
      passwordHash,
      isAdmin: false,
    });

    const token = signToken(user);
    return res.status(201).json({
      token,
      user: { id: user._id, fullName: user.fullName, email: user.email },
    });
  } catch (e) {
    console.error('[register] err:', e);
    return res.status(500).json({ message: 'Server error' });
  }
});

/* ========= LOGIN (fallback migration) ========= */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    // წავიღოთ შენახული პაროლი: პრიორიტეტი passwordHash-ს
    let stored = user.passwordHash || user.password; // ძველი ველის მხარდაჭერა

    if (!stored) {
      return res.status(500).json({ message: 'User has no password set' });
    }

    // თუ შენახული ველი არაა bcrypt-ჰეში (არაა '$2'ით დაწყებული) — ესე იგი plain text იყო.
    if (typeof stored === 'string' && !stored.startsWith('$2')) {
      const newHash = await bcrypt.hash(stored, 10);
      user.passwordHash = newHash;
      user.password = undefined; // ძველი ველი გავასუფთავოთ
      await user.save();
      stored = newHash;
    }

    const ok = await bcrypt.compare(password, stored);
    if (!ok) return res.status(401).json({ message: 'Invalid email or password' });

    const token = signToken(user);
    return res.json({
      token,
      user: { id: user._id, fullName: user.fullName, email: user.email },
    });
  } catch (e) {
    console.error('[login] err:', e);
    return res.status(500).json({ message: 'Server error' });
  }
});

/* ========= ME ========= */
router.get('/me', auth, async (req, res) => {
  try {
    const me = await User.findById(req.user.id).select('_id fullName email isAdmin');
    return res.json(me);
  } catch (e) {
    console.error('[me] err:', e);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

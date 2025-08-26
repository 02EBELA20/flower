require('dotenv').config();

const express   = require('express');
const mongoose  = require('mongoose');
const helmet    = require('helmet');
const morgan    = require('morgan');
const cors      = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();

/* ---------- CORS ---------- */
const allowList = [
  process.env.FRONTEND_ORIGIN,
  'http://127.0.0.1:5500',
  'http://localhost:5500',
].filter(Boolean);

app.use(
  cors({
    origin(origin, cb) {
      if (!origin || allowList.includes(origin)) return cb(null, true);
      return cb(new Error('CORS blocked: ' + origin));
    },
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200,
  })
);
app.options('*', cors());

/* ---------- Security & parsers ---------- */
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json({ limit: '1mb' }));

/* ---------- Rate limit (მხოლოდ /api-ზე) ---------- */
app.use('/api', rateLimit({ windowMs: 60_000, max: 200 }));

/* ---------- Health ---------- */
app.get('/api/health', (_req, res) => res.json({ ok: true }));

/* ---------- Routes ---------- */
app.use('/api',        require('./routes/auth'));    // /api/register, /api/login, /api/me
app.use('/api/orders', require('./routes/orders'));
  // /api/orders, /api/orders/me

/* ---------- Start ---------- */
(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Mongo connected');
    const port = process.env.PORT || 5000;
    app.listen(port, () => console.log('API listening on :' + port));
  } catch (err) {
    console.error('Failed to start', err);
    process.exit(1);
  }
})();

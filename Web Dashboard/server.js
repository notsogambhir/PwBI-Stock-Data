const express = require('express');
const path = require('path');
const compression = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const apiRoutes = require('./src/routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Security & Performance Middleware ─────────────────────────
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "cdnjs.cloudflare.com"],
      scriptSrcAttr: ["'none'"],
      styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
      fontSrc: ["'self'", "fonts.gstatic.com"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'"]
    }
  }
}));
app.use(compression());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// ── Static Files ──────────────────────────────────────────────
const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: isDev ? 0 : '1d',
  etag: true,
  lastModified: true
}));

// ── API Routes ────────────────────────────────────────────────
app.use('/api', apiRoutes);

// ── SPA Fallback ──────────────────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ── Error Handler ─────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

// ── Start ─────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════════════╗
  ║   Eicher Motors — Stock Analysis Dashboard       ║
  ║   Running at http://localhost:${PORT}               ║
  ╚══════════════════════════════════════════════════╝
  `);
});

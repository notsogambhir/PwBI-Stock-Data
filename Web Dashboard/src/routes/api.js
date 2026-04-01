const express = require('express');
const router = express.Router();
const dataService = require('../services/dataService');

/**
 * GET /api/summary
 * Returns all data in a single payload for initial dashboard load.
 */
router.get('/summary', (req, res, next) => {
  try {
    const data = dataService.getSummary();
    res.json(data);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/stock-data
 * Query params: ?from=YYYY-MM-DD&to=YYYY-MM-DD
 */
router.get('/stock-data', (req, res, next) => {
  try {
    const { from, to } = req.query;
    const data = dataService.getStockData(from, to);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/monthly-returns
 */
router.get('/monthly-returns', (req, res, next) => {
  try {
    const data = dataService.getMonthlyReturns();
    res.json(data);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/dashboard
 */
router.get('/dashboard', (req, res, next) => {
  try {
    const data = dataService.getDashboard();
    res.json(data);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/reload
 * Force-reload data from disk (for future use after data updates).
 */
router.post('/reload', (req, res, next) => {
  try {
    dataService.reloadData();
    res.json({ status: 'ok', message: 'Data reloaded successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

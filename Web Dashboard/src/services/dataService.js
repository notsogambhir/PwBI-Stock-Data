/**
 * Data Service — Abstracted data access layer.
 * Currently reads from JSON file. Swap this file for database access later.
 */
const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '..', '..', 'data', 'eicher_data.json');

let _cache = null;

function loadData() {
  if (_cache) return _cache;
  
  try {
    const raw = fs.readFileSync(DATA_PATH, 'utf-8');
    _cache = JSON.parse(raw);
    console.log(`[DataService] Loaded: ${_cache.stockData.length} stock rows, ${_cache.monthlyReturns.length} monthly rows, ${Object.keys(_cache.dashboard).length} dashboard metrics`);
    return _cache;
  } catch (err) {
    console.error('[DataService] Failed to load data:', err.message);
    throw new Error('Data file not found or corrupt');
  }
}

/**
 * Get stock data, optionally filtered by date range.
 * @param {string} [from] - Start date (ISO string or YYYY-MM-DD)
 * @param {string} [to]   - End date
 * @returns {Array} Filtered stock data rows
 */
function getStockData(from, to) {
  const data = loadData();
  let rows = data.stockData;

  if (from || to) {
    const fromDate = from ? new Date(from) : new Date('1900-01-01');
    const toDate = to ? new Date(to) : new Date('2100-01-01');
    toDate.setHours(23, 59, 59, 999);

    rows = rows.filter(r => {
      const dt = new Date(r.Datetime);
      return dt >= fromDate && dt <= toDate;
    });
  }

  return rows;
}

/**
 * Get monthly aggregated returns.
 * @returns {Array} Monthly return rows
 */
function getMonthlyReturns() {
  const data = loadData();
  return data.monthlyReturns;
}

/**
 * Get dashboard-level KPI metrics.
 * @returns {Object} Key-value pairs of dashboard metrics
 */
function getDashboard() {
  const data = loadData();
  return data.dashboard;
}

/**
 * Get complete summary (all data in one call for initial load).
 * @returns {Object} { stockData, monthlyReturns, dashboard }
 */
function getSummary() {
  const data = loadData();
  return {
    stockData: data.stockData,
    monthlyReturns: data.monthlyReturns,
    dashboard: data.dashboard
  };
}

/**
 * Reload data from disk (useful after data updates).
 */
function reloadData() {
  _cache = null;
  return loadData();
}

module.exports = {
  getStockData,
  getMonthlyReturns,
  getDashboard,
  getSummary,
  reloadData
};

/**
 * api.js — Frontend API client for the Express backend
 */

const API_BASE = '/api';

async function apiFetch(endpoint, params = {}) {
  const url = new URL(endpoint, window.location.origin);
  Object.entries(params).forEach(([k, v]) => {
    if (v != null) url.searchParams.set(k, v);
  });

  try {
    const res = await fetch(url.toString());
    if (!res.ok) {
      throw new Error(`API error ${res.status}: ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.error(`[API] ${endpoint} failed:`, err);
    throw err;
  }
}

/**
 * Fetch all data in one call for initial load.
 */
async function fetchSummary() {
  return apiFetch(`${API_BASE}/summary`);
}

/**
 * Fetch stock data with optional date range.
 */
async function fetchStockData(from, to) {
  return apiFetch(`${API_BASE}/stock-data`, { from, to });
}

/**
 * Fetch monthly returns data.
 */
async function fetchMonthlyReturns() {
  return apiFetch(`${API_BASE}/monthly-returns`);
}

/**
 * Fetch dashboard KPI metrics.
 */
async function fetchDashboard() {
  return apiFetch(`${API_BASE}/dashboard`);
}

/**
 * Reload data on the server (after data file updates).
 */
async function reloadServerData() {
  const res = await fetch(`${API_BASE}/reload`, { method: 'POST' });
  return res.json();
}

// ── Export ─────────────────────────────────────────────────────
window.API = {
  fetchSummary,
  fetchStockData,
  fetchMonthlyReturns,
  fetchDashboard,
  reloadServerData
};

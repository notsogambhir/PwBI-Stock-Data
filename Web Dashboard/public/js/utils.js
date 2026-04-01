/**
 * utils.js — Shared formatters, helpers, and Chart.js defaults
 */

// ── Number Formatters ──────────────────────────────────────────
function fmtN(v, d = 2) {
  if (v == null || isNaN(v)) return 'N/A';
  return (+v).toFixed(d);
}

function fmtK(v) {
  if (v >= 1e7) return (v / 1e7).toFixed(2) + 'Cr';
  if (v >= 1e5) return (v / 1e5).toFixed(1) + 'L';
  if (v >= 1e3) return (v / 1e3).toFixed(0) + 'K';
  return v;
}

function pct(v) {
  if (v == null || isNaN(v)) return 'N/A';
  return (v >= 0 ? '+' : '') + fmtN(v, 2) + '%';
}

function fmtINR(v) {
  if (v == null || isNaN(v)) return '₹N/A';
  return '₹' + (+v).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ── Color Helpers ──────────────────────────────────────────────
function clr(v, threshold = 0) {
  return v > threshold ? 'var(--green)' : v < threshold ? 'var(--red)' : 'var(--muted)';
}

// ── Data Helpers ──────────────────────────────────────────────
function last(arr, key) {
  const valid = arr.filter(r => r[key] != null && !isNaN(r[key]));
  return valid.length ? valid[valid.length - 1][key] : null;
}

function toDate(str) {
  return new Date(str);
}

function fmtDate(d) {
  if (typeof d === 'string') d = new Date(d);
  return d.toISOString().split('T')[0];
}

// ── Chart.js Helpers ──────────────────────────────────────────
const _charts = {};

function destroyChart(id) {
  if (_charts[id]) {
    _charts[id].destroy();
    delete _charts[id];
  }
}

function storeChart(id, chart) {
  _charts[id] = chart;
}

function getChart(id) {
  return _charts[id];
}

function resizeAllCharts() {
  Object.values(_charts).forEach(c => {
    try { c.resize(); } catch (e) { /* ignore */ }
  });
}

function getChartDefaults() {
  return {
    animation: { duration: 350, easing: 'easeOutQuart' },
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#131C2E',
        borderColor: '#1A2842',
        borderWidth: 1,
        titleFont: { family: 'JetBrains Mono', size: 10 },
        bodyFont:  { family: 'JetBrains Mono', size: 10 },
        titleColor: '#94A3B8',
        bodyColor:  '#E2E8F0',
        padding: 10,
        cornerRadius: 4,
        displayColors: true,
        boxPadding: 4
      }
    },
    scales: {
      x: {
        ticks: { color: '#64748B', font: { family: 'JetBrains Mono', size: 9 }, maxTicksLimit: 8 },
        grid:  { color: 'rgba(26,40,66,0.5)' },
        border: { color: '#1A2842' }
      },
      y: {
        ticks: { color: '#64748B', font: { family: 'JetBrains Mono', size: 9 } },
        grid:  { color: 'rgba(26,40,66,0.5)' },
        border: { color: '#1A2842' }
      }
    }
  };
}

// ── Export to global scope ────────────────────────────────────
window.Utils = {
  fmtN, fmtK, pct, fmtINR, clr, last, toDate, fmtDate,
  destroyChart, storeChart, getChart, resizeAllCharts,
  getChartDefaults
};

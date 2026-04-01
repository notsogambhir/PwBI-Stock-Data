/**
 * app.js — Main dashboard orchestrator
 * All event listeners are attached programmatically (CSP-compliant).
 */

(function () {
  // ── State ──────────────────────────────────────────────────
  let RAW = [];
  let MONTHLY = [];
  let DASH = {};
  let FILTERED = [];

  // ── Loading Progress ──────────────────────────────────────
  function setProgress(pct) {
    const bar = document.getElementById('load-progress');
    if (bar) bar.style.width = pct + '%';
  }

  function setLoadingText(text) {
    const el = document.querySelector('.loading-text');
    if (el) el.textContent = text;
  }

  // ── Init ──────────────────────────────────────────────────
  async function init() {
    try {
      setProgress(10);
      setLoadingText('Connecting to API…');

      const data = await API.fetchSummary();
      setProgress(50);
      setLoadingText('Processing stock data…');

      RAW = data.stockData.map(r => ({
        ...r,
        _dt: new Date(r.Datetime)
      })).filter(r => r.Close > 0);

      MONTHLY = data.monthlyReturns || [];
      DASH = data.dashboard || {};

      setProgress(75);
      setLoadingText('Rendering charts…');

      // Set default 90-day range
      const maxDt = new Date(Math.max(...RAW.map(r => r._dt)));
      const minDt = new Date(maxDt);
      minDt.setDate(minDt.getDate() - 90);

      document.getElementById('date-to').value = Utils.fmtDate(maxDt);
      document.getElementById('date-from').value = Utils.fmtDate(minDt);
      document.getElementById('refresh-ts').textContent =
        'Loaded: ' + RAW.length.toLocaleString() + ' bars · ' + (DASH['Last Updated'] || Utils.fmtDate(maxDt));

      // Bind all event listeners BEFORE first render
      bindEventListeners();

      applyDateFilter();

      setProgress(100);
      setLoadingText('Dashboard ready');

      // Show dashboard
      setTimeout(() => {
        document.getElementById('loading').classList.remove('show');
        document.getElementById('dashboard').style.display = 'flex';
      }, 400);

    } catch (err) {
      setLoadingText('Error: ' + err.message);
      console.error('[Dashboard] Init failed:', err);

      setTimeout(() => {
        document.getElementById('loading').classList.remove('show');
        document.getElementById('dashboard').style.display = 'flex';
        const badge = document.getElementById('server-badge');
        if (badge) {
          badge.style.color = 'var(--red)';
          badge.style.borderColor = 'rgba(239,68,68,0.2)';
          badge.style.background = 'var(--red-bg)';
          badge.innerHTML = '<span class="server-dot" style="background:var(--red)"></span><span>API Error</span>';
        }
      }, 1500);
    }
  }

  // ═══════════════════════════════════════════════════════════
  // EVENT BINDING — All listeners attached here (CSP-safe)
  // ═══════════════════════════════════════════════════════════
  function bindEventListeners() {

    // ── Tab switching ────────────────────────────────────────
    document.querySelectorAll('.tab[data-tab]').forEach(tab => {
      tab.addEventListener('click', () => {
        showTab(parseInt(tab.dataset.tab));
      });
    });

    // ── Date range preset buttons ────────────────────────────
    document.querySelectorAll('.filter-bar .preset-btn[data-days]').forEach(btn => {
      btn.addEventListener('click', () => {
        setPreset(parseInt(btn.dataset.days));
      });
    });

    // ── Date inputs ──────────────────────────────────────────
    document.getElementById('date-from').addEventListener('change', applyDateFilter);
    document.getElementById('date-to').addEventListener('change', applyDateFilter);

    // ── Zoom sliders ─────────────────────────────────────────
    document.getElementById('zoom-left').addEventListener('input', applyZoom);
    document.getElementById('zoom-right').addEventListener('input', applyZoom);

    // ── Indicator toggle buttons ─────────────────────────────
    document.querySelectorAll('.indicator-bar .preset-btn[data-indicator]').forEach(btn => {
      btn.addEventListener('click', () => {
        toggleIndicator(btn.dataset.indicator);
      });
    });

    // ── Table search ─────────────────────────────────────────
    document.getElementById('table-search').addEventListener('input', () => {
      DataTable.filter();
    });

    // ── Table filter preset buttons ──────────────────────────
    document.querySelectorAll('[data-tbl-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        DataTable.setFilter(btn.dataset.tblFilter);
      });
    });

    // ── Table column sort headers ────────────────────────────
    document.querySelectorAll('th[data-sort-col]').forEach(th => {
      th.addEventListener('click', () => {
        DataTable.sort(th.dataset.sortCol);
      });
    });
  }

  // ── Date Filtering ────────────────────────────────────────
  function setPreset(days) {
    document.querySelectorAll('.filter-bar .preset-btn[data-days]').forEach(b => b.classList.remove('active'));
    const clicked = document.querySelector(`.filter-bar .preset-btn[data-days="${days}"]`);
    if (clicked) clicked.classList.add('active');

    const maxDt = new Date(Math.max(...RAW.map(r => r._dt)));
    const minDt = new Date(maxDt);
    minDt.setDate(minDt.getDate() - days);
    document.getElementById('date-from').value = Utils.fmtDate(minDt);
    document.getElementById('date-to').value = Utils.fmtDate(maxDt);
    applyDateFilter();
  }

  function applyDateFilter() {
    const from = new Date(document.getElementById('date-from').value);
    const to = new Date(document.getElementById('date-to').value);
    to.setHours(23, 59, 59);
    FILTERED = RAW.filter(r => r._dt >= from && r._dt <= to);
    document.getElementById('bar-count').textContent = FILTERED.length.toLocaleString() + ' bars';
    renderAll();
  }

  // ── Render All ────────────────────────────────────────────
  function renderAll() {
    // Page 1 - Summary
    KPI.renderSummaryKPI(FILTERED);
    Charts.renderPriceChart(FILTERED);
    Charts.renderVolumeSmMultiples(FILTERED);
    KPI.renderSignalCards(FILTERED);
    KPI.renderNarrative(FILTERED);

    // Page 2 - Technical Analysis
    Charts.renderRSI(FILTERED);
    Charts.renderMACD(FILTERED);
    Charts.renderBollinger(FILTERED);
    Charts.renderATR(FILTERED);

    // Page 3 - Returns & Risk
    KPI.renderRiskKPI(FILTERED, DASH);
    Charts.renderMonthlyReturns(MONTHLY);
    Charts.renderDrawdown(FILTERED);
    Charts.renderHeatmap(MONTHLY);

    // Page 4 - Data Table
    DataTable.setData(FILTERED);
  }

  // ── Tab Switching ─────────────────────────────────────────
  function showTab(n) {
    document.querySelectorAll('.tab').forEach((t, i) => t.classList.toggle('active', i === n - 1));
    document.querySelectorAll('.page').forEach((p, i) => p.classList.toggle('active', i === n - 1));
    setTimeout(() => Utils.resizeAllCharts(), 50);
  }

  // ── Indicator Toggles ─────────────────────────────────────
  function toggleIndicator(key) {
    Charts.activeIndicators[key] = !Charts.activeIndicators[key];
    const btn = document.getElementById('ind-' + key.toLowerCase());
    if (btn) btn.classList.toggle('active', Charts.activeIndicators[key]);
    Charts.renderPriceChart(FILTERED);
    Charts.renderBollinger(FILTERED);
  }

  // ── Zoom ──────────────────────────────────────────────────
  function applyZoom() {
    Charts.zoomL = +document.getElementById('zoom-left').value;
    Charts.zoomR = +document.getElementById('zoom-right').value;
    if (Charts.zoomL >= Charts.zoomR) {
      Charts.zoomR = Charts.zoomL + 1;
      document.getElementById('zoom-right').value = Charts.zoomR;
    }
    Charts.renderPriceChart(FILTERED);
  }

  // ── Heatmap Drillthrough ──────────────────────────────────
  function drillthrough(month) {
    showTab(4);
    DataTable.setSearch(month.substring(0, 7));
  }

  // ── Export to global scope ────────────────────────────────
  window.Dashboard = {
    showTab,
    setPreset,
    applyDateFilter,
    toggleIndicator,
    applyZoom,
    drillthrough
  };

  // ── Start ─────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', init);
})();

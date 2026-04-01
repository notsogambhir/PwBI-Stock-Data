/**
 * charts.js — All Chart.js chart renderers
 */

const Charts = {

  // ── Active indicator state ────────────────────────────────
  activeIndicators: { Close: true, MA20: true, MA50: true, MA200: false, BB: false, VWAP: false },
  zoomL: 0,
  zoomR: 100,

  // ═══════════════════════════════════════════════════════════
  // PRICE CHART
  // ═══════════════════════════════════════════════════════════
  renderPriceChart(filtered) {
    if (!filtered.length) return;
    const start = Math.floor(this.zoomL / 100 * filtered.length);
    const end = Math.ceil(this.zoomR / 100 * filtered.length);
    const d = filtered.slice(start, end);

    const labels = d.map(r => {
      const dt = new Date(r.Datetime);
      return dt.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    });

    const datasets = [];
    if (this.activeIndicators.Close) datasets.push({
      label: 'Close', data: d.map(r => r.Close), borderColor: '#3B82F6',
      borderWidth: 1.8, pointRadius: 0, tension: 0.1, order: 1,
      fill: { target: 'origin', above: 'rgba(37,99,235,0.04)' }
    });
    if (this.activeIndicators.MA20) datasets.push({
      label: 'MA20', data: d.map(r => r.MA20), borderColor: '#F59E0B',
      borderWidth: 1, pointRadius: 0, borderDash: [4, 3], tension: 0.1, order: 2
    });
    if (this.activeIndicators.MA50) datasets.push({
      label: 'MA50', data: d.map(r => r.MA50), borderColor: '#8B5CF6',
      borderWidth: 1, pointRadius: 0, borderDash: [2, 4], tension: 0.1, order: 3
    });
    if (this.activeIndicators.MA200) datasets.push({
      label: 'MA200', data: d.map(r => r.MA200), borderColor: '#06B6D4',
      borderWidth: 0.8, pointRadius: 0, borderDash: [6, 4], tension: 0.1, order: 4
    });
    if (this.activeIndicators.BB) {
      datasets.push({
        label: 'BB+', data: d.map(r => r.BB_Upper), borderColor: 'rgba(100,116,139,0.6)',
        borderWidth: 0.8, pointRadius: 0, borderDash: [3, 3], fill: false, order: 5
      });
      datasets.push({
        label: 'BB-', data: d.map(r => r.BB_Lower), borderColor: 'rgba(100,116,139,0.6)',
        borderWidth: 0.8, pointRadius: 0, borderDash: [3, 3],
        fill: '-1', backgroundColor: 'rgba(100,116,139,0.05)', order: 6
      });
    }
    if (this.activeIndicators.VWAP) datasets.push({
      label: 'VWAP', data: d.map(r => r.VWAP), borderColor: '#10B981',
      borderWidth: 1, pointRadius: 0, borderDash: [5, 3], order: 7
    });

    Utils.destroyChart('price');
    const ctx = document.getElementById('chart-price').getContext('2d');
    const defaults = Utils.getChartDefaults();

    Utils.storeChart('price', new Chart(ctx, {
      type: 'line',
      data: { labels, datasets },
      options: {
        ...defaults,
        plugins: {
          ...defaults.plugins,
          legend: {
            display: true,
            labels: { color: '#94A3B8', font: { family: 'JetBrains Mono', size: 9 }, boxWidth: 20, padding: 10 }
          }
        },
        scales: {
          ...defaults.scales,
          y: { ...defaults.scales.y, ticks: { ...defaults.scales.y.ticks, callback: v => '₹' + v.toLocaleString('en-IN') } }
        }
      }
    }));
  },

  // ═══════════════════════════════════════════════════════════
  // VOLUME SMALL MULTIPLES
  // ═══════════════════════════════════════════════════════════
  renderVolumeSmMultiples(filtered) {
    if (!filtered.length) return;
    const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    const DAY_IDS = ['vol-mon', 'vol-tue', 'vol-wed', 'vol-thu', 'vol-fri'];

    DAYS.forEach((day, di) => {
      const dayData = filtered.filter(r => new Date(r.Datetime).getDay() === di + 1);
      const slice = dayData.slice(-20);
      const labels = slice.map(r => new Date(r.Datetime).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }));
      const colors = slice.map(r => (r.Change || 0) >= 0 ? 'rgba(16,185,129,0.65)' : 'rgba(239,68,68,0.65)');

      Utils.destroyChart('vol-' + day.toLowerCase());
      const ctx = document.getElementById(DAY_IDS[di]).getContext('2d');

      Utils.storeChart('vol-' + day.toLowerCase(), new Chart(ctx, {
        type: 'bar',
        data: { labels, datasets: [{ data: slice.map(r => r.Volume), backgroundColor: colors, borderRadius: 2 }] },
        options: {
          animation: false, responsive: true, maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#131C2E', borderColor: '#1A2842', borderWidth: 1,
              titleFont: { family: 'JetBrains Mono', size: 9 },
              bodyFont: { family: 'JetBrains Mono', size: 9 },
              callbacks: { label: ctx => Utils.fmtK(ctx.parsed.y) }
            }
          },
          scales: {
            x: { display: false, grid: { display: false } },
            y: {
              ticks: { color: '#475569', font: { family: 'JetBrains Mono', size: 8 }, maxTicksLimit: 3, callback: v => Utils.fmtK(v) },
              grid: { color: 'rgba(26,40,66,0.4)' }, border: { color: '#1A2842' }
            }
          }
        }
      }));
    });
  },

  // ═══════════════════════════════════════════════════════════
  // RSI CHART
  // ═══════════════════════════════════════════════════════════
  renderRSI(filtered) {
    if (!filtered.length) return;
    const labels = filtered.map(r => new Date(r.Datetime).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }));
    const rsiData = filtered.map(r => r.RSI);

    Utils.destroyChart('rsi');
    const ctx = document.getElementById('chart-rsi').getContext('2d');
    const defaults = Utils.getChartDefaults();

    Utils.storeChart('rsi', new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          { label: 'RSI', data: rsiData, borderColor: '#F59E0B', borderWidth: 1.5, pointRadius: 0, tension: 0.1, fill: false },
          { label: 'OB', data: filtered.map(() => 70), borderColor: 'rgba(239,68,68,0.5)', borderWidth: 0.8, pointRadius: 0, borderDash: [4, 3], fill: { target: '+1', above: 'rgba(239,68,68,0.08)' } },
          { label: 'OS', data: filtered.map(() => 30), borderColor: 'rgba(16,185,129,0.5)', borderWidth: 0.8, pointRadius: 0, borderDash: [4, 3], fill: { target: 'end', above: 'rgba(16,185,129,0.08)' } }
        ]
      },
      options: {
        ...defaults,
        plugins: { ...defaults.plugins, legend: { display: false } },
        scales: {
          ...defaults.scales,
          y: {
            ...defaults.scales.y, min: 0, max: 100,
            ticks: {
              ...defaults.scales.y.ticks, callback: v => {
                if (v === 70) return '70 OB'; if (v === 30) return '30 OS'; if (v === 50) return '50'; return '';
              }
            }
          }
        }
      }
    }));
  },

  // ═══════════════════════════════════════════════════════════
  // MACD CHART
  // ═══════════════════════════════════════════════════════════
  renderMACD(filtered) {
    if (!filtered.length) return;
    const labels = filtered.map(r => new Date(r.Datetime).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }));
    const hist = filtered.map(r => r.MACD != null && r.MACD_Signal != null ? r.MACD - r.MACD_Signal : null);
    const histColors = hist.map(v => v >= 0 ? 'rgba(16,185,129,0.6)' : 'rgba(239,68,68,0.6)');

    Utils.destroyChart('macd');
    const ctx = document.getElementById('chart-macd').getContext('2d');
    const defaults = Utils.getChartDefaults();

    Utils.storeChart('macd', new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          { type: 'bar', label: 'Hist', data: hist, backgroundColor: histColors, order: 2, yAxisID: 'y' },
          { type: 'line', label: 'MACD', data: filtered.map(r => r.MACD), borderColor: '#3B82F6', borderWidth: 1.4, pointRadius: 0, tension: 0.1, order: 1, yAxisID: 'y' },
          { type: 'line', label: 'Signal', data: filtered.map(r => r.MACD_Signal), borderColor: '#F59E0B', borderWidth: 1, pointRadius: 0, borderDash: [3, 2], tension: 0.1, order: 1, yAxisID: 'y' }
        ]
      },
      options: {
        ...defaults,
        plugins: {
          ...defaults.plugins,
          legend: { display: true, labels: { color: '#94A3B8', font: { family: 'JetBrains Mono', size: 9 }, boxWidth: 16, padding: 10 } }
        }
      }
    }));
  },

  // ═══════════════════════════════════════════════════════════
  // BOLLINGER BANDS
  // ═══════════════════════════════════════════════════════════
  renderBollinger(filtered) {
    if (!filtered.length) return;
    const labels = filtered.map(r => new Date(r.Datetime).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }));

    Utils.destroyChart('bb');
    const ctx = document.getElementById('chart-bb').getContext('2d');
    const defaults = Utils.getChartDefaults();

    Utils.storeChart('bb', new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          { label: 'BB+', data: filtered.map(r => r.BB_Upper), borderColor: 'rgba(100,116,139,0.5)', borderWidth: 0.8, pointRadius: 0, borderDash: [3, 3], fill: false },
          { label: 'Close', data: filtered.map(r => r.Close), borderColor: '#3B82F6', borderWidth: 1.8, pointRadius: 0, tension: 0.1, fill: false },
          { label: 'BB-', data: filtered.map(r => r.BB_Lower), borderColor: 'rgba(100,116,139,0.5)', borderWidth: 0.8, pointRadius: 0, borderDash: [3, 3], fill: '-2', backgroundColor: 'rgba(100,116,139,0.07)' }
        ]
      },
      options: {
        ...defaults,
        plugins: { ...defaults.plugins, legend: { display: false } },
        scales: {
          ...defaults.scales,
          y: { ...defaults.scales.y, ticks: { ...defaults.scales.y.ticks, callback: v => '₹' + v.toLocaleString('en-IN') } }
        }
      }
    }));
  },

  // ═══════════════════════════════════════════════════════════
  // ATR CHART
  // ═══════════════════════════════════════════════════════════
  renderATR(filtered) {
    if (!filtered.length) return;
    const labels = filtered.map(r => new Date(r.Datetime).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }));

    Utils.destroyChart('atr');
    const ctx = document.getElementById('chart-atr').getContext('2d');
    const defaults = Utils.getChartDefaults();

    Utils.storeChart('atr', new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'ATR', data: filtered.map(r => r.ATR), borderColor: '#F59E0B', borderWidth: 1.5,
          pointRadius: 0, tension: 0.1,
          fill: { target: 'origin', above: 'rgba(245,158,11,0.1)' }
        }]
      },
      options: { ...defaults, plugins: { ...defaults.plugins, legend: { display: false } } }
    }));
  },

  // ═══════════════════════════════════════════════════════════
  // MONTHLY RETURNS
  // ═══════════════════════════════════════════════════════════
  renderMonthlyReturns(monthlyData) {
    if (!monthlyData.length) return;
    const data = [...monthlyData].sort((a, b) => a.Month.localeCompare(b.Month));
    const labels = data.map(r => r.Month);
    const values = data.map(r => r['Return_%'] || r.Return || 0);
    const colors = values.map(v => v >= 0 ? 'rgba(16,185,129,0.7)' : 'rgba(239,68,68,0.7)');

    Utils.destroyChart('monthly');
    const ctx = document.getElementById('chart-monthly').getContext('2d');
    const defaults = Utils.getChartDefaults();

    Utils.storeChart('monthly', new Chart(ctx, {
      type: 'bar',
      data: { labels, datasets: [{ data: values, backgroundColor: colors, borderRadius: 2 }] },
      options: {
        ...defaults,
        scales: {
          ...defaults.scales,
          x: { ...defaults.scales.x, ticks: { ...defaults.scales.x.ticks, maxTicksLimit: 24 } },
          y: { ...defaults.scales.y, ticks: { ...defaults.scales.y.ticks, callback: v => v + '%' } }
        }
      }
    }));
  },

  // ═══════════════════════════════════════════════════════════
  // DRAWDOWN
  // ═══════════════════════════════════════════════════════════
  renderDrawdown(filtered) {
    if (!filtered.length) return;
    const labels = filtered.map(r => new Date(r.Datetime).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }));

    Utils.destroyChart('dd');
    const ctx = document.getElementById('chart-dd').getContext('2d');
    const defaults = Utils.getChartDefaults();

    Utils.storeChart('dd', new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Drawdown', data: filtered.map(r => r.Drawdown != null ? r.Drawdown * 100 : null),
          borderColor: '#EF4444', borderWidth: 1.5, pointRadius: 0, tension: 0.1,
          fill: { target: 'origin', below: 'rgba(239,68,68,0.25)' }
        }]
      },
      options: {
        ...defaults,
        plugins: { ...defaults.plugins, legend: { display: false } },
        scales: {
          ...defaults.scales,
          y: { ...defaults.scales.y, max: 0, ticks: { ...defaults.scales.y.ticks, callback: v => v + '%' } }
        }
      }
    }));
  },

  // ═══════════════════════════════════════════════════════════
  // HEATMAP
  // ═══════════════════════════════════════════════════════════
  renderHeatmap(monthlyData) {
    if (!monthlyData.length) return;
    const container = document.getElementById('heatmap');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const years = [...new Set(monthlyData.map(r => r.Month.split('-')[0]))].sort();

    function hmColor(v) {
      if (isNaN(v) || v == null) return 'rgba(26,40,66,0.3)';
      const norm = Math.max(-1, Math.min(1, v / 8));
      if (norm >= 0) return `rgba(16,185,129,${0.1 + norm * 0.8})`;
      return `rgba(239,68,68,${0.1 + Math.abs(norm) * 0.8})`;
    }
    function textColor(v) {
      if (isNaN(v) || v == null) return 'var(--dim)';
      const abs = Math.abs(v);
      if (abs > 4) return '#fff';
      return abs > 2 ? 'rgba(255,255,255,0.8)' : 'var(--muted)';
    }

    container.style.gridTemplateColumns = `45px repeat(12,1fr)`;

    let html = `<div class="hm-cell hm-header"></div>`;
    months.forEach(m => html += `<div class="hm-cell hm-header">${m}</div>`);

    years.forEach(yr => {
      html += `<div class="hm-cell hm-year">${yr}</div>`;
      months.forEach((m, mi) => {
        const key = `${yr}-${String(mi + 1).padStart(2, '0')}`;
        const row = monthlyData.find(r => r.Month === key);
        const ret = row ? (row['Return_%'] || row.Return || null) : null;
        const disp = ret != null ? Utils.fmtN(ret, 1) : '—';
        html += `<div class="hm-cell" 
          style="background:${hmColor(ret)};color:${textColor(ret)}"
          title="${key}: ${ret != null ? Utils.pct(ret) : 'N/A'}"
          data-drill="${key}">${disp}</div>`;
      });
    });

    container.innerHTML = html;

    // Attach click handlers via delegation (CSP-safe)
    container.addEventListener('click', (e) => {
      const cell = e.target.closest('[data-drill]');
      if (cell) window.Dashboard.drillthrough(cell.dataset.drill);
    });
  }
};

window.Charts = Charts;

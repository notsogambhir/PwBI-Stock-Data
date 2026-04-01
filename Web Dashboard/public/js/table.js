/**
 * table.js — Data table with sorting, filtering, search, pagination, data bars & icon rules
 */

const DataTable = {
  data: [],
  sortDir: {},
  currentFilter: 'all',
  searchQuery: '',
  page: 1,
  rowsPerPage: 50,

  /**
   * Set data and render
   */
  setData(filtered) {
    this.data = [...filtered].reverse();
    this.page = 1;
    this.render();
  },

  /**
   * Set filter preset
   */
  setFilter(f) {
    this.currentFilter = f;
    document.querySelectorAll('.table-controls .preset-btn').forEach(b => b.classList.remove('active'));
    const btn = document.getElementById('tbl-' + f);
    if (btn) btn.classList.add('active');
    this.page = 1;
    this.render();
  },

  /**
   * Handle search input
   */
  filter() {
    this.searchQuery = document.getElementById('table-search').value.toLowerCase();
    this.page = 1;
    this.render();
  },

  /**
   * Sort by column
   */
  sort(col) {
    if (this.sortDir[col] === undefined) this.sortDir[col] = false;
    this.sortDir[col] = !this.sortDir[col];
    this.data.sort((a, b) => {
      const av = a[col], bv = b[col];
      if (av == null) return 1;
      if (bv == null) return -1;
      return this.sortDir[col] ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
    });
    this.render();
  },

  /**
   * Go to page
   */
  goPage(p) {
    this.page = p;
    this.render();
  },

  /**
   * Set search value programmatically (for heatmap drillthrough)
   */
  setSearch(query) {
    document.getElementById('table-search').value = query;
    this.searchQuery = query.toLowerCase();
    this.page = 1;
    this.render();
  },

  /**
   * Main render function
   */
  render() {
    let data = [...this.data];

    // Apply filter
    if (this.currentFilter === 'highvol') {
      const avg = data.reduce((s, r) => s + r.Volume, 0) / data.length;
      data = data.filter(r => r.Volume > avg * 1.5);
    } else if (this.currentFilter === 'ob') {
      data = data.filter(r => r.RSI >= 70);
    } else if (this.currentFilter === 'os') {
      data = data.filter(r => r.RSI <= 30);
    }

    // Search
    if (this.searchQuery) {
      data = data.filter(r => {
        const dt = r.Datetime ? String(r.Datetime).toLowerCase() : '';
        return dt.includes(this.searchQuery) ||
          String(r.Close || '').includes(this.searchQuery);
      });
    }

    const total = data.length;
    const pages = Math.ceil(total / this.rowsPerPage);
    const start = (this.page - 1) * this.rowsPerPage;
    const slice = data.slice(start, start + this.rowsPerPage);

    // Max values for data bars
    const maxVol = Math.max(...data.map(r => r.Volume || 0));
    const maxRetAbs = Math.max(...data.map(r => Math.abs(r.Return || 0)));

    const tbody = document.getElementById('table-body');
    tbody.innerHTML = slice.map(r => {
      const retColor = (r.Return || 0) >= 0 ? 'var(--green)' : 'var(--red)';
      const macdColor = (r.MACD || 0) >= 0 ? 'var(--green)' : 'var(--red)';
      const rsiIcon = r.RSI >= 70
        ? '<span class="rsi-icon" style="color:var(--red)">⚠</span>'
        : r.RSI <= 30
          ? '<span class="rsi-icon" style="color:var(--green)">✓</span>'
          : '<span class="rsi-icon" style="color:var(--dim)">→</span>';
      const volPct = maxVol ? (r.Volume || 0) / maxVol * 100 : 0;
      const retPct = maxRetAbs ? Math.abs(r.Return || 0) / maxRetAbs * 100 : 0;
      const ddColor = (r.Drawdown || 0) < -0.1 ? 'var(--red)' : 'var(--dim)';

      return `<tr>
        <td>${r.Datetime || ''}</td>
        <td>₹${Utils.fmtN(r.Open, 2)}</td>
        <td>₹${Utils.fmtN(r.High, 2)}</td>
        <td>₹${Utils.fmtN(r.Low, 2)}</td>
        <td style="color:var(--text);font-weight:600">₹${Utils.fmtN(r.Close, 2)}</td>
        <td class="bar-cell">
          <div class="data-bar" style="width:${volPct.toFixed(0)}%;background:rgba(37,99,235,0.35)"></div>
          <span style="position:relative;z-index:1">${Utils.fmtK(r.Volume || 0)}</span>
        </td>
        <td class="bar-cell" style="color:${retColor}">
          <div class="data-bar" style="width:${retPct.toFixed(0)}%;background:${(r.Return || 0) >= 0 ? 'rgba(16,185,129,0.35)' : 'rgba(239,68,68,0.35)'}"></div>
          <span style="position:relative;z-index:1">${r.Return != null ? Utils.pct(r.Return * 100) : '—'}</span>
        </td>
        <td style="color:${r.RSI >= 70 ? 'var(--red)' : r.RSI <= 30 ? 'var(--green)' : 'var(--muted)'}">${rsiIcon}${Utils.fmtN(r.RSI, 1)}</td>
        <td style="color:${macdColor}">${Utils.fmtN(r.MACD, 3)}</td>
        <td>₹${Utils.fmtN(r.ATR, 2)}</td>
        <td style="color:${ddColor}">${r.Drawdown != null ? Utils.pct((r.Drawdown || 0) * 100) : '—'}</td>
      </tr>`;
    }).join('');

    // Info
    document.getElementById('table-info').textContent =
      `Showing ${start + 1}–${Math.min(start + this.rowsPerPage, total)} of ${total.toLocaleString()} rows`;

    // Pagination buttons
    const btnContainer = document.getElementById('page-btns');
    const showPages = [];
    if (pages <= 7) {
      for (let i = 1; i <= pages; i++) showPages.push(i);
    } else {
      showPages.push(1);
      if (this.page > 3) showPages.push('…');
      for (let i = Math.max(2, this.page - 1); i <= Math.min(pages - 1, this.page + 1); i++) showPages.push(i);
      if (this.page < pages - 2) showPages.push('…');
      showPages.push(pages);
    }

    btnContainer.innerHTML = showPages.map(p => {
      if (p === '…') return `<span class="page-btn" style="cursor:default;pointer-events:none">…</span>`;
      return `<button class="page-btn ${p === this.page ? 'active' : ''}" data-page="${p}">${p}</button>`;
    }).join('');

    // Attach click handlers via delegation (CSP-safe)
    btnContainer.querySelectorAll('[data-page]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.goPage(parseInt(btn.dataset.page));
      });
    });
  }
};

window.DataTable = DataTable;

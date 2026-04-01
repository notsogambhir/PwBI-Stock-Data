/**
 * kpi.js — KPI card renderers and smart narrative
 */

const KPI = {
  /**
   * Render Summary page KPI row (6 cards)
   */
  renderSummaryKPI(filtered) {
    if (!filtered.length) return;
    const d = filtered;
    const latest = d[d.length - 1];
    const prev = d[d.length - 2] || latest;

    const yearStart = new Date(new Date(latest.Datetime).getFullYear(), 0, 1);
    const ytdFirst = d.find(r => new Date(r.Datetime) >= yearStart);
    const ytd = ytdFirst ? (latest.Close - ytdFirst.Close) / ytdFirst.Close * 100 : 0;
    const hi52 = Math.max(...d.slice(-Math.min(252 * 7, d.length)).map(r => r.High));
    const lo52 = Math.min(...d.slice(-Math.min(252 * 7, d.length)).map(r => r.Low));
    const rsi = Utils.last(d, 'RSI');
    const dayChgPct = prev.Close ? (latest.Close - prev.Close) / prev.Close * 100 : 0;

    const rsiSignal = rsi >= 70 ? '⚠ Overbought' : rsi <= 30 ? '✅ Oversold' : rsi >= 55 ? 'Bullish' : rsi <= 45 ? 'Bearish' : 'Neutral';
    const rsiClass = rsi >= 70 ? 'c-red' : rsi <= 30 ? 'c-green' : 'c-amber';

    // Sparkline
    const sparkPts = d.slice(-40).map(r => r.Close);
    const sparkMin = Math.min(...sparkPts), sparkMax = Math.max(...sparkPts);
    const pathD = sparkPts.map((v, i) => {
      const x = i / (sparkPts.length - 1) * 100;
      const y = 22 - (v - sparkMin) / (sparkMax - sparkMin || 1) * 20;
      return (i === 0 ? 'M' : 'L') + x.toFixed(1) + ',' + y.toFixed(1);
    }).join(' ');

    const lastY = (22 - (sparkPts[sparkPts.length - 1] - sparkMin) / (sparkMax - sparkMin || 1) * 20).toFixed(1);

    document.getElementById('kpi-row-1').innerHTML = `
      <div class="kpi-card c-blue">
        <div class="kpi-label">Current Price</div>
        <div class="kpi-value v-blue">${Utils.fmtINR(latest.Close)}</div>
        <div class="kpi-sub">${Utils.pct(dayChgPct)} vs prev bar</div>
        <svg width="100%" height="24" viewBox="0 0 100 24" preserveAspectRatio="none" style="margin-top:4px">
          <path d="${pathD}" fill="none" stroke="var(--blue)" stroke-width="1.5"/>
          <circle cx="100" cy="${lastY}" r="2.5" fill="var(--blue-l)"/>
        </svg>
      </div>
      <div class="kpi-card ${dayChgPct >= 0 ? 'bg-green c-green' : 'bg-red c-red'}">
        <div class="kpi-label">Day Change</div>
        <div class="kpi-value ${dayChgPct >= 0 ? 'v-green' : 'v-red'}">${Utils.pct(dayChgPct)}</div>
        <div class="kpi-sub" style="color:${dayChgPct >= 0 ? 'var(--green)' : 'var(--red)'}">₹${Utils.fmtN(latest.Close - prev.Close, 2)}</div>
      </div>
      <div class="kpi-card c-green">
        <div class="kpi-label">YTD Return</div>
        <div class="kpi-value ${ytd >= 0 ? 'v-green' : 'v-red'}">${Utils.pct(ytd)}</div>
        <div class="kpi-sub" style="color:var(--dim)">Jan 1 → Now</div>
      </div>
      <div class="kpi-card c-dim">
        <div class="kpi-label">52W High</div>
        <div class="kpi-value v-muted">${Utils.fmtINR(hi52)}</div>
        <div class="kpi-sub v-red">${Utils.pct((latest.Close - hi52) / hi52 * 100)} from high</div>
      </div>
      <div class="kpi-card c-dim">
        <div class="kpi-label">52W Low</div>
        <div class="kpi-value v-muted">${Utils.fmtINR(lo52)}</div>
        <div class="kpi-sub v-green">${Utils.pct((latest.Close - lo52) / lo52 * 100)} from low</div>
      </div>
      <div class="kpi-card ${rsiClass}">
        <div class="kpi-label">RSI (14)</div>
        <div class="kpi-value" style="color:${rsi >= 70 ? 'var(--red)' : rsi <= 30 ? 'var(--green)' : 'var(--amber)'}">${Utils.fmtN(rsi, 1)}</div>
        <div class="kpi-sub" style="color:${rsi >= 70 ? 'var(--red)' : rsi <= 30 ? 'var(--green)' : 'var(--amber)'}">${rsiSignal}</div>
      </div>
    `;
  },

  /**
   * Render Signal Cards (Trend, MACD, AvgVol, 3M)
   */
  renderSignalCards(filtered) {
    if (!filtered.length) return;
    const d = filtered;
    const latest = d[d.length - 1];
    const m20 = Utils.last(d, 'MA20'), m50 = Utils.last(d, 'MA50');
    const macd = Utils.last(d, 'MACD'), sig = Utils.last(d, 'MACD_Signal');
    const avgVol = d.slice(-Math.min(30 * 7, d.length)).reduce((s, r) => s + r.Volume, 0) /
      Math.min(30 * 7, d.length);
    const d3m = d[Math.max(0, d.length - 66 * 7)];
    const ret3m = d3m ? (latest.Close - d3m.Close) / d3m.Close * 100 : 0;

    const trend = latest.Close > m20 && m20 > m50 ? '↑  Uptrend' :
      latest.Close < m20 && m20 < m50 ? '↓  Downtrend' : '→  Mixed';
    const trendC = trend.includes('↑') ? 'var(--green)' : trend.includes('↓') ? 'var(--red)' : 'var(--amber)';
    const macdS = macd > sig ? '↑  Bullish Cross' : '↓  Bearish Cross';
    const macdC = macd > sig ? 'var(--green)' : 'var(--red)';

    document.getElementById('s-trend').innerHTML = `
      <div class="kpi-label" style="font-size:7px">Trend Signal</div>
      <div class="kpi-value" style="font-size:14px;font-weight:700;color:${trendC}">${trend}</div>`;
    document.getElementById('s-macd').innerHTML = `
      <div class="kpi-label" style="font-size:7px">MACD Signal</div>
      <div class="kpi-value" style="font-size:13px;font-weight:700;color:${macdC}">${macdS}</div>`;
    document.getElementById('s-avgvol').innerHTML = `
      <div class="kpi-label" style="font-size:7px">Avg Vol 30D</div>
      <div class="kpi-value" style="font-size:16px;color:var(--muted)">${Utils.fmtK(Math.round(avgVol))}</div>`;
    document.getElementById('s-3m').innerHTML = `
      <div class="kpi-label" style="font-size:7px">3M Return</div>
      <div class="kpi-value" style="font-size:16px;color:${ret3m >= 0 ? 'var(--green)' : 'var(--red)'}">${Utils.pct(ret3m)}</div>`;
  },

  /**
   * Render Smart Narrative
   */
  renderNarrative(filtered) {
    if (!filtered.length) return;
    const d = filtered;
    const latest = d[d.length - 1];
    const rsi = Utils.last(d, 'RSI');
    const macd = Utils.last(d, 'MACD'), sig = Utils.last(d, 'MACD_Signal');
    const vol = latest.Volume;
    const avgVol = d.slice(-30).reduce((s, r) => s + r.Volume, 0) / 30;
    const rsiSig = rsi >= 70 ? 'Overbought' : rsi <= 30 ? 'Oversold' : rsi >= 55 ? 'Bullish' : 'Bearish';
    const m20 = Utils.last(d, 'MA20'), m50 = Utils.last(d, 'MA50');
    const trend = latest.Close > m20 && m20 > m50 ? 'Uptrend' : latest.Close < m20 && m20 < m50 ? 'Downtrend' : 'Mixed';
    const volNote = vol > avgVol * 1.5 ? 'High volume session.' : vol < avgVol * 0.5 ? 'Low volume session.' : 'Normal volume.';

    document.getElementById('smart-narrative').innerHTML =
      `<span style="color:var(--dim);font-size:8px;letter-spacing:1.5px;font-weight:600">SMART NARRATIVE</span><br><br>` +
      `Eicher Motors is trading at <span style="color:var(--blue-l)">${Utils.fmtINR(latest.Close)}</span> — ` +
      `<span style="color:${trend === 'Uptrend' ? 'var(--green)' : trend === 'Downtrend' ? 'var(--red)' : 'var(--amber)'}">${trend}</span>. ` +
      `RSI is <span style="color:${rsi >= 70 ? 'var(--red)' : rsi <= 30 ? 'var(--green)' : 'var(--amber)'}">${Utils.fmtN(rsi, 1)} (${rsiSig})</span>. ` +
      `MACD is <span style="color:${macd > sig ? 'var(--green)' : 'var(--red)'}">${macd > sig ? 'bullish' : 'bearish'} crossover</span>. ` +
      `${volNote} Showing <span style="color:var(--blue-l)">${d.length.toLocaleString()}</span> hourly bars.`;
  },

  /**
   * Render Risk page KPI row (5 cards)
   */
  renderRiskKPI(filtered, dashData) {
    const sharpe = dashData['Sharpe Ratio'] || dashData['Sharpe'] || 'N/A';
    const maxDD = dashData['Max Drawdown'] || dashData['Max DD'] || 'N/A';

    const d = filtered;
    const latest = d[d.length - 1] || {};
    const latestDt = latest.Datetime ? new Date(latest.Datetime) : new Date();
    const yearStart = new Date(latestDt.getFullYear(), 0, 1);
    const ytdFirst = d.find(r => new Date(r.Datetime) >= yearStart);
    const ytd = ytdFirst ? (latest.Close - ytdFirst.Close) / ytdFirst.Close * 100 : 0;
    const vol30 = Utils.last(d, 'Volatility');
    const d1m = d[Math.max(0, d.length - 22 * 7)];
    const ret1m = d1m ? (latest.Close - d1m.Close) / d1m.Close * 100 : 0;

    document.getElementById('kpi-row-3').innerHTML = `
      <div class="kpi-card c-green">
        <div class="kpi-label">Sharpe Ratio</div>
        <div class="kpi-value v-green">${typeof sharpe === 'number' ? Utils.fmtN(sharpe, 3) : sharpe}</div>
        <div class="kpi-sub" style="color:var(--dim);font-size:7px">Risk-Adjusted Return</div>
      </div>
      <div class="kpi-card c-red bg-red">
        <div class="kpi-label">Max Drawdown</div>
        <div class="kpi-value v-red">${typeof maxDD === 'number' ? Utils.pct(maxDD * 100) : maxDD}</div>
        <div class="kpi-sub" style="color:var(--dim);font-size:7px">Worst Peak-to-Trough</div>
      </div>
      <div class="kpi-card c-green">
        <div class="kpi-label">YTD Return %</div>
        <div class="kpi-value ${ytd >= 0 ? 'v-green' : 'v-red'}">${Utils.pct(ytd)}</div>
      </div>
      <div class="kpi-card c-amber">
        <div class="kpi-label">Volatility (Ann.)</div>
        <div class="kpi-value v-amber">${vol30 ? Utils.pct(vol30 * 100) : 'N/A'}</div>
      </div>
      <div class="kpi-card ${ret1m >= 0 ? 'c-green' : 'c-red'}">
        <div class="kpi-label">1M Return %</div>
        <div class="kpi-value ${ret1m >= 0 ? 'v-green' : 'v-red'}">${Utils.pct(ret1m)}</div>
      </div>
    `;
  }
};

window.KPI = KPI;

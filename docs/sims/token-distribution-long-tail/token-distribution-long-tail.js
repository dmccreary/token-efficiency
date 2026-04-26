// Token Distribution Long Tail - Chart.js histogram + cost-share bars
// CANVAS_HEIGHT: 600
// Bloom Level: Evaluate (L5) - assess

(function () {
'use strict';
function genWorkload(shape, n=2000) {
    const arr = [];
    for (let i = 0; i < n; i++) {
        let v;
        if (shape === 'body') {
            v = Math.exp(6.5 + (Math.random() - 0.5) * 0.6);
        } else if (shape === 'tail') {
            v = Math.exp(6 + (Math.random() - 0.5) * 0.8);
            if (Math.random() < 0.05) v *= Math.exp(Math.random() * 3); // 5% are huge
        } else if (shape === 'bimodal') {
            v = Math.random() < 0.6 ? Math.exp(6 + (Math.random()-0.5)*0.4) : Math.exp(8.5 + (Math.random()-0.5)*0.5);
        } else {
            v = Math.exp(6.5 + (Math.random() - 0.5) * 0.7);
            if (Math.random() < 0.02) v *= Math.exp(Math.random() * 2);
        }
        arr.push(Math.max(50, Math.min(50000, v)));
    }
    return arr;
}
let histChart = null, shareChart = null;
function build() {
    histChart = new Chart(document.getElementById('hist').getContext('2d'), {
        type: 'bar',
        data: { labels: [], datasets: [{ data: [], backgroundColor: '#0277bd', borderWidth: 0 }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } },
            scales: { x: { type: 'logarithmic', title: { display: true, text: 'Input tokens (log)' }, ticks: { font: { size: 9 } } }, y: { ticks: { font: { size: 9 } } } } }
    });
    shareChart = new Chart(document.getElementById('share').getContext('2d'), {
        type: 'bar',
        data: { labels: ['P0-50','P50-95','P95-99','P99-100'], datasets: [{ data: [], backgroundColor: ['#94a3b8','#0277bd','#f59e0b','#c62828'], borderWidth: 0 }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, max: 100, title: { display: true, text: 'Cost share (%)' }, ticks: { callback: v => v+'%', font: { size: 9 } } }, x: { ticks: { font: { size: 9 } } } } }
    });
}

function pct(arr, p) { const s = [...arr].sort((a,b)=>a-b); return s[Math.floor(p * s.length)]; }
function update() {
    const shape = document.getElementById('shape').value;
    const cap = +document.getElementById('capSlider').value;
    document.getElementById('capVal').textContent = cap >= 50000 ? 'none' : cap.toLocaleString();
    const data = genWorkload(shape);
    const cappedData = cap >= 50000 ? data : data.map(v => Math.min(v, cap));

    // Histogram (log bins)
    const bins = 20; const minLog = Math.log10(50), maxLog = Math.log10(50000);
    const counts = new Array(bins).fill(0);
    cappedData.forEach(v => { const idx = Math.min(bins-1, Math.floor((Math.log10(v) - minLog) / (maxLog - minLog) * bins)); counts[idx]++; });
    const labels = counts.map((_, i) => Math.round(Math.pow(10, minLog + i * (maxLog - minLog) / bins)));
    histChart.data.labels = labels;
    histChart.data.datasets[0].data = counts;
    histChart.update('none');

    // Cost share by percentile band (cost ~ tokens for a fixed price)
    const sorted = [...cappedData].sort((a,b)=>a-b);
    const totalCost = sorted.reduce((a,b)=>a+b, 0);
    function bandShare(loP, hiP) {
        const lo = Math.floor(loP * sorted.length); const hi = Math.floor(hiP * sorted.length);
        const sum = sorted.slice(lo, hi).reduce((a,b)=>a+b, 0);
        return totalCost > 0 ? sum / totalCost * 100 : 0;
    }
    const shares = [bandShare(0, 0.5), bandShare(0.5, 0.95), bandShare(0.95, 0.99), bandShare(0.99, 1.0)];
    shareChart.data.datasets[0].data = shares.map(s => +s.toFixed(1));
    shareChart.update('none');

    const p50 = Math.round(pct(cappedData, 0.5)), p95 = Math.round(pct(cappedData, 0.95)), p99 = Math.round(pct(cappedData, 0.99));
    const tailShare = (shares[3]).toFixed(1);
    const status = document.getElementById('status');
    status.className = 'status';
    if (+tailShare > 30) {
        status.className = 'status fired-tokens';
        status.innerHTML = `<b>Tail-heavy.</b> P50=${p50}, P95=${p95}, P99=${p99}. The top 1% of requests account for <b>${tailShare}%</b> of total cost. Add a token cap or runaway detection.`;
    } else {
        status.className = 'status success';
        status.innerHTML = `<b>Body-heavy.</b> P50=${p50}, P95=${p95}, P99=${p99}. Top 1% accounts for ${tailShare}%. Optimize the median, not the tail.`;
    }
}
function init() { build(); ['shape','capSlider'].forEach(id => { const el = document.getElementById(id); el.addEventListener('change', update); el.addEventListener('input', update); }); update(); }
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();

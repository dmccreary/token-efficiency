// Output Control Settings - Chart.js histograms
// CANVAS_HEIGHT: 540
// Bloom Level: Analyze (L4) - differentiate

(function () {
'use strict';
// Generate a synthetic baseline distribution: roughly log-normal centered around ~800 tokens
function genBaseline() {
    const arr = [];
    for (let i = 0; i < 1000; i++) {
        const u = Math.random(); const v = Math.random();
        const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
        const tokens = Math.exp(6.5 + z * 0.5); // log-normal
        arr.push(Math.max(50, Math.min(4000, tokens)));
    }
    return arr;
}
const baseline = genBaseline();

function applyConfig(cfg, data, mt) {
    return data.map(t => {
        let r = t;
        if (cfg.maxTokens) r = Math.min(r, mt);
        if (cfg.stopSeq) r = Math.min(r, t * 0.75);     // stop sequence often clips ~25%
        if (cfg.concise) r = r * 0.6;                    // concise instruction shrinks output
        return Math.max(20, r);
    });
}

const configs = [
    { id: 'h0', readId: 'r0', cfg: {}, label: 'Baseline' },
    { id: 'h1', readId: 'r1', cfg: { maxTokens: true }, label: '+max_tokens' },
    { id: 'h2', readId: 'r2', cfg: { stopSeq: true }, label: '+stop seq' },
    { id: 'h3', readId: 'r3', cfg: { concise: true }, label: '+concise' },
    { id: 'h4', readId: 'r4', cfg: { maxTokens: true, stopSeq: true, concise: true }, label: '+all' }
];

const charts = {};

function bin(values, binCount, max) {
    const w = max / binCount;
    const counts = new Array(binCount).fill(0);
    values.forEach(v => { const i = Math.min(binCount - 1, Math.floor(v / w)); counts[i]++; });
    return { labels: counts.map((_, i) => Math.round(i * w)), counts };
}

function makeChart(canvasId) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    return new Chart(ctx, {
        type: 'bar',
        data: { labels: [], datasets: [{ data: [], backgroundColor: '#0277bd', borderWidth: 0 }] },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: { enabled: true } },
            scales: { x: { ticks: { font: { size: 8 }, maxTicksLimit: 5 } }, y: { ticks: { font: { size: 9 } } } }
        }
    });
}

function update() {
    const mt = +document.getElementById('mtSlider').value;
    const showTrunc = document.getElementById('showTrunc').checked;
    document.getElementById('mtVal').textContent = mt;
    configs.forEach(c => {
        const data = applyConfig(c.cfg, baseline, mt);
        const { labels, counts } = bin(data, 12, 4000);
        charts[c.id].data.labels = labels;
        charts[c.id].data.datasets[0].data = counts;
        charts[c.id].update('none');
        const med = data.slice().sort((a,b) => a-b)[Math.floor(data.length / 2)];
        const avgCost = data.reduce((a,b) => a+b, 0) / data.length;
        const truncRate = c.cfg.maxTokens ? (data.filter(t => t >= mt - 1).length / data.length * 100) : 0;
        let txt = `med ${Math.round(med)} tok | avg ~$${(avgCost * 15 / 1e6).toFixed(4)}/resp`;
        if (showTrunc && c.cfg.maxTokens) txt += ` | trunc ${truncRate.toFixed(1)}%`;
        document.getElementById(c.readId).textContent = txt;
    });
}

function init() {
    configs.forEach(c => { charts[c.id] = makeChart(c.id); });
    document.getElementById('mtSlider').addEventListener('input', update);
    document.getElementById('showTrunc').addEventListener('change', update);
    update();
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
})();

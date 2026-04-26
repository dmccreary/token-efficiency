// Session Token Accumulation - Chart.js stacked area + cost overlay
// CANVAS_HEIGHT: 540
// Bloom Level: Analyze (L4) - examine

(function () {
'use strict';
let chart = null;
function build() {
    const ctx = document.getElementById('chart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: { labels: [], datasets: [
            { label: 'Harness sys prompt',  data: [], backgroundColor: 'rgba(2,119,189,0.6)', borderColor: '#0277bd', fill: true, pointRadius: 0, yAxisID: 'y' },
            { label: 'Tool definitions',    data: [], backgroundColor: 'rgba(124,58,237,0.6)', borderColor: '#7c3aed', fill: true, pointRadius: 0, yAxisID: 'y' },
            { label: 'Conversation history (quadratic)', data: [], backgroundColor: 'rgba(193,68,14,0.6)', borderColor: '#c1440e', fill: true, pointRadius: 0, yAxisID: 'y' },
            { label: 'Tool results',        data: [], backgroundColor: 'rgba(245,158,11,0.6)', borderColor: '#f59e0b', fill: true, pointRadius: 0, yAxisID: 'y' },
            { label: 'Outputs',             data: [], backgroundColor: 'rgba(46,125,50,0.6)', borderColor: '#2e7d32', fill: true, pointRadius: 0, yAxisID: 'y' },
            { label: 'Cost no cache ($)',   data: [], borderColor: '#c62828', borderWidth: 2, fill: false, pointRadius: 0, yAxisID: 'y1' },
            { label: 'Cost with cache ($)', data: [], borderColor: '#2e7d32', borderWidth: 2, borderDash: [4,4], fill: false, pointRadius: 0, yAxisID: 'y1' }
        ] },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom', labels: { font: { size: 10 }, boxWidth: 12 } } },
            scales: {
                y:  { stacked: true, beginAtZero: true, title: { display: true, text: 'Cumulative tokens' } },
                y1: { stacked: false, position: 'right', beginAtZero: true, grid: { display: false }, title: { display: true, text: 'Cost ($)' } },
                x:  { title: { display: true, text: 'Tool-call iteration' } }
            }
        }
    });
}
function update() {
    const SP = +document.getElementById('spSlider').value;
    const TR = +document.getElementById('trSlider').value;
    const OUT = +document.getElementById('outSlider').value;
    const N = +document.getElementById('itSlider').value;
    const cache = document.getElementById('cacheOn').checked;
    document.getElementById('spVal').textContent = SP.toLocaleString();
    document.getElementById('trVal').textContent = TR.toLocaleString();
    document.getElementById('outVal').textContent = OUT;
    document.getElementById('itVal').textContent = N;

    const TOOLDEFS = 1500;
    const labels = []; const sysData = [], tdData = [], convData = [], trData = [], outData = [];
    const costNoCache = [], costCache = [];
    let cumNoCache = 0, cumCache = 0;
    for (let i = 1; i <= N; i++) {
        labels.push(i);
        // Each turn reads: SP + tool defs + conversation history (sum of all prior turns) + new tool result + new output
        const convThisTurn = (TR + OUT) * (i - 1); // grows linearly per turn → quadratic stack
        // Stacked sums (cumulative across turns)
        sysData.push(SP * i);
        tdData.push(TOOLDEFS * i);
        convData.push((TR + OUT) * (i - 1) * (i) / 2); // triangular sum
        trData.push(TR * i);
        outData.push(OUT * i);
        const inputThisTurn = SP + TOOLDEFS + convThisTurn + TR;
        const outputThisTurn = OUT;
        cumNoCache += (inputThisTurn * 3 + outputThisTurn * 15) / 1e6;
        const sysCost = (i === 1 ? SP * 1.25 : SP * 0.10);
        cumCache += (sysCost + (TOOLDEFS + convThisTurn + TR) * 3 + outputThisTurn * 15) / 1e6;
        costNoCache.push(+cumNoCache.toFixed(4));
        costCache.push(+(cache ? cumCache : cumNoCache).toFixed(4));
    }
    chart.data.labels = labels;
    chart.data.datasets[0].data = sysData;
    chart.data.datasets[1].data = tdData;
    chart.data.datasets[2].data = convData;
    chart.data.datasets[3].data = trData;
    chart.data.datasets[4].data = outData;
    chart.data.datasets[5].data = costNoCache;
    chart.data.datasets[6].data = costCache;
    chart.update('none');
    const status = document.getElementById('status');
    status.className = 'status';
    const finalNoCache = costNoCache[N-1], finalCache = costCache[N-1];
    const savings = ((1 - finalCache/finalNoCache)*100).toFixed(1);
    status.innerHTML = `After ${N} iterations: total cost $${finalNoCache.toFixed(2)} no-cache vs $${finalCache.toFixed(2)} cached (<b>${savings}% savings</b>). Conv history grows quadratically — that's the orange band.`;
}
function init() { build(); ['spSlider','trSlider','outSlider','itSlider','cacheOn'].forEach(id => { const el = document.getElementById(id); el.addEventListener('input', update); el.addEventListener('change', update); }); update(); }
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();

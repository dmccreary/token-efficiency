// Serial vs Parallel Tradeoff - Chart.js dual-axis bars
// CANVAS_HEIGHT: 540
// Bloom Level: Evaluate (L5) - judge

(function () {
'use strict';
const PARALLELISMS = [1, 2, 4, 8, 16];
const PRICE_INPUT = 3.0;     // $/MTok
const PRICE_OUTPUT = 15.0;   // $/MTok
const SECONDS_PER_KTOK = 0.5; // typical generation time

let chart = null;
function build() {
    const ctx = document.getElementById('chart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: PARALLELISMS.map(p => p === 1 ? 'serial' : `× ${p}`),
            datasets: [
                { label: 'Wall-clock time (s)', data: [], backgroundColor: '#0277bd', yAxisID: 'y' },
                { label: 'Total cost ($)',      data: [], backgroundColor: '#c2410c', yAxisID: 'y1' }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom', labels: { font: { size: 11 } } } },
            scales: {
                y:  { beginAtZero: true, position: 'left',  title: { display: true, text: 'Wall-clock time (s)', font: { size: 11 } } },
                y1: { beginAtZero: true, position: 'right', grid: { display: false }, title: { display: true, text: 'Cost ($)', font: { size: 11 } } },
                x:  { title: { display: true, text: 'Parallelism factor' } }
            }
        }
    });
}

function update() {
    const N = +document.getElementById('nSlider').value;
    const SP = +document.getElementById('spSlider').value;
    const ST = +document.getElementById('stSlider').value;
    const cache = document.getElementById('cacheOn').checked;
    document.getElementById('nVal').textContent = N;
    document.getElementById('spVal').textContent = SP.toLocaleString();
    document.getElementById('stVal').textContent = ST.toLocaleString();

    // Each subtask: system prompt (cached if shared) + subtask tokens (output split equally)
    // Serial: SP loaded once + cached for N-1 subsequent + N subtasks of ST
    // Parallel × P: P parallel subagents, each pays SP write once (or read if shared cache hot — assume cache cold per agent if cache on, paying 1.25x once + 0.10x for subsequent within the same parallel chunk)
    // Simplified: with caching, serial pays SP once at write (1.25x) + N-1 reads (0.10x). Parallel × P pays SP write × P agents + (N/P - 1) reads per agent.

    const cwMult = 1.25, crMult = 0.10;
    const times = [], costs = [];
    PARALLELISMS.forEach(P => {
        const subtasksPerAgent = Math.ceil(N / P);
        // Time: each agent processes its subtasks serially; agents run in parallel; bottleneck = max agent time
        const tokensPerSubtask = ST;
        const timePerSubtask = (tokensPerSubtask / 1000) * SECONDS_PER_KTOK;
        const wallClockSeconds = subtasksPerAgent * timePerSubtask;

        // Cost: per agent, SP cost + N/P subtask token cost
        let spCostPerAgent;
        if (cache) {
            spCostPerAgent = (SP * cwMult + SP * crMult * (subtasksPerAgent - 1)) * PRICE_INPUT / 1e6;
        } else {
            spCostPerAgent = SP * subtasksPerAgent * PRICE_INPUT / 1e6;
        }
        const subtaskInputCost = ST * subtasksPerAgent * PRICE_INPUT / 1e6;
        const subtaskOutputCost = ST * 0.3 * subtasksPerAgent * PRICE_OUTPUT / 1e6; // assume 30% output ratio
        const costPerAgent = spCostPerAgent + subtaskInputCost + subtaskOutputCost;
        const totalCost = costPerAgent * P;
        times.push(wallClockSeconds);
        costs.push(totalCost);
    });
    chart.data.datasets[0].data = times;
    chart.data.datasets[1].data = costs.map(c => +c.toFixed(4));
    chart.update('none');

    const t1 = times[0], tn = times[times.length - 1];
    const c1 = costs[0], cn = costs[costs.length - 1];
    const speedup = (t1 / tn).toFixed(1);
    const costMultiplier = (cn / c1).toFixed(1);
    const status = document.getElementById('status');
    status.className = 'status';
    status.innerHTML = `Going from serial → ×16: speedup <b>${speedup}×</b>, cost <b>${costMultiplier}×</b> baseline. Caching ${cache ? 'on' : 'off'}.`;
}

function init() { build(); ['nSlider','spSlider','stSlider','cacheOn'].forEach(id => { const el = document.getElementById(id); el.addEventListener('input', update); el.addEventListener('change', update); }); update(); }
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();

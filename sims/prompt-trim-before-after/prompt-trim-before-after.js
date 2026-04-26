// Prompt Trim Before/After - Chart.js grouped horizontal bars
// CANVAS_HEIGHT: 540
// Bloom Level: Evaluate (L5) - assess

(function () {
'use strict';
// Section: [before, afterIfTechniqueOn] tied to which technique
const sections = [
    { name: 'System prompt',     before: 5200, after: 2800, technique: 't1' },
    { name: 'Tool defs',         before: 1800, after: 1400, technique: 't2' },
    { name: 'Few-shot',          before: 2400, after:  800, technique: 't3' },
    { name: 'Retrieved context', before: 1500, after: 1500, technique: null },
    { name: 'User message',      before:  200, after:  200, technique: null },
    { name: 'Output budget',     before: 1000, after:  400, technique: 't4' }
];
let chart = null;
function build() {
    const ctx = document.getElementById('chart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sections.map(s => s.name),
            datasets: [
                { label: 'Before',  data: [], backgroundColor: '#94a3b8' },
                { label: 'After',   data: [], backgroundColor: '#2e7d32' }
            ]
        },
        options: {
            indexAxis: 'y', responsive: true, maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom', labels: { font: { size: 11 } } }, tooltip: { mode: 'index' } },
            scales: { x: { beginAtZero: true, title: { display: true, text: 'Tokens' } }, y: { ticks: { font: { size: 11 } } } }
        }
    });
}
function update() {
    const techniques = { t1: document.getElementById('t1').checked, t2: document.getElementById('t2').checked, t3: document.getElementById('t3').checked, t4: document.getElementById('t4').checked };
    const before = sections.map(s => s.before);
    const after = sections.map(s => (s.technique && !techniques[s.technique]) ? s.before : s.after);
    chart.data.datasets[0].data = before;
    chart.data.datasets[1].data = after;
    chart.update('none');
    const totalB = before.reduce((a,b)=>a+b, 0);
    const totalA = after.reduce((a,b)=>a+b, 0);
    const reduction = ((1 - totalA/totalB) * 100).toFixed(1);
    const vol = +document.getElementById('volSlider').value;
    document.getElementById('volVal').textContent = vol.toLocaleString();
    const tokensSavedPerMonth = (totalB - totalA) * vol;
    const dollarsPerMonth = tokensSavedPerMonth * 3 / 1e6; // assume $3/MTok input
    const status = document.getElementById('status');
    status.className = 'status success';
    status.innerHTML = `Total ${totalB.toLocaleString()} → ${totalA.toLocaleString()} tokens (<b>${reduction}% reduction</b>) · Monthly savings at ${vol.toLocaleString()} req/mo: <b>$${dollarsPerMonth.toLocaleString(undefined, {maximumFractionDigits: 0})}</b>`;
}
function init() { build(); ['t1','t2','t3','t4','volSlider'].forEach(id => { const el = document.getElementById(id); el.addEventListener('change', update); el.addEventListener('input', update); }); update(); }
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();

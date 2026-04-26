// Skill Refactoring Before/After - Chart.js grouped bars
// CANVAS_HEIGHT: 540
// Bloom Level: Evaluate (L5) - justify

(function () {
'use strict';
const STEPS = [
    { name: 'Step 1: Read inputs',          before: 400, scriptable: true },
    { name: 'Step 2: Validate schema',      before: 600, scriptable: true },
    { name: 'Step 3: Compute hash',         before: 350, scriptable: true },
    { name: 'Step 4: Look up template',     before: 300, scriptable: true },
    { name: 'Step 5: Apply judgment',       before: 800, scriptable: false }, // pure judgment
    { name: 'Step 6: Generate output text', before: 1200, scriptable: false },
    { name: 'Step 7: Format output',        before: 350, scriptable: true }
];
let chart = null;
const refactored = STEPS.map(s => s.scriptable);

function build() {
    // Build per-step toggles
    const row = document.getElementById('stepsRow');
    STEPS.forEach((s, i) => {
        const lab = document.createElement('label');
        lab.className = 'control-block';
        lab.innerHTML = `<input type="checkbox" id="step${i}"${refactored[i] ? ' checked' : ''}${!s.scriptable ? ' disabled' : ''}> ${s.name}${!s.scriptable ? ' (judgment)' : ''}`;
        row.appendChild(lab);
        if (s.scriptable) document.getElementById(`step${i}`).addEventListener('change', () => { refactored[i] = document.getElementById(`step${i}`).checked; update(); });
    });
    const ctx = document.getElementById('chart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: STEPS.map(s => s.name),
            datasets: [
                { label: 'Before', data: [], backgroundColor: '#94a3b8' },
                { label: 'After',  data: [], backgroundColor: '#2e7d32' }
            ]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } }, scales: { y: { beginAtZero: true, title: { display: true, text: 'Tokens per invocation' } }, x: { ticks: { font: { size: 10 } } } } }
    });
}

function update() {
    const before = STEPS.map(s => s.before);
    const after = STEPS.map((s, i) => (s.scriptable && refactored[i]) ? 30 : s.before); // ~30 tokens for script invocation
    chart.data.datasets[0].data = before;
    chart.data.datasets[1].data = after;
    chart.update('none');
    const totalB = before.reduce((a,b) => a+b, 0);
    const totalA = after.reduce((a,b) => a+b, 0);
    const reduction = ((1 - totalA/totalB) * 100).toFixed(1);
    const inv = +document.getElementById('invSlider').value;
    const pr = +document.getElementById('prSlider').value;
    document.getElementById('invVal').textContent = inv.toLocaleString();
    document.getElementById('prVal').textContent = pr.toFixed(2);
    const monthlyTokens = (totalB - totalA) * inv;
    const monthlySavings = monthlyTokens * pr / 1e6;
    const status = document.getElementById('status');
    status.className = 'status success';
    status.innerHTML = `Per-invocation: ${totalB} → ${totalA} tokens (<b>${reduction}% saving</b>) · Monthly @ ${inv.toLocaleString()} invocations: <b>$${monthlySavings.toLocaleString(undefined, {maximumFractionDigits: 0})}</b>`;
}
function init() { build(); document.getElementById('invSlider').addEventListener('input', update); document.getElementById('prSlider').addEventListener('input', update); update(); }
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();

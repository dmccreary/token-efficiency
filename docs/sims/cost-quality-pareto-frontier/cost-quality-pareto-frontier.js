// Cost-Quality Pareto Frontier - Chart.js scatter
// CANVAS_HEIGHT: 580
// Bloom Level: Evaluate (L5) - judge

(function () {
'use strict';
const points = [
    { label: 'Tiny model',                 cost: 0.001, q: 60 },
    { label: 'Small model, no caching',    cost: 0.005, q: 75 },
    { label: 'Small model, with caching',  cost: 0.002, q: 75 },
    { label: 'Mid model, no caching',      cost: 0.020, q: 85 },
    { label: 'Mid model, with caching',    cost: 0.008, q: 85 },
    { label: 'Large model',                cost: 0.100, q: 92 },
    { label: 'Large + thinking',           cost: 0.300, q: 95 },
    // dominated
    { label: 'Mid + expensive prompt',     cost: 0.030, q: 80 },
    { label: 'Small + verbose prompt',     cost: 0.015, q: 70 }
];

// Compute Pareto frontier: a point is non-dominated iff no other point has both lower cost AND higher quality
function dominated(p, all) {
    return all.some(o => (o !== p) && (o.cost <= p.cost && o.q >= p.q) && (o.cost < p.cost || o.q > p.q));
}

let chart = null;
function build() {
    const ctx = document.getElementById('chart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'scatter',
        data: { datasets: [
            { label: 'Frontier (non-dominated)', data: [], backgroundColor: '#2e7d32', pointRadius: 8, pointHoverRadius: 11 },
            { label: 'Dominated (gray)',         data: [], backgroundColor: '#94a3b8', pointRadius: 6, pointHoverRadius: 9 },
            { label: 'Frontier line',            data: [], type: 'line', borderColor: '#2e7d32', borderDash: [4, 4], borderWidth: 2, pointRadius: 0, fill: false, showLine: true }
        ] },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { font: { size: 11 } } },
                tooltip: { callbacks: { label: ctx => `${ctx.raw.label}: $${ctx.raw.x.toFixed(3)}, q=${ctx.raw.y}` } }
            },
            scales: {
                x: { type: 'logarithmic', title: { display: true, text: 'Cost per request ($, log)' }, min: 0.0008, max: 1.2 },
                y: { title: { display: true, text: 'Quality score' }, min: 50, max: 100 }
            }
        }
    });
}

function update() {
    const qFloor = +document.getElementById('qSlider').value;
    const cCeil = +document.getElementById('cSlider').value;
    document.getElementById('qVal').textContent = qFloor;
    document.getElementById('cVal').textContent = cCeil.toFixed(3);

    const frontier = points.filter(p => !dominated(p, points));
    const dominatedSet = points.filter(p => dominated(p, points));

    // Apply constraints — points failing constraints get gray-out (alpha)
    function meets(p) { return p.q >= qFloor && p.cost <= cCeil; }

    chart.data.datasets[0].data = frontier.map(p => ({ x: p.cost, y: p.q, label: p.label }));
    chart.data.datasets[0].backgroundColor = frontier.map(p => meets(p) ? '#2e7d32' : 'rgba(46,125,50,0.25)');
    chart.data.datasets[1].data = dominatedSet.map(p => ({ x: p.cost, y: p.q, label: p.label }));
    chart.data.datasets[1].backgroundColor = dominatedSet.map(p => meets(p) ? '#94a3b8' : 'rgba(148,163,184,0.25)');

    // Frontier line: sort by cost
    const sortedFrontier = [...frontier].sort((a,b) => a.cost - b.cost);
    chart.data.datasets[2].data = sortedFrontier.map(p => ({ x: p.cost, y: p.q }));

    chart.update('none');

    const survivors = points.filter(p => !dominated(p, points) && meets(p));
    const status = document.getElementById('status');
    if (survivors.length === 0) {
        status.className = 'status fired-tokens';
        status.textContent = `No frontier configuration meets your constraints. Loosen quality floor or raise cost ceiling.`;
    } else {
        status.className = 'status success';
        status.innerHTML = `Survivors on frontier: <b>${survivors.map(s => s.label).join(', ')}</b>. Pick the cheapest.`;
    }
}

function init() {
    build();
    ['qSlider', 'cSlider'].forEach(id => {
        document.getElementById(id).addEventListener('input', update);
    });
    update();
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
})();

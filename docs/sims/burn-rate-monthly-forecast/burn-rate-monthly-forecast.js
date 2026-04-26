// Burn Rate Monthly Forecast - Chart.js
// CANVAS_HEIGHT: 540
// Bloom Level: Apply (L3) - calculate
// LO: Calculate a monthly cost forecast from a partial-month burn rate.

(function () {
'use strict';
let chart = null;
const DAYS = 30;

// Pre-baked daily spend (looks realistic, weekday-heavy)
function baseDailySpend() {
    const arr = [];
    for (let d = 1; d <= DAYS; d++) {
        const dow = (d - 1) % 7; // 0=Mon ... 6=Sun
        const isWeekend = dow >= 5;
        const base = isWeekend ? 600 : 1100;
        const noise = 1 + (Math.sin(d * 1.7) * 0.15);
        arr.push(Math.round(base * noise));
    }
    return arr;
}

const actualDaily = baseDailySpend();

function buildChart() {
    const ctx = document.getElementById('chart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Array.from({ length: DAYS }, (_, i) => 'D' + (i + 1)),
            datasets: [
                { type: 'bar',  label: 'Daily spend ($)', data: [], backgroundColor: '#0277bd', yAxisID: 'y' },
                { type: 'line', label: 'Cumulative actual', data: [], borderColor: '#2e7d32', borderWidth: 2, pointRadius: 0, fill: false, yAxisID: 'y1' },
                { type: 'line', label: 'Cumulative forecast', data: [], borderColor: '#2e7d32', borderWidth: 2, borderDash: [6, 4], pointRadius: 0, fill: false, yAxisID: 'y1' },
                { type: 'line', label: 'Budget', data: [], borderColor: '#c62828', borderWidth: 2, pointRadius: 0, fill: false, yAxisID: 'y1' }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { font: { size: 11 } } },
                tooltip: { mode: 'index', intersect: false }
            },
            scales: {
                y:  { beginAtZero: true, position: 'left',  title: { display: true, text: 'Daily spend ($)', font: { size: 10 } } },
                y1: { beginAtZero: true, position: 'right', title: { display: true, text: 'Cumulative ($)', font: { size: 10 } }, grid: { display: false } },
                x:  { ticks: { font: { size: 9 }, maxRotation: 0 } }
            }
        }
    });
}

function update() {
    const today = +document.getElementById('daySlider').value;
    const burn = +document.getElementById('burnSlider').value;
    const seasonality = document.getElementById('seasonality').checked;
    const budget = +document.getElementById('budgetSlider').value;
    document.getElementById('dayVal').textContent = today;
    document.getElementById('burnVal').textContent = burn.toFixed(2);
    document.getElementById('budgetVal').textContent = budget.toLocaleString();

    // Daily spend: actuals up to today, blank after
    const daily = actualDaily.map((v, i) => i < today ? v : null);
    chart.data.datasets[0].data = daily;

    // Average burn rate over actual days
    const actualSum = actualDaily.slice(0, today).reduce((a,b) => a+b, 0);
    const avgBurn = today > 0 ? actualSum / today : 0;

    // Cumulative actual: real cumsum up to today, then null
    const cumActual = [];
    let cum = 0;
    for (let i = 0; i < DAYS; i++) {
        if (i < today) { cum += actualDaily[i]; cumActual.push(cum); }
        else cumActual.push(null);
    }
    chart.data.datasets[1].data = cumActual;

    // Cumulative forecast: from today onward, extrapolate
    let projected = today > 0 ? cumActual[today - 1] : 0;
    const fc = new Array(DAYS).fill(null);
    if (today > 0) fc[today - 1] = projected;
    for (let i = today; i < DAYS; i++) {
        const dow = i % 7;
        const isWeekend = dow >= 5;
        const seasonMult = seasonality ? (isWeekend ? 0.6 : 1.3) : 1.0;
        projected += avgBurn * burn * seasonMult;
        fc[i] = projected;
    }
    chart.data.datasets[2].data = fc;

    // Budget line
    chart.data.datasets[3].data = new Array(DAYS).fill(budget);

    chart.update('none');

    // Status banner
    const finalForecast = fc[DAYS - 1];
    const status = document.getElementById('statusBanner');
    if (finalForecast === null) {
        status.className = 'status'; status.textContent = 'No actual data yet — slide "today" forward to see a forecast.';
    } else if (finalForecast > budget) {
        const overage = finalForecast - budget;
        status.className = 'status fired-tokens';
        status.textContent = `OVER BUDGET — projected $${Math.round(finalForecast).toLocaleString()} vs $${budget.toLocaleString()} (overage $${Math.round(overage).toLocaleString()}).`;
    } else {
        status.className = 'status success';
        const slack = budget - finalForecast;
        status.textContent = `ON TRACK — projected $${Math.round(finalForecast).toLocaleString()} vs $${budget.toLocaleString()} (slack $${Math.round(slack).toLocaleString()}).`;
    }
}

function init() {
    buildChart();
    ['daySlider', 'burnSlider', 'seasonality', 'budgetSlider'].forEach(id => {
        const el = document.getElementById(id);
        el.addEventListener('input', update);
        el.addEventListener('change', update);
    });
    update();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
})();

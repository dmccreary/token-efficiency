// Token Spike Alert with Drill-Down — Chart.js
// CANVAS_HEIGHT: 590
// Bloom Level: Analyze (L4) - deconstruct
// Learning objective: Deconstruct a token spike using drill-down analysis to
// identify the contributing feature, user, or template responsible.

(function () {
    'use strict';

    // 24-hourly time series with a clean spike around hour 14.
    function buildSeries() {
        const labels = [];
        const data = [];
        for (let h = 0; h < 24; h++) {
            labels.push(`${String(h).padStart(2, '0')}:00`);
            const base = 35000 + Math.sin(h * 0.4) * 8000 + Math.sin(h * 1.1) * 3000;
            // Spike at hour 14 — large and sharp, with a 13:30 ramp and 14:30 tail
            let v = base;
            if (h === 13) v = base + 35000;
            if (h === 14) v = base + 175000;
            if (h === 15) v = base + 25000;
            data.push(Math.round(v));
        }
        return { labels, data };
    }

    const series = buildSeries();

    // Drill-down breakdown — explains the hour-14 spike.
    const drilldownByFeature = {
        labels: ['exec_summary', 'agent_research', 'rag_qna', 'code_review', 'other'],
        // exec_summary dominates at 85%
        values: [85, 6, 4, 3, 2]
    };
    const drilldownByUser = {
        labels: ['usr_72ad', 'usr_19c4', 'usr_5e0b', 'usr_8a13', 'usr_2f88'],
        // user usr_72ad dominates within feature exec_summary at 78%
        values: [78, 9, 6, 4, 3]
    };
    const drilldownByHash = {
        labels: ['9af2c7b8', '4d12fe09', 'b81e4d63', '15c8af3e', '07a4e1bb'],
        // one prompt template at 92%
        values: [92, 4, 2, 1, 1]
    };

    let timelineChart = null;
    let featureChart = null;
    let userChart = null;
    let hashChart = null;
    let drillOpen = false;

    function fmt(n) { return Math.round(n).toLocaleString('en-US'); }

    function buildTimeline() {
        const ctx = document.getElementById('timeline').getContext('2d');
        const baseline = baselineEnvelope();

        timelineChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: series.labels,
                datasets: [
                    {
                        label: 'Baseline +2σ',
                        data: baseline.upper,
                        borderColor: 'rgba(2, 119, 189, 0)',
                        backgroundColor: 'rgba(2, 119, 189, 0.08)',
                        fill: '+1',
                        pointRadius: 0,
                        borderWidth: 0,
                        order: 5
                    },
                    {
                        label: 'Baseline -2σ',
                        data: baseline.lower,
                        borderColor: 'rgba(2, 119, 189, 0)',
                        backgroundColor: 'rgba(255,255,255,0)',
                        pointRadius: 0,
                        borderWidth: 0,
                        order: 6
                    },
                    {
                        label: 'Tokens/min',
                        data: series.data,
                        borderColor: '#0277bd',
                        backgroundColor: '#0277bd',
                        pointRadius: (ctx) => {
                            const v = ctx.parsed?.y ?? 0;
                            return v > 100000 ? 5 : 2;
                        },
                        pointHoverRadius: 7,
                        borderWidth: 2,
                        tension: 0.25,
                        order: 1
                    },
                    {
                        label: 'Alert threshold',
                        data: new Array(series.labels.length).fill(getThreshold()),
                        borderColor: '#c62828',
                        backgroundColor: 'transparent',
                        pointRadius: 0,
                        borderWidth: 2,
                        borderDash: [6, 4],
                        order: 2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 250 },
                onClick: handleTimelineClick,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: { font: { size: 11 }, boxWidth: 14 }
                    },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => `${ctx.dataset.label}: ${fmt(ctx.parsed.y)}`
                        }
                    }
                },
                scales: {
                    x: {
                        title: { display: true, text: 'Hour (UTC)', font: { size: 11 } },
                        ticks: { font: { size: 10 } }
                    },
                    y: {
                        title: { display: true, text: 'Tokens / min', font: { size: 11 } },
                        ticks: {
                            font: { size: 10 },
                            callback: (v) => (v / 1000) + 'k'
                        },
                        beginAtZero: true
                    }
                }
            }
        });
    }

    function baselineEnvelope() {
        // Synthetic mean ± 2σ from the non-spike points
        const points = series.data.map((v, i) => ({ v, i })).filter(p => p.i < 13 || p.i > 15);
        const mean = points.reduce((a, p) => a + p.v, 0) / points.length;
        const variance = points.reduce((a, p) => a + (p.v - mean) ** 2, 0) / points.length;
        const sigma = Math.sqrt(variance);
        const upper = new Array(series.labels.length).fill(mean + 2 * sigma);
        const lower = new Array(series.labels.length).fill(Math.max(0, mean - 2 * sigma));
        return { upper, lower, mean, sigma };
    }

    function handleTimelineClick(evt) {
        const pts = timelineChart.getElementsAtEventForMode(evt, 'nearest', { intersect: false }, true);
        if (pts.length === 0) return;
        const idx = pts[0].index;
        if (idx >= 12 && idx <= 15) {
            openDrilldown(idx);
        } else {
            closeDrilldown('Click a point inside the spike (hours 13–15) to drill down. The window you clicked is within the baseline envelope.');
        }
    }

    function openDrilldown(idx) {
        drillOpen = true;
        renderDrilldown();
        const status = document.getElementById('status');
        status.className = 'status fired';
        status.textContent = `Drill-down for hour ${series.labels[idx]} — feature exec_summary contributed 85% of the spike, within which user usr_72ad accounted for 78%, and a single prompt_hash 9af2c7b8 explains 92% of that user's traffic.`;
    }

    function closeDrilldown(message) {
        drillOpen = false;
        clearDrilldown();
        const status = document.getElementById('status');
        status.className = 'status';
        status.textContent = message || 'Click a point on the spike (around hour 14) to drill down by feature, user, and prompt template.';
    }

    function clearDrilldown() {
        if (featureChart) { featureChart.destroy(); featureChart = null; }
        if (userChart) { userChart.destroy(); userChart = null; }
        if (hashChart) { hashChart.destroy(); hashChart = null; }
        const grid = document.getElementById('drilldownGrid');
        // Replace canvas elements with placeholders
        grid.innerHTML = `
            <div class="dd-panel empty">
                <div class="dd-label">By feature (% of spike volume)</div>
                <div class="empty-text">click the spike to populate</div>
            </div>
            <div class="dd-panel empty">
                <div class="dd-label">By user (top 5)</div>
                <div class="empty-text">click the spike to populate</div>
            </div>
            <div class="dd-panel empty">
                <div class="dd-label">By prompt_hash (top 5)</div>
                <div class="empty-text">click the spike to populate</div>
            </div>
        `;
    }

    function renderDrilldown() {
        const grid = document.getElementById('drilldownGrid');
        grid.innerHTML = `
            <div class="dd-panel">
                <div class="dd-label">By feature (% of spike volume)</div>
                <canvas id="byFeature"></canvas>
            </div>
            <div class="dd-panel">
                <div class="dd-label">By user (top 5)</div>
                <canvas id="byUser"></canvas>
            </div>
            <div class="dd-panel">
                <div class="dd-label">By prompt_hash (top 5)</div>
                <canvas id="byHash"></canvas>
            </div>
        `;
        featureChart = makeBarChart('byFeature', drilldownByFeature, '#c62828');
        userChart    = makeBarChart('byUser',    drilldownByUser,    '#c2410c');
        hashChart    = makeBarChart('byHash',    drilldownByHash,    '#a16207');
    }

    function makeBarChart(canvasId, dataset, color) {
        const ctx = document.getElementById(canvasId).getContext('2d');
        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: dataset.labels,
                datasets: [{
                    data: dataset.values,
                    backgroundColor: dataset.values.map((v, i) => i === 0 ? color : '#cbd5e1'),
                    borderColor: dataset.values.map((v, i) => i === 0 ? color : '#94a3b8'),
                    borderWidth: 1
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => `${ctx.parsed.x}%`
                        }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        max: 100,
                        ticks: { font: { size: 10 }, callback: (v) => v + '%' }
                    },
                    y: {
                        ticks: { font: { size: 10 } }
                    }
                }
            }
        });
    }

    function getThreshold() {
        return parseInt(document.getElementById('threshold').value, 10);
    }

    function updateThreshold() {
        const t = getThreshold();
        document.getElementById('thresholdVal').textContent = fmt(t);
        if (!timelineChart) return;
        timelineChart.data.datasets[3].data = new Array(series.labels.length).fill(t);
        timelineChart.update('none');
        // Update banner if we are not currently drilled down
        if (!drillOpen) {
            const fired = series.data.filter(v => v > t).length;
            const status = document.getElementById('status');
            if (fired > 0) {
                status.className = 'status fired';
                status.textContent = `${fired} hour(s) would fire at this threshold. Click a point on the spike (around hour 14) to drill down.`;
            } else {
                status.className = 'status success';
                status.textContent = `No hours would fire at this threshold. Lower it below the spike to see the drill-down.`;
            }
        }
    }

    function updateBaseline() {
        const show = document.getElementById('baselineToggle').checked;
        if (!timelineChart) return;
        // Toggle by hiding the envelope datasets
        timelineChart.data.datasets[0].backgroundColor = show ? 'rgba(2, 119, 189, 0.08)' : 'rgba(0,0,0,0)';
        timelineChart.update('none');
    }

    function init() {
        buildTimeline();
        clearDrilldown();
        updateThreshold();
        document.getElementById('threshold').addEventListener('input', updateThreshold);
        document.getElementById('baselineToggle').addEventListener('change', updateBaseline);
        document.getElementById('resetBtn').addEventListener('click', () => closeDrilldown());
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

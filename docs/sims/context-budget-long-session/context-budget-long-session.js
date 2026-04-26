// Context Window Budget Allocation Over a Long Session - Chart.js
// CANVAS_HEIGHT: 560
// Bloom Level: Apply (L3) - implement
// Learning objective: Implement a context window budget that maintains
// affordable per-turn cost across a session that exceeds 100 turns.

(function () {
    'use strict';

    const TURNS = 200;
    const SYSTEM_TOKENS = 10000;
    const OUTPUT_RESERVE = 4000;
    const TURN_AVG = 1200;            // avg conversation-history tokens per new turn
    const TURN_VAR = 600;             // jitter
    const RAG_AVG = 5000;             // avg RAG context tokens per turn
    const RAG_VAR = 3500;
    const LTM_BUDGET = 8000;          // typical retrieved long-term memory tokens

    const state = {
        threshold: 80000,
        aggressiveness: 0.50,
        useLTM: true,
        slidingOnly: false,
    };

    let chart = null;

    // Deterministic pseudo-random per-turn jitter
    function rng(seed) {
        let s = seed * 9301 + 49297;
        s = (s % 233280) / 233280;
        return s;
    }

    function simulate() {
        const sys = new Array(TURNS).fill(SYSTEM_TOKENS);
        const out = new Array(TURNS).fill(OUTPUT_RESERVE);
        const ltm = new Array(TURNS).fill(0);
        const rag = new Array(TURNS).fill(0);
        const conv = new Array(TURNS).fill(0);
        const compactionEvents = [];
        let detailLoss = 0;
        let ltmAccumulated = 0;

        let convTokens = 0;
        let ltmIncluded = state.useLTM ? Math.round(LTM_BUDGET * 0.4) : 0;

        for (let t = 0; t < TURNS; t++) {
            const turnAdd = TURN_AVG + Math.round((rng(t + 1) - 0.5) * TURN_VAR * 2);
            convTokens += turnAdd;

            const ragNow = state.useLTM
                ? Math.max(1500, RAG_AVG + Math.round((rng(t + 17) - 0.5) * RAG_VAR * 2))
                : Math.max(2500, RAG_AVG + 1500 + Math.round((rng(t + 17) - 0.5) * RAG_VAR * 2));

            // Total before compaction check
            let total = SYSTEM_TOKENS + ltmIncluded + convTokens + ragNow + OUTPUT_RESERVE;

            if (total > state.threshold) {
                if (state.slidingOnly) {
                    // Sliding-window: drop tokens to fit, NOT distilled
                    const overflow = total - state.threshold * 0.85;
                    convTokens = Math.max(2000, convTokens - overflow);
                    detailLoss += overflow; // raw tokens dropped
                    compactionEvents.push({ turn: t, type: 'drop' });
                } else {
                    // Compaction: condense oldest portion of conv into a summary
                    const condensed = Math.round(convTokens * state.aggressiveness);
                    const summary = Math.round(condensed * 0.10); // 10:1 compression
                    convTokens = convTokens - condensed + summary;
                    if (state.useLTM) {
                        // A fraction of the condensed content becomes durable LTM
                        ltmAccumulated += Math.round(summary * 0.6);
                        ltmIncluded = Math.min(LTM_BUDGET, ltmAccumulated + Math.round(LTM_BUDGET * 0.4));
                        detailLoss += condensed - summary - Math.round(summary * 0.6);
                    } else {
                        detailLoss += condensed - summary;
                    }
                    compactionEvents.push({ turn: t, type: 'compact' });
                }
            }

            sys[t] = SYSTEM_TOKENS;
            out[t] = OUTPUT_RESERVE;
            ltm[t] = state.useLTM && !state.slidingOnly ? ltmIncluded : 0;
            rag[t] = ragNow;
            conv[t] = convTokens;
        }

        return { sys, ltm, conv, rag, out, compactionEvents, detailLoss };
    }

    function buildChart() {
        const ctx = document.getElementById('stackChart').getContext('2d');
        const labels = [];
        for (let i = 1; i <= TURNS; i++) labels.push(i);

        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [
                    { label: 'System + tools', data: [], backgroundColor: 'rgba(55,71,79,0.85)', borderColor: '#37474f', fill: true, borderWidth: 0, pointRadius: 0, tension: 0 },
                    { label: 'Long-term memory', data: [], backgroundColor: 'rgba(124,58,237,0.85)', borderColor: '#7c3aed', fill: true, borderWidth: 0, pointRadius: 0, tension: 0 },
                    { label: 'Conversation history', data: [], backgroundColor: 'rgba(193,68,14,0.85)', borderColor: '#c1440e', fill: true, borderWidth: 0, pointRadius: 0, tension: 0 },
                    { label: 'RAG context', data: [], backgroundColor: 'rgba(2,119,189,0.85)', borderColor: '#0277bd', fill: true, borderWidth: 0, pointRadius: 0, tension: 0 },
                    { label: 'Output reservation', data: [], backgroundColor: 'rgba(46,125,50,0.85)', borderColor: '#2e7d32', fill: true, borderWidth: 0, pointRadius: 0, tension: 0 }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 250 },
                interaction: { mode: 'index', intersect: false },
                plugins: {
                    legend: { position: 'bottom', labels: { font: { size: 11 }, boxWidth: 12 } },
                    tooltip: {
                        callbacks: {
                            title: (items) => 'Turn ' + items[0].label,
                            label: (item) => item.dataset.label + ': ' + Math.round(item.raw).toLocaleString()
                        }
                    }
                },
                scales: {
                    x: {
                        title: { display: true, text: 'Turn', font: { size: 11 } },
                        ticks: {
                            font: { size: 10 },
                            maxTicksLimit: 11,
                            callback: function(val) {
                                const v = +this.getLabelForValue(val);
                                return v % 20 === 0 || v === 1 ? v : '';
                            }
                        }
                    },
                    y: {
                        stacked: true,
                        beginAtZero: true,
                        title: { display: true, text: 'Tokens in context', font: { size: 11 } },
                        ticks: {
                            font: { size: 10 },
                            callback: (v) => (v / 1000).toFixed(0) + 'K'
                        }
                    }
                }
            },
            plugins: [{
                id: 'thresholdLine',
                afterDatasetsDraw(c) {
                    const yScale = c.scales.y;
                    const xScale = c.scales.x;
                    const y = yScale.getPixelForValue(state.threshold);
                    const cctx = c.ctx;
                    cctx.save();
                    cctx.strokeStyle = '#dc2626';
                    cctx.setLineDash([5, 4]);
                    cctx.lineWidth = 1.5;
                    cctx.beginPath();
                    cctx.moveTo(xScale.left, y);
                    cctx.lineTo(xScale.right, y);
                    cctx.stroke();
                    cctx.fillStyle = '#dc2626';
                    cctx.font = '11px Arial';
                    cctx.fillText('Compaction threshold ' + (state.threshold / 1000) + 'K', xScale.left + 6, y - 4);
                    cctx.restore();
                }
            }]
        });
    }

    function refresh() {
        const sim = simulate();
        chart.data.datasets[0].data = sim.sys;
        chart.data.datasets[1].data = sim.ltm;
        chart.data.datasets[2].data = sim.conv;
        chart.data.datasets[3].data = sim.rag;
        chart.data.datasets[4].data = sim.out;
        chart.update('none');

        // Readouts
        const totals = sim.sys.map((_, i) => sim.sys[i] + sim.ltm[i] + sim.conv[i] + sim.rag[i] + sim.out[i]);
        const peak = Math.max(...totals);
        const avg = Math.round(totals.reduce((a, b) => a + b, 0) / totals.length);
        document.getElementById('rCompactions').textContent = sim.compactionEvents.length;
        document.getElementById('rPeak').textContent = peak.toLocaleString() + ' tk';
        document.getElementById('rAvg').textContent = avg.toLocaleString() + ' tk';
        // detail loss rough %: tokens lost vs total tokens generated
        const generated = TURNS * TURN_AVG + TURNS * RAG_AVG;
        document.getElementById('rLoss').textContent = Math.min(99, Math.round(100 * sim.detailLoss / generated)) + '%';
    }

    function wire() {
        const ts = document.getElementById('threshSlider');
        const ag = document.getElementById('aggSlider');
        const ltm = document.getElementById('useLTM');
        const sw = document.getElementById('slidingOnly');

        ts.addEventListener('input', () => {
            state.threshold = +ts.value;
            document.getElementById('threshVal').textContent = (ts.value / 1000).toFixed(0);
            refresh();
        });
        ag.addEventListener('input', () => {
            state.aggressiveness = (+ag.value) / 100;
            document.getElementById('aggVal').textContent = ag.value;
            refresh();
        });
        ltm.addEventListener('change', () => {
            state.useLTM = ltm.checked;
            if (ltm.checked) sw.checked = false, state.slidingOnly = false;
            refresh();
        });
        sw.addEventListener('change', () => {
            state.slidingOnly = sw.checked;
            if (sw.checked) ltm.checked = false, state.useLTM = false;
            refresh();
        });
    }

    function init() {
        buildChart();
        wire();
        refresh();
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

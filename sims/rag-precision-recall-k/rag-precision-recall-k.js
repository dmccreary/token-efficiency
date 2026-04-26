// Precision/Recall Tradeoff for K Selection - Chart.js
// CANVAS_HEIGHT: 540
// Bloom Level: Evaluate (L5) - justify
// Learning objective: Justify a choice of K based on precision, recall,
// and per-query cost.

(function () {
    'use strict';

    // ---- State ----
    const state = {
        useReranker: true,
        rerankerN: 5,
        chunkSize: 500,    // tokens per chunk
        kSelected: 20,
    };

    // Pricing baseline: $1.50 per 1M input tokens (representative of Sonnet-class)
    const PRICE_PER_M = 1.50;

    // ---- Models for precision and recall as functions of K ----
    // Without reranker:
    //   precision(K) ~ a / (a + (K - 1) * b)
    //   recall(K)    ~ 1 - exp(-K / tau)
    // With reranker, post-rerank to N caps precision degradation; recall caps at the
    // rerank ceiling because we only ever serve N items.
    function precisionAt(k) {
        // Base precision starts ~ 0.92 at K=1 and falls as more chunks come in
        const base = 0.92 / (1 + (k - 1) * 0.08);
        if (state.useReranker) {
            // Reranker preserves precision up to N; beyond N reranker still picks
            // top-N from the K candidates, so precision stays strong but
            // increasing K beyond N gives diminishing returns.
            const n = state.rerankerN;
            // For K <= N, we serve all K (no rerank), so precision falls fast.
            // For K > N, reranker keeps top-N => precision stays roughly at the
            // average precision of the top-N within the K pool.
            if (k <= n) return base;
            // top-N average precision: blend of top-N precisions from a K pool.
            // Empirical-ish: precision(N) plus a slow decay because the reranker
            // is imperfect.
            const pAtN = 0.92 / (1 + (n - 1) * 0.08);
            const decay = 0.92 / (1 + (k - 1) * 0.02); // slower decay
            // Reranker quality factor (higher N = more candidates = better rerank)
            return Math.min(0.98, 0.6 * pAtN + 0.4 * decay);
        }
        return base;
    }

    function recallAt(k) {
        const tau = 12; // recall saturation parameter
        let r = 1 - Math.exp(-k / tau);
        if (state.useReranker) {
            // Reranker only outputs top-N, so served-recall is bounded by what
            // the reranker keeps. Approximate served-recall = recall(K) * (N/K)^0.3
            const n = state.rerankerN;
            if (k > n) r = r * Math.pow(n / k, 0.15);
        }
        return Math.max(0, Math.min(1, r));
    }

    function costAt(k) {
        // Per-query input cost = K * chunkSize * pricePerToken
        // pricePerToken = PRICE_PER_M / 1_000_000
        return k * state.chunkSize * (PRICE_PER_M / 1_000_000);
    }

    // ---- Compute the "recommended K band": smallest K where
    //      recall >= 0.85 AND cost <= $0.005 ----
    function computeRecommendedBand() {
        let lo = -1, hi = -1;
        for (let k = 1; k <= 50; k++) {
            const r = recallAt(k);
            const c = costAt(k);
            if (r >= 0.85 && c <= 0.005) {
                if (lo < 0) lo = k;
                hi = k;
            }
        }
        return { lo, hi };
    }

    // ---- Build chart ----
    let chart = null;
    function buildChart() {
        const ctx = document.getElementById('prCurve').getContext('2d');
        const Ks = [];
        for (let k = 1; k <= 50; k++) Ks.push(k);

        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: Ks,
                datasets: [
                    {
                        label: 'Precision',
                        data: Ks.map(precisionAt),
                        borderColor: '#0277bd',
                        backgroundColor: 'rgba(2,119,189,0.0)',
                        borderWidth: 2.5,
                        pointRadius: 0,
                        tension: 0.2,
                        yAxisID: 'y',
                    },
                    {
                        label: 'Recall',
                        data: Ks.map(recallAt),
                        borderColor: '#2e7d32',
                        backgroundColor: 'rgba(46,125,50,0.0)',
                        borderWidth: 2.5,
                        pointRadius: 0,
                        tension: 0.2,
                        yAxisID: 'y',
                    },
                    {
                        label: 'Cost / query ($)',
                        data: Ks.map(costAt),
                        borderColor: '#c1440e',
                        backgroundColor: 'rgba(193,68,14,0.0)',
                        borderWidth: 2.5,
                        pointRadius: 0,
                        tension: 0.0,
                        yAxisID: 'y1',
                    },
                    {
                        // Selected-K marker (vertical-ish)
                        label: 'Selected K',
                        data: Ks.map(k => k === state.kSelected ? 1 : null),
                        borderColor: '#7c3aed',
                        backgroundColor: '#7c3aed',
                        pointRadius: 4,
                        showLine: false,
                        yAxisID: 'y',
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 250 },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            title: (items) => 'K = ' + items[0].label,
                            label: (item) => {
                                const v = item.raw;
                                if (v == null) return null;
                                if (item.dataset.label === 'Cost / query ($)') {
                                    return 'Cost: $' + v.toFixed(4);
                                }
                                return item.dataset.label + ': ' + v.toFixed(3);
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        position: 'left', beginAtZero: true, max: 1,
                        title: { display: true, text: 'Precision / Recall', font: { size: 11 } },
                        grid: { color: '#f1f5f9' },
                        ticks: { font: { size: 10 } }
                    },
                    y1: {
                        position: 'right', beginAtZero: true,
                        title: { display: true, text: 'Cost per query ($)', font: { size: 11 } },
                        grid: { display: false },
                        ticks: {
                            font: { size: 10 },
                            callback: (v) => '$' + v.toFixed(3)
                        }
                    },
                    x: {
                        title: { display: true, text: 'K (top-K retrieved chunks)', font: { size: 11 } },
                        ticks: {
                            font: { size: 10 },
                            callback: function (val, idx) {
                                const v = this.getLabelForValue(val);
                                return (v % 5 === 0) ? v : '';
                            }
                        }
                    }
                }
            },
            plugins: [{
                id: 'recommendedBand',
                beforeDraw(c) {
                    const band = computeRecommendedBand();
                    if (band.lo < 0) return;
                    const xScale = c.scales.x;
                    const x1 = xScale.getPixelForValue(band.lo);
                    const x2 = xScale.getPixelForValue(band.hi);
                    const yT = c.chartArea.top, yB = c.chartArea.bottom;
                    const ctx = c.ctx;
                    ctx.save();
                    ctx.fillStyle = 'rgba(46,125,50,0.12)';
                    ctx.fillRect(x1, yT, x2 - x1, yB - yT);
                    ctx.strokeStyle = 'rgba(46,125,50,0.55)';
                    ctx.setLineDash([4, 3]);
                    ctx.strokeRect(x1, yT, x2 - x1, yB - yT);
                    ctx.setLineDash([]);
                    ctx.fillStyle = '#14532d';
                    ctx.font = '11px Arial';
                    ctx.fillText('Cost-acceptable zone', x1 + 4, yT + 14);
                    ctx.restore();
                }
            }]
        });
    }

    function refreshChart() {
        const Ks = [];
        for (let k = 1; k <= 50; k++) Ks.push(k);
        chart.data.datasets[0].data = Ks.map(precisionAt);
        chart.data.datasets[1].data = Ks.map(recallAt);
        chart.data.datasets[2].data = Ks.map(costAt);
        chart.data.datasets[3].data = Ks.map(k => k === state.kSelected ? 1 : null);
        chart.update('none');
        updateReadout();
    }

    function updateReadout() {
        const k = state.kSelected;
        const p = precisionAt(k);
        const r = recallAt(k);
        const c = costAt(k);
        const band = computeRecommendedBand();
        document.getElementById('recK').textContent = (band.lo > 0) ? `${band.lo}-${band.hi}` : 'none';
        document.getElementById('recP').textContent = p.toFixed(2);
        document.getElementById('recR').textContent = r.toFixed(2);
        document.getElementById('recC').textContent = '$' + c.toFixed(4);
        const v = document.getElementById('verdict');
        const inBand = (band.lo > 0 && k >= band.lo && k <= band.hi);
        const f1 = (2 * p * r) / Math.max(1e-6, p + r);
        if (inBand) {
            v.className = 'verdict good';
            v.innerHTML = `<b>Justified.</b> K=${k} sits inside the cost-acceptable zone with recall ${r.toFixed(2)} and cost $${c.toFixed(4)}. F1=${f1.toFixed(2)}.`;
        } else if (r < 0.85) {
            v.className = 'verdict warn';
            v.innerHTML = `<b>Recall too low.</b> At K=${k}, recall=${r.toFixed(2)} (< 0.85). Increase K or add a reranker.`;
        } else if (c > 0.005) {
            v.className = 'verdict bad';
            v.innerHTML = `<b>Cost too high.</b> At K=${k}, cost=$${c.toFixed(4)} (> $0.005). Reduce chunk size or K.`;
        } else {
            v.className = 'verdict';
            v.innerHTML = `K=${k}: precision ${p.toFixed(2)}, recall ${r.toFixed(2)}, cost $${c.toFixed(4)}.`;
        }
    }

    // ---- Wire controls ----
    function wire() {
        const useR = document.getElementById('useReranker');
        const nS = document.getElementById('nSlider');
        const cS = document.getElementById('chunkSlider');
        const kS = document.getElementById('kSlider');

        useR.addEventListener('change', () => {
            state.useReranker = useR.checked;
            refreshChart();
        });
        nS.addEventListener('input', () => {
            state.rerankerN = +nS.value;
            document.getElementById('nVal').textContent = nS.value;
            refreshChart();
        });
        cS.addEventListener('input', () => {
            state.chunkSize = +cS.value;
            document.getElementById('chunkVal').textContent = cS.value;
            refreshChart();
        });
        kS.addEventListener('input', () => {
            state.kSelected = +kS.value;
            document.getElementById('kVal').textContent = kS.value;
            refreshChart();
        });
    }

    function init() {
        buildChart();
        wire();
        updateReadout();
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

// Cross-Vendor Caching Comparison - Chart.js multi-line
// CANVAS_HEIGHT: 580
// Bloom Level: Analyze (L4) - compare
// Learning objective: Compare the caching cost models of three vendors and
// recommend a vendor for a workload based on prefix length, request volume, and cache lifetime.

(function () {
    'use strict';

    // ---- Pricing model assumptions ($ per 1K tokens — illustrative) ----
    // We treat each vendor's INPUT price as a similar baseline so the structure
    // of the savings (not absolute dollar values) is the comparison point.
    const PRICE = {
        anthropic: { input: 0.003, cacheWriteMul: 1.25, cacheReadMul: 0.10 },
        openai:    { input: 0.0025, cacheWriteMul: 1.00, cacheReadMul: 0.50 }, // OpenAI: cached reads ~50% off, no write premium
        gemini:    { input: 0.00125, implicitMul: 0.25, explicitMul: 0.25, storagePerMinPerKtok: 0.00001 } // explicit cache + per-hour storage
    };

    const N_REQUESTS = 50;

    let chart = null;

    function getInputs() {
        return {
            prefix: +document.getElementById('prefix').value,
            ttlMin: +document.getElementById('ttl').value,
            freqPerMin: +document.getElementById('freq').value,
            storageOn: document.getElementById('storage').checked
        };
    }

    function fmtNum(n) { return n.toLocaleString('en-US'); }
    function fmtUSD(n) { return '$' + n.toFixed(4); }

    // Compute cumulative cost arrays for each vendor
    function compute({prefix, ttlMin, freqPerMin, storageOn}) {
        // Time between requests in minutes:
        const dtMin = 1 / freqPerMin;
        // Number of cache invalidations (TTL expirations) up to request i can be modeled as:
        // cache invalidates whenever (i-1)*dt >= ttl since last write
        // For simplicity, we treat: writes happen at request 1, then again every floor(ttl/dt) reqs.
        const reqsPerWrite = Math.max(1, Math.floor(ttlMin / dtMin));

        // No-cache baseline: every request pays full input price for the prefix.
        const noCacheCum = [];
        // Anthropic: 1.25x prefix on first req of every cache window, 0.10x on subsequent
        const anthCum = [];
        // OpenAI: 1.0x prefix on first of window, 0.50x cached read after
        const oaCum = [];
        // Gemini implicit: model auto-caches when it detects the prefix; ~0.25x on hits.
        // We model implicit as having a "warm-up" of ~3 requests before caching kicks in.
        const gemImplCum = [];
        // Gemini explicit: large drop after request 1 (cache created, 0.25x reads), plus storage cost.
        const gemExplCum = [];

        const Pa = PRICE.anthropic;
        const Po = PRICE.openai;
        const Pg = PRICE.gemini;

        let cumNo = 0, cumA = 0, cumO = 0, cumGI = 0, cumGE = 0;
        const inK = prefix / 1000;

        for (let i = 1; i <= N_REQUESTS; i++) {
            const inWindow = (i - 1) % reqsPerWrite; // 0 means a fresh write
            // No cache
            cumNo += Pa.input * inK;
            // Anthropic
            if (inWindow === 0) cumA += Pa.input * Pa.cacheWriteMul * inK;
            else                cumA += Pa.input * Pa.cacheReadMul  * inK;
            // OpenAI: write = full price (no premium); read = discounted
            if (inWindow === 0) cumO += Po.input * Po.cacheWriteMul * inK;
            else                cumO += Po.input * Po.cacheReadMul  * inK;
            // Gemini implicit: warm-up of 3 requests, then 0.25x
            if (i <= 3) cumGI += Pg.input * inK;
            else        cumGI += Pg.input * Pg.implicitMul * inK;
            // Gemini explicit: req 1 = full + create; req 2..N = 0.25x
            if (i === 1) cumGE += Pg.input * inK + Pg.input * inK * 0.05; // small create overhead
            else         cumGE += Pg.input * Pg.explicitMul * inK;

            // Storage cost on Gemini explicit accumulates with elapsed time
            if (storageOn) {
                const elapsedMin = (i - 1) * dtMin;
                const incrementalMin = dtMin;
                cumGE += Pg.storagePerMinPerKtok * inK * incrementalMin;
            }

            noCacheCum.push(cumNo);
            anthCum.push(cumA);
            oaCum.push(cumO);
            gemImplCum.push(cumGI);
            gemExplCum.push(cumGE);
        }

        return { noCacheCum, anthCum, oaCum, gemImplCum, gemExplCum };
    }

    function buildChart() {
        const ctx = document.getElementById('costChart').getContext('2d');
        const labels = Array.from({length: N_REQUESTS}, (_, i) => 'R' + (i + 1));
        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [
                    { label: 'No caching baseline', data: [], borderColor: '#94a3b8', backgroundColor: 'transparent', borderDash: [6,4], pointRadius: 0, borderWidth: 2 },
                    { label: 'Anthropic',            data: [], borderColor: '#c1440e', backgroundColor: 'transparent', pointRadius: 0, borderWidth: 2.5 },
                    { label: 'OpenAI',               data: [], borderColor: '#0277bd', backgroundColor: 'transparent', pointRadius: 0, borderWidth: 2.5 },
                    { label: 'Gemini (implicit)',    data: [], borderColor: '#2e7d32', backgroundColor: 'transparent', pointRadius: 0, borderWidth: 2.5 },
                    { label: 'Gemini (explicit + storage)', data: [], borderColor: '#7c3aed', backgroundColor: 'transparent', pointRadius: 0, borderWidth: 2.5 }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 200 },
                plugins: {
                    legend: { position: 'bottom', labels: { font: { size: 11 }, boxWidth: 18 } },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => `${ctx.dataset.label}: $${ctx.parsed.y.toFixed(4)}`
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: 'Cumulative cost (USD)', font: { size: 11 } },
                        ticks: { font: { size: 10 }, callback: (v) => '$' + v.toFixed(3) }
                    },
                    x: {
                        title: { display: true, text: 'Request number', font: { size: 11 } },
                        ticks: { font: { size: 10 }, maxRotation: 0, autoSkipPadding: 12 }
                    }
                }
            }
        });
    }

    function update() {
        const inputs = getInputs();
        document.getElementById('prefixVal').textContent = fmtNum(inputs.prefix);
        document.getElementById('ttlVal').textContent    = fmtNum(inputs.ttlMin);
        document.getElementById('freqVal').textContent   = inputs.freqPerMin.toFixed(1);

        const r = compute(inputs);
        chart.data.datasets[0].data = r.noCacheCum;
        chart.data.datasets[1].data = r.anthCum;
        chart.data.datasets[2].data = r.oaCum;
        chart.data.datasets[3].data = r.gemImplCum;
        chart.data.datasets[4].data = r.gemExplCum;
        chart.update('none');

        // Summary table
        const final = i => i[i.length - 1];
        const baseline = final(r.noCacheCum);
        const tbody = document.querySelector('#summaryTable tbody');
        tbody.innerHTML = '';
        const rows = [
            { name: 'No caching',                  val: baseline },
            { name: 'Anthropic',                   val: final(r.anthCum) },
            { name: 'OpenAI',                      val: final(r.oaCum) },
            { name: 'Gemini (implicit)',           val: final(r.gemImplCum) },
            { name: 'Gemini (explicit + storage)', val: final(r.gemExplCum) }
        ];
        rows.forEach(row => {
            const sav = baseline > 0 ? (1 - row.val / baseline) * 100 : 0;
            const cls = sav >= 0 ? 'savings-pos' : 'savings-neg';
            const text = row.name === 'No caching' ? '—' : `${sav.toFixed(1)}%`;
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${row.name}</td><td>${fmtUSD(row.val)}</td><td class="${cls}">${text}</td>`;
            tbody.appendChild(tr);
        });
    }

    function wire() {
        ['prefix','ttl','freq'].forEach(id => {
            document.getElementById(id).addEventListener('input', update);
        });
        document.getElementById('storage').addEventListener('change', update);
    }

    function init() {
        buildChart();
        wire();
        update();
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

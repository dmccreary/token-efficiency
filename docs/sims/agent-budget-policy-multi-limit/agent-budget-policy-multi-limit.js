// Agent Budget Policy with Multiple Limits - Chart.js dashboard
// CANVAS_HEIGHT: 600
// Bloom Level: Apply (L3) - implement
// Learning objective: Implement a multi-cap budget policy and identify
// which cap fires first under different failure modes.

(function () {
    'use strict';

    // ---- Per-iteration consumption profiles for each scenario ----
    // Each iteration adds: tokens, toolCalls, seconds. Iteration count is implicit.
    const SCENARIOS = {
        healthy: {
            label: 'Healthy session',
            description: 'A typical successful session: steady tokens, a few tool calls per step, finishes in time.',
            perIter: () => ({ tokens: rand(2200, 3000), calls: rand(1, 2), sec: rand(5, 8) }),
            maxIters: 11,
            naturalFinish: true
        },
        tokens: {
            label: 'Token runaway',
            description: 'Each iteration grows the context aggressively (long tool outputs, no summarization). Tokens fire first.',
            perIter: (i) => ({ tokens: 4000 + i * 1800, calls: rand(1, 2), sec: rand(6, 10) }),
            maxIters: 30,
            naturalFinish: false
        },
        calls: {
            label: 'Tool-call explosion',
            description: 'A flaky tool keeps the agent in a "search again, search again" pattern. Tool-call cap fires first.',
            perIter: () => ({ tokens: rand(1500, 2200), calls: rand(4, 7), sec: rand(4, 7) }),
            maxIters: 30,
            naturalFinish: false
        },
        loop: {
            label: 'Stuck loop',
            description: 'The agent circles between two thoughts, making slow progress on tokens but burning iterations and wall clock.',
            perIter: () => ({ tokens: rand(1000, 1600), calls: rand(0, 1), sec: rand(8, 14) }),
            maxIters: 50,
            naturalFinish: false
        }
    };

    // ---- State ----
    const state = {
        running: false,
        timer: null,
        iter: 0,
        cumulative: { tokens: 0, calls: 0, iters: 0, sec: 0 },
        history: [], // [{tokens, calls, sec}]
        scenario: 'healthy',
        graceful: false,
        caps: { tokens: 50000, calls: 25, iters: 15, sec: 120 }
    };

    // ---- Chart references ----
    let meterCharts = {};
    let timelineChart = null;

    function rand(a, b) { return Math.floor(a + Math.random() * (b - a + 1)); }

    function fmt(n) {
        if (!isFinite(n)) return '∞';
        return Math.round(n).toLocaleString('en-US');
    }

    // ---- Build a single horizontal "fuel gauge" ----
    function makeMeter(canvasId, capLabel) {
        const ctx = document.getElementById(canvasId).getContext('2d');
        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [''],
                datasets: [{
                    data: [0],
                    backgroundColor: '#0277bd',
                    borderColor: '#01579b',
                    borderWidth: 1,
                    borderSkipped: false,
                    barThickness: 16
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 250 },
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            font: { size: 9 },
                            callback: (v) => v + '%',
                            color: '#94a3b8'
                        },
                        grid: { color: '#f1f5f9' }
                    },
                    y: {
                        ticks: { display: false },
                        grid: { display: false }
                    }
                }
            }
        });
    }

    function buildMeters() {
        meterCharts.tokens = makeMeter('meterTokens');
        meterCharts.calls  = makeMeter('meterCalls');
        meterCharts.iters  = makeMeter('meterIters');
        meterCharts.clock  = makeMeter('meterClock');
    }

    // ---- Build the per-iteration timeline chart ----
    function buildTimeline() {
        const ctx = document.getElementById('timeline').getContext('2d');
        timelineChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [
                    { label: 'Tokens (k)', data: [], backgroundColor: '#0277bd' },
                    { label: 'Tool calls', data: [], backgroundColor: '#c2410c', yAxisID: 'y1' },
                    { label: 'Seconds',    data: [], backgroundColor: '#7c3aed', yAxisID: 'y1' }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 200 },
                plugins: {
                    legend: { position: 'bottom', labels: { font: { size: 11 }, boxWidth: 12 } },
                    tooltip: { enabled: true }
                },
                scales: {
                    y:  { beginAtZero: true, position: 'left',  title: { display: true, text: 'Tokens (k)', font: { size: 10 } }, ticks: { font: { size: 9 } } },
                    y1: { beginAtZero: true, position: 'right', grid: { display: false }, title: { display: true, text: 'Calls / Sec', font: { size: 10 } }, ticks: { font: { size: 9 } } },
                    x:  { ticks: { font: { size: 10 } }, title: { display: true, text: 'Iteration', font: { size: 10 } } }
                }
            }
        });
    }

    // ---- Update meters from current state ----
    function updateMeters() {
        const c = state.caps;
        const u = state.cumulative;
        const pct = {
            tokens: Math.min(100, (u.tokens / c.tokens) * 100),
            calls:  Math.min(100, (u.calls  / c.calls)  * 100),
            iters:  Math.min(100, (u.iters  / c.iters)  * 100),
            clock:  Math.min(100, (u.sec    / c.sec)    * 100)
        };
        const colorOf = (p) => p >= 100 ? '#c62828' : (p >= 75 ? '#f59e0b' : '#0277bd');
        meterCharts.tokens.data.datasets[0].data = [pct.tokens];
        meterCharts.tokens.data.datasets[0].backgroundColor = colorOf(pct.tokens);
        meterCharts.calls.data.datasets[0].data  = [pct.calls];
        meterCharts.calls.data.datasets[0].backgroundColor  = colorOf(pct.calls);
        meterCharts.iters.data.datasets[0].data  = [pct.iters];
        meterCharts.iters.data.datasets[0].backgroundColor  = colorOf(pct.iters);
        meterCharts.clock.data.datasets[0].data  = [pct.clock];
        meterCharts.clock.data.datasets[0].backgroundColor  = colorOf(pct.clock);
        Object.values(meterCharts).forEach(ch => ch.update('none'));

        document.getElementById('readoutTokens').textContent = `${fmt(u.tokens)} / ${fmt(c.tokens)}`;
        document.getElementById('readoutCalls').textContent  = `${u.calls} / ${c.calls}`;
        document.getElementById('readoutIters').textContent  = `${u.iters} / ${c.iters}`;
        document.getElementById('readoutClock').textContent  = `${u.sec} / ${c.sec}`;
    }

    function updateTimeline() {
        timelineChart.data.labels = state.history.map((_, i) => i + 1);
        timelineChart.data.datasets[0].data = state.history.map(h => +(h.tokens / 1000).toFixed(1));
        timelineChart.data.datasets[1].data = state.history.map(h => h.calls);
        timelineChart.data.datasets[2].data = state.history.map(h => h.sec);
        timelineChart.update('none');
    }

    // ---- Determine which cap (if any) is exceeded; return key or null ----
    function firedCap() {
        const c = state.caps, u = state.cumulative;
        if (u.tokens >= c.tokens) return 'tokens';
        if (u.calls  >= c.calls)  return 'calls';
        if (u.iters  >= c.iters)  return 'iters';
        if (u.sec    >= c.sec)    return 'clock';
        return null;
    }

    // ---- Detect "any cap >= 75%" for graceful degradation ----
    function anyOver(threshold) {
        const c = state.caps, u = state.cumulative;
        return (u.tokens / c.tokens >= threshold) ||
               (u.calls  / c.calls  >= threshold) ||
               (u.iters  / c.iters  >= threshold) ||
               (u.sec    / c.sec    >= threshold);
    }

    function setStatus(msg, cls) {
        const el = document.getElementById('status');
        el.className = 'status' + (cls ? ' ' + cls : '');
        el.textContent = msg;
    }

    function resetSession() {
        if (state.timer) { clearInterval(state.timer); state.timer = null; }
        state.running = false;
        state.iter = 0;
        state.cumulative = { tokens: 0, calls: 0, iters: 0, sec: 0 };
        state.history = [];
        updateMeters();
        updateTimeline();
        setStatus('Choose a scenario, set caps, and click Run session.', '');
        document.getElementById('runBtn').disabled = false;
    }

    function runSession() {
        if (state.running) return;
        state.running = true;
        document.getElementById('runBtn').disabled = true;

        const scen = SCENARIOS[state.scenario];
        const tickMs = 280;

        state.timer = setInterval(() => {
            // Compute next iteration's consumption
            let step = scen.perIter(state.iter);
            // Graceful degradation: if any cap is >= 75%, slow consumption
            const slowing = state.graceful && anyOver(0.75);
            if (slowing) {
                step = {
                    tokens: Math.round(step.tokens * 0.5),
                    calls:  Math.max(0, step.calls - 1),
                    sec:    Math.max(2, Math.round(step.sec * 0.6))
                };
            }
            state.iter += 1;
            state.cumulative.tokens += step.tokens;
            state.cumulative.calls  += step.calls;
            state.cumulative.iters  += 1;
            state.cumulative.sec    += step.sec;
            state.history.push(step);
            updateMeters();
            updateTimeline();

            // Check fired
            const fired = firedCap();
            if (fired) {
                clearInterval(state.timer);
                state.timer = null;
                state.running = false;
                announceFired(fired);
                document.getElementById('runBtn').disabled = false;
                return;
            }

            // Natural finish for healthy scenario
            if (scen.naturalFinish && state.iter >= scen.maxIters) {
                clearInterval(state.timer);
                state.timer = null;
                state.running = false;
                setStatus('Session finished naturally without firing any cap. ' +
                          `Final: ${fmt(state.cumulative.tokens)} tokens, ` +
                          `${state.cumulative.calls} calls, ` +
                          `${state.cumulative.iters} iters, ` +
                          `${state.cumulative.sec}s.`, 'success');
                document.getElementById('runBtn').disabled = false;
                return;
            }

            // Mid-run hint
            if (slowing) {
                setStatus(`Graceful degradation engaged at >=75% of a cap. ` +
                          `Reducing per-iteration consumption.`, 'degrading');
            } else {
                setStatus(`Running ${SCENARIOS[state.scenario].label}... iteration ${state.iter}.`, '');
            }
        }, tickMs);
    }

    function announceFired(key) {
        const labels = {
            tokens: 'TOKEN cap fired',
            calls:  'TOOL-CALL cap fired',
            iters:  'ITERATION cap fired',
            clock:  'WALL-CLOCK cap fired'
        };
        const cls = 'fired-' + (key === 'clock' ? 'clock' : key);
        setStatus(`${labels[key]} at iteration ${state.iter}. ` +
                  `Stopping the agent loop. Scenario: ${SCENARIOS[state.scenario].label}.`,
                  cls);
    }

    // ---- Wire up controls ----
    function wireControls() {
        const scenarioSel = document.getElementById('scenario');
        const gracefulCk  = document.getElementById('graceful');
        const runBtn      = document.getElementById('runBtn');
        const resetBtn    = document.getElementById('resetBtn');

        scenarioSel.addEventListener('change', () => {
            state.scenario = scenarioSel.value;
            resetSession();
            setStatus(SCENARIOS[state.scenario].description, '');
        });
        gracefulCk.addEventListener('change', () => {
            state.graceful = gracefulCk.checked;
        });
        runBtn.addEventListener('click', runSession);
        resetBtn.addEventListener('click', resetSession);

        // Cap sliders + value displays
        const wireCap = (id, key, fmtFn) => {
            const slider = document.getElementById(id);
            const out    = document.getElementById(id + 'Val');
            const update = () => {
                state.caps[key] = +slider.value;
                out.textContent = fmtFn ? fmtFn(slider.value) : slider.value;
                updateMeters();
            };
            slider.addEventListener('input', update);
            update();
        };
        wireCap('capTokens', 'tokens', v => fmt(v));
        wireCap('capCalls',  'calls');
        wireCap('capIters',  'iters');
        wireCap('capClock',  'sec');

        // Initial status text matches default scenario
        setStatus(SCENARIOS[state.scenario].description, '');
    }

    // ---- Bootstrap ----
    function init() {
        buildMeters();
        buildTimeline();
        wireControls();
        updateMeters();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

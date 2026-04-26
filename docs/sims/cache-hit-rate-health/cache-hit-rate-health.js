// Cache Hit Rate Health - Chart.js small multiples
// CANVAS_HEIGHT: 600
// Bloom Level: Analyze (L4) - distinguish

(function () {
'use strict';
const DAYS = 30;
function gen(pattern) {
    const arr = [];
    for (let d = 1; d <= DAYS; d++) {
        let v = 0;
        if (pattern === 'healthy') {
            v = 88 + Math.sin(d) * 1.5 - (d % 7 === 0 ? 8 : 0); // small daily TTL dips
        } else if (pattern === 'drop') {
            v = d < 14 ? 88 + Math.sin(d) * 1.5 : 5;
        } else if (pattern === 'erosion') {
            v = 88 - (d / DAYS) * 48 + Math.sin(d) * 1.0;
        } else if (pattern === 'sawtooth') {
            v = (d % 2 === 0) ? 60 - Math.random() * 5 : 5 + Math.random() * 10;
        }
        arr.push(Math.max(0, Math.min(100, v)));
    }
    return arr;
}

const patterns = [
    { id: 'c1', readId: 'r1', data: gen('healthy'),  caption: 'Steady ~88% with small daily TTL dips', cause: 'Normal operation. Daily dips are TTL expirations on prefixes that didn\'t get a same-day reuse.', check: 'Nothing — this is healthy.' },
    { id: 'c2', readId: 'r2', data: gen('drop'),     caption: 'Cliff drop on day 14 from ~88% to ~5%', cause: 'A change to the cached prefix invalidated the cache on day 14. Most often: a new field added to the system prompt, a timestamp inserted, or a prompt-template rev.', check: 'git log on the prompt-template repo for changes around day 14. Roll back the offending change OR add the new field outside the cache boundary.' },
    { id: 'c3', readId: 'r3', data: gen('erosion'),  caption: 'Slow drift downward from 88% to 40%', cause: 'Cache key contains a slowly-drifting field — version number, build hash, or A/B-test bucket — that gradually invalidates more sessions.', check: 'Audit the cache key composition. Anything that changes between sessions but not within a session is a slow-drift hazard.' },
    { id: 'c4', readId: 'r4', data: gen('sawtooth'), caption: 'Daily oscillation between 0% and ~60%', cause: 'TTL is shorter than the natural request gap. Sessions arrive in bursts faster than once-per-TTL — first request writes, second-N read, then the TTL expires before the next burst.', check: 'Either lengthen the TTL (the 1-hour TTL costs more to write but pays off on bursty traffic) or pre-warm the cache before each burst.' }
];

function makeChart(canvasId, data) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({length: DAYS}, (_, i) => 'D' + (i+1)),
            datasets: [{ data, borderColor: '#0277bd', backgroundColor: 'rgba(2,119,189,0.1)', fill: true, borderWidth: 2, pointRadius: 0, tension: 0.2 }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: { enabled: true } },
            scales: {
                y: { beginAtZero: true, max: 100, ticks: { font: { size: 9 }, callback: v => v + '%' } },
                x: { ticks: { font: { size: 8 }, autoSkip: true, maxTicksLimit: 6 } }
            }
        }
    });
}

function init() {
    patterns.forEach(p => {
        makeChart(p.id, p.data);
        const avg = (p.data.reduce((a,b) => a+b, 0) / p.data.length).toFixed(0);
        document.getElementById(p.readId).textContent = `30-day mean: ${avg}%`;
        const canvas = document.getElementById(p.id);
        canvas.addEventListener('mouseenter', () => {
            document.getElementById('status').className = 'status';
            document.getElementById('status').innerHTML =
                `<b>${p.caption}.</b> Likely cause: ${p.cause} <i>What to check:</i> ${p.check}`;
        });
    });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
})();

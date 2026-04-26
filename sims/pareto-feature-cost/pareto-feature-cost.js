// Pareto Analysis of Per-Feature Cost — Chart.js dual-axis combo
// CANVAS_HEIGHT: 540
// Bloom Level: Analyze (L4) - identify
// Learning objective: Identify the vital-few features responsible for the
// majority of LLM cost using Pareto analysis on real-shaped data.

(function () {
    'use strict';

    // 25 features following a power-law cost distribution.
    // Top 3 ~ 60%, top 5 ~ 80%, bottom 15 ~ 5% combined.
    const FEATURES = [
        { name: 'exec_summary',     cost: 18400 },
        { name: 'agent_research',   cost: 14200 },
        { name: 'rag_qna',          cost: 9100  },
        { name: 'code_review',      cost: 5200  },
        { name: 'doc_chat',         cost: 3800  },
        { name: 'meeting_notes',    cost: 1900  },
        { name: 'sales_followup',   cost: 1500  },
        { name: 'contract_extract', cost: 1100  },
        { name: 'translate_short',  cost: 920   },
        { name: 'classifier_v2',    cost: 780   },
        { name: 'ticket_router',    cost: 640   },
        { name: 'image_caption',    cost: 520   },
        { name: 'tag_suggest',      cost: 410   },
        { name: 'spell_assist',     cost: 320   },
        { name: 'tone_critic',      cost: 260   },
        { name: 'name_extract',     cost: 210   },
        { name: 'summary_short',    cost: 175   },
        { name: 'date_parse',       cost: 145   },
        { name: 'lang_detect',      cost: 120   },
        { name: 'pii_classifier',   cost: 95    },
        { name: 'trend_blurb',      cost: 80    },
        { name: 'csv_describe',     cost: 65    },
        { name: 'sentiment_v3',     cost: 55    },
        { name: 'tone_score',       cost: 42    },
        { name: 'misc_internal',    cost: 30    }
    ];

    // Sorted descending already; compute cumulative share
    const total = FEATURES.reduce((a, f) => a + f.cost, 0);
    let cum = 0;
    const data = FEATURES.map(f => {
        cum += f.cost;
        return {
            name: f.name,
            cost: f.cost,
            cumPct: (cum / total) * 100,
            sharePct: (f.cost / total) * 100
        };
    });

    let chart = null;

    function fmt(n) { return Math.round(n).toLocaleString('en-US'); }

    function colorFor(rank, target) {
        // Color by Pareto target: red for the vital few that meet target, orange for the next few, gray for the tail
        const targetIdx = data.findIndex(d => d.cumPct >= target);
        const cutoff = targetIdx === -1 ? data.length - 1 : targetIdx;
        if (rank <= cutoff) return rank <= 4 ? '#c62828' : '#c2410c';
        return '#94a3b8';
    }

    function buildChart() {
        const ctx = document.getElementById('paretoChart').getContext('2d');
        chart = new Chart(ctx, {
            data: {
                labels: data.map(d => d.name),
                datasets: [
                    {
                        type: 'bar',
                        label: 'Monthly cost ($)',
                        data: data.map(d => d.cost),
                        backgroundColor: data.map((d, i) => colorFor(i, 80)),
                        borderColor: data.map((d, i) => colorFor(i, 80)),
                        yAxisID: 'y',
                        order: 2
                    },
                    {
                        type: 'line',
                        label: 'Cumulative share (%)',
                        data: data.map(d => d.cumPct),
                        borderColor: '#0277bd',
                        backgroundColor: '#0277bd',
                        pointRadius: 3,
                        pointHoverRadius: 5,
                        borderWidth: 2,
                        yAxisID: 'y1',
                        tension: 0.2,
                        order: 1
                    },
                    {
                        type: 'line',
                        label: 'Pareto target',
                        data: new Array(data.length).fill(80),
                        borderColor: '#c1440e',
                        borderDash: [6, 4],
                        pointRadius: 0,
                        borderWidth: 2,
                        yAxisID: 'y1',
                        order: 0
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 300 },
                plugins: {
                    legend: { position: 'top', labels: { font: { size: 11 } } },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => {
                                const d = data[ctx.dataIndex];
                                if (ctx.dataset.label === 'Monthly cost ($)') {
                                    return `Cost: $${fmt(d.cost)} (${d.sharePct.toFixed(1)}% of total)`;
                                }
                                if (ctx.dataset.label === 'Cumulative share (%)') {
                                    return `Cumulative: ${d.cumPct.toFixed(1)}%`;
                                }
                                return ctx.dataset.label;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: { font: { size: 9 }, maxRotation: 60, minRotation: 60 },
                        grid: { display: false }
                    },
                    y: {
                        position: 'left',
                        title: { display: true, text: 'Monthly cost ($)', font: { size: 11 } },
                        ticks: { font: { size: 10 }, callback: (v) => '$' + fmt(v) },
                        beginAtZero: true
                    },
                    y1: {
                        position: 'right',
                        title: { display: true, text: 'Cumulative share (%)', font: { size: 11 } },
                        ticks: { font: { size: 10 }, callback: (v) => v + '%' },
                        min: 0,
                        max: 100,
                        grid: { drawOnChartArea: false }
                    }
                }
            }
        });
    }

    function updateBanner(target) {
        const targetIdx = data.findIndex(d => d.cumPct >= target);
        const count = targetIdx === -1 ? data.length : targetIdx + 1;
        const features = data.slice(0, count).map(d => d.name).join(', ');
        const status = document.getElementById('status');
        status.textContent =
            `At a ${target}% target, ${count} of ${data.length} features (${features}) ` +
            `account for ${target}% of monthly cost. The remaining ${data.length - count} features are the long tail.`;
    }

    function applyTarget() {
        const target = parseInt(document.getElementById('target').value, 10);
        chart.data.datasets[0].backgroundColor = data.map((d, i) => colorFor(i, target));
        chart.data.datasets[0].borderColor = data.map((d, i) => colorFor(i, target));
        chart.data.datasets[2].data = new Array(data.length).fill(target);
        chart.update('none');
        updateBanner(target);
    }

    function applyCumToggle() {
        const show = document.getElementById('cumToggle').checked;
        chart.data.datasets[1].hidden = !show;
        chart.data.datasets[2].hidden = !show;
        chart.update('none');
    }

    function init() {
        buildChart();
        applyTarget();
        document.getElementById('target').addEventListener('change', applyTarget);
        document.getElementById('cumToggle').addEventListener('change', applyCumToggle);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

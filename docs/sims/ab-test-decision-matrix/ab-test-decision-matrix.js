// A/B Test Outcome Decision Matrix - Mermaid decision tree
// CANVAS_HEIGHT: 700
// Bloom Level: Evaluate (L5) - judge whether to ship a treatment
// Learning objective: Judge whether to ship a treatment based on its
// primary-metric and guardrail-metric outcomes.

// ---- Diagram source: standard tree (no novelty overlay) ----
const diagramStandard = `
flowchart TD
    Q1{"Did primary metric<br/>improve significantly?"}:::decisionNode
    L_NoBenefit["Do not ship<br/>No evidence of benefit"]:::noShipNode
    Q2{"Did any guardrail<br/>regress significantly?"}:::decisionNode
    L_Regression["Do not ship<br/>Improvement does not<br/>justify guardrail regression"]:::noShipNode
    Q3{"Is effect size large enough<br/>to justify implementation cost?"}:::decisionNode
    L_Defer["Defer<br/>Flag effect, look for<br/>larger wins"]:::deferNode
    L_Ship["Ship the treatment"]:::shipNode

    Q1 -->|No| L_NoBenefit
    Q1 -->|Yes| Q2
    Q2 -->|Yes| L_Regression
    Q2 -->|No| Q3
    Q3 -->|No| L_Defer
    Q3 -->|Yes| L_Ship

    classDef decisionNode fill:#0277bd,stroke:#01579b,stroke-width:2px,color:#fff,font-size:14px
    classDef noShipNode fill:#c62828,stroke:#7f1d1d,stroke-width:2px,color:#fff,font-size:14px
    classDef deferNode fill:#f9a825,stroke:#a16207,stroke-width:2px,color:#1f2937,font-size:14px
    classDef shipNode fill:#2e7d32,stroke:#14532d,stroke-width:2px,color:#fff,font-size:14px

    linkStyle default stroke:#64748b,stroke-width:2px,font-size:14px
`;

// ---- Diagram source: with novelty-effect risk overlay ----
const diagramWithNovelty = `
flowchart TD
    Q1{"Did primary metric<br/>improve significantly?"}:::decisionNode
    L_NoBenefit["Do not ship<br/>No evidence of benefit"]:::noShipNode
    QN{"Has the test run<br/>at least 14 days?"}:::noveltyNode
    L_WaitMore["Wait two more weeks<br/>Novelty effect may<br/>be inflating the lift"]:::noveltyLeaf
    Q2{"Did any guardrail<br/>regress significantly?"}:::decisionNode
    L_Regression["Do not ship<br/>Improvement does not<br/>justify guardrail regression"]:::noShipNode
    Q3{"Is effect size large enough<br/>to justify implementation cost?"}:::decisionNode
    L_Defer["Defer<br/>Flag effect, look for<br/>larger wins"]:::deferNode
    L_Ship["Ship the treatment"]:::shipNode

    Q1 -->|No| L_NoBenefit
    Q1 -->|Yes| QN
    QN -->|No| L_WaitMore
    QN -->|Yes| Q2
    Q2 -->|Yes| L_Regression
    Q2 -->|No| Q3
    Q3 -->|No| L_Defer
    Q3 -->|Yes| L_Ship

    classDef decisionNode fill:#0277bd,stroke:#01579b,stroke-width:2px,color:#fff,font-size:14px
    classDef noShipNode fill:#c62828,stroke:#7f1d1d,stroke-width:2px,color:#fff,font-size:14px
    classDef deferNode fill:#f9a825,stroke:#a16207,stroke-width:2px,color:#1f2937,font-size:14px
    classDef shipNode fill:#2e7d32,stroke:#14532d,stroke-width:2px,color:#fff,font-size:14px
    classDef noveltyNode fill:#7b1fa2,stroke:#4a148c,stroke-width:2px,color:#fff,font-size:14px
    classDef noveltyLeaf fill:#ce93d8,stroke:#7b1fa2,stroke-width:2px,color:#1f2937,font-size:14px

    linkStyle default stroke:#64748b,stroke-width:2px,font-size:14px
`;

// ---- Hover content per node ----
// Each node has a title, optional meta line, body text, and optional numbers block
const nodeContent = {
    Q1: {
        title: 'Decision: did the primary metric move?',
        body: 'The first gate on every shipping decision. The primary metric is the single number you committed to before the test started. "Significantly" means past your pre-registered statistical threshold (typically p < 0.05 or a confidence interval that excludes zero), not just a positive point estimate.'
    },
    Q2: {
        title: 'Decision: did anything else break?',
        body: 'Guardrails are metrics you do not want to harm — latency, error rate, satisfaction, downstream conversion. A treatment that wins the primary metric but regresses a guardrail past its threshold should not ship even if the primary effect is real.'
    },
    Q3: {
        title: 'Decision: is the win big enough to justify the cost?',
        body: 'A statistically real effect can still be too small to justify the engineering cost of shipping and maintaining. Compare the projected annual savings or revenue lift against the implementation, monitoring, and rollback costs. Below your threshold? Defer and look for larger wins.'
    },
    QN: {
        title: 'Novelty-effect gate (only with overlay)',
        body: 'Short tests on user-facing changes often see inflated lifts that fade after the first 1-2 weeks ("the new shiny effect"). For LLM features especially, behaviors can change as users learn the new capability. Hold the line: do not ship until you have at least two weeks of data unless your test design is specifically for short-cycle features.'
    },
    L_NoBenefit: {
        title: 'Do not ship - no evidence of benefit',
        meta: 'Primary metric did not move past the pre-registered threshold.',
        body: 'The test gives you no reason to believe the treatment is better than control. Shipping anyway means accepting the implementation, monitoring, and reversion cost in exchange for nothing. Document the negative result and move on.',
        numbers: [
            'Primary: cost-per-success +0.5%',
            'Significance: p = 0.42, n = 8,000',
            'Guardrails: all within range',
            'Decision: do not ship'
        ]
    },
    L_Regression: {
        title: 'Do not ship - guardrail regression',
        meta: 'Primary won, but a guardrail regressed past its threshold.',
        body: 'A real cost win that comes with a real latency or quality regression is rarely a net win once you account for downstream effects (drop-off, complaint volume, oncall load). The right move is to redesign the treatment so it does not pay for cost reduction with quality regression, then re-test.',
        numbers: [
            'Primary: cost-per-success -3.5%',
            'Significance: p = 0.001, n = 12,500',
            'Guardrail: latency p95 +180ms (p = 0.003)',
            'Decision: do not ship'
        ]
    },
    L_Defer: {
        title: 'Defer - effect is real but small',
        meta: 'Real, statistically significant effect, but not big enough to justify ship cost.',
        body: 'Statistical significance is not practical significance. A 0.8% reduction in cost-per-success on a small feature may be real but cost more in engineering hours than it saves in a year. Flag the effect, store the analysis, and look for treatments with larger expected impact.',
        numbers: [
            'Primary: cost-per-success -0.8%',
            'Significance: p = 0.04, n = 9,200',
            'Guardrails: all within range',
            'Effect threshold: -2.0% required',
            'Decision: defer'
        ]
    },
    L_Ship: {
        title: 'Ship the treatment',
        meta: 'Primary won, no guardrails regressed, effect is large enough to matter.',
        body: 'All three gates passed: the primary metric improved past your threshold, no guardrails regressed past theirs, and the effect size justifies the implementation cost. Ship. Document the win, monitor for the first 30 days in case the effect fades, and use the result to set the next baseline.',
        numbers: [
            'Primary: cost-per-success -5.2%',
            'Significance: p < 0.001, n = 14,800',
            'Guardrail: latency p95 +30ms (within 50ms budget)',
            'Guardrail: satisfaction +1.0 pt (improved)',
            'Decision: ship'
        ]
    },
    L_WaitMore: {
        title: 'Wait two more weeks',
        meta: 'Primary appears to win, but the test is too short to trust.',
        body: 'When a test has run less than two weeks and the primary metric shows a strong lift, novelty effect is the most common source of inflation. Resist the urge to ship on the first good signal. Hold traffic at the current split, let the effect mature or fade, then return to the standard ship/defer/regress flow.',
        numbers: [
            'Test duration: 5 days',
            'Primary: cost-per-success -7.2% (large)',
            'Concern: typical novelty fade is 1-3 weeks',
            'Decision: wait, then re-evaluate'
        ]
    }
};

// ---- Render with the chosen diagram source ----
async function renderDiagram(useNovelty) {
    const source = useNovelty ? diagramWithNovelty : diagramStandard;
    const container = document.getElementById('mermaidContainer');
    container.removeAttribute('data-processed');
    container.innerHTML = source;
    if (window.mermaid) {
        try {
            await window.mermaid.run({ nodes: [container] });
        } catch (e) {
            console.error('Mermaid render error:', e);
        }
        setupNodeHover();
    }
}

// ---- Y-following info card ----
const panel = () => document.getElementById('panel');
const panelWrap = () => document.getElementById('panelWrap');

function positionPanel(evt) {
    const wrap = panelWrap();
    const card = panel();
    if (!wrap || !card) return;
    const r = wrap.getBoundingClientRect();
    const cardH = card.offsetHeight || 140;
    const wrapH = wrap.offsetHeight;
    const y = evt.clientY - r.top - 20;
    const top = Math.max(8, Math.min(wrapH - cardH - 8, y));
    card.style.top = `${top}px`;
}

function renderContent(nodeId) {
    const c = nodeContent[nodeId];
    if (!c) return;
    let html = `<div class="info-title">${c.title}</div>`;
    if (c.meta) html += `<div class="info-meta">${c.meta}</div>`;
    html += `<div class="info-body">${c.body}</div>`;
    if (c.numbers) {
        html += '<div class="info-numbers">' + c.numbers.map(n => `&bull; ${n}`).join('<br>') + '</div>';
    }
    panel().innerHTML = html;
}

function resetContent() {
    panel().innerHTML = '<div class="info-placeholder">Hover any node to see what it means. Hover a leaf (red, yellow, or green) to see a worked example with real A/B test numbers.</div>';
}

// Map Mermaid-rendered DOM node IDs back to logical node IDs
function extractNodeId(domId) {
    // Mermaid v11 IDs look like "flowchart-Q1-12" or "flowchart-L_Ship-46"
    const m = domId.match(/flowchart-([A-Za-z0-9_]+)-/);
    return m ? m[1] : null;
}

function setupNodeHover() {
    const nodes = document.querySelectorAll('#mermaidContainer .node');
    nodes.forEach(node => {
        const nodeId = extractNodeId(node.id);
        if (nodeId && nodeContent[nodeId]) {
            node.addEventListener('mouseenter', (e) => {
                renderContent(nodeId);
                positionPanel(e);
            });
            node.addEventListener('mousemove', positionPanel);
            node.addEventListener('mouseleave', resetContent);
        }
    });
}

// ---- Wait for Mermaid to be ready, then do initial render ----
function waitForMermaid() {
    if (window.mermaid && typeof window.mermaid.run === 'function') {
        const toggle = document.getElementById('noveltyToggle');
        renderDiagram(toggle.checked);
        toggle.addEventListener('change', () => renderDiagram(toggle.checked));
    } else {
        setTimeout(waitForMermaid, 50);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', waitForMermaid);
} else {
    waitForMermaid();
}

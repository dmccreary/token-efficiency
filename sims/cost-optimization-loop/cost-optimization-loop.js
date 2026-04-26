// Cost Optimization Loop - Mermaid circular workflow
// CANVAS_HEIGHT: 700
// Bloom Level: Apply (L3) - implement
// LO: Implement the end-to-end optimization loop and identify which artifacts each stage produces.

const diagramHappy = `
flowchart TD
    Baseline["1. Baseline cost measurement<br/>→ snapshot artifact"]:::measure
    Analysis["2. Log file analysis<br/>→ optimization backlog"]:::measure
    Hypothesis["3. Pick top-ranked hypothesis<br/>→ hypothesis spec"]:::hypothesize
    ABTest["4. Design A/B test<br/>→ test plan"]:::hypothesize
    Pilot["5. Pilot rollout<br/>→ initial production data"]:::test
    Canary["6. Canary deployment<br/>→ wider validation"]:::test
    FullRollout["7. Full rollout<br/>→ all traffic on new version"]:::rollout
    Report["8. Before-after report<br/>→ evidence artifact"]:::rollout
    Update(["9. Update baseline<br/>(loop returns)"]):::measure

    Baseline --> Analysis --> Hypothesis --> ABTest --> Pilot --> Canary --> FullRollout --> Report --> Update --> Baseline

    classDef measure fill:#0277bd,stroke:#01579b,stroke-width:2px,color:#fff,font-size:13px
    classDef hypothesize fill:#7b1fa2,stroke:#4a148c,stroke-width:2px,color:#fff,font-size:13px
    classDef test fill:#c1440e,stroke:#7c2d12,stroke-width:2px,color:#fff,font-size:13px
    classDef rollout fill:#2e7d32,stroke:#14532d,stroke-width:2px,color:#fff,font-size:13px
    linkStyle default stroke:#64748b,stroke-width:2px,font-size:12px
`;

const diagramFailures = `
flowchart TD
    Baseline["1. Baseline cost measurement"]:::measure
    Analysis["2. Log file analysis"]:::measure
    Hypothesis["3. Pick top-ranked hypothesis"]:::hypothesize
    ABTest["4. Design A/B test"]:::hypothesize
    Pilot["5. Pilot rollout"]:::test
    Canary["6. Canary deployment"]:::test
    FullRollout["7. Full rollout"]:::rollout
    Report["8. Before-after report"]:::rollout
    Update(["9. Update baseline"]):::measure
    Postmortem["Cost reduction postmortem<br/>(guardrails failed)"]:::failure
    Archive["Archive disconfirmed hypothesis<br/>(no significant lift)"]:::failure
    AdjustUp["Adjust target upward<br/>(wins exceeded expectations)"]:::success

    Baseline --> Analysis --> Hypothesis --> ABTest --> Pilot --> Canary --> FullRollout --> Report --> Update --> Baseline
    ABTest -.->|hypothesis disconfirmed| Archive
    Pilot -.->|guardrails fail| Postmortem
    Canary -.->|guardrails fail| Postmortem
    FullRollout -.->|guardrails fail| Postmortem
    Report -.->|wins exceed expectations| AdjustUp
    AdjustUp -.-> Hypothesis
    Archive -.-> Analysis

    classDef measure fill:#0277bd,stroke:#01579b,stroke-width:2px,color:#fff,font-size:13px
    classDef hypothesize fill:#7b1fa2,stroke:#4a148c,stroke-width:2px,color:#fff,font-size:13px
    classDef test fill:#c1440e,stroke:#7c2d12,stroke-width:2px,color:#fff,font-size:13px
    classDef rollout fill:#2e7d32,stroke:#14532d,stroke-width:2px,color:#fff,font-size:13px
    classDef failure fill:#c62828,stroke:#7f1d1d,stroke-width:2px,color:#fff,font-size:13px
    classDef success fill:#16a34a,stroke:#14532d,stroke-width:2px,color:#fff,font-size:13px
    linkStyle default stroke:#64748b,stroke-width:2px,font-size:12px
`;

const nodeContent = {
    Baseline: { title: '1. Baseline cost measurement', meta: 'Artifact: cost snapshot', body: 'A reproducible measurement of current token cost broken down by feature, user, model. Establishes the "before" number every later stage compares to. Stale baselines silently invalidate every downstream conclusion.' },
    Analysis: { title: '2. Log file analysis', meta: 'Artifact: ranked optimization backlog', body: 'Top-N cost drivers, runaway prompts, prompt-template aggregations. Output is a list of candidate optimizations sorted by expected impact, with effort estimates.' },
    Hypothesis: { title: '3. Pick top-ranked hypothesis', meta: 'Artifact: hypothesis spec', body: 'A single, testable claim: "Compressing the system prompt by 30% will reduce cost-per-request by 15% with no quality regression." Includes the specific change, the expected effect size, and the guardrails.' },
    ABTest: { title: '4. Design A/B test', meta: 'Artifact: test plan', body: 'Sample size, traffic split, primary metric, guardrail metrics, stopping rule. Pre-register everything to prevent post-hoc rationalization.' },
    Pilot: { title: '5. Pilot rollout', meta: 'Artifact: initial production data', body: '1-5% of traffic to the treatment, real users, real volumes. Catches integration failures the A/B harness might mask.' },
    Canary: { title: '6. Canary deployment', meta: 'Artifact: wider production validation', body: '10-25% of traffic. Long enough to detect novelty fade and observe across business cycles (weekday/weekend).' },
    FullRollout: { title: '7. Full rollout', meta: 'Artifact: 100% on new version', body: 'Old code path stays for one additional cycle in case of unforeseen regression. Document the rollback path.' },
    Report: { title: '8. Before-after report', meta: 'Artifact: evidence artifact', body: 'Crisp summary: hypothesis, design, observed effect, confidence interval, dollars saved, lessons learned. Becomes input for the next baseline and is shared with the engineering manager.' },
    Update: { title: '9. Update baseline', body: 'Re-measure cost with the new version live. The new baseline is the "before" for the next round. Without this step, future optimizations attribute themselves to the wrong baseline.' },
    Postmortem: { title: 'Cost reduction postmortem', meta: 'Failure path: guardrails failed', body: 'When a treatment regresses a guardrail past its threshold, halt rollout and write a blameless postmortem. Capture the failure mode and the missing guardrail (if any) so future tests catch it earlier.' },
    Archive: { title: 'Archive disconfirmed hypothesis', meta: 'Failure path: no significant lift', body: 'A negative result is still a result. Archive the hypothesis spec and test data; the next iteration of the loop should not re-test the same hypothesis without new information.' },
    AdjustUp: { title: 'Adjust target upward', meta: 'Success path: wins exceed expectations', body: 'When the observed effect size is meaningfully larger than the hypothesis predicted, raise the next target. This keeps the loop pushing rather than coasting on early wins.' }
};

async function renderDiagram(showFailures) {
    const container = document.getElementById('mermaidContainer');
    container.removeAttribute('data-processed');
    container.innerHTML = showFailures ? diagramFailures : diagramHappy;
    if (window.mermaid) {
        try { await window.mermaid.run({ nodes: [container] }); } catch (e) { console.error(e); }
        setupNodeHover();
    }
}
const panel = () => document.getElementById('panel');
const panelWrap = () => document.getElementById('panelWrap');
function positionPanel(evt) {
    const wrap = panelWrap(); const card = panel();
    if (!wrap || !card) return;
    const r = wrap.getBoundingClientRect();
    const cardH = card.offsetHeight || 140;
    const top = Math.max(8, Math.min(wrap.offsetHeight - cardH - 8, evt.clientY - r.top - 20));
    card.style.top = `${top}px`;
}
function renderContent(id) {
    const c = nodeContent[id]; if (!c) return;
    let h = `<div class="info-title">${c.title}</div>`;
    if (c.meta) h += `<div class="info-meta">${c.meta}</div>`;
    h += `<div class="info-body">${c.body}</div>`;
    panel().innerHTML = h;
}
function resetContent() {
    panel().innerHTML = '<div class="info-placeholder">Hover any stage to see the artifact it produces and an example.</div>';
}
function extractNodeId(domId) {
    const m = domId.match(/flowchart-([A-Za-z0-9_]+)-/); return m ? m[1] : null;
}
function setupNodeHover() {
    document.querySelectorAll('#mermaidContainer .node').forEach(node => {
        const nid = extractNodeId(node.id);
        if (nid && nodeContent[nid]) {
            node.addEventListener('mouseenter', e => { renderContent(nid); positionPanel(e); });
            node.addEventListener('mousemove', positionPanel);
            node.addEventListener('mouseleave', resetContent);
        }
    });
}
function waitForMermaid() {
    if (window.mermaid && typeof window.mermaid.run === 'function') {
        const t = document.getElementById('failureToggle');
        renderDiagram(t.checked);
        t.addEventListener('change', () => renderDiagram(t.checked));
    } else { setTimeout(waitForMermaid, 50); }
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', waitForMermaid);
else waitForMermaid();

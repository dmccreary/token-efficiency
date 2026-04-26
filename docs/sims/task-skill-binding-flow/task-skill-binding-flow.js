// Task to Skill Binding Flow - Mermaid swimlanes
// CANVAS_HEIGHT: 700
// Bloom Level: Analyze (L4) - examine
// LO: Examine how the harness decomposes a user request and binds each task to a Skill, and quantify the token savings vs. an eager-load alternative.

const diagramLazy = `
flowchart TD
    User["User: 'Generate a chapter outline for my new course'"]:::user
    HarnessSP["Harness System Prompt<br/>50 Skill DESCRIPTIONS only<br/>≈2,500 tokens"]:::descs
    Decomp["Task decomposition<br/>splits user request"]:::harness
    T1["Task 1:<br/>analyze course description"]:::harness
    T2["Task 2:<br/>design chapter structure"]:::harness
    T3["Task 3:<br/>validate dependency order"]:::harness
    S1["course-description-analyzer<br/>BODY loaded: ~1,800 tokens"]:::skill
    S2["book-chapter-generator<br/>BODY loaded: ~3,200 tokens"]:::skill
    S3["validate-dependencies<br/>BUNDLED PYTHON SCRIPT<br/>~50 token invocation"]:::script
    Total(["Loaded total: ~7,550 tokens<br/>(2 of 50 bodies + 1 script)"]):::summary

    User --> HarnessSP
    HarnessSP --> Decomp
    Decomp --> T1 --> S1
    Decomp --> T2 --> S2
    Decomp --> T3 --> S3
    S1 --> Total
    S2 --> Total
    S3 --> Total

    classDef user fill:#0277bd,stroke:#01579b,stroke-width:2px,color:#fff,font-size:13px
    classDef descs fill:#94a3b8,stroke:#475569,stroke-width:2px,color:#fff,font-size:13px
    classDef harness fill:#7b1fa2,stroke:#4a148c,stroke-width:2px,color:#fff,font-size:13px
    classDef skill fill:#c1440e,stroke:#7c2d12,stroke-width:2px,color:#fff,font-size:13px
    classDef script fill:#2e7d32,stroke:#14532d,stroke-width:2px,color:#fff,font-size:13px
    classDef summary fill:#16a34a,stroke:#14532d,stroke-width:2px,color:#fff,font-size:14px
    linkStyle default stroke:#64748b,stroke-width:2px,font-size:11px
`;

const diagramEager = `
flowchart TD
    User["User: 'Generate a chapter outline'"]:::user
    HarnessSP["Harness System Prompt<br/>ALL 50 Skill BODIES eagerly loaded<br/>≈100,000 tokens"]:::eager
    Decomp["Task decomposition"]:::harness
    T1["Task 1"]:::harness
    T2["Task 2"]:::harness
    T3["Task 3"]:::harness
    Total(["Loaded total: ~100,000 tokens<br/>(every body upfront, only 3 used)"]):::summaryBad

    User --> HarnessSP
    HarnessSP --> Decomp
    Decomp --> T1
    Decomp --> T2
    Decomp --> T3
    T1 --> Total
    T2 --> Total
    T3 --> Total

    classDef user fill:#0277bd,stroke:#01579b,stroke-width:2px,color:#fff,font-size:13px
    classDef eager fill:#c62828,stroke:#7f1d1d,stroke-width:2px,color:#fff,font-size:13px
    classDef harness fill:#7b1fa2,stroke:#4a148c,stroke-width:2px,color:#fff,font-size:13px
    classDef summaryBad fill:#c62828,stroke:#7f1d1d,stroke-width:2px,color:#fff,font-size:14px
    linkStyle default stroke:#64748b,stroke-width:2px,font-size:11px
`;

const nodeContent = {
    User: { title: 'User request', body: 'A single high-level request the user types into the harness. The harness must decompose this into discrete tasks before it knows which Skill bodies to load.' },
    HarnessSP: { title: 'Harness system prompt', meta: 'Cost: ~2,500 tokens (lazy)', body: 'Contains only the SHORT TRIGGER DESCRIPTIONS of every available Skill (one or two sentences each), not the full bodies. With 50 Skills, this is ~2,500 tokens — sustainable as a baseline tax on every session.' },
    Decomp: { title: 'Task decomposition', body: 'The harness reads the user request and produces an ordered list of discrete tasks. This is the moment the harness commits to which Skills it WILL need.' },
    T1: { title: 'Task 1: analyze course description', body: 'Matches the trigger description of the course-description-analyzer skill. The harness fires the skill, which loads its body into context.' },
    T2: { title: 'Task 2: design chapter structure', body: 'Matches the trigger description of book-chapter-generator. Body is loaded on demand only when this task is bound.' },
    T3: { title: 'Task 3: validate dependency order', body: 'A deterministic verification task. Bound to a bundled Python script — no skill body loaded, no prose tokens consumed for the verification logic itself.' },
    S1: { title: 'course-description-analyzer body', meta: 'Cost: ~1,800 tokens (loaded once)', body: 'The full skill body with detailed instructions for analyzing the course description. Lives in a separate file; loaded into context only when bound.' },
    S2: { title: 'book-chapter-generator body', meta: 'Cost: ~3,200 tokens (loaded once)', body: 'Detailed instructions for the chapter design workflow. Larger than the analyzer because the workflow is more complex.' },
    S3: { title: 'Bundled Python script', meta: 'Cost: ~50 tokens (script invocation only)', body: 'The deterministic verification logic lives in a Python file in the skill bundle. The harness invokes the script; the script runs locally; the result returns. The script body is not in context.' },
    Total: { title: 'Loaded total', body: 'System prompt (2,500) + 2 skill bodies (5,000) + script invocation (50) = ~7,550 tokens loaded for this session. The other 48 skill bodies stay on disk.' }
};

async function renderDiagram(eager) {
    const container = document.getElementById('mermaidContainer');
    container.removeAttribute('data-processed');
    container.innerHTML = eager ? diagramEager : diagramLazy;
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
    const top = Math.max(8, Math.min(wrap.offsetHeight - (card.offsetHeight || 140) - 8, evt.clientY - r.top - 20));
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
    panel().innerHTML = '<div class="info-placeholder">Hover any step to see token cost and what is loaded.</div>';
}
function extractNodeId(domId) { const m = domId.match(/flowchart-([A-Za-z0-9_]+)-/); return m ? m[1] : null; }
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
        const t = document.getElementById('eagerToggle');
        renderDiagram(t.checked);
        t.addEventListener('change', () => renderDiagram(t.checked));
    } else { setTimeout(waitForMermaid, 50); }
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', waitForMermaid);
else waitForMermaid();

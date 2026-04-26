// Privacy Compliance Pipeline - Mermaid vertical flow with framework annotations
// CANVAS_HEIGHT: 720
// Bloom Level: Apply (L3) - implement
// LO: Implement a privacy-and-compliance-aware LLM request pipeline that satisfies GDPR, HIPAA, and SOC2 simultaneously.

function buildDiagram(gdpr, hipaa, soc2) {
    const ann = (a) => a ? `<br/><i style="font-size:11px;color:#475569">${a}</i>` : '';
    const gdprA = gdpr ? 'GDPR: lawful basis logged' : '';
    const hipaaA = hipaa ? 'HIPAA: PHI never crosses redaction' : '';
    const soc2A = soc2 ? 'SOC2: change-control audited' : '';
    const drA = gdpr ? 'GDPR: data residency enforced' : '';
    const noTrainA = (gdpr || hipaa) ? 'No-train enterprise tier' : '';
    const auditA = soc2 ? 'SOC2: tamper-evident audit log' : '';

    return `
flowchart TD
    Input["1. User input received<br/>(may contain PII/PHI)${ann(gdprA)}"]:::io
    Field["2. Field redaction<br/>SSN, credit card → placeholders${ann(hipaaA)}"]:::redact
    PII["3. Free-text PII detection<br/>tokenize names with reversible tokens"]:::redact
    Assemble["4. Prompt assembly<br/>with redacted/tokenized content"]:::redact
    Region["5. Region check<br/>route to in-region endpoint${ann(drA)}"]:::route
    LLM["6. LLM call${ann(noTrainA)}"]:::route
    Resp["7. Response received"]:::io
    RespPII["8. Response PII detection<br/>model may surface training-data PII"]:::redact
    Detok["9. Re-tokenize identifiers<br/>(authorized recipient only)"]:::redact
    Log["10. Log line emitted<br/>redacted prompt hash, no raw content${ann(auditA)}"]:::audit
    Out["11. Response delivered to user"]:::io

    Input --> Field --> PII --> Assemble --> Region --> LLM --> Resp --> RespPII --> Detok --> Log --> Out

    classDef io fill:#0277bd,stroke:#01579b,stroke-width:2px,color:#fff,font-size:13px
    classDef redact fill:#7b1fa2,stroke:#4a148c,stroke-width:2px,color:#fff,font-size:13px
    classDef route fill:#c1440e,stroke:#7c2d12,stroke-width:2px,color:#fff,font-size:13px
    classDef audit fill:#2e7d32,stroke:#14532d,stroke-width:2px,color:#fff,font-size:13px
    linkStyle default stroke:#64748b,stroke-width:2px,font-size:12px
`;
}

const nodeContent = {
    Input: { title: '1. User input received', body: 'Raw input from a user — may contain free-text PII (names, addresses), structured PII (SSN, credit card), or PHI under HIPAA. Treat everything as potentially sensitive until proven otherwise. Without this step, downstream redaction has no input.' },
    Field: { title: '2. Field redaction', meta: 'Failure mode: structured PII reaches the LLM in plaintext.', body: 'Replace high-confidence regex matches (SSN, credit card, phone, email) with deterministic placeholders ({{SSN_1}}, {{CC_1}}). Audit-log the placeholder mapping in a separate, access-controlled table.' },
    PII: { title: '3. Free-text PII detection', meta: 'Failure mode: names and addresses leak through.', body: 'Run a NER model (or a service like Microsoft Presidio) on the remaining content. Names get tokenized to reversible tokens (PERSON_1, PERSON_2). The mapping is stored briefly so the response can be detokenized for the authorized recipient.' },
    Assemble: { title: '4. Prompt assembly', body: 'Build the LLM request from system prompt + redacted user input + retrieved context. The redacted/tokenized content is what the LLM sees.' },
    Region: { title: '5. Region check', meta: 'Failure mode: data leaves the residency boundary.', body: 'Route the request to an LLM endpoint in the same region as the user data origin (EU users → EU endpoint, etc.). Most vendors expose region-specific endpoints; defaulting to a global endpoint is a residency violation.' },
    LLM: { title: '6. LLM call', body: 'Use the vendor enterprise tier with no-train, low-retention guarantees. Verify your contract has these clauses; the consumer tier of most vendors does NOT.' },
    Resp: { title: '7. Response received', body: 'The model output. Treat as untrusted: the model may have surfaced PII from its training data, may have inadvertently echoed input PII, or may have hallucinated identifiers that look real.' },
    RespPII: { title: '8. Response PII detection', meta: 'Failure mode: model surfaces training-data PII.', body: 'Run the same NER scan on the response. Any high-confidence PII detection that does not match a known token from the input gets redacted with a "[REDACTED]" marker before delivery.' },
    Detok: { title: '9. Re-tokenize identifiers', body: 'Replace the input-side tokens (PERSON_1) back to the original identifiers — but ONLY for the authorized recipient (the original user, not a logging target or downstream system). This is the most failure-prone step; require explicit recipient verification.' },
    Log: { title: '10. Log line emitted', meta: 'Failure mode: raw prompt content in logs.', body: 'The log line includes the prompt HASH (not the prompt itself), token counts, model, latency, cost, request ID, and a tamper-evident audit signature. The mapping table from steps 2 and 3 has its own short-retention store with separate access controls.' },
    Out: { title: '11. Response delivered to user', body: 'The detokenized response is delivered. The job is not done: the audit log entry from step 10 is the durable artifact that proves the controls fired.' }
};

async function renderDiagram() {
    const gdpr = document.getElementById('gdprToggle').checked;
    const hipaa = document.getElementById('hipaaToggle').checked;
    const soc2 = document.getElementById('soc2Toggle').checked;
    const container = document.getElementById('mermaidContainer');
    container.removeAttribute('data-processed');
    container.innerHTML = buildDiagram(gdpr, hipaa, soc2);
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
    panel().innerHTML = '<div class="info-placeholder">Hover any step. Toggle frameworks to see required controls.</div>';
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
        ['gdprToggle', 'hipaaToggle', 'soc2Toggle'].forEach(id => {
            document.getElementById(id).addEventListener('change', renderDiagram);
        });
        renderDiagram();
    } else { setTimeout(waitForMermaid, 50); }
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', waitForMermaid);
else waitForMermaid();

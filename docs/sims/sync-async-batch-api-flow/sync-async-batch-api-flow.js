// Sync vs Async vs Batch API Flow - Mermaid sequence diagrams
// CANVAS_HEIGHT: 600
// Bloom Level: Evaluate (L5) - recommend
// LO: Recommend the appropriate API mode for a given workload.

const diagrams = {
    sync: `
sequenceDiagram
    autonumber
    participant Client
    participant Vendor
    Client->>Vendor: Send request
    Note over Vendor: Process (1-10s)
    Vendor->>Client: Return response
    Note over Client,Vendor: Latency: seconds. Cost: 1.0×.<br/>Client thread blocked.
`,
    async: `
sequenceDiagram
    autonumber
    participant Client
    participant Vendor
    participant App as Other client work
    Client->>Vendor: Submit request
    Vendor-->>Client: Job ID
    Client->>App: Free for other work
    Note over Vendor: Process (1-60s)
    Vendor->>Client: Webhook callback
    Note right of Vendor: OR: Client polls /jobs/{id}
    Vendor->>Client: Return response
    Note over Client,Vendor: Latency: sec-to-min. Cost: 1.0×.<br/>Client thread free.
`,
    batch: `
sequenceDiagram
    autonumber
    participant Client
    participant Vendor
    Client->>Vendor: Upload JSONL with N requests
    Vendor-->>Client: Batch ID
    Note over Vendor: Schedule and process<br/>(within 24h SLA window)
    Vendor->>Client: Notify completion
    Client->>Vendor: Download results JSONL
    Note over Client,Vendor: Latency: hours. Cost: 0.5× (batch discount).
`
};

const guidance = {
    sync: { title: 'Synchronous: when to use', body: '<b>Use when:</b> the user is waiting (interactive chat, IDE inline assist, search ranking). <b>Avoid when:</b> the request takes more than ~30 seconds, the workload is bursty, or you need the cheaper batch tier. <b>Cost:</b> baseline (1.0×). <b>Engineering:</b> simplest pattern; HTTP request, HTTP response.' },
    async: { title: 'Asynchronous: when to use', body: '<b>Use when:</b> a request takes 30s-5min and the user can be notified later (long document analysis, agent runs). <b>Avoid when:</b> latency is the priority (use sync) or you can wait hours (use batch). <b>Cost:</b> baseline (1.0×). <b>Engineering:</b> requires job-status tracking; webhook is the production-grade pattern.' },
    batch: { title: 'Batch: when to use', body: '<b>Use when:</b> latency is hours-tolerant — overnight evals, content classification at scale, embedding-of-corpus jobs. <b>Avoid when:</b> a user is waiting, or when results feed time-sensitive downstream systems. <b>Cost:</b> ~0.5× baseline (vendor batch discount). <b>Engineering:</b> JSONL upload, job status, JSONL download.' }
};

async function renderDiagram(mode) {
    const container = document.getElementById('mermaidContainer');
    container.removeAttribute('data-processed');
    container.innerHTML = `<div class="mermaid">${diagrams[mode]}</div>`;
    if (window.mermaid) {
        try { await window.mermaid.run({ nodes: [container.querySelector('.mermaid')] }); } catch (e) { console.error(e); }
    }
    const g = guidance[mode];
    document.getElementById('panel').innerHTML = `<div class="info-title">${g.title}</div><div class="info-body">${g.body}</div>`;
}

function waitForMermaid() {
    if (window.mermaid && typeof window.mermaid.run === 'function') {
        document.getElementById('modeSync').addEventListener('change', () => renderDiagram('sync'));
        document.getElementById('modeAsync').addEventListener('change', () => renderDiagram('async'));
        document.getElementById('modeBatch').addEventListener('change', () => renderDiagram('batch'));
        renderDiagram('sync');
    } else { setTimeout(waitForMermaid, 50); }
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', waitForMermaid);
else waitForMermaid();

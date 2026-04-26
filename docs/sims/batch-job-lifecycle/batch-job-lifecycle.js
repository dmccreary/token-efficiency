// Batch Job Lifecycle - Mermaid state diagram
// CANVAS_HEIGHT: 660
// Bloom Level: Apply (L3) - implement
// LO: Implement a robust batch pipeline including idempotency, retry, and webhook-based completion notification.

const diagramWebhook = `
flowchart TD
    NotSubmitted("Not Submitted"):::initial
    Pending["Pending<br/>(vendor accepted, queued)"]:::inflight
    InProgress["In Progress<br/>(vendor processing)"]:::inflight
    Completed["Completed<br/>(all results ready)"]:::success
    Partial["Partial<br/>(some succeeded)"]:::partial
    Failed["Failed<br/>(job-level error)"]:::failure
    Expired["Expired<br/>(window passed)"]:::failure
    Done["Done<br/>(results downloaded)"]:::success
    Retry["Retry sub-requests<br/>(new batch from failed)"]:::partial

    NotSubmitted -->|Submit + idempotency_key| Pending
    Pending -->|Vendor schedules| InProgress
    InProgress --> Completed
    InProgress --> Partial
    InProgress --> Failed
    InProgress -->|Window passes| Expired
    Completed -->|Webhook| Done
    Partial -->|Webhook| Retry
    Retry -->|Submit retry batch| Pending
    Failed -->|Webhook + alert| Done

    classDef initial fill:#94a3b8,stroke:#475569,stroke-width:2px,color:#fff,font-size:13px
    classDef inflight fill:#0277bd,stroke:#01579b,stroke-width:2px,color:#fff,font-size:13px
    classDef success fill:#2e7d32,stroke:#14532d,stroke-width:2px,color:#fff,font-size:13px
    classDef partial fill:#f9a825,stroke:#a16207,stroke-width:2px,color:#1f2937,font-size:13px
    classDef failure fill:#c62828,stroke:#7f1d1d,stroke-width:2px,color:#fff,font-size:13px
    linkStyle default stroke:#64748b,stroke-width:2px,font-size:12px
`;

const diagramPolling = `
flowchart TD
    NotSubmitted("Not Submitted"):::initial
    Pending["Pending"]:::inflight
    InProgress["In Progress"]:::inflight
    Poll{{"App polls<br/>GET /jobs/{id}"}}:::poll
    Completed["Completed"]:::success
    Partial["Partial"]:::partial
    Failed["Failed"]:::failure
    Expired["Expired"]:::failure
    Done["Done<br/>(results downloaded)"]:::success
    Retry["Retry sub-requests"]:::partial

    NotSubmitted -->|Submit + idempotency_key| Pending
    Pending --> Poll
    Poll -->|status=pending| Poll
    Poll -->|status=in_progress| InProgress
    InProgress --> Poll
    Poll -->|status=completed| Completed
    Poll -->|status=partial| Partial
    Poll -->|status=failed| Failed
    Poll -->|status=expired| Expired
    Completed -->|Download results| Done
    Partial -->|Download partial| Retry
    Retry -->|Submit retry batch| Pending
    Failed -->|Alert| Done

    classDef initial fill:#94a3b8,stroke:#475569,stroke-width:2px,color:#fff,font-size:13px
    classDef inflight fill:#0277bd,stroke:#01579b,stroke-width:2px,color:#fff,font-size:13px
    classDef poll fill:#7b1fa2,stroke:#4a148c,stroke-width:2px,color:#fff,font-size:13px
    classDef success fill:#2e7d32,stroke:#14532d,stroke-width:2px,color:#fff,font-size:13px
    classDef partial fill:#f9a825,stroke:#a16207,stroke-width:2px,color:#1f2937,font-size:13px
    classDef failure fill:#c62828,stroke:#7f1d1d,stroke-width:2px,color:#fff,font-size:13px
    linkStyle default stroke:#64748b,stroke-width:2px,font-size:12px
`;

const nodeContent = {
    NotSubmitted: { title: 'Not Submitted (initial)', body: 'The job exists only as a JSONL file in your client. No tokens have been billed. Compute an idempotency key here (e.g. sha256 of the request payload) so retries do not double-bill.' },
    Pending: { title: 'Pending', meta: 'Expected duration: seconds to minutes', body: 'The vendor has accepted the batch and assigned it a job ID. The idempotency key prevents double-processing on retried submission. Cost so far: $0.' },
    InProgress: { title: 'In Progress', meta: 'Expected duration: minutes to hours', body: 'The vendor is processing your sub-requests in parallel. The job runs in the background; the client thread is free for other work. The vendor charges per sub-request only at completion.' },
    Poll: { title: 'Polling status', body: 'When polling, the app calls GET /jobs/{id} on a backoff schedule (start at 10s, double up to 5min). Each poll is a cheap REST call (no token billing).' },
    Completed: { title: 'Completed (terminal)', meta: 'All sub-requests succeeded.', body: 'Results are available for download. Cost is the batch-discounted price (~50% of synchronous). Move job state to Done after the download succeeds.' },
    Partial: { title: 'Partial (retry-able)', meta: 'Some sub-requests succeeded, some did not.', body: 'Download the partial results, identify the failed sub-requests, build a NEW batch from only the failed ones, and resubmit with a new idempotency key. The successful results are already paid for.' },
    Failed: { title: 'Failed (terminal)', meta: 'Job-level failure: no results.', body: 'Most often a malformed JSONL or auth failure. No tokens billed. Diagnose, fix, resubmit with a new idempotency key.' },
    Expired: { title: 'Expired (terminal)', meta: 'Window passed without completion.', body: 'The vendor failed to complete within the SLA window (typically 24h). Most vendors do NOT bill for expired jobs but check the contract. Resubmit if still relevant, or accept the loss.' },
    Done: { title: 'Done', body: 'Job state stored in your database with the result blob and a final cost record. Idempotency key archived to prevent re-processing.' },
    Retry: { title: 'Retry sub-requests', body: 'A small follow-up batch built from only the failed sub-requests of the parent. Use a fresh idempotency key. Cost is proportional to the failed count, not the original batch size.' }
};

async function renderDiagram(usePolling) {
    const container = document.getElementById('mermaidContainer');
    container.removeAttribute('data-processed');
    container.innerHTML = usePolling ? diagramPolling : diagramWebhook;
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
    panel().innerHTML = '<div class="info-placeholder">Hover any state to see expected duration and what to do next.</div>';
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
        const t = document.getElementById('pollingToggle');
        renderDiagram(t.checked);
        t.addEventListener('change', () => renderDiagram(t.checked));
    } else { setTimeout(waitForMermaid, 50); }
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', waitForMermaid);
else waitForMermaid();

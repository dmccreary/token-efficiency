// LLM Logging Pipeline with Privacy Filters - Mermaid flowchart
// CANVAS_HEIGHT: 720
// Bloom Level: Apply (L3) - implement
// Learning objective: Implement an LLM logging pipeline that captures every
// required field while satisfying PII redaction and retention requirements.

// Diagram source: PII branch is dynamically highlighted based on toggle state
function buildDiagram(piiDetected) {
    const piiYesStyle = piiDetected ? ':::redactNode' : ':::dimNode';
    const piiNoStyle  = piiDetected ? ':::dimNode'    : ':::cleanNode';
    return `
flowchart TD
    APP["Application code<br/>build_prompt(); call_llm()"]:::appNode
    API["LLM API<br/>returns response + usage"]:::apiNode
    MID["Logging middleware<br/>(synchronous)"]:::middlewareNode
    HASH["Compute prompt_hash<br/>= SHA256(prompt)[:16]"]:::middlewareNode
    PII{"PII detector<br/>regex + presidio"}:::middlewareNode
    REDACT["Redact PII<br/>email,phone,SSN,name<br/>pii_redacted=true"]${piiYesStyle}
    CLEAN["Truncate prompt to N tokens<br/>pii_redacted=false"]${piiNoStyle}
    COST["Compute cost_usd<br/>tokens × price/MTok"]:::middlewareNode
    META["Add trace_id, span_id,<br/>session_id, request_id,<br/>user_id, feature"]:::middlewareNode
    EMIT["Emit JSONL line<br/>to local stream"]:::storeNode
    FORWARD["Log forwarder<br/>(asynchronous)"]:::storeNode
    BLOB["Object storage<br/>(raw JSONL, 90 days)"]:::storeNode
    WAREHOUSE["Analytics warehouse<br/>(daily roll-ups)"]:::storeNode
    RETAIN["Retention policy<br/>delete records > N days"]:::retainNode

    APP --> API
    API --> MID
    MID --> HASH
    HASH --> PII
    PII -->|"PII found"| REDACT
    PII -->|"clean"| CLEAN
    REDACT --> COST
    CLEAN --> COST
    COST --> META
    META --> EMIT
    EMIT --> FORWARD
    FORWARD --> BLOB
    FORWARD --> WAREHOUSE
    BLOB --> RETAIN
    WAREHOUSE --> RETAIN

    classDef appNode        fill:#0277bd,stroke:#01579b,stroke-width:2px,color:#fff,font-size:13px
    classDef apiNode        fill:#7b1fa2,stroke:#4a148c,stroke-width:2px,color:#fff,font-size:13px
    classDef middlewareNode fill:#37474f,stroke:#1f2937,stroke-width:2px,color:#fff,font-size:13px
    classDef redactNode     fill:#c1440e,stroke:#7c2d12,stroke-width:3px,color:#fff,font-size:13px
    classDef cleanNode      fill:#16a34a,stroke:#14532d,stroke-width:3px,color:#fff,font-size:13px
    classDef dimNode        fill:#e2e8f0,stroke:#94a3b8,stroke-width:1px,color:#94a3b8,font-size:12px
    classDef storeNode      fill:#2e7d32,stroke:#14532d,stroke-width:2px,color:#fff,font-size:13px
    classDef retainNode     fill:#a16207,stroke:#713f12,stroke-width:2px,color:#fff,font-size:13px
    linkStyle default stroke:#64748b,stroke-width:2px,font-size:12px
`;
}

// Sample raw values used to compose the JSONL log line
const SAMPLE_PROMPT_PII = "Hi, I am Alice Chen. My email is alice.chen@example.com and my phone is 415-555-0123. Please draft a follow-up to my account manager.";
const SAMPLE_PROMPT_CLEAN = "Please summarize the attached quarterly report and highlight three risks the executive team should monitor going into the next quarter.";

function redact(text) {
    return text
        .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[REDACTED_EMAIL]')
        .replace(/\b\d{3}-\d{3}-\d{4}\b/g, '[REDACTED_PHONE]')
        .replace(/\bAlice Chen\b/g, '[REDACTED_NAME]');
}

function truncateText(text, nTokens) {
    // 1 token ~ 4 chars; cap displayed text accordingly
    const charCap = nTokens * 4;
    if (text.length <= charCap) return text;
    return text.slice(0, charCap) + '...';
}

function buildLogLine(piiDetected, truncTokens) {
    const promptRaw = piiDetected ? SAMPLE_PROMPT_PII : SAMPLE_PROMPT_CLEAN;
    const promptDisplayed = piiDetected ? redact(promptRaw) : truncateText(promptRaw, truncTokens);
    const inputTokens  = Math.round(promptRaw.length / 4);
    const outputTokens = 180;
    const inputPrice  = 3.0 / 1e6;   // $/token
    const outputPrice = 15.0 / 1e6;  // $/token
    const costUsd = inputTokens * inputPrice + outputTokens * outputPrice;

    return {
        ts: "2026-04-25T14:32:07.412Z",
        trace_id: "tr_8c4f2a91",
        span_id: "sp_4e7b15",
        session_id: "sess_9c2a08e1",
        request_id: "req_b412ff2c",
        user_id: "usr_72ad",
        feature: "exec_summary",
        model: "claude-sonnet-4.5",
        prompt_hash: "9af2c7b81e4d6315",
        prompt_truncated_tokens: truncTokens,
        prompt: promptDisplayed,
        pii_redacted: piiDetected,
        usage: {
            input_tokens: inputTokens,
            output_tokens: outputTokens,
            cache_read_tokens: 0,
            cache_write_tokens: 0
        },
        cost_usd: parseFloat(costUsd.toFixed(6)),
        latency_ms: 1842,
        retention_days: 90
    };
}

function syntaxHighlight(obj) {
    let json = JSON.stringify(obj, null, 2);
    // Escape HTML
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    // Highlight keys, strings, numbers, booleans
    json = json.replace(/"([^"\\]*)":/g, '<span class="key">"$1"</span>:');
    json = json.replace(/: "(\[REDACTED_[A-Z]+\])"/g, ': <span class="redacted">"$1"</span>');
    json = json.replace(/: "([^"\\]*)"/g, ': <span class="str">"$1"</span>');
    json = json.replace(/: (-?\d+\.?\d*)/g, ': <span class="num">$1</span>');
    json = json.replace(/: (true|false)/g, ': <span class="bool">$1</span>');
    json = json.replace(/: (null)/g, ': <span class="null">$1</span>');
    return json;
}

async function renderDiagram(piiDetected) {
    const source = buildDiagram(piiDetected);
    const container = document.getElementById('mermaidContainer');
    container.removeAttribute('data-processed');
    container.innerHTML = source;
    if (window.mermaid) {
        try {
            await window.mermaid.run({ nodes: [container] });
        } catch (e) {
            console.error('Mermaid render error:', e);
        }
    }
}

function refresh() {
    const piiDetected = document.getElementById('piiToggle').checked;
    const truncTokens = parseInt(document.getElementById('truncSlider').value, 10);
    document.getElementById('truncVal').textContent = truncTokens;
    renderDiagram(piiDetected);
    const log = buildLogLine(piiDetected, truncTokens);
    document.getElementById('logOutput').innerHTML = syntaxHighlight(log);
}

function waitForMermaid() {
    if (window.mermaid && typeof window.mermaid.run === 'function') {
        document.getElementById('piiToggle').addEventListener('change', refresh);
        document.getElementById('truncSlider').addEventListener('input', refresh);
        refresh();
    } else {
        setTimeout(waitForMermaid, 50);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', waitForMermaid);
} else {
    waitForMermaid();
}

// RAG Pipeline Cost Annotations - Mermaid
// CANVAS_HEIGHT: 600
// Bloom Level: Analyze (L4) - examine
// LO: Examine where in the RAG pipeline retrieved tokens accumulate.

const TOKENS_PER_CHUNK = 300;     // average chunk size in tokens
const PRICE_INPUT_PER_M = 3.00;   // $3 per MTok input (Sonnet-class)
const PRICE_OUTPUT_PER_M = 15.00; // $5x of input
const PRICE_RERANKER_PER_Q = 0.001; // ~$0.001 per query
const SYS_PROMPT = 1500;
const USER_QUERY = 100;
const OUTPUT_TOKENS = 600;

function fmt$(v) { return '$' + v.toFixed(4); }

function buildDiagram(K, N, rerankerOn, pruningOn) {
    const effN = rerankerOn ? N : K;          // if reranker off, K chunks pass through
    const finalChunks = pruningOn ? Math.max(1, Math.ceil(effN * 0.6)) : effN;
    const injectedTokens = finalChunks * TOKENS_PER_CHUNK;
    const llmInput = SYS_PROMPT + injectedTokens + USER_QUERY;
    const llmInputCost  = llmInput * PRICE_INPUT_PER_M / 1e6;
    const llmOutputCost = OUTPUT_TOKENS * PRICE_OUTPUT_PER_M / 1e6;
    const rerankerCost  = rerankerOn ? PRICE_RERANKER_PER_Q : 0;
    const totalCost     = rerankerCost + llmInputCost + llmOutputCost;

    return {
        diagram: `
flowchart LR
    Q["Query<br/>(${USER_QUERY} tokens)"]:::cheap
    Embed["Embed query<br/>(cheap embedding API)<br/>~$0.00001"]:::cheap
    VS["Vector search<br/>top-K = ${K}<br/>${K} chunks × ${TOKENS_PER_CHUNK} tok = ${(K*TOKENS_PER_CHUNK).toLocaleString()} tok candidate<br/>~$0 (vector DB)"]:::cheap
    RR["Reranker<br/>${rerankerOn ? 'narrows to top-N = ' + N : 'DISABLED — all K passed through'}<br/>${rerankerOn ? '~' + fmt$(rerankerCost) : '$0'}"]:::${rerankerOn ? 'rerank' : 'cheap'}
    PR["Context pruning<br/>${pruningOn ? 'drops low-score chunks → ' + finalChunks + ' chunks' : 'DISABLED'}<br/>~$0"]:::cheap
    INJ["Context injection<br/>${finalChunks} chunks × ${TOKENS_PER_CHUNK} tok = ${injectedTokens.toLocaleString()} injected tokens"]:::cheap
    LLM["LLM generation<br/>Input: ${llmInput.toLocaleString()} tok = ${fmt$(llmInputCost)}<br/>Output: ${OUTPUT_TOKENS} tok = ${fmt$(llmOutputCost)}"]:::main
    Total(["TOTAL: ${fmt$(totalCost)} per query"]):::total

    Q --> Embed --> VS --> RR --> PR --> INJ --> LLM --> Total

    classDef cheap fill:#0277bd,stroke:#01579b,stroke-width:2px,color:#fff,font-size:12px
    classDef rerank fill:#7b1fa2,stroke:#4a148c,stroke-width:2px,color:#fff,font-size:12px
    classDef main fill:#c1440e,stroke:#7c2d12,stroke-width:2px,color:#fff,font-size:12px
    classDef total fill:#2e7d32,stroke:#14532d,stroke-width:2px,color:#fff,font-size:13px
    linkStyle default stroke:#64748b,stroke-width:2px,font-size:11px
`,
        nodeContent: {
            Q: { title: 'Query', body: `User query is ${USER_QUERY} tokens. This is a cheap input — the cost driver is what we *retrieve* and inject in response.` },
            Embed: { title: 'Embed query', body: 'Separate cheap embedding API call (e.g. OpenAI text-embedding-3-small). Costs ~$0.00001 per query at typical rates. Negligible.' },
            VS: { title: 'Vector search', body: `Returns top-K = ${K} chunks from the vector DB. The vector DB itself charges per query, not per token, so increasing K barely changes vector search cost. The cost downstream is what matters.` },
            RR: { title: 'Reranker', body: rerankerOn ? `Cross-encoder reranker narrows ${K} → ${N}. Costs ~$0.001 per query. The savings come from passing fewer tokens to the main LLM downstream.` : `Reranker DISABLED — all ${K} chunks pass through to context injection. This typically inflates injected tokens 4-10×.` },
            PR: { title: 'Context pruning', body: pruningOn ? `Drops chunks below a relevance score threshold. ${finalChunks} chunks survive. A real production tuning lever.` : 'Pruning DISABLED — all reranker output goes through. Less effective tuning, more waste.' },
            INJ: { title: 'Context injection', body: `${finalChunks} chunks × ${TOKENS_PER_CHUNK} tokens = ${injectedTokens.toLocaleString()} injected tokens. This is the dominant cost lever in RAG: every chunk costs roughly the price of the chunk's tokens at LLM input rate.` },
            LLM: { title: 'LLM generation', body: `Input cost = (system prompt + injected context + query) × $${PRICE_INPUT_PER_M}/MTok. Output cost = ${OUTPUT_TOKENS} tokens × $${PRICE_OUTPUT_PER_M}/MTok. Together these dominate the bill.` },
            Total: { title: 'Total cost per query', body: `Reranker + LLM input + LLM output = ${fmt$(totalCost)}. Move the K and N sliders to see how this changes — and compare with reranker / pruning disabled.` }
        }
    };
}

let currentContent = {};

async function renderDiagram() {
    const K = parseInt(document.getElementById('kSlider').value);
    const N = parseInt(document.getElementById('nSlider').value);
    const rerankerOn = document.getElementById('rerankerOn').checked;
    const pruningOn = document.getElementById('pruningOn').checked;
    document.getElementById('kVal').textContent = K;
    document.getElementById('nVal').textContent = N;
    const { diagram, nodeContent } = buildDiagram(K, N, rerankerOn, pruningOn);
    currentContent = nodeContent;
    const container = document.getElementById('mermaidContainer');
    container.removeAttribute('data-processed');
    container.innerHTML = diagram;
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
    const c = currentContent[id]; if (!c) return;
    panel().innerHTML = `<div class="info-title">${c.title}</div><div class="info-body">${c.body}</div>`;
}
function resetContent() {
    panel().innerHTML = '<div class="info-placeholder">Hover any stage to see cost details. Move the K and N sliders to see how injected token count changes.</div>';
}
function extractNodeId(domId) { const m = domId.match(/flowchart-([A-Za-z0-9_]+)-/); return m ? m[1] : null; }
function setupNodeHover() {
    document.querySelectorAll('#mermaidContainer .node').forEach(node => {
        const nid = extractNodeId(node.id);
        if (nid && currentContent[nid]) {
            node.addEventListener('mouseenter', e => { renderContent(nid); positionPanel(e); });
            node.addEventListener('mousemove', positionPanel);
            node.addEventListener('mouseleave', resetContent);
        }
    });
}
function waitForMermaid() {
    if (window.mermaid && typeof window.mermaid.run === 'function') {
        ['kSlider', 'nSlider', 'rerankerOn', 'pruningOn'].forEach(id => {
            document.getElementById(id).addEventListener('input', renderDiagram);
            document.getElementById(id).addEventListener('change', renderDiagram);
        });
        renderDiagram();
    } else { setTimeout(waitForMermaid, 50); }
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', waitForMermaid);
else waitForMermaid();

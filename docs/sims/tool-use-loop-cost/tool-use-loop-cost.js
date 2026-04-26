// Tool Use Loop with Cost Annotations - Mermaid sequence diagram
// CANVAS_HEIGHT: 720
// Bloom Level: Analyze (L4) - examine
// Learning objective: Examine how tool-use loops accumulate input tokens
// (the entire prior conversation is re-sent on every turn) and identify the
// tool definitions and system prompt as cache targets.

// Per-message token sizing assumptions (illustrative round numbers)
const SYS_PROMPT = 5000;     // system prompt tokens
const TOOLS_DEF  = 1000;     // tool definitions tokens
const USER_Q     = 50;       // user question tokens
const TOOL_CALL  = 30;       // assistant turn that emits a tool_use block
const TOOL_RESULT = 50;      // tool_result block size
const FINAL_OUT  = 200;      // final assistant text response

// Pricing multipliers (relative to base input price)
const P_INPUT       = 1.0;
const P_CACHE_WRITE = 1.25;
const P_CACHE_READ  = 0.10;
const P_OUTPUT      = 5.0;

// Build the sequence diagram source for N tool-use iterations
function buildDiagram(iterations, showCacheSavings) {
    const lines = [];
    lines.push('sequenceDiagram');
    lines.push('participant App as Application');
    lines.push('participant Claude as Claude (Model)');

    // Cumulative tokens
    let cumCachedIn = 0;   // cached input portion
    let cumUncachedIn = 0; // uncached input portion
    let cumOutput = 0;
    let cumCacheWrite = 0; // cache write tokens (paid 1.25x once)

    // Turn 1: initial app -> claude with system prompt + tools + user question
    cumCacheWrite += SYS_PROMPT + TOOLS_DEF; // first time we write the cache
    cumUncachedIn += USER_Q;
    lines.push(
        `App->>Claude: System (${SYS_PROMPT}t cache write) + Tools (${TOOLS_DEF}t cache write) + User Q (${USER_Q}t)`
    );
    lines.push(`Note right of Claude: Cum cached: ${cumCachedIn}t  uncached: ${cumUncachedIn}t  out: ${cumOutput}t`);

    // Turn 1 response: tool call
    cumOutput += TOOL_CALL;
    lines.push(`Claude-->>App: Tool call: get_weather("Paris")  (${TOOL_CALL}t output)`);

    // Iterations 2..N: each one re-sends the whole stack + tool_result, then a tool call
    for (let i = 2; i <= iterations; i++) {
        // App sends: cached(system+tools) + uncached(user_q + previous tool calls + previous tool results) + new tool result
        // Re-sent input each turn (the whole prior context)
        const cachedThisTurn = SYS_PROMPT + TOOLS_DEF;
        // uncached re-send grows by previous turn's tool_call + tool_result
        const uncachedReSend = USER_Q + (i - 1) * (TOOL_CALL + TOOL_RESULT);
        cumCachedIn += cachedThisTurn;
        cumUncachedIn += uncachedReSend;

        const isFinal = (i === iterations);
        const stepLabel = isFinal
            ? `Re-sent ${cachedThisTurn}t cached + ${uncachedReSend}t uncached + tool_result (${TOOL_RESULT}t)`
            : `Re-sent ${cachedThisTurn}t cached + ${uncachedReSend}t uncached + tool_result (${TOOL_RESULT}t)`;
        lines.push(`App->>Claude: ${stepLabel}`);
        lines.push(`Note right of Claude: Cum cached: ${cumCachedIn}t  uncached: ${cumUncachedIn}t  out: ${cumOutput}t`);

        if (isFinal) {
            cumOutput += FINAL_OUT;
            lines.push(`Claude-->>App: Final answer text (${FINAL_OUT}t output)`);
        } else {
            cumOutput += TOOL_CALL;
            const toolName = i === 2 ? 'get_forecast("Paris")' : `lookup_step_${i}`;
            lines.push(`Claude-->>App: Tool call: ${toolName}  (${TOOL_CALL}t output)`);
        }
    }

    // If only 1 iteration, finalize with a final response
    if (iterations === 1) {
        cumOutput += FINAL_OUT;
        lines.push(`App->>Claude: tool_result (${TOOL_RESULT}t) re-sent on prior context`);
        cumUncachedIn += TOOL_RESULT;
        cumCachedIn += SYS_PROMPT + TOOLS_DEF;
        lines.push(`Note right of Claude: Cum cached: ${cumCachedIn}t  uncached: ${cumUncachedIn}t  out: ${cumOutput}t`);
        lines.push(`Claude-->>App: Final answer (${FINAL_OUT}t output)`);
    }

    // Compute effective cost units
    const effective =
        cumCacheWrite * P_CACHE_WRITE +
        cumCachedIn   * P_CACHE_READ  +
        cumUncachedIn * P_INPUT       +
        cumOutput     * P_OUTPUT;
    // No-cache cost: every turn pays full input price for everything that would have been cached
    const totalIn = cumCacheWrite + cumCachedIn + cumUncachedIn;
    const noCache = totalIn * P_INPUT + cumOutput * P_OUTPUT;

    return {
        diagramText: lines.join('\n'),
        totals: {
            cachedIn: cumCachedIn,
            uncachedIn: cumUncachedIn,
            output: cumOutput,
            cacheWrite: cumCacheWrite,
            effective,
            noCache,
            savings: noCache > 0 ? Math.round((1 - effective / noCache) * 100) : 0
        }
    };
}

async function renderDiagram() {
    const iter = +document.getElementById('iterSlider').value;
    document.getElementById('iterVal').textContent = iter;
    const showCache = document.getElementById('cacheToggle').checked;

    const { diagramText, totals } = buildDiagram(iter, showCache);
    const container = document.getElementById('mermaidContainer');
    container.removeAttribute('data-processed');
    container.innerHTML = diagramText;
    if (window.mermaid) {
        try {
            await window.mermaid.run({ nodes: [container] });
        } catch (e) {
            console.error('Mermaid render error:', e);
        }
    }

    // Update running total panel
    const fmt = (n) => n.toLocaleString('en-US');
    document.getElementById('cumCached').textContent   = fmt(totals.cachedIn);
    document.getElementById('cumUncached').textContent = fmt(totals.uncachedIn);
    document.getElementById('cumOutput').textContent   = fmt(totals.output);
    document.getElementById('cumEffective').textContent = fmt(Math.round(totals.effective));
    document.getElementById('cumNoCache').textContent  = fmt(Math.round(totals.noCache));
    document.getElementById('cumSavings').textContent  = totals.savings + '%';

    // Apply visual filter when "show cache savings" off (gray out cache lines)
    const svg = container.querySelector('svg');
    if (svg) {
        if (!showCache) {
            svg.querySelectorAll('.messageText').forEach(t => {
                if (t.textContent.includes('cache')) t.style.opacity = '0.35';
            });
        }
    }
}

function waitForMermaid() {
    if (window.mermaid && typeof window.mermaid.run === 'function') {
        renderDiagram();
        document.getElementById('iterSlider').addEventListener('input', renderDiagram);
        document.getElementById('cacheToggle').addEventListener('change', renderDiagram);
    } else {
        setTimeout(waitForMermaid, 50);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', waitForMermaid);
} else {
    waitForMermaid();
}

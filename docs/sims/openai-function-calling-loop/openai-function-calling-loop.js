// Function Calling Loop with Tool Choice - Mermaid sequence diagram
// CANVAS_HEIGHT: 640
// Bloom Level: Apply (L3) - implement
// Learning objective: Implement a function-calling round-trip and choose
// the right tool_choice setting based on whether the request needs to call a tool.

// Diagrams keyed by tool_choice mode
function buildDiagram(mode, showCost) {
    const c = (label, tokens) => showCost ? `${label} <br/> ~${tokens} tokens` : label;
    const lines = [];
    lines.push('sequenceDiagram');
    lines.push('participant App as Application');
    lines.push('participant API as OpenAI API');
    lines.push('participant Tool as Tool / Function');

    if (mode === 'auto') {
        lines.push(`App->>API: ${c('messages + tools[] + tool_choice="auto"', 1500)}`);
        lines.push(`API-->>App: ${c('assistant.tool_calls = [get_weather({"city":"Paris"})]', 80)}`);
        lines.push(`App->>Tool: ${c('invoke get_weather("Paris")', 0)}`);
        lines.push(`Tool-->>App: ${c('{"temp_c": 14, "cond": "rainy"}', 30)}`);
        lines.push(`App->>API: ${c('messages + assistant + tool message (result)', 1700)}`);
        lines.push(`API-->>App: ${c('assistant text: "It\\u0027s 14C and rainy in Paris."', 50)}`);
    } else if (mode === 'none') {
        lines.push(`App->>API: ${c('messages + tools[] + tool_choice="none"', 1500)}`);
        lines.push('Note over API: tools array sent for context but model is forbidden to call them');
        lines.push(`API-->>App: ${c('assistant text response only (no tool_calls)', 80)}`);
        lines.push('Note over App: Two-message round trip; tools array is wasted tokens unless model needs to know about them');
    } else if (mode === 'required') {
        lines.push(`App->>API: ${c('messages + tools[] + tool_choice="required"', 1500)}`);
        lines.push('Note over API: model is forced to call SOME tool, even on a question that does not need one');
        lines.push(`API-->>App: ${c('assistant.tool_calls = [some_tool({...})]  (forced)', 80)}`);
        lines.push(`App->>Tool: ${c('invoke whichever tool was chosen', 0)}`);
        lines.push(`Tool-->>App: ${c('result (possibly nonsense for this question)', 30)}`);
        lines.push(`App->>API: ${c('messages + assistant + tool message', 1700)}`);
        lines.push(`API-->>App: ${c('final assistant text (now grounded in unwanted tool result)', 50)}`);
    } else if (mode === 'specific') {
        lines.push(`App->>API: ${c('messages + tools[] + tool_choice={"function":"get_weather"}', 1500)}`);
        lines.push('Note over API: model is forced to call exactly get_weather');
        lines.push(`API-->>App: ${c('assistant.tool_calls = [get_weather({"city":"Paris"})]', 80)}`);
        lines.push(`App->>Tool: ${c('invoke get_weather("Paris")', 0)}`);
        lines.push(`Tool-->>App: ${c('{"temp_c": 14, "cond": "rainy"}', 30)}`);
        lines.push(`App->>API: ${c('messages + assistant + tool message', 1700)}`);
        lines.push(`API-->>App: ${c('final assistant text', 50)}`);
    }
    return lines.join('\n');
}

const EXPLAIN = {
    auto: '<strong>auto</strong> (default) — the model decides whether to call a tool. Best when the question may or may not need a tool. The model sees the tools array and emits a tool_call only when its training judges one is needed.',
    none: '<strong>none</strong> — tools are sent (so the model can reason about their existence) but the model is forbidden to call them. Always returns a text message in a single round trip.',
    required: '<strong>required</strong> — the model MUST emit a tool_call, even on a question that would not normally call one. Useful when you have decided externally that a tool call is necessary, but it can produce nonsensical calls on simple chitchat.',
    specific: '<strong>specific tool</strong> — the model MUST call this exact tool. Useful for structured-output use cases (where you treat the tool schema as a JSON Schema) and for forcing a particular path during testing.'
};

const WHEN = {
    auto: 'Default for general chat with optional tool support. The cheapest option when most questions do not need a tool, because two of the four turns drop out.',
    none: 'When you already know the answer should be conversational (e.g., greeting), or when you want the model to mention tools without invoking them. The tools array still costs input tokens — consider stripping it instead.',
    required: 'When the application has decided externally that a tool MUST be called. Always 4 round-trip steps. Beware: the model will call the closest-matching tool even if no tool actually fits the question.',
    specific: 'For structured-output extraction (define a schema as a tool, force it). Always 4 steps. Cleaner than "required" because the model has no ambiguity about which tool to call.'
};

const COST = {
    auto: { roundTrips: 2, mayShortCircuit: true,
            note: 'auto can finish in 2 messages if the model decides no tool is needed.' },
    none: { roundTrips: 1, mayShortCircuit: false,
            note: 'one request and one response. tools array is sent but unused by the model.' },
    required: { roundTrips: 2, mayShortCircuit: false,
                note: 'always two round trips because the model must call a tool even on simple questions.' },
    specific: { roundTrips: 2, mayShortCircuit: false,
                note: 'always two round trips. cleanest path for forced single-tool flows.' }
};

async function render() {
    const mode = document.getElementById('toolChoice').value;
    const showCost = document.getElementById('costToggle').checked;

    const src = buildDiagram(mode, showCost);
    const container = document.getElementById('mermaidContainer');
    container.removeAttribute('data-processed');
    container.innerHTML = src;
    if (window.mermaid) {
        try { await window.mermaid.run({ nodes: [container] }); }
        catch (e) { console.error(e); }
    }

    document.getElementById('explainBox').innerHTML = EXPLAIN[mode];
    document.getElementById('whenBox').innerHTML = WHEN[mode];

    const cost = COST[mode];
    const inputPerCall = 1500;
    const outputPerCall = mode === 'none' ? 80 : 130; // total output on this round trip
    const callsToAPI = mode === 'none' ? 1 : 2;
    const totalIn = inputPerCall * callsToAPI + (mode === 'none' ? 0 : 200);
    const totalOut = outputPerCall;
    const cb = document.getElementById('costBox');
    cb.innerHTML = `
        <div class="cost-row"><span>Round trips to API:</span> <span>${callsToAPI}</span></div>
        <div class="cost-row"><span>Input tokens (approx):</span> <span>${totalIn.toLocaleString()}</span></div>
        <div class="cost-row"><span>Output tokens (approx):</span> <span>${totalOut.toLocaleString()}</span></div>
        <div class="cost-divider"></div>
        <div class="cost-row total"><span>Note:</span> <span style="text-align:right; font-family:Arial; font-weight:400; font-size:11px;">${cost.note}</span></div>
    `;
}

function waitForMermaid() {
    if (window.mermaid && typeof window.mermaid.run === 'function') {
        render();
        document.getElementById('toolChoice').addEventListener('change', render);
        document.getElementById('costToggle').addEventListener('change', render);
    } else {
        setTimeout(waitForMermaid, 50);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', waitForMermaid);
} else {
    waitForMermaid();
}

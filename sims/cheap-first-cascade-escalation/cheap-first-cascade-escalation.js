// Cheap-First Cascade with Escalation - Mermaid flowchart
// CANVAS_HEIGHT: 600
// Bloom Level: Apply (L3) - implement
// Learning objective: Implement a cheap-first cascade with appropriate
// escalation triggers and quantify the expected cost savings.

(function () {
    'use strict';

    const COSTS = {
        haiku: 0.001,
        sonnet: 0.005, // marginal, on top of haiku
        opus: 0.020    // marginal, on top of sonnet
    };

    const state = {
        cheapPct: 0.80,
        confThresh: 2.0,
        opusOn: true,
        costOn: true
    };

    function diagramSource() {
        const opusOn = state.opusOn;
        const cheap = (state.cheapPct * 100).toFixed(0);
        const son = ((1 - state.cheapPct) * 0.90 * 100).toFixed(1);
        const opus = ((1 - state.cheapPct) * 0.10 * 100).toFixed(1);

        const opusBranch = opusOn ? `
    G2{"Quality gate?"}:::gate
    L_Sonnet["Return Sonnet response<br/>cost: $0.001 + $0.005 = $0.006"]:::okMid
    L_Opus["Escalate to Opus<br/>$0.020<br/>cost: $0.001 + $0.005 + $0.020 = $0.026"]:::expensive
    Sonnet -->|"Quality check"| G2
    G2 -->|"pass (~${(0.90 * 100).toFixed(0)}% of escalations)"| L_Sonnet
    G2 -->|"fail (~${(0.10 * 100).toFixed(0)}%)"| L_Opus` : `
    L_SonnetOnly["Return Sonnet response<br/>cost: $0.001 + $0.005 = $0.006"]:::okMid
    Sonnet --> L_SonnetOnly`;

        return `
flowchart TD
    Start(["User request"]):::start
    Cheap["Send to cheap model (Haiku)<br/>$0.001"]:::cheap
    G1{"Quality gate<br/>format / confidence / length"}:::gate
    L_Cheap["Return cheap response<br/>cost: $0.001"]:::okCheap
    Sonnet["Escalate to Sonnet<br/>$0.005"]:::mid

    Start --> Cheap
    Cheap --> G1
    G1 -->|"all pass (~${cheap}%)"| L_Cheap
    G1 -->|"any fail (~${(100 - +cheap).toFixed(0)}%)"| Sonnet
    ${opusBranch}

    classDef start fill:#0277bd,stroke:#01579b,stroke-width:2px,color:#fff,font-size:13px
    classDef cheap fill:#2e7d32,stroke:#14532d,stroke-width:2px,color:#fff,font-size:13px
    classDef gate fill:#f9a825,stroke:#a16207,stroke-width:2px,color:#1f2937,font-size:13px
    classDef okCheap fill:#a5d6a7,stroke:#2e7d32,stroke-width:2px,color:#1f2937,font-size:13px
    classDef mid fill:#fb923c,stroke:#c2410c,stroke-width:2px,color:#fff,font-size:13px
    classDef okMid fill:#fdba74,stroke:#c2410c,stroke-width:2px,color:#1f2937,font-size:13px
    classDef expensive fill:#c62828,stroke:#7f1d1d,stroke-width:2px,color:#fff,font-size:13px

    linkStyle default stroke:#64748b,stroke-width:2px,font-size:12px
`;
    }

    function expectedCost() {
        const pCheap = state.cheapPct;
        const pAfterCheap = 1 - pCheap;
        const pSon = state.opusOn ? pAfterCheap * 0.90 : pAfterCheap;
        const pOpus = state.opusOn ? pAfterCheap * 0.10 : 0;

        // Cumulative cost paths:
        const cCheap = COSTS.haiku;
        const cSon = COSTS.haiku + COSTS.sonnet;
        const cOpus = COSTS.haiku + COSTS.sonnet + COSTS.opus;

        const e = pCheap * cCheap + pSon * cSon + pOpus * cOpus;
        return { e, pCheap, pSon, pOpus, cCheap, cSon, cOpus };
    }

    async function render() {
        const container = document.getElementById('mermaidContainer');
        container.removeAttribute('data-processed');
        container.innerHTML = diagramSource();
        if (window.mermaid) {
            try {
                await window.mermaid.run({ nodes: [container] });
            } catch (e) {
                console.error('Mermaid render error:', e);
            }
        }
        updateReadouts();
    }

    function updateReadouts() {
        const r = expectedCost();
        document.getElementById('cheapPctVal').textContent = (state.cheapPct * 100).toFixed(0);
        document.getElementById('confVal').textContent = state.confThresh.toFixed(1);
        document.getElementById('pCheap').textContent = r.pCheap.toFixed(2);
        document.getElementById('pSon').textContent = r.pSon.toFixed(2);
        document.getElementById('pOpus').textContent = r.pOpus.toFixed(2);
        document.getElementById('cBase').textContent = '$' + COSTS.haiku.toFixed(3);
        document.getElementById('cCascade').textContent = '$' + r.e.toFixed(4);
        const opusBaseline = 0.026;
        document.getElementById('cOpus').textContent = '$' + opusBaseline.toFixed(3);
        const reduction = Math.round((1 - r.e / opusBaseline) * 100);
        document.getElementById('cReduce').textContent = reduction + '%';

        const f = document.getElementById('formula');
        if (state.costOn) {
            f.style.display = 'block';
            if (state.opusOn) {
                f.textContent =
                    'E[cost] = ' + r.pCheap.toFixed(2) + ' × $' + r.cCheap.toFixed(3) +
                    ' + ' + r.pSon.toFixed(2) + ' × $' + r.cSon.toFixed(3) +
                    ' + ' + r.pOpus.toFixed(2) + ' × $' + r.cOpus.toFixed(3) +
                    ' = $' + r.e.toFixed(4);
            } else {
                f.textContent =
                    'E[cost] = ' + r.pCheap.toFixed(2) + ' × $' + r.cCheap.toFixed(3) +
                    ' + ' + r.pSon.toFixed(2) + ' × $' + r.cSon.toFixed(3) +
                    ' = $' + r.e.toFixed(4);
            }
        } else {
            f.style.display = 'none';
        }
    }

    function wire() {
        const cp = document.getElementById('cheapPct');
        const cf = document.getElementById('confSlider');
        const op = document.getElementById('opusToggle');
        const ct = document.getElementById('costToggle');

        cp.addEventListener('input', () => {
            state.cheapPct = (+cp.value) / 100;
            render();
        });
        cf.addEventListener('input', () => {
            state.confThresh = +cf.value;
            // Threshold is purely informative; pass-rate is the real probability knob
            updateReadouts();
        });
        op.addEventListener('change', () => {
            state.opusOn = op.checked;
            render();
        });
        ct.addEventListener('change', () => {
            state.costOn = ct.checked;
            updateReadouts();
        });
    }

    function waitForMermaid() {
        if (window.mermaid && typeof window.mermaid.run === 'function') {
            wire();
            render();
        } else {
            setTimeout(waitForMermaid, 50);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForMermaid);
    } else {
        waitForMermaid();
    }
})();

---
title: Context Window Budget Allocation Over a Long Session
description: Stacked area chart showing how the context window is allocated across components over 200 turns, with compaction events visible as drops in conversation-history allocation.
image: /sims/context-budget-long-session/context-budget-long-session.png
og:image: /sims/context-budget-long-session/context-budget-long-session.png
twitter:image: /sims/context-budget-long-session/context-budget-long-session.png
social:
   cards: false
---

# Context Window Budget Allocation Over a Long Session

<iframe src="main.html" height="562px" width="100%" scrolling="no"></iframe>

[Run the Context Budget MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

A long agent session is not a single context — it is a sequence of contexts, one per turn, each made up of the same five components (system prompt, long-term memory, conversation history, RAG retrieval, output reservation). The job of a context-budget *implementation* is to keep the per-turn total under your chosen threshold across hundreds of turns, without losing the detail the conversation depends on.

This MicroSim runs a 200-turn session under your chosen budget policy and shows the five-component stack evolving turn by turn. Each compaction event appears as a sharp drop in the russet "conversation history" band; a small purple sliver above shows what survived as long-term memory. Toggle "sliding-window only" to see the alternative — older turns simply dropped, with no distillation — and watch the conversation history bounce up and down without growing the long-term memory band.

## How to Use

1. **Start at the defaults.** Threshold 80K, aggressiveness 50%, long-term memory on. Watch the conversation-history band grow until it triggers a compaction; note the moment of the drop, the small bump in the purple LTM band, and the subsequent re-growth of conversation history.
2. **Lower the threshold to 50K.** Compactions fire more often; the LTM band grows faster and detail-loss climbs because more turns are summarized.
3. **Raise the threshold to 150K.** Fewer compactions, larger conversation history, lower detail loss — but per-turn cost roughly doubles. The threshold is a knob on the cost/fidelity tradeoff.
4. **Slide aggressiveness up to 90%.** Each compaction now takes a much bigger bite. Compactions fire less often but each one loses more detail. Note the staircase shape of the conversation-history band.
5. **Toggle on "Sliding-window only".** No long-term memory at all. Conversation history saws up and down between the threshold and the post-drop floor. Detail loss is now monotonically increasing.
6. **Implement your policy.** Pick threshold + aggressiveness + LTM-on/off so that peak tokens stay under your cost budget AND detail-loss stays under your fidelity budget. This is the L3 implementation deliverable.

## Bloom Level

**Apply (L3)** — implement a context window budget that maintains affordable per-turn cost across a session that exceeds 100 turns.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="sims/context-budget-long-session/main.html"
        height="562px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Adult professional learners — engineers and platform-team members designing or operating long-running agent loops where per-session context cost matters.

### Duration

20–25 minutes inside Chapter 16, or 40 minutes as a standalone workshop with the practice scenarios.

### Prerequisites

- Chapter 16 sections on context window components, compaction, sliding window, and long-term memory
- Comfort reading stacked-area charts

### Activities

1. **Anatomy of a turn (5 min).** With defaults, hover any single turn in the chart. Read off the five values from the tooltip. Confirm they sum to the total. The five components are the only places tokens can live in a turn.
2. **Compaction events (5 min).** Find the first compaction event in the default view. Note the conversation-history value before and after. Note the LTM bump. Compute the compression ratio (~10:1 in the simulation).
3. **Threshold-sweep exercise (10 min).** Sweep threshold from 50K to 150K with everything else at default. Record at each threshold: number of compactions, peak total, detail loss. Pick the threshold that keeps peak under 90K AND detail-loss under 30%.
4. **Aggressiveness exercise (5 min).** With threshold at 80K, sweep aggressiveness from 20% to 90%. Notice the qualitative shift: aggressive compaction = fewer events but larger drops; gentle compaction = more events with smaller drops. Discuss which is right for which use case.
5. **The sliding-window comparison (5 min).** Toggle to sliding-window-only mode. Re-run the threshold sweep. Discuss: under what conditions is dropping older content actually preferable to summarizing it?

### Practice Scenarios

| # | Threshold | Aggressiveness | LTM | Sliding-only | Goal |
|---|---|---|---|---|---|
| 1 | 80K | 50% | on | off | Default policy — read peak and detail-loss |
| 2 | 50K | 50% | on | off | Low-cost policy — what does the chart look like? |
| 3 | 120K | 50% | on | off | High-fidelity policy — fewer compactions |
| 4 | 80K | 80% | on | off | Aggressive compaction — fewer but bigger drops |
| 5 | 80K | 50% | off | on | Sliding-window only — note the saw-tooth shape |
| 6 | 80K | 30% | on | off | Gentle compaction — many small events |

### Assessment

A learner has met the L3 objective when, given a target peak-tokens budget and a target detail-loss budget, they can:

- Pick a threshold + aggressiveness + LTM-on/off combination that satisfies both budgets.
- Predict (within one event) how many compactions a 200-turn session will trigger at a given threshold.
- Explain why sliding-window-only mode is rarely the right choice for sessions where decisions span many turns.
- Articulate the cost/fidelity tradeoff that the threshold knob controls.

### Math reference

Per-turn total tokens are the sum of five components:

\[
T(t) = T_{\text{sys}} + T_{\text{ltm}}(t) + T_{\text{conv}}(t) + T_{\text{rag}}(t) + T_{\text{out}}
\]

Each compaction event reduces \( T_{\text{conv}} \) by approximately

\[
\Delta T_{\text{conv}} = \alpha \cdot T_{\text{conv}} \cdot (1 - r)
\]

where \( \alpha \) is the aggressiveness fraction and \( r \approx 0.10 \) is the post-summarization compression ratio. With long-term memory on, a fraction of the lost detail is preserved as durable LTM; without it, that detail is gone.

## References

1. Anthropic Engineering. *Building Effective Agents*. — Discussion of context-window budgeting in long-running agents.
2. The Claude Code documentation — session-level token accounting and compaction policies.
3. OpenAI Cookbook — *Long context handling and conversation summarization*.
4. Lewis, P., et al. (2020). *Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks*. — Background on the RAG component of the per-turn budget.

---

## Senior Instructional Designer Quality Review

*Reviewer perspective: 15+ years designing engineering and data-science curricula for adult professional learners; expertise in Bloom's revised taxonomy, evidence-based assessment design, and accessibility of technical content.*

### Overall verdict

**Strong fit for the stated learning objective. Approve with three follow-ups.** Score: **87/100 (B+).** The five-component stack rendered over 200 turns is the right pedagogical model for a context-budget *implementation* task: the learner sees the result of their policy choices end-to-end, not as a snapshot. The compaction-event signature (conversation history drops, LTM nudges up) is the visual proof that compaction is not the same as forgetting.

### What works (the pedagogy)

1. **Bloom alignment is correct.** L3 "implement" requires the learner to apply a procedure end-to-end. The threshold + aggressiveness + LTM/sliding combination *is* the policy procedure, and the 200-turn run shows the procedure in action. The four readouts (compactions, peak, avg, detail-loss) are the implementation outcomes.
2. **The five-band stack is the right diagram.** Many context-budget explanations show only conversation history vs. system. Pulling out RAG, LTM, and the output reservation as separate bands forces the learner to see that a long session has *five* allocation problems running in parallel, not one.
3. **Compaction events are visible without being annotated.** A learner can find them by eye — the conversation-history band drops sharply. That visual signature is more durable than any text label, and it teaches "what does compaction look like in production telemetry?" — a question the operator role actually has to answer.
4. **The sliding-window toggle teaches by contrast.** Toggling LTM off and sliding-only on produces a qualitatively different chart shape. The saw-tooth pattern in sliding-only mode is a vivid illustration of why dropping older content is worse than distilling it for sessions longer than one short topic.
5. **The detail-loss readout is the missing axis most sims skip.** Token counts are easy; what was *lost* by compaction is the harder question. Surfacing detail-loss as a percentage forces the learner to weigh fidelity against cost, which is the actual L3 implementation tradeoff.
6. **Threshold line drawn on the chart.** The dashed red line at the chosen threshold is a small but important affordance: the learner can see "the chart should never go above this line" as a directly observable constraint, not as a number they have to remember.

### What needs follow-up (the gaps)

1. **No per-turn cost overlay in dollars.** The chapter is about token cost, but the chart only shows tokens. A toggle for "show cumulative \$" or "average cost per turn" would close the bridge from tokens (the metric on the chart) to dollars (the metric the learner's manager cares about). Score impact: −3.
2. **Compactions are deterministic per seed.** Re-running the same parameters always produces the same chart. A real learner would benefit from a "reseed" button that re-rolls the per-turn jitter, so they could see whether the policy is robust to natural variance. Score impact: −2.
3. **The detail-loss model is opaque.** The math reference describes it, but the chart does not show *which* turns contributed to detail loss. A faint highlight or a small "lost" band below the x-axis would make the loss as visible as the gain. Score impact: −2.
4. **No way to inject a "burst" turn.** Real sessions occasionally have a single turn that is much larger than average (a long tool output, a giant pasted document). The simulation has only mild jitter. A "burst" button that spikes turn N's RAG by 10x would teach how the policy behaves under adversarial inputs. Score impact: −2.
5. **The aggressiveness slider mixes two concepts.** "How much of the old content to summarize" and "how compressed the summary is" are conceptually distinct knobs in a real implementation; the sim collapses them into one. A second slider (compression ratio) would let advanced learners explore both dimensions. Score impact: −1.

### Accessibility and clarity

- **Color contrast.** The five band colors (slate, purple, russet, blue, green) all pass WCAG AA against the white plot background at the band-fill opacity used.
- **Color-blind safety.** The purple/russet pairing is the most fragile under deuteranopia, but the spatial stacking order (system always at bottom, output always at top) provides positional redundancy. The legend uses both color and label.
- **Threshold line uses red dash AND text label** — color is not the only channel.
- **Keyboard.** Sliders and checkboxes are keyboard-focusable. The chart itself is not navigable, but the four readouts surface the chart's core conclusions in plain text.
- **The tooltip uses Chart.js's default index mode**, which is accessible to mouse and touch but does not automatically support keyboard. A future revision should add keyboard tooltip activation.

### Cognitive load assessment

- **Five stacked bands + a threshold line + tooltip + four readouts + four controls.** This is at the upper edge of the 7±2 working-memory range. The grouping (chart on top, readouts in the middle, controls at the bottom) and the consistent color mapping between legend and bands keeps it tractable.
- **The long x-axis (200 turns) is the right scale.** Shorter would have hidden the multi-compaction pattern; longer would have crowded the bands.
- **The readouts answer "what changed?" without making the learner re-read the chart**, which keeps working memory available for the *implementation decision* (the L3 work).

### Recommendation

**Approve for use in Chapter 16 as currently implemented.** The five gaps above are real but none of them block the L3 objective. Open follow-up tickets for items 1, 2, and 4 (highest pedagogical impact). Defer items 3 and 5 to a polish pass.

The MicroSim teaches the rule it claims to teach, makes compaction events visible without annotation, and forces the learner to weigh fidelity against cost, which is the real implementation deliverable. Ship.

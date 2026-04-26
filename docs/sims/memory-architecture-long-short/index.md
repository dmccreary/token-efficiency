---
title: Long-Term and Short-Term Memory Architecture
description: Three-column diagram showing how short-term conversation turns flow through compaction into long-term memory files, with a per-turn input flow at the bottom.
image: /sims/memory-architecture-long-short/memory-architecture-long-short.png
og:image: /sims/memory-architecture-long-short/memory-architecture-long-short.png
twitter:image: /sims/memory-architecture-long-short/memory-architecture-long-short.png
social:
   cards: false
---

# Long-Term and Short-Term Memory Architecture

<iframe src="main.html" height="642px" width="100%" scrolling="no"></iframe>

[Run the Memory Architecture MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

Two kinds of memory live inside an LLM agent at the same time, and confusing them is one of the most common reasons agents go off the rails on long sessions. **Short-term memory** is the recent conversation history — every turn included in full, every token paying full per-turn cost, every detail still there. **Long-term memory** is a small set of distilled files (project facts, prior decisions, key learnings) that the agent retrieves selectively, paying only for the few it pulls into a given turn.

This MicroSim shows both at once. Add turns one at a time and watch the short-term stack grow until it crosses your threshold. The compaction step then summarizes the oldest turns into a single new long-term memory file at roughly a 10:1 compression ratio. Below the three columns, a per-turn input flow shows what actually gets sent to the model on the *next* call: system prompt, a couple of selected long-term files, all of short-term, and the new user message — and the cost that comes with that.

## How to Use

1. **Read the default state.** Eight short-term turn cards on the left, three long-term files on the right, and the per-turn input flow at the bottom showing the four components that go into every model call.
2. **Click "Add new turn" until compaction fires.** The new card appears at the bottom of the short-term stack with a brief highlight. When the count crosses the threshold (default 15), the oldest turns flow through the purple "Summarize" node and a new file appears on the right.
3. **Watch the per-turn cost drop after compaction.** Before compaction, short-term holds many turns at ~1K tokens each. After compaction, that block is replaced by a single ~200-token summary file, so the per-turn input shrinks and the cost line goes down.
4. **Try "Manually compact now"** to compact at a chosen moment, not just when the threshold fires. This is the operator's escape hatch when they know the conversation is about to take a turn that needs more headroom.
5. **Move the threshold slider.** A lower threshold means more frequent but smaller compactions; a higher threshold means rarer but larger ones. Watch the same conversation play out under each policy.
6. **Toggle the per-turn cost overlay.** The per-turn cost is the load-bearing number for the chapter; turning it off lets you see the raw flow first, then re-enable it to see what the flow costs.

## Bloom Level

**Understand (L2)** — explain how short-term and long-term memory differ in lifecycle, retrieval, and per-turn token cost.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="sims/memory-architecture-long-short/main.html"
        height="642px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Adult professional learners — engineers and platform-team members new to building agents that need to remember things across many turns.

### Duration

15–20 minutes inside Chapter 16.

### Prerequisites

- Chapter 16 sections on context window, system prompt, and turn-by-turn cost
- Ability to read a horizontal stacked bar chart

### Activities

1. **Anatomy walk-through (3 min).** Identify the three columns and the per-turn input bar. Confirm the three columns map to three lifecycles: every-turn (system), selectively-retrieved (LTM), and accumulating (short-term).
2. **Lifecycle observation (5 min).** Add ten turns one at a time. Note when compaction fires. Observe the size of the new LTM file vs. the size of the turns it replaced.
3. **Cost observation (3 min).** Enable the cost overlay. Add turns and watch the per-turn cost climb until compaction, then drop. The "saw-tooth" cost curve is the signature of a working compaction policy.
4. **Manual compaction discussion (4 min).** Discuss: when would an operator manually compact instead of waiting for the threshold? (Right before a topic switch, before adding a long pasted document, before resuming after a break.)

### Practice Scenarios

| # | Action | Threshold | Predict |
|---|---|---|---|
| 1 | Add 10 turns | 15 | No compaction yet — short-term reaches 18 turns? |
| 2 | Add 10 turns | 12 | Compaction fires once around turn 12 |
| 3 | Click compact now at turn 9 | 15 | One LTM file appears early; per-turn cost drops |
| 4 | Add 20 turns | 20 | Compaction fires around turn 20; one big LTM file |
| 5 | Add 30 turns | 10 | Two compactions; two LTM files; lowest per-turn cost |

### Assessment

A learner has met the L2 objective when they can:

- Name the three lifecycles (every-turn, selectively-retrieved, accumulating) and assign each to one of the three columns.
- Explain why the compaction step reduces per-turn cost in subsequent turns even though the *total* stored content grows.
- Articulate the difference between "dropping" old turns and "summarizing" them.
- Identify one or two situations where a manual compaction is preferable to waiting for the threshold.

### Math reference

Per-turn input tokens are

\[
T_{\text{turn}} = T_{\text{sys}} + T_{\text{ltm-included}} + T_{\text{short-term}} + T_{\text{user}}
\]

A compaction event replaces the oldest \( k \) short-term turns (each averaging \( \bar{t} \) tokens) with one LTM file of \( \rho \cdot k \cdot \bar{t} \) tokens, where \( \rho \approx 0.10 \). On subsequent turns only a few LTM files are retrieved, so the per-turn input drops by approximately

\[
\Delta T_{\text{turn}} \approx k \cdot \bar{t} - \rho \cdot k \cdot \bar{t} = (1 - \rho) \cdot k \cdot \bar{t}
\]

## References

1. Anthropic Engineering. *Building Effective Agents*. — Discussion of memory tiers in long-running agents.
2. The Claude Code documentation — short-term vs. long-term memory and compaction triggers.
3. Park, J. S., et al. (2023). *Generative Agents: Interactive Simulacra of Human Behavior*. — Memory streams and reflection as a model of long-term memory.
4. OpenAI Cookbook — *Long-running conversations and summarization patterns*.

---

## Senior Instructional Designer Quality Review

*Reviewer perspective: 15+ years designing engineering and data-science curricula for adult professional learners; expertise in Bloom's revised taxonomy, evidence-based assessment design, and accessibility of technical content.*

### Overall verdict

**Strong fit for the stated learning objective. Approve as-is for Chapter 16.** Score: **86/100 (B).** The three-column architecture diagram with a per-turn flow underneath is the right pedagogical model for an Understand-level (L2) "explain" task: the structure is visible, the flow is visible, and the lifecycle difference between the two memory tiers is something the learner watches play out, not something they have to imagine.

### What works (the pedagogy)

1. **Bloom alignment is correct.** L2 "explain" requires the learner to put the relationship between two concepts into their own words. The three-column layout externalizes the structure; the compaction step animates the transition; the per-turn flow shows the *consequence* of the architecture. The learner needs all three to give a good explanation.
2. **Three columns map to three lifecycles.** Most tutorials describe short-term and long-term memory in prose; this MicroSim makes the third axis (selective retrieval) the literal middle column. That visual placement is more pedagogically honest than a binary "short vs. long" framing.
3. **The 10:1 compression ratio is annotated, not hidden.** The Summarize node carries a literal "20 turns × 1K tokens → 1 summary × 200 tokens" annotation. A learner walks away with a numerically-anchored intuition for compression, not just a directional one.
4. **Manual compaction as a button, not a hidden behavior.** Surfacing the manual-compact affordance teaches an operator-role pattern (proactive trim) that is invisible if the only path to compaction is hitting the threshold.
5. **Per-turn cost overlay closes the loop.** The chapter cares about cost; the architecture exists to control cost; the cost line at the bottom of the per-turn flow makes the consequence of the architecture visible without requiring a second sim.
6. **Newest turn highlighted briefly on add.** A small UI affordance — but it tells the learner "this is what changed" without making them count the cards.

### What needs follow-up (the gaps)

1. **Compression ratio is hardcoded at 10:1.** Real LLM summaries vary from 5:1 (verbatim notes) to 50:1 (executive bullet). A slider for compression would let the learner explore the cost/fidelity tradeoff inside compaction itself. Score impact: −3.
2. **The "selectively-retrieved" mechanism is implicit.** The MicroSim shows two LTM files marked "included this turn" but does not explain *why* those two — there is no retrieval mechanism shown (semantic search? recency? pinning?). A small legend or hover would close the gap. Score impact: −3.
3. **No way to see what was *lost* in compaction.** The summary tokens are a number, but the learner has no way to inspect the difference between the original and the summary. A toggle that overlays "lost detail" as a faded element would make the cost of compaction visible, not just the cost of context. Score impact: −2.
4. **Reset button is a sledgehammer.** Resetting clears all compaction history, losing the long-term-memory progression the learner just built. A "rewind one step" affordance would let learners undo a turn or compaction. Score impact: −1.
5. **The per-turn flow shows the *next* turn but not historical turns.** A learner cannot see, for the previous five turns, what the per-turn flow looked like — so the cost-drop after compaction is implicit, not explicit. A small sparkline of per-turn cost over recent turns would close this loop. Score impact: −2.

### Accessibility and clarity

- **Color contrast.** Russet on cream (short-term cards), blue on light-blue (LTM cards), and purple on lavender (compaction node) all pass WCAG AA at the font sizes used.
- **Color-blind safety.** The russet/blue/purple palette is robust under deuteranopia and protanopia; the column titles and card labels provide language redundancy.
- **Keyboard.** p5.js native sliders, buttons, and checkboxes are keyboard-focusable and arrow-adjustable. The card stacks themselves are not keyboard-navigable, but no information is hidden behind hover.
- **Animation duration.** The 500–700 ms highlight on add/compact is brief but visible. No flashing or rapid-cycling animation that could trigger photosensitivity issues.

### Cognitive load assessment

- **Three columns + per-turn flow + cost line + event narration + four controls** is dense but spatially well organized. The columns share a uniform shape (frame + title + cards + total), which lets the learner reuse one mental template across all three.
- **The animation on add/compact is a working-memory aid**, not a distraction — it tells the learner where to look.
- **Card stack overflow** is handled by showing only the most recent visible turns; a learner who adds 30 turns sees the latest 10 with the count "Last N turns" updated. This avoids the cognitive load of scrolling but does mean the "what compacted away" is no longer visible — see gap #3.

### Recommendation

**Approve for use in Chapter 16 as currently implemented.** The five gaps above are real but none of them block the L2 objective. Open follow-up tickets for items 2 and 5 (highest pedagogical impact). Defer items 1, 3, and 4 to a polish pass.

The MicroSim teaches the rule it claims to teach, makes the lifecycle difference visible without prose, and closes the cost loop at the bottom of the screen. Ship.

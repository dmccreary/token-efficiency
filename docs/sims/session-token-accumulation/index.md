---
title: Session Token Accumulation
description: Stacked area chart showing how harness sessions accumulate tokens turn by turn — surfacing the quadratic growth of conversation history.
image: /sims/session-token-accumulation/session-token-accumulation.png
og:image: /sims/session-token-accumulation/session-token-accumulation.png
twitter:image: /sims/session-token-accumulation/session-token-accumulation.png
social:
   cards: false
---

# Session Token Accumulation

<iframe src="main.html" height="542px" width="100%" scrolling="no"></iframe>

[Run the MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim
A stacked area chart of cumulative tokens consumed per harness iteration, broken down by source (system prompt, tool definitions, conversation history, tool results, outputs). Two cost overlay lines show no-cache vs with-cache cumulative dollars. The conversation-history band visibly grows *quadratically* with iteration count — every turn re-reads all previous turns.

## How to Use
1. **Default state.** 50 iterations. Look at the orange (conversation history) band — it dominates by iteration ~25.
2. **Disable caching.** Cost overlay lines diverge — caching is essential to keeping long sessions affordable.
3. **Bump average tool result.** The orange band grows even faster (more bytes per turn × triangular sum).
4. **Reduce iterations to 5.** Conversation history is barely visible — sessions are cheap when short.

## Bloom Level
**Analyze (L4)** — examine how harness sessions accumulate tokens turn by turn and identify which components grow linearly vs. quadratically.

## Iframe Embed Code
```html
<iframe src="sims/session-token-accumulation/main.html" height="542px" width="100%" scrolling="no"></iframe>
```

## Lesson Plan

### Audience
Engineers operating coding harnesses (Claude Code, Codex, Antigravity).

### Duration
15–20 minutes inside Chapter 7.

### Prerequisites
Chapter 7 sections on Session Token Accumulation, Per-Session Token Cost, Conversation Compaction.

### Activities
1. **Identify the dominant band (3 min).** At what iteration does conversation history overtake system prompt?
2. **Caching savings (5 min).** Compare cost lines with caching on vs off.
3. **Compaction motivation (5 min).** Notice that the orange band *grows without limit* — this is the structural reason auto-compaction exists.

### Practice Scenarios
| # | Iterations | Sys prompt | Tool result | Caching | Implication |
|---|---|---|---|---|---|
| 1 | 10 | 5K | 200 | on | cheap session |
| 2 | 50 | 8K | 1K | on | conv history dominates |
| 3 | 100 | 8K | 1K | on | needs compaction |
| 4 | 50 | 8K | 1K | off | cost catastrophe |
| 5 | 50 | 20K | 5K | on | even with caching, expensive |

### Assessment
Learner can identify why long sessions get expensive (quadratic conv history), why caching helps (sys prompt amortization), and when to insert compaction.

## References
1. Anthropic Documentation — *Conversation compaction*.
2. Chapter 7 — Conversation History, Conversation Compaction.

---

## Senior Instructional Designer Quality Review

*Reviewer perspective: 15+ years designing engineering curricula for adult professional learners.*

### Overall verdict
**Approve as-is for Chapter 7.** Score: **88/100 (B+).** Stacked area is the right primitive for L4 "examine which components grow at what rate." The quadratic growth of conversation history is THE critical insight, and the chart makes it visceral.

### What works
1. **Bloom alignment.** Decomposing accumulation by source is exactly L4 "examine."
2. **The triangular conversation-history sum.** Visualization shows it; learners feel it without doing the math.
3. **Cost overlay on second axis.** Translates token shape to dollars.

### Gaps
1. **No "compaction event" annotation.** A button to insert a compaction at iteration N — collapsing the conversation band — would teach the remediation. Score impact: −3.
2. **Quadratic vs linear isn't explicitly labeled.** A small "(quadratic)" tag on the conversation series helps. Score impact: −1.
3. **Output growth is shown linear; in reality output sometimes shrinks as agent converges.** Modeling that would teach realism. Score impact: −1.

### Accessibility
Color-blind safe with five distinct hues; legend shows series labels.

### Cognitive load
5 stacked series + 2 overlay lines = 7 series. At the upper edge.

### Recommendation
Approve. Open follow-up for compaction-event button (gap 1).

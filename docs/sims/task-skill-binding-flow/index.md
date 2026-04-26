---
title: Task to Skill Binding Flow
description: Diagram of how a harness decomposes a user request into tasks and binds each to a Skill, with token-cost annotations comparing lazy load vs eager load.
image: /sims/task-skill-binding-flow/task-skill-binding-flow.png
og:image: /sims/task-skill-binding-flow/task-skill-binding-flow.png
twitter:image: /sims/task-skill-binding-flow/task-skill-binding-flow.png
social:
   cards: false
---

# Task to Skill Binding Flow

<iframe src="main.html" height="702px" width="100%" scrolling="no"></iframe>

[Run the MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

This is the load-bearing diagram for the Skills System chapter: how a harness takes a single user request, decomposes it into tasks, and binds each task to a specific Skill — loading only the Skill bodies actually needed. Toggle the eager-load comparison to see the alternative: load every Skill body upfront. The default lazy-load consumes ~7,550 tokens; eager-load consumes ~100,000.

## How to Use

1. **Trace lazy load** (default). Hover the Harness System Prompt to see the ~2,500-token baseline cost (descriptions only, ~50 Skills). Then walk through the three tasks and notice that Tasks 1 and 2 load skill BODIES (~5,000 tokens combined) while Task 3 invokes a bundled script (~50 tokens).
2. **Toggle eager-load.** The diagram collapses: every body is loaded upfront, baseline cost balloons to ~100,000 tokens, and the savings of lazy-load become arithmetic-obvious.
3. **Find the script-delegation win.** Task 3 in the lazy view shows the green script box. Compare its ~50-token cost to the ~2,000 tokens it would have taken to express the same logic as Skill body prose.

## Bloom Level

**Analyze (L4)** — examine how the harness decomposes a user request and binds each task to a Skill, and quantify the token savings vs. an eager-load alternative.

## Iframe Embed Code

```html
<iframe src="sims/task-skill-binding-flow/main.html" height="702px" width="100%" scrolling="no"></iframe>
```

## Lesson Plan

### Audience
Engineers building AI coding harnesses or designing custom Skill libraries.

### Duration
15–20 minutes inside Chapter 8.

### Prerequisites
Chapter 8 sections on Skill, Skill Description, Skill Body, Lazy Skill Loading, Task Decomposition, Task-Skill Binding, Script Delegation.

### Activities
1. **Quantify lazy-load (5 min).** Hover all loaded artifacts in the lazy view. Sum to ~7,550 tokens. Confirm.
2. **Quantify eager-load (5 min).** Toggle on. Note the ~100K. Compute the ratio (~13×).
3. **The script-delegation insight (5 min).** Why does the bundled script cost only ~50 tokens? Discuss: which kinds of work are appropriate to delegate to scripts (deterministic, validation, formatting) vs keep in prose (judgment calls, creative).

### Practice Scenarios

| # | Library size | Tasks needed | Predict lazy total | Predict eager total | Ratio |
|---|---|---|---|---|---|
| 1 | 50 skills, all prose | 2 | ? | ? | ? |
| 2 | 100 skills, all prose | 2 | ? | ? | ? |
| 3 | 50 skills, 1 task uses script | 3 | ? | ? | ? |
| 4 | 50 skills | 10 (every task needs a different skill) | ? | ? | ? |

### Assessment
Learner has met the objective when they can compute lazy vs eager token loads for a given session and identify which tasks should delegate to scripts vs stay as prose Skill bodies.

## References

1. Anthropic Engineering — *Skills as a token-optimization primitive*.
2. The Claude Code documentation — Skill bundle format and lazy-loading semantics.
3. *Building Effective Agents* — discussion of task decomposition patterns.

---

## Senior Instructional Designer Quality Review

*Reviewer perspective: 15+ years designing engineering curricula for adult professional learners.*

### Overall verdict
**Approve as-is for Chapter 8.** Score: **89/100 (B+).** This is the diagram the entire Skills System chapter pivots on, and it teaches the right thing: the savings come from *both* lazy loading AND script delegation, not either one alone.

### What works
1. **Bloom alignment is correct.** L4 "examine" requires the learner to break apart the cost structure. The toggle does exactly that — it splits the cost into base + bound + delegated.
2. **The 13× ratio is the headline number.** Showing ~7,550 vs ~100,000 makes the savings undeniable.
3. **Script delegation gets its own color and called-out node.** The textbook's claim that ~30% of tokens can be saved by script delegation lives or dies on this single diagram surfacing it.
4. **The unloaded "48 of 50 skills stay on disk" framing.** Pedagogically essential — the savings come from what is NOT loaded, not just what is.

### Gaps
1. **No way to vary library size.** A slider for "how many Skills total?" would show that lazy-load benefits scale with library size while eager-load penalties scale superlinearly. Score impact: −3.
2. **Script-vs-prose comparison is one-shot.** A toggle to convert each Task between "skill body" and "bundled script" would show the per-task delegation savings in isolation. Score impact: −2.
3. **No actual dollar amounts.** Tokens are the unit but a "× $X/MTok = $Y per session" annotation would translate to budget language. Score impact: −1.

### Accessibility
Color-blind safe; verdict text in every node.

### Cognitive load
Lazy view: 8 nodes. Eager view: 6 nodes. Tractable.

### Recommendation
Approve. Open follow-up for library-size slider (gap 1).

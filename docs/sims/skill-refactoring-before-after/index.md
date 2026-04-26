---
title: Skill Refactoring Before/After
description: Per-step token cost of a Skill before and after script-delegation refactor; toggle each step to see the cumulative monthly-savings projection.
image: /sims/skill-refactoring-before-after/skill-refactoring-before-after.png
og:image: /sims/skill-refactoring-before-after/skill-refactoring-before-after.png
twitter:image: /sims/skill-refactoring-before-after/skill-refactoring-before-after.png
social:
   cards: false
---

# Skill Refactoring Before/After

<iframe src="main.html" height="542px" width="100%" scrolling="no"></iframe>

[Run the MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim
A 7-step Skill broken down by per-step token cost. Toggle each step's "refactored to script" status — deterministic steps (read inputs, schema validate, hash, lookup, format) drop to ~30 tokens of script invocation; judgment steps (apply judgment, generate output) cannot be scripted. The bottom panel translates the token reduction to monthly dollars at chosen invocation volume.

## How to Use
1. **Read defaults.** 5 of 7 steps refactored — the typical real-world pattern. Note ~50% reduction.
2. **Untoggle a refactored step.** Watch its bar grow back. Decide: would you really want this step in prose form?
3. **Try to refactor a judgment step (you can't).** The judgment-marked steps are disabled — they're the irreducible prose core.
4. **Slide invocation volume.** Watch the monthly dollar number reflect the actual budget impact.

## Bloom Level
**Evaluate (L5)** — justify a Skill refactoring decision by quantifying the per-invocation token reduction.

## Iframe Embed Code
```html
<iframe src="sims/skill-refactoring-before-after/main.html" height="542px" width="100%" scrolling="no"></iframe>
```

## Lesson Plan

### Audience
Engineers maintaining Skill libraries — Anthropic Skills, custom internal Skills, or harness-specific Skill bundles.

### Duration
15–20 minutes inside Chapter 8.

### Prerequisites
Chapter 8 sections on Skill Refactoring, Script Delegation, Token Reduction Ratio.

### Activities
1. **Identify scriptable steps (3 min).** Without toggling, predict which 5 of 7 steps are scriptable.
2. **Refactor analysis (5 min).** Refactor only one step at a time and note the savings. Which scriptable step has the highest leverage?
3. **Justify the refactor (5 min).** With defaults, write a one-paragraph justification including monthly $ savings, engineering effort, and quality risk.

### Practice Scenarios
| # | # steps refactored | Reduction | Monthly @ 100K invocations |
|---|---|---|---|
| 1 | 0 (all prose) | 0% | $0 |
| 2 | 1 (just Step 1) | ? | ? |
| 3 | 5 (default) | ~50% | ? |
| 4 | All scriptable (5 of 7) | ~50% | ? |
| 5 | All scriptable + try judgment (impossible) | ~50% | shown but can't go higher |

### Assessment
Learner has met the objective when they can quantify a Skill refactor's payoff in dollar terms and justify the engineering decision.

## References
1. Chapter 8 — Skill Refactoring, Script Delegation.
2. Anthropic Engineering — *Skills as a token-optimization primitive*.

---

## Senior Instructional Designer Quality Review

*Reviewer perspective: 15+ years designing engineering and platform-engineering curricula for adult professional learners.*

### Overall verdict
**Approve as-is for Chapter 8.** Score: **89/100 (B+).** This sim teaches what the textbook claims about Skill refactoring: ~30% reduction is realistic, but only on the scriptable steps. Disabling judgment-step toggles is exactly the right pedagogical move — it teaches the *limit* of script delegation alongside its power.

### What works
1. **Bloom alignment.** L5 "justify" requires the learner to weigh the engineering cost against the savings. The dollar-number panel makes the justification concrete.
2. **Disabled judgment-step toggles.** Most refactoring discussions over-promise script delegation. Showing that *some* steps cannot be scripted teaches the boundary correctly.
3. **Per-step toggles.** Allows isolating each step's contribution.
4. **Monthly dollar projection.** Translates per-invocation tokens to budget language.

### Gaps
1. **Step costs are illustrative.** A "load my own Skill steps" affordance would generalize. Score impact: −2.
2. **No engineering-cost annotation.** Refactoring takes time; the sim shows only savings. A "engineer-hours to refactor" estimate per step would teach the full ROI calc. Score impact: −2.
3. **No quality risk annotation.** Aggressive script delegation can introduce bugs the prose version would have prevented. A small "quality risk" tag per step would teach realism. Score impact: −1.

### Accessibility
Color-blind safe (gray vs green). Disabled toggles render distinctly.

### Cognitive load
7 step toggles + 2 sliders + chart. At the upper edge but tractable.

### Recommendation
Approve. Open follow-up for engineer-hours overlay (gap 2).

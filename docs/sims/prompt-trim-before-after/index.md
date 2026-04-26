---
title: Prompt Trim Before/After
description: Grouped horizontal bars comparing token counts per prompt section before and after prompt-engineering techniques, with monthly savings projection.
image: /sims/prompt-trim-before-after/prompt-trim-before-after.png
og:image: /sims/prompt-trim-before-after/prompt-trim-before-after.png
twitter:image: /sims/prompt-trim-before-after/prompt-trim-before-after.png
social:
   cards: false
---

# Prompt Trim Before/After

<iframe src="main.html" height="542px" width="100%" scrolling="no"></iframe>

[Run the MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim
A grouped bar chart showing per-section token counts before and after applying four prompt-engineering techniques (system prompt hygiene, schema minimization, few-shot pruning, concise output). Toggle each technique on/off to see incremental contribution. The status banner translates per-request token reduction to monthly dollars at a chosen request volume.

## How to Use
1. **Read the all-on default.** The total reduction is ~50% and the monthly dollar number is the headline.
2. **Toggle techniques off one at a time.** Note that few-shot pruning is the single biggest contributor.
3. **Slide volume.** Reductions that look small per-request become significant at scale.

## Bloom Level
**Evaluate (L5)** — assess the cumulative impact of multiple prompt-engineering techniques on a representative prompt.

## Iframe Embed Code
```html
<iframe src="sims/prompt-trim-before-after/main.html" height="542px" width="100%" scrolling="no"></iframe>
```

## Lesson Plan

### Audience
Engineers reviewing or refactoring production prompts.

### Duration
10–15 minutes inside Chapter 13.

### Prerequisites
Chapter 13 sections on System Prompt Hygiene, Schema Minimization, Few-Shot Pruning, Concise Output Instruction.

### Activities
1. **Identify the biggest lever (3 min).** Toggle each technique off in turn; rank by impact.
2. **Volume sensitivity (5 min).** With all four techniques on, slide volume from 1K to 10M req/mo.
3. **Bring your own prompt (5 min).** Estimate token counts for your team's most-called prompt; apply the four techniques mentally; predict savings.

### Practice Scenarios
| # | Techniques | Total before | Total after | Monthly savings @ 100K |
|---|---|---|---|---|
| 1 | All four | 12,100 | ~7,100 | ? |
| 2 | Only hygiene | 12,100 | ? | ? |
| 3 | Only few-shot pruning | 12,100 | ? | ? |
| 4 | Only output | 12,100 | ? | ? |
| 5 | None | 12,100 | 12,100 | $0 |

### Assessment
Learner can rank techniques by impact and project monthly savings at scale.

## References
1. Chapter 13 — Instruction Compression, Few-Shot Pruning, Schema Minimization.
2. Anthropic Cookbook — *Prompt engineering best practices*.
3. *Reducing token costs in production* — Anthropic engineering blog.

---

## Senior Instructional Designer Quality Review

*Reviewer perspective: 15+ years designing engineering curricula for adult professional learners.*

### Overall verdict
**Approve as-is for Chapter 13.** Score: **87/100 (B+).** Grouped bars with monthly-dollar projection is exactly the framing engineers respond to. The four-technique toggle teaches the additive (not multiplicative) nature of prompt-engineering wins.

### What works
1. **Bloom alignment correct.** L5 "assess" requires weighing options; the toggle structure does that.
2. **Per-section breakdown is the load-bearing pedagogy.** Most teams treat "compress the prompt" as monolithic. Showing where the cuts come from teaches *which* technique applies *where*.
3. **Monthly dollar projection.** Translates abstract token counts to budget-actionable numbers.
4. **Retrieved context section deliberately unchanged.** Reinforces that RAG tuning belongs in a different chapter.

### Gaps
1. **Reductions are illustrative, not adaptive to user prompt size.** A "load my own section sizes" affordance would generalize. Score impact: −3.
2. **No quality regression annotation.** Aggressive few-shot pruning often *does* hurt quality. The sim shows zero quality risk, which is misleading. Score impact: −3.
3. **Volume slider tops out at 10M/mo.** Many production teams are at 100M+. Score impact: −1.

### Accessibility
Color-blind safe (gray vs green with text labels). Status banner reinforces with text.

### Cognitive load
6 sections × 2 series + 4 toggles + slider. At the upper edge but tractable.

### Recommendation
Approve. Open follow-up tickets for quality-risk annotation (gap 2) and user-defined section sizes (gap 1).

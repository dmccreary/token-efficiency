---
title: Prompt Anatomy Budget
description: Stacked bar of prompt components against a budget overlay; sliders adjust component sizes and auto-actions trim aggressively.
image: /sims/prompt-anatomy-budget/prompt-anatomy-budget.png
og:image: /sims/prompt-anatomy-budget/prompt-anatomy-budget.png
twitter:image: /sims/prompt-anatomy-budget/prompt-anatomy-budget.png
social:
   cards: false
---

# Prompt Anatomy Budget

<iframe src="main.html" height="622px" width="100%" scrolling="no"></iframe>

[Run the MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim
A horizontal stacked bar of the six components of a typical production prompt (system prompt, tool definitions, few-shot, retrieved context, user message, output reserve) with a vertical budget marker. Adjust component sliders to see total move; click auto-actions to apply aggressive trims (auto-shrink system prompt, auto-prune few-shot, auto-compress retrieved). The status banner says WITHIN or OVER BUDGET.

## How to Use
1. **Read defaults.** Components sum to 8,000; budget is 8,000. Right at the edge.
2. **Push retrieved context up to 5K.** Watch the bar extend past the budget marker — status flips to OVER BUDGET.
3. **Click Auto-prune few-shot.** Few-shot drops 60%; total comes back under budget.
4. **Drop budget to 4K.** Most defaults are now over. Use auto-actions to fit.

## Bloom Level
**Apply (L3)** — implement a prompt length budget by allocating tokens across components.

## Iframe Embed Code
```html
<iframe src="sims/prompt-anatomy-budget/main.html" height="622px" width="100%" scrolling="no"></iframe>
```

## Lesson Plan

### Audience
Engineers tuning production prompts to a length budget.

### Duration
10–15 minutes inside Chapter 13.

### Prerequisites
Chapter 13 sections on Prompt Length Budget, Instruction Compression, Few-Shot Pruning.

### Activities
1. **Allocate from scratch (5 min).** Set all components to minimum, then add back what you'd actually need to a 4K budget.
2. **Trim to fit (5 min).** Set total to 12K (well over budget); use auto-actions to bring it under 8K.
3. **Discuss the priorities (5 min).** Which components should be trimmed last? (Output reserve and user message are usually inviolable.)

### Practice Scenarios
| # | Scenario | Solution |
|---|---|---|
| 1 | Default 8K budget — over by 100 | Trim System or Few-shot |
| 2 | 4K budget — way over | Auto-prune + auto-shrink |
| 3 | 16K budget — way under | Add few-shot examples or retrieved context |
| 4 | Need to fit 5K of retrieved context | Compress system + drop few-shot |
| 5 | Fixed user message at 1.5K | Squeeze everything else |

### Assessment
Learner can fit a prompt to a budget by trading off components and explaining the reasoning.

## References
1. Chapter 13 — Prompt Length Budget, Instruction Compression.
2. Anthropic Cookbook — *Prompt structure and budget*.

---

## Senior Instructional Designer Quality Review

*Reviewer perspective: 15+ years designing engineering curricula for adult professional learners.*

### Overall verdict
**Approve as-is for Chapter 13.** Score: **86/100 (B+).** Stacked bar with budget marker is the right primitive for L3 "implement a budget." Auto-actions provide an easy demonstration of the standard trim techniques.

### What works
1. **Bloom alignment.** L3 "implement" requires applying a procedure; the budget framing gives a clear procedure.
2. **Auto-actions teach the standard moves.** Without these, learners might invent ad-hoc techniques rather than learn the named ones.
3. **Visual budget overstep.** The red overflow line + status banner makes the failure visceral.

### Gaps
1. **No quality risk shown.** Aggressive few-shot pruning hurts quality; the sim treats trims as free. Score impact: −2.
2. **No "lock this component" affordance.** A real-world budget exercise often has hard constraints (user message can't shrink). Score impact: −2.
3. **Only one scenario.** Loading multiple representative prompt shapes would generalize. Score impact: −2.

### Accessibility
Color-coded components are accompanied by text labels. Native sliders.

### Cognitive load
6 sliders + budget slider + 3 buttons + status banner. At the upper edge but tractable.

### Recommendation
Approve. Open follow-up for component-locking (gap 2).

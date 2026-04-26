---
title: Output Control Settings
description: Five histogram comparison of output token distributions under baseline, max_tokens, stop sequence, concise instruction, and all-combined configurations.
image: /sims/output-control-settings/output-control-settings.png
og:image: /sims/output-control-settings/output-control-settings.png
twitter:image: /sims/output-control-settings/output-control-settings.png
social:
   cards: false
---

# Output Control Settings

<iframe src="main.html" height="542px" width="100%" scrolling="no"></iframe>

[Run the MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim
Five small-multiple histograms of per-response output-token counts under different output-control configurations. Below each histogram: median, average cost-per-response, and (when applicable) truncation rate. Move the max_tokens slider to see how each setting compresses the distribution.

## How to Use
1. **Compare medians.** The combined-all configuration has the lowest median by far.
2. **Watch truncation.** With max_tokens at 200, the +max_tokens histogram has a tall right-edge spike — that's the truncation rate. A high truncation rate means responses are getting cut off mid-thought.
3. **Slide max_tokens up to 4000.** Truncation drops to zero but median tokens stop dropping — the cap stops doing anything useful past the natural distribution mode.

## Bloom Level
**Analyze (L4)** — differentiate the cost impact of each output-control setting and combine them effectively.

## Iframe Embed Code
```html
<iframe src="sims/output-control-settings/main.html" height="542px" width="100%" scrolling="no"></iframe>
```

## Lesson Plan

### Audience
Engineers tuning output-control parameters in production LLM applications.

### Duration
10–15 minutes inside Chapter 17.

### Prerequisites
Chapter 17 sections on Max Tokens Setting, Stop Sequence Setting, Concise Output Instruction, Truncation Detection.

### Activities
1. **Per-setting impact (5 min).** Compare each non-baseline panel to the baseline. Note each setting contributes a distinct shape change.
2. **Truncation tradeoff (5 min).** Slide max_tokens from 4000 to 100. Watch truncation rate climb. Discuss: at what truncation rate does the savings stop being worth the user-perceived clipping?
3. **Combined effect (5 min).** All-combined isn't simply additive — settings interact (concise reduces tokens which makes max_tokens less likely to fire).

### Practice Scenarios
| # | Setting | Median | Truncation | Cost reduction |
|---|---|---|---|---|
| 1 | Baseline | ? | 0 | reference |
| 2 | +max_tokens=500 | ? | ? | ? |
| 3 | +stop sequence | ? | 0 | ? |
| 4 | +concise instruction | ? | 0 | ? |
| 5 | +all combined | ? | ? | ? |

### Assessment
Learner can choose the right combination of output controls for a given workload, weighing cost reduction against truncation rate.

## References
1. Anthropic Documentation — *Stop sequences and max tokens*.
2. OpenAI Documentation — *max_tokens parameter*.
3. Chapter 17 — Concise Output Instruction.

---

## Senior Instructional Designer Quality Review

*Reviewer perspective: 15+ years designing engineering curricula for adult professional learners.*

### Overall verdict
**Approve as-is for Chapter 17.** Score: **86/100 (B+).** Small-multiple histograms are the right primitive for L4 "differentiate" — comparison demands side-by-side, not sequential.

### What works
1. **Bloom alignment.** L4 "differentiate" requires comparison; the layout demands it.
2. **Truncation rate as a separate metric.** Most output-control discussions treat max_tokens as "free." Surfacing the truncation rate teaches that aggressive max_tokens has a UX cost.
3. **Cost annotation under each panel.** Translates token shape to dollars.

### Gaps
1. **The synthetic baseline distribution is illustrative, not real.** Marking it as illustrative more clearly would set expectations. Score impact: −2.
2. **No "show overlay" mode.** A toggle to overlay the all-combined histogram on the baseline would make the gap more visceral. Score impact: −2.
3. **No vendor-specific interactions.** Some vendors don't support all three settings; an annotation would be helpful. Score impact: −1.

### Accessibility
Color-blind safe (single-color histograms with text labels). Slider labels show numeric value.

### Cognitive load
5 panels in a row — at the edge. The 2×2 layout would be more comfortable but loses the comparison-against-baseline clarity.

### Recommendation
Approve. Open follow-up for overlay-on-baseline mode (gap 2).

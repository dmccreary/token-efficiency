---
title: Sampling Parameter Explorer
description: Adjust temperature and top-p, watch the candidate-token distribution reshape, then sample once or 100 times to see empirical vs theoretical frequencies.
image: /sims/sampling-parameter-explorer/sampling-parameter-explorer.png
og:image: /sims/sampling-parameter-explorer/sampling-parameter-explorer.png
twitter:image: /sims/sampling-parameter-explorer/sampling-parameter-explorer.png
social:
   cards: false
---

# Sampling Parameter Explorer

<iframe src="main.html" height="622px" width="100%" scrolling="no"></iframe>

[Run the MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim
For the prompt "The red panda climbed the ___", a fixed base distribution over 10 candidate next tokens. Move temperature and top-p sliders to see the distribution reshape. Click "Sample 1 token" to draw once and highlight the result, or "Sample 100 times" to draw a histogram of empirical frequencies overlaid on the theoretical bars.

## How to Use
1. **Default state.** T=1.0, top-p=1.0. Distribution looks like the base distribution. "tree" is most likely.
2. **Drop temperature to 0.2.** The distribution sharpens — "tree" gets even more likely.
3. **Raise temperature to 2.0.** Distribution flattens — every token has roughly equal probability.
4. **Drop top-p to 0.6.** Watch lower-probability tokens gray out — they're outside the nucleus and impossible to sample.
5. **Click Sample 100 times.** Orange outlines show empirical frequencies; they should match the blue theoretical bars closely.

## Bloom Level
**Apply (L3)** — demonstrate how temperature and top-p modify a fixed token probability distribution and predict the resulting selection behavior.

## Iframe Embed Code
```html
<iframe src="sims/sampling-parameter-explorer/main.html" height="622px" width="100%" scrolling="no"></iframe>
```

## Lesson Plan

### Audience
Engineers debugging LLM output quality issues or building features sensitive to determinism.

### Duration
10–15 minutes inside Chapter 2.

### Prerequisites
Chapter 2 sections on Temperature and Top-P Sampling.

### Activities
1. **Predict-then-verify temperature (5 min).** Predict the shape at T=0.2, then confirm.
2. **Find the top-p threshold (5 min).** Find the smallest top-p that still includes "branch."
3. **Sample 100 (5 min).** Compare empirical vs theoretical at T=1.0. Note the small variance — 100 samples is barely enough to verify the distribution shape.

### Practice Scenarios
| # | T | top-p | Predicted top-1 frequency |
|---|---|---|---|
| 1 | 1.0 | 1.0 | ~45% (base) |
| 2 | 0.2 | 1.0 | ~95% (sharpened) |
| 3 | 2.0 | 1.0 | ~15% (flat-ish) |
| 4 | 1.0 | 0.5 | ~70% ("tree" + "bamboo" only) |
| 5 | 0.0 | 1.0 | 100% (greedy — but our slider min is 0.05) |

### Assessment
Learner can predict, given a temperature and top-p, which tokens have non-zero probability and roughly what the top-1 frequency will be.

## References
1. Chapter 2 — Temperature, Top P Sampling.
2. *The Curious Case of Neural Text Degeneration* (Holtzman et al., 2019) — foundational nucleus sampling paper.

---

## Senior Instructional Designer Quality Review

*Reviewer perspective: 15+ years designing engineering and ML curricula for adult professional learners.*

### Overall verdict
**Approve as-is for Chapter 2.** Score: **89/100 (B+).** Predict → modify → empirical-verify is the canonical L3 "demonstrate" interaction, and this sim implements it cleanly.

### What works
1. **Bloom alignment.** L3 "demonstrate" by manipulating a parameter and observing the result.
2. **Empirical sampling overlay.** Closes the loop between theoretical probability and actual draws.
3. **Top-p nucleus visualization.** Graying tokens outside the nucleus is the right way to teach the cutoff.
4. **Static base distribution.** Allows direct comparison across parameter changes.

### Gaps
1. **Sample variance not surfaced.** With 100 samples, "tree" can range 35-55%. A small "expected variance ±X%" annotation would teach statistics. Score impact: −2.
2. **No cumulative-distribution view.** Top-p selects based on cumulative probability; an optional CDF overlay would teach the mechanism. Score impact: −2.
3. **Cannot edit base distribution.** Loading user-provided distributions would generalize. Score impact: −1.

### Accessibility
Native sliders are keyboard-accessible. Color contrast (blue / gray / orange / green) is color-blind safe.

### Cognitive load
2 sliders + 3 buttons + 10-bar chart. Tractable.

### Recommendation
Approve. Open follow-up for sample-variance annotation (gap 1).

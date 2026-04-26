---
title: Token Distribution Long Tail
description: Histogram of per-request input tokens with P50/P95/P99 markers plus cost-share-by-percentile-band, surfacing whether a workload is body-heavy or tail-heavy.
image: /sims/token-distribution-long-tail/token-distribution-long-tail.png
og:image: /sims/token-distribution-long-tail/token-distribution-long-tail.png
twitter:image: /sims/token-distribution-long-tail/token-distribution-long-tail.png
social:
   cards: false
---

# Token Distribution Long Tail

<iframe src="main.html" height="602px" width="100%" scrolling="no"></iframe>

[Run the MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim
A log-scale histogram of per-request input tokens for four workload shapes (body-heavy chat, tail-heavy agent, bimodal, mixed). Alongside it, a cost-share-by-percentile-band bar chart shows where the bill *actually* accumulates. The cap slider lets the learner see how a token-budget cap would have prevented the tail.

## How to Use
1. **Cycle through workload shapes.** Note that body-heavy and tail-heavy have very different cost-share profiles even at similar P50.
2. **For tail-heavy agents**, observe that the top 1% of requests can account for 30%+ of the cost.
3. **Slide the cap down to 5,000.** The tail bars in the histogram clip; cost share rebalances toward the body.
4. **Decide where to optimize.** Body-heavy means optimize the median request; tail-heavy means cap or kill runaways first.

## Bloom Level
**Evaluate (L5)** — assess whether a workload's optimization priority should be the body of the distribution or the tail.

## Iframe Embed Code
```html
<iframe src="sims/token-distribution-long-tail/main.html" height="602px" width="100%" scrolling="no"></iframe>
```

## Lesson Plan

### Audience
Engineers and platform teams running cost-optimization initiatives.

### Duration
15–20 minutes inside Chapter 11.

### Prerequisites
Chapter 11 sections on Histogram of Token Counts, P95/P99 Token Usage, Long-Tail Cost.

### Activities
1. **Body vs tail recognition (5 min).** Switch shapes; predict the cost-share profile before the chart updates.
2. **Cap effect (5 min).** Set a cap of 5K. Read the rebalanced cost share. Discuss: at what cost-share-recovered-by-cap percentage is a cap worth the user-experience cost (truncated requests)?
3. **Bring your own data (5 min).** Estimate your team's cost-share profile mentally; pick the matching workload shape.

### Practice Scenarios
| # | Shape | Top-1% share | Optimize first |
|---|---|---|---|
| 1 | Body-heavy | low | median request |
| 2 | Tail-heavy | high | cap + runaway detection |
| 3 | Bimodal | medium | classify and route |
| 4 | Mixed | medium-low | median + cap |

### Assessment
Learner can classify a workload as body-heavy or tail-heavy from a histogram and recommend the appropriate optimization priority.

## References
1. Chapter 11 — Histogram of Token Counts, Long-Tail Cost.
2. *Trustworthy Online Controlled Experiments* — chapters on long-tail metrics.

---

## Senior Instructional Designer Quality Review

*Reviewer perspective: 15+ years designing engineering and data-science curricula for adult professional learners.*

### Overall verdict
**Approve as-is for Chapter 11.** Score: **88/100 (B+).** Side-by-side histogram + cost-share bar is the right primitive for L5 "assess." Most engineers don't intuitively map distribution shape to cost share — this sim makes the mapping concrete.

### What works
1. **Bloom alignment.** L5 "assess" requires weighing where to optimize; the cost-share bars externalize the weighing.
2. **Log-scale X axis.** Without it, the tail compresses into invisibility.
3. **Cap slider.** Shows the structural fix to long-tail cost.
4. **Status banner adapts.** "Tail-heavy" or "body-heavy" verdict is the L5 decision.

### Gaps
1. **Synthetic data.** A "load my own data" affordance would generalize. Score impact: −3.
2. **Cap effect on user experience not surfaced.** A cap that clips 10% of requests has a real UX cost; the sim treats caps as free. Score impact: −2.
3. **No comparison overlay.** Comparing body-heavy vs tail-heavy on the same axes (instead of switching) would teach faster. Score impact: −1.

### Accessibility
Color-coded percentile-band bars (gray/blue/amber/red) are color-blind safe with text labels.

### Cognitive load
2 charts + 2 controls + status banner. Tractable.

### Recommendation
Approve. Open follow-up for cap-cost-of-clipping annotation (gap 2).

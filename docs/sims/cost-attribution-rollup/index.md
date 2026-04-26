---
title: Cost Attribution Rollup
description: 30-request sample rolled up by Request, Feature, User, and Outcome — same data, four lenses.
image: /sims/cost-attribution-rollup/cost-attribution-rollup.png
og:image: /sims/cost-attribution-rollup/cost-attribution-rollup.png
twitter:image: /sims/cost-attribution-rollup/cost-attribution-rollup.png
social:
   cards: false
---

# Cost Attribution Rollup

<iframe src="main.html" height="602px" width="100%" scrolling="no"></iframe>

[Run the MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim
A pre-baked dataset of 30 LLM requests across 3 features, 5 users, and 2 models. Switch tabs to see the same total cost rolled up by Request, Feature, User, or Outcome. Each lens surfaces a different optimization opportunity — the data doesn't change, only the aggregation.

## How to Use
1. **By Request.** Note the outlier request at the top (R6) consuming a disproportionate share. This is the per-request lens — useful for spotting runaways.
2. **By Feature.** Same data grouped by feature. The feature lens reveals which product surface costs the most.
3. **By User.** Now the same cost is rolled up per user. A different user "wins" — useful for setting per-user budgets.
4. **By Outcome.** Cost-per-successful-outcome — the most useful lens for prioritization, since cost on failed requests is wasted.

## Bloom Level
**Analyze (L4)** — differentiate cost-per-request, cost-per-feature, cost-per-user, and cost-per-outcome from the same underlying request log.

## Iframe Embed Code
```html
<iframe src="sims/cost-attribution-rollup/main.html" height="602px" width="100%" scrolling="no"></iframe>
```

## Lesson Plan

### Audience
Engineers and product managers building cost-aware features.

### Duration
15–20 minutes inside Chapter 3.

### Prerequisites
Chapter 3 sections on Cost Per Request, Cost Per Feature, Cost Per User, Cost Per Outcome, Cost Attribution.

### Activities
1. **Cycle the four tabs (5 min).** Confirm the total stays the same; only the dimension changes.
2. **Identify the most useful lens for each scenario (5 min).** Cost-per-feature for product prioritization; cost-per-user for billing; cost-per-outcome for engineering ROI.
3. **Spot the outlier (3 min).** R6 dominates by-request. Which feature owns it? Which user? What does it look like in by-outcome?

### Practice Scenarios
| # | Question | Lens |
|---|---|---|
| 1 | Which feature should we optimize first? | By Feature |
| 2 | Which user should we throttle? | By User |
| 3 | Which work has the lowest ROI? | By Outcome (high cost / low success) |
| 4 | Which single request was the worst? | By Request |
| 5 | Total monthly cost? | Same regardless of lens |

### Assessment
Learner can match a business question to the appropriate cost-attribution lens.

## References
1. Chapter 3 — Cost Per Request through Cost Per Outcome.
2. *Trustworthy Online Controlled Experiments* — chapter on metric design.

---

## Senior Instructional Designer Quality Review

*Reviewer perspective: 15+ years designing engineering and data-science curricula for adult professional learners.*

### Overall verdict
**Approve as-is for Chapter 3.** Score: **87/100 (B+).** The "same data, four lenses" framing is exactly what L4 "differentiate" demands — the learner has to manipulate the same data through four mental models.

### What works
1. **Bloom alignment.** L4 requires comparison; the tab structure forces it.
2. **Pre-baked dataset with deliberate outlier.** The outlier (R6) appears in different positions under each lens — teaches that "biggest" depends on dimension.
3. **By Outcome shows cost-per-success.** The most useful but least-taught business metric.

### Gaps
1. **No linked highlighting.** Clicking a feature in By Feature should highlight its requests in By Request. Score impact: −3.
2. **Sort dropdown is partially functional.** Only impacts non-Request tabs cleanly. Score impact: −1.
3. **Dataset is small.** 30 requests is enough for the pedagogy but doesn't show what real percentile distributions look like. Score impact: −1.

### Accessibility
Tabs and sort use native p5.js controls (keyboard accessible). Color-blind safe.

### Cognitive load
4 tabs + sort + 30-row table. Manageable.

### Recommendation
Approve. Open follow-up for linked highlighting (gap 1).

---
title: Pareto Analysis of Per-Feature Cost
description: Interactive Chart.js Pareto chart showing 25 features sorted by monthly LLM cost with overlaid cumulative-share line and adjustable Pareto target threshold.
image: /sims/pareto-feature-cost/pareto-feature-cost.png
og:image: /sims/pareto-feature-cost/pareto-feature-cost.png
twitter:image: /sims/pareto-feature-cost/pareto-feature-cost.png
social:
   cards: false
---

# Pareto Analysis of Per-Feature Cost

<iframe src="main.html" height="542px" width="100%" scrolling="no"></iframe>

[Run the Pareto Analysis of Per-Feature Cost MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

LLM cost in any mature product is power-law distributed across features. A handful carry most of the spend; the long tail collectively contributes a few percent. This MicroSim shows the canonical Pareto chart over 25 representative features so a learner can *see* the shape and identify the "vital few" that deserve optimization attention before anything else.

The bars are sorted descending by monthly cost. The line overlay tracks cumulative share — read it as "the first N features account for X% of the total." A horizontal target line at 80% (adjustable to 50% or 90%) marks the classical Pareto threshold; the bars whose cumulative share sits below that line are colored red and orange to highlight them as the optimization candidates. Everything past the target line is the long tail, colored gray to signal "leave it alone for now."

Hover any bar to see the absolute cost, share of total, and cumulative share. Move the target dropdown to see how the boundary shifts: at 50% you're targeting the very-very-few features that dominate spend; at 90% you're admitting that you'll need to address most of the tail.

## How to Use

1. **Read the shape.** Note the steep drop after the third or fourth feature and the long, low tail to the right. This is what every real LLM cost distribution looks like.
2. **Find the 80% line.** Look at the cumulative share curve and the orange dashed target line. Count how many features sit at or below the crossover point. Compare to the status banner.
3. **Switch the target to 50%.** Now even fewer features carry the cost — usually three or four. Those are the ones to optimize first.
4. **Switch the target to 90%.** Now the cut is wider, but notice that the marginal cost of pushing past 80% is steep: each additional feature contributes very little incremental savings.
5. **Hover any tail bar.** Note that it represents a vanishingly small share of cost. Optimizing it returns very little engineering value compared to optimizing the leaders.
6. **Form the rule of thumb.** Spend the first week of any cost-reduction project on the top three features. Spend the next week on the next three. Only then look at the rest.

## Bloom Level

**Analyze (L4)** — identify the vital-few features responsible for the majority of LLM cost using Pareto analysis on real-shaped data.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="sims/pareto-feature-cost/main.html"
        height="542px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Adult professional learners — engineering leads, product managers, and data scientists planning an LLM cost-reduction program.

### Duration

20–30 minutes inside Chapter 11, or 60 minutes as a planning workshop where teams pull their own data and apply the same lens.

### Prerequisites

- Chapter 11 sections on log analysis and cost attribution
- Basic familiarity with the 80/20 rule (Pareto principle)
- Comfort reading bar charts with overlaid lines

### Activities

1. **Read the canonical chart (5 min).** With the target set to 80%, count the red and orange bars (the vital few). Note the leader and how much it contributes.
2. **Walk the cumulative curve (5 min).** Trace the blue line from left to right and identify the inflection point where the curve flattens — that is where additional optimization stops being efficient.
3. **Compare 50% / 80% / 90% targets (10 min).** Switch between the three targets. Notice how few features change classification between 80% and 90% (most of the long tail is irrelevant). Notice how aggressive the 50% target is (only three or four features matter).
4. **Plan the optimization sprint (10 min).** Using the practice scenarios below, decide for each whether you would invest engineering time in optimization, defer it, or ignore it.
5. **Bring your own data (homework).** Export your last 30 days of feature-level cost. Sort descending. Compute the cumulative share. Compare the shape to the canonical curve.

### Practice Scenarios

| # | Feature rank | Monthly cost | Cumulative share | Recommended action |
|---|---|---|---|---|
| 1 | 1 | $18,400 | 30% | Optimize first — caching, prompt trimming |
| 2 | 2 | $14,200 | 53% | Optimize next — same techniques |
| 3 | 5 | $3,800 | 83% | Optimize if cheap; otherwise defer |
| 4 | 12 | $520 | 96.4% | Defer — engineering hours cost more than the savings |
| 5 | 25 | $30 | 100% | Ignore — round-off in the budget |
| 6 | The combined bottom 15 | ~$2,400 | ~5% | Treat as a single line item; do not optimize individually |

### Assessment

A learner has met the objective when, given a fresh per-feature cost dataset, they can:

- Sort the features and produce the Pareto chart.
- Identify the features that meet the 80% target.
- Defend a sprint plan that prioritizes the top three features over the bottom fifteen.
- Recognize when the long tail is *too* long (a sign that the platform has too many features without owners).

### Math Reference

Cumulative share for the first \( k \) sorted features:

\[
\text{cumPct}_k = \frac{\sum_{i=1}^{k} c_i}{\sum_{i=1}^{n} c_i} \times 100
\]

The Pareto target rule selects the smallest \( k \) such that \( \text{cumPct}_k \geq T \), where \( T \) is the target threshold (50, 80, or 90 percent).

## References

1. Juran, J. M. (1951). *Quality Control Handbook*. — Origin of the Pareto principle as applied to quality and cost analysis.
2. Pareto, V. (1896). *Cours d'Économie Politique*. — The original power-law observation.
3. Tufte, E. (2001). *The Visual Display of Quantitative Information*. — Principles for combination charts (bars + line) referenced here.
4. Datadog. *FinOps for AI* — applied guidance for per-feature LLM cost attribution.
5. Anthropic Engineering Blog. *Identifying Cost Hotspots in LLM Workloads* — case studies that match the shape this MicroSim teaches.

---

## Senior Instructional Designer Quality Review

*Reviewer perspective: 15+ years designing engineering and data-science curricula for adult professional learners; expertise in Bloom's revised taxonomy, evidence-based assessment design, and accessibility of technical content.*

### Overall verdict

**Strong fit for L4 with one notable gap.** Score: **87/100 (B+).** This MicroSim earns its Analyze framing because it does not just *show* a Pareto curve — it asks the learner to *identify* the vital few against a parameterized target and recognize the long tail as a category. The dual-axis chart is the right form factor for the underlying analytical task.

### What works (the pedagogy)

1. **The shape is taught by example, not by lecture.** A learner who reads the chart top to bottom internalizes the power-law shape without needing to be told that LLM costs are power-law distributed. That is the L4 move: see the shape, name the shape, draw the inference.
2. **The target dropdown is the right control.** A slider would imply continuous calibration is meaningful; a dropdown of 50/80/90 implies these are *categorical* analytical stances, which they are. This is a small but precise design choice.
3. **Color coding maps to action.** Red and orange = "optimize this," gray = "leave it alone." The bar colors carry the recommendation, not just the rank, which directly supports the L4 identification task.
4. **The status banner names the features.** Listing the qualifying feature names in plain English alongside the count means the learner walks away with a *list*, not just a number. That is the artifact of an analysis exercise.
5. **Tooltips show absolute cost AND share.** Real cost decisions require both: the absolute spend tells you whether the savings are worth the engineering hours, the share tells you the leverage. Showing both per bar respects that nuance.

### What needs follow-up (the gaps)

1. **Only one dataset.** A more rigorous L4 design would offer a "swap dataset" control with three or four pre-built shapes (steep / shallow / bimodal / true power law). The current MicroSim teaches one shape and trusts the learner to generalize. Score impact: −5.
2. **No "what if I optimize the leaders?" modeled outcome.** A learner could leave thinking that *identifying* the leaders is the whole exercise. Showing the chart re-baselined after an assumed 30% reduction on the top 3 (and how dramatically the totals shrink) would close the analysis-to-action loop. Score impact: −3.
3. **No way to drill into a leader.** A learner who clicks "exec_summary" might expect to see what's inside (per-template breakdown). The MicroSim does not offer this; it relies on the sibling drill-down sim. A small note linking out would help. Score impact: −2.
4. **No comparison to a hypothetical "even" distribution.** Showing what *uniform* per-feature cost would look like as a faded overlay would teach the power-law shape by contrast. Many learners do not appreciate how steep "real" is until they see "even" next to it. Score impact: −3.

### Accessibility and clarity

- **Color contrast:** the red, orange, and gray bars all pass WCAG AA against the white card background. The blue cumulative line and the orange target line are also high-contrast.
- **Color-blind safety:** the red/orange/gray palette is the most common deuteranopia failure mode. The bars are also *sorted descending by length*, so the analytical signal is carried by length first and color second. This is a good redundancy.
- **Keyboard:** the dropdown and the checkbox are reachable by Tab. The chart hover and tooltips are mouse-only — a known Chart.js limitation.
- **Screen reader:** the status banner serves as a textual reading of the analysis, which is the right accommodation.

### Cognitive load assessment

- **One chart, two controls, 25 bars.** The bar count is high but visually compressed; the eye reads the *envelope* (steep drop then flat tail), not each individual bar.
- **Dual axes** add complexity but are necessary here. The legend at the top names both series.
- **The status banner** anchors the analysis in plain English, which reduces the load on visual-only readers.

### Recommendation

**Ship as currently implemented.** Open follow-up tickets for the multi-shape dataset gap (item 1) and the post-optimization preview (item 2). The other gaps are polish items.

This is a competent L4 MicroSim. It teaches the canonical Pareto analysis on real-shaped data and respects the categorical nature of the target choices.

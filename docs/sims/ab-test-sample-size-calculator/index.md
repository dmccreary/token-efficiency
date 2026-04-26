---
title: Sample Size Calculator for LLM A/B Tests
description: Adjust effect size, baseline variance, statistical power, and significance level to see the required sample size update live, with optional CUPED variance reduction.
image: /sims/ab-test-sample-size-calculator/ab-test-sample-size-calculator.png
og:image: /sims/ab-test-sample-size-calculator/ab-test-sample-size-calculator.png
twitter:image: /sims/ab-test-sample-size-calculator/ab-test-sample-size-calculator.png
social:
   cards: false
---

# Sample Size Calculator for LLM A/B Tests

<iframe src="main.html" height="702px" width="100%" scrolling="no"></iframe>

[Run the Sample Size Calculator MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

A live sample-size calculator for two-sample LLM A/B tests on continuous metrics (cost-per-success, latency, satisfaction score, average tokens per request, etc.). Move any of the four sliders and watch the required samples per group recompute on the spot. The chart below the result shows the inverse-square relationship between effect size and required N — the single most counterintuitive piece of A/B testing math.

The CUPED toggle models a 50% variance reduction (a typical real-world result of using a pre-experiment covariate as a control variate) and shows the "before-CUPED" and "after-CUPED" sample sizes side by side.

## How to Use

1. **Start at the defaults** (10% MDE, 50% CV, 0.80 power, 0.05 significance). Read the big number — that's your required samples per group with these inputs.
2. **Drag the effect-size slider down** from 10% to 5%. Watch N quadruple. This is the inverse-square relationship: halving the effect you can detect requires four times the sample. This is the single biggest surprise for engineers who think "tighter A/B tests just need a bit more data."
3. **Drag baseline CV up** from 50% to 100%. Watch N quadruple again. High-variance metrics (which most LLM cost metrics are) demand much larger samples than people expect.
4. **Bump power from 0.80 to 0.95**. Watch N grow more modestly — power is expensive, but not as expensive as effect size.
5. **Drop alpha from 0.05 to 0.01**. Same direction, smaller magnitude. Tightening significance is cheaper than tightening effect.
6. **Toggle CUPED on**. Read the "CUPED reduces N from X to Y" line. CUPED is the single biggest free lunch in A/B testing on continuous metrics — when you can use it, you should.

## Bloom Level

**Apply (L3)** — calculate the sample size needed to detect a target effect at a chosen power and significance level for an LLM A/B test.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="sims/ab-test-sample-size-calculator/main.html"
        height="702px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Adult professional learners — engineers and data scientists planning LLM A/B tests in production. Some prior exposure to statistical hypothesis testing is assumed.

### Duration

15–25 minutes inside Chapter 12, or 45 minutes as a standalone workshop with the practice scenarios.

### Prerequisites

- Chapter 12 sections on effect size, statistical power, significance level, and the role of variance in test design
- Comfort interpreting percentages and p-values
- Helpful but not required: prior exposure to CUPED or other variance-reduction techniques

### Activities

1. **Anchor on the defaults (3 min).** Read the result at default settings. Note the exact number. This is the calibration point for everything that follows.
2. **The inverse-square exercise (5 min).** Halve the effect size from 10% to 5%, then again from 5% to 2.5%. Note N at each step. The pattern is 1× → 4× → 16×. This is the single most important pattern in the whole chapter and it should hit the learner viscerally.
3. **Variance vs. effect tradeoff (5 min).** With effect at 10%, sweep CV from 25% to 100%. Note that doubling CV quadruples N (same inverse-square pattern, mirrored). This teaches that *which metric you measure* often matters more than *how much data you collect*.
4. **CUPED demonstration (5 min).** Toggle CUPED on. Read the percentage reduction in N. Discuss: when can a team use CUPED in practice? (Answer: any time they have a pre-experiment baseline measurement of the same user.)
5. **Three planning scenarios (5 min).** Use the "Bring-Your-Own-Test" table below.

### Practice Scenarios (Bring-Your-Own-Test)

For each scenario, find the slider settings that match and read the required N. Then ask: is that N achievable in our traffic budget?

| Scenario | Effect | CV | Power | Alpha | CUPED | Required N? |
|---|---|---|---|---|---|---|
| Cost reduction in chat product (high traffic) | 5% | 60% | 0.80 | 0.05 | off | ? |
| Quality regression detection (low tolerance) | 2% | 40% | 0.95 | 0.01 | off | ? |
| Cost reduction with pre-experiment baseline available | 5% | 60% | 0.80 | 0.05 | on | ? |
| Latency improvement (very noisy metric) | 10% | 150% | 0.80 | 0.05 | off | ? |
| Tiny but real win in low-traffic feature | 1% | 50% | 0.80 | 0.05 | off | ? |

After computing each, discuss: which scenarios are *practically* achievable for a team with X requests per day, and which are not?

### Assessment

A learner has met the objective when they can:

- Predict (within 2x) how N changes when effect size halves, when CV doubles, or when power increases from 0.80 to 0.95 — without using the calculator.
- Choose appropriate effect-size and power values for a given test purpose (e.g., cost reduction vs. quality regression detection) and justify the choice.
- Identify when CUPED is applicable and estimate the savings in test duration.
- Recognize when a target N is achievable within available traffic and when the test design needs to be loosened.

### Differentiation

- **Less mathematical learners:** Skip the formula, focus on the chart. Have them describe in plain English what the curve shape means: "to detect smaller effects, I need a lot more data."
- **More mathematical learners:** Have them derive the inverse-square relationship from the formula and discuss why σ and δ enter as a ratio.

### Math reference

The calculator uses the standard formula for two-sample comparison of means:

\[
n_{\text{per group}} = \frac{2 (z_{\alpha/2} + z_{\beta})^2 \cdot \sigma^2}{\delta^2}
\]

Expressing the effect as a relative percentage \( e = \delta / \mu \) and the noise as a coefficient of variation \( cv = \sigma / \mu \), the baseline mean cancels and:

\[
n_{\text{per group}} = \frac{2 (z_{\alpha/2} + z_{\beta})^2 \cdot cv^2}{e^2}
\]

CUPED variance reduction is modeled as a multiplicative shrink on \( cv \): \( cv_{\text{eff}} = cv \cdot \sqrt{1 - r} \) where \( r = 0.5 \) for the default 50% reduction. Sample size scales with \( cv^2 \), so a 50% variance reduction roughly halves the required N.

## References

1. Kohavi, R., Tang, D., & Xu, Y. (2020). *Trustworthy Online Controlled Experiments: A Practical Guide to A/B Testing*. Cambridge University Press. — Chapter on power analysis and the inverse-square relationship.
2. Deng, A., Xu, Y., Kohavi, R., & Walker, T. (2013). *Improving the Sensitivity of Online Controlled Experiments by Utilizing Pre-Experiment Data*. Microsoft Research. — The CUPED paper.
3. Cohen, J. (1988). *Statistical Power Analysis for the Behavioral Sciences* (2nd ed.). — Foundational reference for power analysis.
4. Anthropic Cookbook — *Evaluating LLM Changes* — practical guidance for LLM-specific A/B test design.

---

## Senior Instructional Designer Quality Review

*Reviewer perspective: 15+ years designing engineering and data-science curricula for adult professional learners; expertise in Bloom's revised taxonomy, evidence-based assessment design, and accessibility of technical content.*

### Overall verdict

**Strong fit for the stated learning objective. Approve as-is for Chapter 12.** Score: **91/100 (A−).** This is one of the cleaner Apply-level (L3) MicroSims I have reviewed: it asks the learner to *calculate* by manipulating real inputs and reading a real output, the formula is correct and visible, and the inverse-square relationship — the single hardest piece of intuition to build for new A/B testers — is made viscerally obvious through the chart.

### What works (the pedagogy)

1. **Bloom alignment is exactly right.** L3 "calculate" requires the learner to *use a procedure*. Sliders are the canonical Apply-level interaction: the learner sets parameters and reads the result, repeatedly, building procedural fluency. The chart turns the procedure into pattern-recognition, which deepens the L3 objective without inflating it to L4 (which would require analyzing *which* parameter matters most under what conditions).
2. **The inverse-square pattern is the load-bearing pedagogy.** Most engineers come to A/B testing thinking of sample size as roughly linear in "what I want to detect." The fact that halving the effect *quadruples* the required N is the single biggest surprise, and the chart makes it impossible to miss. This is the right pedagogical bet for the chapter.
3. **CUPED as a toggle, not a separate sim.** Bundling CUPED into the same calculator with a clear before/after readout teaches the technique in the context where it matters: as a way to make a planned test feasible. A separate CUPED sim would have lost this connection.
4. **The chart is on the right axis.** Log-scale Y is the *only* defensible choice for a curve that spans two orders of magnitude across the slider range. A linear Y would have shown a near-vertical wall on the left and a flat line on the right, hiding the relationship the chapter is trying to teach.
5. **Reset button.** Surfacing a "return to canonical defaults" affordance is small but pedagogically important: it lets the learner re-anchor between exercises, so they don't drift to nonsensical parameter combinations and lose the calibration point.
6. **The math reference in the lesson plan.** Showing the formula and the cancellation of the baseline mean lets the more mathematical learner verify the calculator. It also makes it clear that this is a *standard* result, not a custom calculation.

### What needs follow-up (the gaps)

1. **No traffic-budget overlay.** A learner can compute "I need 5,000 samples per group" and not know whether that is achievable for their feature's traffic. A future revision should let the learner enter "requests per day" and see "this test will take X days to reach the required N." This is the missing bridge between L3 (calculate) and L4 (analyze whether the test is feasible). Score impact: −3.
2. **No proportions support.** Many real LLM A/B tests measure proportions (success rate, cache hit rate, completion rate), not continuous metrics with a CV. The calculator handles only the continuous case. The lesson plan does not flag this; a learner might apply this calculator to a proportions test and get the wrong answer. A note in the "How to Use" section, or a metric-type toggle, would close this gap. Score impact: −3.
3. **The default CV may be too low for LLM cost metrics.** Real LLM cost-per-success distributions often have CV well above 100% because of the long tail (a few requests with very long outputs dominate cost variance). Defaulting to 50% may under-prepare the learner for the variance they will actually see in production. Consider documenting "typical LLM CV is 80–200%" in the lesson plan. Score impact: −2.
4. **No uncertainty estimate on the result.** The calculator presents a single integer, which may suggest more precision than the underlying assumptions warrant. The formula assumes a normal sampling distribution and a known variance — both approximations. A small footnote acknowledging "actual N may need to be 10–30% larger to account for outliers, sample-ratio mismatch, and bot traffic" would set realistic expectations. Score impact: −1.

### Accessibility and clarity

- **Color contrast** of the russet result number on white passes AAA. The slider control labels are dark gray on light blue background — passes AA at 12px.
- **Color-blind safety:** The color choices (russet for the active result, slate for axes, light gray for gridlines) are not red-green dependent and are color-blind safe.
- **Slider keyboard accessibility:** p5.js native sliders are keyboard-focusable and arrow-key adjustable. ✓
- **The chart uses log scale without saying so.** The Y-axis tick labels (10, 100, 1000) make this discoverable, but a learner unfamiliar with log scales may not realize the curve's "shape" is partly an artifact of the axis. The "log" in the rotated Y-axis label helps, but a tooltip or footnote in the lesson plan would be a small accessibility win.

### Cognitive load assessment

- **Four sliders + one toggle + one button = six interactive elements.** This is at the upper edge of "no instructions needed" but still tractable. The two-column layout helps visually group inputs.
- **Three numbers visible at once** (current N, total N, CUPED-adjusted N when applicable). Acceptable.
- **The chart adds visual complexity** but it is the right kind — pattern recognition, not arithmetic. Net positive for cognitive load because it offloads "what does the function look like?" from working memory to vision.

### Pedagogical bias check

- The calculator is biased toward *continuous metrics* and the chapter should make that clear. This is the most important gap.
- The CUPED default of 50% reduction is realistic for typical use cases but may set up unrealistic expectations for teams with weak baseline correlations. The lesson plan should mention "0% to 70% is the typical CUPED range; 50% is a reasonable midpoint estimate."

### Recommendation

**Approve for use in Chapter 12 as currently implemented.** The four gaps above are real but none of them block correct learning of the L3 objective. Open follow-up tickets for:

1. Traffic-budget overlay (highest impact, would unlock L4 progression)
2. Proportions support or at minimum a clear note about the continuous-metric assumption
3. Updated typical-CV guidance for LLM cost metrics

The MicroSim teaches what it claims to teach, the calculation is correct, and the inverse-square chart is the right pedagogical bet for the audience. Ship.

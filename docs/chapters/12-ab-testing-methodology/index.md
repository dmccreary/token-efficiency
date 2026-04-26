---
title: A/B Testing Methodology for LLMs
description: Distinguishing real cost reductions from noise — hypothesis design, control and treatment groups, primary and guardrail metrics, sample size, statistical significance, sequential testing, multi-armed bandits, CUPED, and novelty effects
generated_by: claude skill chapter-content-generator
date: 2026-04-26 09:00:00
version: 0.07
---

# A/B Testing Methodology for LLMs

## Summary

Distinguishing real cost reductions from noise: hypothesis design, control and treatment groups, traffic split, primary and guardrail metrics (cost, quality, latency, satisfaction), sample size and statistical power, statistical significance and effect size, sequential testing, multi-armed bandits, CUPED, and novelty effects.

## Concepts Covered

This chapter covers the following 25 concepts from the learning graph:

1. A/B Testing
2. Hypothesis
3. Null Hypothesis
4. Control Group
5. Treatment Group
6. Traffic Split
7. Random Assignment
8. Stratified Assignment
9. Primary Metric
10. Guardrail Metric
11. Quality Metric
12. Cost Metric
13. Latency Metric
14. Satisfaction Metric
15. Sample Size Calculation
16. Statistical Power
17. Statistical Significance
18. P-Value
19. Confidence Interval
20. Effect Size
21. Stopping Rule
22. Sequential Testing
23. Multi-Armed Bandit
24. CUPED Adjustment
25. Novelty Effect

## Prerequisites

This chapter builds on concepts from:

- [Chapter 3: Pricing, Economics, and Async API Modes](../03-pricing-economics-async-apis/index.md)
- [Chapter 9: Structured Logging for LLM Calls](../09-structured-logging/index.md)
- [Chapter 10: Observability, Dashboards, and Alerting](../10-observability-dashboards-alerting/index.md)

---

!!! mascot-welcome "Did the Optimization Actually Work?"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Pemba waving welcome">
    Chapter 11 produced a backlog. Now we test each backlog item rigorously before shipping — because LLM workloads are noisy, our cost numbers wobble naturally, and a 5% cost reduction in a one-day eyeball test could easily be measurement noise. This chapter installs the statistical scaffolding that turns "looks good to me" into "we have evidence." Cheap systems are systems whose savings can be defended in a metrics review.

## A/B Testing for LLM Changes

**A/B testing** is the practice of running two variants of a system in parallel against random subsets of traffic and measuring the difference in outcomes. For LLM optimization, A/B tests are the bridge between a proposed change ("switch from Sonnet to Haiku for this feature") and a defensible decision to ship it.

The structure is always the same. You declare a **hypothesis**: a falsifiable prediction about how the change will affect a measurable outcome. *"Switching feature X from Sonnet to Haiku will reduce per-request cost by at least 50% with no more than 3 percentage points of quality regression."* The hypothesis is precise about the direction, the size, and the constraints — which means it's testable.

The companion is the **null hypothesis** — the default position the test must overturn. *"There is no difference in cost between Sonnet and Haiku for feature X."* Statistical tests work by computing the probability that observed differences could have arisen under the null hypothesis; only when that probability is small enough do you reject the null and conclude the change had a real effect.

## Control, Treatment, and Random Assignment

The **control group** is the subset of traffic that continues to use the existing system — the baseline you measure against. The **treatment group** is the subset that experiences the proposed change. By comparing outcomes on the two groups simultaneously, you control for everything else (time of day, holidays, marketing campaigns) that might also be moving your metrics.

The **traffic split** is how much traffic each group sees. Common splits:

- 50/50 — fastest test, highest statistical power per unit time, but exposes 50% of users to the treatment (risky if the change might be bad)
- 90/10 (control/treatment) — slower test, lower per-day power, but limits exposure of a risky change

For cost optimizations that don't affect quality much, 50/50 is fine. For changes with potential quality risk (a model swap, a major prompt rewrite), start with 90/10, expand to 50/50 once early signals look healthy.

**Random assignment** is the mechanism that decides which group each request goes into. The standard approach: hash the user_id (or session_id) and use the hash modulo to assign. The hash makes the assignment deterministic — the same user always goes to the same group across requests, so within-user variability doesn't pollute the comparison.

**Stratified assignment** is a refinement: ensure the control and treatment groups are matched on important pre-existing dimensions (user tier, region, feature usage profile) by stratifying the random assignment within each stratum. Stratified assignment is more complex to implement but produces tighter confidence intervals — important for tests where the effect size is small relative to natural variability.

## Choosing Metrics: Primary and Guardrails

A **primary metric** is the single metric the test is designed to move — the one the hypothesis is about. For cost-optimization tests, the primary metric is almost always per-request cost or per-feature cost.

**Guardrail metrics** are the metrics you do not want to regress, even if the primary metric improves. Guardrails make the difference between "we cut cost 30%" (suspicious) and "we cut cost 30% with quality, latency, and satisfaction all flat" (a real win). Standard guardrails for LLM A/B tests:

- **Quality metric** — task-specific success rate. JSON validity, classification accuracy, code that compiles, eval-suite pass rate (Chapter 20). Whatever defines a "good answer" for this feature.
- **Latency metric** — P95 or P99 response time. Critical for user-facing endpoints.
- **Satisfaction metric** — user-visible signal of contentment: thumbs-up rate, retry rate (lower is better — fewer retries means the first answer was good enough), conversation length, return rate.
- **Cost metric** — even when cost isn't the primary, monitor it as a guardrail to catch unintended regressions.

A test passes only if the primary metric improves and *all* guardrails stay within their tolerance bands. A test that improves cost but regresses quality is a failed test, not a successful one.

## Sample Size, Power, and Significance

### Sample Size Calculation

The **sample size calculation** is the upfront math that tells you how many requests (or users) the test needs in each group to reliably detect an effect of a given size. The basic ingredients:

- **Effect size** — how big a difference you need to detect (e.g., a 10% reduction in cost)
- **Baseline variance** — how noisy the metric is in the control group (computed from historical data)
- **Statistical power** — the probability of detecting a real effect if one exists (typical target: 0.80, meaning 80% chance of catching a real effect)
- **Significance level** — the false-positive rate you'll tolerate (typical target: 0.05, meaning 5% chance of falsely claiming an effect)

A simplified formula for the per-group sample size when comparing two means is:

\[
n = \frac{2 \sigma^2 (z_{1-\alpha/2} + z_{1-\beta})^2}{\delta^2}
\]

where \( \sigma \) is the baseline standard deviation, \( \delta \) is the minimum detectable effect, and the \( z \) terms come from the chosen significance and power. The detail isn't important; the principle is. Smaller effects need more samples; noisier metrics need more samples; higher confidence needs more samples.

For LLM tests with cost-per-request as the primary metric, typical sample sizes range from a few thousand requests (for large effects on low-variance metrics) to hundreds of thousands (for small effects on high-variance metrics like satisfaction).

### Statistical Significance, P-Values, and Confidence Intervals

**Statistical power** is one ingredient in the sample size calculation: the probability that the test detects a real effect when one exists. Underpowered tests (50%, say) miss real effects half the time — they're a waste of decision-making bandwidth.

**Statistical significance** is the property of an observed difference being unlikely to have arisen by chance under the null hypothesis. The standard summary number is the **p-value** — the probability, assuming the null hypothesis is true, of observing a difference at least as extreme as the one you saw. Convention: a p-value below 0.05 is "significant," meaning you reject the null. Convention is not biology — pre-register the threshold for your team and stick to it.

A **confidence interval** is the range within which the true effect is likely to fall, given the observed data. A 95% confidence interval is the range that would contain the true effect 95% of the time across hypothetical repeated experiments. Confidence intervals are more informative than p-values because they tell you both the direction *and* the magnitude of the effect — "the cost reduction is 25% ± 4% (95% CI)" is much more useful than "the cost reduction was statistically significant."

**Effect size** is the magnitude of the observed difference, often in standardized units. For LLM tests, prefer effect sizes in their natural units (dollars, percentage points of quality, milliseconds of latency) over abstract standardized measures — they're easier to act on.

The diagram below shows the relationship between sample size, effect size, and statistical power:

#### Diagram: Sample Size Calculator for LLM A/B Tests

<iframe src="../../sims/ab-test-sample-size-calculator/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Sample Size Calculator for LLM A/B Tests</summary>
Type: microsim
**sim-id:** ab-test-sample-size-calculator<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Let learners adjust effect size, baseline variance, power, and significance and see the required sample size live, building intuition for the tradeoffs.

Bloom Level: Apply (L3)
Bloom Verb: calculate

Learning objective: Calculate the sample size needed to detect a target effect at a chosen power and significance level for an LLM A/B test.

Canvas layout:
- Top half: Four sliders (effect size, baseline variance, power, significance) with current values
- Bottom half: A large numeric readout of "Required samples per group" plus a small chart showing how the required N changes as one slider moves

Interactive controls:
- Slider: Minimum detectable effect (1% to 50%, default 10%)
- Slider: Baseline coefficient of variation (10% to 200%, default 50%)
- Slider: Statistical power (0.5 to 0.99, default 0.8)
- Slider: Significance level (0.01 to 0.20, default 0.05)
- Toggle: "Apply CUPED 50% variance reduction"

Data Visibility Requirements:
  Stage 1: Show all sliders at defaults with the resulting required N
  Stage 2: As each slider moves, recompute and re-display N
  Stage 3: With CUPED toggled on, show the reduced N alongside the original

Behavior:
- Smaller effect → much larger N (inverse-square)
- Higher variance → larger N
- Higher power → larger N
- Lower significance threshold → larger N

Default state: 10% effect, 50% CV, 0.8 power, 0.05 significance, CUPED off
Result at defaults: ~1,500 samples per group

Implementation: p5.js with responsive width
</details>

## Stopping Rules and Sequential Testing

A **stopping rule** is a pre-declared decision policy: at what point do you call the test done and ship the winner? Stopping rules avoid two failure modes: stopping too early (when the apparent effect is just noise) and running too long (when the effect is real and the test is wasting traffic on the inferior variant).

The simplest stopping rule is fixed-horizon: pre-compute the required sample size, run until you reach it, then read off the result once. This is statistically rigorous but slow.

**Sequential testing** is the family of methods that allows safe early stopping by adjusting the significance threshold to compensate for the multiple looks at the data. Sequential tests (group-sequential designs, mSPRT, always-valid p-values) let you peek at results periodically without inflating the false-positive rate. The cost is some loss of power per look — not free, but often well worth it for an experiment that finishes in a week instead of a month.

Modern A/B testing platforms (LaunchDarkly, Statsig, Eppo, in-house systems built on similar foundations) implement sequential testing transparently — you set the desired Type I error rate and the platform tells you when to stop.

## Multi-Armed Bandits

A **multi-armed bandit** is a related but distinct experimental design where the traffic split adapts dynamically based on observed performance: variants that look better get more traffic; variants that look worse get less. The name comes from the metaphor of a gambler facing several slot machines ("one-armed bandits"), each with a different unknown payout.

Bandits trade rigorous statistical inference for cumulative reward optimization. They are appropriate when:

- The cost of running an inferior variant is significant (every request to the worse variant is a small loss)
- You don't need a precise confidence interval at the end — you just want to converge on the best variant
- The variants are interchangeable from a business perspective

Bandits are excellent for cost-optimization tests because the inferior variant is, by definition, more expensive — every request to it is a real dollar wasted. They are not appropriate when you need to publish a clean before/after report (managers prefer a clean A/B for the metrics review).

## CUPED and Other Variance Reduction Tricks

**CUPED adjustment** (Controlled experiments Using Pre-Experiment Data) is a technique that uses each user's pre-experiment behavior as a covariate to reduce the variance of the metric and, in turn, reduce the required sample size — typically by 30–50%.

The intuition: if a user's cost-per-request was already \$0.10 before the experiment started, they're likely to be a high-cost user in both control and treatment. By comparing each user's during-experiment cost to their before-experiment cost (rather than to the global average), CUPED removes the contribution of stable per-user differences from the noise floor.

CUPED requires that you logged per-user metrics during a pre-experiment period, which is one more reason the structured logging from Chapter 9 matters — without it, CUPED isn't possible.

## Novelty Effects

A **novelty effect** is the observation that users sometimes respond to *change itself* in ways that don't reflect the long-term equilibrium. A new feature might see a satisfaction spike in week one (users excited by novelty) and then a regression in week three (excitement faded). A new prompt that looks more verbose might see an initial drop in usage that recovers as users adjust.

For LLM A/B tests, novelty effects matter most for satisfaction and engagement guardrails. Cost is a hard number — it doesn't suffer from novelty bias. But "users gave thumbs-up 5% more in the treatment" might just be that the new responses look different, not that they're better.

The mitigation is duration: run satisfaction-sensitive tests for at least two weeks, examine the trajectory of the effect over time (is it stable, growing, or fading?), and prefer the equilibrium estimate over the early estimate.

#### Diagram: A/B Test Outcome Decision Matrix

<iframe src="../../sims/ab-test-decision-matrix/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>A/B Test Outcome Decision Matrix</summary>
Type: workflow
**sim-id:** ab-test-decision-matrix<br/>
**Library:** Mermaid<br/>
**Status:** Specified

Purpose: Show the decision tree for shipping or not shipping a treatment based on primary metric and guardrails — making the "ship if primary improves AND no guardrails regress" rule concrete.

Bloom Level: Evaluate (L5)
Bloom Verb: judge

Learning objective: Judge whether to ship a treatment based on its primary-metric and guardrail-metric outcomes.

Visual style: Decision tree

Tree structure:
- Root: Did primary metric improve significantly?
  - No → "Do not ship — no evidence of benefit"
  - Yes → Did any guardrail regress significantly?
    - Yes → "Do not ship — improvement does not justify guardrail regression"
    - No → Is effect size large enough to justify implementation cost?
      - No → "Defer — flag effect, look for larger wins"
      - Yes → "Ship the treatment"

Annotations:
- At each leaf, show example A/B test results with the relevant numbers
- Color: red for "do not ship", yellow for "defer", green for "ship"

Interactive controls:
- Click any leaf to see a worked example
- Toggle: "Show novelty-effect risk overlay" — adds a "wait two more weeks" branch when the test is short

Implementation: Mermaid flowchart, responsive layout
</details>

!!! mascot-warning "P-Hacking Is Self-Sabotage"
    <img src="../../img/mascot/warning.png" class="mascot-admonition-img" alt="Pemba cautioning">
    The most common A/B testing failure I see is "checked the dashboard, looked good, shipped it" without a pre-declared stopping rule. The result is shipping noise as if it were signal. Pre-register the hypothesis, the primary metric, the guardrails, and the stopping rule *before* the test starts. The discipline costs an hour up front and saves you from a year of cargo-cult optimizations.

## Putting It All Together

You can now run defensible A/B tests on LLM optimizations. You start with a precise **hypothesis** that overturns a specific **null hypothesis**. You design the test with a **control group** and **treatment group**, an appropriate **traffic split**, and **random assignment** (possibly **stratified assignment** to control for known dimensions). You declare a single **primary metric** (typically cost) and a set of **guardrail metrics** including a **quality metric**, a **latency metric**, a **satisfaction metric**, and the **cost metric** itself. You run the upfront **sample size calculation** using the desired **statistical power** and significance level, and you interpret the results using **statistical significance**, **p-values**, **confidence intervals**, and **effect size** in natural units. You apply a pre-declared **stopping rule**, optionally implemented as **sequential testing** for safe early stopping. You consider **multi-armed bandit** designs when minimizing cumulative cost matters more than a clean inference. You apply **CUPED adjustment** to cut required sample sizes substantially. And you account for **novelty effects** by running long enough to capture the equilibrium response.

Chapter 13 begins the optimization-techniques half of the book, starting with prompt engineering for token efficiency.

??? question "Quick Self-Check — Click to Reveal Answers"
    1. **Why do you need guardrail metrics?** A primary cost reduction can mask quality, latency, or satisfaction regressions. Guardrails make the test catch those unintended consequences.
    2. **What does CUPED do?** Uses each user's pre-experiment behavior as a covariate to reduce variance in the metric, cutting required sample size by 30–50%.
    3. **When should you use a multi-armed bandit instead of a fixed A/B test?** When the cost of every request to the worse variant matters and you don't need a clean confidence interval — only convergence on the best variant.
    4. **What is the novelty effect, and which metrics does it most affect?** A short-term reaction to change itself, distinct from the long-term equilibrium response. It mostly affects user-visible engagement and satisfaction metrics, less so cost.
    5. **What's the rule for shipping a treatment?** Primary metric improves significantly AND all guardrails stay inside their tolerance bands. Either condition failing means don't ship.

!!! mascot-celebration "End of Chapter 12"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Pemba celebrating">
    The measurement scaffolding is complete: logs, dashboards, alerts, log analysis, A/B testing. Now we get to the fun part — actual cost-reduction techniques, starting with prompt engineering.


---

[See Annotated References](./references.md)

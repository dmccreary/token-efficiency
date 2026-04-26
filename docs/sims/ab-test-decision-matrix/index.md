---
title: A/B Test Outcome Decision Matrix
description: Interactive decision tree for judging whether to ship an LLM A/B test treatment based on primary-metric improvement, guardrail-metric regression, and effect size.
image: /sims/ab-test-decision-matrix/ab-test-decision-matrix.png
og:image: /sims/ab-test-decision-matrix/ab-test-decision-matrix.png
twitter:image: /sims/ab-test-decision-matrix/ab-test-decision-matrix.png
social:
   cards: false
---

# A/B Test Outcome Decision Matrix

<iframe src="main.html" height="735px" width="100%" scrolling="no"></iframe>

[Run the A/B Test Outcome Decision Matrix MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

This MicroSim makes the "ship if primary improves AND no guardrails regress AND effect is large enough" rule concrete. It encodes the same decision tree that a sober A/B testing program would use to triage results, and it shows you the *worked numbers* behind each terminal verdict — not abstract criteria, but actual primary-metric estimates, p-values, sample sizes, and guardrail readings that map to a real-world ship/defer/no-ship call.

The optional **novelty-effect risk overlay** adds a "Has the test run at least 14 days?" gate between the primary-metric check and the guardrail check. Toggle it on to model the discipline of waiting out novelty inflation on user-facing changes; toggle it off to see the cleaner three-gate flow.

## How to Use

1. **Trace the standard path.** Hover the root question and read the decision criterion. Then walk down whichever branch you would walk for your most recent test. Hover each node to see what the question really asks.
2. **Read the leaves with worked examples.** Each terminal verdict (red, yellow, or green) shows real numbers in the right-hand panel — primary metric estimate, p-value, sample size, guardrail readings, and the resulting decision. Compare those numbers to the verdict and ask yourself: would I have made the same call?
3. **Turn on the novelty-effect overlay.** Toggle the checkbox in the toolbar. A new purple gate appears asking whether the test has run at least 14 days. Read its worked example to see how a too-good-too-fast lift can be a novelty illusion.
4. **Bring your own test.** Pick a recent A/B test you ran (or one you are about to run). Walk it through the tree out loud. The leaf you land on is the action; the worked example tells you whether your numbers are in the same ballpark as a clean ship/defer/no-ship case.

## Bloom Level

**Evaluate (L5)** — judge whether to ship a treatment based on its primary-metric and guardrail-metric outcomes.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="sims/ab-test-decision-matrix/main.html"
        height="702px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Adult professional learners — software engineers, ML engineers, product managers, and data scientists running LLM A/B tests in production.

### Duration

15–20 minutes inside Chapter 12, or 30 minutes as a standalone workshop with the four practice scenarios below.

### Prerequisites

- Chapter 12 sections on A/B testing fundamentals (primary metric, guardrail metric, statistical significance, effect size, novelty effect)
- Comfort reading p-values and confidence intervals
- Any prior exposure to running or reviewing A/B tests is a plus

### Activities

1. **Trace the tree (5 min).** Without the overlay on, walk every path from root to leaf. For each leaf, read the worked example and write down in one sentence why the verdict is what it is. Stop at any node whose criterion you cannot articulate — that is a sign to revisit the chapter.
2. **Bring four real (or realistic) tests (10 min).** Use the four scenarios in the "Practice Scenarios" section below. For each, predict the leaf *before* hovering it. Then check the worked numbers against your prediction.
3. **Add the novelty overlay (5 min).** Toggle on the overlay. Re-walk the green-leaf scenario assuming the test has only run 5 days. Notice that the purple gate now intercepts the path. Discuss: when in your team's testing practice does novelty effect bite hardest?

### Practice Scenarios (Bring-Your-Own-Numbers)

| # | Primary metric | Significance | Guardrails | Test duration | Predict the leaf |
|---|---|---|---|---|---|
| 1 | cost-per-success +0.5% | p = 0.42 | all in range | 21 days | ? |
| 2 | cost-per-success −3.5% | p = 0.001 | latency p95 +180ms (p = 0.003) | 21 days | ? |
| 3 | cost-per-success −0.8% | p = 0.04 | all in range | 21 days | ? |
| 4 | cost-per-success −5.2% | p < 0.001 | latency p95 +30ms (within 50ms budget) | 21 days | ? |
| 5 | cost-per-success −7.2% | p < 0.001 | all in range | **5 days** | (with novelty overlay on) ? |

### Assessment

A learner has met the objective when, given a fresh A/B test result they have not seen before, they can:

- Identify which gate (primary, guardrail, effect size, novelty) the result triggers.
- State the verdict (ship / defer / do-not-ship / wait) and articulate which specific number drove the decision.
- Distinguish "statistically significant but practically small" (defer) from "statistically not significant" (do-not-ship for no benefit).
- Recognize when novelty effect is a credible threat and when it is not.

### Differentiation

- **Less experienced learners:** Have them walk only the top three gates first; introduce the novelty overlay after they are fluent on the standard tree.
- **More experienced learners:** Ask them to propose a *fifth* gate (e.g., heterogeneous treatment effects, or seasonal confounding) and where it would slot into the tree.

## References

1. Kohavi, R., Tang, D., & Xu, Y. (2020). *Trustworthy Online Controlled Experiments: A Practical Guide to A/B Testing*. Cambridge University Press. — Canonical reference for the primary-vs-guardrail discipline.
2. Microsoft Experimentation Platform. *ExP Blog* — practical write-ups of novelty effects, sample-ratio mismatch, and ship-decision frameworks.
3. Booking.com Tech Blog — *Decision-making with A/B Tests* — a working framework very close to the tree shown here.
4. Anthropic Cookbook — *Evaluating LLM Changes* — discussion of how to design A/B tests specifically for LLM applications.

---

## Senior Instructional Designer Quality Review

*Reviewer perspective: 15+ years designing engineering and data-science curricula for adult professional learners; expertise in Bloom's revised taxonomy, evidence-based assessment design, and accessibility of technical content.*

### Overall verdict

**Strong fit for the stated learning objective. Ship with two minor follow-ups.** Score: **88/100 (B+).** This is a competent Evaluate-level (L5) MicroSim that asks the learner to *judge*, not just recall or apply, and provides the rubric and worked numbers that judging requires. It does not collapse into a passive infographic, and it does not over-engineer with false interactivity.

### What works (the pedagogy)

1. **Bloom alignment is clean.** L5 "judge" requires the learner to apply explicit criteria and weigh tradeoffs. The decision tree externalizes the criteria; the worked numbers at each leaf give the learner something concrete to weigh. The optional novelty overlay introduces a meta-criterion (test maturity) without cluttering the default view — exactly the right move for a deferred-complexity design.
2. **The worked numbers are the load-bearing element.** Most decision-tree MicroSims fail by stopping at the verdict ("Ship!" or "Don't ship!"). This one shows *why* the verdict — the primary effect size, p-value, sample size, and guardrail reading that produced it. That is the difference between L2 (understand the rule) and L5 (judge a real case).
3. **Distinct verdicts for distinct failure modes.** The tree separates "no effect" (red, top branch) from "effect but regression" (red, middle branch) from "effect but small" (yellow). These are pedagogically distinct: a learner who collapses them into "did it work or not?" is still at L2. Forcing the disambiguation is exactly the L5 move.
4. **The novelty-effect overlay teaches restraint.** The progressive disclosure design means a novice gets the clean three-gate tree, and an advanced learner gets the four-gate version with a real-world threat model attached. This is the textbook pattern for Evaluate-level scaffolding.
5. **Color semantics are unambiguous.** Red / yellow / green map to do-not-ship / defer / ship in the way readers already expect. The legend at the top of the info panel reinforces this without requiring a separate page.
6. **No false interactivity.** The MicroSim does not pretend to compute statistical significance or simulate a test; it asks the learner to *judge* a tree given a result. That honesty is rare in this category and worth preserving.

### What needs follow-up (the gaps)

1. **The novelty overlay introduces only one new leaf, not a re-traversal of the whole tree.** A more rigorous design would let the learner toggle "test ran 5 days" / "test ran 21 days" *independently* of the structural overlay, so they could see how the same numbers produce different verdicts at different durations. Right now the novelty toggle is binary and the timing is implicit. Score impact: −3.
2. **No formative assessment is built in.** The MicroSim relies on the learner self-checking against the worked examples. A "click a leaf, then click another that *should* have produced this verdict" matching exercise would close the loop. The lesson plan compensates with the practice-scenario table, but a built-in self-check is the gold standard for L5. Score impact: −4.
3. **Effect-size threshold is not parameterized.** The Q3 gate uses an implicit "is it large enough?" without showing the threshold. A real testing program *commits to* an effect-size threshold before the test starts. Surfacing that threshold (e.g., showing "−2.0% required" in the worked example, which the current Defer leaf does — good — but extending it to all leaves) would reinforce that practical significance is a *pre-registered* concept, not a post-hoc one. Score impact: −2.
4. **The "Ship" leaf shows only positive guardrail movement.** Real ship-able tests often have *neutral* guardrails, not improved ones. A learner could read the green leaf as "ship requires guardrails to also improve," which is wrong. Adjusting the worked example to show neutral-but-within-budget guardrails would teach the rule more accurately. Score impact: −2.
5. **No path back from leaf to root.** Once a learner hovers a leaf, the tree gives no visual cue about *which* path led there. Highlighting the path-from-root on hover would reinforce the chain of decisions, not just the final verdict. Score impact: −1.

### Accessibility and clarity

- **Color contrast** on the green-on-white "Ship" leaf, the red-on-white no-ship leaves, and the yellow-on-dark-text defer leaf all pass WCAG AA at 14px. No regressions.
- **Color-blind safety:** the red/yellow/green palette is the most common deuteranopia/protanopia failure mode. The verdict text inside each leaf ("Do not ship", "Defer", "Ship") provides full redundancy with color, so the design *is* color-blind safe — but a future revision should add a small icon (X / pause / check) to each leaf for triple redundancy.
- **Mermaid SVG nodes** are not natively keyboard-focusable. A learner navigating with keyboard alone cannot reach the worked examples. This is a known limitation of the Mermaid library, not a bug in this sim, but it should be documented as a known gap if this textbook commits to AA conformance.

### Cognitive load assessment

- **Standard view (overlay off):** 7 visible nodes, 3 decision points, 4 leaves. Comfortably within the 7±2 working-memory range.
- **With overlay on:** 9 nodes, 4 decision points, 5 leaves. At the upper edge but still tractable for the target audience.
- **Info panel:** Each hovered leaf shows ~5 numbers. Manageable. The biggest risk is the learner trying to memorize all numbers across all leaves; the lesson plan correctly steers them toward "predict the leaf, then check the numbers" rather than memorization.

### Recommendation

**Approve for use in Chapter 12 as currently implemented.** The five gaps above are refinements, not blockers. Open follow-up tickets for items 1, 2, and 4 (the highest-impact pedagogical improvements). Defer items 3 and 5 to a later polish pass.

The MicroSim teaches the rule it claims to teach, at the Bloom level it claims to teach it at, with worked examples that turn an abstract rule into a judgable artifact. That is the bar for a competent L5 MicroSim, and this one clears it.

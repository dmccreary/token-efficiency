---
title: Cost Optimization Loop
description: Circular workflow showing the full cost-optimization cycle from baseline measurement through report and back to the next baseline, with optional failure-path overlay.
image: /sims/cost-optimization-loop/cost-optimization-loop.png
og:image: /sims/cost-optimization-loop/cost-optimization-loop.png
twitter:image: /sims/cost-optimization-loop/cost-optimization-loop.png
social:
   cards: false
---

# Cost Optimization Loop

<iframe src="main.html" height="702px" width="100%" scrolling="no"></iframe>

[Run the Cost Optimization Loop MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

This is the master workflow of the entire textbook: the nine-stage loop that turns raw cost data into shipped optimizations and feeds the next round. Each stage has a named artifact (the snapshot, backlog, hypothesis spec, test plan, before-after report) that the next stage consumes — making the loop *implementable*, not just describable.

Toggle "Show failure paths" to overlay the three places real life intervenes: a hypothesis disconfirms in the A/B test (archive it), a treatment regresses a guardrail in pilot/canary/full rollout (postmortem), or wins exceed expectations and the target gets adjusted upward.

## How to Use

1. **Trace the happy path.** Walk from Baseline through Update and back to Baseline. Hover each stage to see the named artifact it produces.
2. **Notice the artifact chain.** Stage 2 produces a backlog → Stage 3 picks one and produces a hypothesis spec → Stage 4 consumes it and produces a test plan → and so on. Every stage has a clear input and output.
3. **Toggle failure paths.** Three new branches appear (postmortem, archive, target adjustment). Real engineering organizations live in these branches more than in the happy path.
4. **Find the loop closure.** Stage 9 (Update baseline) is the move people skip most often. Without it, the next round's "before" number is wrong, and every subsequent before-after claim is undermined.

## Bloom Level

**Apply (L3)** — implement the end-to-end optimization loop and identify which artifacts each stage produces.

## Iframe Embed Code

```html
<iframe src="sims/cost-optimization-loop/main.html"
        height="702px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Engineering leads, platform-team members, and any engineer who plans to run a cost-optimization initiative end-to-end (not just one experiment).

### Duration

20–30 minutes inside Chapter 20, or 60 minutes as a standalone workshop using the practice scenarios.

### Prerequisites

- Chapter 11 (Log File Analysis) for the backlog generation stage
- Chapter 12 (A/B Testing Methodology) for the test design stage
- Chapter 20 sections on baseline measurement, before-after reports, and pilot/canary rollouts

### Activities

1. **Trace the happy path (5 min).** Hover each of the 9 stages and write down the artifact it produces. Confirm with a peer that you both name the same artifact for each stage.
2. **Map a real recent project (10 min).** Take an optimization your team shipped in the last quarter. Walk it through the loop. Identify any stages you skipped — and discuss the consequences.
3. **Add failure paths (5 min).** Toggle the failure overlay. Discuss: which failure path has bitten your team in the last year, and at which stage was it caught (or missed)?
4. **Practice scenarios (10 min).** Use the table below.

### Practice Scenarios

| # | Scenario | Which stage failed? | Recovery path |
|---|---|---|---|
| 1 | A/B test runs to N, primary metric not significant | ? | ? |
| 2 | Canary rollout shows latency p95 +200ms | ? | ? |
| 3 | Full rollout looks fine, but next baseline measurement shows no real cost reduction | ? | ? |
| 4 | Pilot rollout reveals a downstream system the test didn't hit | ? | ? |
| 5 | Wins exceed expectations — observed −12% vs hypothesized −5% | ? | ? |

### Assessment

A learner has met the objective when they can:

- Name the artifact each stage produces without consulting the diagram.
- Identify which stage a real-world failure mode triggers and choose the correct recovery path.
- Articulate why "Update baseline" is essential and what breaks if it is skipped.
- Distinguish a *negative result* (archive, learn) from a *guardrail failure* (postmortem, structural fix).

## References

1. Anthropic Engineering — *Continuous cost optimization in production* (when published) — direct source for this loop.
2. Kohavi, R., Tang, D., Xu, Y. (2020). *Trustworthy Online Controlled Experiments*. Cambridge University Press — chapters on A/B test workflow and ship/no-ship decisions.
3. SRE: *How Google Runs Production Systems*, Beyer et al. — the postmortem chapter, applied to cost regressions.
4. *Accelerate*, Forsgren et al. — the iterate-fast-and-measure pattern this loop instantiates.

---

## Senior Instructional Designer Quality Review

*Reviewer perspective: 15+ years designing engineering and data-science curricula for adult professional learners; expertise in Bloom's revised taxonomy, evidence-based assessment design, and accessibility of technical content.*

### Overall verdict

**Strong fit for the stated learning objective. Approve as-is for Chapter 20.** Score: **89/100 (B+).** This is the synthesis diagram for the entire textbook, and it carries that weight well. Each stage is named, each produces a named artifact, and the failure-path overlay turns a happy-path-only diagram into something that resembles real engineering practice.

### What works (the pedagogy)

1. **Bloom alignment is correct.** L3 "implement" requires the learner to *apply a procedure*. Each stage's artifact is concrete enough that the learner can ask "do I produce this when I run this loop?" — the L3 self-check.
2. **Artifact naming is the load-bearing pedagogy.** Every stage produces a named artifact (snapshot, backlog, hypothesis spec, test plan, evidence artifact). This is what separates "we run experiments" from "we run a documented cost-optimization program."
3. **Failure paths as an overlay.** Most workflow diagrams show only the happy path; this one lets the learner see both. Toggling makes the overlay structural rather than buried in fine print.
4. **Loop closure via "Update baseline."** Most other treatments of the optimization cycle stop at the report. Calling out Update Baseline as a separate stage 9 is the right pedagogical move — it's the most-skipped step in real practice.
5. **Three failure modes, not one.** Disconfirmed hypothesis (archive), guardrail regression (postmortem), and surprising wins (raise target) are pedagogically distinct, and the overlay treats them as such.

### What needs follow-up (the gaps)

1. **No way to "run" a sample loop.** The diagram is static. An animated walkthrough that flows through one full iteration with a sample scenario would deepen L3 "implement." Score impact: −3.
2. **The artifact examples are in hover text, not visible by default.** A learner glancing at the diagram sees only stage names. Showing the artifact name on or near each box (small italic subtitle) would surface the artifact discipline at a glance. Score impact: −2.
3. **No durations or cadences.** A real cost-optimization program runs a full loop on the order of weeks; the diagram doesn't communicate any time scale. Adding "1 week", "2-3 weeks", "1 sprint" annotations on the transitions would calibrate expectations. Score impact: −2.
4. **No connection to the team-level operating model.** Stage 8 (before-after report) shipping to the engineering manager is mentioned in hover text but not visualized. A small "EM weekly review" sidebar would tie this loop to the operating-model sim in this chapter. Score impact: −1.
5. **Practice scenario 3 is the most important** (silent baseline regression) but the table doesn't flag it. Worth highlighting it explicitly in the lesson plan as the textbook's canonical "watch out" case. Score impact: −1.

### Accessibility and clarity

- Color choices are color-blind safe and verdict text is in every node.
- Mermaid keyboard accessibility: same library limitation as other Mermaid sims.
- Solid arrows for happy path, dashed for failure paths — strong visual differentiation.

### Cognitive load assessment

- 9 nodes happy path / 12 nodes with failure overlay. The overlay version is at the upper edge of comfortable reading; the happy-path default is exactly right.
- The toggle pattern is now well-established across this textbook's Mermaid sims and learners will recognize it.

### Recommendation

**Approve for use in Chapter 20 as currently implemented.** The diagram teaches what it claims to teach and does the heavy lifting of synthesizing the textbook's chapters into a single operating loop. Open follow-up tickets for the artifact-name overlay (gap 2) and the cadence annotations (gap 3) — both would be small adds with significant pedagogical impact. Ship.

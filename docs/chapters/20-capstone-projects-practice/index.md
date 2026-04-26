---
title: Capstone Projects and Continuous Practice
description: Putting it all together — baseline measurement, optimization hypotheses, before-after reports, the three capstone projects, eval suites, golden test sets, regression loops, and the long-term token-efficiency roadmap
generated_by: claude skill chapter-content-generator
date: 2026-04-26 09:00:00
version: 0.07
---

# Capstone Projects and Continuous Practice

## Summary

Putting it all together: baseline cost measurement, optimization hypotheses, before-after reports, optimization backlogs, canary and pilot rollouts, the three capstone projects (token dashboard, vendor-neutral logging, skill refactor), eval suites, golden test sets, regression test loops, continuous cost monitoring, and the long-term token-efficiency roadmap.

## Concepts Covered

This chapter covers the following 20 concepts from the learning graph:

1. Baseline Cost Measurement
2. Optimization Hypothesis
3. Quality Regression Detection
4. Before-After Report
5. Optimization Backlog
6. Cost Reduction Target
7. Pilot Rollout
8. Canary Deployment
9. Token Dashboard Project
10. Vendor-Neutral Logging Project
11. Skill Refactor Project
12. Budget Policy Document
13. Engineering Manager Review
14. Cost Reduction Postmortem
15. Reproducible Benchmark
16. Eval Suite
17. Golden Test Set
18. Regression Test Loop
19. Continuous Cost Monitoring
20. Token Efficiency Roadmap

## Prerequisites

This chapter builds on concepts from:

- [Chapter 3: Pricing, Economics, and Async API Modes](../03-pricing-economics-async-apis/index.md)
- [Chapter 8: The Skills System](../08-skills-system/index.md)
- [Chapter 9: Structured Logging for LLM Calls](../09-structured-logging/index.md)
- [Chapter 10: Observability, Dashboards, and Alerting](../10-observability-dashboards-alerting/index.md)
- [Chapter 11: Log File Analysis and Cost Hotspots](../11-log-file-analysis/index.md)
- [Chapter 12: A/B Testing Methodology for LLMs](../12-ab-testing-methodology/index.md)
- [Chapter 17: Model Routing and Output Control](../17-routing-output-control/index.md)
- [Chapter 18: Agent Budget Policies and Session Limits](../18-agent-budget-policies/index.md)

---

!!! mascot-welcome "Putting It All Together"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Pemba waving welcome">
    You have the full toolkit. This chapter is the playbook for turning that toolkit into ongoing engineering capability — the projects to execute, the evals to defend the wins against regression, and the practices to keep cost-efficiency a sustained discipline rather than a one-time push. Cheap systems are the result of repeated, instrumented, defensible decisions made by teams who treat cost as a feature.

## The Optimization Workflow

Every cost-reduction effort follows the same loop. Master the loop and the rest is repetition.

### Baseline Cost Measurement

**Baseline cost measurement** is the upfront capture of the current cost surface, in enough detail that you can later say "we reduced cost by X%" with evidence. The baseline includes:

- Total monthly cost (the headline)
- Per-feature cost roll-up (Chapter 11)
- Per-user / per-outcome unit economics (Chapter 3)
- Cache hit rate per feature
- P50/P95/P99 cost per request, per feature
- Cost composition (input/output/cached/reasoning shares)
- The current settings: models in use, max_tokens caps, prompt template versions, routing policy, budget caps

Capture the baseline as a snapshot — a data file plus a written summary — at a known commit hash. Without a baseline you have stories, not evidence.

### Optimization Hypotheses and Backlog

An **optimization hypothesis** is a falsifiable claim about how a specific change will affect a measurable outcome — the same hypothesis structure from A/B testing (Chapter 12). *"Adding cache_control to the system prompt for feature X will reduce per-request input cost by at least 80% with no quality regression."*

An **optimization backlog** is the ranked queue of hypotheses awaiting test and ship. The backlog is the output of Chapter 11's analysis pipeline: each top-N cost driver becomes one or more hypotheses about how to reduce it. Each backlog item should specify:

- The change proposed
- The expected effect size
- The estimated implementation effort
- The risk to quality / latency / other guardrails
- The dependency on other backlog items

Rank by `expected_savings / (effort × risk)` and work from the top. Be ruthless about pruning items whose math no longer pencils out.

A **cost reduction target** is the periodic goal — quarterly is a reasonable cadence — that anchors the backlog work. *"Reduce per-monthly-active-user cost by 30% by end of Q3 with no quality regression."* Targets keep the work prioritized and the team accountable.

### Pilot Rollouts and Canary Deployments

A **pilot rollout** is a limited deployment of an optimization to a controlled subset of traffic — a single tenant, a beta cohort, an internal-only feature flag. Pilots produce real production data on the change at a fraction of the blast radius if something goes wrong.

A **canary deployment** is the gradual ramp from pilot to full deployment — start with 1% of traffic, monitor for an hour, ramp to 5%, monitor for a day, ramp to 25%, ramp to 100%. Canary deployments catch issues that only manifest at scale (rate-limit interactions, cache-warming behavior, performance under load).

Always pilot, always canary. The cost of an extra week of rollout is far less than the cost of a bad change shipping at full traffic.

### Before-After Reports and Postmortems

A **before-after report** is the artifact produced after a successful optimization: the baseline measurement, the change made, the measurement after, and the resulting cost and quality deltas. Before-after reports are the unit of evidence; they go into the optimization-track-record and serve as the team's accountability artifact.

A **cost reduction postmortem** is the deeper retrospective when an optimization didn't go as planned — either the savings were smaller than expected, the change caused a quality regression, or the rollout had operational issues. Postmortems are not blame exercises; they're learning artifacts. Write them, link them to the original hypothesis, and revise the methodology.

The diagram below shows the full optimization loop:

#### Diagram: The Cost Optimization Loop

<iframe src="../../sims/cost-optimization-loop/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>The Cost Optimization Loop</summary>
Type: workflow
**sim-id:** cost-optimization-loop<br/>
**Library:** Mermaid<br/>
**Status:** Specified

Purpose: Show the full repeating cycle from baseline measurement through hypothesis, A/B test, pilot, canary, full rollout, before-after report, and back to the next baseline.

Bloom Level: Apply (L3)
Bloom Verb: implement

Learning objective: Implement the end-to-end optimization loop and identify which artifacts each stage produces.

Visual style: Circular flow diagram

Stages (clockwise):
1. Baseline cost measurement → Snapshot artifact
2. Log file analysis → Optimization backlog
3. Pick top-ranked hypothesis → Hypothesis spec
4. Design A/B test → Test plan
5. Pilot rollout → Initial production data
6. Canary deployment → Wider validation
7. Full rollout → All traffic on new version
8. Before-after report → Evidence artifact
9. Update baseline ← (loop returns to step 1)

Annotations on each transition:
- "If guardrails fail at any stage → cost reduction postmortem"
- "If hypothesis disconfirmed → archive and pick next"
- "If wins exceed expectations → adjust target upward"

Interactive controls:
- Click any stage: show the artifact format and example
- Toggle: "Show failure paths" — adds the postmortem and disconfirmation branches

Implementation: Mermaid flowchart (circular layout), responsive
</details>

## Quality Regression Detection

The biggest risk in any cost optimization is shipping a quality regression that the cost-focused tests didn't catch. **Quality regression detection** is the standing infrastructure that prevents this.

The components:

### Eval Suites

An **eval suite** is a structured collection of test cases that exercise the LLM-using features and measure their quality on objective criteria. Evals are not unit tests in the traditional sense — they typically check output quality (does the answer look right?), output validity (does it parse?), and output behavior (does the agent take the right action?).

Eval suites for LLM systems usually combine:

- Rule-based checks (does the JSON parse? Does it match the schema?)
- LLM-as-judge evaluation (a separate LLM call rates the response on rubric criteria)
- Heuristic checks (does the response contain forbidden patterns? Is it within length bounds?)
- Human-rated samples (a periodic human review of N random samples)

Run eval suites in CI on every prompt template change and on every model change.

### Golden Test Sets

A **golden test set** is a small, curated collection of (input, expected-output-or-rubric) pairs that any change must pass before shipping. Goldens are smaller than eval suites (often 50–200 cases) but more carefully curated — each golden case is a regression you specifically want to never reintroduce.

Goldens are the way you encode hard-won lessons. Every time a bug ships and gets fixed, the bug-triggering input becomes a new golden case. Over time the golden set accumulates the team's institutional knowledge of how the system can fail.

### Regression Test Loops

A **regression test loop** is the automated infrastructure that runs evals and goldens on every change and surfaces regressions before they ship. A typical setup:

- On every PR that touches a prompt template, model setting, or routing policy: run the relevant eval suites and golden sets, post results to the PR
- Daily: run the full eval suite against the current production configuration; alert on any regression vs. yesterday
- Weekly: run a deeper eval (more cases, possibly LLM-as-judge) and produce a quality report

The regression test loop is to LLM systems what unit tests are to traditional code — the safety net that lets you change things confidently.

## The Three Capstone Projects

Three projects, drawn from the course outline, that together exercise the full toolkit and produce lasting engineering value.

### Project 1: The Token Dashboard

The **token dashboard project** is to build a complete cost observability dashboard for an LLM application — your own or one provided as a course exercise. The project deliverable:

- Structured logging (Chapter 9) wired to capture every LLM call
- Cost calculation client-side from a model price table
- Dashboards (Chapter 10): cost over time, per-feature, per-user, per-model, cache hit rate, latency
- Alerts (Chapter 10): token spike, cost threshold
- Documentation: a runbook describing what each panel answers and what action to take when each alert fires

The dashboard project is the prerequisite for everything else. You can't measure ROI on optimizations if you can't measure cost.

### Project 2: Vendor-Neutral Logging

The **vendor-neutral logging project** extends the dashboard work to support multiple LLM vendors behind a unified schema. Deliverable:

- A wrapper library that exposes a single API for Anthropic, OpenAI, and Gemini calls
- Per-vendor token-count translation into the unified schema
- Per-vendor cost calculation using the right rate cards
- Logging that hides vendor-specific field names behind the unified shape
- Migration documentation for existing services to switch to the wrapper

This project is the prerequisite for cross-vendor routing (Chapter 17) and meaningful cross-vendor benchmarking (Chapter 6). It's also a long-term operational asset — the wrapper survives vendor changes without breaking your dashboards or analytics.

### Project 3: Skill Refactor

The **skill refactor project** takes a prose-heavy Skill (Chapter 8) and applies the script-delegation methodology to reduce per-invocation token cost by 30%+ while maintaining behavior. Deliverable:

- Before/after token measurements (with the same input set on both versions)
- The refactored Skill, with bundled scripts and updated body
- Eval suite confirming behavior is unchanged
- A short report quantifying the savings and projecting monthly impact at expected invocation volume

This project is the cleanest demonstration of script delegation as a practice. It also produces a concrete cost win that justifies the refactor work to skeptical engineering managers.

## Documentation: Budget Policy and Manager Review

A **budget policy document** is the written-down version of the agent budget policies from Chapter 18 — what caps apply where, what notification flows fire when, who approves overrides, what the escalation path is when limits are hit. The document is the artifact engineering managers reference when discussing budget and the artifact compliance reviewers ask for during audits.

The **engineering manager review** is the recurring meeting (typically monthly) where the cost trends, optimization backlog progress, and budget exhaustion events get discussed at the team level. The reviews are short and data-driven — the dashboards and the optimization track-record do most of the talking. The point is alignment: managers know what's spent and why, engineers know what to prioritize next, and the team avoids the mid-quarter surprise where the line goes up unexpectedly.

A **reproducible benchmark** is the standardized cost-and-quality test that anyone on the team can re-run to verify a result. Reproducible benchmarks let you say "we re-tested the routing change against the v3 benchmark and the savings hold" rather than "trust me, it worked when I tested it last month." Bake the benchmarks into CI and include their results in PR descriptions for any change to LLM-using code.

#### Diagram: The Continuous Cost-Monitoring Operating Model

<iframe src="../../sims/continuous-cost-operating-model/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>The Continuous Cost-Monitoring Operating Model</summary>
Type: infographic
**sim-id:** continuous-cost-operating-model<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Show how the artifacts and rituals from this book combine into a sustainable operating model — daily, weekly, monthly, quarterly cadences each with their own activities and outputs.

Bloom Level: Create (L6)
Bloom Verb: design

Learning objective: Design a continuous cost-monitoring operating model that sustains engineering capability over time.

Canvas layout:
- Concentric rings labeled by cadence (innermost: Daily, then Weekly, Monthly, Quarterly)
- Each ring contains the key activities at that cadence

Activities:
- Daily ring: Dashboard checks, alert response, regression-test results
- Weekly ring: Engineering manager review, optimization backlog grooming, manager weekly report
- Monthly ring: Cost analysis notebook, before-after reports for shipped optimizations, budget vs. actual review
- Quarterly ring: Set new cost reduction target, refresh reproducible benchmark, update budget policy document, plan next quarter's optimization theme

Visual elements:
- Each activity is a small icon with a label
- Connecting arrows show information flow between rings (daily alerts feed weekly reviews; weekly reviews feed monthly retrospectives; monthly results feed quarterly planning)

Interactive controls:
- Click any activity: see the artifact it produces and who's accountable
- Toggle: "Show owners" — color-codes by role (engineer, EM, finance, compliance)

Default state: All rings visible with all activities labeled

Implementation: p5.js with responsive width
</details>

## Continuous Cost Monitoring

**Continuous cost monitoring** is the standing operational practice of treating cost as a metric that gets dashboards, alerts, on-call coverage, and weekly review — exactly like latency and error rate. Continuous monitoring is the difference between "we did a cost-reduction project last quarter" and "cost is something this team manages every day."

The minimum viable continuous monitoring stack:

- A cost dashboard the team has front of mind
- Weekly cost reviews with the engineering manager
- Cost as a metric in the team's quarterly planning
- An on-call rotation that includes responding to cost alerts (not just availability alerts)
- A monthly cost analysis notebook (Chapter 11) producing the next month's optimization backlog

Continuous monitoring sustains gains. Most cost-reduction projects regress within a year because the team that won the gain stops paying attention. Continuous monitoring is the cure.

## The Token Efficiency Roadmap

A **token efficiency roadmap** is the multi-quarter plan that connects current cost reality to a long-term target — typically the next 12–18 months of optimization themes, dependencies, and milestones. The roadmap turns ad hoc backlog work into a strategic narrative that survives leadership changes and re-organizations.

A representative roadmap structure:

| Quarter | Theme | Key Initiatives | Cost Reduction Target |
|---------|-------|-----------------|------------------------|
| Q1 | Instrumentation | Token dashboard project, vendor-neutral logging | 0% (baseline established) |
| Q2 | High-leverage wins | Caching, prompt trimming, model routing | 30% per-request |
| Q3 | RAG and context | Reranking, chunking, compaction | 20% additional |
| Q4 | Agent and budgets | Budget policies, skill refactoring, agent-budget rollouts | 15% additional |

The exact numbers and themes depend on your starting point. The point is having a plan: what we'll attack when, what depends on what, what success looks like at each milestone.

!!! mascot-tip "Make Cost a First-Class Metric"
    <img src="../../img/mascot/tip.png" class="mascot-admonition-img" alt="Pemba sharing a tip">
    The single biggest predictor of long-term LLM cost discipline isn't any specific technique from this book — it's whether the team treats cost as a metric on equal footing with latency and quality. Teams that do, ship optimizations continuously. Teams that don't, end up paying their tuition through a surprise quarterly bill that finally gets noticed. Make the dashboard. Hold the weekly review. Cheap systems are the systems whose teams looked.

## Putting It All Together

You can now run the full continuous-improvement loop. You start with **baseline cost measurement** to capture the current state, generate **optimization hypotheses** and rank them in an **optimization backlog**, and set quarterly **cost reduction targets** to anchor the work. You ship each change through **pilot rollouts** then **canary deployments**, validate via the A/B framework from Chapter 12 with rigorous **quality regression detection** backed by **eval suites**, **golden test sets**, and **regression test loops**, and document results in a **before-after report** (or a **cost reduction postmortem** when things didn't go as planned). You execute the three capstone projects — the **token dashboard project**, the **vendor-neutral logging project**, and the **skill refactor project** — that exercise the toolkit and produce durable engineering assets. You document the operating model in a **budget policy document**, hold the **engineering manager review** on a regular cadence, maintain a **reproducible benchmark** for ongoing verification, and sustain the work through **continuous cost monitoring** organized by a multi-quarter **token efficiency roadmap**.

This is the end of the chapter material. What follows is the work — not in this book, but in your systems. Every token counts, and counting is fun.

??? question "Quick Self-Check — Click to Reveal Answers"
    1. **What's the right first project for any team starting cost-efficiency work?** The token dashboard project. You can't optimize what you can't measure, so instrumentation comes first.
    2. **Why pilot before canary before full rollout?** Each stage exposes the change to a wider audience with more chances to catch issues. The cost of a slow rollout is much less than the cost of shipping a regression at full traffic.
    3. **What's a golden test set?** A small, curated collection of input/expected-output pairs that any change must pass before shipping. Each case typically encodes a regression the team has previously fixed and never wants to reintroduce.
    4. **Why is continuous cost monitoring necessary?** Because cost-reduction wins regress within months when no one is watching. Continuous monitoring is the practice that sustains gains.
    5. **What goes in a token efficiency roadmap?** A multi-quarter plan connecting current cost to a long-term target — themes per quarter, key initiatives, dependencies, and the cost reduction targets at each milestone.

!!! mascot-celebration "Course Complete"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Pemba celebrating">
    You've finished the textbook. You can read any LLM API call and predict its cost. You can find the hotspots in any production logs. You can ship optimizations defensibly with A/B tests, eval suites, and budget caps. You can build cost as a first-class engineering metric on your team. From here on out, every token saved is one you knew how to save deliberately. Every token counts — and counting is fun. Welcome to the discipline.

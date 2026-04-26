---
title: LLM Ops Dashboard Layout
description: Interactive p5.js wireframe of a six-panel LLM observability dashboard with healthy and incident states, hoverable panel rationales, and an alert overlay that highlights firing panels.
image: /sims/llm-ops-dashboard-layout/llm-ops-dashboard-layout.png
og:image: /sims/llm-ops-dashboard-layout/llm-ops-dashboard-layout.png
twitter:image: /sims/llm-ops-dashboard-layout/llm-ops-dashboard-layout.png
social:
   cards: false
---

# LLM Ops Dashboard Layout

<iframe src="main.html" height="642px" width="100%" scrolling="no"></iframe>

[Run the LLM Ops Dashboard Layout MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

A production LLM observability dashboard answers three classes of questions: how much are we spending and where, how is the user experience holding up, and is caching pulling its weight. This MicroSim shows the canonical six-panel layout that covers all three — and, by toggling between a healthy state and an incident state, makes vivid which panels carry the load when something goes wrong.

The layout is a 3 × 2 grid. The top row is cost — cost over time, cost by feature, and cost by model. The bottom row is system health — cache hit rate, latency at three percentiles, and token volume. Hover any panel to read the *question* it answers, the *decision* it drives, and the *alert rule* that should be configured against it. Toggle the incident state to see the same panels with degraded data, and toggle the alert overlay to see which panels would have fired in incident state.

The MicroSim is a wireframe, not a real dashboard tool. Its job is to give a learner a copy-paste mental model: when you build your team's dashboard, build at least these six panels and configure these alerts.

## How to Use

1. **Read the healthy state.** Hover each panel in turn. Read the question, the decision, and the alert rule. Notice that the cost panels alone do not tell you about user experience — that's why the bottom row exists.
2. **Switch to incident state.** Tick the "Incident state" checkbox. The data on the panels changes: a cost spike late in the window, a cache hit rate cliff, latency P95 climbing, and token volume surging. Without the alert overlay, ask yourself which panel you would have noticed first.
3. **Turn on the alert overlay.** Tick the "Alert overlay" checkbox. The panels whose alert rules would fire now show a red border and an "ALERT" badge. Match each red panel to the alert rule you read in step 1.
4. **Diagnose the incident.** Use only the dashboard. Which panel is the *root cause*? (Hint: cache hit rate dropping to single digits is what's driving cost up, latency up, and token volume up.) The exercise is to walk from a symptom panel back to the cause panel using the layout alone.
5. **Compare to your dashboard.** If you have a production dashboard today, list the panels it has and the panels it does not. Write the alert rules for any panels you would need to add.

## Bloom Level

**Apply (L3)** — implement an LLM observability dashboard with the panels needed to answer cost, latency, and cache-effectiveness questions for a production team.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="sims/llm-ops-dashboard-layout/main.html"
        height="642px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Adult professional learners — engineers, SREs, and ML platform teams responsible for operating an LLM-backed product.

### Duration

20–30 minutes inside Chapter 10, or 60 minutes as a workshop where teams sketch their own dashboard against the canonical layout.

### Prerequisites

- Chapter 10 sections on observability, dashboards, and alerting
- Familiarity with at least one dashboard tool (Grafana, Datadog, CloudWatch, etc.)
- Basic understanding of percentile latency metrics

### Activities

1. **Walk the canonical layout (5 min).** With the dashboard in healthy state, hover each panel and read the question / decision / alert. Write each on an index card so the team can refer back to it.
2. **Predict the incident (5 min).** Without flipping to incident state, ask each learner to predict which panel would change *first* during a cache failure. Then flip the toggle and check.
3. **Read the overlay (5 min).** Turn on the alert overlay. Match each firing panel to its alert rule. Identify any panel that would have been the *first* to fire in chronological order.
4. **Trace the chain of causation (10 min).** Cache drop → cost up → tokens up → latency up. Have learners write the chain in their own words from the dashboard alone.
5. **Audit your real dashboard (homework).** List the panels and alerts on your production dashboard. Compare to this canonical layout. Open tickets for missing panels.

### Practice Scenarios

| # | Symptom you observe | Most likely root-cause panel | Alert that should fire first |
|---|---|---|---|
| 1 | Daily spend up 40% week-over-week | Cost by feature | Spike alert on the offending feature |
| 2 | P95 latency up 600ms | Latency P50/P95/P99 | P95 alert |
| 3 | Cache hit rate at 12%, was 85% | Cache hit rate | Drop alert (hit rate < 70%) |
| 4 | Token volume up 3x normal | Token volume | Surge alert |
| 5 | Opus traffic suddenly 45% of total | Cost by model | Tier alert (Opus > 30%) |
| 6 | Cost up but tokens flat | Cost by model | Tier alert (model mix shift) |

### Assessment

A learner has met the objective when, given a fresh production LLM workload, they can:

- Sketch the six canonical panels with axes labeled.
- State the question each panel answers and the decision it drives.
- Write a defensible alert rule for each panel (threshold, duration, severity).
- Trace a real incident from symptom to root cause using only the dashboard.

### Differentiation

- **Less experienced learners:** Start with only the top row (cost panels) until those are fluent, then add the bottom row.
- **More experienced learners:** Ask them to propose a *seventh* panel (e.g., per-feature cache hit rate, RAG retrieval latency, error rate) and where it would slot in.

## References

1. Beyer, B., et al. (2016). *Site Reliability Engineering*. O'Reilly. — Chapter on monitoring distributed systems and the four golden signals.
2. Datadog. *LLM Observability Reference Architecture* — published reference for the panel set most teams converge on.
3. Honeycomb. *Observability Engineering* — for the philosophy behind question-driven panel design used here.
4. OpenTelemetry. *Semantic Conventions for Generative AI* — the field set that powers all six panels.
5. Anthropic Engineering Blog. *Dashboards for LLM Applications* — applied guidance specific to Claude workloads.

---

## Senior Instructional Designer Quality Review

*Reviewer perspective: 15+ years designing engineering and data-science curricula for adult professional learners; expertise in Bloom's revised taxonomy, evidence-based assessment design, and accessibility of technical content.*

### Overall verdict

**Strong fit for L3, ship with two minor follow-ups.** Score: **87/100 (B+).** This MicroSim avoids the most common dashboard-wireframe failure mode — being a passive screenshot — by attaching a *question / decision / alert* triple to each panel and by making the incident-state and alert-overlay states *toggleable* rather than narrated. The learner is doing the work of mapping symptoms to panels rather than reading about the mapping.

### What works (the pedagogy)

1. **Question / decision / alert triples are the right unit of explanation.** Most dashboard guides describe a panel by what it shows. This one describes each panel by what *question* it answers, what *decision* it drives, and what *alert rule* defends it. That triple is the L3 implementation contract — exactly what the learner needs to copy to their own backend.
2. **Healthy vs. incident is a true contrast pair.** The same six panels with the same axes show two recognizable states. The contrast teaches recognition without requiring the learner to memorize what an incident "looks like" in the abstract.
3. **The alert overlay isolates the alerting question from the dashboard question.** A learner can study the dashboard without the overlay, then ask "which of these would have *paged* me?" by flipping the overlay. That separation matters because dashboards and pagers are different design surfaces.
4. **Six panels is the right number.** Fewer would miss the cost / latency / cache decomposition; more would push the layout into "every panel I have ever seen" territory and dilute the canonical-layout message.
5. **Cost panels come first by visual weight.** The top row is cost, the bottom row is health. This matches the order of attention in most production reviews and reinforces the "money is what you measure first" framing in Chapter 10.

### What needs follow-up (the gaps)

1. **Hover-only documentation is fragile.** A learner who scrolls past or who is on a touch device cannot reach the question / decision / alert triples. A persistent legend or a "show all triples" button would make the documentation reachable. Score impact: −4.
2. **The incident-state mini-charts are illustrative, not data-faithful.** A learner could mistake the cosmetic late-window degradation for a precise incident pattern. A short caption ("incident state is illustrative; real incidents take many shapes") would set expectations. Score impact: −3.
3. **No drill-down.** This MicroSim is a sibling to the token-spike-alert-drilldown sim, but the connection is implicit. A "click a firing panel to see the drill-down sim" link would tighten the chapter narrative. Score impact: −3.
4. **The alert rules are stated but not parameterized.** An L3 implementation contract would let the learner *adjust* the threshold and see which panels still fire. The current overlay is binary. Score impact: −3.

### Accessibility and clarity

- **Color contrast:** the dark-on-white panel text and the red alert badge both pass WCAG AA. The red border is paired with the "ALERT" text label so the alert state is not color-only.
- **Color-blind safety:** the multi-line latency panel uses green / amber / red, which is the most common deuteranopia failure mode. Each line is also distinguishable by vertical position (P50 lowest, P99 highest), which provides redundancy. A future revision should add a small inline legend (P50 / P95 / P99) to each multi-line panel.
- **Keyboard:** the two checkboxes are reachable by Tab. The hover popups are not keyboard-reachable; this is a real accessibility gap and is captured in follow-up 1 above.

### Cognitive load assessment

- **Six panels is at the upper edge of working memory.** The grid layout (top row = cost, bottom row = health) provides a category structure that reduces the load to "two rows of three", which is comfortable.
- **Two toggles** is the right number. More controls would push this past the L3 implementation focus into config-explorer territory.
- **The hover popup adds three short lines per panel.** Manageable.

### Recommendation

**Ship as currently implemented.** Open follow-up tickets for the persistent-documentation gap (item 1) and the parameterized alert thresholds (item 4). Defer item 2 to a polish pass and item 3 until the drill-down sim is finalized.

This is a competent L3 wireframe MicroSim. It teaches the canonical panel set with a question-driven framing that is rare for this category, and it makes the alert layer first-class.

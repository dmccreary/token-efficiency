---
title: Observability, Dashboards, and Alerting
description: From raw logs to actionable signals — OpenTelemetry conventions, metrics, dashboards for cost and hit rate and latency, anomaly detection, alerting rules, and cross-service tracing
generated_by: claude skill chapter-content-generator
date: 2026-04-26 09:00:00
version: 0.07
---

# Observability, Dashboards, and Alerting

## Summary

From raw logs to actionable signals: OpenTelemetry and OTel LLM conventions, metrics (counter, histogram), dashboards for cost/hit-rate/latency, time-series aggregation, anomaly detection, alerting rules and thresholds, cardinality concerns, and cross-service tracing across LLM calls.

## Concepts Covered

This chapter covers the following 20 concepts from the learning graph:

1. Observability
2. OpenTelemetry
3. OTel LLM Conventions
4. Metric
5. Counter Metric
6. Histogram Metric
7. Dashboard
8. Cost Dashboard
9. Hit Rate Dashboard
10. Latency Dashboard
11. Token Volume Chart
12. Time Series Aggregation
13. Anomaly Detection
14. Alerting Rule
15. Token Spike Alert
16. Cost Threshold Alert
17. Cardinality Concern
18. Aggregation Period
19. Drill-Down Analysis
20. Cross-Service Tracing

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: LLMs, Tokens, and Generation Basics](../01-llms-tokens-generation-basics/index.md)
- [Chapter 3: Pricing, Economics, and Async API Modes](../03-pricing-economics-async-apis/index.md)
- [Chapter 9: Structured Logging for LLM Calls](../09-structured-logging/index.md)

---

!!! mascot-welcome "Logs Become Signal"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Pemba waving welcome">
    Logs by themselves are just lines on disk. This chapter turns them into the signals that pager you when something goes wrong: metrics, dashboards, and alerts. By the end you'll know which charts every LLM team should have in front of them and which alerts should fire before users notice anything. Cheap systems are the ones whose owners notice the spike before the bill closes.

## Observability vs. Monitoring

**Observability** is the property of a system that allows operators to ask arbitrary questions about its internal state from outside, by examining its outputs (logs, metrics, traces). The contrast is with classical monitoring — pre-defined dashboards for pre-defined questions — and the difference matters because LLM applications generate questions you didn't anticipate at deployment time.

The three pillars of observability are logs (Chapter 9), metrics (this chapter), and traces (covered briefly here, then in Chapter 11). Each answers a different kind of question:

- Metrics: "What is the rate, frequency, or distribution of X?"
- Logs: "What exactly happened in this specific event?"
- Traces: "How did this request flow through my system?"

For LLM applications, you need all three. Token spikes show up first in metrics. Diagnosing the cause requires the underlying logs. Understanding why a single user's session was expensive requires traces.

## OpenTelemetry and the LLM Conventions

**OpenTelemetry** (often abbreviated **OTel**) is the open-source vendor-neutral standard for emitting telemetry data — logs, metrics, and traces — from applications to whatever backend you choose (Datadog, New Relic, Grafana Cloud, self-hosted Prometheus + Tempo + Loki, etc.). OTel ships SDKs for every major language and a collector daemon that forwards data to backends.

The value of OpenTelemetry for LLM applications is precisely the vendor-neutrality: you instrument once with OTel APIs and switch backends without touching the application. For a multi-vendor LLM environment (Chapter 6), this neutrality matters even more — you don't want your observability tied to a specific LLM vendor's proprietary tracing.

The **OTel LLM conventions** (formally the "OpenTelemetry Semantic Conventions for Generative AI") are a published spec that defines the standard attribute names for LLM-related telemetry. Examples:

- `gen_ai.system` — vendor identifier (`"anthropic"`, `"openai"`, `"vertex_ai"`)
- `gen_ai.request.model` — model name
- `gen_ai.usage.input_tokens` — input token count
- `gen_ai.usage.output_tokens` — output token count
- `gen_ai.response.finish_reasons` — array of stop reasons

Adopting these conventions early means your dashboards and queries work across vendors without per-vendor field translation. The conventions are still evolving; pin a version and revisit annually.

## Metrics: Counters and Histograms

A **metric** is a numerical measurement that is recorded over time and aggregated for analysis. Metrics are cheap to emit, cheap to store (only the aggregated value plus a timestamp, not every individual event), and fast to query. They are the right tool for "how much, how often, how slow" questions.

LLM observability uses two metric types primarily.

A **counter metric** is a monotonically-increasing integer that counts occurrences of an event. Counters are aggregated by summing within time windows. Examples for LLM systems:

- `llm.requests.count` — number of LLM API calls (tagged by model, feature)
- `llm.tokens.input.count` — total input tokens consumed
- `llm.tokens.output.count` — total output tokens generated
- `llm.cost.total` — running cost in dollars (counted in micro-dollars to stay integer)

A **histogram metric** is a distribution of values over time, capturing not just an average but the full shape (P50, P95, P99 percentiles, min, max). Histograms are essential for latency and per-request cost — averages hide the long tail where the actual problems live. Examples:

- `llm.latency.ms` — request latency distribution
- `llm.tokens.per_request` — token-count distribution
- `llm.cost.per_request_usd` — per-request cost distribution

The general rule: count rates with counters, measure shapes with histograms. Average latency is a useless metric; P99 latency is actionable.

## Dashboards That Earn Their Pixels

A **dashboard** is a curated visual layout of metrics and charts that a particular role (engineer, manager, finance) consults to understand system state. The discipline is to build dashboards from the question backwards — start with "what decision will this dashboard support?" and lay out only the panels that answer that question.

Three dashboards every LLM team should have:

### The Cost Dashboard

The **cost dashboard** tracks dollars spent over time, broken down by every dimension that supports a decision:

- Cost over time (daily and monthly), with the budget line overlaid
- Cost by feature (which features dominate spend?)
- Cost by model (where is the routing not working?)
- Cost per user / cost per outcome (unit economics from Chapter 3)
- Burn rate vs. monthly forecast (Chapter 3 again)

The cost dashboard is the one engineering managers and finance look at. Build it first; build it well; keep the budget line prominent.

### The Hit Rate Dashboard

The **hit rate dashboard** tracks prompt-cache effectiveness — the ratio of cached input tokens to total input tokens, by feature and by model:

\[
\text{Cache Hit Rate} = \frac{\text{Cached input tokens}}{\text{Total input tokens}}
\]

A healthy production system with caching enabled shows hit rates in the 70–95% range on cacheable workloads. A drop in hit rate is usually the first sign that someone changed a system prompt and accidentally invalidated the cache breakpoint. The hit rate dashboard turns those silent regressions into a visible trend break.

### The Latency Dashboard

The **latency dashboard** tracks request latency distributions over time. Show P50, P95, and P99 separately — the average is misleading. Break down by model and by feature.

The latency dashboard answers "is the user experience getting worse?" before users complain. Its companion metric is time-to-first-token (TTFT) for streaming endpoints — TTFT often matters more than total latency to perceived responsiveness.

### The Token Volume Chart

The **token volume chart** is a simple but consistently-useful panel: input and output tokens consumed per unit time, stacked or side-by-side, with cached tokens called out separately. It surfaces trends in raw consumption that the cost view obscures (because cost mixes volume and price).

The diagram below sketches the layout of a typical LLM ops dashboard:

#### Diagram: LLM Ops Dashboard Layout

<iframe src="../../sims/llm-ops-dashboard-layout/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>LLM Ops Dashboard Layout</summary>
Type: infographic
**sim-id:** llm-ops-dashboard-layout<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Show a representative LLM observability dashboard — the panels, their relative positioning, and what each panel answers — as a wireframe so learners can copy the structure to their own backend.

Bloom Level: Apply (L3)
Bloom Verb: implement

Learning objective: Implement an LLM observability dashboard with the panels needed to answer cost, latency, and cache-effectiveness questions for a production team.

Canvas layout:
- Grid of 6 panels (3 columns × 2 rows)
- Top row: Cost over time | Cost by feature | Cost by model
- Bottom row: Cache hit rate | Latency P50/P95/P99 | Token volume

Each panel is rendered as a simplified chart (line, bar, stacked area) with synthetic but realistic data.

Interactive controls:
- Hover any panel: show full description of what it answers and which decisions it supports
- Toggle: "Healthy state" vs "Incident state" — flips the data to show what an incident looks like
- Toggle: "Alert overlay" — highlights panels where alerting rules would have fired in incident state

Default state: Healthy data, no alerts

Implementation: p5.js, responsive width
</details>

## Time Series Aggregation, Aggregation Periods, and Cardinality

**Time series aggregation** is the process of bucketing event data into time windows and computing aggregate values per window. Every dashboard panel is some flavor of time series aggregation — sum cost per hour, P95 latency per minute, request count per day.

The **aggregation period** is the size of those buckets. Smaller periods give finer resolution but more storage and slower queries; larger periods smooth over real signals. Reasonable defaults:

- 1-minute buckets for the last hour (debugging recent issues)
- 5-minute buckets for the last day (operational dashboards)
- 1-hour buckets for the last month (trend analysis)
- 1-day buckets for longer windows (forecasting, capacity planning)

Modern observability backends auto-downsample older data into coarser buckets, so you don't need to configure this manually for retention — but you do need to understand it when you query.

**Cardinality concern** is the warning that high-cardinality fields (fields with many distinct values) explode the cost of metric storage. A metric tagged with `user_id` has cardinality equal to your user count — a million users means a million separate time series for that one metric, each with its own time-bucketed values. Most metrics backends charge per active series; a million-series metric is a million-dollar surprise.

The rule: tag metrics only with low-cardinality dimensions. Model name (low cardinality, ~10 distinct values), feature (low cardinality, ~50), vendor (very low, 3) — fine. User ID (high cardinality), trace ID (very high), prompt hash (potentially very high) — never as metric tags. For per-user analysis, use the underlying logs (Chapter 9) or a separate analytical store, not a metrics backend.

## Anomaly Detection and Alerting

### Anomaly Detection

**Anomaly detection** is the automated identification of unusual patterns in time-series data without a pre-defined threshold. Anomaly detection is what catches "today's traffic looks different from a normal Tuesday" without anyone having to specify what "normal" means.

The two common approaches for LLM metrics:

- **Statistical anomaly detection** — compute rolling mean and standard deviation, flag anything more than N standard deviations from the mean. Simple, predictable, works well for stable workloads.
- **ML-based anomaly detection** — train a model on historical patterns and flag deviations. More powerful but harder to debug; modern observability tools (Datadog, Grafana, Honeycomb) offer this as a managed feature.

Anomaly detection complements alerting; it doesn't replace it. Use anomaly detection to surface unexpected patterns that humans can investigate; use alerting (next) for known thresholds where automated action is required.

### Alerting Rules

An **alerting rule** is a pre-configured condition on metrics that, when true, fires a notification (page, email, Slack message). Good alerting rules are specific, actionable, and rare — every false positive trains responders to ignore the next alert.

Two LLM-specific alerts every team should configure:

A **token spike alert** fires when token consumption per unit time exceeds a normal-range threshold. Spikes usually indicate a broken prompt template (a loop that retries with a growing prompt), an exploit (an attacker probing for prompt injection), or a viral feature (good news, but capacity needs adjustment). Alert on both rate-of-change ("tokens-per-minute increased 5× in the last 10 minutes") and absolute value ("tokens-per-minute exceeded N").

A **cost threshold alert** fires when cumulative spend in a window crosses a fraction of the budget. Standard thresholds: 50%, 75%, 90% of monthly budget. By the 75% alert, action is required; by the 90% alert, the action should already be in progress.

Alert fatigue is the silent killer of any monitoring system. Every alert should have a documented runbook: "When this fires, look at X, then do Y." If you can't write the runbook, the alert isn't useful — delete it.

#### Diagram: Token Spike Alert with Drill-Down

<iframe src="../../sims/token-spike-alert-drilldown/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Token Spike Alert with Drill-Down</summary>
Type: chart
**sim-id:** token-spike-alert-drilldown<br/>
**Library:** Chart.js<br/>
**Status:** Specified

Purpose: Show a token-rate time series with a sudden spike, the alert threshold being crossed, and a drill-down panel that breaks the spike down by feature and user to identify the cause.

Bloom Level: Analyze (L4)
Bloom Verb: deconstruct

Learning objective: Deconstruct a token spike using drill-down analysis to identify the contributing feature, user, or template responsible.

Chart type: Line chart with breakdown panels
- Top: Tokens per minute over the last 24 hours (line) with alert threshold (horizontal red dashed line)
- Bottom (revealed on click): Three small breakdown panels showing the spike's contribution by feature, user, and prompt_hash

Interactive controls:
- Click anywhere on the spike: reveals the drill-down panels for that timestamp
- Slider: Alert threshold (recomputes which spikes would have fired)
- Toggle: "Show baseline range" (mean ± 2σ envelope)

Data Visibility Requirements:
  Stage 1: Show the time series with one obvious spike around hour 14
  Stage 2: When user clicks the spike, show the breakdown: feature X dominates (85%), user Y dominates within feature X
  Stage 3: Show the prompt_hash that explains the spike

Default: 24-hour window, threshold visible, drill-down hidden until clicked

Implementation: Chart.js + simple HTML drill-down panels, responsive width
</details>

## Drill-Down Analysis and Cross-Service Tracing

**Drill-down analysis** is the workflow of moving from an aggregate (a spike in a chart) to the underlying records that explain it (the specific user, feature, or prompt template responsible). Drill-down depends on having both the metric (for the aggregate view) and the underlying logs (for the records) wired together — usually by sharing dimensions (model, feature, vendor) and identifiers (trace_id).

Modern observability backends make drill-down a click — clicking a point on a metric chart pivots to the matching log records. This is the workflow your team will use 80% of the time during incidents; build for it.

**Cross-service tracing** is the practice of propagating a trace ID from the edge of your system through every downstream service, including LLM calls. With cross-service tracing you can answer "what was happening in the rest of my system when this expensive LLM call fired?" — was it a retry storm? A cache miss in the database that triggered a fallback to LLM-based answers? A regression in a feature flag?

Cross-service tracing requires every service to participate (read incoming trace headers, log them, propagate them on outgoing calls). It's an organization-wide investment, not just an LLM-team investment, but the LLM team is often the loudest beneficiary because LLM calls are the most expensive single operations in the trace.

!!! mascot-tip "Build the Cost Dashboard First"
    <img src="../../img/mascot/tip.png" class="mascot-admonition-img" alt="Pemba sharing a tip">
    Of all the dashboards in this chapter, the cost dashboard is the one your CFO will quote. Build it first, make it accurate, and link it from your team page. Engineers who can answer "what did that feature cost last week?" in five seconds get the budget conversations they want; engineers who can't, get the budget conversations they don't.

## Putting It All Together

You can now build the observability stack on top of the structured logs from Chapter 9. You define **observability** as the property of being able to ask arbitrary questions from outside, then implement it with **OpenTelemetry** SDKs adopting the **OTel LLM conventions** so your instrumentation is vendor-neutral. You emit two metric types — **counter metrics** for rates, **histogram metrics** for distributions — and aggregate them via **time series aggregation** at appropriate **aggregation periods**, taking care to avoid **cardinality concerns** by tagging only on low-cardinality dimensions. You build the standard dashboards: **cost dashboard**, **hit rate dashboard**, **latency dashboard**, **token volume chart**. You add **anomaly detection** for unexpected patterns and tight **alerting rules** for known thresholds — including the **token spike alert** and **cost threshold alert** every LLM team needs. When alerts fire, **drill-down analysis** moves you from aggregate to root cause, and **cross-service tracing** lets you correlate LLM behavior with the rest of your stack.

Chapter 11 takes the same data and applies analysis-notebook techniques to find optimization opportunities offline.

??? question "Quick Self-Check — Click to Reveal Answers"
    1. **What's the difference between a counter and a histogram?** A counter accumulates a count of events; a histogram captures the full distribution of a value (percentiles, min, max).
    2. **Why are user_id and trace_id bad metric tags?** They have very high cardinality — tagging a metric with them creates one time series per distinct value, which can be millions, exploding storage cost.
    3. **What does the hit rate dashboard tell you?** What fraction of your input tokens are being served from cache. A drop usually indicates a recent change broke a cache breakpoint.
    4. **What's the difference between anomaly detection and alerting?** Anomaly detection surfaces unexpected patterns without pre-defined thresholds; alerting fires on pre-configured conditions where action is required.
    5. **What is drill-down analysis?** Moving from an aggregate metric (a spike in a chart) to the underlying log records that explain it — the standard incident-response workflow.

!!! mascot-celebration "End of Chapter 10"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Pemba celebrating">
    Dashboards built, alerts configured, traces flowing. The signals are in place. Next chapter takes the same data offline and turns it into the cost-reduction backlog that will guide your optimization work.


---

[See Annotated References](./references.md)

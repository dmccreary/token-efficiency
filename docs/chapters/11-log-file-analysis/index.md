---
title: Log File Analysis and Cost Hotspots
description: Finding the money — log aggregation, top-N drivers, Pareto analysis, outlier detection, runaway prompts and pathological loops, percentile analysis, and the analysis-notebook workflow that ties them together
generated_by: claude skill chapter-content-generator
date: 2026-04-26 09:00:00
version: 0.07
---

# Log File Analysis and Cost Hotspots

## Summary

How to find the money: log aggregation, top-N cost drivers, Pareto analysis, outlier detection, runaway prompts, pathological agent loops, cost roll-ups by feature/user/model, prompt template grouping, percentile analysis (P50/P95/P99), and the analysis-notebook workflow that ties them together.

## Concepts Covered

This chapter covers the following 20 concepts from the learning graph:

1. Log File Analysis
2. Log Aggregation
3. Top-N Cost Drivers
4. Pareto Analysis
5. Outlier Detection
6. Runaway Prompt
7. Pathological Agent Loop
8. Cost Hotspot
9. Per-Feature Cost Roll-Up
10. Per-User Cost Roll-Up
11. Per-Model Cost Roll-Up
12. Prompt Template Grouping
13. Cohort Analysis
14. Funnel Analysis
15. Histogram Of Token Counts
16. P50 Token Usage
17. P95 Token Usage
18. P99 Token Usage
19. Long-Tail Cost
20. Analysis Notebook

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: LLMs, Tokens, and Generation Basics](../01-llms-tokens-generation-basics/index.md)
- [Chapter 3: Pricing, Economics, and Async API Modes](../03-pricing-economics-async-apis/index.md)
- [Chapter 7: AI Coding Harnesses and Agentic Loops](../07-coding-harnesses-agentic-loops/index.md)
- [Chapter 9: Structured Logging for LLM Calls](../09-structured-logging/index.md)
- [Chapter 10: Observability, Dashboards, and Alerting](../10-observability-dashboards-alerting/index.md)

---

!!! mascot-welcome "Where Did All the Tokens Go?"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Pemba waving welcome">
    Dashboards (Chapter 10) tell you something is off. This chapter shows you how to dig into the logs and find exactly *what* is off — which feature is bleeding tokens, which user is responsible, which prompt template is the culprit. The output of this chapter is a ranked optimization backlog you can hand to engineering. Cheap systems are systems whose owners can answer "where did all the tokens go?" in under five minutes.

## Log File Analysis as a Discipline

**Log file analysis** is the practice of querying, aggregating, and exploring the structured log records from Chapter 9 to extract actionable insights — typically about cost, but also about quality regressions, latency problems, and emerging usage patterns. Where dashboards (Chapter 10) are real-time and curated, log analysis is offline and exploratory.

The standard workflow:

1. Pull a representative sample of log records (a week, a month) into an analytical store
2. Aggregate by the dimensions that matter (feature, user, model, template)
3. Sort to surface the largest contributors
4. Drill into the contributors to find the root cause
5. Translate findings into specific optimization proposals

The output is not a chart. It's a ranked list of optimization opportunities with estimated dollar savings and implementation effort. That list is the backlog.

## Log Aggregation

**Log aggregation** is the foundational operation: collapse millions of individual log records into per-dimension totals. SQL-flavored pseudocode:

```sql
SELECT
  feature,
  COUNT(*) AS request_count,
  SUM(input_tokens) AS total_input_tokens,
  SUM(output_tokens) AS total_output_tokens,
  SUM(cost_usd) AS total_cost_usd,
  AVG(latency_ms) AS avg_latency_ms,
  PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY latency_ms) AS p95_latency_ms
FROM llm_call_logs
WHERE timestamp >= NOW() - INTERVAL '7 days'
GROUP BY feature
ORDER BY total_cost_usd DESC
```

This single query, run once a week, surfaces 80% of the optimization opportunities most teams have. The remaining 20% requires the more specialized analyses below.

## The Three Standard Roll-Ups

Three per-dimension cost roll-ups answer different questions and should be run regularly:

A **per-feature cost roll-up** aggregates cost by `feature` tag. Answers: which product features dominate the bill? Combined with feature usage analytics, it tells you which features are profitable. A feature that costs \$5,000/month in tokens but generates \$500 in revenue is a problem worth surfacing.

A **per-user cost roll-up** aggregates cost by hashed `user_id`. Answers: which users are unprofitable? In a freemium product, the long tail of low-spending users subsidizes the cost of a small number of heavy users. Knowing where the line is helps with pricing-tier design and abuse detection.

A **per-model cost roll-up** aggregates cost by `model` field. Answers: where is routing not working? If a feature claims to use Haiku but the per-model roll-up shows 80% of its cost on Sonnet, your routing logic isn't doing what you think it's doing.

## Top-N Cost Drivers and Pareto Analysis

The **top-N cost drivers** are the N largest contributors to total cost on any chosen dimension. Top-10 features, top-20 users, top-50 prompt templates. Top-N analysis is the simplest and most actionable form of cost analysis — it directs attention to the small number of items where intervention pays back the most.

**Pareto analysis** is the related observation that LLM costs almost always follow a power-law distribution: a small fraction of features (or users, or templates) accounts for the majority of cost. The 80/20 rule is a useful heuristic; in practice the ratio is often steeper (90/10 or 95/5).

The implication is encouraging: you don't have to fix 100 things to get a 50% cost reduction. You usually have to fix 5. The Pareto chart visualizes this directly:

#### Diagram: Pareto Analysis of Per-Feature Cost

<iframe src="../../sims/pareto-feature-cost/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Pareto Analysis of Per-Feature Cost</summary>
Type: chart
**sim-id:** pareto-feature-cost<br/>
**Library:** Chart.js<br/>
**Status:** Specified

Purpose: Show a representative per-feature cost distribution as a sorted bar chart with an overlaid cumulative-share line, demonstrating the power-law shape and identifying the "vital few" features that dominate cost.

Bloom Level: Analyze (L4)
Bloom Verb: identify

Learning objective: Identify the vital-few features responsible for the majority of LLM cost using Pareto analysis on real-shaped data.

Chart type: Combination chart (sorted bars + line)
- X-axis: Feature name (sorted by cost descending)
- Y-axis (left): Monthly cost (\$)
- Y-axis (right): Cumulative share of total cost (%)

Data: 25 features with costs following a power-law distribution
- Top 3 features: ~60% of cost
- Top 5 features: ~80% of cost
- Bottom 15 features: ~5% of cost combined

Visual elements:
- Bars colored by cost magnitude (red for top 5, orange for next 5, gray for the rest)
- Cumulative line crossing the 80% mark with a callout
- A "vital few / trivial many" annotation pointing at the 80% threshold

Interactive controls:
- Slider: "Pareto target" (50% / 80% / 90%) — recomputes how many features fall under the threshold
- Toggle: "Show cumulative line"
- Hover any bar: show feature name, cost, share

Default: 80% target, cumulative line on

Implementation: Chart.js dual-axis combo, responsive width
</details>

## Outlier Detection

**Outlier detection** is the process of finding individual log records (or aggregate cells) whose values are far from the typical distribution. Outliers in LLM logs come in a few characteristic shapes:

- **Single requests with abnormally large token counts** — usually a runaway prompt or a user pasting a giant document
- **Single sessions with abnormally large cumulative cost** — usually a pathological agent loop
- **Per-feature daily totals with sudden jumps** — usually a deployment that broke a prompt template

The simplest outlier detection is statistical: compute mean and standard deviation per dimension, flag anything more than 3σ from the mean. More sophisticated approaches use median and median absolute deviation (MAD), which are robust to the outliers themselves contaminating the mean.

For LLM logs, the most useful outlier detection is "show me the top 100 single requests by cost, sorted descending." Almost every issue worth investigating shows up in that list.

### Runaway Prompts and Pathological Agent Loops

Two specific outlier patterns deserve their own names because they recur:

A **runaway prompt** is a single LLM request with an unexpectedly massive token count — typically input. Common causes: a retry loop that keeps appending the previous response to the prompt and trying again, a templating bug that interpolates the entire database into one variable, or a recursive function that builds the prompt by appending its own output.

A **pathological agent loop** is the harness equivalent (Chapter 7): an agent session that iterates dozens or hundreds of times without making progress, each iteration carrying the full prior conversation as input. Pathological loops can rack up hundreds of dollars in a single session if no budget cap (Chapter 18) is in place.

Both patterns show up in outlier detection as single records (or sessions) with token counts 10–100× the typical. Both should fire alerts in real time (Chapter 10) but log analysis is what tells you they happened *before* the alerts were configured.

A **cost hotspot** is the more general term for any aggregate cell — a feature, a user, a template, a time-of-day — where cost concentrates disproportionately. Hotspots are the natural targets of optimization work.

## Prompt Template Grouping

**Prompt template grouping** is the analysis where you aggregate logs by `prompt_hash` (Chapter 9) to see which prompt templates account for which fraction of cost. This is a particularly high-value analysis because it surfaces optimization opportunities at the most actionable level: "this specific template, used for this feature, is responsible for X% of monthly cost — and the average input is Y tokens, so trimming the template by Z tokens saves \$N/month."

Without prompt hashing in your logs, this analysis is impossible — every request looks unique because the rendered prompts differ. With prompt hashing, the templates surface clearly even when the variable parts vary.

Sorted by cost, the top-10 prompt templates typically account for 70–90% of all cost. Each one becomes a candidate for the prompt-engineering optimizations in Chapter 13.

## Percentile Analysis: P50, P95, P99

Averages lie about LLM workloads because the distribution is heavy-tailed. The right tool is the percentile.

A **histogram of token counts** is the underlying view: bucket all log records by token count and plot the count per bucket. The histogram shows the full distribution shape — a small mode near the typical request size, a long tail extending out to the rare expensive requests.

From the distribution come three key percentiles:

- **P50 token usage** — the median, the typical request size. Half of all requests are smaller, half are larger.
- **P95 token usage** — the 95th percentile, the size that 5% of requests exceed. The boundary between "common" and "unusual."
- **P99 token usage** — the 99th percentile, the size that 1% of requests exceed. The boundary between "unusual" and "outlier."

The P99 / P50 ratio is a useful summary statistic. A ratio of 5–10 is a normal heavy-tailed workload; a ratio above 50 indicates pathology — your top 1% of requests are dramatically larger than typical, and they are almost certainly the runaway-prompt or pathological-loop patterns above.

### The Long-Tail Cost

The **long-tail cost** is the dollar share of the tail of the distribution — the contribution of the largest 1% (or 5%) of requests to total cost. Long-tail cost is high in agent-heavy workloads (a few sessions explode) and low in chat-heavy workloads (every request is roughly the same size).

The optimization implication: if long-tail cost is high (more than 30% of total cost from the top 1% of requests), the right optimization target is the tail itself — budget caps (Chapter 18), max-token limits, output controls. If long-tail cost is low (less than 10%), the right target is the body of the distribution — system prompt trimming, caching, model routing.

The histogram below shows what each shape looks like:

#### Diagram: Token Count Distribution and Long-Tail Cost

<iframe src="../../sims/token-distribution-long-tail/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Token Count Distribution and Long-Tail Cost</summary>
Type: chart
**sim-id:** token-distribution-long-tail<br/>
**Library:** Chart.js<br/>
**Status:** Specified

Purpose: Show a histogram of per-request token counts with P50/P95/P99 markers, plus a side panel computing the long-tail cost share, so learners can identify whether their workload is body-heavy or tail-heavy.

Bloom Level: Evaluate (L5)
Bloom Verb: assess

Learning objective: Assess whether a workload's optimization priority should be the body of the distribution (typical requests) or the tail (rare runaways).

Chart type: Histogram with overlaid percentile markers + a side bar panel
- Main chart: histogram of input token count per request, log-scale X axis
- Vertical lines: P50 (green), P95 (orange), P99 (red)
- Side panel: bar chart of cost share by percentile band (P0–P50, P50–P95, P95–P99, P99–P100)

Interactive controls:
- Dropdown: workload shape ("Body-heavy chat", "Tail-heavy agent", "Bimodal", "Mixed")
- Toggle: "Show cost share annotations"
- Slider: token-budget cap line — show how a cap at N tokens would have prevented the tail

Data Visibility Requirements:
  Stage 1: Show the histogram with percentile markers
  Stage 2: Show the cost-share bars by percentile band (often the P99–P100 bar dominates in agent workloads)
  Stage 3: When a token budget cap is set, gray out the records above the cap and recompute remaining cost

Default: Mixed workload, cap line off

Implementation: Chart.js, responsive width
</details>

## Cohort and Funnel Analyses

Two cross-cutting analyses are worth knowing for LLM-specific use cases:

**Cohort analysis** groups users by some shared property — signup date, plan tier, region — and tracks per-cohort cost or behavior over time. Cohorts answer questions like "are new users converging to lower per-user cost as they learn the product, or are they staying expensive?" or "did the new pricing tier change the per-cohort cost profile?"

**Funnel analysis** tracks users through a sequence of steps in a workflow, measuring where they drop off and how much each step costs. For LLM workflows, funnel analysis surfaces the steps that consume disproportionate tokens relative to their conversion rate — a multi-step LLM-driven onboarding flow whose third step costs \$2 per user but converts only 30% is a candidate for redesign.

## The Analysis Notebook Workflow

An **analysis notebook** is a Jupyter (or similar) notebook that ingests log data and produces the per-week or per-month cost analysis report. Notebooks are the right format for this work because:

- The analysis is iterative — you start with one query, the result raises a question, you write the next query
- The output is a mix of charts, tables, and prose — exactly what notebooks render
- The notebook itself is the documentation — the queries that produced the report are right next to the report
- Notebooks are reproducible and versionable — re-run next month against new data and you get the same shape of report

A standard LLM cost-analysis notebook outline:

1. Load logs for the chosen window
2. Total cost, total tokens, total request count (the headline numbers)
3. Per-feature, per-user, per-model roll-ups (the standard three)
4. Top-N cost drivers per dimension
5. Pareto chart of per-feature cost
6. Histogram of per-request token counts with percentiles
7. Top 100 single requests by cost (outlier inspection)
8. Top 100 sessions by cumulative cost (pathological-loop inspection)
9. Prompt template top-N
10. Findings + ranked optimization backlog

Run the notebook monthly. Compare to the prior month. Track the optimization-backlog completion rate alongside the cost trend.

!!! mascot-tip "Five Queries Find Most of the Wins"
    <img src="../../img/mascot/tip.png" class="mascot-admonition-img" alt="Pemba sharing a tip">
    The first time you run a serious cost analysis on a production LLM workload, expect to find one or two cost hotspots that account for a third of the bill — usually a runaway template that no one noticed, or a feature that's accidentally using Opus. Fix those two and you've justified the entire instrumentation investment in week one. Where did all the tokens go? Spoiler: into a hotspot you didn't know existed.

## Putting It All Together

You can now run the offline analysis pipeline that turns logs into action. You apply **log file analysis** as a discipline: query the structured logs from Chapter 9 with **log aggregation** to produce per-dimension totals, then sort by **top-N cost drivers** to surface the largest contributors. You confirm the typical power-law distribution with **Pareto analysis** and use **outlier detection** to find **runaway prompts** and **pathological agent loops** — both forms of **cost hotspot**. You run the three standard roll-ups (**per-feature cost roll-up**, **per-user cost roll-up**, **per-model cost roll-up**) and the more specialized **prompt template grouping**, **cohort analysis**, and **funnel analysis**. You characterize the distribution with a **histogram of token counts** annotated with **P50 token usage**, **P95 token usage**, and **P99 token usage**, and you compute the **long-tail cost** share to decide where to target optimization. You package the whole thing in an **analysis notebook** that runs monthly and produces a ranked optimization backlog.

Chapter 12 takes those backlog items and tests them rigorously with proper A/B methodology before shipping.

??? question "Quick Self-Check — Click to Reveal Answers"
    1. **Why is the per-model cost roll-up useful?** It tells you whether routing logic is actually sending requests to the cheap model you intended. Drift between intent and reality shows up here first.
    2. **What's a pathological agent loop?** A harness session that iterates without progress, each turn carrying the full prior conversation as input. Cost can spike dramatically because of the quadratic growth pattern.
    3. **What does a P99/P50 ratio above 50 indicate?** Pathology — your top 1% of requests are dramatically larger than typical, almost always runaway prompts or pathological loops.
    4. **Why aggregate by prompt_hash instead of by rendered prompt?** Rendered prompts vary per request because of variable interpolation. Hashing the template groups requests that used the same template even when the variables differed — the right granularity for per-template optimization.
    5. **What's the right output of a monthly cost analysis?** Not a dashboard — a ranked optimization backlog with estimated dollar savings and implementation effort per item.

!!! mascot-celebration "End of Chapter 11"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Pemba celebrating">
    The backlog is in hand. Next chapter teaches you how to test each backlog item rigorously before shipping — because a 30% cost reduction that drops quality 10 points is a regression, not a win.


---

[See Annotated References](./references.md)

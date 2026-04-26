---
title: Pricing, Economics, and Async API Modes
description: Per-million-token pricing, unit economics, cost attribution, budgets, the cost-quality and cost-latency frontiers, rate limits, and the Batch and Asynchronous API patterns that unlock structural discounts
generated_by: claude skill chapter-content-generator
date: 2026-04-25 20:37:04
version: 0.07
---

# Pricing, Economics, and Async API Modes

## Summary

The financial framing of LLM usage: per-million-token pricing, unit economics, cost-per-feature/user/outcome attribution, token budgets, the cost-quality and cost-latency frontiers, rate limits and quotas, plus the generic Batch API and Asynchronous API patterns that vendors will specialize.

## Concepts Covered

This chapter covers the following 27 concepts from the learning graph:

1. Per-Million-Token Price
2. Input Token Price
3. Output Token Price
4. Cached Input Price
5. Output Premium
6. Unit Economics
7. Cost Per Request
8. Cost Per Feature
9. Cost Per User
10. Cost Per Outcome
11. Cost Attribution
12. Token Budget
13. Monthly Token Spend
14. Forecasting Token Cost
15. Cost-Quality Tradeoff
16. Cost-Latency Tradeoff
17. Pareto Frontier
18. Pricing Tier
19. Volume Discount
20. Batch Discount
21. Enterprise Pricing
22. Free Tier Limit
23. Rate Limit
24. Quota Management
25. Burn Rate
26. Batch API
27. Asynchronous API

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: LLMs, Tokens, and Generation Basics](../01-llms-tokens-generation-basics/index.md)

---

!!! mascot-welcome "From Tokens to Dollars"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Pemba waving welcome">
    Chapters 1 and 2 made you fluent in tokens. This chapter turns tokens into money. By the end, you'll be able to compute the cost of a single request, attribute that cost to a feature or a user, set a sensible monthly budget, and decide whether a workload belongs on the synchronous, batch, or async path. Cheap systems are the result of doing this arithmetic *before* shipping, not after the bill arrives.

## The Anatomy of an LLM Bill

### Per-Million-Token Pricing

Vendors price LLM usage in dollars per million tokens, abbreviated `$/MTok`. This unit is convenient because typical API calls deal in hundreds-to-thousands of tokens, so the per-call cost lands in fractions of a cent and stays human-readable.

There is no single per-million-token price for a model, though — there are at least three, and sometimes more:

- **Input token price** — the rate charged for tokens you send (your prompt, system message, retrieved context, conversation history). Typically ranges from \$0.10/MTok for the smallest models to \$15/MTok for the largest.
- **Output token price** — the rate charged for tokens the model generates back. Typically 3×–5× the input price for the same model. This ratio is the **output premium** — the structural multiplier that makes generation more expensive than ingestion.
- **Cached input price** — the rate charged for input tokens that hit the vendor's prompt cache (Chapter 14). Typically about 10% of the uncached input price, sometimes as low as 5%.

Reasoning tokens, when present, are billed at the output price (they are output tokens that the user never sees). Some vendors also offer a "cache write" price — a small premium on the *first* time a prefix is cached, after which subsequent reads use the cheaper cached rate.

### A Worked Cost Calculation

Before showing the cost equation, here are the variables: \( T_i \) is uncached input tokens, \( T_c \) is cached input tokens, \( T_o \) is output tokens, and \( P_i, P_c, P_o \) are the corresponding per-million-token prices. The cost of a single request is then:

\[
\text{Cost} = \frac{T_i \cdot P_i + T_c \cdot P_c + T_o \cdot P_o}{1{,}000{,}000}
\]

For a concrete example, consider a request to a mid-tier model priced at \$3/MTok input, \$0.30/MTok cached input, \$15/MTok output. The request sends 10,000 tokens of system prompt (cached), 500 tokens of new user message (uncached), and produces a 1,000-token response:

\[
\text{Cost} = \frac{500 \cdot 3 + 10{,}000 \cdot 0.30 + 1{,}000 \cdot 15}{1{,}000{,}000} = \frac{1{,}500 + 3{,}000 + 15{,}000}{1{,}000{,}000} = \$0.0195
\]

Just under two cents per request. The interesting fact is the breakdown: the 1,000 output tokens cost more than seven times what the 10,000 cached input tokens cost. **Output dominates** — and we haven't even done anything wasteful yet.

The table below summarizes the four billing categories you'll see on every modern LLM bill, with example rates from a representative mid-tier model:

| Category | Example Rate | Share of Cost in the Worked Example | Typical Cost Lever |
|----------|--------------|-------------------------------------|--------------------|
| Uncached input | \$3.00/MTok | 8% | Prompt compression (Ch. 13) |
| Cached input | \$0.30/MTok | 15% | Stable prefix design (Ch. 14) |
| Output | \$15.00/MTok | 77% | `max_tokens`, model routing (Ch. 17) |
| Reasoning (output) | \$15.00/MTok | n/a (none in this example) | Thinking budget cap (Ch. 17) |

!!! mascot-thinking "Where the Money Actually Goes"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Pemba thinking">
    In almost every well-cached production application I've seen, output tokens are 60–85% of the bill even when they are a tiny fraction of total tokens by volume. That single observation reorders priorities: trimming a 200-token output is usually worth more than trimming a 2,000-token input. The output premium is the gravitational center of token optimization.

## Unit Economics

**Unit economics** is the discipline of expressing cost and revenue per discrete unit of business activity — per request, per user, per feature, per successful outcome — rather than as one big monthly aggregate. For LLM systems, unit economics is the bridge between the per-million-token pricing on a vendor invoice and the per-customer profitability that determines whether a feature is sustainable.

The four most useful unit-economic metrics:

- **Cost per request** — the average dollar cost of a single API call. Easy to compute from logs (sum cost, divide by count). The atomic unit; everything else is built on top.
- **Cost per feature** — the average cost of one invocation of a particular product feature ("summarize document", "answer support question"). A single feature may issue multiple LLM requests; cost-per-feature aggregates them.
- **Cost per user** — total LLM cost attributable to one end-user over a time window, usually a month. The number that matters when comparing LLM cost to per-user revenue.
- **Cost per outcome** — the cost per *successful* completion of a business goal, typically measured as cost per request divided by success rate. Cost per outcome is the only metric that detects quality regressions: a 30% cost reduction that drops success from 90% to 70% looks great on cost-per-request and disastrous on cost-per-outcome.

The relationships compose simply: cost-per-feature is cost-per-request times the average requests-per-feature, cost-per-user is the sum of cost-per-feature across all features the user invokes, and cost-per-outcome is cost-per-request divided by the per-feature success rate.

### Cost Attribution

Computing any of these metrics requires **cost attribution** — the practice of tagging every LLM API call with enough metadata that you can later roll up costs by any dimension. The minimum tagging set every LLM call should carry:

- `model` — which model was called (price varies by model)
- `feature` — which product feature triggered the call
- `user_id` — which end-user the call is on behalf of (hashed for privacy)
- `request_id` / `trace_id` — for joining multi-call features back together
- `outcome` — whether the call succeeded or failed in a business sense (not just HTTP-200; some 200s are bad outputs)

Without these tags, a \$50,000 monthly bill is just \$50,000. With them, you can tell whether one feature is responsible for 80% of the spend, whether one customer is unprofitable, or whether a recent prompt change improved cost-per-outcome. Chapter 9 builds the structured logging schema that makes this practical.

#### Diagram: Cost Attribution Roll-Up

<iframe src="../../sims/cost-attribution-rollup/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Cost Attribution Roll-Up</summary>
Type: microsim
**sim-id:** cost-attribution-rollup<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Show how individual LLM call costs roll up by feature, by user, and by outcome — making the same total cost tell different stories depending on which dimension you slice by.

Bloom Level: Analyze (L4)
Bloom Verb: differentiate

Learning objective: Differentiate cost-per-request, cost-per-feature, cost-per-user, and cost-per-outcome from the same underlying request log, and explain how each surface a different optimization opportunity.

Canvas layout:
- Left column (40%): Sortable table of 30 sample requests with columns [request_id, model, feature, user_id, input_tokens, output_tokens, cost, success?]
- Right column (60%): Roll-up panel with four tabs at the top: "By Request", "By Feature", "By User", "By Outcome"

Sample data (pre-populated):
- 30 requests across 3 features (summarize, chat, classify), 5 users (u1–u5), 2 models (haiku, sonnet)
- Realistic cost distribution: a few large outliers, most small
- Mix of success/failure outcomes

Interactive controls:
- Tab buttons: "By Request" | "By Feature" | "By User" | "By Outcome"
- Sort dropdown for each tab (sort ascending or descending by cost)
- Highlight: clicking a row in the right panel highlights the underlying requests in the left panel

Data Visibility Requirements:
  Tab 1 (By Request): Show raw cost per request as a sorted bar chart, top 10
  Tab 2 (By Feature): Group requests by feature, show total and average cost per feature with request counts
  Tab 3 (By User): Group requests by user_id, show total cost per user; highlight any user above an "alert" threshold
  Tab 4 (By Outcome): Show cost-per-successful-outcome (total cost / success count) per feature, with success rate as a secondary bar

Default state: "By Feature" tab, sorted descending by total cost

Instructional Rationale: Analyze objective requires the learner to manipulate the same data through multiple lenses. Tab-based view-switching with linked highlighting makes it concrete that the underlying data is unchanged — only the aggregation differs.

Implementation:
- p5.js with responsive width
- Pre-baked dataset; no server calls
- Use createButton for tabs and createSelect for sort
</details>

## Budgets, Spend, and Forecasting

Once you can compute cost per anything, you can plan. The discipline is straightforward but rarely practiced:

A **token budget** is a pre-declared cap on how many tokens (or dollars) a particular scope is allowed to consume in a particular time window. Scopes can be nested: per-request, per-feature, per-user-per-day, per-engineer-per-PR (Chapter 18), per-team-per-month. Budgets without enforcement are wishes; the agent budget policies in Chapter 18 turn them into circuit breakers.

**Monthly token spend** is the simplest and least informative metric — total tokens (or dollars) consumed in a calendar month. It's the number on the invoice. By itself it tells you nothing about whether spend is healthy; it has to be compared against unit economics or against a budget to mean anything.

**Forecasting token cost** is the practice of projecting next month's spend (or next quarter's, or the rest of the current month's) from current usage trends. The basic forecast is a linear extrapolation from **burn rate** — the average dollars-per-day or tokens-per-hour you are currently consuming. A burn rate of \$1,500/day forecasts a \$45,000 month. More sophisticated forecasts adjust for known seasonality (weekday vs. weekend, marketing campaigns) and known growth (if monthly active users are growing 20% per month, multiply the linear forecast accordingly).

The chart below shows the relationship between burn rate, monthly forecast, and budget:

#### Diagram: Burn Rate and Monthly Forecast

<iframe src="../../sims/burn-rate-monthly-forecast/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Burn Rate and Monthly Forecast</summary>
Type: chart
**sim-id:** burn-rate-monthly-forecast<br/>
**Library:** Chart.js<br/>
**Status:** Specified

Purpose: Show daily LLM spend over a month with the running cumulative spend, a linear forecast from current burn rate, and a budget line, so learners can see when a forecast is on track to bust the budget.

Bloom Level: Apply (L3)
Bloom Verb: calculate

Learning objective: Calculate a monthly cost forecast from a partial-month burn rate and identify when current spend is on track to exceed the budget.

Chart type: Combination chart
- X-axis: Day of month (1–30)
- Y-axis (left): Daily spend (\$)
- Y-axis (right): Cumulative spend (\$)

Data series:
1. Daily spend (blue bars) — actual daily spend up to today (day 18 in default state)
2. Cumulative spend (solid green line) — running total
3. Forecast cumulative spend (dashed green line) — extrapolation from current burn rate to day 30
4. Budget line (red horizontal at \$30,000)

Interactive controls:
- Slider: "Today is day N" (1–30, default 18) — changes which day is "now" and re-extrapolates
- Slider: "Adjust daily burn" (multiplier 0.5–2.0) — scales the post-today forecast
- Toggle: "Apply seasonality" — multiplies weekday forecasts by 1.3, weekend forecasts by 0.6

Data Visibility Requirements:
  Stage 1: Show actual daily spend as bars for days 1 through "today"
  Stage 2: Show cumulative spend as a solid line over the actual data
  Stage 3: Extrapolate forecast cumulative as a dashed line from "today" to day 30
  Stage 4: Show budget line and label "ON TRACK" or "OVER BUDGET" based on forecast intersection
  Stage 5: When seasonality is applied, show how the forecast bends

Default values:
- Today: day 18
- Burn multiplier: 1.0
- Seasonality: off
- Budget: \$30,000

Implementation: Chart.js, responsive width
</details>

!!! mascot-warning "Don't Wait for the Invoice"
    <img src="../../img/mascot/warning.png" class="mascot-admonition-img" alt="Pemba cautioning">
    The single most common cost-control failure I see is "we'll look at usage when the bill comes." By that point, the bad month has already happened. Forecast continuously from burn rate, set alerts at 50%, 75%, and 90% of monthly budget, and *act* on the 50% alert. Budgets work; surprise invoices don't.

## Cost-Quality, Cost-Latency, and the Pareto Frontier

Three numbers describe almost every model choice: cost, quality, and latency. They trade off against each other, and pretending they don't is the source of most "we just need a smarter model" reasoning.

The **cost-quality tradeoff** is the observation that, within a model family or across a vendor's lineup, more capable models cost more per token. A 10× cost increase typically buys a 5–15 percentage-point improvement in task accuracy — not a doubling. The shape of that curve matters: for some tasks, the cheapest model is "good enough" and the expensive model adds nothing; for others, only the expensive model crosses the usefulness threshold and everything cheaper is wasted spend regardless of how cheap it is.

The **cost-latency tradeoff** is the observation that cheaper models often respond faster (smaller models = less compute per token), so reducing cost frequently improves latency *for free*. The exception is when the cheaper model produces a worse result that requires retry or escalation; then total wall-clock latency can be worse even though per-call latency was better.

The **Pareto frontier** is the set of model-and-config combinations that are not dominated by any other combination on cost-quality (or cost-latency). A configuration is on the Pareto frontier if no other configuration is strictly cheaper *and* strictly better. Configurations off the frontier should never be chosen — by definition something else dominates them. The whole point of cross-vendor benchmarking (which we'll formalize in Chapter 6) is to identify the frontier for your specific workload, then pick a point on the frontier based on your cost-quality preference.

#### Diagram: Cost-Quality Pareto Frontier

<iframe src="../../sims/cost-quality-pareto-frontier/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Cost-Quality Pareto Frontier</summary>
Type: chart
**sim-id:** cost-quality-pareto-frontier<br/>
**Library:** Chart.js<br/>
**Status:** Specified

Purpose: Plot a set of model configurations on cost-vs-quality axes, draw the Pareto frontier connecting the non-dominated points, and gray out the dominated points to make the "never choose these" set obvious.

Bloom Level: Evaluate (L5)
Bloom Verb: judge

Learning objective: Judge which model configurations are worth considering for a given workload and which are strictly dominated.

Chart type: Scatter plot with overlaid frontier line
- X-axis: Cost per request (\$, log scale, 0.001 to 1.0)
- Y-axis: Quality score (0–100)

Data points (representative model configurations):
- "Tiny model": cost \$0.001, quality 60
- "Small model, no caching": cost \$0.005, quality 75
- "Small model, with caching": cost \$0.002, quality 75
- "Mid model, no caching": cost \$0.020, quality 85
- "Mid model, with caching": cost \$0.008, quality 85
- "Large model": cost \$0.100, quality 92
- "Large model + thinking": cost \$0.300, quality 95
- Several deliberately-dominated points: "Mid model expensive prompt": \$0.030, quality 80; "Small model verbose prompt": \$0.015, quality 70

Frontier line: Connect the non-dominated points (Tiny → Small+caching → Mid+caching → Large → Large+thinking)

Interactive controls:
- Slider: "Quality requirement floor" (0–100) — draws a horizontal line; points below get grayed out
- Slider: "Cost ceiling per request" — draws a vertical line; points above get grayed out
- Hover over any point: show its label, exact cost and quality, and whether it's on the frontier

Data Visibility Requirements:
  Stage 1: Plot all points labeled
  Stage 2: Highlight Pareto-frontier points in green and dominated points in gray
  Stage 3: Draw the frontier line connecting frontier points
  Stage 4: When sliders move, recompute which points satisfy both constraints and emphasize those

Default state: All points visible, no constraints applied

Implementation: Chart.js scatter, responsive width
</details>

## Pricing Tiers, Discounts, and Free Tiers

Vendor pricing is rarely a single rate card. Real bills depend on which tier you've negotiated and which discount mechanisms apply.

A **pricing tier** is a published rate card associated with a particular customer segment — typically free, developer/standard, and enterprise. Higher tiers offer not just lower per-token rates but also higher rate limits, priority access, and dedicated capacity.

A **volume discount** is an automatic per-token rate reduction that kicks in once monthly spend exceeds defined thresholds — for example, the first \$10,000 at full rate, the next \$40,000 at 90% of rate, anything above \$50,000 at 75% of rate. Volume discounts are typically not negotiated; they're documented in the rate card.

A **batch discount** is a structural discount (typically 50%) granted for workloads sent through the vendor's batch API rather than the synchronous API. The discount is the vendor's reward for letting them schedule your work flexibly during off-peak compute capacity. Any workload that doesn't need a real-time response should be on this path. We cover the batch API mechanics in the next section.

**Enterprise pricing** refers to negotiated contracts that override the public rate card — typically offering committed-use discounts (you commit to a minimum monthly spend in exchange for a flat lower rate), dedicated capacity, custom rate limits, and contractual SLAs. Enterprise pricing matters for organizations spending more than ~\$50K/month; below that, the negotiation effort isn't worth the discount.

A **free tier limit** is the volume of usage available at no cost on the free tier — typically a small number of requests per day or month, intended for evaluation. Free tiers are not for production workloads; rate limits are aggressive and the vendor reserves the right to deprioritize free traffic during capacity crunches.

## Rate Limits and Quota Management

A **rate limit** is the maximum number of requests (or tokens) per unit time that a vendor allows your account to make. Rate limits are typically expressed as both **requests per minute** (RPM) and **tokens per minute** (TPM), with the lower of the two binding. A typical mid-tier account might be 1,000 RPM and 500,000 TPM — meaning a single huge request can starve out many small ones, and vice versa.

Rate limits are not the same as your budget. The budget is what you've decided to spend; the rate limit is what the vendor will let you spend per minute. You can be rate-limited far below your budget if your traffic is spiky.

**Quota management** is the operational practice of designing your application to live inside its rate limits. The standard tools:

- Client-side rate limiters that throttle requests *before* they hit the vendor (saves wasted error responses)
- Per-feature quotas that share a global rate-limit budget across multiple features fairly
- Backoff and retry on `429 Too Many Requests` responses, with jitter to avoid thundering herds
- Vendor batch APIs (next section) for workloads that don't need real-time response, which usually count against a separate rate limit pool

Properly managed, rate limits become a non-issue. Ignored, they become customer-visible errors during exactly the moments you're growing fastest.

## Synchronous, Asynchronous, and Batch APIs

The final concept in this chapter — and one of the highest-leverage cost levers — is the choice of API mode.

A **synchronous API** is the default: the client sends a request, waits for the model to generate the full response, and receives it in one blocking HTTP response. Latency is whatever the model takes (typically 1–10 seconds). This is the only mode that works for interactive chat UIs and live coding assistants.

An **asynchronous API** is a non-blocking variant where the client submits a request and immediately receives a job ID. The client then either polls a status endpoint or receives a webhook callback when the response is ready. Latency is similar to synchronous (the work itself isn't faster), but the client is free to do other work in the meantime. Async APIs are useful for long-running requests where you don't want to hold an HTTP connection open for 30+ seconds.

A **Batch API** is a structural variant designed for workloads that don't need a real-time response. The client submits a batch of many requests as a single job (typically a JSONL file uploaded to the vendor), the vendor processes them within a guaranteed window (commonly 24 hours), and the client downloads the results. The defining feature of batch APIs is the **batch discount** — typically 50% off the per-token price — which the vendor offers in exchange for the scheduling flexibility.

The decision rule is straightforward: any workload whose users do not need a response within seconds should be on the batch path. Examples include nightly summarization of new documents, periodic re-tagging of a content corpus, evaluation runs against a golden test set, monthly customer report generation. Moving these to batch is often a 50% savings with zero quality impact.

The diagram below contrasts the three modes:

#### Diagram: Synchronous vs. Async vs. Batch API Flow

<iframe src="../../sims/sync-async-batch-api-flow/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Synchronous vs. Async vs. Batch API Flow</summary>
Type: workflow
**sim-id:** sync-async-batch-api-flow<br/>
**Library:** Mermaid<br/>
**Status:** Specified

Purpose: Show the request lifecycle for each of the three API modes side by side, with timing and cost annotations, so learners can match a workload to the right mode.

Bloom Level: Evaluate (L5)
Bloom Verb: recommend

Learning objective: Recommend the appropriate API mode (synchronous, asynchronous, or batch) for a given workload based on latency requirements and cost targets.

Visual style: Three vertical swimlanes side by side, each showing a sequence diagram

Swimlane 1: Synchronous
- Client → Vendor: Send request
- Vendor: Process (1–10s)
- Vendor → Client: Return response
- Annotation: "Latency: seconds. Cost: 1.0×."

Swimlane 2: Asynchronous
- Client → Vendor: Submit request, receive job ID
- Client: Free to do other work
- Vendor: Process (1–60s)
- Vendor → Client: Webhook callback OR Client polls status
- Vendor → Client: Return response
- Annotation: "Latency: seconds-to-minutes. Cost: 1.0×. Frees the client thread."

Swimlane 3: Batch
- Client → Vendor: Upload JSONL file with many requests
- Vendor: Schedule and process within 24-hour window
- Vendor → Client: Notify completion
- Client → Vendor: Download results JSONL
- Annotation: "Latency: hours. Cost: 0.5× (batch discount)."

Interactive controls:
- Hover any step to see expanded explanation
- Toggle: "Show cost annotations" / "Show latency annotations"

Visual elements:
- Color coding: blue for sync, purple for async, green for batch
- A summary table at the bottom comparing the three modes on (latency, cost, when to use)

Implementation: Mermaid sequence diagram, three diagrams arranged horizontally on responsive layout
</details>

!!! mascot-tip "The Batch Path Is Underused"
    <img src="../../img/mascot/tip.png" class="mascot-admonition-img" alt="Pemba sharing a tip">
    Audit your workloads with one question: "Would my users notice if this response arrived in 6 hours instead of 6 seconds?" Every workload that answers "no" should be on the batch path. In my experience, 30–50% of an organization's LLM spend is on requests that didn't need to be synchronous. Moving those is a structural 50% savings — easier than any prompt rewrite, and it doesn't require touching the model.

### A Worked Comparison

Suppose a company runs nightly document summarization on 100,000 documents per day, averaging 2,000 input tokens and 200 output tokens per document. At synchronous mid-tier pricing (\$3/MTok input, \$15/MTok output):

\[
\text{Daily cost (sync)} = 100{,}000 \cdot \frac{2{,}000 \cdot 3 + 200 \cdot 15}{1{,}000{,}000} = 100{,}000 \cdot \$0.009 = \$900/\text{day}
\]

That's roughly \$27,000/month. Moving the same workload to the batch API at a 50% discount drops it to \$13,500/month — a \$13,500/month savings for a one-line code change. The work is the same, the model is the same, the quality is the same; only the scheduling flexibility differs. This is the cleanest cost optimization in the entire book.

## Putting It All Together

You can now read a vendor's rate card, compute the cost of any specific request, attribute that cost to a feature/user/outcome, set a budget, forecast spend from burn rate, position model configurations on the Pareto frontier, navigate pricing tiers and rate limits, and decide whether a workload belongs on the synchronous, asynchronous, or batch path. That is the financial vocabulary of the rest of this book.

Chapter 4 takes this generic framing and zooms in on the first vendor specifically: Anthropic's Claude — the Messages API, the model family, prompt caching, extended thinking, and tool use, all priced and instrumented using the framework you just learned.

??? question "Quick Self-Check — Click to Reveal Answers"
    1. **What is the output premium, and why does it exist?** The ratio of output token price to input token price (typically 3×–5×). It exists because output tokens are produced one at a time autoregressively while input tokens are processed in parallel — output is structurally more expensive compute.
    2. **A request uses 5,000 input tokens and 500 output tokens at \$1/MTok input and \$5/MTok output. Cost?** \$0.005 + \$0.0025 = \$0.0075.
    3. **Why is cost-per-outcome more useful than cost-per-request?** Cost-per-request can drop while quality also drops (for example, switching to a worse model). Cost-per-outcome divides by success rate, so it catches quality regressions.
    4. **What does the batch API cost relative to the synchronous API for the same work?** Typically 50% — the batch discount is the structural reward for letting the vendor schedule the work flexibly.
    5. **You have a workload that runs once a day and processes 50,000 documents. Should it be sync, async, or batch?** Batch — there is no real-time requirement, and the 50% discount is essentially free money.

!!! mascot-celebration "End of Chapter 3"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Pemba celebrating">
    Three chapters in, you have the full vocabulary: tokens, tokenizers, pricing, unit economics, budgets, frontiers, and API modes. The next three chapters apply this framework to each major vendor. Cheap systems are arithmetic systems — and you've just learned the arithmetic.

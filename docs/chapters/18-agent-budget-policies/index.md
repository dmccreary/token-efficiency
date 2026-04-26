---
title: Agent Budget Policies and Session Limits
description: Bounding what an autonomous harness can spend — per-session token and tool-call budgets, loop limits, wall-clock caps, runaway detection, circuit breakers, per-engineer and per-PR budgets, and the vendor-imposed 5-hour and weekly limits
generated_by: claude skill chapter-content-generator
date: 2026-04-26 09:00:00
version: 0.07
---

# Agent Budget Policies and Session Limits

## Summary

Bounding what an autonomous harness can spend: per-session token and tool-call budgets, loop iteration limits, wall-clock limits, cost caps and graceful degradation, runaway detection, circuit breakers, tool-call throttling, per-engineer and per-PR budgets, the vendor-imposed 5-hour and weekly session limits, and budget-versus-outcome reporting.

## Concepts Covered

This chapter covers the following 22 concepts from the learning graph:

1. Agent Budget Policy
2. Per-Session Token Budget
3. Per-Session Tool Call Budget
4. Loop Iteration Limit
5. Wall Clock Limit
6. Cost Cap
7. Graceful Degradation
8. Budget Exhaustion Handling
9. Runaway Detection
10. Circuit Breaker Pattern
11. Tool Call Throttling
12. Subtask Budget Allocation
13. Budget Audit Log
14. Budget Reporting
15. Per-Engineer Budget
16. Per-Repository Budget
17. Per-PR Budget
18. Budget Notification
19. Manager Weekly Report
20. Budget Versus Outcome
21. 5-Hour Limit
22. Weekly Limit

## Prerequisites

This chapter builds on concepts from:

- [Chapter 3: Pricing, Economics, and Async API Modes](../03-pricing-economics-async-apis/index.md)
- [Chapter 7: AI Coding Harnesses and Agentic Loops](../07-coding-harnesses-agentic-loops/index.md)
- [Chapter 9: Structured Logging for LLM Calls](../09-structured-logging/index.md)
- [Chapter 10: Observability, Dashboards, and Alerting](../10-observability-dashboards-alerting/index.md)
- [Chapter 11: Log File Analysis and Cost Hotspots](../11-log-file-analysis/index.md)

---

!!! mascot-welcome "The Safety Net Under Every Agent"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Pemba waving welcome">
    Routing (Chapter 17) makes routine work cheap. Caching (Chapter 14) makes prefixes cheap. Compaction (Chapter 16) makes long sessions cheap. None of them stops a runaway: an agent loop that decides to read every file in the repo three times, or a confused subagent that retries the same broken tool 200 times. This chapter installs the budgets — the hard ceilings that fire before a single bad session can cost a thousand dollars. Cheap systems are systems with brakes.

## Why Budgets Are Non-Negotiable

In a non-agent application, the cost of a single request is bounded by `max_tokens` — even a misbehaving prompt can only spend so much before truncation kicks in. In an *agent* application, no such natural bound exists. An agent loop can iterate as many times as the model decides, each iteration potentially calling expensive tools, each iteration's input growing as the conversation grows. The cost of a single agent session is, in principle, unbounded.

Real production incidents from this gap include: a code-refactor agent that read the same 50,000-line file 40 times in one session (seven figures of input tokens), a research agent that recursively spawned subagents in a loop (a six-figure session in twenty minutes), a tool-use agent that hit a rate limit, retried with exponential backoff for hours, and burned a budget without making progress.

The countermeasure is the same in every case: hard budgets that fire before the runaway becomes catastrophic.

## Budget Granularities

An **agent budget policy** is the formal spec of what limits apply to which scope. Production budget policies span several granularities, each catching a different failure mode.

The **per-session token budget** is the cap on cumulative tokens consumed by one agent session. When the cap is hit, the harness halts the session — possibly with a graceful summary, possibly hard. Typical cap: 1–10M tokens for normal coding sessions, scaled up for genuinely large tasks. Anything beyond 10M is almost certainly a runaway.

The **per-session tool call budget** is the cap on number of tool invocations per session. Often a more useful safety brake than tokens because runaways frequently manifest as call-count explosions before the token count catches up. Typical cap: 100–500 tool calls per session.

The **loop iteration limit** is a cap on number of agentic-loop iterations (Chapter 7). Each iteration is one request-response round; runaway loops trip this before either tokens or tool calls explode. Typical cap: 50–200 iterations per session.

The **wall clock limit** is a cap on session wall-clock duration. Useful as a backstop when token and call counts look normal but the session is just stuck — the model is endlessly retrying a tool that doesn't work, for example. Typical cap: 30 minutes to 2 hours.

The **cost cap** is the explicit dollar ceiling derived from the token cap and the in-use model's prices. For a session running on a model that costs \$3/MTok input and \$15/MTok output, a 10M-token cap implies a cost cap of roughly \$50–\$100 depending on input/output mix. Some teams set the cap in dollars directly and back-compute the token equivalent.

These budgets compose: a session ends when *any* one of them is hit. Belt and suspenders is the right design — each catches a different failure mode and the cost of redundant caps is zero.

## Budget Exhaustion Handling and Graceful Degradation

What happens when a budget is hit matters as much as the cap itself.

**Budget exhaustion handling** is the policy executed when a session hits its limit. Three common patterns:

- **Hard halt** — session stops immediately, returns whatever partial results exist, logs the budget exhaustion as a session outcome
- **Graceful summary** — before halting, ask the model for a one-paragraph summary of what it accomplished and what's left, so the user can resume manually
- **Escalation prompt** — surface to the user "this session has consumed \$X, do you want to allow another \$Y?" and let the user decide

Hard halt is the safe default. Graceful summary is better UX when the work is partially recoverable. Escalation prompts are appropriate for interactive sessions where the user is present; they're a footgun for batch agent workloads where no human is watching.

**Graceful degradation** is the broader principle: when a budget is approaching its limit, the agent should shift behavior in cost-aware ways before being hard-stopped. Examples:

- Switch from a strong model to a cheaper one
- Stop spawning new subagents
- Avoid making more tool calls; rely on what's already in context
- Compact the conversation aggressively (Chapter 16)
- Decline to attempt new sub-tasks; finish the current one

A well-designed agent shifts gracefully through these as the budget drains, rather than running at full speed into the wall.

## Runaway Detection

**Runaway detection** is the real-time monitoring that catches a session going off the rails *before* it hits the hard budget cap. The detection signals:

- Token-rate spike (current iteration consuming much more than the running average)
- Tool-call-rate spike (more tool calls per minute than typical)
- Repetitive tool calls (same tool with same arguments multiple times in a row — sign of a stuck loop)
- Output-pattern repetition (the model is producing near-identical responses across iterations)
- Lack of progress (some external signal that the work is not advancing)

Detection should fire alerts (Chapter 10) and may trigger automatic intervention (the next concept). Runaway detection is the difference between catching a problem at iteration 30 and catching it at iteration 200.

## Circuit Breakers and Tool Call Throttling

The **circuit breaker pattern** is borrowed from distributed systems: a logical "switch" that opens (interrupts traffic) when a failure threshold is crossed and stays open for a cooldown period. Applied to agents:

- The breaker monitors per-session metrics (tool failure rate, repeat-invocation rate, cost rate)
- When a metric crosses its threshold, the breaker "trips" and the session halts immediately
- The breaker logs the trip with the triggering metric value for postmortem analysis
- The breaker may auto-reset after a cooldown (allowing the next session to proceed) or stay tripped until manually cleared

Circuit breakers are particularly important for tool failures. A tool that returns errors 100% of the time but the agent keeps retrying is a classic runaway pattern; a tool-failure-rate circuit breaker trips it immediately.

**Tool call throttling** is the related practice of limiting tool-call rate per session — no more than N calls per minute, no more than M repeats of the same tool with the same arguments. Throttling is rate-limiting at the harness level, complementing the vendor's API rate limits.

#### Diagram: Agent Budget Policy with Multiple Limits

<iframe src="../../sims/agent-budget-policy-multi-limit/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Agent Budget Policy with Multiple Limits</summary>
Type: chart
**sim-id:** agent-budget-policy-multi-limit<br/>
**Library:** Chart.js<br/>
**Status:** Specified

Purpose: Show a session in progress with four parallel budget meters (tokens, tool calls, iterations, wall clock) and visualize which one would fire first under different scenarios.

Bloom Level: Apply (L3)
Bloom Verb: implement

Learning objective: Implement a multi-cap budget policy and identify which cap fires first under different failure modes.

Chart type: Multi-meter dashboard
- Four horizontal "fuel gauge" meters: Tokens used / Cap, Tool calls / Cap, Iterations / Cap, Wall clock / Cap
- A timeline below showing the session's per-iteration consumption

Interactive controls:
- Sliders to set each cap value
- Dropdown: scenario ("Healthy session", "Token runaway", "Tool-call explosion", "Stuck loop")
- Button: "Run session" — animates iterations until one cap fires
- Toggle: "Enable graceful degradation at 75% of any cap"

Data Visibility Requirements:
  Stage 1: Show all four meters at 0%
  Stage 2: As the session runs, animate the meters filling at scenario-appropriate rates
  Stage 3: When the first cap fires, highlight which one and stop the session
  Stage 4: With graceful degradation on, show consumption rate slowing after 75%

Default state: Healthy scenario with reasonable caps

Implementation: Chart.js horizontal bar charts as meters, responsive grid layout
</details>

## Subtask Budget Allocation

In agent workflows that spawn subagents (Chapter 7), how is the parent session's budget divided?

**Subtask budget allocation** is the policy that assigns a portion of the parent's remaining budget to each subagent it spawns. Two patterns:

- **Static allocation** — pre-declared budget per subtask type (research subagent: 100K tokens, refactor subagent: 500K tokens). Predictable; easy to enforce. Doesn't adapt when the parent's budget is nearly exhausted.
- **Proportional allocation** — each subagent gets a fraction of the parent's *remaining* budget. Adapts to budget pressure but can starve later subagents if early ones consume too much.

In practice, a hybrid works best: static allocation with a "you cannot exceed P% of remaining parent budget" constraint as a safety check.

## Audit Logs and Reporting

A **budget audit log** records every budget event — limit configuration changes, sessions that approached limits, sessions that hit limits, sessions that triggered circuit breakers. The audit log is what you consult during postmortems and what compliance auditors ask for.

**Budget reporting** is the periodic surfacing of budget data to stakeholders. Different audiences need different reports:

- Engineers: per-session reports (which sessions hit caps, why, what to change)
- Engineering managers: per-team and per-repo aggregates (where is the team's spend going?)
- Finance: per-budget aggregates against monthly forecasts (Chapter 3)

The cost dashboard from Chapter 10 covers part of this; budget-specific reports add the policy-versus-actual lens.

A **manager weekly report** is the routine artifact for engineering managers — total cost per engineer, per repo, per PR for the week, with trend comparisons to the prior week. The report makes spend visible to the people responsible for managing it. Weekly cadence is the right rhythm — daily is too noisy, monthly is too late.

## Budget Granularities Beyond the Session

Per-session budgets are the foundation, but useful budget policies extend beyond:

A **per-engineer budget** is a monthly allowance per engineer for harness usage. Caps individual experimentation cost; surfaces the engineers whose patterns deserve coaching (or whose work genuinely requires the spend).

A **per-repository budget** is the cap on total harness cost per repo per month. Some repos justify high spend (the production codebase under active refactor); others should be lower (a documentation-only repo). The per-repo policy makes intent explicit.

A **per-PR budget** is the cap on cumulative agent cost attributable to a single pull request — every refactor session, every code-review run, every test-generation pass that touched the PR. Per-PR budgets surface PRs where the agent assistance was disproportionately expensive relative to the change shipped.

The granularity hierarchy:

| Scope | Time Window | Typical Cap | Purpose |
|-------|-------------|-------------|---------|
| Per-session | Single session | \$0.50–\$50 | Catch runaways |
| Per-PR | Until PR ships | \$5–\$200 | Catch over-iteration on a single change |
| Per-engineer | Monthly | \$500–\$5,000 | Cap individual experimentation cost |
| Per-repo | Monthly | \$5,000–\$50,000 | Allocate spend across business priorities |

Higher levels enforce against lower; a per-engineer cap that goes red doesn't kill the current session, it stops new ones from starting until the next reset.

## Budget Notifications

A **budget notification** is the message sent when a budget event occurs — an agent session approaching its cap, a cap actually firing, an engineer's monthly budget at 75%, a repo trending toward overspend.

Notifications should:

- Fire to the right person (engineer for session-level, manager for team-level, finance for org-level)
- Include enough context to act ("session foo-1234 hit token cap; here's the partial result and the most expensive operations")
- Not be spammy — set thresholds that fire on meaningful events, not every tick

The format matters: a Slack message with a link to the relevant dashboard is dramatically more useful than an email with the bare metric. Wire notifications into the same tools your team already uses.

## Budget Versus Outcome Reporting

**Budget versus outcome** is the analytical view that pairs budget consumption with what was accomplished. The question it answers: are we getting our money's worth? A team that spent \$10K on agent assistance and shipped 50 PRs has a different cost-per-outcome than one that spent \$10K and shipped 5.

The standard report:

- For each completed PR: total agent cost, number of agent sessions, lines changed, review-iteration count
- Aggregated per engineer / per team / per repo
- Trended over time

Budget-versus-outcome is what turns "we spent X on LLMs" into "we spent X on LLMs and shipped Y" — the conversation that justifies (or rebuts) the budget allocation.

## The Vendor Limits

Vendors impose their own session limits that act as backstops to your policy. Two specifically named:

The **5-hour limit** (Anthropic; analogous limits at other vendors) is a vendor-imposed rate cap that kicks in when a single user account performs heavy continuous usage over a 5-hour window. When the limit fires, further requests in that window are rate-limited or rejected. This is genuinely a constraint for heavy harness users — a long debugging session can hit it. Plan around it: split heavy work across accounts where appropriate, or cap session durations.

The **weekly limit** is the analogous longer-window cap, kicking in after sustained heavy usage over multiple days. Less frequently encountered than the 5-hour limit but real for power users.

These vendor limits are not configurable — they're terms of service. Your budget policies should respect them; design sessions assuming they exist.

#### Diagram: Per-Engineer / Per-PR / Per-Repo Budget Hierarchy

<iframe src="../../sims/budget-hierarchy-roll-up/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Per-Engineer / Per-PR / Per-Repo Budget Hierarchy</summary>
Type: infographic
**sim-id:** budget-hierarchy-roll-up<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Show how individual session costs roll up through PR, engineer, repo, and organization budgets, with each level's cap and current consumption visible.

Bloom Level: Analyze (L4)
Bloom Verb: organize

Learning objective: Organize per-session costs into the hierarchical budget structure (PR → engineer → repo → organization) and identify which level would fire first.

Canvas layout:
- Pyramid diagram with five levels (Session → PR → Engineer → Repo → Organization), each level wider than the one above
- Each level shows: scope label, current consumption (% of cap), cap value
- Arrows show the roll-up relationship

Interactive controls:
- Click any level: drill down into the contributing items at the next level
- Slider: time window (this session, this PR, this week, this month)
- Toggle: "Highlight at-risk levels" (>75% of cap)

Data Visibility Requirements:
  Stage 1: Show all five levels with example data
  Stage 2: When user clicks the Engineer level, show the contributing PRs
  Stage 3: When at-risk highlighting is on, color levels above 75% in orange and 90% in red

Default state: All levels healthy

Implementation: p5.js with responsive width
</details>

!!! mascot-warning "Set Caps Before You Need Them"
    <img src="../../img/mascot/warning.png" class="mascot-admonition-img" alt="Pemba cautioning">
    Almost no team sets budget policies before their first runaway. Almost every team sets them after — usually one to two weeks after the bill that prompted the conversation. The cost of getting in front of this is one afternoon of policy design; the cost of not is a four-figure (or higher) surprise on a single session. Set the caps now, while you're reading this. Cheap systems have brakes that were installed before the first crash.

## Putting It All Together

You can now bound agent costs at every level. You define an **agent budget policy** that combines a **per-session token budget**, a **per-session tool call budget**, a **loop iteration limit**, a **wall clock limit**, and an explicit **cost cap** — caps that compose so the first one to fire halts the session. You implement **budget exhaustion handling** — hard halt, graceful summary, or escalation — backed by **graceful degradation** that downshifts cost-aware behavior as a budget approaches. You add **runaway detection** for in-flight catching, the **circuit breaker pattern** for automatic intervention, and **tool call throttling** to bound per-tool rates. You handle **subtask budget allocation** for subagent work. You record everything in a **budget audit log**, surface it via **budget reporting** including the **manager weekly report**, and analyze with **budget versus outcome** views. You extend caps beyond the session — **per-engineer budget**, **per-repository budget**, **per-PR budget** — and you wire **budget notifications** into your existing communication tools. Finally, you respect the vendor's **5-hour limit** and **weekly limit** as backstops to your own policy.

Chapter 19 zooms back out to operational concerns for any production deployment: batch operations done safely, plus the privacy and compliance frameworks that govern what can be sent to the model in the first place.

??? question "Quick Self-Check — Click to Reveal Answers"
    1. **Why have multiple cap types instead of just a token cap?** Different runaway modes manifest differently — sometimes the token count is normal but tool-call count explodes, sometimes the iteration count goes wild while tokens stay flat. Multiple caps catch all the modes.
    2. **What is graceful degradation in this context?** As a session approaches its budget, automatically shift to cheaper behaviors — switch to a smaller model, stop spawning subagents, compact conversation aggressively, decline new sub-tasks.
    3. **What does a circuit breaker do that a simple cap doesn't?** It monitors *quality* signals (tool failure rate, repeat-invocation rate) in addition to cost, and trips immediately when those signals indicate a stuck or broken session — before the cost cap would fire.
    4. **What's the right cadence for budget reporting?** Weekly for engineer-level and team-level reporting. Daily is too noisy; monthly is too late to act on.
    5. **What is the 5-hour limit?** A vendor-imposed rate cap that fires when one account performs heavy continuous usage over a 5-hour window. Backstop to your own per-session policy.

!!! mascot-celebration "End of Chapter 18"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Pemba celebrating">
    Brakes installed at every level. Next chapter handles the operational side: batch jobs run safely, plus the privacy and compliance frameworks that govern what data can be sent to the model.

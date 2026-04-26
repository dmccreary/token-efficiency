---
title: Serial vs Parallel Tradeoff
description: Dual-axis bar chart of wall-clock time and total token cost as parallelism grows from 1 to 16, surfacing the parallel token penalty.
image: /sims/serial-vs-parallel-tradeoff/serial-vs-parallel-tradeoff.png
og:image: /sims/serial-vs-parallel-tradeoff/serial-vs-parallel-tradeoff.png
twitter:image: /sims/serial-vs-parallel-tradeoff/serial-vs-parallel-tradeoff.png
social:
   cards: false
---

# Serial vs Parallel Tradeoff

<iframe src="main.html" height="542px" width="100%" scrolling="no"></iframe>

[Run the MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim
A dual-axis bar chart comparing wall-clock time (left axis, blue) and total token cost (right axis, orange) as parallelism grows from serial (1) to ×16. The parallel token penalty surfaces immediately: time goes down, cost goes up — and the rate at which cost grows depends critically on whether caching is on. Caching makes the parallel penalty milder; without caching, every parallel agent re-pays the full system prompt.

## How to Use
1. **Read the default.** 8 subtasks, 8K system prompt, caching on. Note time goes from a long bar at serial to a short one at ×16, while cost grows modestly.
2. **Disable caching.** Now the cost bars grow much more steeply with parallelism — that's the penalty without prefix sharing.
3. **Bump system prompt to 20K.** Cost penalty steepens further; time changes minimally.
4. **Find the knee.** Where does adding more parallelism stop reducing time meaningfully?

## Bloom Level
**Evaluate (L5)** — judge whether a particular multi-task workload should run serially or in parallel based on cost, latency, and the parallel token penalty.

## Iframe Embed Code
```html
<iframe src="sims/serial-vs-parallel-tradeoff/main.html" height="542px" width="100%" scrolling="no"></iframe>
```

## Lesson Plan

### Audience
Engineers building agentic systems with subagent dispatch (Claude Code, Codex, Antigravity).

### Duration
10–15 minutes inside Chapter 7.

### Prerequisites
Chapter 7 sections on Subagent Pattern, Serial Execution, Parallel Execution, Parallel Token Penalty.

### Activities
1. **Calibrate (3 min).** Read serial cost vs ×16 cost at default settings. Note the ratio.
2. **Caching disabled (5 min).** Compare same scenario, caching off. Note ratio change.
3. **Decision rule (5 min).** Build a rule: "for this workload type, use parallelism factor X because Y."

### Practice Scenarios
| # | Workload | Parallelism choice | Why |
|---|---|---|---|
| 1 | 30 independent code lints, latency-critical | ×8 or ×16 | trade cost for latency |
| 2 | 30 independent code lints, latency-tolerant | serial | minimize cost |
| 3 | 4 chained reasoning steps with dependencies | serial | parallelism inapplicable |
| 4 | 16 retrievals for one agent task | ×16 with caching on | minimal penalty |
| 5 | 16 retrievals, caching off | serial or ×4 | caching off makes ×16 wasteful |

### Assessment
Learner has met the objective when, given a workload description, they can recommend a parallelism factor and articulate the cost-vs-latency tradeoff.

## References
1. Anthropic Engineering — *Subagent patterns*.
2. Chapter 7 — Subagent Pattern, Parallel Token Penalty.
3. *Designing Data-Intensive Applications* (Kleppmann) — chapter on parallelism patterns.

---

## Senior Instructional Designer Quality Review

*Reviewer perspective: 15+ years designing engineering and distributed-systems curricula for adult professional learners.*

### Overall verdict
**Approve as-is for Chapter 7.** Score: **88/100 (B+).** Dual-axis time-vs-cost is the right primitive for this comparison, and the caching toggle teaches the load-bearing variable.

### What works
1. **Bloom alignment.** L5 "judge" demands weighing competing dimensions; dual-axis chart externalizes both.
2. **Caching toggle as the load-bearing lever.** Without it, students miss why parallelism is sometimes free and sometimes brutal.
3. **Knee-of-curve discoverable.** As parallelism grows, time stops dropping but cost keeps rising.

### Gaps
1. **No explicit "knee" annotation.** Marking the parallelism factor where time-savings flatten would surface the L5 decision point. Score impact: −3.
2. **No latency-budget overlay.** A "latency budget" line would let the learner read the minimum parallelism that meets a target. Score impact: −2.
3. **Single workload model.** Independent subtasks only — chained workloads can't actually parallelize, and that's a relevant L5 decision. Score impact: −2.

### Accessibility
Dual-axis colors (blue/orange) are color-blind safe. Status text reinforces.

### Cognitive load
5 parallelism levels × 2 series + 4 controls. Tractable.

### Recommendation
Approve. Open follow-up for knee annotation (gap 1).

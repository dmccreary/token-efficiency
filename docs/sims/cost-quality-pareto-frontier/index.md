---
title: Cost-Quality Pareto Frontier
description: Scatter plot of model configurations on cost vs quality with the Pareto frontier highlighted; sliders apply quality and cost constraints to find the survivor set.
image: /sims/cost-quality-pareto-frontier/cost-quality-pareto-frontier.png
og:image: /sims/cost-quality-pareto-frontier/cost-quality-pareto-frontier.png
twitter:image: /sims/cost-quality-pareto-frontier/cost-quality-pareto-frontier.png
social:
   cards: false
---

# Cost-Quality Pareto Frontier

<iframe src="main.html" height="582px" width="100%" scrolling="no"></iframe>

[Run the MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim
A scatter plot of nine representative model configurations on log-scale cost vs quality. The Pareto frontier (green) connects non-dominated points — those for which no other configuration is both cheaper *and* higher quality. Dominated points (gray) should never be chosen. Sliders apply quality-floor and cost-ceiling constraints, gray-fading any configuration that fails the test, leaving only the survivors.

## How to Use
1. **Read the green frontier.** These are the only configurations worth considering. The dashed line connects them.
2. **Notice the dominated points.** Any gray point — its cost-quality position is strictly worse than some green point. Never pick these.
3. **Set quality floor to 80.** Watch some frontier points fade. Read the survivor list at the bottom.
4. **Set cost ceiling to $0.01.** Combined with quality 80, the survivor set narrows further. Often it collapses to a single configuration — the right pick.

## Bloom Level
**Evaluate (L5)** — judge which model configurations are worth considering for a given workload and which are strictly dominated.

## Iframe Embed Code
```html
<iframe src="sims/cost-quality-pareto-frontier/main.html" height="582px" width="100%" scrolling="no"></iframe>
```

## Lesson Plan

### Audience
Engineers and ML engineers selecting model configurations for production workloads.

### Duration
10–15 minutes inside Chapter 3.

### Prerequisites
Chapter 3 sections on Cost-Quality Tradeoff, Pareto Frontier, Cached Input Price.

### Activities
1. **Identify the frontier (3 min).** Without sliders, name every green point.
2. **Spot the dominators (3 min).** For each gray point, name the green point that strictly dominates it and explain why.
3. **Apply constraints (5 min).** Set quality floor to 85, cost ceiling to $0.05. List the survivors. Argue for the best pick.

### Practice Scenarios
| # | Quality floor | Cost ceiling | Survivor |
|---|---|---|---|
| 1 | 0   | $1.00  | (full frontier) |
| 2 | 80  | $0.05  | ? |
| 3 | 90  | $0.20  | ? |
| 4 | 75  | $0.005 | ? |
| 5 | 95  | $1.00  | ? |

### Assessment
Learner has met the objective when, given a new configuration, they can decide whether it joins the frontier or is dominated.

## References
1. *Multiple-Criteria Decision Analysis* — for the formal Pareto-dominance definition.
2. Anthropic / OpenAI / Google pricing pages — for the actual configurations plotted here.
3. Chapter 3 of this textbook — Cost-Quality Tradeoff.

---

## Senior Instructional Designer Quality Review

*Reviewer perspective: 15+ years designing engineering and decision-science curricula for adult professional learners.*

### Overall verdict
**Approve as-is for Chapter 3.** Score: **89/100 (B+).** Pareto-frontier visualization is the canonical primitive for L5 "judge"; this implementation makes the dominated set undeniably visible.

### What works
1. **Bloom alignment correct.** L5 "judge" requires applying explicit criteria; the constraint sliders externalize the criteria.
2. **Log-scale X axis.** Without it, the cheap-model cluster vs expensive-thinking cluster wouldn't both be visible.
3. **Dashed frontier line.** Visually proves the "non-dominated" claim — every green point is reachable on the line.
4. **Survivor list in the status banner.** Translates filtering to action.

### Gaps
1. **Only 9 configurations.** Real teams have many more (different prompts, caching variants, vendor combos). A "load my own configurations" or "add a custom point" affordance would teach the methodology, not just the answer. Score impact: −3.
2. **No way to define a custom quality metric.** Different workloads care about different quality dimensions; the single 0–100 score conflates them. Score impact: −2.
3. **No explicit dominance explainer.** Hovering a gray point should show "dominated by: <other point>" in the tooltip. Score impact: −2.

### Accessibility
Color-blind safe (green/gray with size differences). Tooltips have full text. Slider labels show numeric values.

### Cognitive load
9 points + 2 sliders + frontier line. Tractable.

### Recommendation
Approve. Open follow-up for hover-explains-dominance (gap 3) — small but high-impact addition.

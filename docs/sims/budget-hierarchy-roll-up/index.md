---
title: Budget Hierarchy Roll-Up
description: Pyramid diagram showing how individual session costs roll up through PR, engineer, repo, and organization budgets, with at-risk highlighting at 75%/90%.
image: /sims/budget-hierarchy-roll-up/budget-hierarchy-roll-up.png
og:image: /sims/budget-hierarchy-roll-up/budget-hierarchy-roll-up.png
twitter:image: /sims/budget-hierarchy-roll-up/budget-hierarchy-roll-up.png
social:
   cards: false
---

# Budget Hierarchy Roll-Up

<iframe src="main.html" height="602px" width="100%" scrolling="no"></iframe>

[Run the MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim
A pyramid of five hierarchical budget levels (Session → PR → Engineer → Repo → Organization). Each level shows current consumption against its cap; at-risk levels are colored amber (75%+) or red (90%+). The visualization makes obvious which level would fire first under current consumption and time window.

## How to Use
1. **Read the default hierarchy.** The Engineer level is at 69% — closest to its cap.
2. **Toggle at-risk highlighting.** Watch amber appear on near-cap levels.
3. **Change time window.** Notice how shorter windows often have lower consumption percentages — fresh windows.

## Bloom Level
**Analyze (L4)** — organize per-session costs into the hierarchical budget structure (PR → engineer → repo → organization) and identify which level would fire first.

## Iframe Embed Code
```html
<iframe src="sims/budget-hierarchy-roll-up/main.html" height="602px" width="100%" scrolling="no"></iframe>
```

## Lesson Plan

### Audience
Engineering managers and platform-team members designing organizational budget policies for LLM use.

### Duration
10–15 minutes inside Chapter 18.

### Prerequisites
Chapter 18 sections on Per-Engineer Budget, Per-Repository Budget, Per-PR Budget.

### Activities
1. **Identify the firing level (3 min).** Without highlighting, predict which level is closest to its cap.
2. **Multiple-cap interplay (5 min).** Discuss: what should happen when a Session is healthy but the Engineer level is at 95%?
3. **Organizational policy design (5 min).** What ratios between consecutive levels are appropriate? (Engineer:PR is ~4:1 here.)

### Practice Scenarios
| # | Scenario | Which level fires first? |
|---|---|---|
| 1 | Defaults | Engineer (~69%) |
| 2 | One engineer monopolizes work — Engineer 95% | Engineer |
| 3 | Many engineers share work — Repo 88%, Engineers all 50% | Repo |
| 4 | Single PR runs unusually long — PR 80%, others 30% | PR |
| 5 | All levels ~20% | None — healthy |

### Assessment
Learner can identify which level of a multi-level budget policy fires first given a snapshot, and recommend cap ratios for new policies.

## References
1. Chapter 18 — Per-Engineer Budget, Per-Repository Budget.
2. *AWS Cost Explorer* — adjacent literature on hierarchical cost attribution.

---

## Senior Instructional Designer Quality Review

*Reviewer perspective: 15+ years designing engineering and platform-engineering curricula for adult professional learners.*

### Overall verdict
**Approve as-is for Chapter 18.** Score: **86/100 (B+).** Pyramid visualization is the right primitive for hierarchical roll-up; the 75%/90% color thresholds make at-risk levels self-evident.

### What works
1. **Bloom alignment.** L4 "organize" requires structuring data hierarchically; the pyramid is the structure.
2. **Color thresholds visible.** The amber/red transitions teach the standard alerting bands.
3. **Each level's percentage shown numerically.** No need to estimate from bar fill.

### Gaps
1. **Drill-down not implemented.** Clicking a level to see contributing items below would close the L4 loop. Score impact: −4.
2. **Time-window selector is mostly cosmetic.** Real implementation would change consumed values per window. Score impact: −2.
3. **Single snapshot.** A "fast-forward time" affordance to watch consumption climb would teach urgency. Score impact: −2.

### Accessibility
Color-blind safe with both color and percentage text. Native p5.js controls are keyboard-accessible.

### Cognitive load
5 levels + 2 controls. Tractable.

### Recommendation
Approve. Open follow-up for click-to-drill-down (gap 1) — highest-impact addition.

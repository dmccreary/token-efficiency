---
title: Burn Rate Monthly Forecast
description: Daily and cumulative LLM spend with linear forecast extrapolation against a budget line, surfacing whether current spend is on track or over budget.
image: /sims/burn-rate-monthly-forecast/burn-rate-monthly-forecast.png
og:image: /sims/burn-rate-monthly-forecast/burn-rate-monthly-forecast.png
twitter:image: /sims/burn-rate-monthly-forecast/burn-rate-monthly-forecast.png
social:
   cards: false
---

# Burn Rate Monthly Forecast

<iframe src="main.html" height="542px" width="100%" scrolling="no"></iframe>

[Run the MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

A combination chart showing daily LLM spend (blue bars) up to "today," with a solid green cumulative line over the actual data and a dashed green forecast line extrapolating to day 30. The red horizontal budget line is the reference; the status banner says ON TRACK or OVER BUDGET based on the forecast intersection.

## How to Use
1. **Read the default state** (today=18, burn=1.0, budget=$30K). Note the status banner.
2. **Slide "today" earlier** to day 5. Forecast becomes much noisier — small changes in early-month spend project huge differences by month-end.
3. **Bump "burn multiplier" to 1.5.** The dashed line steepens. Watch the status flip to OVER BUDGET.
4. **Toggle seasonality.** Forecast bends upward on weekdays (×1.3) and dips on weekends (×0.6).
5. **Adjust budget.** Lower budgets fire OVER BUDGET earlier in the month — useful for setting alerts.

## Bloom Level
**Apply (L3)** — calculate a monthly cost forecast from a partial-month burn rate.

## Iframe Embed Code
```html
<iframe src="sims/burn-rate-monthly-forecast/main.html" height="542px" width="100%" scrolling="no"></iframe>
```

## Lesson Plan

### Audience
Engineering managers and platform-team members responsible for monthly LLM budget reporting.

### Duration
10–15 minutes inside Chapter 3.

### Prerequisites
Chapter 3 sections on Monthly Token Spend, Forecasting Token Cost, and Burn Rate.

### Activities
1. **Calibrate the default (3 min).** Read the status. Note the math: cumulative-to-date / today = avg daily burn → × 30 = projected end-of-month.
2. **Early-month volatility (5 min).** Slide today to day 3, then day 18. Note how the forecast confidence improves with more data.
3. **Seasonality lesson (5 min).** Toggle seasonality. Note that a flat-burn forecast over-predicts spend in seasonal workloads when the projection date lands on weekends.
4. **Practice scenarios.**

### Practice Scenarios
| # | Today | Burn ×  | Seasonality | Budget | Status |
|---|---|---|---|---|---|
| 1 | 18 | 1.0 | off | 30K | ? |
| 2 | 18 | 1.5 | off | 30K | ? |
| 3 | 18 | 1.0 | on  | 30K | ? |
| 4 | 5  | 1.0 | off | 30K | ? |
| 5 | 28 | 1.0 | off | 30K | ? |

### Assessment
Learner has met the objective when, given a partial-month spend total and a target budget, they can compute the projected end-of-month spend and identify whether the team is on or over budget.

## References
1. FinOps Foundation — *Forecasting cloud spend* — adjacent literature on partial-month projection.
2. Anthropic Documentation — *Usage and billing dashboard*.
3. Chapter 3 of this textbook — Monthly Token Spend.

---

## Senior Instructional Designer Quality Review

*Reviewer perspective: 15+ years designing engineering and FinOps curricula for adult professional learners.*

### Overall verdict
**Approve as-is for Chapter 3.** Score: **88/100 (B+).** A clean Apply-level (L3) calculator with the right primary visualization (linear extrapolation) and a proper status banner that translates math to action.

### What works
1. **Bloom alignment correct.** L3 "calculate" is exactly what this is.
2. **Seasonality toggle is the right pedagogical bend.** Naive linear forecasting over-predicts seasonal workloads; the toggle makes that visible.
3. **The status banner is the load-bearing UX element.** Without it, the chart is just data; with it, the chart is a decision.
4. **Budget slider, not a fixed value.** Lets the learner explore "what budget would I need?" rather than just "did I exceed mine?".

### Gaps
1. **Linear extrapolation is too simple.** Real teams use moving-average or trailing-window forecasts. A toggle for "use last 7 days only" would teach a more honest method. Score impact: −3.
2. **No alerting threshold.** A real burn-rate alert fires before end-of-month, not at it. A "alert when projected > budget × 1.1" line would teach the operations side. Score impact: −2.
3. **No way to see prior months.** A "compare with last month" overlay would teach trend analysis. Score impact: −2.

### Accessibility
Color-blind safe (blue/green/red verdict text in status). Slider labels show numeric values. Chart legend is at bottom for clarity.

### Cognitive load
4 controls. Tractable. Status banner provides natural-language summary.

### Recommendation
Approve. Open follow-up for moving-average forecast option (gap 1).

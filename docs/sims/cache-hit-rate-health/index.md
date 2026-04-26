---
title: Cache Hit Rate Health
description: Four representative cache hit-rate patterns (healthy, sudden drop, slow erosion, sawtooth) with diagnostic captions and remediation hints.
image: /sims/cache-hit-rate-health/cache-hit-rate-health.png
og:image: /sims/cache-hit-rate-health/cache-hit-rate-health.png
twitter:image: /sims/cache-hit-rate-health/cache-hit-rate-health.png
social:
   cards: false
---

# Cache Hit Rate Health

<iframe src="main.html" height="602px" width="100%" scrolling="no"></iframe>

[Run the MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

Four small-multiple line charts of cache hit rate over 30 days. Each chart represents a real production pattern an oncall engineer must learn to recognize at a glance: healthy, sudden drop (cache invalidation event), slow erosion (slowly-drifting cache key), sawtooth (TTL too short for traffic gaps). Hover any chart to see the diagnostic caption, likely root cause, and what to investigate.

## How to Use
1. **Hover the healthy chart.** Note the small daily TTL dips — these are normal.
2. **Hover sudden drop.** Read the most likely cause: a change to the cached prefix on day 14.
3. **Hover slow erosion.** Read about cache-key drift — the most insidious failure mode.
4. **Hover sawtooth.** Read about TTL/gap mismatch.

## Bloom Level
**Analyze (L4)** — distinguish healthy and degraded cache hit-rate patterns and diagnose the likely root cause of each.

## Iframe Embed Code
```html
<iframe src="sims/cache-hit-rate-health/main.html" height="602px" width="100%" scrolling="no"></iframe>
```

## Lesson Plan

### Audience
Oncall engineers and platform-team members responsible for cost-related alerts.

### Duration
10–15 minutes inside Chapter 14.

### Prerequisites
Chapter 14 sections on Cache Hit Rate, Cache Invalidation, Cache Invariant, Stable Prefix, Cache TTL, Cache Stampede.

### Activities
1. **Pattern recognition drill (5 min).** Cover the captions; look at each chart and try to name the pattern from shape alone.
2. **Diagnostic walk (5 min).** Hover each pattern and verify your diagnosis matches.
3. **Bring-your-own dashboard (5 min).** Use the practice scenarios.

### Practice Scenarios
| # | Observed pattern | Most likely cause | Action |
|---|---|---|---|
| 1 | 88% → 5% on Tuesday | ? | ? |
| 2 | Slow drift from 80% to 50% over the month | ? | ? |
| 3 | Daily oscillation 5% / 60% | ? | ? |
| 4 | Steady 88% with weekly small dips | ? | ? |
| 5 | 88% → 60% over 3 days, then plateau | ? | ? |

### Assessment
Learner has met the objective when, given an unfamiliar 30-day cache-hit-rate plot, they can match the shape to one of the four canonical patterns and propose a remediation.

## References
1. Anthropic Documentation — *Prompt caching: cache invariants and invalidation*.
2. SRE: *How Google Runs Production Systems* — chapter on alerting and pattern recognition.
3. Chapter 14 of this textbook — Cache Hit Rate Metric, Cache Invariant.

---

## Senior Instructional Designer Quality Review

*Reviewer perspective: 15+ years designing engineering and SRE curricula for adult professional learners.*

### Overall verdict
**Approve as-is for Chapter 14.** Score: **88/100 (B+).** Pattern-recognition by small multiples is canonical for L4 "distinguish." The four patterns are the right canonical set for cache hit rate.

### What works
1. **Bloom alignment correct.** L4 "distinguish" is exactly what hovering and reading captions does.
2. **Diagnostic + remediation pair.** Most pattern-recognition diagrams stop at "this is X." This one says "this is X, here's what likely caused it, here's what to check."
3. **Sawtooth is included.** The TTL-too-short pattern is the most-undertaught failure mode in cache literature.
4. **30-day mean is shown for each chart.** Calibrates the eye to the typical baseline.

### Gaps
1. **No interactive overlay for "what changed when?"** The dropdown spec mentioned hypothesis-generation prompts; current implementation skips them. Score impact: −3.
2. **Patterns are static.** A "blend two patterns" toggle would teach that real production data often shows multiple problems simultaneously. Score impact: −2.
3. **No quantitative cost impact.** A 50% drop in hit rate has a real dollar cost; surfacing "this would cost an extra $X/month" would translate diagnosis to budget urgency. Score impact: −2.

### Accessibility
Color-blind safe (single-color line charts). Tooltip on hover provides text alternative.

### Cognitive load
4 small charts in a 2×2 grid. Tractable. Single-action affordance (hover) keeps the surface clean.

### Recommendation
Approve. Open follow-up for cost-impact annotation (gap 3) and the hypothesis-prompt dropdown (gap 1).

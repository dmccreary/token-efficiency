---
title: Stable Prefix / Volatile Suffix
description: Drag the cache boundary on a segmented prompt; toggle each segment between stable and volatile; see cache eligibility update in real time.
image: /sims/stable-prefix-volatile-suffix/stable-prefix-volatile-suffix.png
og:image: /sims/stable-prefix-volatile-suffix/stable-prefix-volatile-suffix.png
twitter:image: /sims/stable-prefix-volatile-suffix/stable-prefix-volatile-suffix.png
social:
   cards: false
---

# Stable Prefix / Volatile Suffix

<iframe src="main.html" height="582px" width="100%" scrolling="no"></iframe>

[Run the MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim
A horizontal segmented prompt with a draggable cache boundary. Each segment is colored by type — stable (green), mixed (yellow), volatile (orange). The cache only catches what's BEFORE the boundary AND not volatile. Drag the boundary, click segments to cycle their type, or use the "anti-pattern: timestamp in system prompt" button to see how a single volatile contaminant collapses cache eligibility.

## How to Use
1. **Drag the cache boundary.** Watch cache eligibility (the % shown below the bar) change.
2. **Click "Anti-pattern: timestamp."** Watch the system prompt segment turn orange (volatile). Note that cache eligibility crashes — even with the boundary at the right place.
3. **Click "Restructure."** Auto-sorts segments: stable first, mixed middle, volatile last. The boundary moves to the natural join.
4. **Click a segment** to cycle its type (stable → mixed → volatile). Useful for trying alternative classifications.

## Bloom Level
**Understand (L2)** — classify prompt components as stable or volatile and place the cache boundary correctly.

## Iframe Embed Code
```html
<iframe src="sims/stable-prefix-volatile-suffix/main.html" height="582px" width="100%" scrolling="no"></iframe>
```

## Lesson Plan

### Audience
Engineers configuring prompt caching on Anthropic, Gemini, or other providers.

### Duration
10–15 minutes inside Chapter 14.

### Prerequisites
Chapter 14 sections on Stable Prefix, Volatile Suffix, Cache Boundary, Cache Invariant.

### Activities
1. **Trace defaults (3 min).** Read the cache-eligibility number. Note that with default placement and types, ~83% is cached.
2. **Anti-pattern demo (5 min).** Click "Anti-pattern: timestamp." Eligibility crashes. Discuss: why does a single volatile element kill caching?
3. **Restructure exercise (5 min).** Reset, then click "Restructure." Confirm the boundary lands at the natural stable-to-volatile join. Note the eligibility number stays high.

### Practice Scenarios
| # | Manipulation | Cache eligibility |
|---|---|---|
| 1 | Defaults, boundary just before user message | ~83% |
| 2 | Add timestamp to system prompt | ~3% |
| 3 | Mark conversation history as volatile | falls |
| 4 | Move boundary after retrieved context | ~85% |
| 5 | Restructure (auto) | maximum possible |

### Assessment
Learner can classify any prompt component as stable / mixed / volatile and place the cache boundary to maximize eligibility.

## References
1. Chapter 14 — Cache Invariant, Stable Prefix.
2. Anthropic Documentation — *Prompt caching: cache_control parameter*.
3. Anthropic Cookbook — *Caching long prefixes*.

---

## Senior Instructional Designer Quality Review

*Reviewer perspective: 15+ years designing engineering and ML curricula for adult professional learners.*

### Overall verdict
**Approve as-is for Chapter 14.** Score: **88/100 (B+).** The drag-the-boundary metaphor is exactly the right primitive for L2 "classify" — it forces the learner to physically commit to a stable/volatile separation.

### What works
1. **Bloom alignment.** L2 "classify" requires the learner to assign categories; clicking segments to cycle types is the assignment action.
2. **Anti-pattern button.** A single click teaches the most common production failure (timestamp in system prompt) more memorably than any prose could.
3. **Live cache-eligibility number.** Translates layout to a metric the learner can optimize against.
4. **Restructure button.** Shows the canonical solution by example.

### Gaps
1. **No cost annotation.** A "$X saved per request" alongside eligibility would teach budget impact. Score impact: −2.
2. **No invariant-violation explanation.** When a volatile element appears BEFORE the boundary, the cache fails for a specific reason; the sim says "warning" but doesn't explain *why* (the cache key is computed across everything before the boundary, including the volatile token). Score impact: −2.
3. **Drag affordance is subtle.** A "click here to drag" hint near the boundary line on first load would help. Score impact: −1.

### Accessibility
Native p5.js controls. Color-blind safe via type-cycle (text labels would help when colors fail).

### Cognitive load
6 segments + 3 buttons + drag affordance. At the upper edge but tractable.

### Recommendation
Approve. Open follow-up for cost-impact annotation (gap 1) — single biggest pedagogical lift.

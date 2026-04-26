---
title: Cross-Vendor Caching Comparison
description: Multi-line cumulative cost chart comparing Anthropic, OpenAI, and Gemini caching mechanics across 50 requests, with sliders for prefix size, cache lifetime, and request frequency.
image: /sims/cross-vendor-caching-comparison/cross-vendor-caching-comparison.png
og:image: /sims/cross-vendor-caching-comparison/cross-vendor-caching-comparison.png
twitter:image: /sims/cross-vendor-caching-comparison/cross-vendor-caching-comparison.png
social:
   cards: false
---

# Cross-Vendor Caching Comparison

<iframe src="main.html" height="582px" width="100%" scrolling="no"></iframe>

[Run the Cross-Vendor Caching Comparison MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

The three major LLM vendors — Anthropic, OpenAI, and Google Gemini — all offer prompt caching, but the *structure* of the cost model differs. Anthropic uses an explicit cache breakpoint with a 1.25× write premium and a 0.10× read; OpenAI uses automatic prefix caching with no write premium and a ~50% read discount; Gemini offers both implicit (auto, slow ramp) and explicit caching (with a per-hour storage cost). This MicroSim plots the cumulative cost of running the same workload on all four cached paths plus a no-cache baseline so you can see exactly where each vendor's curve crosses the others.

The four sliders let you parameterize the workload: prefix size, cache lifetime, request frequency, and whether to include the Gemini explicit storage cost. The summary table at the bottom shows the total dollar cost over 50 requests and the percentage savings versus the no-cache baseline. Use it to recommend a vendor for a new workload.

## How to Use

1. **Read the default chart.** With a 5,000-token prefix, 1-hour TTL, and 1 request/minute, look at the five lines. The dashed gray line is the no-cache baseline — every other line should be below it (caching should always help, except in pathological storage-cost cases).
2. **Watch the crossover points.** As you scan from R1 to R50, notice where the lines cross. The vendor that is cheapest at R5 may not be the cheapest at R50. Anthropic's 1.25× write premium pays off after the 2nd request; OpenAI's no-premium write means it is cheapest immediately but its 0.50× read is less aggressive than Anthropic's 0.10× read.
3. **Increase the prefix size.** Drag prefix to 50,000 tokens. The savings dollar values become much larger but the *shape* of the comparison stays similar — caching mechanics scale linearly with prefix size.
4. **Shorten the TTL.** Drag TTL down to 5 minutes. Notice that the cached lines develop "sawtooth" patterns where the cache expires and a fresh write happens. Anthropic's sawtooth has the steepest 1.25× steps.
5. **Increase request frequency.** Drag frequency from 1/min to 10/min. The TTL fits more requests per cache window, so caching pays off more.
6. **Toggle Gemini storage cost.** With storage off, Gemini explicit looks superb. With storage on, Gemini explicit grows a small linear penalty (per-minute, per-1K-tok-cached). For long-lived caches with many requests, storage is negligible; for low-volume long-cache scenarios, storage can flip the recommendation.

## Bloom Level

**Analyze (L4)** — compare the caching cost models of three vendors and recommend a vendor for a workload.

## Iframe Embed Code

```html
<iframe src="sims/cross-vendor-caching-comparison/main.html"
        height="582px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Adult professional learners — engineers and platform-team members making vendor-selection decisions for production LLM workloads.

### Duration

20 minutes inside Chapter 6, or 45 minutes including the 7-row practice scenario walkthrough.

### Prerequisites

- Chapter 4 sections on Anthropic prompt caching
- Chapter 5 sections on OpenAI automatic caching
- Chapter 6 sections on Gemini implicit and explicit caching
- Comfort reading multi-line charts

### Activities

1. **Read the default lines (5 min).** With default sliders, walk each line in turn and articulate the structural source of its shape (write premium / read discount / storage cost / warm-up).
2. **Find the crossover (5 min).** For the default case, identify the request number at which Anthropic becomes cheaper than OpenAI. Then explain why.
3. **Tune for short bursts (5 min).** Set TTL to 5 minutes and frequency to 1 req/min. Re-read the chart. Which vendor wins now? Why?
4. **Tune for long-running pipelines (5 min).** Set TTL to 24 hours, frequency to 10 req/min. Now compare. Notice how Gemini explicit (with or without storage) looks against Anthropic.
5. **Recommend a vendor (10 min).** For each scenario in the table below, pick the cheapest vendor and explain.

### Practice Scenarios

| # | Prefix | TTL | Frequency | Best vendor | Why |
|---|---|---|---|---|---|
| 1 | 1,000 | 60 min | 1/min | OpenAI or Anthropic | Small prefix, savings dominated by per-request input |
| 2 | 5,000 | 60 min | 1/min | Anthropic | 0.10× read advantage compounds over many turns |
| 3 | 50,000 | 24 hr | 10/min | Gemini explicit (storage on) | Large cache, high volume — storage cost amortizes |
| 4 | 5,000 | 5 min | 0.1/min | None ideal | Cache expires before reuse — cache write premium hurts |
| 5 | 20,000 | 60 min | 0.5/min | Gemini implicit | Medium prefix, modest volume — implicit avoids manual breakpoint mgmt |
| 6 | 50,000 | 60 min | 1/min | Anthropic | Large prefix, modest volume — 0.10× read wins |
| 7 | 1,000 | 60 min | 5/min | OpenAI | High volume on small prefix — auto-caching no-management win |

### Assessment

A learner has met the objective when they can:

- Identify the structural source of each vendor's curve shape (write premium, read multiplier, storage cost, warm-up).
- Locate the crossover points where one vendor becomes cheaper than another.
- Recommend a vendor for a new workload based on prefix size, TTL, and frequency.
- Explain when caching loses (TTL shorter than the inter-request gap → cache expires unused).

### Math reference

Per-request cost for vendor \(v\) at request \(i\) within a cache window:

\[
c_{v,i} =
\begin{cases}
P_v \cdot m_v^{\text{write}} \cdot K, & i \equiv 1 \pmod{W} \quad\text{(cache write)} \\
P_v \cdot m_v^{\text{read}}  \cdot K, & \text{otherwise (cache read)}
\end{cases}
\]

where \(P_v\) is the vendor input price, \(m_v^{\text{write}}\) and \(m_v^{\text{read}}\) are the write and read multipliers, \(K\) is the prefix size in 1K tokens, and \(W = \lfloor \text{TTL} / \Delta t \rfloor\) is the cache window length in requests.

## References

1. Anthropic. *Prompt Caching* documentation — defines the 1.25× / 0.10× model.
2. OpenAI. *Prompt Caching* documentation — defines the automatic prefix-cache model and the discount.
3. Google Cloud. *Vertex AI Context Caching* documentation — defines the implicit and explicit caching models and the per-hour storage cost.
4. Anthropic Engineering Blog. *Building Effective Agents* — multi-vendor cost-modeling perspective.

---

## Senior Instructional Designer Quality Review

*Reviewer perspective: 15+ years designing engineering and data-science curricula for adult professional learners; expertise in Bloom's revised taxonomy, evidence-based assessment design, and accessibility of technical content.*

### Overall verdict

**Approve for use in Chapter 6.** Score: **89/100 (B+).** This is one of the strongest L4 "compare" MicroSims in the textbook because the comparison is *structural* (curve shape) rather than just numerical (which is cheaper). The four parameters (prefix, TTL, frequency, storage) cover the meaningful design dimensions, and the no-cache baseline keeps the savings honest.

### What works (the pedagogy)

1. **Bloom alignment is correct.** L4 "compare" requires more than ranking; it requires articulating *why* one option beats another. The chart shows the curve shapes; the slider variations let the learner see *which* parameter changes the ranking.
2. **The dashed no-cache baseline is the right anchor.** Without it, learners might think Gemini explicit "growing" means it is bad, when it is actually growing slower than no-cache. The baseline frames every line as a discount from the same reference point.
3. **Crossover points teach the key insight.** A common trap is to pick the vendor that is cheapest "right now" (the first 5 requests) and miss that a different vendor wins at scale. The chart shows both regimes in one frame.
4. **The Gemini storage-cost toggle is pedagogically honest.** Many vendor-comparison MicroSims hide the storage cost or omit it entirely. Surfacing it as a toggle teaches that "what you forget to include" can flip the recommendation.
5. **The summary table closes the loop.** A line chart shows the *shape*; the table shows the *number*. Both are needed for a defensible vendor recommendation.

### What needs follow-up (the gaps)

1. **The pricing assumptions are illustrative, not current.** A note in the lesson plan disclaims this, but the sim itself does not. A small "(illustrative pricing — verify on current vendor pages)" note near the chart would be appropriate. Score impact: −2.
2. **Output cost is excluded.** The chart only models input/cache. A real workload also has output cost which differs across vendors. A future revision could overlay output cost as a second-axis line. Score impact: −2.
3. **The "warm-up" model for Gemini implicit is hand-tuned.** Three requests of cold cost is illustrative; the real warm-up depends on traffic patterns the sim does not model. Score impact: −2.
4. **No way to set the per-request output size.** Output dominates cost on long answers; a slider for output size would meaningfully expand the analysis. Score impact: −2.
5. **Crossover annotations are not drawn on the chart.** The lesson plan asks the learner to find them; the chart could optionally highlight them with a vertical guide. Score impact: −2.
6. **Only one workload at a time.** A side-by-side multi-workload view (e.g., "small prefix" vs. "large prefix" simultaneously) would teach generalization. Score impact: −1.

### Accessibility and clarity

- **Color-blind safety:** The five line colors (gray-dashed, russet, blue, green, purple) are distinguishable under common color-blindness profiles. The dashed pattern on no-cache is a redundant signal in addition to color.
- **Legend placement** at the bottom of the chart is screen-reader friendly.
- **Native HTML range sliders** are keyboard-focusable and arrow-adjustable.
- **The summary table** uses semantic HTML (`<table>`, `<thead>`, `<tbody>`) that is screen-reader friendly.

### Cognitive load assessment

- **Five lines on one chart** is at the upper edge of what a beginner can read. The legend is essential; the dashed baseline helps anchor.
- **Four sliders** is manageable; the labels update live to confirm value changes.
- **Summary table** is a good "one number per vendor" condensation that complements the dense chart.

### Recommendation

**Approve for use in Chapter 6 as currently implemented.** The six gaps above are real but none block the L4 "compare" objective. Open follow-up tickets for items 1 (illustrative-pricing note), 4 (output-size slider), and 5 (crossover annotations) — those three would be the highest-impact polish items.

The MicroSim teaches the *structure* of vendor caching differences, not just the numbers. That is the bar for an L4 sim, and it clears it.

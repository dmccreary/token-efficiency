---
title: Prompt Caching Patterns
description: The single highest-leverage cost optimization — cache keys, hits and misses, hit-rate metrics, warming, invalidation, the stable-prefix-volatile-suffix structure, cross-vendor differences, and the cache stampede problem
generated_by: claude skill chapter-content-generator
date: 2026-04-26 09:00:00
version: 0.07
---

# Prompt Caching Patterns

## Summary

The single highest-leverage cost optimization: cache keys, hits, misses, hit-rate metrics, warming, invalidation, the stable-prefix and volatile-suffix structure that cache mechanics demand, cross-vendor caching differences, implicit versus explicit caching, eviction, the cache stampede problem, and cache-aware routing.

## Concepts Covered

This chapter covers the following 20 concepts from the learning graph:

1. Prompt Caching
2. Cache Key
3. Cache Hit
4. Cache Miss
5. Cache Hit Rate
6. Cache Warming
7. Cache Invalidation
8. Cache Invariant
9. Stable Prefix
10. Volatile Suffix
11. Cache Boundary
12. Cross-Vendor Caching
13. Cache Cost Savings
14. Cache Monitoring
15. Cache Hit Rate Metric
16. Cache Eviction
17. Implicit Caching
18. Explicit Caching
19. Cache Aware Routing
20. Cache Stampede

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: LLMs, Tokens, and Generation Basics](../01-llms-tokens-generation-basics/index.md)
- [Chapter 3: Pricing, Economics, and Async API Modes](../03-pricing-economics-async-apis/index.md)
- [Chapter 4: The Anthropic Claude Ecosystem](../04-anthropic-claude-ecosystem/index.md)
- [Chapter 6: The Google Gemini Ecosystem](../06-google-gemini-ecosystem/index.md)
- [Chapter 10: Observability, Dashboards, and Alerting](../10-observability-dashboards-alerting/index.md)

---

!!! mascot-welcome "The 90% Discount Most Teams Leave on the Table"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Pemba waving welcome">
    Prompt caching is the single highest-leverage cost optimization in this book. A typical production application that turns it on goes from paying full price for every input token to paying ~10% on the cached portion — and the cached portion is usually 80%+ of input. The math is unusually friendly. The trick is structuring prompts so the cache actually fires, monitoring the hit rate so silent breakage shows up immediately, and avoiding a few classic footguns. Cheap systems are caching systems, and this chapter is how.

## Why Caching Is the Headline Optimization

**Prompt caching** is the vendor-side mechanism that lets you mark a portion of your prompt as cacheable. The vendor processes that portion once, stores the result in a fast-access cache, and on subsequent requests with the same prefix charges you a fraction of the normal input rate. The discount is dramatic — typically 90% off the cached portion.

The math (introduced for Anthropic in Chapter 4): one cached read pays back the cache-write premium almost immediately. Any prefix sent more than once should be cached. In practice, *most* of any production system's input tokens are eligible for caching once you look — system prompts, tool definitions, few-shot examples, retrieved documents that get re-asked about, conversation history. The opportunity is huge.

## The Mechanics: Keys, Hits, Misses

A **cache key** is the identifier the vendor uses to look up cached content. The key is computed deterministically from the prefix you marked as cacheable — typically a hash of the exact bytes of that prefix, plus the model name and any other invariants. Two requests produce the same cache key only if the cacheable prefix is byte-for-byte identical.

A **cache hit** is the case when the vendor finds the cache key in its cache and serves the cached prefix at the discounted rate. A **cache miss** is the opposite: the prefix is not in the cache (because it's never been seen, or it was evicted, or the TTL expired), and the vendor processes it as a normal full-price input — possibly also writing it to the cache for next time.

The **cache hit rate** is the ratio that quantifies cache effectiveness:

\[
\text{Cache Hit Rate} = \frac{\text{Cached input tokens served}}{\text{Total input tokens (cached + uncached)}}
\]

A healthy production system with a stable system prompt typically achieves 70–95% hit rate. Below 50% something is wrong — usually the cacheable prefix is unintentionally varying between requests.

## Cache Invariants and the Stable-Prefix Discipline

A **cache invariant** is a property of the prompt that must remain identical across requests for the cache to fire. Cache invariants are absolute — even a single byte difference (an extra space, a different timestamp, a swapped quote style) creates a different cache key and forces a miss.

The architecture every cached prompt follows:

A **stable prefix** is the portion of the prompt that is identical across requests. It contains the immutable parts: the system prompt, tool definitions, few-shot examples, any retrieved documents that are reused across requests in the same session. The stable prefix is what gets cached.

A **volatile suffix** is the portion that varies per request — typically the user message, per-request context, the latest tool result. The volatile suffix is *not* cached; it's processed at the normal input rate every time.

The **cache boundary** is the position in the prompt where stable ends and volatile begins. The vendor caches everything from the start of the request through the cache breakpoint marker. Placement matters: anything before the marker is cacheable; anything after is volatile.

The fundamental discipline of cache-friendly prompt design is: **put everything stable at the front, everything volatile at the back, and place the cache boundary at the join.**

#### Diagram: Stable Prefix and Volatile Suffix

<iframe src="../../sims/stable-prefix-volatile-suffix/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Stable Prefix and Volatile Suffix</summary>
Type: diagram
**sim-id:** stable-prefix-volatile-suffix<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Show a typical production prompt as a horizontal stack of components, color-coded by stable vs. volatile, with the cache boundary marked, so learners can see why ordering matters.

Bloom Level: Understand (L2)
Bloom Verb: classify

Learning objective: Classify prompt components as stable or volatile and place the cache boundary correctly to maximize the cached portion.

Canvas layout:
- Main area: A wide horizontal bar representing the prompt, divided into labeled segments
- Each segment is colored: green for stable, orange for volatile
- A vertical dashed line marks the current cache boundary position
- Below the bar: a numeric readout of "Cached tokens: N | Uncached tokens: M | Cache eligibility: X%"

Default segments (left to right):
- "System prompt" (green, 3,000 tokens)
- "Tool definitions" (green, 1,200 tokens)
- "Few-shot examples" (green, 1,500 tokens)
- "Retrieved context" (yellow — sometimes stable, sometimes not, 1,500 tokens)
- "Conversation history" (mixed, 800 tokens)
- "Current user message" (orange, 200 tokens)

Interactive controls:
- Drag the cache boundary line left or right to see how the eligible token count changes
- Toggle each segment between stable / volatile / mixed
- Button: "Anti-pattern: timestamp in system prompt" — adds a timestamp to the system prompt segment, marks it volatile, shows the eligible portion drop to zero
- Button: "Restructure: move volatile to the end" — animates volatile segments moving to the right of the boundary

Data Visibility Requirements:
  Stage 1: Show the default arrangement with the cache boundary at the natural stable/volatile join
  Stage 2: When user toggles a segment to volatile, recompute eligibility live
  Stage 3: When the anti-pattern button is clicked, show the cascading effect on eligibility

Default state: Boundary just before "Current user message", ~83% cache eligibility

Implementation: p5.js with responsive width and updateCanvasSize()
</details>

## Cache Warming and Invalidation

**Cache warming** is the deliberate practice of issuing one priming request after a deployment (or after the cache TTL would have expired) to populate the cache before real user traffic arrives. Warming pays the cache-write premium during a low-stakes moment instead of letting the first real user pay it.

A warming script is straightforward — replay a representative request against the new system prompt, expect a cache miss (since the new content has never been cached), then expect every subsequent real request to hit. For high-traffic endpoints this is automatic (real traffic warms the cache within seconds); for low-traffic endpoints (a Sunday morning spike after a Saturday-night deploy) explicit warming is worth doing.

**Cache invalidation** is the inverse problem: when the cached content needs to be refreshed (a new system prompt, an updated tool definition), the cache must be discarded. Most vendor caching systems handle this implicitly via the cache key — if the prefix bytes change, the new prefix has a new cache key, and the old key just sits in the cache until its TTL expires (then is evicted).

The only common case where explicit invalidation matters is the 1-hour cache (Anthropic's extended TTL or Gemini's longer TTLs): a bug in the cached content can persist for an hour after the fix ships if you don't trigger fresh requests against the new content. Best practice: after deploying any change to the stable prefix, issue a warming request immediately to seed the new key.

## Cache Eviction

**Cache eviction** is the process by which the vendor removes entries from the cache to make room for new ones — typically when the TTL expires (5 minutes by default on Anthropic, longer with explicit configuration) or when the cache is under memory pressure.

Eviction is a silent failure mode: a workload with bursty traffic can have a perfectly cache-friendly prompt structure but still see low hit rates because the cache TTL keeps expiring between bursts. The diagnostic is to look at the gaps between requests on the same cache key — if the average gap exceeds the TTL, you're paying for cache writes repeatedly without getting reads.

Mitigations:

- Use the longer TTL (1-hour on Anthropic, multi-hour on Gemini) for low-frequency workloads
- Smooth out traffic with batching or background warming
- Accept that ultra-low-frequency workloads (one request every few hours) cannot benefit from caching — the savings don't recover the per-write premium

## Implicit vs. Explicit Caching

**Implicit caching** is the variant where the vendor caches automatically, without you marking any cache control parameter. OpenAI and Google both offer some form of implicit caching — common stable prefixes get cached and discounted with no code changes on your side. The discount is typically smaller than explicit caching's, but the savings are free.

**Explicit caching** is the variant where you opt in by marking specific portions of the prompt as cacheable (Anthropic's `cache_control` parameter, Google's explicit cache resources). Explicit caching gives larger and more predictable savings but requires deliberate prompt structuring.

The decision rule:

- Use implicit caching wherever it's available — it's free
- Use explicit caching for the highest-volume features where the prefix is large (>1,000 tokens) and stable
- Don't bother with explicit caching for ultra-low-volume or ultra-volatile prompts — the operational overhead exceeds the savings

## Cross-Vendor Caching Differences

**Cross-vendor caching** is the awkward reality that the three major vendors implement caching differently in mechanics, pricing, and constraints. The differences matter when you're operating multi-vendor:

| Vendor | Style | Discount | Minimum Prefix | Default TTL |
|--------|-------|----------|----------------|-------------|
| Anthropic | Explicit (`cache_control`) | ~90% off cached input | ~1,024 tokens | 5 min (1 hr extended) |
| OpenAI | Implicit (automatic) | ~50% off cached portion | ~1,024 tokens | Short, vendor-managed |
| Google Gemini | Both (implicit + explicit) | 50–75% off cached | 1,024 (Flash) / 4,096 (Pro) | 1 min to multi-hour, configurable |

The implications for cross-vendor design:

- The same prompt structure does not produce the same hit rate or savings on every vendor — measure per vendor
- When designing for portability (Chapter 17's vendor-neutral abstraction), prefer prefix structures that work everywhere — long, stable, byte-identical leading sections
- Tool definitions and system prompts are the universal cache-friendly content; per-user conversation history is much less universally cacheable

## Cache Monitoring and Cache Hit Rate Metric

**Cache monitoring** is the operational practice of tracking cache effectiveness in production. The single most important metric is the **cache hit rate metric** — the per-feature, per-model hit rate over time.

The dashboard panel (Chapter 10) shows cache hit rate as a line chart per feature. A healthy line is steady at 70–95% with small TTL-related dips. Failure modes that show up as dips or trends:

- Sudden drop to ~0% — the cacheable prefix changed (someone modified the system prompt without realizing it broke the cache)
- Slow erosion — a slowly-changing element (a date, a counter, a recent-message-injected timestamp) is sneaking into the prefix
- Sawtooth pattern with TTL-period peaks — your traffic is too bursty for the current TTL setting; consider extending it
- Per-feature regression — one feature's hit rate dropped while others held steady; investigate that feature's recent prompt changes

The investment in monitoring is small and the savings from catching a broken cache early are large — a feature that silently lost caching for a month before anyone noticed can easily cost extra thousands of dollars.

## The Cache Stampede

**Cache stampede** is a failure mode where many requests simultaneously miss the cache (typically right after eviction or first deployment), each independently pays the cache-write cost, and the cache write benefits the *next* set of requests rather than the current burst. For high-volume endpoints, this can multiply cost momentarily as N concurrent first-requests each write the same content.

Mitigations:

- **Single-flight pattern** — when N requests arrive simultaneously and none of them are in cache, let one make the actual API call (paying the cache write premium) and have the others wait, then serve them all from the (now-warm) cache. Implementing this correctly in distributed systems is non-trivial; libraries like `singleflight` (Go) or `redis-cache-with-locks` (general) handle it.
- **Pre-warming** — issue the first request to the new prefix from your deployment pipeline, so by the time real traffic arrives the cache is already warm
- **Staggered TTL** — for caches that expire on a fixed cadence, add jitter so all entries don't expire at the same instant

The cache stampede is a classic distributed-systems problem applied to LLM caches. It's rare in practice but expensive when it happens — usually the post-deploy "why did our cost spike for 10 minutes?" investigation reveals it.

## Cache-Aware Routing

**Cache-aware routing** is the practice of factoring cache hit probability into model and traffic-routing decisions. Two patterns:

- **Sticky routing** — when caching is associated with a specific session, route subsequent requests in the session to the same backend that served the first one (where the cache is warm). For cloud LLM APIs this happens implicitly at the vendor; for self-hosted models or caching proxies, you implement it.
- **Cache-affinity model selection** — when a workload could use either of two models, prefer the one whose cache is warmer for that user/session. The same prompt that would cost \$0.05 cold can cost \$0.005 warm; the choice should follow the cache.

Cache-aware routing rarely matters for vanilla SaaS LLM use, where the vendor handles routing transparently. It becomes important for self-hosted setups, multi-region deployments, and proxy-based caching layers.

#### Diagram: Cache Hit Rate Health Indicators

<iframe src="../../sims/cache-hit-rate-health/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Cache Hit Rate Health Indicators</summary>
Type: chart
**sim-id:** cache-hit-rate-health<br/>
**Library:** Chart.js<br/>
**Status:** Specified

Purpose: Show four representative cache-hit-rate time series (healthy, sudden drop, slow erosion, sawtooth) so learners can recognize each pattern and identify the likely root cause.

Bloom Level: Analyze (L4)
Bloom Verb: distinguish

Learning objective: Distinguish healthy and degraded cache hit-rate patterns and diagnose the likely root cause of each degradation pattern.

Chart type: Four small multiples (line charts)
- Each chart: cache hit rate over 30 days, Y axis 0%–100%

Patterns:
1. Healthy: Steady at ~88% with small daily TTL dips
2. Sudden drop: Steady at 88%, then a cliff to 5% on day 14
3. Slow erosion: Starts at 88%, gradually drifts down to 40% over 30 days
4. Sawtooth: Oscillates between 0% and 60% in a daily cycle

Below each chart:
- A diagnostic caption identifying the pattern
- A "likely cause" hint
- A "what to check" action

Interactive controls:
- Click any chart: open a detailed-view modal with timeline annotations
- Dropdown: "What changed on day 14?" prompting hypothesis generation

Default state: All four charts visible side by side

Implementation: Chart.js multi-line, responsive grid layout
</details>

## Cache Cost Savings

**Cache cost savings** is the dollar amount saved per period by the caching strategy in place. The computation:

\[
\text{Savings} = \text{Cached tokens} \times (P_{\text{normal}} - P_{\text{read}}) - \text{Cache writes} \times (P_{\text{write}} - P_{\text{normal}})
\]

For a typical Anthropic-cached endpoint with 1M cached read tokens per day and 50K cache write tokens per day:

\[
\text{Daily savings} = 1{,}000{,}000 \times (\$3 - \$0.30)/\text{MTok} - 50{,}000 \times (\$3.75 - \$3)/\text{MTok} = \$2.70 - \$0.0375 = \$2.66
\]

That's per million-token-bucket; scale to your actual volumes. The point of the formula is that the second term (write premium) almost never dominates — caching is a near-free win when the math holds, and the math holds whenever you have enough repeat traffic.

!!! mascot-tip "Treat the Cache Hit Rate Like a Production Metric"
    <img src="../../img/mascot/tip.png" class="mascot-admonition-img" alt="Pemba sharing a tip">
    A 10-percentage-point drop in cache hit rate is often a 10-percentage-point increase in your bill on that feature. Alert on any feature whose cache hit rate drops more than 10 points week-over-week. The alert will fire occasionally on legitimate prompt changes — that's fine, you'll have the conversation about whether the new prompt was worth the caching loss. Where did all the tokens go? Spoiler: into a cache miss someone introduced when they added a timestamp to the system prompt.

## Putting It All Together

You can now design and operate a cache-friendly LLM application. You apply **prompt caching** by structuring prompts as a **stable prefix** followed by a **volatile suffix** with the **cache boundary** placed at the join. You enforce **cache invariants** so the **cache key** is the same on every legitimate hit, and you read **cache hit** vs. **cache miss** counts off the response usage object. You monitor the **cache hit rate** (the **cache hit rate metric**) on every dashboard, and you investigate degraded patterns by **cache monitoring** workflows. You **cache warming** after deploys, accept **cache eviction** as a TTL-driven reality, and choose between **implicit caching** (free, smaller savings) and **explicit caching** (opt-in, larger savings). You account for **cross-vendor caching** differences when operating multi-vendor. You compute **cache cost savings** to justify the work. You handle the **cache stampede** with single-flight or pre-warming patterns where needed, and you apply **cache-aware routing** in self-hosted or proxy-based architectures. You handle **cache invalidation** correctly when prefix content changes.

Chapter 15 turns to RAG — making sure the retrieved context that hits your prompt is actually worth the tokens it costs.

??? question "Quick Self-Check — Click to Reveal Answers"
    1. **What's a cache invariant?** A property of the prompt that must remain byte-identical across requests for the cache to fire. Anything that varies (timestamps, IDs, dates) breaks the cache silently.
    2. **Where do you place the cache boundary?** At the join between the stable prefix and the volatile suffix — everything before the boundary is cached, everything after is processed at full input price.
    3. **What's a cache stampede?** Many simultaneous requests missing the cache and each independently paying the cache write premium. Mitigated by single-flight patterns or pre-warming.
    4. **Why is the cache hit rate the right metric to monitor?** A drop in hit rate is the leading indicator of a silently-broken cache — usually a recent prompt change that introduced a varying element. Catching it early avoids weeks of unnecessary spend.
    5. **What's the difference between implicit and explicit caching?** Implicit is automatic with no code changes (smaller, free savings). Explicit requires marking cache breakpoints (larger, opt-in savings).

!!! mascot-celebration "End of Chapter 14"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Pemba celebrating">
    The single highest-leverage cost optimization is in your hands. Next: tuning RAG so the retrieved context actually earns its tokens.

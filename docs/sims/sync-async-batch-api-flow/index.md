---
title: Sync, Async, and Batch API Flow
description: Three side-by-side sequence diagrams comparing synchronous, asynchronous, and batch LLM API modes with cost and latency annotations.
image: /sims/sync-async-batch-api-flow/sync-async-batch-api-flow.png
og:image: /sims/sync-async-batch-api-flow/sync-async-batch-api-flow.png
twitter:image: /sims/sync-async-batch-api-flow/sync-async-batch-api-flow.png
social:
   cards: false
---

# Sync, Async, and Batch API Flow

<iframe src="main.html" height="602px" width="100%" scrolling="no"></iframe>

[Run the MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

Three sequence diagrams showing the full request lifecycle for synchronous, asynchronous, and batch LLM API modes. Each one annotates latency expectation and cost multiplier so a learner can match a workload to the right mode at a glance. The right-hand panel updates with practical "when to use / avoid" guidance as you switch modes.

## How to Use

1. **Read the sync diagram first.** Note the blocking pattern: client waits for vendor.
2. **Switch to async.** Notice the client thread is freed and a webhook (or poll) provides the completion signal.
3. **Switch to batch.** Notice the JSONL upload/download and the 0.5× cost annotation.
4. **For each of the practice scenarios below**, decide which mode to recommend, then confirm against the right-panel guidance.

## Bloom Level

**Evaluate (L5)** — recommend the appropriate API mode (synchronous, asynchronous, or batch) for a given workload based on latency requirements and cost targets.

## Iframe Embed Code

```html
<iframe src="sims/sync-async-batch-api-flow/main.html" height="602px" width="100%" scrolling="no"></iframe>
```

## Lesson Plan

### Audience
Engineers choosing the right LLM API mode for a new workload.

### Duration
10–15 minutes inside Chapter 3.

### Prerequisites
Chapter 3 sections on Batch API, Asynchronous API, and the batch discount.

### Activities
1. **Walk all three diagrams (5 min).** Note the latency and cost annotation for each.
2. **Match scenarios to modes (5 min).** Use the table below.
3. **Discuss the gray-zone case (5 min).** A 30-second-per-request workload is on the boundary between sync (where users wait too long) and async (where the engineering complexity may not be worth it). What guides the decision?

### Practice Scenarios

| # | Workload | Recommended mode | Why |
|---|---|---|---|
| 1 | IDE inline code completion | sync | latency-critical |
| 2 | Nightly classification of 10K support tickets | batch | cost-critical, no user waiting |
| 3 | Long document summary triggered from a button click | async | takes 30-60s, user can be notified |
| 4 | Real-time chat | sync | user waiting |
| 5 | Embedding 5M docs for a new RAG corpus | batch | cost-critical, hours-tolerant |

### Assessment

Learner has met the objective when they can recommend the right mode for a novel workload and explain the latency/cost trade.

## References

1. Anthropic Documentation — *Message Batches* and *Streaming responses*.
2. OpenAI Documentation — *Batch API guide*.
3. Google AI Studio Documentation — *Batch mode*.

---

## Senior Instructional Designer Quality Review

*Reviewer perspective: 15+ years designing engineering and data-science curricula for adult professional learners.*

### Overall verdict

**Approve as-is for Chapter 3.** Score: **86/100 (B+).** Three side-by-side sequence diagrams is the right primitive for this comparison: it shows that the *lifecycle* differs across modes, not just the price.

### What works
1. **Bloom alignment is correct.** L5 "recommend" requires the learner to weigh inputs against criteria. The right-panel guidance enumerates exactly those criteria.
2. **Sequence-diagram representation.** Showing the client/vendor interaction makes it visceral that async frees the client thread; sync blocks it.
3. **Cost annotation is per-mode, not buried.** The 1.0× / 1.0× / 0.5× ratio is the single most important comparison.

### Gaps
1. **Streaming is not represented.** Many "sync" workloads use streaming responses, which is a hybrid pattern. A 4th tab would round out the picture. Score impact: −3.
2. **No latency distribution.** Single-number latency annotation hides the variance — async is "seconds to minutes" but the variance matters operationally. Score impact: −2.
3. **No engineering-cost annotation.** Async + webhook adds real engineering complexity (retry, signature verification). Calling that out alongside the cost discount would teach the full trade. Score impact: −2.

### Accessibility
Color-blind safe; the panel guidance is plain text. Mermaid sequence diagrams render cleanly at the iframe size.

### Cognitive load
3 diagrams with a single mode selector. Low cognitive load; appropriate for a comparison primitive.

### Recommendation
Approve. Open follow-up for streaming representation (gap 1).

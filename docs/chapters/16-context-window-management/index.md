---
title: Context Window Management
description: Keeping long-running sessions affordable — sliding windows, hierarchical summarization, memory files, the long-term/short-term split, lost-in-the-middle, reordering, and eviction policies for context that has stopped earning its keep
generated_by: claude skill chapter-content-generator
date: 2026-04-26 09:00:00
version: 0.07
---

# Context Window Management

## Summary

Keeping long-running sessions affordable: sliding windows, hierarchical summarization, memory files, the long-term/short-term memory split, context truncation strategies, the lost-in-the-middle effect, context reordering, and eviction policies for context that has stopped earning its keep.

## Concepts Covered

This chapter covers the following 14 concepts from the learning graph:

1. Context Window Budget
2. Sliding Window
3. Compaction Strategy
4. Hierarchical Summary
5. Memory File
6. Long-Term Memory
7. Short-Term Memory
8. Context Truncation
9. Pre-Send Token Counting
10. Context Quality Decay
11. Lost-In-The-Middle
12. Context Reordering
13. Selective Context Inclusion
14. Context Eviction Policy

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: LLMs, Tokens, and Generation Basics](../01-llms-tokens-generation-basics/index.md)
- [Chapter 2: Sampling, Tokenization, and Embeddings](../02-sampling-tokenization-embeddings/index.md)
- [Chapter 3: Pricing, Economics, and Async API Modes](../03-pricing-economics-async-apis/index.md)
- [Chapter 6: The Google Gemini Ecosystem](../06-google-gemini-ecosystem/index.md)
- [Chapter 7: AI Coding Harnesses and Agentic Loops](../07-coding-harnesses-agentic-loops/index.md)
- [Chapter 12: A/B Testing Methodology for LLMs](../12-ab-testing-methodology/index.md)
- [Chapter 14: Prompt Caching Patterns](../14-prompt-caching-patterns/index.md)
- [Chapter 15: Retrieval-Augmented Generation Optimization](../15-rag-optimization/index.md)

---

!!! mascot-welcome "When Sessions Stretch Into Hours"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Pemba waving welcome">
    Chapter 7 introduced the agent-session problem; Chapter 14 made the system prompt cheap; Chapter 15 made retrieval lean. Now we tackle the third long-session cost: the conversation history itself, which grows on every turn and must be re-sent on every request. This chapter teaches the compaction strategies that turn a runaway 4-hour debugging session from a \$50 bill into an \$8 one. Cheap systems compact deliberately.

## The Long-Session Cost Problem

Long-running conversations and agent sessions have a structural cost issue: the entire prior conversation is re-sent as input on every turn. A 50-turn session with average per-turn content of 1,000 tokens has paid for the first turn 50 times by the end, the second turn 49 times, and so on. The cumulative input cost is \( O(N^2) \) in the number of turns.

Even with prompt caching (Chapter 14) handling the system prompt, the conversation history itself isn't fully cacheable — the latest turn always changes the cache key for everything after it. So while the front of the conversation enjoys cache reads, the back of it accumulates uncached input every time.

The countermeasures are all variations on the same theme: replace older context with denser summaries, drop content that has stopped being relevant, and carefully manage what stays in the window. Each technique trades information loss for token savings; the discipline is choosing the trade thoughtfully.

## The Context Window Budget

A **context window budget** is a pre-declared allocation of the model's context window across the components of each request. A typical budget for a 200K-context model:

- Reserve for output: 4,000 tokens
- System prompt + tool definitions (cached): 10,000 tokens
- Working set / current task context: 30,000 tokens
- Conversation summary (compacted history): 10,000 tokens
- Recent conversation (uncompacted last N turns): 20,000 tokens
- Retrieved RAG context for current turn: 10,000 tokens
- Headroom for the user's next message and unexpected growth: ~115,000 tokens

The numbers are illustrative — the principle is that you decide upfront how the context window is divided, then enforce the boundaries at runtime. Without a budget, every component has an incentive to grow ("I'll just include one more thing") until the request hits the limit (or the cost becomes painful).

**Pre-send token counting** is the runtime check: before issuing the API call, count the tokens of the assembled request and verify it fits within the budget. If it doesn't, apply the truncation policy (covered below). Pre-send counting prevents the most embarrassing failure mode: an API call that fails because the context exceeds the model's hard limit, after you've already wasted compute assembling it.

## Sliding Windows: The Simplest Compaction

A **sliding window** is the simplest compaction strategy: keep only the most recent N turns of conversation; drop everything older. The window "slides" forward as new turns arrive, with old turns falling off the back.

Sliding windows are dead simple to implement and effective when older context truly doesn't matter — short-form chatbots, customer-support sessions where each interaction is self-contained. They are catastrophic when older context *does* matter — coding sessions where the model needs to remember an architectural decision made 30 turns ago, multi-step analyses that build on earlier conclusions.

Variations:

- **Time-based sliding window** — keep turns from the last N minutes
- **Token-based sliding window** — keep turns until the cumulative token count exceeds N
- **Turn-based sliding window** — keep the last N turns regardless of size

For most long sessions you want something better than a pure sliding window. The most common upgrade is the long-term / short-term memory split.

## Long-Term and Short-Term Memory

The split is borrowed from cognitive science: keep recent detail in **short-term memory** (the live conversation history) and accumulate distilled facts in **long-term memory** (a separate, persistent store that survives across sessions).

**Short-term memory** is the recent conversation — typically the last 10–30 turns, kept verbatim because they contain the freshest detail and the model needs the latest exact phrasing to continue coherently.

**Long-term memory** is everything older that has been distilled into one or more **memory files** — markdown files, JSON records, or vector entries that capture the essential facts without the verbose conversational packaging. Long-term memory is *not* re-sent on every turn — it's selectively included based on relevance to the current task (using a retrieval step similar to RAG).

The diagram below shows the architecture:

#### Diagram: Long-Term and Short-Term Memory Architecture

<iframe src="../../sims/memory-architecture-long-short/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Long-Term and Short-Term Memory Architecture</summary>
Type: diagram
**sim-id:** memory-architecture-long-short<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Show the data flow between recent conversation (short-term) and persistent memory files (long-term), with the compaction step that moves content from short to long.

Bloom Level: Understand (L2)
Bloom Verb: explain

Learning objective: Explain how short-term and long-term memory differ in lifecycle, retrieval, and per-turn token cost.

Canvas layout:
- Left third: "Short-Term Memory" — a stack of recent turn cards (last 10–20 turns)
- Middle third: A "Compaction" arrow with a small LLM-icon labeled "Summarize"
- Right third: "Long-Term Memory" — a stack of memory file cards (project facts, prior decisions, key learnings)
- Bottom: "Per-turn input flow" — arrows showing what gets included in the next API call (system prompt + selectively-retrieved long-term + all of short-term + new user message)

Visual elements:
- Each memory file card shows its title and token size
- Each turn card shows turn number and token size
- The compaction arrow shows "20 turns × 1K tokens → 1 summary × 200 tokens" annotation

Interactive controls:
- Button: "Add new turn" — adds a card to short-term, eventually triggers compaction when threshold is reached
- Button: "Manually compact now" — immediately summarizes the oldest turns into a new long-term memory file
- Slider: Compaction threshold (10–50 turns)
- Toggle: "Show per-turn input cost"

Data Visibility Requirements:
  Stage 1: Show the default state (short-term has 8 turns, long-term has 3 files)
  Stage 2: When user clicks "Add new turn", animate a card sliding into short-term
  Stage 3: When threshold is hit, animate the oldest turns flowing through compaction into a new long-term file
  Stage 4: Show the per-turn cost dropping after compaction

Default state: 8 short-term turns, 3 long-term files, threshold = 15

Implementation: p5.js with responsive width
</details>

The long-term store has its own retrieval mechanism — typically an embedding-based search (essentially RAG over your own session history) that pulls only the most relevant memory files into the current turn's context. This is what makes the architecture scalable: long-term memory can grow without bound; only the relevant slice flows into any given turn.

## Compaction Strategies

A **compaction strategy** is the policy that decides what to compact, when, and how aggressively. The space of strategies spans:

- **Threshold-based** — compact when total context exceeds N tokens (the most common)
- **Time-based** — compact turns older than T minutes
- **Activity-based** — compact between distinct tasks (the user starts a new topic)
- **On-demand** — compact when the user explicitly requests it

Most production systems combine threshold-based (automatic, prevents runaway growth) with on-demand (user-controlled, used at natural breakpoints).

### Hierarchical Summarization

A **hierarchical summary** is a summarization scheme where summaries themselves can be summarized, producing a tree of progressively coarser representations. For very long sessions:

- Level 0: Raw turns (last 20)
- Level 1: Per-segment summaries (one per ~10 turns of older history)
- Level 2: Per-session summary (one for the whole session)
- Level 3: Cross-session memory (when session ends, distill into long-term store)

Hierarchical summarization is more expensive at compaction time (each level needs its own LLM call) but produces dramatically smaller context for very long sessions. The tradeoff usually pays off for sessions over 100 turns.

## Context Truncation

**Context truncation** is the simpler cousin of compaction: just drop content rather than summarizing it. Truncation is cheaper (no LLM call to summarize) but loses information completely. Use truncation when:

- The context to drop is genuinely useless (a tool result that was already incorporated into the answer)
- The compaction LLM call would cost more than the input savings
- You need a guaranteed deterministic outcome (compaction quality varies; truncation is exact)

A common pattern: drop the *content* of older tool-result blocks but keep their headers, so the model knows the tool was called without re-reading every line of output. Tool results are the largest truncation target in agent sessions — they're often huge and rarely needed verbatim after the model has already responded to them.

## Lost in the Middle and Context Reordering

**Lost in the middle** is the well-documented effect that LLMs pay disproportionate attention to content at the start and end of a long context, with reduced attention to content in the middle. The effect is real and measurable on every modern long-context model — though stronger on some than others.

The implication for context window management:

- **Important content at the front** — system prompt, critical rules, the most relevant retrieved chunk
- **Latest user query at the back** — so it's the freshest thing in attention
- **Less critical content in the middle** — older history, lower-relevance retrieved chunks

**Context reordering** is the deliberate placement of context elements based on this attention profile. Two practical patterns:

- **Front-loaded retrieval** — when injecting retrieved chunks (Chapter 15), put the highest-scoring chunk first, not last
- **Sandwich pattern** — put critical instructions both at the start (in the system prompt) *and* at the end (right before the user query) for maximum attention

The cost impact is indirect: better attention means better answers from the same context, which means smaller context can produce equivalent quality, which means tokens saved.

**Context quality decay** is the related observation that raw context size is not a quality multiplier past a certain point — past 50K–100K tokens, additional context often makes answers worse, not better, because the relevant signal is diluted. The implication: more context is not always better. Trim aggressively; A/B test the trim against the larger version on your real quality metrics.

## Selective Context Inclusion and Eviction

**Selective context inclusion** is the practice of choosing per-turn which subset of available context to include — system prompt always, recent history always, long-term memory items only when relevant, retrieved RAG chunks only when query-related. The opposite is "include everything we have" which doesn't scale.

The selection can be deterministic (always include this category) or adaptive (use a relevance scorer to pick the top-N items per turn). Adaptive selection is more expensive (the relevance scoring costs tokens) but produces tighter, cheaper, often higher-quality context.

A **context eviction policy** is the rule for when to drop items from short-term memory or invalidate items from long-term memory. Common policies:

- **Age-based** — drop short-term items older than N turns
- **Relevance-based** — drop short-term items whose relevance to recent turns is below a threshold
- **Cost-based** — drop the largest items first when over budget
- **Manual** — user explicitly removes items ("forget that I mentioned my email")

For long-term memory, eviction is rarer but worth thinking about: stale facts (a project's old architecture; a user's previous preferences) can mislead the model if they remain in the long-term store after the underlying truth has changed. Periodic long-term-memory pruning (manual or LLM-driven) keeps the store accurate.

#### Diagram: Context Window Budget Allocation Over a Long Session

<iframe src="../../sims/context-budget-long-session/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Context Window Budget Allocation Over a Long Session</summary>
Type: chart
**sim-id:** context-budget-long-session<br/>
**Library:** Chart.js<br/>
**Status:** Specified

Purpose: Show how the context window is allocated across components turn-by-turn during a long session, with compaction events visible as drops in the conversation-history allocation.

Bloom Level: Apply (L3)
Bloom Verb: implement

Learning objective: Implement a context window budget that maintains affordable per-turn cost across a session that exceeds 100 turns.

Chart type: Stacked area chart over time
- X-axis: Turn number (1 to 200)
- Y-axis: Tokens

Stacked components (bottom to top):
- System prompt + tool defs (constant ~10K)
- Long-term memory included (variable, ~5K average)
- Conversation history (grows linearly until compaction events)
- RAG context (variable per turn)
- Output reservation (constant 4K)

Interactive controls:
- Slider: Compaction threshold (50K–150K tokens)
- Slider: Compaction aggressiveness (how many old turns get summarized)
- Toggle: "Use long-term memory" — when on, older content gets distilled instead of dropped
- Toggle: "Use sliding window only" — disables long-term memory; show how detail is lost

Data Visibility Requirements:
  Stage 1: Show the stacked allocation evolving over 200 turns
  Stage 2: At each compaction event, show conversation-history dropping and long-term-memory increasing slightly
  Stage 3: With sliding-window-only mode, show conversation-history bouncing up and down without growing long-term

Default state: Compaction threshold at 80K, long-term memory on

Implementation: Chart.js stacked area, responsive width
</details>

!!! mascot-tip "Compact at Natural Breakpoints"
    <img src="../../img/mascot/tip.png" class="mascot-admonition-img" alt="Pemba sharing a tip">
    Auto-compaction is good insurance, but the highest-quality compaction happens at natural task breakpoints — "I just finished feature X, let me start on feature Y." That's the moment to manually compact, because the model can summarize the *completed work* cleanly without losing the in-progress nuance. Cheap systems are systems whose users have learned to type `/compact` between tasks.

## Putting It All Together

You can now keep long sessions affordable. You define a **context window budget** that allocates the model's context across components, and enforce it at runtime via **pre-send token counting**. You apply a **compaction strategy** — sometimes a simple **sliding window**, more often a **hierarchical summary** combined with a split between **short-term memory** (recent turns kept verbatim) and **long-term memory** (distilled facts in **memory files** loaded selectively). You apply **context truncation** for cheaply-droppable content like older tool results. You account for **lost-in-the-middle** by **context reordering** — important content at the front and back, less critical in the middle. You combat **context quality decay** by trimming aggressively and A/B testing the trim. You apply **selective context inclusion** to load only the relevant portion of long-term memory per turn, and you enforce a **context eviction policy** for content that has stopped earning its keep.

Chapter 17 takes the next step: routing requests to the right model and bounding output deliberately, the second-highest leverage cost optimization after caching.

??? question "Quick Self-Check — Click to Reveal Answers"
    1. **Why does conversation cost grow quadratically with turn count?** Each new turn re-sends every prior turn as input. Cumulative input is the sum 1+2+3+...+N, which is \\( O(N^2) \\).
    2. **What's the difference between compaction and truncation?** Compaction summarizes the older content into a denser form (paying an LLM call); truncation just drops it (no LLM call, all information lost).
    3. **What is the lost-in-the-middle effect?** LLMs attend more strongly to content at the beginning and end of long contexts than to content in the middle. Ordering matters for quality.
    4. **When is a pure sliding window appropriate?** When older context genuinely doesn't matter — short interactions, customer-support sessions where each turn is self-contained. Wrong for coding sessions and multi-step analyses.
    5. **Why split memory into short-term and long-term?** Short-term needs fresh detail (kept verbatim, expensive per-turn). Long-term needs distilled facts that can be selectively retrieved (much cheaper per-turn, scales without bound).

!!! mascot-celebration "End of Chapter 16"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Pemba celebrating">
    Long sessions tamed. Next chapter handles the second-largest cost lever after caching: routing requests to the right-sized model and controlling output deliberately.

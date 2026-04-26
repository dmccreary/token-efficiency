---
title: The Anthropic Claude Ecosystem
description: The Messages API, the Claude model family, prompt caching, extended thinking, tool use, streaming, batch, and vision input — Anthropic's full surface area mapped to the cost framework
generated_by: claude skill chapter-content-generator
date: 2026-04-26 09:00:00
version: 0.07
---

# The Anthropic Claude Ecosystem

## Summary

Anthropic's Messages API in depth: the Claude Opus/Sonnet/Haiku family, the Claude tokenizer, prompt caching with cache control parameters, extended thinking and thinking token budgets, tool use, streaming, batch, and Claude vision input.

## Concepts Covered

This chapter covers the following 26 concepts from the learning graph:

1. Claude Tokenizer
2. Anthropic API
3. Claude Messages API
4. Claude Model Family
5. Claude Opus
6. Claude Sonnet
7. Claude Haiku
8. Anthropic SDK
9. API Key Management
10. Anthropic Prompt Caching
11. Cache Control Parameter
12. Cache Breakpoint
13. Cache TTL
14. Cache Read Tokens
15. Cache Write Tokens
16. Extended Thinking
17. Thinking Token Budget
18. Claude Tool Use
19. Tool Definition Schema
20. Tool Result Block
21. Message Content Block
22. Anthropic System Prompt
23. Stop Reason
24. Anthropic Streaming
25. Anthropic Batch API
26. Claude Vision Input

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: LLMs, Tokens, and Generation Basics](../01-llms-tokens-generation-basics/index.md)
- [Chapter 2: Sampling, Tokenization, and Embeddings](../02-sampling-tokenization-embeddings/index.md)
- [Chapter 3: Pricing, Economics, and Async API Modes](../03-pricing-economics-async-apis/index.md)

---

!!! mascot-welcome "Vendor #1: Claude"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Pemba waving welcome">
    Anthropic's Claude is the first vendor we'll examine in depth. The headline cost feature is prompt caching — typically 90% off your input bill on the right traffic shape — and the model family scales cleanly from cheap-and-fast to slow-and-expensive. By the end of this chapter you'll be calling the Messages API, configuring `cache_control`, and verifying cache hits in the response. Every token counts — and Claude makes most of them cacheable.

## The API Surface

### Anthropic API and the SDK

The **Anthropic API** is the HTTPS surface that exposes Claude to your application — `https://api.anthropic.com/v1/...` for direct access, plus mirrored surfaces on Amazon Bedrock and Google Vertex AI for enterprise customers who prefer to bill through their cloud provider. Every request is authenticated with an API key sent in the `x-api-key` header.

The **Anthropic SDK** is Anthropic's official client library — `anthropic` on PyPI, `@anthropic-ai/sdk` on npm — that wraps the raw HTTP API in idiomatic types for Python, TypeScript, Java, Go, and a few other languages. Use the SDK whenever possible: it handles retries, streaming, and the small ergonomic differences between request and response shapes that you would otherwise have to discover by reading the changelog.

**API key management** is the operational discipline of issuing, rotating, scoping, and revoking the credentials your application uses. The non-negotiable rules:

- One key per environment (dev, staging, prod) so a leaked dev key never burns prod budget
- Keys live in your secret manager (AWS Secrets Manager, GCP Secret Manager, Vault), never in source control
- Every key has a budget cap configured in the Anthropic console — even a leaked key cannot spend more than the cap
- Keys are rotated on a schedule (quarterly is reasonable) and immediately on any suspected compromise

### The Claude Messages API

The **Claude Messages API** is the single endpoint (`POST /v1/messages`) for all Claude conversational requests. It replaces an older completion-style API and is the only one that supports the modern features we care about — caching, tool use, vision, extended thinking. Every request is a JSON body containing a `model`, a `messages` array, an optional `system` string, and parameters like `max_tokens`, `temperature`, `tools`, and `stream`.

The `messages` array is a sequence of objects with role `"user"` or `"assistant"` and a `content` field. The `content` field is not a plain string in the modern API — it is a list of **message content blocks**, each typed: a `text` block, a `tool_use` block, a `tool_result` block, or an `image` block. This typed structure is what makes tool use, vision, and partial caching possible inside a single message.

A minimal request looks like this:

```python
import anthropic
client = anthropic.Anthropic()
resp = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    system="You are a helpful assistant.",
    messages=[{"role": "user", "content": "What is the capital of France?"}],
)
print(resp.content[0].text)
print(resp.usage)  # {input_tokens, output_tokens, cache_creation_input_tokens, cache_read_input_tokens}
```

The `usage` object on the response is the most important field in the entire chapter — it carries the four token counts that drive every cost calculation downstream. Read it. Log it. Build dashboards on it.

## The Claude Model Family

The **Claude model family** is Anthropic's lineup of three model sizes, each tuned for a different cost-quality point on the Pareto frontier introduced in Chapter 3. The naming convention is consistent across generations: capability tiers Opus, Sonnet, and Haiku, with version numbers appended (Claude Opus 4.7, Claude Sonnet 4.6, Claude Haiku 4.5).

- **Claude Opus** is the flagship — the largest, smartest, slowest, and most expensive. Use it when raw reasoning quality matters more than per-call cost: deep research, complex code refactors, hard analysis tasks. Pricing is roughly \$15/MTok input and \$75/MTok output (current generation).
- **Claude Sonnet** is the workhorse — strong general capability at a fraction of the Opus price. The default first choice for most production workloads. Pricing is roughly \$3/MTok input and \$15/MTok output.
- **Claude Haiku** is the fast/cheap model — built for high-throughput, latency-sensitive, or budget-constrained workloads. Surprisingly capable on routine tasks. Pricing is roughly \$0.80/MTok input and \$4/MTok output.

Before showing the comparison table, here is the rule of thumb: the price difference between adjacent tiers is roughly 4–5×, while the quality difference is closer to 5–15 percentage points on most benchmarks. That makes routing (Chapter 17) extremely high-leverage on Anthropic — a workload that ships everything to Opus is leaving most of the cost reduction on the table.

| Model | Relative Cost (input) | Relative Cost (output) | Typical Use | Latency |
|-------|------------------------|------------------------|-------------|---------|
| Opus | ~5× Sonnet | ~5× Sonnet | Hard reasoning, agent planning | Slowest |
| Sonnet | 1× (baseline) | 1× (baseline) | General production workloads | Medium |
| Haiku | ~0.25× Sonnet | ~0.25× Sonnet | Classification, extraction, routing | Fastest |

### The Claude Tokenizer

The **Claude tokenizer** is a BPE-family tokenizer (Chapter 2) shared across the entire Claude model family. Vocabulary size is in the standard 100K-token range. Anthropic publishes the tokenizer for client-side token estimation — install via `pip install anthropic[tokenizer]` or use the `count_tokens` method on the SDK.

Two practical notes about the Claude tokenizer:

- It tokenizes English code about 10–15% more efficiently than the older GPT-3.5 tokenizer but slightly less efficiently than the newest tiktoken variants on long English prose. Always re-tokenize your real traffic when comparing across vendors.
- Image content blocks contribute tokens too. A standard image consumes roughly 1,500–1,800 input tokens depending on resolution, and that count is reported in the response `usage` object.

## Anthropic System Prompts and Message Structure

The **Anthropic system prompt** is a separate top-level field on the request (`system: "..."`), not a message in the `messages` array. That separation is deliberate: the system field has dedicated cache semantics (it is the natural cache target) and the model treats system content with higher priority than later user content. A typical production request has a multi-thousand-token system prompt and short user messages.

Each entry in the `messages` array carries one or more **message content blocks**. The block types you will use:

- `text` — ordinary text content
- `image` — base64-encoded or URL-referenced image (for Claude vision input)
- `tool_use` — emitted by the assistant; declares "I want to call this tool with these arguments"
- `tool_result` — emitted by the user role; carries the result of a previously-called tool back to the model

This block-level structure matters for caching: the **cache control parameter** (covered next) attaches to specific blocks, not to entire messages.

## Anthropic Prompt Caching — The Single Biggest Lever

This is the optimization that, when applied correctly, will save more money than any other change in this chapter combined.

**Anthropic prompt caching** lets you mark a portion of your request as cacheable. The first time Anthropic sees that exact prefix, they process and cache it (charged at a small premium — see "cache write" below). On every subsequent request that ships the same prefix within the cache TTL, the cached portion is charged at roughly **10% of the normal input rate** instead of the full rate.

### Cache Control, Breakpoints, and TTL

The **cache control parameter** is the JSON property you attach to a content block to mark "everything up to and including this block should be cached." The marker creates a **cache breakpoint** — Anthropic will cache the entire prefix from the start of the request through this block. You can place up to four breakpoints in a single request, dividing the prompt into stable-and-volatile sections.

The **cache TTL** is how long the cached prefix is retained without being touched. The default is 5 minutes; an extended 1-hour TTL is available at a slightly higher cache-write cost. After the TTL expires, the next request has to re-cache (paying the cache-write premium again). This is why workloads with steady traffic cache better than bursty workloads — steady traffic naturally keeps the cache warm.

A request with caching looks like:

```python
resp = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    system=[
        {
            "type": "text",
            "text": LONG_SYSTEM_PROMPT,  # 5,000 tokens of stable instructions
            "cache_control": {"type": "ephemeral"},  # cache breakpoint here
        }
    ],
    messages=[{"role": "user", "content": user_question}],  # this varies per request
)
```

### Cache Read Tokens, Cache Write Tokens, and the Math

The response `usage` object now reports four token counts:

- `input_tokens` — uncached input (the volatile suffix; typically the user message)
- `cache_creation_input_tokens` — tokens written to cache on this request (only nonzero on the *first* request of a cycle)
- `cache_read_input_tokens` — tokens read from cache on this request (the savings line)
- `output_tokens` — same as before

**Cache write tokens** are charged at roughly 1.25× the normal input rate (a 25% premium for the privilege of caching). **Cache read tokens** are charged at roughly 0.10× the normal input rate (a 90% discount). The break-even point — how many reads it takes for caching to pay off — is just two: the second hit already has you ahead.

To make this concrete, for a Sonnet-class model with input at \$3/MTok:

\[
\text{Break-even reads} = \frac{P_{\text{write}} - P_{\text{normal}}}{P_{\text{normal}} - P_{\text{read}}} = \frac{1.25 - 1.0}{1.0 - 0.10} = 0.28
\]

In practice you need to amortize one write across enough reads to offset the premium, and the math says one extra read is enough. Any request prefix that will be reused even twice should be cached. The diagram below visualizes the math:

#### Diagram: Anthropic Prompt Caching Lifecycle

<iframe src="../../sims/anthropic-prompt-caching-lifecycle/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Anthropic Prompt Caching Lifecycle</summary>
Type: microsim
**sim-id:** anthropic-prompt-caching-lifecycle<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Show a sequence of requests against a stable system prompt with caching enabled, breaking down each request into write/read/uncached/output tokens and accumulating the running cost vs. the no-cache baseline.

Bloom Level: Apply (L3)
Bloom Verb: calculate

Learning objective: Calculate the cumulative cost of N requests with and without caching, and identify the break-even point (always reached after request 2).

Canvas layout:
- Top half (full width): A horizontal sequence of request "cards" labeled R1, R2, R3, ..., each showing a small stacked bar of token categories (cache write, cache read, uncached input, output)
- Bottom half: A line chart with two series (cumulative cost with caching, cumulative cost without caching) over request number

Interactive controls:
- Slider: System prompt size (500–10,000 tokens, default 5,000)
- Slider: User message size (50–500 tokens, default 200)
- Slider: Output size (100–2,000 tokens, default 500)
- Slider: Number of requests (1–20, default 10)
- Toggle: Enable caching (default on)
- Toggle: 5-min TTL vs 1-hour TTL
- Button: "Add stale gap (TTL expires)" — inserts a 5-minute pause that forces a new cache write at the next request

Data Visibility Requirements:
  Stage 1: Show R1 with a tall "cache write" bar and the system prompt cost at 1.25× normal
  Stage 2: Show R2..RN with tall "cache read" bars at 0.10× normal — visually striking how much smaller they are
  Stage 3: Show the line chart diverging — caching curve flattens, no-caching curve grows linearly
  Stage 4: Show running cost values and percentage savings

Default values:
- System prompt: 5,000 tokens
- User: 200 tokens, output: 500 tokens
- Caching: on
- TTL: 5 min
- Requests: 10

Implementation: p5.js with responsive width
</details>

!!! mascot-tip "The Cache Pays for Itself on Request Two"
    <img src="../../img/mascot/tip.png" class="mascot-admonition-img" alt="Pemba sharing a tip">
    The arithmetic here is unusually friendly: write costs 1.25×, reads cost 0.10×, so a single follow-up read more than pays back the write premium. Translation: cache *anything* you'll send more than once. The only common reason not to cache is when the prefix legitimately changes every request — which, once you look, is rarer than you'd think. Where did all the tokens go? Spoiler: the system prompt. Cache it.

## Extended Thinking and the Thinking Token Budget

**Extended thinking** is Claude's mode where the model produces a hidden chain of internal reasoning before producing the final visible answer. The thinking content is not shown to the user (it is not in the response `text` blocks) but it is billed at the output token rate, since the model is generating those tokens.

The **thinking token budget** is a parameter (`thinking: { type: "enabled", budget_tokens: N }`) that caps how many reasoning tokens the model is allowed to use on a given request. Higher budgets give the model more room to deliberate on hard problems; lower budgets hold cost down on routine ones. Reasonable starting points:

- 1,024 tokens for everyday Sonnet calls where you want a small reasoning boost
- 8,000 tokens for hard problems where you want substantial deliberation
- 32,000+ tokens reserved for genuine deep-reasoning workloads

The cost impact is substantial. A request that returns a 200-token visible answer can consume 5,000 thinking tokens behind the scenes, billed at the output rate — a 25× hidden cost multiplier. Always cap the thinking budget appropriately; an unbounded thinking budget on a high-volume endpoint is one of the easiest ways to surprise yourself on the monthly bill.

## Claude Tool Use

**Claude tool use** is the mechanism by which the model can ask your application to execute a function and return the result. Tool use turns Claude from "answer my question" into "use these capabilities to accomplish a goal."

A tool-use request includes a `tools` parameter — an array of **tool definition schemas**, each describing the tool's name, purpose, and input parameters in a JSON-schema-like format:

```python
tools = [
    {
        "name": "get_weather",
        "description": "Get the current weather for a location.",
        "input_schema": {
            "type": "object",
            "properties": {"location": {"type": "string"}},
            "required": ["location"],
        },
    }
]
```

When the model decides to call a tool, the response includes a `tool_use` content block with the tool name and JSON arguments. Your application executes the tool, then sends a follow-up request that appends a `tool_result` block (in a user-role message) carrying the result. The model receives that result and continues — possibly calling more tools, possibly producing the final answer.

The cost shape of tool use is important: every tool definition adds tokens to the system area of every request (tool definitions are repeated on every turn so the model knows what's available), and every tool-call iteration is a full round-trip with input+output tokens. Tool definitions are excellent caching candidates — they almost never change between requests within a session.

## Stop Reasons

Every Claude response includes a **stop reason** in the response object — a small string that tells you *why* generation ended:

- `"end_turn"` — the model decided it was done (clean stop)
- `"max_tokens"` — generation hit the `max_tokens` ceiling and was cut off (your hard cap fired)
- `"stop_sequence"` — generation hit a configured stop sequence
- `"tool_use"` — the model emitted a tool call and is awaiting a tool result before continuing
- `"refusal"` — the model declined to respond on safety grounds

Logging the stop reason on every request is a small instrumentation investment with high analytical payoff. A spike in `max_tokens` stop reasons means your `max_tokens` cap is firing more often (output is being truncated mid-sentence). A spike in `tool_use` means agent loops are getting longer. Both are diagnostics you'll want before users notice.

## Streaming, Batch, and Vision

**Anthropic streaming** is the standard server-sent-events pattern: pass `stream=True`, receive a sequence of typed events (`message_start`, `content_block_start`, `content_block_delta`, `message_delta`, `message_stop`). The final `message_delta` event carries the complete `usage` object, so cost accounting works the same as non-streaming. Streaming does not change cost, only latency-to-first-token.

The **Anthropic Batch API** is Anthropic's specialization of the generic Batch API pattern from Chapter 3. Submit a JSONL file of up to 100,000 requests; Anthropic processes them within a 24-hour window; download results from a presigned URL. The batch discount is 50% off both input and output prices (and stacks with prompt caching — cached batch reads are a dramatic combination of discounts). Batch is the right path for any workload that doesn't need interactive latency.

**Claude vision input** lets you send images as `image` content blocks (base64-encoded or referenced by URL). The model can describe images, extract text, answer questions about charts, and reason about diagrams. Each image consumes 1,500–1,800 input tokens depending on resolution, reported separately in the `usage` object. For high-image-volume applications, this token category can rival text input — log it from day one.

#### Diagram: Tool Use Loop with Cost Annotations

<iframe src="../../sims/tool-use-loop-cost/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Tool Use Loop with Cost Annotations</summary>
Type: workflow
**sim-id:** tool-use-loop-cost<br/>
**Library:** Mermaid<br/>
**Status:** Specified

Purpose: Show a multi-turn tool-use loop (model calls tool, gets result, calls another tool, eventually answers) and annotate each turn with input/output token counts so the cumulative cost is visible.

Bloom Level: Analyze (L4)
Bloom Verb: examine

Learning objective: Examine how tool-use loops accumulate input tokens (the entire prior conversation is re-sent on every turn) and identify the tool definitions and system prompt as cache targets.

Visual style: Sequence diagram (vertical), with the model on the left and the application on the right

Steps:
1. App → Model: System prompt (5K tokens, cached) + tools (1K tokens, cached) + user question (50 tokens, uncached)
2. Model → App: Tool call: get_weather("Paris") — small assistant message
3. App → Model: All previous content + tool_result (50 tokens) — re-sends the whole stack
4. Model → App: Tool call: get_forecast("Paris") — another small turn
5. App → Model: All previous content + tool_result — even larger re-send
6. Model → App: Final answer text (200 tokens)

Annotations on each turn:
- Cached input tokens (green)
- Uncached input tokens (orange)
- Output tokens (red)
- Running total cost on the right margin

Interactive controls:
- Toggle: "Show cache savings" — gray out the cached portion to make the savings visible
- Slider: Number of tool-call iterations (1–10)

Implementation: Mermaid sequence diagram, responsive layout
</details>

!!! mascot-warning "Tool Loops Multiply Tokens"
    <img src="../../img/mascot/warning.png" class="mascot-admonition-img" alt="Pemba cautioning">
    A 5-iteration tool loop sends the same system prompt and tool definitions five times — once per turn. Without caching, you pay full price for that prefix five times. With caching, the second through fifth turns hit cache reads at 10% of the normal rate. On a tool-heavy agent, this single setting often cuts the bill in half. Cheap systems are caching systems.

## Putting It All Together

You can now build a Claude application end-to-end. You authenticate against the **Anthropic API** with a scoped, budget-capped key managed by the **Anthropic SDK**. You call the **Claude Messages API** with a model from the **Claude model family** (**Opus**, **Sonnet**, or **Haiku**) selected to match your cost-quality target. You estimate token counts client-side with the **Claude tokenizer**. You structure each request as an **Anthropic system prompt** plus a `messages` array of **message content blocks**. You enable **Anthropic prompt caching** by attaching a **cache control parameter** to a stable prefix block, creating a **cache breakpoint** that survives for the **cache TTL**, and you read **cache read tokens** and **cache write tokens** off the response `usage` object. You enable **extended thinking** with a bounded **thinking token budget** for hard problems. You add **Claude tool use** with **tool definition schemas** and handle **tool result blocks** in follow-up turns. You log the **stop reason** on every response. You use **Anthropic streaming** for interactive latency, the **Anthropic batch API** for non-interactive workloads, and **Claude vision input** when the task involves images.

Chapter 5 walks the same path for OpenAI: same framework, different surface, different idiosyncrasies.

??? question "Quick Self-Check — Click to Reveal Answers"
    1. **What is the cache write price relative to normal input?** Roughly 1.25× — a 25% premium for the privilege of caching.
    2. **What is the cache read price relative to normal input?** Roughly 0.10× — a 90% discount.
    3. **How many cache reads do you need before caching breaks even?** Just one extra read after the write — the math is unusually friendly.
    4. **Where in a Claude request does the system prompt live?** In a top-level `system` field, separate from the `messages` array.
    5. **What does a `stop_reason` of `"max_tokens"` indicate?** Your `max_tokens` ceiling fired and the response was truncated. If you see a spike, your cap may be too low or your prompt is asking for more than necessary.

!!! mascot-celebration "End of Chapter 4"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Pemba celebrating">
    Claude is your first vendor. Cache the system prompt, cap the thinking budget, log the stop reason, and you're already operating one of the leanest LLM stacks available. Next stop: OpenAI, where the levers are similar but the names and idiosyncrasies differ.

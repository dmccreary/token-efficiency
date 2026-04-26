---
title: The OpenAI Ecosystem
description: Chat Completions and Responses APIs, the GPT and o-series model lines, tiktoken, function calling and JSON mode, structured outputs, batch and streaming, and the precise shape of OpenAI's token usage object
generated_by: claude skill chapter-content-generator
date: 2026-04-26 09:00:00
version: 0.07
---

# The OpenAI Ecosystem

## Summary

OpenAI's API surface: Chat Completions and the newer Responses API, the GPT and o-series model lines, the tiktoken library, function calling and JSON mode, structured outputs, OpenAI batch and streaming, and the precise shape of OpenAI's token usage object.

## Concepts Covered

This chapter covers the following 26 concepts from the learning graph:

1. Tiktoken Library
2. OpenAI API
3. Chat Completions API
4. OpenAI Responses API
5. OpenAI Model Family
6. GPT Model Series
7. OpenAI O Series
8. Reasoning Model
9. OpenAI SDK
10. Function Calling
11. Tool Choice Parameter
12. JSON Mode
13. Structured Outputs
14. Response Format
15. OpenAI Streaming
16. OpenAI Batch API
17. OpenAI Embeddings
18. OpenAI Fine Tuning
19. OpenAI Vision
20. Logit Bias
21. Seed Parameter
22. Token Usage Object
23. Prompt Tokens Field
24. Completion Tokens Field
25. Total Tokens Field
26. OpenAI Rate Limits

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: LLMs, Tokens, and Generation Basics](../01-llms-tokens-generation-basics/index.md)
- [Chapter 2: Sampling, Tokenization, and Embeddings](../02-sampling-tokenization-embeddings/index.md)
- [Chapter 3: Pricing, Economics, and Async API Modes](../03-pricing-economics-async-apis/index.md)

---

!!! mascot-welcome "Vendor #2: OpenAI"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Pemba waving welcome">
    OpenAI is the most widely-used vendor in production today, and its API surface has accumulated more historical layers than the others. We have two coexisting endpoints (Chat Completions and the newer Responses API), two distinct model lineages (the GPT series and the o-series reasoning models), and a token usage object whose field names confuse newcomers more than they should. Let's untangle it. Cheap systems start with naming things accurately.

## The API Surface

### OpenAI API and the SDK

The **OpenAI API** is the HTTPS surface at `https://api.openai.com/v1/...`. Like Anthropic, OpenAI also publishes mirrored surfaces on Microsoft Azure (Azure OpenAI Service) for enterprise customers; the request and response shapes are similar but not identical, and the authentication is different. For the rest of this chapter we focus on the public OpenAI API.

The **OpenAI SDK** is the official client library — `openai` on PyPI, `openai` on npm. The Python SDK in particular has gone through several major versions; the modern v1+ SDK is class-based (`OpenAI()` client) and is the only version we cover here. Authentication is via an `OPENAI_API_KEY` environment variable or an explicit `api_key` parameter to the client constructor.

The same key-management discipline from Chapter 4 applies: one key per environment, stored in your secret manager, with a per-key spend cap configured in the OpenAI dashboard. OpenAI offers project-scoped keys that provide an additional isolation layer — use them for multi-tenant applications.

### Chat Completions vs. the Responses API

OpenAI today has two primary chat-style endpoints, and you need to know which is which.

The **Chat Completions API** (`POST /v1/chat/completions`) is the long-standing endpoint that the entire ecosystem of third-party tools, frameworks, and tutorials targets. Take a model name, a `messages` array, and a `max_tokens` cap, return a `choices[0].message.content` string and a `usage` object. This is the API the rest of the industry has standardized around — Azure OpenAI, several "OpenAI-compatible" model providers, and most LLM frameworks all expect the Chat Completions shape.

The **OpenAI Responses API** (`POST /v1/responses`) is the newer endpoint introduced to support stateful conversations, built-in tools (web search, file search, code interpreter), and richer multimodal inputs without the developer having to assemble them manually each turn. The Responses API stores conversation state on OpenAI's servers and lets you reference prior turns by ID, which can reduce per-turn token counts dramatically for long conversations. The tradeoff is vendor lock-in: a Responses API conversation cannot be ported to another vendor without re-shipping the entire history.

The decision rule: use Chat Completions for portable, vendor-neutral applications and for any code that targets multiple "OpenAI-compatible" backends; use the Responses API when the built-in tool catalog or server-side state management is genuinely valuable and the lock-in is acceptable.

## The OpenAI Model Family

The **OpenAI model family** spans two distinct lineages with different design philosophies.

The **GPT model series** is the general-purpose conversational lineage: GPT-4o, GPT-4o-mini, GPT-4.1, and the historical GPT-4, GPT-3.5-turbo. These are the models you reach for first — strong general capability, function calling, vision, structured outputs, and well-understood pricing.

The **OpenAI o-series** is the **reasoning model** lineage: o1, o3, o4-mini, and the like. These models are designed to perform substantial internal deliberation (the OpenAI equivalent of Claude's extended thinking) before producing the final answer. A **reasoning model** is any model architected to spend output tokens on hidden reasoning chains in addition to the visible response. Reasoning models are dramatically better on hard math, coding, and analysis problems — and dramatically more expensive per request, because they consume thousands of internal tokens that you pay for at the output rate.

The cost shape is the practical takeaway:

| Lineage | Example Models | Best For | Cost Profile |
|---------|----------------|----------|---------------|
| GPT series | GPT-4o, GPT-4o-mini, GPT-4.1 | General chat, extraction, classification, vision | Predictable; output ≈ 4× input |
| o-series (reasoning) | o3, o4-mini | Hard reasoning, math, complex code | High variance; reasoning tokens often dwarf visible output |

As with Claude, routing (Chapter 17) is the high-leverage move: send everything to GPT-4o-mini first, escalate to GPT-4o or o3 only when needed.

## The Tiktoken Library

The **tiktoken library** is OpenAI's official tokenizer, distributed as a Python package (`pip install tiktoken`) with a Rust core for speed. It implements the BPE merge rules for every OpenAI tokenizer encoding (`cl100k_base`, `o200k_base`, etc.) and lets you count tokens in any string, locally and exactly.

```python
import tiktoken
enc = tiktoken.encoding_for_model("gpt-4o")
print(len(enc.encode("Hello, world!")))  # 4
```

Use tiktoken whenever you need a token count without paying a network round-trip. For high-throughput services, pre-compute and cache the token counts of stable prefixes (the **token count caching** pattern from Chapter 2) so the tokenizer doesn't show up in your CPU profile.

A subtlety: tiktoken returns the count for a single text string, but a chat-completion request also pays for role-marker overhead (Chapter 2). The exact per-message overhead is documented in OpenAI's "How to count tokens with tiktoken" cookbook; budget about 4 extra tokens per message and 3 for the priming sequence. For precise counts, use the published formula or the API response.

## Function Calling, Tool Choice, and Structured Outputs

OpenAI's tool-use story spans three related features that beginners often confuse.

**Function calling** is OpenAI's name for the tool-use mechanism: you define a list of functions with name, description, and JSON-schema parameters; the model can return a structured request to call one of them; your application executes the function and returns the result for the model to incorporate. This is conceptually identical to Claude's tool use (Chapter 4) but uses the older `functions` field name in some examples and the modern `tools` field in others — they are equivalent.

The **tool choice parameter** (`tool_choice`) controls *whether* and *which* tool the model is allowed to call:

- `"auto"` — model decides whether to call a tool (default)
- `"none"` — model is forbidden from calling tools (forces a text response)
- `"required"` — model must call some tool (forces a tool call)
- `{"type": "function", "function": {"name": "..."}}` — model must call this specific tool

`tool_choice` is a precision instrument. Forcing `"none"` on a request that doesn't need tools saves tokens (the model isn't tempted to deliberate about tool selection); forcing a specific tool shortcuts the routing decision when you already know what you need.

**JSON mode** (`response_format: {"type": "json_object"}`) constrains the model to emit syntactically valid JSON. It does not constrain the *schema* of that JSON — the model could return `{}` and satisfy JSON mode. JSON mode is older and weaker than structured outputs.

**Structured outputs** (`response_format: {"type": "json_schema", "json_schema": {...}}`) constrains the model to emit JSON that conforms to a specific schema. The schema is enforced by a constrained-decoding mechanism on OpenAI's side, so the response is guaranteed to parse and validate. This is the modern, robust approach — use structured outputs whenever you need a typed response.

The **response format** field is the unified parameter that selects between text, JSON mode, and structured outputs. Setting it correctly is the difference between brittle prompt-engineering ("please return valid JSON") and a guaranteed contract.

## The Token Usage Object

Every OpenAI response includes a **token usage object** in the response body — `response.usage` — that reports the token counts for billing. The fields are simple but their names cause confusion:

- **`prompt_tokens` field** — the number of input tokens (everything you sent)
- **`completion_tokens` field** — the number of output tokens (everything the model generated)
- **`total_tokens` field** — `prompt_tokens + completion_tokens`

Why "prompt" instead of "input" and "completion" instead of "output"? Historical: the original OpenAI completion API took a single `prompt` string and produced a single `completion` string. The names stuck even after the API moved to chat-style messages. Treat them as synonyms for "input" and "output" — but do log the actual field names so your queries don't break when OpenAI eventually adds new fields.

For reasoning models (o-series), the usage object also includes a `completion_tokens_details.reasoning_tokens` field — the count of internal reasoning tokens that contributed to `completion_tokens` but did not appear in the visible response. This is the field to log if you want to track how much of your output bill goes to invisible deliberation.

The diagram below shows the full anatomy of an OpenAI response and how each field maps to a billing category:

#### Diagram: OpenAI Token Usage Object Anatomy

<iframe src="../../sims/openai-token-usage-anatomy/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>OpenAI Token Usage Object Anatomy</summary>
Type: diagram
**sim-id:** openai-token-usage-anatomy<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Show a representative OpenAI Chat Completions response side-by-side with a labeled breakdown of where each token-count field comes from.

Bloom Level: Remember (L1)
Bloom Verb: identify

Learning objective: Identify each field of the OpenAI token usage object and map it to its billing category.

Canvas layout:
- Left half: A formatted JSON block showing a real-shaped response with `id`, `model`, `choices`, and `usage` fields highlighted
- Right half: A vertical stack of labeled "billing category" boxes (Input / Output / Reasoning / Total)
- Connecting lines between JSON fields and billing categories

Highlighted fields in the JSON:
- `usage.prompt_tokens` → Input box
- `usage.completion_tokens` → Output box
- `usage.completion_tokens_details.reasoning_tokens` → Reasoning box (sub-component of Output)
- `usage.total_tokens` → sum check
- `model` → connects to a "rate card" lookup callout that shows price per token for that model

Interactive controls:
- Toggle: "Show reasoning model" — switches between a GPT-4o response (no reasoning_tokens) and an o3 response (with reasoning_tokens)
- Hover any field: highlights the corresponding billing category and shows the math

Default state: GPT-4o response shown, no reasoning tokens

Implementation: p5.js with responsive width
</details>

## Streaming, Batch, and Specialized Endpoints

**OpenAI streaming** (`stream=True`) returns server-sent events with incremental `delta` content. The behavior matches the generic streaming pattern from Chapter 1: latency-to-first-token improves dramatically; total cost is unchanged. One nuance — when streaming, the `usage` object is not included by default; you must pass `stream_options={"include_usage": True}` to get it on the final chunk. Always set this option, or your cost accounting will silently lose every streaming request.

The **OpenAI Batch API** (`POST /v1/batches`) is OpenAI's specialization of the generic Batch API pattern. Upload a JSONL file of requests; receive results within a 24-hour window; pay 50% of the synchronous price. Same shape as the Anthropic Batch API (Chapter 4); same decision rule (use it for any non-interactive workload).

**OpenAI Embeddings** are accessed via a separate endpoint (`POST /v1/embeddings`) and a separate model line (`text-embedding-3-small`, `text-embedding-3-large`). Embedding pricing is dramatically lower than generation — typically 50–100× cheaper per token — because embedding APIs only consume input tokens and produce a vector rather than text. This is the cost foundation of RAG (Chapter 15).

**OpenAI Fine Tuning** lets you adapt a base model to your specific task by training on examples. Fine-tuned models cost more per token at inference time (typically 2–4× the base model price) but can be substantially shorter on prompt — a fine-tuned model often needs no system prompt or few-shot examples to perform a task that the base model needed thousands of tokens of instruction for. The cost calculus is non-trivial: amortize the training cost and the per-token premium against the prompt-token savings, and decide whether the workload volume justifies it.

**OpenAI Vision** is the multimodal capability of GPT-4o and related models. Send images as content blocks (URL or base64) and the model can describe, extract text from, or reason about them. Image token cost depends on resolution and detail mode (low/auto/high); a high-detail full-resolution image can consume 2,000+ input tokens. Always log the image token count separately if your application sends images regularly.

## Determinism Controls: Seed and Logit Bias

Two parameters provide finer control over output that the basic temperature/top-p settings (Chapter 2) cannot:

The **seed parameter** is a request-level integer that, combined with a fixed `temperature`, makes the response deterministic across requests. Send the same prompt with the same seed and (mostly) get the same answer. This is essential for reproducible benchmarks, regression tests, and golden test sets (Chapter 20). Note: the response also includes a `system_fingerprint` field; if it changes between requests, OpenAI swapped backend infrastructure and the seed-based reproducibility may not hold.

**Logit bias** is a parameter that lets you nudge the probability of specific tokens up or down by passing a map of `{token_id: bias}`. Use it to ban specific words ("never use the word 'utilize'"), force structured outputs to start with specific tokens, or bias toward shorter outputs by penalizing common continuation tokens. Logit bias is a fine-grained tool and rarely needed in production, but for specific edge cases it can save a separate post-processing step.

#### Diagram: Function Calling Loop with Tool Choice

<iframe src="../../sims/openai-function-calling-loop/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Function Calling Loop with Tool Choice</summary>
Type: workflow
**sim-id:** openai-function-calling-loop<br/>
**Library:** Mermaid<br/>
**Status:** Specified

Purpose: Show how function calling works end to end and how `tool_choice` changes the loop shape.

Bloom Level: Apply (L3)
Bloom Verb: implement

Learning objective: Implement a function-calling round-trip and choose the right `tool_choice` setting based on whether the request needs to call a tool.

Visual style: Sequence diagram with three swimlanes (App, OpenAI API, Tool implementation)

Steps shown:
1. App → OpenAI: messages + tools array + tool_choice
2. OpenAI → App: assistant message with `tool_calls` array
3. App → Tool: invoke the named function with the parsed JSON arguments
4. Tool → App: returns result
5. App → OpenAI: original messages + assistant message + tool message with the result
6. OpenAI → App: final assistant text response

Interactive controls:
- Dropdown: tool_choice = "auto" / "none" / "required" / "{specific tool}"
- Toggle: "Show token costs at each step"

Behaviors:
- "auto": full loop runs as shown
- "none": skips steps 2–5 entirely; model returns text only
- "required": model is forced to emit tool_calls even on a question that wouldn't normally need them
- "{specific tool}": model is forced to call that exact tool

Implementation: Mermaid sequence diagram, responsive layout
</details>

## OpenAI Rate Limits

**OpenAI rate limits** are published per model and per organization, expressed as both **requests per minute (RPM)** and **tokens per minute (TPM)**, with the lower of the two binding. Rate limits scale with usage tier — new accounts start in tier 1 (low limits) and graduate automatically to higher tiers as cumulative spend crosses thresholds.

Three operational practices for living within OpenAI rate limits:

- Implement client-side rate limiting that throttles below the published limit (90% of TPM is a safe target — leaves headroom for bursts)
- Use the `x-ratelimit-*` response headers (`x-ratelimit-remaining-tokens`, `x-ratelimit-reset-tokens`) to drive adaptive throttling rather than guessing
- Keep batch traffic on the Batch API — batch has its own rate limit pool, so it doesn't compete with synchronous traffic for the same quota

!!! mascot-tip "Watch the Rate Limit Headers"
    <img src="../../img/mascot/tip.png" class="mascot-admonition-img" alt="Pemba sharing a tip">
    Most teams discover their rate limits the hard way — a 429 storm during a launch. The `x-ratelimit-remaining-tokens` header tells you exactly how close you are *before* you hit the wall. Surface that as a metric (Chapter 10), alert at 25% remaining, and you'll never be surprised again. Cheap systems are observable systems.

## Putting It All Together

You can now build OpenAI applications competently. You authenticate against the **OpenAI API** with the **OpenAI SDK** and a properly-managed key. You choose between the **Chat Completions API** (portable, default) and the **OpenAI Responses API** (stateful, lock-in). You select a model from the **OpenAI model family** — either the **GPT model series** for general work or the **OpenAI o-series** **reasoning models** for hard problems. You count tokens locally with the **tiktoken library**. You add **function calling** with appropriate **tool choice parameter** settings, and you constrain output shape with **JSON mode**, **structured outputs**, or the unified **response format** parameter. You read the **token usage object** — `prompt_tokens`, `completion_tokens`, `total_tokens`, plus reasoning sub-fields — to drive cost accounting. You use **OpenAI streaming** with `include_usage` for interactive UIs, the **OpenAI batch API** for non-interactive jobs, **OpenAI Embeddings** for retrieval, **OpenAI Fine Tuning** when prompt-token amortization justifies it, **OpenAI Vision** for image inputs, **logit bias** and the **seed parameter** for fine-grained control, and you operate inside **OpenAI rate limits** with adaptive client-side throttling.

Chapter 6 covers the third major vendor — Google Gemini — and then synthesizes the cross-vendor view.

??? question "Quick Self-Check — Click to Reveal Answers"
    1. **What's the difference between `prompt_tokens` and `completion_tokens`?** They're OpenAI's historical names for input tokens and output tokens, respectively. Same meaning as the generic terms.
    2. **When you stream a response, how do you get the usage object?** Pass `stream_options={"include_usage": True}` — without it, streaming responses do not include usage and your accounting will miss them.
    3. **What's the difference between JSON mode and structured outputs?** JSON mode guarantees valid JSON syntax but not a particular schema. Structured outputs enforce a specific JSON schema via constrained decoding.
    4. **When should you choose the Responses API over Chat Completions?** When you specifically want server-side conversation state or one of the built-in tools (web search, file search, code interpreter), and the OpenAI lock-in is acceptable.
    5. **What does `tool_choice="none"` do?** Forbids the model from calling any tool, forcing a plain text response. Useful when you want to suppress tool-use behavior on a specific request.

!!! mascot-celebration "End of Chapter 5"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Pemba celebrating">
    OpenAI mapped. The patterns are familiar (chat-style messages, function calling, batch discount, streaming, vision) and the field names are different (prompt/completion instead of input/output). One more vendor — Gemini — and you'll have all three covered.


---

[See Annotated References](./references.md)

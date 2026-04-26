---
title: Structured Logging for LLM Calls
description: The instrumentation foundation — log schema design, the standard set of LLM call fields, session and trace identifiers, sampling and retention, and the privacy primitives that any LLM logging system needs from day one
generated_by: claude skill chapter-content-generator
date: 2026-04-26 09:00:00
version: 0.07
---

# Structured Logging for LLM Calls

## Summary

The instrumentation foundation that the rest of the book depends on: log schema design, JSON log fields, the standard set of LLM call fields (model, prompt hash, token counts, cost, latency, feature, user, outcome), session and trace identifiers, log sampling and retention, and the privacy primitives (data privacy, PII detection, PII redaction) that any LLM logging system must include from day one.

## Concepts Covered

This chapter covers the following 27 concepts from the learning graph:

1. Structured Logging
2. Log Schema Design
3. Log Line
4. JSON Log Format
5. Log Field
6. Required Log Field
7. Optional Log Field
8. Model Field
9. Prompt Hash
10. Input Token Field
11. Output Token Field
12. Cached Token Field
13. Latency Field
14. Cost Field
15. Feature Tag
16. User Identifier
17. Outcome Field
18. Trace Identifier
19. Span Identifier
20. Request Identifier
21. Session Identifier
22. PII Redaction
23. Prompt Truncation In Logs
24. Log Sampling
25. Log Retention Policy
26. Data Privacy
27. PII Detection

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: LLMs, Tokens, and Generation Basics](../01-llms-tokens-generation-basics/index.md)
- [Chapter 2: Sampling, Tokenization, and Embeddings](../02-sampling-tokenization-embeddings/index.md)
- [Chapter 3: Pricing, Economics, and Async API Modes](../03-pricing-economics-async-apis/index.md)
- [Chapter 4: The Anthropic Claude Ecosystem](../04-anthropic-claude-ecosystem/index.md)
- [Chapter 7: AI Coding Harnesses and Agentic Loops](../07-coding-harnesses-agentic-loops/index.md)

---

!!! mascot-welcome "The Foundation Everything Else Sits On"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Pemba waving welcome">
    You can't optimize what you can't measure, and you can't measure what you didn't log. This chapter installs the schema that the rest of the book — dashboards, A/B tests, log-file forensics, budget enforcement — all depends on. The good news: it's about 30 fields. Get them right on day one and every later question becomes answerable. Get them wrong and you'll be re-instrumenting six months from now.

## Why Structured Logging Matters Here

**Structured logging** is the practice of emitting log entries as machine-parseable records (typically JSON) with consistent field names and types, rather than free-form human-readable strings. For LLM applications, structured logging is non-negotiable — the analyses we'll do in Chapters 10, 11, and 12 all assume you can `SELECT SUM(cost) FROM logs WHERE feature = 'X'`. That requires fields, not prose.

Plain-text logs (`"INFO: User did the thing, cost was about a dime"`) are appropriate for debugging individual requests; they are useless for cost attribution or trend analysis. Structured logs (`{"event":"llm_call","feature":"summarize","cost":0.094, ...}`) are what every later chapter assumes.

## The Log Schema

### Log Schema Design Principles

**Log schema design** is the upfront engineering of which fields you'll log on every request, what their names and types are, and which are required vs. optional. Doing this once, deliberately, costs an afternoon. Doing it ad hoc costs years of inconsistent fields that can't be aggregated.

The principles:

- **Stable field names.** If you call it `input_tokens` in one service and `prompt_tokens` in another, downstream analyses break. Pick names early; keep them.
- **Consistent units.** Tokens are integers, costs are dollars (six decimal places), latency is milliseconds. No mixing.
- **Required vs. optional.** A small set of fields must appear on every record (cost-attribution math depends on it). The rest can be optional.
- **Forward-compatible.** Add new fields liberally; never repurpose old ones. Removing fields is a breaking change to every downstream query.
- **Vendor-neutral where possible.** Capture vendor-specific token sub-categories under namespaced fields (`anthropic.cache_write_tokens`, `openai.reasoning_tokens`) rather than overloading generic ones.

### A Log Line and the JSON Log Format

A **log line** is one record in your log stream — typically one LLM API call (or one harness session, depending on granularity). The **JSON log format** is the standard representation: each log line is a single JSON object on a single physical line (newline-delimited JSON, also known as JSONL or NDJSON), suitable for both tail-based debugging and bulk loading into analytics systems.

A representative log line for one LLM call:

```json
{"timestamp":"2026-04-26T14:32:15.482Z","event":"llm_call","request_id":"req_abc123","trace_id":"trc_xyz789","span_id":"sp_001","session_id":"sess_def456","user_id":"u_a1b2c3","feature":"summarize_document","model":"claude-sonnet-4-6","input_tokens":4821,"output_tokens":312,"cached_input_tokens":4500,"cost_usd":0.005463,"latency_ms":1842,"prompt_hash":"sha256:9f8e...","outcome":"success","stop_reason":"end_turn"}
```

That's a single physical line in production; one record, ~30 fields, fully structured. Every later analytical query is a SQL aggregate over millions of these records.

### Log Fields, Required vs. Optional

A **log field** is one named property in a log line. **Required log fields** must appear on every record; **optional log fields** appear when relevant.

The required set for any LLM call log:

- `timestamp` — ISO 8601 UTC, millisecond precision
- `event` — record type discriminator (`"llm_call"`, `"agent_session"`, etc.)
- `request_id` — unique ID for this request
- `model` — vendor model identifier (`"claude-sonnet-4-6"`)
- `input_tokens` — integer count
- `output_tokens` — integer count
- `cost_usd` — computed dollar cost (six decimal places)
- `latency_ms` — wall-clock latency for the request
- `outcome` — `"success"` | `"failure"` | `"refusal"` | `"timeout"`

The optional set (include when relevant; many will be relevant for most production systems):

- `cached_input_tokens` — for vendors with caching
- `reasoning_tokens` — for reasoning-model calls
- `feature` — product-feature tag
- `user_id` — hashed end-user identifier
- `session_id` / `trace_id` / `span_id` — for joining multi-call work
- `prompt_hash` — for prompt-template grouping
- `stop_reason` — vendor-reported stop reason
- `vendor` — `"anthropic"` | `"openai"` | `"google"` for multi-vendor systems

### The Standard LLM Call Fields in Detail

Several specific fields deserve explanation:

The **model field** records the exact model identifier used. Always use the vendor's full model string (`"claude-sonnet-4-6"`, not `"sonnet"`) so you can tell models apart across versions when you start A/B-testing them in Chapter 12.

The **prompt hash** is a SHA-256 (or similar) hash of the prompt template — *not* the fully-rendered prompt with user content interpolated. The prompt hash lets you group all requests that used the same template even though the variable parts differ. This is the key to per-template cost analysis (Chapter 11). Hash the template, not the rendered string.

The **input token field**, **output token field**, and **cached token field** carry the three categories of token count. Pull them directly from the API response (`response.usage` for OpenAI, `response.usage.input_tokens` etc. for Anthropic). Never compute them from `len(text)` — only the API knows the exact count.

The **latency field** is the wall-clock duration of the request in milliseconds, measured at the client (network round-trip + server processing). Distinguish from time-to-first-token (TTFT) for streaming requests; consider logging both.

The **cost field** is the computed dollar cost of this single request. Compute it client-side using the published per-million-token prices for the model in use. Do not wait for the vendor invoice — by then the data is too coarse for per-request analysis. Use a small lookup table that maps `(model, token_type) → $/MTok`.

A **feature tag** is a short string identifying which product feature triggered this call (`"summarize_document"`, `"chat_response"`, `"classify_intent"`). Add this from the application code at call site. It's the single most useful dimension for cost attribution.

A **user identifier** is a (hashed) reference to the end-user the call was made on behalf of. Always hash before logging — never log raw email addresses or user IDs that could re-identify someone outside your system.

The **outcome field** is the business-level success indicator: did the request accomplish what it was supposed to accomplish? For some endpoints this is obvious (the JSON parsed); for others it requires application-level judgment (the user clicked "thumbs up"). Cost-per-outcome (Chapter 3) is impossible without this field.

## Identifiers: Trace, Span, Session, Request

Modern distributed systems organize work hierarchically, and your LLM logs need to participate in that hierarchy or you'll lose the ability to join them with the rest of your observability stack.

A **trace identifier** is a globally-unique ID for an entire user-facing operation that may span many services and many LLM calls. Traces are typically generated at the edge of your system (load balancer or front-door service) and propagated through every downstream call.

A **span identifier** is a unique ID for one specific operation within a trace — typically one LLM call, one database query, one downstream service call. Spans nest within traces and reference their parent span via a `parent_span_id`. The trace-and-span model is the OpenTelemetry standard (Chapter 10) and matches how every modern APM tool expects data.

A **request identifier** is the per-request ID assigned by your application — for some systems it's the same as `span_id`, for others it's separate. Use whichever convention your existing services use; the important part is that every log entry has *some* unique per-request handle.

A **session identifier** is the higher-level grouping for an extended conversation or agent session — Chapter 7's harness sessions, multi-turn chat conversations, etc. The session ID lets you compute per-session cost (sum of all `cost_usd` for the session) which is the metric agent budgets (Chapter 18) target.

The hierarchy:

| Level | Scope | Example |
|-------|-------|---------|
| Trace | Whole user operation across services | One support ticket end-to-end |
| Session | Multi-turn conversation or agent session | One Claude Code session |
| Request / Span | Single LLM API call | One `messages.create()` invocation |

Log all four on every LLM call. Storage is cheap; reconstruction is expensive.

## Privacy: PII Detection and Redaction

LLM logs are, by their nature, dangerous. The user prompts that flow through your system contain whatever the user happened to type — names, addresses, account numbers, medical descriptions, code containing passwords. Logging those prompts naively creates a high-value target for any breach and violates basic data protection principles.

**Data privacy** is the broader practice of not collecting, storing, or exposing personal information beyond what's strictly needed. For LLM logs the principle translates to: log the *metadata* of every call (token counts, costs, latency, hashes) and avoid logging the *content* (raw prompts and responses) unless you have an explicit legal basis and a redaction strategy.

**PII detection** is the process of identifying personally-identifiable information in a string before it enters your logs. Modern PII detection uses a mix of regex patterns (email, phone, credit card formats), named-entity recognition (people, organizations, locations), and structured allow/deny lists for known sensitive fields. Use a library — `presidio`, `scrubadub`, or your cloud provider's DLP API — rather than writing your own.

**PII redaction** is what you do once PII is detected: replace the offending substrings with placeholders (`[EMAIL]`, `[NAME]`) before logging. Redaction is a one-way transformation; you cannot recover the original from the redacted log. That is the point.

A representative redaction-aware log entry includes:

- The redacted prompt (or just a hash of it) — never the raw
- The token count of the original prompt (computed before redaction)
- A flag indicating PII was detected and redacted: `"pii_redacted": true`
- The redaction policy version: `"pii_policy_version": "v3"` so you can re-process logs when the policy changes

### Prompt Truncation in Logs

**Prompt truncation in logs** is the related practice of storing only a fixed-size prefix or hash of the prompt, even when no PII is detected. Reasons to truncate:

- Storage cost — multi-million-token prompts in logs add up
- Search index size — full-text indexes blow up on long prompt content
- Defense in depth — even non-PII prompts may contain proprietary information

A common pattern: log the first 500 tokens of the rendered prompt, plus the SHA-256 hash of the full prompt, plus a `prompt_truncated: true` flag. This gives you enough context to debug typical issues while bounding storage growth.

#### Diagram: LLM Logging Pipeline with Privacy Filters

<iframe src="../../sims/llm-logging-pipeline-privacy/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>LLM Logging Pipeline with Privacy Filters</summary>
Type: workflow
**sim-id:** llm-logging-pipeline-privacy<br/>
**Library:** Mermaid<br/>
**Status:** Specified

Purpose: Show the full path of an LLM call from application code through the LLM API and out to a log storage backend, with PII detection and redaction stages clearly marked.

Bloom Level: Apply (L3)
Bloom Verb: implement

Learning objective: Implement an LLM logging pipeline that captures every required field while satisfying PII redaction and retention requirements.

Visual style: Vertical flowchart with branches

Steps:
1. Application code: build prompt, call LLM API
2. LLM API: returns response with usage metadata
3. Logging middleware (synchronous):
   - Compute prompt_hash
   - Detect PII in prompt and response
   - Branch:
     - If PII detected: redact → log redacted version with pii_redacted=true
     - If no PII: log full prompt (truncated to N tokens) with pii_redacted=false
   - Compute cost_usd from usage and price table
   - Add trace_id / span_id / session_id / request_id / user_id / feature
4. Emit JSONL log line to local stream
5. Log forwarder (asynchronous): ship to object storage and analytics warehouse
6. Retention policy: delete records older than N days

Annotations:
- Highlight which fields are required vs. optional
- Show the redaction transformation on a sample prompt
- Show the cost computation: usage * price → cost_usd

Interactive controls:
- Toggle: PII detected (true/false) — shows different log output
- Slider: Truncation length (100–2000 tokens)

Implementation: Mermaid flowchart, responsive layout
</details>

## Log Sampling and Retention

### Log Sampling

**Log sampling** is the practice of logging only a fraction of requests to control storage cost and downstream analytics load. For high-volume LLM applications (millions of requests per day), full logging may be impractical or prohibitively expensive.

Sampling strategies that work well for LLM logs:

- **Always-on for cost-impacting calls.** Sample 100% of high-cost requests (anything above a threshold, say 5,000 output tokens) — they're rare and they matter.
- **Always-on for failures.** Sample 100% of any request with `outcome != "success"` — debugging needs them.
- **Down-sampled for routine calls.** Sample 1–10% of routine successful requests, with extrapolation for aggregates.
- **Per-feature override.** Sample 100% of any new or A/B-tested feature regardless of volume.

Sampling decisions must be deterministic per request (hash of `request_id`, take modulo) so the sampled subset is statistically representative and so retries don't change the sampling outcome.

### Log Retention Policy

A **log retention policy** specifies how long log records are kept before deletion. Retention serves three competing pressures: forensic value (you might need old logs to debug), storage cost (logs accumulate fast), and compliance (Chapter 19 — GDPR's right-to-be-forgotten, regulatory data-minimization requirements).

A reasonable default policy for LLM logs:

- Hot tier (queryable in seconds): 30 days
- Warm tier (queryable in minutes, lower-cost storage): 90 days
- Cold tier (archive, retrieve in hours): 1 year
- Beyond 1 year: aggregate-only retention (per-day/feature/user roll-ups), individual records deleted

Document the policy explicitly so engineers can answer "where can I find that data" with a simple lookup, not by guessing.

!!! mascot-warning "Logging Without Privacy Controls Is a Liability"
    <img src="../../img/mascot/warning.png" class="mascot-admonition-img" alt="Pemba cautioning">
    The most common logging mistake I see is "log the full prompt and response, we'll figure out privacy later." That decision creates a multi-terabyte database of customer data with no redaction, no retention plan, and no audit trail — exactly the kind of data store that ends up in a breach disclosure. Build privacy in from day one. PII detection runs in microseconds; retroactively scrubbing a year of logs takes weeks.

## Putting It All Together

You can now design and operate the logging system that every later chapter depends on. You emit **structured logging** as **JSON log format** records with thoughtful **log schema design**, distinguishing **required log fields** (timestamp, request_id, model, input_tokens, output_tokens, cost_usd, latency_ms, outcome) from **optional log fields**. Each **log line** carries the standard set: **model field**, **prompt hash**, **input token field**, **output token field**, **cached token field**, **latency field**, **cost field**, **feature tag**, **user identifier**, **outcome field**, plus the hierarchical identifiers — **request identifier**, **span identifier**, **trace identifier**, **session identifier**. You enforce **data privacy** with **PII detection** and **PII redaction**, complement them with **prompt truncation in logs**, and govern volume and lifecycle with **log sampling** and a **log retention policy**.

Chapter 10 takes these logs and builds dashboards and alerts on top of them.

??? question "Quick Self-Check — Click to Reveal Answers"
    1. **What format should LLM logs be in?** Newline-delimited JSON (JSONL / NDJSON) — one structured object per line.
    2. **Why hash the prompt template instead of the rendered prompt?** So you can group all requests that used the same template, regardless of the variable interpolations. Per-template cost analysis depends on this.
    3. **What's the difference between trace_id, session_id, and request_id?** Trace = whole user operation across services; Session = multi-turn conversation or agent session; Request = single LLM call.
    4. **Why is the `outcome` field necessary?** Without it you cannot compute cost-per-outcome — and cost-per-request reductions can mask quality regressions invisible in token counts alone.
    5. **What goes wrong if you don't redact PII before logging?** You create a high-value, un-curated database of customer data with no compliance story — exactly the data store that ends up in a breach disclosure.

!!! mascot-celebration "End of Chapter 9"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Pemba celebrating">
    The schema is in place. Every later chapter — dashboards, log-file forensics, A/B tests, budgets — assumes you have these fields on every record. Now we'll build the dashboards that turn the logs into signal.


---

[See Annotated References](./references.md)

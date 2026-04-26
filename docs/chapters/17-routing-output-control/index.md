---
title: Model Routing and Output Control
description: Spending output tokens deliberately — cheap-first cascades, escalation triggers, fallback models, vendor-neutral abstractions, and the full output-control toolkit (max tokens, stop sequences, JSON schema, reasoning effort)
generated_by: claude skill chapter-content-generator
date: 2026-04-26 09:00:00
version: 0.07
---

# Model Routing and Output Control

## Summary

Spending output tokens deliberately: cheap-first cascades, escalation triggers and confidence thresholds, fallback models, cross-vendor routing, vendor-neutral abstractions, plus the full output-control toolkit (max tokens, stop sequences, JSON schema enforcement, reasoning effort and thinking-token settings).

## Concepts Covered

This chapter covers the following 30 concepts from the learning graph:

1. Model Routing
2. Cheap-First Cascade
3. Escalation Trigger
4. Confidence Threshold
5. Quality Gate
6. Fallback Model
7. Cross-Vendor Routing
8. Task Classifier
9. Difficulty Estimation
10. Routing Policy
11. Routing Cost Savings
12. Routing Quality Risk
13. Per-Task Model Selection
14. Vendor Lock-In Risk
15. Vendor-Neutral Abstraction
16. Max Tokens Setting
17. Stop Sequence Setting
18. Length Penalty
19. JSON Schema Output
20. Concise Mode
21. Verbosity Parameter
22. Reasoning Budget
23. Thinking Token Limit
24. Truncation Detection
25. Streaming Cancellation
26. Early Stopping
27. Output Postprocessing
28. Output Validation
29. Schema Enforcement
30. Reasoning Effort Setting

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: LLMs, Tokens, and Generation Basics](../01-llms-tokens-generation-basics/index.md)
- [Chapter 2: Sampling, Tokenization, and Embeddings](../02-sampling-tokenization-embeddings/index.md)
- [Chapter 3: Pricing, Economics, and Async API Modes](../03-pricing-economics-async-apis/index.md)
- [Chapter 4: The Anthropic Claude Ecosystem](../04-anthropic-claude-ecosystem/index.md)
- [Chapter 5: The OpenAI Ecosystem](../05-openai-ecosystem/index.md)
- [Chapter 6: The Google Gemini Ecosystem](../06-google-gemini-ecosystem/index.md)
- [Chapter 12: A/B Testing Methodology for LLMs](../12-ab-testing-methodology/index.md)
- [Chapter 13: Prompt Engineering for Token Efficiency](../13-prompt-engineering-tokens/index.md)
- [Chapter 16: Context Window Management](../16-context-window-management/index.md)

---

!!! mascot-welcome "Spend Output Tokens Deliberately"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Pemba waving welcome">
    Output is the most expensive token category (Chapter 3) and routing is the second-highest-leverage optimization in this book (after caching). Most LLM applications send everything to the strongest model "to be safe" — and pay 10× too much for the routine 80% of requests that the cheap model would handle perfectly. This chapter shows you how to route deliberately and how to bound output even more precisely. Cheap systems route the easy stuff cheap.

## Routing as a Cost Discipline

**Model routing** is the practice of sending each request to the model that's just-good-enough for it, rather than always using the strongest available. The simplest routing decision is binary: send routine requests to a cheap model, escalate hard ones to an expensive model. The savings can easily reach 50–80% of total cost without quality loss.

The math: for a typical workload distribution, ~80% of requests are routine (suitable for the cheap model) and ~20% are hard (need the expensive one). If the cheap model is 5× cheaper per token, routing produces:

\[
\text{Routed cost} = 0.80 \times C_{\text{cheap}} + 0.20 \times C_{\text{expensive}}
\]

Substituting \( C_{\text{cheap}} = C_{\text{expensive}} / 5 \):

\[
\text{Routed cost} = 0.16 \times C_{\text{expensive}} + 0.20 \times C_{\text{expensive}} = 0.36 \times C_{\text{expensive}}
\]

A 64% cost reduction relative to "always use the expensive model" — for the same expected quality, since the hard requests still get the strong treatment.

## The Cheap-First Cascade

The **cheap-first cascade** is the canonical routing pattern: try the cheap model first, escalate to the expensive model only when the cheap one's response fails some quality check. The flow:

1. Send request to cheap model
2. Run a **quality gate** on the response (validates structure, checks confidence, runs a heuristic)
3. If the gate passes, return the cheap response — done
4. If the gate fails, retry on the expensive model

The cascade pays for the cheap call always and the expensive call only on failures. If the cheap model succeeds 80% of the time, total cost is `cheap_cost + 0.20 × expensive_cost` — close to the cheap cost alone.

An **escalation trigger** is the specific signal that fires the gate failure. Triggers come in several flavors:

- **Format triggers** — the response didn't parse as expected JSON, didn't match a regex, didn't pass a JSON Schema check
- **Confidence triggers** — the response includes uncertainty markers ("I'm not sure", "this might be wrong") or has low confidence on logprobs (Chapter 2)
- **Length triggers** — the response was suspiciously short (the model gave up) or suspiciously long (the model rambled)
- **Eval triggers** — a downstream evaluator (a small classifier, a rule-based checker, even another LLM) judges the response inadequate

A **confidence threshold** is the specific numeric cutoff for confidence-based triggers. If `top_token_logprob - second_token_logprob < threshold`, escalate. The right threshold is workload-specific — A/B test it.

## Fallback Models and Cross-Vendor Routing

A **fallback model** is the model the cascade escalates to when the primary fails. Fallbacks usually go up the same family (Haiku → Sonnet → Opus) but can also cross vendors when the failure mode is vendor-specific.

**Cross-vendor routing** is the practice of routing across vendors based on cost, capability, or availability — sending Claude requests to Anthropic, GPT requests to OpenAI, Gemini-eligible requests to Google, possibly with vendor-specific cascades within each. The motivations:

- Cost arbitrage — Vendor A's Sonnet-tier might be cheaper than Vendor B's equivalent for your traffic
- Capability arbitrage — some tasks just work better on specific models (long-context to Gemini, reasoning to o-series)
- Availability — fallback to a different vendor when your primary is rate-limited or down

Cross-vendor routing requires a **vendor-neutral abstraction** layer in your code — a shared interface (request shape, response shape, cost computation) that maps to each vendor's specific SDK behind the scenes. Frameworks like LiteLLM, OpenRouter, or in-house wrappers handle this. The investment is worthwhile for any organization spending more than ~\$10K/month on LLM costs; below that, the operational complexity outweighs the savings.

## Task Classifiers and Difficulty Estimation

A **task classifier** is a small, cheap component (usually a small LLM call or even a non-LLM ML model) that examines an incoming request and classifies it into a category — "simple lookup", "summarization", "complex reasoning", "code generation", etc. The classifier output drives **per-task model selection** — different categories route to different default models.

**Difficulty estimation** is the related but more granular practice: produce a numeric difficulty score for each request and route based on a threshold. A request scoring 0.2 (easy) goes to Haiku; one scoring 0.8 (hard) goes to Opus.

Both classifier and difficulty estimation cost a small extra LLM call per request (~\$0.0001 each). They're worth it when the cost differential between cheap and expensive models is large enough that even occasional savings dominate the classifier cost — which is almost always.

## Routing Policy: From Tactics to Strategy

A **routing policy** is the formal specification of how routing decisions get made — input features, model options, escalation rules, fallback chains, vendor preferences. Policies turn ad hoc routing tactics into auditable, A/B-testable, version-controlled artifacts.

A typical policy specification:

```yaml
policy: production_v3
rules:
  - if: feature == "simple_lookup"
    primary: claude-haiku-4-5
    escalate_on: ["json_invalid", "logprob_uncertain"]
    fallback: claude-sonnet-4-6

  - if: feature == "code_review"
    primary: claude-sonnet-4-6
    escalate_on: ["eval_fail"]
    fallback: claude-opus-4-7

  - if: feature == "deep_research"
    primary: claude-opus-4-7
    fallback: gemini-pro
    fallback_on: ["rate_limit"]
```

Policies should be data, not code — version them, A/B test them, roll back without a deploy.

### Routing Cost Savings vs. Routing Quality Risk

**Routing cost savings** is the dollar amount saved by a routing policy compared to a "always strongest model" baseline. Quantify and report this monthly — it's the headline metric that justifies the routing infrastructure.

**Routing quality risk** is the corresponding downside: every routing decision that sends a request to a cheaper model carries some risk that the cheaper model produces a worse response. Quantify quality risk via the same A/B test methodology from Chapter 12 — the routed variant must hold guardrail metrics flat.

A routing policy ships only when it shows large cost savings *and* flat guardrails. Both must be true.

### Vendor Lock-In Risk

**Vendor lock-in risk** is the operational risk that comes from depending on vendor-specific features that don't have equivalents elsewhere. Anthropic prompt caching syntax, OpenAI structured outputs, Gemini grounding — each is a vendor-specific feature you can't trivially port. Vendor lock-in isn't always bad (the feature might be worth it), but the risk should be deliberate, not accidental.

The mitigation is the vendor-neutral abstraction: keep vendor-specific features behind feature flags within your abstraction layer, so you can switch without rewriting application code. The cost is some lost optimization (you can't always exploit a vendor-specific feature fully when there's no equivalent elsewhere); the benefit is freedom of movement when prices, capabilities, or availability shifts.

#### Diagram: Cheap-First Cascade with Escalation

<iframe src="../../sims/cheap-first-cascade-escalation/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Cheap-First Cascade with Escalation</summary>
Type: workflow
**sim-id:** cheap-first-cascade-escalation<br/>
**Library:** Mermaid<br/>
**Status:** Specified

Purpose: Show the cheap-first cascade flow with escalation triggers visible at each gate, plus a cost annotation showing per-request expected cost as a function of escalation rate.

Bloom Level: Apply (L3)
Bloom Verb: implement

Learning objective: Implement a cheap-first cascade with appropriate escalation triggers and quantify the expected cost savings.

Visual style: Flowchart with three branches

Steps:
1. User request → Send to cheap model (Haiku, \$0.001)
2. Run quality gate:
   - Format check (JSON valid?)
   - Confidence check (logprob delta > threshold?)
   - Length check (within expected range?)
3. Branch:
   - If all pass → Return cheap response (cost: \$0.001)
   - If any fail → Escalate to expensive model (Sonnet, \$0.005), return that response (cost: \$0.001 + \$0.005 = \$0.006)
4. Optional second escalation to most-expensive model (Opus) on second failure

Annotations:
- Per-stage cost
- Per-stage probability (default: 80% cheap-pass, 18% sonnet-pass, 2% opus-pass)
- Expected cost per request: 0.80 × \$0.001 + 0.18 × \$0.006 + 0.02 × \$0.026 = \$0.0024
- Compared to "always Opus" baseline (\$0.026): 91% reduction

Interactive controls:
- Slider: cheap-pass rate (50%–95%)
- Slider: confidence threshold
- Toggle: "Add Opus tier" (on/off)
- Toggle: "Show expected cost calculation"

Implementation: Mermaid flowchart with cost annotations, responsive layout
</details>

## The Output Control Toolkit

Routing decides which model handles a request; output control bounds what that model is allowed to produce. The toolkit:

The **max tokens setting** is the absolute ceiling on output token count (Chapter 1). Even a misbehaving prompt cannot produce more output tokens than `max_tokens`. Set this for every endpoint to a value calibrated to the maximum useful response length — never accept the SDK default.

The **stop sequence setting** specifies strings that, if generated, end the response cleanly. Use stop sequences for structural framing — end after the JSON object closes, end before a new section starts. Stop sequences end generation at the right *content* boundary, complementing `max_tokens` which ends at the right *length* boundary.

A **length penalty** is a parameter (where supported) that biases the model toward shorter output by progressively penalizing longer continuations. Less precise than `max_tokens` but useful for biasing toward concise answers without hard truncation.

**JSON schema output** (Chapter 5) constrains the model to emit JSON conforming to a specific schema. The constrained-decoding mechanism stops the model from emitting tokens that would violate the schema, which usually means earlier termination — the response is structurally complete the moment the schema is satisfied. JSON schema output saves output tokens and eliminates parse-failure retry loops.

**Concise mode** is a generic name for any vendor-specific or prompt-level setting that biases toward shorter responses. Where it exists as a vendor parameter (some smaller models offer it), use it. Where it doesn't, use a prompt-level **concise output instruction** (Chapter 13).

A **verbosity parameter** (where supported) is a more graded version of concise mode — a numeric setting that scales how much the model writes. Set it once per endpoint based on the use case.

The **reasoning budget** and **thinking token limit** (Chapter 4) bound how many internal reasoning tokens the model can produce on reasoning-capable models. Always cap the reasoning budget — uncapped is a path to surprise bills.

The **reasoning effort setting** is OpenAI's o-series equivalent — `reasoning.effort = "low" | "medium" | "high"` controls how much internal deliberation the model does. Higher effort = better answers on hard problems = more reasoning tokens billed at the output rate.

## Truncation Detection and Postprocessing

**Truncation detection** is the practice of detecting when a response was cut off by `max_tokens` and handling it appropriately — by retrying with a higher cap, by asking the model to continue, or by failing fast and surfacing the issue. Detection signals: the response's stop reason is `"max_tokens"`, the JSON didn't parse, the text ends mid-sentence.

Without truncation detection, an over-tight `max_tokens` cap looks like a quality regression — answers seem to "trail off" inexplicably. With detection, you can retry intelligently or alert.

**Streaming cancellation** is the client-side abort of a streaming response that has gone off the rails — the model started looping, repeating itself, or generating obviously bad output. Most vendor APIs let you close the stream and stop being billed for further tokens (or at least minimize the additional tokens). Cancellation requires the client to actually monitor the stream content; see also **early stopping**.

**Early stopping** is the broader pattern: examine the partial response as it streams and abort if it shows pathological signs (excessive repetition, format violations). Early stopping needs careful tuning — false positives cancel valid responses unnecessarily — but for high-volume endpoints with predictable output shapes it can save 10–20% of output cost.

**Output postprocessing** is everything you do to a completed response before returning it to the user — parsing, validation, redaction, formatting, error wrapping. Postprocessing doesn't reduce the *generation* cost (the tokens were already produced) but it can prevent costly retries and downstream errors. Always include `outcome` tagging here so the log line (Chapter 9) gets the right success/failure mark.

**Output validation** is the specific check that the response satisfies expected constraints (parsed correctly, fields present, values in range). Use **schema enforcement** — JSON Schema, Pydantic models, Zod schemas — rather than ad-hoc string matching.

#### Diagram: Output Control Settings and Their Effects

<iframe src="../../sims/output-control-settings/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Output Control Settings and Their Effects</summary>
Type: chart
**sim-id:** output-control-settings<br/>
**Library:** Chart.js<br/>
**Status:** Specified

Purpose: Show the distribution of output token counts under different output-control configurations (default, with max_tokens, with stop sequence, with concise instruction, all combined) so learners can see each setting's contribution.

Bloom Level: Analyze (L4)
Bloom Verb: differentiate

Learning objective: Differentiate the cost impact of each output-control setting and combine them effectively.

Chart type: Multiple histograms (small multiples)
- Each histogram: distribution of per-response output tokens for one configuration
- 5 histograms in a row: Baseline / +max_tokens=500 / +stop_sequence / +concise_instruction / +all combined

Below each histogram:
- Median output tokens
- Average cost per response
- Truncation rate (% of responses that hit max_tokens)

Interactive controls:
- Slider: max_tokens cap (100–4,000)
- Toggle each setting on/off
- Toggle: "Show truncation rate overlay"

Default state: All settings combined, max_tokens=500

Implementation: Chart.js multi-histogram, responsive grid
</details>

!!! mascot-tip "Always Cap Reasoning Budgets"
    <img src="../../img/mascot/tip.png" class="mascot-admonition-img" alt="Pemba sharing a tip">
    Reasoning models bill internal thinking at the output rate. An uncapped thinking budget can consume 30,000+ tokens of invisible deliberation on a single request — billed at \$15/MTok or higher. The cap is a one-line setting and the cost difference is often 10×. Of all the things in this chapter, this is the one to do today. Where did all the tokens go? Spoiler: into reasoning the model didn't really need.

## Putting It All Together

You can now spend output tokens deliberately. You design **routing policies** built around the **cheap-first cascade** pattern, with explicit **escalation triggers** and **confidence thresholds** at each **quality gate**, and **fallback models** for failure cases. You may apply **cross-vendor routing** for cost or capability arbitrage, behind a **vendor-neutral abstraction** that mitigates **vendor lock-in risk**. You drive **per-task model selection** with a **task classifier** or **difficulty estimation** step, and you measure **routing cost savings** against **routing quality risk** via the A/B framework from Chapter 12. On every request you bound output with the toolkit: **max tokens setting**, **stop sequence setting**, **length penalty**, **JSON schema output** with **schema enforcement**, **concise mode**, **verbosity parameter**, **reasoning budget**, **thinking token limit**, **reasoning effort setting**. You handle responses with **truncation detection**, **streaming cancellation**, **early stopping**, **output postprocessing**, and rigorous **output validation**.

Chapter 18 puts a per-session ceiling on the whole picture — agent budget policies that prevent runaway sessions from ever happening.

??? question "Quick Self-Check — Click to Reveal Answers"
    1. **Why does cheap-first cascading produce such large savings?** Most workloads have a long tail where the cheap model is fully adequate. Paying full price for the cheap call always and the expensive call only on escalation — typically 20% of requests — produces 50–80% cost reductions.
    2. **What's the difference between max_tokens and a stop sequence?** max_tokens caps total output length (truncates mid-sentence if hit). Stop sequences end generation cleanly at a specified string boundary. Use both — they serve different purposes.
    3. **Why is reasoning_budget critical for o-series and extended-thinking models?** Reasoning tokens are billed at the output rate. Uncapped reasoning can consume tens of thousands of invisible tokens per request — easily 10× the visible cost.
    4. **What is a vendor-neutral abstraction?** A shared interface in your code that maps to each vendor's specific SDK behind the scenes, so you can switch vendors without rewriting application code.
    5. **What's the right way to validate routed-cheap responses?** A quality gate that checks structure (schema), confidence (logprobs or uncertainty markers), and behavior (length, format). On gate failure, escalate to the next-tier model.

!!! mascot-celebration "End of Chapter 17"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Pemba celebrating">
    Routing and output bounded. Next chapter installs the safety net under the whole stack: agent budget policies that cap how much any session, engineer, or PR can spend.

# Token Optimization FAQ

This FAQ answers the questions engineers, technical leads, and FinOps practitioners ask most often when learning to measure and reduce the token cost of generative AI systems. Questions are grouped by category and progress from getting-oriented to advanced practice. Each answer links to the chapter or reference where the concept is developed in depth.

## Getting Started Questions

### What is this course about?

Token Optimization teaches you to measure, analyze, and reduce the cost of generative AI systems without sacrificing quality. It covers tokenization, per-vendor pricing, structured logging, observability dashboards, A/B testing of prompts and models, prompt caching, RAG tuning, model routing, agent budget policies, and batch APIs. The course is deliberately vendor-pluralistic — every concept is shown across the three major ecosystems engineers encounter today: Anthropic Claude, OpenAI, and Google Gemini. The curriculum closes with a capstone project where you instrument a real or simulated application end-to-end and demonstrate a measurable token reduction. See the full [course description](course-description.md) for prerequisites, learning outcomes, and the complete topic list.

### Who is this course for?

The primary audience is software engineers, machine learning engineers, platform engineers, technical leads, FinOps practitioners, and engineering managers responsible for the cost and performance of generative AI systems in production. The secondary audience is graduate students in computer science, data science, or information systems who want practical exposure to the economics of large language models. The material assumes you have used a chat-style LLM tool, can read JSON, and are comfortable on the command line — but it does not assume any prior background in transformer architecture or model training. See the [course description](course-description.md) for the full prerequisite list.

### What will I be able to do after finishing the course?

You will be able to instrument any LLM-using application with structured logging, build cost-per-feature and cost-per-user dashboards, run a controlled A/B test on prompts or models, configure prompt caching and verify cache hits, design a model-routing layer that escalates from cheap to expensive models on demand, and write an agent budget policy that prevents runaway sessions. You will also be able to author Skills that delegate deterministic work to scripts instead of generating it token by token. The full set of [Bloom's Taxonomy outcomes](course-description.md) is in the course description, organized by Remember, Understand, Apply, Analyze, Evaluate, and Create.

### What do I need to know before starting?

You need working knowledge of at least one programming language (Python is preferred because most code samples use the official vendor SDKs), familiarity with REST APIs and JSON, and basic command-line and Git skills. You should have used a chat-style LLM tool such as Claude, ChatGPT, or Gemini at least casually. Helpful but not required: experience with logging frameworks, cloud cost dashboards, or experiment-tracking tools. You do **not** need to know how transformers work internally — the course teaches the minimum mental model needed to reason about token economics. See [Chapter 1](chapters/01-llms-tokens-generation-basics/index.md) for that mental model.

### How is the textbook structured?

The textbook is organized into 20 chapters that progress from foundational mental models to advanced practice. Chapters 1–3 cover tokens, tokenization, and pricing economics. Chapters 4–6 walk through the three vendor ecosystems (Anthropic, OpenAI, Google). Chapters 7–8 cover coding harnesses and the Skills system. Chapters 9–11 cover structured logging, observability, and log file analysis. Chapter 12 covers A/B testing methodology. Chapters 13–18 cover the major optimization levers: prompt engineering, prompt caching, RAG tuning, context window management, routing, and agent budgets. Chapter 19 covers batch APIs and privacy. Chapter 20 is the capstone. Browse the [chapter index](chapters/index.md) to jump to any chapter.

### How long does it take to complete the course?

The textbook is sized for a one-semester graduate course or a four-to-six-week self-paced study at roughly 6–10 hours per week. Each chapter is designed to be readable in a single sitting, with embedded MicroSims and quizzes that reinforce the concepts. The capstone project in [Chapter 20](chapters/20-capstone-projects-practice/index.md) is the largest single time investment — plan for 15–25 hours including instrumentation, A/B testing, and the final report.

### What makes this course different from other LLM courses?

Most LLM courses focus on capability — what models can do — and treat cost as an afterthought. This course inverts that. It treats token cost as a first-class engineering concern, gives you the measurement and optimization tools to drive it down systematically, and refuses to recommend a single vendor. The vendor-pluralistic stance is deliberate: real production systems often mix Anthropic, OpenAI, and Google calls, and the optimization patterns differ enough to matter. See the [course description](course-description.md) for the topics not covered (model training, GPU optimization, image/audio generation).

### Do I need to pay for API access to follow along?

You will get the most out of the course by running the code examples against real APIs, but the per-example cost is small — typically a few cents per chapter exercise. The optimization-focused exercises in Chapters 13–18 are designed to be run on the cheapest tier of each vendor (Claude Haiku, GPT-4o-mini, Gemini Flash), where a full chapter's worth of experiments costs well under one dollar. The batch API exercises in [Chapter 19](chapters/19-batch-privacy-compliance/index.md) cost half of that thanks to the batch discount. The capstone can be sized to your own budget.

### How do I navigate the textbook?

The left sidebar lists all chapters in order. The right sidebar lists section headers within the current chapter. Cross-references inside the text link to other chapters, the [glossary](glossary.md), or relevant MicroSims. Use the search box at the top of every page to jump to any concept by name. The [learning graph](learning-graph/index.md) shows the dependency structure of all 475 concepts in the course — useful when you want to see what depends on what.

### What is a MicroSim and why does this textbook have so many?

A MicroSim is a small, browser-based interactive simulation embedded directly in a chapter — usually built with p5.js or Chart.js — that lets you manipulate the parameters of a concept and see the result update in real time. Where a static diagram shows one cache hit rate, a MicroSim lets you slide the cache TTL and watch the hit rate change. They exist because token economics is full of nonlinear effects (cache hit rates, batch discounts, output premiums) that are easier to feel than to read about. Browse the full set in the [sims index](sims/index.md).

### Where do I find definitions of technical terms?

The [glossary](glossary.md) defines every technical term used in the textbook — over 580 entries covering tokens, pricing, APIs, harnesses, observability, statistics, and more. Each glossary entry includes a one-sentence definition and a concrete example. When you see an unfamiliar term in a chapter, search the glossary first. If a term is used only briefly in one chapter, the chapter usually defines it inline.

### Who is Pemba and why is there a red panda on every page?

Pemba is the textbook's mascot — a russet-and-cream red panda with wire-rim engineer's glasses who appears in admonition boxes throughout the chapters to flag key concepts, common mistakes, and worth-celebrating wins. The red panda was chosen because red pandas eat one bamboo leaf at a time, savoring it, which is exactly how good token engineering works: small, deliberate choices compound into systems that ship and stay shipped. Pemba's catchphrase is "Every token counts — and counting is fun." See the [mascot style guide](learning-graph/mascot-test.md) for the full character bible.

## Core Concepts

### What is a token?

A token is the atomic unit a large language model reads and writes. It is not a character and not a word — it is a chunk of text produced by the model's tokenizer, typically corresponding to a common word, a frequent prefix or suffix, a punctuation mark, or a fragment of a less-frequent word. English prose averages roughly four characters per token, so a 1,000-word page is around 1,300 tokens. Models bill in tokens, not characters or words, which is why understanding tokenization is the first step in cost engineering. See [Chapter 1](chapters/01-llms-tokens-generation-basics/index.md) for the full mental model and [Chapter 2](chapters/02-sampling-tokenization-embeddings/index.md) for the byte-pair encoding details.

### What is the difference between input tokens and output tokens?

Input tokens are everything you send to the model: the system prompt, prior conversation turns, the current user message, retrieved context, tool definitions, and tool results. Output tokens are everything the model generates back, including the visible answer and any thinking or tool-call content it produces. The distinction matters because **output tokens are billed at a higher rate than input tokens** on every major vendor — typically three to five times the input rate. This is the single most important pricing fact in the course. See [Chapter 3](chapters/03-pricing-economics-async-apis/index.md) for the full pricing model.

### Why are output tokens more expensive than input tokens?

Output tokens are autoregressive: the model must generate each one sequentially, conditioned on every previous token, and it cannot batch the work or run it in parallel within a single response. Input tokens, in contrast, can be processed in a single forward pass. The compute and latency profile of generation is therefore much heavier per token, and vendors price accordingly. This is why **output length controls** like `max_tokens` and concise-output instructions are some of the highest-ROI optimizations available. See [Chapter 17](chapters/17-routing-output-control/index.md) for the full set of output controls.

### What is a context window?

A context window is the maximum total number of tokens — input plus output — that a model can process in a single request. Different models have different limits: 200K tokens is common for current Claude and GPT models, while Gemini Pro extends to 1 million tokens. The context window is a hard ceiling: if you exceed it, the request fails outright. It is also a soft cost ceiling, because long contexts get expensive fast — a 100K-token input billed at \$3 per million costs \$0.30 per call before the model writes a single output token. See [Chapter 16](chapters/16-context-window-management/index.md) for compaction and sliding-window strategies.

### What is prompt caching?

Prompt caching is a vendor feature that lets you mark stable prefixes of a prompt — typically a long system prompt, a tool definition list, or a retrieved-document block — so the vendor stores the prefilled state and reuses it on subsequent requests that share the same prefix. Cached input tokens bill at roughly 10% of the normal input rate on Anthropic, with similar discounts on OpenAI and Gemini. For high-volume features that share a long static prefix, prompt caching can cut steady-state cost by an order of magnitude. It is the single highest-leverage optimization in this textbook. See [Chapter 14](chapters/14-prompt-caching-patterns/index.md) for cache key design, hit-rate measurement, and the invariants that silently break caching.

### What is a tokenizer and why does it matter?

A tokenizer is the algorithm that converts text into the integer token IDs the model actually sees. Each model family has its own tokenizer, trained on its own corpus, and the same English sentence can produce different token counts on different vendors — sometimes by 20% or more. This matters because (1) you bill on the destination vendor's tokenizer, not a generic one, so cross-vendor cost comparisons require care, and (2) **tokenizer drift** can quietly inflate cost when you migrate between vendors. See [Chapter 2](chapters/02-sampling-tokenization-embeddings/index.md) for the byte-pair-encoding mechanics and the per-vendor tokenizer comparison.

### What is byte-pair encoding?

Byte-pair encoding (BPE) is the most common tokenization algorithm used by current LLMs. It starts from individual bytes and iteratively merges the most frequent adjacent pairs in a training corpus, producing a vocabulary of common subwords. The result is that frequent words get one token, rarer words get split into two or three tokens, and unusual sequences (long URLs, dense code, non-English scripts) get split into many. BPE is why a 1,000-character English paragraph is roughly 250 tokens but a 1,000-character base64 string can be 700+ tokens. See [Chapter 2](chapters/02-sampling-tokenization-embeddings/index.md) for the full algorithm and worked examples.

### What is a system prompt?

A system prompt is the instruction block that appears at the start of every request and tells the model who it is, how to behave, what tools it has, and what constraints to respect. It is sent on every request, so a bloated 4,000-token system prompt that says "be helpful" silently multiplies the cost of every call. System prompt hygiene — pruning dead context, compressing instructions, removing redundant boilerplate — is one of the highest-leverage cheap optimizations. See [Chapter 13](chapters/13-prompt-engineering-tokens/index.md) for prompt engineering techniques and [Chapter 14](chapters/14-prompt-caching-patterns/index.md) for caching long system prompts.

### What is the difference between a prompt and a conversation?

A prompt is a single request to the model — a system prompt plus a user message plus any context. A conversation is a sequence of prompts and responses where each new request includes the full prior history as input. This is the **silent compounding cost** of multi-turn dialogue: every assistant turn adds to the input token count of every subsequent turn, so an agent on its tenth iteration is paying input-token cost on the entire prior history each time. See [Chapter 16](chapters/16-context-window-management/index.md) for compaction strategies that bound this growth.

### What is an AI coding harness?

An AI coding harness is an interactive tool that wraps a language model with file-system access, shell execution, and editor controls so the model can read, modify, and ship code in a developer's environment. The three covered in this course are **Claude Code** (Anthropic), **OpenAI Codex CLI** (OpenAI), and **Google Antigravity** (Google). Each layers a system prompt, a tool loop, and session state on top of the underlying model — and each generates dramatically more tokens per task than a plain chat call, because the agentic loop replays history on every iteration. See [Chapter 7](chapters/07-coding-harnesses-agentic-loops/index.md) for the full comparison.

### What is an agentic loop?

An agentic loop is the control structure in which a model issues a tool call, the harness executes it, results return, and the model issues the next call, iterating until a stop condition is met. Each iteration replays the entire prior history as input — meaning a ten-iteration loop pays input-token cost ten times for the same context. This is where token spend silently compounds, and it is why **agent budget policies** (covered in [Chapter 18](chapters/18-agent-budget-policies/index.md)) are non-negotiable in production.

### What is a Skill?

A Skill is a unit of harness-loaded capability comprising a short trigger description, a markdown body, and optionally bundled scripts and assets. Only the trigger description sits in the model's context window at all times; the body and scripts are loaded on demand when the harness decides the Skill is relevant. This design keeps baseline context cost low while still giving the model access to a large library of capabilities. Moving deterministic prose inside a Skill into shell or Python scripts can typically reduce per-invocation token usage by roughly 30%. See [Chapter 8](chapters/08-skills-system/index.md) for the full Skills architecture.

### How does a harness decide which Skill to invoke?

The harness reads only the short trigger descriptions of every Skill in its library — not the full bodies — and the model selects which Skill matches the current task based on those descriptions. The selected Skill's body is then lazy-loaded into context. This is why the trigger description must be specific enough to fire reliably (avoid false negatives) and short enough to keep baseline context cost low. Skill misfires — Skills loaded but not used, or needed but not loaded — show up directly as wasted tokens in the session log. See [Chapter 8](chapters/08-skills-system/index.md) for trigger-description authoring patterns.

### What is structured logging for LLM calls?

Structured logging is the practice of emitting a single JSON log line per LLM call containing model, prompt hash, input tokens, output tokens, cached tokens, latency, cost, feature tag, user identifier, and outcome. The log line is the source of truth for every downstream cost question — you cannot build a cost dashboard, run an A/B test, or attribute spend to a feature without it. Privacy-safe variants redact or hash the prompt itself while keeping the metadata. See [Chapter 9](chapters/09-structured-logging/index.md) for the canonical schema.

### What is cost attribution?

Cost attribution is the process of taking a stream of raw token-cost events and rolling them up by feature, user, model, prompt template, or business outcome — answering questions like "which feature is the most expensive per active user?" or "which prompt template is responsible for last week's spend spike?" Without attribution, you only know the bill total; with it, you know where to optimize. See [Chapter 10](chapters/10-observability-dashboards-alerting/index.md) for dashboard design and [Chapter 11](chapters/11-log-file-analysis/index.md) for ad-hoc analysis patterns.

### What is the cost-quality tradeoff?

The cost-quality tradeoff is the empirical relationship between how much you spend on a task and how well the task gets done. Cheaper models, shorter prompts, and tighter context all reduce cost — and at some point reduce quality. The job of an optimization engineer is to find the **Pareto frontier**: the set of configurations where you cannot reduce cost without losing quality, and cannot improve quality without spending more. Inside the frontier, money is being wasted. See [Chapter 12](chapters/12-ab-testing-methodology/index.md) for the A/B testing framework that lets you measure this rigorously.

### What is A/B testing in the context of prompts and models?

A/B testing for LLMs is a controlled experiment that splits live traffic between a control variant (the current prompt or model) and a treatment variant (the proposed change) and measures cost, quality, latency, and satisfaction on each. The output is a statistically defensible answer to "did the change make things better or worse?" — separating real cost reductions from noise, and catching quality regressions that a developer's eye-test would miss. See [Chapter 12](chapters/12-ab-testing-methodology/index.md) for hypothesis design, sample size calculation, and stopping rules.

### What is RAG and how does it affect cost?

Retrieval-Augmented Generation (RAG) is a pattern where a retrieval system finds relevant documents and injects them into the prompt as context before the model generates an answer. RAG pushes cost in two directions: it adds input tokens (the retrieved chunks), and it sometimes reduces output tokens (because the model doesn't need to hallucinate as much). The cost-optimization questions for RAG are therefore: how big should chunks be, how many should be retrieved (top-k), and which retrieved chunks should be dropped because they don't actually help the answer? See [Chapter 15](chapters/15-rag-optimization/index.md).

### What is model routing?

Model routing is a pattern where a request is first classified by difficulty or task type, then sent to the cheapest model that can handle it — typically a small fast model like Claude Haiku, GPT-4o-mini, or Gemini Flash — with an escalation path to a larger model when confidence is low. A well-tuned routing layer often delivers 60–80% cost savings on workloads where most requests are easy and only a few need the expensive model. See [Chapter 17](chapters/17-routing-output-control/index.md) for cheap-first cascades and confidence-based fallbacks.

### What is a batch API?

A batch API is an asynchronous endpoint where you submit many requests at once and receive results within a vendor-specified window — typically 24 hours for Anthropic, OpenAI, and Google — in exchange for a 50% discount on token cost. Batch APIs are ideal for any workload that doesn't need real-time response: nightly classification, bulk evaluation, embedding generation, offline analysis. The batch discount alone can pay for an entire optimization initiative. See [Chapter 19](chapters/19-batch-privacy-compliance/index.md).

### What is an agent budget policy?

An agent budget policy is a documented set of limits on agent token consumption — per session, per tool call, per repository, per pull request — enforced by the harness or middleware. Without a policy, a single misbehaving agent can run up four-figure bills overnight. With one, the same agent gracefully degrades when the budget is exhausted: it summarizes, reports, or stops, instead of looping. See [Chapter 18](chapters/18-agent-budget-policies/index.md) for policy design and graceful-degradation patterns.

### What is a cache hit rate?

A cache hit rate is the fraction of input tokens served from prompt cache rather than billed at the full input rate. It is the single most important health metric for any application that uses prompt caching. A target hit rate above 80% is achievable for features with a long stable prefix; a hit rate below 50% usually indicates that something — model identifier, tool list, system prompt revision — is silently invalidating the cache key. See [Chapter 14](chapters/14-prompt-caching-patterns/index.md) for cache invariant debugging.

### What is the difference between synchronous, streaming, and batch modes?

**Synchronous** mode sends a request and waits for the full response before returning — simplest, used for short calls. **Streaming** mode returns output tokens as they generate, allowing UIs to display partial results — same cost as synchronous but better perceived latency. **Batch** mode submits many requests at once for asynchronous processing within a delivery window — half the cost but minutes-to-hours of latency. The choice is driven by latency requirements, not cost alone. See [Chapter 3](chapters/03-pricing-economics-async-apis/index.md) and [Chapter 19](chapters/19-batch-privacy-compliance/index.md).

### What does it mean to be vendor-pluralistic?

Vendor-pluralistic means the course gives equal weight to Anthropic Claude, OpenAI, and Google Gemini, and teaches you patterns that work across all three rather than betting on one. Production systems often mix vendors — using one for cheap classification, another for long-context, a third for code — and the cost-optimization patterns differ enough to require fluency in all of them. See [Chapter 4](chapters/04-anthropic-claude-ecosystem/index.md), [Chapter 5](chapters/05-openai-ecosystem/index.md), and [Chapter 6](chapters/06-google-gemini-ecosystem/index.md) for the vendor-specific deep dives.

### What is the relationship between latency, cost, and quality?

These three form a triangle that no single configuration optimizes simultaneously. A bigger model is usually higher quality but higher cost and higher latency. A streaming response feels faster but costs the same. A batch job is cheap but slow. The optimization engineer's job is to know which corner the current product needs and configure accordingly — and to **measure all three** so you can defend the tradeoff. See [Chapter 12](chapters/12-ab-testing-methodology/index.md) for the metric framework.

### What is observability in the context of LLM systems?

Observability is the practice of designing your system so that any cost, quality, or performance question can be answered from emitted telemetry — logs, metrics, traces — without needing to redeploy. For LLM systems specifically, this means structured per-request logs, dashboards rolled up by feature and user, and alerts that fire when burn rate, cache hit rate, or error rate cross a threshold. See [Chapter 10](chapters/10-observability-dashboards-alerting/index.md).

### What is the difference between a chat completion and an agent?

A chat completion is a single round-trip: you send a prompt, the model returns text. An agent is a loop: the model returns a tool call, the harness executes it, the result feeds back, and the model decides what to do next — possibly for many iterations. The cost profile is dramatically different. A single chat completion is bounded by `max_tokens`; an agent's cost is bounded by the budget policy, the loop iteration limit, or — if you have neither — your credit card limit. See [Chapter 7](chapters/07-coding-harnesses-agentic-loops/index.md).

## Technical Detail Questions

### How do I count tokens before sending a request?

Each vendor provides a tokenizer you can call locally or via an API. For OpenAI, use the `tiktoken` library. For Anthropic, use the `client.messages.count_tokens` endpoint or the official SDK helper. For Google Gemini, use the `count_tokens` method on the model object. Counting tokens before sending lets you reject oversize requests early, choose between cheap and expensive models on the fly, and verify that prompt-compression changes actually reduced token count. See [Chapter 2](chapters/02-sampling-tokenization-embeddings/index.md) for code examples for each vendor.

### What fields should a structured LLM log line contain?

The canonical schema is: `model`, `prompt_hash`, `input_tokens`, `output_tokens`, `cached_tokens`, `latency_ms`, `cost_usd`, `feature`, `user_id` (hashed), `outcome`, `trace_id`, and `request_id`. Optional but useful: `session_id`, `prompt_template_id`, `tool_call_count`, and `stop_reason`. The schema must support cost attribution by every dimension you care about — feature, user, model, template — so leaving out a field means losing the ability to ask that question later. See [Chapter 9](chapters/09-structured-logging/index.md) for the full schema and [Chapter 10](chapters/10-observability-dashboards-alerting/index.md) for how the schema drives dashboard design.

### How does prompt caching work in the Anthropic API?

You mark a content block in a Claude Messages API request with `cache_control: {"type": "ephemeral"}`. Anthropic stores the prefilled key-value cache for that prefix for roughly five minutes (or longer with the one-hour TTL option). Subsequent requests whose content begins with the exact same prefix bill the cached portion at roughly 10% of the input rate. The response's `usage` object reports `cache_creation_input_tokens` and `cache_read_input_tokens` so you can verify hits. See [Chapter 4](chapters/04-anthropic-claude-ecosystem/index.md) for the API mechanics and [Chapter 14](chapters/14-prompt-caching-patterns/index.md) for cross-vendor cache patterns.

### What are the published per-million-token prices?

Prices change frequently, so always check the vendor's current pricing page before quoting numbers. As a rough mental model used throughout this textbook: small/fast tier (Haiku, GPT-4o-mini, Gemini Flash) is roughly \$0.25–\$1 per million input tokens; mid tier (Sonnet) is roughly \$3 per million input tokens; large tier (Opus, Gemini Ultra) is roughly \$15 per million. Output tokens are 3–5x the input rate. Cached input is roughly 10% of the input rate. See [Chapter 3](chapters/03-pricing-economics-async-apis/index.md) for the full pricing model with worked unit-economics examples.

### What does the response usage object look like across vendors?

**Anthropic Claude** returns `usage.input_tokens`, `usage.output_tokens`, `usage.cache_creation_input_tokens`, and `usage.cache_read_input_tokens`. **OpenAI** returns `usage.prompt_tokens`, `usage.completion_tokens`, and `usage.total_tokens`, with `prompt_tokens_details.cached_tokens` for cached requests. **Google Gemini** returns `usageMetadata.promptTokenCount`, `usageMetadata.candidatesTokenCount`, and `usageMetadata.totalTokenCount`. The field names differ, the semantics align — this is one of the first things any vendor-neutral logging layer must reconcile. See [Chapter 9](chapters/09-structured-logging/index.md).

### What is the difference between `max_tokens` and a stop sequence?

`max_tokens` is a hard upper bound on output tokens — the model is forced to stop generation when it hits the limit, even mid-sentence. A stop sequence is a token pattern that, when generated, causes the model to stop cleanly — typically a delimiter like `</answer>` or `\n\nUser:`. Use `max_tokens` as a safety belt against runaway generation; use stop sequences for graceful structural termination. They are complementary, not alternatives. See [Chapter 17](chapters/17-routing-output-control/index.md).

### How does extended thinking affect token cost?

Extended thinking (the visible reasoning step that Claude, OpenAI o-series, and Gemini Flash-Thinking can emit) generates **reasoning tokens** that are billed at the output rate. The reasoning content is not visible to your end user but appears in the output token count. A thinking-heavy response can easily be 5–10x the cost of a non-thinking response on the same task, so extended thinking should be reserved for problems where the quality lift is worth it — and the thinking-token budget should be capped explicitly. See [Chapter 4](chapters/04-anthropic-claude-ecosystem/index.md) and [Chapter 17](chapters/17-routing-output-control/index.md).

### What is JSON mode and how does it change cost?

JSON mode (or structured outputs) is a vendor feature that constrains generation to valid JSON conforming to a supplied schema. It does not change the per-token price but typically reduces output tokens because the model cannot pad with prose, and it eliminates the cost of retry-on-parse-failure loops. The schema itself adds input tokens, so on small calls the net is sometimes a wash; on calls with non-trivial output it is a clear win. See [Chapter 5](chapters/05-openai-ecosystem/index.md) for the OpenAI structured-outputs API.

### What is the difference between Claude Haiku, Sonnet, and Opus?

The three are the small, mid, and large tiers of the Claude model family. Haiku is the fastest and cheapest, suitable for classification, extraction, and routing. Sonnet is the workhorse mid tier, suitable for most production reasoning tasks. Opus is the largest, suitable for hard reasoning where capability matters more than cost. Pricing ratios are roughly Haiku 1x : Sonnet 12x : Opus 60x on the input rate. See [Chapter 4](chapters/04-anthropic-claude-ecosystem/index.md).

### What is the difference between GPT-4o, GPT-4o-mini, and the o-series?

GPT-4o is OpenAI's flagship general-purpose model. GPT-4o-mini is the small/fast variant for routing and high-volume work. The **o-series** (o1, o3, etc.) are reasoning models that use extended internal thinking and bill those thinking tokens at the output rate — they cost more per call but solve harder problems. See [Chapter 5](chapters/05-openai-ecosystem/index.md) for the full family map.

### What is the difference between Gemini Pro, Flash, and Ultra?

Gemini Flash is the small/fast tier (analogous to Haiku and GPT-4o-mini). Gemini Pro is the mid tier with the one-million-token context window. Gemini Ultra is the largest tier. The defining Gemini feature is the long context window — Pro reliably handles a million input tokens, which makes it the natural choice for long-document analysis when the cost can be justified. See [Chapter 6](chapters/06-google-gemini-ecosystem/index.md).

### What is OpenTelemetry and should I use it for LLM logging?

OpenTelemetry (OTel) is a vendor-neutral observability standard with conventions for LLM call instrumentation under the `gen_ai` semantic conventions. Using OTel means your traces, metrics, and logs work with any compliant backend (Honeycomb, Datadog, Grafana Tempo, etc.) and you avoid lock-in to a single observability vendor. The OTel LLM conventions cover most of the canonical log schema fields out of the box. See [Chapter 9](chapters/09-structured-logging/index.md).

### What is a prompt hash and why log it?

A prompt hash is a stable hash (typically SHA-256, truncated to 16 hex characters) of the full prompt content, computed before the request goes out and stored as a log field. It lets you group and aggregate by prompt without storing the prompt text itself — useful for cost attribution by template, for finding duplicate requests, and for keeping logs privacy-safe. Two requests with the same hash had identical input. See [Chapter 9](chapters/09-structured-logging/index.md).

### What is a sample size calculation for an A/B test?

A sample size calculation determines how many requests each variant needs to detect a true effect of a given size with a given confidence. The inputs are baseline metric value, minimum detectable effect, statistical power (typically 0.8), and significance level (typically 0.05). Without a sample size calculation, you risk **stopping too early** (declaring a winner that's actually noise) or **running too long** (paying for traffic you didn't need). See [Chapter 12](chapters/12-ab-testing-methodology/index.md) for the full framework and a worked calculator.

### What is the difference between statistical power and statistical significance?

Statistical significance (p-value) is the probability of observing your result if the variants were actually identical — a low p-value means the result is unlikely to be noise. Statistical power is the probability of detecting a true effect of a given size — high power means a real win is unlikely to be missed. Significance protects against false positives; power protects against false negatives. A good A/B test is designed for both. See [Chapter 12](chapters/12-ab-testing-methodology/index.md).

### What is a guardrail metric?

A guardrail metric is a secondary measurement on an A/B test that protects against improvements in the primary metric coming at the cost of something you also care about. If your primary metric is cost-per-request, your guardrail metrics are typically quality and latency — a 30% cost reduction that drops quality 10% is not a win. Guardrails are non-negotiable for any cost-focused experiment. See [Chapter 12](chapters/12-ab-testing-methodology/index.md).

### What is a P95 token usage and why log it?

P95 is the 95th percentile of a distribution — the value below which 95% of observations fall. P95 input tokens tells you what your "long tail" requests look like, which is often where runaway agents and pathological prompts hide. The mean is misleading because a few 200K-token requests pull it way up; P50 hides them entirely; P95 surfaces them honestly. Log P50, P95, and P99 for every cost-relevant metric. See [Chapter 11](chapters/11-log-file-analysis/index.md).

### What is the difference between embeddings and tokens?

Tokens are the integer IDs the model reads and writes. Embeddings are dense floating-point vectors (typically 1,536 to 3,072 dimensions) produced by an embedding model from text. Embeddings are how RAG systems do semantic search — you embed the query, find the nearest-neighbor document chunks, and inject them as context. Embeddings are billed in tokens (the input text being embedded) but at a separate, usually cheaper, embedding-model rate. See [Chapter 2](chapters/02-sampling-tokenization-embeddings/index.md) and [Chapter 15](chapters/15-rag-optimization/index.md).

### What is reranking in RAG?

Reranking is a second-pass scoring step in a RAG pipeline: the initial retrieval (typically vector search or BM25) returns the top 50–100 candidates, then a heavier cross-encoder reranker scores each candidate against the query and keeps only the top 3–5 to inject into the prompt. Reranking dramatically improves retrieval precision, which in turn lets you inject fewer chunks — meaning lower input-token cost without losing quality. See [Chapter 15](chapters/15-rag-optimization/index.md).

### What is conversation compaction?

Conversation compaction is the practice of replacing the older portion of a long conversation with a shorter summary so the total context stays under a target size. **Auto-compaction** (the harness does it on a threshold) is convenient but lossy. **Manual compaction** (the user or a Skill summarizes explicitly) is precise but requires intervention. Either way, compaction is non-optional for any agent session that runs longer than a few dozen turns. See [Chapter 16](chapters/16-context-window-management/index.md).

## Common Challenge Questions

### Why is my prompt cache hit rate lower than expected?

The most common cause is a silently invalidated cache key. Anthropic prompt caching requires the cached prefix to be **byte-identical** across requests, and any of the following will break it: a changed model ID, a reordered tool list, a date or timestamp in the system prompt, a non-deterministic JSON serialization that reorders keys, or a tool definition added at the start instead of the end. Print and diff the actual bytes of the prefix between two requests that should hit. See [Chapter 14](chapters/14-prompt-caching-patterns/index.md) for the full debugging checklist.

### Why is my agent session running up huge bills overnight?

The standard diagnosis is a pathological agent loop: the model is stuck repeating roughly the same tool call, each iteration replaying the entire prior context as input. Look at the session log for tool call iteration count, the diversity of tool arguments across iterations, and the input-token growth curve. The structural fix is an **agent budget policy** with a per-session token cap, a loop iteration limit, and a wall-clock limit. Patching the prompt is rarely sufficient. See [Chapter 18](chapters/18-agent-budget-policies/index.md).

### Why does my OpenAI bill not match my Anthropic bill on the same task?

The two most likely causes are tokenizer drift (the same English text tokenizes to different counts on different vendors) and output verbosity differences (the same instruction can produce a 200-token answer on one model and an 800-token answer on another). Always compare on **cost-per-successful-outcome**, not cost-per-call. See [Chapter 2](chapters/02-sampling-tokenization-embeddings/index.md) for tokenizer drift and [Chapter 12](chapters/12-ab-testing-methodology/index.md) for the outcome-based comparison framework.

### Why are my cached tokens being charged at full rate?

Either the cache entry has expired (the default Anthropic TTL is roughly five minutes between writes/reads on the same prefix), or the cache key has been silently invalidated. Check the response `usage` object: `cache_read_input_tokens` is the count actually served from cache; everything else billed as `input_tokens` was either uncacheable or a cache miss. Cache writes themselves cost slightly more than uncached input — so the first request after a TTL expiry pays a premium. See [Chapter 14](chapters/14-prompt-caching-patterns/index.md).

### Why do my A/B test results keep flipping?

Almost always: insufficient sample size, a peeking-at-the-data problem, or a novelty effect. **Insufficient sample size** means your observed difference is within the noise floor — recompute power for the effect size you actually saw. **Peeking** means you keep checking the result and stopping when it looks good — fix this with a pre-registered stopping rule. **Novelty effect** means user behavior changes when something new appears and reverts after a few days — let the test run past the novelty window. See [Chapter 12](chapters/12-ab-testing-methodology/index.md).

### Why is my context window full when I haven't sent that much text?

A multi-turn agent session accumulates the full conversation history on every request. Add a 4,000-token system prompt, ten user messages, ten assistant responses, and a few tool-call/result pairs, and you can hit 50,000 tokens of input on the eleventh turn — even if each individual message was small. The structural fix is **conversation compaction** plus a **per-session token budget**. See [Chapter 16](chapters/16-context-window-management/index.md) and [Chapter 18](chapters/18-agent-budget-policies/index.md).

### Why is my Skill not loading when I expect it to?

The most common cause is a **trigger description that's too generic** — the harness can't tell when the Skill is relevant, so it loads the Skill on irrelevant tasks (false positives) or fails to load it when needed (false negatives). The fix is to rewrite the trigger description with specific keywords, file types, or task verbs that actually distinguish this Skill's domain from others. See [Chapter 8](chapters/08-skills-system/index.md) for trigger-description patterns.

### Why are my output tokens so much higher than my input tokens?

Either the model is genuinely producing a lot of content (long answers, code generation, JSON output), or the model is using extended thinking — which generates reasoning tokens billed at the output rate. Check the response `usage` for a thinking-token field. The fix is some combination of: a `max_tokens` cap, a "be concise" instruction in the system prompt, a smaller reasoning budget, or routing easier requests to a non-thinking model. See [Chapter 17](chapters/17-routing-output-control/index.md).

### Why does my RAG pipeline cost so much per query?

Usually too many chunks at too large a size. Top-k=20 chunks at 1,000 tokens each is 20,000 input tokens injected on every query — and most of those chunks aren't actually used to answer. The fix is a tighter retrieval pipeline: smaller chunks, smaller top-k, a reranker that lets you keep only the top 3–5, and **context pruning** that drops chunks whose retrieval score is below a quality threshold. See [Chapter 15](chapters/15-rag-optimization/index.md).

### Why does my cost dashboard show a spike at 2 AM every day?

Common culprits: a nightly batch job running on the synchronous API instead of the batch API; a scheduled re-index that re-embeds the full corpus; an agent that's stuck retrying after a vendor rate limit. The investigation pattern is to slice the spike by feature, then by user, then by model. See [Chapter 11](chapters/11-log-file-analysis/index.md) for log analysis patterns and [Chapter 10](chapters/10-observability-dashboards-alerting/index.md) for alerting on this kind of pattern proactively.

### Why is my batch job sitting in pending forever?

Each vendor has its own batch processing window — Anthropic and OpenAI typically deliver within 24 hours but can take longer under load; Gemini batch mode has its own SLA. Check the batch job status object for an explicit error. Common failure modes: a malformed request line in the batch (the whole job is rejected), an exceeded per-job request count, or a vendor-side queue depth issue. See [Chapter 19](chapters/19-batch-privacy-compliance/index.md).

### Why does my prompt sometimes hit the cache and sometimes miss?

Look for any per-request variability in the cached prefix: a timestamp, a request ID, a user ID, a randomized few-shot order, a tool list whose order depends on a Python dict's iteration order. Cache invariants are the silent killer of hit rate — a single byte difference is a cache miss. Lock the prefix down with deterministic serialization and remove any per-request content from it. See [Chapter 14](chapters/14-prompt-caching-patterns/index.md).

## Best Practice Questions

### When should I use prompt caching?

Whenever you have a stable prefix of at least 1,024 tokens (the typical Anthropic minimum) that gets reused across multiple requests within a few minutes. Strong fits: a long system prompt shared by all users of a feature; a tool-definition list shared by all calls in a session; a retrieved document block reused across follow-up questions. Weak fits: prompts that change every request, single-shot calls, or prefixes shorter than the minimum. See [Chapter 14](chapters/14-prompt-caching-patterns/index.md) for the full decision matrix.

### When should I use a batch API instead of synchronous calls?

Whenever the workload tolerates hours of latency. Strong fits: nightly classification, bulk evaluation runs, embedding generation, offline analysis, large-scale data labeling. Weak fits: any user-facing path where someone is waiting for a response. The 50% discount on batch is large enough that "could this run on batch?" should be a question you ask of every recurring workload. See [Chapter 19](chapters/19-batch-privacy-compliance/index.md).

### When should I escalate from a cheap model to an expensive one?

When the cheap model's confidence is low, when the task is detected as hard at routing time, or when a downstream quality check fails. The escalation rule should be **explicit and measurable** — "escalate when the classifier confidence is below 0.7" or "escalate when the JSON schema validation fails twice." Never escalate "just to be safe" on every request, or the expensive model becomes the de facto floor. See [Chapter 17](chapters/17-routing-output-control/index.md).

### How do I write a good Skill trigger description?

Make it specific enough that the model can tell when the Skill is relevant from the description alone, and short enough that it doesn't bloat the always-loaded context. Lead with the task verbs ("generate", "validate", "deploy"), name the artifact types ("p5.js MicroSim", "structured log line", "A/B test report"), and avoid generic adjectives. Test the trigger description against a sample of representative tasks and measure false-positive and false-negative rates. See [Chapter 8](chapters/08-skills-system/index.md).

### How do I bound an agent session's cost?

Set an explicit **per-session token budget**, an explicit **loop iteration limit**, and an explicit **wall-clock limit**, then write a graceful-degradation handler that fires when any of the three is exhausted — the agent should summarize its progress and stop, not silently fail or keep looping. Layer this at the harness level, not just the prompt level: a budget enforced only by instructing the model in the system prompt is a budget the model can ignore. See [Chapter 18](chapters/18-agent-budget-policies/index.md).

### How do I choose between Anthropic, OpenAI, and Google for a given task?

Run a controlled benchmark on **your own task** with a fixed evaluation set and measure cost-per-successful-outcome, latency P95, and quality, then choose. Public benchmarks rank models on tasks that may not match yours, and vendor pricing alone doesn't capture the verbosity differences. The course's vendor-pluralistic stance exists precisely because the right answer for one team is the wrong answer for another. See [Chapter 12](chapters/12-ab-testing-methodology/index.md) for the benchmark framework.

### How do I keep my LLM logs privacy-safe?

Hash user identifiers before logging. Redact known PII patterns (email, phone, SSN) from prompt content before logging — or skip logging the prompt content entirely and log only the prompt hash. Log only what cost attribution actually needs: model, token counts, latency, cost, feature, hashed user ID, outcome. Apply a retention policy that deletes logs after the cost-investigation window closes (typically 90 days). See [Chapter 19](chapters/19-batch-privacy-compliance/index.md).

### How do I refactor a prose-heavy Skill into a script-backed one?

Identify the deterministic portions of the Skill — input validation, file generation, formatting, calculations — and move them into a bundled shell or Python script that the Skill calls. Keep in the model-facing prose only the parts that genuinely require model judgment: design decisions, narrative explanations, ambiguous parsing. Measure tokens before and after on a representative task; the target is roughly 30% reduction. See [Chapter 8](chapters/08-skills-system/index.md).

### How do I run a credible A/B test on a prompt change?

Pre-register the hypothesis, primary metric, guardrail metrics, sample size, and stopping rule **before** turning on the experiment. Split traffic randomly. Wait for the planned sample size before peeking. Report effect size with a confidence interval, not just a p-value. If the result is null, accept it instead of mining for a subgroup that "won." See [Chapter 12](chapters/12-ab-testing-methodology/index.md).

### How do I attribute cost to features?

Tag every LLM call with a `feature` field at emit time — never try to attribute cost to features by parsing the prompt content after the fact. The tag is set by the calling code (usually a thin wrapper around the SDK) and travels through the log pipeline to the dashboard. Without the tag, attribution is an unbounded archaeology project; with it, attribution is a single GROUP BY. See [Chapter 9](chapters/09-structured-logging/index.md).

### How do I know if a cost optimization actually worked?

Run a controlled A/B test, not a before-after comparison on the same time window, because traffic mix changes day to day and "after the change" includes that drift. The A/B test should measure cost, quality, and latency simultaneously — a cost win that hides a quality regression is not a win. Report the result as a confidence-interval-bounded effect size. See [Chapter 12](chapters/12-ab-testing-methodology/index.md).

### How often should I review my token cost dashboard?

A short daily glance for anomaly detection (any unexpected spike, any cache hit-rate dip), a weekly deeper review by feature and user (where is spend growing, where is it shrinking), and a monthly review with engineering management (top cost drivers, optimization roadmap, ROI on shipped optimizations). The dashboards should be designed for that cadence — drill-down for daily, roll-ups for weekly, narrative reports for monthly. See [Chapter 10](chapters/10-observability-dashboards-alerting/index.md).

## Advanced Topic Questions

### How do I design a vendor-neutral logging schema that works across Claude, OpenAI, and Gemini?

Define a single canonical schema with vendor-agnostic field names (`input_tokens`, `output_tokens`, `cached_tokens`, `model`, `latency_ms`, `cost_usd`) and write a thin adapter per vendor that maps the response usage object into that schema. Resolve the field-name differences (Anthropic's `cache_read_input_tokens` versus OpenAI's `prompt_tokens_details.cached_tokens` versus Gemini's `usageMetadata.cachedContentTokenCount`) at the adapter boundary, not in the dashboard. The dashboard should never know which vendor produced a row. See [Chapter 9](chapters/09-structured-logging/index.md) and [Chapter 20](chapters/20-capstone-projects-practice/index.md).

### When does extended thinking pay for itself?

Extended thinking is justified when the task is hard enough that the small/mid-tier non-thinking model fails on it more than ~15% of the time, and the cost of failure is high enough that you'd rather pay 5–10x for a higher success rate. For most production workloads — classification, extraction, summarization, routing — extended thinking is overkill and a non-thinking model with a tighter prompt wins on cost-per-successful-outcome. The way to know is to A/B test it on **your** task with **your** quality metric. See [Chapter 17](chapters/17-routing-output-control/index.md) and [Chapter 12](chapters/12-ab-testing-methodology/index.md).

### How do I architect a cost-aware multi-vendor router?

Build three layers: a **task classifier** that estimates difficulty and task type, a **routing policy** that maps (task, difficulty, budget) → (vendor, model), and a **fallback handler** that escalates on confidence-below-threshold or schema-validation-failure. Log every routing decision so you can audit the policy. Plan for the policy to be wrong sometimes — measure escalation rate as a key metric and tune the difficulty threshold against cost-per-successful-outcome. See [Chapter 17](chapters/17-routing-output-control/index.md).

### How do I evaluate vendor lock-in risk when adopting Anthropic prompt caching or Gemini long context?

For each vendor-specific feature, ask three questions: (1) what is the cost lift if I adopt it? (2) how long would it take to migrate off? (3) what's the migration cost in tokens, engineering time, and quality regression? Anthropic prompt caching has a clean alternative on OpenAI and Gemini, so adoption is low-risk. Gemini's one-million-token context has no equivalent on the other two — adopting it for a workload locks you in until the others catch up. Document the lock-in cost explicitly in the design doc. See [Chapter 6](chapters/06-google-gemini-ecosystem/index.md) and [Chapter 17](chapters/17-routing-output-control/index.md).

### How do I design a token budget policy for an autonomous coding harness?

Combine a per-session token cap (e.g., 300,000 tokens), a per-tool-call budget (e.g., 50 calls), a wall-clock limit (e.g., 30 minutes), a per-PR budget (the harness cannot exceed N tokens of work on a single PR), and a per-engineer weekly budget that surfaces in a manager-reviewable report. Each limit has a graceful degradation: summarize and stop, escalate to a human, or write a partial result. The budget policy is a document; the harness configuration is the implementation. See [Chapter 18](chapters/18-agent-budget-policies/index.md).

### How do I build a continuous cost optimization loop for a production LLM system?

Instrument with structured logging on day one. Build dashboards that surface top cost drivers by feature, user, and model. Maintain an **optimization backlog** with hypotheses ranked by expected savings. Run one A/B test at a time, with pre-registered hypothesis and stopping rule. Ship the winner, archive the loser. Repeat weekly. The compounding effect of even modest weekly wins is the difference between a cost graph that goes up and to the right and one that flattens. See [Chapter 20](chapters/20-capstone-projects-practice/index.md).

### How do I design a Skill from scratch with optimal token economics?

Start with a one-line trigger description that names the task verb and the artifact type. Write a concise body with only the model-judgment-required steps. Move every deterministic step into a bundled script (validation, formatting, file I/O, math). Keep all reference material — long examples, schema definitions, lookup tables — in bundled asset files that the model loads only when actually needed. Measure baseline tokens on a representative invocation; the target is at least 30% reduction versus a prose-only Skill. See [Chapter 8](chapters/08-skills-system/index.md).

### How do I balance the cost-quality-latency tradeoff for a user-facing product?

Pick the dimension your product most needs first (usually quality for a hard task, latency for a chat UI, cost for a high-volume background job). Set hard floors on the other two. Measure all three on every change. When two changes both improve the priority dimension, prefer the one that doesn't hit the floors of the others. Revisit the priority quarterly — what was a quality-first product in V1 may be a cost-first product at scale. See [Chapter 12](chapters/12-ab-testing-methodology/index.md) and [Chapter 17](chapters/17-routing-output-control/index.md).

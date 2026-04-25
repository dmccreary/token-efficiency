---
title: Course Description for Token Optimization
description: A detailed course description of the interactive intelligent textbook on Token Optimization including overview, topics covered, and learning objectives in the format of the 2001 Bloom Taxonomy
quality_score: 100
---

# Token Optimization

**Title:** Token Optimization: Measuring, Analyzing, and Reducing the Cost of Generative AI

**Target Audience:** Professional development / adult continuing education. Primary learners are software engineers, machine learning engineers, platform engineers, technical leads, FinOps practitioners, and engineering managers responsible for the cost and performance of generative AI systems in production. Secondary learners include graduate students in computer science, data science, or information systems who want practical exposure to the economics of large language models.

**Prerequisites:**

- Working knowledge of at least one programming language (Python preferred)
- Familiarity with REST APIs and JSON
- Basic command-line and Git skills
- Conceptual exposure to large language models (LLMs) at the level of "I have used ChatGPT, Claude, or a similar tool"
- Helpful but not required: experience with logging frameworks, cloud cost dashboards, or experiment tracking tools

## Course Overview

In many organizations today, the token usage costs of generative AI tools are becoming a dominant factor in operating expenses. A single poorly designed prompt, a verbose system message, an unbounded context window, or an over-eager agent loop can multiply costs by ten or one hundred times without producing better outcomes. Yet very few engineers and managers have a rigorous, end-to-end understanding of where tokens come from, how they are billed, how to measure them, and how to systematically drive them down without hurting quality.

This course closes that gap. It begins with a clear, practical mental model of how large language models consume input tokens and produce output tokens, including how tokenization works, how context windows are billed, and how features like prompt caching, batch APIs, streaming, and tool use change the cost profile. From this foundation, the course builds a complete toolkit for measuring and optimizing token usage in real systems: structured logging of every request and response, dashboards and cost attribution, controlled A/B testing of prompts and models, regression analysis of log files, and patterns for prompt compression, retrieval-augmented generation tuning, model routing, and agent loop budgeting.

The course is deliberately vendor-pluralistic. It covers the three dominant ecosystems that engineering teams encounter today: Anthropic Claude (including the Claude API, prompt caching, and the Claude Code harness), OpenAI (including the Chat Completions and Responses APIs and the Codex coding harness), and Google Gemini (including the Gemini API and the Antigravity agentic coding harness). Learners finish the course able to instrument any of these systems, compare them on cost-quality tradeoffs, and design a token-aware architecture that survives contact with production traffic.

## Main Topics Covered

- A high-level mental model of LLMs: tokens, tokenizers, context windows, input vs. output token pricing, and why output tokens usually cost more
- Tokenization deep dive: byte-pair encoding, how to count tokens before sending a request, and per-vendor tokenizer differences
- The economics of generative AI: per-million-token pricing, cached vs. uncached input, batch discounts, and how to model unit economics for a feature
- Anthropic Claude ecosystem: the Messages API, system prompts, prompt caching, extended thinking, tool use, and the Claude Code harness as a token consumer
- OpenAI ecosystem: Chat Completions and Responses APIs, function calling, structured outputs, and the Codex coding harness
- Google Gemini ecosystem: the Gemini API, long-context behavior, and the Antigravity agentic coding harness
- Cross-vendor comparison: how to fairly benchmark the same task across Claude, OpenAI, and Gemini on cost, latency, and quality
- Structured logging for LLM calls: what to log per request (model, input tokens, output tokens, cached tokens, latency, cost, prompt hash, user, feature, outcome) and how to keep logs privacy-safe
- Observability and dashboards: building cost-per-feature, cost-per-user, and cost-per-outcome views from raw logs
- Log file analysis: aggregating and slicing usage logs to find the top cost drivers, runaway prompts, and pathological agent loops
- A/B testing methodology for prompts and models: hypothesis design, traffic splitting, metric selection (cost, quality, latency, satisfaction), sample size, and statistical significance
- Prompt engineering for token efficiency: system prompt hygiene, instruction compression, few-shot pruning, and removing dead context
- Prompt caching patterns: what to cache, cache key design, hit-rate measurement, and invariants that break caching silently
- Retrieval-Augmented Generation (RAG) tuning for cost: chunk size, top-k selection, reranking, and dropping retrieved context that does not improve answers
- Context window management: summarization, sliding windows, and compaction strategies for long conversations and agent sessions
- Model routing and cascades: cheap-model-first patterns, escalation triggers, and confidence-based fallbacks
- Output control: max_tokens, stop sequences, JSON-mode constraints, and reasoning-budget controls for thinking models
- Agent and harness cost control: tool-call budgets, loop limits, and detecting agentic runaway in Claude Code, Codex, and Antigravity
- Skills as a token-optimization primitive: what a Skill is, how harness tools decompose a large problem into tasks and bind each task to the appropriate Skill, why Skills are designed so that only a short trigger description sits in the context window (the body is loaded on demand), how Skills delegate work to shell scripts and Python code instead of generating it token-by-token, and how moving the deterministic portions of a Skill from prose into scripts can typically reduce per-invocation token usage by roughly 30 percent — with worked before/after examples
- Batch and asynchronous APIs: when to move workloads off the synchronous path for large discounts
- Capstone project: instrument a real or simulated application end-to-end and demonstrate a measurable token reduction without quality loss

## Topics Not Covered

- Training, fine-tuning, or pre-training of foundation models from scratch
- Low-level GPU, CUDA, or inference-server optimization (vLLM, TensorRT, kernel-level work)
- General cloud FinOps beyond what touches LLM spend (e.g., Kubernetes right-sizing, storage tiering)
- The internal mathematics of transformer architectures beyond what is needed to reason about token economics
- Image, audio, and video generation cost optimization (the focus is text and code tokens)
- Vendor-specific enterprise procurement and contract negotiation
- Building a foundation model company or going beyond the public APIs of the three covered vendors
- Prompt injection and adversarial security (touched on only where it intersects with cost, e.g., abuse-driven token spikes)

## Learning Outcomes

After completing this course, students will be able to:

### Remember
*Retrieving, recognizing, and recalling relevant knowledge from long-term memory.*

- Define the terms token, tokenizer, context window, input token, output token, cached token, and reasoning token
- Recall the published per-million-token prices for the major Anthropic, OpenAI, and Google models for input, cached input, and output
- List the headers and response fields that report token usage in the Anthropic, OpenAI, and Google APIs
- Identify the standard fields that belong in a structured LLM call log (model, prompt hash, input tokens, output tokens, cached tokens, latency, cost, feature, user, outcome)
- Name the primary harness tools for each vendor: Claude Code (Anthropic), Codex (OpenAI), and Antigravity (Google)
- Recognize common token-cost antipatterns such as unbounded context, redundant system prompts, and runaway agent loops
- Recall the major levers for reducing token cost: prompt caching, model routing, output limits, batch APIs, and RAG tuning
- Define a Skill and recall how a harness binds a task to a Skill via its short trigger description
- Recognize the parts of a Skill (trigger description, body, bundled scripts and assets) and which parts are loaded eagerly versus on demand

### Understand
*Constructing meaning from instructional messages, including oral, written, and graphic communication.*

- Explain why output tokens are typically billed at a higher rate than input tokens, and why cached input is cheaper still
- Describe how byte-pair encoding produces tokens and why the same English text can produce different token counts across vendors
- Explain how prompt caching works in the Claude API and how cache hits change the effective cost of a request
- Summarize the difference between synchronous, streaming, and batch API modes and the cost implications of each
- Describe how an agentic harness like Claude Code, Codex, or Antigravity accumulates tokens across a multi-turn session
- Explain the relationship between context window size, latency, and cost for long-context workloads
- Interpret a token usage log and explain what each field means and why it is needed for cost attribution
- Describe the role of A/B testing in distinguishing real cost reductions from noise
- Explain how a harness decomposes a large user request into discrete tasks and selects a Skill for each task based solely on the Skill's short trigger description
- Explain why keeping only a Skill's trigger description in the context window — and lazy-loading the body — reduces baseline token consumption per session
- Describe how a Skill can delegate deterministic work to a shell script or Python program rather than emitting equivalent tokens through the model

### Apply
*Carrying out or using a procedure in a given situation.*

- Use a vendor tokenizer to count tokens in a candidate prompt before sending it to the API
- Instrument an existing application so that every LLM call writes a structured log line containing model, token counts, cost, and feature
- Configure prompt caching on the Anthropic Claude API and verify cache hits using the response usage fields
- Apply max_tokens, stop sequences, and JSON-mode constraints to bound output token usage on each vendor's API
- Apply a model-routing pattern that sends easy requests to a cheaper model and escalates only when needed
- Run a batch job using each vendor's batch or asynchronous API and compute the realized discount versus synchronous calls
- Use the Claude Code, Codex, or Antigravity harness in a way that respects a configured per-session token or tool-call budget
- Apply summarization or compaction to keep a long-running agent session within a target context size
- Convert prose-heavy steps inside an existing Skill into a shell or Python script and measure the per-invocation token reduction (target: ~30% on representative tasks)
- Author a Skill trigger description that is specific enough to fire reliably and short enough to keep baseline context cost low

### Analyze
*Breaking material into constituent parts and determining how the parts relate to one another and to an overall structure or purpose.*

- Analyze a log file of LLM calls to identify the top cost drivers by feature, user, model, and prompt template
- Decompose a single expensive request into its system prompt, few-shot examples, retrieved context, user message, and output, and attribute cost to each component
- Diagnose why a prompt cache hit rate is lower than expected by examining cache key invariants
- Compare cost-per-successful-outcome across two prompt variants, two models, or two vendors using A/B test data
- Trace an agent harness session and identify which tool calls or loop iterations contributed disproportionately to token cost
- Analyze the cost-quality-latency tradeoff curve for a given task across Claude, OpenAI, and Gemini models
- Distinguish between cost reductions that improve unit economics and those that hide quality regressions
- Decompose a Skill into the portions that must remain as model-readable prose and the portions that can be moved into deterministic scripts
- Analyze a harness session log to identify Skills whose trigger descriptions misfire (loaded but not used, or needed but not loaded) and quantify the token cost of each misfire

### Evaluate
*Making judgments based on criteria and standards through checking and critiquing.*

- Evaluate whether an A/B test result is statistically significant given the observed sample size and variance
- Critique a proposed prompt change for its likely impact on cost, latency, quality, and cache hit rate
- Judge whether a workload should run on the synchronous, streaming, or batch path based on latency requirements and cost targets
- Assess the privacy and compliance risk of an LLM logging schema and recommend redaction strategies
- Evaluate vendor lock-in risk when adopting a vendor-specific feature such as Anthropic prompt caching or Gemini long context
- Recommend, with justification, a model and harness combination for a given engineering team based on cost, capability, and ecosystem fit
- Critique an existing observability dashboard for missing dimensions needed to attribute cost to business outcomes
- Judge which portions of a Skill belong in the model-facing description versus an external script, weighing token cost, correctness, and maintainability
- Evaluate a candidate Skill trigger description for invocation precision (false positives and false negatives) and recommend revisions

### Create
*Putting elements together to form a coherent or functional whole; reorganizing elements into a new pattern or structure.*

- Design a structured logging schema for LLM calls that supports cost attribution by feature, user, model, and outcome
- Design and run a controlled A/B test comparing two prompt or model variants, including hypothesis, metrics, traffic split, and stopping rule
- Build an analysis notebook that ingests raw LLM call logs and produces a ranked list of cost-reduction opportunities
- Construct a model-routing layer that selects between Claude, OpenAI, and Gemini models based on task type and budget
- Design a prompt caching strategy for a real application, including cache key boundaries and a hit-rate monitoring plan
- Develop an agent-harness budget policy that bounds per-session tool calls and tokens and gracefully degrades when the budget is exhausted
- Design a Skill from scratch with an optimized split between a short trigger description, a concise body, and bundled scripts that handle deterministic work
- Refactor an existing prose-heavy Skill into a script-backed version and produce a before/after token report demonstrating the reduction
- **Capstone project:** Take a real or realistic application that calls an LLM, instrument it with structured logging, run a baseline cost measurement, propose at least three optimizations spanning prompt, caching, and routing, A/B test them against the baseline, and produce a final report demonstrating a measurable token-cost reduction with no significant quality regression
- **Alternative capstone:** Build a vendor-neutral token observability dashboard that ingests logs from Claude, OpenAI, and Gemini calls and exposes cost-per-feature, cost-per-user, and cache-hit-rate views
- **Alternative capstone:** Design and document a token budget policy for an autonomous coding harness (Claude Code, Codex, or Antigravity), including loop limits, escalation rules, and a reporting format that an engineering manager can review weekly

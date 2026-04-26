# Concept Taxonomy

The 475 concepts in the Token Optimization learning graph are organized into 14 categories. Each category has a 3-5 letter abbreviation (TaxonomyID) used in the CSV and JSON files.

## FOUND — Foundation Concepts

Core LLM and tokenization fundamentals: what an LLM is, what a token is, how tokenizers work, context windows, prompts, and basic generation parameters. These are the prerequisites for everything else in the course.

## ECON — Pricing and Economics

Per-token pricing, cost attribution, unit economics, budgets, forecasting, rate limits, and quotas. Concepts that frame the financial side of LLM usage.

## ANTH — Anthropic Claude

Anthropic-specific concepts: the Messages API, Claude model family, prompt caching, extended thinking, tool use, system prompts, batch API, and Claude-specific token-reporting fields.

## OAI — OpenAI Ecosystem

OpenAI-specific concepts: the Chat Completions and Responses APIs, GPT and o-series models, function calling, structured outputs, OpenAI batch API, and OpenAI's token usage reporting.

## GOOG — Google Gemini

Google Gemini-specific concepts: the Gemini API, Pro/Flash/Ultra model lineup, long context window, Vertex AI, AI Studio, Gemini caching, function calling, and grounding.

## HARN — Harness Tools

AI coding harnesses and agentic loops: Claude Code, OpenAI Codex CLI, Google Antigravity, agent memory, file tools, conversation compaction, harness system prompts, and session-level token accumulation. Includes serial vs. parallel execution patterns.

## SKIL — Skills System

Skills as a token-optimization primitive: trigger descriptions, lazy loading, task decomposition, task-skill binding, script delegation, skill misfires, and refactoring skills to use scripts.

## OBS — Logging and Observability

Structured logging schemas, log fields, OpenTelemetry, dashboards, metrics, alerting, log file analysis, cost roll-ups, and percentile-based usage analysis.

## AB — A/B Testing and Experimentation

Hypothesis design, control and treatment groups, sample size, statistical significance, power analysis, multi-armed bandits, CUPED, stopping rules, and quality regression detection.

## OPT — Prompt and Cache Optimization

Prompt engineering for token efficiency, instruction compression, few-shot pruning, prompt templates, prompt caching mechanics (hit/miss/key/invariant), cache monitoring, and cross-vendor caching differences.

## RAG — Retrieval and Context Management

RAG concepts: embeddings, vector databases, chunking, reranking, query rewriting, retrieved-context bloat, plus context window management techniques like sliding windows, summarization, compaction, and lost-in-the-middle.

## ROUT — Routing and Output Control

Model routing patterns, cheap-first cascades, escalation triggers, fallback models, vendor-neutral abstractions, plus output controls like max_tokens, stop sequences, JSON-schema enforcement, and reasoning-budget settings.

## BUDG — Agent Budgets and Batch APIs

Per-session and per-team budget policies, loop iteration limits, runaway detection, circuit breakers, plus batch and asynchronous APIs, retry/backoff strategies, and idempotency.

## PRIV — Privacy and Compliance

Data privacy, PII detection and redaction, compliance frameworks (GDPR, HIPAA, SOC2), data residency, vendor data retention, opt-out, hashing, anonymization, and audit trails.

## CAP — Capstone and Practice

End-to-end practice: baseline cost measurement, before-after reports, optimization backlogs, canary rollouts, the three capstone projects, eval suites, golden test sets, and the long-term token efficiency roadmap.

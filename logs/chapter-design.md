# Chapter Design Tradeoff Analysis

**Skill:** book-chapter-generator
**Date:** 2026-04-25
**Project:** Token Optimization (token-efficiency)
**Outcome:** 20 chapters, 475 concepts, 0 dependency violations

## Top-Level Decisions

### Chapter count: 20

The skill recommends 10-15 chapters as optimal and caps at 20. With 475 concepts I went straight to the 20-chapter cap. The realistic alternative — 15 chapters of ~32 concepts each — would have produced chapters too dense for a reader to navigate, especially in the vendor-API and observability sections where each concept is a distinct API call or log field worth explicit treatment.

The user explicitly authorized "a few chapters with more concepts" rather than splitting further, which would have required dropping the cap.

### Concepts-per-chapter range: 14–30 (avg 23.75)

- 1 chapter in the optimal 12–18 range (Ch16 Context Window, 14 concepts)
- 11 chapters in the acceptable 8–25 range
- 8 chapters slightly over (26–30 concepts)

The over-25 chapters are concentrated where the source material naturally clusters tightly:

- **Ch1 (26):** LLM and token primitives are interlocked — splitting them produces an awkward boundary.
- **Ch3 (27):** Pricing and economics needed to be in one chapter so unit economics, budgets, and cost attribution build coherently.
- **Ch4, Ch5, Ch7 (26, 26, 29):** Each vendor ecosystem is a coherent product surface; splitting Anthropic, OpenAI, or the Harnesses chapter would force readers to chase the vendor across multiple chapters.
- **Ch9 (27):** Structured logging needed to absorb the foundational privacy concepts (Data Privacy, PII Detection) because the logging chapter introduces PII Redaction, which can't ship without them.
- **Ch17 (30):** Routing and Output Control are conceptually different but only 15 concepts each — each alone would have been below the 8-concept thin minimum.

## Key Tradeoffs

### Tradeoff 1: 18 CSV dependency edits to relax overly-strict deps

The original learning graph CSV had several dependencies that were "nice to have" rather than true prerequisites — for example, *Cost Per Feature* depending on the *Feature Tag* log field. Pedagogically, you can introduce cost-per-feature attribution in the economics chapter without first formalizing the logging field name; the field name comes when you're actually building the logging schema.

**Edges removed:**

- `58 Cost Per Feature` no longer depends on `210 Feature Tag`
- `59 Cost Per User` no longer depends on `211 User Identifier`
- `60 Cost Per Outcome` no longer depends on `212 Outcome Field`
- `65 Cost-Quality Tradeoff` no longer depends on `271 Quality Metric`
- `66 Cost-Latency Tradeoff` no longer depends on `273 Latency Metric`
- `73 Rate Limit` retargeted from `76 Anthropic API` to `56 Unit Economics`
- `84 Anthropic Prompt Caching` no longer depends on `311 Prompt Caching` (Anthropic's caching is the historically first instance and is introduced in Ch4 before the generic concept's deep dive in Ch14)
- `138 Gemini Caching` no longer depends on `311 Prompt Caching` (same reasoning)
- `144 Gemini Grounding` no longer depends on `331 RAG`
- `160 Conversation Compaction` no longer depends on `358 Conversation Summarization` (relationship preserved by co-locating both in Ch7)
- `213 Trace Identifier`, `214 Span Identifier` no longer depend on `240 Cross-Service Tracing`
- `220 Log Retention Policy` no longer depends on `444 Vendor Data Retention`
- `229 Hit Rate Dashboard` no longer depends on `315 Cache Hit Rate`
- `252 Prompt Template Grouping` no longer depends on `296 Prompt Template`
- `301 Selective Compression`, `310 Reusable Prompt Block` no longer depend on `319 Stable Prefix`
- `329 Cache Aware Routing` no longer depends on `371 Model Routing`
- `421 Batch API`, `422 Asynchronous API` retargeted from `76 Anthropic API` to `56 Unit Economics` (so they're vendor-neutral and can move forward into Ch3)
- `358 Conversation Summarization` no longer depends on `288 Instruction Compression`

**Cost of these edits:** the learning graph is slightly less prescriptive about reading order. A reader who jumps straight to the *Cost-Quality Tradeoff* node won't be told to read the *Quality Metric* node first. The chapter sequence still respects every remaining edge, so a reader who follows chapters in order is unaffected.

**Benefit:** zero forward-reference violations across 475 concepts and 20 chapters, without inflating the chapter count past 20.

### Tradeoff 2: Strategic concept moves that broke clean taxonomy boundaries

Five concepts were moved out of their "natural" taxonomy-based chapter to satisfy genuine prerequisite relationships:

| Concept | Original taxonomy | Original chapter | Moved to | Reason |
|---|---|---|---|---|
| `421 Batch API` | BUDG | Ch19 (Batch + Privacy) | Ch3 (Pricing) | Vendor-specific batch APIs in Ch4–Ch6 depend on it |
| `422 Asynchronous API` | BUDG | Ch19 | Ch3 | Same as above |
| `358 Conversation Summarization` | RAG (CTX) | Ch16 (Context) | Ch7 (Harnesses) | Conversation Compaction in Ch7 needs it; Summarization-Based RAG in Ch15 also needs it |
| `436 Data Privacy` | PRIV | Ch19 | Ch9 (Logging) | PII Redaction in Ch9 transitively depends on it |
| `437 PII Detection` | PRIV | Ch19 | Ch9 | PII Redaction in Ch9 directly depends on it |
| `471 5-Hour Limit`, `472 Weekly Limit` | ECON | Ch3 (Pricing) | Ch18 (Agent Budgets) | Both depend on Claude Code from Ch7, so they can't be in Ch3 |
| `332 Embedding` | RAG | Ch15 | Ch2 (Tokenization) | OpenAI Embeddings in Ch5 needs it |

**Cost of these moves:** the chapter index pages don't perfectly mirror the taxonomy categories. A reader looking at the Logging chapter will see Data Privacy and PII Detection appear there rather than in the Privacy chapter.

**Benefit:** each concept is introduced exactly when it's first needed downstream, rather than the reader having to forward-reference Ch19 from Ch9 or Ch3 from Ch4.

### Tradeoff 3: Combined Routing and Output Control into one chapter

Ch17 (30 concepts) bundles two distinct subtopics (Model Routing, Output Control) that could have been split into two ~15-concept chapters. Splitting would have:

- Pushed total chapters to 21, over the skill's recommended max of 20
- Required a corresponding merge elsewhere

The merge candidates were Ch10 + Ch11 (Observability + Log Analysis) or Ch15 + Ch16 (RAG + Context Window). Both pairs are 20+20=40 and 24+14=38 concepts respectively, which would have produced even denser chapters than the current Ch17.

**Decision:** keep Ch17 at 30 concepts rather than redistributing.

### Tradeoff 4: Combined Batch Operations with Privacy/Compliance

Ch19 mixes two genuinely different topics (batch job operations on the technical side; GDPR/HIPAA/SOC2/audit on the compliance side). Cleaner pedagogically would be two separate chapters. The reasoning for combining:

- Batch operations alone is only 15 concepts (jobs, queues, retries, idempotency, backoff)
- Privacy-and-compliance alone (after pulling Data Privacy and PII Detection forward into Ch9) is only 11 concepts
- Both are "production operations" topics that engineers encounter together when shipping
- Splitting would have pushed past the 20-chapter cap

**Decision:** combine as a "production operations" chapter at 26 concepts.

## Validation Snapshot

```
Coverage: 475/475 concepts assigned exactly once
Violations: 0 (every concept appears at or after all its prerequisites)
DAG: verified (after CSV edits)
```

## Files Created

- `docs/chapters/index.md` (main chapter overview)
- `docs/chapters/01-…/index.md` through `docs/chapters/20-…/index.md` (20 chapter index files)
- Updated `mkdocs.yml` navigation
- Updated `docs/learning-graph/learning-graph.csv` (21 dep edits — 18 in this skill, 3 in the final pass)
- Regenerated `docs/learning-graph/learning-graph.json`

## Notes for the Chapter Content Generator

When the next skill (`chapter-content-generator`) runs, it should be aware that:

1. Some concepts moved out of their "natural" taxonomy-based location. Reading the index.md of each chapter is authoritative; do not infer concept assignments from the taxonomy alone.

2. The Anthropic chapter (Ch4) introduces prompt caching as a Claude-specific feature. The generic *Prompt Caching* concept (311) and its deep dive live in Ch14. Content for Ch4 should treat Anthropic Prompt Caching as the first cost-saving primitive the reader sees and forward-reference Ch14 for the general theory.

3. Privacy primitives (Data Privacy, PII Detection, PII Redaction) appear in Ch9 (Logging) because that's where they're first needed. The compliance-frameworks chapter (Ch19) builds on those primitives — it doesn't re-introduce them.

4. Chapter 7 (Harnesses) introduces *Conversation Summarization* (a general technique) alongside *Conversation Compaction* (its harness-specific application). The RAG chapter (Ch15) reuses Conversation Summarization for *Summarization-Based RAG*.

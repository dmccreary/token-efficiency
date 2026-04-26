# FAQ Coverage Gaps

This report identifies concepts from the learning graph (475 total) that are not directly named in an FAQ question or answer. Many gap concepts are leaf-node terminology fully defined in the [glossary](../glossary.md) — they don't necessarily need a dedicated FAQ entry. The gaps below are prioritized by their likely value as standalone FAQ questions.

## Critical Gaps (High Priority)

These are high-centrality concepts (many dependencies in the learning graph or named explicitly in course outcomes) that deserve a dedicated FAQ entry:

1. **Tool Use / Function Calling**
   - Concept IDs: 92 (Claude Tool Use), 109 (Function Calling), 134 (Gemini Function Calling)
   - Suggested question: "What is tool use and how does it affect token cost?"
   - Category: Core Concepts

2. **Eval Suite / Golden Test Set**
   - Concept IDs: 466 (Eval Suite), 467 (Golden Test Set)
   - Suggested question: "How do I design an eval suite for cost-quality benchmarking?"
   - Category: Best Practice or Advanced

3. **Quality Regression Detection**
   - Concept ID: 453
   - Suggested question: "How do I detect a quality regression in production?"
   - Category: Best Practice

4. **Implicit vs Explicit Caching**
   - Concept IDs: 327, 328
   - Suggested question: "What is the difference between implicit and explicit caching?"
   - Category: Technical Details

5. **Reasoning Effort Setting / Verbosity Parameter**
   - Concept IDs: 391, 400
   - Suggested question: "How do I control reasoning effort on the o-series and Claude extended thinking?"
   - Category: Technical Details

## Medium Priority Gaps

Concepts with moderate centrality that would round out the FAQ:

6. **CUPED Adjustment** (Concept ID 284) — Advanced statistical technique for variance reduction
7. **Multi-Armed Bandit** (Concept ID 283) — Sequential testing alternative to A/B
8. **Idempotency Key / Retry Policy** (Concept IDs 433, 434) — Production-critical for batch jobs
9. **Backoff Strategy** (Concept ID 435) — Retry economics
10. **Webhook Notification** (Concept ID 432) — Batch result delivery
11. **Hybrid Retrieval / BM25** (Concept IDs 344, 345) — RAG patterns
12. **HyDE / Query Rewriting** (Concept IDs 347, 348) — Advanced RAG
13. **Subagent Pattern** (Concept ID 165) — Harness architecture
14. **Persistent Memory File** (Concept ID 167) — Agent memory patterns
15. **Token Spike Alert / Cost Threshold Alert** (Concept IDs 235, 236) — Alerting design
16. **Cardinality Concern** (Concept ID 237) — Dashboard footgun
17. **Pareto Analysis / Top-N Cost Drivers** (Concept IDs 243, 244) — Log analysis methodology
18. **5-Hour Limit / Weekly Limit** (Concept IDs 471, 472) — Vendor-imposed rate limits
19. **Parallel Token Penalty** (Concept ID 475) — Why parallel execution can cost more
20. **Continuous Cost Monitoring / Token Efficiency Roadmap** (Concept IDs 469, 470) — Programmatic monitoring

## Low Priority Gaps

Leaf-node terminology already well covered in the glossary; doesn't need a dedicated FAQ entry unless reader feedback indicates demand:

- Special Tokens, EOS Token, BOS Token, Padding Token (39-42)
- Whitespace Handling, Unicode Normalization (37, 38)
- Token Boundary, Pre-Tokenization (43, 44)
- Logit Bias, Seed Parameter (119, 120)
- Volatile Suffix, Cache Boundary (320, 321)
- Lost-In-The-Middle, Context Reordering (367, 368)
- Pilot Rollout, Canary Deployment (457, 458)
- Vendor Data Retention, Opt-Out Of Training (444, 445)
- Tokenized Identifier (448)

## Recommendations

1. **Address all 5 critical gaps** in the next FAQ revision — these are concepts named in course learning outcomes that readers will search for by name.
2. **Add 5–8 medium-priority entries** to push coverage above 50% directly named.
3. Low-priority gaps can stay glossary-only; the glossary is the right place for narrow terminology with a one-sentence definition.

## Coverage Summary

| Priority | Gap Count | Action |
|----------|-----------|--------|
| Critical | 5 | Add to FAQ in next revision |
| Medium | 15 | Consider for FAQ; OK in glossary |
| Low | ~270 | Glossary entries sufficient |
| Total gap | ~290 / 475 | Reflects glossary-as-canonical strategy |

The FAQ is sized appropriately for a professional-development textbook (91 questions). Pushing it past 130 questions without strong reader demand risks dilution; instead, expand the glossary and rely on search for the long tail.

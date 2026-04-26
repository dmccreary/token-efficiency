---
title: Retrieval-Augmented Generation Optimization
description: Tuning RAG so retrieved context earns its tokens — vector databases, chunking, top-K and reranking, hybrid retrieval, query rewriting, document compression, summarization-based RAG, citations, and the precision/recall tradeoffs
generated_by: claude skill chapter-content-generator
date: 2026-04-26 09:00:00
version: 0.07
---

# Retrieval-Augmented Generation Optimization

## Summary

Tuning RAG so retrieved context earns its tokens: vector databases, chunking strategies, top-K retrieval and reranking, hybrid (BM25 + dense) retrieval, query rewriting and HyDE, document compression, summarization-based RAG, citation of sources, RAG cost analysis, and the precision/recall tradeoffs of retrieval.

## Concepts Covered

This chapter covers the following 24 concepts from the learning graph:

1. Retrieval Augmented Generation
2. Vector Database
3. Chunking
4. Chunk Size
5. Chunk Overlap
6. Top-K Retrieval
7. Reranker
8. Cross-Encoder Reranker
9. Retrieval Score
10. Context Injection
11. Retrieved Context Bloat
12. Context Pruning
13. Hybrid Retrieval
14. BM25 Retrieval
15. Dense Retrieval
16. Query Rewriting
17. HyDE
18. Document Compression
19. Summarization-Based RAG
20. Citation Of Sources
21. RAG Cost Analysis
22. Context Quality Metric
23. Retrieval Precision
24. Retrieval Recall

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: LLMs, Tokens, and Generation Basics](../01-llms-tokens-generation-basics/index.md)
- [Chapter 2: Sampling, Tokenization, and Embeddings](../02-sampling-tokenization-embeddings/index.md)
- [Chapter 3: Pricing, Economics, and Async API Modes](../03-pricing-economics-async-apis/index.md)
- [Chapter 7: AI Coding Harnesses and Agentic Loops](../07-coding-harnesses-agentic-loops/index.md)
- [Chapter 12: A/B Testing Methodology for LLMs](../12-ab-testing-methodology/index.md)
- [Chapter 13: Prompt Engineering for Token Efficiency](../13-prompt-engineering-tokens/index.md)

---

!!! mascot-welcome "Make Every Retrieved Token Earn Its Place"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Pemba waving welcome">
    RAG is the most common pattern in modern LLM applications and the most common source of accidental token bloat. The default tuning ("retrieve top 10, paste them all into the prompt") is rarely optimal — usually you can cut retrieved tokens in half with no quality loss by tightening chunk size, reranking aggressively, and pruning the long tail. This chapter is the playbook. Cheap systems retrieve only what they'll actually use.

## RAG in One Diagram

**Retrieval-augmented generation** (RAG) is the pattern where, instead of relying solely on what the model learned during training, you retrieve relevant context from an external source at query time and inject it into the prompt. RAG is what lets a model answer questions about your documents, your codebase, your knowledge base — content the base model has never seen.

The standard flow:

1. **Index time** (one-time or periodic): chunk the source documents, embed each chunk into a vector, store in a vector database
2. **Query time** (per request): embed the user query, find the top-K most similar chunks, inject them into the prompt, generate the answer

The cost shape is what makes RAG so token-sensitive. Every retrieved chunk that ends up in the prompt is paid for as input tokens on every request. A 10-chunk retrieval at 500 tokens per chunk is 5,000 input tokens per request, paid before the user message and the system prompt are even counted. Multiplied across millions of requests, sloppy retrieval is dollars on the table.

## The Retrieval Stack: Vector Databases and Indexing

A **vector database** is a specialized data store that holds embeddings (Chapter 2) and supports fast nearest-neighbor search over them. Examples include Pinecone, Weaviate, Qdrant, pgvector (Postgres extension), Chroma, and the vector capabilities built into Elasticsearch and OpenSearch.

The vector database is rarely the cost driver in a RAG system — embedding storage is cheap and queries are fast. The cost driver is the *output* of the vector database: the retrieved chunks that flow into your prompt.

### Chunking and Chunk Size

**Chunking** is the process of splitting source documents into smaller pieces before embedding. Chunking matters because:

- Embeddings represent the meaning of a chunk as a single vector — too large a chunk dilutes meaning into vagueness; too small loses context
- Retrieved chunks become input tokens — chunk size directly shapes per-request input cost
- Chunk boundaries can break semantic units mid-sentence if naive — language-aware splitting (sentence boundaries, paragraph boundaries) helps

The **chunk size** parameter is the target token length per chunk. Common ranges and their tradeoffs:

| Chunk Size | Pros | Cons |
|------------|------|------|
| 100–300 tokens | Tight semantic focus; easy reranking | Often misses surrounding context; needs more retrieved chunks |
| 500–800 tokens | Balanced; common default | Some semantic dilution |
| 1,000–2,000 tokens | Captures rich context | Big input cost per chunk; embeddings less discriminating |

There is no single right answer. For Q&A over technical docs, 500–800 tokens with an aggressive reranker works well. For code retrieval, function-or-class-sized chunks (often 200–600 tokens) align with natural boundaries. Always A/B test chunk size against a representative query set.

**Chunk overlap** is the practice of including a tail of the previous chunk at the head of the next, so semantic units that span a boundary don't get bisected. Typical overlap is 10–20% of chunk size. Overlap costs storage (more chunks) but improves recall (relevant content near boundaries doesn't fall through the cracks).

## Top-K Retrieval and the Cost-Recall Tradeoff

**Top-K retrieval** is the core operation: given a query, return the K most similar chunks from the vector database. K is the single most influential parameter for RAG cost — every additional unit of K is another chunk's worth of input tokens.

Each retrieved chunk has a **retrieval score** — a similarity measure (typically cosine similarity) between the query embedding and the chunk embedding. Higher score means more semantically similar.

The cost-recall tradeoff is direct:

- Small K (3–5) — low input cost, but you'll miss relevant chunks that didn't quite make the cutoff
- Large K (20–50) — high recall (the right answer is almost certainly in the retrieved set) but expensive input cost and the model now has to read through many irrelevant chunks
- Very large K (100+) — pure waste in most cases; the long tail of low-scoring chunks adds noise that hurts answer quality

The right K depends on the workload: well-targeted queries against well-chunked content can use K=3 effectively; vague queries against noisy content may need K=20 with reranking.

## Reranking

A **reranker** is a second-stage filter that takes the top-K chunks from initial retrieval and scores them more accurately, returning a refined top-N (where N < K). Rerankers are usually expensive per-pair to compute but cheap relative to the LLM call they precede.

The standard reranker design is a **cross-encoder reranker** — a small transformer model that takes (query, chunk) as a pair and outputs a relevance score. Cross-encoders are more accurate than the bi-encoder approach used in initial retrieval (where query and chunk are embedded independently and compared via cosine similarity) because they can attend to the query and chunk together. Examples: Cohere Rerank, Jina Reranker, BGE Reranker.

The standard pipeline:

1. Initial retrieval returns top-K=20 by embedding similarity
2. Reranker scores all 20 (query, chunk) pairs
3. Top-N=5 by reranker score is injected into the prompt

This pattern — wide initial retrieval, narrow reranked injection — typically achieves better recall *and* lower input cost than a single retrieval at K=5 or K=10. The reranker fee is small compared to the LLM input savings.

## Context Injection and the Bloat Problem

**Context injection** is the step where the retrieved chunks are formatted into a string and inserted into the prompt — typically as a labeled section ("RELEVANT CONTEXT:\n{chunk1}\n---\n{chunk2}\n..."). The exact format matters less than the size.

**Retrieved context bloat** is what happens when the injected context grows without producing better answers. Common causes:

- K is too high — many low-relevance chunks pad the prompt
- Chunks are too large — each individual chunk includes more than needed
- The system prompt repeats instructions about how to use the context, making the context section longer
- The injected format is verbose (heavy XML or JSON wrapping when plain text would do)

**Context pruning** is the countermeasure: post-retrieval, before injection, drop chunks that don't meet a quality threshold. Two pruning strategies:

- **Score-threshold pruning** — drop any chunk whose reranker score is below a tuned threshold. Adaptive — sometimes you keep all 5, sometimes only 2
- **Diversity pruning** — drop chunks that are near-duplicates of higher-scoring chunks. Saves tokens on redundant content

Context pruning typically yields 20–40% reduction in retrieved tokens with no quality impact when tuned per workload.

#### Diagram: RAG Pipeline with Cost Annotations

<iframe src="../../sims/rag-pipeline-cost-annotations/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>RAG Pipeline with Cost Annotations</summary>
Type: workflow
**sim-id:** rag-pipeline-cost-annotations<br/>
**Library:** Mermaid<br/>
**Status:** Specified

Purpose: Show the standard RAG pipeline (embed query → vector search → rerank → prune → inject → generate) with token-cost annotations at each stage so learners can identify where bloat enters and where pruning helps.

Bloom Level: Analyze (L4)
Bloom Verb: examine

Learning objective: Examine where in the RAG pipeline retrieved tokens accumulate and identify the highest-leverage stages for cost reduction.

Visual style: Horizontal flowchart with labeled stages

Stages (left to right):
1. User Query (input)
2. Query Embedding (separate cheap embedding API call)
3. Vector Search → returns top-K=20 chunks (no LLM cost yet, just vector DB)
4. Reranker → narrows to top-N=5
5. Context Pruning → drops low-score chunks (e.g., 5 → 3)
6. Context Injection → format and prepend to prompt
7. LLM Generation → input cost = (system prompt + injected context + user query); output cost = response

Cost annotations at each stage:
- Vector search: ~\$0 per query
- Reranker: ~\$0.001 per query
- Context injection: 1,500 tokens × \$3/MTok = \$0.0045 input
- LLM generation: \$0.005 input + \$0.003 output = \$0.008
- Total: ~\$0.014/query

Interactive controls:
- Slider: K (5–50) — recomputes injected context size and total cost
- Slider: Reranker N (1–20)
- Toggle: "Disable reranker" — shows the cost increase
- Toggle: "Disable pruning" — shows the cost increase

Data Visibility Requirements:
  Stage 1: Show the default pipeline with all annotations
  Stage 2: As sliders move, recompute injected token count and total cost live
  Stage 3: When reranker or pruning is disabled, highlight the cost delta in red

Default state: K=20, N=5, pruning on, reranker on

Implementation: Mermaid flowchart with cost annotations, responsive layout
</details>

## Hybrid Retrieval: BM25 Plus Dense

**Dense retrieval** is the embedding-based approach we've been describing — embed the query, find chunks with similar embeddings. It's strong on semantic similarity but weak on exact-keyword matching (a query for "EX-2024-Q3-001" may not retrieve a chunk that contains exactly that string, because embedding similarity doesn't index exact tokens).

**BM25 retrieval** is the classic information-retrieval approach: a TF-IDF-style scoring function that ranks chunks by exact-keyword overlap with the query. BM25 is strong on exact matches, technical identifiers, code snippets, and rare terminology — exactly the cases where dense retrieval struggles.

**Hybrid retrieval** is the practice of running both BM25 and dense retrieval in parallel, then combining the results (via reciprocal rank fusion or weighted score combination). Hybrid retrieval consistently improves recall on heterogeneous workloads — Q&A systems that mix natural language ("what's our refund policy?") with identifier-heavy queries ("what does error code AUTH-451 mean?") benefit substantially.

The cost overhead of hybrid is small (a parallel cheap-IR query against an inverted index) and the recall gain is often enough to allow K reduction in the merged set, which produces net token savings.

## Query Rewriting and HyDE

The user's query as typed is not always the best query for retrieval. Two techniques rewrite the query before it hits the retrieval index:

**Query rewriting** is the use of an LLM to rephrase the user's question into a form better suited to retrieval. Examples: expanding ambiguous pronouns, adding synonyms, splitting compound queries into multiple sub-queries. Query rewriting typically uses a small fast model (Haiku or Flash) and adds a small input/output cost in exchange for substantially better retrieval recall.

**HyDE** (Hypothetical Document Embeddings) is the related technique where you ask an LLM to generate a *hypothetical answer* to the user's question, then use the hypothetical answer's embedding as the retrieval query. The intuition is that an answer-shaped query embeds more like the actual answer chunks than a question-shaped query does. HyDE works well when there's a wide stylistic gap between user questions and document content.

Both techniques cost a small extra LLM call before retrieval. Both can reduce the K needed for adequate recall, often producing net cost savings on workloads with messy or terse user queries.

## Document Compression and Summarization-Based RAG

**Document compression** is the practice of running retrieved chunks through a compression step (usually an LLM call to a cheap model) that produces a shorter version preserving the information relevant to the query. Compression is a per-request cost (you pay for the compression LLM call) but can dramatically reduce the injected context size — useful for endpoints where input cost dominates.

**Summarization-based RAG** is the related, more aggressive approach: instead of retrieving full chunks, retrieve summaries of chunks (pre-computed at index time) and inject those. Summarization-based RAG has dramatically lower per-request token cost but may lose the specific details a query needs (the summary may have abstracted them away). It's appropriate for high-level Q&A; less appropriate for precise factual retrieval.

A common compromise: retrieve summaries first, then for the top-N also retrieve and inject the underlying full chunks. Two-stage retrieval keeps cost low for typical queries and accuracy high for queries that need detail.

## Citation of Sources

**Citation of sources** is the practice of having the model attribute each claim in its response to a specific retrieved chunk. Citations serve two purposes: user trust (the user can verify the claim by clicking through) and quality monitoring (uncited claims are often hallucinated).

Citations have a token cost — the model must emit the citation markers in its output, and each citation typically adds 5–15 output tokens. For a long answer with many citations, this can add 10–20% to output token count. The cost is almost always justified by the trust and quality benefit; if you're worried about cost, cite at the paragraph level rather than the sentence level.

## RAG Cost Analysis and Quality Metrics

**RAG cost analysis** is the per-request cost decomposition specifically for RAG endpoints, identifying which stage contributes which fraction of cost. The components:

- Embedding the query (small, ~\$0.00001)
- Vector search (free, paid via vector DB infrastructure)
- Reranker call (small, ~\$0.001)
- LLM generation input (the dominant cost — system prompt + injected context + user query)
- LLM generation output (the second cost — the answer + citations)

A typical RAG cost decomposition for a single query might be: 5% embedding + reranker, 60% LLM input (mostly context injection), 35% LLM output. The implication: input cost dominates, and any optimization that reduces injected context size (chunk size tuning, K reduction, reranking, pruning) is high-leverage.

A **context quality metric** is any measure of how well the retrieved context supports the answer. Common metrics:

- **Retrieval precision** — of the chunks retrieved, what fraction were actually relevant? High precision means low waste.
- **Retrieval recall** — of all the truly relevant chunks in the corpus, what fraction were retrieved? High recall means low miss rate.
- **Answer faithfulness** — does the generated answer actually use the retrieved context, or does it ignore retrieval and rely on the model's training? Low faithfulness suggests retrieval isn't earning its tokens.

The optimization goal: high precision (no wasted chunks) at adequate recall (no missed answers). Track both; A/B test changes against both.

#### Diagram: Precision/Recall Tradeoff for K Selection

<iframe src="../../sims/rag-precision-recall-k/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Precision/Recall Tradeoff for K Selection</summary>
Type: chart
**sim-id:** rag-precision-recall-k<br/>
**Library:** Chart.js<br/>
**Status:** Specified

Purpose: Plot retrieval precision and recall as functions of K for a representative dataset, with cost overlaid, so learners can pick the K that balances quality and cost.

Bloom Level: Evaluate (L5)
Bloom Verb: justify

Learning objective: Justify a choice of K based on precision, recall, and per-query cost.

Chart type: Multi-line chart with secondary axis
- X-axis: K (top-K retrieved chunks, 1 to 50)
- Y-axis (left): Precision and recall (0–1)
- Y-axis (right): Per-query input cost (\$)

Data series:
1. Retrieval precision (line, descending — adding more chunks adds more irrelevant ones)
2. Retrieval recall (line, ascending — adding more chunks finds more relevant ones)
3. Per-query input cost (line, linear ascending)

Markers:
- "Precision-recall crossover" point
- "Cost-acceptable" zone (recall ≥ 0.85, cost ≤ \$0.005)
- Recommended K range as a shaded band

Interactive controls:
- Slider: Reranker N (the post-rerank cut)
- Slider: Chunk size (changes per-K cost)
- Toggle: "Use reranker" — without reranker, precision drops faster as K grows

Data Visibility Requirements:
  Stage 1: Show all three lines for default settings
  Stage 2: As reranker N changes, recompute and animate
  Stage 3: Highlight the recommended K band

Default state: K=20, reranker N=5

Implementation: Chart.js dual-axis multi-line, responsive width
</details>

!!! mascot-tip "Tune K With the Reranker On First"
    <img src="../../img/mascot/tip.png" class="mascot-admonition-img" alt="Pemba sharing a tip">
    The biggest single win in most production RAG systems is "stop injecting 20 chunks when 5 reranked chunks would do." Add a reranker, drop K-injected from 10 to 4, and watch input tokens halve while answer quality stays flat or improves. The reranker's cost is a fraction of what the eliminated chunks were costing. Where did all the tokens go? Spoiler: into chunks 6 through 10 that the model glanced at and ignored.

## Putting It All Together

You can now design and tune a token-efficient RAG system. You build the foundation — a **vector database** of **chunking**-derived embeddings with appropriate **chunk size** and **chunk overlap**. At query time you perform **top-K retrieval**, optionally enriched by **hybrid retrieval** combining **BM25 retrieval** with **dense retrieval**, and refined by **query rewriting** or **HyDE**. You apply a **reranker** (typically a **cross-encoder reranker**) using **retrieval scores** to narrow the set, then **context pruning** to drop the long tail before **context injection**. You may apply **document compression** or **summarization-based RAG** for additional savings, and **citation of sources** for trust. You monitor **retrieval precision** and **retrieval recall** as **context quality metrics** alongside cost, and you run **RAG cost analysis** to identify where to optimize next. You guard against **retrieved context bloat** as a recurring failure mode of the practice.

Chapter 16 takes the long-running session view: how to keep multi-hour conversations affordable through compaction, summarization, and selective context inclusion.

??? question "Quick Self-Check — Click to Reveal Answers"
    1. **What's the difference between BM25 and dense retrieval?** BM25 ranks by exact keyword overlap (strong on identifiers and rare terms). Dense retrieval ranks by embedding similarity (strong on semantic similarity). Hybrid combines both.
    2. **What does a cross-encoder reranker do that the initial bi-encoder retrieval can't?** It scores (query, chunk) pairs together with full attention between them, producing more accurate relevance scores than independent embedding similarity.
    3. **What's the typical RAG cost breakdown?** ~5% retrieval/reranking, ~60% LLM input (context injection dominates), ~35% LLM output. Input optimizations are highest leverage.
    4. **When would you use summarization-based RAG?** When per-request input cost dominates and high-level Q&A is acceptable. Avoid it when queries need precise details that summarization may have lost.
    5. **What does retrieval precision measure?** The fraction of retrieved chunks that were actually relevant. High precision means low token waste.

!!! mascot-celebration "End of Chapter 15"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Pemba celebrating">
    RAG tuned, retrieved tokens earning their place. Next chapter handles the long-running session problem — how to keep conversations affordable when they stretch across hours.


---

[See Annotated References](./references.md)

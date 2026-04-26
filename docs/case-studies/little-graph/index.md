---
title: A Little Graph Saves a Lot of Tokens
description: How a four-column CSV beat RAG and GraphRAG on retrieval F1 by ~3.8× while using ~11× fewer tokens per query — and why that result is structural, not incidental.
generated_by: human + Claude Opus 4.7, summarizing Yarmoluk et al. (2026), CKG Benchmark
date: 2026-04-26
version: 0.1
---

# A Little Graph Saves a Lot of Tokens

## Summary

This case study walks through the headline finding of the **CKG Benchmark** paper by Yarmoluk and McCreary (2026): if your domain knowledge can be expressed as a directed acyclic graph (DAG) of concepts and prerequisites, swapping retrieval-augmented generation (RAG) for a tiny pre-authored graph delivers roughly **11× fewer retrieved tokens** and **3.8× higher F1** at the same time. The paper formalizes this as a new architecture — **Compact Knowledge Graphs (CKG)** — and reports a **42× advantage** on the compound efficiency metric (Reasoning Density Score, F1 per token).

For a textbook on token efficiency, this is one of the cleanest natural experiments in the literature: same model, same temperature, same corpus, three retrieval architectures. The graph wins, and the win is structural rather than a tuning artifact.

!!! mascot-welcome "A graph the size of a postcard, beating a vector store the size of a library"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Pemba waving welcome">
    A 200-concept learning graph fits in 6–12 KB of plain text — smaller than this paragraph's HTML render. The CKG Benchmark shows that, on the right kind of question, that little CSV outperforms a 2,000-token RAG context window by nearly four-to-one on accuracy *and* eleven-to-one on tokens. Every token counts — and counting is fun. Let's count what this little graph saves.

## The setup

The benchmark holds the model and the questions constant and varies only the retrieval architecture.

| Component | RAG baseline | GraphRAG | CKG |
|-----------|--------------|----------|-----|
| Source | MkDocs `.md` chapters | Same `.md` chapters | `learning-graph.csv` |
| Index build | Embed + FAISS | LLM-derived graph | None (CSV is the index) |
| Retrieval | Top-5 chunks (512 tok, 50 overlap) | Local/global graph search | Exact label match + BFS/DFS |
| Generation | Claude Sonnet 4.6, T=0 | Claude Sonnet 4.6, T=0 | Claude Sonnet 4.6, T=0 |

The corpus — the McCreary Intelligent Textbook Corpus — covers 44 educational domains, 12,261 concepts, and 19,626 prerequisite edges. Question types span entity lookup (T1), one-hop dependencies (T2), full prerequisite paths (T3), taxonomy aggregation (T4), and cross-concept reasoning (T5). 7,758 queries in total.

## What a CKG actually looks like

This is the entire data structure. Four columns. Pipe-delimited integers for the edges.

```csv
ConceptID,ConceptLabel,Dependencies,TaxonomyID
1,Number,,FOUND
2,Function,1,FOUND
3,Variable,1,FOUND
4,Composite Function,1|3,FOUND
...
```

Formally, a learning graph is a 4-tuple \( G = (C, E, T, \tau) \):

- \( C \) is the finite set of named concepts
- \( E \subseteq C \times C \) is the set of directed prerequisite edges
- \( T \) is a small set of taxonomy categories (e.g. `FOUND`, `CORE`, `ADV`)
- \( \tau : C \rightarrow T \) assigns each concept to one category

\( (C, E) \) must form a DAG — no cycles — which guarantees a valid topological teaching order exists. Three properties fall out of that definition and do all the heavy lifting:

1. **Finite, enumerable context.** A 200-concept graph fits in 6–12 KB. The whole graph can ride in a single prompt for any realistic domain.
2. **Deterministic traversal.** Prerequisite chains are computed by BFS or DFS. Answers to structural questions are *functions*, not *predictions*.
3. **Closed vocabulary.** Returning only nodes from \( C \) means hallucinated entities are impossible by construction.

That third property is the part most worth pausing on. RAG and GraphRAG can — and do — invent entities under load. CKG cannot, because the only thing it can hand back is a node that exists in the CSV. The hallucination rate isn't *low*; it's *zero*.

## The headline numbers

Macro-averaged across all 44 domains and all five query types:

| System | Macro F1 | Tokens / query | RDS (F1/tok) | Total cost |
|--------|---------:|---------------:|-------------:|-----------:|
| RAG | 0.1231 | 2,982 | 0.0000482 | \$76.23 |
| GraphRAG | 0.1200 | 3,450 | 0.0000452 | \$44.43 |
| **CKG** | **0.4709** | **269** | **0.00201** | **\$7.81** |

CKG delivers **3.8× higher F1 than RAG** and **3.9× higher than GraphRAG**, while consuming **11× fewer tokens than RAG** and **13× fewer than GraphRAG**. The retrieved-context size gap is even sharper: RAG drops a mean of 2,392 tokens of chunk text into the prompt; CKG drops 44. That's a **54×** difference in context bloat for *worse* answers.

The compound metric the paper introduces — the **Reasoning Density Score** — captures both axes in one number:

\[
\mathrm{RDS}(s, q) = \frac{F_1(s, q)}{\text{tokens\_consumed}(s, q)}
\]

CKG's RDS advantage is **42× over RAG** and **44× over GraphRAG**. RDS is the metric that matters for production: it asks "how much correct answer do I get per dollar of tokens?" rather than "how many tokens did I retrieve?"

## The counterintuitive result: deeper questions get *better*

Most retrieval systems degrade as the question requires more hops. RAG has to stitch together transitive relationships from prose that wasn't written to be stitched. The longer the chain, the more the inference frays.

CKG goes the other way:

| Hop depth | RAG F1 | CKG F1 |
|-----------|-------:|-------:|
| 0 | 0.073 | 0.374 |
| 1 | 0.066 | 0.519 |
| 2 | 0.226 | 0.573 |
| 3 | 0.138 | 0.671 |
| 4 | 0.166 | 0.751 |
| 5 | 0.170 | **0.772** |

The deepest chains produce the **highest** accuracy for CKG. This isn't subtle, and it isn't a measurement artifact. It happens because BFS/DFS over an explicit edge set doesn't get harder with depth — it just visits more nodes. A 5-hop prerequisite path is as deterministic to compute as a 1-hop one.

For RAG, every additional hop multiplies the chance that the relevant relationship lives in a chunk that didn't make the top-5 cut. The two architectures aren't on the same scaling curve.

!!! mascot-thinking "Why depth helps a graph and hurts a text index"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Pemba thinking">
    Imagine asking "what does *Composite Function* eventually depend on?" RAG has to find a chunk that mentions Composite Function, then *another* chunk for each prerequisite, then chase each of those upward — all through embedding similarity over prose written for human readers. CKG just runs one DFS from node 4. The graph already knows. That's the entire trick: when a question is structural, you want a structure, not a search.

## Where CKG loses (the negative control)

The paper deliberately includes a query type CKG should *fail* on: T1 entity lookup. "Define composite function in two sentences." The CKG can return the node — it cannot return prose.

| Query type | RAG F1 | CKG F1 |
|------------|-------:|-------:|
| T1 entity lookup | 0.094 | 0.207 |
| T2 dependency | 0.078 | 0.634 |
| T3 path | 0.201 | 0.660 |
| T4 aggregation | 0.286 | **0.964** |
| T5 cross-concept | 0.115 | 0.323 |

CKG's T1 score is intentionally low. The paper calls this a *designed negative control*: a benchmark that didn't include a category where the structural approach loses would be rigged. The honest read is "CKG dominates structural questions; for explanatory questions, you still want prose." This is what motivates a hybrid: route T1 to RAG and T2–T4 to CKG.

## Why the win is *structural*, not domain-specific

The benchmark's Track 2 settles a fair objection. Maybe CKG only works because the McCreary corpus was hand-curated by someone who knew exactly what to include. To test this, the authors built a CKG entirely *programmatically* — from the ClinicalTrials.gov API, no expert annotation — for GLP-1 / obesity pharmacology.

The pipeline-generated CKG hit **macro F1 = 0.5298**, *exceeding* the hand-curated Track 1 average by 12.5%, and preserving a **28× RDS advantage** over RAG on the same domain. The conclusion: **the structural advantage doesn't depend on manual curation**. It depends on whether the domain admits a DAG.

## The build-cost objection — and why it just collapsed

The traditional objection to structure-first retrieval has been the same for two decades: *"Curating a domain graph is prohibitively expensive."* That was empirically true when graphs cost a team of experts weeks of work.

The CKG paper measures it directly. Across nine recorded sessions of an agentic learning-graph generator running on Claude Opus 4.6:

- Mean cost: **\$13.94** per graph
- Range: **\$9.21 – \$21.38**
- Mean concept count: 311

A least-squares fit yields:

\[
\mathrm{Cost}_{\mathrm{Opus\;4.6}}(n) \approx \$8.16 + \$0.019 \cdot n
\]

A 200-concept domain graph costs roughly **\$12 of compute**. SME review takes 2–4 hours of human time. That's four to five orders of magnitude below historical expert-curation cost — and the per-query savings (Section above: \$76 vs \$8 across 7,758 queries) pay back the build cost in the low thousands of queries.

The paper projects a 2027 cost of **\$1–\$2 per 200-concept graph** once two compounding trends play out:

1. Intelligence-per-dollar at the frontier has roughly halved every 9–12 months.
2. The current generation workflow re-attaches the growing graph to every assistant turn, producing a super-linear token term. A cache-efficient rewrite (concepts first, dependencies batched, taxonomy last) reduces consumption 2–3× at any model tier.

At \$1–\$2 per graph, the build cost is irrelevant relative to any downstream inference workload.

## The token-efficiency takeaway

The CKG result is a clean instance of the principle this textbook keeps returning to: **the cheapest token is the one you didn't retrieve**. RAG defaults are designed for unstructured corpora. The moment your domain has even a *little* explicit structure — a list of concepts, a prerequisite ordering, a taxonomy — the unit economics of retrieval shift dramatically.

Three concrete moves this case study suggests for any production retrieval stack:

1. **Audit your queries before tuning your retriever.** What fraction are structural (dependency, path, taxonomy aggregation) vs. explanatory (definition, summary)? If structural is more than ~30%, a CKG-style index is on the table.
2. **Measure RDS, not just F1.** A retriever that hits 0.50 F1 at 3,000 tokens/query and one that hits 0.45 F1 at 270 tokens/query are not "comparable" — the second is roughly 10× cheaper per correct answer at scale.
3. **Hybrid-route by query type.** Use the structured index for T2–T4 queries; fall back to RAG for T1. The benchmark suggests this hybrid would dominate either pure architecture on a mixed workload.

!!! mascot-warning "The footgun: defaulting to RAG without asking whether the question is structural"
    <img src="../../img/mascot/warning.png" class="mascot-admonition-img" alt="Pemba warning">
    Most teams reach for RAG by reflex because it's the documented happy path. The damage shows up later as a flat, hard-to-debug \$/query line that won't compress no matter how aggressively you rerank or chunk. The structural fix is to stop tuning the retriever and start asking what *shape* the question has. If it's "what depends on X" or "what does X depend on" or "list everything in category Y," you're paying RAG prices for an answer a 6 KB CSV could give you in 269 tokens.

## Cost math at production scale

Plugging the paper's per-query numbers into a realistic workload makes the architecture choice tangible. The paper's own example — an AI tutoring system serving 10,000 daily sessions with 5–10 retrieval queries each — implies 50,000–100,000 retrievals per day. At Claude Sonnet 4.6 input pricing of \$3 per million tokens:

\[
\text{Daily cost} = \frac{\text{queries/day} \cdot \text{tokens/query} \cdot P_i}{1{,}000{,}000}
\]

| System | Tokens/query | 100K queries/day | 30 days |
|--------|-------------:|-----------------:|--------:|
| RAG | 2,982 | \$894 | \$26,838 |
| GraphRAG | 3,450 | \$1,035 | \$31,050 |
| CKG | 269 | \$81 | \$2,421 |

The monthly delta — about **\$24,000** in retrieval input tokens alone — is more than the lifetime build cost of every learning graph in the McCreary corpus combined. And that's input tokens *only*; the savings on output tokens (CKG's tighter context produces tighter answers) compound on top.

## When the architecture *doesn't* fit

To stay honest, this technique has clear boundaries:

- **No stable taxonomy.** Rapidly evolving domains where concepts and relationships change weekly will outpace the SME review loop.
- **Open-ended explanatory queries dominate.** If 90% of your traffic is "explain X like I'm five," CKG has nothing prose-y to retrieve. Use RAG.
- **Relations beyond prerequisite are central.** The current CKG schema captures one edge type. Domains needing rich, typed relations (e.g. legal precedent graphs, biomedical interaction networks) need a schema extension that the paper flags as future work.
- **Single-shot, low-volume workloads.** The build cost only pays back if the graph is queried thousands of times. A one-off analysis isn't worth authoring a graph for.

## What to read next

The full benchmark, the McCreary corpus, and the evaluation harness are open-source under CC BY 4.0 / MIT.

- Paper repository: [github.com/Yarmoluk/ckg-benchmark](https://github.com/Yarmoluk/ckg-benchmark)
- Dataset: [huggingface.co/datasets/graphify-md/ckg-benchmark](https://huggingface.co/datasets/graphify-md/ckg-benchmark)
- Related chapter: [Chapter 15 — RAG Optimization](../../chapters/15-rag-optimization/index.md) for the RAG-side tuning levers (chunk size, top-K, reranking, hybrid retrieval) that this case study suggests you should consider *after* asking whether RAG is the right architecture at all.

!!! mascot-celebration "A small structure beats a big search"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Pemba celebrating">
    The CKG result is the kind of finding that makes a token-efficiency engineer's day: a 6 KB file beating a 2,000-token retrieval window on accuracy *and* cost, on a benchmark designed by people who tried hard to make the comparison fair. Cheap systems are happy systems — and a little graph, it turns out, saves a lot of tokens.

## Citation

Yarmoluk, D., & McCreary, D. (2026). *Benchmarking Knowledge Retrieval Architectures Across 44 Domains: RAG, GraphRAG, and Compact Knowledge Graphs.* CKG Benchmark v0.6.x. [github.com/Yarmoluk/ckg-benchmark](https://github.com/Yarmoluk/ckg-benchmark)

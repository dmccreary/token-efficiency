---
title: RAG Pipeline Cost Annotations
description: Horizontal RAG pipeline with live cost annotations at each stage; sliders adjust top-K and reranker N to surface the cost-leverage points.
image: /sims/rag-pipeline-cost-annotations/rag-pipeline-cost-annotations.png
og:image: /sims/rag-pipeline-cost-annotations/rag-pipeline-cost-annotations.png
twitter:image: /sims/rag-pipeline-cost-annotations/rag-pipeline-cost-annotations.png
social:
   cards: false
---

# RAG Pipeline Cost Annotations

<iframe src="main.html" height="602px" width="100%" scrolling="no"></iframe>

[Run the MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

A horizontal RAG pipeline (query → embed → vector search → rerank → prune → inject → generate) with live cost annotations at every stage. The injected-token count and total per-query cost recompute on every slider move so the highest-leverage stages — context injection and main-LLM generation — are visually obvious.

Toggle the reranker or pruning off to see the cost penalty (typically 4-10× more injected tokens). The "$" annotations on each node show where the bill actually accumulates: vector search and embedding are nearly free, the reranker is a thousandth of a cent, and the LLM generation dominates.

## How to Use

1. **Start at defaults** (K=20, N=5, reranker on, pruning on). Read the per-stage cost and the total. The total is roughly $0.014/query — typical for production RAG.
2. **Sweep K from 5 to 50.** Watch the candidate token count grow but the *injected* token count stay roughly constant (because reranker still narrows to 5).
3. **Sweep N from 1 to 20.** This is the slider that actually changes injected tokens — and therefore the LLM input cost.
4. **Disable reranker.** The full K chunks now flow through to context injection. Watch total cost roughly quadruple at K=20.
5. **Disable pruning** (with reranker still on). Less dramatic but still measurable. Pruning is the secondary tuning lever.
6. **Find your team's sweet spot.** The default settings produce ~$0.014/query. Could your team accept a higher K with a tighter reranker N, trading vector-search cost for LLM cost?

## Bloom Level

**Analyze (L4)** — examine where in the RAG pipeline retrieved tokens accumulate and identify the highest-leverage stages for cost reduction.

## Iframe Embed Code

```html
<iframe src="sims/rag-pipeline-cost-annotations/main.html"
        height="602px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Engineers building or tuning RAG systems on top of LLM APIs.

### Duration

15–20 minutes inside Chapter 15.

### Prerequisites

- Chapter 15 sections on chunking, top-K retrieval, reranking, and context pruning
- Chapter 3 sections on per-million-token pricing

### Activities

1. **Identify cost dominance (5 min).** At defaults, which stage costs the most? (Answer: LLM generation, dominating ~95% of the bill.)
2. **Reranker payoff exercise (5 min).** Disable the reranker. Compute the cost increase. Then ask: at what query volume does the reranker pay for itself if it costs $0.001/query but saves you $0.005/query in LLM input cost?
3. **K vs N sensitivity (5 min).** Set K=50, N=5. Compare to K=10, N=5. Discuss: how much does K really matter when reranker is on?
4. **Practice scenarios.**

### Practice Scenarios

| # | Configuration | Predict total $/query | Highest-leverage knob? |
|---|---|---|---|
| 1 | K=20, N=5, both on | ? | ? |
| 2 | K=20, N=5, reranker off | ? | ? |
| 3 | K=10, N=3, both on | ? | ? |
| 4 | K=50, N=10, both on | ? | ? |
| 5 | K=50, N=10, reranker off | ? | ? |

### Assessment

A learner has met the objective when they can identify (without the calculator) which stage of a given RAG configuration produces the most cost, predict the cost penalty of disabling reranker or pruning, and choose K/N values that match a target cost-per-query budget.

## References

1. Anthropic Cookbook — *RAG patterns* — discussion of chunking and reranking trade-offs.
2. Lewis et al. (2020). *Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks* — original RAG paper.
3. Cohere Reranker documentation — cross-encoder reranker pricing referenced here.
4. *Pinecone Learning Center: Optimizing RAG Performance* — practical operations guide.

---

## Senior Instructional Designer Quality Review

*Reviewer perspective: 15+ years designing engineering and data-science curricula for adult professional learners; expertise in Bloom's revised taxonomy, evidence-based assessment design, and accessibility of technical content.*

### Overall verdict

**Strong fit for the stated learning objective. Approve as-is for Chapter 15.** Score: **89/100 (B+).** The "live cost annotations on every stage" design choice is exactly what L4 "examine" demands — the learner cannot help but see *where* the cost is, and that's the key analytical skill for RAG cost tuning.

### What works (the pedagogy)

1. **Bloom alignment is correct.** L4 "examine" requires the learner to *break apart and see relationships*. The cost annotations make the per-stage decomposition unavoidable.
2. **Cost dominates visibility, not pipeline structure.** Most RAG diagrams show the structure first and bill second. This one inverts: the dollar amounts on each node make the cost lever immediately obvious.
3. **Disable-toggles for reranker and pruning.** Showing the cost penalty of disabling each is the comparison move L4 needs. The toggles are pedagogically equivalent to the natural question "what if I just skip this step?"
4. **K and N as separate sliders.** Most RAG demos conflate the two. Splitting them lets the learner see that K barely matters once the reranker is on.

### What needs follow-up (the gaps)

1. **No total-bill panel showing monthly cost.** Per-query cost is the local concern; monthly bill is what gets a budget approved or rejected. A "× 1M queries/month = $X/month" annotation would translate the per-query cost to budget-language. Score impact: −3.
2. **No comparison to no-RAG baseline.** A learner could ask: how much does RAG cost compared to just feeding the whole corpus into the system prompt? A toggle to "show no-RAG baseline" would make the savings of retrieval visible. Score impact: −2.
3. **Embedding cost is not adjustable.** Real production decisions include "should we use a cheaper embedding model?" — the current design treats embedding as a single fixed line. Score impact: −1.
4. **No latency annotations.** RAG is also a latency story (each stage adds delay). The cost-only framing is the right primary lens for this textbook, but a secondary "show latency overlay" toggle would round out the picture. Score impact: −2.

### Accessibility and clarity

- The cost annotations inside Mermaid nodes are 12px — readable but at the lower edge.
- Color choices (blue / purple / russet / green) are color-blind safe.
- Slider labels show numeric values at all times. ✓

### Cognitive load assessment

- 8 nodes + total. Tractable.
- 4 controls in the toolbar. At the edge of "no instructions needed."
- Live update on slider input means the learner gets immediate feedback — good for L4.

### Recommendation

**Approve for use in Chapter 15.** The four gaps are real but none are blockers; consider opening a follow-up ticket for the monthly-bill annotation (item 1) since it's the highest-impact pedagogical add. Ship.

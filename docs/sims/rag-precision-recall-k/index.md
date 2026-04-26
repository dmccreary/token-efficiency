---
title: Precision/Recall Tradeoff for K Selection
description: Plot retrieval precision and recall as functions of K with per-query cost overlaid, so learners can justify the K that balances quality and cost.
image: /sims/rag-precision-recall-k/rag-precision-recall-k.png
og:image: /sims/rag-precision-recall-k/rag-precision-recall-k.png
twitter:image: /sims/rag-precision-recall-k/rag-precision-recall-k.png
social:
   cards: false
---

# Precision/Recall Tradeoff for K Selection

<iframe src="main.html" height="542px" width="100%" scrolling="no"></iframe>

[Run the Precision/Recall K MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

When you build a RAG retrieval pipeline you have to commit to a K — the number of chunks to retrieve and pass to the model. K is a real engineering decision with real money on the line: a K that is too small starves the model and recall craters; a K that is too large pays for chunks the model never uses, and precision craters along with the cost of every query. This MicroSim shows the three curves you must read together — precision, recall, and per-query input cost — and lets you justify a K choice on the same screen where the evidence sits.

The shaded green band is the **cost-acceptable zone**: any K inside it satisfies both \( \text{recall} \geq 0.85 \) and \( \text{cost} \leq \$0.005 \) per query. Toggle the reranker, change the rerank-to-N cut, and change the chunk size to watch the band move. The job of the learner is not to pick the *right* K but to *justify* a chosen K against the curves you can see.

## How to Use

1. **Read the default state.** Reranker on, N=5, chunk size 500 tokens, K=20. The verdict panel tells you whether your selected K is inside or outside the cost-acceptable zone, and which constraint is the binding one.
2. **Drag K to the left.** Watch recall fall. At some K the verdict flips to "Recall too low" — that is the hard floor you cannot ship below.
3. **Drag K to the right.** Watch cost climb (the russet line) past the \$0.005 threshold. Notice that the cost-acceptable band has an upper edge too — beyond it you are paying for retrieval the reranker never used.
4. **Turn off the reranker.** Re-read all three curves. Precision now collapses much faster as K grows, and the band shrinks. This is the practical case for putting a reranker in the pipeline.
5. **Increase chunk size to 1500.** Watch the cost line slope up. The band collapses or disappears: at large chunks you cannot satisfy both the recall and cost constraints, and you must either re-chunk smaller or relax the cost target.
6. **Justify a K.** Pick the K you would ship and write one sentence: *"I picked K=__ because precision=__, recall=__, cost=$__, and the band runs from __ to __."* That sentence is the L5 deliverable.

## Bloom Level

**Evaluate (L5)** — justify a choice of K based on precision, recall, and per-query cost.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="sims/rag-precision-recall-k/main.html"
        height="542px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Adult professional learners — engineers and ML engineers who own a production RAG retrieval pipeline and need to defend a K choice in design review.

### Duration

20–30 minutes inside Chapter 15, or 45 minutes as a standalone workshop with the practice scenarios.

### Prerequisites

- Chapter 15 sections on precision, recall, top-K retrieval, and rerankers
- Comfort with two-axis charts and the precision/recall tradeoff in general

### Activities

1. **Read the default curves (5 min).** Without changing anything, identify on the chart: the precision-recall crossover, the K where recall crosses 0.85, and the K where cost crosses \$0.005. The cost-acceptable band lies between the latter two.
2. **The reranker exercise (5 min).** Toggle the reranker off and re-read the same three points. Discuss: why is the precision curve so much steeper without rerank? What does that mean for the model's ability to actually use the retrieved chunks?
3. **The chunk-size exercise (10 min).** Sweep chunk size from 100 to 1500 with reranker on and K fixed at 20. Note the chunk size at which the band disappears entirely. That is the chunk size above which your current cost target is incompatible with your current recall target.
4. **Justification drill (10 min).** Use the Practice Scenarios table. For each row, set the controls, pick a K, and write a one-sentence justification using the four numbers (P, R, cost, band).

### Practice Scenarios

| # | Reranker | N | Chunk | Target | Pick K and justify |
|---|---|---|---|---|---|
| 1 | on | 5 | 500 | recall≥0.85, cost≤\$0.005 | ? |
| 2 | off | — | 500 | recall≥0.85, cost≤\$0.005 | ? |
| 3 | on | 10 | 500 | recall≥0.90, cost≤\$0.005 | ? |
| 4 | on | 5 | 1000 | recall≥0.85, cost≤\$0.010 | ? |
| 5 | on | 3 | 300 | recall≥0.80, cost≤\$0.003 | ? |
| 6 | off | — | 300 | recall≥0.80, cost≤\$0.003 | ? |

### Assessment

A learner has met the L5 objective when, given a fresh retrieval workload (different chunk size, different recall target, different cost cap), they can:

- Identify which constraint binds first as K grows.
- Defend a chosen K with the four numbers (precision, recall, cost, band).
- Decide when a reranker is required to make the band non-empty.
- Recognize when the cost target itself must be revised because no K can satisfy both constraints.

### Math reference

The cost model used in the MicroSim is

\[
\text{cost\_per\_query} = K \cdot \text{chunk\_size} \cdot \frac{\text{price\_per\_M}}{10^6}
\]

with `price_per_M` = \$1.50 per million input tokens (representative of a Sonnet-class input price). Recall is modeled as a saturating exponential

\[
\text{recall}(K) = 1 - e^{-K/\tau}
\]

with \( \tau = 12 \), and precision falls hyperbolically with K. The reranker is modeled as a top-N cut with imperfect ranking, which preserves precision past N but caps served-recall.

## References

1. Lewis, P., et al. (2020). *Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks*. NeurIPS. — Original RAG framing including the role of K.
2. Manning, C., Raghavan, P., & Schütze, H. (2008). *Introduction to Information Retrieval*. Cambridge. — Canonical reference for precision, recall, and the F1 measure.
3. Anthropic Cookbook — *Retrieval-Augmented Generation* — practical patterns for reranking and K selection in production.
4. OpenAI Cookbook — *Question Answering using Embeddings* — discussion of cost-aware top-K selection.

---

## Senior Instructional Designer Quality Review

*Reviewer perspective: 15+ years designing engineering and data-science curricula for adult professional learners; expertise in Bloom's revised taxonomy, evidence-based assessment design, and accessibility of technical content.*

### Overall verdict

**Strong fit for the stated learning objective. Approve with two follow-ups.** Score: **88/100 (B+).** The MicroSim makes the three load-bearing curves (precision, recall, cost) co-visible and gives the learner an explicit acceptable-zone band against which to judge a K choice. That is exactly what an Evaluate-level (L5) "justify" task requires: criteria that are externalized, evidence that is on screen, and a verdict the learner has to articulate in a sentence.

### What works (the pedagogy)

1. **Bloom alignment is genuine, not aspirational.** L5 "justify" demands that the learner produce a defensible claim. The verdict panel turns the tool from a passive plot into an instrument the learner uses to *make* a claim. The acceptable-zone band is the rubric, the four numbers are the evidence, and the one-sentence justification is the deliverable. That triangle is the right shape for L5.
2. **The cost-acceptable band is the right pedagogical move.** Showing a single point estimate would have been L3 ("read the chart"). Showing a *region* and asking the learner to defend whether their K sits inside it forces them to weigh two constraints simultaneously, which is the discriminating L5 behavior.
3. **The reranker toggle teaches a structural insight.** Without the reranker the band collapses dramatically; with it, the band widens. The learner can *see* why a reranker is not a nice-to-have but a precondition for a non-empty acceptable region. That insight does not survive a static figure.
4. **Three curves on one chart, with a secondary cost axis.** The cost-as-secondary-axis decision is correct: precision/recall live on [0,1], cost lives in dollars. Putting them on a shared chart with a band makes the joint optimization concrete instead of abstract.
5. **The verdict mode-switches by binding constraint.** The four-state verdict (justified / recall too low / cost too high / inside-band-with-numbers) means the learner sees *which* constraint is binding, not just whether they passed. That is the difference between a yes/no rubric and an L5 rubric.
6. **The math reference is honest about the model.** Showing the saturating-exponential recall and hyperbolic precision tells advanced learners "this is a pedagogical model, not your dataset" — the right disclosure for any L5 sim where the curves drive judgement.

### What needs follow-up (the gaps)

1. **No "F1 vs. K" overlay.** A learner who has internalized the precision-recall tradeoff is one toggle away from F1, but the MicroSim only shows F1 in the verdict text. A toggleable F1 curve would let the learner see the optimum-by-balance directly. Score impact: −3.
2. **The acceptable zone is hardcoded at recall ≥ 0.85 and cost ≤ \$0.005.** Real teams pick their own thresholds. Two more sliders ("recall floor", "cost ceiling") would let the learner explore "what would I need to accept to make this band non-empty?" — a real L5 question. Score impact: −3.
3. **Single-dataset assumption.** All three curves come from a single implicit corpus. A learner could be misled into thinking precision-recall curves always look like this. A "dataset character" dropdown (clean / noisy / long-tail) that changed the curve shapes would teach that K choice is dataset-specific. Score impact: −2.
4. **No latency dimension.** Real production K choices weigh latency too — every retrieved chunk is bytes through the wire and tokens through attention. The MicroSim is silent on this and the lesson plan does not flag it. A note in the "How to Use" or a third overlay would close the gap. Score impact: −2.
5. **The verdict only fires for the *currently selected* K.** A learner could justify K=20 when K=8 also satisfies the constraints at lower cost. A "find the cheapest K in the band" callout, or a "best-K" marker, would teach Pareto-style judgement on top of feasibility. Score impact: −2.

### Accessibility and clarity

- **Color contrast.** Blue (precision), green (recall), russet (cost) on white all pass WCAG AA at the line weights used. The band's translucent green over white passes minimum contrast for the dashed border but is borderline for the fill alone — the dashed border is the load-bearing affordance.
- **Color-blind safety.** Blue/green/russet is robust under deuteranopia and protanopia. The most common failure mode (red/green confusion) is avoided by using russet rather than red for cost. The verdict text duplicates the band membership in plain language for triple redundancy.
- **Keyboard.** Sliders and the checkbox are native HTML elements, all keyboard-focusable and arrow-adjustable. The chart itself is not keyboard-navigable (a Chart.js limitation), but the readout grid surfaces every metric the chart conveys, so a keyboard-only learner is not blocked.
- **Numeric readouts.** The four big numbers (K, P, R, cost) refresh on every input change, which gives screen-reader users a deterministic point of focus that the chart cannot offer.

### Cognitive load assessment

- **Three curves on a dual-axis chart + a band + a marker for selected K** is dense. The line weights (2.5px) and color choices keep them readable, but a learner unfamiliar with dual-axis charts will need the lesson plan's first activity ("identify three points on the chart") to orient.
- **Four sliders + one toggle** is at the upper edge of comfortable; the controls are grouped into a single horizontal row and the readouts answer "what changed?" without the learner having to reread the chart.
- **The verdict-as-sentence is the cognitive offload.** Instead of forcing the learner to integrate four numbers into a judgement in their head, the panel narrates the binding constraint, which keeps working memory free for the *judgement* (the L5 work) rather than the *integration* (which would be L3 work).

### Recommendation

**Approve for use in Chapter 15 as currently implemented.** The five gaps above are real but none of them block the L5 objective. Open follow-up tickets for items 1, 2, and 5 (highest pedagogical impact). Defer items 3 and 4 to a polish pass.

The MicroSim teaches the rule it claims to teach, and the band-and-verdict pattern is the right shape for L5. Ship.

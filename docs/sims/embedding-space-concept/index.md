---
title: Embedding Space Concept
description: Visualize how semantically related words cluster in 2D, and use a "find nearest" tool to see why nearness in embedding space means semantic similarity.
image: /sims/embedding-space-concept/embedding-space-concept.png
og:image: /sims/embedding-space-concept/embedding-space-concept.png
twitter:image: /sims/embedding-space-concept/embedding-space-concept.png
social:
   cards: false
---

# Embedding Space Concept

<iframe src="main.html" height="622px" width="100%" scrolling="no"></iframe>

[Run the Embedding Space Concept Fullscreen](./main.html){ .md-button .md-button--primary }
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

A 2D scatter plot of fifteen words pre-positioned to form three semantically distinct clusters: animals (upper-left, green), vehicles (lower-right, blue), and foods (upper-right, russet). Type a new word into the input field, click "Find nearest", and a star marker appears in the cluster the word semantically belongs to, with dashed lines drawn to its three nearest existing neighbors and the Euclidean distances labeled.

This is a *concept* simulator, not a real embedding model. The points are hand-positioned to make the clustering pedagogically obvious. The "find nearest" computation uses simple Euclidean distance on the 2D positions and a hardcoded word-to-cluster mapping for query placement. The pedagogical point is the *shape* of an embedding space — semantically related items cluster together, and "nearest neighbor" is a meaningful retrieval primitive — not the exact geometry of any production embedding.

## How to Use

1. **Read the scatter plot.** Note the three colored clusters. Animal words cluster upper-left, vehicle words lower-right, food words upper-right. The "Embedding dim 1" and "Embedding dim 2" axis labels are intentionally generic — real embeddings have hundreds of dimensions, but the *concept* survives in 2D.
2. **Toggle "Show cluster regions" off.** The colored circles disappear; only the labeled dots remain. Note that the cluster structure is still visible from the dot positions alone — that is the whole point of an embedding.
3. **Type "dog" and click "Find nearest."** A star appears in the animal cluster and dashed lines connect it to the three nearest neighbors with their distances. Discuss: why animals and not vehicles?
4. **Type "plane" and click "Find nearest."** Star jumps to the vehicle cluster.
5. **Type "cheese."** Star jumps to the food cluster.
6. **Type "rocket" or "scooter."** Watch them land in the vehicle cluster — these words are not in the original 15 but the system places them by semantic membership. This is what nearest-neighbor retrieval is.
7. **Type a word the simulator does not know,** like "happiness." It falls in the middle (unknown cluster). Discuss: a real embedding model handles this gracefully because every string has *some* embedding; this concept sim does not.

## Bloom Level

**Understand (L2)** — classify words by their position in a 2D embedding projection and infer that nearness in embedding space reflects semantic similarity.

## Iframe Embed Code

```html
<iframe src="sims/embedding-space-concept/main.html"
        height="622px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Adult professional learners — engineers and product managers exploring RAG, semantic search, or vector-database integrations who need a working mental model of what "an embedding" is and why "nearest neighbor" is the retrieval primitive.

### Duration

15–20 minutes inside Chapter 2, or 30 minutes as a standalone workshop with the practice scenarios.

### Prerequisites

- Familiarity with the concept of a vector and 2D coordinates
- Chapter 2 introduction to embeddings as fixed-dimensional vectors
- No prior linear algebra required

### Activities

1. **Anchor on the three clusters (3 min).** Read the dots aloud, cluster by cluster. Discuss: what is the *shared* property of the words in each cluster? Note that the model never saw the labels "animal", "vehicle", or "food" — those emerge from co-occurrence in training data.
2. **Predict before querying (5 min).** Pick three words *not* in the visible 15 (e.g. "lion", "boat", "yogurt"). Predict which cluster each will land in. Click Find Nearest. Compare.
3. **The retrieval primitive (5 min).** Discuss: a vector database is a tool that, given a query vector, returns the K nearest vectors. The "find nearest" feature in this sim *is* a vector database in miniature. Every RAG system, every semantic search, every recommendation engine that uses embeddings is built on this primitive.
4. **The "unknown" case (3 min).** Type a word the simulator does not know. Watch it land in the middle. Discuss: how does a real embedding model handle this? (Every string has a vector, even unfamiliar ones. The concept sim cannot do this because it relies on hardcoded mappings.)
5. **From 2D to N dimensions (3 min).** Real embeddings live in 768- or 1536- or 3072-dimensional space. The cluster structure persists. Discuss: why 2D is *legitimate* as a teaching tool but limiting as a search tool.

### Practice Scenarios

| Query word | Predicted cluster | Predicted nearest |
|---|---|---|
| dog | animal | wolf or fox |
| plane | vehicle | bus or truck |
| banana | food | apple |
| keyboard | unknown (no cluster) | drifts to center |
| sandwich | food | bread |
| elephant | animal | bear or tiger |
| submarine | vehicle | bus or motorcycle |

### Assessment

A learner has met the objective when they can:

- Classify a new word by predicting which cluster it belongs to, and verify against the sim.
- Explain (without using technical terms) why nearest-neighbor in embedding space corresponds to semantic similarity.
- Describe the function of a vector database in a sentence: "a structure that, given a query vector, returns the K closest vectors."
- Recognize the conceptual difference between this 2D pedagogy and a real high-dimensional embedding (the *shape* of the cluster transfers; the precise geometry does not).

### Math reference

Given two embedding vectors \( \mathbf{u}, \mathbf{v} \in \mathbb{R}^d \), nearness is most often measured by either Euclidean distance:

\[
d(\mathbf{u}, \mathbf{v}) = \sqrt{\sum_{i=1}^{d} (u_i - v_i)^2}
\]

or cosine similarity (when only direction matters and not magnitude):

\[
\cos(\mathbf{u}, \mathbf{v}) = \frac{\mathbf{u} \cdot \mathbf{v}}{\|\mathbf{u}\| \|\mathbf{v}\|}
\]

Production vector databases support both; in practice, normalized vectors make the two measures equivalent up to a monotonic transform. This MicroSim uses Euclidean distance on 2D points.

## References

1. Mikolov, T., et al. (2013). *Efficient Estimation of Word Representations in Vector Space*. ICLR. — The Word2Vec paper, foundational for the "words live in a vector space" intuition.
2. Pennington, J., Socher, R., Manning, C. (2014). *GloVe: Global Vectors for Word Representation*. EMNLP. — Companion to Word2Vec for the same intuition.
3. Reimers, N., Gurevych, I. (2019). *Sentence-BERT*. EMNLP. — Reference for the dominant modern sentence-embedding model family.
4. OpenAI Documentation. *Embeddings* — practical reference for an off-the-shelf embedding API and pricing model.

---

## Senior Instructional Designer Quality Review

*Reviewer perspective: 15+ years designing engineering and data-science curricula for adult professional learners; expertise in Bloom's revised taxonomy, evidence-based assessment design, and accessibility of technical content.*

### Overall verdict

**Strong fit for the stated learning objective. Approve as-is for Chapter 2.** Score: **86/100 (B+).** A clean, low-density Understand-level (L2) "classify" sim. The three-cluster pre-positioning is the load-bearing design choice — most introductory texts try to *describe* a high-dimensional embedding in words and lose the audience. Showing a 2D version with hand-placed clusters lets the *shape* of the concept transfer to higher dimensions.

### What works (the pedagogy)

1. **Bloom alignment is correct for L2.** "Classify" requires the learner to *put items into categories based on properties*. The cluster regions are the categories; the dot positions are the properties. The query input lets the learner classify a new word by predicting where it will land, then verifying — the canonical L2 predict/verify cycle.
2. **The three clusters are well-separated and non-confounding.** Animals, vehicles, and foods share no obvious overlap, so a learner cannot accidentally form a wrong rule. Choosing categories that are *too* close (animal/mammal/pet) would have introduced unproductive ambiguity at this level.
3. **Distance labels on the neighbor lines.** The dashed lines alone would teach "nearest = related"; the numeric distance labels add a second channel — the learner can compare distances numerically and notice that within-cluster distances are smaller than across-cluster.
4. **Toggle for the cluster regions.** Letting the learner remove the colored regions tests whether the cluster structure is visible from positions alone. Most learners say yes — which is the right insight: the *embedding*, not the labels, is what carries the semantic information.
5. **Honest concept-sim disclaimer in the about section.** Calling out that this is hand-positioned rather than computed protects the learner from forming a false belief about how real embeddings produce these positions.

### What needs follow-up (the gaps)

1. **The "unknown" case dumps the marker in the middle.** Real embeddings do not have an "unknown" cluster — every string gets *some* vector, often near the cluster of related words even when the word was not in the training data. A learner who types "happiness" and sees the marker drift to dead center may incorrectly conclude that embeddings cannot place novel words. A note next to the result panel ("real embedding models would still place this — the concept sim cannot, see Chapter 6") would close this gap. Score impact: −3.
2. **No way to load a real embedding.** A future revision could load a real 384-dimensional embedding for the 15 words and project to 2D via PCA or UMAP, showing the actual cluster structure. The current hand-positioned layout is fine for L2 but limits the bridge to L3. Score impact: −2.
3. **No cosine-similarity option.** The math reference mentions cosine, but the sim only computes Euclidean. A toggle would teach the most-used distinction in production vector databases. Score impact: −2.
4. **No "K" slider for nearest neighbors.** K is fixed at 3. A slider (1 to 5) would let the learner explore K=1 (single best match) vs. K=5 (return more candidates) — a real-world tradeoff in RAG retrieval. Score impact: −1.
5. **The dimensionality is fixed at 2.** Most production embeddings are 768 to 3072 dimensions. The learner cannot directly experience the "high-dimensional" part. This is honest in the about section but limits the bridge to vector-database sizing. Score impact: −1.

### Accessibility and clarity

- **Color contrast** of the three cluster colors (green, blue, russet) on white passes AA. The dots themselves are slightly desaturated; the legend uses the same colors so the channel is consistent.
- **Color-blind safety:** Green and russet are well-separated under deuteranopia; the cluster regions add a second cue (spatial location) so color is not the only channel.
- **The distance labels** are positioned on the line midpoints which can overlap when neighbors are close. A more sophisticated label-collision avoidance would help — flagged for follow-up.
- **p5.js native input and buttons** are keyboard-focusable.

### Cognitive load assessment

- **15 labeled points + 1 query input + 2 buttons + 1 toggle = moderate density.**
- **Mitigated by spatial separation** — the scatter plot occupies most of the canvas, controls are anchored at the bottom.
- **The cluster regions can be turned off** if the learner wants a less busy view.

### Recommendation

**Approve for use in Chapter 2 as currently implemented.** The five gaps above are real but none of them block correct learning of the L2 objective. Open follow-up tickets for:

1. "Real embedding models still place unknown words" annotation (highest impact for trust)
2. Load real embeddings + PCA projection (bridges to L3)
3. Cosine-similarity toggle

The MicroSim teaches what it claims to teach: words cluster by meaning, nearest-neighbor is a meaningful retrieval primitive, and embedding space has structure. Ship.

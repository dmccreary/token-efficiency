---
title: Cross-Vendor Token Count Drift
description: Side-by-side comparison of how Anthropic, OpenAI, and Gemini tokenize the same input, with a live per-vendor cost calculation that highlights the cheapest option.
image: /sims/cross-vendor-token-drift/cross-vendor-token-drift.png
og:image: /sims/cross-vendor-token-drift/cross-vendor-token-drift.png
twitter:image: /sims/cross-vendor-token-drift/cross-vendor-token-drift.png
social:
   cards: false
---

# Cross-Vendor Token Count Drift

<iframe src="main.html" height="822px" width="100%" scrolling="no"></iframe>

[Run the Cross-Vendor Token Count Drift MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

The same string of text does *not* tokenize the same way on every vendor. Anthropic's BPE, OpenAI's `cl100k_base` BPE, and Gemini's SentencePiece all carve text differently — and the differences are *systematic*, not random. English prose is roughly equivalent across vendors. Code is harder for some tokenizers than others. CJK (Chinese / Japanese / Korean) text often costs 1.3–1.7× as many tokens as the same meaning expressed in English. This MicroSim makes those differences visible.

Type or paste text into the box, or use the four sample loaders. Three side-by-side columns show the same content tokenized by each vendor (illustrative — not bit-exact) with the resulting token count. The bar chart at the bottom multiplies each count by the per-million-token price for the selected model tier and highlights the cheapest vendor in green. The "cheapest by tokens" call-out and the "cheapest by dollars" call-out can disagree — that is the load-bearing pedagogy for an L5 evaluation.

## How to Use

1. **Load English prose.** Read the three columns. Confirm the counts are within ~10% of each other and the cheapest dollar cost depends mostly on the model tier you picked, not the tokenizer.
2. **Load Code snippet.** Notice that Gemini's count is now higher than the prose case relative to OpenAI and Claude. Punctuation in code (`{`, `}`, `(`, `)`) is handled differently by SentencePiece.
3. **Load Multilingual.** The Japanese characters explode the token count for all three vendors — and the *gap* between vendors widens. The non-Latin penalty is real.
4. **Load Long document.** A ~1,500-word document at the realistic-cost scale. Watch the dollar bars: the cheapest tokenizer for this shape is now the cheapest *vendor*.
5. **Switch model tiers.** Change Claude from Sonnet to Haiku. The bar shrinks significantly. Now switch GPT-4o to GPT-4o mini. Notice that "cheapest model" is not the same as "cheapest vendor" — the *combination* of tokenizer and rate determines the bill.
6. **Bring your own text.** Paste in a paragraph from your application. Use the recommendation line at the bottom of the cost panel.

## Bloom Level

**Evaluate (L5)** — assess which vendor offers the lowest cost for a given content shape by comparing tokenizations across all three vendors and applying a model-tier rate card.

## Iframe Embed Code

```html
<iframe src="sims/cross-vendor-token-drift/main.html"
        height="822px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Adult professional learners — engineers and product leads making vendor-selection or model-tier decisions for production LLM workloads where per-token cost matters at scale.

### Duration

20 minutes inside Chapter 6, or 40 minutes as a standalone exercise on cross-vendor cost evaluation.

### Prerequisites

- Chapter 3 sections on tokenization (BPE, SentencePiece)
- Chapter 6 sections on the Gemini Ecosystem and per-vendor pricing
- Familiarity with one vendor's pricing page

### Activities

1. **Load each sample, name the cheapest (5 min).** For English / code / multilingual / long-document, predict the cheapest vendor by token count *before* you read the answer.
2. **Tier vs. tokenizer (5 min).** With a single sample loaded, swap the model selectors and watch the cost bars reorder. Articulate which factor — tokenizer count or model rate — dominates.
3. **The non-Latin tax (5 min).** Compare the multilingual sample to the English sample. Quantify the per-token penalty for Japanese.
4. **Bring your own (5 min).** Paste a representative input from your application. Note the recommendation. Sanity-check by reading the column headers.

### Practice Scenarios

| # | Content shape | Token gap | Cheapest tokenizer | Cheapest combo (with tier) |
|---|---|---|---|---|
| 1 | English prose, ~30 words | ±5% | usually Gemini | depends on tier |
| 2 | Code snippet (JS) | up to 20% | Claude or OpenAI | varies |
| 3 | Multilingual EN + JP | up to 30% | usually OpenAI | usually GPT-4o-mini at scale |
| 4 | Long technical doc (~1.5K words) | ±10% | usually Gemini Flash for cost | Gemini Flash |
| 5 | Code-heavy + comments | up to 25% | OpenAI for code | varies |
| 6 | Pure Latin prose, no code | ±5% | Gemini | Gemini Flash |

### Assessment

A learner has met the objective when they can:

- Identify which content shapes have the largest cross-vendor tokenizer gap.
- Distinguish "cheapest by token count" from "cheapest by dollar cost."
- Recommend a vendor + model tier combo for a described workload.
- Recognize that the non-Latin tokenizer penalty makes vendor selection content-dependent.

### Math reference

Per-input cost on vendor \(v\) with model \(m\):

\[
\text{Cost}(v, m, \text{text}) = \frac{\text{tokens}_v(\text{text})}{10^6} \cdot \text{rate}_{v,m}
\]

A pure tokenizer-count comparison (ignoring rate) gives the wrong answer when one vendor has a substantially cheaper tier. Always evaluate token count and rate together.

## References

1. Anthropic. *Claude tokenization* — overview of the tokenizer family.
2. OpenAI. *tiktoken* — `cl100k_base` and successor encodings.
3. Google Cloud. *Gemini tokenization* — SentencePiece behavior and the per-character cost guidance for non-Latin scripts.
4. Karpathy, A. (2024). *Let's build the GPT tokenizer* — concrete walkthrough of why BPE choices change token counts on the same input.
5. Anthropic Engineering Blog. *Building Effective Agents* — discussion of cost as the product of tokens × rate.

---

## Senior Instructional Designer Quality Review

*Reviewer perspective: 15+ years designing engineering and data-science curricula for adult professional learners; expertise in Bloom's revised taxonomy, evidence-based assessment design, and accessibility of technical content.*

### Overall verdict

**Approve for use in Chapter 6 with one caveat about the illustrative tokenizer.** Score: **86/100 (B).** This MicroSim does the right thing for an L5 "assess" — it gives the learner two competing signals (token count and dollar cost) and forces them to weigh both. The four sample loaders cover the main content shapes that produce vendor drift. The caveat is that the tokenizer counts are illustrative, not bit-exact, so the *direction* of the comparison is reliable but the *exact* numbers are not.

### What works (the pedagogy)

1. **Bloom alignment is correct.** L5 "assess" requires the learner to apply criteria and produce a judgment. This sim provides the criteria (count + rate) and asks for a vendor recommendation, with the worked computation visible.
2. **Tokens vs. dollars is the right frame.** A common error is to optimize on token count alone or rate alone; this sim shows both at once and the recommendation line tells you which dominated.
3. **Sample loaders cover the meaningful drift cases.** English / code / multilingual / long-document map to the four cases where vendor drift is materially different. The learner does not have to invent test cases.
4. **The per-column "Cheapest count" badge** is a separate signal from the "Cheapest dollar" recommendation, which directly teaches that the two questions can have different answers.
5. **Tier swappability is essential.** Without the model selectors the sim would teach only "compare tokenizers"; with them it teaches the full vendor-and-tier evaluation.

### What needs follow-up (the gaps)

1. **The tokenizers are illustrative, not bit-exact.** A learner who pastes their own input and uses the absolute number to make a decision will be off. A "(illustrative, not bit-exact)" disclaimer near the column headers would manage expectations. Score impact: −4.
2. **No per-vendor real tokenizer integration.** A future revision could call `tiktoken.js` for OpenAI to give bit-exact counts at least for that one column. Score impact: −3.
3. **No length normalization.** For very long inputs (the "Long document" loader), the chip view truncates at 80 chips. A "characters / tokens ratio" indicator below each column would help with longer inputs. Score impact: −2.
4. **No comparison with a fixed budget.** A "given a $1 budget, how many requests of this shape can each vendor handle?" overlay would be a powerful L5 framing. Score impact: −2.
5. **Output cost is excluded.** The bar chart only models input cost. For long-output workloads (chat, generation), the comparison can flip. Score impact: −2.
6. **No history of past inputs.** For a comparison exercise the learner often wants to flip between two inputs. A "snapshot" feature would help. Score impact: −1.

### Accessibility and clarity

- **Color-blind safety:** Russet / blue / green for the three vendors are distinguishable. The "cheapest" badge uses both color and explicit text.
- **The text area is keyboard-focusable** and the buttons are tabbable.
- **Chip rendering** uses semi-transparent fill plus a colored border — the pattern is visible without color in monochrome.
- **The textarea allows pasting** any content; teachers can build their own test cases.

### Cognitive load assessment

- **Three columns** with token chips. The chip view is dense; the count above each column is the primary read.
- **Three model selectors** + four sample buttons + one text area. ~9 interactive elements. At the upper edge but tractable.
- **Bar chart** at the bottom is a one-glance summary that complements the dense column view.

### Recommendation

**Approve for use in Chapter 6 as currently implemented**, with the addition of a "(illustrative)" disclaimer near the column headers as a P0 fix. Open follow-up tickets for items 2 (real tiktoken integration for OpenAI) and 5 (output-cost overlay) as P1 enhancements.

The MicroSim teaches the *judgment* an L5 sim is supposed to teach: which vendor for which input. The illustrative-tokenizer caveat is honest and the lesson plan disclaims it. Ship.

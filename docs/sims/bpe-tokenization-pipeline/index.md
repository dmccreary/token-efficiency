---
title: BPE Tokenization Pipeline
description: Step through the four stages a string passes through to become a token sequence - Unicode normalize, pre-tokenize, byte-init, and merge.
image: /sims/bpe-tokenization-pipeline/bpe-tokenization-pipeline.png
og:image: /sims/bpe-tokenization-pipeline/bpe-tokenization-pipeline.png
twitter:image: /sims/bpe-tokenization-pipeline/bpe-tokenization-pipeline.png
social:
   cards: false
---

# BPE Tokenization Pipeline

<iframe src="main.html" height="762px" width="100%" scrolling="no"></iframe>

[Run the BPE Tokenization Pipeline Fullscreen](./main.html){ .md-button .md-button--primary }
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

A four-stage pipeline view of how raw text becomes a token sequence: Unicode normalize → pre-tokenize → initialize as bytes → apply merge rules in order. The example string "Write a haiku about café pandas." threads through every stage so the learner can see the *same* input transformed by *one* operation at a time. Stage 4 is the interactive heart of the sim — step forward through four merges and watch the byte sequence "h a i k u" collapse into the single token "haiku".

This separation is pedagogically load-bearing because each stage is responsible for a different class of cross-vendor token-count drift. NFC normalization is why the same string stored in different editors can produce different token counts. Pre-tokenization rules are why "don't" splits one way for cl100k and another way for SentencePiece. Merge ordering is why the same vocabulary size can produce wildly different per-string counts. By the time a learner finishes this sim, "the tokenizer is a black box" has become "the tokenizer is four boxes, each with a job."

## How to Use

1. **Read the four stages top to bottom.** Each stage shows its input on the left and its output on the right (or merges in place for stage 4).
2. **Inspect Stage 1 (NFC).** Note the warning that "é" can be encoded two ways. NFC normalization is the silent step that makes "café" produce one token regardless of how the editor saved the file.
3. **Inspect Stage 2 (pre-tokenize).** The amber chips have leading spaces (· prefix); the blue chips do not. The pre-tokenization rule is what determines whether "panda's" splits at the apostrophe or not.
4. **Inspect Stage 3 (byte init).** Note that "haiku" starts as five separate byte tokens. This is the *worst case* — every merge that fires in stage 4 reduces the count.
5. **Click "Step Forward" four times** and watch "h" + "a" → "ha", then "ha" + "i" → "hai", then "hai" + "k" → "haik", then "haik" + "u" → "haiku". By step 4 the chunk is one token.
6. **Click "Step Back"** to walk backwards. Watch each merge undo. Discuss: this is reversible because the merge rules are deterministic.
7. **Type a different string** in the input. Stage 1 and 2 update live. Stage 4 always demonstrates merging on the literal chunk "haiku" — it is the canonical pedagogy example.

## Bloom Level

**Understand (L2)** — explain the role of each stage in the tokenization pipeline and identify which stage is responsible for which class of cross-vendor token-count differences.

## Iframe Embed Code

```html
<iframe src="sims/bpe-tokenization-pipeline/main.html"
        height="762px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Adult professional learners — engineers and ML engineers building multi-vendor LLM pipelines who need to understand *why* the same text produces different token counts on Claude vs. GPT vs. Gemini.

### Duration

20–30 minutes inside Chapter 2, or 45 minutes as a standalone workshop with the practice scenarios.

### Prerequisites

- Chapter 1 introduction to tokens
- Chapter 2 sections on Unicode and byte-pair encoding
- Familiarity with the concept of a vocabulary

### Activities

1. **Anchor on the four stages (3 min).** Read the four stage labels aloud. Discuss: which stage is "the BPE algorithm" proper? (Only stage 4 — the others are pre-processing.)
2. **NFC sensitivity (5 min).** Explain that "é" can be one Unicode codepoint or two. Discuss: which stage handles this? What happens if a vendor *forgets* to normalize? (You get phantom token-count differences for the same visible string.)
3. **Pre-tokenization rules (5 min).** Inspect stage 2. Note the leading-space chips. Discuss: this is *configurable* in real tokenizers. cl100k splits "don't" differently from SentencePiece; that is a stage-2 difference, not a stage-4 difference.
4. **Byte init demonstration (3 min).** Stage 3 shows the worst case: every byte is its own token. The job of stage 4 is to compress this.
5. **Step through the merges (5 min).** Click Step Forward four times. Note that the merge rules apply *in order*. The order is fixed by training; you cannot change it post-hoc.
6. **Cross-vendor differences exercise (5 min).** Use the table below.

### Practice Scenarios

| Scenario | Stage responsible for the difference |
|---|---|
| "café" tokenizes differently in two editors | Stage 1 (NFC) |
| "don't" tokenizes differently on Claude vs. GPT | Stage 2 (pre-tokenize) |
| "supercalifragilistic" tokenizes to 5 tokens on one vendor and 3 on another | Stage 4 (merge order) |
| Emoji tokenize as 1 vs. 4 tokens depending on vendor | Stage 3/4 (byte coverage) |
| "https://example.com" tokenizes inconsistently | Stage 2 (pre-tokenize on punctuation) |

### Assessment

A learner has met the objective when they can:

- Name the four stages of a BPE tokenization pipeline in order.
- Given a class of cross-vendor token-count difference (Unicode, punctuation, vocabulary, byte-coverage), identify which stage is responsible.
- Explain why merge order matters (and why it cannot be changed without retraining).
- Recognize that "the tokenizer" is not a single algorithm but a four-stage pipeline whose stages can be configured independently.

### Math reference

For BPE training, given a corpus and a target vocabulary size \( V \), the algorithm:

1. Initialize the vocabulary as the set of all unique bytes (256 entries).
2. Count adjacent byte-pair frequencies across the corpus.
3. Merge the most frequent pair into a new token; add it to the vocabulary.
4. Repeat step 2–3 until the vocabulary reaches size \( V \).

The merge order is the *training output*; at inference time, merges are applied in the same fixed order.

## References

1. Sennrich, R., Haddow, B., Birch, A. (2016). *Neural Machine Translation of Rare Words with Subword Units*. ACL. — The foundational BPE paper.
2. Karpathy, A. (2024). *Let's build the GPT tokenizer* — accessible long-form video on the BPE pipeline.
3. Kudo, T., Richardson, J. (2018). *SentencePiece: A simple and language independent subword tokenizer and detokenizer for Neural Text Processing*. EMNLP demo. — Reference for the SentencePiece variant.
4. Unicode Consortium. *Unicode Normalization Forms (UAX #15)* — reference for NFC and the combining-character problem.

---

## Senior Instructional Designer Quality Review

*Reviewer perspective: 15+ years designing engineering and data-science curricula for adult professional learners; expertise in Bloom's revised taxonomy, evidence-based assessment design, and accessibility of technical content.*

### Overall verdict

**Strong fit for the stated learning objective. Approve as-is for Chapter 2.** Score: **88/100 (B+).** This is a clean four-stage pipeline diagram with one interactive stage. The decomposition is the right pedagogical move — most introductory texts treat tokenization as a single black-box step, and a learner who finishes this sim has a working mental model that the BPE algorithm proper is just *one* of four stages.

### What works (the pedagogy)

1. **Bloom alignment is correct for L2.** "Explain" requires the learner to *describe in their own words*. The four-stage decomposition gives them the vocabulary; the per-stage labels and sublabels give them the concept boundaries; stage 4's step-through gives them the kinetic intuition for the merge algorithm.
2. **The same input threads through all four stages.** This is the load-bearing pedagogy. A learner can see *café* survive normalization in stage 1, get pre-tokenized in stage 2, and understand that stages 3 and 4 are operating on the same string they typed at the top.
3. **Stage 4 is the only interactive stage.** This is the right design call. Stages 1–3 are display-only because there is nothing for the learner to *do* — they are deterministic transforms. Stage 4 has degrees of freedom (merge order, merge step) and rewards interaction.
4. **The merge rule callout** ("Just applied: ha + i → hai") is the right level of explicitness. A learner who clicks Step Forward and sees only the chip update would miss the point. Naming the rule that just fired makes the merge algorithm legible.
5. **Reversibility via Step Back.** Letting the learner walk backwards through the merges teaches that the algorithm is deterministic and reversible-given-the-rules. Most live BPE demos don't allow this.

### What needs follow-up (the gaps)

1. **Stage 4 always demonstrates "haiku".** Typing a different input in the box updates stages 1 and 2 but not stage 4. A learner who types "supercalifragilistic" might expect to see *that* word merge. The current behavior is honest (the merge sequence is hardcoded) but a learner unaware of this will be confused. A note on stage 4 ("merge demo always uses 'haiku' chunk") would close this. Score impact: −3.
2. **The merge rules are not derived from a real tokenizer.** "h+a → ha, ha+i → hai, ..." is a pedagogical sequence, not the actual merge order any real BPE produces. A learner who *also* uses tiktoken or a real BPE library may see different splits and lose trust in this sim. The lesson plan should note this. Score impact: −2.
3. **No way to see how the same string differs between BPE and SentencePiece.** The companion sim "interactive-tokenizer-explorer" handles this, but a cross-link would make the lesson plan stronger. Score impact: −1.
4. **The byte-init stage shows characters, not bytes.** The "U+0068" labels are codepoints, not bytes. For ASCII this is the same thing, but for non-ASCII (the "é" in "café") one codepoint is multiple UTF-8 bytes. A small "(UTF-8 bytes)" annotation would make this rigorous. Score impact: −2.
5. **No visible vocabulary size.** A learner does not see how big the vocabulary is, only that merges happen. A small annotation ("typical BPE vocabulary: 50,000–200,000 entries") would set the scale. Score impact: −1.

### Accessibility and clarity

- **Color contrast** of the chip backgrounds (light blue for byte chips, amber for leading-space chips) against dark gray text is AA-compliant.
- **The merge highlight** uses both a color change (amber) and a stroke (orange border), so the cue is not color-only.
- **Step Forward / Step Back / Reset buttons** are p5.js native and keyboard-focusable.
- **The four-stage layout** is top-to-bottom, which matches reading order and is screen-reader friendly when paired with a future ARIA-label pass.

### Cognitive load assessment

- **4 stages on one screen + 1 input + 3 buttons + 1 step counter = high but tractable density.**
- **Mitigated by spatial separation** — each stage has its own bordered box and its own number badge.
- **The step counter (Step N / 4)** in stage 4 reduces uncertainty about how much further to click.

### Recommendation

**Approve for use in Chapter 2 as currently implemented.** The five gaps above are real but none of them block correct learning of the L2 objective. Open follow-up tickets for:

1. Annotation that stage 4 uses fixed "haiku" demo regardless of input
2. Cross-link to interactive-tokenizer-explorer for vendor comparison
3. UTF-8 byte rigor in stage 3

The MicroSim teaches what it claims to teach: BPE is a four-stage pipeline, each stage handles one class of cross-vendor difference, and the merge algorithm is deterministic and reversible-given-the-rules. Ship.

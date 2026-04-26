---
title: Interactive Tokenizer Explorer
description: Type any string and watch a tokenizer break it into chips, with live character / word / token counts and a tokenizer-family toggle.
image: /sims/interactive-tokenizer-explorer/interactive-tokenizer-explorer.png
og:image: /sims/interactive-tokenizer-explorer/interactive-tokenizer-explorer.png
twitter:image: /sims/interactive-tokenizer-explorer/interactive-tokenizer-explorer.png
social:
   cards: false
---

# Interactive Tokenizer Explorer

<iframe src="main.html" height="722px" width="100%" scrolling="no"></iframe>

[Run the Interactive Tokenizer Explorer Fullscreen](./main.html){ .md-button .md-button--primary }
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

A live tokenizer playground. Type or paste any text and the bottom panel shows the resulting token chips — each chip colored by the token's identity (so identical tokens share a color) and labeled with a synthetic token ID. The middle strip shows the three numbers that get confused most often: characters, words, and tokens.

The tokenizer in this sim is a *concept* tokenizer, not a real BPE/SentencePiece model. It approximates the *pattern* of subword splitting — short words are one token, medium words may split into two, long words into three — and shows how the same string produces slightly different counts under BPE-family vs. SentencePiece-family tokenizers. The pedagogical point is the *shape* of the tokenization, not the exact numbers a real cl100k or Gemini tokenizer would emit.

## How to Use

1. **Read the default state.** "Write a haiku about red pandas." appears in the input. Note the three counts: ~6 words, ~8 tokens, ~30 characters. Scan the chip area to see how each word was carved up.
2. **Type a long word** like "supercalifragilisticexpialidocious" into the input. Watch it split into 3 chips. Predict: how does this affect the tokens-per-word ratio?
3. **Click "Load: long document."** Read the new counts. Notice the avg-tokens-per-word ratio is around 1.3 — the canonical "1 word ≈ 1.3 tokens" rule of thumb for English prose.
4. **Click "Load: code snippet."** Note that the ratio jumps. Code is *less efficient* per token than prose because identifiers, punctuation, and indentation each cost their own chips.
5. **Click "Load: Japanese."** Note the ratio jumps even higher — non-Latin scripts often cost 2–4× more tokens per character than English.
6. **Switch the dropdown to SentencePiece.** Note that the same text produces a slightly different token count and that the leading-space marker changes from "·" to "_". This is the cross-vendor token drift that drives "the same prompt costs different amounts on different APIs."

## Bloom Level

**Understand (L2)** — interpret how a tokenizer segments text into subword units, and predict the token count of a string before sending it to an API.

## Iframe Embed Code

```html
<iframe src="sims/interactive-tokenizer-explorer/main.html"
        height="722px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Adult professional learners — engineers and product managers writing or operating LLM features who need a working mental model of how text becomes tokens and why "1 word = 1 token" is a dangerous simplification.

### Duration

15–20 minutes inside Chapter 1, or 30 minutes as a standalone workshop with the practice scenarios.

### Prerequisites

- Familiarity with the concept of a string and a character
- Chapter 1 introduction to tokens as the billing unit
- No prior knowledge of BPE or SentencePiece required

### Activities

1. **Anchor on the default (3 min).** Run the sim. Read the three counts. Compute the chars-per-token ratio for English prose. (Should be roughly 4.)
2. **Predict before you load (5 min).** Before clicking "Load: long document," predict the token count from the word count using the 1.3× rule of thumb. Click. Compare. Discuss the discrepancy.
3. **Code is expensive (5 min).** Click "Load: code snippet." Predict tokens-per-word. (It is much higher than 1.3 — usually 2.0+.) Discuss why: every identifier, every punctuation mark, every indent gets its own chip.
4. **Cross-language sticker shock (3 min).** Click "Load: Japanese." Note the token count vs. character count. Discuss: why are non-Latin scripts more expensive per token, and what does that mean for global products?
5. **Tokenizer-family drift (5 min).** Switch to SentencePiece on the long document. Note the count change. Discuss the implication: the same prompt sent to Claude vs. Gemini produces *different* billable token counts, even when the dollar-per-MTok price is the same.

### Practice Scenarios

| Scenario | Text | Predicted tokens | Actual |
|---|---|---|---|
| Short English prompt | "Write a poem about cats." | ? | ? |
| Long English prose (paragraph) | (use the long-document button) | ? | ? |
| Python code snippet | (use the code button) | ? | ? |
| Japanese sentence | (use the Japanese button) | ? | ? |
| Repeated-word string | "panda panda panda panda" | ? | ? |
| URL or path | "https://example.com/api/v1/users/42" | ? | ? |

### Assessment

A learner has met the objective when they can:

- Estimate (within 25%) the token count of an arbitrary English string from its word count, before sending it to an API.
- Identify the three text classes that break the 1.3× rule of thumb (code, non-Latin scripts, structured data) and adjust their estimate accordingly.
- Recognize that two LLM vendors with "the same price" may actually charge different amounts for the same prompt due to tokenizer differences.
- Spot leading-space tokens (· in BPE, _ in SentencePiece) and understand why "panda" and " panda" are different tokens.

### Math reference

For English prose, the empirical rule is approximately:

\[
\text{tokens} \approx \frac{\text{characters}}{4} \approx 1.3 \cdot \text{words}
\]

For code, this drops to roughly 2–3 characters per token. For non-Latin scripts (Japanese, Chinese, Arabic, etc.), it can be as low as 1 character per token, meaning 4× the cost of English on a per-character basis.

## References

1. Karpathy, A. (2024). *Let's build the GPT tokenizer* — accessible long-form video on BPE construction.
2. Sennrich, R., Haddow, B., Birch, A. (2016). *Neural Machine Translation of Rare Words with Subword Units* — the foundational BPE paper.
3. OpenAI Cookbook. *How to count tokens with tiktoken* — practical reference for the cl100k tokenizer.
4. Google Developers Documentation. *Gemini tokenizer* — practical reference for the Gemini SentencePiece tokenizer.

---

## Senior Instructional Designer Quality Review

*Reviewer perspective: 15+ years designing engineering and data-science curricula for adult professional learners; expertise in Bloom's revised taxonomy, evidence-based assessment design, and accessibility of technical content.*

### Overall verdict

**Strong fit for the stated learning objective. Approve as-is for Chapter 1.** Score: **88/100 (B+).** This is a clean Understand-level (L2) "interpret" sim: the learner manipulates input, observes the segmentation, and builds a mental model of why "tokens != words." The same-text-same-color treatment is the single best micro-pedagogy in the sim — it makes the "identical strings produce identical tokens" rule visible without anyone having to state it.

### What works (the pedagogy)

1. **Bloom alignment is correct for L2.** "Interpret" requires the learner to *make sense of* a representation. The chips-with-IDs view is a representation; the live recount on every keystroke is the interpretation loop. Slider-style L3 verbs would be wrong here — there is nothing to *apply*, only something to *understand*.
2. **The three-counter strip (chars/words/tokens)** is the load-bearing comparison. Most introductory texts just say "a token is a chunk of text" and move on. Showing all three counts at once forces the learner to confront that they are three *different* things and to discover the relationships empirically.
3. **The four pre-baked examples** (short / long / code / Japanese) cover the four token-economy regimes a real engineer needs to recognize: English prose, code, and non-Latin scripts have wildly different tokens-per-character ratios. Loading them with one click lets the lesson plan move quickly.
4. **Same-token-same-color** is the moment where caching makes sense even before anyone explains caching. The learner sees that "panda" appearing twice means two chips of the same color — i.e., the tokenizer is deterministic and identical strings produce identical IDs.
5. **The leading-space marker (·)** is small but pedagogically critical. A learner who never realizes that " panda" and "panda" are different tokens will be confused for the rest of the textbook. Surfacing it as a visible character closes that loop early.

### What needs follow-up (the gaps)

1. **The tokenizer is fake.** This is the deliberate spec choice (the sim says "concept tokenizer, not real model tokenizer") but a learner who *also* uses a real tokenizer (tiktoken, transformers tokenizer) will see different chip counts and may lose trust in this sim. A small footer disclaimer in the chip panel ("approximation — actual tokenizers will differ by 5–20%") would protect the learner. Score impact: −3.
2. **Hover-for-byte-length is in the spec but not implemented.** The spec says "hovering a chip shows its byte length." The current implementation does not. This is a real gap because byte length matters for non-Latin scripts where one Unicode codepoint can be 2–4 bytes. Score impact: −2.
3. **No way to see the underlying byte sequence.** A learner curious about *why* Japanese is so expensive cannot inspect the byte-level decomposition. A "show bytes" toggle would deepen the L2 objective without inflating it to L3. Score impact: −2.
4. **The token-ID display is decorative.** The IDs are computed from a hash, not from a real vocabulary, so they have no semantic meaning. A learner who memorizes "panda has ID 12345" is memorizing noise. Either remove the IDs, or replace them with a real vocab lookup. Score impact: −2.
5. **Long inputs get clipped.** The chip panel only shows the first ~40 chips before running out of room. The total count in the counter strip is correct, but a learner inspecting the long document cannot see the full chip layout. A scroll affordance would help. Score impact: −2.

### Accessibility and clarity

- **Color contrast** of the eight palette colors against black chip text is generally AA-compliant; the lighter colors (yellow, light blue) are at the threshold and would benefit from a darker outline.
- **Color-blind safety:** The same-token-same-color cue requires the learner to perceive color identity. For deuteranopes some palette pairs (red/green chips) will collapse. A redundant text-match indicator would help — e.g., a small underline on tokens that match the hovered token.
- **Keyboard accessibility:** The textarea, dropdown, and buttons are all native and keyboard-focusable.
- **The "·" and "_" leading-space markers** are subtle but visible and use Unicode glyphs that screen readers will pronounce.

### Cognitive load assessment

- **1 textarea + 1 dropdown + 4 buttons + 3 counters + chip panel = 8 elements.** At the upper edge of "no instructions" but tractable because the layout groups them logically.
- **Real-time updates on every keystroke** are the right interaction pattern for L2 understand — the learner sees the consequence of each character as they type, which builds intuition fast.
- **The counters strip uses three different colors** (slate, blue, russet) which is visually busy but matches the chip palette so the visual language is consistent.

### Recommendation

**Approve for use in Chapter 1 as currently implemented.** The five gaps above are real but none of them block correct learning of the L2 objective. Open follow-up tickets for:

1. Tokenizer disclaimer banner in the chip panel (highest impact for trust)
2. Hover-for-byte-length implementation
3. Replace synthetic IDs with real vocab lookup or remove them
4. Scrolling chip panel for long inputs

The MicroSim teaches what it claims to teach: tokens are not words, identical strings produce identical tokens, and tokenizer family matters. The same-color-for-same-token cue is the cleanest single piece of pedagogy in the sim. Ship.

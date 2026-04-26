---
title: Token Lifecycle from Input to Output
description: Step through how raw text becomes input tokens, gets processed once by the model, and is emitted as output tokens one at a time - the asymmetry that drives pricing.
image: /sims/token-lifecycle-flow/token-lifecycle-flow.png
og:image: /sims/token-lifecycle-flow/token-lifecycle-flow.png
twitter:image: /sims/token-lifecycle-flow/token-lifecycle-flow.png
social:
   cards: false
---

# Token Lifecycle from Input to Output

<iframe src="main.html" height="542px" width="100%" scrolling="no"></iframe>

[Run the Token Lifecycle Flow MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

The single most important asymmetry in LLM pricing — input tokens cost less than output tokens, by a factor of roughly 5× — is a direct consequence of *how* the model processes them. This MicroSim makes that visible. Five stages run left to right: raw text becomes input tokens, the model reads them all at once, then emits output tokens one at a time, then the output tokens get reassembled into text.

Press "Generate next token" to advance the output one chip at a time. Each newly emitted output chip carries a small "$" badge to make the pricing asymmetry literal. The legend at the bottom names the rule: blue chips are input (read once, in parallel, cheap); orange chips are output (generated serially, pricier).

## How to Use

1. **Read the layout left to right.** Five stages: Raw Text → Input Tokens → LLM → Output Tokens → Generated Text. The arrows are labeled with the operation that connects each pair.
2. **Note the input chips on the left half.** All six input tokens are visible from the start — they are read by the model in a single forward pass, in parallel. This is why input is cheap per token.
3. **Click "Generate next token."** One output chip lights up. Note the "$" badge appearing on each emitted output chip.
4. **Keep clicking.** The generated text on the right grows one word at a time. Watch the running counter at the bottom of the output panel: every increment costs roughly 5× what an input increment would cost.
5. **Click "Auto-play."** The remaining output tokens emit at one per ~600 ms. This pace is intentionally slower than a real model, so the autoregressive nature is visible.
6. **Click "Reset"** and try predicting how many output tokens this haiku will be. Compare to your prediction.

## Bloom Level

**Understand (L2)** — explain how raw text is converted to tokens, processed in parallel, and emitted autoregressively, including which stages are billed as input versus output.

## Iframe Embed Code

```html
<iframe src="sims/token-lifecycle-flow/main.html"
        height="542px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Adult professional learners — engineers, product managers, and finance teams who need to understand *why* output tokens cost more than input tokens, not just *that* they do.

### Duration

10–15 minutes inside Chapter 1, or 25 minutes as a standalone workshop with the practice scenarios.

### Prerequisites

- Familiarity with the concept of tokens as the billing unit (Chapter 1)
- General sense that LLMs produce text by predicting next words

### Activities

1. **Anchor on the layout (3 min).** Run the sim. Read the five stages left to right. Discuss: which arrow is "tokenize" and which is "detokenize"? Why are they at the *boundaries* of the model rather than inside it?
2. **Step the output (5 min).** Click "Generate next token" repeatedly. After each click, ask: did the input panel change? (No.) Did the model panel do new work? (Yes — one forward pass per output token.) This is the key insight: the input is processed *once*; the output is generated *N* times.
3. **Auto-play comparison (3 min).** Click auto-play. Note the steady tick of new output tokens. Discuss: this is what a streaming response looks like inside a real API call. The user sees the text appear word by word because that is literally how the model produces it.
4. **The pricing argument (5 min).** Now explain why output is ~5× input price. The model does N forward passes for N output tokens, but only 1 forward pass for any number of input tokens (up to context limit). The cost asymmetry is *baked into the math* of autoregressive generation, not an arbitrary pricing decision.
5. **The implication for cost optimization (3 min).** Discuss: which side of the lifecycle should a cost-conscious team optimize first? (Output, by far. Asking for shorter responses, using stop sequences, using lower max-tokens are all higher-leverage than shrinking the input prompt.)

### Practice Scenarios

| Scenario | Input tokens | Output tokens | Which side dominates cost? |
|---|---|---|---|
| Long-prompt classifier (1-token answer) | 2,000 | 1 | input |
| Short-prompt summary | 50 | 500 | output |
| RAG-retrieval Q&A | 4,000 | 200 | input (because of context) |
| Chat reply | 800 | 300 | output (because of 5× multiplier) |
| Code-generation request | 200 | 1,500 | output |

### Assessment

A learner has met the objective when they can:

- Distinguish input tokens (read once, parallel) from output tokens (generated serially) and explain *why* the cost asymmetry follows from the algorithm.
- Predict, given input/output token counts, which side dominates the cost for a given workload.
- Identify the highest-leverage cost optimization for a given workload (typically output reduction).
- Recognize that a streaming API response is literally one-token-at-a-time generation — not a presentation choice.

### Math reference

For a workload with input tokens \( I \), output tokens \( O \), input price \( p_I \), and output price \( p_O \approx 5 p_I \):

\[
\text{cost} = I \cdot p_I + O \cdot p_O \approx p_I \cdot (I + 5O)
\]

Therefore output tokens dominate the bill whenever \( O > I/5 \). For most chat workloads (short input, multi-paragraph output), this condition is met easily and output reduction is the higher-leverage lever.

## References

1. Vaswani, A., et al. (2017). *Attention Is All You Need* — the foundational Transformer paper, including the asymmetry between encoder (parallel) and decoder (autoregressive) operation.
2. Anthropic Pricing — current per-million-token rates for input vs. output across Claude model tiers.
3. OpenAI Platform Documentation — *Chat Completions* — explicit per-MTok input/output pricing.
4. Karpathy, A. *Let's reproduce GPT-2* — accessible long-form video on autoregressive generation.

---

## Senior Instructional Designer Quality Review

*Reviewer perspective: 15+ years designing engineering and data-science curricula for adult professional learners; expertise in Bloom's revised taxonomy, evidence-based assessment design, and accessibility of technical content.*

### Overall verdict

**Strong fit for the stated learning objective. Approve as-is for Chapter 1.** Score: **87/100 (B+).** A simple but pedagogically tight L2 "explain" sim. The five-stage left-to-right flow is the canonical pipeline diagram, and the click-to-generate interaction makes the autoregressive nature *kinetic* rather than just *described*. The "$" badge on emitted output tokens is the smallest possible visual cue for the cost asymmetry and it pays its weight.

### What works (the pedagogy)

1. **Bloom alignment is correct for L2.** "Explain" requires the learner to *describe in their own words*. The five-stage diagram with clear arrow labels gives the learner the vocabulary they need (tokenize, send, generate, detokenize) without requiring them to memorize it. Step-through builds the explanation kinetically.
2. **The cost asymmetry visualization is on the right axis.** Most introductory texts state "output is more expensive" and move on. Showing emitted output chips with "$" badges, while input chips have none, makes the rule visual and memorable.
3. **The "model" stage is the right level of abstraction.** A boxed "Attention + FFN" rectangle is enough to signal "transformer block" without inflating to a full model architecture diagram. A novice does not need to know about layers and heads to understand the lifecycle.
4. **Auto-play vs. step-through.** The two modes serve different learners. Step-through builds intuition for "one forward pass per output token." Auto-play shows what a streaming response feels like.
5. **The legend at the bottom names the rule.** Blue = input (read once, cheap); orange = output (one at a time, pricier). This is the load-bearing color semantics for the entire textbook and the legend ties it to the visual.

### What needs follow-up (the gaps)

1. **No way to vary input or output length.** A learner cannot ask "what if the input were 1,000 tokens?" without leaving the sim. A "long input" toggle that swaps the input strip for a stylized 1,000-token block (with a "..." placeholder) would let the lesson plan demonstrate the I/O ratio insight without inflating the sim past L2. Score impact: −3.
2. **No running cost meter.** The "$" badges are qualitative; an actual running total ("input cost: $0.0012, output cost: $0.0030") would let the learner *see* the 5× multiplier accumulate. The math reference handles this, but the sim itself is silent. Score impact: −2.
3. **The model stage is opaque.** A learner who wonders *what the model is doing* between stages 3 and 4 sees a box and a "processes input once; then generates one token at a time" caption. A small annotation like "the same forward pass is repeated for each output token" would make the autoregressive insight more explicit. Score impact: −2.
4. **No connection to streaming UX.** A learner who has used a chatbot has seen tokens appear word-by-word. The sim does not explicitly tie its auto-play to "this is what streaming is." A one-line caption ("this is exactly what 'streaming response' means") would close the connection. Score impact: −1.
5. **The haiku output is short.** Ten output tokens is enough to demonstrate the pattern but not enough to *feel* the cost. A "long response" alternative (50+ output tokens) would let the auto-play running counter visibly accumulate. Score impact: −1.

### Accessibility and clarity

- **Color contrast** of blue and orange chip backgrounds against dark gray text is AA-compliant. The "$" badge in russet on white is AAA.
- **Color-blind safety:** Blue (input) and orange (output) are well-separated under common color-blindness profiles. The "$" badge is also redundant with the orange color, so the cost cue is double-encoded.
- **The arrows have text labels** ("tokenize", "send", "generate", "detokenize") so the relationship between stages is not color-only.
- **p5.js native buttons** are keyboard-focusable.

### Cognitive load assessment

- **5 stages + 3 buttons + the simulation = lower-density than most.** Comfortably within working memory.
- **The visual flow is left-to-right** which matches the reading order of every Latin-script reader.
- **The model "box" simplification** is the right complexity for L2. A more detailed model diagram would inflate cognitive load past the objective.

### Recommendation

**Approve for use in Chapter 1 as currently implemented.** The five gaps above are real but none of them block correct learning of the L2 objective. Open follow-up tickets for:

1. Running cost meter that shows the 5× asymmetry accumulating (highest impact)
2. Long-response alternative for the auto-play demo
3. Annotation tying auto-play to streaming UX

The MicroSim teaches what it claims to teach: the lifecycle is asymmetric, input is read once, output is generated serially, and the cost asymmetry follows from the algorithm. Ship.

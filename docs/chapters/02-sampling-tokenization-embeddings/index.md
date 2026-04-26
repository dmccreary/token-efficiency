---
title: Sampling, Tokenization, and Embeddings
description: A deeper look at how text becomes tokens and vectors, and how sampling parameters control what the model emits — the mechanics behind every later cost optimization
generated_by: claude skill chapter-content-generator
date: 2026-04-25 20:37:04
version: 0.07
---

# Sampling, Tokenization, and Embeddings

## Summary

A deeper look at how text becomes numbers: byte-pair encoding mechanics, special tokens, multilingual and code tokenization, the embedding concept that underpins both retrieval and similarity, and the sampling parameters (temperature, top-p, logprobs) that control generation.

## Concepts Covered

This chapter covers the following 21 concepts from the learning graph:

1. Temperature
2. Top P Sampling
3. Logprobs
4. Model Family
5. Subword Tokenization
6. BPE Merge Rules
7. Token-To-Char Ratio
8. Whitespace Handling
9. Unicode Normalization
10. Special Tokens
11. End-Of-Sequence Token
12. Beginning-Of-Sequence Token
13. Padding Token
14. Token Boundary
15. Pre-Tokenization
16. Token Counting API
17. Local Token Estimation
18. Token Count Caching
19. Code Tokenization
20. Multilingual Tokenization
21. Embedding

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: LLMs, Tokens, and Generation Basics](../01-llms-tokens-generation-basics/index.md)

---

!!! mascot-welcome "Where Tokens Actually Come From"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Pemba waving welcome">
    Chapter 1 told you that tokens are the unit of account. This chapter opens up the box. By the end you'll be able to predict (within a few percent) how many tokens your prompt will use *before* you send it, explain why your French translation costs 2× what the English original cost, and tune `temperature` and `top_p` like you actually know what they do. Cheap systems start with accurate counts.

## Why Go Deeper

Most cost mistakes in LLM applications come from a fuzzy mental model of tokenization and a superstitious mental model of sampling. Engineers will copy a `temperature: 0.7` from a tutorial and never touch it again, or they'll estimate cost by dividing character count by 4 and be off by 30% on non-English traffic. This chapter fixes both problems by showing the actual mechanics: how subword tokens are constructed, what the special tokens do, where token counts come from, and how the sampling parameters actually shape the output distribution.

## Subword Tokenization in Depth

### From Characters to Subwords

Chapter 1 introduced **subword tokenization** as the family of algorithms (BPE, SentencePiece) that segment text into units smaller than words but larger than characters. The reason every modern LLM uses subwords rather than whole words or single characters is a tradeoff between two costs:

- **Whole-word tokenization** keeps prompts short (one token per common word) but produces a vocabulary of millions of words and breaks completely on any word it has not seen before — including every typo, every product name, every URL.
- **Single-character tokenization** handles any input but inflates token counts by roughly 4× and forces the model to learn spelling from scratch.

Subword tokenization splits the difference. Common words become single tokens. Rare words decompose into 2–4 known fragments. Nothing is ever out-of-vocabulary, because the worst case is one token per byte.

### BPE Merge Rules

The mechanism that produces the subword vocabulary is a list of **BPE merge rules**. During tokenizer training (done once by the vendor, not by you), the algorithm:

1. Initializes the vocabulary with every individual byte (256 starting tokens).
2. Counts every adjacent pair of tokens in the training corpus.
3. Picks the most frequent pair and adds a new token that represents their concatenation. This is one merge rule: `(t_a, t_b) → t_new`.
4. Repeats steps 2–3 thousands of times until the desired vocabulary size is reached.

At inference time — the part that matters for your bill — the tokenizer applies these merge rules in order to your input string. The tokenizer first breaks the text into initial pieces (one per byte), then walks through the merge rules and applies any that match adjacent positions, repeatedly, until no more merges fire. The final sequence of unmerged-and-merged units is your tokenization.

The practical consequence is that the *order* of training-time frequency determines token boundaries: the word "tokenization" might end up as `[token][ization]` in one tokenizer and `[tok][en][iz][ation]` in another, depending on which pairs were frequent enough during training to earn an early merge rule.

### Pre-Tokenization, Whitespace, and Unicode

Before BPE merge rules ever fire, the input goes through **pre-tokenization** — a preprocessing pass that splits the raw input on coarse boundaries (typically whitespace and punctuation) so that BPE never tries to merge across, say, the boundary between a word and the next sentence. Pre-tokenization rules vary by vendor and significantly affect token counts; this is one of the main reasons the same string produces different counts across tokenizers.

**Whitespace handling** is part of pre-tokenization, and it has one rule that confuses every newcomer: in most modern tokenizers, the leading space is *part of the following token*, not a separate token. The token for `" panda"` (with leading space) is a different ID than the token for `"panda"` (no space). This is why the same word at the start of a sentence and in the middle of a sentence may be tokenized differently — and why it's almost always more efficient to write `"a panda"` than `"a" + " " + "panda"` in code that constructs prompts.

**Unicode normalization** runs even earlier. Unicode allows the same visible character to be encoded in multiple byte sequences (the classic example is "café" — the "é" can be one composed code point or two combining code points). Without normalization, the tokenizer would treat these as different inputs and produce different tokens. Vendors normalize to a standard form (typically NFC or NFKC) before pre-tokenization, so two strings that look identical to a human tokenize identically.

A **token boundary** is the position in the original string where one token ends and the next begins. Because of pre-tokenization, leading-whitespace rules, and merge order, token boundaries do not align with word boundaries, character boundaries, or even byte boundaries in any predictable way. The diagram below shows the full pipeline:

#### Diagram: BPE Tokenization Pipeline

<iframe src="../../sims/bpe-tokenization-pipeline/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>BPE Tokenization Pipeline</summary>
Type: diagram
**sim-id:** bpe-tokenization-pipeline<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Show the four sequential stages a string passes through to become a token sequence (Unicode normalization → pre-tokenization → byte initialization → BPE merges), with a concrete example string visible at every stage.

Bloom Level: Understand (L2)
Bloom Verb: explain

Learning objective: Explain the role of each stage in the tokenization pipeline and identify which stage is responsible for which class of cross-vendor token-count differences.

Canvas layout:
- Vertical stack of four labeled stages, each with an input box and an output box
- A "Step Forward" / "Step Back" pair of buttons at the bottom

Stages:
1. "Unicode Normalize (NFC)" — input shows raw bytes including a combining character; output shows the normalized form
2. "Pre-Tokenize (split on whitespace + punctuation)" — input is the normalized string; output is a list of pre-token chunks like ["Write", " a", " haiku", "."]
3. "Initialize as bytes" — each pre-token chunk becomes a sequence of single-byte tokens
4. "Apply Merge Rules in order" — show 3–4 specific merge rules applying one at a time (e.g., "h"+"a"→"ha", "ha"+"i"→"hai", "hai"+"ku"→"haiku")

Data Visibility Requirements:
  Stage 1: Show normalized vs raw bytes side by side
  Stage 2: Show pre-token chunk list with leading-space pieces highlighted
  Stage 3: Show byte-level decomposition for one chunk in detail
  Stage 4: Show the merge rule that just fired ("ha" + "i" → "hai") with arrows on the affected positions
  Final: Show the resulting compact token sequence with its token count

Interactive controls:
- Text input: starting string (default "Write a haiku about café pandas.")
- Step Forward / Step Back buttons (advance one merge rule at a time in stage 4)
- Button: "Show all stages" / "Step through"

Instructional Rationale: Step-through with concrete data is appropriate for an Understand objective. Each stage shows the *same* input transformed by *one* operation, so learners can isolate which stage causes which effect.

Implementation: p5.js, responsive width, no continuous animation
</details>

## Special Tokens

In addition to the tokens that represent ordinary text, every tokenizer reserves a set of **special tokens** — tokens that don't appear in normal text but carry structural meaning to the model. You don't write these directly in your prompts; the API client adds them on your behalf based on message structure. But they are billed input tokens, so you need to know they exist.

The three most common special tokens:

- **Beginning-of-sequence token** (often written `<bos>`, `<s>`, or `<|begin_of_text|>`) — marks the start of a sequence. Some models require it; some don't.
- **End-of-sequence token** (often `<eos>`, `</s>`, or `<|end_of_text|>`) — marks the end of a sequence. When the model generates this token during output, it stops naturally — this is the "I'm done" signal that makes generation terminate without `max_tokens` cutting it off.
- **Padding token** (often `<pad>`) — used during *training* to pad shorter sequences in a batch up to the same length. Padding tokens almost never appear at inference time in API calls (the API handles batching internally), but they exist in the vocabulary.

Modern chat-style APIs add additional special tokens to mark message roles — things like `<|im_start|>system`, `<|im_start|>user`, `<|im_start|>assistant`, and `<|im_end|>`. These role-marker tokens are why a "1-token user message" actually costs more like 5–10 input tokens once the role wrapping is added.

The table below summarizes the special tokens you should know:

| Special Token | Symbol Examples | When Added | Billed? |
|---------------|-----------------|------------|---------|
| Beginning-of-sequence | `<bos>`, `<\|begin_of_text\|>` | Start of every request | Yes (1 token) |
| End-of-sequence | `<eos>`, `<\|end_of_text\|>` | End of model output (generated) | Yes (1 output token) |
| Padding | `<pad>` | Training only — not at inference | No (in API use) |
| Role markers | `<\|im_start\|>system`, etc. | Wrapping every chat message | Yes (~3–5 per message) |

!!! mascot-tip "The Hidden Per-Message Tax"
    <img src="../../img/mascot/tip.png" class="mascot-admonition-img" alt="Pemba sharing a tip">
    Every message in a chat-style request carries 3–10 special tokens of role-marker overhead. For applications that send hundreds of small messages (chat UIs, agent loops with many short tool turns), that overhead can outweigh the actual content. If you have a choice between sending one 200-token message and ten 20-token messages, the former is cheaper — same content, one set of role markers instead of ten.

## Counting Tokens Accurately

You cannot optimize what you cannot measure. Every cost decision in the rest of this book starts with knowing the token count of a given string — ideally before it leaves your service.

### Token Counting APIs vs. Local Estimation

There are two ways to get a token count:

- A **token counting API** is a vendor-provided endpoint (Anthropic's `/v1/messages/count_tokens`, Google's `count_tokens` method, etc.) that takes the same input as a regular request and returns the exact token count without actually running the model. These calls are usually free or extremely cheap, but they are network round-trips — adding 50–200 ms of latency per call.
- **Local token estimation** uses a tokenizer library installed in your application (OpenAI's `tiktoken`, Anthropic's published tokenizer, Google's tokenizer) to compute the count entirely in-process, with zero network latency. The library implements the same merge rules as the model, so the count is exact, not an estimate.

For interactive applications (chat UIs that show "1,250 / 200,000 tokens used" as the user types), local estimation is the only viable option. For one-off cost analysis or for vendors that don't publish a tokenizer library, the API is fine.

### The Token-to-Char Ratio Heuristic

Sometimes you don't have a tokenizer handy and you just need a rough estimate. The **token-to-char ratio** is a simple heuristic: divide the character count of your text by a constant to estimate the token count.

The constant depends heavily on the language and content:

- English prose: ~4 characters per token (so `tokens ≈ chars / 4`)
- English code: ~3.5 characters per token (code has more punctuation and symbols, which tokenize more aggressively)
- Spanish, French, German prose: ~3 characters per token (more accented characters, longer average words)
- Chinese, Japanese, Korean: ~1.5 characters per token (each CJK character often takes a full token)
- Arabic, Hebrew: ~2 characters per token

The heuristic is fine for back-of-envelope sanity checks ("will this 500,000-character document fit in a 200K context window?") but never use it for billing. It can be off by 30% in either direction depending on content, and small errors compound when you're computing per-feature unit economics.

### Token Count Caching

When you generate the same prompt repeatedly — a system prompt, a fixed instruction template, a stable few-shot block — there is no reason to re-tokenize it on every request. **Token count caching** is the practice of computing the token count once and storing it in a key-value cache (Redis, an in-process LRU, even a static constant) keyed by the prompt's hash.

This is not the same as the vendor's prompt cache (Chapter 14). Token count caching is purely a *client-side* optimization that saves CPU cycles in your token estimation logic. It matters in two cases: (1) high-throughput services where local tokenization shows up in CPU profiles, and (2) services that count tokens in tight loops to make routing decisions. For low-throughput services, don't bother — the savings are noise.

## Edge Cases: Code and Multilingual Text

### Code Tokenization

**Code tokenization** is a special concern for any application that processes source code (coding assistants, code review bots, doc generators). Code differs from prose in ways that hurt token efficiency:

- Indentation: each level of indentation is typically one token per space or one per tab. A deeply nested function can have 10–20% of its tokens devoted purely to whitespace.
- Punctuation density: parentheses, brackets, semicolons, operators, quotes — every one is usually its own token.
- Identifier fragmentation: `getUserById` may tokenize as `[get][User][By][Id]` (4 tokens) rather than the single token a common English word would get.

Modern model families (GPT-4o, Claude 3.5+, Gemini 1.5+) ship with tokenizers tuned for code, which substantially improves the indentation case (often using a single token for "4 spaces" or "8 spaces"). When choosing a model for a code-heavy workload, the per-token price is only half the story — the tokenizer's code efficiency is the other half.

### Multilingual Tokenization

**Multilingual tokenization** is the same concern, even more pronounced. Tokenizers trained predominantly on English produce 2–5× more tokens for the same semantic content in other languages. A 1,000-character paragraph in English might tokenize to 250 tokens; the same paragraph translated to Japanese might tokenize to 1,000 tokens or more on an English-centric tokenizer.

This affects pricing dramatically. If your product launches in a non-English market and you don't measure the tokenizer impact, you can find that your unit economics that worked in English are unprofitable in the new market — even though you're charging the same price per request. Always re-benchmark token costs when expanding into new languages.

## Sampling: How the Model Picks the Next Token

### Logprobs and the Output Distribution

We've been describing autoregressive generation as "the model predicts the next token." That phrasing is slightly imprecise. What the model actually produces at each step is a probability distribution over its entire vocabulary — typically 50,000 to 256,000 numbers, each saying "here is how likely each token is to come next." A **logprob** (log-probability) is the natural logarithm of that probability for a given token. Vendors expose logprobs as an optional response field; with logprobs enabled, you can see the model's top-N candidate tokens at each position along with their probabilities.

Logprobs are the raw material for two important applications:

- **Confidence-based routing** (Chapter 17): if the top token's logprob is much higher than the second-place token, the model is confident; if the top two are nearly tied, the model is uncertain and you might escalate to a stronger model.
- **Constrained generation**: by examining logprobs, you can detect that the model is about to produce malformed output and intervene before it does.

Logprobs are not free — requesting them adds a small amount to the response payload — but for cost-routing applications they are cheaper than the alternative (running a second model just to verify the first).

### Temperature and Top-P Sampling

Given the probability distribution, *something* has to pick a single token to actually emit. That something is the sampling strategy. The two parameters that control it on every modern API are temperature and top-p.

**Temperature** is a number (typically 0.0 to 2.0) that scales the sharpness of the probability distribution before sampling. At `temperature=0`, the model deterministically picks the highest-probability token every time — output is repeatable but boring. At `temperature=1.0`, the distribution is unchanged from the model's raw prediction. At `temperature=2.0`, the distribution is flattened, making low-probability tokens much more likely — output becomes creative, surprising, and often nonsensical.

**Top-P sampling** (also called nucleus sampling) is a complementary cutoff: instead of considering the entire vocabulary, the model considers only the smallest set of tokens whose combined probability exceeds `p`. With `top_p=0.9`, the model picks from only the most likely tokens that together account for 90% of probability mass. This filters out the long tail of unlikely tokens that flat-temperature sampling can occasionally produce.

These two settings are not redundant — they compose. A common production pattern is `temperature=0.7, top_p=0.9`, which gives moderate creativity (temperature) while excluding the most absurd outputs (top-p). For deterministic workloads (code generation, structured extraction, tests), use `temperature=0` and don't worry about top-p.

The MicroSim below lets you see both parameters in action:

#### Diagram: Sampling Parameter Explorer

<iframe src="../../sims/sampling-parameter-explorer/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Sampling Parameter Explorer</summary>
Type: microsim
**sim-id:** sampling-parameter-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Let learners adjust temperature and top-p and see how the resulting probability distribution over candidate next tokens changes shape, then see which token would be sampled.

Bloom Level: Apply (L3)
Bloom Verb: demonstrate

Learning objective: Demonstrate how temperature and top-p modify a fixed token probability distribution and predict the resulting selection behavior.

Canvas layout:
- Top half (full width): Bar chart with token labels on the X axis and probability on the Y axis, showing 10 candidate next tokens for the prompt "The red panda climbed the ___"
- Bottom half: Two sliders, two readout fields, and a "Sample 100 times" button

Default candidate tokens and base probabilities:
- "tree": 0.45
- "bamboo": 0.20
- "branch": 0.10
- "rock": 0.07
- "fence": 0.05
- "ladder": 0.05
- "stairs": 0.04
- "wall": 0.02
- "roof": 0.01
- "mountain": 0.01

Interactive controls:
- Slider: Temperature (0.0 to 2.0, step 0.1, default 1.0)
- Slider: Top-P (0.0 to 1.0, step 0.05, default 1.0)
- Button: "Sample 1 token" (picks once based on the modified distribution and highlights it)
- Button: "Sample 100 times" (runs 100 samples and overlays a frequency histogram on the bars)
- Button: "Reset to defaults"

Data Visibility Requirements:
  Stage 1: Show the base probability distribution (sliders at defaults)
  Stage 2: When temperature slider changes, recompute and redraw the bars (lower T sharpens, higher T flattens)
  Stage 3: When top-p slider changes, gray out bars that fall outside the nucleus
  Stage 4: After "Sample 100 times", overlay a histogram on each bar showing actual sample frequency vs. theoretical probability

Instructional Rationale: Apply objective requires hands-on parameter manipulation. The slider + histogram pattern lets learners predict an outcome and verify it empirically.

Implementation:
- p5.js with responsive width
- updateCanvasSize() in setup()
- Use p5.js builtin createSlider and createButton
</details>

## Model Families

A **model family** is a vendor's named grouping of related models that share an architecture, a tokenizer, and a generation behavior, but differ in size and capability. The Claude 4 family (Opus, Sonnet, Haiku), the GPT-4 family (GPT-4o, GPT-4o-mini), and the Gemini 2 family (Pro, Flash, Nano) are all examples.

The cost-optimization point of view on model families is simple: within a family, the smaller models are dramatically cheaper than the larger models — often 10× cheaper per token — and frequently good enough for a large fraction of real tasks. The model-routing pattern in Chapter 17 is essentially "send everything to the small family member first; escalate to the large one only when needed."

Within a family, the tokenizer is the same. Across families (and across vendors), it usually is not. This is one more reason cross-vendor benchmarking requires care: the same prompt does not have the same token count, so "\$X per million tokens" is not directly comparable.

## Embeddings

So far we've talked about tokens as integer IDs. Inside the model, those integer IDs are immediately looked up in a giant table and converted to vectors — typically 1,024 to 12,288 floating-point numbers per token. Each vector is called an **embedding**, and the table that maps token IDs to embeddings is the embedding matrix.

Embeddings are how the model represents meaning numerically. Tokens with similar meanings end up near each other in embedding space — the embedding for "panda" sits closer to "bear" than to "automobile". This property is what makes embeddings the foundation of retrieval-augmented generation (Chapter 15): you can embed a query and a corpus of documents, then find the documents whose embeddings are nearest to the query embedding, and feed only those into the LLM.

For cost purposes, the relevant facts about embeddings are:

- Vendors expose embeddings via separate, much cheaper APIs (often 10–100× cheaper per token than generation APIs). Embedding a million-token corpus costs dollars, not hundreds of dollars.
- Embedding APIs only consume input tokens — there are no output tokens, because the "output" is the vector, not generated text. This is why retrieval-augmented systems are cost-efficient: you embed once, store the vectors, and then retrieve cheaply forever.
- Embeddings are model-specific. An embedding produced by one vendor's embedding model is not comparable to one produced by another. If you switch vendors, you re-embed your corpus.

#### Diagram: Embedding Space Concept

<iframe src="../../sims/embedding-space-concept/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Embedding Space Concept</summary>
Type: diagram
**sim-id:** embedding-space-concept<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Visualize how semantically related words cluster together in a 2D projection of embedding space, building intuition for similarity-based retrieval.

Bloom Level: Understand (L2)
Bloom Verb: classify

Learning objective: Classify words by their position in a 2D embedding projection and infer that nearness in embedding space reflects semantic similarity.

Canvas layout:
- Main area (full width): 2D scatter plot with axes labeled "Embedding dim 1" and "Embedding dim 2"
- Below: a text input and a "Find nearest" button

Data points (pre-positioned to form three clear clusters):
- Animal cluster: "panda", "bear", "fox", "wolf", "tiger" (cluster around upper-left)
- Vehicle cluster: "car", "truck", "bus", "bicycle", "motorcycle" (cluster around lower-right)
- Food cluster: "bamboo", "apple", "rice", "bread", "pasta" (cluster around upper-right)

Interactive controls:
- Text input: "Type a word to find nearest neighbors"
- Button: "Find nearest" — places a marker at an approximate position based on which cluster the word would belong to, then draws lines to its 3 nearest existing points
- Toggle: "Show clusters" — toggles colored cluster background regions

Data Visibility Requirements:
  Stage 1: Show all words plotted as labeled dots in 2D
  Stage 2: When user types a word and clicks "Find nearest", place a star marker and draw lines to the 3 nearest existing points
  Stage 3: Show the distance values next to each line

Default state: All clusters visible, no query

Implementation:
- p5.js with responsive width
- Word positions are hard-coded to form pedagogically clear clusters
- The "find nearest" computation uses simple Euclidean distance on the 2D positions
- This is a *concept* simulator — not a real embedding model
</details>

!!! mascot-thinking "Embeddings Are a Pricing Tier All Their Own"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Pemba thinking">
    Notice the structural advantage: embedding APIs have no output tokens, so they sidestep the most expensive billing category entirely. Whenever you can replace a generative API call with a retrieval step backed by embeddings, you're moving work from the most expensive tier to the cheapest one. That's the core economic insight behind RAG, and we'll spend Chapter 15 making it precise.

## Putting It All Together

You now have the second half of the foundational vocabulary. Tokens are produced by a pipeline (Unicode normalization → pre-tokenization → byte initialization → BPE merge rules) that creates **token boundaries** which do not align with anything intuitive. **Special tokens** add structural overhead to every message. **Token counting APIs** and **local token estimation** give you exact counts; the **token-to-char ratio** is a sanity-check heuristic only. **Code tokenization** and **multilingual tokenization** are where naïve cost models break. **Temperature**, **top-P sampling**, and **logprobs** control what the model emits. **Model families** organize vendor offerings into cheap-to-expensive tiers. **Embeddings** convert tokens to vectors and unlock retrieval-based cost optimizations.

Chapter 3 takes all of this and translates it into actual dollars: per-million-token pricing, unit economics, batch discounts, rate limits, and the cost-quality tradeoff curve.

??? question "Quick Self-Check — Click to Reveal Answers"
    1. **Why is the leading space part of the following token?** Because pre-tokenization splits on whitespace and BPE then learns merge rules over those whitespace-prefixed chunks; the whitespace becomes a feature of the chunk, not a separate piece.
    2. **Roughly how many tokens does 1,000 characters of English code produce?** About 285 (chars-per-token ratio of ~3.5 for code).
    3. **Roughly how many tokens does 1,000 characters of Japanese produce?** About 660 (chars-per-token ratio of ~1.5 for CJK).
    4. **What does `temperature=0` do?** Forces deterministic selection of the highest-probability token at every position.
    5. **Why are embeddings cheaper than generation?** Embedding APIs only charge for input tokens — there are no output tokens in the response.

!!! mascot-celebration "End of Chapter 2"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Pemba celebrating">
    You can now predict token counts, explain the merge pipeline, tune sampling, and spot the structural reason embeddings are a pricing bargain. Next chapter, we attach dollar amounts to all of it. Every token counts — and now you can count them accurately.

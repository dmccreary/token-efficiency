---
title: LLMs, Tokens, and Generation Basics
description: A practical mental model of large language models, tokens, prompts, and the generation parameters every engineer needs before optimizing cost
generated_by: claude skill chapter-content-generator
date: 2026-04-25 20:37:04
version: 0.07
---

# LLMs, Tokens, and Generation Basics

## Summary

The foundational chapter establishing the core vocabulary used throughout the rest of the book: what an LLM is, what tokens are, how prompts and conversations are structured, and the basic generation parameters that control model output.

## Concepts Covered

This chapter covers the following 26 concepts from the learning graph:

1. Generative AI
2. Large Language Model
3. Foundation Model
4. Transformer Architecture
5. Autoregressive Generation
6. Token
7. Input Token
8. Output Token
9. Cached Token
10. Reasoning Token
11. Token Count
12. Tokenizer
13. Byte Pair Encoding
14. SentencePiece
15. Vocabulary Size
16. Context Window
17. Context Length
18. Prompt
19. System Prompt
20. User Message
21. Assistant Message
22. Conversation Turn
23. Multi-Turn Dialogue
24. Streaming Response
25. Stop Sequence
26. Max Tokens Parameter

## Prerequisites

This chapter assumes only the prerequisites listed in the [course description](../../course-description.md).

---

!!! mascot-welcome "Welcome — Every Token Counts"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Pemba waving welcome">
    Hi, I'm Pemba. Before we can save tokens, we need to know what one *is* — and where they come from. By the end of this chapter you'll be able to look at any LLM API call and answer the question every CFO eventually asks: *"What exactly are we paying for?"* Every token counts, and counting is fun.

## Why This Chapter Comes First

Token optimization is the discipline of building generative AI systems that are fast, useful, and *cheap to operate*. Every later chapter — pricing, caching, routing, agent budgets — assumes you can read an LLM API call and immediately see the cost surface: how many tokens went in, how many came out, where the model spent its budget, and where the system spent yours. This chapter installs that mental model.

We'll move from the broadest term (Generative AI) down to the smallest billable unit (a single token), then back out to the structures that wrap tokens in real applications: prompts, conversations, and the generation parameters that decide when the model stops talking. Nothing in this chapter is exotic, but every concept here is a unit of measurement in a downstream cost equation.

## From Generative AI Down to a Single Token

### Generative AI, Foundation Models, and LLMs

**Generative AI** is the umbrella term for any machine learning system that produces new content — text, code, images, audio, or video — rather than only classifying or predicting from existing inputs. A spam filter is *not* generative; ChatGPT writing a sonnet *is*.

A **foundation model** is a large neural network trained on broad, internet-scale data and intended to be adapted to many downstream tasks rather than one. The term is deliberately general: image foundation models, multimodal foundation models, and code foundation models all exist. When the foundation model's job is to read and produce text, we call it a **large language model**, or **LLM**. Every system you'll instrument in this book — Claude, GPT, Gemini — is a large language model that is also a foundation model that is also generative AI.

The relationship is hierarchical: every LLM is a foundation model, every foundation model in this book is generative AI, but not every generative AI system is an LLM (image generators, for instance, are not).

### How LLMs Actually Produce Text

Modern LLMs use a **transformer architecture**: a neural network design that processes input by computing how much each position in the input should "attend to" every other position. You don't need the matrix algebra to optimize cost, but you do need one consequence of the design: transformers process input in parallel but produce output one piece at a time. That single fact drives the entire pricing structure of the industry.

LLMs generate text through **autoregressive generation**. The model reads the entire input, predicts the single most likely next piece of text, appends that piece to the input, and repeats — over and over — until it decides to stop. Each prediction is independent in the sense that the model recomputes from scratch, but each prediction depends on every piece that came before. This is why a 500-word answer takes roughly 500 times longer to produce than a 1-word answer, and costs proportionally more.

!!! mascot-thinking "The Two-Stage Cost Pattern"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Pemba thinking">
    Notice the asymmetry: the model reads the input *once* (cheap, parallel) but writes the output *one piece at a time* (expensive, serial). That's why output tokens are billed at a higher rate than input tokens across every vendor we'll cover. Cheap reading, expensive writing — remember the shape and you'll predict bills before you see them.

### The Token: The Unit of Account

The "piece of text" the model reads and writes is called a **token**. A token is roughly 3–4 characters of English text on average — sometimes a whole short word ("the", "and"), sometimes a fragment of a long word ("optim", "ization"), sometimes a single punctuation mark or whitespace character. The exact mapping depends on the **tokenizer** (covered below), but the unit of billing is always the token, never the character or the word.

Before we can examine the diagram below, we need to define one more pair of terms. An **input token** is any token in the text you send to the model — your prompt, your system message, your conversation history, your retrieved documents. An **output token** is any token the model generates back. Vendors bill input tokens and output tokens at different per-million-token prices, and output tokens are always more expensive (usually 3–5×).

#### Diagram: Token Lifecycle from Input to Output

<iframe src="../../sims/token-lifecycle-flow/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Token Lifecycle from Input to Output</summary>
Type: diagram
**sim-id:** token-lifecycle-flow<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Show the end-to-end flow of how a user prompt becomes input tokens, gets processed by the model, and is emitted as output tokens one at a time. Reinforces the input-once / output-serially asymmetry that drives pricing.

Bloom Level: Understand (L2)
Bloom Verb: explain

Learning objective: Explain how raw text is converted to tokens, processed in parallel, and emitted autoregressively, including which stages are billed as input versus output.

Visual elements (left to right):
1. "Raw Text" box containing the string: "Write a haiku about pandas."
2. Arrow labeled "tokenize" leading to a "Tokens (Input)" box showing the token sequence as colored chips: [Write][ a][ haiku][ about][ pandas][.]
3. Arrow labeled "send to model" leading to an "LLM" rectangle (Transformer block)
4. Arrow labeled "generate next token" leading to a "Tokens (Output)" box where chips appear one at a time with a small index counter: [Bamboo][ leaves][...]
5. Arrow labeled "detokenize" leading to a "Generated Text" box that fills in word-by-word

Visual style: Block diagram with arrows. Input tokens shown in cool blue, output tokens shown in warm orange to reinforce the pricing asymmetry. Each output token chip has a small "$" badge larger than the input chips.

Annotations:
- Above input section: "Read once, in parallel — cheaper"
- Above output section: "Generated one at a time — pricier"
- Bottom legend: blue = input tokens, orange = output tokens

Implementation: p5.js with responsive width. Animation steps through one output token per second so the autoregressive nature is visible. Reset button returns to start.
</details>

### Cached and Reasoning Tokens — Two Specialized Cost Buckets

Beyond the input/output split, two additional token categories appear on modern bills.

A **cached token** is an input token that the vendor has already processed for you in a previous request and stored in a fast-access cache. When your next request reuses the same prefix (a long system prompt, a stable set of few-shot examples, an attached document), the vendor charges you a fraction of the normal input price for those reused tokens — typically 10% of the uncached rate. We devote an entire chapter to this single optimization (Chapter 14) because it is usually the highest-leverage cost win available.

A **reasoning token** is a special category of output token used by "thinking" models — Claude's extended thinking, OpenAI's o-series, Gemini's thinking modes — to perform internal deliberation that the user never sees. The model produces these tokens for itself before producing the final visible answer. You are billed for them at the output rate, even though they never appear in the response field your application reads. A request that returns a 200-token visible answer can easily consume 5,000 reasoning tokens behind the scenes.

Before we display the comparison table below, here is the pattern: every vendor reports a **token count** for each request — broken down by category — in the API response. Reading those counts is the foundational skill of this book. Now the table can summarize the four categories side by side:

| Token Type | What It Is | Direction | Typical Price (relative to input) | Where It Shows Up |
|------------|------------|-----------|-----------------------------------|-------------------|
| Input | Tokens you send to the model | Inbound | 1× (baseline) | System prompt, user message, history, documents |
| Cached input | Reused input tokens stored by the vendor | Inbound | ~0.1× | Stable prefix on repeat requests |
| Output | Tokens the model generates for you | Outbound | 3×–5× | The visible response text |
| Reasoning | Internal thinking tokens (visible to bill, not to user) | Outbound | 3×–5× | Hidden deliberation in thinking models |

Every later chapter will refer back to this table. When we say "drive down output tokens," we mean the third row. When we say "raise the cache hit rate," we mean shift work from row 1 to row 2. When we say "cap the thinking budget," we mean bound row 4.

## How Text Becomes Tokens

### Tokenizers

A **tokenizer** is a deterministic function that converts a string of text into a sequence of integer token IDs (and back again). Each vendor ships its own tokenizer, and the same English sentence will produce different token counts on different vendors' tokenizers — sometimes by 20% or more. This is why "100,000 tokens" on Claude is not the same amount of text as "100,000 tokens" on GPT or Gemini.

The two tokenization algorithms you will encounter throughout this book are Byte Pair Encoding and SentencePiece. Both produce **subword tokens** — units smaller than whole words but larger than individual characters — chosen by analyzing patterns in massive training corpora.

**Byte Pair Encoding (BPE)** starts with single characters as the initial vocabulary, then repeatedly finds the most frequent adjacent pair of tokens in the training corpus and merges them into a new token. After thousands of merges, the vocabulary contains common whole words ("the", "and"), common word-fragments ("tion", "ing"), and common multi-character punctuation patterns. OpenAI's tiktoken and Anthropic's tokenizer are both BPE-based.

**SentencePiece** is a related family of algorithms (used by Google's models, including Gemini) that treats the input as a raw byte stream — it does not require pre-splitting on whitespace. This makes it well-suited to languages without word boundaries (Chinese, Japanese, Thai) and to code. The practical effect is the same as BPE: input text becomes a sequence of subword token IDs.

The total number of distinct tokens a tokenizer can produce is its **vocabulary size**, typically between 32,000 and 256,000. A larger vocabulary packs more meaning per token (so the same text uses fewer tokens), but it also makes each token "wider" and increases the size of the model's embedding table. Vocabulary size is a fixed property of each model — you can't tune it, but you should know it when comparing per-million-token prices across vendors.

!!! mascot-tip "Compare Tokens, Not Characters"
    <img src="../../img/mascot/tip.png" class="mascot-admonition-img" alt="Pemba sharing a tip">
    When you benchmark cost across vendors, never compare character counts or word counts. Tokenize your real production traffic with each vendor's tokenizer and compare *those* numbers. A vendor that looks 20% cheaper per million tokens may actually be 10% more expensive once you account for tokenizer differences. Cheap systems are honest-arithmetic systems.

### Token Counts in Practice

Before showing the interactive tokenizer below, here is what you should expect to see when you experiment with it: the same English sentence will produce roughly 6–10 tokens for a 6-word sentence, common words become single tokens, rare words split into two or three tokens, and punctuation is almost always its own token. Whitespace usually attaches to the *following* word — the token for " panda" (with leading space) is different from the token for "panda" (no space).

#### Diagram: Interactive Tokenizer Explorer

<iframe src="../../sims/interactive-tokenizer-explorer/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Interactive Tokenizer Explorer</summary>
Type: microsim
**sim-id:** interactive-tokenizer-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Let learners type or paste text and immediately see how it gets segmented into tokens, with a live token count and per-token highlight. Builds intuition that words, characters, and tokens are three different units.

Bloom Level: Understand (L2)
Bloom Verb: interpret

Learning objective: Interpret how a tokenizer segments text into subword units, and predict the token count of a string before sending it to an API.

Instructional Rationale: Step-through with concrete data is appropriate for an Understand objective. Continuous animation would obscure the actual token boundaries; a typed-and-revealed pattern lets learners predict and verify.

Canvas layout:
- Top half (full width): Multi-line text input area, default text "Write a haiku about red pandas."
- Middle strip: Three numeric displays side by side — "Characters: NN", "Words: NN", "Tokens: NN"
- Bottom half: Token visualization area showing each token as a colored chip with the token text inside and a small numeric token-ID below

Interactive controls:
- Text input (auto-updates on every keystroke)
- Dropdown: "Tokenizer family" with options ["BPE (cl100k-style)", "SentencePiece (Gemini-style)"]
- Button: "Load example: short prompt"
- Button: "Load example: long document (~500 tokens)"
- Button: "Load example: code snippet"
- Button: "Load example: non-English (Japanese)"

Data Visibility Requirements:
  Stage 1: Show the raw input string in the text box
  Stage 2: Show the tokenized chips with whitespace explicitly visible (use a "·" character to indicate leading space)
  Stage 3: Show the running counts (chars, words, tokens) updated live
  Stage 4: When dropdown changes, show how the same string produces different chip counts under each tokenizer family

Default values:
- Tokenizer: BPE
- Text: "Write a haiku about red pandas."

Behavior:
- Tokenization is approximated client-side using a simplified BPE/SentencePiece simulator (not a real model tokenizer — accuracy isn't the point, the *pattern* is)
- Hovering a chip shows its byte length below the chip
- When the same word appears twice in the input, both chips are highlighted in the same color so learners see that identical strings produce identical tokens

Implementation notes:
- Use p5.js with responsive width and updateCanvasSize() in setup()
- Use p5.js builtin createInput, createSelect, createButton (per project conventions)
- No animation; pure interactive update on text change
</details>

## The Container: Context Windows

A **context window** is the maximum total number of tokens (input + output combined, in most accounting schemes) that a model can process in a single request. The numerical value of that limit, in tokens, is called the **context length**. Modern models advertise context lengths from 8,000 tokens (older models) up to 1,000,000 tokens (Gemini's long-context mode and Claude's 1M-context mode).

Two facts about context windows govern almost every long-document and long-conversation cost decision:

- **You pay for what you put in, even if the model only "uses" part of it.** Sending a 100,000-token document and asking one question costs ~100,000 input tokens, regardless of how much of the document was actually relevant to the answer.
- **Latency grows with context length.** A 200,000-token request is not just more expensive than a 2,000-token request — it is also noticeably slower because the model has more input to attend to before producing its first output token.

Engineers new to LLMs often treat the context window as "free space" up to the limit. It is not. Every token in the window is a token on the bill, and every additional token in the window slows the response. Chapter 16 is dedicated to keeping long sessions inside their context window without paying full price for every turn.

## The Structure of a Conversation

### Prompts and Message Roles

A **prompt** is the complete input you send to the model on a given request. In modern chat-style APIs, a prompt is not a single string — it is a structured list of messages, each tagged with a role.

The three roles you will use constantly:

- **System prompt** — a special message at the start of the conversation, written from the operator's voice (yours, the application developer's), that establishes persona, rules, available tools, output format, and constraints. The model treats system content with higher priority than later user content. System prompts are typically the largest stable prefix in a request, which makes them the prime target for prompt caching (Chapter 14).
- **User message** — a turn from the human end-user. Contains the question, the document, the request for help.
- **Assistant message** — a turn from the model. Contains the model's prior response in a multi-turn conversation, replayed back to the model so it remembers what it just said.

A single exchange — one user message followed by one assistant message — is one **conversation turn**. A **multi-turn dialogue** is any conversation with more than one turn, where each new request includes the entire prior history so the model has continuity. Crucially: the entire history is re-sent on every turn. A 10-turn conversation does not "remember" anything internally — turn 11 ships turns 1 through 10 in the input. This is the single most expensive footgun in conversational LLM applications, and it is why Chapter 16's compaction strategies exist.

#### Diagram: Conversation Message Structure

<iframe src="../../sims/conversation-message-structure/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Conversation Message Structure</summary>
Type: diagram
**sim-id:** conversation-message-structure<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Show how a multi-turn dialogue is sent to the API on each turn — system prompt at the top, then alternating user/assistant messages, with the *entire* history re-sent on every new request. Make the cumulative token cost across turns immediately visible.

Bloom Level: Analyze (L4)
Bloom Verb: examine

Learning objective: Examine how a multi-turn conversation accumulates input tokens on every new turn, and identify the system-prompt prefix as a prime cache target.

Canvas layout:
- Left column (60% width): A vertical stack of message cards labeled by role (System, User, Assistant, User, Assistant, ...) with each card showing a token count
- Right column (40% width): A line chart showing cumulative input tokens on the Y axis and turn number on the X axis

Visual elements:
- System prompt card: dark gray, large (showing 800 tokens)
- User cards: blue, varying small sizes (50–200 tokens each)
- Assistant cards: orange, varying medium sizes (300–600 tokens each)
- A "Send Turn N" button that adds one more user/assistant pair and updates the cumulative chart

Interactive controls:
- Button: "Send next turn" (advances by one turn, generates random sizes within realistic ranges)
- Button: "Reset conversation"
- Checkbox: "Cache the system prompt" — when checked, the cumulative-cost line splits into two: full-price line and cache-discounted line, showing the divergence
- Slider: System prompt size (200–4000 tokens)

Data Visibility Requirements:
  Stage 1: Show only the system prompt card with its token count
  Stage 2: After "Send next turn", show the user/assistant pair appended below
  Stage 3: Show the cumulative input token count for *this* turn (everything above the new user message gets re-sent)
  Stage 4: After several turns, show how the cumulative cost grows roughly linearly even though only the latest user message is "new"
  Stage 5: When caching is enabled, show the cache-discounted line diverging from the full-price line

Default values:
- System prompt size: 800 tokens
- Caching: off

Behavior:
- Each new turn re-sends every prior message as input
- The chart updates with both per-turn and cumulative input tokens
- A small annotation calls out: "Same system prompt sent on every turn — cache target."

Implementation notes:
- Use p5.js for both the message stack and the line chart
- Responsive width
</details>

### Why the Conversation Shape Matters for Cost

Now that the structure is on the page, three cost facts follow directly:

- The **system prompt is the same on every turn**. That makes it the most cacheable piece of any conversational application. Caching a 2,000-token system prompt saves ~1,800 tokens of full-price input on every request after the first.
- **Long histories are expensive even when uninteresting.** Turn 20 of a customer-support chat is paying for 19 prior turns of small talk that the model doesn't need to answer the current question.
- **Assistant messages contribute too.** When you replay the model's prior responses back as input, those output tokens (which you already paid for once at the output rate) are now also being paid for at the input rate. They are billed twice — once when generated, once on every subsequent turn they are included.

## Controlling the Output

Generation does not "just stop when the model is done." It stops because *something* tells it to stop. There are three primary stopping mechanisms, and every one of them is a cost lever.

### Max Tokens, Stop Sequences, and Streaming

The **max tokens parameter** is a hard upper bound on the number of output tokens the model is allowed to produce in a single response. If the model has not naturally finished by then, generation is cut off mid-sentence. This is your last-resort cost cap: even if a runaway prompt would otherwise produce a 10,000-token essay, `max_tokens=500` guarantees you pay for at most 500 output tokens.

A **stop sequence** is a string (or list of strings) that, if generated, immediately ends the response with that string excluded. Stop sequences are how you tell the model "stop after the JSON object closes" or "stop before you start a new section". They are precise — they end generation exactly when a structural boundary is hit, rather than at an arbitrary token count.

A **streaming response** delivers output tokens to the client incrementally as they are generated, instead of buffering the whole response and sending it at the end. Streaming does not change cost — you pay for every token whether it streams or not — but it dramatically improves perceived latency (the user sees the first word in ~200 ms instead of waiting 8 seconds for the whole answer) and it enables early cancellation: the client can close the stream when it has seen enough, and many vendors will stop billing for tokens generated after cancellation.

The relationship between these three controls is summarized below — but only after we've defined them all in prose:

| Control | What It Bounds | Behavior at Limit | Primary Use |
|---------|----------------|-------------------|-------------|
| max_tokens | Total output token count | Generation truncates mid-sentence | Hard cost ceiling |
| Stop sequence | Token *content* | Generation ends cleanly at the boundary | Structural framing (JSON, sections) |
| Streaming + cancel | Wall-clock time on the client | Client closes the connection | Adaptive output length |

### A Worked Example: All Three Levers Together

A well-instrumented chat endpoint typically sets all three at once. Before showing the configuration list below, here is the intuition: `max_tokens` is your insurance policy against catastrophic runs, the stop sequence is your structural contract with the model, and streaming is your user-experience-and-cancellation strategy.

A reasonable production default for a JSON-returning endpoint:

- `max_tokens: 1000` — guarantees the bill cannot exceed 1,000 output tokens per request
- `stop: ["\n\n```\n", "</response>"]` — ends generation cleanly at the structural boundary the application expects
- `stream: true` — delivers tokens as they're produced, so the application can validate JSON incrementally and cancel if the model goes off-format

With this setup, a normal request finishes well under 1,000 tokens at the stop sequence; a misbehaving request gets capped at 1,000; and a request that starts producing garbage can be killed by the client mid-stream.

!!! mascot-warning "Default max_tokens Is Almost Always Wrong"
    <img src="../../img/mascot/warning.png" class="mascot-admonition-img" alt="Pemba cautioning">
    Many SDKs default `max_tokens` to a very high value (4,096 or higher) — and many engineers never override it. That means a single buggy prompt can produce a 4,000-token wall of text where 200 would have done. Always set `max_tokens` to a value calibrated to the *actual* maximum useful response length for your endpoint. If your endpoint returns a yes/no answer, `max_tokens=10` is not paranoid — it's correct.

## Putting It All Together

You now have the vocabulary to read any LLM API call. A request is a **prompt** — a structured list of messages, starting with a **system prompt** and alternating **user** and **assistant** messages — fed through a **tokenizer** (BPE or SentencePiece) into the **input tokens** of an **LLM**. The model performs **autoregressive generation**, producing **output tokens** one at a time (and possibly **reasoning tokens** for itself), until it hits a **stop sequence** or the **max tokens** limit, optionally **streaming** them to the client. Tokens reused from a prior request may be counted as **cached tokens**. The total of all of these is the request's **token count**, and it must fit inside the model's **context window**.

Every chapter from here forward will optimize one or more of those nouns and verbs. Chapter 2 zooms in on tokenizers and embeddings. Chapter 3 introduces the prices that turn token counts into dollars. By Chapter 14, you'll be writing prompts whose stable prefix is *deliberately* designed to cache, and by Chapter 18, you'll be writing budget policies that cap the cost of an entire agent session.

??? question "Quick Self-Check — Click to Reveal Answers"
    1. **Which is more expensive per token: input or output?** Output, typically by 3×–5×.
    2. **What's a cached token, and roughly how is it priced?** A reused input token previously processed by the vendor; usually about 10% of the uncached input rate.
    3. **If you send a 50,000-token document and ask one question, how much input do you pay for?** ~50,000 input tokens, regardless of how much of the document the answer used.
    4. **Why do output tokens cost more than input tokens?** Inputs are processed in parallel; outputs are generated one token at a time, autoregressively.
    5. **What gets re-sent on every turn of a multi-turn dialogue?** The full prior history — system prompt, all previous user messages, and all previous assistant messages.

!!! mascot-celebration "End of Chapter 1"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Pemba celebrating">
    You've installed the mental model. Tokens are the unit of account, prompts are the structure, the context window is the container, and `max_tokens` and stop sequences are the cost ceiling. Cheap systems are happy systems — and now you can spot where the cheap ones differ from the expensive ones. On to tokenization in Chapter 2.

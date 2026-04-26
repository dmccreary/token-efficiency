---
title: Conversation Message Structure
description: Watch a multi-turn dialogue accumulate input tokens turn by turn, and see why the system-prompt prefix is the prime caching target.
image: /sims/conversation-message-structure/conversation-message-structure.png
og:image: /sims/conversation-message-structure/conversation-message-structure.png
twitter:image: /sims/conversation-message-structure/conversation-message-structure.png
social:
   cards: false
---

# Conversation Message Structure

<iframe src="main.html" height="662px" width="100%" scrolling="no"></iframe>

[Run the Conversation Message Structure MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

A multi-turn conversation is not a stream — it is a sequence of stateless API calls. On every new turn, the client re-sends the full message history (system prompt, then every prior user/assistant pair, then the new user message) so the model can see the context. This MicroSim shows that re-sending visually: the message stack on the left grows downward as you click "Send next turn", while the line chart on the right tracks cumulative input tokens.

The key insight emerges by turn 3 or 4. The system prompt — sent on *every* turn — quickly becomes the largest single contributor to total billed input. Toggling "Cache the system prompt" splits the cumulative-cost line in two and makes the savings opportunity quantitative. This is the load-bearing economic argument for prompt caching: the prefix is identical on every request, so paying full price for it on every turn is a self-inflicted cost.

## How to Use

1. **Read the starting state.** Only the system prompt is shown — 800 tokens by default. The chart shows a single point at (turn 0, 800 tokens).
2. **Click "Send next turn."** A user/assistant pair appears below the system card and the chart adds a new point. Note that the cumulative input includes the system prompt *plus* the user message that just got sent.
3. **Click "Send next turn" several more times.** Watch the cumulative line climb roughly linearly. Each new turn adds the system prompt (800), the entire prior history, and the new user message — most of which the model already saw on the prior turn.
4. **Drag the system-prompt-size slider up** from 800 to 4,000 tokens. Watch every cumulative point jump. Note how dramatic this is by turn 5 — the system-prompt share of total input grows with turn count.
5. **Toggle "Cache the system prompt" on.** A second (green) line appears, hugging the X axis much more closely than the slate full-price line. Read the savings percentage in the annotation panel.
6. **Click "Reset conversation"** and try a small system prompt (200 tokens) versus a large one (4,000 tokens). Caching matters proportionally — the bigger the cached prefix, the bigger the savings.

## Bloom Level

**Analyze (L4)** — examine how a multi-turn conversation accumulates input tokens on every new turn, and identify the system-prompt prefix as a prime cache target.

## Iframe Embed Code

```html
<iframe src="sims/conversation-message-structure/main.html"
        height="662px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Adult professional learners — engineers and ML engineers building chatbot, agent, or copilot integrations who need to understand why "the same system prompt" is more expensive than they intuit and what to do about it.

### Duration

15–25 minutes inside Chapter 1, or 30 minutes as a standalone workshop with the practice scenarios.

### Prerequisites

- Familiarity with the request/response model of an HTTP API
- Chapter 1 sections on tokens, input vs. output tokens, and conversation turns
- A general sense that LLM APIs are stateless

### Activities

1. **Anchor on a single turn (3 min).** Run with the default 800-token system prompt and click "Send next turn" once. Note the cumulative cost. This is the calibration point.
2. **The growth pattern (5 min).** Click "Send next turn" five more times. Sketch the shape of the chart line on paper before looking. Most learners draw a flat line; the actual line is monotonically rising and roughly linear. Discuss: why linear? (Each new turn re-sends a slightly larger history.)
3. **System-prompt sweep (5 min).** Reset, then sweep the slider from 200 to 4,000 tokens after running 5 turns. Note how the curve scales. The relationship between system-prompt size and cumulative cost is multiplicative in turn count.
4. **Caching demo (5 min).** Toggle caching on. Read the savings percentage. Compare savings at 200-token system prompt vs. 4,000-token system prompt. Discuss: when does caching pay off, and when is it wasted overhead?
5. **The "what if I trim history?" question (5 min).** Note that this sim does not model history truncation — it is the upper bound on cost. Discuss: how would the chart change if the client only sent the last 3 turns? (Slope flattens after turn 3.) This is the bridge to Chapter 12 on context-window management.

### Practice Scenarios

| Scenario | System size | Turns | Caching | Predict cumulative input |
|---|---|---|---|---|
| Short FAQ chatbot, no cache | 400 | 5 | off | ? |
| Long agent prompt, no cache | 3,500 | 5 | off | ? |
| Long agent prompt, with cache | 3,500 | 5 | on | ? |
| Short FAQ chatbot, with cache | 400 | 5 | on | ? |
| Customer support bot, mid prompt | 1,200 | 8 | off | ? |
| Customer support bot, mid prompt | 1,200 | 8 | on | ? |

### Assessment

A learner has met the objective when they can:

- Sketch the cumulative-input-tokens curve for a given system-prompt size and number of turns without using the calculator.
- Identify that the system-prompt prefix is the *single largest contributor* to billed input on conversations of more than 3 turns.
- Predict (within 20%) the savings percentage from caching for a given configuration.
- Explain to a colleague why "stateless API" makes caching the system prompt the highest-leverage cost optimization in a chatbot.

### Math reference

For a conversation with system size \( S \), per-turn user message size \( u_t \), per-turn assistant size \( a_t \), and \( T \) total turns, the cumulative billed input is:

\[
\text{cumulative} = S + \sum_{t=1}^{T} \left( S + u_t + \sum_{k=1}^{t-1} (u_k + a_k) \right)
\]

Holding \( u_t \) and \( a_t \) constant, this simplifies to a quadratic in \( T \) with a leading \( S \cdot T \) term — the system-prompt share of total cost grows linearly in turn count.

With caching, the system-prompt term changes from \( S \cdot T \) to \( 1.25 \cdot S + 0.10 \cdot S \cdot (T-1) \), a substantial reduction once \( T \geq 2 \).

## References

1. Anthropic Documentation. *Messages API* — describes the stateless turn structure and the `cache_control` parameter.
2. OpenAI Platform Documentation. *Chat Completions* — analogous stateless turn semantics for the OpenAI API.
3. Anthropic Engineering. *Prompt caching for the Claude API* — pricing and caching break-even analysis.
4. Karpathy, A. (2024). *Let's build the GPT tokenizer* — useful background on why tokens (not characters) are the billing unit.

---

## Senior Instructional Designer Quality Review

*Reviewer perspective: 15+ years designing engineering and data-science curricula for adult professional learners; expertise in Bloom's revised taxonomy, evidence-based assessment design, and accessibility of technical content.*

### Overall verdict

**Strong fit for the stated learning objective. Approve as-is for Chapter 1.** Score: **89/100 (B+).** This is one of the cleaner Analyze-level (L4) MicroSims I have reviewed for an introductory chapter: the learner does not just *see* that conversations accumulate tokens, they *examine* the structure of the accumulation and *identify* the cache target. The split-line treatment of caching is exactly the right pedagogy for the L4 verb "examine."

### What works (the pedagogy)

1. **Bloom alignment is correct for L4.** "Examine" requires the learner to *take apart and identify components*. The two-pane layout — message stack on the left, cumulative line on the right — is the canonical "decompose the system" view. The learner sees both the *parts* (each message card with its token count) and the *aggregate behavior* (cumulative line) at once, which is the load-bearing visual for the analyze verb.
2. **The system-prompt size slider is the load-bearing control.** Most introductory texts describe the system prompt as "the instructions" and leave it at that. Letting the learner manipulate its size and watch the cumulative curve scale in turn count is the moment when "this is just an instruction" becomes "this is the dominant cost driver." That moment is the chapter's most important insight.
3. **Caching toggle as a secondary feature, not the headline.** Putting the caching feature behind a toggle (rather than always on) lets the learner see the *uncached* behavior first, build intuition for why it is wasteful, and only *then* apply caching as a fix. This is the correct sequence for problem-before-solution pedagogy.
4. **Random per-turn message sizes are the right level of realism.** Hardcoding "every user message is 100 tokens" would teach a memorized rule. Random sizes within realistic ranges (50–200 user, 300–600 assistant) force the learner to read the chart instead of computing the answer mentally.
5. **The annotation panel surfaces the system-prompt share of total input.** This is the analyze-level summary statistic and pinning it on screen is correct.

### What needs follow-up (the gaps)

1. **No way to inspect the per-turn billed amount.** The cumulative chart shows total billed input over the conversation but does not surface "this turn cost X tokens." A learner who wants to verify their mental model has to subtract two consecutive points. Adding a small per-turn delta readout next to each user/assistant card would close this. Score impact: −3.
2. **The 8-turn cap is invisible.** The "Send next turn" button silently stops working at turn 8. A learner who expects more turns will not understand why nothing happens. Either disable the button visibly when the cap is hit, or extend the chart to support a longer history. Score impact: −2.
3. **No history-trimming alternative.** The sim presents "send everything every turn" as the only option. A real production chatbot often trims to the last N turns or summarizes older history. A "history limit" toggle (or even a static annotation: "this is the upper bound — trimming or summarizing changes the curve") would prepare the learner for Chapter 12 on context-window management. Score impact: −3.
4. **Cache write/read multipliers are not surfaced.** The 1.25× write and 0.10× read constants are baked into the calculation but never shown to the learner. A small footnote in the chart legend ("cache write 1.25×, cache read 0.10×") would let learners verify their mental model. The math reference handles it but the sim itself is silent. Score impact: −1.
5. **No explicit "linear growth" framing.** The chart shows linear-ish growth but does not name it. A learner unfamiliar with analyzing curves may not realize that "linear in turn count" is the takeaway. A subtle annotation on the line ("≈ linear in turn count") would help. Score impact: −1.

### Accessibility and clarity

- **Color contrast** of the slate (full-price) and green (cached) lines on white is AA-compliant. The system card uses dark slate on white with white text — AAA on the role label.
- **Color-blind safety:** The user (blue) and assistant (russet/orange) cards are distinguishable under deuteranopia and protanopia because the role labels in the corner of each card are also text-marked.
- **The cache-target ribbon** uses the same russet color as the assistant cards, which could be confusing under tritanopia. Consider an icon (a small key glyph) in addition to the color.
- **p5.js native sliders** are keyboard-focusable and arrow-key adjustable.

### Cognitive load assessment

- **2 sliders + 1 toggle + 2 buttons + the simulation = 6 interactive elements.** Comfortably within working-memory budget.
- **Two visualizations on screen simultaneously** (message stack and line chart). The visual relationship — same data, two views — is what an Analyze sim is supposed to teach, so this density is paying its weight rather than overloading.
- **The annotation panel** competes for attention with the chart. A learner may bounce between them. Consider a numbered "stage" indicator that highlights one element at a time as the conversation progresses.

### Recommendation

**Approve for use in Chapter 1 as currently implemented.** The five gaps above are real but none of them block correct learning of the L4 objective. Open follow-up tickets for:

1. Per-turn delta readouts on each card (highest impact)
2. History-trimming toggle to bridge to Chapter 12
3. Visible disable on the "Send next turn" button at the 8-turn cap

The MicroSim teaches what it claims to teach, the system-prompt-as-cache-target insight emerges from playing rather than from being told, and the cumulative line is the right visual for an L4 examine objective. Ship.

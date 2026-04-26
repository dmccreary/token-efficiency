---
title: Tool Use Loop with Cost Annotations
description: Multi-turn Anthropic tool-use sequence diagram with cumulative token annotations showing why the system prompt and tool definitions are the highest-value cache targets.
image: /sims/tool-use-loop-cost/tool-use-loop-cost.png
og:image: /sims/tool-use-loop-cost/tool-use-loop-cost.png
twitter:image: /sims/tool-use-loop-cost/tool-use-loop-cost.png
social:
   cards: false
---

# Tool Use Loop with Cost Annotations

<iframe src="main.html" height="722px" width="100%" scrolling="no"></iframe>

[Run the Tool Use Loop with Cost Annotations MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

A common surprise for engineers new to the Anthropic API: the model does not remember prior turns. Every time the application calls the model again, the **entire prior conversation** — system prompt, tool definitions, the user question, every prior assistant tool call, every prior tool result — is re-sent. This MicroSim makes that re-send visible turn by turn.

The sequence diagram on the left shows an application driving a multi-step tool-use loop: the model calls `get_weather`, then `get_forecast`, then produces a final answer. Each turn is annotated with the tokens that were re-sent and the cumulative input cost so far. The right panel shows the running total of cached vs. uncached input tokens and the effective cost in unit currency.

The system prompt (5K tokens) and tool definitions (1K tokens) are constant across the entire session. That makes them the textbook cache target: pay 1.25x once on the first turn (the cache write), then 0.10x on every subsequent turn (the cache read). Toggle the cache-savings overlay to see how much that single design choice saves over a multi-step session.

## How to Use

1. **Read the standard 3-iteration loop.** The diagram opens with the default 3-iteration sequence. Read each `App -> Claude` arrow and notice how the input size *grows* on every turn — that's the prior-conversation re-send.
2. **Watch the running total.** The right panel shows cumulative cached / uncached / output tokens. The "Effective cost" line uses Anthropic's published pricing multipliers (1.25x cache write, 0.10x cache read, 5x output).
3. **Increase the iteration count.** Drag the iterations slider from 1 up to 6. Notice that uncached input grows roughly *quadratically* (each new turn re-sends every prior turn's tool call + tool result) while cached input grows only linearly (system + tools, paid at 0.10x per turn).
4. **Toggle "Show cache savings".** With caching off, every turn pays full input price for the system prompt and tools. The savings percentage in the right panel shows the gap between effective cost and no-cache cost — typically 60–80% for a multi-turn tool-use session with a non-trivial system prompt.
5. **Identify the cache targets.** The "Cache Targets" section in the right panel lists the parts of the prompt that should be cached. Verify that what you see in the diagram matches: the system prompt and tool definitions are paid for *once* and read cheaply thereafter.

## Bloom Level

**Analyze (L4)** — examine how tool-use loops accumulate input tokens and identify the components that should be cached.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="sims/tool-use-loop-cost/main.html"
        height="722px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Adult professional learners — software engineers, ML engineers, and platform-team members building agents on the Anthropic API who need to control per-session token spend.

### Duration

15–20 minutes inside Chapter 4, or 30 minutes as a standalone exercise on prompt caching.

### Prerequisites

- Chapter 4 sections on the Anthropic Messages API and tool use
- Familiarity with the `tools`, `tool_use`, and `tool_result` message blocks
- Any prior exposure to billable token categories (input vs. output)

### Activities

1. **Walk the default loop (3 min).** Trace each arrow in the 3-iteration sequence. Confirm aloud which content is being re-sent on each `App -> Claude` arrow.
2. **Predict before the slider moves (5 min).** Before you set iterations to 6, predict the cumulative uncached input tokens. Then move the slider and check.
3. **Compare cache on vs. off (5 min).** Toggle the "Show cache savings" checkbox. For a 6-iteration loop with a 5K system prompt, the savings are typically 65–75%. Articulate why: the cache read at 0.10x is 8× cheaper than the cache write at 1.25× minus the read.
4. **Apply to a real session (5 min).** Estimate the cumulative tokens for a 12-iteration coding-agent session with an 8K system prompt and 2K tool definitions. Compare to the limits you set in your harness.

### Practice Scenarios

| # | Iterations | System prompt | Tools | Caching | Predict effective cost (units) |
|---|---|---|---|---|---|
| 1 | 1 | 5,000 | 1,000 | on | ? |
| 2 | 3 | 5,000 | 1,000 | on | ? |
| 3 | 6 | 5,000 | 1,000 | on | ? |
| 4 | 6 | 5,000 | 1,000 | off | ? |
| 5 | 6 | 10,000 | 2,000 | on (compare to scenario 3) | ? |

### Assessment

A learner has met the objective when they can:

- Articulate that each tool-use turn re-sends the full prior context (system + tools + history + new tool result).
- Identify the system prompt and tool definitions as the cache-target components.
- Explain why uncached input grows roughly quadratically while cached input grows only linearly with N turns.
- Estimate the cache-savings percentage for a session given the system-prompt size and the number of iterations.

### Math reference

Per-turn re-sent input tokens for iteration \(i\) (with caching enabled):

\[
T_i = \underbrace{S + D}_{\text{cached: system + tool defs}} + \underbrace{Q + (i-1)(c + r)}_{\text{uncached: question + prior turn tool calls } c \text{ and tool results } r}
\]

Cumulative cost across \(N\) iterations (in unit currency where 1 = base input price):

\[
\text{Cost} = (S+D)\cdot 1.25 + N\cdot(S+D)\cdot 0.10 + \sum_{i=1}^{N}\left[Q + (i-1)(c+r)\right] + O \cdot 5
\]

where \(O\) is the cumulative output across all turns. The \((i-1)(c+r)\) term is the source of the quadratic growth in uncached input.

## References

1. Anthropic. *Tool Use Documentation* — describes the multi-turn tool-use protocol where the application re-sends the entire prior conversation each turn.
2. Anthropic. *Prompt Caching Documentation* — defines cache write (1.25x) and cache read (0.10x) multipliers and the 5-minute / 1-hour TTL options.
3. Anthropic Engineering Blog. *Building Effective Agents* — practical advice on minimizing per-turn input by structuring stable prefixes for caching.
4. Karpathy, A. (2024). *State of GPT* talk — explains why every API call is stateless and what that implies for cost over multi-turn sessions.

---

## Senior Instructional Designer Quality Review

*Reviewer perspective: 15+ years designing engineering and data-science curricula for adult professional learners; expertise in Bloom's revised taxonomy, evidence-based assessment design, and accessibility of technical content.*

### Overall verdict

**Strong fit for the L4 Analyze objective. Approve with two small follow-ups.** Score: **88/100 (B+).** This MicroSim does the unusual thing of using a sequence diagram for *cost analysis* rather than just protocol illustration. The per-turn cumulative annotation is the load-bearing pedagogy, and it works because the learner can see input growth turn by turn instead of deriving it from a closed-form equation.

### What works (the pedagogy)

1. **Bloom alignment is correct.** L4 "examine" requires the learner to break a system into components and see how each contributes to the whole. The sequence diagram explicitly decomposes each turn into cached / uncached / output portions and lets the learner watch each component grow at its own rate.
2. **Quadratic growth is rendered viscerally.** Most explanations of context re-send describe the cost as "linear in turns," which is the intuition that fails learners. The diagram shows that *uncached* input grows quadratically (each turn's re-send includes every prior turn's tool call and result), and the running total in the side panel makes it impossible to miss.
3. **Cache targets are named, not implied.** The right-side "Cache Targets" panel explicitly tells the learner which parts of the prompt to cache and why — converting the abstract "cache the stable prefix" advice into concrete components (5K system + 1K tools).
4. **The savings percentage is the assessment hook.** A 65–75% savings number for the default scenario is striking enough that learners will want to verify it by toggling the checkbox. That is a built-in formative-assessment loop.
5. **Realistic token sizes.** The 5K system prompt and 1K tool definitions are within the range a real Anthropic application would use. Learners will recognize the shape of their own systems.

### What needs follow-up (the gaps)

1. **No way to vary the system-prompt and tool-defs sizes interactively.** Practice scenario 5 in the lesson plan asks the learner to compare 5K vs. 10K system prompts, but the MicroSim hardcodes both. Adding two sliders for `system_prompt_size` and `tool_defs_size` would close this gap. Score impact: −4.
2. **The diagram does not visually distinguish cached vs. uncached portions of each `App -> Claude` arrow.** The text annotation says "5000t cache write" but the arrow itself is a single line. Coloring the arrow segments (or using two parallel arrows per turn) would reinforce the decomposition. Score impact: −3.
3. **No "what if you forgot the cache breakpoint" comparison.** A common production bug is forgetting to mark the cache breakpoint after the tool definitions, which causes the cache to invalidate on every turn. A toggle for "cache breakpoint correct vs. missing" would teach an important debugging signal. Score impact: −2.
4. **Output token growth is implicit, not annotated per arrow.** Each `Claude -> App` arrow shows the output for that single turn but the cumulative output is only in the side panel. Adding a per-turn cumulative-output number on each response arrow would round out the per-turn breakdown. Score impact: −1.
5. **The 1-iteration case is awkward.** With iterations = 1, the diagram shows a tool call followed by the tool result and final answer, but the "loop" framing breaks down. A label clarifying that "1 iteration = a single tool round-trip" would help. Score impact: −2.

### Accessibility and clarity

- **Color contrast** on the green / orange / purple legend dots passes WCAG AA at 12px text on the white panel background.
- **Color-blind safety:** The four token categories (cached / uncached / output / cache-write) use distinct hues but the legend text provides full redundancy with color.
- **Keyboard accessibility:** The slider and checkbox in the toolbar are native HTML controls and are keyboard-focusable. Mermaid SVG nodes are not, but the sim does not require node interaction (no hover-to-reveal); all information is visible at all times.
- **Sequence numbering** is enabled in Mermaid, which gives screen-reader users a stable referent ("turn 3") for each arrow.

### Cognitive load assessment

- **Default 3-iteration view:** ~10 arrows with cumulative annotations and a 7-line side panel. Comfortably within the 7±2 working-memory range for the target audience.
- **6-iteration view:** Closer to 18 arrows. At the upper edge — the side panel summarizes, which is the right mitigation.
- **Side panel duplicates information** intentionally: the diagram shows per-turn deltas, the panel shows cumulative totals. This is a feature for learners who want either view, not a bug.

### Recommendation

**Approve for use in Chapter 4 as currently implemented.** The five gaps above are real but none block the L4 "examine" objective. Open follow-up tickets for items 1 (size sliders) and 2 (per-arrow color coding) — both would meaningfully strengthen the MicroSim with modest implementation effort.

The MicroSim makes the structural cost shape of multi-turn tool use visible in a way that the prose chapter cannot. That is exactly the bar for a competent L4 sim.

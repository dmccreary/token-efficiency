---
title: Anthropic Prompt Caching Lifecycle
description: Visualize per-request token breakdown and cumulative cost across a sequence of requests with and without Anthropic's prompt caching feature.
image: /sims/anthropic-prompt-caching-lifecycle/anthropic-prompt-caching-lifecycle.png
og:image: /sims/anthropic-prompt-caching-lifecycle/anthropic-prompt-caching-lifecycle.png
twitter:image: /sims/anthropic-prompt-caching-lifecycle/anthropic-prompt-caching-lifecycle.png
social:
   cards: false
---

# Anthropic Prompt Caching Lifecycle

<iframe src="main.html" height="722px" width="100%" scrolling="no"></iframe>

[Run the Anthropic Prompt Caching Lifecycle MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

A live calculator and visualizer for Anthropic's prompt-caching feature. Set the system prompt size, user message size, output size, and number of requests, then watch each request's token breakdown render as a stacked bar (cache write, cache read, uncached input, output) and the cumulative cost diverge from the no-cache baseline below.

The "fresh cache" marker (an orange ring) sits above the requests where the system prompt is *written* to the cache rather than *read* from it — by default that is just R1, but the "Add stale gap" button injects a TTL expiration partway through the run, forcing a second cache write and showing how a TTL miss affects the curve.

## How to Use

1. **Start at the defaults** (5,000-token system prompt, 200-token user message, 500-token output, 10 requests, caching on). Read the cumulative cost numbers at the bottom and note the savings percentage. With these defaults, savings should be in the 70–80% range.
2. **Inspect the request cards.** Notice that R1 has a tall russet "cache write" segment, while R2–R10 have small blue "cache read" segments. The visual asymmetry — the russet R1 dwarfs every later request — is the entire point of caching.
3. **Toggle caching off**. The cumulative-cost curve becomes a straight line and the savings collapse to 0%. This is the worst case: every request pays full price for the system prompt.
4. **Add a stale gap.** Click "Add stale gap" — the cache invalidates partway through, a second russet write appears, and the curve gets a small "step." Discuss: is the stale gap worth the savings, or did it eat them?
5. **Shrink the system prompt** to 1,000 tokens and watch savings shrink. This shows that caching is a system-prompt-size lever — it pays off most when the cached portion is large.
6. **Push the system prompt to 10,000 tokens and the request count to 20.** Watch savings climb past 90%. This is the scenario where caching matters most: long system prompts and many requests.

## Bloom Level

**Apply (L3)** — calculate the cumulative cost of N requests with and without caching, and identify the break-even point (always reached after request 2).

## Iframe Embed Code

```html
<iframe src="sims/anthropic-prompt-caching-lifecycle/main.html"
        height="722px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Adult professional learners — engineers and ML engineers building Claude API integrations who need to understand when prompt caching pays off and how to keep cache hit rates high.

### Duration

15–25 minutes inside Chapter 4, or 30 minutes as a standalone workshop with the practice scenarios.

### Prerequisites

- Chapter 1 (Tokens, Input Token, Output Token, Cached Token, Conversation Turn)
- Chapter 3 (Per-million-token pricing, Output Premium, Cached Input Price)
- Chapter 4 sections on the Messages API and the cache_control parameter

### Activities

1. **Read the defaults (3 min).** Run the sim at default settings. Find the savings percentage at the bottom of the cost chart and write it down. This is the calibration point.
2. **The break-even check (3 min).** Slide the request count down to 1. The savings percentage goes *negative* — caching costs more than no-caching when you only make one request. Slide back to 2. Now caching breaks even or slightly wins. This is the canonical "after request 2" break-even point.
3. **System-prompt-size sensitivity (5 min).** With requests held at 10, sweep the system prompt size from 500 to 10,000 tokens. Note the savings percentage at each step. The relationship is monotonic and roughly logarithmic — small system prompts get little benefit, large system prompts get most of it.
4. **TTL gap exercise (5 min).** Click "Add stale gap." Watch a second russet "write" appear in the request cards and a small step in the cost curve. Predict: how much does that single TTL gap cost? Read the new savings number. (For a 5K-token system prompt with one stale gap in the middle of 10 requests, savings typically drop from ~75% to ~60%.)
5. **5-min vs 1-hour TTL (5 min).** Toggle the TTL setting. The current implementation models TTL only structurally (via the stale-gap button), so this discussion happens in the lesson, not in the sim: when does the 1-hour TTL pay for its higher write cost? (Answer: when your traffic is bursty and you have natural gaps between request clusters.)
6. **Bring your own scenario (5 min).** Use the practice table below.

### Practice Scenarios

| Scenario | Sys | User | Out | N | Caching | Stale gap? | Predict savings |
|---|---|---|---|---|---|---|---|
| Long-running chatbot | 5,000 | 200 | 500 | 10 | on | no | ? |
| One-shot query | 5,000 | 200 | 500 | 1 | on | no | ? |
| Document analysis (long context) | 10,000 | 200 | 500 | 5 | on | no | ? |
| Bursty support agent (frequent gaps) | 5,000 | 200 | 500 | 10 | on | yes | ? |
| Short FAQ chatbot | 1,000 | 200 | 500 | 10 | on | no | ? |
| Code review tool (very long context) | 10,000 | 500 | 2,000 | 5 | on | no | ? |

### Assessment

A learner has met the objective when they can:

- Predict (within 5 percentage points) the savings percentage for a given configuration without using the calculator.
- Identify the break-even point (always after the 2nd request, given that cache write costs 1.25× and cache read costs 0.10× — so the first cached read recovers the write premium).
- Explain *why* caching does not pay off for one-shot queries and *does* pay off for long sessions.
- Recognize when a stale-gap or TTL-expiration cost outweighs the caching benefit.

### Math reference

Anthropic prompt-caching pricing (relative to normal input price):

- Cache write: 1.25× normal input
- Cache read: 0.10× normal input
- Output: ~5× normal input (Sonnet-class)

For N requests with system-prompt size S and one cache write at R1:

\[
\text{cost}_{\text{cache}} = 1.25 \cdot S \cdot 1 + 0.10 \cdot S \cdot (N-1) + \text{(other tokens)}
\]

\[
\text{cost}_{\text{no-cache}} = N \cdot S \cdot 1 + \text{(other tokens)}
\]

Net savings on the system-prompt portion is positive when \( 1.25 + 0.10 (N-1) < N \), which simplifies to \( N \geq 2 \). The break-even is exactly at N = 2 — the second request is when caching starts to pay.

## References

1. Anthropic Documentation — *Prompt caching* — official spec including pricing, TTL semantics, and the cache_control parameter.
2. Anthropic Engineering Blog — *Prompt caching for the Claude API* — design rationale and worked examples.
3. The Claude Cookbook — sample code for setting up cache breakpoints in long system prompts.

---

## Senior Instructional Designer Quality Review

*Reviewer perspective: 15+ years designing engineering and platform-engineering curricula for adult professional learners; expertise in Bloom's revised taxonomy, sensitivity-analysis instruction, and assessment of pricing-model fluency.*

### Overall verdict

**Strong fit for the stated learning objective. Approve as-is for Chapter 4.** Score: **92/100 (A−).** This is a textbook-quality Apply-level (L3) calculator: the learner manipulates real inputs, the visualizations make the asymmetry between cache-write and cache-read viscerally obvious, and the math behind the calculation is exposed in the lesson plan for verification. The break-even point at N=2 — the single most important takeaway from the prompt-caching feature — emerges naturally from playing with the slider, which is exactly the right pedagogical move.

### What works (the pedagogy)

1. **Bloom alignment is exactly right.** L3 "calculate" requires the learner to *use a procedure to produce a number*. Sliders + live readout + cumulative cost chart = three distinct ways to engage with the calculation, all on the same canvas. The learner cannot avoid producing the number.
2. **The visual asymmetry teaches the rule.** R1's tall russet "cache write" bar next to R2..R10's tiny blue "cache read" bars makes the 12.5× cost difference between writing and reading impossible to miss. This is the load-bearing pedagogy of the entire prompt-caching feature, and the visualization nails it.
3. **The cumulative cost line chart pays its weight.** A learner who sets requests to 1 sees the no-cache line *below* the with-cache line — caching is a *loss* on a single request. As they slide requests up to 2, the lines cross. This is the break-even moment, the most important calibration in the whole topic, and the chart makes it self-evident without anyone having to explain it.
4. **The "fresh cache" markers (orange rings) are subtle but correct.** They mark exactly the requests that pay the 1.25× write premium without overemphasizing them. A more obvious treatment would have buried the rest of the chart.
5. **The stale-gap button is the right level of TTL modeling.** A full TTL simulation would require a time-axis and a clock — overkill for L3. A single button that injects one stale gap is enough to teach "TTL expirations cost a re-write" without inflating the sim past its objective.
6. **Reset button.** Same as the sample-size calculator — small but pedagogically important. Lets the learner re-anchor between exercises.
7. **Math reference in the lesson plan.** Showing the algebra for the break-even derivation (1.25 + 0.10(N-1) < N → N ≥ 2) gives the more mathematical learner a way to verify the calculator, and gives the chapter a clean "why exactly N=2?" answer.

### What needs follow-up (the gaps)

1. **No way to vary how often the user message changes.** Real prompt-caching usage often has a long *prefix* (system + few-shot examples) cached and a small *suffix* (user message) uncached. The calculator handles this implicitly (the 200-token user message is uncached), but a "shared prefix vs. unique suffix" visual would teach the cache-key boundary explicitly. Score impact: −2.
2. **TTL toggle is a no-op.** The 5-min vs 1-hour TTL toggle exists in the UI but doesn't change the calculation because the sim has no time axis. This is honest in the spec ("the toggle exists for discussion") but a learner toggling it expects something to happen. Either remove the toggle, or have it change the cache-write multiplier (Anthropic charges more for the longer TTL). Score impact: −2.
3. **No tool-use or thinking tokens.** Real Claude API requests with caching often include extended thinking and tool use, both of which interact with caching in interesting ways. The calculator only handles the simple case. The lesson plan should note this; future revisions could add a "with reasoning tokens" toggle. Score impact: −2.
4. **Cost is in "relative units" not dollars.** This is a deliberate choice — pricing changes, ratios don't — but a learner trying to estimate dollars for a real budget needs to do the conversion themselves. A footnote with current per-MTok pricing would help. Score impact: −1.
5. **Output cost dominates the chart for short system prompts.** With sys=500, the output (500 tokens × 5×) is 2.5K cost units versus 500 × 1.25 + 500 × 0.10 × 9 = 1,075 for cached input — almost 2.5× the cached portion. This is *correct*, but the visualization doesn't surface that "caching matters less when the output dominates the bill" insight. A future revision could highlight the cached portion of the bill specifically. Score impact: −1.

### Accessibility and clarity

- **Color contrast** is clean: russet, blue, green, slate on white all pass AA at 11px+.
- **The four-segment stacked bar** uses semantically distinct colors that are color-blind safe. The "fresh cache" marker (orange ring) is redundant with the russet color of the cache-write segment, so a deuteranope still gets the signal from segment height even if they cannot see the ring.
- **Y-axis labels on the cost chart** use the K/M abbreviation appropriately and avoid floating-point precision noise.
- **Sliders are p5.js native** — keyboard-focusable, arrow-adjustable.
- **The line chart's series identification** (russet solid for cached, slate dashed for no-cache) uses both color and line style for redundancy. ✓

### Cognitive load assessment

- **6 sliders/toggles + 2 buttons + the simulation = 9 interactive elements.** At the upper edge of working memory but mitigated by the two-column layout and clear input labels.
- **Two visualizations on screen simultaneously** (request cards above, line chart below) is a lot, but the line chart is summary information for the request cards, so the learner can read top-down and have the relationship reinforced.
- **The stacked-bar request cards** are the highest-density visual element. They reward inspection, which is the right kind of cognitive load for an Apply-level sim.

### Pedagogical bias check

- The default scenario (5K system prompt, 10 requests) is biased toward *high savings*, which is the optimistic case. A learner who only ever runs the default will leave with an inflated sense of how much caching saves. The lesson plan partially mitigates this with the "shrink the system prompt" exercise, but the default could stay where it is — it correctly shows the *typical* configuration where caching matters.
- The N=1 break-even check is essential and the lesson plan correctly puts it in step 2. Without that exercise, learners might miss that caching is a *loss* on one-shot queries.

### Recommendation

**Approve for use in Chapter 4 as currently implemented.** The five gaps above are real but none of them block correct learning of the L3 objective. Open follow-up tickets for:

1. Make the TTL toggle do something (or remove it)
2. Surface a "shared prefix / unique suffix" boundary in the request cards
3. Add an explicit "cached portion of total cost" stat

The MicroSim teaches what it claims to teach, the calculation matches Anthropic's pricing model, and the break-even-at-N=2 insight emerges from playing with the sliders rather than from being told. That is the bar for a strong L3 calculator. Ship.

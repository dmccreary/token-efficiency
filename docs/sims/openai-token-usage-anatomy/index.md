---
title: OpenAI Token Usage Object Anatomy
description: Hover-labeled anatomy of an OpenAI Chat Completions response showing how each usage field maps to a billing category, including reasoning_tokens for o-series models.
image: /sims/openai-token-usage-anatomy/openai-token-usage-anatomy.png
og:image: /sims/openai-token-usage-anatomy/openai-token-usage-anatomy.png
twitter:image: /sims/openai-token-usage-anatomy/openai-token-usage-anatomy.png
social:
   cards: false
---

# OpenAI Token Usage Object Anatomy

<iframe src="main.html" height="642px" width="100%" scrolling="no"></iframe>

[Run the OpenAI Token Usage Anatomy MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

Every OpenAI Chat Completions response includes a `usage` object that tells you exactly how much you will be billed. This MicroSim shows the response on the left, the four billing categories on the right, and the connections between them. Hover any usage field to see which billing box it maps to and the exact math (tokens × rate).

The default view shows a `gpt-4o` response with `prompt_tokens`, `completion_tokens`, and `total_tokens`. Toggle "Show o3 (reasoning model) response" to add the `completion_tokens_details.reasoning_tokens` field — the hidden chain-of-thought that o-series models bill at the output rate. The rate card under the JSON looks up the per-model price.

## How to Use

1. **Read the JSON.** The default `gpt-4o` response has three usage fields. Read each name and its value.
2. **Hover each highlighted field.** The matching billing box on the right highlights, the connecting curve turns russet, and a math line appears at the bottom showing the cost calculation.
3. **Verify the sum.** Hover `total_tokens` and read the sum check: prompt + completion = total.
4. **Switch to o3.** Toggle the "Show o3 response" checkbox. A new `completion_tokens_details.reasoning_tokens` field appears. Notice that the reasoning box explicitly says "billed AS OUTPUT" — reasoning tokens are *inside* `completion_tokens`, not in addition to it.
5. **Read the rate card.** The rate card shows input and output prices for the current model. Compare gpt-4o vs. o3 to see how reasoning models are priced.

## Bloom Level

**Remember (L1)** — identify each field of the OpenAI usage object and map it to its billing category.

## Iframe Embed Code

```html
<iframe src="sims/openai-token-usage-anatomy/main.html"
        height="642px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Adult professional learners — engineers and analysts who need to read OpenAI billing reports or implement per-call cost logging.

### Duration

10 minutes inside Chapter 5, or 20 minutes including the practice scenarios.

### Prerequisites

- Chapter 5 introduction to the OpenAI Chat Completions API
- Familiarity with JSON

### Activities

1. **Name the fields (3 min).** Without hovering, name the three default usage fields. Then hover each to confirm.
2. **Trace the math (3 min).** Hover `prompt_tokens` and `completion_tokens`. Confirm that the math line uses the right per-1M rate from the rate card.
3. **Add reasoning tokens (3 min).** Toggle the o3 view. Hover `reasoning_tokens` and read the warning: they are billed inside `completion_tokens`. Confirm by checking that completion_tokens (1840) > reasoning_tokens (1600) — the difference is visible-output tokens.

### Practice Scenarios

| # | Field | Billing category | Notes |
|---|---|---|---|
| 1 | `prompt_tokens` | Input | The chat history, system prompt, and tools |
| 2 | `completion_tokens` | Output | Visible assistant text + reasoning (if any) |
| 3 | `completion_tokens_details.reasoning_tokens` | Output (sub-component) | Only present on o-series models |
| 4 | `total_tokens` | Sum check | Not a separate billing line; equals prompt + completion |
| 5 | `model` | Rate-card key | Determines $/1M for input and output |

### Assessment

A learner has met the objective when they can:

- Name each usage field and state its billing category.
- Confirm that `total_tokens` is a sum check, not a separate billing line.
- Recognize that `reasoning_tokens` are part of `completion_tokens` (billed at the output rate).
- Identify the `model` field as the rate-card lookup key.

## References

1. OpenAI. *Chat Completions API* — defines the response shape and the `usage` object.
2. OpenAI. *Reasoning models documentation* — defines `completion_tokens_details.reasoning_tokens`.
3. OpenAI. *Pricing page* — current per-model input and output rates.
4. OpenAI Cookbook. *Counting tokens with tiktoken* — companion content for predicting `prompt_tokens` before sending.

---

## Senior Instructional Designer Quality Review

*Reviewer perspective: 15+ years designing engineering and data-science curricula for adult professional learners; expertise in Bloom's revised taxonomy, evidence-based assessment design, and accessibility of technical content.*

### Overall verdict

**Approve for use in Chapter 5.** Score: **86/100 (B).** L1 "identify" is a low-ceiling Bloom level by design; the bar is whether the MicroSim makes a small, dry fact (the names of usage fields) memorable. This one does, primarily through the hover-to-connect interaction that gives the learner a tactile mapping rather than a static legend.

### What works (the pedagogy)

1. **Bloom alignment is correct.** L1 "identify" calls for recognition and recall of named items. The MicroSim is built around that exact action: see a name, hover it, see the category. Repeated hovering builds recognition memory.
2. **The reasoning-tokens trap is taught explicitly.** The single most common cost-modeling error for o-series is double-counting reasoning_tokens. The reasoning box explicitly says "billed AS OUTPUT" and the math line confirms it. That is good pedagogy.
3. **Sum-check teaching.** Showing `total_tokens` as a "sum check" rather than a billing line is subtle but important — engineers who add prompt + completion + total to get a billed total are off by 2x. The math hover prevents that.
4. **Rate card lookup is integrated.** The rate card under the JSON is connected to the `model` field, teaching that the same usage numbers cost different amounts on different models.
5. **Toggle for reasoning-model view.** Progressive disclosure — gpt-4o first, then o3 — keeps the default cognitively light and lets the learner add the reasoning concept when ready.

### What needs follow-up (the gaps)

1. **No keyboard accessibility for hover.** The whole interaction is mouse-driven. A learner using a keyboard can read the static layout but cannot trigger the math hover. A "Tab to next field" or "click to lock" interaction would close the gap. Score impact: −4.
2. **The `cached_tokens` field is missing.** OpenAI's prompt-caching API adds `usage.prompt_tokens_details.cached_tokens` for cache hits. A toggle for "show cached response" would teach that field — and the chapter explicitly covers caching elsewhere. Score impact: −3.
3. **The rate card is hardcoded.** Real prices change. The sim should display "(illustrative — verify on the OpenAI pricing page)" near the rate card. Score impact: −2.
4. **Audio/code-pair tokens are absent.** GPT-4o-audio adds `usage.input_audio_tokens` and `usage.output_audio_tokens`. Mentioning them in the lesson plan or as a "future revision" note would acknowledge the broader API surface. Score impact: −1.
5. **No quiz layer.** L1 sims benefit from a "click the box that matches this field" assessment. The lesson plan compensates with a recall table, but a built-in two-question quiz would close the loop. Score impact: −4.

### Accessibility and clarity

- **Color-blind safety:** The four billing-box colors (blue / russet / purple / green) are distinguishable under common color-blindness profiles. Each box has a label, sub-label, and value — three text channels — so color is not the only signal.
- **The hover effect dims and brightens** the corresponding box clearly, but the dimming alone (no border thickening) might be missed by low-vision users. The sim does also thicken the border on hover, which is the right reinforcement.
- **Font sizing** in the JSON block (11.5px) is small but legible at typical screen DPIs.
- **Mouse-only interaction** is the largest accessibility gap; see follow-up #1.

### Cognitive load assessment

- **One JSON block (~12 lines), four billing boxes, one rate card.** Total visible elements: ~17. Dense but not overwhelming for a focused 10-minute exercise.
- **Default view is simpler** (no reasoning section). The toggle adds three more fields and one more box, bringing the total closer to 22. Still tractable.
- **Hover detail is short** (1–2 lines of math). It does not compete with the rest of the layout.

### Recommendation

**Approve for use in Chapter 5 as currently implemented.** The five gaps above are real but none of them block the L1 objective. Open follow-up tickets for items 1 (keyboard interaction) and 2 (`cached_tokens` field) — both would meaningfully extend the MicroSim into the prompt-caching content elsewhere in the chapter.

The MicroSim makes a dry topic memorable. That is the bar for a competent L1 sim, and it clears it.

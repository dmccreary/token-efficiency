---
title: Function Calling Loop with Tool Choice
description: Interactive sequence diagram showing the OpenAI function-calling round-trip and how each tool_choice setting (auto, none, required, specific) changes the loop shape and token cost.
image: /sims/openai-function-calling-loop/openai-function-calling-loop.png
og:image: /sims/openai-function-calling-loop/openai-function-calling-loop.png
twitter:image: /sims/openai-function-calling-loop/openai-function-calling-loop.png
social:
   cards: false
---

# Function Calling Loop with Tool Choice

<iframe src="main.html" height="642px" width="100%" scrolling="no"></iframe>

[Run the Function Calling Loop MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

The OpenAI Chat Completions API uses a two-round-trip pattern for function calling: the application sends a request with `tools` and `tool_choice`, the API returns either a `tool_calls` array or a text message, the application executes the tool, and a second round trip returns the final assistant text. This MicroSim shows that loop end-to-end across three swimlanes (Application, OpenAI API, Tool implementation) and lets you see how each `tool_choice` setting changes the loop shape.

The four `tool_choice` modes have very different cost and correctness properties. `auto` lets the model decide, which can short-circuit to a single round trip. `none` forbids tool use entirely. `required` forces the model to call *some* tool. `{specific tool}` forces a particular tool — useful for structured extraction. The right-side panel explains the meaning of each mode, when to use it, and the per-mode round-trip cost.

## How to Use

1. **Trace the default `auto` flow.** Read each arrow in the diagram. Note the four logical steps: send messages + tools, receive tool_calls, execute the tool, send the result, receive the final assistant text.
2. **Switch to `none`.** Notice the loop collapses to a single request/response. The tools array is still sent, but the model never calls them. Read the right-side panel for when this is appropriate (greetings, conversational fallback) and when it is wasteful (any question the model could answer with a tool).
3. **Switch to `required`.** Notice the loop is identical to `auto` in shape, but the model is *forced* to emit a tool call. Read the panel for the warning: on a question that does not need a tool, `required` forces a nonsensical tool call.
4. **Switch to `{specific tool}`.** This is the cleanest forced-call path — useful for structured-output extraction where you treat the tool schema as a JSON Schema for the response.
5. **Toggle "Show token costs."** Each step now shows an approximate token count. Compare modes: `auto` is ambiguous (1 or 2 round trips), `none` is always 1, `required` and `specific` are always 2.

## Bloom Level

**Apply (L3)** — implement an OpenAI function-calling round trip and pick the right `tool_choice` setting for a given workload.

## Iframe Embed Code

```html
<iframe src="sims/openai-function-calling-loop/main.html"
        height="642px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Adult professional learners — software engineers building OpenAI-API-backed applications who need to choose the right tool-control setting per use case.

### Duration

15 minutes inside Chapter 5, or 30 minutes including the practice scenarios below.

### Prerequisites

- OpenAI Chat Completions API basics
- JSON request and response familiarity
- Chapter 5 sections introducing the `tools` and `tool_choice` parameters

### Activities

1. **Walk the auto loop (3 min).** With `tool_choice="auto"` selected and cost overlay on, trace each arrow aloud. Articulate which steps cost input tokens and which cost output tokens.
2. **Compare auto vs. required (5 min).** Imagine the user asks "What is 2 + 2?". Predict what each setting returns. Then switch modes in the diagram and read the explanations.
3. **Force a structured extraction (5 min).** Switch to `{specific tool}` mode. Discuss when forcing a particular tool is the right choice (extraction tasks, schema-validated responses).
4. **Workload mapping (10 min).** For each scenario in the table below, pick the right `tool_choice` setting and justify.

### Practice Scenarios

| # | Workload | Best tool_choice | Reason |
|---|---|---|---|
| 1 | A weather chatbot that may chat or fetch the weather | auto | Some inputs need the tool; some do not |
| 2 | A receipt parser that always extracts JSON fields | {specific tool} | Forced single-tool path with schema validation |
| 3 | A greeter that should never call a tool | none (or strip tools) | Forbid tool use; or strip tools to save input tokens |
| 4 | A code-executor that always runs the user's code | required (or specific) | Always need a tool call |
| 5 | A research agent that decides whether to search | auto | Tool use depends on query content |

### Assessment

A learner has met the objective when they can:

- Pick the correct `tool_choice` setting for a described workload.
- Predict the number of API round trips for each mode.
- Identify the wasteful case (sending a `tools` array with `tool_choice="none"` when the tools are never invoked and the model does not need to know they exist).
- Explain why `tool_choice="required"` can produce nonsensical tool calls on simple inputs.

## References

1. OpenAI. *Function Calling* — official documentation for the `tools`, `tool_calls`, and `tool_choice` parameters.
2. OpenAI Cookbook. *How to call functions with chat models* — code-level walkthrough of the loop shown in this diagram.
3. Anthropic. *Tool Use* documentation — useful comparison since the Anthropic version has slightly different semantics.
4. Karpathy, A. *State of GPT* — high-level model of stateless API calls and what they imply for tool-use loops.

---

## Senior Instructional Designer Quality Review

*Reviewer perspective: 15+ years designing engineering and data-science curricula for adult professional learners; expertise in Bloom's revised taxonomy, evidence-based assessment design, and accessibility of technical content.*

### Overall verdict

**Approve for use in Chapter 5.** Score: **87/100 (B+).** This is a clean L3 "implement" MicroSim — it gives the learner the four buttons (`auto`, `none`, `required`, specific) that correspond to four real implementation decisions, and shows the consequence of each. The contextual explanation panel does the heavy lifting that a static sequence diagram cannot.

### What works (the pedagogy)

1. **Bloom alignment is correct.** L3 "implement" requires choosing among options for a given purpose. The four `tool_choice` modes are exactly the choice space, and the panel makes the use-case mapping explicit.
2. **Mode-driven re-render is the right interaction.** Changing `tool_choice` re-renders the entire diagram, not just a label. The learner sees the loop *shape* change (1 round trip vs. 2), which is the load-bearing pedagogy.
3. **The `none` collapse is striking.** Going from a 4-step loop to a 2-step loop visually drives home that `none` is structurally different — not just a semantic toggle.
4. **Misuse warnings are first-class.** The "When to use it" panel explicitly warns about the failure modes of `required` (forced nonsense calls) and the wasted tokens in `none` (when the tools array is unnecessary). These are the gotchas that engineers actually hit in production.
5. **The cost panel ties together** the structural choice (round trips) with the operational consequence (token cost). That is the right framing for an L3 sim about a cost-optimization textbook.

### What needs follow-up (the gaps)

1. **The `auto` mode does not branch.** A real `auto` flow is bimodal: sometimes 1 round trip, sometimes 2. The diagram only shows the 2-round-trip path. A toggle for "model decides not to call a tool" would let the learner see the 1-round-trip variant. Score impact: −4.
2. **Token costs are illustrative, not parameterized.** The 1500-token input and 80-token output are reasonable defaults but a learner with a different `messages` size cannot map directly. A slider for "system + history size" would close this. Score impact: −2.
3. **No discussion of strict mode** (`strict: true` for tool schemas). Strict mode is a recent addition and a real Apply-level decision. A note in the panel would acknowledge it without overloading the diagram. Score impact: −2.
4. **No comparison to Anthropic's `tool_choice` semantics.** Chapter 4 covers Anthropic; chapter 5 covers OpenAI. A one-line note that "Anthropic supports `auto` / `any` / `tool` — similar but not identical to OpenAI's" would help the learner generalize. Score impact: −1.
5. **No assessment built into the sim.** The lesson plan provides a 5-row scenario table, but the sim itself does not test mode selection. A "given this user message, which mode?" quiz overlay would close the loop. Score impact: −4.

### Accessibility and clarity

- **The mode dropdown is a native HTML `<select>`** — keyboard-focusable and screen-reader friendly.
- **Sequence numbering on arrows** gives screen-reader users a stable referent.
- **Color contrast** on the toolbar (white on `#37474f`) and panel headers (russet underline) passes WCAG AA.
- **No color is the only channel** — every distinction is reinforced with text in the side panel.

### Cognitive load assessment

- **6 arrows for `auto` / `required` / `specific`**, **2 arrows for `none`**. Both are well within 7±2.
- **Three side-panel sections** (what / when / cost). Each is short. Total reading load is modest.
- **The dropdown changes everything** — diagram, what-it-does text, when-to-use text, cost numbers. This is dense for a beginner; the lesson plan correctly recommends walking the modes one at a time.

### Recommendation

**Approve for use in Chapter 5 as currently implemented.** The five gaps above are real but none block the L3 objective. Open follow-up tickets for items 1 (`auto` short-circuit branch) and 5 (built-in mode-selection assessment) — both would meaningfully strengthen the MicroSim with modest implementation effort.

The MicroSim teaches the rule it claims to teach. Ship.

---
title: Prompt Engineering for Token Efficiency
description: Reducing tokens at their source — system prompt hygiene, instruction compression, few-shot pruning, chain-of-thought tradeoffs, prompt templates, length budgets, and the discipline of reusable blocks
generated_by: claude skill chapter-content-generator
date: 2026-04-26 09:00:00
version: 0.07
---

# Prompt Engineering for Token Efficiency

## Summary

Reducing tokens at their source: system prompt hygiene, instruction compression, few-shot pruning, chain-of-thought tradeoffs, prompt templates and variable interpolation, prompt and output length budgets, token-aware rewriting, whitespace and comment stripping, and the discipline of reusable prompt blocks.

## Concepts Covered

This chapter covers the following 25 concepts from the learning graph:

1. Prompt Engineering
2. System Prompt Hygiene
3. Instruction Compression
4. Few-Shot Example
5. Few-Shot Pruning
6. Zero-Shot Prompting
7. Chain Of Thought
8. Dead Context
9. Redundant Instruction
10. Verbose Boilerplate
11. Prompt Template
12. Template Versioning
13. Prompt Variable
14. Variable Interpolation
15. Prompt Compression Tool
16. Selective Compression
17. Prompt Length Budget
18. Output Length Budget
19. Concise Output Instruction
20. Token-Aware Rewriting
21. Whitespace Stripping
22. Comment Removal
23. Schema Minimization
24. Symbol Substitution
25. Reusable Prompt Block

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: LLMs, Tokens, and Generation Basics](../01-llms-tokens-generation-basics/index.md)
- [Chapter 2: Sampling, Tokenization, and Embeddings](../02-sampling-tokenization-embeddings/index.md)
- [Chapter 3: Pricing, Economics, and Async API Modes](../03-pricing-economics-async-apis/index.md)
- [Chapter 4: The Anthropic Claude Ecosystem](../04-anthropic-claude-ecosystem/index.md)

---

!!! mascot-welcome "Trim at the Source"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Pemba waving welcome">
    Caching (Chapter 14) saves tokens you re-send. RAG tuning (Chapter 15) saves tokens on what you retrieve. This chapter saves tokens *before they ever exist* — by writing prompts that don't include the words you didn't need to send. Prompt engineering for tokens is the cheapest discipline in the book and the one with the most compounding payoff. Cheap systems are the systems whose prompts say only what they need to say.

## Prompt Engineering as a Cost Discipline

**Prompt engineering** in the cost sense is the practice of writing the shortest, clearest prompt that produces the desired model behavior. It is distinct from quality-focused prompt engineering (which optimizes for accuracy) but compatible with it — concise prompts often produce better results too, because they don't bury the important instructions in boilerplate.

The first principle is the audit. Before optimizing any prompt, count its tokens (Chapter 2). Compare to a back-of-envelope estimate of what the prompt *needs* to say. The gap is the optimization opportunity. Most production prompts started shorter and grew over time — every time someone hit an edge case they added a line. Few teams ever go back and prune.

## System Prompt Hygiene

**System prompt hygiene** is the standing practice of keeping system prompts as short as possible. Every token in your system prompt is paid for on every request — the highest-leverage cost surface in any LLM application.

The hygiene checklist:

- **Lead with the role and task.** First sentence: who the model is and what it does. Don't bury this under preamble.
- **State rules positively when possible.** "Respond in JSON" beats "Do not respond in plain prose, do not use markdown, do not include explanations." Positive instructions are shorter and clearer.
- **Separate immutable rules from contextual examples.** Immutable rules go in the system prompt; per-request context goes in the user message.
- **Audit against the model behavior, not the original intent.** If a rule was added to fix a bug six months ago, check if the bug still happens without it. Models change; old workarounds become dead weight.

The single biggest win in most production prompts is removing **redundant instruction** — the same rule expressed three different ways because earlier authors weren't sure the first version landed. Modern models follow clear instructions; they don't need the same idea repeated three times. Pick the clearest version and delete the others.

The companion is **dead context** — content in the prompt that no longer serves any purpose. Examples: a product name from a previous version, a tool reference for a tool that's been removed, an anti-example for a behavior the model no longer exhibits. Dead context is invisible until you look for it; once you look, it's everywhere.

A third common waste is **verbose boilerplate** — long polite preambles ("You are a helpful, harmless, and honest assistant. You strive to provide accurate and comprehensive answers..."). Modern models are already trained on this style; the boilerplate adds tokens without changing behavior. Trim it ruthlessly.

## Instruction Compression

**Instruction compression** is the practice of rewriting prose instructions into denser equivalents. Some patterns:

- Convert prose to bullets where the structure permits — bullets are typically 30–50% fewer tokens than the equivalent prose
- Replace repeated phrases with named conventions ("hereafter, the input string" once instead of "the input string" five times)
- Use abbreviations and codes for terms used many times (define `INP` for `input`, then use `INP` thereafter)
- Cut adverbs and intensifiers ("very carefully" → "carefully" — model behavior unchanged, tokens saved)

Compression has limits: at some point clarity suffers and the model behavior degrades. The way to find the limit is to A/B test (Chapter 12) the compressed version against the baseline on quality metrics. Acceptable compression is whatever leaves the quality guardrail intact.

**Token-aware rewriting** is the broader skill of editing prompts with token count in mind — picking shorter synonyms, restructuring sentences for density, and noticing when a paragraph could be a list. Token-aware rewriting becomes intuitive after a few weeks of practice; it changes how you write all prompts thereafter.

## Few-Shot Pruning and Zero-Shot Prompting

A **few-shot example** is a worked input/output pair included in the prompt to demonstrate the desired behavior. Few-shot examples are powerful — they often outperform pure instruction for tasks that are easier to show than to describe. They are also expensive: each example is hundreds of tokens of input on every request.

**Few-shot pruning** is the discipline of including only the few-shot examples that actually move quality. Methodology:

1. Start with the few-shot set you have
2. For each example, run an A/B test removing just that example
3. Keep examples whose removal causes a measurable quality drop
4. Drop examples whose removal does not

In practice, few-shot prompts grow over time — engineers add an example when they encounter an edge case and never remove the older ones. After pruning, a 10-example prompt often shrinks to 3 or 4 with no quality loss. The savings recur on every request thereafter.

**Zero-shot prompting** is the natural endpoint: no examples at all, instruction-only. Modern reasoning-capable models often perform as well zero-shot as with carefully-curated few-shot — particularly on tasks well-represented in pretraining. Always try zero-shot as a baseline; if it works, you've eliminated all the example tokens forever.

## Chain of Thought: When It's Worth It

**Chain of thought** (CoT) is a prompting pattern that asks the model to reason explicitly before answering — typically with phrases like "Think step by step before answering" or by providing example reasoning chains in the few-shot examples. CoT improves accuracy on multi-step reasoning problems substantially.

The cost shape is the issue. CoT triples or quadruples the typical output token count, since the model now produces both reasoning *and* the final answer. Output is the most expensive token category (Chapter 3), so CoT can multiply the cost of an endpoint by 3–4×.

The decision rule:

- For genuinely hard reasoning tasks (math, logic, complex code), CoT is worth the cost — accuracy gains are large
- For simple tasks (classification, extraction, formatted generation), CoT is wasted output — the model didn't need to reason
- For modern reasoning models (o-series, Claude with extended thinking, Gemini thinking), built-in reasoning replaces explicit CoT — and you can bound it with a thinking budget (Chapter 4)

The cleanest way to handle CoT cost is to invoke it conditionally: route hard requests to a CoT-enabled prompt and easy requests to a direct-answer prompt (Chapter 17 covers the routing).

## Prompt Templates and Variable Interpolation

A **prompt template** is a reusable text skeleton with placeholders for the per-request variable parts. Templates are the production-engineering form of prompts — they enable hashing for log analysis (Chapter 11), versioning, A/B testing, and disciplined updates.

**Template versioning** is the practice of treating prompt templates as code: store them in version control, give each version a stable identifier, log the version with every request. When a regression appears, you can correlate it with the template version that introduced it.

A **prompt variable** is a placeholder in the template (`{{user_query}}`, `{{document_text}}`) that gets filled in per request. **Variable interpolation** is the rendering step — substituting the variables for their values to produce the final prompt sent to the API.

A representative template might look like:

```
{# template id: summarize_v3 #}
You are a document summarizer. Produce a 3-sentence summary
of the document below.

Document:
{{document_text}}

Summary:
```

The template ID and version go into the log line as the `prompt_hash`. When you ship `summarize_v4`, you immediately see the per-version cost and quality split in your dashboards.

## Prompt Compression Tools and Selective Compression

A **prompt compression tool** is a software utility (often itself an LLM) that takes a long prompt and produces a shorter version preserving the same essential information. Tools in this space include LLMLingua, Selective Context, and similar research projects, plus simpler heuristic approaches.

**Selective compression** is the related principle: not all parts of a prompt are equally compressible. Instructions and rules need to remain literal; few-shot examples can sometimes be paraphrased; retrieved context can often be aggressively summarized. Apply different compression levels to different sections.

In practice, prompt compression tools are most useful for ad-hoc compression of large user-supplied content (a long document the user pasted into a chat) rather than for production prompt templates. Production templates are typically already short enough that automated compression saves little; the wins are upstream, in the design.

## Prompt and Output Length Budgets

A **prompt length budget** is a pre-declared cap on the total token count of the input portion of a request. Budgets force prioritization decisions early — if a budget is 8,000 tokens and the system prompt is 5,000, the per-request RAG retrieval gets at most 2,500 tokens and the user message gets the remaining 500. Without a budget, retrieval expands silently to fill available context.

An **output length budget** is the same idea on the output side, enforced via the `max_tokens` parameter (Chapter 1) and sometimes via prompt-level instructions like "respond in fewer than 100 words." Output budgets serve two purposes: they cap cost and they shape user experience (a long-winded response is often worse than a concise one).

A **concise output instruction** is a prompt-level directive that biases the model toward short responses ("Answer in one sentence." / "Respond in under 50 words." / "Skip pleasantries."). Concise instructions reduce typical output by 30–60% on chatty endpoints with no quality loss — often with a perceived quality gain because users prefer terse answers.

#### Diagram: Prompt Anatomy and Budget Allocation

<iframe src="../../sims/prompt-anatomy-budget/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Prompt Anatomy and Budget Allocation</summary>
Type: infographic
**sim-id:** prompt-anatomy-budget<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Show a typical production prompt as a stacked bar of its components (system prompt, tool definitions, few-shot, retrieved context, user message) with a length budget overlay, so learners can see how a budget forces prioritization.

Bloom Level: Apply (L3)
Bloom Verb: implement

Learning objective: Implement a prompt length budget by allocating tokens across the components of a typical request.

Canvas layout:
- Main area: A horizontal stacked bar showing the components of a request, each labeled with its token count
- Overlay: A vertical line marking the budget boundary
- Side panel: A list of components with sliders to adjust each one's token allocation

Components shown by default (sum: 8,000 tokens):
- System prompt: 3,200
- Tool definitions: 1,200
- Few-shot examples: 1,500
- Retrieved context: 1,500
- User message: 600
- Reserve for output: 1,000

Interactive controls:
- Slider for each component (within budget; over-budget triggers a red warning)
- Slider: Total budget (4K to 16K tokens)
- Buttons: "Auto-shrink system prompt", "Auto-prune few-shot", "Auto-compress retrieved context"

Data Visibility Requirements:
  Stage 1: Show all components within budget
  Stage 2: When user pushes a component over budget, show a red over-budget marker and the suggestion buttons
  Stage 3: When auto-actions are clicked, show the resulting reductions (animated slide)

Default state: All components within an 8K budget

Implementation: p5.js with responsive width and updateCanvasSize()
</details>

## Whitespace, Comments, Schemas, and Symbols

Four small but cumulative wins:

**Whitespace stripping** — remove unnecessary leading/trailing whitespace, collapse multiple consecutive newlines to one, drop indentation that the model doesn't need to interpret structure. Whitespace tokens (with their attached following words, Chapter 2) add up in long structured prompts.

**Comment removal** — for code prompts, drop comments that don't change model behavior. Code comments are often added for human readers, not for the model; the model can usually understand the code without them. Strip with caution — comments that explain non-obvious algorithms still earn their tokens.

**Schema minimization** — when sending JSON Schema (for structured outputs, Chapter 5) or tool definitions, prune optional fields that don't affect validation. A schema with verbose `description` and `example` fields on every property might be three times the size of the same schema with only the essentials.

**Symbol substitution** — for highly-repetitive references, define a short symbol once and use it many times. "The customer record" repeated 20 times is much more expensive than `R` defined as "the customer record" once and used as `R` thereafter. Use sparingly — too many symbols turn the prompt into a cipher and degrade model performance.

## Reusable Prompt Blocks

A **reusable prompt block** is a named chunk of prompt content that gets composed into multiple templates. Blocks are the prompt-engineering equivalent of functions — they reduce duplication, support unified updates, and align with cache breakpoints (Chapter 14).

A typical organization:

- `blocks/style_guide.md` — instructions for writing style, used by every content-generation prompt
- `blocks/safety_rules.md` — safety instructions, used by every user-facing prompt
- `blocks/json_schema.md` — output schema, used by every structured-output prompt

Templates compose these blocks at render time:

```
{{include style_guide}}
{{include safety_rules}}

You are summarizing a document. Produce a 3-sentence summary.

Document:
{{document_text}}

{{include json_schema}}
```

When the safety policy changes, you update one block and all templates pick up the change. When you want to cache a stable prefix, you ensure the included blocks come first and the variable parts come last — alignment with caching is a free side effect of good block organization.

#### Diagram: Before-and-After of a Real-World Prompt Trim

<iframe src="../../sims/prompt-trim-before-after/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Before-and-After of a Real-World Prompt Trim</summary>
Type: chart
**sim-id:** prompt-trim-before-after<br/>
**Library:** Chart.js<br/>
**Status:** Specified

Purpose: Show a representative production prompt before and after applying the techniques in this chapter, with the per-section token reduction visible.

Bloom Level: Evaluate (L5)
Bloom Verb: assess

Learning objective: Assess the cumulative impact of multiple prompt-engineering techniques on a representative prompt.

Chart type: Grouped horizontal bar chart
- Y-axis: Prompt section (System prompt, Tool defs, Few-shot, Retrieved context, User message, Output)
- X-axis: Token count

Two grouped series per section:
1. Before (gray bars)
2. After (green bars)

Sections and example reductions:
- System prompt: 5,200 → 2,800 (hygiene + instruction compression)
- Tool defs: 1,800 → 1,400 (schema minimization)
- Few-shot: 2,400 → 800 (pruning)
- Retrieved context: 1,500 → 1,500 (no change in this example — handled in Chapter 15)
- User message: 200 → 200 (no change)
- Output budget: 1,000 → 400 (concise output instruction)

Below the chart:
- Total before / total after / % reduction
- Monthly savings projection at sample request volume

Interactive controls:
- Toggle each technique on/off to see incremental contribution
- Slider: Monthly request volume

Default state: All techniques applied, 100K requests/month

Implementation: Chart.js horizontal grouped bars, responsive width
</details>

!!! mascot-tip "Audit Your Top Five Templates First"
    <img src="../../img/mascot/tip.png" class="mascot-admonition-img" alt="Pemba sharing a tip">
    Run the per-template cost roll-up from Chapter 11 and pick the top five templates by total monthly spend. Audit those five for hygiene, redundancy, dead context, verbose boilerplate, and few-shot pruning candidates. In my experience, the top five almost always have 20–40% of waste each. That's a 10–20% reduction in *total* LLM cost from a one-week investment. Where did all the tokens go? Spoiler: into a paragraph someone added in 2024 that no one has read since.

## Putting It All Together

You can now drive down token cost at the source. You apply **prompt engineering** as a cost discipline starting with **system prompt hygiene** — eliminating **redundant instruction**, **dead context**, and **verbose boilerplate**. You compress what remains via **instruction compression** and broader **token-aware rewriting**. You apply **few-shot pruning** to keep only the **few-shot examples** that earn their tokens, and you try **zero-shot prompting** as a baseline. You use **chain of thought** only where the reasoning gain justifies the output-token cost. You manage prompts as code via **prompt templates** with **template versioning**, **prompt variables**, and disciplined **variable interpolation**. You apply **prompt compression tools** for ad-hoc cases and **selective compression** to spare critical instructions. You enforce **prompt length budgets** and **output length budgets**, and you bias toward shorter responses with a **concise output instruction**. You collect the small wins — **whitespace stripping**, **comment removal**, **schema minimization**, **symbol substitution** — and you organize the whole library into **reusable prompt blocks** so updates and caching alignment come for free.

Chapter 14 takes the next step: structuring those prompts so they cache.

??? question "Quick Self-Check — Click to Reveal Answers"
    1. **What is system prompt hygiene?** The standing practice of keeping system prompts as short as possible — eliminating redundant instructions, dead context, and verbose boilerplate.
    2. **When is chain of thought worth the output-token cost?** On genuinely hard reasoning tasks (math, multi-step logic, complex code) where the accuracy gain is large. Not for simple classification or extraction.
    3. **Why prune few-shot examples?** Each example costs hundreds of input tokens on every request. After pruning to the examples that genuinely move quality, the savings recur forever.
    4. **What's a reusable prompt block?** A named chunk of prompt content composed into multiple templates — the prompt-engineering equivalent of a function. Reduces duplication and aligns naturally with cache breakpoints.
    5. **Why does adding a concise-output instruction save money?** It biases the model toward shorter responses. Output is the most expensive token category, so a 30–60% reduction in typical output size is a substantial cost win.

!!! mascot-celebration "End of Chapter 13"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Pemba celebrating">
    Prompts trimmed at the source. Now we structure them to cache — the single highest-leverage cost optimization in the whole book.


---

[See Annotated References](./references.md)

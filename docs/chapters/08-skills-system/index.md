---
title: The Skills System
description: Skills as a token-optimization primitive — anatomy, triggers, lazy loading, task-skill binding, misfires, and the practice of refactoring prose-heavy skills into script-backed versions
generated_by: claude skill chapter-content-generator
date: 2026-04-26 09:00:00
version: 0.07
---

# The Skills System

## Summary

Skills as a token-optimization primitive: the anatomy of a Skill (description, body, frontmatter, bundle, scripts), trigger design and precision, lazy loading versus eager listing, task decomposition and task-skill binding, skill misfires, and the practice of refactoring prose-heavy skills into script-backed versions for substantial token savings.

## Concepts Covered

This chapter covers the following 25 concepts from the learning graph:

1. Skill
2. Skill Description
3. Skill Body
4. Skill Trigger
5. Skill Invocation
6. Skill Frontmatter
7. Skill Bundle
8. Bundled Script
9. Skill Asset File
10. Lazy Skill Loading
11. Eager Skill Listing
12. Task Decomposition
13. Task-Skill Binding
14. Skill Selection
15. Skill Misfire
16. False Positive Trigger
17. False Negative Trigger
18. Trigger Precision
19. Skill Library
20. Anthropic Skill Format
21. Script Delegation
22. Shell Script Skill
23. Python Script Skill
24. Skill Refactoring
25. Token Reduction Ratio

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: LLMs, Tokens, and Generation Basics](../01-llms-tokens-generation-basics/index.md)
- [Chapter 3: Pricing, Economics, and Async API Modes](../03-pricing-economics-async-apis/index.md)
- [Chapter 4: The Anthropic Claude Ecosystem](../04-anthropic-claude-ecosystem/index.md)
- [Chapter 7: AI Coding Harnesses and Agentic Loops](../07-coding-harnesses-agentic-loops/index.md)

---

!!! mascot-welcome "Skills — The Lazy-Loading Knowledge Base"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Pemba waving welcome">
    Chapter 7 ended with a problem: the harness system prompt is huge, and stuffing every capability the agent might need directly into it makes every request expensive. Skills are the solution. They keep the *trigger description* in the context window (cheap) and load the *body* only when fired (lazy). Done well, Skills can move 30%+ of a typical session's baseline cost off the bill. Where did all the tokens go? Spoiler: out of the system prompt, into a Skill that only loads when needed.

## What Is a Skill?

A **skill** is a self-contained, declaratively-described capability that an agent can discover and invoke when a relevant task arises. Conceptually, a Skill is a small bundle that says: "If the user asks for X, do the following." The bundle contains a short *trigger description* (always loaded) and a *body* (loaded only when the trigger fires).

The cost-optimization motivation is precise. Without Skills, all the operational knowledge an agent might need has to live in the harness system prompt — every workflow, every command, every standard procedure — bloating every single request. With Skills, the system prompt only carries a list of trigger descriptions ("you can call the database-migration skill when the user asks about migrations"), and the actual procedural content loads on demand.

### Anatomy of a Skill

The standard Skill structure has six visible parts. Before walking through them, here is the practical mental model: a Skill is shaped like a markdown file with structured frontmatter, a body that the model will read on invocation, and (optionally) a directory of bundled scripts and reference assets that the body can call out to.

The parts:

- **Skill frontmatter** — the YAML block at the top of the Skill file containing structured metadata: `name`, `description`, `version`, `model` overrides, and any tool-permission configuration. Frontmatter is parsed by the harness and used to register the Skill.
- **Skill description** — a one-to-three-sentence trigger summary in the frontmatter. This is the part that lives in the context window at all times. It must be specific enough to fire on the right requests and short enough that loading it costs almost nothing.
- **Skill body** — the markdown content of the Skill file (everything after the frontmatter). The body contains the actual instructions the model follows when the Skill is invoked. Bodies range from a few hundred tokens to several thousand. The body is *not* loaded into context until the Skill fires.
- **Skill bundle** — the directory containing the Skill file and any associated assets. The convention is `skills/<skill-name>/SKILL.md` plus subdirectories for scripts, references, and templates.
- **Bundled script** — an executable script (shell, Python, Node, etc.) that lives inside the Skill bundle and is invoked by the Skill body to perform deterministic work without consuming tokens. Bundled scripts are the heart of token-efficient Skill design (covered in detail below).
- **Skill asset file** — any non-script support file in the bundle: a reference document, a template, a JSON schema, a glossary. Assets are read by the body on demand, not loaded eagerly.

### The Anthropic Skill Format

The **Anthropic Skill format** is the published convention for Skills in Claude Code (and the broader Anthropic SDK Skills system). A minimal Skill on this format:

```markdown
---
name: rename-symbol
description: Use this skill when the user asks to rename a symbol (function, variable, class) across a codebase. Handles language-aware refactors and updates imports.
---

# Rename Symbol Skill

To rename a symbol across the codebase:

1. Identify the language from the file extension
2. Run `bin/find-references.sh <symbol>` to enumerate occurrences
3. For each file, use the Edit tool to replace the symbol consistently
4. Update imports/exports if the symbol is exported
```

The `description` is the trigger; the body below is loaded only when the trigger fires.

## How Skills Get Invoked

### Skill Trigger and Skill Selection

A **skill trigger** is the conditional logic — typically expressed in the Skill's description field — that tells the harness when to invoke this Skill. Triggers are not executable predicates; they are descriptions that the model interprets in context. A good trigger is specific about the task category and explicit about boundary cases ("Use when X. Do not use when Y.").

**Skill selection** is the process by which the harness picks which Skill (if any) to invoke for a given user request. The selection is performed by the model itself, reading the trigger descriptions of all available Skills and choosing one (or none, or sometimes a chain). The model's selection decision is an LLM judgment — it can be wrong, which leads us to the misfire concept below.

A **skill invocation** is the moment the harness loads the Skill body into context and the model begins executing the Skill's instructions. From the model's perspective, this is a transparent context expansion: the Skill body simply appears in the conversation as if it had always been there.

### Eager Listing vs. Lazy Loading

These two patterns describe what *is* loaded into the context window at any given time:

**Eager skill listing** is the default: every Skill's frontmatter (specifically the `name` and `description`) is loaded into the harness system prompt at session start. The model can therefore see what Skills exist and choose one when relevant. The *bodies* are not loaded eagerly — only the descriptions.

**Lazy skill loading** is what happens when a Skill fires: the body (and any referenced bundled scripts or assets) is read into context just-in-time. The body is unloaded again as the conversation moves on (or stays in scope, depending on the harness — implementations vary).

The cost shape of this design is the whole point of Skills:

| Component | Eagerly Loaded | Cost Per Session |
|-----------|----------------|------------------|
| Skill descriptions (one-liners) | Yes | Small — N skills × ~50 tokens each |
| Skill bodies | No (only when fired) | Zero unless invoked |
| Bundled scripts and assets | No (only when read by body) | Zero unless invoked |

A Skill library of 50 Skills with detailed instructions might be 100,000 tokens of total content, but the eager footprint is only ~2,500 tokens of descriptions. That is a 40× compression of "available knowledge" relative to "context cost."

## Task Decomposition and Task-Skill Binding

**Task decomposition** is the process by which the harness (with the model's help) breaks a complex user request into a sequence of discrete tasks, each of which can be addressed by a Skill or by the base capabilities of the model. Decomposition is what enables Skills to compose: a single user request might invoke a "research" skill, then a "write report" skill, then a "format as PDF" skill in sequence.

**Task-skill binding** is the matching of a decomposed task to the best-fitting Skill from the available library. Binding happens via the same model-judgment mechanism as Skill selection — the model reads the task description and the available Skill triggers and chooses.

The diagram below shows the full flow from user request to bound Skill invocation:

#### Diagram: Task Decomposition and Skill Binding

<iframe src="../../sims/task-skill-binding-flow/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Task Decomposition and Skill Binding</summary>
Type: workflow
**sim-id:** task-skill-binding-flow<br/>
**Library:** Mermaid<br/>
**Status:** Specified

Purpose: Show how a single user request flows through task decomposition into multiple bound Skills, with token-cost annotations showing the savings versus loading every Skill body eagerly.

Bloom Level: Analyze (L4)
Bloom Verb: examine

Learning objective: Examine how the harness decomposes a user request and binds each task to a Skill, and quantify the token savings vs. an eager-load alternative.

Visual style: Flowchart with three swimlanes (User, Harness, Skills Library)

Steps:
1. User → Harness: "Generate a chapter outline for my new course on Token Optimization"
2. Harness (System Prompt with N Skill descriptions, total ~2,500 tokens)
3. Harness performs task decomposition:
   - Task 1: "analyze course description"
   - Task 2: "design chapter structure"
   - Task 3: "validate dependency order"
4. Task-skill binding:
   - Task 1 → course-description-analyzer skill (loads body, 1,800 tokens)
   - Task 2 → book-chapter-generator skill (loads body, 3,200 tokens)
   - Task 3 → invokes a bundled Python script (zero tokens for the script body)
5. Each Skill executes in turn, results bubble back to user

Annotations:
- Eager-load alternative: "Would have loaded all 50 Skill bodies = 100K tokens upfront"
- Lazy-load actual: "Loaded only 2 of 50 bodies = 5K tokens, and a script = ~50 tokens"
- Highlight the script invocation: "Replaces ~2,000 tokens of prose instructions with deterministic execution"

Interactive controls:
- Hover any step to see token cost
- Toggle: "Show eager-load comparison"

Implementation: Mermaid flowchart with swimlanes
</details>

## When Skill Selection Goes Wrong

Skill selection is an LLM judgment, and judgments can be wrong in two ways. Both have specific names and specific costs.

A **skill misfire** is any case where the wrong Skill (or no Skill) is invoked for a given task. Misfires fall into two categories:

- A **false positive trigger** is when a Skill fires on a task it should not have. Cost: the body of the wrong Skill loads into context (wasted tokens), and the model wastes additional tokens following its instructions before realizing the mismatch. False positives are usually caused by overly broad trigger descriptions ("use this skill for any data-related task" — too vague).
- A **false negative trigger** is when a Skill that should have fired did not. Cost: the model proceeds without the Skill's expertise and either produces a worse result or burns substantial tokens reinventing what the Skill encoded. False negatives are usually caused by under-specific descriptions that don't surface to the model when relevant.

**Trigger precision** is the metric for how well a Skill's description discriminates between the cases where it should fire and the cases where it should not. High-precision descriptions:

- Lead with the *task pattern*, not the *technology* ("Use when generating chapter content for an intelligent textbook" beats "Use for textbook stuff")
- List exclusions explicitly ("Do NOT use when chapter structure has not been created yet — use book-chapter-generator first")
- Mention the upstream and downstream context ("Use after book-chapter-generator and before quiz-generator")
- Are specific enough that two competing Skills cannot both fit

The diagnostic loop is straightforward: log every Skill invocation, examine the cases where the wrong Skill fired or the right one didn't, and revise the descriptions iteratively. This is one of the highest-leverage tuning activities in any harness deployment.

## Skill Refactoring: From Prose to Scripts

The single biggest cost win in Skill design is **script delegation** — moving deterministic procedural work out of model-readable prose and into bundled scripts that the Skill body invokes.

### Why Prose Is Expensive

When a Skill body says, in prose, "now compute the SHA-256 hash of the file and check if it matches the expected value," the model reads those instructions, generates a tool call to a hashing utility, reads the result, and reasons about whether it matches — a sequence that consumes tokens at every step. The model is essentially being asked to execute deterministic logic by simulating it through generation.

When the same work is delegated to a script — `bin/verify-hash.sh <file> <expected>` — the script runs in zero model-tokens, returns a single line of result, and the model only spends tokens on the part that genuinely requires judgment.

### Shell and Python Scripts

A **shell script skill** is a Skill where significant logic lives in shell scripts (`bin/*.sh`) bundled with the Skill. Shell scripts are best for:

- File operations (find, grep, replace patterns)
- Process orchestration (running other tools)
- Simple text transformations (sed, awk, jq pipelines)
- Anything that's easier to express as a pipeline than as prose

A **python script skill** is the same idea using Python (`bin/*.py`). Python is better for:

- JSON, YAML, and structured data manipulation
- Mathematical computation
- API calls with retry/backoff logic
- Anything requiring data structures more complex than text streams

The Skill body itself becomes a thin orchestration layer: "Read the input. Call `bin/process.py`. Interpret the output. Decide next step." All the heavy lifting happens in scripts, all the judgment happens in the model.

### Skill Refactoring and the Token Reduction Ratio

**Skill refactoring** is the practice of taking a prose-heavy Skill and rewriting it to delegate as much deterministic work as possible to scripts. The methodology:

1. Identify every step in the Skill body that is fully deterministic (no judgment required)
2. Extract that step into a script
3. Replace the prose with a one-line invocation
4. Verify the Skill still produces correct output on a test set
5. Measure token usage before and after

The **token reduction ratio** is the per-invocation token usage of the refactored Skill divided by the original. Well-executed refactors typically achieve a 0.5–0.7 ratio (30–50% reduction); aggressive refactors on highly-procedural Skills can reach 0.3 or lower (70%+ reduction).

\[
\text{Token Reduction Ratio} = \frac{\text{Tokens after refactor}}{\text{Tokens before refactor}}
\]

A 0.7 ratio applied across a Skill library used in 10,000 sessions per month at \$0.50 average baseline cost is \$1,500/month in direct savings — and the savings recur every month thereafter.

#### Diagram: Skill Refactoring Before-and-After

<iframe src="../../sims/skill-refactoring-before-after/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Skill Refactoring Before-and-After</summary>
Type: chart
**sim-id:** skill-refactoring-before-after<br/>
**Library:** Chart.js<br/>
**Status:** Specified

Purpose: Show the token cost of a representative Skill before and after script-delegation refactoring, broken down by step, so the source of the savings is visible.

Bloom Level: Evaluate (L5)
Bloom Verb: justify

Learning objective: Justify a Skill refactoring decision by quantifying the per-invocation token reduction and projecting the monthly savings at expected invocation volume.

Chart type: Grouped bar chart
- X-axis: Skill step (Step 1: Read inputs, Step 2: Validate schema, Step 3: Compute hash, ..., Step 7: Format output)
- Y-axis: Tokens consumed by step

Two grouped series:
1. Before refactor (gray bars) — every step has prose-driven token cost
2. After refactor (green bars) — deterministic steps drop to ~0 (script-delegated), judgment steps unchanged

Below the chart:
- Total before, total after, ratio
- Monthly savings projection panel (sliders: invocations/month, \$/MTok)

Interactive controls:
- Toggle each step: "Refactored to script" / "Still in prose" — recomputes totals
- Slider: invocations per month

Data Visibility Requirements:
  Stage 1: Show the before bars at full height
  Stage 2: As steps are toggled to refactored, watch the green bars drop
  Stage 3: Show the running ratio and monthly savings live

Default: 5 of 7 steps refactored to scripts

Implementation: Chart.js grouped bars, responsive width
</details>

!!! mascot-tip "The Skill Library Audit"
    <img src="../../img/mascot/tip.png" class="mascot-admonition-img" alt="Pemba sharing a tip">
    Once a quarter, walk your Skill library and ask three questions per Skill: (1) Does the trigger description fire on the right cases and only those? (2) Could any prose step in the body be replaced by a script? (3) Is anyone actually using this Skill? Skills you wrote but no one invokes are pure overhead — eager-loaded descriptions paying for nothing. Cheap systems are pruned systems.

## The Skill Library

A **skill library** is the collection of Skills available to a particular harness instance — typically a directory like `~/.claude/skills/` (user-level), `.claude/skills/` (project-level), or a packaged set distributed with a plugin. Libraries can be merged from multiple sources; later sources usually override earlier ones for same-named Skills.

Library hygiene matters because every Skill in the library contributes its description to the eager-loaded portion of the system prompt. A library of 200 Skills, each with a 100-token description, is 20,000 tokens of system-prompt overhead per request — every request, every session. That overhead is real money: at \$3/MTok input cached at 10%, it's \$0.006 per request just to know what Skills exist. Across millions of requests, the difference between a curated 30-Skill library and a sprawling 200-Skill library is meaningful.

The principle: include a Skill in your library only if it earns its eager-load cost through enough actual invocations. Track invocation counts; deprecate Skills that haven't fired in a quarter; keep the library lean.

## Putting It All Together

You can now design and operate a token-efficient Skill system. A **skill** is a self-contained capability with a **skill description** (eagerly loaded), a **skill body** (lazily loaded), and a **skill bundle** that may contain **bundled scripts** and **skill asset files**, all conforming to the **Anthropic skill format** with proper **skill frontmatter**. The harness performs **task decomposition** on user requests and uses **task-skill binding** to drive **skill selection**, firing a **skill trigger** that results in a **skill invocation**. The whole design depends on **lazy skill loading** rather than **eager skill listing** — only descriptions live in the context window. You watch for **skill misfires**, distinguishing **false positive triggers** from **false negative triggers**, and tune **trigger precision** iteratively. You curate a focused **skill library**. Most importantly, you exploit **script delegation** through **shell script skills** and **python script skills** to drive the **token reduction ratio** of your **skill refactoring** efforts down toward 0.5 or below — the structural cost win that pays back every invocation forever.

Chapter 9 starts the instrumentation half of the book: structured logging that gives you the data to do all of this analysis on real production traffic.

??? question "Quick Self-Check — Click to Reveal Answers"
    1. **Why are Skills more token-efficient than putting everything in the system prompt?** Only the description is eagerly loaded; the body is lazy-loaded only when the Skill fires. A 50-Skill library can have 100K tokens of total content but only ~2.5K tokens of eager footprint.
    2. **What is a false positive trigger?** A Skill firing when it should not have — usually caused by an overly broad trigger description.
    3. **What is the token reduction ratio?** The ratio of post-refactor tokens to pre-refactor tokens for a single Skill invocation. Lower is better; 0.5–0.7 is typical for a script-delegation refactor.
    4. **When should logic live in a bundled script rather than Skill prose?** When the work is fully deterministic (no judgment required) — file operations, hash computation, JSON manipulation, API calls. The model only consumes tokens for the parts that genuinely require reasoning.
    5. **Why does a sprawling Skill library cost more even when most Skills aren't invoked?** Every Skill description is eagerly loaded into the system prompt on every request. Libraries with many unused Skills pay description-loading cost forever for zero benefit.

!!! mascot-celebration "End of Chapter 8"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Pemba celebrating">
    Skills, lazy loading, script delegation — you now have the structural primitive that makes large agent capabilities affordable. Next chapter pivots to instrumentation: structured logging, the foundation that lets you measure everything we've discussed.


---

[See Annotated References](./references.md)

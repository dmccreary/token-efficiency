---
title: AI Coding Harnesses and Agentic Loops
description: How harness tools accumulate tokens across multi-turn sessions — agentic loops, compaction, subagents, memory, file tools, and the parallel token penalty
generated_by: claude skill chapter-content-generator
date: 2026-04-26 09:00:00
version: 0.07
---

# AI Coding Harnesses and Agentic Loops

## Summary

How harness tools (Claude Code, OpenAI Codex CLI, Google Antigravity) accumulate tokens across multi-turn sessions: agentic and tool-use loops, conversation compaction and summarization, agent memory, multi-step reasoning, subagent patterns, and the cost difference between serial and parallel execution including the parallel token penalty.

## Concepts Covered

This chapter covers the following 29 concepts from the learning graph:

1. AI Coding Harness
2. Agentic Loop
3. Tool Use Loop
4. Claude Code
5. Claude Code Session
6. Claude Code Hooks
7. OpenAI Codex CLI
8. Codex Session
9. Google Antigravity
10. Antigravity Workspace
11. Harness System Prompt
12. Harness Token Overhead
13. Session Token Accumulation
14. Per-Session Token Cost
15. Conversation Compaction
16. Auto Compaction
17. Manual Compaction
18. Tool Call Iteration
19. Multi-Step Reasoning
20. Subagent Pattern
21. Agent Memory
22. Persistent Memory File
23. Working Directory Context
24. File Read Tool
25. File Edit Tool
26. Conversation Summarization
27. Serial Execution
28. Parallel Execution
29. Parallel Token Penalty

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: LLMs, Tokens, and Generation Basics](../01-llms-tokens-generation-basics/index.md)
- [Chapter 3: Pricing, Economics, and Async API Modes](../03-pricing-economics-async-apis/index.md)
- [Chapter 4: The Anthropic Claude Ecosystem](../04-anthropic-claude-ecosystem/index.md)
- [Chapter 5: The OpenAI Ecosystem](../05-openai-ecosystem/index.md)
- [Chapter 6: The Google Gemini Ecosystem](../06-google-gemini-ecosystem/index.md)

---

!!! mascot-welcome "From Single Calls to Whole Sessions"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Pemba waving welcome">
    Up to now we've talked about single API requests. Coding harnesses change the game: a "session" can run for hours, accumulate hundreds of tool calls, re-send the entire conversation history on every turn, and rack up dollars in ways a single-request mental model cannot predict. This chapter installs the session-level mental model. Where did all the tokens go? Spoiler: into the third repeat of the file you already read.

## Harnesses, Loops, and Sessions

### What an AI Coding Harness Is

An **AI coding harness** is a software tool that wraps an LLM in a multi-turn loop with access to file-reading tools, file-editing tools, command execution, and a project working directory — making the LLM act less like a chatbot and more like a software engineer pair-programming with you. The three flagship harnesses you will encounter:

- **Claude Code** — Anthropic's official CLI/IDE harness, powered by Claude
- **OpenAI Codex CLI** — OpenAI's official coding harness, powered by GPT models and the o-series
- **Google Antigravity** — Google's agentic coding environment, powered by Gemini

All three share the same fundamental structure (LLM + tools + loop + working directory) but differ in defaults, tool inventory, and pricing exposure.

### Agentic Loops and Tool Use Loops

An **agentic loop** is the runtime pattern where the harness:

1. Sends the current conversation (system prompt + user request + tool results so far) to the model
2. Receives a response that may contain text, a tool call, or both
3. If the response contains a tool call, executes the tool, appends the result, and goes back to step 1
4. If the response is just text, returns it to the user (the loop pauses awaiting input)

A **tool use loop** is the same pattern viewed from the API side — the model calls a tool, the application returns a result, the model decides what to do next, possibly calling another tool. The loop continues until the model decides the task is complete or hits an iteration limit.

The crucial cost fact: **every iteration of the loop is a full LLM request that re-sends the entire prior conversation as input**. A 20-iteration tool loop is 20 separate API calls, each carrying everything from all 19 previous turns. Without prompt caching (Chapter 4 / Chapter 14), the input token cost grows roughly quadratically with loop length.

### Claude Code, Codex, Antigravity — Sessions and Workspaces

A **Claude Code session** is one invocation of the `claude` CLI in a working directory — from process start to process exit, all the requests fired during that session count against a single session token total. Sessions can run for hours; multi-day "sessions" are common when you're working on a large refactor with intermittent interruption.

**Claude Code hooks** are configurable shell-command callbacks that fire on specific events (`PreToolUse`, `PostToolUse`, `Stop`, etc.). Hooks let you enforce policy without paying the model to enforce it — a `PreToolUse` hook that blocks a `Bash(rm -rf ...)` call doesn't cost tokens; a system prompt instruction "do not delete files" does. Moving safety policy from prompt to hooks is a small but real cost optimization.

A **Codex session** is the OpenAI Codex CLI equivalent — one CLI invocation, one accumulating token total, similar tool inventory.

**Google Antigravity** organizes work into **Antigravity workspaces** — project-scoped containers that hold persistent state (memories, files, prior conversations) across sessions. The workspace concept is unique among the three; it shifts where some of the cumulative token cost lives (some context becomes implicit in the workspace rather than explicit in the conversation).

## Where the Tokens Go

### The Harness System Prompt

A **harness system prompt** is the (large) instruction set the harness ships to the model on every request, defining: the available tools, the working directory layout, file-reading rules, command-execution restrictions, output formats, safety policies, and dozens of other operational details. Real harness system prompts are typically 5,000–15,000 tokens.

The **harness token overhead** is what you pay for that system prompt on every request — a fixed per-request cost before any of your work begins. On a 200-iteration agent session, the system prompt alone, sent 200 times, is 1–3 million tokens. This is the single most important reason prompt caching exists and the single most important reason to enable it. With caching on, the harness system prompt costs the cache-write premium once and then ~10% of normal input on every subsequent turn.

### Session Token Accumulation

**Session token accumulation** is the cumulative token consumption of a session over time, summed across every tool-use iteration. The components:

- The harness system prompt (every turn, cached if possible)
- Tool definitions (every turn, cached with the system prompt)
- Conversation history (every turn, growing each iteration)
- Tool results — file contents, command output, search results (every turn)
- Model output (each turn's generation)

The **per-session token cost** is the dollar cost of one session, the unit metric you'll track in dashboards (Chapter 10) and budgets (Chapter 18). A typical Claude Code session on a small task might cost \$0.50–\$2; a large refactor session can cost \$20–\$200; a runaway session (Chapter 18) can cost much more.

The diagram below shows how a single agent session accumulates tokens turn by turn:

#### Diagram: Session Token Accumulation Over Tool-Call Iterations

<iframe src="../../sims/session-token-accumulation/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Session Token Accumulation Over Tool-Call Iterations</summary>
Type: chart
**sim-id:** session-token-accumulation<br/>
**Library:** Chart.js<br/>
**Status:** Specified

Purpose: Show how a coding-harness session accumulates input and output tokens turn by turn, with and without prompt caching, so the structural inevitability of growth is visible.

Bloom Level: Analyze (L4)
Bloom Verb: examine

Learning objective: Examine how harness sessions accumulate tokens turn by turn and identify which components grow linearly vs. quadratically.

Chart type: Stacked area chart with line overlay
- X-axis: Tool-call iteration number (1 to 50)
- Y-axis: Cumulative tokens

Stacked areas:
- Harness system prompt (constant per turn — but stacked sum grows linearly with N)
- Tool definitions (same shape)
- Conversation history (grows linearly per turn — sum is quadratic in N)
- Tool results (varies; mostly linear)
- Output (varies)

Overlay lines:
- Cumulative cost without caching (\$)
- Cumulative cost with caching (\$, lower curve)

Interactive controls:
- Slider: System prompt size (5,000–20,000 tokens)
- Slider: Average tool result size (200–5,000 tokens)
- Slider: Average output size per turn (200–2,000 tokens)
- Slider: Number of iterations (5–100)
- Toggle: Enable caching (default on)

Data Visibility Requirements:
  Stage 1: Show the stacked areas for each turn
  Stage 2: Show the cumulative-cost overlay lines diverging based on caching
  Stage 3: Annotate any "compaction event" insertions (manual or auto) where the conversation-history area drops sharply

Default state: 50 iterations, caching on, 8K system prompt, 1K avg tool result

Implementation: Chart.js stacked area, responsive width
</details>

## Compaction: Keeping Sessions Affordable

When the conversation grows past a certain size, the cost-per-turn becomes prohibitive — and worse, the model's effective attention degrades (the lost-in-the-middle effect, Chapter 16). The countermeasure is **conversation compaction**.

**Conversation compaction** is the process of replacing parts of a long conversation history with summaries, dropping less-relevant turns, or otherwise reducing the conversation's token footprint without losing the information the model needs to continue. Compaction trades information density (a summary is denser than the original turns) for token cost.

There are two main flavors:

- **Auto compaction** is performed by the harness automatically when the conversation crosses a token threshold (Claude Code triggers around ~150K tokens by default). The harness summarizes older turns, replaces them with the summary, and continues. The user usually sees a notification but doesn't have to act.
- **Manual compaction** is triggered by the user explicitly (`/compact` in Claude Code, equivalent commands in other harnesses). Use this when you've hit a natural break point (one task done, starting another) and want to reset the conversation cleanly.

**Conversation summarization** is the underlying mechanism — the harness uses the LLM itself to produce a compact summary of the older turns, then continues with `[SUMMARY OF EARLIER WORK: ...]` in place of the original conversation. The summarization itself costs tokens, but the savings on every subsequent turn pay it back quickly.

Compaction is the difference between sustainable long sessions and one-shot expensive sessions. Operate without it and your 4-hour debugging session will cost \$50; operate with it and the same session might cost \$8.

## Multi-Step Reasoning, Subagents, and Memory

### Multi-Step Reasoning and the Loop

**Multi-step reasoning** is the pattern where the model breaks a complex request into a sequence of smaller sub-tasks, executes each in order, and integrates the results. Modern reasoning models (Claude with extended thinking, OpenAI's o-series, Gemini's thinking modes) do this implicitly inside a single response; harnesses do it explicitly across tool-call iterations.

The cost shape is important: multi-step reasoning that happens *inside* a single response is billed as reasoning tokens at the output rate (Chapter 1). Multi-step reasoning that happens *across* harness loop iterations is billed as separate input + output token rounds. Same logical work, different cost profile.

### The Subagent Pattern

The **subagent pattern** is the design where a parent agent delegates a sub-task to a fresh, isolated agent (a "subagent") with its own conversation, tool inventory, and token budget. The subagent runs to completion and returns a single concise result to the parent. The parent's conversation only ever sees the result, not the subagent's intermediate work.

Subagents are a powerful cost structure:

- The parent's conversation stays small (only the result is appended, not the intermediate turns)
- The subagent's context is fresh, so the system prompt and any large reference material aren't duplicated in the parent
- Subagent execution can be parallelized when sub-tasks are independent

Claude Code, Codex, and Antigravity all support subagents (named differently — `Task`, sub-CLIs, sub-workspaces). Use them whenever a sub-task is independent and the result fits in a paragraph or less. Avoid them when the parent needs all the intermediate detail — in that case, the subagent's "concise summary" loses information the parent will then have to reconstruct expensively.

### Agent Memory

**Agent memory** is the broader concept of persistent state that survives across sessions. There are two main mechanisms:

- A **persistent memory file** is a file (e.g., `MEMORY.md`, `.claude/memory/`, Antigravity's workspace memories) that the agent reads at the start of every session and updates as new facts emerge. Persistent memory replaces "tell me about your project" preambles that would otherwise consume thousands of tokens at the start of every session.
- The **working directory context** is everything the agent learns from reading files, listing directories, and inspecting git state. It's not persistent across sessions (the agent re-reads on demand), but within a session it accumulates fast.

Memory done right is a huge savings: a project-specific style guide, a list of conventions, a `CLAUDE.md` describing the project's architecture — all of these mean the model arrives at session start already informed, instead of having to re-discover. Memory done wrong is a cost trap: a 10,000-token memory file loaded into every session whose information is rarely relevant just adds harness overhead.

### File Tools

The **file read tool** and **file edit tool** are the two tools every coding harness ships. Each of them carries cost considerations:

- **File read tool** — costs input tokens equal to the file's tokenized size. Reading a 5,000-line file twice in one session pays for it twice. The mitigation: use targeted reads (specific line ranges) rather than full-file reads when you can, and rely on prior turns instead of re-reading.
- **File edit tool** — typically costs less than file read because the model is sending the diff or the new content, not the whole file. But file-edit results often include the surrounding context for verification, so a "small edit" can return a few thousand tokens of read-back.

Hard-won lesson: re-reading the same file repeatedly is the single most common waste pattern in agent sessions. Compaction helps, but the better fix is teaching the model (via the system prompt or hooks) to remember what it's already read.

!!! mascot-tip "The Re-Read Trap"
    <img src="../../img/mascot/tip.png" class="mascot-admonition-img" alt="Pemba sharing a tip">
    A coding harness will happily read the same 800-line file four times in a session if nothing stops it — that's about 12,000 tokens of redundant input. You can spot this by grepping your session logs for repeated file paths. Then add a `PreToolUse` hook that warns when a file is being read for the second time, or shorten the system prompt instructions to remind the model to use what's already in context.

## Serial vs. Parallel Execution

### The Sequential Default

**Serial execution** is the default agent loop: one tool call at a time, each waiting for the previous to complete. Serial is simple, predictable, and easy to debug. Total wall-clock time is the sum of all tool latencies plus all model latencies.

### Parallel Execution and Its Penalty

**Parallel execution** is the pattern where the agent launches multiple tool calls or subagents simultaneously and integrates their results when all complete. Parallel execution dramatically reduces wall-clock time when the work is independent — three subagents researching three separate topics finish in roughly one-third the time of doing them serially.

The **parallel token penalty** is the cost overhead of parallel execution: each parallel branch carries its own copy of the system prompt, tool definitions, and any shared context. A 3-way parallel split that uses subagents will pay for the system prompt three times in the same wall-clock window, instead of once. The token cost is roughly proportional to the parallelism factor, even though the wall-clock time is roughly inversely proportional.

The decision rule:

- Use serial when wall-clock latency doesn't matter and tokens do
- Use parallel when wall-clock latency matters and the parallelism factor is small (2–4 branches)
- Avoid high-fan-out parallelism (10+ branches) unless the per-branch work is large enough to amortize the overhead — otherwise the parallel token penalty dominates

#### Diagram: Serial vs. Parallel Execution Cost-Latency Tradeoff

<iframe src="../../sims/serial-vs-parallel-tradeoff/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Serial vs. Parallel Execution Cost-Latency Tradeoff</summary>
Type: chart
**sim-id:** serial-vs-parallel-tradeoff<br/>
**Library:** Chart.js<br/>
**Status:** Specified

Purpose: Show wall-clock time and total token cost for the same multi-task workload executed serially vs. with various parallelism factors, surfacing the parallel token penalty.

Bloom Level: Evaluate (L5)
Bloom Verb: judge

Learning objective: Judge whether a particular multi-task workload should run serially or in parallel based on cost, latency, and the parallel token penalty.

Chart type: Dual-axis bar chart
- X-axis: Parallelism factor (1, 2, 4, 8, 16)
- Y-axis (left): Wall-clock time (seconds)
- Y-axis (right): Total token cost (\$)

Two bar series at each X position:
- Time bars (blue, left axis)
- Cost bars (orange, right axis)

Interactive controls:
- Slider: Number of independent subtasks (4–32)
- Slider: System prompt size per subagent (1K–20K tokens)
- Slider: Average tokens consumed by one subtask
- Toggle: "Caching on/off" — when off, the parallel penalty is much steeper

Data Visibility Requirements:
  Stage 1: Show the wall-clock-time bars decreasing as parallelism grows
  Stage 2: Show the cost bars increasing as parallelism grows (the penalty)
  Stage 3: Highlight the "knee" where added parallelism stops reducing time meaningfully but cost keeps growing

Default state: 8 subtasks, 8K system prompt, 5K avg subtask, caching on

Implementation: Chart.js dual-axis, responsive width
</details>

!!! mascot-warning "Parallel Is a Tax, Not a Discount"
    <img src="../../img/mascot/warning.png" class="mascot-admonition-img" alt="Pemba cautioning">
    Parallel execution buys wall-clock time at a token premium. Many engineers reach for parallelism reflexively because it feels efficient — but the token bill arrives later. The right question is "do my users care about this 30-second savings enough to pay 2× the tokens?" Often yes for interactive workflows, often no for batch.

## Putting It All Together

You now have a session-level mental model. You can pick an **AI coding harness** — **Claude Code**, **OpenAI Codex CLI**, or **Google Antigravity** — and reason about its **harness system prompt** and **harness token overhead**. You can analyze how an **agentic loop** (or **tool use loop**) accumulates costs across **tool call iterations**, watch **session token accumulation** in real time, and compute the **per-session token cost**. You can configure **Claude Code hooks** to enforce policy cheaply, organize work into a **Codex session** or **Antigravity workspace**, and trigger **conversation compaction** (both **auto compaction** and **manual compaction**) via **conversation summarization** to keep sessions affordable. You understand **multi-step reasoning** as both an in-response and across-loop pattern, can deploy the **subagent pattern** for independent sub-tasks, and exploit **agent memory** via **persistent memory files** to amortize project context. You know the cost shape of the **file read tool** and **file edit tool**, the dynamics of **working directory context**, and the tradeoff between **serial execution** and **parallel execution**, including the **parallel token penalty**.

Chapter 8 covers Skills — the harness primitive that lets you keep huge knowledge bases out of the system prompt by loading them on demand.

??? question "Quick Self-Check — Click to Reveal Answers"
    1. **Why does input token cost grow quadratically with tool-loop length?** Each iteration re-sends the entire prior conversation as input. Iteration N pays for N-1 prior turns, so the cumulative input cost is O(N²) without caching.
    2. **What is the harness token overhead?** The cost of the harness system prompt and tool definitions sent on every turn, before any user-specific work happens.
    3. **What does conversation compaction achieve?** It replaces long stretches of older conversation with a denser summary, reducing per-turn input tokens and counteracting the quadratic growth.
    4. **When should you use the subagent pattern?** When a sub-task is independent of the main conversation and its result can be expressed concisely. Subagents keep the parent conversation small and enable parallel execution.
    5. **What is the parallel token penalty?** The token overhead of running multiple parallel branches simultaneously, since each branch carries its own system prompt and shared context. Wall-clock time drops; token cost rises.

!!! mascot-celebration "End of Chapter 7"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Pemba celebrating">
    Sessions, loops, compaction, subagents — you can now reason about the long-running agent workloads where tokens accumulate fastest. Next chapter dives into Skills, the cleanest mechanism for keeping the harness system prompt small while still giving the agent access to deep knowledge.


---

[See Annotated References](./references.md)

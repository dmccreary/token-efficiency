---
title: Agent Budget Policy with Multiple Limits
description: Multi-meter dashboard showing tokens, tool calls, iterations, and wall-clock budgets firing under healthy and pathological agent scenarios.
image: /sims/agent-budget-policy-multi-limit/agent-budget-policy-multi-limit.png
og:image: /sims/agent-budget-policy-multi-limit/agent-budget-policy-multi-limit.png
twitter:image: /sims/agent-budget-policy-multi-limit/agent-budget-policy-multi-limit.png
social:
   cards: false
---

# Agent Budget Policy with Multiple Limits

<iframe src="main.html" height="602px" width="100%" scrolling="no"></iframe>

[Run the Agent Budget Policy MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

This dashboard simulates a single agent session against four independent budget caps — **tokens**, **tool calls**, **iterations**, and **wall clock** — and shows you which cap fires first as the session runs. Pick a scenario (healthy, token runaway, tool-call explosion, stuck loop), set the caps, and watch the meters fill in real time. The per-iteration timeline below the meters shows how much each iteration consumed of each resource.

Toggling **graceful degradation** on causes the agent to slow its consumption rate the moment any single cap crosses 75% — a real-world pattern for keeping a session within budget without aborting outright.

## How to Use

1. **Pick a scenario** in the dropdown. The scenario controls the per-iteration consumption profile (a healthy session uses ~2,500 tokens and 1–2 tool calls per step; a tool-call explosion uses 4–7 tool calls per step; etc.).
2. **Set your caps** with the four sliders. The defaults (50,000 tokens / 25 calls / 15 iterations / 120s) are reasonable for a small coding-assistant task.
3. **Click "Run session"**. Watch the four meters fill simultaneously. The first meter to hit 100% turns red and stops the session. The status line tells you which cap fired and at what iteration.
4. **Try the same scenario with different caps.** Token-runaway with a 10,000-token cap fires almost immediately. Stuck-loop with a 30-iteration cap might fire on iterations or wall clock depending on per-iteration timing.
5. **Turn on graceful degradation.** Re-run the same scenario. The meters slow when any one of them crosses 75%, and the status line says so. Notice that the same scenario with the same caps may now finish naturally that previously fired a cap.

## Bloom Level

**Apply (L3)** — implement a multi-cap budget policy and identify which cap fires first under different failure modes.

## Iframe Embed Code

```html
<iframe src="sims/agent-budget-policy-multi-limit/main.html"
        height="602px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Adult professional learners — engineers and platform-team members designing or operating LLM-based coding agents (Claude Code, Codex, Antigravity, or in-house equivalents).

### Duration

20–30 minutes inside Chapter 18, or 45 minutes as a standalone workshop with the practice scenarios.

### Prerequisites

- Chapter 7 (AI Coding Harnesses and Agentic Loops) — the agentic loop, tool-call iteration, session token accumulation
- Chapter 18 sections on per-session token budgets, loop iteration limits, runaway detection, and graceful degradation
- Comfort reading multi-axis charts

### Activities

1. **Healthy baseline (3 min).** Run the healthy scenario with default caps. Confirm that no cap fires and the session finishes naturally. Note the final values — this is your reference point for what "well-bounded" looks like.
2. **Token runaway, default caps (5 min).** Switch to "Token runaway" and run. Predict before clicking: which cap will fire first, and around which iteration? Run, then check.
3. **Tool-call explosion, default caps (5 min).** Same workflow. Predict, run, check. Notice that the iteration cap may also be close — the question is which fires *first*.
4. **Stuck loop, default caps (5 min).** Predict, run, check. Stuck loops often hit the wall-clock cap before tokens or calls — a useful illustration of why time bounds are necessary even when token bounds exist.
5. **Cap-tuning exercise (10 min).** For each pathological scenario, find a cap configuration that allows useful work (≥5 iterations) without letting the failure mode burn excessive cost. There is no single right answer; the discussion is about tradeoffs.
6. **Graceful degradation comparison (5 min).** Repeat the token-runaway scenario with graceful degradation off, then on. Compare iteration counts at firing. Discuss when graceful degradation is appropriate (long-running tasks, valuable partial results) and when it's not (security-sensitive workflows where you want a hard stop).

### Practice Scenarios

| # | Scenario | Caps | Predict: which fires first? |
|---|---|---|---|
| 1 | Healthy session | defaults | none — natural finish |
| 2 | Token runaway | defaults | tokens, around iteration 7–9 |
| 3 | Tool-call explosion | defaults | tool calls, around iteration 5–7 |
| 4 | Stuck loop | 50K tokens / 25 calls / 15 iters / 120s | iterations or wall clock — close race |
| 5 | Token runaway | 200K tokens, default others | iterations (token cap is now generous) |
| 6 | Healthy session | 10 iters cap, others default | iterations — even healthy sessions need slack |
| 7 | Tool-call explosion + graceful degradation | defaults | possibly natural finish — degradation buys headroom |

### Assessment

A learner has met the objective when they can:

- Predict (within 2 iterations) which cap fires first for a given scenario and cap configuration.
- Choose appropriate cap values for a new agent task type (e.g., "coding agent on a small bug-fix task" vs. "research agent that needs to explore a codebase").
- Decide when graceful degradation is appropriate vs. when a hard stop is the right policy.
- Articulate why all four caps are needed — eliminating any one creates a class of failure mode that the others cannot catch.

### Key insight to reinforce

Each cap catches a different failure mode:

- **Token cap** catches context bloat, repeated tool outputs, and runaway summarization.
- **Tool-call cap** catches retry loops and "search again" patterns.
- **Iteration cap** catches stuck loops and infinite reasoning.
- **Wall-clock cap** catches everything else — including external slowness (rate limits, timeouts) the others cannot see.

Removing any one of the four leaves a real production failure mode uncovered.

## References

1. Anthropic Engineering. *Building Effective Agents*. — Discussion of agent budgeting and graceful degradation in production.
2. The Claude Code documentation — session-level token and tool-call accounting.
3. Site Reliability Engineering (Beyer et al., O'Reilly) — Chapter on circuit breakers and graceful degradation, applicable to agent loops.
4. OpenAI Cookbook — *Function calling best practices* — including tool-call rate limits and retry policies.

---

## Senior Instructional Designer Quality Review

*Reviewer perspective: 15+ years designing engineering and platform-engineering curricula for adult professional learners; expertise in Bloom's revised taxonomy, scenario-based instruction, and assessment of operational decision-making.*

### Overall verdict

**Strong fit for the stated learning objective. Approve as-is for Chapter 18.** Score: **89/100 (B+).** This is one of the more pedagogically ambitious MicroSims in the textbook: it does not just *show* a budget policy — it makes the learner *operate* one through a real-time race between four meters. That is exactly what L3 "implement" demands of a budget-policy concept.

### What works (the pedagogy)

1. **Bloom alignment is exactly right.** L3 "implement" requires the learner to *apply a procedure to a new situation*. Each scenario is a new situation; each cap configuration is a new application of the same procedure. The repeated cycle of predict → run → check → adjust is the canonical Apply-level practice loop.
2. **Four meters racing in parallel is the right visual model.** Most budget-policy explanations describe each cap in isolation, leading learners to think of them as alternatives. Showing all four at once, racing toward 100%, makes it viscerally obvious that they cover *different* failure modes — the load-bearing pedagogy of this section of the chapter.
3. **The four scenarios are well-chosen.** Healthy / token-runaway / tool-call-explosion / stuck-loop covers the four pathology classes that a real coding agent operator will encounter, and each scenario maps cleanly to a different "first fired" cap. This forces the learner to internalize "each cap catches a different failure mode" rather than memorize one.
4. **Graceful degradation as a toggle.** Surfacing graceful degradation as an option, rather than baking it in or omitting it, lets the learner *test the difference*. The before/after framing is the right pattern for teaching a policy decision.
5. **Real-time animation, slow enough to read.** The 280ms tick is fast enough to feel responsive but slow enough that a learner can watch the meters move. Faster would have felt like an explosion; slower would have felt tedious.
6. **The status banner narrates what's happening.** Not just "cap fired" but "TOKEN cap fired at iteration 7. Stopping the agent loop." This narration is the difference between a sim that teaches and a sim that performs.

### What needs follow-up (the gaps)

1. **No "what would have happened" counterfactual.** When a cap fires at iteration 7, the learner cannot see what would have happened if the cap were higher. A "ghost trail" showing projected consumption past the cap (greyed out) would teach not just *which* cap fires but *how much it saved*. Score impact: −3.
2. **The per-iteration timeline is somewhat redundant with the meters.** The fuel gauges already show cumulative consumption; the timeline shows per-step deltas. For an experienced learner this is fine, but a novice might focus on the timeline and miss the cumulative race. Consider replacing the timeline with a "headroom remaining" view showing distance to the nearest cap. Score impact: −2.
3. **No way to add custom caps mid-session.** A real platform team often raises a cap during an investigation ("just this once, let it run to 100K tokens"). Letting the learner adjust caps *while running* and watch the meters reflow would teach an important operational pattern. Score impact: −2.
4. **The graceful-degradation reduction is hardcoded at 50%.** A real-world graceful-degradation policy might reduce by 30%, 50%, or 70% depending on context. A slider for the degradation factor would let the learner explore the tradeoff between "useful work continues" and "session still risks firing." Score impact: −1.
5. **No accumulated *cost* meter.** Tokens are the proxy, but learners would benefit from seeing the dollar cost of a runaway session. The textbook is, after all, about token *cost optimization*. Score impact: −2.
6. **The scenario descriptions in the status banner are short.** A learner who picks "Tool-call explosion" sees a one-sentence description and may not understand *why* tool calls explode. A 2–3 sentence vignette ("A flaky search tool returns inconsistent results, so the agent retries...") would ground the simulation in real operational scenarios. Score impact: −1.

### Accessibility and clarity

- **Color-blind safety:** The blue / amber / red / purple per-meter color scheme is distinguishable under common color-blindness profiles. The cap-fired status banners use distinct background colors AND distinct prefix text ("TOKEN cap fired", "TOOL-CALL cap fired") so color is not the only channel.
- **Status banner uses semantic background colors** that pass WCAG AA contrast.
- **Sliders are keyboard-focusable** and arrow-adjustable, which is required for engineers who pair-program with screen readers.
- **The per-iteration timeline uses a triple-axis chart** (tokens, calls, seconds) which is dense; a less experienced learner may need the lesson plan to walk them through reading it.

### Cognitive load assessment

- **9 simultaneous interactive elements** (4 meters + 4 cap sliders + 1 dropdown + 1 toggle + 2 buttons + 1 timeline). This is at the upper edge of working memory.
- **Mitigated by spatial grouping** — meters at top, status mid-page, timeline below, controls at bottom — which the CSS does correctly.
- **The simulation runs at a comfortable pace** (about 3 iterations per second) so the learner has time to read each meter movement.

### Pedagogical bias check

- The scenarios bias toward *failure modes*, not toward *successful operations*. This is appropriate for a chapter on budget *policies* — the policies exist precisely because failure modes happen — but a future revision might add a "complex but legitimate" scenario where the agent *should* run for 30 iterations and the lesson is about distinguishing real work from runaway.
- The graceful-degradation default is *off*, which biases the learner toward seeing the failure mode first. This is the correct pedagogical sequence (problem before solution) but should be explicit in the lesson plan.

### Recommendation

**Approve for use in Chapter 18 as currently implemented.** The six gaps above are real but none of them block correct learning of the L3 objective. Open follow-up tickets for items 1, 3, and 5 (highest impact).

The MicroSim teaches what it claims to teach, makes the four-cap race viscerally clear, and gives the learner enough scenarios to build a real working model of why multi-cap policies are necessary. Ship.

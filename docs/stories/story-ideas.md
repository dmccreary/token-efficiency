---
title: Story Ideas for Token Optimization
description: A curated list of 12-panel mini graphic-novel ideas — fictional case studies of organizations whose AI systems started with high token costs and learned to lower them by applying lessons from this textbook.
---

# Story Ideas for Token Optimization

These 12-panel mini-graphic novel ideas are designed to bring the lessons of
this textbook to life through *fictional* organizations and characters. Every
story follows the same shape: a team rolls out a generative-AI system with
the best of intentions, watches the token bill climb past what the value
justifies, and then applies a specific chapter's technique to drive costs
down without losing quality.

The throughline — the thing every story is really about — is this:

> **Good intent doesn't pay the bill. Real value comes from keeping token
> cost low and answer quality high. Cheap systems are happy systems.**

Pemba the Red Panda appears as a recurring guide across the series, dropping
in to celebrate clever optimizations and gently call out the bloat.

## Selection Criteria

Stories were selected for:

- **Pedagogical anchoring** — each story ties tightly to one or two chapters
- **Realism** — every "mistake" is one we have actually seen in production
- **A clear before/after** — a measurable cost drop the reader can feel
- **Emotional arc** — a team under pressure, a clever fix, a happy ending
- **No real names** — all organizations and people are fictional composites

## Story Ideas

### 1. The Red-Panda Chatbot — A High School Discovers the Compact Knowledge Graph (FEATURED)

| | |
|---|---|
| **Setting** | Cedar Ridge High School, fictional U.S. public high school, present day |
| **Theme** | Good intentions meet a runaway bill; structure beats search |
| **Connection** | [Case Study: A Little Graph Saves a Lot of Tokens](../case-studies/little-graph/index.md), [Ch 15 — RAG Optimization](../chapters/15-rag-optimization/index.md), [Ch 11 — Log File Analysis](../chapters/11-log-file-analysis/index.md) |

The student tech club at Cedar Ridge High builds "Pemba Bot," a friendly
chatbot featuring their red-panda mascot, to answer questions about course
prerequisites, club schedules, and where Room 214B actually is. They embed
every PDF the school has ever published into a vector store and proudly
launch on the first day of school. In the first month the bill is \$1,100 and
usage is climbing — the principal calls a meeting. A log audit shows that 80% of
queries are *structural* ("what does AP Chemistry require?", "what clubs
meet Thursday?") and a hand-curated four-column CSV — 180 concepts of
courses, prerequisites, schedules, and clubs — answers them in a 269-token
prompt instead of a 3,000-token RAG window. The team keeps RAG only for the
"explain in two sentences" questions, routes the rest to the new Compact
Knowledge Graph (CKG), and watches token cost drop **40×**. The principal
approves the renewal. Pemba does a small celebration dance.

*Token-efficiency lesson:* When questions have a *shape* — dependency,
path, taxonomy — give them a structure, not a search. The cheapest token
is the one you didn't retrieve.

---

### 2. The 4,000-Token "Be Helpful"

| | |
|---|---|
| **Setting** | A two-year-old SaaS startup, ~30 engineers, AI feature owner under deadline |
| **Theme** | Slow accretion is the silent cost killer |
| **Connection** | [Ch 13 — Prompt Engineering for Token Efficiency](../chapters/13-prompt-engineering-tokens/index.md), [Ch 14 — Prompt Caching Patterns](../chapters/14-prompt-caching-patterns/index.md) |

The system prompt for "Helpr," an in-app assistant, started at 200 tokens
and a single line: *"Be helpful."* Eighteen months later it is 4,000 tokens
of layered legacy: an outdated tone guide, three competing escalation
policies, a JSON example for a feature that was deprecated last quarter,
and a paragraph nobody can find the original author of. Every single API
call ships the entire thing. A new engineer counts the tokens, runs a
diff against actual model behavior, and discovers that 60% of the prompt
has zero measurable effect on output. The team rewrites the prompt down to
600 tokens, adds prompt caching on the stable prefix, and cuts per-call
input cost by **85%** — with quality scores indistinguishable on their
golden test set.

*Token-efficiency lesson:* System prompts grow like garages. If nobody
ever audits them, you're paying rent on tokens that aren't doing anything.

---

### 3. The Cache That Wasn't

| | |
|---|---|
| **Setting** | A mid-size fintech, fraud-review team, in production six months |
| **Theme** | Confident wrong is more expensive than honest unsure |
| **Connection** | [Ch 14 — Prompt Caching Patterns](../chapters/14-prompt-caching-patterns/index.md), [Ch 9 — Structured Logging](../chapters/09-structured-logging/index.md) |

The team enables Anthropic prompt caching, ships a celebratory Slack post
("we just cut input cost in half!"), and goes home. Two weeks later the
bill is unchanged. A senior engineer pulls the structured logs and finds
that `cache_read_input_tokens` is zero on every single call. The
culprit: the very first line of the system prompt is a freshly generated
ISO-8601 timestamp and a UUID per request — every cache key is unique, so
nothing ever hits. Moving the volatile fields to the suffix and marking
the stable prefix with `cache_control` lifts the hit rate to **94%** the
next morning. The team adds a dashboard panel for hit rate so this can
never silently regress again.

*Token-efficiency lesson:* Caching only works if the prefix is actually
stable. Measure the hit rate, or you're not caching — you're hoping.

---

### 4. The Agent That Wouldn't Stop

| | |
|---|---|
| **Setting** | A platform-engineering team, late on a Friday, autonomous coding harness |
| **Theme** | Good loops and runaway loops look the same until the bill arrives |
| **Connection** | [Ch 7 — Coding Harnesses and Agentic Loops](../chapters/07-coding-harnesses-agentic-loops/index.md), [Ch 18 — Agent Budget Policies](../chapters/18-agent-budget-policies/index.md) |

An engineer kicks off an agentic harness on a vague refactor request
("clean up the auth module") and goes home for the weekend. The agent
edits a file, runs tests, hits a flaky test, "fixes" it by editing
another file, hits another flaky test, and spirals into 1,400 tool calls
and \$2,300 in tokens before Monday morning. The team adds a per-session
token budget, a loop-iteration cap, a circuit breaker that trips when the
same file is edited five times, and a wall-clock limit. Pemba reviews the
new policy and approves: *"Autonomy without a budget is just a leak with
ambition."*

*Token-efficiency lesson:* Agents don't know when to stop. You have to
tell them — in tokens, in loops, in wall-clock minutes, and in retries.

---

### 5. The Invisible Bill

| | |
|---|---|
| **Setting** | A 12-person SaaS startup, no observability on LLM calls, day of the first surprise invoice |
| **Theme** | You cannot optimize what you cannot see |
| **Connection** | [Ch 9 — Structured Logging](../chapters/09-structured-logging/index.md), [Ch 11 — Log File Analysis and Cost Hotspots](../chapters/11-log-file-analysis/index.md) |

The CFO forwards an Anthropic invoice for \$48,000 with the subject line
"???". Nobody on the engineering team can attribute a single dollar of it
to a feature, a user, or a customer. They spend a long weekend wiring up
structured logging — model, prompt hash, input/output/cached tokens, cost,
feature, user, outcome — and an analysis notebook. Pareto analysis shows
**78% of cost** comes from one feature: a "summarize the whole document"
button that an enterprise customer is hammering with 400-page PDFs. They
add a length cap, a summarization-tier cascade, and a per-customer rate
limit. Next month's bill is \$11,000.

*Token-efficiency lesson:* The first dashboard pays for itself. Without
attribution, you're just paying the bill and hoping it gets smaller.

---

### 6. The Wrong Model for Every Job

| | |
|---|---|
| **Setting** | A customer-support automation team using one flagship model for every request |
| **Theme** | Spend tokens like money — match the tool to the task |
| **Connection** | [Ch 17 — Model Routing and Output Control](../chapters/17-routing-output-control/index.md) |

The support team's classifier — "is this email a refund request, a bug
report, or a sales question?" — runs on the most expensive flagship model
because that was easiest to wire up first. Every classification costs the
same as drafting a thoughtful reply. An engineer writes a routing layer
that sends classification to a cheap, fast model, escalates only when the
confidence score drops below a threshold, and falls back to the flagship
on ambiguous cases. **70% of traffic** moves to the cheap tier with no
measurable quality change. The team frames the model choice as a cascade
on a whiteboard and labels it "the menu" — a small joke about ordering
the right thing for the right plate.

*Token-efficiency lesson:* Cheap-first cascades aren't a compromise — they
are how you free up budget to spend the expensive tokens where they
actually matter.

---

### 7. The Async They Forgot They Could Use

| | |
|---|---|
| **Setting** | A media company running a nightly tagging job over 200,000 articles |
| **Theme** | If a workload doesn't need an answer in seconds, it shouldn't pay for one |
| **Connection** | [Ch 3 — Pricing, Economics, and Async APIs](../chapters/03-pricing-economics-async-apis/index.md), [Ch 19 — Batch Operations, Privacy, and Compliance](../chapters/19-batch-privacy-compliance/index.md) |

The nightly tagging pipeline fires off 200,000 synchronous API calls
between 2 AM and 6 AM. It works, but the bill is enormous. An engineer
notices the job has a four-hour SLA and tries the vendor's batch API,
which advertises a 50% discount in exchange for a 24-hour completion
window. She submits the same workload as a single batch job, the results
come back in 90 minutes, and the cost drops by half. The team writes a
one-page rule for itself: *"If the SLA is longer than an hour, try batch
first. If it's longer than a day, batch is mandatory."*

*Token-efficiency lesson:* Synchronous is for humans waiting. Most
pipelines are not humans waiting.

---

### 8. The Skill That Wrote Itself

| | |
|---|---|
| **Setting** | An internal-tools team maintaining a sprawling 8,000-token Skill |
| **Theme** | Some work belongs in prose; most work belongs in scripts |
| **Connection** | [Ch 8 — The Skills System](../chapters/08-skills-system/index.md) |

The team's "release-notes generator" Skill is 8,000 tokens of step-by-step
prose: parse this format, extract these fields, sort like this, format
like that. The model regenerates the same deterministic logic on every
call. An engineer rewrites the Skill: a short trigger description, a
concise body, and a 60-line Python script that handles the parsing,
sorting, and formatting deterministically. Per-invocation token use drops
**32%**, output is more consistent (no more drift in date formats), and
the script is testable. Pemba pins a sticky note to the team's monitor:
*"If a model is doing arithmetic, you've made a wrong turn."*

*Token-efficiency lesson:* Move every deterministic step out of the
prompt. Models are for judgment, not for sorting.

---

### 9. The Eternal Conversation

| | |
|---|---|
| **Setting** | A premium customer-support chatbot serving long, multi-turn sessions |
| **Theme** | Conversations grow; context budgets don't |
| **Connection** | [Ch 16 — Context Window Management](../chapters/16-context-window-management/index.md) |

The support agent keeps the entire conversation history in context, no
matter how long the session runs. By turn 30, every reply costs almost
\$1 because the model is re-reading the whole transcript. The team adds
hierarchical summarization: a rolling summary of the first 20 turns
plus the last 10 verbatim, evicting the rest. Per-reply cost stops
growing with conversation length. A side benefit: the model stops
getting confused by stale facts from early in the chat. *Lost-in-the-
middle* turned out to be lost-in-the-budget too.

*Token-efficiency lesson:* Long-running sessions need a memory policy.
Without one, every turn pays rent on every previous turn — forever.

---

### 10. The A/B Test That Lied

| | |
|---|---|
| **Setting** | A growth team A/B testing a "more concise" prompt variant |
| **Theme** | The metric you don't measure is the one that bites you |
| **Connection** | [Ch 12 — A/B Testing Methodology](../chapters/12-ab-testing-methodology/index.md), [Ch 10 — Observability and Dashboards](../chapters/10-observability-dashboards-alerting/index.md) |

The team ships "Prompt B," which trims input by 40%. They high-five and
declare a 40% cost win. A skeptical engineer pulls full per-call cost,
not just input tokens, and discovers Prompt B encourages longer, more
hedged outputs — output tokens are up **62%**, and since output is billed
at 5× the input rate, total cost per call is *higher* than Prompt A.
The team rebuilds their experiment harness with proper guardrail metrics
(input tokens, output tokens, total cost, quality score, satisfaction)
and adds a checklist: no A/B test ships without all four.

*Token-efficiency lesson:* "Cheaper input" is not "cheaper." Always
measure total cost per successful outcome — and watch the output side.

---

### 11. The Missing Dashboard Dimension

| | |
|---|---|
| **Setting** | A platform team responsible for an internal AI gateway used by 12 product teams |
| **Theme** | A single number tells you nothing; the right cuts tell you everything |
| **Connection** | [Ch 10 — Observability, Dashboards, and Alerting](../chapters/10-observability-dashboards-alerting/index.md) |

The platform team's dashboard shows one number: total daily LLM spend.
It's been climbing 12% week over week and nobody knows why. An engineer
adds three new dimensions to the dashboard — cost per feature, cost per
team, cost per user — and the cause is instantly visible: one internal
team's nightly evaluation job is running at 3× the cardinality it was
designed for, after a hackathon ID got re-used as a permanent feature
name. A two-line config change ends the spike. The team adds a
cardinality-explosion alert so it never happens silently again.

*Token-efficiency lesson:* "Total cost" is the least actionable number
on your dashboard. The dimensions are where the answer lives.

---

### 12. The Tokenizer Surprise

| | |
|---|---|
| **Setting** | A two-vendor migration from Claude to Gemini for a copy-generation feature |
| **Theme** | Same prose, different tokens, different bill |
| **Connection** | [Ch 2 — Sampling, Tokenization, and Embeddings](../chapters/02-sampling-tokenization-embeddings/index.md), [Ch 6 — The Google Gemini Ecosystem](../chapters/06-google-gemini-ecosystem/index.md) |

The team estimates the migration cost using the source vendor's
tokenizer, signs off on a budget, and migrates. The first weekly bill
comes in **30% over** the estimate. Investigation reveals the new
vendor's tokenizer splits the team's brand-heavy product copy into more
tokens than the old one did — emoji, code blocks, and specific product
names all tokenize differently. They rebuild the cost model with
per-vendor tokenizers, find a few prompt-template tweaks that close the
gap, and add a *tokenizer-drift* line item to every cross-vendor
proposal from then on.

*Token-efficiency lesson:* Token counts are vendor-specific. Count with
the tokenizer you're going to ship on, not the one you happen to know.

---

### 13. The Audit That Saved the Contract

| | |
|---|---|
| **Setting** | A small healthtech startup serving a hospital pilot, two weeks before a HIPAA audit |
| **Theme** | Logging is a feature; logging *carelessly* is a liability |
| **Connection** | [Ch 9 — Structured Logging](../chapters/09-structured-logging/index.md), [Ch 19 — Batch Operations, Privacy, and Compliance](../chapters/19-batch-privacy-compliance/index.md) |

The team wired up beautiful structured logging — every prompt, every
completion, every token count — straight into a third-party
observability tool. Two weeks before the HIPAA audit, the compliance
officer flags that the prompts contain unredacted patient names,
diagnoses, and dates of birth, and the logs are being shipped to a
vendor that hasn't signed a BAA. A frantic week of work later, the
team has PII detection on the way in, redaction before logs leave the
trust boundary, hashing for fields needed for joins, and an audit trail
showing every redaction event. The contract survives. The on-call
engineer goes home and sleeps for 14 hours.

*Token-efficiency lesson:* Privacy-safe logging is not a tax — it's a
ship-blocker if you skip it. Build it on day one, not week 39.

---

### 14. The Capstone — A Quarter of Discipline

| | |
|---|---|
| **Setting** | A 40-engineer organization that took the textbook seriously for one quarter |
| **Theme** | None of these wins are dramatic alone; together they compound |
| **Connection** | [Ch 20 — Capstone Projects and Continuous Practice](../chapters/20-capstone-projects-practice/index.md) |

A pragmatic engineering manager picks a single feature — the AI search
bar in the company's flagship product — and runs it through every
chapter of the textbook in a quarter. They instrument it (Ch 9), find
the hotspots (Ch 11), trim the prompt (Ch 13), turn on caching (Ch 14),
add routing (Ch 17), cap the agent (Ch 18), batch the offline parts
(Ch 3 / Ch 19), and A/B test every change (Ch 12). No single change
moves the needle by more than 25%. Stacked, they cut total cost by
**12×** and improve answer quality on the golden set. The manager
presents one slide to the CFO with two lines on it — old monthly cost,
new monthly cost — and the CFO funds the team's next year. Pemba shows
up in the back of the room, claps quietly, and writes on the whiteboard:
*"Every token counts — and counting is fun."*

*Token-efficiency lesson:* No single optimization wins. Discipline,
applied across the whole stack, compounds into the kind of cost cuts
that change what your business can afford to ship.

---

## How to Generate a Story

To turn any of these ideas into a full 12-panel graphic novel with
generated images, use:

> /story-generator

Provide the story title and the skill will handle the rest — writing the
narrative, creating the panel image prompts, and optionally generating
all panel images. Each story produces one cover plus 12 panels (13 PNGs
total) at 16:9 widescreen.

The featured story (#1, **The Red-Panda Chatbot**) is the natural first
one to produce — it sets up Pemba as the recurring guide and anchors the
series in the textbook's case-study material.

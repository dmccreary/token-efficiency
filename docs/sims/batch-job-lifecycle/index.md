---
title: Batch Job Lifecycle
description: State diagram of an LLM batch job from submission through download, with idempotency, retry, and webhook vs polling notification paths.
image: /sims/batch-job-lifecycle/batch-job-lifecycle.png
og:image: /sims/batch-job-lifecycle/batch-job-lifecycle.png
twitter:image: /sims/batch-job-lifecycle/batch-job-lifecycle.png
social:
   cards: false
---

# Batch Job Lifecycle

<iframe src="main.html" height="662px" width="100%" scrolling="no"></iframe>

[Run the Batch Job Lifecycle MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

This state diagram walks the full lifecycle of an LLM batch job: from initial submission with an idempotency key, through vendor-side queueing and processing, to one of four terminal states (Completed, Partial, Failed, Expired), and finally through download and the optional retry path for partial results. Every state shows expected duration and the correct next action when you hover it.

The toggle switches between the **webhook** and **polling** completion paths. Webhook is the production-grade pattern (vendor calls you when the job is done); polling is the simpler fallback when webhooks are not feasible. Both end at the same terminal states; the difference is in how your client learns about the transition.

## How to Use

1. **Hover "Pending"** to see the expected wait time and what idempotency does for you.
2. **Hover the three terminal "Completed/Partial/Failed" boxes** to see what action each demands. Notice that Partial is the only one with a retry loop — the failed sub-requests get rebuilt into a new batch.
3. **Hover "Expired"** to see the (often-overlooked) case where the vendor SLA window passes without completion. Most vendors don't bill for expired jobs, but you must verify.
4. **Toggle "Use polling instead of webhook"**. A new purple "Poll" node appears with self-loops for each non-terminal status. Compare: polling is simpler to operate but burns more API calls and adds latency to your detection of completion.
5. **Try to spot the idempotency win.** Both diagrams have an "Idempotency key" annotation on the Submit edge. Hover Pending to read why this prevents double-billing on retried submission.

## Bloom Level

**Apply (L3)** — implement a robust batch pipeline including idempotency, retry, and webhook-based completion notification.

## Iframe Embed Code

```html
<iframe src="sims/batch-job-lifecycle/main.html"
        height="662px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Engineers building or operating batch LLM workloads (overnight summarization, large-scale eval runs, content classification at scale).

### Duration

15–20 minutes inside Chapter 19.

### Prerequisites

- Chapter 19 sections on Batch API, idempotency keys, retry policy, and webhook notification
- Comfort with REST APIs and async HTTP patterns

### Activities

1. **Trace the happy path (3 min).** Walk from Not Submitted → Pending → In Progress → Completed → Done. Hover each state, read the duration and action.
2. **Walk the partial-failure retry loop (5 min).** Start at In Progress, hit Partial. Read the retry guidance. Notice that the retry batch is built from *only the failed sub-requests* and uses a *new* idempotency key.
3. **Toggle to polling (3 min).** Re-trace the happy path with polling. Notice the Poll node's self-loops and the GET /jobs/{id} call pattern.
4. **Bring your own scenario (5 min).** Use the practice scenarios.

### Practice Scenarios

| # | Scenario | Which terminal state? | Action |
|---|---|---|---|
| 1 | Large eval run finishes overnight, all sub-requests succeed | ? | ? |
| 2 | 95 of 100 sub-requests succeed, 5 hit a model timeout | ? | ? |
| 3 | JSONL upload had a malformed line, vendor rejects | ? | ? |
| 4 | Job is queued but exceeds 24h SLA window | ? | ? |
| 5 | Network drops mid-submit, client retries with same idempotency key | ? | ? |

### Assessment

A learner has met the objective when they can:

- Identify which terminal state a given operational scenario lands in.
- Articulate why idempotency keys prevent double-billing on retried submission.
- Choose between webhook and polling notification with reasons (latency, ops overhead, infra constraints).
- Build the retry batch correctly (failed sub-requests only, new idempotency key).

## References

1. Anthropic Documentation — *Message Batches API* — official spec for batch lifecycle and idempotency semantics.
2. OpenAI Documentation — *Batch API guide* — covers the JSONL upload, status polling, and result download flow.
3. Stripe API design notes — *Idempotency for distributed systems* — the canonical pattern reference.
4. AWS Architecture Blog — *Webhook vs polling tradeoffs* — engineering discussion of when each pattern fits.

---

## Senior Instructional Designer Quality Review

*Reviewer perspective: 15+ years designing engineering and data-science curricula for adult professional learners; expertise in Bloom's revised taxonomy, evidence-based assessment design, and accessibility of technical content.*

### Overall verdict

**Strong fit for the stated learning objective. Approve as-is for Chapter 19.** Score: **88/100 (B+).** This is a competent Apply-level (L3) state diagram with the right amount of operational detail to teach implementation. The webhook-vs-polling toggle is the right call for surfacing a real engineering decision, and the partial-failure retry loop is the most common production case that gets undertaught — the sim handles it head-on.

### What works (the pedagogy)

1. **Bloom alignment is correct.** L3 "implement" requires the learner to *use a procedure*. Hovering each state reveals the procedure step (what to do next), and the toggle exposes a real implementation choice. This is exactly the L3 move for a state-machine concept.
2. **Idempotency is woven into the diagram, not a sidebar.** It appears on the Submit edge, in the Pending hover content, and again on the Retry transition. A learner cannot read this diagram without bumping into idempotency three times.
3. **Partial is its own terminal state, not a footnote.** Most batch lifecycle docs treat partial success as an afterthought ("if some failed, retry"). Calling it out as a distinct yellow state with its own retry path is the textbook-correct treatment.
4. **Webhook vs polling toggle is symmetric.** Both paths reach the same terminal states; the toggle only changes the detection mechanism. This is the right framing — the lifecycle is the same; the operational choice is about how you learn about it.

### What needs follow-up (the gaps)

1. **No cost annotations on the diagram itself.** The hover content mentions "cost so far: $0" for Pending and "batch-discounted price (~50%)" for Completed, but the diagram doesn't surface where billing happens visually. A small dollar-sign badge on the Completed/Partial/Failed boxes would make billing-events legible at a glance. Score impact: −3.
2. **The polling diagram doesn't show the backoff schedule.** The hover mentions "start at 10s, double up to 5min" but the diagram just shows a self-loop. A small "10s → 20s → 40s..." annotation would teach the backoff pattern. Score impact: −2.
3. **No way to simulate a retry actually happening.** The Retry node and arrow exist, but clicking them does nothing. A "Run a retry of N failed requests" button that animates a new batch through the Pending → In Progress → Completed path would close the loop on L3 "implement." Score impact: −3.
4. **The "Done" state is underused.** It appears as a sink but doesn't tell the learner what good post-job hygiene looks like (archive idempotency key, store cost record, emit audit event). Score impact: −1.
5. **Scenario 5 in the practice table is the only one that tests the idempotency guarantee specifically.** A second scenario forcing a network-drop retry would reinforce the pattern. Score impact: −1.

### Accessibility and clarity

- Color choices (slate / blue / green / yellow / red / purple) are color-blind safe; verdict text is in every node so a deuteranope still gets the signal.
- Mermaid SVG nodes are not keyboard-focusable — known library limitation, applies across all Mermaid sims in this textbook.
- Hover content is plain text and renders cleanly at 13px on 1080p displays.

### Cognitive load assessment

- 9 nodes in the webhook view, 10 in the polling view. Tractable.
- Single hover-to-reveal pattern keeps the surface uncluttered.
- The toggle introduces structural change (a new node), which is a strong move pedagogically — the learner sees the *shape* of the polling pattern, not just an annotation.

### Recommendation

**Approve for use in Chapter 19 as currently implemented.** The five gaps above are real but none of them block correct learning of the L3 objective. Open follow-up tickets for items 1 and 3 (cost annotations + interactive retry simulation). The diagram teaches what it claims to teach and surfaces the operational decisions an engineer building a batch pipeline must make. Ship.

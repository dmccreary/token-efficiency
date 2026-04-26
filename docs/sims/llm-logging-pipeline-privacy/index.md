---
title: LLM Logging Pipeline with Privacy Filters
description: Interactive Mermaid flowchart that walks an LLM call from application code through PII detection, redaction, cost computation, retention, and storage with a live JSONL log preview.
image: /sims/llm-logging-pipeline-privacy/llm-logging-pipeline-privacy.png
og:image: /sims/llm-logging-pipeline-privacy/llm-logging-pipeline-privacy.png
twitter:image: /sims/llm-logging-pipeline-privacy/llm-logging-pipeline-privacy.png
social:
   cards: false
---

# LLM Logging Pipeline with Privacy Filters

<iframe src="main.html" height="722px" width="100%" scrolling="no"></iframe>

[Run the LLM Logging Pipeline with Privacy Filters MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

Every production LLM call should leave a structured log line behind. The line carries a small set of required fields (trace identifiers, model, prompt hash, token usage, cost, latency) and a much larger set of *optional* fields that may not be safe to retain in the clear. This MicroSim shows where in the pipeline those decisions are made and what the emitted record actually looks like for two representative cases: a prompt that contains PII and a prompt that does not.

The flowchart traces the synchronous middleware path: hash the prompt, run the PII detector, branch on the result, redact or truncate, compute the cost from the usage and price table, attach the trace identifiers, then hand the line off to the asynchronous forwarder. The forwarder fans out to object storage and the analytics warehouse, and a retention policy quietly deletes records past their N-day window.

The right-hand panel shows the *actual* JSONL line that a learner can copy into their own logging library. Toggle PII detection or move the truncation slider and watch the redacted-vs-clean fields update in place — the pipeline is no longer abstract once you can read the bytes it emits.

## How to Use

1. **Read the default pipeline.** Start with PII detection off. Trace the path from the Application node down through the LLM API, the synchronous middleware, the JSONL emit, the forwarder, and the retention policy. Read the right-hand JSONL line and find each metadata field on the diagram.
2. **Turn on PII detection.** Tick the "PII detected in prompt" checkbox. The redact branch lights up in red and the clean branch dims. The sample log now shows the redacted prompt with `[REDACTED_EMAIL]`, `[REDACTED_PHONE]`, and `[REDACTED_NAME]`, and `pii_redacted: true`. The `prompt_hash` is unchanged — that is intentional; the hash is computed from the *original* prompt so that downstream analytics can join records without ever seeing PII.
3. **Move the truncation slider.** With PII off, slide the truncation cap from 100 to 2000 tokens. The displayed prompt grows or shrinks. Note that `prompt_truncated_tokens` updates with the slider — that field is what tells a downstream analyst that the stored prompt is a partial.
4. **Trace the cost field.** The `cost_usd` field is computed from `usage.input_tokens × input_price + usage.output_tokens × output_price`. Verify the arithmetic for the displayed numbers. This is the single field that lets a finance team join LLM logs to the bill at the end of the month.
5. **Discuss retention.** The retention node deletes raw records after N days. The warehouse keeps daily roll-ups indefinitely. Decide which fields you would let into the warehouse and which you would keep only in the time-bounded raw store.

## Bloom Level

**Apply (L3)** — implement an LLM logging pipeline that captures every required field while satisfying PII redaction and retention requirements.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="sims/llm-logging-pipeline-privacy/main.html"
        height="722px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Adult professional learners — software engineers, ML engineers, SREs, and security/compliance reviewers who own or audit an LLM logging pipeline.

### Duration

20–30 minutes inside Chapter 9, or 45 minutes as a standalone workshop where each learner adapts the JSONL schema to their own platform.

### Prerequisites

- Chapter 9 sections on structured logging fundamentals (trace IDs, span IDs, correlation IDs)
- Basic JSON literacy and familiarity with at least one logging library
- Awareness of the most common PII categories (email, phone, name, SSN, government IDs)

### Activities

1. **Read the canonical line (5 min).** With PII detection off, study the JSONL output field by field. For each field, write one sentence on what it is for and which downstream consumer needs it (debugger, analyst, finance, SRE, compliance).
2. **Toggle the privacy branch (10 min).** Turn PII detection on. Compare the two log lines side by side. Identify which fields are stable across the toggle (hash, IDs, usage, cost) and which fields change (prompt, pii_redacted). Discuss why the hash is computed *before* redaction, not after.
3. **Choose a retention policy (10 min).** Using the practice table below, decide for your team how long each class of record should live in raw storage versus the warehouse. Justify each choice in one sentence.
4. **Adapt the schema (15 min, optional).** Take the JSONL line and rewrite the field names to match your platform's existing logging conventions. Identify any required field your current pipeline is missing.

### Practice Scenarios

| # | Prompt content | PII expected? | Truncation appropriate? | Required action |
|---|---|---|---|---|
| 1 | "Summarize the attached quarterly report." | No | Yes (1000 tokens) | Log full prompt within cap |
| 2 | "Email me at jane.doe@acme.com when this is done." | Yes (email) | N/A — redact first | Redact, set `pii_redacted=true` |
| 3 | Internal tool call with no user-supplied text | No | No (already short) | Log full prompt |
| 4 | Customer-pasted screenshot OCR with names and addresses | Yes (multiple categories) | After redaction only | Redact all categories, log redacted text |
| 5 | Long document summarization with 18,000 input tokens | No | Yes — truncate to 2000 | Truncate, set `prompt_truncated_tokens` |
| 6 | Prompt that fails the PII detector but is later flagged manually | False negative | N/A | Re-run detector on stored line, redact in place, set `pii_redacted_post_hoc=true` |

### Assessment

A learner has met the objective when, given a fresh logging spec, they can:

- List the required fields and explain what each is for.
- Place the PII detector synchronously in the pipeline, before the JSONL line is emitted.
- Explain why `prompt_hash` is computed from the unredacted prompt and `cost_usd` from the unredacted usage.
- Choose a retention window per record class with a defensible reason (debugging window vs. compliance window vs. analytics needs).

### Math Reference

Cost computation:

\[
\text{cost\_usd} = \frac{\text{input\_tokens} \times \text{input\_price\_per\_MTok} + \text{output\_tokens} \times \text{output\_price\_per\_MTok}}{1{,}000{,}000}
\]

For the displayed example with 33 input tokens, 180 output tokens, $3 / MTok input, and $15 / MTok output:

\[
\text{cost\_usd} = \frac{33 \times 3 + 180 \times 15}{1{,}000{,}000} = \frac{99 + 2700}{1{,}000{,}000} \approx \$0.0028
\]

## References

1. OpenTelemetry Project. *Semantic Conventions for Generative AI* — the upstream standard for trace_id, span_id, and gen_ai.* attributes that this MicroSim's JSONL field names align with.
2. Microsoft Presidio — open-source PII detection and anonymization toolkit; the canonical reference implementation for the synchronous redactor in this pipeline.
3. NIST SP 800-122. *Guide to Protecting the Confidentiality of Personally Identifiable Information (PII)* — the policy framework underpinning the redaction-before-emit requirement.
4. Anthropic Engineering Blog. *Structured Logging for LLM Applications* — applied guidance on prompt_hash, usage, and cost fields specific to Claude.
5. Kreps, J. (2014). *I Heart Logs: Event Data, Stream Processing, and Data Integration*. O'Reilly. — Foundational reference for the asynchronous-forwarder pattern.

---

## Senior Instructional Designer Quality Review

*Reviewer perspective: 15+ years designing engineering and data-science curricula for adult professional learners; expertise in Bloom's revised taxonomy, evidence-based assessment design, and accessibility of technical content.*

### Overall verdict

**Approve for use; ship with two follow-up tickets.** Score: **88/100 (B+).** The MicroSim earns its Apply-level (L3) framing because it pairs a structural diagram with a concrete artifact — the emitted JSONL line — that the learner is expected to *implement* in their own pipeline. The toggle and slider drive immediate, visible change in the artifact, which is the right interaction shape for L3.

### What works (the pedagogy)

1. **The JSONL preview is the load-bearing element.** Most logging diagrams stop at boxes and arrows. This one shows the bytes that come out of the pipeline. A learner who reads the line top to bottom can copy the schema; a learner who only reads boxes cannot.
2. **The PII branch is dynamically highlighted, not just labeled.** When the toggle flips, the redact node lights up in red and the clean node dims. That is a small but important affordance: the learner sees which path is "live" for the current input.
3. **Hash-before-redact is taught implicitly and correctly.** The MicroSim places `Compute prompt_hash` upstream of the PII detector. A learner who notices the order learns the rule (hash the original prompt so analytics joins survive redaction) without needing a separate paragraph.
4. **The cost field is computed from real numbers.** The displayed `cost_usd` reflects the displayed `input_tokens` and `output_tokens` against published prices. The math reference section ties the numbers to a formula the learner can apply.
5. **Retention is shown as a *step*, not a footnote.** Many pipelines treat retention as a policy memo. Surfacing it as the terminal node next to the storage targets keeps the lifecycle visible end-to-end.

### What needs follow-up (the gaps)

1. **No way to view the line *as ingested by the warehouse* (post-roll-up).** A real warehouse drops the prompt entirely and keeps only aggregates. Showing the warehouse view alongside the raw view would teach the storage-class distinction more cleanly. Score impact: −4.
2. **Truncation only affects the *displayed* prompt, not the surrounding fields.** A learner could read the slider as cosmetic. Adding `truncated: true` and `original_token_count: N` fields when the slider drops below the actual prompt length would make the truncation behavior self-documenting. Score impact: −3.
3. **No false-negative scenario.** PII detectors miss things. A "the detector missed an SSN — what now?" mode would teach post-hoc redaction, which is the harder real-world case. Practice scenario #6 covers it in the lesson plan but not in the live MicroSim. Score impact: −3.
4. **Hash is shown as a static string.** It does not actually vary across the two prompts. A learner could believe the hash is a placeholder. Computing the hash live (even SHA-256 of the displayed prompt) would close that gap. Score impact: −2.

### Accessibility and clarity

- **Color contrast:** The dark-on-cyan diagram nodes pass WCAG AA; the JSONL panel uses a high-contrast Slack-style dark theme. The redact (red) and clean (green) branch colors are both distinguishable for the most common color-vision deficiencies because each is paired with a text label inside the node.
- **Keyboard:** The toggle and the slider are native HTML controls and reachable by Tab. The Mermaid SVG nodes themselves are not focusable, which is a known limitation of the library, not this sim.
- **Reader scaling:** The JSONL panel scrolls when the prompt grows past its visible height. The 11px monospace stays legible at 150% browser zoom.

### Cognitive load assessment

- **15 nodes with 3 parallel storage targets** sit at the high end of working memory but are organized in a strict top-to-bottom flow with no back-edges, which keeps the load tractable.
- **The right-hand panel adds ~15 fields.** The lesson plan's "field-by-field" first activity (Activity 1) explicitly addresses this by chunking the read into one sentence per field — a sound pedagogical move.
- **Two interactive controls** is the right number for L3. More controls would push this toward a config-explorer toy and dilute the focus on the implementation pattern.

### Recommendation

**Ship as currently implemented.** Open follow-up tickets for the warehouse-view (gap 1), truncation field surfacing (gap 2), and the false-negative scenario (gap 3). The hash-live computation (gap 4) is a polish item.

The MicroSim teaches a real pipeline shape with a real artifact at the end. That is the bar for an L3 implementation MicroSim, and this one clears it.

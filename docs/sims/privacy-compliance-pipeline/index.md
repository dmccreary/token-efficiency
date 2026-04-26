---
title: Privacy Compliance Pipeline
description: Vertical pipeline showing the layered privacy and compliance controls a single LLM request flows through, with framework annotations toggleable per regulation.
image: /sims/privacy-compliance-pipeline/privacy-compliance-pipeline.png
og:image: /sims/privacy-compliance-pipeline/privacy-compliance-pipeline.png
twitter:image: /sims/privacy-compliance-pipeline/privacy-compliance-pipeline.png
social:
   cards: false
---

# Privacy Compliance Pipeline

<iframe src="main.html" height="722px" width="100%" scrolling="no"></iframe>

[Run the Privacy Compliance Pipeline MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

The 11-step pipeline a single LLM request flows through to satisfy GDPR, HIPAA, and SOC2 simultaneously. Each step has a specific control (field redaction, free-text PII detection, region routing, no-train enterprise tier, audit logging) and a specific failure mode if missing. Hover any step to see what breaks if that control is removed.

Toggle the three framework checkboxes to see which controls each regulation requires. With all three on, the pipeline shows the union — the production-grade pipeline a regulated team must implement. With one off, the framework-specific annotation disappears, revealing what's "just" required by the others.

## How to Use

1. **Start with all three frameworks on.** Read each step's purpose and the regulation annotations.
2. **Hover step 2 (Field redaction).** Read the failure mode: structured PII reaches the LLM in plaintext. This is the canonical compliance breach.
3. **Toggle GDPR off.** The "data residency enforced" annotation disappears from step 5. Discuss: is residency only a GDPR concern? (Answer: increasingly no — many sectoral US laws also require it.)
4. **Hover step 9 (Re-tokenize).** This is the most failure-prone step in the pipeline. Read why authorized-recipient verification matters.
5. **Trace one full request mentally.** A user posts a support ticket containing their SSN, name, and address. Walk it through all 11 steps. The SSN gets placeholdered at step 2. The name gets tokenized at step 3. The LLM sees only redacted content. The response gets re-scanned at step 8 and detokenized for the user at step 9. The audit log at step 10 contains no raw content.

## Bloom Level

**Apply (L3)** — implement a privacy-and-compliance-aware LLM request pipeline that satisfies GDPR, HIPAA, and SOC2 requirements simultaneously.

## Iframe Embed Code

```html
<iframe src="sims/privacy-compliance-pipeline/main.html"
        height="722px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Engineers and platform-team members building LLM features in regulated industries (healthcare, finance, EU consumer apps) or under enterprise customer compliance requirements.

### Duration

20–25 minutes inside Chapter 19.

### Prerequisites

- Chapter 9 sections on PII Redaction, PII Detection, and structured logging fields
- Chapter 19 sections on GDPR, HIPAA, SOC2, data residency, opt-out of training, hashing, audit trail

### Activities

1. **Trace the happy path (5 min).** All frameworks on. Walk all 11 steps, name each control, describe its failure mode.
2. **Framework comparison (5 min).** Toggle each framework off in turn. Note which annotations disappear. Build a mental map of which control is required by which regulation.
3. **Failure-mode walkthrough (10 min).** For each step, ask: "What real-world incident would result if this control were missing?" Use the practice scenarios.
4. **Architecture review (5 min).** Compare the pipeline to your team's current LLM request path. Identify gaps.

### Practice Scenarios

| # | Missing control | Likely incident | Which framework breaks first? |
|---|---|---|---|
| 1 | Step 2 (field redaction) | SSN sent to LLM provider, logged in their training pipeline | ? |
| 2 | Step 5 (region check) | EU user data processed in US region | ? |
| 3 | Step 6 (no-train tier) | User content used in next model training run | ? |
| 4 | Step 8 (response PII detection) | LLM returns a real SSN it learned during training | ? |
| 5 | Step 10 (audit log) | Cannot prove which user's data was processed when | ? |

### Assessment

A learner has met the objective when they can:

- Name each step's control and its specific failure mode without consulting the diagram.
- Map any regulatory requirement (GDPR, HIPAA, SOC2) to the pipeline step that satisfies it.
- Identify the highest-risk single point of failure in the pipeline (typically step 9, re-tokenization).
- Distinguish between a privacy *control* (field redaction) and a privacy *guarantee* (no-train enterprise tier).

## References

1. GDPR Article 25 — *Data protection by design and by default* — direct legal basis for the pipeline pattern.
2. HIPAA Security Rule, 45 CFR § 164.308 — *Administrative safeguards* — covers the audit-log requirements.
3. AICPA Trust Services Criteria — *Confidentiality and Privacy criteria* — SOC2 audit requirements.
4. Microsoft Presidio documentation — *Free-text PII detection* — open-source library for step 3.
5. Anthropic Documentation — *Privacy and data retention* — vendor-side controls referenced in step 6.

---

## Senior Instructional Designer Quality Review

*Reviewer perspective: 15+ years designing engineering and data-science curricula for adult professional learners; expertise in Bloom's revised taxonomy, evidence-based assessment design, and accessibility of technical content.*

### Overall verdict

**Strong fit for the stated learning objective. Approve as-is for Chapter 19.** Score: **88/100 (B+).** This is a competent Apply-level (L3) pipeline diagram that does the genuinely hard work of mapping abstract regulations to concrete engineering controls. The framework toggles are the right move — they show the same pipeline through three regulatory lenses without forcing the learner into three separate diagrams.

### What works (the pedagogy)

1. **Bloom alignment is correct.** L3 "implement" requires the learner to *apply a procedure*. The pipeline IS the procedure; each step is an implementation step. The framework toggles let the learner test their understanding of which controls satisfy which regulation.
2. **Failure-mode-per-step is the load-bearing pedagogy.** Most compliance diagrams describe what the controls *do*; this one describes what *breaks* without each control. That framing inverts the abstraction and makes the pipeline urgent rather than optional.
3. **Three frameworks as overlays, not separate pages.** GDPR, HIPAA, and SOC2 share most controls but differ on a few specifics. Toggling lets the learner see the union and the differences without false dichotomies.
4. **Step 9 gets a "most failure-prone" call-out.** Re-tokenization is the step where data leaks happen most often (wrong recipient, missing authorization check). Naming this in the hover content is exactly the right move.

### What needs follow-up (the gaps)

1. **No quantitative impact.** The diagram doesn't tell the learner which step has the highest *cost* of failure (regulatory fine, breach notification scope). A small severity-rating overlay (low / medium / high / critical) would calibrate priorities. Score impact: −3.
2. **No vendor-specific controls surfaced.** "Use the no-train enterprise tier" varies by vendor — Anthropic's terms differ from OpenAI's differ from Google's. A vendor toggle would teach the procurement-side decisions. Score impact: −2.
3. **The audit log step (10) is too generic.** Real audit-log requirements differ across SOC2, HIPAA, and GDPR. Showing the union vs intersection of required fields would make the audit log step concrete. Score impact: −2.
4. **No way to "break" a step and trace the consequence.** A click-to-disable affordance would let the learner watch the cascade of subsequent failures. Today the failure modes are static text. Score impact: −2.
5. **The diagram is monolithic.** A learner working in one regulated industry (e.g., HIPAA only) sees too many controls that don't apply to them. A "show only the steps required by my selected frameworks" mode would streamline. Score impact: −1.

### Accessibility and clarity

- Color choices are color-blind safe; verdict text and step numbers provide redundancy.
- Mermaid keyboard accessibility: same library limitation.
- Italic regulation annotations inside Mermaid nodes are small (11px); a dedicated annotation column would be more readable but breaks the flow-diagram convention.

### Cognitive load assessment

- 11 steps is at the upper edge of what fits on a single screen without zooming.
- The information panel handles the cognitive offload well: the learner reads the high-level flow on the diagram and the deep details on hover.
- Three toggles are tractable; more would be overwhelming.

### Recommendation

**Approve for use in Chapter 19 as currently implemented.** The five gaps above are real but none of them block correct learning of the L3 objective. Open follow-up tickets for items 1 and 4 (severity ratings + cascading-failure interaction). The diagram teaches what it claims to teach and gives learners a concrete pipeline they can map their own architecture against. Ship.

---
title: Cheap-First Cascade with Escalation
description: Flowchart MicroSim showing the cheap-first cascade with quality-gate escalation to Sonnet and Opus, with live expected-cost calculation.
image: /sims/cheap-first-cascade-escalation/cheap-first-cascade-escalation.png
og:image: /sims/cheap-first-cascade-escalation/cheap-first-cascade-escalation.png
twitter:image: /sims/cheap-first-cascade-escalation/cheap-first-cascade-escalation.png
social:
   cards: false
---

# Cheap-First Cascade with Escalation

<iframe src="main.html" height="602px" width="100%" scrolling="no"></iframe>

[Run the Cheap-First Cascade MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

A cheap-first cascade is the single highest-leverage cost-reduction pattern in production LLM systems: send every request to the cheap model first, run a quality gate (format check, confidence check, length check), and only escalate to the expensive model when the gate fails. Done well, the cascade gives you ~90%+ cost reduction versus an "always Opus" baseline while keeping quality on the difficult requests.

This MicroSim makes the cascade **operational** rather than abstract. Move the cheap-pass-rate slider to model "what fraction of my requests does the cheap model handle correctly?" Toggle the Opus tier on or off to model two-tier vs. three-tier cascades. The expected-cost panel recomputes the formula in real time, and the percentage-reduction-vs-Opus readout tells you what the cascade is buying you for the assumptions you set.

## How to Use

1. **Read the default cascade.** 80% cheap-pass, 18% Sonnet-pass, 2% Opus. Expected cost \$0.0024 per request — a 91% reduction vs. always-Opus. The formula at the bottom of the info panel shows the math.
2. **Slide cheap-pass-rate down to 50%.** Watch the expected cost climb (more requests escalate). Note that the Opus probability climbs too — at low cheap-pass-rates, the cascade is barely better than always-Sonnet.
3. **Slide cheap-pass-rate up to 95%.** Watch the expected cost approach the cheap-only baseline. This is the regime where the cascade is most valuable; getting your cheap-pass rate from 70% to 90% is more impactful than any single architectural change.
4. **Toggle off the Opus tier.** The diagram simplifies to a two-tier cascade. Compare expected costs: a two-tier cascade is cheaper on average but gives up quality on the hardest 2% of requests.
5. **Move the confidence-threshold slider.** Note: the threshold is informative only here — it tells the team "what would trigger escalation" without changing pass rates. In practice, raising the threshold raises the cheap-pass rate (because the gate gets stricter, more cheap responses fail).
6. **Implement your cascade.** Pick a cheap-pass rate, decide whether to include Opus, and write down the expected-cost formula. That formula is the L3 deliverable.

## Bloom Level

**Apply (L3)** — implement a cheap-first cascade with appropriate escalation triggers and quantify the expected cost savings.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="sims/cheap-first-cascade-escalation/main.html"
        height="602px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Adult professional learners — engineers and ML engineers building or operating multi-model LLM systems where per-request cost reduction is a stated goal.

### Duration

20–30 minutes inside Chapter 17, or 45 minutes as a standalone workshop with the practice scenarios.

### Prerequisites

- Chapter 17 sections on model routing, quality gates, and cost-quality tradeoffs
- Comfort with expected-value arithmetic and conditional probability

### Activities

1. **Read the default cascade (3 min).** Identify each of the four nodes (cheap call, gate, Sonnet, Opus). Read the cost annotation on each terminal leaf.
2. **The 80/18/2 expected-cost calculation (5 min).** Verify by hand: 0.80 × \$0.001 + 0.18 × \$0.006 + 0.02 × \$0.026. Compare with the readout. Ask: which probability dominates the expected cost?
3. **Sensitivity analysis (10 min).** Sweep cheap-pass from 50% to 95% in 5-point steps. Record expected cost at each point. Plot mentally: the curve is super-linear in cheap-pass-rate.
4. **The Opus-tier decision (5 min).** Toggle Opus on and off. Compute the expected-cost difference. Ask: when is the third tier worth the extra escalation hop?
5. **Bring-your-own-numbers (10 min).** Use the Practice Scenarios table.

### Practice Scenarios

| # | Cheap-pass | Opus tier | Predict E[cost] | Reduction vs. Opus |
|---|---|---|---|---|
| 1 | 80% | on | ? | ? |
| 2 | 80% | off | ? | ? |
| 3 | 90% | on | ? | ? |
| 4 | 60% | on | ? | ? |
| 5 | 95% | off | ? | ? |
| 6 | 50% | on | ? | ? |

### Assessment

A learner has met the L3 objective when, given a target expected-cost budget and a target quality floor, they can:

- Compute the expected cost for any cheap-pass rate and tier configuration without the calculator.
- Pick a cheap-pass-rate target that satisfies the cost budget.
- Decide whether the third tier (Opus) is justified for the workload.
- Articulate why "raise the cheap-pass rate" is usually the highest-leverage cost optimization.

### Math reference

For a three-tier cascade with probabilities \( p_c, p_s, p_o \) (summing to 1) and cumulative path costs \( c_c, c_s, c_o \):

\[
E[\text{cost}] = p_c \cdot c_c + p_s \cdot c_s + p_o \cdot c_o
\]

Where path costs *cumulate* because escalating to Sonnet does not recover the cost already paid to Haiku:

\[
c_c = \$0.001, \quad c_s = \$0.001 + \$0.005 = \$0.006, \quad c_o = \$0.001 + \$0.005 + \$0.020 = \$0.026
\]

The cost reduction vs. always-Opus is

\[
\text{reduction} = 1 - \frac{E[\text{cost}]}{c_o^{\text{always}}}
\]

with \( c_o^{\text{always}} = \$0.026 \) for the same Opus call without any cascade.

## References

1. Anthropic — *Choose the right model for your application* — guidance on Haiku/Sonnet/Opus selection.
2. Frugal LLM literature — e.g., *FrugalGPT: How to Use Large Language Models While Reducing Cost and Improving Performance* (Chen et al., 2023).
3. OpenAI Cookbook — *Routing requests across models*.
4. Site Reliability Engineering (Beyer et al., O'Reilly) — Chapter on graceful degradation, applicable to cascade design.

---

## Senior Instructional Designer Quality Review

*Reviewer perspective: 15+ years designing engineering and data-science curricula for adult professional learners; expertise in Bloom's revised taxonomy, evidence-based assessment design, and accessibility of technical content.*

### Overall verdict

**Strong fit for the stated learning objective. Approve with two follow-ups.** Score: **89/100 (B+).** This is one of the cleaner Apply-level (L3) MicroSims in the textbook: it externalizes the cascade as a flowchart, externalizes the math as a formula, and lets the learner manipulate the single most important parameter (cheap-pass rate) while watching the formula recompute. The "implement" verb in the learning objective is delivered by the act of choosing parameters and reading the resulting expected-cost formula — which is exactly how an engineer implements a cascade in real life.

### What works (the pedagogy)

1. **Bloom alignment is exact.** L3 "implement" requires the learner to *use a procedure* with new parameters. The cheap-pass slider + tier toggle + cost formula is the procedure; the readouts are the implementation outcomes. The learner does not just *describe* a cascade — they parameterize one.
2. **The path-cost annotation is honest about cumulation.** Most cascade explanations show only the marginal cost of the escalated model. This MicroSim shows that path costs *cumulate* (\$0.001 + \$0.005 + \$0.020), which is the load-bearing fact most engineers get wrong on first encounter.
3. **The expected-cost formula updates live.** Seeing the formula expand at the same time the slider moves is the L3 procedural insight: "this is the calculation I will do to defend my cascade in design review."
4. **The two-tier vs. three-tier toggle teaches a decision.** Toggling Opus on and off lets the learner see the marginal value of the third tier. Most cascades in production are two-tier; the toggle teaches *why*.
5. **Cost-reduction-vs-Opus readout** turns the relative metric into a percentage, which is the form the learner's manager will demand. A 91% reduction is more legible than "expected cost is \$0.0024 instead of \$0.026."
6. **Color-coded path leaves.** Green for cheap-pass terminal, orange for Sonnet, red for Opus. The semantic mapping is intuitive: green = cheap-and-good, red = expensive-fallback.

### What needs follow-up (the gaps)

1. **The confidence-threshold slider is decorative.** It does not affect any output — it is informative only. A real implementation would couple threshold to cheap-pass rate (raising the threshold raises pass rate, lowering it lowers pass rate). Wiring those together would teach an L3 implementation insight: "the threshold is the dial I have, the pass rate is the metric I read." Score impact: −4.
2. **Quality is invisible.** A cheap-pass rate of 95% might mean "the cheap model nails 95% of requests" or "the gate is too lax and 95% of cheap responses pass even when wrong." The MicroSim cannot distinguish these. A "false-pass rate" knob would teach the failure mode where a too-lax gate destroys quality even with a great expected cost. Score impact: −3.
3. **The Opus pass-rate is hardcoded at 90%.** Real escalations don't have a fixed Sonnet→Opus split. A second slider would let the learner explore what happens when Sonnet is also unreliable on the hard subset. Score impact: −2.
4. **Latency is not modeled.** A cascade pays in latency every time it escalates (one call, then two, then three). For interactive features this matters as much as cost. A note in the lesson plan or a small latency overlay would close the gap. Score impact: −2.
5. **No worked example for "when not to cascade."** Cascades are wrong for some workloads (high-stakes outputs where false-pass is catastrophic, low-volume requests where the engineering cost dominates). The MicroSim implicitly endorses cascading; the lesson plan should discuss the anti-pattern. Score impact: −1.

### Accessibility and clarity

- **Color contrast.** Green/orange/red leaves on white pass WCAG AA at the 13px font used. The russet "expected cost" big number on light gray passes AA.
- **Color-blind safety.** The green/orange/red leaf palette is the most common deuteranopia/protanopia failure shape, but the path label text ("Return cheap response", "Return Sonnet response", "Escalate to Opus") provides full language redundancy.
- **Keyboard.** Sliders and checkboxes are keyboard-focusable and arrow-adjustable. Mermaid SVG nodes are not natively focusable — a known limitation, but no information is hidden behind hover.
- **Live-updating formula.** Screen-reader users get a live-region update on every slider movement, not just on focus.

### Cognitive load assessment

- **Three-leaf flowchart + two sliders + two toggles + four readouts + a formula = 11 visible elements.** That is at the upper edge of working memory but the visual grouping (diagram on the left, controls/readouts on the right) keeps it manageable.
- **The formula is the cognitive offload.** Instead of forcing the learner to integrate three probabilities and three costs, the panel writes the expansion out, which lets the learner *check* their mental model rather than do the arithmetic from scratch.

### Recommendation

**Approve for use in Chapter 17 as currently implemented.** The five gaps above are real but only #1 (the decorative confidence-threshold slider) is a near-term concern because a learner may infer cause-and-effect that does not exist. Open follow-up tickets for #1 (highest priority), #2, and #5. Defer #3 and #4 to a polish pass.

The MicroSim teaches what it claims to teach, makes the path-cost cumulation visible, and gives the learner the formula they will use in design review. Ship.

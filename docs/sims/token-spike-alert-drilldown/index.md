---
title: Token Spike Alert with Drill-Down
description: Interactive Chart.js time series of tokens-per-minute over 24 hours with a click-to-reveal drill-down by feature, user, and prompt template that explains the cause of a spike.
image: /sims/token-spike-alert-drilldown/token-spike-alert-drilldown.png
og:image: /sims/token-spike-alert-drilldown/token-spike-alert-drilldown.png
twitter:image: /sims/token-spike-alert-drilldown/token-spike-alert-drilldown.png
social:
   cards: false
---

# Token Spike Alert with Drill-Down

<iframe src="main.html" height="592px" width="100%" scrolling="no"></iframe>

[Run the Token Spike Alert with Drill-Down MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

A token-rate alert tells you *that* something is wrong. The drill-down tells you *what*. This MicroSim shows the canonical investigation pattern that follows every paged token spike: start at the global time series, identify the offending hour, then decompose it by feature, by user, and by prompt template — in that order — until a single explanation falls out.

The default view is a 24-hour time series with one obvious spike around hour 14, a horizontal red threshold line, and a baseline mean ± 2σ envelope shaded behind. The threshold is a slider; move it to see how many hours would have fired at different sensitivities. Click any point inside the spike and three breakdown panels populate: the feature panel shows that one feature carries 85% of the spike's tokens, the user panel shows that one user inside that feature carries 78%, and the prompt-hash panel shows that 92% of that user's spike traffic is one identical prompt template firing repeatedly.

The shape of the breakdowns is the lesson. Real spikes almost always reduce to a single (feature, user, template) triple. A learner who internalizes this stops spending the first hour of an incident searching everywhere; they go straight to the three-panel drill-down.

## How to Use

1. **Read the time series.** Note the steady baseline, the shaded ±2σ envelope, the alert threshold (red dashed), and the hour-14 spike that crosses it.
2. **Move the threshold.** Slide it down — more hours fire. Slide it up past the spike — nothing fires (and you would have missed the incident). The status banner reports how many hours would have fired at the current setting.
3. **Click the spike.** Click any point inside hours 13–15. The three drill-down panels populate. Read them top to bottom: feature → user → template.
4. **Read the explanation.** The status banner now describes the chain: feature `exec_summary` (85%) → user `usr_72ad` (78% within that feature) → prompt_hash `9af2c7b8` (92% within that user). One template, one user, one feature explains the entire spike.
5. **Form the rule of thumb.** Always drill in this order: feature, then user, then template. Reversing the order forces you to look at hundreds of templates first.
6. **Reset and re-investigate.** Click "Reset drill-down" and try again with a different threshold. Notice that the drill-down explanation does not depend on the threshold — the cause is the cause.

## Bloom Level

**Analyze (L4)** — deconstruct a token spike using drill-down analysis to identify the contributing feature, user, or template responsible.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="sims/token-spike-alert-drilldown/main.html"
        height="592px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Adult professional learners — on-call engineers, SREs, ML platform engineers, and product managers responsible for triaging LLM cost incidents.

### Duration

20 minutes inside Chapter 10 as a guided activity, or 45 minutes as a standalone post-incident review workshop.

### Prerequisites

- Chapter 10 sections on alerting, baselines, and percentile thresholds
- Familiarity with the `feature` / `user_id` / `prompt_hash` log fields from Chapter 9
- Comfort reading time-series charts

### Activities

1. **Triage on the global view (5 min).** Look only at the time series. Identify the spike, estimate when it started and ended, and decide whether the current threshold (120,000 tokens/min) is the right sensitivity. Discuss what threshold you would defend in writing.
2. **Drill on click (5 min).** Click the spike. Read the three breakdown panels in order. State the explanation in one sentence: feature X, user Y, template Z.
3. **Reverse the order (10 min).** Imagine a dashboard with only "By prompt_hash" and no "By feature" panel. How long would it take to find the answer? Discuss why the (feature → user → template) order is the cheapest path.
4. **Bring your own incident (homework).** Pick a recent token spike on your own stack. Walk through the three panels and document the (feature, user, template) triple. If you can't find the dimension that dominates, that is a sign your logging schema is missing a field.

### Practice Scenarios

| # | Spike pattern | Likely (feature, user, template) signature | Drill-down panel that explains it |
|---|---|---|---|
| 1 | One sharp 1-hour spike, returns to baseline | Single user running one batch script | By user, then by template |
| 2 | Sustained 4-hour elevation | New feature shipped that morning | By feature, then by template |
| 3 | Repeating daily at 02:00 UTC | Cron job hitting one feature | By feature, then by user |
| 4 | Slow rise over a week, no return | Prompt template grew due to RAG context bloat | By template (prompt_hash with high token count) |
| 5 | Spike with no dominant user, dominant feature only | Many users hitting a runaway feature | By feature only — escalate to feature owner |
| 6 | Spike where no panel dominates | Logging schema is missing a dimension | Add the missing dimension, then re-investigate |

### Assessment

A learner has met the objective when, given a fresh token-spike alert, they can:

- Identify the offending hour from the time series alone.
- Order the drill-down dimensions correctly (feature → user → template).
- Explain the spike in a single sentence using the (feature, user, template) triple.
- Set a defensible alert threshold based on the baseline ± 2σ envelope.

### Math Reference

Baseline envelope:

\[
\text{upper} = \mu + 2\sigma, \quad \text{lower} = \max(0,\, \mu - 2\sigma)
\]

where \( \mu \) and \( \sigma \) are computed over the non-spike windows. Points outside the envelope are anomalies; a threshold rule above \( \mu + 2\sigma \) fires only on real spikes.

## References

1. Beyer, B., et al. (2016). *Site Reliability Engineering*. O'Reilly. — Foundational reference for percentile-based alerting and the symptom-vs-cause distinction.
2. Datadog. *Anomaly Detection in Time Series* — published guidance on baseline envelopes used in this MicroSim.
3. Honeycomb. *Observability Engineering* — for the high-cardinality / drill-down philosophy this exercise rests on.
4. OpenTelemetry. *Semantic Conventions for Generative AI* — defines the `feature` / `user_id` / `prompt_hash` fields that make the drill-down possible.
5. Anthropic Engineering Blog. *Investigating Token Cost Anomalies* — applied guidance for Claude workloads.

---

## Senior Instructional Designer Quality Review

*Reviewer perspective: 15+ years designing engineering and data-science curricula for adult professional learners; expertise in Bloom's revised taxonomy, evidence-based assessment design, and accessibility of technical content.*

### Overall verdict

**Approve for use; ship with one follow-up.** Score: **89/100 (B+).** The MicroSim hits L4 cleanly: it asks the learner to *deconstruct* a spike along three orthogonal dimensions and rewards them with a concrete causal triple. The click-to-reveal pattern is the right interaction shape for "analyze" — the learner has to act before they get the answer.

### What works (the pedagogy)

1. **Click-to-reveal forces the analysis act.** A passive dashboard would show all three breakdowns by default. By gating them behind a click on the spike, the MicroSim makes the learner's first action align with the analysis they're meant to perform.
2. **The three drill-down dimensions are orthogonal and well-chosen.** Feature, user, prompt_hash are the three fields that decompose almost every real spike. The MicroSim teaches the *order* (feature first, template last) which is the load-bearing rule.
3. **The baseline envelope is shaded, not just labeled.** The ±2σ band is shown as a tinted region. A learner can see at a glance which points are "normal noise" and which are real anomalies — the visual literacy this builds transfers directly to real dashboards.
4. **The threshold slider lets the learner *negotiate* with the alert.** Sliding the threshold up past the spike makes the alert silent, which teaches by contrast that thresholds are a design choice with consequences. This is rare in dashboard MicroSims and pedagogically valuable.
5. **The status banner narrates the explanation.** After a click, the banner spells out the (feature → user → template) triple in plain English. That serves as immediate formative feedback: the learner sees whether their click landed on a meaningful spike and what it means.

### What needs follow-up (the gaps)

1. **Only one spike, only one cause.** A more rigorous L4 design would offer multiple spike scenarios (single-user runaway, multi-user feature regression, template bloat) and ask the learner to *predict* the dominant dimension before clicking. The current MicroSim has one canonical case. Score impact: −4.
2. **The drill-down ordering is taught implicitly.** A learner who clicks and sees three panels at once may not internalize that the *order of investigation* matters. A small "step 1, step 2, step 3" affordance on the panels themselves would teach the order more directly. Score impact: −3.
3. **No false-positive scenario.** Real on-call work involves dismissing spikes that turn out to be expected (a planned batch run, a known feature ship). Adding a "this spike was expected" caption with the appropriate triage action would round out the L4 skill. Score impact: −2.
4. **No keyboard alternative for the click.** A learner relying on keyboard cannot trigger the drill-down. A button labeled "Drill into spike" would close that gap. Score impact: −2.

### Accessibility and clarity

- **Color contrast:** the red threshold line, the blue time series, and the orange/red bars in the drill-down all pass WCAG AA against the white card backgrounds.
- **Color-blind safety:** the threshold line is dashed, which provides redundancy with its color. The drill-down bars use a single hue with the dominant bar colored and the rest gray — a learner can identify the dominant entry by length even without color.
- **Keyboard:** the slider, the checkbox, and the reset button are reachable by Tab. The click-on-spike interaction is mouse-only (gap 4).
- **The status banner serves as a textual reading of the chart**, which is the right accommodation for screen readers and aligns with WCAG narrative-text guidance for charts.

### Cognitive load assessment

- **The default view has one chart, one threshold, one baseline envelope, and three empty panels.** That is well within working memory.
- **After the click**, the learner reads three breakdowns plus a status banner — five elements. Still tractable, especially because each breakdown is sorted descending and a single bar dominates each.
- **Two interactive controls plus one click target** is the right interaction budget for L4.

### Recommendation

**Ship as currently implemented.** Open follow-up tickets for the multi-scenario gap (item 1) and the keyboard alternative (item 4). The other gaps are polish items.

The MicroSim teaches a real investigation pattern with a real artifact at the end. The click-to-reveal shape is exactly right for L4.

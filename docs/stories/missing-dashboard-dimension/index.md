---
title: The Missing Dashboard Dimension — How One Cardinality Explosion Hid in Plain Sight
description: A 7-panel graphic novel about a platform team whose dashboard showed only one number — total daily LLM spend — until adding three new dimensions revealed a hackathon ID was driving a silent cost spike.
image: /stories/missing-dashboard-dimension/cover.png
og:image: /stories/missing-dashboard-dimension/cover.png
twitter:image: /stories/missing-dashboard-dimension/cover.png
social:
   cards: false
---

# The Missing Dashboard Dimension

![](./cover.png)
<details>
<summary>Cover Image Prompt</summary>
(This is the Cover Image. Do not include this label in the image.)
Please generate a wide-landscape 16:9 cover image in modern flat vector cartoon illustration style with clean lines and a detective-noir mood. Center: a giant dashboard mounted on a wall showing one enormous number: "$8,412 / day" with a single climbing line graph beneath it. To one side, a small whiteboard sketch shows what the dashboard *should* look like — multiple smaller charts broken down by feature, team, and user. To the other side, an engineer named Reza — Iranian-American man, 30s, dark hair, button-down rolled at the sleeves — peers at the giant number with a magnifying glass, eyebrow raised. Above the scene, the title text "The Missing Dashboard Dimension" in bold sans-serif lettering. Color palette: deep russet (#c1440e), warm cream (#fff8e7), slate (#37474f), burnt orange (#d35400). Emotional tone: detective curiosity — a clue hidden by being too aggregated. Generate the image immediately without asking clarifying questions.
</details>

<details>
<summary>Narrative Prompt</summary>
This is a 7-panel educational graphic novel for the Token Optimization textbook. Setting: a fictional platform team that runs an internal AI gateway used by 12 product teams. Art style: modern flat vector cartoon illustration with clean lines and a slight detective-noir mood. Characters appear consistently:

- **Reza** — platform engineer, Iranian-American man, 30s, dark hair, button-down with rolled sleeves, calm and analytical.
- **Bea** — observability specialist, white woman, late 20s, blue-streaked hair, oversized cardigan, headphones around neck.
- **Pemba** — recurring red-panda mascot. Russet fur, cream belly, white facial mask with black tear marks, wire-rim glasses, bushy ringed tail. **No clothing.** Cameos in the closing panel.

Color palette: deep russet (#c1440e), warm cream (#fff8e7), slate (#37474f), burnt orange (#d35400). Maintain consistent character appearances across all 7 panels.
</details>

### Prologue – The Number That Said Nothing

The platform team had built a beautiful AI gateway: a unified API that twelve product teams called for everything from search to summarization. The dashboard showed one number — *total daily LLM spend* — and that number had been climbing twelve percent a week for a month. Nobody could explain why. Reza decided to look at the data the dashboard *wasn't* showing.

## Panel 1: The Climbing Line

![](./panel-01.png)
<details><summary>Image Prompt</summary>
(This is Panel 01. Do not include the panel number in the image.)
I am about to ask you to generate a series of images for a graphic novel. Please make the images have a consistent style and consistent characters. Do not ask any clarifying questions. Just generate the image immediately when asked.

Please generate a 16:9 image in modern flat vector cartoon illustration style depicting panel 1 of 7. Scene: a wall-mounted dashboard in the platform team's bullpen showing one large number: "TOTAL LLM SPEND TODAY: $8,412" with a single line graph below it that climbs steadily over the past month. Reza — Iranian-American man, 30s, dark hair, button-down with rolled sleeves — stands in front of the dashboard with a coffee mug, brow furrowed. The wall behind him has team posters from the twelve product teams the gateway serves. Color palette: deep russet, warm cream, slate, burnt orange. Emotional tone: analytical concern — the calm before a hunt. Generate the image immediately without asking clarifying questions.
</details>

The climb had been twelve percent a week for a month. Reza had asked four product teams whether they'd shipped anything new. They all said no. He had stared at the dashboard for the better part of an afternoon. The dashboard, in turn, had cheerfully shown him a single climbing line. *"You're not telling me anything,"* he muttered.

## Panel 2: The Three Cuts

![](./panel-02.png)
<details><summary>Image Prompt</summary>
(This is Panel 02. Do not include the panel number in the image.)
Please generate a 16:9 image in modern flat vector cartoon illustration style depicting panel 2 of 7. Make the characters and style consistent with the prior panel. Scene: Reza and Bea — white woman, late 20s, blue-streaked hair, oversized cardigan, headphones around her neck — at a whiteboard sketching a redesigned dashboard. Three new panel sketches are labeled "COST PER FEATURE," "COST PER TEAM," "COST PER USER," each with a small bar-chart icon. Reza writes "TOTAL = THE ANSWER TO NOTHING" at the bottom of the board. Bea, marker in hand, draws a fourth panel labeled "CARDINALITY MONITOR" with a small caveat note: "watch out — high-cardinality dimensions explode metric storage." Color palette: deep russet, warm cream, slate, burnt orange. Emotional tone: collaborative design — two engineers thinking out loud. Generate the image immediately without asking clarifying questions.
</details>

Reza and Bea sketched the redesign in twenty minutes. Three new panels: cost per feature, cost per team, cost per user. Bea, who lived in observability for a living, added a fourth: a *cardinality monitor* that would flag any dimension whose unique-value count was growing faster than the underlying call volume. *"High-cardinality is how dashboards lie quietly,"* she said. *"It also fills your metrics database."*

## Panel 3: The Build

![](./panel-03.png)
<details><summary>Image Prompt</summary>
(This is Panel 03. Do not include the panel number in the image.)
Please generate a 16:9 image in modern flat vector cartoon illustration style depicting panel 3 of 7. Make the characters and style consistent with the prior panel. Scene: a code editor on a monitor showing OpenTelemetry instrumentation: `tracer.start_as_current_span(...)` with attributes for `feature_name`, `team_id`, `user_id_hash`. A second window shows a Grafana panel being built with a simple aggregation query. Bea types; Reza reads over her shoulder, nodding. Color palette: deep russet, warm cream, slate, burnt orange. Emotional tone: quiet build — the kind of work that pays off if you do it right the first time. Generate the image immediately without asking clarifying questions.
</details>

The instrumentation was straightforward. Every gateway call already wrote a structured log; Reza just added three new attributes — `feature_name`, `team_id`, and a hashed `user_id` — and Bea wired them into the dashboard. They shipped it on a Wednesday afternoon. By Wednesday evening, the new panels had data. By Wednesday night, the answer was visible.

## Panel 4: The Reveal

![](./panel-04.png)
<details><summary>Image Prompt</summary>
(This is Panel 04. Do not include the panel number in the image.)
Please generate a 16:9 image in modern flat vector cartoon illustration style depicting panel 4 of 7. Make the characters and style consistent with the prior panel. Scene: the new "COST PER FEATURE" panel on a monitor showing a horizontal bar chart. One bar towers over the rest — labeled "feature_name = HACKATHON-2026-Q1-DEMO" with a value of "$2,890/day" — about 34% of total spend. The next-tallest bar is barely a tenth of its size. Reza points; Bea smiles, headphones now around her neck. A wall clock shows it is 8:47 PM Wednesday. Color palette: deep russet, warm cream, slate, burnt orange. Emotional tone: detective triumph — found it, and it's funnier than expected. Generate the image immediately without asking clarifying questions.
</details>

The "Cost Per Feature" panel told the story instantly. A single bar dwarfed every other feature: *feature_name = HACKATHON-2026-Q1-DEMO.* That was a feature name from a quarterly hackathon project six months ago. Reza tilted his head. *"That ended in January."* Bea zoomed in. The feature name was being emitted by a nightly evaluation job that some well-meaning engineer had reused as scaffolding — and never renamed.

## Panel 5: The Two-Line Fix

![](./panel-05.png)
<details><summary>Image Prompt</summary>
(This is Panel 05. Do not include the panel number in the image.)
Please generate a 16:9 image in modern flat vector cartoon illustration style depicting panel 5 of 7. Make the characters and style consistent with the prior panel. Scene: a code-review tool on a monitor showing a small two-line diff. The "before" line shows `feature_name = "HACKATHON-2026-Q1-DEMO"`. The "after" line shows `feature_name = "nightly-eval-job"`. Below the diff, a comment reads: "Also: the eval job was fanning out 3x the intended cardinality after a config tweak — cap restored." Reza approves the PR with a single emoji: a small russet thumbs-up. Color palette: deep russet, warm cream, slate, burnt orange. Emotional tone: minimal fix, maximum impact — the satisfaction of a small change with a big number behind it. Generate the image immediately without asking clarifying questions.
</details>

The fix was two lines. Rename the feature to its real purpose. Restore the cardinality cap on the fan-out, which had been quietly raised three times during a config tweak nobody had reviewed. The PR landed before midnight. The next morning, daily spend dropped \$2,800 — a third of the bill, gone.

## Panel 6: The Cardinality Alert

![](./panel-06.png)
<details><summary>Image Prompt</summary>
(This is Panel 06. Do not include the panel number in the image.)
Please generate a 16:9 image in modern flat vector cartoon illustration style depicting panel 6 of 7. Make the characters and style consistent with the prior panel. Scene: the new "CARDINALITY MONITOR" panel on a monitor showing a chart with a clear threshold line. A small alert badge in the corner reads "ALERT: feature_name distinct values up 15% in 24h." Bea points at the alert with quiet satisfaction. Reza, beside her, sips coffee. A wall clock shows 9:30 AM Thursday. Color palette: deep russet, warm cream, slate, burnt orange. Emotional tone: institutionalized vigilance — making sure this never silently happens again. Generate the image immediately without asking clarifying questions.
</details>

Bea's cardinality monitor was the part of the work that mattered most. Two weeks later, it caught a different team accidentally creating per-user feature names — would have been a much worse cardinality explosion if it had been allowed to grow. The alert fired in the morning, before lunch the team had renamed the dimension, and the metrics database breathed a sigh of relief.

## Panel 7: The New Dashboard

![](./panel-07.png)
<details><summary>Image Prompt</summary>
(This is Panel 07. Do not include the panel number in the image.)
Please generate a 16:9 image in modern flat vector cartoon illustration style depicting panel 7 of 7. Make the characters and style consistent with the prior panel. Scene: the wall-mounted dashboard now redesigned, showing four small panels: "Cost per Feature," "Cost per Team," "Cost per User," "Cardinality Monitor" — each with a clear small bar chart. Total spend is shown in a corner, no longer dominant. Pemba — russet fur, cream belly, white facial mask, wire-rim glasses, bushy ringed tail, no clothing — sits on top of the dashboard frame holding a tiny abacus. A small label below the dashboard reads "TOTAL COST IS THE LEAST ACTIONABLE NUMBER. — Pemba." Reza and Bea pass by with coffees, both smile. Color palette: deep russet, warm cream, slate, burnt orange. Emotional tone: settled clarity — a dashboard that earns its wall space. Generate the image immediately without asking clarifying questions.
</details>

Reza updated the dashboard one more time. Total spend got a small corner. The four dimensional panels got the center of the wall. Pemba — sitting on top of the frame with a tiny abacus — added the line that became the platform team's mantra: *Total cost is the least actionable number on your dashboard.* The bill kept being something the team understood, instead of something that surprised them.

### Epilogue – What Reza and Bea Did Right

Reza didn't argue with the dashboard's *correctness* — total spend was, indeed, the total. He argued with its *usefulness*. A single number tells you the size of the problem, not its location. Bea added the cardinality guard that turned a one-time fix into a permanent practice. The lesson scales: any metric without dimensions is a rumor. Any high-cardinality dimension without a cap is a future incident.

| Challenge | How the Team Responded | Lesson for Today |
|-----------|------------------------|------------------|
| The dashboard showed only total spend | They added cost per feature, team, and user dimensions | Aggregates hide; dimensions reveal |
| A stale feature name dominated cost invisibly | They surfaced it instantly via the new "cost per feature" panel | Feature names are cost dimensions — keep them honest |
| Cardinality explosions could happen silently again | They added a cardinality-monitor panel with an alert | The dashboard should warn you about itself |
| The original dashboard had earned its wall space by tradition | They demoted total spend to a corner | A dashboard's design is itself a cost-efficiency choice |

### Call to Action

Look at the most-watched dashboard your team has for LLM spend. If it has fewer than three dimensions, it isn't a dashboard — it's a mood ring. Add cost per feature. Add cost per team. Add a cardinality monitor. The next surprise spike will already be highlighted on the wall before anyone has to ask *"why is the bill up?"*.

---

*"You're not telling me anything."*
— Reza, to the original dashboard

*"Total cost is the least actionable number on your dashboard."*
— Pemba

---

## References

1. [Wikipedia: Observability (software)](https://en.wikipedia.org/wiki/Observability_(software)) — The umbrella practice this story's redesign falls under
2. [Wikipedia: Cardinality](https://en.wikipedia.org/wiki/Cardinality) — Why high-cardinality dimensions explode metric storage if uncapped
3. [OpenTelemetry: Semantic conventions for LLM/GenAI calls](https://opentelemetry.io/docs/specs/semconv/gen-ai/) — Standard attribute names that make dashboards consistent across services
4. [Wikipedia: Pareto chart](https://en.wikipedia.org/wiki/Pareto_chart) — The visualization the new "cost per feature" panel is an instance of
5. [Chapter 10 — Observability, Dashboards, and Alerting](../../chapters/10-observability-dashboards-alerting/index.md) — The textbook chapter that motivates this story's dimensional dashboard design

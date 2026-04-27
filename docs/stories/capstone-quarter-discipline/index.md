---
title: The Capstone — A Quarter of Discipline
description: A 10-panel graphic novel about a 40-engineer organization that took the textbook seriously for one quarter, applied every chapter to a single feature, and cut total LLM cost 12× without a quality regression.
image: /stories/capstone-quarter-discipline/cover.png
og:image: /stories/capstone-quarter-discipline/cover.png
twitter:image: /stories/capstone-quarter-discipline/cover.png
social:
   cards: false
---

# The Capstone — A Quarter of Discipline

![](./cover.png)
<details>
<summary>Cover Image Prompt</summary>
(This is the Cover Image. Do not include this label in the image.)
Please generate a wide-landscape 16:9 cover image in modern flat vector cartoon illustration style with clean lines and a warm celebratory mood. Center: a clean two-bar chart on a giant board reading "MONTHLY LLM COST — Q1: $187,000  →  Q2: $15,200." A small label reads "12× reduction. Quality on golden set: held." Below the board, an engineering manager named Dana — South Asian woman, late 40s, glasses, blazer, calm authority — gestures at the chart in front of a CFO with a satisfied expression. Confetti drifts. To the side, a stack of small framed plaques each labeled with one of the eight chapter techniques applied. Above the scene, the title text "The Capstone" with subtitle "A Quarter of Discipline." Color palette: deep russet (#c1440e), warm cream (#fff8e7), slate (#37474f), burnt orange (#d35400). Emotional tone: warm pride — a team that did the work and brought receipts. Generate the image immediately without asking clarifying questions.
</details>

<details>
<summary>Narrative Prompt</summary>
This is a 10-panel educational graphic novel for the Token Optimization textbook — the synthesis/capstone story of the series. Setting: a fictional 40-engineer organization (call it "Lumen Labs") whose AI-powered search bar has become a flagship feature. The story spans an entire quarter (12 weeks) and shows the team applying eight different textbook techniques in sequence. Art style: modern flat vector cartoon illustration with clean lines and a warm collaborative mood. Characters appear consistently:

- **Dana** — engineering manager, South Asian woman, late 40s, glasses, blazer over a tee, calm and pragmatic.
- **Amara** — staff engineer, Black woman, mid-30s, locs in a high bun, denim jacket, technical and thoughtful.
- **Jamie** — senior engineer, white woman, late 20s, short red hair, hoodie, energetic.
- **Kenji** — junior engineer, Japanese-American man, mid-20s, dark glasses, vintage tee, eager learner.
- **The CFO** — older Mediterranean woman, sharp pantsuit, supportive but skeptical.
- **Pemba** — recurring red-panda mascot. Russet fur, cream belly, white facial mask with black tear marks, wire-rim glasses, bushy ringed tail. **No clothing.** Cameos throughout the synthesis panels.

Color palette: deep russet (#c1440e), warm cream (#fff8e7), slate (#37474f), burnt orange (#d35400). Maintain consistent character appearances across all 10 panels. The story's emotional arc moves from quiet skepticism through measured discipline to warm vindication.
</details>

### Prologue – One Feature, One Quarter, Every Chapter

Dana's bet was simple: pick one feature, run it through every chapter of the textbook for one quarter, measure relentlessly, and don't ship a single change without a before/after number. The feature she picked was the AI-powered search bar — Lumen Labs' flagship, the most-touched LLM call in the product, the line item with the largest share of the company's monthly bill. By the end of the quarter, total cost was down twelve times. No single change moved the needle by more than 25%. Every change was small. Every change compounded.

## Panel 1: The Bet

![](./panel-01.png)
<details><summary>Image Prompt</summary>
(This is Panel 01. Do not include the panel number in the image.)
I am about to ask you to generate a series of images for a graphic novel. Please make the images have a consistent style and consistent characters. Do not ask any clarifying questions. Just generate the image immediately when asked.

Please generate a 16:9 image in modern flat vector cartoon illustration style depicting panel 1 of 10. Scene: a quarterly planning meeting in a small conference room. Dana — South Asian woman, late 40s, glasses, blazer over a tee — stands at a whiteboard that reads "Q2 BET: ONE FEATURE. ONE QUARTER. EVERY CHAPTER." Below: "Target: 5x cost reduction. Stretch: 10x. Constraint: NO quality regression." A small printed photo of the textbook's table of contents is taped beside the bet. Amara, Jamie, and Kenji are seated at the table, attentive. Color palette: deep russet, warm cream, slate, burnt orange. Emotional tone: quiet ambition — a manager making a real commitment. Generate the image immediately without asking clarifying questions.
</details>

Dana wrote the bet on the whiteboard at the Q2 kickoff. *One feature. One quarter. Every chapter.* The CFO had given her permission to pick a single team and run a token-efficiency program with real teeth. She picked four engineers, picked the search bar, and put a single line under the bet: *No quality regression. Period.* Amara, Jamie, and Kenji nodded. The quarter was on.

## Panel 2: Week 1 — Instrumentation

![](./panel-02.png)
<details><summary>Image Prompt</summary>
(This is Panel 02. Do not include the panel number in the image.)
Please generate a 16:9 image in modern flat vector cartoon illustration style depicting panel 2 of 10. Make the characters and style consistent with the prior panel. Scene: Week 1 — instrumentation. Amara — Black woman, mid-30s, locs in a high bun, denim jacket — at her desk wiring up structured logging. Her monitor shows a clean Python decorator wrapping every search call with a JSON log line containing model, prompt hash, input/output/cached tokens, cost, latency, feature, user hash, outcome. A side dashboard shows the first day of structured data flowing in. A small calendar marker reads "Week 1 of 12." Color palette: deep russet, warm cream, slate, burnt orange. Emotional tone: the satisfying first week of a real project — building the foundation. Generate the image immediately without asking clarifying questions.
</details>

Week 1 was instrumentation. Amara wired up structured logging on every call into the search feature. Eleven fields, JSON, written before the call returned. By Friday the team had a baseline: \$187,000 per month at the current trajectory. *That's the number we're going to beat,* Dana wrote on the whiteboard. *Every change ships against this baseline.*

## Panel 3: Week 3 — The Pareto Hunt

![](./panel-03.png)
<details><summary>Image Prompt</summary>
(This is Panel 03. Do not include the panel number in the image.)
Please generate a 16:9 image in modern flat vector cartoon illustration style depicting panel 3 of 10. Make the characters and style consistent with the prior panel. Scene: Week 3 — log analysis. Jamie — white woman, late 20s, short red hair, hoodie — at a Jupyter notebook with a clear Pareto chart filling the screen, titled "SEARCH CALLS — COST BY QUERY TYPE." One bar dwarfs the rest, labeled "long-form 'explain this' queries" at $89,000/month. Pemba — russet fur, cream belly, white facial mask, wire-rim glasses, bushy ringed tail, no clothing — sits on top of Jamie's monitor holding a tiny magnifying glass, glasses glinting. Calendar marker: "Week 3 of 12." Color palette: deep russet, warm cream, slate, burnt orange. Emotional tone: detective triumph — the first big finding. Generate the image immediately without asking clarifying questions.
</details>

Week 3, Jamie pulled the Pareto chart from the new logs. One query type — long-form *"explain this thing to me"* searches — accounted for 47% of total search-bar cost. The team had been treating search as a single feature with one budget. *It's two features sharing one endpoint,* Jamie said. Pemba, perched on the monitor, peered through a tiny magnifying glass. *That's the leverage point.*

## Panel 4: Week 4 — Prompt Trim

![](./panel-04.png)
<details><summary>Image Prompt</summary>
(This is Panel 04. Do not include the panel number in the image.)
Please generate a 16:9 image in modern flat vector cartoon illustration style depicting panel 4 of 10. Make the characters and style consistent with the prior panel. Scene: Week 4 — prompt trimming. Kenji — Japanese-American man, mid-20s, dark glasses, vintage tee — runs an ablation script that systematically removes sections of the system prompt and measures quality on the gold set. His monitor shows a side-by-side: original prompt at 3,400 tokens, trimmed version at 1,100 tokens, quality score unchanged. Calendar marker: "Week 4 of 12. Cost so far: -16%." Color palette: deep russet, warm cream, slate, burnt orange. Emotional tone: precise, methodical work — the per-section ablation pattern. Generate the image immediately without asking clarifying questions.
</details>

Week 4, Kenji ran a per-section ablation on the search system prompt. Three thousand four hundred tokens shrank to eleven hundred without a quality drop. The team's first sub-goal — *trim every prompt before tuning anything else* — landed early. The cost line bent for the first time. *Sixteen percent down from baseline.* Dana drew a small notch on the whiteboard.

## Panel 5: Week 6 — Caching and Routing

![](./panel-05.png)
<details><summary>Image Prompt</summary>
(This is Panel 05. Do not include the panel number in the image.)
Please generate a 16:9 image in modern flat vector cartoon illustration style depicting panel 5 of 10. Make the characters and style consistent with the prior panel. Scene: Week 6 — two parallel workstreams visible. Left: Amara configures prompt caching with `cache_control` on the stable prefix of the system prompt. Her dashboard shows cache hit rate climbing to 91%. Right: Jamie wires up a cheap-first cascade — Haiku for short factual lookups, Sonnet for "explain" queries — with a confidence threshold. A whiteboard between their desks reads "CACHE: -22% input cost. ROUTING: 60% of traffic now on cheap tier." Calendar marker: "Week 6 of 12. Total cost so far: -38%." Color palette: deep russet, warm cream, slate, burnt orange. Emotional tone: parallel productivity — the team in flow. Generate the image immediately without asking clarifying questions.
</details>

Weeks five and six landed two changes in parallel. Amara turned on prompt caching with the stable prefix at the top — hit rate climbed to 91% by the end of the week. Jamie shipped a cheap-first cascade that sent short factual lookups to Haiku and reserved Sonnet for the long-form explanations. By the end of week six, sixty percent of traffic ran on the cheap tier. Total cost was down 38% from baseline.

## Panel 6: Week 8 — Agent Limits and Batch

![](./panel-06.png)
<details><summary>Image Prompt</summary>
(This is Panel 06. Do not include the panel number in the image.)
Please generate a 16:9 image in modern flat vector cartoon illustration style depicting panel 6 of 10. Make the characters and style consistent with the prior panel. Scene: Week 8 — two more changes. The search bar's "deep research" mode runs an agentic harness; Kenji wires up the four-limit budget policy (token cap, iteration limit, file-edit circuit breaker, wall-clock ceiling) for it. Meanwhile Amara migrates the offline content-tagging job (which feeds search) from synchronous to batch API. Two small dashboards show a 6% cost cut from agent caps and a 14% cut from the batch migration. Calendar marker: "Week 8 of 12. Total cost so far: -54%." Color palette: deep russet, warm cream, slate, burnt orange. Emotional tone: the steady accumulation of disciplined wins. Generate the image immediately without asking clarifying questions.
</details>

Week 8 brought two more techniques home. Kenji applied the four-limit agent budget policy to the search-bar's *"deep research"* mode — runaway sessions that had been quietly burning thousands of tokens hit a ceiling and posted a Slack alert instead. Amara migrated the offline content-tagging pipeline that fed search results from the synchronous API to batch — a 14% chunk of the bill, gone with a one-line change. Total cost was down 54%.

## Panel 7: Week 10 — A/B Tests and Memory

![](./panel-07.png)
<details><summary>Image Prompt</summary>
(This is Panel 07. Do not include the panel number in the image.)
Please generate a 16:9 image in modern flat vector cartoon illustration style depicting panel 7 of 10. Make the characters and style consistent with the prior panel. Scene: Week 10 — two more changes. Jamie runs a clean A/B experiment with all six guardrail metrics (input, output, total cost, quality, satisfaction, latency) — the new variant ships only after passing on all four. Amara adds hierarchical summarization for multi-turn search sessions that tend to grow over the course of a research workflow. Calendar marker: "Week 10 of 12. Total cost so far: -76%." Color palette: deep russet, warm cream, slate, burnt orange. Emotional tone: the discipline of the A/B harness combined with the elegance of the memory policy. Generate the image immediately without asking clarifying questions.
</details>

Week 10, Jamie and Amara double-teamed two more chapters. Jamie shipped the A/B testing harness with all six guardrail metrics, and used it to test three small prompt variants. Two passed, one failed (output tokens up). Amara added hierarchical summarization for multi-turn research sessions, capping per-reply cost at the long tail of the distribution. By the end of week 10, total cost was down 76% from baseline.

## Panel 8: Week 12 — The Final Numbers

![](./panel-08.png)
<details><summary>Image Prompt</summary>
(This is Panel 08. Do not include the panel number in the image.)
Please generate a 16:9 image in modern flat vector cartoon illustration style depicting panel 8 of 10. Make the characters and style consistent with the prior panel. Scene: Week 12 — the team gathered around the dashboard for the final review. The dashboard shows two side-by-side numbers: "Q2 BASELINE: $187,000/month" and "Q2 ENDING: $15,200/month." Below: "12.3× cost reduction. Quality on golden set: 4.71 → 4.74. P95 latency: 1.8s → 1.1s." Dana, Amara, Jamie, and Kenji stand together. Pemba — russet fur, cream belly, white facial mask, wire-rim glasses, bushy ringed tail, no clothing — sits on the monitor holding a tiny calculator with a small thumbs-up. Calendar marker: "Week 12 of 12." Color palette: deep russet, warm cream, slate, burnt orange. Emotional tone: hard-earned vindication — the receipts are in. Generate the image immediately without asking clarifying questions.
</details>

The end-of-quarter review took ten minutes. The dashboard showed two numbers side by side. Baseline: \$187,000 per month. Ending: \$15,200 per month. Twelve-point-three times cheaper. Quality scores nudged *up* by a hair — within noise, possibly real. P95 latency dropped from 1.8 seconds to 1.1. Pemba, perched on the monitor with a tiny calculator, gave the team a small thumbs-up. Dana wrote one more thing on the whiteboard: *Now the harder part. Make it permanent.*

## Panel 9: The CFO Slide

![](./panel-09.png)
<details><summary>Image Prompt</summary>
(This is Panel 09. Do not include the panel number in the image.)
Please generate a 16:9 image in modern flat vector cartoon illustration style depicting panel 9 of 10. Make the characters and style consistent with the prior panel. Scene: a small board-room. Dana presents a single slide with two numbers and a smaller line of text below: "Search-bar monthly cost: $187,000 → $15,200. Quality and latency: held or improved." The CFO — older Mediterranean woman, sharp pantsuit — sits forward, reading the slide carefully. Amara, Jamie, and Kenji are seated at the side, attentive. The CFO's face shifts from skeptical to genuinely impressed. Color palette: deep russet, warm cream, slate, burnt orange. Emotional tone: a manager bringing receipts a CFO can act on. Generate the image immediately without asking clarifying questions.
</details>

Dana presented one slide. Two numbers. Two short bullet points. The CFO read it twice. *"This is the cleanest cost result I've seen this year. What do you need to do this on the next three features?"* Dana didn't blink. *"The same four engineers, one more quarter, and a small budget for a vendor-neutral observability layer."* The CFO nodded. *"Approved. I want a board-ready version of this for the next investor update."*

## Panel 10: The Permanent Practice

![](./panel-10.png)
<details><summary>Image Prompt</summary>
(This is Panel 10. Do not include the panel number in the image.)
Please generate a 16:9 image in modern flat vector cartoon illustration style depicting panel 10 of 10. Make the characters and style consistent with the prior panel. Scene: six months later. The Lumen Labs engineering wall now has a printed framed plaque with the eight techniques as a checklist: "1. Instrument. 2. Trim. 3. Cache. 4. Route. 5. Cap. 6. Batch. 7. Test. 8. Compress." Below the checklist, a smaller line in italic russet ink: "EVERY TOKEN COUNTS — AND COUNTING IS FUN. — Pemba." Pemba — russet fur, cream belly, white facial mask, wire-rim glasses, bushy ringed tail, no clothing — sits on top of the frame holding a tiny clipboard, looking warmly satisfied. Dana walks past with a coffee, gives a small nod to Pemba. In the background, the same four engineers (now joined by two new hires) work calmly at their desks. Color palette: deep russet, warm cream, slate, burnt orange, with warm afternoon light. Emotional tone: settled mastery — discipline became culture. Generate the image immediately without asking clarifying questions.
</details>

Six months later, the eight-step checklist was up on the engineering wall as a framed plaque. Every new feature went through the eight steps before it could ship. Two new hires joined the team and learned the order on their first week. The total LLM bill across the company stopped climbing for the first time in two years — then started bending the right way. Pemba, on top of the plaque with a tiny clipboard, smiled the contented smile of a small mascot watching a small habit compound into a real thing.

### Epilogue – What Lumen Labs Did Right

The Lumen Labs team didn't find a magic 12× optimization. They found eight 1.3× optimizations and stacked them. None of them would have been worth a press release. All of them together rewrote the unit economics of the company's flagship feature. The CFO funded the next quarter, then the quarter after, then the team that institutionalized the practice. The lesson scales: cost reduction is not a project. Cost reduction is a practice. The teams that ship great AI systems at low cost are the teams that did the boring eight-step thing every week for a year.

| Challenge | How Lumen Labs Responded | Lesson for Today |
|-----------|--------------------------|------------------|
| The team had no baseline | Week 1: structured logging on every call | You cannot beat a number you have not written down |
| Long-form queries silently dominated cost | Week 3: Pareto analysis revealed 47% from one query type | Pareto charts of LLM cost almost always have one tall bar |
| The system prompt had grown unaudited | Week 4: per-section ablation cut 67% with no quality drop | Trim the prompt before tuning anything else |
| Caching and routing were sitting on the table | Week 6: cache prefix + cheap-first cascade | The two highest-leverage optimizations after trimming |
| The "deep research" agent could spiral | Week 8: four-limit budget policy | Autonomous systems need budgets that can stop them |
| Offline tagging used the synchronous path | Week 8: batch API for the offline pipeline | Sync is for humans waiting; batch is for everyone else |
| Experiments shipped on input tokens alone | Week 10: six-metric A/B harness | A win on one axis is not a win |
| Long sessions accumulated unbounded context | Week 10: hierarchical summarization | Memory needs an eviction policy or it's a tax |
| The wins could have evaporated when people moved on | Six months later: the eight-step plaque became culture | Make the discipline visible; that's how it survives |

### Call to Action

You don't need a 40-engineer organization to do this. You need one feature, one quarter, and the willingness to write the baseline down before you change anything. Pick a single LLM-touching feature on your team's books this quarter. Apply the eight steps in order. Measure relentlessly. Ship one change a week. The 12× isn't a promise — it's a *floor* if you actually do the work. And every token you stop wasting is a token your team gets to spend on the next great feature.

---

*"This is the cleanest cost result I've seen this year."*
— the CFO

*"Every token counts — and counting is fun."*
— Pemba

---

## References

1. [Wikipedia: Continuous improvement](https://en.wikipedia.org/wiki/Continual_improvement_process) — The general practice this story's quarterly discipline is an instance of
2. [Wikipedia: Pareto analysis](https://en.wikipedia.org/wiki/Pareto_analysis) — The technique used in week 3 to find the dominant cost driver
3. [Wikipedia: FinOps](https://en.wikipedia.org/wiki/FinOps) — The broader cloud-financial-operations discipline that token efficiency belongs inside
4. [Wikipedia: Capstone course](https://en.wikipedia.org/wiki/Capstone_course) — The educational pattern this synthesis story is named after
5. [Chapter 20 — Capstone Projects and Continuous Practice](../../chapters/20-capstone-projects-practice/index.md) — The textbook chapter that motivates this story's eight-step framework

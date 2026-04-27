---
title: The Async They Forgot — Half Off for a Workload That Wasn't Watching the Clock
description: A 6-panel graphic novel about a media company's nightly tagging pipeline that ran on the synchronous API for years until one engineer noticed the SLA was four hours and switched to Batch.
image: /stories/async-they-forgot/cover.png
og:image: /stories/async-they-forgot/cover.png
twitter:image: /stories/async-they-forgot/cover.png
social:
   cards: false
---

# The Async They Forgot

![](./cover.png)
<details>
<summary>Cover Image Prompt</summary>
(This is the Cover Image. Do not include this label in the image.)
Please generate a wide-landscape 16:9 cover image in modern flat vector cartoon illustration style with clean lines and a calm late-night mood. Center: a giant wall clock with two faces overlapping — one labeled "SLA: 4 HOURS" in calm green, the other labeled "ACTUAL: 90 MINUTES" in bright russet — sits above a stack of newspaper-style article cards being efficiently tagged with metadata labels. To the right, an engineer named Hana — Black woman, mid-30s, short curly hair, denim jacket — stands holding a coffee mug looking thoughtfully at the clock. To the left, a discount tag dangles: "BATCH API — 50% OFF." Above the scene, the title text "The Async They Forgot" in bold sans-serif lettering. Color palette: deep russet (#c1440e), warm cream (#fff8e7), slate (#37474f), burnt orange (#d35400). Emotional tone: calm late-night realization — a hidden discount being discovered. Generate the image immediately without asking clarifying questions.
</details>

<details>
<summary>Narrative Prompt</summary>
This is a 6-panel educational graphic novel for the Token Optimization textbook. Setting: a fictional mid-size media company that runs a nightly article-tagging pipeline. Art style: modern flat vector cartoon illustration with clean lines and warm late-night palette. Characters appear consistently:

- **Hana** — senior data engineer. Black woman, mid-30s, short curly hair, denim jacket over a t-shirt, always carrying a coffee mug.
- **Pemba** — recurring red-panda mascot. Russet fur, cream belly, white facial mask with black tear marks, wire-rim glasses, bushy ringed tail. **No clothing.** Cameos in the closing panel.

Color palette: deep russet (#c1440e), warm cream (#fff8e7), slate (#37474f), burnt orange (#d35400). Maintain consistent character appearances across all 6 panels.
</details>

### Prologue – The Pipeline That Couldn't Read a Clock

Every night, between 2 AM and 6 AM, the media company's tagging pipeline fired off 200,000 synchronous API calls — one per article. It worked. It had worked for two years. It had also been billing the synchronous rate for two years on a workload whose users were asleep. Hana noticed on a Wednesday. By Thursday morning, the bill had been cut in half.

## Panel 1: The Nightly Pipeline

![](./panel-01.png)
<details><summary>Image Prompt</summary>
(This is Panel 01. Do not include the panel number in the image.)
I am about to ask you to generate a series of images for a graphic novel. Please make the images have a consistent style and consistent characters. Do not ask any clarifying questions. Just generate the image immediately when asked.

Please generate a 16:9 image in modern flat vector cartoon illustration style depicting panel 1 of 6. Scene: a dim server room visualization at 3 AM, depicted as a stylized cartoon. A long conveyor belt of newspaper article cards moves through a tagging machine that fires off API calls one at a time, each call shown as a small russet token flying out of the machine. A clock on the wall reads 3:14 AM. A counter on the side of the machine reads "Articles tagged: 87,213 / 200,000." No people in the scene. Color palette: deep russet, warm cream, slate, burnt orange, with a heavy night-blue ambient. Emotional tone: ambient, automated, the calm of a nightly process running unnoticed. Generate the image immediately without asking clarifying questions.
</details>

The pipeline ran every night. It tagged each article with category, sentiment, named entities, and a one-sentence summary. Two hundred thousand calls between 2 AM and 6 AM, every night, for two years. Nobody had touched the code since launch. It just worked.

## Panel 2: The Wednesday Audit

![](./panel-02.png)
<details><summary>Image Prompt</summary>
(This is Panel 02. Do not include the panel number in the image.)
Please generate a 16:9 image in modern flat vector cartoon illustration style depicting panel 2 of 6. Make the characters and style consistent with the prior panel. Scene: Hana — Black woman, mid-30s, short curly hair, denim jacket — at her desk on a Wednesday morning, monitor showing the pipeline's runbook. Highlighted in russet: "SLA: results must be in the CMS by 6 AM. Pipeline starts at 2 AM. Window: 4 hours." Hana sips coffee, eyebrow raised, the expression of a person noticing something obvious for the first time. A second monitor shows a pricing comparison page with "Batch API — 50% off — 24-hour completion window." Color palette: deep russet, warm cream, slate, burnt orange. Emotional tone: the quiet click of recognition. Generate the image immediately without asking clarifying questions.
</details>

Hana was reviewing the pipeline's runbook on a Wednesday morning when she noticed two facts that had never been put next to each other before. *SLA: 4 hours.* *Synchronous API call rate: 50% more expensive than Batch.* Batch's window was 24 hours. The pipeline only needed 4. She set down her coffee. *"Why are we using sync?"*

## Panel 3: The Conversation

![](./panel-03.png)
<details><summary>Image Prompt</summary>
(This is Panel 03. Do not include the panel number in the image.)
Please generate a 16:9 image in modern flat vector cartoon illustration style depicting panel 3 of 6. Make the characters and style consistent with the prior panel. Scene: Hana on a video call with two colleagues from the original launch team. Their faces are slightly sheepish on the call. The chat shows messages: "we just used the same pattern as the rest of the codebase," "didn't realize batch existed when we shipped," "great catch tbh." Hana, kind expression, replies: "no blame — let's fix it tonight." Color palette: deep russet, warm cream, slate, burnt orange. Emotional tone: collegial, no-fault diagnosis. Generate the image immediately without asking clarifying questions.
</details>

She pinged the two engineers from the original launch team. They were both apologetic and good-humored. *"Honestly we just used the same pattern as the rest of the codebase. Didn't realize batch existed when we shipped."* Hana waved off the apology. *"This is a one-line change with five-figure annual savings. No blame. Let's just fix it."*

## Panel 4: The Switch

![](./panel-04.png)
<details><summary>Image Prompt</summary>
(This is Panel 04. Do not include the panel number in the image.)
Please generate a 16:9 image in modern flat vector cartoon illustration style depicting panel 4 of 6. Make the characters and style consistent with the prior panel. Scene: a code editor on Hana's monitor showing a git diff. The "before" side shows a `for article in articles: client.messages.create(...)` loop. The "after" side shows a single `client.messages.batches.create(requests=[...])` call followed by a polling helper. The diff stat reads "+18 −34 lines." Hana types calmly. Color palette: deep russet, warm cream, slate, burnt orange. Emotional tone: clean, satisfying refactor — the right kind of small. Generate the image immediately without asking clarifying questions.
</details>

The refactor was thirty-four lines deleted, eighteen lines added. Replace the synchronous loop with a single batch submission, add a poller for the result file, write the tags into the CMS the same way as before. Hana wrote tests, ran a 1,000-article smoke check against the live batch endpoint, and shipped behind a feature flag at 10% traffic for the night.

## Panel 5: The Result

![](./panel-05.png)
<details><summary>Image Prompt</summary>
(This is Panel 05. Do not include the panel number in the image.)
Please generate a 16:9 image in modern flat vector cartoon illustration style depicting panel 5 of 6. Make the characters and style consistent with the prior panel. Scene: a Thursday-morning dashboard. A bar chart shows "Pipeline cost — Wednesday vs Thursday" with the Thursday bar at 50% of Wednesday's height. A second chart shows "Pipeline completion time" — Wednesday at 3:55 AM, Thursday at 3:32 AM (with a small note: "batch returned in 92 minutes — well under SLA"). Hana raises a coffee mug in a small private toast. Color palette: deep russet, warm cream, slate, burnt orange. Emotional tone: vindicated competence — the result was always available, just untaken. Generate the image immediately without asking clarifying questions.
</details>

Thursday morning's dashboard told the story in two numbers. Pipeline cost: *halved.* Pipeline completion time: *faster*, because the batch endpoint ran the work in parallel under the hood. The CMS got the tags by 3:32 AM. The SLA was 6 AM. Hana raised her mug in a small private toast and got back to her actual project.

## Panel 6: The Team Rule

![](./panel-06.png)
<details><summary>Image Prompt</summary>
(This is Panel 06. Do not include the panel number in the image.)
Please generate a 16:9 image in modern flat vector cartoon illustration style depicting panel 6 of 6. Make the characters and style consistent with the prior panel. Scene: a printed one-page rule taped to the wall above the team's monitors. The rule reads in bold lettering: "IF THE SLA IS LONGER THAN ONE HOUR, TRY BATCH FIRST. IF IT'S LONGER THAN A DAY, BATCH IS MANDATORY." Pemba — russet fur, cream belly, white facial mask, wire-rim glasses, bushy ringed tail, no clothing — sits on top of the frame holding a tiny stopwatch with a small thought bubble that reads "synchronous is for humans waiting." Hana walks past with a coffee, gives a small thumbs-up to Pemba. Color palette: deep russet, warm cream, slate, burnt orange. Emotional tone: institutionalized wisdom — the rule that survives team turnover. Generate the image immediately without asking clarifying questions.
</details>

Hana wrote the team's new rule on a single sheet of paper and taped it above the monitors. *If the SLA is longer than one hour, try batch first. If it's longer than a day, batch is mandatory.* Pemba, dropping by with a tiny stopwatch, signed it: *Synchronous is for humans waiting.* Two months later, three more pipelines had migrated. The team's monthly LLM bill was down 38%.

### Epilogue – What Hana Did Right

Hana did the smallest possible thing: she read the runbook. The SLA was sitting there, in plain text, next to a pipeline that was paying premium prices for premium speed it didn't need. The lesson scales: every workload has an SLA, even when nobody has written it down. If you can articulate the deadline, you can pick the right API mode for it.

| Challenge | How Hana Responded | Lesson for Today |
|-----------|--------------------|------------------|
| The pipeline used synchronous calls without anyone questioning it | She read the runbook and noticed the 4-hour SLA | Re-read your own runbooks once a year — patterns drift |
| The team had no rule for sync vs batch | She wrote the one-line rule and pinned it to the wall | Cost-aware patterns spread when they have a memorable name |
| Migrating to batch felt risky | She shipped behind a 10% feature flag for one night | Async migrations are reversible; treat them like any other rollout |
| The savings were invisible because the bill was lumped together | She made a clear before/after dashboard chart | Show the saving — don't just claim it in a Slack message |

### Call to Action

Look at every nightly pipeline, every offline analysis, every "we run this in the background" workload your team owns. For each one, ask: *what is its real SLA?* If the answer is longer than an hour, the synchronous API is probably the wrong tool. The batch endpoint is the same model with a different invoice — and most of the time, the only thing standing between you and the discount is a `for` loop nobody has rewritten yet.

---

*"This is a one-line change with five-figure annual savings."*
— Hana

*"Synchronous is for humans waiting."*
— Pemba

---

## References

1. [Wikipedia: Batch processing](https://en.wikipedia.org/wiki/Batch_processing) — The classical pattern this story's pipeline is an instance of
2. [Wikipedia: Service-level agreement](https://en.wikipedia.org/wiki/Service-level_agreement) — Why naming an SLA explicitly is the move that unlocks the right architecture
3. [Wikipedia: Asynchronous I/O](https://en.wikipedia.org/wiki/Asynchronous_I/O) — Background on the broader async pattern family
4. [Anthropic: Message Batches API](https://docs.anthropic.com/en/api/creating-message-batches) — Vendor docs for the 50% batch discount and 24-hour window
5. [Chapter 3 — Pricing, Economics, and Async APIs](../../chapters/03-pricing-economics-async-apis/index.md) — The textbook chapter that motivates this story's batch-first rule

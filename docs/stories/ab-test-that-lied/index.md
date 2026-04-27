---
title: The A/B Test That Lied — Why "Cheaper Input" Wasn't Cheaper At All
description: An 8-panel graphic novel about a growth team that celebrated a 40% input-cost win on Prompt B — until a skeptical engineer measured output tokens and found the new prompt cost more total dollars per call.
image: /stories/ab-test-that-lied/cover.png
og:image: /stories/ab-test-that-lied/cover.png
twitter:image: /stories/ab-test-that-lied/cover.png
social:
   cards: false
---

# The A/B Test That Lied

![](./cover.png)
<details>
<summary>Cover Image Prompt</summary>
(This is the Cover Image. Do not include this label in the image.)
Please generate a wide-landscape 16:9 cover image in modern flat vector cartoon illustration style with clean lines and a forensic-investigation mood. Center: an oversized scoreboard split down the middle. Left side, in big bold green: "INPUT TOKENS: −40%" with a confetti spray. Right side, in stark slate: "OUTPUT TOKENS: +62%" with a small alarm bell. A tiny bottom-line label below reads "TOTAL COST: +18%." To the right, a skeptical engineer named Anya — Eastern European woman, late 30s, sharp gray bob, black turtleneck — points calmly at the right side of the scoreboard. To the left, a celebrating engineer named Theo — Mediterranean man, mid-20s, curly dark hair, button-down shirt with rolled sleeves — claps with confetti in his hand, mid-celebration, a question mark forming above his head. Above the scene, the title text "The A/B Test That Lied" in bold sans-serif lettering. Color palette: deep russet (#c1440e), warm cream (#fff8e7), slate (#37474f), burnt orange (#d35400). Emotional tone: dawning realization — celebration interrupted. Generate the image immediately without asking clarifying questions.
</details>

<details>
<summary>Narrative Prompt</summary>
This is an 8-panel educational graphic novel for the Token Optimization textbook. Setting: a fictional consumer-internet growth team running prompt experiments. Art style: modern flat vector cartoon illustration with clean lines and a forensic mood. Characters appear consistently:

- **Theo** — junior growth engineer, Mediterranean man, mid-20s, curly dark hair, button-down shirt with rolled sleeves, energetic.
- **Anya** — senior engineer, Eastern European woman, late 30s, sharp gray bob, black turtleneck, calm and skeptical.
- **Pemba** — recurring red-panda mascot. Russet fur, cream belly, white facial mask with black tear marks, wire-rim glasses, bushy ringed tail. **No clothing.** Cameos in the closing panel.

Color palette: deep russet (#c1440e), warm cream (#fff8e7), slate (#37474f), burnt orange (#d35400). Maintain consistent character appearances across all 8 panels.
</details>

### Prologue – The Most Expensive Win in Q1

Theo shipped Prompt B on a Tuesday. Two days later, the dashboard showed a 40% drop in input tokens, and the growth team's Slack channel turned into a small parade. Anya, scrolling past the celebration, noticed something the dashboard wasn't showing — a small upward bend in *output* tokens that nobody had highlighted. By Friday she had the receipts. The "win" had cost the company money.

## Panel 1: The Celebration

![](./panel-01.png)
<details><summary>Image Prompt</summary>
(This is Panel 01. Do not include the panel number in the image.)
I am about to ask you to generate a series of images for a graphic novel. Please make the images have a consistent style and consistent characters. Do not ask any clarifying questions. Just generate the image immediately when asked.

Please generate a 16:9 image in modern flat vector cartoon illustration style depicting panel 1 of 8. Scene: an open-plan office. Theo — Mediterranean man, mid-20s, curly dark hair, button-down shirt with rolled sleeves — stands beaming next to a large monitor showing a green chart titled "INPUT TOKENS: −40% on Prompt B." Three colleagues clap. Confetti from a small popper drifts in the air. A Slack notification on the side shows the message "🎉 PROMPT B SHIPPED — 40% input cost reduction! Going to try this on the onboarding flow next." Color palette: deep russet, warm cream, slate, burnt orange, with celebratory accent yellow. Emotional tone: triumphant — a young engineer's first big win. Generate the image immediately without asking clarifying questions.
</details>

Theo's first prompt experiment had landed. Forty percent fewer input tokens on the upsell-suggestion flow. He'd tested it on a small 5% holdout for a week, the input dashboard had moved exactly as predicted, and quality scores on the gold set had held flat. He shipped it to 100% of traffic on Tuesday. The growth team threw confetti. A celebratory Slack post racked up a row of party emoji.

## Panel 2: The Anomaly

![](./panel-02.png)
<details><summary>Image Prompt</summary>
(This is Panel 02. Do not include the panel number in the image.)
Please generate a 16:9 image in modern flat vector cartoon illustration style depicting panel 2 of 8. Make the characters and style consistent with the prior panel. Scene: Anya — Eastern European woman, late 30s, sharp gray bob, black turtleneck — at her desk, two monitors visible. Left monitor shows the celebrated input-tokens chart. Right monitor shows a less-prominent dashboard panel labeled "OUTPUT TOKENS PER CALL" with a clear upward bend after the Prompt B deploy. Anya's expression is calm and curious — eyebrow raised, finger paused on a mouse wheel. Color palette: deep russet, warm cream, slate, burnt orange. Emotional tone: the steady focus of a person who notices what others have stopped looking at. Generate the image immediately without asking clarifying questions.
</details>

Anya was scrolling past the celebration when something on a less-prominent dashboard caught her eye. *Output tokens per call*, the panel that nobody on the growth team had bothered to look at this quarter. Since the Prompt B deploy, the line had bent upward — not dramatically, but unmistakably. She pulled up the underlying data. *"Hm."*

## Panel 3: The Skeptic's Query

![](./panel-03.png)
<details><summary>Image Prompt</summary>
(This is Panel 03. Do not include the panel number in the image.)
Please generate a 16:9 image in modern flat vector cartoon illustration style depicting panel 3 of 8. Make the characters and style consistent with the prior panel. Scene: Anya at her desk running a SQL query in a notebook. The query joins the experiment-assignment table to the LLM-call logs and computes mean input tokens, mean output tokens, and mean *total* cost per call by variant. The result table is visible: "PROMPT A: input 1,200 / output 200 / cost $0.0066. PROMPT B: input 720 / output 324 / cost $0.0078." A second column on the right shows percentage deltas: input −40%, output +62%, total cost +18%. Anya's expression is calm but firm. Color palette: deep russet, warm cream, slate, burnt orange. Emotional tone: forensic clarity — finding the truth in the data. Generate the image immediately without asking clarifying questions.
</details>

Anya wrote a single SQL query that joined the experiment table to the LLM call logs and pulled mean *input* tokens, mean *output* tokens, and mean *total cost per call* by variant. The result was the kind of clean refutation only data can deliver. Prompt B's input was 40% cheaper. Prompt B's output was 62% *more* expensive. Output is billed at five times the input rate. Total cost per call: 18% *higher* on Prompt B than on Prompt A.

## Panel 4: The Why

![](./panel-04.png)
<details><summary>Image Prompt</summary>
(This is Panel 04. Do not include the panel number in the image.)
Please generate a 16:9 image in modern flat vector cartoon illustration style depicting panel 4 of 8. Make the characters and style consistent with the prior panel. Scene: a side-by-side prompt comparison on a monitor. Prompt A on the left: clear, directive, ends with "answer in 1-2 sentences." Prompt B on the right: shorter overall but ends with "be thorough and explain your reasoning." Below each prompt, a sample model output: Prompt A's response is two crisp sentences; Prompt B's response is a five-paragraph essay with hedging and bullet points. A small annotation between them reads "the cheaper prompt asked for more output." Color palette: deep russet, warm cream, slate, burnt orange. Emotional tone: clean diagnosis — the cause hides in the wording. Generate the image immediately without asking clarifying questions.
</details>

The cause was hiding in plain sight in the prompt itself. Prompt A had ended with *"answer in 1–2 sentences."* Prompt B, in its zeal to be more concise overall, had replaced that sentence with *"be thorough and explain your reasoning."* The new prompt was shorter — and *also* told the model to write longer answers. The trim had moved cost from input to output, where it was five times worse.

## Panel 5: The Slack Correction

![](./panel-05.png)
<details><summary>Image Prompt</summary>
(This is Panel 05. Do not include the panel number in the image.)
Please generate a 16:9 image in modern flat vector cartoon illustration style depicting panel 5 of 8. Make the characters and style consistent with the prior panel. Scene: a Slack channel on a monitor. Anya's message appears: "Quick correction on Prompt B — input is −40%, but output is +62%, so total cost per call is +18%. Recommend rolling back while we investigate." The message has a small thumbs-up from a manager and a respectful reply from Theo: "On it. Thanks for catching this." Anya watches the messages settle, calm. Color palette: deep russet, warm cream, slate, burnt orange. Emotional tone: principled correction — no shaming, just facts. Generate the image immediately without asking clarifying questions.
</details>

Anya didn't post in the celebratory thread. She started a new one, factual and short. *Quick correction on Prompt B — input is down 40%, but output is up 62%, so total cost per call is up 18%. Recommend rolling back while we investigate.* The manager replied with a thumbs-up. Theo replied *"On it. Thanks for catching this"* with grace, because that's the kind of teammate Theo was. The rollback shipped within the hour.

## Panel 6: The Rebuild

![](./panel-06.png)
<details><summary>Image Prompt</summary>
(This is Panel 06. Do not include the panel number in the image.)
Please generate a 16:9 image in modern flat vector cartoon illustration style depicting panel 6 of 8. Make the characters and style consistent with the prior panel. Scene: Anya and Theo at a whiteboard together. The board shows a clean experiment-harness checklist titled "GUARDRAIL METRICS — REQUIRED FOR EVERY PROMPT A/B TEST." Six bullet points: "1. Input tokens. 2. Output tokens. 3. TOTAL cost per call. 4. Quality score on gold set. 5. User satisfaction (CSAT). 6. P95 latency." A red star sits next to "TOTAL cost per call." Theo writes; Anya nods. Color palette: deep russet, warm cream, slate, burnt orange. Emotional tone: collaborative learning — turning a near-miss into a permanent practice. Generate the image immediately without asking clarifying questions.
</details>

Anya and Theo built the new experiment checklist together. Six guardrail metrics. *Total cost per call* — not just input, not just output, the full damage — pinned with a red star at the top. *Quality, satisfaction, latency* alongside, so a "win" had to win on all four dimensions before it could ship. Theo printed the checklist and taped it above his monitor.

## Panel 7: The Postmortem

![](./panel-07.png)
<details><summary>Image Prompt</summary>
(This is Panel 07. Do not include the panel number in the image.)
Please generate a 16:9 image in modern flat vector cartoon illustration style depicting panel 7 of 8. Make the characters and style consistent with the prior panel. Scene: a postmortem document on a monitor titled "Prompt B — Why Our Win Wasn't." The document includes a clear timeline, a clean root-cause line ("the new prompt's wording shifted cost from input to output"), and a list of "what we'll do differently" actions. Theo and Anya present it together to a small team meeting via projector. The team is engaged, taking notes. Color palette: deep russet, warm cream, slate, burnt orange. Emotional tone: institutional learning — the team gets smarter, no individual gets blamed. Generate the image immediately without asking clarifying questions.
</details>

The postmortem went to the whole growth org. *Why Our Win Wasn't.* It traced the failure mode, named the root cause without naming a culprit, and listed three concrete process changes. Two other teams adopted the new checklist that week. The biggest cultural shift was the smallest line in the doc: *No prompt experiment ships on input-only metrics. Output is half the bill.*

## Panel 8: The Sticky Note

![](./panel-08.png)
<details><summary>Image Prompt</summary>
(This is Panel 08. Do not include the panel number in the image.)
Please generate a 16:9 image in modern flat vector cartoon illustration style depicting panel 8 of 8. Make the characters and style consistent with the prior panel. Scene: Theo's monitor a week later. The screen shows a fresh experiment dashboard for Prompt C with all six guardrail metrics visible. A russet-and-cream sticky note in the corner reads in marker: "'CHEAPER INPUT' IS NOT 'CHEAPER.' — Pemba." Pemba — russet fur, cream belly, white facial mask, wire-rim glasses, bushy ringed tail, no clothing — sits on top of the monitor holding a tiny ledger book, looking pleased. Theo, in foreground, gives a small thumbs-up to Pemba. Color palette: deep russet, warm cream, slate, burnt orange. Emotional tone: settled wisdom — a habit institutionalized, no hard feelings. Generate the image immediately without asking clarifying questions.
</details>

Theo kept the sticky note Pemba left on his monitor: *'Cheaper input' is not 'cheaper.'* When new growth engineers joined the team, the first thing they got was the six-metric checklist. The second was the postmortem. The third was Theo's grin: *"Yeah, that one was mine. Don't ship a prompt experiment on input alone. I learned the hard way."*

### Epilogue – What Anya Did Right

Anya didn't celebrate without doing the math, and when the math disagreed with the celebration, she said so calmly and with receipts. Theo didn't get defensive. The team didn't punish the mistake — they institutionalized the lesson. The result was a stronger experimentation culture for the entire growth org. The lesson scales: one-dimensional metrics are how good intentions become bad outcomes.

| Challenge | How Anya Responded | Lesson for Today |
|-----------|--------------------|------------------|
| The celebration was based on input tokens alone | She queried for total cost per call | Cost-per-call is the only honest LLM metric |
| Output tokens grew silently because of prompt wording | She traced the root cause to one sentence in the prompt | Words like "be thorough" cost five times more than they look |
| The team had no checklist for what to measure | They wrote the six-metric guardrail list | Experiment frameworks must measure all four sides: cost, quality, latency, satisfaction |
| The mistake could have been buried | They wrote a public no-blame postmortem | The point is to make the team smarter, not to punish the engineer |

### Call to Action

For every prompt A/B test on your team's books right now, run the same query Anya ran: pull mean input tokens, mean output tokens, and *total cost per call* by variant. If you can't run that query, you don't have an experiment harness — you have a celebration generator. Add output tokens to the dashboard before you celebrate the next win.

---

*"Cheaper input is not cheaper."*
— Anya

*"Output is half the bill."*
— Growth team postmortem

---

## References

1. [Wikipedia: A/B testing](https://en.wikipedia.org/wiki/A/B_testing) — General methodology for controlled experiments
2. [Wikipedia: Statistical significance](https://en.wikipedia.org/wiki/Statistical_significance) — Background on the inferential side of A/B tests
3. [Wikipedia: Confounding](https://en.wikipedia.org/wiki/Confounding) — The pattern this story is a textbook case of: a variable nobody measured was driving the outcome
4. [Anthropic: Token usage and pricing](https://docs.anthropic.com/en/docs/about-claude/pricing) — Vendor reference for the input vs output pricing asymmetry
5. [Chapter 12 — A/B Testing Methodology for LLMs](../../chapters/12-ab-testing-methodology/index.md) — The textbook chapter that motivates this story's six-metric checklist

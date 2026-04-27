---
title: The Wrong Model for Every Job — Building "The Menu" Cascade
description: A 7-panel graphic novel about a customer-support team that ran every email through the most expensive flagship model — and the cheap-first cascade that moved 70% of traffic to a small model with no quality regression.
image: /stories/wrong-model-every-job/cover.png
og:image: /stories/wrong-model-every-job/cover.png
twitter:image: /stories/wrong-model-every-job/cover.png
social:
   cards: false
---

# The Wrong Model for Every Job

![](./cover.png)
<details>
<summary>Cover Image Prompt</summary>
(This is the Cover Image. Do not include this label in the image.)
Please generate a wide-landscape 16:9 cover image in modern flat vector cartoon illustration style with clean lines and a playful tone. Center: a chalkboard menu titled "TODAY'S SPECIALS" mounted on a brick wall, listing three items in chunky chalk lettering: "HAIKU CLASSIFY — Cheap & Fast — used for 70% of cases," "SONNET DRAFT — Mid-tier — used when ambiguous," "OPUS RESCUE — Premium — used when confidence < 60%." Each menu item has a hand-drawn price tag in russet ink. Below the chalkboard, an engineer named Lin — East Asian woman, late 20s, glasses, denim jacket — points at the menu with a wooden spoon, while a colleague named Marco — Brazilian man, 30s, beard, plaid shirt — laughs and writes notes. Above the scene, the title text "The Wrong Model for Every Job" in bold sans-serif lettering. Color palette: deep russet (#c1440e), warm cream (#fff8e7), slate (#37474f), burnt orange (#d35400). Emotional tone: clever, warm, the joy of a good menu. Generate the image immediately without asking clarifying questions.
</details>

<details>
<summary>Narrative Prompt</summary>
This is a 7-panel educational graphic novel for the Token Optimization textbook. Setting: a fictional customer-support automation team at a mid-size e-commerce company. Art style: modern flat vector cartoon illustration with clean lines and a slight diner-menu/chalkboard motif. Characters appear consistently:

- **Lin** — senior engineer, East Asian woman, late 20s, round glasses, denim jacket over a striped tee.
- **Marco** — junior engineer, Brazilian man, 30s, neat beard, plaid button-down.
- **Pemba** — recurring red-panda mascot. Russet fur, cream belly, white facial mask with black tear marks, wire-rim glasses, bushy ringed tail. **No clothing.** Cameos in the closing panel.

Color palette: deep russet (#c1440e), warm cream (#fff8e7), slate (#37474f), burnt orange (#d35400). Maintain consistent character appearances across all 7 panels.
</details>

### Prologue – Ordering Steak for a Salad

The customer-support team's classifier — *is this email a refund, a bug report, or a sales question?* — ran on the most expensive flagship model in the catalog. Every classification cost as much as drafting an entire reply. Lin proposed a simple change: order from a menu instead of buying the chef's tasting menu for every plate. The team called it "The Menu." Within a month, seventy percent of traffic moved to a small fast model with no measurable quality drop.

## Panel 1: The Single-Model Stack

![](./panel-01.png)
<details><summary>Image Prompt</summary>
(This is Panel 01. Do not include the panel number in the image.)
I am about to ask you to generate a series of images for a graphic novel. Please make the images have a consistent style and consistent characters. Do not ask any clarifying questions. Just generate the image immediately when asked.

Please generate a 16:9 image in modern flat vector cartoon illustration style depicting panel 1 of 7. Scene: a code editor on a monitor showing a function `classify_email()` that calls the flagship model with full system prompt and a max_tokens=300. A small comment above the function reads "# TODO: revisit model choice once we're profitable." A wall calendar in the background shows "Year 2 of 'TODO'" scribbled in marker. Lin — East Asian woman, late 20s, round glasses — leans on her desk frowning at the screen. Color palette: deep russet, warm cream, slate, burnt orange. Emotional tone: the dawning of a familiar type of regret. Generate the image immediately without asking clarifying questions.
</details>

The function was named `classify_email`, and it called the most expensive model in the company's vendor account. There was a comment above it that said *# TODO: revisit model choice once we're profitable.* The comment was eighteen months old. The classifier had been running 200,000 times a day the entire time.

## Panel 2: The Cost Math

![](./panel-02.png)
<details><summary>Image Prompt</summary>
(This is Panel 02. Do not include the panel number in the image.)
Please generate a 16:9 image in modern flat vector cartoon illustration style depicting panel 2 of 7. Make the characters and style consistent with the prior panel. Scene: Lin and Marco at a small whiteboard. Lin writes a quick calculation: "200,000 calls/day × $0.015/call = $3,000/day = $90,000/month JUST for classification." Marco — Brazilian man, 30s, beard, plaid shirt — has a hand on his forehead, dramatic mock-horror expression. Lin underlines the $90,000 with a thick marker. Color palette: deep russet, warm cream, slate, burnt orange. Emotional tone: arithmetic horror — the numbers people forget to multiply out. Generate the image immediately without asking clarifying questions.
</details>

Lin did the back-of-envelope math on a Tuesday morning. *Two hundred thousand calls a day, times \$0.015, times thirty.* Marco watched the bottom line of the calculation appear and pressed both hands to his forehead. *"Ninety thousand dollars,"* he said. *"For deciding which inbox folder."*

## Panel 3: The Menu Sketch

![](./panel-03.png)
<details><summary>Image Prompt</summary>
(This is Panel 03. Do not include the panel number in the image.)
Please generate a 16:9 image in modern flat vector cartoon illustration style depicting panel 3 of 7. Make the characters and style consistent with the prior panel. Scene: a large whiteboard reimagined as a chalkboard diner menu. Title in chunky lettering: "THE MENU." Three items listed: "1. HAIKU — classify (cheap, fast, ~$0.0005/call)," "2. SONNET — draft (mid-tier, ~$0.003/call)," "3. OPUS — rescue (premium, ~$0.015/call, only when confidence < 60%)." A small flowchart on the side shows the cascade: Haiku first, escalate to Sonnet on low confidence, escalate to Opus only on Sonnet's low confidence. Lin draws; Marco watches with a delighted grin. Color palette: deep russet, warm cream, slate, burnt orange. Emotional tone: the joy of a good design idea taking shape. Generate the image immediately without asking clarifying questions.
</details>

Lin reframed the architecture as a diner menu. *Haiku for classification. Sonnet for drafting. Opus for rescue.* Three tiers. Three roles. A confidence threshold for each step of escalation. Marco grinned. *"You're calling it 'the menu.'"* Lin nodded. *"You order what the plate needs. Not the most expensive thing on the list."*

## Panel 4: The Confidence Gate

![](./panel-04.png)
<details><summary>Image Prompt</summary>
(This is Panel 04. Do not include the panel number in the image.)
Please generate a 16:9 image in modern flat vector cartoon illustration style depicting panel 4 of 7. Make the characters and style consistent with the prior panel. Scene: a code editor on a monitor showing a clean Python function with three named functions stacked: `try_haiku()`, `escalate_to_sonnet()`, `escalate_to_opus()`. The first call returns a dict with `category` and `confidence`. An if-statement on `confidence < 0.85` triggers the escalation. Marco types; Lin reads over his shoulder, holding a printout of validation accuracy at three thresholds: "0.90 → 60% Haiku," "0.85 → 70% Haiku," "0.80 → 78% Haiku." She circles 0.85 with a marker. Color palette: deep russet, warm cream, slate, burnt orange. Emotional tone: precise tuning — finding the sweet spot. Generate the image immediately without asking clarifying questions.
</details>

The hard part was picking the threshold. Too low and Haiku's mistakes leaked through. Too high and everything escalated, defeating the point. Lin ran the cascade against a 5,000-email gold-labeled set at three thresholds and circled 0.85 with a marker. *"Seventy percent of traffic stays at the cheap tier and the accuracy on Haiku-handled cases is 96.4%."* Marco nodded. *"Ship it."*

## Panel 5: The Rollout Dashboard

![](./panel-05.png)
<details><summary>Image Prompt</summary>
(This is Panel 05. Do not include the panel number in the image.)
Please generate a 16:9 image in modern flat vector cartoon illustration style depicting panel 5 of 7. Make the characters and style consistent with the prior panel. Scene: a real-time dashboard in the office showing three live gauges, one per tier. "HAIKU: 71% of traffic." "SONNET: 24%." "OPUS: 5%." A line graph below shows total daily cost dropping from $3,000 to about $700 over a week. Lin and Marco stand watching, both smiling. A few colleagues drift over with curiosity. Color palette: deep russet, warm cream, slate, burnt orange. Emotional tone: vindication in real time. Generate the image immediately without asking clarifying questions.
</details>

The cascade rolled out to 10% of traffic, then 50%, then 100% over five days. The dashboard showed the picture cleanly: 71% of classifications stayed on Haiku, 24% escalated to Sonnet, 5% reached Opus. Daily classifier cost dropped from \$3,000 to about \$700. Quality on the team's golden eval set was statistically indistinguishable from the all-Opus baseline.

## Panel 6: The Customer Test

![](./panel-06.png)
<details><summary>Image Prompt</summary>
(This is Panel 06. Do not include the panel number in the image.)
Please generate a 16:9 image in modern flat vector cartoon illustration style depicting panel 6 of 7. Make the characters and style consistent with the prior panel. Scene: a customer-support agent's screen showing two side-by-side response drafts: one labeled "BEFORE (all Opus)," one labeled "AFTER (cascade)." Both are roughly the same length and tone, both correctly categorized as a refund question. A satisfaction survey badge in the corner shows "CSAT: 4.81 → 4.83." Lin and Marco lean over the agent's shoulder, both grinning. Color palette: deep russet, warm cream, slate, burnt orange. Emotional tone: humble confirmation — the customer can't tell the difference. Generate the image immediately without asking clarifying questions.
</details>

The customers couldn't tell. CSAT went up by a rounding error — not a regression, possibly an improvement. Tickets resolved per shift held flat. The support manager pulled Lin aside and said, *"You spent two weeks making this invisible. Thank you."* Lin took the compliment and kept the receipts.

## Panel 7: The Menu on the Wall

![](./panel-07.png)
<details><summary>Image Prompt</summary>
(This is Panel 07. Do not include the panel number in the image.)
Please generate a 16:9 image in modern flat vector cartoon illustration style depicting panel 7 of 7. Make the characters and style consistent with the prior panel. Scene: the team's office wall now has a printed framed version of "The Menu" hanging next to the dashboard. Pemba — russet fur, cream belly, white facial mask, wire-rim glasses, bushy ringed tail, no clothing — sits on top of the frame holding a tiny chalkboard that reads "ORDER THE PLATE THE TASK NEEDS." Lin and Marco walk past it on their way out for coffee, both glancing up at Pemba and giving small nods. Color palette: deep russet, warm cream, slate, burnt orange. Emotional tone: institutionalized wisdom — a design pattern made permanent. Generate the image immediately without asking clarifying questions.
</details>

The menu went up on the wall in a frame. New engineers who joined the team got the menu pitch as part of orientation. Pemba — wandering in with a tiny chalkboard — added the line that became the team's motto: *Order the plate the task needs.* Six months later, the team had migrated three more features onto cascades. Total monthly LLM spend was down 62% across the whole product.

### Epilogue – What Lin Did Right

Lin didn't argue that the flagship model was wrong — it wasn't, for hard cases. She argued that *most cases aren't hard*, and the architecture should reflect that. The cascade made the easy cases cheap and reserved the expensive cases for genuine difficulty. The lesson scales beyond classification: anywhere you have a long tail of easy work mixed with a short tail of hard work, a confidence-gated cascade is the cheapest correct answer.

| Challenge | How Lin Responded | Lesson for Today |
|-----------|-------------------|------------------|
| Classification ran on the flagship model by default | Built a Haiku → Sonnet → Opus cascade with confidence gates | Pick the cheapest model that gets the answer right; escalate on doubt |
| The team didn't know what threshold to use | Ran the cascade against a labeled set at three thresholds | Confidence thresholds are a tunable — measure, don't guess |
| Quality fears blocked rollout | Validated CSAT and gold-set accuracy in a 5-day staged ramp | Cascades preserve quality when the gate is set correctly |
| The pattern wasn't named or documented | Framed the menu on the wall with the motto | A pattern with a name spreads; a pattern without one stays in one team |

### Call to Action

For every feature on your team that calls an LLM, ask one question: *what fraction of these calls genuinely need the most expensive model?* If the honest answer is "less than half," you have a Lin-shaped cascade waiting to be built. The cheap tier is faster, cheaper, and — for the easy cases — just as good. Order the plate the task needs.

---

*"You order what the plate needs. Not the most expensive thing on the list."*
— Lin

*"You spent two weeks making this invisible. Thank you."*
— support manager

---

## References

1. [Wikipedia: Cascade classifier](https://en.wikipedia.org/wiki/Cascading_classifiers) — The classical pattern this story's architecture is a token-aware cousin of
2. [Wikipedia: Statistical classification](https://en.wikipedia.org/wiki/Statistical_classification) — Background on confidence-scored classification
3. [Wikipedia: Routing](https://en.wikipedia.org/wiki/Routing) — General concept of directing requests through tiered systems
4. [Anthropic: Choosing the right model](https://docs.anthropic.com/en/docs/about-claude/models) — Vendor docs on Haiku/Sonnet/Opus tradeoffs
5. [Chapter 17 — Model Routing and Output Control](../../chapters/17-routing-output-control/index.md) — The textbook chapter that motivates this story's cascade design

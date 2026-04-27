---
title: The 4,000-Token "Be Helpful" — How One Audit Cut a System Prompt by 85%
description: An 8-panel graphic novel about a SaaS startup whose system prompt grew from a single line to a 4,000-token monster — and how one engineer's audit and a stable cache prefix cut input cost by 85% with no quality loss.
image: /stories/four-thousand-token-be-helpful/cover.png
og:image: /stories/four-thousand-token-be-helpful/cover.png
twitter:image: /stories/four-thousand-token-be-helpful/cover.png
social:
   cards: false
---

# The 4,000-Token "Be Helpful"

![](./cover.png)
<details>
<summary>Cover Image Prompt</summary>
(This is the Cover Image. Do not include this label in the image.)
Please generate a wide-landscape 16:9 cover image in modern flat vector cartoon illustration style with clean lines and a playful tone. Center: a giant scroll of text labeled "SYSTEM PROMPT" unfurling chaotically across the frame, covered in tiny lines of conflicting instructions, sticky-note patches, and crossed-out paragraphs. On the right side, a young engineer named Riya — South Asian woman, mid-20s, dark hair in a ponytail, gray hoodie — stands holding a red marker, eyebrow raised at the scroll. On the left, a tidy 600-token prompt sits in a small frame, glowing softly. Above the chaotic scroll, the title text "The 4,000-Token 'Be Helpful'" in bold sans-serif lettering. Color palette: deep russet (#c1440e), warm cream (#fff8e7), slate (#37474f), and burnt orange (#d35400). Emotional tone: bemused, curious, the calm before a satisfying cleanup. Generate the image immediately without asking clarifying questions.
</details>

<details>
<summary>Narrative Prompt</summary>
This is an 8-panel educational graphic novel for the Token Optimization textbook. Setting: a fictional two-year-old SaaS startup (~30 engineers) whose in-app assistant "Helpr" has a runaway system prompt. Art style: modern flat vector cartoon illustration with clean lines and warm flat colors. Characters appear consistently:

- **Riya** — new engineer (joined three weeks ago). South Asian woman, mid-20s, dark hair in a ponytail, gray hoodie, jeans, perpetual coffee mug.
- **Marcus** — tech lead. White man, early 40s, salt-and-pepper hair, wire-rim glasses, plaid button-down.
- **Pemba** — recurring red-panda mascot from the textbook. Russet fur, cream belly, white facial mask with black tear marks, small wire-rim engineer's glasses, bushy ringed tail. **No clothing.** Cameos in the closing panel.

Color palette: deep russet (#c1440e), warm cream (#fff8e7), slate (#37474f), burnt orange (#d35400). Maintain consistent character appearances across all 8 panels.
</details>

### Prologue – The Garage at the Bottom of the Repo

Helpr launched eighteen months ago with a system prompt that was exactly one line long: *Be helpful.* It worked beautifully. Then product asked for a tone tweak. Then legal asked for a disclaimer. Then a customer complained, and someone added a workaround. By the time Riya joined the team, the system prompt was 4,000 tokens, and every API call was paying rent on every legacy paragraph.

## Panel 1: The Pristine Beginning

![](./panel-01.png)
<details><summary>Image Prompt</summary>
(This is Panel 01. Do not include the panel number in the image.)
I am about to ask you to generate a series of images for a graphic novel. Please make the images have a consistent style and consistent characters. Do not ask any clarifying questions. Just generate the image immediately when asked.

Please generate a 16:9 image in modern flat vector cartoon illustration style depicting panel 1 of 8. Scene: an early-stage startup office, eighteen months ago, painted in slightly faded sepia tones to suggest a flashback. A single laptop on a clean desk shows a code editor with three lines of YAML visible: `system_prompt: |`, `  Be helpful.`, and a blank line. A single paper cup of coffee sits next to the laptop. Through a window, late-evening city lights twinkle. No people in this panel. Color palette: deep russet, warm cream, slate, burnt orange, with a sepia overlay for the flashback feel. Emotional tone: nostalgic, simple, the calm of a good first decision. Generate the image immediately without asking clarifying questions.
</details>

When Helpr first shipped, the system prompt was two words. *Be helpful.* The CEO loved its punk simplicity. The bill was tiny. The model produced friendly, accurate answers. For four glorious weeks, nobody touched it.

## Panel 2: The Slow Accretion

![](./panel-02.png)
<details><summary>Image Prompt</summary>
(This is Panel 02. Do not include the panel number in the image.)
Please generate a 16:9 image in modern flat vector cartoon illustration style depicting panel 2 of 8. Make the characters and style consistent with the prior panel. Scene: the same laptop, now from a montage perspective. The system prompt scroll in the editor has grown to fill the screen and overflow off the bottom — visible sections labeled with sticky-note headers like "Tone Guide v3," "Refund Policy 2024," "Don't say 'unfortunately'," "JSON example for invoice export," "EU disclaimer." Tiny figures of past engineers — six of them, each different — float around the laptop in transparent ghost form, each adding a paragraph. A wall calendar in the background flips from "Month 1" through "Month 18." Color palette: deep russet, warm cream, slate, burnt orange. Emotional tone: comically inevitable, like watching a garage fill with stuff over years. Generate the image immediately without asking clarifying questions.
</details>

Then product asked for a "warmer" tone. Then legal asked for a refund disclaimer. Then a customer sued and someone added a paragraph nobody could remove. Then a JSON example for a feature that was deprecated four months later, but the example stayed. Eighteen months. Six engineers. Forty-three commits. And one prompt that nobody dared touch.

## Panel 3: The Monster

![](./panel-03.png)
<details><summary>Image Prompt</summary>
(This is Panel 03. Do not include the panel number in the image.)
Please generate a 16:9 image in modern flat vector cartoon illustration style depicting panel 3 of 8. Make the characters and style consistent with the prior panel. Scene: present day. Riya sits at her desk, freshly arrived three weeks ago, looking up at a wall-sized monitor showing the full 4,000-token system prompt rendered as a wall of dense text — multiple competing tone instructions visible, two contradictory escalation policies highlighted in different colors, a giant block labeled "DEPRECATED — DO NOT REMOVE." Riya holds a coffee mug halfway to her mouth, frozen in mid-sip, eyes wide. A small token-counter widget in the corner reads "4,012 tokens · per call." Color palette: deep russet, warm cream, slate, burnt orange. Emotional tone: stunned awe — the moment a new hire realizes the scope of the problem. Generate the image immediately without asking clarifying questions.
</details>

Riya's third week on the team, she opened the system prompt for the first time. Four thousand tokens. Two contradictory escalation policies. A block of JSON for a feature that no longer existed. She set down her coffee very carefully and whispered, *"Oh, no."*

## Panel 4: The Diff Experiment

![](./panel-04.png)
<details><summary>Image Prompt</summary>
(This is Panel 04. Do not include the panel number in the image.)
Please generate a 16:9 image in modern flat vector cartoon illustration style depicting panel 4 of 8. Make the characters and style consistent with the prior panel. Scene: Riya at her desk with two monitors side by side. Left monitor: the full 4,000-token prompt. Right monitor: the same prompt with one large section grayed out. Between the monitors, a script terminal shows a diff of model outputs running on a 50-prompt test set, with a clear "no measurable difference" status bar. Riya leans forward, marker in hand, making a checkmark on a printed list of prompt sections. Behind her, Marcus — white man, early 40s, glasses, plaid shirt — peers over her shoulder with a curious half-smile. Color palette: deep russet, warm cream, slate, burnt orange. Emotional tone: methodical curiosity — the joy of a careful experiment. Generate the image immediately without asking clarifying questions.
</details>

Riya didn't argue with anyone. She wrote a script. For each section of the prompt, she ran the model with that section *gone* against a 50-question golden test set and diffed the answers. Marcus, drifting by with coffee, raised an eyebrow. *"You're doing what?"* — *"I'm asking the prompt to prove it's worth its tokens."*

## Panel 5: The Audit Verdict

![](./panel-05.png)
<details><summary>Image Prompt</summary>
(This is Panel 05. Do not include the panel number in the image.)
Please generate a 16:9 image in modern flat vector cartoon illustration style depicting panel 5 of 8. Make the characters and style consistent with the prior panel. Scene: a printout of the original system prompt taped across a whiteboard. Riya, marker in hand, has crossed out massive sections in bold red. A bar chart on the side reads "% of prompt with measurable effect: 40%". Marcus, leaning in, points at one crossed-out paragraph and laughs. Three other engineers stand at a respectful distance, holding mugs, watching with the cautious fascination of people seeing something they should have done years ago. Color palette: deep russet, warm cream, slate, burnt orange, with bold red ink for the crossed-out portions. Emotional tone: liberating clarity — the relief of permission to delete. Generate the image immediately without asking clarifying questions.
</details>

Sixty percent of the prompt had no measurable effect on output. *Sixty percent.* The "tone guide v3" had been silently overridden by "tone guide v5" two paragraphs down. The deprecated JSON example was not just useless — removing it slightly *improved* answer quality. Marcus stared at the whiteboard for a long time. *"We've been paying for this every single call."*

## Panel 6: The Rewrite

![](./panel-06.png)
<details><summary>Image Prompt</summary>
(This is Panel 06. Do not include the panel number in the image.)
Please generate a 16:9 image in modern flat vector cartoon illustration style depicting panel 6 of 8. Make the characters and style consistent with the prior panel. Scene: Riya and Marcus working side by side at the same desk. The monitor shows a clean, well-organized 600-token system prompt, broken into clearly labeled sections: "Identity," "Tone," "Tools," "Boundaries." A small annotation on the side reads "stable prefix: cache_control: ephemeral" with an arrow pointing to the top section. Riya types; Marcus reads aloud over her shoulder. The token-counter widget reads "612 tokens · per call." Color palette: deep russet, warm cream, slate, burnt orange. Emotional tone: focused craftsmanship — the satisfaction of writing tight code. Generate the image immediately without asking clarifying questions.
</details>

The rewrite took two days. Six hundred tokens. Identity, tone, tools, boundaries — four short sections, each one earning its space. Then they marked the stable prefix with `cache_control` and split the volatile per-user fields into the suffix, where they belonged. Marcus muttered, *"Someone should have done this on day one."* Riya, very gently, did not say *"yes."*

## Panel 7: The Numbers

![](./panel-07.png)
<details><summary>Image Prompt</summary>
(This is Panel 07. Do not include the panel number in the image.)
Please generate a 16:9 image in modern flat vector cartoon illustration style depicting panel 7 of 8. Make the characters and style consistent with the prior panel. Scene: a meeting room with a big projector screen showing a clean before/after dashboard. "Per-call input cost: $0.023 → $0.0035 (–85%)." "Cache hit rate: 0% → 91%." "Quality score on golden set: 4.62 → 4.63." Riya stands at the front, gesturing at the chart with a calm small smile. Marcus, seated, claps once and grins. Six other engineers around the table look genuinely astonished. A coffee carafe sits on the table. Color palette: deep russet, warm cream, slate, burnt orange. Emotional tone: quiet triumph — a result that speaks for itself. Generate the image immediately without asking clarifying questions.
</details>

Per-call input cost dropped eighty-five percent. Cache hit rate climbed from zero to ninety-one. Quality on the golden set went up by a rounding error — within noise, not a regression, possibly an improvement. Marcus presented the numbers to the CTO with a single line: *"We deleted text and got a faster, cheaper, slightly-better assistant."*

## Panel 8: The Sticky Note

![](./panel-08.png)
<details><summary>Image Prompt</summary>
(This is Panel 08. Do not include the panel number in the image.)
Please generate a 16:9 image in modern flat vector cartoon illustration style depicting panel 8 of 8. Make the characters and style consistent with the prior panel. Scene: Riya's monitor a week later, the clean 600-token prompt visible in the editor. Stuck to the corner of the monitor: a small russet-and-cream sticky note in hand-lettered marker that reads "AUDIT THE PROMPT EVERY QUARTER. — Pemba." Pemba the red panda — russet fur, cream belly, white facial mask with black tear marks, wire-rim glasses, bushy ringed tail, no clothing — sits on top of the monitor holding a tiny clipboard, looking pleased. Riya, in the foreground, glances up at Pemba and gives a small thumbs-up. Color palette: deep russet, warm cream, slate, burnt orange. Emotional tone: contented closure — a habit forming, a system saved. Generate the image immediately without asking clarifying questions.
</details>

Riya put a sticky note on her monitor. *Audit the prompt every quarter.* When she came in the next morning, someone had added a tiny signature in russet ink at the bottom: *— Pemba.* She smiled and left it there. The prompt would never grow back into a monster again — not on her watch.

### Epilogue – What Riya Did Right

Riya didn't argue with the prompt's contents — she argued with its *evidence*. She made the prompt prove it was worth its tokens by running a controlled test on every section, and she cached the parts that survived. The result was a faster, cheaper, slightly-better assistant. The lesson scales: any prompt older than a year is hiding dead weight, and the only way to find it is to test, not debate.

| Challenge | How Riya Responded | Lesson for Today |
|-----------|--------------------|------------------|
| The 4,000-token system prompt had grown unaudited for 18 months | She ran a per-section ablation against a golden test set | Prompts grow silently — schedule audits like you schedule deps upgrades |
| Two contradictory tone guides were both shipping on every call | She measured which (if either) actually changed output | When two instructions disagree, the model picks one; the loser is paid-for noise |
| Caching was off because the prefix was unstable | She refactored stable identity to the top, volatile fields to the suffix | Caching needs a stable prefix; the order of your prompt is a cost decision |
| The team had no habit of revisiting old prompts | She left a sticky note: "audit every quarter" | Recurring audits beat one-shot heroics — bake the cleanup into the calendar |

### Call to Action

Open the system prompt for any production feature you've inherited and count its tokens. If the number surprises you, you have a Riya-shaped audit waiting. The cheapest tokens are the ones you stop sending — and the second-cheapest are the ones you cache.

---

*"I'm asking the prompt to prove it's worth its tokens."*
— Riya

*"We deleted text and got a faster, cheaper, slightly-better assistant."*
— Marcus, tech lead

---

## References

1. [Wikipedia: Prompt engineering](https://en.wikipedia.org/wiki/Prompt_engineering) — Background on prompt design as a discipline distinct from model training
2. [Wikipedia: Cache (computing)](https://en.wikipedia.org/wiki/Cache_(computing)) — Foundational concepts behind why a stable prefix is cacheable
3. [Wikipedia: Cache invalidation](https://en.wikipedia.org/wiki/Cache_invalidation) — Why per-request volatile fields silently break caching
4. [Anthropic: Prompt Caching documentation](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching) — Vendor docs for `cache_control` and the stable-prefix/volatile-suffix pattern
5. [Chapter 13 — Prompt Engineering for Token Efficiency](../../chapters/13-prompt-engineering-tokens/index.md) — The textbook chapter that motivates this story's audit pattern

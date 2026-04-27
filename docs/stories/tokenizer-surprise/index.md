---
title: The Tokenizer Surprise — Same Prose, Different Tokens, Different Bill
description: A 7-panel graphic novel about a copy-generation team that estimated their cross-vendor migration with the wrong tokenizer and came in 30% over budget — and the per-vendor cost model they built so it never happened again.
image: /stories/tokenizer-surprise/cover.png
og:image: /stories/tokenizer-surprise/cover.png
twitter:image: /stories/tokenizer-surprise/cover.png
social:
   cards: false
---

# The Tokenizer Surprise

![](./cover.png)
<details>
<summary>Cover Image Prompt</summary>
(This is the Cover Image. Do not include this label in the image.)
Please generate a wide-landscape 16:9 cover image in modern flat vector cartoon illustration style with clean lines and a forensic mood. Center: a single block of marketing copy is being fed into two different tokenizers, depicted as cartoon "kitchen blenders" labeled "TOKENIZER A" and "TOKENIZER B." Both produce tokens at different rates — Tokenizer B noticeably more — and the totals are visible: "A: 410 tokens" vs "B: 538 tokens." A thought bubble between the two reads "+31%." To the right, an engineer named Priya — Indian-American woman, late 30s, glasses, oversized blazer — looks at the comparison with a wry expression. Above the scene, the title text "The Tokenizer Surprise" in bold sans-serif lettering. Color palette: deep russet (#c1440e), warm cream (#fff8e7), slate (#37474f), burnt orange (#d35400). Emotional tone: dry, resigned amusement — the lesson everyone learns once. Generate the image immediately without asking clarifying questions.
</details>

<details>
<summary>Narrative Prompt</summary>
This is a 7-panel educational graphic novel for the Token Optimization textbook. Setting: a fictional consumer-tech company's content/copy team migrating their copy-generation feature from one LLM vendor to another. Art style: modern flat vector cartoon illustration with clean lines and a slight forensic mood. Characters appear consistently:

- **Priya** — content-platform engineering lead, Indian-American woman, late 30s, glasses, oversized blazer over a tee.
- **Will** — junior engineer, white man, mid-20s, navy beanie, hoodie, denim jacket.
- **Pemba** — recurring red-panda mascot. Russet fur, cream belly, white facial mask with black tear marks, wire-rim glasses, bushy ringed tail. **No clothing.** Cameos in the closing panel.

Color palette: deep russet (#c1440e), warm cream (#fff8e7), slate (#37474f), burnt orange (#d35400). Maintain consistent character appearances across all 7 panels.
</details>

### Prologue – The Estimate That Wasn't

The team was migrating their copy-generation feature from Vendor A to Vendor B for a 28% headline price reduction. Priya did the math the way a careful engineer does: she counted tokens on a representative sample of prompts using *Vendor A's tokenizer* — the one she had on her laptop — and projected the new bill. The first weekly invoice came in 30% *over* the projection. The headline price was real. The token count was not.

## Panel 1: The Migration Plan

![](./panel-01.png)
<details><summary>Image Prompt</summary>
(This is Panel 01. Do not include the panel number in the image.)
I am about to ask you to generate a series of images for a graphic novel. Please make the images have a consistent style and consistent characters. Do not ask any clarifying questions. Just generate the image immediately when asked.

Please generate a 16:9 image in modern flat vector cartoon illustration style depicting panel 1 of 7. Scene: a planning meeting in a small conference room. Priya — Indian-American woman, late 30s, glasses, oversized blazer — stands at a whiteboard with a clean migration plan: "VENDOR A → VENDOR B. Headline price: -28%. Estimated savings: $24K/quarter. Risk: low." Will — white man, mid-20s, navy beanie, hoodie — takes notes at the table. Three other engineers nod approvingly. The whiteboard is tidy and confident. Color palette: deep russet, warm cream, slate, burnt orange. Emotional tone: confident planning — a careful migration with a clean ROI. Generate the image immediately without asking clarifying questions.
</details>

The plan was solid. Vendor B was 28% cheaper per million tokens. Priya counted tokens on a representative sample of fifty prompts using the tokenizer library she had on her laptop. *24,000 dollars in projected quarterly savings.* The team voted to migrate. Will built the integration in two weeks. They cut over on a Friday at noon.

## Panel 2: The First Invoice

![](./panel-02.png)
<details><summary>Image Prompt</summary>
(This is Panel 02. Do not include the panel number in the image.)
Please generate a 16:9 image in modern flat vector cartoon illustration style depicting panel 2 of 7. Make the characters and style consistent with the prior panel. Scene: Priya at her desk, eight days after the migration, looking at the first weekly invoice from Vendor B. The invoice line shows a number 30% larger than her projection. A small comparison sticker on the side reads "PROJECTED: $4,300 — ACTUAL: $5,590." Priya holds her chin, brow furrowed. Will, drifting in with a coffee, sees the screen and stops mid-step. Color palette: deep russet, warm cream, slate, burnt orange. Emotional tone: confused dismay — a careful plan running into reality. Generate the image immediately without asking clarifying questions.
</details>

The first weekly invoice came back \$5,590 against a \$4,300 projection. Thirty percent over. *That's not noise*, Priya thought. She pulled the per-call usage data from Vendor B's response objects and started running queries. By the end of the afternoon she had a hypothesis. She did not yet have receipts.

## Panel 3: The Side-by-Side

![](./panel-03.png)
<details><summary>Image Prompt</summary>
(This is Panel 03. Do not include the panel number in the image.)
Please generate a 16:9 image in modern flat vector cartoon illustration style depicting panel 3 of 7. Make the characters and style consistent with the prior panel. Scene: a Jupyter notebook on Priya's monitor running the same 50-prompt sample through *both* vendors' tokenizers. Two columns of token counts, side by side. The "Vendor A tokenizer" column averages around 410 tokens; the "Vendor B tokenizer" column averages around 538. The right column has a clear systematic bias upward — especially on prompts with emoji, code blocks, and brand names. A scatter chart at the bottom labels three outlier prompts. Color palette: deep russet, warm cream, slate, burnt orange. Emotional tone: forensic clarity — the data resolving the mystery. Generate the image immediately without asking clarifying questions.
</details>

The notebook told a clean story. The same fifty prompts produced systematically more tokens under Vendor B's tokenizer. The outliers had a pattern: prompts heavy with emoji, with fenced code blocks, with brand names. The team's copy was *full* of those — emoji in social-media variants, code in developer-targeted copy, brand names everywhere. Vendor A's tokenizer happened to handle those efficiently. Vendor B's didn't.

## Panel 4: The Three Hot Spots

![](./panel-04.png)
<details><summary>Image Prompt</summary>
(This is Panel 04. Do not include the panel number in the image.)
Please generate a 16:9 image in modern flat vector cartoon illustration style depicting panel 4 of 7. Make the characters and style consistent with the prior panel. Scene: a whiteboard with three labeled hot-spots: "1. EMOJI — average 4 tokens each (vs 1 on Vendor A)," "2. CODE BLOCKS — fenced code splits aggressively," "3. BRAND NAMES — proper nouns split into more pieces." Below: three corresponding fixes: "Reduce emoji frequency in copy," "Wrap code in CDATA-style markers tested against Vendor B," "Pre-tokenize brand names with custom dictionary if vendor supports it." Will writes; Priya reads aloud, finger tracing each line. Color palette: deep russet, warm cream, slate, burnt orange. Emotional tone: confident triage — three concrete moves. Generate the image immediately without asking clarifying questions.
</details>

The three hot spots had three matching fixes. Trim emoji where they didn't earn their place — most of them didn't. Reformat code-block markers to match Vendor B's tokenizer's preferences, which Will found documented in a community blog post nobody had thought to check before the migration. Use Vendor B's optional custom-vocabulary feature for the company's six core brand names. None of these were architectural changes. All of them were minutes of work.

## Panel 5: The Rebuilt Cost Model

![](./panel-05.png)
<details><summary>Image Prompt</summary>
(This is Panel 05. Do not include the panel number in the image.)
Please generate a 16:9 image in modern flat vector cartoon illustration style depicting panel 5 of 7. Make the characters and style consistent with the prior panel. Scene: a clean Python notebook on a monitor implementing a `cross_vendor_cost_model.py` function that takes a prompt and returns token counts and cost projections from each vendor's *own* tokenizer. Priya runs a quick test against the 50-prompt sample, with the new "tokenizer-drift" line item visible in the output: "Vendor A: $4,210 / Vendor B: $5,120 / Drift: +21%." Will leans in, writing the file path on a sticky note for the team wiki. Color palette: deep russet, warm cream, slate, burnt orange. Emotional tone: methodical repair — building the tool that should have existed all along. Generate the image immediately without asking clarifying questions.
</details>

The lasting fix was the cost model. Priya rewrote the migration calculator to use *each vendor's own tokenizer* on the same input sample, surface the per-vendor counts side by side, and add a *tokenizer-drift* line item to every cross-vendor proposal from then on. The tool became part of the team's standard procurement review. Two months later, it caught a 14% drift on a smaller migration before anyone signed a contract.

## Panel 6: The Optimization Wins

![](./panel-06.png)
<details><summary>Image Prompt</summary>
(This is Panel 06. Do not include the panel number in the image.)
Please generate a 16:9 image in modern flat vector cartoon illustration style depicting panel 6 of 7. Make the characters and style consistent with the prior panel. Scene: a clean dashboard showing weekly cost over six weeks. Week 1 (Vendor A baseline): $4,300. Week 2 (post-migration, before optimizations): $5,590. Weeks 3-6: a steady decline as the three fixes ship — emoji trim, code-block reformat, brand custom vocab — settling at $3,910 by week 6. A small label reads "Final: 9% under original Vendor A cost." Priya and Will, in the foreground, raise mugs in a small toast. Color palette: deep russet, warm cream, slate, burnt orange. Emotional tone: vindicated patience — the migration was fine; the estimate was the problem. Generate the image immediately without asking clarifying questions.
</details>

By week six, all three fixes had shipped. The dashboard told the recovery story cleanly: Vendor A baseline at \$4,300, post-migration spike to \$5,590, steady decline to \$3,910 — nine percent below the original Vendor A cost, with the same quality scores. The 28% headline price reduction was real. It just had to come through the right tokenizer to get to the bottom line.

## Panel 7: The Procurement Footnote

![](./panel-07.png)
<details><summary>Image Prompt</summary>
(This is Panel 07. Do not include the panel number in the image.)
Please generate a 16:9 image in modern flat vector cartoon illustration style depicting panel 7 of 7. Make the characters and style consistent with the prior panel. Scene: a clean one-page procurement-review template printed and pinned above Priya's desk. The template lists four required line items: "1. Headline price comparison. 2. Tokenizer-drift estimate (per vendor's own tokenizer). 3. Hot-spot review (emoji / code / brand names). 4. Pilot week before full cutover." Pemba — russet fur, cream belly, white facial mask, wire-rim glasses, bushy ringed tail, no clothing — sits on top of the printed template holding a tiny ruler with a small thought bubble that reads "count with the tool you'll ship on." Priya, in foreground, taps the template approvingly. Color palette: deep russet, warm cream, slate, burnt orange. Emotional tone: settled wisdom — a checklist that survives team turnover. Generate the image immediately without asking clarifying questions.
</details>

Priya printed the four-line procurement template and pinned it above her desk. *Headline price. Tokenizer drift. Hot-spot review. Pilot week.* When new engineers started, they got the template and the story behind it. Pemba — wandering in with a tiny ruler — added the line that became the team's procurement motto: *Count with the tool you'll ship on, not the one you happen to know.* No vendor migration was ever planned without it again.

### Epilogue – What Priya Did Right

Priya did the migration math the way a careful engineer does — and discovered that careful, with the wrong tokenizer, is still wrong. Her real win was the recovery: a per-vendor cost-modeling tool that turned a one-time embarrassment into a permanent procurement check. The lesson scales: token counts are vendor-specific, and any cross-vendor estimate built on the wrong tokenizer is a guess wearing a confidence interval.

| Challenge | How Priya Responded | Lesson for Today |
|-----------|---------------------|------------------|
| Migration estimated with the wrong tokenizer came in 30% over | Ran the same prompts through *both* vendors' tokenizers | Token counts are not portable across vendors |
| Hot-spots (emoji, code, brand names) tokenized very differently | Trimmed emoji, reformatted code, added custom vocab for brands | Audit your prompts for vendor-specific tokenization hot-spots |
| The cost model that produced the bad estimate still existed | Rewrote it as a per-vendor model with explicit drift line | A cost model is a tool — keep it as carefully as you keep your code |
| The team had no procurement checklist | Wrote and pinned the four-line template | Cross-vendor migrations need a checklist, every time |

### Call to Action

Before any cross-vendor migration, run your top fifty production prompts through *both* vendors' tokenizers and record the per-prompt counts side by side. Add a *tokenizer-drift* line to your cost model. If the drift is over 5%, find the hot-spots — emoji, code, brand names, special characters — and decide whether to reformat or accept the cost. Don't sign the contract on the wrong tokenizer's count.

---

*"That's not noise."*
— Priya, on the first invoice

*"Count with the tool you'll ship on, not the one you happen to know."*
— Pemba

---

## References

1. [Wikipedia: Byte pair encoding](https://en.wikipedia.org/wiki/Byte_pair_encoding) — The general algorithm that underlies most modern LLM tokenizers
2. [Wikipedia: Lexical analysis](https://en.wikipedia.org/wiki/Lexical_analysis) — The classical computer-science view of tokenization
3. [OpenAI: tiktoken](https://github.com/openai/tiktoken) — One vendor's open-source tokenizer; useful for understanding why counts differ
4. [Anthropic: Token counting](https://docs.anthropic.com/en/api/messages-count-tokens) — Vendor docs for the dedicated token-counting endpoint that should be used for cost modeling
5. [Chapter 2 — Sampling, Tokenization, and Embeddings](../../chapters/02-sampling-tokenization-embeddings/index.md) — The textbook chapter that motivates this story's per-vendor tokenizer discipline

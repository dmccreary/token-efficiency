---
title: The Cache That Wasn't — Why a Single Timestamp Killed a 0% Cache Hit Rate
description: An 8-panel graphic novel about a fintech team that turned on prompt caching, celebrated, and then discovered two weeks later that a per-request timestamp at the top of every prompt had silently kept the hit rate at zero.
image: /stories/cache-that-wasnt/cover.png
og:image: /stories/cache-that-wasnt/cover.png
twitter:image: /stories/cache-that-wasnt/cover.png
social:
   cards: false
---

# The Cache That Wasn't

![](./cover.png)
<details>
<summary>Cover Image Prompt</summary>
(This is the Cover Image. Do not include this label in the image.)
Please generate a wide-landscape 16:9 cover image in modern flat vector cartoon illustration style with clean lines and a noir-inflected mood. Center: a giant locked padlock labeled "PROMPT CACHE" hangs over a pile of dollar bills. A single tiny timestamp sticker — "2026-04-26T17:33:01Z" — is wedged into the keyhole, preventing the lock from closing. To the right, an engineer named Devon — Black man, late 30s, neat beard, navy hoodie, wireless earbuds — stares thoughtfully at the keyhole holding a magnifying glass. Above the scene, the title text "The Cache That Wasn't" in bold sans-serif lettering with a subtle motion-blur effect. Color palette: deep russet (#c1440e), warm cream (#fff8e7), slate (#37474f), burnt orange (#d35400). Emotional tone: detective-story curiosity, a mystery about to crack. Generate the image immediately without asking clarifying questions.
</details>

<details>
<summary>Narrative Prompt</summary>
This is an 8-panel educational graphic novel for the Token Optimization textbook. Setting: a fictional mid-size fintech company, fraud-review team, six months in production. Art style: modern flat vector cartoon illustration with clean lines, slight noir mood. Characters appear consistently:

- **Devon** — senior engineer on the fraud-review team. Black man, late 30s, neat beard, navy hoodie, wireless earbuds, always carrying a small notebook.
- **Aiko** — junior engineer who set up the original caching call. Japanese-American woman, late 20s, short black hair, denim jacket over a white tee.
- **Pemba** — recurring red-panda mascot. Russet fur, cream belly, white facial mask with black tear marks, wire-rim glasses, bushy ringed tail. **No clothing.** Cameos in the closing panel.

Color palette: deep russet (#c1440e), warm cream (#fff8e7), slate (#37474f), burnt orange (#d35400). Maintain consistent character appearances across all 8 panels.
</details>

### Prologue – The Celebration That Wasn't Earned

The fraud-review team flipped on Anthropic's prompt caching, watched their dashboard for an hour, and went home. Slack got a celebratory post. The next month's bill was *exactly* what it had been before. Two weeks later, Devon went looking for the missing savings — and found that the cache had been technically working, technically billing, and technically empty.

## Panel 1: The Slack Celebration

![](./panel-01.png)
<details><summary>Image Prompt</summary>
(This is Panel 01. Do not include the panel number in the image.)
I am about to ask you to generate a series of images for a graphic novel. Please make the images have a consistent style and consistent characters. Do not ask any clarifying questions. Just generate the image immediately when asked.

Please generate a 16:9 image in modern flat vector cartoon illustration style depicting panel 1 of 8. Scene: a Slack channel #fraud-review-team displayed on a wide monitor. The most recent message reads "🎉 PROMPT CACHING IS LIVE — projected 50% input cost reduction! Going home, see you Monday." with five party emoji reactions. Aiko — Japanese-American woman, late 20s, short black hair, denim jacket over a white tee — stands by the monitor giving a thumbs-up to a colleague off-screen, smiling. The office is otherwise empty, end-of-Friday late-evening lighting through the windows. Color palette: deep russet, warm cream, slate, burnt orange. Emotional tone: confident triumph — premature, but everyone believes it. Generate the image immediately without asking clarifying questions.
</details>

Aiko shipped the prompt-caching change on a Friday afternoon. Two lines of code, a `cache_control` block on the system prompt, a quick smoke test, a celebratory Slack post: *50% cost reduction, see you Monday.* She closed her laptop, grabbed her coat, and went out for tacos. The team was very pleased.

## Panel 2: Two Weeks Later

![](./panel-02.png)
<details><summary>Image Prompt</summary>
(This is Panel 02. Do not include the panel number in the image.)
Please generate a 16:9 image in modern flat vector cartoon illustration style depicting panel 2 of 8. Make the characters and style consistent with the prior panel. Scene: a finance dashboard displayed on a monitor in a quiet office two weeks later. The dashboard shows a flat input-cost line with no drop visible — same as before caching was enabled. A sticky note on the side of the monitor reads "WHY?" in bold marker. Devon — Black man, late 30s, neat beard, navy hoodie, wireless earbuds — sits cross-legged in his office chair, leaning forward, brow furrowed. Color palette: deep russet, warm cream, slate, burnt orange. Emotional tone: confused, professional concern — something is off. Generate the image immediately without asking clarifying questions.
</details>

Two weeks later, Devon was reviewing the monthly cost report and stopped mid-sip. The input-cost line was *exactly* where it had been before caching went live. No drop. No bend. Not even a wiggle. He pulled out his notebook and wrote one word: *Why?*

## Panel 3: Pulling the Logs

![](./panel-03.png)
<details><summary>Image Prompt</summary>
(This is Panel 03. Do not include the panel number in the image.)
Please generate a 16:9 image in modern flat vector cartoon illustration style depicting panel 3 of 8. Make the characters and style consistent with the prior panel. Scene: Devon's monitor shows a SQL query executing against the structured-logging table, with results visible. The result column "cache_read_input_tokens" is filled with zeros for every single row, all the way down. Devon's expression has shifted from puzzled to dead-serious. He takes a slow sip of coffee, eyes locked on the screen. Color palette: deep russet, warm cream, slate, burnt orange, with the row of zeros highlighted in subtle red. Emotional tone: the chill of a confirmed suspicion. Generate the image immediately without asking clarifying questions.
</details>

He pulled the structured logs and ran a one-line query: *select cache_read_input_tokens from llm_calls limit 100.* The column came back full of zeros. Every row. Every single call for two weeks. The cache was *technically working* — and reading *nothing.*

## Panel 4: The Smoking Gun

![](./panel-04.png)
<details><summary>Image Prompt</summary>
(This is Panel 04. Do not include the panel number in the image.)
Please generate a 16:9 image in modern flat vector cartoon illustration style depicting panel 4 of 8. Make the characters and style consistent with the prior panel. Scene: a code editor on Devon's monitor showing the system prompt builder function. The first three lines are highlighted with a glowing red box: a generated ISO-8601 timestamp at the very top, then a UUID, then "You are a fraud-review assistant..." Devon points at the screen with a pen, eyes wide. A speech bubble from his mouth reads "There you are." Behind him, the office wall has a printed Anthropic caching docs page taped to it with a hand-circled paragraph saying "the cached prefix must be byte-for-byte identical." Color palette: deep russet, warm cream, slate, burnt orange. Emotional tone: detective triumph — the moment the case cracks. Generate the image immediately without asking clarifying questions.
</details>

He scrolled to the prompt-builder function and froze. The very first line was a freshly-generated timestamp. The second line was a per-request UUID. *Every single cache key was unique.* Six months of fraud-review calls had been hashing those two volatile fields straight into the prefix, and the cache had been politely storing entries it would never, ever match.

## Panel 5: Aiko's Face

![](./panel-05.png)
<details><summary>Image Prompt</summary>
(This is Panel 05. Do not include the panel number in the image.)
Please generate a 16:9 image in modern flat vector cartoon illustration style depicting panel 5 of 8. Make the characters and style consistent with the prior panel. Scene: a video call window on Devon's monitor. Aiko is on screen at her home office, holding a takeout coffee, hand frozen halfway to her mouth, eyes wide as Devon shares his screen showing the timestamp at the top of the prompt. A small chat bubble in the corner reads "oh no." Devon, off-camera in the foreground, has a sympathetic but amused expression. Color palette: deep russet, warm cream, slate, burnt orange. Emotional tone: the universal "oh no" of recognizing your own mistake — kindly held. Generate the image immediately without asking clarifying questions.
</details>

Devon called Aiko. He didn't lecture. He just shared his screen and watched her face. *"Oh no,"* she whispered, and started laughing, the helpless laugh of a person seeing exactly how it had happened. *"I added the timestamp for traceability. I added it BEFORE the system prompt because the helper function appended it on the way in."* Devon nodded. *"Easiest fix in the world."*

## Panel 6: The Refactor

![](./panel-06.png)
<details><summary>Image Prompt</summary>
(This is Panel 06. Do not include the panel number in the image.)
Please generate a 16:9 image in modern flat vector cartoon illustration style depicting panel 6 of 8. Make the characters and style consistent with the prior panel. Scene: a clean diff view on a monitor showing the refactor. The "before" side shows the timestamp and UUID at the top of the prompt followed by the static system message. The "after" side shows the static system message at the top with `cache_control: ephemeral`, followed by a clearly-labeled volatile suffix containing the timestamp and UUID. Devon and Aiko sit side by side, Aiko typing, Devon pointing at the cache_control marker. A small banner across the top of the monitor reads "STABLE PREFIX → VOLATILE SUFFIX." Color palette: deep russet, warm cream, slate, burnt orange. Emotional tone: collaborative repair — two engineers fixing a thing together. Generate the image immediately without asking clarifying questions.
</details>

The fix was thirty lines of code. Move the static system prompt to the top, mark it `cache_control: ephemeral`, push the timestamp and UUID into a clearly-labeled volatile suffix that comes *after* the cached block. Aiko typed. Devon read aloud over her shoulder. They shipped it before lunch. Then they waited.

## Panel 7: The Hit Rate Climbs

![](./panel-07.png)
<details><summary>Image Prompt</summary>
(This is Panel 07. Do not include the panel number in the image.)
Please generate a 16:9 image in modern flat vector cartoon illustration style depicting panel 7 of 8. Make the characters and style consistent with the prior panel. Scene: a real-time dashboard the next morning showing the cache hit rate climbing — a clean line graph rising from 0% at the deploy time to 94% twelve hours later. A new dashboard panel labeled "CACHE HIT RATE — THRESHOLD ALERT" is visible in the corner with a green checkmark. Devon and Aiko stand together at the monitor, both grinning, fist-bumping. A few colleagues in the background look up curiously. Color palette: deep russet, warm cream, slate, burnt orange. Emotional tone: vindication — the savings were always there, waiting. Generate the image immediately without asking clarifying questions.
</details>

By the next morning, the hit rate was climbing. Eight in the morning: 47%. Noon: 78%. End of day: 94%. The bill bent visibly within the first 24 hours. Aiko added a permanent dashboard panel for cache hit rate with an alert: *if this number ever drops below 60% again, page someone.* Some lessons only need to be learned once.

## Panel 8: Pemba's Footnote

![](./panel-08.png)
<details><summary>Image Prompt</summary>
(This is Panel 08. Do not include the panel number in the image.)
Please generate a 16:9 image in modern flat vector cartoon illustration style depicting panel 8 of 8. Make the characters and style consistent with the prior panel. Scene: a laptop on Devon's desk shows a draft team postmortem document titled "Caching Incident — Two Weeks of Free Money Left on Floor." At the bottom of the document, in italics: "Lesson: a cache key is only as stable as its first byte." A small red-panda mascot — Pemba, russet fur, cream belly, white facial mask with black tear marks, wire-rim glasses, bushy ringed tail, no clothing — sits on top of the laptop holding a tiny stopwatch, glasses glinting, with a small thought bubble that reads "measure first." Color palette: deep russet, warm cream, slate, burnt orange. Emotional tone: warm closure with a wink — a habit being formed. Generate the image immediately without asking clarifying questions.
</details>

Devon wrote the postmortem in one sentence: *A cache key is only as stable as its first byte.* He pinned it to the top of the team wiki. Pemba, perched on the corner of the laptop with a tiny stopwatch, added an italicized footnote: *Measure first. Celebrate after.* The team retired the original Slack post.

### Epilogue – What Devon Did Right

Devon didn't trust the deploy. He trusted the dashboard — and when the dashboard didn't move, he refused to let the absence of evidence become evidence of absence. The right metric was already in the response (`cache_read_input_tokens`); it just wasn't being watched. The lesson scales to every cache, every cost optimization, every "we shipped it" moment: until you measure the effect, you don't have one.

| Challenge | How Devon Responded | Lesson for Today |
|-----------|--------------------|------------------|
| Caching was technically enabled but the hit rate was zero | He pulled the structured logs and queried `cache_read_input_tokens` | A response field that nobody reads is not a metric — it's a rumor |
| A volatile timestamp sat above the static prompt | He moved the stable prefix to the top, marked it `cache_control` | Cache prefixes must be byte-for-byte stable; the order of fields is a cost decision |
| The original deploy was celebrated without verification | He added a permanent hit-rate dashboard panel with an alert | Caching deserves an alarm, not a Slack post |
| The team had no postmortem habit for silent failures | He wrote a one-sentence wiki entry and pinned it | Silent failures need loud writeups, even when nothing crashed |

### Call to Action

If your team has prompt caching enabled, run one query right now: pull `cache_read_input_tokens` from your last 1,000 calls. If the average is zero, you have a Devon-shaped mystery to solve. The savings have been there the whole time — they're just sitting on the wrong side of an unstable prefix.

---

*"A cache key is only as stable as its first byte."*
— Devon

*"I added the timestamp for traceability. I added it before the prompt because the helper function appended it on the way in."*
— Aiko, junior engineer

---

## References

1. [Wikipedia: Cache (computing)](https://en.wikipedia.org/wiki/Cache_(computing)) — Foundational concepts of cache lookup and key matching
2. [Wikipedia: Cache invalidation](https://en.wikipedia.org/wiki/Cache_invalidation) — The "two hard things" problem that this story is a special case of
3. [Wikipedia: Hash function](https://en.wikipedia.org/wiki/Hash_function) — Why a single byte change in the prefix produces a different cache key
4. [Anthropic: Prompt Caching documentation](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching) — The `cache_control` parameter and the byte-for-byte stable-prefix requirement
5. [Chapter 14 — Prompt Caching Patterns](../../chapters/14-prompt-caching-patterns/index.md) — The textbook chapter covering cache hit rate, stable prefixes, and silent regressions

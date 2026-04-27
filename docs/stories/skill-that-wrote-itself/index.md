---
title: The Skill That Wrote Itself — Refactoring Prose Into Scripts
description: A 7-panel graphic novel about an internal-tools team whose 8,000-token release-notes Skill was making the model regenerate the same deterministic logic on every call — and the script-backed rewrite that cut tokens 32% and made the output more consistent.
image: /stories/skill-that-wrote-itself/cover.png
og:image: /stories/skill-that-wrote-itself/cover.png
twitter:image: /stories/skill-that-wrote-itself/cover.png
social:
   cards: false
---

# The Skill That Wrote Itself

![](./cover.png)
<details>
<summary>Cover Image Prompt</summary>
(This is the Cover Image. Do not include this label in the image.)
Please generate a wide-landscape 16:9 cover image in modern flat vector cartoon illustration style with clean lines and a craftsmanship mood. Center: a large open notebook split down the middle. The left page shows a wall of dense prose labeled "SKILL.md (8,000 tokens)" with paragraphs of step-by-step instructions. The right page shows a clean Python script labeled "format_release_notes.py (60 lines)" — short, neat, with a small "TESTABLE" badge. Between the pages, an arrow labeled "MOVE THE DETERMINISTIC PARTS." To the right, an engineer named Jordan — non-binary, brown skin, short locs, vintage band t-shirt — refactors with a smile. Above the scene, the title text "The Skill That Wrote Itself" in bold sans-serif lettering. Color palette: deep russet (#c1440e), warm cream (#fff8e7), slate (#37474f), burnt orange (#d35400). Emotional tone: focused craftsmanship — the satisfaction of factoring out duplication. Generate the image immediately without asking clarifying questions.
</details>

<details>
<summary>Narrative Prompt</summary>
This is a 7-panel educational graphic novel for the Token Optimization textbook. Setting: a fictional internal-tools team at a mid-size software company. Art style: modern flat vector cartoon illustration with clean lines and a craftsmanship mood. Characters appear consistently:

- **Jordan** — internal-tools engineer, non-binary, brown skin, short locs, vintage band t-shirt, perpetually amused expression.
- **Sam** — team lead, Korean-American, late 30s, glasses, cardigan over a button-down.
- **Pemba** — recurring red-panda mascot. Russet fur, cream belly, white facial mask with black tear marks, wire-rim glasses, bushy ringed tail. **No clothing.** Cameos in the closing panel.

Color palette: deep russet (#c1440e), warm cream (#fff8e7), slate (#37474f), burnt orange (#d35400). Maintain consistent character appearances across all 7 panels.
</details>

### Prologue – Asking the Model to Do Long Division

The team's "release-notes generator" Skill was 8,000 tokens of careful, well-written prose. *Step one: parse the changelog format. Step two: extract the version, date, and contributor list. Step three: sort entries by component...* Each step was deterministic. Each step was a perfect little algorithm. And the model was being asked to *generate* that algorithm, token-by-token, on every single invocation.

## Panel 1: The Skill in Action

![](./panel-01.png)
<details><summary>Image Prompt</summary>
(This is Panel 01. Do not include the panel number in the image.)
I am about to ask you to generate a series of images for a graphic novel. Please make the images have a consistent style and consistent characters. Do not ask any clarifying questions. Just generate the image immediately when asked.

Please generate a 16:9 image in modern flat vector cartoon illustration style depicting panel 1 of 7. Scene: a code editor on a monitor showing the "release-notes" Skill running in a harness. The right side of the screen displays the Skill body — visibly long, 8,000-token block of prose, scrolling. The left side shows the model dutifully producing the same date-sorting logic that the Skill described in prose. A token counter widget reads "Tokens this invocation: 11,847." Jordan — non-binary, brown skin, short locs, vintage band t-shirt — leans forward, head tilted, frowning at the screen. Color palette: deep russet, warm cream, slate, burnt orange. Emotional tone: dawning recognition — something is wrong, but elegantly. Generate the image immediately without asking clarifying questions.
</details>

Jordan was watching the release-notes Skill run for the third time that week. Same input format, same parsing, same sort, same output. Eleven thousand tokens per invocation. *"It's writing the same code every time,"* Jordan muttered. *"The Skill describes the algorithm. The model implements the algorithm. From scratch. Every. Single. Time."*

## Panel 2: The Audit

![](./panel-02.png)
<details><summary>Image Prompt</summary>
(This is Panel 02. Do not include the panel number in the image.)
Please generate a 16:9 image in modern flat vector cartoon illustration style depicting panel 2 of 7. Make the characters and style consistent with the prior panel. Scene: Jordan at a whiteboard, marker in hand, decomposing the Skill body into two columns. Left column header: "BELONGS IN PROSE (judgment)." Right column header: "BELONGS IN A SCRIPT (deterministic)." The deterministic column is full: parse, extract, sort, group, format. The prose column has only two items: "decide tone for breaking-change callouts," "summarize each entry to one line." Sam — Korean-American, late 30s, glasses, cardigan — leans against a desk, arms folded, nodding. Color palette: deep russet, warm cream, slate, burnt orange. Emotional tone: clear-eyed analysis — the moment a refactor design crystallizes. Generate the image immediately without asking clarifying questions.
</details>

Jordan split the Skill body into two columns. *Belongs in prose: tone judgments, one-line summarization, the human stuff.* *Belongs in a script: parsing, extracting, sorting, grouping, formatting, the math stuff.* The math stuff was 80% of the prose. Sam, the team lead, watched and nodded slowly. *"You want to ship a Python file alongside the Skill, don't you."* Jordan grinned. *"I want the Skill to *call* the Python file."*

## Panel 3: The Refactor

![](./panel-03.png)
<details><summary>Image Prompt</summary>
(This is Panel 03. Do not include the panel number in the image.)
Please generate a 16:9 image in modern flat vector cartoon illustration style depicting panel 3 of 7. Make the characters and style consistent with the prior panel. Scene: a code editor showing two files side by side. Left file: the new Skill body, dramatically shortened — about 30 lines of trigger description and high-level guidance ending with `python format_release_notes.py changelog.md`. Right file: a clean 60-line `format_release_notes.py` with type hints and three small functions. A unit-test runner at the bottom shows 14 tests passing in green. Jordan types calmly. Color palette: deep russet, warm cream, slate, burnt orange. Emotional tone: focused craftsmanship — the joy of factoring duplication. Generate the image immediately without asking clarifying questions.
</details>

The rewrite took an afternoon. The new Skill was thirty lines: a trigger description, a brief role explanation, an instruction to call `format_release_notes.py changelog.md`, and a few sentences about the *judgment* portions the model still owned. The script was sixty lines of testable Python with fourteen unit tests. Jordan ran it. The output was identical to the old Skill's output, except the date format never drifted between runs.

## Panel 4: The Token Math

![](./panel-04.png)
<details><summary>Image Prompt</summary>
(This is Panel 04. Do not include the panel number in the image.)
Please generate a 16:9 image in modern flat vector cartoon illustration style depicting panel 4 of 7. Make the characters and style consistent with the prior panel. Scene: a clean before/after dashboard chart on a monitor titled "RELEASE-NOTES SKILL — TOKEN USAGE." Two horizontal bars: "BEFORE — 11,847 tokens / invocation" and "AFTER — 8,058 tokens / invocation." A label between them reads "−32% per call." Jordan and Sam stand together looking at the screen. Sam holds a printout of the unit test results showing 14/14 passing. Color palette: deep russet, warm cream, slate, burnt orange. Emotional tone: vindicated craftsmanship — measurable proof of taste. Generate the image immediately without asking clarifying questions.
</details>

Per-invocation tokens dropped 32%. Eight thousand tokens of detailed prose became thirty lines of trigger description plus sixty lines of script. The model was no longer being asked to do long division in its head. Sam pulled up the team's weekly Skill-usage report and traced where the savings would compound: the release-notes Skill ran 380 times a week. *"That's a couple thousand dollars a year by hand."*

## Panel 5: The Consistency Bonus

![](./panel-05.png)
<details><summary>Image Prompt</summary>
(This is Panel 05. Do not include the panel number in the image.)
Please generate a 16:9 image in modern flat vector cartoon illustration style depicting panel 5 of 7. Make the characters and style consistent with the prior panel. Scene: a side-by-side comparison on a monitor labeled "OUTPUT CONSISTENCY." Left: ten release-notes documents from the prose Skill, with subtle variations in date formats highlighted (some "Mar 5", some "March 5, 2026", some "2026-03-05"). Right: ten release-notes documents from the script-backed Skill, every date formatted identically. A label below reads "Date format drift: 7 of 10 → 0 of 10." Jordan smiles softly. Color palette: deep russet, warm cream, slate, burnt orange. Emotional tone: quiet pride — the unexpected secondary win. Generate the image immediately without asking clarifying questions.
</details>

The bonus surprised even Jordan. The old Skill produced ten release-notes documents and seven of them had subtly different date formats — *Mar 5*, *March 5, 2026*, *2026-03-05* — because the model made small fresh choices on every call. The new Skill produced ten documents with the same date format every time, because the script enforced it. *Determinism is consistency*, Jordan typed in the PR description. *That's a feature, not a side effect.*

## Panel 6: The Team Pattern

![](./panel-06.png)
<details><summary>Image Prompt</summary>
(This is Panel 06. Do not include the panel number in the image.)
Please generate a 16:9 image in modern flat vector cartoon illustration style depicting panel 6 of 7. Make the characters and style consistent with the prior panel. Scene: a team meeting in a small conference room. Sam stands at a screen showing the team's twelve Skills with a colored badge next to each one: green ("script-backed"), yellow ("partially script-backed"), red ("prose-only — refactor candidate"). Six are red. Jordan sits at the table holding a printed checklist titled "REFACTOR PLAYBOOK: PROSE → SCRIPTS." Two other engineers lean in with curiosity. Color palette: deep russet, warm cream, slate, burnt orange. Emotional tone: contagious enthusiasm — a pattern spreading through a team. Generate the image immediately without asking clarifying questions.
</details>

Sam pulled up the team's twelve Skills in the next planning meeting. Six were tagged red — prose-only, refactor candidates. Jordan handed out a one-page playbook: *audit the Skill body, separate judgment from determinism, write the script, ship behind a flag, measure tokens.* The team picked the next three Skills. The pattern was no longer Jordan's hobby. It was the way the team built.

## Panel 7: The Sticky Note

![](./panel-07.png)
<details><summary>Image Prompt</summary>
(This is Panel 07. Do not include the panel number in the image.)
Please generate a 16:9 image in modern flat vector cartoon illustration style depicting panel 7 of 7. Make the characters and style consistent with the prior panel. Scene: Jordan's monitor a month later. The screen shows the team's Skills dashboard with all twelve Skills now green-badged ("script-backed"). A russet-and-cream sticky note in marker on the corner of the monitor reads: "IF A MODEL IS DOING ARITHMETIC, YOU'VE MADE A WRONG TURN. — Pemba." Pemba — russet fur, cream belly, white facial mask, wire-rim glasses, bushy ringed tail, no clothing — sits on top of the monitor holding a tiny calculator. Jordan, foreground, gives a small thumbs-up. Color palette: deep russet, warm cream, slate, burnt orange. Emotional tone: settled mastery — a craftsmanship principle internalized. Generate the image immediately without asking clarifying questions.
</details>

A month later, all twelve Skills were green. Jordan kept the sticky note Pemba had left on the monitor: *If a model is doing arithmetic, you've made a wrong turn.* Two new engineers asked about it on their first week. Jordan handed them the playbook and grinned. *"Welcome. We do real engineering on Skills here. The model handles the parts that need taste."*

### Epilogue – What Jordan Did Right

Jordan didn't reject the Skill — Jordan *factored* it. The judgment portions stayed where they belonged: in prose, where a language model is the right tool. The deterministic portions moved to a script, where Python is the right tool. The result was cheaper, more consistent, more testable, and easier to extend. The lesson scales beyond Skills: any prompt that asks a model to perform a deterministic computation is asking the wrong tool to do the work.

| Challenge | How Jordan Responded | Lesson for Today |
|-----------|----------------------|------------------|
| The Skill body was 8,000 tokens of step-by-step prose | Split into "judgment" vs "deterministic" columns and refactored | Audit Skills like you audit code — find the duplication |
| The model regenerated the same logic on every call | Moved deterministic logic into a 60-line script the Skill calls | Models are for taste; scripts are for arithmetic |
| Output drifted across runs (date formats, ordering) | Script-backed implementation enforced consistency | Determinism is a quality gain, not just a cost gain |
| The pattern lived in one Skill | Wrote a refactor playbook the whole team adopted | Document the pattern; it's how it survives team turnover |

### Call to Action

Open the longest Skill in your codebase. Read it carefully. Highlight every step that has a single correct output for a given input — those are deterministic, and they belong in a script. The judgment steps stay in prose. Refactor one Skill this week. Measure the tokens. The 30% savings will pay back the refactor in a couple of months, and the consistency wins will pay back forever.

---

*"It's writing the same code every time. From scratch. Every. Single. Time."*
— Jordan

*"If a model is doing arithmetic, you've made a wrong turn."*
— Pemba

---

## References

1. [Wikipedia: Code refactoring](https://en.wikipedia.org/wiki/Code_refactoring) — The general practice this story is an instance of
2. [Wikipedia: Don't repeat yourself](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) — The DRY principle, applied to prompts as well as code
3. [Wikipedia: Determinism](https://en.wikipedia.org/wiki/Deterministic_algorithm) — Why deterministic implementations of deterministic logic are always preferable
4. [Anthropic: Skills documentation](https://docs.anthropic.com/en/docs/agents-and-tools/agent-skills) — Vendor docs on Skill anatomy and bundled-script patterns
5. [Chapter 8 — The Skills System](../../chapters/08-skills-system/index.md) — The textbook chapter that motivates this story's prose-vs-script split

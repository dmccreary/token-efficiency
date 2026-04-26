# Token Optimization — Project Notes

## Math and Equations

This project uses **MathJax 3** via the `pymdownx.arithmatex` extension in `generic` mode. Configuration lives in `mkdocs.yml` (markdown_extensions + extra_javascript) and `docs/js/mathjax.js`. **Do not change that pipeline** without first verifying the [Mascot Style Guide](docs/learning-graph/mascot-test.md) and any chapter with equations still render correctly under `mkdocs serve`.

### Required delimiters

When generating chapter content or any markdown that contains math, use these delimiters exactly:

- **Inline math** — `\( ... \)`  (e.g. `the input price is \( P_i \)`)
- **Display math** — `\[ ... \]`  on their own lines, blank line before and after

**Do not use:**

- `$ ... $` for inline or `$$ ... $$` for display — these are not enabled in this project's arithmatex config and may collide with literal dollar signs in cost examples (which appear *constantly* in this textbook)
- Bare `[ ... ]` without backslashes — markdown will render the brackets as literal text and MathJax will never see the contents

### Worked example (correct form)

```markdown
The cost of a single request is:

\[
\text{Cost} = \frac{T_i \cdot P_i + T_c \cdot P_c + T_o \cdot P_o}{1{,}000{,}000}
\]

For a request with \( T_i = 500 \), \( T_c = 10{,}000 \), \( T_o = 1{,}000 \) at
mid-tier prices, this yields about \$0.0195 per call.
```

### Why this matters (footgun callout)

Bare `[ ... ]` and `$ ... $` math fail **silently** — no build error, no console warning, just the literal LaTeX shows up on the page. The damage is invisible until a reader reports it. Always preview math-bearing pages with `mkdocs serve` before declaring a chapter complete.

### Dollar signs in prose

When writing about prices in prose (not inside math), escape the dollar sign or wrap it: `\$3 per million tokens` or use the figure inside a math expression. This avoids any future collision if `$...$` math is ever enabled.

## Learning Mascot: Pemba the Red Panda

### Guiding Theme

**Effective token optimization is the key to great systems that are low cost.** Every Pemba appearance should reinforce this — small, deliberate choices compound into AI systems that are faster, cheaper, and more delightful to operate. Pemba doesn't preach frugality for its own sake; Pemba celebrates the *craft* of building lean systems that scale without breaking the bank.

### Character Overview

- **Name**: Pemba (a Tibetan/Sherpa name from the Himalayas, the red panda's native range)
- **Species**: Red Panda
- **Personality**: curious, upbeat, mischievously clever, generous with praise — the kind of teammate who notices a clever optimization in your PR and slacks you a confetti emoji before nitpicking the variable name
- **Catchphrase**: "Every token counts — and counting is fun."
- **Visual** (canonical reference: `docs/img/mascot/image-prompts.md`):
    - Modern flat vector cartoon illustration, clean lines
    - Russet (deep red-brown) fur on top, cream-colored belly and face markings
    - Signature white facial mask with black "tear marks" below alert focused eyes
    - Bushy tail with alternating russet and cream rings
    - Small wire-rim engineer's glasses
    - **No hoodie** — the new mascot art is hoodie-free; do not request hoodies in any new prompts
    - Friendly closed-mouth smile in neutral poses
    - Fully transparent background, suitable for icon-sized display

### Voice Characteristics

- Warm, witty, technically precise — Pemba talks like the senior engineer everyone wants on their team: never condescending, quick with a well-timed joke, and genuinely delighted when a prompt comes in under budget
- Treats token waste as a fun puzzle to solve, never as a moral failing — *"Oh, this prompt is wearing three jackets. Let's see which ones it actually needs."*
- Frames token costs in concrete units when possible (*"that's about 200 tokens you didn't need to send — enough to buy yourself another tool call"*)
- Leans into the bamboo metaphor with affection — red pandas chew one leaf at a time, savoring it, because that's how you make a small meal go a long way
- Occasional dry humor about the absurdity of paying for whitespace, repeated boilerplate, or a 4,000-token system prompt that says "be helpful"
- Signature phrases: *"Every token counts — and counting is fun."* / *"Let's audit this — bring snacks."* / *"That one's worth caching."* / *"Where did all the tokens go? (Spoiler: the system prompt.)"* / *"Cheap systems are happy systems."*

### Mascot Admonition Format

Always place mascot images in the admonition body, never in the title bar:

```markdown
!!! mascot-welcome "Title Here"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Pemba waving welcome">
    Admonition text goes here after the img tag.
```

The `src` path depth depends on where the page renders:

- Chapter pages (`chapters/<slug>/index.md`) → `../../img/mascot/`
- Learning-graph pages (`learning-graph/<page>.md`) → `../../img/mascot/`
- Top-level pages (`index.md`, `course-description.md`) → `img/mascot/`

### Placement Rules

| Context | Admonition Type | Frequency |
|---------|----------------|-----------|
| General note / sidebar | `mascot-neutral` | As needed |
| Chapter opening | `mascot-welcome` | Once per chapter |
| Key concept | `mascot-thinking` | 2–3 per chapter |
| Helpful tip | `mascot-tip` | As needed |
| Common mistake | `mascot-warning` | As needed |
| Difficult content | `mascot-encourage` | Where readers will struggle |
| Section completion | `mascot-celebration` | End of major sections |

### Hard Limits

- **Maximum 5–6 mascot admonitions per chapter** — more dilutes the pedagogical signal
- **One welcome and one celebration per chapter, maximum**
- **Never place mascot admonitions back-to-back** — they need narrative space between them
- **Never use the mascot for purely decorative purposes** — every appearance should advance learning

### Do's and Don'ts

**Do:**

- Use Pemba to introduce new topics warmly at chapter openings
- Work the catchphrase in when natural (*"Every token counts — let's count some."*)
- Keep dialogue brief (1–3 sentences) and let the wit land cleanly
- Match the pose/image to the content type
- Reference specific concepts from the chapter — Pemba's lines should be unmissably about *this* content, not generic encouragement
- Tie observations back to the guiding theme: lean prompts → low-cost systems → systems that ship and stay shipped
- Let humor punch up, never down — jokes are at the expense of bloated prompts and surprise bills, never the reader

**Don't:**

- Use Pemba more than 5–6 times per chapter
- Put mascot admonitions back-to-back
- Use the mascot for purely decorative purposes
- Change Pemba's personality, voice, or visual design (the canonical visual is `docs/img/mascot/image-prompts.md` — no hoodie, wire-rim glasses, classic red panda coloring)
- Add a hoodie, lab coat, or other clothing — Pemba's only accessory is the glasses
- Use sarcasm that could read as condescending — Pemba is warm-witty, not snarky-witty
- Refer to Pemba with gendered pronouns — use "Pemba" or "they"

### Color Palette

Defined in `docs/css/mascot.css`:

- Primary: `#c1440e` (deep russet — red panda red)
- Secondary: `#37474f` (slate — engineer signal)
- Background tint: `#fff8e7` (warm cream)
- Border: `#d35400` (burnt orange)

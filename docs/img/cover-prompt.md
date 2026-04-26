# Cover Image Prompt — Token Efficiency

This file contains the canonical AI image-generation prompt for the book cover.
Paste it into ChatGPT / DALL-E / Midjourney / Ideogram / your preferred image
generator. Save the resulting image to `docs/img/cover.png` at exactly
**1200 × 630 pixels** (1.91:1 aspect ratio — the Open Graph standard for
social-media previews).

## Output Specifications

- **Filename:** `docs/img/cover.png`
- **Dimensions:** 1200 × 630 pixels
- **Aspect ratio:** 1.91:1 (Open Graph / Twitter Card standard)
- **Format:** PNG
- **Use:** Home page hero image, social-media link previews, README header

## The Prompt

```
Please generate a wide-landscape book cover image at exactly
1200 × 630 pixels (1.91:1 aspect ratio) for a software-engineering
textbook titled "Token Efficiency".

LAYOUT:

- Title placement: The title "Token Efficiency" must be placed in the
  HORIZONTAL CENTER of the canvas, in large, crisp, high-contrast white
  sans-serif type, vertically centered as well. Treat the centered title
  as the primary visual anchor of the cover.
- Subtitle: Directly below the title, in slightly smaller white type, also
  horizontally centered: "Measuring, Analyzing, and Reducing the Cost of
  Generative AI."
- Mascot placement: Pemba the Red Panda welcome pose appears on the LEFT side of the
  canvas, in the welcome pose, sized roughly half the height of the canvas.
  Pemba is positioned so the title remains the dominant centered element —
  Pemba flanks the title from the left, does not overlap it, and faces
  slightly inward (toward the centered title) with a welcoming wave.
- Right side: An abstract, low-opacity montage of token-optimization motifs
  (described below) provides visual balance opposite Pemba.

PEMBA — CANONICAL APPEARANCE (must match exactly; this is an established
mascot for the book):

- Modern flat vector cartoon illustration, clean lines
- Russet (deep red-brown, approximately #c1440e) fur on top
- Cream-colored belly and face markings
- Signature white facial mask with black "tear marks" below alert
  focused eyes
- Bushy tail with alternating russet and cream rings, visible behind
  the body
- Small wire-rim engineer's glasses
- NO hoodie, NO clothing of any kind — glasses are the only accessory
- Welcome pose: one paw raised high in a cheerful wave, the other paw
  resting at the side; warm, welcoming expression with a closed-mouth
  smile slightly bigger than neutral; facing the viewer but angled
  slightly toward the centered title

BACKGROUND:

A professional gradient running left to right from deep blue-purple
(approximately #1f1b3a) on the left behind Pemba to teal (approximately
#0f4c5c) on the right. Across the full canvas, very faintly visible
behind and beneath the centered title, an abstract montage of
token-optimization motifs in low-opacity pale-gold and white linework —
flowing token chips, cache symbols, network-graph nodes, stylized API
call brackets, a subtle Pareto curve. The motifs should read as texture,
not as labels, and must never compete with the centered title for
attention.

COLOR PALETTE:

- Pemba: russet (#c1440e) primary, cream (#fff8e7) markings
- Background gradient: deep blue-purple (#1f1b3a) to teal (#0f4c5c)
- Title and subtitle: pure white
- Accents and montage linework: pale gold (#f5d97a) and white at low
  opacity (15-25%)

STYLE:

Modern, professional textbook cover. Clean and uncluttered. Flat vector
illustration for Pemba; subtle abstract texture for the background.
High-quality digital art suitable for both print and social-media
preview.

CONSTRAINTS:

- The title "Token Efficiency" MUST be horizontally centered on the
  canvas — not left-aligned, not right-aligned
- No other text besides the title and the one subtitle line
- No logos, watermarks, vendor brands, or trademarks
- No checkered background, no plain white background — use the
  specified gradient
- Do NOT change Pemba's design — no hoodie, no clothing, no extra
  accessories beyond the wire-rim glasses
- Pemba must not overlap the centered title; leave clear visual space
  between them
```

## Mascot Reference

Pemba's canonical visual reference and all seven pose prompts live in
[`image-prompts.md`](./mascot/image-prompts.md). The welcome pose used in
this cover matches `docs/img/mascot/welcome.png`.

## After Generating the Image

1. Save the result as `docs/img/cover.png`
2. Verify dimensions are exactly 1200 × 630 pixels (resize if needed)
3. Confirm the title is horizontally centered and Pemba is on the left
   without overlapping the title
4. Wire it into the home page metadata (Open Graph + Twitter Card) and
   the home page hero block — see the `home-page-template.md` guide in
   the `book-installer` skill for the markdown snippet

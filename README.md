# Token Efficiency

[![MkDocs](https://img.shields.io/badge/Made%20with-MkDocs-526CFE?logo=materialformkdocs)](https://www.mkdocs.org/)
[![Material for MkDocs](https://img.shields.io/badge/Material%20for%20MkDocs-526CFE?logo=materialformkdocs)](https://squidfunk.github.io/mkdocs-material/)
[![GitHub Pages](https://img.shields.io/badge/View%20on-GitHub%20Pages-blue?logo=github)](https://dmccreary.github.io/token-efficiency/)
[![GitHub](https://img.shields.io/badge/GitHub-dmccreary%2Ftoken--efficiency-blue?logo=github)](https://github.com/dmccreary/token-efficiency)
[![Built with Claude Code](https://img.shields.io/badge/Built%20with-Claude%20Code-DA7857?logo=anthropic)](https://claude.ai/code)
[![Uses Claude Skills](https://img.shields.io/badge/Uses-Claude%20Skills-DA7857?logo=anthropic)](https://github.com/dmccreary/claude-skills)
[![p5.js](https://img.shields.io/badge/p5.js-ED225D?logo=p5.js&logoColor=white)](https://p5js.org/)
[![MathJax](https://img.shields.io/badge/Math-MathJax%203-008080)](https://www.mathjax.org/)
[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/)

## View the Live Site

Read the interactive textbook at: **[https://dmccreary.github.io/token-efficiency/](https://dmccreary.github.io/token-efficiency/)**

## Overview

**Token Efficiency** is an open-source intelligent textbook on measuring, analyzing, and reducing the cost of generative AI systems — without sacrificing quality. It is written for software engineers, ML and platform engineers, technical leads, FinOps practitioners, and engineering managers who are responsible for the cost and performance of LLM-powered applications in production.

The book is **deliberately vendor-pluralistic**. Every concept — tokenization, pricing, caching, structured logging, observability, A/B testing, prompt engineering, RAG tuning, model routing, agent budget policies, and batch APIs — is shown side-by-side across the three dominant ecosystems engineering teams encounter today: **Anthropic Claude, OpenAI, and Google Gemini**. The curriculum closes with a capstone project in which readers instrument a real or simulated application end-to-end and demonstrate a measurable token reduction.

The textbook is built on a **475-concept learning graph** with validated prerequisite ordering, follows **Bloom's Taxonomy (2001 revision)** for learning outcomes, and embeds 44 interactive p5.js MicroSims that let readers manipulate tokenizers, cache lifecycles, Pareto frontiers, agent budget meters, and more. Pedagogically, the book is guided by **Pemba the Red Panda**, a mascot character who reinforces the guiding theme — *"Effective token optimization is the key to great systems that are low cost. Every token counts — and counting is fun."*

## Site Status and Metrics

| Metric | Count |
|--------|------:|
| Chapters | 20 |
| Concepts in Learning Graph | 475 |
| MicroSims (interactive p5.js) | 44 |
| Glossary Terms | 475 |
| FAQ Questions | 91 |
| Case Studies | 3 |
| Markdown Pages | 109 |
| Total Word Count | ~182,000 |
| Annotated Reference Pages | 20 |
| Vendor Ecosystems Covered | 3 (Anthropic, OpenAI, Google) |

**Completion status:** Content is feature-complete across all 20 chapters, the full glossary, FAQ, learning graph, case studies, and MicroSim library. Active work is on continued polish, additional case studies, and quiz generation.

## Getting Started

### Prerequisites

- Python 3.9+ (for MkDocs)
- Git
- A modern browser (for previewing MicroSims)

### Clone the Repository

```bash
git clone https://github.com/dmccreary/token-efficiency.git
cd token-efficiency
```

### Install Dependencies

```bash
pip install mkdocs
pip install "mkdocs-material[imaging]"
```

The `[imaging]` extra is required for the `social` plugin, which auto-generates Open Graph and Twitter preview images from each page's title and description.

### Build and Serve Locally

Serve the site with live reload:

```bash
mkdocs serve
```

Then open `http://127.0.0.1:8000/token-efficiency/` in your browser.

Build a static copy of the site:

```bash
mkdocs build
```

### Deploy to GitHub Pages

```bash
mkdocs gh-deploy
```

This builds the site and pushes it to the `gh-pages` branch.

### Using the Book

- **Navigation** — use the left sidebar to browse the 20 chapters in prerequisite order, or jump to MicroSims, Case Studies, the Learning Graph, FAQ, or Glossary from the top-level sections.
- **Search** — every page is full-text searchable from the magnifying-glass icon.
- **MicroSims** — each interactive simulation runs standalone in your browser. Adjust parameters with sliders and dropdowns to build intuition for token economics.
- **Math** — equations render via MathJax 3. See `CLAUDE.md` for the required `\( ... \)` and `\[ ... \]` delimiter conventions when contributing.
- **Edit** — every page has an "edit this page" link that opens the source markdown on GitHub.

## Repository Structure

```
token-efficiency/
├── docs/                                # MkDocs documentation source
│   ├── index.md                         # Landing page
│   ├── about.md                         # About the book
│   ├── course-description.md            # Audience, prerequisites, Bloom outcomes
│   ├── chapters/                        # 20 chapters in prerequisite order
│   │   ├── 01-llms-tokens-generation-basics/
│   │   │   ├── index.md                 # Chapter content
│   │   │   └── references.md            # Annotated references
│   │   └── ... (chapters 02–20)
│   ├── sims/                            # 44 interactive p5.js MicroSims
│   │   ├── interactive-tokenizer-explorer/
│   │   │   ├── main.html                # Standalone simulation
│   │   │   └── index.md                 # MicroSim documentation
│   │   └── ...
│   ├── case-studies/                    # Real-world applied examples
│   ├── learning-graph/                  # 475-concept learning graph + analysis
│   │   ├── learning-graph.csv           # Concept dependencies (CSV)
│   │   ├── learning-graph.json          # vis-network format
│   │   ├── concept-list.md              # Enumerated concept list
│   │   ├── concept-taxonomy.md          # Taxonomy categorization
│   │   ├── quality-metrics.md           # Graph quality analysis
│   │   └── *.py                         # Validation and analysis scripts
│   ├── glossary.md                      # 475 ISO-11179-style definitions
│   ├── faq.md                           # 91 FAQs grouped by topic
│   ├── img/                             # Cover art, mascot, diagrams
│   ├── css/                             # mascot.css, extra.css
│   └── js/                              # mathjax.js, extra.js
├── plugins/                             # Custom MkDocs plugin code
├── logs/                                # Generation and build logs
├── mkdocs.yml                           # MkDocs configuration
├── CLAUDE.md                            # Project rules (math delimiters, mascot)
└── README.md                            # This file
```

## Reporting Issues

Found a typo, a broken link, an inaccurate cost example, or a MicroSim that misbehaves? Please open an issue:

**[GitHub Issues](https://github.com/dmccreary/token-efficiency/issues)**

When reporting, please include:

- A description of the problem or suggestion
- The page URL or chapter title where you saw it
- Steps to reproduce (for MicroSim or rendering bugs)
- Browser and OS (for MicroSim issues)
- Screenshots if helpful

## License

This work is licensed under the [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License](https://creativecommons.org/licenses/by-nc-sa/4.0/) (CC BY-NC-SA 4.0).

**You are free to:**

- **Share** — copy and redistribute the material in any medium or format
- **Adapt** — remix, transform, and build upon the material

**Under the following terms:**

- **Attribution** — give appropriate credit and link to this repository
- **NonCommercial** — not for commercial use without explicit permission
- **ShareAlike** — distribute contributions under the same license

See [docs/license.md](docs/license.md) for the full text.

## Acknowledgements

This project stands on the shoulders of an excellent open-source community:

- **[MkDocs](https://www.mkdocs.org/)** — the static site generator that powers the book
- **[Material for MkDocs](https://squidfunk.github.io/mkdocs-material/)** — the theme and the `social` plugin for OG image generation
- **[p5.js](https://p5js.org/)** — the creative-coding library behind every interactive MicroSim
- **[MathJax 3](https://www.mathjax.org/)** — equation rendering for the cost and pricing math
- **[vis-network](https://visjs.org/)** — visualization for the learning graph viewer
- **[PyMdown Extensions](https://facelessuser.github.io/pymdown-extensions/)** — admonitions, arithmatex, superfences, and more
- **[Claude AI](https://claude.ai)** by Anthropic — AI-assisted authoring, learning-graph generation, and skills tooling
- **[GitHub Pages](https://pages.github.com/)** — free hosting for the live site

Thanks also to the educators, FinOps practitioners, and engineering teams whose real-world cost stories shaped the case studies and worked examples.

## Contact

**Dan McCreary**

- LinkedIn: [linkedin.com/in/danmccreary](https://www.linkedin.com/in/danmccreary/)
- GitHub: [@dmccreary](https://github.com/dmccreary)

Questions, corrections, classroom-adoption inquiries, or collaboration ideas? Open an issue on GitHub or reach out on LinkedIn.

## How to Cite

If you use this textbook in your teaching or research, please cite it as:

```
McCreary, D. (2026). Token Efficiency: Measuring, Analyzing, and Reducing
the Cost of Generative AI. GitHub. https://github.com/dmccreary/token-efficiency
```

BibTeX:

```bibtex
@misc{mccreary2026tokenefficiency,
  author       = {McCreary, Dan},
  title        = {Token Efficiency: Measuring, Analyzing, and Reducing
                  the Cost of Generative AI},
  year         = {2026},
  publisher    = {GitHub},
  url          = {https://github.com/dmccreary/token-efficiency},
  howpublished = {\url{https://dmccreary.github.io/token-efficiency/}}
}
```

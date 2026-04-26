---
title: "About This Book"
description: "About Token Efficiency — its purpose, audience, design, and the team behind it."
---

# About This Book

## Welcome from Pemba

![](./img/mascot/welcome.png){ align="left" width="140px"}

Hi, I'm Pemba — your guide through this textbook. We're going to look at where the tokens in modern AI systems actually go, why your bill is what it is, and how to drive it down without sacrificing quality. The work is more fun than you might expect: every prompt is a small puzzle, every cache hit is a small win, and every clean log line is a future engineer thanking you. *Every token counts — and counting is fun.*

<div style="clear: both;"></div>

## Why This Intelligent Textbook

Generative AI has moved from pilot projects to production budgets in roughly two years, and the bill has caught up faster than most engineering teams have. A single poorly-designed prompt, a verbose system message, an unbounded agent loop, or a missed prompt-cache breakpoint can multiply infrastructure cost by ten or one hundred times — and the symptoms usually appear weeks after the design decision that caused them. Yet very few engineers have a rigorous, end-to-end mental model of where tokens come from, how they are billed, and how to systematically drive them down.

**In the United States and the broader engineering market (2024–2025):**

- Gartner forecasts global generative AI spending to reach **\$644 billion in 2025**, a 76.4% increase over 2024, with services and infrastructure leading the growth[^1]
- McKinsey's *State of AI 2024* survey found that **65% of organizations** now regularly use generative AI in at least one business function — nearly double the share from ten months prior — making cost-per-feature a board-level question for the first time[^2]
- The Stanford *AI Index Report 2024* documented that the training compute of frontier models has grown roughly **5× per year** since 2010, and that inference cost reductions have become a primary focus of model providers — but optimizing application-level token spend remains under-instrumented at most adopting organizations[^3]
- a16z's *16 Changes to the Way Enterprises Build and Buy Generative AI* (2024) reports that enterprise LLM budgets have **grown roughly 5× year-over-year** while cost-attribution discipline has lagged, with most teams unable to answer "what does this feature cost per user per month?"[^4]

**Worldwide:**

- The IMF estimates that AI could affect **almost 40% of jobs globally**, with both productivity gains and cost pressure creating new demand for engineers who can ship AI features that are economically sustainable, not just technically functional[^5]
- The IEA projects that data centers, driven heavily by AI workloads, will consume **roughly 945 TWh of electricity by 2030** — more than double their 2024 consumption — making per-token efficiency a sustainability concern as much as a financial one[^6]

These numbers represent millions of engineering decisions made every day — most of them under-instrumented, many of them dramatically more expensive than they need to be. This textbook exists to give the engineers and managers making those decisions the mental models, the measurement discipline, and the optimization techniques to ship AI systems that are genuinely affordable to operate at scale.

This book takes a fundamentally different approach from a vendor whitepaper or a single-API tutorial. It is built on a **learning graph of 475 interconnected concepts** organized into chapters that introduce each concept in the order its prerequisites are established — so understanding builds naturally from "what is a token" in Chapter 1 to a working agent budget policy in Chapter 18. The book is **deliberately vendor-pluralistic**, covering Anthropic Claude, OpenAI, and Google Gemini side by side rather than picking a winner. Throughout you will find **interactive MicroSims** — browser-based simulations that let you manipulate cost equations, walk through the BPE tokenization pipeline, watch a cache hit rate degrade in real time, and explore the Pareto frontier of cost vs. quality. The entire textbook is **open source and free** — no paywalls, no access codes, no expensive annual editions.

## How to Use This Book

This textbook is designed for self-paced study by working engineers and for classroom use in continuing-education or graduate-level courses. Each chapter builds on previous material, so reading in order is recommended for readers new to LLM economics. Practitioners may skim earlier chapters and jump to specific topics — the per-chapter concept lists tell you exactly which concepts are introduced where. The book includes:

- **20 Chapters** covering the full arc from token mechanics through pricing, vendor ecosystems, harnesses, structured logging, dashboards, A/B testing, prompt engineering, prompt caching, RAG optimization, context window management, model routing, agent budget policies, batch operations, privacy/compliance, and capstone projects
- **Interactive MicroSims** embedded in chapters — including a tokenizer explorer, a cache hit-rate simulator, a Pareto-frontier visualizer, an A/B-test sample-size calculator, and an agent budget policy multi-meter
- **Quizzes** at the end of each chapter to test understanding
- **Annotated References** linking to vendor documentation and authoritative sources
- **Glossary** with definitions for every key concept (forthcoming)
- **Learning Graph** visualizing all 475 concept dependencies
- **Search** available from any page using the search bar

The [Learning Graph](learning-graph/index.md) visualizes how concepts connect across chapters. If you want to explore non-linearly or check prerequisites for a specific topic, start there.

## About the Author

Dan McCreary is a semi-retired AI researcher, solution architect, and educator who has spent more than three decades helping Fortune 100 organizations reason over massive datasets. At Optum he founded the Generative AI Center of Excellence and led the team that built one of the world's largest healthcare knowledge graphs — spanning over 25 billion vertices — to unify member, provider, and patient insights. Dan's deep background in knowledge representation and systems thinking underpins the precise learning graphs and intelligent textbook workflows used throughout this course.

He is the co-author of *Making Sense of NoSQL* (Manning Publications), the founding chair of the NoSQL Now! conference, and a frequent keynote speaker on semantic search, ontology strategy, and AI hardware. Beyond industry, Dan has mentored students as a STEM volunteer since 2014 and now applies the same rigor to building open educational resources. You can visit the [Intelligent Textbooks Case Studies](https://dmccreary.github.io/intelligent-textbooks/case-studies/) to see over 70 textbooks that Dan has created or co-created with other authors.

**Selected Credentials**

- B.A. in Physics and Computer Science from Carleton College
- M.S.E.E. from the University of Minnesota
- MBA coursework at the University of St. Thomas
- Patent holder in semantic search and ontology management techniques
- Advocate for large-scale Enterprise Knowledge Graph adoption across healthcare and education
- Long-time promoter of accessible, low-cost AI-powered learning experiences

## How to Cite This Book

If you reference this textbook in academic work, technical reports, internal proposals, lesson plans, or other publications, please use one of the following citation formats.

**APA (7th edition)**

McCreary, D. (2026). *Token Efficiency: A guide to understanding and improving token efficiency in language models*. https://dmccreary.github.io/token-efficiency/

**Chicago (17th edition)**

McCreary, Dan. 2026. *Token Efficiency: A guide to understanding and improving token efficiency in language models*. https://dmccreary.github.io/token-efficiency/.

**MLA (9th edition)**

McCreary, Dan. *Token Efficiency: A guide to understanding and improving token efficiency in language models*. 2026, dmccreary.github.io/token-efficiency/.

**BibTeX**

```bibtex
@book{mccreary2026tokenefficiency,
  title     = {Token Efficiency: A guide to understanding and improving token efficiency in language models},
  author    = {McCreary, Dan},
  year      = {2026},
  url       = {https://dmccreary.github.io/token-efficiency/},
  note      = {Interactive intelligent textbook}
}
```

To cite a specific chapter, append the chapter number and title — for example:

McCreary, D. (2026). Chapter 14: Prompt Caching Patterns. In *Token Efficiency*. https://dmccreary.github.io/token-efficiency/chapters/14-prompt-caching-patterns/

## License

This work is released under the [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License (CC BY-NC-SA 4.0)](https://creativecommons.org/licenses/by-nc-sa/4.0/). You are free to share and adapt the material for non-commercial purposes as long as you give appropriate credit and share your adaptations under the same license.

Source code, MicroSim implementations, and supporting scripts are available under the same terms in the [project repository](https://github.com/dmccreary/token-efficiency).

## References

[^1]: Gartner. (2025). *Gartner Forecasts Worldwide GenAI Spending to Reach \$644 Billion in 2025*. <https://www.gartner.com/en/newsroom/press-releases/2025-03-31-gartner-forecasts-worldwide-genai-spending-to-reach-644-billion-in-2025>
[^2]: McKinsey & Company. (2024). *The state of AI in early 2024: Gen AI adoption spikes and starts to generate value*. <https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai>
[^3]: Stanford University Human-Centered Artificial Intelligence (HAI). (2024). *Artificial Intelligence Index Report 2024*. <https://aiindex.stanford.edu/report/>
[^4]: Andreessen Horowitz (a16z). (2024). *16 Changes to the Way Enterprises Build and Buy Generative AI*. <https://a16z.com/generative-ai-enterprise-2024/>
[^5]: International Monetary Fund. (2024). *Gen-AI: Artificial Intelligence and the Future of Work* (IMF Staff Discussion Note SDN/2024/001). <https://www.imf.org/en/Publications/Staff-Discussion-Notes/Issues/2024/01/14/Gen-AI-Artificial-Intelligence-and-the-Future-of-Work-542379>
[^6]: International Energy Agency. (2025). *Energy and AI*. <https://www.iea.org/reports/energy-and-ai>

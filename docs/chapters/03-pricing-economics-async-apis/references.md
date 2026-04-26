# References: Pricing, Economics, and Async API Modes

1. [Cloud computing](https://en.wikipedia.org/wiki/Cloud_computing) - Wikipedia - Coverage of pay-as-you-go pricing models that LLM APIs inherit; sets the broader context for per-million-token pricing and unit economics.

2. [FinOps](https://en.wikipedia.org/wiki/FinOps) - Wikipedia - Overview of cloud financial operations practices; explains the engineering-finance discipline this textbook teaches in the LLM context.

3. [Application programming interface](https://en.wikipedia.org/wiki/API) - Wikipedia - Foundational coverage of API patterns including synchronous vs asynchronous and rate-limited endpoints, useful for understanding the batch and streaming distinctions this chapter introduces.

4. AI Engineering: Building Applications with Foundation Models (1st Edition) - Chip Huyen - O'Reilly - Chapters on cost-and-latency engineering provide the canonical treatment of LLM unit economics; aligns directly with this chapter's per-million-token pricing model.

5. Designing Machine Learning Systems - Chip Huyen - O'Reilly - The cost-and-monitoring chapters establish the FinOps-for-ML mindset that this textbook applies to token spending.

6. [Anthropic Pricing](https://www.anthropic.com/pricing) - Anthropic - Authoritative current pricing for Claude models including cached input rates and batch discount; the textbook references "roughly $3 per million" — verify against this page.

7. [OpenAI Pricing](https://openai.com/api/pricing/) - OpenAI - Current per-token pricing for GPT and o-series models; includes batch API discount structure used in this chapter's worked examples.

8. [Google Gemini API Pricing](https://ai.google.dev/gemini-api/docs/pricing) - Google - Current Gemini pricing including the long-context tier transition at 128K tokens; relevant to the cross-vendor comparison this chapter sets up.

9. [Anthropic Batch API](https://docs.anthropic.com/en/docs/build-with-claude/batch-processing) - Anthropic - Reference documentation for the Message Batches API including 50% discount, 24-hour SLA, and submission format used in Chapter 19's exercises.

10. [OpenAI Batch API](https://platform.openai.com/docs/guides/batch) - OpenAI - Documentation for OpenAI's batch endpoint with input file format, status polling, and discount structure that mirrors Anthropic's approach.

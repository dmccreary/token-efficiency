# References: Prompt Engineering for Token Efficiency

1. [Prompt engineering](https://en.wikipedia.org/wiki/Prompt_engineering) - Wikipedia - Comprehensive coverage of prompt design patterns including zero-shot, few-shot, chain-of-thought, and instruction-tuning that this chapter applies through a token-cost lens.

2. [In-context learning (natural language processing)](https://en.wikipedia.org/wiki/Prompt_engineering#In-context_learning) - Wikipedia - Coverage of how few-shot examples shape model behavior at inference time, relevant to this chapter's few-shot pruning discussion.

3. [Chain-of-thought prompting](https://en.wikipedia.org/wiki/Prompt_engineering#Chain-of-thought) - Wikipedia - Coverage of the reasoning-step-elicitation pattern that the chapter's reasoning-budget discussion regulates.

4. AI Engineering - Chip Huyen - O'Reilly - The prompt engineering chapters give a vendor-neutral foundation that this chapter extends with token-cost analysis; particularly useful for the system-prompt-hygiene material.

5. Hands-On Large Language Models - Jay Alammar and Maarten Grootendorst - O'Reilly - The prompting chapters contain side-by-side before/after examples that illustrate the token-reduction techniques discussed here.

6. [Anthropic Prompt Engineering Guide](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview) - Anthropic - Authoritative vendor reference covering system prompts, examples, XML tags, and chain-of-thought patterns; the recommended Anthropic-specific complement to this chapter.

7. [OpenAI Prompt Engineering Guide](https://platform.openai.com/docs/guides/prompt-engineering) - OpenAI - Vendor reference for prompting GPT and o-series models including instruction-following techniques specific to OpenAI training.

8. [Google Gemini Prompt Design Strategies](https://ai.google.dev/gemini-api/docs/prompting-strategies) - Google - Vendor reference for prompting Gemini including its multimodal and long-context-specific patterns.

9. [Prompt Engineering Guide (promptingguide.ai)](https://www.promptingguide.ai/) - Elvis Saravia / DAIR.AI - Comprehensive open-source guide covering 50+ prompting techniques with examples; ideal companion for engineers who want a broader survey beyond the cost-focused treatment in this chapter.

10. [Lilian Weng: Prompt Engineering](https://lilianweng.github.io/posts/2023-03-15-prompt-engineering/) - Lilian Weng - Long-form blog post categorizing prompting techniques by mechanism; the framework helps reason about which techniques add tokens and which remove them.

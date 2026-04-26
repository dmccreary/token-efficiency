# References: The Anthropic Claude Ecosystem

1. [Claude (language model)](https://en.wikipedia.org/wiki/Claude_(language_model)) - Wikipedia - Coverage of Claude model history, the Constitutional AI training approach, and the Opus/Sonnet/Haiku tier structure introduced in this chapter.

2. [Anthropic](https://en.wikipedia.org/wiki/Anthropic) - Wikipedia - Background on the company, its safety-first research mission, and key milestones; useful context for understanding the design choices behind the Claude API.

3. [Reinforcement learning from human feedback](https://en.wikipedia.org/wiki/Reinforcement_learning_from_human_feedback) - Wikipedia - Coverage of the post-training technique that shapes Claude's behavior, including the Constitutional AI variant Anthropic publishes.

4. AI Engineering - Chip Huyen - O'Reilly - Chapters on prompt engineering and tool use cover the patterns this chapter shows in Anthropic-specific form, with vendor-agnostic framing useful for comparison.

5. Hands-On Large Language Models - Jay Alammar and Maarten Grootendorst - O'Reilly - The chapters on prompting and tool use provide implementation patterns that translate cleanly to the Claude Messages API.

6. [Anthropic API Documentation](https://docs.anthropic.com/en/api/getting-started) - Anthropic - Authoritative reference for the Messages API including request/response schemas, authentication, and SDK usage shown in this chapter's code samples.

7. [Anthropic Cookbook](https://github.com/anthropics/anthropic-cookbook) - Anthropic GitHub - Curated example notebooks covering prompt caching, tool use, and extended thinking; each example is runnable and pairs with this chapter's worked examples.

8. [Anthropic Prompt Caching Documentation](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching) - Anthropic - Detailed reference for the cache_control parameter, TTL options, cache breakpoints, and the cache_creation_input_tokens / cache_read_input_tokens response fields covered in Chapter 14.

9. [Anthropic Tool Use Guide](https://docs.anthropic.com/en/docs/build-with-claude/tool-use) - Anthropic - Reference for tool definition schema, tool_use blocks, tool_result blocks, and the multi-turn pattern that drives the agent harnesses in Chapter 7.

10. [Anthropic Extended Thinking Documentation](https://docs.anthropic.com/en/docs/build-with-claude/extended-thinking) - Anthropic - Reference for the thinking-token budget parameter and reasoning behavior; includes guidance on when extended thinking pays for itself, expanded in Chapter 17.

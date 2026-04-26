# References: Context Window Management

1. [Sliding window protocol](https://en.wikipedia.org/wiki/Sliding_window_protocol) - Wikipedia - The networking origin of the sliding-window pattern adapted in this chapter to bound conversation context; useful conceptual analogy.

2. [Automatic summarization](https://en.wikipedia.org/wiki/Automatic_summarization) - Wikipedia - Coverage of extractive vs abstractive summarization techniques that inform the conversation-compaction strategies in this chapter.

3. [Long-term memory](https://en.wikipedia.org/wiki/Long-term_memory) - Wikipedia - Cognitive-science framing for the long-term-vs-short-term memory distinction that shapes agent memory architectures; useful conceptual scaffolding.

4. Hands-On Large Language Models - Jay Alammar and Maarten Grootendorst - O'Reilly - The chapters on long-context retrieval and memory-augmented agents map directly to the compaction and memory-file patterns covered here.

5. AI Engineering - Chip Huyen - O'Reilly - The agent and context-management chapters give the production-systems framing that this chapter applies to per-session token budgets.

6. [Lost in the Middle: How Language Models Use Long Contexts](https://arxiv.org/abs/2307.03172) - Liu et al. (arXiv) - The 2023 paper documenting that LLMs underutilize the middle of long contexts; foundational for the context-reordering recommendations in this chapter.

7. [LangChain Memory Documentation](https://python.langchain.com/docs/how_to/chatbots_memory/) - LangChain - Reference for conversation buffer, summary buffer, and entity-memory patterns that implement this chapter's compaction strategies.

8. [Anthropic: Long Context Best Practices](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/long-context-tips) - Anthropic - Vendor guidance on structuring long-context prompts including the reorder-for-importance pattern that mitigates lost-in-the-middle effects.

9. [Google Gemini Long Context Guide](https://ai.google.dev/gemini-api/docs/long-context) - Google - Reference for the 1M-token context window including chunking, ordering, and grounding strategies specific to Gemini.

10. [Lilian Weng: LLM-Powered Autonomous Agents](https://lilianweng.github.io/posts/2023-06-23-agent/) - Lilian Weng - Survey blog post on agent architectures including memory components; the framework helps reason about which compaction strategy fits which agent design.

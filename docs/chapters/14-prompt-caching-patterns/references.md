# References: Prompt Caching Patterns

1. [Cache (computing)](https://en.wikipedia.org/wiki/Cache_(computing)) - Wikipedia - Foundational coverage of caching including hit/miss terminology, eviction policies, and TTLs that translate directly to LLM prompt caching covered in this chapter.

2. [Memoization](https://en.wikipedia.org/wiki/Memoization) - Wikipedia - The function-result caching pattern that is the conceptual ancestor of LLM prompt caching; explains why deterministic prefixes are essential.

3. [Cache replacement policies](https://en.wikipedia.org/wiki/Cache_replacement_policies) - Wikipedia - Coverage of LRU, LFU, and TTL-based eviction; relevant to understanding why cached LLM prefixes have a 5-minute or 1-hour lifetime.

4. Designing Data-Intensive Applications - Martin Kleppmann - O'Reilly - The chapters on caching and replication establish the broader systems-engineering perspective that informs cache-key design and invalidation strategies.

5. AI Engineering - Chip Huyen - O'Reilly - The chapters on inference optimization cover prompt caching across vendors with the same unit-economics framing this chapter uses.

6. [Anthropic Prompt Caching Documentation](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching) - Anthropic - The authoritative reference for cache_control, breakpoints, TTLs, and the cache_creation_input_tokens / cache_read_input_tokens response fields covered in this chapter.

7. [OpenAI Prompt Caching Guide](https://platform.openai.com/docs/guides/prompt-caching) - OpenAI - OpenAI's automatic prompt caching documentation including the prefix-matching threshold and cached-token reporting in the usage object.

8. [Google Gemini Context Caching](https://ai.google.dev/gemini-api/docs/caching) - Google - Reference for Gemini's explicit caching API including minimum cache sizes, TTL configuration, and the cost calculation for cached vs uncached requests.

9. [Anthropic Engineering: Prompt Caching Announcement](https://www.anthropic.com/news/prompt-caching) - Anthropic - The announcement post explaining the design rationale and worked examples of cache cost savings; useful for the strategic-decision material in this chapter.

10. [LangChain LLM Caching](https://python.langchain.com/docs/how_to/llm_caching/) - LangChain - Reference for application-layer caching that complements vendor-provided prompt caching; relevant to the cache-aware-routing material later in this chapter.

# References: Model Routing and Output Control

1. [Routing](https://en.wikipedia.org/wiki/Routing) - Wikipedia - The networking concept of selecting paths based on criteria; directly analogous to the LLM model-selection problem this chapter formalizes.

2. [Mixture of experts](https://en.wikipedia.org/wiki/Mixture_of_experts) - Wikipedia - The ML pattern of routing inputs to specialized models based on task type; the conceptual ancestor of cross-vendor LLM routing covered here.

3. [Cascading classifiers](https://en.wikipedia.org/wiki/Cascading_classifiers) - Wikipedia - The classic cheap-first-then-expensive evaluation pattern that this chapter applies to model selection across cost tiers.

4. AI Engineering - Chip Huyen - O'Reilly - The chapters on inference optimization and model serving cover routing, output controls, and the cost-quality framing this chapter applies to LLMs.

5. Designing Machine Learning Systems - Chip Huyen - O'Reilly - The production-ML chapters establish the routing-and-fallback patterns that translate naturally to multi-vendor LLM systems.

6. [RouteLLM: An Open-Source Framework for Cost-Effective LLM Routing](https://github.com/lm-sys/RouteLLM) - LM-SYS GitHub - Reference implementation of an LLM router that learns to dispatch easy queries to cheap models; pairs well with this chapter's routing-policy material.

7. [Martian Blog: LLM Routing](https://withmartian.com/blog) - Martian - Working notes from a commercial LLM-routing platform on confidence-threshold tuning and escalation patterns that complement this chapter's recommendations.

8. [OpenAI Structured Outputs](https://platform.openai.com/docs/guides/structured-outputs) - OpenAI - Reference for the response_format parameter and JSON Schema enforcement covered in the output-control half of this chapter.

9. [Anthropic Tool Use and JSON](https://docs.anthropic.com/en/docs/build-with-claude/tool-use) - Anthropic - Reference for forcing structured output via tool definitions, the canonical Anthropic pattern that pairs with OpenAI's structured outputs.

10. [LangChain Output Parsers](https://python.langchain.com/docs/concepts/output_parsers/) - LangChain - Reference for the output-validation and retry patterns that operationalize the schema-enforcement half of this chapter's output-control recommendations.

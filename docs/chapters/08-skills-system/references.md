# References: The Skills System

1. [Modular programming](https://en.wikipedia.org/wiki/Modular_programming) - Wikipedia - Foundational coverage of decomposing software into independent modules; the conceptual ancestor of the Skills approach to bundling capability with lazy loading.

2. [Lazy loading](https://en.wikipedia.org/wiki/Lazy_loading) - Wikipedia - Detailed explanation of the lazy-loading pattern that makes Skills token-efficient; only the trigger description sits in context until the harness needs the body.

3. [Plug-in (computing)](https://en.wikipedia.org/wiki/Plug-in_(computing)) - Wikipedia - Background on extensible software architectures where third-party capabilities load on demand; Skills are essentially a plug-in system for LLM agents.

4. AI Engineering - Chip Huyen - O'Reilly - Chapters on agent design and tool composition cover the broader patterns Skills implement, including task decomposition and capability binding.

5. Designing Machine Learning Systems - Chip Huyen - O'Reilly - The model-as-component framing in this book applies directly to Skills as composable units of model-augmented capability.

6. [Anthropic Skills Documentation](https://docs.anthropic.com/en/docs/agents-and-tools/agent-skills/overview) - Anthropic - Authoritative reference for the Skill format including frontmatter, body structure, bundled scripts, and the loading lifecycle covered in this chapter.

7. [Anthropic Engineering: Building Skills for Claude](https://www.anthropic.com/news/agent-skills) - Anthropic - The announcement and design rationale for Skills; explains why the trigger-description-then-body architecture saves tokens at scale.

8. [Claude Skills GitHub Examples](https://github.com/anthropics/skills) - Anthropic GitHub - Official example Skills demonstrating the format conventions, script delegation patterns, and asset bundling used in this chapter's worked examples.

9. [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) - Anthropic - The protocol Skills use to expose capabilities to harnesses; relevant for engineers building custom Skills that interact with external systems.

10. [Awesome Claude Skills](https://github.com/dmccreary/claude-skills) - Dan McCreary GitHub - Curated collection of community-built Skills that demonstrate the trigger-description authoring patterns and script-delegation refactoring discussed in this chapter.

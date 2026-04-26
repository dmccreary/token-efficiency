# References: Agent Budget Policies and Session Limits

1. [Circuit breaker design pattern](https://en.wikipedia.org/wiki/Circuit_breaker_design_pattern) - Wikipedia - The fault-tolerance pattern that this chapter adapts for agent budget enforcement; explains the structural argument for stop-don't-degrade rather than continue-on-error.

2. [Rate limiting](https://en.wikipedia.org/wiki/Rate_limiting) - Wikipedia - Coverage of throttling techniques (token bucket, leaky bucket) that inform the per-tool-call and per-session token-rate limits in this chapter.

3. [Quota (project management)](https://en.wikipedia.org/wiki/Quota) - Wikipedia - Background on budget allocation and enforcement that frames the per-engineer and per-PR budget policies covered here.

4. Site Reliability Engineering - Beyer, Jones, Petoff, Murphy (eds) - Google / O'Reilly - The chapters on overload and graceful degradation provide the operational vocabulary this chapter applies to runaway-agent scenarios.

5. Building Microservices (2nd Edition) - Sam Newman - O'Reilly - Chapters on resilience patterns including bulkheads and circuit breakers that translate to harness-level safety in agent systems.

6. [Anthropic: Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents) - Anthropic - The engineering essay that defines the agent-vs-workflow distinction and includes recommendations on budget enforcement at the harness level.

7. [Claude Code Settings and Hooks](https://docs.anthropic.com/en/docs/claude-code/settings) - Anthropic - Reference for the configuration mechanism that operationalizes per-session limits and budget hooks in Claude Code, the canonical example used in this chapter.

8. [OpenAI Usage Limits](https://platform.openai.com/docs/guides/rate-limits) - OpenAI - Reference for tier-based rate and spending limits that complement application-level budget policies described here.

9. [Hystrix: Latency and Fault Tolerance](https://github.com/Netflix/Hystrix/wiki) - Netflix GitHub - Classic reference for circuit-breaker implementation with concrete configuration examples; the design vocabulary applies directly to agent-budget enforcement.

10. [LangSmith Cost Tracking](https://docs.smith.langchain.com/) - LangChain - Reference for the production-observability platform that surfaces per-trace and per-session token spend, useful for the budget-audit-log material in this chapter.

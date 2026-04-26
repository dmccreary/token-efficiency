# References: Structured Logging for LLM Calls

1. [Logging (computing)](https://en.wikipedia.org/wiki/Logging_(computing)) - Wikipedia - Foundational coverage of logging including structured-vs-unstructured tradeoffs and the JSON-line pattern used in this chapter's canonical schema.

2. [JSON](https://en.wikipedia.org/wiki/JSON) - Wikipedia - Reference for the JSON serialization format that every structured-logging schema in this textbook uses for log lines.

3. [OpenTelemetry](https://en.wikipedia.org/wiki/OpenTelemetry) - Wikipedia - Coverage of the vendor-neutral observability standard that defines the LLM semantic conventions referenced in this chapter and Chapter 10.

4. Observability Engineering - Charity Majors, Liz Fong-Jones, and George Miranda - O'Reilly - The canonical reference for high-cardinality structured logging; Chapter 4 on event-driven debugging maps directly to this textbook's per-request log line approach.

5. Site Reliability Engineering - Beyer, Jones, Petoff, Murphy (eds) - Google / O'Reilly - The free Google SRE book has chapters on monitoring distributed systems that inform the schema design covered here.

6. [OpenTelemetry GenAI Semantic Conventions](https://opentelemetry.io/docs/specs/semconv/gen-ai/) - OpenTelemetry - The official semantic conventions for LLM telemetry including the gen_ai.* attribute names that should appear in any vendor-neutral logging schema.

7. [The Twelve-Factor App: Logs](https://12factor.net/logs) - Adam Wiggins - The Heroku-era manifesto on treating logs as event streams; concise statement of the log-as-data-source mindset this chapter assumes.

8. [Honeycomb Blog: Structured Events](https://www.honeycomb.io/blog) - Honeycomb - Working notes on high-cardinality structured logging from the team behind one of the leading observability platforms; the structured-events posts pair well with this chapter.

9. [Datadog Logging Best Practices](https://www.datadoghq.com/blog/log-management/) - Datadog - Practical guide on log levels, structured fields, and retention policies; reinforces the schema-design choices in this chapter.

10. [Grafana Loki Documentation](https://grafana.com/docs/loki/latest/) - Grafana Labs - Reference for the open-source log aggregation system that pairs well with this textbook's per-request JSON log schema for high-cardinality LLM logs.

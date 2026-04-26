# References: Observability, Dashboards, and Alerting

1. [Observability](https://en.wikipedia.org/wiki/Observability) - Wikipedia - Coverage of the systems-theory origin of observability and how the three pillars (logs, metrics, traces) translate to software systems; foundational context for this chapter.

2. [Dashboard (business)](https://en.wikipedia.org/wiki/Dashboard_(business)) - Wikipedia - Background on visual data presentation including the design principles (drill-down, time-series aggregation, single-screen overview) used in this chapter's cost-dashboard examples.

3. [Anomaly detection](https://en.wikipedia.org/wiki/Anomaly_detection) - Wikipedia - Statistical and ML approaches to detecting metric outliers; informs the alerting-rule design covered here for token-spike and cost-threshold alerts.

4. Observability Engineering - Charity Majors, Liz Fong-Jones, and George Miranda - O'Reilly - The definitive reference for modern observability practice including the high-cardinality dashboard patterns this chapter applies to LLM cost.

5. The Site Reliability Workbook - Beyer, Murphy, Rensin, Kawahara, Thorne (eds) - Google / O'Reilly - Companion to the SRE book with practical chapters on alerting philosophy, SLO design, and on-call rotation that frame the alerting rules in this chapter.

6. [Grafana Documentation](https://grafana.com/docs/grafana/latest/) - Grafana Labs - Reference for the most widely used open-source dashboard tool; covers the panel types, query languages, and alerting features used in this chapter's examples.

7. [Prometheus Alerting Documentation](https://prometheus.io/docs/alerting/latest/overview/) - Prometheus - Reference for the de-facto standard alerting-rule language including the for-clause time-window pattern used in this chapter's burn-rate alerts.

8. [Charity Majors Blog: Sociotechnical Observability](https://charity.wtf/) - Charity Majors - Working notes on the why-and-how of observability from the co-founder of Honeycomb; influences the team-process recommendations in this chapter.

9. [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/) - Google - The four-golden-signals framework (latency, traffic, errors, saturation) adapted in this chapter for LLM-specific signals (token volume, cache hit rate, cost burn rate).

10. [Anthropic Engineering Blog](https://www.anthropic.com/engineering) - Anthropic - Periodic posts on observability practices for LLM-using systems; pairs well with this chapter for vendor-specific dashboard patterns.

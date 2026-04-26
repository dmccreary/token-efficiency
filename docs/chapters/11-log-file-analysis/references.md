# References: Log File Analysis and Cost Hotspots

1. [Log analysis](https://en.wikipedia.org/wiki/Log_analysis) - Wikipedia - Coverage of the broader discipline including pattern recognition, normalization, and correlation across log sources that this chapter applies to LLM call logs.

2. [Pareto principle](https://en.wikipedia.org/wiki/Pareto_principle) - Wikipedia - The 80/20 rule that motivates the top-N-cost-drivers analysis pattern central to this chapter; understanding it explains why most LLM cost optimizations target a small number of features.

3. [Percentile](https://en.wikipedia.org/wiki/Percentile) - Wikipedia - Mathematical foundation for the P50/P95/P99 reporting used throughout this chapter to surface long-tail cost without being misled by means.

4. Designing Data-Intensive Applications - Martin Kleppmann - O'Reilly - Chapters on stream processing and aggregation underpin the log-analysis pipelines this chapter constructs.

5. Site Reliability Engineering - Beyer, Jones, Petoff, Murphy (eds) - Google / O'Reilly - Chapters on postmortem analysis and incident review provide the framework for the cost-spike investigation pattern in this chapter.

6. [DuckDB Documentation](https://duckdb.org/docs/) - DuckDB - Reference for the embedded analytical database used in this chapter's examples for ad-hoc log analysis without setting up a full warehouse.

7. [Pandas DataFrame Documentation](https://pandas.pydata.org/docs/) - pandas - Reference for the Python data-analysis library used in this chapter's notebooks for groupby, percentile, and time-series aggregation operations on log files.

8. [Grafana Loki LogQL](https://grafana.com/docs/loki/latest/query/) - Grafana Labs - Reference for the query language used to slice and aggregate structured logs at scale; directly applicable to the per-feature and per-user roll-ups in this chapter.

9. [Google SRE: Postmortem Culture](https://sre.google/sre-book/postmortem-culture/) - Google - The blameless-postmortem framework adapted in this chapter for cost-spike analysis; explains how to write up a finding that drives a structural fix.

10. [Splunk Search Reference](https://docs.splunk.com/Documentation/Splunk/latest/SearchReference/WhatsInThisManual) - Splunk - Reference for the SPL query language used in many enterprises for log analysis; relevant for engineers whose org uses Splunk rather than open-source tools.

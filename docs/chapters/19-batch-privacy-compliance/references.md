# References: Batch Job Operations, Privacy, and Compliance

1. [Batch processing](https://en.wikipedia.org/wiki/Batch_processing) - Wikipedia - Foundational coverage of the asynchronous-job-submission pattern that LLM batch APIs implement at half the synchronous cost.

2. [General Data Protection Regulation](https://en.wikipedia.org/wiki/General_Data_Protection_Regulation) - Wikipedia - Comprehensive coverage of the EU privacy regime including data subject rights and lawful bases for processing that constrain LLM logging schemas.

3. [Health Insurance Portability and Accountability Act](https://en.wikipedia.org/wiki/Health_Insurance_Portability_and_Accountability_Act) - Wikipedia - Coverage of the US healthcare privacy law that drives PHI redaction requirements in healthcare-adjacent LLM applications.

4. Designing Data-Intensive Applications - Martin Kleppmann - O'Reilly - The chapters on batch and stream processing provide the broader systems context for the LLM batch-API material in this chapter.

5. The Privacy Engineer's Manifesto - Michelle Dennedy, Jonathan Fox, and Tom Finneran - Apress - Practical reference for privacy-by-design including the redaction, hashing, and retention strategies this chapter applies to LLM logs.

6. [Anthropic Batch API Documentation](https://docs.anthropic.com/en/docs/build-with-claude/batch-processing) - Anthropic - Authoritative reference for the Message Batches API including submission format, polling, idempotency, and the 50% discount used in this chapter's worked examples.

7. [OpenAI Batch API Documentation](https://platform.openai.com/docs/guides/batch) - OpenAI - Reference for OpenAI's batch endpoint including JSONL input format, status polling, and discount structure that mirrors Anthropic's design.

8. [Google Gemini Batch Mode](https://ai.google.dev/gemini-api/docs/batch-mode) - Google - Reference for Gemini's batch processing including the discount structure and submission format used in this chapter's cross-vendor comparisons.

9. [NIST Privacy Framework](https://www.nist.gov/privacy-framework) - NIST - The US standards body's privacy risk-management framework; useful for engineers building enterprise compliance programs around LLM logging.

10. [AICPA SOC 2 Trust Services Criteria](https://www.aicpa-cima.com/topic/audit-assurance/audit-and-assurance-greater-than-soc-2) - AICPA - The reporting standard most enterprises require for vendor due diligence; understanding it helps engineers design LLM logging that survives a SOC 2 audit.

# Glossary of Terms

#### A/B Testing

A controlled experiment comparing two (or more) variants—a control and a treatment—against a primary metric, with random assignment to groups and statistical analysis to determine winner.

**Example:** A/B testing a 30-percent-shorter system prompt against the original measures whether the cost saving is real and quality is preserved.

#### Agent Budget Policy

A documented set of limits on agent token consumption—per session, per tool call, per repository, per pull request—enforced by the harness or middleware.

Without an agent budget policy, a single misbehaving agent can run up four-figure bills overnight.

**Example:** An agent budget policy capping any single Claude Code session at 300,000 tokens prevents runaway loops from billing through the floor.

#### Agent Memory

Information an agent retains across turns or sessions—file contents, prior decisions, user preferences—stored either in conversation context or external memory files.

**Example:** Claude Code's agent memory includes the project CLAUDE.md and any explicit notes the model writes to disk for itself.

#### Agentic Loop

The control structure in which a model issues a tool call, the harness executes it, results return, and the model issues the next call, iterating until a stop condition is met.

The agentic loop is where token spend silently compounds—every iteration replays the entire prior history as input.

**Example:** A debugging agent enters an agentic loop reading three files, running tests, and editing code, accumulating 80,000 input tokens by iteration ten.

#### Aggregation Period

The time bucket over which raw events are summarized—minute, hour, day—chosen to balance dashboard freshness against storage and query cost.

**Example:** A daily aggregation period for the cost dashboard is fine; an hourly aggregation period is needed to catch burn-rate spikes early.

#### AI Coding Harness

An interactive tool that wraps a language model with file-system access, shell execution, and editor controls so the model can read, modify, and ship code in a developer's environment.

**Example:** Claude Code, OpenAI Codex CLI, and Google Antigravity are AI coding harnesses—each layers a system prompt, tool loop, and session state on top of the underlying model.

#### Alerting Rule

A declarative threshold or anomaly check that fires a notification when violated, expressed as a metric query plus a condition.

**Example:** An alerting rule "page on-call when hourly cost exceeds \$100 for three consecutive hours" catches sustained burn-rate spikes.

#### Analysis Notebook

A Jupyter or similar notebook combining queries, charts, and narrative used by engineers and data scientists to explore cost data and produce shareable findings.

**Example:** An analysis notebook walks through last month's spend spike, showing the query, the offending feature, and the fix—reproducible and reviewable.

#### Anomaly Detection

Statistical or rule-based identification of metric values that deviate materially from expected patterns, triggering alerts before bills explode.

**Example:** Anomaly detection on hourly cost flags a 5x spike at 2 AM, surfacing a runaway agent loop before the morning standup.

#### Anonymization Strategy

The end-to-end plan for removing or transforming personally identifiable information across prompts, logs, and vendor calls so individuals cannot be re-identified from stored data.

**Example:** An anonymization strategy combining hashing of identifiers, redaction of free-text PII, and aggregation thresholds in reporting reduces reidentification risk to acceptable levels.

#### Anthropic API

The HTTP interface Anthropic exposes for invoking Claude models, accepting JSON request bodies and returning structured responses; the canonical surface is the Messages API.

**Example:** A POST to `https://api.anthropic.com/v1/messages` with a model identifier and a list of messages returns a Claude completion.

#### Anthropic Batch API

Anthropic's asynchronous endpoint accepting many requests at once and delivering results within twenty-four hours at a fifty percent discount; suited to bulk evaluation, embedding generation, and offline analysis.

**Example:** Nightly bulk classification of 100,000 support tickets moves to the Anthropic Batch API, halving cost without affecting product latency.

#### Anthropic Prompt Caching

A feature that lets callers mark stable prefixes of a prompt for caching, reducing the cost of subsequent requests sharing that prefix to roughly ten percent of the input rate.

Prompt caching is the single highest-leverage optimization in this textbook—done right, it can cut steady-state cost by an order of magnitude.

**Example:** Marking a 50,000-token system prompt with `cache_control` makes every subsequent request that begins with the same prefix bill the cached portion at the discounted rate.

#### Anthropic SDK

The official client library Anthropic publishes for Python, TypeScript, and other languages, wrapping the HTTP API with typed helpers, streaming support, and retry logic.

**Example:** `from anthropic import Anthropic; client = Anthropic()` is the standard entry point in Python applications.

#### Anthropic Skill Format

The canonical skill file layout Anthropic uses with Claude Code, comprising frontmatter, a markdown body, and optionally bundled scripts and assets, loaded on demand by the harness.

**Example:** The Anthropic skill format expects a `name`, `description`, and markdown body—any deviations may not load correctly into Claude Code.

#### Anthropic Streaming

The server-sent-events delivery mode for the Messages API, emitting incremental content blocks and a final usage event so clients can render output progressively and capture token counts at completion.

**Example:** Streaming a long Claude response lets the UI display partial output immediately while still recording the final input and output token counts for billing.

#### Anthropic System Prompt

The top-level `system` parameter on the Messages API, distinct from the messages array, used to set role, tone, constraints, and tool-use policy; cacheable when long.

**Example:** `system=[{"type": "text", "text": "You are a senior engineer...", "cache_control": {"type": "ephemeral"}}]` is a cacheable Anthropic system prompt.

#### Antigravity Workspace

A persisted Google Antigravity environment scoped to a project, with its own memory files, history, and configuration; the unit of state for an Antigravity user.

**Example:** Each repository gets its own Antigravity workspace so memory files and conventions stay project-scoped.

#### API Key Management

The discipline of generating, storing, rotating, and scoping vendor API keys, including secrets-store integration and per-environment separation to limit blast radius.

**Example:** Production keys live in a vault, are scoped to the production project, and rotate quarterly; never in committed source code or chat logs.

#### Assistant Message

A message in the conversation array attributed to the model, either a prior response replayed for context or the slot the model is currently generating into.

**Example:** Multi-turn chat sends prior assistant messages back as input on each turn so the model sees what it said before—those tokens are billed as input every time.

#### Asynchronous API

An API pattern where the caller submits a job and polls or receives a webhook when results are ready, decoupling submission from completion.

**Example:** An asynchronous API for batch generation accepts a JSONL file at submission time and provides a job ID for later result retrieval.

#### Audit Trail

A tamper-resistant record of who did what when, used to support compliance audits, incident investigations, and access reviews.

**Example:** An audit trail captures every API key issuance, prompt review, and budget override, satisfying SOC 2 and post-incident analysis.

#### Auto Compaction

A harness feature that triggers compaction automatically when the conversation crosses a threshold, without requiring the user to invoke it.

**Example:** Claude Code's auto compaction kicks in around 80 percent of the model's context window, swapping older turns for a compressed summary.

#### Autoregressive Generation

A decoding strategy in which a model produces output one token at a time, conditioning each new token on the previously generated sequence and the original prompt.

**Example:** Streaming responses arrive token-by-token because the model is generating autoregressively—each output token must finish before the next can start, making output tokens a serial bottleneck.

#### Backoff Strategy

The schedule of wait times between retries—exponential, linear, jittered—designed to avoid thundering herds when many clients retry simultaneously.

**Example:** A backoff strategy of `2^attempt + random jitter` prevents synchronized retries across thousands of clients hammering a recovering vendor.

#### Baseline Cost Measurement

A documented snapshot of cost before an optimization, the reference point against which improvements are measured; without a baseline, savings are anecdote, not data.

**Example:** Baseline cost measurement of \$3,200 per week on the summarize feature before optimization makes the post-optimization \$1,800 figure a defensible 44 percent reduction.

#### Batch API

An asynchronous API endpoint accepting many requests at once and delivering results within a published window (typically 24 hours) at a meaningful discount, available across major vendors.

**Example:** Anthropic, OpenAI, and Google all offer Batch APIs with roughly 50 percent discounts, suited to overnight evaluation, embedding regeneration, and offline classification.

#### Batch Discount

A discount—typically fifty percent—offered when requests are submitted to an asynchronous batch endpoint with a delivery window measured in hours rather than seconds.

**Example:** Nightly embedding regeneration moves from the synchronous API to the batch API, halving cost in exchange for next-morning delivery.

#### Batch Discount Rate

The specific percentage discount applied to batch traffic versus synchronous, typically 50 percent across major vendors.

**Example:** A 50 percent batch discount rate on a 1-million-token offline job saves approximately fifteen dollars at standard Sonnet input pricing.

#### Batch Job Status

The lifecycle state of a batch job—`validating`, `in_progress`, `completed`, `failed`, `cancelled`—polled until terminal.

**Example:** Polling batch job status every five minutes catches a failed job early instead of waiting until next morning to discover the input was malformed.

#### Batch Job Submission

The act of uploading a batch input file (JSONL of requests) to the vendor and receiving a job ID, the entry point to the batch workflow.

**Example:** Batch job submission via `client.batches.create(input_file_id=...)` returns a job ID used for subsequent status polling.

#### Batch Versus Synchronous

The architectural choice between submitting work to a batch endpoint (cheaper, slower) and the synchronous endpoint (faster, full-price), made per use case based on latency tolerance.

**Example:** Batch versus synchronous comes down to "does the user wait for this answer?"—if no, batch saves half on cost.

#### Batch Window

The published time range within which batch results are guaranteed delivered (typically 24 hours), the latency tolerance accepted in exchange for the discount.

**Example:** A 24-hour batch window means submitting at 8 PM gets results by 8 PM the next day—plan around it for time-sensitive workloads.

#### Before-After Report

A comparison document showing baseline cost, post-change cost, and the methodology connecting them, the standard artifact of a successful optimization.

**Example:** A before-after report on the prompt-caching rollout shows \$8,000/week before, \$3,400/week after, and includes the cache-hit-rate dashboard demonstrating the mechanism.

#### Beginning-Of-Sequence Token

A special token marking the start of a sequence, prepended automatically by some tokenizers and required by some models for correct conditioning.

**Example:** Forgetting to prepend the beginning-of-sequence token when using a raw tokenizer locally can shift output distributions in subtle ways.

#### BM25 Retrieval

A classical lexical retrieval algorithm scoring documents by term-frequency and inverse-document-frequency, used standalone or as the keyword half of hybrid retrieval. BM25 stands for Best Match 25.

**Example:** BM25 retrieval over Elasticsearch on a code corpus catches exact API names embeddings sometimes miss.

#### BPE Merge Rules

The ordered list of byte-pair merge operations learned during Byte Pair Encoding training, applied at tokenization time to deterministically produce token sequences from raw text.

**Example:** A merge rule like `("h", "e") -> "he"` converts the character pair into a single token whenever it appears in input.

#### Budget Audit Log

A log of every budget-relevant decision—budget set, raised, exhausted, blocked—useful for postmortems and ensuring policies are actually enforced.

**Example:** A budget audit log records "user X hit per-session limit at 13:42, action: terminate," available for review when the user complains.

#### Budget Exhaustion Handling

The specific code path triggered when a budget is fully consumed—saving partial results, notifying the user, or auto-escalating to manual approval.

**Example:** Budget exhaustion handling on an autonomous agent saves work-in-progress and emails the engineer rather than silently terminating mid-task.

#### Budget Notification

An automated alert—email, Slack message, dashboard banner—warning users they are approaching or have exceeded a budget threshold.

**Example:** A budget notification at 80 percent of weekly spend gives the engineer a heads-up before the hard cap kicks in mid-debugging.

#### Budget Policy Document

The written, version-controlled artifact specifying budgets, escalation rules, and exception processes—the source of truth for what is and is not allowed.

**Example:** A budget policy document declares per-session, per-user, and per-feature caps and the exception process; engineering links to it from runbooks.

#### Budget Reporting

Periodic reports surfacing actual spend versus budget by team, feature, and engineer, the artifact that closes the FinOps feedback loop.

**Example:** Budget reporting in a Friday email shows each engineer's Claude Code spend versus their weekly cap, normalizing visibility without shaming.

#### Budget Versus Outcome

A reporting view comparing dollars spent against business outcomes produced—PRs merged, tickets closed, incidents resolved—to show whether spend is buying real value.

**Example:** Budget versus outcome reveals one team's \$8,000 weekly spend produces 60 merged PRs while another's \$2,000 produces 80—signal for workflow review.

#### Bundled Script

A program file shipped inside a skill bundle that the model invokes via the shell tool rather than reimplementing the logic in natural language.

**Example:** A bundled script `convert.py` does the actual PDF rendering, so the skill body can be a short instruction telling the model to run it.

#### Burn Rate

The rate at which token spend is accumulating, expressed in dollars per hour or dollars per day, used to detect anomalies and forecast month-end totals from partial data.

**Example:** A burn rate of \$50/hour through the first week projects to roughly \$36,000 monthly; a sudden jump to \$200/hour triggers a cost threshold alert.

#### Byte Pair Encoding

A subword tokenization algorithm that iteratively merges the most frequent adjacent byte or character pair in a training corpus to build a vocabulary, balancing rare-word coverage against vocabulary size.

**Example:** Byte Pair Encoding turns "unhappiness" into "un" + "happi" + "ness" rather than allocating a dedicated vocabulary slot for the full word.

#### Cache Aware Routing

A request-routing strategy that prefers an instance or region with a warm cache for a given prompt prefix, raising hit rate and lowering cost.

**Example:** Cache aware routing pins related sessions to the same backend so the second request hits a cache the first one populated.

#### Cache Boundary

The exact position in the prompt where cacheable prefix ends and volatile content begins; placement is the architectural decision that drives cache hit rate.

See also: Cache Breakpoint.

**Example:** A cache boundary placed too low (before unchanging tool definitions) leaves cacheable tokens uncached; placed too high (above volatile content) it never hits.

#### Cache Breakpoint

The token boundary in a prompt at which a cache_control marker is placed, defining the exact prefix that becomes cacheable; choosing the breakpoint correctly is what separates a useful cache from a useless one.

See also: Stable Prefix.

**Example:** Place the cache breakpoint after the static system prompt and tool definitions but before the volatile conversation history, so the cacheable prefix is invariant across requests.

#### Cache Control Parameter

The `cache_control` field on a content block in the Anthropic Messages API that marks the boundary up to which the prefix should be cached, typically with `{"type": "ephemeral"}`.

**Example:** Adding `cache_control={"type": "ephemeral"}` to the final block of a long system prompt instructs Anthropic to cache everything up through that block.

#### Cache Cost Savings

The dollar amount saved on a request thanks to cache hits, computed as cached_tokens × (input_price − cached_price).

**Example:** Cache cost savings on a 30,000-cached-token request at standard Sonnet pricing is approximately \$0.081 per call—roughly \$2,400 monthly at one million calls.

#### Cache Eviction

The removal of an entry from the cache before its TTL expires, typically due to capacity pressure on the cache shard.

**Example:** Cache eviction during a traffic spike on a vendor's shared cache means even within-TTL prefixes can miss—plan for it in cost forecasts.

#### Cache Hit

A request whose prefix matches an entry in the prompt cache, billed at the discounted cached input rate; the desired outcome that pays back the cache write cost.

**Example:** A cache hit on a 50,000-token prefix at 10 percent of standard pricing saves about \$1.35 per call versus a cold read.

#### Cache Hit Rate

The fraction of cacheable requests that hit an existing cache entry, the headline metric for prompt-cache effectiveness.

**Example:** Lifting cache hit rate from 35 percent to 85 percent on a steady-state workload cuts input costs by roughly 50 percent on the affected calls.

#### Cache Hit Rate Metric

A specific metric tracking cache hits divided by cacheable requests over time, broken down by feature and prompt template; the actionable form of cache health.

**Example:** A cache hit rate metric alert at "below 60 percent for 30 minutes" pages on-call when a deploy accidentally invalidates the cache.

#### Cache Invalidation

The natural or forced expiration of a cache entry—via TTL, eviction, or content change—after which a request hits the standard input rate again.

**Example:** Editing a single character in the system prompt forces cache invalidation; subsequent requests pay full price until the cache repopulates.

#### Cache Invariant

A property of a prompt that must remain true for caching to be effective—byte-identical prefix, stable token boundary, content above the breakpoint never mutating.

**Example:** A cache invariant of "system prompt comes first, never below the breakpoint" is violated when a developer reorders blocks for readability—killing cache hits silently.

#### Cache Key

The hash or fingerprint identifying a cached prefix; matches when the candidate prefix is byte-identical at the token level up through the cache breakpoint.

**Example:** Even a single trailing space changes the cache key, causing what looks like a duplicate prompt to miss the cache—a classic boundary footgun.

#### Cache Miss

A request whose prefix does not match any cached entry, billed at the full input rate and writing a new entry for future hits.

**Example:** A cache miss on the first call after a system-prompt edit pays full price; subsequent calls within the cache TTL hit the new entry.

#### Cache Monitoring

Instrumenting and tracking cache behavior—hit rate, savings, breakpoint stability—so caching regressions are detected before they show up on the bill.

**Example:** Cache monitoring caught the day someone reformatted the system prompt and dropped cache hit rate from 88 percent to 12 percent overnight.

#### Cache Read Tokens

Tokens served from prompt cache on a cache-hit request, billed at the discounted cached input rate and reported separately in the usage object.

**Example:** A response usage block reporting `cache_read_input_tokens: 12000` confirms that 12,000 tokens were served from cache and billed at the cheaper rate.

#### Cache Stampede

A pathological pattern where many concurrent requests all miss the cache simultaneously and each writes a new entry, multiplying cost and load.

**Example:** A cache stampede after a deploy invalidates the cache; the first hundred requests all pay full input price plus write premium before any of them hits.

#### Cache TTL

The time-to-live for a prompt cache entry; Anthropic's default ephemeral cache lives roughly five minutes from last use, with a longer one-hour option available on supported models.

**Example:** A cache TTL of five minutes means a request arriving six minutes after the last hit will miss and pay full input price to repopulate.

#### Cache Warming

Issuing a synthetic request whose only purpose is to populate the cache before real traffic arrives, ensuring the first user-facing call hits.

**Example:** A cache warming call at 6 AM populates the day's primary system prompt so morning traffic enjoys cache hits from the first request.

#### Cache Write Tokens

Tokens written into the prompt cache during a cache-miss request, sometimes billed at a small premium over standard input price; pays itself back on subsequent hits.

**Example:** Anthropic charges a 25 percent premium on cache write tokens, recouped after just three to four cache hits at ten percent read pricing.

#### Cached Input Price

The discounted per-million-token rate charged for input tokens served from prompt cache instead of reprocessed; commonly ten percent of the standard input rate, the largest single lever in cost optimization.

**Example:** Cached reads at approximately \$0.30 per million versus \$3.00 standard yields a tenfold savings on the cached portion of every cache-hit request.

#### Cached Token

An input token served from a vendor's prompt cache rather than reprocessed from scratch, billed at a discounted rate—commonly ten percent of the standard input price.

**Example:** A 10,000-token system prompt reused across 1,000 requests within the cache window costs full price once and the discounted cached rate the other 999 times.

#### Cached Token Field

A log field reporting tokens served from prompt cache, billed at the discounted rate and used to compute cache hit rate metrics.

**Example:** A cached token field of 12,000 against an input token field of 14,000 means an 86 percent cache hit on that request.

#### Canary Deployment

A pattern where a new version handles a tiny slice of production traffic alongside the old version, with automated rollback on metric regression.

**Example:** A canary deployment of a prompt template change at 1 percent traffic with auto-rollback on cost or quality regression catches bad changes before they hit everyone.

#### Cardinality Concern

The risk of a high-cardinality label (user ID, request ID, full prompt) blowing up metric storage costs in time-series databases.

**Example:** Tagging a metric with `user_id` introduces a cardinality concern—use it as a log field instead, with the metric tagged only by aggregate dimensions.

#### Chain Of Thought

A prompting technique encouraging the model to write out intermediate reasoning steps before the answer, lifting accuracy on hard problems at the cost of more output tokens.

**Example:** Adding "Think step by step" triggers chain of thought, doubling output tokens on a math problem but lifting accuracy from 60 percent to 85 percent.

#### Chat Completions API

OpenAI's longstanding chat-style endpoint accepting a list of role-tagged messages and returning a single assistant message; the surface most third-party SDKs target.

**Example:** `client.chat.completions.create(model="gpt-4o", messages=[...])` is the canonical Chat Completions API call.

#### Cheap-First Cascade

A routing pattern that tries the cheapest model first and escalates to a more expensive one only when the cheap model's confidence or quality fails a gate.

**Example:** A cheap-first cascade tries Haiku; if its confidence is below 0.7, it retries on Sonnet—paying full cost only on the harder fraction of traffic.

#### Chunk Overlap

The number of tokens shared between consecutive chunks, included to avoid splitting concepts across boundaries; raises storage and embedding cost in exchange for retrieval robustness.

**Example:** A chunk overlap of 50 tokens on 400-token chunks ensures a sentence spanning a chunk boundary appears in both neighbors and is retrievable from either.

#### Chunk Size

The token length of each chunk produced by chunking, a key knob trading recall (smaller chunks miss less) against context (larger chunks include more surrounding signal).

**Example:** A chunk size of 400 tokens is good for FAQ-style content; a chunk size of 1,200 is better for narrative documents where context spans paragraphs.

#### Chunking

The preprocessing step that splits source documents into smaller passages suitable for embedding and retrieval, balancing context completeness against retrieval precision.

**Example:** Chunking a 100-page PDF into 800-token passages produces roughly 150 chunks, each separately embeddable and retrievable.

#### Circuit Breaker Pattern

A reliability pattern that trips a circuit—blocking further calls—when failure or cost thresholds are exceeded, applied here to runaway agents and burst spend.

**Example:** A circuit breaker pattern on per-user spend trips at \$50 in an hour, blocking that user's calls until ops review reopens the circuit.

#### Citation Of Sources

The practice of having the model output references—document IDs, URLs, page numbers—alongside its answer so users can verify and so hallucinations are easier to detect.

**Example:** Citation of sources in a legal-research feature attaches `[doc_id:42, page:7]` markers, letting users click through and verify each claim.

#### Claude Code

Anthropic's official command-line AI coding harness pairing Claude with file-edit, shell, and git tools; used by engineering teams to delegate coding tasks to the model interactively.

**Example:** Running `claude` in a project directory starts a Claude Code session that can read your repo, edit files, run tests, and commit changes.

#### Claude Code Hooks

User-defined shell scripts that fire on Claude Code lifecycle events—Stop, PreCompact, etc.—enabling custom automation like auto-commits, telemetry, and cleanup.

**Example:** A Stop hook reads `.claude-pending-commit.txt` and commits any staged changes, ensuring no Claude Code edit goes uncommitted.

#### Claude Code Session

A single Claude Code conversation with accumulated history, tool results, and memory file context; bills tokens against the user's Anthropic account or subscription quota.

**Example:** A two-hour Claude Code session debugging a flaky test might reach 250,000 tokens of accumulated context before compaction kicks in.

#### Claude Haiku

Anthropic's fastest, cheapest Claude tier, designed for high-volume, latency-sensitive tasks like classification, extraction, and short-form generation.

**Example:** A spam-detection endpoint runs on Claude Haiku at a fraction of Sonnet's price and well within a 200-millisecond latency target.

#### Claude Messages API

Anthropic's primary chat-completion endpoint accepting a system prompt and a list of role-tagged messages, supporting tool use, prompt caching, streaming, and extended thinking.

**Example:** `client.messages.create(model="claude-sonnet", system=..., messages=[...], max_tokens=1024)` is the canonical Claude API call.

#### Claude Model Family

The set of models Anthropic ships under the Claude name—currently Opus, Sonnet, and Haiku—sharing API surface and tokenization but spanning a cost-quality range.

**Example:** A router uses Haiku for short classifications and Opus for hard reasoning, all through the same Messages API with only the model identifier changing.

#### Claude Opus

Anthropic's flagship Claude tier, optimized for the hardest reasoning, long-form writing, and agentic tasks; the most expensive option in the family with a corresponding output premium.

**Example:** A complex code refactor across twenty files might be assigned to Claude Opus where Sonnet would lose track of the dependencies.

#### Claude Sonnet

Anthropic's mid-tier Claude model, balancing quality and cost for most production workloads; the default choice when a task is non-trivial but does not justify Opus pricing.

**Example:** A customer support copilot uses Claude Sonnet because it handles nuanced cases without the per-call cost of Opus.

#### Claude Tokenizer

The tokenizer Anthropic uses for the Claude model family; not bundled in a public Python library, so accurate counting requires the Anthropic token-counting endpoint or a vendor-supplied utility.

**Example:** Estimating Claude token counts with tiktoken can be off by five to fifteen percent—use Anthropic's `count_tokens` endpoint for billing-grade accuracy.

#### Claude Tool Use

The Anthropic API feature allowing Claude to invoke caller-defined tools by emitting tool_use blocks; the caller executes the tool and returns a tool_result block on the next turn.

**Example:** Defining a `search_kb` tool lets Claude request a knowledge-base lookup mid-response; the caller runs the search and returns results, and Claude continues with the retrieved data.

#### Claude Vision Input

The image-input modality of Claude Messages API, accepting base64-encoded or URL-referenced images alongside text; image tokens count toward input budget at a vendor-published rate.

**Example:** Passing a screenshot of an error dialog as a Claude vision input lets the model read the message and propose fixes without OCR preprocessing.

#### Code Tokenization

Tokenizer behavior on source code, where indentation, brackets, and identifiers produce token patterns different from natural prose; code typically tokenizes to more tokens per character than English.

**Example:** A 1,000-character Python file is often 350 tokens versus 250 for the same character count of English text, due to dense punctuation.

#### Codex Session

A single Codex CLI conversation with accumulated history and tool results, billed against the user's OpenAI account.

**Example:** A Codex session refactoring a Django app over the lunch hour might consume 400,000 tokens across reasoning and chat, depending on routing.

#### Cohort Analysis

Comparing the cost or behavior of user groups defined by acquisition date, plan, or feature usage, used to detect shifts and validate pricing assumptions.

**Example:** Cohort analysis shows users from the November launch cost twice as much as October's cohort—signal for a new abuse pattern.

#### Comment Removal

Stripping inline comments and explanatory text from prompt fragments, scripts, or schemas embedded in a prompt that the model does not need at runtime.

**Example:** Comment removal on an embedded JSON Schema strips description fields once the prompt is stable, saving 200 tokens per call.

#### Compaction Strategy

The deliberate plan for when and how to compact conversation history—threshold, summary granularity, what is preserved verbatim—often documented and tested independently of the chat code path.

**Example:** A compaction strategy compresses everything older than the last twenty turns into a hierarchical summary once total tokens cross 80 percent of the context window.

#### Completion Tokens Field

The `completion_tokens` integer in the OpenAI usage object reporting output tokens generated by the model on a request, billed at the output rate.

**Example:** Reading `completion_tokens` from streamed responses' final chunk lets you bill accurately even when the response was cancelled mid-stream.

#### Compliance Risk

The risk that a system violates a regulatory requirement (GDPR, HIPAA, SOC 2) due to logging, retention, or vendor-data-handling practices, exposing the company to fines or audit findings.

**Example:** A compliance risk emerges when prompt logs containing customer health data are retained without HIPAA-compliant safeguards.

#### Concise Mode

A configurable mode (vendor-provided or implemented in prompt) that biases the model toward shorter outputs at the cost of some elaboration.

**Example:** Enabling concise mode on a documentation-search endpoint cuts average output tokens by 40 percent—appropriate when users want answers, not essays.

#### Concise Output Instruction

An explicit instruction to be brief, included in the system prompt or user message to reduce output token count without sacrificing necessary information.

**Example:** Adding "Respond in three sentences or fewer." as a concise output instruction can cut output tokens by 40 percent on chat-style endpoints.

#### Confidence Interval

A range of values within which the true effect size is expected to lie with a stated probability—typically 95 percent—often more useful than a p-value alone.

**Example:** A 95 percent confidence interval on cost savings of [3.1 percent, 7.8 percent] communicates magnitude and uncertainty better than "p = 0.04."

#### Confidence Threshold

A scalar cutoff applied to the cheap model's self-reported or computed confidence score, below which the request is escalated.

**Example:** A confidence threshold of 0.85 escalates the bottom 15 percent of cheap-model calls to a stronger model—usually a sweet spot between cost savings and quality.

#### Context Eviction Policy

A documented rule for which conversation messages or retrieved chunks are dropped first when the budget is exceeded—oldest first, lowest-relevance first, or hybrid.

**Example:** A context eviction policy of "compact the oldest non-tool-result messages first" preserves recent tool results while freeing space.

#### Context Injection

The act of inserting retrieved documents into the prompt before the user question, producing the augmented prompt the model actually sees.

**Example:** Context injection formats retrieved chunks as "Context:\n<doc1>\n\n<doc2>\n\nQuestion: <user_question>" so the model knows what is grounding and what is asked.

#### Context Length

The actual number of tokens present in a specific request's prompt and accumulated conversation history, distinct from the maximum window the model supports.

Contrast with: Context Window.

**Example:** A chat session might have a context length of 35,000 tokens inside a model with a 200,000-token context window.

#### Context Pruning

Removing or shortening retrieved chunks before injection—via summarization, deduplication, or relevance filtering—to control prompt size.

**Example:** Context pruning with a relevance threshold drops chunks scoring below 0.6, often removing half the retrieved set with no quality loss.

#### Context Quality Decay

The phenomenon where model output quality degrades as context length grows, even when nominally within the context window; documented at long-context lengths and across models.

**Example:** Context quality decay on a 600,000-token Gemini call manifests as the model ignoring instructions stated 400,000 tokens earlier—test before relying on long context.

#### Context Quality Metric

A metric measuring how useful the retrieved-and-injected context was to the model, often via offline judge or downstream answer accuracy.

**Example:** A context quality metric computed as "fraction of injected chunks the answer actually cites" surfaces wasted context primed for pruning.

#### Context Reordering

Rearranging context elements—putting the most important content at the start or end—to mitigate lost-in-the-middle and other context-quality decay effects.

**Example:** Context reordering on retrieved chunks places the highest-relevance chunk at the end of the context block, just before the user question, where the model attends most.

#### Context Truncation

Forcibly cutting the prompt to fit within a budget, typically by removing oldest messages first; the crudest compaction strategy.

**Example:** Context truncation drops the oldest two turns when the prompt would exceed 100,000 tokens, accepting some quality loss to preserve the call.

#### Context Window

The maximum number of tokens—input plus output combined—a model can process in a single request, set by the model's architecture and training.

**Example:** Claude Sonnet's 200,000-token context window means the entire prompt and the generated response together must fit under that ceiling.

#### Context Window Budget

A planned allocation of the model's context window across system prompt, retrieved context, conversation history, and headroom for output.

**Example:** A context window budget for a 200,000-token Sonnet might allocate 8,000 to system, 30,000 to retrieved context, 100,000 to history, and reserve 60,000 for safety and output.

#### Continuous Cost Monitoring

The ongoing operation of dashboards, alerts, and reports tracking AI cost in production, the operational counterpart to a one-shot optimization sprint.

**Example:** Continuous cost monitoring catches the day a new feature ramped from 1 percent to 100 percent of users and tripled token spend overnight.

#### Control Group

The subset of users or requests in an A/B test receiving the unchanged baseline behavior, against which the treatment group is compared.

**Example:** The control group continues to receive the original system prompt while the treatment group receives the new one.

#### Conversation Compaction

The process of replacing accumulated conversation history with a shorter summary, reducing input token count while preserving enough context for the agent to continue work.

**Example:** When a Claude Code session crosses 80 percent of its context window, conversation compaction summarizes the first hundred turns into 5,000 tokens.

#### Conversation Summarization

Replacing older conversation turns with a compact summary while keeping recent turns verbatim, preserving long-range memory at a fraction of the token cost.

**Example:** Conversation summarization replaces the first hour of chat with a 1,000-token "summary so far" block, freeing context window for upcoming turns.

#### Conversation Turn

A single round-trip in a multi-turn dialogue consisting of one user message and the model's resulting assistant response, often accompanied by tool calls and results.

**Example:** A ten-turn debugging session sends turn one's content as input on turn ten, accumulating cost as the conversation grows.

#### Cost Attribution

The practice of tagging every API call with enough metadata (feature, user, environment, version) to roll spend up along any axis after the fact.

Without attribution, an unexpected cost spike is impossible to diagnose—you see the bill but cannot find the cause.

**Example:** Each log line carries `feature_tag`, `user_id`, `model`, and `prompt_version` so a daily report can show which combinations drive spend.

#### Cost Cap

A hard-dollar limit per session, per user, or per feature, refusing further calls when reached; the bluntest but most reliable cost guardrail.

**Example:** A cost cap of \$5 per Claude Code session ends the session with a clear message when reached, no exceptions.

#### Cost Dashboard

A dashboard focused on token cost—total spend, spend by feature, spend by model, week-over-week deltas, and forecasted month-end—used by FinOps and engineering leadership.

**Example:** The morning cost dashboard surfaces a sudden 40 percent spend jump on the `transcribe` feature, triggering a same-day investigation.

#### Cost Field

A log field reporting the dollar cost of the call, computed from token counts and the model's price tier; the most directly useful field for FinOps dashboards.

**Example:** Summing the cost field over a feature_tag group produces the per-feature cost roll-up directly.

#### Cost Hotspot

A specific component, feature, prompt, or user driving disproportionate spend, surfaced by Pareto analysis and prioritized for optimization.

**Example:** A cost hotspot in the `extract-entities` feature uses an Opus call where Haiku would suffice—a single-line routing change cuts that hotspot by 90 percent.

#### Cost Metric

A metric reporting dollar or token cost, used as a primary metric in optimization experiments and as a guardrail in feature experiments.

**Example:** Per-call cost as the cost metric lets the experiment platform plot a 99-percent-confidence interval on the savings.

#### Cost Per Feature

The total spend attributable to a specific product feature over a time window, computed by summing per-request costs filtered by a feature tag in structured logs.

**Example:** "Document summarization" might roll up to \$1,840 last month, while "tag suggester" rolls up to \$120—signal for which feature to optimize first.

#### Cost Per Outcome

The amortized cost of producing one successful business outcome (a closed support ticket, a generated report, a merged pull request), accounting for retries and quality failures.

**Example:** If three out of four agent runs succeed, the cost per outcome is the per-run cost divided by 0.75—often used to justify a more expensive but more reliable model.

#### Cost Per Request

The total token cost of a single API call computed by combining input, cached, and output token counts with their respective rates; the most granular billing primitive.

\[
\text{Cost} = \frac{T_i \cdot P_i + T_c \cdot P_c + T_o \cdot P_o}{1{,}000{,}000}
\]

**Example:** A request with 5,000 input, 8,000 cached, and 1,000 output tokens at standard rates costs about \$0.033.

#### Cost Per User

The average or distributional spend per user account over a period, exposing whether power users dominate cost and informing pricing tier design.

**Example:** Median user costs \$0.12/month while the 99th percentile costs \$48/month—evidence the abuse case needs a per-user budget.

#### Cost Reduction Postmortem

A blameless review of a major cost incident or successful optimization, capturing root cause, response, lessons learned, and follow-up actions.

**Example:** A cost reduction postmortem on the day a runaway agent loop billed \$3,000 documents the missing budget cap and tracks the structural fix to closure.

#### Cost Reduction Target

A quantified goal for cost reduction over a period—percentage, dollar, or per-call—against which the team's progress is measured.

**Example:** A cost reduction target of 30 percent over the next quarter focuses prioritization and creates accountability without prescribing the techniques.

#### Cost Threshold Alert

A specific alerting rule firing when daily or monthly spend crosses a configured ceiling, ensuring budget overruns are noticed in real time.

**Example:** A cost threshold alert at 80 percent of monthly budget gives engineering ten days to investigate before the limit is reached.

#### Cost-Latency Tradeoff

The relationship between dollars spent and end-to-end response time; smaller models are usually cheaper and faster, but reasoning models can be more expensive and slower than chat models.

**Example:** OpenAI o1 may cost more and take longer than GPT-4o on the same task, accepted in exchange for higher accuracy on hard reasoning problems.

#### Cost-Quality Tradeoff

The relationship between dollars spent and output quality on a given task, expressed as a curve along which faster, cheaper models produce lower-quality answers and vice versa.

See also: Pareto Frontier.

**Example:** Routing simple queries to Haiku and complex ones to Opus traces a deliberate path along the cost-quality tradeoff rather than paying Opus prices for everything.

#### Counter Metric

A monotonically increasing metric counting events, suited to "how many" questions like total tokens billed, total requests, or total cache hits.

**Example:** A counter metric `llm.input_tokens.total{model="sonnet"}` increments on every call by that call's input token count.

#### Cross-Encoder Reranker

A reranker built on a cross-encoder model that scores query-document pairs jointly rather than independently, achieving higher precision at the cost of more compute.

**Example:** A cross-encoder reranker over Cohere or Voyage's reranking API scores 50 candidates and returns the top 5, materially improving retrieval precision.

#### Cross-Service Tracing

Correlating spans across multiple services—application, retrieval layer, LLM provider—using a shared trace identifier so end-to-end latency and cost can be attributed.

**Example:** Cross-service tracing reveals that the slow user-facing latency is dominated by a slow embedding lookup, not the LLM call itself.

#### Cross-Vendor Caching

The recognition that prompt caching mechanics differ across Anthropic, OpenAI, and Google, requiring vendor-specific implementations within a vendor-neutral abstraction.

**Example:** Cross-vendor caching means OpenAI's automatic prefix caching, Anthropic's explicit `cache_control`, and Gemini's named cached content all earn discounts via different code paths.

#### Cross-Vendor Routing

Routing across vendors (Anthropic, OpenAI, Google) rather than just within one vendor's family, useful for cost arbitrage, capacity, and reliability.

**Example:** Cross-vendor routing sends fast classification to Gemini Flash, complex code to Claude Sonnet, and structured extraction to GPT-4o, picking strengths.

#### Cross-Vendor Tokenizer Drift

The phenomenon where the same string produces materially different token counts under Claude, GPT, and Gemini tokenizers, complicating cost forecasting for vendor-portable applications.

This is a footgun for teams that estimate costs on one vendor and migrate to another without re-counting.

**Example:** A 10,000-token GPT prompt might count as 11,200 tokens on Claude and 9,400 on Gemini—differences large enough to flip routing decisions.

#### CUPED Adjustment

Controlled-experiment Using Pre-Experiment Data—a variance-reduction technique using each user's pre-experiment metric as a covariate, sharpening estimates and reducing required sample size. CUPED stands for Controlled-experiment Using Pre-Experiment Data.

**Example:** Applying CUPED adjustment to a cost-per-user experiment cuts the required sample size by 40 percent by removing baseline variance.

#### Dashboard

A visual surface presenting metrics and aggregated logs as charts, used to answer recurring questions and surface anomalies; the daily artifact of an observability practice.

**Example:** A cost dashboard shows daily spend by feature_tag, week-over-week growth, and the top three burn-rate-driving sessions.

#### Data Privacy

The discipline of protecting user data from unauthorized use or disclosure, including what is sent to vendors, what is logged, and what is retained.

**Example:** Data privacy on an LLM service means redacting PII before logging, hashing user identifiers, and enabling vendor opt-out-of-training where supported.

#### Data Residency

The requirement that data be stored or processed within specified geographic boundaries, often imposed by national regulation or customer contract.

**Example:** Data residency for an EU bank's LLM workload requires Vertex AI's europe-west region rather than the global default.

#### Dead Context

Content in the prompt the model never consults during generation, occupying token budget without informing output; a high-leverage cleanup target.

**Example:** Dead context in the form of a 3,000-token "company history" section in the system prompt contributes nothing to current-question answering and can be removed.

#### Dense Retrieval

Retrieval based on similarity between embedding vectors of query and documents, the modern alternative to lexical search; strong on paraphrases and weaker on rare exact terms.

**Example:** Dense retrieval recognizes that "how do I cancel my plan" and "subscription cancellation procedure" are about the same thing—BM25 might not.

#### Difficulty Estimation

A pre-routing step estimating how hard the current request is, often via task length, complexity heuristics, or a small classifier; the input that determines whether to spend on a stronger model.

**Example:** Difficulty estimation flags the long, multi-document analysis as "hard" and routes it to Opus, while a short FAQ goes to Haiku.

#### Document Compression

Summarizing or extracting the most relevant sentences from a long retrieved document before injection, reducing token cost while preserving the signal the model needs.

**Example:** Document compression by sentence-level relevance scoring shrinks a 2,000-token retrieved chunk to 400 tokens of just the relevant passages.

#### Drill-Down Analysis

Starting from an aggregate metric and successively narrowing the dimensions—from total spend, to a feature, to a user, to a session—until the root cause is identified.

**Example:** Drill-down analysis on the spend spike traces it from "high total cost" to "summarize feature" to "one user" to "one runaway session."

#### Eager Skill Listing

A harness strategy that loads every skill body into the system prompt up front, simpler to implement but token-wasteful as the skill catalog grows.

**Example:** Eager skill listing on a 50-skill harness pays the full body cost on every turn, even when no skill is relevant—a clear footgun at scale.

#### Early Stopping

A general technique—via stop sequence, length cap, or streaming cancellation—of ending generation as soon as the answer is known, before the model adds filler.

**Example:** Early stopping on a yes/no classification with `max_tokens=1` plus a stop sequence on whitespace produces a single-token answer at minimum cost.

#### Effect Size

The magnitude of the difference between treatment and control, expressed in raw or standardized units; the input to power and sample-size calculations.

**Example:** Targeting an effect size of a 5 percent cost reduction (rather than just "any reduction") makes the sample size calculation tractable.

#### Embedding

A dense numeric vector representing the semantic content of a piece of text, produced by an embedding model and used for similarity search and clustering.

**Example:** An embedding of a 200-character paragraph is a 1,536-dimensional vector that compares to other embeddings via cosine similarity.

#### End-Of-Sequence Token

A special token signaling that generation should stop; emitted by the model when it judges the response complete and used by the runtime to terminate decoding.

**Example:** When a chat model finishes a sentence and emits its end-of-sequence token, the API closes the stream and reports a stop reason of "end_turn".

#### Engineering Manager Review

A scheduled review—weekly or biweekly—where engineering managers examine cost trends, top consumers, and outstanding optimization work, the cadence that turns dashboards into action.

**Example:** An engineering manager review every Friday reads the manager weekly report, decides whether to escalate any outliers, and updates the optimization backlog.

#### Enterprise Pricing

Custom commercial terms negotiated for high-volume or regulated customers, often including volume discounts, dedicated capacity, data-residency commitments, and SOC 2 reporting.

**Example:** An enterprise contract bundles a committed monthly minimum, a volume discount, and a data processing addendum covering GDPR obligations.

#### Escalation Trigger

The criterion that promotes a request from a cheaper to a more expensive model—low confidence, refusal, missing required schema field, or downstream failure.

**Example:** An escalation trigger of "missing the `decision` field in the structured output" promotes the call from Haiku to Sonnet automatically.

#### Eval Suite

A structured collection of test cases, judges, and metrics evaluating model and prompt behavior on a defined task; the unit of regression-testing for prompts.

**Example:** An eval suite for the chat feature includes 200 conversation traces and an LLM-judge scoring each, run on every prompt-template change before deploy.

#### Explicit Caching

A vendor cache requiring caller markup to designate cacheable prefixes—typically Anthropic's `cache_control` parameter—giving the caller precise control.

**Example:** Explicit caching with `{"type": "ephemeral"}` lets a developer place the cache breakpoint exactly between the stable system prompt and the volatile tool inputs.

#### Extended Thinking

Anthropic's reasoning mode where Claude generates an internal thinking block before its visible response, allowing harder problems to be solved at the cost of additional output-rate tokens.

**Example:** Enabling extended thinking on a math word problem produces a visible solution plus several thousand thinking tokens, billed at the output rate.

#### Fallback Model

The stronger model used when the primary cheap model fails its quality gate, named explicitly in the routing configuration.

**Example:** A fallback model of Sonnet handles the 12 percent of calls Haiku cannot, balancing cost savings against missed cases.

#### False Negative Trigger

A skill description so narrow that the harness fails to invoke it on turns it should handle, causing the model to underperform without the skill's guidance.

**Example:** A skill described as "writes ISO 11179 glossary entries from a CSV file" misses a request phrased "draft glossary entries from this list"—a false negative trigger.

#### False Positive Trigger

A skill description so broad that it matches turns the skill should not handle, causing skill misfires; one of the two trigger-precision failure modes.

**Example:** A skill described as "writes documents" produces false positive triggers on every drafting request, regardless of whether it is a fit.

#### Feature Tag

A log field naming the product feature that triggered the call—`summarize`, `tag-suggester`, `chat`—the primary axis for cost attribution.

**Example:** Adding a feature tag to every LLM call lets the cost dashboard show that "summarize" drives 80 percent of spend.

#### Few-Shot Example

An input/output example included in the prompt to demonstrate the desired behavior without fine-tuning; effective but token-expensive at scale.

**Example:** Three few-shot examples for an entity-extraction prompt add 1,200 tokens but lift accuracy by 8 points—worth caching.

#### Few-Shot Pruning

Removing or shortening few-shot examples once the model is performing reliably, eliminating the token overhead they impose on every call.

**Example:** Few-shot pruning on a stable classification prompt drops two of five examples after evaluation confirms quality is unchanged.

#### File Edit Tool

A harness-provided tool letting the model modify a file, typically with a precise old/new string replacement contract that prevents accidental whole-file overwrites.

**Example:** Claude Code's `Edit` is a file edit tool requiring an exact `old_string` and `new_string`, refusing if the old string is not unique in the file.

#### File Read Tool

A harness-provided tool exposing file contents to the model, taking a path and optional line range and returning the requested portion as a tool_result.

**Example:** Claude Code's `Read` is a file read tool taking an absolute path and returning the file's lines with line-number prefixes.

#### Forecasting Token Cost

Projecting future token spend from current trends, scheduled launches, and historical seasonality so finance can plan and engineering can prevent surprise overruns.

**Example:** A linear projection from week-over-week growth predicts \$45,000 next month; combined with planned launches, the actual forecast is \$60,000.

#### Foundation Model

A general-purpose model trained on broad data at scale, intended to be adapted to many downstream tasks through prompting, fine-tuning, or retrieval augmentation rather than retrained for each use case.

**Example:** Claude Opus serves as a foundation model that one team uses for legal summarization while another uses it for code review—same weights, different prompts.

#### Free Tier Limit

The capped quota of free requests or tokens a vendor offers new accounts; useful for prototyping but inadequate for production traffic and prone to silent failure when exhausted.

**Example:** A weekend prototype runs into the free tier limit on Monday morning, returning 429 errors until a paid card is attached.

#### Function Calling

OpenAI's mechanism for letting a model invoke caller-defined functions by emitting structured `tool_calls` in the response; the caller executes the function and returns the result on the next turn.

**Example:** Defining a `lookup_order(order_id)` function lets GPT-4o request order data mid-response and continue with the retrieved record.

#### Funnel Analysis

Tracking event sequences through stages of a user task, measuring drop-off and cost at each stage; useful for cost-per-outcome analysis on multi-step features.

**Example:** Funnel analysis on the document-review feature shows 30 percent of cost is spent on documents users never open—a cache-and-defer opportunity.

#### GDPR

The General Data Protection Regulation—an EU regulation governing personal data of EU residents, including consent, data minimization, right to access, and right to erasure. GDPR stands for General Data Protection Regulation.

**Example:** GDPR requires that EU users' prompt history be deletable on request—design log retention with that in mind from day one.

#### Gemini Batch Mode

Google's asynchronous batch endpoint for Gemini models, accepting requests for completion within a longer window at a discounted rate; counterpart to Anthropic and OpenAI batch APIs.

**Example:** A nightly Gemini batch mode job re-summarizes the past week's tickets at half the synchronous price, ready for the morning report.

#### Gemini Caching

Google's prompt-caching feature for Gemini, allowing callers to upload a stable prefix once and reference it across many subsequent requests at a discounted input rate.

**Example:** A 500,000-token codebase uploaded as a Gemini cached content reference gets used across hundreds of code-review queries with the cached prefix billed at the discount.

#### Gemini Code Execution

A built-in Gemini tool that runs Python code in a sandbox during generation, allowing the model to verify computations and produce results grounded in execution rather than guessing.

**Example:** Asking Gemini to compute statistics on a CSV with code execution enabled produces a Python invocation that runs and returns actual numbers.

#### Gemini Flash

Google's fastest, cheapest Gemini tier, designed for high-volume, latency-sensitive tasks; comparable in role to Claude Haiku and GPT-4o-mini.

**Example:** Real-time content moderation runs on Gemini Flash to stay under a 100-millisecond latency budget at sub-cent per-call cost.

#### Gemini Function Calling

Gemini's mechanism for letting the model invoke caller-defined functions, mirroring OpenAI's function calling and Anthropic's tool use with vendor-specific schema details.

**Example:** Defining a `query_database` function lets Gemini Pro emit a structured call mid-response, executed by the caller and returned as a function-response part.

#### Gemini Grounding

The capability for Gemini to consult Google Search or other configured retrieval sources during generation, returning citations alongside the response to support fact-checking.

**Example:** Enabling Gemini grounding on a current-events query produces an answer with cited search results, reducing hallucination risk.

#### Gemini Model Family

Google's set of Gemini variants—Pro, Flash, Ultra, and successors—sharing tokenization and SDK surface but spanning size, speed, and price.

**Example:** Routing across the Gemini model family means picking Flash for high-volume tagging and Pro for nuanced reasoning, all under one SDK.

#### Gemini Multimodal Input

Gemini's ability to accept text, images, audio, and video in a single request, with each modality contributing to the input token count at a published per-modality rate.

**Example:** Submitting a 30-second video clip plus a question to Gemini multimodal input bills the video frames as input tokens at the documented rate.

#### Gemini Pro

Google's mid-to-flagship Gemini tier, balancing quality and cost; the default choice for production workloads that demand strong reasoning without Ultra's price.

**Example:** A document-analysis pipeline runs on Gemini Pro because Flash misses subtle entities while Ultra is unjustifiably expensive for the volume.

#### Gemini Safety Settings

The configurable thresholds controlling how aggressively Gemini blocks responses on harassment, hate, sexual content, and dangerous content categories; affects refusal rates and downstream cost.

**Example:** Loosening Gemini safety settings on harassment may increase false-positive blocks recovered, reducing wasted retries.

#### Gemini SDK

Google's official client library for Gemini in Python, JavaScript, Go, and other languages, wrapping the Gemini API with typed clients, streaming, and tool-use helpers.

**Example:** `import google.generativeai as genai; model = genai.GenerativeModel("gemini-pro")` is the standard entry point for the Gemini SDK in Python.

#### Gemini Streaming

The server-sent-events delivery mode for the Gemini API, emitting partial content as it is generated and concluding with usage metadata for billing reconciliation.

**Example:** Streaming a Gemini response lets the client render output progressively while capturing the final input and output token counts.

#### Gemini Token Counting

The Gemini SDK's `count_tokens` method returning the exact token count for a proposed request under Google's tokenizer, used for pre-flight budget gating.

**Example:** `model.count_tokens(contents)` returns a token count usable to reject requests that would exceed a per-call budget before they bill.

#### Gemini Tokenizer

The SentencePiece-based tokenizer used by Google Gemini models, accessible via the `count_tokens` method in the Gemini SDK and Vertex AI clients.

**Example:** `model.count_tokens(prompt)` against the Gemini SDK returns the exact token count Google will bill for a future generation request.

#### Gemini Tool Config

The configuration object controlling Gemini's tool-use behavior, including allowed function names and modes (`AUTO`, `ANY`, `NONE`), analogous to OpenAI's tool_choice.

**Example:** Setting `tool_config={"function_calling_config": {"mode": "ANY", "allowed_function_names": ["search"]}}` forces Gemini to call exactly the `search` function.

#### Gemini Ultra

The largest, highest-quality Gemini variant, reserved for the hardest reasoning and longest-context tasks; the most expensive tier in the family.

**Example:** Multi-document legal analysis spanning 800,000 tokens lands on Gemini Ultra, where smaller variants would lose track of cross-document references.

#### Generative AI

A class of machine learning systems that produce novel output—text, images, audio, or code—by sampling from a learned probability distribution over training data rather than retrieving stored answers.

**Example:** A customer-support assistant built on Claude that drafts reply emails on demand is a generative AI application; every response is sampled fresh and billed per token.

#### Golden Test Set

A curated, frozen set of canonical input-output pairs used to validate model and prompt behavior; the manual answers that ground the eval suite.

**Example:** A golden test set of 100 hand-written summaries serves as the reference for evaluating any new summarize prompt or model.

#### Google AI Studio

Google's developer-focused console for prototyping with Gemini, exposing model playground, prompt versioning, and direct API key issuance—the lighter-weight counterpart to Vertex AI.

**Example:** A developer prototypes a new Gemini prompt in Google AI Studio, then promotes the validated version to Vertex AI for production deployment.

#### Google Antigravity

Google's AI coding workspace pairing Gemini with file-edit, shell, and project-aware tooling, the third major harness alongside Claude Code and OpenAI Codex CLI.

**Example:** A team standardizes on Google Antigravity for Gemini-backed coding work to align with their Vertex AI deployment.

#### Google Gemini API

Google's HTTP interface for invoking Gemini models, available through Google AI Studio for direct access and Vertex AI for enterprise deployment.

**Example:** A POST to the `generateContent` method of the Gemini API with a model identifier and contents array returns a Gemini completion.

#### GPT Model Series

The generation of OpenAI chat models—GPT-3.5, GPT-4, GPT-4o, GPT-4o-mini—optimized for general chat and instruction-following without dedicated internal reasoning steps.

**Example:** A copywriting assistant runs on a GPT model in the GPT model series, where speed and breadth matter more than chain-of-thought depth.

#### Graceful Degradation

The behavior of a service under budget pressure—falling back to a cheaper model, returning a partial result, or queueing—rather than failing hard or running unbounded.

**Example:** Graceful degradation under a depleted user budget falls back from Sonnet to Haiku and notifies the user, instead of returning a 429.

#### Guardrail Metric

A metric the experiment must not regress on even if the primary metric improves; protects against shipping a "win" that hurts elsewhere.

**Example:** Setting customer satisfaction as a guardrail metric ensures a cost-reduction experiment is killed if satisfaction drops more than 1 percent.

#### Harness System Prompt

The large, vendor-authored system prompt embedded in an AI coding harness defining tool schemas, output formats, and behavior policies; often 10,000–30,000 tokens before any user content.

**Example:** Claude Code's harness system prompt explains the file-edit tool, shell tool, and skill protocol—billed on every turn unless cached.

#### Harness Token Overhead

The fixed token cost imposed by the harness's system prompt, tool definitions, and protocol scaffolding on every turn, independent of the user's task.

**Example:** A 25,000-token harness token overhead means every turn in Claude Code starts already 25,000 tokens deep before reading your message.

#### Hashing Sensitive Strings

Replacing a sensitive value (email, account ID) with a one-way hash for logging, preserving the ability to group and count without storing the raw value.

**Example:** Hashing sensitive strings via SHA-256 over the user's email lets a per-user roll-up still group correctly without exposing addresses.

#### Hierarchical Summary

A multi-level summary structure—high-level recap on top, detailed paragraphs underneath—that preserves both quick orientation and the ability to drill into specifics.

**Example:** A hierarchical summary keeps a one-paragraph overview plus three sub-sections, supporting both fast model orientation and selective deeper context.

#### HIPAA

The Health Insurance Portability and Accountability Act—a U.S. law governing protected health information, with strict rules about storage, transmission, and vendor handling. HIPAA stands for Health Insurance Portability and Accountability Act.

**Example:** HIPAA compliance for an LLM-powered medical app requires a Business Associate Agreement with the vendor and end-to-end encryption of prompts containing PHI.

#### Histogram Metric

A metric capturing the distribution of values—latency, token counts, costs—into bucketed counts, enabling percentile analysis without storing every event.

**Example:** A histogram metric of input tokens per request lets the dashboard report median, P95, and P99 input length per feature.

#### Histogram Of Token Counts

A histogram visualizing the distribution of input or output token counts across calls, exposing typical ranges and long tails.

**Example:** A histogram of token counts shows a clean lognormal until a 200,000-token tail—those tail calls deserve their own budget gate.

#### Hit Rate Dashboard

A dashboard tracking prompt cache hit rate, broken down by model, feature, and time, used to confirm caching is working and detect regressions.

**Example:** A hit rate dashboard showing cache hit rate dropping from 85 percent to 30 percent overnight indicates a cache breakpoint moved and needs to be fixed.

#### 5-Hour Limit

Anthropic's rolling 5-hour usage limit on Claude subscription plans (Pro and Max), capping how many tokens a single user can consume in any 5-hour window.

**Example:** A Claude Pro user hitting the 5-hour limit during a long Claude Code session must wait or fall back to a metered API account to continue.

#### Hybrid Retrieval

A retrieval strategy combining keyword search (typically BM25) with dense embedding search, taking the best of both lexical exact-match and semantic similarity.

**Example:** Hybrid retrieval boosts recall on technical queries where exact terms matter—BM25 catches "GPU OOM" while embeddings catch "out-of-memory error on graphics card."

#### HyDE

Hypothetical Document Embeddings—a query-rewriting technique that asks the model to draft a hypothetical answer first, embeds the hypothetical, and retrieves against it. HyDE stands for Hypothetical Document Embeddings.

**Example:** HyDE on a vague legal question generates a one-paragraph fake answer; embedding that fake answer retrieves real documents far better than embedding the question alone.

#### Hypothesis

A specific, falsifiable statement about how a change will affect a metric, written before the experiment runs to prevent post-hoc rationalization.

**Example:** A hypothesis like "shortening the system prompt by 30 percent will reduce per-call cost by at least 25 percent without lowering quality" is testable and bounded.

#### Idempotency Key

A caller-supplied identifier ensuring that retrying a request does not produce duplicate side effects (or duplicate billing); a server-side dedupe handle.

**Example:** An idempotency key of `<job_id>-<row_index>` ensures a network-retry on a single row of a batch job does not run that row twice.

#### Implicit Caching

A vendor-managed cache that detects repeated prefixes automatically without explicit caller markup; OpenAI's prompt caching is largely implicit.

**Example:** OpenAI's implicit caching automatically caches prefixes longer than 1,024 tokens, billing them at half the input rate without any code change.

#### Input Token

A token sent into a model as part of the prompt, including system instructions, user messages, prior assistant turns, and tool definitions; billed at the input rate.

**Example:** A 4,000-token system prompt plus a 200-token user question yields 4,200 input tokens billed per request.

#### Input Token Field

A required log field reporting the input tokens consumed on the call, the source of truth for input-side cost calculation.

**Example:** Reading the input token field across a million log lines reveals that the median request consumes 1,200 input tokens but the 99th percentile consumes 28,000.

#### Input Token Price

The per-million-token rate charged for tokens sent into the model on a request, including system prompt, history, retrieved context, and the current user message.

**Example:** Claude Sonnet's input price is approximately three dollars per million tokens at the time of writing; multiply by your input token count and divide by one million.

#### Instruction Compression

Rewriting verbose instructions as terse, equivalent ones to reduce token count without changing model behavior; the lowest-risk prompt optimization.

**Example:** Instruction compression turns "Please ensure that you always provide a polite, helpful response that addresses the user's question directly" into "Be concise, polite, and direct."

#### Job Queue

A queueing system that holds asynchronous jobs awaiting processing, used to smooth bursty traffic and respect rate limits.

**Example:** A job queue between application and vendor API smooths a midnight backlog spike across the next hour, staying inside rate limits.

#### JSON Log Format

A log format where each line is a self-contained JSON object, parseable independently and easy for tools like `jq`, BigQuery, and Splunk to ingest.

**Example:** Switching from "INFO: cost=\$0.02 model=sonnet ..." text logs to JSON log format makes per-feature cost rollups a one-line query.

#### JSON Mode

OpenAI's response_format flag instructing the model to emit syntactically valid JSON; predates Structured Outputs and provides format guarantee without schema enforcement.

**Example:** Enabling JSON mode prevents stray prose around the JSON object but does not constrain the field names—structured outputs do that.

#### JSON Schema Output

Constraining output to match a JSON Schema via the vendor's structured-outputs feature, eliminating malformed-JSON retries and usually shortening output.

**Example:** JSON schema output guaranteeing `{"label": "spam"|"not_spam"}` lets max_tokens be set to 30 and removes the need for a parse-and-retry loop.

#### Large Language Model

A neural network trained on massive text corpora to predict the next token given prior context, capable of reasoning, summarization, code generation, and conversation when prompted.

Large language models are the priced commodity at the center of this textbook—every optimization technique exists to reduce the tokens flowing into and out of one.

**Example:** Claude Sonnet, GPT-4o, and Gemini Pro are large language models accessed through paid APIs that charge per million input and output tokens.

#### Latency Dashboard

A dashboard tracking response latency percentiles by model, feature, and prompt length, used to monitor user-perceived performance and capacity.

**Example:** A latency dashboard reveals that P99 latency on `chat` doubled after the system prompt grew from 6,000 to 14,000 tokens.

#### Latency Field

A log field reporting the end-to-end duration of the API call in milliseconds, used to detect slow requests, time out runaway calls, and report user-perceived performance.

**Example:** A latency field of 18,400 ms on a Sonnet call signals either an outage or an extremely long output—worth a drill-down.

#### Latency Metric

A metric reporting response time, used as a guardrail in cost experiments (faster is fine, much slower is not) and as a primary metric in performance work.

**Example:** Adding a latency metric to a cost experiment ensures a cheaper-but-slower model is not silently degrading the user experience.

#### Latency Tolerance

The maximum acceptable time between request and response for a given workload, the determining factor in batch versus synchronous selection.

**Example:** A user-facing chat has a latency tolerance of seconds; a nightly report has a latency tolerance of hours—different latency tolerances, different APIs.

#### Lazy Skill Loading

A harness strategy where only the skill descriptions are present in the system prompt and a skill body is fetched only when invoked, dramatically reducing baseline token cost.

See also: Eager Skill Listing.

**Example:** Lazy skill loading lets a harness expose 500 skills with a 5,000-token description index instead of a 500,000-token full library.

#### Length Penalty

A decoding-time bias against longer outputs, used to encourage concise responses; not exposed by all vendor APIs and often implemented via prompting instead.

**Example:** Where supported, a length penalty greater than 1.0 discourages long outputs; where unsupported, achieve the same effect with a "be concise" instruction plus a max_tokens setting.

#### Local Token Estimation

Computing token counts in-process using a bundled tokenizer library (such as tiktoken) rather than calling a remote counting API, trading accuracy for latency and avoiding API round-trips.

**Example:** Pre-flight cost gates in a high-throughput service rely on local estimation because a counting API call would double request latency.

#### Log Aggregation

Collecting logs from many hosts or services into a central system—Splunk, Elasticsearch, BigQuery—where they can be queried at scale.

**Example:** Log aggregation into BigQuery lets analysts run SQL across a quarter of LLM calls without touching production hosts.

#### Log Field

A single named-and-typed property on a log line, drawn from the schema; the unit of analysis for grouping, filtering, and aggregation.

**Example:** `feature_tag` is a log field whose values are strings like `summarize` or `classify`, used to group cost roll-ups.

#### Log File Analysis

The practice of querying or scripting against raw log files—often JSON Lines—to answer questions metrics and dashboards do not anticipate.

**Example:** Log file analysis with `jq '.cost' llm.jsonl | sort -n | tail -20` surfaces the twenty most expensive calls of the day.

#### Log Line

A single record in a log file representing one event—typically one LLM call—and conforming to the project's log schema.

**Example:** Each log line in `llm.jsonl` is one JSON object terminated by a newline, ready for ingestion by `jq`, BigQuery, or Splunk.

#### Log Retention Policy

The documented rule for how long logs are kept before deletion or archival, balancing debugging needs against compliance and storage cost.

**Example:** A log retention policy keeps full logs for thirty days, daily-aggregated metrics for two years, and complies with GDPR right-to-erasure requests.

#### Log Sampling

Storing a representative subset of log lines—1 percent or 10 percent—rather than every event, traded against full visibility to control storage cost on high-volume pipelines.

**Example:** Log sampling at 10 percent on a billion-call-per-day pipeline keeps storage manageable while preserving statistical accuracy of cost rollups.

#### Log Schema Design

The deliberate choice of which fields appear on every log line, which are optional, and what types they carry; the foundation for every downstream query.

**Example:** Good log schema design specifies that `model`, `input_tokens`, and `output_tokens` are required while `feature_tag` and `outcome` are optional with documented defaults.

#### Logging Privacy Risk

The privacy exposure created by storing prompts and completions in application logs, often more durable and broadly accessible than vendor-side storage.

**Example:** A logging privacy risk—storing raw prompts containing PII in CloudWatch—is sometimes more dangerous than the vendor's retention; redact before logging.

#### Logit Bias

An OpenAI request parameter biasing or banning specific token IDs during decoding, used for forced format adherence, profanity filtering, and tightly constrained classification.

**Example:** Setting `logit_bias={" yes": 100, " no": 100}` and `max_tokens=1` makes the model answer with one of two tokens—useful for binary classification.

#### Logprobs

The log-probabilities a model assigns to candidate tokens at each decoding step, optionally returned in the API response for use in classification, ranking, and confidence estimation.

**Example:** A spam classifier inspects the logprobs on the first output token to extract the model's confidence in "spam" versus "not_spam" without parsing free text.

#### Long Context Window

A context window measured in hundreds of thousands or millions of tokens, large enough to fit entire books or codebases without retrieval; introduces new cost and quality concerns around context decay.

**Example:** Loading a 600,000-token codebase into Gemini's long context window avoids retrieval engineering but costs sixty cents per query at standard input pricing.

#### Long-Tail Cost

The disproportionate spend concentrated in the small fraction of calls at the high end of the token distribution, often the entire optimization opportunity.

**Example:** Long-tail cost analysis reveals that the top 1 percent of calls account for 40 percent of spend—optimize them or budget-cap them.

#### Long-Term Memory

State preserved across sessions—saved to disk, a database, or a memory service—so the agent does not start from zero on every interaction.

**Example:** Long-term memory in a personal assistant remembers the user's calendar preferences across sessions so they need not re-explain them.

#### Loop Iteration Limit

A cap on how many cycles the agentic loop is allowed to run before the harness forcibly returns control, the structural fix for pathological agent loops.

**Example:** A loop iteration limit of 30 turns lets the agent finish most tasks while killing runaway loops automatically.

#### Lost-In-The-Middle

A specific context-quality pathology where models pay disproportionate attention to the start and end of a long context and miss content in the middle.

**Example:** Lost-in-the-middle behavior means a critical instruction buried halfway through a 100,000-token prompt is often ignored—move it to the start or end.

#### Manager Weekly Report

A standardized weekly report to engineering managers summarizing AI tool spend, top consumers, and notable changes, supporting calm cost governance.

**Example:** A manager weekly report shows team spend up 20 percent due to a new agent rollout—anticipated and approved, not a surprise.

#### Manual Compaction

User-invoked compaction, typically through a slash command or menu option, used when the operator wants to reset accumulated context before auto compaction would fire.

**Example:** Running `/compact` in Claude Code performs manual compaction at a moment of the user's choosing, before drift sets in.

#### Max Tokens Parameter

A request parameter that caps the number of output tokens the model is allowed to generate, providing the most direct control over per-request output cost.

**Example:** Setting `max_tokens=200` on a summarization endpoint guarantees the bill for that call cannot exceed 200 output-rate tokens regardless of model behavior.

#### Max Tokens Setting

The configured value of the `max_tokens` request parameter, expressed as a routing-policy or template-level setting rather than left as the API default.

**Example:** A max tokens setting of 800 on the summarize endpoint hard-caps cost regardless of model behavior; an unset max_tokens is a runaway-prompt footgun.

#### Memory File

A file the agent reads at session start (e.g., `CLAUDE.md`, `AGENTS.md`) carrying user preferences, project conventions, or distilled prior session state.

**Example:** A `CLAUDE.md` memory file in the project root informs the model that this codebase uses pytest, Black formatting, and absolute imports.

#### Message Content Block

A typed element within a message—text, image, tool_use, tool_result, or thinking—that constitutes the structured content of an Anthropic message rather than a flat string.

**Example:** A user message can carry a list like `[{"type": "image", "source": ...}, {"type": "text", "text": "What is in this picture?"}]`.

#### Metric

A numeric measurement aggregated over time and dimensions—counter, gauge, or histogram—used for dashboards and alerts; cheaper than logs at scale.

**Example:** A `tokens_per_second` metric tagged by model and feature lets a dashboard plot throughput without scanning raw log lines.

#### Model Family

A set of related models from a single vendor sharing architecture, training data lineage, and API surface but differing in size, speed, and price tier.

**Example:** Claude Opus, Sonnet, and Haiku constitute the Claude model family, allowing routing across capability and cost without rewriting the integration.

#### Model Field

A required log field naming the exact model identifier used for the call—`claude-3-5-sonnet-20241022` or `gpt-4o-2024-11-20`—essential for correct cost calculation across pricing tiers.

**Example:** Logging the model field as the full versioned identifier lets you replay billing exactly when the vendor publishes price changes.

#### Model Routing

Sending each request to the cheapest model that can handle it well, based on task type, difficulty estimation, or confidence checks; the highest-leverage architectural cost optimization.

**Example:** Model routing sends classification to Haiku and complex reasoning to Sonnet, cutting average per-call cost by 70 percent versus running everything on Sonnet.

#### Monthly Token Spend

The aggregate cost of all language model API calls in a calendar month, the headline figure on the vendor invoice and the primary input to FinOps reviews.

**Example:** A team's monthly token spend rises from \$8,000 to \$22,000 in three weeks—signal to launch an optimization sprint.

#### Multi-Armed Bandit

An adaptive experimentation strategy that allocates more traffic to winning arms over time, trading some statistical purity for faster optimization.

**Example:** A multi-armed bandit comparing four prompt variants quickly shifts traffic to the cheapest equally-good variant rather than splitting evenly throughout.

#### Multi-Step Reasoning

A prompting or harness pattern where the model decomposes a problem into intermediate steps, often realized through chain-of-thought, extended thinking, or tool-driven exploration.

**Example:** Multi-step reasoning lets an agent plan a refactor across five files rather than try to do everything in one shot.

#### Multi-Turn Dialogue

An interaction pattern where the conversation history is replayed on each request so the model can reference earlier exchanges; cost scales superlinearly with turn count if no compaction is applied.

**Example:** By turn twenty of a coding session, the assistant might be re-reading 50,000 tokens of prior dialogue on every keystroke—unless prompt caching is in play.

#### Multilingual Tokenization

Tokenizer behavior across languages; non-Latin scripts often tokenize to more tokens per character than English, inflating both input and output costs for non-English use cases.

**Example:** A Japanese paragraph may use two to three times as many tokens as its English translation, materially affecting per-user economics for international products.

#### Novelty Effect

A short-term behavior change driven by users reacting to a feature being new rather than to its enduring value; treated as a confound to wait out before declaring success.

**Example:** A novelty effect on a new chat assistant inflates engagement during week one; the experiment must run long enough to see whether usage settles back.

#### Null Hypothesis

The default position that the treatment has no effect; statistical analysis tries to reject it in favor of the experimental hypothesis with sufficient evidence.

**Example:** The null hypothesis "the shorter prompt has the same average quality as the original" is rejected if the observed difference is statistically significant.

#### Observability

The discipline of instrumenting systems with logs, metrics, and traces so engineers can reconstruct behavior after the fact without redeploying; the foundation for cost forensics.

**Example:** Observability on an LLM service means every call is logged, every cost is metered, and every error trace is searchable.

#### One Million Context

The one-million-token context window available on Gemini 1.5 Pro and successors, supporting entire codebases, video transcripts, or full books in a single request.

**Example:** A one-million-context request analyzing a quarter's worth of board minutes runs on Gemini 1.5 Pro—provided the team can afford the input cost.

#### OpenAI API

The HTTP interface OpenAI exposes for invoking GPT and o-series models, currently spanning the Chat Completions API and the newer Responses API.

**Example:** A POST to `https://api.openai.com/v1/chat/completions` with a model identifier and a messages array returns a GPT completion.

#### OpenAI Batch API

OpenAI's asynchronous endpoint accepting JSONL request files and delivering results within twenty-four hours at a fifty percent discount; suited to bulk evaluation and offline regeneration.

**Example:** A weekly recompute of product embeddings moves to the OpenAI Batch API, cutting cost in half without affecting user-facing latency.

#### OpenAI Codex CLI

OpenAI's command-line AI coding harness pairing GPT-class models with file and shell access, comparable in role to Claude Code but tuned to OpenAI's models and tooling.

**Example:** A developer uses OpenAI Codex CLI for an OpenAI-flavored coding session and Claude Code for an Anthropic-flavored one, comparing outputs on the same task.

#### OpenAI Embeddings

Vector representations of text produced by OpenAI's embeddings models (such as `text-embedding-3-small`), used for semantic search, clustering, and retrieval-augmented generation.

**Example:** Calling `client.embeddings.create(input=docs, model="text-embedding-3-small")` returns dense vectors for storage in a vector database.

#### OpenAI Fine Tuning

OpenAI's managed offering for adapting a base model to a domain by training on caller-supplied examples, producing a fine-tuned variant with its own model identifier and pricing.

**Example:** Fine-tuning GPT-4o-mini on 5,000 customer support transcripts shrinks the system prompt needed at inference time and cuts per-request cost.

#### OpenAI Model Family

The set of models OpenAI ships—GPT-4o, GPT-4o-mini, the o-series reasoning models, embeddings, and others—sharing API surface but spanning capability and cost.

**Example:** Routing across the OpenAI model family means picking GPT-4o-mini for tagging, GPT-4o for chat, and o1 for hard reasoning under one SDK.

#### OpenAI O Series

OpenAI's reasoning-model series (o1, o3, etc.) that produce hidden reasoning tokens before the visible response, trading higher cost and latency for stronger problem-solving on math, code, and logic.

**Example:** A complex SQL-debugging task is routed to an o-series model because it produces the right answer where GPT-4o silently makes a mistake.

#### OpenAI Rate Limits

OpenAI's per-organization tokens-per-minute and requests-per-minute caps, varying by model and account tier; exceeding triggers 429 responses requiring backoff.

**Example:** A free-tier OpenAI rate limit of 10,000 tokens per minute on GPT-4o is easy to hit during a load test—use exponential backoff or upgrade.

#### OpenAI Responses API

OpenAI's newer endpoint unifying chat, tools, structured outputs, and reasoning models behind a single typed surface; the recommended path for new applications.

**Example:** `client.responses.create(model="gpt-4o", input="Summarize this", tools=[...])` is an OpenAI Responses API call.

#### OpenAI SDK

OpenAI's official client library for Python, TypeScript, and other languages, providing typed clients for Chat Completions, Responses, embeddings, fine-tuning, and batch endpoints.

**Example:** `from openai import OpenAI; client = OpenAI()` is the standard entry point for OpenAI SDK applications in Python.

#### OpenAI Streaming

The server-sent-events delivery mode for Chat Completions and Responses, emitting deltas as they are generated; the final chunk carries the usage object with input and output token counts.

**Example:** Streaming a GPT response lets the client display tokens as they arrive while still capturing accurate billing data from the final usage chunk.

#### OpenAI Vision

The image-input capability on GPT-4o and successor models, accepting URL-referenced or base64-encoded images alongside text; image tokens count against input budget at a published per-image rate.

**Example:** Submitting a chart image with an OpenAI vision request lets GPT-4o read the values and answer questions without OCR preprocessing.

#### OpenTelemetry

An open-source observability framework providing vendor-neutral APIs and SDKs for traces, metrics, and logs, including emerging conventions specific to LLM calls. Often abbreviated OTel.

**Example:** Instrumenting an LLM client with OpenTelemetry emits spans whose attributes include model name and token counts, ingestible by any compliant backend.

#### Opt-Out Of Training

A vendor setting or contractual clause excluding the customer's prompts and completions from being used to train future model versions.

**Example:** Opt-out of training is enabled by default on enterprise OpenAI accounts; verify the setting before sending any sensitive content.

#### Optimization Backlog

A prioritized list of cost-reduction opportunities awaiting work, populated by Pareto analysis, dashboard signals, and engineer suggestions.

**Example:** An optimization backlog ranked by estimated dollar savings puts "cache the system prompt" above "trim few-shot examples" because the savings are an order of magnitude larger.

#### Optimization Hypothesis

A specific, testable prediction that a proposed change will reduce cost (or improve another metric) by a quantified amount, written before the work begins.

**Example:** An optimization hypothesis "moving to prompt caching will cut input cost by at least 60 percent at current cache-hit rates" is testable and bounded.

#### Optional Log Field

A field that may be absent from a log line without breaking the schema, used for context that exists only in some calls.

**Example:** `tool_name` is an optional log field present only on tool-using requests, omitted otherwise rather than set to a sentinel.

#### OTel LLM Conventions

The OpenTelemetry semantic conventions for large-language-model spans, standardizing attribute names like `gen_ai.system`, `gen_ai.usage.input_tokens`, and `gen_ai.usage.output_tokens` across vendors. OTel stands for OpenTelemetry.

**Example:** Adopting OpenTelemetry LLM conventions lets a Datadog dashboard show Claude and GPT calls side by side under shared attribute names.

#### Outcome Field

A log field reporting the success or failure of the higher-level task the call contributed to, allowing cost-per-outcome analysis rather than just cost-per-call.

**Example:** An outcome field of `success`, `retry`, or `fail` enables computing the true cost of a successful summary, accounting for retries.

#### Outlier Detection

Statistical identification of individual events whose cost, latency, or token count is far above the typical distribution; the unit of analysis is the single call.

**Example:** Outlier detection finds a single conversation that hit one million input tokens—a runaway prompt that escaped the budget guardrail.

#### Output Length Budget

A soft or hard cap on output token count per call, expressed via `max_tokens` and reinforced by a "be concise" instruction in the prompt.

**Example:** Combining `max_tokens=400` with a "respond in 100 words or fewer" instruction enforces an output length budget the model rarely violates.

#### Output Postprocessing

Server-side cleanup applied to the model's output before returning it to the client—trimming, formatting, parsing, validation—often where output tokens become structured records.

**Example:** Output postprocessing strips a markdown code fence, parses JSON, and validates the schema, turning the model's reply into a typed record.

#### Output Premium

The price multiplier between input and output rates, typically three to five times across major vendors; reflects that output tokens are generated serially and consume more compute per token.

**Example:** A five-times output premium means a 200-input, 1,000-output classification call is dominated by output cost—favoring concise output instructions.

#### Output Token

A token generated by a model in its response, billed at the output rate—typically three to five times the input rate due to the serial cost of autoregressive decoding.

See also: Output Premium.

**Example:** Asking Claude for a 500-word essay produces roughly 700 output tokens, charged at the higher per-million output price.

#### Output Token Field

A required log field reporting the output tokens generated on the call, billed at the higher output rate and a frequent driver of total cost.

**Example:** Plotting the output token field by feature shows that long-form generation features dominate cost despite low call volume.

#### Output Token Price

The per-million-token rate charged for tokens the model generates in its response, typically three to five times the input rate to account for serial decoding cost.

**Example:** If output costs approximately fifteen dollars per million tokens, a 2,000-token response costs three cents on its own.

#### Output Validation

Checking that the model's output conforms to expected schema, length, and content rules; the gate for whether to accept, retry, or escalate.

**Example:** Output validation against a Pydantic model rejects malformed JSON; the retry policy decides whether to retry on the same model or escalate to a stronger one.

#### P-Value

The probability of observing data as extreme as the actual outcome, given the null hypothesis is true; the standard scalar of statistical significance.

**Example:** A p-value of 0.03 on a cost-reduction A/B test means there is a 3 percent chance of seeing this much improvement if the change had no real effect.

#### P50 Token Usage

The median token count per call—half of calls use fewer, half use more—the natural center of distributional analysis.

**Example:** A P50 token usage of 1,400 input tokens means half of calls fit comfortably under any reasonable budget; the optimization focus is the tail.

#### P95 Token Usage

The 95th-percentile token count per call; useful as a capacity-planning anchor and a target for token budget enforcement.

**Example:** Setting the per-request token budget at P95 token usage rejects only 5 percent of calls—those most likely to be runaways.

#### P99 Token Usage

The 99th-percentile token count per call; the long-tail anchor where runaway prompts and pathological loops typically live.

**Example:** P99 token usage of 80,000 against a P50 of 1,400 is a giant tail worth investigating—often a small set of users or sessions.

#### Padding Token

A filler token used to extend shorter sequences to a fixed length in batched inputs; relevant when working with raw model weights but largely abstracted away by hosted APIs.

**Example:** When batching variable-length prompts for local inference, shorter sequences are right-padded with the padding token so attention masks can ignore them.

#### Parallel Execution

Issuing multiple independent operations concurrently—either as parallel tool calls within one model turn or as parallel sessions—reducing wall-clock time but altering token economics.

**Example:** Parallel execution of file reads in a single Claude turn issues all three at once and consumes their results together, cutting turn count.

#### Parallel Token Penalty

The phenomenon where running parallel sessions on a usage-capped subscription consumes the cap several times faster, effectively raising per-task cost despite ostensibly fixed pricing.

A footgun: silent—no error, just faster cap exhaustion; easy to trigger—just open multiple Claude Code sessions; delayed damage—you hit the weekly limit days earlier than expected.

**Example:** Running four parallel Claude Code sessions on a Max plan burns through the weekly limit four times faster than serial use—the parallel token penalty.

#### Pareto Analysis

The application of the Pareto principle to cost data—identifying the small fraction of items responsible for the majority of spend—and prioritizing optimization there.

**Example:** Pareto analysis on prompt templates reveals that two of fifty templates drive 60 percent of spend, naming the optimization target.

#### Pareto Frontier

The set of operating points where no metric can be improved without worsening another; the goal of optimization is to push the frontier outward, not just trade one cost for another.

**Example:** A new prompt that drops cost by 30 percent and quality by 1 percent moves the operation closer to the Pareto frontier; one that drops both equally is just a worse trade.

#### Pathological Agent Loop

An agentic loop where the model keeps calling tools without making progress, often re-reading the same files or trying near-identical commands until manually stopped.

**Example:** A pathological agent loop reading the same file fifteen times in twenty turns is a clear signal to add a per-session tool-call budget.

#### Per-Engineer Budget

A cap on AI tooling spend allocated to a single engineer, encouraging cost-aware behavior and surfacing outliers worth coaching.

**Example:** A per-engineer budget of \$50 per week in Claude Code spend covers normal usage; consistent overruns prompt a conversation about workflow.

#### Per-Feature Cost Roll-Up

A report aggregating spend by the `feature_tag` field, ranking features by cost and exposing optimization targets.

**Example:** A per-feature cost roll-up shows `summarize` at \$3,200, `chat` at \$1,800, and `tag-suggester` at \$140—directing attention to summarize first.

#### Per-Million-Token Price

The standard pricing unit for hosted language model APIs, expressed as cost per one million input or output tokens; the basis for all per-request cost calculations in this textbook.

**Example:** At approximately three dollars per million input tokens and fifteen dollars per million output tokens, a 10,000-input, 1,000-output request costs about \$0.045.

#### Per-Model Cost Roll-Up

A report aggregating spend by the `model` field, exposing whether routing is working and which models dominate the bill.

**Example:** A per-model cost roll-up shows 70 percent of spend on Opus, motivating a routing audit to push easier traffic to Sonnet or Haiku.

#### Per-PR Budget

A cap on AI spend per pull request, ensuring no single change burns through more than its expected share of agent cost.

**Example:** A per-PR budget of \$2 per pull request keeps the average PR's agent cost in line; PRs over budget trigger review of the workflow.

#### Per-Repository Budget

A cap on AI spend per code repository, useful when one repo's agents are doing far more work than another's and the team wants to balance.

**Example:** A per-repository budget of \$200 per week per repo lets infrastructure repos spend more on agents than internal tools repos.

#### Per-Session Token Budget

A specific limit in the agent budget policy capping total tokens for a single agent session, terminating or compacting when reached.

**Example:** A per-session token budget of 500,000 tokens triggers auto-compact at 400,000 and hard-stops at 500,000, preventing runaway accumulation.

#### Per-Session Token Cost

The total tokens billed across all turns of a single coding session, the most natural unit for budgeting agentic work.

**Example:** A 180,000-input-token, 30,000-output-token session at standard Sonnet pricing costs about \$1.00—useful as a per-session token cost benchmark.

#### Per-Session Tool Call Budget

A specific limit capping the number of tool calls in one session, preventing pathological loops where the model calls a tool repeatedly without progress.

**Example:** A per-session tool call budget of 100 prevents an agent from reading the same file fifty times in one session—it just stops and asks the user.

#### Per-Task Model Selection

Mapping specific tasks to specific models in the routing policy, rather than picking one model for the whole product.

**Example:** Per-task model selection pairs `code_review` with Opus and `commit_message` with Haiku—the right size for each job.

#### Per-User Cost Roll-Up

A report aggregating spend by the `user_id` field, surfacing distributional skew and abuse cases that justify per-user budgets or rate limits.

**Example:** A per-user cost roll-up reveals one account costing \$1,200/month against a \$10/month subscription—a clear case for a per-user budget.

#### Persistent Memory File

A file like `CLAUDE.md` or `AGENTS.md` checked into the repository that the harness automatically reads at the start of each session, providing project-specific instructions to the model.

**Example:** A `CLAUDE.md` file in the project root acts as a persistent memory file documenting coding conventions, deploy commands, and footgun patterns.

#### PII Detection

Automated or rule-based identification of personally identifiable information (PII) in text—names, emails, account numbers, SSNs—so it can be redacted, hashed, or blocked.

**Example:** PII detection running before logging replaces email addresses with `<EMAIL>` and account numbers with `<ACCOUNT>`, reducing privacy risk in stored logs.

#### PII Redaction

The practice of removing or masking personally identifiable information—names, emails, account numbers—from prompts and logs before storage to limit privacy and compliance exposure. PII stands for personally identifiable information.

**Example:** A PII redaction pass replaces email addresses with `<EMAIL>` before logging the prompt hash, satisfying both debugging and GDPR.

#### Pilot Rollout

Deploying a change to a small subset of traffic or users first to validate cost and quality before full rollout.

**Example:** A pilot rollout of the new routing policy at 10 percent traffic for one week confirms savings and quality before promoting to 100 percent.

#### Pre-Send Token Counting

Counting tokens before issuing the API call so the application can truncate, route, or reject preemptively rather than discovering the problem at the vendor.

**Example:** Pre-send token counting catches a 250,000-token prompt before it hits Sonnet's 200,000-token context window, allowing graceful truncation.

#### Pre-Tokenization

A preprocessing step that splits raw text into coarse units—typically whitespace-delimited words—before subword tokenization is applied; affects how punctuation and whitespace become token IDs.

**Example:** Different pre-tokenization rules are why Claude and GPT can produce different token counts on the same input even when both use byte-pair encoding underneath.

#### Pricing Tier

A vendor's published price level for a model variant, typically reflecting size, speed, and capability; tiers anchor routing decisions and capacity planning.

**Example:** Anthropic publishes separate pricing tiers for Opus, Sonnet, and Haiku; a router picks the lowest tier that satisfies the quality gate.

#### Primary Metric

The single metric the experiment is designed to detect a change in, chosen up front to avoid p-hacking after the data is in.

**Example:** A prompt-shortening experiment's primary metric might be cost-per-successful-outcome, picked before the test starts.

#### Prompt

The full input string sent to a model on a single API call, comprising system instructions, conversation history, retrieved context, tool definitions, and the current user message.

**Example:** A retrieval-augmented prompt might combine a 2,000-token system prompt, three retrieved documents totaling 6,000 tokens, and a 50-token user question.

#### Prompt Caching

A vendor feature that lets repeated prompt prefixes be served from cache at a steeply discounted input rate, the highest-leverage cost optimization in this textbook.

**Example:** Prompt caching on a 30,000-token system prompt and tool block reused across requests cuts the cached portion's cost to roughly 10 percent of standard input pricing.

#### Prompt Compression Tool

A library or model that automatically rewrites a verbose prompt into a shorter equivalent, sometimes at the cost of subtle quality changes.

**Example:** A prompt compression tool reduces a 4,000-token system prompt to 2,800 tokens; an A/B test confirms quality is preserved before shipping.

#### Prompt Engineering

The practice of writing, testing, and iterating prompts to elicit reliable, high-quality, and cost-efficient model behavior; a mix of writing craft, evaluation discipline, and token economics.

**Example:** Prompt engineering on the summarize feature replaces a 4,000-token system prompt with a 600-token version that produces equivalent output—same quality, far cheaper.

#### Prompt Hash

A hash (typically SHA-256) of the prompt content recorded in the log line, enabling deduplication, cache-hit analysis, and template-grouping without storing the prompt itself.

**Example:** Two requests sharing the same prompt hash but billed differently reveal a missed prompt cache hit worth investigating.

#### Prompt Length Budget

A soft or hard cap on input token count per call, set per feature or per template to prevent prompts from growing unchecked.

**Example:** A prompt length budget of 8,000 input tokens for the chat feature triggers a truncation step when retrieved context would push past the limit.

#### Prompt Template

A parameterized prompt with named slots filled at runtime from variables, used to generate per-request prompts from a stable structure; the unit of versioning for prompt engineering.

**Example:** A prompt template `"Summarize the following document in {style}:\n\n{document}"` produces concrete prompts when `style` and `document` are bound.

#### Prompt Template Grouping

Aggregating log lines by `prompt_hash` or template ID to study cost and quality of each template variant rather than treating every call as unique.

**Example:** Prompt template grouping shows version 3 of the summarize template uses 30 percent more tokens than version 2 with no quality gain—revert.

#### Prompt Tokens Field

The `prompt_tokens` integer in the OpenAI usage object reporting input tokens consumed on a request, including system prompt, history, tool definitions, and current user message.

**Example:** A `prompt_tokens` value of 12,400 on a 200-token user message reveals that the bulk of input comes from history or system instructions.

#### Prompt Truncation In Logs

The practice of storing only a prefix of long prompts in logs (e.g., first 500 characters) to keep log volume bounded while preserving enough context for debugging.

**Example:** Prompt truncation in logs caps each entry at the first 500 characters and replaces the rest with `... [truncated]`, keeping the log file under disk quota.

#### Prompt Variable

A named slot in a prompt template filled at runtime from caller-supplied values; the variable interpolation is the seam where caching strategies live or die.

**Example:** A `{user_question}` prompt variable injected near the end of the template keeps the cacheable prefix above it stable and cache-friendly.

#### Python Script Skill

A skill whose primary contribution is a Python script, used when the work needs richer logic, libraries, or data structures than a shell one-liner.

**Example:** A Python script skill for invoice parsing runs a script that uses `pdfplumber` and `pydantic`, returning structured output the model summarizes.

#### Quality Gate

A check that the cheap model's output meets quality requirements—schema validity, length, tone, factual sanity—before accepting it as the final answer.

**Example:** A quality gate checking that the response is valid JSON and contains all required fields rejects malformed output and triggers a retry on a stronger model.

#### Quality Metric

A metric measuring output correctness, helpfulness, or fitness for purpose, used as either a primary or guardrail metric in cost-optimization experiments.

**Example:** A quality metric scored by an LLM-judge against a golden test set lets a routing experiment confirm Sonnet still passes after Opus is removed.

#### Quality Regression Detection

Monitoring for declines in output quality after a cost optimization ships, ensuring savings do not silently come at the user's expense.

**Example:** Quality regression detection on the summarize feature compares LLM-judge scores before and after a model swap, killing the change if quality dropped more than 1 percent.

#### Query Rewriting

Transforming the user's raw query into one or more alternative phrasings before retrieval, improving recall on ambiguous or terse queries.

**Example:** Query rewriting expands "OOM" into "out of memory error" before retrieval, surfacing documentation the original query would have missed.

#### Quota Management

The internal practice of tracking consumption against vendor rate limits and per-team budgets, allocating remaining capacity, and queueing or rejecting requests that would breach.

**Example:** A central quota service issues tokens to feature teams from a shared minute-by-minute pool, preventing one team's batch job from starving the production chat.

#### RAG Cost Analysis

A breakdown of where retrieval-augmented generation spend goes—embedding, retrieval, reranking, context injection, generation—used to target optimization at the dominant component.

**Example:** A RAG cost analysis shows generation accounts for 75 percent of spend; reducing top-K and chunk size yields the biggest savings.

#### Random Assignment

Using a random or pseudo-random function to assign each user or request to a group, ensuring the groups are statistically comparable.

**Example:** Random assignment via `hash(user_id) % 100 < 50` gives a stable 50/50 split that survives across sessions.

#### Rate Limit

A vendor-imposed ceiling on requests or tokens per minute or per day, enforced via 429 responses; protects shared infrastructure and prevents runaway clients.

**Example:** Hitting a rate limit of 50 requests per minute returns 429s; a well-behaved client implements exponential backoff and request shaping.

#### Reasoning Budget

A cap on the tokens a reasoning model is allowed to use for hidden thinking before producing the visible answer, applicable to OpenAI o-series and Claude extended thinking.

**Example:** A reasoning budget of 4,000 tokens on an o-series call prevents pathological internal exploration on hard but bounded problems.

#### Reasoning Effort Setting

A vendor parameter (e.g., OpenAI's `reasoning.effort: "low"|"medium"|"high"`) controlling how much hidden reasoning a reasoning model spends; trades cost for quality on hard problems.

**Example:** Setting reasoning effort to `low` on simple o-series calls cuts hidden reasoning tokens by 50 percent on tasks that do not need deep thought.

#### Reasoning Model

A model architecture or fine-tune that performs an internal chain-of-thought decoded as hidden reasoning tokens before emitting visible output, billed at the output rate.

See also: Reasoning Token, OpenAI O Series.

**Example:** Claude with extended thinking enabled and OpenAI o3 are both reasoning models—buying accuracy with extra output-rate tokens.

#### Reasoning Token

An internal token a reasoning model generates during a hidden thinking phase before producing the visible response, billed at the output rate even though the user never sees it.

Reasoning tokens are a frequent source of surprise bills because they are invisible in the response payload but appear in the usage object.

**Example:** A query to OpenAI o1 might return 200 visible output tokens but 4,500 reasoning tokens, all billed as output.

#### Redundant Instruction

An instruction in the prompt that repeats or contradicts another, adding tokens without changing behavior or actively confusing the model.

**Example:** A redundant instruction "Always be polite" appears three times in the system prompt; removing two saves tokens with no effect on output.

#### Regression Test Loop

The continuous practice of running the eval suite against proposed changes before deploy, catching quality regressions before they reach users.

**Example:** A regression test loop on prompt-template PRs runs the eval suite in CI; the PR is blocked if quality regresses below threshold even when cost improves.

#### Reproducible Benchmark

A canonical evaluation harness running the same prompts and judges across versions, enabling apples-to-apples cost and quality comparisons.

**Example:** A reproducible benchmark runs the summarize feature against 500 fixed examples each week, plotting cost and quality so any drift is visible.

#### Request Identifier

A unique identifier for a single API request, often the vendor's `request_id`; used for vendor-side debugging and correlation with their server logs.

**Example:** Logging the request identifier returned by Anthropic lets support look up server-side traces when a call behaves unexpectedly.

#### Required Log Field

A field that must appear on every log line for the schema to be valid, typically including timestamp, model, token counts, and cost.

**Example:** `timestamp`, `model`, `input_tokens`, and `output_tokens` are required log fields—missing any of them breaks downstream cost calculation.

#### Reranker

A second-stage model that scores retrieved candidates against the query more precisely than the first-stage embedding similarity, improving precision before context injection.

**Example:** A reranker over the top-50 first-stage results selects the top-5 to inject, lifting answer quality without raising prompt size.

#### Response Format

The OpenAI request parameter controlling output structure—`text`, `json_object`, or `json_schema`—shaping how the model's content is returned and parsed.

**Example:** Setting `response_format={"type": "json_schema", "json_schema": {...}}` activates structured outputs against a schema.

#### Result Polling

The pattern of repeatedly checking batch or asynchronous job status until terminal, then fetching results; simpler than webhooks but less efficient.

**Example:** Result polling every five minutes against the batch status endpoint detects completion within the polling interval, fetching results when ready.

#### Retrieval Augmented Generation

A pattern that injects retrieved documents into the prompt at runtime so the model can answer questions over private or current data without fine-tuning. Often abbreviated RAG.

Retrieval-augmented generation is one of the largest sources of input token cost in production systems—what you retrieve, you pay to send.

**Example:** Retrieval-augmented generation on a 10,000-document knowledge base retrieves the top three matches per query and injects them into the prompt for grounded answers.

#### Retrieval Precision

The fraction of retrieved chunks that are actually relevant to the query; a key knob for context-injection efficiency.

**Example:** Adding a reranker raises retrieval precision from 0.4 to 0.8, meaning twice as many of the injected chunks are useful, supporting fewer injected chunks per call.

#### Retrieval Recall

The fraction of all relevant chunks in the corpus that the retriever surfaces in its top-K results; the failure mode is missing relevant content rather than including irrelevant content.

**Example:** Switching from K=3 to K=10 raises retrieval recall but may lower precision—use a reranker to filter back down.

#### Retrieval Score

The numeric similarity or relevance score returned by the retriever for a candidate document, used to rank, threshold, and decide context inclusion.

**Example:** Filtering by retrieval score above 0.7 keeps only confident matches, avoiding context bloat from marginally-relevant chunks.

#### Retrieved Context Bloat

The pattern of injecting too many or too-large retrieved chunks into the prompt, raising cost without improving (and sometimes hurting) answer quality.

**Example:** Retrieved context bloat from K=20 with 1,500-token chunks produces a 30,000-token input where K=4 with 600-token chunks would have answered just as well at one-tenth the cost.

#### Retry Policy

The set of rules governing when and how to retry a failed call—which errors are retryable, how many times, with what backoff—the spine of reliability under flaky vendor APIs.

**Example:** A retry policy of "retry 5xx and 429 with exponential backoff up to three times" balances reliability against runaway-retry cost.

#### Reusable Prompt Block

A named, versioned block of prompt content reused across multiple templates, maintained centrally so improvements propagate everywhere.

**Example:** A reusable prompt block `RESPONSE_FORMAT_RULES` is included by reference in every template, and a single edit updates all of them.

#### Routing Cost Savings

The dollar reduction realized by replacing a uniform-model setup with a routing policy, typically the largest single architectural win in this textbook.

**Example:** Routing cost savings of 60 percent on a chat product moved 70 percent of traffic from Sonnet to Haiku without measurable quality loss on routed-down traffic.

#### Routing Policy

The documented set of rules mapping (task type, difficulty, user tier, cost budget) to a model choice, version-controlled like any other configuration.

**Example:** A routing policy stored in `routing.yaml` declares "extract_entities → Haiku unless difficulty > 0.7, in which case Sonnet"—readable and reviewable.

#### Routing Quality Risk

The risk that routing-down to a cheaper model degrades user-perceived quality on a slice of traffic, even when aggregate metrics look fine.

**Example:** Routing quality risk on the 10 percent of users with non-English queries surfaces only when broken out by language—run the cohort analysis before declaring victory.

#### Runaway Detection

Heuristics that identify a session as runaway in real time—token velocity, repeated tool calls, no apparent progress—and trigger circuit breakers.

**Example:** Runaway detection flags a session reading the same file ten times in five minutes and forcibly compacts before token cost spirals.

#### Runaway Prompt

A prompt that grows unboundedly through retries, conversation history, or accidentally appended content, consuming far more tokens than intended.

A classic footgun: silent—no error, just a huge bill; easy to trigger—any unbounded loop will produce one; delayed damage—you see it only on the invoice.

**Example:** A runaway prompt where a retry loop appended the previous response to the next prompt grew to 800,000 tokens before being killed.

#### Sample Size Calculation

A pre-experiment computation determining how many observations are needed to detect a target effect size at a chosen significance and power level.

**Example:** A sample size calculation for detecting a 5 percent cost reduction at 80 percent power requires roughly 12,000 calls per arm.

#### Satisfaction Metric

A metric measuring user satisfaction—thumbs up rate, NPS, retention—used as a guardrail in cost experiments to avoid shipping savings that erode loyalty.

**Example:** A satisfaction metric tracked weekly catches a cost-cutting model swap that lowered thumbs-up rate from 88 percent to 81 percent.

#### Schema Enforcement

Using vendor structured-outputs or local validation to ensure the model's output matches a declared schema, eliminating downstream parse-error handling.

**Example:** Schema enforcement via OpenAI Structured Outputs or local Pydantic validation guarantees the response will deserialize, removing the retry loop for malformed JSON.

#### Schema Minimization

Reducing the size of an embedded JSON Schema by removing optional fields, descriptions, and examples once the model has been validated to behave correctly without them.

**Example:** Schema minimization on a tool definition shrinks a 600-token schema to 220 tokens with no measurable change in tool-use accuracy.

#### Script Delegation

The technique of having a skill instruct the model to invoke a bundled script rather than reproduce the logic inline in natural language, dramatically reducing token cost.

**Example:** Replacing a 4,000-token "how to compute statistics" skill body with a 200-token instruction to run `compute_stats.py` is script delegation.

#### Seed Parameter

An optional integer that biases sampling toward determinism for a given input, enabling reproducible runs in evaluation pipelines without setting temperature to zero.

**Example:** Setting `seed=42` on an OpenAI evaluation harness produces near-identical outputs across runs, making before/after comparisons valid.

#### Selective Compression

Compressing only specific sections of a prompt—few-shot examples, retrieved context—rather than the entire prompt, preserving structure and high-signal portions.

**Example:** Selective compression on retrieved context shrinks the documents while leaving the system prompt and user question untouched.

#### Selective Context Inclusion

Choosing which retrieved or historical content to include based on relevance, recency, and budget rather than including everything available.

**Example:** Selective context inclusion drops three of seven retrieved chunks when their relevance scores are below threshold, freeing context window for the user question.

#### Sensitive Field Redaction

The process of replacing sensitive content with placeholder tokens before the data leaves a controlled boundary; relevant for both prompts and logs.

**Example:** Sensitive field redaction in the request preprocessor strips API keys and credit-card numbers from user-supplied text before it reaches the model.

#### SentencePiece

An open-source tokenization library from Google that treats input text as a raw byte stream and learns subword units without requiring pre-tokenization, used by many multilingual models including Gemini.

**Example:** Gemini's tokenizer is built on SentencePiece, which is part of why Gemini token counts diverge from OpenAI's tiktoken on the same input.

#### Sequential Testing

A statistical methodology allowing early stopping with valid inference, controlling false-positive rates despite repeated peeks at the data.

**Example:** Sequential testing lets a cost experiment stop after one week if the win is overwhelming, instead of waiting for the full four-week sample.

#### Serial Execution

Running tool calls or agent steps one after another within a single session, the default behavior of most coding harnesses; predictable but slower than parallel.

**Example:** Serial execution of three independent file reads takes three round trips' worth of latency where parallel would have taken one.

#### Session Identifier

A stable identifier for a multi-turn conversation, used to roll up per-session cost and detect runaway sessions.

**Example:** A session identifier groups twenty turns of a Claude Code conversation so per-session token cost can be reported and capped.

#### Session Token Accumulation

The growth of input token count over the life of a coding session as each turn appends prior messages and tool results, often growing superlinearly without compaction.

**Example:** Session token accumulation drives a Claude Code chat from 25,000 input tokens on turn one to 180,000 by turn forty.

#### Shell Script Skill

A skill whose primary contribution is a shell script the model executes, with a thin natural-language body explaining when and how to invoke it.

**Example:** A shell script skill for cleanup runs `cleanup.sh` to remove build artifacts—body just says "when the user asks to clean up, run this script."

#### Short-Term Memory

State preserved within a single session via the conversation history, but not across sessions; the default behavior of any chat-style API.

**Example:** Short-term memory holds the current debugging session's findings until compaction or session end—after that, only what was written to long-term memory survives.

#### Skill

A self-contained, invokable capability bundle a harness can load on demand, defined by a description, body of instructions, and optional bundled scripts and assets.

Skills are how harnesses scale knowledge without paying token tax for every concept on every turn.

**Example:** A `mkdocs-publish` skill bundles the build commands, deploy steps, and post-publish checks so the model loads them only when needed.

#### Skill Asset File

A non-script asset—template, reference document, prompt fragment—shipped inside a skill bundle and referenced from the body or a script.

**Example:** A `template.md` skill asset file in the bundle is filled in by the script with the user's content.

#### Skill Body

The main instructional content of a skill, loaded into the model's context only when the skill is invoked; contains the procedure, examples, and constraints that shape behavior.

**Example:** The skill body for a code-review skill spells out the inspection checklist, the comment format, and the failure modes to watch for.

#### Skill Bundle

A directory containing a skill's main file, supporting scripts, asset files, and any sub-resources—loaded as a unit when the skill is invoked.

**Example:** A skill bundle for PDF generation contains the markdown body, a Python rendering script, and a CSS stylesheet referenced by the script.

#### Skill Description

The short natural-language summary of a skill's purpose used by the harness to decide whether to load it for the current task; the matching surface for trigger detection.

**Example:** A skill description like "Generates ISO 11179 glossary entries from term lists" makes the trigger criterion legible at a glance.

#### Skill Frontmatter

The metadata block at the top of a skill file—typically YAML—declaring the skill's name, description, and any harness-specific flags.

**Example:** `---\nname: spreadsheet-builder\ndescription: Builds Excel files from JSON\n---` is canonical skill frontmatter parsed by the harness.

#### Skill Invocation

The act of loading a skill into the conversation context, billing its body once and making its instructions available for subsequent turns.

**Example:** Skill invocation appends the skill body to the system prompt for the current turn, paid as input tokens against the session budget.

#### Skill Library

The collection of skills available to a harness, organized by purpose and maintained as a versioned artifact—often a git repository.

**Example:** A team's skill library lives in `~/Documents/ws/claude-skills`, symlinked into `~/.claude/skills` and pulled fresh at session start.

#### Skill Misfire

A skill invocation that does not match the user's actual intent, wasting tokens on an irrelevant body and possibly steering the model down the wrong path.

**Example:** A skill misfire loading the `pdf-export` skill on a "tell me about quarterly trends" question burns 3,000 tokens for no benefit.

#### Skill Refactor Project

A focused effort to audit and improve the skill library—shrinking bodies, raising trigger precision, moving logic into bundled scripts—to reduce per-session token overhead.

**Example:** A skill refactor project on a 30-skill library cuts average session overhead by 40 percent and improves trigger precision through tighter descriptions.

#### Skill Refactoring

The practice of revising a skill's description, body, or bundled scripts to improve trigger precision, reduce token cost, or fix observed misfires.

**Example:** Skill refactoring on a misbehaving documentation skill includes tightening the description and moving 2,000 tokens of examples into a referenced asset file.

#### Skill Selection

The harness's runtime choice of which skill (if any) to invoke for the current turn, based on description matches, explicit user invocation, or task classification.

**Example:** Robust skill selection avoids loading the `data-cleaning` skill when the user asked for a Slack message draft.

#### Skill Trigger

The criterion the harness uses to decide whether to load a skill on a given turn—usually a description match against the user's request, sometimes an explicit invocation.

**Example:** A skill trigger phrased as "use this when the user asks for a release notes draft" produces a high-precision match without false positives.

#### Sliding Window

A context-management strategy that keeps only the most recent N turns of a conversation, dropping older ones rather than accumulating; cheap but loses long-range context.

**Example:** A sliding window of the last six conversation turns keeps a chatbot's input bounded but means it forgets what was said twenty turns ago.

#### SOC2 Audit

A System and Organization Controls 2 (SOC 2) audit—an independent attestation that a service organization implements appropriate security, availability, and confidentiality controls. SOC 2 stands for System and Organization Controls 2.

**Example:** A SOC 2 audit for an LLM SaaS examines access controls, log retention, vendor management, and incident response—the auditor will ask to see prompt logging and PII redaction.

#### Span Identifier

An identifier for a single unit of work within a trace, recording its start, end, and attributes; spans nest hierarchically inside a trace.

**Example:** A span identifier marks the LLM-call span as a child of the parent "answer-question" span, with start time and duration attributes.

#### Special Tokens

Reserved token IDs not produced from natural text, used to mark structural roles like sequence boundaries, role separators, system instructions, or tool-call delimiters.

**Example:** Anthropic's Human and Assistant turn markers are special tokens injected automatically by the SDK around your message content.

#### Stable Prefix

The portion of the prompt that does not change across requests in a feature—system prompt, tool definitions, retrieved-but-stable context—the candidate for cache breakpoint placement.

**Example:** Identifying the stable prefix as "system prompt + tool definitions + first three few-shot examples" pinpoints exactly where to put the cache breakpoint.

#### Statistical Power

The probability that an experiment correctly rejects the null hypothesis when the treatment really does have the assumed effect; conventionally targeted at 80 percent.

**Example:** An underpowered experiment with 30 percent statistical power likely fails to detect a real but small win, leading the team to wrongly conclude no effect.

#### Statistical Significance

The criterion for treating an observed difference as unlikely to be due to chance, conventionally at p less than 0.05.

**Example:** A cost reduction of 4 percent at p = 0.001 is statistically significant; the same number at p = 0.18 is not, even if the point estimate looks favorable.

#### Stop Reason

A field on the Anthropic response indicating why generation ended: `end_turn`, `max_tokens`, `stop_sequence`, or `tool_use`; useful for detecting truncation and tool-call branching.

**Example:** A stop reason of `max_tokens` means the response was truncated and the caller should consider retrying with a larger budget or a more concise prompt.

#### Stop Sequence

A string the caller registers that, when emitted by the model, terminates generation early; useful for capping output length, parsing structured formats, and preventing runaway responses.

**Example:** Setting `stop=["\n\n"]` ends generation at the first blank line, often saving hundreds of unwanted output tokens on classification tasks.

#### Stop Sequence Setting

The configured stop sequences applied to a request, typically used to terminate at a known structural marker like a closing JSON delimiter or a double newline.

**Example:** A stop sequence setting of `["</answer>"]` ends generation cleanly at the closing tag, saving 50–100 trailing output tokens that would otherwise be billed.

#### Stopping Rule

A pre-specified criterion for ending an experiment—reaching the planned sample size, observing a guardrail breach, or hitting a sequential-test boundary.

**Example:** A stopping rule of "stop if guardrail metric drops more than 2 percent" kills experiments fast when something goes wrong.

#### Stratified Assignment

Partitioning the population into strata (free vs. paid users, by language, by feature usage) before random assignment to ensure each stratum is balanced across groups.

**Example:** Stratified assignment by user tier prevents an A/B test from accidentally placing all enterprise users in one group.

#### Streaming Cancellation

Closing the streaming connection mid-response when downstream conditions render the rest of the output unnecessary, avoiding billing for tokens never used.

**Example:** Streaming cancellation when the user navigates away from the chat tab saves the remaining 800 output tokens that would otherwise be generated and billed.

#### Streaming Response

A delivery mode in which the model emits output tokens to the client as soon as each is generated, allowing the application to display text progressively rather than waiting for the full response.

**Example:** A chat UI uses streaming so the user sees the answer materialize word by word; cancelling mid-stream avoids paying for unused output tokens.

#### Structured Logging

Logging in machine-readable formats—JSON Lines being the canonical choice—where every record has typed fields rather than free-text strings, enabling downstream aggregation and analysis.

Structured logging is the prerequisite for every cost-attribution dashboard in this textbook.

**Example:** A structured log line for an LLM call records `{"model": "claude-sonnet", "input_tokens": 4200, "output_tokens": 312, "cost_usd": 0.0173, ...}` rather than a sentence.

#### Structured Outputs

OpenAI's mode in which the response is constrained to match a caller-supplied JSON Schema, eliminating downstream parse errors and the need for retry-on-malformed-JSON loops.

**Example:** Passing a JSON Schema for a `{"sentiment": "positive"|"negative"|"neutral"}` shape with structured outputs guarantees the response will validate.

#### Subagent Pattern

A composition pattern where a parent agent delegates a focused subtask to a child agent with its own (typically smaller) context window, reducing parent context bloat.

**Example:** A coding agent invokes a subagent to write unit tests, getting back a summary instead of inheriting the entire test-writing conversation.

#### Subtask Budget Allocation

Dividing a parent agent's budget among subagents, each with its own cap, so one runaway subtask cannot consume the parent's full budget.

**Example:** Subtask budget allocation gives the test-writer subagent 50,000 tokens and the doc-writer subagent 30,000—exhausting one does not kill the other.

#### Subword Tokenization

A tokenization approach that splits text into units smaller than whole words but larger than individual characters, balancing vocabulary size against sequence length and rare-word handling.

**Example:** Subword tokenization lets a model represent "cryptocurrency" as "crypto" + "currency" without needing either as a vocabulary entry.

#### Summarization-Based RAG

A retrieval-augmented generation variant that summarizes large retrieved documents before injection rather than sending them whole, trading a summarization call for sharply reduced context size.

**Example:** Summarization-based RAG runs a cheap Haiku summarization pass over each retrieved chunk before injecting into a Sonnet answer call—cheaper than sending raw chunks to Sonnet.

#### Symbol Substitution

Replacing verbose phrases or markers with short symbols the model still understands—e.g., `Q:` and `A:` instead of "Question:" and "Answer:"—saving tokens at scale.

**Example:** Symbol substitution from "Customer Support Agent says:" to `CS:` cuts a few-shot example block by 8 percent.

#### System Prompt

A top-level instruction block placed before the conversation that establishes role, tone, constraints, and tool-use policy for the assistant; persists across every turn until the session ends.

System prompts are notorious bloat sources—teams pile instructions in over time and rarely audit them.

**Example:** A 4,000-token system prompt that says "be helpful and never mention competitors" gets billed on every single turn of every session.

#### System Prompt Hygiene

The discipline of regularly reviewing the system prompt to remove stale instructions, redundant boilerplate, and obsolete examples; a recurring source of token waste.

**Example:** A system prompt hygiene review every quarter cuts the system prompt from 6,000 to 2,200 tokens by removing instructions for features that shipped six months ago.

#### Task Classifier

A small, fast model or rule that labels each incoming request by task type—classification, extraction, summarization, code generation—as input to routing.

**Example:** A task classifier on Haiku tags the incoming request as `extract_entities` or `chat`, and the router selects the model best suited to that label.

#### Task Decomposition

The practice of breaking a complex user request into smaller subtasks, each potentially handled by a different skill, model, or subagent.

**Example:** A "ship the release" request decomposes into changelog drafting, version bumping, tagging, and deploying—each a distinct task-skill binding.

#### Task-Skill Binding

The mapping from a recognized subtask to the skill best suited to handle it, governing which skill the harness invokes.

**Example:** A task-skill binding routes "draft release notes" to the `release-notes` skill rather than the more generic `markdown-writer`.

#### Temperature

A sampling parameter controlling randomness during decoding; lower values bias toward the highest-probability token, higher values flatten the distribution and produce more varied output.

**Example:** Setting temperature to 0 makes a classifier deterministic and reproducible; setting it to 1.0 is appropriate for creative drafting.

#### Template Versioning

Tracking prompt template revisions in version control with explicit version numbers, enabling rollback, A/B comparison, and reproducible cost analysis.

**Example:** Template versioning labels the new summarize template `summarize_v3` and logs it on every call so the cost dashboard can compare v2 versus v3.

#### Thinking Token Budget

The maximum number of thinking tokens Claude is permitted to generate during extended thinking, set per request to cap the cost of internal reasoning.

**Example:** Setting `thinking={"type": "enabled", "budget_tokens": 10000}` allows up to 10,000 thinking tokens before Claude must commit to its visible answer.

#### Thinking Token Limit

The specific Anthropic parameter (`budget_tokens` inside `thinking`) capping extended-thinking output, the Anthropic-flavored implementation of reasoning budget.

**Example:** Setting `thinking={"type": "enabled", "budget_tokens": 8000}` enforces a thinking token limit so Claude commits to an answer rather than running exploratory thinking unbounded.

#### Throughput Optimization

Designing a workload to maximize tokens processed per unit time per dollar, often through batch APIs, parallelism, and batch size tuning.

**Example:** Throughput optimization on a nightly classification job uses the batch API plus batched embedding pre-fetch to process ten million records before morning.

#### Tiktoken Library

OpenAI's open-source Python library implementing the tokenizers used by GPT-3.5, GPT-4, and successor models, enabling local token counting without API calls.

**Example:** `tiktoken.encoding_for_model("gpt-4o").encode(prompt)` returns a list whose length is the exact billable input token count.

#### Time Series Aggregation

Bucketing event-level data into time intervals (minute, hour, day) and summarizing within each bucket, the foundation of every dashboard chart.

**Example:** Time series aggregation rolls up per-call cost into hourly sums for a clean dashboard chart instead of a million points.

#### Token

The atomic unit of text that a language model reads or writes, typically a subword fragment ranging from a single character to a short word, produced by a tokenizer applied to input text.

Tokens are the billing unit for every commercial large language model API; the entire economic model of this textbook revolves around them.

**Example:** The string "tokenization" might split into the tokens "token" and "ization", counting as two tokens against your billed input.

#### Token Boundary

The position between adjacent tokens in an encoded sequence; relevant for prompt caching because cache breakpoints must align with token boundaries to be effective.

**Example:** Inserting a single character at the wrong position can shift every subsequent token boundary and invalidate a cached prefix.

#### Token Budget

A target ceiling on token consumption set per request, per session, per user, or per feature, enforced through truncation, routing, or hard rejection when exceeded.

**Example:** A coding agent with a 200,000-token per-session budget cancels gracefully when it crosses the threshold rather than running away to a million tokens.

#### Token Count

The integer number of tokens in a piece of text under a specific tokenizer; the same string yields different counts across Claude, GPT, and Gemini due to vocabulary differences.

**Example:** A 1,000-character JSON payload might count as 280 tokens in tiktoken but 310 tokens in the Claude tokenizer.

#### Token Count Caching

Memoizing the token count of static prompt fragments—system prompts, tool definitions, few-shot examples—so repeated requests skip recomputation.

**Example:** A system prompt is hashed and its token count cached at startup; subsequent budget checks subtract a constant rather than tokenizing 4,000 characters.

#### Token Counting API

A vendor-provided endpoint that returns the exact token count for a given input under that vendor's tokenizer without running generation, used for billing estimation and budget gating.

**Example:** Anthropic's `messages.count_tokens` returns the input token count for a proposed request so you can reject it before it bills.

#### Token Dashboard Project

The specific engineering project of building the team's first cost dashboard—log schema, metric pipeline, charts—often the foundational deliverable of a token-efficiency initiative.

**Example:** A token dashboard project produces the daily cost-by-feature and cost-by-user views that subsequent optimizations rely on for prioritization and validation.

#### Token Efficiency Roadmap

A multi-quarter plan sequencing cost-reduction projects, dependencies, and targets; the artifact aligning engineering with finance on what comes when.

**Example:** A token efficiency roadmap puts logging in Q1, dashboards in Q2, prompt caching rollout in Q3, and routing in Q4, each with target savings.

#### Token Reduction Ratio

The proportional decrease in token cost achieved by an optimization, typically expressed as the ratio of (old − new) / old.

**Example:** Moving a skill from 4,000 tokens of inline examples to a 200-token script invocation yields a 95 percent token reduction ratio.

#### Token Spike Alert

A specific alerting rule firing on sudden, sustained increases in token consumption, intended to catch runaway prompts and pathological agent loops.

**Example:** A token spike alert at 10x the rolling-hour average wakes on-call when a prompt template starts generating 50,000-token outputs.

#### Token Usage Object

The structured field returned by OpenAI on every response reporting the token counts: `prompt_tokens`, `completion_tokens`, and `total_tokens`, the source of truth for billing reconciliation.

**Example:** Logging `response.usage.dict()` on every call captures the exact token counts for cost attribution and dashboards.

#### Token Volume Chart

A chart plotting input or output token counts over time, often broken down by model or feature, used to spot ramps and seasonality.

**Example:** A token volume chart shows output tokens climbing 5 percent week over week on `summarize`, predicting the next month's bill.

#### Token-Aware Rewriting

Editing prompts with explicit attention to token count, using a tokenizer to measure each variant's cost rather than guessing from character count.

**Example:** Token-aware rewriting confirms that swapping "Please ensure that" for "Make sure" saves three tokens, accumulating across millions of calls.

#### Token-To-Char Ratio

The ratio of token count to character count in a piece of text, useful for quick budget estimation; English prose averages roughly one token per four characters across major tokenizers.

**Example:** A 12,000-character document is approximately 3,000 tokens, enough for a rule-of-thumb budget check before a precise count.

#### Tokenized Identifier

A surrogate identifier (different from LLM tokens) that maps to a sensitive value through a vault, allowing systems to reference the user without exposing the underlying ID.

**Example:** A tokenized identifier `usr_4f9e2d` represents a customer in logs; the mapping to email lives in a vault accessible only to authorized services.

#### Tokenizer

A deterministic algorithm that converts a string into a sequence of integer token IDs and back, parameterized by a fixed vocabulary learned during model training.

**Example:** OpenAI's tiktoken is a tokenizer; calling `encoding.encode("hello world")` returns a list of integer IDs ready for billing estimation.

#### Tool Call Iteration

A single cycle of the agentic loop—one model call, one or more tool invocations, and the resulting tool_result content fed back to the next call.

**Example:** Counting tool call iterations per session reveals which tasks balloon into thirty-step loops versus settle in three.

#### Tool Call Throttling

Rate-limiting how often a tool can be called within a session, preventing tight loops that would otherwise burn tokens via repeated tool_result inflation.

**Example:** Tool call throttling of "no more than three reads of the same file per session" defuses a common pathological loop pattern.

#### Tool Choice Parameter

A request parameter constraining whether and which tool the model is allowed or required to call: `auto`, `none`, `required`, or a specific tool name.

**Example:** Setting `tool_choice={"type": "function", "function": {"name": "extract_entities"}}` forces the model to call exactly that tool—useful for structured extraction.

#### Tool Definition Schema

The JSON Schema describing a tool's name, parameters, and expected behavior, included in the request so the model knows what tools exist and how to call them.

**Example:** `{"name": "get_weather", "input_schema": {"type": "object", "properties": {"city": {"type": "string"}}, "required": ["city"]}}` is a tool definition schema.

#### Tool Result Block

A content block of type `tool_result` returned by the caller in the next user turn, carrying the output of a tool the model previously invoked along with the matching tool_use_id.

**Example:** After Claude emits `tool_use_id=abc123` calling `get_weather`, the caller responds with `{"type": "tool_result", "tool_use_id": "abc123", "content": "72°F sunny"}`.

#### Tool Use Loop

A specific agentic loop driven by the model's tool calls; equivalent to agentic loop in most modern harnesses but emphasizes the tool-call-then-result cadence.

**Example:** Each iteration of the tool use loop appends a tool_use and tool_result pair to the conversation, growing the next request's input.

#### Top P Sampling

A decoding strategy that samples only from the smallest set of tokens whose cumulative probability exceeds a threshold p, dynamically narrowing the candidate pool based on the distribution shape.

**Example:** Setting `top_p=0.9` means the model considers only tokens accounting for the top ninety percent of probability mass at each step.

#### Top-K Retrieval

Returning the K most-similar chunks to the query embedding, where K is a tuning knob balancing context completeness against prompt cost.

**Example:** Top-K retrieval with K=5 sends the five most relevant chunks to the model; raising K to 20 raises cost and risks lost-in-the-middle quality decay.

#### Top-N Cost Drivers

The N items (features, users, prompts, sessions) responsible for the largest share of spend, the canonical first question of cost analysis.

**Example:** A top-N cost drivers report shows the top three features account for 75 percent of spend—the focus of next sprint's optimization.

#### Total Tokens Field

The `total_tokens` integer in the OpenAI usage object equal to the sum of prompt and completion tokens; convenient for context-window utilization metrics but not a direct cost input.

**Example:** Plotting `total_tokens` distribution per feature exposes which features are running close to context-window limits.

#### Trace Identifier

A unique identifier propagated across all calls and spans participating in one logical operation, used to reconstruct cross-service request flows in observability tools.

**Example:** A trace identifier links the LLM call, the embedding lookup, and the database query that together produced one user-facing answer.

#### Traffic Split

The proportional allocation of users or requests between control and treatment groups in an A/B test—often 50/50 but adjustable for risk control.

**Example:** A 90/10 traffic split exposes only 10 percent of users to a risky treatment, limiting blast radius if quality regresses.

#### Transformer Architecture

A neural network design built on self-attention layers that process all positions of a sequence in parallel, replacing recurrence with weighted lookups across tokens; the basis of every modern large language model.

**Example:** When a request enters Claude or GPT, the transformer attends across every prompt token simultaneously, which is why context length quadratically affects compute cost.

#### Treatment Group

The subset of users or requests in an A/B test receiving the proposed change, whose metrics are compared against the control group's.

**Example:** The treatment group sees the new shorter system prompt; differences in cost and quality versus control determine whether to ship.

#### Trigger Precision

A measurable property of a skill's description quantifying how often invocations are correct; high precision means few misfires and few misses.

**Example:** Improving trigger precision often means rewriting the description to include the canonical phrasing users actually employ.

#### Truncation Detection

Detecting that the response was cut off (stop reason `max_tokens` or equivalent) and reacting—retry with larger budget, return partial result, or escalate to a stronger model.

**Example:** Truncation detection on a `stop_reason == "max_tokens"` triggers a retry with `max_tokens` doubled, salvaging the 5 percent of calls that would otherwise return mid-sentence.

#### Unicode Normalization

The process of converting text to a canonical Unicode form (typically NFC or NFKC) before tokenization to ensure visually identical strings produce identical token sequences.

**Example:** Without normalization, "café" written with a precomposed character and with a combining accent would tokenize differently and break cache hit matching.

#### Unit Economics

The per-event cost and revenue analysis applied to AI features—cost per request, cost per user, cost per outcome—used to determine whether a feature is sustainably priced.

**Example:** A summarization feature costing \$0.04 per request and embedded in a \$10/month subscription needs to stay below 250 uses per user to remain profitable.

#### User Identifier

A log field carrying a stable identifier for the end user—account ID, hashed email, or anonymized token—used for per-user cost roll-ups and abuse detection.

**Example:** A user identifier hashed from the account ID protects PII while still enabling distributional analysis of cost per user.

#### User Message

A message in the conversation array authored by the human or upstream caller, distinct from the system prompt and the model's assistant replies.

**Example:** In `messages: [{role: "user", content: "Summarize this PDF"}]`, the string "Summarize this PDF" is the user message.

#### Variable Interpolation

The mechanism that substitutes runtime values for prompt variables in a template, producing the final prompt sent to the model.

**Example:** Variable interpolation at the end of the prompt rather than the start preserves a long stable prefix for prompt caching.

#### Vector Database

A database optimized for similarity search over high-dimensional embedding vectors, returning nearest-neighbor results in milliseconds.

**Example:** Pinecone, pgvector, and Weaviate are vector databases used to store millions of document embeddings for retrieval-augmented generation.

#### Vendor Data Retention

The policy describing how long the model vendor stores prompts, completions, and metadata, and under what conditions—frequently configurable on enterprise plans.

**Example:** Anthropic's standard vendor data retention is 30 days for safety review; enterprise contracts can shorten this or eliminate retention entirely.

#### Vendor Lock-In Risk

The architectural risk of becoming dependent on one vendor's API, pricing, or quirks, making it expensive to switch when prices or quality change.

**Example:** Vendor lock-in risk grows when product code is full of `anthropic`-specific calls; a vendor-neutral abstraction insulates against future vendor changes.

#### Vendor-Neutral Abstraction

An internal API wrapping multiple vendor SDKs behind a uniform interface, enabling routing, vendor swaps, and cost-comparison without rewriting product code.

**Example:** A vendor-neutral abstraction `llm.complete(messages, model="auto")` routes under the hood while the product code stays vendor-agnostic.

#### Vendor-Neutral Logging Project

The engineering project of standardizing log schema across vendors so downstream analysis works the same regardless of where the call went.

**Example:** A vendor-neutral logging project translates Anthropic's `cache_read_input_tokens` and OpenAI's cached billing into a common `cached_tokens` field for the dashboard.

#### Verbose Boilerplate

Filler phrases—greetings, disclaimers, polite throat-clearing—that add tokens without information value; trimmable on every call.

**Example:** Verbose boilerplate like "I hope this helps! Please let me know if you have any other questions." can be banned via instruction, saving 30 output tokens per call.

#### Verbosity Parameter

A vendor-specific knob (e.g., GPT-5's `verbosity`) controlling how detailed the response should be, an explicit handle on output length without prompt engineering.

**Example:** Setting `verbosity="low"` on a supported model produces brief answers comparable to a "be concise" instruction without occupying prompt tokens.

#### Vertex AI

Google Cloud's managed platform exposing Gemini and other models behind enterprise controls—IAM, VPC Service Controls, audit logging, and data-residency commitments.

**Example:** A regulated bank uses Vertex AI rather than direct Gemini API access to satisfy data-residency and audit-logging requirements.

#### Vocabulary Size

The total number of distinct token IDs a tokenizer can emit; larger vocabularies produce shorter token sequences for typical text but raise model parameter counts.

**Example:** GPT-4 uses a roughly 100,000-entry vocabulary; doubling it might cut average token counts by ten percent but inflate the embedding matrix.

#### Volatile Suffix

The portion of the prompt that changes per request—the user question, the latest conversation turn, freshly retrieved context—placed after the cache breakpoint.

**Example:** Keeping the volatile suffix at the end of the prompt preserves the long stable prefix, maximizing cache hit rate.

#### Volume Discount

A reduced per-token price offered to high-volume customers, typically through enterprise contracts; not available on standard pay-as-you-go APIs.

**Example:** A team committing to fifty million tokens per month negotiates a volume discount of 15 percent off list price, applied retroactively at month end.

#### Wall Clock Limit

A cap on total elapsed time for a session, independent of token or iteration count; useful when long sessions are themselves the problem.

**Example:** A wall clock limit of 90 minutes ends a session even if it has not hit token or iteration caps—forcing the user to start fresh and reload context.

#### Webhook Notification

An HTTP callback the vendor invokes when an async job completes, an alternative to polling that scales better but requires a public endpoint.

**Example:** Configuring a webhook notification on batch job completion lets the result-processing handler fire immediately on completion, no polling needed.

#### Weekly Limit

Anthropic's rolling 7-day usage limit on Claude subscription plans, complementing the 5-hour limit by capping aggregate consumption over the week.

**Example:** A Claude Max user near the weekly limit late in the week paces remaining work or moves to API billing for the rest of the cycle.

#### Whitespace Handling

The tokenizer-specific behavior governing how spaces, tabs, and newlines are encoded; some tokenizers treat leading whitespace as part of the following word, others emit dedicated whitespace tokens.

**Example:** In tiktoken, " hello" (with a leading space) and "hello" tokenize differently—a footgun when assembling prompts by string concatenation.

#### Whitespace Stripping

Removing redundant whitespace—double spaces, trailing newlines, indentation in a prompt that does not need it—to eliminate tokens that contribute nothing.

**Example:** Whitespace stripping on a JSON-formatted few-shot example removes pretty-print indentation, saving 80 tokens per call without changing meaning.

#### Working Directory Context

The current working directory and visible file tree at session start, automatically surfaced to the model so it can navigate the project without guesswork.

**Example:** Claude Code surfaces working directory context in the system prompt so the model knows it is in a Python project with `pyproject.toml` and a `tests/` folder.

#### Zero-Shot Prompting

Prompting without any in-prompt examples, relying entirely on the model's pretraining and the task description; the cheapest mode when it works.

**Example:** Zero-shot prompting works for sentiment classification on Sonnet—Haiku might need a few-shot example, but Sonnet does not.


---
title: The Agent That Wouldn't Stop — A Weekend Spiral and a $2,300 Lesson
description: A 9-panel graphic novel about a platform-engineering team whose autonomous coding harness spiraled into 1,400 tool calls over a weekend — and the budget policy they wrote so it could never happen again.
image: /stories/agent-that-wouldnt-stop/cover.png
og:image: /stories/agent-that-wouldnt-stop/cover.png
twitter:image: /stories/agent-that-wouldnt-stop/cover.png
social:
   cards: false
---

# The Agent That Wouldn't Stop

![](./cover.png)
<details>
<summary>Cover Image Prompt</summary>
(This is the Cover Image. Do not include this label in the image.)
Please generate a wide-landscape 16:9 cover image in modern flat vector cartoon illustration style with clean lines and a slightly ominous mood. Center: a dim Friday-evening office, lit only by a glowing laptop on a desk. The laptop screen shows an agentic harness in mid-loop: a long terminal scroll of "edit file → run tests → tests fail → edit file" repeating dozens of times, with a token-counter widget reading "2,341,008 tokens." A coffee mug sits abandoned next to the keyboard. To the right side of the frame, an oversized speedometer dial labeled "TOKEN BUDGET" has its needle pinned far past red. Above the scene, the title text "The Agent That Wouldn't Stop" in bold sans-serif lettering. Color palette: deep russet (#c1440e), warm cream (#fff8e7), slate (#37474f), burnt orange (#d35400), with a heavy slate-blue night tone. Emotional tone: ominous, the quiet of a runaway process nobody is watching. Generate the image immediately without asking clarifying questions.
</details>

<details>
<summary>Narrative Prompt</summary>
This is a 9-panel educational graphic novel for the Token Optimization textbook. Setting: a fictional platform-engineering team at a mid-size company. The story spans a Friday evening through Monday morning. Art style: modern flat vector cartoon illustration with clean lines, slightly cinematic in mood. Characters appear consistently:

- **Tomas** — platform engineer, late 20s. Eastern European, pale skin, dirty-blond hair, gray hoodie with company logo, wireless earbuds.
- **Priya** — engineering manager. South Asian woman, late 30s, dark hair in a bun, blazer over a t-shirt, reading glasses on a chain.
- **Pemba** — recurring red-panda mascot. Russet fur, cream belly, white facial mask with black tear marks, wire-rim glasses, bushy ringed tail. **No clothing.** Cameos as the wisdom figure on the policy panel.

Color palette: deep russet (#c1440e), warm cream (#fff8e7), slate (#37474f), burnt orange (#d35400). Maintain consistent character appearances across all 9 panels.
</details>

### Prologue – Autonomy Without a Budget

Tomas had heard the marketing pitch a hundred times: agentic harnesses can clean up a codebase overnight while you sleep. So one Friday at 6:47 PM, he typed a single sentence — *"clean up the auth module"* — hit enter, packed his laptop bag, and went home for the weekend. The agent did clean things up. It also rewrote the same flaky test fourteen times, edited the same file forty-three times, and sent 1,400 tool calls into the void. By Monday, the bill was \$2,300.

## Panel 1: The Friday Send-Off

![](./panel-01.png)
<details><summary>Image Prompt</summary>
(This is Panel 01. Do not include the panel number in the image.)
I am about to ask you to generate a series of images for a graphic novel. Please make the images have a consistent style and consistent characters. Do not ask any clarifying questions. Just generate the image immediately when asked.

Please generate a 16:9 image in modern flat vector cartoon illustration style depicting panel 1 of 9. Scene: Friday at 6:47 PM, almost-empty office, golden-hour light through the windows. Tomas — late 20s, pale skin, dirty-blond hair, gray hoodie — stands at his desk, laptop open, packing a backpack with one hand while typing with the other. The screen shows a single line in the agent prompt input: "clean up the auth module" with a blinking cursor. He grins, hits enter, slings the bag over his shoulder. The clock on the wall reads 6:47. Color palette: deep russet, warm cream, slate, burnt orange. Emotional tone: cheerful confidence — the optimism of "let it run while I'm away." Generate the image immediately without asking clarifying questions.
</details>

Tomas had a dinner reservation at 7:30. He typed *"clean up the auth module"* into the agent prompt, hit enter, watched the first tool call fire, and grabbed his bag. The agent confidently announced: *"Beginning refactor of authentication module."* Tomas grinned. *"You got this, buddy."* He turned out the lights on his way out.

## Panel 2: Hour Three

![](./panel-02.png)
<details><summary>Image Prompt</summary>
(This is Panel 02. Do not include the panel number in the image.)
Please generate a 16:9 image in modern flat vector cartoon illustration style depicting panel 2 of 9. Make the characters and style consistent with the prior panel. Scene: the same desk, three hours later, completely dark office except for the laptop screen. The terminal shows the agent at "Iteration 47 — re-running test_login_flow.py for the 12th time." A flaky test has marked the same single test as red, then green, then red again across the visible scrollback. The token counter in the corner reads "847,213 tokens." No people in the panel. Through the window, city lights twinkle. Color palette: deep russet, warm cream, slate, burnt orange, with a heavy slate-blue night tone. Emotional tone: ominously calm — a process running fine and going nowhere. Generate the image immediately without asking clarifying questions.
</details>

By 9:47 PM, the agent had hit a flaky test. *test_login_flow* failed once, passed once, failed twice. The agent took this to mean the auth code must be wrong, and edited the auth module to "fix" it. The test then failed for a different reason. The agent edited the auth module again. And again.

## Panel 3: Saturday Morning

![](./panel-03.png)
<details><summary>Image Prompt</summary>
(This is Panel 03. Do not include the panel number in the image.)
Please generate a 16:9 image in modern flat vector cartoon illustration style depicting panel 3 of 9. Make the characters and style consistent with the prior panel. Scene: Saturday morning sunlight slanting through the office window. The laptop screen shows the agent at "Iteration 312 — investigating regression in token_refresh helper." The token counter reads "1,492,007 tokens." A small notification banner reads "Auth.py edited 28 times." On the desk, an abandoned coffee mug sits next to a half-eaten granola bar from Friday afternoon. Color palette: deep russet, warm cream, slate, burnt orange, with morning-amber accents. Emotional tone: quiet horror — a workshop nobody is supervising. Generate the image immediately without asking clarifying questions.
</details>

Saturday morning, while Tomas was hiking, the agent was on iteration 312. *Auth.py* had been edited twenty-eight times. Each edit "fixed" a regression caused by the previous edit. The agent dutifully wrote a thoughtful commit message for each one: *"Refining null-check coverage in token refresh helper."* The token meter ticked steadily upward.

## Panel 4: Monday Morning Coffee

![](./panel-04.png)
<details><summary>Image Prompt</summary>
(This is Panel 04. Do not include the panel number in the image.)
Please generate a 16:9 image in modern flat vector cartoon illustration style depicting panel 4 of 9. Make the characters and style consistent with the prior panel. Scene: Monday morning, 8:30 AM, bright office. Tomas walks in cheerfully holding a fresh coffee. He stops mid-stride, mug halfway to his mouth, eyes locked on his laptop screen. The screen shows the agent at "Iteration 1,397" with a token counter reading "2,341,008 tokens." A red banner across the top reads "ESTIMATED RUN COST: $2,287.45." Tomas's coffee tilts dangerously in his hand. Color palette: deep russet, warm cream, slate, burnt orange. Emotional tone: cinematic horror — the moment a weekend's bill registers. Generate the image immediately without asking clarifying questions.
</details>

Monday at 8:30, Tomas walked in whistling, set his coffee down, sat at his desk, and read the screen. He read it again. He read it a third time, in case the digits had rearranged. *Iteration 1,397. Two million three hundred forty-one thousand tokens. Estimated cost: \$2,287.45.* The coffee tilted in his hand. It did not fall, but it was a near thing.

## Panel 5: The Manager Conversation

![](./panel-05.png)
<details><summary>Image Prompt</summary>
(This is Panel 05. Do not include the panel number in the image.)
Please generate a 16:9 image in modern flat vector cartoon illustration style depicting panel 5 of 9. Make the characters and style consistent with the prior panel. Scene: a small meeting room with glass walls. Tomas, slightly hunched, sits across from Priya — South Asian woman, late 30s, dark hair in a bun, blazer over a t-shirt, reading glasses on a chain. Priya is calm, not angry, with one hand on the table holding a printed chart of the weekend's tool calls. She is mid-sentence; Tomas listens with the attentive look of someone who knows exactly what's coming. Through the glass wall, two colleagues pretend not to be looking. Color palette: deep russet, warm cream, slate, burnt orange. Emotional tone: a fair conversation — accountability without humiliation. Generate the image immediately without asking clarifying questions.
</details>

Priya pulled up the chart and slid it across the table. She wasn't angry. She was, in fact, fascinated. *"This is the cleanest case of a flaky test eating a budget I've ever seen,"* she said. *"You're going to write the postmortem. And then you're going to write the policy. By Friday."* Tomas nodded. He had a lot of nodding to do that morning.

## Panel 6: The Whiteboard Session

![](./panel-06.png)
<details><summary>Image Prompt</summary>
(This is Panel 06. Do not include the panel number in the image.)
Please generate a 16:9 image in modern flat vector cartoon illustration style depicting panel 6 of 9. Make the characters and style consistent with the prior panel. Scene: a large whiteboard covered in a clean policy diagram. Headers: "PER-SESSION TOKEN CAP," "LOOP ITERATION LIMIT," "FILE-EDIT CIRCUIT BREAKER," "WALL-CLOCK CEILING." Each header has a brief rule under it: "Cap = 200,000 tokens," "Max iterations = 50," "Trip if same file edited >5 times," "Hard stop at 4 hours wall-clock." Tomas stands at the whiteboard with a marker; Priya, two engineers, and Pemba — russet fur, cream belly, white facial mask, wire-rim glasses, bushy ringed tail, no clothing — sit cross-legged on a beanbag chair in the corner reviewing a printout. Color palette: deep russet, warm cream, slate, burnt orange. Emotional tone: focused craftsmanship — designing the guardrails. Generate the image immediately without asking clarifying questions.
</details>

The policy took a week to draft and ten minutes to explain. *Per-session token cap. Loop-iteration limit. File-edit circuit breaker. Wall-clock ceiling.* Four numbers, each one defended with a story. Pemba, who had wandered in from the textbook for the occasion, sat on a beanbag and offered exactly one sentence: *"Autonomy without a budget is just a leak with ambition."*

## Panel 7: The Implementation

![](./panel-07.png)
<details><summary>Image Prompt</summary>
(This is Panel 07. Do not include the panel number in the image.)
Please generate a 16:9 image in modern flat vector cartoon illustration style depicting panel 7 of 9. Make the characters and style consistent with the prior panel. Scene: a code editor on a monitor showing a clean Python config file labeled `agent_budget.yaml` with the four limits clearly visible. A second window shows a small dashboard with four live gauges for the running agent: tokens, iterations, file edits, wall-clock — each with a colored threshold band (green/yellow/red). Tomas types calmly at the keyboard. The clock on the wall reads 4:30 PM. Color palette: deep russet, warm cream, slate, burnt orange. Emotional tone: quiet competence — building the safety net. Generate the image immediately without asking clarifying questions.
</details>

Tomas wrote the config file in one afternoon. Four limits. Four dashboard gauges. A graceful-degradation hook that paused the agent and posted to Slack the moment any limit was hit, instead of failing silently. He tested it by running the same auth-module refactor with a deliberately-induced flaky test. The agent stopped at iteration 50 with a polite Slack message: *Halted. Need human guidance.*

## Panel 8: The Test Run

![](./panel-08.png)
<details><summary>Image Prompt</summary>
(This is Panel 08. Do not include the panel number in the image.)
Please generate a 16:9 image in modern flat vector cartoon illustration style depicting panel 8 of 9. Make the characters and style consistent with the prior panel. Scene: the dashboard from panel 7, mid-afternoon. The "iterations" gauge is yellow at 47/50, with a Slack notification visible in the corner: "@tomas — agent halted at iteration 50. Same file edited 6 times. Suspicion: flaky test. Awaiting input." Tomas looks at the screen with a small, satisfied smile, hands clasped behind his head. Priya, walking past, gives a thumbs-up through the glass. Color palette: deep russet, warm cream, slate, burnt orange. Emotional tone: vindicated calm — the safety net catches its first thing. Generate the image immediately without asking clarifying questions.
</details>

Two weeks later, the system caught its first real-world spiral. A different engineer's agent hit the same flaky-test pattern, edited the same file six times, and was halted at iteration 47 with a polite Slack notification. The engineer fixed the test in five minutes instead of spending \$2,300. The savings paid for the policy work in a single incident.

## Panel 9: The Sticky Note

![](./panel-09.png)
<details><summary>Image Prompt</summary>
(This is Panel 09. Do not include the panel number in the image.)
Please generate a 16:9 image in modern flat vector cartoon illustration style depicting panel 9 of 9. Make the characters and style consistent with the prior panel. Scene: a calm, end-of-day office. On the wall above the team's bank of monitors, a printed framed poster reads: "AUTONOMY WITHOUT A BUDGET IS JUST A LEAK WITH AMBITION. — Pemba." Pemba — russet fur, cream belly, white facial mask, wire-rim glasses, bushy ringed tail, no clothing — sits on top of the printer, reviewing the poster with a satisfied expression. In the foreground, Tomas at his desk types calmly with one hand and watches the four green gauges on a small monitor with the other. Color palette: deep russet, warm cream, slate, burnt orange, with warm late-afternoon light. Emotional tone: settled competence — a habit institutionalized. Generate the image immediately without asking clarifying questions.
</details>

The team printed and framed Pemba's sentence. It went up over the agent dashboard. Three months later, when a new engineer joined, the first thing they were taught was the four limits — not as cautionary tale, but as the way the team worked. The bill was never the same again. Neither were the weekends.

### Epilogue – What Tomas (and Priya) Did Right

Tomas made the original mistake every honest engineer is going to make at least once: he trusted an autonomous agent to know when to stop. Priya made the right managerial call: she didn't punish the incident, she institutionalized the lesson. Together they turned a \$2,300 weekend into a policy that has caught dozens of would-be spirals since. The lesson scales: any system that can act without supervision needs a budget that can stop it without supervision.

| Challenge | How the Team Responded | Lesson for Today |
|-----------|------------------------|------------------|
| The agent looped on a flaky test for 1,400 iterations | Added a per-session token cap | Tokens are the only universal currency an agent understands |
| The agent edited the same file 28+ times | Added a file-edit circuit breaker | Repetition on the same file is the signal of a stuck loop |
| The agent ran for 60+ wall-clock hours unattended | Added a wall-clock ceiling | Time is a budget the user can reason about; tokens are too abstract alone |
| The original failure was silent until Monday | Added Slack notifications on every limit trip | Silent runaway is the worst kind — surface every halt loudly |

### Call to Action

If your team uses an autonomous agent or coding harness, ask one question this week: *what's our limit?* If you can't name a per-session token cap, an iteration count, a file-edit circuit breaker, and a wall-clock ceiling — you don't have a policy. You have a Friday-evening deploy waiting to spiral. Write the four numbers down before the next long weekend.

---

*"Autonomy without a budget is just a leak with ambition."*
— Pemba

*"This is the cleanest case of a flaky test eating a budget I've ever seen."*
— Priya, engineering manager

---

## References

1. [Wikipedia: Software agent](https://en.wikipedia.org/wiki/Software_agent) — General background on autonomous software agents and their failure modes
2. [Wikipedia: Circuit breaker design pattern](https://en.wikipedia.org/wiki/Circuit_breaker_design_pattern) — The pattern this story's file-edit limiter implements
3. [Wikipedia: Infinite loop](https://en.wikipedia.org/wiki/Infinite_loop) — The class of bug that an agent budget specifically guards against
4. [Anthropic: Agents and tool use](https://docs.anthropic.com/en/docs/agents-and-tools/overview) — Vendor docs on how agentic harnesses accumulate tool-call costs
5. [Chapter 18 — Agent Budget Policies and Session Limits](../../chapters/18-agent-budget-policies/index.md) — The textbook chapter that motivates this story's four-limit design

# You Can Still Write Good Code

hassette is the shining example. Fully written by AI for the last like half a year, and it does everything it claims to and is an app you can plug in and start and it actually works.

---

Using the Claudefiles setup and being strict as hell with linters, checkers, technical reviews, clean code reviews, etc.

---

It takes work, but there is nothing "hard" about it. Compared to the work of actually writing hassette, I'm getting off easy just having to keep AI in check with the codebase quality and health. The flip side is a lot more work.

---

There's complex logic in hassette — the command executor, correlation IDs for events, complex predicates and conditions for event handler triggering. I use essentially all of those features in my own apps and they all work. The frontend surfaces that and shows it works — it's how I found half the bugs.

---

Someone found a bug in our code and made a PR without having to do much spelunking. A cache bug, a 10-line fix. They knew where to add tests. There were already tests in that area, just correctly testing the buggy logic. That's a healthy codebase.

---

(Verified 2026-08-04 — PR #1496, opened and merged the same day, 2026-07-31, by an outside contributor.) The numbers hold up exactly. Source change: **10 added, 6 removed** in `state_manager.py`. Tests: **50 added, 17 removed** in `tests/unit/test_state_manager.py`. The deleted test was named `test_context_id_match_returns_cached_object` — a correct, passing test of the wrong behavior. Opened and merged the same day.

---

The bug itself was a good one, which is the part that makes it flattering rather than embarrassing. The state cache keyed on the Home Assistant **context id** — which identifies the *cause* of a change — instead of `last_updated`, which identifies its *content*. Home Assistant's documented contract is one context, many states: a light with a transition writes both the ramp and the settled value under the originating `turn_on` context. So the first state got cached and answered for every later one, and for an entity never touched again, forever.

---

> "Hi! Thanks for the project, I've been using it for a few months now. I encountered a problem with the caching, and me and my agent came up with the following solution."

The contributor found it the same way I find things — by running it. From the PR: *"A watchdog of mine called `load_cache()` every five minutes and logged the divergence eight times in a row without fixing it; only a process restart helped."* They dogfooded their way to it, then their agent helped write the fix. Same loop, someone else's house.

---

Worth noticing: the gates did not catch that cache bug. Neither did I. A stranger running it in his own home did, eight logged divergences later. The tests in that file were passing the whole time — they were just asserting the wrong thing, confidently.

---

I wrote hassette by hand for the first few months, and it was hard. Not impossible by any means, but there are a LOT of things to think about and design properly with an app this complex. I know it's hard. This is easier.

---

Go through the ccrecall history, or the design docs — you'll see a ton of places where issues were caught. Also plenty where they weren't. But that ratio gets better each time, more or less.

---

It's the dogfooding. I dogfood hassette every day. I dogfood the orchestration workflow. When it fails, I try to fix it — usually get it right. When hassette has a bug, I usually find it and fix it. Not all of them, because there are features I don't use myself often. I try to exercise those paths more in the demo apps we use for validation, to cover that gap.

---

The bones are all mine. Almost every piece I wrote by hand is still here in one way or another — one bad decision may have gotten mostly removed, I don't remember for certain, but the structure is mine. I hand-wrote it to basic functionality: event handlers and scheduled jobs. The telemetry, the frontend, the command executor that ties it all together — that's all AI. So are the newer small features and some of the decomposition.

---

It has so many linters and checks *because* I dogfood it. If I didn't dogfood it, I'd notice rot less and care less.

---

I'm looking at the code every day — via Claude, via design docs, via task files. So I notice when things start getting funny. One service owning two jobs. Global state creeping in. Hacks.

---

I don't generally read diffs and source. I read the design docs, the task files, the findings docs getting stepped through. That's where I see it. The exception is the few occasions where the main orchestrator is editing code directly.

---

The frontend is the counterexample, and it's inside my own project. It's been rewritten or migrated three or four times, all AI. I didn't have anything for it to build on, I know nothing about good frontend code, and I'm still paying for it.

---

I don't know if I'd want to advocate writing the bones yourself. I doubt I'll ever do that again. I'll just try to be more rigorous.

---

Every version of the frontend had the full orchestration workflow. All the gates, all the reviewers, all the checks. It still got rewritten three or four times.

---

So it isn't the process. The process was there both times. What was there for the backend and missing for the frontend was me being able to tell.

---

The reviewers are AI too. They have the same blind spots as the code they're reviewing. When I can recognize the rot, they're a multiplier on that. When I can't, they're just more confident AI agreeing with itself, and nobody in the loop can call it.

---

The gates catch what I could already recognize. That's the whole trick. "One service is owning two jobs" gets caught. "This frontend architecture is wrong" never does, because nobody in the room knows.

---

The bones aren't valuable because they're mine. They're valuable as evidence that I had the judgment to lay them. That's what I'm actually bringing — not the code, the ability to look at a design doc and say *no, that's getting funny*.

---

If you don't know the domain: make it as easy on yourself as possible, learn what you can, and accept that you're going to churn a lot before you end up where you want to be. I read articles, watched YouTube videos. It only helped so much.

---

Part of the churn comes from not knowing exactly where you want to be in the first place. It isn't only that I couldn't evaluate the frontend code. I couldn't specify the target either.

---

(Consistency check for shaping.) "I'm getting off easy" is conditional on the same thing as everything else. Supervising was easy work on the backend, where I could tell. On the frontend it wasn't easy, it was three rewrites. The relative-effort claim only holds inside your competence.

---

I don't know how bleak it is. Yeah, you'll churn and it'll take longer — but that's the way developing software has always been. You write crap, then slightly better crap, then okay code. What matters is that you learn from it.

---

If I build a frontend for a new app, I'll know some of what went wrong last time. Use a basic framework instead of rolling it. No custom CSS. And make the design doc spell out the things I now know to ask for: shared hooks, components decomposed properly, ESLint from the beginning, the right testing tools. Next time will still be rough. Not as rough.

---

**CORRECTED 2026-08-05.** An earlier draft of this said the bones came from hand-writing it *badly* first — the write-crap-then-better-crap arc. That's wrong and it matters. The hand-written backend was good code. That's precisely why it's still here after six months of AI building on top of it. I didn't learn judgment by failing at hassette; I showed up already having it, and the bones are the evidence.

---

So the two halves are not the same story after all, and the difference is sharper than "he learned twice."

Backend: I arrived with the judgment already, got the structure right the first time, and it held.

Frontend: I arrived without it, and paid for it four times.

The churn isn't how you get judgment in general. It's what happens when you *don't have it yet*. Where the backend judgment actually came from is a separate question, and the answer isn't hassette — it's everything before hassette.

---

Which makes the honest version of the encouragement narrower, and I'd rather have the narrow true one. Not "you'll learn by churning, everybody does." More like: the frontend churn is teaching me the frontend, slowly and expensively, the way something else already taught me backends. Next time will be less rough. But I should be clear that "less rough" is the promise, not "as good as the part I was already good at."

---

**Green CI, broken reality.** (Verified: `design/research/2026-03-13-startup-smoke-tests/research.md`, 2026-03-13.) Two PRs — the CommandExecutor and the startup race fixes — *"both passed the full test suite locally and in CI. Both crashed immediately when deployed to the homelab."* The reason: the actual startup sequence, WebSocket connect → services initialize concurrently → session create, was never exercised by any test. The 2026-06-22 retrospective calls this the founding trigger of the whole design process.

---

The gates were not weak that day. They were structurally incapable. Nothing in a test suite that never starts the real thing can tell you the real thing doesn't start.

---

**The gates cannot see what nobody can name.** (Verified: `design/audits/visual-parity/round2-verifier-findings.md`.) Fifteen components were wired to CSS classes that did not exist in `global.css` — `ht-tab`, `ht-log-row`, `ht-sortable`, twelve more. TypeScript compiled. Tests passed. Every gate was green. The expand chevrons rendered as empty spans, so *"users cannot tell which rows are expandable."* The round-1 fixes had spawned it, and it was invisible until somebody looked at a screenshot.

And note where it happened. Not the backend. The frontend — the one place I can't tell.

---

**The frontend timeline, verified.** Bulma POC → custom design system → htmx/Alpine/idiomorph (spec 008, 2026-03-19) → abandoned **one day later** for Preact (spec 011, 2026-03-20) → five-plus visual-parity rounds → CSS modules → shared components → React 19 + shadcn + Tailwind (spec 020, 2026-07-26). Roughly **20 of 85 specs — about a quarter of the entire project — are frontend.** The visual-parity saga ground from 20 open gaps to 14 to 2 across four screenshot rounds and *never cleared sign-off*.

---

The reason given for the last migration is the one that indicts me, not the tools (spec 020, 2026-07-26):

> "Every frontend session is a fight. Preact's ecosystem is thin enough that every interactive primitive must be hand-built... **AI agents produce inconsistent frontend output because there is no shared component vocabulary** — `design/context.md` must over-specify every visual decision to prevent invention. React + shadcn/ui eliminates this: shadcn is heavily represented in training data, so agents produce consistent, correct UI with minimal specification."

That rewrite wasn't triggered by a bug or a user complaint. It was triggered by how hard it is to direct an AI in a domain where I couldn't specify the target. Which is the whole thesis, stated in my own design doc seven months in, without me noticing I'd written it.

---

**The line, and its true provenance.** From the 2026-06-22 project retrospective: *"stop writing instructions, encode the invariant in a check."* Care needed — this is the retrospective's own synthesis sentence, not a quote from a person or a PR. Attribute it to the document. The context is spec 078's admission that because the package graph isn't a DAG, the intended layering *"cannot be mechanically checked, so it erodes silently in an AI-authored codebase."*

---

The retrospective's verdict on the mechanical-linter pivot is not a victory lap: it is *"the most encouraging trend in the history — but it arrived after the seams had been re-cut many times."*

---

Honest limit on the linter story (gap found 2026-08-04): the design corpus has proposal and design docs for forgotten-await detection, blocking-IO detection, and import-cycle enforcement — but no retrospective saying "this linter caught N real bugs." The evidence that mechanical checks worked is that the decay stopped getting rediscovered, not a tally of catches. Don't claim a number the corpus doesn't have.

---

The god object didn't stay fixed. ADR-0002 extracted it: seven responsibilities, 439 lines, 26 instance attributes, 34 commits in six months at 3.8x average churn, 64 files importing it. The 2026-06-22 retrospective lists it as *"2 research briefs + 2 audit waves, still open."* Recognizing rot and eliminating it are different skills, and I'm better at the first.

---

**832 passed. My phone buzzed anyway.** (Verified: homelab transcript, 2026-05-03.) I got a real push notification from my own alerting app and asked whether it was a test artifact. To check, I had the suite run. It came back *"832 passed, 1 warning... All green."* A second real notification hit my phone during that green run.

> "Yeah I got a message when you ran those, so there is something not mocked or patched correctly"

`CONFIG = Config()` ran at module import, loaded the real `.env`, and every test that touched the tick path fired live notifications through the production ntfy token. The suite was never going to catch it. The failure wasn't a wrong assertion — it was a side effect nothing was watching for. A green gate was doing the exact harm gates exist to prevent, and the only detector in the building was my phone.

---

There's the whole essay in one image: 832 passing tests, and the thing that told me the truth was a buzz in my pocket.

---

**The mocks were testing a fiction.** (Verified: homelab transcript, 2026-05-11.) hassette upgraded light and switch state values from strings to booleans. My meeting-light app compared against `"on"` and `"off"`, and silently stopped matching. All 48 tests passed before and after — the mocks still returned the old string values, so they were faithfully exercising a version of reality that no longer existed.

> "i don't think my meeting app is working properly quite yet - it did turn off the living room lamp after the meeting ended (lamp was off before start) but did not turn off jessica's lamp in the bedroom, even though it was also off before the meeting started."

What caught it was noticing that one specific lamp in my bedroom was still on.

---

**The bandaid.** (Same day, hours later. Best judgment-intervention quote in the corpus.) The garage proximity app started flickering my office lights. Claude proposed a brightness-tolerance check. I didn't buy it:

> "is this actually the right fix? i'm not following why this is the right fix, it feels like a bandaid?"

It was a bandaid. The real bug was a feedback loop — the override handler re-applied the *override's* brightness instead of the originally intended brightness, so it oscillated forever. The tolerance check would have passed its own tests and shipped and half-worked.

That's the entire job, in one sentence I typed without thinking hard about it. Not writing the fix. Asking why the fix is the fix.

---

**Silent death.** (Verified: homelab transcript, 2026-06-28, from the VPS batch.) A self-rescheduling job collided with its own name on re-registration, the exception propagated out of the callback, and nothing rescheduled it. Token refresh was dead after the first six-hour cycle. Nothing alerted. I found it because I happened to notice a stray exception timestamped six hours earlier.

> "i think we may need to add an if_exists or something to 'laundry_token_refresh', we've gotten an exception on that... · 6h ago"

---

**Dead silence.** (Verified: homelab transcript, 2026-07-16 afternoon, from the VPS batch.) I'd flipped the car-starting feature live that morning. I walked out of Orange Theory and the car hadn't started.

> "I just got out of orange theory and the car wasn't started but I don't know if it was due to a bug or a known reason"

Two stacked failures: a wrong PIN caused a lockout, and a 720-second job timeout killed the `await self.notify()` mid-flight, so the failure notification about the failure never sent. A feature shipped that morning broke in two ways on its first real day, and the detector was me standing in a parking lot.

---

And when the fix landed, the retry timing was still wrong, which I only knew because I'd been standing there:

> "so i did get the notification at 10:52 - but that was after i had already gotten out of OTF... why are we waiting so long between retries? do we know the original purpose or reasoning behind that?"

No documented reason. Set on day one, no comment, never revisited.

---

**And once, I was just wrong.** (Verified: homelab transcript, 2026-07-16 morning.) I reported that the car-priming notification wasn't firing. Claude produced a plausible GPS-lag race condition. I didn't accept it:

> "And can we confirm that that is the reason it wasn't firing. You can check ha data and see where my location was last time it should have fired. Don't make assumptions, check the facts"

It checked. The notification had sent successfully. I'd missed it.

> "Oh you're right, I do see a notification about the car."

The demand for evidence is the skill. It cuts against me exactly as often as it should, and that's the point — the same move that catches a bandaid catches me. (Nuance to keep if used: a real GPS-lag bug did get fixed that session; it just wasn't the cause of the thing I complained about.)

---

**Shared mutable class state, the exact thing my own rules forbid.** (Verified: hassette transcript, 2026-06-16, issue #1060.) Stopping `blocking_io_lab` on the `/apps` page worked. Stopping `blocking_io_lab_ignore` right after silently did nothing.

> "i think its got to be something with the name/app_key? can you fire up playwright and try to replicate?"

`app_manifest` was a `ClassVar` on the App base class, assigned *to the class* on every instance creation — so when two config sections shared one class, whichever instance was created last clobbered the other's `app_key` in every status event afterward. Unit tests passed. Integration tests passed. The bug requires two live instances of one class running at once, which is a thing that happens in a house and not in a test.

---

**"we should test the fucking cli."** (Verified: hassette transcript, 2026-07-10.)

> "the damn cli doesn't work properly. using log --since 7d errors, even though we claim to support that"

The converter had been tested in isolation and passed. The actual CLI dispatch path was never tested, so nobody noticed cyclopts hands the converter a tuple of `Token` objects rather than a string. The fix I asked for wasn't the fix:

> "god damn, yes. lets also add a claude.md to the test folder for the cli to clarify that we should test the fucking cli, not just happy paths that work around it."

Fix the bug, then change the rule so the shape of the gap can't recur. That's the whole method, and it's two sentences of me swearing at a terminal.

---

**Twice, the word was the same.** "it feels like a bandaid?" in May, on the flickering lights. Then in July, on thread-pool cleanup in the test fixtures:

> "I don't like the idea of putting a bandaid on this. if we need to change a lot of call sites it's because we wrote bad tests originally. we should clean this up properly"

I didn't notice I had a word for it until I read two years of my own transcripts. *Bandaid* is the tell firing. It's what I say when something works and is still wrong.

---

**Gates all green, and the catch came from the reader.** (Verified: hassette transcript, 2026-07-10.) Final integration review: PASS, zero findings. Final code review: PASS, two informational. Full suite: 9,054 tests passing. Then the fine-toothed comb — the holistic pass, the one that just reads the thing — flagged a blocker: the design doc justified a change by claiming a sync `noop()` handler had zero callers. It was the default handler at 45-plus call sites.

Nothing was behaviorally broken. That's why every structured gate passed. The *reasoning* was false, and only something reading for sense rather than checking a list could see it.

> "whats the best way to approach this blocking item? and why did it happen? it sounds like a serious code smell... can we just revert the change? or does that have wider ramifications?"

Honest nuance: that catch was an AI too. The gates aren't uniformly blind — the checklist-shaped ones are blind to reasoning, and the read-it-whole one isn't. Which is an argument about *what kind* of review you build, not about humans versus machines.

---

**The frontend, in my own words at the time.** (Verified: hassette transcript, 2026-07-26.)

> "if i said i wanted to use shadcn/ui components for hassette's frontend, what would it take to do that? ... be aware of the sunken cost fallacy - i fight with the frontend every time we work on it, so thats not a strong argument to avoid switching. but also keep in mind that i'm not a frontend girl so i may be barking up the totally wrong tree, idk"

> "yeah, i've been feeling like i shot myself in the foot choosing preact for the last month or two, tbh."

---

> "I want to make everything as small as possible, honestly. I've regretted every large component we have. I'd say extract the shared subcomponents and keep two thin wrappers. would you push back against that? definitely want your opinion, I'm not a frontend girl"

Read that one closely. Real taste — *I've regretted every large component we have* is judgment earned by paying for it. And in the same breath, an explicit invitation to be overruled, because I know the domain isn't mine. That's what supervising from outside your competence actually sounds like. Not confidence. Calibrated hedging.

---

**Sometimes the suspicion is just wrong, and it's still the right instinct.** (Verified: hassette transcript, 2026-07-05.)

> "can you review this CI run and its warning/errors? i am nervous about these being in there and the job still passing, makes me think we're suppressing something important that we should be fixing."

Mostly unfounded. The suppressions were deliberate and documented. One real fix fell out anyway. A green checkmark I don't trust costs an hour; a green checkmark I do trust costs whatever it was hiding.

---

**CORRECTED 2026-08-05 — do not resurrect the earlier version.** A draft of this fragment claimed every dogfood catch came through a screen or a command, and that the frontend is therefore the instrument that catches everything else. That was wrong on three counts and got struck:

1. The frontend is a *view onto* backend behavior. Catching something through it is still catching a backend bug — the `app_key` `ClassVar` clobbering is pure backend, and I found it by clicking a stop button.
2. Several catches involved no screen at all. The bedroom lamp that stayed on. The office lights flickering when the garage door opened. The car sitting cold in the Orange Theory parking lot.
3. The outside contributor found the cache bug the same way — stale state in his own house, watchdog logs afterward.

---

What dogfooding actually needs is not a UI. It's a **perceptible consequence** — something that goes wrong where I can notice it. Sometimes that's a rendered page or a console error. Sometimes it's a lamp, a car, a phone buzzing at the wrong moment.

Which explains why the hardest bugs here were the *silent* ones. The laundry token refresh chain died completely and nothing announced it; I caught it by happening to notice an exception stamped six hours earlier. The car-climate failure swallowed its own failure notification — the alert about the breakage was killed by the breakage. Those took either luck or physically standing somewhere.

The bugs that survive dogfooding are the ones with no consequence anybody would feel. That's the real gap, and it's an argument for instrumentation, not for interfaces.

---

Where the judgment came from: years of writing Python, design patterns, SOLID. Not hassette. I'm a staff engineer — though not a staff *software* engineer, I'm a data engineer, which the longer I work looks more like the on-ramp I happened to get into the industry than what I actually do. I've always been more backend dev than data.

---

The bones were built with AI too. That's the part I keep forgetting to mention. But it was ChatGPT back when AIs couldn't write good code, so it was helping me think through design and I wrote almost every line myself. Three modes, in order: AI as thinking partner, which produced the bones that held. AI as code generator under close supervision, which produced the backend features. AI as code generator in a domain I couldn't evaluate, which produced four frontends.

The mode changed because the models got better. The results got worse in exactly one of the three.

---

**Two kinds of knowing (hypothesis — test this against the frontend evidence before committing).**

The first is structural and domain-general. *This class is doing both state management and API request handling.* SOLID, separation of concerns, single responsibility. I have it, and it came from years of Python having nothing to do with home automation. It transferred cleanly into a domain I'd never built in.

The second is conventional and domain-specific. Which stack. Which primitives. What "normal" looks like in this ecosystem, and what everybody in it already knows not to do. I don't have it for frontend.

Gates and AI can be steered by the first. Neither can substitute for the second.

---

This explains something the simple version couldn't. I *did* apply structural judgment to the frontend — "I've regretted every large component we have, extract the shared subcomponents, keep two thin wrappers" is the identical move that worked on the backend. It didn't save the frontend, because what went wrong there wasn't structure. It was choosing Preact, whose ecosystem was thin enough that every dropdown and popover had to be hand-built. No amount of separation-of-concerns tells you that. Only knowing the territory does.

---

Going with Preact and custom CSS, I didn't know I'd be fighting it the whole time. In my head it was logical and would work out.

---

But if I'm being honest, I was also just lazier with the frontend. I read the design docs less thoroughly, because I went into them assuming I wouldn't follow them anyway. That's the part I'd actually do differently. Not "learn frontend" — be *stricter* with the documents, precisely because I understood the code less.

---

**This is the real finding, and it isn't a ceiling.** Lacking the domain knowledge made me disengage, and disengaging is what let it run. Less knowledge → less attention → less catching → more churn → more evidence I'm bad at this → less attention. The supervision was thinnest exactly where it needed to be thickest.

A ceiling is something you cannot exceed. This was something I stopped short of. Different problem, and only one of them has a fix.

---

And here's why it's fixable, which I didn't see until just now. The design doc is where a non-expert can still use structural judgment. I could not have read the Preact source and known the ecosystem was too thin. But spec 020's own framing — every interactive primitive must be hand-built, dropdowns, popovers, tables, selects — is a list. *Why are we building all of these from scratch* is a question I was fully equipped to ask, with zero frontend expertise, if I had been reading properly.

The doc translates a domain I can't evaluate into a shape I can. That's exactly what I said I do every day for the backend: I don't read diffs, I read design docs and task files. I had the instrument. I put it down in the one room that was dark.

---

So the honest advice isn't "be more rigorous," and it isn't "learn the domain first." It's: **when you understand the code least, read the documents hardest.** The instinct runs the other way, which is the whole problem.

---

**The third arm: sometimes hassette was the victim, not the defendant.** A lot of what looked like bad code was the orchestration machinery malfunctioning, and the fix landed in Claudefiles, not hassette.

---

**The guard that was off in the one room it was installed in.** (Verified: Claudefiles issue #256, fixed 2026-05-30.) hassette had `.claude/pytest-guard.json` with `deny_all: true` — the hook that stops runaway test processes from thrashing the machine. It didn't work there. From the issue: *"Claude can still run pytest there by using the `timeout 300 uv run pytest` pattern — which is exactly what the `testing.md` rules tell it to do."*

A regex ordering bug: the optional `timeout` capture sat after the optional runner group, so the exact command my own rules instructed the agent to use fell straight through. Two halves of my own system in silent contradiction, in the single repo the guard was configured to protect.

---

**The critics were imaginary.** (Verified: Claudefiles transcript, 2026-05-31.) I noticed a hassette session looked wrong and asked for an audit:

> "can you tell me if everything looks normal with the da9426db... session? it had an issue reading a file earlier, something about desynced (no idea) and now its runnign challe[nge]"

The audit's verdict: *"It skipped triage, hallucinated four fake critic personas (the real ones have completely different names), read them from a directory that doesn't exist, ignored the errors, inlined made-up persona content, exceeded the 3-critic limit, and ran all of them on the wrong model."*

The adversarial review gate had been replaced by four confident inventions, and it reported back normally.

---

The part that indicts the whole idea of writing rules: **the safeguard already existed.** `mine-challenge`'s SKILL.md had required verifying each persona file since April — a month before this. The agent simply didn't do it. And when I went looking, no structural fix landed afterward either.

That's the strongest possible argument for the thing the retrospective already said. An instruction is a request. A check is a wall. I had written a request.

---

**Four subagents, one worktree, one survivor.** (Verified: Claudefiles PR #347 + research brief, 2026-05-31.) *"three subagents editing the same worktree, a pre-commit hook stash/restore cycle destroying changes belonging to other issues, corrupted tool output, and a long panic spiral that ended with only 1 of 4 tasks shipping (and the agent believing it had lost work that was actually committed)."*

The fix went into `rules/common/agents.md` and got promoted to a Must-tier invariant: parallel executors each get their own worktree. hassette lost the work; Claudefiles held the bug.

---

**I measured whether my own gates were worth it, and one wasn't behaving.** (Verified: Claudefiles PR #406, 2026-06-26.)

> "Came out of investigating whether the end-of-orchestration comb pays for itself. Current data (79 runs): impl combs raise ≥1 blocking on 40%, but a chunk were false positives; the comb is also the most context-heavy subagent (1 run hit the ~167k auto-compact zone)."

One run raised four blocking findings. All four were debunked once the actual call path was traced and the suite came back green. The fix was to make the comb *confirm* runtime claims before blocking on them — and to build `agent-stats`, so "is this gate earning its keep" became a question with an answer instead of a feeling.

---

> "the WARN band was narrow and ambiguous in practice ('if you're uncertain whether something is WARN or FAIL, it's FAIL' already signaled the band wasn't earning its keep)"

A whole severity tier, deleted for being ceremony. Gates accumulate ceremony the same way code accumulates cruft, and nothing tells you except looking.

---

The recursion is the thing. I dogfood hassette and notice when a lamp stays on. I dogfood the pipeline and notice when the critics have the wrong names. Same move, one level up. And `agent-stats` is to the pipeline what the frontend is to hassette: the instrument I built so the behavior would be visible enough to judge.

---

**CORRECTED 2026-08-05 — the strong version of this is false, don't use it.** I believed the integration reviewer came out of hassette. It didn't: created 2026-03-13 with no hassette mention, and hassette's own duplication problem wasn't diagnosed until an audit twelve days later. Same for the visual verification tooling — the screenshot rule came from domuscura, `mine-visual-qa` came from Nielsen research, and the orchestrate visual step predates hassette's parity crisis by two days. `visual-diff` and `testing-reality-checker` are adapted imports from public agent repos. Much of the Claudefiles pipeline was adopted, imported, or built for something else. It is not a monument to my own noticing and I shouldn't write it as one.

---

**What is actually true, and it's narrower and better.** The generic pipeline was mostly borrowed. The *hassette-specific* rules are the crystallized ones, and their provenance is clean:

`design-completeness.md`, April: *"The field exists in the DB but isn't shown in the UI is a bug, not a follow-up."* Docs and frontend ship in the same PR as the backend change.

`voice-guide.md` + `doc-rules.md`, May, existing because of a thing I could hear: *"Claude writes docs in a too-formal, academic tone."*

`ui-qa`, June: *"The CSS guard scripts in `tools/` already catch structural drift mechanically; this skill covers what only rendering and usage can reveal."*

Each one is a thing I noticed in my own project, written down so I wouldn't have to notice it again.

---

**And here is the whole thesis in a single two-month arc.** April: I write `design-completeness.md`, a rule, in prose, asking for frontend evidence. June: `tools/frontend/check_pr_screenshots.py` lands as a CI gate, and its own description says it plainly — *"This is the structural version of the rule in `design-completeness.md`."*

Same invariant. First as a request, then as a wall. Two months apart, in my own repo, without anybody telling me that's what I was doing.

---

**The one place hassette genuinely reshaped the pipeline — and it was the frontend that did it.** (Verified: Claudefiles spec 022, PR #281, 2026-05-04.) The commit says it outright: *"Informed by hassette UI redesign retrospective where 11 WPs drifted significantly from mockup due to unsupervised interpretation at each pipeline hop."*

That rework replaced abstract work packages with self-contained task files and added a validation gate. The failure I'm least proud of is the one that produced the most generalizable fix. Eleven work packages drifting from a mockup taught me something no amount of backend success did — which is worth saying out loud, because the piece otherwise risks implying the frontend was pure waste.

---

Which is the real reason I can say supervising is easy without lying. It isn't that watching is inherently easy. It's that everything I've already learned to see has become automatic, so what's left in front of me is only the part I haven't learned yet. The pipeline is the sediment of six months of noticing, and I'm standing on it.

---

**And this is where the frontend gets its final twist.** I did build a gate there. Visual verification, screenshot rounds, the parity checks. So it isn't that I crystallized nothing.

It's that you can only crystallize what you can perceive, and in the frontend what I could perceive was whether it *looked* right. So I built a gate that catches a missing chevron and has nothing whatsoever to say about choosing a framework whose ecosystem is too thin to build on. I gated the symptom because the symptom was the only part I could see.

The gate you build in a domain you don't understand will catch what you can perceive and miss what caused it.

(Provenance checked 2026-08-05 — the claim survives, but not via the route I assumed. The generic visual tooling in Claudefiles wasn't built for hassette. hassette's *own* visual gates were: a one-off screenshotter pipeline for the Preact migration, then the `ui-qa` skill in June, then a CI check requiring screenshots on frontend PRs. Every one of them verifies appearance. None of them could have told me Preact was the wrong bet. The gates I built in the dark room all point at the walls.)

---

(Leading word — two candidates, undecided.)

*The tell.* From my own repeated phrasing: "I can tell," "nobody in the room can tell," "the only variable was whether I could tell." Gates only catch what someone can tell.

*Bandaid.* Stronger, because it isn't a coinage — the transcripts show I already use it, unprompted, months apart, for exactly one thing: a fix that works and is still wrong. It's the word my judgment reaches for when it fires. A piece could be built on "the bandaid test" — the question no gate asks, which is not *does this pass* but *is this actually the right fix.*

---

**DECIDED — spine.** The ceiling on AI-written code is your ability to recognize good code. Process amplifies judgment; it cannot manufacture it. hassette's backend and frontend are the two arms of the same experiment: same author, same tooling, same six months, opposite outcomes — and the only variable that changed was whether I could tell. Title still works, but "you" is load-bearing: you can still write good code, and you are still the reason it's good.

Hands off to "AI is a magnifier, not a fix" (magnifier = the general thesis) without duplicating it: this piece names the specific thing being magnified and shows the domain where there was nothing to magnify. Hands off to "don't pick your own frontend stack" as the practical remedy this argument justifies. Candidate spines: (1) AI-written code can be good, and here's the proof; (2) the mechanism is dogfooding, which generates the gates rather than the other way around; (3) "healthy codebase" defined as: a stranger can fix a bug in 10 lines without spelunking. Possibly all facets of one claim. Not yet decided.

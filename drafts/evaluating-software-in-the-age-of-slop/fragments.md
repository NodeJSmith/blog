# Evaluating Software in the Age of Slop

It happened with cass first. Great feature list. Looked good. `/mine-eval-repo` may have even said it was fine — I never actually checked. I just believed the surface. (Context: the comparison baseline was my own nodejsmith/claude-code-recall tool — cass read as "my tool taken seriously," which is what made the pitch land so hard.)

---

Then it happened again with claude-code-telegram. This wasn't a holy-grail rush — I already had my own scrappy Telegram-bridge tool, and claude-code-telegram sounded like my tool with the issues already worked out. It technically ran — but the first thing Claude tried to do was call AskUserQuestion, and the wiring for that tool had never actually been built (unclear whether the README ever claimed it was — don't assert that). I asked Claude to scope how much work it'd take to get the tool into real shape. Turned out to be a lot. I gave up before I even found out what else was broken. Less "complete failure," more "sounded like the finished version of my tool, was actually a pile of tech debt with a good README."

---

The second time stings more than the first, because the second time I had a tool for exactly this. (Corrected timeline: `/mine-eval-repo` ran AFTER the five-minute hands-on check hit friction, not before.) Its verdict was basically "don't use this" — correct, via proxies. But it couldn't say the one sentence that actually described the situation: "this doesn't work as written." It could tell me about test coverage, maintenance health, bus factor, maturity signals — every proxy for trustworthiness except the thing I actually needed to know. (Note: bus factor is a different category from the quality trappings — it's a continuity-risk measure and still an honest signal; don't lump it into the "broken signals" claim.)

---

Stars, feature lists, test coverage, commit cadence, contributor count — these are all reputation proxies. They correlate with quality, sometimes. None of them are quality. In the age of AI-generated code, the correlation is getting worse, not better: a repo can have a gorgeous README, a long feature list, and a passing CI badge, and still not run.

---

The question I actually need answered isn't "is this repo well-maintained" or "do the maintainers seem competent." It's much dumber and much harder: does the happy path work if I run it right now. Nothing in the standard evaluation toolkit answers that question directly — it all answers it by inference.

---

cass broke in four different places. It was a fucking disaster. (Correction: this is NOT well documented elsewhere — the earlier post mentions cass only briefly. The article's retelling has to be self-contained.)

---

"Holy shit, holy grail, let's use it." That was the actual reaction to cass's feature list. Not measured interest — a rush. The better the pitch, the less I checked. That's backwards, and it's exactly what a good pitch is supposed to do to you.

---

Pre-AI, going with your gut on a well-fleshed-out repo was a reasonable bet — not because gut instinct is good methodology, but because nobody would sink the effort into building out that much surface area (docs, feature lists, polish) without also having a working product underneath. The polish was expensive to fake, so it was a real signal. AI didn't make repos better. It made the polish free, and left the correlation between "looks done" and "is done" broken on the floor.

---

`/mine-eval-repo` checks code coverage, bus factor, velocity, contributor count. cass could pass every one of those heuristics and still be a piece of shit tool. The heuristics measure whether a project has the trappings of a healthy project. None of them measure whether the thing does what it says it does.

---

Open question, maybe the actual ending of the piece: does anyone have a real answer for this, or is the honest current answer "don't trust any project started after AI coding went mainstream, full stop"?

---

With claude-code-telegram I actually did the cheap check — pointed it at one of my own bots, tried running it for real. Took a few minutes. Hit friction almost immediately, dug in, gave up. The check worked. It was cheap. It caught the problem before I'd sunk real time in.

---

But the moment I hit friction, my first thought wasn't "let me debug this," it was "oh man, is this another garbage tool?" That reflex didn't exist before cass. One bad enough experience and the prior flips — from default-trust to default-suspicion. The tool didn't change between the two evaluations. I did.

---

Concrete, unglamorous answer that might be the actual actionable takeaway: spend five minutes actually running the thing against something real before you let yourself get excited about it. Not a framework, not a checklist — just don't skip the step of touching it with your own hands.

---

Costly signaling, spelled out plainly: a signal is only trustworthy if faking it costs roughly what the real thing costs — a peacock's tail works because only a healthy bird can grow one. A polished README and long feature list used to be a costly signal — took real build time, so it correlated with substance. AI made the signal cheap without making the underlying product cheap to build well. The correlation didn't erode, it broke.

---

cass actually broke in the first five minutes too. The five-minute check didn't fail — my reading of it did. First bug hit, I thought "small bug, okay" and went to fix it. Fixing it linked directly into more broken code. And that into more. Four places, eventually. The detection was fast. The misdiagnosis was mine: I treated the first crack as an isolated defect instead of as a sample of what the rest of the codebase probably looked like.

---

(Undecided — keep in for now) There might be a psychological-impact angle: what one bad burn does to your priors, going from default-trust to default-suspicion overnight. Not sure yet if it's the spine of the piece or just color. Leaving it in until shaping forces the call.

---

**SPINE (decided):** The cost break is the cause; everything else in this file is one of its symptoms. Not advice ("try the tool," "weight evidence better") — advice is where the "duh, dumbass" reaction lives. This is a diagnosis of a changed world: polish used to correlate with substance because faking it cost as much as being real. AI made the signal free without making the product free. The correlation didn't erode — it broke, roughly overnight. An experienced dev can't "duh" that, because their gut is one of the casualties: their instincts were trained on the old prices.

---

The cass misread, re-explained under the cost spine (this replaces the "misweighting" framing): I read the first bug as isolated instead of as a sample — but *why*? Because in the old world, that was the correct read. A repo with that much built-out surface that hits a bug probably has *a* bug; the polish proved investment, so "isolated defect" was the sensible prior. I applied a prior that was right for twenty years and had silently expired. Not "you weighted badly" — "everyone's priors are calibrated on a market that no longer exists, and here's what that looks like from the inside." Same rescue applies to the holy-grail rush: pre-AI, getting excited about a great pitch was rational, not naive.

---

The tooling failure, re-explained under the cost spine: `/mine-eval-repo` checking stars, bus factor, coverage, commit cadence isn't a bad tool — it's a signal reader, and every signal it reads just had its cost collapse. The heuristics measure whether a project has the trappings of health because the trappings used to be expensive. The whole standard evaluation toolkit is an appraiser using price sheets from before the crash.

---

The landing (how "just try it" stops being duh): hands-on running isn't a diligence tip — it's the one signal AI hasn't cheapened. Everything else about a repo can be faked for free; the thing actually working on *your* real problem, right now, cannot. The piece doesn't end on "remember to test things." It ends on: the only costly signal left is contact with reality — which is why it's now load-bearing in a way it never had to be.

---

(DEAD — factually wrong, do not resurrect) The outvoted-risk thread claimed the AI pros/cons list wrote down the disqualifying risk (one working embedding model, not three) before committing and it got outvoted. Correction from Jessica: the embedding-model issue was far down the list of problems and didn't matter in the grand scheme — it only came up hours in, while debugging cargo test crashing WSL. What survives and is used in the article: the review's verdict "better by a wide margin" (actual quote, fine to quote) was produced by inspection only — never running the tool — so the verdict fed on the same now-free surface the piece is about.

---

The prior-flip fragment (default-trust → default-suspicion after one burn) is now settled as color, not spine: it's what an individual repricing their priors feels like.

---

(Craft notes for shaping) Two cautions. "AI made polish cheap" is not a virgin take — slop discourse gestures at it constantly. What's *ours* is the specificity: two named tools, the tooling angle, the expired-prior mechanism. The piece survives on those, not on the peacock. And use signaling theory lightly — the line about "nobody would sink the effort into that much surface without a working product underneath" already carries the concept without naming it; that's probably the better register than citing Zahavi.

---

(Graveyard, for the record) Framings auditioned and rejected as spines: "static claims vs. dynamic proof" (collapses to duh-level "just try it") and "checking isn't the missing step, weighting what checking turns up is" (true, but it's a symptom — the misweighting happens *because* the prior expired). Both survive as beats under the cost spine.

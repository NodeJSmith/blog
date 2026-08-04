# Evaluating Software in the Age of Slop

Somewhere in the last couple of years, without anyone announcing it, the most useful heuristic in open source quietly died: the assumption that a project that looks finished probably is.

Stars, a polished README, a long feature list, a green CI badge. None of these were ever proof. But they used to be evidence, because faking them cost nearly as much as being real. Nobody wrote docs for twenty features that didn't exist. AI made the polish free without making the product free. The correlation between "looks done" and "is done" didn't erode. It broke.

I know because I paid for the lesson once, then watched it change my behavior the next time around.

The first time was a tool called cass, which indexes every AI coding session on your machine: Claude Code, Codex, Cursor, twenty-odd others. All of them go into one searchable database. Sub-60ms search. Optional semantic search, running locally. A slick three-pane TUI. Cross-machine indexing over SSH. A thousand stars. I had already built my own little tool for exactly this, searching my past Claude Code sessions, so I knew the problem was real. Cass read like my tool taken seriously: same idea, executed by someone who'd gone ten times further. My reaction was "holy shit, holy grail, let's use it." Which, to be fair to myself, is exactly what a good pitch is supposed to do to you. The better the pitch, the less I checked.

It broke in the first five minutes. The part worth studying is that I kept going. I looked at the first bug and thought "small bug, okay" and started fixing it. The fix led straight into more broken code. That code into more. It ended up broken in four different places, and I was several hours deep before I admitted what I was holding. I hadn't found a bug. I'd taken a core sample.

The next time was claude-code-telegram, a bridge that lets you drive Claude Code from your phone through Telegram. Here too I had my own scrappy version already running, and claude-code-telegram sounded like my tool with the issues already worked out. Not a holy grail this time, just the sensible-sounding upgrade: same idea, more features, a stronger starting point.

I cloned the repo intending to adopt it as my own: not exactly a fork, but a version shaped around my needs and maintained by me. Forks feel less important when changing software is cheap. I wasn't looking to preserve its lineage so much as start from better material.

It started, connected, and mostly did what it claimed. Then the seams started showing. Its HTTP client logged the Telegram bot token in an ordinary request URL. The documented log-level setting did nothing. Setting the environment to production silently turned telemetry back on, overriding the explicit setting that disabled it. None of these alone made the project a failure. Together, they made adoption feel less like configuring a finished tool and more like beginning another repair job.

Before cass, I would have kept opening the code and fixing each thing as I found it. This time I stopped and asked what the friction was sampling. Only then did I run my automated due-diligence pass. It found reasons that would have turned me off in any era. The project had gone months without a commit. Its codebase was more than ten times the size of mine, with less than a third as much test code relative to its size. It also had 114 broad exception handlers and unfinished security persistence sitting behind TODOs.

The evaluator worked. The problem was that I had already cloned the repo and begun adopting it before I thought to ask. The finished-looking surface hadn't fooled the evaluator; it had convinced me I didn't need one. Some parts of the project were genuinely solid, and I didn't look long enough to pronounce the whole thing bad. I saw enough to know that adopting it meant inheriting a much larger maintenance problem than the one I already had.

I didn't keep digging long enough to find out how deep the problems went. That was the point. I saw the familiar pattern appearing, saw another weekend disappearing into someone else's unfinished software, and reverted. Cass was the burn. Claude-code-telegram was proof that I'd learned from it: I started down the same road, recognized it sooner, and turned around. Both had appealed to me with the same pitch: *your tool, but grown up.* And in both cases, every signal I could read without running the thing said "real project."

Reading those signals used to work because of what they cost, not because gut instinct is good methodology. Nobody built a feature matrix, a slick TUI, and a wall of examples without a working product underneath. The surface *was* most of the work. A finished-looking repo meant someone had spent months in there. Trusting it wasn't necessarily skipping diligence; it was a rational bet on the economics of effort.

AI didn't break your gut. It broke the economics your gut was trained on. The surface is now free: a gorgeous README, a long feature list, a green badge, all generated in an afternoon. A product that actually works is still expensive. The signal didn't just get noisier. The relationship it signaled stopped existing.

The obvious moral, which half of you is already yelling at me, is: *you have to actually try the tool, dumbass.* Fair. I did try both. Cass broke within five minutes; claude-code-telegram started accumulating friction just as quickly. The five-minute test produced evidence both times. Detection was never the problem.

The problem was what I did with the detection. When cass hit its first bug, I thought "small bug, okay." In the world my instincts were trained in, that was the correct read. A project with that much built-out surface had months of work in it, so a bug was probably an isolated defect in something fundamentally sound. That's what a crack in an expensive surface used to mean. But cass's surface wasn't expensive. Its first crack was a fair sample of everything I hadn't looked at yet.

Trying it produces evidence. You still have to price that evidence, and every instinct you have for doing so was calibrated in a market that no longer exists.

Even the diligence I did do fed on the surface. Before committing to cass, I asked an AI for an honest review of it against my own tool. The verdict came back: "better by a wide margin." And it wasn't lying. Everything it could see supported that. Everything it could see was the part that's now free to fake.

The automated checks weren't obsolete. If anything, they mattered more now. But they had changed roles. A polished surface once gave me a reasonable prior that the machinery underneath had received similar care; diligence confirmed or challenged that impression. Now the surface told me almost nothing. The checklist was no longer a confirmation step. It was the first real evidence I had.

To be fair to the old signals, and to explain why my evaluator still got claude-code-telegram roughly right, they still work in one direction. A repo with no tests, no docs, and a dead commit log is still exactly what it looks like. The absence of polish still damns. Its presence stopped meaning anything. The old signals can still say "don't." They can no longer say "yes," and "yes" is the answer you actually need when you're about to sink a week into someone's tool.

So what positive evidence is actually left? The thing working, on your problem, on your machine, right now. Working software on your real use case is the one thing nobody can fake, because it *is* the product rather than a signal of it. The five-minute check matters because it's the last test whose result can't be typeset.

And even it comes with no guarantee. I got lucky with cass. The cracks showed in the first five minutes. If the broken parts had been two layers deeper, I'd have adopted it, built on top of it, and found out weeks in, with my own work stacked on the rubble. A clean first five minutes only tells you that you haven't hit bottom yet.

The real change is the default. With claude-code-telegram, the moment I hit friction, my first thought wasn't "let me debug this." It was "oh no, is this another one?" That reflex didn't exist before cass, and I've stopped thinking of it as damage. The software changed between the two evaluations, but more importantly, I did. That flip, from default-trust to default-suspicion, is the correct calibration for the new prices. Default-trust was rational when polish was expensive. A repo is now a claim, not a product, until it has run on your problem, in your hands. Even then, it's on probation.

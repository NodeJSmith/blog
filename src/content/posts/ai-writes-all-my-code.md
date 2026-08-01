---
pubDatetime: 2026-07-31T12:00:00Z
title: AI Writes All My Code. The Decisions Stay Mine.
description: AI writes almost all of my code now. What stays mine is which problem to solve, whether the approach is right, and whether to ship.
featured: true
draft: false
tags:
  - ai
  - engineering
---

Over the last year I've automated nearly every part of how I build software. AI writes the research briefs, design specs, task lists, code, tests, and most of the reviews. I still decide which problem is worth solving, whether an architecture makes sense, and whether a proposed fix reaches the cause or merely patches a symptom.

AI can investigate those questions. It can't decide what the answers should optimize for. I have yet to find a way to take myself out of that loop, and I've come to believe it's the loop that matters.

Watch an AI codebase over months instead of days and "good" and "crap" take on specific shapes. Some codebases accumulate. Features and fixes pile up faster than anyone asks whether they belong or fix the real problem. Others converge. Every flaw gets traced to its cause, fixed there, and pinned down so it can't return. The AI can be the same in both cases. The difference is whether a human keeps making the calls.

## The decisions I keep

My workflow routes three questions through me, over and over: Is this the right problem? Is this the right approach? Should this ship?

AI handles almost everything around those questions. It investigates the problem, writes a design spec, challenges the approach, implements it, and runs the review and test loops. Afterward, it records what shipped so I can trace the outcome back to the original decision.

The process isn't valuable because AI follows it perfectly. It's valuable because it makes me answer those three questions at specific points instead of letting the work roll forward on momentum.

The clearest example I have is the time I tried to leave my own tool for a better one.

My tool is [ccrecall](https://github.com/NodeJSmith/claude-code-recall), a Python CLI for searching my past Claude Code sessions. I have no illusions about it. Its vector search is brute-force and will scale linearly forever. It only supports Claude Code, so my opencode sessions are invisible to it. Its embedding pipeline also OOM'd my machine repeatedly while I spent months patching symptoms instead of finding the cause.

Then I found [cass](https://github.com/Dicklesworthstone/coding_agent_session_search), a Rust session search engine with approximate nearest-neighbor search, support for more than 22 coding-agent providers, and over a thousand GitHub stars. Switching looked obvious. I ran a side-by-side evaluation, and my own AI judged cass "better by a wide margin." On the measurables, it was right. I committed 2,168 lines of integration code and moved over.

Two days later I reverted everything.

In those 48 hours I hit enough operational problems in my environment to submit a [PR with four documented fixes](https://github.com/Dicklesworthstone/coding_agent_session_search/pull/318). cass serves a much bigger audience than my tool, and a two-day trial says little about a project that size. It may be excellent for the people it's built for. All I know is that it didn't hold up under my workload, while my rough tool had done so for months. I also built the tool that won the comparison, so I'm hardly a neutral judge.

The AI had correctly identified cass's advantages in search quality, speed, and provider coverage. It even caught real risks, including a single-maintainer bus factor and an embedding pipeline where only one advertised model worked.

What neither of us decided up front was what "better" needed to mean. For a tool I use every day, reliability under my actual workload mattered more than the scoreboard. It took two days of real use to expose that mistake. Walking it back was cheap because the integration sat behind a clean boundary.

My workflow ran on that migration, but I skipped one gate: a [deeper vetting pass](https://github.com/NodeJSmith/Claudefiles/blob/main/skills/mine-eval-repo/SKILL.md) for third-party projects. On paper cass looked so good that I decided it didn't need one. That call cost me two days.

Other calls have paid off.

One day I watched an AI agent give up on ccrecall in real time. It made eight failed attempts to find a prompt from a prior session, then quietly abandoned the tool and wrote ad hoc Python to parse the raw session files.

The easy diagnosis was "search is flaky." When we traced the failures, we found that the content extractor indexed text blocks but skipped tool-call content entirely. A whole class of session data was invisible to search. AI found the evidence. I decided which problem was worth fixing, and the fix shipped the next day.

The embedding crashes took me longer. Over several months I accepted three plausible fixes: cap the batch size, add garbage collection, defer embedding during bulk import. None held because none reached the cause.

The fourth time, I stopped accepting patches until we knew what was happening. Profiling showed that memory use depended on the model's total attention work, not merely the number of items in a batch. A single 8,192-token input pushed peak memory to 8.4GB. We fixed it by planning batches around that attention cost and disabling onnxruntime's memory arena so memory returned to the OS between batches. That fix held. We also wrote down the invariant so a later cleanup couldn't undo it.

Sometimes AI finds the buried problem before I do. An old bug in ccrecall had added a duplicate row on every sync, leaving 3,295 bad rows hidden behind a filter. When a later cleanup proposed deleting that filter, a [challenge gate](https://github.com/NodeJSmith/Claudefiles/blob/main/skills/mine-challenge/SKILL.md) caught it. I still had to decide that the cleanup couldn't ship and what should replace it.

None of this is free. My larger project, [hassette](https://github.com/NodeJSmith/hassette), has gone through the same workflow for 11 months. Its plan-level gates reject work 33 to 45 percent of the time. Most of that critique is automated, with AI reviewing AI and pulling me in for the decisions. The friction is real. Features get delayed, finished work gets thrown away, and every rejection costs time and tokens. It also means less bad work reaches the codebase before anyone asks whether it belongs there.

## Accumulation is the default

The industry data can't measure this decision loop directly, but it does show what AI-assisted development tends to amplify.

[GitClear](https://www.gitclear.com/the_ai_code_quality_maintainability_gap) analyzed 623 million code changes from 2023 through 2026, the years AI adoption took off, and found duplication up 81% while refactoring fell 70%. Its methodology has critics, and it doesn't isolate AI-authored commits as cleanly as I'd like. Still, its direction matches more targeted research. A [study of 302,000 verified AI-authored commits](https://arxiv.org/abs/2603.28592) across 6,299 GitHub repositories found that reviewers never caught roughly a quarter of the issues AI introduced. Those code smells, correctness bugs, and security vulnerabilities remain at HEAD today.

The [DORA 2025 report](https://cloud.google.com/blog/products/ai-machine-learning/announcing-the-2025-dora-report) surveyed roughly 5,000 practitioners. Higher AI adoption correlated with both higher delivery throughput and greater delivery instability. Its conclusion was that AI amplifies the system around it. Strong processes get stronger. Weak ones get worse, and review matters more as AI writes more of the code.

No controlled study compares decision-gated AI development with throughput-first AI development. The research supports the broader claim that ungated AI output accumulates debt, not my specific workflow. My case rests on my own projects and gate data. Treat it as one practitioner's account.

## Keep the decision

AI writes better code than I do, and faster than I ever will. It can research a decision, challenge it, and test the consequences. It is still a poor judge of what "better" needs to mean in my life, my system, or my codebase. After a year of trying, I don't believe I can delegate that judgment yet.

The cheapest mechanism I know is a one-page spec before the next feature. Make the decisions in it yourself. What problem does this solve? What triggered it? Should it ship at all? If the spec doesn't survive a five-minute read, the feature shouldn't survive either.

You'll still decide wrong sometimes. I did. The only difference between a two-day mistake and a compounding one is how fast you catch it.

I'll keep automating everything else. The decisions stay mine.

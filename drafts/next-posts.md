# Next posts — planning notes

Not published. Two separate, unrelated pieces currently planned (not a combined series).

---

# Series: Guardrails for an AI-written codebase (hassette)

Multi-part series using hassette (~/source/hassette) as the case study.

## Part 1: Guardrails overview
Why an AI-native codebase needs guardrails at all. Framing piece the rest of the series hangs off of.

## Part 2: Don't pick your own frontend stack
React over Preact, shadcn + Tailwind over custom CSS — because AI's training data rewards the well-trodden path.
Could generalize past frontend: boring, mainstream choices anywhere in the stack perform better with AI, not just UI.

## Part 3: Run prior-art checks before writing code
"You have near-instant access to the best ways to solve this, why aren't you using it."

## Part 4: Let AI write your docs
And the harder half: how you keep them from going stale the moment the code moves.

## Part 5: 10 months, 190 design docs, and the fix that finally worked wasn't a document
Source: ~/source/hassette/design/audits/2026-06-22-project-retrospective/audit.md

Corrected framing (2026-08-01): 190 is the TOTAL size of the design corpus over ~10 months
(specs, research briefs, audits, critiques) — not a rejection count. Original "190 rejected
design docs" framing was a misreading, caught and fixed before drafting.

Real story: same class of structural decay (boundary/layering erosion) got rediscovered
multiple times because prose instructions don't hold in a fast-moving AI-authored codebase.
Spec 078's own design doc says it explicitly: "the intended layering erodes silently in an
AI-authored codebase." The fix that finally worked, in June, was mechanical linters
(import-cycle DAG enforcement, forgotten-await detection, blocking-IO detection, module-boundary
checks) — not more written rules. Quote-worthy line from the audit: "stop writing instructions,
encode the invariant in a check."

## Part 6: How do you know your AI-written tests actually catch bugs
Mutation testing as a guardrail-verification step. Ties to the `mine-mutation-test` tool.

---

# Standalone piece: The Claudefiles pipeline workflow

Fully separate from the hassette series above — not a part of it, not sequenced with it.

NOT the phone-controlled RC orchestrator (that was a wrong assumption on my part, corrected
2026-08-01, and stays corrected here).

This is the actual Claudefiles pipeline:

- **mine-grill** (optional) — multi-angle pressure-testing of an idea before committing to building it
- **mine-define** — discovery interview + codebase investigation → design.md. Or the slimmer
  **mine-sketch** — lightweight design.md + task files, skips full ceremony
- **mine-plan** — turns the design doc into task files, validates against a traceability checklist
- **mine-orchestrate** — executes tasks one at a time with an implementer + reviewer subagent loop

Not yet checked against prior art. The earlier "COVERED" prior-art flag from the original mined-ideas
list was about the phone-control concept specifically and does not apply to this pipeline topic.

---

# Standalone piece: Instrumenting an AI development pipeline to find out what's load-bearing

The cfl story. Separate from the Claudefiles pipeline piece above — that one covers the
workflow (grill→define→plan→orchestrate); this one covers the observability layer
underneath it.

The surface-level problem is resumability — an AI coding agent loses its context when it
compacts, and without durable state it restarts from scratch or guesses where it left off.
But the deeper problem is that a multi-gate pipeline (design review → code review →
integration review → readability review) is expensive, and you have no idea which gates
are catching real issues vs. which are ceremony unless you record the outcomes.

cfl is a SQLite-backed store (5,200 lines) that tracks runs, tasks, phases, gate
decisions, events, and plan snapshots — not just to make the pipeline resumable, but to
make it auditable and improvable.

Key beats:
- Gate recording: every quality gate decision (reviewer pass/fail, specific findings,
  fixes applied) is persisted, not just the final outcome. This is the data that
  answers "is the integration reviewer actually catching things the code reviewer
  misses, or is it rubber-stamping?"
- Already powering `agent-stats` (gate effectiveness — how often does each reviewer
  subagent actually block a commit?) and `orchestrate-cost` (cost breakdown by role
  and model per run) — the kind of questions you can't answer without structured
  event data
- Session tracking with compaction awareness — auto-joins sessions to active runs,
  records compaction events, so "what happened" survives the agent forgetting it did
  the work
- Plan snapshots — captures design doc + task files at run start, so spec-vs-implementation
  drift is detectable even after the files change
- The resumability angle: `cfl run status` as a primitive — an agent waking up after
  compaction reads it and knows exactly where to pick up
- The design choice to make this a standalone CLI + SQLite rather than in-memory state
  inside the orchestrator skill — because the orchestrator's memory is the thing that
  keeps dying

Where it's headed (not yet built, but the data model supports it):
- Which model produces the best design docs and task files for clean orchestration
  runs (fewer reviewer rejections, fewer intervention-needed flags)?
- Does downgrading the orchestrator from Opus to Sonnet result in degraded outcomes,
  or is the cheaper model indistinguishable in practice?
- Which gate has the highest false-positive rate and should be relaxed or cut?

---

# Standalone piece: "You Don't Need Stow or Chezmoi" (working title, was the chezmoi-comparison framing — retired 2026-08-02)

The dfl architecture piece. Not a "here's my dotfiles" post — those are commodity content.
The angle is: the existing dotfiles tools didn't fit the actual problem (multi-context
WSL machines, systemd service management, cross-platform sync), so building from scratch
was the honest answer — not a vanity project. The specific chezmoi anecdote got cut from
the piece itself (2026-08-02) — too thin/unverified to hang a story on — but survives as
a one-line name-drop in the thesis paragraph. stow/yadm were never tried because the
requirements were already beyond "symlink my zshrc."

**Status (2026-08-02): first draft complete.** Went through `/mine-fragments` →
`/mine-shape`. Both saved in this repo under
`drafts/you-dont-need-stow-or-chezmoi/` — `article.md` (the shaped draft) and
`fragments.md` (the raw material it was built from). Real thesis that emerged: "sprawl" (the problem — invisible
accumulation on a system with no file browsing) resolving into "bespoke software" (the
fix — build exactly what your constraints demand instead of adopting a general tool).
Opening leads with the bespoke thesis, grounds it in the actual constraint set (5
machines, 2 employers, VPS, WSL boundary) rather than the sprawl image, which pays off
later once the real numbers are in hand (110 loose files in `home/bin`, 505 tracked
files total, pre-reorg).

Key beats:
- Context-aware linking that tears down stale config (not just installs — reconciles).
  The failure mode this solves: a personal skill left on a work laptop after switching
  contexts, or a work-specific service running on the personal desktop
- Why 4 different sync mechanisms exist under `dfl sync`: `ssh` and `ahk` (WSL↔Windows
  can't symlink — and these are two separate mechanisms for that one constraint, not
  redundant: `ssh.exe` reads its own `.ssh` tree outside WSL, while AHK autostart has a
  timing problem, firing before WSL is guaranteed up), `vps` (no shared filesystem,
  pure SSH round-trips to smithfamily), and `secrets` (1Password rendering). Correction
  (verified 2026-08-02): the 1Password mechanism isn't forced by "can't run remotely" —
  a VPS service-account token existed 2026-07-28 and worked, then was deliberately
  revoked 2026-07-31 during a security audit to shrink attack surface. The sharper
  point: sometimes the separate mechanism isn't a limitation, it's the better choice
  after the direct path was proven to work and rejected anyway.
- Systemd service auto-discovery with condition evaluation — "add the unit file, the
  installer figures out where it runs" vs hand-maintaining a per-machine manifest
- The SIGTTIN story (not SIGPIPE — that never happened): a backgrounded `mise` health
  check sat in state T for two to three days because stdin was still attached to the
  tty. Real, but the "little to no involvement from Jessica" framing was a bad
  inference from terse commit messages — corrected 2026-08-02 from actual memory:
  Jessica noticed the check wasn't running and asked Claude why; Claude traced the
  signal chain, they discussed the fix together, Claude wrote it. Human-in-the-loop
  throughout (notices symptom → asks → AI investigates/explains/implements), not an
  autonomous find. (Commits `7994d8b`/`13e024c`, 2026-07-20.)
- Concrete numbers (verified 2026-08-02 against the live repo): 21 subcommands (13
  top-level — not 23, that count was stale, from before commands got grouped under
  `claude`/`sync`/`system triage`), 601 tests (confirmed exact), 52+7 systemd units
  (confirmed, but that split is timer-paired vs. standalone units, not user vs.
  system — the user/system split is actually 56/3), 5 machines, 3 work contexts
  (`WHICH_COMP`: PERSONAL/RHYME/ORION — confirmed as a real code construct, not just
  a description)

Could pair well with the "AI writes all my code" angle since dfl is itself AI-maintained.

---

# Standalone piece: Reverse engineering a private API when there are no docs

The OTF API story. Angle: the actual process and gotchas of building a typed client against
an undocumented mobile app API, not a tutorial.

Key beats:
- How to discover the API surface (capturing mobile app traffic, extracting Cognito
  identifiers from the APK)
- The device-key trap: token refresh silently fails without it, and the only way to
  discover that is by diffing real Cognito responses — it's not in any AWS docs
- Reconciling 3 separate API hosts with different auth requirements (one needs SigV4
  signing) into a single client
- The PII problem: you need real API responses to test against, but you can't commit
  them. The anonymization pipeline with leak detection as a solution
- Eventual consistency between API versions — bookings made via v1 don't immediately
  appear via v2, and the mutation response is authoritative over a re-fetch
- Maintaining a package with real external users (~900 downloads/month) against an API
  that can change without notice

---

# Standalone piece: Testing against external systems that weren't built for it

Could use hassette, OTF API, or the bills engine as case studies — or all three, since
each solves the problem differently.

Key beats:
- Hassette: runs a real Home Assistant Docker container in CI. Why mocks weren't enough,
  and the coverage-measurement bug that made the numbers lie (pytest --cov under-reports
  by 15-40% when conftest.py imports the package before tracing starts)
- OTF API: can't run against the real API in CI (credentials, rate limits, moving target).
  Built an anonymization pipeline so the fixture set is structurally faithful without
  leaking PII
- Bills engine: the equivalence harness approach — pin the classifier's behavior against
  34 real bills and 202 real transactions, run in both "payment source available" and
  "payment source unavailable" modes
- The common thread: each external system demands a different testing strategy, and
  picking the wrong one gives you a green CI that lies about whether the thing works

---

# Standalone piece: AI is a magnifier, not a fix

Emerged from a career-reflection conversation (2026-08-01). Not yet researched or checked
against prior art.

Thesis: AI doesn't add new capability to a developer, it magnifies whatever's already
there — abilities, patterns, strengths, and weaknesses alike. For most engineers this
nets negative, because most don't already have the practices (spec discipline, review
rigor, testing habits) that make magnification a win instead of a faster way to make the
same mistakes.

Key beats (rough):
- The people AI helps most are the ones already building well; the people it hurts are
  the ones for whom "build build build, no brakes" was already the habit — AI just lets
  them run it at 10x speed
- Related to, but distinct from, the cass/ccrecall story — that material isn't a
  separate draft, it's already published in minimized form inside "AI Writes All My
  Code" (the migration decision, the abandoned-tool moment, the duplicate-row bug).
  Could be pulled back out and go deeper as its own case study; this magnifier piece
  is the general thesis it's an instance of, not a duplicate of it
- Possible personal angle: contrast a modest, human-in-the-loop AI spend against an
  unstructured, nonstop-agent-loop approach, without needing it to be the same example
  as the cass piece

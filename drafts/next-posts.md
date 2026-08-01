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

# Standalone piece: Building a state machine for AI orchestration that outlives the AI's memory

The cfl story. Separate from the Claudefiles pipeline piece above — that one covers the
workflow (grill→define→plan→orchestrate); this one covers the persistence layer underneath
it and why it needs to exist.

The problem: an AI coding agent working through a multi-task plan loses its entire context
when it compacts. Without durable state, it either restarts from scratch or guesses where
it left off. cfl is the fix — a SQLite-backed state machine (5,200 lines) that tracks
runs, tasks, phases, gates, events, and plan snapshots so the pipeline is resumable across
any number of context losses.

Key beats:
- Run lifecycle: start → advance phase → complete/stop, with orphan detection for runs
  that died mid-flight
- Session tracking with compaction awareness — auto-joins the current session to the
  active run, records compaction events, so "what happened" is answerable after the
  agent that did it has forgotten
- Gate recording — every quality gate decision (reviewer pass/fail, findings, fixes
  applied) is persisted, not just the final outcome, so you can audit why a task was
  accepted
- Plan snapshots — captures the design doc and task files at run start, so drift between
  the spec and the implementation is detectable even after the files change
- `cfl run status` as the resumption primitive — an agent waking up after compaction
  reads it and knows exactly where to pick up, what's done, what's in progress, and
  what needs intervention
- The design choice to make this a standalone CLI + SQLite rather than in-memory state
  inside the orchestrator skill — because the orchestrator's memory is the thing that
  keeps dying

---

# Standalone piece: Why I built my own dotfiles manager instead of using chezmoi

The dfl architecture piece. Not a "here's my dotfiles" post — those are commodity content.
The angle is: the existing dotfiles tools didn't fit the actual problem (multi-context
WSL machines, systemd service management, cross-platform sync), so building from scratch
was the honest answer — not a vanity project. Brief chezmoi experiment confirmed the
mismatch; stow/yadm were never tried because the requirements were already beyond
"symlink my zshrc."

Key beats:
- Context-aware linking that tears down stale config (not just installs — reconciles).
  The failure mode this solves: a personal skill left on a work laptop after switching
  contexts, or a work-specific service running on the personal desktop
- Why 4 different sync mechanisms exist (WSL↔Windows can't symlink, VPS can't mount,
  1Password can't run remotely) — each one solves a genuinely different constraint, not
  scope creep
- Systemd service auto-discovery with condition evaluation — "add the unit file, the
  installer figures out where it runs" vs hand-maintaining a per-machine manifest
- The SIGPIPE and SIGTTIN war stories (a backgrounded health check sat in state T for
  days because stdin was still attached to the tty)
- Concrete numbers: 23 subcommands, 601 tests, 52+7 systemd units, 5 machines, 3 work
  contexts

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

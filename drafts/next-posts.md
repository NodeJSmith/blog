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

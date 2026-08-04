# Why I Built My Own Dotfiles Manager Instead of Using Chezmoi

I didn't try chezmoi first. I'd already painstakingly built and glued together a basic
multi-computer sync process before I ever looked at it. The chezmoi stint was brief —
maybe 2+ years ago — and predates even the current Dotfiles git repo.

---

I knew chezmoi wasn't going to work the moment I saw it wanted me to do things its way,
with no regard for how my stuff was already set up or how I'd actually be working. I
think it wanted a bare git repo and some specific git configuration I didn't want to
deal with. (Unverified — no trace of the chezmoi experiment survives in git history to
confirm the exact mechanism, so this is from memory.)

---

Before chezmoi, before even the Dotfiles repo, the original setup was a bare git repo
that lived at `~`, configured to ignore untracked files so it wouldn't nag me to add
random stuff. I just added the few configs and zshrc pieces I actually cared about, and
ran that same repo on every machine.

That fell apart — or at least stopped being enough — around the time I started working
two jobs. That's when symlinks and selective syncing (not "the same files everywhere")
started to matter. The 2023-11-23 first commit to the current Dotfiles repo,
"move things to new repo and use symbolic links," is the fossil record of that shift:
the commit message names the exact change (bare repo → symlinks) even though it doesn't
say why.

---

The first real linking tool was `mklinks.sh` — 52 lines of bash, one function
(`create_replace_link`), and a flat hardcoded list of six calls at the bottom
(`.zshrc`, `.bashrc`, `nvim`, `fzf`, `starship.toml`, `.gitconfig`). No per-machine
awareness, no config file — to add a dotfile you edited the script. Backup-and-replace
on conflict, not teardown. This is the ancestor of today's context-aware linker; the
throughline is the same problem (get my files onto every machine) getting a
progressively less manual answer as the constraints stacked up.

---

Two employers at once, not sequential — main job at Rhyme, contract work at Orion. Same
setup today as back then. The goal was, and still is, keeping things from crossing
between them as much as possible. This is the same isolation problem that later became
"context-aware linking that tears down stale config" — not a new requirement, a
constant one that just kept getting a better answer.

---

The "personal skill left on a work laptop" failure mode is new and specific to Claude
Code — I don't need or want something like my Monarch Money skill taking up context on
a work machine. That's a distinct, more recent thread from the original isolation
problem.

---

The original cross-context worry was mundane: Prefect aliases and functions from Orion
showing up on the Rhyme machine, or vice versa. It probably wouldn't have hurt anything
— and it was never secrets, until 1Password secret pulling got added later. But it was
surface area, and I wanted to reduce it, because: if it's aliases today, what will it be
tomorrow? And will my main job ever notice stuff like that in my box and wonder why it's
there?

---

The underlying worry isn't "something will break," it's "something will be noticed."
Isolation as a way of staying illegible to an employer who isn't owed an explanation for
what's on your own machine.

---

The anxiety is specific: not competition, nothing shady — just not wanting people at the
main job to find out about the contracting and get upset about it. Don't want to deal
with that conversation or the risk of it happening. Isolation is a hedge against a
conversation, not a security posture.

---

There wasn't a single breaking moment — it was constant accretion. More zsh plugins,
more synced stuff, more function files, and organizing all of it got harder as it grew.
Then `mise` entered the picture, and with it a wave of tools — ripgrep, fd, and others —
each with its own config file to track and sync.

---

At some point basic ChatGPT happened, and that's when I realized I could actually start
improving things with AI's help instead of just accumulating them by hand.

---

Claude Code took the system from better-symlinks-in-bash to a Python script or two.
After that, growth was one-offs stacked on one-offs: syncing SSH config on the Windows
side, syncing AHK, and — the big one — layer after layer of checks.

---

The checks were one of the best parts of the whole effort: realizing I could write a
check for every single thing that would normally accumulate as silent cruft — version
updates, systemd jobs quietly failing, passwords that needed re-syncing. Instead of
finding out something broke by tripping over it later, there's a check for it.

---

Some of this traces back to the VPS. That was the first time I was really syncing a
pile of personal, non-work stuff — and I specifically didn't want to bring that onto the
work laptops either. So the isolation problem split into two axes: work-vs-work
(Rhyme/Orion) and personal-vs-work (VPS/personal stuff vs. either job).

---

The Claude Code dev work itself created new sprawl to manage: systemd jobs for
monitoring runaway processes, leftover files, and orphaned Docker containers. Building
with an agent generated the exact kind of mess the tool exists to clean up.

---

It just grew exponentially once Claude Code got involved. `dfl` wasn't planned as a
rewrite — it's what eventually made sense as a way to manage the sprawl once ad hoc
growth outpaced a couple of Python scripts.

---

**Sprawl** is the word. It's especially apt because this all happens on a system where I
never look at files in an explorer — no visual browsing, just `cd` and edit directly.
It's hard to see an explosion you never look at: 30 folders with 5 files each, or
whatever the real shape was, stays invisible until something forces you to confront it.

---

`dfl` came after a Claude-Code-driven reorg of the whole repo — getting it into some
kind of cohesive order first. The reorg wasn't the same event as building `dfl`; it's
what made `dfl` possible, or at least what made it make sense as the next move.

---

Another pain point on the way to `dfl`: dependency mess. Different checks lived in
different Python packages, so a library available to one check wasn't available to
another. And it wasn't even consistently Python — some of it was bash, some was Python,
no shared foundation. A mess, in a word.

---

Correction to the planning notes: the SIGPIPE/SIGTTIN thing wasn't a personal war
story — I genuinely don't remember it happening. It was probably a real problem, but one
Claude found and fixed with little to no involvement from me. Worth double-checking
before it goes in the piece as a lived anecdote; it may be better framed as "Claude
caught something I never would have noticed" than as something I fought through.

---

Confirmed: the SIGTTIN story is real (not SIGPIPE — that half never happened). Two
commits, `7994d8b` and `13e024c`, landed 10 seconds apart on 2026-07-20. A backgrounded
`mise` health check read from stdin, which was still attached to the terminal, took a
SIGTTIN, and stopped — "observed twice, parked in state T for two and three days,"
per the commit message. The fix is a five-line function, `_detach_stdin()`, that points
fd 0 at `/dev/null` before any check runs, with a docstring that explains the whole
failure chain: the timeout that was supposed to save it couldn't, because the same
signal that stopped the child also stopped the parent enforcing the timeout.

The commit messages read like root-cause writeups, not a first-person account of
watching it happen — no "I noticed," no debugging narrative, just the mechanism stated
plainly after the fact. That terseness misled the earlier guess about how this
happened: it was NOT a fully autonomous find with zero human involvement. Correction,
from actual memory once prompted: I noticed the check wasn't running and asked Claude
why. Claude traced the exact signal chain, we talked through the fix together, and
Claude wrote the code. I raised the question; I didn't do the debugging myself. Real
division of labor: human notices symptom and asks, AI investigates and explains and
implements, human is in the loop throughout rather than absent. The docstring itself is
still basically publication-ready — that part holds.

---

The systemd auto-discovery mechanism didn't replace a hand-maintained manifest — it
replaced *nothing at all*. Before it, the bash installer symlinked and enabled every
unit in the directory, unconditionally, for every machine. Two commits, 29 minutes
apart on 2026-03-30, made it condition-aware: first teach the health-check script to
recognize `ConditionHost=`, then rewrite the installer in Python so it actually
skips — and prunes — units that don't apply to the current machine. No incident
triggered it in the commit history; it reads as proactive hardening, done in one
sitting, not a response to something breaking.

---

Numbers to fix before publishing: subcommands is stale (claimed 23; actual is 13
top-level / 21 total leaf commands — the note predates commands getting grouped under
`claude`, `sync`, and `system triage`). Tests check out exactly: 601. "52+7" checks out
too, but not as user/system split (that's 56/3) — it's timer-paired vs. standalone
units (26 services with a matching timer = 52, plus 7 standalone). 5 machines and 3
work contexts (`WHICH_COMP`: PERSONAL/RHYME/ORION) both confirmed as real, live code
constructs — not just a description, an actual conditional axis in the linker.

---

The teardown mechanism has a name and a real origin incident. `ConditionalLink` objects
carry a `contexts` set; `remove_inactive_links()` walks all of them every `dfl link`
run and unlinks anything that's a Dotfiles-owned symlink but no longer active for the
current `WHICH_COMP`, then prunes the emptied directories. The actual incident: commit
`b3b5272`, 2026-06-25, "scope personal Claude config to personal machines" — personal
home-automation tooling under `config/claude/` (skills, commands, learned notes) was
symlinking onto ORION and RHYME along with everything else, until this commit scoped it
and started tearing it down. Same commit also deleted a personal coding-style rule file
because it "clashed with work code." The exact sentence from `CLAUDE.md` is the line to
use: "a personal skill left over on a work box is removed, not just skipped."

---

There's a second-order fragment here: teardown alone wasn't enough. A commit two weeks
later, `9f01c7c` (2026-07-10), "warn on ConditionalLinks left from an inactive context,"
closes a gap where the drift-*checker* (not the linker) had been silently skipping
inactive conditional links — so a link created under an old context could sit there
undetected until someone happened to re-run `dfl link`. The fix didn't just tear down
stale state, it added a check that notices stale state exists before it's torn down.
Nice small case of "encode the invariant in a check" applied to the tool's own output.

---

The four `dfl sync` mechanisms, confirmed and named: `secrets` (1Password → rendered
`.secrets` files), `ssh` and `ahk` (both WSL→Windows via `/mnt/c`), and `vps` (pure SSH
round-trips to smithfamily, no shared filesystem at all). The "3 constraints for 4
mechanisms" in the notes isn't a gap — `ssh` and `ahk` really are two different answers
to the same WSL↔Windows constraint: `ssh.exe` reads its own `.ssh` tree outside WSL
entirely, while the AHK autostart script has a *timing* problem instead of a *location*
problem — Windows login fires before WSL is guaranteed to be up, so `\\wsl$` isn't
reliably resolvable yet. Same underlying wall, two different reasons a symlink can't
just reach across it.

---

Correction: the "1Password can't run remotely" framing is wrong, and it's a better
story once fixed. The VPS *did* talk to 1Password directly for a while — a service-
account token was added 2026-07-28 and it worked. It was deliberately revoked on
2026-07-31 during a security audit, specifically to shrink attack surface, not because
headless auth was impossible. So the real shape isn't "a technical wall forced a
workaround," it's "a workaround was chosen on purpose after the direct path was proven
to work and then decided to be not worth the exposure." That's a sharper point than the
original framing: sometimes the separate sync mechanism isn't a limitation you're stuck
with, it's the more defensible choice once you've actually tried the alternative.

---

The AI-authorship of `dfl` itself has a number now: 66 commits over 19 days
(2026-07-13 to 2026-08-01), +18,380/-2,421 lines. Day one alone landed 7 commits
tagged `WIP: T01` through `WIP: T07`, roughly 30-90 minutes apart between 10:40 and
20:54 — task-numbered commits matching this repo's own orchestrated-execution
convention. That's not a pace a human types at.

---

Every commit is authored "Jessica Smith" — attribution to AI is disabled by choice —
so authorship itself can't prove the AI-written claim. What proves it instead is style:
89% of commits use terse Conventional Commits prefixes averaging 61 characters, no
narrative bodies. Meanwhile `CHANGELOG.md` in the same repo reads like debugging
session logs — long, narrative, first-person-adjacent. Two totally different registers
in the same repo, and the gap between them is itself evidence of who — or what — was
writing which one.

---

Correction / clarification, from memory rather than the commit log: it won't show up
attributed to Claude Code anywhere, but it's all Claude Code past a certain point. The
only thing committed and pushed by hand anymore is completions files. Worth stating
plainly in the post rather than relying on the reader to infer it from commit-message
style.

---

Small, almost too-perfect detail: `CHANGELOG.md` already has an entry noting that the
first blog post draft ("AI Writes All My Code") was parked in the `writing/blog/`
folder of this same repo, "until the blog itself exists." The dotfiles repo has been
quietly narrating its own writing process in its own changelog the whole time.

---

The guardrails claim isn't aspirational: every commit touching `packages/dfl/` is
gated by `ruff check --fix` → `ruff format` → `pyright` → `pytest` (601 tests) via
pre-commit. That's the concrete evidence for "AI moves fast here because there's a real
net under it," not just an assertion.

---

`dfl` stands for DotFiLes — and it's named that way on purpose, following the same
pattern as `cfl` (the Claudefiles CLI), a totally different tool for a totally
different purpose that just happens to be the main CLI for its own repo too. Naming
convention as connective tissue between two otherwise-unrelated tools: repo initials +
`l` for "CLI," basically.

---

No tension in publishing this, and pseudonyms are optional rather than required —
"main job" and "contract job" works fine without needing real names or even
consistent fake ones. The contract job already knows about the main job. And if the
main job wants to get upset at this point, that's allowed — not worried about it
anymore.

---

Possible tension worth naming on purpose rather than smoothing over: the whole
isolation system — the sprawl-fighting, the context-aware teardown, four sync
mechanisms — was built partly out of real anxiety about being found out. By the time
there's a blog post about it, that anxiety isn't binding anymore. That arc (built from
anxiety → published without it) might be worth a line of its own, rather than let the
piece read like the anxiety was never real.

---

The reorg-then-`dfl` sequence has a timestamp, and it's tighter than expected: the
reorg (spec 002-dotfiles-reorg) archived its task files at 06:18 on 2026-07-13. The
`dfl` design doc (spec 003) was written 46 minutes later, at 07:04, same morning. The
first line of actual `dfl` code landed at 10:40 that same day. Reorg finished, design
written, build started — all before lunch, same date. Confirmed as genuinely separate
efforts (different spec numbers, different design docs) but same-day, almost
same-breath sequential.

---

What the reorg actually did, concretely: `dotfiles/` (the old flat linker module) became
`install/`; `systemd/` became `services/`, split into system and user halves; `zsh/`
became `shell/`; a new `orchestrator/` got carved out of scripts that used to just live
loose under `home/bin/mine/`; a new `tools/` absorbed the rest of that loose-script
pile. 309 files touched, almost entirely renames — the reorg wasn't adding anything,
it was giving the existing sprawl a shape before building the next thing on top of it.
Subtract before you add, at repo-structure scale.

---

What's wrong with the typical "here's my dotfiles" post: it reads like a cookiecutter
recipe that will solve your problems, without acknowledging that unless you're a total
beginner with no existing setup, that's just not true. Adopting someone else's system
means changing your own setup to match it — that's friction of its own kind, not the
absence of friction. And those posts rarely handle edge cases, because they're written
for the general case, not for a specific person's actual constraints.

---

The thesis, close to verbatim: it's 2026, we have AI. Don't use chezmoi, don't use
stow, don't use anything else built for a hypothetical general user. Make what you need
for yourself, exactly as you need it. It's the era of bespoke software, and that's
genuinely great — especially for something as inherently bespoke as your own dotfiles
setup, which was never really a one-size-fits-all problem to begin with.

---

Possible second leading phrase, paired with "sprawl": **bespoke software** — sprawl
names the problem (invisible accumulation nobody's watching), bespoke software names
the argument for the fix (build the exact tool for your exact constraints instead of
adopting someone else's general-purpose one). The piece could resolve from one word to
the other: starts in sprawl, ends in bespoke.

---

Important honesty check on the "checks" fragment above: there's no proactive-foresight
story to tell here. Every single check that exists was written *because* a problem was
first found without it — fully reactive in origin, every time. The real claim isn't
"I saw failure modes coming and got ahead of them." It's narrower and more honest:
once something breaks and gets noticed, it never gets to break silently the same way
twice. The checks are written in blood, one at a time, and the system's virtue is
never forgetting a lesson, not foresight.

---

There's a second, separate repo: WinDotfiles, at `/mnt/c/Users/jessica/WinDotfiles`,
Windows-side. It's mostly a bootstrapping repo now, not a living custom setup — I gave
up on having a real bespoke setup on the Windows side.

---

The exact give-up moment has a commit: `d19653d`, 2026-05-29, "strip powershell profile
to minimal startup." -922/+77 lines. Removed: mise activation, posh-git, PSFzf, a whole
custom functions module, az/winget completions, shell_gpt config, nvim config, fzf
config, secrets, aliases, vars — basically the entire PowerShell equivalent of what
`~/Dotfiles` does for the shell side. Kept: UTF-8 encoding, the starship prompt, arrow-
key history search, Ctrl+D exit. The commit message states the reason plainly: "shell
startup was slow and most tooling was dead (mise all missing, shell_gpt replaced by
Claude, nvim unused on Windows, ADO functions half-broken)." Everything real had
already migrated into WSL; the PowerShell side had turned into unmaintained scar
tissue, so it got cut rather than kept.

---

This is a useful counterweight to the "bespoke everything" thesis, not a contradiction
of it: bespoke doesn't mean custom-build every surface. It means investing where the
real work happens (WSL, the shell, `dfl`) and being willing to strip a surface down to
a thin bootstrap layer once it's clear nothing lives there anymore. WinDotfiles today
is mostly: new-machine migration runbook (`MIGRATION.md`), GUI app installs via
winget, a couple of small local services (TeamsMeetingStatus, PitchLight/HA
integration), and Windows debloat scripts. Infrastructure, not personality.

---

The real answer, plainly: PowerShell is a pain to customize, and I avoid going into it
at all now if I can help it. But underneath that — I barely use the CLI myself anymore,
period. Claude does it, even the PowerShell side. There's nothing contradictory about
skipping bespoke tooling for a shell you no longer type into by hand. Investment
follows use, and use moved to wherever Claude operates, not to whichever shell happens
to be open.

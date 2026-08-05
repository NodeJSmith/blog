# You Can Still Write Good Code

On July 31st someone I've never met opened a pull request against hassette. They'd been
running it in their house for a few months, hit a caching bug, and fixed it: ten lines in
the state manager, fifty lines of tests.

They found the right file. They found the right test file too — there were already tests
covering that exact code path, passing the whole time, because they correctly asserted the
buggy behavior. They deleted one named `test_context_id_match_returns_cached_object` and
wrote better ones. Opened and merged the same day.

An AI wrote almost all of the code he was patching.

That's the flattering story about hassette, and it's true. It's a home automation
framework. You install it, write a handler or two, start it, and it works. I run my house
on it. It has been written almost entirely by AI for about six months.

The frontend has been rewritten four times.

Same repo. Same six months. Same AI, same review pipeline, same person supervising. About
a quarter of the project's design specs are frontend work.

It isn't the tooling. The tooling was identical.

Nothing gets written until there's a design doc. Every task runs an implementer and a
reviewer subagent in a loop until the findings clear, and then the change goes through a
correctness review, an integration review that asks whether it fits the code around it, and
a readability pass. There are linters that enforce module boundaries, catch forgotten
awaits, and flag blocking IO in async paths.

I'm strict about all of it, and not out of discipline. I run my house on this thing. When
it breaks, it breaks on me.

Here's what supervising actually looks like on a good day.

My office lights started flickering. The garage proximity app had done something to them,
and every few seconds they'd shift brightness and shift back. Claude found a fix fast: add
a brightness tolerance, ignore changes below the threshold. It would have worked. The tests
would have passed.

I typed: *"is this actually the right fix? i'm not following why this is the right fix, it
feels like a bandaid?"*

It wasn't. The real bug was a feedback loop — the override handler kept re-applying its own
brightness instead of the one originally intended, so it chased itself forever. The
tolerance check would have shipped, passed everything, and half-worked.

That's the whole job. Not writing the fix. Asking whether the fix is the fix.

I didn't know I had a word for it until I went looking. *Bandaid* turns up in my
transcripts unprompted, months apart, always for the same thing. Here it is again, on a
test-fixture cleanup: *"I don't like the idea of putting a bandaid on this. if we need to
change a lot of call sites it's because we wrote bad tests originally."*

Those are two different refusals. The first one says the fix doesn't address the cause. The
second one says the cheap fix would work fine and I'm not taking it, because the only
reason it's on the table is that we wrote bad tests and I'd rather fix that.

The frontend got the same treatment. Design docs, the same reviewers, the same loop. And it
went: a Bulma proof of concept, then a custom design system, then htmx and Alpine,
abandoned one day after its own design doc was written, then Preact, then five rounds of
visual parity work, then CSS modules, then shared components, then React and shadcn and
Tailwind.

I wasn't sloppy about it. I was wrong, repeatedly, in a way nothing in the pipeline could
see.

When I finally started asking about switching again, I put it like this:

> *"i fight with the frontend every time we work on it... but also keep in mind that i'm
> not a frontend girl so i may be barking up the totally wrong tree, idk"*

The design doc that came out of that conversation named the mechanism. Preact's ecosystem
was thin enough that every interactive primitive had to be hand-built, and there was no
shared component vocabulary, so the design context had to over-specify every visual
decision to prevent invention.

Which is a polite way of saying I couldn't tell it what I wanted.

So what was different?

Not the process. The process was constant. What was there for the backend and missing for
the frontend was me being able to tell.

On the backend I can read a design doc and say: this service is doing two jobs, that's
global state, this is a hack. Years of Python, design patterns, separation of concerns —
none of it has anything to do with home automation, and all of it transfers. I'm not even a
software engineer by title; I'm a data engineer, which increasingly looks like the on-ramp
I happened to get rather than the work I actually do. On the frontend I had none of that,
and the reviewers couldn't supply it, because the reviewers are AI too. They amplify
whatever I can already see. When I can recognize the rot, that's leverage. When I can't,
they're just more confident AI agreeing with itself, and nobody in the room can call it.

There's an obvious objection here and it's a good one. The backend didn't only have my
judgment. I hand-wrote its foundation before any of this, so the AI was building on
structure that was already right. And async Python services are far better represented in
training data than a bespoke Preact component system — the shadcn design doc says so
outright, that it works *because* it's heavily represented in training data, so agents
produce correct UI with minimal specification.

Both of those are real. The training data one is a genuinely separate cause and I'm not
going to pretend a single variable explains everything.

But neither of them rescues the frontend, because the well-trodden stack was available from
day one. React and shadcn existed the whole time. I didn't pick them, and I didn't pick
them because I couldn't tell that I should. Not knowing to choose the boring option is the
same failure one level up.

There's a less flattering version of this, and I think it's the true one.

I was lazier with the frontend. I read those design docs less carefully, because I went in
assuming I wouldn't follow them anyway. The supervision was thinnest exactly where it
needed to be thickest.

Which means I never actually hit the ceiling. I stopped somewhere below it.

I don't read diffs. I read design docs and task files — that's where I notice things
getting funny. And a design doc is a translation: it renders a domain I can't evaluate into
a shape I can. I could not have read Preact's source and known its ecosystem was too thin.
But "every interactive primitive must be hand-built" arrives with a list — dropdowns,
popovers, tables, selects — and *why are we building all of these from scratch* is a
question I was fully equipped to ask with zero frontend knowledge.

I had the instrument. I put it down in the one room that was dark.

So the advice isn't "learn the domain first," and it isn't "be more rigorous," which is
what I told myself for months without it meaning anything. It's narrower than that: when
you understand the code least, read the documents hardest. The instinct runs exactly the
other way, which is the whole problem.

People ask whether this is a lot of work. It is, and none of it is hard. I wrote hassette
by hand for the first few months and *that* was hard — there is an enormous amount to think
about and get right in a system like this. Keeping an AI honest about quality is the easier
job by a wide margin.

But that's only true inside the part I understand. In the frontend it wasn't easy at all.
It was four rewrites.

The stranger who fixed my caching bug in ten lines was working in the half of the codebase
where I could tell. That isn't a coincidence, and it isn't the AI's doing. It's the half I
could actually supervise.

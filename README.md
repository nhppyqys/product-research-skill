# Product Research Skill

**A research method for AI agents that produces reports a buyer, founder, or investor can actually act on — with a completion contract enforced by code, not by hope.**

[简体中文](README.zh-CN.md) · [日本語](README.ja.md)

---

Ask an agent to "analyze this product" and you usually get a summary of the homepage. This is the method that stops that from happening.

It came out of running the same research on real products over and over, writing down every way it went wrong, and turning each failure into a rule. **42 of those failures are documented here**, each with the condition under which the rule stops being true.

## Things this method knows that most don't

These are real techniques from the casebook, not hypotheticals:

**A 404 page often carries the company's headcount.** SEO plugins inject `schema.org` Organization JSON-LD into *every* page template, including the 404. Probe a path that doesn't exist, read the JSON-LD, and you may get employee count, founding date, office locations, and the official positioning blurb — in one request. → [C-02](skills/product-research/casebook.md)

**`robots.txt` is the highest-density intelligence file on most sites.** Its `Disallow` list is what a company doesn't want indexed: discount landing pages, channel-specific pricing, trial funnels. One product listed a public price of $45–329/mo while hiding `/offer/…-77-off-first-month` and `/offer/…-500-off-annually`. The list price was never the real price. → [C-03](skills/product-research/casebook.md)

**A login wall is not a wall.** The vendor's own tutorial videos are screen recordings of the real UI — they have to be, or they couldn't teach anyone. `yt-dlp` the channel, `ffmpeg` a frame. Two separate products turned out to ship an MCP server that appeared *nowhere* on their site or docs, and was only visible in a demo video. → [C-05](skills/product-research/casebook.md)

**For open-core products, the paywall is a directory.** The `LICENSE` file names the exact folders under a commercial license — that's the paid feature list, stated in language the vendor can't fudge. And license *changes* hide inside ordinary commits: one product swapped 670 lines of AGPL-plus-commercial for 21 lines of MIT in a 300-file commit titled `refactor:`. → [C-32, C-34](skills/product-research/casebook.md)

**For marketplaces, `/pricing` might belong to a seller.** On a two-sided platform the top-level namespace often falls through to seller storefronts. `/pricing` and `/security` both returned 200 — one was a shop named "PRICING", the other was "Oracle's store". Status codes can't tell you which. → [C-38](skills/product-research/casebook.md)

**Supply-side velocity is measurable; demand-side usually isn't.** Marketplace listings aren't in the sitemap, but the "newest arrivals" RSS is timestamped: 100 items spanning 316 minutes = ~455 new listings/day. Buyers leave no public trace, so the honest move is to say so instead of passing off total site traffic as buyer volume. → [C-39, C-42](skills/product-research/casebook.md)

## Quick start

No install, no API key. Drop the skill files where your agent reads them:

```bash
git clone https://github.com/nhppyqys/product-research-skill
cp -r product-research-skill/skills/product-research ~/.claude/skills/
```

Then:

```
Use product_research_method to research https://example.com, from a buyer's perspective.
```

That's it. The entry method pulls in the sub-methods it needs at the steps where it needs them.

Before you hand the report to anyone:

```bash
node scripts/check-report.mjs report.md
```

## What you get

A report structured for a decision, not for a demo:

```
Read this first        Plain language, no jargon. What it is, who buys it,
                       how much money it makes, where it sits, biggest risk.
What it is             Feature modules in business terms + real UI screenshots
Pricing                Tiers, unit of billing, what's actually metered,
                       and the discounts hidden in robots.txt
Claims vs. facts       Every homepage claim marked holds / fails / unverifiable
Company                Founded, HQ, founders, funding, headcount, revenue, valuation
Landscape              Layered first, then compared. Never compare across layers.
What users say         ≤10 verbatim quotes with source, date, and identity —
                       grouped by time, because sentiment drifts
Risks
Verdict                Split by viewpoint: buyer / founder / investor / PM
Boundaries             What wasn't obtained → and how that limits the conclusions
```

The last section is the one that matters most. It says *"couldn't get X, so conclusion Y is weaker"* — not *"I didn't do X."* The first is professional. The second is an excuse.

## How it works

Four parts, each doing exactly one job:

```
 skills/product-research/
 ├── product-research-method.md   HOW    — 10-step sequence + shape-specific branches
 ├── casebook.md                  WHY    — 42 field cases, each with its boundary
 ├── contract.json                ENOUGH — 20 completion requirements, machine-readable
 └── (sub-methods)                        viewpoint · landscape · voice-of-customer · recent
        │
        ▼
 scripts/check-report.mjs         ENFORCE — runs the contract before delivery
```

**They don't overlap.** The method contains no numbers (those live in the contract). The contract contains no reasoning (that lives in the casebook). Change a standard → edit the contract. Change an approach → edit the method. Add a lesson → add a case.

Routing is deterministic. Only the entry method is keyword-routable; the four sub-methods have empty triggers and are loaded *by name* at named steps. The build fails if a pack has anything other than exactly one entry.

### Why a contract instead of a checklist

The method has ~69 hard requirements spread across ~63 sections. A checklist at the end of a long document does not get run. We know, because it wasn't:

| What was skipped | For how long |
|---|---|
| Screenshots ("environment can't render") | 5 rounds — the environment could, nobody tried |
| Recent-changes step | 3 rounds — the sub-method existed but no step invoked it |
| Layered market analysis | Done once, then vanished — it was never in the flow |
| The entire claims-vs-facts section | 1 round, unnoticed by author *and* reviewer |

That last one was caught by the checker, not by a person. **Prose has no enforcement. Code does.**

Some requirements can't be read off the finished report — how many paths you probed, how many case studies you read, whether you checked the vendor's video channel. Those go in a separate [evidence manifest](docs/evidence-manifest.md) that never ships with the report.

Skipping a step needs one of three reasons, and nothing else counts:

| Reason | Means |
|---|---|
| `blocked` | Every fallback channel tried and failed — say which, and what each returned |
| `absent` | The thing doesn't exist (no mobile app → no app store reviews) |
| `incapable` | The environment genuinely can't — **you must have tried, and must quote the error** |

`incapable` gets that warning because it was abused for five rounds straight.

## What makes the casebook different

Every case has seven fields. Two of them are the point:

- **Premise** — what kind of product, under what conditions. *This decides whether the case applies to what's in front of you.*
- **Does not apply when** — where following this rule makes things worse.

A case without those two is worse than no case. It hands you a specific conclusion without the conditions that make it true, and it gets carried into unrelated work as fact.

That isn't theoretical. Cross-model testing found a model writing *"no customer page (`/customers` returns 404)"* into a report about a completely different product — lifted from an example in the method document. It reproduced in 2 of 3 runs. → [C-28](skills/product-research/casebook.md)

## Cross-model results

Same method, same evidence, two models, three runs each:

| | Conclusions | Failure mode | Fixable by code? |
|---|---|---|---|
| **Faster model** | Correct in 3/3 | Formatting: inline HTML, chatty preamble, leaked version string | **Yes** |
| **Slower model** | Correct, better written | **Fabricated evidence in 2/3**; leaked internal rule text in 3/3 | **No** |

The slower model produced better prose *and* invented a status code that was never observed. **Neither model should run unchecked.** The practical setup is the faster model plus a mandatory checker.

## Coverage — and where it's thin

Honesty about calibration matters more than claiming completeness:

| Product shape | Field samples | Not covered |
|---|---|---|
| Self-serve SaaS | 4 | — |
| Enterprise sales | 2 | Cloud marketplace contract pricing |
| Consumer app | 1 | Chart position, paid-acquisition signals |
| Developer tool / API | 2 | Full rate-limit and error-code teardown |
| Early-stage (no reviews, no cases) | 1 | — |
| Open source / open core | 1 | No sample that is *still* open-core — ours had already gone fully MIT |
| Marketplace / two-sided | 1 | Listing and moderation rules; **demand side is inherently unmeasurable**, not merely untested |

Running the method on an untested shape is fine. Pretending you're calibrated for it is not — say so in the report's boundaries section.

## Documentation

| | |
|---|---|
| [How it works](docs/how-it-works.md) | Architecture, routing, the contract, the checker |
| [Evidence manifest](docs/evidence-manifest.md) | What to declare and why it's a separate file |
| [Casebook](skills/product-research/casebook.md) | All 42 cases |
| [Contract](skills/product-research/contract.json) | The 20 completion requirements |

## Status

The method is stable — it has been run end to end on products across six shapes. Two things are explicitly unfinished:

- **The method files are being translated.** English is the working version; the Chinese originals are under [`i18n/zh/`](skills/product-research/i18n/zh/) and remain the more detailed of the two for now.
- **Report branding is configurable** via `assets/report-header.md`. It ships unbranded.

## Contributing

The most useful contribution is a case. Run the method on a product shape the coverage table calls thin, and when something breaks, write it up in the seven-field format — **including where the rule stops applying.** A case without a boundary won't be merged.

Bug reports on the checker are equally welcome, especially false positives. A checker that cries wolf gets ignored, and an ignored checker is worse than none.

## License

MIT

---
name: last_30_days
version: 1.0.0
description: Recent activity — releases, pricing moves, funding, incidents and user reaction in the last 30 days, each with a date. Loaded by the entry method at step 8.
triggers: []
---

# Recent Changes

⚠️ **This step was skipped three rounds running.** The sub-method existed the whole time; the execution order simply had no step that invoked it. **A method not in the flow does not exist.** (C-24)

**Change is more informative than state.** A feature list tells you what a product is; the last 30 days tell you where it's going.

## What to collect

| Signal | Where | Why it matters |
|---|---|---|
| **Releases** | changelog, release notes, app store version history | Cadence reveals investment level |
| **Pricing moves** | archived snapshots of the pricing page | Quiet free-tier cuts show up nowhere else |
| **Funding** | press page, newsroom, media | Also reveals the story they're telling investors |
| **Incidents** | status page history | Reliability, and whether they publish honestly |
| **User reaction** | reviews and community posts *from this window only* | Sentiment attached to a specific change |
| **Partnerships and integrations** | newsroom | Who they're aligning with is a strategy signal |
| **Official video channel** | the title list | ⚠️ Twice this held capabilities absent from the site and docs (C-05) |

## Rules

**Every item carries a date.** An undated "recently launched X" is unusable — the reader can't tell if it's this month or last year.

**Cadence beats any single item.** Five announcements in two months and five in two years are different companies.

⚠️ **A stopped changelog is worse than no changelog.** Never having one means they don't publish. Stopping means they did and quit. **Record the date of the last entry.**

⚠️ **Don't confuse the vendor's announcements with adoption.** A launch is a claim. Look for reaction to it before treating it as traction.

## Where to look, in order

**Free, first-party, and ordered by how much they reward the effort:**

| Source | Path | What it settles |
|---|---|---|
| Changelog / release notes | `/changelog`, `/releases`, `/whats-new` | Cadence and the direction of investment |
| Newsroom / press | `/news`, `/press`, `/blog` filtered by date | Funding, partnerships, launches |
| Status page history | `status.` subdomain | Incidents, and whether they publish honestly |
| App store version history | Store listing | Release cadence for mobile, plus the last update date |
| Archived pricing page | Web archive snapshots | **Quiet price rises and free-tier cuts appear nowhere else** |
| Official video channel | The title list | ⚠️ Twice this held capabilities absent from the site and docs (C-05) |
| Community and reviews | Filtered to this window | Reaction attached to a specific change |

⚠️ **Missing pages are also readable.** No changelog and no newsroom on an actively sold product means either they don't communicate, or there is nothing to communicate. **Both belong in the report.**

## Separating announcement from adoption

**A launch is a claim.** The vendor saying they shipped something is not evidence anyone uses it.

Look for the gap: a feature announced loudly with no mention in reviews, no questions in the community, and no follow-up content **usually didn't land**. A feature announced quietly that keeps coming up in user posts is the opposite.

⚠️ **The most useful pattern here is repetition.** When one feature gets several videos, several posts and a documentation rewrite in one month, that is where the company is actually betting — **regardless of what the homepage says the product is.**

## Closing

Two sentences: **what changed, and what it implies about direction.** If nothing changed in 30 days, say that — for an actively-sold product, silence is itself a finding.

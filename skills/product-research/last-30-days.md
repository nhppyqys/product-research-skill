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

## Closing

Two sentences: **what changed, and what it implies about direction.** If nothing changed in 30 days, say that — for an actively-sold product, silence is itself a finding.

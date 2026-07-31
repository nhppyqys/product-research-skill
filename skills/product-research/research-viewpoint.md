---
name: research_viewpoint
version: 1.0.0
description: Decides whose decision the report serves — buyer, founder, investor or product manager — and therefore which sections get written in full and which are kept brief. Loaded by the entry method at step 0, before any evidence is collected.
triggers: []
---

# Viewpoint

**Settle this before collecting anything.** The same evidence supports four different reports, and a report that serves everyone serves no one.

⚠️ **Field failure:** a report was delivered with no viewpoint decided. It described the product accurately and answered nobody's question — the buyer couldn't tell whether to buy, the founder couldn't tell whether to build, the investor couldn't tell whether it was a good business.

---

## How to judge it

**Don't make "which viewpoint are you?" your only tool.** Infer it from how the request is worded; ask only when you can't.

| What they said | Viewpoint |
|---|---|
| Which one should we buy · should we adopt this · migration cost · is it enough for us | **Buyer** |
| Is this market worth entering · where do I cut in · what's out there · I want to build something like this | **Founder** |
| Is it worth investing · what's the moat · how's growth · how long can this company last | **Investor** |
| How did they build it · how is this feature designed · what does the UI look like · where do users get stuck | **Product manager** |

**Default when it's ambiguous:** a bare URL plus "analyse this product" is done from the **founder** viewpoint — it has the widest coverage and mostly contains what the others need. **But say at the top of the report which viewpoint you used**, so one sentence can correct you.

Viewpoints can stack, but **there is only one primary** — it decides which sections are written in full and which are kept brief.

---

## What every viewpoint gets

**Six things are never trimmed, whoever is reading:**

- **Category definition** — who pays, what job, what input to what output, where the workflow ends, how it's delivered
- **Company fundamentals** — founding, HQ, headcount *and its direction*, cumulative funding and latest round, valuation, revenue magnitude, customer magnitude, profitability
- **Burden of proof** — every external fact carries a URL, a verbatim quote, and when it was collected
- **A jargon-free opening summary** — what it is, who buys it, how much it earns, where it sits, the opportunity and the risk
- **The feature module table** — every viewpoint first needs to know what the product actually does
- **Relative market position** — proxy measures, with the measure and its distortion stated

⚠️ **Field failure:** one report shipped with the company section entirely blank. Two searches later it held headcount with its two-year trend, revenue, cumulative funding and profitability for the target, plus funding, valuation, headcount and revenue for the nearest competitor. **Those two rows mattered more than every price in the report, and they cost two searches.** Company fundamentals are never "unobtainable" — they are "not fetched".

---

## The four delivery shapes

### Product manager

**Their question: how was this built, what's good, and what could be better.**

**In full:**

- **Feature module table** — business language; what each module solves, for whom, in which tier
- **Core user journey** — signup to first value, step by step, with friction marked. **Friction comes from review quotes, never invented**
- **Interface** — at least 3 real UI images, each with the judgement it supports
- **Differentiated vs table stakes** — the test is "no equivalent on competitors' own sites"; marked by feel doesn't count
- **Information architecture** — how navigation and settings are grouped. **This reveals the mental model they think the user has**
- **Friction list** — concrete sticking points from negative reviews, ranked by frequency
- **Roadmap inference** — from job postings, documentation update times, template libraries and recent commits

**Brief:** funding and valuation · market size · capital efficiency

**Must close with:** **which three product decisions are worth copying, and which three are obvious weak points.**

⚠️ **Field failure:** an early report delivered **API endpoint groupings** — an engineering view. A product manager can't tell from that what the product looks like or how it's used. **An endpoint list is evidence; feature modules are the product.**

---

### Buyer

**Their question: should we buy, which one, what will it cost, and how hard is it to leave.**

**In full:** the nine pricing items and a normalised comparison · gaps between claims and facts · feature comparison against alternatives · **user complaints, not praise** · migration and lock-in cost · support and SLA · security and compliance certifications

**Brief:** market size · funding history (only enough to judge "will this company survive" — profitability and runway) · growth rate

**Must close with:** **who should choose it, who shouldn't, and the three things to verify before signing.**

---

### Founder

**Their question: is this market worth entering, where do I cut in, and what do I build first.**

**In full:**

- **Landscape map** — 5 to 8 direct and indirect players, not the ones the requester named
- **Gap analysis** — 2 to 3 unfilled gaps, each with build difficulty and how long filling it buys you
- **Capital efficiency comparison** — who turned how much money into how much revenue. ⚠️ **The single most revealing cell in field use**: a bootstrapped player with a few million raised, out-earning a heavily funded one several times over, **side by side in one table, shows whether this category makes money at a glance**
- **Unit economics** — infer gross margin and acquisition tolerance from each player's pricing structure
- **Competitive density and contraction signals** — ⚠️ field case: the category leader's public headcount fell by roughly two thirds across two years. **The leader cutting staff to protect margin is hard evidence of a mature, growth-capped, margin-compressed category** — more persuasive than any market-size figure
- **Entry recommendation** — which segment first, which feature first

**Brief:** feature-by-feature comparison tables · migration cost

**Must close with:** **is this category worth entering, which segment to cut in from, and what the first feature should be.**

#### ⚠️ On market size

**The top-down market-size figures available publicly are second-hand consultancy estimates. The quality is poor and the methodologies contradict each other.**

**Rule:** you may cite one, but **it must be labelled a second-hand estimate with its source and year**, and it never becomes a factual statement.

**Prefer verifiable substitutes — these are hard evidence and a market-size figure is not:** each player's revenue and customer counts · headcount trajectories · funding totals and round cadence · the distribution of open roles · changelog velocity.

---

### Investor

**Their question: is this company worth backing, and can it hold its position.**

**In full:**

- **Full company fundamentals** — revenue and its growth, the headcount curve, funding round by round (amount, date, lead, valuation), burn and inferred runway, profitability
- **Capital efficiency** — revenue produced per dollar raised
- **Evidence of a moat, not adjectives** — switching costs, network effects, data advantages, distribution advantages, licence structure. ⚠️ **Field case:** a competitor's permissive open-source licence with tens of thousands of stars was **simultaneously a distribution advantage and a hole in the moat** — any customer with an engineering team can self-host permanently and never pay
- **Market structure** — winner-take-all or long tail, read from head concentration and price dispersion
- **Retention and expansion signals** — does pricing contain a dimension that grows with usage, is there an enterprise tier, is there an API and an ecosystem
- **Risks** — see the method's risk section

**Brief:** feature-by-feature comparison · purchasing recommendations

**Must close with:** **what the core bet is, and under what conditions that bet stops holding.**

---

## One rule that applies to every section

⚠️ **Field failure:** a report delivered a complete price table and a complete site-status inventory. Every cell was accurate. **Not one section said what to do about it.** The reader's words: *"this has no value at all."*

**A list of facts is not analysis.** Every section ends with a "so what". **If you can't write that sentence, the section doesn't belong in the report.**

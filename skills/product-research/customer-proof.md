---
name: customer_proof
version: 2.0.0
description: Who buys it and what they say — ICP in three layers, named customers with published outcomes, and verbatim-quote discipline for reputation. Loaded by the entry method at step 7.
triggers: []
---

# Customers and Reputation

⚠️ **Field failure:** a report's customer section contained "aimed at engineering teams" and three logos. The reader's response: *"which customers are the flagship ones, and what problem did they solve with it — neither is here."* **A wall of logos is not customer analysis.**

Three layers, never collapsed: **inferred profile → named customers → what they actually solved.** The third layer is where the value is.

---

## 1. The profile (inferred)

Three groups, each specific:

**Firmographics** — company size (headcount or revenue) · industry · geography · job title and department · **who decides versus who uses**

**Behaviour** — how they discover and evaluate · purchase process and cycle length · technical sophistication · single decision-maker or committee · how often they switch tools · whether community opinion moves them

**Jobs to be done** — the primary job · supporting jobs · the emotional job (how they want to feel) · the social job (how they want to be seen)

⚠️ "Enterprise teams", "marketers" and "developers" are labels, not profiles. **The test: having written it, could you write one precise piece of ad copy from it? If not, you don't have a profile yet.**

**Sources:** homepage wording (who are they speaking to) · **how the pricing tiers are cut — the tier boundaries are the customer segments they believe in** · the kinds of companies in the case studies · which markets they're hiring sales into.

---

## 2. Named customers (evidence)

Must be **publicly named organisations**, with: name · industry · size · source URL · verbatim quote.

Collection paths, by priority:

1. **`/customers`, `/case-studies`, `/stories`** — most direct. ⚠️ **The absence of this page is itself a conclusion: no institutional customers they can name publicly**
2. **Homepage logo wall** — proves "used it", proves nothing about what it solved
3. **In-depth reviews on rating platforms** — reviewers often state company size and industry
4. **Video reviews and screen recordings** — real workflows, and a screenshot source
5. **Joint case studies and partnership announcements on the vendor's blog**

⚠️ **Field counter-example:** 12 anonymous ratings on an aggregator were written up as "user reviews indicate high satisfaction". **Anonymous ratings are not named customers, and a score built on fewer than 50 reviews cannot carry a reputation conclusion.**

⚠️ **If a case study page exists, read at least three, including the most recent, and record each one's year.** Field case: 31 case studies existed, one was read, and its data was seven years old — nearly producing a conclusion about current performance from stale evidence.

---

## 3. What they solved (the layer that matters)

Each flagship customer answers four questions. **Miss one and it doesn't count:**

1. **What they did before** — the solution being replaced
2. **Where it broke** — a specific pain, not "inefficiency"
3. **What changed after** — a concrete workflow difference
4. **Published numbers, if any** — only what the source explicitly states; marketing adjectives are not metrics

**Good:** *"Ramp automated code-merge with Linear's AI agent and published that 60% of merged PRs are agent-completed."*
**Not good:** *"The company improved collaboration efficiency using this product."*

When 3 and 4 can't be answered, **downgrade to "logo only, no published outcome."** Don't invent.

---

## 4. Reputation: quotes, never summaries

⚠️ **Field failure, and it is the second layer of the same mistake:** the method already banned "writing 12 ratings up as high satisfaction", but the delivery **substituted my summary for the quotes** — "pricing is steep", "steep learning curve", "complex to maintain". The reader can't tell whether that's three people or three hundred, or whether it's been taken out of context.

**A summary is my processing. A quote is the evidence. Give both, quotes first.**

### Required shape

**One — a quote list, at most 10**, each carrying:

| Field | Requirement |
|---|---|
| The words | **Verbatim.** No rewriting, no paraphrasing into a conclusion (a translation may be appended) |
| Source | Platform name + a URL that opens |
| Date | The review date; if unavailable write "undated" |
| Identity signals | Where available: company size, industry, tenure, role |
| Category | **Positive / negative / suggestion** |

**All three categories must appear.** Only negatives is selective; only positives is a brochure. **Suggestions are the most overlooked and the most valuable** — a user's proposed improvement is the product's public backlog.

**Two — a sampling statement**: which platforms were checked, how many reviews each has, which ones you took, and by what rule (most recent / most helpful / longest / lowest-rated). ⚠️ **A quote list with no stated sampling rule is a highlight reel.**

**Three — takeaways built on those quotes**, each traceable to specific ones:

- Recurring friction, **with a frequency** (M of N quotes mention it)
- Anywhere it contradicts a vendor claim (feeds back into the claims section)
- **Recurring and unaddressed** — that's a category gap (hand it to the landscape method)
- What the positives repeatedly praise = the moat candidate

### ⚠️ Rating platforms don't measure the same thing

⚠️ **Hit twice, same pattern:** one product scored 4.6 on an invitation-heavy platform (188 reviews) while the low-star band on a complaint-driven platform read "scammers", "fraudulent company". Another scored 4.7 on one and 2.0 on another.

**This is not contradictory data. The two kinds of platform measure different things:**

| Platform type | Actually measures | Source of bias |
|---|---|---|
| **Vendor-invited review sites** | **Product satisfaction** | Many reviews are solicited or incentivised; sample skews satisfied |
| **Complaint-driven sites and low-star bands** | **Commercial experience**: billing, cancellation, refunds, support | Self-initiated complaints; sample skews harmed |

**Rule: check both, and do not reconcile them.** The gap is the finding — **high product scores plus low commercial scores means the product works but the commercial conduct is aggressive.** That's a conclusion, not noise.

### ⚠️ Group quotes by time, not only by sentiment

⚠️ **Field case:** five-star reviews clustered in 2019–2023 ("tripled ROAS", "prints money"); one-star reviews clustered in 2023–2025 (billing, cancellation, refusal to refund).

**That is not a random distribution. It is the trace of a commercial strategy changing.**

**Rule: sort the quotes by year.** Negatives concentrated recently while positives concentrate early means something changed — **a conclusion only visible by time, and completely hidden by sentiment columns.**

⚠️ **App store reviews may be versioned rather than dated.** Field case: the most recent 100 reviews carried version numbers and no dates. **Sort by version and map versions to approximate dates**, or this rule is unusable.

### ⚠️ A lifetime average hides a recent collapse

⚠️ **Field case:** an app store showed 4.73 across 33,980 reviews. **The most recent 100 averaged 3.17, with 34 one-star.** The headline was held up by a decade of history.

**Report the lifetime score and a recent sample separately.** A large gap is itself the finding — **and it will converge over time, which means an unaddressed problem shows up as a falling score.**

### Where to look

Rating platforms · communities and forums · **official feature-request boards** (the richest source of suggestions) · comment sections under video reviews · launch-day discussion threads · app store reviews.

⚠️ **High-frequency questions on the official forum are the product's real friction points** — earlier and more specific than any rating site. For open-source products, the issue-label distribution is the equivalent.

### Discipline

- One anecdote is not a sentiment. **Give a frequency or don't state a conclusion.**
- Fewer than 50 reviews can't carry a reputation conclusion, but **a single specific complaint is still usable as a lead** — label it as single
- Marketing adjectives are not metrics
- **Never quote only negatives.** If you can't write positives, you haven't looked hard enough

---

## 5. Closing

- **A one-line portrait of the typical customer** — the kind you could turn into ad copy
- **The most convincing flagship customer and their published result**
- **The three things customers care about most**, ranked by complaint frequency
- If customer evidence is thin: **state exactly which pages and platforms were checked, and what came back**

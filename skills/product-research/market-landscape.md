---
name: market_landscape
version: 1.0.0
description: Landscape scan — assembling a real peer set, layering the category before comparing, measuring relative scale with free proxies, finding unfilled gaps, and ranking threats. Loaded by the entry method at step 6.
triggers: []
---

# Landscape

**The products the requester named are a sample, not the set.** ⚠️ Field failure: a request named five tools, the report compared exactly those five, and the actual question — "what's in this category?" — went unanswered.

---

## 1. Assemble 5–8 players

**Direct** (same buyer, same job, substitutable) — at least 4. **Indirect** (upstream, downstream, or solving the same problem a different way) — at least 2.

Discovery paths, in order of yield:

1. **Category-agnostic search** — describe the job, name no brands. "social media scheduling tool for creators", not "Buffer competitors"
2. **Reverse out of known players' comparison pages** — `/vs/…` and `/alternatives` are the competitors *they* acknowledge
3. **Open-source ecosystems** — repository search by stars surfaces players no listicle covers
4. **App stores and Product Hunt categories**
5. Third-party roundups — **use them to discover names only, never to fill cells**

⚠️ **Field lesson:** searching only "[product] competitors" returns SEO directories and listicles, and finds almost no actual product sites.

---

## 2. Layer before comparing

⚠️ **Field failure:** one round split a category into three layers (get content out / make content / do both) and judged where value was migrating — **the most valuable section in that report.** But the method had no such step, so **the next round it vanished entirely**, leaving a list of feature gaps. (C-20, C-24)

**Once you have the players and before you compare them, ask: are these doing the same job?**

**Layer by position in the customer's workflow, not by feature.** Use the input→output pair:

- Input is **existing content**, output is **published** → distribution layer
- Input is **raw material or an idea**, output is **finished content** → creation layer
- A product that swallows both → integrated layer

**Answer for each layer separately: is it expanding or contracting, and on what evidence?** (Has price been driven to zero? Is the head retreating? Is there an open-source substitute? How is the best-funded player doing?)

**Only then the question worth asking: which layer is value migrating toward?**

### ⚠️ Layer conclusions overfit easily — use one ruler

⚠️ **Field failure, second order:** the three-layer conclusion above was "distribution contracting, creation retreating, integrated layer growing". **Re-checked a day later with fresh data, one of the three survived.**

The cause was specific: **all four data points supporting "integrated layer growing" sat beyond rank 220,000 — and this very method classifies long-tail movement as noise.** The conclusion was supported by evidence the method itself forbids.

**Three hard constraints:**

- **Every layer needs at least one anchor inside the reliable range** (roughly the top 50,000). A layer held up entirely by long-tail players gets **"insufficient evidence"**, not a trend
- **Never use trend for one layer and magnitude for another** — one ruler for all layers, or you will find the answer you wanted
- **When a layer splits internally, write the split** (some players advancing, some retreating). **Do not compress it into one tidy sentence**

⚠️ **The test: if a layer's conclusion collapses once you remove the long-tail players, it was never true.**

---

## 3. What to get for each player

Name what you couldn't get; never leave a blank unexplained.

| Field | Where |
|---|---|
| Name and site | — |
| **Founded / funding stage** | Press, company databases, `/about`, the legal entity named in the privacy policy |
| **Headcount (with a date)** | Professional networks, careers page, team page, company databases |
| **Revenue magnitude** | Disclosures, press, third-party estimates (**label them as estimates**) |
| Billing model and entry price | Their own pricing page |
| Target customer + one-line differentiator | Their homepage, in their words |

**"They have funding" is noise. "$20M from a named fund in March 2025 at a $215M post-money" is information.**

---

## 4. Capital efficiency

Put cumulative funding and current revenue in one table and read dollars-of-revenue-per-dollar-raised.

⚠️ **Grade every cell.** A table mixing first-party disclosures with third-party estimates and presenting both flat is exactly the asymmetry problem (C-14). **Mark each cell's provenance**, or the table is not usable.

⚠️ **Headcount trends need a consistent source at both ends.** Field case: a third-party estimate showed 226 → 74, which reads as a two-thirds cut; the company's own published roster showed 76. The direction was right, **but the "226" never had a first-party source.** A halving computed across two different sources is not hard evidence.

---

## 5. Relative scale with free proxies

**Precise share data is unavailable. That does not license omitting the analysis.** Use obtainable proxies for *relative position* and state the measure and its limits. **Omitting the section is negligence; estimating with a stated method is professional.**

### Domain ranking

Free, keyed on nothing, reproducible. Returns a daily time series.

### ⚠️ Know what it measures before concluding from it

⚠️ **Field lesson: it was once used as a traffic metric, and the conclusion drawn from it did not hold.**

Domain rankings of this kind average several sources, and the sources measure different things: **real page visits** from browser telemetry, **DNS queries** from multiple resolvers (**which include non-browser traffic**), and **backlink counts** (unrelated to visits).

**So it is an aggregate prominence ranking, not traffic.**

**What it can do:** judge magnitude (4,000th vs 20,000th vs 200,000th vs 1,000,000th are real differences) · compare players within one category · read mid-term movement at the head.

**What it cannot do:**
- **Convert to visits.** It cannot yield "300k monthly visits" and is not interchangeable with traffic estimators
- **Read short-term long-tail movement.** ⚠️ Field case: "dropped 250,000 places in 30 days" was treated as decline — the product sat at rank 1,210,000, where that movement carries no signal. **Only the magnitude survived**
- **Separate humans from machines.** ⚠️ A claim that it "systematically underestimates pure API products" was also retracted — with DNS-based sources aggregating by registered domain, API subdomain requests are likely already counted, so the direction is unknown

**Every report using it carries a sentence stating that it is an aggregate prominence ranking rather than traffic, and whether the conclusion rests on magnitude alone or also on movement.**

⚠️ **Enterprise-sales products carry an extra distortion**: customers arrive through sales and live inside an app subdomain, so the marketing site understates real scale. **But that distortion applies equally to every player in the category, so relative position still reads.**

### Other free proxies

**Pick by shape; get at least two. One proxy never supports a conclusion.**

| Proxy | Reflects |
|---|---|
| Domain rank and trend | Attention share |
| **App store review counts** | A floor on the user base |
| Repo stars / forks / contributors | Developer attention (open source only) |
| Package download counts | Real integration-side usage |
| Third-party revenue estimates | Magnitude — ⚠️ label as estimate |
| Funding totals and rounds | Capital deployed |
| Vendor-claimed user counts | ⚠️ Claim only |

---

## 6. Market size

**Never copy a consultancy's TAM figure as fact.** The methods contradict each other and the numbers are routinely inflated.

**Three acceptable approaches:**

1. **Bottom-up floor** — countable paying players × their revenue magnitude = a floor on the served market. **Say it's a floor, not a TAM**
2. **Cite a second-hand TAM but demote it** — name the source, year and method, write it as "X estimates", and keep it out of the main conclusion
3. **Ask a question you can answer** — instead of "how big is this market", ask **"what do the top few players earn together"** and **"is that growing or shrinking"**, which funding cadence, headcount changes and rank trends can actually address

### How to express share

**Never write "holds X%" without an official or authoritative source.** Write something defensible instead:

> "Among 10 comparable players it ranks 5th by attention proxy; the leader is roughly two orders of magnitude ahead. **By this measure it is long-tail, not head.**"

⚠️ **State the direction of distortion alongside.** Saying which way a proxy is biased is more honest than a falsely precise percentage — **and when you can't determine the direction, say that.**

---

## 7. Contraction and expansion signals

- **Direction of headcount change** beats the absolute number — with the source-consistency caveat above
- **What roles are open** — hiring sales means pushing growth; engineering only means fixing the product; hiring nobody means steady state or contraction
- **Changelog cadence** — weekly means active investment; quarterly means maintenance; stopped for six months means effectively abandoned
- **New entrant rate** — any new launches or new funding into this category in the last 12 months

---

## 8. Gap analysis (the core output for the founder viewpoint)

Find **2–3 gaps no current player fills**. Each needs four things:

1. **What's missing** — a specific capability or scenario, not "the experience is bad"
2. **Why it matters to users** — evidenced pain, not speculation
3. **Build difficulty** (low / medium / high) — **and what makes it hard**
4. **How long filling it buys you** — how fast incumbents could match it

**Where gaps come from:** complaints that recur and nobody addresses · the same missing piece across everyone's docs · the dimension every pricing page avoids · repeated "not currently supported" in FAQs.

⚠️ **When there is no gap, say "this category has converged on features; differentiation is not at the feature layer."** That is a valuable conclusion, and far better than inventing three.

---

## 9. Threat ranking

Rank the top three by threat level on three inputs: **resource advantage** (funding and team size) · **feature overlap** with the target · **iteration speed** — read from changelog and release history, not from how fast they say they move.

---

## 10. Closing (required — do not stop at facts)

- **Is this category worth entering** — one sentence, two supporting pieces of evidence
- **If yes, from which segment**
- **What the first feature should be**
- **Who to watch**

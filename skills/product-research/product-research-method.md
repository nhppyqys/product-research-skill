---
name: product_research_method
version: 2.0.0
entry: true
description: The method for researching a product or a competitive landscape, and the only entry point to this pack. Any request to analyse a product, compare competitors, judge whether a market is worth entering, or decide whether to buy starts here. It pulls in the viewpoint, landscape, voice-of-customer and recent-changes sub-methods itself, at the steps where they are needed — the caller never has to choose.
triggers: [analyze this product, product research, competitor analysis, competitive analysis, pricing, market landscape, is this worth building, should we buy, evaluate this product, teardown]
---

# Product Research Method

**Every rule here came from a failure. The failures are recorded in `casebook.md`, referenced as C-nn.**

---

## Read this first (30 seconds)

**This document is the only entry point.** Any product research, competitive analysis, or market judgement starts here.

Four sub-methods hang off it. **You never have to choose between them and nothing is matched by keyword — this document names what it needs, at the step where it needs it:**

| At this step | Load | It owns |
|---|---|---|
| Step 0, before anything | `research_viewpoint` | Whose decision this is (buy / build / invest / manage), which sections get written in full |
| Step 6, landscape | `market_landscape` | Peer gates, layering, scale proxies, gaps, threat ranking |
| Step 7, reputation | `customer_proof` | ICP, verbatim-quote discipline, how review platforms are biased |
| Step 8, changes | `last_30_days` | Recent activity, with dates |

**Only this document is keyword-routable.** The four sub-methods have empty triggers on purpose: they used to compete with this one for words like "competitors", "pricing" and "market", and the same request could land on a sub-method and bypass the whole flow.

**So the usage is one sentence: give it a URL (or a product name plus a viewpoint), load this method, follow the order below.**

---

## Judge the shape first

⚠️ **Known risk:** the field cases skew toward self-serve SaaS and developer tools — products that happened to have indexed doc sites, usage-based pricing, and enough reviews on some platform. **Change the shape and half the evidence channels break.**

**First thing you do: judge the shape, then pick channels accordingly.**

| Shape | How to recognise it | What you can get | What you can't — ask this instead |
|---|---|---|---|
| **Self-serve SaaS** | Numbers on the pricing page, self-signup | Full pricing teardown, unit economics, user journey | — |
| **Developer tool / API** | API docs, an SDK or a package | Endpoint structure, rate limits, download counts, repo signals | UI screenshots often absent (there is no UI) |
| **Open source / open core** | Public repo and a licence | **The LICENSE locates the paywall**, licence change history, repo signals, self-host vs cloud boundary | Revenue is near-unknowable — ask "where is the paywall drawn, and why does anyone still pay" |
| **Enterprise sales** | "Contact sales", `/enterprise`, `/partners` | Buying path, compliance certifications, case studies | Pricing teardown is mostly empty → see below |
| **Consumer app** | Mobile app, volume in the app stores | Review counts and ratings, release cadence, chart position | Docs are usually thin; infer modules from store copy and screenshots |
| **Marketplace / platform** | Two sides, a developer ecosystem | **Supply-side velocity**, category structure, take rate (it's in the API docs) | **The demand side is inherently unmeasurable** — say so; top-level paths may belong to sellers |

### Enterprise-sales playbook (when pricing is unavailable)

**Do not skip the business-model section just because there is no pricing page.** Ask differently:

- **Buying path** — demo required? POC? contract length? Infer it from the fields on `/enterprise` and `/request-demo`. A form asking for company size, budget and timeline tells you how they segment.
- **Third-party marketplaces** — AWS / Azure / GCP Marketplace often carry **public contract pricing and billing units**. This is the most overlooked public price source in enterprise software.
- **Review sites' pricing tabs** — G2, Capterra and TrustRadius collect user-reported price ranges.
- **Compliance pages** — SOC 2, ISO, HIPAA, GDPR. **Which certificates they hold tells you which industry they sell to.**
- **Job postings** — the industry their solution engineers cover and the regions they're hiring sales into is the market they're attacking.
- **Case studies** — enterprise products usually *do* have detailed ones (it's their only public sales material). Read them and back out deal size and implementation time.

### Open-source / open-core playbook (a branch of step 3)

**The pricing teardown starts with the full LICENSE, not with the pricing page.**

1. **Read the whole LICENSE file**, not the licence name GitHub displays — **the name alone can't tell you whether there are per-directory exceptions**. Grep for `Portions`, `directory`, `Commercial`. Open-core products state **exactly which folders are commercially licensed** — that is the paid feature list (**C-32**).
2. **Check the LICENSE commit history** for the direction of travel: tightening (open → BSL/commercial) or loosening (commercial → MIT). ⚠️ **Licence changes hide inside ordinary refactor commits and the title never mentions them** (**C-34**).
3. **Watch for a 301 from the GitHub API** — it means the repo was renamed or moved, which often accompanies a change in positioning (**C-33**).
4. **When the code is fully open, the paywall sits on the hosting boundary.** Compare the commercial domain with the repo's `homepage` field; they are often "cloud product" and "self-hosting docs" as two separate sites (**C-35**).
5. **Strip bots from repo metrics** and look at the top-10 commit share rather than the contributor count (**C-36**).

⚠️ **A clean `robots.txt` means something different here**: growth runs through the repo and the docs, not through discount landing pages, so there is nothing to hide — **don't read it the way C-03 reads it** (**C-37**).

### Marketplace / two-sided playbook (a branch of steps 2 and 3)

**Single-side data is meaningless, but the two sides are wildly unequal in measurability. Accept that first.**

1. ⚠️ **Top-level paths may belong to sellers.** `/pricing` and `/security` can both return 200 and both be storefronts. **The status code cannot tell you.** Check the `<title>` and page structure of every 200 to establish ownership (**C-38**).
2. **Supply-side size is not in the sitemap.** Look in the `Sitemap:` declarations of `robots.txt` for an **RSS or new-arrivals feed**, and compute `items ÷ timespan` for a listing velocity — **one of the few hard numbers obtainable from outside** (**C-39**).
3. **Take rate lives in the API docs → help centre → seller agreement → and only then the pricing page.** Grep `fee`, `payout`, `commission`, `take rate`. ⚠️ **A single percentage is not the total take** — confirm which scenario it applies to (**C-40**).
4. **State explicitly that the demand side was not measured.** Total site traffic mixes buyers, sellers and seller-driven storefront visits; **it cannot stand in for buyer volume** (**C-42**).

⚠️ **The correct shape of the sentence**: when supply is growing and demand is unknown, write *"the supply side is expanding rapidly; the demand side could not be verified."* **Never compress that into "the platform is growing."**

### When a channel breaks: three fallback ladders

**Documentation index** (try in order, don't assume the first exists):
`llms.txt` → `sitemap.xml` → doc-site sidebar → OpenAPI/Swagger spec → public Postman collection → the repo's `docs/` directory → help centre search and category pages → the vendor's YouTube playlist titles

**Reputation sources** (ordered by reachability; the first two are frequently blocked):
G2 / Trustpilot (often 403) → **SourceForge / Capterra / GetApp** (usually reachable) → Product Hunt discussion → Reddit and Hacker News → **comment sections under YouTube reviews** → official community or Discord → app store reviews → **the vendor's own FAQ and troubleshooting page titles** (a fault list they wrote themselves)

**Scale proxies** (pick by shape, get at least two):
Domain rank (works for anything with a website) → app store review count → repo metrics → package downloads → third-party ARR estimates → funding totals

**Judge the shape first, then pick the channel. One channel failing does not mean the thing is unverifiable.**

---

## About the cases in this method

**Every "⚠️ field test…" is a record of how something once went wrong, not a checklist of things the target product should have.**

Reading "one product had 25 visual templates" does **not** mean go find 25 templates. It means: the composition of a template library tells you who the vendor thinks the customer is.

### ⚠️ Examples bleed into reports as if they were findings

**Examples contaminate output by nature** — the more concrete and finding-shaped they are, the more likely they are carried off wholesale. Reproduced twice in cross-model testing; see **C-28**.

**Hard rules:**

- **Every status code, path, number and company name in the report must trace back to evidence actually collected this round.** If it can't, delete it. **Never keep something because it "looks plausible."**
- **Be especially careful with product names that appear in this document** — they are the easiest thing to carry off unconsciously.
- **Run `node scripts/check-report.mjs <report.md>` before delivery.** It verifies the contract step by step and flags bleed, internal jargon, work-log phrasing and inline HTML.

⚠️ **Do not simplify this into "these names may never appear."** A hard ban forces authors to delete real evidence, which is worse than bleed (see C-28's "does not apply when").

**The test is the evidence, not the name**: is the data attached to that name from this round, or lifted from this document? **Keep the former, delete the latter.** The checker only surfaces them for review; it does not make that call for you.

**The method is a list of questions. The cases are only evidence for why the questions are worth asking.**

---

## Execution order

Rules tell you right from wrong; the order tells you how to work. **Follow it. Don't skip.**

When a channel is blocked at some step, use that step's own fallback ladder — **do not skip the step.**

```
0   Viewpoint          buyer / founder / investor / PM
                       → load research_viewpoint FIRST. Do not proceed until this is settled.
                       ↓ it decides which later sections are written in full

1   Path space         sitemap.xml / llms.txt / robots.txt  ← BEFORE any probing
                       ⚠️ Field test: 20 standard paths probed on a bare domain, 19 came back
                       404 — looked like a one-page site. The sitemap had 334 URLs. Probing
                       before you have the index produces a conclusion that is exactly wrong. (C-01)
                       ⚠️ llms.txt comes in three species: marketing copy / doc index / agent
                       routing contract. Identify which before reading it — the marketing kind
                       belongs in the claims list, not in the facts. (C-41)

2   Site inventory     Probe against the real path space from step 1, plus standard paths and subdomains
                       Try apex and www, follow redirects, record 200 / 404 / blocked separately
                       ⚠️ Multi-locale sites prefix paths (/en/pricing, /zh/pricing);
                       bare paths will all 404
                       ⚠️ On marketplaces a 200 may be a seller's storefront (C-38)

2.2 robots.txt         Read the Disallow list — the densest intelligence file on most sites
                       What it doesn't want indexed is usually its real commercial behaviour
                       ⚠️ Read the list; do not crawl what it disallows

2.5 Open the index     Every page in the index touching pricing, quota, limits or error codes
                       ⚠️ Listing it is not reading it — the most expensive trap here (C-07)

3   First-party        pricing → docs → customers → terms → changelog → status
                       Record URL + verbatim quote + timestamp for every fact
                       ⚠️ Branch by shape: open source → LICENSE first; marketplace → API docs first

3.5 Product manual     Feature modules in business language + user journey +
                       ≥3 UI screenshots + differentiated-vs-table-stakes call
                       ⚠️ An endpoint list is evidence; feature modules are the product

4   Claims list        Copy every homepage claim, take each back to step 3's evidence
                       List conflicts explicitly

5   Company            Funding / headcount / revenue, then triangulate
                       Three independent signals before anything is called high confidence
                       ⚠️ Read the JSON-LD even on a 404 — it often carries headcount (C-02)

6   Landscape          Category-agnostic queries for 5–8 players → open each one's own site
                       → load market_landscape (layering, gates and scale rules live there)
                       ⚠️ Layer before comparing: are these players doing the same job?
                       ⚠️ Confirm the deliverables are comparable before comparing prices

6.5 Scale              Domain rank + 30-day trend for every player → relative position
                       ≥2 proxy dimensions; state the measure and the direction of distortion
                       ⚠️ Every layer needs an anchor inside the reliable range; a layer held
                       up only by long-tail players gets "insufficient evidence" (C-12)

7   Reputation         ≤10 verbatim quotes, positive / negative / suggestions, with source and date
                       Quotes first, then the summary; takeaways must point back to specific quotes
                       → load customer_proof
                       ⚠️ Never substitute your summary for the quotes. Never write "to be tested."

8   Recent changes     Last 30 days: releases, pricing moves, funding, incidents, user reaction
                       → load last_30_days
                       ⚠️ Skim the official video channel — twice it held capabilities that
                       appeared nowhere on the site or in the docs (C-05)

9   Longitudinal       Compare archived snapshots of the pricing page and homepage copy over time

10  Write              Start with the jargon-free opening summary ← write this first
                       End every section with a "so what"; mark confidence; state evidence gaps
                       Collection mechanics (status codes, endpoints, probes) go in an appendix or out
```

---

## Completion standards → `contract.json`

⚠️ **Failed twice, same disease.** The order existed, but work stopped at steps 5 and 6 and whole sections said "not done this round" — **and "not done" was accepted as delivery.** Moving the standards into a table here didn't fix it either: screenshots were skipped for 2 rounds, recent-changes for 3, and one round dropped the entire claims section without author or reviewer noticing.

**The root cause isn't unclear standards. It's that prose has no enforcement.** This document holds ~69 hard requirements across ~63 sections. Expecting someone to check them from memory is a guaranteed miss, not an accident.

**So the standards are not written here.** Their single source of truth is `contract.json`, executed by code:

```bash
node scripts/check-report.mjs <report.md> [--manifest <evidence.json>]
```

⚠️ **Do not restate the contract's numbers in this document.** A duplicated copy always drifts — that has already happened. **To change a standard, change `contract.json`.**

**This document answers "why". The contract answers "is it enough".**

### The evidence manifest

Some requirements can't be read off the delivered text: how many paths you probed, how many case studies you read, whether you skimmed the video channel. **Those check the research process, not the artifact, and only the researcher can declare them.**

The manifest is a sibling file, `<report>.evidence.json`, and **never ships with the report**:

```json
{
  "shape": "marketplace / two-sided",
  "pathSpace": ["sitemap.xml: 223 URLs", "robots.txt: 7 Disallow", "llms.txt: 404"],
  "probedPaths": ["/pricing 200", "..."],
  "caseStudiesRead": ["...2026-05", "...2026-03", "...2025-11"],
  "videoChannelChecked": "youtube.com/@xxx, 25 titles skimmed",
  "skipped": { "case-studies": { "reason": "absent", "note": "no case study page" } }
}
```

⚠️ **`shape` must be declared explicitly.** Shape-specific steps fire from this field, never from guessing at the report text — guessing produced false alarms, **and false alarms teach people to ignore alarms.**

**Skipping a step needs one of three reasons. Anything else counts as unmet:**

| Reason | Meaning |
|---|---|
| `blocked` | Every fallback was tried and failed — say which, and what each returned |
| `absent` | The thing doesn't exist (no mobile app → no app store reviews) |
| `incapable` | The environment genuinely can't — **you must have tried, and must quote the command and the error** |

⚠️ **`incapable` was abused for five straight rounds**: the screenshot slot was empty in five reports, all justified as "no rendering capability in this environment", **and it had never once been attempted.** The sixth round tried and it worked immediately. **"The environment can't" is a claim that requires evidence, not a free pass.**

⚠️ **"Ran out of steam" and "out of budget" are not on the list.** If the budget is genuinely short, **narrow the scope (research one fewer competitor) rather than doing every item halfway.**

---

## Three gates

**Gate A (before starting):** Is the viewpoint settled? Is the site inventoried? **Have you opened every index page touching pricing or quotas?** Do not start searching until all three are true.

**Gate B (before writing):** Are the company fundamentals filled in? Did anything unobtainable get triangulated? Was every claim checked against evidence? Did you open each competitor's own domain?

**Gate C (before delivery):** Run the checker. **Any "to be tested" sends you back to step 7.**

---

## Who you are writing for

⚠️ **Field failure, verbatim from a reader:** *"a lot of what you write, people can't understand."*

Early reports contained `NOASSERTION`, `llms.txt`, "API endpoint grouping", "status code trichotomy". **That is the language of collecting evidence, not the language of the reader.** Readers are product managers, investors and business owners. They want a judgement, not your construction log.

**One — any technical term gets a plain-language gloss on first use.**

> ❌ "GitHub returns `license: NOASSERTION`"
> ✅ "Its licence is one GitHub can't even identify — because it isn't a standard open-source licence but a custom restrictive one that **stops others from redistributing the code commercially**"

**Two — the report opens with a summary containing no jargon at all**, short enough to read in a breath, telling someone with no technical background: what this is, who buys it, how much money it makes, where it sits, and the single biggest opportunity and risk.

**Three — collection mechanics don't go in the body.** How you probed paths, which endpoint you used, what the status code was: appendix, or nowhere. **The body carries findings and judgements only.**

⚠️ **The test:** hand the report to someone non-technical. Can they repeat back three conclusions? If not, you wrote it for yourself.

### Readability rules

**Each of these corresponds to a real complaint.**

**1 — Embed images; never give paths.** ⚠️ 19 screenshots were located and the report listed their file paths. Those paths were 404s externally. **A list of dead links presented as evidence is worse than no evidence.** Embed it (verify the URL returns an image type) or write "no image available". (C-21)

**2 — Confidence markers stay out of the body.** ⚠️ A body full of ⚠️ and "third-party estimate / unverified / medium confidence" forces the reader to navigate your epistemics to reach the content. Put grades in an appendix; in the body use plain qualifiers ("a third-party database puts headcount at…").

**3 — No revision history in the body.** ⚠️ "v2 got this wrong", "an external reviewer pointed out", "my previous version said…". That's a construction log. (C-23)

**4 — Every table needs its "so what".** ⚠️ A section that drops a table and moves on drew: *"this is written with no beginning and no end, I don't know what you're telling me."* State the conclusion the table supports.

**5 — Never put opposite sign conventions in adjacent columns.** ⚠️ A rank column where smaller is better sat next to a change column where bigger is better. The reader read "+159,430" as a decline. **Write the before and after values plus the direction in words.** (C-26)

**6 — Length is not a constraint.** ⚠️ Nobody asked for a short report, yet three rounds pulled content in, and one round skipped six modules with "for reasons of length" while two thirds of the output budget remained. **If there's more to say, write in batches.** (C-25)

---

## The burden of proof is on the number

**Any external fact needs three things: a URL, a verbatim quote, and when it was collected.** Can't produce all three? Downgrade it — don't delete the section.

### Four ways of writing that count as no evidence

1. A number with no source
2. "Reportedly" / "it is said that" with no attribution
3. A third-party estimate presented as a disclosed figure
4. A plausible-looking URL that was never opened (**C-31**)

### ⚠️ Evidence standards must be symmetric

⚠️ **Field failure:** every number about the target product was required to carry a verbatim quote and a confidence grade, **while competitor rows took third-party estimates as fact.** Two standards in one report.

**Being strict with the familiar and loose with the unfamiliar is the easiest bias to fall into and the hardest to self-detect.** Competitor rows get the same treatment: source, estimate-or-disclosed, date. If you can't, write "unverified". (**C-14**)

### ⚠️ Grade every conclusion; "not found" is not "does not exist"

| Grade | Requires |
|---|---|
| **Observed fact** | Directly seen, quotable |
| **High confidence** | ≥3 independent signals pointing the same way |
| **Medium confidence** | 1–2 signals, no contradiction |
| **Low confidence** | Inference from absence alone |

⚠️ **Field failure:** "effectively a one-person company" was written from a missing team page, and an entire risk section was built on it. **Absence of a team page is not evidence of absence of a team.** (**C-11**)

### ⚠️ When you can't get official data, triangulate

Don't stop at inference. Independent free channels, **chosen by shape**:

- **Package registries** — the publisher account hints at who does the engineering; download counts are a floor on real usage
- **Repo signals** — public org members, commit authorship, licence, release cadence
- **App stores** — review counts are a floor on the user base; release dates give cadence
- **Archived snapshots** — how the pricing page and positioning changed over time

⚠️ **This kit is shape-dependent, not universal.** On one consumer SaaS there was no package and no locatable org — **the whole channel set was dead.** Fall back to app-store data, hiring platforms and press coverage. (**C-11**)

---

## Site inventory

**The target's own pages are the densest evidence source. Exhaust them before going outward.**

⚠️ Field counter-example: one round read 2 pages (one of them an aggregator) and **burned the entire external search budget**. The order was wrong, not the budget. (**C-09**)

Standard paths, at minimum:

```
/pricing  /docs  /changelog  /customers  /security  /careers  /about
/status   /terms /integrations  /blog  /api
docs.  api.  developers.  help.  status.   (subdomains)
```

### ⚠️ Read the 404 page too

SEO plugins inject the `Organization` JSON-LD into **every** page template, 404 included. **A probe of a path that doesn't exist can hand you most of the company section.** Search any fetched HTML for `application/ld+json` before discarding it. ⚠️ The `description` field is vendor-written — that's a claim, not a fact. (**C-02**)

### Status codes come in four kinds

- **301 / 308 = it exists.** Try apex and www, follow to the end, record the final URL.
- **401 / 403 / 429 = blocked, not absent.** Switch channels before judging.
- **Only 404 is absence** — and check aliases first (`-of-service`, `-policy`, `legal/` prefixes, locale prefixes) before concluding anything (**C-10**).
- **200 is not "complete."** Prices and quotas are commonly script-rendered; a page can return 200 with a full body and still contain zero numbers. **Re-confirm key pages after rendering** (**C-04**, **C-08**).

### ⚠️ Static HTML ≠ what's on the page

**Any conclusion of the form "page X does not contain Y" must be confirmed after rendering.** Interactive controls — dropdowns, tier switches, monthly/annual toggles, region pickers — **must each be operated**; looking at the default value only is looking at one seventh of the page. (**C-04**)

### robots.txt is the densest intelligence file

Its `Disallow` list is what the vendor doesn't want indexed: **promotional landing pages, channel-specific pricing, trial funnels, retired-but-live products, internal tools.** Read it against the public price — the gap is the channel discount, and **the conclusion for a buyer is "ask for the discount before you start negotiating."**

⚠️ **Read the list; don't crawl what it disallows.** The URL names are usually enough. ⚠️ A clean list means different things for different shapes (**C-03**, **C-37**).

### Absence is evidence

Group the 404s by meaning: **no pricing page → enterprise sales or not yet priced; no security/compliance page → not selling into regulated industries; no status page → no availability commitment; no careers page → not expanding.**

### Multi-locale coverage is evidence too

⚠️ One product's sitemap had 20 locales, but only two carried the full product (solution pages, blog, core features); the other 18 had only free tools. **The real market is two languages; the rest exist for search acquisition.** That reading is more reliable than the "200+ countries" on the homepage, because it's derived from what they actually built.

---

## The product manual

⚠️ **Field failure, verbatim:** *"not even the most basic product capability structure or feature-module description is here."*

### 1. Feature module table (required)

**By module, not by selling point.** Each row: name · what object it manages · concrete capabilities · which tier it's in.

⚠️ **The most reliable source is the endpoint grouping in the API docs** — it reflects the real product structure, whereas marketing-page grouping is arranged for narrative.

### 2. Core user journey (required)

From signup to first value, step by step. **Friction points must come from real user quotes, not from imagination.** ⚠️ "Authorisation drops and has to be reconnected after platform updates" is a real second-step friction, and more informative than any feature list.

⚠️ **The vendor's own FAQ titles are a fault list they wrote themselves** — "my screen is blank", "the option in the tutorial doesn't exist", "it says published but nothing appeared". Free, first-party, and specific.

### 3. Screenshots (required, ≥3)

**Take them yourself first; go looking second.**

1. **Open a browser and capture** — homepage, pricing, feature pages, case studies are all capturable
2. **Headless mode writes PNGs to disk** — an image that only exists in a session can't be embedded
3. **Doc-site / help-centre images** are real UI, and beat marketing renders
4. ⚠️ **Behind a login wall, pull frames from the vendor's own videos** (**C-05**)

⚠️ **Marketing-page UI is curated — label it as such.** Which screen they put on the homepage is itself intelligence: **the metric they want you to judge them by is the one on the first screen.**

⚠️ **Copyright:** screenshot libraries are copyrighted and have no API — they are a human reference, not a data source, and must not be forwarded to a client. Competitor UI screenshots for comparative commentary are generally fair use, but **link, don't rehost**, and always cite the source page.

### 4. Maturity assessment (required: one sentence plus two supports)

**Three grades only: production-ready / early but usable / demo stage.** Judge on: documentation depth and last update · API and webhooks with versioning · status page and incident history · **security and compliance pages** (having them means enterprise customers) · **changelog cadence** — weekly / monthly / quarterly / **stopped** (stopped is worse than never having had one) · mobile release cadence and review counts · enterprise capabilities (SSO, SAML, SCIM, audit logs, permission models, SLAs).

**Close with: which single item best indicates maturity, and which claimed capabilities have no counterpart in the docs.**

### 5. Differentiated vs. table stakes (required)

⚠️ **The test: it only counts as differentiated if you looked for the equivalent on competitors' own sites and couldn't find it.** Anything marked differentiated by feel is worthless.

---

## Category definition: five slots

**Fill these five before you say a single competitor's name.** Get them wrong and every peer you pick afterwards is wrong.

| Slot | The question |
|---|---|
| **Who pays** | Not who uses it — who signs. Often different people |
| **What job, on what object** | "Scheduling social posts" is a job; "a post" is the object |
| **Input to output** | What goes in, what comes out finished |
| **Where the workflow ends** | Does it stop at publishing, or continue into replies and analytics? |
| **How it's delivered** | SaaS · API · self-hosted · app · marketplace |

⚠️ **The narrowest purchasable market is the category**, defined by these five — not by an industry word or a technology word. When buyers are purchasing an outcome, labels like "AI agent platform", "SaaS" or "automation tool" describe architecture, not the competitive set.

⚠️ **Field failure:** peers were chosen by category label, and the resulting table compared products that shared a buzzword and nothing else — different buyers, different jobs, incomparable prices (see C-16).

**The five slots also produce the search terms for step 6:** describe the job with no brand name in it.

---

## Claims vs. facts

**Copy every claim off the homepage. Take each one back to the evidence and mark it holds / fails / unverifiable.** List conflicts explicitly — **a conflict you noticed and didn't surface is the worst outcome.**

⚠️ **Field case:** the homepage said credits never expire; another first-party page said they expire after six months. Both were output as fact, side by side, with no note that they contradict each other.

⚠️ **When the main domain blocks everything**, claims can still be taken from: the archived snapshot of the homepage · the app store description · the OG/meta description in the HTML head · the doc-site welcome page · search-result titles and descriptions the vendor wrote. **Only after all four fail do you write "all channels blocked" — and say so prominently in the report.**

---

## Activity, size and where the effort goes

**All of this is free and comes off the domain itself:**

- **Changelog cadence** — the strongest activity signal there is. Last entry last week or two years ago tells you everything
- **What roles are open** — where the money is going. No careers page at all means a very small team
- **Status page incident history** — the real reliability record, not the marketing claim
- **Security / compliance pages** — SOC 2 or HIPAA present means they are selling to enterprises
- **Documentation depth** — thin docs usually mean the claimed capabilities are on paper
- **App stores** — version number, last update, rating, and **review count as a floor on the user base**
- **Funding and team size** — rarely on the site; dig it out of press coverage, the careers page, and the legal entity named in the privacy policy

**Read them together, not one at a time.** A weekly changelog with no open roles is a small team shipping hard. A stale changelog with many open roles is a company rebuilding. Neither reads correctly alone.

---

## Pricing teardown

Not "there are three tiers". Get these nine, and name the ones you couldn't:

1. **Billing unit** — per seat / per usage / per record / per workspace. **This is the business model itself, and it tells you who the product is designed for.**
2. Exact price per tier, **monthly and annual separately**
3. **What each tier adds over the one below**
4. **What is locked to the top tier** (SSO, SAML/SCIM, audit logs, SLA) — **the single most decision-relevant cell for a buyer**
5. What the free tier can actually accomplish, in concrete quantities
6. Overage pricing
7. Annual lock-in and prepayment terms
8. Startup / education / non-profit discounts
9. "Contact sales" on the pricing page is an enterprise-sales signal and belongs in the conclusions

### ⚠️ Tiered pricing is a piecewise function — never sample and extrapolate

⚠️ **Field failure:** six sample points produced "between 30 and 200, A is cheaper". There were **four crossover intervals**. An external reviewer found one; a second was found later. **Solve point by point or write out the piecewise expression.** (**C-15**)

### ⚠️ Normalise before comparing

⚠️ Five products in one category had five different billing units — per channel, per channel bundle, per workspace plus credits, per seat, per usage. **The numbers in that table were not comparable.** Confirm both sides deliver the same thing before comparing price (**C-16**).

### ⚠️ Don't assign difficulty scores without a basis

⚠️ **Field self-own:** a report that criticised others for unfounded confidence closed by calling a feature "low build difficulty" with no basis whatsoever. **Give the basis or write "difficulty not assessed."**

---

## Competitors

Everything on peer selection, layering, scale proxies, gaps and threat ranking lives in `market_landscape`. **Load it at step 6.** Two rules stay here:

**Every competitor must have had its own domain opened.** A source about product A cannot support a factual cell about product B.

⚠️ **When verification falls short, the value doesn't drop to zero.** The repeated failure mode is deleting the whole competitor section, leaving the reader with a blank. Instead: **name the players you're confident about, mark the rest as unverified, and say what you'd need to confirm them.**

---

## Risk

⚠️ An empty risk section is almost always "didn't think", not "there is none".

⚠️ **The best risk sentences are one line and specific:** *"the entire business rests on the assumption that these platforms don't block it; a change in anti-scraping policy takes the product to zero overnight."* Compare that with "there are competitive risks in the market".

Cover: platform and dependency risk · concentration (one channel, one customer, one integration) · the gap between the strongest claim and the evidence — **the stronger the claim, the more visible the shortfall** · commercial-conduct signals (billing complaints, cancellation friction, regulatory mentions) · staleness of public proof (case studies years old) · capital efficiency.

---

## Trial-level evidence is not the client's job to gather

⚠️ **Heavily penalised in the field:** a report listed "overage pricing not stated on the site" and "how many videos the credit allowance produces is not stated" as **items for the client to test**. Both were in the vendor's own docs — **and both filenames were in an index this method had already printed out.**

**The reader came to you precisely so they don't have to go and try it themselves.** Three routes, in order:

1. **Mine the vendor's own docs** — the answer is there far more often than expected (**C-07**)
2. **Find someone else's hands-on test** — video reviews and long-form community posts show real interfaces, real usage and real failures
3. **If it's free to sign up, sign up**

**When all three fail, give the criteria rather than an empty table**: *"if your usage is X, the cost works out to roughly Z by calculation Y."*

⚠️ **`node scripts/check-report.mjs` fails the report on "to be tested".**

---

## Change is more informative than state

**Recent (via `last_30_days`)** — releases, pricing moves, funding, incidents, user reaction. **Every item dated.**

⚠️ **The video channel title list doubles as a changelog**: publishing cadence, what's being pushed now, and which feature got several videos (many videos means they think it's important or hard to use).

**Changelog cadence** — weekly / monthly / quarterly / **stopped**. ⚠️ **Stopped is worse than never having one**: never having one means they don't publish; stopping means they did and quit. **The date of the last entry goes in the report.**

**Longitudinal (archived snapshots)** — compare the pricing page and homepage copy across time. Quietly reduced free tiers, repositioning, and abandoned segments all show up here and nowhere else.

**Who they think the threat is** — vendors' own `/vs/` and `/alternatives/` pages, and comparison posts on their blog. ⚠️ **The competitor data on those pages is not citable** (they wrote it); use it to read their anxiety. **When the competitor they target and the one actually gaining on them differ, that gap is the finding.**

---

## Legal and commercial terms (required for the buyer viewpoint)

Reading "is there a `/terms` page" is not reading the terms. **Inside are things a buyer needs:**

- **Liability caps** — what they pay if something goes wrong
- **Data ownership and destination** — is your data yours, is it used for training
- **The actual SLA** — availability percentage and what triggers a credit (many "enterprise" products have no payable SLA)
- **Price-change clauses** — can they change price unilaterally, with how much notice
- **Termination and export** — how long you can retrieve data after cancelling

⚠️ **A product that handles user account authorisation and has no terms of service page is a major finding**, not a footnote.

---

## Delivery floor

### Every report must carry the configured header

The header template is in `assets/report-header.md`. **It ships unbranded**; set `BRAND_HEADER` if you want the checker to enforce your own.

⚠️ **Markdown only — no inline HTML.** Many previewers emit `<img>`, `<sub>` and `<div>` as literal text, and **a base64 data URI rendered as literal text destroys the entire first screen.** Control image size by choosing the right source resolution, not with a `width` attribute. (**C-22**)

### ⚠️ The report is the deliverable, not a work log

⚠️ **Field failure:** delivered reports contained "this report has been revised", "my first version was wrong", "I completely missed this last round", "the most of any product researched so far", "discipline note: I did not crawl the disallowed pages". **The client is buying conclusions, not the story of how you reached them.**

| Never appears | Write instead |
|---|---|
| Method names and version numbers | Nothing. The header carries brand and date only |
| Revision confessions | **The correct conclusion, with no trace of the correction** |
| First-person process ("I didn't open", "not done this round") | Put it in the boundaries table as **impact on the reader**, not as what you did |
| Tooling and collection detail (status codes, static scraping, rendering, crawling) | Delete, or compress into one line about sources |
| Cross-report self-comparison | A reference the reader can use ("uncommonly many for this category") |
| Internal terminology (confidence tiers, absence-as-evidence, shape judgement) | The same idea in ordinary language |
| Self-assessment in headings ("← the most important section") | An ordinary heading |

**How to write the boundaries section:** not "what I didn't do", but **"what wasn't obtained → and how that limits the conclusion."** The first is a disclaimer. The second is professional.

⚠️ **The test:** hand it to a client who doesn't know it was machine-generated. Can they tell? Can they see how many drafts it went through? If yes, it isn't clean.

### What a complete report contains

Opening summary (no jargon) · feature module table (business language) · user journey with real friction · **≥3 embedded screenshots** · pricing teardown · claims vs. facts · company fundamentals · **layered** landscape with normalised comparison · scale and relative position with stated measure · **≤10 verbatim quotes** with source, date and identity, grouped by time · recent changes with dates · risks · **a verdict split by viewpoint** · boundaries.

**Length is not a constraint.** Write in batches and assemble. **Banned:** "for reasons of length", "similarly for the rest", "not elaborated here", cutting a section because you decided the reader wouldn't care, and filling a section that needs specifics with generalities.

---

## Before delivery

```bash
node scripts/check-report.mjs <report.md> [--manifest <evidence.json>]
```

It runs the contract step by step and flags inline HTML, method-name leaks, internal jargon, work-log phrasing, example bleed, "to be tested" tables and unreplaced placeholders.

### What the checker cannot see

The contract catches what is countable. **These need a human pass:**

1. Pick three numbers at random. For each, can you say what the exact words were and what the URL was? **If not, it was invented — delete it and rewrite**
2. Does every section end in a judgement, or do some just stop after a table?
3. Is the risk section empty? **An empty risk section is almost always "didn't think", not "there is none"**
4. Does any section praise a capability that the evidence section left blank?
5. Is anything in the report the target's own marketing language, repeated without a verdict?
6. Would a reader who doesn't know this was machine-generated be able to tell?

**Then read it once more and ask: does this read like it was written by a professional advisor? Is there anywhere it makes excuses for itself?**

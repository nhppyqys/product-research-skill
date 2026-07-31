---
name: casebook
version: 1.0.0
description: Field cases behind the product research method. Each records one real failure or discovery with its premise, action, result, mechanism, transferable rule, and the boundary where the rule stops applying. Load it to explain why a rule exists, or to judge whether a rule applies to the product in front of you.
triggers: []
---

# Casebook

**This file answers "why". "How" is in the method. "Is it enough" is in `contract.json`.**

## Two things to know first

**One — these are failure records, not checklists.** "One product had 25 visual templates" does not mean go find 25 templates. It means the composition of a template library reveals who the vendor thinks the customer is.

**Two — every case has a "does not apply when" row, and it matters as much as the rule.**

⚠️ **Field case:** an early entry recorded only "probing `/customers` returned 404" — no premise, no boundary. In cross-model testing a model wrote *"no customer case page (`/customers` returns 404)"* into a report about a completely unrelated product. **That path had never been probed.**

**A half-told case is more dangerous than no case.** It hands over a specific conclusion without the conditions that make it true, and the conclusion gets carried off as general fact. **Every case fills all seven rows. Incomplete cases don't belong here.**

## Format

| Row | Purpose |
|---|---|
| **Premise** | Product shape and the conditions that held ← **decides whether this applies to what's in front of you** |
| **Action** | What was actually done |
| **Result** | What happened |
| **Mechanism** | Why, generalised |
| **Rule** | The transferable rule, stripped of specifics |
| **Does not apply when** | Where following it makes things worse ← **prevents over-generalisation** |
| **How to check** | How to verify quickly on a new product (or "n/a") |

## Shape coverage

⚠️ **Note which shapes are field-tested and which are inferred.** On untested shapes this method's reliability has no evidence behind it.

| Product shape | Samples | Covered | Not covered |
|---|---|---|---|
| **Self-serve SaaS** | 4 | Collection, pricing teardown, reputation, delivery | — |
| **Enterprise sales** | 2 | Case studies, structured data, distribution structure | Cloud-marketplace contract pricing, hiring-based inference |
| **Consumer app** | 1 | App store reviews, release cadence | Chart position, paid-acquisition signals |
| **Developer tool / API** | 2 | Endpoint structure, package downloads | Full rate-limit and error-code teardown |
| **Early stage** (no reviews, no cases) | 1 | Absence-as-evidence, acquisition design | — |
| **Open source / open core** | 1 | Licence reading and change history, paywall location, repo metrics, self-host vs cloud | **No sample that is still open-core** — ours had already gone fully permissive; contributor employee ratio unverified |
| **Marketplace / two-sided** | 1 | Namespace ownership, supply velocity, take-rate paths, limits of demand measurement | Listing and moderation rules; **demand side inherently unmeasurable** (C-42), not merely untested |

**Discipline on an untested shape:** run the method as normal, but state in the report's boundaries that there is no field calibration for this shape. **Do not pretend to be sure.**

---

# I. Evidence collection

## C-01 Probing before you have the index gives the opposite answer

| | |
|---|---|
| **Premise** | Early-stage product, only a login page visible; multi-locale site with locale-prefixed paths |
| **Action** | Probed 20 standard paths on the bare domain (`/pricing`, `/about`…) |
| **Result** | 19 returned 404. Concluded "a single-page product with almost no content" |
| **Truth** | The sitemap held **334 URLs across 20 locales**. Real paths were `/en/pricing`, `/zh/pricing` — bare paths of course 404 |
| **Mechanism** | Probing tests whether *the paths you guessed* exist. The index tells you what *actually* exists. **Guess wrong and every result is a false negative** |
| **Rule** | **Get the path space (sitemap / llms.txt / robots.txt) before probing.** Reversed, the order produces a conclusion pointing the wrong way |
| **Does not apply when** | No sitemap and an empty robots.txt — probing is all you have, but the report must state that the path space is unknown and absence conclusions are unreliable |
| **How to check** | `curl -sL <domain>/sitemap.xml \| grep -c '<loc>'` — an order-of-magnitude gap against your probe hits means you hit this |

## C-02 The 404 page carries the company fundamentals

| | |
|---|---|
| **Premise** | Enterprise-sales product; site runs a CMS with an SEO plugin |
| **Action** | Probed `/llms.txt`, got 404, was about to discard it |
| **Result** | That 404 page's HTML held a complete `schema.org` `Organization` block: employee range, founding year, eight office cities, press email, and a positioning paragraph containing key claims |
| **Mechanism** | SEO plugins inject organisation-level JSON-LD into **every page template, 404 included**. It's written for search engines and nobody ever cleans it |
| **Rule** | **Search every fetched HTML for `application/ld+json` before discarding it, 404 or not.** Look at `numberOfEmployees`, `foundingDate`, `address`, `sameAs` (the last gives you their official video channel) |
| **Does not apply when** | Pure front-end framework sites often return an empty 404 shell with no JSON-LD. **Also `description` is vendor-written — a claim, not a fact** — and belongs in the claims list |
| **How to check** | `curl -sL <domain>/llms.txt \| grep -o 'application/ld+json' \| head -1` |

## C-03 The robots.txt Disallow list leaks real commercial behaviour

| | |
|---|---|
| **Premise** | Self-serve SaaS with public list pricing across seven tiers |
| **Action** | Read the `Disallow` list |
| **Result** | Six promotional landing pages sat in it: a lifetime deal, 40% off monthly, a quarterly discount, **a large annual discount**, and **77% off the first month** |
| **Mechanism** | Disallow holds what the vendor doesn't want indexed: promotions, channel-specific pricing, trial funnels, retired-but-live products, internal tools. **Those are the real commercial actions** |
| **Rule** | **List price is not transaction price.** Read the Disallow list against the public price; the gap is the channel discount. For a buyer: **ask about discounts before negotiating** |
| **Does not apply when** | **Enterprise-sales products usually have a clean robots.txt** — negotiation happens in a meeting room, not on a landing page. Field-confirmed on one enterprise product: plugin defaults only. **That absence is also information.** See C-37 for the open-source variant |
| **How to check** | `curl -sL <domain>/robots.txt \| grep -i disallow` |

## C-04 "Static scrape found nothing" is not "the page doesn't have it"

| | |
|---|---|
| **Premise** | Self-serve SaaS; pricing page returns 200 with a complete body; prices computed by front-end script from a dropdown |
| **Action** | Static scrape only, searching the HTML for prices |
| **Result** | Zero numbers. Wrote **"the pricing page gives no figures; you must log in to see pricing"** and built a whole paragraph about deliberate pricing opacity on top of it |
| **Truth** | Opened in a browser: **all seven tier prices plainly on the page**, one per dropdown option |
| **Mechanism** | Mistook "I didn't capture it" for "they don't provide it". Modern sites routinely script-render prices, quotas and limits |
| **Rule** | **Any conclusion of the form "page X does not contain Y" must be confirmed after rendering.** Interactive controls — dropdowns, tier switches, monthly/annual toggles, region pickers — **must each be operated**; the default alone is a fraction of the page |
| **Does not apply when** | Server-rendered sites and plain doc sites — static scraping is reliable, don't render everything. **The trigger is: a scrape returning nothing makes rendering mandatory** |
| **How to check** | `curl -sL <pricing page> \| grep -oE '\$[0-9]+'` — no hits means render before concluding |

## C-05 A login wall is not a wall: the vendor's videos are full of real UI

| | |
|---|---|
| **Premise** | Product entirely behind a login wall, no public doc site, no demo page |
| **Action** | Wrote "the product interface can't be obtained" and left the screenshot section empty. **Five rounds running**, justified as "no rendering capability in this environment" |
| **Result** | The sixth round actually tried: browser tooling opened and captured pages, and local headless Chrome wrote PNGs to disk. **It had always been possible; it had never been attempted.** Frames pulled from the official channel then produced the real logged-in UI |
| **Mechanism** | Vendor tutorial videos are the **cheapest source of real UI** — they have to be screen recordings, or they couldn't teach anyone |
| **Rule** | Three steps: list titles (`yt-dlp --flat-playlist --print "%(id)s \| %(title)s" <channel>/videos`) → pick → extract (`ffmpeg -ss <sec> -i v.mp4 -frames:v 1 out.png`). **Titles are intelligence**: `How to connect…` is the main UI; `NEW in…` is the newest feature, often newer than the site |
| **Does not apply when** | **Not every tutorial contains screen recording.** Field case: a two-minute onboarding video was entirely a talking head plus title cards, zero interface. **Build a contact sheet first** (`ffmpeg -vf "fps=1/8,tile=4x3"`) to confirm before downloading more |
| **How to check** | Get the channel URL from JSON-LD `sameAs` or the footer; list titles first |

## C-06 The video isn't always on the obvious platform

| | |
|---|---|
| **Premise** | Enterprise product with a demo video embedded on a feature page |
| **Action** | Pointed the downloader straight at the page's video |
| **Result** | It was hosted on a different platform with an auth parameter; the player config returned 403 and the downloader failed on an OAuth error. **The same company's channel on the mainstream platform was wide open** |
| **Mechanism** | Vendors often put the "formal demo" on a permissioned host and the "tutorial and marketing" material on the open one |
| **Rule** | **Find the embed source in the page HTML first** and pick the tool to match. One source being blocked does not mean the content is unobtainable — try the official channel |
| **Does not apply when** | Products with no public video presence at all (usually early stage or pure enterprise sales). Screenshots then take the `absent` exemption, **but the report must say which channels were checked** |
| **How to check** | `curl -sL <feature page> \| grep -oiE '(youtube\|vimeo\|wistia\|loom)[^"'"'"']*' \| sort -u` |

## C-07 Listing the index is not reading it

| | |
|---|---|
| **Premise** | Developer tool with a complete doc site and index |
| **Action** | Printed the documentation index, saw pages plainly named for credits and pricing, **and did not open them** |
| **Result** | The report said "overage pricing is not stated on the site" and "the site doesn't say how much the allowance produces", listing both as **items for the client to test**. Both were written in the vendor's own docs, **and both filenames were in the index already printed** |
| **Mechanism** | An index is a map, not the territory. **Printing it creates the sensation of already knowing** |
| **Rule** | **Open and read every index page touching pricing, quotas, limits or error codes.** This is a gate before external searching begins |
| **Does not apply when** | n/a |
| **How to check** | Before delivery, take every "the site doesn't say" back to the index and search for it |

## C-08 Status codes come in four kinds, and 200 isn't "complete"

| | |
|---|---|
| **Premise** | Recurring across multiple products |
| **Action** | Treated anything that wasn't 200 as "doesn't exist" |
| **Result** | Three misreadings: ① `/pricing` returned **308** resolving to a `www.` 200 — recorded as "no pricing page"; ② one site returned **403 on all 14 paths** (unchanged by user-agent) — under absence-as-evidence that yields "this product has nothing"; ③ a pricing page returned **200 with a full body** but every price was script-rendered, so the scrape held zero numbers |
| **Mechanism** | 301/308 = exists; 401/403/429 = blocked; **only 404 is absence**. And 200 guarantees HTML, not content |
| **Rule** | Four categories: **follow redirects and record the final URL / switch channels before judging a block / only 404 enters absence reasoning / key pages need a render check even at 200** |
| **Does not apply when** | n/a |
| **How to check** | `curl -sL -o /dev/null -w "%{http_code} %{url_effective}\n" <url>` |

## C-09 Exhaust the target's own site before searching outward

| | |
|---|---|
| **Premise** | An environment where fetching pages is free and external search is metered |
| **Action** | Went straight to search engines for "X competitors" and "X pricing" |
| **Result** | One round read 2 pages (one an aggregator) and **burned the entire search budget**. In the same round another product's 11 standard paths were all 200 and all free to read |
| **Mechanism** | The target's own pages are the **densest, cheapest, most trustworthy** evidence source |
| **Rule** | **Exhaust the target's site first.** This ordering has nothing to do with cost and everything to do with evidence density — it holds under any billing model |
| **Does not apply when** | When the whole site is blocked (C-08 case ②) you must invert and search externally first. The report then declares first-party evidence missing |
| **How to check** | Count first-party pages read vs searches spent. The former being smaller means the order was wrong |

---

# II. Judgement

## C-10 Absence is evidence, but "absent" must be a confirmed 404

| | |
|---|---|
| **Premise** | Developer tool, small team |
| **Action** | Probed `/pricing`, `/customers`, `/careers`, `/security` — all four 404 |
| **Result** | Those four absences together form a clear conclusion: **small team, no enterprise sales motion, not chasing large accounts** |
| **Mechanism** | Which pages a company builds reflects who it serves. **Absence is informative, provided it really is absence** |
| **Rule** | Group 404s by meaning: **no pricing → enterprise sales or unpriced; no security/compliance → not selling into regulated industries; no status page → no availability commitment; no careers → not expanding** |
| **Does not apply when** | ⚠️ **Path aliases manufacture false absences.** Field case: `/terms` was 404 and became "legal terms not yet formalised", while `/terms-of-service` and `/privacy-policy` were both 200. **Try common aliases first** (`-of-service`, `-policy`, a `legal/` prefix, locale prefixes) |
| **How to check** | For every path judged absent, try at least two aliases |

## C-11 "No team page" does not prove "one person"

| | |
|---|---|
| **Premise** | Self-serve SaaS with no team page and no careers page |
| **Action** | Wrote **"effectively a one-person company"** and built an entire "single-person dependency is the biggest risk" section on it |
| **Result** | Overreached. It only held after three independent corroborations: the package publisher was the founder, the public org had zero listed members, and all repository commits carried one author |
| **Mechanism** | **Not found ≠ not there.** A single signal supports "public information shows…", never a factual assertion |
| **Rule** | Four grades: **observed fact / high confidence (≥3 independent signals) / medium / low.** Write "public information shows a very small team (no team page, no careers page); no second person is publicly credited" |
| **Does not apply when** | ⚠️ **The triangulation kit is shape-dependent.** Field case: on one consumer SaaS there was no package and no locatable org — **the entire channel set was dead.** Switch to app store review counts, hiring platforms and press coverage |
| **How to check** | For every "effectively / in fact / clearly", count the independent signals behind it |

## C-12 Short-term long-tail movement is noise, not signal

| | |
|---|---|
| **Premise** | Domain rankings, with players spread from rank 3,000 to 1,000,000 |
| **Action** | Wrote a three-layer conclusion: "distribution contracting, creation retreating, integrated layer growing" |
| **Result** | Re-checked a day later with fresh data — **one of the three sentences survived.** All four data points behind "integrated layer growing" sat **beyond rank 220,000**, and this method itself classifies long-tail movement as noise |
| **Mechanism** | **A conclusion was supported by evidence the method forbids.** The tidier the narrative, the more likely it was selected |
| **Rule** | The reliable range is roughly the top 50,000. **Every layer needs an anchor inside it**; a layer held up only by long-tail players gets "insufficient evidence". **One ruler for all layers.** The test: does the conclusion survive deleting the long-tail players |
| **Does not apply when** | Head-of-market movement (four-digit ranks) does carry signal; a ~15% move is meaningful even at rank 20,000 |
| **How to check** | List every player the conclusion rests on, strike those past 50,000, see what remains |

## C-13 Domain rank measures prominence, not traffic

| | |
|---|---|
| **Premise** | Any product with a website |
| **Action** | Two misuses: ① asserted it "systematically underestimates pure API products"; ② read long-tail 30-day movement as trend |
| **Result** | Both retracted. ① Of the five underlying sources **three are DNS-based** and **include non-browser traffic**; aggregated by registered domain, API subdomain requests are likely already counted, **so the direction of bias is unknown**. ② See C-12 |
| **Mechanism** | It is a weighted average of real page visits, three DNS-query sources, and backlink counts. **It measures prominence and cannot be converted to visits** |
| **Rule** | **Use magnitude and relative position only.** Always state the measure and the direction of distortion — **and when the direction is unknown, say so** |
| **Does not apply when** | ⚠️ **Enterprise-sales products carry an extra distortion**: customers arrive via sales and live in an app subdomain, so the marketing site understates real scale. **But that bias applies equally to every player in the category, so relative position still reads** |
| **How to check** | Pull the same series for every player and compare within the category only |

## C-14 Evidence standards must be symmetric

| | |
|---|---|
| **Premise** | A comparison table with the target and its competitors side by side |
| **Action** | Required a verbatim quote and confidence grade for every number about the target, **while taking third-party estimates for competitor funding, revenue and headcount as fact** |
| **Result** | Two standards inside one report. An external reviewer called it out immediately |
| **Mechanism** | Strict with the familiar, loose with the unfamiliar — **the easiest bias to commit and the hardest to self-detect** |
| **Rule** | **Competitor rows get the target's standard**: source, estimate-or-disclosed, date. If you can't, write "unverified" |
| **Does not apply when** | n/a |
| **How to check** | Pick three numbers at random from the competitor table and ask of each: what were the exact words, and what was the URL |

## C-15 Tiered pricing is a piecewise function

| | |
|---|---|
| **Premise** | Two products priced in tiers, where price changes by segment |
| **Action** | Sampled six points and reported "between 30 and 200, A is cheaper" |
| **Result** | There were **four crossover intervals**. An external reviewer found one that had been missed; a second was found afterwards |
| **Mechanism** | Sampling a handful of points on a piecewise function guarantees missing crossovers |
| **Rule** | **Solve point by point, or write out the piecewise expression.** Never extrapolate between sample points |
| **Does not apply when** | Flat per-unit pricing — sampling is safe there |
| **How to check** | Express both price curves as functions and solve for intersections |

## C-16 Confirm both sides deliver the same thing before comparing price

| | |
|---|---|
| **Premise** | Five products in one apparent category |
| **Action** | Put the monthly prices in one table |
| **Result** | Five different billing units: per channel, per channel bundle, per workspace plus credits, per seat, per usage. **The numbers were not comparable** |
| **Mechanism** | The billing unit *is* the business model, and it states who the product was designed for |
| **Rule** | **Normalise to one billing unit before comparing**, and first confirm both sides deliver the same thing (some include creation, some only distribution) |
| **Does not apply when** | n/a |
| **How to check** | Every column in a price table states what it charges per |

## C-17 Rating platforms don't measure the same thing

| | |
|---|---|
| **Premise** | A product listed on several rating platforms |
| **Action** | Saw a high score on one and hostile reviews on another, and tried to reconcile them into one verdict |
| **Result** | Hit twice with the same pattern: 4.6 across 188 reviews on an invitation-heavy platform versus a bimodal distribution elsewhere; 4.7 on one platform versus 2.0 on another |
| **Mechanism** | **Invitation-heavy platforms** carry solicited reviews and skew satisfied — they measure **product satisfaction**. **Complaint-driven platforms and low-star bands** carry self-initiated complaints and skew harmed — they measure **commercial experience** (billing, cancellation, refunds, support) |
| **Rule** | **Check both and do not reconcile.** The gap is the finding: **high product scores plus low commercial scores means the product works but the commercial conduct is aggressive** |
| **Does not apply when** | Under ~50 reviews a score can't carry a reputation conclusion — **but a single specific complaint is still a usable lead**, labelled as single |
| **How to check** | Always take at least one invitation-type and one complaint-type source |

## C-18 Group reviews by time, not only by sentiment

| | |
|---|---|
| **Premise** | A product with years of accumulated reviews |
| **Action** | Organised quotes into positive and negative columns |
| **Result** | Sorting by year revealed a different picture: five-star reviews clustered in an earlier period, one-star reviews clustered recently and concentrated on billing, cancellation and refunds. **Sentiment columns hide this completely** |
| **Mechanism** | The time distribution traces a change in commercial strategy, not random variation |
| **Rule** | **Sort the quotes by year.** Negatives recent and positives early means the product or the commercial conduct changed |
| **Does not apply when** | ⚠️ **App store reviews may be versioned rather than dated.** Field case: the most recent 100 carried version numbers only. **Sort by version and map to approximate dates**, or this rule is unusable |
| **How to check** | Add a year column to the quote list and sort by it |

## C-19 A lifetime average hides a recent collapse

| | |
|---|---|
| **Premise** | Consumer app with 30,000+ historical reviews |
| **Action** | Took the store's displayed overall rating (4.73) |
| **Result** | **The most recent 100 reviews averaged 3.17, with 34 one-star.** The headline was held up by a decade of accumulation |
| **Mechanism** | A large historical mean is extremely insensitive to recent change. **The gap converges over time — an unaddressed problem shows up as a falling score** |
| **Rule** | **Report the lifetime score and a recent sample separately.** A large gap is itself the conclusion |
| **Does not apply when** | With few total reviews (<200) the difference is mostly noise |
| **How to check** | Take the overall rating from the store lookup API and compute the mean of the recent reviews feed |

## C-20 Layer before comparing

| | |
|---|---|
| **Premise** | A category whose players occupy different segments of the workflow |
| **Action** | One round split the category into three layers and judged where value was migrating — **the most valuable section in that report** |
| **Result** | **But the method had no such step.** The next round on a different product, the whole analysis vanished, leaving a list of feature-level gaps |
| **Mechanism** | **An analysis performed once but never written into the flow does not recur.** Same disease as C-24 |
| **Rule** | After assembling players and before comparing them, ask "are these doing the same job?" **Cut by input→output**: existing content→published = distribution; raw material→finished = creation; both = integrated |
| **Does not apply when** | Genuinely single-layer categories — don't force it, but state that you confirmed it is single-layer |
| **How to check** | Write one line per player: "input X → output Y". If they don't fall into two or more groups, it's one layer |

---

# III. Delivery

## C-21 Embed images; never list paths

| | |
|---|---|
| **Premise** | 19 real UI screenshots existed on a documentation site |
| **Action** | Listed their file paths in the report as evidence |
| **Result** | Those paths were **404 externally** — internal relative paths only the doc site resolves. **A list of dead links presented as evidence is worse than writing nothing** |
| **Mechanism** | An unverified reference gets read as a verified one |
| **Rule** | **Embed it if you can** (verify the URL returns an image content type). **If you can't, write "no image available" — never hand over a link and imply it works** |
| **Does not apply when** | n/a |
| **How to check** | `curl -I` every image link and confirm `content-type: image/*` |

## C-22 Inline HTML destroys the first screen

| | |
|---|---|
| **Premise** | Reports need to survive several renderers — previewers, PDF export, other people's editors |
| **Action** | Wrote the header as `# <img src="data:image/png;base64,…" width="30"> Title`, to control logo size |
| **Result** | The reader's previewer doesn't render inline HTML. **4,600 characters of base64 were emitted as body text at H1 size, filling the entire first screen** |
| **Mechanism** | Many renderers pass inline HTML through literally. **Base64 rendered literally is not "slightly worse styling" — it is a destroyed first screen** |
| **Rule** | **Markdown only.** Images use `![](src)`; control size by choosing the right source resolution (a 32px PNG for a header), not a `width` attribute. `<sub>`, `<br>`, `<div>`, `<span>` equally banned |
| **Does not apply when** | A known renderer that supports HTML (your own site). **External delivery stays strict** |
| **How to check** | `grep -E '<(br\|div\|span\|img\|sub)' <report>` |

## C-23 The report is the deliverable, not a work log

| | |
|---|---|
| **Premise** | A report that went through several revisions |
| **Action** | Left in "this report has been revised", "my first version was wrong", "I completely missed this last round", "the most of any product researched so far", "discipline note: I did not crawl the disallowed pages" |
| **Result** | **The client is buying conclusions, not the story of how you got there.** The reader has to navigate the author's process to reach the content |
| **Mechanism** | Revision traces, internal terminology and cross-report self-comparison are things only the author cares about |
| **Rule** | Delete all of it. **The boundaries section reads "what wasn't obtained → how that limits the conclusion"**, not "what I didn't do". The first is professional; the second is a disclaimer |
| **Does not apply when** | n/a |
| **How to check** | The checker's worklog / internal-jargon / method-leak rules |

## C-24 A method not in the flow does not exist

| | |
|---|---|
| **Premise** | A recent-changes sub-method had been in the pack the entire time |
| **Action** | Relied on keyword routing to make the model remember to use it |
| **Result** | **Not used once in three consecutive rounds.** The same disease recurred twice more: screenshots skipped for two rounds, layered analysis done once and never again |
| **Mechanism** | **Not in the execution order = does not exist.** A rule that depends on remembering will be missed |
| **Rule** | Every sub-method must be named at a specific step in the execution order; **and completion standards must be checked by code, not left as a checklist at the end of a document** |
| **Does not apply when** | n/a |
| **How to check** | Grep the execution order for each sub-method name; anything absent is an orphan |

## C-25 Don't impose constraints nobody asked for

| | |
|---|---|
| **Premise** | The reader had never asked for a short report |
| **Action** | Pulled content in for three rounds running, and wrote a length cap into the method. One round skipped six modules with "for reasons of length" **while two thirds of the output budget remained** |
| **Result** | The reader's words: *"I never set that limit — stop setting it for yourself."* |
| **Mechanism** | Mistaking an execution-environment constraint for a delivery requirement |
| **Rule** | **Length is not a constraint.** More to say means write in batches. Banned: "for reasons of length", "similarly for the rest", cutting a section because you decided the reader wouldn't care |
| **Does not apply when** | A deployment genuinely has a hard ceiling — gate it with an environment variable, **don't write it into the method** |
| **How to check** | Search the report for "for reasons of length", "similarly", "not elaborated" |

## C-26 Opposite sign conventions in adjacent columns get misread

| | |
|---|---|
| **Premise** | A ranking table where a smaller rank is better, next to a change column where a bigger number is better |
| **Action** | Put them side by side and wrote the change as "+159,430" |
| **Result** | The reader read an advance of 159,430 places as a decline of the same |
| **Mechanism** | Two opposite sign conventions in one table; readers don't verify direction column by column |
| **Rule** | **Write the before and after values plus the direction in words** ("30 days ago 735,952 → now 576,522, an advance of 159,430"), not a signed delta |
| **Does not apply when** | n/a |
| **How to check** | For every numeric column ask "does bigger mean better?" — inconsistent answers require a rewrite |

## C-27 Never hand the work back to the client

| | |
|---|---|
| **Premise** | Trial-level evidence was needed (what the allowance produces, what the experience is like) |
| **Action** | Delivered a "to be tested" table listing things for the client to verify |
| **Result** | The reader's words: **"they came to you precisely so they don't have to go and try it themselves."** And that round's two "to be tested" items were both answered in the vendor's own docs (see C-07) |
| **Mechanism** | "To be tested" is unfinished work packaged as a deliverable |
| **Rule** | Three routes in order: **the vendor's own docs → someone else's hands-on test (video reviews, long community posts) → sign up if it's free.** When all three fail, **give the criteria, not an empty table** ("if your usage is X, cost is roughly Z by calculation Y") |
| **Does not apply when** | n/a |
| **How to check** | `grep -E 'to be tested\|try it yourself\|please verify' <report>` |

---

# IV. Cross-model execution

## C-28 Examples get carried off as this round's findings

| | |
|---|---|
| **Premise** | The method document contains concrete field examples; a different model executes the same method |
| **Action** | The document contained an example naming a specific domain and a specific 404 result |
| **Result** | The model wrote *"no customer case page (`/customers` returns 404)"* into a report about a **completely unrelated** product — **that path had never been probed that round.** Reproduced in 2 of 3 runs |
| **Mechanism** | **Examples contaminate output by nature.** The more concrete and finding-shaped they are, the more likely they are lifted wholesale |
| **Rule** | ① Every case fills all seven rows, **especially Premise and Does-not-apply**; ② every status code, path, number and company name must trace to this round's evidence; ③ run a checker that surfaces names appearing in the method document for review |
| **Does not apply when** | ⚠️ **Do not reduce this to "these names may never appear."** Field-tested: as a hard block it flagged three names in one report **that had all been freshly researched that day.** A hard ban forces authors to delete real evidence, which is worse than bleed. **The test is the evidence, not the name** |
| **How to check** | Run the method document's product names as a denylist and confirm each hit against this round's collection log |

## C-29 Models copy rule text into the deliverable

| | |
|---|---|
| **Premise** | Rules written as prose; a different model executes |
| **Action** | The document said the boundaries section should state what wasn't obtained and its impact, **"rather than simply listing what wasn't done"** |
| **Result** | The model rewrote that instruction into the report body: *"This section explains the limits of this round's evidence gathering and how the unmet parts affect the conclusions, **rather than simply listing what wasn't done**."* Occurred in 3 of 3 runs, along with internal confidence terminology |
| **Mechanism** | When instructions and content are both prose, **the model cannot reliably tell which sentences are addressed to it and which are for the reader** |
| **Rule** | Screen for internal terminology and rule phrasing before delivery; **the durable fix is moving requirements out of prose into a machine-readable contract**, so instructions and content are physically separated |
| **Does not apply when** | n/a |
| **How to check** | Grep the report for internal terms and rule-shaped phrases like "rather than simply" |

## C-30 Different models fail differently, so they need different backstops

| | |
|---|---|
| **Premise** | One method, one fixed evidence set, two models, three runs each |
| **Action** | Compared outputs |
| **Result** | **Faster model:** conclusions and structure entirely correct (pricing teardown, hidden discounts, add-on fees, claim conflicts all caught); **every failure was formatting** — inline HTML in 2 of 3, a chatty preamble in 2 of 3, a method version string in the header in 1 of 3. **Slower model:** better prose, finer judgement, **but fabricated evidence in 2 of 3** (writing a method-document example as this round's finding) and leaked internal terminology in 3 of 3 |
| **Mechanism** | Formatting problems are mechanical and code can absorb them; **fabricated evidence is substantive and code cannot** |
| **Rule** | **The faster model plus a mandatory checker is the better combination.** Use the slower model only when finer commercial judgement is needed, and always check afterwards. **Neither should run unchecked** |
| **Does not apply when** | Only two models and one scenario were tested. **Across a different model family this conclusion has no supporting evidence and must be re-run** |
| **How to check** | Fix one evidence set and one prompt, run each model three times, tabulate failure types with the checker |

## C-31 Models invent plausible URLs

| | |
|---|---|
| **Premise** | Evidence needs first-party page citations; standard paths follow strong naming conventions |
| **Action** | The model composed a URL matching the convention and wrote it in as evidence |
| **Result** | The path was a 404 and had never been opened. The same round cited the same non-existent page three times |
| **Mechanism** | Standard paths are so regular that **"plausible" and "exists" are nearly indistinguishable to a model** |
| **Rule** | **Every URL in a report must have been genuinely opened this round or appeared in a search result.** An execution layer can enforce this with a seen-URL allowlist |
| **Does not apply when** | ⚠️ An allowlist set too tightly blocks legitimate standard-path probing — field-observed. **Seed the standard path list first, then gate URLs outside it** |
| **How to check** | `curl -I` three URLs at random from the report and confirm none is a 404 |

---

# V. Open source / open core

## C-32 The paywall is a directory in the repository

| | |
|---|---|
| **Premise** | Open-core product (open main body plus closed commercial modules) with a public repository |
| **Action** | Read the full `LICENSE` file rather than the licence name shown on the repo page |
| **Result** | The LICENSE opened by naming the **exact coordinates of the paywall**: content under two specific directories was under a Commercial License defined in a separate file; everything else was AGPLv3. That commercial file required an enterprise subscription **priced by host count** and forbade copying, merging, publishing, distributing, sublicensing or selling |
| **Mechanism** | An open-core product must legally delimit which part is paid, **so the LICENSE is the one paywall description that cannot be vague**. Marketing says "the enterprise edition has more features"; the LICENSE says which two directories |
| **Rule** | **The pricing teardown for open source starts with the full LICENSE, not the pricing page.** Order: full LICENSE → identify commercially licensed directories → look inside them for modules → then the pricing page. **The directory names are the paid feature list** |
| **Does not apply when** | Single-licence projects with no per-directory exceptions — the paywall isn't in the code, so look at hosting, support, certification and compliance instead. **The repo page shows only a licence name and cannot reveal exceptions; you must read the full text** |
| **How to check** | `curl -sL https://raw.githubusercontent.com/<org>/<repo>/main/LICENSE \| head -20` and grep for `Portions`, `directory`, `Commercial` |

## C-33 A 301 from the repository API means a rename or a move

| | |
|---|---|
| **Premise** | Calling a repository API with a known org/repo pair |
| **Action** | A plain API call to the repo endpoint |
| **Result** | **301 Moved Permanently** plus a numeric-ID URL. Following it showed the repository had been renamed **and the project's homepage domain had changed with it** |
| **Mechanism** | Hosts keep permanent redirects for renamed or transferred repos. **The 301 is the first signal of a rename, and renames often accompany a change in positioning** |
| **Rule** | **Don't silently follow it.** On a 301, find out what it was renamed to, when, and whether the homepage changed. **A rename belongs in the report's recent-changes section** |
| **Does not apply when** | Routine internal renames (`foo` → `foo-js`) may be housekeeping. **The test is whether the homepage domain or the licence changed at the same time** — a rename alone is usually tidying |
| **How to check** | Call the repo API without following redirects and inspect the response |

## C-34 Licence changes hide inside ordinary commits

| | |
|---|---|
| **Premise** | An open-core product where the question is whether the business model has changed |
| **Action** | Read the `LICENSE` file's **commit history**, not just its current contents |
| **Result** | Current state: **MIT, 21 lines, no restrictions.** History showed a single commit replacing 670 lines of AGPL-plus-commercial terms with MIT, **and deleting the separate commercial licence file entirely**. That commit was titled `refactor:` something, touched 300 files, **and its title never mentioned the licence** |
| **Mechanism** | A licence change is a major commercial action, but **in version control it is just a file edit**, easily wrapped inside a large refactor. **No announcement does not mean it didn't happen** |
| **Rule** | **Read the LICENSE commit history, not only the current file.** Diff every change and note the direction: tightening (open → source-available/commercial) or loosening (commercial → permissive). **This is the hardest available evidence about where the business model is going** |
| **Does not apply when** | Projects that never changed licence — this yields no information, **but "never changed" is itself worth reporting** as a stability signal |
| **How to check** | Query the commits endpoint filtered to the LICENSE path, then fetch the diff for any suspicious commit |

## C-35 The paywall moves from a directory boundary to a hosting boundary

| | |
|---|---|
| **Premise** | Same company, code now fully permissively licensed, still charging money |
| **Action** | Opened the commercial domain and the repository's `homepage` domain separately |
| **Result** | They are two different things: the commercial domain is the cloud product (pricing, enterprise, sign-in); the repo's homepage domain is a **self-hosting documentation site** (installation, migrations, Docker, deployment guides for eight cloud providers) |
| **Mechanism** | Once all the code is open the paywall cannot sit in the code; **it can only sit on who operates it**. Giving self-hosting its own domain and complete docs makes "run it yourself" a named, respectable option — **and simultaneously defines the cloud product's value as "we operate it for you"** |
| **Rule** | For open-source products check two things: **① is any code still closed (read the LICENSE); ② if not, what is the reason to pay** (hosting / support / certification / compliance / managed data). **The completeness of the self-hosting docs inversely signals their confidence in cloud revenue** — the better the docs, the less they fear you leaving |
| **Does not apply when** | Open-core products with closed directories still have the paywall in the code (C-32). **Determine which case you're in before choosing the analysis path** |
| **How to check** | Compare the repository's `homepage` field against the main commercial domain; if they differ, open both |

## C-36 Repo metrics contain bots; concentration beats totals

| | |
|---|---|
| **Premise** | An open-source project where the question is whether the community is real |
| **Action** | Pulled the contributor list (several hundred) and looked at commit distribution rather than the count |
| **Result** | **The top 10 accounted for 56% of commits**, and **the fifth-largest contributor was a translation bot** with 764 commits. Stars and forks were both large |
| **Mechanism** | Stars and forks measure attention, not participation. **A raw contributor count treats a one-line typo fix and a core maintainer as equal**, and counts bots as people |
| **Rule** | **Strip bots** (logins containing `bot`, `[bot]`, and known automation accounts), then read the top-10 commit share: **highly concentrated = a company project published as open source; distributed = a real community.** Their sustainability is completely different |
| **Does not apply when** | Single-person or very small projects — concentration is necessarily 100% and yields nothing. **With small samples look at the commit time span and how long since the last commit instead** |
| **How to check** | Page the contributors endpoint and read the `Link` header's last-page number to estimate the total |

## C-37 A clean robots.txt means something different here

| | |
|---|---|
| **Premise** | Open-source product with public pricing and self-signup |
| **Action** | Read `robots.txt` per C-03, expecting promotional landing pages |
| **Result** | Four entries, **all internal application paths, zero promotional pages** |
| **Mechanism** | C-03 holds when growth runs on paid landing pages. **Open-source growth runs on the repository, the docs and the integration ecosystem**, so there is nothing to hide |
| **Rule** | **A clean robots.txt has two very different meanings**: enterprise sales = price negotiation happens in a meeting room; open source = the growth channel isn't landing pages. **Read it against the shape; never flatten it to "no hidden discounts"** |
| **Does not apply when** | Companies with an open-source edition that still run heavy paid acquisition — C-03 applies to them. **The test is whether paths like `/offer/`, `/lp/`, `/promo/` exist at all** |
| **How to check** | `curl -sL <domain>/robots.txt`; a Disallow list containing only app paths means no acquisition funnel |

---

# VI. Marketplace / two-sided

## C-38 Top-level paths belong to sellers; 200 doesn't mean the company has that page

| | |
|---|---|
| **Premise** | Two-sided marketplace where sellers get storefronts directly under the main domain (`domain/<shop-name>`) |
| **Action** | Probed standard paths — `/pricing`, `/security`, `/about`… |
| **Result** | `/pricing` returned **200** with the title `PRICING` — **it was a seller's storefront**, created by a user, with three ratings and a customer-reviews module. `/security` also returned 200, titled **"Oracle's store"**. Meanwhile `/terms`, `/enterprise`, `/careers` and `/docs` were genuinely the company's |
| **Mechanism** | The platform hands the top-level namespace to sellers: **the company reserves a small set of slugs and everything else falls through to storefronts.** Both return 200, and **the status code cannot distinguish them** |
| **Rule** | On a marketplace, **check the `<title>` and page structure of every 200 to establish ownership**: shop names, ratings, or a "powered by" line mean it's a seller page. **You cannot judge "does the platform have a security page" from status codes** |
| **Does not apply when** | Platforms that namespace sellers under a subpath (`/store/<name>`, `/u/<name>`) or a subdomain — no collision, standard probing works. **Look at one or two known storefront URLs first to learn the shape** |
| **How to check** | `curl -sL <domain>/pricing \| grep -oE '<title>[^<]*'`; a title containing a shop name or an unrelated word means it's a seller page |

## C-39 Supply-side size isn't in the sitemap, but a new-arrivals feed gives velocity

| | |
|---|---|
| **Premise** | Two-sided marketplace with a large, fast-changing seller population |
| **Action** | Read the sitemap intending to count the supply side |
| **Result** | The main sitemap held **35 URLs**, all company pages. A category sitemap held **897 category pages across 12 top-level categories** — **and not one seller listing.** But `robots.txt` declared a fourth source: a **new-arrivals RSS feed**. It returned 100 timestamped items spanning **316 minutes** → **~19/hour, ~455 new listings/day** |
| **Mechanism** | Platforms don't put dynamically generated seller pages in sitemaps (too many, changing too fast), **but new-arrivals is a discovery feature, so it has to be public** — and it carries timestamps, so 100 items is one sample |
| **Rule** | On a marketplace, **the sitemap gives structure and the feed gives velocity.** Compute `items ÷ timespan` for a listing rate — **one of the few hard numbers obtainable from outside.** Category tree depth and breadth measure the product mix separately |
| **Does not apply when** | Platforms with no public feed (usually closed or approval-gated). **Also this rate measures new additions, not the installed base** — it cannot be extrapolated to a total, and it cannot exclude spam or test listings |
| **How to check** | `curl -sL <domain>/robots.txt \| grep -i sitemap` — feeds are often declared among the sitemap lines |

## C-40 The take rate is in the API docs, and it's fragmented

| | |
|---|---|
| **Premise** | Two-sided marketplace charging sellers a transaction fee |
| **Action** | Looked for the pricing page to find the take rate |
| **Result** | The pricing page was a seller's storefront (C-38). The real trail was in the **developer documentation**: a fees endpoint returning "platform fees and processing fees", and three separate figures scattered through the index — an in-app-purchase rate quoted **directly against the app store's own 15–30%**, a referral commission, and a card cashback rate. **No single page stated "the platform take rate is X"** |
| **Mechanism** | The take rate must be queryable by developers (for reconciliation), **so it is always in the API**; but externally it is broken into scenario-specific numbers and framed as "cheaper than the alternative" |
| **Rule** | On a marketplace the fee trail runs **API docs → help centre → seller agreement → and only then the pricing page.** Grep `fee`, `payout`, `commission`, `take rate`. ⚠️ **A single percentage is not the total take** — confirm which scenario it covers (payment method, region, business type) |
| **Does not apply when** | Platforms with no developer API (usually pure consumer marketplaces) — check the seller help centre and onboarding agreement instead |
| **How to check** | `curl -sL <docs domain>/llms.txt \| grep -inE 'fee\|payout\|commission'` |

## C-41 llms.txt comes in three species — identify which before reading

| | |
|---|---|
| **Premise** | The target site serves `/llms.txt` |
| **Action** | Read it across three different products |
| **Result** | Three entirely different artifacts: **① marketing copy** — full of "leading" and "pioneered", a press release written for machines; **② a documentation index** — a neutral page list; **③ an agent routing contract** — stating that developer questions should be answered from the docs index and MCP servers, that **marketing pages are positioning context only and must not be used to infer API behaviour**, and listing two MCP endpoints with their permission boundaries (one of which "can create, modify and delete real data") |
| **Mechanism** | There is no enforced specification, **so vendors write whatever they want**. What they write reveals how seriously they take the AI channel |
| **Rule** | **Identify the species first**: ① marketing → the content goes in the claims list, not the facts; ② index → use it as the path space; ③ routing contract → **follow its routing**, and treat **its existence as product intelligence** (this vendor treats agents as first-class users, and usually ships MCP) |
| **Does not apply when** | Sites with no `llms.txt` — fall back to `sitemap.xml`. ⚠️ **But still read the 404 page's JSON-LD** (C-02) |
| **How to check** | `curl -sL <domain>/llms.txt \| head -40` — are the opening paragraphs boasting, listing, or instructing? |

## C-42 The demand side is essentially unmeasurable — say so

| | |
|---|---|
| **Premise** | Two-sided marketplace; supply side enumerable, buyers not |
| **Action** | Got hard supply-side numbers (455 new listings/day, 897 categories) and attempted to proxy the demand side with site prominence rank |
| **Result** | Only a whole-site rank was obtainable, alongside comparable platforms. **But total site traffic includes buyers, sellers, and visits from storefront links sellers send their own customers** — **that number cannot be decomposed into demand-side size** |
| **Mechanism** | Buyers leave no public trace. Platforms don't publish GMV or buyer counts unless they list publicly or disclose while fundraising |
| **Rule** | **A two-sided report must explicitly declare the demand side unmeasured.** Never let total traffic stand in for buyer volume. What you can do is **use comparable platforms for relative position**, stating the proxy mixes both sides. ⚠️ **Single-side data cannot support a platform-health conclusion** — when supply grows and demand is unknown, the correct sentence is "the supply side is expanding rapidly; the demand side could not be verified" |
| **Does not apply when** | Platforms that publish GMV or buyer counts (public companies, or voluntary disclosers) — use the disclosed figures |
| **How to check** | Search the report for "users" and "scale" and ask of each: is this buyers, sellers, or both mixed together |

---

# VII. Blind spots

**These are the method's current gaps. Run it as normal when you hit one, but state in the report's boundaries that there is no field calibration for this case.**

| Blind spot | Why it matters | What kind of case would close it |
|---|---|---|
| **Still-open-core products** | C-32's paywall-in-a-directory was reconstructed from git history, not observed live | One full round on a product currently shipping a commercially licensed directory |
| **Marketplace listing and moderation rules** | What gets approved reveals what the platform optimises for | One round reading the seller onboarding and moderation policy end to end |
| **A fully blocked target site** | What remains when first-party evidence is entirely unavailable | One round working the fallback ladder to exhaustion and recording what survived |
| **Non-English, non-Chinese markets** | Reputation sources and search behaviour differ completely | One round in a market where the review platforms are local |
| **Longitudinal re-checks** | The method's own stability is unverified | Re-run on the same product after three months and diff the conclusions |

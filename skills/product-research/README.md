# product-research

The method pack. **Load `product_research_method` and give it a URL — that's the whole interface.**

This README is for humans and is not loaded by the agent.

## Files

| File | Role |
|---|---|
| `product-research-method.md` | **entry** — 10-step sequence, shape-specific branches, writing rules |
| `casebook.md` | 42 field cases, each with the boundary where its rule stops applying |
| `contract.json` | 20 completion requirements, machine-readable |
| `research-viewpoint.md` | loaded at step 0 — whose decision this serves |
| `market-landscape.md` | loaded at step 6 — peer gates, layering, scale proxies, gaps |
| `customer-proof.md` | loaded at step 7 — ICP and verbatim-quote discipline |
| `last-30-days.md` | loaded at step 8 — recent activity, dated |
| `assets/report-header.md` | report header template, unbranded by default |
| `i18n/zh/` | the Chinese originals (reference; not built) |

## Why only the entry is routable

The four sub-methods have empty `triggers` on purpose. When they all carried keywords, three competed for "competitors" and two for "market" — **the same request could land on a sub-method and skip the whole flow.** They are now loaded by name, at named steps.

The build fails if a pack has anything other than exactly one `entry: true`.

## Changing things

- A standard (how many, how few) → `contract.json`
- An approach (what to do, in what order) → `product-research-method.md`
- A lesson learned → `casebook.md`, all seven rows, **including the boundary**

Then `node scripts/build-skills.mjs`.

**Do not restate contract numbers in the method.** A duplicated copy always drifts; that has already happened once.

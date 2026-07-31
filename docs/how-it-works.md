# How it works

**English** · [简体中文](how-it-works.zh-CN.md) · [日本語](how-it-works.ja.md)
Four parts, each doing exactly one job.

```
 skills/product-research/
 ├── product-research-method.md   HOW    — 10-step sequence + shape branches
 ├── casebook.md                  WHY    — 42 field cases, each with its boundary
 ├── contract.json                ENOUGH — 20 completion requirements, machine-readable
 ├── research-viewpoint.md        \
 ├── market-landscape.md           |     sub-methods, loaded by name at named steps
 ├── customer-proof.md             |
 └── last-30-days.md              /
        │
        ▼
 scripts/check-report.mjs         ENFORCE
```

**They don't overlap, and that's the whole design.** The method contains no numbers — those live in the contract. The contract contains no reasoning — that lives in the casebook. Change a standard → edit the contract. Change an approach → edit the method. Add a lesson → add a case. Nothing has to be kept in sync by hand, because nothing is duplicated.

## Routing

Only the entry method is keyword-routable. **The four sub-methods have empty triggers and are loaded by name, at the step that needs them.**

That is deliberate. When every file carried triggers, three of them competed for "competitors" and two for "market" — **the same request could land on a sub-method and bypass the entire flow.** The build now fails if a pack has anything other than exactly one `entry: true`.

```bash
node scripts/build-skills.mjs          # writes skills/catalog.json and dist/skills.generated.ts
node scripts/build-skills.mjs --check  # CI: fails if generated output is stale
```

⚠️ `--check` exists because an embedded copy of a skill once silently truncated to 40% of the source, with paragraphs cut mid-sentence, and ran that way for a long time before anyone noticed.

## The contract

The method holds roughly 69 hard requirements across roughly 63 sections. **A checklist at the end of a long document does not get run** — four separate requirements went missing for multiple rounds each, and one was caught only by the checker, never by a human reviewer.

So the standards moved out of prose into `contract.json`, which the checker executes. Of the 20 steps:

- **12 are decided automatically** from the report text — counting embedded images, counting dated quotes, counting rows in the claims table, checking the company fields are present
- **8 require declaration** in the evidence manifest, because they describe the research rather than the artifact
- **3 are shape-specific** and fire only from an explicitly declared `shape`
- **1 is viewpoint-specific** (layering is required for founder and investor reports)

## The checker

```bash
node scripts/check-report.mjs report.md
```

Two passes in one run:

**Completion** — every contract step, reported as met / unmet / undeclared / exempted.

**Hygiene** — inline HTML, internal method names, internal jargon, work-log phrasing, "to be tested" tables, unreplaced placeholders, and example bleed.

Example bleed is a **warning, not an error**, on purpose. The check cannot distinguish a name lifted from the method document from a name genuinely researched this round — **only a human can.** As a hard block it once flagged three companies in one report that had all been freshly researched that day. **A checker that forces you to delete real evidence is worse than the problem it solves.**

Branding is opt-in. Set `BRAND_HEADER` to a regex your report header must match; unset, the rule does nothing.

## Adding a pack

```
skills/<pack-name>/
├── README.md          for humans, not loaded
├── <entry>.md         entry: true in the frontmatter
└── <member>.md        loaded by name from inside the entry
```

Frontmatter requires `name`, `version`, `description`. Entries also require `triggers`; **members must not have them** — the build rejects a pack without exactly one entry, and members are unreachable by keyword by design.

`description` is the only thing the model sees when routing. **Write what kind of request should come here, not what the file contains.**

Folders beginning with `_` are ignored, for archives and work in progress.

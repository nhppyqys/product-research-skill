# Contributing

## The most valuable thing you can contribute is a case

Not a feature. A case.

This method is entirely made of recorded failures. Every rule in it exists because following the obvious approach produced a wrong answer at least once. **If you run it and it fails you, that failure is worth more than any refactor.**

[Open a case issue →](../../issues/new?template=new-case.yml)

### Seven fields, no exceptions

| Field | What goes in it |
|---|---|
| **Premise** | The product shape and the conditions that held |
| **Action** | What you did |
| **Result** | What happened — **including the wrong conclusion, if you reached one** |
| **Mechanism** | Why, stated generally |
| **Rule** | What to do instead, with no product names or specific numbers |
| **Does not apply when** | Where following the rule makes things worse |
| **How to check** | A command or quick test for whether this applies to a new target |

**Premise and "Does not apply when" are the two that get PRs rejected**, and it isn't a process rule. A case without them hands over a specific conclusion with none of the conditions that make it true — and it gets carried into unrelated work as fact.

That has been measured. An early case recorded only "probing `/customers` returned 404". In cross-model testing, a model wrote *"no customer case page (`/customers` returns 404)"* into a report about a completely unrelated product, where that path had never been probed. It reproduced in 2 of 3 runs. See [C-28](skills/product-research/casebook.md).

**A half-told case is more dangerous than no case.**

### Where cases are most needed

The coverage table in the README marks which product shapes are thin. Right now the gaps are:

- **A product that is still open-core** — the paywall-in-a-directory case was reconstructed from git history, never observed live
- **Marketplace listing and moderation rules**
- **A target site that blocks everything** — what survives when the fallback ladder is exhausted
- **Markets where the review platforms are not English or Chinese**
- **A longitudinal re-check** — same product, three months later, diff the conclusions

## Reporting checker false positives

[Open a false-positive issue →](../../issues/new?template=checker-false-positive.yml)

**These are treated as real bugs.** A checker that cries wolf gets ignored, and an ignored checker is worse than no checker.

One rule has already been downgraded from error to warning for this reason: the example-bleed check flagged three companies in one report that had all been freshly researched that day. It cannot distinguish a name lifted from the method document from one genuinely researched — **only a human can** — so it warns and lets a person decide.

## Editing the method

**Which file to touch:**

| You want to change | Edit |
|---|---|
| A standard (how many, how few, what's required) | `contract.json` |
| An approach (what to do, in what order) | `product-research-method.md` |
| A lesson learned | `casebook.md` |
| Something specific to landscape / reviews / viewpoint / recent changes | the matching sub-method |

**Do not restate contract numbers in the method.** A duplicated copy always drifts — that has already happened once. The method explains *why*; the contract holds *how much*.

Then:

```bash
node scripts/build-skills.mjs        # regenerate catalog and module
node scripts/build-skills.mjs --check # verify they aren't stale
node scripts/check-report.mjs docs/examples/sample-report.md  # smoke test
```

### Adding a pack

```
skills/<pack-name>/
├── README.md          for humans, not loaded
├── <entry>.md         entry: true in frontmatter
└── <member>.md        loaded by name from inside the entry
```

Frontmatter requires `name`, `version`, `description`. Entries also require `triggers`; **members must not have them.** The build rejects a pack without exactly one entry.

`description` is the only thing a model sees when routing. **Write what kind of request should arrive here, not what the file contains.**

## Translations

Method files exist in English (`skills/product-research/`) and Chinese (`i18n/zh/`). If you translate into another language, put it under `i18n/<code>/`.

The checker's detection patterns are bilingual. **If you add a language, the patterns in `contract.json` and the hygiene rules in `check-report.mjs` need your language too**, or the checker will silently pass reports it should flag.

## Style

The method is written to be read by a model and by a person, in that order. It follows its own rules:

- **Plain language.** Any technical term gets a gloss on first use
- **Every rule carries its failure.** A rule with no recorded failure behind it tends not to be followed, because nobody knows what it's defending against
- **State boundaries.** "This does not apply when…" is not hedging; it is what stops a rule being over-applied

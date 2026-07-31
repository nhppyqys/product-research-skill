# Evidence manifest

**English** · [简体中文](evidence-manifest.zh-CN.md) · [日本語](evidence-manifest.ja.md)
Some completion requirements cannot be read off a finished report. How many paths you probed, how many case studies you read, whether you skimmed the vendor's video channel — **those describe the research, not the artifact.** Only the researcher can declare them.

So they live in a sibling file, `<report>.evidence.json`, which **never ships with the report.** The checker picks it up automatically.

```json
{
  "shape": "self-serve SaaS",

  "pathSpace": [
    "sitemap.xml: 223 URLs",
    "robots.txt: 7 Disallow entries, 8 sitemap declarations",
    "llms.txt: 404 (payload still carried JSON-LD)"
  ],

  "probedPaths": ["/pricing 200", "/docs 200", "/security 404", "..."],
  "openedIndexPages": ["/pricing (rendered, all tiers stepped through)", "/limits", "/errors"],
  "caseStudiesRead": ["acme-corp 2026-05", "globex 2026-03", "initech 2025-11"],
  "peerPricingPages": ["a.com/pricing", "b.com/pricing", "c.com/pricing"],
  "videoChannelChecked": "youtube.com/@vendor — 25 titles skimmed, 2 downloaded for frames",

  "skipped": {
    "case-studies": { "reason": "absent", "note": "no case study page on the site" }
  }
}
```

## `shape` is required for shape-specific steps

Three contract steps only apply to certain product shapes — licence teardown for open source, supply-side and demand-side for marketplaces. **They fire from this field and are never guessed from the report text.**

⚠️ An earlier version inferred shape by keyword-matching the report. A word as common as "market" triggered the marketplace-only steps on an ordinary SaaS report. **The cost of guessing wrong is a false alarm, and false alarms teach people to ignore alarms.**

With no `shape` declared, those steps are skipped and the checker says so.

## Skipping a step

Three reasons exist. Anything else is recorded as unmet.

| `reason` | Means |
|---|---|
| `blocked` | Every fallback channel was tried and failed. **State which ones and what each returned.** |
| `absent` | The thing genuinely doesn't exist — no mobile app means no app store reviews |
| `incapable` | The environment genuinely can't do it. **You must have actually tried, and must quote the command and the error.** |

⚠️ `incapable` carries that warning because it was abused for five consecutive rounds: a screenshot section left empty every time, justified as "no rendering capability in this environment", **never once attempted.** The sixth round tried and it worked immediately.

**"Ran out of steam" and "over budget" are not on the list.** If the budget is genuinely short, narrow the scope — research one fewer competitor — rather than doing every item halfway.

## Running it

```bash
node scripts/check-report.mjs report.md                      # picks up report.evidence.json
node scripts/check-report.mjs report.md --manifest other.json
```

Four states per step:

```
✓ met        ✗ unmet        ? undeclared        ⊘ exempted
```

Exit code 1 when anything is unmet or a hygiene error is present.

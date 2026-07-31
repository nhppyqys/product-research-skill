---
name: last_30_days
version: 2.0.0
description: 检索近一个月的产品更新、发布、新闻与公开用户反馈。问到近期动态、更新、评价或市场反应时加载。
triggers: [最近30天, 近一个月, 近期, 更新, 新闻, 用户反馈, last 30 days, recent, release, changelog, reviews]
upstream: https://github.com/mvanhorn/last30days-skill
license: MIT
---

# Last 30 Days Product Intelligence

Adapted from `mvanhorn/last30days-skill`. Load only when the question asks about recent product changes, news, user feedback, market reactions, or what changed in the last 30 days.

## Scope

- The evidence window is the current date minus 30 days through the current date.
- Use `search` with `freshness=month`; the skill itself is methodology, not evidence.
- Search public sources the search API can discover. Do not claim coverage of Reddit, X, YouTube, TikTok, or another platform unless returned evidence actually comes from that platform.
- The upstream local Python engine and optional browser-cookie/API integrations are not part of this adaptation.
- Never treat a search snippet as a verified product fact when the source page can be read.

## Research Lanes

Choose only the lanes relevant to the user's question. Usually two or three focused searches are enough.

1. **First-party change lane**: changelog, release notes, documentation changes, newsroom, official blog, pricing or product announcements.
2. **User reaction lane**: recent reviews, public discussions, complaints, migration posts, community threads, or launch comments.
3. **Independent news lane**: reputable reporting, partner announcements, analyst coverage, or market events.

## Query Pattern

- Include the exact product and company identity.
- Add one intent at a time: `release notes`, `changelog`, `new feature`, `review`, `complaint`, `migration`, `news`, or a close language equivalent.
- Set `freshness=month` instead of relying only on date words in the query.
- If the product is ambiguous, resolve identity before searching reactions.

## Evidence Rules

- Record a date only when the source explicitly provides one.
- Separate product updates, user feedback, news, and market changes.
- Treat engagement counts and sentiment as directional unless the platform and measurement are explicit.
- One anecdote is not broad sentiment. Describe the source and sample limitation.
- If no result is found, say `not found in the searched public sources`; do not say the event did not happen.
- Every recent signal must cite one or more observed `SRC_...` IDs.

## Output

Add a compact `recentSignals` array to the final report:

```json
{
  "date": "explicit date when available",
  "type": "product_update|user_feedback|news|market_change",
  "title": "short finding",
  "summary": "what changed and why it matters, with [SRC_xxxxxxxx]",
  "sourceIds": ["SRC_xxxxxxxx"]
}
```

Keep at most eight signals, newest or most decision-relevant first. Do not create an empty recent section when the question did not request recent information.

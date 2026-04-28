# Team 13 — Data / Analytics

**Charter:** measures whether anything is working. Owns retrieval quality, model evals, performance benchmarks, and the answer to "show me the numbers."

## Roster

| Skill | Source | What it does |
|---|---|---|
| `query` | tbrain | The brain's hybrid-search front door (shared with Sales — different use). Use for ad-hoc analytical queries. |
| `reports` | tbrain | Generate timestamped, keyword-routed analytical reports. |
| `/benchmark` | astack | Performance regression detection. |
| `/benchmark-models` | astack | Compare models on the same prompt — quality regression detection. |
| **BrainBench** | external | Public benchmark for personal-knowledge agent stacks. Lives in [github.com/astack/astack-evals](https://github.com/astack/astack-evals) — install separately when running evals. |
| `eval` (gbrain CLI) | tbrain | `gbrain eval`: single-run table + A/B config comparison over a retrieval qrels set. |

## When to invoke this team

- Tweaking retrieval (chunker, embedding model, source-boost map) → run `gbrain eval` before AND after.
- Suspected performance regression → `/benchmark`.
- Picking between Opus / Sonnet / Haiku for a workflow → `/benchmark-models`.
- Quarterly review → pull `reports` + retrieval-quality dashboard.

## Rules of the room

- **A/B before believing.** Any retrieval change is a benchmark, not a vibe.
- **Don't chase one metric.** Precision@k, Recall@k, MRR, nDCG@k — they tell different stories.
- **Source-aware eval.** Curated content (originals/, concepts/, writing/) vs bulk content (chats, daily notes) get different boost factors. See `gbrain/src/core/search/source-boost.ts`.

## Handoffs

- ← every team produces measurable output; Data measures it.
- → **Executive (01)** + **Product (02)** consume the dashboards.
- ↔ **Engineering (03)** when a regression has a code root cause.

## Brain pages this team writes

- `/brain/analytics/{topic}-{date}.md` — analytical reports
- `/brain/evals/{run-id}.md` — eval-run output

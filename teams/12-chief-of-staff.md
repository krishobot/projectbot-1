# Team 12 — Chief of Staff / Operations

**Charter:** the org's plumbing. Owns ingest pipelines, conventions, schedules, brain maintenance, and session continuity. Nobody invokes this team for new work — they keep the lights on so other teams can do new work.

## Roster

| Skill | Source | What it does |
|---|---|---|
| `ingest` | gbrain | Thin router that detects input type and delegates to specialized ingestion skills. |
| `maintain` | gbrain | Brain maintenance: dedup, link repair, embedding refresh, orphan detection. |
| `conventions` | gbrain | Cross-cutting rules: quality, brain-first lookup, model routing, test-before-bulk. |
| `repo-architecture` | gbrain | Filing rules — what page goes where, by primary subject. |
| `cron-scheduler` | gbrain | Schedule staggering, quiet hours, idempotency for recurring jobs. |
| `minion-orchestrator` | gbrain | Background-work skill: shell jobs (`gbrain jobs submit shell`) + LLM subagents (`gbrain agent run`). Parent-child DAGs, depth caps, timeouts. |
| `/context-save` | gstack | Save current Claude Code session context to disk. |
| `/context-restore` | gstack | Resume from a saved session. |
| `/retro` | gstack | Shared with Executive — Chief of Staff runs the operational half. |
| `/health` | gstack | gstack health dashboard. |

## When to invoke this team

- Brain feels stale → `maintain`.
- Adding a recurring job (daily scrape, weekly digest, hourly sync) → `cron-scheduler`.
- Long-running background work (rebuild embeddings, batch enrichment) → `minion-orchestrator`.
- Switching machines / pausing a session → `/context-save` then `/context-restore` later.
- Anyone violates a filing rule → `repo-architecture`.

## Rules of the room

- **Conventions are read before every write.** That's the whole point of `gbrain/skills/conventions/` — they're cross-cutting rules every other skill references.
- **Single writer per file.** Enforced at the org level; this team is the cop.
- **Quiet hours.** No automated outbound between 10 pm – 8 am local. `cron-scheduler` enforces.
- **Minions for anything that takes > 60 seconds.** Don't tie up the foreground agent on bulk work.

## Handoffs

- → every other team consumes Chief of Staff infrastructure.
- ← **Security (08)** sets policy on what can run in `minion-orchestrator`.
- ↔ **DevEx (07)** for environment, hosts.

## Brain pages this team writes

- `/brain/conventions/*.md` — cross-cutting rules (synced from `gbrain/skills/conventions/`)
- `/brain/runbooks/maintenance.md`
- `/brain/cron/*.md` — every scheduled job

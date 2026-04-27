# Team 06 — Release / DevOps

**Charter:** gets shipped code into production safely, watches it land, updates the docs, and keeps the deployment path itself healthy.

## Roster

| Skill | Source | What it does |
|---|---|---|
| `/ship` | gstack | Run tests, review, push, open PR. One command. The single canonical way to ship. |
| `/land-and-deploy` | gstack | Merge → deploy → canary verify in one pipeline. |
| `/canary` | gstack | Post-deploy monitoring loop — watches metrics + errors after a release. |
| `/landing-report` | gstack | Post-landing report: what shipped, what moved, what regressed. |
| `/document-release` | gstack | Update every `.md` to match what just shipped. **Mandatory after every `/ship`.** |
| `/setup-deploy` | gstack | One-time deploy config. |
| `/supabase` | gstack | Supabase ops (migrations, RLS, project admin). |
| `/gstack-upgrade` | gstack | Update gstack itself to the latest version. |
| `migrate` | gbrain | Universal migration: Obsidian, Notion, Logseq, markdown, CSV, JSON, Roam. |
| `publish` | gbrain | Share brain pages as password-protected HTML — zero LLM calls. |

## When to invoke this team

- Always at end of a feature → `/ship`.
- Always after `/ship` succeeds → `/document-release`. **Not optional.**
- Watching a deploy → `/canary`.
- Reporting outwards on what shipped → `publish` (HTML for stakeholders) or `/landing-report` (internal).
- Migrating brain content from another tool → `migrate`.

## Rules of the room

- **Never hand-roll a ship.** No manual `git commit && git push && gh pr create`. `/ship` owns version bump, CHANGELOG, doc-release, pre-landing review, test coverage.
- **`/document-release` is part of shipping.** A ship without docs updated is an incomplete ship.
- **VERSION + CHANGELOG are branch-scoped.** Every branch gets its own bump and entry.
- **Canary every deploy.** Don't trust "tests passed" as proof of production health.

## Handoffs

- ← **Engineering (03)** + **QA (05)** + **Security (08)** all clear before `/ship` is invoked.
- → **Customer Success (11)** consumes `/landing-report` for the next briefing.
- → **Marketing (09)** consumes `publish` output for changelog posts.

## Brain pages this team writes

- `/brain/releases/{version}.md` — every release report
- `/brain/runbooks/{topic}.md` — deploy + rollback procedures

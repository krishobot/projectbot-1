# astack — The Org Chart

Thirteen teams. Every astack skill (the role layer) and tbrain skill (the memory layer) is owned by exactly one team — single owner, multiple readers. The single-writer-per-file rule applied to roles.

## One-page map

| # | Team | Owns the decision | Lead astack skills | Lead tbrain skills |
|---|------|-------------------|--------------------|--------------------|
| 01 | **Executive Office (CEO)** | Vision, scope, "is this worth building" | `/office-hours` `/plan-ceo-review` `/plan-tune` `/autoplan` `/retro` | `briefing` `daily-task-prep` `soul-audit` |
| 02 | **Product** | What to build next, in what order | `/office-hours` `/plan-ceo-review` `/plan-tune` | `idea-ingest` `signal-detector` |
| 03 | **Engineering** | Architecture, implementation, second opinions | `/plan-eng-review` `/pair-agent` `/codex` `/investigate` `/learn` | `skill-creator` `skillify` |
| 04 | **Design** | Visual system + UX polish | `/design-consultation` `/plan-design-review` `/design-review` `/design-shotgun` `/design-html` | — |
| 05 | **QA & Quality** | Does it actually work in a real browser | `/qa` `/qa-only` `/browse` `/investigate` `/benchmark` `/benchmark-models` | `testing` `smoke-test` `cross-modal-review` |
| 06 | **Release / DevOps** | Get it shipped, watch it land | `/ship` `/land-and-deploy` `/canary` `/landing-report` `/document-release` `/setup-deploy` `/supabase` `/astack-upgrade` | `migrate` `publish` |
| 07 | **DevEx** | Developer experience, environment, hosts | `/plan-devex-review` `/devex-review` `/setup` `/setup-browser-cookies` `/setup-tbrain` `/open-astack-browser` `/connect-chrome` `/openclaw` `/pair-agent` | — |
| 08 | **Security & Trust (CSO)** | Threats, destructive ops, freeze gates | `/cso` `/careful` `/freeze` `/guard` `/unfreeze` | `frontmatter-guard` `citation-fixer` |
| 09 | **Marketing** | Outbound content, brand, signal capture | — | `signal-detector` `idea-ingest` `media-ingest` `publish` `webhook-transforms` |
| 10 | **Sales / BD** | Pipeline of people, companies, deals | — | `brain-ops` `enrich` `query` `data-research` `meeting-ingestion` |
| 11 | **Customer Success** | Daily ops, briefings, reports for stakeholders | — | `daily-task-manager` `daily-task-prep` `briefing` `reports` |
| 12 | **Chief of Staff / Operations** | Plumbing: ingest, conventions, schedules, context | `/context-save` `/context-restore` `/retro` `/health` | `ingest` `maintain` `conventions` `repo-architecture` `cron-scheduler` `minion-orchestrator` |
| 13 | **Data / Analytics** | Measurement, retrieval quality, eval harnesses | `/benchmark` `/benchmark-models` | `query` `reports` (+ BrainBench in the `astack-evals` sibling repo) |

`AGENTS.md` and `CLAUDE.md` in each cloned skill repo are the authoritative skill catalogs. This table is the org's view of where each skill works.

## How handoffs flow

The default lifecycle of a piece of work:

```
                 Executive (01)
                      │
                      ▼
                  Product (02)            ◀── Marketing (09) feeds ideas
                      │                       Sales (10) feeds requests
                      ▼
        ┌────── Engineering (03) ───────┐
        │             │                  │
        ▼             ▼                  ▼
     Design (04)   QA (05)         Security (08)
        └─────────────┬─────────────────┘
                      ▼
                 Release (06)
                      │
                      ▼
              Customer Success (11) ─── reports out to ─── Sales (10) + Marketing (09)
                      │
                      ▼
                   Retro (01)
```

DevEx (07), Chief of Staff (12), and Data (13) are **horizontal** teams — every other team consumes their output. They don't sit in the lifecycle, they support it.

## The four rules every team follows

The astack ethos, applied org-wide:

1. **Markdown is source of truth.** Decisions, plans, and entity records live in markdown files in your configured brain dir. Not in chat history, not in tickets.
2. **Single writer per file.** One team owns each brain page; others read. If two teams need to write, split the page.
3. **Append-only evidence trails.** Editable summary at top, immutable timeline below — the compiled-truth pattern.
4. **No fabricated facts.** Every claim — engagement number, deal size, user feedback — links back to a scraped permalink, an email, a meeting transcript, or an explicit user statement.

## Where to start

- New product idea? → **`teams/01-executive.md`** → `/office-hours`
- Got a bug? → **`teams/05-qa-quality.md`** → `/investigate`
- Ready to ship? → **`teams/06-release-devops.md`** → `/ship`
- Onboarding to the org? → Read teams 01, 03, 06, 12 in order.

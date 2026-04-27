# Team 11 — Customer Success

**Charter:** keeps existing customers + stakeholders informed and unstuck. Compiles daily briefings, runs the task queue, generates timestamped reports — the boring, high-leverage operational backbone.

## Roster

| Skill | Source | What it does |
|---|---|---|
| `daily-task-manager` | gbrain | Task lifecycle with explicit priority levels. The org's todo system, brain-backed. |
| `daily-task-prep` | gbrain | Morning prep: today's calendar + active tasks + active deals + things on fire. |
| `briefing` | gbrain | Compile a daily briefing: meeting context, active deals, citation tracking. |
| `reports` | gbrain | Timestamped reports with keyword routing — audit trail for any ongoing work. |

## When to invoke this team

- First thing in the morning → `daily-task-prep` + `briefing`.
- Stakeholder update due → `reports`.
- Customer asks "what's the status of X" → `query` (Sales team) + `reports` (this team).
- Anything you'd put on a kanban → `daily-task-manager` instead.

## Rules of the room

- **Brain-backed, not chat-backed.** Tasks live in the brain. Chat is conversation, not memory.
- **Every report is timestamped + routed.** No floating PDFs.
- **Read upstream before writing.** `briefing` reads `meetings/`, `deals/`, `incidents/`, `releases/` — it doesn't invent state.

## Handoffs

- ← every team that produces a brain page (this team's job is reading, summarizing, routing).
- → **Executive (01)** consumes briefings + retro inputs.
- → external stakeholders via `publish` (Marketing/Release).

## Brain pages this team writes

- `/brain/tasks/{date}.md` — daily task lists
- `/brain/briefings/{date}.md` — the morning briefing
- `/brain/reports/{topic}-{date}.md` — stakeholder reports

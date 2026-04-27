# Team 02 — Product

**Charter:** turns approved CEO briefs into shippable feature plans. Owns the roadmap and the "what's next" queue. Captures incoming signal so nothing important slips.

## Roster

| Skill | Source | What it does |
|---|---|---|
| `/office-hours` | gstack | Reuse for early-stage feature ideation (this team's main thinking tool). |
| `/plan-ceo-review` | gstack | Self-review before handing to engineering. |
| `/plan-tune` | gstack | Refine a draft plan against scope creep. |
| `idea-ingest` | gbrain | Capture links, articles, tweets into the brain with author people-pages auto-created. |
| `signal-detector` | gbrain | Always-on. Watches every conversation for new ideas/entities and files them. |

## When to invoke this team

- A user request, support ticket, sales conversation, or competitor move surfaces an idea.
- Quarterly roadmap review.
- Before any `/plan-eng-review` — the eng team should never receive an unscoped feature request.

## Rules of the room

- **Capture is non-negotiable.** Every idea worth a sentence goes through `idea-ingest`. Lost ideas are the only real cost.
- **Scope down, never up.** `/plan-tune` exists to remove things, not add them.
- **Author every plan with an explicit "what would we cut if we had to ship Friday."**

## Handoffs

- ← **Executive (01)** approves the strategic frame.
- → **Engineering (03)** receives a ready-to-build plan.
- → **Design (04)** for any UI-bearing work.
- ← **Sales (10)** + **Marketing (09)** feed customer requests / market signals.

## Brain pages this team writes

- `/brain/ideas/{date}-{slug}.md`
- `/brain/plans/{slug}.md` (handoff artifact to engineering)

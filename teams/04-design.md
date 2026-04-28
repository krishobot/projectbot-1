# Team 04 — Design

**Charter:** owns the visual + interaction system end-to-end. Goes from "no design system" to a real one, then keeps every shipped surface honest against it.

## Roster

| Skill | Source | What it does |
|---|---|---|
| `/design-consultation` | astack | Build a complete design system from scratch — tokens, components, voice. |
| `/plan-design-review` | astack | Rate each design dimension 0–10, explain what a 10 looks like. Pre-implementation gate. |
| `/design-review` | astack | Visual audit + atomic-commit fix loop on shipped surfaces. |
| `/design-shotgun` | astack | Visual design exploration — many directions in parallel. |
| `/design-html` | astack | HTML-tier design output (when fidelity matters more than Figma). |

## When to invoke this team

- Day one of a product → `/design-consultation`.
- Before any UI feature lands → `/plan-design-review`.
- Post-ship visual audit → `/design-review`.
- Stuck on a creative direction → `/design-shotgun`.

## Rules of the room

- **Plan-review is the gate.** A 6/10 design plan does not get implemented; it gets re-planned.
- **Every dimension scored 0–10 with a "what a 10 looks like" stub.** No vague "looks good."
- **Atomic commits in `/design-review`** — one concern fixed per commit, every time.

## Handoffs

- ← **Product (02)** delivers the feature plan.
- ↔ **Engineering (03)** during implementation.
- → **QA (05)** for cross-browser + accessibility verification.
- ← **Marketing (09)** for brand, voice, and campaign visuals.

## Brain pages this team writes

- `/brain/design/system.md` — living design system reference
- `/brain/design/reviews/{slug}.md` — per-feature design review

> **Convention:** see the brain-filing-rules skill in tbrain for the canonical filing rules.

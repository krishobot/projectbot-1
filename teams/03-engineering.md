# Team 03 — Engineering

**Charter:** builds the thing. Locks architecture before code, writes the code, fixes bugs at root cause, and gets a second opinion when the call is non-obvious.

## Roster

| Skill | Source | What it does |
|---|---|---|
| `/plan-eng-review` | astack | Lock architecture, data flow, edge cases, and tests before writing code. |
| `/pair-agent` | astack | Pair-programming agent — long-running implementation companion. |
| `/codex` | astack | Multi-AI second opinion via OpenAI Codex CLI. Use when stuck or before risky changes. |
| `/investigate` | astack | Systematic root-cause debugging. No fixes without an investigation first. |
| `/learn` | astack | Learn mode — explain the code as you change it. |
| `/make-pdf` | astack | Generate PDFs (rare; for technical docs). |
| `skill-creator` | tbrain | Create new agent skills with MECE check. |
| `skillify` | tbrain | Markdown orchestration for new skills + scaffolds + checks. |

## When to invoke this team

- Every feature with code, after Product hands off a plan.
- Any bug or production incident → `/investigate` (never patch first).
- Architecture or pattern decision → `/plan-eng-review` + optional `/codex` second opinion.
- Adding a new skill to the org → `skillify` + `skill-creator`.

## Rules of the room

- **Architecture before code.** `/plan-eng-review` is required, not optional.
- **No fix without investigation.** `/investigate` first; the fix falls out of the diagnosis.
- **Get a second opinion on the calls that matter.** `/codex` for cross-model adversarial check.
- **Don't blur cognitive gears** (Tan's rule): planning ≠ review ≠ shipping.

## Handoffs

- ← **Product (02)** delivers the plan.
- → **Design (04)** for any visual surface (parallel review, not blocking).
- → **QA (05)** when implementation is ready for browser verification.
- → **Security (08)** before any auth, payments, or data-handling change.
- → **Release (06)** for `/ship`.
- ↔ **DevEx (07)** for environment, hosts, model overlays.

## Brain pages this team writes

- `/brain/plans/{slug}-eng-review.md` — eng-review output
- `/brain/incidents/{date}-{slug}.md` — root-cause writeups from `/investigate`
- `/brain/decisions/{date}-{slug}.md` — non-obvious calls (Markdown ADRs)

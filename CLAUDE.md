# astack — Workspace Boundary

This file is read automatically by Claude Code in any session whose working directory is the astack root (or a subdirectory). The rules below are non-negotiable for any agent operating here.

## Hard isolation

This workspace is **isolated** from every other project on this machine. Specifically:

- **Never read or write** any file outside this workspace, except:
  - The user's `~/.claude/` directory — own Claude Code config (read-only by default).
  - The gbrain CLI wrapper script and global config (read-only unless the user explicitly approves a change).
- **Never touch any path listed in `CLAUDE.local.md`** — that file enumerates the user's off-limits directories (production apps, other workspaces, sandboxes). It must exist before any non-read-only operation.

If `CLAUDE.local.md` does not exist, treat ALL paths outside this workspace as off-limits by default.

## Brain (tbrain) isolation

The tbrain database for this workspace lives at `./.gbrain/brain.pglite` (or the Supabase project configured in `~/.gbrain/config.json`). **Do not** ingest, sync, or import data from outside `./brain/` into this database without explicit user approval per session.

If a different project on this machine ever needs its own brain, it gets its own `.gbrain/` directory and its own config — never share databases across projects.

## What this workspace is for

Building and dogfooding **astack + tbrain** — a virtual-company-as-a-skill-pack on top of Garry Tan's GStack and GBrain. See `README.md` and `ORG.md`.

## Skills

GStack skills (`/office-hours`, `/ship`, `/qa`, etc.) are globally invokable on this machine after `./setup` ran. They are **tools, not autonomous agents** — they only act when explicitly invoked. The boundary above still applies: a skill invoked in this workspace must not write outside it.

## Voice + style

- Direct, terse. No filler, no trailing summaries.
- No fabricated metrics — every claim links to a real source.
- Drafts only on customer-facing artifacts; the founder sends.
- Push back on bad ideas; don't dance around them.

## Identity files (read these next)

The org's identity is in four files under `brain/identity/`. For a fresh install, copy the `.example` files from `brain.template/identity/` into your local `brain/identity/` and fill in the placeholders:

1. `USER.md` — who the founder is, how they work, what they're building.
2. `SOUL.md` — what this org is, why it exists, the four rules everyone follows.
3. `ACCESS_POLICY.md` — what humans can do, what agents can do, escalation path.
4. `HEARTBEAT.md` — daily / weekly / monthly cadence.

Read those before doing any non-trivial work in this workspace. If they don't exist yet, run `gbrain soul-audit` for an interview-style guided setup or copy the `.example` files manually.

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# astack — Workspace Boundary

This file is read automatically by Claude Code in any session whose working directory is the astack root (or a subdirectory). The rules below are non-negotiable for any agent operating here.

## Hard isolation

This workspace is **isolated** from every other project on this machine. Specifically:

- **Never read or write** any file outside this workspace, except:
  - The user's `~/.claude/` directory — own Claude Code config (read-only by default).
  - The tbrain CLI wrapper script and global config (read-only unless the user explicitly approves a change).
- **Never touch any path listed in `CLAUDE.local.md`** — that file enumerates the user's off-limits directories (production apps, other workspaces, sandboxes). It must exist before any non-read-only operation.

If `CLAUDE.local.md` does not exist, treat ALL paths outside this workspace as off-limits by default.

## Brain (tbrain) isolation

The tbrain database for this workspace lives at `./.gbrain/brain.pglite` (the on-disk dir keeps its current name for now; the brand is tbrain) or in the Supabase project configured in `~/.gbrain/config.json`. **Do not** ingest, sync, or import data from outside `./brain/` into this database without explicit user approval per session.

If a different project on this machine ever needs its own brain, it gets its own `.gbrain/` directory and its own config — never share databases across projects.

## What this workspace is for

Building and dogfooding **astack + tbrain** — a 13-team agent workspace + persistent markdown brain. See `README.md` and `ORG.md`.

## Architecture (big picture)

Three layers wired together. Reading any one in isolation will mislead you — the seams are where the design lives.

1. **Org / role layer (`teams/`, `ORG.md`)** — Thirteen markdown manifests (`teams/01-executive.md` … `13-data-analytics.md`), one per team. Each manifest declares the team's charter, the astack/tbrain skills it owns, and the brain pages it writes. `ORG.md` is the index. The web console parses these files at request time via `web/src/lib/teams.ts` (regex-driven; the manifest format is load-bearing — see the `TEAM_TITLE`, `CHARTER_LINE`, `SKILL_LINE`, and `BRAIN_PAGES` regexes there before changing any team file's structure). The skill-line regex matches `astack | tbrain | external | —` as the source values.

2. **Memory layer (`brain/` + tbrain CLI)** — Markdown source-of-truth in `brain/<category>/*.md`, indexed into a Postgres + pgvector DB by the `tbrain` CLI (the `bin/tbrain` wrapper, available on PATH after setup; falls back to the underlying brain binary if the wrapper is missing). The DB lives at `.gbrain/brain.pglite` (local) or in a Supabase project per `~/.gbrain/config.json`. `brain.template/` holds the public skeleton (with `.example` identity files) used to seed a fresh tbrain. The four-rules ethos (markdown source of truth; single writer per file; append-only timeline; no fabricated facts) is enforced socially via the team manifests, not by code.

3. **Surface layer** — Two binaries that surface the org to a user:
   - **`web/`** — Next.js 16 + React 19 + Tailwind 4 SaaS console (App Router). Route groups split `/` (marketing) from `/app` (workspace). Reads `teams/*.md` from disk via `web/src/lib/teams.ts`, calls the local `tbrain stats` CLI via `web/src/lib/brain.ts`, talks to the desktop daemon via `web/src/lib/desktop.ts`, and uses Supabase SSR for auth (`web/src/lib/supabase/`). **Important**: `web/AGENTS.md` warns that this Next.js has breaking changes vs. training data — read `web/node_modules/next/dist/docs/` before writing Next.js code in `web/`, and heed deprecation notices.
   - **`desktop/`** — Bun-compiled local daemon (`@astack/desktop`) bound to `127.0.0.1:7331`. Bridges the web console to the local machine: `tbrain stats` proxy, terminal launching scoped to a team, and MCP auto-wiring into Claude Desktop / Claude Code config files. Bearer-token auth (token at `%APPDATA%\astack\desktop-token` on Windows, `~/.config/astack/desktop-token` elsewhere). Routes dispatch from `desktop/src/index.ts` to handlers under `desktop/src/routes/`. Both `health.ts` and `brain.ts` try the `tbrain` wrapper first and fall back to the underlying binary, so installs without the wrapper still work.

4. **Host configs (`hosts/`)** — Editor / agent host configs for the astack skill runner. `hosts/antigravity.ts` adds Google Antigravity as a host; copy it into the skill runner's `hosts/` and add it to `ALL_HOST_CONFIGS` in its `hosts/index.ts` before re-running `./setup --host antigravity`. The skill-runner and brain-CLI source directories are gitignored — they're installed via clone-and-patch, not vendored into this repo.

The data flow worth remembering: a team manifest in `teams/` is the contract; the web console renders it; the desktop daemon executes against it (launching a Claude session scoped to that team's skills); the brain stores the work product. Edit a team manifest carefully — both `web/src/lib/teams.ts` and the team-launching flow depend on its shape.

## Commands

### Web console (`web/`)

```bash
cd web
bun install              # uses bun.lock; npm install also works
bun run dev              # next dev — http://localhost:3000
bun run build            # next build
bun run start            # next start (after build)
bun run lint             # eslint (flat config in eslint.config.mjs)
```

Supabase auth is gated behind `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`; without them the sign-in nav link hides but the rest of the console still works.

### Desktop companion (`desktop/`)

```bash
cd desktop
bun run dev              # watch mode, listens on 127.0.0.1:7331
bun run start            # one-shot
bun run build            # bun --compile → ./bin/astack-desktop (current platform)
bun run build:all        # cross-compile windows-x64, darwin-arm64, linux-x64
```

`ASTACK_DESKTOP_PORT` overrides the port. `ASTACK_ROOT` overrides the workspace root the daemon reads `teams/` from. `ASTACK_ALLOWED_ORIGINS` (comma-separated) extends the CORS allow-list beyond the `localhost:3000` / `127.0.0.1:3000` defaults.

### tbrain (CLI, globally installed)

```bash
tbrain init --pglite     # local-only DB at ./.gbrain/brain.pglite
tbrain init --supabase   # hosted Postgres + pgvector
tbrain stats             # parsed by web console (Pages/Chunks/Embedded/Links)
tbrain sync              # re-index brain/ markdown into the DB
tbrain soul-audit        # interview-style identity-files setup
```

### One-time install (full astack + tbrain)

See `README.md` "Setup". The astack and tbrain wrapper CLIs live in `bin/`; add that directory to your PATH so `astack` and `tbrain` are globally invokable.

## Skills

astack skills (`/office-hours`, `/ship`, `/qa`, etc.) are globally invokable on this machine after `./setup` ran. They are **tools, not autonomous agents** — they only act when explicitly invoked. The boundary above still applies: a skill invoked in this workspace must not write outside it.

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

Read those before doing any non-trivial work in this workspace. If they don't exist yet, run `tbrain soul-audit` for an interview-style guided setup or copy the `.example` files manually.

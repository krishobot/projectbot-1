# Team 07 — DevEx

**Charter:** keeps every other team's environment fast, sane, and working. Owns hosts, model routing, browser glue, and the "how do I set this up on a new machine" question.

## Roster

| Skill | Source | What it does |
|---|---|---|
| `/plan-devex-review` | gstack | Plan-stage review of developer experience implications. |
| `/devex-review` | gstack | DX audit on shipped tooling — friction points, onboarding pain. |
| `/setup` | gstack | One-time gstack setup — build binaries, symlink skills. |
| `/setup-browser-cookies` | gstack | Import cookies from your real browser for authenticated testing. |
| `/setup-gbrain` | gstack | Wire gbrain into a gstack workspace. See `gstack/USING_GBRAIN_WITH_GSTACK.md`. |
| `/open-gstack-browser` | gstack | Launch the GStack Browser (extension + side panel + activity feed). |
| `/connect-chrome` | gstack | Connect Chrome to gstack (alias of `/open-gstack-browser`). |
| `/openclaw` | gstack | OpenClaw runtime / agent surface. |
| `/pair-agent` | gstack | Long-running pair-programming agent with tunnel-safe transport (v1.6+). |

## When to invoke this team

- New developer joins → `/setup` + `/setup-gbrain` + `/setup-browser-cookies`.
- Onboarding feels slow → `/devex-review`.
- New host (Cursor, Codex, Aider, etc.) needs gstack support → see `gstack/hosts/`.
- Running a pair session with someone remote → `/pair-agent`.

## Rules of the room

- **Setup is canonical.** If a step requires a sentence starting with "in your config, add..." — the setup script should be doing that edit.
- **Hosts are typed.** Adding a new agent host means adding a typed config under `gstack/hosts/`, not patching prompts.
- **Tunnels lock down by default.** `/pair-agent` ngrok tunnels run an allowlist; root tokens over the tunnel return 403.

## Handoffs

- → **Engineering (03)** consumes everything DevEx ships.
- ↔ **Chief of Staff (12)** for cron + minion config.
- ↔ **Security (08)** for tunnel + token policy review.

## Brain pages this team writes

- `/brain/runbooks/setup-{platform}.md`
- `/brain/devex/{topic}.md`

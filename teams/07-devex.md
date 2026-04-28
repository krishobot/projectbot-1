# Team 07 — DevEx

**Charter:** keeps every other team's environment fast, sane, and working. Owns hosts, model routing, browser glue, and the "how do I set this up on a new machine" question.

## Roster

| Skill | Source | What it does |
|---|---|---|
| `/plan-devex-review` | astack | Plan-stage review of developer experience implications. |
| `/devex-review` | astack | DX audit on shipped tooling — friction points, onboarding pain. |
| `/setup` | astack | One-time astack setup — build binaries, symlink skills. |
| `/setup-browser-cookies` | astack | Import cookies from your real browser for authenticated testing. |
| `/setup-tbrain` | astack | Wire tbrain into a astack workspace. See `astack/USING_GBRAIN_WITH_GSTACK.md`. |
| `/open-astack-browser` | astack | Launch the astack Browser (extension + side panel + activity feed). |
| `/connect-chrome` | astack | Connect Chrome to astack (alias of `/open-astack-browser`). |
| `/openclaw` | astack | OpenClaw runtime / agent surface. |
| `/pair-agent` | astack | Long-running pair-programming agent with tunnel-safe transport (v1.6+). |

## When to invoke this team

- New developer joins → `/setup` + `/setup-tbrain` + `/setup-browser-cookies`.
- Onboarding feels slow → `/devex-review`.
- New host (Cursor, Codex, Aider, etc.) needs astack support → see `astack/hosts/`.
- Running a pair session with someone remote → `/pair-agent`.

## Rules of the room

- **Setup is canonical.** If a step requires a sentence starting with "in your config, add..." — the setup script should be doing that edit.
- **Hosts are typed.** Adding a new agent host means adding a typed config under `astack/hosts/`, not patching prompts.
- **Tunnels lock down by default.** `/pair-agent` ngrok tunnels run an allowlist; root tokens over the tunnel return 403.

## Handoffs

- → **Engineering (03)** consumes everything DevEx ships.
- ↔ **Chief of Staff (12)** for cron + minion config.
- ↔ **Security (08)** for tunnel + token policy review.

## Brain pages this team writes

- `/brain/runbooks/setup-{platform}.md`
- `/brain/devex/{topic}.md`

# astack desktop companion

A tiny local daemon that the **astack web console** talks to. The web console runs in your browser; the desktop companion runs on your machine. Together they let you:

- Click "Launch terminal as Marketing" and a real Windows Terminal / iTerm / GNOME Terminal tab opens with Claude Code (or Antigravity) scoped to the Marketing team.
- Auto-wire the **tbrain MCP server** into your Claude Desktop / Claude Code config (no manual JSON pasting).
- Read brain stats and serve them to the web console without exposing the brain database to the public internet.

The daemon is a small Bun-compiled binary (~25 MB). One-time install. Runs on `127.0.0.1:7331` by default.

## Endpoints

| Method | Path                  | What it does |
|--------|-----------------------|--------------|
| GET    | `/health`             | Returns `{ok: true, version, platform, brainPath}`. Web console pings this on load. |
| GET    | `/brain/stats`        | Shells out to `gbrain stats`, returns parsed JSON. |
| GET    | `/teams`              | Reads `../teams/*.md`, returns the manifest list. |
| POST   | `/launch`             | Body: `{teamId}`. Spawns a terminal with claude/antigravity scoped to that team. |
| POST   | `/mcp/auto-wire`      | Body: `{client: "claude-desktop"\|"claude-code", server: "tbrain"}`. Backs up the config file, merges in the MCP entry, restarts the client if running. |
| GET    | `/mcp/status`         | Returns which Claude clients are detected and whether each has the tbrain server wired. |

## Security

The daemon binds to `127.0.0.1` only — never `0.0.0.0`. Requests must include an `Authorization: Bearer <token>` header. The token is generated on first start and stored at:
- Windows: `%APPDATA%\astack\desktop-token`
- macOS / Linux: `~/.config/astack/desktop-token`

The web console reads this token from a one-time setup flow (the user pastes the token from a CLI command into the console once; thereafter it's stored in the browser's localStorage and sent on every request).

## Status

🚧 v0.1 scaffolded — `/health`, `/brain/stats`, `/teams` are functional. `/launch` and `/mcp/auto-wire` next.

## Run

```bash
bun install     # no deps yet, but reserved
bun run dev     # watch mode
# OR for a real install:
bun run build
./bin/astack-desktop
```

# Host configs (additions to GStack)

GStack ships 10 host configs (`claude`, `codex`, `cursor`, `factory`, `gbrain`, `hermes`, `kiro`, `opencode`, `openclaw`, `slate`). astack adds:

- **`antigravity.ts`** — Google Antigravity, the agentic IDE. Same Cursor-like layout: skill artifacts land in `.antigravity/skills/gstack/`. Suppresses `GBRAIN_*` resolvers in favor of MCP-based brain access.

## Installing into a fresh gstack clone

After `git clone https://github.com/garrytan/gstack`, copy our host configs in and re-run setup:

```bash
cp hosts/antigravity.ts gstack/hosts/
# Add `antigravity` to ALL_HOST_CONFIGS in gstack/hosts/index.ts (one-line edit)
cd gstack
bun install
./setup --host antigravity --no-team    # OR keep --host claude as primary
```

A small `setup.sh` at the astack root will automate this in v0.2.

## Why we maintain a local copy

The cloned `gstack/` directory is gitignored from this repo (it's an upstream MIT codebase, redistributed via clone-and-patch, not vendored). Storing our antigravity config here means it survives reinstalls of gstack and is reviewable on its own.

If upstream merges Antigravity support, this file becomes redundant and goes away.

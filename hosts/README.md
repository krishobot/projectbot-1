# Host configs

astack ships host configs for editor / agent integrations. Each host config controls where skill artifacts land and how the skill runner installs them on that platform.

## Hosts

- **`antigravity.ts`** — Google Antigravity, the agentic IDE. Cursor-like layout: skill artifacts land in `.antigravity/skills/astack/`. MCP-based brain access only; suppresses inline brain resolvers.

## Installing a host config

```bash
cp hosts/antigravity.ts <skill-runner>/hosts/
# Add `antigravity` to ALL_HOST_CONFIGS in <skill-runner>/hosts/index.ts (one-line edit)
cd <skill-runner>
bun install
./setup --host antigravity --no-team    # OR keep --host claude as primary
```

A small `setup.sh` at the astack root automates this.

## Why this directory exists

The skill-runner source dir is gitignored from this repo (installed via clone-and-patch, not vendored). Keeping host configs here means they survive reinstalls of the runner and stay reviewable on their own.

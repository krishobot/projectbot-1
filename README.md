# astack + tbrain

A virtual company you run from Claude Code. Thirteen teams, each a different cognitive role, wired into a persistent markdown brain. Built on top of Garry Tan's [GStack](https://github.com/garrytan/gstack) and [GBrain](https://github.com/garrytan/gbrain) (both MIT-licensed).

- **astack** — the role/skill layer. Specialised CEO / Eng / Design / QA / Release / Marketing / Sales / etc. agents that hand off work between each other through markdown files. Wraps and extends GStack with a 13-team org chart and a SaaS console.
- **tbrain** — the memory layer. Markdown source-of-truth + Postgres + pgvector. Every person, company, deal, meeting, and idea the org has ever touched is queryable by every team. Wraps GBrain with a hosted Supabase backend and an MCP server you point Claude Desktop / Claude Code at.

## What's in this repo

```
astack/
├── README.md          # this file
├── ORG.md             # one-page map of every team and which skills it owns
├── CLAUDE.md          # workspace boundary — auto-read by Claude Code
├── teams/             # 13 team manifests (roster, scope, handoffs)
├── brain.template/    # public template for a new tbrain (skeleton + .example identity files)
├── console/           # (coming) Next.js SaaS frontend — org dashboard + team launcher + MCP wiring
└── desktop/           # (coming) tiny local companion for terminal-launching + auto-MCP wiring
```

The cloned upstreams (`gstack/`, `gbrain/`) are not committed — install them via the setup script.

## Reading order

1. **`ORG.md`** — table of every team and the skills it owns. Skim first.
2. **`teams/01-executive.md`** — Office of the CEO. Every workflow starts here.
3. The team file relevant to the task at hand (`teams/09-marketing.md` for a campaign, `teams/05-qa-quality.md` for a bug, etc.).

## Setup (one-time)

```bash
# 1. Clone upstreams alongside this repo
git clone https://github.com/garrytan/gstack.git
git clone https://github.com/garrytan/gbrain.git

# 2. Install astack (the role layer — 41 GStack skills land in ~/.claude/skills/gstack/)
cd gstack && bun install && ./setup --host claude --no-team

# 3. Install tbrain (the memory layer — gbrain CLI + brain DB)
cd ../gbrain && bun install && bun run build
# (Windows: see WINDOWS.md for the wrapper script that bypasses Bun's --compile path bug)

# 4. Initialise tbrain
gbrain init --pglite          # local-only, zero-config
# OR
gbrain init --supabase        # hosted Postgres + pgvector for the SaaS path

# 5. Seed your brain
cp -r ../astack/brain.template/* ./brain/
gbrain config set sync.repo_path "$(pwd)/brain"
cd brain && git init && git add -A && git commit -m "seed"
gbrain sync
```

After setup, GStack skills (`/office-hours`, `/ship`, `/qa`, etc.) are globally invokable via slash-commands. The team manifests in `teams/` tell you which skills belong to which role.

## The four rules every team follows

Inherited from Tan's GStack/GBrain ethos:

1. **Markdown is source of truth.** Decisions, plans, and entity records live in the brain, not in chat history.
2. **Single writer per file.** One team owns each brain page; others read.
3. **Append-only evidence trails.** Editable summary at top, immutable timeline below.
4. **No fabricated facts.** Every claim links to a permalink, an email, a transcript, or an explicit user statement.

## Credit + license

astack and tbrain are wrappers and curations on top of Garry Tan's MIT-licensed [GStack](https://github.com/garrytan/gstack) and [GBrain](https://github.com/garrytan/gbrain). All skill prompts, the underlying CLIs, and the architectural ethos ("thin harness, fat skills" / "markdown as source of truth") are Tan's. The original work in this repo is the 13-team org chart in `teams/`, the boundary rules in `CLAUDE.md`, the brain template in `brain.template/`, and the upcoming SaaS console + desktop companion.

Use, modify, and redistribute under MIT. Keep Tan's copyright on the upstream skill files; please credit when you ship.

## Status

🚧 v0.1 — org template + brain template ready. SaaS console and desktop companion in design. Open an issue if you want to be a beta user.

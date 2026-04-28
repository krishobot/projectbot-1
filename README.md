# astack + tbrain

The agent workspace for shipping a company by yourself. Thirteen specialised AI teams wired into a persistent markdown brain. Open source, MIT.

- **astack** — the role layer. Specialised CEO / Engineering / Design / QA / Release / Marketing / Sales / Customer Success / Ops / Data / Security / DevEx / Product agents that hand off work between each other through markdown files. The 13-team org chart, the SaaS console, the desktop companion.
- **tbrain** — the memory layer. Markdown source-of-truth + Postgres + pgvector. Every person, company, deal, meeting, idea, and decision your org touches is queryable by every team. Local-first via PGLite, hosted via Supabase, accessible to Claude Desktop / Claude Code via MCP.

## What's in this repo

```
astack/
├── README.md          # this file
├── ORG.md             # one-page map of every team and which skills it owns
├── CLAUDE.md          # workspace boundary — auto-read by Claude Code
├── teams/             # 13 team manifests (roster, scope, handoffs)
├── brain.template/    # public template for a new tbrain (skeleton + .example identity files)
├── hosts/             # editor / agent host configs (Claude Code, Antigravity, etc.)
├── web/               # Next.js 16 SaaS console — org dashboard + team launcher + MCP wiring
└── desktop/           # local companion daemon for terminal-launching + auto-MCP wiring
```

## Reading order

1. **`MANUAL.md`** — full user guide: install, identity setup, daily/weekly cadence, the 13 teams, brain conventions, common workflows, troubleshooting.
2. **`ORG.md`** — table of every team and the skills it owns.
3. **`teams/01-executive.md`** — Office of the CEO. Every workflow starts here.
4. The team file relevant to the task at hand (`teams/09-marketing.md` for a campaign, `teams/05-qa-quality.md` for a bug, etc.).

## Setup (one-time)

```bash
# 1. Install the astack CLI (the role layer — 41 skills land in ~/.claude/skills/astack/)
git clone https://github.com/garrytan/gstack.git astack-cli
cd astack-cli && bun install && ./setup --host claude --no-team

# 2. Install the tbrain CLI (the memory layer — local DB + MCP server)
git clone https://github.com/garrytan/gbrain.git tbrain-cli
cd ../tbrain-cli && bun install && bun run build

# 3. Initialise tbrain
tbrain init --pglite          # local-only, zero-config
# OR
tbrain init --supabase        # hosted Postgres + pgvector for the SaaS path

# 4. Seed your brain
cp -r ../astack/brain.template/* ./brain/
tbrain config set sync.repo_path "$(pwd)/brain"
cd brain && git init && git add -A && git commit -m "seed"
tbrain sync

# 5. (optional) Run the SaaS console + desktop companion
cd ../astack/web && bun install && bun run dev      # http://localhost:3000
cd ../desktop && bun install && bun run dev         # http://127.0.0.1:7331
```

After setup, astack skills (`/office-hours`, `/ship`, `/qa`, `/plan-eng-review`, etc.) are globally invokable via slash-commands. The team manifests in `teams/` tell you which skills belong to which role.

## The four rules every team follows

1. **Markdown is source of truth.** Decisions, plans, and entity records live in the brain, not in chat history.
2. **Single writer per file.** One team owns each brain page; others read.
3. **Append-only evidence trails.** Editable summary at top, immutable timeline below.
4. **No fabricated facts.** Every claim links to a permalink, an email, a transcript, or an explicit user statement.

## License

MIT.

## Status

🚧 v0.3 — marketing site, workspace shell, 13-team org chart, brain template, MCP auto-wire all live. Hosted SaaS in design. Open an issue if you want to be a beta user.

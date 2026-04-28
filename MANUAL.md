# astack + tbrain — user manual

A virtual company you run from Claude Code. Thirteen teams, one brain, one human at the keyboard.

This manual walks you from install to a working daily cadence. Read top-to-bottom on a fresh install; jump to a section once you're running.

---

## 0. The mental model

Before you touch anything, know the three things you'll be working with:

- **astack** — the role layer. 13 teams (Executive, Product, Engineering, Design, QA, Release, DevEx, Security, Marketing, Sales, Customer Success, Chief of Staff, Data). Each team is a Claude Code session pre-scoped to a charter, a skill allowlist, and a set of brain pages it owns. You launch the team you need; it knows its job before you say a word.
- **tbrain** — the memory layer. A markdown directory (`brain/`) backed by Postgres + pgvector. Every person, company, deal, meeting, idea, decision, and shipped artifact has a markdown page. Every team reads from the same brain.
- **the four rules** — non-negotiable across the org:
  1. Markdown is source of truth (not chat history, not tickets)
  2. Single writer per file (one team owns each page)
  3. Append-only evidence trails (editable summary on top, immutable timeline below)
  4. No fabricated facts (every claim links to a real source)

Everything below is mechanics for honoring those four rules.

---

## 1. Install

### 1.1 Prerequisites

- **Bun** ≥ 1.3 ([install](https://bun.sh/install)). Required for the web console, desktop daemon, and the underlying CLIs.
- **Claude Code** CLI (`claude --version` should print). [Install instructions](https://claude.com/code).
- **Git** + a recent shell (PowerShell 7+, bash, or zsh).
- **Postgres** is optional. astack defaults to PGLite, an embedded Postgres — no server needed.

### 1.2 One-time setup

```bash
# 1. Clone this repo
git clone https://github.com/krishobot/projectbot-1.git astack
cd astack

# 2. Install the astack skill runner alongside (delivered as a separate binary)
git clone https://github.com/garrytan/gstack.git astack-cli
cd astack-cli && bun install && ./setup --host claude --no-team
cd ..

# 3. Install the tbrain CLI
git clone https://github.com/garrytan/gbrain.git tbrain-cli
cd tbrain-cli && bun install && bun run build
cd ..

# 4. Put astack/tbrain wrappers on PATH (so `astack` and `tbrain` are real commands)
chmod +x bin/astack bin/tbrain
echo 'export PATH="'"$PWD"'/bin:$PATH"' >> ~/.zshrc   # or ~/.bashrc; PowerShell users see bin/README.md

# 5. Initialise tbrain
tbrain init --pglite          # local-only, zero-config
# OR
tbrain init --supabase        # hosted Postgres + pgvector

# 6. Seed your brain from the public template
cp -r brain.template brain
tbrain config set sync.repo_path "$PWD/brain"
cd brain && git init && git add -A && git commit -m "seed" && cd ..
tbrain sync

# 7. Run the SaaS console + desktop companion
cd web && bun install && bun run dev      # http://localhost:3000
# in another terminal:
cd desktop && bun install && bun run dev  # http://127.0.0.1:7331
```

You should now see http://localhost:3000 with the marketing landing page, http://localhost:3000/app with the workspace, and `tbrain stats` printing page/chunk counts.

### 1.3 Identity files (do this before any real work)

The four files in `brain/identity/` define who you are, what the org stands for, what agents can and can't do, and the cadence. Without them, agents have no idea who they're working for.

```bash
cd brain/identity
cp USER.md.example USER.md
cp SOUL.md.example SOUL.md
cp ACCESS_POLICY.md.example ACCESS_POLICY.md
cp HEARTBEAT.md.example HEARTBEAT.md
# Edit each. Replace every {{placeholder}}.
```

Or run the guided setup:

```bash
tbrain soul-audit
```

It walks you through six interview phases and writes the four files. Takes about 25 minutes. Worth it.

---

## 2. The 13 teams — when to use each

Each team is a Claude Code session scoped to a role. From the workspace at `/app`, click the team's row in the left rail. The launch button opens a new terminal tab with the team's manifest pre-loaded as the agent's system prompt.

| # | Team | Use when |
|---|---|---|
| 01 | Executive Office (CEO) | New product idea, strategy decision, weekly retro |
| 02 | Product | Roadmap, feature prioritisation, what-to-build-next |
| 03 | Engineering | Architecture review, implementation, second opinion on a hard call |
| 04 | Design | Visual system, UX polish, design review on a shipped surface |
| 05 | QA & Quality | "Does it actually work?" — real-browser testing, bug reports |
| 06 | Release / DevOps | Ship a PR, deploy, watch it land, document the release |
| 07 | DevEx | New machine setup, host config, environment friction |
| 08 | Security & Trust (CSO) | Auth/payments/PII/external-API touch, destructive ops |
| 09 | Marketing | Content drafts, brand voice, signal capture from the wild |
| 10 | Sales / BD | Pipeline of people, companies, deals; outbound sequences |
| 11 | Customer Success | Daily briefings, stakeholder reports, calendar-driven prep |
| 12 | Chief of Staff / Operations | Plumbing — ingest, conventions, schedules, brain maintenance |
| 13 | Data / Analytics | Measurement, retrieval quality, eval harnesses |

**Default lifecycle of a piece of work** (use this if you're not sure where to start):

```
Executive (01) → Product (02) → Engineering (03) → Design (04) + QA (05) + Security (08) → Release (06) → Customer Success (11) → Retro (01)
```

DevEx (07), Chief of Staff (12), and Data (13) are horizontal — every other team consumes their output.

---

## 3. Daily cadence

The org runs on a heartbeat (`brain/identity/HEARTBEAT.md` after you customise it). Default rhythm for a solo founder:

### 3.1 Morning (15 min)

```
Customer Success → daily-task-prep + briefing
```

Output: `brain/briefings/{today}.md`. Lists meetings today, active deals, citations to read, anything overdue. Read it; flag anything you want done that day.

### 3.2 Throughout the day

- **`signal-detector`** runs continuously (in `tbrain` if you've enabled it). New conversations, articles, tweets, etc. get filed automatically into `brain/marketing/signals/{date}.md`.
- **Marketing community-manager** drafts replies to comments + DMs. You send.
- Any team you launch reads-and-writes its assigned brain pages, hands off to the next team via files.

### 3.3 End of day

- **`cron-scheduler`** enforces the evening hard-stop. No automated outbound after the time you set.
- Optionally: **Customer Success → reports** for a stakeholder digest.

### 3.4 Weekly

- **Marketing** runs the next week's content plan. You approve.
- **Sales** runs the follow-up sweep (capped at 3 touches per contact).
- **Executive → /retro** across all projects. Output: `brain/retros/wk-NN.md`.

### 3.5 Monthly

- `tbrain doctor` health check + brain-maintenance via `maintain`.
- Data team runs retrieval evals (`tbrain eval`) for quality drift.
- Executive reviews 90-day goals (in `identity/USER.md`) against actuals.

---

## 4. Brain conventions

The brain is yours. There are exactly four invariants, enforced socially via team manifests:

### 4.1 Where things live

| Page kind | Path | Owner | Example |
|---|---|---|---|
| Identity | `brain/identity/*.md` | Founder | `SOUL.md`, `USER.md` |
| People | `brain/people/{slug}.md` | Sales | `brain/people/jane-doe.md` |
| Companies | `brain/companies/{slug}.md` | Sales | `brain/companies/acme.md` |
| Deals | `brain/deals/{slug}.md` | Sales | `brain/deals/acme-q2-2026.md` |
| Meetings | `brain/meetings/{date}-{slug}.md` | Sales / CS | `brain/meetings/2026-05-01-acme.md` |
| Plans | `brain/plans/{date}-{topic}.md` | Executive | `brain/plans/2026-04-18-mvp.md` |
| Decisions | `brain/decisions/{date}-{slug}.md` | Executive / Eng | `brain/decisions/2026-04-21-pricing.md` |
| Retros | `brain/retros/wk-NN.md` | Executive | `brain/retros/wk-17.md` |
| Briefings | `brain/briefings/{date}.md` | CS | `brain/briefings/2026-04-28.md` |
| Marketing voice | `brain/marketing/voice.md` | Marketing | (singleton) |
| Marketing content | `brain/marketing/content/{date}.md` | Marketing | `brain/marketing/content/2026-04-29.md` |
| Marketing signals | `brain/marketing/signals/{date}.md` | Marketing | (auto, daily) |
| Security audits | `brain/security/audits/{date}-{slug}.md` | Security | (per CSO review) |
| Inbox to founder | `brain/inbox/founder/{date}-{slug}.md` | Any team | When an agent hits a "may not" line |

### 4.2 Page format

Every brain page has this shape:

```markdown
---
type: <person|company|deal|meeting|plan|decision|...>
slug: <stable-slug>
updated: <YYYY-MM-DD>
---

# Title

## Summary
<editable. one paragraph. always reflects the latest state.>

## Key facts
- **Fact 1:** value (source: <permalink or transcript>)
- **Fact 2:** value (source: ...)

## Timeline
<append-only. newest at the bottom.>

### 2026-04-21
- Met for 30 min, discussed pricing. (transcript: meetings/2026-04-21-acme.md)

### 2026-04-15
- First inbound from website form. (source: website-form-N8K2)
```

The Summary is the compiled truth — what's true *right now*. The Timeline is the evidence — how we got here. **Never delete from the Timeline**; only append.

### 4.3 No fabricated facts

If you read a brain page and see "30K MRR" without a source link, that page is wrong. Fix the source link or remove the claim. Agents enforce this with `citation-fixer` before publishing anything externally.

---

## 5. Common workflows

### 5.1 New product / feature idea

```
1. Open /app, click Executive Office (CEO)
2. Type:  /office-hours
3. Walk through the 6 forcing questions
4. Output lands at brain/plans/{date}-{slug}.md
5. Hand off to Engineering: /plan-eng-review
6. After eng review approves → hand to Design: /plan-design-review
7. Implementation: any team that does the work
8. /qa to test
9. /ship to land
10. Customer Success documents in brain/changelog/
```

### 5.2 Production bug

```
1. Open /app, click QA & Quality
2. Type:  /investigate <one-line description>
3. Walk through phases: investigate → analyze → hypothesize → implement
4. Iron law: no fixes without root cause
5. Output: brain/incidents/{date}-{slug}.md
6. /ship the fix
```

### 5.3 New person / company / deal

```
1. Open /app, click Sales / BD
2. Type:  brain-ops add-person <handle> --name "Jane Doe"
3. Or:    brain-ops add-company acme.com
4. Or:    brain-ops add-deal acme-q2-2026
5. Page is auto-created with frontmatter + empty Summary + empty Timeline
6. As you have meetings, /enrich the page from transcripts and emails
```

### 5.4 Daily content

```
1. Open /app, click Marketing
2. Type:  signal-detector  (or check brain/marketing/signals/{today}.md if it auto-ran)
3. Pick 2-3 signals to post about
4. Type:  publish --draft
5. Drafts land in brain/marketing/content/{today}.md
6. You review + edit
7. You send (no agent posts to public channels without your approval)
```

### 5.5 Stakeholder update

```
1. Open /app, click Customer Success
2. Type:  reports  --for <stakeholder>  --window 1w
3. Compiles meetings, ships, deals, retros for the window
4. Output: brain/reports/{date}-{stakeholder}.md
5. You review + send
```

---

## 6. Commands cheat sheet

### 6.1 astack (role / skill runner)

```
astack --version
astack list                       # list installed skills
astack /<skill>                   # invoke a skill from the shell
astack-upgrade                    # update astack to latest
```

In a Claude Code session, the slash-commands work natively:

```
/office-hours          /plan-ceo-review        /plan-eng-review
/plan-design-review    /design-review          /design-shotgun
/qa                    /qa-only                /investigate
/ship                  /land-and-deploy        /canary
/cso                   /careful                /freeze        /unfreeze
/retro                 /context-save           /context-restore
/setup                 /setup-tbrain           /setup-browser-cookies
/document-release      /landing-report         /benchmark
```

### 6.2 tbrain (memory CLI)

```
tbrain init --pglite                   # local-only DB
tbrain init --supabase                 # hosted Postgres
tbrain sync                            # re-index brain/ markdown into DB
tbrain stats                           # pages, chunks, embedded, links
tbrain doctor                          # health check
tbrain query "<question>"              # semantic search
tbrain mcp                             # run as MCP server (used by Claude Desktop / Code)
tbrain soul-audit                      # interview-style identity setup
tbrain migrate --to supabase           # local → hosted (DESTRUCTIVE; ACCESS_POLICY)
```

### 6.3 Web console + desktop daemon

```
# web console (http://localhost:3000)
cd web && bun run dev

# desktop daemon (http://127.0.0.1:7331)
cd desktop && bun run dev

# build daemon as a single binary
cd desktop && bun run build              # bin/astack-desktop (current platform)
cd desktop && bun run build:all          # cross-compile windows-x64, darwin-arm64, linux-x64
```

---

## 7. The web console — what each route does

- **`/`** — marketing landing page. Public. Use this when sharing the project.
- **`/app`** — workspace home. Sidebar lists all 13 teams. Main pane shows three suggested entry points + system status.
- **`/teams/{id}`** — team detail. Shows charter, skill chips, brain pages this team writes, full team manifest. Has a "Launch in Claude Code / Antigravity" button (requires the desktop companion running).
- **`/setup/mcp`** — one-page guide for wiring tbrain into Claude Desktop / Claude Code. Auto-wire if the desktop companion is running; manual snippet otherwise.
- **`/login`** — Supabase magic-link auth (only present if you've configured `NEXT_PUBLIC_SUPABASE_URL` + `_ANON_KEY`).

---

## 8. Troubleshooting

### "tbrain offline" indicator on the workspace

The `tbrain` CLI isn't on PATH in the desktop daemon's environment. Check:

```bash
which tbrain          # macOS / Linux
where tbrain          # Windows
```

If empty, follow §1.2 step 4 to add `bin/` to PATH and restart the desktop daemon.

### Launch button is disabled

The desktop companion (port 7331) isn't running. Start it:

```bash
cd desktop && bun run start
```

The `/teams/{id}` page should now light up the launch button.

### "The team manifest format is load-bearing"

If you edit `teams/*.md`, the regex parser in `web/src/lib/teams.ts` may stop recognising your changes. Stick to the existing shape:

- Title: `# Team NN — <Name>`
- Charter: `**Charter:** <one paragraph>`
- Roster table: `| <skill> | astack \| tbrain \| external | <description> |`
- Brain pages: `## Brain pages this team writes` followed by a `- /brain/...` list

### MCP server not appearing in Claude Desktop after auto-wire

Quit Claude Desktop fully (Cmd+Q on Mac, right-click tray → Quit on Windows). Reopen. The `tbrain` server should now appear in integrations.

### Build fails with `Type error: This regular expression flag is only available when targeting 'es2018' or later`

You're on an old TypeScript target. `web/tsconfig.json` should have `"target": "ES2022"`.

### Form actions throw "not assignable to type 'string | ((formData: FormData) => void | Promise<void>)'"

You're returning a value from a server action. Next 16 form actions must return `void | Promise<void>`. Make the action async-void; surface state via `revalidatePath`.

---

## 9. Upgrade path

```
astack-upgrade                         # update astack to latest
tbrain --version && cd tbrain-cli && git pull && bun run build
```

If a major version of either lands, check `CHANGELOG.md` (TBD) for migration notes.

---

## 10. What this org is NOT

- Not a chatbot. There is no general-purpose assistant; every interaction routes through a team.
- Not a productivity layer over a CRM. The brain IS the CRM.
- Not a SaaS you log into and forget. It runs on your machine, against your brain, with the four rules as the only invariants.

---

## 11. Where to ask for help

- Read `CLAUDE.md` for the workspace boundary rules.
- Read `ORG.md` for the org chart + handoff diagram.
- Read each `teams/*.md` for what that role does.
- Open an issue at https://github.com/krishobot/projectbot-1.

License: MIT.

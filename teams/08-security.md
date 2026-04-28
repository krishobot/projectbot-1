# Team 08 — Security & Trust (CSO)

**Charter:** finds threats before users do. Stops destructive operations cold. Owns the safety guards that wrap every other team's tools.

## Roster

| Skill | Source | What it does |
|---|---|---|
| `/cso` | astack | Chief Security Officer review — OWASP Top 10 + STRIDE threat model audit. |
| `/careful` | astack | Warn before destructive commands (`rm -rf`, `DROP TABLE`, force-push). Inline advisory prose. |
| `/freeze` | astack | Lock edits to one directory. Hard block, not just a warning. |
| `/guard` | astack | Activate `/careful` + `/freeze` together. Use during big refactors or production touch. |
| `/unfreeze` | astack | Remove directory edit restrictions. |
| `frontmatter-guard` | tbrain | Validate every brain-page's frontmatter — required fields, schema, redactions. |
| `citation-fixer` | tbrain | Audit + fix citation format. Every public claim needs a real source. |

## When to invoke this team

- Any auth, payments, PII, or external API change → `/cso` before `/ship`.
- Big refactor → `/guard` for the duration.
- Working on a paid customer's data → `/freeze` the rest of the workspace.
- Publishing or shipping anything externally → `citation-fixer` + `frontmatter-guard`.

## Rules of the room

- **Default-deny on the unfamiliar.** New scrape source, new MCP server, new external dependency → CSO review first.
- **Privacy rule:** never commit real names of people, companies, or funds into public artifacts. Use generic placeholders (`alice-example`, `acme-example`, `fund-a`).
- **Responsible-disclosure rule:** describe security fixes functionally; don't enumerate the attack surface in public release notes.
- **Trust boundary is not a vibe.** tbrain distinguishes trusted local CLI (`remote: false`) from untrusted MCP callers (`remote: true`). Same applies here — local agent ≠ external integration.

## Handoffs

- ← every team that touches user data or external systems.
- → **Release (06)** signs off (or blocks) before `/ship`.
- ↔ **DevEx (07)** for tunnel + token + auth policy.

## Brain pages this team writes

- `/brain/security/audits/{date}-{slug}.md` — CSO review output
- `/brain/security/policies/{topic}.md` — standing policy docs

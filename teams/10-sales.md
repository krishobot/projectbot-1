# Team 10 — Sales / BD

**Charter:** owns the pipeline of people, companies, and deals. Builds and maintains the org's relational memory: who we've met, what we discussed, who replied, who went cold, what each of them cares about.

## Roster

| Skill | Source | What it does |
|---|---|---|
| `brain-ops` | tbrain | The core read-enrich-write loop. Every entity touch goes through this skill. |
| `enrich` | tbrain | Global enrichment: entity slugs, tier auto-escalation, batched throttling. Turns "@some-handle" into a full person page. |
| `query` | tbrain | Hybrid search (vector + keyword + RRF) over the brain. "Who have we already messaged at fund-a?" |
| `data-research` | tbrain | Structured data research: email-to-tracker pipeline with parameterized YAML recipes. |
| `meeting-ingestion` | tbrain | Ingest transcripts; chains attendee enrichment so people-pages auto-update after every call. |

## When to invoke this team

- New lead surfaces (DM, email, intro, conference) → `brain-ops` adds a people-page; `enrich` fills it in.
- Prepping for a meeting → `query` the brain for everything we know about the attendee.
- After a meeting → `meeting-ingestion` on the transcript; lets attendee pages enrich themselves.
- Building a target list → `data-research` recipe (YAML) over a public source.
- Anyone in the org needs the answer to "have we already talked to X" → `query`.

## Rules of the room

- **Brain-first lookup.** Before drafting any outreach, `query` first: do we already know this person? Have we already messaged them?
- **Source attribution on every fact.** A people-page that says "founder of acme" without a link is a smell.
- **No mass outreach without human approval.** Draft → review → send. The brain helps draft; it never sends first-touch DMs autonomously.
- **Three-touch max** on cold sequences. Stop on any reply. Never 10 pm – 8 am local.

## Handoffs

- ← **Marketing (09)** delivers warm leads from inbound signal.
- → **Customer Success (11)** when a deal closes — they take over the relationship.
- ← **Product (02)** receives feedback from sales conversations as ideas to ingest.
- ↔ **Executive (01)** for high-value deals + pricing decisions.

## Brain pages this team writes

- `/brain/people/{handle}.md` — every person we've touched
- `/brain/companies/{slug}.md` — every company we're tracking
- `/brain/deals/{slug}.md` — every active opportunity
- `/brain/meetings/{date}-{slug}.md` — every conversation, with attendees linked

> **Convention:** see [gbrain `_brain-filing-rules.md`](../gbrain/skills/_brain-filing-rules.md) for the canonical filing rules.

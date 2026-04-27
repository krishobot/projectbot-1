# Team 09 — Marketing

**Charter:** owns outbound — content, brand voice, signal capture from the wild. Most of the leverage here lives in GBrain ingest skills: the brain becomes a real-time picture of what the market is saying, and that picture drives what gets posted.

## Roster

| Skill | Source | What it does |
|---|---|---|
| `signal-detector` | gbrain | Always-on. Watches every conversation and incoming feed for new ideas + entities. Files them. |
| `idea-ingest` | gbrain | Capture links, articles, tweets — auto-creates author people-pages so the brain knows who said what. |
| `media-ingest` | gbrain | Video, audio, PDF, book ingestion with entity extraction. Use for case studies + competitor analysis. |
| `publish` | gbrain | Share any brain page as password-protected HTML. Zero LLM calls. Use for one-pagers + landing pages. |
| `webhook-transforms` | gbrain | Turn external events (Stripe, Apify, GitHub) into brain signals. |

> **Note.** GStack itself doesn't ship marketing skills — Tan's framework is engineering-focused. The marketing layer is built on top of GBrain's ingest + publish stack. See `gbrain/skills/idea-ingest/SKILL.md` and `gbrain/skills/publish/SKILL.md` for the canonical prompts.

## When to invoke this team

- Posting to any channel (IG, X, LinkedIn, blog) — pull from `/brain/content/{date}.md`, written by this team.
- Daily monitoring of competitor / influencer accounts → `signal-detector` runs continuously; review its output.
- Case study / research-driven content → `media-ingest` the source, then write.
- External webhook fires (e.g., a podcast mentions us) → `webhook-transforms` lands a brain page automatically.

## Rules of the room

- **No fabricated metrics.** Every "X got 50K views" claim links to a scraped permalink.
- **One voice file.** `/brain/marketing/voice.md` is the single source of truth for tone + register. Anyone drafting copy reads it first.
- **Drafts only — humans send.** No agent posts to a public channel without explicit approval. (Inherited rule from OnlyKrida sandbox; keep for any externally-facing brand.)
- **Cite every claim.** `citation-fixer` before publishing.

## Handoffs

- → **Sales (10)** when a piece of content generates an inbound lead.
- → **Customer Success (11)** for brand-consistent stakeholder updates.
- ← **Product (02)** + **Release (06)** feed feature announcements.
- ← **Security (08)** reviews anything customer-facing.

## Brain pages this team writes

- `/brain/marketing/voice.md` — voice + tone guide
- `/brain/marketing/content/{date}.md` — drafts ready to publish
- `/brain/marketing/calendar.md` — what's planned + scheduled
- `/brain/marketing/signals/{date}.md` — daily output of `signal-detector`

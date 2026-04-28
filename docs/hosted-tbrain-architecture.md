# Hosted tbrain — architecture sketch

The recurring-revenue moat for astack. Build-it-from-this technical spec.

---

## What we're building

A managed version of tbrain: same markdown-source-of-truth + Postgres + pgvector model, but the database, the MCP server, the cross-device sync, and the auth all live on Supabase. Users keep their local `brain/` dir as the writable surface; we host the index, the embeddings, the MCP server, and the conflict resolution.

**Why this is the moat:** after 6 months of brain pages syncing across a user's devices, switching costs are real — they'd lose their working memory. The free tier (PGLite local-only) is the funnel. The paid tier is the upgrade you take once your brain is too valuable to live on one laptop.

This pattern is what Plausible, Supabase, Posthog, and Linear all do.

---

## Goals + non-goals

### Goals

- **Free tier matters.** Local PGLite stays first-class forever. We don't cripple the OSS to push the SaaS.
- **Local-first sync.** The user's `brain/` dir on disk is the source of truth. The hosted DB is a derived index + a cache, not the canonical store.
- **MCP-on-the-other-end.** Claude Desktop / Claude Code on any device talks to the user's hosted MCP endpoint, which talks to the user's hosted brain.
- **Solo-first pricing.** $15/mo gets a real product. Team tiers come later, not in v1.
- **No telemetry without consent.** Default off; opt-in for crash reports only.

### Non-goals (for v1)

- Multi-user team workspaces. Not in v1. Solo only.
- Enterprise auth (SSO, SAML). Not in v1.
- Real-time collaborative editing on brain pages. Not the model — single-writer-per-file is the rule.
- A web UI for browsing brain pages. The brain is markdown; you read it in your editor.
- Fine-grained ACLs. Not in v1; brain pages are owner-private or public-via-`publish` skill, period.

---

## Topology (the moving parts)

```
                                  ┌─────────────────────┐
                                  │ Stripe              │
                                  │  - subscription     │
                                  │  - usage metering   │
                                  └──────────┬──────────┘
                                             │ webhooks
                                             ▼
┌──────────────────┐                 ┌──────────────────────────┐
│ Supabase Auth    │ ◀─── magic ───  │ astack control plane     │
│  - email link    │      link       │  (Next.js on Vercel)     │
│  - OAuth (GH)    │                 │  - signup / billing      │
└──────────┬───────┘                 │  - account dashboard     │
           │                         │  - download config       │
           │ JWT                     └────────────┬─────────────┘
           │                                      │
           ▼                                      ▼
┌──────────────────────────────────────────────────────────────┐
│ Supabase project (one per paid user)                         │
│                                                              │
│  ┌───────────────────────┐    ┌─────────────────────────┐   │
│  │ Postgres + pgvector   │    │ tbrain-mcp Edge         │   │
│  │  - pages              │ ◀─ │  Function (Deno)        │   │
│  │  - chunks (embedded)  │    │  - exposes MCP tools:   │   │
│  │  - links              │    │     query_brain         │   │
│  │  - timeline           │    │     get_page            │   │
│  │  - sync_log           │    │     list_recent         │   │
│  └───────────────────────┘    │  - JWT-gated            │   │
│                                └─────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
                  ▲                              ▲
                  │ HTTPS + JWT                  │ HTTPS + JWT
                  │ (sync; bidirectional)        │ (MCP query)
                  │                              │
        ┌─────────┴────────────┐       ┌─────────┴────────────┐
        │ User's machine #1    │       │ User's machine #2    │
        │  - brain/ on disk    │       │  - brain/ on disk    │
        │  - tbrain CLI        │       │  - tbrain CLI        │
        │  - tbrain-sync       │       │  - tbrain-sync       │
        │  - astack web/       │       │  - astack web/       │
        │  - Claude Code       │       │  - Claude Desktop    │
        │     (MCP → cloud)    │       │     (MCP → cloud)    │
        └──────────────────────┘       └──────────────────────┘
```

Three pieces matter most:

1. **The control plane** (Vercel): signup, billing, "give me my MCP URL," "rotate my JWT." Stateless except for the user's metadata in Supabase.
2. **The user's Supabase project**: the brain index. Postgres + pgvector behind Supabase Auth. We provision one logical project per user (not one infra project — see "tenant model" below).
3. **`tbrain-sync`**: a daemon on each of the user's machines that keeps `brain/` ↔ Postgres in sync. Local-first: every write hits disk first, then queues a sync.

---

## Component breakdown

### 1. Control plane (Next.js on Vercel)

A small Next.js app at `app.astack.{tld}` (the marketing site stays at the apex `astack.{tld}`).

Routes:
- `/` → marketing pitch + signup CTA (single-purpose)
- `/signup` → magic-link auth (Supabase Auth)
- `/dashboard` → after auth: subscription state, MCP URL + JWT, download tbrain CLI config, machine list
- `/billing` → Stripe customer portal embed
- `/api/provision` → server action that creates the user's Supabase project + initial schema (idempotent)
- `/api/webhooks/stripe` → handle subscription events

Stack: Next.js 16 + Supabase SSR + Stripe + the same Inter / JetBrains Mono typography we use on the marketing site.

This app does not store brain content. Ever. It only stores: user account, subscription state, machine fingerprints, JWT issuance.

### 2. The user's brain DB

**Tenant model — one schema per user, shared cluster.**

- Single Supabase project hosts all paid users.
- Each user gets a Postgres schema named after their UUID: `user_{uuid}`.
- All tables (`pages`, `chunks`, `links`, `timeline`, `sync_log`) live inside the user's schema.
- Row-level security policies bind every query to `auth.uid()`. A leak between schemas is not just a bug — it's an RLS misconfiguration we'd have to write.

Why one-schema-per-user not one-DB-per-user:
- Cost: one Postgres + pgvector instance scales to ~thousands of small users for $25-50/mo of infra. Per-user DBs would be 1-2 orders of magnitude more.
- Ops: one DB to backup, one set of pgvector parameters to tune, one set of credentials to rotate.
- Migration: schema-per-user is move-friendly if a user ever grows out of the shared cluster. We dump their schema and import to a dedicated DB.

Tables (in `user_{uuid}` schema):

```sql
CREATE TABLE pages (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  path        TEXT UNIQUE NOT NULL,           -- e.g. "people/jane-doe.md"
  type        TEXT NOT NULL,                  -- frontmatter type
  slug        TEXT,
  title       TEXT,
  body        TEXT NOT NULL,                  -- raw markdown
  hash        TEXT NOT NULL,                  -- sha256 of body, for sync deduplication
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE chunks (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id      UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  chunk_index  INTEGER NOT NULL,
  body         TEXT NOT NULL,
  embedding    vector(1536),                  -- OpenAI text-embedding-3-small
  UNIQUE(page_id, chunk_index)
);
CREATE INDEX chunks_embedding_idx ON chunks USING hnsw (embedding vector_cosine_ops);

CREATE TABLE links (
  source_page_id UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  target_path    TEXT NOT NULL,
  context        TEXT,
  PRIMARY KEY (source_page_id, target_path)
);

CREATE TABLE timeline (
  page_id    UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  occurred   TIMESTAMPTZ NOT NULL,
  body       TEXT NOT NULL,
  source     TEXT,                            -- permalink, transcript ID, etc.
  PRIMARY KEY (page_id, occurred)
);

CREATE TABLE sync_log (
  machine_id   TEXT NOT NULL,
  page_path    TEXT NOT NULL,
  hash         TEXT NOT NULL,                 -- which version this machine has
  synced_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (machine_id, page_path)
);
```

RLS policy on every table: `USING (auth.uid()::text = current_setting('app.user_id'))`. Set on connection from the MCP server using a connection-string parameter.

### 3. tbrain-sync daemon

The new piece of code that doesn't exist yet. Runs on each of the user's machines as a long-lived process (alongside `astack-desktop`, port 7332).

Responsibilities:
- **Watch `brain/`** with `chokidar` (fs events).
- **Compute hashes** of every page on disk; compare against `sync_log[machine_id, page_path].hash`.
- **Push** any locally newer page to Postgres via the user's MCP endpoint (or a sync-specific endpoint with the same JWT).
- **Pull** any remotely-updated page (since this machine's last sync) by polling `sync_log` for entries where another machine_id wrote a hash this machine doesn't have.
- **Conflict resolution**: append-only timeline means most "conflicts" don't happen. For Summary-section conflicts (the only mutable region per the brain-page conventions), the rule is **last-writer-wins, but write the loser to `brain/conflicts/{date}-{path}.md`** so the user can manually merge. This is a conscious tradeoff against CRDT-style merging — single-writer-per-file is supposed to make conflicts rare; when they happen, we fail loud, not auto-merge.

Why a daemon and not a CLI cron: file system events are instant; cron is 1-min latency floor. For a brain that's the working memory of a 13-team agent setup, instant matters.

### 4. tbrain-mcp Edge Function

A Supabase Edge Function (Deno runtime) that speaks the MCP protocol. Lives at `https://{user-uuid}.tbrain.astack.{tld}/mcp`. JWT-gated.

Tools exposed:
- `query_brain(question: string, k: int = 8)` → semantic search over `chunks`, return top-k pages with snippets and full path
- `get_page(path: string)` → return raw markdown of a brain page
- `list_recent(limit: int = 20, type?: string)` → paths sorted by `updated_at`
- `list_links(source_path: string)` → outbound + inbound links for a page
- `timeline(path: string, since?: timestamp)` → append-only timeline entries

This is the surface Claude Desktop / Claude Code talks to. Same MCP tools the local `tbrain mcp` exposes, just over HTTPS with auth instead of stdio.

The user's Claude config has:

```json
{
  "mcpServers": {
    "tbrain": {
      "url": "https://{user-uuid}.tbrain.astack.{tld}/mcp",
      "headers": { "Authorization": "Bearer {{TBRAIN_JWT}}" }
    }
  }
}
```

(MCP supports remote URLs in recent specs; if the user's Claude version doesn't, we fall back to a local `tbrain` CLI in `--mcp-proxy` mode that pipes stdio over HTTPS to the Edge Function.)

### 5. Stripe billing

Standard subscription pattern. Three SKUs:

| Plan | Price | Brain pages | Embedded chunks | Devices | MCP requests/mo |
|---|---|---|---|---|---|
| Free (self-host PGLite) | $0 | unlimited | local only | 1 | local only |
| Solo | $15/mo | 5K | 50K | 3 | 100K |
| Pro | $39/mo | 25K | 250K | 10 | 1M |
| Studio (3 seats) | $99/mo | 25K each | 250K each | 10 each | 1M each |

Overage: hard cap at 110% of plan limit, then `query_brain` returns a "you've capped" error. No surprise bills. The user upgrades manually.

Webhook handler reconciles Stripe → Supabase user record on subscription start / pause / cancel. Free tier post-cancel: brain becomes read-only for 90 days, then deleted (with two reminder emails at 30 and 75 days).

---

## What's free vs paid

| Feature | Free (PGLite) | Solo | Pro |
|---|---|---|---|
| Local brain (markdown source of truth) | ✓ | ✓ | ✓ |
| `tbrain stats`, `sync`, `query` (local) | ✓ | ✓ | ✓ |
| `tbrain mcp` local stdio MCP server | ✓ | ✓ | ✓ |
| 13-team astack workspace | ✓ | ✓ | ✓ |
| Hosted Postgres + pgvector | ✗ | ✓ | ✓ |
| MCP-over-HTTPS endpoint | ✗ | ✓ | ✓ |
| Cross-device sync (`tbrain-sync`) | ✗ | ✓ (3 dev) | ✓ (10 dev) |
| Backup + 30-day point-in-time recovery | ✗ | ✓ | ✓ |
| Brain export (markdown bundle) | ✓ | ✓ | ✓ |
| Higher embedding limits | n/a | 50K | 250K |
| Email support | ✗ | ✓ | priority |

The free tier is genuinely first-class. The paid tier sells convenience + cross-device + ops.

---

## The local-first sync mechanic (the killer feature)

This is the part that creates the switching cost. Make it boringly reliable.

### The contract

The user's `brain/` directory on disk is the source of truth. The hosted index is a derived view. Therefore:

- A user can `git pull` their `brain/` repo on a new machine, run `tbrain-sync init`, and the local DB / cache reconstructs from disk + cloud.
- A user can disable hosted tbrain at any time. Their `brain/` keeps working with PGLite.
- A user's `brain/` is exported as a tarball anytime. They own the bytes.

### The flow on every save

```
User writes brain/people/jane.md (in Cursor / vim / Claude Code)
        │
        ▼
chokidar fires fs event in tbrain-sync (port 7332)
        │
        ▼
sha256 the file → hash
        │
        ▼
POST /sync/upsert with { path, hash, body, machine_id }
        │
        ▼
Edge Function:
  - SELECT hash FROM pages WHERE path = $1
  - if same hash: no-op (already in sync)
  - if different hash: UPSERT pages, queue chunk recompute
  - INSERT INTO sync_log (machine_id, path, hash, synced_at = now())
        │
        ▼
Other machines poll /sync/since?machine_id={mine}&since={my-last-sync}
        │
        ▼
For each entry where another machine wrote a hash mine doesn't have:
  GET /sync/page?path={...} → write to disk, update local hash
```

Polling instead of websockets for v1: simpler, no long-lived connections, 5-10s latency is fine for a brain. v2 can add a Supabase Realtime channel for sub-second cross-device updates.

### Conflict scenarios + resolution

| Scenario | What happens | UX |
|---|---|---|
| User edits same page on two devices, both online | Last-writer-wins on `pages`; the loser gets written to `brain/conflicts/{date}-{path}.md` | A `tbrain status` command surfaces conflicts; user manually merges. We don't auto-merge. |
| User edits same page on two devices, one offline | Offline device queues; on reconnect, the queued write hits Postgres; if remote is newer, the queued write becomes the conflict file | Same. Conflict file. Manual merge. |
| User deletes a page locally | `tbrain-sync` sends a `DELETE` to `/sync/upsert`; pages row is soft-deleted with a tombstone, propagated to other devices | Other devices delete the file. Tombstone retained for 30 days for accidental-delete recovery. |
| Two machines sync but the cloud is down | `tbrain-sync` queues writes locally; cloud catches up when it returns | Local brain keeps working. `tbrain status` shows queue depth. |
| User cancels subscription | After 90 days, schema dropped; export emailed at day 30, 60, 89 | Reverts to free / local PGLite cleanly. |

---

## 90-day build plan

Ordered milestones. Each one ships independently; user value at every step.

### Days 1-14: Foundation

- Provision the production Supabase project. RLS-on-by-default schema. One test user.
- Build `/api/provision` — creates user's `user_{uuid}` schema with the 5 tables and RLS policies.
- Stand up the control plane Next.js app. Magic-link signup. Empty dashboard.
- Stripe Checkout in test mode. Webhook → Supabase user record updates.
- **Ship test:** I can sign up, see my schema in Supabase, see Stripe says I'm subscribed.

### Days 15-35: Sync

- Build `tbrain-sync` daemon (Bun, port 7332). chokidar watch + sha256 + POST.
- Build the `/sync/upsert`, `/sync/since`, `/sync/page` Edge Functions.
- Build the conflict-file behavior. Write the test that makes two simulated machines fight over a page.
- Ship `tbrain-sync init` CLI command that bootstraps a machine into the user's account.
- **Ship test:** I edit `brain/people/jane.md` on my desktop; within 10s, my laptop sees the change. I edit on both at once; one becomes a conflict file.

### Days 36-55: MCP

- Build the `tbrain-mcp` Edge Function. The 5 tools.
- Embedding pipeline: when a page upserts, queue a job that chunks + embeds via OpenAI text-embedding-3-small + writes to `chunks`.
- HNSW index tuning for sub-100ms top-k=8 query.
- Update Claude Desktop / Claude Code MCP config in the dashboard ("paste this snippet" + auto-wire button if `astack-desktop` is running).
- **Ship test:** Claude Code on my laptop, asked "what do we know about Jane?" — calls hosted `tbrain.query_brain`, returns chunks from the brain on the cloud. Same query works from my desktop without re-syncing.

### Days 56-75: Polish

- Stripe billing portal embed in `/dashboard/billing`.
- Quota enforcement (110% hard cap; emails at 80% and 100%).
- Brain export: a button on the dashboard that emails a tarball of all pages within 5 min.
- Email Q&A inbox (just a `support@` address; nothing fancy).
- Terms of service + privacy policy + DPA template (don't skip).
- **Ship test:** I'm a paid user. I hit my quota; I get a nice error, not a silent failure. I cancel; my brain becomes read-only; 30 days later I get a "data is being deleted" email.

### Days 76-90: Beta launch

- Pricing page on the marketing site.
- "Open the workspace" CTA goes to the control plane signup, not local `/app`.
- Invite 20 people from the OnlyKrida community as alpha users (free for 90 days, feedback in exchange).
- Iterate on what they actually do.
- **Ship test:** First $15 in MRR.

---

## Open questions / decisions to make before day 1

These need a yes/no before I'd start coding:

1. **Domain.** Are we shipping under `astack.com`, `astack.dev`, `astack.app`, something else? Affects DNS, Stripe webhook URLs, MCP endpoint format.
2. **Stripe entity.** Sole proprietor? LLC? Where? Affects tax + payout setup. (Don't ship without this.)
3. **Embedding model.** OpenAI text-embedding-3-small ($0.02 / 1M tokens) is the cheapest credible option, but ties us to OpenAI. Alternatives: Voyage, Cohere, self-hosted. Default: OpenAI for v1, abstraction so we can swap in v2.
4. **Free tier limits.** Should free PGLite users be capped at any number of pages? Recommendation: no — uncapped local. The cap is "this is on your laptop, you bear the cost."
5. **Real-time sync via Supabase Realtime in v1, or polling first?** Polling is simpler. Realtime is one extra thing to break. Recommend polling for v1, Realtime for v2.
6. **Open-source the control plane?** Probably yes for goodwill, no for the moat. Recommend keeping the control plane closed for now; open-sourcing later is easy.
7. **Where do the embeddings get computed — server-side (we pay) or client-side (user pays)?** Server-side is the better UX (zero setup) and folds embedding cost into the $15/mo. At 50K chunks per Solo user × $0.00002/chunk = $1/user/mo for embeddings, leaves $14 to cover Postgres + ops. Workable.
8. **Brand: `tbrain` for the SaaS, or do we name it differently for the hosted product?** Recommend keep it `tbrain` — same noun, different fulfilment. The CLI is local, the SaaS is hosted, both are tbrain.

---

## What this gives the business

- **First paid users in ~3 months** if we start now.
- **Real moat** that grows with each user's brain pages.
- **Unit economics that work** — $15/mo per user, ~$2 in costs, ~$13 gross margin.
- **Foundation for everything else.** Skill packs convert OSS users into paid SaaS users; services convert paid SaaS users into higher-tier engagements; community converts case studies into a brand.

The $99 skill packs (sold via Gumroad) are the fastest revenue. The hosted tbrain SaaS is the durable revenue. Run them in parallel.

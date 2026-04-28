# TODOS

Deferred work that's been considered, captured, and decided NOT to ship in the current scope. Each entry has enough context for someone (likely future-Anirudh) to pick it up cold.

---

## P2 — Pack version treadmill (v1 → v2 → v3 cadence)

**Decided:** Deferred from CEO review on 2026-04-28 (D4 in the 2026-04-28-packs-only-monetization.md plan).

**What:** Each pack ships v1 now, plans v2 in ~6 months, v3 in ~12 months. v1 buyers get all updates free for 12 months from purchase. Subsequent buyers pay full price for the latest version. Creates renewal economics without subscription billing.

**Why valuable:** Without this, every pack sale is a single transaction. With it, 30-50% of buyers re-upgrade per major version — creating a renewal cycle that compounds without SaaS infrastructure. Tiago Forte's Building a Second Brain uses this exact model.

**Why deferred:** Validate the flagship at one version first. If the first $499 pack doesn't sell 30+ copies, version cadence solves a problem we don't have yet.

**When to revisit:** After the first $499 flagship sells 30+ copies. Signal: real demand for the niche. At that point, plan v2 with a 6-month horizon.

**Effort estimate:** S (define version policy + buyer-update emails) + ~6 weeks of curation work per major version (M).

**Depends on:** First flagship pack shipped, with at least 30 sales for signal.

**Pros:** Renewal economics without SaaS. Forces ongoing curation (a moat — no other pack creator stays current). Honest — each version is a real product update.

**Cons:** Requires actually shipping v2/v3 with meaningful new content; if the cadence slips, the "free updates for 12 months" promise becomes a liability. Also creates customer-support surface ("which version do I have?", "how do I upgrade?").

**Where to start when revisiting:**
- Add `version` and `buyer_eligible_for_updates_until` columns to the `pack_buyers` table.
- Build a v1 → v2 changelog template.
- Email buyers ~7 days before v2 ships with "what's new + your update is free."
- Update `astack install-pack` CLI to handle version checks + automatic update prompts.

---

## P3 — Pack creator marketplace (third-party packs, 70/30 revenue split)

**Decided:** Deferred from CEO review on 2026-04-28 (D7 in the 2026-04-28-packs-only-monetization.md plan).

**What:** Once 100+ buyers exist for first-party astack packs, invite the most successful 5-10 to ship their own packs (e.g., "growth-pack for ecom" by some user X). Creator takes 70%; astack takes 30%. Catalog scales without solo-founder hours. Network-effect moat.

**Why valuable:** Transforms astack from product to platform. Multiplies catalog growth without proportional time investment. Creates the "ShadCN-shaped" or "Raycast Store" dynamic where the brand becomes the format.

**Why deferred:** Premature marketplace launches die. Without 200+ buyers and a codified quality bar, an open marketplace looks empty. First-mover advantage matters less than not-launching-an-empty-store.

**When to revisit:** Once 200+ buyers exist across first-party packs AND a written quality-bar checklist exists. Probably ~6 months post-flagship-launch.

**Effort estimate:** L (creator onboarding flow, payouts, moderation tooling, legal/IP framework). With CC: M.

**Depends on:**
- 200+ paid buyers across first-party packs (signal of niche maturity)
- Written quality-bar checklist with clear pass/fail criteria
- Stripe Connect (or Razorpay equivalent) for creator payouts
- Legal review on revenue-share terms

**Pros:** Massive ceiling lift — catalog grows beyond solo-founder hours. Network-effect moat: more packs → more buyers → more pack creators. Compounding brand: "astack pack" becomes a noun.

**Cons:** Real moderation work. One bad pack reflects on the whole brand. Legal/IP complications around what creators can/can't include. Payout infrastructure is non-trivial. Risk of becoming a content-moderation business.

**Where to start when revisiting:**
- Draft the quality-bar checklist (must-haves, can't-haves).
- Draft a creator agreement (revenue split, content rights, moderation rights).
- Decide payout cadence (monthly via Stripe Connect / Razorpay Route).
- Build creator submission flow as a private route first; promote to public only after 5-10 vetted creators ship their first packs.

---

## P3 — `astack-evals` sibling repo (BrainBench)

Mentioned in `teams/13-data-analytics.md`. Not yet created. Public benchmark for personal-knowledge agent stacks. Lives at `github.com/astack/astack-evals`.

**Why deferred:** Not on the v1 critical path. Useful when we have multiple competing brain-CLI implementations to benchmark.

**When to revisit:** When a second brain implementation emerges (community fork, hosted variant, etc.) — at that point benchmarking becomes valuable.

---

*Last updated: 2026-04-28*

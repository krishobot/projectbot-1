# technical-founder-pack — astack.dev/packs landing page copy

Paste-ready copy for the **technical-founder-pack** Gumroad listing and the
`/packs/technical-founder-pack` page on astack.dev.

Pricing: **$50 USD / ₹3,999 INR**, lifetime access to v1.x.
Source files: `packs/technical-founder-pack/`. Built zip: `packs/dist/technical-founder-pack-v1.zip`.

---

## Headline (above the fold)

# An astack OS for one-engineer SaaS startups.

### Three astack teams (Product, Engineering, Release / DevOps) tuned for solo technical founders. Built so you stop re-deciding the same architecture every three months and start shipping with a brain that compounds.

[ **Buy technical-founder-pack — $50 / ₹3,999** ]    [ See the bundle (both specialty packs, $80) ↓ ]

---

## Subhead

You're shipping a B2B SaaS solo. Five paying customers. Twelve open feature requests in three different inboxes. An architecture decision you made in February that you can't remember the reasoning for in April. A bug that keeps coming back because you fixed the symptom not the cause. **technical-founder-pack** is the configuration that turns Claude Code into your engineering memory, your product instinct, and your shipping discipline — not by automating your job, but by making the brain you already have running actually useful.

Built on **astack + tbrain**, the open-source 13-team agent workspace. technical-founder-pack is the curated config + brain templates + workflows for **one specific shape of business: a solo engineer + 5-50 paying customers**.

---

## What you get

```
technical-founder-pack/
├── README.md                              ← install + walkthrough URL + Discord invite
├── pack.yaml
├── teams/                                 ← solo-tech-founder-tuned manifests
│   ├── 02-product.md                      ← 3-instance threshold for features, no roadmap from a single loud customer
│   ├── 03-engineering.md                  ← ADR rhythm, root-cause discipline, boring-tech bias
│   └── 06-release-devops.md               ← the 5-step ship→canary→document ritual
├── brain.template/
│   ├── decisions/ADR-EXAMPLE.md           ← canonical Architecture Decision Record
│   ├── feedback/EXAMPLE.md                ← feature-feedback page with 3-instance threshold
│   ├── retros/SPRINT-EXAMPLE.md           ← bi-weekly sprint retro
│   └── playbooks/
│       ├── solo-release-ritual.md         ← /plan-eng-review → /ship → /canary → /document-release
│       ├── customer-feedback-synthesis.md ← raw feedback → roadmap pipeline
│       └── adr-template.md                ← when + how to write an ADR
└── prompts/
    ├── adr-draft.md
    ├── feedback-synthesis.md
    └── ship-canary-document.md
```

**Setup time:** 30 minutes from purchase to first ADR written.
**Compatible with:** astack v0.5+, tbrain v0.5+, Claude Code, Antigravity. Works in single-user local mode (PGLite) or hosted (Supabase).

---

## What it actually does (three workflows)

### 1. The 5-step ship ritual that catches stupid bugs before customers do

Every ship follows: `/plan-eng-review` → `/ship` → CI green → `/canary` (1 hr) → `/document-release`. The discipline that pays for itself the first time `/canary` catches a one-line CSS fix that broke login on Safari. ~15 min overhead per ship; 5-7% of a typical 2-4 hour feature; 100% essential for solo founders who can't afford 2am rollbacks.

**Without this:** the deploys that look "obviously fine" are exactly the ones that break in production. `/canary` would have caught it.
**With this:** the ritual catches it. Feature flag flip. 30-second rollback. Customer never noticed.

### 2. The feedback-to-roadmap pipeline that stops you from building for the loudest customer

Every feature request gets captured in `brain/feedback/{slug}.md`. The page only becomes a roadmap candidate at **3 instances from 3 different customers**. One instance is noise; two is coincidence; three is signal. Quarterly review pulls the threshold-passing pages, runs `/office-hours` and `/plan-ceo-review`, ships 1-2 features per quarter, and writes `not-building-{slug}.md` decisions for the rest.

**Without this:** the loudest customer's request becomes your roadmap. Three months later the customer who actually pays churns because you built for someone who wasn't paying.
**With this:** the brain captures every signal. Patterns emerge. The features you ship are the ones 3+ customers actually need.

### 3. The ADR rhythm that means future-you doesn't re-decide

Every architectural decision worth >30 minutes of thought becomes a one-page ADR. Context, decision, consequences, alternatives considered. The chain of supersedes/superseded-by becomes the audit trail that lets you trace why the system is the way it is — even 12 months later when you've forgotten.

**Without this:** February-you made a call. April-you can't remember the reasoning. April-you re-decides, picks differently, breaks a constraint February-you knew about.
**With this:** April-you reads `brain/decisions/2026-02-{slug}.md` and either accepts the constraint or supersedes the ADR with a new one. No silent drift.

---

## What's NOT in the pack

To keep this honest:

- **Sales / Marketing / Customer Success teams.** Those are in the open-source astack. technical-founder-pack tunes the three teams a solo engineer lives in; the others come free with the OSS install.
- **A monitoring stack.** Use Datadog / PostHog / Sentry. The pack expects you have observability; it doesn't replace it.
- **A CI/CD pipeline.** Use Vercel / GitHub Actions / Fly.io. The pack assumes you have a working pipeline; the ship ritual layers on top.
- **AI-generated code.** This is a workspace pack, not a code-generation tool. Claude Code does the generation; the pack provides the memory and the workflow.
- **Customer testimonials.** This is v1. The illustrative ADR + feedback + retro examples (PR-comment review, Acme Corp, MetricoPay) are scaffolding to make the workflow concrete, not real products.

---

## Who it's for

✓ Solo technical founder shipping a B2B SaaS with 5-50 paying customers.
✓ Comfortable in terminals, opinionated about engineering ergonomics.
✓ Already use Claude Code or Antigravity daily.
✓ Believe documentation is for future-you, not for an audit.
✓ Prefer boring tech for everything except the one thing that's a moat.

## Who it's NOT for

✗ Pre-product founders. The pack assumes you have customers + a running deploy. Pre-product, the discipline overhead doesn't pay back yet.
✗ "Hire the engineer first" founders. If you're not the one shipping code, this is the wrong pack.
✗ Content-led / community-led founders (use **growth-pack** when it ships).
✗ Teams with >2 engineers. The pack's coordination model assumes one person makes the calls. With a real team, you need different shapes.

---

## Pricing

**$50 USD / ₹3,999 INR.** One human. Lifetime access to v1.x.

Includes:
- The pack files above (forever yours)
- The walkthrough video (when shipped)
- Buyer Discord access
- All v1.x updates

Refunds: 48 hours, no questions asked, processed back to source via Gumroad.

---

## License

MIT for the team manifests + prompts. CC-BY-NC-ND 4.0 for the playbook docs (use them in your own org, don't resell or rebadge them). One human per license. Use across as many of your own projects as you want.

---

## FAQ

**Q: Why not just use Linear / Notion / a wiki for ADRs?**
A: Each of those wants you to switch context. astack + tbrain inverts it: ADRs are markdown files in your editor, indexed by the same brain that holds your customer feedback and your sprint retros. Marginal cost of an agent reading your existing file is zero. The cost of fighting Linear's data model when your brain wants a different shape is high and recurring.

**Q: I already write ADRs. Why do I need this?**
A: If you write ADRs consistently and your customer feedback feeds your roadmap reliably, you don't. If you write them sometimes and the inbox is the source of truth for "what should we build next," the pack is the discipline scaffold.

**Q: Does this need an OpenAI / Anthropic key?**
A: Yes — your own. Claude Code or Antigravity calls your model with your key.

**Q: Can I pay in INR via UPI?**
A: Yes. Indian buyers see Gumroad's UPI / cards / netbanking checkout in INR (₹3,999). International buyers see cards in USD ($50).

**Q: I'm building a SaaS but I also run a small agency. Is this enough?**
A: Take the **specialty bundle** ($80 / ₹6,499) — agency-pack + technical-founder-pack together. The combined brain spans both motions.

**Q: What if my stack isn't Postgres / Next.js / Bun?**
A: The pack is stack-agnostic. The brain templates assume markdown + git; the prompts assume Claude Code or Antigravity. Your specific Rails / Django / Go / Phoenix codebase doesn't matter to the pack's workflow — only that you ship code and have customers.

**Q: I have zero customers yet — am I too early?**
A: Probably. The 3-instance threshold + quarterly roadmap synthesis depends on having actual users to gather feedback from. If you're pre-customer, the ADR rhythm + ship ritual are still useful, but you're getting half the pack's value. Wait until you have 3-5 paying customers.

---

## Founder bio (built by Anirudh)

I built astack + tbrain for myself first. technical-founder-pack is the configuration that {{stops me from re-litigating my own architecture decisions every quarter}} — born from too many "wait, why did past-me set it up this way" mornings. The ADR rhythm + the ship ritual are non-negotiable in my own work; both are dogfood.

Questions? @{{handle}} on X or `tech-founder-pack@{{domain}}`.

---

## Stretch / supporting copy

### One-line hooks

- "An astack OS for solo SaaS founders. $50. The brain that compounds across architecture, feedback, and shipping."
- "Three astack teams tuned for one-engineer startups. Buy once. ADRs that future-you can actually use."
- "Stop re-deciding the same architecture every three months."

### 280-char hook for X

I built technical-founder-pack: 3 astack teams (Product, Eng, Release) tuned for solo SaaS founders.

ADR rhythm. 3-instance feature threshold. The 5-step ship ritual.

$50 lifetime. UPI or card. {{link}}

### Subject line variants for newsletter

- "I open-sourced my engineering memory."
- "technical-founder-pack: ship with a brain that compounds."
- "$50 to stop re-deciding the same architecture every quarter."

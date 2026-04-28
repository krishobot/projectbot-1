# agency-pack — astack.dev/packs landing page copy

Paste-ready copy for the **agency-pack** Gumroad listing and the
`/packs/agency-pack` page on astack.dev.

Pricing: **$50 USD / ₹3,999 INR**, lifetime access to v1.x.
Source files: `packs/agency-pack/`. Built zip: `packs/dist/agency-pack-v1.zip`.

---

## Headline (above the fold)

# A virtual back-office for solo agencies.

### Three astack teams (Sales, Customer Success, Operations) tuned for one-to-five-client agencies. Built so a single owner — or a 2-3 person shop — can run client work without dropping context every week.

[ **Buy agency-pack — $50 / ₹3,999** ]    [ See the bundle (both specialty packs, $80) ↓ ]

---

## Subhead

You're running a small agency. Each client gets weekly check-ins, monthly reports, and three months from now you'll be asked "what shipped for us this quarter?" and you'll wish you had every transcript, every decision, every shipped artifact in one place. **agency-pack** turns the brain you already have running into the agency's actual operating system: client portfolios, retainer pipelines, monthly reports written in 20 minutes instead of 4 hours, and the scope-creep conversation script that holds the line so the retainer math actually works.

Built on **astack + tbrain**, the open-source 13-team agent workspace. agency-pack is the curated config + brain templates + workflows for **one specific shape of business: a solo or small-team agency running multi-month retainers**.

---

## What you get

```
agency-pack/
├── README.md                              ← install + walkthrough URL + Discord invite
├── pack.yaml
├── teams/                                 ← agency-tuned team manifests
│   ├── 10-sales.md                        ← retainer pipeline, three-touch outreach, real-budget triangulation
│   ├── 11-customer-success.md             ← weekly check-ins, monthly reports on the 3rd, renewal narrative
│   └── 12-chief-of-staff.md               ← contractor mgmt, conventions, brain hygiene, cron-driven cadence
├── brain.template/
│   ├── companies/EXAMPLE.md               ← canonical client company page
│   ├── deals/EXAMPLE.md                   ← retainer deal page
│   ├── people/EXAMPLE.md                  ← client contact page
│   ├── reports/MONTHLY-EXAMPLE.md         ← canonical 5-section monthly report
│   └── playbooks/
│       ├── client-onboarding.md           ← week 1 → month 3
│       ├── retainer-math.md               ← solo capacity ceiling math (22-28 hrs/week real shipping)
│       └── scope-creep-defense.md         ← the conversation script that protects retainer margin
└── prompts/
    ├── client-onboarding-week1.md
    ├── monthly-report-prep.md
    └── retainer-conversation.md
```

**Setup time:** 30 minutes from purchase to first daily briefing.
**Compatible with:** astack v0.5+, tbrain v0.5+, Claude Code, Antigravity. Works in single-user local mode (PGLite) or hosted (Supabase).

---

## What it actually does (three workflows)

### 1. The monthly report on the 3rd, every month

The agency's reliability spine. The agent drafts the canonical 5-section report on the 1st by reading the client's company page Timeline + every meeting transcript + every shipped artifact. You review on the 2nd. Send on the 3rd. Never the 4th.

**Without this:** Saturday afternoons writing reports you said you'd send Monday. Late reports erode trust faster than missed deliverables.
**With this:** 20 minutes of editing, sent on time, every time, no exceptions.

### 2. The scope-creep conversation that holds the line

Client asks for "just one quick X" outside scope. The first refusal sets the whole 6 months. The playbook walks you through saying no warmly, with a clear alternative path (one-off project quote OR roll into renewal). 70% of clients say "let's roll it into renewal" — your retainer margin survives.

**Without this:** the squeeze becomes the new normal. Three months in, you're working 50% above capacity for the same retainer fee.
**With this:** scope holds. The retainer math actually works. The relationship deepens because you held the frame.

### 3. The retainer-math conversation that prices honestly

Prospect asks for a quote. The agent runs their stated scope through the retainer-math playbook, triangulates real budget from team size + tech stack signals + prior agency mentions, and drafts the three-tier proposal (Lite / Recommended / Premium) with you-anchor-the-middle pricing. No more underwriting clients out of optimism.

**Without this:** you quote $X because it sounds reasonable, then realise three months in that you're losing money on the engagement.
**With this:** the floor pricing is sustainable; the ceiling pricing self-selects the buyers who'll actually renew.

---

## What's NOT in the pack

To keep this honest:

- **Eng / Product / Design / QA / Release teams.** Those are in the open-source astack. agency-pack tunes the three teams agencies live in; the others come free with the OSS install.
- **A CRM.** The brain replaces it. If you need Salesforce-shaped multi-user pipelines with quarterly forecast reports, this isn't for you.
- **Time tracking / billable-hour reporting.** The whole pack is built on the assumption that you sell value, not hours. If your engagements are hourly, you need a different tool entirely.
- **Customer testimonials.** This is v1. The illustrative names + numbers in the EXAMPLE pages (Acme Co, Jane Doe) are scaffolding to make the workflow concrete, not real customers.

---

## Who it's for

✓ Solo or 2-3 person agency owner running 1-5 retainer clients.
✓ Engagements are multi-month, value-priced (not hourly).
✓ You already use Claude Code or Antigravity daily.
✓ Comfortable in a terminal; the brain is markdown files in your editor.
✓ Sustainable margin matters more than maximum project count.

## Who it's NOT for

✗ Agencies with >5 clients. The capacity math breaks; you need contractors and a real PM stack.
✗ Hourly-billing shops. Different business; different brain shape.
✗ Content creators with sponsorships (use **growth-pack** when it ships).
✗ "I want a fully automated agent that handles client comms." This pack assumes you stay the human in the loop on every external send.

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

**Q: Why not just use Notion / a CRM / Asana?**
A: Each of those wants you to learn its mental model. astack + tbrain inverts it: agents read the markdown brain you're already writing in. Marginal cost of an agent reading your existing file is zero; marginal cost of teaching a CRM your retainer pipeline is high.

**Q: Does this need an OpenAI / Anthropic key?**
A: Yes — your own. Claude Code or Antigravity calls your model with your key. The pack is config + workflow; it doesn't ship API access.

**Q: Can I pay in INR via UPI?**
A: Yes. Indian buyers see Gumroad's UPI / cards / netbanking checkout in INR (₹3,999). International buyers see cards in USD ($50).

**Q: Can I install on top of an existing astack workspace?**
A: Yes. The pack is a config overlay. Drop it in `~/.astack/packs/agency-pack/` and follow the install steps in the README.

**Q: I'm a solo agency owner who's also building a side-SaaS. Is this enough?**
A: Take the **specialty bundle** ($80 / ₹6,499) — agency-pack + technical-founder-pack together. Same Discord, save $20. The brain spans both motions.

**Q: What if I don't have any retainer clients yet?**
A: agency-pack is for running an agency, not starting one. If you're at the "land the first 1-2 retainers" stage, the Sales team manifest + retainer-math playbook still help — but you're earlier than the rest of the pack assumes.

---

## Founder bio (built by Anirudh)

I built astack + tbrain for myself first. agency-pack is the configuration that {{compounds your client work into something you can actually point at}} — born from running content + community as a one-human shop and watching every stray context get lost in Slack threads. Everything in the pack is dogfood.

Questions? @{{handle}} on X or `agency-pack@{{domain}}`.

---

## Stretch / supporting copy

### One-line hooks

- "A virtual back-office for solo agencies. $50 lifetime. Hold scope, ship reports on the 3rd, sleep on Sundays."
- "Three astack teams tuned for one-to-five-client retainers. Buy once. The brain stays."
- "Stop drafting monthly client reports on Sunday afternoons."

### 280-char hook for X

I built agency-pack: a virtual Sales + Customer Success + Ops team for one-to-five-client retainers.

Monthly reports on the 3rd. Scope-creep playbook. Real retainer math.

$50 lifetime. UPI or card. {{link}}

### Subject line variants for newsletter

- "I open-sourced my agency's back-office."
- "agency-pack: monthly reports on the 3rd, every month, no exceptions."
- "$50 to never miss a client report deadline again."

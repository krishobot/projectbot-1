# growth-pack — Gumroad listing

Paste-ready copy for the first paid skill pack. Targeting solo content-led founders ($99 lifetime). Built from real OnlyKrida workflow.

---

## Headline (above the fold)

# A virtual marketing + sales team that lives in your brain.

### Three teams, fifty skills, zero hires. Tuned for content-led founders who refuse to drop content into a Notion they'll never read again.

[ **Buy — $99 lifetime** ]    [ See what's inside ↓ ]

---

## Subhead (one paragraph)

You're a solo founder doing growth, sales, and customer ops out of the same brain. Your DMs sit in Slack, your sponsors in a Google Sheet, your post ideas on a phone Notes app, and your replies in fifty open tabs. **growth-pack** wires all of it into one searchable markdown brain that three Claude Code teams — Marketing, Sales, Customer Success — read and write to in formats agents understand. You stay the human in the loop. They stop forgetting context.

Built on **astack + tbrain**, the open-source 13-team agent workspace. growth-pack is the curated config + brain template + workflows for one specific shape of business: **a single human running content + sales + ops**.

---

## What you get

```
growth-pack/
├── config.yaml                  # niche, voice, ICP, channel, tools
├── teams/
│   ├── 09-marketing.yaml        # tuned: signal-detector, content cadence, voice anchor
│   ├── 10-sales.yaml            # tuned: 3-touch outbound, deal stages, sponsor playbook
│   └── 11-customer-success.yaml # tuned: morning briefing, evening hard-stop
├── brain.template/
│   ├── identity/
│   │   ├── SOUL.md              # creator economy / content-led founder defaults
│   │   ├── HEARTBEAT.md         # solo daily rhythm
│   │   └── ACCESS_POLICY.md     # solo / no-direct-send-without-approval
│   ├── marketing/
│   │   ├── voice.md             # voice + register template
│   │   ├── playbook.md          # 12-month content rhythm
│   │   └── platforms/           # platform-specific posting rules (X, IG, LI, newsletter)
│   ├── sales/
│   │   ├── playbook.md          # the sponsor pipeline workflow
│   │   ├── stages.md            # 5-stage deal definition (cold → close)
│   │   └── templates/           # inbound + outbound + follow-up templates
│   └── people/
│       └── EXAMPLE.md           # populated example person page
├── prompts/
│   ├── daily-briefing.md        # the prompt CS runs each morning
│   ├── sponsor-reply.md         # the prompt Sales runs on a hot inbound
│   └── content-from-signal.md   # the prompt Marketing runs to turn a signal into a draft
└── walkthrough.mp4              # 22 min Loom: install → first day → first sponsor reply
```

**Setup time:** 30 minutes from purchase to first daily briefing.
**Compatible with:** astack v0.3+, tbrain v0.3+, Claude Code, Antigravity. Works with Supabase Auth or single-user local mode.

---

## What it actually does (three workflows)

### 1. Morning briefing in 8 minutes flat

Your CS team reads overnight signals (X mentions, HN threads, your DMs, your inbox if you wire it), today's calendar, and any deal at follow-up touch — then writes one page. You read it with coffee. You flag two posts and one reply.

**Without this:** 45 minutes of tab-switching, three things you forget.
**With this:** 8 minutes, the brain remembers.

### 2. Sponsor reply with full context, in twelve minutes

A potential sponsor replies to your DM. Your Sales team `/enrich`es their page — pulls every prior touchpoint, every meeting transcript, every email thread already filed. The full context fits on one screen. You write the reply.

**Without this:** 40 minutes hunting through Slack, Gmail, Notion, calendar, hoping you didn't forget something embarrassing.
**With this:** 12 minutes. The deal page is one source of truth.

### 3. End-of-week retro that actually changes next week

Friday afternoon. `/retro` reads the week's posts that shipped, deals advanced, follow-ups closed. Surfaces patterns: which kind of comment converts at 3×, which content format died on arrival. Next week's plan adapts. Brain pages compound.

**Without this:** vibes.
**With this:** evidence.

---

## What's NOT in the pack

To keep this honest:

- **Eng / Product / Design / QA / Release teams.** Those are in the open-source astack. growth-pack is the three teams content-led founders use; the others come free with the OSS install.
- **A CRM.** The brain replaces it. If you need Salesforce-shaped multi-user pipelines with quarterly reporting, this isn't for you.
- **Content scheduling.** No cron-tweet bot. You read the draft, you click send. The point is to stop drifting toward unattended automation.
- **Customer testimonials.** This is v0.1 of the pack. The walkthroughs in the demo video are illustrative — names and numbers are scaffolding.

---

## Who it's for

✓ Solo founder running content + sales out of one human's time.
✓ You already use Claude Code or Antigravity daily.
✓ You have a niche audience (1K–500K) and a sponsorship or product motion.
✓ You'd rather curate a brain than hire a CRM.

## Who it's NOT for

✗ Agencies doing client work for many brands. (The brand-voice singleton model breaks.)
✗ B2B enterprise SaaS founders. (Use the technical-founder-pack instead — coming Q3.)
✗ "I want a fully automated agent that posts for me." This pack assumes you stay the human in the loop on every external send. If you want unattended, look elsewhere.

---

## Pricing

**$99 lifetime.** One human. Use it for as many of your projects as you want.

Includes:
- The pack files above (forever yours)
- The 22-min walkthrough video
- 30 days of email Q&A while you set it up
- All v1.x updates

Does NOT include:
- Hosted tbrain SaaS (separate $15/mo if you want cross-device brain sync — local PGLite is free forever)
- 1:1 setup help (separate $2,500 if you want me to install + tune it for you)

---

## License

MIT for the code. CC-BY-NC-ND 4.0 for the playbook docs (use them in your own org, don't resell or rebadge them).

## Refunds

48 hours, no questions asked. After that, you've seen the goods.

---

## Built by Anirudh, the founder of OnlyKrida

I built this for myself first. The growth-pack is the configuration that took OnlyKrida from {{N1}} to {{N2}} subscribers and {{X}} sponsor deals over {{period}} — running solo, no team. Everything in the pack is dogfood.

Questions? @{{handle}} on X or `growth-pack@{{domain}}`.

---

## FAQ

**Q: Why not just use Notion AI / Cursor / a regular CRM?**
A: Each of those is a tool that wants you to learn its mental model. astack + tbrain inverts it: agents read the brain you're already writing in. The marginal cost of an agent reading your existing markdown is zero. The marginal cost of teaching Notion AI your sponsor pipeline is high.

**Q: Does this need an OpenAI / Anthropic key?**
A: Yes — your own. Claude Code or Antigravity calls your model with your key. growth-pack is config + workflow; it doesn't ship API access.

**Q: Can I install this on top of an existing astack install?**
A: Yes. The pack is a config overlay. Drop it in `astack/packs/growth/` and run `astack install-pack growth`. Detailed install steps in the walkthrough video.

**Q: I bought it. How do I get the next pack at a discount?**
A: Buyers of growth-pack get **40% off** the next two packs (agency-pack, technical-founder-pack) when they ship in Q2-Q3. Discount code arrives by email when each pack lands.

**Q: What if I'm not technical enough to install?**
A: Add the $2,500 setup option at checkout. I install + configure it on your machine over a 60-min Zoom + 7 days of follow-up email. Or follow the walkthrough video — most buyers do it in 30 min.

---

## Stretch / supporting copy (for follow-on tweets, threads, posts)

### One-line hook variants

- "I built a virtual marketing + sales team that lives in your brain. Open the laptop, ship a company by yourself."
- "Three Claude Code teams. One markdown brain. Zero hires. $99 lifetime."
- "Stop dropping context into a Notion you'll never read again."

### 280-char hook for X

I built a virtual marketing + sales team that lives in your brain.

3 Claude Code teams. 1 markdown brain. 50+ skills.

Built it for OnlyKrida; productised it after one too many "wait, what was that sponsor's last message" moments.

$99 lifetime. {{link}}

### Subject line variants for newsletter

- "I open-sourced my marketing team."
- "growth-pack: the three-team brain that ships content + sponsors solo."
- "$99 to never lose a sponsor reply again."

# Identity files

The four identity files (`USER.md`, `SOUL.md`, `ACCESS_POLICY.md`, `HEARTBEAT.md`) define who the founder is, what the org stands for, what agents can and can't do, and the daily/weekly/monthly cadence.

## How to set them up

For a fresh install, copy each `.example` file to its real name and fill in the placeholders:

```bash
cp USER.md.example USER.md
cp SOUL.md.example SOUL.md
cp ACCESS_POLICY.md.example ACCESS_POLICY.md
cp HEARTBEAT.md.example HEARTBEAT.md
# Edit each one. Replace every {{placeholder}}.
```

If you'd rather have an interview-style guided setup, run `tbrain soul-audit` once tbrain is installed — it walks through six phases and writes the files for you.

## Privacy

Real founder names, emails, and personal details belong in the `*.md` files, not the `*.example.md` ones. The `.gitignore` at the repo root protects:

- `brain/identity/*.local.md` — set up by templating workflows
- `brain/people/`, `brain/companies/`, `brain/deals/`, `brain/meetings/`, `brain/inbox/` — relational data
- `brain/marketing/voice/`, `brain/marketing/signals/` — voice samples + raw signals
- `brain/security/audits/`, `brain/incidents/` — sensitive ops data

Anything outside that list (the org template files, team manifests, conventions) is safe to commit publicly.

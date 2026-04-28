# packs/

Source directories for the astack skill packs.

## Layout

```
packs/
├── README.md             — this file
├── build-packs.sh        — produces packs/dist/*.zip
├── dist/                 — built zips (gitignored)
├── agency-pack/          — paid pack source (PRIVATE; see below)
└── technical-founder-pack/  — paid pack source (PRIVATE; see below)
```

## ⚠️ Paid pack sources are NOT in this public repo

The `agency-pack/` and `technical-founder-pack/` source directories contain
the curated content people pay for. To prevent IP leakage, they live in a
separate private repo:

```
github.com/krishobot/astack-packs-private  (private — not visible to the public)
```

Anyone working on the packs needs to clone that private repo into this
directory before running the build:

```bash
# from the astack repo root:
cd packs
gh repo clone krishobot/astack-packs-private --  # or git clone via SSH

# move contents up so paths match what build-packs.sh expects
mv astack-packs-private/agency-pack ./
mv astack-packs-private/technical-founder-pack ./
rm -rf astack-packs-private
```

Or maintain it as two siblings — clone agency-pack and technical-founder-pack
separately. Either layout works.

## Building zips

```bash
cd packs
./build-packs.sh
```

Produces:

```
dist/agency-pack-v1.zip
dist/technical-founder-pack-v1.zip
dist/specialty-bundle-v1.zip
```

If the source dirs are missing, the script fails loudly with a pointer to
this README.

Upload each zip to its Gumroad listing:

- agency-pack-v1.zip → Gumroad listing `agencypack`
- technical-founder-pack-v1.zip → `Technicalfounderpack`
- specialty-bundle-v1.zip → `Specialtypack`

Re-run after content updates and use Gumroad's "Update file" button to
push the new version to existing buyers.

## What's in each pack

(For the team — these are the same shape regardless of which one you're
working on.)

- `README.md` — buyer-facing install instructions, walkthrough URL,
  Discord invite
- `pack.yaml` — name, version, price, contents manifest
- `teams/` — tuned overlays of base team manifests
- `brain.template/` — example brain pages buyers drop into their `brain/`
- `prompts/` — pack-specific prompts buyers paste into Claude Code

## Source-of-truth chain

```
  ceo-plan        (decisions + pricing — local, gitignored)
      ↓
  packs/{pack}/   (PRIVATE repo, NOT here)
      ↓
  build-packs.sh → packs/dist/{pack}-v{n}.zip
      ↓
  Gumroad listing's Files section
```

Pack pricing + metadata that the public website renders is in
`web/src/lib/packs.ts`. Keep prices in sync with the listing copy at
`docs/skill-packs/`.

## Listing copy lives in a public location

The Gumroad description copy + per-pack landing page copy is in
`docs/skill-packs/` in this public repo. That's marketing prose, not the
paid content itself — safe to be public.

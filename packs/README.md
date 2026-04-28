# packs/

Source directories for the astack skill packs. Each subdirectory is the
unzipped contents of a paid pack. The `build-packs.sh` script zips them
into `packs/dist/` for upload to Gumroad.

## Layout

```
packs/
├── README.md             — this file
├── build-packs.sh        — produces packs/dist/*.zip
├── dist/                 — built zips (gitignored)
├── agency-pack/          — source for agency-pack
├── technical-founder-pack/  — source for technical-founder-pack
└── (specialty-bundle is generated at build time — both packs together)
```

## Each pack contains

- `README.md` — buyer-facing install instructions, walkthrough URL, Discord invite
- `pack.yaml` — name, version, price, contents manifest
- `teams/` — tuned overlays of base team manifests (agency-tuned or technical-founder-tuned)
- `brain.template/` — example brain pages the buyer drops into their `brain/` directory
- `prompts/` — pack-specific prompts the buyer pastes into Claude Code sessions

## Building

```bash
cd packs
./build-packs.sh
# produces:
#   dist/agency-pack-v1.zip
#   dist/technical-founder-pack-v1.zip
#   dist/specialty-bundle-v1.zip
```

Upload each zip to its Gumroad listing. Re-run after content updates and
upload the new version (Gumroad supports versioned files).

## Contributing back to the source

Tunings made in pack source files (e.g., a sharper `agency-pack/teams/10-sales.md`)
sometimes deserve to land in the public team manifests under `../teams/`. Use
your judgment — buyers paid for the curation, but if a tuning is also useful
in the OSS workspace, lift it. The public version stays generic; the pack
keeps the agency- or tech-founder-specific voice.

## Source of truth

The CEO plan governs scope and pricing:
`~/.gstack/projects/krishobot-projectbot-1/ceo-plans/2026-04-28-packs-only-monetization.md`

Buyer-facing copy starts in `docs/skill-packs/growth-pack-listing.md`.

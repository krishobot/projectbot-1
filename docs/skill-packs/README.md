# docs/skill-packs/

Paste-ready landing-page copy for every astack pack. One markdown file per
listing — used as the source for both the Gumroad product description and
the per-pack page on `astack.dev/packs/[id]`.

## Currently live (purchasable)

| Pack | Price | Listing |
|---|---|---|
| `agency-pack` | $50 / ₹3,999 | [agency-pack-listing.md](./agency-pack-listing.md) |
| `technical-founder-pack` | $50 / ₹3,999 | [technical-founder-pack-listing.md](./technical-founder-pack-listing.md) |
| `specialty-bundle` (both above) | $80 / ₹6,499 | [specialty-bundle-listing.md](./specialty-bundle-listing.md) |

## Coming soon (price TBD)

| Pack | Listing |
|---|---|
| `growth-pack` (flagship — content-led founders) | [growth-pack-listing.md](./growth-pack-listing.md) — pricing flagged for revision when ready to ship |
| `founder-os` (all-3 bundle) | not yet drafted; ships when growth-pack lands |

## Listing shape (what each file contains)

Every listing follows the same structure so the Gumroad description and the
landing-page section render predictably:

1. **Headline + subhead** — above the fold copy
2. **What you get** — file-tree of pack contents
3. **What it actually does** — three concrete workflows
4. **What's NOT in the pack** — honest exclusions
5. **Who it's for / not for** — checkmark and X lists
6. **Pricing + license + refunds** — matches `web/src/lib/packs.ts`
7. **FAQ** — 5-7 buyer questions
8. **Founder bio** — voice anchor
9. **Stretch copy** — one-liners + 280-char X hook + newsletter subject variants

## Source-of-truth chain

```
ceo-plan (decisions + pricing)
   ↓
docs/skill-packs/{pack}-listing.md (this directory)
   ↓
docs/skill-packs/{pack}-listing.md → Gumroad product description (paste)
                                  → web/src/app/(marketing)/packs/[id]/page.tsx (renders)
```

Pack pricing and metadata that the website renders is in
`web/src/lib/packs.ts` — keep prices in sync between the listing copy here
and the data file.

## Placeholders to fill in before shipping

- `{{handle}}` — your X handle
- `{{domain}}` — email domain for the per-pack support inbox
- `{{compounds your client work into something you can actually point at}}` — agency-pack founder bio
- `{{stops me from re-litigating my own architecture decisions every quarter}}` — tech-founder-pack founder bio

For growth-pack: also `{{N1}}`, `{{N2}}`, `{{period}}` — real OnlyKrida
audience numbers that anchor the case study.

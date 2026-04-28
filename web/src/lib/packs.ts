// Pack catalog data. Static for now; will move to a CMS / DB once the
// catalog stops fitting on one screen. Per CEO plan 2026-04-28-packs-only.
//
// Pricing decisions:
// - Flagship (growth-pack): $499 / ₹19,999. Lifetime access to v1.x.
// - Specialty (agency-pack, technical-founder-pack): $149 / ₹5,999 each.
// - Bundle (the founder OS): $899 / ₹34,999. All three packs.
// - Custom-tune upsell (per-pack): $2,500 / ₹99,999.
//
// INR pricing is tuned for the Indian market (~50% PPP discount on USD list),
// not exchange-rate converted. Numbers chosen for clean psychological price
// points (₹19,999 / ₹5,999 / ₹34,999 / ₹99,999).

export type PackTier = "flagship" | "specialty" | "bundle";

export type PackStatus = "live" | "coming-soon";

export type Pack = {
  id: string;
  name: string;
  tier: PackTier;
  tagline: string;
  description: string;
  status: PackStatus;
  price: { usd: number; inr: number };
  customTunePrice?: { usd: number; inr: number };
  highlights: string[];
  audience: string;
  shipping?: string; // ETA for coming-soon packs
};

export const PACKS: Pack[] = [
  {
    id: "growth-pack",
    name: "growth-pack",
    tier: "flagship",
    tagline: "A virtual marketing + sales team that lives in your brain.",
    description:
      "Three astack teams (Marketing, Sales, Customer Success), fifty-plus skills, and a markdown brain tuned for solo content-led founders. Built from the OnlyKrida workflow.",
    status: "live",
    price: { usd: 499, inr: 19999 },
    customTunePrice: { usd: 2500, inr: 99999 },
    highlights: [
      "3 tuned team manifests (09 Marketing, 10 Sales, 11 Customer Success)",
      "Brain templates for sponsor pipeline, content calendar, signal capture",
      "22-minute Loom walkthrough (install → first day → first sponsor reply)",
      "12 months of buyer-only Discord access",
      "Monthly live office hours with the founder (4th Wednesday)",
      "Lifetime v1.x updates",
    ],
    audience: "Solo content-led founders running newsletter / X / IG with a sponsor or product motion.",
  },
  {
    id: "agency-pack",
    name: "agency-pack",
    tier: "specialty",
    tagline: "The astack OS for one-to-five-client agencies.",
    description:
      "Customer Success, Sales, and Operations teams tuned for client-shop owners. Brain templates for client onboarding, monthly reporting, retainer pipelines, and scope-creep defense.",
    status: "coming-soon",
    shipping: "after 30 growth-pack sales",
    price: { usd: 149, inr: 5999 },
    customTunePrice: { usd: 2500, inr: 99999 },
    highlights: [
      "3 tuned team manifests (10 Sales, 11 Customer Success, 12 Operations)",
      "Brain templates for client portfolios, retainer math, monthly reports",
      "Client-onboarding playbook (week 1 → month 3)",
      "Same buyer Discord + office hours as flagship",
    ],
    audience: "Agency owners running 1-5 retainer clients. Voice + brand follows the agency, not each client.",
  },
  {
    id: "technical-founder-pack",
    name: "technical-founder-pack",
    tier: "specialty",
    tagline: "The astack OS for solo technical founders shipping B2B SaaS.",
    description:
      "Engineering, Product, and Release teams tuned for one-engineer startups. Brain templates for architecture decisions, sprint cadence, customer feedback ingestion, and release rituals.",
    status: "coming-soon",
    shipping: "after 30 growth-pack sales",
    price: { usd: 149, inr: 5999 },
    customTunePrice: { usd: 2500, inr: 99999 },
    highlights: [
      "3 tuned team manifests (02 Product, 03 Engineering, 06 Release / DevOps)",
      "Brain templates for ADRs, customer-feedback ingestion, sprint retros",
      "Solo-founder release ritual (ship → canary → document)",
      "Same buyer Discord + office hours as flagship",
    ],
    audience: "Solo technical founders shipping B2B SaaS. Comfortable in terminals, opinionated about engineering ergonomics.",
  },
];

export const BUNDLE: Pack = {
  id: "founder-os",
  name: "the founder OS",
  tier: "bundle",
  tagline: "All three packs. Best value if you straddle two niches.",
  description:
    "growth-pack + agency-pack + technical-founder-pack. Specialty packs land as they ship; you get them automatically.",
  status: "live",
  price: { usd: 899, inr: 34999 },
  highlights: [
    "All three packs (growth + agency + technical-founder)",
    "Buyer-only Discord (one community across all three)",
    "Monthly office hours",
    "Lifetime v1.x updates across all three packs",
  ],
  audience: "Founders who run more than one motion (e.g., content + technical product, or agency + side SaaS).",
};

export function getPack(id: string): Pack | null {
  if (id === BUNDLE.id) return BUNDLE;
  return PACKS.find((p) => p.id === id) ?? null;
}

export function getAllPacks(): Pack[] {
  return [...PACKS, BUNDLE];
}

export function formatPrice(price: { usd: number; inr: number }, currency: "usd" | "inr"): string {
  if (currency === "inr") return `₹${price.inr.toLocaleString("en-IN")}`;
  return `$${price.usd.toLocaleString("en-US")}`;
}

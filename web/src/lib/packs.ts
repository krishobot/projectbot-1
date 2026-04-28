// Pack catalog data. Static for now; will move to a CMS / DB once the
// catalog stops fitting on one screen. Per CEO plan 2026-04-28-packs-only,
// pricing-update 2026-04-28 PM.
//
// Live products (purchasable today):
// - agency-pack:           $50  / ₹3,999    (specialty)
// - technical-founder-pack:$50  / ₹3,999    (specialty)
// - specialty-bundle:      $80  / ₹6,499    (bundle of both above; save $20)
//
// Coming soon (price TBD):
// - growth-pack            (flagship — pricing decision deferred)
// - founder-os             (all-3 bundle — pricing decision deferred)
//
// INR pricing: tuned for the Indian market, not exchange-rate converted.
// Numbers chosen for clean psychological price points.

export type PackTier = "flagship" | "specialty" | "bundle";

export type PackStatus = "live" | "coming-soon";

export type Pack = {
  id: string;
  name: string;
  tier: PackTier;
  tagline: string;
  description: string;
  status: PackStatus;
  price?: { usd: number; inr: number };          // optional — undefined = TBD
  customTunePrice?: { usd: number; inr: number };
  highlights: string[];
  audience: string;
  shipping?: string;                             // ETA for coming-soon packs
  bundleOf?: string[];                           // for tier=bundle, the pack ids
  gumroadUrl?: string;                           // ship-light: direct buy link
};

export const PACKS: Pack[] = [
  // ── LIVE ────────────────────────────────────────────────────────────────
  {
    id: "agency-pack",
    name: "agency-pack",
    tier: "specialty",
    tagline: "The astack OS for one-to-five-client agencies.",
    description:
      "Customer Success, Sales, and Operations teams tuned for client-shop owners. Brain templates for client onboarding, monthly reporting, retainer pipelines, and scope-creep defense.",
    status: "live",
    price: { usd: 50, inr: 3999 },
    gumroadUrl: "https://gumroad.com/l/astack-agency-pack",
    highlights: [
      "3 tuned team manifests (10 Sales, 11 Customer Success, 12 Operations)",
      "Brain templates for client portfolios, retainer math, monthly reports",
      "Client-onboarding playbook (week 1 → month 3)",
      "Buyer Discord access",
      "Lifetime v1.x updates",
    ],
    audience:
      "Agency owners running 1-5 retainer clients. Voice + brand follows the agency, not each client.",
  },
  {
    id: "technical-founder-pack",
    name: "technical-founder-pack",
    tier: "specialty",
    tagline: "The astack OS for solo technical founders shipping B2B SaaS.",
    description:
      "Engineering, Product, and Release teams tuned for one-engineer startups. Brain templates for architecture decisions, sprint cadence, customer feedback ingestion, and release rituals.",
    status: "live",
    price: { usd: 50, inr: 3999 },
    gumroadUrl: "https://gumroad.com/l/astack-technical-founder-pack",
    highlights: [
      "3 tuned team manifests (02 Product, 03 Engineering, 06 Release / DevOps)",
      "Brain templates for ADRs, customer-feedback ingestion, sprint retros",
      "Solo-founder release ritual (ship → canary → document)",
      "Buyer Discord access",
      "Lifetime v1.x updates",
    ],
    audience:
      "Solo technical founders shipping B2B SaaS. Comfortable in terminals, opinionated about engineering ergonomics.",
  },
  {
    id: "specialty-bundle",
    name: "specialty bundle",
    tier: "bundle",
    tagline: "Both specialty packs. Save $20.",
    description:
      "agency-pack + technical-founder-pack. For founders who run both motions — a small client shop alongside a side-SaaS, or a dev consultancy moving toward product.",
    status: "live",
    price: { usd: 80, inr: 6499 },
    gumroadUrl: "https://gumroad.com/l/astack-specialty-bundle",
    bundleOf: ["agency-pack", "technical-founder-pack"],
    highlights: [
      "Both specialty packs (agency + technical-founder)",
      "Single Discord across both packs",
      "Lifetime v1.x updates across both",
      "Save $20 vs buying separately",
    ],
    audience:
      "Founders running client work AND building a product. The combined brain spans both motions; one community.",
  },

  // ── COMING SOON (price TBD) ─────────────────────────────────────────────
  {
    id: "growth-pack",
    name: "growth-pack",
    tier: "flagship",
    tagline: "A virtual marketing + sales team that lives in your brain.",
    description:
      "Three astack teams (Marketing, Sales, Customer Success), fifty-plus skills, and a markdown brain tuned for solo content-led founders. Built from the OnlyKrida workflow.",
    status: "coming-soon",
    shipping: "in development — pricing TBD",
    highlights: [
      "3 tuned team manifests (09 Marketing, 10 Sales, 11 Customer Success)",
      "Brain templates for sponsor pipeline, content calendar, signal capture",
      "22-minute Loom walkthrough",
      "Buyer-only Discord + monthly office hours",
      "Lifetime v1.x updates",
    ],
    audience:
      "Solo content-led founders running newsletter / X / IG with a sponsor or product motion.",
  },
  {
    id: "founder-os",
    name: "the founder OS",
    tier: "bundle",
    tagline: "All three packs. The full astack OS.",
    description:
      "growth-pack + agency-pack + technical-founder-pack. The complete operating system for a one-human company that touches content, services, and product.",
    status: "coming-soon",
    shipping: "ships when growth-pack lands — pricing TBD",
    bundleOf: ["growth-pack", "agency-pack", "technical-founder-pack"],
    highlights: [
      "All three packs",
      "Buyer-only Discord (one community across all three)",
      "Monthly office hours",
      "Lifetime v1.x updates across all packs",
    ],
    audience:
      "Founders who run more than two motions (e.g., content + services + technical product).",
  },
];

export function getPack(id: string): Pack | null {
  return PACKS.find((p) => p.id === id) ?? null;
}

export function getAllPacks(): Pack[] {
  return PACKS;
}

export function getLivePacks(): Pack[] {
  return PACKS.filter((p) => p.status === "live");
}

export function getComingSoonPacks(): Pack[] {
  return PACKS.filter((p) => p.status === "coming-soon");
}

export function formatPrice(
  price: { usd: number; inr: number } | undefined,
  currency: "usd" | "inr",
): string {
  if (!price) return "TBD";
  if (currency === "inr") return `₹${price.inr.toLocaleString("en-IN")}`;
  return `$${price.usd.toLocaleString("en-US")}`;
}

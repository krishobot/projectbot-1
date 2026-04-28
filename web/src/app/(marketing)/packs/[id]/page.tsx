import Link from "next/link";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { getPack, getAllPacks, getLivePacks } from "@/lib/packs";
import { CurrencyProvider, CurrencyToggle } from "../CurrencyToggle";
import { Price } from "../Price";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return getAllPacks().map((p) => ({ id: p.id }));
}

async function detectInitialCurrency(): Promise<"usd" | "inr"> {
  const h = await headers();
  const country = h.get("cf-ipcountry") ?? h.get("x-vercel-ip-country") ?? "";
  return country.toUpperCase() === "IN" ? "inr" : "usd";
}

type Props = { params: Promise<{ id: string }> };

export default async function PackLandingPage({ params }: Props) {
  const { id } = await params;
  const pack = getPack(id);
  if (!pack) notFound();
  const initialCurrency = await detectInitialCurrency();
  const isComingSoon = pack.status === "coming-soon";
  const hasPrice = !!pack.price;
  const liveBundle = getLivePacks().find((p) => p.tier === "bundle");
  const showBundleCTA = liveBundle && liveBundle.id !== pack.id;

  return (
    <CurrencyProvider initialCurrency={initialCurrency}>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link
          href="/packs"
          className="text-xs text-zinc-500 hover:text-zinc-300 transition inline-flex items-center gap-1.5"
        >
          ← all packs
        </Link>

        {/* Hero */}
        <header className="mt-6 mb-12">
          <p className="text-xs font-mono uppercase tracking-wider text-zinc-500">
            {pack.tier === "flagship"
              ? "Flagship pack"
              : pack.tier === "bundle"
                ? "Bundle"
                : "Specialty pack"}
          </p>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight mt-3 leading-tight">
            {pack.name}
          </h1>
          <p className="mt-4 text-xl text-zinc-300 leading-snug max-w-2xl">{pack.tagline}</p>
          <p className="mt-4 text-zinc-400 leading-relaxed max-w-2xl">{pack.description}</p>

          <div className="mt-8 flex items-center gap-4 flex-wrap">
            {hasPrice ? (
              <Price price={pack.price!} className="text-3xl font-semibold text-zinc-100" />
            ) : (
              <span className="text-2xl font-semibold text-zinc-500 font-mono tracking-tight">
                Pricing TBD
              </span>
            )}
            {hasPrice && pack.tier !== "bundle" && (
              <span className="text-sm text-zinc-500">lifetime · v1.x updates</span>
            )}
            {hasPrice && <CurrencyToggle className="ml-auto" />}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {isComingSoon ? (
              <div className="rounded-lg border border-amber-900/40 bg-amber-950/20 px-5 py-3 text-sm text-amber-200">
                <span className="font-mono uppercase text-[10px] tracking-wider text-amber-400 mr-2">
                  coming soon
                </span>
                {pack.shipping ?? "Stay tuned."}
              </div>
            ) : (
              <BuyButton packId={pack.id} />
            )}
            {showBundleCTA && liveBundle && (
              <Link
                href={`/packs/${liveBundle.id}`}
                className="rounded-lg border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/50 text-zinc-200 px-5 py-3 text-sm font-medium transition"
              >
                See bundle ({liveBundle.price ? `$${liveBundle.price.usd}` : "TBD"})
              </Link>
            )}
          </div>
        </header>

        {/* Audience */}
        <section className="border-t border-zinc-900 py-12">
          <p className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-3">Who it&apos;s for</p>
          <p className="text-base text-zinc-300 leading-relaxed max-w-2xl">{pack.audience}</p>
        </section>

        {/* What you get */}
        <section className="border-t border-zinc-900 py-12">
          <p className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-6">What you get</p>
          <ul className="space-y-3 max-w-2xl">
            {pack.highlights.map((h) => (
              <li key={h} className="flex gap-3 text-sm text-zinc-300 leading-relaxed">
                <span className="text-emerald-500/80 mt-0.5 font-mono" aria-hidden>
                  ✓
                </span>
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Custom-tune upsell */}
        {pack.customTunePrice && (
          <section className="border-t border-zinc-900 py-12">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6">
              <div className="flex items-baseline justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-xs font-mono uppercase tracking-wider text-emerald-400/80 mb-1">
                    Optional upsell
                  </p>
                  <h2 className="text-xl font-semibold tracking-tight">Custom-tune {pack.name}</h2>
                </div>
                <Price price={pack.customTunePrice} className="text-2xl font-semibold text-zinc-100" />
              </div>
              <p className="mt-3 text-sm text-zinc-400 leading-relaxed max-w-2xl">
                60-min call + 7 days of editing + custom brain-page templates tuned to your exact
                ICP, voice, and channels. The pack ships in 4-6 hours of my time, not 30, because
                it has the spine of {pack.name} underneath. Capped at 10 engagements per month so
                you actually get time.
              </p>
              <p className="mt-3 text-xs text-zinc-500">
                Available as an addon at checkout. Email after purchase if you decide later.
              </p>
            </div>
          </section>
        )}

        {/* Refund + payment */}
        <section className="border-t border-zinc-900 py-12 grid gap-8 sm:grid-cols-2 text-sm text-zinc-500">
          <div>
            <p className="text-zinc-300 font-semibold mb-2">Payment</p>
            <p className="leading-relaxed">
              India: Razorpay (UPI, cards, netbanking) in INR.
              Everywhere else: Stripe (cards) in USD.
              Switch currency anytime via the toggle above.
            </p>
          </div>
          <div>
            <p className="text-zinc-300 font-semibold mb-2">Refunds</p>
            <p className="leading-relaxed">
              48 hours, no questions asked, refund processed back to source. After that, you&apos;ve
              seen the goods.
            </p>
          </div>
        </section>

        {/* CTA */}
        {!isComingSoon && (
          <section className="border-t border-zinc-900 py-16 text-center">
            <h2 className="text-3xl font-semibold tracking-tight mb-3">
              Ready to install {pack.name}?
            </h2>
            <p className="text-zinc-400 mb-8 max-w-xl mx-auto">
              30 minutes from purchase to first daily briefing. Buyer-only Discord access on
              checkout.
            </p>
            <BuyButton packId={pack.id} large />
          </section>
        )}
      </div>
    </CurrencyProvider>
  );
}

// Placeholder buy button. Wires to /packs/[id]/install for v1; will route to
// Razorpay / Stripe Checkout sessions once the payment provider entities are
// set up (open question #2 in the CEO plan).
function BuyButton({ packId, large = false }: { packId: string; large?: boolean }) {
  const cls = large
    ? "rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 px-6 py-3.5 text-base font-semibold transition inline-block"
    : "rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 px-5 py-3 text-sm font-semibold transition";
  const label =
    packId === "specialty-bundle" || packId === "founder-os" ? "the bundle" : packId;
  return (
    <Link href={`/packs/${packId}/install?demo=1`} className={cls}>
      Buy {label} →
    </Link>
  );
}

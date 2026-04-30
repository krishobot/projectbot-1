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
            {hasPrice && (
              <span className="text-sm text-zinc-500">
                lifetime · full OS · repo access included
              </span>
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
              <BuyButton packId={pack.id} gumroadUrl={pack.gumroadUrl} />
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
            <li className="flex gap-3 text-sm text-emerald-300 leading-relaxed">
              <span className="text-emerald-400 mt-0.5 font-mono" aria-hidden>★</span>
              <span>
                <strong>Plus the full OS:</strong> collaborator access to the
                private astack + tbrain repo. Fork it, customise it, own it.
              </span>
            </li>
          </ul>
        </section>

        {/* Refund + payment */}
        <section className="border-t border-zinc-900 py-12 grid gap-8 sm:grid-cols-2 text-sm text-zinc-500">
          <div>
            <p className="text-zinc-300 font-semibold mb-2">Payment</p>
            <p className="leading-relaxed">
              India: UPI, cards, netbanking in INR. Everywhere else: cards in
              USD. Switch currency anytime via the toggle above. Checkout runs
              on Gumroad.
            </p>
          </div>
          <div>
            <p className="text-zinc-300 font-semibold mb-2">Refunds</p>
            <p className="leading-relaxed">
              48 hours, no questions asked, refund processed back to source.
              After that, you&apos;ve seen the goods.
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
              Buy via Gumroad — UPI for Indian buyers, cards everywhere else.
              You&apos;ll get the pack files immediately and an email about
              repo access.
            </p>
            <BuyButton packId={pack.id} gumroadUrl={pack.gumroadUrl} large />
          </section>
        )}
      </div>
    </CurrencyProvider>
  );
}

// Routes through /buy/<id> — that handler checks Supabase auth and either
// sends the user to /login (with next pointing back here) or 302s to the
// pack's Gumroad checkout. After payment, Gumroad's post-purchase URL
// returns the buyer to /app?purchased=<id> for the celebration modal.
function BuyButton({
  packId,
  gumroadUrl,
  large = false,
}: {
  packId: string;
  gumroadUrl?: string;
  large?: boolean;
}) {
  const cls = large
    ? "rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 px-6 py-3.5 text-base font-semibold transition inline-block"
    : "rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 px-5 py-3 text-sm font-semibold transition";
  const label =
    packId === "specialty-bundle" || packId === "founder-os" ? "the bundle" : packId;

  if (gumroadUrl) {
    return (
      <a href={`/buy/${packId}`} className={cls}>
        Buy {label} →
      </a>
    );
  }
  return (
    <Link href={`/packs/${packId}/install?demo=1`} className={cls}>
      Buy {label} (preview) →
    </Link>
  );
}

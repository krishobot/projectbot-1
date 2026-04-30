import Link from "next/link";
import { headers } from "next/headers";
import { getLivePacks, getComingSoonPacks, type Pack } from "@/lib/packs";
import { CurrencyProvider, CurrencyToggle } from "./CurrencyToggle";
import { Price } from "./Price";

export const dynamic = "force-dynamic";

// Geo-detect default currency. Indian visitors default to INR; everyone else to USD.
async function detectInitialCurrency(): Promise<"usd" | "inr"> {
  const h = await headers();
  const country = h.get("cf-ipcountry") ?? h.get("x-vercel-ip-country") ?? "";
  return country.toUpperCase() === "IN" ? "inr" : "usd";
}

type PageProps = {
  searchParams: Promise<{ paywall?: string }>;
};

export default async function PacksCatalogPage({ searchParams }: PageProps) {
  const initialCurrency = await detectInitialCurrency();
  const { paywall } = await searchParams;
  const showPaywallBanner = paywall === "1";
  const livePacks = getLivePacks();
  const comingSoonPacks = getComingSoonPacks();

  // Live layout: 2 specialty packs side by side, bundle full-width below
  const liveSpecialty = livePacks.filter((p) => p.tier === "specialty");
  const liveBundle = livePacks.find((p) => p.tier === "bundle");

  return (
    <CurrencyProvider initialCurrency={initialCurrency}>
      <div className="max-w-5xl mx-auto px-6 py-16">
        {showPaywallBanner && (
          <div className="mb-10 rounded-xl border border-emerald-900/50 bg-emerald-950/30 p-5">
            <p className="text-xs font-mono uppercase tracking-wider text-emerald-300/90 mb-2">
              You&apos;re signed in
            </p>
            <p className="text-sm text-zinc-200 leading-relaxed">
              One step left. Pick a pack below to unlock the workspace and get
              the full astack + tbrain source.
            </p>
          </div>
        )}
        <header className="mb-12">
          <p className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-3">
            astack packs
          </p>
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <div>
              <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight max-w-2xl leading-tight">
                Buy a pack. Get the whole OS.
              </h1>
              <p className="mt-4 text-zinc-400 max-w-2xl leading-relaxed">
                Every pack ships with the full astack + tbrain source. You get
                the team manifests tuned for your business shape, the brain
                templates, and collaborator access to the private repo so you
                can fork and own it. Buy once, lifetime.
              </p>
            </div>
            <CurrencyToggle />
          </div>
        </header>

        {/* AVAILABLE NOW */}
        <section className="mb-20">
          <p className="text-xs font-mono uppercase tracking-wider text-emerald-400/80 mb-6 inline-flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" aria-hidden />
            Available now
          </p>
          <div className="grid gap-5 sm:grid-cols-2 mb-5">
            {liveSpecialty.map((p) => (
              <PackCard key={p.id} pack={p} />
            ))}
          </div>
          {liveBundle && <PackCard pack={liveBundle} bundle />}
        </section>

        {/* COMING SOON */}
        {comingSoonPacks.length > 0 && (
          <section>
            <p className="text-xs font-mono uppercase tracking-wider text-amber-500/80 mb-6 inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" aria-hidden />
              Coming soon
            </p>
            <div className="grid gap-5 sm:grid-cols-2">
              {comingSoonPacks.map((p) => (
                <PackCard key={p.id} pack={p} />
              ))}
            </div>
          </section>
        )}

        {/* What every pack includes */}
        <section className="mt-20 border-t border-zinc-900 pt-16">
          <p className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-6">
            Every pack includes
          </p>
          <div className="grid gap-8 sm:grid-cols-2">
            <Feature
              title="The full OS source."
              body="Collaborator access to the private astack + tbrain repo. The 13-team org, the brain CLI, every skill, every template. Fork it and own it."
            />
            <Feature
              title="Tuned team manifests."
              body="Three to five astack teams curated for your business shape — charters, skill allowlists, brain-page ownership pre-edited."
            />
            <Feature
              title="Lifetime updates."
              body="Buy once. When the curation evolves, you pull updates from the same repo."
            />
            <Feature
              title="UPI for India, cards everywhere."
              body="Checkout via Gumroad — Indian buyers see UPI, cards, netbanking; international buyers see cards. Refunds back to source within 48 hours."
            />
          </div>
        </section>

        {/* Refund + license */}
        <section className="mt-16 border-t border-zinc-900 pt-12 grid gap-8 sm:grid-cols-2 text-sm text-zinc-500">
          <div>
            <p className="text-zinc-300 font-semibold mb-2">License</p>
            <p className="leading-relaxed">
              MIT for the code. CC-BY-NC-ND 4.0 for the playbook docs (use them
              in your own org; don&apos;t resell or rebadge them). One human
              per license. Use across as many of your own projects as you want.
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
      </div>
    </CurrencyProvider>
  );
}

function PackCard({ pack, bundle }: { pack: Pack; bundle?: boolean }) {
  const isLive = pack.status === "live";
  const isBundle = pack.tier === "bundle" || bundle;
  const hasPrice = !!pack.price;

  const tagBg = isBundle
    ? isLive
      ? "border-emerald-900/60 bg-emerald-950/30"
      : "border-zinc-800/60 bg-zinc-950/40"
    : isLive
      ? "border-zinc-800 bg-zinc-900/40"
      : "border-zinc-900 bg-zinc-950/40 opacity-80";

  const tagLabel =
    pack.tier === "flagship" ? "Flagship" : pack.tier === "bundle" ? "Bundle" : "Specialty";
  const tagColor = isBundle
    ? isLive
      ? "text-emerald-400"
      : "text-zinc-500"
    : "text-zinc-500";

  return (
    <div className={`rounded-xl border p-6 flex flex-col ${tagBg} relative`}>
      <div className="flex items-baseline justify-between gap-3 mb-3">
        <p className={`text-[10px] font-mono uppercase tracking-wider ${tagColor}`}>
          {tagLabel}
        </p>
        {!isLive && (
          <span className="text-[10px] font-mono uppercase tracking-wider text-amber-500/80 inline-flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-amber-500" aria-hidden />
            coming soon
          </span>
        )}
      </div>

      <h2 className="text-2xl font-semibold tracking-tight text-zinc-100">{pack.name}</h2>
      <p className="text-sm text-zinc-400 mt-2 leading-relaxed">{pack.tagline}</p>

      <div className="mt-5 mb-5">
        {hasPrice ? (
          <>
            <Price price={pack.price!} className="text-3xl font-semibold text-zinc-100" />
            {!isBundle && (
              <span className="text-xs text-zinc-500 ml-2">lifetime · full OS</span>
            )}
            {isBundle && pack.bundleOf && (
              <span className="text-xs text-emerald-500/80 ml-2">
                {pack.bundleOf.length} packs · full OS
              </span>
            )}
          </>
        ) : (
          <span className="text-2xl font-semibold text-zinc-500 font-mono tracking-tight">
            Pricing TBD
          </span>
        )}
      </div>

      <ul className="space-y-2 text-sm text-zinc-300 leading-relaxed mb-6 flex-1">
        {pack.highlights.slice(0, isBundle ? 5 : 4).map((h) => (
          <li key={h} className="flex gap-2">
            <span
              className={`mt-0.5 ${isLive ? "text-emerald-500/80" : "text-zinc-700"}`}
              aria-hidden
            >
              ✓
            </span>
            <span className={isLive ? "" : "text-zinc-500"}>{h}</span>
          </li>
        ))}
      </ul>

      {isLive ? (
        <Link
          href={`/packs/${pack.id}`}
          className="rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 px-4 py-2.5 text-sm font-semibold transition text-center"
        >
          See {pack.name} →
        </Link>
      ) : (
        <div className="rounded-lg border border-zinc-800 px-4 py-2.5 text-xs text-zinc-500 text-center font-mono">
          {pack.shipping ?? "Coming soon"}
        </div>
      )}
    </div>
  );
}

function Feature({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h3 className="text-base font-semibold tracking-tight text-zinc-100">{title}</h3>
      <p className="text-sm text-zinc-500 mt-2 leading-relaxed">{body}</p>
    </div>
  );
}

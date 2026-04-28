import Link from "next/link";
import { headers } from "next/headers";
import { PACKS, BUNDLE, type Pack } from "@/lib/packs";
import { CurrencyProvider, CurrencyToggle } from "./CurrencyToggle";
import { Price } from "./Price";

export const dynamic = "force-dynamic";

// Geo-detect default currency. Indian visitors default to INR; everyone else to USD.
// User can flip via the toggle; their choice persists in localStorage.
async function detectInitialCurrency(): Promise<"usd" | "inr"> {
  const h = await headers();
  const country = h.get("cf-ipcountry") ?? h.get("x-vercel-ip-country") ?? "";
  return country.toUpperCase() === "IN" ? "inr" : "usd";
}

export default async function PacksCatalogPage() {
  const initialCurrency = await detectInitialCurrency();

  return (
    <CurrencyProvider initialCurrency={initialCurrency}>
      <div className="max-w-5xl mx-auto px-6 py-16">
        <header className="mb-12">
          <p className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-3">
            astack packs
          </p>
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <div>
              <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight max-w-2xl leading-tight">
                Pre-built virtual teams for one-human companies.
              </h1>
              <p className="mt-4 text-zinc-400 max-w-xl leading-relaxed">
                Each pack is a curated set of astack team manifests, brain-page templates,
                prompts, and a walkthrough video — tuned for one shape of business. Buy once.
                Lifetime access. Buyer-only Discord + monthly office hours included.
              </p>
            </div>
            <CurrencyToggle />
          </div>
        </header>

        {/* Flagship + bundle row */}
        <section className="grid gap-5 lg:grid-cols-3 mb-5">
          <PackCard pack={PACKS[0]} primary />
          <PackCard pack={BUNDLE} bundle />
        </section>

        {/* Specialty row */}
        <section className="grid gap-5 sm:grid-cols-2">
          {PACKS.slice(1).map((p) => (
            <PackCard key={p.id} pack={p} />
          ))}
        </section>

        {/* What every pack includes */}
        <section className="mt-20 border-t border-zinc-900 pt-16">
          <p className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-6">
            Every pack includes
          </p>
          <div className="grid gap-8 sm:grid-cols-2">
            <Feature
              title="Lifetime access to v1.x updates."
              body="Buy once. Curation evolves. We email you when a meaningful update lands."
            />
            <Feature
              title="Buyer-only Discord."
              body="One community across all packs. High-intent founders running the same playbook. Not a free Slack with 5,000 lurkers — a small room of buyers."
            />
            <Feature
              title="Monthly live office hours."
              body="4th Wednesday of each month, 60 minutes on Zoom. Bring questions, watch other founders work through theirs. Capped at 50 buyers per call so you actually get time."
            />
            <Feature
              title="Custom-tune upsell available."
              body="Want the pack tuned to your exact niche, voice, and ICP? Add Custom-tune at checkout — 60-min call + 7 days of pack tuning + custom brain-page templates. Capped at 10 / month."
            />
          </div>
        </section>

        {/* Refund + license */}
        <section className="mt-16 border-t border-zinc-900 pt-12 grid gap-8 sm:grid-cols-2 text-sm text-zinc-500">
          <div>
            <p className="text-zinc-300 font-semibold mb-2">License</p>
            <p className="leading-relaxed">
              MIT for the code. CC-BY-NC-ND 4.0 for the playbook docs (use them in your own
              org; don&apos;t resell or rebadge them). One human per license. Use across as
              many of your own projects as you want.
            </p>
          </div>
          <div>
            <p className="text-zinc-300 font-semibold mb-2">Refunds</p>
            <p className="leading-relaxed">
              48 hours, no questions asked. After that, you&apos;ve seen the goods. India
              buyers: refunds processed via Razorpay back to source. Everyone else: Stripe
              back to source.
            </p>
          </div>
        </section>
      </div>
    </CurrencyProvider>
  );
}

function PackCard({
  pack,
  primary,
  bundle,
}: {
  pack: Pack;
  primary?: boolean;
  bundle?: boolean;
}) {
  const isLive = pack.status === "live";
  const tagBg = bundle
    ? "border-emerald-900/60 bg-emerald-950/30"
    : primary
      ? "border-zinc-800 bg-zinc-900/50"
      : "border-zinc-900 bg-zinc-950/40";
  const tagLabel = bundle
    ? "Bundle"
    : primary
      ? "Flagship"
      : pack.tier === "specialty"
        ? "Specialty"
        : "Pack";
  const tagColor = bundle
    ? "text-emerald-400"
    : primary
      ? "text-zinc-300"
      : "text-zinc-500";

  // Bundle takes 2 cols on lg, flagship takes 2 cols on lg, specialty 1
  const colSpan = primary ? "lg:col-span-2" : bundle ? "lg:col-span-1" : "";

  return (
    <div
      className={`rounded-xl border p-6 flex flex-col ${tagBg} ${colSpan} relative`}
    >
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
        <Price price={pack.price} className="text-3xl font-semibold text-zinc-100" />
        {pack.tier !== "bundle" && (
          <span className="text-xs text-zinc-500 ml-2">lifetime · v1.x updates</span>
        )}
      </div>

      <ul className="space-y-2 text-sm text-zinc-300 leading-relaxed mb-6 flex-1">
        {pack.highlights.slice(0, primary || bundle ? 6 : 4).map((h) => (
          <li key={h} className="flex gap-2">
            <span className="text-emerald-500/80 mt-0.5" aria-hidden>
              ✓
            </span>
            <span>{h}</span>
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
        <div className="rounded-lg border border-zinc-800 px-4 py-2.5 text-sm text-zinc-500 text-center">
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

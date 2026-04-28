import Link from "next/link";
import { notFound } from "next/navigation";
import { getPack } from "@/lib/packs";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ demo?: string }>;
};

// Post-purchase install page. The single most important screen in the funnel —
// the moment buyer-doubt either resolves or compounds. License key, install
// command, Discord invite, walkthrough video.
//
// In v1 of the dual-checkout flow (per CEO plan 2026-04-28) this page is
// reached via Stripe / Razorpay's success_url after payment. For now it
// renders a "demo" state when ?demo=1 is passed; the real wiring lands when
// the payment-provider entities are set up.
export default async function PackInstallPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { demo } = await searchParams;
  const pack = getPack(id);
  if (!pack) notFound();

  const isDemo = demo === "1";
  const licenseKey = isDemo ? "DEMO-PREVIEW-NOT-A-REAL-LICENSE" : "PENDING-PAYMENT-WIRING";

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <Link
        href={`/packs/${pack.id}`}
        className="text-xs text-zinc-500 hover:text-zinc-300 transition inline-flex items-center gap-1.5"
      >
        ← back to {pack.name}
      </Link>

      <header className="mt-6 mb-10">
        <p className="text-xs font-mono uppercase tracking-wider text-emerald-400/80 mb-2">
          {isDemo ? "Preview" : "Purchase complete"}
        </p>
        <h1 className="text-4xl font-semibold tracking-tight leading-tight">
          {isDemo ? `What buying ${pack.name} looks like` : `${pack.name} is yours.`}
        </h1>
        <p className="mt-3 text-zinc-400 max-w-2xl leading-relaxed">
          {isDemo
            ? "Real install page in 5 sections: license key, install command, Discord invite, walkthrough video, and what to do in the first 30 minutes. The Buy buttons aren't wired to a payment provider yet — checkout integration ships in days 1-14 of the implementation sequence (see the CEO plan)."
            : "Three things to do, in order. Should take 30 minutes."}
        </p>
      </header>

      {/* Step 1 — license key */}
      <Step number={1} title="Your license key">
        <p className="text-sm text-zinc-400 mb-4 leading-relaxed">
          One human per license. Use across as many of your own projects as you want. Save this
          somewhere — we also emailed it to you.
        </p>
        <div className="rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-3 font-mono text-sm text-emerald-400 break-all">
          {licenseKey}
        </div>
      </Step>

      {/* Step 2 — install command */}
      <Step number={2} title="Install on your machine">
        <p className="text-sm text-zinc-400 mb-4 leading-relaxed">
          From inside your astack workspace (the directory where you cloned this repo):
        </p>
        <pre className="rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-3 font-mono text-sm text-zinc-200 overflow-x-auto">
{`astack install-pack ${pack.id} --license ${isDemo ? "<your-license-key>" : licenseKey}`}
        </pre>
        <p className="mt-3 text-xs text-zinc-500 leading-relaxed">
          The CLI verifies your license, downloads the pack tarball, and lays the files into{" "}
          <code className="bg-zinc-900 px-1 rounded text-zinc-300">~/.astack/packs/{pack.id}/</code>
          . First-time install also seeds matching brain templates into your{" "}
          <code className="bg-zinc-900 px-1 rounded text-zinc-300">brain/</code> directory.
        </p>
      </Step>

      {/* Step 3 — Discord */}
      <Step number={3} title="Join the buyer community">
        <p className="text-sm text-zinc-400 mb-4 leading-relaxed">
          Per-buyer single-use invite. Monthly office hours run on the 4th Wednesday — see the
          pinned channel for the next session.
        </p>
        <a
          href={isDemo ? "#" : "https://discord.gg/PLACEHOLDER"}
          className="inline-flex items-center gap-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-100 px-4 py-2.5 text-sm font-medium transition"
        >
          <span>Join Discord</span>
          <span className="text-zinc-500">↗</span>
        </a>
        {isDemo && (
          <p className="mt-3 text-xs text-zinc-500">
            Discord wiring lands in days 31-60 of implementation (per CEO plan).
          </p>
        )}
      </Step>

      {/* Walkthrough */}
      <section className="mt-12 border-t border-zinc-900 pt-12">
        <p className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-3">
          22-min walkthrough
        </p>
        <h2 className="text-2xl font-semibold tracking-tight mb-3">Watch this first.</h2>
        <p className="text-sm text-zinc-400 leading-relaxed max-w-2xl mb-6">
          Install → first day → first sponsor reply. Recorded against the real {pack.name} flow.
          The fastest path to the moment where the brain feels alive.
        </p>
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 aspect-video flex items-center justify-center text-zinc-600 text-sm font-mono">
          {isDemo ? "(walkthrough video placeholder)" : "(loading walkthrough)"}
        </div>
      </section>

      {/* First 30 minutes */}
      <section className="mt-12 border-t border-zinc-900 pt-12">
        <p className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-3">
          What to do in the first 30 minutes
        </p>
        <ol className="space-y-3 text-sm text-zinc-300 leading-relaxed list-decimal list-inside max-w-2xl">
          <li>Install the pack with the command above.</li>
          <li>
            Open your astack workspace at{" "}
            <code className="bg-zinc-900 px-1 rounded text-zinc-200">localhost:3000/app</code> and
            click into one of the team rows in the left rail.
          </li>
          <li>Launch the team in Claude Code. The team manifest is appended automatically.</li>
          <li>
            Watch the 22-min walkthrough above with your terminal open. Pause and try each step.
          </li>
          <li>
            Run your first morning briefing tomorrow. Tell me how it goes in #buyer-wins on Discord.
          </li>
        </ol>
      </section>

      {/* Footer */}
      <p className="mt-16 text-xs text-zinc-600 text-center">
        {isDemo ? (
          <>This is a preview. Real install page lands when checkout is wired.</>
        ) : (
          <>
            Need help? Reply to your purchase email or post in #install-help on Discord.
          </>
        )}
      </p>
    </div>
  );
}

function Step({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-12 first:mt-0">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-7 h-7 rounded-full border border-zinc-800 bg-zinc-900 flex items-center justify-center font-mono text-xs text-zinc-400">
          {number}
        </div>
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      </div>
      <div className="pl-10">{children}</div>
    </section>
  );
}

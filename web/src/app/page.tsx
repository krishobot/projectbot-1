import Link from "next/link";
import { getAllTeams } from "@/lib/teams";
import { getBrainStatus } from "@/lib/brain";

export const dynamic = "force-dynamic";

export default function Home() {
  const teams = getAllTeams();
  const brain = getBrainStatus();

  return (
    <div className="space-y-12">
      <section>
        <h1 className="text-4xl font-semibold tracking-tight">Your virtual company</h1>
        <p className="text-zinc-400 mt-2 max-w-xl">
          Thirteen teams. One brain. Click a team to see its skills, charter, and handoffs — then launch a Claude Code session scoped to that role.
        </p>
        <BrainStatusLine status={brain} />
      </section>

      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map((t) => (
            <Link
              key={t.id}
              href={`/teams/${t.id}`}
              className="group rounded-xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900 hover:border-zinc-700 p-5 transition flex flex-col"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center font-mono text-xs font-semibold text-zinc-400 group-hover:text-emerald-400 group-hover:border-emerald-900/60 transition">
                  {t.number}
                </div>
                <h2 className="text-lg font-semibold tracking-tight group-hover:text-white">{t.name}</h2>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed line-clamp-3 flex-1">{t.charter}</p>
              <div className="mt-4 flex items-center gap-2 text-[11px] text-zinc-500 font-mono">
                <span>{t.gstackSkills.length} gstack</span>
                <span className="text-zinc-700">·</span>
                <span>{t.tbrainSkills.length} tbrain</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function BrainStatusLine({ status }: { status: ReturnType<typeof getBrainStatus> }) {
  if (!status.ok) {
    return (
      <div className="mt-4 inline-flex items-center gap-2 text-xs text-zinc-500">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" aria-hidden />
        <span className="font-mono uppercase tracking-wide text-amber-500/80">tbrain offline</span>
        <span className="text-zinc-600">·</span>
        <span>install gbrain CLI to connect</span>
      </div>
    );
  }
  return (
    <div className="mt-4 inline-flex items-center gap-2 text-xs text-zinc-500">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" aria-hidden />
      <span className="font-mono uppercase tracking-wide text-emerald-400/80">tbrain connected</span>
      <span className="text-zinc-600">·</span>
      <span className="font-mono">{status.pages} pages · {status.chunks} chunks · {status.links} links</span>
    </div>
  );
}

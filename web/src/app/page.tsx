import Link from "next/link";
import { getAllTeams } from "@/lib/teams";
import { getBrainStatus } from "@/lib/brain";

export const dynamic = "force-dynamic";

const ACCENT_BY_NUMBER: Record<string, string> = {
  "01": "from-amber-500 to-orange-500",
  "02": "from-emerald-400 to-teal-500",
  "03": "from-blue-500 to-indigo-500",
  "04": "from-pink-500 to-rose-500",
  "05": "from-violet-500 to-purple-500",
  "06": "from-red-500 to-rose-600",
  "07": "from-cyan-400 to-sky-500",
  "08": "from-yellow-400 to-amber-500",
  "09": "from-fuchsia-500 to-pink-500",
  "10": "from-lime-400 to-green-500",
  "11": "from-teal-400 to-emerald-500",
  "12": "from-zinc-400 to-zinc-500",
  "13": "from-indigo-400 to-blue-500",
};

export default function Home() {
  const teams = getAllTeams();
  const brain = getBrainStatus();

  return (
    <div className="space-y-12">
      <section>
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight">Your virtual company</h1>
            <p className="text-zinc-400 mt-2 max-w-xl">
              Thirteen teams. One brain. Click a team to see its skills, charter, and handoffs — then launch a Claude Code session scoped to that role.
            </p>
          </div>
          <BrainStatusBadge status={brain} />
        </div>
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
                <div
                  className={`w-9 h-9 rounded-lg bg-gradient-to-br ${ACCENT_BY_NUMBER[t.number] ?? "from-zinc-500 to-zinc-700"} flex items-center justify-center font-mono text-xs font-bold text-zinc-950`}
                >
                  {t.number}
                </div>
                <h2 className="text-base font-semibold tracking-tight group-hover:text-white">{t.name}</h2>
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

function BrainStatusBadge({ status }: { status: ReturnType<typeof getBrainStatus> }) {
  if (!status.ok) {
    return (
      <div className="rounded-lg border border-amber-900/40 bg-amber-950/30 px-4 py-2 text-xs text-amber-300">
        <div className="font-mono uppercase tracking-wide text-amber-400 text-[10px]">tbrain offline</div>
        <div className="text-amber-200/80 mt-0.5">install gbrain CLI to connect</div>
      </div>
    );
  }
  return (
    <div className="rounded-lg border border-emerald-900/40 bg-emerald-950/30 px-4 py-2 text-xs">
      <div className="font-mono uppercase tracking-wide text-emerald-400 text-[10px]">tbrain connected</div>
      <div className="text-emerald-200/80 mt-0.5 font-mono">
        {status.pages} pages · {status.chunks} chunks · {status.links} links
      </div>
    </div>
  );
}

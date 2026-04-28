import Link from "next/link";
import { getAllTeams } from "@/lib/teams";
import { getBrainStatus } from "@/lib/brain";

// Workspace shell: left rail of teams + main detail pane.
// Replaces the AI-slop card grid with a Linear-style sidebar.
export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const teams = getAllTeams();
  const brain = getBrainStatus();

  return (
    <div className="flex flex-1 min-h-screen">
      <aside className="w-64 shrink-0 border-r border-zinc-900 bg-zinc-950/60 flex flex-col">
        <Link
          href="/"
          className="flex items-center gap-2.5 px-5 py-4 border-b border-zinc-900 hover:bg-zinc-900/40 transition"
        >
          <div className="w-7 h-7 rounded-md bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center font-semibold text-zinc-950 text-xs">
            a
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-tight">astack</div>
            <div className="text-[10px] text-zinc-500 font-mono">+ tbrain</div>
          </div>
        </Link>

        <div className="px-3 pt-4 pb-2">
          <Link
            href="/app"
            className="block px-3 py-1.5 text-xs uppercase tracking-wider text-zinc-500 hover:text-zinc-300 transition font-mono"
          >
            Workspace
          </Link>
        </div>

        <div className="px-3 pb-2">
          <p className="px-3 py-1.5 text-xs uppercase tracking-wider text-zinc-600 font-mono">
            Teams
          </p>
          <nav className="space-y-0.5">
            {teams.map((t) => (
              <Link
                key={t.id}
                href={`/teams/${t.id}`}
                className="group flex items-center gap-2.5 px-3 py-1.5 rounded-md text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60 transition"
              >
                <span className="font-mono text-[10px] text-zinc-600 w-5 group-hover:text-emerald-500/80">
                  {t.number}
                </span>
                <span className="truncate">{t.name}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-auto border-t border-zinc-900 px-5 py-4">
          <BrainStatusIndicator status={brain} />
          <Link
            href="/setup/mcp"
            className="mt-3 block text-xs text-zinc-500 hover:text-zinc-300 transition"
          >
            Connect Claude →
          </Link>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-8 py-12">{children}</div>
      </main>
    </div>
  );
}

function BrainStatusIndicator({ status }: { status: ReturnType<typeof getBrainStatus> }) {
  if (!status.ok) {
    return (
      <div className="flex items-center gap-2 text-xs">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" aria-hidden />
        <span className="font-mono uppercase tracking-wide text-amber-500/80 text-[10px]">
          tbrain offline
        </span>
      </div>
    );
  }
  return (
    <div className="text-xs">
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" aria-hidden />
        <span className="font-mono uppercase tracking-wide text-emerald-400/80 text-[10px]">
          tbrain connected
        </span>
      </div>
      <div className="mt-1.5 text-[11px] text-zinc-500 font-mono tabular-nums">
        {status.pages} pages · {status.chunks} chunks · {status.links} links
      </div>
    </div>
  );
}

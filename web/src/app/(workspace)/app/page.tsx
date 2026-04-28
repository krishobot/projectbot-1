import Link from "next/link";
import { getAllTeams } from "@/lib/teams";
import { getDesktopHealth } from "@/lib/desktop";

export const dynamic = "force-dynamic";

// Workspace landing view. The sidebar already lists all 13 teams, so this
// pane is for orientation, not enumeration: what to do next, what's wired,
// what isn't.
export default async function WorkspaceHome() {
  const teams = getAllTeams();
  const daemon = await getDesktopHealth();
  const daemonUp = !!daemon;

  // Three suggested entry points, not a 13-card grid.
  const suggested = [
    { id: "executive", label: "Start here for a new product idea" },
    { id: "engineering", label: "Architecture review or implementation" },
    { id: "release-devops", label: "Ready to ship?" },
  ];
  const suggestedTeams = suggested.map((s) => ({
    ...s,
    team: teams.find((t) => t.id === s.id),
  }));

  return (
    <div className="space-y-12">
      <section>
        <p className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-3">Workspace</p>
        <h1 className="text-3xl font-semibold tracking-tight">Pick a team to start.</h1>
        <p className="mt-3 text-zinc-400 max-w-xl leading-relaxed">
          Each team is a Claude Code session pre-scoped to a charter, a skill allowlist, and a set
          of brain pages it owns. Choose from the sidebar, or jump straight into one of the
          common entry points below.
        </p>
      </section>

      <section>
        <p className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-4">
          Common entry points
        </p>
        <div className="space-y-2">
          {suggestedTeams.map(
            ({ id, label, team }) =>
              team && (
                <Link
                  key={id}
                  href={`/teams/${id}`}
                  className="group flex items-center gap-4 px-4 py-3.5 -mx-4 rounded-lg hover:bg-zinc-900/60 transition"
                >
                  <span className="font-mono text-xs text-zinc-600 w-7 group-hover:text-emerald-500/80">
                    {team.number}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-zinc-100 group-hover:text-white">
                      {team.name}
                    </div>
                    <div className="text-xs text-zinc-500 mt-0.5">{label}</div>
                  </div>
                  <span className="text-xs text-zinc-600 font-mono opacity-0 group-hover:opacity-100 transition">
                    →
                  </span>
                </Link>
              )
          )}
        </div>
      </section>

      <section>
        <p className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-4">
          System status
        </p>
        <div className="space-y-3">
          <StatusRow
            label="Desktop companion"
            ok={daemonUp}
            okText={daemon?.platform ? `running on 127.0.0.1:7331 · ${daemon.platform}` : "running"}
            offText="offline · cd desktop && bun run start"
          />
          <StatusRow
            label="tbrain (gbrain CLI)"
            ok={!!daemon?.gbrain.available}
            okText={daemon?.gbrain.version ? `v${daemon.gbrain.version}` : "available"}
            offText="not on PATH · install gbrain to enable brain access"
          />
        </div>
      </section>
    </div>
  );
}

function StatusRow({
  label,
  ok,
  okText,
  offText,
}: {
  label: string;
  ok: boolean;
  okText: string;
  offText: string;
}) {
  return (
    <div className="flex items-baseline gap-3 text-sm">
      <span
        className={`w-1.5 h-1.5 rounded-full ${ok ? "bg-emerald-400" : "bg-amber-500"} self-center`}
        aria-hidden
      />
      <span className="text-zinc-300 w-44">{label}</span>
      <span className="text-zinc-500 font-mono text-xs">{ok ? okText : offText}</span>
    </div>
  );
}

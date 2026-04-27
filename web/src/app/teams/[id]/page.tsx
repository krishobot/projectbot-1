import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllTeams, getTeam } from "@/lib/teams";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return getAllTeams().map((t) => ({ id: t.id }));
}

type Props = { params: Promise<{ id: string }> };

export default async function TeamPage({ params }: Props) {
  const { id } = await params;
  const team = getTeam(id);
  if (!team) notFound();

  return (
    <div className="space-y-10">
      <div>
        <Link href="/" className="text-xs text-zinc-500 hover:text-zinc-300 transition">← all teams</Link>
        <h1 className="text-3xl font-semibold tracking-tight mt-3">
          <span className="text-zinc-500 font-mono mr-3">{team.number}</span>
          {team.name}
        </h1>
        <p className="text-zinc-400 mt-3 max-w-2xl leading-relaxed">{team.charter}</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          className="rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 px-4 py-2 text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled
          title="Requires the astack desktop companion (coming v0.2)"
        >
          ⌘ Launch terminal as {team.name}
        </button>
        <Link
          href="/setup/mcp"
          className="rounded-lg border border-zinc-700 hover:border-zinc-500 hover:bg-zinc-900 px-4 py-2 text-sm transition"
        >
          Connect this team to Claude
        </Link>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SkillsCard label="GStack skills" skills={team.gstackSkills} colorClass="text-cyan-400" />
        <SkillsCard label="tbrain skills" skills={team.tbrainSkills} colorClass="text-emerald-400" />
      </section>

      {team.brainPages.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold tracking-tight text-zinc-300 uppercase mb-3">Brain pages this team writes</h2>
          <ul className="space-y-2 text-sm font-mono text-zinc-400">
            {team.brainPages.map((p, i) => (
              <li key={i} className="border-l-2 border-zinc-800 pl-3">{p}</li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h2 className="text-sm font-semibold tracking-tight text-zinc-300 uppercase mb-3">Full manifest</h2>
        <pre className="rounded-xl border border-zinc-900 bg-zinc-950 p-5 text-xs text-zinc-400 leading-relaxed overflow-x-auto whitespace-pre-wrap font-mono">{team.body}</pre>
      </section>
    </div>
  );
}

function SkillsCard({ label, skills, colorClass }: { label: string; skills: string[]; colorClass: string }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-5">
      <div className={`text-[11px] font-mono uppercase tracking-wide ${colorClass} mb-3`}>{label}</div>
      {skills.length === 0 ? (
        <div className="text-sm text-zinc-600 italic">none assigned</div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {skills.map((s) => (
            <span key={s} className="rounded-md bg-zinc-800/80 border border-zinc-700 px-2 py-1 text-xs font-mono text-zinc-300">{s}</span>
          ))}
        </div>
      )}
    </div>
  );
}

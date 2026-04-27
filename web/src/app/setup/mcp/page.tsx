import Link from "next/link";
import { getDesktopHealth, getMcpStatus } from "@/lib/desktop";
import { autoWireAction } from "./actions";

export const dynamic = "force-dynamic";

const SNIPPET = `{
  "mcpServers": {
    "tbrain": {
      "command": "gbrain",
      "args": ["mcp"]
    }
  }
}`;

export default async function McpSetupPage() {
  const [health, mcp] = await Promise.all([getDesktopHealth(), getMcpStatus()]);
  const daemonUp = !!health;

  return (
    <div className="space-y-10 max-w-3xl">
      <div>
        <Link href="/" className="text-xs text-zinc-500 hover:text-zinc-300 transition">← back to org</Link>
        <h1 className="text-3xl font-semibold tracking-tight mt-3">Connect your Claude to tbrain</h1>
        <p className="text-zinc-400 mt-3 leading-relaxed">
          tbrain ships an MCP server (gbrain&apos;s under the hood). Point your Claude Desktop or Claude Code at it and every chat reads and writes the same brain your astack agents do — same people, same companies, same deals, same memory.
        </p>
      </div>

      <DaemonStatus health={health} />

      {daemonUp && mcp ? (
        <AutoWireSection mcp={mcp} />
      ) : (
        <ManualSnippetSection />
      )}

      <section className="space-y-4">
        <h2 className="text-sm font-semibold tracking-tight text-zinc-300 uppercase">Verify after restarting</h2>
        <ol className="list-decimal list-inside space-y-2 text-sm text-zinc-300 leading-relaxed">
          <li>Quit Claude Desktop fully (or run <code className="font-mono text-zinc-200 bg-zinc-900 px-1 rounded">/restart</code> in Claude Code).</li>
          <li>Reopen. The MCP server <span className="text-emerald-400 font-mono">tbrain</span> should appear in the integrations list.</li>
          <li>Try: <span className="text-zinc-100 italic">&ldquo;Use tbrain to look up everything we know about &lt;person&gt;.&rdquo;</span></li>
        </ol>
      </section>
    </div>
  );
}

function DaemonStatus({ health }: { health: Awaited<ReturnType<typeof getDesktopHealth>> }) {
  if (!health) {
    return (
      <section className="rounded-xl border border-amber-900/40 bg-amber-950/20 p-5">
        <div className="text-[11px] font-mono uppercase tracking-wide text-amber-400 mb-2">desktop companion offline</div>
        <p className="text-sm text-amber-100/90 leading-relaxed">
          Auto-wire needs the astack desktop companion running on this machine. Start it with{" "}
          <code className="bg-zinc-900 px-1.5 py-0.5 rounded text-amber-200">cd desktop && bun run start</code>{" "}
          (from the astack repo root). Falling back to the manual snippet below.
        </p>
      </section>
    );
  }
  return (
    <section className="rounded-xl border border-emerald-900/40 bg-emerald-950/20 p-5">
      <div className="text-[11px] font-mono uppercase tracking-wide text-emerald-400 mb-2">desktop companion connected</div>
      <div className="text-sm text-emerald-100/80 font-mono">
        v{health.version} · {health.platform}/{health.arch} · gbrain {health.gbrain.available ? `✓ ${health.gbrain.version ?? ""}` : "✗ not found in PATH"}
      </div>
    </section>
  );
}

function AutoWireSection({ mcp }: { mcp: NonNullable<Awaited<ReturnType<typeof getMcpStatus>>> }) {
  return (
    <section className="space-y-4">
      <h2 className="text-sm font-semibold tracking-tight text-zinc-300 uppercase">Auto-wire</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <ClientCard label="Claude Desktop" clientId="claude-desktop" status={mcp.clients["claude-desktop"]} />
        <ClientCard label="Claude Code" clientId="claude-code" status={mcp.clients["claude-code"]} />
      </div>
    </section>
  );
}

function ClientCard({
  label,
  clientId,
  status,
}: {
  label: string;
  clientId: "claude-desktop" | "claude-code";
  status: { configFound: boolean; tbrainWired: boolean; path: string };
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <div className="text-sm font-semibold">{label}</div>
          <div className="text-[11px] font-mono text-zinc-500 mt-1 break-all">{status.path}</div>
        </div>
        <StatusPill status={status} />
      </div>

      {status.tbrainWired ? (
        <p className="text-xs text-emerald-300">
          ✓ tbrain wired. Restart {label} to activate.
        </p>
      ) : status.configFound ? (
        <form action={autoWireAction}>
          <input type="hidden" name="client" value={clientId} />
          <button
            type="submit"
            className="w-full rounded-md bg-emerald-500 hover:bg-emerald-400 text-zinc-950 px-3 py-2 text-xs font-semibold transition"
          >
            Auto-wire tbrain
          </button>
          <p className="text-[11px] text-zinc-500 mt-2">Backs up the existing config, then merges in the tbrain entry.</p>
        </form>
      ) : (
        <form action={autoWireAction}>
          <input type="hidden" name="client" value={clientId} />
          <button
            type="submit"
            className="w-full rounded-md bg-zinc-700 hover:bg-zinc-600 text-zinc-100 px-3 py-2 text-xs font-semibold transition"
          >
            Create config + wire tbrain
          </button>
          <p className="text-[11px] text-zinc-500 mt-2">No config file exists yet. Will create a fresh one with only tbrain wired.</p>
        </form>
      )}
    </div>
  );
}

function StatusPill({ status }: { status: { configFound: boolean; tbrainWired: boolean } }) {
  if (status.tbrainWired) {
    return <span className="rounded-full bg-emerald-900/60 text-emerald-300 text-[10px] font-mono uppercase px-2 py-0.5">wired</span>;
  }
  if (status.configFound) {
    return <span className="rounded-full bg-amber-900/40 text-amber-300 text-[10px] font-mono uppercase px-2 py-0.5">config found</span>;
  }
  return <span className="rounded-full bg-zinc-800 text-zinc-400 text-[10px] font-mono uppercase px-2 py-0.5">not installed</span>;
}

function ManualSnippetSection() {
  return (
    <>
      <section className="space-y-4">
        <h2 className="text-sm font-semibold tracking-tight text-zinc-300 uppercase">1 · Snippet to add</h2>
        <pre className="rounded-xl border border-zinc-800 bg-zinc-950 p-5 text-sm font-mono text-zinc-200 overflow-x-auto">{SNIPPET}</pre>
        <p className="text-xs text-zinc-500">If you already have other MCP servers configured, merge the <code className="text-zinc-300 bg-zinc-900 px-1 rounded">tbrain</code> entry into the existing <code className="text-zinc-300 bg-zinc-900 px-1 rounded">mcpServers</code> object — don&apos;t replace.</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold tracking-tight text-zinc-300 uppercase">2 · Where it goes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <ConfigPath client="Claude Desktop" os="macOS" path="~/Library/Application Support/Claude/claude_desktop_config.json" />
          <ConfigPath client="Claude Desktop" os="Windows" path="%APPDATA%\\Claude\\claude_desktop_config.json" />
          <ConfigPath client="Claude Code" os="all" path="~/.claude/settings.json" />
          <ConfigPath client="Claude Code" os="per-project" path=".claude/settings.json" />
        </div>
      </section>
    </>
  );
}

function ConfigPath({ client, os, path }: { client: string; os: string; path: string }) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
      <div className="text-[11px] font-mono uppercase text-zinc-500">{client} · {os}</div>
      <div className="text-xs font-mono text-zinc-300 mt-1 break-all">{path}</div>
    </div>
  );
}

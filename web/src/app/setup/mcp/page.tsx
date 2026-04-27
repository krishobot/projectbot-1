import Link from "next/link";

const SNIPPET = `{
  "mcpServers": {
    "tbrain": {
      "command": "gbrain",
      "args": ["mcp"]
    }
  }
}`;

export default function McpSetupPage() {
  return (
    <div className="space-y-10 max-w-3xl">
      <div>
        <Link href="/" className="text-xs text-zinc-500 hover:text-zinc-300 transition">← back to org</Link>
        <h1 className="text-3xl font-semibold tracking-tight mt-3">Connect your Claude to tbrain</h1>
        <p className="text-zinc-400 mt-3 leading-relaxed">
          tbrain ships an MCP server (gbrain&apos;s under the hood). Point your Claude Desktop or Claude Code at it and every chat reads and writes the same brain your astack agents do — same people, same companies, same deals, same memory.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold tracking-tight text-zinc-300 uppercase">1 · Snippet to add</h2>
        <pre className="rounded-xl border border-zinc-800 bg-zinc-950 p-5 text-sm font-mono text-zinc-200 overflow-x-auto">{SNIPPET}</pre>
        <p className="text-xs text-zinc-500">If you already have other MCP servers configured, merge the <code className="text-zinc-300 bg-zinc-900 px-1 rounded">tbrain</code> entry into the existing <code className="text-zinc-300 bg-zinc-900 px-1 rounded">mcpServers</code> object — don&apos;t replace.</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold tracking-tight text-zinc-300 uppercase">2 · Where it goes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <ConfigPath
            client="Claude Desktop"
            os="macOS"
            path="~/Library/Application Support/Claude/claude_desktop_config.json"
          />
          <ConfigPath
            client="Claude Desktop"
            os="Windows"
            path="%APPDATA%\\Claude\\claude_desktop_config.json"
          />
          <ConfigPath
            client="Claude Code"
            os="all"
            path="~/.claude/settings.json"
          />
          <ConfigPath
            client="Claude Code"
            os="per-project"
            path=".claude/settings.json"
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold tracking-tight text-zinc-300 uppercase">3 · Restart and verify</h2>
        <ol className="list-decimal list-inside space-y-2 text-sm text-zinc-300 leading-relaxed">
          <li>Quit Claude Desktop fully (or run <code className="font-mono text-zinc-200 bg-zinc-900 px-1 rounded">/restart</code> in Claude Code).</li>
          <li>Reopen. The MCP server <span className="text-emerald-400 font-mono">tbrain</span> should appear in the integrations list.</li>
          <li>Try: <span className="text-zinc-100 italic">&ldquo;Use tbrain to look up everything we know about &lt;person&gt;.&rdquo;</span></li>
        </ol>
      </section>

      <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
        <h3 className="text-sm font-semibold tracking-tight text-zinc-200 mb-2">Auto-wire (coming v0.2)</h3>
        <p className="text-xs text-zinc-400 leading-relaxed">
          The astack desktop companion will detect your Claude config file, back it up, merge in the <code className="text-zinc-200">tbrain</code> entry, and restart Claude — one click. For now, paste manually; takes 30 seconds.
        </p>
      </section>
    </div>
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

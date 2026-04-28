import Link from "next/link";
import { getCurrentUser } from "@/lib/supabase/server";

// Marketing shell: top nav + footer. Used by /, /login, /setup/mcp.
// The workspace shell at (workspace)/layout.tsx is separate.
export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  const supabaseConfigured = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  return (
    <>
      <header className="border-b border-zinc-900/80 bg-zinc-950/70 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group min-h-11 -my-2 py-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center font-semibold text-zinc-950 text-sm">
              a
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-tight">astack</div>
              <div className="text-[11px] text-zinc-500">+ tbrain</div>
            </div>
          </Link>
          <nav className="flex items-center gap-1 text-sm">
            <Link
              href="/setup/mcp"
              className="text-zinc-400 hover:text-zinc-100 transition px-3 py-3 -my-1"
            >
              Connect Claude
            </Link>
            <a
              href="https://github.com/krishobot/projectbot-1"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-zinc-300 transition text-xs px-3 inline-flex items-center min-h-11 -my-1"
            >
              GitHub ↗
            </a>
            {supabaseConfigured && !user && (
              <Link
                href="/login"
                className="text-zinc-400 hover:text-zinc-100 transition px-3 py-3 -my-1"
              >
                Sign in
              </Link>
            )}
            <Link
              href="/app"
              className="ml-2 rounded-md bg-emerald-500 hover:bg-emerald-400 text-zinc-950 px-4 py-2 text-sm font-semibold transition"
            >
              Open app →
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 w-full">{children}</main>
      <footer className="border-t border-zinc-900 mt-24">
        <div className="max-w-6xl mx-auto px-6 py-8 text-xs text-zinc-500 flex flex-wrap items-center justify-between gap-3">
          <div>
            Built on Garry Tan&apos;s{" "}
            <a
              href="https://github.com/garrytan/gstack"
              className="underline decoration-zinc-700 hover:text-zinc-300 hover:decoration-zinc-500"
              target="_blank"
              rel="noopener noreferrer"
            >
              GStack
            </a>{" "}
            and{" "}
            <a
              href="https://github.com/garrytan/gbrain"
              className="underline decoration-zinc-700 hover:text-zinc-300 hover:decoration-zinc-500"
              target="_blank"
              rel="noopener noreferrer"
            >
              GBrain
            </a>{" "}
            (MIT).
          </div>
          <div className="font-mono">v0.1</div>
        </div>
      </footer>
    </>
  );
}

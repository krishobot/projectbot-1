import Link from "next/link";
import { getCurrentUser } from "@/lib/supabase/server";
import { Logo } from "@/components/Logo";

// Marketing shell: top nav + footer. Used by /, /login, /setup/mcp.
// The workspace shell at (workspace)/layout.tsx is separate.
export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  const supabaseConfigured = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  return (
    <>
      <header className="border-b border-zinc-900/80 bg-zinc-950/70 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Brand wordmark — non-clickable on marketing. The brand
              navigates somewhere ("home") only inside the workspace, where
              the user has paid and "home" is the workspace itself. */}
          <div className="flex items-center gap-3 min-h-11 -my-2 py-2">
            <Logo size={32} />
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-tight">astack</div>
              <div className="text-[11px] text-zinc-500">+ tbrain</div>
            </div>
          </div>
          <nav className="flex items-center gap-1 text-sm">
            <Link
              href="/packs"
              className="text-zinc-400 hover:text-zinc-100 transition px-3 py-3 -my-1"
            >
              Packs
            </Link>
            {supabaseConfigured && !user && (
              <Link
                href="/login"
                className="text-zinc-400 hover:text-zinc-100 transition px-3 py-3 -my-1"
              >
                Sign in
              </Link>
            )}
            {supabaseConfigured && user && (
              <form action="/auth/signout" method="post" className="inline-flex">
                <button
                  type="submit"
                  className="text-zinc-400 hover:text-zinc-100 transition px-3 py-3 -my-1 text-sm"
                >
                  Sign out
                </button>
              </form>
            )}
            <Link
              href="/packs"
              className="ml-2 rounded-md bg-emerald-500 hover:bg-emerald-400 text-zinc-950 px-4 py-2 text-sm font-semibold transition"
            >
              Buy a pack →
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 w-full">{children}</main>
      <footer className="border-t border-zinc-900 mt-24">
        <div className="max-w-6xl mx-auto px-6 py-8 text-xs text-zinc-500 flex flex-wrap items-center justify-between gap-3">
          <div>astack + tbrain — open source, MIT.</div>
          <div className="font-mono">v0.1</div>
        </div>
      </footer>
    </>
  );
}

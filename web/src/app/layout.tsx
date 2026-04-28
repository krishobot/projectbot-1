import type { Metadata } from "next";
import Link from "next/link";
import { Inter, JetBrains_Mono } from "next/font/google";
import { getCurrentUser } from "@/lib/supabase/server";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "astack — virtual company in Claude Code",
  description: "Run a 13-team virtual company on top of GStack and GBrain. Powered by tbrain.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  const supabaseConfigured = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  return (
    <html lang="en" className={`dark h-full antialiased ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-zinc-950 text-zinc-100 min-h-full flex flex-col font-sans">
        <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group min-h-11 -my-2 py-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center font-bold text-zinc-950 text-sm">
                a
              </div>
              <div className="leading-tight">
                <div className="text-sm font-semibold tracking-tight">astack</div>
                <div className="text-[11px] text-zinc-500">+ tbrain</div>
              </div>
            </Link>
            <nav className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-zinc-300 hover:text-white transition px-3 py-3 -my-1">Org</Link>
              <Link href="/setup/mcp" className="text-zinc-300 hover:text-white transition px-3 py-3 -my-1">Connect Claude</Link>
              {supabaseConfigured && (
                user ? (
                  <span className="text-zinc-400 text-xs font-mono px-3">{user.email}</span>
                ) : (
                  <Link href="/login" className="rounded-md bg-emerald-500 hover:bg-emerald-400 text-zinc-950 px-3 py-2 text-xs font-semibold transition">
                    Sign in
                  </Link>
                )
              )}
              <a
                href="https://github.com/krishobot/projectbot-1"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-500 hover:text-zinc-300 transition text-xs px-3 inline-flex items-center min-h-11 -my-1"
              >
                repo ↗
              </a>
            </nav>
          </div>
        </header>
        <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-10">{children}</main>
        <footer className="border-t border-zinc-900 mt-16">
          <div className="max-w-6xl mx-auto px-6 py-6 text-xs text-zinc-500 flex flex-wrap items-center justify-between gap-2">
            <div>Built on Garry Tan&apos;s <a href="https://github.com/garrytan/gstack" className="underline hover:text-zinc-300" target="_blank" rel="noopener noreferrer">GStack</a> and <a href="https://github.com/garrytan/gbrain" className="underline hover:text-zinc-300" target="_blank" rel="noopener noreferrer">GBrain</a> (MIT).</div>
            <div>v0.1</div>
          </div>
        </footer>
      </body>
    </html>
  );
}

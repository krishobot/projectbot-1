import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/server";
import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ next?: string }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseConfigured = !!(url && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  if (!supabaseConfigured) {
    return (
      <div className="max-w-md mx-auto py-16 px-6">
        <h1 className="text-2xl font-semibold tracking-tight mb-3">Single-user local mode</h1>
        <p className="text-zinc-400 text-sm leading-relaxed">
          Supabase Auth is not configured for this install. astack is running
          in single-user local mode — no login required, the brain on your
          machine is yours.
        </p>
        <Link href="/app" className="inline-block mt-8 text-emerald-400 hover:text-emerald-300 text-sm">
          → Open the workspace
        </Link>
      </div>
    );
  }

  const user = await getCurrentUser();
  if (user) redirect("/app");

  // Detect whether the user just came from a Gumroad post-purchase redirect.
  // The proxy preserves `?purchased=<id>` through the auth flow as the `next`
  // query param, so we can check for it here and tailor the copy.
  const { next } = await searchParams;
  const isPostPurchase = !!next && /[?&]purchased=/.test(next);

  return (
    <div className="relative min-h-[calc(100vh-100px)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-[radial-gradient(closest-side,rgba(16,185,129,0.18),rgba(34,211,238,0.06)_40%,transparent_70%)] blur-2xl" />
      </div>

      <div className="max-w-md mx-auto px-6 py-20">
        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/40 px-3 py-1 text-xs text-zinc-400 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" aria-hidden />
          {isPostPurchase ? "purchase confirmed" : "welcome back"}
        </div>

        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight leading-tight mb-3">
          {isPostPurchase ? (
            <>
              Almost there.
              <br />
              <span className="text-emerald-400">Send your access link.</span>
            </>
          ) : (
            <>
              Welcome back.
              <br />
              <span className="text-emerald-400">Magic link to your inbox.</span>
            </>
          )}
        </h1>

        <p className="text-zinc-400 leading-relaxed mb-8">
          {isPostPurchase ? (
            <>
              Enter the email you used at Gumroad. We&apos;ll send your magic
              link — one click and you&apos;re inside the workspace with the
              full astack + tbrain source unlocked.
            </>
          ) : (
            <>
              Enter your email; we&apos;ll send a one-click sign-in link. No
              passwords, no friction. New here?{" "}
              <Link href="/" className="text-emerald-400 hover:text-emerald-300">
                See the packs
              </Link>{" "}
              first.
            </>
          )}
        </p>

        <LoginForm />

        <p className="text-[11px] text-zinc-500 mt-6 leading-relaxed">
          Built on Supabase Auth. Your brain is end-to-end yours; we don&apos;t
          store the contents — only the ownership.
        </p>

        <Link
          href="/"
          className="inline-block mt-10 text-xs text-zinc-500 hover:text-zinc-300 transition"
        >
          ← back home
        </Link>
      </div>
    </div>
  );
}

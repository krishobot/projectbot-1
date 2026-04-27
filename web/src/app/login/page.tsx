import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/server";
import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseConfigured = !!(url && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  if (!supabaseConfigured) {
    return (
      <div className="max-w-md mx-auto py-16">
        <h1 className="text-2xl font-semibold tracking-tight mb-3">Single-user local mode</h1>
        <p className="text-zinc-400 text-sm leading-relaxed">
          Supabase Auth is not configured for this install. astack is running in single-user local mode — no login required, the brain on your machine is yours.
        </p>
        <p className="text-zinc-500 text-xs leading-relaxed mt-6">
          To enable multi-user / hosted mode, set <code className="font-mono bg-zinc-900 px-1 rounded">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
          <code className="font-mono bg-zinc-900 px-1 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in <code className="font-mono bg-zinc-900 px-1 rounded">web/.env.local</code> and restart.
        </p>
        <Link href="/" className="inline-block mt-8 text-emerald-400 hover:text-emerald-300 text-sm">
          ← back to org
        </Link>
      </div>
    );
  }

  const user = await getCurrentUser();
  if (user) redirect("/");

  return (
    <div className="max-w-sm mx-auto py-16">
      <h1 className="text-2xl font-semibold tracking-tight mb-2">Sign in to astack</h1>
      <p className="text-zinc-400 text-sm leading-relaxed mb-8">
        Email magic link. Your brain is end-to-end yours; we don&apos;t store the contents, only the ownership.
      </p>
      <LoginForm />
      <p className="text-[11px] text-zinc-500 mt-8 leading-relaxed">
        Built on Supabase Auth. New here? The same form sends a magic link and creates the account on first click.
      </p>
    </div>
  );
}

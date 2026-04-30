"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import { safeNext } from "@/lib/safe-next";

export function LoginForm() {
  const searchParams = useSearchParams();
  const next = safeNext(searchParams.get("next")) || "/app";
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError(null);
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setError("Supabase not configured");
      setStatus("error");
      return;
    }
    const callback = new URL("/auth/callback", window.location.origin);
    callback.searchParams.set("next", next);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: callback.toString() },
    });
    if (error) {
      setError(error.message);
      setStatus("error");
      return;
    }
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div className="space-y-8">
        <div className="rounded-lg border border-emerald-900/50 bg-emerald-950/30 p-5">
          <p className="text-xs font-mono uppercase tracking-wider text-emerald-300/90 mb-2">
            Magic link sent
          </p>
          <p className="text-sm text-zinc-200 leading-relaxed">
            Check <span className="font-mono text-emerald-300">{email}</span>.
            One click and you&apos;re in.
          </p>
        </div>

        <div className="space-y-5">
          <p className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">
            What you&apos;re signing into
          </p>

          <p className="text-base text-zinc-200 leading-relaxed">
            <span className="text-emerald-400 font-semibold">A virtual company you run from one terminal.</span>{" "}
            Thirteen specialised AI teammates. One brain that doesn&apos;t
            forget. One human at the keyboard.
          </p>

          <div className="space-y-3 text-sm text-zinc-400 leading-relaxed">
            <p>
              <span className="text-zinc-200 font-semibold">astack</span> — your
              staff. Executive, Engineering, Design, QA, Release, DevEx,
              Security, Product, Marketing, Sales, Customer Success, Ops, Data.
              Each one a Claude Code session pre-scoped to its charter and its
              skills. They hand work to each other through markdown files.
            </p>
            <p>
              <span className="text-zinc-200 font-semibold">tbrain</span> — the
              staff memory. Every person, deal, decision, meeting, and shipped
              artifact gets a markdown page. Every team reads from the same
              source of truth. Nothing important lives in chat history.
            </p>
          </div>

          <p className="text-sm text-zinc-300 leading-relaxed border-l-2 border-emerald-500/40 pl-4 italic">
            Solo founders don&apos;t lose to bad ideas. They lose to context
            evaporating between tabs, scrollback, and a Notion they stopped
            opening in week three. astack and tbrain fix that.
          </p>

          <p className="text-xs text-zinc-500 leading-relaxed">
            One person. Thirteen roles. Zero meetings.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <input
        type="email"
        required
        autoFocus
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="founder@example.com"
        className="w-full rounded-lg bg-zinc-900 border border-zinc-800 px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 placeholder:text-zinc-600"
      />
      <button
        type="submit"
        disabled={status === "sending" || !email}
        className="w-full rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-800 disabled:text-zinc-600 text-zinc-950 font-semibold py-3 text-sm transition"
      >
        {status === "sending" ? "Sending..." : "Send magic link"}
      </button>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </form>
  );
}

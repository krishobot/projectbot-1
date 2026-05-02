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
  const [oauthStatus, setOauthStatus] = useState<"idle" | "redirecting">("idle");

  async function onGitHub() {
    setOauthStatus("redirecting");
    setError(null);
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setError("Supabase not configured");
      setOauthStatus("idle");
      return;
    }
    const callback = new URL("/auth/callback", window.location.origin);
    callback.searchParams.set("next", next);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: callback.toString(),
        scopes: "read:user user:email",
      },
    });
    if (error) {
      setError(error.message);
      setOauthStatus("idle");
    }
    // On success Supabase redirects the page; nothing to do here.
  }

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
    <div className="space-y-4">
      <button
        type="button"
        onClick={onGitHub}
        disabled={oauthStatus === "redirecting"}
        className="w-full rounded-lg bg-zinc-100 hover:bg-white disabled:bg-zinc-800 disabled:text-zinc-600 text-zinc-950 font-semibold py-3 text-sm transition flex items-center justify-center gap-2"
      >
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="currentColor"
        >
          <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.55 0-.27-.01-1-.02-1.96-3.2.7-3.87-1.54-3.87-1.54-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.68 1.24 3.34.95.1-.74.4-1.24.72-1.53-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18.91-.25 1.89-.38 2.86-.38.97 0 1.95.13 2.86.38 2.18-1.49 3.14-1.18 3.14-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.41-5.26 5.69.41.36.78 1.06.78 2.13 0 1.54-.01 2.78-.01 3.16 0 .31.21.66.8.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" />
        </svg>
        {oauthStatus === "redirecting" ? "Opening GitHub..." : "Continue with GitHub"}
      </button>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-zinc-800" />
        <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-600">
          or magic link
        </span>
        <div className="h-px flex-1 bg-zinc-800" />
      </div>

      <form onSubmit={onSubmit} className="space-y-3">
        <input
          type="email"
          required
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
      </form>

      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

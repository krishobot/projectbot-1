"use client";

import { useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

export function LoginForm() {
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
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
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
      <div className="rounded-lg border border-emerald-900/50 bg-emerald-950/30 p-4 text-sm text-emerald-200">
        Check <span className="font-mono">{email}</span> for your magic link.
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

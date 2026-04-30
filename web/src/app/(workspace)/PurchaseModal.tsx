"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const REPO_URL = "https://github.com/krishobot/projectbot-1";
const FOUNDER_EMAIL = "tanirudh127@gmail.com";

// Fires when the user lands on /app with ?purchased=<pack-id|1>. Dismissing it
// strips the query param so a reload doesn't re-trigger.
export function PurchaseModal() {
  const params = useSearchParams();
  const router = useRouter();
  const purchased = params.get("purchased");
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (purchased) {
      setOpen(true);
      // Defer the fade-in by one frame so the transition actually animates.
      requestAnimationFrame(() => setMounted(true));
    }
  }, [purchased]);

  if (!purchased || !open) return null;

  const packLabel =
    purchased === "1" || purchased === "true"
      ? "an astack pack"
      : prettyPackName(purchased);

  function close() {
    setMounted(false);
    // Match the 200ms transition before fully removing.
    setTimeout(() => {
      setOpen(false);
      router.replace("/app");
    }, 200);
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="purchase-modal-title"
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-200 ${
        mounted ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close"
        onClick={close}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm cursor-default"
      />

      {/* Card */}
      <div
        className={`relative w-full max-w-lg rounded-2xl border border-emerald-900/60 bg-zinc-950 shadow-2xl shadow-emerald-500/10 transition-transform duration-200 ${
          mounted ? "scale-100" : "scale-95"
        }`}
      >
        {/* Atmosphere — soft emerald glow at the top of the card */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-px left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-32 rounded-t-2xl bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.20),transparent_70%)]"
        />

        <div className="relative p-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-900/60 bg-emerald-950/40 px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" aria-hidden />
            unlocked
          </div>

          <h2
            id="purchase-modal-title"
            className="mt-5 text-3xl font-semibold tracking-tight leading-tight"
          >
            Thanks for backing this.
            <br />
            <span className="text-emerald-400">You&apos;ve got the full OS.</span>
          </h2>

          <p className="mt-4 text-zinc-300 leading-relaxed">
            With {packLabel}, you unlocked the full astack + tbrain source. The
            13-team org, the brain CLI, every skill, every template. Build your
            company, mate.
          </p>

          <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
            <p className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-2">
              Get repo access
            </p>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Email your GitHub username to{" "}
              <a
                href={`mailto:${FOUNDER_EMAIL}?subject=astack%20repo%20access&body=My%20GitHub%20username%20is%3A%20`}
                className="text-emerald-400 hover:text-emerald-300 font-mono"
              >
                {FOUNDER_EMAIL}
              </a>
              . You&apos;ll be added as a collaborator within 24 hours.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href={`mailto:${FOUNDER_EMAIL}?subject=astack%20repo%20access&body=My%20GitHub%20username%20is%3A%20`}
              className="rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 px-4 py-2.5 text-sm font-semibold transition"
            >
              Email my GitHub handle
            </a>
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-zinc-400 hover:text-zinc-200 transition"
            >
              View the repo (after access) ↗
            </a>
            <button
              type="button"
              onClick={close}
              className="ml-auto text-xs text-zinc-500 hover:text-zinc-300 transition"
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function prettyPackName(id: string) {
  // Normalize "agency-pack" → "the agency-pack". Leaves an empty string if id is junk.
  if (!id) return "your pack";
  return `the ${id}`;
}

import Link from "next/link";
import { getCurrentUser } from "@/lib/supabase/server";
import { getAllTeams } from "@/lib/teams";
import { getLivePacks, formatPrice, type Pack } from "@/lib/packs";

export const dynamic = "force-dynamic";

// Homepage. Pay-first model: no magic-link form on the homepage. Big "Buy a
// pack" CTAs. The magic link is only ever sent after a purchase — buyers
// arrive at /login post-Gumroad-redirect to enter the email they want their
// access link sent to.
//
// Signed-in users still see this page (no auto-redirect to /app) — they get
// an extra "Open the workspace →" CTA so they can choose to enter when they
// want, instead of being teleported in on every visit.
export default async function MarketingHome() {
  const user = await getCurrentUser();
  const teams = getAllTeams();
  const totalSkills = teams.reduce(
    (sum, t) => sum + t.astackSkills.length + t.tbrainSkills.length,
    0,
  );
  const packs = getLivePacks();

  return (
    <div className="relative">
      {/* Soft conic gradient backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1100px] h-[700px] rounded-full bg-[radial-gradient(closest-side,rgba(16,185,129,0.18),rgba(34,211,238,0.06)_40%,transparent_70%)] blur-2xl" />
      </div>

      {/* HERO */}
      <section className="max-w-5xl mx-auto px-6 pt-24 pb-20">
        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/40 px-3 py-1 text-xs text-zinc-400 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" aria-hidden />
          v0.1 · paid early access
        </div>
        <h1 className="text-5xl sm:text-6xl font-semibold tracking-tight leading-[1.05] max-w-3xl">
          The agent workspace for{" "}
          <span className="text-emerald-400">shipping a company</span> by yourself.
        </h1>
        <p className="mt-6 text-lg text-zinc-400 leading-relaxed max-w-2xl">
          13 specialised AI teams wired into a persistent markdown brain. Each
          team owns its decisions, hands work off through files, and remembers
          what shipped — across every machine you sit at.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          {user ? (
            <Link
              href="/app"
              className="rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 px-5 py-3 text-sm font-semibold transition"
            >
              Open the workspace →
            </Link>
          ) : (
            <Link
              href="/packs"
              className="rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 px-5 py-3 text-sm font-semibold transition"
            >
              Buy a pack — get the full OS →
            </Link>
          )}
          <Link
            href={user ? "/packs" : "/login"}
            className="rounded-lg border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/50 text-zinc-200 px-5 py-3 text-sm font-medium transition"
          >
            {user ? "See the packs" : "Already bought? Sign in"}
          </Link>
        </div>

        <p className="mt-6 text-xs text-zinc-500 leading-relaxed max-w-md">
          One pack purchase unlocks the full astack + tbrain workspace, the
          manual, and collaborator access to the source repo. Magic link to
          your inbox the moment Gumroad confirms the sale.
        </p>

        <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-zinc-500 font-mono">
          <span>{teams.length} teams</span>
          <span className="text-zinc-700">·</span>
          <span>{totalSkills} skills</span>
          <span className="text-zinc-700">·</span>
          <span>1 brain</span>
          <span className="text-zinc-700">·</span>
          <span>0 abstractions you can&apos;t read</span>
        </div>
      </section>

      {/* PACKS — paid entry points, prominently above the fold context */}
      <section className="max-w-5xl mx-auto px-6 py-20 border-t border-zinc-900">
        <div className="flex items-end justify-between gap-6 flex-wrap mb-8">
          <div>
            <p className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-2">
              Packs available
            </p>
            <h2 className="text-3xl font-semibold tracking-tight">
              Pick your pack. Get the whole OS.
            </h2>
            <p className="mt-2 text-zinc-400 max-w-xl text-sm leading-relaxed">
              Every pack ships with the full astack + tbrain source plus team
              manifests tuned for your business shape. Buy once, lifetime.
            </p>
          </div>
          <Link
            href="/packs"
            className="text-sm text-emerald-400 hover:text-emerald-300 transition"
          >
            Compare all →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {packs.map((p) => (
            <HomePackCard key={p.id} pack={p} />
          ))}
        </div>
        <p className="mt-6 text-xs text-zinc-500 max-w-xl">
          UPI for India, cards everywhere else. Magic link arrives in your
          inbox the moment Gumroad confirms — one click and you&apos;re in.
        </p>
      </section>

      {/* WHAT IT IS */}
      <section className="max-w-5xl mx-auto px-6 py-20 border-t border-zinc-900">
        <p className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-6">What it is</p>
        <div className="grid gap-12 sm:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight mb-3">
              A virtual company in your terminal.
            </h2>
            <p className="text-zinc-400 leading-relaxed">
              Each of the 13 teams is a Claude Code session scoped to a single
              charter — Executive, Engineering, Design, Marketing, Sales — with
              a curated set of skills and brain pages it owns. You launch the
              team you need; it knows its job before you say a word.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold tracking-tight mb-3">
              A brain that survives the chat window.
            </h2>
            <p className="text-zinc-400 leading-relaxed">
              <span className="font-mono text-emerald-400">tbrain</span> is
              markdown plus Postgres plus pgvector. Every person, deal,
              decision and meeting your agents touch gets a page. Every team
              reads from the same source of truth. Nothing lives in scrollback.
            </p>
          </div>
        </div>
      </section>

      {/* THE 13 */}
      <section className="max-w-5xl mx-auto px-6 py-20 border-t border-zinc-900">
        <p className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-6">The 13 teams</p>
        <div className="grid gap-x-12 gap-y-3 sm:grid-cols-2 lg:grid-cols-3 text-sm">
          {teams.map((t) => (
            <div
              key={t.id}
              className="flex items-baseline gap-3 py-2 -mx-2 px-2"
            >
              <span className="font-mono text-xs text-zinc-600 w-6">
                {t.number}
              </span>
              <span className="text-zinc-300">{t.name}</span>
            </div>
          ))}
        </div>
        <p className="mt-6 text-xs text-zinc-500">
          Each team unlocks once you buy a pack. Magic link to your inbox; one
          click and you&apos;re in.
        </p>
      </section>

      {/* HOW IT'S USED */}
      <section className="max-w-5xl mx-auto px-6 py-20 border-t border-zinc-900">
        <div className="mb-8">
          <p className="text-xs font-mono uppercase tracking-wider text-zinc-500">
            What it looks like end-to-end
          </p>
          <p className="text-sm text-zinc-500 mt-2 max-w-2xl">
            Two illustrative walkthroughs of a single human running the whole
            company. Names and numbers are scaffolding to make the workflow
            concrete — not customer testimonials.
          </p>
        </div>
        <div className="space-y-16">
          <Story
            persona="Maya — solo founder, B2B dev tool"
            tagline="Shipped v0.3 of a code-review SaaS in 19 days, working alone"
            chapters={[
              {
                day: "Day 1",
                team: "Executive (01)",
                action: "/office-hours",
                body: "Six forcing questions. The wedge tightened from 'AI code review' to 'PR-comment review for one-engineer GitHub repos.' Output landed at brain/plans/2026-04-09-mvp.md. The plan named the desperate-specificity user, ruled out 4 adjacent ideas, and set a 14-day shipping bar.",
              },
              {
                day: "Day 2",
                team: "Engineering (03)",
                action: "/plan-eng-review",
                body: "Architecture lock-in. Caught a structural bug: the original plan tried to run inference per-comment; the review forced a per-PR batched call. Result: 3x cost reduction before a line was written. Decision lives at brain/decisions/2026-04-10-batch-inference.md.",
              },
              {
                day: "Days 3 to 12",
                team: "Engineering + Design + QA",
                action: "build, /design-review, /qa, repeat",
                body: "Ten work-days. Three rounds of design review caught a generic-card-grid AI-slop pattern in the dashboard early. /qa walked the live site, filed 11 bugs, fixed 7 in the loop, deferred 4 to TODOS.md.",
              },
              {
                day: "Day 13",
                team: "Security (08)",
                action: "/cso",
                body: "Auth + GitHub-token storage audit. Two P1 findings — webhook secret in plain logs, OAuth redirect not allowlisting subdomains. Both fixed before /ship.",
              },
              {
                day: "Day 14",
                team: "Release (06)",
                action: "/ship → /land-and-deploy",
                body: "PR opened, CI green in 4 minutes, /canary watched the production dashboard for an hour, /document-release wrote brain/changelog/2026-04-22-v0.3.md. The first paid user signed up the next morning.",
              },
            ]}
            outcome="19 days from blank repo to paid v0.3. 47 brain pages written. Zero meetings, because there was nobody else."
          />

          <Story
            persona="Devraj — content-led indie hacker, newsletter + sponsorships"
            tagline="50K newsletter subscribers and 3 sponsor deals closed from one human"
            chapters={[
              {
                day: "Morning, every weekday",
                team: "Customer Success (11)",
                action: "daily-task-prep + briefing",
                body: "8:00 AM. brain/briefings/{today}.md compiles overnight signals, today's calendar, replies needed on yesterday's posts, and any deals at follow-up touch. Devraj reads it with coffee; flags two posts to ship and one sponsor reply to draft.",
              },
              {
                day: "Late morning",
                team: "Marketing (09)",
                action: "signal-detector + publish --draft",
                body: "signal-detector ran overnight on Hacker News, X, and a curated RSS list. Six fresh signals filed at brain/marketing/signals/{today}.md. Two become tweets, one becomes a newsletter section. Drafts land at brain/marketing/content/{today}.md. Devraj edits + sends.",
              },
              {
                day: "Afternoon",
                team: "Sales / BD (10)",
                action: "/enrich + brain-ops",
                body: "A potential sponsor replied. /enrich pulls every prior touchpoint from brain/people/{handle}.md, every meeting from brain/meetings/, every email transcript already filed. The full deal context fits on one page. Devraj writes the reply in 12 minutes. Deal page updated at brain/deals/2026-04-22-acme-newsletter.md.",
              },
              {
                day: "End of week",
                team: "Executive (01)",
                action: "/retro",
                body: "Friday afternoon. /retro reads the week's commits, posts that shipped, deals advanced, and writes brain/retros/wk-17.md. Surfaces one pattern Devraj missed: replies to a specific kind of comment converted at 3x. Next week's content plan adapts.",
              },
            ]}
            outcome="The audience is one human's; the work is 13 teams'. Newsletter went from 9K to 50K in 7 months. Three sponsor deals closed without a CRM, a Notion, or a cold-email tool — all of it lived in the brain."
          />
        </div>
      </section>

      {/* THE FOUR RULES */}
      <section className="max-w-5xl mx-auto px-6 py-20 border-t border-zinc-900">
        <p className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-6">
          The four rules every team follows
        </p>
        <div className="grid gap-8 sm:grid-cols-2">
          <Rule
            title="Markdown is source of truth."
            body="Decisions, plans, entity records live in files. Not in chat history, not in tickets."
          />
          <Rule
            title="Single writer per file."
            body="One team owns each brain page. Others read. If two teams need to write, split the page."
          />
          <Rule
            title="Append-only evidence trails."
            body="Editable summary at top, immutable timeline below. The compiled-truth pattern, baked into every brain page."
          />
          <Rule
            title="No fabricated facts."
            body="Every claim — engagement number, deal size, user feedback — links to a permalink."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6 py-24 border-t border-zinc-900">
        <div className="flex flex-col items-start gap-6">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight max-w-2xl leading-tight">
            One person, thirteen roles, one brain.
          </h2>
          <p className="text-zinc-400 max-w-xl">
            Buy any pack. Receive your magic link the moment Gumroad confirms.
            One click and you&apos;re inside the workspace, with the full
            astack + tbrain source unlocked.
          </p>
          <div className="flex flex-wrap gap-3 mt-2">
            {user ? (
              <>
                <Link
                  href="/app"
                  className="rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 px-5 py-3 text-sm font-semibold transition"
                >
                  Open the workspace →
                </Link>
                <Link
                  href="/packs"
                  className="rounded-lg border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/50 text-zinc-200 px-5 py-3 text-sm font-medium transition"
                >
                  See the packs
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/packs"
                  className="rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 px-5 py-3 text-sm font-semibold transition"
                >
                  See the packs →
                </Link>
                <Link
                  href="/login"
                  className="rounded-lg border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/50 text-zinc-200 px-5 py-3 text-sm font-medium transition"
                >
                  Already bought? Sign in
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function HomePackCard({ pack }: { pack: Pack }) {
  const isBundle = pack.tier === "bundle";
  return (
    <div
      className={`rounded-xl border p-5 flex flex-col ${
        isBundle
          ? "border-emerald-900/60 bg-emerald-950/30"
          : "border-zinc-800 bg-zinc-900/40"
      }`}
    >
      <div className="flex items-baseline justify-between mb-2">
        <p
          className={`text-[10px] font-mono uppercase tracking-wider ${
            isBundle ? "text-emerald-400" : "text-zinc-500"
          }`}
        >
          {isBundle ? "Bundle" : "Specialty"}
        </p>
        {pack.price && (
          <span className="text-xs font-mono text-zinc-400">
            {formatPrice(pack.price, "usd")}
          </span>
        )}
      </div>
      <h3 className="text-lg font-semibold tracking-tight text-zinc-100">
        {pack.name}
      </h3>
      <p className="mt-1.5 text-sm text-zinc-400 leading-relaxed line-clamp-3 flex-1">
        {pack.tagline}
      </p>
      <div className="mt-4 flex gap-2">
        <a
          href={`/buy/${pack.id}`}
          className="flex-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 px-3 py-2 text-sm font-semibold transition text-center"
        >
          Buy →
        </a>
        <Link
          href={`/packs/${pack.id}`}
          className="rounded-lg border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/50 text-zinc-300 px-3 py-2 text-sm transition"
        >
          Details
        </Link>
      </div>
    </div>
  );
}

function Rule({ title, body }: { title: string; body: string }) {
  return (
    <div className="border-l border-zinc-800 pl-5">
      <h3 className="text-base font-semibold tracking-tight text-zinc-100">{title}</h3>
      <p className="text-sm text-zinc-500 mt-2 leading-relaxed">{body}</p>
    </div>
  );
}

type StoryChapter = { day: string; team: string; action: string; body: string };

function Story({
  persona,
  tagline,
  chapters,
  outcome,
}: {
  persona: string;
  tagline: string;
  chapters: StoryChapter[];
  outcome: string;
}) {
  return (
    <article className="grid gap-10 lg:grid-cols-[1fr_2fr]">
      <header className="lg:sticky lg:top-24 lg:self-start">
        <p className="text-[11px] font-mono uppercase tracking-wider text-emerald-400/80">
          {persona}
        </p>
        <h3 className="text-2xl font-semibold tracking-tight text-zinc-100 mt-3 leading-snug">
          {tagline}
        </h3>
      </header>
      <div>
        <ol className="space-y-5 border-l border-zinc-800">
          {chapters.map((c, i) => (
            <li key={i} className="pl-6 -ml-px relative">
              <span
                className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-zinc-800 -translate-x-1/2 ring-4 ring-zinc-950"
                aria-hidden
              />
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">
                  {c.day}
                </span>
                <span className="text-xs text-zinc-600">·</span>
                <span className="text-xs font-mono text-emerald-400/80">{c.team}</span>
                <span className="text-xs text-zinc-600">·</span>
                <code className="text-xs font-mono text-zinc-300 bg-zinc-900/60 border border-zinc-800 px-1.5 py-0.5 rounded">
                  {c.action}
                </code>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed mt-2">{c.body}</p>
            </li>
          ))}
        </ol>
        <p className="mt-8 pl-6 -ml-px border-l-2 border-emerald-500/40 text-sm text-zinc-300 leading-relaxed italic">
          {outcome}
        </p>
      </div>
    </article>
  );
}

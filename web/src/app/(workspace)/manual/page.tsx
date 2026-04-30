import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";

export const dynamic = "force-dynamic";

// Renders MANUAL.md from the workspace root. The proxy already gates this
// route behind sign-in + paid cookie, so the manual is effectively a paid
// asset — moved out of the public GitHub now that the repo is private.
export default function ManualPage() {
  const root = process.env.ASTACK_ROOT
    ? process.env.ASTACK_ROOT
    : path.resolve(process.cwd(), "..");
  let html = "";
  let error: string | null = null;
  try {
    const md = fs.readFileSync(path.join(root, "MANUAL.md"), "utf-8");
    html = marked.parse(md, { async: false }) as string;
  } catch (err) {
    error = `Could not read MANUAL.md from ${root}. ${(err as Error).message}`;
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-2">
          The manual
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">
          astack + tbrain — user manual
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          The full user guide. Your unlock came with this — read top-to-bottom
          on a fresh install; jump to a section once you&apos;re running.
        </p>
      </header>
      {error ? (
        <div className="rounded-lg border border-amber-900/40 bg-amber-950/20 p-4 text-sm text-amber-200">
          {error}
        </div>
      ) : (
        <article
          className="manual-prose"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      )}
    </div>
  );
}

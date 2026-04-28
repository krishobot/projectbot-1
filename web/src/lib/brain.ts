import { execFileSync } from "node:child_process";

export type BrainStatus = {
  ok: boolean;
  pages: number;
  chunks: number;
  embedded: number;
  links: number;
  error?: string;
};

const isWindows = process.platform === "win32";
const GBRAIN_BIN = isWindows ? "gbrain.cmd" : "gbrain";

// Hosted environments (Vercel, etc) don't have the tbrain CLI on their PATH.
// Skip the exec entirely instead of spawning a process per render that's
// guaranteed to ENOENT. Detect via process.env.VERCEL or ASTACK_HOSTED=1.
const IS_HOSTED = !!(process.env.VERCEL || process.env.ASTACK_HOSTED === "1");

export function getBrainStatus(): BrainStatus {
  if (IS_HOSTED) {
    return {
      ok: false,
      pages: 0,
      chunks: 0,
      embedded: 0,
      links: 0,
      error: "tbrain CLI is local-only; the brain runs on your machine.",
    };
  }
  try {
    const out = execFileSync(GBRAIN_BIN, ["stats"], { encoding: "utf8", timeout: 5000 });
    const num = (re: RegExp) => {
      const m = out.match(re);
      return m ? parseInt(m[1], 10) : 0;
    };
    return {
      ok: true,
      pages: num(/Pages:\s+(\d+)/),
      chunks: num(/Chunks:\s+(\d+)/),
      embedded: num(/Embedded:\s+(\d+)/),
      links: num(/Links:\s+(\d+)/),
    };
  } catch (err) {
    return {
      ok: false,
      pages: 0,
      chunks: 0,
      embedded: 0,
      links: 0,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

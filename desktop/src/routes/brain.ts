import type { Ctx } from "../index";
import { execFileSync } from "node:child_process";

const isWindows = process.platform === "win32";

function runBrainStats(): string {
  // Try the astack-branded wrapper first, fall back to the underlying CLI.
  const candidates = isWindows ? ["tbrain.cmd", "gbrain.cmd"] : ["tbrain", "gbrain"];
  let lastErr: unknown;
  for (const bin of candidates) {
    try {
      return execFileSync(bin, ["stats"], { encoding: "utf8", timeout: 5000 });
    } catch (err) {
      lastErr = err;
    }
  }
  throw lastErr;
}

export async function handleBrainStats(_ctx: Ctx) {
  try {
    const out = runBrainStats();
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
      tags: num(/Tags:\s+(\d+)/),
      timeline: num(/Timeline:\s+(\d+)/),
    };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

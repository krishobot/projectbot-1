import type { Ctx } from "../index";
import { execFileSync } from "node:child_process";

const isWindows = process.platform === "win32";
const GBRAIN = isWindows ? "gbrain.cmd" : "gbrain";

export async function handleBrainStats(_ctx: Ctx) {
  try {
    const out = execFileSync(GBRAIN, ["stats"], { encoding: "utf8", timeout: 5000 });
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

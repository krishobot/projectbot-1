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

export function getBrainStatus(): BrainStatus {
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

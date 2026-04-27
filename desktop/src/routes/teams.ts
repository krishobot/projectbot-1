import type { Ctx } from "../index";
import fs from "node:fs";
import path from "node:path";

const TEAM_TITLE = /^# Team \d+ — (.+)$/m;
const CHARTER_LINE = /\*\*Charter:\*\* (.+?)(?=\n\n|\n##)/s;

export async function handleTeams(ctx: Ctx) {
  const teamsDir = path.join(ctx.astackRoot, "teams");
  if (!fs.existsSync(teamsDir)) return { ok: false, error: `teams dir not found: ${teamsDir}` };

  const files = fs
    .readdirSync(teamsDir)
    .filter((f) => /^\d+-[a-z-]+\.md$/.test(f))
    .sort();

  const teams = files.map((f) => {
    const raw = fs.readFileSync(path.join(teamsDir, f), "utf8");
    const id = f.match(/^\d+-([a-z-]+)\.md$/)?.[1] ?? f;
    const number = f.match(/^(\d+)-/)?.[1] ?? "";
    const name = raw.match(TEAM_TITLE)?.[1]?.trim() ?? id;
    const charter = raw.match(CHARTER_LINE)?.[1]?.trim() ?? "";
    return { id, number, name, charter };
  });

  return { ok: true, teams };
}

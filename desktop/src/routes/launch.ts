import type { Ctx } from "../index";
import { spawn } from "node:child_process";
import path from "node:path";
import fs from "node:fs";

type LaunchInput = {
  teamId: string;
  client?: "claude" | "antigravity"; // default claude
};

const isWindows = process.platform === "win32";
const isMac = process.platform === "darwin";

export async function handleLaunch(ctx: Ctx, input: LaunchInput) {
  if (!input?.teamId) return { ok: false, error: "teamId required" };

  // Resolve the team file to validate the request and seed the system prompt.
  const teamsDir = path.join(ctx.astackRoot, "teams");
  const files = fs.readdirSync(teamsDir);
  const file = files.find((f) => f.endsWith(`-${input.teamId}.md`));
  if (!file) return { ok: false, error: `unknown team: ${input.teamId}` };

  const teamFile = path.join(teamsDir, file);
  const teamName = (fs.readFileSync(teamFile, "utf8").match(/^# Team \d+ — (.+)$/m)?.[1] ?? input.teamId).trim();
  const client = input.client ?? "claude";

  // Build the command to run inside the new terminal. Strategy: cd into astack
  // root, then spawn the agent CLI with the team manifest pre-loaded as
  // append-system-prompt context.
  const cmd = client === "antigravity" ? "antigravity" : "claude";
  const args = ["--append-system-prompt-file", teamFile];

  try {
    if (isWindows) {
      // Windows Terminal: open a new tab with title=teamName, cwd=astackRoot, run claude
      spawn(
        "wt.exe",
        [
          "new-tab",
          "--title",
          teamName,
          "-d",
          ctx.astackRoot,
          "cmd",
          "/k",
          [cmd, ...args].join(" "),
        ],
        { detached: true, stdio: "ignore" }
      ).unref();
    } else if (isMac) {
      // macOS: AppleScript to open a new Terminal.app tab with the command
      const script = `tell application "Terminal" to do script "cd ${shQ(ctx.astackRoot)} && ${cmd} ${args.map(shQ).join(" ")}"`;
      spawn("osascript", ["-e", script], { detached: true, stdio: "ignore" }).unref();
    } else {
      // Linux: try x-terminal-emulator first, fall back to gnome-terminal
      const term = process.env.TERMINAL ?? "x-terminal-emulator";
      spawn(term, ["--", cmd, ...args], {
        detached: true,
        stdio: "ignore",
        cwd: ctx.astackRoot,
      }).unref();
    }
    return { ok: true, teamId: input.teamId, teamName, client };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

function shQ(s: string): string {
  return `"${s.replace(/(["\\$`])/g, "\\$1")}"`;
}

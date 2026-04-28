"use server";

import { launchTeam } from "@/lib/desktop";

// Form actions in Next 16 must return void | Promise<void>. Errors surface
// via desktop daemon logs / next page render — not via the form return value.
//
// Production guard: launching a terminal is a local-only feature; the daemon
// at 127.0.0.1:7331 doesn't exist on Vercel. Short-circuit the action there.
export async function launchTeamAction(formData: FormData): Promise<void> {
  if (process.env.VERCEL || process.env.ASTACK_HOSTED === "1") return;
  const teamId = formData.get("teamId");
  const client = formData.get("client");
  if (typeof teamId !== "string") return;
  if (client !== "claude" && client !== "antigravity") return;
  await launchTeam(teamId, client);
}

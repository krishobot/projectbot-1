"use server";

import { launchTeam } from "@/lib/desktop";

// Form actions in Next 16 must return void | Promise<void>. Errors surface
// via desktop daemon logs / next page render — not via the form return value.
export async function launchTeamAction(formData: FormData): Promise<void> {
  const teamId = formData.get("teamId");
  const client = formData.get("client");
  if (typeof teamId !== "string") return;
  if (client !== "claude" && client !== "antigravity") return;
  await launchTeam(teamId, client);
}

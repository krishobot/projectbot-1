"use server";

import { launchTeam } from "@/lib/desktop";

export async function launchTeamAction(formData: FormData) {
  const teamId = formData.get("teamId");
  const client = formData.get("client");
  if (typeof teamId !== "string") return { ok: false, error: "teamId required" };
  if (client !== "claude" && client !== "antigravity") return { ok: false, error: "invalid client" };
  return await launchTeam(teamId, client);
}

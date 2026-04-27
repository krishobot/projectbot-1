"use server";

import { revalidatePath } from "next/cache";
import { autoWireMcp } from "@/lib/desktop";

export async function autoWireAction(formData: FormData) {
  const client = formData.get("client");
  if (client !== "claude-desktop" && client !== "claude-code") {
    return { ok: false, error: "invalid client" };
  }
  const result = await autoWireMcp(client);
  revalidatePath("/setup/mcp");
  return result;
}

"use server";

import { revalidatePath } from "next/cache";
import { autoWireMcp } from "@/lib/desktop";

// Form actions in Next 16 must return void | Promise<void>. The status badge
// re-renders from revalidatePath, so the result object isn't read here.
export async function autoWireAction(formData: FormData): Promise<void> {
  const client = formData.get("client");
  if (client !== "claude-desktop" && client !== "claude-code") return;
  await autoWireMcp(client);
  revalidatePath("/setup/mcp");
}

"use server";

import { revalidatePath } from "next/cache";
import { autoWireMcp } from "@/lib/desktop";

// Form actions in Next 16 must return void | Promise<void>. The status badge
// re-renders from revalidatePath, so the result object isn't read here.
//
// Production guard: on Vercel (or any hosted environment that isn't the
// local astack workspace), the desktop daemon doesn't exist. Auto-wire is a
// local-only feature — no point letting public POSTs hit this handler at
// all. Detect the hosted environment via process.env.VERCEL and short-circuit.
export async function autoWireAction(formData: FormData): Promise<void> {
  if (process.env.VERCEL || process.env.ASTACK_HOSTED === "1") return;
  const client = formData.get("client");
  if (client !== "claude-desktop" && client !== "claude-code") return;
  await autoWireMcp(client);
  revalidatePath("/setup/mcp");
}

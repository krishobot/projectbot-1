import { getSupabaseAdmin } from "./supabase/admin";

/**
 * Returns true if the email has any purchase row in the `purchases` table.
 * Used by the proxy to gate /app, /teams, /manual behind paid status that
 * persists across devices and cookie clears.
 *
 * Returns false if Supabase admin isn't configured (single-user local mode
 * or before SUPABASE_SERVICE_ROLE_KEY is set on Vercel) — callers should
 * combine this with the cookie check, so a missing DB doesn't lock anyone
 * out who already paid before the table existed.
 */
export async function hasPurchase(email: string): Promise<boolean> {
  if (!email) return false;
  const admin = await getSupabaseAdmin();
  if (!admin) return false;
  const { data, error } = await admin
    .from("purchases")
    .select("id")
    .ilike("email", email)
    .limit(1);
  if (error) {
    console.warn("[purchases] hasPurchase query failed:", error.message);
    return false;
  }
  return (data?.length ?? 0) > 0;
}

/**
 * Maps a Gumroad permalink (the `/l/<permalink>` slug) to the local pack id.
 * Used by the webhook handler to record sales against canonical pack ids.
 */
export function packIdFromPermalink(permalink: string): string {
  const map: Record<string, string> = {
    agencypack: "agency-pack",
    Technicalfounderpack: "technical-founder-pack",
    Specialtypack: "specialty-bundle",
  };
  return map[permalink] ?? permalink.toLowerCase();
}

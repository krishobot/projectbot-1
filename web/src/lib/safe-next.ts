/**
 * Validate a `?next=` redirect target. Only same-origin relative paths are
 * accepted; absolute URLs (`https://evil.com`) and protocol-relative URLs
 * (`//evil.com`) fall back to "/" to prevent open-redirect phishing through
 * the OAuth/magic-link callback.
 */
export function safeNext(raw: string | null | undefined): string {
  if (!raw) return "/";
  if (!raw.startsWith("/")) return "/";
  if (raw.startsWith("//")) return "/";
  if (raw.startsWith("/\\")) return "/";
  return raw;
}

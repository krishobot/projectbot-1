import type { NextConfig } from "next";

const securityHeaders = [
  // Stops the page from being framed (clickjacking defense). DENY > SAMEORIGIN
  // here because nothing on this site embeds itself.
  { key: "X-Frame-Options", value: "DENY" },
  // Stops MIME-sniffing.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Don't leak the full referrer to outbound links (Gumroad, GitHub, etc).
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Modern alternative to X-Frame-Options + restrict the few APIs that
  // could leak something useful in the future. We don't use camera/mic/etc;
  // explicitly deny.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  // Force HTTPS at the browser level once a user has visited via HTTPS once.
  // Vercel terminates TLS at the edge, so this is safe + improves trust.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Apply to all routes.
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;

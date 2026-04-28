import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "astack — the agent workspace for shipping a company by yourself",
  description:
    "13 specialised AI teams wired into a persistent markdown brain. Open source, MIT.",
};

// Root layout is intentionally chrome-free. Marketing routes get a marketing
// shell via (marketing)/layout.tsx; workspace routes get a sidebar via
// (workspace)/layout.tsx. This split lets / read as a product page and /app
// read as a workspace, instead of the homepage trying to be both.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark h-full antialiased ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-zinc-950 text-zinc-100 min-h-full flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}

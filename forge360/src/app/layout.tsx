import type { Metadata, Viewport } from "next";
import { getViewer } from "@/lib/session";
import { siteUrl } from "@/lib/supabase/env";
import { SITE } from "@/lib/site";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
// Brand fonts are bundled from npm so builds never depend on downloading from Google.
import "@fontsource/league-spartan/600.css";
import "@fontsource/league-spartan/700.css";
import "@fontsource/league-spartan/800.css";
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/600.css";
import "@fontsource/montserrat/700.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "./globals.css";

// Every page reads the session cookie (header nav), so nothing is prerendered.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${SITE.name} — ${SITE.tagline}`, template: `%s · ${SITE.name}` },
  description: SITE.description,
  openGraph: { siteName: SITE.name, type: "website" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#1e3a8a" };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const viewer = await getViewer();
  return (
    <html lang="en">
      <body className="flex min-h-dvh flex-col font-sans antialiased">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-navy focus:px-4 focus:py-2 focus:text-white">
          Skip to content
        </a>
        <SiteHeader viewer={viewer} />
        <main id="main" className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}

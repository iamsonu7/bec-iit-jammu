import type { Metadata, Viewport } from "next";
import { Inter, League_Spartan, Montserrat } from "next/font/google";
import { getViewer } from "@/lib/session";
import { siteUrl } from "@/lib/supabase/env";
import { SITE } from "@/lib/site";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

const display = League_Spartan({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-league-spartan" });
const sub = Montserrat({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-montserrat" });
const body = Inter({ subsets: ["latin"], variable: "--font-inter" });

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
    <html lang="en" className={`${display.variable} ${sub.variable} ${body.variable}`}>
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

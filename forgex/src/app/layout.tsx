import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { getViewer } from "@/lib/session";
import { siteUrl } from "@/lib/supabase/env";
import "./globals.css";

// Every page reads the session cookie (header nav), so nothing is prerendered.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "ForgeX — You have a skill. Someone has an idea.", template: "%s · ForgeX" },
  description:
    "ForgeX by BEC connects any student with any skill to any idea, and proves the skill in one hour. Stop learning skills for nothing. Put them on a real idea.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#fbf8f3" };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const viewer = await getViewer();
  return (
    <html lang="en">
      <body className="flex min-h-dvh flex-col font-sans antialiased">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-white">
          Skip to content
        </a>
        <header className="border-b border-line bg-paper/90 backdrop-blur">
          <nav className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
            <Link href="/" className="flex items-baseline gap-1.5 text-lg font-bold tracking-tight">
              <span>Forge<span className="text-ember">X</span></span>
              <span className="text-xs font-medium text-muted">by BEC</span>
            </Link>
            <div className="flex items-center gap-1 text-sm sm:gap-3">
              {viewer ? (
                <>
                  <Link href="/ideas" className="rounded-full px-3 py-2 hover:bg-ember-soft">Ideas</Link>
                  <Link href="/dashboard" className="rounded-full px-3 py-2 hover:bg-ember-soft">Dashboard</Link>
                  <form action="/auth/signout" method="post">
                    <button className="rounded-full px-3 py-2 text-muted hover:text-ink">Sign out</button>
                  </form>
                </>
              ) : (
                <>
                  <Link href="/demo" className="hidden rounded-full px-3 py-2 hover:bg-ember-soft sm:inline">How it works</Link>
                  <Link href="/start" className="btn-primary !px-4 !py-2">Get started</Link>
                </>
              )}
            </div>
          </nav>
        </header>
        <main id="main" className="flex-1">{children}</main>
        <footer className="border-t border-line py-8 text-sm text-muted">
          <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 sm:flex-row sm:justify-between">
            <p>ForgeX · Budding Entrepreneurs Club, IIT Jammu</p>
            <p>Ideas shouldn&apos;t have boundaries of disciplines.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}

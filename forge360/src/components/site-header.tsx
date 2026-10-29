import Link from "next/link";
import { Logo } from "./brand";
import type { Viewer } from "@/lib/session";

const PUBLIC_NAV = [
  { href: "/#how", label: "How it works" },
  { href: "/#trust", label: "Trust" },
  { href: "/demo", label: "Sample card" },
  { href: "/#faq", label: "FAQ" },
];

export function SiteHeader({ viewer }: { viewer: Viewer | null }) {
  const nav = viewer
    ? [
        { href: "/ideas", label: "Ideas" },
        { href: "/dashboard", label: "Dashboard" },
        ...(viewer.handle && viewer.roles.includes("student") ? [{ href: `/card/${viewer.handle}`, label: "My card" }] : []),
      ]
    : PUBLIC_NAV;

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-white/85 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6" aria-label="Main">
        <Link href="/" aria-label="Forge 360 home">
          <Logo />
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {nav.map((n) => (
            <li key={n.href}>
              <Link href={n.href} className="rounded-md px-3 py-2 font-sub text-sm font-semibold text-ink-soft transition hover:bg-sky-soft hover:text-navy">
                {n.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          {viewer ? (
            <form action="/auth/signout" method="post" className="hidden md:block">
              <button className="btn-ghost !px-4 !py-2">Sign out</button>
            </form>
          ) : (
            <>
              <Link href="/start" className="hidden font-sub text-sm font-semibold text-navy hover:underline md:inline">Log in</Link>
              <Link href="/start" className="btn-primary !px-4 !py-2.5">Get started</Link>
            </>
          )}

          {/* Mobile menu: plain <details>, works without JavaScript. */}
          <details className="group relative md:hidden">
            <summary className="flex size-10 cursor-pointer list-none items-center justify-center rounded-lg border border-line text-navy [&::-webkit-details-marker]:hidden" aria-label="Menu">
              <svg viewBox="0 0 24 24" className="size-5 group-open:hidden" aria-hidden><path d="M4 7h16M4 12h16M4 17h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
              <svg viewBox="0 0 24 24" className="hidden size-5 group-open:block" aria-hidden><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            </summary>
            <div className="absolute right-0 top-12 w-60 overflow-hidden rounded-xl border border-line bg-white p-2 shadow-(--shadow-lift)">
              {nav.map((n) => (
                <Link key={n.href} href={n.href} className="block rounded-lg px-3 py-2.5 font-sub text-sm font-semibold text-ink-soft hover:bg-sky-soft hover:text-navy">
                  {n.label}
                </Link>
              ))}
              {viewer && (
                <form action="/auth/signout" method="post" className="border-t border-line pt-2">
                  <button className="block w-full rounded-lg px-3 py-2.5 text-left font-sub text-sm font-semibold text-muted hover:bg-paper">Sign out</button>
                </form>
              )}
            </div>
          </details>
        </div>
      </nav>
    </header>
  );
}

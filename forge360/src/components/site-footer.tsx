import Link from "next/link";
import { Logo } from "./brand";
import { SITE } from "@/lib/site";

const COLS = [
  { title: "Product", links: [{ href: "/#how", label: "How it works" }, { href: "/demo", label: "Sample Skill Card" }, { href: "/#trust", label: "Trust tiers" }] },
  { title: "Get started", links: [{ href: "/start?role=student", label: "I have a skill" }, { href: "/start?role=founder", label: "I have an idea" }, { href: "/start", label: "Log in" }] },
  { title: "Legal", links: [{ href: "/privacy", label: "Privacy" }, { href: "/terms", label: "Terms" }] },
];

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-charcoal text-white/70">
      <div className="dots pointer-events-none absolute -right-10 top-10 h-40 w-64 text-sky/20" aria-hidden />
      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <Logo dark />
          <p className="mt-4 max-w-xs text-sm leading-relaxed">{SITE.agenda}</p>
          {SITE.contactEmail && (
            <a href={`mailto:${SITE.contactEmail}`} className="mt-4 inline-block text-sm font-medium text-sky hover:underline">{SITE.contactEmail}</a>
          )}
        </div>
        {COLS.map((c) => (
          <div key={c.title}>
            <p className="font-sub text-xs font-semibold uppercase tracking-[0.16em] text-white">{c.title}</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {c.links.map((l) => (
                <li key={l.href}><Link href={l.href} className="transition hover:text-sky">{l.label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-xs sm:flex-row sm:justify-between sm:px-6">
          <p>© {new Date().getFullYear()} Forge 360</p>
          <p>Ideas shouldn&apos;t have boundaries of disciplines.</p>
        </div>
      </div>
    </footer>
  );
}

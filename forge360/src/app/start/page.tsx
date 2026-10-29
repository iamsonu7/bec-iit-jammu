import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getViewer, homeFor, safeNext } from "@/lib/session";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { LogoMark, Trail } from "@/components/brand";
import { LayerLink } from "./layer-link";

export const metadata: Metadata = { title: "Get started" };

type Search = Promise<{ role?: string; next?: string; error?: string }>;

export default async function StartPage({ searchParams }: { searchParams: Search }) {
  const { role, next, error } = await searchParams;
  const wanted = role === "founder" || role === "student" ? role : undefined;
  const nextPath = safeNext(next);

  const viewer = await getViewer();
  if (viewer) {
    const home = homeFor(viewer, wanted);
    redirect(home === "/dashboard" && nextPath ? nextPath : home);
  }

  return (
    <div className="grid min-h-[calc(100dvh-4rem)] lg:grid-cols-[1fr_1.1fr]">
      {/* Brand panel */}
      <aside className="relative isolate hidden overflow-hidden bg-navy-900 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(90%_60%_at_100%_0%,#2a56c6_0%,transparent_60%),linear-gradient(170deg,#1e3a8a,#0d1b4b_60%,#111829)]" />
        <div className="absolute -bottom-10 right-0 -z-10 h-1/2 w-3/4 bg-gradient-to-tl from-sky/35 to-transparent [clip-path:polygon(40%_0,100%_0,100%_100%,0_100%)]" />
        <Trail className="absolute -left-56 -top-56 -z-10 size-[600px] rotate-180 text-sky" />
        <LogoMark className="size-12" dark />
        <div>
          <p className="font-display text-[2.75rem] font-bold leading-[1.02]">One door.<br />Both sides of every idea.</p>
          <ul className="mt-8 space-y-3 text-white/80">
            {["No passwords — Google or a one-time email link", "Your college email links your institute automatically", "Your email stays hidden until you accept a match"].map((t) => (
              <li key={t} className="flex gap-3">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-sky" />
                {t}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-sm text-white/50">New here or coming back — it&apos;s the same flow.</p>
      </aside>

      {/* Form */}
      <div className="flex items-start justify-center px-4 py-12 sm:py-16 lg:items-center">
        <div className="w-full max-w-md">
          <p className="eyebrow">Get started</p>
          <h1 className="mt-2 text-4xl font-bold text-charcoal">Welcome to Forge 360</h1>
          <p className="mt-2 text-ink-soft">Tell us why you&apos;re here, then sign in. Takes ten seconds.</p>
          {error && (
            <p role="alert" className="alert mt-6">That sign-in link didn&apos;t work or has expired. Try again.</p>
          )}
          {isSupabaseConfigured ? (
            <LayerLink initialRole={wanted} next={nextPath} />
          ) : (
            <p className="notice mt-8">
              Sign-in isn&apos;t switched on yet. Add <code className="font-semibold">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
              <code className="font-semibold">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to <code>.env.local</code> — see the README.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

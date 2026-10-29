import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getViewer, homeFor, safeNext } from "@/lib/session";
import { isSupabaseConfigured } from "@/lib/supabase/env";
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
    <div className="mx-auto max-w-md px-4 py-12 sm:py-20">
      <h1 className="text-3xl font-bold tracking-tight">Layer Link</h1>
      <p className="mt-2 text-ink-soft">One door for everyone. New here or coming back, it&apos;s the same flow.</p>
      {error && (
        <p role="alert" className="mt-6 rounded-xl bg-ember-soft px-4 py-3 text-sm text-ember-dark">
          That sign-in link didn&apos;t work or has expired. Try again.
        </p>
      )}
      {isSupabaseConfigured ? (
        <LayerLink initialRole={wanted} next={nextPath} />
      ) : (
        <p className="panel mt-8 text-sm text-ink-soft">
          Sign-in isn&apos;t configured yet. Set <code>NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
          <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in <code>.env.local</code> (see the README).
        </p>
      )}
    </div>
  );
}

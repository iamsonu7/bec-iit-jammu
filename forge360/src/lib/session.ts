import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";
import { isSupabaseConfigured } from "./supabase/env";
import type { Role } from "./types";

export type Viewer = {
  id: string;
  email: string;
  name: string | null;
  handle: string | null;
  headline: string | null;
  consented: boolean;
  roles: Role[];
};

/** The signed-in user with their Forge 360 row and roles, or null. */
export async function getViewer(): Promise<Viewer | null> {
  if (!isSupabaseConfigured) return null;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [{ data: row }, { data: roles }] = await Promise.all([
    supabase.from("users").select("email, name, handle, headline, consent_at").eq("id", user.id).single(),
    supabase.from("roles").select("role").eq("user_id", user.id),
  ]);

  return {
    id: user.id,
    email: row?.email ?? user.email ?? "",
    name: row?.name ?? null,
    handle: row?.handle ?? null,
    headline: row?.headline ?? null,
    consented: Boolean(row?.consent_at),
    roles: (roles ?? []).map((r) => r.role as Role),
  };
}

export async function requireViewer(next = "/dashboard"): Promise<Viewer> {
  const viewer = await getViewer();
  if (!viewer) redirect(`/start?next=${encodeURIComponent(next)}`);
  return viewer;
}

/** Where a signed-in user should land: the one smart flow behind Layer Link. */
export function homeFor(viewer: Viewer, wanted?: "student" | "founder"): string {
  const role = wanted ?? (viewer.roles.includes("founder") && !viewer.roles.includes("student") ? "founder" : "student");
  if (!viewer.consented || !viewer.handle || viewer.roles.length === 0) return `/onboarding/${role}`;
  if (wanted && !viewer.roles.includes(wanted)) return `/onboarding/${wanted}`;
  return "/dashboard";
}

/** Only same-site relative paths; blocks `//evil.com` style open redirects. */
export function safeNext(next?: string | null): string | undefined {
  return next && next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/\\") ? next : undefined;
}

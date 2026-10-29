import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getViewer, homeFor, safeNext } from "@/lib/session";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const role = searchParams.get("role");
  const next = safeNext(searchParams.get("next"));

  if (!code) return NextResponse.redirect(`${origin}/start?error=missing_code`);

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) return NextResponse.redirect(`${origin}/start?error=exchange_failed`);

  const viewer = await getViewer();
  if (!viewer) return NextResponse.redirect(`${origin}/start?error=no_user`);

  const wanted = role === "founder" || role === "student" ? role : undefined;
  const dest = homeFor(viewer, wanted);
  // An onboarded user who was heading somewhere specific goes there instead.
  const target = dest === "/dashboard" && next ? next : dest;
  return NextResponse.redirect(`${origin}${target}`);
}

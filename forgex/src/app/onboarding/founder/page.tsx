import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { requireViewer } from "@/lib/session";
import { loadVault } from "@/lib/vault";
import { FounderForm } from "./form";

export const metadata: Metadata = { title: "Post an idea" };

export default async function FounderOnboarding() {
  const viewer = await requireViewer("/onboarding/founder");
  const supabase = await createClient();
  const [vault, { data: profile }] = await Promise.all([
    loadVault(supabase),
    supabase.from("profiles").select("discipline, year, city").eq("user_id", viewer.id).single(),
  ]);
  const basicsDone = viewer.consented && Boolean(viewer.handle) && Boolean(profile?.discipline);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-bold tracking-tight">Post an idea</h1>
      <p className="mb-8 mt-1 text-ink-soft">
        Say what you&apos;re building and which skills it needs. Students see the skills first, not who you are.
      </p>
      <FounderForm
        skills={vault.map(({ id, name, category }) => ({ id, name, category }))}
        basicsDone={basicsDone}
        initial={{
          name: viewer.name ?? "",
          handle: viewer.handle ?? viewer.email.split("@")[0].toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 24),
          headline: viewer.headline ?? "",
          discipline: profile?.discipline ?? "",
          year: profile?.year ?? "",
          city: profile?.city ?? "",
          consent: viewer.consented,
        }}
      />
    </div>
  );
}

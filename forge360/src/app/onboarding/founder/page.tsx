import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { requireViewer } from "@/lib/session";
import { loadVault } from "@/lib/vault";
import { FounderForm } from "./form";
import { PageHeader } from "@/components/page-header";

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
    <>
    <PageHeader eyebrow="For founders" title="Post an idea">
      Say what you&apos;re building and which skills it needs. Students see the skills first, not who you are.
    </PageHeader>
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="panel !p-6 sm:!p-8">
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
    </div>
    </>
  );
}

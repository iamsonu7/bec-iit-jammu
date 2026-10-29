import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { loadCard } from "@/lib/card";
import { getViewer } from "@/lib/session";
import { siteUrl } from "@/lib/supabase/env";
import { SkillCardView } from "@/components/skill-card";
import { PrintButton } from "@/components/print-button";
import { ShareButton } from "@/components/share-button";

type Params = Promise<{ handle: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { handle } = await params;
  const data = await loadCard(handle);
  if (!data) return { title: "Skill Card not found" };
  const name = data.card.name ?? handle;
  const skills = data.skills.map((s) => s.skills.name).slice(0, 4).join(", ");
  return {
    title: `${name} — Skill Card`,
    description: data.card.headline ?? `${name} can ship: ${skills}.`,
    alternates: { canonical: `/card/${handle}` },
  };
}

export default async function CardPage({ params, searchParams }: { params: Params; searchParams: Promise<{ new?: string }> }) {
  const { handle } = await params;
  const { new: isNew } = await searchParams;
  const [data, viewer] = await Promise.all([loadCard(handle), getViewer()]);
  if (!data) notFound();
  const own = viewer?.id === data.card.user_id;
  const url = `${siteUrl}/card/${handle}`;

  return (
    <div className="relative isolate">
      <div className="absolute inset-x-0 top-0 -z-10 h-72 bg-gradient-to-b from-sky-soft to-transparent" />
      <div className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
      {own && isNew && (
        <div className="no-print notice mb-6">
          Your Skill Card is live. Share it, then <Link href="/ideas" className="font-semibold underline">browse ideas that need you</Link>.
        </div>
      )}
      <SkillCardView data={data} />
      <div className="no-print mt-6 flex flex-wrap gap-3">
        <ShareButton url={url} text={`My Forge 360 Skill Card — what I can ship in one hour.`} />
        <PrintButton />
        {own && <Link href="/onboarding/student" className="btn-ghost">Edit card</Link>}
      </div>
      </div>
    </div>
  );
}

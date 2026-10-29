import { PageHeader } from "./page-header";
import { SITE } from "@/lib/site";

export function LegalPage({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <>
      <PageHeader eyebrow="Legal" title={title}>Last updated {updated}</PageHeader>
      <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6 [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-charcoal [&_li]:mt-2 [&_p]:mt-4 [&_p]:leading-relaxed [&_p]:text-ink-soft [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:text-ink-soft">
        <p className="notice !mt-0 !text-navy">
          This is a plain-language starting draft. Have it reviewed by a lawyer before launch — many users will be under 21.
        </p>
        {children}
        {SITE.contactEmail && (
          <p>
            Questions: <a href={`mailto:${SITE.contactEmail}`} className="font-medium text-navy underline">{SITE.contactEmail}</a>
          </p>
        )}
      </article>
    </>
  );
}

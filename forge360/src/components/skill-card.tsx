import { TierBadge } from "./tier-badge";
import { evidenceLinks, summariseAnswers, type CardData } from "@/lib/card";

const AVAILABILITY = { now: "Available now", soon: "Available in a few weeks", busy: "Just browsing" } as const;

function hostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

/** The R-Resume: readable in 10 seconds, no GPA, no college name. */
export function SkillCardView({ data }: { data: CardData }) {
  const { card, skills } = data;
  const comp = card.comp_pref.map((c) => c[0].toUpperCase() + c.slice(1)).join(" or ");

  return (
    <article className="overflow-hidden rounded-2xl border border-line bg-white shadow-(--shadow-lift)">
      <header className="relative isolate overflow-hidden bg-gradient-to-br from-navy to-navy-900 px-6 py-7 text-white sm:px-8">
        <div className="absolute inset-y-0 right-0 -z-10 w-2/5 bg-gradient-to-bl from-sky/50 to-sky/10 [clip-path:polygon(42%_0,100%_0,100%_100%,0_100%)]" />
        <div className="dots absolute bottom-4 right-6 -z-10 h-10 w-20 text-white/25" aria-hidden />
        <div className="flex items-center justify-between gap-4">
          <p className="font-sub text-[11px] font-semibold uppercase tracking-[0.2em] text-sky">Skill Card</p>
          <p className="font-display text-sm font-bold text-white/70">FORGE<span className="text-sky">360</span></p>
        </div>
        <h1 className="mt-3 text-3xl font-bold leading-none sm:text-4xl">{card.name ?? card.handle}</h1>
        <p className="mt-1.5 font-sub text-sm text-white/60">@{card.handle}</p>
        {card.headline && <p className="mt-4 max-w-md text-lg leading-snug text-white/90">&ldquo;{card.headline}&rdquo;</p>}
      </header>

      <section className="px-6 py-6 sm:px-8" aria-labelledby="skills-h">
        <h2 id="skills-h" className="eyebrow">Skills · {skills.length}</h2>
        {skills.length === 0 && <p className="mt-3 text-sm text-muted">No skills added yet.</p>}
        <ul className="mt-4 divide-y divide-line">
          {skills.map((s) => {
            const { tools, oneHour, delivered } = summariseAnswers(s.answers_json);
            const links = evidenceLinks(s);
            return (
              <li key={s.id} className="py-4 first:pt-0 last:pb-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-sans text-lg font-semibold text-charcoal">{s.skills.name}</h3>
                  <TierBadge tier={s.tier} />
                </div>
                <p className="mt-1.5 text-sm text-ink-soft">
                  <span className="mr-1 rounded bg-sky-soft px-1.5 py-0.5 font-sub text-[10px] font-bold uppercase tracking-wider text-navy">1 hr</span> {s.skills.one_hour_test}
                  {oneHour && <span className="text-muted"> — {oneHour === "Yes" ? "can do" : oneHour === "With help" ? "with help" : "not yet"}</span>}
                </p>
                {(tools.length > 0 || delivered === "Yes") && (
                  <p className="mt-1 text-sm text-ink-soft">
                    {tools.length > 0 && <>Tools: {tools.join(", ")}</>}
                    {tools.length > 0 && delivered === "Yes" && " · "}
                    {delivered === "Yes" && "Delivered for a real client or event"}
                  </p>
                )}
                {links.length > 0 && (
                  <p className="mt-1 text-sm">
                    <span className="text-muted">Evidence: </span>
                    {links.map((l, i) => (
                      <span key={l}>
                        {i > 0 && " · "}
                        <a href={l} target="_blank" rel="noopener noreferrer nofollow" className="font-medium text-navy underline decoration-sky decoration-2 underline-offset-2 hover:decoration-navy">
                          {hostname(l)}
                        </a>
                      </span>
                    ))}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      <footer className="grid gap-1.5 border-t border-line bg-paper px-6 py-5 text-sm text-ink-soft sm:px-8">
        <p>
          <span className="font-medium text-ink">Availability:</span>{" "}
          {card.availability ? AVAILABILITY[card.availability] : "—"}
          {card.hours_per_week ? ` · ${card.hours_per_week} hrs/week` : ""}
          {comp && ` · ${comp}`}
        </p>
        {card.wants_fields.length > 0 && (
          <p><span className="font-medium text-ink">Wants to work on:</span> {card.wants_fields.join(", ")}</p>
        )}
        {card.bio && <p className="mt-2">{card.bio}</p>}
        <p className="mt-1 flex items-center gap-2 text-muted">
          <svg viewBox="0 0 20 20" className="size-4 text-navy" aria-hidden><path d="M6 9V7a4 4 0 1 1 8 0v2m-9 0h10v8H5z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /></svg>
          Institute revealed after a match
        </p>
      </footer>
    </article>
  );
}

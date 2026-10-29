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

/** The R-Resume (§8): readable in 10 seconds, no GPA, no college name. */
export function SkillCardView({ data }: { data: CardData }) {
  const { card, skills } = data;
  const comp = card.comp_pref.map((c) => c[0].toUpperCase() + c.slice(1)).join(" or ");

  return (
    <article className="panel !p-0 overflow-hidden">
      <header className="border-b border-line bg-ink px-6 py-6 text-white sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/60">Skill Card · ForgeX</p>
        <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
          {card.name ?? card.handle} <span className="text-base font-normal text-white/60">@{card.handle}</span>
        </h1>
        {card.headline && <p className="mt-2 text-white/85">&ldquo;{card.headline}&rdquo;</p>}
      </header>

      <section className="px-6 py-6 sm:px-8" aria-labelledby="skills-h">
        <h2 id="skills-h" className="text-xs font-semibold uppercase tracking-widest text-muted">Skills</h2>
        {skills.length === 0 && <p className="mt-3 text-sm text-muted">No skills added yet.</p>}
        <ul className="mt-4 divide-y divide-line">
          {skills.map((s) => {
            const { tools, oneHour, delivered } = summariseAnswers(s.answers_json);
            const links = evidenceLinks(s);
            return (
              <li key={s.id} className="py-4 first:pt-0 last:pb-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold">{s.skills.name}</h3>
                  <TierBadge tier={s.tier} />
                </div>
                <p className="mt-1.5 text-sm text-ink-soft">
                  <span className="font-medium text-ink">1-hr test:</span> {s.skills.one_hour_test}
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
                        <a href={l} target="_blank" rel="noopener noreferrer nofollow" className="text-tier-t1 underline-offset-2 hover:underline">
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

      <footer className="grid gap-1 border-t border-line bg-paper px-6 py-5 text-sm text-ink-soft sm:px-8">
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
        <p className="text-muted"><span className="font-medium text-ink">Institute:</span> revealed after a match</p>
      </footer>
    </article>
  );
}

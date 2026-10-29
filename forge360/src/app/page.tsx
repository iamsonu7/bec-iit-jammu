import Link from "next/link";
import { SectionTitle, Trail } from "@/components/brand";
import { TierBadge } from "@/components/tier-badge";
import { Journeys } from "@/components/landing/journeys";
import { HeroVisual } from "@/components/landing/hero-visual";
import { SITE } from "@/lib/site";

const DISCIPLINES = [
  "Engineering", "Law", "Design", "Commerce", "Medicine", "Media", "Management",
  "Architecture", "Arts & Humanities", "Pharmacy", "Science", "Hospitality",
];

const TESTS = [
  { skill: "Legal drafting", field: "Law", test: "Draft a two-page founder–contributor agreement." },
  { skill: "Video editing", field: "Content", test: "Cut a 60-second reel from raw footage." },
  { skill: "Excel modelling", field: "Finance", test: "Build a 12-month revenue model with three scenarios." },
  { skill: "Clinical research", field: "Health", test: "Summarise five papers into evidence and gaps." },
  { skill: "UI design", field: "Design", test: "Design one mobile screen from a written brief." },
  { skill: "Field sales", field: "Business", test: "Pitch three real shops and log every objection." },
];

const FAQ = [
  { q: "Is Forge 360 only for engineering or business students?", a: "No. The Skill Vault covers law, design, medicine, commerce, media, arts and more. If you can execute it, it counts." },
  { q: "What is a 1-hour test?", a: "Every skill names one concrete task a person with that skill could finish in an hour. Your card says whether you can do it, and how much of that has been proven." },
  { q: "Why doesn't my card show my college or GPA?", a: "So you're judged on what you can do. Founders see your skills first. Your institute is revealed only after you both accept a match." },
  { q: "Who can see my email?", a: "Nobody, until a founder accepts your interest. Then the two of you see each other's contact — and no one else does." },
  { q: "Does it cost anything?", a: "No. Building a Skill Card and posting ideas are free." },
  { q: "Can I be a student and a founder?", a: "Yes. One account can hold both roles: build your card and post your own idea." },
];

export default function Landing() {
  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-navy-900 text-white">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(120%_80%_at_85%_10%,#2a56c6_0%,transparent_55%),linear-gradient(160deg,#1e3a8a_0%,#0d1b4b_55%,#111829_100%)]" />
        {/* Angled cut, from the kit */}
        <div className="absolute -right-24 top-0 -z-10 hidden h-full w-[52%] bg-gradient-to-br from-sky/25 to-sky/0 lg:block [clip-path:polygon(28%_0,100%_0,100%_100%,0_100%)]" />
        <Trail className="absolute -bottom-40 -left-40 -z-10 size-[640px] rotate-180 text-sky" />
        <div className="dots absolute left-[46%] top-16 -z-10 hidden h-28 w-40 text-sky/40 lg:block" aria-hidden />

        <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 pb-24 pt-14 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:pb-28 lg:pt-20">
          <div className="animate-rise">
            <span className="tag tag-sky">Skills × Ideas</span>
            <h1 className="mt-6 text-[2.75rem] font-extrabold leading-[0.95] tracking-tight sm:text-[4.25rem]">
              You have a skill.
              <br />
              Someone has an idea.
              <br />
              <span className="bg-gradient-to-r from-sky to-sky-300 bg-clip-text text-transparent">Forge it.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/75">
              Forge 360 connects any student, from any discipline, to any idea — and proves the skill in one hour.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/start?role=student" className="btn-sky">I have a skill <span aria-hidden>→</span></Link>
              <Link href="/start?role=founder" className="btn-light">I have an idea</Link>
            </div>
            <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-white/15 pt-6">
              {[["40+", "skills in the vault"], ["1 hr", "to prove a skill"], ["0", "GPA filters"]].map(([n, l]) => (
                <div key={l}>
                  <dt className="sr-only">{l}</dt>
                  <dd className="font-display text-3xl font-bold text-white">{n}</dd>
                  <dd className="mt-1 text-xs leading-snug text-white/60">{l}</dd>
                </div>
              ))}
            </dl>
          </div>
          <HeroVisual />
        </div>
      </section>

      {/* Disciplines marquee */}
      <section aria-label="Disciplines" className="overflow-hidden border-b border-line bg-white py-5">
        <div className="flex w-max animate-marquee gap-10 pr-10 motion-reduce:animate-none">
          {[...DISCIPLINES, ...DISCIPLINES].map((d, i) => (
            <span key={i} className="flex items-center gap-10 font-sub text-sm font-semibold uppercase tracking-[0.14em] text-muted" aria-hidden={i >= DISCIPLINES.length}>
              {d}
              <span className="size-1.5 rounded-full bg-sky" />
            </span>
          ))}
        </div>
      </section>

      {/* Problem */}
      <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <SectionTitle eyebrow="Why Forge 360">It&apos;s not about entrepreneurship. It&apos;s about why you learn skills.</SectionTitle>
          <div className="grid gap-5 sm:grid-cols-2">
            <article className="relative overflow-hidden rounded-2xl bg-white p-7 shadow-(--shadow-card)">
              <span className="font-display text-6xl font-extrabold leading-none text-sky-soft" aria-hidden>01</span>
              <h3 className="mt-2 text-xl font-bold text-charcoal">Skills with nowhere to go</h3>
              <p className="mt-3 leading-relaxed text-ink-soft">Students finish course after course with no real idea to apply it to. A skill that can&apos;t be leveraged is a skill wasted.</p>
            </article>
            <article className="relative overflow-hidden rounded-2xl bg-white p-7 shadow-(--shadow-card)">
              <span className="font-display text-6xl font-extrabold leading-none text-sky-soft" aria-hidden>02</span>
              <h3 className="mt-2 text-xl font-bold text-charcoal">Ideas stuck in one discipline</h3>
              <p className="mt-3 leading-relaxed text-ink-soft">Founders can&apos;t find execution-ready people outside their own branch. A health idea needs a lawyer, a designer and an editor too.</p>
            </article>
            <blockquote className="relative overflow-hidden rounded-2xl bg-navy p-7 text-white sm:col-span-2">
              <div className="absolute inset-y-0 right-0 w-1/3 bg-sky/20 [clip-path:polygon(40%_0,100%_0,100%_100%,0_100%)]" aria-hidden />
              <p className="relative max-w-lg font-display text-2xl font-bold leading-snug sm:text-[1.75rem]">&ldquo;Ideas shouldn&apos;t have boundaries of disciplines.&rdquo;</p>
              <p className="relative mt-3 text-sm text-white/70">Forge 360 is the connection between the initiative and the idea.</p>
            </blockquote>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="scroll-mt-20 border-y border-line bg-white py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionTitle eyebrow="How it works">Two sides. One link.</SectionTitle>
          <Journeys />
        </div>
      </section>

      {/* 1-hour tests */}
      <section className="relative isolate overflow-hidden bg-charcoal py-24 text-white">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(115deg,#111829_0%,#111829_55%,#1e3a8a_55%,#1e3a8a_100%)] opacity-90" />
        <div className="absolute -right-20 bottom-0 -z-10 h-2/3 w-1/2 bg-gradient-to-tl from-sky/40 to-transparent [clip-path:polygon(35%_0,100%_0,100%_100%,0_100%)]" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end">
            <SectionTitle eyebrow="The R-Resume" light>Not &ldquo;what degree do you have&rdquo;.</SectionTitle>
            <p className="max-w-md text-lg leading-relaxed text-white/75 lg:justify-self-end">
              Your Skill Card answers one question: <strong className="text-white">what can you execute within one hour of being handed a task?</strong>
            </p>
          </div>
          <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TESTS.map((t) => (
              <li key={t.skill} className="group rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur transition hover:-translate-y-1 hover:border-sky/50 hover:bg-white/[0.07]">
                <div className="flex items-center justify-between">
                  <span className="font-sub text-[11px] font-semibold uppercase tracking-[0.16em] text-sky">{t.field}</span>
                  <span className="rounded-md bg-white/10 px-2 py-0.5 font-sub text-[11px] font-semibold text-white/80">1 HR</span>
                </div>
                <h3 className="mt-4 text-xl font-bold">{t.skill}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">{t.test}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Trust */}
      <section id="trust" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-24 sm:px-6">
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <SectionTitle eyebrow="Trust, not claims">Every skill shows how much it&apos;s been proven.</SectionTitle>
            <p className="mt-6 max-w-md leading-relaxed text-ink-soft">
              Anyone can type &ldquo;Excel&rdquo; on a resume. On Forge 360 each skill carries a tier, so founders know exactly what&apos;s self-declared and what&apos;s been checked.
            </p>
          </div>
          <ol className="relative space-y-4">
            <span className="absolute bottom-8 left-[27px] top-8 w-[3px] rounded bg-gradient-to-b from-tier-t0/40 via-sky to-navy" aria-hidden />
            {[
              { tier: "T0" as const, title: "Claimed", body: "Answered the Skill Vault questions. Free and instant." },
              { tier: "T1" as const, title: "Evidence found", body: "Proof links checked — GitHub, Behance, a portfolio, YouTube." },
              { tier: "T2" as const, title: "Verified", body: "Passed a one-hour micro-task reviewed by a mentor, or referred by a verified founder." },
            ].map((s, i) => (
              <li key={s.tier} className="relative flex gap-5 rounded-2xl border border-line bg-white p-5 shadow-(--shadow-card)">
                <span className={`relative z-10 flex size-14 shrink-0 items-center justify-center rounded-xl font-display text-lg font-bold ${["bg-tier-t0-bg text-tier-t0", "bg-sky-soft text-navy", "bg-navy text-white"][i]}`}>
                  {s.tier}
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-bold text-charcoal">{s.title}</h3>
                    <TierBadge tier={s.tier} />
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-ink-soft">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Bias control */}
      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-soft via-white to-white p-8 ring-1 ring-line sm:p-12">
          <div className="dots absolute right-8 top-8 h-24 w-32 text-sky/50" aria-hidden />
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <span className="tag">No bias</span>
              <h2 className="mt-5 text-3xl font-bold leading-tight text-charcoal sm:text-4xl">No GPA. No college name. Until it matters.</h2>
              <p className="mt-4 max-w-md leading-relaxed text-ink-soft">
                Founders meet your skills first. Your institute, email and contact stay hidden until you both accept the match.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl border border-line bg-white p-4">
                <p className="eyebrow !text-[10px]">Before a match</p>
                <ul className="mt-3 space-y-2 text-ink-soft">
                  <li className="flex gap-2"><Check /> Skills &amp; tiers</li>
                  <li className="flex gap-2"><Check /> 1-hour tests</li>
                  <li className="flex gap-2"><Check /> Evidence links</li>
                  <li className="flex gap-2 text-muted line-through"><Cross /> Institute</li>
                  <li className="flex gap-2 text-muted line-through"><Cross /> Email</li>
                </ul>
              </div>
              <div className="rounded-xl bg-navy p-4 text-white">
                <p className="font-sub text-[10px] font-semibold uppercase tracking-[0.18em] text-sky">After both accept</p>
                <ul className="mt-3 space-y-2 text-white/85">
                  <li className="flex gap-2"><Check light /> Everything before</li>
                  <li className="flex gap-2"><Check light /> Institute</li>
                  <li className="flex gap-2"><Check light /> Email contact</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-20 border-t border-line bg-white py-24">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionTitle eyebrow="FAQ">Questions, answered.</SectionTitle>
          <div className="divide-y divide-line border-y border-line">
            {FAQ.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-sub font-semibold text-charcoal [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-line text-navy transition group-open:rotate-45 group-open:border-navy group-open:bg-navy group-open:text-white" aria-hidden>+</span>
                </summary>
                <p className="mt-3 max-w-xl leading-relaxed text-ink-soft">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative isolate overflow-hidden bg-navy">
        <div className="absolute inset-y-0 right-0 -z-10 hidden w-[52%] bg-gradient-to-br from-sky to-[#2b8fe0] sm:block [clip-path:polygon(8%_0,100%_0,100%_100%,0_100%)]" />
        <Trail className="absolute -right-24 -top-24 -z-10 size-[420px] text-white" />
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:grid-cols-2 sm:items-center sm:px-6 sm:py-20">
          <div className="text-white">
            <h2 className="text-3xl font-bold leading-tight sm:text-[2.5rem]">{SITE.agenda}</h2>
          </div>
          <div className="flex flex-col gap-3 sm:items-end">
            <Link href="/start?role=student" className="btn-primary !bg-charcoal hover:!bg-black">Build my Skill Card <span aria-hidden>→</span></Link>
            <Link href="/start?role=founder" className="btn-ghost !border-charcoal !bg-white/90 !text-charcoal">Post an idea</Link>
          </div>
        </div>
      </section>
    </>
  );
}

function Check({ light = false }: { light?: boolean }) {
  return (
    <svg viewBox="0 0 20 20" className={`mt-0.5 size-4 shrink-0 ${light ? "text-sky" : "text-tier-t2"}`} aria-hidden>
      <path d="M5 10.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Cross() {
  return (
    <svg viewBox="0 0 20 20" className="mt-0.5 size-4 shrink-0 text-muted" aria-hidden>
      <path d="M6 6l8 8M14 6l-8 8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

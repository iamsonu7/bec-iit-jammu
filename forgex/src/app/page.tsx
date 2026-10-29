import Link from "next/link";
import { TierBadge } from "@/components/tier-badge";

const STEPS = [
  { n: "1", title: "Pick your skills", body: "Choose from the Skill Vault. Answer 3–4 precise questions per skill. Under 90 seconds each." },
  { n: "2", title: "Get your Skill Card", body: "A resume replacement that shows what you can ship in one hour. No GPA, no college name, no bias." },
  { n: "3", title: "Forge it with an idea", body: "Browse ideas that need your exact skills. Express interest; founders accept and you connect." },
];

export default function Landing() {
  return (
    <>
      <section className="mx-auto max-w-5xl px-4 pb-16 pt-14 sm:pt-24">
        <p className="mb-5 inline-flex rounded-full bg-ember-soft px-3 py-1 text-xs font-semibold text-ember-dark">
          Stop learning skills for nothing. Put them on a real idea.
        </p>
        <h1 className="max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
          You have a skill. Someone has an idea. <span className="text-ember">Forge it.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-ink-soft">
          ForgeX connects any student, from any discipline, to any idea — and proves the skill in one hour.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/start?role=founder" className="btn-primary text-base">I have an idea</Link>
          <Link href="/start?role=student" className="btn-ghost text-base">I have a skill</Link>
        </div>
      </section>

      <section className="border-y border-line bg-card">
        <div className="mx-auto grid max-w-5xl gap-6 px-4 py-14 sm:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n}>
              <span className="flex size-9 items-center justify-center rounded-full bg-ink text-sm font-bold text-white">{s.n}</span>
              <h2 className="mt-4 text-lg font-semibold">{s.title}</h2>
              <p className="mt-2 text-ink-soft">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-10 px-4 py-16 sm:grid-cols-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Not &ldquo;what degree do you have&rdquo;.</h2>
          <p className="mt-3 text-ink-soft">
            Your Skill Card answers one question: <strong className="text-ink">what can you execute within one hour of being handed a task?</strong>{" "}
            Law, design, commerce, medicine, engineering, arts — every skill counts, and every claim shows how much it&apos;s been proven.
          </p>
          <Link href="/demo" className="mt-5 inline-block font-semibold text-ember-dark underline-offset-4 hover:underline">
            See a sample Skill Card →
          </Link>
        </div>
        <ul className="panel space-y-4">
          <li className="flex items-start gap-3">
            <TierBadge tier="T0" />
            <span className="text-sm text-ink-soft">Self-declared through the Skill Vault questions.</span>
          </li>
          <li className="flex items-start gap-3">
            <TierBadge tier="T1" />
            <span className="text-sm text-ink-soft">Proof links checked: GitHub, Behance, portfolio, YouTube.</span>
          </li>
          <li className="flex items-start gap-3">
            <TierBadge tier="T2" />
            <span className="text-sm text-ink-soft">A one-hour micro-task reviewed by a BEC mentor, or a referral from a verified founder.</span>
          </li>
        </ul>
      </section>
    </>
  );
}

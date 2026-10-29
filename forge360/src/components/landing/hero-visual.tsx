import { TierBadge } from "@/components/tier-badge";

/** Product preview in the hero: a Skill Card, an idea that needs it, and the match between them. */
export function HeroVisual() {
  return (
    <div className="relative mx-auto mb-16 w-full max-w-[460px] animate-rise [animation-delay:150ms] lg:mx-0 lg:justify-self-end" aria-hidden>
      {/* Idea card, behind */}
      <div className="absolute -top-6 right-0 w-[78%] rotate-[4deg] rounded-2xl bg-white/95 p-5 text-charcoal shadow-(--shadow-lift)">
        <div className="flex items-center justify-between">
          <span className="font-sub text-[10px] font-semibold uppercase tracking-[0.18em] text-navy">Idea · Health</span>
          <span className="rounded-md bg-sky-soft px-2 py-0.5 font-sub text-[10px] font-semibold text-navy">EQUITY</span>
        </div>
        <p className="mt-2 font-display text-lg font-bold leading-tight">Vernacular reels that explain prescriptions</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-navy px-2.5 py-1 text-[11px] font-medium text-white">Video editing</span>
          <span className="rounded-full bg-navy px-2.5 py-1 text-[11px] font-medium text-white">Clinical research</span>
          <span className="rounded-full border border-line px-2.5 py-1 text-[11px] font-medium text-ink-soft">Copywriting</span>
        </div>
      </div>

      {/* Skill Card, front */}
      <div className="relative mt-32 -rotate-[2deg] overflow-hidden rounded-2xl bg-white text-charcoal shadow-(--shadow-lift) ring-1 ring-white/30 sm:mt-36">
        <div className="relative overflow-hidden bg-gradient-to-br from-sky to-[#2f86e6] px-5 py-5 text-charcoal">
          <div className="absolute inset-y-0 right-0 w-2/5 bg-navy/25 [clip-path:polygon(45%_0,100%_0,100%_100%,0_100%)]" />
          <p className="relative font-sub text-[10px] font-semibold uppercase tracking-[0.2em] text-navy">Skill Card</p>
          <p className="relative mt-1 font-display text-2xl font-bold">Aarav Sharma</p>
          <p className="relative text-sm text-charcoal/75">&ldquo;I can ship a launch reel in an afternoon.&rdquo;</p>
        </div>
        <ul className="divide-y divide-line px-5">
          {[
            { name: "Video editing", tier: "T2" as const, test: "60-sec reel from raw footage" },
            { name: "Legal drafting", tier: "T1" as const, test: "2-page contributor agreement" },
            { name: "Excel modelling", tier: "T0" as const, test: "12-month revenue model" },
          ].map((s) => (
            <li key={s.name} className="py-3">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold">{s.name}</span>
                <TierBadge tier={s.tier} compact />
              </div>
              <p className="mt-0.5 text-xs text-muted">1-hr test: {s.test}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Match pill */}
      <div className="absolute -bottom-[4.75rem] left-6 flex items-center gap-3 rounded-xl bg-charcoal px-4 py-3 text-white shadow-(--shadow-lift) sm:-left-8">
        <span className="relative flex size-10 items-center justify-center rounded-full bg-sky font-display text-sm font-bold text-charcoal">
          <span className="absolute inset-0 animate-ping rounded-full bg-sky/40 motion-reduce:hidden" />
          <span className="relative">83%</span>
        </span>
        <span className="text-xs leading-tight">
          <span className="block font-semibold">Strong match</span>
          <span className="text-white/60">2 of 2 must-haves</span>
        </span>
      </div>
    </div>
  );
}

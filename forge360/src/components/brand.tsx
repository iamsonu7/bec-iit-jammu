/** Forge 360 brand pieces: logo, and the kit's angled-cut, curved-trail and dot textures. */

export function LogoMark({ className = "size-8", dark = false }: { className?: string; dark?: boolean }) {
  const ring = dark ? "#ffffff" : "#1e3a8a";
  // A 360° orbit: navy ring, sky segment where it "forges" forward, and the spark at its tip.
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <circle cx="20" cy="20" r="14" fill="none" stroke={ring} strokeWidth="6" strokeDasharray="62 88" strokeDashoffset="-14" strokeLinecap="butt" transform="rotate(-90 20 20)" />
      <circle cx="20" cy="20" r="14" fill="none" stroke="#4db6ff" strokeWidth="6" strokeDasharray="18 88" strokeDashoffset="-78" transform="rotate(-90 20 20)" />
      <circle cx="31.5" cy="9.5" r="3.6" fill="#4db6ff" />
      <path d="M15 14h11v4h-7v2.5h5.5v4H19V27h-4z" fill={ring} />
    </svg>
  );
}

export function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2">
      <LogoMark dark={dark} />
      <span className={`font-display text-[22px] font-bold leading-none tracking-tight ${dark ? "text-white" : "text-navy"}`}>
        FORGE<span className="ml-1 text-sky">360</span>
      </span>
    </span>
  );
}

/** Large decorative sweep of arcs, as in the kit's "curved trail" pattern. */
export function Trail({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 600 600" className={`pointer-events-none ${className}`} aria-hidden fill="none">
      <circle cx="600" cy="600" r="420" stroke="currentColor" strokeOpacity=".18" strokeWidth="1.5" />
      <circle cx="600" cy="600" r="330" stroke="currentColor" strokeOpacity=".28" strokeWidth="1.5" />
      <circle cx="600" cy="600" r="240" stroke="currentColor" strokeOpacity=".4" strokeWidth="1.5" strokeDasharray="2 10" />
    </svg>
  );
}

/** Brand kit "Section title": text, rule, three dots. */
export function SectionTitle({ eyebrow, children, light = false }: { eyebrow?: string; children: React.ReactNode; light?: boolean }) {
  return (
    <div>
      {eyebrow && <p className={`eyebrow ${light ? "!text-sky" : ""}`}>{eyebrow}</p>}
      <h2 className={`mt-3 text-[2rem] font-bold leading-[1.05] sm:text-[2.75rem] ${light ? "text-white" : "text-charcoal"}`}>{children}</h2>
      <div className="mt-5 flex items-center gap-1.5" aria-hidden>
        <span className={`h-[3px] w-14 ${light ? "bg-sky" : "bg-navy"}`} />
        <span className="size-1.5 rounded-full bg-sky" />
        <span className="size-1.5 rounded-full bg-sky" />
        <span className="size-1.5 rounded-full bg-sky" />
      </div>
    </div>
  );
}

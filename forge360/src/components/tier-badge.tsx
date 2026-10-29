import { TIER_LABEL, type Tier } from "@/lib/types";

const STYLE: Record<Tier, string> = {
  T0: "bg-tier-t0-bg text-tier-t0",
  T1: "bg-tier-t1-bg text-tier-t1",
  T2: "bg-tier-t2-bg text-tier-t2",
};

const ICON: Record<Tier, React.ReactNode> = {
  T0: <circle cx="8" cy="8" r="3" fill="currentColor" />,
  T1: <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />,
  T2: <path d="M8 1.5l1.9 1.4 2.3-.1.7 2.2 1.9 1.4-.8 2.2.8 2.2-1.9 1.4-.7 2.2-2.3-.1L8 15.6l-1.9-1.4-2.3.1-.7-2.2-1.9-1.4.8-2.2-.8-2.2 1.9-1.4.7-2.2 2.3.1z" fill="currentColor" />,
};

export function TierBadge({ tier, compact = false }: { tier: Tier; compact?: boolean }) {
  return (
    <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-0.5 font-sub text-[11px] font-semibold ${STYLE[tier]}`}>
      <svg viewBox="0 0 16 16" className="size-3" aria-hidden>{ICON[tier]}</svg>
      {TIER_LABEL[tier]}
      {!compact && <span className="opacity-60">· {tier}</span>}
    </span>
  );
}

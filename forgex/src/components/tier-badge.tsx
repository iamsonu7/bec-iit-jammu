import { TIER_LABEL, type Tier } from "@/lib/types";

const STYLE: Record<Tier, string> = {
  T0: "bg-tier-t0-bg text-tier-t0",
  T1: "bg-tier-t1-bg text-tier-t1",
  T2: "bg-tier-t2-bg text-tier-t2",
};

export function TierBadge({ tier }: { tier: Tier }) {
  return (
    <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${STYLE[tier]}`}>
      <span aria-hidden className="size-1.5 rounded-full bg-current" />
      {TIER_LABEL[tier]} <span className="opacity-60">({tier})</span>
    </span>
  );
}

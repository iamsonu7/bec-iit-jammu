import { ImageResponse } from "next/og";
import { loadCard } from "@/lib/card";
import { TIER_LABEL } from "@/lib/types";

export const alt = "ForgeX Skill Card";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const TIER_COLOR = { T0: "#6b7280", T1: "#1d4ed8", T2: "#15803d" } as const;

export default async function Image({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const data = await loadCard(handle);
  const name = data?.card.name ?? handle;
  const skills = (data?.skills ?? []).slice(0, 4);

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#1b1712", color: "#fff", padding: 72 }}>
        <div style={{ display: "flex", fontSize: 28, color: "rgba(255,255,255,0.6)", letterSpacing: 4 }}>SKILL CARD · FORGE<span style={{ color: "#e8590c" }}>X</span></div>
        <div style={{ display: "flex", fontSize: 72, fontWeight: 700, marginTop: 24 }}>{name}</div>
        {data?.card.headline && <div style={{ display: "flex", fontSize: 32, color: "rgba(255,255,255,0.8)", marginTop: 12 }}>“{data.card.headline}”</div>}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: "auto" }}>
          {skills.map((s) => (
            <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 34 }}>
              <span>{s.skills.name}</span>
              <span style={{ fontSize: 24, background: "#fff", color: TIER_COLOR[s.tier], borderRadius: 999, padding: "4px 16px" }}>{TIER_LABEL[s.tier]}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}

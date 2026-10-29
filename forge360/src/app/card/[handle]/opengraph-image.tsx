import { ImageResponse } from "next/og";
import { loadCard } from "@/lib/card";
import { TIER_LABEL } from "@/lib/types";

export const alt = "Forge 360 Skill Card";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const TIER_STYLE = {
  T0: { bg: "#eef1f5", fg: "#55607a" },
  T1: { bg: "#e0f0ff", fg: "#155fb8" },
  T2: { bg: "#dcf5e7", fg: "#0f7a43" },
} as const;

export default async function Image({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const data = await loadCard(handle);
  const name = data?.card.name ?? handle;
  const skills = (data?.skills ?? []).slice(0, 4);

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: "linear-gradient(150deg, #1e3a8a 0%, #0d1b4b 65%, #111829 100%)", color: "#fff" }}>
        <div style={{ position: "absolute", right: 0, top: 0, width: 520, height: 630, background: "linear-gradient(200deg, rgba(77,182,255,0.55), rgba(77,182,255,0.05))", clipPath: "polygon(40% 0, 100% 0, 100% 100%, 0 100%)" }} />
        <div style={{ display: "flex", flexDirection: "column", padding: 72, width: "100%" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, letterSpacing: 6 }}>
            <span style={{ color: "#4db6ff" }}>SKILL CARD</span>
            <span style={{ fontWeight: 700 }}>FORGE<span style={{ color: "#4db6ff", marginLeft: 6 }}>360</span></span>
          </div>
          <div style={{ display: "flex", fontSize: 84, fontWeight: 700, marginTop: 36, lineHeight: 1 }}>{name}</div>
          {data?.card.headline && <div style={{ display: "flex", fontSize: 32, color: "rgba(255,255,255,0.82)", marginTop: 18, maxWidth: 760 }}>“{data.card.headline}”</div>}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: "auto" }}>
            {skills.map((s) => (
              <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 14, background: "#fff", color: "#111829", borderRadius: 14, padding: "14px 20px", fontSize: 28 }}>
                <span style={{ fontWeight: 600 }}>{s.skills.name}</span>
                <span style={{ fontSize: 20, background: TIER_STYLE[s.tier].bg, color: TIER_STYLE[s.tier].fg, borderRadius: 999, padding: "4px 12px" }}>{TIER_LABEL[s.tier]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    size,
  );
}

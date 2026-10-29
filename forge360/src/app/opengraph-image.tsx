import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

export const alt = SITE.tagline;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: "linear-gradient(150deg, #1e3a8a 0%, #0d1b4b 65%, #111829 100%)", color: "#fff" }}>
        <div style={{ position: "absolute", right: 0, top: 0, width: 560, height: 630, background: "linear-gradient(200deg, rgba(77,182,255,0.6), rgba(77,182,255,0.05))", clipPath: "polygon(40% 0, 100% 0, 100% 100%, 0 100%)" }} />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: 80 }}>
          <div style={{ display: "flex", fontSize: 34, fontWeight: 700, letterSpacing: 2 }}>FORGE<span style={{ color: "#4db6ff", marginLeft: 8 }}>360</span></div>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 76, fontWeight: 800, lineHeight: 1.02, marginTop: 40 }}>
            <span>You have a skill.</span>
            <span>Someone has an idea.</span>
            <span style={{ color: "#4db6ff" }}>Forge it.</span>
          </div>
        </div>
      </div>
    ),
    size,
  );
}

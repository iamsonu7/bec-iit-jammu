"use client";

import { useState } from "react";

export function ShareButton({ url, text }: { url: string; text: string }) {
  const [copied, setCopied] = useState(false);
  async function share() {
    if (navigator.share) {
      try {
        await navigator.share({ url, text });
        return;
      } catch {
        // cancelled; fall through to copy
      }
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <button type="button" className="btn-primary" onClick={share}>
      {copied ? "Link copied" : "Share card"}
    </button>
  );
}

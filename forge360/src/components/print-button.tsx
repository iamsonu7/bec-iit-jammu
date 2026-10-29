"use client";

export function PrintButton() {
  return (
    <button type="button" className="btn-ghost" onClick={() => window.print()}>
      Export PDF
    </button>
  );
}

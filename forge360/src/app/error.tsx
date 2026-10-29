"use client";

import Link from "next/link";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-xl px-4 py-28 text-center">
      <p className="eyebrow">Something broke</p>
      <h1 className="mt-3 text-3xl font-bold text-charcoal">That didn&apos;t load</h1>
      <p className="mt-3 text-ink-soft">It&apos;s on our side, not yours. Try again in a moment.</p>
      <div className="mt-8 flex justify-center gap-3">
        <button onClick={reset} className="btn-primary">Try again</button>
        <Link href="/" className="btn-ghost">Back home</Link>
      </div>
    </div>
  );
}

import Link from "next/link";
import { Trail } from "@/components/brand";

export default function NotFound() {
  return (
    <section className="relative isolate overflow-hidden">
      <Trail className="absolute -right-40 -top-40 -z-10 size-[560px] text-navy" />
      <div className="mx-auto max-w-xl px-4 py-28 text-center">
        <p className="font-display text-[7rem] font-extrabold leading-none text-sky">404</p>
        <h1 className="mt-2 text-3xl font-bold text-charcoal">Nothing forged here yet</h1>
        <p className="mt-3 text-ink-soft">That page, card or idea doesn&apos;t exist — or it isn&apos;t public.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/" className="btn-primary">Back home</Link>
          <Link href="/demo" className="btn-ghost">See a sample card</Link>
        </div>
      </div>
    </section>
  );
}

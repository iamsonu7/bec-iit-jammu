import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <h1 className="text-3xl font-bold">Not found</h1>
      <p className="mt-2 text-ink-soft">That page, card or idea doesn&apos;t exist (or isn&apos;t public).</p>
      <Link href="/" className="btn-primary mt-6">Back to ForgeX</Link>
    </div>
  );
}

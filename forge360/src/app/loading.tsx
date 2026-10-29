export default function Loading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center" role="status" aria-label="Loading">
      <span className="size-10 animate-spin rounded-full border-4 border-sky-soft border-t-navy" />
    </div>
  );
}

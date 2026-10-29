import { Trail } from "./brand";

/** Navy band with the kit's angled cut, used at the top of inner pages. */
export function PageHeader({
  eyebrow,
  title,
  children,
  actions,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  children?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-navy-900 text-white">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(160deg,#1e3a8a_0%,#0d1b4b_70%,#111829_100%)]" />
      <div className="absolute inset-y-0 right-0 -z-10 w-1/2 bg-gradient-to-bl from-sky/30 to-transparent [clip-path:polygon(35%_0,100%_0,100%_100%,0_100%)]" />
      <Trail className="absolute -right-48 -top-64 -z-10 size-[560px] text-sky" />
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 pb-12 pt-10 sm:px-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          {eyebrow && <p className="font-sub text-xs font-semibold uppercase tracking-[0.18em] text-sky">{eyebrow}</p>}
          <h1 className="mt-2 text-[2.25rem] font-bold leading-[1.02] sm:text-5xl">{title}</h1>
          {children && <div className="mt-3 text-white/75">{children}</div>}
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
    </section>
  );
}
